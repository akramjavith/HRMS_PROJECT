import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, Select, ListItem, ListItemText, TextField, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody, List, TextareaAutosize } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
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
import Selects from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
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

function Noticeperiodactionemployeelist() {
  const [employees, setEmployees] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [replaceName, setReplaceName] = useState("Please Choose Replace name");

  const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth, setAuth } = useContext(AuthContext);
  const [getrowid, setRowGetid] = useState([]);

  const [empaddform, setEmpaddform] = useState({});

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  // const [selectedbranch, setselectedbranch] = useState([]);
  const [exceldata, setexceldata] = useState([]);

  const [isBoarding, setIsBoarding] = useState(false);

  let username = isUserRoleAccess.name;
  // const id = useParams().id

  //    popup for releaving
  const [openviewReleave, setOpenviewReleave] = useState(false);
  const handleClickOpenviewReleave = () => {
    setOpenviewReleave(true);
    handleCloseManageColumns();
  };

  const handleCloseviewReleave = () => {
    setOpenviewReleave(false);
  };

  //    popup for Absconded
  const [openviewAbsconded, setOpenviewAbsconded] = useState(false);
  const handleClickOpenviewAbsconded = () => {
    setOpenviewAbsconded(true);
    handleCloseManageColumns();
  };

  const handleCloseviewAbsconded = () => {
    setOpenviewAbsconded(false);
  };

  //    popup for Hold
  const [openviewHold, setOpenviewHold] = useState(false);
  const handleClickOpenviewHold = () => {
    setOpenviewHold(true);
    handleCloseManageColumns();
  };
  const handleCloseviewHold = () => {
    setOpenviewHold(false);
  };

  //    popup for Terminate
  const [openviewTerminate, setOpenviewTerminate] = useState(false);
  const handleClickOpenviewTerminate = () => {
    setOpenviewTerminate(true);
    handleCloseManageColumns();
  };

  const handleCloseviewTerminate = () => {
    setOpenviewTerminate(false);
  };

  const [getId, setGetId] = useState("");

  // popover content
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenManageColumns = (event, idval) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
    setGetId(idval);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Show all columns
  const [columnVisibility, setColumnVisibility] = useState({
    actions: true,
    serialNumber: true,
    empcode: true,
    name: true,
    department: true,
    dateofbirth: true,
    personalnumber: true,
    dateofjoining: true,
    experience: true,
    reportingto: true,
  });

  const [reasonaction, setReasonaction] = useState("");

  const [openview, setOpenview] = useState(false);
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const [reason, setReason] = useState({ date: formattedDate, reasonname: "" });

  const reasonReleave = [
    {
      date: reason.date,
      reasonname: reason.reasonname,
      empcode: empaddform.empcode,
      companyname: empaddform.companyname,
      quickreason: reasonaction,
    },
  ];

  let bor = empaddform._id;

  const [statusemployee, setstatusemployee] = useState("");
  //add function
  const sendRequestReason = async () => {
    try {
      let projectscreate = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${bor}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        resonablestatus: statusemployee,
        reasondate: reason.date,
        reasonname: reason.reasonname,
      });
      setReason(projectscreate.data);
      setReason({ date: formattedDate, reasonname: "" });
      await fetchEmployee();
      handleCloseview();
      handleCloseviewReleave();
      await hierarchyCheckDelete(empaddform.companyname, statusemployee);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving
  const handleSubmitReason = (e) => {
    e.preventDefault();
    if (replaceName === "Please Choose Replace name" && hierarchyDeleteData.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{`${empaddform.companyname} was linked in Hierarchy Super Visor.Please Choose Replacement Name`}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestReason();
    }
  };

  //cancel for reason section
  const handleClearreason = () => {
    setReason({ date: formattedDate, reasonname: "" });
  };

  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEmpaddform(res?.data?.suser);
      setstatusemployee(name);
      handleClickOpenviewReleave();
      await hierarchyCheck(res?.data?.suser?.companyname);fetchEmployeeList(res?.data?.suser?.companyname);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const [hierarchyDeleteData, setHierarchyDeleteData] = useState([]);
  const [hierarchyDeleteEmployee, setHierarchyDeleteEmployee] = useState([]);

  //getting the datas while clicking options
  const hierarchyCheck = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.HIRERARCHI}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer = res?.data?.hirerarchi.filter((data) => data.supervisorchoose.includes(e));
      let answerEmployeename = res?.data?.hirerarchi.filter((data) => data.employeename.includes(e));
      setHierarchyDeleteData(answer);
      setHierarchyDeleteEmployee(answerEmployeename);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //while clicking save it happens
  const hierarchyCheckDelete = async (e, status) => {
    try {
      if (status !== "Hold") {
        //Updating The SuperVisor based onn the supervisor array length
        let DeleteSuperVisor =
          hierarchyDeleteData.length > 0 &&
          hierarchyDeleteData.map((data, i) => {
            const checkSame = data.employeename.includes(replaceName);
            const checkSamesup = data.supervisorchoose.includes(replaceName);

            //if the supervisor array contains more than one element without the orginal releiveing name
            if (data.supervisorchoose.length > 1 && !checkSame && !checkSamesup) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);

              const ans = [...supervisorCheck, replaceName];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: ans,
              });
            } else if (data.supervisorchoose.length > 1 && checkSame && !checkSamesup) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);

              const ans = [...supervisorCheck];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: ans,
              });
            } else if (data.supervisorchoose.length > 1 && !checkSame && checkSamesup) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);

              const ans = [...supervisorCheck];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: ans,
              });
            } else if (data.supervisorchoose.length > 1 && checkSame && checkSamesup) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);

              const ans = [...supervisorCheck];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: ans,
              });
            }
            //if the supervisor array contains only the orginal releiveing name
            else if (!checkSame && data.supervisorchoose.length == 1) {
              const superVisor = data.supervisorchoose;
              const supervisorCheck = superVisor.filter((item) => item !== e);
              const ans = [...supervisorCheck];
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                supervisorchoose: replaceName,
              });
            } else if (checkSame && data.supervisorchoose.length == 1) {
              let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            }
          });

        //Updating The EmployeeName based onn the Employeename array length
        let DeleteemployeeName =
          hierarchyDeleteEmployee.length > 0 &&
          hierarchyDeleteEmployee.map((data) => {
            //if the employeename array contains more than one element without the orginal releiveing name
            if (data.employeename.length > 1) {
              const superVisor = data.employeename;
              const supervisorCheck = superVisor.filter((item) => item !== e);
              const response = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                employeename: supervisorCheck,
              });
            } else {
              let res = axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            }
          });
      }

      setReplaceName("Please Choose Replace name");
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
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

  //get all employees list details
  const fetchEmployeeList = async (e) => {
    try {
      let res_employee = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let Designation = res_employee?.data?.users.find((item) => {
        return e === item.companyname;
      });

      let answer = res_employee?.data?.users.filter((data) => data.companyname !== e && Designation.designation === data.designation && (data.resonablestatus === "" || data.resonablestatus === undefined));
      setEmployeesList(
        answer.map((data) => ({
          ...data,
          label: data.companyname,
          value: data.companyname,
        }))
      );
    } catch (err) {setIsBoarding(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchEmployee = async () => {
    try {
      let res = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // Filter the data based on multiple conditions
      let ans = res.data.users.filter((data) => {
        const status = data.resonablestatus;
        return status !== "Releave Employee" && status !== "Absconded" && status !== "Hold" && status !== "Terminate";
      });

      setEmployees(ans);
      setIsBoarding(true);
    } catch (err) {setIsBoarding(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //id for login...;
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
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
    { title: "Sno", field: "serialNumber" },
    { title: "Empcode", field: "empcode" },
    { title: "Name", field: "companyname" },
    { title: "Department", field: "department" },
    { title: "Dob", field: "dob" },
    { title: "PersonalNo", field: "contactpersonal" },
    { title: "DOJ", field: "doj" },
    { title: "Experience", field: "experience" },
    { title: "Reportingto", field: "reportingto" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: items,
    });
    doc.save("Quick_Action_Employeelist.pdf");
  };

  // Excel
  const fileName = "Quick_Action_Employeelist";
  let excelno = 1;

  // get particular columns for export excel
  const getexcelDatas = async () => {
      var data = employees.map((t, index) => ({
        Sno: index++,
        Empcode: t.empcode,
        Name: t.companyname,
        Department: t.department,
        DateOfBirth: t.dob,
        PersonalNumber: t.contactpersonal,
        Doj: t.doj,
        Experience: t.experience,
        ReportingTo: t.reportingto,
      }));
      setexceldata(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Quick_Action_Employeelist",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchEmployee();

    // fetchEmployeeAll();
  }, []);

  useEffect(() => {
    getexcelDatas();
  }, [employees]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
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
              <ArrowDropUpOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon style={{ color: "#bbb6b6", fontSize: "1.6rem" }} />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon style={{ color: "black", fontSize: "1.6rem" }} />
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
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(employees.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  // Table start colum and row
  // Define columns for the DataGrid
  const columnDataTable = [
    { field: "serialNumber", headerName: "SNo", flex: 0, width: 100, hide: !columnVisibility.serialNumber },
    { field: "empcode", headerName: "Empcode", flex: 0, width: 150, hide: !columnVisibility.empcode },
    { field: "name", headerName: "Name", flex: 0, width: 150, hide: !columnVisibility.companyname },
    { field: "department", headerName: "Department", flex: 0, width: 100, hide: !columnVisibility.department },
    { field: "dob", headerName: "DOB", flex: 0, width: 100, hide: !columnVisibility.dob },
    { field: "contactpersonal", headerName: "Personal Number", flex: 0, width: 150, hide: !columnVisibility.contactpersonal },
    { field: "doj", headerName: "DOJ", flex: 0, width: 100, hide: !columnVisibility.doj },
    { field: "experience", headerName: "Experience", flex: 0, width: 100, hide: !columnVisibility.experience },
    { field: "reportingto", headerName: "Reporting to", flex: 0, width: 250, hide: !columnVisibility.reportingto },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((notice, index) => {
    return {
      id: notice._id,
      serialNumber: notice.serialNumber,
      empcode: notice.empcode,
      name: notice.companyname,
      department: notice.department,
      dob: notice.dob,
      contactpersonal: notice.contactpersonal,
      doj: notice.doj,
      experience: notice.experience,
      reportingto: notice.reportingto,
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
      return `${visibleRows > 0 ? visibleRows * rowHeight + extraSpace : scrollbarWidth + extraSpace}px`;
    }
  };

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Quick Action Employee List</Typography>
      <br />
      {isUserRoleCompare?.includes("lnoticeperiodactionemployeelist") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Quick Action Employeelist</Typography>
              </Grid>
            </Grid>
            {!isBoarding ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <br />
                <br />

                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes("csvnoticeperiodactionemployeelist") && (
                      <>
                        <ExportCSV csvData={exceldata} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("excelnoticeperiodactionemployeelist") && (
                      <>
                        <ExportXL csvData={exceldata} fileName={fileName} />
                      </>
                    )}
                    {isUserRoleCompare?.includes("printnoticeperiodactionemployeelist") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfnoticeperiodactionemployeelist") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>
                <br />
                {/* added to the pagination grid */}
                <Grid style={userStyle.dataTablestyle}>
                  <Box>
                    <label htmlFor="pageSizeSelect">Show entries:</label>
                    <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
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
                      <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
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

                {/* <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button> */}
                {/* {isLoader ? ( */}
                {/* ****** Table start ****** */}
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                    <TableHead sx={{ fontWeight: "600" }}>
                      <StyledTableRow>
                        <StyledTableCell onClick={() => handleSorting("serialNumber")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>SNo</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("serialNumber")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("empcode")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Empcode</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("empcode")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("companyname")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Name</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("companyname")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("department")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Department</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("department")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("dob")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>DOB</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("dob")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("contactpersonal")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Personal Number</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("contactpersonal")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("doj")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>DOJ</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("doj")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("experience")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Experience</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("experience")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("reportingto")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Reporting To</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("reportingto")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                      {filteredData?.length > 0 ? (
                        filteredData?.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                            <StyledTableCell>{row.empcode}</StyledTableCell>
                            <StyledTableCell>{row.companyname}</StyledTableCell>
                            <StyledTableCell>{row.department}</StyledTableCell>
                            <StyledTableCell>{row.dob}</StyledTableCell>
                            <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                            <StyledTableCell>{row.doj}</StyledTableCell>
                            <StyledTableCell>{row.experience}</StyledTableCell>
                            <StyledTableCell>{row.reportingto}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" colSpan={1}>
                              <Grid sx={{ display: "flex" }}>
                                <Button
                                  sx={userStyle.buttonedit}
                                  onClick={(e) => {
                                    handleOpenManageColumns(e, row._id);
                                  }}
                                >
                                  <MoreVertIcon />
                                </Button>

                                <Popover id={id} open={isManageColumnsOpen} anchorEl={anchorEl} onClose={handleCloseManageColumns}>
                                  <Box>
                                    <List component="nav" aria-label="My List">
                                      <ListItem button>
                                        <ListItemText
                                          onClick={(e) => {
                                            getCode(getId, "Releave Employee");
                                          }}
                                          primary="Releave Employee"
                                        />
                                      </ListItem>
                                      <ListItem button>
                                        <ListItemText
                                          onClick={(e) => {
                                            getCode(getId, "Absconded");
                                          }}
                                          primary="Absconded"
                                        />
                                      </ListItem>
                                      <ListItem button>
                                        <ListItemText
                                          onClick={(e) => {
                                            getCode(getId, "Hold");
                                          }}
                                          primary="Hold"
                                        />
                                      </ListItem>
                                      <ListItem button>
                                        <ListItemText
                                          onClick={() => {
                                            getCode(getId, "Terminate");
                                          }}
                                          primary="Terminate"
                                        />
                                      </ListItem>
                                    </List>
                                  </Box>
                                </Popover>
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
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
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
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                          <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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

      {/* this is the alert for the popover ation button in Reason Employee */}
      <Dialog open={openviewReleave} onClose={handleClickOpenviewReleave} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
        <Box sx={{ width: "750px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Action employee list</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Reason Apply</b>
                  </Typography>
                  <Typography>{statusemployee}</Typography>
                </FormControl>
              </Grid>
              {hierarchyDeleteData.length > 0 ? (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={userStyle.SubHeaderText}>
                        <b>Replace</b>
                        <b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={employeesList}
                        styles={colourStyles}
                        value={{ label: replaceName, value: replaceName }}
                        onChange={(e) => {
                          setReplaceName(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Employee code</b>
                  </Typography>
                  <Typography>{empaddform.empcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}></Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={userStyle.SubHeaderText}>
                    <b>Employee Name</b>
                  </Typography>
                  <Typography>{empaddform.companyname}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={1} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Date</b>{" "}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    // value={formattedDate}
                    value={reason.date}
                    onChange={(e) => {
                      setReason({ ...reason, date: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={2} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Reason</b>{" "}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    value={reason.reasonname}
                    onChange={(e) => {
                      setReason({ ...reason, reasonname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleSubmitReason}>
                  Save
                </Button>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleClearreason}>
                  {" "}
                  Clear
                </Button>
              </Grid>
              <Grid item md={0.2} xs={12} sm={12}></Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleCloseviewReleave}>
                  {" "}
                  Close
                </Button>
              </Grid>
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
              <StyledTableCell>Empcode</StyledTableCell>
              <StyledTableCell>Name </StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Dob</StyledTableCell>
              <StyledTableCell>Personal Number</StyledTableCell>
              <StyledTableCell>Doj</StyledTableCell>
              <StyledTableCell>Experience</StyledTableCell>
              <StyledTableCell>Reporting To</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {employees &&
              employees.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.dob}</StyledTableCell>
                  <StyledTableCell>{row.contactpersonal}</StyledTableCell>
                  <StyledTableCell>{row.doj}</StyledTableCell>
                  <StyledTableCell>{row.experience}</StyledTableCell>
                  <StyledTableCell>{row.reportingto}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

    //    another table
  );
}

export default Noticeperiodactionemployeelist;
