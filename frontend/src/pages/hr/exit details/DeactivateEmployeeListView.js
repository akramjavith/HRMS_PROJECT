import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  ListItemText,
  ListItem,
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
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
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
import { handleApiError } from "../../../components/Errorhandling";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import Headtitle from "../../../components/Headtitle";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";

import CloseIcon from "@mui/icons-material/Close";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import InfoIcon from "@mui/icons-material/Info";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // For Releave Employee
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"; // For Absconded
import PauseIcon from "@mui/icons-material/Pause"; // For Hold
import BlockIcon from "@mui/icons-material/Block"; // For Terminate

function DeactivateemployeeslistView() {
  const [employees, setEmployees] = useState([]);
  const { isUserRoleAccess, isUserRoleCompare } = useContext(
    UserRoleAccessContext
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);
  const [getrowid, setRowGetid] = useState([]);

  const [empaddform, setEmpaddform] = useState({});

  const [isBoarding, setIsBoarding] = useState(false);

  let username = isUserRoleAccess.name;

  // popover content
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
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
        color = "#ff9800"; // light orange
        break;
      case "Terminate":
        icon = <BlockIcon {...iconProps} />;
        color = "#f44336"; // Red
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

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const fetchEmployee = async () => {
    try {
      let res = await axios.get(SERVICE.USER_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // Filter the data based on multiple conditions
      let ans = res.data.usersstatus.filter((data) => {
        const status = data.resonablestatus;
        return (
          (status === "Releave Employee" ||
            status === "Absconded" ||
            status === "Hold" ||
            status === "Terminate") &&
          data.workmode != "Internship"
        );
      });

      setEmployees(ans);
      setIsBoarding(true);
    } catch (err) {setIsBoarding(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

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

  const gridRef = useRef(null);
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Deactivate Intern List View.png");
        });
      });
    }
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        Mode: item.resonablestatus || "",
        Empcode: item.empcode || "",
        Name: item.companyname || "",
        Department: item.department || "",
        DOB: item.dob || "",
        PersonalNo: item.contactpersonal || "",
        DOJ: item.doj || "",
        Experience: item.experience || "",
        "End Date": item.reasondate || "",
        Reportingto: item.reportingto || "",
        Reason: item.reasonname || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Deactivate Employee View");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "Mode", field: "resonablestatus" },
    { title: "Empcode", field: "empcode" },
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

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
            ...t,
            serialNumber: index + 1,
          }))
        : items?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Deactivate Employee View.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Deactivate Employee View",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      dob: item?.dob ? moment(item.dob, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
      doj: item?.doj ? moment(item.doj, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
      reasondate: item?.reasondate
        ? moment(item.reasondate, "YYYY-MM-DD").format("DD-MM-YYYY")
        : "",
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

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"DEACTIVE EMPLOYEE LIST VIEW"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Deactivate Employees List View
      </Typography>
      <br />
      {isUserRoleCompare?.includes("ldeactivateemployeeslistview") && (
        <>
          <Box sx={userStyle.container}>
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
                      "csvdeactivateemployeeslistview"
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
                      "exceldeactivateemployeeslistview"
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
                      "printdeactivateemployeeslistview"
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
                      "pdfdeactivateemployeeslistview"
                    ) && (
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
                      "imagedeactivateemployeeslistview"
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
                      <MenuItem value={employees.length}>All</MenuItem>
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
                <TableContainer component={Paper} ref={gridRef}>
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
                              {row.dob
                                ? moment(row.dob, "YYYY-MM-DD").format(
                                    "DD-MM-YYYY"
                                  )
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell>
                              {row.contactpersonal}
                            </StyledTableCell>
                            <StyledTableCell>
                              {row.doj
                                ? moment(row.doj, "YYYY-MM-DD").format(
                                    "DD-MM-YYYY"
                                  )
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell>{row.experience}</StyledTableCell>
                            <StyledTableCell>
                              {row.reasondate
                                ? moment(row.reasondate, "YYYY-MM-DD").format(
                                    "DD-MM-YYYY"
                                  )
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell>{row.reportingto}</StyledTableCell>

                            <StyledTableCell>{row.reasonname}</StyledTableCell>
                            <StyledTableCell>
                              <Grid sx={{ display: "flex" }}>
                                <Link
                                  to={`/view/${row._id}/deactivateemployeelist`}
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
            {filteredData &&
              filteredData.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.resonablestatus}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>
                    {row.dob
                      ? moment(row.dob, "YYYY-MM-DD").format("DD-MM-YYYY")
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                  <StyledTableCell>
                    {row.doj
                      ? moment(row.doj, "YYYY-MM-DD").format("DD-MM-YYYY")
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>{row.experience}</StyledTableCell>
                  <StyledTableCell>
                    {row.reasondate
                      ? moment(row.reasondate, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        )
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>{row.reportingto}</StyledTableCell>
                  <StyledTableCell>{row.reasonname}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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
            position: "relative",
          }}
        >
          {fileFormat === "xl" ? (
            <>
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

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
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

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
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
            position: "relative",
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
    </Box>

    //    another table
  );
}

export default DeactivateemployeeslistView;