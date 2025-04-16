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
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar.js';
import AggridTable from "../../../components/AggridTable.js";
import AlertDialog from "../../../components/Alert.js";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle, colourStyles } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";
import SendToServer from "../../sendtoserver.js";
import domtoimage from 'dom-to-image';
import { MultiSelect } from "react-multi-select-component";

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




function BulkErrorUpload() {
    const [Filter, setFilter] = useState([])
    const [filterList, setFilterList] = useState([])

    const [loaderList, setLoaderList] = useState(false)

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [fileLength, setFileLength] = useState(0);

    const [overallItems, setOverallItems] = useState([]);

    const [yeardrop, setYeardrop] = useState("dd");
    const [monthdrop, setMonthdrop] = useState("MM");
    const [datedrop, setDatedrop] = useState("yyyy");
    const [symboldrop, setSymboldrop] = useState("-");
    const [hoursdrop, setHoursdrop] = useState("NAN");


    const [filteredRowDataViewAll, setFilteredRowDataViewAll] = useState([]);
    const [filteredChangesViewAll, setFilteredChangesViewAll] = useState(null);

    const [overallItemsViewAll, setOverallItemsViewAll] = useState([]);

    const [selectedMode, setSelectedMode] = useState("Today");

    const mode = [
        { label: "Today", value: "Today" },
        { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [fromdate, setFromdate] = useState(today)
    const [todate, setTodate] = useState(today)

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
    const currentDate = new Date();
    const [penaltyErrorUpload, setPenaltyErrorUpload] = useState({
        fromdate: moment(currentDate).format("YYYY-MM-DD"),
        todate: moment(currentDate).format("YYYY-MM-DD"),
        projectvendor: "SDS_Quickclaim-HFF",
        process: "SmartZone Red Verify Reconciliation",
        loginid: "Please Select Login ID",
        date: "",
        errorfilename: "",
        documentnumber: "",
        documenttype: "",
        fieldname: "",
        line: "",
        errorvalue: "",
        correctvalue: "",
        link: "",
        doclink: ""
    });


    const [penaltyErrorUploadFilter, setPenaltyErrorUploadFilter] = useState({

        projectvendor: "Please Select ProjectVendor",
        process: "Please Select Process",
        loginid: "Please Select Login ID",

    });


    const fetchClientUserIDFilter = async (proj) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const filterProjBased = res_freq?.data?.clientuserid.filter((item) => proj.includes(item.projectvendor))
            const loginIdOpt = [...filterProjBased.map((d) => ({
                ...d,
                label: d.userid,
                value: d.userid,
            }))];
            setClientLoginIDOptFilter(loginIdOpt);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchProcessQueueFilter = async (projname) => {

        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const processFilter = res_freq?.data?.productionprocessqueue.filter((item) => projname.includes(item.projectvendor))
            const Que = processFilter.map((t) => ({
                label: t.processqueue,
                value: t.processqueue
            }))
            setProcessQueueArrayFilter(Que);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // useEffect(() => {
    //     fetchProcessQueueFilter();
    // }, [])




    const [selectProjectVendor, setSelectedProjectVendor] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState([]);
    const [selectedSLoginId, setSelectedLoginId] = useState([]);

    const handleProjecvendor = (options) => {
        console.log(options, "op")
        setSelectedProjectVendor(options);
        setSelectedProcess([]);
        setSelectedLoginId([])
        fetchProcessQueueFilter(options.map(d => d.value));

        fetchClientUserIDFilter(options.map(d => d.value));
    };
    const customValueRendererProject = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select ProjectVendor";
    };


    const handleProcess = (options) => {
        setSelectedProcess(options);
        setSelectedLoginId([])
    };
    const customValueRendererProcess = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Process";
    };

    const handleLoginId = (options) => {
        setSelectedLoginId(options);
    };
    const customValueLoginId = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select LoginId";
    };








    const [openviewAll, setOpenviewAll] = useState(false);
    const handleClickOpenviewAll = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setOpenviewAll(true);
    };
    const [itemsviewAll, setItemsviewAll] = useState([]);
    const [productionoriginalviewAll, setProductionoriginalViewAll] = useState(
        []
    );
    const addSerialNumberviewAll = (datas) => {
        const itemsWithSerialNumber = datas?.map(
            (item, index) => ({
                ...item,
                serialNumber: index + 1,
                date: moment(item.date).format("DD-MM-YYYY")
            })
        );
        setItemsviewAll(itemsWithSerialNumber);
        setOverallItemsViewAll(itemsWithSerialNumber);
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
            pagename: String("Bulk Error Upload"),
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
        process: true,
        loginid: true,
        date: true,
        errorfilename: true,
        documentnumber: true,
        documenttype: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        correctvalue: true,
        link: true,
        doclink: true,
        actions: true,
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
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.process,
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
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.date,
            headerClassName: "bold-header",
        },
        {
            field: "errorfilename",
            headerName: "Error File Name",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.errorfilename,
            headerClassName: "bold-header",
        },
        {
            field: "documentnumber",
            headerName: "Document Number",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.documentnumber,
            headerClassName: "bold-header",
        },
        {
            field: "documenttype",
            headerName: "Document Type",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.documenttype,
            headerClassName: "bold-header",
        },
        {
            field: "fieldname",
            headerName: "Field Name",
            flex: 0,
            width: 130,
            hide: !columnVisibilityviewAll.fieldname,
            headerClassName: "bold-header",
        },
        {
            field: "line",
            headerName: "Line",
            flex: 0,
            width: 130,
            hide: !columnVisibilityviewAll.line,
            headerClassName: "bold-header",
        },
        {
            field: "errorvalue",
            headerName: "Error Value",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.errorvalue,
            headerClassName: "bold-header",
        },
        {
            field: "correctvalue",
            headerName: "Correct Value",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.correctvalue,
            headerClassName: "bold-header",
        },
        {
            field: "link",
            headerName: "Link",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.link,
            headerClassName: "bold-header",
        },
        {
            field: "doclink",
            headerName: "Doc Link",
            flex: 0,
            width: 150,
            hide: !columnVisibilityviewAll.doclink,
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
                    {isUserRoleCompare?.includes("ebulkerrorupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleeditView(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dbulkerrorupload") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDataSingleDeleteView(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {/* {isUserRoleCompare?.includes("vbulkerrorupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleview(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ibulkerrorupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleinfo(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
                        </Button>
                    )} */}
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
        process: true,
        loginid: true,
        date: true,
        errorfilename: true,
        documentnumber: true,
        documenttype: true,
        fieldname: true,
        line: true,
        errorvalue: true,
        correctvalue: true,
        link: true,
        doclink: true,
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


    const [isDeleteSingleOpenView, setIsDeleteSingleOpenView] = useState(false);
    const handleClickSingleOpenView = () => {
        setIsDeleteSingleOpenView(true);
    };
    const handleCloseSingleModView = () => {
        setIsDeleteSingleOpenView(false);
        // setDeletesingledata({});
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
    const [processOptFilter, setProcessQueueArrayFilter] = useState([])
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



    useEffect(() => {
        fetchProcessQueue("SDS_Quickclaim-HFF");
    }, [])


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
    const [loginIdOptFilter, setClientLoginIDOptFilter] = useState([])
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

    const [uniquedata, setUniqueDatas] = useState([])
    const [uniquedatapost, setUniqueDataspost] = useState([])

    // const fetchTargetPointsData = async () => {
    //     setPageName(!pageName)

    //     try {
    //         let Res = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         let Resunique = await axios.get(SERVICE.BULK_ERROR_UPLOADS_FILENAME_UNIQUE, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         setUniqueDatas(Resunique?.data?.bulkerroruploadpoints)
    //         setTargetPoints(Res?.data?.bulkerroruploadpoints);
    //         setTableTwoLoader(true);
    //         let getFilenames = Res?.data?.bulkerroruploadpoints.filter((item) => item.filename !== "nonexcel");
    //         const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
    //             return getFilenames.find((obj) => obj.filename === filename);
    //         });
    //         // const uniqueArray = Array.from(new Set(getFilenames));
    //         setTargetPointsFilename(uniqueArray);
    //         setTableOneLoader(true);
    //     } catch (err) { setTableOneLoader(true); setTableTwoLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    // };
    const [targetPointsFilenameArray, setTargetPointsFilenameArray] = useState([])


    const fetchTargetPointsData1 = async () => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTargetPoints(Res?.data?.bulkerroruploadpoints);
            let getFilenames = Res?.data?.bulkerroruploadpoints.filter((item) => item.filename !== "nonexcel");
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
    useEffect(() => {
        fetchTargetPointsData1();
    }, [isFilterOpen1, fileUploadName])

    const [targetPointsFilenameArray2, setTargetPointsFilenameArray2] = useState([])
    const fetchTargetPointsData2 = async () => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getFilenames = Res?.data?.bulkerroruploadpoints.filter((item) => item.filename !== "nonexcel");
            const uniqueArray = Array.from(new Set(getFilenames));
            setTargetPointsFilenameArray2(Res?.data?.bulkerroruploadpoints);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchTargetPointsData2();
    }, [isFilterOpen2])
    useEffect(() => {
        getProject();
        // fetchTargetPointsData();
    }, []);
    //submit option for saving
    const handleSubmit = async (e) => {
        e.preventDefault();
        let Res = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        // const isNameMatch = targetPoints?.some((item) =>
        const isNameMatch = Res?.data?.bulkerroruploadpoints?.some((item) =>
            item.projectvendor?.toLowerCase() == penaltyErrorUpload.projectvendor?.toLowerCase() &&
            item.process?.toLowerCase() == penaltyErrorUpload.process?.toLowerCase() &&
            item.loginid?.toLowerCase() == penaltyErrorUpload.loginid?.toLowerCase() &&
            item.errorfilename?.toLowerCase() == penaltyErrorUpload.errorfilename?.toLowerCase() &&
            item.documentnumber?.toLowerCase() == penaltyErrorUpload.documentnumber?.toLowerCase() &&
            item.documenttype?.toLowerCase() == penaltyErrorUpload.documenttype?.toLowerCase() &&
            item.fieldname?.toLowerCase() == penaltyErrorUpload.fieldname?.toLowerCase() &&
            item.line?.toLowerCase() == penaltyErrorUpload.line?.toLowerCase() &&
            item.errorvalue?.toLowerCase() == penaltyErrorUpload.errorvalue?.toLowerCase() &&
            item.correctvalue?.toLowerCase() == penaltyErrorUpload.correctvalue?.toLowerCase() &&
            item.link?.toLowerCase() == penaltyErrorUpload.link?.toLowerCase() &&
            item.doclink?.toLowerCase() == penaltyErrorUpload.doclink?.toLowerCase()

            // console.log(

            //     item.projectvendor == penaltyErrorUpload.projectvendor,
            //     item.process == penaltyErrorUpload.process,
            //     item.loginid == penaltyErrorUpload.loginid,
            //     item.errorfilename == penaltyErrorUpload.errorfilename,
            //     item.documentnumber == penaltyErrorUpload.documentnumber,
            //     item.documenttype == penaltyErrorUpload.documenttype,
            //     item.fieldname == penaltyErrorUpload.fieldname,
            //     item.line == penaltyErrorUpload.line,
            //     item.errorvalue == penaltyErrorUpload.errorvalue,
            //     item.correctvalue == penaltyErrorUpload.correctvalue,
            //     item.link == penaltyErrorUpload.link,
            //     item.doclink == penaltyErrorUpload.doclink
            //     , "cond"
            // )
        )
        if (penaltyErrorUpload.fromdate === "" || penaltyErrorUpload.todate === "") {
            let alertMsg = penaltyErrorUpload.fromdate === "" && penaltyErrorUpload.todate === "" ? "Please Choose From Date & To Date" : penaltyErrorUpload.fromdate === "" ? "Please Choose From Date" : "Please Choose To Date";
            setPopupContentMalert(alertMsg);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (penaltyErrorUpload.projectvendor === "" || penaltyErrorUpload.projectvendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (penaltyErrorUpload.process === "" || penaltyErrorUpload.process === "Please Select Process") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (penaltyErrorUpload.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (penaltyErrorUpload.date === "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.errorfilename === "") {
            setPopupContentMalert("Please Enter Error File Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.documentnumber === "") {
            setPopupContentMalert("Please Enter Document Number");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.documenttype === "") {
            setPopupContentMalert("Please Enter Document Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.fieldname === "") {
            setPopupContentMalert("Please Enter Field Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.line === "") {
            setPopupContentMalert("Please Enter Line");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.errorvalue === "") {
            setPopupContentMalert("Please Enter Error Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.correctvalue === "") {
            setPopupContentMalert("Please Enter Correct Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.link === "") {
            setPopupContentMalert("Please Enter Link");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (penaltyErrorUpload.doclink === "") {
            setPopupContentMalert("Please Enter Doc Link");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exists!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
            setSearchQuery("")
            setSearchQueryFilename("")
            setSearchQueryviewAll("")

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
        'Project Vendor',
        'Process', 'Login ID',
        'Date', 'Error File Name',
        'Document Number', 'Document Type',
        'Field Name', 'Line',
        'Error Value', 'Correct Value',
        'Link', 'Doc Link'
    ]
    const exportRowValues3 = [
        'projectvendor',
        'process', 'loginid',
        'date', 'errorfilename',
        'documentnumber', 'documenttype',
        'fieldname', 'line',
        'errorvalue', 'correctvalue',
        'link', 'doclink'
    ]
    const modifiedString = fileNameView?.replace(".csv", "");
    const gridRefviewall = useRef(null);

    const gridRefTableImgviewall = useRef(null);
    // image
    const handleCaptureImageviewall = () => {
        if (gridRefTableImgviewall.current) {
            domtoimage.toBlob(gridRefTableImgviewall.current)
                .then((blob) => {
                    saveAs(blob, "Bulk Error Upload.png");
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
            process: item.process,
            loginid: item.loginid,
            date: item.date,
            errorfilename: item.errorfilename,
            documentnumber: item.documentnumber,
            documenttype: item.documenttype,
            fieldname: item.fieldname,
            line: item.line,
            errorvalue: item.errorvalue,
            correctvalue: item.correctvalue,
            link: item.link,
            doclink: item.doclink,
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
            let res = await axios.post(SERVICE.BULK_ERROR_UPLOADS_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                fromdate: String(penaltyErrorUpload.fromdate),
                todate: String(penaltyErrorUpload.todate),
                projectvendor: String(penaltyErrorUpload.projectvendor),
                process: String(penaltyErrorUpload.process),
                loginid: String(penaltyErrorUpload.loginid),
                date: String(penaltyErrorUpload.date),
                dateformatted: String(penaltyErrorUpload.date),
                dateformat: String(`YYYY-MM-DD`),
                errorfilename: String(penaltyErrorUpload.errorfilename),
                documentnumber: String(penaltyErrorUpload.documentnumber),
                documenttype: String(penaltyErrorUpload.documenttype),
                fieldname: String(penaltyErrorUpload.fieldname),
                line: String(penaltyErrorUpload.line),
                yeardrop: yeardrop,
                monthdrop: monthdrop,
                datedrop: datedrop,
                symboldrop: symboldrop,
                hoursdrop: hoursdrop,
                mode: "Bulkupload",
                errorvalue: String(penaltyErrorUpload.errorvalue),
                correctvalue: String(penaltyErrorUpload.correctvalue),
                link: String(penaltyErrorUpload.link),
                doclink: String(penaltyErrorUpload.doclink),
                filename: "nonexcel",
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            // await fetchTargetPointsData();
            setPenaltyErrorUpload({ ...penaltyErrorUpload, experience: "", processcode: "", code: "", points: "" });
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
        readExcel(null);
        setDataupdated("");
        setSheets([]);
        setProcessQueueArray([]);
        setClientLoginIDOpt([]);
        setSelectedSheet("Please Select Sheet");
        setPenaltyErrorUpload({
            ...penaltyErrorUpload,
            fromdate: moment(currentDate).format("YYYY-MM-DD"),
            todate: moment(currentDate).format("YYYY-MM-DD"),
            projectvendor: "Please Select Project Vendor",
            process: "Please Select Process",
            loginid: "Please Select Login ID",
            date: "",
            errorfilename: "",
            documentnumber: "",
            documenttype: "",
            fieldname: "",
            line: "",
            errorvalue: "",
            correctvalue: "",
            link: "",
            doclink: ""
        });
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("")
        setSearchQueryFilename("")
        setSearchQueryviewAll("")
    };
    //delete singledata functionality
    const [deletesingleData, setDeletesingledata] = useState();
    const [deletesingleDataView, setDeletesingledataView] = useState();


    const rowDataSingleDelete = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeletesingledata(Res?.data?.sbulkerroruploadpoints);
            handleClickSingleOpen();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const rowDataSingleDeleteView = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeletesingledataView(Res?.data?.sbulkerroruploadpoints);
            handleClickSingleOpenView();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    const deleteSingleList = async () => {
        setLoader(true)
        let deleteSingleid = deletesingleData?._id;
        setPageName(!pageName)
        try {
            const deletePromises = await axios.delete(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${deleteSingleid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleCloseSingleMod();
            setPage(1);
            await fetchTargetPointsData(fromdate, todate);
            await fetchFilteredDatas()
            await fetchTargetPointsData1();
            // await getviewCodeall()
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)
        } catch (err) { console.log(err, "delerror"); setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const deleteSingleListView = async () => {
        setLoader(true)
        let deleteSingleid = deletesingleDataView?._id;
        setPageName(!pageName)
        try {
            const deletePromises = await axios.delete(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${deleteSingleid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleCloseSingleModView();
            handleCloseviewAll();
            handleClickOpenviewAll();
            setPage(1);

            await getviewCodeall(deletesingleDataView.filename)
            await fetchTargetPointsData(fromdate, todate);
            await fetchFilteredDatas()
            await fetchTargetPointsData1();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setLoader(false)
        } catch (err) { console.log(err, "delerror"); setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    const deleteSingleBulkdataDelete = async () => {
        setLoader(true)
        setPageName(!pageName)
        try {
            if (selectedRows.length != 0) {
                setLoader(true);
                const deletePromises = await axios.post(
                    SERVICE.MULTIPLE_BULK_ERROR_UPLOAD_SINGLE,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        ids: selectedRows,
                    }
                );
                if (deletePromises?.data?.success) {
                    handleCloseModcheckbox();
                    setPage(1);
                    await fetchTargetPointsData(fromdate, todate);
                    setPopupContent("Deleted Successfully");
                    setPopupSeverity("success");
                    handleClickOpenPopup();
                    setLoader(false)
                    setIsHandleChange(false);
                } else {
                    setLoader(false)
                    handleCloseModcheckbox();
                    setSelectedRows([]);
                    setSelectAllChecked(false);
                    setPage(1);
                    setIsHandleChange(false);
                    await fetchTargetPointsData(fromdate, todate);
                }
            }
        } catch (err) { console.log(err, "delerror01"); setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //edit get data functionality single list
    const [editsingleData, setEditsingleData] = useState({
        fromdate: moment(currentDate).format("YYYY-MM-DD"),
        todate: moment(currentDate).format("YYYY-MM-DD"),
        projectvendor: "Please Select Project Vendor",
        process: "Please Select Process",
        loginid: "Please Select Login ID",
        date: "",
        errorfilename: "",
        documentnumber: "",
        documenttype: "",
        filename: "",
        fieldname: "",
        line: "",
        errorvalue: "",
        correctvalue: "",
        link: "",
        doclink: ""
    });
    const [viewsingleData, setviewsingleData] = useState({ experience: "", processcode: "", code: "", points: "" });
    const [infosingleData, setinfosingleData] = useState({ experience: "", processcode: "", code: "", points: "" });
    const [penaltyArray, setPenaltyArray] = useState([])
    const fetchTargetPointsAllData = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getArray = Res?.data?.bulkerroruploadpoints.filter((item) => item._id !== id);
            setPenaltyArray(getArray)
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const rowdatasingleedit = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const prevData = Res?.data?.sbulkerroruploadpoints;
            // Check if prevData exists before attempting to update it
            if (prevData) {
                // Update the date property using moment to format it
                const updatedDate = moment(prevData.date, "DD-MM-YYYY").format("YYYY-MM-DD");
                // Use the spread operator to create a new object with updated date property
                const updatedData = {
                    ...prevData,
                    date: updatedDate
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


    const rowdatasingleeditView = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const prevData = Res?.data?.sbulkerroruploadpoints;
            // Check if prevData exists before attempting to update it
            if (prevData) {
                // Update the date property using moment to format it
                const updatedDate = moment(prevData.date, "DD-MM-YYYY").format("YYYY-MM-DD");
                // Use the spread operator to create a new object with updated date property
                const updatedData = {
                    ...prevData,
                    date: updatedDate
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



    const [formattedViewDate, setViewDate] = useState("")
    const rowdatasingleview = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setviewsingleData(Res?.data?.sbulkerroruploadpoints);
            setViewDate(formatDate(Res?.data?.sbulkerroruploadpoints?.date));
            handleClickOpenview();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const rowdatasingleinfo = async (id) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setinfosingleData(Res?.data?.sbulkerroruploadpoints);
            handleClickOpeninfo();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const editSubmit = async (e) => {
        e.preventDefault();
        let Res = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let getArray = Res?.data?.bulkerroruploadpoints.filter((item) => item._id !== id);

        // const isNameMatch = penaltyArray?.some((item) =>
        const isNameMatch = getArray?.some((item) =>
            item.projectvendor?.toLowerCase() == editsingleData.projectvendor?.toLowerCase() &&
            item.process?.toLowerCase() == editsingleData.process?.toLowerCase() &&
            item.loginid?.toLowerCase() == editsingleData.loginid?.toLowerCase() &&
            // item.date == editsingleData.date &&
            item.errorfilename?.toLowerCase() == editsingleData.errorfilename?.toLowerCase() &&
            item.documentnumber?.toLowerCase() == editsingleData.documentnumber?.toLowerCase() &&
            item.documenttype?.toLowerCase() == editsingleData.documenttype?.toLowerCase() &&
            item.fieldname?.toLowerCase() == editsingleData.fieldname?.toLowerCase() &&
            item.line?.toLowerCase() == editsingleData.line?.toLowerCase() &&
            item.errorvalue?.toLowerCase() == editsingleData.errorvalue?.toLowerCase() &&
            item.correctvalue?.toLowerCase() == editsingleData.correctvalue?.toLowerCase() &&
            item.link?.toLowerCase() == editsingleData.link?.toLowerCase() &&
            item.doclink?.toLowerCase() == editsingleData.doclink?.toLowerCase()
        )
        if (editsingleData.projectvendor === "") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (editsingleData.process === "") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (editsingleData.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (editsingleData.date == "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.errorfilename == "") {
            setPopupContentMalert("Please Enter Error File Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.documentnumber == "") {
            setPopupContentMalert("Please Enter Document Number");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.documenttype == "") {
            setPopupContentMalert("Please Enter Document Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.fieldname == "") {
            setPopupContentMalert("Please Enter Field Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.line == "") {
            setPopupContentMalert("Please Enter Line");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.errorvalue == "") {
            setPopupContentMalert("Please Enter Error Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.correctvalue == "") {
            setPopupContentMalert("Please Enter Correct Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.link == "") {
            setPopupContentMalert("Please Enter Link");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.doclink == "") {
            setPopupContentMalert("Please Enter Doc Link");
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


    const editSubmitView = async (e) => {
        e.preventDefault();

        let Res = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let getArray = Res?.data?.bulkerroruploadpoints.filter((item) => item._id !== id);

        // const isNameMatch = penaltyArray?.some((item) =>
        const isNameMatch = getArray?.some((item) =>
            item.projectvendor?.toLowerCase() == editsingleData.projectvendor?.toLowerCase() &&
            item.process?.toLowerCase() == editsingleData.process?.toLowerCase() &&
            item.loginid?.toLowerCase() == editsingleData.loginid?.toLowerCase() &&
            // item.date == editsingleData.date &&
            item.errorfilename?.toLowerCase() == editsingleData.errorfilename?.toLowerCase() &&
            item.documentnumber?.toLowerCase() == editsingleData.documentnumber?.toLowerCase() &&
            item.documenttype?.toLowerCase() == editsingleData.documenttype?.toLowerCase() &&
            item.fieldname?.toLowerCase() == editsingleData.fieldname?.toLowerCase() &&
            item.line?.toLowerCase() == editsingleData.line?.toLowerCase() &&
            item.errorvalue?.toLowerCase() == editsingleData.errorvalue?.toLowerCase() &&
            item.correctvalue?.toLowerCase() == editsingleData.correctvalue?.toLowerCase() &&
            item.link?.toLowerCase() == editsingleData.link?.toLowerCase() &&
            item.doclink?.toLowerCase() == editsingleData.doclink?.toLowerCase()
        )
        if (editsingleData.projectvendor === "") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (editsingleData.process === "") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (editsingleData.loginid === "Please Select Login ID") {
            setPopupContentMalert("Please Select Login ID");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (editsingleData.date == "") {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.errorfilename == "") {
            setPopupContentMalert("Please Enter Error File Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.documentnumber == "") {
            setPopupContentMalert("Please Enter Document Number");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.documenttype == "") {
            setPopupContentMalert("Please Enter Document Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.fieldname == "") {
            setPopupContentMalert("Please Enter Field Name");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.line == "") {
            setPopupContentMalert("Please Enter Line");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.errorvalue == "") {
            setPopupContentMalert("Please Enter Error Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.correctvalue == "") {
            setPopupContentMalert("Please Enter Correct Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.link == "") {
            setPopupContentMalert("Please Enter Link");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (editsingleData.doclink == "") {
            setPopupContentMalert("Please Enter Doc Link");
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
            let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${editid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: String(editsingleData.projectvendor),
                process: String(editsingleData.process),
                loginid: String(editsingleData.loginid),
                date: String(moment(editsingleData.date).format("DD-MM-YYYY")),
                errorfilename: String(editsingleData.errorfilename),
                documentnumber: String(editsingleData.documentnumber),
                documenttype: String(editsingleData.documenttype),
                fieldname: String(editsingleData.fieldname),
                line: String(editsingleData.line),
                errorvalue: String(editsingleData.errorvalue),
                correctvalue: String(editsingleData.correctvalue),
                link: String(editsingleData.link),
                doclink: String(editsingleData.doclink),
                updatedby: [
                    {
                        ...updateby,
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchTargetPointsData(fromdate, todate);
            await fetchFilteredDatas()
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
            let res = await axios.put(`${SERVICE.BULK_ERROR_UPLOADS_SINGLE}/${editid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: String(editsingleData.projectvendor),
                process: String(editsingleData.process),
                loginid: String(editsingleData.loginid),
                date: String(moment(editsingleData.date).format("DD-MM-YYYY")),
                errorfilename: String(editsingleData.errorfilename),
                documentnumber: String(editsingleData.documentnumber),
                documenttype: String(editsingleData.documenttype),
                fieldname: String(editsingleData.fieldname),
                line: String(editsingleData.line),
                errorvalue: String(editsingleData.errorvalue),
                correctvalue: String(editsingleData.correctvalue),
                link: String(editsingleData.link),
                doclink: String(editsingleData.doclink),
                updatedby: [
                    {
                        ...updateby,
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });

            await getviewCodeall(editsingleData.filename);
            await fetchTargetPointsData(fromdate, todate);
            await fetchFilteredDatas()
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
                    saveAs(blob, "Bulk Error Upload.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // pdf.....
    const exportColumnNames2 = [
        'Project Vendor', 'Process',
        'Login ID', 'Date',
        'Error File Name', 'Document Number',
        'Document type', 'Field Name',
        'Line', 'Error Value',
        'Correct value', 'Link',
        'Doc Link'
    ]
    const exportRowValues2 = [
        'projectvendor', 'process',
        'loginid', 'date',
        'errorfilename', 'documentnumber',
        'documenttype', 'fieldname',
        'line', 'errorvalue',
        'correctvalue', 'link',
        'doclink'
    ]
    // Excel
    const fileName = "Bulk Error Upload";
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
        documentTitle: "Upload Data List",
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
        addSerialNumber(filterList);
    }, [filterList]);
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
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 130,
            hide: !columnVisibility.process,
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
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 130,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "errorfilename",
            headerName: "Error File Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.errorfilename,
            headerClassName: "bold-header",
        },
        {
            field: "documentnumber",
            headerName: "Document Number",
            flex: 0,
            width: 140,
            hide: !columnVisibility.documentnumber,
            headerClassName: "bold-header",
        },
        {
            field: "documenttype",
            headerName: "Document Type",
            flex: 0,
            width: 150,
            hide: !columnVisibility.documenttype,
            headerClassName: "bold-header",
        },
        {
            field: "fieldname",
            headerName: "Field Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fieldname,
            headerClassName: "bold-header",
        },
        {
            field: "line",
            headerName: "Line",
            flex: 0,
            width: 130,
            hide: !columnVisibility.line,
            headerClassName: "bold-header",
        },
        {
            field: "errorvalue",
            headerName: "Error Value",
            flex: 0,
            width: 150,
            hide: !columnVisibility.errorvalue,
            headerClassName: "bold-header",
        },
        {
            field: "correctvalue",
            headerName: "Correct Value",
            flex: 0,
            width: 150,
            hide: !columnVisibility.correctvalue,
            headerClassName: "bold-header",
        },
        {
            field: "link",
            headerName: "Link",
            flex: 0,
            width: 150,
            hide: !columnVisibility.link,
            headerClassName: "bold-header",
        },
        {
            field: "doclink",
            headerName: "Doc Link",
            flex: 0,
            width: 150,
            hide: !columnVisibility.doclink,
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
                    {isUserRoleCompare?.includes("ebulkerrorupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleedit(params.data.id);
                            }}
                        >
                            <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dbulkerrorupload") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDataSingleDelete(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vbulkerrorupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                rowdatasingleview(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("ibulkerrorupload") && (
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
            process: item.process,
            loginid: item.loginid,
            date: formattedDate,
            errorfilename: item.errorfilename,
            documentnumber: item.documentnumber,
            documenttype: item.documenttype,
            fieldname: item.fieldname,
            line: item.line,
            errorvalue: item.errorvalue,
            correctvalue: item.correctvalue,
            link: item.link,
            doclink: item.doclink,
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
            let res = await axios.post(SERVICE.BULK_ERROR_UPLOADS_FILENAME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                filename: filename

            });
            let getFilenames = res?.data?.bulkerroruploadpoints
            // .map((item) => item._id);
            setProductionoriginalViewAll(getFilenames?.map(
                (item, index) => ({
                    ...item,
                    serialNumber: index + 1,
                })
            ));
            setFilenameDataArray3(getFilenames.map((item, index) => {
                const formattedDate = formatDate(item.date);
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    projectvendor: item.projectvendor,
                    process: item.process,
                    loginid: item.loginid,
                    date: formattedDate,
                    errorfilename: item.errorfilename,
                    documentnumber: item.documentnumber,
                    documenttype: item.documenttype,
                    fieldname: item.fieldname,
                    line: item.line,
                    errorvalue: item.errorvalue,
                    correctvalue: item.correctvalue,
                    link: item.link,
                    doclink: item.doclink,
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
    const [deleteFilenameData, setDeletefilenamedata] = useState([]);
    const rowDatafileNameDelete = async (filename) => {
        setPageName(!pageName)
        try {
            let Res = await axios.get(SERVICE.BULK_ERROR_UPLOADS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let getFilenames = Res?.data?.bulkerroruploadpoints.filter((item) => item.filename === filename).map((item) => item._id);
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
                    SERVICE.MULTIPLE_BULK_ERROR_UPLOAD_SINGLE,
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
                    await fetchTargetPointsData(fromdate, todate);
                    setLoader(false)
                } else {
                    setLoader(false)
                    handleCloseMod();
                    setSelectedRows([]);
                    setSelectAllChecked(false);
                    setPage(1);
                    await fetchTargetPointsData(fromdate, todate);
                }
            }
        } catch (err) { console.log(err, "filename"); setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        process: true,
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


    const gridRefTableImgFilename = useRef(null);
    // image
    const handleCaptureImageFilename = () => {
        if (gridRefTableImgFilename.current) {
            domtoimage.toBlob(gridRefTableImgFilename.current)
                .then((blob) => {
                    saveAs(blob, "Bulk Error Upload.png");
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
        'Process',
        'File Name',
        'Created By',
        'Created Date & Time'
    ]
    const exportRowValues = [
        'fromdate',
        'todate',
        'projectvendor',
        'process',
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
            field: "fromdate",
            headerName: "From Date",
            flex: 0,
            width: 180,
            hide: !columnVisibilityFilename.fromdate,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "todate",
            headerName: "To Date",
            flex: 0,
            width: 180,
            hide: !columnVisibilityFilename.todate,
            headerClassName: "bold-header",
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
            field: "process",
            headerName: "Process",
            flex: 0,
            width: 180,
            hide: !columnVisibilityFilename.process,
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
                    {isUserRoleCompare?.includes("dbulkerrorupload") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowDatafileNameDelete(params.data.filename);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vbulkerrorupload") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeall(params.data.filename);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}

                    {isUserRoleCompare?.includes("ibulkerrorupload") && (
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
    const rowDataTableFilename = FilenameFilename.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            process: item.process,
            filename: item.filename,
            createdby: item.addedby[0].name,
            createddate: moment(item.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
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




    // console.log(targetPointsData, "datefomatconcat")

    const readExcel = (file) => {
        console.log(targetPointsData, file && file.name, "datefomatconcat")
        setSplitArray([])
        const checkFile = file
        // console.log(checkFile, "checkFile")
        const fileExtension = checkFile?.name?.split('.')?.pop()?.toLowerCase();
        // Define accepted file extensions
        const acceptedExtensions = ['csv', 'xlsx', 'xls'];
        // Define required columns
        const requiredColumns =
            // ["Project Vendor", "Process", "Login ID", "Date", "Error Filename", "Document Number", "Document Type", "Field Name", "Line", "Error Value", "Correct Value", "Link", "Doc Link"]
            ["Audit Date", "Process", "File Name", "Document Number", "Document Type", "Field Name", "Line", "Error Value", "Correct Value", "Project Vendor", "Login Id", "HyperLink", "HyperLink Doc"]

            ;


        if (penaltyErrorUpload.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (penaltyErrorUpload.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (!acceptedExtensions.includes(fileExtension) && file !== null) {

            setPopupContentMalert("Please upload Excel File");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        } else if (file && targetPointsData.some(item => item.filename == file.name)) {

            setPopupContentMalert("Same Filename Already Exists");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else {



            const promise = new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    try {
                        const arrayBuffer = event.target.result;
                        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];

                        // Convert the sheet to JSON with raw: true to prevent automatic conversion
                        const sheetData = XLSX.utils.sheet_to_json(sheet, {
                            raw: true,     // Prevent automatic type conversion
                            defval: "",    // Handle empty cells
                        });

                        // Format date values from serial numbers to human-readable strings
                        const formattedData = sheetData.map(row => {
                            // console.log(row["Audit Date"], "type")
                            // if (typeof row.Date === 'number') {
                            // Convert the serial number to a date string (customize the format as needed)
                            const date = XLSX.SSF.format('dd-mm-yyyy', row["Audit Date"]); // Format the date to 'dd-mm-yyyy'
                            row["Audit Date"] = date; // Replace the serial number with the formatted date string
                            // }
                            return row;
                        });
                        // console.log(formattedData, "formattedData")
                        if (formattedData.length === 0) {
                            setPopupContentMalert("No Data To Upload");
                            setPopupSeverityMalert("info");
                            handleClickOpenPopupMalert();
                        } else {
                            resolve(formattedData); // Resolve the Promise with the formatted data
                        }
                    } catch (error) {
                        reject(error); // Reject the Promise if there's an error
                    }
                };

                reader.onerror = (error) => {
                    reject(error); // Handle file reading error
                };

                reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
            });

            promise.then(d => {

                let uniqueArrayfinal = []

                const firstRow = d[0];

                const missingColumns = requiredColumns.filter(column => !Object.keys(firstRow).includes(column));
                if (missingColumns.length > 0) {
                    setFileUploadName("");
                    setPopupContentMalert("Required columns are missing");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                }
                else {

                    function getDateFormat(dateValue) {

                        const patterns = [
                            //  "/" FORMAT
                            { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: "dd/MM/yyyy" },
                            { regex: /^\d{1,2}\/\d{2}\/\d{4}$/, format: "d/MM/yyyy" },
                            { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: "MM/dd/yyyy" },
                            { regex: /^\d{1,2}\/\d{2}\/\d{4}$/, format: "M/dd/yyyy" },
                            { regex: /^\[A-Za-z]{3}\/\d{2}\/\d{4}$/, format: "MMM/dd/yyyy" },
                            { regex: /^\[A-Za-z]{4,}\/\d{2}\/\d{4}$/, format: "MMMM/dd/yyyy" },
                            { regex: /^\d{4}\/\d{2}\/\d{2}$/, format: "yyyy/MM/dd" },
                            { regex: /^\d{2}\/\d{2}\/\d{2}$/, format: "yy/MM/dd" },
                            //  "-" FORMAT

                            { regex: /^\d{2}-\d{2}-\d{4}$/, format: "dd-MM-yyyy" },
                            { regex: /^\d{1,2}-\d{2}-\d{4}$/, format: "d-MM-yyyy" },
                            { regex: /^\d{2}-\d{2}-\d{4}$/, format: "MM-dd-yyyy" },
                            { regex: /^\d{1,2}-\d{2}-\d{4}$/, format: "M-dd-yyyy" },
                            { regex: /^[A-Za-z]{3}-\d{2}-\d{4}$/, format: "MMM-dd-yyyy" },
                            { regex: /^[A-Za-z]{4,}-\d{2}-\d{4}$/, format: "MMMM-dd-yyyy" },
                            { regex: /^\d{4}-\d{2}-\d{2}$/, format: "yyyy-MM-dd" },
                            { regex: /^\d{2}-\d{2}-\d{2}$/, format: "yy-MM-dd" },
                            //  "." FORMAT

                            { regex: /^\d{2}\.\d{2}\.\d{4}$/, format: "dd.MM.yyyy" },
                            { regex: /^\d{1,2}\.\d{2}\.\d{4}$/, format: "d.MM.yyyy" },
                            { regex: /^\d{2}\.\d{2}\.\d{4}$/, format: "MM.dd.yyyy" },
                            { regex: /^\d{1,2}\.\d{2}\.\d{4}$/, format: "M.dd.yyyy" },
                            { regex: /^[A-Za-z]{3}\.\d{2}\.\d{4}$/, format: "MMM.dd.yyyy" },
                            { regex: /^[A-Za-z]{4,}\.\d{2}\.\d{4}$/, format: "MMMM.dd.yyyy" },
                            { regex: /^\d{4}\.\d{2}\.\d{2}$/, format: "yyyy.MM.dd" },
                            { regex: /^\d{2}\.\d{2}\.\d{2}$/, format: "yy.MM.dd" },

                        ];

                        // Find the format of the input date
                        const foundPattern = patterns.find(p => p.regex.test(dateValue));
                        // console.log(foundPattern, "foundPattern")
                        return foundPattern ? foundPattern.format : "Unknown format";
                    }

                    let datesArray = d.map(item => (item["Audit Date"]));
                    let expectedFormat = `${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`

                    // console.log(expectedFormat, "expectedForma")



                    uniqueArrayfinal = d.filter(item => {
                        return !targetPoints.some(tp =>

                            tp.projectvendor == item["Project Vendor"] &&
                            tp.process == item["Process"] &&
                            tp.loginid == item["Login Id"] &&
                            tp.date == item["Audit Date"] &&
                            tp.errorfilename == item["File Name"] &&
                            tp.documentnumber == item["Document Number"] &&
                            tp.documenttype == item["Document Type"] &&
                            tp.fieldname == item["Field Name"] &&
                            tp.line == item["Line"] &&
                            tp.errorvalue == item["Error Value"] &&
                            tp.correctvalue == item["Correct Value"] &&
                            tp.link == item["HyperLink"] &&
                            tp.doclink == item["HyperLink Doc"]
                        );
                    });
                    console.log(d, "do")
                    console.log(uniqueArrayfinal, "uniqueArrayfinal")

                    if (uniqueArrayfinal.length !== d.length) {
                        setPopupContentMalert(uniqueArrayfinal.length != d.length ? ` Duplicate data and Points field Not a number data's are Removed` : uniqueArrayfinal.length != d.length ? `${d.length - uniqueArrayfinal.length}  Duplicate or data Removed` : ` Data's Points field is Not a Number Removed`);
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert();

                        const dataArray = uniqueArrayfinal.map((item) => {
                            return {
                                fromdate: penaltyErrorUpload.fromdate,
                                todate: penaltyErrorUpload.todate,
                                projectvendor: item["Project Vendor"],
                                process: item["Process"],
                                loginid: item["Login Id"],
                                date: item["Audit Date"],

                                errorfilename: item["File Name"],
                                documentnumber: item["Document Number"],
                                documenttype: item["Document Type"],
                                fieldname: item["Field Name"],
                                filename: file.name,
                                line: item["Line"],
                                errorvalue: item["Error Value"],
                                correctvalue: item["Correct Value"],
                                link: item["HyperLink"],
                                doclink: item["HyperLink Doc"],
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
                    }
                    else if (datesArray.some(d => getDateFormat(d) != expectedFormat)) {
                        setPopupContentMalert("Expected Date Format Does Not Match");
                        setPopupSeverityMalert("info");
                        handleClickOpenPopupMalert()
                    } else {

                        // function formatToDate(dateValue) {
                        //     dateValue = dateValue.trim(); // Remove extra spaces

                        //     // Iterate through patterns to match the date value
                        //     for (const pattern of patterns) {
                        //         if (pattern.regex.test(dateValue)) {
                        //             return convertToStandardFormat(dateValue, pattern.format);
                        //         }
                        //     }
                        //     return "Invalid date format";
                        // }

                        // function convertToStandardFormat(dateValue, format) {
                        //     let day, month, year;

                        //     // Handle different formats based on the pattern
                        //     if (format === "dd/MM/yyyy" || format === "dd-MM-yyyy" || format === "dd.MM.yyyy") {
                        //         [day, month, year] = dateValue.split(/[\/.-]/);
                        //     } else if (format === "MM/dd/yyyy" || format === "MM-dd-yyyy" || format === "MM.dd.yyyy") {
                        //         [month, day, year] = dateValue.split(/[\/.-]/);
                        //     } else if (format === "yyyy/MM/dd" || format === "yyyy-MM-dd" || format === "yyyy.MM.dd") {
                        //         [year, month, day] = dateValue.split(/[\/.-]/);
                        //     } else if (format === "yy/MM/dd" || format === "yy-MM-dd" || format === "yy.MM.dd") {
                        //         [year, month, day] = dateValue.split(/[\/.-]/);
                        //         year = "20" + year; // Assuming years starting with "20" for simplicity
                        //     } else {
                        //         return "Unsupported format";
                        //     }

                        //     // Return formatted date in "YYYY-MM-DD" format
                        //     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        // }

                        function formatToDate(dateValue, format) {
                            dateValue = dateValue.trim(); // Remove extra spaces

                            // Create regex based on the given format
                            const separator = format.includes("/") ? "/" : (format.includes("-") ? "-" : ".");
                            const regexPattern = new RegExp(format.replace(/(YYYY|MM|DD)/gi, "\\d{2,4}").replace(/[-/.]/g, `\\${separator}`));

                            // Check if the date matches the format
                            if (regexPattern.test(dateValue)) {
                                let year, month, day;
                                const dateParts = dateValue.split(separator);
                                const formatParts = format.split(separator);

                                // Compare and map parts from format to actual date value
                                formatParts.forEach((part, index) => {
                                    const upperPart = part.toUpperCase(); // Make it case-insensitive
                                    if (upperPart === "YYYY") year = dateParts[index];
                                    if (upperPart === "MM") month = dateParts[index];
                                    if (upperPart === "DD") day = dateParts[index];
                                });

                                // Return formatted date in "YYYY-MM-DD"
                                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                            }

                            return "Invalid date format";
                        }



                        const dataArray = uniqueArrayfinal.map((item) => {

                            return {
                                fromdate: penaltyErrorUpload.fromdate,
                                todate: penaltyErrorUpload.todate,
                                projectvendor: item["Project Vendor"],
                                process: item["Process"],
                                loginid: item["Login Id"],
                                date: item["Audit Date"],
                                dateformat: String(`${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`),

                                dateformatted: formatToDate(item["Audit Date"], `${yeardrop}${symboldrop}${monthdrop}${symboldrop}${datedrop}`),
                                errorfilename: item["File Name"],
                                documentnumber: item["Document Number"],
                                documenttype: item["Document Type"],
                                fieldname: item["Field Name"],
                                filename: file.name,
                                line: item["Line"],
                                errorvalue: item["Error Value"],
                                correctvalue: item["Correct Value"],
                                link: item["HyperLink"],
                                doclink: item["HyperLink Doc"],
                                mode: "Bulkupload",
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
                    }
                }

            }).catch((error) => {
                // Handle file reading error
                console.error("Error reading file:", error);
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
        } else if (penaltyErrorUpload.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (penaltyErrorUpload.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (splitArray.length === 0) {
            setPopupContentMalert("No Data To Upload");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else {
            let uploadExceldata = splitArray[selectedSheetindex];
            let uniqueArrayfinalDup = uploadExceldata.filter((item, index, self) =>
                index === self.findIndex((tp) => (
                    tp.fromdate == item.fromdate &&
                    tp.todate == item.todate &&
                    tp.projectvendor == item.projectvendor &&
                    tp.process == item.process &&
                    tp.loginid == item.loginid &&
                    tp.date == item.date &&
                    tp.errorfilename == item.errorfilename &&
                    tp.documentnumber == item.documentnumber &&
                    tp.documenttype == item.documenttype &&
                    tp.fieldname == item.fieldname &&
                    tp.line == item.line &&
                    tp.errorvalue == item.errorvalue &&
                    tp.correctvalue == item.correctvalue &&
                    tp.link == item.link &&
                    tp.doclink == item.doclink
                ))
            );
            let uniqueArrayfinal = uniqueArrayfinalDup.filter(
                item => !targetPoints.some(tp =>
                    // tp.fromdate == penaltyErrorUpload.fromdate &&
                    // tp.todate == penaltyErrorUpload.todate &&
                    tp.projectvendor == item.projectvendor &&
                    tp.process == item.process &&
                    tp.loginid == item.loginid &&
                    tp.date == item.date &&
                    tp.errorfilename == item.errorfilename &&
                    tp.documentnumber == item.documentnumber &&
                    tp.documenttype == item.documenttype &&
                    tp.fieldname == item.fieldname &&
                    tp.line == item.line &&
                    tp.errorvalue == item.errorvalue &&
                    tp.correctvalue == item.correctvalue &&
                    tp.link == item.link &&
                    tp.doclink == item.doclink
                )
            );
            let uniqueArray = uniqueArrayfinal.filter((item) => !targetPoints.some((tp) =>
                tp.fromdate == penaltyErrorUpload.fromdate &&
                tp.todate == penaltyErrorUpload.todate &&
                tp.projectvendor == item.projectvendor &&
                tp.process == item.process &&
                tp.loginid == item.loginid &&
                tp.date == item.date &&

                tp.errorfilename == item.errorfilename &&
                tp.documentnumber == item.documentnumber &&
                tp.documenttype == item.documenttype &&
                tp.fieldname == item.fieldname &&
                tp.line == item.line &&
                tp.errorvalue == item.errorvalue &&
                tp.correctvalue == item.correctvalue &&
                tp.link == item.link &&
                tp.doclink == item.doclink
            ));
            let dataArray;
            if (uniqueArrayfinal.length > 0) {
                dataArray = uniqueArray.map((item) => ({
                    fromdate: penaltyErrorUpload.fromdate,
                    todate: penaltyErrorUpload.todate,
                    projectvendor: item.projectvendor,
                    process: item.process,
                    loginid: item.loginid,
                    date: item.date,
                    errorfilename: item.errorfilename,
                    documentnumber: item.documentnumber,
                    documenttype: item.documenttype,
                    fieldname: item.fieldname,
                    line: item.line,
                    errorvalue: item.errorvalue,
                    correctvalue: item.correctvalue,
                    link: item.link,
                    doclink: item.doclink,
                    filename: item.filename,
                    dateformat: item.dateformat,
                    dateformatted: item.dateformatted,
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
                xmlhttp.open("POST", SERVICE.BULK_ERROR_UPLOADS_CREATE);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                if (uniqueArrayfinal.length > 0) {
                    xmlhttp.send(JSON.stringify(uniqueArrayfinalDup));
                }

                setLoading(false);
                setPopupContent("Uploaded Successfully");
                setPopupSeverity("success");
                setSelectedSheet("Please Select Sheet");
                setUpdatesheet(prev => [...prev, selectedSheetindex])
                handleClickOpenPopup();
                await fetchTargetPointsData1();
            } catch (err) {
            } finally {

                if (uniqueArrayfinal.length === 0) {
                    setLoading(false);
                    setPopupContentMalert("Data Already Exist!");
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    await fetchTargetPointsData1();
                } else {
                    setLoading(false);
                    setPopupContent("Uploaded Successfully");
                    setPopupSeverity("success");
                    setSelectedSheet("Please Select Sheet");
                    setUpdatesheet(prev => [...prev, selectedSheetindex])
                    handleClickOpenPopup();
                    await fetchTargetPointsData1();
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
        let fileDownloadName = "bulkerrorupload_" + "_" + today;
        if (penaltyErrorUpload.fromdate === "" || penaltyErrorUpload.todate === "") {
            let alertMsg = penaltyErrorUpload.fromdate === "" && penaltyErrorUpload.fromdate === "" ? "Please Choose From Date & To Date" : penaltyErrorUpload.fromdate === "" ? "Please Choose From Date" : "Please Choose To Date";
            setPopupContentMalert(alertMsg);
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            new CsvBuilder(fileDownloadName).setColumns(
                ["Audit Date", "Process", "File Name", "Document Number", "Document Type", "Field Name", "Line", "Error Value", "Correct Value", "Project Vendor", "Login Id", "HyperLink", "HyperLink Doc"],

                []).exportFile();
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


    const formatPresets = {
        "yyyy": { month: "MM", date: "dd" },
        "yy": { month: "MM", date: "dd" },
        "dd": { month: "MM", date: "yyyy" },
        "d": { month: "MM", date: "yyyy" },
        "M": { month: "dd", date: "yyyy" },
        "MM": { month: "dd", date: "yyyy" },
        "MMM": { month: "dd", date: "yyyy" },
        "MMMM": { month: "dd", date: "yyyy" },
    };

    // Update monthdrop and datedrop based on yeardrop
    useEffect(() => {
        if (formatPresets[yeardrop]) {
            setMonthdrop(formatPresets[yeardrop].month);
            setDatedrop(formatPresets[yeardrop].date);
        }
    }, [yeardrop]);


    const getDateRange = (mode) => {
        const today = new Date();
        let fromdate, todate;

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        switch (mode) {
            case "Today":
                fromdate = todate = formatDate(today);
                break;
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
                break;
            case "Last Week":
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                fromdate = formatDate(startOfLastWeek);
                todate = formatDate(endOfLastWeek);
                break;
            case "Last Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                break;
            default:
                fromdate = todate = "";
        }

        return { fromdate, todate };
    };


    const formatDateForInput = (date) => {
        if (isNaN(date.getTime())) {
            return ''; // Return empty if the date is invalid
        }
        return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
    };


    const fetchTargetPointsData = async (from, to) => {
        setPageName(!pageName)
        try {
            setLoader(true);
            let res_project = await axios.post(SERVICE.BULK_ERROR_UPLOADS_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: from,
                todate: to
            });

            let Resunique = await axios.get(SERVICE.BULK_ERROR_UPLOADS_FILENAME_UNIQUE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setUniqueDatas(Resunique?.data?.bulkerroruploadpoints)
            setFilter(res_project?.data?.bulkerroruploadpoints);
            let getFilenames = res_project?.data?.bulkerroruploadpoints.filter((item) => item.filename !== "nonexcel");
            const uniqueArray = Array.from(new Set(getFilenames.map((obj) => obj.filename))).map((filename) => {
                return getFilenames.find((obj) => obj.filename === filename);
            });
            // const uniqueArray = Array.from(new Set(getFilenames));
            setTargetPointsFilename(uniqueArray);
            setLoader(false);
        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleSubmitFilter = (e) => {
        e.preventDefault();

        if (fromdate === "") {
            setPopupContentMalert("Please Select From Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (todate === "") {
            setPopupContentMalert("Please Select To Date!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else if (new Date(todate) < new Date(fromdate)) {
            // Check if todate is less than fromdate
            setPopupContentMalert("To Date must be greater than or equal to From Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            // If all conditions are met, proceed with the fetch
            fetchTargetPointsData(fromdate, todate);
        }
    };



    const fetchFilteredDatas = async () => {

        setLoaderList(true);
        try {
            let subprojectscreate = await axios.post(SERVICE.BULK_ERROR_UPLOADS_FILTER_LIST, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                projectvendor: selectProjectVendor.map(item => item.value),
                process: selectedProcess.map(item => item.value),
                loginid: selectedSLoginId.map(item => item.value),
            })

            setFilterList(subprojectscreate?.data?.bulkerroruploadpoints)

            setLoaderList(false);
        } catch (err) {
            setLoaderList(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }


    }

    const handleSubmitFilterNew = (e) => {
        e.preventDefault();

        if (selectProjectVendor.length === 0) {
            setPopupContentMalert("Please Select Project Vendor!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedProcess.length === 0) {
            setPopupContentMalert("Please Select Process!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedSLoginId.length === 0) {
            setPopupContentMalert("Please Select Login ID!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            // If all conditions are met, proceed with the fetch
            fetchFilteredDatas();
        }
    };



    const handleClearFilter = (e) => {

        var today1 = new Date();
        var dd1 = String(today1.getDate()).padStart(2, "0");
        var mm1 = String(today1.getMonth() + 1).padStart(2, "0"); // January is 0!
        var yyyy1 = today1.getFullYear();
        today1 = yyyy1 + "-" + mm1 + "-" + dd1;
        setPageName(!pageName)
        // e.preventDefault();
        setFromdate(today1)
        setTodate(today1)
        setSelectedMode("Today")

        setTargetPointsFilename([])
        setFilter([])
        setPopupContentMalert("Cleared Successfully!");
        setPopupSeverityMalert("success");
        handleClickOpenPopupMalert();

    };

    const handleClearFilterNew = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        setSelectedProjectVendor([])
        setSelectedProcess([])
        setSelectedLoginId([])
        setFilterList([])
        setPopupContentMalert("Cleared Successfully!");
        setPopupSeverityMalert("success");
        handleClickOpenPopupMalert();

    };


    return (
        <Box>
            <Headtitle title={"Bulk Error Upload"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Bulk Error Upload"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Penalty Calculation"
                subsubpagename="Bulk Error Upload"
            />
            {isUserRoleCompare?.includes("abulkerrorupload") && (
                <Box sx={userStyle.selectcontainer}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Bulk Error Upload</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        From Date<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={penaltyErrorUpload.fromdate}
                                        onChange={(e) => {
                                            const newFromDate = e.target.value;
                                            setPenaltyErrorUpload((prevState) => ({
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
                                        value={penaltyErrorUpload.todate}
                                        onChange={(e) => {
                                            const selectedToDate = new Date(e.target.value);
                                            const selectedFromDate = new Date(penaltyErrorUpload.fromdate);
                                            const formattedDatePresent = new Date() // Assuming you have a function to format the current date
                                            if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                                                setPenaltyErrorUpload({
                                                    ...penaltyErrorUpload,
                                                    todate: e.target.value
                                                });
                                            } else {
                                                setPenaltyErrorUpload({
                                                    ...penaltyErrorUpload,
                                                    todate: "" // Reset to empty string if the condition fails
                                                });
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography>Date Format<b style={{ color: "red" }}>*</b></Typography>
                                <Grid container spacing={0.3}>
                                    <Grid item md={2.5} xs={4} sm={2.5}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: { maxHeight: 200, width: 80 },
                                                    },
                                                }}
                                                value={yeardrop}
                                                onChange={(e) => setYeardrop(e.target.value)}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="dd">dd</MenuItem>
                                                <MenuItem value="d">d</MenuItem>
                                                <MenuItem value="M">M</MenuItem>
                                                <MenuItem value="MM">MM</MenuItem>
                                                <MenuItem value="MMM">MMM</MenuItem>
                                                <MenuItem value="MMMM">MMMM</MenuItem>
                                                <MenuItem value="yyyy">yyyy</MenuItem>
                                                <MenuItem value="yy">yy</MenuItem>

                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={2} xs={4} sm={2.7}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: { maxHeight: 200, width: 80 },
                                                    },
                                                }}
                                                value={monthdrop}
                                                onChange={(e) => setMonthdrop(e.target.value)}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                {/* <MenuItem value="Month" disabled>Month</MenuItem> */}
                                                <MenuItem value="MM">MM</MenuItem>
                                                <MenuItem value="M">M</MenuItem>
                                                <MenuItem value="MMM">MMM</MenuItem>
                                                <MenuItem value="MMMM">MMMM</MenuItem>
                                                <MenuItem value="dd">dd</MenuItem>
                                                <MenuItem value="yyyy">yyyy</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={2.7} xs={4} sm={2}>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: { maxHeight: 200, width: 80 },
                                                    },
                                                }}
                                                value={datedrop}
                                                onChange={(e) => setDatedrop(e.target.value)}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                {/* <MenuItem value="Date" disabled>Date</MenuItem> */}
                                                <MenuItem value="dd">dd</MenuItem>
                                                <MenuItem value="d">d</MenuItem>
                                                <MenuItem value="yyyy">yyyy</MenuItem>
                                                <MenuItem value="yy">yy</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>






                                    <Grid item md={1.8} xs={3} sm={1.8}>
                                        <FormControl fullWidth size="small">
                                            {/* <Typography>Excel Date Format</Typography> */}
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                //   disabled={fileLength > 0}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={symboldrop}
                                                onChange={(e) => {
                                                    setSymboldrop(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="/" disabled>
                                                    {" "}
                                                    {"/"}{" "}
                                                </MenuItem>
                                                <MenuItem value="/"> {"/"} </MenuItem>
                                                <MenuItem value="."> {"."} </MenuItem>
                                                <MenuItem value="-"> {"-"} </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={4} sm={3}>
                                        <FormControl fullWidth size="small">
                                            {/* <Typography>Excel Date Format</Typography> */}
                                            <Select
                                                fullWidth
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                disabled={fileLength > 0}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={hoursdrop}
                                                onChange={(e) => {
                                                    setHoursdrop(e.target.value);
                                                }}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem value="Hours" disabled>
                                                    {"Hours"}{" "}
                                                </MenuItem>
                                                <MenuItem value="12 Hours"> {"12 Hours"} </MenuItem>
                                                <MenuItem value="24 Hours"> {"24 Hours"} </MenuItem>
                                                <MenuItem value="NAN"> {"NAN"} </MenuItem>
                                            </Select>
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
                                    penaltyErrorUpload.projectvendor !== "Please Select Project Vendor" ||
                                    penaltyErrorUpload.process !== "Please Select Process" ||
                                    penaltyErrorUpload.loginid !== "Please Select Login ID" ||
                                    penaltyErrorUpload.date != "" ||
                                    penaltyErrorUpload.errorfilename != "" ||
                                    penaltyErrorUpload.documentnumber != "" ||
                                    penaltyErrorUpload.documenttype != "" ||
                                    penaltyErrorUpload.fieldname != "" ||
                                    penaltyErrorUpload.line != "" ||
                                    penaltyErrorUpload.errorvalue != "" ||
                                    penaltyErrorUpload.correctvalue != "" ||
                                    penaltyErrorUpload.link != "" ||
                                    penaltyErrorUpload.doclink != ""
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
                                            penaltyErrorUpload.projectvendor !== "Please Select Project Vendor" ||
                                            penaltyErrorUpload.process !== "Please Select Process" ||
                                            penaltyErrorUpload.loginid !== "Please Select Login ID" ||
                                            penaltyErrorUpload.date != "" ||
                                            penaltyErrorUpload.errorfilename != "" ||
                                            penaltyErrorUpload.documentnumber != "" ||
                                            penaltyErrorUpload.documenttype != "" ||
                                            penaltyErrorUpload.fieldname != "" ||
                                            penaltyErrorUpload.line != "" ||
                                            penaltyErrorUpload.errorvalue != "" ||
                                            penaltyErrorUpload.correctvalue != "" ||
                                            penaltyErrorUpload.link != "" ||
                                            penaltyErrorUpload.doclink != ""
                                        } component="label" sx={{ textTransform: "capitalize" }}>
                                            Choose File
                                            <input
                                                hidden
                                                type="file"
                                                accept=".xlsx, .xls , .csv"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    setFileUploadName(file.name);
                                                    setDataupdated("uploaded");
                                                    readExcel(file);
                                                    setSheets([]);

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
                                    penaltyErrorUpload.projectvendor !== "Please Select Project Vendor" ||
                                    penaltyErrorUpload.process !== "Please Select Process" ||
                                    penaltyErrorUpload.loginid !== "Please Select Login ID" ||
                                    penaltyErrorUpload.date != "" ||
                                    penaltyErrorUpload.errorfilename != "" ||
                                    penaltyErrorUpload.documentnumber != "" ||
                                    penaltyErrorUpload.documenttype != "" ||
                                    penaltyErrorUpload.fieldname != "" ||
                                    penaltyErrorUpload.line != "" ||
                                    penaltyErrorUpload.errorvalue != "" ||
                                    penaltyErrorUpload.correctvalue != "" ||
                                    penaltyErrorUpload.link != "" ||
                                    penaltyErrorUpload.doclink != ""
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
                                        <Typography> Project Vendor<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={projOpt}
                                                isDisabled={fileUploadName != "" && splitArray.length > 0}
                                                value={{ label: penaltyErrorUpload.projectvendor, value: penaltyErrorUpload.projectvendor }}
                                                onChange={((e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        projectvendor: e.value,
                                                        process: "Please Select Process",
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
                                        <Typography> Process<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={processOpt}
                                                isDisabled={fileUploadName != "" && splitArray.length > 0}
                                                value={{ label: penaltyErrorUpload.process, value: penaltyErrorUpload.process }}
                                                onChange={((e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        process: e.value,
                                                        loginid: "Please Select Login ID",
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
                                        <Typography>Login ID<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                maxMenuHeight={300}
                                                options={loginIdOpt}
                                                isDisabled={fileUploadName != "" && splitArray.length > 0}
                                                value={{ label: penaltyErrorUpload.loginid, value: penaltyErrorUpload.loginid }}
                                                onChange={((e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
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
                                        <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.date}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
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
                                        <Typography>Error FileName<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Error FileName"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.errorfilename}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        errorfilename: e.target.value
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={4} xs={12} sm={6}></Grid>
                            <Grid item md={4} xs={12} sm={6}>
                                <Grid container>
                                    <Grid item md={5} xs={12} sm={6}>
                                        <Typography>Document Number<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Document Number"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.documentnumber}
                                                // onChange={(e) => {
                                                //     const enteredValue = e.target.value
                                                //         .replace(/\D/g, "")
                                                //     //   .slice(0, 2);
                                                //     if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                                //         setPenaltyErrorUpload({
                                                //             ...penaltyErrorUpload,
                                                //             documentnumber: enteredValue
                                                //         })
                                                //     }
                                                // }}
                                                onChange={(e) => {

                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        documentnumber: e.target.value
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
                                        <Typography>Document Type<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Document Type"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.documenttype}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        documenttype: e.target.value
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
                                        <Typography>Field Name<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Field Name"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.fieldname}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        fieldname: e.target.value
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
                                        <Typography>Line<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Line"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.line}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        line: e.target.value
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
                                        <Typography>Error Value<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Error Value"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.errorvalue}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        errorvalue: e.target.value
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
                                        <Typography>Correct Value<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Correct Value"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.correctvalue}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        correctvalue: e.target.value
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
                                        <Typography>Link<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Link"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.link}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        link: e.target.value
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
                                        <Typography>Doc Link<b style={{ color: "red" }}>*</b></Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Doc Link"
                                                disabled={fileUploadName != "" && splitArray.length > 0}
                                                value={penaltyErrorUpload.doclink}
                                                onChange={(e) => {
                                                    setPenaltyErrorUpload({
                                                        ...penaltyErrorUpload,
                                                        doclink: e.target.value
                                                    })
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
            <br />
            <Box sx={userStyle.selectcontainer}>
                <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                            <Typography>
                                Filter Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                                labelId="mode-select-label"
                                options={mode}
                                style={colourStyles}
                                value={{ label: selectedMode, value: selectedMode }}
                                onChange={(selectedOption) => {
                                    // Reset the date fields to empty strings
                                    let fromdate = '';
                                    let todate = '';

                                    // If a valid option is selected, get the date range
                                    if (selectedOption.value) {
                                        const dateRange = getDateRange(selectedOption.value);
                                        fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                                        todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                                    }



                                    setFromdate(formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))))
                                    setTodate(formatDateForInput(new Date(todate.split('-').reverse().join('-'))))

                                    setSelectedMode(selectedOption.value); // Update the mode
                                }}
                            />
                        </FormControl>


                    </Grid>


                    <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                            <Typography>
                                From Date
                            </Typography>
                            <OutlinedInput
                                id="component-outlinedname"
                                type="date"
                                value={fromdate}
                                disabled={selectedMode != "Custom"}
                                onChange={(e) => {
                                    setFromdate(e.target.value);
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                            <Typography>
                                To  Date
                            </Typography>
                            <OutlinedInput
                                id="component-outlinedname123"
                                type="date"
                                value={todate}
                                disabled={selectedMode != "Custom"}
                                onChange={(e) => {
                                    setTodate(e.target.value);
                                }}
                            />
                        </FormControl>

                    </Grid>
                    <Grid item lg={1} md={2} sm={2} xs={12} >
                        <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmitFilter}>
                                Filter
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item lg={1} md={2} sm={2} xs={12} >
                        <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                            <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                                Clear
                            </Button>
                        </Box>
                    </Grid>

                </Grid>




            </Box>


            <br /> <br />
            {/* ****** Table Start ****** */}
            {loader ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (<>
                {isUserRoleCompare?.includes("lbulkerrorupload") && (
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
                                        {isUserRoleCompare?.includes("excelbulkerrorupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen1(true)
                                                    // fetchTargetPointsData1()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvbulkerrorupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen1(true)
                                                    // fetchTargetPointsData1()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printbulkerrorupload") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintFilename}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfbulkerrorupload") && (
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
                                        {isUserRoleCompare?.includes("imagebulkerrorupload") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageFilename}>
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar columnDataTable={columnDataTableFilename}
                                        setItems={setItemsFilename}
                                        addSerialNumber={addSerialNumberFilename}
                                        setPage={setPageFilename}
                                        maindatas={targetPointsFilename} setSearchedString={setSearchedStringFilename}
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
                            {loader ? (
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
                {isUserRoleCompare?.includes("lbulkerrorupload") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>Upload Data List</Typography>
                            </Grid>

                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project Vendor<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            maxMenuHeight={300}
                                            options={projOpt}
                                            // value={{ label: penaltyErrorUploadFilter.projectvendor, value: penaltyErrorUploadFilter.projectvendor }}
                                            // onChange={((e) => {
                                            //     setPenaltyErrorUploadFilter({
                                            //         ...penaltyErrorUploadFilter,
                                            //         projectvendor: e.value,
                                            //         process: "Please Select Process",
                                            //         loginid: "Please Select Login ID",
                                            //     })
                                            //     fetchClientUserID(e.value);
                                            //     fetchProcessQueue(e.value);
                                            // })}

                                            styles={colourStyles}
                                            value={selectProjectVendor}
                                            onChange={handleProjecvendor}
                                            valueRenderer={customValueRendererProject}
                                            labelledBy="Please Select ProjectVendor"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Process<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            maxMenuHeight={300}
                                            options={processOptFilter}
                                            // value={{ label: penaltyErrorUploadFilter.process, value: penaltyErrorUploadFilter.process }}
                                            // onChange={((e) => {
                                            //     setPenaltyErrorUploadFilter({
                                            //         ...penaltyErrorUploadFilter,
                                            //         process: e.value,
                                            //         loginid: "Please Select Login ID",
                                            //     })
                                            // })}



                                            styles={colourStyles}
                                            value={selectedProcess}
                                            onChange={handleProcess}
                                            valueRenderer={customValueRendererProcess}
                                            labelledBy="Please Select Process"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Login Id<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            maxMenuHeight={300}
                                            options={loginIdOptFilter}
                                            // value={{ label: penaltyErrorUploadFilter.loginid, value: penaltyErrorUploadFilter.loginid }}
                                            // onChange={((e) => {
                                            //     setPenaltyErrorUpload({
                                            //         ...penaltyErrorUploadFilter,
                                            //         loginid: e.value
                                            //     })
                                            // })}
                                            styles={colourStyles}
                                            value={selectedSLoginId}
                                            onChange={handleLoginId}
                                            valueRenderer={customValueLoginId}
                                            labelledBy="Please Select LoginId"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={1} xs={12} sm={12} marginTop={3}>
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit}
                                        onClick={handleSubmitFilterNew}
                                    >
                                        Filter
                                    </Button>
                                </Grid>
                                <Grid item md={0.5} xs={12} sm={12} marginTop={3}>
                                    <Button onClick={handleClearFilterNew} sx={buttonStyles.btncancel}>
                                        Clear
                                    </Button>
                                </Grid>

                            </Grid>
                            <br />
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
                                            <MenuItem value={filterList?.length}>All</MenuItem>

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
                                        {isUserRoleCompare?.includes("excelbulkerrorupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen2(true)
                                                    // fetchTargetPointsData2()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvbulkerrorupload") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen2(true)
                                                    // fetchTargetPointsData2()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printbulkerrorupload") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfbulkerrorupload") && (
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
                                        {isUserRoleCompare?.includes("imagebulkerrorupload") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber}
                                        setPage={setPage} maindatas={filterList} setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={overallItems}
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
                            {isUserRoleCompare?.includes("bdbulkerrorupload") && (
                                <Button variant="contained" color="error" size="small" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                                    Bulk Delete
                                </Button>)}
                            <br />
                            <br />
                            {loaderList ? (
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
                                    getRowId={(params) => params.data.id}
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
                )} </>)}
            {/* ****** Table End ****** */}
            {/* print layout */}
            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={6}>
                            <Typography sx={userStyle.HeaderText}>View Bulk Error Upload</Typography>
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
                                <Typography variant="h6">Process</Typography>
                                <Typography>{viewsingleData.process}</Typography>
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
                                <Typography variant="h6">Date</Typography>
                                <Typography>{formattedViewDate}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Error File Name</Typography>
                                <Typography>{viewsingleData.errorfilename}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Document Number</Typography>
                                <Typography>{viewsingleData.documentnumber}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Document Type</Typography>
                                <Typography>{viewsingleData.documenttype}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Field Name </Typography>
                                <Typography>{viewsingleData.fieldname}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Line</Typography>
                                <Typography>{viewsingleData.line}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Error Value</Typography>
                                <Typography>{viewsingleData.errorvalue}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Correcr Value</Typography>
                                <Typography>{viewsingleData.correctvalue}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Link</Typography>
                                <Typography>{viewsingleData.link}</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography variant="h6">Doc Link</Typography>
                                <Typography>{viewsingleData.doclink}</Typography>
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
                            <Typography sx={userStyle.HeaderText}>Edit Bulk Error Upload</Typography>
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
                                            process: "Please Select Process",
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
                                <Typography>Process<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    maxMenuHeight={300}
                                    options={processOptEdit}
                                    value={{ label: editsingleData.process, value: editsingleData.process }}
                                    onChange={((e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            process: e.value,
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
                                <Typography>Error Filename<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Error Filename"
                                    value={editsingleData.errorfilename}
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            errorfilename: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Document Number<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Document Number"
                                    value={editsingleData.documentnumber}
                                    onChange={(e) => {
                                        // const enteredValue = e.target.value
                                        //     .replace(/\D/g, "")
                                        // if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                        setEditsingleData({
                                            ...editsingleData,
                                            documentnumber: e.target.value
                                        })
                                        // }
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Document Type<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.documenttype}
                                    placeholder="Please Enter Document Type"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            documenttype: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Field Name<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.fieldname}
                                    placeholder="Please Enter Field Name"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            fieldname: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Line<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.line}
                                    placeholder="Please Enter Line"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            line: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Value<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.errorvalue}
                                    placeholder="Please Enter Error Value"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            errorvalue: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Correct Value<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.correctvalue}
                                    placeholder="Please Enter Correct Value"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            correctvalue: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Link<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.link}
                                    placeholder="Please Enter Link"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            link: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Doc Link<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.doclink}
                                    placeholder="Please Enter Doc Link"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            doclink: e.target.value
                                        })
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


            {/* view edit dialog */}

            <Dialog open={isEditOpenView} onClose={handleCloseModEditView} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true} sx={{ marginTop: '50px' }}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} sm={6}>
                            <Typography sx={userStyle.HeaderText}>Edit View Bulk Error Upload</Typography>
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
                                            process: "Please Select Process",
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
                                <Typography>Process<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    maxMenuHeight={300}
                                    options={processOptEdit}
                                    value={{ label: editsingleData.process, value: editsingleData.process }}
                                    onChange={((e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            process: e.value,
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
                                <Typography>Error Filename<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Error Filename"
                                    value={editsingleData.errorfilename}
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            errorfilename: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Document Number<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    placeholder="Please Enter Document Number"
                                    value={editsingleData.documentnumber}
                                    onChange={(e) => {
                                        // const enteredValue = e.target.value
                                        //     .replace(/\D/g, "")
                                        // //   .slice(0, 2);
                                        // if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                                        setEditsingleData({
                                            ...editsingleData,
                                            documentnumber: e.target.value
                                        })
                                        // }
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Document Type<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.documenttype}
                                    placeholder="Please Enter Document Type"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            documenttype: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Field Name<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.fieldname}
                                    placeholder="Please Enter Field Name"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            fieldname: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Line<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.line}
                                    placeholder="Please Enter Line"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            line: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Error Value<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.errorvalue}
                                    placeholder="Please Enter Error Value"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            errorvalue: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Correct Value<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.correctvalue}
                                    placeholder="Please Enter Correct Value"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            correctvalue: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Link<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.link}
                                    placeholder="Please Enter Link"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            link: e.target.value
                                        })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <Typography>Doc Link<b style={{ color: "red" }}>*</b></Typography>
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={editsingleData.doclink}
                                    placeholder="Please Enter Doc Link"
                                    onChange={(e) => {
                                        setEditsingleData({
                                            ...editsingleData,
                                            doclink: e.target.value
                                        })
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
                                    {isUserRoleCompare?.includes("excelbulkerrorupload") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen3(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvbulkerrorupload") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen3(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printbulkerrorupload") && (
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
                                    {isUserRoleCompare?.includes("pdfbulkerrorupload") && (
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
                                    {isUserRoleCompare?.includes("imagebulkerrorupload") && (
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
                                <AggregatedSearchBar columnDataTable={columnDataTableviewAll} setItems={setItemsviewAll}
                                    addSerialNumber={addSerialNumberviewAll} setPage={setPageviewAll} maindatas={productionoriginalviewAll} setSearchedString={setSearchedStringviewAll}
                                    searchQuery={searchQueryviewAll}
                                    setSearchQuery={setSearchQueryviewAll}
                                    paginated={false}
                                    totalDatas={overallItemsViewAll}
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
                                    itemsList={overallItemsViewAll}
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
                // filteredDataTwo={targetPointsFilename ?? []}
                filteredDataTwo={(filteredChangesFilename !== null ? filteredRowDataFilename : rowDataTableFilename) ?? []}
                itemsTwo={targetPointsFilenameArray ?? []}
                filename={"Upload File List"}
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
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={filterList ?? []}
                filename={"Upload Data List"}
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
                filteredDataTwo={rowDataTableviewAll ?? []}
                itemsTwo={productionoriginalviewAll ?? []}
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
                heading="Bulk Error Upload Info"
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
export default BulkErrorUpload;