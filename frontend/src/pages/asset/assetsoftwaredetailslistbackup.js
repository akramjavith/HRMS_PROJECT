import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { MultiSelect } from "react-multi-select-component";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { StyledTableCell, StyledTableRow } from "../../components/Table.js";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
    FaFileCsv, FaTrash, FaSearch,
    FaFileExcel,
    FaFilePdf,
    FaPlus,
    FaPrint,
} from "react-icons/fa";
import {
    Box,
    Button,
    Checkbox,
    TableCell,
    Table,
    TableContainer,
    Paper,
    TableBody,
    TableHead,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormGroup,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Popover,
    Select, Radio, InputAdornment, FormControlLabel, RadioGroup, Tooltip,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling.js";
import Headtitle from "../../components/Headtitle.js";
import Pagination from "../../components/Pagination.js";
import StyledDataGrid from "../../components/TableStyle.js";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext.js";
import { colourStyles, userStyle } from "../../pageStyle.js";
import { SERVICE } from "../../services/Baseservice.js";
import Webcamimage from "./Webcameimageasset.js";
import AlertDialog from "../../components/Alert.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData.js";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert.js";
import PageHeading from "../../components/PageHeading.js";
import AggregatedSearchBar from "../../components/AggregatedSearchBar.js";
import AggridTable from "../../components/AggridTable.js";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import domtoimage from 'dom-to-image';
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import ManageColumnsContent from "../../components/ManageColumn.js";
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';


const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

function AssetSoftwareDetailsList() {
    const [items, setItems] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);
    const { auth } = useContext(AuthContext);
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        allfloor,
        alllocationgrouping,
        allareagrouping, pageName, setPageName, buttonStyles,
    } = useContext(UserRoleAccessContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [materialOptcode, setMaterialoptCode] = useState([]);
    const [floors, setFloors] = useState([]);

    const [applicationNameArray, setApplicationNameArray] = useState([]);

    const [specificationGrouping, setSpecificationGrouping] = useState([]);


    const fetchAssetDetailsGetVendor = async (code, e) => {
        try {
            let res_vendor = await axios.post(SERVICE.ASSETDETAIL_GETVENDOR, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                code: code
            });
            setAssetdetail({
                ...assetdetail,

                company: e.company,
                branch: e.branch, unit: e.unit, floor: e.floor,
                area: e.area, location: e.location, assetmaterialcode: e.value,
                vendor: res_vendor?.data?.assetdetails.vendor,
                address: res_vendor?.data?.assetdetails.address,
                phonenumber: res_vendor?.data?.assetdetails.phonenumber,
                material: e.assetmaterial, type: "Please Select Type",
            });

            // setAssetdetails(res_vendor?.data?.assetdetails);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };



    const fetchSpecificationGrouping = async (name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ALL_ASSETSOFTWAREGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // let getvalues = res?.data?.assertsoftwaregrouping.filter(
            //     (item) =>
            //         item.material === assetdetail.assetmaterialcode.split("-")[0]

            // );
            function gettruvale(name) {
                const obj = res?.data?.assertsoftwaregrouping.find((item) => item.material === name);
                return obj ? Object.entries(obj)
                    .filter(([key, value]) => key !== "material" && key !== "addedby" && key !== "updatedby" && value === true)
                    .map(([key]) => key) : [];
            }

            setSpecificationGrouping(gettruvale(name).map(item => ({
                ...item,
                label: item === "applicationname" ? "Application Name" :
                    item === "operatingsystem" ? "Operating System" :
                        item === "remoteaccesssoftware" ? "Remote Access Software" :
                            item === "webbrowser" ? "Web Browser" :
                                item === "devicedrivers" ? "Device Drivers" :
                                    item === "productivitysoftware" ? "Productivity Software" :
                                        item === "cloudcomputingsoftware" ? "Cloud Computing Software" :
                                            item === "communicationsoftware" ? "Communication Software" :
                                                item === "developmentsoftware" ? "Development Software" :

                                                    item === "multimediasoftware" ? "Multimedia Software" :
                                                        item === "databasemanagementsoftware" ? "Database Management Software" :
                                                            item === "securitysoftware" ? "Security Software" :
                                                                item === "networksoftware" ? "Network Software" :
                                                                    item === "printersoftware" ? "Printer Software" : "",

                value: item === "applicationname" ? "Application Name" :
                    item === "operatingsystem" ? "Operating System" :
                        item === "remoteaccesssoftware" ? "Remote Access Software" :
                            item === "webbrowser" ? "Web Browser" :
                                item === "devicedrivers" ? "Device Drivers" :
                                    item === "productivitysoftware" ? "Productivity Software" :
                                        item === "cloudcomputingsoftware" ? "Cloud Computing Software" :
                                            item === "communicationsoftware" ? "Communication Software" :
                                                item === "developmentsoftware" ? "Development Software" :

                                                    item === "multimediasoftware" ? "Multimedia Software" :
                                                        item === "databasemanagementsoftware" ? "Database Management Software" :
                                                            item === "securitysoftware" ? "Security Software" :
                                                                item === "networksoftware" ? "Network Software" :
                                                                    item === "printersoftware" ? "Printer Software" : ""
            })));
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const fetchApplicationName = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_SOFTWARESPECIFICATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setApplicationNameArray(res_freq?.data?.softwarespecification);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchMaterialCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.ASSETMATERIALIP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const result = res?.data?.assetmaterialip

            setMaterialoptCode(result);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            ;
        }
    };


    const typeOpt = [
        { label: "Remote Access Software", value: "Remote Access Software" },
        { label: "Web Browser", value: "Web Browser" },
        { label: "Device Drivers", value: "Device Drivers" },
        { label: "Productivity Software", value: "Productivity Software" },
        { label: "Cloud Computing Software", value: "Cloud Computing Software" },
        { label: "Communication Software", value: "Communication Software" },
        { label: "Development Software", value: "Development Software" },
        { label: "Multimedia Software", value: "Multimedia Software" },
        { label: "Database Management Software", value: "Database Management Software" },
        { label: "Security Software", value: "Security Software" },
        { label: "Network Software", value: "Network Software" },
        { label: "Printer Software", value: "Printer Software" },
        { label: "Application Name", value: "Application Name" },
        { label: "Operating System", value: "Operating System" },
    ];

    const statusOpt = [
        { label: "Free", value: "Free" },
        { label: "Paid", value: "Paid" },
        { label: "Paid-w/o Warranty", value: "Paid-w/o Warranty" },

    ];

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


    const [selectedRowsAssetList, setSelectedRowsAssetList] = useState([])
    // Error Popup model
    const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
    const [showAlertpop, setShowAlertpop] = useState();
    const handleClickOpenerrpop = () => {
        setIsErrorOpenpop(true);
    };
    const handleCloseerrpop = () => {
        setIsErrorOpenpop(false);
    };

    const [ovProj, setOvProj] = useState("");
    const [ovProjcode, setOvProjcode] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const [overalldeletecheck, setOveraldeletecheck] = useState({

        assetmaterialip: [],
        assetworkstationgrouping: [],
        // maintenancedetailsmaster: [],
        maintenancemaster: [],
        assetempdistribution: [],
        maintenancenonschedulegrouping: [],
    });

    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
    };

    //check delete model
    const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
    const handleClickOpenCheckbulk = () => {
        setisCheckOpenbulk(true);
    };
    const handlebulkCloseCheck = () => {

        setisCheckOpenbulk(false);
    };



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
    const [visiblePages, setVisiblePages] = useState(3);

    const [pageNumbers, setPageNumbers] = useState([]);

    //MULTISELECT ONCHANGE START

    //company multiselect
    //team multiselect
    const [materialOpt, setMaterialopt] = useState([]);
    const [selectedOptionsAssetMaterial, setSelectedOptionsAssetMaterial] = useState([]);
    let [valueAssetMaterial, setValueAssetMaterial] = useState([]);
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueAssetMaterial([]);
        setSelectedOptionsAssetMaterial([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueAssetMaterial([]);
        setSelectedOptionsAssetMaterial([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);

    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueAssetMaterial([]);
        setSelectedOptionsAssetMaterial([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };



    const handleAssetMaterialChange = (options) => {
        setValueAssetMaterial(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsAssetMaterial(options);
    };

    const customValueRendererAssetMaterial = (valueAssetMaterial, _categoryname) => {
        return valueAssetMaterial?.length
            ? valueAssetMaterial?.map(({ label }) => label)?.join(", ")
            : "Please Select Asset Material";
    };
    //auto select all dropdowns
    const handleAutoSelect = async () => {
        setPageName(!pageName)
        try {
            let selectedValues = accessbranch
                ?.map((data) => ({
                    company: data.company,
                    branch: data.branch,
                    unit: data.unit,
                }))
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                );
            let selectedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                .map((a, index) => {
                    return a.company;
                });

            let mappedCompany = selectedValues
                ?.filter(
                    (value, index, self) =>
                        index === self.findIndex((t) => t.company === value.company)
                )
                ?.map((data) => ({
                    label: data?.company,
                    value: data?.company,
                }));

            setValueCompanyCat(selectedCompany);
            setSelectedOptionsCompany(mappedCompany);

            let selectedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                .map((a, index) => {
                    return a.branch;
                });

            let mappedBranch = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) => t.company === value.company && t.branch === value.branch
                        )
                )
                ?.map((data) => ({
                    label: data?.branch,
                    value: data?.branch,
                }));

            setValueBranchCat(selectedBranch);
            setSelectedOptionsBranch(mappedBranch);

            let selectedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                .map((a, index) => {
                    return a.unit;
                });

            let mappedUnit = selectedValues
                .filter(
                    (value, index, self) =>
                        index ===
                        self.findIndex(
                            (t) =>
                                t.company === value.company &&
                                t.branch === value.branch &&
                                t.unit === value.unit
                        )
                )
                ?.map((data) => ({
                    label: data?.unit,
                    value: data?.unit,
                }));

            setValueUnitCat(selectedUnit);
            setSelectedOptionsUnit(mappedUnit);

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //cancel for create section
    const handleAssetMaterials = async () => {
        try {
            let res = await axios.get(SERVICE.ASSETMATERIALIP, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const resultall = res?.data?.assetmaterialip?.map((d) => ({
                ...d,
                label: d.component,
                value: d.component,

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
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    useEffect(() => {
        handleAssetMaterials();
    }, []);


    useEffect(() => {
        handleAutoSelect();
    }, [isAssignBranch]);


    const [selectedCompanyFromCreate, setSelectedCompanyFromCreate] = useState([]);
    const [selectedBranchFromCreate, setSelectedBranchFromCreate] = useState([]);
    const [selectedUnitFromCreate, setSelectedUnitFromCreate] = useState([]);
    const [selectedFloorFromCreate, setSelectedFloorFromCreate] = useState([]);
    const [selectedAreaFromCreate, setSelectedAreaFromCreate] = useState([]);
    const [selectedLocationFromCreate, setSelectedLocationFromCreate] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const [selectedOptionsMaterial, setSelectedOptionsMaterial] = useState([]);
    const [selectedOptionsComponent, setSelectedOptionsComponent] = useState([]);
    let [valueComponentCat, setValueComponentCat] = useState([]);

    //branch multiselect dropdown changes
    const handleChangeOptions = (options) => {
        setSelectedOptions(options);
    };
    const customValueRendererOptions = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Options";
    };



    //create
    //branch multiselect dropdown changes
    const handleCompanyChangeFromCreate = (options) => {
        setSelectedCompanyFromCreate(options);
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });

        setSelectedBranchFromCreate([]);
        setSelectedUnitFromCreate([]);
        setSelectedAreaFromCreate([]);
        setSelectedUnitFromCreate([]);
        setSelectedFloorFromCreate([]);

        setSelectedLocationFromCreate([]);
        setSelectedOptionsMaterial([]);
        setMaterialoptCode([])
        setFloors([]);
        setAreas([]);
        setSelectedOptions([])
        setAddedOptions([])
        setLocations([{ label: "ALL", value: "ALL" }]);

    };
    const customValueRendererCompanyFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Company";
    };

    //branch multiselect dropdown changes
    const handleBranchChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);
        setSelectedBranchFromCreate(options);
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedUnitFromCreate([]);
        setSelectedAreaFromCreate([]);
        setSelectedFloorFromCreate([]);
        setLocations([{ label: "ALL", value: "ALL" }]);
        setAreas([]);
        fetchFloor(selectedValues);
        setSelectedOptionsMaterial([]);
        setMaterialoptCode([])
        setSelectedOptions([])
        setSelectedOptionsComponent([]);
        setAddedOptions([])

    };
    const customValueRendererBranchFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Branch";
    };

    //branch multiselect dropdown changes
    const handleUnitChangeFromCreate = (options) => {
        setSelectedUnitFromCreate(options);
        setAssetdetail({
            ...assetdetail,
            assetmaterial: "Please Select Material",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedAreaFromCreate([]);

        setSelectedOptions([])
        setMaterialoptCode([])
        setSelectedOptionsComponent([]);
        setSelectedFloorFromCreate([]);
        setAddedOptions([])
        setLocations([{ label: "ALL", value: "ALL" }]);
    };
    const customValueRendererUnitFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
    };

    const handleFloorChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);
        setSelectedFloorFromCreate(options);

        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptionsMaterial([]);
        setSelectedOptionsComponent([]);
        setMaterialoptCode([])
        setAreas([]);
        setSelectedOptions([])

        setAddedOptions([])
        setLocations([{ label: "ALL", value: "ALL" }]);
        fetchArea(selectedBranchFromCreate.map(item => item.value), selectedValues);
    };
    const customValueRendererFloorFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Floor";
    };

    const handleAreaChangeFromCreate = (options) => {
        const selectedValues = options.map((a) => a.value);

        setSelectedAreaFromCreate(options);
        setSelectedOptionsComponent([]);
        setMaterialoptCode([])
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptions([])
        setAddedOptions([])
        fetchLocation(selectedBranchFromCreate.map(item => item.value), selectedFloorFromCreate.map(item => item.value), selectedValues);

    };
    const customValueRendererAreaFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Area";
    };

    const handleLocationChangeFromCreate = (options) => {
        setSelectedLocationFromCreate(options);
        const selectedValues = options.map((a) => a.value);
        fetchMaterialCode(selectedValues)
        setSelectedOptionsComponent([]);
        setAssetdetail({
            ...assetdetail,
            assetmaterialcode: "Please Select AssetMaterial",
            type: "Please Select Type",
            vendor: "",
            address: "",
            phonenumber: ""
        });
        setSelectedOptions([])
        setAddedOptions([])
    };
    const customValueRendererLocationFromCreate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Location";
    };

    const [addedOptions, setAddedOptions] = useState([]);

    const handleAddOptions = () => {
        // Avoid duplicate entries
        const newEntries = selectedOptions.filter(
            (opt) => !addedOptions.some((entry) => entry.option === opt.value)
        ).map((opt) => ({
            type: assetdetail.type,
            option: opt.value
        }));

        if (selectedOptions.length === 0) {
            setPopupContentMalert("Please Select Options!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else {
            setAddedOptions([...addedOptions, ...newEntries]);
        }
    };

    const handleDeleteOption = (option) => {
        setAddedOptions(addedOptions.filter((entry) => entry.option !== option));
    };





    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOptionsCompany?.length === 0 &&
            selectedOptionsBranch?.length === 0 &&
            selectedOptionsUnit?.length === 0 &&
            selectedOptionsAssetMaterial?.length === 0) {
            setPopupContentMalert("Please Select Any One");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            fetchAssetDetails("Filtered");
        }
    };

    const handleClear = () => {
        setAssetdetails([]);
        setItems([]);
        setPage(1)
        setTotalProjects(0);
        setTotalPages(0);
        setPageSize(10)
        setOverallFilterdata([]);
        setSelectedOptionsCompany([])
        setSelectedOptionsBranch([])
        setSelectedOptionsUnit([])
        setSelectedOptionsAssetMaterial([])
        setValueCompanyCat([])
        setValueBranchCat([])
        setValueUnitCat([])
        setValueAssetMaterial([])
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    }
    let exportColumnNames = [
        "Company",
        "Branch",
        "Unit",
        "Floor",
        "Area",
        "Location",
        "Asset Material",
        "Vendor",
        "Address",
        "Phone Number",
        "Type",
        "Options",
        "Purchase Date",
        "Status"
    ];
    let exportRowValues = [
        "company",
        "branch",
        "unit",
        "floor",
        "area",
        "location",
        "assetmaterialcode",
        "vendor",
        "address",
        "phonenumber",
        "type",
        "options",
        "purchasedate",
        "status"

    ];

    const [areas, setAreas] = useState([]);
    const [locations, setLocations] = useState([
        { label: "ALL", value: "ALL" },
    ]);

    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [deletecheck, setdeletecheck] = useState(false);

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = async () => {
        setIsDeleteOpen(false);
        setdeletecheck(!deletecheck);
    };

    const EbUsage = [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
    ];
    const [floorsEdit, setFloorEdit] = useState([]);
    const [workStationOpt, setWorkStationOpt] = useState([]);
    const [filteredWorkStation, setFilteredWorkStation] = useState([]);
    const [Specificationedit, setSpecificationedit] = useState([]);
    let name = "create";
    let nameedit = "edit";
    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setPage(1)
    };

    const handleChangephonenumber = (e) => {
        const regex = /^\d*\.?\d*$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setAssetdetail({ ...assetdetail, estimation: inputValue });
        }
    };



    // const accessbranch = isAssignBranch
    //   ?.map((data) => ({
    //     branch: data.branch,
    //     company: data.company,
    //     unit: data.unit,
    //   }))


    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

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

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));



    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [vendorOptEdit, setVendoroptEdit] = useState([]);
    const [assetdetails, setAssetdetails] = useState([]);
    const [assetdetailCheck, setAssetdetailcheck] = useState(false);
    const [isimgviewbill, setImgviewbill] = useState(false);
    const handleImgcodeviewbill = () => {
        setImgviewbill(true);
    };
    const handlecloseImgcodeviewbill = () => {
        setImgviewbill(false);
    };
    //TODOS
    const [todosEdit, setTodosEdit] = useState([]);
    const classes = useStyles();
    //filter fields

    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const gridRef = useRef(null);

    const [vendorGroup, setVendorGroup] = useState("Please Select Vendor Group");
    const [vendorGroupOpt, setVendorGroupopt] = useState([]);
    const [vendorOverall, setVendorOverall] = useState([]);
    const [vendorOpt, setVendoropt] = useState([]);
    const [vendor, setVendor] = useState("Please Select Vendor");

    const fetchVendor = async () => {
        try {
            let res1 = await axios.get(SERVICE.ALL_VENDORGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const allGroup = Array.from(
                new Set(res1?.data?.vendorgrouping.map((d) => d.name))
            ).map((item) => {
                return {
                    label: item,
                    value: item,
                };
            });

            setVendorGroupopt(allGroup);
            setVendorOverall(res1?.data?.vendorgrouping);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleChangeGroupName = async (e) => {
        let foundDatas = vendorOverall
            .filter((data) => {
                return data.name == e.value;
            })
            .map((item) => item.vendor);

        let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const all = [
            ...res?.data?.vendordetails.map((d) => ({
                ...d,
                label: d.vendorname,
                value: d.vendorname,
            })),
        ];

        let final = all.filter((data) => {
            return foundDatas.includes(data.value);
        });

        setVendoropt(final);
    };

    const [vendorOptInd, setVendoroptInd] = useState([]);

    const handleChangeGroupNameIndexBased = async (e, index) => {
        let foundDatas = vendorOverall
            .filter((data) => {
                return data.name == e.value;
            })
            .map((item) => item.vendor);

        let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        const all = [
            ...res?.data?.vendordetails.map((d) => ({
                ...d,
                label: d.vendorname,
                value: d.vendorname,
            })),
        ];

        let final = all.filter((data) => {
            return foundDatas.includes(data.value);
        });

        setVendoroptInd((prev) => {
            const updated = [...prev];
            updated[index] = final;
            return updated;
        });
    };

    // putcall setstate
    const [assetdetail, setAssetdetail] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        workstation: "Please Select Workstation",
        department: "Please Select Department",
        responsibleteam: "Please Select Responsible Person",
        team: "Please Select Responsible Team",
        assettype: "Please Select Asset Type",
        asset: "Please Select Asset Head",
        material: "Please Select Material",
        component: "Please Select Component",
        code: "",
        countquantity: "",
        materialcountcode: "",
        workcheck: "",
        serial: "",
        rate: "",
        warranty: "",
        warrantycalculation: "",
        estimation: "",
        estimationtime: "",
        purchasedate: "",
        address: "",
        phonenumber: "",
        vendor: "Please Select Vendor",
        customercare: "",
        stockcode: "",
        ebusage: "Please Select EB Usage",
    });

    const [specificationGroupingEdit, setSpecificationGroupingEdit] = useState(
        []
    );

    const fetchSpecificationGroupingEdit = async () => {
        try {
            let res = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONGROUPING, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getvalues = res?.data?.assetspecificationgrouping.filter(
                (item) =>
                    item.assetmaterial === assetdetail.material &&
                    assetdetail.component === item.component
            );

            setSpecificationGroupingEdit(getvalues);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    console.log(page, pageSize, "number")




    const fetchAssetDetails = async (e) => {

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            material: valueAssetMaterial,
            assignbranch: accessbranch,
        };

        const allFilters = [
            ...additionalFilters,
            { column: selectedColumn, condition: selectedCondition, value: filterValue }
        ];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;
        }
        setAssetdetailcheck(true);

        try {
            if (e === "Filtered") {
                let res_employee = await axios.post(SERVICE.ASSET_SOFTWARE_DATA_FILTER, queryParams, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
                const itemsWithSerialNumber = ans?.map((item, index) => {

                    return {
                        ...item,
                        serialNumber: (page - 1) * pageSize + index + 1,
                        purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),


                    }
                });
                console.log(res_employee?.data, ans, 'res_employee?.data')

                setAssetdetails(itemsWithSerialNumber);
                setItems(itemsWithSerialNumber);
                setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
                    res_employee?.data?.totalProjectsData?.map((item, index) => {
                        return {
                            ...item,
                            serialNumber: (page - 1) * pageSize + index + 1,
                            purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),

                        }
                    }

                    ) : []
                );
                setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
                setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
                setPageSize((data) => { return ans?.length > 0 ? data : 10 });
                setPage((data) => { return ans?.length > 0 ? data : 1 });
                setAssetdetailcheck(false)
            } else {
                setAssetdetailcheck(false)
            }
        }
        catch (err) {
            setAssetdetailcheck(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    useEffect(() => {
        fetchWorkStation();

        fetchVendor();
    }, []);

    useEffect(() => {
        if (items?.length > 0) {
            fetchAssetDetails("Filtered");
        }
    }, [page, pageSize, searchQuery]);

    useEffect(() => {
        fetchSpecificationGroupingEdit();
    }, [isEditOpen, assetdetail.component]);


    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Dynamic Asset Master List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //Delete model
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

    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };

    const calculateTotalRateEdit = () => {
        let sum = 0;
        todosEdit.forEach((item) => {
            sum += parseInt(item.rate);
        });
        return String(sum);
    };


    const [getimgbillcode, setGetImgbillcode] = useState([]);
    const getimgbillCode = async (valueimg) => {
        setGetImgbillcode(valueimg);
        handleImgcodeviewbill();
    };
    const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);
    //get single row to edit....
    const getCode = async (e, code, data) => {
        setPageName(!pageName)

        handleClickOpenEdit();
        try {
            let res = await axios.get(`${SERVICE.ASSET_SINGLE_SOFTWARE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setAssetdetail(res?.data?.sassetsoftwaredetails);
            fetchMaterialCode([res?.data?.sassetsoftwaredetails.location])
            // fetchSpecificationGrouping(res?.data?.sassetsoftwaredetails.assetsoftwarematerial)

            setSelectedCompanyFromCreate([{ label: res?.data?.sassetsoftwaredetails.company, value: res?.data?.sassetsoftwaredetails.company }])
            setSelectedBranchFromCreate([{ label: res?.data?.sassetsoftwaredetails.branch, value: res?.data?.sassetsoftwaredetails.branch }])
            setSelectedUnitFromCreate([{ label: res?.data?.sassetsoftwaredetails.unit, value: res?.data?.sassetsoftwaredetails.unit }])
            setSelectedFloorFromCreate([{ label: res?.data?.sassetsoftwaredetails.floor, value: res?.data?.sassetsoftwaredetails.floor }])
            setSelectedAreaFromCreate([{ label: res?.data?.sassetsoftwaredetails.area, value: res?.data?.sassetsoftwaredetails.area }])
            setSelectedLocationFromCreate([{ label: res?.data?.sassetsoftwaredetails.location, value: res?.data?.sassetsoftwaredetails.location }])
            setSelectedOptions(res?.data?.sassetsoftwaredetails.options.map((item) => ({
                ...item,
                label: item,
                value: item,
            })))
            setVendor(res?.data?.sassetsoftwaredetails?.materialvendor);
            setVendoropt(res?.data?.sassetsoftwaredetails?.materialvendor)
            setSelectedPurchaseDate(res?.data?.sassetsoftwaredetails?.purchasedate)
            setVendorGroup(res?.data?.sassetsoftwaredetails?.materialvendorgroup);
            ;
            await handleChangeGroupName({
                value: res?.data?.sassetsoftwaredetails?.materialvendorgroup,
            });
            setAddedOptions(res?.data?.sassetsoftwaredetails?.subcomponent);

            fetchApplicationName(res?.data?.sassetsoftwaredetails?.type);

            fetchFloor([res?.data?.sassetsoftwaredetails?.branch]);
            fetchArea(
                [res?.data?.sassetsoftwaredetails?.branch],
                [res?.data?.sassetsoftwaredetails?.floor]
            );
            fetchLocation(
                [res?.data?.sassetsoftwaredetails?.branch],
                [res?.data?.sassetsoftwaredetails?.floor],
                [res?.data?.sassetsoftwaredetails?.area]
            );
            if (res?.data?.sassetsoftwaredetails.vendorid) {
                let resv = await axios.get(
                    `${SERVICE.SINGLE_VENDORDETAILS}/${res?.data?.sassetsoftwaredetails.vendorid}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }
                );
                setVendorgetid(resv?.data?.svendordetails);
            }

        } catch (err) {
            console.log(err, "error")
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // get single row to view....
    const getviewCode = async (e) => {
        setPageName(!pageName)

        try {
            let res = await axios.get(`${SERVICE.ASSET_SINGLE_SOFTWARE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAssetdetail(res?.data?.sassetsoftwaredetails);
            setSelectedOptions(res?.data?.sassetsoftwaredetails.options)
            setVendorGroup(res?.data?.sassetsoftwaredetails?.materialvendorgroup);
            setVendor(res?.data?.sassetsoftwaredetails?.materialvendor);

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.ASSET_SINGLE_SOFTWARE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAssetdetail(res?.data?.sassetsoftwaredetails);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
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
        assetmaterialcode: true,
        vendor: true,
        address: true,
        phonenumber: true,
        type: true,
        options: true,
        purchasedate: true,
        status: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );
    //get all Sub vendormasters.

    const [deleteAssetdetail, setDeleteAssetdetail] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)

        try {
            let res = await axios.get(`${SERVICE.ASSET_SINGLE_SOFTWARE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeleteAssetdetail(res?.data?.sassetsoftwaredetails);
            setdeletecheck(!deletecheck);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup



    let Assetdetailsid = deleteAssetdetail?._id;
    const delAssetdetail = async () => {
        setPageName(!pageName)

        try {
            if (Assetdetailsid) {
                await axios.delete(`${SERVICE.ASSET_SINGLE_SOFTWARE}/${Assetdetailsid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                setdeletecheck(!deletecheck);

                handleCloseMod();
                setSelectedRows([]);
                setPage(1);
            }
            await fetchAssetDetails("Filtered");
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const delAssetcheckbox = async () => {
        setPageName(!pageName)

        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.ASSET_SINGLE_SOFTWARE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            await fetchAssetDetails("Filtered");
            // await fetchAssetSort();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };





    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Assetdetail",
        pageStyle: "print",
    });

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);



    const addSerialNumber = (datas) => {
        // const itemsWithSerialNumber = datas?.map((item, index) => (
        //   {
        //     ...item,
        //     serialNumber: index + 1,
        //     purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),
        //     workstation: item.workstation === "Please Select Workstation" ? "" : item.workstation,

        //   }));

        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(assetdetails);
    }, [assetdetails]);

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
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [

        {
            field: "checkbox",
            headerName: "", // Default header name
            headerStyle: {
                fontWeight: "bold",
            },
            sortable: false,
            width: 90,
            filter: false,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 90,
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
            width: 100,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
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
        {
            field: "assetmaterialcode",
            headerName: "Asset Material",
            flex: 0,
            width: 100,
            hide: !columnVisibility.assetmaterialcode,
            headerClassName: "bold-header",
        },
        {
            field: "address",
            headerName: "Address",
            flex: 0,
            width: 150,
            hide: !columnVisibility.address,
            headerClassName: "bold-header",
        },
        {
            field: "phonenumber",
            headerName: "Phone Number",
            flex: 0,
            width: 150,
            hide: !columnVisibility.phonenumber,
            headerClassName: "bold-header",
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "options",
            headerName: "Options",
            flex: 0,
            width: 150,
            hide: !columnVisibility.options,
            headerClassName: "bold-header",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.status,
            headerClassName: "bold-header",
        },
        {
            field: "purchasedate",
            headerName: "Purchasedate",
            flex: 0,
            width: 150,
            hide: !columnVisibility.purchasedate,
            headerClassName: "bold-header",
        },


        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 290,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("edynamicassetmasterlist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getCode(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ddynamicassetmasterlist") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vdynamicassetmasterlist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpenview();
                                getviewCode(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("idynamicassetmasterlist") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                handleClickOpeninfo();
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

    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");


    const rowDataTable = items?.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            area: item.area,
            location: item.location,
            purchasedate: item.purchasedate,
            assetmaterialcode: item.assetmaterialcode,
            vendor: item.vendor,
            address: item.address,
            phonenumber: item.phonenumber,
            type: item.type,
            options: item.options,
            status: item.status,
        };
    });

    const rowsWithCheckboxes = rowDataTable?.map((row) => ({
        ...row,
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

    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
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

    const fetchWorkStation = async () => {
        try {
            let res = await axios.get(SERVICE.WORKSTATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setWorkStationOpt(res?.data?.locationgroupings);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        var filteredWorksedit;
        if (
            (assetdetail.unit === "" || assetdetail.unit == undefined) &&
            (assetdetail.floor === "" || assetdetail.floor == undefined)
        ) {
            filteredWorksedit = workStationOpt?.filter(
                (u) =>
                    u.company === assetdetail.company &&
                    u.branch === assetdetail.branch
            );
        } else if (
            assetdetail.unit === "" ||
            assetdetail.unit == undefined
        ) {
            filteredWorksedit = workStationOpt?.filter(
                (u) =>
                    u.company === assetdetail.company &&
                    u.branch === assetdetail.branch &&
                    u.floor === assetdetail.floor
            );
        } else if (
            assetdetail.floor === "" ||
            assetdetail.floor == undefined
        ) {
            filteredWorksedit = workStationOpt?.filter(
                (u) =>
                    u.company === assetdetail.company &&
                    u.branch === assetdetail.branch &&
                    u.unit === assetdetail.unit
            );
        } else {
            filteredWorksedit = workStationOpt?.filter(
                (u) =>
                    u.company === assetdetail.company &&
                    u.branch === assetdetail.branch &&
                    u.unit === assetdetail.unit &&
                    u.floor === assetdetail.floor
            );
        }
        const result = filteredWorksedit?.flatMap((item) => {
            return item.combinstation.flatMap((combinstationItem) => {
                return combinstationItem.subTodos.length > 0
                    ? combinstationItem.subTodos.map(
                        (subTodo) =>
                            subTodo.subcabinname +
                            "(" +
                            item.branch +
                            "-" +
                            item.floor +
                            ")"
                    )
                    : [
                        combinstationItem.cabinname +
                        "(" +
                        item.branch +
                        "-" +
                        item.floor +
                        ")",
                    ];
            });
        });
        setFilteredWorkStation(
            result.flat()?.map((d) => ({
                ...d,
                label: d,
                value: d,
            }))
        );
    }, [assetdetail, isEditOpen]);


    const fetchFloor = async (selectedBranches) => {
        let resultedit = allfloor.filter((d) => d.branch === selectedBranches.value || d.branch === selectedBranches.branch);
        const flooralledit = resultedit.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));

        let result = allfloor.filter((d) => selectedBranches.some((branch) => d.branch.includes(branch)));

        const floorall = result.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
        }));
        setFloors(floorall);
    };

    const fetchArea = async (branch, selectedfloor) => {
        let result = allareagrouping
            .filter(
                (comp) => branch.includes(comp.branch) && selectedfloor.some((floor) => comp.floor.includes(floor))
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
    const fetchLocation = async (branch, floor, selectedlocation) => {
        let result = alllocationgrouping
            .filter(
                (comp) => branch.includes(comp.branch) &&
                    floor.includes(comp.floor) &&
                    selectedlocation.some((area) => comp.area.includes(area))
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




    const fetchspecificationEdit = async () => {
        try {
            let res = await axios.get(SERVICE.ASSETWORKSTAION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res.data.assetworkstation?.filter(
                (d) => d.workstation === assetdetail.material
            );

            const resultall = result?.map((d) => ({
                ...d,
                label: d.categoryname,
                value: d.categoryname,
            }));

            setSpecificationedit(resultall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    useEffect(() => {
        fetchspecificationEdit();
    }, [isEditOpen]);

    let updateby = assetdetail?.updatedby;
    let addedby = assetdetail?.addedby;
    let subprojectsid = assetdetail?._id;


    //editing the single data...
    const sendEditRequest = async () => {
        try {
            let res = await axios.put(
                `${SERVICE.ASSET_SINGLE_SOFTWARE}/${subprojectsid}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    ranch: String(assetdetail.branch),
                    unit: String(assetdetail.unit),
                    floor: String(assetdetail.floor),
                    location: String(assetdetail.location),
                    area: String(assetdetail.area),
                    assetmaterialcode: String(assetdetail.assetmaterialcode),
                    assetsoftwarematerial: String(assetdetail.assetsoftwarematerial),
                    vendor: String(assetdetail?.vendor),
                    address: String(assetdetail.address),
                    phonenumber: String(assetdetail.phonenumber),
                    type: String(assetdetail.type),
                    options: selectedOptions.map(item => item.value),
                    status: String(assetdetail.status),
                    subcomponent: addedOptions ? [...addedOptions] : [],
                    estimation: String(assetdetail.estimation),
                    estimationtime: String(assetdetail.estimationtime)
                        ? assetdetail.estimationtime
                        : "Days",

                    purchasedate: selectedPurchaseDate,
                    warrantycalculation: String(assetdetail.warrantycalculation),
                    materialvendor: String(vendor),
                    materialvendorgroup: String(vendorGroup),

                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }
            );
            await fetchAssetDetails("Filtered");
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const editSubmit = async (e) => {
        e.preventDefault();
        setPageName(!pageName)

        let res = await axios.get(SERVICE.ALL_ASSET_SOFTWARE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let getArray = res.data.assetsoftwaredetails.filter((item) => item._id !== assetdetail._id);
        let compopt = selectedCompanyFromCreate.map((item) => item.value);
        let branchopt = selectedBranchFromCreate.map((item) => item.value);
        let unitopt = selectedUnitFromCreate.map((item) => item.value);
        let flooropt = selectedFloorFromCreate.map((item) => item.value);
        let areaopt = selectedAreaFromCreate.map((item) => item.value);
        let locationopt = selectedLocationFromCreate.map((item) => item.value);


        const isNameMatch = getArray.some(
            (item) =>
                // item.company.some((data) => compopt.includes(data)) &&
                // item.branch.some((data) => branchopt.includes(data)) &&
                // item.unit.some((data) => unitopt.includes(data)) &&
                // item.floor.some((data) => flooropt.includes(data)) &&
                // item.area.some((data) => areaopt.includes(data)) &&
                // item.location.some((data) => locationopt.includes(data)) &&



                item.assetmaterialcode === assetdetail.assetmaterialcode || item.assetmaterialcode.includes(assetdetail.assetmaterialcode)


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
        }
        else if (assetdetail.assetmaterialcode === "Please Select AssetMaterial") {
            setPopupContentMalert("Please Select AssetMaterial!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (assetdetail.type === "Please Select Type") {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOptions.length === 0) {
            setPopupContentMalert("Please Select Options!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (addedOptions.length === 0) {
            setPopupContentMalert("Please Insert Todo!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();


        }
        else if (assetdetail.status === "Please Select Status") {
            setPopupContentMalert("Please Select Status!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if ((assetdetail.status === "Paid" || assetdetail.status === "Paid-w/o Warranty") && (vendorGroup === "" ||
            vendorGroup === "Please Select Vendor Group")
        ) {
            setPopupContentMalert("Please Select Vendor Group!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if ((assetdetail.status === "Paid" || assetdetail.status === "Paid-w/o Warranty") && (vendor === "" || vendor === "Please Select Vendor ")) {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetdetail.status === "Paid" && (vendor === "" || vendor === "Please Select Vendor ")) {
            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (assetdetail.status === "Paid" && assetdetail.estimation === "") {
            setPopupContentMalert("Please Enter Warranty Time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (assetdetail.status === "Paid" && selectedPurchaseDate === "") {
            setPopupContentMalert("Please Select PurchaseDate!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else {
            sendEditRequest();
        }
    };

    const [vendorgetid, setVendorgetid] = useState({});
    const [vendornameid, setVendornameid] = useState("");

    const vendorid = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setVendorgetid(res?.data?.svendordetails);
            setVendornameid(id);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    const [refImage, setRefImage] = useState([]);
    const [previewURL, setPreviewURL] = useState(null);
    const [refImageDrag, setRefImageDrag] = useState([]);
    const [valNum, setValNum] = useState(0);
    //webcam
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [getImg, setGetImg] = useState(null);
    const [isWebcamCapture, setIsWebcamCapture] = useState(false);
    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
        setGetImg("");
    };
    const webcamDataStore = () => {
        setIsWebcamCapture(true);
        webcamClose();
        setGetImg("");
    };
    const showWebcam = () => {
        webcamOpen();
    };
    // Upload Popup
    const [uploadPopupOpen, setUploadPopupOpen] = useState(false);

    const handleUploadPopupClose = () => {
        setUploadPopupOpen(false);
        setGetImg("");
        setRefImage([]);
        setPreviewURL(null);
        setRefImageDrag([]);
        setCapturedImages([]);
    };
    const getFileIcon = (fileName) => {
        const extension1 = fileName?.split(".").pop();
        switch (extension1) {
            case "pdf":
                return pdfIcon;
            case "doc":
            case "docx":
                return wordIcon;
            case "xls":
            case "xlsx":
                return excelIcon;
            case "csv":
                return csvIcon;
            default:
                return fileIcon;
        }
    };

    //reference images
    const handleInputChange = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImage];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImage(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleDeleteFile = (index) => {
        const newSelectedFiles = [...refImageedit];
        newSelectedFiles.splice(index, 1);
        setRefImageedit(newSelectedFiles);
    };
    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const removeCapturedImage = (index) => {
        const newCapturedImages = [...capturedImagesedit];
        newCapturedImages.splice(index, 1);
        setCapturedImagesedit(newCapturedImages);
    };
    const resetImage = () => {
        setGetImg("");
        setRefImage([]);
        setPreviewURL(null);
        setRefImageDrag([]);
        setCapturedImages([]);
    };
    const handleDragOver = (event) => {
        event.preventDefault();
    };
    const handleDrop = (event) => {
        event.preventDefault();
        previewFile(event.dataTransfer.files[0]);
        const files = event.dataTransfer.files;
        let newSelectedFilesDrag = [...refImageDrag];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFilesDrag.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImageDrag(newSelectedFilesDrag);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleUploadOverAll = () => {
        setUploadPopupOpen(false);
    };
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURL(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveFile = (index) => {
        const newSelectedFiles = [...refImageDragedit];
        newSelectedFiles.splice(index, 1);
        setRefImageDragedit(newSelectedFiles);
    };


    const [refImageedit, setRefImageedit] = useState([]);
    const [previewURLedit, setPreviewURLedit] = useState(null);
    const [refImageDragedit, setRefImageDragedit] = useState([]);
    const [valNumedit, setValNumedit] = useState(0);
    const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
    const [capturedImagesedit, setCapturedImagesedit] = useState([]);
    const [getImgedit, setGetImgedit] = useState(null);


    const handleRemarkChangeUpload = (value, index) => {
        setRefImageedit((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };
    const handleRemarkChangeWebCam = (value, index) => {
        setCapturedImagesedit((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };

    const handleRemarkChangeDragDrop = (value, index) => {
        setRefImageDrag((prev) =>
            prev.map((file, i) =>
                i === index ? { ...file, remarks: value } : file
            )
        );
    };
    const webcamOpenedit = () => {
        setIsWebcamOpenedit(true);
    };
    const webcamCloseedit = () => {
        setIsWebcamOpenedit(false);
        setGetImgedit("");
    };
    const webcamDataStoreedit = () => {
        webcamCloseedit();
        setGetImgedit("");
    };
    const showWebcamedit = () => {
        webcamOpenedit();
    };
    const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
    const handleClickUploadPopupOpenedit = () => {
        setUploadPopupOpenedit(true);
    };
    const handleUploadPopupCloseedit = () => {
        setUploadPopupOpenedit(false);
        setGetImgedit("");
        setRefImageedit([]);
        setPreviewURLedit(null);
        setRefImageDragedit([]);
        setCapturedImagesedit([]);
    };
    const handleInputChangeedit = (event) => {
        const files = event.target.files;
        let newSelectedFiles = [...refImageedit];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Check if the file is an image
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFiles.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImageedit(newSelectedFiles);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    let combinedArray = allUploadedFilesedit.concat(
        refImageedit,
        refImageDragedit,
        capturedImagesedit
    );
    let uniqueValues = {};
    let resultArray = combinedArray.filter((item) => {
        if (!uniqueValues[item.name]) {
            uniqueValues[item.name] = true;
            return true;
        }
        return false;
    });

    //first deletefile
    const handleDeleteFileedit = (index) => {
        const newSelectedFiles = [...refImageedit];
        newSelectedFiles.splice(index, 1);
        setRefImageedit(newSelectedFiles);
    };

    const renderFilePreviewedit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const resetImageedit = () => {
        setGetImgedit("");
        setRefImageedit([]);
        setPreviewURLedit(null);
        setRefImageDragedit([]);
        setCapturedImagesedit([]);
    };
    const handleDragOveredit = (event) => { };
    const handleDropedit = (event) => {
        event.preventDefault();
        previewFileedit(event.dataTransfer.files[0]);
        const files = event.dataTransfer.files;
        let newSelectedFilesDrag = [...refImageDragedit];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    newSelectedFilesDrag.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: reader.result,
                        base64: reader.result.split(",")[1],
                    });
                    setRefImageDragedit(newSelectedFilesDrag);
                };
                reader.readAsDataURL(file);
            } else {
                setPopupContentMalert("Only Accept Images!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    const handleUploadOverAlledit = () => {
        setUploadPopupOpenedit(false);
    };
    const previewFileedit = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewURLedit(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveFileedit = (index) => {
        const newSelectedFiles = [...refImageDragedit];
        newSelectedFiles.splice(index, 1);
        setRefImageDragedit(newSelectedFiles);
    };
    const [selectedPurchaseDate, setSelectedPurchaseDate] = useState("");

    const handleEstimationChange = (e) => {
        const { value } = e.target;
        setAssetdetail({ ...assetdetail, estimationtime: value });
    };
    const handlePurchaseDateChange = (e) => {
        const { value } = e.target;
        setAssetdetail({ ...assetdetail, purchasedate: value });
        setSelectedPurchaseDate(value);
    };
    const formatDateString = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        calculateExpiryDate();
    }, [
        assetdetail.estimationtime,
        assetdetail.estimation,
        assetdetail.purchasedate,
    ]);
    const calculateExpiryDate = () => {
        if (assetdetail.estimationtime && assetdetail.purchasedate) {
            const currentDate = new Date(assetdetail.purchasedate);
            let expiryDate = new Date(currentDate);
            if (assetdetail.estimationtime === "Days") {
                expiryDate.setDate(
                    currentDate.getDate() + parseInt(assetdetail.estimation)
                );
            } else if (assetdetail.estimationtime === "Month") {
                expiryDate.setMonth(
                    currentDate.getMonth() + parseInt(assetdetail.estimation)
                );
            } else if (assetdetail.estimationtime === "Year") {
                expiryDate.setFullYear(
                    currentDate.getFullYear() + parseInt(assetdetail.estimation)
                );
            }
            const formattedExpiryDate = formatDateString(expiryDate);
            let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
                ? ""
                : formattedExpiryDate;
            setAssetdetail({
                ...assetdetail,
                warrantycalculation: formattedempty, // Format date as needed
            });
        }
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

    // const fetchAssetSort = async () => {
    //   try {
    //     let res_employee = await axios.post(SERVICE.OVERALLSORT_ASSET, {
    //       headers: {
    //         Authorization: `Bearer ${auth.APIToken}`,
    //       },
    //       page: Number(page),
    //       pageSize: Number(pageSize),
    //       searchQuery: searchQuery,
    //       assignbranch: accessbranch,
    //     });

    //     const ans =
    //       res_employee?.data?.result?.length > 0
    //         ? res_employee?.data?.result
    //         : [];

    //     const itemsWithSerialNumber = ans?.map((item, index) => ({
    //       ...item,
    //       serialNumber: (page - 1) * pageSize + index + 1,
    //       purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),
    //       workstation: item.workstation === "Please Select Workstation" ? "" : item.workstation,

    //     }));
    //     //   setcheckemployeelist(true);
    //     setAssetdetails(itemsWithSerialNumber);
    //     setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
    //     setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
    //     setPageSize((data) => {
    //       return ans?.length > 0 ? data : 10;
    //     });
    //     setPage((data) => {
    //       return ans?.length > 0 ? data : 1;
    //     });

    //     setAssetdetailcheck(true);
    //   } catch (err) {
    //     setAssetdetailcheck(true);
    //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //   }
    // };

    // useEffect(() => {
    //   fetchAssetSort();
    // }, [page, pageSize, searchQuery]);


    const pathname = window.location.pathname;

    //Access Module

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Dynamic Asset Master List"),
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


    // Search bar
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };

    // Disable the search input if the search is active
    const isSearchDisabled = isSearchActive || additionalFilters.length > 0;

    const handleResetSearch = async () => {
        setAssetdetailcheck(true);

        // Reset all filters and pagination state
        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);

        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            assignbranch: accessbranch,
            company: valueCompanyCat,
            branch: valueBranchCat,
            unit: valueUnitCat,
            material: valueAssetMaterial,
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }

        setPageName(!pageName)

        try {
            let res_employee = await axios.post(SERVICE.ASSET_SOFTWARE_DATA_FILTER, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.map((item, index) => {

                return {
                    ...item,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),

                }
            });


            setAssetdetails(itemsWithSerialNumber);
            setItems(itemsWithSerialNumber);
            setOverallFilterdata(res_employee?.data?.totalProjectsData?.length > 0 ?
                res_employee?.data?.totalProjectsData?.map((item, index) => {
                    return {
                        ...item,
                        purchasedate: (item.purchasedate === "Invalid date" || item.purchasedate === "" || item.purchasedate === undefined) ? "" : moment(item.purchasedate).format("DD/MM/YYYY"),

                    }
                }

                ) : []
            );
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setAssetdetailcheck(false)
        } catch (err) { setAssetdetailcheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };




    const getLinkedLabelItem = (overalldeletecheck) => {
        const {

            assetmaterialip = [],

            assetworkstationgrouping = [],
            maintenancemaster = [],
            assetempdistribution = [],
            maintenancenonschedulegrouping = [],

        } = overalldeletecheck;

        const labels = [
            ...assetmaterialip, ...assetworkstationgrouping,
            ...maintenancemaster, ...assetempdistribution,
            ...maintenancenonschedulegrouping].filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit &&
                            t.floor === value.floor &&
                            t.area === value.area &&
                            t.location === value.location &&
                            t.assetmaterial === value.assetmaterial
                    )
            )

        return labels;
    };

    const getLinkedLabel = (overalldeletecheck) => {
        const { assetmaterialip = [],
            assetworkstationgrouping = [],
            maintenancemaster = [],
            assetempdistribution = [],
            maintenancenonschedulegrouping = [], } = overalldeletecheck;
        const labels = [];



        if (assetmaterialip.length > 0) labels.push("Asset Material IP");
        if (assetworkstationgrouping.length > 0) labels.push("Asset Workstation Grouping");
        if (maintenancemaster.length > 0) labels.push("Maintenance Master");
        if (assetempdistribution.length > 0) labels.push("Asset Employee Distribution");
        if (maintenancenonschedulegrouping.length > 0) labels.push("Maintenance Non Schedule Grouping");

        return labels.join(", ");
    };

    const getFilteredUnits = (assetdetails, selectedRows, overalldeletecheck) => {
        const {
            assetmaterialip = [],
            assetworkstationgrouping = [],
            maintenancemaster = [],
            assetempdistribution = [],
            maintenancenonschedulegrouping = []
        } = overalldeletecheck;
        const allConditions = [
            ...assetmaterialip, ...assetworkstationgrouping,
            ...maintenancemaster, ...assetempdistribution,
            ...maintenancenonschedulegrouping].filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.company === value.company &&
                            t.branch === value.branch &&
                            t.unit === value.unit &&
                            t.floor === value.floor &&
                            t.area === value.area &&
                            t.location === value.location &&
                            t.assetmaterial === value.assetmaterial
                    )
            )

        return assetdetails.filter(d => selectedRows?.includes(d._id) && !allConditions.some(condition =>
            condition.company === d.company && condition.branch === d.branch
            && condition.unit === d.unit
            && condition.floor === d.floor && condition.area === d.area
            && condition.location === d.location && condition.assetmaterial === `${d.material}-${d.code}`
        ))

    };

    const shouldShowDeleteMessage = (assetdetails, selectedRows, overalldeletecheck) => {
        return getFilteredUnits(assetdetails, selectedRows, overalldeletecheck).length > 0;
    };

    const shouldEnableOkButton = (assetdetails, selectedRows, overalldeletecheck) => {
        return getFilteredUnits(assetdetails, selectedRows, overalldeletecheck).length === 0;
    };


    console.log(materialOptcode, "materialOptcode")

    return (
        <Box>
            <Headtitle title={"Asset S"} />
            {/* <Typography sx={userStyle.HeaderText}> Manage Asset </Typography> */}
            <PageHeading
                title="Manage Asset  Software"
                modulename="Asset"
                submodulename="Asset Details"
                mainpagename="Dynamic Asset Master List"
                subpagename=""
                subsubpagename=""
            />
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                        marginTop: "90px",
                    }}
                >
                    <Box sx={{ overflow: "auto", padding: "20px" }}>
                        <>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>
                                            Edit Dynamic Asset Master
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

                                            <MultiSelect options={floors} styles={colourStyles} value={selectedFloorFromCreate} onChange={handleFloorChangeFromCreate} valueRenderer={customValueRendererFloorFromCreate} labelledBy="Please Select Floor" />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Area<b style={{ color: "red" }}>*</b>
                                            </Typography>


                                            <MultiSelect options={areas} styles={colourStyles} value={selectedAreaFromCreate} onChange={handleAreaChangeFromCreate} valueRenderer={customValueRendererAreaFromCreate} labelledBy="Please Select Area" />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Location<b style={{ color: "red" }}>*</b>
                                            </Typography>

                                            <MultiSelect options={locations} styles={colourStyles} value={selectedLocationFromCreate} onChange={handleLocationChangeFromCreate} valueRenderer={customValueRendererLocationFromCreate} labelledBy="Please Select Location" />
                                        </FormControl>
                                    </Grid>





                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Asset Material<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects

                                                options={
                                                    selectedLocationFromCreate.map((item) => item.value).includes("ALL")
                                                        ? Array.from(
                                                            new Set(
                                                                materialOptcode
                                                                    .filter((t) =>
                                                                        t.operatingsoftware === true &&
                                                                        locations.map((item) => item.value).includes(t.location))
                                                                    .map((t) => ({
                                                                        ...t,
                                                                        label: t.component[0],
                                                                        value: t.component[0],
                                                                        company: t.company,
                                                                        branch: t.branch,
                                                                        unit: t.unit,
                                                                        floor: t.floor,
                                                                        area: t.area,
                                                                        location: t.location,
                                                                        // operatingsoftware:true
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
                                                                materialOptcode
                                                                    .filter(
                                                                        (t) =>
                                                                            t.operatingsoftware === true &&
                                                                            (selectedLocationFromCreate.map((item) => item.value).includes(t.location) || t.location === "ALL")
                                                                        // t.location.includes("ALL")) &&

                                                                    )
                                                                    .map((t) => ({
                                                                        ...t,
                                                                        label: t.component[0],
                                                                        value: t.component[0],
                                                                        company: t.company,
                                                                        branch: t.branch,
                                                                        unit: t.unit,
                                                                        floor: t.floor,
                                                                        area: t.area,
                                                                        location: t.location,
                                                                        // 
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


                                                styles={colourStyles}
                                                value={{
                                                    label: assetdetail.assetmaterialcode,
                                                    value: assetdetail.assetmaterialcode,
                                                }}
                                                onChange={(e) => {
                                                    // console.log(e.component[0].split(`${e.assetmaterial}-`)[1], "ddd")
                                                    const assetcode = e.component[0].split(`${e.assetmaterial}-`)[1]

                                                    fetchAssetDetailsGetVendor(assetcode, e)
                                                    fetchSpecificationGrouping(e.assetmaterial)
                                                    setAddedOptions([])
                                                    setSelectedOptions([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Vendor Name</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={assetdetail?.vendor}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Address</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={assetdetail?.address}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Phone Number</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                value={assetdetail.phonenumber}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Type<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={typeOpt}
                                                // options={specificationGrouping}
                                                value={{ label: assetdetail.type, value: assetdetail.type }}
                                                onChange={(e) => {
                                                    setAssetdetail({
                                                        ...assetdetail,
                                                        type: e.value,
                                                    });
                                                    fetchApplicationName()
                                                    setSelectedOptions([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Options<b style={{ color: "red" }}>*</b>
                                            </Typography>

                                            <MultiSelect
                                                //  options={applicationNameArray} 
                                                options={
                                                    Array.from(
                                                        new Set(
                                                            applicationNameArray
                                                                .filter(
                                                                    (subpro) =>
                                                                        assetdetail.type === subpro.type

                                                                )
                                                                .map((t) => ({
                                                                    ...t,
                                                                    label: t.name,
                                                                    value: t.name,
                                                                }))

                                                        )
                                                    )
                                                }
                                                styles={colourStyles}
                                                value={selectedOptions}
                                                onChange={handleChangeOptions}
                                                valueRenderer={customValueRendererOptions}
                                                labelledBy="Please Select Options" />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={0.5} sm={1} xs={1}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                height: "30px",
                                                minWidth: "20px",
                                                padding: "19px 13px",
                                                color: "white",
                                                marginTop: "20px",
                                                background: "rgb(25, 118, 210)",
                                            }}
                                            onClick={handleAddOptions}
                                        >
                                            <FaPlus style={{ fontSize: "15px" }} />
                                        </Button>
                                    </Grid>


                                    {addedOptions &&
                                        addedOptions.map((todo, index) => {
                                            return (
                                                <>
                                                    <Grid item md={12} sm={10} xs={10}>
                                                        <Grid container key={index} spacing={1}>

                                                            <Grid item md={4} sm={6} xs={12}>

                                                                <Typography>Type</Typography>
                                                                <OutlinedInput
                                                                    fullWidth
                                                                    type="text"
                                                                    size="small"
                                                                    value={todo.type}

                                                                />


                                                            </Grid>

                                                            <Grid item md={4} sm={6} xs={12}>

                                                                <Typography>Options</Typography>
                                                                <OutlinedInput
                                                                    fullWidth
                                                                    type="text"
                                                                    size="small"

                                                                    value={todo.option}

                                                                />


                                                            </Grid>

                                                            <Grid item md={4} sm={6} xs={12}>

                                                                <Button
                                                                    sx={{
                                                                        padding: "14px 14px",
                                                                        marginTop: "16px",
                                                                        minWidth: "40px !important",
                                                                        borderRadius: "50% !important",
                                                                        ":hover": {
                                                                            backgroundColor: "#80808036",
                                                                        },
                                                                    }}
                                                                    onClick={() => handleDeleteOption(todo.option)}
                                                                >
                                                                    <FaTrash
                                                                        style={{
                                                                            fontSize: "large",
                                                                            color: "#a73131",
                                                                        }}
                                                                    />
                                                                </Button>

                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                            );

                                        })}

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Status<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                options={statusOpt}
                                                value={{ label: assetdetail.status, value: assetdetail.status }}
                                                onChange={(e) => {
                                                    setAssetdetail({
                                                        ...assetdetail,
                                                        status: e.value,
                                                        estimation: "",
                                                        estimationtime: "",
                                                        warrantycalculation: ""
                                                    });
                                                    setVendorGroup("Please Select Vendor Group")
                                                    setVendor("Please Select Vendor")
                                                    setSelectedPurchaseDate("")
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    {assetdetail.status === "Paid" && (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Vendor Group Name<b style={{ color: "red" }}>*</b>{" "}
                                                    </Typography>
                                                    <Selects
                                                        options={vendorGroupOpt}
                                                        styles={colourStyles}
                                                        value={{ label: vendorGroup, value: vendorGroup }}
                                                        onChange={(e) => {
                                                            handleChangeGroupName(e);
                                                            setVendorGroup(e.value);
                                                            setVendor("Please Select Vendor ");
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Vendor<b style={{ color: "red" }}>*</b>{" "}
                                                    </Typography>
                                                    <Selects
                                                        options={vendorOpt}
                                                        styles={colourStyles}

                                                        value={{ label: vendor, value: vendor }}
                                                        onChange={(e) => {
                                                            setVendor(e.value);
                                                            vendorid(e._id);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <Grid container>
                                                    <Grid item md={6} xs={6} sm={6}>
                                                        <Typography>
                                                            Warranty Time <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <FormControl fullWidth size="small">
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                placeholder="Enter Time"
                                                                value={assetdetail.estimation}
                                                                onChange={(e) => handleChangephonenumber(e)}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={6} xs={6} sm={6}>
                                                        <Typography>
                                                            {" "}
                                                            Estimation <b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <Select
                                                            fullWidth
                                                            labelId="demo-select-small"
                                                            id="demo-select-small"
                                                            size="small"
                                                            value={assetdetail.estimationtime}
                                                            onChange={handleEstimationChange}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                {" "}
                                                                Please Select{" "}
                                                            </MenuItem>
                                                            <MenuItem value="Days"> {"Days"} </MenuItem>
                                                            <MenuItem value="Month"> {"Month"} </MenuItem>
                                                            <MenuItem value="Year"> {"Year"} </MenuItem>
                                                        </Select>
                                                    </Grid>
                                                </Grid>
                                            </Grid>


                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Purchase date<b style={{ color: "red" }}>*</b> </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="date"
                                                        value={selectedPurchaseDate}
                                                        onChange={handlePurchaseDateChange}
                                                    />
                                                </FormControl>
                                            </Grid>


                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>Expiry Date </Typography>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={assetdetail.warrantycalculation}
                                                    />
                                                </FormControl>
                                            </Grid>

                                        </>
                                    )}
                                    {assetdetail.status === "Paid-w/o Warranty" && (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Vendor Group Name<b style={{ color: "red" }}>*</b>{" "}
                                                    </Typography>
                                                    <Selects
                                                        options={vendorGroupOpt}
                                                        styles={colourStyles}
                                                        value={{ label: vendorGroup, value: vendorGroup }}
                                                        onChange={(e) => {
                                                            handleChangeGroupName(e);
                                                            setVendorGroup(e.value);
                                                            setVendor("Please Select Vendor ");
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        {" "}
                                                        Vendor<b style={{ color: "red" }}>*</b>{" "}
                                                    </Typography>
                                                    <Selects
                                                        options={vendorOpt}
                                                        styles={colourStyles}

                                                        value={{ label: vendor, value: vendor }}
                                                        onChange={(e) => {
                                                            setVendor(e.value);
                                                            vendorid(e._id);
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>{" "}
                                <br />

                                <br />
                                <Grid container spacing={1}>

                                    <Grid item md={1} xs={6} sm={6} marginTop={3}>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item md={1} xs={6} sm={6} marginTop={3}>
                                        <Button
                                            sx={buttonStyles.btncancel}
                                            onClick={handleCloseModEdit}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>

                            </form>
                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("ldynamicassetmasterlist") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Dynamic Asset Master Details List
                            </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>
                                        Company
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsCompany}
                                            onChange={(e) => {
                                                handleCompanyChange(e);
                                            }}
                                            valueRenderer={customValueRendererCompany}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                {/* Branch Unit Team */}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Branch
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.filter((comp) =>
                                                    valueCompanyCat?.includes(comp.company)
                                                )
                                                ?.map((data) => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsBranch}
                                            onChange={(e) => {
                                                handleBranchChange(e);
                                            }}
                                            valueRenderer={customValueRendererBranch}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            {" "}
                                            Unit
                                        </Typography>
                                        <MultiSelect
                                            options={accessbranch
                                                ?.filter(
                                                    (comp) =>
                                                        valueCompanyCat?.includes(comp.company) &&
                                                        valueBranchCat?.includes(comp.branch)
                                                )
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label &&
                                                                i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            value={selectedOptionsUnit}
                                            onChange={(e) => {
                                                handleUnitChange(e);
                                            }}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Unit"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Asset material
                                        </Typography>
                                        <MultiSelect
                                            options={materialOpt}
                                            value={selectedOptionsAssetMaterial}
                                            onChange={(e) => {
                                                handleAssetMaterialChange(e);
                                            }}
                                            valueRenderer={customValueRendererAssetMaterial}
                                            labelledBy="Please Select Asset Material"
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        </Grid>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <Grid sx={{ display: "flex", gap: "15px" }}>
                                    <Button
                                        variant="contained"
                                        sx={buttonStyles.buttonsubmit}
                                        onClick={(e) => {
                                            handleSubmit(e);
                                        }}
                                    >
                                        {" "}
                                        Filter
                                    </Button>
                                    <Button
                                        sx={buttonStyles.btncancel}
                                        onClick={() => {
                                            handleClear();
                                        }}
                                    >
                                        {" "}
                                        CLEAR
                                    </Button>
                                </Grid>
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
                                        <MenuItem value={totalProjects}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("exceldynamicassetmasterlist") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("xl");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileExcel />
                                                &ensp;Export to Excel&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvdynamicassetmasterlist") && (
                                        <>
                                            <Button
                                                onClick={(e) => {
                                                    setIsFilterOpen(true);
                                                    setFormat("csv");
                                                }}
                                                sx={userStyle.buttongrp}
                                            >
                                                <FaFileCsv />
                                                &ensp;Export to CSV&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printdynamicassetmasterlist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfdynamicassetmasterlist") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true);
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagedynamicassetmasterlist") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImage}
                                        >
                                            {" "}
                                            <ImageIcon
                                                sx={{ fontSize: "15px" }}
                                            /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput size="small"
                                        id="outlined-adornment-weight"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <FaSearch />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {advancedFilter && (
                                                    <IconButton onClick={handleResetSearch}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearch} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplay()}
                                        onChange={handleSearchChange}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilter}
                                    />
                                </FormControl>
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
                        {isUserRoleCompare?.includes("bddynamicassetmasterlist") && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleClickOpenalert}
                                sx={buttonStyles.buttonbulkdelete}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        {/* Manage Column */}


                        <Popover
                            id={id}
                            open={isManageColumnsOpen}
                            anchorEl={anchorEl}
                            onClose={handleCloseManageColumns}
                            anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
                        >
                            <ManageColumnsContent
                                handleClose={handleCloseManageColumns}
                                searchQuery={searchQueryManage}
                                setSearchQuery={setSearchQueryManage}
                                filteredColumns={filteredColumns}
                                columnVisibility={columnVisibility}
                                toggleColumnVisibility={toggleColumnVisibility}
                                setColumnVisibility={setColumnVisibility}
                                initialColumnVisibility={initialColumnVisibility}
                                columnDataTable={columnDataTable}
                            />
                        </Popover>



                        <Popover
                            id={idSearch}
                            open={openSearch}
                            anchorEl={anchorElSearch}
                            onClose={handleCloseSearch}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                        >
                            <Box style={{ padding: "10px", maxWidth: '450px' }}>
                                <Typography variant="h6">Advance Search</Typography>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseSearch}
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
                                    <Box sx={{
                                        width: '350px',
                                        maxHeight: '400px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <Box sx={{
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            // paddingRight: '5px'
                                        }}>
                                            <Grid container spacing={1}>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    <Typography>Columns</Typography>
                                                    <Select fullWidth size="small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: "auto",
                                                                },
                                                            },
                                                        }}
                                                        style={{ minWidth: 150 }}
                                                        value={selectedColumn}
                                                        onChange={(e) => setSelectedColumn(e.target.value)}
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="" disabled>Select Column</MenuItem>
                                                        {filteredSelectedColumn.map((col) => (
                                                            <MenuItem key={col.field} value={col.field}>
                                                                {col.headerName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Grid>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    <Typography>Operator</Typography>
                                                    <Select fullWidth size="small"
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200,
                                                                    width: "auto",
                                                                },
                                                            },
                                                        }}
                                                        style={{ minWidth: 150 }}
                                                        value={selectedCondition}
                                                        onChange={(e) => setSelectedCondition(e.target.value)}
                                                        disabled={!selectedColumn}
                                                    >
                                                        {conditions.map((condition) => (
                                                            <MenuItem key={condition} value={condition}>
                                                                {condition}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Grid>
                                                <Grid item md={12} sm={12} xs={12}>
                                                    <Typography>Value</Typography>
                                                    <TextField fullWidth size="small"
                                                        value={["Blank", "Not Blank"].includes(selectedCondition) ? "" : filterValue}
                                                        onChange={(e) => setFilterValue(e.target.value)}
                                                        disabled={["Blank", "Not Blank"].includes(selectedCondition)}
                                                        placeholder={["Blank", "Not Blank"].includes(selectedCondition) ? "Disabled" : "Enter value"}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root.Mui-disabled': {
                                                                backgroundColor: 'rgb(0 0 0 / 26%)',
                                                            },
                                                            '& .MuiOutlinedInput-input.Mui-disabled': {
                                                                cursor: 'not-allowed',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                                {additionalFilters.length > 0 && (
                                                    <>
                                                        <Grid item md={12} sm={12} xs={12}>
                                                            <RadioGroup
                                                                row
                                                                value={logicOperator}
                                                                onChange={(e) => setLogicOperator(e.target.value)}
                                                            >
                                                                <FormControlLabel value="AND" control={<Radio />} label="AND" />
                                                                <FormControlLabel value="OR" control={<Radio />} label="OR" />
                                                            </RadioGroup>
                                                        </Grid>
                                                    </>
                                                )}
                                                {additionalFilters.length === 0 && (
                                                    <Grid item md={4} sm={12} xs={12} >
                                                        <Button variant="contained" onClick={handleAddFilter} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
                                                            Add Filter
                                                        </Button>
                                                    </Grid>
                                                )}

                                                <Grid item md={2} sm={12} xs={12}>
                                                    <Button variant="contained" onClick={() => {
                                                        if (items?.length) {
                                                            fetchAssetDetails("Filtered");
                                                            setIsSearchActive(true);
                                                            setAdvancedFilter([
                                                                ...additionalFilters,
                                                                { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                                            ])
                                                        }

                                                    }} sx={{ textTransform: "capitalize" }} disabled={["Blank", "Not Blank"].includes(selectedCondition) ? false : !filterValue || selectedColumn.length === 0}>
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
                        <br />
                        {assetdetailCheck ? (
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

                                {/* <AggridTable
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
                  pagenamecheck={"Dynamic Asset Master List"}
                  // totalDatas={totalDatas}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={assetdetails}
                /> */}
                                <AggridTableForPaginationTable
                                    rowDataTable={rowDataTable}
                                    columnDataTable={columnDataTable}
                                    columnVisibility={columnVisibility}
                                    pagenamecheck={"Asset List"}
                                    selectedRowsAssetList={selectedRowsAssetList}
                                    setSelectedRowsAssetList={setSelectedRowsAssetList}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    setColumnVisibility={setColumnVisibility}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    totalDatas={totalProjects}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={overallFilterdata}
                                />

                            </>
                        )}
                    </Box>
                </>
            )}

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ marginTop: "95px" }}
                maxWidth="lg"
            >
                <Box sx={{ width: "850px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            View Dynamic Asset Master
                        </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Company</Typography>
                                    <Typography>{assetdetail.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Branch</Typography>
                                    <Typography>{assetdetail.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{assetdetail.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{assetdetail.floor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Area</Typography>
                                    <Typography>{assetdetail.area}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Location</Typography>
                                    <Typography>{assetdetail.location}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset Material</Typography>
                                    <Typography>{assetdetail.assetmaterialcode}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Asset </Typography>
                                    <Typography>{assetdetail.asset}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Vendor Name</Typography>
                                    <Typography>{assetdetail.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Address</Typography>
                                    <Typography>{assetdetail.address}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Phone Number</Typography>
                                    <Typography>{assetdetail.phonenumber}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Type</Typography>
                                    <Typography>{assetdetail.type}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Options</Typography>
                                    <Typography>  {selectedOptions
                                        ?.map((t, i) => t)
                                        .join(", ")
                                        .toString()}</Typography>
                                </FormControl>
                            </Grid>


                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Status</Typography>
                                    <Typography>{assetdetail.status}</Typography>
                                </FormControl>
                            </Grid>

                            {assetdetail.status === "Paid" && (
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Vendor Group</Typography>
                                            <Typography>{vendorGroup}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Vendor</Typography>
                                            <Typography>{vendor}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Warranty Time</Typography>
                                            <Typography>{assetdetail.estimation}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Estimation</Typography>
                                            <Typography>{assetdetail.estimationtime}</Typography>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Purchasedate</Typography>
                                            <Typography>{(assetdetail.purchasedate === "Invalid date" || assetdetail.purchasedate === "" || assetdetail.purchasedate === undefined) ? "" : moment(assetdetail.purchasedate).format("DD/MM/YYYY")}</Typography>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography variant="h6">Expiry Date </Typography>
                                            <Typography>{(assetdetail.warrantycalculation === "Invalid date" || assetdetail.warrantycalculation === "" || assetdetail.warrantycalculation === undefined) ? "" : assetdetail.warrantycalculation}</Typography>
                                        </FormControl>
                                    </Grid>
                                </>
                            )}

                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.buttonsubmit}
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>








            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={{ marginTop: "95px" }}
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={() => {
                                sendEditRequest();
                                handleCloseerrpop();
                            }}
                        >
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "#f4f4f4",
                                color: "#444",
                                boxShadow: "none",
                                borderRadius: "3px",
                                padding: "7px 13px",
                                border: "1px solid #0000006b",
                                "&:hover": {
                                    "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                        backgroundColor: "#f4f4f4",
                                    },
                                },
                            }}
                            onClick={handleCloseerrpop}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>




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
                itemsTwo={overallFilterdata ?? []}
                filename={"Dynamic Asset Master List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Dynamic Asset Master Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delAssetdetail}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAssetcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
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
        </Box>
    );
}

export default AssetSoftwareDetailsList;