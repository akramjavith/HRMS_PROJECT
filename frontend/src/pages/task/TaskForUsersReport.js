import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, RadioGroup, Radio, FormControlLabel, Checkbox, InputAdornment, ListItemText, Tooltip, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, FaSearch } from "react-icons/fa";
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import moment from "moment-timezone";
import LoadingButton from "@mui/lab/LoadingButton";
import { MultiSelect } from "react-multi-select-component";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";

function TaskForUsersReport({ com }) {
    const taskStatusOptions = [
        { label: "Completed", value: "Completed" },
        { label: "Assigned", value: "Assigned" },
        { label: "Pending", value: "Pending" },
        { label: "Postponed", value: "Postponed" },
        { label: "Finished By Others", value: "Finished By Others" },
        { label: "Not Applicable to Me", value: "Not Applicable to Me" },
    ];
    const [filterLoader, setFilterLoader] = useState(false);
    const daysoptions = [
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Today", value: "Today" },
        { label: "This Week", value: "This Week" },
        { label: "This Month", value: "This Month" },
        { label: "Custom Fields", value: "Custom Fields" },
    ]
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    const [filterUser, setFilterUser] = useState({
        fromdate: today,
        todate: today,
        day: "Today"
    });

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

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [searchedString, setSearchedString] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const gridRefTable = useRef(null);
    const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode, pageName,
        setPageName,
        buttonStyles, } =
        useContext(UserRoleAccessContext);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsOverallList, setItemsOverallList] = useState([]);
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
            pagename: String("Task/Task User Panel Report"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.companyname),
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
    const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([]);
    let [valueWeekly, setValueWeekly] = useState([]);
    const [selectedStatusOptions, setSelectedStatusOptions] = useState([]);
    let [valueStatus, setValueStatus] = useState([]);
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
    };
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQuery;
    };
    // Split the search query into individual terms
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
    });

    const columnDataTable = [
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
            field: "taskstatus",
            headerName: "Task Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskstatus,
            pinned: "left",
            lockPinned: true,
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
            width: 150,
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
        documentTitle: "User Task Panel-Report",
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
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Task Users Reports.png");
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



    const ListPageLoadDataOnprogress = async (data) => {
        setPageName(!pageName);
        const Value = valueWeekly?.length > 0 ? valueWeekly : [];
        const Status = valueStatus?.length > 0 ? valueStatus : [];
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            frequency: Value,
            status: Status,
            fromdate: filterUser.fromdate,
            todate: filterUser.todate,
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
        try {
            setQueueCheck(true);
            let res_task = await axios.post(SERVICE.ALL_TASKFORUSER_REPORTS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

            });

            const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : []
            const overall = res_task?.data?.overall?.length > 0 ? res_task?.data?.overall : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                tasktime: item?.taskdetails === "Manual" ? item.tasktime : item?.taskdetails === "nonschedule" ? item.schedule === "Any Time" ? "" : convertTimeToAMPMFormat(item.tasktime) : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,

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
                tasktime: item?.taskdetails === "Manual" ? item.tasktime : item?.taskdetails === "nonschedule" ? item.schedule === "Any Time" ? "" : convertTimeToAMPMFormat(item.tasktime) : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,

                // serialNumber: index + 1,
            }));
            setItemsOverallList(OverallList)
            setQueueCheck(false);
            setFilterLoader(false);
        } catch (err) { setFilterLoader(false); setQueueCheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const handleResetSearch = async (data) => {
        // const Value = valueWeekly;
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

        const Value = valueWeekly?.length > 0 ? valueWeekly : [];
        const Status = valueStatus?.length > 0 ? valueStatus : [];
        const queryParams = {
            page: Number(page),
            pageSize: Number(pageSize),
            frequency: Value,
            status: Status,
            fromdate: filterUser.fromdate,
            todate: filterUser.todate,
        };

        const allFilters = [];
        // Only include advanced filters if they exist, otherwise just use regular searchQuery
        if (allFilters.length > 0 && selectedColumn !== "") {
            queryParams.allFilters = allFilters
            queryParams.logicOperator = logicOperator;
        } else if (searchQuery) {
            queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
        }

        try {
            let res_task = await axios.post(SERVICE.ALL_TASKFORUSER_REPORTS, queryParams, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : []
            const overall = res_task?.data?.overall?.length > 0 ? res_task?.data?.overall : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                tasktime: item?.taskdetails === "Manual" ? item.tasktime : item?.taskdetails === "nonschedule" ?
                    item.schedule === "Any Time" ? "" :
                        convertTimeToAMPMFormat(item.tasktime) :
                    item.schedule === "Any Time" ? "" :
                        `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
            }));

            setRaiseTicketList(itemsWithSerialNumber);
            const OverallList = overall?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                tasktime: item?.taskdetails === "Manual" ? item.tasktime : item?.taskdetails === "nonschedule" ? item.schedule === "Any Time" ? "" : convertTimeToAMPMFormat(item.tasktime) : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
            }));
            setItemsOverallList(OverallList)
            setFilteredChanges(null);
            setItems(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            // Trigger a table refresh if necessary
            setPageName((prev) => !prev); // Force re-render
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

    };
    // Search bar
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;
    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

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


    const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");



    const addSerialNumber = (data) => {
        setItems(data)
    }
    useEffect(() => {
        addSerialNumber(raiseTicketList)
    }, [raiseTicketList])

    const handleSubmit = () => {
        if (filterUser.day === "Custom Fields" && filterUser.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (filterUser.day === "Custom Fields" && filterUser.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setSearchQuery("")
            setFilterLoader(true)
            ListPageLoadDataOnprogress();
        }
    }

    useEffect(() => {
        ListPageLoadDataOnprogress();
    }, [page, pageSize, searchQuery])

    const handleWeeklyChange = (options) => {
        setValueWeekly(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedWeeklyOptions(options);
        setRaiseTicketList([])
        setTotalProjects(0);
        setTotalPages(0);
    };

    const customValueRendererCate = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Frequency";
    };


    const handleStatusChange = (options) => {
        setValueStatus(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedStatusOptions(options);
        setRaiseTicketList([])
        setTotalProjects(0);
        setTotalPages(0);
    };

    const customValueRendererStatus = (valueCate, _days) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Status";
    };


    const handleClear = () => {
        setValueWeekly([])
        setSelectedWeeklyOptions([]);
        setValueStatus([])
        setSelectedStatusOptions([]);
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
        setAdvancedFilter(null);
        setAdditionalFilters([]);
        setFilterUser({
            fromdate: today,
            todate: today,
            day: "Today"
        });
        setSearchQuery("");
        setIsSearchActive(false);
        setSelectedColumn("");
        setSelectedCondition("Contains");
        setFilterValue("");
        setLogicOperator("AND");
        setFilteredChanges(null);
        setRaiseTicketList([])
    }

    return (
        <Box>
            <Headtitle title={"USER TASK PANEL - REPORTS"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="User Task Panel - Reports"
                modulename="Task"
                submodulename="Task Users Report"
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
                    {isUserRoleCompare?.includes("ltaskusersreport") && (
                        <>
                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>Frequency<b style={{ color: "red", gap: "15px" }}>*</b></Typography>

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
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>Status<b style={{ color: "red", gap: "15px" }}>*</b></Typography>
                                        <FormControl fullWidth size="small">
                                            <MultiSelect size="small"
                                                options={taskStatusOptions}
                                                value={selectedStatusOptions}
                                                onChange={handleStatusChange}
                                                valueRenderer={customValueRendererStatus}
                                                labelledBy="Please Select Status"
                                            />
                                        </FormControl>
                                    </Grid>
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

                                    <Grid item md={3} sm={12} xs={12} mt={3}>
                                        <div style={{ display: "flex", gap: "20px" }}>
                                            <LoadingButton
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSubmit}
                                                loading={filterLoader}
                                                sx={buttonStyles.buttonsubmit}
                                            >
                                                {" "}
                                                Filter
                                            </LoadingButton>
                                            <Button sx={buttonStyles.btncancel}
                                                onClick={() => { handleClear() }}

                                            >
                                                {" "}
                                                CLEAR
                                            </Button>
                                        </div>
                                    </Grid>
                                </>
                            </Grid>
                        </>
                    )}
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    {isUserRoleCompare?.includes("ltaskusersreport") && (
                        <>
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
                                        <MenuItem value={totalProjects}>All</MenuItem>
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
                                {/* <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={raiseTicketList}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={true}
                                        totalDatas={itemsOverallList}


                                    />
                                </Grid>  */}
                                <Grid item md={2} xs={6} sm={6}>
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
                                    <AggridTableForPaginationTable
                                        rowDataTable={rowDataTable}
                                        columnDataTable={columnDataTable}
                                        columnVisibility={columnVisibility}
                                        page={page}
                                        setPage={setPage}
                                        pageSize={pageSize}
                                        totalPages={totalPages}
                                        setColumnVisibility={setColumnVisibility}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        gridRefTable={gridRefTable}
                                        filteredDatas={filteredDatas}
                                        totalDatas={totalProjects}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={itemsOverallList}


                                    // searchQuery={searchQuery}
                                    // handleShowAllColumns={handleShowAllColumns}

                                    // setFilteredChanges={setFilteredChanges}
                                    // filteredChanges={filteredChanges}


                                    />

                                    // <StyledDataGrid rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                )}
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
            </Box>
            {/* Search Bar */}
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
                                            ListPageLoadDataOnprogress();
                                            setIsSearchActive(true);
                                            setAdvancedFilter([
                                                ...additionalFilters,
                                                { column: selectedColumn, condition: selectedCondition, value: filterValue }
                                            ])
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
                itemsTwo={itemsOverallList ?? []}
                filename={"Task User Panel Reports"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

        </Box>
    );
}

export default TaskForUsersReport;