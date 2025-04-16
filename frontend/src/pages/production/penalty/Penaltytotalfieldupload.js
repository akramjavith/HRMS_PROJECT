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
import { saveAs } from "file-saver";
import { CsvBuilder } from "filefy";
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
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
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
import domtoimage from 'dom-to-image';

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
function PenaltyTotalFieldUpload() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [overallItems, setOverallItems] = useState([]);
    const [filteredRowDataViewAll, setFilteredRowDataViewAll] = useState([]);
    const [filteredChangesViewAll, setFilteredChangesViewAll] = useState(null);
    const [overallItemsViewAll, setOverallItemsViewAll] = useState([]);
    const [filteredRowDataFilename, setFilteredRowDataFilename] = useState([]);
    const [filteredChangesFilename, setFilteredChangesFilename] = useState(null);
    const [overallItemsFilename, setOverallItemsFilename] = useState([]);
    const pathname = window.location.pathname;
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [isHandleChangeFilename, setIsHandleChangeFilename] = useState(false);
    const [isHandleChangeviewAll, setIsHandleChangeviewAll] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [searchedStringFilename, setSearchedStringFilename] = useState("")
    const [searchedStringviewAll, setSearchedStringviewAll] = useState("")
    const [updateSheet, setUpdatesheet] = useState([])
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
    // Filter Condition Start
    const [filterUser, setFilterUser] = useState({
        company: "Please Select Company",
        fromdate: moment().format("YYYY-MM-DD"),
        todate: moment().format("YYYY-MM-DD"),
        // todate: today,
        day: "Today"
    });

    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]

    const handleChangeFilterDate = (e) => {
        let fromDate = '';
        let toDate = moment().format('YYYY-MM-DD');
        switch (e.value) {
            case 'Today':
                setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
                break;
            case 'Yesterday':
                fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                toDate = fromDate; // Yesterday’s date
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Week':
                fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Week':
                fromDate = moment().startOf('week').format('YYYY-MM-DD');
                toDate = moment().endOf('week').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Last Month':
                fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
                toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'This Month':
                fromDate = moment().startOf('month').format('YYYY-MM-DD');
                toDate = moment().endOf('month').format('YYYY-MM-DD');
                setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
                break;

            case 'Custom Fields':
                setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
                break;
            default:
                return;
        }
    }
    //End the Filter conditions

    let todayDate = new Date();
    var dd = String(todayDate.getDate()).padStart(2, "0");
    var mm = String(todayDate.getMonth() + 1).padStart(2, "0");
    var yyyy = todayDate.getFullYear();
    let formattedDatetoday = yyyy + "-" + mm + "-" + dd;

    const gridRef = useRef(null);
    const gridRefFilename = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [targetPoints, setTargetPoints] = useState([]);
    const [targetPointsNew, setTargetPointsNew] = useState([]);
    const [targetPointsFilename, setTargetPointsFilename] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const [loaderFirst, setLoaderFirst] = useState(false);
    const [loaderSecond, setLoaderSecond] = useState(false);
    const [fileNameView, setFileNameView] = useState("");
    const [fileNameID, setFileNameID] = useState("");
    const [isDisabled, setIsDisabled] = useState(false)
    const currentDate = new Date();
    const [penaltyTotalfieldUpload, setPenaltyTotalfieldUpload] = useState({
        projectvendor: "Please Select Project Vendor",
        date: formattedDatetoday,
        queuename: "Please Select Queue Name",
        loginid: "Please Select Login ID",
        accuracy: "",
        totalfields: "",
        errorcount: "",
    });
    const [openviewAll, setOpenviewAll] = useState(false);
    const handleClickOpenviewAll = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setOpenviewAll(true);
    };
    const [itemsviewAll, setItemsviewAll] = useState([]);
    const [productionoriginalviewAll, setProductionoriginalViewAll] = useState([]);
    const addSerialNumberviewAll = (datas) => {
        setItemsviewAll(datas);
        // setOverallItemsViewAll(datas);
    };
    useEffect(() => {
        addSerialNumberviewAll(productionoriginalviewAll);
    }, [productionoriginalviewAll]);
    const [searchQueryviewAll, setSearchQueryviewAll] = useState("");
    const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState("");
    const [pageviewAll, setPageviewAll] = useState(1);
    const [pageSizeviewAll, setPageSizeviewAll] = useState(10);
    const [isFilterOpen1, setIsFilterOpen1] = useState(false);
    const [isPdfFilterOpen1, setIsPdfFilterOpen1] = useState(false);
    const [isFilterOpen2, setIsFilterOpen2] = useState(false);
    const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);
    const [isFilterOpen3, setIsFilterOpen3] = useState(false);
    const [isPdfFilterOpen3, setIsPdfFilterOpen3] = useState(false);
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

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Penalty Total Field Upload"),
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

    const initialColumnVisibilityviewAll = {
        serialNumber: true,
        projectvendor: true,
        date: true,
        queuename: true,
        loginid: true,
        accuracy: true,
        totalfields: true,
        errorcount: true,
        autocount: true,
        actions: true
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
    const [isManageColumnsOpenviewAll, setManageColumnsOpenviewAll] = useState(false);
    const [anchorElviewAll, setAnchorElviewAll] = useState(null);
    const handleOpenManageColumnsviewAll = (event) => {
        setAnchorElviewAll(event.currentTarget);
        setManageColumnsOpenviewAll(true);
    };
    const handleCloseManageColumnsviewAll = () => {
        setManageColumnsOpenviewAll(false);
        setSearchQueryManageviewAll("");
    };
    // page refersh reload
    const handleCloseFilterMod1 = () => {
        setIsFilterOpen1(false);
    };
    const handleClosePdfFilterMod1 = () => {
        setIsPdfFilterOpen1(false);
    };
    // page refersh reload
    const handleCloseFilterMod2 = () => {
        setIsFilterOpen2(false);
    };
    const handleClosePdfFilterMod2 = () => {
        setIsPdfFilterOpen2(false);
    };
    // page refersh reload
    const handleCloseFilterMod3 = () => {
        setIsFilterOpen3(false);
    };
    const handleClosePdfFilterMod3 = () => {
        setIsPdfFilterOpen3(false);
    };
    const openviewpopall = Boolean(anchorElviewAll);
    const idviewall = openviewpopall ? "simple-popover" : undefined;
    // datavallist:datavallist,
    const columnDataTableviewAll = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 70,
            hide: !columnVisibilityviewAll.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
            lockPinned: true,
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.projectvendor,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.date,
            headerClassName: "bold-header",
        },
        {
            field: "queuename",
            headerName: "Queue Name",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.queuename,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.loginid,
            headerClassName: "bold-header",
        },
        {
            field: "accuracy",
            headerName: "Accuracy",
            flex: 0,
            width: 130,
            hide: !columnVisibilityviewAll.accuracy,
            headerClassName: "bold-header",
        },
        {
            field: "totalfields",
            headerName: "Total Fields",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.totalfields,
            headerClassName: "bold-header",
        },
        {
            field: "errorcount",
            headerName: "Error Count",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.errorcount,
            headerClassName: "bold-header",
        },
        {
            field: "autocount",
            headerName: "Auto Count",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.autocount,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityviewAll.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("epenaltytotalfieldupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleeditView(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dpenaltytotalfieldupload") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDataSingleDeleteView(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                </Grid>
            ),
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
    const [tableOneLoader, setTableOneLoader] = useState(false);
    const [tableTwoLoader, setTableTwoLoader] = useState(false);
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
        date: true,
        queuename: true,
        loginid: true,
        accuracy: true,
        totalfields: true,
        errorcount: true,
        autocount: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const searchTermsviewAll = searchQueryviewAll.toLowerCase().split(" ");
    const filteredDataviewAlls = productionoriginalviewAll?.filter((item) => {
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
    const [productionfirstViewCheck, setProductionfirstViewcheck] = useState(false);
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
    //Edit model...
    const [isEditOpenView, setIsEditOpenView] = useState(false);
    const handleClickOpenEditView = () => {
        setIsEditOpenView(true);
    };
    const handleCloseModEditView = (e, reason) => {
        // if (reason && reason === "backdropClick") return;
        setIsEditOpenView(false);
    };
    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    // info model First Table
    const [openInfoFirst, setOpeninfoFirst] = useState(false);
    const handleClickOpeninfoFirst = () => {
        setOpeninfoFirst(true);
    };
    const handleCloseinfoFirst = () => {
        setOpeninfoFirst(false);
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
    //Delete single model first table view delete
    const [isDeleteSingleOpenView, setIsDeleteSingleOpenView] = useState(false);
    const handleClickSingleOpenView = () => {
        setIsDeleteSingleOpenView(true);
    };
    const handleCloseSingleModView = () => {
        setIsDeleteSingleOpenView(false);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [processOpt, setProcessQueueArray] = useState([])
    //get all client user id.
    const fetchProcessQueue = async (projname) => {

        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const processFilter = res_freq?.data?.productionprocessqueue.filter((item) => item.projectvendor === projname)
            const Que = processFilter.map((t) => ({
                label: t.processqueue,
                value: t.processqueue
            }))
            setProcessQueueArray(Que);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [processOptEdit, setProcessQueueArrayEdit] = useState([])
    //get all client user id.
    const fetchProcessQueueEdit = async (projname) => {
        const projName = projname?.split("-")[0]
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const processFilter = res_freq?.data?.productionprocessqueue.filter((item) => item.projectvendor === projname)

            const Que = processFilter.map((t) => ({
                label: t.processqueue,
                value: t.processqueue
            }))
            setProcessQueueArrayEdit(Que);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [loginIdOpt, setClientLoginIDOpt] = useState([])
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [loginIdOptEdit, setClientLoginIDOptEdit] = useState([])
    //get all client user id.
    const fetchClientUserIDEdit = async (proj) => {
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
            setClientLoginIDOptEdit(loginIdOpt);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const fetchTargetPointsData = async () => {
        setPageName(!pageName)

        try {
            let Res = await axios.get(SERVICE.PENALTYTOTALFIELDUPLOAD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTargetPointsNew(Res?.data?.penaltytotalfielduploads)
            setTargetPoints(Res?.data?.penaltytotalfielduploads?.filter((item) => item.accuracy !== "NA").map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                olddate: item.date,
                date: moment(item.date).format('DD-MM-YYYY')
            })));
            // setTableTwoLoader(true);
            let getFilenames = Res?.data?.penaltytotalfielduploads.filter((item) => item.filename !== "nonexcel");
            const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
                return getFilenames.find((obj) => obj.filename === filename);
            });
            // const uniqueArray = Array.from(new Set(getFilenames));
            setTargetPointsFilename(uniqueArray.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                createdby: item.addedby[0].name,
                createddate: moment(item.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
            })));
            // setTableOneLoader(true);
        } catch (err) {

            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

    };
    const [targetPointsFilenameArray, setTargetPointsFilenameArray] = useState([])
    const fetchTargetPointsData1 = async () => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.PENALTYTOTALFIELDUPLOAD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            //     // setTargetPoints(Res?.data?.penaltytotalfielduploads.map((item, index) => ({
            //     ...item,
            //     serialNumber: index + 1,
            // })));
            let getFilenames = Res?.data?.penaltytotalfielduploads.filter((item) => item.filename !== "nonexcel");
            const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
                return getFilenames.find((obj) => obj.filename === filename);
            });
            // const uniqueArray = Array.from(new Set(getFilenames));
            setTargetPointsFilenameArray(uniqueArray.map((row, index) => ({
                ...row,
                serialNumber: index + 1,
                createdby: row.addedby[0].name,
                createddate: moment(row.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
                fromdate: moment(row.fromdate).format("DD-MM-YYYY"),
                todate: moment(row.todate).format("DD-MM-YYYY")
            })));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // useEffect(() => {
    //     fetchTargetPointsData1();
    // }, [isFilterOpen1])
    const [targetPointsFilenameArray2, setTargetPointsFilenameArray2] = useState([])
    const fetchTargetPointsData2 = async () => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.PENALTYTOTALFIELDUPLOAD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getFilenames = Res?.data?.penaltytotalfielduploads.filter((item) => item.filename !== "nonexcel");
            const uniqueArray = Array.from(new Set(getFilenames));
            setTargetPointsFilenameArray2(Res?.data?.penaltytotalfielduploads);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    // useEffect(() => {
    //     fetchTargetPointsData2();
    // }, [isFilterOpen2])
    useEffect(() => {
        getProject();
        // fetchTargetPointsData();
    }, []);
    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = targetPoints?.some((item) =>
            item.projectvendor == penaltyTotalfieldUpload.projectvendor &&
            // item.olddate == penaltyTotalfieldUpload.date &&
            item.queuename == penaltyTotalfieldUpload.queuename &&
            item.loginid == penaltyTotalfieldUpload.loginid
            &&
            item.accuracy == penaltyTotalfieldUpload.accuracy &&
            item.totalfields == penaltyTotalfieldUpload.totalfields &&
            item.errorcount == penaltyTotalfieldUpload.errorcount
        )
        if (penaltyTotalfieldUpload.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (penaltyTotalfieldUpload.date === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyTotalfieldUpload.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (penaltyTotalfieldUpload.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }

        else if (penaltyTotalfieldUpload.accuracy === "") {
            setPopupContentMalert("Please Enter Accuracy");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyTotalfieldUpload.totalfields === "") {
            setPopupContentMalert("Please Enter Total Fields");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyTotalfieldUpload.errorcount === "") {
            setPopupContentMalert("Please Enter Error Count");
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
            setSearchQueryFilename("")
            setSearchQueryviewAll("")
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
    const exportColumnNames3 = [
        'Project Vendor', 'Date',
        'Queue Name', 'Login ID',
        'Accuracy', 'Total Fields', 'Error Count', 'Auto Count'
    ]
    const exportRowValues3 = [
        'projectvendor', 'date',
        'queuename', 'loginid',
        'accuracy', 'totalfields', 'errorcount', 'autocount'
    ]
    const modifiedString = fileNameView?.replace(".csv", "");
    const gridRefviewall = useRef(null);

    const gridRefTableImgviewall = useRef(null);
    // image
    const handleCaptureImageviewall = () => {
        if (gridRefTableImgviewall.current) {
            domtoimage.toBlob(gridRefTableImgviewall.current)
                .then((blob) => {
                    saveAs(blob, "Penalty Total Field Upload.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const rowDataTableviewAll = filteredDataviewAll.map((item, index) => {
        const formattedDate = formatDate(item.date);
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            date: formattedDate,
            queuename: item.queuename,
            loginid: item.loginid,
            accuracy: item.accuracy,
            totalfields: item.totalfields,
            errorcount: item.errorcount,
            autocount: typeof item.autocount === 'number'
                ? parseFloat(item.autocount.toFixed(2)).toString()
                : item.autocount,

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
    const [isBtn, setIsBtn] = useState(false)
    //add function...
    const sendRequest = async () => {
        setLoader(true)
        setIsBtn(true)
        setPageName(!pageName)
        try {
            let res = await axios.post(SERVICE.PENALTYTOTALFIELDUPLOAD_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: String(penaltyTotalfieldUpload.projectvendor),
                date: String(penaltyTotalfieldUpload.date),
                // date: String(formattedDatetoday),

                queuename: String(penaltyTotalfieldUpload.queuename),
                loginid: String(penaltyTotalfieldUpload.loginid),
                accuracy: String(penaltyTotalfieldUpload.accuracy),
                totalfields: String(penaltyTotalfieldUpload.totalfields),
                errorcount: String(penaltyTotalfieldUpload.errorcount),
                autocount: String(Number(penaltyTotalfieldUpload.autocount)?.toFixed(0)),
                filename: "nonexcel",
                manulerror: 0,
                isedited: false,
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTargetPointsData();
            setPenaltyTotalfieldUpload({ ...penaltyTotalfieldUpload, experience: "", processcode: "", code: "", points: "" });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)
            setIsBtn(false)
        } catch (err) { setLoader(false); setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const handleClear = (e) => {
        e.preventDefault();
        setFileUploadName("");
        setSplitArray([]);
        // readExcel(null);
        setDataupdated("");
        setSheets([]);
        setProcessQueueArray([]);
        setClientLoginIDOpt([]);
        setSelectedSheet("Please Select Sheet");
        setPenaltyTotalfieldUpload({
            ...penaltyTotalfieldUpload,
            projectvendor: "Please Select Project Vendor",
            date: formattedDatetoday,
            queuename: "Please Select Queue Name",
            loginid: "Please Select Login ID",
            accuracy: "",
            totalfields: "",
            errorcount: "",
        });
        setSearchQuery("")
        setSearchQueryFilename("")
        setSearchQueryviewAll("")
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();

    };
    //delete singledata functionality
    const [deletesingleData, setDeletesingledata] = useState();
    const [deletesingleDataView, setDeletesingledataView] = useState();
    const rowDataSingleDelete = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeletesingledata(Res?.data?.spenaltytotalfieldupload);
            handleClickSingleOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const rowDataSingleDeleteView = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeletesingledataView(Res?.data?.spenaltytotalfieldupload);
            handleClickSingleOpenView();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const deleteSingleList = async () => {
        setLoader(true)
        let deleteSingleid = deletesingleData?._id;
        setPageName(!pageName)
        try {
            const deletePromises = await axios.delete(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${deleteSingleid}`, {
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
        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const deleteSingleListView = async () => {
        setLoader(true)
        let deleteSingleid = deletesingleDataView?._id;
        setPageName(!pageName)
        try {
            const deletePromises = await axios.delete(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${deleteSingleid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleCloseSingleModView();
            setPage(1);
            await getviewCodeall(deletesingleDataView.filename)
            await fetchTargetPointsData();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const deleteSingleBulkdataDelete = async () => {
        setLoader(true)
        setPageName(!pageName)
        try {
            const deletePromises = await axios.post(
                SERVICE.MULTIPLEPENALTYTOTALFIELDUPLOAD_SINGLE,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    ids: [...selectedRows],
                }
            );
            if (deletePromises?.data?.success) {
                await fetchTargetPointsData();
                setLoader(false)
                handleCloseModcheckbox();
                setSelectedRows([]);
                setSelectAllChecked(false);
                setPage(1);
                setIsHandleChange(false);
                setPopupContent("Deleted Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
            } else {
                setLoader(false)
                handleCloseModcheckbox();
                setSelectedRows([]);
                setSelectAllChecked(false);
                setPage(1);
                await fetchTargetPointsData();
            }
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    //edit get data functionality single list
    const [editsingleData, setEditsingleData] = useState({
        projectvendor: "Please Select Project Vendor",
        date: "",
        queuename: "Please Select Queue Name",
        loginid: "Please Select Login ID",
        accuracy: "",
        totalfields: "",
        errorcount: "",
    });
    const [viewsingleData, setviewsingleData] = useState({ experience: "", processcode: "", code: "", points: "" });
    const [infosingleData, setinfosingleData] = useState({ experience: "", processcode: "", code: "", points: "" });
    const [penaltyArray, setPenaltyArray] = useState([])
    const fetchTargetPointsAllData = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.PENALTYTOTALFIELDUPLOAD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getArray = Res?.data?.penaltytotalfielduploads.filter((item) => item._id !== id);
            setPenaltyArray(getArray)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    //first  table view
    const rowdatasingleeditView = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const prevData = Res?.data?.spenaltytotalfieldupload;
            // Check if prevData exists before attempting to update it
            if (prevData) {
                // Update the date property using moment to format it
                const updatedDate = moment(prevData.date, "DD-MM-YYYY").format("YYYY-MM-DD");
                // Use the spread operator to create a new object with updated date property
                const updatedData = {
                    ...prevData,
                    // date: updatedDate
                };
                fetchClientUserIDEdit(updatedData.projectvendor);
                fetchProcessQueueEdit(updatedData.projectvendor);
                // Update the state with the new object
                setEditsingleData(updatedData);
            }
            fetchTargetPointsAllData(id);
            handleClickOpenEditView();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //second table 
    const rowdatasingleedit = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const prevData = Res?.data?.spenaltytotalfieldupload;
            // Check if prevData exists before attempting to update it
            if (prevData) {
                // Update the date property using moment to format it
                const updatedDate = moment(prevData.date, "DD-MM-YYYY").format("YYYY-MM-DD");
                // Use the spread operator to create a new object with updated date property
                const updatedData = {
                    ...prevData,
                    // date: updatedDate
                };
                fetchClientUserIDEdit(updatedData.projectvendor);
                fetchProcessQueueEdit(updatedData.projectvendor);
                // Update the state with the new object
                setEditsingleData(updatedData);
            }
            fetchTargetPointsAllData(id);
            handleClickOpenEdit();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [formattedViewDate, setViewDate] = useState("")
    const rowdatasingleview = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setviewsingleData(Res?.data?.spenaltytotalfieldupload);
            setViewDate(formatDate(Res?.data?.spenaltytotalfieldupload?.date));
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const rowdatasingleinfo = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setinfosingleData(Res?.data?.spenaltytotalfieldupload);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const editSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = penaltyArray?.some((item) =>
            item.projectvendor == editsingleData.projectvendor &&
            // item.date == editsingleData.date &&
            item.queuename == editsingleData.queuename &&
            item.loginid == editsingleData.loginid
            &&
            item.accuracy == editsingleData.accuracy &&
            item.totalfields == editsingleData.totalfields &&
            item.errorcount == editsingleData.errorcount
        )
        if (editsingleData.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (editsingleData.date == "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (editsingleData.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }

        else if (editsingleData.accuracy == "") {
            setPopupContentMalert("Please Enter Accuracy");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.totalfields == "") {
            setPopupContentMalert("Please Enter Total Fields");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.errorcount == "") {
            setPopupContentMalert("Please Enter Error Count");
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
    const editSubmitView = (e) => {
        e.preventDefault();
        const isNameMatch = penaltyArray?.some((item) =>
            item.projectvendor == editsingleData.projectvendor &&
            // item.date == editsingleData.date &&
            item.queuename == editsingleData.queuename &&
            item.loginid == editsingleData.loginid &&
            item.accuracy == editsingleData.accuracy &&
            item.totalfields == editsingleData.totalfields &&
            item.errorcount == editsingleData.errorcount
        )
        if (editsingleData.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (editsingleData.date == "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (editsingleData.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }

        else if (editsingleData.accuracy == "") {
            setPopupContentMalert("Please Enter Accuracy");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.totalfields == "") {
            setPopupContentMalert("Please Enter Total Fields");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.errorcount == "") {
            setPopupContentMalert("Please Enter Error Count");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequestView();
        }
    };

    let updateby = infosingleData.updatedby;
    let addedby = infosingleData.addedby;

    const sendEditRequest = async () => {
        setLoader(true)
        let editid = editsingleData._id;
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${editid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: String(editsingleData.projectvendor),
                // date: String(moment(editsingleData.date).format("DD-MM-YYYY")),
                date: String(editsingleData.date),
                queuename: String(editsingleData.queuename),
                loginid: String(editsingleData.loginid),
                accuracy: String(editsingleData.accuracy),
                totalfields: String(editsingleData.totalfields),
                errorcount: String(editsingleData.errorcount),
                autocount: String(Number(editsingleData.autocount)?.toFixed(0)),
                updatedby: [
                    {
                        ...updateby,
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTargetPointsData();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const sendEditRequestView = async () => {
        setLoader(true)
        let editid = editsingleData._id;
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${editid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: String(editsingleData.projectvendor),
                // date: String(moment(editsingleData.date).format("DD-MM-YYYY")),
                date: String(editsingleData.date),
                queuename: String(editsingleData.queuename),
                loginid: String(editsingleData.loginid),
                accuracy: String(editsingleData.accuracy),
                totalfields: String(editsingleData.totalfields),
                errorcount: String(editsingleData.errorcount),
                autocount: String(Number(editsingleData.autocount)?.toFixed(0)),
                updatedby: [
                    {
                        ...updateby,
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await getviewCodeall(editsingleData.filename);
            await fetchTargetPointsData();

            handleCloseModEditView();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Penalty Total Field Upload.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // pdf.....
    const exportColumnNames2 = [
        'Project Vendor', 'Date', 'Queue Name',
        'Login ID', 'Accuracy', 'Total Fields',
        'Error Count', 'Auto Count'
    ]
    const exportRowValues2 = [
        'projectvendor', 'date', 'queuename',
        'loginid', 'accuracy', 'totalfields',
        'errorcount', 'autocount'
    ]
    // Excel
    const fileName = "Penalty Total Field Upload";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Penalty Total Field List",
        pageStyle: "print",
    });
    //serial no for listing items
    const addSerialNumber = (datas) => {
        setItems(datas);
        // setOverallItems(datas);
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
            headerName: "Project Vendor",
            flex: 0,
            width: 130,
            hide: !columnVisibility.projectvendor,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 130,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "queuename",
            headerName: "Queue Name",
            flex: 0,
            width: 130,
            hide: !columnVisibility.queuename,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 130,
            hide: !columnVisibility.loginid,
            headerClassName: "bold-header",
        },
        {
            field: "accuracy",
            headerName: "Accuracy",
            flex: 0,
            width: 150,
            hide: !columnVisibility.accuracy,
            headerClassName: "bold-header",
        },
        {
            field: "totalfields",
            headerName: "Total Fields",
            flex: 0,
            width: 150,
            hide: !columnVisibility.totalfields,
            headerClassName: "bold-header",
        },
        {
            field: "errorcount",
            headerName: "Error Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.errorcount,
            headerClassName: "bold-header",
        },
        {
            field: "autocount",
            headerName: "Auto Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.autocount,
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
                    {isUserRoleCompare?.includes("epenaltytotalfieldupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleedit(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dpenaltytotalfieldupload") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDataSingleDelete(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpenaltytotalfieldupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleview(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ipenaltytotalfieldupload") && (
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
        const formattedDate = formatDate(item.date);
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            date: formattedDate,
            queuename: item.queuename,
            loginid: item.loginid,
            olddate: item.olddate,
            // accuracy: item.accuracy,
            accuracy: item.accuracy ? (parseFloat(item.accuracy) % 1 === 0 ? parseFloat(item.accuracy).toFixed(0) : parseFloat(item.accuracy).toFixed(2)) : "0",
            totalfields: item.totalfields,
            errorcount: item.errorcount,
            // autocount: typeof item.autocount === 'number' ? item.autocount.toFixed(2) : item.autocount,
            autocount: typeof item.autocount === 'number'
                ? parseFloat(item.autocount.toFixed(2)).toString()
                : item.autocount,
        };
    });
    function formatDate(dateString) {
        if (!dateString) {
            return ''; // Return an empty string or handle the error as needed
        }
        const dateParts = dateString.split('-');
        if (dateParts.length !== 3) {
            return ''; // Return an empty string or handle the error as needed
        }
        const formattedDay = dateParts[0]?.padStart(2, '0');
        const formattedMonth = dateParts[1]?.padStart(2, '0');
        const formattedYear = dateParts[2];
        return `${formattedDay}-${formattedMonth}-${formattedYear}`;
    }
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
    const [filenameDataArray3, setFilenameDataArray3] = useState([])

    // get single row to view....
    const getviewCodeall = async (filename) => {
        setPageName(!pageName)
        try {
            setProductionfirstViewcheck(false);
            let res = await axios.get(SERVICE.PENALTYTOTALFIELDUPLOAD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // let getFilenames = res?.data?.penaltytotalfielduploads.filter((item) => item.filename === filename)
            let getFilenames = res?.data?.penaltytotalfielduploads.filter((item) => item.filename === filename && item.accuracy !== 'NA')
            // .map((item) => item._id);
            setProductionoriginalViewAll(getFilenames?.map(
                (item, index) => ({
                    ...item,
                    serialNumber: index + 1,
                    date: moment(item.date).format('DD-MM-YYYY'),
                    accuracy: item.accuracy ? (parseFloat(item.accuracy) % 1 === 0 ? parseFloat(item.accuracy).toFixed(0) : parseFloat(item.accuracy).toFixed(2)) : "0",

                })
            ));
            setFilenameDataArray3(getFilenames.map((item, index) => {
                const formattedDate = formatDate(item.date);
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    projectvendor: item.projectvendor,
                    date: formattedDate,
                    queuename: item.queuename,
                    loginid: item.loginid,
                    // accuracy: item.accuracy,
                    accuracy: item.accuracy ? (parseFloat(item.accuracy) % 1 === 0 ? parseFloat(item.accuracy).toFixed(0) : parseFloat(item.accuracy).toFixed(2)) : "0",
                    totalfields: item.totalfields,
                    errorcount: item.errorcount,
                    autocount: item.autocount,
                };
            }))
            setFileNameView(filename);
            handleClickOpenviewAll();
            // setFileNameID(res?.data?.sdaypointsupload?._id);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); } finally {
            setProductionfirstViewcheck(true);
            setPageviewAll(1);
            setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
        }
    };
    const rowdatasingleinfoFirst = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setinfosingleData(Res?.data?.spenaltytotalfieldupload);
            handleClickOpeninfoFirst();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [deleteFilenameData, setDeletefilenamedata] = useState([]);
    const rowDatafileNameDelete = async (filename) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.PENALTYTOTALFIELDUPLOAD, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getFilenames = Res?.data?.penaltytotalfielduploads.filter((item) => item.filename === filename).map((item) => item._id);
            setDeletefilenamedata(getFilenames);
            handleClickOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const deleteFilenameList = async () => {
        setPageName(!pageName)
        try {
            if (deleteFilenameData.length != 0) {
                setLoader(true);
                const deletePromises = await axios.post(
                    SERVICE.MULTIPLEPENALTYTOTALFIELDUPLOAD_SINGLE,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        ids: deleteFilenameData,
                    }
                );
                if (deletePromises?.data?.success) {
                    handleCloseMod();
                    setPage(1);
                    setPopupContent("Deleted Successfully");
                    setPopupSeverity("success");
                    handleClickOpenPopup();
                    await fetchTargetPointsData();
                    setLoader(false)
                } else {
                    setLoader(false)
                    handleCloseMod();
                    setSelectedRows([]);
                    setSelectAllChecked(false);
                    setPage(1);
                    await fetchTargetPointsData();
                }
            }
        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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

    const gridRefTableImgFilename = useRef(null);
    // image
    const handleCaptureImageFilename = () => {
        if (gridRefTableImgFilename.current) {
            domtoimage.toBlob(gridRefTableImgFilename.current)
                .then((blob) => {
                    saveAs(blob, "Penalty Total Field Upload.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    const exportColumnNames = [
        'Project Vendor',
        'Queue Name',
        'File Name',
        'Created By',
        'Created Date & Time'
    ]
    const exportRowValues = [
        'projectvendor',
        'queuename',
        'filename',
        'createdby',
        'createddate'
    ]

    //print...
    const componentRefFilename = useRef();
    const handleprintFilename = useReactToPrint({
        content: () => componentRefFilename.current,
        documentTitle: "Upload List",
        pageStyle: "print",
    });
    //serial no for listing itemsFilename
    const addSerialNumberFilename = (datas) => {
        setItemsFilename(datas);
        // setOverallItemsFilename(datas);
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
            width: 90,
            hide: !columnVisibilityFilename.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibilityFilename.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "projectvendor",
            headerName: "Project Vendor",
            flex: 0,
            width: 180,
            hide: !columnVisibilityFilename.projectvendor,
            headerClassName: "bold-header",
        },
        {
            field: "queuename",
            headerName: "Queue Name",
            flex: 0,
            width: 180,
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
            width: 180,
            hide: !columnVisibilityFilename.createdby,
            headerClassName: "bold-header",
        },
        {
            field: "createddate",
            headerName: "Created Date & Time",
            flex: 0,
            width: 230,
            hide: !columnVisibilityFilename.createddate,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibilityFilename.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("dpenaltytotalfieldupload") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDatafileNameDelete(params.data.filename);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vpenaltytotalfieldupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeall(params.data.filename);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ipenaltytotalfieldupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleinfoFirst(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid>
            ),
        },
    ];
    const rowDataTableFilename = FilenameFilename.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            queuename: item.queuename,
            filename: item.filename,
            createdby: item.addedby[0].name,
            createddate: moment(item.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
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
        // Define accepted file extensions
        const acceptedExtensions = ['csv', 'xlsx', 'xls'];
        // Define required columns
        const requiredColumns = ["Verifier", "Queue Accuracy", "Queue Total Fields", "Error Count",];
        // Check if the file extension is in the accepted extensions list
        if (!acceptedExtensions.includes(fileExtension) && file !== null) {
            if (!acceptedExtensions.includes(fileExtension) && file !== null) {
                // Handle the case when the file extension is not accepted
                setPopupContentMalert("Upload Excel File");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else { // Corrected the else statement
                const promise = new Promise((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.readAsArrayBuffer(file);
                    fileReader.onload = (e) => {
                        const bufferArray = e.target.result;
                        const wb = XLSX.read(bufferArray, { type: "buffer" });

                        const wsname = wb.SheetNames[0];
                        const ws = wb.Sheets[wsname];
                        // Convert the sheet to JSON
                        const data = XLSX.utils.sheet_to_json(ws);
                        // Check if the required columns are present
                        const missingColumns = requiredColumns.filter(column => !Object.keys(data[0]).includes(column));

                        if (missingColumns.length > 0) {
                            setPopupContentMalert("Required columns are missing");
                            setPopupSeverityMalert("info");
                            handleClickOpenPopupMalert();
                            // Handle the case when required columns are missing
                            reject(new Error("Required columns are missing"));
                            return;
                        }
                        resolve(data);
                    };
                    fileReader.onerror = (error) => {
                        reject(error);
                    };
                });
            }
        }
        else if (penaltyTotalfieldUpload.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (penaltyTotalfieldUpload.date === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyTotalfieldUpload.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else {

            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;
                    const wb = XLSX.read(bufferArray, { type: "buffer", cellDates: true }); // Specify cellDates option
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    // Convert the sheet to JSON, but parse dates manually to avoid UTC conversion
                    const data = XLSX.utils.sheet_to_json(ws, { rawDates: true });
                    // Convert raw dates to a format of your choice, if needed
                    const formattedData = data.map(row => {
                        // Assuming 'Date' is the key for your date column
                        if (row.Date instanceof Date) {
                            // Convert the date to your desired format (e.g., "DD-MM-YYYY")
                            // Modify this format as per your requirement
                            const formattedDate = `${row.Date.getDate()}-${row.Date.getMonth() + 1}-${row.Date.getFullYear()}`;
                            // Replace the original date with the formatted one
                            return { ...row, Date: formattedDate };
                        }
                        return row;
                    });
                    resolve(formattedData);
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
            });

            promise.then((data) => {

                //   if (requiredColumns.length === 0) {
                //     setFileUploadName("");
                //     setPopupContentMalert("No required columns specified.");
                //     setPopupSeverityMalert("info");
                //     handleClickOpenPopupMalert();
                //     return; // Stop further execution
                // }
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
            //  Datefield
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
            var yyyy = today.getFullYear();
            today = dd + "-" + mm + "-" + yyyy;
            // let fileDownloadName = ;
            promise.then((d) => {

                let uniqueArrayfinal = d.filter(item => {
                    const totalFields = item["Queue Total Fields"];
                    const accuracy = !isNaN(item["Queue Accuracy"]) ? (item["Queue Accuracy"] * 100).toFixed(2) : item["Queue Accuracy"]

                    // Automatically calculate Error Count
                    const autoCount = totalFields * (1 - (accuracy / 100));

                    return !targetPoints.some(tp =>
                        tp.projectvendor == penaltyTotalfieldUpload.projectvendor &&
                        // tp.date == penaltyTotalfieldUpload.date && // Use formattedTpDate here
                        tp.queuename == penaltyTotalfieldUpload.queuename &&
                        tp.loginid == item["Verifier"] &&
                        // tp.accuracy == item["Queue Accuracy"] &&
                        // tp.accuracy == accuracy &&
                        // tp.totalfields == item["Queue Total Fields"] &&
                        tp.totalfields == totalFields &&
                        tp.errorcount == item["Error Count"]
                        // && tp.autocount == autoCount
                    );
                });
                if (uniqueArrayfinal.length == 0) {
                    setPopupContent("No Data To Upload");
                    setPopupSeverity("warning");
                    handleClickOpenPopup();
                }
                else if (uniqueArrayfinal.length !== d.length) {
                    setPopupContentMalert(uniqueArrayfinal.length != d.length ? ` Duplicate data and Points field Not a number data's are Removed` : uniqueArrayfinal.length != d.length ? `${d.length - uniqueArrayfinal.length}  Duplicate or data Removed` : ` Data's Points field is Not a Number Removed`);
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
                const dataArray = uniqueArrayfinal.map((item) => {
                    const totalFields = item["Queue Total Fields"];
                    const accuracy = !isNaN(item["Queue Accuracy"]) ? (item["Queue Accuracy"] * 100).toFixed(2) : item["Queue Accuracy"]
                    console.log(accuracy, 'acc')
                    return {
                        projectvendor: penaltyTotalfieldUpload.projectvendor,
                        date: penaltyTotalfieldUpload.date,
                        queuename: penaltyTotalfieldUpload.queuename,
                        loginid: item["Verifier"],
                        accuracy: accuracy,
                        // accuracy: item["Queue Accuracy"],
                        filename: file.name,
                        manualerror: 0,
                        // totalfields: item["Queue Total Fields"],
                        totalfields: totalFields,
                        errorcount: item["Error Count"],
                        autocount: Number(totalFields * (1 - (accuracy / 100)))?.toFixed(0), // Set the calculated autoCount
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    };
                });

                // const subarraySize = 100;
                setUpdatesheet([])
                const subarraySize = 1000;
                const splitedArray = [];
                for (let i = 0; i < dataArray.length; i += subarraySize) {
                    const subarray = dataArray.slice(i, i + subarraySize);
                    splitedArray.push(subarray);
                }
                setSplitArray(splitedArray);
            });
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
        // Ensure that items is an array of objects before sending
        if (selectedSheet === "Please Select Sheet") {
            setPopupContentMalert(fileUploadName === "" ? "Please Upload File" : selectedSheet === "Please Select Sheet" ? "Please Select Sheet" : "No data to upload");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyTotalfieldUpload.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (penaltyTotalfieldUpload.date === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyTotalfieldUpload.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else {
            let uploadExceldata = splitArray[selectedSheetindex];
            let uniqueArrayfinalDup = uploadExceldata.filter((item, index, self) =>
                index === self.findIndex((tp) => (
                    tp.projectvendor == item.projectvendor &&
                    tp.date == item.date &&
                    tp.queuename == item.queuename &&
                    tp.loginid == item.loginid &&
                    tp.accuracy == item.accuracy &&
                    tp.totalfields == item.totalfields &&
                    tp.errorcount == item.errorcount
                ))
            );
            let uniqueArrayfinal = uniqueArrayfinalDup.filter(
                item => !targetPoints.some(tp =>
                    tp.projectvendor == item.projectvendor &&
                    tp.date == item.date &&
                    tp.queuename == item.queuename &&
                    tp.loginid == item.loginid &&
                    tp.accuracy == item.accuracy &&
                    tp.totalfields == item.totalfields &&
                    tp.errorcount == item.errorcount
                )
            );
            let uniqueArray = uniqueArrayfinal.filter((item) => !targetPoints.some((tp) =>
                tp.projectvendor == item.projectvendor &&
                tp.date == item.date &&
                tp.queuename == item.queuename &&
                tp.loginid == item.loginid &&
                tp.accuracy == item.accuracy &&
                tp.totalfields == item.totalfields &&
                tp.errorcount == item.errorcount
            ));
            let dataArray;
            console.log(uniqueArray, 'uniqueArray')
            if (uniqueArrayfinal.length > 0) {
                dataArray = uniqueArray.map((item) => ({
                    projectvendor: item.projectvendor,
                    date: item.date,
                    queuename: item.queuename,
                    loginid: item.loginid,
                    accuracy: item.accuracy,
                    totalfields: item.totalfields,
                    errorcount: item.errorcount,
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
                setLoading(true); // Set loading to true when starting the upload
                xmlhttp.open("POST", SERVICE.PENALTYTOTALFIELDUPLOAD_CREATE);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                if (uniqueArrayfinal.length > 0) {
                    xmlhttp.send(JSON.stringify(uniqueArrayfinalDup));
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
                    setSelectedSheet("Please Select Sheet");
                    setUpdatesheet(prev => [...prev, selectedSheetindex])
                    handleClickOpenPopup();
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
    // today = dd + "-" + mm + "-" + yyyy;
    today = yyyy + "-" + mm + "-" + dd;
    const ExportsHead = () => {
        let fileDownloadName = "Penaltyerrorupload_" + "_" + today;
        if (penaltyTotalfieldUpload.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (penaltyTotalfieldUpload.date === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyTotalfieldUpload.queuename === "Please Select Queue Name") {
            setPopupContentMalert("Please Select Queue Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else {
            new CsvBuilder(fileDownloadName).setColumns(["Verifier", "Queue Accuracy", "Queue Total Fields", "Error Count"], []).exportFile();
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
    const [fileFormat, setFormat] = useState('')

    //get all project.
    const fetchFilterAllData = async () => {
        setPageName(!pageName)
        setLoaderFirst(true);
        setLoaderSecond(true);
        try {
            let res = await axios.post(SERVICE.PENALTYTOTALFIELDUPLOAD_DATEFILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: filterUser.fromdate,
                todate: filterUser.todate
            });

            setLoaderFirst(false);
            setTargetPoints(res?.data?.penaltytotalfielduploaddatefilter.filter((item) => item.accuracy !== "NA").map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                olddate: item.date,
                date: moment(item.date).format('DD-MM-YYYY'),
                accuracy: item.accuracy ? (parseFloat(item.accuracy) % 1 === 0 ? parseFloat(item.accuracy).toFixed(0) : parseFloat(item.accuracy).toFixed(2)) : "0",
            })));
            let getFilenames = res?.data?.penaltytotalfielduploaddatefilter.filter((item) => item.filename !== "nonexcel");
            const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
                return getFilenames.find((obj) => obj.filename === filename);
            });
            setLoaderSecond(false);
            setTargetPointsFilename(uniqueArray.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                createdby: item.addedby[0].name,
                createddate: moment(item.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
            })))
            setTargetPointsFilenameArray(uniqueArray.map((row, index) => ({
                ...row,
                serialNumber: index + 1,
                createdby: row.addedby[0].name,
                createddate: moment(row.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
                fromdate: moment(row.fromdate).format("DD-MM-YYYY"),
                todate: moment(row.todate).format("DD-MM-YYYY")
            })));
            setTargetPointsFilenameArray2(res?.data?.penaltytotalfielduploaddatefilter);
            // setTableOneLoader(true);
        } catch (err) {
            // setTableOneLoader(true); setTableTwoLoader(true);
            setLoaderFirst(false); setLoaderSecond(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleFilterClear = (e) => {
        e.preventDefault();
        setFilterUser({
            fromdate: today,
            todate: today,
            day: "Today"

        });
        setTargetPoints([])
        setTargetPointsFilename([])
        setTargetPointsFilenameArray([])
        setSearchQuery("")
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    return (
        <Box>
            <Headtitle title={"Penalty Total Field Upload"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Penalty Total Field Upload"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Penalty Calculation"
                subsubpagename="Penalty Total Field Upload"
            />
            {isUserRoleCompare?.includes("apenaltytotalfieldupload") && (
                <Box sx={userStyle.selectcontainer}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}> Add Penalty Total Field Upload</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12} sm={6}>
                                <Grid container>
                                    <Grid item md={5} xs={12} sm={6}>
                                        <Typography> Project Vendor<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={projOpt}
                                                value={{ label: penaltyTotalfieldUpload.projectvendor, value: penaltyTotalfieldUpload.projectvendor }}
                                                onChange={((e) => {
                                                    setPenaltyTotalfieldUpload({
                                                        ...penaltyTotalfieldUpload,
                                                        projectvendor: e.value,
                                                        queuename: "Please Select Queue Name",
                                                        loginid: "Please Select Login ID",
                                                    })
                                                    fetchClientUserID(e.value);
                                                    fetchProcessQueue(e.value);
                                                })}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <Grid container>
                                    <Grid item md={5} xs={12} sm={6}>
                                        <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={penaltyTotalfieldUpload.date}
                                                onChange={(e) => {
                                                    setPenaltyTotalfieldUpload({
                                                        ...penaltyTotalfieldUpload,
                                                        date: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <Grid container>
                                    <Grid item md={5} xs={12} sm={6}>
                                        <Typography> Queue Name<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={processOpt}
                                                value={{ label: penaltyTotalfieldUpload.queuename, value: penaltyTotalfieldUpload.queuename }}
                                                onChange={((e) => {
                                                    setPenaltyTotalfieldUpload({
                                                        ...penaltyTotalfieldUpload,
                                                        queuename: e.value,
                                                    })
                                                })}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                        <Divider />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={6}>
                                <Button variant="contained" color="success" disabled={
                                    penaltyTotalfieldUpload.loginid !== "Please Select Login ID" ||
                                    penaltyTotalfieldUpload.accuracy != "" ||
                                    penaltyTotalfieldUpload.totalfields != "" ||
                                    penaltyTotalfieldUpload.errorcount != ""
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
                                            penaltyTotalfieldUpload.loginid !== "Please Select Login ID" ||
                                            penaltyTotalfieldUpload.accuracy != "" ||
                                            penaltyTotalfieldUpload.totalfields != "" ||
                                            penaltyTotalfieldUpload.errorcount != ""
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
                            <Grid item md={2} xs={12} sm={8} marginTop={3}>
                                <Button variant="contained" color="primary" disabled={
                                    penaltyTotalfieldUpload.loginid !== "Please Select Login ID" ||
                                    penaltyTotalfieldUpload.accuracy != "" ||
                                    penaltyTotalfieldUpload.totalfields != "" ||
                                    penaltyTotalfieldUpload.errorcount != ""
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
                                                value={{ label: penaltyTotalfieldUpload.loginid, value: penaltyTotalfieldUpload.loginid }}
                                                onChange={((e) => {
                                                    setPenaltyTotalfieldUpload({
                                                        ...penaltyTotalfieldUpload,
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
                                        <Typography>Accuracy<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text" // Use "text" to control input more finely
                                                inputMode="numeric" // Show numeric keyboard on mobile
                                                pattern="^\d*\.?\d*$" // Only allow whole numbers (no dots or special characters)
                                                sx={userStyle.input}
                                                placeholder="Please Enter Accuracy"
                                                disabled={fileUploadName !== "" && splitArray.length > 0}
                                                value={penaltyTotalfieldUpload.accuracy}
                                                onChange={(e) => {
                                                    const accuracyValue = e.target.value.replace(/[^0-9.]/g, '');
                                                    setPenaltyTotalfieldUpload((prevData) => {
                                                        const newData = { ...prevData, accuracy: accuracyValue };
                                                        // Calculate Auto Count if totalfields and accuracy are available
                                                        if (newData.totalfields && accuracyValue) {
                                                            const autoCount = newData.totalfields * (1 - (accuracyValue / 100));
                                                            newData.autocount = autoCount.toFixed(2); // Set auto count with 2 decimal places
                                                        }
                                                        return newData;
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item md={4} xs={12} sm={6}>
                                <Grid container>
                                    <Grid item md={5} xs={12} sm={6}>
                                        <Typography>Total Fields<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text" // Use "text" to control input more finely
                                                inputMode="numeric" // Show numeric keyboard on mobile
                                                pattern="\d*" // Only allow whole numbers (no dots or special characters)
                                                sx={userStyle.input}
                                                placeholder="Please Enter Total Fields"
                                                disabled={fileUploadName !== "" && splitArray.length > 0}
                                                value={penaltyTotalfieldUpload.totalfields}
                                                onChange={(e) => {
                                                    const totalFieldsValue = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
                                                    setPenaltyTotalfieldUpload((prevData) => {
                                                        const newData = { ...prevData, totalfields: totalFieldsValue };
                                                        // Calculate Auto Count if totalfields and accuracy are available
                                                        if (totalFieldsValue && newData.accuracy) {
                                                            const autoCount = totalFieldsValue * (1 - (newData.accuracy / 100));
                                                            newData.autocount = autoCount.toFixed(2); // Set auto count with 2 decimal places
                                                        }
                                                        return newData;
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item md={4} xs={12} sm={6}>
                                <Grid container>
                                    <Grid item md={5} xs={12} sm={6}>
                                        <Typography>Error Count<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                sx={userStyle.input}
                                                placeholder="Please Enter Error Count"
                                                disabled={fileUploadName !== "" && splitArray.length > 0}
                                                value={penaltyTotalfieldUpload.errorcount}
                                                onChange={(e) => {
                                                    setPenaltyTotalfieldUpload({
                                                        ...penaltyTotalfieldUpload,
                                                        errorcount: e.target.value
                                                    });
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
                                            <Button variant="contained" onClick={handleSubmit} sx={buttonStyles.buttonsubmit} disabled={isBtn}>
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
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            )}
            <br /> <br />
            <Box sx={userStyle.selectcontainer}>
                <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "500" }}>
                                Days
                            </Typography>
                            <Selects
                                options={daysoptions}
                                // styles={colourStyles}
                                value={{ label: filterUser.day, value: filterUser.day }}
                                onChange={(e) => {
                                    handleChangeFilterDate(e);
                                    setFilterUser((prev) => ({ ...prev, day: e.value }))
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                            <Typography>
                                {" "}
                                From Date
                            </Typography>
                            <OutlinedInput
                                id="from-date"
                                type="date"
                                disabled={filterUser.day !== "Custom Fields"}
                                value={filterUser.fromdate}
                                onChange={(e) => {
                                    const newFromDate = e.target.value;
                                    setFilterUser((prevState) => ({
                                        ...prevState,
                                        fromdate: newFromDate,
                                        todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                                    }));
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                            <Typography>
                                To Date
                            </Typography>
                            <OutlinedInput
                                id="to-date"
                                type="date"
                                value={filterUser.todate}
                                disabled={filterUser.day !== "Custom Fields"}
                                onChange={(e) => {
                                    const selectedToDate = new Date(e.target.value);
                                    const selectedFromDate = new Date(filterUser.fromdate);
                                    const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                    if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                        setFilterUser({
                                            ...filterUser,
                                            todate: e.target.value
                                        });
                                    } else {
                                        setFilterUser({
                                            ...filterUser,
                                            todate: "" // Reset to empty string if the condition fails
                                        });
                                    }
                                }}
                            />
                        </FormControl>
                    </Grid>
                    &ensp;
                    <Grid item md={1} xs={12} sm={12}>
                        <Typography>&nbsp;</Typography>
                        <Button
                            variant="contained"
                            onClick={() => {
                                fetchFilterAllData();
                            }}
                            sx={buttonStyles.buttonsubmit}
                        >
                            Filter
                        </Button>
                    </Grid>
                    &ensp;
                    <Grid item md={1} xs={12} sm={12}>
                        <Typography>&nbsp;</Typography>
                        <Button sx={buttonStyles.btncancel} onClick={handleFilterClear}>
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <br />
            <br />
            {/* ****** Table Start ****** */}
            {loader ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (<>
                {isUserRoleCompare?.includes("lpenaltytotalfieldupload") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Upload List</Typography>
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
                                        {isUserRoleCompare?.includes("excelpenaltytotalfieldupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen1(true)
                                                    // fetchTargetPointsData1()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvpenaltytotalfieldupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen1(true)
                                                    // fetchTargetPointsData1()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printpenaltytotalfieldupload") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintFilename}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfpenaltytotalfieldupload") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen1(true)
                                                        // fetchTargetPointsData1()
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagepenaltytotalfieldupload") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFilename}>
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTableFilename}
                                        setItems={setItemsFilename}
                                        addSerialNumber={addSerialNumberFilename}
                                        setPage={setPageFilename}
                                        maindatas={targetPointsFilename}
                                        setSearchedString={setSearchedStringFilename}
                                        searchQuery={searchQueryFilename}
                                        setSearchQuery={setSearchQueryFilename}
                                        paginated={false}
                                    // totalDatas={overallItemsFilename}

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
                            {loaderFirst ? (
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
                                    selectedRows={selectedRowsFilename}
                                    setSelectedRows={setSelectedRowsFilename}
                                    gridRefTable={gridRefFilename}
                                    paginated={false}
                                    filteredDatas={filteredDatasFilename}
                                    handleShowAllColumns={handleShowAllColumnsFilename}
                                    setFilteredRowData={setFilteredRowDataFilename}
                                    filteredRowData={filteredRowDataFilename}
                                    setFilteredChanges={setFilteredChangesFilename}
                                    filteredChanges={filteredChangesFilename}
                                    gridRefTableImg={gridRefTableImgFilename}
                                // itemsList={overallItemsFilename}
                                />
                            )
                            }

                            {/* ****** Table End ****** */}
                        </Box>
                    </>
                )} </>)}
            {/* ****** Table End ****** */}
            <br /> <br />
            {/* ****** Table Start ****** */}
            {loader ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (<>
                {isUserRoleCompare?.includes("lpenaltytotalfieldupload") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Penalty Total Field List</Typography>
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
                                        {isUserRoleCompare?.includes("excelpenaltytotalfieldupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen2(true)
                                                    // fetchTargetPointsData2()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvpenaltytotalfieldupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen2(true)
                                                    // fetchTargetPointsData2()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printpenaltytotalfieldupload") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfpenaltytotalfieldupload") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen2(true)
                                                        // fetchTargetPointsData2()
                                                    }}                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagepenaltytotalfieldupload") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={targetPoints}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                    // totalDatas={overallItems}
                                    />

                                </Grid>
                            </Grid>

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
                            {isUserRoleCompare?.includes("bdpenaltytotalfieldupload") && (
                                <Button variant="contained" color="error" size="small" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                                    Bulk Delete
                                </Button>)}
                            <br />
                            <br />
                            {loaderSecond ? (
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
                                // itemsList={overallItems}
                                />

                            )
                            }

                            {/* ****** Table End ****** */}
                        </Box>
                    </>
                )} </>)}
            {/* ****** Table End ****** */}
            {/* print layout */}
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={6}>
                            <Typography sx={userStyle.HeaderText}>View Penalty Total Field Upload</Typography>
                        </Grid>
                    </Grid>
                    <br /> <br />
                    <Grid container spacing={2}>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Project Vendor</Typography>
                                <Typography>{viewsingleData.projectvendor}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Date</Typography>
                                {/* <Typography>{formattedViewDate}</Typography> */}
                                <Typography>{moment(formattedViewDate).format('DD-MM-YYYY')}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Queue Name</Typography>
                                <Typography>{viewsingleData.queuename}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Login ID</Typography>
                                <Typography>{viewsingleData.loginid}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Accuracy </Typography>
                                <Typography>{viewsingleData.accuracy}</Typography>
                            </FormControl>
                        </Grid>

                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Total Fields</Typography>
                                <Typography>{viewsingleData.totalfields}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Error Count</Typography>
                                <Typography>{viewsingleData.errorcount}</Typography>
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
            {/* Bulk delete ALERT DIALOG individual */}
            {/* Edit DIALOG */}
            <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: '50px' }}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={6}>
                            <Typography sx={userStyle.HeaderText}>Edit Penalty Total Field Upload</Typography>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Project Vendor<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    maxMenuHeight={300}
                                    options={projOpt}
                                    value={{ label: editsingleData.projectvendor, value: editsingleData.projectvendor }}
                                    onChange={((e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            projectvendor: e.value,
                                            queuename: "Please Select Queue Name",
                                            loginid: "Please Select Login ID"
                                        })
                                        fetchClientUserIDEdit(e.value);
                                        fetchProcessQueueEdit(e.value);
                                    })}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={editsingleData.date}
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            date: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Queue Name<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    maxMenuHeight={300}
                                    options={processOptEdit}
                                    value={{ label: editsingleData.queuename, value: editsingleData.queuename }}
                                    onChange={((e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            queuename: e.value,
                                            loginid: "Please Select Login ID"
                                        })
                                    })}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Login ID<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    maxMenuHeight={300}
                                    options={loginIdOptEdit}
                                    value={{ label: editsingleData.loginid, value: editsingleData.loginid }}
                                    onChange={((e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            loginid: e.value
                                        })
                                    })}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Accuracy<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text" // Use "text" to control input more finely
                                    inputMode="numeric" // Show numeric keyboard on mobile
                                    pattern="^\d*\.?\d*$" // Only allow whole numbers (no dots or special characters)
                                    sx={userStyle.input}
                                    // value={editsingleData.accuracy}
                                    value={editsingleData.accuracy ? (parseFloat(editsingleData.accuracy) % 1 === 0 ? parseFloat(editsingleData.accuracy).toFixed(0) : parseFloat(editsingleData.accuracy).toFixed(2)) : "0"}
                                    placeholder="Please Enter Accuracy"
                                    onChange={(e) => {
                                        const accuracyValue = e.target.value.replace(/[^0-9.]/g, ''); // Remove any non-digit characters
                                        setEditsingleData((prevData) => {
                                            const newData = { ...prevData, accuracy: accuracyValue };
                                            // Calculate Auto Count if totalfields and accuracy are available
                                            if (newData.totalfields && accuracyValue) {
                                                const autoCount = newData.totalfields * (1 - (accuracyValue / 100));
                                                newData.autocount = autoCount.toFixed(2); // Set auto count with 2 decimal places
                                            }
                                            return newData;
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Total Fields<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text" // Use "text" to control input more finely
                                    inputMode="numeric" // Show numeric keyboard on mobile
                                    pattern="\d*" // Only allow whole numbers (no dots or special characters)
                                    sx={userStyle.input}
                                    value={editsingleData.totalfields}
                                    placeholder="Please Enter Total Fields"
                                    onChange={(e) => {
                                        const totalFieldsValue = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
                                        setEditsingleData((prevData) => {
                                            const newData = { ...prevData, totalfields: totalFieldsValue };
                                            // Calculate Auto Count if totalfields and accuracy are available
                                            if (totalFieldsValue && newData.accuracy) {
                                                const autoCount = totalFieldsValue * (1 - (newData.accuracy / 100));
                                                newData.autocount = autoCount.toFixed(2); // Set auto count with 2 decimal places
                                            }
                                            return newData;
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>


                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Count<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="number" // Ensure numeric input
                                    sx={userStyle.input}
                                    value={editsingleData.errorcount}
                                    placeholder="Please Enter Error Count"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            errorcount: e.target.value
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                        Update
                    </Button>
                    <Button onClick={handleCloseModEdit} sx={buttonStyles.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {/* View wises Edit */}
            <Dialog open={isEditOpenView} onClose={handleCloseModEditView} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: '50px' }}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={6}>
                            <Typography sx={userStyle.HeaderText}>Edit Penalty Total Field Upload</Typography>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Project Vendor<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    maxMenuHeight={300}
                                    options={projOpt}
                                    value={{ label: editsingleData.projectvendor, value: editsingleData.projectvendor }}
                                    onChange={((e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            projectvendor: e.value,
                                            queuename: "Please Select Queue Name",
                                            loginid: "Please Select Login ID"
                                        })
                                        fetchClientUserIDEdit(e.value);
                                        fetchProcessQueueEdit(e.value);
                                    })}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="date"
                                    value={editsingleData.date}
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            date: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Queue Name<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    maxMenuHeight={300}
                                    options={processOptEdit}
                                    value={{ label: editsingleData.queuename, value: editsingleData.queuename }}
                                    onChange={((e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            queuename: e.value,
                                            loginid: "Please Select Login ID"
                                        })
                                    })}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Login ID<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    maxMenuHeight={300}
                                    options={loginIdOptEdit}
                                    value={{ label: editsingleData.loginid, value: editsingleData.loginid }}
                                    onChange={((e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            loginid: e.value
                                        })
                                    })}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Accuracy<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text" // Use "text" to control input more finely
                                    inputMode="numeric" // Show numeric keyboard on mobile
                                    pattern="^\d*\.?\d*$" // Only allow whole numbers (no dots or special characters)
                                    sx={userStyle.input}
                                    // value={editsingleData.accuracy}
                                    value={editsingleData.accuracy ? (parseFloat(editsingleData.accuracy) % 1 === 0 ? parseFloat(editsingleData.accuracy).toFixed(0) : parseFloat(editsingleData.accuracy).toFixed(2)) : "0"}
                                    placeholder="Please Enter Accuracy"
                                    onChange={(e) => {
                                        const accuracyValue = e.target.value.replace(/[^0-9.]/g, ''); // Remove any non-digit characters
                                        setEditsingleData((prevData) => {
                                            const newData = { ...prevData, accuracy: accuracyValue };
                                            // Calculate Auto Count if totalfields and accuracy are available
                                            if (newData.totalfields && accuracyValue) {
                                                const autoCount = newData.totalfields * (1 - (accuracyValue / 100));
                                                newData.autocount = autoCount.toFixed(2); // Set auto count with 2 decimal places
                                            }
                                            return newData;
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Total Fields<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text" // Use "text" to control input more finely
                                    inputMode="numeric" // Show numeric keyboard on mobile
                                    pattern="\d*" // Only allow whole numbers (no dots or special characters)
                                    sx={userStyle.input}
                                    value={editsingleData.totalfields}
                                    placeholder="Please Enter Total Fields"
                                    onChange={(e) => {
                                        const totalFieldsValue = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
                                        setEditsingleData((prevData) => {
                                            const newData = { ...prevData, totalfields: totalFieldsValue };
                                            // Calculate Auto Count if totalfields and accuracy are available
                                            if (totalFieldsValue && newData.accuracy) {
                                                const autoCount = totalFieldsValue * (1 - (newData.accuracy / 100));
                                                newData.autocount = autoCount.toFixed(2); // Set auto count with 2 decimal places
                                            }
                                            return newData;
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>


                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Count<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="number" // Ensure numeric input
                                    sx={userStyle.input}
                                    value={editsingleData.errorcount}
                                    placeholder="Please Enter Error Count"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            errorcount: e.target.value
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={editSubmitView} sx={buttonStyles.buttonsubmit}>
                        Update
                    </Button>
                    <Button onClick={handleCloseModEditView} sx={buttonStyles.btncancel}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openviewAll}
                onClose={handleClickOpenviewAll}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: '50px' }}
            >
                <DialogContent sx={{ marginTop: '70px' }}>
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
                                    {isUserRoleCompare?.includes("excelpenaltytotalfieldupload") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen3(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvpenaltytotalfieldupload") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen3(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printpenaltytotalfieldupload") && (
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
                                    {isUserRoleCompare?.includes("pdfpenaltytotalfieldupload") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen3(true)
                                                }}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagepenaltytotalfieldupload") && (
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
                                <AggregatedSearchBar
                                    columnDataTable={columnDataTableviewAll}
                                    setItems={setItemsviewAll}
                                    addSerialNumber={addSerialNumberviewAll}
                                    setPage={setPageviewAll}
                                    maindatas={productionoriginalviewAll}
                                    setSearchedString={setSearchedStringviewAll}
                                    searchQuery={searchQueryviewAll}
                                    setSearchQuery={setSearchQueryviewAll}
                                // paginated={false}
                                // totalDatas={overallItemsViewAll}
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
                        <br></br>
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
                                    isHandleChange={isHandleChangeviewAll}
                                    items={itemsviewAll}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefviewall}
                                    paginated={false}
                                    filteredDatas={filteredDataviewAlls}
                                    handleShowAllColumns={handleShowAllColumnsviewAll}

                                    setFilteredRowData={setFilteredRowDataViewAll}
                                    filteredRowData={filteredRowDataViewAll}
                                    setFilteredChanges={setFilteredChangesViewAll}
                                    filteredChanges={filteredChangesViewAll}
                                    gridRefTableImg={gridRefTableImgviewall}
                                // itemsList={overallItemsViewAll}
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
            <br />
            <ExportData
                isFilterOpen={isFilterOpen1}
                handleCloseFilterMod={handleCloseFilterMod1}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen1}
                isPdfFilterOpen={isPdfFilterOpen1}
                setIsPdfFilterOpen={setIsPdfFilterOpen1}
                handleClosePdfFilterMod={handleClosePdfFilterMod1}
                // filteredDataTwo={rowDataTableFilename ?? []}
                filteredDataTwo={(filteredChangesFilename !== null ? filteredRowDataFilename : rowDataTableFilename) ?? []}
                // itemsTwo={targetPointsFilenameArray ?? []}
                itemsTwo={targetPointsFilename ?? []}
                filename={"Upload List"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRefFilename}
            />
            <ExportData
                isFilterOpen={isFilterOpen2}
                handleCloseFilterMod={handleCloseFilterMod2}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen2}
                isPdfFilterOpen={isPdfFilterOpen2}
                setIsPdfFilterOpen={setIsPdfFilterOpen2}
                handleClosePdfFilterMod={handleClosePdfFilterMod2}
                // filteredDataTwo={rowDataTable ?? []}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                // itemsTwo={targetPointsFilenameArray2 ?? []}
                itemsTwo={targetPoints ?? []}
                filename={"Penalty Total Field List"}
                exportColumnNames={exportColumnNames2}
                exportRowValues={exportRowValues2}
                componentRef={componentRef}
            />

            <ExportData
                isFilterOpen={isFilterOpen3}
                handleCloseFilterMod={handleCloseFilterMod3}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen3}
                isPdfFilterOpen={isPdfFilterOpen3}
                setIsPdfFilterOpen={setIsPdfFilterOpen3}
                handleClosePdfFilterMod={handleClosePdfFilterMod3}
                // filteredDataTwo={rowDataTableviewAll ?? []}
                filteredDataTwo={(filteredChangesViewAll !== null ? filteredRowDataViewAll : rowDataTableviewAll) ?? []}
                itemsTwo={filenameDataArray3 ?? []}
                filename={modifiedString}
                exportColumnNames={exportColumnNames3}
                exportRowValues={exportRowValues3}
                componentRef={componentRefviewall}
            />
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Penalty Total Field Upload Info"
                addedby={addedby}
                updateby={updateby}
            />
            <InfoPopup
                openInfo={openInfoFirst}
                handleCloseinfo={handleCloseinfoFirst}
                heading="Upload List Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
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
                open={isDeleteSingleOpenView}
                onClose={handleCloseSingleModView}
                onConfirm={deleteSingleListView}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={deleteSingleBulkdataDelete}
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
        </Box>
    );
}
export default PenaltyTotalFieldUpload;