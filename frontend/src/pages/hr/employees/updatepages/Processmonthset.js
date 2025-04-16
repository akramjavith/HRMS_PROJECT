import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import { handleApiError } from "../../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { AuthContext } from "../../../../context/Appcontext";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import Headtitle from "../../../../components/Headtitle";
import { DataGrid } from "@mui/x-data-grid";
import StyledDataGrid from "../../../../components/TableStyle";
import { styled } from "@mui/system";
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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '../../../../components/Pagination';

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

function ProcessMonthSet() {

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');

  let today = new Date();
  var yyyy = today.getFullYear();
  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ id: year, value: year.toString(), label: year.toString() });
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

  const monthsOpt = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];


  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
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
  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    process: true,
    year: true,
    month: true,
    fromdate: true,
    todate: true,
    totaldays: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // process month set
  const [processset, setProcessSet] = useState({ process: "Select Process", year: "", month: "", fromdate: "", todate: "", totaldays: null });
  const [singleDepMonth, setSingleMonthSet] = useState({});
  const [processNames, setProcessNames] = useState([]);
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectmonthname, setSelectMonthName] = useState("Select Month");
  const [selectedDate, setSelectedDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalDays, setTotalDays] = useState(null);
  const [allprocessSet, setAllProcessSet] = useState([]);


  // edit states
  const [selectedYearEdit, setSelectedYearEdit] = useState("");
  const [selectedMonthEdit, setSelectedMonthEdit] = useState("");
  const [selectmonthnameEdit, setSelectMonthNameEdit] = useState("");
  const [selectedDateEdit, setSelectedDateEdit] = useState("");
  const [toDateEdit, setToDateEdit] = useState("");
  const [totalDaysEdit, setTotalDaysEdit] = useState(null);
  const [selectProcess, setSelectProcess] = useState("");

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
    updateDateValue(event.value, selectedMonth);
  };

  const handleYearChangeEdit = (event) => {
    setSelectedYearEdit(event.value);
    updateDateValueEdit(event.value,
      selectedMonthEdit == "January" ? "1" :
        selectedMonthEdit == "February" ? "2" :
          selectedMonthEdit == "March" ? "3" :
            selectedMonthEdit == "April" ? "4" :
              selectedMonthEdit == "May" ? "5" :
                selectedMonthEdit == "June" ? "6" :
                  selectedMonthEdit == "July" ? "7" :
                    selectedMonthEdit == "August" ? "8" :
                      selectedMonthEdit == "September" ? "9" :
                        selectedMonthEdit == "October" ? "10" :
                          selectedMonthEdit == "November" ? "11" :
                            selectedMonthEdit == "December" ? "12" : selectedMonthEdit);
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
    updateDateValueEdit(selectedYearEdit,
      event.value == "January" ? "1" :
        event.value == "February" ? "2" :
          event.value == "March" ? "3" :
            event.value == "April" ? "4" :
              event.value == "May" ? "5" :
                event.value == "June" ? "6" :
                  event.value == "July" ? "7" :
                    event.value == "August" ? "8" :
                      event.value == "September" ? "9" :
                        event.value == "October" ? "10" :
                          event.value == "November" ? "11" :
                            event.value == "December" && "12");
    setTotalDaysEdit(0);
    let currentDate = new Date();
    currentDate.setDate(1);
    currentDate.setMonth(event.value - 1);
    currentDate.setFullYear(selectedYearEdit);
    let dateString = currentDate.toISOString().split("T")[0];
    setToDateEdit(dateString);
    setSingleMonthSet({
      ...singleDepMonth,
      monthname: event.label
    })
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
      setToDate("")
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
      setToDateEdit("")
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
      const toDate = event.target.value;
      const fromDate = selectedDate;
      const toDateObj = new Date(toDate);
      const fromDateObj = new Date(fromDate);

      if (toDateObj > fromDateObj) {
        setToDate(toDate);
        updateTotalDays(selectedDate, event.target.value);
      } else {
        setToDate("");
      }
      // setToDate(event.target.value);
      // updateTotalDays(selectedDate, event.target.value);
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
      const toDate = event.target.value;
      const fromDate = selectedDateEdit;
      const toDateObj = new Date(toDate);
      const fromDateObj = new Date(fromDate);

      if (toDateObj > fromDateObj) {
        setToDateEdit(toDate);
        updateTotalDaysEdit(selectedDateEdit, event.target.value);
      } else {
        setToDateEdit("");
      }
   
    }
  };

  const updateDateValue = (year, month) => {

    const currentDate = new Date();
    const monthShow = currentDate.getMonth();
    currentDate.setFullYear(year);
    currentDate.setMonth(month === "" ? monthShow : month - 1);
    currentDate.setDate(1);
    setSelectedDate(currentDate.toISOString().split("T")[0]);

    // minimum date setting
    const nextMonthFirstDay = new Date(year, month, 1);
    nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);
    const lastDate = nextMonthFirstDay.getDate();
    const currentMax = new Date();
    currentMax.setFullYear(year);
    currentMax.setMonth(month === "" ? monthShow : month - 1);
    currentMax.setDate(lastDate);

    const monthDiff = new Date(currentDate.toISOString().split("T")[0])

    monthDiff.setMonth(monthDiff.getMonth() - 1);

    const minimumDate = monthDiff.toISOString().slice(0, 10);
    const maxSet = currentMax.toISOString().split("T")[0];


    const dateToDate = document.getElementById("todate");


    const dateFromInput = document.getElementById("datefrom");
    if (dateFromInput) {
      dateFromInput.min = minimumDate;
      dateFromInput.max = maxSet;
    }
    if (dateToDate) {
      dateToDate.min = minimumDate;
      dateToDate.max = maxSet;
    }
  };

  const [isOpen, setIsOpen] = useState(false)

  const updateDateValueEdit = (year, month) => {
    const monthNumber = month || new Date().getMonth() + 1;
    const currentDate = new Date();

    currentDate.setFullYear(year);
    currentDate.setMonth(monthNumber - 1);
    currentDate.setDate(1);

    const selectedDateEdit = currentDate.toISOString().split("T")[0];
    const toDateFormat = new Date(currentDate);
    toDateFormat.setMonth(toDateFormat.getMonth() + 1);
    toDateFormat.setDate(toDateFormat.getDate() - 1);
    const toDateEdit = toDateFormat.toISOString().split("T")[0];

    if (isOpen) {
      setSelectedDateEdit(selectedDateEdit);
      setToDateEdit(toDateEdit);

    }

    // Minimum and Maximum date setting
    const nextMonthFirstDay = new Date(year, monthNumber, 1);
    nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);
    const lastDate = nextMonthFirstDay.getDate();

    const currentMax = new Date();
    currentMax.setFullYear(year);
    currentMax.setMonth(monthNumber - 1);
    currentMax.setDate(lastDate);

    const monthDiff = new Date(selectedDateEdit)

    monthDiff.setMonth(monthDiff.getMonth() - 1);

    const minimumDate = monthDiff.toISOString().slice(0, 10);
    const maxSet = currentMax.toISOString().split("T")[0];

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
      let timeDiff;
      if (toDateObj >= fromDateObj) {
        timeDiff = toDateObj - fromDateObj;
      } else {
        // "To Date" is before "From Date," so consider a zero-day difference
        timeDiff = 0;
      }

      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      setTotalDays(daysDiff + 1);
    } else {
      setTotalDays(0);
    }
  };

  const updateTotalDaysEdit = (from, to) => {
    const fromDateObj = new Date(from);
    const toDateObj = new Date(to);

    if (!isNaN(fromDateObj) && !isNaN(toDateObj)) {
      let timeDiff;
      if (toDateObj >= fromDateObj) {
        timeDiff = toDateObj - fromDateObj;
      } else {
        // "To Date" is before "From Date," so consider a zero-day difference
        timeDiff = 0;
      }

      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      setTotalDaysEdit(timeDiff === 0 ? 0 : daysDiff + 1);
    } else {
      setTotalDaysEdit(0);
    }
  };

  //useEffect
  useEffect(() => {
    fetchProcessSet();
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  //days options

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
  const username = isUserRoleAccess.username;
  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
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

  const bulkdeletefunction = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PROCESSMONTHSET_SINGLE}/${item}`, {
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

      await fetchProcessSet();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully"} </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
      let res = await axios.get(`${SERVICE.PROCESSMONTHSET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSingleMonthSet(res?.data?.sprocessmonthset);
      handleClickOpen();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // Alert delete popup
  let holidayid = singleDepMonth._id;

  const delFunction = async (holidayid) => {
    try {
      await axios.delete(`${SERVICE.PROCESSMONTHSET_SINGLE}/${holidayid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchProcessSet();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Deleted Successfully"} </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const [isBtn, setIsBtn] = useState(false)
  //add function
  const sendRequest = async () => {
    setIsBtn(true)
    let monthname = "";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (selectedMonth >= 1 && selectedMonth <= 12) {
      monthname = monthNames[selectedMonth - 1];
    }
    try {
      let statusCreate = await axios.post(SERVICE.PROCESSMONTHSET_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        process: String(processset.process),
        year: String(selectedYear),
        month: String(selectedMonth),
        monthname: String(monthname),
        fromdate: String(selectedDate),
        todate: String(toDate),
        totaldays: String(totalDays),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      fetchProcessSet();
      setProcessSet({ ...processset });
      setSelectedYear("Select Year");
      setSelectedDate("");
      setToDate("");
      setTotalDays("");
      updateDateValue("", "");
      setSelectMonthName("Select Month");
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Added Successfully"} </p>
        </>
      );
      handleClickOpenerr();
      setIsBtn(false)
    } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    if (processset.process === "Select Process") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Process"}</p>
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
    setProcessSet({ ...processset, process: "Select Process" });
    setSelectedYear("Select Year");
    setSelectedMonth("");
    setSelectMonthName("Select Month");
    setSelectedDate("");
    setToDate("");
    setTotalDays("");
    updateDateValue("", "");
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
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
    setIsOpen(false)
  };

  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PROCESSMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleMonthSet(res?.data?.sprocessmonthset);
      setSelectedYearEdit(res?.data?.sprocessmonthset?.year);
      setSelectedMonthEdit(res?.data?.sprocessmonthset?.month);
      setSelectedDateEdit(res?.data?.sprocessmonthset?.fromdate);
      setTotalDaysEdit(res?.data?.sprocessmonthset?.totaldays);
      setToDateEdit(res?.data?.sprocessmonthset?.todate);
      setSelectMonthNameEdit(res?.data?.sprocessmonthset?.monthname);

      updateDateValueEdit(res?.data?.sprocessmonthset?.year,
        res?.data?.sprocessmonthset?.month == "January" ? "1" :
          res?.data?.sprocessmonthset?.month == "February" ? "2" :
            res?.data?.sprocessmonthset?.month == "March" ? "3" :
              res?.data?.sprocessmonthset?.month == "April" ? "4" :
                res?.data?.sprocessmonthset?.month == "May" ? "5" :
                  res?.data?.sprocessmonthset?.month == "June" ? "6" :
                    res?.data?.sprocessmonthset?.month == "July" ? "7" :
                      res?.data?.sprocessmonthset?.month == "August" ? "8" :
                        res?.data?.sprocessmonthset?.month == "September" ? "9" :
                          res?.data?.sprocessmonthset?.month == "October" ? "10" :
                            res?.data?.sprocessmonthset?.month == "November" ? "11" :
                              res?.data?.sprocessmonthset?.month == "December" ? "12" : res?.data?.sprocessmonthset?.month)
                            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PROCESSMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleMonthSet(res?.data?.sprocessmonthset);
      handleClickOpenview();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.PROCESSMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleMonthSet(res?.data?.sprocessmonthset);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // updateby edit page...
  let updateby = singleDepMonth.updatedby;
  let addedby = singleDepMonth.addedby;
  let holidayId = singleDepMonth._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.PROCESSMONTHSET_SINGLE}/${holidayId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        process: String(singleDepMonth.process),
        year: String(selectedYearEdit),
        month: String(selectedMonthEdit),
        monthname: String(selectmonthnameEdit),
        fromdate: String(selectedDateEdit),
        todate: String(toDateEdit),
        totaldays: String(totalDaysEdit),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchProcessSet();
      handleCloseModEdit();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7AC767" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Updated Successfully"} </p>
        </>
      );
      handleClickOpenerr();
      setIsOpen(false)
    } catch (err) {setIsOpen(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const editSubmit = (e) => {
    e.preventDefault();

    if (singleDepMonth.process === "Select Process" || "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Process"}</p>
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
    } else if (singleDepMonth.monthname === "Select Month") {
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
  const fetchProcessSet = async () => {
    try {
      let res_status = await axios.post(SERVICE.GETPROCESSMONTHSETBYPAGINATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery
      });
      setLoader(true);

      const ans = res_status?.data?.processmonthsets?.length > 0 ? res_status?.data?.result : []

      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
        fromdate: moment(item.fromdate).format("DD-MM-YYYY"),
        todate: moment(item.todate).format("DD-MM-YYYY"),
      }));

      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalDatas : 0);

      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);

      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

      setAllProcessSet(itemsWithSerialNumber);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  //get all data.
  const fetchProcessNames = async () => {
    try {
      let res_status = await axios.get(SERVICE.ALL_PROCESSQUEUENAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let dep_datas = res_status?.data?.processqueuename
        .map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }));
      const uniqueArray = dep_datas.filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      });
      setProcessNames(uniqueArray);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  useEffect(() => {
    fetchProcessNames();
  }, []);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ProcessMonthSet.png");
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
        "Process": item.process || '',
        Year: item.year || '',

        Month: item.monthname || '',
        Fromdate: item.fromdate || '',
        Todate: item.todate || '',
        "Total Days": item.totaldays || '',

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
        const res = await axios.get(SERVICE.PROCESSMONTHSET_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        overallDatas = res?.data?.processmonthsets?.map((item) => ({
          ...item,
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

    exportToExcel(formatData(dataToExport), 'ProcessMonthSet');

    setLoading(false);
  };

  // pdf.....
  const columns = [
    { title: "Process ", field: "process" },
    { title: "Year ", field: "year" },
    { title: "Month ", field: "month" },
    { title: "Fromdate ", field: "fromdate" },
    { title: "Todate ", field: "todate" },
    { title: "Total Days ", field: "totaldays" },

  ];

  const downloadPdf = async (isfilter) => {
    setLoading(true);
    setLoadingMessage('Fetching data...');

    let overallDatas;

    if (isfilter !== "filtered") {
      try {
        const res = await axios.get(SERVICE.PROCESSMONTHSET_ALL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        overallDatas = res?.data?.processmonthsets?.map((item) => ({
          ...item,
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

    doc.save("ProcessMonthSet.pdf");
    setLoading(false);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "ProcessMonthSet",
    pageStyle: "print",
  });

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
    fetchProcessSet();
  };
  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
    fetchProcessSet();
  };
  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  // Split the search query into individual terms
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = allprocessSet?.filter((item) => {
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
    { field: "process", headerName: "Process", flex: 0, width: 150, hide: !columnVisibility.process, headerClassName: "bold-header" },
    { field: "year", headerName: "Year", flex: 0, width: 100, hide: !columnVisibility.year, headerClassName: "bold-header" },
    { field: "month", headerName: "Month", flex: 0, width: 130, hide: !columnVisibility.month, headerClassName: "bold-header" },
    { field: "fromdate", headerName: "Fromdate", flex: 0, width: 150, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
    { field: "todate", headerName: "Todate", flex: 0, width: 150, hide: !columnVisibility.todate, headerClassName: "bold-header" },
    { field: "totaldays", headerName: "Total Days", flex: 0, width: 150, hide: !columnVisibility.totaldays, headerClassName: "bold-header" },
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
          {isUserRoleCompare?.includes("eprocessmonthset") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dprocessmonthset") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vprocessmonthset") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iprocessmonthset") && (
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
      process: item.process,
      year: item.year,
      month: item.monthname,
      fromdate: item.fromdate,
      todate:item.todate,
      totaldays: item.totaldays,
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
      <Headtitle title={"PROCESS MONTH SET"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Process Month Set</Typography>

      {isUserRoleCompare?.includes("aprocessmonthset") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Add Process Month Set</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Process <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={processNames}
                    value={{ label: processset.process, value: processset.process }}
                    onChange={(e) => {
                      setProcessSet({ ...processset, process: e.value });
                      setSelectProcess(e.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Year<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={(e) => {
                    handleYearChange(e)
                    setSelectedDate("")
                    setToDate("")
                    setSelectMonthName("Select Month")
                    setTotalDays("");
                  }} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={selectedYear === "Select Year" ? [] : months} value={{ label: selectmonthname, value: selectmonthname }} onChange={(e) => {
                    handleMonthChange(e)
                    setSelectedDate("")
                    setToDate("")
                    setTotalDays("");

                  }} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    From Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={selectedDate} type="date" onChange={(e) => {
                    handleFromDateChange(e)
                    setTotalDays("");
                  }} id="datefrom" onKeyDown={(e) => e.preventDefault()} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    To Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={toDate} type="date" onChange={handleToDateChange} id="todate" onKeyDown={(e) => e.preventDefault()} />
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
            </Grid>
            <br />
            <br />
            <Grid container>
              <Grid item md={3} xs={12} sm={6}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isBtn}>
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
      {!loader ?
        <Box sx={userStyle.container}>
          <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
          </Box>
        </Box> :
        <>
          {isUserRoleCompare?.includes("lprocessmonthset") && (
            <Box sx={userStyle.container}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>List Process Month Set</Typography>
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
                    {isUserRoleCompare?.includes("excelprocessmonthset") && (
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
                    {isUserRoleCompare?.includes("csvprocessmonthset") && (
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
                    {isUserRoleCompare?.includes("printprocessmonthset") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfprocessmonthset") && (
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
                    {isUserRoleCompare?.includes("imageprocessmonthset") && (
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
              {isUserRoleCompare?.includes("bdprocessmonthset") && (
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
          )}
        </>}
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
          <Button autoFocus variant="contained" color="error" onClick={(e) => delFunction(holidayid)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Process Month Set Info</Typography>
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
              <TableCell>Process</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Fromdate</TableCell>
              <TableCell>Todate</TableCell>
              <TableCell>Total Days</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.process}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.fromdate}</TableCell>
                  <TableCell>{row.todate}</TableCell>
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
                <Typography sx={userStyle.HeaderText}>View Process Month Set</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Process
                  </Typography>
                  <OutlinedInput value={singleDepMonth.process} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Year
                  </Typography>
                  <OutlinedInput options={years} value={singleDepMonth.year} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month
                  </Typography>
                  <OutlinedInput value={singleDepMonth.monthname} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    From Date
                  </Typography>
                  <OutlinedInput value={moment(singleDepMonth.fromdate).format("DD-MM-YYYY")} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    To Date
                  </Typography>
                  <OutlinedInput value={moment(singleDepMonth.todate).format("DD-MM-YYYY")} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Total Days
                  </Typography>
                  <OutlinedInput value={singleDepMonth.totaldays} readOnly />
                </FormControl>
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
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{
          overflow: 'visible',
          '& .MuiPaper-root': {
            overflow: 'visible',
          },
        }}>
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.HeaderText}>Edit Process Month Set</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Process <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={processNames}
                      placeholder={singleDepMonth.process}
                      value={{ label: singleDepMonth.process, value: singleDepMonth.process }}
                      onChange={(e) => {
                        setSingleMonthSet({ ...singleDepMonth, process: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Year<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={years}
                      placeholder={singleDepMonth.year}
                      value={{ label: singleDepMonth.year, value: singleDepMonth.year }}

                      // value={singleDepMonth.year}

                      onChange={(e) => {
                        handleYearChangeEdit(e)
                        setSelectedDateEdit("")
                        setToDateEdit("")
                        setSingleMonthSet({
                          ...singleDepMonth,
                          monthname: "Select Month",
                          year: e.label
                        })
                        setIsOpen(true)
                      }} />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Month <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={monthsOpt}
                      value={{ label: singleDepMonth.monthname, value: singleDepMonth.monthname }}
                      onChange={(e) => {
                        handleMonthChangeEdit(e)
                        setSelectedDateEdit("")
                        setToDateEdit("")
                        setIsOpen(true)
                      }} />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      From Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      value={selectedDateEdit}
                      type="date"
                      onChange={(e) => {
                        handleFromDateChangeEdit(e)
                        setTotalDaysEdit(0);
                      }}
                      id="datefromEdit"
                      onKeyDown={(e) => e.preventDefault()}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      To Date <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput value={toDateEdit} type="date" onChange={handleToDateChangeEdit} id="todateEdit" onKeyDown={(e) => e.preventDefault()} />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Total Days</Typography>
                    <OutlinedInput placeholder={singleDepMonth.totaldays} value={totalDaysEdit} readOnly />
                  </FormControl>
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
      {/* Bulk delete ALERT DIALOG */}
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
            <Button autoFocus variant="contained" color="error"
              onClick={(e) => bulkdeletefunction(e)}
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

export default ProcessMonthSet;