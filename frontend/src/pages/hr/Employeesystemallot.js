import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';

import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationContainer, NotificationManager, } from "react-notifications";
import 'react-notifications/lib/notifications.css';

function Employeeassetsystemallot() {

  const [employeesystemallotEdit, setEmployeeSystemAllotEdit] = useState({ department: "Please Select Department" });
  const [employeesystemallots, setEmployeeSystemAllots] = useState([]);
  const [modes, setSmodes] = useState("Active");
  const [empcount, setEmpcount] = useState("");
  const [wfhcount, setwfhcount] = useState("");
  const [wfhstatus, setwfhstatus] = useState("");

  const { isUserRoleCompare, isAssignBranch, allTeam } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [employeesystemCheck, setEmployeeSyetemcheck] = useState(true);

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Employee System Allot.png");
        });
      });
    }
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

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };


  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
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


  // Show all columns
  const [columnVisibility, setColumnVisibility] = useState({
    actions: true,
    serialNumber: true,
    empcode: true,
    companyname: true,
    department: true,
    branch: true,
    unit: true,
    team: true,
    designation: true,
    count: true,
    smode: true,
    mode: true,
  });

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  //process filter
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  const handleCompanyChange = (options) => {
    setSelectedOptionsCompany(options);
  };

  const handleBranchChange = (options) => {
    setSelectedOptionsBranch(options);
  };
  const handleUnitChange = (options) => {
    setSelectedOptionsUnit(options);
  };

  const handleTeamChange = (options) => {
    setSelectedOptionsTeam(options);
  };


  const filterUsers = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = res_vendor?.data?.users.filter((item) => {
        if (selectedOptionsTeam.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          let unitdatas = selectedOptionsUnit?.map((item) => item?.value);
          let teamdatas = selectedOptionsTeam?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            unitdatas?.includes(item.unit) &&
            teamdatas?.includes(item.team) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else if (selectedOptionsUnit.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          let unitdatas = selectedOptionsUnit?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            unitdatas?.includes(item.unit) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else if (selectedOptionsBranch.length > 0) {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);
          let branchdatas = selectedOptionsBranch?.map((item) => item?.value);
          return (
            compdatas?.includes(item.company) &&
            branchdatas?.includes(item.branch) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        } else {
          let compdatas = selectedOptionsCompany?.map((item) => item?.value);

          return (
            compdatas?.includes(item.company) &&
            (item.reasonablestatus === undefined || item.reasonablestatus == "")
          );
        }
      });
      setEmployeeSystemAllots(result);
      setEmployeeSyetemcheck(true);
    } catch (err) {
      setEmployeeSyetemcheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedOptionsCompany.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setEmployeeSyetemcheck(false);
      filterUsers();
    }
  }

  const handleClear = (e) => {
    e.preventDefault();
    setSelectedOptionsCompany([]);
    setSelectedOptionsBranch([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsTeam([]);
    setEmployeeSystemAllots([]);
  };


  //Project updateby edit page...
  let updateby = employeesystemallotEdit?.updatedby;
  let addedby = employeesystemallotEdit?.addedby;

  const [openIndex, setOpenIndex] = useState("");
  const EmployeeSyetemmodeFunc = (index, key, value) => {
    const updatedData = employeesystemallots?.map((row, i) => {
      if (row._id === index) {
        return { ...row, [key]: value };
      }
      return row;
    });

    setEmployeeSystemAllots(updatedData);
    setOpenIndex(index);
  };

  const EmployeeCodeFunc = (index, key, value) => {
    const updatedDatat = employeesystemallots?.map((row, i) => {
      if (row._id === index) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setEmployeeSystemAllots(updatedDatat);
    setOpenIndex(index);
  };

  const [openIndexwfh, setOpenIndexwfh] = useState("")

  const EmployeeCodeWfh = (index, key, value) => {
    const updatedDatat = employeesystemallots?.map((row, i) => {
      if (row._id === index) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setEmployeeSystemAllots(updatedDatat);
    setOpenIndexwfh(index);
  };

  const EmployeeSyetemwfhstatus = (index, key, value) => {
    const updatedDatat = employeesystemallots?.map((row, i) => {
      if (row._id === index) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setEmployeeSystemAllots(updatedDatat);
    setOpenIndexwfh(index);
  };

  const sendRequestIndex = async (index, count, id, loginUserStatus) => {
    const uerssyscount = loginUserStatus.filter((data, index) => {
      return data.macaddress != "none"
    })
    if (count === "undefined") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Count"}</p>
        </>
      );
      handleClickOpenerr();
    } if (Number(count) < uerssyscount?.length) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{`This User Already Login More Than The ${count} Kinldy Give Larger Value!`}</p>
        </>
      );
      handleClickOpenerr();
    } else if (count !== "undefined") {
      try {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          employeecount: String(count),
          systemmode: String(modes),
          wfhcount: String(wfhcount),
          wfhstatus: String(wfhstatus),
        });
        // NotificationManager.success('Successfully Updated 👍', '', 2000);
        // await fetchEmployeeSystem();
        // setEmpcount("");
        setOpenIndex("");
        setOpenIndexwfh("")
        setShowAlert(
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Updated Successfully 👍"} </p>
          </>
        );
        handleClickOpenerr();
      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
  };


  const [employeeSystemAllotsFilterArray, setEmployeeSystemAllotsFilterArray] = useState([])

  const fetchEmployeeSystemArray = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmployeeSystemAllotsFilterArray(res_vendor?.data?.users);
      setEmployeeSyetemcheck(true);
    } catch (err) { setEmployeeSyetemcheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // pdf.....
  const columns = [
    // { title: "Sno", field: "serialNumber" },
    { title: "Emp Code", field: "empcode" },
    { title: "Employee Name", field: "companyname" },
    { title: "Department", field: "department" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Designation", field: "designation" },
    { title: "WFH Count", field: "wfhcount" },
    { title: "Status", field: "wfhstatus" },
    { title: "Count", field: "employeecount" },
    // { title: "System Mode", field: "systemmode" },
    { title: "Mode", field: "systemmode" },
  ];

  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      items.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto"
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Employee System Allot.pdf");
  };


  // Excel
  const fileName = "Employee System Allot";

  const [employeesystemData, setEmployeeSystemData] = useState([]);

  // get particular columns for export excel
  const getexcelDatas = () => {
    var data = employeesystemallots?.map((t, index) => ({
      Sno: index + 1,
      "Emp Code": t.empcode,
      "Employee Name": t.companyname,
      Department: t.department,
      Branch: t.branch,
      Unit: t.unit,
      Team: t.team,
      Designation: t.designation,
      Count: t.employeecount,
      // "System Mode": t.systemmode,
      Mode: t.systemmode,
    }));
    setEmployeeSystemData(data);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Employee System Allot",
    pageStyle: "print",
  });

  useEffect(() => {
    getexcelDatas();
  }, [employeesystemallotEdit, employeesystemallots]);


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);


  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employeesystemallots?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      wfhcount: item.wfhcount && item.wfhcount !== "0" ? item.wfhcount : "0",
      wfhstatus: item.wfhstatus && item.wfhstatus !== "Yes" ? item.wfhstatus : "Yes",

    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employeesystemallots]);

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

  const totalPages = Math.ceil(employeesystemallots.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }



  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      department: item.department,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      designation: item.designation,
      count: item.employeecount,
      smode: item.systemmode,
      mode: item.systemmode,
      systemmode: item.systemmode,
      employeecount: item.employeecount,
      wfhcount: item.wfhcount,
      wfhstatus: item.wfhstatus,
      workstation: item.workstation,
      loginUserStatus: item.loginUserStatus

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


  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          "Sno": index + 1,
          Empcode: t.empcode,
          Employeename: t.companyname,
          Department: t.department,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Designation: t.designation,
          "WFH Count": t.wfhcount,
          "Status": t.wfhstatus,
          Count: t.employeecount,
          // smode: t.systemmode,
          mode: t.systemmode,
          // systemmode: t.systemmode,
          // employeecount: t.employeecount,
          // workstation: t.workstation,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items.map((t, index) => ({
          "Sno": index + 1,
          Empcode: t.empcode,
          Employeename: t.companyname,
          Department: t.department,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Designation: t.designation,
          "WFH Count": t.wfhcount,
          "Status": t.wfhstatus,
          Count: t.employeecount,
          // smode: t.systemmode,
          mode: t.systemmode,
          // systemmode: t.systemmode,
          // employeecount: t.employeecount,
          // workstation: t.workstation,

        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  return (
    <Box>
      <Headtitle title={"Employee System Allot Details"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Employee System Allot Details</Typography>

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lemployeesystemallotdetails") && (
        <>
          <Box sx={userStyle.container}>

            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                <b>Employee System Allot Details</b>
              </Typography>
              <NotificationContainer />
            </Grid>
            <br />

            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={isAssignBranch
                      ?.map((data) => ({
                        label: data.company,
                        value: data.company,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    value={selectedOptionsCompany}
                    onChange={(e) => {
                      handleCompanyChange(e);
                      setSelectedOptionsBranch([]);

                      setSelectedOptionsUnit([]);
                      setSelectedOptionsTeam([]);
                    }}
                    labelledBy="Please Select Company"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Branch</Typography>
                  <MultiSelect
                    options={isAssignBranch
                      ?.filter((comp) => {
                        let datas = selectedOptionsCompany?.map(
                          (item) => item?.value
                        );
                        return datas?.includes(comp.company);
                      })
                      ?.map((data) => ({
                        label: data.branch,
                        value: data.branch,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    value={selectedOptionsBranch}
                    onChange={(e) => {
                      handleBranchChange(e);
                      setSelectedOptionsTeam([]);
                      setSelectedOptionsUnit([]);
                    }}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Unit</Typography>
                  <MultiSelect
                    options={isAssignBranch
                      ?.filter((comp) => {
                        let compdatas = selectedOptionsCompany?.map(
                          (item) => item?.value
                        );
                        let branchdatas = selectedOptionsBranch?.map(
                          (item) => item?.value
                        );
                        return (
                          compdatas?.includes(comp.company) &&
                          branchdatas?.includes(comp.branch)
                        );
                      })
                      ?.map((data) => ({
                        label: data.unit,
                        value: data.unit,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    value={selectedOptionsUnit}
                    onChange={(e) => {
                      handleUnitChange(e);
                      setSelectedOptionsTeam([]);
                    }}
                    labelledBy="Please Select Unit"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Team</Typography>
                  <MultiSelect
                    options={allTeam
                      ?.filter((comp) => {
                        let compdatas = selectedOptionsCompany?.map(
                          (item) => item?.value
                        );
                        let branchdatas = selectedOptionsBranch?.map(
                          (item) => item?.value
                        );
                        let unitdatas = selectedOptionsUnit?.map(
                          (item) => item?.value
                        );
                        return (
                          compdatas?.includes(comp.company) &&
                          branchdatas?.includes(comp.branch) &&
                          unitdatas?.includes(comp.unit)
                        );
                      })
                      ?.map((data) => ({
                        label: data.teamname,
                        value: data.teamname,
                      }))
                      .filter((item, index, self) => {
                        return (
                          self.findIndex(
                            (i) =>
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    value={selectedOptionsTeam}
                    onChange={(e) => {
                      handleTeamChange(e);
                    }}
                    labelledBy="Please Select Team"
                  />
                </FormControl>
              </Grid>
              <Grid item md={1} xs={12} sm={12}>
                <Button variant="contained" onClick={handleSubmit}>
                  Filter
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Button onClick={handleClear} sx={userStyle.btncancel}>
                  Clear
                </Button>
              </Grid>
            </Grid>
            <br />
            {!employeesystemCheck ? (
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
                    {isUserRoleCompare?.includes("excelemployeesystemallotdetails") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchEmployeeSystemArray()
                          setFormat("xl")
                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvemployeesystemallotdetails") && (
                      <>
                        <Button onClick={(e) => {
                          setIsFilterOpen(true)
                          fetchEmployeeSystemArray()
                          setFormat("csv")
                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("printemployeesystemallotdetails") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfemployeesystemallotdetails") && (
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => {
                            setIsPdfFilterOpen(true)
                            fetchEmployeeSystemArray()
                          }}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageemployeesystemallotdetails") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
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
                      <MenuItem value={employeesystemallots.length}>All</MenuItem>
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

                {/* {isLoader ? ( */}
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
                            <Box>Emp Code</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("empcode")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("companyname")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Employee Name</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("companyname")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("department")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Department</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("department")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("branch")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Branch</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("branch")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("unit")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Unit</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("unit")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("team")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Team</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("team")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("designation")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Designation</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("designation")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("wfhcount")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>WFH Count</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("wfhcount")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("wfhstatus")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Status</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("wfhstatus")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("employeecount")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Count</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("employeecount")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("smode")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>System Mode</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("smode")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSorting("systemmode")}>
                          <Box sx={userStyle.tableheadstyle}>
                            <Box>Mode</Box>
                            <Box sx={{ marginTop: "-6PX" }}>{renderSortingIcon("systemmode")}</Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody align="left" ref={gridRef}>
                      {filteredData?.length > 0 ? (
                        filteredData?.map((row, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
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
                                    handleCopy("Copied Employee Name!");
                                  }}
                                  options={{ message: "Copied Employee Name!" }}
                                  text={row?.companyname}
                                >
                                  <ListItemText primary={row?.companyname} />
                                </CopyToClipboard>
                              </ListItem>
                            </StyledTableCell>
                            <StyledTableCell>{row.department}</StyledTableCell>
                            <StyledTableCell>{row.branch}</StyledTableCell>
                            <StyledTableCell>{row.unit}</StyledTableCell>
                            <StyledTableCell>{row.team}</StyledTableCell>
                            <StyledTableCell>{row.designation}</StyledTableCell>
                            <StyledTableCell>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    sx={userStyle.input}
                                    value={row.wfhcount}
                                    disabled={row.wfhstatus === "No"}
                                    onChange={(e) => {
                                      EmployeeCodeWfh(row._id, "wfhcount", e.target.value);
                                      // EmployeeCodeFunc(row._id, "employeecount", row.workstation.length > 0 ? (row.workstation.length < e.target.value ? "" : e.target.value) : e.target.value);
                                      // setEmpcount(row.workstation.length < e.target.value ? "" : e.target.value);
                                      setwfhcount(e.target.value);
                                      setwfhstatus(row?.wfhstatus);
                                      setSmodes(row.systemmode)

                                    }}
                                  />
                                </FormControl>
                              </Grid>{" "}</StyledTableCell>
                            <StyledTableCell> <Grid item md={3} xs={12} sm={12}>
                              <FormControl size="small" fullWidth>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 200,
                                        width: 80,
                                      },
                                    },
                                  }}
                                  value={row.wfhstatus}
                                  onChange={(e) => {
                                    EmployeeSyetemwfhstatus(row._id, "wfhstatus", e.target.value);
                                    setwfhstatus(e.target.value);
                                    setwfhcount(row.wfhcount);
                                    setSmodes(row.systemmode)


                                  }}
                                  // displayEmpty
                                  defaultValue="Yes" // Set the default value to "Active"
                                  inputProps={{ "aria-label": "Without label" }}
                                >
                                  <MenuItem value="Yes"> {"Yes"} </MenuItem>
                                  <MenuItem value="No"> {"No"} </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>{" "}</StyledTableCell>
                            <StyledTableCell>
                              <Grid item md={3} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="number"
                                    sx={userStyle.input}
                                    value={row.employeecount}
                                    onChange={(e) => {
                                      EmployeeCodeFunc(row._id, "employeecount", e.target.value);
                                      // EmployeeCodeFunc(row._id, "employeecount", row.workstation.length > 0 ? (row.workstation.length < e.target.value ? "" : e.target.value) : e.target.value);
                                      // setEmpcount(row.workstation.length < e.target.value ? "" : e.target.value);
                                      setEmpcount(e.target.value);
                                      setwfhcount(row.wfhcount);
                                      setwfhstatus(row?.wfhstatus);
                                      setSmodes(row.systemmode)
                                    }}
                                  />
                                </FormControl>
                              </Grid>{" "}</StyledTableCell>
                            <StyledTableCell> <Grid item md={3} xs={12} sm={12}>
                              <FormControl size="small" fullWidth>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  MenuProps={{
                                    PaperProps: {
                                      style: {
                                        maxHeight: 200,
                                        width: 80,
                                      },
                                    },
                                  }}
                                  value={row.systemmode}
                                  onChange={(e) => {
                                    EmployeeSyetemmodeFunc(row._id, "systemmode", e.target.value);
                                    setSmodes(e.target.value);
                                    setwfhcount(row.wfhcount);
                                    setwfhstatus(row?.wfhstatus);

                                  }}
                                  // displayEmpty
                                  defaultValue="Active" // Set the default value to "Active"
                                  inputProps={{ "aria-label": "Without label" }}
                                >
                                  <MenuItem value="In Active"> {"In Active"} </MenuItem>
                                  <MenuItem value="Active"> {"Active"} </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>{" "}</StyledTableCell>
                            <StyledTableCell>{row.systemmode}</StyledTableCell>
                            <StyledTableCell>
                              <Grid sx={{ display: "flex" }}>
                                {(isUserRoleCompare?.includes("eemployeesystemallotdetails") && (empcount != "" || modes) && openIndex === row._id) || openIndexwfh === row?._id ? (
                                  <Button variant="contained" sx={{ height: "34px" }} onClick={(e) => sendRequestIndex(row._id, row.employeecount, row._id, row.loginUserStatus)}>
                                    SAVE
                                  </Button>
                                ) : null}
                              </Grid></StyledTableCell>

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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      // maxWidth="lg"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Employee System Allot Details</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{employeesystemallotEdit.department}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
              onClick={() => {
                // sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>


      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
            <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/*Export XL Data  */}
      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

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

          {fileFormat === 'xl' ?
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
            : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
              fetchEmployeeSystemArray()
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>WFH Count</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Count</StyledTableCell>
              <StyledTableCell>Mode</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell>{row.companyname} </StyledTableCell>
                  <StyledTableCell>{row.department} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell>{row.unit} </StyledTableCell>
                  <StyledTableCell> {row.team}</StyledTableCell>
                  <StyledTableCell> {row.designation}</StyledTableCell>
                  <StyledTableCell> {row.wfhcount}</StyledTableCell>
                  <StyledTableCell> {row.wfhstatus}</StyledTableCell>
                  <StyledTableCell> {row.employeecount}</StyledTableCell>
                  <StyledTableCell> {row.systemmode}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Employeeassetsystemallot;