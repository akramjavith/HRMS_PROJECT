import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  FormControl,
  OutlinedInput,
  Popover,
  Select,
  Switch,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
  InputAdornment,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TableContainer
} from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../../../components/AggregatedSearchBar';
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import domtoimage from 'dom-to-image';
import AggridTableForPaginationTable from "../../../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { MultiSelect } from "react-multi-select-component";

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

  const [selectedDepartmentvalue, setselectedDepartmentOptionsEdit] = useState([]);

  let [valueDepartmentAdd, setValueDepartmentAdd] = useState([]);
  const customValueRendererDepartmentAdd = (valueDepartmentAdd, _companies) => {
    return valueDepartmentAdd.length ? valueDepartmentAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Department</span>
  }

  const handleDepartmentChangeAdd = (options) => {
    setValueDepartmentAdd(
      options.map(a => {
        return a.value;
      })
    )
    // BranchDropDowns(options)
    setselectedDepartmentOptionsEdit(options);
  }
  const [selectedYearvalue, setselectedYearOptionsEdit] = useState([]);

  let [valueYearAdd, setValueYearAdd] = useState([]);
  const customValueRendererYearAdd = (valueYearAdd, _companies) => {
    return valueYearAdd.length ? valueYearAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Year</span>
  }

  const handleYearChangeAdd = (options) => {
    setValueYearAdd(
      options.map(a => {
        return a.value;
      })
    )
    setselectedMonthOptionsEdit([])
    setValueMonthAdd([])
    setselectedYearOptionsEdit(options);
  }

  const [selectedMonthvalue, setselectedMonthOptionsEdit] = useState([]);

  let [valueMonthAdd, setValueMonthAdd] = useState("");
  const customValueRendererMonthAdd = (valueMonthAdd, _companies) => {
    return valueMonthAdd.length ? valueMonthAdd.map(({ label }) => label)?.join(",") :
      <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Month</span>
  }

  const handleMonthChangeAdd = (options) => {
    setValueMonthAdd(
      options.map(a => {
        return a.label;
      })
    )
    // BranchDropDowns(options)
    setselectedMonthOptionsEdit(options);
  }

  const deduction = [
    { label: "Corrections", value: "Corrections" },
    { label: "Existings", value: "Existings" },
    { label: "New", value: "New" },
  ];
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [logicOperator, setLogicOperator] = useState("AND");
  const [filterValue, setFilterValue] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")
  const [allDataDup, setAllDataDup] = useState([]);

  let exportColumnNames = [
    'Department ',
    'Year ',
    'Month ',
    'Fromdate ',
    'Todate ',
    'Salary ',
    'Prof-Tax-Stop ',
    'Penalty ',
    'Esi-Stop ',
    'Pf-Stop ',
    'No.Of.Days '
  ];
  let exportRowValues = [
    'department', 'year',
    'month', 'fromdate',
    'todate', 'salary',
    'proftaxstop', 'penalty',
    'esistop', 'pfstop',
    'totaldays'
  ];
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
  const { isUserRoleCompare, isUserRoleAccess, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
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
    setIsHandleChange(true)
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
    updateDateValueEdit(event.value,
      selectedMonthEdit == "January" ? 1 :
        selectedMonthEdit == "February" ? 2 :
          selectedMonthEdit == "March" ? 3 :
            selectedMonthEdit == "April" ? 4 :
              selectedMonthEdit == "May" ? 5 :
                selectedMonthEdit == "June" ? 6 :
                  selectedMonthEdit == "July" ? 7 :
                    selectedMonthEdit == "August" ? 8 :
                      selectedMonthEdit == "September" ? 9 :
                        selectedMonthEdit == "October" ? 10 :
                          selectedMonthEdit == "November" ? 11 :
                            selectedMonthEdit == "December" ? 12 : selectedMonthEdit);

    setTotalDaysEdit(0);
    let currentDate = new Date();
    currentDate.setDate(1);
    currentDate.setMonth(selectedMonthEdit - 1);
    currentDate.setFullYear(event.value);
    let dateString = currentDate.toISOString().split("T")[0];
    setToDateEdit(dateString);
    setSingleMonthSet({
      ...singleDepMonth,
      year: event.value
    })

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
      event.label == "January" ? 1 :
        event.label == "February" ? 2 :
          event.label == "March" ? 3 :
            event.label == "April" ? 4 :
              event.label == "May" ? 5 :
                event.label == "June" ? 6 :
                  event.label == "July" ? 7 :
                    event.label == "August" ? 8 :
                      event.label == "September" ? 9 :
                        event.label == "October" ? 10 :
                          event.label == "November" ? 11 :
                            event.label == "December" && 12);

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
      setPopupContentMalert("Select  Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else {
      setSelectedDate(event.target.value);
      updateTotalDays(event.target.value, toDate);
      setToDate("")
    }
  };

  const handleFromDateChangeEdit = (event) => {
    if (selectedYearEdit.length === 0) {
      setPopupContentMalert("Select  Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else {
      setSelectedDateEdit(event.target.value);
      updateTotalDaysEdit(event.target.value, toDateEdit);
      setToDateEdit("")

    }
  };

  const handleToDateChange = (event) => {
    if (selectedYear.length === 0) {
      setPopupContentMalert("Select Year and  Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


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
    }
  };

  const handleToDateChangeEdit = (event) => {
    if (selectedYearEdit.length === 0) {
      setPopupContentMalert("Select Year and  Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


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
    const dateToDater = document.getElementById("todateEdit");

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

  const [filterdata, setFilterdata] = useState(false)

  useEffect(() => {
    if (filterdata) {
      fetchDepartmentSetForSearch();
    }
  }, [page, pageSize, searchQuery])

  const handlecleared = (e) => {
    e.preventDefault();
    setSearchQuery("")
    setFilterdata(false);
    setPageSize(10)
    setPage(1)
    setTotalDatas(0)
    setTotalPages(0)
    setFilteredRowData([])
    setAllDepartmentSet([])
    setAllDepartmentSetAllData([])
    setselectedDepartmentOptionsEdit([])
    setValueDepartmentAdd([])
    setselectedYearOptionsEdit([])
    setValueYearAdd([])
    setselectedMonthOptionsEdit([])
    setValueMonthAdd([])
    setFilteredChanges(null)
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };


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
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.DEPMONTHSET_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSingleMonthSet(res?.data?.sdepartmentdetails);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Alert delete popup
  let holidayid = singleDepMonth._id;

  const delHoliday = async (holidayid) => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.DEPMONTHSET_SINGLE}/${holidayid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchDepartmentSetForSearch();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delDeptmentcheckbox = async () => {
    setPageName(!pageName)
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
      setIsHandleChange(false)

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchDepartmentSetForSearch();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //add function
  const sendRequest = async () => {
    let monthname = "";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (selectedMonth >= 1 && selectedMonth <= 12) {
      monthname = monthNames[selectedMonth - 1];
    }
    setPageName(!pageName)
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

      // await fetchDepartmentSetForSearch();
      setDepartmentSet({ ...departmentset, salary: false, proftaxstop: false, penalty: false, esistop: false, pfstop: false });
      setSelectedYear("Select Year");
      setSelectedDate("");
      setToDate("");
      setTotalDays("");
      updateDateValue("", "");
      setSelectMonthName("Select Month");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    let monthname = "";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (selectedMonth >= 1 && selectedMonth <= 12) {
      monthname = monthNames[selectedMonth - 1];
    }

    const IsNameExist = allDataDup?.some((item) =>
      item?.department?.toLowerCase() === departmentset.department?.toLowerCase() &&
      item?.year === selectedYear?.toString() &&
      item?.monthname?.toLowerCase() === monthname?.toLowerCase() &&
      item?.fromdate === selectedDate &&
      item?.todate === toDate &&
      item?.totaldays === totalDays?.toString()
    )


    if (departmentset.department === "Select Department") {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (selectedYear === "Select Year") {
      setPopupContentMalert("Please Select Year");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (selectmonthname === "Select Month") {
      setPopupContentMalert("Please Select Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();


    } else if (selectedDate === "") {
      setPopupContentMalert("Please Select From Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (toDate === "") {
      setPopupContentMalert("Please Select to Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (totalDays === null || totalDays === 0) {
      setPopupContentMalert("Please select to date greater than from date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (IsNameExist) {
      setPopupContentMalert("Data Already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
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
    setSearchQuery("")
    fetchDepartmentSetForSearch();
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();

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

  const [editDuplicate, setEditDuplicate] = useState([])

  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName)
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
      setEditDuplicate(allDataDup?.filter((item) => item?._id !== e))
      updateDateValueEdit(res?.data?.sdepartmentdetails?.year,
        res?.data?.sdepartmentdetails?.monthname == "January" ? "1" :
          res?.data?.sdepartmentdetails?.monthname == "February" ? "2" :
            res?.data?.sdepartmentdetails?.monthname == "March" ? "3" :
              res?.data?.sdepartmentdetails?.monthname == "April" ? "4" :
                res?.data?.sdepartmentdetails?.monthname == "May" ? "5" :
                  res?.data?.sdepartmentdetails?.monthname == "June" ? "6" :
                    res?.data?.sdepartmentdetails?.monthname == "July" ? "7" :
                      res?.data?.sdepartmentdetails?.monthname == "August" ? "8" :
                        res?.data?.sdepartmentdetails?.monthname == "September" ? "9" :
                          res?.data?.sdepartmentdetails?.monthname == "October" ? "10" :
                            res?.data?.sdepartmentdetails?.monthname == "November" ? "11" :
                              res?.data?.sdepartmentdetails?.monthname == "December" ? "12" : res?.data?.sdepartmentdetails?.monthname)

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.DEPMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleMonthSet(res?.data?.sdepartmentdetails);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.DEPMONTHSET_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleMonthSet(res?.data?.sdepartmentdetails);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // updateby edit page...
  let updateby = singleDepMonth.updatedby;
  let addedby = singleDepMonth.addedby;
  let holidayId = singleDepMonth._id;

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
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
      await fetchDepartmentSetForSearch();
      handleCloseModEdit();
      setIsOpen(false)
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const editSubmit = (e) => {
    e.preventDefault();

    let monthname = "";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (selectedMonthEdit >= 1 && selectedMonthEdit <= 12) {
      monthname = monthNames[selectedMonthEdit - 1];
    }

    const IsNameExist = editDuplicate?.some((item) =>
      item?.department?.toLowerCase() === singleDepMonth.department?.toLowerCase() &&
      item?.year === selectedYearEdit?.toString() &&
      item?.monthname?.toLowerCase() === monthname?.toLowerCase() &&
      item?.fromdate === selectedDateEdit &&
      item?.todate === toDateEdit &&
      item?.totaldays === totalDaysEdit?.toString()
    )

    if (singleDepMonth.department === "Select Department" || "") {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedYearEdit === "") {
      setPopupContentMalert("Please Select Year");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedMonthEdit === "") {
      setPopupContentMalert("Please Select Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedDateEdit === "") {
      setPopupContentMalert("Please Select From Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (toDateEdit === "") {
      setPopupContentMalert("Please Select to Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (totalDaysEdit === null || totalDaysEdit === 0) {
      setPopupContentMalert("Please select to date greater than from date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    } else if (IsNameExist) {
      setPopupContentMalert("Data Already Exist");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };
  const [isDept, setIsDept] = useState(false);

  const [AllDepartmentSetAllData, setAllDepartmentSetAllData] = useState([])

  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);
  //get all data.

  const handleFilter = (e) => {
    e.preventDefault();

    if (selectedDepartmentvalue.length === 0 && selectedYearvalue.length === 0 && selectedMonthvalue.length === 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchDepartmentSetForFilter()
      fetchDepartmentSetForFilterExports()
    }
  }
  const fetchDepartmentSetForFilter = async () => {
    setPageName(!pageName)
    setIsDept(true)

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery,
      department: valueDepartmentAdd,
      year: valueYearAdd,
      monthname: valueMonthAdd,
    };

    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }
    try {
      let res_status = await axios.post(SERVICE.GETDEPARTMENTMONTHSETBYPAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });

      const ans = res_status?.data?.departmentdetails?.length > 0 ? res_status?.data?.departmentdetails : []

      setAllDataDup(res_status?.data?.totalDatasWithAll?.length > 0 ? res_status?.data?.totalDatasWithAll : [])

      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalDatas : 0);


      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);

      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

      setAllDepartmentSet(ans);
      setStatusCheck(true);
      setIsDept(false)
    } catch (err) {
      setStatusCheck(true);
      setIsDept(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchDepartmentSetForFilterExports = async () => {
    setPageName(!pageName)

    const queryParams = {
      department: valueDepartmentAdd,
      year: valueYearAdd,
      monthname: valueMonthAdd,
    };

    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }
    try {
      let res_status = await axios.post(SERVICE.GETDEPARTMENTMONTHSETBYPAGINATION_EXPORTS, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });

      const ans = res_status?.data?.departmentdetails?.length > 0 ? res_status?.data?.departmentdetails : []
      setAllDepartmentSetAllData(ans);
      console.log(ans);

    } catch (err) {
      setStatusCheck(true);
      setIsDept(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [anchorElSearch, setAnchorElSearch] = React.useState(null);
  const handleClickSearch = (event) => {
    setAnchorElSearch(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
    setSearchQuery("");
  };

  const openSearch = Boolean(anchorElSearch);
  const idSearch = openSearch ? 'simple-popover' : undefined;

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


  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };

  const fetchDepartmentSetForSearch = async () => {
    setIsDept(true)

    setPageName(!pageName)
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery,
      department: valueDepartmentAdd,
      year: valueYearAdd,
      monthname: valueMonthAdd,
    };

    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];

    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;
    }
    try {
      let res_status = await axios.post(SERVICE.GETDEPARTMENTMONTHSETBYPAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });

      console.log(res_status?.data, " res_status?.data")

      const ans = res_status?.data?.departmentdetails?.length > 0 ? res_status?.data?.departmentdetails : []
      console.log(ans, "ans")
      setAllDepartmentSet(ans);
      setItems(ans);
      setAllDataDup(res_status?.data?.totalDatasWithAll?.length > 0 ? res_status?.data?.totalDatasWithAll : [])

      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalDatas : 0);


      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);

      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });


      setStatusCheck(true);
      setIsDept(false)
    } catch (err) {
      setStatusCheck(true);
      setIsDept(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleResetSearch = async () => {
    setPageName(!pageName)
    setIsDept(true)

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
      searchQuery: searchQuery,
      department: valueDepartmentAdd,
      year: valueYearAdd,
      monthname: valueMonthAdd,
    };

    const allFilters = [];
    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }


    try {
      let res_status = await axios.post(SERVICE.GETDEPARTMENTMONTHSETBYPAGINATION, queryParams, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

      });


      const ans = res_status?.data?.departmentdetails?.length > 0 ? res_status?.data?.departmentdetails : []

      setAllDataDup(res_status?.data?.totalDatasWithAll?.length > 0 ? res_status?.data?.totalDatasWithAll : [])

      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalDatas : 0);


      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);

      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

      setAllDepartmentSet(ans);

      setStatusCheck(true);
      setIsDept(false)
    } catch (err) {
      setStatusCheck(true);
      setIsDept(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(alldepartmentSet);
  }, [alldepartmentSet]);

  //get all data.
  const fetchDepartmentNames = async () => {
    setPageName(!pageName)
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
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchDepartmentNames();
  }, []);


  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Department Month Set.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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
    setPageName(!pageName)
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
      pagename: String("Department Month Set"),
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

  const handleExportXL = async (isfilter) => {
    setIsFilterOpen(false);
    setLoading(true);
    setLoadingMessage('Fetching data...');

    let overallDatas;

    if (isfilter !== "filtered") {
      setPageName(!pageName)
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
      } catch (err) { setLoading(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
      setPageName(!pageName)
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
      } catch (err) { setLoading(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    fetchDepartmentSetForSearch();
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
  const filteredDatas = items
  // ?.filter((item) => {
  //   return searchOverAllTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  // });


  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
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
      pinned: 'left',
    },
    { field: "department", headerName: "Department", flex: 0, width: 140, hide: !columnVisibility.department, headerClassName: "bold-header", pinned: 'left', },
    { field: "year", headerName: "Year", flex: 0, width: 90, hide: !columnVisibility.year, headerClassName: "bold-header", pinned: 'left', },
    { field: "month", headerName: "Month", flex: 0, width: 100, hide: !columnVisibility.month, headerClassName: "bold-header" },
    { field: "fromdate", headerName: "Fromdate", flex: 0, width: 120, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
    { field: "todate", headerName: "Todate", flex: 0, width: 120, hide: !columnVisibility.todate, headerClassName: "bold-header" },
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
      width: 290,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("edepartmentmonthset") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
                handleClickOpenEdit();

              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ddepartmentmonthset") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vdepartmentmonthset") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("idepartmentmonthset") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");
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
      <PageHeading
        title="Department Month Set"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="HR Setup"
        subpagename="Department Month Set"
        subsubpagename=""
      />

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
                  <Selects options={years}
                    value={{ label: selectedYear, value: selectedYear }}
                    onChange={
                      (e) => {
                        handleYearChange(e)
                        setSelectedDate("")
                        setToDate("")
                        setSelectMonthName("Select Month")
                        setTotalDays("")
                      }} />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={selectedYear === "Select Year" ? [] : months}
                    value={{ label: selectmonthname, value: selectmonthname }}
                    onChange={
                      (e) => {
                        handleMonthChange(e)
                        setSelectedDate("")
                        setToDate("")
                        setTotalDays("")
                      }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    From Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={selectedDate}
                    type="date"
                    onChange={(e) => {
                      handleFromDateChange(e)
                      setTotalDays("")

                    }} id="datefrom"
                    onKeyDown={(e) => e.preventDefault()}

                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    To Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput value={toDate} type="date"
                    onChange={handleToDateChange} id="todate" onKeyDown={(e) => e.preventDefault()}
                  />
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
              <Grid item md={4} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={3} xs={12} sm={6}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={buttonStyles.buttonsubmit}>
                      Submit
                    </Button>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}></Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        </Box>

      )}
      <br />
      {isUserRoleCompare?.includes("adepartmentmonthset") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Department Month Set Filter</Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Department <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    maxMenuHeight={300}
                    options={departmentNames}
                    value={selectedDepartmentvalue}
                    valueRenderer={customValueRendererDepartmentAdd}
                    onChange={handleDepartmentChangeAdd}
                  />

                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Year
                  </Typography>
                  <MultiSelect
                    maxMenuHeight={300}
                    options={years}
                    value={selectedYearvalue}
                    valueRenderer={customValueRendererYearAdd}
                    onChange={handleYearChangeAdd}
                  />

                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month
                  </Typography>
                  <MultiSelect
                    maxMenuHeight={300}
                    options={valueYearAdd?.length === 0 ? [] : months}
                    value={selectedMonthvalue}
                    valueRenderer={customValueRendererMonthAdd}
                    onChange={handleMonthChangeAdd}
                  />
                </FormControl>
              </Grid>


              <Grid item md={3} sm={12} xs={12}>
                <Typography>
                  &nbsp;
                </Typography>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",

                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      handleFilter(e)
                      setFilterdata(true)
                    }}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Filter
                  </Button>
                  <Button sx={buttonStyles.btncancel}
                    onClick={handlecleared}
                  >
                    Clear
                  </Button>
                </Grid>
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
                    <MenuItem value={totalDatas}>All</MenuItem>
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bddepartmentmonthset") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                Bulk Delete
              </Button>)}
            <br />
            <br />
            {isDept ?
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
              :
              <>
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
                  totalDatas={totalDatas}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={AllDepartmentSetAllData}
                />

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
                                fetchDepartmentSetForSearch();
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
              </>
            }
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
              <Button variant="contained" onClick={handleCloseinfo} sx={buttonStyles.btncancel}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Salary</Typography>
                  <Typography>{singleDepMonth.salary === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Prof-Tax-Stop</Typography>
                  <Typography>{singleDepMonth.proftaxstop === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Penalty</Typography>
                  <Typography>{singleDepMonth.penalty === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">ESI-Stop</Typography>
                  <Typography>{singleDepMonth.esistop === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">PF-Stop</Typography>
                  <Typography>{singleDepMonth.pfstop === true ? "YES" : "NO"}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container>
              <Grid item md={3} xs={12} sm={6}>
                <Button variant="contained" onClick={handleCloseview} sx={buttonStyles.btncancel}>
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
        <Dialog open={isEditOpen} onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md" fullWidth={true}
          sx={{
            overflow: 'visible',
            '& .MuiPaper-root': {
              overflow: 'visible',
            },
          }}>
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
                    <Selects options={years}
                      placeholder={singleDepMonth.year}
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
                    <Selects options={months}
                      placeholder={singleDepMonth.monthname}
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
                    <OutlinedInput value={selectedDateEdit}
                      type="date"
                      onChange={(e) => {
                        handleFromDateChangeEdit(e)
                        setTotalDaysEdit(0);
                      }}
                      id="datefromEdit"
                      onKeyDown={(e) => e.preventDefault()} />

                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      To Date <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput value={toDateEdit}
                      type="date"
                      onChange={handleToDateChangeEdit}
                      id="todateEdit"
                      onKeyDown={(e) => e.preventDefault()} />
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
                  <Button variant="contained" color="primary" onClick={editSubmit} sx={buttonStyles.buttonsubmit}>
                    Update
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
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

      <Loader loading={loading} message={loadingMessage} />
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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={AllDepartmentSetAllData ?? []}
        filename={"Department Month Set"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box >
  );
}

export default DepartmentMonthSet;