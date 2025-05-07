import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box, InputAdornment,
  Button,
  Checkbox,
  Dialog,
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
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
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

function MaintenanceServiceRecord() {
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
    "Status",
    "Date",
    "Time",
    "Details",
    "frequency",
    "schedule",
    "Task",
    "duration",
    "required",
    "breakup",
    "description",
  ];
  let exportRowValues = [
    "taskstatus",
    "taskassigneddate",
    "tasktime",
    "taskdetails",
    "frequency",
    "schedule",
    "assetmaterial",
    "duration",
    "required",
    "breakup",
    "description",
  ];

  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Maintenance Service Record.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };


  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Maintenance Service"),
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

  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
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
  // const formattedSeconds = currentSeconds >= 10 ? currentSeconds : '0' + currentSeconds;
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
    if (selectedRows.includes(params.data.id)) {
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
    assetmaterial: true,
    subcategory: true,
    subsubcategory: true,
    schedule: true,
    duration: true,
    type: true,
    taskname: true,
    taskdate: true,
    username: true,
    required: true,
    taskdetails: true,
    tasktime: true,
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

    setItems(datas);

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
    //       checked={selectedRows.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRows.filter(
    //             (selectedId) => selectedId !== params.data.id
    //           );
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.data.id];
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
      field: "taskstatus",
      headerName: "Status",
      flex: 0,
      width: 200,
      hide: !columnVisibility.taskstatus,
      renderCell: (params) => (
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
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.taskassigneddate,
    },
    {
      field: "tasktime",
      headerName: "Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.tasktime,
    },
    {
      field: "taskdetails",
      headerName: "Details",
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
      serialNumber: item.serialNumber,
      taskstatus: item?.taskstatus,
      taskassigneddate: item?.taskassigneddate,
      taskdetails: item?.taskdetails,
      tasktime: item?.tasktime,
      assetmaterial: item.assetmaterial,
      subcategory: item.subcategory,
      schedule: item.schedule,
      duration: item.duration,
      frequency: item.frequency,
      required: item?.required,
      breakup: item?.breakup,
      description: item.description,
    };
  });

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Maintenance Service Record",
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

  const ListPageLoadDataCompleted = async () => {
    setPageName(!pageName)
    try {
      let res_task = await axios.get(SERVICE.ALL_TASKMAINTENACEFORUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let anstaskUserPanel =
        res_task?.data?.taskmaintenanceforuser?.length > 0
          ? res_task?.data?.taskmaintenanceforuser?.filter(
            (data) =>
              data?.username === isUserRoleAccess?.companyname &&
              data.taskdetails !== "Manual" &&
              [
                "Completed",
                "Finished By Others",
                "Not Applicable to Me",
              ]?.includes(data?.taskstatus)
          )
          : [];
      setRaiseTicketList(anstaskUserPanel?.map((item, index) => ({
        serialNumber: index + 1,
        id: item._id,
        taskstatus: item.taskstatus,
        taskassigneddate: item.taskassigneddate,
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
      })));
      setQueueCheck(true);
    } catch (err) {
      setQueueCheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };

  useEffect(() => {
    ListPageLoadDataCompleted();
  }, []);

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
      <Headtitle title={"MAINTENANCE SERVICE RECORD "} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>
        Maintenance Serviece Record
      </Typography> */}
      <PageHeading
        title="Maintenance Serviece Record"
        modulename="Asset"
        submodulename="Maintenance"
        mainpagename="Maintenance Service"
        subpagename=""
        subsubpagename=""
      />

      <>
        {isUserRoleCompare?.includes("lmaintenanceservice") && (
          <>
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Maintenance Service Record List
                  </Typography>
                </Grid>
              </Grid>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container sx={{ justifyContent: "center" }}>
                <Grid>
                  {isUserRoleCompare?.includes("excelmaintenanceservice") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          ListPageLoadDataCompleted();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvmaintenanceservice") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          ListPageLoadDataCompleted();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printmaintenanceservice") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfmaintenanceservice") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          ListPageLoadDataCompleted();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagemaintenanceservice") && (
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
              {/* ****** Table start ****** */}
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
                  <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                  </Box>
                </>
              )}


              {/* <TaskForUser/> */}
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
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Time</StyledTableCell>
                      <StyledTableCell>Details</StyledTableCell>
                      <StyledTableCell>Frequency</StyledTableCell>
                      <StyledTableCell>Schedule</StyledTableCell>
                      <StyledTableCell>Task</StyledTableCell>
                      <StyledTableCell>Duration</StyledTableCell>
                      <StyledTableCell>Required</StyledTableCell>
                      <StyledTableCell>Break Up</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {rowDataTable?.length > 0 ? (
                      rowDataTable?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.taskstatus}</StyledTableCell>
                          <StyledTableCell>
                            {row.taskassigneddate}
                          </StyledTableCell>
                          <StyledTableCell>{row.tasktime}</StyledTableCell>
                          <StyledTableCell>{row.taskdetails}</StyledTableCell>
                          <StyledTableCell>{row.frequency}</StyledTableCell>
                          <StyledTableCell>{row.schedule}</StyledTableCell>
                          <StyledTableCell>
                            {row.assetmaterial}
                          </StyledTableCell>
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
      </>


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
        filename={"MaintenanceServiceRecord"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default MaintenanceServiceRecord;
