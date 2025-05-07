import React, { useState, useEffect, useRef, useContext } from "react";
import {
    TextField,
    IconButton,
    ListItem,
    List,
    Checkbox,
    ListItemText,
    Popover,
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    Select,
    Paper,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Table,
    TableHead,
    TableContainer,
    Button,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
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
import { ExportXL, ExportCSV } from "../../components/Export";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { makeStyles } from "@material-ui/core";
import Selects from "react-select";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable"
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

function TaskHierarchySummaryReport({ com }) {
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTable = useRef(null);
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

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
        'Company' , 'Branch' , 'Unit', 'Team' ,'Department',
        'User Name',
        'Completed Task', 'Assigned Task',
        'Pending Task', 'Paused Task',
        'Postponed Task', 'Not Applicable Task',
        'Finished By Others Task',
    ];
    let exportRowValues = [
        'company',
        'branch',
        'unit',
        'team',
        'department',
        'username',
        'completedCount',
        'assignedCount',
        'pendingCount',
        'pausedCount',
        'postponedCount',
        'notApplicableCount',
        'finishedOthersCount',
    ];

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
        level: "My Hierarchy List",
        control: "Primary",
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
            pagename: String("Task/Task Hierarchy Summary Reports"),
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
    const [loader, setLoader] = useState(false);
    const classes = useStyles();
    const [raiseTicketList, setRaiseTicketList] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode, pageName,
        setPageName,
        buttonStyles, } =
        useContext(UserRoleAccessContext);
    let listpageaccessby =
        listPageAccessMode?.find(
            (data) =>
                data.modulename === "Task" &&
                data.submodulename === "Task Hierarchy Summary Reports" &&
                data.mainpagename === "" &&
                data.subpagename === "" &&
                data.subsubpagename === ""
        )?.listpageaccessmode || "Overall";
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    //Datatable
    const [queueCheck, setQueueCheck] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const modeDropDowns = [
        { label: "My Hierarchy List", value: "My Hierarchy List" },
        { label: "All Hierarchy List", value: "All Hierarchy List" },
        { label: "My + All Hierarchy List", value: "My + All Hierarchy List" },
    ];
    const sectorDropDowns = [
        { label: "Primary", value: "Primary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Tertiary", value: "Tertiary" },
        { label: "All", value: "all" },
    ];



    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState("");
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

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

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        username: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        completedTask: true,
        checkbox: true,
        serialNumber: true,
        assignedTask: true,
        pendingTask: true,
        pausedTask: true,
        postponedTask: true,
        notApplicableTask: true,
        finishedOthersTask: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );


    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);


    const convertTimeToAMPMFormat = (time) => {
        let [hour, minute] = time.split(":").map(Number);
        let timetype = "AM";

        if (hour >= 12) {
            timetype = "PM";
            if (hour > 12) {
                hour -= 12;
            }
        }

        if (hour === 0) {
            hour = 12;
        }

        return `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute
            } ${timetype}`;
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
        return searchOverTerms.every((term) =>
            Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
        );
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

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
    const tableHeadCellStyle = { padding: "5px 10px", fontSize: "14px", boxShadow: "none", width: "max-content" };
    const tableBodyCellStyle = { padding: "5px 10px", width: "max-content" };
    const [AttendanceList, setAttendanceList] = useState({});
    const [isAttendanceList, setIsAttendanceList] = useState(false);

    //image
    const handleCaptureImagePopUp = () => {
        if (componentRefPopUp.current) {
            html2canvas(componentRefPopUp.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "BiometricBranchWiseExitReport.png");
                });
            });
        }
    };
    // Excel
    const fileName = "TaskUserPanelSummaryReports";
    //print...
    const componentRefPopUp = useRef();
    const handleprintPopUp = useReactToPrint({
        content: () => componentRefPopUp.current,
        documentTitle: "Task User Panel Summary Reports",
        pageStyle: "print",
    });

    const [applyData, setApplyData] = useState([]);

    // get particular columns for export excel
    const getexcelDatas = () => {
        var data = AttendanceList?.[AttendanceList?.column]?.map((t, index) => ({
            Sno: index + 1,
            "Company": AttendanceList?.company,
            "Branch": AttendanceList?.branch,
            "Unit": AttendanceList?.unit,
            "Team": AttendanceList?.team,
            "Department": AttendanceList?.department,
            "Task Date": t.taskassigneddate,
            "User Name": t.username,
            "Category": t.category,
            "Sub Category": t.subcategory,
            "Task Details": t.taskdetails,
            "Frequency": t.frequency,
            "Schedule": t.schedule,
            "Task Status": t.taskstatus,
        }));
        setApplyData(data);
    };
    useEffect(() => {
        getexcelDatas();
    }, [AttendanceList]);


    // pdf.....
    const columns = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Department", field: "department" },
        { title: "Task Date", field: "taskassigneddate" },
        { title: "User Name", field: "username" },
        { title: "Category", field: "category" },
        { title: "Sub Category", field: "subcategory" },
        { title: "Task Details", field: "taskdetails" },
        { title: "Frequency", field: "frequency" },
        { title: "Schedule", field: "schedule" },
        { title: "Task Status", field: "taskstatus" },
    ];
    const downloadPdf = () => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            // Serial number column
            { title: "SNo", dataKey: "serialNumber" },
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];
        // Add a serial number to each row
        const itemsWithSerial = AttendanceList?.[AttendanceList?.column]?.map((t, index) => ({
            // ...t,
            serialNumber: index + 1,
            "company": AttendanceList?.company,
            "branch": AttendanceList?.branch,
            "unit": AttendanceList?.unit,
            "team": AttendanceList?.team,
            "department": AttendanceList?.department,
            "taskassigneddate": t?.taskassigneddate,
            "username": t.username,
            "category": t.category,
            "subcategory": t.subcategory,
            "taskdetails": t.taskdetails,
            "frequency": t.frequency,
            "schedule": t.schedule,
            "taskstatus": t.taskstatus,
        }));
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columnsWithSerial,
            body: itemsWithSerial,
        });
        doc.save("Task User Panel Summary Reports.pdf");
    };





    const getCode = async (e, column) => {
        setAttendanceList({ ...e, column: column });
        handleClickOpenAttendanceList();
    }
    // page refersh reload
    const handleClickOpenAttendanceList = () => {
        setIsAttendanceList(true);
    };
    const handleCloseAttendanceList = () => {
        setIsAttendanceList(false);
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
            //lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibility.department,
        },
        {
            field: "username",
            headerName: "Username",
            flex: 0,
            width: 150,
            hide: !columnVisibility.username,
        },
        {
            field: "completedTask",
            headerName: "Completed Task",
            flex: 0,
            width: 150,
            hide: !columnVisibility.completedTask,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Typography>{params.data?.completedCount} -</Typography>
                    <Button sx={userStyle.buttonedit} onClick={() => getCode(params.data, 'completedTask')}>
                        View
                    </Button>


                </Grid>
            ),
        },
        {
            field: "assignedTask",
            headerName: "Assigned Task",
            flex: 0,
            width: 150,
            hide: !columnVisibility.assignedTask,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Typography>{params.data?.assignedCount} -</Typography>
                    <Button sx={userStyle.buttonedit} onClick={() => getCode(params.data, 'assignedTask')}>
                        View
                    </Button>


                </Grid>
            ),
        },
        {
            field: "pendingTask",
            headerName: "Pending Task",
            flex: 0,
            width: 150,
            hide: !columnVisibility.pendingTask,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Typography>{params.data?.pendingCount} -</Typography>
                    <Button sx={userStyle.buttonedit} onClick={() => getCode(params.data, 'pendingTask')}>
                        View
                    </Button>


                </Grid>
            ),
        },
        {
            field: "pausedTask",
            headerName: "Paused Task",
            flex: 0,
            width: 150,
            hide: !columnVisibility.pausedTask,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Typography>{params.data?.pausedCount} -</Typography>
                    <Button sx={userStyle.buttonedit} onClick={() => getCode(params.data, 'pausedTask')}>
                        View
                    </Button>


                </Grid>
            ),
        },
        {
            field: "postponedTask",
            headerName: "Postponed Task",
            flex: 0,
            width: 150,
            hide: !columnVisibility.postponedTask,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Typography>{params.data?.postponedCount} -</Typography>
                    <Button sx={userStyle.buttonedit} onClick={() => getCode(params.data, 'postponedTask')}>
                        View
                    </Button>


                </Grid>
            ),
        },
        {
            field: "notApplicableTask",
            headerName: "Not Applicable Task",
            flex: 0,
            width: 150,
            hide: !columnVisibility.notApplicableTask,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Typography>{params.data?.notApplicableCount} -</Typography>
                    <Button sx={userStyle.buttonedit} onClick={() => getCode(params.data, 'notApplicableTask')}>
                        View
                    </Button>


                </Grid>
            ),
        },
        {
            field: "finishedOthersTask",
            headerName: "Finished By Others Task",
            flex: 0,
            width: 150,
            hide: !columnVisibility.finishedOthersTask,
            cellRenderer: (params) => (
                <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                    <Typography>{params.data?.finishedOthersCount} -</Typography>
                    <Button sx={userStyle.buttonedit} onClick={() => getCode(params.data, 'finishedOthersTask')}>
                        View
                    </Button>


                </Grid>
            ),
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
            assignedCount: item?.assignedCount,
            assignedTask: item?.assignedTask,
            completedCount: item?.completedCount,
            completedTask: item?.completedTask,
            finishedOthersCount: item?.finishedOthersCount,
            finishedOthersTask: item.finishedOthersTask,
            notApplicableCount: item.notApplicableCount,
            notApplicableTask: item.notApplicableTask,
            pausedCount: item.pausedCount,
            username: item.username,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            pausedTask: item.pausedTask,
            pendingCount: item?.pendingCount,
            pendingTask: item?.pendingTask,
            postponedCount: item.postponedCount,
            postponedTask: item.postponedTask,
        };
    });


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User_Hierarchy_Task_Panel-Report",
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

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);



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

    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "User Task Hierarchy Summary Reports.png");
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
                                        sx={{ marginTop: "-10px" }}
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterUser.fromdate === "") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (filterUser.todate === "") {
            setPopupContentMalert("Please Select To Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterUser?.level === "Please Select Level" ||
            filterUser?.level === "" ||
            filterUser?.level === undefined
        ) {
            setPopupContentMalert('Please Select Level');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (
            filterUser?.control === "Please Select Control" ||
            filterUser?.control === "" ||
            filterUser?.level === undefined
        ) {
            setPopupContentMalert('Please Select Control');
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            ListPageLoadDataOnprogress();
        }
    };

    const ListPageLoadDataOnprogress = async () => {
        setPageName(!pageName);
        setLoader(true)
        try {
            setQueueCheck(false);
            let res_task = await axios.post(SERVICE.ALL_TASK_HIERARCHY_SUMMARY_REPORTS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: filterUser?.fromdate,
                todate: filterUser?.todate,
                hierachy:
                    filterUser?.level === "My Hierarchy List"
                        ? "myhierarchy"
                        : filterUser?.level === "All Hierarchy List"
                            ? "allhierarchy"
                            : "myallhierarchy",
                sector: filterUser?.control,
                username: isUserRoleAccess?.companyname,
                team: isUserRoleAccess.team,
                pagename: "menutaskhierarchysummaryreports",
                listpageaccessmode: listpageaccessby,
            });

            if (res_task?.data?.resultedTeam?.length > 0 && res_task?.data?.resultAccessFilter?.length < 1 && ["myallhierarchy", "allhierarchy"]?.includes(filterUser?.level === "My Hierarchy List"
                ? "myhierarchy"
                : filterUser?.level === "All Hierarchy List"
                    ? "allhierarchy"
                    : "myallhierarchy")) {
                alert("Some employees have not been given access to this page.")
            }

            const answer = res_task?.data?.resultAccessFilter?.length > 0 ? res_task?.data?.resultAccessFilter?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: item._id,
            })) : [];
            console.log(answer, 'answer')
            setRaiseTicketList(answer);
            setQueueCheck(true);
            setLoader(false);
            setSearchQuery("")
        } catch (err) {
            setQueueCheck(true); setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleClear = () => {
        // setTaskHierarchy({
        //   level: "My Hierarchy List",
        //   control: "Primary",
        // });

        setFilterUser({
            level: "My Hierarchy List",
            control: "Primary",
            fromdate: today,
            todate: today,
            day: "Today"
        });
        setRaiseTicketList([]);
        setPopupContent('Cleared Successfully');
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    return (
        <Box>
            <Headtitle title={"USER HIERARCHY SUMMARY - REPORTS"} />
            {/* ****** Header Content ****** */}

            <PageHeading
                title="Task Hierarchy Summary Reports"
                modulename="Task"
                submodulename="Task Hierarchy Summary Reports"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("ltaskhierarchysummaryreports") && (
                <>
                    <Box sx={{ ...userStyle.dialogbox }}>
                        <>
                            <Typography sx={userStyle.SubHeaderText}>
                                User Hierarchy Task Panel - Reports
                            </Typography>
                            <br />
                            <br />
                            <br />

                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={2} xs={12} sm={6}>
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
                                    <Grid item md={2} xs={12} sm={12}>
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
                                    <Grid item md={2} xs={12} sm={12}>
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
                                    {listpageaccessby === "Reporting to Based" ? (
                                        <Grid item md={2} xs={12} sm={12}>
                                            <Typography>Filter By</Typography>
                                            <TextField readOnly size="small" value={listpageaccessby} />
                                        </Grid>
                                    ) : (
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Level<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={modeDropDowns}
                                                        styles={colourStyles}
                                                        value={{
                                                            label: filterUser.level,
                                                            value: filterUser.level,
                                                        }}
                                                        onChange={(e) => {
                                                            setFilterUser({
                                                                ...filterUser,
                                                                level: e.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography>
                                                        Control<b style={{ color: "red" }}>*</b>
                                                    </Typography>
                                                    <Selects
                                                        options={sectorDropDowns}
                                                        styles={colourStyles}
                                                        value={{
                                                            label: filterUser.control,
                                                            value: filterUser.control,
                                                        }}
                                                        onChange={(e) => {
                                                            setFilterUser({
                                                                ...filterUser,
                                                                control: e.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}
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

                            <br />
                        </>
                    </Box>

                </>
            )}
            <br />
            <br />
            <br />
            <br />
            <br />
            {isUserRoleCompare?.includes("ltaskhierarchysummaryreports") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Typography sx={userStyle.HeaderText}>User Hierarchy Task Panel - Reports List</Typography>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <br></br>
                        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
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
                                        <MenuItem value={raiseTicketList?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {isUserRoleCompare?.includes("exceltaskhierarchysummaryreports") && (
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
                                {isUserRoleCompare?.includes("csvtaskhierarchysummaryreports") && (
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
                                {isUserRoleCompare?.includes("printtaskhierarchysummaryreports") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdftaskhierarchysummaryreports") && (
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
                                {isUserRoleCompare?.includes("imagetaskhierarchysummaryreports") && (
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
                                />
                            </Grid>

                        </Grid>
                        {/* ****** Table Grid Container ****** */}
                        <br />
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
                        <Button
                            sx={userStyle.buttongrp}
                            onClick={handleOpenManageColumns}
                        >
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
                            {!queueCheck ? (
                                <Box sx={userStyle.container}>
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
                                    </Box>
                                </Box>
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
                            )}
                        </Box>
                        {/* ****** Table End ****** */}
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table
                                aria-label="customized table"
                                id="raisetickets"
                                ref={componentRef}
                            >
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell>S.No</StyledTableCell>
                                        <StyledTableCell>Task Status</StyledTableCell>
                                        <StyledTableCell>User Name</StyledTableCell>
                                        <StyledTableCell>Task Date</StyledTableCell>
                                        <StyledTableCell>Task Time</StyledTableCell>
                                        <StyledTableCell>Task Details</StyledTableCell>
                                        <StyledTableCell>Frequency</StyledTableCell>
                                        <StyledTableCell>Schedule</StyledTableCell>
                                        <StyledTableCell>Task</StyledTableCell>
                                        <StyledTableCell>Sub Task</StyledTableCell>
                                        <StyledTableCell>Duration</StyledTableCell>
                                        <StyledTableCell>Required</StyledTableCell>
                                        <StyledTableCell>Break Up</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData?.length > 0 ? (
                                        filteredData?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell>{row.taskstatus}</StyledTableCell>
                                                <StyledTableCell>{row.username}</StyledTableCell>
                                                <StyledTableCell>
                                                    {row.taskassigneddate}
                                                </StyledTableCell>
                                                <StyledTableCell>{row.tasktime}</StyledTableCell>
                                                <StyledTableCell>{row.taskdetails}</StyledTableCell>
                                                <StyledTableCell>{row.frequency}</StyledTableCell>
                                                <StyledTableCell>{row.schedule}</StyledTableCell>
                                                <StyledTableCell>{row.category}</StyledTableCell>
                                                <StyledTableCell>{row.subcategory}</StyledTableCell>
                                                <StyledTableCell>{row.duration}</StyledTableCell>
                                                <StyledTableCell>{row.required}</StyledTableCell>
                                                <StyledTableCell>{row.breakup}</StyledTableCell>
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

                    </Box>
                </>
            )}

            {/* view model */}
            <Dialog
                open={isAttendanceList}
                onClose={handleCloseAttendanceList}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
                fullWidth={true}
                sx={{ marginTop: "80px" }}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Task User Panel Summary</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>

                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{AttendanceList?.company}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{AttendanceList?.branch}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{AttendanceList?.unit}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Team</Typography>
                                    <Typography>{AttendanceList?.team}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Department</Typography>
                                    <Typography>{AttendanceList?.department}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={12} xs={12} sm={12} >
                                <Typography variant="h6">Task Summary</Typography>
                                <br />
                                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Box>
                                        {isUserRoleCompare?.includes("exceltaskhierarchysummaryreports") && (
                                            <>
                                                <ExportXL csvData={applyData} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvtaskhierarchysummaryreports") && (
                                            <>
                                                <ExportCSV csvData={applyData} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printtaskhierarchysummaryreports") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintPopUp}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftaskhierarchysummaryreports") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagetaskhierarchysummaryreports") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImagePopUp}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>

                                <br />
                                <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>

                                    <Table aria-label="customized table" id="usertable" ref={componentRefPopUp}>
                                        <TableHead>
                                            <StyledTableRow>
                                                <StyledTableCell style={tableHeadCellStyle}>{"Sno"}</StyledTableCell>
                                                <StyledTableCell style={tableHeadCellStyle}>{"Task Date"}</StyledTableCell>
                                                <StyledTableCell style={tableHeadCellStyle}>{"User Name"}</StyledTableCell>
                                                <StyledTableCell style={tableHeadCellStyle}>{"Category"}</StyledTableCell>
                                                <StyledTableCell style={tableHeadCellStyle}>{"Sub Category"}</StyledTableCell>
                                                <StyledTableCell style={tableHeadCellStyle}>{"Task Details"}</StyledTableCell>
                                                <StyledTableCell style={tableHeadCellStyle}> {"Frequency"}</StyledTableCell>
                                                <StyledTableCell style={tableHeadCellStyle}> {"Schedule"}</StyledTableCell>
                                                <StyledTableCell style={tableHeadCellStyle}> {"Task Status"}</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {AttendanceList?.[AttendanceList?.column]?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell style={tableBodyCellStyle}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell style={tableBodyCellStyle}> {item.taskassigneddate}</StyledTableCell>
                                                    <StyledTableCell style={tableBodyCellStyle}> {item.username}</StyledTableCell>
                                                    <StyledTableCell style={tableBodyCellStyle}> {item.category}</StyledTableCell>
                                                    <StyledTableCell style={tableBodyCellStyle}> {item.subcategory}</StyledTableCell>
                                                    <StyledTableCell style={tableBodyCellStyle}> {item.taskdetails}</StyledTableCell>
                                                    <StyledTableCell style={tableBodyCellStyle}> {item.frequency}</StyledTableCell>
                                                    <StyledTableCell style={tableBodyCellStyle}> {item.schedule}</StyledTableCell>
                                                    <StyledTableCell style={tableBodyCellStyle}> {item.taskstatus}</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Grid>
                        </Grid>
                        <br /> <br />  <br />
                        <Grid container spacing={2}>
                            <Button sx={buttonStyles.btncancel} onClick={handleCloseAttendanceList}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* )} */}

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "70px", color: "orange" }}
                        />
                        <Typography
                            variant="h6"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={handleCloseModalert}
                        >
                            {" "}
                            OK{" "}
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
                itemsTwo={raiseTicketList ?? []}
                filename={"User Task Hierarchy Summary Reports"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default TaskHierarchySummaryReport;
