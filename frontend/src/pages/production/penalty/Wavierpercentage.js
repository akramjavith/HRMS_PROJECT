import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography } from "@mui/material";
import CircularProgress, {
    circularProgressClasses,
} from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import { CsvBuilder } from "filefy";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import SendToServer from "../../sendtoserver";

// Inspired by the former Facebook spinners.
function FacebookCircularProgress(props) {
    return (
        <Box sx={{ position: "relative" }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: (theme) =>
                        theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
                    animationDuration: "550ms",
                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: "round",
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}
function Waiverpercentage() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);

    const [filteredRowDataFilename, setFilteredRowDataFilename] = useState([]);
    const [filteredChangesFilename, setFilteredChangesFilename] = useState(null);

    const [overallItemsFilename, setOverallItemsFilename] = useState([]);

    const [filteredRowDataviewall, setFilteredRowDataviewall] = useState([]);
    const [filteredChangesviewall, setFilteredChangesviewall] = useState(null);

    const [overallItemsviewall, setOverallItemsviewall] = useState([]);

    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [isHandleChangeFilename, setIsHandleChangeFilename] = useState(false);
    const [searchedStringFilename, setSearchedStringFilename] = useState("")
    const [isHandleChangeviewall, setIsHandleChangeviewall] = useState(false);
    const [searchedStringviewall, setSearchedStringviewall] = useState("")
    const [tableOneLoader, setTableOneLoader] = useState(false);
    const [tableTwoLoader, setTableTwoLoader] = useState(false);
    const [updateSheet, setUpdatesheet] = useState([])

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const [isFilterOpen1, setIsFilterOpen1] = useState(false);
    const [isPdfFilterOpen1, setIsPdfFilterOpen1] = useState(false);
    // page refersh reload
    const handleCloseFilterMod1 = () => {
        setIsFilterOpen1(false);
    };
    const handleClosePdfFilterMod1 = () => {
        setIsPdfFilterOpen1(false);
    };
    const [isFilterOpen2, setIsFilterOpen2] = useState(false);
    const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);
    // page refersh reload
    const handleCloseFilterMod2 = () => {
        setIsFilterOpen2(false);
    };
    const handleClosePdfFilterMod2 = () => {
        setIsPdfFilterOpen2(false);
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
    }
    const [fileFormat, setFormat] = useState("");
    const gridRef = useRef(null);
    const gridRefFilename = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [targetPoints, setTargetPoints] = useState([]);
    const [targetPointsFilename, setTargetPointsFilename] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const [fileNameView, setFileNameView] = useState("");
    const [fileNameID, setFileNameID] = useState("");
    const [isDisabled, setIsDisabled] = useState(false)
    const [isDisabledBtn, setIsDisabledBtn] = useState(false)
    const currentDate = new Date();
    const [waiverPercentageState, setwaiverPercentageState] = useState({
        fromdate: moment(currentDate).format("YYYY-MM-DD"),
        todate: moment(currentDate).format("YYYY-MM-DD"),
        projectvendor: "Please Select Project Vendor",
        queuename: "Please Select Queue Name",
        loginid: "Please Select Login ID",
        percentage: "",
    });
    const [openviewAll, setOpenviewAll] = useState(false);
    const handleClickOpenviewAll = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setOpenviewAll(true);
    };
    const [itemsviewAll, setItemsviewAll] = useState([]);
    const [productionoriginalviewAll, setProductionoriginalViewAll] = useState(
        []
    );

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Wavier Percentage"),
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

    const addSerialNumberviewAll = (datas) => {
        const itemsWithSerialNumber = datas?.map(
            (item, index) => ({
                ...item,
                serialNumber: index + 1,
                date: item.date,
            })
        );
        setItemsviewAll(itemsWithSerialNumber);
        setOverallItemsviewall(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumberviewAll(productionoriginalviewAll);
    }, [productionoriginalviewAll]);

    const [searchQueryviewAll, setSearchQueryviewAll] = useState("");
    const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState("");
    const [pageviewAll, setPageviewAll] = useState(1);
    const [pageSizeviewAll, setPageSizeviewAll] = useState(10);
    //Datatable
    const handlePageChangeviewAll = (newPage) => {
        setPageviewAll(newPage);
    };
    const handlePageSizeChangeviewAll = (event) => {
        setPageSizeviewAll(Number(event.target.value));
        setPageviewAll(1);
    };
    //datatable....
    const handleSearchChangeviewAll = (event) => {
        setSearchQueryviewAll(event.target.value);
        setPageviewAll(1);
    };
    const initialColumnVisibilityviewAll = {
        serialNumber: true,
        projectvendor: true,
        fromdate: true,
        todate: true,
        loginid: true,
        queuename: true,
        percentage: true,
    };
    const [columnVisibilityviewAll, setColumnVisibilityviewAll] = useState(
        initialColumnVisibilityviewAll
    );
    // Show All Columns functionality
    const handleShowAllColumnsviewAll = () => {
        const updatedVisibility = { ...columnVisibilityviewAll };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityviewAll(updatedVisibility);
    };
    // Manage Columnsviewall
    const [isManageColumnsOpenviewAll, setManageColumnsOpenviewAll] =
        useState(false);
    const [anchorElviewAll, setAnchorElviewAll] = useState(null);
    const handleOpenManageColumnsviewAll = (event) => {
        setAnchorElviewAll(event.currentTarget);
        setManageColumnsOpenviewAll(true);
    };
    const handleCloseManageColumnsviewAll = () => {
        setManageColumnsOpenviewAll(false);
        setSearchQueryManageviewAll("");
    };
    const openviewpopall = Boolean(anchorElviewAll);
    const idviewall = openviewpopall ? "simple-popover" : undefined;
    // datavallist:datavallist,
    const columnDataTableviewAll = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibilityviewAll.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
            lockPinned: true,
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor Name",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.projectvendor,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "fromdate",
            headerName: "From Date",
            flex: 0,
            width: 140,
            hide: !columnVisibilityviewAll.fromdate,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "todate",
            headerName: "To Date",
            flex: 0,
            width: 140,
            hide: !columnVisibilityviewAll.todate,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.loginid,
            headerClassName: "bold-header",
        },
        {
            field: "queuename",
            headerName: "Queue Name",
            flex: 0,
            width: 140,
            hide: !columnVisibilityviewAll.queuename,
            headerClassName: "bold-header",
        },
        {
            field: "percentage",
            headerName: "Percentage",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.percentage,
            headerClassName: "bold-header",
        },

    ];
    // // Function to filter columns based on search query
    const filteredColumnsviewAll = columnDataTableviewAll.filter((column) =>
        column.headerName
            .toLowerCase()
            .includes(searchQueryManageviewAll.toLowerCase())
    );
    // Manage Columns functionality
    const toggleColumnVisibilityviewAll = (field) => {
        setColumnVisibilityviewAll((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // excelupload
    const [fileUploadName, setFileUploadName] = useState("");
    const [dataupdated, setDataupdated] = useState("");
    const [loading, setLoading] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [items, setItems] = useState([]);
    const [splitArray, setSplitArray] = useState([]);
    const [sheets, setSheets] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState("Please Select Sheet");
    const [selectedSheetindex, setSelectedSheetindex] = useState();
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [targetPointsData, setTargetPointsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    //SECOND DATATABLE
    const [pageFilename, setPageFilename] = useState(1);
    const [pageSizeFilename, setPageSizeFilename] = useState(10);
    const [itemsFilename, setItemsFilename] = useState([]);
    const [selectedRowsFilename, setSelectedRowsFilename] = useState([]);
    const [searchQueryFilename, setSearchQueryFilename] = useState("");
    const [isManageColumnsOpenFilename, setManageColumnsOpenFilename] = useState(false);
    const [anchorElFilename, setAnchorElFilename] = useState(null);
    const [selectAllCheckedFilename, setSelectAllCheckedFilename] = useState(false);
    const [searchQueryManageFilename, setSearchQueryManageFilename] = useState("");
    const [targetPointsDataFilename, setTargetPointsDataFilename] = useState([]);
    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        projectvendor: true,
        fromdate: true,
        todate: true,
        loginid: true,
        queuename: true,
        percentage: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
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
    const searchTermsviewAll = searchQueryviewAll.toLowerCase().split(" ");
    const filteredDataviewAlls = itemsviewAll?.filter((item) => {
        return searchTermsviewAll.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });
    const filteredDataviewAll = filteredDataviewAlls.slice(
        (pageviewAll - 1) * pageSizeviewAll,
        pageviewAll * pageSizeviewAll
    );
    const totalPagesviewAll = Math.ceil(
        filteredDataviewAlls.length / pageSizeviewAll
    );
    const visiblePagesviewAll = Math.min(totalPagesviewAll, 3);
    const firstVisiblePageviewAll = Math.max(1, pageviewAll - 1);
    const lastVisiblePageviewAll = Math.min(
        firstVisiblePageviewAll + visiblePagesviewAll - 1,
        totalPagesviewAll
    );
    const pageNumbersviewall = [];
    const indexOfLastItemviewAll = pageviewAll * pageSizeviewAll;
    const indexOfFirstItemviewAll = indexOfLastItemviewAll - pageSizeviewAll;
    for (let i = firstVisiblePageviewAll; i <= lastVisiblePageviewAll; i++) {
        pageNumbersviewall.push(i);
    }
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const [productionfirstViewCheck, setProductionfirstViewcheck] =
        useState(false);
    const username = isUserRoleAccess.username;
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        // fetchTargetPointsData();
    };
    const handleCloseerrUpdate = () => {
        setIsErrorOpen(false);
        // fetchTargetPointsData();
    };
    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        // if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };
    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
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
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
        setDeletefilenamedata([]);
    };
    //Delete single model
    const [isDeleteSingleOpen, setIsDeleteSingleOpen] = useState(false);
    const handleClickSingleOpen = () => {
        setIsDeleteSingleOpen(true);
    };
    const handleCloseSingleMod = () => {
        setIsDeleteSingleOpen(false);
        setDeletesingledata({});
    };
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
        setSelectedRows([]);
        setSelectAllChecked(false);
    };
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickOpenalert = () => {
        setIsHandleChange(true);
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
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };
    const [projOpt, setProjOpt] = useState([])
    const getProject = async () => {
        setPageName(!pageName)
        try {
            let response = await axios.get(`${SERVICE.VENDORMASTER}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const projectOpt = [...response.data.vendormaster.map((t) => ({ ...t, label: t.projectname + "-" + t.name, value: t.projectname + "-" + t.name }))]
            setProjOpt(projectOpt);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [processOpt, setProcessQueue] = useState([])
    //get all client user id.
    const fetchProcessQueue = async () => {
        // const projName = Qname?.split("-")[0]
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const Que = [...res_freq?.data.processqueuename.map((d) => ({
                ...d,
                label: d.name,
                value: d.name
            }))]
            setProcessQueue(Que);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [loginIdOpt, setClientLoginIDOpt] = useState([])
    const [loginIdEditOpt, setClientLoginIdEditOpt] = useState([])
    //get all client user id.
    const fetchClientUserID = async (proj) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterProjBased = res_freq?.data?.clientuserid.filter((item) => item.projectvendor === proj)
            const loginIdOpt = [...filterProjBased.map((d) => ({
                ...d,
                label: d.userid,
                value: d.userid,
            }))];
            setClientLoginIDOpt(loginIdOpt);
            setClientLoginIdEditOpt(loginIdOpt)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const [targetPointsFilenameOverall, setTargetPointsFilenameOverall] = useState([])
    const [targetPointsOverall, setTargetPointsOverall] = useState([])
    const fetchTargetPointsDataOverall = async () => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.WAVIERPERCENTAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTargetPointsOverall(Res?.data?.wavierpercentage.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    projectvendor: item.projectvendor,
                    fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
                    todate: moment(item.todate).format("DD-MM-YYYY"),
                    loginid: item.loginid,
                    queuename: item.queuename,
                    percentage: item.percentage,
                };
            }));
            let getFilenames = Res?.data?.wavierpercentage.filter((item) => item.filename !== "nonexcel");
            const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.queuename))).map((queuename) => {
                return getFilenames.find((obj) => obj.queuename === queuename);
            });
            // uniqueArray now contains unique objects based on queuename property
            setTargetPointsFilenameOverall(uniqueArray.map((item, index) => {
                return {
                    id: item.serialNumber,
                    serialNumber: item.serialNumber,
                    projectvendor: item.projectvendor,
                    queuename: item.queuename,
                    filename: item.filename,
                    createdby: item.addedby[0].name,
                    createddate: moment(item?.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss a"),
                    fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
                    todate: moment(item.todate).format("DD-MM-YYYY")
                };
            }));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchTargetPointsDataOverall()
    }, [isFilterOpen, isPdfFilterOpen])

    const fetchTargetPointsData = async () => {
        setPageName(!pageName)

        try {
            let Res = await axios.get(SERVICE.WAVIERPERCENTAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTargetPoints(Res?.data?.wavierpercentage);
            let getFilenames = Res?.data?.wavierpercentage.filter((item) => item.filename !== "nonexcel");
            const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.queuename))).map((queuename) => {
                return getFilenames.find((obj) => obj.queuename === queuename);
            });
            // uniqueArray now contains unique objects based on queuename property
            setTargetPointsFilename(uniqueArray);
            setTableOneLoader(true);
            setTableTwoLoader(true);
        } catch (err) {
            setTableOneLoader(true);
            setTableTwoLoader(true);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }

    };


    useEffect(() => {
        getProject();
        fetchTargetPointsData();
        fetchProcessQueue()
    }, []);

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = targetPoints?.some((item) =>
            item.projectvendor.toLowerCase() == waiverPercentageState.projectvendor.toLowerCase() &&
            item.fromdate.toLowerCase() == waiverPercentageState.fromdate.toLowerCase() &&
            item.todate.toLowerCase() == waiverPercentageState.todate.toLowerCase() &&
            item.queuename.toLowerCase() == waiverPercentageState.queuename.toLowerCase() &&
            item.loginid.toLowerCase() == waiverPercentageState.loginid.toLowerCase() &&
            item.percentage.toLowerCase() == waiverPercentageState.percentage.toLowerCase()
        )
        if (waiverPercentageState.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.fromdate === "" || waiverPercentageState.todate === "") {
            let alertMsg = waiverPercentageState.fromdate === "" && waiverPercentageState.todate === "" ? "Please Choose From Date & To Date" : waiverPercentageState.fromdate === "" ? "Please Choose From Date" : "Please Choose To Date";
            setPopupContentMalert(alertMsg);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (waiverPercentageState.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.percentage === "") {
            setPopupContentMalert("Please Enter Percentage");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            setSearchQuery("")
            setSearchQueryviewAll("")
            setSearchQueryFilename("")
            sendRequest();
        }
    };
    //print.view.all.
    const componentRefviewall = useRef();
    const handleprintviewall = useReactToPrint({
        content: () => componentRefviewall.current,
        documentTitle: fileNameView,
        pageStyle: "print",
    });
    // pdf.....
    const columnsviewall = [
        { title: "Sno", field: "serialNumber" },
        { title: "Project Vendor", field: "projectvendor" },
        { title: "From Date", field: "fromdate" },
        { title: "To Date", field: "todate" },
        { title: "Login ID", field: "loginid" },
        { title: "Queue Name", field: "queuename" },
        { title: "Percentage", field: "percentage" }
    ];

    const exportColumnNamestwo = [

        'Project Vendor Name',
        'From Date',
        'To Date',
        'Login ID',
        'Queue Name',
        'percentage'
    ]
    const exportRowValuestwo = [

        'projectvendor',
        'fromdate',
        'todate',
        'loginid',
        'queuename',
        'percentage'
    ]

    const modifiedString = fileNameView.replace(".csv", "");
    const downloadPdfviewall = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            columns: columnsviewall.map((col) => ({ ...col, dataKey: col.field })),
            body: rowDataTableviewAll,
        });
        doc.save(modifiedString);
        // const doc = new jsPDF();
        // doc.autoTable({
        //   theme: "grid",
        //   columns: columnsviewall.map((col) => ({ ...col, dataKey: col.field })),
        //   body: rowDataTableviewAll,
        //   styles: {
        //     fontSize: 5,
        //   },
        // });
        // doc.save(`${fileNameView}`);
    };
    const gridRefviewall = useRef(null);
    //image view all
    const gridRefTableImgviewall = useRef(null);
    // image
    const handleCaptureImageviewall = () => {
        if (gridRefTableImgviewall.current) {
            domtoimage.toBlob(gridRefTableImgviewall.current)
                .then((blob) => {
                    saveAs(blob, "Wavier Percentage.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };
    const rowDataTableviewAll = filteredDataviewAll.map((item, index) => {
        // const filenamelistviewAll = item.filename?.split(".x");
        // const filenamelist = filenamelistviewAll[0];
        // const dateObject = new Date(item.dateval);
        // const datavallist = dateObject?.toISOString()?.split('T')[0];
        //     const ISTDateString = dateObject.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
            todate: moment(item.todate).format("DD-MM-YYYY"),
            loginid: item.loginid,
            queuename: item.queuename,
            percentage: item.percentage,
        };
    });
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentviewAll = (
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
                onClick={handleCloseManageColumnsviewAll}
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
                    value={searchQueryManageviewAll}
                    onChange={(e) => setSearchQueryManageviewAll(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsviewAll.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityviewAll[column.field]}
                                        onChange={() => toggleColumnVisibilityviewAll(column.field)}
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
                                setColumnVisibilityviewAll(initialColumnVisibilityviewAll)
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
                                columnDataTableviewAll.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityviewAll(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    //add function...
    const sendRequest = async () => {
        setIsDisabledBtn(true)
        setPageName(!pageName)
        try {
            let res = await axios.post(SERVICE.WAVIERPERCENTAGE_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: String(waiverPercentageState.fromdate),
                todate: String(waiverPercentageState.todate),
                projectvendor: String(waiverPercentageState.projectvendor),
                queuename: String(waiverPercentageState.queuename),
                loginid: String(waiverPercentageState.loginid),
                percentage: String(waiverPercentageState.percentage),
                filename: "nonexcel",
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTargetPointsData();
            setClientLoginIDOpt([])
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsDisabledBtn(false)
        } catch (err) { setIsDisabledBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const handleClear = (e) => {
        e.preventDefault();
        setFileUploadName("");
        setSplitArray([]);
        // readExcel(null);
        setDataupdated("");
        setSheets([]);
        setSelectedSheet("Please Select Sheet");
        setwaiverPercentageState({
            ...waiverPercentageState,
            fromdate: moment(currentDate).format("YYYY-MM-DD"),
            todate: moment(currentDate).format("YYYY-MM-DD"),
            projectvendor: "Please Select Project Vendor",
            queuename: "Please Select Queue Name",
            loginid: "Please Select Login ID",
            percentage: "",
        });
        setClientLoginIDOpt([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("")
        setSearchQueryviewAll("")
        setSearchQueryFilename("")
    };
    //delete singledata functionality
    const [deletesingleData, setDeletesingledata] = useState();
    const rowDataSingleDelete = async (id) => {
        setLoader(true)
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.WAVIERPERCENTAGE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeletesingledata(Res?.data?.swavierpercentage);
            handleClickSingleOpen();
            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const deleteSingleList = async () => {
        setLoader(true)
        let deleteSingleid = deletesingleData?._id;
        setPageName(!pageName)
        try {
            const deletePromises = await axios.delete(`${SERVICE.WAVIERPERCENTAGE_SINGLE}/${deleteSingleid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleCloseSingleMod();
            setPage(1);
            await fetchTargetPointsData();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const deleteSingleBulkdataDelete = async () => {
        setLoader(true)
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.WAVIERPERCENTAGE_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            await Promise.all(deletePromises);
            setIsHandleChange(false);
            handleCloseModcheckbox();
            setPage(1);
            await fetchTargetPointsData();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //edit get data functionality single list
    const [editWaiverPercentage, setEditWaiverPercentage] = useState({
        loginid: "Please Select Login ID",
        percentage: ""
    });
    const [viewsingleData, setviewsingleData] = useState([]);
    const [infosingleData, setinfosingleData] = useState({ experience: "", processcode: "", code: "", points: "" });
    const [penaltyArray, setPenaltyArray] = useState([])
    const fetchTargetPointsAllData = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.WAVIERPERCENTAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // let getFilenames = Res?.data?.penaltyerroruploadpoints.filter((item) => item.filename === filename).map((item) => item._id);
            let getArray = Res?.data?.wavierpercentage.filter((item) => item._id !== id);
            setPenaltyArray(getArray)
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const rowdatasingleedit = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.WAVIERPERCENTAGE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            console.log(id, "is")
            setEditWaiverPercentage(Res?.data?.swavierpercentage);
            fetchTargetPointsAllData(id);
            fetchClientUserID(Res?.data?.swavierpercentage.projectvendor);
            handleClickOpenEdit();
            // setEditWaiverPercentage(prevData);
            // let getFilenames = Res?.data?.spenaltyerroruploadpoints.filter((item) => item.filename === filename).map((item) => item._id);
            // let getFilenames = Res?.data?.spenaltyerroruploadpoints
            // // .filter((item) => item._id != id);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const rowdatasingleview = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.WAVIERPERCENTAGE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // let getFilenames = Res?.data?.stargetpoints.filter((item) => item.filename === filename).map((item) => item._id);
            setviewsingleData(Res?.data?.swavierpercentage);
            handleClickOpenview();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const rowdatasingleinfo = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.WAVIERPERCENTAGE_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setinfosingleData(Res?.data?.swavierpercentage);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const editSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = penaltyArray?.some((item) =>
            item.queuename.toLowerCase() == editWaiverPercentage.queuename.toLowerCase() &&
            item.loginid.toLowerCase() == editWaiverPercentage.loginid.toLowerCase() &&
            item.percentage.toLowerCase() == editWaiverPercentage.percentage.toLowerCase()
        )
        if (editWaiverPercentage.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (editWaiverPercentage.percentage === "") {
            setPopupContentMalert("Please Enter Percentage");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };

    const addedby = infosingleData.addedby
    const updateby = infosingleData.updatedby || []

    const sendEditRequest = async () => {
        let editid = editWaiverPercentage._id;
        // let updateby = editWaiverPercentage.updatedby;
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.WAVIERPERCENTAGE_SINGLE}/${editid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                loginid: String(editWaiverPercentage.loginid),
                percentage: String(editWaiverPercentage.percentage),
                updatedby: [
                    ...updateby,
                    {

                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTargetPointsData();
            handleCloseModEdit();
            setEditWaiverPercentage({ ...editWaiverPercentage, loginid: "Please Select Login ID", percentage: "" });
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //image
    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Wavier Percentage.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    const exportColumnNamesone = [
        'Project Vendor Name',
        'From Date',
        'To Date',
        'Login ID',
        'Queue Name',
        'percentage'
    ]

    const exportRowValuesone = [
        'projectvendor',
        'fromdate',
        'todate',
        'loginid',
        'queuename',
        'percentage'
    ]




    // Excel
    const fileName = "Waiver Percentage";
    // get particular columns for export excel
    const getexcelDatas = () => {
        var data = items.map((t, index) => ({
            Sno: t.serialNumber,
            Company: t.company,
            Branch: t.branch,
            "Experience in Months": t.experience,
            "Process Code": t.processcode,
            Code: t.code,
            Points: t.points,
        }));
        setTargetPointsData(data);
    };
    useEffect(() => {
        getexcelDatas();
    }, [items]);
    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Waiver Percentage",
        pageStyle: "print",
    });
    //serial no for listing items
    const addSerialNumber = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
        setOverallItems(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumber(targetPoints);
    }, [targetPoints]);
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
        setPage(1);
    };
    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',
            lockPinned: true,
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.projectvendor,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "fromdate",
            headerName: "From Date",
            flex: 0,
            width: 140,
            hide: !columnVisibility.fromdate,
            headerClassName: "bold-header",
        },
        {
            field: "todate",
            headerName: "To Date",
            flex: 0,
            width: 140,
            hide: !columnVisibility.todate,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 150,
            hide: !columnVisibility.loginid,
            headerClassName: "bold-header",
        },
        {
            field: "queuename",
            headerName: "Queue Name",
            flex: 0,
            width: 140,
            hide: !columnVisibility.queuename,
            headerClassName: "bold-header",
        },
        {
            field: "percentage",
            headerName: "Percentage",
            flex: 0,
            width: 150,
            hide: !columnVisibility.percentage,
            headerClassName: "bold-header",
        },
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
                    {isUserRoleCompare?.includes("ewaiverpercentageupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleedit(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dwaiverpercentageupload") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDataSingleDelete(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vwaiverpercentageupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleview(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("iwaiverpercentageupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleinfo(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
            todate: moment(item.todate).format("DD-MM-YYYY"),
            loginid: item.loginid,
            queuename: item.queuename,
            percentage: item.percentage,
        };
    });
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
                            {" "}
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
                            {" "}
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );
    //SECOND TABLE FDATA AND FUNCTIONS
    const handleCloseviewAll = () => {
        setOpenviewAll(false);
        setProductionoriginalViewAll([]);
        setSearchQueryviewAll("");
        setPageviewAll(1);
        setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
    };
    // get single row to view....
    const getviewCodeall = async (queuename, filename) => {
        setPageName(!pageName)
        try {

            setProductionfirstViewcheck(false);
            let res = await axios.get(SERVICE.WAVIERPERCENTAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getFilenames = res?.data?.wavierpercentage.filter((item) => item.queuename === queuename)
            // .map((item) => item._id);
            setProductionoriginalViewAll(getFilenames);
            setFileNameView(filename);
            handleClickOpenviewAll();
            // setFileNameID(res?.data?.sdaypointsupload?._id);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); } finally {
            setProductionfirstViewcheck(true);
            setPageviewAll(1);
            setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
        }
    };

    const [productionoriginalViewAllOverall, setProductionoriginalViewAllOverall] = useState([])

    const getviewCodeallOverall = async (queuename, filename) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.WAVIERPERCENTAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getFilenames = res?.data?.wavierpercentage.filter((item) => item.queuename === queuename)
            // .map((item) => item._id);
            setProductionoriginalViewAllOverall(getFilenames.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    projectvendor: item.projectvendor,
                    fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
                    todate: moment(item.todate).format("DD-MM-YYYY"),
                    loginid: item.loginid,
                    queuename: item.queuename,
                    percentage: item.percentage,
                };
            }));
            // setFileNameID(res?.data?.sdaypointsupload?._id);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); } finally {
        }
    };

    const [deleteFilenameData, setDeletefilenamedata] = useState([]);
    const rowDatafileNameDelete = async (queuename, filename) => {
        setLoader(true)
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.WAVIERPERCENTAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getFilenames = Res?.data?.wavierpercentage.filter((item) => item.queuename == queuename && item.filename == filename).map((item) => item._id);
            setDeletefilenamedata(getFilenames);
            handleClickOpen();
            setLoader(false)
        } catch (err) {
            console.log(err)
            setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    const deleteFilenameList = async () => {
        setLoader(true)
        setPageName(!pageName)
        try {
            const deletePromises = deleteFilenameData?.map((item) => {
                return axios.delete(`${SERVICE.WAVIERPERCENTAGE_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            await Promise.all(deletePromises);
            handleCloseMod();
            // handleClickOpenerr();
            setPage(1);
            await fetchTargetPointsData();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();;
            setLoader(false)
        } catch (err) {
            console.log(err)
            setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };
    // Manage Columns
    const handleOpenManageColumnsFilename = (event) => {
        setAnchorElFilename(event.currentTarget);
        setManageColumnsOpenFilename(true);
    };
    const handleCloseManageColumnsFilename = () => {
        setManageColumnsOpenFilename(false);
        setSearchQueryManageFilename("");
    };
    // Show All Columns & Manage Columns
    const initialColumnVisibilityFilename = {
        serialNumber: true,
        checkbox: true,
        projectvendor: true,
        queuename: true,
        fromdate: true,
        todate: true,
        createdby: true,
        createddate: true,
        filename: true,
        uploaddate: true,
        actions: true,
    };
    const [columnVisibilityFilename, setColumnVisibilityFilename] = useState(initialColumnVisibilityFilename);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityFilename");
        if (savedVisibility) {
            setColumnVisibilityFilename(JSON.parse(savedVisibility));
        }
    }, []);
    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityFilename", JSON.stringify(columnVisibilityFilename));
    }, [columnVisibilityFilename]);
    const handleSelectionChangeFilename = (newSelection) => {
        setSelectedRowsFilename(newSelection.selectionModel);
    };
    //image
    const gridRefTableImgFilename = useRef(null);
    // image
    const handleCaptureImageFilename = () => {
        if (gridRefTableImgFilename.current) {
            domtoimage.toBlob(gridRefTableImgFilename.current)
                .then((blob) => {
                    saveAs(blob, "Wavier Percentage.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const exportColumnNames = [
        'From Date',
        'To Date',
        'Project Vendor',
        'Queue Name',
        'File Name',
        'Created By',
        'Created Date & Time'
    ]
    const exportRowValues = [
        'fromdate',
        'todate',
        'projectvendor',
        'queuename',
        'filename',
        'createdby',
        'createddate'
    ]


    // Excel
    // const fileName = "TargetPoints";
    // get particular columns for export excel
    const getexcelDatasFilename = () => {
        var data = rowDataTable.map((t, index) => ({
            Sno: t.serialNumber,
            "Project Vendor": t.projectvendor,
            "Process": t.process,
            Filename: t.filename,
        }));
        setTargetPointsDataFilename(data);
    };
    useEffect(() => {
        getexcelDatasFilename();
    }, [itemsFilename]);
    //print...
    const componentRefFilename = useRef();
    const handleprintFilename = useReactToPrint({
        content: () => componentRefFilename.current,
        documentTitle: "Upload File List",
        pageStyle: "print",
    });
    //serial no for listing itemsFilename
    const addSerialNumberFilename = (datas) => {
        const itemsWithSerialNumber = datas?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItemsFilename(itemsWithSerialNumber);
        setOverallItemsFilename(itemsWithSerialNumber);
    };
    useEffect(() => {
        addSerialNumberFilename(targetPointsFilename);
    }, [targetPointsFilename]);
    //Datatable
    const handlePageChangeFilename = (newPage) => {
        setPageFilename(newPage);
        setSelectedRowsFilename([]);
        setSelectAllCheckedFilename(false);
    };
    const handlePageSizeChangeFilename = (event) => {
        setPageSizeFilename(Number(event.target.value));
        setSelectedRowsFilename([]);
        setSelectAllCheckedFilename(false);
        setPageFilename(1);
    };
    //datatable....
    const handleSearchChangeFilename = (event) => {
        setSearchQueryFilename(event.target.value);
        setPageFilename(1);
    };
    // Split the search query into individual terms
    const searchTermsFilename = searchQueryFilename.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasFilename = itemsFilename?.filter((item) => {
        return searchTermsFilename.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });
    const FilenameFilename = filteredDatasFilename?.slice((pageFilename - 1) * pageSizeFilename, pageFilename * pageSizeFilename);
    const totalPagesFilename = Math.ceil(filteredDatasFilename?.length / pageSizeFilename);
    const visiblePagesFilename = Math.min(totalPagesFilename, 3);
    const firstVisiblePageFilename = Math.max(1, pageFilename - 1);
    const lastVisiblePageFilename = Math.min(firstVisiblePageFilename + visiblePagesFilename - 1, totalPagesFilename);
    const pageNumbersFilename = [];
    for (let i = firstVisiblePageFilename; i <= lastVisiblePageFilename; i++) {
        pageNumbersFilename.push(i);
    }
    const CheckboxHeaderFilename = ({ selectAllCheckedFilename, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllCheckedFilename} onChange={onSelectAll} />
        </div>
    );
    const columnDataTableFilename = [
        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',
            lockPinned: true,
            sortable: false, // Optionally, you can make this column not sortable
            width: 70,
            hide: !columnVisibilityFilename.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 70,
            hide: !columnVisibilityFilename.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "fromdate",
            headerName: "From Date",
            flex: 0,
            width: 120,
            hide: !columnVisibilityFilename.fromdate,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "todate",
            headerName: "To Date",
            flex: 0,
            width: 120,
            hide: !columnVisibilityFilename.todate,
            headerClassName: "bold-header",
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor",
            flex: 0,
            width: 120,
            hide: !columnVisibilityFilename.projectvendor,
            headerClassName: "bold-header",
        },
        {
            field: "queuename",
            headerName: "Queue Name",
            flex: 0,
            width: 120,
            hide: !columnVisibilityFilename.queuename,
            headerClassName: "bold-header",
        },
        {
            field: "filename",
            headerName: "File Name",
            flex: 0,
            width: 250,
            hide: !columnVisibilityFilename.name,
            headerClassName: "bold-header",
        },
        {
            field: "raisedby",
            headerName: "Created By",
            flex: 0,
            width: 200,
            hide: !columnVisibilityFilename.cretedby,
            headerClassName: "bold-header",
        },
        {
            field: "createdby",
            headerName: "Created By",
            flex: 0,
            width: 120,
            hide: !columnVisibilityFilename.createdby,
            headerClassName: "bold-header",
        },
        {
            field: "createddate",
            headerName: "Created Date & Time",
            flex: 0,
            width: 200,
            hide: !columnVisibilityFilename.createddate,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 220,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityFilename.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("dwaiverpercentageupload") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDatafileNameDelete(params.data.queuename, params.data.filename);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vwaiverpercentageupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeall(params.data.queuename, params.data.filename);
                                getviewCodeallOverall(params.data.queuename, params.data.filename)
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                        </Button>
                    )}

                </Grid>
            ),
        },
    ];
    const rowDataTableFilename = FilenameFilename.map((item, index) => {
        return {
            id: item.serialNumber,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            queuename: item.queuename,
            filename: item.filename,
            createdby: item.addedby[0].name,
            createddate: moment(item?.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss a"),
            fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
            todate: moment(item.todate).format("DD-MM-YYYY")
        };
    });
    const rowsWithCheckboxesFilename = rowDataTableFilename.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsFilename.includes(row.id),
    }));
    // Show All Columns functionality
    const handleShowAllColumnsFilename = () => {
        const updatedVisibility = { ...columnVisibilityFilename };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityFilename(updatedVisibility);
    };
    // Function to filter columns based on search query
    const filteredColumnsFilename = columnDataTableFilename.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageFilename.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibilityFilename = (field) => {
        setColumnVisibilityFilename((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContentFilename = (
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
                onClick={handleCloseManageColumnsFilename}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageFilename} onChange={(e) => setSearchQueryManageFilename(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsFilename.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityFilename[column.field]} onChange={() => toggleColumnVisibilityFilename(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityFilename(initialColumnVisibilityFilename)}>
                            {" "}
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
                                columnDataTableFilename.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityFilename(newColumnVisibility);
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
    // page refersh reload
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
    const readExcel = (file) => {
        const checkFile = file
        const fileExtension = checkFile?.name?.split('.')?.pop()?.toLowerCase();
        const acceptedExtensions = ['csv', 'xlsx', 'xls'];
        const requiredColumns = ["LoginId", "Percentage"];
        if (!acceptedExtensions.includes(fileExtension) && checkFile !== null) {
            setPopupContentMalert("Upload Excel File");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;
                    const wb = XLSX.read(bufferArray, { type: "buffer" });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws);
                    if (data.length === 0) {
                        setPopupContentMalert("The sheet is empty");
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert();
                        reject(new Error("The sheet is empty"));
                    } else {
                        resolve(data);
                    }
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
            });
            promise.then((data) => {
                const firstRow = data[0];
                const missingColumns = requiredColumns.filter(column => !Object.keys(firstRow).includes(column));
                if (missingColumns.length > 0) {
                    setFileUploadName("");
                    setPopupContentMalert("Required columns are missing");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
            }).catch((error) => {
                // Handle file reading error
                console.error("Error reading file:", error);
            });
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0");
            var yyyy = today.getFullYear();
            today = dd + "-" + mm + "-" + yyyy;
            promise.then((d) => {
                let uniqueArrayfinal = d.filter(
                    item => !targetPoints.some(tp =>
                        tp.projectvendor == waiverPercentageState.projectvendor &&
                        tp.fromdate == waiverPercentageState.fromdate &&
                        tp.todate == waiverPercentageState.todate &&
                        tp.queuename == waiverPercentageState.queuename &&
                        tp.loginid == item["LoginId"] &&
                        tp.percentage == item["Percentage"]
                    )
                );
                let uniqueArray = d.filter((item) => !targetPoints.some((tp) =>
                    tp.projectvendor == waiverPercentageState.projectvendor &&
                    tp.fromdate == waiverPercentageState.fromdate &&
                    tp.todate == waiverPercentageState.todate &&
                    tp.queuename == waiverPercentageState.queuename &&
                    tp.loginid == item["LoginId"] &&
                    tp.percentage == item["Percentage"]
                ));
                if (uniqueArrayfinal.length !== d.length) {
                    setPopupContentMalert(uniqueArrayfinal.length != d.length ? `${d.length - uniqueArrayfinal.length}  Duplicate or data Removed` : ` Data's Points field is Not a Number Removed`);
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
                const dataArray = uniqueArray.map((item) => ({
                    projectvendor: waiverPercentageState.projectvendor,
                    fromdate: waiverPercentageState.fromdate,
                    todate: waiverPercentageState.todate,
                    queuename: waiverPercentageState.queuename,
                    loginid: item["LoginId"],
                    percentage: item["Percentage"],
                    filename: file.name,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }));
                setUpdatesheet([])
                const subarraySize = 1000;
                const splitedArray = [];
                for (let i = 0; i < dataArray.length; i += subarraySize) {
                    const subarray = dataArray.slice(i, i + subarraySize);
                    splitedArray.push(subarray);
                }
                setSplitArray(splitedArray);
            });
            // }
        }
    };
    const getSheetExcel = () => {
        if (!Array.isArray(splitArray) || (splitArray.length === 0 && fileUploadName === "")) {
            setPopupContentMalert("Please Upload a file");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            let getsheets = splitArray.map((d, index) => ({
                label: "Sheet" + (index + 1),
                value: "Sheet" + (index + 1),
                index: index,
            }));
            setSheets(getsheets);
        }
    };
    const sendJSON = async () => {
        if (selectedSheet === "Please Select Sheet") {
            setPopupContentMalert(fileUploadName === "" ? "Please Upload File" :
                selectedSheet === "Please Select Sheet" ? "Please Select Sheet" : "No data to upload");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (waiverPercentageState.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.todate === "") {
            setPopupContentMalert("Please Select From To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            let uploadExceldata = splitArray[Number(selectedSheetindex)];
            let uniqueArrayfinalDup = uploadExceldata.filter((item, index, self) =>
                index === self.findIndex((tp) => (
                    tp.loginid == item.loginid &&
                    tp.percentage == item.percentage
                ))
            );
            let uniqueArrayfinal = uniqueArrayfinalDup.filter(
                item => !targetPoints.some(tp =>
                    tp.projectvendor == waiverPercentageState.projectvendor &&
                    tp.fromdate == waiverPercentageState.fromdate &&
                    tp.todate == waiverPercentageState.todate &&
                    tp.queuename == waiverPercentageState.queuename &&
                    tp.loginid == item.loginid
                    // tp.percentage == item.percentage
                )
            );
            let dataArray;
            if (uniqueArrayfinal.length > 0) {
                dataArray = uniqueArrayfinal.map((item) => ({
                    projectvendor: waiverPercentageState.projectvendor,
                    fromdate: waiverPercentageState.fromdate,
                    todate: waiverPercentageState.todate,
                    queuename: waiverPercentageState.queuename,
                    loginid: item.loginid,
                    percentage: item.percentage,
                    filename: item.filename,
                    addedby: [
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                }));
            }
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                }
            };
            setPageName(!pageName)
            try {
                setLoading(true);
                xmlhttp.open("POST", SERVICE.WAVIERPERCENTAGE_CREATE);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                if (uniqueArrayfinal.length > 0) {
                    xmlhttp.send(JSON.stringify(dataArray));
                }
                await fetchTargetPointsData();
            } catch (err) {
            } finally {
                if (uniqueArrayfinal.length === 0) {
                    setLoading(false);
                    setPopupContentMalert("Data Already Exist!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    await fetchTargetPointsData();
                } else {
                    setLoading(false);
                    setPopupContent("Uploaded Successfully");
                    setPopupSeverity("success");
                    handleClickOpenPopup();
                    setSelectedSheet("Please Select Sheet");
                    // setFileUploadName("")
                    // setSplitArray([])
                    setUpdatesheet(prev => [...prev, selectedSheetindex])
                    await fetchTargetPointsData();
                }
            }
        }
    };
    const clearFileSelection = () => {
        setUpdatesheet([])
        setFileUploadName("");
        setSplitArray([]);
        readExcel(null);
        setDataupdated("");
        setSheets([]);
        setSelectedSheet("Please Select Sheet");
    };
    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;
    const ExportsHead = () => {
        let fileDownloadName = "Waiverpercentage" + "_" + today;
        if (waiverPercentageState.projectvendor === "Please Select Project Vendor") {

            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.fromdate === "" || waiverPercentageState.todate === "") {
            let alertMsg = waiverPercentageState.fromdate === "" && waiverPercentageState.fromdate === "" ? "Please Choose From Date & To Date" : waiverPercentageState.fromdate === "" ? "Please Choose From Date" : "Please Choose To Date";

            setPopupContentMalert(alertMsg);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (waiverPercentageState.queuename === "Please Select Queue Name") {

            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            new CsvBuilder(fileDownloadName).setColumns(["LoginId", "Percentage"], []).exportFile();
        }
    };
    let dateselect = new Date();
    dateselect.setDate(dateselect.getDate() - 4);
    var ddt = String(dateselect.getDate()).padStart(2, "0");
    var mmt = String(dateselect.getMonth() + 1).padStart(2, "0");
    var yyyyt = dateselect.getFullYear();
    let formattedDatet = yyyyt + "-" + mmt + "-" + ddt;
    let datePresent = new Date();
    var ddp = String(datePresent.getDate()).padStart(2, "0");
    var mmp = String(datePresent.getMonth() + 1).padStart(2, "0");
    var yyyyp = datePresent.getFullYear();
    let formattedDatePresent = yyyyp + "-" + mmp + "-" + ddp;


    return (
        <Box>
            <Headtitle title={"Waiver Percentage"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Waiver Percentage"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Waiver"
                subpagename="Waiver Percentage Upload"
                subsubpagename=""
            />

            {
                <>
                    {isUserRoleCompare?.includes("awaiverpercentageupload") && (
                        <Box sx={userStyle.selectcontainer}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.importheadtext}>Add Waiver Percentage</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography> Project Vendor<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={projOpt}
                                                // isDisabled={fileUploadName != "" && splitArray.length > 0}
                                                value={{ label: waiverPercentageState.projectvendor, value: waiverPercentageState.projectvendor }}
                                                onChange={((e) => {
                                                    setwaiverPercentageState({
                                                        ...waiverPercentageState,
                                                        projectvendor: e.value,
                                                        process: "Please Select Queue Name",
                                                        loginid: "Please Select Login ID",
                                                    })
                                                    fetchClientUserID(e.value);
                                                    // fetchProcessQueue(e.value);
                                                })}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                From Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={waiverPercentageState.fromdate}
                                                onChange={(e) => {
                                                    const newFromDate = e.target.value;
                                                    setwaiverPercentageState((prevState) => ({
                                                        ...prevState,
                                                        fromdate: newFromDate,
                                                        todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                                    }));
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                To Date<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={waiverPercentageState.todate}
                                                onChange={(e) => {
                                                    const selectedToDate = new Date(e.target.value);
                                                    const selectedFromDate = new Date(waiverPercentageState.fromdate);
                                                    const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                                    if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                        setwaiverPercentageState({
                                                            ...waiverPercentageState,
                                                            todate: e.target.value
                                                        });
                                                    } else {
                                                        setwaiverPercentageState({
                                                            ...waiverPercentageState,
                                                            todate: "" // Reset to empty string if the condition fails
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography> Queue Name<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects
                                                maxMenuHeight={300}
                                                options={processOpt}
                                                // isDisabled={fileUploadName != "" && splitArray.length > 0}
                                                value={{ label: waiverPercentageState.queuename, value: waiverPercentageState.queuename }}
                                                onChange={((e) => {
                                                    setwaiverPercentageState({
                                                        ...waiverPercentageState,
                                                        queuename: e.value,
                                                    })
                                                    // fetchClientUserID(e.value);
                                                    // fetchProcessQueue(e.value);
                                                })}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <Divider />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={6}>
                                        <Button variant="contained" color="success" disabled={
                                            waiverPercentageState.loginid !== "Please Select Login ID" ||
                                            waiverPercentageState.percentage != ""
                                        } sx={{ textTransform: "Capitalize" }} onClick={(e) => ExportsHead()}>
                                            <FaDownload />
                                            &ensp;Download template file
                                        </Button>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={6} xs={12} sm={6} marginTop={3}>
                                        <Grid container spacing={2}>
                                            <Grid item md={4.5} xs={12} sm={6}>
                                                <Button variant="contained" disabled={
                                                    waiverPercentageState.loginid !== "Please Select Login ID" ||
                                                    waiverPercentageState.percentage != ""
                                                } component="label" sx={{ textTransform: "capitalize" }}>
                                                    Choose File
                                                    <input
                                                        hidden
                                                        type="file"
                                                        accept=".xlsx, .xls , .csv"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            setDataupdated("uploaded");
                                                            readExcel(file);
                                                            setSheets([]);
                                                            setFileUploadName(file.name);
                                                            e.target.value = null;
                                                        }}
                                                    />
                                                </Button>
                                            </Grid>
                                            <Grid item md={6.5} xs={12} sm={6}>
                                                {fileUploadName != "" && splitArray.length > 0 ? (
                                                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                                                        <p>{fileUploadName}</p>
                                                        <Button sx={{ minWidth: "36px", borderRadius: "50%" }} onClick={() => clearFileSelection()}>
                                                            <FaTrash style={{ color: "red" }} />
                                                        </Button>
                                                    </Box>
                                                ) : null}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={1.5} xs={12} sm={8} marginTop={3}>
                                        <Button variant="contained" color="primary" disabled={
                                            waiverPercentageState.loginid !== "Please Select Login ID" ||
                                            waiverPercentageState.percentage != ""
                                        } onClick={getSheetExcel} sx={{ textTransform: "capitalize" }}>
                                            Get Sheet
                                        </Button>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Sheet</Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={sheets.filter(d => !updateSheet.includes(d.index))}
                                                value={{ label: selectedSheet, value: selectedSheet }}
                                                onChange={(e) => {
                                                    setSelectedSheet(e.value);
                                                    setSelectedSheetindex(e.index);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <Divider />
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Grid container>
                                            <Grid item md={5} xs={12} sm={6}>
                                                <Typography>Login ID<b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                            <Grid item md={7} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        maxMenuHeight={300}
                                                        options={loginIdOpt}
                                                        isDisabled={fileUploadName != "" && splitArray.length > 0}
                                                        value={{ label: waiverPercentageState.loginid, value: waiverPercentageState.loginid }}
                                                        onChange={((e) => {
                                                            setwaiverPercentageState({
                                                                ...waiverPercentageState,
                                                                loginid: e.value
                                                            })
                                                        })}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Grid container>
                                            <Grid item md={5} xs={12} sm={6}>
                                                <Typography>Percentage<b style={{ color: "red" }}>*</b></Typography>
                                            </Grid>
                                            <Grid item md={7} xs={12} sm={6}>
                                                <FormControl fullWidth size="small">
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter Percentage"
                                                        disabled={fileUploadName != "" && splitArray.length > 0}
                                                        value={waiverPercentageState.percentage}
                                                        onChange={(e) => {
                                                            const enteredValue = e.target.value.replace(/[^\d.]/g, "");
                                                            if (enteredValue === "" || /^\d*\.?\d*$/.test(enteredValue)) {
                                                                if ((enteredValue.match(/\./g) || []).length <= 1) {
                                                                    setwaiverPercentageState({
                                                                        ...waiverPercentageState,
                                                                        percentage: enteredValue
                                                                    })
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={4} xs={12} sm={6}>
                                        <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                            {!loading ? (
                                                fileUploadName != "" && splitArray.length > 0 ? (
                                                    <>
                                                        <div readExcel={readExcel}>
                                                            <SendToServer sendJSON={sendJSON} />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Button variant="contained"
                                                        onClick={handleSubmit}
                                                        disabled={isDisabledBtn}
                                                        sx={buttonStyles.buttonsubmit}
                                                    >
                                                        Submit
                                                    </Button>
                                                )
                                            ) : (
                                                <LoadingButton
                                                    // onClick={handleClick}
                                                    loading={loading}
                                                    loadingPosition="start"
                                                    variant="contained"
                                                >
                                                    <span>Send</span>
                                                </LoadingButton>
                                            )}
                                            <Button sx={buttonStyles.btncancel}
                                                onClick={handleClear}
                                            >
                                                CLEAR
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>


                            </>
                        </Box>
                    )}
                </>
            }
            <br /> <br />
            {/* ****** Table Start ****** */}
            {loader ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (<>
                {isUserRoleCompare?.includes("lwaiverpercentageupload") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Upload File List</Typography>
                            </Grid>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSizeFilename}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChangeFilename}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={targetPointsFilename?.length}>All</MenuItem>
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
                                        {isUserRoleCompare?.includes("excelwaiverpercentageupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    fetchTargetPointsDataOverall()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvwaiverpercentageupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    fetchTargetPointsDataOverall()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printwaiverpercentageupload") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintFilename}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfwaiverpercentageupload") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                        fetchTargetPointsDataOverall()
                                                    }}>
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagewaiverpercentageupload") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFilename}>
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar columnDataTable={columnDataTableFilename} setItems={setItemsFilename} addSerialNumber={addSerialNumberFilename} setPage={setPageFilename} maindatas={targetPointsFilename} setSearchedString={setSearchedStringFilename}
                                        searchQuery={searchQueryFilename}
                                        setSearchQuery={setSearchQueryFilename}
                                        paginated={false}
                                        totalDatas={overallItemsFilename}

                                    />
                                </Grid>
                            </Grid>

                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFilename}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFilename}>
                                Manage Columns
                            </Button>
                            <Popover
                                id={id}
                                open={isManageColumnsOpenFilename}
                                anchorElFilename={anchorElFilename}
                                onClose={handleCloseManageColumnsFilename}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                            >
                                {manageColumnsContentFilename}
                            </Popover>
                            &ensp;
                            {/* <Button variant="contained" color="error" size="small" sx={{ textTransform: "capitalize" }} onClick={handleClickOpenalert}>
              Bulk Delete
            </Button> */}
                            <br />
                            <br />
                            {!tableOneLoader ? (
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
                                <AggridTable
                                    rowDataTable={rowDataTableFilename}
                                    columnDataTable={columnDataTableFilename}
                                    columnVisibility={columnVisibilityFilename}
                                    page={pageFilename}
                                    setPage={setPageFilename}
                                    pageSize={pageSizeFilename}
                                    totalPages={totalPagesFilename}
                                    setColumnVisibility={setColumnVisibilityFilename}
                                    isHandleChange={isHandleChangeFilename}
                                    items={itemsFilename}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefFilename}
                                    paginated={false}
                                    filteredDatas={filteredDatasFilename}
                                    handleShowAllColumns={handleShowAllColumnsFilename}
                                    setFilteredRowData={setFilteredRowDataFilename}
                                    filteredRowData={filteredRowDataFilename}
                                    setFilteredChanges={setFilteredChangesFilename}
                                    filteredChanges={filteredChangesFilename}
                                    gridRefTableImg={gridRefTableImgFilename}
                                    itemsList={overallItemsFilename}
                                />
                            )
                            }

                            {/* ****** Table End ****** */}
                        </Box>
                    </>
                )}
            </>)
            }
            {/* ****** Table End ****** */}
            <br /> <br />
            {/* ****** Table Start ****** */}
            {
                loader ? (
                    <Box sx={userStyle.container}>
                        <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </Box>
                ) : (<>
                    {isUserRoleCompare?.includes("lwaiverpercentageupload") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Wavier percentage List</Typography>
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
                                                <MenuItem value={targetPoints?.length}>All</MenuItem>
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
                                            {isUserRoleCompare?.includes("excelwaiverpercentageupload") && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen1(true)
                                                        fetchTargetPointsDataOverall()
                                                        setFormat("xl")
                                                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvwaiverpercentageupload") && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen1(true)
                                                        fetchTargetPointsDataOverall()
                                                        setFormat("csv")
                                                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printwaiverpercentageupload") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfwaiverpercentageupload") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpen1(true)
                                                            fetchTargetPointsDataOverall()
                                                        }}>
                                                        <FaFilePdf />
                                                        &ensp;Export to PDF&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("imagewaiverpercentageupload") && (
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item md={2} xs={12} sm={12}>
                                        <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={targetPoints} setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={overallItems}
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
                                &ensp;
                                {isUserRoleCompare?.includes("bdwaiverpercentageupload") && (
                                    <Button variant="contained" color="error" sx={buttonStyles.buttonbulkdelete} size="small" onClick={handleClickOpenalert} >
                                        Bulk Delete
                                    </Button>)}
                                <br />
                                <br />
                                {!tableTwoLoader ? (
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
                                        gridRefTable={gridRef}
                                        paginated={false}
                                        filteredDatas={filteredDatas}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={overallItems}
                                    />
                                )
                                }

                                {/* ****** Table End ****** */}
                            </Box>
                        </>
                    )}
                </>)
            }
            {/* ****** Table End ****** */}
            {/* print layout */}
            {/* <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Project Vendor Name</TableCell>
                            <TableCell>From Date</TableCell>
                            <TableCell>To Date</TableCell>
                            <TableCell>Login ID</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.projectvendor}</TableCell>
                                    <TableCell>{row.fromdate}</TableCell>
                                    <TableCell>{row.todate}</TableCell>
                                    <TableCell>{row.loginid}</TableCell>
                                    <TableCell>{row.queuename}</TableCell>
                                    <TableCell>{row.percentage}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
            {/* print layout filename */}
            {/* <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRefFilename}>
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>From Date</TableCell>
                            <TableCell>To Date</TableCell>
                            <TableCell>Project Vendor</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>File Name</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Created Date & Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableFilename &&
                            rowDataTableFilename.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.fromdate}</TableCell>
                                    <TableCell>{row.todate}</TableCell>
                                    <TableCell>{row.projectvendor}</TableCell>
                                    <TableCell>{row.queuename}</TableCell>
                                    <TableCell>{row.filename}</TableCell>
                                    <TableCell>{row.createdby}</TableCell>
                                    <TableCell>{row.createddate}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
            {/* this is info view details */}
            {/* <Dialog open={openInfo} onClose={handleCloseinfo} maxWidth="sm" fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent>
                    <Typography sx={userStyle.HeaderText}>Waiver Percentage Info</Typography>
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">addedby</Typography>
                                <br />
                                <Table>
                                    <TableHead>
                                        <StyledTableRow>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {infosingleData.addedby?.map((item, i) => (
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
                                        {infosingleData.updatedby?.map((item, i) => (
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
                    <DialogActions>
                        <Button variant="contained" onClick={handleCloseinfo}>
                            Back
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog> */}
            {/*DELETE ALERT DIALOG */}
            {/* <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                    <Button autoFocus variant="contained" color="error" onClick={(e) => deleteFilenameList()}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            {/*DELETE sigle ALERT DIALOG 
            <Dialog open={isDeleteSingleOpen} onClose={handleCloseSingleMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseSingleMod}
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
                    <Button autoFocus variant="contained" color="error" onClick={(e) => deleteSingleList()}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog> */}
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={6}>
                            <Typography sx={userStyle.HeaderText}>View Waiver Percentage</Typography>
                        </Grid>
                    </Grid>
                    <br /> <br />
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Project Vendor</Typography>
                                <Typography>{viewsingleData?.projectvendor}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">From Date</Typography>
                                <Typography>{moment(viewsingleData?.fromdate).format("DD-MM-YYYY")}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">To Date</Typography>
                                <Typography>{moment(viewsingleData?.todate).format("DD-MM-YYYY")}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Login ID</Typography>
                                <Typography>{viewsingleData?.loginid}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Queue Name</Typography>
                                <Typography>{viewsingleData?.queuename}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Percentage</Typography>
                                <Typography>{viewsingleData?.percentage}</Typography>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                        Back
                    </Button>
                </DialogActions>
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
                            onClick={handleCloseerrUpdate}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                    <Button autoFocus variant="contained" color="error" onClick={(e) => deleteSingleBulkdataDelete(e)}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog> */}
            {/* Edit DIALOG */}
            <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" maxWidth="sm"
                fullWidth={true}
                sx={{
                    overflow: "visible",
                    "& .MuiPaper-root": {
                        overflow: "visible",
                    },
                }}
            >
                <Box sx={{ padding: "30px" }}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={6}>
                                <Typography sx={userStyle.HeaderText}>Edit Waiver Percentage</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={6}>
                                <Typography>Login ID<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl fullWidth size="small">
                                    <Selects
                                        maxMenuHeight={300}
                                        options={loginIdEditOpt}
                                        value={{ label: editWaiverPercentage.loginid, value: editWaiverPercentage.loginid }}
                                        onChange={((e) => {
                                            setEditWaiverPercentage({
                                                ...editWaiverPercentage,
                                                loginid: e.value
                                            })
                                        })}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={6}>
                                <Typography>Percentage<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="Please Enter Percentage"
                                        value={editWaiverPercentage.percentage}
                                        onChange={(e) => {
                                            const enteredValue = e.target.value.replace(/[^\d.]/g, "");
                                            if (enteredValue === "" || /^\d*\.?\d*$/.test(enteredValue)) {
                                                if ((enteredValue.match(/\./g) || []).length <= 1) {
                                                    setEditWaiverPercentage({
                                                        ...editWaiverPercentage,
                                                        percentage: enteredValue
                                                    })
                                                }
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </>
                </Box>
                <DialogActions>
                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                        Update
                    </Button>
                    <Button onClick={handleCloseModEdit} sx={buttonStyles.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {/* print layout 2*/}
            {/* <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRefviewall}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>S.no</TableCell>
                            <TableCell>Project Vendor</TableCell>
                            <TableCell>From Date</TableCell>
                            <TableCell>To Date</TableCell>
                            <TableCell>Login ID</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Percentage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableviewAll &&
                            rowDataTableviewAll.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.projectvendor}</TableCell>
                                    <TableCell>{row.fromdate}</TableCell>
                                    <TableCell>{row.todate}</TableCell>
                                    <TableCell>{row.loginid}</TableCell>
                                    <TableCell>{row.queuename}</TableCell>
                                    <TableCell>{row.percentage}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer> */}
            {/* viewAll model */}
            <Dialog
                open={openviewAll}
                onClose={handleClickOpenviewAll}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
            >
                <DialogContent>
                    <>
                        <Typography sx={userStyle.HeaderText}>{fileNameView}</Typography>
                        {/* <br /> */}
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeviewAll}
                                        size="small"
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeviewAll}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={productionoriginalviewAll?.length}>
                                            All
                                        </MenuItem>
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
                                    {isUserRoleCompare?.includes("excelwaiverpercentageupload") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen2(true)
                                                // fetchMinimumPointDataArray()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvwaiverpercentageupload") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen2(true)
                                                // fetchMinimumPointDataArray()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printwaiverpercentageupload") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleprintviewall}
                                            >
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfwaiverpercentageupload") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen2(true)
                                                    // fetchMinimumPointDataArray()
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagewaiverpercentageupload") && (
                                        <Button
                                            sx={userStyle.buttongrp}
                                            onClick={handleCaptureImageviewall}
                                        >
                                            {" "}
                                            <ImageIcon
                                                sx={{ fontSize: "15px" }}
                                            /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <AggregatedSearchBar columnDataTable={columnDataTableviewAll} setItems={setItemsviewAll} addSerialNumber={addSerialNumberviewAll} setPage={setPageviewAll} maindatas={productionoriginalviewAll} setSearchedString={setSearchedStringviewall}

                                    searchQuery={searchQueryviewAll}
                                    setSearchQuery={setSearchQueryviewAll}
                                    paginated={false}
                                    totalDatas={overallItemsviewall}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            sx={userStyle.buttongrp}
                            onClick={handleShowAllColumnsviewAll}
                        >
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button
                            sx={userStyle.buttongrp}
                            onClick={handleOpenManageColumnsviewAll}
                        >
                            Manage Columns
                        </Button>
                        <br />
                        {/* Manage Column */}
                        <Popover
                            id={idviewall}
                            open={isManageColumnsOpenviewAll}
                            anchorEl={anchorElviewAll}
                            onClose={handleCloseManageColumnsviewAll}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            {manageColumnsContentviewAll}
                        </Popover>
                        {/* <br /> */}
                        {!productionfirstViewCheck ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <FacebookCircularProgress />
                                </Box>
                            </>
                        ) : (
                            <>
                                <AggridTable
                                    rowDataTable={rowDataTableviewAll}
                                    columnDataTable={columnDataTableviewAll}
                                    columnVisibility={columnVisibilityviewAll}
                                    page={pageviewAll}
                                    setPage={setPageviewAll}
                                    pageSize={pageSizeviewAll}
                                    totalPages={totalPagesviewAll}
                                    setColumnVisibility={setColumnVisibilityviewAll}
                                    isHandleChange={isHandleChangeviewall}
                                    items={itemsviewAll}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefviewall}
                                    paginated={false}
                                    filteredDatas={filteredDataviewAlls}
                                    handleShowAllColumns={handleShowAllColumnsviewAll}

                                    setFilteredRowData={setFilteredRowDataviewall}
                                    filteredRowData={filteredRowDataviewall}
                                    setFilteredChanges={setFilteredChangesviewall}
                                    filteredChanges={filteredChangesviewall}
                                    gridRefTableImg={gridRefTableImgviewall}
                                    itemsList={overallItemsviewall}
                                />
                            </>
                        )}
                    </>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCloseviewAll}
                        sx={buttonStyles.btncancel}
                    >
                        Back
                    </Button>
                </DialogActions>
            </Dialog>
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
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={rowDataTableFilename ?? []}
                itemsTwo={targetPointsFilenameOverall ?? []}
                filename={"Upload File List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRefFilename}
            />
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen1}
                handleCloseFilterMod={handleCloseFilterMod1}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen1}
                isPdfFilterOpen={isPdfFilterOpen1}
                setIsPdfFilterOpen={setIsPdfFilterOpen1}
                handleClosePdfFilterMod={handleClosePdfFilterMod1}
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={targetPointsOverall ?? []}
                filename={"Wavier percentage List"}
                exportColumnNames={exportColumnNamesone}
                exportRowValues={exportRowValuesone}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpen2}
                handleCloseFilterMod={handleCloseFilterMod2}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen2}
                isPdfFilterOpen={isPdfFilterOpen2}
                setIsPdfFilterOpen={setIsPdfFilterOpen2}
                handleClosePdfFilterMod={handleClosePdfFilterMod2}
                filteredDataTwo={rowDataTableviewAll ?? []}
                itemsTwo={productionoriginalViewAllOverall ?? []}
                filename={modifiedString}
                exportColumnNames={exportColumnNamestwo}
                exportRowValues={exportRowValuestwo}
                componentRef={componentRefviewall}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Wavier percentage Info"
                addedby={addedby}
                updateby={updateby}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleteFilenameList}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteSingleOpen}
                onClose={handleCloseSingleMod}
                onConfirm={deleteSingleList}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={deleteSingleBulkdataDelete}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />



        </Box >
    );
}
export default Waiverpercentage;