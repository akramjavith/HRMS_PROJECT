import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton, TextareaAutosize, FormControlLabel } from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AuthContext } from "../../../../context/Appcontext";
import { handleApiError } from "../../../../components/Errorhandling";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import StyledDataGrid from "../../../../components/TableStyle";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { saveAs } from "file-saver";
import Pagination from '../../../../components/Pagination';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({ loading, message }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
      <div style={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#edf1f7' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};

function DepartmentMonthSet() {

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');

  let today = new Date();
  var yyyy = today.getFullYear();
  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [statusCheck, setStatusCheck] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");

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

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    department: true,
    year: true,
    month: true,
    fromdate: true,
    todate: true,
    totaldays: true,
    salary: true,
    proftaxstop: true,
    penalty: true,
    esistop: true,
    pfstop: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // department month set
  const [departmentset, setDepartmentSet] = useState({ department: "Select Department", year: "", month: "", fromdate: "", todate: "", totaldays: null, salary: false, proftaxstop: false, penalty: false, esistop: false, pfstop: false });
  const [singleDepMonth, setSingleMonthSet] = useState({});
  const [departmentNames, setDeparmentNames] = useState([]);
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectmonthname, setSelectMonthName] = useState("Select Month");
  const [selectedDate, setSelectedDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalDays, setTotalDays] = useState(null);
  const [alldepartmentSet, setAllDepartmentSet] = useState([]);

  // edit states
  const [selectedYearEdit, setSelectedYearEdit] = useState("");
  const [selectedMonthEdit, setSelectedMonthEdit] = useState("");
  const [selectmonthnameEdit, setSelectMonthNameEdit] = useState("");
  const [selectedDateEdit, setSelectedDateEdit] = useState("");
  const [toDateEdit, setToDateEdit] = useState("");
  const [totalDaysEdit, setTotalDaysEdit] = useState(null);
  const handleYearChange = (event) => {
    setSelectedYear(event.value);
    updateDateValue(event.value, selectedMonth);
  };

  const handleYearChangeEdit = (event) => {
    setSelectedYearEdit(event.value);
    updateDateValueEdit(event.value, selectedMonthEdit);
    setTotalDaysEdit(0);
    let currentDate = new Date();
    currentDate.setDate(1);
    currentDate.setMonth(selectedMonthEdit - 1);
    currentDate.setFullYear(event.value);
    let dateString = currentDate.toISOString().split("T")[0];
    setToDateEdit(dateString);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    updateDateValue(selectedYear, event.value);
    setSelectMonthName(event.label);
  };

  const handleMonthChangeEdit = (event) => {
    setSelectedMonthEdit(event.value);
    setSelectMonthNameEdit(event.label);
    updateDateValueEdit(selectedYearEdit, event.value);
    setTotalDaysEdit(0);
    let currentDate = new Date();
    currentDate.setDate(1);
    currentDate.setMonth(event.value - 1);
    currentDate.setFullYear(selectedYearEdit);
    let dateString = currentDate.toISOString().split("T")[0];
    setToDateEdit(dateString);
  };

  const handleFromDateChange = (event) => {
    if (selectedYear.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Select  Month"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      setSelectedDate(event.target.value);
      updateTotalDays(event.target.value, toDate);
    }
  };

  const handleFromDateChangeEdit = (event) => {
    if (selectedYearEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Select  Month"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      setSelectedDateEdit(event.target.value);
      updateTotalDaysEdit(event.target.value, toDateEdit);
    }
  };

  const handleToDateChange = (event) => {
    if (selectedYear.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Select  Year and  Month"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      setToDate(event.target.value);
      updateTotalDays(selectedDate, event.target.value);
    }
  };

  const handleToDateChangeEdit = (event) => {
    if (selectedYearEdit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Select  Year and  Month"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      setToDateEdit(event.target.value);
      updateTotalDaysEdit(selectedDateEdit, event.target.value);
    }
  };

  const updateDateValue = (year, month) => {
    const currentDate = new Date();
    const monthShow = currentDate.getMonth();
    currentDate.setFullYear(year);
    currentDate.setMonth(month === "" ? monthShow : month - 1);
    currentDate.setDate(1);

    const selectedDate = currentDate.toISOString().split("T")[0];

    // Set selected month, previous month, and next month
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth() - 1);

    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);

    const minimumDate = previousMonth.toISOString().split("T")[0];
    const maxSet = nextMonth.toISOString().split("T")[0];

    // Update your UI or other logic as needed
    const dateFromInput = document.getElementById("datefrom");
    const dateToDate = document.getElementById("todate");

    if (dateFromInput) {
      dateFromInput.min = minimumDate;
      dateFromInput.max = maxSet;
    }

    if (dateToDate) {
      dateToDate.min = minimumDate;
      dateToDate.max = maxSet;
    }


  };

  const updateDateValueEdit = (year, month) => {
    const monthNumber = month || new Date().getMonth() + 1;
    const currentDate = new Date();

    currentDate.setFullYear(year);
    currentDate.setMonth(monthNumber - 1);
    currentDate.setDate(1);

    const selectedDateEdit = currentDate.toISOString().split("T")[0];

    // Calculate the last day of the current month
    const lastDayOfMonth = new Date(year, monthNumber, 0).getDate();

    const toDateFormat = new Date(currentDate);
    toDateFormat.setMonth(toDateFormat.getMonth() + 1);
    toDateFormat.setDate(lastDayOfMonth);
    const toDateEdit = toDateFormat.toISOString().split("T")[0];

    setSelectedDateEdit(selectedDateEdit);
    setToDateEdit(toDateEdit);

    // Minimum and Maximum date setting
    const previousMonthLastDay = new Date(year, monthNumber - 1, 0).getDate();
    const minimumDate = new Date(year, monthNumber - 1, 1).toISOString().split("T")[0];
    const maxSet = new Date(year, monthNumber - 1, previousMonthLastDay).toISOString().split("T")[0];

    const dateFromInput = document.getElementById("datefromEdit");
    const dateToDate = document.getElementById("todateEdit");

    if (dateFromInput) {
      dateFromInput.min = minimumDate;
      dateFromInput.max = maxSet;
    }

    if (dateToDate) {
      dateToDate.min = minimumDate;
      dateToDate.max = maxSet;
    }
  };

  const updateTotalDays = (from, to) => {
    const fromDateObj = new Date(from);
    const toDateObj = new Date(to);

    if (!isNaN(fromDateObj) && !isNaN(toDateObj)) {
      let startDate = fromDateObj;
      let endDate = toDateObj;

      // Swap start and end dates if 'To Date' is before 'From Date'
      if (toDateObj < fromDateObj) {
        startDate = toDateObj;
        endDate = fromDateObj;
      }

      // Calculate the total number of days
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      // Set the total days
      setTotalDays(totalDays);
    } else {
      // Invalid dates, set total days to 0
      setTotalDays(0);
    }
  };

  const updateTotalDaysEdit = (from, to) => {
    const fromDateObj = new Date(from);
    const toDateObj = new Date(to);

    if (!isNaN(fromDateObj) && !isNaN(toDateObj)) {
      // Set both start and end dates
      let startDate = fromDateObj;
      let endDate = toDateObj;

      // Swap start and end dates if 'To Date' is before 'From Date'
      if (toDateObj < fromDateObj) {
        startDate = toDateObj;
        endDate = fromDateObj;
      }

      // Calculate the total number of days
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Set the total days
      setTotalDaysEdit(daysDiff + 1);
    } else {
      // Invalid dates, set total days to 0
      setTotalDaysEdit(0);
    }
  };

  useEffect(() => {
    fetchDepartmentSet();
  }, [page, pageSize, searchQuery])


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
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
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
 
  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.DEPMONTHSET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSingleMonthSet(res?.data?.sdepartmentdetails);
      handleClickOpen();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // Alert delete popup
  let holidayid = singleDepMonth._id;

  const delHoliday = async (holidayid) => {
    try {
      await axios.delete(`${SERVICE.DEPMONTHSET_SINGLE}/${holidayid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchDepartmentSet();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const delDeptmentcheckbox = async () => {
    try {

      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.DEPMONTHSET_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchDepartmentSet();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //add function
  const sendRequest = async () => {
    let monthname = "";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (selectedMonth >= 1 && selectedMonth <= 12) {
      monthname = monthNames[selectedMonth - 1];
    }
    try {
      let statusCreate = await axios.post(SERVICE.DEPMONTHSET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: String(departmentset.department),
        year: String(selectedYear),
        month: String(selectedMonth),
        monthname: String(monthname),
        fromdate: String(selectedDate),
        todate: String(toDate),
        totaldays: String(totalDays),
        salary: String(departmentset.salary),
        proftaxstop: String(departmentset.proftaxstop),
        penalty: String(departmentset.penalty),
        esistop: String(departmentset.esistop),
        pfstop: String(departmentset.pfstop),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Added Successfully"}</p>
        </>
      );
      handleClickOpenerr();
      fetchDepartmentSet();
      setDepartmentSet({ ...departmentset, salary: false, proftaxstop: false, penalty: false, esistop: false, pfstop: false });
      setSelectedYear("Select Year");
      setSelectedDate("");
      setToDate("");
      setTotalDays("");
      updateDateValue("", "");
      setSelectMonthName("Select Month");
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    if (departmentset.department === "Select Department") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedYear === "Select Year") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Year"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectmonthname === "Select Month") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Month"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedDate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select  From Date"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (toDate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select to Date"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (totalDays === null || totalDays === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please select to date greater than from date"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  const handleclear = (e) => {
    e.preventDefault();
    setDepartmentSet({ ...departmentset, department: "Select Department", salary: false, proftaxstop: false, penalty: false, esistop: false, pfstop: false });
    setSelectedYear("Select Year");
    setSelectedMonth("");
    setSelectMonthName("Select Month");
    setSelectedDate("");
    setToDate("");
    setTotalDays("");
    updateDateValue("", "");
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };
  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.DEPMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleMonthSet(res?.data?.sdepartmentdetails);
      setSelectedYearEdit(res?.data?.sdepartmentdetails?.year);
      setSelectedMonthEdit(res?.data?.sdepartmentdetails?.month);
      setSelectedDateEdit(res?.data?.sdepartmentdetails?.fromdate);
      setTotalDaysEdit(res?.data?.sdepartmentdetails?.totaldays);
      setToDateEdit(res?.data?.sdepartmentdetails?.todate);
      setSelectMonthNameEdit(res?.data?.sdepartmentdetails?.monthname);

      handleClickOpenEdit();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.DEPMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleMonthSet(res?.data?.sdepartmentdetails);
      handleClickOpenview();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.DEPMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleMonthSet(res?.data?.sdepartmentdetails);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // updateby edit page...
  let updateby = singleDepMonth.updatedby;
  let addedby = singleDepMonth.addedby;
  let holidayId = singleDepMonth._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.DEPMONTHSET_SINGLE}/${holidayId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: String(singleDepMonth.department),
        year: String(selectedYearEdit),
        month: String(selectedMonthEdit),
        monthname: String(selectmonthnameEdit),
        fromdate: String(selectedDateEdit),
        todate: String(toDateEdit),
        totaldays: String(totalDaysEdit),
        salary: String(singleDepMonth.salary),
        proftaxstop: String(singleDepMonth.proftaxstop),
        penalty: String(singleDepMonth.penalty),
        esistop: String(singleDepMonth.esistop),
        pfstop: String(singleDepMonth.pfstop),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchDepartmentSet();
      handleCloseModEdit();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const editSubmit = (e) => {
    e.preventDefault();

    if (singleDepMonth.department === "Select Department" || "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedYearEdit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Year"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedMonthEdit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Month"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedDateEdit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select  From Date"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (toDateEdit === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select  to Date"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (totalDaysEdit === null || totalDaysEdit === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please select to date greater than from date"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);
  //get all data.
  const fetchDepartmentSet = async () => {
    try {
      let res_status = await axios.post(SERVICE.GETDEPARTMENTMONTHSETBYPAGINATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery
      });

      const ans = res_status?.data?.departmentdetails?.length > 0 ? res_status?.data?.result : []
      const monthsarray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      let valuemonth = [...ans].sort((a, b) => {
        const yearComparison = parseInt(a.year) - parseInt(b.year);
        if (yearComparison !== 0) {
          return yearComparison; // If years are different, sort by year
        } else {
          // If years are the same, sort by month
          const indexA = monthsarray.indexOf(a.monthname);
          const indexB = monthsarray.indexOf(b.monthname);
          return indexA - indexB;
        }
      });
      const itemsWithSerialNumber = valuemonth?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        salary: item.salary ? "YES" : "NO",
        proftaxstop: item.proftaxstop ? "YES" : "NO",
        penalty: item.penalty ? "YES" : "NO",
        esistop: item.esistop ? "YES" : "NO",
        pfstop: item.pfstop ? "YES" : "NO",
        fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
        todate: moment(item.todate).format("DD-MM-YYYY"),
      }));

      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalDatas : 0);

      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);

      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

      setAllDepartmentSet(itemsWithSerialNumber);
      setStatusCheck(true);

     } catch (err) {   setStatusCheck(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all data.
  const fetchDepartmentNames = async () => {
    try {
      let res_status = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let dep_datas = res_status.data.departmentdetails
        .map((data) => data.deptname)
        .map((d) => ({
          ...d,
          label: d,
          value: d,
        }));
      setDeparmentNames(dep_datas);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  useEffect(() => {
    fetchDepartmentNames();
  }, []);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "DepartmentMonthSet.png");
        });
      });
    }
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
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error('Blob or FileSaver not supported');
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error('FileSaver.saveAs is not available');
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error('Error exporting to Excel', error);
    }
  };

  const formatData = (data) => {
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        "Department": item.department || '',
        Year: item.year || '',

        Month: item.monthname || '',
        Fromdate: item.fromdate || '',
        Todate: item.todate || '',
        Salary: item.salary || '',
        "Prof-Tax-Stop": item.proftaxstop || '',
        Penalty: item.penalty || '',
        "Esi-Stop": item.esistop || '',
        "Pf-Stop": item.pfstop || '',
        "No.Of.Days": item.totaldays || '',

      };
    });
  };

  const handleExportXL = async (isfilter) => {
    setIsFilterOpen(false);
    setLoading(true);
    setLoadingMessage('Fetching data...');

    let overallDatas;

    if (isfilter !== "filtered") {
      try {
        const res = await axios.get(SERVICE.DEPMONTHSET_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        overallDatas = res?.data?.departmentdetails?.map((item) => ({
          ...item,
          salary: item.salary ? "YES" : "NO",
          proftaxstop: item.proftaxstop ? "YES" : "NO",
          penalty: item.penalty ? "YES" : "NO",
          esistop: item.esistop ? "YES" : "NO",
          pfstop: item.pfstop ? "YES" : "NO",
          fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
          todate: moment(item.todate).format("DD-MM-YYYY"),
        }));
      } catch (err) {setLoading(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    setLoadingMessage('Preparing data for export...');

    const dataToExport = isfilter === "filtered" ? filteredDatas : overallDatas;

    if (!dataToExport || dataToExport.length === 0) {
      console.error('No data available to export');
      setLoading(false);
      return;
    }

    exportToExcel(formatData(dataToExport), 'DepartmentMonthSet');

    setLoading(false);
  };

  // pdf.....
  const columns = [
    { title: "Department ", field: "department" },
    { title: "Year ", field: "year" },
    { title: "Month ", field: "monthname" },
    { title: "Fromdate ", field: "fromdate" },
    { title: "Todate ", field: "todate" },
    { title: "Salary ", field: "salary" },
    { title: "Prof-Tax-Stop ", field: "proftaxstop" },
    { title: "Penalty ", field: "penalty" },
    { title: "Esi-Stop ", field: "esistop" },
    { title: "Pf-Stop ", field: "pfstop" },
    { title: "No.Of.Days ", field: "totaldays" },

  ];

  const downloadPdf = async (isfilter) => {
    setLoading(true);
    setLoadingMessage('Fetching data...');

    let overallDatas;

    if (isfilter !== "filtered") {
      try {
        const res = await axios.get(SERVICE.DEPMONTHSET_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        overallDatas = res?.data?.departmentdetails?.map((item) => ({
          ...item,
          salary: item.salary ? "YES" : "NO",
          proftaxstop: item.proftaxstop ? "YES" : "NO",
          penalty: item.penalty ? "YES" : "NO",
          esistop: item.esistop ? "YES" : "NO",
          pfstop: item.pfstop ? "YES" : "NO",
          fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
          todate: moment(item.todate).format("DD-MM-YYYY"),
        }));
      } catch (err) {setLoading(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

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
        ? filteredDatas.map((t, index) => ({
          ...t,
          serialNumber: index + 1,

        }))
        : overallDatas?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,


        }));

    setLoadingMessage('Preparing data for export...');

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("DepartmentMonthSet.pdf");
    setLoading(false);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "DepartmentMonthSet",
    pageStyle: "print",
  });
  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
    fetchDepartmentSet();
  };
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
    fetchDepartmentSet();
  };
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = alldepartmentSet?.filter((item) => {
    return searchOverAllTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }
            setSelectedRows(updatedSelectedRows);
            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredDatas.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 70,
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
    { field: "department", headerName: "Department", flex: 0, width: 140, hide: !columnVisibility.department, headerClassName: "bold-header" },
    { field: "year", headerName: "Year", flex: 0, width: 90, hide: !columnVisibility.year, headerClassName: "bold-header" },
    { field: "month", headerName: "Month", flex: 0, width: 100, hide: !columnVisibility.month, headerClassName: "bold-header" },
    { field: "fromdate", headerName: "Fromdate", flex: 0, width: 100, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
    { field: "todate", headerName: "Todate", flex: 0, width: 100, hide: !columnVisibility.todate, headerClassName: "bold-header" },
    { field: "salary", headerName: "Salary", flex: 0, width: 100, hide: !columnVisibility.salary, headerClassName: "bold-header" },
    { field: "proftaxstop", headerName: "Prof-Tax-Stop", flex: 0, width: 130, hide: !columnVisibility.proftaxstop, headerClassName: "bold-header" },
    { field: "penalty", headerName: "Penalty", flex: 0, width: 100, hide: !columnVisibility.penalty, headerClassName: "bold-header" },
    { field: "esistop", headerName: "Esi-Stop", flex: 0, width: 100, hide: !columnVisibility.esistop, headerClassName: "bold-header" },
    { field: "pfstop", headerName: "Pf-Stop", flex: 0, width: 100, hide: !columnVisibility.pfstop, headerClassName: "bold-header" },
    { field: "totaldays", headerName: "No.Of.Days", flex: 0, width: 100, hide: !columnVisibility.totaldays, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("edepartmentmonthset") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ddepartmentmonthset") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vdepartmentmonthset") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("idepartmentmonthset") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      department: item.department,
      year: item.year,
      month: item.monthname,
      fromdate: item.fromdate,
      todate: item.todate,
      totaldays: item.totaldays,
      salary: item.salary,
      proftaxstop: item.proftaxstop,
      penalty: item.penalty,
      esistop: item.esistop,
      pfstop: item.pfstop,
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
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
              <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  return (
    <Box>
      <Headtitle title={"Department Month Set"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Department Month Set</Typography>

      {isUserRoleCompare?.includes("adepartmentmonthset") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Add Department Month Set</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Department <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={departmentNames}
                    value={{ label: departmentset.department, value: departmentset.department }}
                    onChange={(e) => {
                      setDepartmentSet({ ...departmentset, department: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Year<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={selectedYear === "Select Year" ? [] : months} value={{ label: selectmonthname, value: selectmonthname }} onChange={handleMonthChange} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    From Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={selectedDate} type="date" onChange={handleFromDateChange} id="datefrom" />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    To Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={toDate} type="date" onChange={handleToDateChange} id="todate" />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Total Days<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={totalDays} readOnly />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(departmentset.salary)}
                      onClick={(e) => {
                        setDepartmentSet({ ...departmentset, salary: e.target.checked });
                      }}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                    />
                  }
                  label="Salary"
                />
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(departmentset.proftaxstop)}
                      onClick={(e) => {
                        setDepartmentSet({ ...departmentset, proftaxstop: e.target.checked });
                      }}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                    />
                  }
                  label="Prof-Tax-Stop"
                />
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(departmentset.penalty)}
                      onClick={(e) => {
                        setDepartmentSet({ ...departmentset, penalty: e.target.checked });
                      }}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                    />
                  }
                  label="Penalty"
                />
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(departmentset.esistop)}
                      onClick={(e) => {
                        setDepartmentSet({ ...departmentset, esistop: e.target.checked });
                      }}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                    />
                  }
                  label="ESI-Stop"
                />
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(departmentset.pfstop)}
                      onClick={(e) => {
                        setDepartmentSet({ ...departmentset, pfstop: e.target.checked });
                      }}
                      sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                    />
                  }
                  label="PF-Stop"
                />
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container>
              <Grid item md={3} xs={12} sm={6}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <Button sx={userStyle.btncancel} onClick={handleclear}>
                  Clear
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("ldepartmentmonthset") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>List Department Month Set</Typography>
            </Grid>
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
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("exceldepartmentmonthset") && (
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
                  {isUserRoleCompare?.includes("csvdepartmentmonthset") && (
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
                  {isUserRoleCompare?.includes("printdepartmentmonthset") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfdepartmentmonthset") && (
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
                  {isUserRoleCompare?.includes("imagedepartmentmonthset") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bddepartmentmonthset") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>)}
            <br />
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
            </Box>
            <Box>
              <Pagination page={page} pageSize={pageSize} totalPages={searchQuery !== "" ? 1 : totalPages} onPageChange={handlePageChange} pageItemLength={filteredDatas?.length} totalProjects={
                searchQuery !== "" ? filteredDatas?.length : totalDatas
              } />

            </Box>
            {/* ****** Table End ****** */}
          </Box>
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
      {/*DELETE ALERT DIALOG */}
      <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" color="error" onClick={(e) => delHoliday(holidayid)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Department Month Set List Info</Typography>
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
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Fromdate</TableCell>
              <TableCell>Todate</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Prof-Tax-Stop</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Esi-Stop</TableCell>
              <TableCell>Pf-Stop</TableCell>
              <TableCell>No.Of.Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredDatas &&
              filteredDatas.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.monthname}</TableCell>
                  <TableCell>{row.fromdate}</TableCell>
                  <TableCell>{row.todate}</TableCell>
                  <TableCell>{row.salary}</TableCell>
                  <TableCell>{row.proftaxstop}</TableCell>
                  <TableCell>{row.penalty}</TableCell>
                  <TableCell>{row.esistop}</TableCell>
                  <TableCell>{row.pfstop}</TableCell>
                  <TableCell>{row.totaldays}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* view model */}
      <Dialog open={openview} onClose={handleCloseview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.HeaderText}>View Department Month Set</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Department <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={singleDepMonth.department} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Year<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput options={years} value={singleDepMonth.year} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={singleDepMonth.monthname} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    From Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  {/* <OutlinedInput value={singleDepMonth.fromdate} readOnly /> */}
                  <OutlinedInput value={moment(singleDepMonth.fromdate).format('DD-MM-YYYY')} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    To Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={moment(singleDepMonth.todate).format('DD-MM-YYYY')} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Total Days<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={singleDepMonth.totaldays} readOnly />
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.salary)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="Salary" />
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.proftaxstop)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="Prof-Tax-Stop" />
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.penalty)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="Penalty" />
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.esistop)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="ESI-Stop" />
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControlLabel control={<Checkbox checked={Boolean(singleDepMonth.pfstop)} sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }} />} label="PF-Stop" />
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container>
              <Grid item md={3} xs={12} sm={6}>
                <Button variant="contained" onClick={handleCloseview}>
                  Back
                </Button>
              </Grid>
              <Grid item md={3} xs={12} sm={6}></Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true}>
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.HeaderText}>Edit Department Month Set</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={departmentNames}
                      placeholder={singleDepMonth.department}
                      onChange={(e) => {
                        setSingleMonthSet({ ...singleDepMonth, department: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Year<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={years} placeholder={singleDepMonth.year} onChange={handleYearChangeEdit} />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Month <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={months} placeholder={singleDepMonth.monthname} onChange={handleMonthChangeEdit} />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      From Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput value={selectedDateEdit} type="date" onChange={handleFromDateChangeEdit} id="datefromEdit" />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      To Date <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput value={toDateEdit} type="date" onChange={handleToDateChangeEdit} id="todateEdit" />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Total Days</Typography>
                    <OutlinedInput placeholder={singleDepMonth.totaldays} value={totalDaysEdit} readOnly />
                  </FormControl>
                </Grid>

                <Grid item md={4} xs={12} sm={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(singleDepMonth.salary)}
                        onClick={(e) => {
                          setSingleMonthSet({ ...singleDepMonth, salary: e.target.checked });
                        }}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                      />
                    }
                    label="Salary"
                  />
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(singleDepMonth.proftaxstop)}
                        onClick={(e) => {
                          setSingleMonthSet({ ...singleDepMonth, proftaxstop: e.target.checked });
                        }}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                      />
                    }
                    label="Prof-Tax-Stop"
                  />
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(singleDepMonth.penalty)}
                        onClick={(e) => {
                          setSingleMonthSet({ ...singleDepMonth, penalty: e.target.checked });
                        }}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                      />
                    }
                    label="Penalty"
                  />
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(singleDepMonth.esistop)}
                        onClick={(e) => {
                          setSingleMonthSet({ ...singleDepMonth, esistop: e.target.checked });
                        }}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                      />
                    }
                    label="ESI-Stop"
                  />
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(singleDepMonth.pfstop)}
                        onClick={(e) => {
                          setSingleMonthSet({ ...singleDepMonth, pfstop: e.target.checked });
                        }}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: "33px" } }}
                      />
                    }
                    label="PF-Stop"
                  />
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container>
                <Grid item md={3} xs={12} sm={6}>
                  <Button variant="contained" color="primary" onClick={editSubmit}>
                    Update
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      <Box>
        <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button autoFocus variant="contained" color="error" onClick={(e) => delDeptmentcheckbox(e)}>
              {" "}
              OK{" "}
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
      <Loader loading={loading} message={loadingMessage} />
    </Box>
  );
}

export default DepartmentMonthSet;