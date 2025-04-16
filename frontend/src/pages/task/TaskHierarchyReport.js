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
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
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
import PageHeading from "../../components/PageHeading";

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

function TaskHierarchyReport({ com }) {
  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  const classes = useStyles();
  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode } =
    useContext(UserRoleAccessContext);
  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Task" &&
        data.submodulename === "Task Hierarchy Reports" &&
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

  const [taskhierarchy, setTaskHierarchy] = useState({
    date: formattedDate,
    level: "My Hierarchy List",
    control: "Primary",
  });

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
  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredData?.map((item, index) => ({
          Sno: index + 1,
          TaskStatus: item.taskstatus,
          Username: item.username,
          TaskDate: item.taskassigneddate,
          TaskTime: item.tasktime,
          TaskDetails: item.taskdetails,
          Frequency: item.frequency,
          Schedule: item.schedule,
          Task: item.category,
          SubTask: item.subcategory,
          Duration: item.duration,
          Breakup: item?.breakup,
          Required: item?.required,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((item, index) => ({
          Sno: index + 1,
          TaskStatus: item.taskstatus,
          Username: item.username,
          TaskDate: item.taskassigneddate,
          TaskTime: item.tasktime,
          TaskDetails: item.taskdetails,
          Frequency: item.frequency,
          Schedule: item.schedule,
          Task: item.category,
          SubTask: item.subcategory,
          Duration: item.duration,
          Breakup: item?.breakup,
          Required: item?.required,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((item) => ({
            serialNumber: serialNumberCounter++,
            taskstatus: item.taskstatus,
            username: item.username,
            taskassigneddate: item.taskassigneddate,
            tasktime: item.tasktime,
            taskdetails: item.taskdetails,
            frequency: item.frequency,
            schedule: item.schedule,
            category: item.category,
            subcategory: item.subcategory,
            duration: item.duration,
            breakup: item?.breakup,
            required: item?.required,
          }))
        : items?.map((item) => ({
            serialNumber: serialNumberCounter++,
            taskstatus: item.taskstatus,
            username: item.username,
            taskassigneddate: item.taskassigneddate,
            tasktime: item.tasktime,
            taskdetails: item.taskdetails,
            frequency: item.frequency,
            schedule: item.schedule,
            category: item.category,
            subcategory: item.subcategory,
            duration: item.duration,
            breakup: item?.breakup,
            required: item?.required,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("User_Hierarchy_Task_Panel-Report.pdf");
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

    return `${hour < 10 ? "0" + hour : hour}:${
      minute < 10 ? "0" + minute : minute
    } ${timetype}`;
  };

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = raiseTicketList?.map((item, index) => ({
      serialNumber: index + 1,
      id: item._id,
      taskstatus: item.taskstatus,
      taskassigneddate: item.taskassigneddate,
      category: item.category,
      tasktime:
        item?.taskdetails === "nonschedule"
          ? item.schedule === "Any Time"
            ? ""
            : convertTimeToAMPMFormat(item.tasktime)
          : item.schedule === "Any Time"
          ? ""
          : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
      frequency: item.frequency,
      username: item.username,
      subcategory: item.subcategory,
      taskdetails: item.taskdetails,
      schedule: item.schedule,
      duration: item.duration,
      type: item.type,
      required: item?.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      breakup: item?.breakup,
      description: item?.description
        ? convertToNumberedList(item?.description)
        : "",
    }));

    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
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
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
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
          <Typography
            sx={{
              color:
                params?.row?.taskstatus === "Assigned"
                  ? "green"
                  : params?.row?.taskstatus === "Pending"
                  ? "red"
                  : "blue",
            }}
          >
            {params?.row?.taskstatus}
          </Typography>
        </Grid>
      ),
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.username,
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
          <Typography
            sx={{
              color: params?.row?.taskdetails === "schedule" ? "green" : "blue",
            }}
          >
            {params?.row?.taskdetails}
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <Typography
              sx={{
                color:
                  params.row.frequency === "Daily"
                    ? "red"
                    : params.row.frequency === "Date Wise"
                    ? "green"
                    : params.row.frequency === "Monthly"
                    ? "blue"
                    : params.row.frequency === "Annually"
                    ? "Orange"
                    : params.row.frequency === "Day Wise"
                    ? "palevioletred"
                    : "violet",
              }}
            >
              {params.row.frequency}
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
      category: item.category,
      subcategory: item.subcategory,
      schedule: item.schedule,
      duration: item.duration,
      username: item.username,
      frequency: item.frequency,
      required: item?.required,
      breakup: item?.breakup,
      description: item.description,
    };
  });

  // Excel
  const fileName = "User_Hierarchy_Task_Panel-Report";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "User_Hierarchy_Task_Panel-Report",
    pageStyle: "print",
  });

  const columns = [
    { title: "Task Status", field: "taskstatus" },
    { title: "User Name", field: "username" },
    { title: "Task Date", field: "taskassigneddate" },
    { title: "Task Time", field: "tasktime" },
    { title: "Task Details", field: "taskdetails" },
    { title: "Frequency", field: "frequency" },
    { title: "Schedule", field: "schedule" },
    { title: "Task", field: "category" },
    { title: "Sub Task", field: "subcategory" },
    { title: "Duration", field: "duration" },
    { title: "Required", field: "required" },
    { title: "Break Up", field: "breakup" },
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
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "User_Hierarchy_Task_Panel-Report.png");
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
    if (taskhierarchy?.date === "" || taskhierarchy?.date === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      taskhierarchy?.level === "Please Select Level" ||
      taskhierarchy?.level === "" ||
      taskhierarchy?.level === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Level"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      taskhierarchy?.control === "Please Select Control" ||
      taskhierarchy?.control === "" ||
      taskhierarchy?.level === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Control"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      ListPageLoadDataOnprogress();
    }
  };

  const ListPageLoadDataOnprogress = async () => {
    try {
      setQueueCheck(false);
      let res_task = await axios.post(SERVICE.ALL_TASK_HIERARCHY_REPORTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: moment(taskhierarchy?.date)?.format("DD-MM-YYYY"),
        hierachy:
          taskhierarchy?.level === "My Hierarchy List"
            ? "myhierarchy"
            : taskhierarchy?.level === "All Hierarchy List"
            ? "allhierarchy"
            : "myallhierarchy",
        sector: taskhierarchy?.control,
        username: isUserRoleAccess?.companyname,
        team: isUserRoleAccess.team,
        listpageaccessmode: listpageaccessby,
      });
      setRaiseTicketList(res_task?.data?.resultAccessFilter);
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleClear = () => {
    setTaskHierarchy({
      date: formattedDate,
      level: "My Hierarchy List",
      control: "Primary",
    });
    setRaiseTicketList([]);
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  return (
    <Box>
      <Headtitle title={"USER TASK PANEL - REPORTS"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="User Hierarchy Task Panel - Reports"
        modulename="Task"
        submodulename="Task Hierarchy Reports"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      <br />
      <br />

      <Box sx={{ ...userStyle.dialogbox, marginTop: "-80px" }}>
        <>
          <Typography sx={userStyle.SubHeaderText}>
            Manage User Hierarchy Task Panel - Reports
          </Typography>
          <br />
          <br />
          <br />
          <Grid container spacing={2}>
            <>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="Date"
                    value={taskhierarchy.date}
                    onChange={(e) => {
                      setTaskHierarchy({
                        ...taskhierarchy,
                        date: e.target.value,
                      });
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
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Level<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={modeDropDowns}
                        styles={colourStyles}
                        value={{
                          label: taskhierarchy.level,
                          value: taskhierarchy.level,
                        }}
                        onChange={(e) => {
                          setTaskHierarchy({
                            ...taskhierarchy,
                            level: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Control<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={sectorDropDowns}
                        styles={colourStyles}
                        value={{
                          label: taskhierarchy.control,
                          value: taskhierarchy.control,
                        }}
                        onChange={(e) => {
                          setTaskHierarchy({
                            ...taskhierarchy,
                            control: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={3} sm={12} xs={12}>
                <Grid sx={{ display: "flex", gap: "15px" }}>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    {" "}
                    Filter
                  </Button>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={() => {
                      handleClear();
                    }}
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
          {isUserRoleCompare?.includes("ltaskhierarchyreports") && (
            <>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <br></br>
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("exceltaskhierarchyreports") && (
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
                  {isUserRoleCompare?.includes("csvtaskhierarchyreports") && (
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
                  {isUserRoleCompare?.includes("printtaskhierarchyreports") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdftaskhierarchyreports") && (
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
                  {isUserRoleCompare?.includes("imagetaskhierarchyreports") && (
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
                    <MenuItem value={raiseTicketList?.length}>All</MenuItem>
                  </Select>
                </Box>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
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
                  <StyledDataGrid
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    ref={gridRef}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                )}
              </Box>
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing{" "}
                  {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                  {filteredDatas.length} entries
                </Box>
                <Box>
                  <Button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    sx={userStyle.paginationbtn}
                  >
                    <FirstPageIcon />
                  </Button>
                  <Button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    sx={userStyle.paginationbtn}
                  >
                    <NavigateBeforeIcon />
                  </Button>
                  {pageNumbers?.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      sx={userStyle.paginationbtn}
                      onClick={() => handlePageChange(pageNumber)}
                      className={page === pageNumber ? "active" : ""}
                      disabled={page === pageNumber}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  {lastVisiblePage < totalPages && <span>...</span>}
                  <Button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    sx={userStyle.paginationbtn}
                  >
                    <NavigateNextIcon />
                  </Button>
                  <Button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    sx={userStyle.paginationbtn}
                  >
                    <LastPageIcon />
                  </Button>
                </Box>
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
            </>
          )}
        </>
      </Box>
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

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          )}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}

export default TaskHierarchyReport;
