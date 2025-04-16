import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
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
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { repeatTypeOption } from "../../../components/Componentkeyword";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { saveAs } from "file-saver";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import PageHeading from "../../../components/PageHeading";

function ScheduleMeetingFilter() {
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
        rowDataTable.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Team: t.team,
          Department: t.department,
          Title: t.title,
          "Meeting Type": t.meetingtype,
          "Meeting Category": t.meetingcategory,
          Date: t.date,
          Time: t.time,
          Duration: t.duration,
          "Time Zone": t.timezone,
          Participants: t.participants,
          "Meeting Host": t.interviewer,
          Reminder: t.reminder,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Team: t.team,
          Department: t.department,
          Title: t.title,
          "Meeting Type": t.meetingtype,
          "Meeting Category": t.meetingcategory,
          Date: t.date,
          Time: t.time,
          Duration: t.duration,
          "Time Zone": t.timezone,
          Participants: t.participants,
          "Meeting Host": t.interviewer,
          Reminder: t.reminder,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Company ", field: "company" },
    { title: "Branch ", field: "branch" },
    { title: "Team ", field: "team" },
    { title: "Department ", field: "department" },
    { title: "Title ", field: "title" },
    { title: "Meeting Type ", field: "meetingtype" },
    { title: "Meeting Category ", field: "meetingcategory" },
    { title: "Date ", field: "date" },
    { title: "Time ", field: "time" },
    { title: "Duration ", field: "duration" },
    { title: "Time Zone", field: "timezone" },
    { title: "Participants", field: "participants" },
    { title: "Meeting Host", field: "interviewer" },
    { title: "Reminder", field: "reminder" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            team: t.team,
            department: t.department,
            title: t.title,
            meetingtype: t.meetingtype,
            meetingcategory: t.meetingcategory,
            date: t.date,
            time: t.time,
            duration: t.duration,
            timezone: t.timezone,
            participants: t.participants,
            interviewer: t.interviewer,
            reminder: t.reminder,
          }))
        : items?.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            team: t.team,
            department: t.department,
            title: t.title,
            meetingtype: t.meetingtype,
            meetingcategory: t.meetingcategory,
            date: t.date,
            time: t.time,
            duration: t.duration,
            timezone: t.timezone,
            participants: t.participants,
            interviewer: t.interviewer,
            reminder: t.reminder,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("ScheduleMeetingFilter.pdf");
  };

  const gridRef = useRef(null);
  //useStates
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  localStorage.setItem("selectedFilter", "Today");

  //state to handle meeting values
  const [meetingState, setMeetingState] = useState({
    branch: "Please Select Branch",
    department: "Please Select Department",
    team: "Please Select Team",
    meetingcategory: "Please Select Meeting Category",
    meetingtype: "Please Select Meeting Type",
    venue: "Please Select Venue",
    link: "",
    title: "",
    date: "",
    time: "",
    duration: "00:00",
    timezone: "Please Select Time Zone",
    reminder: "Please Select Reminder",
    recuringmeeting: false,
    repeattype: "Today",
    repeatevery: "00 days",
  });
  //state to handle edit meeting values
  const [meetingArray, setMeetingArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess , pageName, setPageName,} = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [meetingCheck, setMeetingCheck] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [meetingData, setMeetingData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    branchvenue: true,
    floorvenue: true,
    team: true,
    department: true,
    title: true,
    meetingtype: true,
    meetingcategory: true,
    date: true,
    time: true,
    duration: true,
    timezone: true,
    participants: true,
    interviewer: true,
    reminder: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [meetingArray]);
  useEffect(() => {
    getexcelDatas();
  }, [meetingArray]);

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
    setMeetingCheck(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  //get all data.
  const fetchMeetingfilter = async () => {
    setPageName(!pageName);
    setMeetingCheck(true);
    try {
      let res_employee = await axios.post(SERVICE.SCHEDULEMEETINGFILTERFPAGE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        role: isUserRoleAccess.role,
        companyname: isUserRoleAccess.companyname,
        selectedfilter: meetingState.repeattype,
      });

      const { company, branch, department, team, companyname, _id, username } =
        isUserRoleAccess;

      const result = res_employee?.data?.filteredschedulemeeting?.filter(
        (data) => {
          const participantsIncludesAll = data?.participants?.includes("ALL");
          const interviewerIncludesAll = data?.interviewer?.includes("ALL");

          if (participantsIncludesAll || interviewerIncludesAll) {
            const companyMatch =
              data?.company?.includes(company) ||
              data?.hostcompany?.includes(company);
            const branchMatch =
              data?.branch?.includes(branch) ||
              data?.hostbranch?.includes(branch);
            const departmentMatch =
              data?.department?.includes(department) ||
              data?.hostdepartment?.includes(department);
            const teamMatch =
              data?.team?.includes(team) || data?.hostteam?.includes(team);
            const participantsOrInterviewerIncludes =
              data?.participants?.includes(companyname) ||
              data?.interviewer?.includes(companyname);

            if (
              (companyMatch &&
                branchMatch &&
                departmentMatch &&
                teamMatch &&
                (participantsIncludesAll ||
                  participantsOrInterviewerIncludes)) ||
              interviewerIncludesAll ||
              participantsOrInterviewerIncludes ||
              data?.addedby?.some((item) => item?.name === username)
            ) {
              return true;
            }
          }

          return (
            data?.participantsid?.includes(_id) ||
            data?.participants?.includes(companyname) ||
            data?.meetinghostid?.includes(_id) ||
            data?.interviewer?.includes(companyname) ||
            data?.interviewscheduledby === _id ||
            data?.addedby?.some((item) => item?.name === username)
          );
        }
      );

      const resdata = isUserRoleAccess.role.includes("Manager")
        ? res_employee?.data?.filteredschedulemeeting
        : result;

      setMeetingCheck(false);
      setMeetingArray(resdata);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchMeetingfilter();
  }, []);

  const handleFilterClick = () => {
    fetchMeetingfilter();
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ScheduleMeetingFilter.png");
        });
      });
    }
  };

  // Excel
  const fileName = "ScheduleMeetingFilter";
  // get particular columns for export excel
  const getexcelDatas = () => {
    setPageName(!pageName);
    try {
      var data = meetingArray.map((t, index) => ({
        Sno: index + 1,
        Title: t.title,
        "Meeting Type": t.meetingtype,
        "Meeting Category": t.meetingcategory,
        Date: t.date,
        Time: t.time,
        Duration: t.duration,
        "Time Zone": t.timezone,
        Participants: t.participants.join(","),
        Reminder: t.reminder,
      }));
      setMeetingData(data);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Schedule Meeting Filter",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = meetingArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      branchvenue: item.branchvenue
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
      floorvenue: item.floorvenue
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
      team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      department: item.department
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
      date: moment(item.date).format("DD-MM-YYYY"),
      participants: item.participants
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
      interviewer: item.interviewer
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
    }));
    setItems(itemsWithSerialNumber);
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
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
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
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: { fontWeight: "bold" },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.uniqueid);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.uniqueid)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.uniqueid)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.uniqueid
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.uniqueid];
            }
            setSelectedRows(updatedSelectedRows);
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
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
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 150,
      hide: !columnVisibility.team,
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
      field: "title",
      headerName: "Title",
      flex: 0,
      width: 100,
      hide: !columnVisibility.title,
      headerClassName: "bold-header",
    },
    {
      field: "meetingtype",
      headerName: "Meeting Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.meetingtype,
      headerClassName: "bold-header",
    },
    {
      field: "meetingcategory",
      headerName: "Meeting Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.meetingcategory,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0,
      width: 100,
      hide: !columnVisibility.duration,
      headerClassName: "bold-header",
    },
    {
      field: "timezone",
      headerName: "Time Zone",
      flex: 0,
      width: 200,
      hide: !columnVisibility.timezone,
      headerClassName: "bold-header",
    },
    {
      field: "participants",
      headerName: "Participants",
      flex: 0,
      width: 150,
      hide: !columnVisibility.participants,
      headerClassName: "bold-header",
    },
    {
      field: "interviewer",
      headerName: "Meeting Host",
      flex: 0,
      width: 150,
      hide: !columnVisibility.interviewer,
      headerClassName: "bold-header",
    },
    {
      field: "reminder",
      headerName: "Reminder",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reminder,
      headerClassName: "bold-header",
    },
  ];
  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,

      company: item.company,
      branch: item.branch,
      branchvenue: item.branchvenue,
      floorvenue: item.floorvenue,
      team: item.team,
      department: item.department,
      date: item.date,
      participants: item.participants,
      interviewer: item.interviewer,
      title: item.title,
      meetingtype: item.meetingtype,
      meetingcategory: item.meetingcategory,
      time: item.time,
      duration: item.duration,
      timezone: item.timezone,

      reminder: item.reminder,
      recuringmeeting: item.recuringmeeting,
    };
  });
  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
    ...row,
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
              Hide All{" "}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  return (
    <Box>
      <Headtitle title={"SCHEDULE MEETING FILTER"} />
      <PageHeading
        title="Schedule Meeting Filter"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Meeting"
        subpagename="Schedule Meeting Filter"
        subsubpagename=""
      />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lschedulemeetingfilter") && (
        <>
          <>
            <Box sx={userStyle.container}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Schedule Meeting Filter
                </Typography>
              </Grid>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <label>Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 180, width: 80 } },
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
                      {/* <MenuItem value={meetingArray?.length}>All</MenuItem> */}
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
                    {isUserRoleCompare?.includes(
                      "excelschedulemeetingfilter"
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
                      "csvschedulemeetingfilter"
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
                      "printschedulemeetingfilter"
                    ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp; <FaPrint /> &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes(
                      "pdfschedulemeetingfilter"
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
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  </Box>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
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
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleShowAllColumns}
                    >
                      Show All Columns
                    </Button>
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleOpenManageColumns}
                    >
                      Manage Columns
                    </Button>
                  </Box>
                </Grid>
                <Grid item md={2.5} xs={12} sm={12}>
                  {/* <Typography>Repeat Type<b style={{ color: "red" }}>*</b></Typography> */}
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={300}
                      options={repeatTypeOption}
                      styles={colourStyles}
                      placeholder="Repeat Type"
                      value={repeatTypeOption.find(
                        (option) => option.value === meetingState.repeattype
                      )}
                      onChange={(e) => {
                        setMeetingState({
                          ...meetingState,
                          repeattype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                &ensp;
                <Grid item md={3} xs={12} sm={12}>
                  <Button variant="contained" onClick={handleFilterClick}>
                    Filter
                  </Button>
                </Grid>
              </Grid>

              <br />
              <br />
              {meetingCheck ? (
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
                <Box style={{ width: "100%", overflowY: "hidden" }}>
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
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
                </Box>
              )}
              <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing{" "}
                  {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                  {filteredDatas?.length} entries
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
            </Box>
          </>
        </>
      )}
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
              <TableCell>Title</TableCell>
              <TableCell>Meeting Type</TableCell>
              <TableCell>Meeting Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Time Zone</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Reminder</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.meetingtype}</TableCell>
                  <TableCell>{row.meetingcategory}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.timezone}</TableCell>
                  <TableCell>{row.participants}</TableCell>
                  <TableCell>{row.reminder}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
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
  );
}
export default ScheduleMeetingFilter;