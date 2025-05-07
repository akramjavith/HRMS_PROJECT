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
import { userStyle, colourStyles } from "../../../pageStyle";
import {
  FaPrint,
  FaFilePdf,
  FaEdit,
  FaFileCsv,
  FaFileExcel,
} from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import moment from "moment-timezone";
import { MultiSelect } from "react-multi-select-component";
import { SERVICE } from "../../../services/Baseservice";
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import PageHeading from "../../../components/PageHeading";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
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
import Selects from "react-select";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
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

function TrainingHierarchyReport({ com }) {


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
    'Training Status',
    'Training Date',
    'Username',
    'Training Time',
    'Training Name',
    'Training Details',
    'Frequency',
    'Schedule',
    'Duration',
    'Required'
  ];
  let exportRowValues = [
    'taskstatus',
    'taskassigneddate',
    'username',
    'tasktime',
    'trainingdetails',
    'taskdetails',
    'frequency',
    'schedule',
    'duration',
    'required'
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
      pagename: String("Training/Training Hierarchy Reports"),
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

  const classes = useStyles();
  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode, pageName,
    setPageName,
    buttonStyles, } =
    useContext(UserRoleAccessContext);
  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Traning" &&
        data.submodulename === "Training Hierarchy Reports" &&
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
  const [sorting, setSorting] = useState({ column: "", direction: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedWeeklyOptions, setSelectedWeeklyOptions] = useState([]);
  let [valueWeekly, setValueWeekly] = useState(""); // Error Popup model
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
  const [allUploadedFiles, setAllUploadedFiles] = useState([]);

  const [shiftEndDate, setShiftEndDate] = useState([]);

  const [singleDoc, setSingleDoc] = useState({});
  const [updateDetails, setUpDateDetails] = useState({});
  let updateby = singleDoc?.updatedby;
  let addedby = singleDoc?.addedby;

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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    taskstatus: true,
    taskassigneddate: true,
    username: true,
    date: true,
    checkbox: true,
    serialNumber: true,
    frequency: true,
    trainingdetails: true,
    schedule: true,
    tasktime: true,
    // priority: true,
    duration: true,
    type: true,
    taskdetails: true,
    required: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "S.No",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      pinned: "left",
      //lockPinned: true,
    },

    {
      field: "taskstatus",
      headerName: "Training Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.taskstatus,
      pinned: "left",
      //lockPinned: true,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Typography
            sx={{
              color:
                params?.data?.taskstatus === "Assigned"
                  ? "green"
                  : params?.data?.taskstatus === "Pending"
                    ? "red"
                    : "blue",
            }}
          >
            {params?.data?.taskstatus}
          </Typography>
        </Grid>
      ),
    },
    {
      field: "taskassigneddate",
      headerName: "Training Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.taskassigneddate,
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.username,
    },
    {
      field: "tasktime",
      headerName: "Training Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.tasktime,
    },
    {
      field: "trainingdetails",
      headerName: "Training Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.trainingdetails,
    },
    // {
    //   field: "priority",
    //   headerName: "Priority",
    //   flex: 0,
    //   width: 100,
    //   hide: !columnVisibility.priority,
    // },
    {
      field: "taskdetails",
      headerName: "Training Details",
      flex: 0,
      width: 150,
      hide: !columnVisibility.taskdetails,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Typography
            sx={{
              color: params?.data?.taskdetails === "schedule" ? "green" : "blue",
            }}
          >
            {params?.data?.taskdetails}
          </Typography>
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
            <Typography
              sx={{
                color:
                  params.data.frequency === "Daily"
                    ? "red"
                    : params.data.frequency === "Date Wise"
                      ? "green"
                      : params.data.frequency === "Monthly"
                        ? "blue"
                        : params.data.frequency === "Annually"
                          ? "Orange"
                          : params.data.frequency === "Day Wise"
                            ? "palevioletred"
                            : "violet",
              }}
            >
              {params.data.frequency}
            </Typography>
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
      field: "duration",
      headerName: "Duration",
      flex: 0,
      width: 100,
      hide: !columnVisibility.duration,
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
      id: item?.id,
      serialNumber: item?.serialNumber,
      taskstatus: item?.taskstatus,
      taskassigneddate: item?.taskassigneddate,
      username: item?.username,
      taskdetails: item?.taskdetails,
      trainingdetails: item.trainingdetails,
      // priority: item.priority,
      tasktime: item?.tasktime,
      schedule: item?.schedule,
      duration: item?.duration,
      frequency: item?.frequency,
      required: item?.required,
    };
  });

  // Excel
  const fileName = "User_Hierarchy_Training_Panel-Report";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "User_Hierarchy_Training_Panel-Report",
    pageStyle: "print",
  });

  const columns = [
    { title: "Training Status", field: "taskstatus" },
    { title: "Training Date", field: "taskassigneddate" },
    { title: "Training Time", field: "tasktime" },
    { title: "Training Name", field: "trainingdetails" },
    { title: "Training Details", field: "taskdetails" },
    { title: "Frequency", field: "frequency" },
    { title: "Schedule", field: "schedule" },
    { title: "Duration", field: "duration" },
    { title: "Required", field: "required" },
  ];

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

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

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
          saveAs(blob, "User_Hierarchy_Training_Panel-Reports.png");
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

  const [copiedData, setCopiedData] = useState("");

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
      setSearchQuery("")
      ListPageLoadDataOnprogress();
    }
  };

  const ListPageLoadDataOnprogress = async () => {
    setPageName(!pageName);
    try {
      setQueueCheck(false);
      let res_task = await axios.post(SERVICE.ALL_TRAINING_HIERARCHY_REPORTS, {
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
        pagename: "menutraininghierarchyreports",
        team: isUserRoleAccess.team,
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
        serialNumber: index + 1,
        id: item._id,
        taskstatus: item.taskstatus,
        taskassigneddate: item.taskassigneddate,
        username: item.username,
        // priority: item.priority,
        trainingdetails: item.trainingdetails,
        tasktime:
          item?.taskdetails !== "Mandatory"
            ? ""
            : item.schedule === "Any Time"
              ? ""
              : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
        frequency: item.frequency,
        taskdetails: item.taskdetails,
        schedule: item.schedule,
        duration: item.duration,
        type: item.type,
        required: item?.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      })) : [];
      setRaiseTicketList(answer);
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleWeeklyChange = (options) => {
    setValueWeekly(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedWeeklyOptions(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Frequency";
  };

  const handleClear = () => {
    setFilterUser({
      level: "My Hierarchy List",
      control: "Primary",
      fromdate: today,
      todate: today,
      day: "Today"
    });
    setPopupContent('Cleared Successfully');
    setPopupSeverity("success");
    handleClickOpenPopup();
    setRaiseTicketList([]);
  };

  return (
    <Box>
      <Headtitle title={"USER TRAINING PANEL - REPORTS"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="User Hierarchy Training Panel - Reports"
        modulename="Traning"
        submodulename="Training Hierarchy Reports"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <br />
      <br />
      {isUserRoleCompare?.includes("ltraininghierarchyreports") && (
        <>
          <Box sx={{ ...userStyle.dialogbox }}>
            <>
              <Typography sx={userStyle.SubHeaderText}>
                User Hierarchy Training Panel - Reports
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
                    <Grid item md={4} xs={12} sm={12}>
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
            </>
          </Box>
          <br />
          <br />
          {/* </>
        )} */}
          <Box sx={userStyle.selectcontainer}>
            <Typography sx={userStyle.HeaderText}>User Hierarchy Training Panel - Reports List</Typography>

            {/* {isUserRoleCompare?.includes("ltraininghierarchyreports") && (
          <> */}
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
                {isUserRoleCompare?.includes(
                  "exceltraininghierarchyreports"
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
                  "csvtraininghierarchyreports"
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
                  "printtraininghierarchyreports"
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
                  "pdftraininghierarchyreports"
                ) && (
                    // <>
                    //     <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                    //         <FaFilePdf />
                    //         &ensp;Export to PDF&ensp;
                    //     </Button>
                    // </>
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
                  "imagetraininghierarchyreports"
                ) && (
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
                    <StyledTableCell>Training Status</StyledTableCell>
                    <StyledTableCell>Training Date</StyledTableCell>
                    <StyledTableCell>User Name</StyledTableCell>
                    <StyledTableCell>Training Time</StyledTableCell>
                    {/* <StyledTableCell>Priority</StyledTableCell> */}
                    <StyledTableCell>Training Name</StyledTableCell>
                    <StyledTableCell>Training Details</StyledTableCell>
                    <StyledTableCell>Frequency</StyledTableCell>
                    <StyledTableCell>Schedule</StyledTableCell>
                    <StyledTableCell>Duration</StyledTableCell>
                    <StyledTableCell>Required</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {filteredData?.length > 0 ? (
                    filteredData?.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{row.taskstatus}</StyledTableCell>
                        <StyledTableCell>
                          {row.taskassigneddate}
                        </StyledTableCell>
                        <StyledTableCell>{row.username}</StyledTableCell>
                        <StyledTableCell>{row.tasktime}</StyledTableCell>
                        {/* <StyledTableCell>{row.priority}</StyledTableCell> */}
                        <StyledTableCell>
                          {row.trainingdetails}
                        </StyledTableCell>
                        <StyledTableCell>{row.taskdetails}</StyledTableCell>
                        <StyledTableCell>{row.frequency}</StyledTableCell>
                        <StyledTableCell>{row.schedule}</StyledTableCell>
                        <StyledTableCell>{row.duration}</StyledTableCell>
                        <StyledTableCell>{row.required}</StyledTableCell>
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
            {/* </>
        )} */}
          </Box>
        </>
      )}

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
              sx={buttonStyles.buttonsubmit}
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



      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
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
        filename={"User_Hierarchy_Training_Panel-Reports"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default TrainingHierarchyReport;
