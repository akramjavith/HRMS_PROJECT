import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    InputLabel,
    TableRow,
    TableCell,
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
    List,
    ListItem,
    ListItemText,
    Popover,
    Checkbox,
    TextField,
    IconButton,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVICE } from "../../../services/Baseservice";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDone } from "react-icons/md";
import MenuIcon from "@mui/icons-material/Menu";
import { useParams } from "react-router-dom";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AlertDialog from "../../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";


function TrainingUserLog() {

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
        'Assign Date',
        'Training Details',
        'Required', 'Date',
        'Time',
        'Frequency', 'Schedule',
        'MonthDate', 'Annual',
        'Type',
        'Department', 'Designation',
        'Company', 'Branch',
        'Unit', 'Team',
        'Responsible Person', 'Test Names'
    ];
    let exportRowValues = [
        'assigndate',
        'trainingdetails',
        'required', 'date',
        'time',
        'frequency', 'schedule',
        'monthdate', 'annumonth',
        'type',
        'department', 'designation',
        'company', 'branch',
        'unit', 'team',
        'employeenames', 'testnames'
    ];
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [taskGrouping, setTaskGrouping] = useState({
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        date: "",
        breakupcount: "",
        type: "Please Select Type",
    });
    const [taskGroupingEdit, setTaskGroupingEdit] = useState({
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        schedule: "Please Select Schedule",
        frequency: "Please Select Frequency",
        duration: "00:00",
        breakupcount: "",
        hour: "",
        min: "",
        timetype: "",
        monthdate: "",
        date: "",
        annumonth: "",
        annuday: ""
    });


    const [taskGroupingArray, setTaskGroupingArray] = useState([]);

    const [hrsOption, setHrsOption] = useState([]);
    const [minsOption, setMinsOption] = useState([]);
    const [hours, setHours] = useState("Hrs");
    const [minutes, setMinutes] = useState("Mins");
    const [hoursEdit, setHoursEdit] = useState("Hrs");
    const [minutesEdit, setMinutesEdit] = useState("Mins");

    const [breakuphrsOption, setbreakupHrsOption] = useState([]);
    const [breakupminsOption, setbreakupMinsOption] = useState([]);
    const [breakuphours, setbreakupHours] = useState("");
    const [breakuphoursEdit, setbreakupHoursEdit] = useState("");
    const [breakupminutes, setbreakupMinutes] = useState("Mins");

    const { isUserRoleCompare, isUserRoleAccess, allCompany, allBranch, allUnit, allTeam, pageName,
        setPageName,
        buttonStyles, } = useContext(
            UserRoleAccessContext
        );
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [openReassign, setOpenReassign] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTaskGrouping, setDeleteTaskGrouping] = useState({});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [taskGroupingData, setTaskGroupingData] = useState([]);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);






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


    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        status: true,
        assigndate: true,
        taskassign: true,
        trainingdetails: true,
        status: true,
        required: true,
        date: true,
        time: true,
        deadlinedate: true,
        duefromdoj: true,
        duration: true,
        mode: true,
        testnames: true,
        frequency: true,
        schedule: true,
        type: true,
        designation: true,
        department: true,
        timetodo: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        employeenames: true,
        weekdays: true,
        annumonth: true,
        monthdate: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    //useEffect
    useEffect(() => {
        addSerialNumber(taskGroupingArray);
    }, [taskGroupingArray]);


    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    // Reassign model
    const handleClickOpenReassign = () => {
        setOpenReassign(true);
    };
    const handleCloseReassign = () => {
        setOpenReassign(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
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
    };
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
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    // Alert delete popup
    let proid = deleteTaskGrouping._id;
    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };


    //get all Task Schedule Grouping.
    const ids = useParams().id;
    const fetchTaskGrouping = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(`${SERVICE.SINGLE_TRAININGDETAILS}/${ids}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLoader(true);

            const answer = res_freq?.data?.strainingdetails?.trainingdetailslog?.length > 0 ?
                res_freq?.data?.strainingdetails?.trainingdetailslog?.map((item, index) => ({
                    // ...item,
                    serialNumber: index + 1,
                    id: item._id,
                    type: item.type,
                    duration: item.duration,
                    trainingdetails: item.trainingdetails,
                    duefromdoj: item.estimationtime + " " + item.estimation,
                    mode: item.mode,
                    frequency: item.frequency,
                    schedule: item.schedule,
                    required: item.required,
                    date: item.date ? moment(item.date).format("DD-MM-YYYY") : "",
                    time: item.time,
                    assigndate: item.assigndate,
                    testnames: item.testnames,
                    taskassign: item.taskassign,
                    status: item.status,
                    deadlinedate: item.deadlinedate ? moment(item.deadlinedate).format("DD-MM-YYYY") : "",
                    designation: item.designation?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    timetodo: item?.timetodo?.length > 0 ? item?.timetodo?.map((t, i) => `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`).toString() : "",
                    weekdays: item?.weekdays?.length > 0 ? item?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
                    annumonth: item?.frequency === "Annually" ? `${item?.annumonth} month ${item?.annuday} days` : "",
                    monthdate: item?.monthdate,
                    department: item.department?.length > 0 ? item.department?.map((t, i) => `${i + 1 + ". "}` + t).toString() : "",
                    company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    unit: item.unit?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                    employeenames: item.employeenames?.map((t, i) => `${i + 1 + ". "}` + t).toString(),

                })) : [];


            setTaskGroupingArray(answer);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    useEffect(() => {
        fetchTaskGrouping();
    }, [])
    //image
    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
      if (gridRefTableImg.current) {
        domtoimage.toBlob(gridRefTableImg.current)
          .then((blob) => {
            saveAs(blob, "Training User Log.png");
          })
          .catch((error) => {
            console.error("dom-to-image error: ", error);
          });
      }
    };


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "TrainingUserLog",
        pageStyle: "print",
    });

    //serial no for listing items
    const addSerialNumber = (data) => {
        setItems(data);
    };
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

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },

        {
            field: "assigndate",
            headerName: "Assign Date",
            flex: 0,
            width: 180,
            hide: !columnVisibility.assigndate,
            headerClassName: "bold-header",
        },
        {
            field: "trainingdetails",
            headerName: "Training Details",
            flex: 0,
            width: 180,
            hide: !columnVisibility.trainingdetails,
            headerClassName: "bold-header",
        },

        {
            field: "required",
            headerName: "Required",
            flex: 0,
            width: 150,
            hide: !columnVisibility.required,
            headerClassName: "bold-header",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
        },
        {
            field: "time",
            headerName: "Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.time,
            headerClassName: "bold-header",
        },

        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 150,
            hide: !columnVisibility.frequency,
            headerClassName: "bold-header",
        },
        {
            field: "schedule",
            headerName: "Schedule",
            flex: 0,
            width: 150,
            hide: !columnVisibility.schedule,
            headerClassName: "bold-header",
        },
        {
            field: "timetodo",
            headerName: "Time",
            flex: 0,
            width: 150,
            hide: !columnVisibility.timetodo,
            headerClassName: "bold-header",
        },

        {
            field: "monthdate",
            headerName: "Month Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.monthdate,
            headerClassName: "bold-header",
        },
        {
            field: "annumonth",
            headerName: "Annual",
            flex: 0,
            width: 150,
            hide: !columnVisibility.annumonth,
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
            field: "designation",
            headerName: "Designation",
            flex: 0,
            width: 150,
            hide: !columnVisibility.designation,
            headerClassName: "bold-header",
        },
        {
            field: "department",
            headerName: "Department",
            flex: 0,
            width: 150,
            hide: !columnVisibility.department,
            headerClassName: "bold-header",
        },

        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 150,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "team",
            headerName: "Team",
            flex: 0,
            width: 150,
            hide: !columnVisibility.team,
            headerClassName: "bold-header",
        },
        {
            field: "employeenames",
            headerName: "Employee Names",
            flex: 0,
            width: 180,
            hide: !columnVisibility.employeenames,
            headerClassName: "bold-header",
        },

        {
            field: "testnames",
            headerName: "Test Names",
            flex: 0,
            width: 180,
            hide: !columnVisibility.testnames,
            headerClassName: "bold-header",
        },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            trainingdetails: item.trainingdetails,
            type: item.type,
            duration: item.duration,
            duefromdoj: item.duefromdoj,
            mode: item.mode,
            required: item.required,
            taskassign: item.taskassign,
            date: item.date,
            status: item.status,
            testnames: item.testnames,
            time: item.time,
            deadlinedate: item.deadlinedate,
            frequency: item.frequency,
            schedule: item.schedule,
            assigndate: item.assigndate,
            designation: item.designation,
            timetodo: item?.timetodo,
            department: item.department,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            weekdays: item?.weekdays,
            annumonth: item?.annumonth,
            monthdate: item.monthdate,
            team: item.team,
            employeenames: item.employeenames,
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
    const filteredColumns = columnDataTable.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
    );
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

    const handleTimeCalculate = (e) => {
        const breakupCount = e ? Number(e) : 1;
        const hourCal = hours !== "Hrs" ? Number(hours) : 0;
        const MinsCal = minutes !== "Mins" ? Number(minutes) : 0;
        const breakUpTime = (hourCal * 60 + MinsCal) / breakupCount;
        setbreakupHours(breakUpTime)



    }

    const handleTimeCalculateEdit = (e) => {
        const breakupCount = e ? Number(e) : 1;
        const hourCal = hoursEdit ? Number(hoursEdit) : 0;
        const MinsCal = minutesEdit ? Number(minutesEdit) : 0;
        const breakUpTime = (hourCal * 60 + MinsCal) / breakupCount;
        setbreakupHoursEdit(breakUpTime)



    }
    return (
        <Box>
            <Headtitle title={"TRAINING USER LOG"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Manage Training User Log</Typography>

            <br />   <br />
            {/* ****** Table Start ****** */}
            {!loader ?
                <Box sx={userStyle.container}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box> :
                <>
                    {isUserRoleCompare?.includes("ltrainingpostponeduserpanel") && (
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}


                            <Grid container spacing={2}>
                                <Grid item md={10} xs={12} sm={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Training User Log List
                                    </Typography>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Link to={`/task/traning/master/trainingdetails`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                                        <Button sx={buttonStyles.btncancel} variant="contained" >Back</Button>
                                    </Link>
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
                                            <MenuItem value={taskGroupingArray?.length}>
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
                                        {isUserRoleCompare?.includes("exceltrainingpostponeduserpanel") && (


                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvtrainingpostponeduserpanel") && (

                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printtrainingpostponeduserpanel") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftrainingpostponeduserpanel") && (


                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagetrainingpostponeduserpanel") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon
                                                    sx={{ fontSize: "15px" }}
                                                /> &ensp;Image&ensp;{" "}
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
                                        maindatas={taskGroupingArray}
                                        setSearchedString={setSearchedString}
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
                            &ensp;

                            <br />
                            <br />
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
                                    gridRefTableImg={gridRefTableImg}

                                />
                            </Box>

                            {/* ****** Table End ****** */}
                        </Box>
                    )}
                </>}
            {/* ****** Table End ****** */}
            {/* Manage Column */}
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
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRef}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Assign Date</TableCell>
                            <TableCell>Training Assign</TableCell>
                            <TableCell>Training Details</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Mode</TableCell>
                            <TableCell>Required</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>DeadlineDate</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Schedule</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Date Wise</TableCell>
                            <TableCell>Month Date</TableCell>
                            <TableCell>Annually</TableCell>
                            <TableCell>Due From DOJ</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Employee Names</TableCell>
                            <TableCell>Test Names</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable?.length > 0 &&
                            rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.assigndate}</TableCell>
                                    <TableCell>{row.taskassign}</TableCell>
                                    <TableCell>{row.trainingdetails}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.duration}</TableCell>
                                    <TableCell>{row.mode}</TableCell>
                                    <TableCell>{row.required}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.time}</TableCell>
                                    <TableCell>{row.deadlinedate}</TableCell>
                                    <TableCell>{row.frequency}</TableCell>
                                    <TableCell>{row.schedule}</TableCell>
                                    <TableCell>{row.timetodo}</TableCell>
                                    <TableCell>{row?.weekdays}</TableCell>
                                    <TableCell>{row?.monthdate}</TableCell>
                                    <TableCell>{row?.annumonth}</TableCell>
                                    <TableCell>{row?.duefromdoj}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.designation}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.employeenames}</TableCell>
                                    <TableCell>{row.testnames}</TableCell>

                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>



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
                itemsTwo={taskGroupingArray ?? []}
                filename={"Training User Log"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />







            <br />
        </Box>
    );
}

export default TrainingUserLog;
