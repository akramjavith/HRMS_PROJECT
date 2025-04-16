import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box, InputAdornment,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";


function MaintenanceHierarchyReport({ com }) {
  const [raiseTicketList, setRaiseTicketList] = useState([]);

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

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
  };

  let exportColumnNames = [
    "Username",
    "TaskStatus",
    "TaskDate",
    "TaskTime",
    "Priority",
    "TaskDetails",
    "frequency",
    "schedule",
    "Manitenance",
    "duration",
    "required",
    "breakup",
    "description",
  ];
  let exportRowValues = [
    "username",
    "taskstatus",
    "taskassigneddate",
    "tasktime",
    "priority",
    "taskdetails",
    "frequency",
    "schedule",
    "assetmaterial",
    "duration",
    "required",
    "breakup",
    "description",
  ];


  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Maintenance Hierarchy Reports"),
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



  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);

  // image


  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Maintenance Hierarchy Reports.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };


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
    level: "Please Select Level",
    control: "Please Select Control",
  });

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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      // setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
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
    date: true,
    checkbox: true,
    serialNumber: true,
    frequency: true,
    taskname: true,
    taskdate: true,
    username: true,
    category: true,
    assetmaterial: true,
    subcategory: true,
    subsubcategory: true,
    schedule: true,
    tasktime: true,
    priority: true,
    duration: true,
    type: true,
    taskdetails: true,
    required: true,
    breakup: true,
    description: true,
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
  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      serialNumber: index + 1,
      id: item._id,
      taskstatus: item.taskstatus,
      taskassigneddate: moment(item.taskassigneddate).format("DD/MM/YYYY"),
      priority: item.priority,
      assetmaterial: item.assetmaterial,
      tasktime:
        item?.taskdetails === "nonschedule"
          ? item.schedule === "Any Time"
            ? ""
            : convertTimeToAMPMFormat(item.tasktime)
          : item.schedule === "Any Time"
            ? ""
            : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
      frequency: item.frequency,
      taskdetails: item.taskdetails,
      schedule: item.schedule,
      duration: item.duration,
      type: item.type,
      username: item.username,
      required: item?.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      breakup: item?.breakup,
      description: item?.description
        ? convertToNumberedList(item?.description)
        : "",
    }));

    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(raiseTicketList);
  }, [raiseTicketList]);

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

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

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
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.row.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.row.id)) {
    //           updatedSelectedRows = selectedRows.filter(
    //             (selectedId) => selectedId !== params?.data.id
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params?.data.id];
    //         }

    //         setSelectedRows(updatedSelectedRows);
    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(
    //           updatedSelectedRows.length === filteredData.length
    //         );
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 75,

    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },
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
      width: 90,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
    },
    {
      field: "taskstatus",
      headerName: "Task Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.taskstatus,
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
            {params?.row?.taskstatus}
          </Typography>
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
          <Typography
            sx={{
              color: params?.data?.taskdetails === "schedule" ? "green" : "blue",
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
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <Typography
              sx={{
                color:
                  params?.data.frequency === "Daily"
                    ? "red"
                    : params?.data.frequency === "Date Wise"
                      ? "green"
                      : params?.data.frequency === "Monthly"
                        ? "blue"
                        : params?.data.frequency === "Annually"
                          ? "Orange"
                          : params?.data.frequency === "Day Wise"
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
      field: "assetmaterial",
      headerName: "Task",
      flex: 0,
      width: 250,
      hide: !columnVisibility.assetmaterial,
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
    {
      field: "description",
      headerName: "Description",
      flex: 0,
      width: 100,
      hide: !columnVisibility.description,
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
      serialNumber: item?.serialNumber,
      taskstatus: item?.taskstatus,
      taskassigneddate: item?.taskassigneddate,
      taskdetails: item?.taskdetails,
      priority: item.priority,
      tasktime: item?.tasktime,
      username: item?.username,
      assetmaterial: item?.assetmaterial,
      subcategory: item?.subcategory,
      schedule: item?.schedule,
      duration: item?.duration,
      frequency: item?.frequency,
      required: item?.required,
      breakup: item?.breakup,
      description: item?.description,
    };
  });

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "User Hierarchy Manitenance Panel-Report",
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

    setPageName(!pageName)
    e.preventDefault();
    if (taskhierarchy?.date === "" || taskhierarchy?.date === undefined) {
      setPopupContentMalert("Please Choose Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskhierarchy?.level === "Please Select Level" ||
      taskhierarchy?.level === "" ||
      taskhierarchy?.level === undefined
    ) {
      setPopupContentMalert("Please Select Level!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      taskhierarchy?.control === "Please Select Control" ||
      taskhierarchy?.control === "" ||
      taskhierarchy?.level === undefined
    ) {
      setPopupContentMalert("Please Select Control!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      ListPageLoadDataOnprogress();
    }
  };

  const ListPageLoadDataOnprogress = async () => {

    setPageName(!pageName)
    try {
      setQueueCheck(false);
      let res_task = await axios.post(
        SERVICE.ALL_MAINTENANCE_HIERARCHY_REPORTS,
        {
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
        }
      );

      setRaiseTicketList(res_task?.data?.resultAccessFilter);
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleClear = () => {

    setPageName(!pageName)
    setTaskHierarchy({
      date: formattedDate,
      level: "Please Select Level",
      control: "Please Select Control",
    });
    setRaiseTicketList([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const [fileFormat, setFormat] = useState("");

  return (
    <Box>
      <Headtitle title={"USER MAINTENANCE PANEL - REPORTS"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.SubHeaderText}>
        User Hierarchy Manitenance Panel - Reports
      </Typography> */}
      <PageHeading
        title="User Hierarchy Manitenance Panel - Reports"
        modulename="Asset"
        submodulename="Maintenance"
        mainpagename="Maintenance Hierarchy Reports"
        subpagename=""
        subsubpagename=""
      />
      <br />
      <br />

      <Box sx={userStyle.dialogbox}>
        <>
          <Typography sx={userStyle.SubHeaderText}>
            Manage User Hierarchy Manitenance Panel - Reports
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
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode<b style={{ color: "red" }}>*</b>
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
              <Grid item md={3} sm={12} xs={12}>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
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
          {isUserRoleCompare?.includes("lmaintenancehierarchyreports") && (
            <>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <br></br>
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes(
                    "excelmaintenancehierarchyreports"
                  ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            ListPageLoadDataOnprogress();
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
                    "csvmaintenancehierarchyreports"
                  ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            ListPageLoadDataOnprogress();
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
                    "printmaintenancehierarchyreports"
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
                    "pdfmaintenancehierarchyreports"
                  ) && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            ListPageLoadDataOnprogress();
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes(
                    "imagemaintenancehierarchyreports"
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
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={raiseTicketList}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
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
                    />
                  </>

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
      {/* )} */}

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
        filename={"User Hierarchy Manitenance Panel-Report"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default MaintenanceHierarchyReport;
