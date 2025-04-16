import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, Radio, InputAdornment, RadioGroup, Tooltip, FormGroup, FormControlLabel, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, TextareaAutosize } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaSearch } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@material-ui/core";
import Selects from "react-select";
import StyledDataGrid from "../../components/TableStyle";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import LoadingButton from "@mui/lab/LoadingButton";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import domtoimage from "dom-to-image";
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";

function AssetMaterialIP() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);

    const [filteteredip, SetFilteredIp] = useState([]);

    const [maintentancemaster, setMaintentancemaster] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        assetmaterial: "Please Select Material",
        assetmaterialcheck: "",
        ip: true,
        ebusage: true,
        empdistribution: true,
        maintenance: true,
        operatingsoftware: true,
        addedby: "",
        updatedby: "",
    });

    const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
    const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
    const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);

    const [selectedCompanyFromCreate, setSelectedCompanyFromCreate] = useState([]);
    const [selectedBranchFromCreate, setSelectedBranchFromCreate] = useState([]);
    const [selectedUnitFromCreate, setSelectedUnitFromCreate] = useState([]);
    const [selectedFloorFromCreate, setSelectedFloorFromCreate] = useState([]);
    const [selectedAreaFromCreate, setSelectedAreaFromCreate] = useState([]);
    const [selectedLocationFromCreate, setSelectedLocationFromCreate] = useState([]);

    //branch multiselect dropdown changes
    const handleCompanyChangeFrom = (options) => {
        setSelectedCompanyFrom(options);
        setSelectedBranchFrom([]);
        setSelectedUnitFrom([]);
    };
    const customValueRendererCompanyFrom = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Company";
    };

    //branch multiselect dropdown changes
    const handleBranchChangeFrom = (options) => {
        setSelectedBranchFrom(options);
        setSelectedUnitFrom([]);
    };
    const customValueRendererBranchFrom = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Branch";
    };

    //branch multiselect dropdown changes
    const handleUnitChangeFrom = (options) => {
        setSelectedUnitFrom(options);
    };
    const customValueRendererUnitFrom = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
    };

    //create
    //branch multiselect dropdown changes
    const handleCompanyChangeFromCreate = (options) => {
        setSelectedCompanyFromCreate(options);
        setMaintentancemaster({
            ...maintentancemaster,
            assetmaterial: "Please Select Material",
        });

        setSelectedBranchFromCreate([]);
        setSelectedUnitFromCreate([]);
        setSelectedAreaFromCreate([]);
        setSelectedUnitFromCreate([]);
        setSelectedFloorFromCreate([]);
        setSelectedLocationFromCreate([]);
        setSelectedOptionsMaterial([]);
        setSelectedOptionsComponent([]);
        setValueComponentCat([]);
        setFloors([]);
        setAreas([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        setAssetdetails([]);
    };
    const customValueRendererCompanyFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Company";
    };

    //branch multiselect dropdown changes
    const handleBranchChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);
        setSelectedBranchFromCreate(options);
        setMaintentancemaster({
            ...maintentancemaster,
            assetmaterial: "Please Select Material",
        });
        setSelectedUnitFromCreate([]);
        setSelectedAreaFromCreate([]);
        setSelectedFloorFromCreate([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        setAreas([]);
        fetchFloor(selectedValues);
        setSelectedOptionsMaterial([]);
        setSelectedOptionsComponent([]);
        setAssetdetails([]);
    };
    const customValueRendererBranchFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Branch";
    };

    //branch multiselect dropdown changes
    const handleUnitChangeFromCreate = (options) => {
        setSelectedUnitFromCreate(options);
        setMaintentancemaster({
            ...maintentancemaster,
            assetmaterial: "Please Select Material",
        });
        setSelectedAreaFromCreate([]);
        setAssetdetails([]);
        setSelectedOptionsComponent([]);
        setSelectedFloorFromCreate([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
    };
    const customValueRendererUnitFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
    };

    const handleFloorChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);
        setSelectedFloorFromCreate(options);

        setMaintentancemaster({
            ...maintentancemaster,
            assetmaterial: "Please Select Material",
        });
        setSelectedOptionsMaterial([]);
        setSelectedOptionsComponent([]);
        setAreas([]);
        setAssetdetails([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        fetchArea(selectedValues);
    };
    const customValueRendererFloorFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Floor";
    };

    const handleAreaChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);

        setSelectedAreaFromCreate(options);
        setSelectedOptionsComponent([]);
        setMaintentancemaster({
            ...maintentancemaster,
            assetmaterial: "Please Select Material",
        });
        fetchLocation(selectedValues);
        setAssetdetails([]);
    };
    const customValueRendererAreaFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Area";
    };

    const handleLocationChangeFromCreate = (options) => {
        setSelectedLocationFromCreate(options);
        setSelectedOptionsComponent([]);
        setMaintentancemaster({
            ...maintentancemaster,
            assetmaterial: "Please Select Material",
        });
        // setAssetdetails([])
    };
    const customValueRendererLocationFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Location";
    };

    const [filteredRowDataNear, setFilteredRowDataNear] = useState([]);
    const [filteredChangesNear, setFilteredChangesNear] = useState(null);
    const [searchedStringNear, setSearchedStringNear] = useState("");
    const [isHandleChangeNear, setIsHandleChangeNear] = useState(false);
    const gridRefTableImgNear = useRef(null);
    const gridRefTableNear = useRef(null);

    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    // const [totalPages, setTotalPages] = useState(0);
    const [deletecheck, setdeletecheck] = useState(false);

    const [overallFilterdataNear, setOverallFilterdataNear] = useState([]);
    const [totalProjectsNear, setTotalProjectsNear] = useState(0);
    const [totalPagesNear, setTotalPagesNear] = useState(0);
    const [deletecheckNear, setdeletecheckNear] = useState(false);

    const [searchQueryNearTatPrimary, setSearchQueryNearTatPrimary] = useState("");

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    //  const [filteredRowData, setFilteredRowData] = useState([]);
    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

    // State to track advanced filter
    const [advancedFilterNear, setAdvancedFilterNear] = useState(null);
    const [gridApiNear, setGridApiNear] = useState(null);
    const [columnApiNear, setColumnApiNear] = useState(null);
    const [filteredDataItemsNear, setFilteredDataItemsNear] = useState([]);
    //  const [filteredRowData, setFilteredRowData] = useState([]);
    const [logicOperatorNear, setLogicOperatorNear] = useState("AND");

    const [selectedColumnNear, setSelectedColumnNear] = useState("");
    const [selectedConditionNear, setSelectedConditionNear] = useState("Contains");
    const [filterValueNear, setFilterValueNear] = useState("");
    const [additionalFiltersNear, setAdditionalFiltersNear] = useState([]);
    const [isSearchActiveNear, setIsSearchActiveNear] = useState(false);
    const conditionsNear = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setloadingdeloverall(false);
    };
    const handleClosePopupMalert = () => {
        setOpenPopupMalert(false);
        setloadingdeloverall(false);
    };
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
        setloadingdeloverall(false);
    };

    let exportColumnNames = ["Company", "Branch", "Unit", "Floor", "Area", "Location", "Material", "Asset Material", "IP", "ebusage", "Employee Distribution", "Maintenance", "Operating & software"];
    let exportRowValues = ["company", "branch", "unit", "floor", "area", "location", "assetmaterial", "component", "ip", "ebusage", "empdistribution", "maintenance", "operatingsoftware"];

    let exportColumnNamesNear = ["Company", "Branch", "Unit", "Floor", "Area", "Location", "Material", "Asset Material", "IP", "ebusage", "Employee Distribution", "Maintenance", "Operating & software"];
    let exportRowValuesNear = ["company", "branch", "unit", "floor", "area", "location", "assetmaterial", "component", "ip", "ebusage", "empdistribution", "maintenance", "operatingsoftware"];

    const [loadingdeloverall, setloadingdeloverall] = useState(false);
    const gridRef = useRef(null);
    const gridRefNeartat = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowsNear, setSelectedRowsNear] = useState([]);
    const [itemsneartat, setItemsNearTat] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [assetdetails, setAssetdetails] = useState([]);

    const [newcheckbranch, setNewcheckBranch] = useState("Choose Branch");
    const [floors, setFloors] = useState([]);

    const [areas, setAreas] = useState([]);
    const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);

    const [individualasset, setIndividualAsset] = useState([]);
    const [uniqueid, setUniqueid] = useState(0);
    const [idgrpedit, setidgrpedit] = useState([]);
    const [isDeleteOpenNear, setIsDeleteOpenNear] = useState(false);

    const [materialOpt, setMaterialopt] = useState([]);

    const fetchAssetDetails = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ASSETDETAIL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAssetdetails(res_vendor?.data?.assetdetails);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

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
                assettype: d.assettype,
                asset: d.assethead,
            }));

            const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            });
            setMaterialopt(assetmaterialuniqueArray);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchMaterialAll();
    }, []);

    useEffect(() => {
        fetchAssetDetails();
    }, [maintentancemaster.location, maintentancemaster.assetmaterial]);

    const getRowClassNameNearTat = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const handleCaptureImagenear = () => {
        if (gridRefTableImgNear.current) {
            domtoimage
                .toBlob(gridRefTableImgNear.current)
                .then((blob) => {
                    saveAs(blob, "Dynamic Asset Materials_Individual.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChangeNear = (newSelection) => {
        setSelectedRowsNear(newSelection.selectionModel);
    };

    //component multiselect
    const [selectedOptionsComponent, setSelectedOptionsComponent] = useState([]);
    let [valueComponentCat, setValueComponentCat] = useState([]);
    const [selectedComponentOptionsCateEdit, setSelectedComponentOptionsCateEdit] = useState([]);
    const [ComponentValueCateEdit, setComponentValueCateEdit] = useState([]);

    const handleComponentChange = (options) => {
        setValueComponentCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsComponent(options);
    };

    const customValueRendererComponent = (valueComponentCat, _categoryname) => {
        return valueComponentCat?.length ? valueComponentCat.map(({ label }) => label)?.join(", ") : "Please Select Asset Material";
    };

    const handleComponentChangeEdit = (options) => {
        setComponentValueCateEdit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedComponentOptionsCateEdit(options);
    };
    const customValueRendererComponentEdit = (componentValueCateEdit, _employeename) => {
        return componentValueCateEdit?.length ? componentValueCateEdit.map(({ label }) => label)?.join(", ") : "Please Select Asset Material";
    };

    const [areasEdit, setAreasEdit] = useState([]);
    const [locationsEdit, setLocationsEdit] = useState([{ label: "ALL", value: "ALL" }]);

    const [floorsEdit, setFloorEdit] = useState([]);

    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [maintentance, setMaintentance] = useState([]);

    const [maintentancemasteredit, setMaintentancemasteredit] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        assetmaterial: "Please Select Material",
        assetmaterialcheck: "",
        ip: true,
        ebusage: true,
        empdistribution: true,
        maintenance: true,
    });
    const [selectedOptionsMaterial, setSelectedOptionsMaterial] = useState([]);

    const [selectedOptionsMaterialEdit, setSelectedOptionsMaterialEdit] = useState([]);

    const handleMaterialChangeEdit = (options) => {
        setSelectedOptionsMaterialEdit(options);
    };

    const customValueRendererBranchEdit = (valueMaterialCatEdit, _categorynameEdit) => {
        return valueMaterialCatEdit?.length ? valueMaterialCatEdit.map(({ label }) => label)?.join(", ") : "Please Select SubComponents";
    };

    const { isUserRoleCompare, isUserRoleAccess, buttonStyles, isAssignBranch, pageName, setPageName, allfloor, allareagrouping, alllocationgrouping, allTeam, allCompany, allBranch } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [projectCheck, setProjectCheck] = useState(false);
    const [projectCheck1, setProjectCheck1] = useState(false);

    // const accessbranch = isAssignBranch
    //     ?.map((data) => ({
    //         branch: data.branch,
    //         company: data.company,
    //         unit: data.unit,
    //     }))

    // const accessbranch = isAssignBranch
    //     ?.filter((data) => {
    //         let fetfinalurl = [];
    //         // Check if user is a Manager, in which case return all branches
    //         if (isUserRoleAccess?.role?.includes("Manager")) {
    //             return true; // Skip filtering, return all data for Manager
    //         }
    //         if (
    //             data?.modulenameurl?.length !== 0 &&
    //             data?.submodulenameurl?.length !== 0 &&
    //             data?.mainpagenameurl?.length !== 0 &&
    //             data?.subpagenameurl?.length !== 0 &&
    //             data?.subsubpagenameurl?.length !== 0
    //         ) {
    //             fetfinalurl = data.subsubpagenameurl;
    //         } else if (
    //             data?.modulenameurl?.length !== 0 &&
    //             data?.submodulenameurl?.length !== 0 &&
    //             data?.mainpagenameurl?.length !== 0 &&
    //             data?.subpagenameurl?.length !== 0
    //         ) {
    //             fetfinalurl = data.subpagenameurl;
    //         } else if (
    //             data?.modulenameurl?.length !== 0 &&
    //             data?.submodulenameurl?.length !== 0 &&
    //             data?.mainpagenameurl?.length !== 0
    //         ) {
    //             fetfinalurl = data.mainpagenameurl;
    //         } else if (
    //             data?.modulenameurl?.length !== 0 &&
    //             data?.submodulenameurl?.length !== 0
    //         ) {
    //             fetfinalurl = data.submodulenameurl;
    //         } else if (data?.modulenameurl?.length !== 0) {
    //             fetfinalurl = data.modulenameurl;
    //         } else {
    //             fetfinalurl = [];
    //         }

    //         // Check if the pathname exists in the URL
    //         return fetfinalurl?.includes(window.location.pathname);
    //     })
    //     ?.map((data) => ({
    //         branch: data.branch,
    //         company: data.company,
    //         unit: data.unit,
    //     }));

    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
                    fetfinalurl = data.subpagenameurl;
                } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [window.location.pathname?.substring(1), window.location.pathname];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    // console.log(accessbranch, "accessbranch")

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [pageNearTatPrimary, setPageNearTatPrimary] = useState(1);
    const [pageSizeNearTatPrimary, setPageSizeNearTatPrimary] = useState(10);

    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();

    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteproject, setDeleteproject] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allProjectedit, setAllProjectedit] = useState([]);
    const [copiedData, setCopiedData] = useState("");

    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage
                .toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Dynamic Asset Materials_Group.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Error Popup model

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setloadingdeloverall(false);
    };

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
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

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRowsNear.length == 0) {
            setIsDeleteOpenalert(true);
        } else {
            setIsDeleteOpencheckbox(true);
        }
    };
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const [searchQueryManageNeartat, setSearchQueryManageNeartat] = useState("");
    // Manage Columns
    const [isManageColumnsOpenNeartat, setManageColumnsOpenNeartat] = useState(false);
    const [anchorElNeartat, setAnchorElNeartat] = useState(null);
    const handleOpenManageColumnsNeartat = (event) => {
        setAnchorElNeartat(event.currentTarget);
        setManageColumnsOpenNeartat(true);
    };
    const handleCloseManageColumnsNeartat = () => {
        setManageColumnsOpenNeartat(false);
        setSearchQueryManageNeartat("");
    };

    const openneartat = Boolean(anchorElNeartat);
    const idneartat = openneartat ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

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
        assetmaterial: true,
        ip: true,
        ebusage: true,
        empdistribution: true,
        maintenance: true,
        operatingsoftware: true,
        subcomponents: true,
        subcomponentsstring: true,
        component: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const initialColumnVisibilityNeartat = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        area: true,
        location: true,
        assetmaterial: true,
        subcomponents: true,
        subcomponentsstring: true,
        operatingsoftware: true,
        ip: true,
        ebusage: true,
        empdistribution: true,
        maintenance: true,
        component: true,
        actions: true,
    };

    const [columnVisibilityNeartat, setColumnVisibilityNeartat] = useState(initialColumnVisibilityNeartat);

    //Delete model
    const handleClickOpenNear = () => {
        setIsDeleteOpenNear(true);
    };
    const handleCloseModNear = () => {
        setIsDeleteOpenNear(false);
    };

    //set function to get particular row
    const rowData = async (id, idgrp) => {
        setPageName(!pageName);

        try {
            let res = await axios.get(`${SERVICE.ASSETMATERIALIP_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.sassetmaterialip);
            setidgrpedit(idgrp);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //set function to get particular row
    const rowDataNear = async (id, name) => {
        setPageName(!pageName);

        try {
            let res = await axios.get(`${SERVICE.ASSETMATERIALIP_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteproject(res?.data?.sassetmaterialip);
            handleClickOpenNear();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup
    let projectid = deleteproject._id;
    const delProject = async () => {
        setPageName(!pageName);

        try {
            const deletePromises = idgrpedit?.map((item) => {
                return axios.delete(`${SERVICE.ASSETMATERIALIP_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            await Promise.all(deletePromises);
            // await fetchMaintentance();

            await fetchFilteredDatas();
            await fetchMaintentanceIndividualSingle();
            handleCloseMod();
            setSelectedRows([]);
            setPage(1);
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delProjectNear = async () => {
        setPageName(!pageName);

        try {
            await axios.delete(`${SERVICE.ASSETMATERIALIP_SINGLE}/${projectid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            await fetchMaintentanceIndividualSingle();

            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setPageNearTatPrimary(1);
            setIsHandleChange(false);

            handleCloseModNear();
            // setSelectedRowsNear([]);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delProjectcheckbox = async () => {
        setPageName(!pageName);

        try {
            const deletePromises = selectedRowsNear?.map((item) => {
                return axios.delete(`${SERVICE.ASSETMATERIALIP_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);

            await fetchMaintentanceIndividualSingle();
            await fetchFilteredDatas();

            handleCloseModcheckbox();
            setSelectedRowsNear([]);
            setSelectAllCheckedNear(false);
            setPage(1);
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Deleted Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //add function
    const sendRequest = async () => {
        setPageName(!pageName);

        let subarray = selectedOptionsMaterial.map((item) => item.value);
        let uniqueval = uniqueid ? uniqueid + 1 : 1;

        try {
            selectedOptionsComponent.map((item) =>
                axios.post(`${SERVICE.ASSETMATERIALIP_CREATE}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    company: String(item.company),
                    branch: String(item.branch),
                    unit: String(item.unit),
                    floor: String(item.floor),
                    location: String(item.location),
                    area: String(item.area),
                    ip: Boolean(maintentancemaster.ip),
                    ebusage: Boolean(maintentancemaster.ebusage),
                    empdistribution: Boolean(maintentancemaster.empdistribution),
                    maintenance: Boolean(maintentancemaster.maintenance),
                    operatingsoftware: Boolean(maintentancemaster.operatingsoftware),
                    subcomponents: subarray,
                    component: item.value,
                    assetmaterial: maintentancemaster.assetmaterial,
                    assetmaterialcheck: maintentancemaster.assetmaterialcheck,
                    uniqueid: uniqueval,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                })
            );

            // await fetchFilteredDatas();
            await fetchMaintentanceIndividualSingle();

            setMaintentancemaster({
                ...maintentancemaster,

                ip: true,
                ebusage: true,
                empdistribution: true,
            });
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // const sendRequest = async () => {
    //     setPageName(!pageName);
    //     try {
    //         const batchSize = 100;
    //         const batches = [];
    //         const combinedData = valueComponentCat
    //         for (let i = 0; i < combinedData.length; i += batchSize) {
    //             batches.push(combinedData.slice(i, i + batchSize));
    //         }
    //         console.log(combinedData, "combined")
    //         const allPromises = [];
    //         let subarray = selectedOptionsMaterial.map(item => item.value);
    //         let uniqueval = uniqueid || 1;

    //         let res_project = await axios.get(SERVICE.ASSETDETAIL, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });

    //         let assetlist = res_project.data.assetdetials

    //         for (const batch of batches) {
    //             const batchPromises = batch.map(({ component }) =>
    //                 axios.post(
    //                     `${SERVICE.ASSETMATERIALIP_CREATE}`,
    //                     {
    //                         company: selectedCompanyFromCreate.map(item => item.value),
    //                         branch: selectedBranchFromCreate.map(item => item.value),
    //                         unit: selectedUnitFromCreate.map(item => item.value),
    //                         floor: selectedFloorFromCreate.map(item => item.value),
    //                         location: selectedLocationFromCreate.map(item => item.value),
    //                         area: selectedAreaFromCreate.map(item => item.value),
    //                         ip: Boolean(maintentancemaster.ip),
    //                         ebusage: Boolean(maintentancemaster.ebusage),
    //                         empdistribution: Boolean(maintentancemaster.empdistribution),
    //                         maintenance: Boolean(maintentancemaster.maintenance),
    //                         subcomponents: subarray,
    //                         component,
    //                         assetmaterial: maintentancemaster.assetmaterial,
    //                         assetmaterialcheck: maintentancemaster.assetmaterialcheck,
    //                         uniqueid: uniqueval++,
    //                         addedby: [
    //                             {
    //                                 name: String(isUserRoleAccess.companyname),
    //                                 date: String(new Date()),
    //                             },
    //                         ],
    //                     },
    //                     { headers: { Authorization: `Bearer ${auth.APIToken}` } }
    //                 )
    //             );
    //             allPromises.push(...batchPromises);
    //         }

    //         const results = await Promise.allSettled(allPromises);
    //         results.forEach((result, index) => {
    //             if (result.status === "rejected") {
    //                 console.error(`Request ${index + 1} failed:`, result.reason);
    //             }
    //         });

    //         await fetchFilteredDatas();
    //         await fetchMaintentanceIndividualSingle();

    //         setMaintentancemaster({
    //             ...maintentancemaster,
    //             ip: true,
    //             ebusage: true,
    //             empdistribution: true,
    //         });

    //         setPopupContent("Added Successfully");
    //         setPopupSeverity("success");
    //         handleClickOpenPopup();
    //     } catch (err) {
    //         handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //     }
    // };

    //submit option for saving

    // const generateCombinedData = () => {
    //     const selectedCompanies = selectedCompanyFromCreate.map(item => item.value);
    //     const selectedBranches = selectedBranchFromCreate.map(item => item.value);
    //     const selectedUnits = selectedUnitFromCreate.map(item => item.value);
    //     const selectedFloors = selectedFloorFromCreate.map(item => item.value);
    //     const selectedLocations = selectedLocationFromCreate.map(item => item.value);
    //     const selectedAreas = selectedAreaFromCreate.map(item => item.value);

    //     const componentData = Array.isArray(valueComponentCat)
    //         ? valueComponentCat.map((item) => (typeof item === "string" ? { component: item } : item))
    //         : [];

    //     console.log(componentData, "componentData")

    //     const combinedData = [];
    //     for (const company of selectedCompanies) {
    //         for (const branch of selectedBranches) {
    //             for (const unit of selectedUnits) {
    //                 for (const floor of selectedFloors) {
    //                     for (const location of selectedLocations) {
    //                         for (const area of selectedAreas) {
    //                             for (const { component } of componentData) {
    //                                 combinedData.push({
    //                                     company,
    //                                     branch,
    //                                     unit,
    //                                     floor,
    //                                     location,
    //                                     area,
    //                                     component,
    //                                 });
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     console.log("Generated combinedData:", combinedData);
    //     return combinedData;
    // };

    // const generateCombinedData = async () => {
    //     const selectedCompanies = selectedCompanyFromCreate.map(item => item.value);
    //     const selectedBranches = selectedBranchFromCreate.map(item => item.value);
    //     const selectedUnits = selectedUnitFromCreate.map(item => item.value);
    //     const selectedFloors = selectedFloorFromCreate.map(item => item.value);
    //     const selectedLocations = selectedLocationFromCreate.map(item => item.value);
    //     const selectedAreas = selectedAreaFromCreate.map(item => item.value);

    //     const componentData = Array.isArray(valueComponentCat)
    //         ? valueComponentCat.map((item) => (typeof item === "string" ? { component: item } : item))
    //         : [];

    //     const combinedData = [];
    //     let res_project = await axios.get(SERVICE.ASSETDETAIL, {
    //         headers: {
    //             Authorization: `Bearer ${auth.APIToken}`,
    //         },
    //     });
    //     let assetlist = [];
    //     assetlist = res_project.data.assetdetails || [];

    //     // console.log(assetlist[0], "assetlist")
    //     // First condition: Add componentData individually
    //     for (const { component } of componentData) {
    //         combinedData.push({ component });
    //     }

    //     // Second condition: Compare and match assetlist
    //     for (const company of selectedCompanies) {
    //         for (const branch of selectedBranches) {
    //             for (const unit of selectedUnits) {
    //                 for (const floor of selectedFloors) {
    //                     for (const location of selectedLocations) {
    //                         for (const area of selectedAreas) {
    //                             // Find matching asset from the assetlist
    //                             const matchingAsset = res_project.data.assetdetails?.some(asset =>
    //                                 asset.company === company &&
    //                                 asset.branch === branch &&
    //                                 asset.unit === unit &&
    //                                 asset.floor === floor &&
    //                                 asset.location === location &&
    //                                 asset.area === area
    //                             );
    //                             console.log(matchingAsset, "matchingAsset")
    //                             // If a match is found, concatenate material and code as component
    //                             if (matchingAsset) {
    //                                 combinedData.push({
    //                                     company,
    //                                     branch,
    //                                     unit,
    //                                     floor,
    //                                     location,
    //                                     area,
    //                                     component: `${matchingAsset.material}-${matchingAsset.code}`,
    //                                 });
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     console.log("Generated combinedData:", combinedData);
    //     return combinedData;
    // };

    // const sendRequest = async () => {
    //     setPageName(!pageName);
    //     try {
    //         const batchSize = 100;
    //         const combinedData = generateCombinedData(); // Generate the combined data including components
    //         const allPromises = [];
    //         let uniqueval = uniqueid || 1;

    //         const subarray = selectedOptionsMaterial.map(item => item.value);

    //         // Process the combined data in batches
    //         for (let i = 0; i < combinedData.length; i += batchSize) {
    //             const batch = combinedData.slice(i, i + batchSize);
    //             console.log(batch, "comp")
    //             const batchPromises = batch.map(({ company, branch, unit, floor, location, area, component }) =>

    //                 axios.post(
    //                     `${SERVICE.ASSETMATERIALIP_CREATE}`,
    //                     {
    //                         company,
    //                         branch,
    //                         unit,
    //                         floor,
    //                         location,
    //                         area,
    //                         component,
    //                         ip: Boolean(maintentancemaster.ip),
    //                         ebusage: Boolean(maintentancemaster.ebusage),
    //                         empdistribution: Boolean(maintentancemaster.empdistribution),
    //                         maintenance: Boolean(maintentancemaster.maintenance),
    //                         subcomponents: subarray,
    //                         assetmaterial: maintentancemaster.assetmaterial,
    //                         assetmaterialcheck: maintentancemaster.assetmaterialcheck,
    //                         uniqueid: uniqueval++,
    //                         addedby: [
    //                             {
    //                                 name: String(isUserRoleAccess.companyname),
    //                                 date: String(new Date()),
    //                             },
    //                         ],
    //                     },
    //                     { headers: { Authorization: `Bearer ${auth.APIToken}` } }
    //                 )
    //             );
    //             allPromises.push(...batchPromises);
    //         }

    //         // Resolve all promises
    //         const results = await Promise.allSettled(allPromises);
    //         results.forEach((result, index) => {
    //             if (result.status === "rejected") {
    //                 console.error(`Request ${index + 1} failed:`, result.reason);
    //             }
    //         });

    //         // Fetch updated data
    //         await fetchFilteredDatas();
    //         await fetchMaintentanceIndividualSingle();

    //         // Reset maintenance master state
    //         setMaintentancemaster({
    //             ...maintentancemaster,
    //             ip: true,
    //             ebusage: true,
    //             empdistribution: true,
    //         });

    //         // Show success popup
    //         setPopupContent("Added Successfully");
    //         setPopupSeverity("success");
    //         handleClickOpenPopup();
    //     } catch (err) {
    //         // Handle error popup
    //         handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //     }
    // };

    const handleSubmit = async (e) => {
        setPageName(!pageName);

        setloadingdeloverall(true);
        e.preventDefault();
        let res_project = await axios.get(SERVICE.ASSETMATERIALIP, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let compopt = selectedCompanyFromCreate.map((item) => item.value);
        let branchopt = selectedBranchFromCreate.map((item) => item.value);
        let unitopt = selectedUnitFromCreate.map((item) => item.value);
        let flooropt = selectedFloorFromCreate.map((item) => item.value);
        let areaopt = selectedAreaFromCreate.map((item) => item.value);
        let locationopt = selectedLocationFromCreate.map((item) => item.value);

        const isNameMatch = res_project?.data?.assetmaterialip.some(
            (item) =>
                // item.company === maintentancemaster.company &&
                // item.branch === maintentancemaster.branch &&
                // item.unit === maintentancemaster.unit &&
                // item.floor === maintentancemaster.floor &&
                // item.area === maintentancemaster.area &&
                // item.location === maintentancemaster.location &&
                item.assetmaterial === maintentancemaster.assetmaterial &&
                item.component.some((item) => selectedOptionsComponent.map((item) => item.value).includes(item))
        );

        if (selectedCompanyFromCreate.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedBranchFromCreate.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedUnitFromCreate.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedFloorFromCreate.length === 0) {
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedAreaFromCreate.length === 0) {
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedLocationFromCreate.length === 0) {
            setPopupContentMalert("Please Select Location!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemaster.assetmaterial === "Please Select Material") {
            setPopupContentMalert("Please Select Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (valueComponentCat?.length === 0) {
            setPopupContentMalert("Please Select Asset Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (objectsWithMissingName?.length > 0 && selectedOptionsMaterial?.length === 0) {

        //     setPopupContentMalert("Please Select Subcomponents!");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }
        else {
            sendRequest();
        }
    };

    const handleclear = (e) => {
        e.preventDefault();

        setMaintentancemaster({
            // company: "Please Select Company",
            // branch: "Please Select Branch",
            // unit: "Please Select Unit",
            // floor: "Please Select Floor",
            // area: "Please Select Area",
            // location: "Please Select Location",
            assetmaterial: "Please Select Material",
            ip: true,
            empdistribution: true,
            ebusage: true,
            maintenance: true,
        });

        setSelectedCompanyFromCreate([]);
        setSelectedBranchFromCreate([]);
        setSelectedUnitFromCreate([]);
        setSelectedFloorFromCreate([]);
        setSelectedAreaFromCreate([]);
        setSelectedLocationFromCreate([]);
        setFloors([]);
        setAreas([]);
        setSelectedOptionsMaterial([]);
        setSelectedOptionsComponent([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        // setShowAlert(
        //     <>
        //         <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
        //     </>
        // );
        // handleClickOpenerr();
        setPopupContentMalert("Cleared Successfully!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
    };

    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setMaintentancemasteredit({
            branch: "",
            equipment: "",
            maintenancedetails: "",
            maintenancefrequency: "",
            maintenancedate: today,
            maintenancetime: "",
            resdepartment: "Please Select Department",
            resteam: "",
            resperson: "",
            fromdate: "",
            todate: "",
            vendor: "Please Select Vendor",
            address: "",
            phone: "",
            email: "",
        });
    };

    const [isEditOpenNear, setIsEditOpenNear] = useState(false);
    useEffect(() => {
        fetchAssetDetails();
    }, []);
    // }, [isEditOpenNear]);

    //Edit model...
    const handleClickOpenEditNear = () => {
        setIsEditOpenNear(true);
    };
    const handleCloseModEditNear = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpenNear(false);
    };

    //get single row to edit....
    const getCodeNear = async (e) => {
        setPageName(!pageName);

        try {
            let res = await axios.get(`${SERVICE.ASSETMATERIALIP_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setMaintentancemasteredit(res?.data?.sassetmaterialip);

            fetchFloorEdit(res?.data?.sassetmaterialip);

            fetchAreaEdit(res?.data?.sassetmaterialip?.branch, res?.data?.sassetmaterialip?.floor);
            fetchAllLocationEdit(res?.data?.sassetmaterialip?.branch, res?.data?.sassetmaterialip?.floor, res?.data?.sassetmaterialip?.area);
            fetchAssetDetails();
            setSelectedOptionsMaterialEdit(
                res?.data?.sassetmaterialip.subcomponents.map((item) => ({
                    ...item,
                    label: item,
                    value: item,
                }))
            );
            setComponentValueCateEdit(res?.data?.sassetmaterialip?.component);
            setSelectedComponentOptionsCateEdit([
                ...res?.data?.sassetmaterialip?.component.map((t) => ({
                    label: t,
                    value: t,
                })),
            ]);
            await fetchProjMasterAll();
            handleClickOpenEditNear();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    const getviewCode = async (company, branch, unit, floor, area, location, assetmaterial, component, ip, ebusage, empdistribution, maintenance, operatingsoftware) => {
        try {
            setMaintentancemasteredit({
                ...maintentancemasteredit,
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                assetmaterial: assetmaterial,
                component: component,
                ip: ip,
                ebusage: ebusage,
                empdistribution: empdistribution,
                maintenance: maintenance,
                operatingsoftware: operatingsoftware,
            });
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [openviewnear, setOpenviewnear] = useState(false);

    // view model
    const handleClickOpenviewnear = () => {
        setOpenviewnear(true);
    };

    const handleCloseviewnear = () => {
        setOpenviewnear(false);
    };

    const getviewCodeNear = async (company, branch, unit, floor, area, location, assetmaterial, component, ip, ebusage, empdistribution, maintenance, operatingsoftware) => {
        try {
            setMaintentancemasteredit({
                ...maintentancemasteredit,
                company: company,
                branch: branch,
                unit: unit,
                floor: floor,
                area: area,
                location: location,
                assetmaterial: assetmaterial,
                component: component,
                ip: ip,
                ebusage: ebusage,
                empdistribution: empdistribution,
                operatingsoftware: operatingsoftware,
                maintenance: maintenance,
            });
            handleClickOpenviewnear();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName);
        console.log(e, "erreer");
        try {
            let res = await axios.get(`${SERVICE.ASSETMATERIALIP_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setMaintentancemasteredit(res?.data?.sassetmaterialip);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //Project updateby edit page...
    let updateby = maintentancemasteredit?.updatedby;
    let addedby = maintentancemasteredit?.addedby;

    let maintenanceid = maintentancemasteredit?._id;

    //editing the single data...
    const sendEditRequest = async () => {
        let subarray = selectedOptionsMaterialEdit.map((item) => item.value);
        let materialnamesfrom = maintentancemasteredit.assetmaterial;
        try {
            const deletePromises = idgrpedit?.map((item) => {
                return axios.delete(`${SERVICE.ASSETMATERIALIP_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            await Promise.all(deletePromises);

            axios.post(`${SERVICE.ASSETMATERIALIP_CREATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(maintentancemasteredit.company),
                branch: String(maintentancemasteredit.branch),
                unit: String(maintentancemasteredit.unit),
                floor: String(maintentancemasteredit.floor),
                location: String(maintentancemasteredit.location),
                area: String(maintentancemasteredit.area),
                assetmaterial: String(maintentancemasteredit.assetmaterial),
                subcomponents: subarray,
                ip: Boolean(maintentancemasteredit.ip),
                ebusage: Boolean(maintentancemasteredit.ebusage),
                empdistribution: Boolean(maintentancemasteredit.empdistribution),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            handleCloseModEdit();
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const sendEditRequestNear = async () => {
        setPageName(!pageName);

        let subarray = selectedOptionsMaterialEdit.map((item) => item.value);
        try {
            let res = await axios.put(`${SERVICE.ASSETMATERIALIP_SINGLE}/${maintenanceid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(maintentancemasteredit.company),
                branch: String(maintentancemasteredit.branch),
                unit: String(maintentancemasteredit.unit),
                floor: String(maintentancemasteredit.floor),
                location: String(maintentancemasteredit.location),
                area: String(maintentancemasteredit.area),
                assetmaterial: String(maintentancemasteredit.assetmaterial),
                assetmaterialcheck: String(maintentancemasteredit.assetmaterialcheck),
                subcomponents: subarray,
                component: ComponentValueCateEdit,
                ip: Boolean(maintentancemasteredit.ip),
                ebusage: Boolean(maintentancemasteredit.ebusage),
                empdistribution: Boolean(maintentancemasteredit.empdistribution),
                maintenance: Boolean(maintentancemasteredit.maintenance),
                operatingsoftware: Boolean(maintentancemasteredit.operatingsoftware),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchFilteredDatas();
            await fetchMaintentanceIndividualSingle();
            handleCloseModEditNear();
            // setShowAlert(
            //     <>
            //         <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully 👍"}</p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmitNear = async (e) => {
        e.preventDefault();
        fetchProjMasterAll();
        let res_project = await axios.get(SERVICE.ASSETMATERIALIP, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        let dupe = res_project?.data?.assetmaterialip.filter((item) => item._id !== maintentancemasteredit?._id);

        const isNameMatch = dupe.some(
            (item) => item.company === maintentancemasteredit.company && item.branch === maintentancemasteredit.branch && item.unit === maintentancemasteredit.unit && item.floor === maintentancemasteredit.floor && item.area === maintentancemasteredit.area && item.location === maintentancemasteredit.location && item.assetmaterial === maintentancemasteredit.assetmaterial && item.component.some((item) => selectedComponentOptionsCateEdit.map((item) => item.value).includes(item))
        );

        if (maintentancemasteredit.company === "Please Select Company") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Company"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.branch === "Please Select Branch") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Branch"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.unit === "Please Select Unit") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Unit"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.floor === "Please Select Floor") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Floor"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Floor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.area === "Please Select Area") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Area"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Area!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.location === "Please Select Location") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Location"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Location!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (maintentancemasteredit.assetmaterial === "Please Select Material") {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Material"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (ComponentValueCateEdit?.length === 0) {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Please Select Asset Material"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Please Select Asset Material!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            // setShowAlert(
            //     <>
            //         <ErrorOutlineOutlinedIcon
            //             sx={{ fontSize: "100px", color: "orange" }}
            //         />
            //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
            //             {"Data Already Exist!"}
            //         </p>
            //     </>
            // );
            // handleClickOpenerr();
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendEditRequestNear();
        }
    };
    // console.log(allareagrouping, "allareagrouping")

    const fetchFloor = async (selectedBranches) => {
        let resultedit = allfloor.filter((d) => d.branch === selectedBranches.value || d.branch === selectedBranches.branch);
        const flooralledit = resultedit.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));

        let result = allfloor.filter((d) => selectedBranches.some((branch) => d.branch.includes(branch)));

        // Map the result to add label and value
        const floorall = result.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));
        // Update state
        setFloors(floorall);
        setFloorEdit(flooralledit);
    };

    const fetchFloorEdit = async (e) => {
        let resultedit = allfloor.filter((d) => d.branch === e.value || d.branch === e.branch);
        const flooralledit = resultedit.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));

        setFloorEdit(flooralledit);
    };

    // console.log(allareagrouping, "allareagrouping")
    const fetchArea = async (selectedfloor) => {
        let result = allareagrouping
            .filter(
                (comp) => selectedBranchFromCreate.map((item) => item.value).includes(comp.branch) && selectedfloor.some((floor) => comp.floor.includes(floor))
                // e.includes(comp.floor)
            )
            ?.map((data) => data.area)
            .flat();

        let ji = [].concat(...result);
        const uniqueAreas = Array.from(new Set(ji));
        const all = uniqueAreas.map((d) => ({
            ...d,
            label: d,
            value: d,
        }));
        setAreas(all);
    };

    const fetchLocation = async (selectedlocation) => {
        let result = alllocationgrouping
            .filter(
                (comp) => selectedBranchFromCreate.map((item) => item.value).includes(comp.branch) && selectedFloorFromCreate.map((item) => item.value).includes(comp.floor) && selectedlocation.some((area) => comp.area.includes(area))
                // e.includes(comp.floor)
            )
            ?.map((data) => data.location)
            .flat();

        let ji = [].concat(...result);
        const unique = Array.from(new Set(ji));
        const all = [
            { label: "ALL", value: "ALL" },
            ...unique
                .filter((d) => d !== "ALL")
                .map((d) => ({
                    label: d,
                    value: d,
                })),
        ];
        // const alls = Array.from(new Set(ji));

        setLocations(all);
    };

    const fetchAreaEdit = async (a, e) => {
        let result = allareagrouping.filter((d) => d.branch === a && d.floor === e).map((data) => data.area);
        let ji = [].concat(...result);
        const all = ji.map((d) => ({
            ...d,
            label: d,
            value: d,
        }));
        setAreasEdit(all);
    };

    //get all Locations edit.
    const fetchAllLocationEdit = async (a, b, c) => {
        let result = alllocationgrouping.filter((d) => d.branch === a && d.floor === b && d.area === c).map((data) => data.location);
        let ji = [].concat(...result);
        const all = [
            { label: "ALL", value: "ALL" },
            ...ji.map((d) => ({
                ...d,
                label: d,
                value: d,
            })),
        ];
        setLocationsEdit(all);
    };

    const fetchMaintentanceIndividual = async () => {
        setPageName(!pageName);
        setProjectCheck(true);
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
        };

        const allFilters = [...additionalFilters, { column: selectedColumn, condition: selectedCondition, value: filterValue }];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters;
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }
        try {
            let res_employee = await axios.post(SERVICE.ASSET_MATERIALIP_LIMITED_ACCESS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];

            const single = ans;
            const uniqueObjects = [];
            const uniqueKeysMap = new Map();

            single.forEach((obj) => {
                const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.team}-${obj.area}-${obj.location}`;

                if (!uniqueKeysMap.has(key)) {
                    obj.id = [obj._id];
                    uniqueKeysMap.set(key, obj);
                } else {
                    const existingObj = uniqueKeysMap.get(key);
                    existingObj.assetmaterial += `, ${obj.assetmaterial}`;

                    // Check if subcomponents is empty or not
                    if (obj.subcomponents.length > 0) {
                        if (existingObj.subcomponents.length > 0) {
                            existingObj.subcomponents += `, ${obj.subcomponents.join(",")}`;
                        } else {
                            existingObj.subcomponents = obj.subcomponents.join(",");
                        }
                    }

                    if (obj.component.length > 0) {
                        if (existingObj.component.length > 0) {
                            existingObj.component += `, ${obj.component.join(",")}`;
                        } else {
                            existingObj.component = obj.component.join(",");
                        }
                    }

                    existingObj.id = existingObj.id.concat(obj._id);
                    uniqueKeysMap.set(key, existingObj);
                }
            });

            uniqueObjects.push(...uniqueKeysMap.values());

            setMaintentance(uniqueObjects);

            setOverallFilterdata(
                uniqueObjects?.length > 0
                    ? uniqueObjects?.map((item, index) => {
                        return {
                            ...item,
                            serialNumber: (page - 1) * pageSize + index + 1,
                            ip: item.ip === true ? "Yes" : "No",
                            ebusage: item.ebusage === true ? "Yes" : "No",
                            empdistribution: item.empdistribution === true ? "Yes" : "No",
                            maintenance: item.maintenance === true ? "Yes" : "No",
                            operatingsoftware: item.operatingsoftware === true ? "Yes" : "No",
                            component: item.component,
                        };
                    })
                    : []
            );
            setTotalProjects(ans?.length > 0 ? uniqueObjects.length : 0);
            // setTotalPages(ans?.length > 0 ? uniqueObjects.length : 0);
            setPageSize((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPage((data) => {
                return ans?.length > 0 ? data : 1;
            });

            if (res_employee?.data?.result?.length > 0) {
                setUniqueid(res_employee?.data?.result[res_employee?.data?.result?.length - 1].uniqueid);
            }

            setProjectCheck(false);
        } catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchMaintentanceIndividualSingle = async () => {
        setPageName(!pageName);

        setProjectCheck1(true);

        const queryParams = {
            page: Number(pageNearTatPrimary),
            pageSize: Number(pageSizeNearTatPrimary),
            assignbranch: accessbranch,
        };

        const allFiltersNear = [...additionalFiltersNear, { column: selectedColumnNear, condition: selectedConditionNear, value: filterValueNear }];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFiltersNear.length > 0 && selectedColumnNear !== "") {
            queryParams.allFilters = allFiltersNear;
            queryParams.logicOperator = logicOperatorNear;
        } else if (searchQueryNearTatPrimary) {
            queryParams.searchQuery = searchQueryNearTatPrimary;
        }

        try {
            let res_employee = await axios.post(SERVICE.ASSET_MATERIALIP_LIMITED_ACCESS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];
            const itemsWithSerialNumber = ans?.map((item, index) => {
                return {
                    ...item,
                    serialNumber: (pageNearTatPrimary - 1) * pageSizeNearTatPrimary + index + 1,
                    ip: item.ip === true ? "Yes" : "No",
                    ebusage: item.ebusage === true ? "Yes" : "No",
                    empdistribution: item.empdistribution === true ? "Yes" : "No",
                    maintenance: item.maintenance === true ? "Yes" : "No",
                    operatingsoftware: item.operatingsoftware === true ? "Yes" : "No",
                    component: item.component,
                };
            });

            setItemsNearTat(itemsWithSerialNumber);
            setOverallFilterdataNear(
                res_employee?.data?.totalProjectsData?.length > 0
                    ? res_employee?.data?.totalProjectsData?.map((item, index) => {
                        return {
                            ...item,
                            serialNumber: (pageNearTatPrimary - 1) * pageSizeNearTatPrimary + index + 1,
                            ip: item.ip === true ? "Yes" : "No",
                            ebusage: item.ebusage === true ? "Yes" : "No",
                            empdistribution: item.empdistribution === true ? "Yes" : "No",
                            maintenance: item.maintenance === true ? "Yes" : "No",
                            operatingsoftware: item.operatingsoftware === true ? "Yes" : "No",
                            component: item.component,
                        };
                    })
                    : []
            );
            setTotalProjectsNear(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPagesNear(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSizeNearTatPrimary((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPageNearTatPrimary((data) => {
                return ans?.length > 0 ? data : 1;
            });
            setIndividualAsset(itemsWithSerialNumber);
            // console.log(res_employee?.data?.totalProjects, "totalProjectsNear")

            setProjectCheck1(false);
        } catch (err) {
            setProjectCheck1(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchMaintentanceIndividualSingle();
    }, [pageNearTatPrimary, pageSizeNearTatPrimary, searchQueryNearTatPrimary]);

    //get all project.
    const fetchProjMasterAll = async () => {
        setPageName(!pageName);

        try {
            let res_project = await axios.get(SERVICE.ASSETMATERIALIP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setAllProjectedit(res_project?.data?.assetmaterialip.filter((item) => item._id !== maintentancemasteredit?._id));
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        // fetchProjMasterAll();
    }, [isEditOpenNear, maintentancemasteredit]);

    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Floor", field: "floor" },
        { title: "Area", field: "area" },
        { title: "Location", field: "location" },
        { title: "Material", field: "assetmaterial" },
        { title: "Asset Material", field: "component" },
        { title: "IP", field: "ip" },
        { title: "ebusage", field: "ebusage" },
        { title: "Employee Distribution", field: "empdistribution" },
        { title: "Maintenance", field: "maintenance" },
    ];

    //  pdf download functionality
    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? rowDataTable.map((row) => ({ ...row, serialNumber: serialNumberCounter++ }))
                : maintentance.map((row) => {
                    return {
                        ...row,
                        serialNumber: serialNumberCounter++,
                        ip: row.ip === true ? "Yes" : "No",
                        ebusage: row.ebusage === true ? "Yes" : "No",
                        empdistribution: row.empdistribution === true ? "Yes" : "No",
                        maintenance: row.maintenance === true ? "Yes" : "No",
                        operatingsoftware: row.operatingsoftware === true ? "Yes" : "No",
                    };
                });
        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("AssetIP Group.pdf");
    };

    const columnsnear = [
        { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Floor", field: "floor" },
        { title: "Area", field: "area" },
        { title: "Location", field: "location" },
        { title: "Material", field: "assetmaterial" },
        { title: "Asset Material", field: "component" },
        { title: "IP", field: "ip" },
        { title: "ebusage", field: "ebusage" },
        { title: "Employee Distribution", field: "empdistribution" },
        { title: "Maintenance", field: "maintenance" },
        { title: "Operating & software", field: "operatingsoftware" },
    ];

    //  pdf download functionality
    const downloadPdfNear = (isfilter) => {
        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? rowDataTableNearTat.map((row) => ({ ...row, serialNumber: serialNumberCounter++ }))
                : individualasset.map((row) => {
                    return {
                        ...row,
                        serialNumber: serialNumberCounter++,
                        ip: row.ip === true ? "Yes" : "No",
                        ebusage: row.ebusage === true ? "Yes" : "No",
                        empdistribution: row.empdistribution === true ? "Yes" : "No",
                        maintenance: row.maintenance === true ? "Yes" : "No",
                        operatingsoftware: row.operatingsoftware === true ? "Yes" : "No",
                    };
                });
        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            // columns: columnsWithSerial,
            columns: columnsnear.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("AssetIP Individual.pdf");
    };

    // Excel
    const fileName = "AssetIP Group";
    const fileNameNear = "AssetIP Individual";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "AssetIP Group",
        pageStyle: "print",
    });

    //print...
    const componentRefNear = useRef();
    const handleprintNear = useReactToPrint({
        content: () => componentRefNear.current,
        documentTitle: "AssetIP Individual ",
        pageStyle: "print",
    });

    // serial no for listing items
    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(filteteredip);
    }, [filteteredip]);

    //serial no for listing items
    const addSerialNumberNearTat = (datas) => {

        setItemsNearTat(datas);
    };
    useEffect(() => {
        addSerialNumberNearTat(individualasset);
    }, [individualasset]);
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
        setFilterValue(event.target.value);
        setPage(1);
    };

    //Datatable
    const handlePageChangeNearTatPrimary = (newPage) => {
        setPageNearTatPrimary(newPage);
    };

    const handlePageSizeChangeNearTatPrimary = (event) => {
        setPageSizeNearTatPrimary(Number(event.target.value));
        setPageNearTatPrimary(1);
    };

    //datatable....

    const handleSearchChangeNearTatPrimary = (event) => {
        setSearchQueryNearTatPrimary(event.target.value);
        setFilterValueNear(event.target.value);
        setPageNearTatPrimary(1);
    };

    const searchTerms = searchQuery.toLowerCase().split(" ");
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const searchOverNearTerms = searchQueryNearTatPrimary.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatasNearTatPrimary = itemsneartat?.filter((item) => {
        return searchOverNearTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataNearTatPrimary = filteredDatasNearTatPrimary?.slice((pageNearTatPrimary - 1) * pageSizeNearTatPrimary, pageNearTatPrimary * pageSizeNearTatPrimary);

    const totalPagesNearTatPrimary = Math.ceil(filteredDatasNearTatPrimary?.length / pageSizeNearTatPrimary);

    const visiblePagesNearTatPrimary = Math.min(totalPagesNearTatPrimary, 3);

    const firstVisiblePageNearTatPrimary = Math.max(1, pageNearTatPrimary - 1);
    const lastVisiblePageNearTatPrimary = Math.min(Math.abs(firstVisiblePageNearTatPrimary + visiblePagesNearTatPrimary - 1), totalPagesNearTatPrimary);

    const pageNumbersNearTatPrimary = [];

    const indexOfLastItemNearTatPrimary = pageNearTatPrimary * pageSizeNearTatPrimary;
    const indexOfFirstItemNearTatPrimary = indexOfLastItemNearTatPrimary - pageSizeNearTatPrimary;

    for (let i = firstVisiblePageNearTatPrimary; i <= lastVisiblePageNearTatPrimary; i++) {
        pageNumbersNearTatPrimary.push(i);
    }

    // useEffect(() => {
    //     fetchProjMasterAll();
    // }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const [selectAllCheckedNear, setSelectAllCheckedNear] = useState(false);

    const CheckboxHeaderNear = ({ selectAllCheckedNear, onSelectAllNear }) => (
        <div>
            <Checkbox checked={selectAllCheckedNear} onChange={onSelectAllNear} />
        </div>
    );

    const columnDataTable = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     renderHeader: (params) => (
        //         <CheckboxHeader
        //             selectAllChecked={selectAllChecked}
        //             onSelectAll={() => {
        //                 if (rowDataTable.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }

        //                 if (selectAllChecked) {
        //                     setSelectedRows([]);
        //                 } else {
        //                     const allRowIds = rowDataTable.map((row) => row.id);
        //                     setSelectedRows(allRowIds);
        //                 }
        //                 setSelectAllChecked(!selectAllChecked);
        //             }}
        //         />
        //     ),

        //     cellRenderer: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.data.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.data.id)) {
        //                     updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.data.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.data.id];
        //                 }

        //                 setSelectedRows(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 90,

        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
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
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 100,
            hide: !columnVisibility.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 100,
            hide: !columnVisibility.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 100,
            hide: !columnVisibility.location,
            headerClassName: "bold-header",
        },
        { field: "assetmaterial", headerName: "Material", flex: 0, width: 160, hide: !columnVisibility.assetmaterial, headerClassName: "bold-header" },
        {
            field: "component",
            headerName: "Asset Material",
            flex: 0,
            width: 160,
            hide: !columnVisibility.component,
            headerClassName: "bold-header",
        },
        { field: "ip", headerName: "IP", flex: 0, width: 100, hide: !columnVisibility.ip, headerClassName: "bold-header" },
        { field: "ebusage", headerName: "EB Usage", flex: 0, width: 100, hide: !columnVisibility.ebusage, headerClassName: "bold-header" },
        { field: "empdistribution", headerName: "Employee Distribution", flex: 0, width: 100, hide: !columnVisibility.empdistribution, headerClassName: "bold-header" },
        { field: "maintenance", headerName: "Maintenance", flex: 0, width: 100, hide: !columnVisibility.maintentance, headerClassName: "bold-header" },
        { field: "operatingsoftware", headerName: " Operating & software", flex: 0, width: 100, hide: !columnVisibility.operatingsoftware, headerClassName: "bold-header" },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("ddynamicassetmaterials") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.idgrp);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vdynamicassetmaterials") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(
                                    params.data.company,
                                    params.data.branch,
                                    params.data.unit,
                                    params.data.floor,
                                    params.data.area,
                                    params.data.location,
                                    params.data.assetmaterial,
                                    //  params.data.subcomponentsstring,
                                    params.data.component,
                                    params.data.ip,
                                    params.data.ebusage,
                                    params.data.empdistribution,
                                    params.data.maintenance,
                                    params.data.operatingsoftware
                                );
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("idynamicassetmaterials") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const filteredSelectedColumn = columnDataTable.filter((data) => data.field !== "checkbox" && data.field !== "actions" && data.field !== "serialNumber");
    console.log(items, "itemsss");
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            idgrp: item.ids,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,
            operatingsoftware: item.operatingsoftware,
            subcomponents: item.subcomponents,
            subcomponentsstring: item.subcomponents?.toString(),
            component: item.component,
            ip: item.ip,
            ebusage: item.ebusage,
            empdistribution: item.empdistribution,
            maintenance: item.maintenance,
        };
    });

    console.log(rowDataTable, "rowDataTable");

    const columnDataTableNeartat = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     renderHeader: (params) => (
        //         <CheckboxHeaderNear
        //             selectAllCheckedNear={selectAllCheckedNear}
        //             onSelectAllNear={() => {
        //                 if (rowDataTableNearTat.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }

        //                 if (selectAllCheckedNear) {
        //                     setSelectedRowsNear([]);
        //                 } else {
        //                     const allRowIds = rowDataTableNearTat.map((row) => row.id);
        //                     setSelectedRowsNear(allRowIds);
        //                 }
        //                 setSelectAllCheckedNear(!selectAllCheckedNear);
        //             }}
        //         />
        //     ),

        //     cellRenderer: (params) => (
        //         <Checkbox
        //             checked={selectedRowsNear.includes(params.data.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRowsNear.includes(params.data.id)) {
        //                     updatedSelectedRows = selectedRowsNear.filter((selectedId) => selectedId !== params.data.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRowsNear, params.data.id];
        //                 }

        //                 setSelectedRowsNear(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllCheckedNear(updatedSelectedRows.length === filteredDataNearTatPrimary.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 80,

        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
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
            hide: !columnVisibilityNeartat.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibilityNeartat.serialNumber,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 100,
            hide: !columnVisibilityNeartat.company,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 100,
            hide: !columnVisibilityNeartat.branch,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 100,
            hide: !columnVisibilityNeartat.unit,
            headerClassName: "bold-header",
        },
        {
            field: "floor",
            headerName: "Floor",
            flex: 0,
            width: 100,
            hide: !columnVisibilityNeartat.floor,
            headerClassName: "bold-header",
        },
        {
            field: "area",
            headerName: "Area",
            flex: 0,
            width: 100,
            hide: !columnVisibilityNeartat.area,
            headerClassName: "bold-header",
        },
        {
            field: "location",
            headerName: "Location",
            flex: 0,
            width: 100,
            hide: !columnVisibilityNeartat.location,
            headerClassName: "bold-header",
        },
        {
            field: "assetmaterial",
            headerName: "Material",
            flex: 0,
            width: 160,
            hide: !columnVisibilityNeartat.assetmaterial,
            headerClassName: "bold-header",
        },
        {
            field: "component",
            headerName: "Asset Material",
            flex: 0,
            width: 160,
            hide: !columnVisibilityNeartat.component,
            headerClassName: "bold-header",
        },
        { field: "ip", headerName: "IP", flex: 0, width: 100, hide: !columnVisibilityNeartat.ip, headerClassName: "bold-header" },
        { field: "ebusage", headerName: "EB Usage", flex: 0, width: 100, hide: !columnVisibilityNeartat.ebusage, headerClassName: "bold-header" },
        { field: "empdistribution", headerName: "Employee Distribution", flex: 0, width: 100, hide: !columnVisibilityNeartat.empdistribution, headerClassName: "bold-header" },
        { field: "maintenance", headerName: "Maintenance", flex: 0, width: 100, hide: !columnVisibilityNeartat.maintentance, headerClassName: "bold-header" },
        { field: "operatingsoftware", headerName: "Operating & software", flex: 0, width: 100, hide: !columnVisibilityNeartat.operatingsoftware, headerClassName: "bold-header" },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityNeartat.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("edynamicassetmaterials") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                // handleClickOpenEditNear();
                                getCodeNear(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ddynamicassetmaterials") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDataNear(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vdynamicassetmaterials") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeNear(params.data.company, params.data.branch, params.data.unit, params.data.floor, params.data.area, params.data.location, params.data.assetmaterial, params.data.component, params.data.ip, params.data.ebusage, params.data.empdistribution, params.data.maintenance, params.data.operatingsoftware);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];

    const filteredSelectedColumnNear = columnDataTableNeartat.filter((data) => data.field !== "checkbox" && data.field !== "actions" && data.field !== "serialNumber");

    const rowDataTableNearTat = itemsneartat.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            assetmaterial: item.assetmaterial,

            subcomponents: item.subcomponents,
            component: item.component?.toString(","),
            ip: item.ip,
            ebusage: item.ebusage,
            empdistribution: item.empdistribution,
            maintenance: item.maintenance,
            operatingsoftware: item.operatingsoftware,
        };

    });
    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));

    const rowsWithCheckboxesNear = rowDataTableNearTat.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsNear.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Show All Columns functionality
    const handleShowAllColumnsNeartat = () => {
        const updatedVisibilityNeartat = { ...columnVisibilityNeartat };
        for (const columnKey in updatedVisibilityNeartat) {
            updatedVisibilityNeartat[columnKey] = true;
        }
        setColumnVisibilityNeartat(updatedVisibilityNeartat);
    };

    // Manage Columns functionality
    const toggleColumnVisibilityNeartat = (field) => {
        setColumnVisibilityNeartat((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumnsNeartat = columnDataTableNeartat.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageNeartat.toLowerCase()));

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentNeartat = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsNeartat}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageNeartat} onChange={(e) => setSearchQueryManageNeartat(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsNeartat.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityNeartat[column.field]} onChange={() => toggleColumnVisibilityNeartat(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityNeartat(initialColumnVisibilityNeartat)}>
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
                                columnDataTableNeartat.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityNeartat(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Function to find an object where the 'name' property is missing and return it in array format
    function findObjectWithMissingName() {
        let sub = maintentancemaster.assetmaterial !== "" && assetdetails.find((t) => t.material === maintentancemaster.assetmaterialcheck) && assetdetails.find((t) => t.material === maintentancemaster.assetmaterialcheck)?.subcomponent;
        const objectsWithMissingName = [];
        if (sub) {
            for (let obj of sub) {
                if (obj.hasOwnProperty("sub") && obj.hasOwnProperty("subname")) {
                    objectsWithMissingName.push(obj);
                }
            }

            return objectsWithMissingName;
        }
    }

    function findObjectWithMissingNameEdit() {
        let sub = maintentancemasteredit.assetmaterial !== "" && assetdetails.find((t) => t.material === maintentancemasteredit.assetmaterialcheck) && assetdetails.find((t) => t.material === maintentancemasteredit.assetmaterialcheck)?.subcomponent;
        const objectsWithMissingName = [];
        if (sub) {
            for (let obj of sub) {
                if (obj.hasOwnProperty("sub") && obj.hasOwnProperty("subname")) {
                    objectsWithMissingName.push(obj);
                }
            }

            return objectsWithMissingName;
        }
    }

    // Example usage
    const objectsWithMissingName = findObjectWithMissingName();
    const objectsWithMissingNameEdit = findObjectWithMissingNameEdit();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    const [isFilterOpennear, setIsFilterOpennear] = useState(false);
    const [isPdfFilterOpennear, setIsPdfFilterOpennear] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    // page refersh reload
    const handleCloseFilterModnear = () => {
        setIsFilterOpennear(false);
    };

    const handleClosePdfFilterModnear = () => {
        setIsPdfFilterOpennear(false);
    };

    const [fileFormat, setFormat] = useState("");
    // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    // const exportToCSV = (csvData, fileName) => {
    //     const ws = XLSX.utils.json_to_sheet(csvData);
    //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //     const data = new Blob([excelBuffer], { type: fileType });
    //     FileSaver.saveAs(data, fileName + fileExtension);
    // }

    // const handleExportXL = (isfilter) => {
    //     if (isfilter === "filtered") {
    //         exportToCSV(
    //             rowDataTable?.map((t, index) => ({
    //                 serialNumber: index + 1,
    //                 Company: t.company,
    //                 Branch: t.branch,
    //                 Unit: t.unit,
    //                 Floor: t.floor,
    //                 Area: t.area,
    //                 Location: t.location,
    //                 Material: t.assetmaterial,
    //                 assetmaterial: t.component,
    //                 ip: t.ip,
    //                 ebusage: t.ebusage,
    //                 empdistribution: t.empdistribution,
    //                 maintenance: t.maintenance
    //             })),
    //             fileName,
    //         );
    //     } else if (isfilter === "overall") {
    //         exportToCSV(
    //             maintentance.map((t, index) => ({
    //                 serialNumber: index + 1,
    //                 Company: t.company,
    //                 Branch: t.branch,
    //                 Unit: t.unit,
    //                 Floor: t.floor,
    //                 Area: t.area,
    //                 Location: t.location,
    //                 Material: t.assetmaterial,
    //                 assetmaterial: t.component,
    //                 ip: t.ip === true ? "Yes" : "No",
    //                 ebusage: t.ebusage === true ? "Yes" : "No",
    //                 empdistribution: t.empdistribution === true ? "Yes" : "No",
    //                 maintenance: t.maintenance === true ? "Yes" : "No",
    //             })),
    //             fileName,
    //         );

    //     }

    //     setIsFilterOpen(false)
    // };

    // const handleExportXLnear = (isfilter) => {
    //     if (isfilter === "filtered") {
    //         exportToCSV(
    //             rowDataTableNearTat?.map((t, index) => ({
    //                 serialNumber: index + 1,
    //                 Company: t.company,
    //                 Branch: t.branch,
    //                 Unit: t.unit,
    //                 Floor: t.floor,
    //                 Area: t.area,
    //                 Location: t.location,
    //                 Material: t.assetmaterial,
    //                 assetmaterial: t.component,
    //                 ip: t.ip,
    //                 ebusage: t.ebusage,
    //                 empdistribution: t.empdistribution,
    //                 maintenance: t.maintenance
    //             })),
    //             fileNameNear,
    //         );
    //     } else if (isfilter === "overall") {
    //         exportToCSV(
    //             individualasset.map((t, index) => ({
    //                 serialNumber: index + 1,
    //                 Company: t.company,
    //                 Branch: t.branch,
    //                 Unit: t.unit,
    //                 Floor: t.floor,
    //                 Area: t.area,
    //                 Location: t.location,
    //                 Material: t.assetmaterial,
    //                 assetmaterial: t.component,
    //                 ip: t.ip === true ? "Yes" : "No",
    //                 ebusage: t.ebusage === true ? "Yes" : "No",
    //                 empdistribution: t.empdistribution === true ? "Yes" : "No",
    //                 maintenance: t.maintenance === true ? "Yes" : "No",
    //             })),
    //             fileNameNear,
    //         );

    //     }

    //     setIsFilterOpennear(false)
    // };

    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Dynamic Asset Materials"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    useEffect(() => {
        getapi();
    }, []);

    //near

    // Search bar
    const [anchorElSearchNear, setAnchorElSearchNear] = React.useState(null);
    const handleClickSearchNear = (event) => {
        setAnchorElSearchNear(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearchNear = () => {
        setAnchorElSearchNear(null);
        setSearchQueryNearTatPrimary("");
    };

    const openSearchNear = Boolean(anchorElSearchNear);
    const idSearchNear = openSearchNear ? "simple-popover" : undefined;

    const handleAddFilterNear = () => {
        if ((selectedColumnNear && filterValueNear) || ["Blank", "Not Blank"].includes(selectedConditionNear)) {
            setAdditionalFiltersNear([...additionalFiltersNear, { column: selectedColumnNear, condition: selectedConditionNear, value: filterValueNear }]);
            setSelectedColumnNear("");
            setSelectedConditionNear("Contains");
            setFilterValueNear("");
        }
    };

    // Show filtered combination in the search bar
    const getSearchDisplayNear = () => {
        if (advancedFilterNear && advancedFilterNear.length > 0) {
            return advancedFilterNear
                .map((filter, index) => {
                    let showname = columnDataTableNeartat.find((col) => col.field === filter.column)?.headerName;
                    return `${showname} ${filter.condition} "${filter.value}"`;
                })
                .join(" " + (advancedFilterNear.length > 1 ? advancedFilterNear[1].condition : "") + " ");
        }
        return searchQueryNearTatPrimary;
    };

    // Disable the search input if the search is active
    const isSearchDisabledNear = isSearchActiveNear || additionalFiltersNear.length > 0;

    const handleResetSearchNear = async () => {
        // Reset all filters and pagination state
        setAdvancedFilterNear(null);
        setAdditionalFiltersNear([]);
        setSearchQueryNearTatPrimary("");
        setIsSearchActiveNear(false);
        setSelectedColumnNear("");
        setSelectedConditionNear("Contains");
        setFilterValueNear("");
        setLogicOperatorNear("AND");
        setFilteredChangesNear(null);

        const queryParams = {
            page: Number(pageNearTatPrimary),
            pageSize: Number(pageSizeNearTatPrimary),
            assignbranch: accessbranch,
        };

        const allFiltersNear = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFiltersNear.length > 0 && selectedColumnNear !== "") {
            queryParams.allFilters = allFiltersNear;
            queryParams.logicOperator = logicOperatorNear;
        } else if (searchQueryNearTatPrimary) {
            queryParams.searchQuery = searchQueryNearTatPrimary;
        }

        try {
            let res_employee = await axios.post(SERVICE.ASSET_MATERIALIP_LIMITED_ACCESS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : [];
            const itemsWithSerialNumber = ans?.map((item, index) => {
                return {
                    ...item,
                    serialNumber: (pageNearTatPrimary - 1) * pageSizeNearTatPrimary + index + 1,
                    ip: item.ip === true ? "Yes" : "No",
                    ebusage: item.ebusage === true ? "Yes" : "No",
                    empdistribution: item.empdistribution === true ? "Yes" : "No",
                    maintenance: item.maintenance === true ? "Yes" : "No",
                    operatingsoftware: item.operatingsoftware === true ? "Yes" : "No",
                    component: item.component,
                };
            });

            setItemsNearTat(itemsWithSerialNumber);
            setOverallFilterdataNear(
                res_employee?.data?.totalProjectsData?.length > 0
                    ? res_employee?.data?.totalProjectsData?.map((item, index) => {
                        return {
                            ...item,
                            serialNumber: (pageNearTatPrimary - 1) * pageSizeNearTatPrimary + index + 1,
                            ip: item.ip === true ? "Yes" : "No",
                            ebusage: item.ebusage === true ? "Yes" : "No",
                            empdistribution: item.empdistribution === true ? "Yes" : "No",
                            maintenance: item.maintenance === true ? "Yes" : "No",
                            operatingsoftware: item.operatingsoftware === true ? "Yes" : "No",
                            component: item.component,
                        };
                    })
                    : []
            );
            setTotalProjectsNear(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPagesNear(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSizeNearTatPrimary((data) => {
                return ans?.length > 0 ? data : 10;
            });
            setPageNearTatPrimary((data) => {
                return ans?.length > 0 ? data : 1;
            });
            setIndividualAsset(itemsWithSerialNumber);
            // console.log(res_employee?.data?.totalProjects, "totalProjectsNear")

            setProjectCheck1(false);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //add function
    const fetchFilteredDatas = async () => {
        setProjectCheck(true);
        try {
            let subprojectscreate = await axios.post(SERVICE.FILTERED_ASSETMATERIAL_IP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: selectedCompanyFrom.map((item) => item.value),
                branch: selectedBranchFrom.map((item) => item.value),
                unit: selectedUnitFrom.map((item) => item.value),
            });

            let ans = subprojectscreate.data.materialipfilter;
            const single = ans;
            const uniqueObjects = [];
            const uniqueKeysMap = new Map();

            single.forEach((obj) => {
                const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.team}-${obj.area}-${obj.location}`;

                if (!uniqueKeysMap.has(key)) {
                    obj.id = [obj._id];
                    uniqueKeysMap.set(key, obj);
                } else {
                    const existingObj = uniqueKeysMap.get(key);
                    existingObj.assetmaterial += `, ${obj.assetmaterial}`;

                    // Check if subcomponents is empty or not
                    if (obj.subcomponents.length > 0) {
                        if (existingObj.subcomponents.length > 0) {
                            existingObj.subcomponents += `, ${obj.subcomponents.join(",")}`;
                        } else {
                            existingObj.subcomponents = obj.subcomponents.join(",");
                        }
                    }

                    if (obj.component.length > 0) {
                        if (existingObj.component.length > 0) {
                            existingObj.component += `, ${obj.component.join(",")}`;
                        } else {
                            existingObj.component = obj.component.join(",");
                        }
                    }

                    existingObj.id = existingObj.id.concat(obj._id);
                    uniqueKeysMap.set(key, existingObj);
                }
            });

            uniqueObjects.push(...uniqueKeysMap.values());

            const itemwithserialnumber = uniqueObjects?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                ids: item.id,
                id: item._id,
                ip: item.ip === true ? "Yes" : "No",
                ebusage: item.ebusage === true ? "Yes" : "No",
                empdistribution: item.empdistribution === true ? "Yes" : "No",
                maintenance: item.maintenance === true ? "Yes" : "No",
                operatingsoftware: item.operatingsoftware === true ? "Yes" : "No",
                component: item.component,

            }));

            SetFilteredIp(itemwithserialnumber);
            setPage(1);
            setProjectCheck(false);
        } catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchFilteredDatas1 = async () => {
        setProjectCheck(true);
        try {
            let subprojectscreate = await axios.post(SERVICE.FILTERED_ASSETMATERIAL_IP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: selectedCompanyFrom.map((item) => item.value),
                branch: selectedBranchFrom.map((item) => item.value),
                unit: selectedUnitFrom.map((item) => item.value),
            });

            let ans = subprojectscreate.data.materialipfilter;
            const uniqueObjects = [];
            const uniqueKeysMap = new Map();

            ans.forEach((obj) => {
                const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.floor}-${obj.area}-${obj.location}`;

                if (!uniqueKeysMap.has(key)) {
                    uniqueKeysMap.set(key, {
                        ...obj,
                        component: [...obj.component],
                    });
                } else {
                    const existingObj = uniqueKeysMap.get(key);
                    // Merge components
                    existingObj.component = Array.from(new Set([...existingObj.component, ...obj.component]));
                    // Merge assetmaterial (comma-separated)
                    existingObj.assetmaterial = Array.from(new Set([...existingObj.assetmaterial.split(", "), ...obj.assetmaterial.split(", ")])).join(", ");
                    uniqueKeysMap.set(key, existingObj);
                }
            });

            uniqueObjects.push(...uniqueKeysMap.values());

            // Map for additional transformation
            const transformedData = uniqueObjects.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                _id: item._id,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                component: item.component,
                floor: item.floor,
                location: item.location,
                area: item.area,
                assetmaterial: item.assetmaterial,
                uniqueid: item.uniqueid,
                ip: item.ip === true ? "Yes" : "No",
                ebusage: item.ebusage === true ? "Yes" : "No",
                empdistribution: item.empdistribution === true ? "Yes" : "No",
                maintenance: item.maintenance === true ? "Yes" : "No",
                operatingsoftware: item.operatingsoftware === true ? "Yes" : "No",
            }));

            SetFilteredIp(transformedData);
            setPage(1);
            setProjectCheck(false);
        } catch (err) {
            setProjectCheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    console.log(filteteredip, "filterip");

    //submit option for saving
    const handleSubmitFilter = (e) => {
        e.preventDefault();

        if (selectedCompanyFrom.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedBranchFrom.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (selectedUnitFrom.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            fetchFilteredDatas();
        }
    };
    const handleClearFilter = async (e) => {
        e.preventDefault();
        // setEbreadingdetailFilter({
        //     company: "Please Select Company",
        //     branch: "Please Select Branch",
        //     floor: "Please Select Floor",
        //     servicenumber: "Please Select Service",
        // })
        setSelectedCompanyFrom([]);
        setSelectedBranchFrom([]);
        setSelectedUnitFrom([]);
        SetFilteredIp([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    return (
        <Box>
            <Headtitle title={"Dynamic Asset Materials"} />
            {/* ****** Header Content ****** */}
            {/* <Typography sx={userStyle.HeaderText}>Dynamic Asset Materials</Typography> */}
            <PageHeading title="Dynamic Asset Materials" modulename="Asset" submodulename="Asset Details" mainpagename="Asset Material IP" subpagename="" subsubpagename="" />
            {isUserRoleCompare?.includes("adynamicassetmaterials") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Dynamic Asset Materials</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                }))
                                                .filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                            styles={colourStyles}
                                            value={selectedCompanyFromCreate}
                                            onChange={handleCompanyChangeFromCreate}
                                            valueRenderer={customValueRendererCompanyFromCreate}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch
                                                ?.filter((comp) =>
                                                    // ebreadingdetailFilter.company === comp.company
                                                    selectedCompanyFromCreate.map((item) => item.value).includes(comp.company)
                                                )
                                                ?.map((data) => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                }))
                                                .filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                            styles={colourStyles}
                                            value={selectedBranchFromCreate}
                                            onChange={handleBranchChangeFromCreate}
                                            valueRenderer={customValueRendererBranchFromCreate}
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
                                            options={isAssignBranch
                                                ?.filter((comp) => selectedCompanyFromCreate.map((item) => item.value).includes(comp.company) && selectedBranchFromCreate.map((item) => item.value).includes(comp.branch))
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                }))
                                                .filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                            styles={colourStyles}
                                            value={selectedUnitFromCreate}
                                            onChange={handleUnitChangeFromCreate}
                                            valueRenderer={customValueRendererUnitFromCreate}
                                            labelledBy="Please Select Unit"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Floor<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {/* <Selects
                                                options={floors}
                                                styles={colourStyles}
                                                value={{ label: maintentancemaster.floor, value: maintentancemaster.floor }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        floor: e.value,
                                                        workstation: "",
                                                        area: "Please Select Area",
                                                        location: "Please Select Location",
                                                        assetmaterial: "Please Select Material"
                                                    });
                                                    setSelectedOptionsMaterial([]);
                                                    setSelectedOptionsComponent([])
                                                    setAreas([])
                                                    setLocations([{ label: "ALL", value: "ALL" }]);
                                                    fetchArea(e.value);
                                                }}
                                            /> */}
                                        <MultiSelect options={floors} styles={colourStyles} value={selectedFloorFromCreate} onChange={handleFloorChangeFromCreate} valueRenderer={customValueRendererFloorFromCreate} labelledBy="Please Select Floor" />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Area<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {/* <Selects
                                                options={areas}
                                                styles={colourStyles}
                                                value={{ label: maintentancemaster.area, value: maintentancemaster.area }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        area: e.value,
                                                        workstation: "",
                                                        location: "Please Select Location",
                                                        assetmaterial: "Please Select Material"
                                                    });
                                                    setSelectedOptionsMaterial([]);
                                                    setAssetdetails([])
                                                    setLocations([{ label: "ALL", value: "ALL" }]);
                                                    fetchLocation(e.value);
                                                }}
                                            /> */}

                                        <MultiSelect options={areas} styles={colourStyles} value={selectedAreaFromCreate} onChange={handleAreaChangeFromCreate} valueRenderer={customValueRendererAreaFromCreate} labelledBy="Please Select Area" />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Location<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {/* <Selects
                                                options={locations}
                                                styles={colourStyles}
                                                value={{
                                                    label: maintentancemaster.location,
                                                    value: maintentancemaster.location,
                                                }}
                                                onChange={(e) => {
                                                    setMaintentancemaster({
                                                        ...maintentancemaster,
                                                        location: e.value,
                                                        assetmaterial: "Please Select Material",
                                                    });
                                                    setSelectedOptionsMaterial([])

                                                }}
                                            /> */}

                                        <MultiSelect options={locations} styles={colourStyles} value={selectedLocationFromCreate} onChange={handleLocationChangeFromCreate} valueRenderer={customValueRendererLocationFromCreate} labelledBy="Please Select Location" />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={materialOpt}
                                            value={{
                                                label: maintentancemaster.assetmaterial,
                                                value: maintentancemaster.assetmaterial,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemaster({
                                                    ...maintentancemaster,
                                                    assetmaterial: e.value,
                                                });
                                                setSelectedOptionsMaterial([]);
                                                setValueComponentCat([]);
                                                setSelectedOptionsComponent([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={
                                                selectedLocationFromCreate.map((item) => item.value).includes("ALL")
                                                    ? Array.from(
                                                        new Set(
                                                            assetdetails
                                                                .filter((t) => locations.map((item) => item.value).includes(t.location)
                                                                    && t?.material === maintentancemaster.assetmaterial)
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.material + "-" + t.code,
                                                                    value: t.material + "-" + t.code,
                                                                    company: t.company,
                                                                    branch: t.branch,
                                                                    unit: t.unit,
                                                                    floor: t.floor,
                                                                    area: t.area,
                                                                    location: t.location,
                                                                }))
                                                                .reduce((acc, curr) => {
                                                                    if (!acc.some((obj) => obj.value === curr.value)) {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                        )
                                                    )
                                                    : Array.from(
                                                        new Set(
                                                            assetdetails
                                                                .filter(
                                                                    (t) =>
                                                                        (selectedLocationFromCreate.map((item) => item.value).includes(t.location) || t.location === "ALL") &&
                                                                        // t.location.includes("ALL")) &&
                                                                        t?.material === maintentancemaster.assetmaterial
                                                                )
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.material + "-" + t.code,
                                                                    value: t.material + "-" + t.code,
                                                                    company: t.company,
                                                                    branch: t.branch,
                                                                    unit: t.unit,
                                                                    floor: t.floor,
                                                                    area: t.area,
                                                                    location: t.location,
                                                                }))
                                                                .reduce((acc, curr) => {
                                                                    if (!acc.some((obj) => obj.value === curr.value)) {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                        )
                                                    )
                                            }
                                            value={selectedOptionsComponent}
                                            onChange={(e) => {
                                                handleComponentChange(e);
                                            }}
                                            valueRenderer={customValueRendererComponent}
                                            labelledBy="Please Select Asset Material"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemaster.ip}
                                                    onChange={(e) =>
                                                        setMaintentancemaster({
                                                            ...maintentancemaster,
                                                            ip: !maintentancemaster.ip,
                                                        })
                                                    }
                                                />
                                            }
                                            label="IP"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemaster.ebusage}
                                                    onChange={(e) =>
                                                        setMaintentancemaster({
                                                            ...maintentancemaster,
                                                            ebusage: !maintentancemaster.ebusage,
                                                        })
                                                    }
                                                />
                                            }
                                            label="EB Usage"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemaster.empdistribution}
                                                    onChange={(e) =>
                                                        setMaintentancemaster({
                                                            ...maintentancemaster,
                                                            empdistribution: !maintentancemaster.empdistribution,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Employee Distribution"
                                        />
                                    </FormGroup>
                                </Grid>

                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemaster.maintenance}
                                                    onChange={(e) =>
                                                        setMaintentancemaster({
                                                            ...maintentancemaster,
                                                            maintenance: !maintentancemaster.maintenance,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Maintenance"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemaster.operatingsoftware}
                                                    onChange={(e) =>
                                                        setMaintentancemaster({
                                                            ...maintentancemaster,
                                                            operatingsoftware: !maintentancemaster.operatingsoftware,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Operating & software"
                                        />
                                    </FormGroup>
                                </Grid>
                            </Grid>
                            <br />
                            <br />

                            <Grid container>
                                <Grid item md={3} xs={12} sm={6}>
                                    <LoadingButton onClick={handleSubmit} loading={loadingdeloverall} sx={buttonStyles.buttonsubmit} loadingPosition="end" variant="contained">
                                        Submit
                                    </LoadingButton>
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
                    <Box sx={{ padding: "10px 20px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Dynamic Asset Materials</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={
                                                isAssignBranch
                                                    ? isAssignBranch
                                                        ?.map((data) => ({
                                                            label: data.company,
                                                            value: data.company,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })
                                                    : []
                                            }
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.company,
                                                value: maintentancemasteredit.company,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material",
                                                });
                                                setAreasEdit([]);
                                                setFloorEdit([]);
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={
                                                isAssignBranch
                                                    ? isAssignBranch
                                                        ?.filter((comp) => maintentancemasteredit.company === comp.company)
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })
                                                    : []
                                            }
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.branch,
                                                value: maintentancemasteredit.branch,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material",
                                                });
                                                setAreasEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setFloorEdit([]);
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                fetchFloorEdit(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={
                                                isAssignBranch
                                                    ? isAssignBranch
                                                        ?.filter((comp) => maintentancemasteredit.company === comp.company && maintentancemasteredit.branch === comp.branch)
                                                        ?.map((data) => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })
                                                    : []
                                            }
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.unit,
                                                value: maintentancemasteredit.unit,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    unit: e.value,
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
                                            options={floorsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.floor,
                                                value: maintentancemasteredit.floor,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    floor: e.value,
                                                    workstation: "",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material",
                                                });
                                                setAreasEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                fetchAreaEdit(maintentancemasteredit.branch, e.value);
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
                                            options={areasEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.area,
                                                value: maintentancemasteredit.area,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    area: e.value,
                                                    workstation: "",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material",
                                                });
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                fetchAllLocationEdit(maintentancemasteredit.branch, maintentancemasteredit.floor, e.value);
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
                                            options={locationsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.location,
                                                value: maintentancemasteredit.location,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    location: e.value,
                                                    assetmaterial: "Please Select Material",
                                                });
                                                setAssetdetails([]);
                                                setSelectedOptionsMaterialEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Asset Material</Typography>
                                        <Selects
                                            options={
                                                maintentancemasteredit.location === "ALL"
                                                    ? Array.from(
                                                        new Set(
                                                            assetdetails
                                                                .filter((t) => locationsEdit.map((item) => item.value).includes(t.location) && t?.component === maintentancemasteredit.assetmaterial)
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.material + "-" + t.code,
                                                                    value: t.material + "-" + t.code,
                                                                }))
                                                                .reduce((acc, curr) => {
                                                                    if (!acc.some((obj) => obj.value === curr.value)) {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                        )
                                                    )
                                                    : Array.from(
                                                        new Set(
                                                            assetdetails
                                                                .filter((t) => t.location === maintentancemasteredit.location && t?.component === maintentancemasteredit.assetmaterial)
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.material + "-" + t.code,
                                                                    value: t.material + "-" + t.code,
                                                                }))
                                                                .reduce((acc, curr) => {
                                                                    if (!acc.some((obj) => obj.value === curr.value)) {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                        )
                                                    )
                                            }
                                            value={{
                                                label: maintentancemasteredit.assetmaterial,
                                                value: maintentancemasteredit.assetmaterial,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    assetmaterial: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                {objectsWithMissingNameEdit?.length > 0 && (
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sub Components</Typography>
                                            <MultiSelect
                                                options={objectsWithMissingNameEdit.map((t) => ({
                                                    ...t,
                                                    label: t.subname + "-" + t.code,
                                                    value: t.subname + "-" + t.code,
                                                }))}
                                                value={selectedOptionsMaterialEdit}
                                                onChange={handleMaterialChangeEdit}
                                                valueRenderer={customValueRendererBranchEdit}
                                                labelledBy="Please Select SubComponents"
                                            />
                                        </FormControl>
                                    </Grid>
                                )}
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    ip: e.target.value,
                                                })
                                            }
                                            label="IP"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    ebusage: e.target.value,
                                                })
                                            }
                                            label="EB Usage"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            onChange={(e) =>
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    empdistribution: e.target.value,
                                                })
                                            }
                                            label="Employee Distribution"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemasteredit.operatingsoftware}
                                                    onChange={(e) =>
                                                        setMaintentancemasteredit({
                                                            ...maintentancemasteredit,
                                                            operatingsoftware: !maintentancemasteredit.operatingsoftware,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Operating & software"
                                        />
                                    </FormGroup>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
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
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpenNear}
                    onClose={handleCloseModEditNear}
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
                    <Box sx={{ padding: "10px 20px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Dynamic Asset Materials</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={
                                                isAssignBranch
                                                    ? isAssignBranch
                                                        ?.map((data) => ({
                                                            label: data.company,
                                                            value: data.company,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })
                                                    : []
                                            }
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.company,
                                                value: maintentancemasteredit.company,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material",
                                                });

                                                setAreasEdit([]);
                                                setFloorEdit([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setComponentValueCateEdit([]);
                                                setSelectedComponentOptionsCateEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={
                                                isAssignBranch
                                                    ? isAssignBranch
                                                        ?.filter((comp) => maintentancemasteredit.company === comp.company)
                                                        ?.map((data) => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })
                                                    : []
                                            }
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.branch,
                                                value: maintentancemasteredit.branch,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                    floor: "Please Select Floor",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material",
                                                });

                                                setAreasEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setFloorEdit([]);
                                                setSelectedOptionsMaterialEdit([]);

                                                fetchFloorEdit(e);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={
                                                isAssignBranch
                                                    ? isAssignBranch
                                                        ?.filter((comp) => maintentancemasteredit.company === comp.company && maintentancemasteredit.branch === comp.branch)
                                                        ?.map((data) => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        }))
                                                        .filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })
                                                    : []
                                            }
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.unit,
                                                value: maintentancemasteredit.unit,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
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
                                            options={floorsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.floor,
                                                value: maintentancemasteredit.floor,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    floor: e.value,
                                                    workstation: "",
                                                    area: "Please Select Area",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material",
                                                });
                                                setAreasEdit([]);
                                                setSelectedOptionsMaterialEdit([]);
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                fetchAreaEdit(maintentancemasteredit.branch, e.value);
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
                                            options={areasEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.area,
                                                value: maintentancemasteredit.area,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    area: e.value,
                                                    workstation: "",
                                                    location: "Please Select Location",
                                                    assetmaterial: "Please Select Material",
                                                });
                                                setLocationsEdit([{ label: "ALL", value: "ALL" }]);
                                                setSelectedOptionsMaterialEdit([]);
                                                fetchAllLocationEdit(maintentancemasteredit.branch, maintentancemasteredit.floor, e.value);
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
                                            options={locationsEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: maintentancemasteredit.location,
                                                value: maintentancemasteredit.location,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    location: e.value,
                                                    assetmaterial: "Please Select Material",
                                                });
                                                setSelectedOptionsMaterialEdit([]);
                                                setSelectedOptionsMaterialEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Material<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={materialOpt}
                                            value={{
                                                label: maintentancemasteredit.assetmaterial,
                                                value: maintentancemasteredit.assetmaterial,
                                            }}
                                            onChange={(e) => {
                                                setMaintentancemasteredit({
                                                    ...maintentancemasteredit,
                                                    assetmaterial: e.value,
                                                });
                                                setComponentValueCateEdit([]);
                                                setSelectedComponentOptionsCateEdit([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset Material<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <MultiSelect
                                            options={
                                                maintentancemasteredit.location === "ALL"
                                                    ? Array.from(
                                                        new Set(
                                                            assetdetails
                                                                .filter((t) => locationsEdit.map((item) => item.value).includes(t.location) && t?.material === maintentancemasteredit.assetmaterial)
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.material + "-" + t.code,
                                                                    value: t.material + "-" + t.code,
                                                                }))
                                                                .reduce((acc, curr) => {
                                                                    if (!acc.some((obj) => obj.value === curr.value)) {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                        )
                                                    )
                                                    : Array.from(
                                                        new Set(
                                                            assetdetails
                                                                .filter((t) => t.location === maintentancemasteredit.location && t?.material === maintentancemasteredit.assetmaterial)
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.material + "-" + t.code,
                                                                    value: t.material + "-" + t.code,
                                                                }))
                                                                .reduce((acc, curr) => {
                                                                    if (!acc.some((obj) => obj.value === curr.value)) {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                        )
                                                    )
                                            }
                                            value={selectedComponentOptionsCateEdit}
                                            onChange={handleComponentChangeEdit}
                                            valueRenderer={customValueRendererComponentEdit}
                                            labelledBy="Please Select Asset Material"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemasteredit.ip}
                                                    onChange={(e) =>
                                                        setMaintentancemasteredit({
                                                            ...maintentancemasteredit,
                                                            ip: !maintentancemasteredit.ip,
                                                        })
                                                    }
                                                />
                                            }
                                            label="IP"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemasteredit.ebusage}
                                                    onChange={(e) =>
                                                        setMaintentancemasteredit({
                                                            ...maintentancemasteredit,
                                                            ebusage: !maintentancemasteredit.ebusage,
                                                        })
                                                    }
                                                />
                                            }
                                            label="EB Usage"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemasteredit.empdistribution}
                                                    onChange={(e) =>
                                                        setMaintentancemasteredit({
                                                            ...maintentancemasteredit,
                                                            empdistribution: !maintentancemasteredit.empdistribution,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Employee Distribution"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemasteredit.maintenance}
                                                    onChange={(e) =>
                                                        setMaintentancemasteredit({
                                                            ...maintentancemasteredit,
                                                            maintenance: !maintentancemasteredit.maintenance,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Maintenance"
                                        />
                                    </FormGroup>
                                </Grid>
                                <Grid item md={2} sm={2} xs={6}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={maintentancemasteredit.operatingsoftware}
                                                    onChange={(e) =>
                                                        setMaintentancemasteredit({
                                                            ...maintentancemasteredit,
                                                            operatingsoftware: !maintentancemasteredit.operatingsoftware,
                                                        })
                                                    }
                                                />
                                            }
                                            label="Operating & software"
                                        />
                                    </FormGroup>
                                </Grid>

                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmitNear}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleCloseModEditNear}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>

            <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("ldynamicassetmaterials") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}> Group Asset IP List</Typography>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={2.4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch
                                            ?.map((data) => ({
                                                label: data.company,
                                                value: data.company,
                                            }))
                                            .filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                        styles={colourStyles}
                                        value={selectedCompanyFrom}
                                        onChange={handleCompanyChangeFrom}
                                        valueRenderer={customValueRendererCompanyFrom}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={2.4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch
                                            ?.filter((comp) =>
                                                // ebreadingdetailFilter.company === comp.company
                                                selectedCompanyFrom.map((item) => item.value).includes(comp.company)
                                            )
                                            ?.map((data) => ({
                                                label: data.branch,
                                                value: data.branch,
                                            }))
                                            .filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                        styles={colourStyles}
                                        value={selectedBranchFrom}
                                        onChange={handleBranchChangeFrom}
                                        valueRenderer={customValueRendererBranchFrom}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={2.4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch
                                            ?.filter((comp) => selectedCompanyFrom.map((item) => item.value).includes(comp.company) && selectedBranchFrom.map((item) => item.value).includes(comp.branch))
                                            ?.map((data) => ({
                                                label: data.unit,
                                                value: data.unit,
                                            }))
                                            .filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                        styles={colourStyles}
                                        value={selectedUnitFrom}
                                        onChange={handleUnitChangeFrom}
                                        valueRenderer={customValueRendererUnitFrom}
                                        labelledBy="Please Select Unit"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={1} xs={12} sm={12} marginTop={3}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmitFilter}>
                                    Filter
                                </Button>
                            </Grid>
                            <Grid item md={0.5} xs={12} sm={12} marginTop={3}>
                                <Button onClick={handleClearFilter} sx={buttonStyles.btncancel}>
                                    Clear
                                </Button>
                            </Grid>
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
                                        <MenuItem value={filteteredip.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("exceldynamicassetmaterials") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    // fetchMaintentanceIndividual()
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvdynamicassetmaterials") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    // fetchMaintentanceIndividual()
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}

                                    {isUserRoleCompare?.includes("printdynamicassetmaterials") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    )}

                                    {isUserRoleCompare?.includes("pdfdynamicassetmaterials") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                    // fetchMaintentanceIndividual()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagedynamicassetmaterials") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={filteteredip} setSearchedString={setSearchedString} searchQuery={searchQuery} setSearchQuery={setSearchQuery} paginated={false} totalDatas={filteteredip} />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={1}>
                            <Grid item md={6} xs={12} sm={12}>
                                <Box sx={{ display: "flex", justifyContent: "left", flexWrap: "wrap", gap: "10px" }}>
                                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                        Show All Columns
                                    </Button>
                                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                        Manage Columns
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>

                        <br />
                        <br />
                        {projectCheck ? (
                            <Box sx={userStyle.container}>
                                <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden" }}>
                                    <>
                                        <AggridTable
                                            rowDataTable={rowDataTable}
                                            columnDataTable={columnDataTable}
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
                                            itemsList={filteteredip}
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

            <Popover id={id} open={isManageColumnsOpen} anchorEl={anchorEl} onClose={handleCloseManageColumns} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} transformOrigin={{ vertical: "center", horizontal: "right" }}>
                {manageColumnsContent}
            </Popover>

            <Popover
                id={idneartat}
                open={isManageColumnsOpenNeartat}
                anchorEl={anchorElNeartat}
                onClose={handleCloseManageColumnsNeartat}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            // transformOrigin={{ vertical: 'center', horizontal: 'right', }}
            >
                {manageColumnsContentNeartat}
            </Popover>

            {/* Manage Column */}
            <Popover id={idSearchNear} open={openSearchNear} anchorEl={anchorElSearchNear} onClose={handleCloseSearchNear} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Box style={{ padding: "10px", maxWidth: "450px" }}>
                    <Typography variant="h6">Advance Search</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseSearchNear}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{ width: "100%" }}>
                        <Box
                            sx={{
                                width: "350px",
                                maxHeight: "400px",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            <Box
                                sx={{
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                    // paddingRight: '5px'
                                }}
                            >
                                <Grid container spacing={1}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Columns</Typography>
                                        <Select
                                            fullWidth
                                            size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150 }}
                                            value={selectedColumnNear}
                                            onChange={(e) => setSelectedColumnNear(e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>
                                                Select Column
                                            </MenuItem>
                                            {filteredSelectedColumnNear.map((col) => (
                                                <MenuItem key={col.field} value={col.field}>
                                                    {col.headerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Operator</Typography>
                                        <Select
                                            fullWidth
                                            size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: "auto",
                                                    },
                                                },
                                            }}
                                            style={{ minWidth: 150 }}
                                            value={selectedConditionNear}
                                            onChange={(e) => setSelectedConditionNear(e.target.value)}
                                            disabled={!selectedColumnNear}
                                        >
                                            {conditionsNear.map((condition) => (
                                                <MenuItem key={condition} value={condition}>
                                                    {condition}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>Value</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={["Blank", "Not Blank"].includes(selectedConditionNear) ? "" : filterValueNear}
                                            onChange={(e) => setFilterValueNear(e.target.value)}
                                            disabled={["Blank", "Not Blank"].includes(selectedConditionNear)}
                                            placeholder={["Blank", "Not Blank"].includes(selectedConditionNear) ? "Disabled" : "Enter value"}
                                            sx={{
                                                "& .MuiOutlinedInput-root.Mui-disabled": {
                                                    backgroundColor: "rgb(0 0 0 / 26%)",
                                                },
                                                "& .MuiOutlinedInput-input.Mui-disabled": {
                                                    cursor: "not-allowed",
                                                },
                                            }}
                                        />
                                    </Grid>
                                    {additionalFiltersNear.length > 0 && (
                                        <>
                                            <Grid item md={12} sm={12} xs={12}>
                                                <RadioGroup row value={logicOperatorNear} onChange={(e) => setLogicOperatorNear(e.target.value)}>
                                                    <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                    <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                </RadioGroup>
                                            </Grid>
                                        </>
                                    )}
                                    {additionalFiltersNear.length === 0 && (
                                        <Grid item md={4} sm={12} xs={12}>
                                            <Button variant="contained" onClick={handleAddFilterNear} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedConditionNear) ? false : !filterValueNear || selectedColumnNear.length === 0}>
                                                Add Filter
                                            </Button>
                                        </Grid>
                                    )}

                                    <Grid item md={2} sm={12} xs={12}>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                fetchMaintentanceIndividualSingle();
                                                setIsSearchActiveNear(true);
                                                setAdvancedFilterNear([...additionalFiltersNear, { column: selectedColumnNear, condition: selectedConditionNear, value: filterValueNear }]);
                                            }}
                                            sx={{ textTransform: "capitalize" }}
                                            disabled={["Blank", "Not Blank"].includes(selectedConditionNear) ? false : !filterValueNear || selectedColumnNear.length === 0}
                                        >
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </DialogContent>
                </Box>
            </Popover>

            <br />
            <>
                <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>Individual Asset IP List</Typography>
                    </Grid>
                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select
                                    id="pageSizeSelect"
                                    value={pageSizeNearTatPrimary}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeNearTatPrimary}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={totalProjectsNear}>All</MenuItem>
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Box>
                                {isUserRoleCompare?.includes("exceldynamicassetmaterials") && (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                setIsFilterOpennear(true);
                                                // fetchMaintentanceIndividual()
                                                setFormat("xl");
                                            }}
                                            sx={userStyle.buttongrp}
                                        >
                                            <FaFileExcel />
                                            &ensp;Export to Excel&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csvdynamicassetmaterials") && (
                                    <>
                                        <Button
                                            onClick={(e) => {
                                                setIsFilterOpennear(true);
                                                // fetchMaintentanceIndividual()
                                                setFormat("csv");
                                            }}
                                            sx={userStyle.buttongrp}
                                        >
                                            <FaFileCsv />
                                            &ensp;Export to CSV&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printdynamicassetmaterials") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprintNear}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfdynamicassetmaterials") && (
                                    <>
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpennear(true);
                                                // fetchMaintentanceIndividual()
                                            }}
                                        >
                                            <FaFilePdf />
                                            &ensp;Export to PDF&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("imagedynamicassetmaterials") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImagenear}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <OutlinedInput
                                    size="small"
                                    id="outlined-adornment-weight"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FaSearch />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {advancedFilterNear && (
                                                <IconButton onClick={handleResetSearchNear}>
                                                    <MdClose />
                                                </IconButton>
                                            )}
                                            <Tooltip title="Show search options">
                                                <span>
                                                    <IoMdOptions style={{ cursor: "pointer" }} onClick={handleClickSearchNear} />
                                                </span>
                                            </Tooltip>
                                        </InputAdornment>
                                    }
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{ "aria-label": "weight" }}
                                    type="text"
                                    value={getSearchDisplayNear()}
                                    onChange={handleSearchChangeNearTatPrimary}
                                    placeholder="Type to search..."
                                    disabled={!!advancedFilterNear}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <br />
                    <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsNeartat}>
                        Show All Columns
                    </Button>
                    &ensp;
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsNeartat}>
                        Manage Columns
                    </Button>
                    &ensp;
                    {isUserRoleCompare?.includes("bddynamicassetmaterials") && (
                        <Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>
                            Bulk Delete
                        </Button>
                    )}
                    <br />
                    <br />
                    {projectCheck1 ? (
                        <Box sx={userStyle.container}>
                            <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Box style={{ width: "100%", overflowY: "hidden" }}>
                                <>
                                    <AggridTableForPaginationTable
                                        rowDataTable={rowDataTableNearTat}
                                        columnDataTable={columnDataTableNeartat}
                                        columnVisibility={columnVisibilityNeartat}
                                        page={pageNearTatPrimary}
                                        setPage={setPageNearTatPrimary}
                                        pageSize={pageSizeNearTatPrimary}
                                        totalPages={totalPagesNear}
                                        setColumnVisibility={setColumnVisibilityNeartat}
                                        selectedRows={selectedRowsNear}
                                        setSelectedRows={setSelectedRowsNear}
                                        gridRefTable={gridRefTableNear}
                                        totalDatas={totalProjectsNear}
                                        setFilteredRowData={setFilteredRowDataNear}
                                        filteredRowData={filteredRowDataNear}
                                        gridRefTableImg={gridRefTableImgNear}
                                        itemsList={overallFilterdataNear}
                                    />
                                </>
                            </Box>
                        </>
                    )}
                </Box>
            </>

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseMod}
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delProject(projectid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenNear} onClose={handleCloseModNear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModNear}
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delProjectNear(projectid)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* this is info view details */}
                {/* <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                sx={{marginTop:"95px"}}
                
                >
                    <Box sx={{ width: "550px", padding: "20px 50px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>Group Dynamic Asset Materials Info</Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">addedby</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {addedby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Updated by</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <br />
                            <Grid container spacing={2}>
                                <Button variant="contained" onClick={handleCloseinfo}>
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Grid>
                        </>
                    </Box>
                </Dialog> */}

                {/* print layout */}

                {/* <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell> Company</TableCell>
                                <TableCell> Branch</TableCell>
                                <TableCell> Unit</TableCell>
                                <TableCell>Floor</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Material</TableCell>
                                <TableCell>Asset Material</TableCell>
                                <TableCell>IP</TableCell>
                                <TableCell>EB Usage</TableCell>
                                <TableCell>Employee Distribution</TableCell>
                                <TableCell>Maintenance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.floor}</TableCell>
                                        <TableCell>{row.area}</TableCell>
                                        <TableCell>{row.location}</TableCell>
                                        <TableCell>{row.assetmaterial}</TableCell>
                                        <TableCell>{row.component}</TableCell>
                                        <TableCell>{row.ip}</TableCell>
                                        <TableCell>{row.ebusage}</TableCell>
                                        <TableCell>{row.empdistribution}</TableCell>
                                        <TableCell>{row.maintenance}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>



                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefNear}>
                        <TableHead>
                            <TableRow>
                                <TableCell> SI.No</TableCell>
                                <TableCell> Company</TableCell>
                                <TableCell> Branch</TableCell>
                                <TableCell> Unit</TableCell>
                                <TableCell>Floor</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Material</TableCell>
                                <TableCell>Asset Material</TableCell>
                                <TableCell>IP</TableCell>
                                <TableCell>EB Usage</TableCell>
                                <TableCell>Employee Distribution</TableCell>
                                <TableCell>Maintenance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTableNearTat &&
                                rowDataTableNearTat.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.company}</TableCell>
                                        <TableCell>{row.branch}</TableCell>
                                        <TableCell>{row.unit}</TableCell>
                                        <TableCell>{row.floor}</TableCell>
                                        <TableCell>{row.area}</TableCell>
                                        <TableCell>{row.location}</TableCell>
                                        <TableCell>{row.assetmaterial}</TableCell>
                                        <TableCell>{row.component}</TableCell>
                                        <TableCell>{row.ip}</TableCell>
                                        <TableCell>{row.ebusage}</TableCell>
                                        <TableCell>{row.empdistribution}</TableCell>
                                        <TableCell>{row.maintenance}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}
            </Box>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: "95px" }} fullWidth={true}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Group Dynamic Asset Materials</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{maintentancemasteredit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{maintentancemasteredit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{maintentancemasteredit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{maintentancemasteredit.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{maintentancemasteredit.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Location</Typography>
                                    <Typography>{maintentancemasteredit.location}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Material</Typography>
                                    <Typography>{maintentancemasteredit.assetmaterial}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Material</Typography>

                                    <Typography> {maintentancemasteredit.component}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">IP</Typography>
                                    <Typography>{maintentancemasteredit.ip}</Typography>{" "}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">EB Usage</Typography>
                                    <Typography>{maintentancemasteredit.ebusage}</Typography>{" "}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Distribution</Typography>
                                    <Typography>{maintentancemasteredit.empdistribution}</Typography>{" "}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Maintenance</Typography>
                                    <Typography>{maintentancemasteredit.maintenance}</Typography>{" "}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Operating & software</Typography>
                                    <Typography>{maintentancemasteredit.operatingsoftware}</Typography>{" "}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            <Dialog open={openviewnear} onClose={handleClickOpenviewnear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{ marginTop: "95px" }}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Individual Dynamic Asset Materials</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{maintentancemasteredit.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{maintentancemasteredit.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{maintentancemasteredit.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{maintentancemasteredit.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{maintentancemasteredit.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Location</Typography>
                                    <Typography>{maintentancemasteredit.location}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Material</Typography>
                                    <Typography>{maintentancemasteredit.assetmaterial}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Material</Typography>
                                    <Typography>{maintentancemasteredit.component}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>IP</Typography>
                                    <Typography>{maintentancemasteredit.ip}</Typography>{" "}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>EB Usage</Typography>
                                    <Typography>{maintentancemasteredit.ebusage}</Typography>{" "}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Employee Distribution</Typography>
                                    <Typography>{maintentancemasteredit.empdistribution}</Typography>{" "}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Maintenance</Typography>
                                    <Typography>{maintentancemasteredit.maintenance}</Typography>{" "}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Operating & software</Typography>
                                    <Typography>{maintentancemasteredit.operatingsoftware}</Typography>{" "}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseviewnear}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={delProjectcheckbox}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                            // fetchMaintentanceIndividual()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>


            {/*Export pdf Data  */}
            {/* <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterMod}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog> */}

            {/* //individual */}

            {/* <Dialog open={isFilterOpennear} onClose={handleCloseFilterModnear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModnear}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLnear("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLnear("overall")
                            // fetchMaintentanceIndividual()
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog> */}
            {/*Export pdf Data  */}
            {/* <Dialog open={isPdfFilterOpennear} onClose={handleClosePdfFilterModnear} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModnear}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdfNear("filtered")
                            setIsPdfFilterOpennear(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfNear("overall")
                            setIsPdfFilterOpennear(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog> */}

            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
            <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
            {/* SUCCESS */}
            <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
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
                itemsTwo={filteteredip ?? []}
                filename={"AssetIP Group"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpennear}
                handleCloseFilterMod={handleCloseFilterModnear}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpennear}
                isPdfFilterOpen={isPdfFilterOpennear}
                setIsPdfFilterOpen={setIsPdfFilterOpennear}
                handleClosePdfFilterMod={handleClosePdfFilterModnear}
                filteredDataTwo={(filteredChangesNear !== null ? filteredRowDataNear : rowDataTableNearTat) ?? []}
                itemsTwo={overallFilterdataNear ?? []}
                filename={"AssetIP Individual"}
                exportColumnNames={exportColumnNamesNear}
                exportRowValues={exportRowValuesNear}
                componentRef={componentRefNear}
            />
            {/* INFO */}
            <InfoPopup openInfo={openInfo} handleCloseinfo={handleCloseinfo} heading="Asset Detail Info" addedby={addedby} updateby={updateby} />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation open={isDeleteOpen} onClose={handleCloseMod} onConfirm={delProject} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
            <DeleteConfirmation open={isDeleteOpenNear} onClose={handleCloseModNear} onConfirm={delProjectNear} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} onConfirm={delProjectcheckbox} title="Are you sure?" confirmButtonText="Yes" cancelButtonText="Cancel" />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow open={isDeleteOpenalert} onClose={handleCloseModalert} message="Please Select any Row" iconColor="orange" buttonText="OK" />
        </Box>
    );
}

export default AssetMaterialIP;
