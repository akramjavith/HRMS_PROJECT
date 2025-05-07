import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, Checkbox, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import moment from "moment-timezone";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

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
        complete: {
            textTransform: "capitalize !IMPORTANT",
            padding: "7px 19px",
            backgroundColor: "#00905d",
            height: "fit-content",
        },
    },
}));

function TaskForUserOnProgress({ com }) {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        // setSubmitLoader(false);
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
        'Task Status', 'Task Date',
        'Task Time', 'Priority',
        'Task Details', 'Frequency',
        'Schedule', 'Task',
        'Sub Task', 'Duration',
        'Break Up', 'Required'
    ];
    let exportRowValues = [
        'taskstatus',
        'taskassigneddate',
        'tasktime',
        'priority',
        'taskdetails',
        'frequency',
        'schedule',
        'category',
        'subcategory',
        'duration',
        'breakup',
        'required'
    ];
    const classes = useStyles();
    const [raiseTicketList, setRaiseTicketList] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName,
        setPageName,
        buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    //Datatable
    const [queueCheck, setQueueCheck] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [items, setItems] = useState([]);
    const [sorting, setSorting] = useState({ column: "", direction: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    // Error Popup model
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };




    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };


    const navigate = useNavigate();

    const buttonStyle = {
        color: "black",
        "&:hover": {
            backgroundColor: "transparent",
        },
    };

    const checkCurrentDate = new Date();

    // get current time
    const currentHours = checkCurrentDate.getHours();
    const currentMinutes = checkCurrentDate.getMinutes();

    // Determine whether it's AM or PM
    const currentperiod = currentHours >= 12 ? "PM" : "AM";


    // Format the current time manually
    const formattedHours = currentHours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes =
        currentMinutes >= 10 ? currentMinutes : "0" + currentMinutes;
    const currentTime = `${formattedHours}:${formattedMinutes}${currentperiod}`;

    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
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
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
    };

    const backPage = useNavigate();
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;


    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const dataGridStyles = {
        root: {
            "& .MuiDataGrid-row": {
                height: "15px",
            },
        },
    };






    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        taskstatus: true,
        taskassigneddate: true,
        checkbox: true,
        serialNumber: true,
        frequency: true,
        category: true,
        subcategory: true,
        subsubcategory: true,
        schedule: true,
        duration: true,
        type: true,
        priority: true,
        required: true,
        taskdetails: true,
        tasktime: true,
        breakup: true,
        description: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const convertTimeToAMPMFormat = (time) => {
        let [hour, minute] = time.split(':').map(Number);
        let timetype = 'AM';

        if (hour >= 12) {
            timetype = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }

        if (hour === 0) {
            hour = 12;
        }

        return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute} ${timetype}`;
    };


    //serial no for listing items
    const addSerialNumber = (data) => {
        setItems(data);
    };
    useEffect(() => {
        addSerialNumber(raiseTicketList);
    }, [raiseTicketList]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
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

    const columnDataTable = [
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
            headerName: "S.No",
            flex: 0,
            width: 50,
            hide: !columnVisibility.serialNumber,
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 100,
            sortable: false,
            hide: !columnVisibility.actions,
            pinned: "left",
            lockPinned: true,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    {isUserRoleCompare?.includes("vtaskuserpanel") && (
                        <Link to={`/task/taskuserpanelview/${params.data.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                            <Button variant="contained" sx={buttonStyles.buttonsubmit} style={{ minWidth: "0px" }}>
                                View
                            </Button>
                        </Link>
                    )}
                </Grid>
            ),
        },
        {
            field: "taskstatus",
            headerName: "Task Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskstatus,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ color: params?.data?.taskstatus === "Assigned" ? "green" : params?.data?.taskstatus === "Pending" ? "red" : "blue" }}>{params?.data?.taskstatus}</Typography>
                </Grid>
            ),
        },
        {
            field: "taskassigneddate",
            headerName: "Task Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.taskassigneddate,
        },
        {
            field: "tasktime",
            headerName: "Task Time",
            flex: 0,
            width: 100,
            hide: !columnVisibility.tasktime,
        },
        {
            field: "priority",
            headerName: "Priority",
            flex: 0,
            width: 100,
            hide: !columnVisibility.priority,
        },
        {
            field: "taskdetails",
            headerName: "Task Details",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskdetails,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ color: params?.data?.taskdetails === "schedule" ? "green" : "blue" }}>{params?.data?.taskdetails}</Typography>
                </Grid>
            ),
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 100,
            hide: !columnVisibility.frequency,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography sx={{
                            color: params.data.frequency === "Daily" ? "red" :
                                params.data.frequency === "Date Wise" ? "green" :
                                    params.data.frequency === "Monthly" ? "blue" :
                                        params.data.frequency === "Annually" ? 'Orange' :
                                            params.data.frequency === "Day Wise" ? "palevioletred" : 'violet'
                        }}>{params.data.frequency}</Typography>
                    </Grid>

                </Grid>

            ),
        },
        {
            field: "schedule",
            headerName: "Schedule",
            flex: 0,
            width: 100,
            hide: !columnVisibility.schedule,
        },
        {
            field: "category",
            headerName: "Task",
            flex: 0,
            width: 250,
            hide: !columnVisibility.category,
        },

        {
            field: "subcategory",
            headerName: "Sub Task",
            flex: 0,
            width: 250,

            hide: !columnVisibility.subcategory,
        },
        {
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 100,
            hide: !columnVisibility.duration,
        },
        {
            field: "breakup",
            headerName: "Break Up",
            flex: 0,
            width: 100,
            hide: !columnVisibility.breakup,
        },

        {
            field: "required",
            headerName: "Required",
            flex: 0,
            width: 100,
            hide: !columnVisibility.required,
        },

    ];



    // Function to remove HTML tags and convert to numbered list
    const convertToNumberedList = (htmlContent) => {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlContent;

        const listItems = Array.from(tempElement.querySelectorAll("li"));
        listItems.forEach((li, index) => {
            li.innerHTML = `\u2022 ${li.innerHTML}\n`;
        });

        return tempElement.innerText;
    };

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            taskstatus: item?.taskstatus,
            taskassigneddate: item?.taskassigneddate,
            taskdetails: item?.taskdetails,
            tasktime: item?.tasktime,
            priority: item?.priority,
            category: item.category,
            subcategory: item.subcategory,
            schedule: item.schedule,
            duration: item.duration,
            frequency: item.frequency,
            required: item?.required,
            breakup: item?.breakup,
            description: item.description,
        };
    });

    // Excel
    const fileName = "User_Task_Panel-working";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User_Task_Panel-working",
        pageStyle: "print",
    });


    // Show All Columns functionality
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
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "User Task Panel- Working Tasks.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );

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

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );

    const [copiedData, setCopiedData] = useState("");

    const ListPageLoadDataOnprogress = async () => {
        setPageName(!pageName);
        try {
            let res_task = await axios.post(SERVICE.ONPROGRESSALL_TASKFORUSER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess?.companyname,
            });

            let anstaskUserPanel = res_task?.data?.taskforuser?.length > 0 ? res_task?.data?.taskforuser?.filter(data => data?.username
                === isUserRoleAccess?.companyname && ["Paused", "Pending", "Postponed"]?.includes(data?.taskstatus)) : [];

            const answer = anstaskUserPanel?.length > 0 ? anstaskUserPanel?.map((item, index) => ({
                serialNumber: index + 1,
                id: item._id,
                taskstatus: item.taskstatus,
                taskassigneddate: item?.taskdetails === "Manual" ? moment(item?.taskdate).format("DD-MM-YYYY") : item.taskassigneddate,
                category: item?.taskdetails === "Manual" ? item?.taskname : item.category,
                tasktime: item?.taskdetails === "Manual" ? convertTimeToAMPMFormat(item.tasktime) : item?.taskdetails === "nonschedule" ? item.schedule === "Any Time" ? "" : convertTimeToAMPMFormat(item.tasktime) : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
                frequency: item.frequency,
                subcategory: item.subcategory,
                taskdetails: item.taskdetails,
                schedule: item.schedule,
                duration: item.duration,
                type: item.type,
                priority: item.priority,
                required: item?.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                breakup: item?.breakup,
                description: item?.description ? convertToNumberedList(item?.description) : "",
            })) : [];
            setRaiseTicketList(answer);
            setQueueCheck(true);
        }

        catch (err) { console.log(err, 'err'); setQueueCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }


    useEffect(() => {
        ListPageLoadDataOnprogress();
    }, [com])
    useEffect(() => {
        ListPageLoadDataOnprogress();
    }, [])

    return (
        <Box>
            <Headtitle title={"USER TASK PANEL"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.SubHeaderText}>User Task Panel - <b style={{ backgroundColor: 'blue', color: "white" }}>Working Tasks</b></Typography>

            {!queueCheck ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("ltaskuserpanel") && (
                        <>

                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <br></br>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>

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
                                        <MenuItem value={raiseTicketList?.length}>All</MenuItem>
                                    </Select>
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
                                    {isUserRoleCompare?.includes("exceltaskuserpanel") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvtaskuserpanel") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printtaskuserpanel") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdftaskuserpanel") && (
                                        // <>
                                        //     <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                        //         <FaFilePdf />
                                        //         &ensp;Export to PDF&ensp;
                                        //     </Button>
                                        // </>
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagetaskuserpanel") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={raiseTicketList}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={items}
                                        setFilteredChanges={setFilteredChanges}
                                    />
                                </Grid>
                            </Grid>
                            {/* ****** Table Grid Container ****** */}

                            <Button
                                sx={userStyle.buttongrp}
                                onClick={() => {
                                    handleShowAllColumns();
                                    setColumnVisibility(initialColumnVisibility);
                                }}
                            >
                                Show All Columns
                            </Button>
                            &emsp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                Manage Columns
                            </Button>{" "}
                            &emsp;
                            {/* ****** Table start ****** */}
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >
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
                                    // totalDatas={totalProjects}
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={items}

                                />
                            </Box>

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
                        </>
                    )}
                </>
            )}

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
                itemsTwo={raiseTicketList ?? []}
                filename={"User Task Panel- Working Tasks"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default TaskForUserOnProgress;