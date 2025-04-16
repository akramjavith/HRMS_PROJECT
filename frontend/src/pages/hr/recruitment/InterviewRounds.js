import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback,
} from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Webcamimage from "../webcamprofile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import "../../../App.css";
import debounce from "lodash/debounce";
import {
  TextField,
  Tooltip,
  IconButton,
  ListItem,
  List,
  Checkbox,
  ListItemText,
  Popover,
  Box,
  Container,
  Typography,
  FormControlLabel,
  OutlinedInput,
  TableBody,
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
  InputLabel,
} from "@mui/material";
import Selects from "react-select";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { colourStyles, userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../../services/Baseservice";
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
import { DataGrid, GridRowEditStopReasons } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import ScheduleInterview from "./ScheduleInterview";
import OnBoardingSalaryFix from "./OnBoardingSalaryFix";
import ResponseLogTable from "./ResponseLogTable";
import { BASE_URL } from "../../../services/Authservice";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

import {
  Restore as RestoreIcon,
  Undo as UndoIcon,
  Replay as ResetIcon,
  RotateRight as RetestIcon,
} from "@mui/icons-material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import { handleApiError } from "../../../components/Errorhandling";

function InterviewRounds() {
  const [manager, setManger] = useState(false);
  const [deletebtn, setDeleteBtn] = useState(false);
  const [deletebtnDisable, setDeleteBtnDisable] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  let obj = {
    prefix: "Prefix",
    firstname: " First Name",
    lastname: "Last Name",
    fullname: "Full Name",
    email: "Email",
    mobile: "Mobile Number",
    whatsapp: "Whats app Number",
    adharnumber: "Aadhar Number",
    pannumber: "Pan Number",
    age: "Age",
    dateofbirth: "Date of Birth",
    street: "Street",
    country: "Country",
    state: "State",
    city: "City",
    postalcode: "Postal Code",
    experience: "Domain Experience",
    experienceestimation: "Overall Experience Estimation",
    domainexperienceestimation: "Domain Experience Estimation",
    expectedsalaryopts: "Expected Salary Options",
    joiningbydaysopts: "Joining By Days Options",
    domainexperience: "Domain Experience",
    additionalinfo: "Additional Info",
    joinbydays: "Joining By Days",
    noticeperiod: "Notice Period",
    certification: "Certification",
    uploadedimage: "Profile Image",
    currentemployer: "Current Employeer",
    currentjobtitle: "Current Job Title",
    // uploadedimagename: "Profile Image",
    // files: "",
    interviewdate: "Interview Prefered Date",
    time: "Interview Prefered Time",
    gender: "Gender",
    // education: "Education",
    // category: "Educationn Category",
    // subcategory: "Educationn Sub Category",
    otherqualification: "",
    expectedsalary: "Expected Salary",
    currentsalary: "Current Salary",
    skillset: "Skill Set",
    linkedinid: "LinkedIn Id",
    // status: "",
    source: "Source",
    sourcecandidate: "Source Of Candidate",
    resumefile: "Resume",
    coverletterfile: "Cover Letter",
    candidatedatafile: "Candidate Document",
    // coverlettertext: "Cover Letter Text",
    experienceletterfile: "Experience Letter",
    payslipletterfile: "Pay Slip",
    educationdetails: "Educational Details",
    experiencedetails: "Experience Details",
    skill: "Skill",
    role: "Role",
  };

  const [openMissingFields, setOpenMissingFields] = useState(false);
  const handleOpenMissingField = () => {
    setOpenMissingFields(true);
  };
  const handleCloseMissingField = () => {
    setOpenMissingFields(false);
  };

  const [checked, setChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please Wait...!");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  const buttonStyles = {
    default: {
      backgroundColor: "primary.main",
    },
    fixed: {
      backgroundColor: "green",
      "&:hover": {
        backgroundColor: "darkgreen",
      },
    },
  };

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
        rowDataTable?.map((item, index) => ({
          Sno: index + 1,
          "Applicant Name": item.fullname,
          username: item.username,
          password: item.password,
          Interviewer: item.interviewer,
          "Applied Date/Time": item?.appliedat,
          "Scheduled Date/Time": item?.scheduledat,
          "Reporting Date/Time": item.reportingdatetime,
          "Deadline Date/Time": item.deadlinedatetime,
          Duration: item.duration,
          "Round Mode": item.roundmode,
          "Test Name": item.testname,
          "Round Type": item.roundtype,
          "Round Category": item.roundcategory,
          "Round SubCategory": item.roundsubcategory,
          "Retest Count": item.retestcount,
          Attempts: item.attempts,
          "Round Link": item.roundlink,
          "Round Status": item.roundstatus,
          "Round Answer Status": item.roundanswerstatus,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((item, index) => ({
          Sno: index + 1,
          "Applicant Name": item.fullname,
          username: item.username,
          password: item.password,
          Interviewer: item.interviewer,
          "Applied Date/Time": item?.appliedat,
          "Scheduled Date/Time": item?.scheduledat,
          "Reporting Date/Time": item.reportingdatetime,
          "Deadline Date/Time": item.deadlinedatetime,
          Duration: item.duration,
          "Round Mode": item.roundmode,
          "Test Name": item.testname,
          "Round Type": item.roundtype,
          "Round Category": item.roundcategory,
          "Round SubCategory": item.roundsubcategory,
          "Retest Count": item.retestcount,
          Attempts: item.attempts,
          "Round Link": item.roundlink,
          "Round Status": item.roundstatus,
          "Round Answer Status": item.roundanswerstatus,
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  //  PDF
  const columns = [
    // { title: "S.No", field: "serialNumber" },
    { title: "Applicant Name", field: "fullname" },
    { title: "User Name", field: "username" },
    { title: "Password", field: "password" },
    { title: "Interviewer", field: "interviewer" },
    { title: "Applied Date/Time", field: "appliedat" },
    { title: "Scheduled Date/Time", field: "scheduledat" },
    { title: "Reporting Date/Time", field: "reportingdatetime" },
    { title: "Deadline Date/Time", field: "deadlinedatetime" },
    { title: "Duration", field: "duration" },
    { title: "Round Mode", field: "roundmode" },
    { title: "Test Name", field: "testname" },
    { title: "Round Type", field: "roundtype" },
    { title: "Round Category", field: "roundcategory" },
    { title: "Round SubCategory", field: "roundsubcategory" },
    { title: "Retest Count", field: "retestcount" },
    { title: "Attempts", field: "attempts" },
    { title: "Round Status", field: "roundstatus" },
    { title: "Round Answer Status", field: "roundanswerstatus" },
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
        ? rowDataTable?.map((item, index) => ({
            serialNumber: index + 1,
            fullname: item.fullname,
            username: item.username,
            password: item.password,
            interviewer: item.interviewer,
            reportingdatetime: item.reportingdatetime,
            deadlinedatetime: item.deadlinedatetime,
            duration: item.duration,
            roundmode: item.roundmode,
            testname: item.testname,
            roundtype: item.roundtype,
            roundcategory: item.roundcategory,
            roundsubcategory: item.roundsubcategory,
            retestcount: item.retestcount,
            attempts: item.attempts,
            roundstatus: item.roundstatus,
            roundanswerstatus: item.roundanswerstatus,
            appliedat: item?.appliedat,
            scheduledat: item?.scheduledat,
          }))
        : items?.map((item, index) => ({
            serialNumber: index + 1,
            fullname: item.fullname,
            username: item.username,
            password: item.password,
            interviewer: item.interviewer,
            reportingdatetime: item.reportingdatetime,
            deadlinedatetime: item.deadlinedatetime,
            duration: item.duration,
            roundmode: item.roundmode,
            testname: item.testname,
            roundtype: item.roundtype,
            roundcategory: item.roundcategory,
            roundsubcategory: item.roundsubcategory,
            retestcount: item.retestcount,
            attempts: item.attempts,
            roundstatus: item.roundstatus,
            roundanswerstatus: item.roundanswerstatus,
            appliedat: item?.appliedat,
            scheduledat: item?.scheduledat,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save(`${roleName}-${tableName}.pdf`);
  };

  let ids = useParams().id;

  const [singleJobData, setSingleJobData] = useState({});
  const [roleName, setRoleName] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isUserRoleAccess, isUserRoleCompare, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);

  const [dateTime, setDateTime] = useState({
    reportingdate: moment().format("YYYY-MM-DD"),
    reportingtime: moment().format("HH:mm"),
    deadlinedate: moment().format("YYYY-MM-DD"),
    deadlinetime: "23:59",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  let [testMark, setTestMark] = useState({
    testname: "",
    totalmarks: "",
    eligiblemarks: "",
    obtainedmarks: "",
    roundid: "",
  });

  //alert model for schedule interview
  const [openMeetingPopup, setOpenMeetingPopup] = useState(false);
  const [vendorAuto, setVendorAuto] = useState("");
  const [prevId, setPrevId] = useState("");
  const [meetingValues, setMeetingValues] = useState([]);

  const LoadingBackdrop = ({ open }) => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="pulsating-circle">
          <CircularProgress color="inherit" className="loading-spinner" />
        </div>
        <Typography
          variant="h6"
          sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
        >
          Opening Responses, Please Wait...
        </Typography>
      </Backdrop>
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  // meeting popup model
  // meeting popup model
  const handleClickOpenMeetingPopup = (
    company,
    branch,
    rolename,
    candidateid,
    candidatename,
    candesignation
  ) => {
    setOpenMeetingPopup(true);
    setMeetingValues([
      company,
      branch,
      rolename,
      candidateid,
      candidatename,
      candesignation,
    ]);
  };

  const handleClickCloseMeetingPopup = () => {
    setOpenMeetingPopup(false);
  };

  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [isBankdetail, setBankdetail] = useState(false);

  let username = isUserRoleAccess.username;

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsList, setSelectedRowsList] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  const [datas, setDatas] = useState({
    category: "",
    type: "",
    salarystatus: "",
  });

  const categoryOptions = [
    { label: "On Boarding", value: "On Boarding" },
    { label: "Reject", value: "Reject" },
    { label: "Hold", value: "Hold" },
  ];
  const typeOptions = [
    { label: "Employee", value: "Employee" },
    { label: "Intern", value: "Intern" },
  ];

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, `${roleName}-${tableName}.png`);
        });
      });
    }
  };

  const [migrateData, setMigrateData] = useState({});
  const [salaryFixed, setSalaryFixed] = useState(false);

  const handleMoveChange = async () => {
    const updatedGroupDetails = groupDetails.map((item) => {
      if (selectedRowsList.includes(item._id)) {
        return { ...item, lastcheck: true };
      } else {
        return { ...item, lastcheck: false };
      }
    });
    const getallmigrationdata = await axios.get(
      `${SERVICE.CANDIDATES_SINGLE}/${migrateData.id}`
    );
    const resmigdata = {
      ...migrateData,
      ...getallmigrationdata?.data?.scandidates,
    };
    if (!datas.category || datas.category == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select any of the Options!
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      datas.category == "On Boarding" &&
      (datas.type == undefined || datas.type == "")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select To Migrate!
          </p>
        </>
      );
      handleClickOpenerr();
    }
    // else if (
    //   datas.category == "On Boarding" &&
    //   updatedGroupDetails?.some((data) => data?.lastcheck === false)
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         Please Check All The Details!
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    // else if (datas.category == "On Boarding" && !salaryFixed) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>Please Fix Salary</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else {
      if (datas.category == "Hold") {
        await sendRequest();
        let updatedData = await axios.put(
          `${SERVICE.CANDIDATES_SINGLE}/${migrateData.id}`,
          {
            finalstatus: "Hold",
            overallstatus: "On Hold",
            candidatedatafile: [
              ...candidateUploadedDocuments,
              ...candidateDocumentsFilled,
            ],
          }
        );
        await fetchUniqueRounds(tableName);
        setSalaryFixed(false);
        handleCloseToMove();
        handleCloseModEdit();
        // window.location.reload();
      } else if (datas.category == "Reject") {
        let updatedData = await axios.put(
          `${SERVICE.CANDIDATES_SINGLE}/${migrateData.id}`,
          {
            finalstatus: "Rejected",
            overallstatus: "Rejected",
            candidatedatafile: [
              ...candidateUploadedDocuments,
              ...candidateDocumentsFilled,
            ],
          }
        );
        await fetchUniqueRounds(tableName);
        setSalaryFixed(false);
        handleCloseToMove();
        handleCloseModEdit();
        // window.location.reload();
      } else if (datas.category == "On Boarding" && datas.type == "Employee") {
        let updatedData = await axios.put(
          `${SERVICE.CANDIDATES_SINGLE}/${migrateData.id}`,
          {
            candidatedatafile: [
              ...candidateUploadedDocuments,
              ...candidateDocumentsFilled,
            ],
          }
        );
        await sendRequest();
        await fetchUniqueRounds(tableName);
        handleCloseModEdit();
        setSalaryFixed(false);
        navigate("/addemployeenew/interviewRounds", {
          state: { migrateData: resmigdata },
        });
      } else if (datas.category == "On Boarding" && datas.type == "Intern") {
        let updatedData = await axios.put(
          `${SERVICE.CANDIDATES_SINGLE}/${migrateData.id}`,
          {
            candidatedatafile: [
              ...candidateUploadedDocuments,
              ...candidateDocumentsFilled,
            ],
          }
        );
        await sendRequest();
        await fetchUniqueRounds(tableName);
        handleCloseModEdit();
        setSalaryFixed(false);
        navigate("/addinternnew/interviewRounds", {
          state: { migrateData: resmigdata },
        });
      }
    }
  };

  // view model
  const [openview, setOpenview] = useState(false);
  const [roundmasterEdit, setRoundmasterEdit] = useState({});
  const [testStatus, setTestStatus] = useState("Please Select Test Status");

  const statusOption = [
    { label: "Selected", value: "Selected" },
    { label: "On Hold", value: "On Hold" },
    { label: "Rejected", value: "Rejected" },
  ];
  const manualOption = [
    { label: "Eligible", value: "Eligible" },
    { label: "Not Eligible", value: "Not Eligible" },
  ];

  const handleViewImageSubEdit = (data) => {
    const blob = dataURItoBlob(data.uploadedimage);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);
  };

  const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(":");
    const formattedDuration =
      (hours !== "00" ? `${parseInt(hours)} Hrs` : "") +
      (minutes !== "00"
        ? `${hours !== "00" ? " " : ""}${parseInt(minutes)} Mins`
        : "");
    return formattedDuration;
  };

  // Convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
    setTestStatus("Please Select Test Status");
    setChecked(false);
    setTestMark({
      testname: "",
      totalmarks: "",
      eligiblemarks: "",
      obtainedmarks: "",
      roundid: "",
    });
  };

  const [openviewTypingtest, setOpenviewTypingtest] = useState(false);
  const handleClickOpenviewTypingtest = () => {
    setOpenviewTypingtest(true);
  };

  const handleCloseviewTypingtest = () => {
    setOpenviewTypingtest(false);
    setTestStatus("Please Select Test Status");
    setChecked(false);
    setTestMark({
      testname: "",
      totalmarks: "",
      eligiblemarks: "",
      obtainedmarks: "",
      roundid: "",
    });
  };

  // response edit model

  const [openviewTypingtestEdit, setOpenviewTypingtestEdit] = useState(false);
  const handleClickOpenviewTypingtestEdit = () => {
    setOpenviewTypingtestEdit(true);
  };

  const [editResponseValues, setEditResponseValues] = useState({
    speed: "",
    speedstatus: "",
    accuraccy: "",
    accuraccystatus: "",
    mistakes: "",
    mistakesstatus: "",
  });

  const statusOptiontyping = [
    {
      label: "Eligible",
      value: "Eligible",
    },
    {
      label: "Not Eligible",
      value: "Not Eligible",
    },
  ];

  const handleCloseviewTypingtestEdit = () => {
    setOpenviewTypingtestEdit(false);
    setTestStatus("Please Select Test Status");
    setChecked(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
    setDeleteRoundIdBy("");
  };
  const handleOpenModcheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  //Reset model
  const [isDeleteOpencheckboxReset, setIsDeleteOpencheckboxReset] =
    useState(false);
  const [isDeleteOpencheckboxResetTable, setIsDeleteOpencheckboxResetTable] =
    useState(false);

  const handleCloseModcheckboxReset = () => {
    setIsDeleteOpencheckboxReset(false);
    setDeleteRoundIdBy("");
    setIsDeleteOpencheckboxResetTable(false);
    setDateTime({
      reportingdate: moment().format("YYYY-MM-DD"),
      reportingtime: moment().format("HH:mm"),
      deadlinedate: moment().format("YYYY-MM-DD"),
      deadlinetime: "23:59",
    });
  };
  const handleOpenModcheckboxReset = () => {
    setIsDeleteOpencheckboxReset(true);
    setBtnSubmitRoundStatus(false);
  };
  //Reset model table

  //start test model
  const [isStartTestOpencheckbox, setIsStartTestOpencheckbox] = useState(false);

  const handleCloseModcheckboxStartTest = () => {
    setIsStartTestOpencheckbox(false);
  };
  const handleOpenModcheckboxStartTest = () => {
    setIsStartTestOpencheckbox(true);
  };

  //retest model
  const [isReTestOpencheckbox, setIsReTestOpencheckbox] = useState(false);

  const handleCloseModcheckboxReTest = () => {
    setIsReTestOpencheckbox(false);
  };
  const handleOpenModcheckboxReTest = () => {
    setIsReTestOpencheckbox(true);
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

  //to move model
  const [isToMoveOpen, setIsToMoveOpen] = useState(false);

  const handleCloseToMove = () => {
    setIsToMoveOpen(false);
    setDatas({
      category: "",
      type: "",
      salarystatus: "",
    });
    setSalaryFixed(false);
  };

  const [postID, setPostID] = useState();
  const [getDetails, setGetDetails] = useState();
  const [assignDetails, setAssignDetails] = useState();
  const [groupDetails, setGroupDetails] = useState();
  const [datasAvailedDB, setDatasAvailedDB] = useState();
  const [disableInput, setDisableInput] = useState([]);

  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);

  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);

  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);

  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);

  const [isCheckedList, setIsCheckedList] = useState([]);
  const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
  const overallCheckListChange = () => {
    let newArrayChecked = isCheckedList.map(
      (item) => (item = !isCheckedListOverall)
    );

    if (groupDetails) {
      let returnOverall = groupDetails?.map((row) => {
        {
          if (row.checklist === "DateTime") {
            if (
              ((row.data !== undefined && row.data !== "") ||
                row.files !== undefined) &&
              row.data.length === 16
            ) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === "Date Multi Span") {
            if (
              ((row.data !== undefined && row.data !== "") ||
                row.files !== undefined) &&
              row.data.length === 21
            ) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === "Date Multi Span Time") {
            if (
              ((row.data !== undefined && row.data !== "") ||
                row.files !== undefined) &&
              row.data.length === 33
            ) {
              return true;
            } else {
              return false;
            }
          } else if (row.checklist === "Date Multi Random Time") {
            if (
              ((row.data !== undefined && row.data !== "") ||
                row.files !== undefined) &&
              row.data.length === 16
            ) {
              return true;
            } else {
              return false;
            }
          } else if (
            (row.data !== undefined && row.data !== "") ||
            row.files !== undefined
          ) {
            return true;
          } else {
            return false;
          }
        }
      });

      let allcondition = returnOverall?.every((item) => item == true);

      if (allcondition) {
        setIsCheckedList(newArrayChecked);
        setIsCheckedListOverall(!isCheckedListOverall);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Please Fill all the Fields
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Add Check List
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };
  const handleCheckboxChange = (index) => {
    let currentItem = groupDetails[index];
    let data = () => {
      if (currentItem.checklist === "DateTime") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 16
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Span") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 21
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Span Time") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 33
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Random Time") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 16
        ) {
          return true;
        } else {
          return false;
        }
      } else if (
        (currentItem.data !== undefined && currentItem.data !== "") ||
        currentItem.files !== undefined
      ) {
        return true;
      } else {
        return false;
      }
    };
    let statusFor = data();

    if (statusFor) {
      const newCheckedState = [...isCheckedList];
      newCheckedState[index] = !newCheckedState[index];
      setIsCheckedList(newCheckedState);
      handleDataChange(newCheckedState[index], index, "Check Box");
      let overallChecked = newCheckedState.every((item) => item === true);

      if (overallChecked) {
        setIsCheckedListOverall(true);
      } else {
        setIsCheckedListOverall(false);
      }
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Fill the Field
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };
  const [candidateDocuments, setCandidateDocuments] = useState([]);
  const [candidateDocumentsFilled, setCandidateDocumentsFilled] = useState([]);
  const [missingFields, setMissingFields] = useState([]);
  const [documentMissingFields, setDocumentMissingFields] = useState([]);
  const getCodeMyCheckList = async (details) => {
    setLoading(true);
    setGetDetails(details);
    try {
      let resCandidate = await axios.get(
        `${SERVICE.CANDIDATEBYIDFORDOCUMENT}/${details?.id}`
      );
      setCandidateDocuments(resCandidate?.data?.candidate);
      let filledDatas =
        resCandidate?.data?.candidate?.candidatedatafile?.filter(
          (data) => data?.data !== ""
        );
      let emptiedDatas =
        resCandidate?.data?.candidate?.candidatedatafile?.filter(
          (data) => data?.data === ""
        );
      setCandidatesUploadedDocuments(emptiedDatas);
      setCandidateDocumentsFilled(filledDatas);
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let response = await axios.get(
        `${SERVICE.CANDIDATE_MISSINGFIELDS}/?id=${details?.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setMissingFields(response?.data?.emptyFields);
      setDocumentMissingFields(response?.data?.emptyDocumentFields);

      console.log(response?.data?.emptyFields);

      let searchItem = res?.data?.mychecklist.find(
        (item) =>
          item.commonid == details?.id &&
          item.module == "Human Resources" &&
          item.submodule == "Recruitment" &&
          item.mainpage == "Job Openings"
      );
      if (searchItem) {
        setDeleteBtnDisable(false);
        setAssignDetails(searchItem);

        setPostID(searchItem?.commonid);
        let datasNew = searchItem.groups.map((item) => {
          switch (item.details) {
            case "LEGALNAME":
              return {
                ...item,
                data: details.fullname,
              };
              break;
            case "USERNAME":
              return {
                ...item,
                data: "N/A",
              };
              break;
            case "PASSWORD":
              return {
                ...item,
                data: "N/A",
              };
              break;
            case "DATE OF BIRTH":
              return {
                ...item,
                data: details.dateofbirth,
              };
              break;
            case "EMAIL":
              return {
                ...item,
                data: details.email,
              };
              break;
            case "PHONE NUMBER":
              return {
                ...item,
                data: details.mobile,
              };
              break;
            case "FIRST NAME":
              return {
                ...item,
                data: details.firstname,
              };
              break;
            case "LAST NAME":
              return {
                ...item,
                data: details.lastname,
              };
              break;
            case "AADHAAR NUMBER":
              return {
                ...item,
                data: details.adharnumber,
              };
              break;
            case "PAN NUMBER":
              return {
                ...item,
                data: details.pannumber,
              };
              break;
            case "CURRENT ADDRESS":
              return {
                ...item,
                data: "N/A",
              };
              break;
            default:
              return {
                ...item,
              };
          }
        });
        setGroupDetails(
          datasNew?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));

        let forFillDetails = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Random Time") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });

        let forDateSpan = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Span") {
            if (data?.data && data?.data !== "") {
              const [fromdate, todate] = data?.data?.split(" ");
              return { fromdate, todate };
            }
          } else {
            return { fromdate: "0", todate: "0" };
          }
        });

        let forDateTime = datasNew?.map((data) => {
          if (data.checklist === "DateTime") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });

        let forDateMultiSpanTime = datasNew?.map((data) => {
          if (data.checklist === "Date Multi Span Time") {
            if (data?.data && data?.data !== "") {
              const [from, to] = data?.data?.split("/");
              const [fromdate, fromtime] = from?.split(" ");
              const [todate, totime] = to?.split(" ");
              return { fromdate, fromtime, todate, totime };
            }
          } else {
            return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
          }
        });

        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate));
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate));

        setDateValueRandom(forFillDetails.map((item) => item?.date));
        setTimeValueRandom(forFillDetails.map((item) => item?.time));

        setDateValue(forDateTime.map((item) => item?.date));
        setTimeValue(forDateTime.map((item) => item?.time));

        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate));
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime));
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate));
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime));
      } else {
        setDeleteBtnDisable(true);
        setAssignDetails(details);
        setPostID(details?.id);
        let datasNew = thisPageDatas[0]?.groups?.map((item) => {
          switch (item.details) {
            case "LEGALNAME":
              return {
                ...item,
                data: details.fullname,
              };
              break;
            case "USERNAME":
              return {
                ...item,
                data: "N/A",
              };
              break;
            case "PASSWORD":
              return {
                ...item,
                data: "N/A",
              };
              break;
            case "DATE OF BIRTH":
              return {
                ...item,
                data: details.dateofbirth,
              };
              break;
            case "EMAIL":
              return {
                ...item,
                data: details.email,
              };
              break;
            case "PHONE NUMBER":
              return {
                ...item,
                data: details.mobile,
              };
              break;
            case "FIRST NAME":
              return {
                ...item,
                data: details.firstname,
              };
              break;
            case "LAST NAME":
              return {
                ...item,
                data: details.lastname,
              };
              break;
            case "AADHAAR NUMBER":
              return {
                ...item,
                data: details.adharnumber,
              };
              break;
            case "PAN NUMBER":
              return {
                ...item,
                data: details.pannumber,
              };
              break;
            case "CURRENT ADDRESS":
              return {
                ...item,
                data: "N/A",
              };
              break;
            default:
              return {
                ...item,
              };
          }
        });
        setGroupDetails(
          datasNew?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setIsCheckedList(new Array(datasNew?.length).fill(false));

        setDateValueRandom(new Array(details?.groups?.length).fill(0));
        setTimeValueRandom(new Array(details?.groups?.length).fill(0));

        setDateValueMultiFrom(new Array(details?.groups?.length).fill(0));
        setDateValueMultiTo(new Array(details?.groups?.length).fill(0));

        setDateValue(new Array(details?.groups?.length).fill(0));
        setTimeValue(new Array(details?.groups?.length).fill(0));

        setFirstDateValue(new Array(details?.groups?.length).fill(0));
        setFirstTimeValue(new Array(details?.groups?.length).fill(0));
        setSecondDateValue(new Array(details?.groups?.length).fill(0));
        setSecondTimeValue(new Array(details?.groups?.length).fill(0));

        setDisableInput(new Array(details?.groups?.length).fill(true));
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };

  //----------------------------------------------------------------------------------------------------------------------------------
  const updateDateValuesAtIndex = (value, index) => {
    setDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "date");
  };

  const updateTimeValuesAtIndex = (value, index) => {
    setTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "time");
  };
  //---------------------------------------------------------------------------------------------------------------

  const updateFromDateValueAtIndex = (value, index) => {
    setDateValueMultiFrom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "fromdate");
  };

  const updateToDateValueAtIndex = (value, index) => {
    setDateValueMultiTo((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "todate");
  };
  //---------------------------------------------------------------------------------------------------------------------------------
  const updateDateValueAtIndex = (value, index) => {
    setDateValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "date");
  };

  const updateTimeValueAtIndex = (value, index) => {
    setTimeValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "time");
  };
  //---------------------------------------------------------------------------------------------------------------------------------------

  const updateFirstDateValuesAtIndex = (value, index) => {
    setFirstDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromdate");
  };

  const updateFirstTimeValuesAtIndex = (value, index) => {
    setFirstTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromtime");
  };

  const updateSecondDateValuesAtIndex = (value, index) => {
    setSecondDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "todate");
  };

  const updateSecondTimeValuesAtIndex = (value, index) => {
    setSecondTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "totime");
  };

  //------------------------------------------------------------------------------------------------------------

  const handleDataChange = (e, index, from, sub) => {
    let removeid = selectedRowsList?.filter(
      (data) => data !== groupDetails[index]._id
    );

    setSelectedRowsList(removeid);
    setSelectAllCheckedList(false);
    let getData;
    let finalData;
    let updatedTodos;
    switch (from) {
      case "Text Box":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-number":
        getData = groupDetails[index];
        const numericOnly = e.target.value.replace(/[^0-9.;\s]/g, "");
        finalData = {
          ...getData,
          data: numericOnly,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-alpha":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-alphanumeric":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Attachments":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          files: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Pre-Value":
        break;
      case "Date":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Time":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "DateTime":
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }

        break;
      case "Date Multi Span":
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${dateValueMultiTo[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueMultiFrom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Date Multi Span Time":
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "fromtime") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "todate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Date Multi Random":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Date Multi Random Time":
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValueRandom[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueRandom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Radio":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
    }
  };

  let completedbyName = isUserRoleAccess.companyname;

  const updateIndividualData = async (index) => {
    setDeleteBtnDisable(false);
    let searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid == postID &&
        item.module == "Human Resources" &&
        item.submodule == "Recruitment" &&
        item.mainpage == "Job Openings"
    );

    let combinedGroups = groupDetails?.map((data) => {
      let check =
        (data.data !== undefined && data.data !== "") ||
        data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: "",
          completedat: "",
        };
      }
    });

    try {
      let objectID = combinedGroups[index]?._id;
      let objectData = combinedGroups[index];
      if (searchItem) {
        let assignbranches = await axios.put(
          `${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            data: String(objectData?.data),
            lastcheck: objectData?.lastcheck,
            newFiles: objectData?.files !== undefined ? objectData?.files : "",
            completedby: objectData?.completedby,
            completedat: objectData?.completedat,
          }
        );
        await fecthDBDatas(getDetails);
      } else {
        let assignbranches = await axios.post(`${SERVICE.MYCHECKLIST_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          commonid: postID,
          module: thisPageDatas[0]?.modulename,
          submodule: thisPageDatas[0]?.submodule,
          mainpage: thisPageDatas[0]?.mainpage,
          subpage: thisPageDatas[0]?.subpage,
          subsubpage: thisPageDatas[0]?.subsubpage,
          category: thisPageDatas[0]?.category,
          subcategory: thisPageDatas[0]?.subcategory,
          candidatename: assignDetails?.fullname,
          status: "progress",
          groups: [...combinedGroups],
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        await fecthDBDatas(getDetails);
      }

      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Updated Successfully
          </p>
        </>
      );
      handleClickOpenerr();
      await fetchUnassignedCandidates();
    } catch (err) {
      console.log(err);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  async function fecthDBDatas(details) {
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let foundData = res?.data?.mychecklist.find(
        (item) => item.commonid == postID && item.mainpage == "Job Openings"
      );
      setGroupDetails(foundData.groups);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  }

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeleteEdit = (index) => {
    let getData = groupDetails[index];
    delete getData.files;
    let finalData = getData;

    let updatedTodos = [...groupDetails];
    updatedTodos[index] = finalData;
    setGroupDetails(updatedTodos);
  };

  const renderFilePreviewEditNew = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeleteEditNew = (index) => {
    const updatedDocuments = [...candidateUploadedDocuments]; // Create a copy of the documents array
    updatedDocuments[index] = {
      ...updatedDocuments[index], // Copy existing properties
      data: "", // Clear data
      preview: "", // Clear preview
      remark: "", // Clear remark
      name: "", // Clear name
    };
    setCandidatesUploadedDocuments(updatedDocuments);
  };

  let name = "create";

  const handleChangeImage = (event, index) => {
    const resume = event.target.files;

    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      handleDataChange(
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "resume file",
        },
        index,
        "Attachments"
      );
      // setUpload((prevFiles) => [
      //     ...prevFiles,
      //     {
      //         name: file.name,
      //         preview: reader.result,
      //         data: reader.result.split(",")[1],
      //         remark: "resume file",
      //     },
      // ]);
    };
  };

  const [candidateUploadedDocuments, setCandidatesUploadedDocuments] = useState(
    []
  );

  const handleChangeImageNew = (event, index, data) => {
    const resume = event.target.files;

    if (!resume.length) return; // Handle case where no file is selected

    const file = resume[0];
    const reader = new FileReader();
    let extension = file.name.split(".").pop();

    reader.onload = () => {
      const newDocument = {
        data: reader.result.split(",")[1],
        name: `${candidateDocuments?.fullname}_${data.shortname}.${extension}`,
        remark: "resume file",
        preview: reader.result,
        candidatefilename: data.candidatefilename,
        uniqueid: data.uniqueid,
        link: data.link,
        linkname: data.linkname,
        csfilname: data.csfilname,
        uploadedby: data.uploadedby,
        shortname: data.shortname,
      };

      // Create a new array with the updated document
      setCandidatesUploadedDocuments((prevDocuments) => {
        const updatedDocuments = [...prevDocuments];
        updatedDocuments[index] = newDocument;
        return updatedDocuments;
      });
    };

    reader.readAsDataURL(file);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row";
    } else if (params.row.roleback) {
      return "roleback-row";
    }
    return "";
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: " bold !important ",
    },
    "& .custom-id-row": {
      backgroundColor: "#1976d22b !important",
    },
    "& .roleback-row": {
      backgroundColor: "#f5c6cb !important",
      position: "relative", // Ensure the row is a positioning context
      opacity: 0.5, // Make the row appear more disabled
      // pointer-events: "none", // Prevent interaction with the row
    },
    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
    "&:hover": {
      "& .custom-ago-row:hover": {
        backgroundColor: "#ff00004a !important",
      },
      "& .custom-in-row:hover": {
        backgroundColor: "#ffff0061 !important",
      },
      "& .custom-others-row:hover": {
        backgroundColor: "#0080005e !important",
      },
    },
  }));

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    status: true,
    scheduleinterview: true,
    fullname: true,

    username: true,
    password: true,
    interviewer: true,
    appliedat: true,
    scheduledat: true,
    reportingdatetime: true,
    deadlinedatetime: true,
    duration: true,
    roundmode: true,
    testname: true,
    roundtype: true,
    roundcategory: true,
    roundsubcategory: true,
    retestcount: true,
    attempts: true,
    roundlink: true,
    roundstatus: true,
    roundanswerstatus: true,
    responses: true,
    moveback: true,
    roleback: true,
    starttest: true,
    candidatestarttest: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  //role back dialog
  const [openRoleBackDialog, setOpenRoleBackDialog] = useState(false);
  const handleOpenRoleBack = () => {
    setOpenRoleBackDialog(true);
  };
  const handleCloseRoleBack = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenRoleBackDialog(false);

    setSngleCandidateRoleBackDataChoose({
      company: "Please Select Company",
      branch: "Please Select Branch",
      designation: "Please Select Designation",
      jobrole: "Please Select Job Role",
      jobroleid: "",
    });
  };

  const [designation, setDesignation] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [formerUsers, setFormerUsers] = useState([]);

  const fetchFormerUsers = async () => {
    try {
      let response = await axios.get(SERVICE.FORMERUSERS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setFormerUsers(
        response?.data?.formerusers?.map((data) => data?.companyname)
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const fetchDesignationDropdown = async () => {
    try {
      let res_designation = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let designationArr = res_designation.data.designation.map(
        (designation) => ({
          label: designation.name,
          value: designation.name,
        })
      );

      setDesignation(designationArr);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const fetchJobRoleDropdown = async () => {
    try {
      let res_jobopenings = await axios.get(SERVICE.ALLJOBOPENINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let jobopeningsArr = res_jobopenings.data.jobopenings.filter(
        (opening) => {
          return (
            opening.status === "OnProgress"
            //  &&
            // opening.company === openings.company &&
            // opening.branch === openings.branch &&
            // options.value === opening.designation
          );
        }
      );

      let jobRoleArr = jobopeningsArr.map((job) => ({
        ...job,
        label: job.recruitmentname,
        value: job.recruitmentname,
        jobid: job._id,
      }));

      setJobRole(jobRoleArr);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const [singleCandidateRoleBackData, setSngleCandidateRoleBackData] = useState(
    {}
  );
  const [
    singleCandidateRoleBackDataChoose,
    setSngleCandidateRoleBackDataChoose,
  ] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    designation: "Please Select Designation",
    jobrole: "Please Select Job Role",
    jobroleid: "",
  });

  const singleCandidateRoleBack = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSngleCandidateRoleBackData(res?.data?.scandidates);

      handleOpenRoleBack();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const updateObject = async (oldObject) => {
    const newObject = { ...oldObject };

    newObject.jobopeningsid = singleCandidateRoleBackDataChoose?.jobroleid;
    newObject.role = singleCandidateRoleBackDataChoose?.jobrole;
    newObject.username = "";
    newObject.password = "";
    newObject.interviewrounds = [];
    newObject.candidatestatus = "";
    newObject.screencandidate = "";
    newObject.overallstatus = "Applied";

    delete newObject._id;
    return newObject;
  };

  const createNewCandidate = async (e) => {
    try {
      e.preventDefault();
      if (
        singleCandidateRoleBackDataChoose.company === "Please Select Company"
      ) {
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
      } else if (
        singleCandidateRoleBackDataChoose.branch === "Please Select Branch"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Branch"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        singleCandidateRoleBackDataChoose.designation ===
        "Please Select Designation"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Designation"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        singleCandidateRoleBackDataChoose.jobrole === "Please Select Job Role"
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Job Role"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        let updatedData = await axios.put(
          `${SERVICE.CANDIDATES_SINGLE}/${singleCandidateRoleBackData?._id}`,
          {
            roleback: true,
            rolebackto: singleCandidateRoleBackDataChoose?.jobrole,
            rolebacktoid: singleCandidateRoleBackDataChoose?.jobroleid,
            rolebacktocompany: singleCandidateRoleBackDataChoose?.company,
            rolebacktobranch: singleCandidateRoleBackDataChoose?.branch,
          }
        );

        let createCandidateDatas = await updateObject(
          singleCandidateRoleBackData
        );

        let res_queue = await axios.post(SERVICE.CANDIDATES_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ...createCandidateDatas,
        });

        handleCloseRoleBack();

        await getScreenedCandidate(tableName);

        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Updated Successfully
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  // Edit model

  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    setIsCheckedListOverall(false);
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setTestMark({
      testname: "",
      totalmarks: "",
      eligiblemarks: "",
      obtainedmarks: "",
      roundid: "",
    });

    setDatas({
      category: "",
      type: "",
      salarystatus: "",
    });
    setDateValueMultiFrom([]);
    setDateValueMultiTo([]);
    setDateValueRandom([]);
    setTimeValueRandom([]);
    setDateValue([]);
    setTimeValue([]);
    setFirstDateValue([]);
    setFirstTimeValue([]);
    setSecondDateValue([]);
    setSecondTimeValue([]);
    setGroupDetails([]);
    setSelectedRowsList([]);
    setSelectAllCheckedList(false);
  };
  // salary fix model
  const [isSalaryFixOpen, setIsSalaryFixOpen] = useState(false);
  const handleClickOpenSalaryFix = () => {
    setIsSalaryFixOpen(true);
  };
  const handleCloseSalaryFix = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsSalaryFixOpen(false);
  };

  const [rounds, setRounds] = useState([]);
  console.log(rounds, "rounds");
  const [roundsArray, setRoundsArray] = useState([]);
  const [roundsDetails, setRoundDetails] = useState([]);
  const [tableName, setTableName] = useState();
  const fetchInterviewRoundOrders = async (rolename, allroundcandiidates) => {
    try {
      let res_vendor = await axios.post(
        SERVICE.INTERVIEWQUESTIONGROUPING_FILTER,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          designation: rolename,
        }
      );
      setRoundDetails(res_vendor?.data?.interviewgroupingquestionfilter);
      let res = await axios.get(SERVICE.INTERVIEWROUNDORDER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let interviewroundorder = res?.data?.interviewroundorders
        ?.filter((item) => item?.designation === rolename)
        ?.flatMap((item) => item?.round?.map((data) => data));

      // Create a Set to store unique values
      const uniqueRounds = new Set(interviewroundorder);

      // Convert the Set back to an array
      const uniqueRoundsArray = [...uniqueRounds];

      let firstRound =
        uniqueRoundsArray?.length > 0 ? uniqueRoundsArray[0] : "";

      setRoundsArray(uniqueRoundsArray);

      let roundCandidatesCount = uniqueRoundsArray?.map((round) => {
        let candidateCount = allroundcandiidates?.reduce((count, candidate) => {
          let roundStatus = candidate.interviewrounds.find(
            (r) =>
              r.roundname === round &&
              r.nextround === false &&
              (r?.rounduserstatus == undefined || r?.rounduserstatus == "")
          )?.roundstatus;
          if (
            roundStatus === "Interview Scheduled" ||
            roundStatus === "On Progress" ||
            roundStatus === "Hr Completed" ||
            roundStatus === "Candidate Completed" ||
            roundStatus === "Completed"
          ) {
            count++;
          }
          return count;
        }, 0);

        return { roundname: round, candidatecount: candidateCount.toString() };
      });

      let candidatesWithStatus = allroundcandiidates?.filter((candidate) => {
        let roundStatus = candidate?.interviewrounds?.find(
          (r) =>
            r.roundname === firstRound &&
            r.nextround === false &&
            (r?.rounduserstatus == undefined || r?.rounduserstatus == "")
        )?.roundstatus;
        return (
          roundStatus === "Interview Scheduled" ||
          roundStatus === "On Progress" ||
          roundStatus === "Hr Completed" ||
          roundStatus === "Candidate Completed" ||
          roundStatus === "Completed"
        );
      });

      setTableName(firstRound);

      // Creating the new array
      let newArray = roundCandidatesCount.map(
        ({ roundname, candidatecount }) => {
          // Find the corresponding round detail
          let roundDetail =
            res_vendor?.data?.interviewgroupingquestionfilter?.find(
              (detail) => detail.round === roundname
            );

          if (roundDetail) {
            return {
              roundname,
              candidatecount,
              category: roundDetail.category,
              subcategory: roundDetail.subcategory,
              duration: roundDetail.duration,
              mode: roundDetail.mode,
              type: roundDetail.type,
              exist: true,
            };
          } else {
            return {
              roundname,
              candidatecount,
              category: "N/A",
              subcategory: "N/A",
              duration: "N/A",
              mode: "N/A",
              type: "N/A",
              exist: false,
            };
          }
        }
      );

      setRounds(newArray);

      setCandidates(candidatesWithStatus);
      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  //-------------------------------------------------------------------------------------

  const [thisPageDatas, setThisPageDatas] = useState([]);

  const fetchUnassignedCandidates = async () => {
    try {
      let res = await axios.post(
        `${SERVICE.MYCHECKLISTVIEW}`,
        {
          companyname: isUserRoleAccess?.companyname,
          role: isUserRoleAccess?.role,
          modulename: "Human Resources",
          submodule: "Recruitment",
          mainpage: "Job Openings",
          subpage: "",
          subsubpage: "",
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setThisPageDatas(res?.data?.toViewDatas);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [moveToShowid, setMoveToShowid] = useState([]);
  const moveToButtonShow = async (idsArray) => {
    try {
      let res_vendor = await axios.get(SERVICE.MYCHECKLIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let allCommonId = res_vendor?.data?.mychecklist?.map(
        (data) => data?.commonid
      );
      let filteredCandidates = idsArray?.filter((data) =>
        allCommonId?.includes(data)
      );
      setMoveToShowid(filteredCandidates);
      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleCheckListSubmit = async (e) => {
    setLoading(true);
    if (groupDetails) {
      let nextStep = isCheckedList.every((item) => item == true);

      if (datas.category === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Please Select Status
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (datas.category === "On Boarding" && datas.type === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Please Select To Migrate As
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (
        datas.category === "On Boarding" &&
        datas.type === "Employee" &&
        !salaryFixed
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Please Fix Salary
            </p>
          </>
        );
        handleClickOpenerr();
      }
      //  else if (
      //   datas.category === "On Boarding" &&
      //   datas.type === "Intern" &&
      //   datas.salarystatus === "With Salary" &&
      //   !salaryFixed
      // ) {
      //   setShowAlert(
      //     <>
      //       <ErrorOutlineOutlinedIcon
      //         sx={{ fontSize: "100px", color: "orange" }}
      //       />
      //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
      //         Please Fix Salary
      //       </p>
      //     </>
      //   );
      //   handleClickOpenerr();
      // }
      else if (
        candidateUploadedDocuments?.length > 0 &&
        candidateUploadedDocuments?.some((item) => item?.data === "")
      ) {
        setLoading(false);
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Upload All the Missing Documents!"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (!nextStep) {
        setLoading(false);
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Check All the Fields!"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        handleSubmit(e);
      }
    } else {
      setLoading(false);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Add Check List"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  // submit option for saving....
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleMoveChange();
  };
  const sendRequest = async () => {
    let combinedGroups = groupDetails?.map((data) => {
      let check =
        (data.data !== undefined && data.data !== "") ||
        data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: "",
          completedat: "",
        };
      }
    });

    const searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid === postID &&
        item.module === "Human Resources" &&
        item.submodule === "Recruitment" &&
        item.mainpage === "Job Openings"
    );

    const headers = {
      Authorization: `Bearer ${auth.APIToken}`,
    };
    try {
      const createOrUpdateChecklist = async () => {
        const url = searchItem
          ? `${SERVICE.MYCHECKLIST_SINGLE}/${searchItem._id}`
          : SERVICE.MYCHECKLIST_CREATE;
        const method = searchItem ? "put" : "post";

        const data = searchItem
          ? {
              commonid: assignDetails?.commonid,
              module: assignDetails?.module,
              submodule: assignDetails?.submodule,
              mainpage: assignDetails?.mainpage,
              subpage: assignDetails?.subpage,
              subsubpage: assignDetails?.subsubpage,
              category: assignDetails?.category,
              subcategory: assignDetails?.subcategory,
              candidatename: assignDetails?.fullname,
              status: "completed",
              groups: [...combinedGroups],
              updatedby: [
                ...searchItem?.updatedby,
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            }
          : {
              commonid: postID,
              module: thisPageDatas[0]?.modulename,
              submodule: thisPageDatas[0]?.submodule,
              mainpage: thisPageDatas[0]?.mainpage,
              subpage: thisPageDatas[0]?.subpage,
              subsubpage: thisPageDatas[0]?.subsubpage,
              category: thisPageDatas[0]?.category,
              subcategory: thisPageDatas[0]?.subcategory,
              candidatename: assignDetails?.fullname,
              status: "completed",
              groups: [...combinedGroups],
              addedby: [
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            };

        await axios[method](url, data, { headers });
      };
      await createOrUpdateChecklist();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "Green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      await fetchUnassignedCandidates();
      handleClickOpenerr();
      handleCloseModEdit();
      setIsCheckedListOverall(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const fetchUniqueRounds = async (clickedround) => {
    setBankdetail(false);
    try {
      let response = await axios.post(`${SERVICE.ACTIVECANDIDATES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        jobopeningsid: ids,
      });
      let allroundcandiidates = response?.data?.allcandidate?.filter(
        (item) =>
          item?.interviewrounds?.length > 0 &&
          item?.screencandidate === "Screened"
      );

      let candidatesWithStatus = allroundcandiidates
        ?.filter((candidate) => {
          let roundStatus = candidate?.interviewrounds?.find(
            (r) =>
              r.roundname === clickedround &&
              r.nextround === false &&
              (r?.rounduserstatus == undefined || r?.rounduserstatus == "")
          )?.roundstatus;
          return (
            roundStatus === "Interview Scheduled" ||
            roundStatus === "On Progress" ||
            roundStatus === "Hr Completed" ||
            roundStatus === "Candidate Completed" ||
            roundStatus === "Completed"
          );
        })
        .filter((item1) => {
          return (
            !item1.finalstatus ||
            (item1.finalstatus &&
              item1.finalstatus != "Rejected" &&
              item1.finalstatus != "Added")
          );
        });
      setCandidates(candidatesWithStatus);
      console.log("Here unwantend rerender happens");

      await moveToButtonShow(candidatesWithStatus?.map((data) => data?._id));
      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const getScreenedCandidate = async (clickedround) => {
    setBankdetail(false);
    try {
      let response = await axios.post(`${SERVICE.ACTIVECANDIDATES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        jobopeningsid: ids,
      });
      let allroundcandiidates = response?.data?.allcandidate
        ?.filter(
          (item) =>
            item?.interviewrounds?.length > 0 &&
            item?.screencandidate === "Screened"
        )
        .filter((itemnew) => {
          return (
            !itemnew.finalstatus ||
            (itemnew.finalstatus &&
              itemnew.finalstatus != "Rejected" &&
              itemnew.finalstatus != "Added")
          );
        });

      let roundCandidatesCount = roundsArray?.map((round) => {
        let candidateCount = allroundcandiidates?.reduce((count, candidate) => {
          let roundStatus = candidate.interviewrounds.find(
            (r) =>
              r.roundname === round &&
              r.nextround === false &&
              (r?.rounduserstatus == undefined || r?.rounduserstatus == "")
          )?.roundstatus;
          if (
            roundStatus === "Interview Scheduled" ||
            roundStatus === "On Progress" ||
            roundStatus === "Hr Completed" ||
            roundStatus === "Candidate Completed" ||
            roundStatus === "Completed"
          ) {
            count++;
          }
          return count;
        }, 0);

        return { roundname: round, candidatecount: candidateCount.toString() };
      });

      // Creating the new array
      let newArray = roundCandidatesCount.map(
        ({ roundname, candidatecount }) => {
          // Find the corresponding round detail
          let roundDetail = roundsDetails?.find(
            (detail) => detail.round === roundname
          );

          if (roundDetail) {
            return {
              roundname,
              candidatecount,
              category: roundDetail.category,
              subcategory: roundDetail.subcategory,
              duration: roundDetail.duration,
              mode: roundDetail.mode,
              type: roundDetail.type,
              exist: true,
            };
          } else {
            return {
              roundname,
              candidatecount,
              category: "N/A",
              subcategory: "N/A",
              duration: "N/A",
              mode: "N/A",
              type: "N/A",
              exist: false,
            };
          }
        }
      );

      setRounds(newArray);

      let candidatesWithStatus = allroundcandiidates?.filter((candidate) => {
        let roundStatus = candidate?.interviewrounds?.find(
          (r) =>
            r.roundname === clickedround &&
            r.nextround === false &&
            (r?.rounduserstatus == undefined || r?.rounduserstatus == "")
        )?.roundstatus;
        return (
          roundStatus === "Interview Scheduled" ||
          roundStatus === "On Progress" ||
          roundStatus === "Hr Completed" ||
          roundStatus === "Candidate Completed" ||
          roundStatus === "Completed"
        );
      });
      setCandidates(candidatesWithStatus);

      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const getJobRoleDatas = async () => {
    try {
      let res = await axios.get(`${SERVICE.JOBOPENING_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSingleJobData(res?.data?.sjobopening);
      let response = await axios.post(`${SERVICE.ACTIVECANDIDATES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        jobopeningsid: ids,
      });
      let allroundcandiidates = response?.data?.allcandidate
        ?.filter(
          (item) =>
            item?.interviewrounds?.length > 0 &&
            item?.screencandidate === "Screened"
        )
        .filter((itemnew) => {
          return (
            !itemnew.finalstatus ||
            (itemnew.finalstatus &&
              itemnew.finalstatus != "Rejected" &&
              itemnew.finalstatus != "Added")
          );
        });
      setRoleName(res?.data?.sjobopening?.recruitmentname);
      await fetchInterviewRoundOrders(
        res?.data?.sjobopening?.designation,
        allroundcandiidates
      );
      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const [mainId, setMainId] = useState("");
  const [subId, setSubId] = useState("");
  const [roundMode, setRoundMode] = useState("");
  const viewResponses = async (id, subid, roundmode, loglength) => {
    setIsLoading(true);
    setRoundMode(roundmode);
    try {
      let res = await axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res1 = await axios.get(SERVICE.INTERVIEWQUESTION);

      let singleRound = res?.data?.scandidates?.interviewrounds?.find(
        (item) => item._id === subid
      );

      let cat = singleRound?.roundcategory;
      let subcat = singleRound?.roundsubcategory;

      let intQues = res1?.data?.interviewquestions?.filter(
        (data) => data.category === cat && data.subcategory === subcat
      );

      let mainSame;
      if (singleRound?.manualEntry?.length > 0) {
        mainSame = singleRound.manualEntry.map((data) => {
          let foundData = intQues?.find((item) => item?.name == data?.question);
          if (foundData) {
            let subsame = data?.secondarytodo?.map((data1) => {
              let foundSubsame = foundData?.subquestions?.find(
                (item1) => item1?.question == data1?.question
              );
              if (foundSubsame) {
                return {
                  ...data1,
                  uploadedimage: foundSubsame?.uploadedimage || "",
                  uploadedimagename: foundSubsame?.uploadedimagename || "",
                  data: foundSubsame?.files[0]?.data || "",
                };
              } else {
                return {
                  ...data1,
                  uploadedimage: "",
                  uploadedimagename: "",
                  data: "",
                };
              }
            });
            return {
              ...data,
              uploadedimage: foundData?.uploadedimage || "",
              uploadedimagename: foundData?.uploadedimagename || "",
              data: foundData?.files[0]?.data || "",
              secondarytodo: subsame,
            };
          } else {
            return {
              ...data,
              uploadedimage: "",
              uploadedimagename: "",
              data: "",
              secondarytodo: (data?.secondarytodo || []).map((subsame) => ({
                ...subsame,
                uploadedimage: "",
                uploadedimagename: "",
                data: "",
              })),
            };
          }
        });
      } else {
        mainSame = singleRound?.interviewForm?.map((data) => {
          let foundData = intQues?.find((item) => item?.name == data?.question);
          if (foundData) {
            let subsame = data?.secondarytodo?.map((data1) => {
              let foundSubsame = foundData?.subquestions?.find(
                (item1) => item1?.question == data1?.question
              );
              if (foundSubsame) {
                return {
                  ...data1,
                  uploadedimage: foundSubsame?.uploadedimage || "",
                  uploadedimagename: foundSubsame?.uploadedimagename || "",
                  data: foundSubsame?.files[0]?.data || "",
                };
              } else {
                return {
                  ...data1,
                  uploadedimage: "",
                  uploadedimagename: "",
                  data: "",
                };
              }
            });
            return {
              ...data,
              uploadedimage: foundData?.uploadedimage || "",
              uploadedimagename: foundData?.uploadedimagename || "",
              data: foundData?.files[0]?.data || "",
              secondarytodo: subsame,
            };
          } else {
            return {
              ...data,
              uploadedimage: "",
              uploadedimagename: "",
              data: "",
              secondarytodo: (data?.secondarytodo || []).map((subsame) => ({
                ...subsame,
                uploadedimage: "",
                uploadedimagename: "",
                data: "",
              })),
            };
          }
        });
      }
      let mergedData = {
        ...res?.data?.scandidates,
        interviewForm: mainSame,
        totalmarks: singleRound?.totalmarks,
        eligiblemarks: singleRound?.eligiblemarks,
        markcomparison: singleRound?.markcomparison,
        mode: singleRound?.mode,
        loglength,
      };

      if (roundmode === "Online or Interview Test") {
        setTestMark({
          testname: singleRound?.testname,
          totalmarks: singleRound?.totalmarks,
          eligiblemarks: singleRound?.eligiblemarks,
          obtainedmarks: singleRound?.userobtainedmarks,
          roundid: subid,
        });
      }

      let teststatus =
        singleRound?.roundanswerstatus === ""
          ? "Please Select Test Status"
          : singleRound?.roundanswerstatus;

      setTestStatus(teststatus);
      setChecked(
        singleRound?.rescheduleafterreject
          ? singleRound?.rescheduleafterreject
          : false
      );
      setRoundmasterEdit(mergedData);
      setSubId(subid);
      setMainId(id);
      setIsLoading(false);
      setDateTime({
        reportingdate: moment().format("YYYY-MM-DD"),
        reportingtime: moment().format("HH:mm"),
        deadlinedate: moment().format("YYYY-MM-DD"),
        deadlinetime: "23:59",
      });
      if (roundmode === "Typing Test") {
        handleClickOpenviewTypingtest();
      } else {
        handleClickOpenview();
      }
      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const [interviewFormLogEdit, setInterviewFormLogEdit] = useState([]);
  const editResponses = async (id, subid, roundmode, loglength) => {
    setIsLoading(true);
    setRoundMode(roundmode);
    try {
      const [res, res1] = await Promise.all([
        axios.get(`${SERVICE.CANDIDATES_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.INTERVIEWQUESTION),
      ]);

      let singleRound = res?.data?.scandidates?.interviewrounds?.find(
        (item) => item._id === subid
      );

      let cat = singleRound?.roundcategory;
      let subcat = singleRound?.roundsubcategory;

      setInterviewFormLogEdit(singleRound?.interviewFormLog);

      let intQues = res1?.data?.interviewquestions?.filter(
        (data) => data.category === cat && data.subcategory === subcat
      );

      let mainSame;
      if (singleRound?.manualEntry?.length > 0) {
        mainSame = singleRound.manualEntry.map((data) => {
          let foundData = intQues?.find((item) => item?.name == data?.question);
          if (foundData) {
            let subsame = data?.secondarytodo?.map((data1) => {
              let foundSubsame = foundData?.subquestions?.find(
                (item1) => item1?.question == data1?.question
              );
              if (foundSubsame) {
                return {
                  ...data1,
                  uploadedimage: foundSubsame?.uploadedimage || "",
                  uploadedimagename: foundSubsame?.uploadedimagename || "",
                  data: foundSubsame?.files[0]?.data || "",
                };
              } else {
                return {
                  ...data1,
                  uploadedimage: "",
                  uploadedimagename: "",
                  data: "",
                };
              }
            });
            return {
              ...data,
              uploadedimage: foundData?.uploadedimage || "",
              uploadedimagename: foundData?.uploadedimagename || "",
              data: foundData?.files[0]?.data || "",
              secondarytodo: subsame,
            };
          } else {
            return {
              ...data,
              uploadedimage: "",
              uploadedimagename: "",
              data: "",
              secondarytodo: (data?.secondarytodo || []).map((subsame) => ({
                ...subsame,
                uploadedimage: "",
                uploadedimagename: "",
                data: "",
              })),
            };
          }
        });
      } else {
        mainSame = singleRound?.interviewForm?.map((data) => {
          let foundData = intQues?.find((item) => item?.name == data?.question);
          if (foundData) {
            let subsame = data?.secondarytodo?.map((data1) => {
              let foundSubsame = foundData?.subquestions?.find(
                (item1) => item1?.question == data1?.question
              );
              if (foundSubsame) {
                return {
                  ...data1,
                  uploadedimage: foundSubsame?.uploadedimage || "",
                  uploadedimagename: foundSubsame?.uploadedimagename || "",
                  data: foundSubsame?.files[0]?.data || "",
                };
              } else {
                return {
                  ...data1,
                  uploadedimage: "",
                  uploadedimagename: "",
                  data: "",
                };
              }
            });
            return {
              ...data,
              uploadedimage: foundData?.uploadedimage || "",
              uploadedimagename: foundData?.uploadedimagename || "",
              data: foundData?.files[0]?.data || "",
              secondarytodo: subsame,
            };
          } else {
            return {
              ...data,
              uploadedimage: "",
              uploadedimagename: "",
              data: "",
              secondarytodo: (data?.secondarytodo || []).map((subsame) => ({
                ...subsame,
                uploadedimage: "",
                uploadedimagename: "",
                data: "",
              })),
            };
          }
        });
      }
      let mergedData = {
        ...res?.data?.scandidates,
        interviewForm: mainSame,
        loglength,
      };

      let teststatus =
        singleRound?.roundanswerstatus === ""
          ? "Please Select Test Status"
          : singleRound?.roundanswerstatus;
      setTestStatus(teststatus);
      setChecked(
        singleRound?.rescheduleafterreject
          ? singleRound?.rescheduleafterreject
          : false
      );
      setRoundmasterEdit(mergedData);
      setSubId(subid);
      setMainId(id);
      setIsLoading(false);
      setDateTime({
        reportingdate: moment().format("YYYY-MM-DD"),
        reportingtime: moment().format("HH:mm"),
        deadlinedate: moment().format("YYYY-MM-DD"),
        deadlinetime: "23:59",
      });
      handleClickOpenviewTypingtestEdit();
      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const [deleteRoundId, setDeleteRoundId] = useState("");
  const [deleteRoundIdBy, setDeleteRoundIdBy] = useState("");
  const [startTestRoundId, setStartTestRoundId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [candidateIdReset, setCandidateIdReset] = useState("");
  const [startTestRoundLink, setStartTestRoundLink] = useState("");
  const [startTestFullName, setStartTestFullName] = useState("");
  const [startTestUserName, setStartTestUserName] = useState("");
  const [startTestUserPassword, setStartTestUserPassword] = useState("");

  const [buttonName, setButtonName] = useState("");
  const deleteInterviewRound = async (id, candiId) => {
    try {
      let res = await axios.delete(`${SERVICE.DELETE_INTERVIEWROUND}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let response = await axios.post(`${SERVICE.ACTIVECANDIDATES}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        jobopeningsid: ids,
      });
      let allroundcandiidates = response?.data?.allcandidate
        ?.filter(
          (item) =>
            item?.interviewrounds?.length > 0 &&
            item?.screencandidate === "Screened"
        )
        .filter((itemnew) => {
          return (
            !itemnew.finalstatus ||
            (itemnew.finalstatus &&
              itemnew.finalstatus != "Rejected" &&
              itemnew.finalstatus != "Added")
          );
        });

      let roundCandidatesCount = roundsArray?.map((round) => {
        let candidateCount = allroundcandiidates?.reduce((count, candidate) => {
          let roundStatus = candidate.interviewrounds.find(
            (r) =>
              r.roundname === round &&
              r.nextround === false &&
              (r?.rounduserstatus == undefined || r?.rounduserstatus == "")
          )?.roundstatus;
          if (
            roundStatus === "Interview Scheduled" ||
            roundStatus === "On Progress" ||
            roundStatus === "Hr Completed" ||
            roundStatus === "Candidate Completed" ||
            roundStatus === "Completed"
          ) {
            count++;
          }
          return count;
        }, 0);

        return { roundname: round, candidatecount: candidateCount.toString() };
      });

      // Creating the new array
      let newArray = roundCandidatesCount.map(
        ({ roundname, candidatecount }) => {
          // Find the corresponding round detail
          let roundDetail = roundsDetails?.find(
            (detail) => detail.round === roundname
          );

          if (roundDetail) {
            return {
              roundname,
              candidatecount,
              category: roundDetail.category,
              subcategory: roundDetail.subcategory,
              duration: roundDetail.duration,
              mode: roundDetail.mode,
              type: roundDetail.type,
              exist: true,
            };
          } else {
            return {
              roundname,
              candidatecount,
              category: "N/A",
              subcategory: "N/A",
              duration: "N/A",
              mode: "N/A",
              type: "N/A",
              exist: false,
            };
          }
        }
      );

      setRounds(newArray);

      handleCloseModcheckbox();

      await fetchUniqueRounds(tableName);
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Removed Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      setBankdetail(true);
    } catch (err) {
      setBankdetail(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const startInterviewRoundByHr = async (
    roundlink,
    userName,
    password,
    roundid,
    candidateid
  ) => {
    const linkParts = roundlink?.split("/");
    const id = linkParts[linkParts?.length - 1];
    try {
      const res = await axios.post(SERVICE.INTERVIEW_LOGIN, {
        username: String(userName),
        password: String(password),
        linkid: String(roundid),
        by: "HR",
      });

      if (res?.data?.loginstatus === true) {
        await testStatusUpdate(res?.data?.candidateroundid, "On Progress");
        handleCloseModcheckboxStartTest();
        // ${BASE_URL}
        const url = `${BASE_URL}/hr/autologin/${userName}/${password}/${roundid}/${id}/${candidateid}`;

        window.open(url, "_blank");
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleCloseModcheckboxStartTest();
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleCloseModcheckboxStartTest();
        handleClickOpenerr();
      }
    }
  };
  const startInterviewRoundByCandidate = async (roundlink) => {
    try {
      handleCloseModcheckboxStartTest();
      const url = `${roundlink}`;

      const updatedUrl = url.replace("/false/", "/true/");

      window.open(updatedUrl, "_blank");
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleCloseModcheckboxStartTest();
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleCloseModcheckboxStartTest();
        handleClickOpenerr();
      }
    }
  };
  const testStatusUpdate = async (id, status) => {
    try {
      let subprojectscreate = await axios.put(
        `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${id}`,
        {
          roundstatus: String(status),
        }
      );
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsLoading(false);
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Excel
  const fileName = `${roleName}-${tableName}`;
  // get particular columns for export excel

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${roleName}-${tableName}`,
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = async () => {
    try {
      const getFormattedDateTime = (date, time) =>
        moment(`${date} ${time}`).format("DD-MM-YYYY hh:mm A");

      const isTestExpired = (round) => {
        if (!round || round.roundstatus !== "Interview Scheduled") {
          return false;
        }

        const deadlineDateTime = new Date(
          `${round.deadlinedate}T${round.deadlinetime}`
        );
        const currentDateTime = new Date();

        return currentDateTime > deadlineDateTime;
      };

      const itemsWithSerialNumber = candidates?.map((item, index) => {
        const interviewRound = item?.interviewrounds?.find(
          (round) => round.roundname === tableName
        );

        const filteredRounds = item?.interviewrounds?.filter(
          (round) => round.roundname === tableName
        );

        const testexpired = isTestExpired(interviewRound);

        const removedFormerUsers = filteredRounds
          ?.flatMap((data) => data?.interviewer)
          ?.filter((name) => !formerUsers.includes(name))
          ?.join(", ");

        return {
          ...item,
          serialNumber: index + 1,
          interviewroundlength: item?.interviewrounds?.length,
          reportingdatetime: filteredRounds
            ?.map((data) => getFormattedDateTime(data?.date, data?.time))
            ?.join(", "),
          deadlinedatetime: filteredRounds
            ?.map((data) =>
              getFormattedDateTime(data?.deadlinedate, data?.deadlinetime)
            )
            ?.join(", "),
          // interviewer: filteredRounds
          //   ?.flatMap((data) => data?.interviewer)
          //   ?.join(", "),
          interviewer: removedFormerUsers,
          duration: filteredRounds?.map((data) => data?.duration)?.join(", "),
          retestcount: filteredRounds
            ?.map((data) => data?.retestcount)
            ?.join(", "),
          roundtype: filteredRounds?.map((data) => data?.roundtype)?.join(", "),
          roundcategory: filteredRounds
            ?.map((data) => data?.roundcategory)
            ?.join(", "),
          roundsubcategory: filteredRounds
            ?.map((data) => data?.roundsubcategory)
            ?.join(", "),
          roundmode: filteredRounds?.map((data) => data?.mode)?.join(", "),
          testname: filteredRounds?.map((data) => data?.testname)?.join(", "),
          totalmarks: filteredRounds
            ?.map((data) => data?.totalmarks)
            ?.join(", "),
          scheduledat: filteredRounds
            ?.map((data) =>
              moment(data?.roundCreatedAt).format("DD-MM-YYYY hh:mm A")
            )
            ?.join(", "),
          eligiblemarks: filteredRounds
            ?.map((data) => data?.eligiblemarks)
            ?.join(", "),
          onlinetestround: filteredRounds
            ?.map((data) => {
              const candidateId = item?._id;
              const roundId = data?._id;
              return `${BASE_URL}/interview/interviewtestround/${candidateId}/${roundId}/false/${ids}`;
            })
            ?.join(", "),
          roundlink: filteredRounds
            ?.map((data) => {
              const candidateId = item?._id;
              const roundId = data?._id;
              const testmode = data?.roundlink.split("/")[5];
              const parts = data?.roundlink.split("/");
              const orderid = testmode === "typingtest" ? ids : parts.pop();

              const testcount =
                data?.interviewFormLog?.length === 0
                  ? 0
                  : Number(data?.retestcount) >
                    Number(data?.interviewFormLog?.length - 1)
                  ? Number(data?.interviewFormLog?.length)
                  : -1;
              return `${BASE_URL}/interview/interviewformgenerate/${testmode}/${testcount}/${candidateId}/${roundId}/false/${orderid}`;
            })
            ?.join(", "),
          roundlinktext: filteredRounds
            ?.map((data) => {
              const testcount =
                data?.interviewFormLog?.length === 0
                  ? 0
                  : Number(data?.retestcount) >
                    Number(data?.interviewFormLog?.length - 1)
                  ? Number(data?.interviewFormLog?.length)
                  : -1;

              let noteligible = data?.interviewForm?.some(
                (form) => form?.typingresult === "Not Eligible"
              );

              let retestfor =
                data?.retestfor === "Both" ||
                (data?.retestfor === "Not Eligible" && noteligible) ||
                (data?.retestfor === "Eligible" && !noteligible);

              return testcount === 0
                ? "Copy"
                : testcount === -1 || !retestfor
                ? "Disable"
                : `Retest ${testcount}`;
            })
            ?.join(", "),
          roundlinktextmsg: filteredRounds
            ?.map((data) => {
              const testcount =
                data?.interviewFormLog?.length === 0
                  ? 0
                  : Number(data?.retestcount) >
                    Number(data?.interviewFormLog?.length - 1)
                  ? Number(data?.interviewFormLog?.length)
                  : -1;

              return testcount === 0
                ? "Copied Round Link"
                : testcount === -1
                ? "Disable"
                : `Copied Retest ${testcount} Link`;
            })
            ?.join(", "),
          roundstatus: filteredRounds
            ?.map((data) => data?.roundstatus)
            ?.join(", "),
          roundanswerstatus: filteredRounds
            ?.map((data) => data?.roundanswerstatus)
            ?.join(", "),
          rounduserstatus: filteredRounds
            ?.map((data) => data?.rounduserstatus)
            ?.join(", "),
          rescheduleafterreject: filteredRounds
            ?.map((data) => data?.rescheduleafterreject)
            ?.join(", "),
          roundid: filteredRounds?.map((data) => data?._id)?.join(", "),
          reponseloglength:
            Number(interviewRound?.interviewFormLog?.length) +
            Number(interviewRound?.manualEntry?.length ?? 0),
          attempts: (interviewRound?.interviewFormLog?.length || 1) - 1,
          testexpired: testexpired,
          appliedat: moment(item?.createdAt).format("DD-MM-YYYY hh:mm A"),
        };
      });

      setItems(itemsWithSerialNumber);
    } catch (err) {
      console.log(err, "addSerialnumberErr");
    } finally {
      // setBankdetail(true);
    }
  };
  useEffect(() => {
    addSerialNumber();
  }, [candidates]);
  // const addSerialNumber = async (candidates) => {
  //   try {
  //     console.log("addSerialNumber");
  //     const getFormattedDateTime = (date, time) =>
  //       moment(`${date} ${time}`).format("DD-MM-YYYY hh:mm A");

  //     const isTestExpired = (round) => {
  //       if (!round || round.roundstatus !== "Interview Scheduled") {
  //         return false;
  //       }

  //       const deadlineDateTime = new Date(
  //         `${round.deadlinedate}T${round.deadlinetime}`
  //       );
  //       const currentDateTime = new Date();

  //       return currentDateTime > deadlineDateTime;
  //     };

  //     const itemsWithSerialNumber = candidates?.map((item, index) => {
  //       const interviewRounds = item?.interviewrounds || [];
  //       const filteredRounds = interviewRounds.filter(
  //         (round) => round.roundname === tableName
  //       );
  //       const interviewRound = filteredRounds[0]; // Assuming the first match is the relevant round

  //       const testexpired = isTestExpired(interviewRound);

  //       const removedFormerUsers = filteredRounds
  //         .flatMap((round) => round.interviewer)
  //         .filter((name) => !formerUsers.includes(name))
  //         .join(", ");

  //       const formatRoundsData = (key, formatter) =>
  //         filteredRounds.map((round) => formatter(round[key])).join(", ");

  //       const formatLinks = (key, callback) =>
  //         filteredRounds.map(callback).join(", ");

  //       const testcount = (data) =>
  //         data?.interviewFormLog?.length === 0
  //           ? 0
  //           : Number(data?.retestcount) >
  //             Number(data?.interviewFormLog?.length - 1)
  //           ? Number(data?.interviewFormLog?.length)
  //           : -1;

  //       return {
  //         ...item,
  //         serialNumber: index + 1,
  //         interviewroundlength: interviewRounds.length,
  //         reportingdatetime: formatRoundsData("date", (date) =>
  //           getFormattedDateTime(date, date?.time)
  //         ),
  //         deadlinedatetime: formatRoundsData("deadlinedate", (date) =>
  //           getFormattedDateTime(date, date?.deadlinetime)
  //         ),
  //         interviewer: removedFormerUsers,
  //         duration: formatRoundsData("duration", (val) => val),
  //         retestcount: formatRoundsData("retestcount", (val) => val),
  //         roundtype: formatRoundsData("roundtype", (val) => val),
  //         roundcategory: formatRoundsData("roundcategory", (val) => val),
  //         roundsubcategory: formatRoundsData("roundsubcategory", (val) => val),
  //         roundmode: formatRoundsData("mode", (val) => val),
  //         testname: formatRoundsData("testname", (val) => val),
  //         totalmarks: formatRoundsData("totalmarks", (val) => val),
  //         scheduledat: formatRoundsData("roundCreatedAt", (date) =>
  //           moment(date).format("DD-MM-YYYY hh:mm A")
  //         ),
  //         eligiblemarks: formatRoundsData("eligiblemarks", (val) => val),
  //         onlinetestround: formatLinks("roundlink", (round) => {
  //           const candidateId = item?._id;
  //           const roundId = round?._id;
  //           return `${BASE_URL}/interview/interviewtestround/${candidateId}/${roundId}/false/${ids}`;
  //         }),
  //         roundlink: formatLinks("roundlink", (round) => {
  //           const candidateId = item?._id;
  //           const roundId = round?._id;
  //           const testmode = round?.roundlink.split("/")[5];
  //           const parts = round?.roundlink.split("/");
  //           const orderid = testmode === "typingtest" ? ids : parts.pop();

  //           const count = testcount(round);

  //           return `${BASE_URL}/interview/interviewformgenerate/${testmode}/${count}/${candidateId}/${roundId}/false/${orderid}`;
  //         }),
  //         roundlinktext: formatRoundsData("roundlink", (round) => {
  //           const count = testcount(round);

  //           const noteligible = round?.interviewForm?.some(
  //             (form) => form?.typingresult === "Not Eligible"
  //           );

  //           const retestfor =
  //             round?.retestfor === "Both" ||
  //             (round?.retestfor === "Not Eligible" && noteligible) ||
  //             (round?.retestfor === "Eligible" && !noteligible);

  //           return count === 0
  //             ? "Copy"
  //             : count === -1 || !retestfor
  //             ? "Disable"
  //             : `Retest ${count}`;
  //         }),
  //         roundlinktextmsg: formatRoundsData("roundlink", (round) => {
  //           const count = testcount(round);
  //           return count === 0
  //             ? "Copied Round Link"
  //             : count === -1
  //             ? "Disable"
  //             : `Copied Retest ${count} Link`;
  //         }),
  //         roundstatus: formatRoundsData("roundstatus", (val) => val),
  //         roundanswerstatus: formatRoundsData(
  //           "roundanswerstatus",
  //           (val) => val
  //         ),
  //         rounduserstatus: formatRoundsData("rounduserstatus", (val) => val),
  //         rescheduleafterreject: formatRoundsData(
  //           "rescheduleafterreject",
  //           (val) => val
  //         ),
  //         roundid: formatRoundsData("_id", (val) => val),
  //         reponseloglength:
  //           Number(interviewRound?.interviewFormLog?.length) +
  //           Number(interviewRound?.manualEntry?.length ?? 0),
  //         attempts: (interviewRound?.interviewFormLog?.length || 1) - 1,
  //         testexpired: testexpired,
  //         appliedat: moment(item?.createdAt).format("DD-MM-YYYY hh:mm A"),
  //       };
  //     });

  //     setItems(itemsWithSerialNumber);
  //   } catch (err) {
  //     console.log(err, "addSerialnumberErr");
  //   }
  // };

  console.log(candidates, "candidates");

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

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const [selectAllCheckedList, setSelectAllCheckedList] = useState(false);

  const CheckboxHeaderList = ({ selectAllCheckedList, onSelectAllList }) => (
    <div>
      <Checkbox checked={selectAllCheckedList} onChange={onSelectAllList} />
    </div>
  );

  const [btnSubmit, setBtnSubmit] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const [status, setStatus] = useState({});
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        rounduserstatus: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };

  const handleUpdate = async (e, rounduserstatus, candiId) => {
    setBtnSubmit(true);
    try {
      let res = await axios.put(`${SERVICE.CANDIDATES_SINGLE}/${candiId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        overallstatus: String(rounduserstatus),
      });

      let response = await axios.put(
        `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
        {
          rounduserstatus: String(rounduserstatus),
        }
      );

      await getScreenedCandidate(tableName);
      setStatus({});
      setBtnSubmit(false);
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  //round  status update

  const [btnSubmitRoundStatus, setBtnSubmitRoundStatus] = useState(false);
  const [rowIndexRoundStatus, setRowIndexRoundStatus] = useState();
  const [statusRoundStatus, setStatusRoundStatus] = useState({});
  const handleActionRoundStatus = (value, rowId, sno) => {
    // Store current scroll position
    setStatusRoundStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        roundanswerstatus: value,
        btnShow: true,
      },
    }));
    setRowIndexRoundStatus(sno);
  };

  const handleUpdateRoundStatus = async (e, roundanswerstatus) => {
    console.log(roundanswerstatus);
    setBtnSubmitRoundStatus(true);
    try {
      if (roundanswerstatus === "Rejected With Reschedule") {
        handleOpenModcheckboxReset();
        setDeleteRoundId(e);
        setIsDeleteOpencheckboxResetTable(true);
      } else {
        let response = await axios.put(
          `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
          {
            roundanswerstatus: String(
              [
                "Rejected With Reschedule",
                "Rejected Without Reschedule",
              ]?.includes(roundanswerstatus)
                ? "Rejected"
                : roundanswerstatus
            ),
            rescheduleafterreject:
              roundanswerstatus === "Rejected With Reschedule" ? true : false,
          }
        );
        await getScreenedCandidate(tableName);
        setStatusRoundStatus({});
        setBtnSubmitRoundStatus(false);
        setShowAlert(
          <>
            {" "}
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Updated Successfully👍"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleReset = async (e, roundstatus, message) => {
    setBtnSubmit(true);
    try {
      let response = await axios.put(
        `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
        {
          roundstatus: String(roundstatus),
          interviewForm: [],
          interviewFormLog: [],
        }
      );
      await getScreenedCandidate(tableName);
      handleCloseModcheckbox();
      setBtnSubmit(false);
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {`${message} Successfully👍`}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const handleResetDate = async (e, roundstatus) => {
    setBtnSubmit(true);
    try {
      if (dateTime?.reportingdate === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Select Reporting Date"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (dateTime?.reportingtime === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Select Reporting Time"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (dateTime?.deadlinedate === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Select Deadline Date"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (dateTime?.deadlinetime === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Select Deadline Time"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        let response = await axios.put(
          `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
          {
            roundstatus: String(roundstatus),
            interviewForm: [],
            interviewFormLog: [],
            date: dateTime?.reportingdate,
            time: dateTime?.reportingtime,
            deadlinedate: dateTime?.deadlinedate,
            deadlinetime: dateTime?.deadlinetime,
            roundCreatedAt: new Date(),
            rescheduleafterreject: false,
            roundanswerstatus: "",
          }
        );
        // await fetchUniqueRounds(tableName);
        await getScreenedCandidate(tableName);
        handleCloseModcheckboxReset();
        setBtnSubmit(false);
        setShowAlert(
          <>
            {" "}
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Reset Successful👍"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const handleResetDateTable = async (e) => {
    try {
      if (dateTime?.reportingdate === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Select Reporting Date"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (dateTime?.reportingtime === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Select Reporting Time"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (dateTime?.deadlinedate === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Select Deadline Date"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (dateTime?.deadlinetime === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Select Deadline Time"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        let response = await axios.put(
          `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
          {
            rescheduleafterreject: true,
            roundanswerstatus: "Rejected",
            date: dateTime?.reportingdate,
            time: dateTime?.reportingtime,
            deadlinedate: dateTime?.deadlinedate,
            deadlinetime: dateTime?.deadlinetime,
          }
        );
        // await fetchUniqueRounds(tableName);
        await getScreenedCandidate(tableName);
        handleCloseModcheckboxReset();
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const handleRetest = async (e, roundstatus) => {
    try {
      let response = await axios.put(
        `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
        {
          roundstatus: String(roundstatus),
          interviewForm: [],
          interviewFormLog: [],
          date: moment().format("YYYY-MM-DD"),
          time: moment().format("HH:mm"),
          deadlinedate: moment().format("YYYY-MM-DD"),
          deadlinetime: "23:59",
          roundCreatedAt: new Date(),
        }
      );
      await getScreenedCandidate(tableName);
      handleCloseModcheckboxReTest();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Retest Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleTestUpdate = async () => {
    try {
      if (testMark?.obtainedmarks === "") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "green" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Please Enter Obtained Marks"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        let response = await axios.put(
          `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${testMark?.roundid}`,
          {
            roundstatus: "Completed",
            userobtainedmarks: String(testMark?.obtainedmarks),
          }
        );
        handleCloseModEdit();
        await fetchUniqueRounds(tableName);
        setTestMark({
          testname: "",
          totalmarks: "",
          eligiblemarks: "",
          obtainedmarks: "",
          roundid: "",
        });
        setShowAlert(
          <>
            {" "}
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Updated Successfully👍"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleUpdateAnswerStatus = async (e) => {
    try {
      if (testStatus === "Please Select Test Status") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Test Status"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (
        testStatus === "Rejected" &&
        checked &&
        dateTime.reportingdate === ""
      ) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Reporting Date"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (
        testStatus === "Rejected" &&
        checked &&
        dateTime.reportingtime === ""
      ) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Reporting Time"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (
        testStatus === "Rejected" &&
        checked &&
        dateTime.deadlinedate === ""
      ) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Deadline Date"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (
        testStatus === "Rejected" &&
        checked &&
        dateTime.deadlinetime === ""
      ) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Deadline Time"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        let response = await axios.put(
          `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
          {
            roundanswerstatus: String(testStatus),
            rescheduleafterreject: Boolean(checked),
            interviewForm: roundmasterEdit?.interviewForm,
            date: dateTime?.reportingdate,
            time: dateTime?.reportingtime,
            deadlinedate: dateTime?.deadlinedate,
            deadlinetime: dateTime?.deadlinetime,
          }
        );
        await getScreenedCandidate(tableName);
        setStatus({});
        setShowAlert(
          <>
            {" "}
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Updated Successfully👍"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
        handleCloseview();
        handleCloseviewTypingtest();
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const handleEditTypingAnswerStatus = async (e) => {
    try {
      const updatedInterviewForm = [...roundmasterEdit?.interviewForm];
      let empty = updatedInterviewForm?.some(
        (data) =>
          data?.typingspeedans === "" ||
          data?.typingaccuracyans === "" ||
          data?.typingmistakesans === ""
      );

      if (empty) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Fill All The Fields"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (testStatus === "Please Select Test Status") {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Test Status"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (
        testStatus === "Rejected" &&
        checked &&
        dateTime.reportingdate === ""
      ) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Reporting Date"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (
        testStatus === "Rejected" &&
        checked &&
        dateTime.reportingtime === ""
      ) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Reporting Time"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (
        testStatus === "Rejected" &&
        checked &&
        dateTime.deadlinedate === ""
      ) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Deadline Date"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else if (
        testStatus === "Rejected" &&
        checked &&
        dateTime.deadlinetime === ""
      ) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Deadline Time"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        let response = await axios.put(
          `${SERVICE.UPDATE_INTERVIEWROUNDSTATUS}/${e}`,
          {
            roundanswerstatus: String(testStatus),
            rescheduleafterreject: Boolean(checked),
            manualEntry: updatedInterviewForm,
            date: dateTime?.reportingdate,
            time: dateTime?.reportingtime,
            deadlinedate: dateTime?.deadlinedate,
            deadlinetime: dateTime?.deadlinetime,
          }
        );
        await getScreenedCandidate(tableName);

        setStatus({});
        setShowAlert(
          <>
            {" "}
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Updated Successfully👍"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
        handleCloseview();
        handleCloseviewTypingtestEdit();
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  const scrollRef = useRef(null);

  const saveScrollPosition = () => {
    if (scrollRef.current) {
      localStorage.setItem("scrollPosition", scrollRef.current.scrollLeft);
    }
  };

  const restoreScrollPosition = () => {
    if (scrollRef.current) {
      const scrollPosition = localStorage.getItem("scrollPosition");
      if (scrollPosition) {
        scrollRef.current.scrollLeft = parseInt(scrollPosition, 10);
      }
    }
  };

  useEffect(() => {
    restoreScrollPosition();
  }, []);

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "fullname",
      headerName: "Applicant Name",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.fullname,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.status,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            {(params?.row?.roundanswerstatus === "" ||
              params?.row?.roundanswerstatus == undefined) && (
              <>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl size="large" fullWidth>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: "auto",
                          },
                        },
                      }}
                      style={{ minWidth: 150, width: 200, overflow: "hidden" }}
                      value={
                        status[params.row.roundid]?.rounduserstatus
                          ? status[params.row.roundid]?.rounduserstatus
                          : params.row.rounduserstatus
                      }
                      onChange={(e) => {
                        handleAction(
                          e.target.value,
                          params?.row?.roundid,
                          params.row.serialNumber
                        );
                      }}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="First No Response">
                        First No Response
                      </MenuItem>
                      <MenuItem value="Second No Response">
                        Second No Response
                      </MenuItem>
                      <MenuItem value="No Response">No Response</MenuItem>
                      <MenuItem value="Not Interested">Not Interested</MenuItem>
                      <MenuItem value="Got Other Job">Got Other Job</MenuItem>
                      <MenuItem value="Already Joined">Already Joined</MenuItem>
                      <MenuItem value="Duplicate Candidate">
                        Duplicate Candidate
                      </MenuItem>
                      <MenuItem value="Profile Not Eligible">
                        Profile Not Eligible
                      </MenuItem>
                      {/* <MenuItem value="Others">Others</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
                <br />
                <br />
                {status[params.row.roundid]?.btnShow &&
                rowIndex === params.row.serialNumber ? (
                  <>
                    {" "}
                    <LoadingButton
                      sx={{
                        ...userStyle.buttonedit,
                        marginLeft: "10px",
                      }}
                      variant="contained"
                      size="small"
                      loading={btnSubmit}
                      style={{ minWidth: "0px" }}
                      onClick={(e) =>
                        handleUpdate(
                          params?.row?.roundid,
                          status[params.row.roundid]?.rounduserstatus,
                          params?.row?.id
                        )
                      }
                    >
                      SAVE
                    </LoadingButton>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}

            {params.row.roleback && (
              <span className="roleback-message">{`This Candidate was Moved to ${
                params.row.rolebacktocompany || ""
              }_${params?.row?.rolebacktobranch || ""}_${
                params.row.rolebackto
              }`}</span>
            )}
          </>
        </Grid>
      ),
    },
    {
      field: "scheduleinterview",
      headerName: "Schedule Interview",
      flex: 0,
      width: 130,
      sortable: false,
      hide: !columnVisibility.scheduleinterview,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {(params?.row?.rounduserstatus === "" ||
            params?.row?.rounduserstatus == undefined) &&
            params?.row?.roundstatus === "Completed" &&
            params?.row?.roundanswerstatus === "Selected" &&
            params?.row?.interviewroundlength < roundsArray?.length && (
              <Grid item md={3} xs={12} sm={12}>
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      handleClickOpenMeetingPopup(
                        params?.row?.company,
                        params?.row?.branch,
                        roleName,
                        params?.row?.id,
                        params?.row?.fullname,
                        params?.row?.designation
                      );
                      setPrevId(params?.row?.roundid);
                    }}
                  >
                    SI
                  </Button>
                </>
              </Grid>
            )}
        </Grid>
      ),
    },
    {
      field: "responses",
      headerName: "Responses",
      flex: 0,
      width: 500,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.responses,
      headerClassName: "bold-header",
      // Assign Bank Detail
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {params?.row?.roundstatus === "Completed" ? (
            <>
              <Tooltip title="View Candidate Response and Update Results">
                <IconButton
                  sx={userStyle.buttonedit}
                  color="primary"
                  onClick={() => {
                    viewResponses(
                      params?.row?.id,
                      params?.row?.roundid,
                      params?.row?.roundmode,
                      params?.row?.reponseloglength
                    );
                  }}
                  title="View Responses"
                >
                  <AssignmentIcon />
                </IconButton>
              </Tooltip>
              &nbsp;
              {params?.row?.roundmode === "Typing Test" && (
                <Tooltip title="View and Edit Candidate Response">
                  <IconButton
                    sx={userStyle.buttonedit}
                    color="primary"
                    onClick={() => {
                      editResponses(
                        params?.row?.id,
                        params?.row?.roundid,
                        params?.row?.roundmode,
                        params?.row?.reponseloglength
                      );
                    }}
                    title="Edit Responses"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              &nbsp;
              {params?.row?.reponseloglength > 1 && (
                <Tooltip title="Veiw Retest">
                  <Button
                    variant="contained"
                    style={{
                      minWidth: "30px",
                      padding: "8px",
                      backgroundColor: "#1976D2",
                      color: "#FFFFFF",
                    }}
                    onClick={() => {
                      navigate(
                        `/reponselog/${params?.row?.id}/${params?.row?.roundid}`
                      );
                    }}
                  >
                    <MenuIcon style={{ fontSize: "medium" }} />
                  </Button>
                </Tooltip>
              )}
              &nbsp;
              <>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl size="large" fullWidth>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: "auto",
                          },
                        },
                      }}
                      style={{ minWidth: 150, width: 200, overflow: "hidden" }}
                      value={
                        statusRoundStatus[params.row.roundid]
                          ?.roundanswerstatus ||
                        params.row.roundanswerstatus ||
                        "No Status"
                      }
                      onChange={(e) => {
                        handleActionRoundStatus(
                          e.target.value,
                          params?.row?.roundid,
                          params.row.serialNumber
                        );
                      }}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="No Status" disabled>
                        <em>No Status</em>
                      </MenuItem>
                      <MenuItem value="Selected">Selected</MenuItem>
                      <MenuItem value="On Hold">On Hold</MenuItem>

                      <MenuItem value="Rejected With Reschedule">
                        Rejected With Reschedule
                      </MenuItem>
                      <MenuItem value="Rejected Without Reschedule">
                        Rejected Without Reschedule
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <br />
                <br />
                {statusRoundStatus[params.row.roundid]?.btnShow &&
                rowIndexRoundStatus === params.row.serialNumber ? (
                  <>
                    {" "}
                    <LoadingButton
                      sx={{
                        ...userStyle.buttonedit,
                        marginLeft: "10px",
                      }}
                      variant="contained"
                      size="small"
                      loading={btnSubmitRoundStatus}
                      style={{ minWidth: "0px" }}
                      onClick={(e) =>
                        handleUpdateRoundStatus(
                          params?.row?.roundid,
                          statusRoundStatus[params.row.roundid]
                            ?.roundanswerstatus
                        )
                      }
                    >
                      SAVE
                    </LoadingButton>
                  </>
                ) : (
                  <></>
                )}
              </>
            </>
          ) : (
            <></>
          )}
        </Grid>
      ),
    },

    {
      field: "moveback",
      headerName: "Round Control",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.moveback,
      renderCell: (params) => (
        <>
          <Grid sx={{ display: "flex" }}>
            {params?.row?.roundstatus === "Interview Scheduled" &&
              params?.row?.testexpired === false &&
              (params?.row?.rounduserstatus === "" ||
                params?.row?.rounduserstatus == undefined) && (
                <Button
                  startIcon={<UndoIcon />}
                  variant="contained"
                  color="secondary"
                  size="small"
                  style={{ backgroundColor: "#FF9800", margin: "4px" }}
                  onClick={() => {
                    handleOpenModcheckbox();
                    setDeleteRoundId(params.row.roundid);
                    setCandidateIdReset(params.row.id);
                    setDeleteRoundIdBy("Undo");
                  }}
                >
                  Move Back
                </Button>
              )}
          </Grid>
          <Grid sx={{ display: "flex" }}>
            {params?.row?.roundstatus === "Interview Scheduled" &&
              params?.row?.testexpired === true &&
              (params?.row?.rounduserstatus === "" ||
                params?.row?.rounduserstatus == undefined) && (
                <Button
                  endIcon={<RestoreIcon />}
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ backgroundColor: "#4CAF50", margin: "4px" }}
                  onClick={() => {
                    // handleOpenModcheckbox();
                    handleOpenModcheckboxReset();
                    setDeleteRoundId(params.row.roundid);
                    setCandidateIdReset(params.row.id);
                    setDeleteRoundIdBy("Re-Scheduled");
                  }}
                >
                  Reschedule
                </Button>
              )}
          </Grid>
          <Grid sx={{ display: "flex" }}>
            {params?.row?.roundstatus === "Completed" &&
              params?.row?.roundanswerstatus === "Rejected" &&
              params?.row?.rescheduleafterreject === "true" &&
              (params?.row?.rounduserstatus === "" ||
                params?.row?.rounduserstatus == undefined) && (
                <Button
                  endIcon={<RestoreIcon />}
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ backgroundColor: "#4CAF50", margin: "4px" }}
                  onClick={() => {
                    // handleOpenModcheckbox();
                    handleOpenModcheckboxReset();
                    setDeleteRoundId(params.row.roundid);
                    setCandidateIdReset(params.row.id);
                    setDeleteRoundIdBy("Re-Scheduled");
                  }}
                >
                  Reschedule
                </Button>
              )}
            {params?.row?.roundstatus === "On Progress" &&
              (params?.row?.rounduserstatus === "" ||
                params?.row?.rounduserstatus == undefined) && (
                <Button
                  endIcon={<RestoreIcon />}
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ backgroundColor: "#4CAF50", margin: "4px" }}
                  onClick={() => {
                    // handleOpenModcheckbox();
                    handleOpenModcheckboxReset();
                    setDeleteRoundId(params.row.roundid);
                    setCandidateIdReset(params.row.id);
                    setDeleteRoundIdBy("Re-Scheduled");
                  }}
                >
                  Reschedule
                </Button>
              )}
          </Grid>
          {/* <Grid sx={{ display: "flex" }}>
            {params?.row?.roundstatus === "On Progress" && (
              <Button
                startIcon={<ResetIcon />}
                variant="contained"
                color="error"
                size="small"
                style={{ backgroundColor: "#F44336", margin: "4px" }}
                onClick={() => {
                  // handleOpenModcheckbox();
                  handleOpenModcheckboxReset();
                  setDeleteRoundId(params.row.roundid);
                  setCandidateIdReset(params.row.id);
                  setDeleteRoundIdBy("Reset");
                }}
              >
                RESET
              </Button>
            )}
          </Grid> */}
          <Grid sx={{ display: "flex" }}>
            {params?.row?.roundstatus === "Completed" &&
              params?.row?.roundanswerstatus == "" && (
                <Button
                  variant="contained"
                  startIcon={<RetestIcon />}
                  color="info"
                  size="small"
                  style={{ backgroundColor: "#2196F3", margin: "4px" }}
                  onClick={() => {
                    handleOpenModcheckboxReTest();
                    setDeleteRoundId(params.row.roundid);
                    setStartTestFullName(params.row.fullname);
                  }}
                >
                  RETEST
                </Button>
              )}
          </Grid>
        </>
      ),
    },

    {
      field: "roleback",
      headerName: "Change Role",
      flex: 0,
      width: 160,
      minHeight: "40px",
      hide: !columnVisibility.roleback,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Button
            endIcon={<SwapHorizIcon />}
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => {
              singleCandidateRoleBack(params.row.id);
            }}
            sx={{
              height: "30px",
              width: "120px",
              fontSize: "0.75rem",
              padding: "5px 10px",
              minWidth: "unset",
            }}
          >
            Change Role
          </Button>
        </Grid>
      ),
    },
    {
      field: "starttest",
      headerName: "HR",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.starttest,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {(params?.row?.roundstatus === "Interview Scheduled" ||
            params?.row?.roundstatus === "Candidate Completed") &&
            (params?.row?.rounduserstatus === "" ||
              params?.row?.rounduserstatus == undefined) &&
            params?.row?.roundmode !== "Typing Test" &&
            params?.row?.roundmode !== "Online or Interview Test" &&
            !params?.row?.testexpired && (
              <Button
                endIcon={<BusinessIcon />}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  handleOpenModcheckboxStartTest();
                  setStartTestRoundId(params.row.roundid);
                  setStartTestRoundLink(params.row.roundlink);
                  setStartTestFullName(params.row.fullname);
                  setCandidateId(params.row.id);
                  setStartTestUserName(params.row.username);
                  setStartTestUserPassword(params.row.password);
                  setButtonName("Hr");
                }}
              >
                START
              </Button>
            )}
        </Grid>
      ),
    },
    {
      field: "candidatestarttest",
      headerName: "Candidate",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.candidatestarttest,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {params?.row?.roundstatus === "Interview Scheduled" &&
            (params?.row?.rounduserstatus === "" ||
              params?.row?.rounduserstatus == undefined) &&
            !params?.row?.testexpired && (
              <Button
                endIcon={<PersonIcon />}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  handleOpenModcheckboxStartTest();

                  setButtonName("Candidate");
                  setStartTestFullName(params.row.fullname);
                  setStartTestRoundLink(
                    params?.row?.roundmode === "Online or Interview Test"
                      ? params?.row?.onlinetestround
                      : params?.row?.roundlink
                  );
                }}
              >
                START
              </Button>
            )}
        </Grid>
      ),
    },

    {
      field: "username",
      headerName: "UserName",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.username,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
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
                handleCopy("Copied Username!");
              }}
              options={{ message: "Copied Username!" }}
              text={params?.row?.username}
            >
              <ListItemText primary={params?.row?.username} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "password",
      headerName: "Password",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.password,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
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
                handleCopy("Copied Password!");
              }}
              options={{ message: "Copied Password!" }}
              text={params?.row?.password}
            >
              <ListItemText primary={params?.row?.password} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "interviewer",
      headerName: "Interviewer",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.interviewer,
    },
    {
      field: "appliedat",
      headerName: "Applied Date/Time",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.appliedat,
    },
    {
      field: "scheduledat",
      headerName: "Scheduled Date/Time",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.scheduledat,
    },
    {
      field: "reportingdatetime",
      headerName: "Reporting Date/Time",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.reportingdatetime,
    },
    {
      field: "deadlinedatetime",
      headerName: "Deadline Date/Time",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.deadlinedatetime,
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.duration,
    },
    {
      field: "roundmode",
      headerName: "Round Mode",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.roundmode,
    },
    {
      field: "testname",
      headerName: "Test Name",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.testname,
    },
    {
      field: "roundtype",
      headerName: "Round Type",
      flex: 0,
      width: 130,
      minHeight: "40px",
      hide: !columnVisibility.roundtype,
    },
    {
      field: "roundcategory",
      headerName: "Round Category",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.roundcategory,
    },
    {
      field: "roundsubcategory",
      headerName: "Round SubCategory",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.roundsubcategory,
    },
    {
      field: "retestcount",
      headerName: "Retest Count",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.retestcount,
    },
    {
      field: "attempts",
      headerName: "Attempts",
      flex: 0,
      width: 120,
      minHeight: "40px",
      hide: !columnVisibility.attempts,
    },

    {
      field: "roundlink",
      headerName: "Round Link",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.roundlink,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {params?.row.roundmode !== "Online or Interview Test" &&
          params?.row?.roundlinktext !== "Disable" ? (
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
                  handleCopy(`${params?.row?.roundlinktextmsg}!`);
                }}
                options={{ message: "Copied Round Link!" }}
                text={params?.row?.roundlink}
              >
                <ListItemText
                  primary={`${params?.row?.roundlinktext}`}
                  style={{ fontSize: "smaller" }}
                />
              </CopyToClipboard>
            </ListItem>
          ) : params?.row.roundmode == "Online or Interview Test" ? (
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
                  handleCopy(`Copied Test Link!`);
                }}
                options={{ message: "Copied Round Link!" }}
                text={params?.row?.onlinetestround}
              >
                <ListItemText
                  primary={"Copy Test Link"}
                  style={{ fontSize: "smaller" }}
                />
              </CopyToClipboard>
            </ListItem>
          ) : (
            <></>
          )}
        </Grid>
      ),
    },
    {
      field: "roundstatus",
      headerName: "Round Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.roundstatus,
    },
    {
      field: "roundanswerstatus",
      headerName: "Round Answer Status",
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.roundanswerstatus,
      renderCell: (params) => (
        <>
          {params?.row?.roundanswerstatus && (
            <Button
              variant="contained"
              style={{
                padding: "5px",
                background:
                  params.row.roundanswerstatus === "Selected"
                    ? "green"
                    : params.row.roundanswerstatus === "Rejected"
                    ? "red"
                    : params.row.roundanswerstatus === "On Hold"
                    ? "orange"
                    : "brown",
                color:
                  params.row.roundanswerstatus === "On Hold"
                    ? "black"
                    : "white",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {params?.row?.roundanswerstatus}
            </Button>
          )}
        </>
      ),
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 150,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,

      renderCell: (params) => (
        <>
          {rounds.length == params.row.interviewroundlength &&
            params.row.roundanswerstatus == "Selected" &&
            !params.row.finalstatus && (
              // moveToShowid?.includes(params.row.id) &&
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Move to">
                  <IconButton
                    sx={{ ...userStyle.buttonedit }}
                    onClick={() => {
                      // handleOpenToMove();
                      setMigrateData(params.row);
                      handleClickOpenEdit();
                      getCodeMyCheckList(params.row);
                    }}
                  >
                    <SendIcon style={{ color: "#007bff" }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}

          {rounds.length == params.row.interviewroundlength &&
            params.row.roundanswerstatus == "Selected" &&
            params.row.finalstatus == "Hold" && (
              // moveToShowid?.includes(params.row.id) &&
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Move to">
                  <Button
                    sx={{
                      ...userStyle.buttonedit,
                      "&:hover": {
                        "& span": {
                          visibility: "hidden",
                        },
                        "&::after": {
                          content: '"TO MOVE"',
                          visibility: "visible",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "inherit",
                        },
                      },
                    }}
                    onClick={() => {
                      // handleOpenToMove();
                      setMigrateData(params.row);
                      setDatas({
                        category: "Hold",
                        type: "",
                        salarystatus: "",
                      });
                      handleClickOpenEdit();
                      getCodeMyCheckList(params.row);
                    }}
                  >
                    <span>HELD</span>
                  </Button>
                </Tooltip>
              </Grid>
            )}

          <Grid sx={{ display: "flex" }}>
            <Link
              to={`/recruitment/viewresume/${params.row.id}/interviewrounds/${ids}`}
            >
              <Button sx={userStyle.buttonedit}>
                <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
              </Button>
            </Link>
          </Grid>
        </>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    const correctedArray = Array.isArray(item?.skill)
      ? item.skill.map((d) => (Array.isArray(d) ? d.join(",") : d))
      : [];
    return {
      id: item._id,
      checkbox: selectedRows.includes(item.id),
      serialNumber: item?.serialNumber,
      fullname: item.fullname,
      mobile: item.mobile,
      email: item.email,
      dateofbirth: item.dateofbirth,
      qualification: item.qualification,
      skill: correctedArray,
      experience: item.experience,
      status: item.status,
      tablename: item?.tablename,
      prefix: item?.prefix,
      gender: item?.gender,
      adharnumber: item?.adharnumber,
      company: singleJobData?.company,
      branch: singleJobData?.branch,
      designation: singleJobData?.designation,
      firstname: item.firstname,
      lastname: item.lastname,
      pannumber: item.pannumber,
      education: item.education,
      educationdetails: item.educationdetails,
      profileimage: item.profileimage,
      finalstatus: item.finalstatus,
      roleback: item?.roleback,
      rolebackto: item?.rolebackto,
      rolebacktocompany: item?.rolebacktocompany,
      rolebacktobranch: item?.rolebacktobranch,

      username: item.username,
      password: item.password,
      interviewroundlength: item?.interviewrounds?.length,
      reportingdatetime: item?.reportingdatetime,
      deadlinedatetime: item?.deadlinedatetime,
      interviewer: item?.interviewer,
      duration: item?.duration,
      retestcount: item?.retestcount,
      roundtype: item?.roundtype,
      roundcategory: item?.roundcategory,
      roundsubcategory: item?.roundsubcategory,
      roundmode: item?.roundmode,
      testname: item?.testname,
      totalmarks: item?.totalmarks,
      eligiblemarks: item?.eligiblemarks,
      markcomparison: item?.markcomparison,

      onlinetestround: item?.onlinetestround,
      roundlink: item?.roundlink,
      roundlinktext: item?.roundlinktext,
      roundlinktextmsg: item?.roundlinktextmsg,
      roundstatus: item?.roundstatus,
      roundanswerstatus: item?.roundanswerstatus,
      rescheduleafterreject: item?.rescheduleafterreject,
      rounduserstatus: item?.rounduserstatus,
      roundid: item?.roundid,
      reponseloglength: item?.reponseloglength,
      attempts: item?.attempts,
      testexpired: item?.testexpired,
      appliedat: item?.appliedat,
      scheduledat: item?.scheduledat,
    };
  });
  useEffect(() => {
    saveScrollPosition();
  }, [rowDataTable]);
  const calculateResult = () => {
    const userTakenResults = roundmasterEdit?.interviewForm?.map((data) => {
      if (
        data?.userans?.filter((item) => item !== "")?.length > 0 &&
        data.optionArr?.map((t) => t.options)?.includes("NOANSWER")
      ) {
        return "Eligible";
      } else if (
        data?.type === "Date Range" &&
        data?.userans?.length > 0 &&
        new Date(data?.userans[0]) >= new Date(data?.optionArr[0].options) &&
        new Date(data?.userans[0]) <= new Date(data?.optionArr[1].options)
      ) {
        return "Eligible";
      } else if (
        data?.type !== "Date Range" &&
        data?.userans?.filter((item) => item !== "")?.length > 0 &&
        data.optionArr
          ?.filter((item) => data.userans.includes(item.options))
          ?.map((t) => t.status)
          .filter((item) => item.trim() === "Eligible").length >=
          data.optionArr
            ?.filter(
              (item) =>
                data.userans.includes(item.options) &&
                (item?.status === "Not-Eligible" ||
                  item?.status === "Manual Decision")
            )
            ?.map((t) => t.status).length
      ) {
        return "Eligible";
      } else {
        return "Not Eligible";
      }
    });

    const userTakenMarks = userTakenResults?.filter(
      (data) => data === "Eligible"
    )?.length;
    const { eligiblemarks } = roundmasterEdit;

    // Calculate the result based on the comparison type
    let testResults = "Fail";

    if (userTakenMarks >= eligiblemarks) testResults = "Pass";

    return { userTakenMarks, testResults };
  };

  let { userTakenMarks, testResults } = calculateResult();

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem(
      "interviewRoundscolumnVisibility"
    );
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

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

  // page refersh reload code
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
    getJobRoleDatas();
    fetchJobRoleDropdown();
    fetchDesignationDropdown();
    fetchFormerUsers();
    fetchUnassignedCandidates();
  }, [ids]);
  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"INTERVIEW ROUNDS"} />

      <LoadingBackdrop open={isLoading} />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography sx={userStyle.HeaderText}>Interview Rounds</Typography>
        </Grid>
        <Grid item xs={4}>
          <>
            <Link
              to={`/company/recuritment/${ids}`}
              style={{
                textDecoration: "none",
                color: "white",
                float: "right",
              }}
            >
              <Button variant="contained">Back</Button>
            </Link>
          </>
        </Grid>
      </Grid>
      <NotificationContainer />
      <br />
      {isUserRoleCompare?.includes("ljobopenings") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                <b>Job Role : {roleName} </b>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                <b>Round Name : {tableName} </b>
              </Typography>
            </Grid>
            <br />
            <br />
            <Grid item md={12} xs={12} sm={12}>
              <Grid container spacing={2} sx={{ justifyContent: "center" }}>
                {rounds
                  ?.filter((data) => data?.exist === true)
                  ?.map((item, index) => {
                    return (
                      <Grid item md={2} xs={12} sm={4}>
                        <Button
                          onClick={() => {
                            fetchUniqueRounds(item?.roundname);
                            setTableName(item?.roundname);
                          }}
                          sx={{
                            background: "#f4f4f4",
                            // height: "80px",
                            border: "1px solid lightgrey",
                            width: "100%",
                            fontWeight: "bold",
                            fontSize: "13px",
                            display: "block",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            flexDirection: "column",
                          }}
                        >
                          <Typography variant="body1">
                            {item?.candidatecount}
                          </Typography>
                          <Typography variant="body1">
                            {item?.roundname}
                          </Typography>
                          <span
                            style={{
                              fontSize: "8px",
                            }}
                          >
                            ({item?.mode} - {item?.category} -{" "}
                            {item?.subcategory} - {item?.type} -{" "}
                            {formatDuration(item?.duration)})
                          </span>
                        </Button>
                      </Grid>
                    );
                  })}
              </Grid>
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
                    <MenuItem value={candidates?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("exceljobopenings") && (
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
                  {isUserRoleCompare?.includes("csvjobopenings") && (
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
                  {isUserRoleCompare?.includes("printjobopenings") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfjobopenings") && (
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
                  {isUserRoleCompare?.includes("printjobopenings") && (
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
            <br />
            <br />
            {!isBankdetail ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress color="inherit" />  */}
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
                    rows={rowDataTable}
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
                    rowHeight={100}
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
              onClick={(e) => {
                if (
                  deleteRoundIdBy === "Reset" ||
                  deleteRoundIdBy === "Re-Scheduled"
                ) {
                  handleReset(
                    deleteRoundId,
                    "Interview Scheduled",
                    deleteRoundIdBy
                  );
                } else if (deleteRoundIdBy === "Undo") {
                  deleteInterviewRound(deleteRoundId, candidateIdReset);
                }
              }}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* reset Modal */}

      <Box>
        <Dialog
          open={isDeleteOpencheckboxReset}
          onClose={handleCloseModcheckboxReset}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="sm"
        >
          <Box sx={{ padding: "20px 50px" }}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Reporting Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    value={dateTime.reportingdate}
                    onChange={(e) => {
                      setDateTime({
                        ...dateTime,
                        reportingdate: e.target.value,
                        deadlinedate: "",
                      });
                      document.getElementById("deadline-dateone").min =
                        e.target.value;
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Reporting Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="time"
                    placeholder="HH:MM:AM/PM"
                    value={dateTime.reportingtime}
                    onChange={(e) => {
                      setDateTime({
                        ...dateTime,
                        reportingtime: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Deadline Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="deadline-dateone"
                    type="date"
                    value={dateTime.deadlinedate}
                    onChange={(e) => {
                      setDateTime({
                        ...dateTime,
                        deadlinedate: e.target.value,
                      });
                    }}
                    min={dateTime.date}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Deadline Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="time"
                    placeholder="HH:MM:AM/PM"
                    value={dateTime.deadlinetime}
                    onChange={(e) => {
                      setDateTime({
                        ...dateTime,
                        deadlinetime: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <DialogActions>
            <Button
              onClick={handleCloseModcheckboxReset}
              sx={userStyle.btncancel}
            >
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="primary"
              onClick={(e) => {
                if (isDeleteOpencheckboxResetTable) {
                  handleResetDateTable(deleteRoundId);
                } else {
                  handleResetDate(deleteRoundId, "Interview Scheduled");
                }
              }}
            >
              {" "}
              Update{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Start Test Modal */}
      <Box>
        <Dialog
          open={isStartTestOpencheckbox}
          onClose={handleCloseModcheckboxStartTest}
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
              Are you sure? Do you want to Start Test for {startTestFullName} ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModcheckboxStartTest}
              color="error"
              variant="contained"
            >
              No
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="success"
              onClick={(e) => {
                if (buttonName === "Hr") {
                  startInterviewRoundByHr(
                    startTestRoundLink,
                    startTestUserName,
                    startTestUserPassword,
                    startTestRoundId,
                    candidateId
                  );
                } else {
                  startInterviewRoundByCandidate(startTestRoundLink);
                }
              }}
            >
              {" "}
              Yes{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Re Test Modal */}
      <Box>
        <Dialog
          open={isReTestOpencheckbox}
          onClose={handleCloseModcheckboxReTest}
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
              Are you sure? Do you want to Schedule Re-Test for{" "}
              {startTestFullName} ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModcheckboxReTest}
              color="error"
              variant="contained"
            >
              No
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="success"
              onClick={(e) => {
                handleRetest(deleteRoundId, "Interview Scheduled");
              }}
            >
              {" "}
              Yes{" "}
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Response &nbsp;&nbsp; <b> {roundmasterEdit?.username} </b>
            </Typography>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    {" "}
                    Main Questions
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Total marks: {roundmasterEdit.totalmarks}
                      </Typography>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Eligible marks: {roundmasterEdit.eligiblemarks}
                      </Typography>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Obtained marks: {userTakenMarks}
                      </Typography>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Result:
                        <Box
                          sx={{
                            ml: 1,
                            color: testResults === "Pass" ? "green" : "red",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {testResults === "Pass" ? (
                            <CheckCircleIcon />
                          ) : (
                            <CancelIcon />
                          )}
                          <Box sx={{ ml: 1 }}>{testResults}</Box>
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Questions </Typography>
                  </FormControl>
                </Grid>

                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">User Ans </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Correct Ans </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={1.5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">User Ans Status </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Options </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={0.5} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Status </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              {roundmasterEdit?.interviewForm?.map((data, index) => {
                return (
                  <>
                    <Grid container spacing={2}>
                      <Grid item md={4} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                            title={data.question}
                          >
                            <Button
                              variant="contained"
                              style={{
                                padding: "5px",
                                background:
                                  data?.attendby === "Candidate"
                                    ? "green"
                                    : data?.attendby === "Interviewer"
                                    ? "orange"
                                    : "brown",
                                color: "white",
                                fontSize: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              {data?.attendby}
                            </Button>{" "}
                            &nbsp;
                            {data?.uploadedimage && (
                              <>
                                <>
                                  <IconButton
                                    aria-label="view"
                                    onClick={() => {
                                      handleViewImageSubEdit(data);
                                    }}
                                  >
                                    <VisibilityOutlinedIcon
                                      sx={{ color: "#0B7CED" }}
                                    />
                                  </IconButton>
                                </>
                              </>
                            )}
                            &nbsp;{index + 1} . {data.question}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data.userans
                              ?.map((t, i) => `${i + 1 + ". "}` + t)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data.optionArr
                              ?.filter((data) => data?.status === "Eligible")
                              ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={1.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data.optionArr
                              ?.map((t, i) => t.options)
                              ?.includes("NOANSWER") &&
                            data?.userans?.filter((item) => item !== "")
                              ?.length > 0
                              ? "Eligible"
                              : data.optionArr
                                  ?.filter((item) =>
                                    data.userans.includes(item.options)
                                  )
                                  ?.map((t, i) => `${i + 1 + ". "}` + t.status)
                                  .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={2} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data.optionArr
                              ?.map((t, i) => `${i + 1 + ". "}` + t.options)
                              .toString()}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={0.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            {data?.userans?.filter((item) => item !== "")
                              ?.length > 0 &&
                            data.optionArr
                              ?.map((t) => t.options)
                              ?.includes("NOANSWER") ? (
                              <CheckCircleIcon color="success" />
                            ) : data?.type === "Date Range" &&
                              data?.userans?.length > 0 &&
                              new Date(data?.userans[0]) >=
                                new Date(data?.optionArr[0].options) &&
                              new Date(data?.userans[0]) <=
                                new Date(data?.optionArr[1].options) ? (
                              <CheckCircleIcon color="success" />
                            ) : data?.type !== "Date Range" &&
                              data?.userans?.filter((item) => item !== "")
                                ?.length > 0 &&
                              data.optionArr
                                ?.filter((item) =>
                                  data.userans.includes(item.options)
                                )
                                ?.map((t, i) => t.status)
                                .filter((item) => item.trim() === "Eligible")
                                .length >=
                                data.optionArr
                                  ?.filter(
                                    (item) =>
                                      data.userans.includes(item.options) &&
                                      (item?.status === "Not-Eligible" ||
                                        item?.status === "Manual Decision")
                                  )
                                  ?.map((t, i) => t.status).length ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <CancelIcon color="error" />
                            )}
                          </Typography>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                  </>
                );
              })}

              {roundmasterEdit?.interviewForm?.length > 0 &&
                roundmasterEdit?.interviewForm?.some(
                  (form) => form.secondarytodo && form.secondarytodo.length > 0
                ) && (
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12} sm={12}>
                      <Typography sx={userStyle.HeaderText}>
                        {" "}
                        Sub Questions
                      </Typography>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Questions </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">User Ans </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Correct Ans </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={1.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">User Ans Status </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Options </Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={0.5} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Status </Typography>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              <br />
              {roundmasterEdit?.interviewForm?.length > 0 &&
                roundmasterEdit?.interviewForm?.map((data, index) => {
                  return data?.secondarytodo?.map((item, ind) => (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "100%",
                              }}
                              title={item.question}
                            >
                              {item.uploadedimage && (
                                <>
                                  <>
                                    <IconButton
                                      aria-label="view"
                                      onClick={() => {
                                        handleViewImageSubEdit(item);
                                      }}
                                    >
                                      <VisibilityOutlinedIcon
                                        sx={{ color: "#0B7CED" }}
                                      />
                                    </IconButton>
                                  </>
                                </>
                              )}
                              &nbsp; {index + 1}.{ind + 1} {item?.question}
                            </Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {item?.userans
                                ?.map((t, i) => `${i + 1 + ". "}` + t + " ")
                                .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {item?.optionslist
                                ?.filter((data) => data?.status === "Eligible")
                                ?.map(
                                  (t, i) => `${i + 1 + ". "}` + t?.answer + " "
                                )
                                .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={1.5} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {" "}
                              {item?.optionslist
                                ?.map((t, i) => t?.answer)
                                ?.includes("NOANSWER") &&
                              item?.userans?.filter((item) => item !== "")
                                ?.length > 0
                                ? "Eligible"
                                : item?.optionslist
                                    ?.filter((data) =>
                                      item?.userans.includes(data?.answer)
                                    )
                                    ?.map(
                                      (t, i) => `${i + 1 + ". "}` + t.status
                                    )
                                    .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>

                        <Grid item md={2} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {item?.optionslist
                                ?.map(
                                  (t, i) => `${i + 1 + ". "}` + t?.answer + " "
                                )
                                .toString()}
                            </Typography>
                          </FormControl>
                        </Grid>

                        <Grid item md={0.5} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              {" "}
                              {item?.userans?.filter((item) => item !== "")
                                ?.length > 0 &&
                              item?.optionslist
                                ?.map((t, i) => t?.answer)
                                ?.includes("NOANSWER") ? (
                                <CheckCircleIcon color="success" />
                              ) : item?.type === "Date Range" &&
                                item?.userans?.length > 0 &&
                                new Date(item?.userans[0]) >=
                                  new Date(item?.optionslist[0].answer) &&
                                new Date(item?.userans[0]) <=
                                  new Date(item?.optionslist[1].answer) ? (
                                <CheckCircleIcon color="success" />
                              ) : item?.type !== "Date Range" &&
                                item?.userans?.filter((item) => item !== "")
                                  ?.length > 0 &&
                                item?.optionslist
                                  ?.filter((data) =>
                                    item?.userans.includes(data?.answer)
                                  )
                                  ?.map((t, i) => t.status)
                                  .filter((item) => item.trim() === "Eligible")
                                  .length >=
                                  item.optionslist
                                    ?.filter(
                                      (data) =>
                                        item?.userans.includes(data?.answer) &&
                                        (data?.status === "Not-Eligible" ||
                                          data?.status === "Manual Decision")
                                    )
                                    ?.map((t, i) => t.status).length ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <CancelIcon color="error" />
                              )}
                            </Typography>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <br />
                    </>
                  ));
                })}
            </>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography variant="h6">
                  Test Status<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={300}
                    options={statusOption}
                    placeholder="Please Select Test Status"
                    value={{
                      label: testStatus,
                      value: testStatus,
                    }}
                    onChange={(e) => {
                      setTestStatus(e.value);
                      setChecked(false);
                    }}
                  />
                </FormControl>
                {testStatus === "Rejected" && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => {
                          setChecked(event.target.checked);
                        }}
                      />
                    }
                    label="Re-Schedule"
                  />
                )}
              </Grid>
              {testStatus === "Rejected" && checked && (
                <>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reporting Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={dateTime.reportingdate}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            reportingdate: e.target.value,
                            deadlinedate: "",
                          });
                          document.getElementById("deadline-datetwo").min =
                            e.target.value;
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reporting Time<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM:AM/PM"
                        value={dateTime.reportingtime}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            reportingtime: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Deadline Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="deadline-datetwo"
                        type="date"
                        value={dateTime.deadlinedate}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            deadlinedate: e.target.value,
                          });
                        }}
                        min={dateTime.date}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Deadline Time<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM:AM/PM"
                        value={dateTime.deadlinetime}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            deadlinetime: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={2} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={userStyle.buttonadd}
                  onClick={(e) => handleUpdateAnswerStatus(subId)}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} sm={2} xs={12}>
                {" "}
                <Button sx={userStyle.btncancel} onClick={handleCloseview}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* typing test view model */}
      <Dialog
        open={openviewTypingtest}
        onClose={handleClickOpenviewTypingtest}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Response &nbsp;&nbsp; <b>
                {" "}
                {roundmasterEdit?.username}{" "}
              </b>{" "}
              &nbsp;&nbsp; Typing Test Results
            </Typography>
            {roundmasterEdit?.loglength > 1 && (
              <ResponseLogTable candidateid={mainId} roundid={subId} />
            )}
            <br />
            <>
              <br />
              {roundmasterEdit?.interviewForm?.map((t, index) => {
                const speed = t.userans?.includes("InComplete")
                  ? "InComplete"
                  : `${t.typingspeedans} wpm`;

                const accuracy = t.userans?.includes("InComplete")
                  ? "InComplete"
                  : `${t.typingaccuracyans} %`;

                const mistakes = t.userans?.includes("InComplete")
                  ? "InComplete"
                  : t.typingmistakesans;
                const status = t.typingresult === "Eligible" ? true : false;
                const timetakeninseconds = t.userans?.includes("InComplete")
                  ? "InComplete"
                  : `${moment.utc(t.timetaken * 1000).format("mm:ss")}`;

                const speedstatus =
                  t?.typingresultstatus?.length > 0
                    ? t?.typingresultstatus[0]
                    : false;
                const accuracystatus =
                  t?.typingresultstatus?.length > 0
                    ? t?.typingresultstatus[1]
                    : false;
                const mistakesstatus =
                  t?.typingresultstatus?.length > 0
                    ? t?.typingresultstatus[2]
                    : false;

                const actualspeed =
                  t?.typingspeedvalidation === "Between"
                    ? `Between ${t?.typingspeedfrom} to ${t?.typingspeedto}`
                    : `${t?.typingspeedvalidation} ${t?.typingspeed}`;
                const actualacuuracy =
                  t?.typingaccuracyvalidation === "Between"
                    ? `Between ${t?.typingaccuracyfrom} to ${t?.typingaccuracyto}`
                    : `${t?.typingaccuracyvalidation} ${t?.typingaccuracy}`;
                const actualmistakes =
                  t?.typingmistakesvalidation === "Between"
                    ? `Between ${t?.typingmistakesfrom} to ${t?.typingmistakesto}`
                    : `${t?.typingmistakesvalidation} ${t?.typingmistakes}`;
                const actualtime = t?.typingduration;
                return (
                  <>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        sm={12}
                        style={{ marginTop: "20px" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                            title={t.question}
                          >
                            <Button
                              variant="contained"
                              style={{
                                padding: "5px",
                                background:
                                  t?.attendby === "Candidate"
                                    ? "green"
                                    : t?.attendby === "Interviewer"
                                    ? "orange"
                                    : "brown",
                                color: "white",
                                fontSize: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              {t?.attendby}
                            </Button>{" "}
                            &nbsp;
                            {t?.uploadedimage && (
                              <>
                                <>
                                  <IconButton
                                    aria-label="view"
                                    onClick={() => {
                                      handleViewImageSubEdit(t);
                                    }}
                                  >
                                    <VisibilityOutlinedIcon
                                      sx={{ color: "#0B7CED" }}
                                    />
                                  </IconButton>
                                </>
                              </>
                            )}
                            &nbsp;{index + 1} . {t.question}
                          </Typography>
                        </FormControl>
                      </Grid>
                      <Grid item md={8} xs={12} sm={12}>
                        {/* Table */}
                        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
                          <TableContainer component={Paper}>
                            <Table
                              aria-label="customized table"
                              id="raisetickets"
                              // ref={componentRef}
                            >
                              <TableHead
                                sx={{ fontWeight: "600", textAlign: "center" }}
                              >
                                <StyledTableRow>
                                  <StyledTableCell
                                    sx={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box
                                        sx={{
                                          textAlign: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        Speed &nbsp; (
                                        <span style={{ fontSize: "12px" }}>
                                          {actualspeed}
                                        </span>
                                        )
                                      </Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box
                                        sx={{
                                          textAlign: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        Accuracy &nbsp; (
                                        <span style={{ fontSize: "12px" }}>
                                          {actualacuuracy}
                                        </span>
                                        )
                                      </Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box
                                        sx={{
                                          textAlign: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        Mistakes &nbsp; (
                                        <span style={{ fontSize: "12px" }}>
                                          {actualmistakes}
                                        </span>
                                        )
                                      </Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box
                                        sx={{
                                          textAlign: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        Time Taken (
                                        <span style={{ fontSize: "12px" }}>
                                          {actualtime}
                                        </span>
                                        )
                                      </Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box
                                        sx={{
                                          textAlign: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        Status
                                      </Box>
                                    </Box>
                                  </StyledTableCell>
                                </StyledTableRow>
                              </TableHead>
                              <TableBody align="left">
                                {roundmasterEdit?.interviewForm?.length > 0 ? (
                                  <StyledTableRow key={index}>
                                    <StyledTableCell>
                                      {speed}&nbsp; &nbsp;
                                      {speedstatus ? (
                                        <CheckCircleIcon
                                          color="success"
                                          style={{
                                            fontSize: "15px",
                                            marginTop: "10px",
                                          }}
                                        />
                                      ) : (
                                        <CancelIcon
                                          color="error"
                                          style={{
                                            fontSize: "15px",
                                            marginTop: "7px",
                                          }}
                                        />
                                      )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {accuracy}&nbsp; &nbsp;
                                      {accuracystatus ? (
                                        <CheckCircleIcon
                                          color="success"
                                          style={{
                                            fontSize: "15px",
                                            marginTop: "7px",
                                          }}
                                        />
                                      ) : (
                                        <CancelIcon
                                          color="error"
                                          style={{
                                            fontSize: "15px",
                                            marginTop: "7px",
                                          }}
                                        />
                                      )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {mistakes}&nbsp; &nbsp;
                                      {mistakesstatus ? (
                                        <CheckCircleIcon
                                          color="success"
                                          style={{
                                            fontSize: "15px",
                                            marginTop: "7px",
                                          }}
                                        />
                                      ) : (
                                        <CancelIcon
                                          color="error"
                                          style={{
                                            fontSize: "15px",
                                            marginTop: "7px",
                                          }}
                                        />
                                      )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {timetakeninseconds}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {status ? (
                                        <CheckCircleIcon color="success" />
                                      ) : (
                                        <CancelIcon color="error" />
                                      )}
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ) : (
                                  <StyledTableRow>
                                    <StyledTableCell
                                      colSpan={12}
                                      sx={{
                                        height: "50px",
                                      }}
                                      align="center"
                                    >
                                      No Data Available
                                    </StyledTableCell>
                                  </StyledTableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Container>
                      </Grid>
                    </Grid>
                    <br />
                  </>
                );
              })}
            </>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography variant="h6">
                  Test Status<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={300}
                    options={statusOption}
                    placeholder="Please Select Test Status"
                    value={{
                      label: testStatus,
                      value: testStatus,
                    }}
                    onChange={(e) => {
                      setTestStatus(e.value);
                      setChecked(false);
                    }}
                  />
                </FormControl>
                {testStatus === "Rejected" && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => {
                          setChecked(event.target.checked);
                        }}
                      />
                    }
                    label="Re-Schedule"
                  />
                )}
              </Grid>
              {testStatus === "Rejected" && checked && (
                <>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reporting Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={dateTime.reportingdate}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            reportingdate: e.target.value,
                            deadlinedate: "",
                          });
                          document.getElementById("deadline-datethree").min =
                            e.target.value;
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reporting Time<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM:AM/PM"
                        value={dateTime.reportingtime}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            reportingtime: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Deadline Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="deadline-datethree"
                        type="date"
                        value={dateTime.deadlinedate}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            deadlinedate: e.target.value,
                          });
                        }}
                        min={dateTime.date}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Deadline Time<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM:AM/PM"
                        value={dateTime.deadlinetime}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            deadlinetime: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={2} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={userStyle.buttonadd}
                  onClick={(e) => handleUpdateAnswerStatus(subId)}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} sm={2} xs={12}>
                {" "}
                <Button
                  sx={userStyle.btncancel}
                  onClick={handleCloseviewTypingtest}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* typing test edit model */}
      <Dialog
        open={openviewTypingtestEdit}
        onClose={handleClickOpenviewTypingtestEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Manual Response &nbsp;&nbsp; <b>
                {" "}
                {roundmasterEdit?.username}{" "}
              </b>{" "}
              &nbsp;&nbsp; Typing Test Results
            </Typography>{" "}
            {roundmasterEdit?.loglength > 1 && (
              <ResponseLogTable candidateid={mainId} roundid={subId} />
            )}
            <br />
            <>
              <br />
              {roundmasterEdit?.interviewForm?.map((t, index) => {
                const speed = t.userans?.includes("InComplete")
                  ? "InComplete"
                  : `${t.typingspeedans} wpm`;

                const accuracy = t.userans?.includes("InComplete")
                  ? "InComplete"
                  : `${t.typingaccuracyans} %`;

                const mistakes = t.userans?.includes("InComplete")
                  ? "InComplete"
                  : t.typingmistakesans;
                const status = t.typingresult === "Eligible" ? true : false;
                const timetakeninseconds = t.userans?.includes("InComplete")
                  ? "InComplete"
                  : `${moment.utc(t.timetaken * 1000).format("mm:ss")}`;

                const speedstatus =
                  t?.typingresultstatus?.length > 0
                    ? t?.typingresultstatus[0]
                    : false;
                const accuracystatus =
                  t?.typingresultstatus?.length > 0
                    ? t?.typingresultstatus[1]
                    : false;
                const mistakesstatus =
                  t?.typingresultstatus?.length > 0
                    ? t?.typingresultstatus[2]
                    : false;

                const actualspeed =
                  t?.typingspeedvalidation === "Between"
                    ? `Between ${t?.typingspeedfrom} to ${t?.typingspeedto}`
                    : `${t?.typingspeedvalidation} ${t?.typingspeed}`;
                const actualacuuracy =
                  t?.typingaccuracyvalidation === "Between"
                    ? `Between ${t?.typingaccuracyfrom} to ${t?.typingaccuracyto}`
                    : `${t?.typingaccuracyvalidation} ${t?.typingaccuracy}`;
                const actualmistakes =
                  t?.typingmistakesvalidation === "Between"
                    ? `Between ${t?.typingmistakesfrom} to ${t?.typingmistakesto}`
                    : `${t?.typingmistakesvalidation} ${t?.typingmistakes}`;
                const actualtime = t?.typingduration;

                return (
                  <>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        sm={12}
                        style={{ marginTop: "20px" }}
                      >
                        <FormControl fullWidth size="small">
                          <Typography
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                            title={t.question}
                          >
                            <Button
                              variant="contained"
                              style={{
                                padding: "5px",
                                background:
                                  t?.attendby === "Candidate"
                                    ? "green"
                                    : t?.attendby === "Interviewer"
                                    ? "orange"
                                    : "brown",
                                color: "white",
                                fontSize: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              {t?.attendby}
                            </Button>{" "}
                            &nbsp;
                            {t?.uploadedimage && (
                              <>
                                <>
                                  <IconButton
                                    aria-label="view"
                                    onClick={() => {
                                      handleViewImageSubEdit(t);
                                    }}
                                  >
                                    <VisibilityOutlinedIcon
                                      sx={{ color: "#0B7CED" }}
                                    />
                                  </IconButton>
                                </>
                              </>
                            )}
                            &nbsp;{index + 1} . {t.question}
                          </Typography>
                        </FormControl>
                      </Grid>

                      {/* speed */}
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Speed<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={t.typingspeedans}
                            placeholder="Please Enter Speed In wpm"
                            onChange={(e) => {
                              const updatedInterviewForm = [
                                ...roundmasterEdit.interviewForm,
                              ];
                              updatedInterviewForm[
                                index
                              ].manuallyedidted = true;
                              updatedInterviewForm[index].typingspeedans =
                                e.target.value.replace(/[^0-9.;\s]/g, "");
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                interviewForm: updatedInterviewForm,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={statusOptiontyping}
                            styles={colourStyles}
                            value={{
                              label: t?.typingresultstatus[0]
                                ? "Eligible"
                                : "Not Eligible",
                              value: t?.typingresultstatus[0]
                                ? "Eligible"
                                : "Not Eligible",
                            }}
                            onChange={(e) => {
                              const updatedInterviewForm = [
                                ...roundmasterEdit.interviewForm,
                              ];
                              updatedInterviewForm[index].typingspeedstatus =
                                e.value;
                              updatedInterviewForm[
                                index
                              ].typingresultstatus[0] =
                                e.value === "Eligible" ? true : false;
                              let finalstatus = updatedInterviewForm[
                                index
                              ].typingresultstatus.every(
                                (data) => data === true
                              );
                              updatedInterviewForm[
                                index
                              ].manuallyedidted = true;
                              updatedInterviewForm[index].typingresult =
                                finalstatus ? "Eligible" : "Not Eligible";
                              updatedInterviewForm[index].useransstatus[0] =
                                e.value;
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                interviewForm: updatedInterviewForm,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        {" "}
                      </Grid>

                      {/* accuraccy */}
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Accuracy<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter Speed In %"
                            value={t?.typingaccuracyans}
                            onChange={(e) => {
                              const updatedInterviewForm = [
                                ...roundmasterEdit.interviewForm,
                              ];
                              updatedInterviewForm[
                                index
                              ].manuallyedidted = true;
                              updatedInterviewForm[index].typingaccuracyans =
                                e.target.value.replace(/[^0-9.;\s]/g, "");
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                interviewForm: updatedInterviewForm,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={statusOptiontyping}
                            styles={colourStyles}
                            value={{
                              label: t?.typingresultstatus[1]
                                ? "Eligible"
                                : "Not Eligible",
                              value: t?.typingresultstatus[1]
                                ? "Eligible"
                                : "Not Eligible",
                            }}
                            onChange={(e) => {
                              const updatedInterviewForm = [
                                ...roundmasterEdit.interviewForm,
                              ];
                              updatedInterviewForm[index].typingaccuracystatus =
                                e.value;
                              updatedInterviewForm[
                                index
                              ].typingresultstatus[1] =
                                e.value === "Eligible" ? true : false;
                              updatedInterviewForm[index].useransstatus[1] =
                                e.value;
                              let finalstatus = updatedInterviewForm[
                                index
                              ].typingresultstatus.every(
                                (data) => data === true
                              );
                              updatedInterviewForm[
                                index
                              ].manuallyedidted = true;
                              updatedInterviewForm[index].typingresult =
                                finalstatus ? "Eligible" : "Not Eligible";
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                interviewForm: updatedInterviewForm,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        {" "}
                      </Grid>

                      {/* mistakes  */}
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Mistakes<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Please Enter Mistakes"
                            value={t?.typingmistakesans}
                            onChange={(e) => {
                              const updatedInterviewForm = [
                                ...roundmasterEdit.interviewForm,
                              ];
                              updatedInterviewForm[index].typingmistakesans =
                                e.target.value.replace(/[^0-9.;\s]/g, "");
                              updatedInterviewForm[
                                index
                              ].manuallyedidted = true;
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                interviewForm: updatedInterviewForm,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={statusOptiontyping}
                            styles={colourStyles}
                            value={{
                              label: t?.typingresultstatus[2]
                                ? "Eligible"
                                : "Not Eligible",
                              value: t?.typingresultstatus[2]
                                ? "Eligible"
                                : "Not Eligible",
                            }}
                            onChange={(e) => {
                              const updatedInterviewForm = [
                                ...roundmasterEdit.interviewForm,
                              ];
                              updatedInterviewForm[index].typingaccuracystatus =
                                e.value;
                              updatedInterviewForm[
                                index
                              ].manuallyedidted = true;
                              updatedInterviewForm[
                                index
                              ].typingresultstatus[2] =
                                e.value === "Eligible" ? true : false;
                              updatedInterviewForm[index].useransstatus[2] =
                                e.value;
                              let finalstatus = updatedInterviewForm[
                                index
                              ].typingresultstatus.every(
                                (data) => data === true
                              );

                              updatedInterviewForm[index].typingresult =
                                finalstatus ? "Eligible" : "Not Eligible";
                              setRoundmasterEdit({
                                ...roundmasterEdit,
                                interviewForm: updatedInterviewForm,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={12}>
                        {" "}
                      </Grid>
                    </Grid>
                    <br />
                  </>
                );
              })}
            </>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography variant="h6">
                  Test Status<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={300}
                    options={statusOption}
                    placeholder="Please Select Test Status"
                    value={{
                      label: testStatus,
                      value: testStatus,
                    }}
                    onChange={(e) => {
                      setTestStatus(e.value);
                      setChecked(false);
                    }}
                  />
                </FormControl>
                {testStatus === "Rejected" && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => {
                          setChecked(event.target.checked);
                        }}
                      />
                    }
                    label="Re-Schedule"
                  />
                )}
              </Grid>
              {testStatus === "Rejected" && checked && (
                <>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reporting Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="date"
                        value={dateTime.reportingdate}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            reportingdate: e.target.value,
                            deadlinedate: "",
                          });
                          document.getElementById("deadline-datefour").min =
                            e.target.value;
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Reporting Time<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM:AM/PM"
                        value={dateTime.reportingtime}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            reportingtime: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Deadline Date<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="deadline-datefour"
                        type="date"
                        value={dateTime.deadlinedate}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            deadlinedate: e.target.value,
                          });
                        }}
                        min={dateTime.date}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Deadline Time<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="time"
                        placeholder="HH:MM:AM/PM"
                        value={dateTime.deadlinetime}
                        onChange={(e) => {
                          setDateTime({
                            ...dateTime,
                            deadlinetime: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={2} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={userStyle.buttonadd}
                  onClick={(e) => handleEditTypingAnswerStatus(subId)}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} sm={2} xs={12}>
                {" "}
                <Button
                  sx={userStyle.btncancel}
                  onClick={handleCloseviewTypingtestEdit}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

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

      {/* print layout */}

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Applicant Name</StyledTableCell>
              <StyledTableCell>User Name</StyledTableCell>
              <StyledTableCell>Password</StyledTableCell>
              <StyledTableCell>Interviewer</StyledTableCell>
              <StyledTableCell>Applied Date/Time</StyledTableCell>
              <StyledTableCell>Scheduled Date/Time</StyledTableCell>
              <StyledTableCell>Reporting Date/Time</StyledTableCell>
              <StyledTableCell>Deadline Date/Time</StyledTableCell>
              <StyledTableCell>Duration</StyledTableCell>
              <StyledTableCell>Round Mode</StyledTableCell>
              <StyledTableCell>Test Name</StyledTableCell>
              <StyledTableCell>Round Type</StyledTableCell>
              <StyledTableCell>Round Category</StyledTableCell>
              <StyledTableCell>Round SubCategory</StyledTableCell>
              <StyledTableCell>Retest Count</StyledTableCell>
              <StyledTableCell>Attempts</StyledTableCell>
              {/* <StyledTableCell>Round Link</StyledTableCell> */}
              <StyledTableCell>Round Status</StyledTableCell>
              <StyledTableCell>Round Answer Status</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell> {row.fullname}</StyledTableCell>
                  <StyledTableCell> {row.username}</StyledTableCell>
                  <StyledTableCell> {row.password}</StyledTableCell>
                  <StyledTableCell> {row.interviewer}</StyledTableCell>
                  <StyledTableCell> {row.appliedat}</StyledTableCell>
                  <StyledTableCell> {row.scheduledat}</StyledTableCell>
                  <StyledTableCell> {row.reportingdatetime}</StyledTableCell>
                  <StyledTableCell> {row.deadlinedatetime}</StyledTableCell>
                  <StyledTableCell> {row.duration}</StyledTableCell>
                  <StyledTableCell> {row.roundmode}</StyledTableCell>
                  <StyledTableCell> {row.testname}</StyledTableCell>
                  <StyledTableCell> {row.roundtype}</StyledTableCell>
                  <StyledTableCell> {row.roundcategory}</StyledTableCell>
                  <StyledTableCell> {row.roundsubcategory}</StyledTableCell>
                  <StyledTableCell> {row.retestcount}</StyledTableCell>
                  <StyledTableCell> {row.attempts}</StyledTableCell>
                  {/* <StyledTableCell> {row.roundlink}</StyledTableCell> */}
                  <StyledTableCell> {row.roundstatus}</StyledTableCell>
                  <StyledTableCell> {row.roundanswerstatus}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* schedule interview popup*/}
      <Dialog
        open={openMeetingPopup}
        onClose={handleClickCloseMeetingPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        // sx={{
        //     overflow: "visible",
        //     "& .MuiPaper-root": {
        //         overflow: "visible",
        //     },
        // }}
        fullWidth={true}
      >
        <ScheduleInterview
          setVendorAuto={setVendorAuto}
          handleClickCloseMeetingPopup={handleClickCloseMeetingPopup}
          getScreenedCandidate={getScreenedCandidate}
          meetingValues={meetingValues}
          roundname={tableName}
          prevroundid={prevId}
          jobopeningsid={ids}
        />
      </Dialog>

      {/* schedule interview popup*/}
      <Dialog
        open={isSalaryFixOpen}
        onClose={handleCloseSalaryFix}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        // sx={{
        //     overflow: "visible",
        //     "& .MuiPaper-root": {
        //         overflow: "visible",
        //     },
        // }}
        fullWidth={true}
      >
        <OnBoardingSalaryFix
          handleCloseSalaryFix={handleCloseSalaryFix}
          setMigrateData={setMigrateData}
          setSalaryFixed={setSalaryFixed}
          designation={getDetails?.designation}
          workmode={datas?.type}
        />
      </Dialog>

      {/* test complete dialog */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "auto",
            },
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.SubHeaderText}>
                My Interview Check List
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      border: "1px solid black",
                      borderRadius: "20px",
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem", textAlign: "center" }}>
                      Candidate Name:{" "}
                      <span
                        style={{
                          fontWeight: "500",
                          fontSize: "1.2rem",
                          display: "inline-block",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        {`${getDetails?.fullname}`}
                      </span>
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={{ textAlign: "left" }}>
                      Status <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={categoryOptions}
                      styles={{
                        ...colourStyles,
                        control: (provided) => ({
                          ...provided,
                          textAlign: "left", // Align selected value to the left
                        }),
                        menu: (provided) => ({
                          ...provided,
                          textAlign: "left", // Align options to the left
                        }),
                      }}
                      value={{
                        label:
                          datas.category === ""
                            ? "Please Select Status"
                            : datas.category,
                        value:
                          datas.category === ""
                            ? "Please Select Status"
                            : datas.category,
                      }}
                      onChange={(e) => {
                        setDatas({
                          ...datas,
                          category: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {datas.category == "On Boarding" && (
                  <>
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography sx={{ textAlign: "left" }}>
                          To Migrate As <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={typeOptions}
                          styles={{
                            ...colourStyles,
                            control: (provided) => ({
                              ...provided,
                              textAlign: "left", // Align selected value to the left
                            }),
                            menu: (provided) => ({
                              ...provided,
                              textAlign: "left", // Align options to the left
                            }),
                          }}
                          value={{
                            label:
                              datas.type === "" ? "Please Select" : datas.type,
                            value:
                              datas.type === "" ? "Please Select" : datas.type,
                          }}
                          onChange={(e) => {
                            setDatas({
                              ...datas,
                              type: e.value,
                              salarystatus:
                                e.value === "Intern" ? "With Salary" : "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {datas.type === "Intern" && (
                      <Grid item md={3} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography sx={{ textAlign: "left" }}>
                            Salary Status <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            options={[
                              { label: "With Salary", value: "With Salary" },
                              {
                                label: "WithOut Salary",
                                value: "WithOut Salary",
                              },
                            ]}
                            styles={{
                              ...colourStyles,
                              control: (provided) => ({
                                ...provided,
                                textAlign: "left", // Align selected value to the left
                              }),
                              menu: (provided) => ({
                                ...provided,
                                textAlign: "left", // Align options to the left
                              }),
                            }}
                            value={{
                              label:
                                datas.salarystatus === ""
                                  ? "Please Select"
                                  : datas.salarystatus,
                              value:
                                datas.salarystatus === ""
                                  ? "Please Select"
                                  : datas.salarystatus,
                            }}
                            onChange={(e) => {
                              setDatas({
                                ...datas,
                                salarystatus: e.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    )}
                    {((datas.type === "Intern" &&
                      datas.salarystatus === "With Salary") ||
                      datas.type === "Employee") && (
                      <Grid item md={2} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography sx={{ textAlign: "left" }}>
                            &nbsp;
                          </Typography>
                          <Button
                            sx={{
                              ...userStyle.buttonadd,
                              ...(salaryFixed
                                ? buttonStyles.fixed
                                : buttonStyles.default),
                            }}
                            variant="contained"
                            size="small"
                            onClick={handleClickOpenSalaryFix}
                            startIcon={
                              salaryFixed ? (
                                <CheckCircleIcon style={{ color: "white" }} />
                              ) : null
                            }
                          >
                            {salaryFixed ? "Salary Fixed" : "Salary fix"}
                          </Button>
                        </FormControl>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
              <br />
              <br />
              {datas?.category !== "Reject" && (
                <>
                  {candidateUploadedDocuments?.length !== 0 && (
                    <Box>
                      <Typography sx={userStyle.SubHeaderText}>
                        Missing Documents
                      </Typography>
                      <br />
                      <br />
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ fontSize: "1.2rem" }}>
                                Document Name
                              </TableCell>
                              <TableCell style={{ fontSize: "1.2rem" }}>
                                Action
                              </TableCell>
                              <TableCell style={{ fontSize: "1.2rem" }}>
                                Preview
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {candidateUploadedDocuments?.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row?.candidatefilename}</TableCell>
                                <TableCell>
                                  <div>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        marginTop: "10px",
                                        gap: "10px",
                                      }}
                                    >
                                      <Box item md={4} sm={4}>
                                        <section>
                                          <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            id={index}
                                            onChange={(e) => {
                                              handleChangeImageNew(
                                                e,
                                                index,
                                                row
                                              );
                                            }}
                                            style={{ display: "none" }}
                                          />
                                          <label htmlFor={index}>
                                            <Typography
                                              sx={userStyle.uploadbtn}
                                            >
                                              Upload
                                            </Typography>
                                          </label>
                                          <br />
                                        </section>
                                      </Box>
                                    </Box>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Box>
                                    {candidateUploadedDocuments[index].data &&
                                      candidateUploadedDocuments[index].data !==
                                        "" && (
                                        <Grid container spacing={2}>
                                          <Grid
                                            item
                                            lg={8}
                                            md={8}
                                            sm={8}
                                            xs={8}
                                          >
                                            <Typography>
                                              {
                                                candidateUploadedDocuments[
                                                  index
                                                ].name
                                              }
                                            </Typography>
                                          </Grid>
                                          <Grid
                                            item
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}
                                          >
                                            <VisibilityOutlinedIcon
                                              style={{
                                                fontsize: "large",
                                                color: "#357AE8",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                renderFilePreviewEditNew(
                                                  candidateUploadedDocuments[
                                                    index
                                                  ]
                                                )
                                              }
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}
                                          >
                                            <Button
                                              style={{
                                                fontsize: "large",
                                                color: "#357AE8",
                                                cursor: "pointer",
                                                marginTop: "-5px",
                                              }}
                                              onClick={() =>
                                                handleFileDeleteEditNew(index)
                                              }
                                            >
                                              <DeleteIcon />
                                            </Button>
                                          </Grid>
                                        </Grid>
                                      )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                  <br />
                  {missingFields?.length !== 0 && (
                    <Box>
                      <Typography sx={userStyle.SubHeaderText}>
                        Missing Fields
                      </Typography>
                      <br />
                      <br />
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ fontSize: "1.2rem" }}>
                                Fields Missing
                              </TableCell>
                              <TableCell style={{ fontSize: "1.2rem" }}>
                                Preview
                              </TableCell>
                              <TableCell style={{ fontSize: "1.2rem" }}>
                                Action
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Typography>Missing Fields</Typography>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    handleOpenMissingField();
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    window.open(
                                      `/resumemanagement/edit/${getDetails?.id}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  Fill Information
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  <br />

                  <Box>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              <Checkbox
                                onChange={() => {
                                  overallCheckListChange();
                                }}
                                checked={isCheckedListOverall}
                              />
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Details
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Field
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Responsible Person
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Completed BY
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Completed At
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Status
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Action
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Category
                            </TableCell>
                            <TableCell style={{ fontSize: "1.2rem" }}>
                              Sub Category
                            </TableCell>

                            {/* Add more table headers as needed */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {groupDetails?.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell style={{ fontSize: "1.2rem" }}>
                                <Checkbox
                                  onChange={() => {
                                    handleCheckboxChange(index);
                                  }}
                                  checked={isCheckedList[index]}
                                />
                              </TableCell>
                              <TableCell>{row.details}</TableCell>
                              {(() => {
                                switch (row.checklist) {
                                  case "Text Box":
                                    return (
                                      <TableCell>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          value={row.data}
                                          // disabled={disableInput[index]}
                                          onChange={(e) => {
                                            handleDataChange(
                                              e,
                                              index,
                                              "Text Box"
                                            );
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  case "Text Box-number":
                                    return (
                                      <TableCell>
                                        <OutlinedInput
                                          value={row.data}
                                          style={{ height: "32px" }}
                                          type="text"
                                          onChange={(e) => {
                                            handleDataChange(
                                              e,
                                              index,
                                              "Text Box-number"
                                            );
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  case "Text Box-alpha":
                                    return (
                                      <TableCell>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          value={row.data}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (
                                              /^[a-zA-Z]*$/.test(inputValue)
                                            ) {
                                              handleDataChange(
                                                e,
                                                index,
                                                "Text Box-alpha"
                                              );
                                            }
                                          }}
                                          inputProps={{ pattern: "[A-Za-z]" }}
                                        />
                                      </TableCell>
                                    );
                                  case "Text Box-alphanumeric":
                                    return (
                                      <TableCell>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          value={row.data}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (
                                              /^[a-zA-Z0-9]*$/.test(inputValue)
                                            ) {
                                              handleDataChange(
                                                e,
                                                index,
                                                "Text Box-alphanumeric"
                                              );
                                            }
                                          }}
                                          inputProps={{
                                            pattern: "[A-Za-z0-9]*",
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  case "Attachments":
                                    return (
                                      <TableCell>
                                        <div>
                                          <InputLabel sx={{ m: 1 }}>
                                            File
                                          </InputLabel>

                                          <div>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                marginTop: "10px",
                                                gap: "10px",
                                              }}
                                            >
                                              <Box item md={4} sm={4}>
                                                <section>
                                                  <input
                                                    type="file"
                                                    accept="*/*"
                                                    id={index}
                                                    onChange={(e) => {
                                                      handleChangeImage(
                                                        e,
                                                        index
                                                      );
                                                    }}
                                                    style={{ display: "none" }}
                                                  />
                                                  <label htmlFor={index}>
                                                    <Typography
                                                      sx={userStyle.uploadbtn}
                                                    >
                                                      Upload
                                                    </Typography>
                                                  </label>
                                                  <br />
                                                </section>
                                              </Box>

                                              <Box item md={4} sm={4}>
                                                <Button
                                                  onClick={showWebcam}
                                                  variant="contained"
                                                  sx={userStyle.uploadbtn}
                                                >
                                                  <CameraAltIcon />
                                                </Button>
                                              </Box>
                                              {row.files && (
                                                <Grid container spacing={2}>
                                                  <Grid
                                                    item
                                                    lg={8}
                                                    md={8}
                                                    sm={8}
                                                    xs={8}
                                                  >
                                                    <Typography>
                                                      {row.files.name}
                                                    </Typography>
                                                  </Grid>
                                                  <Grid
                                                    item
                                                    lg={1}
                                                    md={1}
                                                    sm={1}
                                                    xs={1}
                                                  >
                                                    <VisibilityOutlinedIcon
                                                      style={{
                                                        fontsize: "large",
                                                        color: "#357AE8",
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        renderFilePreviewEdit(
                                                          row.files
                                                        )
                                                      }
                                                    />
                                                  </Grid>
                                                  <Grid
                                                    item
                                                    lg={1}
                                                    md={1}
                                                    sm={1}
                                                    xs={1}
                                                  >
                                                    <Button
                                                      style={{
                                                        fontsize: "large",
                                                        color: "#357AE8",
                                                        cursor: "pointer",
                                                        marginTop: "-5px",
                                                      }}
                                                      onClick={() =>
                                                        handleFileDeleteEdit(
                                                          index
                                                        )
                                                      }
                                                    >
                                                      <DeleteIcon />
                                                    </Button>
                                                  </Grid>
                                                </Grid>
                                              )}
                                            </Box>
                                          </div>
                                          <Dialog
                                            open={isWebcamOpen}
                                            onClose={webcamClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                          >
                                            <DialogContent
                                              sx={{
                                                textAlign: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Webcamimage
                                                getImg={getImg}
                                                setGetImg={setGetImg}
                                                capturedImages={capturedImages}
                                                valNum={valNum}
                                                setValNum={setValNum}
                                                name={name}
                                              />
                                            </DialogContent>
                                            <DialogActions>
                                              <Button
                                                variant="contained"
                                                color="success"
                                                onClick={webcamDataStore}
                                              >
                                                OK
                                              </Button>
                                              <Button
                                                variant="contained"
                                                color="error"
                                                onClick={webcamClose}
                                              >
                                                CANCEL
                                              </Button>
                                            </DialogActions>
                                          </Dialog>
                                        </div>
                                      </TableCell>
                                    );
                                  case "Pre-Value":
                                    return (
                                      <TableCell>
                                        <Typography>{row?.data}</Typography>
                                        {/* {row.details == "USERNAME" ?
                                                                        <>
                                                                            <Typography>{row?.data}</Typography>
                                                                        </>
                                                                        :

                                                                        row.details == "PASSWORD" ?
                                                                            <>
                                                                                <Typography>{row?.data}</Typography>
                                                                            </>
                                                                            :
                                                                            row.details == "LEGALNAME" ?
                                                                                <>
                                                                                    <Typography>{assignDetails?.fullname}</Typography>
                                                                                </>
                                                                                :
                                                                                row.details == "DATE OF BIRTH" ?
                                                                                    <>
                                                                                        <Typography>{assignDetails?.dateofbirth}</Typography>
                                                                                    </>
                                                                                    :
                                                                                    row.details == "EMAIL" ?
                                                                                        <>
                                                                                            <Typography>{assignDetails?.email}</Typography>
                                                                                        </>
                                                                                        :
                                                                                        row.details == "PHONE NUMBER" ?
                                                                                            <>
                                                                                                <Typography>{assignDetails?.mobile}</Typography>
                                                                                            </>
                                                                                            :
                                                                                            row.details == "FIRST NAME" ?
                                                                                                <>
                                                                                                    <Typography>{assignDetails?.firstname}</Typography>
                                                                                                </>
                                                                                                :
                                                                                                row.details == "LAST NAME" ?
                                                                                                    <>
                                                                                                        <Typography>{assignDetails?.lastname}</Typography>
                                                                                                    </>
                                                                                                    :
                                                                                                    row.details == "AADHAAR NUMBER" ?
                                                                                                        <>
                                                                                                            <Typography>{assignDetails?.adharnumber}</Typography>
                                                                                                        </>
                                                                                                        :
                                                                                                        row.details == "PAN NUMBER" ?
                                                                                                            <>
                                                                                                                <Typography>{assignDetails?.pannumber}</Typography>
                                                                                                            </>
                                                                                                            :
                                                                                                            row.details == "CURRENT ADDRESS" ?
                                                                                                                <>
                                                                                                                    <Typography>{assignDetails?.address}</Typography>
                                                                                                                </>
                                                                                                                :
                                                                                                                <></>
                                                                    } */}
                                      </TableCell>
                                    );
                                  case "Date":
                                    return (
                                      <TableCell>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          type="date"
                                          value={row.data}
                                          onChange={(e) => {
                                            handleDataChange(e, index, "Date");
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  case "Time":
                                    return (
                                      <TableCell>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          type="time"
                                          value={row.data}
                                          onChange={(e) => {
                                            handleDataChange(e, index, "Time");
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  case "DateTime":
                                    return (
                                      <TableCell>
                                        <Stack direction="row" spacing={2}>
                                          <OutlinedInput
                                            style={{ height: "32px" }}
                                            type="date"
                                            value={dateValue[index]}
                                            onChange={(e) => {
                                              updateDateValuesAtIndex(
                                                e.target.value,
                                                index
                                              );
                                            }}
                                          />
                                          <OutlinedInput
                                            type="time"
                                            style={{ height: "32px" }}
                                            value={timeValue[index]}
                                            onChange={(e) => {
                                              updateTimeValuesAtIndex(
                                                e.target.value,
                                                index
                                              );
                                            }}
                                          />
                                        </Stack>
                                      </TableCell>
                                    );
                                  case "Date Multi Span":
                                    return (
                                      <TableCell>
                                        <Stack direction="row" spacing={2}>
                                          <OutlinedInput
                                            style={{ height: "32px" }}
                                            type="date"
                                            value={dateValueMultiFrom[index]}
                                            onChange={(e) => {
                                              updateFromDateValueAtIndex(
                                                e.target.value,
                                                index
                                              );
                                            }}
                                          />
                                          <OutlinedInput
                                            type="date"
                                            style={{ height: "32px" }}
                                            value={dateValueMultiTo[index]}
                                            onChange={(e) => {
                                              updateToDateValueAtIndex(
                                                e.target.value,
                                                index
                                              );
                                            }}
                                          />
                                        </Stack>
                                      </TableCell>
                                    );
                                  case "Date Multi Span Time":
                                    return (
                                      <TableCell>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                          }}
                                        >
                                          <Stack direction="row" spacing={2}>
                                            <OutlinedInput
                                              style={{ height: "32px" }}
                                              type="date"
                                              value={firstDateValue[index]}
                                              onChange={(e) => {
                                                updateFirstDateValuesAtIndex(
                                                  e.target.value,
                                                  index
                                                );
                                              }}
                                            />
                                            <OutlinedInput
                                              type="time"
                                              style={{ height: "32px" }}
                                              value={firstTimeValue[index]}
                                              onChange={(e) => {
                                                updateFirstTimeValuesAtIndex(
                                                  e.target.value,
                                                  index
                                                );
                                              }}
                                            />
                                          </Stack>
                                          <Stack direction="row" spacing={2}>
                                            <OutlinedInput
                                              type="date"
                                              style={{ height: "32px" }}
                                              value={secondDateValue[index]}
                                              onChange={(e) => {
                                                updateSecondDateValuesAtIndex(
                                                  e.target.value,
                                                  index
                                                );
                                              }}
                                            />
                                            <OutlinedInput
                                              style={{ height: "32px" }}
                                              type="time"
                                              value={secondTimeValue[index]}
                                              onChange={(e) => {
                                                updateSecondTimeValuesAtIndex(
                                                  e.target.value,
                                                  index
                                                );
                                              }}
                                            />
                                          </Stack>
                                        </div>
                                      </TableCell>
                                    );
                                  case "Date Multi Random":
                                    return (
                                      <TableCell>
                                        <OutlinedInput
                                          style={{ height: "32px" }}
                                          type="date"
                                          value={row.data}
                                          onChange={(e) => {
                                            handleDataChange(
                                              e,
                                              index,
                                              "Date Multi Random"
                                            );
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  case "Date Multi Random Time":
                                    return (
                                      <TableCell>
                                        <Stack direction="row" spacing={2}>
                                          <OutlinedInput
                                            style={{ height: "32px" }}
                                            type="date"
                                            value={dateValueRandom[index]}
                                            onChange={(e) => {
                                              updateDateValueAtIndex(
                                                e.target.value,
                                                index
                                              );
                                            }}
                                          />
                                          <OutlinedInput
                                            type="time"
                                            style={{ height: "32px" }}
                                            value={timeValueRandom[index]}
                                            onChange={(e) => {
                                              updateTimeValueAtIndex(
                                                e.target.value,
                                                index
                                              );
                                            }}
                                          />
                                        </Stack>
                                      </TableCell>
                                    );
                                  case "Radio":
                                    return (
                                      <TableCell>
                                        <FormControl component="fieldset">
                                          <RadioGroup
                                            value={row.data}
                                            sx={{
                                              display: "flex",
                                              flexDirection: "row !important",
                                            }}
                                            onChange={(e) => {
                                              handleDataChange(
                                                e,
                                                index,
                                                "Radio"
                                              );
                                            }}
                                          >
                                            <FormControlLabel
                                              value="No"
                                              control={<Radio />}
                                              label="No"
                                            />
                                            <FormControlLabel
                                              value="Yes"
                                              control={<Radio />}
                                              label="Yes"
                                            />
                                          </RadioGroup>
                                        </FormControl>
                                      </TableCell>
                                    );

                                  default:
                                    return <TableCell></TableCell>; // Default case
                                }
                              })()}
                              <TableCell>{row?.employee?.join(",")}</TableCell>
                              <TableCell>{row.completedby}</TableCell>
                              <TableCell>
                                {row.completedat &&
                                  moment(row.completedat).format(
                                    "DD-MM-YYYY hh:mm:ss A"
                                  )}
                              </TableCell>

                              <TableCell>
                                {row.checklist === "DateTime" ? (
                                  ((row.data !== undefined &&
                                    row.data !== "") ||
                                    row.files !== undefined) &&
                                  row.data.length === 16 ? (
                                    <Typography>Completed</Typography>
                                  ) : (
                                    <Typography>Pending</Typography>
                                  )
                                ) : row.checklist === "Date Multi Span" ? (
                                  ((row.data !== undefined &&
                                    row.data !== "") ||
                                    row.files !== undefined) &&
                                  row.data.length === 21 ? (
                                    <Typography>Completed</Typography>
                                  ) : (
                                    <Typography>Pending</Typography>
                                  )
                                ) : row.checklist === "Date Multi Span Time" ? (
                                  ((row.data !== undefined &&
                                    row.data !== "") ||
                                    row.files !== undefined) &&
                                  row.data.length === 33 ? (
                                    <Typography>Completed</Typography>
                                  ) : (
                                    <Typography>Pending</Typography>
                                  )
                                ) : row.checklist ===
                                  "Date Multi Random Time" ? (
                                  ((row.data !== undefined &&
                                    row.data !== "") ||
                                    row.files !== undefined) &&
                                  row.data.length === 16 ? (
                                    <Typography>Completed</Typography>
                                  ) : (
                                    <Typography>Pending</Typography>
                                  )
                                ) : (row.data !== undefined &&
                                    row.data !== "") ||
                                  row.files !== undefined ? (
                                  <Typography>Completed</Typography>
                                ) : (
                                  <Typography>Pending</Typography>
                                )}
                              </TableCell>

                              <TableCell>
                                {row.checklist === "DateTime" ? (
                                  ((row.data !== undefined &&
                                    row.data !== "") ||
                                    row.files !== undefined) &&
                                  row.data.length === 16 ? (
                                    <>
                                      <IconButton
                                        sx={{
                                          color: "green",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          updateIndividualData(index);
                                        }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <IconButton
                                      sx={{
                                        color: "#1565c0",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        let itemValue = disableInput[index];
                                        itemValue = false;
                                        let spreadData = [...disableInput];
                                        spreadData[index] = false;
                                        setDisableInput(spreadData);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  )
                                ) : row.checklist === "Date Multi Span" ? (
                                  ((row.data !== undefined &&
                                    row.data !== "") ||
                                    row.files !== undefined) &&
                                  row.data.length === 21 ? (
                                    <>
                                      <IconButton
                                        sx={{
                                          color: "green",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          updateIndividualData(index);
                                        }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <IconButton
                                      sx={{
                                        color: "#1565c0",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        let itemValue = disableInput[index];
                                        itemValue = false;
                                        let spreadData = [...disableInput];
                                        spreadData[index] = false;
                                        setDisableInput(spreadData);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  )
                                ) : row.checklist === "Date Multi Span Time" ? (
                                  ((row.data !== undefined &&
                                    row.data !== "") ||
                                    row.files !== undefined) &&
                                  row.data.length === 33 ? (
                                    <>
                                      <IconButton
                                        sx={{
                                          color: "green",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          updateIndividualData(index);
                                        }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <IconButton
                                      sx={{
                                        color: "#1565c0",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        let itemValue = disableInput[index];
                                        itemValue = false;
                                        let spreadData = [...disableInput];
                                        spreadData[index] = false;
                                        setDisableInput(spreadData);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  )
                                ) : row.checklist ===
                                  "Date Multi Random Time" ? (
                                  ((row.data !== undefined &&
                                    row.data !== "") ||
                                    row.files !== undefined) &&
                                  row.data.length === 16 ? (
                                    <>
                                      <IconButton
                                        sx={{
                                          color: "green",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          updateIndividualData(index);
                                        }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <IconButton
                                      sx={{
                                        color: "#1565c0",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        let itemValue = disableInput[index];
                                        itemValue = false;
                                        let spreadData = [...disableInput];
                                        spreadData[index] = false;
                                        setDisableInput(spreadData);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  )
                                ) : (row.data !== undefined &&
                                    row.data !== "") ||
                                  row.files !== undefined ? (
                                  <>
                                    <IconButton
                                      sx={{ color: "green", cursor: "pointer" }}
                                      onClick={() => {
                                        updateIndividualData(index);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <IconButton
                                    sx={{ color: "#1565c0", cursor: "pointer" }}
                                    onClick={() => {
                                      let itemValue = disableInput[index];
                                      itemValue = false;
                                      let spreadData = [...disableInput];
                                      spreadData[index] = false;
                                      setDisableInput(spreadData);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                )}
                              </TableCell>

                              <TableCell>{row.category}</TableCell>
                              <TableCell>{row.subcategory}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </>
              )}
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1} sm={1}></Grid>
                {datas?.category === "Reject" ? (
                  <Button
                    autoFocus
                    variant="contained"
                    color="primary"
                    onClick={handleMoveChange}
                  >
                    {" "}
                    Submit{" "}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleCheckListSubmit}>
                    Submit
                  </Button>
                )}

                <Grid item md={1} sm={1}></Grid>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      <Box>
        <Dialog
          open={isToMoveOpen}
          onClose={handleCloseToMove}
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
          <Box
            sx={{
              width: "450px",
              textAlign: "center",
              alignItems: "center",
              padding: "20px 30px 20px 30px",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Status Change</Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography sx={{ textAlign: "left" }}>
                    Status <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={categoryOptions}
                    styles={{
                      ...colourStyles,
                      control: (provided) => ({
                        ...provided,
                        textAlign: "left", // Align selected value to the left
                      }),
                      menu: (provided) => ({
                        ...provided,
                        textAlign: "left", // Align options to the left
                      }),
                    }}
                    value={{
                      label: datas.category,
                      value: datas.category,
                    }}
                    onChange={(e) => {
                      setDatas({
                        ...datas,
                        category: e.value,
                        type: "",
                        salarystatus: "",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {datas.category == "On Boarding" && (
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography sx={{ textAlign: "left" }}>
                      To Migrate As <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={typeOptions}
                      styles={{
                        ...colourStyles,
                        control: (provided) => ({
                          ...provided,
                          textAlign: "left", // Align selected value to the left
                        }),
                        menu: (provided) => ({
                          ...provided,
                          textAlign: "left", // Align options to the left
                        }),
                      }}
                      value={{
                        label: datas.type,
                        value: datas.type,
                      }}
                      onChange={(e) => {
                        setDatas({
                          ...datas,
                          type: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Box>
          <DialogActions>
            <Button onClick={handleCloseToMove} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="primary"
              onClick={handleMoveChange}
            >
              {" "}
              Submit{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Change Role DIALOG */}
      <Dialog
        open={openRoleBackDialog}
        onClose={handleCloseRoleBack}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{
          overflow: "visible",
          "& .MuiPaper-root": {
            overflow: "visible",
          },
          width: "50rem",
          margin: "auto auto",
        }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.SubHeaderText}>Change Role</Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company{" "}
                    <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
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
                    placeholder="Please Select Company"
                    value={{
                      label: singleCandidateRoleBackDataChoose.company,
                      value: singleCandidateRoleBackDataChoose.company,
                    }}
                    onChange={(e) => {
                      setSngleCandidateRoleBackDataChoose((prev) => ({
                        ...prev,
                        company: e.value,
                        branch: "Please Select Branch",
                        designation: "Please Select Designation",
                        jobrole: "Please Select Job Role",
                        jobroleid: "",
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch{" "}
                    <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={isAssignBranch
                      ?.filter(
                        (comp) =>
                          singleCandidateRoleBackDataChoose.company ===
                          comp.company
                      )
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
                    placeholder="Please Select Branch"
                    value={{
                      label: singleCandidateRoleBackDataChoose.branch,
                      value: singleCandidateRoleBackDataChoose.branch,
                    }}
                    onChange={(e) => {
                      setSngleCandidateRoleBackDataChoose((prev) => ({
                        ...prev,
                        branch: e.value,
                        designation: "Please Select Designation",
                        jobrole: "Please Select Job Role",
                        jobroleid: "",
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Designation{" "}
                    <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={designation}
                    placeholder="Please Select Designation"
                    value={{
                      label: singleCandidateRoleBackDataChoose.designation,
                      value: singleCandidateRoleBackDataChoose.designation,
                    }}
                    onChange={(e) => {
                      setSngleCandidateRoleBackDataChoose((prev) => ({
                        ...prev,
                        designation: e.value,
                        jobrole: "Please Select Job Role",
                        jobroleid: "",
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Job Role{" "}
                    <b style={{ color: "red", fontWeight: "lighter" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={300}
                    options={jobRole?.filter((opening) => {
                      return (
                        opening.company ===
                          singleCandidateRoleBackDataChoose.company &&
                        opening.branch ===
                          singleCandidateRoleBackDataChoose.branch &&
                        opening.designation ===
                          singleCandidateRoleBackDataChoose.designation
                      );
                    })}
                    placeholder="Please Select Job Role"
                    value={{
                      label: singleCandidateRoleBackDataChoose.jobrole,
                      value: singleCandidateRoleBackDataChoose.jobrole,
                    }}
                    onChange={(e) => {
                      setSngleCandidateRoleBackDataChoose((prev) => ({
                        ...prev,
                        jobrole: e.value,
                        jobroleid: e?.jobid,
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container>
              <Grid item md={1} sm={1}></Grid>
              <Button variant="contained" onClick={createNewCandidate}>
                Update
              </Button>
              <Grid item md={1} sm={1}></Grid>
              <Button sx={userStyle.btncancel} onClick={handleCloseRoleBack}>
                Cancel
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

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

      <Dialog
        open={openMissingFields}
        onClose={handleCloseMissingField}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Typography sx={userStyle.HeaderText}>
              View Candidate Missing Fields
            </Typography>
            <br /> <br />
            <Grid sx={{ display: "flex", justifyContent: "around" }}>
              <Grid>
                <Typography sx={userStyle.SubHeaderText}>
                  Candidate Name: {getDetails?.fullname}
                </Typography>
              </Grid>
            </Grid>
            <br />
            <Grid item md={12} sm={12} xs={12}>
              <br />
              {missingFields
                ?.filter((item) => obj[item])
                ?.map((data) => obj[data]).length > 0 ||
              documentMissingFields.length > 0 ? (
                <>
                  {missingFields
                    .filter(
                      (field) =>
                        obj[field] && !["updatedby", "__v"].includes(field)
                    ) // Filter and check if the field exists in the mapping object
                    .map((field, index) => (
                      <Typography
                        key={`missing-${index}`}
                        sx={{
                          margin: "5px 0",
                          padding: "10px",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "5px",
                          textTransform: "capitalize", // Makes field names more readable
                        }}
                      >
                        {obj[field]}{" "}
                        {/* Display the field name from the mapping */}
                      </Typography>
                    ))}

                  {documentMissingFields.map((field, index) => (
                    <Typography
                      key={`doc-missing-${index}`}
                      sx={{
                        margin: "5px 0",
                        padding: "10px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "5px",
                        textTransform: "capitalize",
                      }}
                    >
                      {field} {/* Display missing document field name */}
                    </Typography>
                  ))}
                </>
              ) : (
                <Typography sx={{ color: "green", fontWeight: "bold" }}>
                  No missing fields
                </Typography>
              )}

              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                }}
              >
                <Button variant="contained" onClick={handleCloseMissingField}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
    </Box>
  );
}

export default InterviewRounds;
