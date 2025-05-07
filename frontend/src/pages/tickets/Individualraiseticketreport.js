import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, RadioGroup, List, TextareaAutosize, Radio, FormControlLabel, Checkbox, InputAdornment, ListItemText, Tooltip, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, FaSearch } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
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
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Pagination from '../../components/Pagination';

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import domtoimage from 'dom-to-image';
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";

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

function IndividualRaiseTicketReport() {
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [filterValue, setFilterValue] = useState("");
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

  let exportColumnNames = ['Raised By',
    'Employee Code',
    'Raise Date',
    'Raise Time ',
    'Status ',
    'Closed By '];
  let exportRowValues = [
    'employeename',
    'employeecode',
    'date',
    'time',
    'raiseself',
    'ticketclosed'
  ];

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    serialNumber: true,
    employeename: true,
    employeecode: true,
    date: true,
    time: true,
    raiseself: true,
    ticketclosed: true,

  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);
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
      field: "employeename",
      headerName: "Raised By",
      flex: 0,
      width: 250,
      hide: !columnVisibility.employeename,
    },
    {
      field: "employeecode",
      headerName: "Employee Code",
      flex: 0,
      width: 300,
      hide: !columnVisibility.employeecode,
    },
    {
      field: "date",
      headerName: "Raise Date",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.date,
    },
    {
      field: "time",
      headerName: "Raise Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.time,
    },
    {
      field: "raiseself",
      headerName: "Status",
      flex: 0,
      width: 180,
      hide: !columnVisibility.raiseself,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <Typography sx={{
              color: params.data.raiseself === "Open" ? "red" :
                params.data.raiseself === "Resolved" ? "green" :
                  params.data.raiseself === "Details Needed" ? "blue" :
                    params.data.raiseself === "Closed" ? 'Orange' :
                      params.data.raiseself === "Forwarded" ? "palevioletred" :
                        params.data.raiseself === "Reject" ? "darkmagenta" : 'violet'
            }}>{params.data.raiseself}</Typography>                </Grid>

        </Grid>

      ),
    },
    {
      field: "ticketclosed",
      headerName: "Closed By",
      flex: 0,
      width: 180,
      hide: !columnVisibility.ticketclosed,
    },

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
      pagename: String("Ticket/Raise Ticket/Reports/Individual Ticket Report"),
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
  const [items, setItems] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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

  const [capturedImages, setCapturedImages] = useState([]);
  const [refImage, setRefImage] = useState([]);
  const [refImageDrag, setRefImageDrag] = useState([]);

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




  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
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

  const [allUploadedFiles, setAllUploadedFiles] = useState([]);
  //get all project.
  const fetchAllRaisedTickets = async () => {
    setPageName(!pageName);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      username: isUserRoleAccess.companyname,
      role: false,
    };
    const selctedNameColumn = selectedColumn === "status" ? "raiseself" :
     (selectedColumn === "date") ? "raiseddate" : selectedColumn === "reason" ? "textAreaCloseDetails" : selectedColumn
    const allFilters = [
      ...additionalFilters,
      { column: selctedNameColumn, condition: selectedCondition, value: filterValue }
    ];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }
    console.log(queryParams, 'queryParams')
    try {

      let res_task = await axios.post(SERVICE.RAISETICKET_REPORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // username: isUserRoleAccess.companyname,
        // role: false,
        // page: page,
        // pageSize: pageSize

      });

      const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : [];
      const overallList = res_task?.data?.overallListIndividual?.length > 0 ? res_task?.data?.overallListIndividual : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        date: moment(item?.createdAt).format("DD-MM-YYYY"),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        raiseself: item.raiseself,
        ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      const overallListDatas = overallList?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        date: moment(item?.createdAt).format("DD-MM-YYYY"),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        raiseself: item.raiseself,
        ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      setRaiseTicketList(itemsWithSerialNumber);
      setItemsList(overallListDatas)
      setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

      setQueueCheck(true);
    } catch (err) { setQueueCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleResetSearch = async () => {
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

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      username: isUserRoleAccess.companyname,
      role: false,
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }
    console.log(queryParams, 'queryParams')
    try {
      let res_task = await axios.post(SERVICE.RAISETICKET_REPORT, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const ans = res_task?.data?.result?.length > 0 ? res_task?.data?.result : [];
      const overallList = res_task?.data?.overallListIndividual?.length > 0 ? res_task?.data?.overallListIndividual : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        date: moment(item?.createdAt).format("DD-MM-YYYY"),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        raiseself: item.raiseself,
        ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      const overallListDatas = overallList?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        employeename: (item.employeename)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        employeecode: (item.employeecode)?.map((t, i) => `${i + 1 + ". "}` + t).join("\n"),
        date: moment(item?.createdAt).format("DD-MM-YYYY"),
        time: new Date(item?.createdAt).toLocaleTimeString(),
        raiseself: item.raiseself,
        ticketclosed: item.ticketclosed ? item.ticketclosed : "-",
      }));
      setRaiseTicketList(itemsWithSerialNumber);
      setItemsList(overallListDatas)
      setTotalProjects(ans?.length > 0 ? res_task?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_task?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setQueueCheck(true);
      // Trigger a table refresh if necessary
      setPageName((prev) => !prev); // Force re-render
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }

  };

  const [logicOperator, setLogicOperator] = useState("AND");
  // Search bar
  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState(null);
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
    setItems(data);
  };

  useEffect(() => {
    addSerialNumber(raiseTicketList);
  }, [raiseTicketList]);

  useEffect(() => {
    fetchAllRaisedTickets();
  }, [page, pageSize, searchQuery]);

  // Combine all arrays into a single array
  let combinedArray = allUploadedFiles.concat(refImage, refImageDrag, capturedImages);

  // Create an empty object to keep track of unique values
  let uniqueValues = {};

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

  useEffect(() => {
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);


  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      employeename: item.employeename,
      employeecode: (item.employeecode),
      date: item?.date,
      time: item?.time,
      raiseself: item.raiseself,
      ticketclosed: item.ticketclosed,
    };
  });

  // Excel
  const fileName = "IndividualRaiseTicketReport";
  let snos = 1;


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Individual Ticket Report",
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
          saveAs(blob, "Individual Ticket Report.png");
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

  return (
    <Box>
      <Headtitle title={"INDIVIDUAL RAISE TICKET REPORT"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Individual Raise Ticket Report"
        modulename="Tickets"
        submodulename="Raise Ticket"
        mainpagename="Reports"
        subpagename="Individual Ticket Report"
        subsubpagename=""
      />

      {!queueCheck ? (
        <Box sx={userStyle.container}>
          <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box>
      ) : (
        <>
          {isUserRoleCompare?.includes("lindividualticketreport") && (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={userStyle.HeaderText}>Individual Raise Ticket Report</Typography>
                  </Grid>

                </Grid>
                <br></br>

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
                        <MenuItem value={itemsList?.length}>All</MenuItem>
                      </Select>
                    </Box>
                    <Box>

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
                    {isUserRoleCompare?.includes("excelindividualticketreport") && (

                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvindividualticketreport") && (


                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                      </>
                    )}
                    {isUserRoleCompare?.includes("printindividualticketreport") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfindividualticketreport") && (

                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                          }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageindividualticketreport") && (
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
                      totalDatas={itemsList}
                    />
                  </Grid> */}

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
                <br />
                {/* ****** Table Grid Container ****** */}

                <br />
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
                    itemsList={itemsList}

                  />
                </Box>

                {/* ****** Table End ****** */}
              </Box>
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="customized table" id="raisetickets" ref={componentRef}>
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell>S.No</StyledTableCell>
                      <StyledTableCell>Raised By</StyledTableCell>
                      <StyledTableCell>Employee Code</StyledTableCell>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Time</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Closed By</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {rowDataTable?.length > 0 ? (
                      rowDataTable?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{(row.employeename)}</StyledTableCell>
                          <StyledTableCell>{(row.employeecode)}</StyledTableCell>
                          <StyledTableCell>{row?.date}</StyledTableCell>
                          <StyledTableCell>{row?.time}</StyledTableCell>
                          <StyledTableCell>{row.raiseself}</StyledTableCell>
                          <StyledTableCell>{row?.ticketclosed}</StyledTableCell>
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
      )}

      <br />
      <br />
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
        itemsTwo={itemsList ?? []}
        filename={"Individual Ticket Report"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />


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
                      fetchAllRaisedTickets();
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


    </Box>
  );
}

export default IndividualRaiseTicketReport;
