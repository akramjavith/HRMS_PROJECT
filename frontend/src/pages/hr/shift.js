import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  Select,
  MenuItem,
  TableBody,
  TableCell,
  TableRow,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
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
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import Selects from "react-select";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StyledDataGrid from "../../components/TableStyle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { Description } from "@material-ui/icons";
import Headtitle from "../../components/Headtitle";

function ShiftDetails() {
  let today = new Date();
  var hh = String(today.getHours()).padStart(2, "0");
  var min = String(today.getMinutes()).padStart(2, "0");

  const [timeValue, setTimeValue] = useState("");

  const placeholderText = timeValue === "" ? "HH:MM" : "";

  const [shift, setShift] = useState({
    name: "",
    fromhour: "",
    tohour: "",
    frommin: "",
    tomin: "",
    fromtime: "",
    totime: "",
    isallowance: "",
    payhours: "00:00",
    shifthours: "",
    workinghours: "",
    breakhours: "00:00",
  });
  const [shifts, setShifts] = useState([]);
  const [shiftsalledit, setShiftsalledit] = useState([]);
  const [totalShiftHours, settotalShiftHours] = useState([]);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //pay hours
  const [payHours, setPayHours] = useState("Hrs");
  const [payMinutes, setPayMinutes] = useState("Mins");
  const [payHrsOption, setPayHrsOption] = useState([]);
  const [payMinsOption, setPayMinsOption] = useState([]);

  //break hours
  const [breakHours, setBreakHours] = useState("Hrs");
  const [breakMinutes, setBreakMinutes] = useState("Mins");
  const [breakHrsOption, setBreakHrsOption] = useState([]);
  const [breakMinsOption, setBreakMinsOption] = useState([]);

  //pay hours
  const [payHoursEdit, setPayHoursEdit] = useState("Hrs");
  const [payMinutesEdit, setPayMinutesEdit] = useState("Mins");
  const [payHrsOptionEdit, setPayHrsOptionEdit] = useState([]);
  const [payMinsOptionEdit, setPayMinsOptionEdit] = useState([]);

  //break hours
  const [breakHoursEdit, setBreakHoursEdit] = useState("Hrs");
  const [breakMinutesEdit, setBreakMinutesEdit] = useState("Mins");
  const [breakHrsOptionEdit, setBreakHrsOptionEdit] = useState([]);
  const [breakMinsOptionEdit, setBreakMinsOptionEdit] = useState([]);

  const [shiftsid, setShiftsid] = useState({
    name: "",
    fromhour: "",
    tohour: "",
    frommin: "",
    tomin: "",
    fromtime: "",
    totime: "",
    isallowance: "",
    payhours: "00:00",
    shifthours: "",
    workinghours: "",
    breakhours: "00:00",
  });

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Shift.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [ovProj, setOvProj] = useState("");
  const [ovProjcount, setOvProjcount] = useState(0);
  const [getOverAllCount, setGetOverallCount] = useState("");

  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);

  const username = isUserRoleAccess.username;

  const [isShifts, setIsshifts] = useState(false);
  const { auth } = useContext(AuthContext);

  let printsno = 1;

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
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

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };


  const [isCheckOpenNew, setisCheckOpenNew] = useState(false);
  const handleClickOpenCheckNew = () => {
    setisCheckOpenNew(true);
  };
  const handleCloseCheckNew = () => {
    setisCheckOpenNew(false);
    handleCloseModcheckbox();

  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
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

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    from: true,
    to: true,
    payhours: true,
    shifthours: true,
    breakhours: true,
    workinghours: true,
    isallowance: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [deleteshift, setDeleteshift] = useState("");
  // set function to get particular row....
  const [checkUser, setCheckUser] = useState();

  //function to generate hrs
  const generatePayHrsOptions = (totalHours) => {
    const hrsOpt = [];
    for (let i = 0; i <= totalHours; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setPayHrsOption(hrsOpt);
  };
  //function to generate hrs
  const generatePayHrsOptionsEdit = (totalHours) => {
    const hrsOpt = [];
    for (let i = 0; i <= totalHours; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setPayHrsOptionEdit(hrsOpt);
  };

  //function to generate mins
  const generatePayMinsOptions = (payhr) => {
    const minsOpt = [];
    const [shifthr, shiftmin] = shift.shifthours.split(":").map(Number);
    if (payhr == shifthr) {
      for (let i = 0; i <= shiftmin; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minsOpt.push({ value: i.toString(), label: i.toString() });
      }
      setPayMinsOption(minsOpt);
    } else {
      for (let i = 0; i <= 59; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minsOpt.push({ value: i.toString(), label: i.toString() });
      }
      setPayMinsOption(minsOpt);
    }
  };
  //function to generate mins
  const generatePayMinsOptionsEdit = (payhr) => {
    const minsOpt = [];
    const [shifthr, shiftmin] = shiftsid.shifthours.split(":").map(Number);
    if (payhr == shifthr) {
      for (let i = 0; i <= shiftmin; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minsOpt.push({ value: i.toString(), label: i.toString() });
      }
      setPayMinsOptionEdit(minsOpt);
    } else {
      for (let i = 0; i <= 59; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minsOpt.push({ value: i.toString(), label: i.toString() });
      }
      setPayMinsOptionEdit(minsOpt);
    }
  };
  const generateBreakMinsOptions = (breakhr) => {
    const minsOpt = [];
    const [shifthr, shiftmin] = shift.shifthours.split(":").map(Number);
    if (breakhr == shifthr) {
      for (let i = 0; i <= shiftmin; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minsOpt.push({ value: i.toString(), label: i.toString() });
      }
      setBreakMinsOption(minsOpt);
    } else {
      for (let i = 0; i <= 59; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minsOpt.push({ value: i.toString(), label: i.toString() });
      }
      setBreakMinsOption(minsOpt);
    }
  };
  const generateBreakMinsOptionsEdit = (breakhr) => {
    const minsOpt = [];
    const [shifthr, shiftmin] = shiftsid.shifthours.split(":").map(Number);
    if (breakhr == shifthr) {
      for (let i = 0; i <= shiftmin; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minsOpt.push({ value: i.toString(), label: i.toString() });
      }
      setBreakMinsOptionEdit(minsOpt);
    } else {
      for (let i = 0; i <= 59; i++) {
        if (i < 10) {
          i = "0" + i;
        }
        minsOpt.push({ value: i.toString(), label: i.toString() });
      }
      setBreakMinsOptionEdit(minsOpt);
    }
  };
  useEffect(() => {
    calculateWorkingHours(breakMinutes);
  }, [shift.breakhours]);
  useEffect(() => {
    calculateWorkingHoursEdit(breakMinutes);
  }, [shiftsid.breakhours]);

  const calculateWorkingHours = (breakmin) => {
    // Splitting hours and minutes
    const [payHoursHours, payHoursMinutes] = shift.payhours
      .split(":")
      .map(Number);
    const [breakHoursHours, breakHoursMinutes] = shift.breakhours
      .split(":")
      .map(Number);

    // Subtracting break hours from pay hours
    let totalHours = payHoursHours - breakHoursHours;
    let totalMinutes =
      payHoursMinutes - Number(breakmin === "Mins" ? "00" : breakmin);

    // Handle cases where minutes become negative
    if (totalMinutes < 0) {
      totalHours -= 1;
      totalMinutes += 60;
    }

    // Handle cases where hours become negative
    if (totalHours < 0) {
      totalHours += 24; // Assuming a 24-hour work cycle
    }

    // Formatting total shift hours
    const formattedTotalShiftHours = `${totalHours < 10 ? "0" : ""
      }${totalHours}:${totalMinutes < 10 ? "0" : ""}${totalMinutes}`;

    setShift({ ...shift, workinghours: formattedTotalShiftHours });
  };
  const calculateWorkingHoursEdit = (breakmin) => {
    // Splitting hours and minutes
    const [payHoursHours, payHoursMinutes] = shiftsid.payhours
      .split(":")
      .map(Number);
    const [breakHoursHours, breakHoursMinutes] = shiftsid.breakhours
      .split(":")
      .map(Number);

    // Subtracting break hours from pay hours
    let totalHours = payHoursHours - breakHoursHours;
    let totalMinutes =
      payHoursMinutes - Number(breakmin === "Mins" ? "00" : breakmin);

    // Handle cases where minutes become negative
    if (totalMinutes < 0) {
      totalHours -= 1;
      totalMinutes += 60;
    }

    // Handle cases where hours become negative
    if (totalHours < 0) {
      totalHours += 24; // Assuming a 24-hour work cycle
    }

    // Formatting total shift hours
    const formattedTotalShiftHours = `${totalHours < 10 ? "0" : ""
      }${totalHours}:${totalMinutes < 10 ? "0" : ""}${totalMinutes}`;

    setShiftsid({ ...shiftsid, workinghours: formattedTotalShiftHours });
  };

  const calculateShiftHours = async (reference, inputValue) => {
    if (reference === "fromhourvalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(inputValue === "" ? 0 : inputValue, 10); // Use inputValue for fromhour
      if (shift.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shift.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      // Define toHour24
      let toHour24 = 0;
      if (shift.tohour !== "") {
        toHour24 = parseInt(shift.tohour, 10);
        if (shift.totime === "PM" && toHour24 !== 12) {
          toHour24 += 12;
        } else if (shift.totime === "AM" && toHour24 === 12) {
          toHour24 = 0;
        }
      }

      // Calculate the difference between from and to times
      let hoursDifference = 0;
      if (shift.totime === "PM" && shift.fromtime === "AM") {
        hoursDifference = 12 + toHour24 - fromHour24;
      } else {
        hoursDifference = toHour24 - fromHour24;
      }

      // Handle the case where the difference is negative (next day scenario)
      if (hoursDifference < 0) {
        hoursDifference += 24;
      }

      // Calculate the total minutes from the 'frommin' and 'tomin' values
      const totalFromMinutes = parseInt(
        shift.frommin === "" ? 0 : shift.frommin,
        10
      );
      const totalToMinutes = parseInt(shift.tomin === "" ? 0 : shift.tomin, 10);

      // Calculate the total minutes difference
      let minutesDifference = totalToMinutes - totalFromMinutes;

      // Adjust minutesDifference for negative values
      if (minutesDifference < 0) {
        minutesDifference += 60;
      }

      // Convert minutes difference to hours and add it to the existing hours difference
      const minfinal = minutesDifference / 60;
      hoursDifference += Math.floor(minfinal);

      // Calculate the remaining minutes after converting to hours
      const remainingMinutes = Math.round((minfinal % 1) * 60);

      // Construct the total shift hours string
      const totalShiftHours = `${hoursDifference}:${remainingMinutes}`;

      // Update the state with the calculated shift hours
      setShift({
        ...shift,
        fromhour: inputValue, // Update fromhour with inputValue
        shifthours: "",
        tomin: "",
        tohour: "",
        totime: "",
        name: inputValue + ':' + shift.frommin + shift.fromtime + 'to' + shift.tohour + ':' + shift.tomin + shift.totime,
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHours("Hrs");
      setPayMinutes("Mins");
      setPayHrsOption([]);
      setPayMinsOption([]);
      setBreakHours("Hrs");
      setBreakMinutes("Mins");
      setBreakHrsOption([]);
      setBreakMinsOption([]);
    } else if (reference === "fromminutesvalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(shift.fromhour === "" ? 0 : shift.fromhour, 10);
      if (shift.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shift.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      let toHour24 = parseInt(shift.tohour === "" ? 0 : shift.tohour, 10);
      if (shift.totime === "PM" && toHour24 !== 12) {
        toHour24 += 12;
      } else if (shift.totime === "AM" && toHour24 === 12) {
        toHour24 = 0;
      }

      // Calculate the hours difference
      let hoursDifference = toHour24 - fromHour24;

      // If the "to" time is earlier than the "from" time, it means the shift crosses over midnight
      if (hoursDifference < 0) {
        hoursDifference += 24; // Add 24 hours to handle the next day scenario
      }

      // Calculate the minutes difference
      let minutesDifference =
        parseInt(shift.tomin === "" ? 0 : shift.tomin, 10) -
        parseInt(inputValue, 10);

      // If minutesDifference is negative, adjust it by subtracting from the hours difference
      if (minutesDifference < 0) {
        minutesDifference += 60;
        hoursDifference--; // Subtract one hour to account for the minute difference
      }

      // Calculate total shift hours and minutes
      const totalShiftHours = `${hoursDifference}:${minutesDifference}`;

      // Update the state with the calculated shift hours
      setShift({
        ...shift,
        frommin: inputValue,
        name: shift.fromhour + ':' + inputValue + shift.fromtime + 'to' + shift.tohour + ':' + shift.tomin + shift.totime,
        shifthours: "",
        tomin: "",
        tohour: "",
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHours("Hrs");
      setPayMinutes("Mins");
      setPayHrsOption([]);
      setPayMinsOption([]);
      setBreakHours("Hrs");
      setBreakMinutes("Mins");
      setBreakHrsOption([]);
      setBreakMinsOption([]);
    } else if (reference == "fromtimevalue") {
      // Destructure shift from state
      const { fromhour, frommin, fromtime, tohour, tomin, totime } = shift;

      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(fromhour === "" ? 0 : fromhour, 10);
      if (fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }
      let toHour24 = parseInt(tohour === "" ? 0 : tohour, 10);
      if (totime === "PM" && toHour24 !== 12) {
        toHour24 += 12;
      } else if (totime === "AM" && toHour24 === 12) {
        toHour24 = 0;
      }

      // Handle case where fromtimevalue is PM and totimevalue is AM
      if (fromtime === "PM" && totime === "AM") {
        toHour24 += 24; // Add 24 hours to toHour24 to handle next day scenario
      }

      // Calculate the time difference
      let hoursDifference = toHour24 - fromHour24;
      if (hoursDifference < 0) {
        hoursDifference += 24; // Adjust for negative difference (next day scenario)
      }
      const minutesDifference =
        parseInt(tomin === "" ? 0 : tomin, 10) -
        parseInt(frommin === "" ? 0 : frommin, 10);
      const minfinal = minutesDifference / 60;

      // Calculate total shift hours
      const totalShiftHours = `${hoursDifference}:${Math.round(minfinal * 60)}`;

      // Update the state with the calculated shift hours
      setShift({
        ...shift,
        [reference === "fromhourvalue"
          ? "fromhour"
          : reference === "fromminutesvalue"
            ? "frommin"
            : reference === "fromtimevalue"
              ? "fromtime"
              : reference === "tohourvalue"
                ? "tohour"
                : reference === "tominutesvalue"
                  ? "tomin"
                  : "totime"]: inputValue,
        name: shift.fromhour + ':' + shift.frommin + inputValue + 'to' + shift.tohour + ':' + shift.tomin + shift.totime,
        shifthours: "",
        tomin: "",
        tohour: "",
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHours("Hrs");
      setPayMinutes("Mins");
      setPayHrsOption([]);
      setPayMinsOption([]);
      setBreakHours("Hrs");
      setBreakMinutes("Mins");
      setBreakHrsOption([]);
      setBreakMinsOption([]);
    } else if (reference == "tohourvalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(shift.fromhour === "" ? 0 : shift.fromhour, 10);
      if (shift.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shift.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      // Define toHour24
      let toHour24 = 0;
      if (inputValue !== "") {
        toHour24 = parseInt(inputValue, 10);
        if (shift.totime === "PM" && toHour24 !== 12) {
          toHour24 += 12;
        } else if (shift.totime === "AM" && toHour24 === 12) {
          toHour24 = 0;
        }
      }

      // Calculate the difference between from and to times
      let hoursDifference = 0;
      if (shift.totime === "PM" && shift.fromtime === "AM") {
        hoursDifference = 12 + toHour24 - fromHour24;
      } else {
        hoursDifference = toHour24 - fromHour24;
      }

      // Handle the case where the difference is negative (next day scenario)
      if (hoursDifference < 0) {
        hoursDifference += 24;
      }

      // Calculate the total shift hours and minutes
      const minutesDifference =
        parseInt(shift.tomin === "" ? 0 : shift.tomin, 10) -
        parseInt(shift.frommin === "" ? 0 : shift.frommin, 10);
      const minfinal = minutesDifference / 60;

      // Construct the total shift hours string
      const totalShiftHours = `${hoursDifference}:${Math.round(minfinal * 60)}`;

      // Update the state with the calculated shift hours
      setShift({
        ...shift,
        tohour: inputValue,
        name: shift.fromhour + ':' + shift.frommin + shift.fromtime + 'to' + inputValue + ':' + shift.tomin + shift.totime,
        shifthours: "",
        tomin: "",
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHours("Hrs");
      setPayMinutes("Mins");
      setPayHrsOption([]);
      setPayMinsOption([]);
      setBreakHours("Hrs");
      setBreakMinutes("Mins");
      setBreakHrsOption([]);
      setBreakMinsOption([]);
    } else if (reference == "tominutesvalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(shift.fromhour === "" ? 0 : shift.fromhour, 10);
      if (shift.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shift.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      let toHour24 = parseInt(shift.tohour === "" ? 0 : shift.tohour, 10);
      if (shift.totime === "PM" && toHour24 !== 12) {
        toHour24 += 12;
      } else if (shift.totime === "AM" && toHour24 === 12) {
        toHour24 = 0;
      }

      // Calculate the hours difference
      let hoursDifference = toHour24 - fromHour24;

      // If the "to" time is in the AM and "from" time is in the PM, adjust the hours difference
      if (
        shift.totime === "AM" &&
        shift.fromtime === "PM" &&
        hoursDifference < 0
      ) {
        hoursDifference += 24; // Add 24 hours to handle the next day scenario
      }

      // Calculate the minutes difference
      let minutesDifference =
        parseInt(inputValue, 10) +
        fromHour24 * 60 -
        (toHour24 * 60 + parseInt(shift.tomin === "" ? 0 : shift.tomin, 10));

      // If minutesDifference is negative, adjust it
      if (minutesDifference < 0) {
        minutesDifference += 24 * 60; // Add 24 hours in minutes to handle the next day scenario
      }

      // Convert minutes difference to hours
      const hoursFinal = minutesDifference / 60;

      // Calculate total shift hours
      const totalShiftHours =
        String(hoursDifference).length === 2
          ? hoursDifference + ":" + hoursFinal
          : "0" + hoursDifference + ":" + hoursFinal;

      // Update the state with the calculated shift hours
      setShift({
        ...shift,
        tomin: inputValue,
        name: shift.fromhour + ':' + shift.frommin + shift.fromtime + 'to' + shift.tohour + ':' + inputValue + shift.totime,
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHours("Hrs");
      setPayMinutes("Mins");
      setPayHrsOption([]);
      setPayMinsOption([]);
      setBreakHours("Hrs");
      setBreakMinutes("Mins");
      setBreakHrsOption([]);
      setBreakMinsOption([]);
    } else if (reference == "totimevalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(shift.fromhour === "" ? 0 : shift.fromhour, 10);
      if (shift.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shift.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      let toHour24 = parseInt(shift.tohour === "" ? 0 : shift.tohour, 10);
      if (inputValue === "PM" && toHour24 !== 12) {
        toHour24 += 12;
      } else if (inputValue === "AM" && toHour24 === 12) {
        toHour24 = 0;
      }

      // Handle case where fromtime is PM and totime is AM
      if (shift.fromtime === "PM" && inputValue === "AM") {
        toHour24 += 24; // Add 24 hours to toHour24 to handle next day scenario
      }

      // Calculate the time difference
      let hoursDifference = toHour24 - fromHour24;

      // If the "to" time is earlier than the "from" time, adjust the hours difference
      if (hoursDifference < 0) {
        hoursDifference += 24; // Add 24 hours to handle the next day scenario
      }

      // Calculate the minutes difference
      let minutesDifference =
        toHour24 * 60 +
        parseInt(shift.tomin === "" ? 0 : shift.tomin, 10) - // Convert to minutes
        (fromHour24 * 60 +
          parseInt(shift.frommin === "" ? 0 : shift.frommin, 10)); // Convert to minutes

      // If minutesDifference is negative, adjust it by subtracting from the hours difference
      if (minutesDifference < 0) {
        minutesDifference += 60;
        hoursDifference--; // Subtract one hour to account for the minute difference
      }

      // Calculate total shift hours and minutes
      const totalHours = Math.floor(minutesDifference / 60);
      const totalMinutes = minutesDifference % 60;

      // Format total shift hours and minutes
      const totalShiftHours = `${totalHours < 10 ? "0" + totalHours : totalHours
        }:${totalMinutes < 10 ? "0" + totalMinutes : totalMinutes}`;

      // Update the state with the calculated shift hours
      setShift({
        ...shift,
        totime: inputValue,
        name: shift.fromhour + ':' + shift.frommin + shift.fromtime + 'to' + shift.tohour + ':' + shift.tomin + inputValue,
        shifthours: totalShiftHours,
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHours("Hrs");
      setPayMinutes("Mins");
      setPayMinsOption([]);
      setBreakHours("Hrs");
      setBreakMinutes("Mins");
      setBreakHrsOption([]);
      setBreakMinsOption([]);

      await generatePayHrsOptions(totalHours);
    }
  };

  const calculateShiftHoursEdit = async (reference, inputValue) => {
    if (reference === "fromhourvalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(inputValue === "" ? 0 : inputValue, 10); // Use inputValue for fromhour
      if (shiftsid.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shiftsid.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      // Define toHour24
      let toHour24 = 0;
      if (shiftsid.tohour !== "") {
        toHour24 = parseInt(shiftsid.tohour, 10);
        if (shiftsid.totime === "PM" && toHour24 !== 12) {
          toHour24 += 12;
        } else if (shiftsid.totime === "AM" && toHour24 === 12) {
          toHour24 = 0;
        }
      }

      // Calculate the difference between from and to times
      let hoursDifference = 0;
      if (shiftsid.totime === "PM" && shiftsid.fromtime === "AM") {
        hoursDifference = 12 + toHour24 - fromHour24;
      } else {
        hoursDifference = toHour24 - fromHour24;
      }

      // Handle the case where the difference is negative (next day scenario)
      if (hoursDifference < 0) {
        hoursDifference += 24;
      }

      // Calculate the total minutes from the 'frommin' and 'tomin' values
      const totalFromMinutes = parseInt(
        shiftsid.frommin === "" ? 0 : shiftsid.frommin,
        10
      );
      const totalToMinutes = parseInt(
        shiftsid.tomin === "" ? 0 : shiftsid.tomin,
        10
      );

      // Calculate the total minutes difference
      let minutesDifference = totalToMinutes - totalFromMinutes;

      // Adjust minutesDifference for negative values
      if (minutesDifference < 0) {
        minutesDifference += 60;
      }

      // Convert minutes difference to hours and add it to the existing hours difference
      const minfinal = minutesDifference / 60;
      hoursDifference += Math.floor(minfinal);

      // Calculate the remaining minutes after converting to hours
      const remainingMinutes = Math.round((minfinal % 1) * 60);

      // Construct the total shiftsid hours string
      const totalShiftHours = `${hoursDifference}:${remainingMinutes}`;

      // Update the state with the calculated shiftsid hours
      setShiftsid({
        ...shiftsid,
        fromhour: inputValue, // Update fromhour with inputValue
        shifthours: "",
        name: inputValue + ':' + shiftsid.frommin + shiftsid.fromtime + 'to' + shiftsid.tohour + ':' + shiftsid.tomin + shiftsid.totime,
        tomin: "",
        tohour: "",
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHoursEdit("Hrs");
      setPayMinutesEdit("Mins");
      setPayHrsOptionEdit([]);
      setPayMinsOptionEdit([]);
      setBreakHoursEdit("Hrs");
      setBreakMinutesEdit("Mins");
      setBreakHrsOptionEdit([]);
      setBreakMinsOptionEdit([]);
    } else if (reference === "fromminutesvalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(
        shiftsid.fromhour === "" ? 0 : shiftsid.fromhour,
        10
      );
      if (shiftsid.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shiftsid.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      let toHour24 = parseInt(shiftsid.tohour === "" ? 0 : shiftsid.tohour, 10);
      if (shiftsid.totime === "PM" && toHour24 !== 12) {
        toHour24 += 12;
      } else if (shiftsid.totime === "AM" && toHour24 === 12) {
        toHour24 = 0;
      }

      // Calculate the hours difference
      let hoursDifference = toHour24 - fromHour24;

      // If the "to" time is earlier than the "from" time, it means the shiftsid crosses over midnight
      if (hoursDifference < 0) {
        hoursDifference += 24; // Add 24 hours to handle the next day scenario
      }

      // Calculate the minutes difference
      let minutesDifference =
        parseInt(shiftsid.tomin === "" ? 0 : shiftsid.tomin, 10) -
        parseInt(inputValue, 10);

      // If minutesDifference is negative, adjust it by subtracting from the hours difference
      if (minutesDifference < 0) {
        minutesDifference += 60;
        hoursDifference--; // Subtract one hour to account for the minute difference
      }

      // Calculate total shiftsid hours and minutes
      const totalShiftHours = `${hoursDifference}:${minutesDifference}`;

      // Update the state with the calculated shiftsid hours
      setShiftsid({
        ...shiftsid,
        frommin: inputValue,
        shifthours: "",
        name: shiftsid.fromhour + ':' + inputValue + shiftsid.fromtime + 'to' + shiftsid.tohour + ':' + shiftsid.tomin + shiftsid.totime,
        tomin: "",
        tohour: "",
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHoursEdit("Hrs");
      setPayMinutesEdit("Mins");
      setPayHrsOptionEdit([]);
      setPayMinsOptionEdit([]);
      setBreakHoursEdit("Hrs");
      setBreakMinutesEdit("Mins");
      setBreakHrsOptionEdit([]);
      setBreakMinsOptionEdit([]);
    } else if (reference == "fromtimevalue") {
      // Destructure shiftsid from state
      const { fromhour, frommin, fromtime, tohour, tomin, totime } = shiftsid;

      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(fromhour === "" ? 0 : fromhour, 10);
      if (fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }
      let toHour24 = parseInt(tohour === "" ? 0 : tohour, 10);
      if (totime === "PM" && toHour24 !== 12) {
        toHour24 += 12;
      } else if (totime === "AM" && toHour24 === 12) {
        toHour24 = 0;
      }

      // Handle case where fromtimevalue is PM and totimevalue is AM
      if (fromtime === "PM" && totime === "AM") {
        toHour24 += 24; // Add 24 hours to toHour24 to handle next day scenario
      }

      // Calculate the time difference
      let hoursDifference = toHour24 - fromHour24;
      if (hoursDifference < 0) {
        hoursDifference += 24; // Adjust for negative difference (next day scenario)
      }
      const minutesDifference =
        parseInt(tomin === "" ? 0 : tomin, 10) -
        parseInt(frommin === "" ? 0 : frommin, 10);
      const minfinal = minutesDifference / 60;

      // Calculate total shiftsid hours
      const totalShiftHours = `${hoursDifference}:${Math.round(minfinal * 60)}`;

      // Update the state with the calculated shiftsid hours
      setShiftsid({
        ...shiftsid,
        [reference === "fromhourvalue"
          ? "fromhour"
          : reference === "fromminutesvalue"
            ? "frommin"
            : reference === "fromtimevalue"
              ? "fromtime"
              : reference === "tohourvalue"
                ? "tohour"
                : reference === "tominutesvalue"
                  ? "tomin"
                  : "totime"]: inputValue,
        name: shiftsid.fromhour + ':' + shiftsid.frommin + inputValue + 'to' + shiftsid.tohour + ':' + shiftsid.tomin + shiftsid.totime,
        shifthours: "",
        tomin: "",
        tohour: "",
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHoursEdit("Hrs");
      setPayMinutesEdit("Mins");
      setPayHrsOptionEdit([]);
      setPayMinsOptionEdit([]);
      setBreakHoursEdit("Hrs");
      setBreakMinutesEdit("Mins");
      setBreakHrsOptionEdit([]);
      setBreakMinsOptionEdit([]);
    } else if (reference == "tohourvalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(
        shiftsid.fromhour === "" ? 0 : shiftsid.fromhour,
        10
      );
      if (shiftsid.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shiftsid.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      // Define toHour24
      let toHour24 = 0;
      if (inputValue !== "") {
        toHour24 = parseInt(inputValue, 10);
        if (shiftsid.totime === "PM" && toHour24 !== 12) {
          toHour24 += 12;
        } else if (shiftsid.totime === "AM" && toHour24 === 12) {
          toHour24 = 0;
        }
      }

      // Calculate the difference between from and to times
      let hoursDifference = 0;
      if (shiftsid.totime === "PM" && shiftsid.fromtime === "AM") {
        hoursDifference = 12 + toHour24 - fromHour24;
      } else {
        hoursDifference = toHour24 - fromHour24;
      }

      // Handle the case where the difference is negative (next day scenario)
      if (hoursDifference < 0) {
        hoursDifference += 24;
      }

      // Calculate the total shiftsid hours and minutes
      const minutesDifference =
        parseInt(shiftsid.tomin === "" ? 0 : shiftsid.tomin, 10) -
        parseInt(shiftsid.frommin === "" ? 0 : shiftsid.frommin, 10);
      const minfinal = minutesDifference / 60;

      // Construct the total shiftsid hours string
      const totalShiftHours = `${hoursDifference}:${Math.round(minfinal * 60)}`;

      // Update the state with the calculated shiftsid hours
      setShiftsid({
        ...shiftsid,
        tohour: inputValue,
        name: shiftsid.fromhour + ':' + shiftsid.frommin + shiftsid.fromtime + 'to' + inputValue + ':' + shiftsid.tomin + shiftsid.totime,
        shifthours: "",
        tomin: "",
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHoursEdit("Hrs");
      setPayMinutesEdit("Mins");
      setPayHrsOptionEdit([]);
      setPayMinsOptionEdit([]);
      setBreakHoursEdit("Hrs");
      setBreakMinutesEdit("Mins");
      setBreakHrsOptionEdit([]);
      setBreakMinsOptionEdit([]);
    } else if (reference == "tominutesvalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(
        shiftsid.fromhour === "" ? 0 : shiftsid.fromhour,
        10
      );
      if (shiftsid.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shiftsid.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      let toHour24 = parseInt(shiftsid.tohour === "" ? 0 : shiftsid.tohour, 10);
      if (shiftsid.totime === "PM" && toHour24 !== 12) {
        toHour24 += 12;
      } else if (shiftsid.totime === "AM" && toHour24 === 12) {
        toHour24 = 0;
      }

      // Calculate the hours difference
      let hoursDifference = toHour24 - fromHour24;

      // If the "to" time is in the AM and "from" time is in the PM, adjust the hours difference
      if (
        shiftsid.totime === "AM" &&
        shiftsid.fromtime === "PM" &&
        hoursDifference < 0
      ) {
        hoursDifference += 24; // Add 24 hours to handle the next day scenario
      }

      // Calculate the minutes difference
      let minutesDifference =
        parseInt(inputValue, 10) +
        fromHour24 * 60 -
        (toHour24 * 60 +
          parseInt(shiftsid.tomin === "" ? 0 : shiftsid.tomin, 10));

      // If minutesDifference is negative, adjust it
      if (minutesDifference < 0) {
        minutesDifference += 24 * 60; // Add 24 hours in minutes to handle the next day scenario
      }

      // Convert minutes difference to hours
      const hoursFinal = minutesDifference / 60;

      // Calculate total shiftsid hours
      const totalShiftHours =
        String(hoursDifference).length === 2
          ? hoursDifference + ":" + hoursFinal
          : "0" + hoursDifference + ":" + hoursFinal;

      // Update the state with the calculated shiftsid hours
      setShiftsid({
        ...shiftsid,
        tomin: inputValue,
        name: shiftsid.fromhour + ':' + shiftsid.frommin + shiftsid.fromtime + 'to' + shiftsid.tohour + ':' + inputValue + shiftsid.totime,
        totime: "",
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHoursEdit("Hrs");
      setPayMinutesEdit("Mins");
      setPayHrsOptionEdit([]);
      setPayMinsOptionEdit([]);
      setBreakHoursEdit("Hrs");
      setBreakMinutesEdit("Mins");
      setBreakHrsOptionEdit([]);
      setBreakMinsOptionEdit([]);
    } else if (reference == "totimevalue") {
      // Convert selected times to 24-hour format
      let fromHour24 = parseInt(
        shiftsid.fromhour === "" ? 0 : shiftsid.fromhour,
        10
      );
      if (shiftsid.fromtime === "PM" && fromHour24 !== 12) {
        fromHour24 += 12;
      } else if (shiftsid.fromtime === "AM" && fromHour24 === 12) {
        fromHour24 = 0;
      }

      let toHour24 = parseInt(shiftsid.tohour === "" ? 0 : shiftsid.tohour, 10);
      if (inputValue === "PM" && toHour24 !== 12) {
        toHour24 += 12;
      } else if (inputValue === "AM" && toHour24 === 12) {
        toHour24 = 0;
      }

      // Handle case where fromtime is PM and totime is AM
      if (shiftsid.fromtime === "PM" && inputValue === "AM") {
        toHour24 += 24; // Add 24 hours to toHour24 to handle next day scenario
      }

      // Calculate the time difference
      let hoursDifference = toHour24 - fromHour24;

      // If the "to" time is earlier than the "from" time, adjust the hours difference
      if (hoursDifference < 0) {
        hoursDifference += 24; // Add 24 hours to handle the next day scenario
      }

      // Calculate the minutes difference
      let minutesDifference =
        toHour24 * 60 +
        parseInt(shiftsid.tomin === "" ? 0 : shiftsid.tomin, 10) - // Convert to minutes
        (fromHour24 * 60 +
          parseInt(shiftsid.frommin === "" ? 0 : shiftsid.frommin, 10)); // Convert to minutes

      // If minutesDifference is negative, adjust it by subtracting from the hours difference
      if (minutesDifference < 0) {
        minutesDifference += 60;
        hoursDifference--; // Subtract one hour to account for the minute difference
      }

      // Calculate total shiftsid hours and minutes
      const totalHours = Math.floor(minutesDifference / 60);
      const totalMinutes = minutesDifference % 60;

      // Format total shiftsid hours and minutes
      const totalShiftHours = `${totalHours < 10 ? "0" + totalHours : totalHours
        }:${totalMinutes < 10 ? "0" + totalMinutes : totalMinutes}`;

      // Update the state with the calculated shiftsid hours
      setShiftsid({
        ...shiftsid,
        totime: inputValue,
        name: shiftsid.fromhour + ':' + shiftsid.frommin + shiftsid.fromtime + 'to' + shiftsid.tohour + ':' + shiftsid.tomin + inputValue,
        shifthours: totalShiftHours,
        payhours: "00:00",
        breakhours: "00:00",
        workinghours: "",
      });
      setPayHoursEdit("Hrs");
      setPayMinutesEdit("Mins");
      setPayMinsOptionEdit([]);
      setBreakHoursEdit("Hrs");
      setBreakMinutesEdit("Mins");
      setBreakHrsOptionEdit([]);
      setBreakMinsOptionEdit([]);

      await generatePayHrsOptionsEdit(totalHours);
    }
  };

  const rowData = async (id, name) => {
    try {
      const [res, resuser, shiftgrouping] = await Promise.all([
        axios.get(`${SERVICE.SHIFT_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.USERSHIFTCHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkshifttouser: String(name),
        }),
        axios.post(SERVICE.GETALLSHIFTGROUPSBULK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          shifts: String(name),
        })
      ])
      setDeleteshift(res?.data?.sshift);
      setCheckUser(resuser?.data?.users);


      if ((resuser?.data?.users?.length > 0 || shiftgrouping?.data?.shiftgroupings?.length > 0)) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Alert delete popup
  let shiftid = deleteshift._id;
  const delShift = async () => {
    try {
      await axios.delete(`${SERVICE.SHIFT_SINGLE}/${shiftid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchShift();
      setPage(1);
      setSelectedRows([]);
      handleCloseMod();
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const delShiftcheckbox = async () => {
    try {
      const [resuser, resusernew] = await Promise.all([
        axios.post(SERVICE.USERSHIFTCHECKBULK, { checkshifttouser: selectedNames }, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
        axios.post(SERVICE.GETALLSHIFTGROUPSBULK, { shifts: selectedNames, selectedrows: selectedRows }, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        })
      ]);

      const usersExist = resuser?.data?.users?.length > 0;
      if (usersExist) {
        let mappedDatasfirst = Array.from(new Set(resuser?.data?.users?.flatMap((data) => data?.combinedMatchedShifts)));
        let mappedDatassecond = Array.from(new Set(resusernew?.data?.shiftgroupings?.flatMap((data) => data?.combinedMatchedShifts)));
        let finalDatas = Array.from(new Set([...mappedDatasfirst, ...mappedDatassecond]))
        let updatedSelectedRows = selectedRows.filter(
          (selectedId) => !finalDatas.includes(selectedId)
        );

        let setNamesNew = rowDataTable?.filter((data) => updatedSelectedRows?.includes(data?.id)).map((item) => item.name)
        setSelectedRows(updatedSelectedRows);
        setSelectedNames(setNamesNew)
        handleClickOpenCheckNew();
      }
      else {
        const deletePromises = selectedRows?.map((item) => {
          return axios.delete(`${SERVICE.SHIFT_SINGLE}/${item}`, {
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

        await fetchShift();
      }

    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //add function....
  const sendRequest = async () => {
    try {
      let shiftcreate = await axios.post(SERVICE.SHIFT_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(shift.name),
        fromhour: String(shift.fromhour),
        tohour: String(shift.tohour),
        frommin: String(shift.frommin),
        tomin: String(shift.tomin),
        fromtime: String(shift.fromtime),
        totime: String(shift.totime),
        isallowance: String(shift.isallowance),
        payhours: String(shift.payhours),
        shifthours: String(shift.shifthours),
        breakhours: String(shift.breakhours),
        workinghours: String(shift.workinghours),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchShift();
      setShift({
        name: "",
        fromhour: "",
        tohour: "",
        frommin: "",
        tomin: "",
        fromtime: "",
        totime: "",
        isallowance: "",
        payhours: "00:00",
        shifthours: "",
        workinghours: "",
        breakhours: "00:00",
      });
      setPayHours("Hrs");
      setPayMinutes("Mins");
      setPayMinsOption([]);
      setBreakHours("Hrs");
      setBreakMinutes("Mins");
      setBreakHrsOption([]);
      setBreakMinsOption([]);
      setTimeValue("");
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = shifts.some(
      (item) => item.name.toLowerCase() === shift.name.toLowerCase() && ((item.fromhour + ":" + item.frommin + " " + item.fromtime) === (shift.fromhour + ":" + shift.frommin + " " + shift.fromtime) && ((item.tohour + ":" + item.tomin + " " + item.totime) === (shift.tohour + ":" + shift.tomin + " " + shift.totime))
      ))

    if (shift.name === undefined || shift.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please enter name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shift.fromhour === undefined || shift.fromhour === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shift.tohour === undefined || shift.tohour === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shift.frommin === undefined || shift.frommin === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From minutes"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shift.tomin === undefined || shift.tomin === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To minutes"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shift.isallowance === undefined || shift.isallowance === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Shift Allowance"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shift.payhours === "00:00" || shift.payhours.includes("Mins")) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Pay Hours"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      shift.breakhours === "00:00" ||
      shift.breakhours.includes("Mins")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Break Hours"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Name already exits!"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setShift({
      name: "",
      fromhour: "",
      tohour: "",
      frommin: "",
      tomin: "",
      fromtime: "",
      totime: "",
      isallowance: "",
      payhours: "00:00",
      shifthours: "",
      breakhours: "00:00",
      workinghours: "",
    });
    setPayHours("Hrs");
    setPayMinutes("Mins");
    setPayMinsOption([]);
    setBreakHours("Hrs");
    setBreakMinutes("Mins");
    setBreakHrsOption([]);
    setBreakMinsOption([]);
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  //get single row to edit....
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.SHIFT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftsid(res?.data?.sshift);
      setOvProj(name);
      getOverallEditSection(name);
      const [shiftHours, shiftMinutes] =
        res?.data?.sshift.shifthours.split(":");
      const [payHours, payMinutes] = res?.data?.sshift.payhours.split(":");
      const [breakHours, breakMminutes] =
        res?.data?.sshift.breakhours.split(":");
      setPayHoursEdit(payHours);
      setPayMinutesEdit(payMinutes);
      setBreakHoursEdit(breakHours);
      setBreakMinutesEdit(breakMminutes);

      generatePayHrsOptionsEdit(shiftHours);
      generatePayMinsOptionsEdit(payHours);
      generateBreakMinsOptionsEdit(breakHours);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SHIFT_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftsid(res?.data?.sshift);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //shift updateby edit page...
  let updateby = shiftsid.updatedby;
  let addedby = shiftsid.addedby;

  let shiftedid = shiftsid._id;
  //editing the single data....
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.SHIFT_SINGLE}/${shiftedid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(shiftsid.name),
        fromhour: String(shiftsid.fromhour),
        tohour: String(shiftsid.tohour),
        frommin: String(shiftsid.frommin),
        tomin: String(shiftsid.tomin),
        fromtime: String(shiftsid.fromtime),
        totime: String(shiftsid.totime),
        isallowance: String(shiftsid.isallowance),
        payhours: String(shiftsid.payhours),
        shifthours: String(shiftsid.shifthours),
        breakhours: String(shiftsid.breakhours),
        workinghours: String(shiftsid.workinghours),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchShift();
      await fetchShiftAll();
      await getOverallEditSectionUpdate();
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchShiftAll();
    const isNameMatch = shiftsalledit.some(
      (item) => item.name.toLowerCase() === shiftsid.name.toLowerCase() && ((item.fromhour + ":" + item.frommin + " " + item.fromtime) === (shiftsid.fromhour + ":" + shiftsid.frommin + " " + shiftsid.fromtime) && ((item.tohour + ":" + item.tomin + " " + item.totime) === (shiftsid.tohour + ":" + shiftsid.tomin + " " + shiftsid.totime))
      )
    );

    if (shiftsid.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please enter name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shiftsid.fromhour === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shiftsid.tohour === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (shiftsid.isallowance === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Shift allowance"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      shiftsid.payhours === "00:00" ||
      shiftsid.payhours.includes("Mins")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Pay Hours"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      shiftsid.breakhours === "00:00" ||
      shiftsid.breakhours.includes("Mins")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Break Hours"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (shiftsid.name != ovProj && ovProjcount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Data already exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendEditRequest();
    }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjcount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in ${res?.data?.users?.length > 0 ? "Add Employee ," : ""
        }
        whether you want to do changes ..??`);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.users);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const sendEditRequestOverall = async (user) => {
    try {
      if (user.length > 0) {
        let answ = user.map((d, i) => {
          let res = axios.put(`${SERVICE.USER_SINGLE_PWD}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            shifttiming: String(shiftsid.name),
          });
        });
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  // const totalhours= fromtime + totime;

  // get all shifts
  const fetchShift = async () => {
    try {
      let res_shift = await axios.get(SERVICE.SHIFTBYCONDITION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShifts(res_shift?.data?.shifts);
      setIsshifts(true);
    } catch (err) { setIsshifts(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  // get all shifts
  const fetchShiftAll = async () => {
    try {
      let res_shift = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftsalledit(res_shift?.data?.shifts?.filter((data) => data?._id !== shiftsid?._id));
    } catch (err) { setIsshifts(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const modifiedData = shifts.map((obj) => ({
    ...obj,
    from: obj.fromhour + ":" + obj.frommin + " " + obj.fromtime,
    to: obj.tohour + ":" + obj.tomin + " " + obj.totime,
  }));


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
        Name: item.name || '',
        Shiftfromtime: item.from || '',
        Shifttotime: item.to || '',

        Payhours: item.payhours || '',
        Shifthours: item.shifthours || '',
        Breakhours: item.breakhours || '',
        Workinghours: item.workinghours || '',
        Shiftallowance: item.isallowance || '',
      };
    });
  };

  const handleExportXL = (isfilter) => {

    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error('No data available to export');
      return;
    }

    exportToExcel(formatData(dataToExport), 'Shift');
    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
    { title: "Name", field: "name" },
    { title: "Shiftfromtime", field: "from" },
    { title: "Shifttotime", field: "to" },
    { title: "Payhours", field: "payhours" },
    { title: "shifthours", field: "shifthours" },
    { title: "Breakhours", field: "breakhours" },
    { title: "Workinghours", field: "workinghours" },
    { title: "Shiftallowance", field: "isallowance" },

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

    doc.save("Shift.pdf");
  };


  const [shiftData, setShiftData] = useState([]);
  let excelno = 1;

  //get particular columns for export excel..
  const getexcelDatas = async () => {
    try {
      let response = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      var data = response?.data?.shifts.map((t) => ({
        Sno: excelno++,
        name: t.name,
        FromTime: t.fromhour + t.frommin + t.fromtime,
        ToTime: t.tohour + t.tomin + t.totime,
        isallowance: t.isallowance,
        payhours: t.payhours,
        shifthours: t.shifthours,
        breakhours: t.breakhours,
        workinghours: t.workinghours,
      }));
      setShiftData(data);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Shift",
    pageStyle: "print",
  });

  useEffect(() => {
    getexcelDatas();
  }, [shifts]);

  useEffect(() => {
    fetchShift();

  }, []);

  useEffect(() => {

    fetchShiftAll();
  }, [shiftsid]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = modifiedData?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [shifts]);

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

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

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
              const allRowNames = rowDataTable.map((row) => row.name);
              setSelectedRows(allRowIds);
              setSelectedNames(allRowNames);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={(e) => {
            let updatedSelectedRows;

            if (e.target.checked) {
              setSelectedNames([...selectedNames, params.row.name])
            } else {
              setSelectedNames([...selectedNames])
            }
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 75,

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
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "from",
      headerName: "FromTime",
      flex: 0,
      width: 100,
      hide: !columnVisibility.from,
      headerClassName: "bold-header",
    },
    {
      field: "to",
      headerName: "ToTime",
      flex: 0,
      width: 100,
      hide: !columnVisibility.to,
      headerClassName: "bold-header",
    },
    {
      field: "payhours",
      headerName: "PayHours",
      flex: 0,
      width: 100,
      hide: !columnVisibility.payhours,
      headerClassName: "bold-header",
    },
    {
      field: "shifthours",
      headerName: "ShiftHours",
      flex: 0,
      width: 100,
      hide: !columnVisibility.shifthours,
      headerClassName: "bold-header",
    },
    {
      field: "breakhours",
      headerName: "BreakHours",
      flex: 0,
      width: 100,
      hide: !columnVisibility.breakhours,
      headerClassName: "bold-header",
    },
    {
      field: "workinghours",
      headerName: "WorkingHours",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workinghours,
      headerClassName: "bold-header",
    },
    {
      field: "isallowance",
      headerName: "Shift Allowance",
      flex: 0,
      width: 100,
      hide: !columnVisibility.isallowance,
      headerClassName: "bold-header",
    },

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
          {(isUserRoleCompare?.includes("eshift") && !params.row.hasresults) && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenEdit();
                getCode(params.row.id, params.row.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dshift") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vshift") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ishift") && (
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      from: item.from,
      from: item.from === undefined ? 0 : item.from,
      to: item.to,
      to: item.to === undefined ? 0 : item.to,
      payhours: item.payhours,
      shifthours: item.shifthours,
      breakhours: item.breakhours,
      workinghours: item.workinghours,
      isallowance: item.isallowance,
      hasresults: item.hasResults
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

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  // // Function to filter columns based on search query
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
              // secondary={column.headerName }
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"SHIFT"} />
      <Typography sx={userStyle.HeaderText}>Create shift</Typography>
      {isUserRoleCompare?.includes("ashift") && (
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>
              <Grid item sm={12} md={12} xs={12}>
                <Typography sx={userStyle.importheadtext}>
                  Manage Shift
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={shift.name}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <Typography>
                  From Time <b style={{ color: "red" }}>*</b>
                </Typography>
                <Grid container>
                  <Grid item xs={4} sm={4} md={2}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={shift.fromhour}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setShift({ ...shift, fromhour: e.target.value, });
                          calculateShiftHours("fromhourvalue", e.target.value);
                        }}
                      >
                        <MenuItem value={"01"}>01</MenuItem>
                        <MenuItem value={"02"}>02</MenuItem>
                        <MenuItem value={"03"}>03</MenuItem>
                        <MenuItem value={"04"}>04</MenuItem>
                        <MenuItem value={"05"}>05</MenuItem>
                        <MenuItem value={"06"}>06</MenuItem>
                        <MenuItem value={"07"}>07</MenuItem>
                        <MenuItem value={"08"}>08</MenuItem>
                        <MenuItem value={"09"}>09</MenuItem>
                        <MenuItem value={"10"}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} md={2}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={shift.frommin}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setShift({ ...shift, frommin: e.target.value, });
                          calculateShiftHours(
                            "fromminutesvalue",
                            e.target.value
                          );
                        }}
                      >
                        <MenuItem value={"00"}>00</MenuItem>
                        <MenuItem value={"01"}>01</MenuItem>
                        <MenuItem value={"02"}>02</MenuItem>
                        <MenuItem value={"03"}>03</MenuItem>
                        <MenuItem value={"04"}>04</MenuItem>
                        <MenuItem value={"05"}>05</MenuItem>
                        <MenuItem value={"06"}>06</MenuItem>
                        <MenuItem value={"07"}>07</MenuItem>
                        <MenuItem value={"08"}>08</MenuItem>
                        <MenuItem value={"09"}>09</MenuItem>
                        <MenuItem value={"10"}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={13}>13</MenuItem>
                        <MenuItem value={14}>14</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={16}>16</MenuItem>
                        <MenuItem value={17}>17</MenuItem>
                        <MenuItem value={18}>18</MenuItem>
                        <MenuItem value={19}>19</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={21}>21</MenuItem>
                        <MenuItem value={22}>22</MenuItem>
                        <MenuItem value={23}>23</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={26}>26</MenuItem>
                        <MenuItem value={27}>27</MenuItem>
                        <MenuItem value={28}>28</MenuItem>
                        <MenuItem value={29}>29</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={31}>31</MenuItem>
                        <MenuItem value={32}>32</MenuItem>
                        <MenuItem value={33}>33</MenuItem>
                        <MenuItem value={34}>34</MenuItem>
                        <MenuItem value={35}>35</MenuItem>
                        <MenuItem value={36}>36</MenuItem>
                        <MenuItem value={37}>37</MenuItem>
                        <MenuItem value={38}>38</MenuItem>
                        <MenuItem value={39}>39</MenuItem>
                        <MenuItem value={40}>40</MenuItem>
                        <MenuItem value={41}>41</MenuItem>
                        <MenuItem value={42}>42</MenuItem>
                        <MenuItem value={43}>43</MenuItem>
                        <MenuItem value={44}>44</MenuItem>
                        <MenuItem value={45}>45</MenuItem>
                        <MenuItem value={46}>46</MenuItem>
                        <MenuItem value={47}>47</MenuItem>
                        <MenuItem value={48}>48</MenuItem>
                        <MenuItem value={49}>49</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={51}>51</MenuItem>
                        <MenuItem value={52}>52</MenuItem>
                        <MenuItem value={53}>53</MenuItem>
                        <MenuItem value={54}>54</MenuItem>
                        <MenuItem value={55}>55</MenuItem>
                        <MenuItem value={56}>56</MenuItem>
                        <MenuItem value={57}>57</MenuItem>
                        <MenuItem value={58}>58</MenuItem>
                        <MenuItem value={59}>59</MenuItem>
                        <MenuItem value={60}>60</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} md={2}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={shift.fromtime}
                        onChange={(e) => {
                          setShift({ ...shift, fromtime: e.target.value, });
                          calculateShiftHours("fromtimevalue", e.target.value);
                        }}
                      >
                        <MenuItem value={"AM"}>AM</MenuItem>
                        <MenuItem value={"PM"}>PM</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <Typography>
                  To Time <b style={{ color: "red" }}>*</b>{" "}
                </Typography>
                <Grid container>
                  <Grid item xs={4} sm={4} md={2}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={shift.tohour}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setShift({ ...shift, tohour: e.target.value, });
                          calculateShiftHours("tohourvalue", e.target.value);
                        }}
                      >
                        <MenuItem value={"01"}>01</MenuItem>
                        <MenuItem value={"02"}>02</MenuItem>
                        <MenuItem value={"03"}>03</MenuItem>
                        <MenuItem value={"04"}>04</MenuItem>
                        <MenuItem value={"05"}>05</MenuItem>
                        <MenuItem value={"06"}>06</MenuItem>
                        <MenuItem value={"07"}>07</MenuItem>
                        <MenuItem value={"08"}>08</MenuItem>
                        <MenuItem value={"09"}>09</MenuItem>
                        <MenuItem value={"10"}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} md={2}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={shift.tomin}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setShift({ ...shift, tomin: e.target.value, });
                          calculateShiftHours("tominutesvalue", e.target.value);
                        }}
                      >
                        <MenuItem value={"00"}>00</MenuItem>
                        <MenuItem value={"01"}>01</MenuItem>
                        <MenuItem value={"02"}>02</MenuItem>
                        <MenuItem value={"03"}>03</MenuItem>
                        <MenuItem value={"04"}>04</MenuItem>
                        <MenuItem value={"05"}>05</MenuItem>
                        <MenuItem value={"06"}>06</MenuItem>
                        <MenuItem value={"07"}>07</MenuItem>
                        <MenuItem value={"08"}>08</MenuItem>
                        <MenuItem value={"09"}>09</MenuItem>
                        <MenuItem value={"10"}>10</MenuItem>
                        <MenuItem value={11}>11</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={13}>13</MenuItem>
                        <MenuItem value={14}>14</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={16}>16</MenuItem>
                        <MenuItem value={17}>17</MenuItem>
                        <MenuItem value={18}>18</MenuItem>
                        <MenuItem value={19}>19</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={21}>21</MenuItem>
                        <MenuItem value={22}>22</MenuItem>
                        <MenuItem value={23}>23</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={26}>26</MenuItem>
                        <MenuItem value={27}>27</MenuItem>
                        <MenuItem value={28}>28</MenuItem>
                        <MenuItem value={29}>29</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={31}>31</MenuItem>
                        <MenuItem value={32}>32</MenuItem>
                        <MenuItem value={33}>33</MenuItem>
                        <MenuItem value={34}>34</MenuItem>
                        <MenuItem value={35}>35</MenuItem>
                        <MenuItem value={36}>36</MenuItem>
                        <MenuItem value={37}>37</MenuItem>
                        <MenuItem value={38}>38</MenuItem>
                        <MenuItem value={39}>39</MenuItem>
                        <MenuItem value={40}>40</MenuItem>
                        <MenuItem value={41}>41</MenuItem>
                        <MenuItem value={42}>42</MenuItem>
                        <MenuItem value={43}>43</MenuItem>
                        <MenuItem value={44}>44</MenuItem>
                        <MenuItem value={45}>45</MenuItem>
                        <MenuItem value={46}>46</MenuItem>
                        <MenuItem value={47}>47</MenuItem>
                        <MenuItem value={48}>48</MenuItem>
                        <MenuItem value={49}>49</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={51}>51</MenuItem>
                        <MenuItem value={52}>52</MenuItem>
                        <MenuItem value={53}>53</MenuItem>
                        <MenuItem value={54}>54</MenuItem>
                        <MenuItem value={55}>55</MenuItem>
                        <MenuItem value={56}>56</MenuItem>
                        <MenuItem value={57}>57</MenuItem>
                        <MenuItem value={58}>58</MenuItem>
                        <MenuItem value={59}>59</MenuItem>
                        <MenuItem value={60}>60</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} sm={4} md={2}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={shift.totime}
                        onChange={(e) => {
                          setShift({ ...shift, totime: e.target.value });
                          calculateShiftHours("totimevalue", e.target.value);
                        }}
                      >
                        <MenuItem value={"AM"}>AM</MenuItem>
                        <MenuItem value={"PM"}>PM</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item lg={3} md={3} sm={6} xs={12}>
                <Typography>
                  Shift Allowance <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={shift.isallowance}
                    onChange={(e) => {
                      setShift({ ...shift, isallowance: e.target.value });
                    }}
                  >
                    <MenuItem value="Enable">Enable</MenuItem>
                    <MenuItem value="Disable">Disable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item lg={2} md={3} sm={6} xs={12}>
                <Typography>
                  PayHours <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="time"
                    // value={formatTime(shift.payhours)}
                    value={shift.payhours}
                    placeholder="HH:MM"
                    onChange={(e) => {
                      setShift({ ...shift, payhours: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid> */}
              <Grid item lg={2} md={3} sm={6} xs={12}>
                <Typography>
                  Pay Hours<b style={{ color: "red" }}>*</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={payHrsOption}
                        placeholder="Hrs"
                        value={{ label: payHours, value: payHours }}
                        onChange={(e) => {
                          setPayHours(e.value);
                          setShift({
                            ...shift,
                            payhours: `${e.value}:${payMinutes}`,
                            breakhours: "00:00",
                            workinghours: "",
                          });
                          setPayMinutes("Mins");
                          setBreakHours("Hrs");
                          setBreakMinutes("Mins");
                          setBreakMinsOption([]);
                          generatePayMinsOptions(e.value);
                          // await generateBreakHrsOptions(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={payMinsOption}
                        placeholder="Mins"
                        value={{ label: payMinutes, value: payMinutes }}
                        onChange={(e) => {
                          setPayMinutes(e.value);
                          setShift({
                            ...shift,
                            payhours: `${payHours}:${e.value}`,
                            breakhours: "00:00",
                            workinghours: "",
                          });
                          setBreakHours("Hrs");
                          setBreakMinutes("Mins");
                          setBreakMinsOption([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={2} md={3} sm={6} xs={12}>
                <Typography>
                  ShiftHours <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="HH:MM"
                    value={shift.shifthours}
                  />
                </FormControl>
              </Grid>

              <Grid item lg={2} md={3} sm={6} xs={12}>
                <Typography>
                  Break Hours<b style={{ color: "red" }}>*</b>
                </Typography>
                <Grid container spacing={1}>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        // options={breakHrsOption}
                        options={payHrsOption}
                        placeholder="Hrs"
                        value={{ label: breakHours, value: breakHours }}
                        onChange={async (e) => {
                          setBreakHours(e.value);
                          setShift({
                            ...shift,
                            breakhours: `${e.value}:${breakMinutes}`,
                            workinghours: "",
                          });
                          setBreakMinutes("Mins");
                          await generateBreakMinsOptions(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={breakMinsOption}
                        // options={payMinsOption}
                        placeholder="Mins"
                        value={{ label: breakMinutes, value: breakMinutes }}
                        onChange={(e) => {
                          setBreakMinutes(e.value);
                          setShift({
                            ...shift,
                            breakhours: `${breakHours}:${e.value}`,
                          });
                          // calculateWorkingHours(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={2} md={3} sm={6} xs={12}>
                <Typography>
                  WorkingHours <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="HH:MM"
                    value={shift.workinghours}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={2.5} xs={12} sm={6}>
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ display: "flex" }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </>
              </Grid>
              <Grid item md={2.5} xs={12} sm={6}>
                <>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </>
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <Box>
        {/* edit model */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.HeaderText}>Edit Shift</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={shiftsid.name}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <Typography>
                    From Time <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container>
                    <Grid item xs={4} sm={3} md={3}>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={shiftsid.fromhour}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setShiftsid({
                              ...shiftsid,
                              fromhour: e.target.value,

                            });
                            calculateShiftHoursEdit(
                              "fromhourvalue",
                              e.target.value
                            );
                          }}
                        >
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={"11"}>11</MenuItem>
                          <MenuItem value={"12"}>12</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={3} md={3}>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={shiftsid.frommin}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setShiftsid({
                              ...shiftsid,
                              frommin: e.target.value,

                            });
                            calculateShiftHoursEdit(
                              "fromminutesvalue",
                              e.target.value
                            );
                          }}
                        >
                          <MenuItem value={"00"}>00</MenuItem>
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                          <MenuItem value={13}>13</MenuItem>
                          <MenuItem value={14}>14</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={16}>16</MenuItem>
                          <MenuItem value={17}>17</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={19}>19</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={21}>21</MenuItem>
                          <MenuItem value={22}>22</MenuItem>
                          <MenuItem value={23}>23</MenuItem>
                          <MenuItem value={24}>24</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={26}>26</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                          <MenuItem value={28}>28</MenuItem>
                          <MenuItem value={29}>29</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                          <MenuItem value={31}>31</MenuItem>
                          <MenuItem value={32}>32</MenuItem>
                          <MenuItem value={33}>33</MenuItem>
                          <MenuItem value={34}>34</MenuItem>
                          <MenuItem value={35}>35</MenuItem>
                          <MenuItem value={36}>36</MenuItem>
                          <MenuItem value={37}>37</MenuItem>
                          <MenuItem value={38}>38</MenuItem>
                          <MenuItem value={39}>39</MenuItem>
                          <MenuItem value={40}>40</MenuItem>
                          <MenuItem value={41}>41</MenuItem>
                          <MenuItem value={42}>42</MenuItem>
                          <MenuItem value={43}>43</MenuItem>
                          <MenuItem value={44}>44</MenuItem>
                          <MenuItem value={45}>45</MenuItem>
                          <MenuItem value={46}>46</MenuItem>
                          <MenuItem value={47}>47</MenuItem>
                          <MenuItem value={48}>48</MenuItem>
                          <MenuItem value={49}>49</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={51}>51</MenuItem>
                          <MenuItem value={52}>52</MenuItem>
                          <MenuItem value={53}>53</MenuItem>
                          <MenuItem value={54}>54</MenuItem>
                          <MenuItem value={55}>55</MenuItem>
                          <MenuItem value={56}>56</MenuItem>
                          <MenuItem value={57}>57</MenuItem>
                          <MenuItem value={58}>58</MenuItem>
                          <MenuItem value={59}>59</MenuItem>
                          <MenuItem value={60}>60</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={3} md={3}>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={shiftsid.fromtime}
                          onChange={(e) => {
                            setShiftsid({
                              ...shiftsid,
                              fromtime: e.target.value,

                            });
                            calculateShiftHoursEdit(
                              "fromtimevalue",
                              e.target.value
                            );
                          }}
                        >
                          <MenuItem value={"AM"}>AM</MenuItem>
                          <MenuItem value={"PM"}>PM</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <Typography>
                    To Time <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container>
                    <Grid item xs={4} sm={3} md={3}>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={shiftsid.tohour}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setShiftsid({
                              ...shiftsid,
                              tohour: e.target.value,

                            });
                            calculateShiftHoursEdit(
                              "tohourvalue",
                              e.target.value
                            );
                          }}
                        >
                          <MenuItem value={"00"}>00</MenuItem>
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={3} md={3}>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={shiftsid.tomin}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setShiftsid({ ...shiftsid, tomin: e.target.value, });
                            calculateShiftHoursEdit(
                              "tominutesvalue",
                              e.target.value
                            );
                          }}
                        >
                          <MenuItem value={"00"}>00</MenuItem>
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                          <MenuItem value={13}>13</MenuItem>
                          <MenuItem value={14}>14</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={16}>16</MenuItem>
                          <MenuItem value={17}>17</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={19}>19</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={21}>21</MenuItem>
                          <MenuItem value={22}>22</MenuItem>
                          <MenuItem value={23}>23</MenuItem>
                          <MenuItem value={24}>24</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={26}>26</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                          <MenuItem value={28}>28</MenuItem>
                          <MenuItem value={29}>29</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                          <MenuItem value={31}>31</MenuItem>
                          <MenuItem value={32}>32</MenuItem>
                          <MenuItem value={33}>33</MenuItem>
                          <MenuItem value={34}>34</MenuItem>
                          <MenuItem value={35}>35</MenuItem>
                          <MenuItem value={36}>36</MenuItem>
                          <MenuItem value={37}>37</MenuItem>
                          <MenuItem value={38}>38</MenuItem>
                          <MenuItem value={39}>39</MenuItem>
                          <MenuItem value={40}>40</MenuItem>
                          <MenuItem value={41}>41</MenuItem>
                          <MenuItem value={42}>42</MenuItem>
                          <MenuItem value={43}>43</MenuItem>
                          <MenuItem value={44}>44</MenuItem>
                          <MenuItem value={45}>45</MenuItem>
                          <MenuItem value={46}>46</MenuItem>
                          <MenuItem value={47}>47</MenuItem>
                          <MenuItem value={48}>48</MenuItem>
                          <MenuItem value={49}>49</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={51}>51</MenuItem>
                          <MenuItem value={52}>52</MenuItem>
                          <MenuItem value={53}>53</MenuItem>
                          <MenuItem value={54}>54</MenuItem>
                          <MenuItem value={55}>55</MenuItem>
                          <MenuItem value={56}>56</MenuItem>
                          <MenuItem value={57}>57</MenuItem>
                          <MenuItem value={58}>58</MenuItem>
                          <MenuItem value={59}>59</MenuItem>
                          <MenuItem value={60}>60</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} sm={3} md={3}>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={shiftsid.totime}
                          onChange={(e) => {
                            setShiftsid({
                              ...shiftsid,
                              totime: e.target.value,

                            });
                            calculateShiftHoursEdit(
                              "totimevalue",
                              e.target.value
                            );
                          }}
                        >
                          <MenuItem value={"AM"}>AM</MenuItem>
                          <MenuItem value={"PM"}>PM</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Typography>
                    Shift Allowance <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={shiftsid.isallowance}
                      onChange={(e) => {
                        setShiftsid({
                          ...shiftsid,
                          isallowance: e.target.value,
                        });
                      }}
                    >
                      <MenuItem value="Enable">Enable</MenuItem>
                      <MenuItem value="Disable">Disable</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Typography>
                    Pay Hours<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={payHrsOptionEdit}
                          placeholder="Hrs"
                          value={{ label: payHoursEdit, value: payHoursEdit }}
                          onChange={(e) => {
                            setPayHoursEdit(e.value);
                            setShiftsid({
                              ...shiftsid,
                              payhours: `${e.value}:${payMinutesEdit}`,
                              breakhours: "00:00",
                              workinghours: "",
                            });
                            setPayMinutesEdit("Mins");
                            setBreakHoursEdit("Hrs");
                            setBreakMinutesEdit("Mins");
                            setBreakMinsOptionEdit([]);
                            generatePayMinsOptionsEdit(e.value);
                            // await generateBreakHrsOptions(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={payMinsOptionEdit}
                          placeholder="Mins"
                          value={{
                            label: payMinutesEdit,
                            value: payMinutesEdit,
                          }}
                          onChange={(e) => {
                            setPayMinutesEdit(e.value);
                            setShiftsid({
                              ...shiftsid,
                              payhours: `${payHoursEdit}:${e.value}`,
                              breakhours: "00:00",
                              workinghours: "",
                            });
                            setBreakHoursEdit("Hrs");
                            setBreakMinutesEdit("Mins");
                            setBreakMinsOptionEdit([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Typography>
                    ShiftHours <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      value={shiftsid.shifthours}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Typography>
                    Break Hours<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          // options={breakHrsOption}
                          options={payHrsOptionEdit}
                          placeholder="Hrs"
                          value={{
                            label: breakHoursEdit,
                            value: breakHoursEdit,
                          }}
                          onChange={(e) => {
                            setBreakHoursEdit(e.value);
                            setShiftsid({
                              ...shiftsid,
                              breakhours: `${e.value}:${breakMinutesEdit}`,
                              workinghours: "",
                            });
                            setBreakMinutesEdit("Mins");
                            generateBreakMinsOptionsEdit(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={breakMinsOptionEdit}
                          // options={payMinsOption}
                          placeholder="Mins"
                          value={{
                            label: breakMinutesEdit,
                            value: breakMinutesEdit,
                          }}
                          onChange={(e) => {
                            setBreakMinutesEdit(e.value);
                            setShiftsid({
                              ...shiftsid,
                              breakhours: `${breakHoursEdit}:${e.value}`,
                            });
                            // await calculateWorkingHoursEdit(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Typography>
                    WorkingHours <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      value={shiftsid.workinghours}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={4} sm={4}>
                  <Button variant="contained" onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={4} xs={4} sm={4}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lshift") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Shift List</Typography>
            </Grid>
            <br />
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
                    <MenuItem value={shifts?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelshift") && (
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
                  {isUserRoleCompare?.includes("csvshift") && (
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
                  {isUserRoleCompare?.includes("printshift") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfshift") && (
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
                  {isUserRoleCompare?.includes("imageshift") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdshift") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!isShifts ? (
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
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

      {/* Delete Modal */}
      <Box>
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
              onClick={(e) => delShift(shiftsid)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Check delete  Modal */}
        <Box>
          <>
            <Box>
              {/* ALERT DIALOG */}
              <Dialog
                open={isCheckOpen}
                onClose={handleCloseCheck}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent
                  sx={{
                    width: "350px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "80px", color: "orange" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "black", textAlign: "center" }}
                  >

                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>
                        {`${deleteshift.name} `}
                      </span>
                      was linked in{" "}
                      <span style={{ fontWeight: "700" }}>User or Shift Grouping</span>{" "}
                    </>

                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseCheck}
                    autoFocus
                    variant="contained"
                    color="error"
                  >
                    {" "}
                    OK{" "}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </>
        </Box>


        <Box>
          <>
            <Box>
              {/* ALERT DIALOG */}
              <Dialog
                open={isCheckOpenNew}
                onClose={handleCloseCheckNew}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent
                  sx={{
                    width: "350px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "80px", color: "orange" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "black", textAlign: "center" }}
                  >

                    <>
                      <span style={{ fontWeight: "700", color: "#777" }}>
                        {`Some of the Shifts `}
                      </span>
                      were linked to{" "}
                      <span style={{ fontWeight: "700" }}>Users or Shift Grouping</span>{" "}
                    </>

                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseCheckNew}
                    autoFocus
                    variant="contained"
                    color="error"
                  >
                    {" "}
                    OK{" "}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </>
        </Box>

        {/* print layout */}
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            id="usertable"
            ref={componentRef}
          >
            <TableHead sx={{ fontWeight: "600" }}>
              <TableRow>
                <TableCell>SI.No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>FromTime</TableCell>
                <TableCell>ToTime</TableCell>
                <TableCell>PayHours</TableCell>
                <TableCell>ShiftHours</TableCell>
                <TableCell>BreakHours</TableCell>
                <TableCell>WorkingHours</TableCell>
                <TableCell>ShiftAllowance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{printsno++}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row.fromhour + ":" + row.frommin + "" + row.fromtime}
                    </TableCell>
                    <TableCell>
                      {row.tohour + ":" + row.tomin + "" + row.totime}
                    </TableCell>
                    <TableCell>{row.payhours}</TableCell>
                    <TableCell>{row.shifthours}</TableCell>
                    <TableCell>{row.breakhours}</TableCell>
                    <TableCell>{row.workinghours}</TableCell>
                    <TableCell>{row.isallowance}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Shift Details
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Name</Typography>
                  <Typography>{shiftsid.name}</Typography>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <Typography variant="h6"> FromTime</Typography>
                  <Typography>
                    {shiftsid.fromhour +
                      ":" +
                      shiftsid.frommin +
                      "" +
                      shiftsid.fromtime}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sx={12}>
                <FormControl size="small" fullWidth>
                  <Typography variant="h6">To Time</Typography>
                  <Typography>
                    {shiftsid.tohour +
                      ":" +
                      shiftsid.tomin +
                      "" +
                      shiftsid.totime}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sx={12}>
                <FormControl size="small" fullWidth>
                  <Typography variant="h6">Shift Allowance</Typography>
                  <Typography>{shiftsid.isallowance}</Typography>
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">PayHours</Typography>
                  <Typography>{shiftsid.payhours}</Typography>
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">ShiftHours</Typography>
                  <Typography>{shiftsid.shifthours}</Typography>
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Breakhours</Typography>
                  <Typography>{shiftsid.breakhours}</Typography>
                </FormControl>
              </Grid>
              <Grid item lg={6} md={6} sx={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Workinghours</Typography>
                  <Typography>{shiftsid.workinghours}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
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
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => delShiftcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseModalert}
            >
              {" "}
              OK{" "}
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
            <Typography sx={userStyle.HeaderText}> Shift info</Typography>
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

      {/* ALERT DIALOG  for the Overall delete*/}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
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
    </Box>
  );
}

export default ShiftDetails;