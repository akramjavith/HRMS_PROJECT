import React, { useState, useContext, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    Dialog,
    TextField,
    List,
    ListItem,
    ListItemText,
    Popover,
    IconButton,
    TableBody,
    Checkbox,
    TextareaAutosize,
    FormControlLabel,
    TableRow,
    TableCell,
    Select,
    MenuItem,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Paper,
    Table,
    TableHead,
    TableContainer,
    Button,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import LoadingButton from "@mui/lab/LoadingButton";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { FaPrint, FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { DataGrid } from "@mui/x-data-grid";
import Resizable from "react-resizable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { styled } from "@mui/system";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Selects from "react-select";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
    UserRoleAccessContext,
    AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import { makeStyles } from "@material-ui/core";
import fileIcon from "../../../components/Assets/file-icons.png";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { debounce } from 'lodash';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";


function ManulErrorUpdate() {

    const [fileFormat, setFormat] = useState("");

    const [manualError, setManualError] = useState([])

    const [dateCount, setDateCount] = useState("")


    const [filterUser, setFilterUser] = useState({ fromdate: "", todate: "", });

    const [selectedMode, setSelectedMode] = useState("Last Week");
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


    const exportColumnNames = [
        'Employee Name', 'Branch', 'Unit',
        'Project Vendor', 'Date',
        'Queue Name', 'Login ID',
        'Accuracy', 'Total Fields', 'Error Count', 'Auto Count', 'Upload Count'
    ]
    const exportRowValues = [
        'name', 'branch', 'unit',
        'projectvendor', 'date',
        'queuename', 'loginid',
        'accuracy', 'totalfields', 'errorcount', 'autocount', 'uploadcount'
    ]



    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);


    const [loader, setLoader] = useState(false);
    const [noticeHierarchy, setNoticeHierarchy] = useState([]);
    const gridRef = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, listPageAccessMode } =
        useContext(UserRoleAccessContext);


    let today = new Date();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    let todayEdit = new Date();
    var ddEdit = String(todayEdit.getDate()).padStart(2, "0");
    var mmEdit = String(todayEdit.getMonth() + 1).padStart(2, "0");
    var yyyyEdit = todayEdit.getFullYear();
    let formattedDateEdit = yyyyEdit + "-" + mmEdit + "-" + ddEdit;
    const [noticePeriodEdit, setNoticeperiodEdit] = useState({
        empcode: "",
        empname: "",
        noticedate: formattedDateEdit,
        name: "",
        reasonleavingname: "Please Select Reason",
        other: "",
    });

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, 'Manual Error Upadate.png');
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };



    // State for manage columns search query
    const [searchQueryManage, setSearchQueryManage] = useState("");
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
    const ids = open ? "simple-popover" : undefined;

    const [selectedRows, setSelectedRows] = useState([]);

    // let username = isUserRoleAccess.username
    const id = useParams().id;
    // const classes = useStyles();



    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        name: true,
        branch: true,
        unit: true,
        projectvendor: true,
        date: true,
        queuename: true,
        loginid: true,
        accuracy: true,
        totalfields: true,
        errorcount: true,
        autocount: true,
        manualerror: true,
        uploadcount: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;



    //id for login...;
    let loginid = localStorage.LoginUserId;
    let authToken = localStorage.APIToken;

    //Boardingupadate updateby edit page...
    let updateby = noticePeriodEdit?.updatedby;
    let addedby = noticePeriodEdit?.addedby;






    // Excel
    const fileName = "Manul Error Update";
    let excelno = 1;

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Manul Error Update",
        pageStyle: "print",
    });


    // console.log(manualError, "manualError")

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        // const itemsWithSerialNumber = datas?.map((item, index) => ({
        //     ...item,
        //     serialNumber: index + 1,
        //     date: moment(item.date).format("DD-MM-YYYY")
        // }));
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(manualError);
    }, [manualError]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    //datatable....
    const [searchQuery, setSearchQuery] = useState("");
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

    const totalPages = Math.ceil(noticeHierarchy.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const [maualerroredit, setManualerroredit] = useState("")




    const sendEditRequest = async (id, manualvalue) => {

        setManualerroredit(id)
        // setLoader(true)
        let editid = id;
        setPageName(!pageName)
        try {
            if (manualvalue === "" || manualvalue == undefined) {

                setPopupContent("Please Enter Value");
                setPopupSeverity("warning");
                handleClickOpenPopup();
            } else {


                let res = await axios.put(`${SERVICE.PENALTYTOTALFIELDUPLOAD_SINGLE}/${editid}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                    manualerror: String(manualvalue),
                    isedited: true,

                });

                await fetchManulError();
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                setManualerroredit("")
            }
            // setLoader(false)
        } catch (err) {
            setManualerroredit("")
            // setLoader(false);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };





    const [editsingleData, setEditsingleData] = useState({
        // manualerror: ""
    });



    const handleRateChange = debounce((id, value) => {
        setEditsingleData((prevRates) => ({
            ...prevRates,
            [id]: value,
        }));
    }, 300);



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
            field: "name",
            headerName: "Employee Name",
            flex: 0,
            width: 130,
            hide: !columnVisibility.name,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 130,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 130,
            hide: !columnVisibility.unit,
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
            headerName: "Manual Error (Editable)",
            field: "manualerror",
            editable: true,
            suppressClickEdit: true,
            sortable: true,
            filter: true,
            resizable: true,
            cellEditor: "agTextCellEditor",
            suppressDestroy: true,
        },
        {
            field: "uploadcount",
            headerName: "Upload Count",
            flex: 0,
            width: 150,
            hide: !columnVisibility.uploadcount,
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
                <>
                    {isUserRoleCompare?.includes("emanualerrorupdate") && (
                        <Grid sx={{ display: "flex" }}>

                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => {
                                    sendEditRequest(params.data.id, params.data.manualerror);
                                }}
                            >
                                UPDATE
                            </Button>

                        </Grid>
                    )}
                </>
            ),
        }
    ];


    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            name: item.name,
            branch: item.branch,
            unit: item.unit,
            projectvendor: item.projectvendor,
            date: item.date,
            queuename: item.queuename,
            loginid: item.loginid,
            accuracy: item.accuracy,
            totalfields: item.totalfields,
            errorcount: item.errorcount,
            manualerror: item.manualerror,
            // uploadcount: dateCount[item.date],
            uploadcount: item.uploadcount,

            // autocount: typeof item.autocount === 'number' ? item.autocount.toFixed(2) : item.autocount,
            autocount: typeof item.autocount === 'number'
                ? parseFloat(item.autocount.toFixed(2)).toString()
                : item.autocount,
        };
    });

    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box
            sx={{
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
                    {filteredColumns?.map((column) => (
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
                                secondary={column.headerName}
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
                            onClick={() => setColumnVisibility({})}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );






    // console.log(dateCount, "dateCount")


    const fetchManulError = async () => {
        setPageName(!pageName)
        setLoader(true)
        try {
            let Res = await axios.post(SERVICE.PENALTYTOTALFIELDUPLOAD_LOGIN_PROJECT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                companyname: isUserRoleAccess.companyname,
                branch: isUserRoleAccess.branch,
                unit: isUserRoleAccess.unit,
                fromdate: filterUser.fromdate,
                todate: filterUser.todate,
                page: page,
                pageSize: pageSize
            });
            let finalData = Res?.data?.errormodes.filter(data => data.name === isUserRoleAccess.companyname)

            // console.log(finalData, "finalData")

            setManualError(finalData?.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,
                date: moment(item.date).format("DD-MM-YYYY")
            })))



            // const result = finalData.reduce((acc, curr) => {
            //     const date = curr.date;
            //     if (acc[date]) {
            //         acc[date] += 1;
            //     } else {
            //         acc[date] = 1;
            //     }
            //     return acc;
            // }, {});


            // setDateCount(result)


            setLoader(false)
        } catch (err) {
            setLoader(false)
            console.log(err, 'err')
            // setTableOneLoader(true); setTableTwoLoader(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

    };

    // useEffect(() => {
    //     fetchManulError();
    // }, [])

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


    const handleFilterSubmitOne = (e) => {
        e.preventDefault();
        if (filterUser.fromdate === '' && filterUser.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            fetchManulError();
        }
    };

    const handleFilterClearOne = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        setSelectedMode("Last Week");
        const today = new Date();

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        // if (selectedMode === "Last Week") {
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        setFilterUser({ fromdate: formatDate(startOfLastWeek), todate: formatDate(endOfLastWeek) })
        // }
        setManualError([])
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    return (
        <Box>
            <Headtitle title={"Manual Error Update"} />
            {/* <Typography sx={userStyle.HeaderText}>
                Manul Error Update
                <Typography sx={userStyle.SubHeaderText}></Typography>
            </Typography> */}
            <PageHeading
                title=" Manual Error Update"
                modulename="Quality"
                submodulename="Penalty"
                mainpagename="Penalty Setup"
                subpagename="Penalty Calculation"
                subsubpagename="Manual Error Update"
            />

            <Box sx={userStyle.container}>
                <Box>
                    {/* ****** Header Content ****** */}
                    <Typography sx={userStyle.HeaderText}>
                        Manual Error Update List
                    </Typography>
                    {isUserRoleCompare?.includes("lmanualerrorupdate") && (
                        <>
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}></Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography> Filter Mode<b style={{ color: "red" }}>*</b> </Typography>
                                            <Selects
                                                labelId="mode-select-label"
                                                options={mode}
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
                                                    // Set the state with formatted dates
                                                    setFilterUser({
                                                        ...filterUser,
                                                        fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                                        todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                                    });
                                                    setSelectedMode(selectedOption.value); // Update the mode
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography> From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                disabled={selectedMode != "Custom"}
                                                value={filterUser.fromdate}
                                                onChange={(e) => {
                                                    const selectedDate = e.target.value;
                                                    // Ensure that the selected date is not in the future
                                                    const currentDate = new Date().toISOString().split("T")[0];
                                                    if (selectedDate <= currentDate) {
                                                        setFilterUser({ ...filterUser, fromdate: selectedDate, todate: selectedDate });
                                                    } else {
                                                        // Handle the case where the selected date is in the future (optional)
                                                        // You may choose to show a message or take other actions.
                                                    }
                                                }}
                                                // Set the max attribute to the current date
                                                inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>{" "} To Date<b style={{ color: "red" }}>*</b>{" "}</Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                disabled={selectedMode != "Custom"}
                                                value={filterUser.todate}
                                                onChange={(e) => {
                                                    const selectedDate = e.target.value;
                                                    // Ensure that the selected date is not in the future
                                                    const currentDate = new Date().toISOString().split("T")[0];
                                                    const fromdateval = filterUser.fromdate != "" && new Date(filterUser.fromdate).toISOString().split("T")[0];
                                                    if (filterUser.fromdate == "") {
                                                        setPopupContentMalert("Please Select From Date");
                                                        setPopupSeverityMalert("warning");
                                                        handleClickOpenPopupMalert();
                                                    } else if (selectedDate < fromdateval) {
                                                        setFilterUser({ ...filterUser, todate: "" });
                                                        setPopupContentMalert("To Date should be after or equal to From Date");
                                                        setPopupSeverityMalert("warning");
                                                        handleClickOpenPopupMalert();
                                                    } else if (selectedDate <= currentDate) {
                                                        setFilterUser({ ...filterUser, todate: selectedDate });
                                                    } else {
                                                    }
                                                }}
                                                // Set the max attribute to the current date
                                                inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={1} md={1} sm={1} xs={6} >
                                        <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                            <Button onClick={handleFilterSubmitOne} sx={buttonStyles.buttonsubmit} variant="contained" >Filter</Button>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={1} md={1} sm={1} xs={6} >
                                        <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                            <Button onClick={handleFilterClearOne} sx={buttonStyles.btncancel}>Clear</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <br />
                                <br />
                                <Grid container sx={{ justifyContent: "center" }}>
                                    <Grid>
                                        {isUserRoleCompare?.includes(
                                            "csvmanualerrorupdate"
                                        ) && (
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
                                        {isUserRoleCompare?.includes(
                                            "excelmanualerrorupdate"
                                        ) && (
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
                                        {isUserRoleCompare?.includes(
                                            "printmanualerrorupdate"
                                        ) && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "pdfmanualerrorupdate"
                                        ) && (
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
                                        {isUserRoleCompare?.includes(
                                            "imagemanualerrorupdate"
                                        ) && (
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleCaptureImage}
                                                >
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                    &ensp;Image&ensp;{" "}
                                                </Button>
                                            )}
                                    </Grid>
                                </Grid>
                                <br />
                                {/* added to the pagination grid */}
                                <Grid style={userStyle.dataTablestyle}>
                                    <Box>
                                        <label htmlFor="pageSizeSelect">Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSize}
                                            onChange={handlePageSizeChange}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            {/* <MenuItem value={employeesList.length}>All</MenuItem> */}
                                        </Select>
                                    </Box>
                                    <Box>

                                        <AggregatedSearchBar
                                            columnDataTable={columnDataTable}
                                            setItems={setItems}
                                            addSerialNumber={addSerialNumber}
                                            setPage={setPage}
                                            maindatas={manualError}
                                            setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={manualError}
                                        />
                                    </Box>
                                </Grid>
                                {/* ****** Table Grid Container ****** */}
                                <Grid container>
                                    <Grid md={4} sm={2} xs={1}></Grid>
                                    <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
                                </Grid>
                                <br />
                                {/* ****** Table start ****** */}
                                <Button
                                    sx={userStyle.buttongrp}
                                    onClick={() => {
                                        handleShowAllColumns();
                                        setColumnVisibility(initialColumnVisibility);
                                    }}
                                >
                                    Show All Columns
                                </Button>
                                &ensp;
                                <Button
                                    sx={userStyle.buttongrp}
                                    onClick={handleOpenManageColumns}
                                >
                                    Manage Columns
                                </Button>
                                <br />
                                <>
                                    {loader ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                minHeight: "350px",
                                            }}
                                        >
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
                                            {/* <FacebookCircularProgress /> */}
                                        </Box>
                                    ) : (
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
                                                itemsList={manualError}
                                            />

                                        </>
                                    )}
                                    <br /> <br />
                                </>
                            </Box>
                            <br />
                        </>
                    )}
                    {/* Manage Column */}
                    <Popover
                        id={ids}
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

                    <br />


                    <ExportData
                        isFilterOpen={isFilterOpen}
                        handleCloseFilterMod={handleCloseFilterMod}
                        fileFormat={fileFormat}
                        setIsFilterOpen={setIsFilterOpen}
                        isPdfFilterOpen={isPdfFilterOpen}
                        setIsPdfFilterOpen={setIsPdfFilterOpen}
                        handleClosePdfFilterMod={handleClosePdfFilterMod}
                        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                        itemsTwo={manualError ?? []}
                        filename={"Manual Error Update"}
                        exportColumnNames={exportColumnNames}
                        exportRowValues={exportRowValues}
                        componentRef={componentRef}
                    />

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

                </Box>
            </Box>
        </Box>
    );
}

export default ManulErrorUpdate;
