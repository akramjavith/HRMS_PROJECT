import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaSearch, FaEdit, FaPrint, FaFilePdf } from "react-icons/fa";
import { Box, Typography, Chip, OutlinedInput, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Button, Popover, TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import moment from "moment";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import AdvancedSearchBar from '../../../components/SearchbarEbList.js';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function AttendanceIndividualStatus() {

  const gridRefTableAttTeam = useRef(null);
  const gridRefImageAttTeam = useRef(null);

  const [hoursOptionconvert, setHoursOptionsConvert] = useState([]);
  const [hoursOptionconvertclockout, setHoursOptionsConvertClockout] = useState([]);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  var newtoday = dd + "/" + mm + "/" + yyyy;

  const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);

  const { auth } = useContext(AuthContext);

  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);
  const [userShifts, setUserShifts] = useState([]);
  const [items, setItems] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [loader, setLoader] = useState(true);
  const [attClockInEdit, setAttClockInEdit] = useState({ username: "", empcode: "", date: "", clockin: "", timeperiod: "", });
  const [isReadClockIn, setIsReadClockIn] = useState(false);
  const [getAttIdClockIn, setGetAttIdClockIn] = useState("");
  const [attClockOutEdit, setAttClockOutEdit] = useState({ username: "", empcode: "", date: "", clockout: "", timeperiod: "", });
  const [isReadClockOut, setIsReadClockOut] = useState(false);
  const [getAttIdClockOut, setGetAttIdClockOut] = useState("");
  const [attStatusOption, setAttStatusOption] = useState([]);

  const [dateOptions, setDateOptions] = useState([]);
  const [hoursOption, setHoursOptions] = useState([]);
  const [allHoursOption, setAallHoursOptions] = useState([]);
  const [removeHide, setRemoveHide] = useState(true);
  const [hoursOptionsNew, setHoursOptionsNew] = useState([]);
  const [minsOptionsNew, setMinsOptionsNew] = useState([]);

  const [hoursOptionsOut, setHoursOptionsOut] = useState([]);
  const [minsOptionsOut, setMinsOptionsOut] = useState([]);

  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState(userShifts);
  const [filteredRowData, setFilteredRowData] = useState([]);

  // Datatable
  const [pageAttTeam, setPageAttTeam] = useState(1);
  const [pageSizeAttTeam, setPageSizeAttTeam] = useState(10);
  const [searchQueryAttTeam, setSearchQueryAttTeam] = useState("");
  const [totalPagesAttTeam, setTotalPagesAttTeam] = useState("");

  const [attSeetings, setAttSettings] = useState({});

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => { setIsErrorOpen(false); };

  // Exports
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // pageAttTeam refersh reload
  const handleCloseFilterMod = () => { setIsFilterOpen(false); };
  const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
  const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => { setOpenPopup(true); };
  const handleClosePopup = () => { setOpenPopup(false); }

  // Edit model Clock In
  const [openEditClkIn, setOpenEditClkIn] = useState(false);
  const handleClickOpenEditClkIn = () => { setOpenEditClkIn(true); };
  const handleCloseEditClkIn = () => {
    setOpenEditClkIn(false);
    setAttClockInEdit({
      shiftendtime: "",
      shiftname: "",
      shift: "",
      clinhour: "00",
      clinseconds: "00",
      clinminute: "00",
      username: "",
      empcode: "",
      date: "",
      clockin: "",
      timeperiod: "",
    });
    setIsReadClockIn(false);
    setGetAttIdClockIn("");
  };

  // Edit model Clock Out
  const [openEditClkOut, setOpenEditClkOut] = useState(false);
  const handleClickOpenEditClkOut = () => { setOpenEditClkOut(true); };
  const handleCloseEditClkOut = () => {
    setOpenEditClkOut(false);
    setAttClockOutEdit({
      shiftendtime: "",
      shiftname: "",
      shift: "",
      clouthour: "00",
      cloutseconds: "00",
      cloutminute: "00",
      username: "",
      empcode: "",
      date: "",
      clockout: "",
      timeperiod: "",
    });
    setIsReadClockOut(false);
  };

  //Delete model
  const [removeId, setRemoveId] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleCloseMod = () => { setIsDeleteOpen(false); };

  const [isOutDeleteOpen, setIsOutDeleteOpen] = useState(false);
  const handleOutClickOpen = () => { setIsOutDeleteOpen(true); };
  const handleOutCloseMod = () => { setIsOutDeleteOpen(false); };

  let hoursOptions = [];

  const modeDropDowns = [
    { label: "My Hierarchy List", value: "My Hierarchy List" },
    { label: "All Hierarchy List", value: "All Hierarchy List" },
    { label: "My + All Hierarchy List", value: "My + All Hierarchy List" },
  ];
  const sectorDropDowns = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
    { label: "All", value: "all" },
  ];

  const timeoptions = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];

  const minutssecOptions = [
    { value: "00", label: "00" },
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
    { value: "25", label: "25" },
    { value: "26", label: "26" },
    { value: "27", label: "27" },
    { value: "28", label: "28" },
    { value: "29", label: "29" },
    { value: "30", label: "30" },
    { value: "31", label: "31" },
    { value: "32", label: "32" },
    { value: "33", label: "33" },
    { value: "34", label: "34" },
    { value: "35", label: "35" },
    { value: "36", label: "36" },
    { value: "37", label: "37" },
    { value: "38", label: "38" },
    { value: "39", label: "39" },
    { value: "40", label: "40" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
    { value: "45", label: "45" },
    { value: "46", label: "46" },
    { value: "47", label: "47" },
    { value: "48", label: "48" },
    { value: "49", label: "49" },
    { value: "50", label: "50" },
    { value: "51", label: "51" },
    { value: "52", label: "52" },
    { value: "53", label: "53" },
    { value: "54", label: "54" },
    { value: "55", label: "55" },
    { value: "56", label: "56" },
    { value: "57", label: "57" },
    { value: "58", label: "58" },
    { value: "59", label: "59" },
  ];

  const hrsOptions = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
    { value: "05", label: "05" },
    { value: "06", label: "06" },
    { value: "07", label: "07" },
    { value: "08", label: "08" },
    { value: "09", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];

  const [selectedMode, setSelectedMode] = useState("Today");
  const mode = [
    { label: "Today", value: "Today" },
    // { label: "Tomorrow", value: "Tomorrow" },
    { label: "Yesterday", value: "Yesterday" },
    // { label: "This Week", value: "This Week" },
    // { label: "This Month", value: "This Month" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Custom", value: "Custom" }
  ]

  // pageAttTeam refersh reload
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

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
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

  // Search bar
  const [anchorElSearchAttTeam, setAnchorElSearchAttTeam] = React.useState(null);
  const handleClickSearchAttTeam = (event) => {
    setAnchorElSearchAttTeam(event.currentTarget);
  };
  const handleCloseSearchAttTeam = () => {
    setAnchorElSearchAttTeam(null);
    setSearchQueryAttTeam("");
  };

  const openSearchAttTeam = Boolean(anchorElSearchAttTeam);
  const idSearchAttTeam = openSearchAttTeam ? 'simple-popover' : undefined;

  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Human Resources" &&
        data.submodulename === "HR" &&
        data.mainpagename === "Attendance" &&
        data.subpagename === "Attendance Individual" &&
        data.subsubpagename === "Team Attendance Status"
    )?.listpageaccessmode || "Overall";

  const [filterUser, setFilterUser] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    mode: "My Hierarchy List",
    level: "Primary",
    fromdate: today,
    todate: today,
    listpageaccessmode: listpageaccessby,
  });

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  }

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    // checkbox: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    department: true,
    empcode: true,
    username: true,
    mode: true,
    level: true,
    ipaddress: true,
    shift: true,
    leavestatus: true,
    permissionstatus: true,
    clockin: true,
    clockout: true,
    clockinstatus: true,
    clockoutstatus: true,
    date: true,
    bookby: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Team Attendance Status"),
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

  const getDateRange = (mode) => {
    const today = new Date();
    let fromdate, todate;

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    switch (mode) {
      case "Today":
        fromdate = todate = formatDate(today);
        break;
      // case "Tomorrow":
      //     const tomorrow = new Date(today);
      //     tomorrow.setDate(today.getDate() + 1);
      //     fromdate = todate = formatDate(tomorrow);
      //     break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        fromdate = todate = formatDate(yesterday);
        break;
      // case "This Week":
      //     const startOfThisWeek = new Date(today);
      //     startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
      //     const endOfThisWeek = new Date(startOfThisWeek);
      //     endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
      //     fromdate = formatDate(startOfThisWeek);
      //     todate = formatDate(endOfThisWeek);
      //     break;
      // case "This Month":
      //     fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
      //     todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
      //     break;
      case "Last Week":
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        fromdate = formatDate(startOfLastWeek);
        todate = formatDate(endOfLastWeek);
        break;
      case "Last Month":
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
        todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
        break;
      default:
        fromdate = todate = "";
    }

    return { fromdate, todate };
  };

  const formatDateForInput = (date) => {
    if (isNaN(date.getTime())) {
      return ''; // Return empty if the date is invalid
    }
    return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
  };

  //get all Sub vendormasters.
  const fetchAttedanceStatus = async () => {


    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttStatus(res_vendor?.data?.attendancestatus);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchAttedanceStatus();
  }, []);

  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
    })
    return result[0]?.name
  }

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.paidleave === true ? 'Yes' : 'No';
  }

  const getAttModePaidPresentType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.paidleavetype;
  }

  const getFinalPaid = (rowpaid, rowpaidtype) => {
    return (rowpaidtype === undefined || rowpaidtype === "") ? rowpaid : (rowpaid + ' - ' + rowpaidtype);
  }

  const [runTime, setRunTime] = useState(0);
  useEffect(() => {
    if (runTime !== 0) {
      fetchTimeDropDown();
    }
  }, [attClockInEdit.timeperiod, attClockInEdit.clinhour]);
  const [runTimeOut, setRunTimeOut] = useState(0);
  useEffect(() => {
    if (runTimeOut !== 0) {
      fetchTimeDropDownOut();
    }
  }, [attClockOutEdit.timeperiod, attClockOutEdit.clouthour]);

  const fetchTimeDropDownOut = async () => {
    try {
      let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA);
      let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;

      const parseTime = (timeString) => {
        const [time, period] = timeString?.trim().split("to");

        let fromTimeMeridian = time?.slice(-2);
        let toTimeMeridian = period?.slice(-2);
        const [fromTimeHrs, fromTimeMins] = time?.slice(0, -2).split(":");
        const [toTimeHrs, toTimeMins] = period?.slice(0, -2).split(":");
        return {
          fromTimeHrs,
          fromTimeMins,
          toTimeHrs,
          toTimeMins,
          fromTimeMeridian,
          toTimeMeridian,
        };
      };

      if (attClockOutEdit?.shift && attClockOutEdit?.shift != "") {
        let timings = parseTime(attClockOutEdit?.shift);

        if (
          dataFromControlPanel[0]?.clockout &&
          dataFromControlPanel[0]?.clockout != ""
        ) {
          let exactHours =
            Number(timings?.toTimeHrs) +
            Number(dataFromControlPanel[0]?.clockout);
          if (exactHours > 12) {
            exactHours = exactHours - 12;
            let filteredData = hrsOptions
              .filter((data) => {
                return Number(data.value) <= exactHours;
              })
              .filter((item) => item.value != 12);
            if (timings.toTimeMeridian != attClockOutEdit.timeperiod) {
              let filteredData2 = hrsOptions
                .filter((data) => {
                  return Number(data.value) >= Number(timings?.fromTimeHrs);
                })
                .filter((item) => item.value != 12);
              setHoursOptionsOut([...filteredData, ...filteredData2]);
            } else {
              setHoursOptionsOut(hrsOptions);
            }
            let filtMins = minutssecOptions.filter((data) => {
              return Number(data.value) <= Number(timings?.toTimeMins);
            });

            if (attClockOutEdit.clouthour == exactHours) {
              setMinsOptionsOut(filtMins);
            } else {
              setMinsOptionsOut(minutssecOptions);
            }
          } else if (exactHours < 12) {
            exactHours = exactHours;
            let filteredData = hrsOptions.filter((data) => {
              return Number(data.value) <= exactHours;
            });
            if (
              timings?.toTimeMeridian == "AM" &&
              attClockOutEdit?.timeperiod == "AM"
            ) {
              setHoursOptionsOut([
                { value: "12", label: "12" },
                ...filteredData,
              ]);
            } else if (
              timings?.toTimeMeridian == "PM" &&
              attClockOutEdit?.timeperiod == "PM"
            ) {
              setHoursOptionsOut([
                { value: "12", label: "12" },
                ...filteredData,
              ]);
            } else {
              let filteredData1 = hrsOptions
                .filter((data) => {
                  return Number(data.value) >= Number(timings?.fromTimeHrs);
                })
                .filter((item) => item.value != 12);
              setHoursOptionsOut([...filteredData1]);
            }

            let filtMins = minutssecOptions.filter((data) => {
              return Number(data.value) <= Number(timings?.toTimeMins);
            });

            if (attClockOutEdit.clouthour == exactHours) {
              setMinsOptionsOut(filtMins);
            } else {
              setMinsOptionsOut(minutssecOptions);
            }
          } else {
            exactHours = 12;
            if (timings.toTimeMeridian != attClockOutEdit.timeperiod) {
              let filteredData2 = hrsOptions
                .filter((data) => {
                  return Number(data.value) >= Number(timings?.fromTimeHrs);
                })
                .filter((item) => item.value != 12);
              setHoursOptionsOut([
                ...filteredData2,
                { value: "12", label: "12" },
              ]);
              let filtMins = minutssecOptions.filter((data) => {
                return Number(data.value) <= Number(timings?.toTimeMins);
              });

              if (attClockOutEdit?.clouthour == exactHours) {
                setMinsOptionsOut(filtMins);
              } else {
                setMinsOptionsOut(minutssecOptions);
              }
            } else {
              setHoursOptionsOut(hrsOptions);

              setMinsOptionsNew(minutssecOptions);
            }
          }
        } else {
          let timings = parseTime(attClockInEdit?.shift);

          let filteredData = hrsOptions
            .filter((data) => {
              return Number(data.value) <= Number(timings?.toTimeHrs);
            })
            .filter((item) => item.value != 12);
          if (
            timings?.toTimeMeridian == "AM" &&
            attClockOutEdit?.timeperiod == "AM"
          ) {
            setHoursOptionsOut(filteredData);
          } else if (
            timings?.toTimeMeridian == "PM" &&
            attClockOutEdit?.timeperiod == "PM"
          ) {
            setHoursOptionsOut(filteredData);
          } else {
            let filteredData1 = hrsOptions.filter((data) => {
              return Number(data.value) >= Number(timings?.fromTimeHrs);
            });
            setHoursOptionsOut([
              { value: "12", label: "12" },
              ...filteredData1,
            ]);
          }

          let filtMins = minutssecOptions.filter((data) => {
            return Number(data.value) <= Number(timings?.toTimeMins);
          });

          if (attClockOutEdit.clouthour == timings?.toTimeHrs) {
            setMinsOptionsOut(filtMins);
          } else {
            setMinsOptionsOut(minutssecOptions);
          }
        }
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchTimeDropDown = async () => {
    try {
      let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA);
      let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;

      const parseTime = (timeString) => {
        const [time, period] = timeString?.trim().split("to");

        let fromTimeMeridian = time?.slice(-2);
        let toTimeMeridian = period?.slice(-2);
        const [fromTimeHrs, fromTimeMins] = time?.slice(0, -2).split(":");
        const [toTimeHrs, toTimeMins] = period?.slice(0, -2).split(":");
        return {
          fromTimeHrs,
          fromTimeMins,
          toTimeHrs,
          toTimeMins,
          fromTimeMeridian,
          toTimeMeridian,
        };
      };

      if (attClockInEdit?.shift && attClockInEdit?.shift != "") {
        let timings = parseTime(attClockInEdit?.shift);

        if (
          dataFromControlPanel[0]?.clockin &&
          dataFromControlPanel[0]?.clockin != ""
        ) {
          let exactHours =
            Number(timings?.fromTimeHrs) -
            Number(dataFromControlPanel[0]?.clockin);
          if (exactHours < 0) {
            exactHours = 12 + exactHours;

            let filteredData = hrsOptions
              .filter((data) => {
                return Number(data.value) >= exactHours;
              })
              .filter((item) => item.value != 12);
            if (timings.fromTimeMeridian != attClockInEdit.timeperiod) {
              let filteredData2 = hrsOptions
                .filter((data) => {
                  return Number(data.value) <= Number(timings?.toTimeHrs);
                })
                .filter((item) => item.value != 12);
              setHoursOptionsNew([
                ...filteredData,
                { value: "12", label: "12" },
                ...filteredData2,
              ]);
            } else {
              setHoursOptionsNew(hrsOptions);
            }
            let filtMins = minutssecOptions.filter((data) => {
              return Number(data.value) >= Number(timings?.fromTimeMins);
            });
            if (attClockInEdit?.clinhour == exactHours) {
              setMinsOptionsNew(filtMins);
            } else {
              setMinsOptionsNew(minutssecOptions);
            }
          } else if (exactHours > 0) {
            exactHours = exactHours;
            let filteredData = hrsOptions
              .filter((data) => {
                return Number(data.value) >= exactHours;
              })
              .filter((item) => item.value != 12);
            if (
              timings?.fromTimeMeridian == "AM" &&
              attClockInEdit?.timeperiod == "AM"
            ) {
              setHoursOptionsNew(filteredData);
            } else if (
              timings?.fromTimeMeridian == "PM" &&
              attClockInEdit?.timeperiod == "PM"
            ) {
              setHoursOptionsNew(filteredData);
            } else {
              let filteredData1 = hrsOptions.filter((data) => {
                return Number(data.value) <= Number(timings?.toTimeHrs);
              });
              setHoursOptionsNew([
                { value: "12", label: "12" },
                ...filteredData1,
              ]);
            }

            let filtMins = minutssecOptions.filter((data) => {
              return Number(data.value) >= Number(timings?.fromTimeMins);
            });

            if (attClockInEdit?.clinhour == exactHours) {
              setMinsOptionsNew(filtMins);
            } else {
              setMinsOptionsNew(minutssecOptions);
            }
          } else {
            exactHours = 12;

            if (timings.fromTimeMeridian != attClockInEdit.timeperiod) {
              let filteredData2 = hrsOptions
                .filter((data) => {
                  return Number(data.value) <= Number(timings?.toTimeHrs);
                })
                .filter((item) => item.value != 12);
              setHoursOptionsNew([
                { value: "12", label: "12" },
                ...filteredData2,
              ]);
              let filtMins = minutssecOptions.filter((data) => {
                return Number(data.value) >= Number(timings?.fromTimeMins);
              });

              if (attClockInEdit?.clinhour == exactHours) {
                setMinsOptionsNew(filtMins);
              } else {
                setMinsOptionsNew(minutssecOptions);
              }
            } else {
              setHoursOptionsNew(hrsOptions);
              let filtMins = minutssecOptions.filter((data) => {
                return Number(data.value) >= Number(timings?.fromTimeMins);
              });

              if (attClockInEdit?.clinhour == exactHours) {
                setMinsOptionsNew(filtMins);
              } else {
                setMinsOptionsNew(minutssecOptions);
              }
            }
          }
        } else {
          let timings = parseTime(attClockInEdit?.shift);

          let filteredData = hrsOptions
            .filter((data) => {
              return Number(data.value) >= Number(timings?.fromTimeHrs);
            })
            .filter((item) => item.value != 12);
          if (
            timings?.fromTimeMeridian == "AM" &&
            attClockInEdit?.timeperiod == "AM"
          ) {
            setHoursOptionsNew(filteredData);
          } else if (
            timings?.fromTimeMeridian == "PM" &&
            attClockInEdit?.timeperiod == "PM"
          ) {
            setHoursOptionsNew(filteredData);
          } else {
            let filteredData1 = hrsOptions.filter((data) => {
              return Number(data.value) <= Number(timings?.toTimeHrs);
            });
            setHoursOptionsNew([
              { value: "12", label: "12" },
              ...filteredData1,
            ]);
          }

          let filtMins = minutssecOptions.filter((data) => {
            return Number(data.value) >= Number(timings?.fromTimeMins);
          });

          if (attClockInEdit?.clinhour == attClockInEdit?.clinhour) {
            setMinsOptionsNew(filtMins);
          } else {
            setMinsOptionsNew(minutssecOptions);
          }
        }
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  useEffect(() => {
    fetchOverAllSettings();
  }, []);

  // get week for month's start to end
  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }

  const fetchAttMode = async () => {
    setPageName(!pageName)
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttModearr(res_freq?.data?.allattmodestatus);
      let result = res_freq?.data?.allattmodestatus.filter((data, index) => {
        return data.appliedthrough != "Auto";
      });

      setAttStatusOption(result.map((d) => d.name));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchAttMode();
  }, []);

  function getMonthsInRange(fromdate, todate) {
    const startDate = new Date(fromdate);
    const endDate = new Date(todate);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const result = [];

    // Previous month based on `fromdate`
    const prevMonth = startDate.getMonth() === 0 ? 11 : startDate.getMonth() - 1;
    const prevYear = startDate.getMonth() === 0 ? startDate.getFullYear() - 1 : startDate.getFullYear();
    result.push({ month: monthNames[prevMonth], year: prevYear.toString() });

    // Add selected months between `fromdate` and `todate`
    const currentDate = new Date(startDate);
    currentDate.setDate(1); // Normalize to the start of the month
    while (
      currentDate.getFullYear() < endDate.getFullYear() ||
      (currentDate.getFullYear() === endDate.getFullYear() && currentDate.getMonth() <= endDate.getMonth())
    ) {
      result.push({
        month: monthNames[currentDate.getMonth()],
        year: currentDate.getFullYear().toString()
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Next month based on `todate`
    const nextMonth = endDate.getMonth() === 11 ? 0 : endDate.getMonth() + 1;
    const nextYear = endDate.getMonth() === 11 ? endDate.getFullYear() + 1 : endDate.getFullYear();
    result.push({ month: monthNames[nextMonth], year: nextYear.toString() });

    return result;
  }

  const fetchFilteredUsersStatus = async () => {
    setPageName(!pageName)
    setItems([]);
    setLoader(false);
    setPageAttTeam(1);
    setPageSizeAttTeam(10);

    // let startMonthDate = new Date(filterUser.fromdate);
    // let endMonthDate = new Date(filterUser.todate);

    // const daysArray = [];
    // while (startMonthDate <= endMonthDate) {
    //   const formattedDate = `${String(startMonthDate.getDate()).padStart(
    //     2,
    //     "0"
    //   )}/${String(startMonthDate.getMonth() + 1).padStart(
    //     2,
    //     "0"
    //   )}/${startMonthDate.getFullYear()}`;
    //   const dayName = startMonthDate.toLocaleDateString("en-US", {
    //     weekday: "long",
    //   });
    //   const dayCount = startMonthDate.getDate();
    //   const shiftMode = "Main Shift";
    //   const weekNumberInMonth =
    //     getWeekNumberInMonth(startMonthDate) === 1
    //       ? `${getWeekNumberInMonth(startMonthDate)}st Week`
    //       : getWeekNumberInMonth(startMonthDate) === 2
    //         ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
    //         : getWeekNumberInMonth(startMonthDate) === 3
    //           ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
    //           : getWeekNumberInMonth(startMonthDate) > 3
    //             ? `${getWeekNumberInMonth(startMonthDate)}th Week`
    //             : "";

    //   daysArray.push({
    //     formattedDate,
    //     dayName,
    //     dayCount,
    //     shiftMode,
    //     weekNumberInMonth,
    //   });

    //   // Move to the next day
    //   startMonthDate.setDate(startMonthDate.getDate() + 1);
    // }

    const montharray = getMonthsInRange(filterUser.fromdate, filterUser.todate);

    try {
      let res = await axios.post(
        SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_INDVL_HIERARFILTER,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          hierachy: filterUser.mode,
          sector: filterUser.level,
          username: isUserRoleAccess?.companyname,
          team: isUserRoleAccess.team,
          listpageaccessmode: filterUser?.listpageaccessmode,
          pagename: "menuteamattendancestatus",
        }
      );

      let res1 = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let attendanceCriteriaData = res1?.data?.attendancecontrolcriteria[0];

      // console.log(res?.data?.resultedTeam, 'res?.data?.resultedTeam')

      if (res?.data?.resultedTeam?.length > 0 && res?.data?.resultAccessFilter?.length < 1 && ["myallhierarchy", "allhierarchy"]?.includes(filterUser?.mode === "My Hierarchy List"
        ? "myhierarchy"
        : filterUser?.mode === "All Hierarchy List"
          ? "allhierarchy"
          : "myallhierarchy")) {
        alert("Some employees have not been given access to this page.")
      }

      const resultAccessFilters = res?.data?.resultAccessFilter;

      function splitArray(array, chunkSize) {
        const resultarr = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          const chunk = array.slice(i, i + chunkSize);
          resultarr.push({
            data: chunk,
          });
        }
        return resultarr;
      }
      let employeelistnames = resultAccessFilters.length > 0 ? [...new Set(resultAccessFilters.map(item => item.companyname))] : []
      const resultarr = splitArray(employeelistnames, 10);

      async function sendBatchRequest(batch) {
        try {
          let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            employee: batch.data,
          });

          let leaveresult = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype !== 'Leave Without Pay (LWP)');
          let leaveresultWithoutPay = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype === 'Leave Without Pay (LWP)');

          let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER, {
            employee: batch.data,
            fromdate: today,
            todate: today,
            montharray: [...montharray],
          }, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            }
          })

          let res_type = await axios.get(SERVICE.LEAVETYPE, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          });

          let resdatawithlwp = [...res_type?.data?.leavetype, { leavetype: 'Leave Without Pay (LWP)', code: "LWP" }]

          let leavestatusApproved = [];
          resdatawithlwp?.map((type) => {
            res_applyleave?.data?.applyleaves && res_applyleave?.data?.applyleaves?.forEach((d) => {
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Single' && d.leavestatus === 'Shift') {
                leavestatusApproved.push(type.code + ' ' + d.status)
              }
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Double' && d.leavestatus === 'Shift') {
                leavestatusApproved.push('DL' + ' - ' + type.code + ' ' + d.status)
              }
              if (type.leavetype === d.leavetype && d.tookleavecheckstatus === 'Double Day' && d.leavestatus === 'Shift') {
                leavestatusApproved.push('DDL' + ' - ' + type.code + ' ' + d.status)
              }
            });
          });

          const rearr = [...new Set(leavestatusApproved)];

          // console.log(res?.data?.finaluser, 'user shift')
          const filtered = res?.data?.finaluser?.filter(d => {
            const formattedDate = new Date(d.finalDate);
            const reasonDate = new Date(d.reasondate);
            const dojDate = new Date(d.doj);

            if (d.reasondate && d.reasondate !== "") {
              return (formattedDate <= reasonDate);
            } else if (d.doj && d.doj !== "") {
              return (formattedDate >= dojDate);
            } else {
              return d;
            }
          });
          // console.log(filtered, 'filtered')
          let hierarchyres = [];
          resultAccessFilters?.forEach((data) => {
            filtered.forEach((userdata, i) => {
              if (
                userdata.company === data.company &&
                userdata.branch === data.branch &&
                userdata.unit === data.unit &&
                userdata.empcode === data.empcode &&
                userdata.username === data.companyname
              ) {
                const resfinaldata = {
                  ...userdata,
                  level: data.level,
                  control: data.control,
                };
                hierarchyres.push(resfinaldata);
              }
            });
          });
          const hierarchyResult = hierarchyres.filter((item) => item !== null);
          const finalresult = hierarchyResult.filter((data) => {
            return data.shift != "Week Off" && data.shift != "Not Allotted";
          });

          const changedWeekoffResult = finalresult?.map((item, index) => {
            // Adjust clockinstatus based on lateclockincount
            let updatedClockInStatus = item.clockinstatus;
            // Adjust clockoutstatus based on earlyclockoutcount
            let updatedClockOutStatus = item.clockoutstatus;

            // Filter out only 'Absent' items for the current employee
            const absentItems = filtered?.filter(d => d.clockinstatus === 'Absent' && d.clockoutstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00' && item.attendanceautostatus === 'ABSENT');

            // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
            if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
              // Define the date format for comparison
              const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

              const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && absentItem.empcode === item.empcode);

              const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && absentItem.empcode === item.empcode);

              const isPreviousDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
              const isNextDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);

              if (isPreviousDayLeave) {
                updatedClockInStatus = 'BeforeWeekOffLeave';
                updatedClockOutStatus = 'BeforeWeekOffLeave';
              }
              if (isPreviousDayAbsent) {
                updatedClockInStatus = 'BeforeWeekOffAbsent';
                updatedClockOutStatus = 'BeforeWeekOffAbsent';
              }
              if (isPreviousDayLeaveWithoutPay) {
                updatedClockInStatus = 'BeforeWeekOffAbsent';
                updatedClockOutStatus = 'BeforeWeekOffAbsent';
              }
              if (isNextDayLeave) {
                updatedClockInStatus = 'AfterWeekOffLeave';
                updatedClockOutStatus = 'AfterWeekOffLeave';
              }
              if (isNextDayAbsent) {
                updatedClockInStatus = 'AfterWeekOffAbsent';
                updatedClockOutStatus = 'AfterWeekOffAbsent';
              }
              if (isNextDayLeaveWithoutPay) {
                updatedClockInStatus = 'AfterWeekOffAbsent';
                updatedClockOutStatus = 'AfterWeekOffAbsent';
              }

              if (isPreviousDayLeave && isNextDayLeave) {
                updatedClockInStatus = "BeforeAndAfterWeekOffLeave";
                updatedClockOutStatus = "BeforeAndAfterWeekOffLeave";
              }
              // console.log(isPreviousDayAbsent && isNextDayAbsent, 'isPreviousDayAbsent && isNextDayAbsent')
              if (isPreviousDayAbsent && isNextDayAbsent) {
                updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
              }
              if (isPreviousDayLeaveWithoutPay && isNextDayLeaveWithoutPay) {
                updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
              }
            }

            return {
              ...item,
              clockinstatus: updatedClockInStatus,
              clockoutstatus: updatedClockOutStatus,
            };
          });

          const resultBefore = [];

          const empGrouped = {};

          changedWeekoffResult.forEach(item => {
            if (!empGrouped[item.empcode]) empGrouped[item.empcode] = [];
            empGrouped[item.empcode].push(item);
          });

          const leaveStatuses = [
            ...rearr,
            "Absent", "BL - Absent",
          ];

          // console.log(leaveStatuses, 'leaveStatuses')
          Object.keys(empGrouped).forEach(empcode => {
            const records = empGrouped[empcode]
              .sort((a, b) => moment(a.rowformattedDate, "DD/MM/YYYY") - moment(b.rowformattedDate, "DD/MM/YYYY"));

            let streak = [];
            let counterIn = 1;
            let counterOut = 1;

            for (let i = 0; i < records.length; i++) {
              const current = records[i];
              const isWeekOff = current.shift === "Week Off";

              const isLeaveDay =
                current.clockin === "00:00:00" &&
                current.clockout === "00:00:00" &&
                leaveStatuses.includes(current.clockinstatus) &&
                !isWeekOff;

              if (isLeaveDay) {
                streak.push(current);
              } else if (isWeekOff) {
                // Push Week Off directly, don’t reset streak
                resultBefore.push(current);
              } else {
                // Encountered present day, finalize streak
                if (streak.length > attendanceCriteriaData?.longabsentcount) {
                  streak.forEach(day => {
                    let clockinstatus = day.clockinstatus;
                    let clockoutstatus = day.clockoutstatus;

                    if (clockinstatus === "Absent") {
                      clockinstatus = `${counterIn++}Long Absent`;
                    } else if (clockinstatus === "BL - Absent") {
                      clockinstatus = `${counterIn++}Long BL - Absent`;
                    } else if (rearr?.includes(clockinstatus)) {
                      clockinstatus = `${counterIn++}Long Leave ${rearr?.filter(d => d === clockinstatus)}`;
                    }

                    if (clockoutstatus === "Absent") {
                      clockoutstatus = `${counterOut++}Long Absent`;
                    } else if (clockoutstatus === "BL - Absent") {
                      clockoutstatus = `${counterOut++}Long BL - Absent`;
                    } else if (rearr?.includes(clockoutstatus)) {
                      clockoutstatus = `${counterOut++}Long Leave ${rearr?.filter(d => d === clockoutstatus)}`;
                    }

                    resultBefore.push({
                      ...day,
                      clockinstatus,
                      clockoutstatus
                    });
                  });
                } else {
                  resultBefore.push(...streak); // push as-is
                }

                resultBefore.push(current); // current present day
                streak = [];
                counterIn = 1;
                counterOut = 1;
              }
            }

            // Remaining streak at end
            if (streak.length > attendanceCriteriaData?.longabsentcount) {
              streak.forEach(day => {
                let clockinstatus = day.clockinstatus;
                let clockoutstatus = day.clockoutstatus;

                if (clockinstatus === "Absent") {
                  clockinstatus = `${counterIn++}Long Absent`;
                } else if (clockinstatus === "BL - Absent") {
                  clockinstatus = `${counterIn++}Long BL - Absent`;
                } else if (rearr?.includes(clockinstatus)) {
                  clockinstatus = `${counterIn++}Long Leave ${rearr?.filter(d => d === clockinstatus)}`;
                }

                if (clockoutstatus === "Absent") {
                  clockoutstatus = `${counterOut++}Long Absent`;
                } else if (clockoutstatus === "BL - Absent") {
                  clockoutstatus = `${counterOut++}Long BL - Absent`;
                } else if (rearr?.includes(clockoutstatus)) {
                  clockoutstatus = `${counterOut++}Long Leave ${rearr?.filter(d => d === clockoutstatus)}`;
                }

                resultBefore.push({
                  ...day,
                  clockinstatus,
                  clockoutstatus
                });
              });
            } else {
              resultBefore.push(...streak);
            }
          });
          resultBefore.sort((a, b) => moment(a.rowformattedDate, "DD/MM/YYYY") - moment(b.rowformattedDate, "DD/MM/YYYY"));

          // Group data by empcode
          let groupedData = {};
          resultBefore.forEach((item) => {
            if (!groupedData[item.empcode]) {
              groupedData[item.empcode] = {
                attendanceRecords: [],
                departmentDateSet: item.departmentDateSet || [],
              };
            }
            groupedData[item.empcode].attendanceRecords.push(item);
          });
          // console.log(groupedData, 'groupedData')
          let result = [];

          for (let empcode in groupedData) {
            let { attendanceRecords, departmentDateSet } = groupedData[empcode];

            departmentDateSet.forEach((dateRange) => {
              let { fromdate, todate, department } = dateRange;

              let countByEmpcodeClockin = {};
              let countByEmpcodeClockout = {};

              let recordsInDateRange = attendanceRecords.filter((record) => {
                let formattedDate = new Date(record.finalDate);
                return department === record.department && formattedDate >= new Date(fromdate) && formattedDate <= new Date(todate);
              });

              // // Filter out only 'Absent' items for the current employee
              // const absentItems = recordsInDateRange.filter(
              //     (d) =>
              //         d.clockinstatus === "Absent" &&
              //         d.clockoutstatus === 'Absent' &&
              //         d.clockin === "00:00:00" &&
              //         d.clockout === "00:00:00"
              // );

              let processedRecords = recordsInDateRange.map((item) => {
                let formattedDate = new Date(item.finalDate);
                let reasonDate = item.reasondate ? new Date(item.reasondate) : null;
                let dojDate = item.doj ? new Date(item.doj) : null;

                let updatedClockInStatus = item.clockinstatus;
                let updatedClockOutStatus = item.clockoutstatus;

                // Check if the date falls within the reasonDate or dojDate
                if (reasonDate && formattedDate <= reasonDate) {
                  return null;
                }
                if (dojDate && formattedDate < dojDate) {
                  return null;
                }

                // // Handling Week Offs and Absences
                // if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
                //     const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                //     const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                //     const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && absentItem.empcode === item.empcode);

                //     const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                //     const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && absentItem.empcode === item.empcode);

                //     if (isPreviousDayLeave) {
                //         updatedClockInStatus = "BeforeWeekOffLeave";
                //         updatedClockOutStatus = "BeforeWeekOffLeave";
                //     }
                //     if (isPreviousDayAbsent) {
                //         updatedClockInStatus = "BeforeWeekOffAbsent";
                //         updatedClockOutStatus = "BeforeWeekOffAbsent";
                //     }
                //     if (isNextDayLeave) {
                //         updatedClockInStatus = "AfterWeekOffLeave";
                //         updatedClockOutStatus = "AfterWeekOffLeave";
                //     }
                //     if (isNextDayAbsent) {
                //         updatedClockInStatus = "AfterWeekOffAbsent";
                //         updatedClockOutStatus = "AfterWeekOffAbsent";
                //     }

                //     if (isPreviousDayLeave && isNextDayLeave) {
                //         updatedClockInStatus = "BeforeAndAfterWeekOffLeave";
                //         updatedClockOutStatus = "BeforeAndAfterWeekOffLeave";
                //     }
                //     console.log(isPreviousDayAbsent && isNextDayAbsent, 'isPreviousDayAbsent && isNextDayAbsent')
                //     if (isPreviousDayAbsent && isNextDayAbsent) {
                //         updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                //         updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
                //     }
                // }

                // Handling Late Clock-in and Early Clock-out
                if (!countByEmpcodeClockin[item.empcode]) {
                  countByEmpcodeClockin[item.empcode] = 1;
                }
                if (!countByEmpcodeClockout[item.empcode]) {
                  countByEmpcodeClockout[item.empcode] = 1;
                }

                if (updatedClockInStatus === "Late - ClockIn") {
                  updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                  countByEmpcodeClockin[item.empcode]++;
                }

                if (updatedClockOutStatus === "Early - ClockOut") {
                  updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                  countByEmpcodeClockout[item.empcode]++;
                }

                // console.log(item.rowformattedDate, updatedClockInStatus, updatedClockOutStatus)

                return {
                  ...item,
                  department,
                  fromdate,
                  todate,
                  clockinstatus: updatedClockInStatus,
                  clockoutstatus: updatedClockOutStatus,
                };
              });

              result.push(...processedRecords.filter(Boolean));
            });
          }

          return result;

        } catch (err) {
          console.error("Error in POST request for batch:", batch.data, err);
        }
      }

      async function getAllResults() {
        let allResults = [];
        for (let batch of resultarr) {
          const finaldata = await sendBatchRequest(batch);
          allResults = allResults.concat(finaldata);
        }

        return { allResults }; // Return both results as an object
      }
      getAllResults().then(async (results) => {

        let itemsWithSerialNumber = results.allResults?.map((item) => {
          return {
            ...item,
            id: item.id,
            shift: item.changeshift ? item.changeshift : item.shift,
            bookby: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
            level: item.level == undefined ? filterUser.level : item.level + item.control,
            paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
            paidpresent: getFinalPaid(
              getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
              getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
            ),
          };
        })
        // const weekOption = ['BeforeWeekOffAbsent', 'AfterWeekOffAbsent', 'BeforeWeekOffLeave', 'AfterWeekOffLeave', 'BeforeAndAfterWeekOffAbsent', 'BeforeAndAfterWeekOffLeave'];
        // itemsWithSerialNumber.forEach((item, index, array) => {
        //   if (attStatusOption.includes(item.bookby) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
        //     const previousItem = array[index - 1];
        //     const nextItem = array[index + 1];

        //     const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off");

        //     if (hasRelevantStatus(previousItem)) {
        //       previousItem.clockinstatus = 'Week Off';
        //       previousItem.clockoutstatus = 'Week Off';
        //       previousItem.attendanceauto = getattendancestatus(previousItem);
        //       previousItem.bookby = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
        //       previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
        //       previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
        //       previousItem.paidpresent = getFinalPaid(
        //         getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
        //         getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
        //       );
        //     }
        //     if (hasRelevantStatus(nextItem)) {
        //       nextItem.clockinstatus = 'Week Off';
        //       nextItem.clockoutstatus = 'Week Off';
        //       nextItem.attendanceauto = getattendancestatus(nextItem);
        //       nextItem.bookby = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
        //       nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
        //       nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
        //       nextItem.paidpresent = getFinalPaid(
        //         getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
        //         getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
        //       );
        //     }
        //   }
        // })
        let fianlResult = itemsWithSerialNumber.filter(data => data.finalDate >= filterUser.fromdate && data.finalDate <= filterUser.todate)?.map((item, index) => ({ ...item, serialNumber: index + 1, }))
        setUserShifts(fianlResult);
        setFilteredDataItems(fianlResult);
        setSearchQueryAttTeam("");
        setLoader(true);
      }).catch(error => {
        setLoader(true);
        console.error('Error in getting all results:', error);
      });
    } catch (err) {
      setLoader(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // const fetchClearFilteredUsersStatus = async () => {
  //   setItems([]);
  //   setLoader(false);

  //   // let startMonthDate = new Date(today);
  //   // let endMonthDate = new Date(today);

  //   // const daysArray = [];
  //   // while (startMonthDate <= endMonthDate) {
  //   //   const formattedDate = `${String(startMonthDate.getDate()).padStart(
  //   //     2,
  //   //     "0"
  //   //   )}/${String(startMonthDate.getMonth() + 1).padStart(
  //   //     2,
  //   //     "0"
  //   //   )}/${startMonthDate.getFullYear()}`;
  //   //   const dayName = startMonthDate.toLocaleDateString("en-US", {
  //   //     weekday: "long",
  //   //   });
  //   //   const dayCount = startMonthDate.getDate();
  //   //   const shiftMode = "Main Shift";
  //   //   const weekNumberInMonth =
  //   //     getWeekNumberInMonth(startMonthDate) === 1
  //   //       ? `${getWeekNumberInMonth(startMonthDate)}st Week`
  //   //       : getWeekNumberInMonth(startMonthDate) === 2
  //   //         ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
  //   //         : getWeekNumberInMonth(startMonthDate) === 3
  //   //           ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
  //   //           : getWeekNumberInMonth(startMonthDate) > 3
  //   //             ? `${getWeekNumberInMonth(startMonthDate)}th Week`
  //   //             : "";

  //   //   daysArray.push({
  //   //     formattedDate,
  //   //     dayName,
  //   //     dayCount,
  //   //     shiftMode,
  //   //     weekNumberInMonth,
  //   //   });

  //   //   // Move to the next day
  //   //   startMonthDate.setDate(startMonthDate.getDate() + 1);
  //   // }

  //   const montharray = getMonthsInRange(today, today);

  //   try {
  //     let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_INDVL_HIERARFILTER, {
  //       headers: {
  //         Authorization: `Bearer ${auth.APIToken}`,
  //       },
  //       hierachy: "My Hierarchy List",
  //       sector: "Primary",
  //       username: isUserRoleAccess?.companyname,
  //       team: isUserRoleAccess.team,
  //       listpageaccessmode: listpageaccessby,
  //       pagename: "menuteamattendancestatus",
  //       // listpageaccessmode: filterUser?.listpageaccessmode,
  //     });
  //     // console.log(res?.data?.resultAccessFilter, 'res?.data?.finaluser')
  //     const resultAccessFilters = res?.data?.resultAccessFilter;
  //     function splitArray(array, chunkSize) {
  //       const resultarr = [];
  //       for (let i = 0; i < array.length; i += chunkSize) {
  //         const chunk = array.slice(i, i + chunkSize);
  //         resultarr.push({
  //           data: chunk,
  //         });
  //       }
  //       return resultarr;
  //     }
  //     let employeelistnames = resultAccessFilters.length > 0 ? [...new Set(resultAccessFilters.map(item => item.companyname))] : []
  //     const resultarr = splitArray(employeelistnames, 10);

  //     async function sendBatchRequest(batch) {
  //       try {
  //         let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
  //           headers: {
  //             Authorization: `Bearer ${auth.APIToken}`,
  //           },
  //           employee: batch.data,
  //         });

  //         let leaveresult = res_applyleave?.data?.applyleaves;

  //         let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER, {
  //           employee: batch.data,
  //           fromdate: today,
  //           todate: today,
  //           montharray: [...montharray],
  //         }, {
  //           headers: {
  //             Authorization: `Bearer ${auth.APIToken}`,
  //           }
  //         })
  //         // console.log(res?.data?.finaluser, 'user shift')
  //         const filtered = res?.data?.finaluser?.filter(d => {
  //           const formattedDate = new Date(d.finalDate);
  //           const reasonDate = new Date(d.reasondate);
  //           const dojDate = new Date(d.doj);

  //           if (d.reasondate && d.reasondate !== "") {
  //             return (formattedDate <= reasonDate);
  //           } else if (d.doj && d.doj !== "") {
  //             return (formattedDate >= dojDate);
  //           } else {
  //             return d;
  //           }
  //         });
  //         // console.log(filtered, 'filtered')
  //         let hierarchyres = [];
  //         resultAccessFilters?.forEach((data) => {
  //           filtered.forEach((userdata, i) => {
  //             if (
  //               userdata.company === data.company &&
  //               userdata.branch === data.branch &&
  //               userdata.unit === data.unit &&
  //               userdata.empcode === data.empcode &&
  //               userdata.username === data.companyname
  //             ) {
  //               const resfinaldata = {
  //                 ...userdata,
  //                 level: data.level,
  //                 control: data.control,
  //               };
  //               hierarchyres.push(resfinaldata);
  //             }
  //           });
  //         });
  //         const hierarchyResult = hierarchyres.filter((item) => item !== null);
  //         const finalresult = hierarchyResult.filter((data) => {
  //           return data.shift != "Week Off" && data.shift != "Not Allotted";
  //         });

  //         // Group data by empcode
  //         let groupedData = {};
  //         finalresult.forEach((item) => {
  //           if (!groupedData[item.empcode]) {
  //             groupedData[item.empcode] = {
  //               attendanceRecords: [],
  //               departmentDateSet: item.departmentDateSet || [],
  //             };
  //           }
  //           groupedData[item.empcode].attendanceRecords.push(item);
  //         });
  //         // console.log(groupedData, 'groupedData')
  //         let result = [];

  //         for (let empcode in groupedData) {
  //           let { attendanceRecords, departmentDateSet } = groupedData[empcode];

  //           departmentDateSet.forEach((dateRange) => {
  //             let { fromdate, todate, department } = dateRange;

  //             let countByEmpcodeClockin = {};
  //             let countByEmpcodeClockout = {};

  //             let recordsInDateRange = attendanceRecords.filter((record) => {
  //               let formattedDate = new Date(record.finalDate);
  //               return department === record.department && formattedDate >= new Date(fromdate) && formattedDate <= new Date(todate);
  //             });

  //             // Filter out only 'Absent' items for the current employee
  //             const absentItems = recordsInDateRange.filter(
  //               (d) =>
  //                 d.clockinstatus === "Absent" &&
  //                 d.clockoutstatus === 'Absent' &&
  //                 d.clockin === "00:00:00" &&
  //                 d.clockout === "00:00:00"
  //             );

  //             let processedRecords = recordsInDateRange.map((item) => {
  //               let formattedDate = new Date(item.finalDate);
  //               let reasonDate = item.reasondate ? new Date(item.reasondate) : null;
  //               let dojDate = item.doj ? new Date(item.doj) : null;

  //               let updatedClockInStatus = item.clockinstatus;
  //               let updatedClockOutStatus = item.clockoutstatus;

  //               // Check if the date falls within the reasonDate or dojDate
  //               if (reasonDate && formattedDate <= reasonDate) {
  //                 return null;
  //               }
  //               if (dojDate && formattedDate < dojDate) {
  //                 return null;
  //               }

  //               // Handling Week Offs and Absences
  //               if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
  //                 const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

  //                 const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
  //                 const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && absentItem.empcode === item.empcode);

  //                 const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
  //                 const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && absentItem.empcode === item.empcode);

  //                 if (isPreviousDayLeave && isNextDayLeave) {
  //                   updatedClockInStatus = "BeforeAndAfterWeekOffLeave";
  //                   updatedClockOutStatus = "BeforeAndAfterWeekOffLeave";
  //                 }

  //                 if (isPreviousDayAbsent && isNextDayAbsent) {
  //                   updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
  //                   updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
  //                 }

  //                 if (isPreviousDayLeave) {
  //                   updatedClockInStatus = "BeforeWeekOffLeave";
  //                   updatedClockOutStatus = "BeforeWeekOffLeave";
  //                 }
  //                 if (isPreviousDayAbsent) {
  //                   updatedClockInStatus = "BeforeWeekOffAbsent";
  //                   updatedClockOutStatus = "BeforeWeekOffAbsent";
  //                 }
  //                 if (isNextDayLeave) {
  //                   updatedClockInStatus = "AfterWeekOffLeave";
  //                   updatedClockOutStatus = "AfterWeekOffLeave";
  //                 }
  //                 if (isNextDayAbsent) {
  //                   updatedClockInStatus = "AfterWeekOffAbsent";
  //                   updatedClockOutStatus = "AfterWeekOffAbsent";
  //                 }
  //               }

  //               // Handling Late Clock-in and Early Clock-out
  //               if (!countByEmpcodeClockin[item.empcode]) {
  //                 countByEmpcodeClockin[item.empcode] = 1;
  //               }
  //               if (!countByEmpcodeClockout[item.empcode]) {
  //                 countByEmpcodeClockout[item.empcode] = 1;
  //               }

  //               if (updatedClockInStatus === "Late - ClockIn") {
  //                 updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
  //                 countByEmpcodeClockin[item.empcode]++;
  //               }

  //               if (updatedClockOutStatus === "Early - ClockOut") {
  //                 updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
  //                 countByEmpcodeClockout[item.empcode]++;
  //               }

  //               return {
  //                 ...item,
  //                 department,
  //                 fromdate,
  //                 todate,
  //                 clockinstatus: updatedClockInStatus,
  //                 clockoutstatus: updatedClockOutStatus,
  //               };
  //             });

  //             result.push(...processedRecords.filter(Boolean));
  //           });
  //         }

  //         return result;

  //       } catch (err) {
  //         console.error("Error in POST request for batch:", batch.data, err);
  //       }
  //     }

  //     async function getAllResults() {
  //       let allResults = [];
  //       for (let batch of resultarr) {
  //         const finaldata = await sendBatchRequest(batch);
  //         allResults = allResults.concat(finaldata);
  //       }

  //       return { allResults }; // Return both results as an object
  //     }

  //     getAllResults().then(async (results) => {
  //       const itemsWithSerialNumber = results.allResults?.map((item) => (
  //         {
  //           ...item,
  //           id: item.id,
  //           shift: item.changeshift ? item.changeshift : item.shift,
  //           shiftmode: item.shiftMode,
  //           uniqueid: item.id,
  //           userid: item.userid,
  //           bookby: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
  //           level: item.level == undefined ? filterUser.level : item.level + item.control,
  //           paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
  //           paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
  //           paidpresent: getFinalPaid(
  //             getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
  //             getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))
  //           ),
  //         }));
  //       console.log(itemsWithSerialNumber, 'itemsWithSerialNumber')
  //       const weekOption = ['BeforeWeekOffAbsent', 'AfterWeekOffAbsent', 'BeforeWeekOffLeave', 'AfterWeekOffLeave', 'BeforeAndAfterWeekOffAbsent', 'BeforeAndAfterWeekOffLeave'];
  //       itemsWithSerialNumber.forEach((item, index, array) => {
  //         if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
  //           const previousItem = array[index - 1];
  //           const nextItem = array[index + 1];

  //           const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off");

  //           if (hasRelevantStatus(previousItem)) {
  //             previousItem.clockinstatus = 'Week Off';
  //             previousItem.clockoutstatus = 'Week Off';
  //             previousItem.attendanceauto = getattendancestatus(previousItem);
  //             previousItem.bookby = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
  //             previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
  //             previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
  //             previousItem.paidpresent = getFinalPaid(
  //               getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)),
  //               getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))
  //             );
  //           }
  //           if (hasRelevantStatus(nextItem)) {
  //             nextItem.clockinstatus = 'Week Off';
  //             nextItem.clockoutstatus = 'Week Off';
  //             nextItem.attendanceauto = getattendancestatus(nextItem);
  //             nextItem.bookby = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
  //             nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
  //             nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
  //             nextItem.paidpresent = getFinalPaid(
  //               getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)),
  //               getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))
  //             );
  //           }
  //         }
  //       })
  //       let fianlResult = itemsWithSerialNumber.filter(data => data.finalDate >= today && data.finalDate <= today)?.map((item, index) => ({ ...item, serialNumber: index + 1, }))
  //       setUserShifts(fianlResult);
  //       setFilteredDataItems(fianlResult);
  //       setSearchQueryAttTeam("");
  //       setLoader(true);
  //       // setTotalPagesUserShift(Math.ceil(fianlResult.length / pageSizeUserShift));
  //     }).catch(error => {
  //       setLoader(true);
  //       console.error('Error in getting all results:', error);
  //     });

  //   } catch (err) {
  //     setLoader(true);
  //     handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
  //   }
  // };

  // useEffect(() => {
  //   fetchClearFilteredUsersStatus();
  // }, []);

  //get single row to edit....
  const getCodeClockIn = async (rowdata) => {
    hoursOptions = [];
    setHoursOptions([]);
    setAallHoursOptions([]);
    setDateOptions([]);
    try {
      let res_payrun = await axios.post(SERVICE.CHECK_PAYRUN_ISCREATED_FOR_ATTENDANCE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: rowdata.department,
        date: rowdata.finalDate,
      });

      const givenDate = new Date(rowdata.finalDate);
      const today = new Date();
      const diffInMs = today - givenDate;

      // Convert milliseconds to days
      const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

      // Condition: Check if the difference is more than 5 days
      const isMoreThan5Days = diffInDays > 5;

      const isPayrunGenerated = res_payrun?.data?.payrunlist.length > 0 && isMoreThan5Days;

      if (isPayrunGenerated) {
        setPopupContentMalert("Payrun Already Generated");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else {
        if (rowdata?.clockin != "00:00:00") {
          let res = await axios.post(SERVICE.INDUSERSLOGINOUT, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: moment(rowdata.rowformattedDate, "DD/MM/YYYY").format("DD-MM-YYYY"),
            userid: String(rowdata.userid),
          });

          res?.data?.attandances?.filter((d) => {
            if (d.userid === rowdata.userid && d.date === moment(rowdata.rowformattedDate, "DD/MM/YYYY").format("DD-MM-YYYY") && d.shiftmode === rowdata.shiftMode) {

              setGetAttIdClockIn(d._id);
            }
          })
        }
        else {
          let res = await axios.post(SERVICE.INDUSERSLOGINOUT, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: moment(rowdata.rowformattedDate, "DD/MM/YYYY").format("DD-MM-YYYY"),
            userid: String(rowdata.userid),
          });
          const result = res?.data?.attandances?.filter(data => data !== null)
          result?.filter((d) => {
            if (d.userid === rowdata.userid && d.date === moment(rowdata.rowformattedDate, "DD/MM/YYYY").format("DD-MM-YYYY") && d.shiftmode === rowdata.shiftMode && d.attendancestatus !== undefined) {
              console.log(d._id)
              setGetAttIdClockIn(d._id);
            }
          });
        }
        handleClickOpenEditClkIn();

        const [clockin, timeperiod] = rowdata.clockin.split(' ');
        let sdate = rowdata?.shift?.split('to');

        const currentHourParts = sdate[0].split(':');
        const endHourParts = sdate[1].split(':');
        const finalshifthourstart = currentHourParts[0] - attSeetings?.clockin;
        const finalshifthourend = Number(endHourParts[0]) + Number(attSeetings?.clockout);

        //include attendance settings hours
        const [timeStr, meridiem] = sdate[0].split(/[AP]M/);
        const [sthours, stminutes] = timeStr.split(':').map(Number);

        let totalHours = sthours;
        if (meridiem === 'PM' && sthours !== 12) {
          totalHours += 12;
        }

        totalHours -= attSeetings?.clockin;

        let newHours = totalHours % 12;
        if (newHours === 0) {
          newHours = 12;
        }
        const newMeridiem = totalHours < 12 ? 'AM' : 'PM';

        const newTime = `${String(newHours).padStart(2, '0')}:${String(stminutes).padStart(2, '0')}${newMeridiem}`;

        const [endtimeStr, endmeridiem] = sdate[1].split(/[AP]M/);
        const [endsthours, endstminutes] = endtimeStr.split(':').map(Number);

        let endtotalHours = endsthours;
        if (endmeridiem === 'PM' && endsthours !== 12) {
          endtotalHours += 12;
        }

        endtotalHours += attSeetings?.clockout;

        let endnewHours = endtotalHours % 12;
        if (endnewHours === 0) {
          endnewHours = 12;
        }
        const endnewMeridiem = endtotalHours < 12 ? 'AM' : 'PM';

        const endnewTime = `${String(endnewHours).padStart(2, '0')}:${String(endstminutes).padStart(2, '0')}${endnewMeridiem}`;

        let startHour = parseInt(finalshifthourstart);
        const startAmPm = sdate[0].includes('PM') ? 'PM' : 'AM';

        let endHourValue = parseInt(finalshifthourend);
        const endAmPm = sdate[1].includes('PM') ? 'PM' : 'AM';

        if (startAmPm === 'PM' && startHour !== 12) {
          startHour += 12;
        } else if (startAmPm === 'AM' && startHour === 12) {
          startHour = 0;
        }

        if (endAmPm === 'PM' && endHourValue !== 12) {
          endHourValue += 12;
        } else if (endAmPm === 'AM' && endHourValue === 12) {
          endHourValue = 0;
        }

        if (startHour <= endHourValue) {
          for (let h = startHour; h <= endHourValue; h++) {
            const formattedHour = `${h % 12 || 12}`;
            const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
            hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
          }
        } else {
          for (let h = startHour; h <= 23; h++) {
            const formattedHour = `${h % 12 || 12}`;
            const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
            hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
          }

          for (let h = 0; h <= endHourValue; h++) {
            const formattedHour = `${h % 12 || 12}`;
            const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
            hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
          }
        }

        setAallHoursOptions(hoursOptions)
        let fdate = rowdata.date.split(" ");

        if (sdate[0]?.includes("PM") && sdate[1]?.includes("AM")) {
          // Increment date by 1 day
          const nextDate = moment(rowdata.rowformattedDate, "DD/MM/YYYY").add(1, 'days').format("DD/MM/YYYY");
          setDateOptions([fdate[0], nextDate]);
        } else {

          setDateOptions([fdate[0]])
        }

        let resshift = rowdata?.clockin?.split(':');

        let changeresshift = resshift[2].split(" ")


        let newobj = {
          userid: rowdata.userid,
          username: rowdata.username,
          rowusername: rowdata.rowusername,
          empcode: rowdata.empcode,
          predate: fdate[0],
          date: fdate[0],
          shift: rowdata.shift,
          shiftendtime: sdate[1] ? sdate[1] : "",
          shiftname: rowdata.shift ? rowdata.shift : "",
          shiftmode: rowdata.shiftMode,
          clockin: clockin,
          clinhour: resshift[0] ? resshift[0] + " " + (resshift[2] && resshift[2].split(" ")[1] && resshift[2].split(" ")[1] != "undefined" && resshift[2].split(" ")[1] != undefined ? resshift[2].split(" ")[1] : "") : "00",
          clinminute: resshift[1] ? resshift[1] : "00",
          clinseconds: resshift[2].includes(" ") ? changeresshift[0] : "00",
          timeperiod: resshift[2] && resshift[2].split(" ")[1] && resshift[2].split(" ")[1] != "undefined" && resshift[2].split(" ")[1] != undefined ? resshift[2].split(" ")[1] : "",
          clockinstatus: rowdata.clockinstatus
        }

        if (sdate[0]?.includes("PM") && sdate[1]?.includes("AM")) {
          const result = hoursOptions.filter((data, index) => {
            return data.formattedtime != "AM"
          });
          setHoursOptions(result.map((t) => ({
            label: t.formattedHour,
            value: t.formattedtime,
          })));
        } else {
          setHoursOptions(hoursOptions.map((t) => ({
            label: t.formattedHour,
            value: t.formattedtime,
          })));
        }
        setAttClockInEdit(newobj);

        let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA);
        let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;

        // old
        // function generateTimeSlots(startTime, endTime) {
        //   // Helper function to convert 12-hour time format to 24-hour format
        //   function convertTo24Hour(time) {
        //     const [timePart, period] = [time.slice(0, -2).trim(), time.slice(-2)];
        //     let [hours, minutes] = timePart.split(':').map(Number);
        //     if (period === 'PM' && hours !== 12) hours += 12;
        //     if (period === 'AM' && hours === 12) hours = 0;
        //     return { hours, minutes };
        //   }

        //   // Helper function to format time in the desired 12-hour format (e.g., "06 AM")
        //   function formatTime(hours) {
        //     const period = hours >= 12 ? 'PM' : 'AM';
        //     const h = hours % 12 || 12;
        //     return `${String(h).padStart(2, '0')} ${period}`;
        //   }

        //   // Convert times to 24-hour format
        //   const start = convertTo24Hour(startTime);
        //   const end = convertTo24Hour(endTime);

        //   // Generate time slots
        //   let slots = [];
        //   let currentHour = start.hours;

        //   // Loop to generate time slots from start time to end time
        //   while (true) {
        //     slots.push(formatTime(currentHour));
        //     currentHour = (currentHour + 1) % 24;
        //     if (currentHour === (end.hours % 24)) break;
        //   }

        //   // Include the end time as the last slot
        //   slots.push(formatTime(end.hours));

        //   return slots;
        // }

        // function adjustShiftTime(shift, criteria) {
        //   const clockin = parseInt(criteria, 10); // e.g., 2

        //   // Extract the start and end times from the shift string
        //   const [startTime, endTime] = shift.split("to");

        //   // Function to convert 12-hour time format to minutes
        //   function timeToMinutes(time) {
        //     let [hours, minutes] = time.match(/\d{1,2}/g).map(Number);
        //     const isPM = time.includes("PM");

        //     if (isPM && hours !== 12) hours += 12;
        //     if (!isPM && hours === 12) hours = 0;

        //     return hours * 60 + minutes;
        //   }

        //   // Function to convert minutes back to 12-hour time format
        //   function minutesToTime(minutes) {
        //     let hours = Math.floor(minutes / 60) % 24;
        //     let minutesPart = minutes % 60;
        //     let isPM = hours >= 12;

        //     if (hours >= 12) {
        //       if (hours > 12) hours -= 12; // Convert 13 to 12-hour format (e.g., 13 to 1 PM)
        //     } else if (hours === 0) {
        //       hours = 12; // Midnight case (00:00 to 12:00 AM)
        //     }

        //     if (hours === 12) {
        //       isPM = !isPM;
        //     }

        //     return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}${isPM ? "PM" : "AM"}`;
        //   }

        //   // Convert start time to minutes and subtract clockin hours
        //   let newStartTimeMinutes = timeToMinutes(startTime) - (clockin * 60);

        //   // Adjust for rolling over midnight
        //   if (newStartTimeMinutes < 0) {
        //     newStartTimeMinutes += 24 * 60;
        //   }

        //   // Convert the adjusted time back to 12-hour format
        //   const newStartTime = minutesToTime(newStartTimeMinutes);
        //   // Create a new shift with the adjusted start time and unchanged end time
        //   const newShift = `${newStartTime}to${endTime}`;
        //   return { shift: newShift };
        // }


        // let newobjshift = newobj.shift
        let criteria = dataFromControlPanel[0]?.clockin ? dataFromControlPanel[0]?.clockin : 0;

        // let newobjresult = adjustShiftTime(newobjshift, criteria);
        // const startTime1 = newobjresult.shift.split("to")[0];
        // const endTime1 = newobj.shift.split("to")[1];
        // let hoursval = generateTimeSlots(startTime1, endTime1);



        // let finalhrs = hoursval.map(item => ({
        //   ...item,
        //   label: item,
        //   value: item
        // }))
        // setHoursOptionsConvert(finalhrs)

        // today 31-12-2024
        function generateTimeSlots(startTime, endTime) {
          // Helper function to convert 12-hour time format to 24-hour format
          function convertTo24Hour(time) {
            const [timePart, period] = [time.slice(0, -2).trim(), time.slice(-2)];
            let [hours, minutes] = timePart.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return { hours, minutes };
          }

          // Helper function to format time in the desired 12-hour format
          function formatTime(hours, minutes = 0) {
            const period = hours >= 12 ? 'PM' : 'AM';
            const h = hours % 12 || 12;
            return `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
          }

          // Convert times to 24-hour format
          const start = convertTo24Hour(startTime);
          const end = convertTo24Hour(endTime);

          let slots = [];
          let currentHour = start.hours;

          // Generate time slots from start to end, considering wrap-around at midnight
          do {
            slots.push(formatTime(currentHour));
            currentHour = (currentHour + 1) % 24;
          } while (currentHour !== (end.hours + 1) % 24);

          return slots;
        }

        function adjustShiftTime(shift, criteria) {
          const clockin = parseInt(criteria, 10); // Adjust hours (criteria)

          // Extract start and end times from the shift string
          const startTime = shift.slice(0, shift.indexOf("to"));
          const endTime = shift.slice(shift.indexOf("to") + 2);

          // Function to convert 12-hour time to minutes
          function timeToMinutes(time) {
            let [hours, minutes] = time.match(/\d{1,2}/g).map(Number);
            const isPM = time.includes("PM");

            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;

            return hours * 60 + minutes;
          }

          // Function to convert minutes back to 12-hour time format
          function minutesToTime(minutes) {
            let hours = Math.floor(minutes / 60) % 24;
            let minutesPart = minutes % 60;
            const period = hours >= 12 ? "PM" : "AM";

            hours = hours % 12 || 12; // Convert to 12-hour format
            return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}${period}`;
          }

          // Convert start time to minutes and subtract the clockin time (criteria) in minutes
          const newStartTimeMinutes = (timeToMinutes(startTime) - clockin * 60) % (24 * 60);
          const adjustedStartTime = minutesToTime(newStartTimeMinutes);

          // Generate time slots from adjusted start time to end time
          return generateTimeSlots(adjustedStartTime, endTime);
        }

        const finalHours = adjustShiftTime(rowdata.shift, criteria);
        // console.log(finalHours);
        const simplifiedHours = finalHours.map(item => {
          const hour = item?.split(':')[0];
          const period = item?.split(' ')[1];
          return `${hour} ${period}`;
        });

        // console.log(simplifiedHours);
        let finalhrs = simplifiedHours.map(item => ({
          ...item,
          label: item,
          value: item
        }))
        setHoursOptionsConvert(finalhrs)

        const parseTime = (timeString) => {
          const [time, period] = timeString.trim().split("to");

          let fromTimeMeridian = time.slice(-2);
          let toTimeMeridian = period.slice(-2);
          const [fromTimeHrs, fromTimeMins] = time.slice(0, -2).split(":");
          const [toTimeHrs, toTimeMins] = period.slice(0, -2).split(":");
          return { fromTimeHrs, fromTimeMins, toTimeHrs, toTimeMins, fromTimeMeridian, toTimeMeridian };
        };

        let timings = parseTime(newobj.shift)
        if (dataFromControlPanel[0]?.clockin && dataFromControlPanel[0]?.clockin != "") {
          let exactHours = Number(timings?.fromTimeHrs) - Number(dataFromControlPanel[0]?.clockin);
          if (exactHours < 0) {
            exactHours = 12 + exactHours;

            let filteredData = hrsOptions.filter((data) => {
              return Number(data.value) >= exactHours
            }).filter((item) => item.value != 12)
            if (timings.fromTimeMeridian != attClockInEdit.timeperiod) {
              let filteredData2 = hrsOptions.filter((data) => {
                return Number(data.value) <= Number(timings?.toTimeHrs)
              }).filter((item) => item.value != 12)
              setHoursOptionsNew([...filteredData, { value: "12", label: "12" }, ...filteredData2,]);
            } else {
              setHoursOptionsNew(hrsOptions);
            }
            let filtMins = minutssecOptions.filter((data) => {
              return Number(data.value) >= Number(timings?.fromTimeMins)
            })

            if (attClockInEdit?.clinhour == exactHours) {
              setMinsOptionsNew(filtMins);
            } else {
              setMinsOptionsNew(minutssecOptions)
            }


          } else if (exactHours > 0) {
            exactHours = exactHours
            let filteredData = hrsOptions.filter((data) => {
              return Number(data.value) >= exactHours
            }).filter((item) => item.value != 12)
            if (timings?.fromTimeMeridian == "AM" && attClockInEdit?.timeperiod == "AM") {
              setHoursOptionsNew(filteredData);
            } else if (timings?.fromTimeMeridian == "PM" && attClockInEdit?.timeperiod == "PM") {
              setHoursOptionsNew(filteredData);
            } else {
              let filteredData1 = hrsOptions.filter((data) => {
                return Number(data.value) <= Number(timings?.toTimeHrs)
              })
              setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData1]);
            }

            let filtMins = minutssecOptions.filter((data) => {
              return Number(data.value) >= Number(timings?.fromTimeMins)
            })

            if (attClockInEdit?.clinhour == exactHours) {
              setMinsOptionsNew(filtMins);
            } else {
              setMinsOptionsNew(minutssecOptions)
            }

          } else {
            exactHours = 12

            if (timings.fromTimeMeridian != attClockInEdit.timeperiod) {
              let filteredData2 = hrsOptions.filter((data) => {
                return Number(data.value) <= Number(timings?.toTimeHrs)
              }).filter((item) => item.value != 12)
              setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData2,]);
              let filtMins = minutssecOptions.filter((data) => {
                return Number(data.value) >= Number(timings?.fromTimeMins)
              })

              if (attClockInEdit?.clinhour == exactHours) {
                setMinsOptionsNew(filtMins);
              } else {
                setMinsOptionsNew(minutssecOptions)
              }
            } else {
              setHoursOptionsNew(hrsOptions);
              let filtMins = minutssecOptions.filter((data) => {
                return Number(data.value) >= Number(timings?.fromTimeMins)
              })

              if (attClockInEdit?.clinhour == exactHours) {
                setMinsOptionsNew(filtMins);
              } else {
                setMinsOptionsNew(minutssecOptions)
              }
            }

          }

        }
        else {
          let timings = parseTime(attClockInEdit?.shift);

          let filteredData = hrsOptions.filter((data) => {
            return Number(data.value) >= Number(timings?.fromTimeHrs)
          }).filter((item) => item.value != 12)
          if (timings?.fromTimeMeridian == "AM" && attClockInEdit?.timeperiod == "AM") {
            setHoursOptionsNew(filteredData);
          } else if (timings?.fromTimeMeridian == "PM" && attClockInEdit?.timeperiod == "PM") {
            setHoursOptionsNew(filteredData);
          } else {
            let filteredData1 = hrsOptions.filter((data) => {
              return Number(data.value) <= Number(timings?.toTimeHrs)
            })
            setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData1]);
          }

          let filtMins = minutssecOptions.filter((data) => {
            return Number(data.value) >= Number(timings?.fromTimeMins)
          })

          if (attClockInEdit?.clinhour == attClockInEdit?.clinhour) {
            setMinsOptionsNew(filtMins);
          } else {
            setMinsOptionsNew(minutssecOptions)
          }
        }
        setRunTime(1);

      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendRequestClockIn = async () => {
    setPageName(!pageName)
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      if (getAttIdClockIn) {
        await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getAttIdClockIn}`, {
          // clockintime: String(attClockInEdit.clinhour + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds + ' ' + attClockInEdit.timeperiod),
          clockintime: String(attClockInEdit.clinhour.split(" ")[0] + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds + ' ' + attClockInEdit.clinhour.split(" ")[1]),

          attandancemanual: Boolean(true),
          clockinipaddress: String(response?.data?.ip),
          shiftmode: String(attClockInEdit.shiftmode),

        }, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      }
      else {
        await axios.post(`${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`, {
          shiftendtime: String(attClockInEdit.shiftendtime),
          shiftname: String(attClockInEdit.shiftname),
          username: String(attClockInEdit.rowusername),
          userid: String(attClockInEdit.userid),
          // clockintime: String(attClockInEdit.clinhour + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds + ' ' + attClockInEdit.timeperiod),
          clockintime: String(attClockInEdit.clinhour.split(" ")[0] + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds + ' ' + attClockInEdit.clinhour.split(" ")[1]),

          date: String(moment(attClockInEdit.date, "DD/MM/YYYY").format("DD-MM-YYYY")),
          clockinipaddress: String(response?.data?.ip),
          status: true,
          clockouttime: "",
          buttonstatus: "true",
          autoclockout: Boolean(false),
          attandancemanual: Boolean(true),
          shiftmode: String(attClockInEdit.shiftmode),
        }, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });


      }
      await fetchFilteredUsersStatus();
      handleCloseEditClkIn();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setAttSettings(
        res?.data?.attendancecontrolcriteria[
        res?.data?.attendancecontrolcriteria?.length - 1
        ]
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getRemoveAttout = async (clockout, date, userid) => {
    if (clockout === "00:00:00") {
      setPopupContentMalert("Please Give ClockOut Then only Remove!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      let res = await axios.get(SERVICE.LOGINOUT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      res?.data?.attandances?.filter((d) => {
        if (
          d.userid === userid &&
          d.date === moment(date, "DD/MM/YYYY").format("DD-MM-YYYY")
        ) {
          setRemoveId(d._id);
        }
      });
      handleOutClickOpen();
    }
  };
  //get single row to edit....
  const getCodeClockOut = async (rowdata) => {

    hoursOptions = [];
    setHoursOptions([]);
    setAallHoursOptions([]);
    setDateOptions([]);
    try {
      let res_payrun = await axios.post(SERVICE.CHECK_PAYRUN_ISCREATED_FOR_ATTENDANCE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: rowdata.department,
        date: rowdata.finalDate,
      });

      const givenDate = new Date(rowdata.finalDate);
      const today = new Date();
      const diffInMs = today - givenDate;

      // Convert milliseconds to days
      const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

      // Condition: Check if the difference is more than 5 days
      const isMoreThan5Days = diffInDays > 5;

      const isPayrunGenerated = res_payrun?.data?.payrunlist.length > 0 && isMoreThan5Days;

      if (isPayrunGenerated) {
        setPopupContentMalert("Payrun Already Generated");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      else {
        let res = await axios.post(SERVICE.INDUSERSLOGINOUT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: moment(rowdata.rowformattedDate, "DD/MM/YYYY").format("DD-MM-YYYY"),
          userid: String(rowdata.userid),
        });

        res?.data?.attandances?.filter((d) => {
          if (d.userid === rowdata.userid && d.date === moment(rowdata.rowformattedDate, "DD/MM/YYYY").format("DD-MM-YYYY") && d.shiftmode === rowdata.shiftMode) {
            setGetAttIdClockOut(d._id);
          }
        })
        handleClickOpenEditClkOut();
        const [clockin, timeperiodClkIn] = rowdata.clockin.split(' ');
        let clockinfulltime = rowdata.clockin
        const [clockout, timeperiod] = rowdata.clockout.split(' ');
        let sdate = rowdata?.shift?.split('to');

        const currentHourParts = sdate[0].split(':');
        const endHourParts = sdate[1].split(':');
        const finalshifthourstart = currentHourParts[0] - attSeetings?.clockin;
        const finalshifthourend = Number(endHourParts[0]) + Number(attSeetings?.clockout);

        let startHour = parseInt(finalshifthourstart);
        const startAmPm = sdate[0].includes('PM') ? 'PM' : 'AM';

        let endHourValue = parseInt(finalshifthourend);
        const endAmPm = sdate[1].includes('PM') ? 'PM' : 'AM';

        if (startAmPm === 'PM' && startHour !== 12) {
          startHour += 12;
        } else if (startAmPm === 'AM' && startHour === 12) {
          startHour = 0;
        }

        if (endAmPm === 'PM' && endHourValue !== 12) {
          endHourValue += 12;
        } else if (endAmPm === 'AM' && endHourValue === 12) {
          endHourValue = 0;
        }

        if (startHour <= endHourValue) {
          for (let h = startHour; h <= endHourValue; h++) {
            const formattedHour = `${h % 12 || 12}`;
            const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
            hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
          }
        } else {
          for (let h = startHour; h <= 23; h++) {
            const formattedHour = `${h % 12 || 12}`;
            const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
            hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
          }

          for (let h = 0; h <= endHourValue; h++) {
            const formattedHour = `${h % 12 || 12}`;
            const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
            hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
          }
        }

        let fdate = rowdata.date.split(" ");
        if (sdate[0]?.includes("PM") && sdate[1]?.includes("AM")) {
          // Increment date by 1 day
          const nextDate = moment(rowdata.rowformattedDate, "DD/MM/YYYY").add(1, 'days').format("DD/MM/YYYY");
          const previousDate = moment(rowdata.rowformattedDate, "DD/MM/YYYY").subtract(1, 'days').format("DD/MM/YYYY");
          setDateOptions([previousDate, fdate[0], nextDate]);
        } else {
          const nextDate = moment(rowdata.rowformattedDate, "DD/MM/YYYY").add(1, 'days').format("DD/MM/YYYY");
          const previousDate = moment(rowdata.rowformattedDate, "DD/MM/YYYY").subtract(1, 'days').format("DD/MM/YYYY");
          setDateOptions([fdate[0], nextDate])
        }

        setAallHoursOptions(hoursOptions)

        let resshift = rowdata?.clockout?.split(':');
        let changeresshift = resshift[2].split(" ")

        let newobj = {
          userid: rowdata.userid,
          username: rowdata.username,
          rowusername: rowdata.rowusername,
          empcode: rowdata.empcode,
          date: fdate[0],
          predate: fdate[0],
          shift: rowdata.shift,
          shiftendtime: sdate[1] ? sdate[1] : "",
          shiftname: rowdata.shift ? rowdata.shift : "",
          shiftmode: rowdata.shiftMode,
          clockin: clockin,
          // clockinfulltime: clockinfulltime,
          clouthour: resshift[0] ? resshift[0] + " " + (resshift[2] && resshift[2].split(" ")[1] && resshift[2].split(" ")[1] != "undefined" && resshift[2].split(" ")[1] != undefined ? resshift[2].split(" ")[1] : "") : "00",
          cloutminute: resshift[1] ? resshift[1] : "00",
          cloutseconds: resshift[2].includes(" ") ? changeresshift[0] : "00",
          clockout: clockout,
          timeperiod: resshift[2] && resshift[2].split(" ")[1] && resshift[2].split(" ")[1] != "undefined" && resshift[2].split(" ")[1] != undefined ? resshift[2].split(" ")[1] : "",
          clockoutstatus: rowdata.clockoutstatus
        }
        if (sdate[0]?.includes("PM") && sdate[1]?.includes("AM")) {
          const result = hoursOptions.filter((data, index) => {
            return data.formattedtime != "PM"
          });
          setHoursOptions(result.map((t) => ({
            label: t.formattedHour,
            value: t.formattedtime,
          })));
        } else {
          setHoursOptions(hoursOptions.map((t) => ({
            label: t.formattedHour,
            value: t.formattedtime,
          })));
        }
        setAttClockOutEdit(newobj);



        let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA);
        let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


        // function generateTimeSlots(startTime, endTime) {
        //     function convertTo24Hour(time) {
        //         const [timePart, period] = [time.slice(0, -2), time.slice(-2)];
        //         let [hours, minutes] = timePart.split(':').map(Number);
        //         if (period === 'PM' && hours !== 12) hours += 12;
        //         if (period === 'AM' && hours === 12) hours = 0;
        //         return hours;
        //     }

        //     function formatTime(hours) {
        //         const period = hours >= 12 ? 'PM' : 'AM';
        //         const h = hours % 12 || 12;
        //         return `${String(h).padStart(2, '0')} ${period}`;
        //     }

        //     const start = convertTo24Hour(startTime);
        //     const end = convertTo24Hour(endTime);

        //     let slots = [];
        //     let currentHour = end;

        //     // Loop to generate time slots from end time until start time the next day
        //     while (true) {
        //         slots.push(formatTime(currentHour));
        //         if (currentHour === start) break;
        //         currentHour = (currentHour + 1) % 24;
        //     }

        //     return slots;
        // }


        // function adjustShiftTime(shift, criteria) {
        //     const clockin = parseInt(criteria, 10); // e.g., 2
        //     const [startTime, endTime] = shift.split("to");

        //     function timeToMinutes(time) {
        //         let [hours, minutes] = time.match(/\d{1,2}/g).map(Number);
        //         const isPM = time.includes("PM");

        //         if (isPM && hours !== 12) hours += 12;
        //         if (!isPM && hours === 12) hours = 0;

        //         return hours * 60 + minutes;
        //     }

        //     function minutesToTime(minutes) {
        //         let hours = Math.floor(minutes / 60) % 24;
        //         let minutesPart = minutes % 60;
        //         let isPM = hours >= 12;

        //         if (hours >= 12) {
        //             if (hours > 12) hours -= 12; 
        //         } else if (hours === 0) {
        //             hours = 12; 
        //         }

        //         if (hours === 12) {
        //             isPM = !isPM;
        //         }

        //         return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}${isPM ? "PM" : "AM"}`;
        //     }

        //     let newStartTimeMinutes = timeToMinutes(endTime) + (clockin * 60);
        //     if (newStartTimeMinutes >= 24 * 60) {
        //         newStartTimeMinutes -= 24 * 60;
        //     }

        //     const newStartTime = minutesToTime(newStartTimeMinutes);

        //     return { shift: `${newStartTime}to${startTime}` };

        // }

        // old
        // function generateTimeSlots(startTime, endTime) {
        //   // Helper function to convert 12-hour time format to 24-hour format
        //   function convertTo24Hour(time) {
        //     const [timePart, period] = [time.slice(0, -2).trim(), time.slice(-2)];
        //     let [hours, minutes] = timePart.split(':').map(Number);
        //     if (period === 'PM' && hours !== 12) hours += 12;
        //     if (period === 'AM' && hours === 12) hours = 0;
        //     return { hours, minutes };
        //   }

        //   // Helper function to format time in the desired 12-hour format (e.g., "06 AM")
        //   function formatTime(hours) {
        //     const period = hours >= 12 ? 'PM' : 'AM';
        //     const h = hours % 12 || 12;
        //     return `${String(h).padStart(2, '0')} ${period}`;
        //   }

        //   // Convert times to 24-hour format
        //   const start = convertTo24Hour(startTime);
        //   const end = convertTo24Hour(endTime);

        //   // Generate time slots
        //   let slots = [];
        //   let currentHour = start.hours;

        //   // Loop to generate time slots from start time to end time
        //   while (true) {
        //     slots.push(formatTime(currentHour));
        //     currentHour = (currentHour + 1) % 24;
        //     if (currentHour === (end.hours % 24)) break;
        //   }

        //   // Include the end time as the last slot
        //   slots.push(formatTime(end.hours));

        //   return slots;
        // }


        let clockintime = rowdata.clockin;

        let endtime = newobj.shift.split('to')[0];
        let formattedClockinTime = clockintime.split(':')[0] + ":" + clockintime.split(':')[1] + clockintime.split(' ')[1]; // "11:02AM"


        // function adjustShiftTime(shift, criteria) {
        //   const clockin = parseInt(criteria, 10); // e.g., 2

        //   // Extract the start and end times from the shift string
        //   const [startTime, endTime] = shift.split("to");

        //   // Function to convert 12-hour time format to minutes
        //   function timeToMinutes(time) {
        //     let [hours, minutes] = time.match(/\d{1,2}/g).map(Number);
        //     const isPM = time.includes("PM");

        //     if (isPM && hours !== 12) hours += 12;
        //     if (!isPM && hours === 12) hours = 0;

        //     return hours * 60 + minutes;
        //   }

        //   // Function to convert minutes back to 12-hour time format
        //   function minutesToTime(minutes) {
        //     let hours = Math.floor(minutes / 60) % 24;
        //     let minutesPart = minutes % 60;
        //     let isPM = hours >= 12;

        //     if (hours >= 12) {
        //       if (hours > 12) hours -= 12; // Convert 13 to 12-hour format (e.g., 13 to 1 PM)
        //     } else if (hours === 0) {
        //       hours = 12; // Midnight case (00:00 to 12:00 AM)
        //     }

        //     if (hours === 12) {
        //       isPM = !isPM;
        //     }

        //     return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}${isPM ? "PM" : "AM"}`;
        //   }

        //   // Convert start time to minutes and subtract clockin hours
        //   let newStartTimeMinutes = timeToMinutes(endTime) + (clockin * 60);

        //   // Adjust for rolling over midnight
        //   if (newStartTimeMinutes < 0) {
        //     newStartTimeMinutes += 24 * 60;
        //   }

        //   // Convert the adjusted time back to 12-hour format
        //   const newStartTime = minutesToTime(newStartTimeMinutes);
        //   // Create a new shift with the adjusted start time and unchanged end time
        //   const newShift = `${formattedClockinTime}to${newStartTime}`;
        //   return { shift: newShift };
        // }


        // let newobjshift = `${formattedClockinTime}to${endtime}`;
        let newobjshift = newobj.shift;


        let criteria = dataFromControlPanel[0]?.clockout ? dataFromControlPanel[0]?.clockout : 0;

        // let newobjresult = adjustShiftTime(newobjshift, criteria);
        // const startTime1 = newobjresult.shift.split("to")[0];
        // const endTime1 = newobjresult.shift.split("to")[1];
        // let hoursval = generateTimeSlots(startTime1, endTime1);

        // let finalhrs = hoursval.map(item => ({
        //   ...item,
        //   label: item,
        //   value: item
        // }))
        // setHoursOptionsConvertClockout(finalhrs)

        // today 31-12-2024
        function generateTimeSlots(startTime, endTime) {
          // Helper function to convert 12-hour time format to 24-hour format
          function convertTo24Hour(time) {
            const [timePart, period] = [time.slice(0, -2).trim(), time.slice(-2)];
            let [hours, minutes] = timePart.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return { hours, minutes };
          }

          // Helper function to format time in the desired 12-hour format
          function formatTime(hours, minutes = 0) {
            const period = hours >= 12 ? 'PM' : 'AM';
            const h = hours % 12 || 12;
            return `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
          }

          // Convert times to 24-hour format
          const start = convertTo24Hour(startTime);
          const end = convertTo24Hour(endTime);

          let slots = [];
          let currentHour = start.hours;

          // Generate time slots from start to end, considering wrap-around at midnight
          do {
            slots.push(formatTime(currentHour));
            currentHour = (currentHour + 1) % 24;
          } while (currentHour !== (end.hours + 1) % 24);

          return slots;
        }

        function adjustShiftTime(shift, criteria) {
          const clockin = parseInt(criteria, 10); // Adjust hours

          // Extract start and end times from the shift string
          const startTime = shift.slice(0, shift.indexOf("to"));
          const endTime = shift.slice(shift.indexOf("to") + 2);

          // Function to convert 12-hour time to minutes
          function timeToMinutes(time) {
            let [hours, minutes] = time.match(/\d{1,2}/g).map(Number);
            const isPM = time.includes("PM");

            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;

            return hours * 60 + minutes;
          }

          // Function to convert minutes back to 12-hour time format
          function minutesToTime(minutes) {
            let hours = Math.floor(minutes / 60) % 24;
            let minutesPart = minutes % 60;
            const period = hours >= 12 ? "PM" : "AM";

            hours = hours % 12 || 12; // Convert to 12-hour format
            return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}${period}`;
          }

          // Convert end time to minutes and adjust with the criteria
          const newEndTimeMinutes = (timeToMinutes(endTime) + clockin * 60) % (24 * 60);
          const adjustedEndTime = minutesToTime(newEndTimeMinutes);

          // Generate time slots from startTime to adjusted end time
          return generateTimeSlots(startTime, adjustedEndTime);
        }

        const finalHours = adjustShiftTime(rowdata.shift, criteria);
        // console.log(finalHours);
        const simplifiedHours = finalHours.map(item => {
          const hour = item?.split(':')[0];
          const period = item?.split(' ')[1];
          return `${hour} ${period}`;
        });

        // console.log(simplifiedHours);
        let finalhrs = simplifiedHours.map(item => ({
          ...item,
          label: item,
          value: item
        }))
        setHoursOptionsConvertClockout(finalhrs)
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendRequestClockOut = async () => {
    setPageName(!pageName)
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      let req = await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getAttIdClockOut}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        // clockouttime: String(attClockOutEdit.clouthour + ':' + attClockOutEdit.cloutminute + ':' + attClockOutEdit.cloutseconds + ' ' + attClockOutEdit.timeperiod),
        clockouttime: String(attClockOutEdit.clouthour.split(" ")[0] + ':' + attClockOutEdit.cloutminute + ':' + attClockOutEdit.cloutseconds + ' ' + attClockOutEdit.clouthour.split(" ")[1]),
        clockoutipaddress: String(response?.data?.ip),
        buttonstatus: "false",
        autoclockout: Boolean(false),
        attandancemanual: Boolean(true),
        shiftmode: String(attClockOutEdit.shiftmode),
      })

      await fetchFilteredUsersStatus();
      handleCloseEditClkOut();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const removeCloinout = async () => {
    setAttClockInEdit({
      ...attClockInEdit,
      clinhour: "00",
      clinminute: "00",
      clinseconds: "00",
    });
    setRemoveHide(false);
    try {
      let req = await axios.put(
        `${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${removeId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          clockintime: String("00:00:00"),
          buttonstatus: "false",
          attandancemanual: Boolean(true),
        }
      );

      await fetchFilteredUsersStatus();
      handleCloseMod();
      handleCloseEditClkIn();
      setPopupContent("Removed Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setRemoveHide(true);
    } catch (err) {
      setRemoveHide(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const removeCloout = async () => {
    setAttClockOutEdit({
      ...attClockOutEdit,
      clouthour: "00",
      cloutminute: "00",
      cloutseconds: "00",
    });
    setRemoveHide(false);
    try {
      let req = await axios.put(
        `${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${removeId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          clockouttime: String("00:00:00"),
          buttonstatus: "true",
          clockoutipaddress: String(""),
          attandancemanual: Boolean(false),
          autoclockout: Boolean(false),
        }
      );

      await fetchFilteredUsersStatus();
      handleOutCloseMod();
      handleCloseEditClkOut();
      setPopupContent("Removed Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setRemoveHide(true);
    } catch (err) {
      setRemoveHide(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleSubmitClkOutUpdate = () => {
    if (attClockOutEdit.clockin == "00:00:00") {
      setPopupContentMalert("Please Update ClockIn Time");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendRequestClockOut();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (filterUser.fromdate === "") {
      setPopupContentMalert("Please Select From Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (filterUser.todate === "") {
      setPopupContentMalert("Please Select To Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      setUserShifts([]);
      setItems([]);
      fetchFilteredUsersStatus();
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setLoader(false);
    setFilterUser({
      mode: "My Hierarchy List",
      level: "Primary",
      fromdate: today,
      todate: today,
      listpageaccessmode: listpageaccessby,
    });
    setSelectedMode("Today");
    setUserShifts([]);
    setItems([]);
    setPageAttTeam(1);
    // fetchClearFilteredUsersStatus();
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //serial no for listing items
  const addSerialNumber = async (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(userShifts);
  }, [userShifts]);

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      resizable: true,
      filterParams: {
        buttons: ["apply", "reset", "cancel"],
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }, []);

  // Function to handle filter changes
  const onFilterChanged = () => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel(); // Get the current filter model

      // Check if filters are active
      if (Object.keys(filterModel).length === 0) {
        // No filters active, clear the filtered data state
        setFilteredRowData([]);
      } else {
        // Filters are active, capture filtered data
        const filteredData = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
          filteredData.push(node.data); // Collect filtered row data
        });
        setFilteredRowData(filteredData);
      }
    }
  };

  const onPaginationChanged = useCallback(() => {
    if (gridRefTableAttTeam.current) {
      const gridApi = gridRefTableAttTeam.current.api;
      const currentPage = gridApi.paginationGetCurrentPage() + 1;
      const totalPagesAttTeam = gridApi.paginationGetTotalPages();
      setPageAttTeam(currentPage);
      setTotalPagesAttTeam(totalPagesAttTeam);
    }
  }, []);

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header", pinned: 'left', lockPinned: true,
    },
    {
      field: "empcode",
      headerName: "Employee Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header", pinned: 'left', lockPinned: true,
    },
    {
      field: "username",
      headerName: "Employee Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.username,
      headerClassName: "bold-header", pinned: 'left', lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 130,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 130,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 130,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 130,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "bookby",
      headerName: "BookBy",
      flex: 0,
      width: 200,
      hide: !columnVisibility.bookby,
      headerClassName: "bold-header",
      cellRenderer: (params) => {
        return (
          <Grid sx={{ display: 'flex' }}>
            <Button
              size="small"
              sx={{
                marginTop: '10px',
                textTransform: "capitalize",
                borderRadius: "4px",
                boxShadow: "none",
                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                fontWeight: "400",
                fontSize: "0.575rem",
                lineHeight: "1.43",
                letterSpacing: "0.01071em",
                display: "flex",
                padding: "3px 8px",
                cursor: "default",
                // color: "#052106",
                // backgroundColor: "rgb(156 239 156)",
                // "&:hover": {
                //   backgroundColor: "rgb(156 239 156)",
                //   color: "#052106",
                // },
                color: params.data.bookby === 'HOLIDAY' ? 'black' : params.data.bookby === 'ABSENT' ? '#462929' : params.data.bookby === "WEEKOFF" ? 'white' : '#052106',
                backgroundColor: params.data.bookby === 'HOLIDAY' ? '#B6FFFA' : params.data.bookby === "ABSENT" ? '#ff00007d' : params.data.bookby === "WEEKOFF" ? '#6b777991' : 'rgb(156 239 156)',
                '&:hover': {
                  color: params.data.bookby === 'HOLIDAY' ? 'black' : params.data.bookby === 'ABSENT' ? '#462929' : params.data.bookby === "WEEKOFF" ? 'white' : '#052106',
                  backgroundColor: params.data.bookby === 'HOLIDAY' ? '#B6FFFA' : params.data.bookby === "ABSENT" ? '#ff00007d' : params.data.bookby === "WEEKOFF" ? '#6b777991' : 'rgb(156 239 156)',
                }
              }}
            >
              {params.data.bookby}
            </Button>
          </Grid>
        );
      },
    },
    {
      field: "ipaddress",
      headerName: "IP Address",
      flex: 0,
      width: 150,
      hide: !columnVisibility.ipaddress,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 120,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "shift",
      headerName: "Shift",
      flex: 0,
      width: 150,
      hide: !columnVisibility.shift,
      headerClassName: "bold-header",
    },
    { field: "leavestatus", headerName: "Leave Status", flex: 0, width: 150, hide: !columnVisibility.leavestatus, },
    { field: "permissionstatus", headerName: "Permission Status", flex: 0, width: 150, hide: !columnVisibility.permissionstatus, },
    {
      field: "clockin",
      headerName: "ClockIn",
      flex: 0,
      width: 120,
      hide: !columnVisibility.clockin,
      headerClassName: "bold-header",
    },
    {
      field: "clockinstatus",
      headerName: "ClockInStatus",
      flex: 0,
      width: 200,
      hide: !columnVisibility.clockinstatus,
      headerClassName: "bold-header",
      cellRenderer: (params) => {
        return (
          <Grid sx={{ display: 'flex' }}>
            <Button
              size="small"
              sx={{
                marginTop: '10px',
                textTransform: "capitalize",
                borderRadius: "4px",
                boxShadow: "none",
                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                fontWeight: "400",
                fontSize: "0.575rem",
                lineHeight: "1.43",
                letterSpacing: "0.01071em",
                display: "flex",
                padding:
                  params.data.clockinstatus === "BeforeWeekOffAbsent"
                    ? "3px 5px"
                    : "3px 8px",
                cursor: "default",
                // color:
                //   params.data.clockinstatus === "Present" ||
                //     params.data.clockinstatus === "Early - ClockIn"
                //     ? "black"
                //     : params.data.clockinstatus === "Holiday"
                //       ? "black"
                //       : params.data.clockinstatus === "Leave"
                //         ? "white"
                //         : params.data.clockinstatus === "Absent"
                //           ? "#462929"
                //           : params.data.clockinstatus === "Week Off"
                //             ? "white"
                //             : params.data.clockinstatus === "Grace - ClockIn"
                //               ? "#052106"
                //               : params.data.clockinstatus === "On - Present"
                //                 ? "black"
                //                 : params.data.clockinstatus === "HBLOP"
                //                   ? "white"
                //                   : params.data.clockinstatus === "FLOP"
                //                     ? "white"
                //                     : params.data.clockinstatus === "AfterWeekOffAbsent"
                //                       ? "black"
                //                       : params.data.clockinstatus === "BeforeWeekOffAbsent"
                //                         ? "black"
                //                         : params.data.clockinstatus === "Late - ClockIn"
                //                           ? "#15111d"
                //                           : "#15111d",
                // backgroundColor:
                //   params.data.clockinstatus === "Present" ||
                //     params.data.clockinstatus === "Early - ClockIn"
                //     ? "rgb(156 239 156)"
                //     : params.data.clockinstatus === "Holiday"
                //       ? "#B6FFFA"
                //       : params.data.clockinstatus === "Leave"
                //         ? "#1640D6"
                //         : params.data.clockinstatus === "Absent"
                //           ? "#ff00007d"
                //           : params.data.clockinstatus === "Week Off"
                //             ? "#6b777991"
                //             : params.data.clockinstatus === "Grace - ClockIn"
                //               ? "rgb(243 203 117)"
                //               : params.data.clockinstatus === "On - Present"
                //                 ? "#E1AFD1"
                //                 : params.data.clockinstatus === "HBLOP"
                //                   ? "#DA0C81"
                //                   : params.data.clockinstatus === "FLOP"
                //                     ? "#FE0000"
                //                     : params.data.clockinstatus === "AfterWeekOffAbsent"
                //                       ? "#F2D1D1"
                //                       : params.data.clockinstatus === "BeforeWeekOffAbsent"
                //                         ? "#EEE3CB"
                //                         : params.data.clockinstatus === "Late - ClockIn"
                //                           ? "#610c9f57"
                //                           : "#610c9f57",
                // "&:hover": {
                //   color:
                //     params.data.clockinstatus === "Present" ||
                //       params.data.clockinstatus === "Early - ClockIn"
                //       ? "black"
                //       : params.data.clockinstatus === "Holiday"
                //         ? "black"
                //         : params.data.clockinstatus === "Leave"
                //           ? "white"
                //           : params.data.clockinstatus === "Absent"
                //             ? "#462929"
                //             : params.data.clockinstatus === "Week Off"
                //               ? "white"
                //               : params.data.clockinstatus === "Grace - ClockIn"
                //                 ? "#052106"
                //                 : params.data.clockinstatus === "On - Present"
                //                   ? "black"
                //                   : params.data.clockinstatus === "HBLOP"
                //                     ? "white"
                //                     : params.data.clockinstatus === "FLOP"
                //                       ? "white"
                //                       : params.data.clockinstatus === "AfterWeekOffAbsent"
                //                         ? "black"
                //                         : params.data.clockinstatus === "BeforeWeekOffAbsent"
                //                           ? "black"
                //                           : params.data.clockinstatus === "Late - ClockIn"
                //                             ? "#15111d"
                //                             : "#15111d",
                //   backgroundColor:
                //     params.data.clockinstatus === "Present" ||
                //       params.data.clockinstatus === "Early - ClockIn"
                //       ? "rgb(156 239 156)"
                //       : params.data.clockinstatus === "Holiday"
                //         ? "#B6FFFA"
                //         : params.data.clockinstatus === "Leave"
                //           ? "#1640D6"
                //           : params.data.clockinstatus === "Absent"
                //             ? "#ff00007d"
                //             : params.data.clockinstatus === "Week Off"
                //               ? "#6b777991"
                //               : params.data.clockinstatus === "Grace - ClockIn"
                //                 ? "rgb(243 203 117)"
                //                 : params.data.clockinstatus === "On - Present"
                //                   ? "#E1AFD1"
                //                   : params.data.clockinstatus === "HBLOP"
                //                     ? "#DA0C81"
                //                     : params.data.clockinstatus === "FLOP"
                //                       ? "#FE0000"
                //                       : params.data.clockinstatus === "AfterWeekOffAbsent"
                //                         ? "#F2D1D1"
                //                         : params.data.clockinstatus === "BeforeWeekOffAbsent"
                //                           ? "#EEE3CB"
                //                           : params.data.clockinstatus === "Late - ClockIn"
                //                             ? "#610c9f57"
                //                             : "#610c9f57",
                // },
                color: (params.data.clockinstatus === 'Present' || params.data.clockinstatus === 'Early - ClockIn') ? 'black' : params.data.clockinstatus === 'Holiday' ? 'black' : params.data.clockinstatus === 'Leave' ? 'white' : (params.data.clockinstatus === 'Absent' || params.data.clockinstatus?.includes('Long') || params.data.clockinstatus === 'BL - Absent') ? '#462929' : params.data.clockinstatus === 'Week Off' ? 'white' : params.data.clockinstatus === 'Grace - ClockIn' ? '#052106' : params.data.clockinstatus === 'On - Present' ? 'black' : params.data.clockinstatus === 'HBLOP' ? 'white' : params.data.clockinstatus === 'FLOP' ? 'white' : (params.data.clockinstatus === 'AfterWeekOffAbsent' || params.data.clockinstatus === 'AfterWeekOffLeave') ? 'black' : (params.data.clockinstatus === 'BeforeWeekOffAbsent' || params.data.clockinstatus === 'BeforeWeekOffLeave') ? 'black' : params.data.clockinstatus?.includes('Late') ? '#15111d' : '#15111d',
                backgroundColor: (params.data.clockinstatus === 'Present' || params.data.clockinstatus === 'Early - ClockIn') ? 'rgb(156 239 156)' : params.data.clockinstatus === 'Holiday' ? '#B6FFFA' : params.data.clockinstatus === 'Leave' ? '#1640D6' : (params.data.clockinstatus === "Absent" || params.data.clockinstatus?.includes('Long') || params.data.clockinstatus === 'BL - Absent') ? '#ff00007d' : params.data.clockinstatus === 'Week Off' ? '#6b777991' : params.data.clockinstatus === 'Grace - ClockIn' ? 'rgb(243 203 117)' : params.data.clockinstatus === 'On - Present' ? '#E1AFD1' : params.data.clockinstatus === 'HBLOP' ? '#DA0C81' : params.data.clockinstatus === 'FLOP' ? '#FE0000' : (params.data.clockinstatus === 'AfterWeekOffAbsent' || params.data.clockinstatus === 'AfterWeekOffLeave') ? '#F2D1D1' : (params.data.clockinstatus === 'BeforeWeekOffAbsent' || params.data.clockinstatus === 'BeforeWeekOffLeave') ? '#EEE3CB' : params.data.clockinstatus?.includes('Late') ? '#610c9f57' : 'rgb(243 203 117)',
                '&:hover': {
                  color: (params.data.clockinstatus === 'Present' || params.data.clockinstatus === 'Early - ClockIn') ? 'black' : params.data.clockinstatus === 'Holiday' ? 'black' : params.data.clockinstatus === 'Leave' ? 'white' : (params.data.clockinstatus === 'Absent' || params.data.clockinstatus?.includes('Long') || params.data.clockinstatus === 'BL - Absent') ? '#462929' : params.data.clockinstatus === 'Week Off' ? 'white' : params.data.clockinstatus === 'Grace - ClockIn' ? '#052106' : params.data.clockinstatus === 'On - Present' ? 'black' : params.data.clockinstatus === 'HBLOP' ? 'white' : params.data.clockinstatus === 'FLOP' ? 'white' : (params.data.clockinstatus === 'AfterWeekOffAbsent' || params.data.clockinstatus === 'AfterWeekOffLeave') ? 'black' : (params.data.clockinstatus === 'BeforeWeekOffAbsent' || params.data.clockinstatus === 'BeforeWeekOffLeave') ? 'black' : params.data.clockinstatus?.includes('Late') ? '#15111d' : '#15111d',
                  backgroundColor: (params.data.clockinstatus === 'Present' || params.data.clockinstatus === 'Early - ClockIn') ? 'rgb(156 239 156)' : params.data.clockinstatus === 'Holiday' ? '#B6FFFA' : params.data.clockinstatus === 'Leave' ? '#1640D6' : (params.data.clockinstatus === "Absent" || params.data.clockinstatus?.includes('Long') || params.data.clockinstatus === 'BL - Absent') ? '#ff00007d' : params.data.clockinstatus === 'Week Off' ? '#6b777991' : params.data.clockinstatus === 'Grace - ClockIn' ? 'rgb(243 203 117)' : params.data.clockinstatus === 'On - Present' ? '#E1AFD1' : params.data.clockinstatus === 'HBLOP' ? '#DA0C81' : params.data.clockinstatus === 'FLOP' ? '#FE0000' : (params.data.clockinstatus === 'AfterWeekOffAbsent' || params.data.clockinstatus === 'AfterWeekOffLeave') ? '#F2D1D1' : (params.data.clockinstatus === 'BeforeWeekOffAbsent' || params.data.clockinstatus === 'BeforeWeekOffLeave') ? '#EEE3CB' : params.data.clockinstatus?.includes('Late') ? '#610c9f57' : 'rgb(243 203 117)',
                }
              }}
            >
              {params.data.clockinstatus}
            </Button>
          </Grid>
        );
      },
    },
    {
      field: "clockout",
      headerName: "ClockOut",
      flex: 0,
      width: 120,
      hide: !columnVisibility.clockout,
      headerClassName: "bold-header",
    },
    {
      field: "clockoutstatus",
      headerName: "ClockOutStatus",
      flex: 0,
      width: 200,
      hide: !columnVisibility.clockoutstatus,
      headerClassName: "bold-header",
      cellRenderer: (params) => {
        return (
          <Grid sx={{ display: 'flex' }}>
            <Button
              size="small"
              sx={{
                marginTop: '10px',
                textTransform: "capitalize",
                borderRadius: "4px",
                boxShadow: "none",
                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                fontWeight: "400",
                fontSize: "0.575rem",
                lineHeight: "1.43",
                letterSpacing: "0.01071em",
                display: "flex",
                padding:
                  params.data.clockoutstatus === "BeforeWeekOffAbsent"
                    ? "3px 5px"
                    : "3px 8px",
                cursor: "default",
                // color:
                //   params.data.clockoutstatus === "Holiday"
                //     ? "black"
                //     : params.data.clockoutstatus === "Leave"
                //       ? "white"
                //       : params.data.clockoutstatus === "Absent"
                //         ? "#462929"
                //         : params.data.clockoutstatus === "Week Off"
                //           ? "white"
                //           : params.data.clockoutstatus === "On - ClockOut"
                //             ? "black"
                //             : params.data.clockoutstatus === "Over - ClockOut"
                //               ? "#052106"
                //               : params.data.clockoutstatus === "Mis - ClockOut"
                //                 ? "#15111d"
                //                 : params.data.clockoutstatus === "Early - ClockOut"
                //                   ? "#052106"
                //                   : params.data.clockoutstatus === "HBLOP"
                //                     ? "white"
                //                     : params.data.clockoutstatus === "FLOP"
                //                       ? "white"
                //                       : params.data.clockoutstatus === "AfterWeekOffAbsent"
                //                         ? "black"
                //                         : params.data.clockoutstatus === "BeforeWeekOffAbsent"
                //                           ? "black"
                //                           : params.data.clockoutstatus === "Pending"
                //                             ? "#052106"
                //                             : "#052106",
                // backgroundColor:
                //   params.data.clockoutstatus === "Holiday"
                //     ? "#B6FFFA"
                //     : params.data.clockoutstatus === "Leave"
                //       ? "#1640D6"
                //       : params.data.clockoutstatus === "Absent"
                //         ? "#ff00007d"
                //         : params.data.clockoutstatus === "Week Off"
                //           ? "#6b777991"
                //           : params.data.clockoutstatus === "On - ClockOut"
                //             ? "#E1AFD1"
                //             : params.data.clockoutstatus === "Over - ClockOut"
                //               ? "rgb(156 239 156)"
                //               : params.data.clockoutstatus === "Mis - ClockOut"
                //                 ? "#610c9f57"
                //                 : params.data.clockoutstatus === "Early - ClockOut"
                //                   ? "rgb(243 203 117)"
                //                   : params.data.clockoutstatus === "HBLOP"
                //                     ? "#DA0C81"
                //                     : params.data.clockoutstatus === "FLOP"
                //                       ? "#FE0000"
                //                       : params.data.clockoutstatus === "AfterWeekOffAbsent"
                //                         ? "#F2D1D1"
                //                         : params.data.clockoutstatus === "BeforeWeekOffAbsent"
                //                           ? "#EEE3CB"
                //                           : params.data.clockoutstatus === "Pending"
                //                             ? "rgb(243 203 117)"
                //                             : "rgb(243 203 117)",
                // "&:hover": {
                //   color:
                //     params.data.clockoutstatus === "Holiday"
                //       ? "black"
                //       : params.data.clockoutstatus === "Leave"
                //         ? "white"
                //         : params.data.clockoutstatus === "Absent"
                //           ? "#462929"
                //           : params.data.clockoutstatus === "Week Off"
                //             ? "white"
                //             : params.data.clockoutstatus === "On - ClockOut"
                //               ? "black"
                //               : params.data.clockoutstatus === "Over - ClockOut"
                //                 ? "#052106"
                //                 : params.data.clockoutstatus === "Mis - ClockOut"
                //                   ? "#15111d"
                //                   : params.data.clockoutstatus === "Early - ClockOut"
                //                     ? "#052106"
                //                     : params.data.clockoutstatus === "HBLOP"
                //                       ? "white"
                //                       : params.data.clockoutstatus === "FLOP"
                //                         ? "white"
                //                         : params.data.clockoutstatus === "AfterWeekOffAbsent"
                //                           ? "black"
                //                           : params.data.clockoutstatus === "BeforeWeekOffAbsent"
                //                             ? "black"
                //                             : params.data.clockoutstatus === "Pending"
                //                               ? "#052106"
                //                               : "#052106",
                //   backgroundColor:
                //     params.data.clockoutstatus === "Holiday"
                //       ? "#B6FFFA"
                //       : params.data.clockoutstatus === "Leave"
                //         ? "#1640D6"
                //         : params.data.clockoutstatus === "Absent"
                //           ? "#ff00007d"
                //           : params.data.clockoutstatus === "Week Off"
                //             ? "#6b777991"
                //             : params.data.clockoutstatus === "On - ClockOut"
                //               ? "#E1AFD1"
                //               : params.data.clockoutstatus === "Over - ClockOut"
                //                 ? "rgb(156 239 156)"
                //                 : params.data.clockoutstatus === "Mis - ClockOut"
                //                   ? "#610c9f57"
                //                   : params.data.clockoutstatus === "Early - ClockOut"
                //                     ? "rgb(243 203 117)"
                //                     : params.data.clockoutstatus === "HBLOP"
                //                       ? "#DA0C81"
                //                       : params.data.clockoutstatus === "FLOP"
                //                         ? "#FE0000"
                //                         : params.data.clockoutstatus === "AfterWeekOffAbsent"
                //                           ? "#F2D1D1"
                //                           : params.data.clockoutstatus === "BeforeWeekOffAbsent"
                //                             ? "#EEE3CB"
                //                             : params.data.clockoutstatus === "Pending"
                //                               ? "rgb(243 203 117)"
                //                               : "rgb(243 203 117)",
                // },
                color: params.data.clockoutstatus === 'Holiday' ? 'black' : params.data.clockoutstatus === 'Leave' ? 'white' : (params.data.clockoutstatus === 'Absent' || params.data.clockoutstatus?.includes('Long') || params.data.clockoutstatus === 'BL - Absent') ? '#462929' : params.data.clockoutstatus === 'Week Off' ? 'white' : params.data.clockoutstatus === 'On - ClockOut' ? 'black' : params.data.clockoutstatus === 'Over - ClockOut' ? '#052106' : params.data.clockoutstatus === 'Mis - ClockOut' ? '#15111d' : params.data.clockoutstatus?.includes('Early') ? '#052106' : params.data.clockoutstatus === 'HALOP' ? 'white' : params.data.clockoutstatus === 'FLOP' ? 'white' : (params.data.clockoutstatus === 'AfterWeekOffAbsent' || params.data.clockoutstatus === 'AfterWeekOffLeave') ? 'black' : (params.data.clockoutstatus === 'BeforeWeekOffAbsent' || params.data.clockoutstatus === 'BeforeWeekOffLeave') ? 'black' : params.data.clockoutstatus === 'Pending' ? '#052106' : '#052106',
                backgroundColor: params.data.clockoutstatus === 'Holiday' ? '#B6FFFA' : params.data.clockoutstatus === 'Leave' ? '#1640D6' : (params.data.clockoutstatus === "Absent" || params.data.clockoutstatus?.includes('Long') || params.data.clockoutstatus === 'BL - Absent') ? '#ff00007d' : params.data.clockoutstatus === 'Week Off' ? '#6b777991' : params.data.clockoutstatus === 'On - ClockOut' ? '#E1AFD1' : params.data.clockoutstatus === 'Over - ClockOut' ? 'rgb(156 239 156)' : params.data.clockoutstatus === 'Mis - ClockOut' ? '#610c9f57' : params.data.clockoutstatus?.includes('Early') ? 'rgb(243 203 117)' : params.data.clockoutstatus === 'HALOP' ? '#DA0C81' : params.data.clockoutstatus === 'FLOP' ? '#FE0000' : (params.data.clockoutstatus === 'AfterWeekOffAbsent' || params.data.clockoutstatus === 'AfterWeekOffLeave') ? '#F2D1D1' : (params.data.clockoutstatus === 'BeforeWeekOffAbsent' || params.data.clockoutstatus === 'BeforeWeekOffLeave') ? '#EEE3CB' : params.data.clockoutstatus === 'Pending' ? 'rgb(243 203 117)' : 'rgb(243 203 117)',
                '&:hover': {
                  color: params.data.clockoutstatus === 'Holiday' ? 'black' : params.data.clockoutstatus === 'Leave' ? 'white' : (params.data.clockoutstatus === 'Absent' || params.data.clockoutstatus?.includes('Long') || params.data.clockoutstatus === 'BL - Absent') ? '#462929' : params.data.clockoutstatus === 'Week Off' ? 'white' : params.data.clockoutstatus === 'On - ClockOut' ? 'black' : params.data.clockoutstatus === 'Over - ClockOut' ? '#052106' : params.data.clockoutstatus === 'Mis - ClockOut' ? '#15111d' : params.data.clockoutstatus?.includes('Early') ? '#052106' : params.data.clockoutstatus === 'HALOP' ? 'white' : params.data.clockoutstatus === 'FLOP' ? 'white' : (params.data.clockoutstatus === 'AfterWeekOffAbsent' || params.data.clockoutstatus === 'AfterWeekOffLeave') ? 'black' : (params.data.clockoutstatus === 'BeforeWeekOffAbsent' || params.data.clockoutstatus === 'BeforeWeekOffLeave') ? 'black' : params.data.clockoutstatus === 'Pending' ? '#052106' : '#052106',
                  backgroundColor: params.data.clockoutstatus === 'Holiday' ? '#B6FFFA' : params.data.clockoutstatus === 'Leave' ? '#1640D6' : (params.data.clockoutstatus === "Absent" || params.data.clockoutstatus?.includes('Long') || params.data.clockoutstatus === 'BL - Absent') ? '#ff00007d' : params.data.clockoutstatus === 'Week Off' ? '#6b777991' : params.data.clockoutstatus === 'On - ClockOut' ? '#E1AFD1' : params.data.clockoutstatus === 'Over - ClockOut' ? 'rgb(156 239 156)' : params.data.clockoutstatus === 'Mis - ClockOut' ? '#610c9f57' : params.data.clockoutstatus?.includes('Early') ? 'rgb(243 203 117)' : params.data.clockoutstatus === 'HALOP' ? '#DA0C81' : params.data.clockoutstatus === 'FLOP' ? '#FE0000' : (params.data.clockoutstatus === 'AfterWeekOffAbsent' || params.data.clockoutstatus === 'AfterWeekOffLeave') ? '#F2D1D1' : (params.data.clockoutstatus === 'BeforeWeekOffAbsent' || params.data.clockoutstatus === 'BeforeWeekOffLeave') ? '#EEE3CB' : params.data.clockoutstatus === 'Pending' ? 'rgb(243 203 117)' : 'rgb(243 203 117)',
                }
              }}
            >
              {params.data.clockoutstatus}
            </Button>
          </Grid>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      minHeight: "40px !important",
      filter: false,
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",

      cellRenderer: (params) =>
        <Grid sx={{ display: "flex", alignItems: "center", }}>
          {isUserRoleCompare?.includes("eteamattendancestatus") && (
            <>
              <Button sx={userStyle.buttonedit} disabled={!params.data.attendancemode?.includes("Hrms-Manual")}
                // disabled={(params.data.clockin === "00:00:00" || params.data.ipaddress === "")}
                variant="contained" onClick={() => { getCodeClockIn(params.data); }}  >
                Clock In
              </Button> &ensp;
              {(params.data.clockin !== "00:00:00" || params.data.ipaddress !== "") ?
                <Button sx={userStyle.buttonedit} disabled={!params.data.attendancemode?.includes("Hrms-Manual")} variant="contained" onClick={() => { getCodeClockOut(params.data); }}  >
                  Clock Out
                </Button>
                :
                <Chip
                  sx={{ height: "25px", borderRadius: "0px" }}
                  color={"warning"}
                  variant="outlined"
                  label={"No Clock-In"}
                />
              }
            </>
          )}
        </Grid>,
    },
  ];

  //Datatable
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQueryAttTeam(value);
    applyNormalFilter(value);
    setFilteredRowData([]);
  };

  const applyNormalFilter = (searchValue) => {

    // Split the search query into individual terms
    const searchTerms = searchValue.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filtered = items?.filter((item) => {
      return searchTerms.every((term) =>
        Object.values(item).join(" ").toLowerCase().includes(term)
      );
    });
    setFilteredDataItems(filtered);
    setPageAttTeam(1);
  };

  const applyAdvancedFilter = (filters, logicOperator) => {
    // Apply filtering logic with multiple conditions
    const filtered = items?.filter((item) => {
      return filters.reduce((acc, filter, index) => {
        const { column, condition, value } = filter;
        const itemValue = String(item[column])?.toLowerCase();
        const filterValue = String(value).toLowerCase();

        let match;
        switch (condition) {
          case "Contains":
            match = itemValue.includes(filterValue);
            break;
          case "Does Not Contain":
            match = !itemValue?.includes(filterValue);
            break;
          case "Equals":
            match = itemValue === filterValue;
            break;
          case "Does Not Equal":
            match = itemValue !== filterValue;
            break;
          case "Begins With":
            match = itemValue.startsWith(filterValue);
            break;
          case "Ends With":
            match = itemValue.endsWith(filterValue);
            break;
          case "Blank":
            match = !itemValue;
            break;
          case "Not Blank":
            match = !!itemValue;
            break;
          default:
            match = true;
        }

        // Combine conditions with AND/OR logic
        if (index === 0) {
          return match; // First filter is applied directly
        } else if (logicOperator === "AND") {
          return acc && match;
        } else {
          return acc || match;
        }
      }, true);
    });

    setFilteredDataItems(filtered); // Update filtered data
    setAdvancedFilter(filters);
    // handleCloseSearchAttTeam(); // Close the popover after search
  };

  // Undo filter funtion
  const handleResetSearch = () => {
    setAdvancedFilter(null);
    setSearchQueryAttTeam("");
    setFilteredDataItems(userShifts);
  };

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQueryAttTeam;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesAttTeam) {
      setPageAttTeam(newPage);
      gridRefTableAttTeam.current.api.paginationGoToPage(newPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSizeAttTeam(newSize);
    if (gridApi) {
      gridApi.paginationSetPageSize(newSize);
    }
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    if (!gridApi) return;

    setColumnVisibility((prevVisibility) => {
      const newVisibility = !prevVisibility[field];

      // Update the visibility in the grid
      gridApi.setColumnVisible(field, newVisibility);

      return {
        ...prevVisibility,
        [field]: newVisibility,
      };
    });
  };

  const handleColumnMoved = useCallback(debounce((event) => {
    if (!event.columnApi) return;

    const visible_columns = event.columnApi.getAllColumns().filter(col => {
      const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
      return colState && !colState.hide;
    }).map(col => col.colId);

    setColumnVisibility((prevVisibility) => {
      const updatedVisibility = { ...prevVisibility };

      // Ensure columns that are visible stay visible
      Object.keys(updatedVisibility).forEach(colId => {
        updatedVisibility[colId] = visible_columns.includes(colId);
      });

      return updatedVisibility;
    });
  }, 300), []);

  const handleColumnVisible = useCallback((event) => {
    const colId = event.column.getColId();

    // Update visibility based on event, but only when explicitly triggered by grid
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [colId]: event.visible, // Set visibility directly from the event
    }));
  }, []);

  // Excel
  const [fileFormat, setFormat] = useState("");
  let exportColumnNamescrt = [
    "Company", "Branch", "Unit", "Department", "Emp Code", "Employee Name", "Book By", "IP Address",
    "Date", "Shift", "Leave Status", "Permission Status", "ClockIn", "ClockOut", "ClockInStatus", "ClockOutStatus",
  ]
  let exportRowValuescrt = [
    "company", "branch", "unit", "department", "empcode", "username", "bookby", "ipaddress",
    "date", "shift", "leavestatus", "permissionstatus", "clockin", "clockout", "clockinstatus", "clockoutstatus",
  ]

  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Team Attendance",
    pageStyle: "print",
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageAttTeam.current) {
      domtoimage.toBlob(gridRefImageAttTeam.current)
        .then((blob) => {
          saveAs(blob, "Team Attendance.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  // Pagination for innter filter
  const getVisiblePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    const startPage = Math.max(1, pageAttTeam - 1);
    const endPage = Math.min(totalPagesAttTeam, startPage + maxVisiblePages - 1);

    // Loop through and add visible pageAttTeam numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // If there are more pages after the last visible pageAttTeam, show ellipsis
    if (endPage < totalPagesAttTeam) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };

  // Pagination for outer filter
  const filteredData = filteredDataItems?.slice((pageAttTeam - 1) * pageSizeAttTeam, pageAttTeam * pageSizeAttTeam);
  const totalPagesAttTeamOuter = Math.ceil(filteredDataItems?.length / pageSizeAttTeam);
  const visiblePages = Math.min(totalPagesAttTeamOuter, 3);
  const firstVisiblePage = Math.max(1, pageAttTeam - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttTeamOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageAttTeam * pageSizeAttTeam;
  const indexOfFirstItem = indexOfLastItem - pageSizeAttTeam;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

  const handleDateInChange = (e) => {
    if (attClockInEdit.date === e.target.value) {
      const result = allHoursOption.filter((data, index) => {
        return data.formattedtime != "AM";
      });
      setHoursOptions(
        result.map((t) => ({
          label: t.formattedHour,
          value: t.formattedtime,
        }))
      );
    } else {
      const result = allHoursOption.filter((data, index) => {
        return data.formattedtime != "PM";
      });
      setHoursOptions(
        result.map((t) => ({
          label: t.formattedHour,
          value: t.formattedtime,
        }))
      );
    }

    setAttClockInEdit({ ...attClockInEdit, predate: e.target.value });
  };

  const handleDateOutChange = (e) => {
    if (attClockOutEdit.date === e.target.value) {
      const result = allHoursOption.filter((data, index) => {
        return data.formattedtime != "AM";
      });
      setHoursOptions(
        result.map((t) => ({
          label: t.formattedHour,
          value: t.formattedtime,
        }))
      );
    } else {
      const result = allHoursOption.filter((data, index) => {
        return data.formattedtime != "PM";
      });
      setHoursOptions(
        result.map((t) => ({
          label: t.formattedHour,
          value: t.formattedtime,
        }))
      );
    }

    setAttClockOutEdit({ ...attClockOutEdit, predate: e.target.value });
  };

  return (
    <Box>
      <Headtitle title={"Team Attendance"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Team Attendance"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Attendance"
        subpagename="Attendance Update"
        subsubpagename="Team Attendance Status"
      />
      {isUserRoleCompare?.includes("lteamattendancestatus") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.importheadtext}> Team Attendance </Typography>
              </Grid>
              <>
                {listpageaccessby === "Reporting to Based" ? <></> :
                  <>
                    <Grid item lg={2} md={2.5} xs={12} sm={6}>
                      <Typography>
                        {" "}
                        Mode<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={modeDropDowns}
                        styles={colourStyles}
                        value={{ label: filterUser.mode, value: filterUser.mode }}
                        onChange={(e) => {
                          setFilterUser({ ...filterUser, mode: e.value });
                        }}
                      />
                    </Grid>
                    <Grid item lg={2} md={2.5} xs={12} sm={6}>
                      <Typography>
                        {" "}
                        Level<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <Selects
                        options={sectorDropDowns}
                        styles={colourStyles}
                        value={{ label: filterUser.level, value: filterUser.level }}
                        onChange={(e) => {
                          setFilterUser({ ...filterUser, level: e.value });
                        }}
                      />
                    </Grid>
                  </>}
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Filter Mode<b style={{ color: "red" }}>*</b> </Typography>
                    <Selects
                      labelId="mode-select-label"
                      options={mode}
                      value={{ label: selectedMode, value: selectedMode }}
                      onChange={(selectedOption) => {
                        // Reset the date fields to empty strings
                        let fromdate = '';
                        let todate = '';

                        // If a valid option is selected, get the date range
                        if (selectedOption.value) {
                          const dateRange = getDateRange(selectedOption.value);
                          fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                          todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                        }
                        // Set the state with formatted dates
                        setFilterUser({
                          ...filterUser,
                          fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                          todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                        });
                        setSelectedMode(selectedOption.value); // Update the mode
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      From Date<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      disabled={selectedMode != "Custom"}
                      value={filterUser.fromdate}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        // Ensure that the selected date is not in the future
                        const currentDate = new Date()
                          .toISOString()
                          .split("T")[0];
                        if (selectedDate <= currentDate) {
                          setFilterUser({
                            ...filterUser,
                            fromdate: selectedDate,
                            todate: selectedDate,
                          });
                        } else {
                          // Handle the case where the selected date is in the future (optional)
                          // You may choose to show a message or take other actions.
                          console.log("Please select a date on or before today.");
                        }
                      }}
                      // Set the max attribute to the current date
                      inputProps={{ max: new Date().toISOString().split("T")[0] }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      To Date<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      disabled={selectedMode != "Custom"}
                      value={filterUser.todate}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        // Ensure that the selected date is not in the future
                        const currentDate = new Date()
                          .toISOString()
                          .split("T")[0];
                        const fromdateval =
                          filterUser.fromdate != "" &&
                          new Date(filterUser.fromdate)
                            .toISOString()
                            .split("T")[0];
                        if (filterUser.fromdate == "") {
                          setPopupContentMalert("Please Select From Date");
                          setPopupSeverityMalert("warning");
                          handleClickOpenPopupMalert();
                        } else if (selectedDate < fromdateval) {
                          setFilterUser({ ...filterUser, todate: "" });
                          setPopupContentMalert("To Date should be after or equal to From Date");
                          setPopupSeverityMalert("warning");
                          handleClickOpenPopupMalert();
                        } else if (selectedDate <= currentDate) {
                          setFilterUser({ ...filterUser, todate: selectedDate });
                        } else {
                          console.log("Please select a date on or before today.");
                        }
                      }}
                      // Set the max attribute to the current date
                      inputProps={{
                        max: new Date().toISOString().split("T")[0],
                        min:
                          filterUser.fromdate !== "" ? filterUser.fromdate : null,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={6} >
                  <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                    <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmit} > Filter </Button>
                  </Box>
                </Grid>
                <Grid item lg={1} md={2} sm={2} xs={6}>
                  <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear} > Clear </Button>
                  </Box>
                </Grid>
              </>
            </Grid>
          </Box>
          <br />
          {/* ****** Table Start ****** */}
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                {" "}
                Team Attendance{" "}
              </Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeAttTeam}
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
                    <MenuItem value={userShifts?.length}>All</MenuItem>
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
                    "excelteamattendancestatus"
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
                  {isUserRoleCompare?.includes("csvteamattendancestatus") && (
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
                    "printteamattendancestatus"
                  ) && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          {" "}
                          &ensp; <FaPrint /> &ensp;Print&ensp;{" "}
                        </Button>
                      </>
                    )}
                  {isUserRoleCompare?.includes("pdfteamattendancestatus") && (
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
                    "imageteamattendancestatus"
                  ) && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          {" "}
                          <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                          &ensp;Image&ensp;{" "}
                        </Button>
                      </>
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
                            <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAttTeam} />
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
            </Grid>{" "}  <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns  </Button><br /> <br />
            {!loader ?
              <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box> :
              <>
                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAttTeam} >
                  <AgGridReact
                    rowData={filteredDataItems}
                    columnDefs={columnDataTable.filter((column) => columnVisibility[column.field])}
                    ref={gridRefTableAttTeam}
                    defaultColDef={defaultColDef}
                    domLayout={"autoHeight"}
                    getRowStyle={getRowStyle}
                    pagination={true}
                    paginationPageSize={pageSizeAttTeam}
                    onPaginationChanged={onPaginationChanged}
                    onGridReady={onGridReady}
                    onColumnMoved={handleColumnMoved}
                    onColumnVisible={handleColumnVisible}
                    onFilterChanged={onFilterChanged}
                    // suppressPaginationPanel={true}
                    suppressSizeToFit={true}
                    suppressAutoSize={true}
                    suppressColumnVirtualisation={true}
                    colResizeDefault={"shift"}
                    cellSelection={true}
                    copyHeadersToClipboard={true}
                  />
                </Box>
                {/* show and hide based on the inner filter and outer filter */}
                {/* <Box style={userStyle.dataTablestyle}>
                <Box>
                  Showing{" "}
                  {
                    gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                      (filteredDataItems.length > 0 ? (pageAttTeam - 1) * pageSizeAttTeam + 1 : 0)
                    ) : (
                      filteredRowData.length > 0 ? (pageAttTeam - 1) * pageSizeAttTeam + 1 : 0
                    )
                  }{" "}to{" "}
                  {
                    gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                      Math.min(pageAttTeam * pageSizeAttTeam, filteredDataItems.length)
                    ) : (
                      filteredRowData.length > 0 ? Math.min(pageAttTeam * pageSizeAttTeam, filteredRowData.length) : 0
                    )
                  }{" "}of{" "}
                  {
                    gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                      filteredDataItems.length
                    ) : (
                      filteredRowData.length
                    )
                  } entries
                </Box>
                <Box>
                  <Button onClick={() => handlePageChange(1)} disabled={pageAttTeam === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                  <Button onClick={() => handlePageChange(pageAttTeam - 1)} disabled={pageAttTeam === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                  {getVisiblePageNumbers().map((pageNumber, index) => (
                    <Button
                      key={index}
                      onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                      sx={{
                        ...userStyle.paginationbtn,
                        ...(pageNumber === "..." && {
                          cursor: "default",
                          color: "black",
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: "transparent",
                          border: "none",
                          "&:hover": {
                            backgroundColor: "transparent",
                            boxShadow: "none",
                          },
                        }),
                      }}
                      className={pageAttTeam === pageNumber ? "active" : ""}
                      disabled={pageAttTeam === pageNumber}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  <Button onClick={() => handlePageChange(pageAttTeam + 1)} disabled={pageAttTeam === totalPagesAttTeam} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                  <Button onClick={() => handlePageChange(totalPagesAttTeam)} disabled={pageAttTeam === totalPagesAttTeam} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                </Box>
              </Box> */}
              </>
            }
          </Box>
          {/* ****** Table End ****** */}
        </>
      )}

      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
      >
        <ManageColumnsContent
          handleClose={handleCloseManageColumns}
          searchQuery={searchQueryManage}
          setSearchQuery={setSearchQueryManage}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibility}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibility}
          initialColumnVisibility={initialColumnVisibility}
          columnDataTable={columnDataTable}
        />
      </Popover>

      {/* Search Bar */}
      <Popover
        id={idSearchAttTeam}
        open={openSearchAttTeam}
        anchorEl={anchorElSearchAttTeam}
        onClose={handleCloseSearchAttTeam}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
      >
        <AdvancedSearchBar columns={columnDataTable.filter(data => data.field !== "actions")} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryAttTeam} handleCloseSearch={handleCloseSearchAttTeam} />
      </Popover>

      {/* Alert  */}
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
      {/* EXTERNAL COMPONENTS -------------- END */}
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
        itemsTwo={items ?? []}
        filename={"Team Attendance"}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />

      {/* Edit Clock In */}
      <Dialog
        open={openEditClkIn}
        onClose={handleClickOpenEditClkIn}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Clock In Edit</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                <FormControl fullWidth size="small">
                  <TextField readOnly size="small" value={attClockInEdit.username} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Emp Code</Typography>
                <FormControl fullWidth size="small">
                  <TextField readOnly size="small" value={attClockInEdit.empcode} />
                </FormControl>
              </Grid>

              <Grid item md={3} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                <FormControl fullWidth size="small">
                  <TextField readOnly size="small" value={attClockInEdit.shift} />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date</Typography>
                {isReadClockIn ? (
                  <>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        placeholder="Mr."
                        value={attClockInEdit.predate}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        onChange={handleDateInChange}
                      >
                        {dateOptions?.map((data, i) => (
                          <MenuItem key={data} value={data}>
                            {data}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                ) : <>
                  <FormControl fullWidth size="small">
                    <TextField readOnly size="small" value={attClockInEdit.date} />
                  </FormControl>
                </>}
              </Grid>
              {/* <Grid item md={6} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Clock In Time</Typography>
                                <Grid sx={{ display: 'flex' }}>
                                    {
                                        isReadClockIn ? (
                                            <Box sx={{ display: 'flex' }}>
                                                <FormControl size="small" fullWidth>
                                                    <Selects fullWidth
                                                        maxMenuHeight={200}
                                                        styles={colourStyles}
                                                        options={hrsOptions}
                                                        value={{
                                                            label: attClockInEdit.clinhour,
                                                            value: attClockInEdit.clinhour,
                                                        }}
                                                        onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinhour: e.value })}
                                                    />

                                                </FormControl>
                                                <FormControl size="small" fullWidth>
                                                    <Selects fullWidth
                                                        maxMenuHeight={200}
                                                        styles={colourStyles}
                                                        options={minutssecOptions}
                                                        value={{
                                                            label: attClockInEdit.clinminute,
                                                            value: attClockInEdit.clinminute,
                                                        }}
                                                        onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinminute: e.value })}
                                                    />
                                                </FormControl>
                                                <FormControl size="small" fullWidth>
                                                    <Selects fullWidth
                                                        maxMenuHeight={200}
                                                        styles={colourStyles}
                                                        options={minutssecOptions}
                                                        value={{
                                                            label: attClockInEdit.clinseconds,
                                                            value: attClockInEdit.clinseconds,
                                                        }}
                                                        onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinseconds: e.value })}
                                                    />
                                                </FormControl>
                                                <FormControl size="small" fullWidth>
                                                    <Selects fullWidth
                                                        maxMenuHeight={200}
                                                        styles={colourStyles}
                                                        options={timeoptions}
                                                        value={{
                                                            label: attClockInEdit.timeperiod,
                                                            value: attClockInEdit.timeperiod,
                                                        }}
                                                        onChange={(e) => setAttClockInEdit({ ...attClockInEdit, timeperiod: e.value })}
                                                    />
                                                </FormControl>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex' }}>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput fullWidth
                                                        readOnly
                                                        value={attClockInEdit.clinhour + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds}
                                                        size='small'
                                                        sx={userStyle.input}
                                                        id="component-outlined"
                                                    />
                                                </FormControl>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput fullWidth
                                                        readOnly
                                                        value={attClockInEdit.timeperiod}
                                                        size='small'
                                                        sx={userStyle.input}
                                                        id="component-outlined"
                                                    />
                                                </FormControl>
                                            </Box>
                                        )}
                                    <Grid item md={1} lg={1}>
                                        <IconButton aria-label="Example" sx={{ marginTop: "5px" }}>
                                            {isReadClockIn ? (
                                                <>
                                                    <CheckCircleIcon onClick={(e) => { setIsReadClockIn(!isReadClockIn); }} style={{ color: "#216d21", cursor: 'pointer', fontSize: '1.05rem' }} fontSize='small' />

                                                </>
                                            ) : (
                                                <>
                                                    <FaEdit onClick={(e) => { setIsReadClockIn(!isReadClockIn); }} style={{ color: 'red', cursor: 'pointer' }} fontSize='small' />
                                                </>
                                            )}
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid> */}
              <Grid item md={6} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Clock In Time</Typography>
                <Grid container>
                  <Grid item md={11} xs={12} sm={12} >

                    {
                      isReadClockIn ? (
                        <Grid container>
                          <Grid item md={4} xs={4} sm={4} >
                            <FormControl size="small" fullWidth>
                              <Selects fullWidth
                                maxMenuHeight={200}
                                styles={colourStyles}
                                // options={hrsOptions}
                                options={hoursOptionconvert}
                                value={{
                                  label: attClockInEdit.clinhour,
                                  value: attClockInEdit.clinhour,
                                }}
                                onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinhour: e.value })}
                              />

                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={4} sm={4} >
                            <FormControl size="small" fullWidth>
                              <Selects fullWidth
                                maxMenuHeight={200}
                                styles={colourStyles}
                                options={minutssecOptions}
                                value={{
                                  label: attClockInEdit.clinminute,
                                  value: attClockInEdit.clinminute,
                                }}
                                onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinminute: e.value })}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={4} sm={4} >
                            <FormControl size="small" fullWidth>
                              <Selects fullWidth
                                maxMenuHeight={200}
                                styles={colourStyles}
                                options={minutssecOptions}
                                value={{
                                  label: attClockInEdit.clinseconds,
                                  value: attClockInEdit.clinseconds,
                                }}
                                onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinseconds: e.value })}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>


                      ) : (
                        <Box sx={{ display: 'flex' }}>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput fullWidth
                              readOnly
                              value={attClockInEdit.clinhour?.split(" ")[0] + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds}
                              size='small'
                              sx={userStyle.input}
                              id="component-outlined"
                            />
                          </FormControl>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput fullWidth
                              readOnly
                              value={attClockInEdit.clinhour?.split(" ")[1]}
                              size='small'
                              sx={userStyle.input}
                              id="component-outlined"
                            />
                          </FormControl>
                        </Box>
                      )}
                  </Grid>
                  <Grid item md={1} lg={1}>
                    <IconButton aria-label="Example" sx={{ marginTop: "5px" }}>
                      {isReadClockIn ? (
                        <>
                          <CheckCircleIcon onClick={(e) => { setIsReadClockIn(!isReadClockIn); }} style={{ color: "#216d21", cursor: 'pointer', fontSize: '1.05rem' }} fontSize='small' />

                        </>
                      ) : (
                        <>
                          <FaEdit onClick={(e) => { setIsReadClockIn(!isReadClockIn); }} style={{ color: 'red', cursor: 'pointer' }} fontSize='small' />
                        </>
                      )}
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              {removeHide &&
                <>
                  <Grid item md={2}>
                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={sendRequestClockIn} > {" "} Update{" "}  </Button>
                  </Grid>
                  <Grid item md={1}></Grid>
                  <Grid item md={2}>
                    <Button sx={buttonStyles.btncancel} onClick={handleCloseEditClkIn}> {" "} Cancel{" "} </Button>
                  </Grid>
                </>
              }
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Edit Clock Out */}
      <Dialog
        open={openEditClkOut}
        onClose={handleClickOpenEditClkOut}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Clock Out Edit</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                <FormControl fullWidth size="small">
                  <TextField readOnly size="small" value={attClockOutEdit.username} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Emp Code</Typography>
                <FormControl fullWidth size="small">
                  <TextField readOnly size="small" value={attClockOutEdit.empcode} />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                <FormControl fullWidth size="small">
                  <TextField readOnly size="small" value={attClockOutEdit.shift} />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date</Typography>
                {isReadClockOut ? (
                  <>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        placeholder="Mr."
                        value={attClockOutEdit.predate}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        onChange={handleDateOutChange}
                      >
                        {dateOptions?.map((data, i) => (
                          <MenuItem key={data} value={data}>
                            {data}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                ) : <>
                  <FormControl fullWidth size="small">
                    <TextField readOnly size="small" value={attClockOutEdit.date} />
                  </FormControl>
                </>}
              </Grid>
              <Grid item md={6} xs={12} sm={12} >
                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Clock Out Time</Typography>
                <Grid container>
                  <Grid item md={11} xs={12} sm={12} >
                    {
                      isReadClockOut ? (

                        <Grid container>
                          <Grid item md={4} xs={4} sm={4} >

                            <FormControl size="small" fullWidth>
                              <Selects fullWidth
                                maxMenuHeight={200}
                                styles={colourStyles}
                                // options={hrsOptions}
                                options={hoursOptionconvertclockout}
                                value={{
                                  label: attClockOutEdit.clouthour,
                                  value: attClockOutEdit.clouthour,
                                }}
                                onChange={(e) => setAttClockOutEdit({ ...attClockOutEdit, clouthour: e.value, })}
                              />

                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={4} sm={4} >
                            <FormControl size="small" fullWidth>
                              <Selects fullWidth
                                maxMenuHeight={200}
                                styles={colourStyles}
                                options={minutssecOptions}
                                value={{
                                  label: attClockOutEdit.cloutminute,
                                  value: attClockOutEdit.cloutminute,
                                }}
                                onChange={(e) => setAttClockOutEdit({ ...attClockOutEdit, cloutminute: e.value })}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={4} sm={4} >
                            <FormControl size="small" fullWidth>
                              <Selects fullWidth
                                maxMenuHeight={200}
                                styles={colourStyles}
                                options={minutssecOptions}
                                value={{
                                  label: attClockOutEdit.cloutseconds,
                                  value: attClockOutEdit.cloutseconds,
                                }}
                                onChange={(e) => setAttClockOutEdit({ ...attClockOutEdit, cloutseconds: e.value })}
                              />
                            </FormControl>

                          </Grid>
                        </Grid>

                      ) : (
                        <Box sx={{ display: 'flex' }}>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput fullWidth
                              readOnly
                              value={attClockOutEdit.clouthour?.split(" ")[0] + ':' + attClockOutEdit.cloutminute + ':' + attClockOutEdit.cloutseconds}
                              size='small'
                              sx={userStyle.input}
                              id="component-outlined"
                            />
                          </FormControl>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput fullWidth
                              readOnly
                              value={attClockOutEdit.clouthour?.split(" ")[1]}
                              size='small'
                              sx={userStyle.input}
                              id="component-outlined"
                            />
                          </FormControl>
                        </Box>
                      )}

                  </Grid>
                  <Grid item md={1} lg={1}>
                    <IconButton aria-label="Example" sx={{ marginTop: "5px" }}>
                      {isReadClockOut ? (
                        <CheckCircleIcon onClick={(e) => { setIsReadClockOut(!isReadClockOut); }} style={{ color: "#216d21", cursor: 'pointer', fontSize: '1.05rem' }} fontSize='small' />
                      ) : (
                        <>
                          <FaEdit onClick={(e) => { setIsReadClockOut(!isReadClockOut); }} style={{ color: 'red', cursor: 'pointer' }} fontSize='small' />&nbsp;&nbsp;&nbsp;&nbsp;
                          {attClockOutEdit.date === newtoday && <DeleteOutlineOutlinedIcon onClick={(e) => { getRemoveAttout(attClockOutEdit.clockout, attClockOutEdit.date, attClockOutEdit.userid) }} style={{ color: "green", cursor: 'pointer', fontSize: '1.05rem' }} fontSize='small' />}

                        </>
                      )}
                    </IconButton>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              {removeHide &&
                <>
                  <Grid item md={2}>
                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmitClkOutUpdate} > {" "} Update{" "}  </Button>
                  </Grid>
                  <Grid item md={1}></Grid>
                  <Grid item md={2}>
                    <Button sx={buttonStyles.btncancel} onClick={handleCloseEditClkOut}> {" "} Cancel{" "} </Button>
                  </Grid>
                </>
              }
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={removeCloinout}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isOutDeleteOpen}
        onClose={handleOutCloseMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            Are you sure?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOutCloseMod} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={removeCloout}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AttendanceIndividualStatus;