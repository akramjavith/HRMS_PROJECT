import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PageHeading from "../../components/PageHeading";
import {
    Box, InputAdornment,
    Button,
    Checkbox,
    TextareaAutosize,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select,
    Table,
    TableBody,
    TableHead,
    TextField,
    Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import AssetDetails from "./assetmaterialpopup";
import Stockmaster from "./stockmaterialpopup";
import AlertDialog from "../../components/Alert";
import { PleaseSelectRow } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";

function StockManagement() {
    const [stock, setStock] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);


    const statusOpt = [
        { label: "Employee", value: "Employee" },
        { label: "Location", value: "Location" },

    ];


    const {
        isUserRoleCompare,
        isAssignBranch, pageName, setPageName,
        isUserRoleAccess,
        buttonStyles,
        allCompany,
        allBranch,
        allUnit,
        allTeam,
    } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    let exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Location",
        "Material",
        "Request Mode For",
        // "Quantity&EOM",
        "Purchase Count",
        "Used Count",
        "Balanced Count",
        "Handover Count",
        "Return Count",
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "location",
        "productname",
        "requestmode",
        // "uomnew",
        "purchasecount",
        "usedcount",
        "balancedcount",
        "handovercount",
        "returncount",
    ];





    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Stock Management"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi();
    }, []);

    const accessbranch = isAssignBranch
        ?.filter((data) => {
            let fetfinalurl = [];
            // Check if user is a Manager, in which case return all branches
            if (isUserRoleAccess?.role?.includes("Manager")) {
                return true; // Skip filtering, return all data for Manager
            }
            if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 &&
                data?.subpagenameurl?.length !== 0 &&
                data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
            ) {
                fetfinalurl = data.subsubpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 &&
                data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
            ) {
                fetfinalurl = data.subpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
            ) {
                fetfinalurl = data.mainpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
            ) {
                fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
                fetfinalurl = data.modulenameurl;
            } else {
                fetfinalurl = [];
            }


            // Check if the pathname exists in the URL
            return fetfinalurl?.includes(window.location.pathname);
        })
        ?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }));

    const requestModeOptions = [
        { label: "Asset Material", value: "Asset Material" },
        { label: "Stock Material", value: "Stock Material" },
    ];

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [stockManage, setStockManage] = useState({
        requestmode: "Stock Material",
        companyto: "Please Select Company",
    });
    const [stockManagehand, setStockManagehand] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        productname: "Please Select Material",
        type: "Location",
        usagedate: "",
        usagetime: "",
        employeenameto: "Please Select Employee",
        countquantity: "",
        team: "Please Select Team",
    });
    const [handover, setHandover] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        area: "",
        location: "",
        productname: "",
    });
    const [openView, setOpenView] = useState(false);

    const [openViewasset, setOpenViewAsset] = useState(false);

    const [todoscheck, setTodoscheck] = useState([]);
    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [editedDeveloper, setEditedDeveloper] = useState("");
    const [editedReturnName, seteditedReturnName] = useState("");
    const [selectedCompanyedit, setSelectedCompanyedit] = useState("");
    const [valuecateedit, setvaluecateedit] = useState([]);
    const [empcodeedit, setempcodeedit] = useState("");
    const [highestemp, sethighestemp] = useState("");
    const [selectedoptionscateedit, setSelectedOptionsCateedit] = useState([]);

    const handleViewOpen = () => {
        setOpenView(true);
    };
    const handlViewClose = () => {
        setOpenView(false);
    };

    const handleViewOpenAsset = () => {
        setOpenViewAsset(true);
    };
    const handlViewCloseAsset = () => {
        setOpenViewAsset(false);
    };

    const [companys, setCompanys] = useState([]);
    const [branchs, setBranchs] = useState([]);
    const [units, setUnits] = useState([]);
    const [floors, setFloors] = useState([]);
    const [areas, setAreas] = useState([]);
    const [locations, setLocations] = useState([]);
    const [teamoption, setTeamOption] = useState([]);

    const [companysto, setCompanysto] = useState([]);
    const [branchsto, setBranchsto] = useState([]);
    const [unitsto, setUnitsto] = useState([]);
    const [employeesall, setEmployeesall] = useState([]);

    const [selectedBranchTo, setSelectedBranchTo] = useState([]);
    const [selectedUnitTo, setSelectedUnitTo] = useState([]);
    const [quantityedit, setQuantityedit] = useState([]);

    const [selectedBranchToEdit, setSelectedBranchToEdit] = useState([]);
    const [selectedUnitToEdit, setSelectedUnitToEdit] = useState([]);
    const [selectedEmployeeToEdit, setSelectedEmployeeToEdit] = useState([]);

    const handleChangephonenumberEdit = (e, oldqty) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/; // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;

        const inputValue = e.target.value;

        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value

            setQuantityedit(inputValue);
        }
    };

    //branchto multiselect dropdown changes
    const handleBranchChangeTo = (options) => {
        setSelectedBranchTo(options);
        setSelectedUnitTo([]);
    };
    const customValueRendererBranchTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    //unitto multiselect dropdown changes
    const handleUnitChangeTo = (options) => {
        setSelectedUnitTo(options);
    };
    const customValueRendererUnitTo = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };

    //branchto multiselect dropdown changes
    const handleBranchChangeToEdit = (options) => {
        setSelectedBranchToEdit(options);
        setSelectedUnitToEdit([]);

        setSelectedEmployeeToEdit([]);
    };
    const customValueRendererBranchToEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    //unitto multiselect dropdown changes
    const handleUnitChangeToEdit = (options) => {
        setSelectedUnitToEdit(options);
        setSelectedEmployeeToEdit([]);
    };
    const customValueRendererUnitToEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };

    //employee multiselect dropdown changes
    const handleEmployeeChangeToEdit = (options) => {
        setSelectedEmployeeToEdit(options);
    };
    const customValueRendererEmployeeToEdit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select To Employee Name";
    };


    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteAssetType, setDeleteAssetType] = useState({});
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);


    //alert model for vendor details
    const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
    // view model
    const handleClickOpenviewalertvendor = () => {
        setOpenviewalertvendro(true);
    };

    const handleCloseviewalertvendor = () => {
        setOpenviewalertvendro(false);
    };

    //alert model for vendor details
    const [openviewalertvendorstock, setOpenviewalertvendrostock] =
        useState(false);
    // view model
    const handleClickOpenviewalertvendorstock = () => {
        setOpenviewalertvendrostock(true);
    };

    const handleCloseviewalertvendorstock = () => {
        setOpenviewalertvendrostock(false);
    };

    const [projectCheck, setProjectCheck] = useState(false);
    //get all project.
    const fetchStock = async () => {
        setPageName(!pageName)
        try {
            setProjectCheck(true);

            if (stockManage.requestmode === "Asset Material") {
                let res_project = await axios.post(SERVICE.STOCKPURCHASELIMITED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assetmat: "Asset Material",
                    companyto: stockManage.companyto,
                    branchto: selectedBranchTo.map((item) => item.value),
                    unitto: selectedUnitTo.map((item) => item.value),
                });

                let res_hand = await axios.get(SERVICE.STOCKPURCHASELIMITED_HAND, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let res_return = await axios.get(SERVICE.STOCKPURCHASELIMITED_RETURN, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let single = res_project?.data?.stock;
                let singlehand = res_hand.data?.stock;
                let singlereturn = res_return.data?.stock;

                let singlehandtotal = singlehand.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);

                let singlereturntotal = singlereturn.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);

                let res = await axios.get(SERVICE.ASSETDETAIL_STOCK_LIMITED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let assettotal = res?.data?.assetdetails;

                let getassettotal = assettotal.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.material === current.material
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                        existingItem._id = current._id;
                        // existingItem.material = current.material;
                        // existingItem.assettype = current.assettype;
                        // existingItem.asset = current.asset;
                        // existingItem.component = current.component;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            material: current.material,
                            // assettype: current.assettype,
                            // asset: current.asset,
                            // component: current.component,
                            countquantity: Number(current.countquantity),
                        });
                    }
                    return acc;
                }, []);

                let getfilter = single.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.productname === current.productname
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];
                        existingItem.purchasecount += Number(current.quantity);
                        existingItem._id = current._id;
                        existingItem.requestmode = current.requestmode;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            assettype: current.assettype,
                            asset: current.asset,
                            component: current.component,
                            productname: current.productname,
                            requestmode: current.requestmode,
                            purchasecount: current.quantity,
                        });
                    }
                    return acc;
                }, []);

                let merge = getfilter.map((item) => {
                    let matchItems = getassettotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.material
                    );

                    let findquantity = singlehandtotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.productname
                    );

                    let findreturnquantity = singlereturntotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.productname === d.productname
                    );

                    let matchHandItems =
                        singlehandtotal.length > 0
                            ? findquantity
                                ? findquantity.countquantity
                                : 0
                            : 0;
                    let matchReturnItems =
                        singlereturntotal.length > 0
                            ? findreturnquantity
                                ? findreturnquantity.countquantity
                                : 0
                            : 0;

                    if (matchItems || matchHandItems || matchReturnItems) {
                        return {
                            ...item,
                            purchasecount: Number(item.purchasecount),
                            usedcount:
                                Number(matchItems ? matchItems.countquantity : 0) +
                                Number(matchHandItems) -
                                Number(matchReturnItems),
                            balancedcount:
                                Number(item.purchasecount) -
                                (Number(matchItems ? matchItems.countquantity : 0) +
                                    Number(matchHandItems) -
                                    Number(matchReturnItems)),
                            handovercount: Number(matchHandItems) - Number(matchReturnItems),
                            returncount: Number(matchReturnItems),
                        };
                    } else {
                        return {
                            ...item,
                            usedcount: 0,
                            handovercount: 0,
                            returncount: 0,
                            balancedcount: Number(item.purchasecount) - 0,
                        };
                    }
                });

                setStock(merge);
            }

            else if (stockManage.requestmode === "Stock Material") {
                let res_project = await axios.post(SERVICE.STOCKPURCHASELIMITED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assetmat: "Stock Material",
                    companyto: stockManage.companyto,
                    branchto: selectedBranchTo.map((item) => item.value),
                    unitto: selectedUnitTo.map((item) => item.value),
                });
                let single = res_project?.data?.stock;

                let res = await axios.get(SERVICE.STOCKPURCHASE_TRANSFER_LIMITED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let stocktotal = res?.data?.stock;
                const resultstock = [];
                stocktotal.forEach((item) => {
                    item.stockmaterialarray.forEach((subItem) => {
                        resultstock.push({
                            uomnew: subItem.uomnew,
                            materialnew: subItem.materialnew,
                            quantitynew: subItem.quantitynew,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            floor: item.floor,
                            area: item.area,
                            location: item.location,
                        });
                    });
                });

                let getstocktotal = resultstock.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.materialnew === current.materialnew
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.quantitynew += Number(current.quantitynew);
                        existingItem._id = current._id;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            materialnew: current.materialnew,
                            quantitynew: Number(current.quantitynew),
                        });
                    }
                    return acc;
                }, []);
                console.log(getstocktotal, "getstocktotal")


                let result = single.flatMap((item) => {
                    // let quantityAndUom = item.stockmaterialarray.map((data, newindex) => {
                    //     return ` ${data.quantitynew}#${data.uomcodenew}`
                    // })

                    return item.stockmaterialarray.map((subItem) => ({
                        _id: subItem._id,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        requestmode: item.requestmode,
                        materialnew: subItem.materialnew,
                        quantitynew: subItem.quantitynew,

                        uomcodenew: subItem.uomcodenew,
                    }));
                });

                let getfilter = result.reduce((acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) =>
                            item.company === current.company &&
                            item.branch === current.branch &&
                            item.unit === current.unit &&
                            item.floor === current.floor &&
                            item.area === current.area &&
                            item.location === current.location &&
                            item.materialnew === current.materialnew
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.purchasecountstock += Number(current.quantitynew);
                        existingItem._id = current._id;
                        existingItem.requestmode = current.requestmode;
                        existingItem.productname = current.materialnew;
                        existingItem.materialnew = current.materialnew;
                        existingItem.uomcodenew = current.uomcodenew;
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            _id: current._id,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            productname: current.materialnew,
                            materialnew: current.materialnew,
                            requestmode: current.requestmode,
                            uomcodenew: current.uomcodenew,
                            purchasecount: Number(current.quantitynew),
                            purchasecountstock: Number(current.quantitynew),
                        });
                    }
                    return acc;
                }, []);

                let merge = getfilter.map((item) => {
                    let matchItems = getstocktotal.find(
                        (d) =>
                            item.company === d.company &&
                            item.branch === d.branch &&
                            item.unit === d.unit &&
                            item.floor === d.floor &&
                            item.area === d.area &&
                            item.location === d.location &&
                            item.materialnew === d.materialnew
                    );

                    if (matchItems) {
                        return {
                            ...item,
                            purchasecountstock: Number(item.purchasecountstock),
                            usedcount: Number(matchItems.quantitynew),
                            balancedcount:
                                Number(item.purchasecountstock) -
                                Number(matchItems.quantitynew),
                        };
                    } else {
                        return {
                            ...item,
                            usedcount: 0,
                            balancedcount: Number(item.purchasecountstock) - 0,
                        };
                    }
                });
                let quantityAndUom = merge.map((data, newindex) => ({
                    ...data,
                    uomnew: `${data.purchasecountstock}#${data.uomcodenew}`,
                }));
                setStock(quantityAndUom);
            }

            //          else if (stockManage.requestmode === "Stock Material") {
            //     let res_project = await axios.post(SERVICE.STOCKPURCHASELIMITED, {
            //       headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //       },
            //       assetmat: "Stock Material",
            //       companyto: stockManage.companyto,
            //       branchto: selectedBranchTo.map((item) => item.value),
            //       unitto: selectedUnitTo.map((item) => item.value),
            //     });


            //     let res_hand = await axios.get(SERVICE.STOCKPURCHASELIMITED_HAND, {
            //       headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //       },
            //     });

            //     let res_return = await axios.get(SERVICE.STOCKPURCHASELIMITED_RETURN, {
            //       headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //       },
            //     });


            //     let res_usagecount = await axios.get(SERVICE.STOCKPURCHASELIMITED_USAGE_COUNT, {
            //       headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //       },
            //     });


            //     let single = res_project?.data?.stock;

            //     let singlehand = res_hand.data?.stock;
            //     let singlereturn = res_return.data?.stock;
            //     let singleusagecount = res_usagecount.data?.stock;

            //     let singlehandtotal = singlehand.reduce((acc, current) => {

            //       const existingItemIndex = acc.findIndex(
            //         (item) =>
            //           item.company === current.company &&
            //           item.branch === current.branch &&
            //           item.unit === current.unit &&
            //           item.floor === current.floor &&
            //           item.area === current.area &&
            //           item.location === current.location &&
            //           item.productname === current.productname
            //       );

            //       if (existingItemIndex !== -1) {
            //         // Update existing item
            //         const existingItem = acc[existingItemIndex];

            //         existingItem.countquantity += Number(current.countquantity);
            //         existingItem._id = current._id;
            //       } else {
            //         // Add new item
            //         acc.push({
            //           company: current.company,
            //           _id: current._id,
            //           branch: current.branch,
            //           unit: current.unit,
            //           floor: current.floor,
            //           area: current.area,
            //           location: current.location,
            //           productname: current.productname,
            //           countquantity: Number(current.countquantity),
            //         });
            //       }
            //       return acc;
            //     }, []);


            //     let singlereturntotal = singlereturn.reduce((acc, current) => {
            //       const existingItemIndex = acc.findIndex(
            //         (item) =>
            //           item.company === current.company &&
            //           item.branch === current.branch &&
            //           item.unit === current.unit &&
            //           item.floor === current.floor &&
            //           item.area === current.area &&
            //           item.location === current.location &&
            //           item.productname === current.productname
            //       );

            //       if (existingItemIndex !== -1) {
            //         // Update existing item
            //         const existingItem = acc[existingItemIndex];

            //         existingItem.countquantity += Number(current.countquantity);
            //         existingItem._id = current._id;
            //       } else {
            //         // Add new item
            //         acc.push({
            //           company: current.company,
            //           _id: current._id,
            //           branch: current.branch,
            //           unit: current.unit,
            //           floor: current.floor,
            //           area: current.area,
            //           location: current.location,
            //           productname: current.productname,
            //           countquantity: Number(current.countquantity),
            //         });
            //       }
            //       return acc;
            //     }, []);

            //     let singleusagecounttotal = singleusagecount.reduce((acc, current) => {
            //       const existingItemIndex = acc.findIndex(
            //         (item) =>
            //           item.company === current.company &&
            //           item.branch === current.branch &&
            //           item.unit === current.unit &&
            //           item.floor === current.floor &&
            //           item.area === current.area &&
            //           item.location === current.location &&
            //           item.productname === current.productname
            //       );

            //       if (existingItemIndex !== -1) {
            //         // Update existing item
            //         const existingItem = acc[existingItemIndex];

            //         existingItem.countquantity += Number(current.countquantity);
            //         existingItem._id = current._id;
            //       } else {
            //         // Add new item
            //         acc.push({
            //           company: current.company,
            //           _id: current._id,
            //           branch: current.branch,
            //           unit: current.unit,
            //           floor: current.floor,
            //           area: current.area,
            //           location: current.location,
            //           productname: current.productname,
            //           countquantity: Number(current.countquantity),
            //         });
            //       }
            //       return acc;
            //     }, []);





            //     let res = await axios.get(SERVICE.STOCKPURCHASE_TRANSFER_LIMITED, {
            //       headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //       },
            //     });

            //     let stocktotal = res?.data?.stock;
            //     const resultstock = [];
            //     stocktotal.forEach((item) => {
            //       item.stockmaterialarray.forEach((subItem) => {
            //         resultstock.push({
            //           uomnew: subItem.uomnew,
            //           materialnew: subItem.materialnew,
            //           quantitynew: subItem.quantitynew,
            //           company: item.company,
            //           branch: item.branch,
            //           unit: item.unit,
            //           floor: item.floor,
            //           area: item.area,
            //           location: item.location,
            //         });
            //       });
            //     });

            //     let getstocktotal = resultstock.reduce((acc, current) => {
            //       const existingItemIndex = acc.findIndex(
            //         (item) =>
            //           item.company === current.company &&
            //           item.branch === current.branch &&
            //           item.unit === current.unit &&
            //           item.floor === current.floor &&
            //           item.area === current.area &&
            //           item.location === current.location &&
            //           item.materialnew === current.materialnew
            //       );

            //       console.log(getstocktotal, "getstocktotal")

            //       if (existingItemIndex !== -1) {
            //         // Update existing item
            //         const existingItem = acc[existingItemIndex];

            //         existingItem.quantitynew += Number(current.quantitynew);
            //         existingItem._id = current._id;
            //       } else {
            //         // Add new item
            //         acc.push({
            //           company: current.company,
            //           _id: current._id,
            //           branch: current.branch,
            //           unit: current.unit,
            //           floor: current.floor,
            //           area: current.area,
            //           location: current.location,
            //           materialnew: current.materialnew,
            //           quantitynew: Number(current.quantitynew),
            //         });
            //       }
            //       return acc;
            //     }, []);

            //     let result = single.flatMap((item) => {


            //       return item.stockmaterialarray.map((subItem) => ({
            //         _id: subItem._id,
            //         company: item.company,
            //         branch: item.branch,
            //         unit: item.unit,
            //         floor: item.floor,
            //         area: item.area,
            //         location: item.location,
            //         requestmode: item.requestmode,
            //         materialnew: subItem.materialnew,
            //         quantitynew: subItem.quantitynew,

            //         uomcodenew: subItem.uomcodenew,
            //       }));
            //     });

            //     let getfilter = result.reduce((acc, current) => {
            //       const existingItemIndex = acc.findIndex(
            //         (item) =>
            //           item.company === current.company &&
            //           item.branch === current.branch &&
            //           item.unit === current.unit &&
            //           item.floor === current.floor &&
            //           item.area === current.area &&
            //           item.location === current.location &&
            //           item.materialnew === current.materialnew
            //       );

            //       if (existingItemIndex !== -1) {
            //         // Update existing item
            //         const existingItem = acc[existingItemIndex];

            //         existingItem.purchasecountstock += Number(current.quantitynew);
            //         existingItem._id = current._id;
            //         existingItem.requestmode = current.requestmode;
            //         existingItem.productname = current.materialnew;
            //         existingItem.materialnew = current.materialnew;
            //         existingItem.uomcodenew = current.uomcodenew;
            //       } else {
            //         // Add new item
            //         acc.push({
            //           company: current.company,
            //           _id: current._id,
            //           branch: current.branch,
            //           unit: current.unit,
            //           floor: current.floor,
            //           area: current.area,
            //           location: current.location,
            //           productname: current.materialnew,
            //           materialnew: current.materialnew,
            //           requestmode: current.requestmode,
            //           uomcodenew: current.uomcodenew,
            //           purchasecount: Number(current.quantitynew),
            //           purchasecountstock: Number(current.quantitynew),
            //         });
            //       }
            //       return acc;
            //     }, []);

            //     let merge = getfilter.map((item) => {

            //       console.log(item, "iem")
            //       let matchItems = getstocktotal.find(
            //         (d) =>

            //         item.company === d.company &&
            //         item.branch === d.branch &&
            //         item.unit === d.unit &&
            //         item.floor === d.floor &&
            //         item.area === d.area &&
            //         item.location === d.location &&
            //         item.materialnew === d.materialnew
            //       );

            //       let findquantity = singlehandtotal.find(
            //         (d) =>
            //           item.company === d.company &&
            //           item.branch === d.branch &&
            //           item.unit === d.unit &&
            //           item.floor === d.floor &&
            //           item.area === d.area &&
            //           item.location === d.location &&
            //           item.productname === d.productname
            //       );

            //       let findreturnquantity = singlereturntotal.find(
            //         (d) =>
            //           item.company === d.company &&
            //           item.branch === d.branch &&
            //           item.unit === d.unit &&
            //           item.floor === d.floor &&
            //           item.area === d.area &&
            //           item.location === d.location &&
            //           item.productname === d.productname
            //       );

            //       let findusagecount = singleusagecounttotal.find(
            //         (d) =>
            //           item.company === d.company &&
            //           item.branch === d.branch &&
            //           item.unit === d.unit &&
            //           item.floor === d.floor &&
            //           item.area === d.area &&
            //           item.location === d.location &&
            //           item.productname === d.productname
            //       );

            //       let matchHandItems =
            //         singlehandtotal.length > 0
            //           ? findquantity
            //             ? findquantity.countquantity
            //             : 0
            //           : 0;
            //       let matchReturnItems =
            //         singlereturntotal.length > 0
            //           ? findreturnquantity
            //             ? findreturnquantity.countquantity
            //             : 0
            //           : 0;

            //       let matchUsageCountItems =
            //         singleusagecounttotal.length > 0
            //           ? findusagecount
            //             ? findusagecount.countquantity
            //             : 0
            //           : 0;
            //       console.log(matchItems, "matchItems")

            //       if (matchItems || matchHandItems || matchReturnItems || matchUsageCountItems) {
            //         return {
            //           ...item,
            //           purchasecountstock: Number(item.purchasecountstock),
            //           usedcount: Number(matchItems?.quantitynew),
            //           balancedcount:
            //             Number(item.purchasecountstock) -
            //             Number(matchItems.quantitynew),
            //           handovercount: Number(matchHandItems),
            //           returncount: Number(matchReturnItems),
            //           usagecount: Number(matchUsageCountItems),
            //         };
            //       } else {
            //         return {
            //           ...item,
            //           usedcount: 0,
            //           handovercount: 0,
            //           returncount: 0,
            //           usagecount: 0,
            //           balancedcount: Number(item.purchasecountstock) - 0,
            //         };
            //       }
            //     });


            //     let quantityAndUom = merge.map((data, newindex) => ({
            //       ...data,
            //       uomnew: `${data.purchasecountstock}#${data.uomcodenew}`,
            //     }));


            //     setStock(quantityAndUom);
            //   }
            setProjectCheck(false);
        } catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleDataFromChildUIDeign = (data) => {
        // Handle the data received from the child component
        // setDataFromChildUIDeign(data);
        if (data === true) {
            fetchStock();
        }
    };

    const handleDataFromChildUIDeignStock = (data) => {
        // Handle the data received from the child component
        // setDataFromChildUIDeign(data);
        if (data === true) {
            fetchStock();
        }
    };

    const fetchEmployeesAll = async () => {
        try {
            let res = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEmployeesall(res.data.users);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchCompanyTo = async () => {
        try {
            let res_category = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.companies.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setCompanysto(companyall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchCompanyDropdowns = async () => {
        try {
            let res_category = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.companies.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];
            setCompanys(companyall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchBranchDropdowns = async (e) => {
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_branch.data.branch.filter((d) => d.company === e.value);
            const branchall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setBranchs(branchall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchUnits = async (e) => {
        try {
            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_unit?.data?.units.filter((d) => d.branch === e.value);
            const unitall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setUnits(unitall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchBranchDropdownsTo = async (e) => {
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setBranchsto(res_branch.data.branch);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchUnitsTo = async (e) => {
        try {
            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setUnitsto(res_unit?.data?.units);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchFloor = async (e) => {
        try {
            let res_floor = await axios.get(SERVICE.FLOOR, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_floor.data.floors.filter((d) => d.branch === e.value);
            const floorall = result.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));
            setFloors(floorall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchArea = async (e) => {
        try {
            let res_type = await axios.get(SERVICE.AREAGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_type.data.areagroupings
                .filter((d) => d.branch === stockManagehand.branch && d.floor === e)
                .map((data) => data.area);
            let ji = [].concat(...result);
            const all = ji.map((d) => ({
                ...d,
                label: d,
                value: d,
            }));
            setAreas(all);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchLocation = async (e) => {
        try {
            let res_type = await axios.get(SERVICE.LOCATIONGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let result = res_type.data.locationgroupings
                .filter(
                    (d) =>
                        d.branch === stockManagehand.branch &&
                        d.floor === stockManagehand.floor &&
                        d.area === e
                )
                .map((data) => data.location);
            let ji = [].concat(...result);
            const all = [
                { label: "ALL", value: "ALL" },
                ...ji.map((d) => ({
                    ...d,
                    label: d,
                    value: d,
                })),
            ];
            setLocations(all);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchTeamAll = async (unit) => {
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });

            setTeamOption(res_team?.data?.teamsdetails);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchCompanyTo();
        fetchBranchDropdownsTo();
        fetchUnitsTo();
        fetchEmployeesAll();
        fetchCompanyDropdowns();
        fetchTeamAll();
    }, []);
    useEffect(() => {
        fetchTeamAll();
    }, [stockManagehand.unit]);

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        productname: true,
        quantity: true,
        material: true,
        materialnew: true,

        employeenameto: true,
        purchasecount: true,
        purchasecountstock: true,
        requestmode: true,
        usedcount: true,
        usedcountstock: true,
        balancedcount: true,
        actions: true,
        viewactions: true,
        assetviewactions: true,
        handovercount: true,
        returncount: true,
        handovercountbtn: true,
        returncountbtn: true,
        usagecountbtn: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber(stock);
    }, [stock]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const [stockedit, setStockedit] = useState([]);
    const [stockmaterialedit, setStockmaterialedit] = useState([]);
    const [stocklog, setStockLog] = useState([]);
    const [assetlog, setAssetLog] = useState([]);
    //set function to get particular row
    const getCode = async (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        productname,
        assettype,
        asset,
        component
    ) => {
        try {
            setStockedit({
                ...stockedit,
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                productname: productname,
                assettype: assettype,
                asset: asset,
                component: component,
            });
            handleClickOpenviewalertvendor();

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getCodeStock = async (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        productname,
        balancedcount
        // , assettype, producthead, component
    ) => {
        try {
            // let res = await axios.get(`${SERVICE.STOCKPURCHASE_SINGLE}/${id}`, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            // });
            setStockmaterialedit({
                ...stockmaterialedit,
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                productname: productname,
                balancedcount: balancedcount,
                // ,
                // assettype: assettype, producthead: producthead, component: component,
            });

            handleClickOpenviewalertvendorstock();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getCodeStockLog = async (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        material
    ) => {
        try {
            let res = await axios.post(SERVICE.STOCKPURCHASE_TRANSFER_LOG_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
            });

            let stocktotal = res.data.stock;
            const resultstock = [];
            stocktotal.forEach((item) => {
                item.stockmaterialarray.forEach((subItem) => {
                    resultstock.push({
                        uomnew: subItem.uomnew,

                        materialnew: subItem.materialnew,
                        quantitynew: subItem.quantitynew,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        floor: item.floor,
                        area: item.area,
                        location: item.location,
                        addedby: moment(item.addedby[0].date).format(
                            "DD-MM-YYYY hh:mm:ss a"
                        ),
                    });
                });
            });
            let stockviewlog = resultstock.filter(
                (item) => item.materialnew === material
            );
            setStockLog(stockviewlog);
            handleViewOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getCodeAssetLog = async (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        productname
    ) => {
        try {
            let res = await axios.post(SERVICE.ASSET_LOG_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                productname: productname,
            });
            let reshand = await axios.post(SERVICE.STOCKPURCHASELIMITED_HAND_RETURN, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                productname: productname,
            });
            let assetdetail = res.data.assetdetails.map((item) => ({
                ...item,
                handover: "Assign",
            }));
            let stock = reshand.data.stock.map((item) => ({
                ...item,
                material: item.productname,
            }));
            let all = [...assetdetail, ...stock];
            setAssetLog(all);
            // setAssetLog([]);
            handleViewOpenAsset();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getCodeAssetReturnLog = async (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        productname
    ) => {
        try {
            let reshand = await axios.post(SERVICE.STOCKPURCHASELIMITED_HAND_TODO, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                productname: productname,
            });
            let reshandeeturn = await axios.post(
                SERVICE.STOCKPURCHASELIMITED_HAND_TODO_RETURN,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: company,
                    branch: branch,
                    unit: unit,
                    floor: floor,
                    area: area,
                    location: location,
                    productname: productname,
                }
            );

            let getfilterstockreturn = reshandeeturn.data.stock.reduce(
                (acc, current) => {
                    const existingItemIndex = acc.findIndex(
                        (item) => item.employeenameto === current.employeenameto
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.countquantity += Number(current.countquantity);
                    } else {
                        // Add new item
                        acc.push({
                            company: current.company,
                            branch: current.branch,
                            unit: current.unit,
                            floor: current.floor,
                            area: current.area,
                            location: current.location,
                            productname: current.productname,
                            countquantity: Number(current.countquantity),
                            employeenameto: current.employeenameto,
                        });
                    }
                    return acc;
                },
                []
            );
            let getfilterstock = reshand.data.stock.reduce((acc, current) => {
                const existingItemIndex = acc.findIndex(
                    (item) => item.employeenameto === current.employeenameto
                );

                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.countquantity += Number(current.countquantity);
                } else {
                    // Add new item
                    acc.push({
                        company: current.company,
                        branch: current.branch,
                        unit: current.unit,
                        floor: current.floor,
                        area: current.area,
                        location: current.location,
                        productname: current.productname,
                        countquantity: Number(current.countquantity),

                        employeenameto: current.employeenameto,
                        addedby: current.addedby,
                    });
                }
                return acc;
            }, []);

            let merge = getfilterstock.map((item) => {
                let matchItems = getfilterstockreturn.find(
                    (d) => item.employeenameto === d.employeenameto
                );
                if (matchItems) {
                    return {
                        ...item,
                        countquantity:
                            Number(item.countquantity) - Number(matchItems.countquantity),
                        returnqty: 0,
                    };
                } else {
                    return {
                        ...item,

                        returnqty: 0,
                    };
                }
            });

            setTodoscheck(merge);
            // setAssetLog([]);
            handleClickOpenEditReturn();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();

        if (stockManage.companyto === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedBranchTo.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedUnitTo.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            fetchStock();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();
        setStockManage({
            requestmode: "Stock Material",
            companyto: "Please Select Company",
        });
        setSelectedBranchTo([]);
        setSelectedUnitTo([]);
        setStock([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const [isEditOpen, setIsEditOpen] = useState(false);


    //Edit model...
    const handleClickOpenEdit = (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        productname,
        balancedcount,
        usedcount
    ) => {
        setIsEditOpen(true);

        setHandover({
            ...handover,
            company: company,
            branch: branch,
            unit: unit,
            floor: floor,
            area: area,
            location: location,
            productname: productname,
            balancedcount: balancedcount,
        });
        setStockManagehand({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "Please Select Area",
            location: "Please Select Location",

            employeenameto: "Please Select Employee",
            countquantity: "",
            team: "Please Select Team",
        });
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setStockManagehand({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "Please Select Area",
            location: "Please Select Location",

            employeenameto: "Please Select Employee",
            countquantity: "",
            team: "Please Select Team",
        });
    };



    const [isEditOpenused, setIsEditOpenused] = useState(false);


    //Edit model...
    const handleClickOpenEditused = () => {
        setIsEditOpenused(true);


    };
    const handleCloseModEditused = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenused(false);

    };



    const [isEditOpenReturn, setIsEditOpenReturn] = useState(false);
    //return model...
    const handleClickOpenEditReturn = (
        company,
        branch,
        unit,
        floor,
        area,
        location,
        productname,
        balancedcount,
        handovercount
    ) => {
        setIsEditOpenReturn(true);
        setHandover({
            ...handover,
            company: company,
            branch: branch,
            unit: unit,
            floor: floor,
            area: area,
            location: location,
            productname: productname,
            balancedcount: balancedcount,
            handovercount: handovercount,
        });
        setStockManagehand({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            floor: "Please Select Floor",
            area: "Please Select Area",
            location: "Please Select Location",
            employeenameto: "Please Select Employee",
            countquantity: "",
            team: "Please Select Team",
        });
    };
    const handleCloseModEditReturn = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenReturn(false);
        setTodoscheck([]);
        setEditingIndexcheck("");
        setEditedDeveloper("");
        seteditedReturnName("");
        setSelectedCompanyedit("");
        setvaluecateedit("");
        setempcodeedit("");
    };

    //get single row to edit....

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "StockManagement.png");
                });
            });
        }
    };

    // get particular columns for export excel

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "StockManagement",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            item: item._id,
        }));
        setItems(itemsWithSerialNumber);
    };
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }




    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const columnDatatable = [

        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold",
            },

            sortable: false,
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 140,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 140,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 140,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 140,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "productname",
            headerName: "Material",
            flex: 0,
            width: 200,
            hide: !columnVisibility.productname,
            headerClassName: "bold-header",
        },
        {
            field: "requestmode",
            headerName: "Mode",
            flex: 0,
            width: 120,
            hide: !columnVisibility.requestmode,
            headerClassName: "bold-header",
        },

        {
            field: "purchasecount",
            headerName: "Purchase Count",
            flex: 0,
            width: 140,
            hide: !columnVisibility.purchasecount,
            headerClassName: "bold-header",
        },

        {
            field: "usedcount",
            headerName: "Used Count",
            flex: 0,
            width: 140,
            hide: !columnVisibility.usedcount,
            headerClassName: "bold-header",
        },
        {
            field: "balancedcount",
            headerName: "Balanced Count",
            flex: 0,
            width: 140,
            hide: !columnVisibility.balancedcount,
            headerClassName: "bold-header",
        },

        {
            field: "actions",
            headerName: "Assign",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.requestmode === "Asset Material" && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                getCode(
                                    params.data.company,
                                    params.data.branch,
                                    params.data.unit,
                                    params.data.floor,
                                    params.data.area,
                                    params.data.location,
                                    params.data.productname,
                                    params.data.assettype,
                                    params.data.asset,
                                    params.data.component
                                );
                            }}
                        >
                            Assign
                        </Button>
                    )}
                </Grid>
            ),
        },

        {
            field: "handovercountbtn",
            headerName: "Handover Count",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.handovercountbtn,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.requestmode === "Asset Material" &&
                        params.data.balancedcount > 0 && (
                            <Grid sx={{ display: "flex", gap: "2px" }}>
                                <Typography
                                    sx={{
                                        backgroundColor: "#6ddabb",
                                        borderRadius: "50%",
                                        padding: "4px",
                                    }}
                                >
                                    {" "}
                                    {params.data.handovercount}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                        handleClickOpenEdit(
                                            params.data.company,
                                            params.data.branch,
                                            params.data.unit,
                                            params.data.floor,
                                            params.data.area,
                                            params.data.location,
                                            params.data.productname,
                                            params.data.balancedcount,
                                            params.data.usedcount
                                        )
                                    }
                                >
                                    Allot
                                </Button>
                            </Grid>
                        )}
                </Grid>
            ),
        },

        {
            field: "returncountbtn",
            headerName: "Return Count",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.returncountbtn,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.requestmode === "Asset Material" &&
                        params.data.balancedcount > 0 && (
                            <Grid sx={{ display: "flex" }}>
                                <Typography
                                    sx={{
                                        backgroundColor: "orange",
                                        borderRadius: "50%",
                                        padding: "2px",
                                    }}
                                >
                                    {" "}
                                    {params.data.returncount}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    // onClick={() => handleClickOpenEditReturn(params.data.company, params.data.branch, params.data.unit, params.data.floor, params.data.area, params.data.location, params.data.productname, params.data.balancedcount, params.data.handovercount)}
                                    onClick={(e) => {
                                        getCodeAssetReturnLog(
                                            params.data.company,
                                            params.data.branch,
                                            params.data.unit,
                                            params.data.floor,
                                            params.data.area,
                                            params.data.location,
                                            params.data.productname
                                        );
                                    }}
                                >
                                    Return Count
                                </Button>
                            </Grid>
                        )}
                </Grid>
            ),
        },


        {
            field: "usagecountbtn",
            headerName: "Usage Count",
            flex: 0,
            width: 200,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.usagecountbtn,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.requestmode === "Asset Material" &&
                        params.data.balancedcount > 0 && (
                            <Grid sx={{ display: "flex", gap: "2px" }}>
                                <Typography
                                    sx={{
                                        backgroundColor: "#6ddabb",
                                        borderRadius: "50%",
                                        padding: "4px",
                                    }}
                                >
                                    {" "}
                                    {params.data.handovercount}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                        handleClickOpenEditused(
                                            // params.data.company,
                                            // params.data.branch,
                                            // params.data.unit,
                                            // params.data.floor,
                                            // params.data.area,
                                            // params.data.location,
                                            // params.data.productname,
                                            // params.data.balancedcount,
                                            // params.data.usedcount
                                        )
                                    }
                                >
                                    Usage Count
                                </Button>
                            </Grid>
                        )}
                </Grid>
            ),
        },



        {
            field: "assetviewactions",
            headerName: "Actions",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.assetviewactions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.requestmode === "Asset Material" && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={(e) => {
                                getCodeAssetLog(
                                    params.data.company,
                                    params.data.branch,
                                    params.data.unit,
                                    params.data.floor,
                                    params.data.area,
                                    params.data.location,
                                    params.data.productname
                                );
                            }}
                        >
                            {/* <VisibilityOutlinedIcon
                                style={{ fontsize: "large" }}
                            /> */}
                            VIEW
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const columnDatatableStock = [
        // {
        //   field: "checkbox",
        //   headerName: "Checkbox", // Default header name
        //   headerStyle: {
        //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //     // Add any other CSS styles as needed
        //   },
        //   renderHeader: (params) => (
        //     <CheckboxHeader
        //       selectAllChecked={selectAllChecked}
        //       onSelectAll={() => {
        //         if (rowDataTable.length === 0) {
        //           // Do not allow checking when there are no rows
        //           return;
        //         }
        //         if (selectAllChecked) {
        //           setSelectedRows([]);
        //         } else {
        //           const allRowIds = rowDataTable.map((row) => row.id);
        //           setSelectedRows(allRowIds);
        //         }
        //         setSelectAllChecked(!selectAllChecked);
        //       }}
        //     />
        //   ),

        //   renderCell: (params) => (
        //     <Checkbox
        //       checked={selectedRows.includes(params.data.id)}
        //       onChange={() => {
        //         let updatedSelectedRows;
        //         if (selectedRows.includes(params.data.id)) {
        //           updatedSelectedRows = selectedRows.filter(
        //             (selectedId) => selectedId !== params.data.id
        //           );
        //         } else {
        //           updatedSelectedRows = [...selectedRows, params.data.id];
        //         }
        //         setSelectedRows(updatedSelectedRows);
        //         // Update the "Select All" checkbox based on whether all rows are selected
        //         setSelectAllChecked(
        //           updatedSelectedRows.length === filteredData.length
        //         );
        //       }}
        //     />
        //   ),
        //   sortable: false, // Optionally, you can make this column not sortable
        //   width: 90,
        //   hide: !columnVisibility.checkbox,
        //   headerClassName: "bold-header",
        // },
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 180,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 140,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 140,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 140,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 140,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "productname",
            headerName: "Material",
            flex: 0,
            width: 200,
            hide: !columnVisibility.productname,
            headerClassName: "bold-header",
        },
        {
            field: "requestmode",
            headerName: "Mode",
            flex: 0,
            width: 120,
            hide: !columnVisibility.requestmode,
            headerClassName: "bold-header",
        },

        {
            field: "purchasecountstock",
            headerName: "Quantity & UOM",
            flex: 0,
            width: 140,
            hide: !columnVisibility.purchasecountstock,
            headerClassName: "bold-header",
        },
        {
            field: "usedcount",
            headerName: "Used Count",
            flex: 0,
            width: 140,
            hide: !columnVisibility.usedcount,
            headerClassName: "bold-header",
        },
        {
            field: "balancedcount",
            headerName: "Balance Count",
            flex: 0,
            width: 140,
            hide: !columnVisibility.balancedcount,
            headerClassName: "bold-header",
        },

        {
            field: "actions",
            headerName: "Stock Transfer",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.requestmode === "Stock Material" && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                getCodeStock(
                                    params.data.company,
                                    params.data.branch,
                                    params.data.unit,
                                    params.data.floor,
                                    params.data.area,
                                    params.data.location,
                                    params.data.productname,
                                    params.data.balancedcount
                                    // ,
                                    // params.data.assettype, params.data.producthead, params.data.component
                                );
                            }}
                        >
                            Transfer
                        </Button>
                    )}
                </Grid>
            ),
        },

        {
            field: "viewactions",
            headerName: "Actions",
            flex: 0,
            width: 150,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.viewactions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {params.data.requestmode === "Stock Material" && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={(e) => {
                                getCodeStockLog(
                                    params.data.company,
                                    params.data.branch,
                                    params.data.unit,
                                    params.data.floor,
                                    params.data.area,
                                    params.data.location,
                                    params.data.productname
                                );
                            }}
                        >
                            {/* <VisibilityOutlinedIcon
                                style={{ fontsize: "large" }}
                            /> */}
                            VIEW
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            quantity: item.quantity,
            material: item.material,
            assettype: item.assettype,
            asset: item.asset,
            employeenameto: item.employeenameto,
            component: item.component,
            productname: item.productname,
            requestmode: item.requestmode,
            purchasecount: item.purchasecount,
            purchasecountstock: item.uomnew,
            usedcount: item.usedcount,
            balancedcount: item.balancedcount,
            returncount: item.returncount,
            handovercount: item.handovercount,
            returncountbtn: item.returncountbtn,
            handovercountbtn: item.handovercountbtn,
            uomnew: item.uomnew,
            materialnew: item.materialnew,
            usagecountbtn: item.usagecountbtn
        };
    });

    let columnsnew =
        stockManage.requestmode === "Stock Material"
            ? columnDatatableStock
            : columnDatatable;

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumns = columnsnew.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnsnew.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );


    const [materialOpt, setMaterialopt] = useState([]);

    const fetchMaterialAll = async () => {
        try {
            let res = await axios.get(SERVICE.ASSETS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const resultall = res.data.assetmaterial.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }));

            const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
                return (
                    self.findIndex(
                        (i) => i.label === item.label && i.value === item.value
                    ) === index
                );
            });
            setMaterialopt(assetmaterialuniqueArray);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchMaterialAll();
    }, []);

    const sendRequestStock = async () => {
        try {
            let stockcreate = await axios.post(SERVICE.STOCKPURCHASE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                company: String(handover.company),

                branch: String(handover.branch),
                unit: String(handover.unit),
                productname: String(handover.productname),
                floor: String(handover.floor),
                area: String(handover.area),
                location: String(handover.location),

                usercompany: String(stockManagehand.company),

                userbranch: String(stockManagehand.branch),
                userunit: String(stockManagehand.unit),
                userteam: String(stockManagehand.team),

                employeenameto: String(stockManagehand.employeenameto),
                countquantity: String(stockManagehand.countquantity),

                usagecount: String("usage"),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });


            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEdit();
            await fetchStock();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const sendRequestStockReturn = async () => {
        let postdata = todoscheck.filter(
            (item) => item.returnqty != 0 && item.returnqty != ""
        );
        try {
            const updatePromises = postdata?.map((item) => {
                return axios.post(`${SERVICE.STOCKPURCHASE_CREATE}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String(item.company),

                    branch: String(item.branch),
                    unit: String(item.unit),
                    productname: String(item.productname),
                    floor: String(item.floor),
                    area: String(item.area),
                    location: String(item.location),
                    usercompany: String(item.company),
                    userbranch: String(item.branch),
                    userunit: String(item.unit),
                    userteam: String(item.team),
                    employeenameto: String(item.employeenameto),
                    countquantity: String(item.returnqty),
                    // returnqty: quantityedit,
                    handover: String("return"),
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
            });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            handleCloseModEditReturn();
            await fetchStock();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handlesubmitstock = (e) => {
        e.preventDefault();
        if (stockManagehand.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockManagehand.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockManagehand.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockManagehand.team === "Please Select Team") {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockManagehand.countquantity === "") {
            setPopupContentMalert("Please Enter Quantity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (stockManagehand.employeenameto === "Please Select Employee") {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (handover.balancedcount < stockManagehand.countquantity) {
            setPopupContentMalert("Please Enter Less Than Balance Count!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequestStock();
        }
    };

    const handlesubmitstockReturn = (e) => {
        e.preventDefault();
        if (editingIndexcheck >= 0) {
            setPopupContentMalert("Please Update Changed Return Quantity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequestStockReturn();
        }
    };

    //view table
    const gridRefview = useRef(null);
    const [pageView, setPageView] = useState(1);
    const [pageSizeview, setPageSizeView] = useState(10);
    const [searchQueryView, setSearchQueryView] = useState("");
    const [isManageColumnsOpenview, setManageColumnsOpenview] = useState(false);
    const [anchorElView, setAnchorElView] = useState(null);
    const openView1 = Boolean(anchorElView);
    const idView = openView1 ? "simple-popover" : undefined;

    const [selectedRowsView, setSelectedRowsView] = useState([]);
    const [searchQueryManageView, setSearchQueryManageView] = useState("");

    // Manage Columns View

    const handleOpenManageColumnsView = (event) => {
        setAnchorElView(event.currentTarget);
        setManageColumnsOpenview(true);
    };
    const handleCloseManageColumnsview = () => {
        setManageColumnsOpenview(false);
        setSearchQueryManageView("");
    };

    const getRowClassNameView = (params) => {
        if (selectedRowsView.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const initialColumnVisibilityView = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        materialnew: true,
        quantitynew: true,
        addedby: true,
        actions: true,
    };

    const [columnVisibilityView, setColumnVisibilityView] = useState(
        initialColumnVisibilityView
    );

    const [itemsView, setItemsView] = useState([]);

    const addSerialNumberView = () => {
        const itemsWithSerialNumberView = stocklog?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItemsView(itemsWithSerialNumberView);
    };

    useEffect(() => {
        addSerialNumberView();
    }, [stocklog]);

    //Datatable
    const handlePageChangeView = (newPage) => {
        setPageView(newPage);
        setSelectedRowsView([]);
    };

    const handlePageSizeChangeview = (event) => {
        setPageSizeView(Number(event.target.value));
        setPageView(1);
    };

    //datatable....
    const handleSearchChangeview = (event) => {
        setSearchQueryView(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermsView = searchQueryView.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasView = itemsView?.filter((item) => {
        return searchTermsView.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataView = filteredDatasView.slice(
        (pageView - 1) * pageSizeview,
        pageView * pageSizeview
    );

    const totalPagesView = Math.ceil(filteredDatasView.length / pageSizeview);

    const visiblePagesview = Math.min(totalPagesView, 3);

    const firstVisiblePageview = Math.max(1, pageView - 1);
    const lastVisiblePageView = Math.min(
        firstVisiblePageview + visiblePagesview - 1,
        totalPagesView
    );

    const pageNumbersView = [];

    const indexOfLastItemview = pageView * pageSizeview;
    const indexOfFirstItemView = indexOfLastItemview - pageSizeview;

    for (let i = firstVisiblePageview; i <= lastVisiblePageView; i++) {
        pageNumbersView.push(i);
    }

    const columnDataTableview = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 180,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 140,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 140,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 140,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 140,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "materialnew",
            headerName: "Material",
            flex: 0,
            width: 200,
            hide: !columnVisibility.materialnew,
            headerClassName: "bold-header",
        },
        {
            field: "quantitynew",
            headerName: "Quantity",
            flex: 0,
            width: 200,
            hide: !columnVisibility.quantitynew,
            headerClassName: "bold-header",
        },
        {
            field: "addedby",
            headerName: "Date & Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.addedby,
            headerClassName: "bold-header",
        },
    ];

    const rowDataTableView = filteredDataView.map((item, index) => {
        return {
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            ids: item._id,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            material: item.material,
            materialnew: item.materialnew,
            quantitynew: item.quantitynew,
            addedby: item.addedby,
        };
    });

    const rowsWithCheckboxesView = rowDataTableView.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsView.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumnsView = () => {
        const updatedVisibilityView = { ...columnVisibilityView };
        for (const columnKey in updatedVisibilityView) {
            updatedVisibilityView[columnKey] = true;
        }
        setColumnVisibilityView(updatedVisibilityView);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibilityView = localStorage.getItem("columnVisibility");
        if (savedVisibilityView) {
            setColumnVisibilityView(JSON.parse(savedVisibilityView));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem(
            "columnVisibilityView",
            JSON.stringify(columnVisibilityView)
        );
    }, [columnVisibilityView]);

    // // Function to filter columns based on search query
    const filteredColumnsView = columnDataTableview.filter((column) =>
        column.headerName
            .toLowerCase()
            .includes(searchQueryManageView.toLowerCase())
    );

    // Manage Columns functionality
    const toggleColumnVisibilityview = (field) => {
        setColumnVisibilityView((prevVisibilityView) => ({
            ...prevVisibilityView,
            [field]: !prevVisibilityView[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentview = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsview}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManageView}
                    onChange={(e) => setSearchQueryManageView(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsView.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityView[column.field]}
                                        onChange={() => toggleColumnVisibilityview(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() =>
                                setColumnVisibilityView(initialColumnVisibilityView)
                            }
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTableview.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityView(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    //view asset table asset
    const gridRefviewasset = useRef(null);
    const [pageViewasset, setPageViewasset] = useState(1);
    const [pageSizeviewasset, setPageSizeViewasset] = useState(10);
    const [searchQueryViewasset, setSearchQueryViewasset] = useState("");
    const [isManageColumnsOpenviewasset, setManageColumnsOpenviewasset] =
        useState(false);
    const [anchorElViewasset, setAnchorElViewasset] = useState(null);
    const openView1asset = Boolean(anchorElView);
    const idViewasset = openView1asset ? "simple-popover" : undefined;

    const [selectedRowsViewasset, setSelectedRowsViewasset] = useState([]);
    const [searchQueryManageViewasset, setSearchQueryManageViewasset] =
        useState("");

    // Manage Columns View

    const handleOpenManageColumnsViewasset = (event) => {
        setAnchorElViewasset(event.currentTarget);
        setManageColumnsOpenviewasset(true);
    };
    const handleCloseManageColumnsViewasset = () => {
        setManageColumnsOpenviewasset(false);
        setSearchQueryManageViewasset("");
    };

    const getRowClassNameViewasset = (params) => {
        if (selectedRowsViewasset.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // JSX for the "Manage Columns" popover content

    const initialColumnVisibilityViewasset = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        material: true,
        productname: true,
        employeenameto: true,
        handover: true,
        countquantity: true,
        addedbyname: true,
        addedby: true,
        actions: true,
    };

    const [columnVisibilityViewasset, setColumnVisibilityViewasset] = useState(
        initialColumnVisibilityViewasset
    );

    const [itemsViewasset, setItemsViewasset] = useState([]);

    const addSerialNumberViewasset = () => {
        const itemsWithSerialNumberViewasset = assetlog?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            // addedbyname: (item.addedby[0].empname),
            addedby: moment(item.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss a"),
        }));
        setItemsViewasset(itemsWithSerialNumberViewasset);
    };

    useEffect(() => {
        addSerialNumberViewasset();
    }, [assetlog]);

    //Datatable
    const handlePageChangeViewasset = (newPage) => {
        setPageViewasset(newPage);
        setSelectedRowsViewasset([]);
    };

    const handlePageSizeChangeviewasset = (event) => {
        setPageSizeViewasset(Number(event.target.value));
        setPageViewasset(1);
    };

    //datatable....
    const handleSearchChangeviewasset = (event) => {
        setSearchQueryViewasset(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermsViewasset = searchQueryViewasset.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasViewasset = itemsViewasset?.filter((item) => {
        return searchTermsViewasset.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataViewasset = filteredDatasViewasset?.slice(
        (pageViewasset - 1) * pageSizeviewasset,
        pageViewasset * pageSizeviewasset
    );

    const totalPagesViewasset = Math.ceil(
        filteredDatasViewasset?.length / pageSizeviewasset
    );

    const visiblePagesviewasset = Math.min(totalPagesViewasset, 3);

    const firstVisiblePageviewasset = Math.max(1, pageViewasset - 1);
    const lastVisiblePageViewasset = Math.min(
        firstVisiblePageviewasset + visiblePagesviewasset - 1,
        totalPagesViewasset
    );

    const pageNumbersViewasset = [];

    const indexOfLastItemviewasset = pageViewasset * pageSizeviewasset;
    const indexOfFirstItemViewasset =
        indexOfLastItemviewasset - pageSizeviewasset;

    for (let i = firstVisiblePageviewasset; i <= lastVisiblePageViewasset; i++) {
        pageNumbersViewasset.push(i);
    }

    const columnDataTableviewasset = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            headerClassName: "bold-header",
        },
        {
            field: "handover",
            headerName: "Status",
            flex: 0,
            width: 200,
            hide: !columnVisibility.handover,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <Typography
                    sx={{
                        backgroundColor:
                            params.data.handover === "handover"
                                ? "#53d2cb"
                                : params.data.handover === "return"
                                    ? "#ffa50099"
                                    : "#c88695",
                        borderRadius: "4px",
                        padding: "4px",
                    }}
                >
                    {params.data.handover === "handover"
                        ? "Handover"
                        : params.data.handover === "return"
                            ? "Return"
                            : "Assign"}
                </Typography>
            ),
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 180,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 140,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 140,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 140,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 140,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "productname",
            headerName: "Material",
            flex: 0,
            width: 200,
            hide: !columnVisibility.productname,
            headerClassName: "bold-header",
        },
        {
            field: "countquantity",
            headerName: "Quantity",
            flex: 0,
            width: 200,
            hide: !columnVisibility.countquantity,
            headerClassName: "bold-header",
        },
        {
            field: "employeenameto",
            headerName: "Employee",
            flex: 0,
            width: 200,
            hide: !columnVisibility.employeenameto,
            headerClassName: "bold-header",
        },
        {
            field: "addedby",
            headerName: "Date & Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.addedby,
            headerClassName: "bold-header",
        },
    ];

    const rowDataTableViewasset = filteredDataViewasset.map((item, index) => {
        return {
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            ids: item._id,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            material: item.material,
            handover: item.handover,
            productname: item.material,
            countquantity: item.countquantity,
            employeenameto: item.employeenameto,
            addedby: item.addedby,
            addedbyname: item.addedbyname,
        };
    });

    const rowsWithCheckboxesViewasset = rowDataTableViewasset.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsViewasset.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumnsViewasset = () => {
        const updatedVisibilityViewasset = { ...columnVisibilityViewasset };
        for (const columnKey in updatedVisibilityViewasset) {
            updatedVisibilityViewasset[columnKey] = true;
        }
        setColumnVisibilityViewasset(updatedVisibilityViewasset);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibilityViewasset = localStorage.getItem(
            "columnVisibilityasset"
        );
        if (savedVisibilityViewasset) {
            setColumnVisibilityViewasset(JSON.parse(savedVisibilityViewasset));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem(
            "columnVisibilityViewasset",
            JSON.stringify(columnVisibilityViewasset)
        );
    }, [columnVisibilityViewasset]);

    // // Function to filter columns based on search query
    const filteredColumnsViewasset = columnDataTableviewasset.filter((column) =>
        column.headerName
            .toLowerCase()
            .includes(searchQueryManageViewasset.toLowerCase())
    );

    const manageColumnsContentviewasset = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsViewasset}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManageViewasset}
                    onChange={(e) => setSearchQueryManageViewasset(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsViewasset.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityViewasset[column.field]}
                                        onChange={() =>
                                            toggleColumnVisibilityviewasset(column.field)
                                        }
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() =>
                                setColumnVisibilityViewasset(initialColumnVisibilityViewasset)
                            }
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTableviewasset.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityViewasset(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Manage Columns functionality
    const toggleColumnVisibilityviewasset = (field) => {
        setColumnVisibilityViewasset((prevVisibilityView) => ({
            ...prevVisibilityView,
            [field]: !prevVisibilityView[field],
        }));
    };

    //view asset return table
    const gridRefviewassetreturn = useRef(null);
    const [pageViewassetreturn, setPageViewassetreturn] = useState(1);
    const [pageSizeviewassetreturn, setPageSizeViewassetreturn] = useState(10);
    const [searchQueryViewassetreturn, setSearchQueryViewassetreturn] =
        useState("");
    const [
        isManageColumnsOpenviewassetreturn,
        setManageColumnsOpenviewassetreturn,
    ] = useState(false);
    const [anchorElViewassetreturn, setAnchorElViewassetreturn] = useState(null);
    const openView1assetreturn = Boolean(anchorElViewassetreturn);
    const idViewassetreturn = openView1assetreturn ? "simple-popover" : undefined;

    const [selectedRowsViewassetreturn, setSelectedRowsViewassetreturn] =
        useState([]);
    const [
        searchQueryManageViewassetreturn,
        setSearchQueryManageViewassetreturn,
    ] = useState("");

    // Manage Columns View

    const handleOpenManageColumnsViewassetreturn = (event) => {
        setAnchorElViewassetreturn(event.currentTarget);
        setManageColumnsOpenviewassetreturn(true);
    };
    const handleCloseManageColumnsViewassetreturn = () => {
        setManageColumnsOpenviewassetreturn(false);
        setSearchQueryManageViewassetreturn("");
    };

    const getRowClassNameViewassetreturn = (params) => {
        if (selectedRowsViewasset.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const initialColumnVisibilityViewassetreturn = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        material: true,
        productname: true,
        employeenameto: true,
        handover: true,
        countquantity: true,
        addedbyname: true,
        addedby: true,
        actions: true,
    };

    const [columnVisibilityViewassetreturn, setColumnVisibilityViewassetreturn] =
        useState(initialColumnVisibilityViewassetreturn);

    const [itemsViewassetreturn, setItemsViewassetreturn] = useState([]);

    const addSerialNumberViewassetreturn = () => {
        const itemsWithSerialNumberViewassetreturn = assetlog?.map(
            (item, index) => ({
                ...item,
                serialNumber: index + 1,
                // addedbyname: (item.addedby[0].empname),
                addedby: moment(item.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss a"),
            })
        );
        setItemsViewassetreturn(itemsWithSerialNumberViewassetreturn);
    };

    useEffect(() => {
        addSerialNumberViewassetreturn();
    }, [assetlog]);

    //Datatable
    const handlePageChangeViewassetreturn = (newPage) => {
        setPageViewassetreturn(newPage);
        setSelectedRowsViewassetreturn([]);
    };

    const handlePageSizeChangeviewassetreturn = (event) => {
        setPageSizeViewassetreturn(Number(event.target.value));
        setPageViewassetreturn(1);
    };

    //datatable....
    const handleSearchChangeviewassetreturn = (event) => {
        setSelectedRowsViewassetreturn(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermsViewassetreturn = searchQueryViewassetreturn
        .toLowerCase()
        .split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasViewassetreturn = itemsViewassetreturn?.filter((item) => {
        return searchTermsViewassetreturn.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataViewassetreturn = filteredDatasViewassetreturn?.slice(
        (pageViewassetreturn - 1) * pageSizeviewassetreturn,
        pageViewassetreturn * pageSizeviewassetreturn
    );

    const totalPagesViewassetreturn = Math.ceil(
        filteredDatasViewassetreturn?.length / pageSizeviewassetreturn
    );

    const visiblePagesviewassetreturn = Math.min(totalPagesViewassetreturn, 3);

    const firstVisiblePageviewassetreturn = Math.max(1, pageViewassetreturn - 1);
    const lastVisiblePageViewassetreturn = Math.min(
        firstVisiblePageviewassetreturn + visiblePagesviewassetreturn - 1,
        totalPagesViewassetreturn
    );

    const pageNumbersViewassetreturn = [];

    const indexOfLastItemviewassetreturn =
        pageViewassetreturn * pageSizeviewassetreturn;
    const indexOfFirstItemViewassetreturn =
        indexOfLastItemviewassetreturn - pageSizeviewassetreturn;

    for (
        let i = firstVisiblePageviewassetreturn;
        i <= lastVisiblePageViewassetreturn;
        i++
    ) {
        pageNumbersViewassetreturn.push(i);
    }

    const columnDataTableviewassetreturn = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 180,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 140,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 140,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 140,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 140,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        {
            field: "productname",
            headerName: "Material",
            flex: 0,
            width: 200,
            hide: !columnVisibility.productname,
            headerClassName: "bold-header",
        },
        {
            field: "countquantity",
            headerName: "Quantity",
            flex: 0,
            width: 200,
            hide: !columnVisibility.countquantity,
            headerClassName: "bold-header",
        },
        {
            field: "employeenameto",
            headerName: "Employee",
            flex: 0,
            width: 200,
            hide: !columnVisibility.employeenameto,
            headerClassName: "bold-header",
        },
        {
            field: "handover",
            headerName: "Status",
            flex: 0,
            width: 200,
            hide: !columnVisibility.handover,
            headerClassName: "bold-header",
        },
        {
            field: "addedby",
            headerName: "Date & Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.addedby,
            headerClassName: "bold-header",
        },
    ];

    const rowDataTableViewassetreturn = filteredDataViewassetreturn.map(
        (item, index) => {
            return {
                id: item.serialNumber,
                serialNumber: item.serialNumber,
                ids: item._id,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                floor: item.floor,
                area: item.area,
                location: item.location,
                material: item.material,
                handover: item.handover,
                productname: item.material,
                countquantity: item.countquantity,
                employeenameto: item.employeenameto,
                addedby: item.addedby,
                addedbyname: item.addedbyname,
            };
        }
    );

    const rowsWithCheckboxesViewassetreturn = rowDataTableViewassetreturn.map(
        (row) => ({
            ...row,
            // Create a custom field for rendering the checkbox
            checkbox: selectedRowsViewassetreturn.includes(row.id),
        })
    );

    // Show All Columns functionality
    const handleShowAllColumnsViewassetreturn = () => {
        const updatedVisibilityViewassetreturn = {
            ...columnVisibilityViewassetreturn,
        };
        for (const columnKey in updatedVisibilityViewassetreturn) {
            updatedVisibilityViewassetreturn[columnKey] = true;
        }
        setColumnVisibilityViewassetreturn(updatedVisibilityViewassetreturn);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibilityViewassetreturn = localStorage.getItem(
            "columnVisibilityassetreturn"
        );
        if (savedVisibilityViewassetreturn) {
            setColumnVisibilityViewassetreturn(
                JSON.parse(savedVisibilityViewassetreturn)
            );
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem(
            "columnVisibilityViewassetreturn",
            JSON.stringify(columnVisibilityViewassetreturn)
        );
    }, [columnVisibilityViewassetreturn]);

    // // Function to filter columns based on search query
    const filteredColumnsViewassetreturn = columnDataTableviewassetreturn.filter(
        (column) =>
            column.headerName
                .toLowerCase()
                .includes(searchQueryManageViewassetreturn.toLowerCase())
    );

    const [oleqty, setOldQty] = useState(0);

    const handleEditTodocheck = (index) => {
        setEditingIndexcheck(index);
        setQuantityedit(todoscheck[index].returnqty);
        setOldQty(todoscheck[index].countquantity);
    };
    const handleUpdateTodocheck = () => {
        const company = quantityedit ? quantityedit : "";

        const newTodoscheck = [...todoscheck];
        if (newTodoscheck[editingIndexcheck].countquantity >= company) {
            newTodoscheck[editingIndexcheck].returnqty = company;
            setEditingIndexcheck(-1);
        } else {
            setPopupContentMalert("Please Enter Less Than Actual Quantity!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        setTodoscheck(newTodoscheck);
        setEditingIndexcheck(-1);

        // }
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");

    return (
        <Box>
            <Headtitle title={"STOCK MANGEMENT"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Manage Stock Management</Typography> */}
            <PageHeading
                title="Manage Stock Management"
                modulename="Asset"
                submodulename="Stock"
                mainpagename="Stock Management"
                subpagename=""
                subsubpagename=""
            />

            {isUserRoleCompare?.includes("astockmanagement") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Stock Management
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {/* <MultiSelect options={companies} value={selectedCompanyTo} onChange={handleCompanyChangeTo} valueRenderer={customValueRendererCompanyTo} labelledBy="Please Select Company" /> */}
                                        <Selects
                                            // options={companysto}
                                            options={accessbranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={{
                                                label: stockManage.companyto,
                                                value: stockManage.companyto,
                                            }}
                                            onChange={(e) => {
                                                setStockManage({ ...stockManage, companyto: e.value });

                                                setSelectedBranchTo([]);
                                                setSelectedUnitTo([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            // options={Array.from(
                                            //   new Set(
                                            //     branchsto
                                            //       ?.filter(
                                            //         (comp) => stockManage.companyto === comp.company
                                            //       )
                                            //       ?.map((com) => com.name)
                                            //   )
                                            // ).map((name) => ({
                                            //   label: name,
                                            //   value: name,
                                            // }))}
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    stockManage.companyto === comp.company
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedBranchTo}
                                            onChange={handleBranchChangeTo}
                                            valueRenderer={customValueRendererBranchTo}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            // options={Array.from(
                                            //   new Set(
                                            //     unitsto
                                            //       ?.filter((comp) =>
                                            //         selectedBranchTo
                                            //           .map((item) => item.value)
                                            //           .includes(comp.branch)
                                            //       )
                                            //       ?.map((com) => com.name)
                                            //   )
                                            // ).map((name) => ({
                                            //   label: name,
                                            //   value: name,
                                            // }))}
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    selectedBranchTo
                                                        .map((item) => item.value)
                                                        .includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedUnitTo}
                                            onChange={handleUnitChangeTo}
                                            valueRenderer={customValueRendererUnitTo}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Stock</Typography>
                                        <Selects
                                            options={requestModeOptions}
                                            styles={colourStyles}
                                            value={{
                                                label: stockManage.requestmode,
                                                value: stockManage.requestmode,
                                            }}
                                            onChange={(e) => {
                                                setStockManage({
                                                    ...stockManage,
                                                    requestmode: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        sx={buttonStyles.buttonsubmit}
                                        onClick={handleSubmit}
                                    >
                                        Filter
                                    </Button>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}
            <br /> <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lstockmanagement") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Stock Management List
                            </Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={stock?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                md={8}
                                xs={12}
                                sm={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    {isUserRoleCompare?.includes("excelstockmanagement") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchStock();
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvstockmanagement") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    fetchStock();
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printstockmanagement") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfstockmanagement") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                    fetchStock();
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                        {" "}
                                        <ImageIcon
                                            sx={{ fontSize: "15px" }}
                                        /> &ensp;Image&ensp;{" "}
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <AggregatedSearchBar
                                    columnDataTable={columnsnew}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={stock}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={stock}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                            Manage Columns
                        </Button>
                        &ensp;
                        {/* {isUserRoleCompare?.includes("bdstockmanagement") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                                Bulk Delete
                            </Button>
                        )} */}
                        <br />
                        <br />
                        {projectCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots
                                        height="80"
                                        width="80"
                                        radius="9"
                                        color="#1976d2"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClassName=""
                                        visible={true}
                                    />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden" }}>
                                    <>
                                        <AggridTable
                                            rowDataTable={rowDataTable}
                                            columnDataTable={columnsnew}
                                            columnVisibility={columnVisibility}
                                            page={page}
                                            setPage={setPage}
                                            pageSize={pageSize}
                                            totalPages={totalPages}
                                            setColumnVisibility={setColumnVisibility}
                                            isHandleChange={isHandleChange}
                                            items={items}
                                            selectedRows={selectedRows}
                                            setSelectedRows={setSelectedRows}
                                            gridRefTable={gridRefTable}
                                            paginated={false}
                                            filteredDatas={filteredDatas}
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={stock}
                                        />
                                    </>
                                </Box>
                            </>
                        )}
                        {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* ****** Table End ****** */}
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>

            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Handover Count
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={companys}
                                            styles={colourStyles}
                                            value={{
                                                label: stockManagehand.company,
                                                value: stockManagehand.company,
                                            }}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select AssetMaterial",
                                                    employeenameto: "Please Select Employee",
                                                });
                                                setUnits([]);
                                                setFloors([]);
                                                setAreas([]);
                                                // setTeamOption([])
                                                // setEmployeesall([])
                                                setLocations([{ label: "ALL", value: "ALL" }]);
                                                fetchBranchDropdowns(e);
                                                fetchUnits(e);
                                                fetchFloor(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={branchs}
                                            styles={colourStyles}
                                            value={{
                                                label: stockManagehand.branch,
                                                value: stockManagehand.branch,
                                            }}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select AssetMaterial",
                                                    employeenameto: "Please Select Employee",
                                                });
                                                setLocations([{ label: "ALL", value: "ALL" }]);
                                                fetchUnits(e);
                                                fetchFloor(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={units}
                                            styles={colourStyles}
                                            value={{
                                                label: stockManagehand.unit,
                                                value: stockManagehand.unit,
                                            }}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    unit: e.value,
                                                    workstation: "",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Team<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={teamoption
                                                .filter((d) => d.unit === stockManagehand.unit)
                                                .map((d) => ({
                                                    ...d,
                                                    label: d.teamname,
                                                    value: d.teamname,
                                                }))}
                                            styles={colourStyles}
                                            value={{
                                                label: stockManagehand.team,
                                                value: stockManagehand.team,
                                            }}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,

                                                    team: e.value,
                                                    employeenameto: "Please Select Employee",
                                                });
                                                setLocations([{ label: "ALL", value: "ALL" }]);
                                                fetchArea(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Name <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={employeesall
                                                ?.filter(
                                                    (comp) =>
                                                        stockManagehand.company === comp.company &&
                                                        stockManagehand.branch === comp.branch &&
                                                        stockManagehand.unit === comp.unit &&
                                                        stockManagehand.team === comp.team
                                                )
                                                ?.map((com) => ({
                                                    ...com,
                                                    label: com.companyname,
                                                    value: com.companyname,
                                                }))}
                                            value={{
                                                label: stockManagehand.employeenameto,
                                                value: stockManagehand.employeenameto,
                                            }}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    employeenameto: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Qty<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Quantity"
                                            value={stockManagehand.countquantity}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    countquantity:
                                                        e.target.value > 0 ? e.target.value : 0,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={handlesubmitstock}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>


            {/* USED COUNT */}


            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpenused}
                    onClose={handleClickOpenEditused}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                    }}
                >
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>
                                    Usage Count
                                </Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={statusOpt}
                                            styles={colourStyles}
                                            value={{ label: stockManagehand.type, value: stockManagehand.type }}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    type: e.value,
                                                });

                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                {stockManagehand.type === "Employee" && (
                                    <>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={companys}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.company,
                                                        value: stockManagehand.company,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            company: e.value,
                                                            branch: "Please Select Branch",
                                                            unit: "Please Select Unit",
                                                            floor: "Please Select Floor",
                                                            area: "Please Select Area",
                                                            location: "Please Select Location",
                                                            assetmaterial: "Please Select AssetMaterial",
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setUnits([]);
                                                        setFloors([]);
                                                        setAreas([]);
                                                        // setTeamOption([])
                                                        // setEmployeesall([])
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchBranchDropdowns(e);
                                                        fetchUnits(e);
                                                        fetchFloor(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={branchs}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.branch,
                                                        value: stockManagehand.branch,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            branch: e.value,
                                                            unit: "Please Select Unit",
                                                            floor: "Please Select Floor",
                                                            area: "Please Select Area",
                                                            location: "Please Select Location",
                                                            assetmaterial: "Please Select AssetMaterial",
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchUnits(e);
                                                        fetchFloor(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={units}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.unit,
                                                        value: stockManagehand.unit,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            unit: e.value,
                                                            workstation: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Floor<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={floors}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.floor,
                                                        value: stockManagehand.floor,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            floor: e.value,
                                                            workstation: "",
                                                            area: "Please Select Area",
                                                        });
                                                        // setAreas([]);
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchArea(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Area<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={areas}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.area,
                                                        value: stockManagehand.area,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            area: e.value,
                                                            workstation: "",
                                                            location: "Please Select Location",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchLocation(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Location<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={locations}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.location,
                                                        value: stockManagehand.location,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            location: e.value,
                                                            workstation: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Team<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={teamoption
                                                        .filter((d) => d.unit === stockManagehand.unit)
                                                        .map((d) => ({
                                                            ...d,
                                                            label: d.teamname,
                                                            value: d.teamname,
                                                        }))}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.team,
                                                        value: stockManagehand.team,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,

                                                            team: e.value,
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchArea(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Employee Name <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={employeesall
                                                        ?.filter(
                                                            (comp) =>
                                                                stockManagehand.company === comp.company &&
                                                                stockManagehand.branch === comp.branch &&
                                                                stockManagehand.unit === comp.unit &&
                                                                stockManagehand.team === comp.team
                                                        )
                                                        ?.map((com) => ({
                                                            ...com,
                                                            label: com.companyname,
                                                            value: com.companyname,
                                                        }))}
                                                    value={{
                                                        label: stockManagehand.employeenameto,
                                                        value: stockManagehand.employeenameto,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            employeenameto: e.value,
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                )}

                                {stockManagehand.type === "Location" && (
                                    <>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Company<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={companys}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.company,
                                                        value: stockManagehand.company,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            company: e.value,
                                                            branch: "Please Select Branch",
                                                            unit: "Please Select Unit",
                                                            floor: "Please Select Floor",
                                                            area: "Please Select Area",
                                                            location: "Please Select Location",
                                                            assetmaterial: "Please Select AssetMaterial",
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setUnits([]);
                                                        setFloors([]);
                                                        setAreas([]);
                                                        // setTeamOption([])
                                                        // setEmployeesall([])
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchBranchDropdowns(e);
                                                        fetchUnits(e);
                                                        fetchFloor(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Branch<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={branchs}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.branch,
                                                        value: stockManagehand.branch,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            branch: e.value,
                                                            unit: "Please Select Unit",
                                                            floor: "Please Select Floor",
                                                            area: "Please Select Area",
                                                            location: "Please Select Location",
                                                            assetmaterial: "Please Select AssetMaterial",
                                                            employeenameto: "Please Select Employee",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchUnits(e);
                                                        fetchFloor(e);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    {" "}
                                                    Unit<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={units}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.unit,
                                                        value: stockManagehand.unit,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            unit: e.value,
                                                            workstation: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Floor<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={floors}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.floor,
                                                        value: stockManagehand.floor,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            floor: e.value,
                                                            workstation: "",
                                                            area: "Please Select Area",
                                                        });
                                                        // setAreas([]);
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchArea(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Area<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={areas}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.area,
                                                        value: stockManagehand.area,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            area: e.value,
                                                            workstation: "",
                                                            location: "Please Select Location",
                                                        });
                                                        setLocations([{ label: "ALL", value: "ALL" }]);
                                                        fetchLocation(e.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Location<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <Selects
                                                    options={locations}
                                                    styles={colourStyles}
                                                    value={{
                                                        label: stockManagehand.location,
                                                        value: stockManagehand.location,
                                                    }}
                                                    onChange={(e) => {
                                                        setStockManagehand({
                                                            ...stockManagehand,
                                                            location: e.value,
                                                            workstation: "",
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>


                                    </>
                                )}

                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Qty<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            sx={userStyle.input}
                                            placeholder="Please Enter Quantity"
                                            value={stockManagehand.countquantity}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    countquantity:
                                                        e.target.value > 0 ? e.target.value : 0,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Description<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={stockManagehand.description}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    description: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b> </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={stockManagehand.usagedate}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    usagedate: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Time <b style={{ color: "red" }}>*</b></Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="time"
                                            value={stockManagehand.usagetime}
                                            onChange={(e) => {
                                                setStockManagehand({
                                                    ...stockManagehand,
                                                    usagetime: e.target.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained"
                                    // onClick={handlesubmitstock}
                                    >
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEditused}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>



            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpenReturn}
                    onClose={handleCloseModEditReturn}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                >
                    <Box sx={{ padding: "20px " }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Return Count</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <br />
                                <Table>
                                    <TableHead>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {"SNO"}.
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Company"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Branch"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Unit"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Floor"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Area"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Location"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Material"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Employee"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Actual Quantity"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Return Quantity"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Date"}
                                        </StyledTableCell>
                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                                            {" "}
                                            {"Actions"}
                                        </StyledTableCell>
                                    </TableHead>
                                    <TableBody>
                                        {todoscheck?.length > 0 &&
                                            todoscheck.map((item, index, i) => (
                                                <>
                                                    {editingIndexcheck === index ? (
                                                        <StyledTableRow key={index}>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {index + 1}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.company}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.branch}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.unit}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.floor}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.area}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.location}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.productname}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.employeenameto}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.countquantity}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                <OutlinedInput
                                                                    id="component-outlined"
                                                                    type="number"
                                                                    sx={userStyle.input}
                                                                    value={quantityedit}
                                                                    onChange={(e) => {
                                                                        handleChangephonenumberEdit(
                                                                            e,
                                                                            item.countquantity
                                                                        );
                                                                        // getHighestEmpcodeForBranchhigh(valuecateedit)
                                                                    }}
                                                                />
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {moment(
                                                                    item.addedby ? item.addedby[0]?.date : ""
                                                                ).format("DD-MM-YYYY hh:mm:ss a")}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        minWidth: "20px",
                                                                        minHeight: "41px",
                                                                        background: "transparent",
                                                                        boxShadow: "none",
                                                                        marginTop: "-3px !important",
                                                                        "&:hover": {
                                                                            background: "#f4f4f4",
                                                                            borderRadius: "50%",
                                                                            minHeight: "41px",
                                                                            minWidth: "20px",
                                                                            boxShadow: "none",
                                                                        },
                                                                    }}
                                                                    onClick={handleUpdateTodocheck}
                                                                >
                                                                    <CheckCircleIcon
                                                                        style={{
                                                                            color: "#216d21",
                                                                            fontSize: "1.5rem",
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ) : (
                                                        <StyledTableRow>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {index + 1}.
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.company}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.branch}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.unit}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.floor}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.area}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.location}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.productname}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.employeenameto}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.countquantity}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {item.returnqty}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                {moment(
                                                                    item.addedby ? item.addedby[0]?.date : ""
                                                                ).format("DD-MM-YYYY hh:mm:ss a")}
                                                            </StyledTableCell>
                                                            <StyledTableCell
                                                                sx={{ padding: "5px 10px !important" }}
                                                            >
                                                                {" "}
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        minWidth: "20px",
                                                                        minHeight: "41px",
                                                                        background: "transparent",
                                                                        boxShadow: "none",
                                                                        marginTop: "-13px !important",
                                                                        "&:hover": {
                                                                            background: "#f4f4f4",
                                                                            borderRadius: "50%",
                                                                            minHeight: "41px",
                                                                            minWidth: "20px",
                                                                            boxShadow: "none",
                                                                        },
                                                                    }}
                                                                    onClick={() => handleEditTodocheck(index)}
                                                                >
                                                                    <FaEdit
                                                                        style={{
                                                                            color: "#1976d2",
                                                                            fontSize: "1.2rem",
                                                                        }}
                                                                    />
                                                                </Button>{" "}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    )}
                                                </>
                                            ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                            <br />
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={handlesubmitstockReturn}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button
                                        sx={userStyle.btncancel}
                                        onClick={handleCloseModEditReturn}
                                    >
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <Dialog
                open={openviewalertvendor}
                onClose={handleClickOpenviewalertvendor}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                sx={{
                    marginTop: "95px"
                }}
                fullWidth={true}
            >
                <AssetDetails
                    sendDataToParentUI={handleDataFromChildUIDeign}
                    stockedit={stockedit}
                    handleCloseviewalertvendor={handleCloseviewalertvendor}

                />
            </Dialog>
            <br />
            <Dialog
                open={openviewalertvendorstock}
                onClose={handleClickOpenviewalertvendorstock}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                sx={{
                    marginTop: "95px"
                }}
                fullWidth={true}
            >
                <Stockmaster
                    sendDataToParentUIStock={handleDataFromChildUIDeignStock}
                    openpop={!openviewalertvendorstock}
                    stockmaterialedit={stockmaterialedit}
                    handleCloseviewalertvendorstock={handleCloseviewalertvendorstock}
                />
            </Dialog>
            <Dialog
                open={openView}
                onClose={handleViewOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
            >
                <Box sx={{ padding: "20px" }}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={8} sm={8}>
                            <Typography sx={userStyle.importheadtext}>
                                View Stock Material Log
                            </Typography>
                        </Grid>
                        <Grid item xs={4} md={4} sm={4}>
                            <Box
                                sx={{ display: "flex", justifyContent: "end", width: "100%" }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlViewClose}
                                >
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <br />

                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select
                                    id="pageSizeSelect"
                                    value={pageSizeview}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeview}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={stocklog?.length}>All</MenuItem>
                                </Select>
                            </Box>
                        </Grid>
                        <Grid
                            item
                            md={8}
                            xs={12}
                            sm={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        ></Grid>
                        <Grid item md={2} xs={6} sm={6}>
                            <Box>
                                <FormControl fullWidth size="small">
                                    <Typography>Search</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={searchQueryView}
                                        onChange={handleSearchChangeview}
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    {/* <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsView}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsView}>
                        Manage Columns
                    </Button> */}
                    {/* Manage Column */}
                    <Popover
                        id={idView}
                        open={isManageColumnsOpenview}
                        anchorEl={anchorElView}
                        onClose={handleCloseManageColumnsview}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                    >
                        {manageColumnsContentview}
                    </Popover>

                    <br />
                    <br />

                    <>
                        <Box
                            style={{
                                width: "100%",
                                overflowY: "hidden", // Hide the y-axis scrollbar
                            }}
                        >
                            <StyledDataGrid
                                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                rows={rowsWithCheckboxesView}
                                columns={columnDataTableview}
                                selectionModel={selectedRowsView}
                                autoHeight={true}
                                ref={gridRefview}
                                density="compact"
                                hideFooter
                                getRowClassName={getRowClassNameView}
                                disableRowSelectionOnClick
                            />
                        </Box>
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing{" "}
                                {filteredDataView.length > 0
                                    ? (pageView - 1) * pageSizeview + 1
                                    : 0}{" "}
                                to {Math.min(pageView * pageSizeview, filteredDatasView.length)}{" "}
                                of {filteredDatasView.length} entries
                            </Box>
                            <Box>
                                <Button
                                    onClick={() => setPageView(1)}
                                    disabled={pageView === 1}
                                    sx={userStyle.paginationbtn}
                                >
                                    <FirstPageIcon />
                                </Button>
                                <Button
                                    onClick={() => handlePageChangeView(pageView - 1)}
                                    disabled={pageView === 1}
                                    sx={userStyle.paginationbtn}
                                >
                                    <NavigateBeforeIcon />
                                </Button>
                                {pageNumbersView?.map((pageNumberView) => (
                                    <Button
                                        key={pageNumberView}
                                        sx={userStyle.paginationbtn}
                                        onClick={() => handlePageChangeView(pageNumberView)}
                                        className={pageView === pageNumberView ? "active" : ""}
                                        disabled={pageView === pageNumberView}
                                    >
                                        {pageNumberView}
                                    </Button>
                                ))}
                                {lastVisiblePageView < totalPagesView && <span>...</span>}
                                <Button
                                    onClick={() => handlePageChangeView(pageView + 1)}
                                    disabled={pageView === totalPagesView}
                                    sx={userStyle.paginationbtn}
                                >
                                    <NavigateNextIcon />
                                </Button>
                                <Button
                                    onClick={() => setPageView(totalPagesView)}
                                    disabled={pageView === totalPagesView}
                                    sx={userStyle.paginationbtn}
                                >
                                    <LastPageIcon />
                                </Button>
                            </Box>
                        </Box>


                        <br />
                    </>
                </Box>
            </Dialog>
            <Dialog
                open={openViewasset}
                onClose={handleViewOpenAsset}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: "20px" }}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid container spacing={2}>
                        <Grid item xs={8} md={8} sm={8}>
                            <Typography sx={userStyle.importheadtext}>
                                View Asset Material Log
                            </Typography>
                        </Grid>
                        <Grid item xs={4} md={4} sm={4}>
                            <Box
                                sx={{ display: "flex", justifyContent: "end", width: "100%" }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlViewCloseAsset}
                                >
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid style={userStyle.dataTablestyle}>
                        <Box>
                            <label>Show entries:</label>
                            <Select
                                id="pageSizeSelect"
                                value={pageSize}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 180,
                                            width: 80,
                                        },
                                    },
                                }}
                                onChange={handlePageSizeChangeviewasset}
                                sx={{ width: "77px" }}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={assetlog?.length}>All</MenuItem>
                            </Select>
                        </Box>
                        <Box>
                            <FormControl fullWidth size="small">
                                <Typography>Search</Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={searchQueryViewasset}
                                    onChange={handleSearchChangeviewasset}
                                />
                            </FormControl>
                        </Box>
                    </Grid>
                    <br />
                    <br />
                    {/* <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                            handleShowAllColumnsViewasset();
                            setColumnVisibilityViewasset(initialColumnVisibilityViewasset);
                        }}
                    >
                        Show All Columns
                    </Button>
                    &emsp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsViewasset}>
                        Manage Columns
                    </Button> */}
                    &emsp;
                    {/* Manage Column */}
                    <Popover
                        id={idViewasset}
                        open={isManageColumnsOpenviewasset}
                        anchorEl={anchorElViewasset}
                        onClose={handleCloseManageColumnsViewasset}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                    >
                        {manageColumnsContentviewasset}
                    </Popover>
                    <br />
                    <br />
                    <>
                        <Box
                            style={{
                                width: "100%",
                                overflowY: "hidden", // Hide the y-axis scrollbar
                            }}
                        >
                            <StyledDataGrid
                                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                rows={rowsWithCheckboxesViewasset}
                                columns={columnDataTableviewasset}
                                selectionModel={selectedRowsViewasset}
                                autoHeight={true}
                                ref={gridRefviewasset}
                                density="compact"
                                hideFooter
                                getRowClassName={getRowClassNameViewasset}
                                disableRowSelectionOnClick
                            />
                        </Box>
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing{" "}
                                {filteredDataViewasset.length > 0
                                    ? (pageViewasset - 1) * pageSizeviewasset + 1
                                    : 0}{" "}
                                to{" "}
                                {Math.min(
                                    pageViewasset * pageSizeviewasset,
                                    filteredDatasViewasset.length
                                )}{" "}
                                of {filteredDatasViewasset.length} entries
                            </Box>
                            <Box>
                                <Button
                                    onClick={() => setPageViewasset(1)}
                                    disabled={pageViewasset === 1}
                                    sx={userStyle.paginationbtn}
                                >
                                    <FirstPageIcon />
                                </Button>
                                <Button
                                    onClick={() => handlePageChangeView(pageViewasset - 1)}
                                    disabled={pageViewasset === 1}
                                    sx={userStyle.paginationbtn}
                                >
                                    <NavigateBeforeIcon />
                                </Button>

                                {pageNumbersView?.map((pageNumberViewasset) => (
                                    <Button
                                        key={pageNumberViewasset}
                                        sx={userStyle.paginationbtn}
                                        onClick={() => handlePageChange(pageNumberViewasset)}
                                        className={
                                            pageViewasset === pageNumberViewasset ? "active" : ""
                                        }
                                        disabled={pageViewasset === pageNumberViewasset}
                                    >
                                        {pageNumberViewasset}
                                    </Button>
                                ))}
                                {lastVisiblePageViewasset < totalPagesViewasset && (
                                    <span>...</span>
                                )}
                                <Button
                                    onClick={() => handlePageChangeViewasset(pageViewasset + 1)}
                                    disabled={pageViewasset === totalPagesViewasset}
                                    sx={userStyle.paginationbtn}
                                >
                                    <NavigateNextIcon />
                                </Button>
                                <Button
                                    onClick={() => setPageView(totalPagesViewasset)}
                                    disabled={pageViewasset === totalPagesViewasset}
                                    sx={userStyle.paginationbtn}
                                >
                                    <LastPageIcon />
                                </Button>
                            </Box>
                        </Box>

                        <br />
                    </>
                </Box>
            </Dialog>
            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={stock ?? []}
                filename={"StockManagement"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default StockManagement;
