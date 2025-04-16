import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  ListItemText,
  ListItem,
  Tooltip,
  Select,
  OutlinedInput,
  FormControl,
  MenuItem,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  List,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import moment from "moment-timezone";
import { Link, useNavigate, useParams } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import Headtitle from "../../../components/Headtitle";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { styles } from "@material-ui/pickers/views/Calendar/Calendar";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PauseIcon from "@mui/icons-material/Pause";
import BlockIcon from "@mui/icons-material/Block";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventBusyIcon from "@mui/icons-material/EventBusy";

function DeactivateInternlistView() {
  const [employees, setEmployees] = useState([]);
  const { isUserRoleAccess, isUserRoleCompare } = useContext(
    UserRoleAccessContext
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modeInt, setModeInt] = useState("");
  const [internCourseNames, setInternCourseNames] = useState();
  const { auth, setAuth } = useContext(AuthContext);
  const [getrowid, setRowGetid] = useState([]);

  const gridRef = useRef(null);

  //image
  const handleCaptureImage = () => {
    // Find the table by its ID
    const table = document.getElementById("excelcanvastable");

    // Clone the table element
    const clonedTable = table.cloneNode(true);

    // Append the cloned table to the document body (it won't be visible)
    clonedTable.style.position = "absolute";
    clonedTable.style.top = "-9999px";
    document.body.appendChild(clonedTable);

    // Use html2canvas to capture the cloned table
    html2canvas(clonedTable).then((canvas) => {
      // Remove the cloned table from the document body
      document.body.removeChild(clonedTable);

      // Convert the canvas to a data URL and create a download link
      const dataURL = canvas.toDataURL("image/jpeg", 0.8);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "Deactivate Intern List View.png";
      link.click();
    });
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [empaddform, setEmpaddform] = useState({});
  // const [selectedbranch, setselectedbranch] = useState([]);
  const [exceldata, setexceldata] = useState([]);

  const [isBoarding, setIsBoarding] = useState(false);

  let username = isUserRoleAccess.name;
  // const id = useParams().id

  // popover content
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //    popup for releaving
  const [openviewReleave, setOpenviewReleave] = useState(false);

  const handleCloseviewReleave = () => {
    setOpenviewReleave(false);
  };
  const renderStatus = (status) => {
    const iconProps = {
      size: "small",
      style: { marginRight: 4 },
    };

    let icon = <InfoIcon {...iconProps} />;
    let color = "#ccc"; // Default color

    switch (status) {
      case "Releave Employee":
        icon = <ExitToAppIcon {...iconProps} />;
        color = "#8bc34a"; // Light Green
        break;
      case "Absconded":
        icon = <DirectionsRunIcon {...iconProps} />;
        color = "#ff5722"; // Deep Orange
        break;
      case "Hold":
        icon = <PauseIcon {...iconProps} />;
        color = "#ff9800"; // Light Orange
        break;
      case "Terminate":
        icon = <BlockIcon {...iconProps} />;
        color = "#f44336"; // Red
        break;
      case "Not Joined":
        icon = <PersonOffIcon {...iconProps} />;
        color = "#9e9e9e"; // Grey
        break;
      case "Rejected":
        icon = <ThumbDownIcon {...iconProps} />;
        color = "#e91e63"; // Pink
        break;
      case "Closed":
        icon = <CheckCircleIcon {...iconProps} />;
        color = "#4caf50"; // Green
        break;
      case "Postponed":
        icon = <EventBusyIcon {...iconProps} />;
        color = "#3f51b5"; // Indigo
        break;
      default:
        icon = <InfoIcon {...iconProps} />;
        color = "#ccc"; // Default color
    }
    return (
      <Tooltip title={status} arrow>
        <Button
          variant="contained"
          startIcon={icon}
          sx={{
            fontSize: "0.75rem",
            padding: "2px 6px",
            cursor: "default",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
            minWidth: "100px",
            display: "flex",
            justifyContent: "flex-start",
            backgroundColor: color,
            "&:hover": {
              backgroundColor: color,
              overflow: "visible",
              whiteSpace: "normal",
              maxWidth: "none",
            },
          }}
          disableElevation
        >
          <Typography variant="body2" noWrap>
            {status}
          </Typography>
        </Button>
      </Tooltip>
    );
  };

  // Show all columns
  const [columnVisibility, setColumnVisibility] = useState({
    actions: true,
    serialNumber: true,
    empcode: true,
    companyname: true,
    department: true,
    dateofbirth: true,
    personalnumber: true,
    dateofjoining: true,
    experience: true,
    enddate: true,
    reportingto: true,
    reason: true,
  });

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const fetchEmployee = async () => {
    try {
      let res = await axios.get(SERVICE.INTERN_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // Filter the data based on multiple conditions
      let ans = res.data.allinterns.filter((data) => {
        const status = data.resonablestatus;
        return (
          status === "Releave Employee" ||
          status === "Absconded" ||
          status === "Hold" ||
          status === "Terminate" ||
          status === "Not Joined" ||
          status === "Postponed" ||
          status === "Rejected" ||
          status === "Closed"
        );
      });
      setEmployees(ans);

      setIsBoarding(true);
    } catch (err) {setIsBoarding(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
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

  const [employeesFilteArray, setEmployeesFilteArray] = useState([]);

  const fetchEmployeeArray = async () => {
    try {
      let res = await axios.get(SERVICE.INTERN_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // Filter the data based on multiple conditions
      let ans = res.data.allinterns.filter((data) => {
        const status = data.resonablestatus;
        return (
          status === "Releave Employee" ||
          status === "Absconded" ||
          status === "Hold" ||
          status === "Terminate" ||
          status === "Not Joined" ||
          status === "Postponed" ||
          status === "Rejected" ||
          status === "Closed"
        );
      });
      setEmployeesFilteArray(ans);

      setIsBoarding(true);
    } catch (err) {setIsBoarding(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchEmployeeArray();
  }, [isFilterOpen]);

  //id for login...;
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  //  PDF
  const columns = [
    { title: "Empcode", field: "empcode" },
    { title: "Mode", field: "resonablestatus" },
    { title: "Name", field: "companyname" },
    { title: "Department", field: "department" },
    { title: "Dob", field: "dob" },
    { title: "PersonalNo", field: "contactpersonal" },
    { title: "DOJ", field: "doj" },
    { title: "Experience", field: "experience" },
    { title: "EndDate", field: "reasondate" },
    { title: "Reportingto", field: "reportingto" },
    { title: "Reason", field: "reasonname" },
  ];

  // const downloadPdf = () => {
  //   const doc = new jsPDF();
  //   doc.autoTable({
  //     theme: "grid",
  //     styles: {
  //       fontSize: 6,
  //     },
  //     columns: columns.map((col) => ({ ...col, dataKey: col.field })),
  //     body: rowDataTable,
  //   });
  //   doc.save("Deactivate Intern List View.pdf");
  // };

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
          }))
        : employeesFilteArray.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
            dob: moment(row.dob).format("DD-MM-YYYY"),
            doj: moment(row.doj).format("DD-MM-YYYY"),
            reasondate: moment(row.reasondate).format("DD-MM-YYYY"),
          }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Deactivate Intern List View.pdf");
  };

  // Excel
  const fileName = "Deactivate Intern List View";
  let excelno = 1;

  // get particular columns for export excel
  const getexcelDatas = async () => {
    try {
      var data = employees.map((t, index) => ({
        Sno: index++,
        Mode: t.resonablestatus,
        Empcode: t.empcode,
        Name: t.companyname,
        Department: t.department,
        DateOfBirth: t.dob,
        PersonalNumber: t.contactpersonal,
        Dob: t.doj,
        Experience: t.experience,
        ReasonDate: t.reasondate,
        ReportingTo: t.reportingto,
        Reason: t.reasonname,
      }));
      setexceldata(data);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Deactivate Intern List View",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  useEffect(() => {
    getexcelDatas();
  }, [employees]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const handleSorting = (column) => {
    const direction =
      sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return (
        <>
          <Box sx={{ color: "#bbb6b6" }}>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sorting.direction === "asc") {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    }
  };

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
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

  const totalPages = Math.ceil(employees.length / pageSize);

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

  // Table start colum and row
  // Define columns for the DataGrid
  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 150,
      hide: !columnVisibility.empcode,
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.companyname,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibility.department,
    },
    {
      field: "dob",
      headerName: "DOB",
      flex: 0,
      width: 100,
      hide: !columnVisibility.dob,
    },
    {
      field: "contactpersonal",
      headerName: "Personal Number",
      flex: 0,
      width: 150,
      hide: !columnVisibility.contactpersonal,
    },
    {
      field: "doj",
      headerName: "DOJ",
      flex: 0,
      width: 100,
      hide: !columnVisibility.doj,
    },
    {
      field: "experience",
      headerName: "Experience",
      flex: 0,
      width: 100,
      hide: !columnVisibility.experience,
    },
    {
      field: "reasondate",
      headerName: "EndDate",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reasondate,
    },
    {
      field: "reportingto",
      headerName: "Reporting to",
      flex: 0,
      width: 250,
      hide: !columnVisibility.reportingto,
    },
    {
      field: "resonablestatus",
      headerName: "Reason",
      flex: 0,
      width: 200,
      hide: !columnVisibility.resonablestatus,
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((notice, index) => {
    return {
      id: notice._id,
      serialNumber: notice.serialNumber,
      empcode: notice.empcode,
      companyname: notice.companyname,
      department: notice.department,
      dob: moment(notice.dob).format("DD-MM-YYYY"),
      contactpersonal: notice.contactpersonal,
      doj: moment(notice.doj).format("DD-MM-YYYY"),
      experience: notice.experience,
      reasondate: moment(notice.reasondate).format("DD-MM-YYYY"),
      reportingto: notice.reportingto,
      resonablestatus: notice.resonablestatus,
      reasonname: notice.reasonname,
    };
  });

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeight = () => {
    if (pageSize === "All") {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatas.length);
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${
        visibleRows > 0
          ? visibleRows * rowHeight + extraSpace
          : scrollbarWidth + extraSpace
      }px`;
    }
  };

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

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          Mode: t.resonablestatus,
          Empcode: t.empcode,
          Name: t.companyname,
          Department: t.department,
          Dob: t.dob,
          PersonalNumber: t.contactpersonal,
          Doj: t.doj,
          Experience: t.experience,
          EndDate: t.reasondate,
          ReportingTo: t.reportingto,
          Reason: t.reasonname,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employeesFilteArray.map((t, index) => ({
          Sno: index + 1,
          Mode: t.resonablestatus,
          Empcode: t.empcode,
          Name: t.companyname,
          Department: t.department,
          Dob: moment(t.dob).format("DD-MM-YYYY"),
          PersonalNumber: t.contactpersonal,
          Doj: moment(t.doj).format("DD-MM-YYYY"),
          Experience: t.experience,
          EndDate: moment(t.reasondate).format("DD-MM-YYYY"),
          ReportingTo: t.reportingto,
          Reason: t.reasonname,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"DEACTIVE INTERN LIST VIEW"} />

      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Deactivate Intern List View
      </Typography>
      <br />
      {isUserRoleCompare?.includes("ldeactivateinternlistview") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Deactivate Intern List View
                </Typography>
              </Grid>
            </Grid>
            {!isBoarding ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              </>
            ) : (
              <>
                <br />
                <br />

                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes(
                      "csvdeactivateinternlistview"
                    ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            fetchEmployeeArray();
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
                      "exceldeactivateinternlistview"
                    ) && (
                      <>
                        <Button
                          onClick={(e) => {
                            setIsFilterOpen(true);
                            fetchEmployeeArray();
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
                      "printdeactivateinternlistview"
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
                      "pdfdeactivateinternlistview"
                    ) && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true);
                            fetchEmployeeArray();
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes(
                      "imagedeactivateinternlistview"
                    ) && (
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
                {/* added to the pagination grid */}
                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label htmlFor="pageSizeSelect">Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={employees.length}>All</MenuItem> */}
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
                <br />
                {/* ****** Table Grid Container ****** */}
                <Grid container>
                  <Grid md={4} sm={2} xs={1}></Grid>
                  <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
                </Grid>
                <br />

                {/* ****** Table start ****** */}

                {/* {isLoader ? ( */}
                <TableContainer
                  component={Paper}
                  ref={gridRef}
                  id="excelcanvastable"
                >
                  <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                  >
                    <TableHead sx={{ fontWeight: "600" }}>
                      <StyledTableRow>
                        <StyledTableCell
                          onClick={() => handleSorting("serialNumber")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>SNo</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("serialNumber")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("resonablestatus")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Mode</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("resonablestatus")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("empcode")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Empcode</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("empcode")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("companyname")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Name</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("companyname")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("department")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Department</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("department")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("dob")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>DOB</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("dob")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("contactpersonal")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Personal Number</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("contactpersonal")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("doj")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>DOJ</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("doj")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("experience")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Experience</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("experience")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("reasondate")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>EndDate</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("reasondate")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => handleSorting("reportingto")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Reporting To</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("reportingto")}
                            </Box>
                          </Box>
                        </StyledTableCell>

                        <StyledTableCell
                          onClick={() => handleSorting("reasonname")}
                        >
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Reason</Box>
                            <Box sx={{ marginTop: "-6PX" }}>
                              {renderSortingIcon("reasonname")}
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {filteredData?.length > 0 ? (
                        filteredData?.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              {row.serialNumber}
                            </StyledTableCell>
                            <StyledTableCell>
                              {renderStatus(row.resonablestatus)}
                            </StyledTableCell>
                            <StyledTableCell>
                              <ListItem
                                sx={{
                                  "&:hover": {
                                    cursor: "pointer",
                                    color: "blue",
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                <CopyToClipboard
                                  onCopy={() => {
                                    handleCopy("Copied Empcode!");
                                  }}
                                  options={{ message: "Copied Empcode!" }}
                                  text={row?.empcode}
                                >
                                  <ListItemText primary={row?.empcode} />
                                </CopyToClipboard>
                              </ListItem>
                            </StyledTableCell>
                            <StyledTableCell>
                              <ListItem
                                sx={{
                                  "&:hover": {
                                    cursor: "pointer",
                                    color: "blue",
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                <CopyToClipboard
                                  onCopy={() => {
                                    handleCopy("Copied Name!");
                                  }}
                                  options={{ message: "Copied Name!" }}
                                  text={row?.companyname}
                                >
                                  <ListItemText primary={row?.companyname} />
                                </CopyToClipboard>
                              </ListItem>
                            </StyledTableCell>
                            <StyledTableCell>{row.department}</StyledTableCell>
                            <StyledTableCell>
                              {moment(row.dob).format("DD-MM-YYYY")}
                            </StyledTableCell>
                            <StyledTableCell>
                              {row.contactpersonal}
                            </StyledTableCell>
                            <StyledTableCell>
                              {moment(row.doj).format("DD-MM-YYYY")}
                            </StyledTableCell>
                            <StyledTableCell>{row.experience}</StyledTableCell>
                            <StyledTableCell>
                              {moment(row.reasondate).format("DD-MM-YYYY")}
                            </StyledTableCell>
                            <StyledTableCell>{row.reportingto}</StyledTableCell>
                            <StyledTableCell>{row.reasonname}</StyledTableCell>
                            <StyledTableCell>
                              <Grid sx={{ display: "flex" }}>
                                <Link
                                  to={`/view/${row._id}/deactivateinternlist`}
                                  style={{
                                    textDecoration: "none",
                                    color: "#fff",
                                  }}
                                >
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    style={userStyle.actionbutton}
                                  >
                                    <VisibilityIcon
                                      style={{ fontSize: "20px" }}
                                    />
                                  </Button>
                                </Link>
                              </Grid>
                            </StyledTableCell>
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
                    </TableBody>
                  </Table>
                </TableContainer>
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
                {/* ) : ( */}
                {/* <>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> */}
                {/* )} */}
              </>
            )}
          </Box>
        </>
      )}
      <br />
      {/* ****** Table End ****** */}

      <Box>
        <Dialog
          open={isErrorOpen}
          // onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6"></Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Boarding Info</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
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
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
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
              fetchEmployeeArray();
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

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Mode</StyledTableCell>
              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Name </StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Dob</StyledTableCell>
              <StyledTableCell>Personal Number</StyledTableCell>
              <StyledTableCell>Doj</StyledTableCell>
              <StyledTableCell>Experience</StyledTableCell>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>Reporting To</StyledTableCell>
              <StyledTableCell>Reason</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.resonablestatus}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.dob}</StyledTableCell>
                  <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                  <StyledTableCell>{row.doj}</StyledTableCell>
                  <StyledTableCell>{row.experience}</StyledTableCell>
                  <StyledTableCell>{row.reasondate}</StyledTableCell>
                  <StyledTableCell>{row.reportingto}</StyledTableCell>
                  <StyledTableCell>{row.reasonname}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

    //    another table
  );
}

export default DeactivateInternlistView;