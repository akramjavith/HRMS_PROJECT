import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, Checkbox, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Pagination from '../../components/Pagination';
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

function TaskForUsersReport({ com }) {

    const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode, pageName,
        setPageName,
        buttonStyles, } =
        useContext(UserRoleAccessContext);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [items, setItems] = useState([]);
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
        'Task Time', 'Task Details',
        'Frequency', 'Schedule',
        'Task', 'Sub Task',
        'Duration', 'Break Up',
        'Required'
    ];
    let exportRowValues = [
        'taskstatus',
        'taskassigneddate',
        'tasktime',
        'taskdetails',
        'frequency',
        'schedule',
        'category',
        'subcategory',
        'duration',
        'breakup',
        'required'
    ];
    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Task/Task Users Report"),
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
    const [raiseTicketList, setRaiseTicketList] = useState([]);
    // const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    //Datatable
    const [queueCheck, setQueueCheck] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([{ label: "Daily", value: "Daily" }]);
    let [valueWeekly, setValueWeekly] = useState(["Daily"]);    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setQueueCheck(false);
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

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;


    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
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
        schedule: true,
        duration: true,
        type: true,
        required: true,
        taskdetails: true,
        tasktime: true,
        breakup: true,
        taskname: true,
        taskdate: true,
        username: true,
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
    const filteredDatas = raiseTicketList?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
    });

    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            renderHeader: (params) => (
                <CheckboxHeader
                    selectAllChecked={selectAllChecked}
                    onSelectAll={() => {
                        if (rowDataTable.length === 0) {
                            // Do not allow checking when there are no rows
                            return;
                        }
                        if (selectAllChecked) {
                            setSelectedRows([]);
                        } else {
                            const allRowIds = rowDataTable.map((row) => row.id);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.id)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.id)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 50,
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "taskstatus",
            headerName: "Task Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskstatus,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ color: params?.row?.taskstatus === "Assigned" ? "green" : params?.row?.taskstatus === "Pending" ? "red" : "blue" }}>{params?.row?.taskstatus}</Typography>
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
            field: "taskdetails",
            headerName: "Task Details",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskdetails,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ color: params?.row?.taskdetails === "schedule" ? "green" : "blue" }}>{params?.row?.taskdetails}</Typography>
                </Grid>
            ),
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 100,
            hide: !columnVisibility.frequency,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography sx={{
                            color: params.row.frequency === "Daily" ? "red" :
                                params.row.frequency === "Date Wise" ? "green" :
                                    params.row.frequency === "Monthly" ? "blue" :
                                        params.row.frequency === "Annually" ? 'Orange' :
                                            params.row.frequency === "Day Wise" ? "palevioletred" : 'violet'
                        }}>{params.row.frequency}</Typography>
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

    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: index + 1,
            serialNumber: item.serialNumber,
            taskstatus: item?.taskstatus,
            taskassigneddate: item?.taskassigneddate,
            taskdetails: item?.taskdetails,
            tasktime: item?.tasktime,
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
    const fileName = "User_Task_Panel-Report";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User_Task_Panel-Report",
        pageStyle: "print",
    });

    const columns = [
        { title: "Task Status", field: "taskstatus" },
        { title: "Task Date", field: "taskassigneddate" },
        { title: "Task Time", field: "tasktime" },
        { title: "Task Details", field: "taskdetails" },
        { title: "Frequency", field: "frequency" },
        { title: "Schedule", field: "schedule" },
        { title: "Task", field: "category" },
        { title: "Sub Task", field: "subcategory" },
        { title: "Duration", field: "duration" },
        { title: "Break Up", field: "breakup" },
        { title: "Required", field: 'required' },
    ];


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
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Task Users Report.png");
                });
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



    const ListPageLoadDataOnprogress = async (data) => {
        setPageName(!pageName);
        const Value = data ? data : valueWeekly;
        try {
            setQueueCheck(true);
            let res_task = await axios.post(SERVICE.ALL_TASKFORUSER_REPORTS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: page,
                pageSize: pageSize,
                frequency: Value
            });

            const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : []
            const overall = res_task?.data?.overall?.length > 0 ? res_task?.data?.overall : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                tasktime: item?.taskdetails === "nonschedule" ? item.schedule === "Any Time" ? "" : convertTimeToAMPMFormat(item.tasktime) : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,

                // serialNumber: index + 1,
            }));

            setRaiseTicketList(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            const OverallList = overall?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                tasktime: item?.taskdetails === "nonschedule" ? item.schedule === "Any Time" ? "" : convertTimeToAMPMFormat(item.tasktime) : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,

                // serialNumber: index + 1,
            }));
            setItems(OverallList)
            setQueueCheck(false);
        } catch (err) { setQueueCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }



    const handleSubmit = () => {
        if (valueWeekly?.length < 1) {
            setPopupContentMalert('Please Select Frequency');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            ListPageLoadDataOnprogress();
        }
    }

    useEffect(() => {
        ListPageLoadDataOnprogress()
    }, [page, pageSize])

    const handleWeeklyChange = (options) => {
        setValueWeekly(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedWeeklyOptions(options);
    };

    const customValueRendererCate = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Frequency";
    };


    const handleClear = () => {
        setValueWeekly(["Daily"])
        setSelectedWeeklyOptions([{ label: "Daily", value: "Daily" }]);
        setPopupContent('Cleared Successfully');
        ListPageLoadDataOnprogress(["Daily"])
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    return (
        <Box>
            <Headtitle title={"USER TASK PANEL - REPORTS"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="User Task Panel - Reports"
                modulename="Task"
                submodulename="Task Users Reports"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <br />
            <br />

            <Box sx={userStyle.dialogbox}>
                <>
                    <Typography sx={userStyle.SubHeaderText}> User Task Panel - Reports</Typography>
                    <br />
                    <br />
                    <br />
                    <Grid container spacing={2}>
                        <>
                            <Grid item md={2} xs={12} sm={12}> </Grid>
                            <Grid item md={1.5} xs={12} sm={12}>

                                <Typography>Frequency<b style={{ color: "red", gap: "15px" }}>*</b></Typography>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <MultiSelect size="small"
                                        options={[{ label: "Daily", value: "Daily" },
                                        { label: "Day Wise", value: "Day Wise" },
                                        { label: "Date Wise", value: "Date Wise" },
                                        { label: "Weekly", value: "Weekly" },
                                        { label: "Monthly", value: "Monthly" },
                                        { label: "Annually", value: "Annually" }]}
                                        value={selectedWeeklyOptions}
                                        onChange={handleWeeklyChange}
                                        valueRenderer={customValueRendererCate}
                                        labelledBy="Please Select Frequency"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>

                                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                    <Button variant="contained"
                                        onClick={() => { handleSubmit() }}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        {" "}
                                        Filter
                                    </Button>
                                    <Button sx={buttonStyles.btncancel}
                                        onClick={() => { handleClear() }}

                                    >
                                        {" "}
                                        CLEAR
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Grid>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    {isUserRoleCompare?.includes("ltaskusersreport") && (
                        <>

                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <br></br>
                            <Grid container sx={{ justifyContent: "center" }}>
                                <Grid>
                                    {isUserRoleCompare?.includes("exceltaskusersreport") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvtaskusersreport") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printtaskusersreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdftaskusersreport") && (


                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>

                                    )}
                                    {isUserRoleCompare?.includes("imagetaskusersreport") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>

                            {/* ****** Table Grid Container ****** */}
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
                                        onChange={handlePageSizeChange}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                    </Select>
                                </Box>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
                            </Grid>
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
                            <br />
                            <br />
                            {/* ****** Table start ****** */}
                            <Box
                                style={{
                                    width: "100%",
                                    overflowY: "hidden", // Hide the y-axis scrollbar
                                }}
                            >

                                {queueCheck ? (
                                    <Box sx={userStyle.container}>
                                        <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                        </Box>
                                    </Box>
                                ) : (
                                    <StyledDataGrid rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                )}
                            </Box>
                            <Box>
                                <Pagination
                                    page={page}
                                    pageSize={pageSize}
                                    totalPages={searchQuery !== "" ? 1 : totalPages}
                                    onPageChange={handlePageChange}
                                    pageItemLength={filteredDatas?.length}
                                    totalProjects={
                                        searchQuery !== "" ? filteredDatas?.length : totalProjects
                                    }
                                />                                    {/* <Pagination page={page} pageSize={pageSize} totalPagesCount={totalPages} onPageChange={handlePageChange} pageItemLength={employees} /> */}
                            </Box>

                            {/* ****** Table End ****** */}

                            <TableContainer component={Paper} sx={userStyle.printcls}>
                                <Table aria-label="customized table" id="raisetickets" ref={componentRef}>
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell>S.No</StyledTableCell>
                                            <StyledTableCell>Task Status</StyledTableCell>
                                            <StyledTableCell>Task Date</StyledTableCell>
                                            <StyledTableCell>Task Time</StyledTableCell>
                                            <StyledTableCell>Task Details</StyledTableCell>
                                            <StyledTableCell>Frequency</StyledTableCell>
                                            <StyledTableCell>Schedule</StyledTableCell>
                                            <StyledTableCell>Task</StyledTableCell>
                                            <StyledTableCell>Sub Task</StyledTableCell>
                                            <StyledTableCell>Duration</StyledTableCell>
                                            <StyledTableCell>Break Up</StyledTableCell>
                                            <StyledTableCell>Required</StyledTableCell>


                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredDatas?.length > 0 ? (
                                            filteredDatas?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                                    <StyledTableCell>{row.taskstatus}</StyledTableCell>
                                                    <StyledTableCell>{row.taskassigneddate}</StyledTableCell>
                                                    <StyledTableCell>{row.tasktime}</StyledTableCell>
                                                    <StyledTableCell>{row.taskdetails}</StyledTableCell>
                                                    <StyledTableCell>{row.frequency}</StyledTableCell>
                                                    <StyledTableCell>{row.schedule}</StyledTableCell>
                                                    <StyledTableCell>{row.category}</StyledTableCell>
                                                    <StyledTableCell>{row.subcategory}</StyledTableCell>
                                                    <StyledTableCell>{row.duration}</StyledTableCell>
                                                    <StyledTableCell>{row.breakup}</StyledTableCell>
                                                    <StyledTableCell>{row.required?.join(",")}</StyledTableCell>

                                                </StyledTableRow>
                                            ))
                                        ) : (
                                            <StyledTableRow>
                                                {" "}
                                                <StyledTableCell colSpan={7} align="center">
                                                    No Data Available
                                                </StyledTableCell>{" "}
                                            </StyledTableRow>
                                        )}
                                        <StyledTableRow></StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

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
                filteredDataTwo={rowDataTable ?? []}
                itemsTwo={items ?? []}
                filename={"Task Users Reports"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

        </Box>
    );
}

export default TaskForUsersReport;