import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TextareaAutosize,
  TableBody,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogTitle,
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
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaTrash } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import axios from "axios";
import Selects from "react-select";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import ImageIcon from "@mui/icons-material/Image";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from "dom-to-image";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import csvIcon from "../../../components/Assets/CSV.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import Webcamimage from "../../asset/Webcameimageasset";
import ExportData from "../../../components/ExportData";

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function PendingTimeStudyList() {
  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [projmaster, setProjmaster] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTableImg = useRef(null);
  const gridRefTable = useRef(null);

  //    today date fetching
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  // today = yyyy + "-" + mm + "-" + dd;
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  let exportColumnNames = [
    "Vendor",
    "From Date",
    "Date",
    "Time",
    "Category",
    "SubCategory",
    "Identifier",
    "Login Id",
    "Section",
    "Flag Count",
    "Doc Number",
    "Doc Link",
    "Start Date Mode",
    "Start Date",
    "Start Time",
    "Status Mode",
    "Total Pages",
    "Pending Pages",
    "Start Page",
    "Remarks/Notes",
  ];
  let exportRowValues = [
    "vendor",
    "datemode",
    "fromdate",
    "time",
    "filename",
    "category",
    "unitid",
    "user",
    "section",
    "flagcount",
    "docnumber",
    "doclink",
    "startmode",
    "startdate",
    "starttime",
    "statusmode",
    "totalpages",
    "pendingpages",
    "startpage",
    "notes",
  ];

  let nameedit = "edit";
  const classes = useStyles();
  const [allUploadedFilesedit, setAllUploadedFilesedit] = useState([]);
  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const gridRef = useRef(null);

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
    setloadingdeloverall(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
  const statuschange = [
    { label: "Completed", value: "Completed" },
    { label: "In Complete", value: "In Complete" },
    { label: "Partial Complete", value: "Partial Complete" },
    { label: "Started", value: "Started" },
    { label: "Stop", value: "Stop" },
    { label: "Pause", value: "Pause" },
    { label: "Reject", value: "Reject" },
    { label: "Cancel", value: "Cancel" },
  ];

  // Calculate the date two months ago
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(today.getMonth() - 2);
  const ddPast = String(twoMonthsAgo.getDate()).padStart(2, "0");
  const mmPast = String(twoMonthsAgo.getMonth() + 1).padStart(2, "0");
  const yyyyPast = twoMonthsAgo.getFullYear();
  const formattedTwoMonthsAgo = `${yyyyPast}-${mmPast}-${ddPast}`;

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const minDate = new Date(formattedTwoMonthsAgo);
    const maxDate = new Date(formattedToday);

    if (ProducionIndividual.datemode === "Manual") {
      if (selectedDate >= minDate && selectedDate <= maxDate) {
        setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
      } else {
        setPopupContent("Please select a date within the past two months and not in the future");
        setPopupSeverity("warning");
        handleClickOpenPopup();
      }
    } else {
      setProducionIndividual({ ...ProducionIndividual, fromdate: e.target.value });
    }
  };

  const handleDateChangeEdit = (e) => {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date(); // Current date and time

    // Ensure only date comparison without time
    const fromDate = new Date(ProducionIndividualChange.startdate || currentDate);
    fromDate.setHours(0, 0, 0, 0); // Reset time portion to midnight
    selectedDate.setHours(0, 0, 0, 0); // Reset time portion to midnight
    currentDate.setHours(0, 0, 0, 0); // Reset time portion to midnight

    if (ProducionIndividualChange.enddatemode === "Manual") {
      if (selectedDate < fromDate) {
        // setPopupContent("End Date should be after or equal to Start Date!");
        // setPopupSeverity("warning");
        // handleClickOpenPopup();

        setPopupContentMalert("End Date should be after or equal to Start Date !");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
        setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: "", time: "" });
      } else if (selectedDate >= fromDate) {
        setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: e.target.value, time: "" });
      } else {
        // setPopupContent("End Date cannot be in the past!");
        // setPopupSeverity("warning");
        // handleClickOpenPopup();

        setPopupContentMalert("End Date cannot be in the past!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      }
    } else {
      setProducionIndividualChange({ ...ProducionIndividualChange, fromdate: e.target.value });
    }
  };

  let now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  let currtime = `${hours}:${minutes}`;

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [ProducionIndividual, setProducionIndividual] = useState({
    vendor: "Please Select Vendor",
    fromdate: formattedToday,
    time: currtime,
    datemode: "Auto",
    datetimezone: "",
    category: "Please Select Subcategory",
    filename: "Please Select Category",
    unitid: "",
    alllogin: "Please Select AllLogin",
    user: "Please Select Loginid",
    mode: "",
    docnumber: "",
    doclink: "",

    statusmode: "Please Select Status",
    flagcount: 0,
    section: "1",
    addedby: "",
    updatedby: "",
    pendingpages: "",
    notes: "",
    totalpages: 0,
    completepages: 0,
    startpage: "Please Select Start Page",
    reason: "",
    startdate: formattedToday,
    starttime: currtime,
    startdatemode: "Auto",
  });

  const [ProducionIndividualChange, setProducionIndividualChange] = useState({
    vendor: "Please Select Vendor",
    fromdate: formattedToday,
    time: currtime,
    datemode: "Auto",
    datetimezone: "",
    category: "Please Select Subcategory",
    filename: "Please Select Category",
    unitid: "",
    alllogin: "Please Select AllLogin",
    user: "Please Select Loginid",
    mode: "",
    docnumber: "",
    doclink: "",
    statusmode: "Please Select Status",
    flagcount: "",
    section: "1",
    pendingpages: "",
    // addedby: "", updatedby: "",
    totalpages: "",
    completepages: "",
    startpage: "Please Select Start Page",
    reason: "",
    startdate: formattedToday,
    starttime: currtime,
    startdatemode: "Auto",
  });

  const handleChangephonenumberflagChange = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      let difference = Number(ProducionIndividualChange.totalpages) - Number(inputValue);
      // Check if the input value exceeds totalpages
      const getstpage = Array.from({ length: inputValue - 0 }, (_, index) => {
        const startPageNumber = Number(inputValue) + index;
        return startPageNumber;
      });
      if (parseInt(inputValue) > parseInt(ProducionIndividualChange.totalpages)) {
        // alert("Completed pages cannot be greater than total pages.");

        setPopupContent("Completed pages cannot be greater than total pages");
        setPopupSeverity("warning");
        handleClickOpenPopup();
      } else {
        // Update the state with the valid numeric value
        setProducionIndividualChange({ ...ProducionIndividualChange, flagcount: inputValue, startpage: getstpage[0], pendingpages: difference });
      }
    }
  };

  const handleChangephonenumbertotalChange = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;

    const inputValue = e.target.value;

    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      let difference = Number(inputValue) - Number(0);
      const getstpage = Array.from({ length: inputValue - 0 }, (_, index) => {
        const startPageNumber = Number(0) + 1 + index;
        return startPageNumber;
      });
      setProducionIndividualChange({ ...ProducionIndividualChange, totalpages: inputValue, startpage: getstpage[0], flagcount: 0, pendingpages: difference });
    }
  };

  const [productionedit, setProductionEdit] = useState({
    vendor: "Please Select Vendor",
    fromdate: "",
    time: "",
    datemode: "",
    datetimezone: "",
    category: "Please Select Subcategory",
    filename: "Please Select Category",
    unitid: "",
    alllogin: "Please Select AllLogin",
    user: "Please Select Loginid",
    docnumber: "",
    doclink: "",
    flagcount: "",
    section: "",
  });
  const { isUserRoleCompare, isUserRoleAccess, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [canvasState, setCanvasState] = useState(false);

  let datemodes =
    isUserRoleCompare.includes("lproductionindividualusers") ||
    isUserRoleAccess.role.includes("Manager") ||
    isUserRoleAccess.role.includes("Director") ||
    isUserRoleAccess.role.includes("Admin") ||
    isUserRoleAccess.role.includes("SuperAdmin") ||
    isUserRoleAccess.role.includes("ADMIN")
      ? [
          { label: "Auto", value: "Auto" },
          { label: "Manual", value: "Manual" },
        ]
      : [{ label: "Auto", value: "Auto" }];

  //image

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Production Manual Entry.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
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

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length == 0) {
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
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

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    vendor: true,
    datemode: true,
    fromdate: true,
    time: true,
    filename: true,
    category: true,
    unitid: true,
    user: true,
    section: true,
    flagcount: true,
    alllogin: true,
    docnumber: true,
    doclink: true,
    approvalstatus: true,
    lateentrystatus: true,
    startmode: true,
    startdate: true,
    starttime: true,
    status: true,
    totalpages: true,
    pendingpages: true,
    startpage: true,
    reason: true,
    statusmode: true,
    enddate: true,
    endtime: true,
    notes: true,
    actions: true,
    actionsstatus: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteproject(res?.data?.smanualclientoinfo);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    try {
      await axios.delete(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchPending();

      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delProjectcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      await fetchPending();

      handleCloseModcheckbox();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const editSubmit = async () => {
    if (ProducionIndividualChange.statusmode === "Please Select Status") {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      ProducionIndividualChange.statusmode === "Completed" ||
      ProducionIndividualChange.statusmode === "In Complete" ||
      ProducionIndividualChange.statusmode === "Partial Complete" ||
      ProducionIndividualChange.statusmode === "Started" ||
      ProducionIndividualChange.statusmode === "Stop" ||
      ProducionIndividualChange.statusmode === "Pause"
    ) {
      if (ProducionIndividualChange.fromdate === "") {
        setPopupContentMalert("Please Select End Date!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.time === "") {
        setPopupContentMalert("Please Select End Time!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.totalpages === "" || ProducionIndividualChange.totalpages === 0) {
        setPopupContentMalert("Please Enter Total Pages!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.statusmode === "Completed" && (ProducionIndividualChange.flagcount === 0 || ProducionIndividualChange.flagcount === "")) {
        setPopupContentMalert("Please Enter Completed Pages!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.statusmode === "Completed" && ProducionIndividualChange.flagcount !== ProducionIndividualChange.totalpages) {
        setPopupContentMalert("Completed Pages and Total pages count didn't match!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.pendingpages === "") {
        setPopupContentMalert("Please Enter Pending Pages!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.startdatemode === "") {
        setPopupContentMalert("Please Select Start Date Mode!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.statusmode === "Completed" && ProducionIndividualChange.notes === "") {
        setPopupContentMalert("Please Enter Notes!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.statusmode === "Completed" && ProducionIndividualChange.remarks === "") {
        setPopupContentMalert("Please Enter Remarks!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else if (ProducionIndividualChange.startdate === ProducionIndividualChange.fromdate && ProducionIndividualChange.starttime === ProducionIndividualChange.time) {
        setPopupContentMalert("End Date/Time End Date must be greater than Start Date/Time!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        sendEditRequest();
      }
    } else if (ProducionIndividualChange.statusmode === "Reject" || ProducionIndividualChange.statusmode === "Cancel") {
      if (ProducionIndividualChange.reason === "") {
        setPopupContentMalert("Please Enter Reason!");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        sendEditRequest();
      }
    }
  };

  // get single row view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProductionEdit(res?.data?.smanualclientoinfo);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProducionIndividualChange(res?.data?.smanualclientoinfo);
      setAllUploadedFilesedit(res?.data?.smanualclientoinfo.files);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setProducionIndividualChange(res?.data?.smanualclientoinfo);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = ProducionIndividualChange?.updatedby;
  let addedby = ProducionIndividualChange?.addedby;

  let projectsid = ProducionIndividualChange._id;

  // console.log(ProducionIndividualChange.reason, "reason")

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      if (ProducionIndividualChange?.statusmode === "Reject" || ProducionIndividualChange?.statusmode === "Cancel") {
        let res = await axios.put(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          reason: String(ProducionIndividualChange.reason),
          statusmode: String(ProducionIndividualChange.statusmode),
        });
      } else {
        let res = await axios.put(`${SERVICE.MANUAL_CLIENT_INFO_SINGLE}/${projectsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          fromdate: String(ProducionIndividualChange.fromdate),
          time: String(ProducionIndividualChange.time),
          statusmode: String(ProducionIndividualChange.statusmode),
          enddatemode: String(ProducionIndividualChange.enddatemode),
          totalpages: String(ProducionIndividualChange.totalpages),
          flagcount: String(ProducionIndividualChange.flagcount),
          pendingpages: Number(ProducionIndividualChange.pendingpages),
          startpage: String(ProducionIndividualChange.startpage),
          reason: String(ProducionIndividualChange.reason),
          remarks: String(ProducionIndividualChange.remarks),
          notes: String(ProducionIndividualChange.notes),
          files: allUploadedFilesedit.concat(refImageedit, refImageDragedit, capturedImagesedit),
        });
      }
      await fetchPending();

      handleCloseModEdit();
      setPopupContent("Changed Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production_Individual",
    pageStyle: "print",
  });

  const fetchPending = async () => {
    setLoading(true);
    try {
      let res_employee = await axios.post(SERVICE.TIMESTULDY_COMPLETED_LIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendor: [],
        filename: [],
        category: [],
        user: [],
        fromdate: "",
        status: ["Partial Complete", "In Complete", "Pause", "Stop"],
      });
      const ans = res_employee?.data?.manualclientinfo.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      }));
      setProjmaster(ans);
      setPage(1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    // fetchCompleted();
    fetchPending();
  }, []);

  const addSerialNumber = (datas) => {
    setItems(datas);
    setPage(1);
  };

  useEffect(() => {
    addSerialNumber(projmaster);
  }, [projmaster]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    // setPage(1);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "", // Default header name
      headerStyle: {
        fontWeight: "bold",
      },
      sortable: false,
      width: 90,
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
    },

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "vendor", headerName: "Vendor", flex: 0, width: 150, hide: !columnVisibility.vendor, headerClassName: "bold-header" },
    { field: "datemode", headerName: "Date Mode", flex: 0, width: 150, hide: !columnVisibility.datemode, headerClassName: "bold-header" },
    { field: "fromdate", headerName: "Date", flex: 0, width: 150, hide: !columnVisibility.fromdate, headerClassName: "bold-header" },
    { field: "time", headerName: "Time", flex: 0, width: 150, hide: !columnVisibility.time, headerClassName: "bold-header" },
    { field: "filename", headerName: "Category", flex: 0, width: 150, hide: !columnVisibility.filename, headerClassName: "bold-header" },
    { field: "category", headerName: "SubCategory", flex: 0, width: 150, hide: !columnVisibility.category, headerClassName: "bold-header" },
    { field: "unitid", headerName: "Identifier", flex: 0, width: 150, hide: !columnVisibility.unitid, headerClassName: "bold-header" },
    { field: "user", headerName: "Login Id", flex: 0, width: 150, hide: !columnVisibility.user, headerClassName: "bold-header" },
    { field: "section", headerName: "Section", flex: 0, width: 150, hide: !columnVisibility.section, headerClassName: "bold-header" },
    { field: "flagcount", headerName: "Flag Count", flex: 0, width: 150, hide: !columnVisibility.flagcount, headerClassName: "bold-header" },
    { field: "alllogin", headerName: "All Login", flex: 0, width: 150, hide: !columnVisibility.alllogin, headerClassName: "bold-header" },
    { field: "docnumber", headerName: "Doc Number", flex: 0, width: 150, hide: !columnVisibility.docnumber, headerClassName: "bold-header" },
    { field: "doclink", headerName: "Doc Link", flex: 0, width: 150, hide: !columnVisibility.doclink, headerClassName: "bold-header" },

    { field: "startmode", headerName: "Start Mode", flex: 0, width: 150, hide: !columnVisibility.startmode, headerClassName: "bold-header" },
    { field: "startdate", headerName: "Start Date", flex: 0, width: 150, hide: !columnVisibility.startdate, headerClassName: "bold-header" },
    { field: "starttime", headerName: "Start Time", flex: 0, width: 150, hide: !columnVisibility.starttime, headerClassName: "bold-header" },
    { field: "statusmode", headerName: "Status Mode", flex: 0, width: 150, hide: !columnVisibility.statusmode, headerClassName: "bold-header" },

    { field: "totalpages", headerName: "Total Pages", flex: 0, width: 150, hide: !columnVisibility.totalpages, headerClassName: "bold-header" },
    { field: "pendingpages", headerName: "Pending Pages", flex: 0, width: 150, hide: !columnVisibility.pendingpages, headerClassName: "bold-header" },
    { field: "startpage", headerName: "Start Page", flex: 0, width: 150, hide: !columnVisibility.startpage, headerClassName: "bold-header" },
    { field: "notes", headerName: "Remark/Notes", flex: 0, width: 150, hide: !columnVisibility.notes, headerClassName: "bold-header" },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 350,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex", alignItems: "baseline" }}>
          {params.data.statusmode === "In Complete" || params.data.statusmode === "Partial Complete" ? (
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              Pending{" "}
            </Button>
          ) : params.data.statusmode === "Pause" ? (
            <Button
              variant="contained"
              size="small"
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              Pause{" "}
            </Button>
          ) : params.data.statusmode === "Stop" ? (
            <Button
              variant="contained"
              size="small"
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              Restart{" "}
            </Button>
          ) : params.data.statusmode === "Started" ? (
            <Button
              variant="contained"
              size="small"
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              In Progress{" "}
            </Button>
          ) : (
            ""
          )}

          {isUserRoleCompare?.includes("dmanualentrytimestudylist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vmanualentrytimestudylist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("imanualentrytimestudylist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = items.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      vendor: item.vendor,
      datemode: item.datemode,
      fromdate: item.fromdate,
      time: item.time,
      filename: item.filename,
      category: item.category,
      unitid: item.unitid,
      user: item.user,
      section: item.section,
      flagcount: item.flagcount,
      alllogin: item.alllogin,
      docnumber: item.docnumber,
      doclink: item.doclink,
      approvalstatus: item.approvalstatus,
      lateentrystatus: item.lateentrystatus,
      startmode: item.startmode,
      startdate: item.startdate,
      starttime: item.starttime,
      statusmode: item.statusmode,
      totalpages: item.totalpages,
      flagcount: item.flagcount,
      startpage: item.startpage,
      pendingpages: item.pendingpages,
      reason: item.reason,
      enddate: item.enddate,
      endtime: item.endtime,
      notes: item.notes,
    };
  });

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

  // // Function to filter columns based on search query
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
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                // secondary={column.headerName }
              />
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

  const [fileFormat, setFormat] = useState("");

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Production Manual Entry"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };

  useEffect(() => {
    getapi();
  }, []);

  const [refImageedit, setRefImageedit] = useState([]);
  const [previewURLedit, setPreviewURLedit] = useState(null);
  const [refImageDragedit, setRefImageDragedit] = useState([]);
  const [valNumedit, setValNumedit] = useState(0);
  const [isWebcamOpenedit, setIsWebcamOpenedit] = useState(false);
  const [capturedImagesedit, setCapturedImagesedit] = useState([]);
  const [getImgedit, setGetImgedit] = useState(null);
  const webcamOpenedit = () => {
    setIsWebcamOpenedit(true);
  };
  const webcamCloseedit = () => {
    setIsWebcamOpenedit(false);
    setGetImgedit("");
  };
  const webcamDataStoreedit = () => {
    webcamCloseedit();
    setGetImgedit("");
  };
  const showWebcamedit = () => {
    webcamOpenedit();
  };
  const [uploadPopupOpenedit, setUploadPopupOpenedit] = useState(false);
  const handleClickUploadPopupOpenedit = () => {
    setUploadPopupOpenedit(true);
  };
  const handleUploadPopupCloseedit = () => {
    setUploadPopupOpenedit(false);
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };
  const handleInputChangeedit = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImageedit];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageedit(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  let combinedArray = allUploadedFilesedit.concat(refImageedit, refImageDragedit, capturedImagesedit);
  let uniqueValues = {};
  let resultArray = combinedArray.filter((item) => {
    if (!uniqueValues[item.name]) {
      uniqueValues[item.name] = true;
      return true;
    }
    return false;
  });

  //first deletefile
  const handleDeleteFileedit = (index) => {
    const newSelectedFiles = [...refImageedit];
    newSelectedFiles.splice(index, 1);
    setRefImageedit(newSelectedFiles);
  };

  const renderFilePreviewedit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const resetImageedit = () => {
    setGetImgedit("");
    setRefImageedit([]);
    setPreviewURLedit(null);
    setRefImageDragedit([]);
    setCapturedImagesedit([]);
  };
  const handleDragOveredit = (event) => {};
  const handleDropedit = (event) => {
    event.preventDefault();
    previewFileedit(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDragedit];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFilesDrag.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageDragedit(newSelectedFilesDrag);
        };
        reader.readAsDataURL(file);
      } else {
        setPopupContentMalert("Only Accept Images!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };
  const handleUploadOverAlledit = () => {
    setUploadPopupOpenedit(false);
  };
  const previewFileedit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURLedit(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFileedit = (index) => {
    const newSelectedFiles = [...refImageDragedit];
    newSelectedFiles.splice(index, 1);
    setRefImageDragedit(newSelectedFiles);
  };

  return (
    <Box>
      <Headtitle title={"Pending ManualEntry TimeStudy List"} />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Manual Entry</Typography> */}
      <PageHeading title="Pending ManualEntry TimeStudy List" modulename="Production" submodulename="Manual Entry" mainpagename="Pending ManualEntry TimeStudy List" subpagename="" subsubpagename="" />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lmanualentrytimestudylist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container style={userStyle.dataTablestyle}>
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
                    <MenuItem value={projmaster.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelmanualentrytimestudylist") && (
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
                  {isUserRoleCompare?.includes("csvmanualentrytimestudylist") && (
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
                  {isUserRoleCompare?.includes("printmanualentrytimestudylist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfmanualentrytimestudylist") && (
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
                  {isUserRoleCompare?.includes("imagemanualentrytimestudylist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={projmaster}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={projmaster}
                />
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
            <br />
            <br />
            {loading ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <AggridTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={projmaster}
                />
              </>
            )}
            {/* ****** Table End ****** */}
          </Box>
        </>
      )}
      {/* ****** Table End ****** */}

      {/* Delete Modal */}
      <Box>
        {/* ALERT DIALOG */}
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
            <Button autoFocus variant="contained" color="error" onClick={(e) => delProject(projectid)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>

        {/* this is info view details */}
        <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>Production Manual Entry Info</Typography>
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
                <TableCell>Vendor</TableCell>
                <TableCell>Date Mode</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Identifier</TableCell>
                <TableCell>Login ID</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Flag Count</TableCell>
                <TableCell>All Login</TableCell>
                <TableCell>Doc Number</TableCell>
                <TableCell>Doc Link</TableCell>
                <TableCell>Start Mode</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Status Mode</TableCell>
                <TableCell>Total Pages</TableCell>
                <TableCell>Pending Pages</TableCell>
                <TableCell>Start Page</TableCell>
                <TableCell>Remarks/Notes</TableCell>
                <TableCell>Approval Status</TableCell>
                <TableCell>Late Entry Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.datemode}</TableCell>
                    <TableCell>{moment(row.fromdate).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.unitid}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.section}</TableCell>
                    <TableCell>{row.flagcount}</TableCell>
                    <TableCell>{row.alllogin}</TableCell>
                    <TableCell>{row.docnumber}</TableCell>
                    <TableCell>{row.doclink}</TableCell>
                    <TableCell>{row.startmode}</TableCell>
                    <TableCell>{row.startdate}</TableCell>
                    <TableCell>{row.starttime}</TableCell>
                    <TableCell>{row.statusmode}</TableCell>
                    <TableCell>{row.totalpages}</TableCell>
                    <TableCell>{row.pendingpages}</TableCell>
                    <TableCell>{row.startpage}</TableCell>
                    <TableCell>{row.notes}</TableCell>
                    <TableCell>{row.approvalstatus}</TableCell>
                    <TableCell>{row.lateentrystatus}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          style={{
            display: canvasState === false ? "none" : "block",
          }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="excelcanvastable" ref={gridRef}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Project Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.name}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: "95px" }}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Production Manual Entry</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Vendor</b>
                  </Typography>
                  <Typography>{productionedit.vendor}</Typography>
                </FormControl>
              </Grid>
              {productionedit?.creationstatus != "" || undefined ? (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Start Date Mode</b>
                      </Typography>
                      <Typography>{productionedit.startmode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={6} xs={12}>
                        <Typography>
                          <b> Start Date</b>
                        </Typography>
                        <Typography>{moment(productionedit.startdate).format("DD/MM/YYYY")}</Typography>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            <b> Start Time</b>
                          </Typography>
                          <Typography>{productionedit.starttime}</Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Date Mode</b>
                      </Typography>
                      <Typography>{productionedit.datemode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={6} xs={12}>
                        <Typography>
                          <b> Date</b>
                        </Typography>
                        <Typography>{moment(productionedit.fromdate).format("DD/MM/YYYY")}</Typography>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            <b> Time</b>
                          </Typography>
                          <Typography>{productionedit.time}</Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Category</b>
                  </Typography>
                  <Typography>{productionedit.filename}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Sub Category</b>
                  </Typography>
                  <Typography>{productionedit.category}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Identifier</b>
                  </Typography>
                  <Typography>{productionedit.unitid}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Login Id</b>
                  </Typography>
                  <Typography>{productionedit.user}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> All Login</b>
                  </Typography>
                  <Typography>{productionedit.alllogin}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Section</b>
                  </Typography>
                  <Typography>{productionedit.section}</Typography>
                </FormControl>
              </Grid>
              {productionedit?.creationstatus && (
                <>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Total Pages</b>
                      </Typography>
                      <Typography>{productionedit.totalpages}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Completed Pages</b>
                      </Typography>
                      <Typography>{productionedit.flagcount}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Pending Pages</b>
                      </Typography>
                      <Typography>{productionedit.pendingpages}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Start Page</b>
                      </Typography>
                      <Typography>{productionedit.startpage}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b>Status</b>
                      </Typography>
                      <Typography>{productionedit.statusmode}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Doc Number</b>
                  </Typography>
                  <Typography>{productionedit.docnumber}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    <b> Doc Link</b>
                  </Typography>
                  <Typography>{productionedit.doclink}</Typography>
                </FormControl>
              </Grid>
              {productionedit?.statusmode === "Completed" && (
                <>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> End Date Mode</b>
                      </Typography>
                      <Typography>{productionedit.enddatemode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={6} sm={6} xs={12}>
                        <Typography>
                          <b> End Date</b>
                        </Typography>
                        <Typography>{moment(productionedit.fromdate).format("DD/MM/YYYY")}</Typography>
                      </Grid>
                      <Grid item md={6} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            <b> End Time</b>
                          </Typography>
                          <Typography>{productionedit.time}</Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Remarks</b>
                      </Typography>
                      <Typography>{productionedit.remarks}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        <b> Notes</b>
                      </Typography>
                      <Typography>{productionedit.notes}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography>
                      <b> Attachments</b>
                    </Typography>
                    {productionedit?.files?.map((file, index) => (
                      <>
                        <Grid container>
                          <Grid item md={2} sm={2} xs={2}>
                            <Box
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {file.type.includes("image/") ? (
                                <img
                                  src={file.preview}
                                  alt={file.name}
                                  height={50}
                                  style={{
                                    maxWidth: "-webkit-fill-available",
                                  }}
                                />
                              ) : (
                                <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                              )}
                            </Box>
                          </Grid>
                          <Grid
                            item
                            md={8}
                            sm={8}
                            xs={8}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2"> {file.name} </Typography>
                          </Grid>
                          <Grid item md={1} sm={1} xs={1}>
                            <Grid sx={{ display: "flex" }}>
                              <Button
                                sx={{
                                  padding: "14px 14px",
                                  minWidth: "40px !important",
                                  borderRadius: "50% !important",
                                  ":hover": {
                                    backgroundColor: "#80808036", // theme.palette.primary.main
                                  },
                                }}
                                onClick={() => renderFilePreviewedit(file)}
                              >
                                <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8" }} />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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
            <Button autoFocus variant="contained" color="error" onClick={delProjectcheckbox}>
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

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="lg"
          sx={{
            overflow: "auto",
            "& .MuiPaper-root": {
              overflow: "auto",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  Change Status <b style={{ color: "red" }}>Start Date&Time : {moment(ProducionIndividualChange.startdate).format("DD/MM/YYYY") + " " + ProducionIndividualChange.starttime}</b>{" "}
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Status <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={statuschange}
                      styles={colourStyles}
                      value={{ label: ProducionIndividualChange.statusmode, value: ProducionIndividualChange.statusmode }}
                      onChange={(e) => {
                        setProducionIndividualChange({ ...ProducionIndividualChange, statusmode: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                {(ProducionIndividualChange.statusmode === "Completed" ||
                  ProducionIndividualChange.statusmode === "In Complete" ||
                  ProducionIndividualChange.statusmode === "Partial Complete" ||
                  ProducionIndividualChange.statusmode === "Started" ||
                  ProducionIndividualChange.statusmode === "Stop" ||
                  ProducionIndividualChange.statusmode === "Pause") && (
                  <>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          End Date Mode <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={datemodes}
                          styles={colourStyles}
                          value={{ label: ProducionIndividualChange.enddatemode, value: ProducionIndividualChange.enddatemode }}
                          onChange={(e) => {
                            setProducionIndividualChange({ ...ProducionIndividualChange, enddatemode: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <Grid container spacing={2}>
                        <Grid item md={6} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              End Date <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput id="component-outlinedname" type="date" disabled={ProducionIndividualChange.enddatemode === "Auto"} value={ProducionIndividualChange.fromdate} onChange={handleDateChangeEdit} />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              End Time <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlinedname"
                              type="time"
                              disabled={ProducionIndividualChange.enddatemode === "Auto"}
                              value={ProducionIndividualChange.time}
                              onChange={(e) => {
                                const selectedEndTime = e.target.value; // End time from input

                                // Parse the start and end times into hours and minutes
                                const [startHours, startMinutes] = ProducionIndividualChange.starttime === "" ? currtime?.split(":")?.map(Number) : ProducionIndividualChange.starttime?.split(":")?.map(Number);
                                const [endHours, endMinutes] = selectedEndTime.split(":").map(Number);

                                // Parse start date and end date
                                const startDate = new Date(ProducionIndividualChange.startdate || new Date()); // Start date
                                const endDate = new Date(ProducionIndividualChange.fromdate || new Date()); // End date

                                // Set time for startDate and endDate to be the hours and minutes from inputs
                                startDate.setHours(startHours, startMinutes, 0, 0); // Set start time
                                endDate.setHours(endHours, endMinutes, 0, 0); // Set end time

                                // Compare if the end date-time is before or equal to start date-time
                                if (endDate <= startDate) {
                                  setPopupContent("End date and time should be after the start date and time!");
                                  setPopupSeverity("warning");
                                  handleClickOpenPopup();
                                  setProducionIndividualChange({ ...ProducionIndividualChange, time: "" });
                                } else {
                                  setProducionIndividualChange({ ...ProducionIndividualChange, time: selectedEndTime });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Total Pages <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Total Pages" value={ProducionIndividualChange.totalpages} onChange={(e) => handleChangephonenumbertotalChange(e)} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Completed Pages <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Completed Pages" value={ProducionIndividualChange.flagcount} onChange={(e) => handleChangephonenumberflagChange(e)} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Pending Pages <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput id="component-outlinedname" type="text" placeholder="Please Enter Flag Count" value={ProducionIndividualChange.pendingpages} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Start Page <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput id="component-outlinedname" type="text" value={ProducionIndividualChange.startpage} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <Typography>Attachment</Typography>
                      <Box sx={{ display: "flex", justifyContent: "left" }}>
                        <Button variant="contained" onClick={handleClickUploadPopupOpenedit}>
                          Upload
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography>
                          Remarks<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={ProducionIndividualChange.remarks}
                          onChange={(e) => {
                            setProducionIndividualChange({ ...ProducionIndividualChange, remarks: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Typography>
                          Notes<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={ProducionIndividualChange.notes}
                          onChange={(e) => {
                            setProducionIndividualChange({ ...ProducionIndividualChange, notes: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                {(ProducionIndividualChange.statusmode === "Reject" || ProducionIndividualChange.statusmode === "Cancel") && (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth>
                        <Typography>
                          Reason<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={5}
                          value={ProducionIndividualChange.reason}
                          onChange={(e) => {
                            setProducionIndividualChange({ ...ProducionIndividualChange, reason: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      {/* UPLOAD IMAGE DIALOG EDIT */}
      <Dialog open={uploadPopupOpenedit} onClose={handleUploadPopupCloseedit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: "95px" }}>
        <DialogTitle id="customized-dialog-title1" sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}>
          Upload Image Edit
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              {/* {showDragField ? ( */}
              <div onDragOver={handleDragOveredit} onDrop={handleDropedit}>
                {previewURLedit && refImageDragedit.length > 0 ? (
                  <>
                    {refImageDragedit.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button onClick={() => handleRemoveFileedit(index)} style={{ marginTop: "0px", color: "red" }}>
                          X
                        </Button>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon /> Drag and drop
                    </div>
                  </div>
                )}
              </div>
              {/* ) : null} */}
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button variant="contained" component="label" sx={userStyle.uploadbtn}>
                    {" "}
                    Upload
                    <input type="file" multiple id="productimage" accept="image/*" hidden onChange={handleInputChangeedit} />
                  </Button>
                  &ensp;
                  <Button variant="contained" onClick={showWebcamedit} sx={userStyle.uploadbtn}>
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {resultArray?.map((file, index) => (
                <>
                  <Grid container>
                    <Grid item md={2} sm={2} xs={2}>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {file.type.includes("image/") ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            height={50}
                            style={{
                              maxWidth: "-webkit-fill-available",
                            }}
                          />
                        ) : (
                          <img className={classes.preview} src={getFileIcon(file.name)} height="10" alt="file icon" />
                        )}
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={8}
                      sm={8}
                      xs={8}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2"> {file.name} </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={1}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreviewedit(file)}
                        >
                          <VisibilityOutlinedIcon style={{ fontsize: "12px", color: "#357AE8" }} />
                        </Button>
                        <Button
                          sx={{
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => {
                            handleDeleteFileedit(index);
                          }}
                        >
                          <FaTrash style={{ color: "#a73131", fontSize: "12px" }} />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAlledit} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImageedit} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupCloseedit} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog open={isWebcamOpenedit} onClose={webcamCloseedit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={nameedit}
            getImgedit={getImgedit}
            setGetImgedit={setGetImgedit}
            valNumedit={valNumedit}
            setValNumedit={setValNumedit}
            capturedImagesedit={capturedImagesedit}
            setCapturedImagesedit={setCapturedImagesedit}
            setRefImageedit={setRefImageedit}
            setRefImageDragedit={setRefImageDragedit}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStoreedit}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamCloseedit}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />

      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        // filteredDataTwo={filteredData ?? []}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={projmaster ?? []}
        filename={"Pending Manual Entry TimeStudy List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default PendingTimeStudyList;