import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, DialogTitle, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import { LinearProgress } from "@mui/material";
import PinIcon from "@mui/icons-material/Pin";
import FormControlLabel from '@mui/material/FormControlLabel';
import "jspdf-autotable";
import axios from "axios";
import Selects from "react-select";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
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
import Headtitle from "../../../components/Headtitle";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import QRCode from 'qrcode';
import LoadingButton from "@mui/lab/LoadingButton";
import { BASE_URL } from "../../../services/Authservice";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Backdrop from '@mui/material/Backdrop';
import { MultiSelect } from "react-multi-select-component";
import CircularProgress from '@mui/material/CircularProgress';
import DOMPurify from 'dompurify';
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

const progressDialogStyles = {
  dialogPaper: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e0e0e0",
  },
  dialogTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e3a8a", // Deep Blue
  },
  checkingText: {
    fontSize: "18px",
    marginBottom: "12px",
    color: "#334155", // Slate-700
  },
  highlightText: {
    fontWeight: "600",
    color: "#2563eb", // Blue-600
  },
  progressBarContainer: {
    background: "#f1f5f9", // Light Slate
    borderRadius: "8px",
    padding: "5px",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
    marginTop: "10px",
  },
  progressBar: {
    height: "16px",
    borderRadius: "8px",
    background: "linear-gradient(to right, #3b82f6, #60a5fa)",
  },
  percentageText: {
    fontSize: "16px",
    marginTop: "10px",
    color: "#475569", // Slate-600
    fontWeight: "bold",
  },
  startButton: {
    background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 2px 10px rgba(59, 130, 246, 0.3)",
  },
};


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

function DocumentPreparation() {
  const [progressValue, setProgressValue] = useState(0); // Progress state
  const [progressOpen, setProgressOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState("");
  const [searchedString, setSearchedString] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const [headvalueAdd, setHeadValueAdd] = useState([]);
  const [selectedHeadOptAdd, setSelectedHeadOptAdd] = useState([]);
  const [employeeModeOptions, setEmployeeModeOptions] = useState([]);
  const [HeaderOptionsButton, setHeaderOptionsButton] = useState(false)

  const handleEmployeeModeOptions = (e) => {
    console.log(e, 'e')
    const employeeModeOpt = e?.employeemode?.length > 0 ?
      [...e?.employeemode?.map(data => ({
        label: data,
        value: data
      })), { label: "Manual", value: "Manual" }]

      :
      [{ label: "Manual", value: "Manual" }]
    setEmployeeModeOptions(employeeModeOpt);
  }


  const handleHeadChangeAdd = (options) => {
    let value = options.map((a) => {
      return a.value;
    })


    if (value?.length === 1 && value?.includes("With Head content")) {
      setDocumentPrepartion((prevArray) => ({
        ...prevArray,
        head: personId?.letterheadcontentheader[0]?.preview,
        foot: ""
      }));
      setHeader(personId?.letterheadcontentheader[0]?.preview)
    }
    else if (value?.length === 1 && value?.includes("With Footer content")) {
      setfooter(personId?.letterheadcontentfooter[0]?.preview)

      setDocumentPrepartion((prevArray) => ({
        ...prevArray,
        head: "",
        foot: personId?.letterheadcontentfooter[0]?.preview
      }));
    }
    else if (value?.length > 1) {
      setDocumentPrepartion((prevArray) => ({
        ...prevArray,
        head: personId?.letterheadcontentheader[0]?.preview,
        foot: personId?.letterheadcontentfooter[0]?.preview
      }));
      setHeader(personId?.letterheadcontentheader[0]?.preview)
      setfooter(personId?.letterheadcontentfooter[0]?.preview)
    }
    else {
      setHeader("")
      setfooter("")
      setDocumentPrepartion((prevArray) => ({
        ...prevArray,
        head: "",
        foot: ""
      }));

    }
    setHeadValueAdd(value)
    setSelectedHeadOptAdd(options)
  }
  const customValueRenderHeadFromAdd = (valueCate) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Letter Head";
  };
  // letter headd options
  const HeaderDropDowns = [{ label: "With Letter Head", value: "With Letter Head" }, { label: "Without Letter Head", value: "Without Letter Head" }];
  const WithHeaderOptions = [{ value: "With Head content", label: "With Head content" }, { value: "With Footer content", label: "With Footer content" }]
  const [isOpenLetterHeadPopup, setIsLetterHeadPopup] = useState(false)
  const [headerOptions, setHeaderOptions] = useState("Please Select Print Options")
  const [pagePopeOpen, setPagePopUpOpen] = useState("")
  const [DataTableId, setDataTableId] = useState("")
  const [selectedHeadOpt, setSelectedHeadOpt] = useState([]);
  const [headvalue, setHeadValue] = useState([]);
  const [emailValuePage, setEmailValuePage] = useState({});
  const handleHeadChange = (options) => {
    let value = options.map((a) => {
      return a.value;
    })
    setHeadValue(value)
    if (!["Preview Manual", "Print Manual"]?.includes(pagePopeOpen)) {
      if (value?.length === 1 && value?.includes("With Head content")) {
        setCheckingArray((prevArray) =>
          prevArray.map((item, ind) =>
            ind === (indexViewQuest - 1) ? {
              ...item,
              header: personId?.letterheadcontentheader[0]?.preview,
              //  footer: personId?.letterheadcontentfooter[0]?.preview 
            } : item
          )
        );
        setHeader(personId?.letterheadcontentheader[0]?.preview)
      }
      else if (value?.length === 1 && value?.includes("With Footer content")) {
        setfooter(personId?.letterheadcontentfooter[0]?.preview)
        setCheckingArray((prevArray) =>
          prevArray.map((item, ind) =>
            ind === (indexViewQuest - 1) ? {
              ...item,
              // header: personId?.letterheadcontentheader[0]?.preview,
              footer: personId?.letterheadcontentfooter[0]?.preview
            } : item
          )
        );
      }
      else if (value?.length > 1) {
        setCheckingArray((prevArray) =>
          prevArray.map((item, ind) =>
            ind === (indexViewQuest - 1) ? {
              ...item,
              header: personId?.letterheadcontentheader[0]?.preview,
              footer: personId?.letterheadcontentfooter[0]?.preview
            } : item
          )
        );
        setHeader(personId?.letterheadcontentheader[0]?.preview)
        setfooter(personId?.letterheadcontentfooter[0]?.preview)
      }
      else {
        setHeader("")
        setfooter("")
        setCheckingArray((prevArray) =>
          prevArray.map((item, ind) =>
            ind === (indexViewQuest - 1) ? {
              ...item,
              header: "",
              footer: ""
            } : item
          )
        );
      }
    }



    setSelectedHeadOpt(options)
  }
  const customValueRenderHeadFrom = (valueCate) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Letter Head";
  };

  const handleClickOpenLetterHeader = (page) => {
    setPagePopUpOpen(page)
    setIsLetterHeadPopup(true);
    handleCloseBulkModcheckbox();
  }

  const handleClickCloseLetterHead = () => {
    setIsLetterHeadPopup(false);
    setHeaderOptions("Please Select Print Options")
    setHeadValue([]);
    setPagePopUpOpen("")
    // setHeader("");
    // setfooter("")
    // setCheckingArray((prevArray) =>
    //   prevArray.map((item, ind) =>
    //     ind === (indexViewQuest - 1) ? {
    //       ...item,
    //       header: "",
    //       footer: ""
    //     } : item
    //   )
    // );
    setSelectedHeadOpt([]);
  }




  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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
  const [indexViewQuest, setIndexViewQuest] = useState(1);
  const [checking, setChecking] = useState("");
  const [checkingArray, setCheckingArray] = useState([]);
  const [monthSets, setMonthsets] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const currentDateAttStatus = new Date();
  const currentYearAttStatus = currentDateAttStatus.getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYearAttStatus - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });
  const [selectedMonthNum, setSelectedMonthNum] = useState(0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [attendanceDateStatus, setAttendanceDateStatus] = useState("")
  const [attendanceMonthStatus, setAttendanceMonthStatus] = useState("")
  const [productionDateStatus, setProductionDateStatus] = useState("")
  const [productionMonthStatus, setProductionMonthStatus] = useState("")
  const [fromEmail, setFromEmail] = useState("");
  const [qrCodeNeed, setQrCodeNeed] = useState(false)

  const [otp, setOtp] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [openOTPView, setOpenOTPView] = useState(false);
  const [error, setError] = useState("");
  const handleViewOpenOTP = () => {
    setOpenOTPView(true);
  };
  const handlViewCloseOTP = () => {
    setOpenOTPView(false);
    setOtp("");
    setError("");
  };

  const verifyOtp = async () => {
    try {
      if (otp != "") {
        let response = await axios.post(`${SERVICE.VERIFYTWOFA_EMPLOYEEAPPROVAL}`, {
          otp: String(otp),
          companyname: isUserRoleAccess.companyname,
        });
        if (response?.data?.success == true) {
          handlViewCloseOTP();
          getViewFile(documentID?.id)
        }
        setError("");
      } else {

        setError("Please Enter OTP");
      }
    } catch (err) {
      if (!err?.response?.data?.success) {
        setError(err?.response?.data?.message)
      }
      console.log(err, 'err')
    }
  };

  const handleMonthChange = (selectedMonth) => {
    const selectedMonthIndex = months.findIndex(month => month.value === selectedMonth.value);
    let updatedYears = getyear;
    setChecking("")

    setProductionDateStatus("")
    setAttendanceDateStatus("")
    setProductionMonthStatus("")
    setChecking("")
    if (selectedMonthIndex > currentMonth) {
      updatedYears = getyear.filter(year => year.value < currentYear);
    }

    setDocumentPrepartion({
      ...documentPrepartion,
      attendancemonth: selectedMonth.value,
      attendanceyear: selectedMonthIndex > currentMonth ? 'Please Select Attendance Year' : 'Please Select Attendance Year',
      signature: "Please Select Signature",
      seal: "Please Select Seal",
    });

    setAvailableYears(updatedYears);
  };
  let newvalReference = `DP000${checkingArray?.length > 0 ? checkingArray?.length + 1 : 1}`;
  const handleYearChange = (selectedYear) => {
    setChecking("")
    setProductionDateStatus("")
    setAttendanceDateStatus("")
    setProductionMonthStatus("")
    setDocumentPrepartion({
      ...documentPrepartion,
      attendanceyear: selectedYear.value,
      signature: "Please Select Signature",
      seal: "Please Select Seal",
    });
    fetchAttendanceMonthStatus(employeeControlPanel, documentPrepartion.attendancemonth, selectedYear.value);
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
      pagename: String("Human Resource/HR Documents/Employee Document Preparation"),
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



  const handleMonthChangeProduction = (selectedMonth) => {
    const selectedMonthIndex = months.findIndex(month => month.value === selectedMonth.value);
    let updatedYears = getyear;
    setChecking("")
    setProductionDateStatus("")
    setAttendanceDateStatus("")
    setAttendanceMonthStatus("")
    setProductionMonthStatus("")
    if (selectedMonthIndex > currentMonth) {
      updatedYears = getyear.filter(year => year.value < currentYear);
    }
    setSelectedMonth(selectedMonth.value)
    setSelectedMonthNum(Number(selectedMonth.ansvalue))
    setDocumentPrepartion({
      ...documentPrepartion,
      productionmonth: selectedMonth.value,
      productionyear: selectedMonthIndex > currentMonth ? 'Please Select Production Year' : 'Please Select Production Year',
      signature: "Please Select Signature",
      seal: "Please Select Seal",
    });

    setAvailableYears(updatedYears);
  };
  const handleYearChangeProduction = (selectedYear) => {
    setChecking("")
    setProductionDateStatus("")
    setAttendanceDateStatus("")
    setAttendanceMonthStatus("")
    setDocumentPrepartion({
      ...documentPrepartion,
      productionyear: selectedYear.value,
      signature: "Please Select Signature",
      seal: "Please Select Seal",
    });
    fetchDepartmentMonthsets(selectedYear.value);
    setSelectedYear(selectedYear.value)
      ;
  };
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  // const [selectmonthname, setSelectMonthName] = useState(currentMonths);


  const fetchDepartmentMonthsets = async (year) => {
    setPageName(!pageName);
    try {
      let res_employee = await axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        monthname: selectedMonth,
        year: year,
      });

      setMonthsets(res_employee.data.departmentdetails);
      await fetchProductionMonthStatus(employeeControlPanel, documentPrepartion?.productionmonth, year, res_employee.data.departmentdetails)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchProductionMonthStatus = async (person, month, year, monthset) => {
    const ans = months?.findIndex(data => data?.value === month)
    let prodFilter = await axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      ismonth: Number(selectedMonthNum),
      isyear: Number(year),
    });

    const nextMonthFirstDay = new Date(Number(selectedYear), Number(selectedMonthNum), 1);

    // Subtract one day to get the last day of the given month
    const lastDate = new Date(nextMonthFirstDay - 1);
    let lastdateOfSelectedMonth = lastDate.getDate();
    let selectedmonthnumalter = Number(selectedMonthNum) <= 9 ? `0${Number(selectedMonthNum)}` : selectedMonthNum;

    let selectedMonStartDate = selectedYear + "-" + selectedmonthnumalter + "-01";
    let dayPointsUser = prodFilter.data.answer?.filter(data => data?.name === person.value);
    let findexp = monthset.find((d) => d?.department === person?.department);
    let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

    let getdayPointsMonth = dayPointsUser
      .filter((d) => d.date >= findDate && d.date <= (findexp ? findexp.todate : lastdateOfSelectedMonth))
      .reduce((acc, current) => {
        const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = acc[existingItemIndex];

          existingItem.point += Number(current.point);
          // existingItem.daypoint += Number(current.daypoint);
          existingItem.target += Number(current.target);
          existingItem.date.push(current.date);

          existingItem.allowancepoint += Number(current.allowancepoint);
          if (current.allowancepoint > 1) {
            existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
          }

          existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

          // Convert the dates array to Date objects
          const dateObjects = existingItem.date.map((date) => new Date(date));

          // Find the earliest (from) and latest (to) dates
          const fromDate = new Date(Math.min(...dateObjects));
          const toDate = new Date(Math.max(...dateObjects));
          // Update start and end date
          existingItem.startDate = fromDate;
          existingItem.endDate = toDate;
        } else {
          // Add new item
          acc.push({
            companyname: current.companyname,
            name: current.name,
            // daypoint: Number(current.daypoint),
            avgpoint: (Number(current.point) / Number(current.target)) * 100,
            point: Number(current.point),
            target: Number(current.target),
            // _id: current.id,
            branch: current.branch,
            date: [current.date],
            unit: current.unit,
            team: current.team,
            empcode: current.empcode,
            // doj: current.doj,
            // department: current.department,
            // prod: current.prod,
            startDate: current.date,
            endDate: current.date,
            allowancepoint: Number(current.allowancepoint),
            // noallowancepoint:Number(current.noallowancepoint),
            noallowancepoint: current.allowancepoint > 0 ? 1 : 0,
          });
        }
        return acc;
      }, []);

    const answer = getdayPointsMonth?.length > 0 ? getdayPointsMonth[0] : ""

    setProductionMonthStatus(answer)

  }


  {/* <CheckingProps person={person} month={month} year={year}/> */ }


  const [availableYears, setAvailableYears] = useState(getyear);
  //  const navigate = useNavigate();
  const generateRedirectUrl = () => {
    return `${BASE_URL}/hrdocuments/templatecreation?data=${encodeURIComponent("Rahul")}`;
  };
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
  const [loadingAttMonth, setLoadingAttMonth] = useState(false);
  const [loadingMessageAttMonth, setLoadingMessageAttMonth] = useState('Fetching Attendance Month Status...!');
  const [loadingAttDate, setLoadingAttDate] = useState(false);
  const [loadingMessageAttDate, setLoadingMessageAttDate] = useState('Fetching Attendance Date Status...!');
  const [loadingProdDate, setLoadingProdDate] = useState(false);
  const [loadingMessageProdDate, setLoadingMessageProdDate] = useState('Fetching Production Date Status...!');
  const [loadingProdMonth, setLoadingProdMonth] = useState(false);
  const [loadingPreviewData, setLoadingPreviewData] = useState(false);
  const [loadingPreviewManualData, setLoadingPreviewManualData] = useState(false);
  const [loadingMessageProdMonth, setLoadingMessageProdMonth] = useState('Fetching Production Month Status...!');
  const [loadingPreviewMessage, setLoadingPreviewMessage] = useState('Setting up a document for preview...!');
  const [loadingPrintData, setLoadingPrintData] = useState(false);
  const [loadingPrintManualData, setLoadingPrintManualData] = useState(false);
  const [loadingPrintMessage, setLoadingPrintMessage] = useState('Preparing an Document to Print...!');
  const [loadingGeneratingDatas, setLoadingGeneratingDatas] = useState(false);
  const [loadingGeneratingMessages, setLoadingGeneratingMessage] = useState('Generating the set of Documents...!');
  const [savingDatasMessage, setSavingDatasMessage] = useState('Generating the set of Documents for Saving...!');
  const [savingDatas, setSavingDatas] = useState(false);

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;
  //useStates
  const [date, setDate] = useState(formattedDate);
  const gridRef = useRef(null);
  // let newvalues = "DOC0001";
  const [DateFormat, setDateFormat] = useState();
  const [attModearr, setAttModearr] = useState([]);
  const [DateFormatEdit, setDateFormatEdit] = useState();
  const [autoId, setAutoId] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [Changed, setChanged] = useState("");
  const [documentPreparationEdit, setDocumentPreparationEdit] = useState([]);
  const [templateCreationArray, setTemplateCreationArray] = useState([]);
  const [noticePeriodEmpCheck, setNoticePeriodEmpCheck] = useState(false);
  const [noticePeriodEmpCheckPerson, setNoticePeriodEmpCheckPerson] = useState(false);
  const [noticePeriodEmpCheckPersonEdit, setNoticePeriodEmpCheckPersonEdit] = useState(false);
  const [noticePeriodEmpCheckEdit, setNoticePeriodEmpCheckEdit] = useState(false);
  const [updateGen, setUpdateGen] = useState(true);
  const [bulkPrintStatus, setBulkPrintStatus] = useState(false);
  const [templateCreationArrayCreate, setTemplateCreationArrayCreate] = useState([]);
  const [templateCreationArrayEdit, setTemplateCreationArrayEdit] = useState([]);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    pageName,
    setPageName,
    buttonStyles,
    isAssignBranch
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [btnload, setBtnLoad] = useState(false);
  const [btnloadSave, setBtnLoadSave] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonLoadingPreview, setButtonLoadingPreview] = useState(false);
  const [buttonLoadingEdit, setButtonLoadingEdit] = useState(false);
  const [attStatus, setAttStatus] = useState([]);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizePdf, setPageSizepdf] = useState("");
  const [pageSizePdfEdit, setPageSizePdfEdit] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [excel, setExcel] = useState([]);
  const [deleteTemplate, setDeleteTemplate] = useState({});
  const [cateCode, setCatCode] = useState([]);
  const [templateCreationDataEdit, setTemplateCreationDataEdit] = useState([]);
  const [cateCodeValue, setCatCodeValue] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [sortingStatus, setSortingStatus] = useState("");
  const [documentPrepartion, setDocumentPrepartion] = useState({
    date: "",
    template: "Please Select Template Name",
    referenceno: "",
    documentname: "",
    templateno: "",
    pagenumberneed: "All Pages",
    employeemode: "Please Select Employee Mode",
    department: "Please Select Department",
    company: "Please Select Company",
    reason: "Document",
    issuingauthority: "Please Select Issuing Authority",
    branch: "Please Select Branch",
    month: "Please Select Month",
    sort: "Please Select Sort",
    attendancedate: "",
    attendancemonth: "Please Select Attendance Month",
    attendanceyear: "Please Select Attendance Year",
    productiondate: "",
    productionmonth: "Please Select Production Month",
    productionyear: "Please Select Production Year",
    unit: "Please Select Unit",
    team: "Please Select Team",
    person: "Please Select Person",
    proption: "Please Select Print Option",
    pagesize: "Please Select pagesize",
    print: "Please Select Print Option",
    heading: "Please Select Header Option",
    signature: "Please Select Signature",
    seal: "Please Select Seal",
    issuedpersondetails: "",
    documentneed: "Print Document",
    printoptions: "Please Select Print Options",
  });


  const months = [
    { value: 'January', label: 'January', ansvalue: "01" },
    { value: 'February', label: 'February', ansvalue: "02" },
    { value: 'March', label: 'March', ansvalue: "03" },
    { value: 'April', label: 'April', ansvalue: "04" },
    { value: 'May', label: 'May', ansvalue: "05" },
    { value: 'June', label: 'June', ansvalue: "06" },
    { value: 'July', label: 'July', ansvalue: "07" },
    { value: 'August', label: 'August', ansvalue: "08" },
    { value: 'September', label: 'September', ansvalue: "09" },
    { value: 'October', label: 'October', ansvalue: "10" },
    { value: 'November', label: 'November', ansvalue: "11" },
    { value: 'December', label: 'December', ansvalue: "12" }
  ];
  const [items, setItems] = useState([]);
  //  const [employees, setEmployees] = useState([]);
  const [departmentCheck, setDepartmentCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [agendaEdit, setAgendaEdit] = useState("");
  const [head, setHeader] = useState("");
  const [foot, setfooter] = useState("");
  const [signature, setSignature] = useState("");
  const [signatureContent, setSignatureContent] = useState("");
  const [signatureStatus, setSignatureStatus] = useState("");
  const [sealStatus, setSealStatus] = useState("");
  const [signatureStatusEdit, setSignatureStatusEdit] = useState("");
  const [sealStatusEdit, setSealStatusEdit] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [sealPlacement, setSealPlacement] = useState("");
  const [waterMarkText, setWaterMarkText] = useState("");
  const [signatureEdit, setSignatureEdit] = useState("");
  const [companyNameEdit, setCompanyNameEdit] = useState("");
  const [sealPlacementEdit, setSealPlacementEdit] = useState("");
  const [waterMarkTextEdit, setWaterMarkTextEdit] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  // const [openPopup, setOpenPopup] = useState(false);


  const [overallExcelDatas, setOverallExcelDatas] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

  const [isInfoOpenImage, setInfoOpenImage] = useState(false)
  const [previewManual, setPreviewManual] = useState(false)
  const [isInfoOpenImageManual, setInfoOpenImageManual] = useState(false)
  const [isInfoOpenImagePrint, setInfoOpenImagePrint] = useState(false)
  const [isInfoOpenImagePrintManual, setInfoOpenImagePrintManual] = useState(false)

  const handleClickOpenInfoImage = () => {
    setInfoOpenImage(true);
  };
  const handleCloseInfoImage = () => {
    setInfoOpenImage(false);
  };
  const handleClickOpenInfoImageManual = () => {
    setInfoOpenImageManual(true);
  };
  const handleCloseInfoImageManual = () => {
    setInfoOpenImageManual(false);
  };
  const handleClickOpenInfoImagePrint = () => {

    setInfoOpenImagePrint(true);
  };
  const handleCloseInfoImagePrint = () => {
    setInfoOpenImagePrint(false);
    setButtonLoading(false)
    setLoadingPrintData(false)
  };
  const handleOpenPreviewManual = () => {
    setPreviewManual(true);
  };
  const handleClosePreviewManual = () => {
    setPreviewManual(false);
  };
  const handleClickOpenInfoImagePrintManual = () => {
    setInfoOpenImagePrintManual(true);
  };
  const handleCloseInfoImagePrintManual = () => {
    setInfoOpenImagePrintManual(false);
  };

  const [openDialogManual, setOpenDialogManual] = useState(false)
  const handleClickOpenManualCheck = () => {
    setOpenDialogManual(true);
  };
  const handleCloseManualCheck = () => {
    setOpenDialogManual(false);
  };
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };



  // AssignBranch For Users
  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];
        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }


        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  let exportColumnNames = [
    'Date ',
    'Reference No',
    'Template No',
    'Template',
    'EmployeeMode',
    'Department',
    'Company',
    'Branch',
    'Unit',
    'Team',
    'Person',
    'Printing Status',
    'Issued Person Details',
    'Issuing Authority'
  ];
  let exportRowValues = [
    'date',
    'referenceno',
    'templateno',
    'template',
    'employeemode',
    'department',
    'company',
    'branch',
    'unit',
    'team',
    'person',
    'printingstatus',
    'issuedpersondetails',
    'issuingauthority'
  ];



  const [headEdit, setHeaderEdit] = useState("");
  const [footEdit, setfooterEdit] = useState("");


  function encryptString(str) {
    if (str) {
      const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const shift = 3; // You can adjust the shift value as per your requirement
      let encrypted = "";
      for (let i = 0; i < str.length; i++) {
        let charIndex = characters.indexOf(str[i]);
        if (charIndex === -1) {
          // If character is not found, add it directly to the encrypted string
          encrypted += str[i];
        } else {
          // Shift the character index
          charIndex = (charIndex + shift) % characters.length;
          encrypted += characters[charIndex];
        }
      }
      return encrypted;
    }
    else {
      return ""
    }

  }


  // const employeeModeOptions = [
  //   { value: "Current List", label: "Current List" },
  //   { value: "Absconded", label: "Absconded" },
  //   { value: "Releave Employee", label: "Releave Employee" },
  //   { value: "Hold", label: "Hold" },
  //   { value: "Terminate", label: "Terminate" },
  //   { value: "Postponed", label: "Postponed" },
  //   { value: "Rejected", label: "Rejected" },
  //   { value: "Closed", label: "Closed" },
  //   { value: "Not Joined", label: "Not Joined" },
  //   { value: "Manual", label: "Manual" },
  // ];


  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    date: true,
    referenceno: true,
    templateno: true,
    template: true,
    employeemode: true,
    department: true,
    company: true,
    printingstatus: true,
    branch: true,
    unit: true,
    team: true,
    person: true,
    head: true,
    foot: true,
    headvaluetext: true,
    email: true,
    document: true,
    issuedpersondetails: true,
    issuingauthority: true,
    actions: true,
    approval: true,
    printoptions: true,
    printupdation: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  useEffect(() => {
    addSerialNumber(templateCreationArrayCreate);
  }, [templateCreationArrayCreate]);



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
    setBtnLoad(false)
    setBtnLoadSave(false)
  };
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
    setAgendaEdit("");
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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
  const username = isUserRoleAccess.companyname;
  // Manage Columns
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
  const [isDeleteOpenBulkcheckbox, setIsDeleteOpenBulkcheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const [isDeleteBulkOpenalert, setIsDeleteBulkOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };

  const handleClickOpenBulkcheckbox = () => {
    setIsDeleteOpenBulkcheckbox(true);
  };
  const handleCloseBulkModcheckbox = () => {
    setIsDeleteOpenBulkcheckbox(false);
  };

  const handleClickOpenBulkalert = () => {
    if (selectedRows?.length === 0) {
      setIsDeleteBulkOpenalert(true);
    } else {
      const selectedData = rowDataTable?.filter(data => selectedRows?.includes(data?.id));

      if (selectedData.length > 0) {
        const isSameCompanyAndBranch = selectedData.every(
          data => data.company === selectedData[0]?.company && data.branch === selectedData[0]?.branch
        );

        if (!isSameCompanyAndBranch) {
          setPopupContentMalert("Please Choose Data with the Same Company and Branch!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Prevents further execution
        }
        TemplateDropdownsValueManual(selectedData[0].company, selectedData[0].branch);
        setIsDeleteOpenBulkcheckbox(true)

      }
    }
  };



  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  const handleCloseBulkModalert = () => {
    setIsDeleteBulkOpenalert(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [templateValues, setTemplateValues] = useState([]);
  const [templateCreationValue, setTemplateCreationValue] = useState("");
  const [templateCreationValueEdit, setTemplateCreationValueEdit] = useState("");
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [employeeValue, setEmployeeValue] = useState([]);
  const [employeeUserName, setEmployeeUserName] = useState("");
  const [CompanyOptions, setCompanyOptions] = useState([]);
  const [BranchOptions, setBranchOptions] = useState([]);
  const [BranchOptionsEdit, setBranchOptionsEdit] = useState([]);
  const [allBranch, setAllBranch] = useState("");
  const [allBranchValue, setAllBranchValue] = useState(false);
  const [UnitOptions, setUnitOptions] = useState([]);
  const [TeamOptions, setTeamOptions] = useState([]);
  const [employeenames, setEmployeenames] = useState([]);

  const [employeeMode, setEmployeeMode] = useState("");

  const TemplateDropdowns = async () => {
    const accessbranchs = accessbranch
      ? accessbranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : [];
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.EMPLOYEE_TEMPLATECREATION, {
        assignbranch: accessbranchs
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateValues(
        res?.data?.templatecreation.map((data) => ({
          ...data,
          label: `${data.name}--(${data.company}--${data.branch})`,
          value: `${data.name}--(${data.company}--${data.branch})`,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const TemplateDropdownsValue = async (e, control) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: control?.company,
        branch: control?.branch,
      });

      setPageSizepdf(e?.pagesize)
      handlePagenameChange(e.pagesize)
      if (res?.data?.templatecontrolpanel) {
        // const answer = res?.data?.templatecontrolpanel?.length > 0 ? res?.data?.templatecontrolpanel?.find(data => data?.company === control?.company && data?.branch === control?.branch) : ""

        const ans = res?.data?.templatecontrolpanel ?
          res?.data?.templatecontrolpanel?.templatecontrolpanellog[res?.data?.templatecontrolpanel?.templatecontrolpanellog?.length - 1] : "";
        setPersonId(ans)
        setFromEmail(ans?.fromemail)
        setCompanyName(ans)
        // if (e.headvalue?.includes("With Head content")) {
        //   setHeader(ans?.letterheadcontentheader[0]?.preview)
        // }
        // if (e.headvalue?.includes("With Footer content")) {
        //   setfooter(ans?.letterheadcontentfooter[0]?.preview)
        // }
        setWaterMarkText(ans?.letterheadbodycontent[0].preview)
        setSignatureStatus(e?.signature)
        setSealStatus(e?.seal)
        setGenerateData(false)
      } else {
        setGenerateData(true)
        setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }


    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const TemplateDropdownsValueManual = async (company, branch) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company,
        branch: branch,
      });
      if (res?.data?.templatecontrolpanel) {

        const ans = res?.data?.templatecontrolpanel ?
          res?.data?.templatecontrolpanel?.templatecontrolpanellog[res?.data?.templatecontrolpanel?.templatecontrolpanellog?.length - 1] : "";
        setPersonId(ans)
      } else {
        setGenerateData(true)
        setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }


    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const TemplateManualDropDowns = async (e, mode, company, branch) => {
    setPageName(!pageName);
    try {
      if (mode === 'Manual') {
        let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: company,
          branch: branch,
        });

        // setHeadValue(e?.headvalue);
        setPageSizepdf(e.pagesize)
        handlePagenameChange(e.pagesize)

        const ans = res?.data?.templatecontrolpanel ?
          res?.data?.templatecontrolpanel?.templatecontrolpanellog[res?.data?.templatecontrolpanel?.templatecontrolpanellog?.length - 1] : "";
        setPersonId(ans)
        setFromEmail(ans?.fromemail)

        setCompanyName(ans)
        // if (e.headvalue?.includes("With Head content")) {
        //   setHeader(ans?.letterheadcontentheader[0]?.preview)
        // }
        // if (e.headvalue?.includes("With Footer content")) {
        //   setfooter(ans?.letterheadcontentfooter[0]?.preview)
        // }
        setWaterMarkText(ans?.letterheadbodycontent[0].preview)
        setSignatureStatus(e.signature)
        setSealStatus(e.seal)
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  //Reason for Sending Mail for an Person
  const fetchAttendanceDateStatus = async (person, date) => {
    setPageName(!pageName);
    try {
      setLoadingAttDate(true)
      let res = await fetchUsersStatus(person, date);
      const rowDataTable = res?.flatMap((item, index) => {
        return {
          id: item.id,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          team: item.team,
          department: item.department,
          username: item.username,
          empcode: item.empcode,
          weekoff: item.weekoff,
          boardingLog: item.boardingLog,
          shiftallot: item.shiftallot,
          shift: item.shift,
          date: item.date,
          shiftmode: item.shiftMode,
          // printoptions: item.printoptions,

        };
      });

      const answerDate = rowDataTable?.length > 0 ? rowDataTable[0]?.daystatus : ""
      setLoadingAttDate(false)
      setAttendanceDateStatus(answerDate)
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  //get all Sub vendormasters.
  const fetchAttedanceStatus = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setAttStatus(res_vendor?.data?.attendancestatus);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }
  useEffect(() => {
    fetchAttedanceStatus();
  }, []);

  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
    })
    return result[0]?.name
  }

  const getattendancestatusmonth = (clockinstatus, clockoutstatus) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === clockinstatus && data?.clockoutstatus === clockoutstatus
    })
    return result[0]?.name
  }
  //get all Attendance Status name.
  const fetchAttMode = async () => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttModearr(res_freq?.data?.allattmodestatus);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchAttMode();
  }, [sortingStatus, availableYears]);
  const getAttModeLop = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.lop === true ? 'YES' : 'No';
  }
  const getAttModeLopType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.loptype
  }
  const getCount = (rowlopstatus) => {
    if (rowlopstatus === 'YES - Double Day') {
      return '2'
    } else if (rowlopstatus === 'YES - Full Day') {
      return '1';
    } else if (rowlopstatus === 'YES - Half Day') {
      return '0.5'
    } else {
      return '0';
    }
  }


  const getAttModeTarget = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.target === true ? 'YES' : 'No';
  }

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.paidleave === true ? 'YES' : 'No';
  }

  const getAttModePaidPresentType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus
    })
    return result[0]?.paidleavetype;
  }
  const getFinalLop = (rowlop, rowloptype) => {
    return (rowloptype === undefined || rowloptype === "") ? rowlop : (rowlop + ' - ' + rowloptype);
  }

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

  const getFinalPaid = (rowpaid, rowpaidtype) => {
    return (rowpaidtype === undefined || rowpaidtype === "") ? rowpaid : (rowpaid + ' - ' + rowpaidtype);
  }

  const getAssignLeaveDayForPaid = (rowpaidday) => {
    if (rowpaidday === 'YES - Double Day') {
      return '2'
    } else if (rowpaidday === 'YES - Full Day') {
      return '1';
    } else if (rowpaidday === 'YES - Half Day') {
      return '0.5'
    } else {
      return '0';
    }
  }
  // get all users
  const fetchUsersStatus = async (person, date) => {

    let startMonthDate = new Date(date);
    let endMonthDate = new Date(date);

    const daysArray = [];
    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayCount = startMonthDate.getDate();
      const shiftMode = 'Main Shift';
      const weekNumberInMonth = (getWeekNumberInMonth(startMonthDate) === 1 ? `${getWeekNumberInMonth(startMonthDate)}st Week` :
        getWeekNumberInMonth(startMonthDate) === 2 ? `${getWeekNumberInMonth(startMonthDate)}nd Week` :
          getWeekNumberInMonth(startMonthDate) === 3 ? `${getWeekNumberInMonth(startMonthDate)}rd Week` :
            getWeekNumberInMonth(startMonthDate) > 3 ? `${getWeekNumberInMonth(startMonthDate)}th Week` : '')

      daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_DOC_PREPARATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        person: person

      });



      // setUserShifts(res?.data?.finaluser.filter(item => item !== null));
      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });

      let leaveresult = res_applyleave?.data?.applyleaves;

      let countByEmpcodeClockin = {}; // Object to store count for each empcode
      let countByEmpcodeClockout = {};

      const itemsWithSerialNumber = res?.data?.finaluser?.map((item, index) => {
        // Initialize count for empcode if not already present
        if (!countByEmpcodeClockin[item.empcode]) {
          countByEmpcodeClockin[item.empcode] = 1;
        }
        if (!countByEmpcodeClockout[item.empcode]) {
          countByEmpcodeClockout[item.empcode] = 1;
        }

        // Adjust clockinstatus based on lateclockincount
        let updatedClockInStatus = item.clockinstatus;
        // Adjust clockoutstatus based on earlyclockoutcount
        let updatedClockOutStatus = item.clockoutstatus;

        // Filter out only 'Absent' items for the current employee
        const absentItems = res?.data?.finaluser?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

        // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
        if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
          // Define the date format for comparison
          const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

          const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
          const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

          const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
          const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

          if (isPreviousDayLeave) {
            updatedClockInStatus = 'AfterWeekOffLeave';
            updatedClockOutStatus = 'AfterWeekOffLeave';
          }
          if (isPreviousDayAbsent) {
            updatedClockInStatus = 'AfterWeekOffAbsent';
            updatedClockOutStatus = 'AfterWeekOffAbsent';
          }
          if (isNextDayLeave) {
            updatedClockInStatus = 'BeforeWeekOffLeave';
            updatedClockOutStatus = 'BeforeWeekOffLeave';
          }
          if (isNextDayAbsent) {
            updatedClockInStatus = 'BeforeWeekOffAbsent';
            updatedClockOutStatus = 'BeforeWeekOffAbsent';
          }
        }

        // Check if 'Late - ClockIn' count exceeds the specified limit
        if (updatedClockInStatus === 'Late - ClockIn') {
          updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
          countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
        }
        // Check if 'Early - ClockOut' count exceeds the specified limit
        if (updatedClockOutStatus === 'Early - ClockOut') {
          updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
          countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
        }

        return {
          ...item,
          clockinstatus: updatedClockInStatus,
          clockoutstatus: updatedClockOutStatus,
        };
      });

      return itemsWithSerialNumber;
    } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const fetchAttendanceMonthStatus = async (person, month, year) => {
    setLoadingAttMonth(true)
    let ans = months.findIndex(dat => dat.value === month)
    setPageName(!pageName);
    try {
      let res_usershift = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER_DOCPREP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(person.company),
        branch: String(person.branch),
        unit: String(person.unit),
        department: person.department,
        ismonth: ans + 1,
        isyear: year,
        username: person?.username
      });

      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });

      let leaveresult = res_applyleave?.data?.applyleaves;
      let countByEmpcodeClockin = {}; // Object to store count for each empcode
      let countByEmpcodeClockout = {}

      let result = res_usershift?.data?.finaluser.flatMap((item, index) => {

        // Initialize count for empcode if not already present
        if (!countByEmpcodeClockin[item.empcode]) {
          countByEmpcodeClockin[item.empcode] = 1;
        }
        if (!countByEmpcodeClockout[item.empcode]) {
          countByEmpcodeClockout[item.empcode] = 1;
        }

        // Adjust clockinstatus based on lateclockincount
        let updatedClockInStatus = item.clockinstatus;
        // Adjust clockoutstatus based on earlyclockoutcount
        let updatedClockOutStatus = item.clockoutstatus;

        // Filter out only 'Absent' items for the current employee
        const absentItems = res_usershift?.data?.finaluser?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

        // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
        if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
          // Define the date format for comparison
          const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

          const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
          const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

          const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
          const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

          if (isPreviousDayLeave) {
            updatedClockInStatus = 'AfterWeekOffLeave';
            updatedClockOutStatus = 'AfterWeekOffLeave';
          }
          if (isPreviousDayAbsent) {
            updatedClockInStatus = 'AfterWeekOffAbsent';
            updatedClockOutStatus = 'AfterWeekOffAbsent';
          }
          if (isNextDayLeave) {
            updatedClockInStatus = 'BeforeWeekOffLeave';
            updatedClockOutStatus = 'BeforeWeekOffLeave';
          }
          if (isNextDayAbsent) {
            updatedClockInStatus = 'BeforeWeekOffAbsent';
            updatedClockOutStatus = 'BeforeWeekOffAbsent';
          }
        }

        // Check if 'Late - ClockIn' count exceeds the specified limit
        if (updatedClockInStatus === 'Late - ClockIn') {
          updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
          countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
        }
        // Check if 'Early - ClockOut' count exceeds the specified limit
        if (updatedClockOutStatus === 'Early - ClockOut') {
          updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
          countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
        }
        return {
          ...item,
          shiftallot: item.shiftallot,
          weekOffDates: item.weekOffDates,
          clockinstatus: updatedClockInStatus,
          clockoutstatus: updatedClockOutStatus,
          totalnumberofdays: item.totalnumberofdays,
          empshiftdays: item.empshiftdays,
          totalcounttillcurrendate: item.totalcounttillcurrendate,
          totalshift: item.totalshift,
          attendanceauto: getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus),
          daystatus: item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus),
          lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
          loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
          lopcalculation: getFinalLop(
            getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
            getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus))
          ),
          lopcount: getCount(
            getFinalLop(
              getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
              getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus))
            )
          ),
          modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
          paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
          paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
          paidpresent: getFinalPaid(
            getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
            getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus))
          ),
          paidpresentday: getAssignLeaveDayForPaid(
            getFinalPaid(
              getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus)),
              getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatusmonth(updatedClockInStatus, updatedClockOutStatus))
            )
          ),
        }
      })

      const finalresult = [];
      result.forEach(item => {
        const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);
        const existingEntryIndex = finalresult.findIndex(entry => entry.empcode === item.empcode);
        if (existingEntryIndex !== -1) {
          finalresult[existingEntryIndex].shift++;

          if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.clockin === '00:00:00' && item.clockout === '00:00:00') {
            finalresult[existingEntryIndex].weekoff++;
          }

          if (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') {
            finalresult[existingEntryIndex].holidayCount++;
          }

          if (leaveOnDateApproved) {
            finalresult[existingEntryIndex].leaveCount++;

          }

          if (item.attendanceauto === undefined && item.daystatus === undefined) {
            finalresult[existingEntryIndex].nostatuscount++;
          }

          finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
          finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));

        } else {

          const newItem = {
            id: item.id,
            empcode: item.empcode,
            username: item.username,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            totalnumberofdays: item.totalnumberofdays,
            empshiftdays: item.empshiftdays,
            shift: 1,
            weekoff: (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,
            lopcount: item.lopcount,
            paidpresentday: item.paidpresentday,
            totalcounttillcurrendate: item.totalcounttillcurrendate,
            totalshift: item.totalshift,
            holidayCount: (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') ? 1 : 0,

            leaveCount: leaveOnDateApproved ? 1 : 0,
            clsl: 0,
            holiday: 0,
            totalpaiddays: 0,
            nostatus: 0,
            nostatuscount: (item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No') ? 1 : 0,
          };
          finalresult.push(newItem);
        }
      });
      const rowDataTable = finalresult?.flatMap((item, index) => {
        return {
          id: item.id,
          userid: item.userid,
          serialNumber: index + 1,
          company: item.company,
          branch: item.branch,
          unit: item.unit,
          team: item.team,
          department: item.department,
          username: item.username,
          empcode: item.empcode,
          totalnumberofdays: item.totalnumberofdays,
          empshiftdays: item.empshiftdays,
          totalcounttillcurrendate: item.totalcounttillcurrendate,
          shift: item.shift,
          totalshift: item.totalshift,
          clsl: item.leaveCount,
          weekoff: item.weekoff,
          holiday: item.holidayCount,
          paidpresentday: Number(item.paidpresentday) - (Number(item.weekoff) + Number(item.holidayCount) + Number(item.leaveCount)),
          lopcount: item.lopcount,
          totalpaiddays: Number(item.paidpresentday) > Number(item.shift) ? (Number(item.shift) - Number(item.lopcount)) : Number(item.paidpresentday),
          nostatuscount: item.nostatuscount
        }
      });

      const finalAnswer = rowDataTable?.length > 0 ? rowDataTable[0]?.lopcount : ""
      setAttendanceMonthStatus(finalAnswer);
      setLoadingAttMonth(false);
    } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }



  // Fetching PRoduction Date Wise Report 
  const fetchProductionDateStatus = async (person, date) => {
    setPageName(!pageName);
    try {
      setLoadingProdDate(true)
      let res_applyleave = await axios.post(SERVICE.PRODUCTION_DATE_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        user: person,
        date: date
      });
      const answer = res_applyleave?.data?.daypointsupload?.length > 0 ? res_applyleave?.data?.daypointsupload[0] : ""
      setProductionDateStatus(answer)
      setLoadingProdDate(false)
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

  }


  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedEmployeeValues, setSelectedEmployeeValues] = useState([]);

  const handleEmployeeChange = (options) => {
    const uniqueEntries = options?.filter((item, index, self) =>
      index === self.findIndex((t) =>
        t.company === item.company &&
        t.branch === item.branch
      )
    );
    if (uniqueEntries?.length > 1) {
      setSelectedEmployee([])

      setPopupContentMalert("Employee's have different company and branch.Please Select Users With same company and same branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }
    else if (uniqueEntries?.length === 0) {
      setSelectedEmployee([])
    }
    else if (uniqueEntries?.length === 1) {
      TemplateDropdownsValue(templateCreationValue, uniqueEntries[0])
      IdentifyUserCode(uniqueEntries[0])

      setSelectedEmployee(options);
      let ans = options?.flatMap((a, index) => {
        return a.value;
      })

      // CheckNoticePeriodMulti(ans);
      setEmployeeControlPanel(uniqueEntries[0])
      setSelectedEmployeeValues(ans);
    }

  };

  const customValueRendererEmployee = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
  };



  const [uniqueCode, setUniqueCode] = useState("")

  const IdentifyUserCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.DOCUMENT_PREPARATION_CODES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: e.company,
        branch: e.branch,
        unit: e.unit,
        team: e.team
      });

      setUniqueCode(res?.data?.documentPreparation)

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const IdentifyUserCodeEdit = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.DOCUMENT_PREPARATION_CODES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: e.company,
        branch: e.branch,
        unit: e.unit,
        team: e.team
      });
      // const value = res?.data?.documentPreparation + "_" + e?.team?.slice(0, 3) + "_" + templateCreationValueEdit + "_" + cateCode;
      const value = res?.data?.documentPreparation + e?.team?.slice(0, 3) + "#" + templateCreationValueEdit + "_" + cateCode;
      setCatCodeValue(value)


    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const [issuingauthority, setIssuingAutholrity] = useState([])
  const fetchIsssuingAuthority = async (e, val) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.ASSIGNINTERVIEW_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: documentPrepartion.company === "Please Select Company" ? "" : documentPrepartion.company,
        branch: documentPrepartion.branch === "Please Select Branch" ? "" : documentPrepartion.branch,
        unit: documentPrepartion.unit === "Please Select Unit" ? "" : documentPrepartion.unit,
        department: e.value,
        type: val,
        team: e.value,
      });
      //Need to do that to compare company , branch , unit , team
      const answer = res?.data?.user

      setIssuingAutholrity(answer?.length > 0 ? answer.map(Data => ({
        ...Data,
        label: Data.companyname,
        value: Data.companyname
      })) : [])
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchIsssuingAuthorityManual = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.ASSIGNINTERVIEW_FILTER_MANUAL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: documentPrepartion.company === "Please Select Company" ? "" : documentPrepartion.company,
        branch: e,
        type: "Branch"
      });
      //Need to do that to compare company , branch , unit , team
      const answer = res?.data?.user

      setIssuingAutholrity(answer?.length > 0 ? answer.map(Data => ({
        ...Data,
        label: Data.companyname,
        value: Data.companyname
      })) : [])
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };





  const DepartDropDowns = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        res?.data?.departmentdetails.map((data) => ({
          ...data,
          label: data.deptname,
          value: data.deptname,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const CompanyDropDowns = async () => {
    setPageName(!pageName);
    try {
      setCompanyOptions(accessbranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const BranchDropDowns = async (e) => {
    setPageName(!pageName);
    try {

      setBranchOptions(accessbranch?.filter(
        (comp) =>
          e.value === comp.company
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };



  const UnitDropDowns = (e) => {
    setPageName(!pageName);
    try {
      let resdata = accessbranch?.filter(
        (comp) =>
          e === comp.branch
      )?.map(data => ({
        label: data.unit,
        value: data.unit,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      })
      const unitall = [
        { label: "ALL", value: "ALL" },
        ...resdata];

      setUnitOptions(unitall);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const extractEmailFormat = async (name, id) => {
    const suser = await axios.post(SERVICE.USER_NAME_SEARCH, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      name: name
    });

    const userFind = suser?.data?.users?.length > 0 ? suser?.data?.users[0] : "none";
    const tempcontpanel = await axios.post(SERVICE.TEMPLATECONTROLPANEL_USERFIND, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      user: userFind
    });
    let convert = tempcontpanel?.data?.result[0]?.emailformat;
    let fromemail = tempcontpanel?.data?.result[0]?.fromemail;
    let ccemail = tempcontpanel?.data?.result[0]?.ccemail;
    let bccemail = tempcontpanel?.data?.result[0]?.bccemail;

    setPersonId(tempcontpanel?.data?.result[0]);
    handleClickOpenLetterHeader('Email');
    setEmailValuePage({ id, convert, fromemail, ccemail, bccemail })
    // await fetchEmailForUser(emailValuePage?.id, emailValuePage?.convert, emailValuePage?.fromemail, emailValuePage?.ccemail, emailValuePage?.bccemail)

  }


  const fetchTeam = async (e) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let result = e === "ALL" ? res_type.data.teamsdetails.filter((d) => d.branch === allBranch) : res_type.data.teamsdetails.filter((d) => d.unit === e && d.branch === allBranch);

      const teamall = [
        { label: "ALL", value: "ALL" },
        ...result.map((d) => ({
          ...d,
          label: d.teamname,
          value: d.teamname,
        })),
      ];

      setTeamOptions(teamall);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchTeamNames = async (e, mode) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.post(SERVICE.USERNAMES_EMP_DOCUMENT_DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: e,
        resonablestatus: mode
      });

      let usersEmployeemode = res_type.data.userteamgroup?.length > 0 ? res_type.data.userteamgroup : [];
      setEmployeenames(
        usersEmployeemode?.map((data) => ({
          // ...data,
          label: data.companyname,
          value: data.companyname,
          company: data.company,
          branch: data.branch,
          unit: data.unit,
          username: data.username,
          team: data.team,
          department: data.department
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };



  //get all Employeename.
  const fetchAllEmployee = async (e) => {

    setPageName(!pageName);
    try {
      let res_module = await axios.post(SERVICE.USERNAMES_EMP_DOCUMENT_TEAM, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: documentPrepartion.company === "Please Select Company" ? "" : documentPrepartion.company,
        branch: documentPrepartion.branch === "Please Select Branch" ? "" : documentPrepartion.branch,
        unit: documentPrepartion.unit === "Please Select Unit" ? "" : documentPrepartion.unit,
        team: e.value,
        resonablestatus: employeeMode
      });
      let usersEmployeemode = res_module?.data?.userteamgroup?.length > 0 ? res_module?.data?.userteamgroup : []

      setEmployeenames(
        usersEmployeemode?.map((data) => ({
          // ...data,
          label: data.companyname,
          value: data.companyname,
          company: data.company,
          branch: data.branch,
          unit: data.unit,
          username: data.username,
          team: data.team,
          department: data.department
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };



  const pagesizeoptions = [
    { value: "A3", label: "A3" },
    { value: "A4", label: "A4" },
    { value: "Certificate", label: "Certificate" },
    { value: "Certificate1", label: "Certificate1" },
    { value: "Envelope", label: "Envelope" }
  ];


  const [agendaEditStyles, setAgendaEditStyles] = useState({});
  const handlePagenameChange = (format) => {

    if (format === "A3") {
      setAgendaEditStyles({ width: "297mm", height: "420mm" });
    }
    else if (format === "A4") {
      setAgendaEditStyles({ width: "210mm", height: "297mm" });
    }
    else if (format === "Certificate") {
      setAgendaEditStyles({ width: "297mm", height: "180mm" });
    }
    else if (format === "Certificate1") {
      setAgendaEditStyles({ width: "297mm", height: "200mm" });
    }
    else if (format === "Envelope") {
      setAgendaEditStyles({ width: "220mm", height: "110mm" });
    }

  }



  // Helper function to create header element
  const createHeaderElement = (headContent) => {
    const headerElement = document.createElement("div");
    headerElement.innerHTML = `
    <div  style="text-align: center;">
      ${headContent}
    </div>
  `;
    return headerElement;
  };

  // Helper function to create footer element
  const createFooterElement = (footContent) => {
    const footerElement = document.createElement("div");
    footerElement.innerHTML = `
    <div style="text-align: center;" >
       ${footContent}
    </div>
  `;
    return footerElement;
  };
  // Helper function to create header element
  const createHeaderElementEdit = (headContent) => {
    const headerElement = document.createElement("div");
    headerElement.innerHTML = `
    <div style="text-align: center;">
      ${headContent}
    </div>
  `;
    return headerElement;
  };

  // Helper function to create footer element
  const createFooterElementEdit = (footContent) => {
    const footerElement = document.createElement("div");
    footerElement.innerHTML = `
    <div style="text-align: center;" >
       ${footContent}
    </div>
  `;
    return footerElement;
  };




  const [generateData, setGenerateData] = useState(false)
  const [imageUrl, setImageUrl] = useState('');
  const [personId, setPersonId] = useState('');
  const [imageUrlEdit, setImageUrlEdit] = useState('');
  let Allcodedata = `${BASE_URL}/document/documentpreparation/${encryptString(documentPrepartion.person)}/${personId ? personId?._id : ""}/${encryptString(documentPrepartion?.issuingauthority)}/${DateFormat}/${isUserRoleAccess?._id}`

  let AllcodedataEdit = `${BASE_URL}/document/documentpreparation/${encryptString(documentPreparationEdit.person)}/${companyNameEdit?._id}/${encryptString(documentPreparationEdit?.issuingauthority)}/${DateFormatEdit}`


  const generateQrCode = async () => {
    setPageName(!pageName);
    try {
      const response = await QRCode.toDataURL(`${Allcodedata}`);
      setImageUrl(response);
    } catch (error) {

    }
  }
  const generateQrCodeEdit = async () => {
    setPageName(!pageName);
    try {
      const response = await QRCode.toDataURL(` ${AllcodedataEdit}`);
      setImageUrlEdit(response);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  useEffect(() => {
    generateQrCode();
  }, [Allcodedata])

  useEffect(() => {
    generateQrCodeEdit();
  }, [documentPreparationEdit, companyNameEdit])


  const handleNextPage = () => {
    setIndexViewQuest(indexViewQuest + 1);
  };

  const handlePrevPage = () => {
    setIndexViewQuest(indexViewQuest - 1);
  };
  const HandleDeleteText = (index) => {
    const updatedTodos = [...checkingArray];
    updatedTodos.splice(index, 1);
    setCheckingArray(updatedTodos);
    if (updatedTodos.length > 0) {
      setIndexViewQuest(1);
    }
    else {
      setIndexViewQuest(0);
    }
  };
  const [emailUser, setEmailUser] = useState("");
  const [userESignature, setUserESignature] = useState("");

  const [employeeControlPanel, setEmployeeControlPanel] = useState("");

  const fetchAllRaisedTickets = async () => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.get(SERVICE.DOCUMENT_PREPARATION_AUTOID, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let refNo = res_queue?.data?.documentPreparation?.length > 0 ?
        res_queue?.data?.documentPreparation[0]?.templateno :
        uniqueCode + employeeControlPanel?.team?.slice(0, 3) + "#" + templateCreationValue?.tempcode + "_" + "0000";
      let codenum = refNo.split("_");
      return codenum;


    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };




  const answerDefine = async (person, index) => {
    let employeename = employeeMode === "Manual" ? "" : (person ? person : employeeValue);
    const constAuotId = await fetchAllRaisedTickets();
    let prefixLength = Number(constAuotId[1]) + (employeeControlPanel ? (index + 1) : 1);
    let prefixString = String(prefixLength);
    let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ?
      `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString.length == 4 ?
        `0${prefixString}` : prefixString.length == 5 ? `0${prefixString}`
          : prefixString.length == 6 ? `0${prefixString}` : prefixString.length == 7 ? `0${prefixString}` :
            prefixString.length == 8 ? `0${prefixString}` : prefixString.length == 9 ? `0${prefixString}` : prefixString.length == 10 ? `0${prefixString}` : prefixString


    let newval = employeeControlPanel ? uniqueCode + employeeControlPanel?.team?.slice(0, 3) + "#" + templateCreationValue?.tempcode + "_" + postfixLength :
      "Man" + "#" + ((templateCreationValue?.tempcode === "" || templateCreationValue?.tempcode === undefined) ? ""
        : templateCreationValue?.tempcode) + "_" + postfixLength;
    let newvalRefNo = `DP_${postfixLength}`;
    const accessbranchs = accessbranch
      ? accessbranch.map((data) => ({
        branch: data.branch,
        company: data.company,
      }))
      : [];
    setPageName(!pageName);
    try {

      const [res, res_emp, res_emp_break, userDetails] = await Promise.all([
        axios.post(SERVICE.EMPLOYEE_TEMPLATECREATION, {
          assignbranch: accessbranchs,
        }, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.USER_STATUS_ANSWERDEFINE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          employeename
        }),
        axios.get(SERVICE.SHIFT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(`${SERVICE.USER_ESIGNATURE_FILTER}`, {
          companyname: employeename
        }
        )
      ])
      const userESignature = userDetails?.data?.semployeesignature ? userDetails?.data?.semployeesignature?.signatureimage : ""
      setUserESignature(userESignature)
      let matches = documentPrepartion?.template?.replaceAll("(", "")?.replaceAll(")", "")?.split("--");
      let format = res?.data?.templatecreation?.find((data) => data.company === matches[1] && data.branch === matches[2] && data?.name === documentPrepartion?.template?.split("--")[0]);
      let employee = res_emp?.data?.usersstatus;
      setEmailUser(employee?.email)

      let employeeBreak = res_emp_break?.data?.shifts.find((data) => data?.name === employee?.shifttiming);
      let convert = format?.pageformat;
      const tempElement = document?.createElement("div");
      tempElement.innerHTML = convert;

      const listItems = Array.from(tempElement.querySelectorAll("li"));
      listItems.forEach((li, index) => {
        li.innerHTML = `${index + 1}. ${li.innerHTML}\n`;
      });

      // tempElement.appendChild(createFooterElementImage());
      let texted = tempElement.innerHTML;
      setLoadingGeneratingDatas(false);
      if (employeeMode === "Manual") {
        let findMethod = texted
          .replaceAll("$UNIID$", newval ? newval : "");
        setChecking(findMethod)

      }
      else {
        let caddress = `<br>${!employee?.cdoorno ? "" : employee?.cdoorno + ", "}${!employee?.cstreet ? "" : employee?.cstreet + ", "}${!employee?.carea ? "" : employee?.carea + ", "}
    <br>${!employee?.clandmark ? "" : employee?.clandmark + ", "}${!employee?.ctaluk ? "" : employee?.ctaluk + ", "}${!employee?.cpost ? "" : employee?.cpost + ", "}
    <br>${!employee?.ccity ? "" : employee?.ccity + ", "}${!employee?.cstate ? "" : employee?.cstate + ", "}${!employee?.ccountry ? "" : employee?.ccountry + ", "}${!employee?.cpincode ? "" : "- " + employee?.cpincode}`;

        let GenderHeShe = (employee?.gender !== "" || employee?.gender !== undefined)
          ? employee?.gender === "Male" ? "He" : employee?.gender === "Female" ? "She" : "He/She" : "He/She";

        let GenderHeShesmall = (employee?.gender !== "" || employee?.gender !== undefined)
          ? employee?.gender === "Male" ? "he" : employee?.gender === "Female" ? "she" : "he/she" : "he/she";

        let GenderHimHer = (employee?.gender !== "" || employee?.gender !== undefined)
          ? employee?.gender === "Male" ? "him" : employee?.gender === "Female" ? "her" : "him/her" : "him/her";



        let paddress = `<br>${!employee?.pdoorno ? "" : employee?.pdoorno + ", "}${!employee?.pstreet ? "" : employee?.pstreet + ", "}${!employee?.parea ? "" : employee?.parea + ", "}
    <br>${!employee?.plandmark ? "" : employee?.plandmark + ", "}${!employee?.ptaluk ? "" : employee?.ptaluk + ", "}${!employee?.ppost ? "" : employee?.ppost + ", "}
    <br>${!employee?.pcity ? "" : employee?.pcity + ", "}${!employee?.pstate ? "" : employee?.pstate + ", "}${!employee?.pcountry ? "" : employee?.pcountry + ", "}
    ${!employee?.ppincode ? "" : "- " + employee?.ppincode}`;

        let findMethod = texted
          .replaceAll("$LEGALNAME$", employee?.legalname ? employee?.legalname : "")
          .replaceAll("$DOB$", employee?.dob ? employee?.dob : "")
          .replaceAll("$C:ADDRESS$", caddress)
          .replaceAll("$LOGIN$", employee?.username ? employee?.username : "")
          .replaceAll("$GENDERHIM/HER$", GenderHimHer)
          .replaceAll("$SALUTATION$", employee?.prefix ? employee?.prefix : "Mr/Ms")
          .replaceAll("$P:ADDRESS$", paddress)
          .replaceAll("$F.COMPANY$", "")
          .replaceAll("$F.BRANCH$", "")
          .replaceAll("$F.BRANCHADDRESS$", "")
          .replaceAll("$T.COMPANY$", "")
          .replaceAll("$T.COMPANYADDRESS$", "")
          .replaceAll("$GENDERHE/SHE$", GenderHeShe)
          .replaceAll("$GENDERHE/SHE/SMALL$", GenderHeShesmall)
          .replaceAll("$EMAIL$", employee?.email ? employee?.email : "")
          .replaceAll("$P:NUMBER$", employee?.contactpersonal ? employee?.contactpersonal : "")
          .replaceAll("$DOJ$", employee?.doj ? employee?.doj : "")
          .replaceAll("$EMPCODE$", employee?.empcode ? employee?.empcode : "")
          .replaceAll("$BRANCH$", employee?.branch ? employee?.branch : "")
          .replaceAll("$UNIT$", employee?.unit ? employee?.unit : "")
          .replaceAll("$DESIGNATION$", employee?.designation ? employee?.designation : "")
          .replaceAll("$C:NAME$", employee?.companyname ? employee?.companyname : "")
          .replaceAll("$TEAM$", employee?.team ? employee?.team : "")
          .replaceAll("$PROCESS$", employee?.process ? employee?.process : "")
          .replaceAll("$DEPARTMENT$", employee?.department ? employee.department : "")
          .replaceAll("$LWD$", employee?.reasondate ? employee?.reasondate : "")
          .replaceAll("$SHIFT$", employee?.shifttiming ? employee?.shifttiming : "")
          .replaceAll("$AC:NAME$", employee?.accname ? employee?.accname : "")
          .replaceAll("$AC:NUMBER$", employee?.accno ? employee?.accno : "")
          .replaceAll("$IFSC$", employee?.ifsc ? employee?.ifsc : "")
          .replaceAll("$AC:NUMBER$", employee?.accno ? employee?.accno : "")
          .replaceAll("$C:DATE$", date)
          .replaceAll("$C:TIME$", new Date().toLocaleTimeString())
          .replaceAll("$BREAK$", employeeBreak?.breakhours ? employeeBreak?.breakhours : "")
          .replaceAll("$F:NAME$", employee?.firstname ? employee?.firstname : "")
          .replaceAll("$L:NAME$", employee?.lastname ? employee?.lastname : "")
          .replaceAll("$WORKSTATION:NAME$", employee?.workstation ? employee?.workstation : "")
          .replaceAll("$WORKSTATION:COUNT$", employee?.workstation ? employee?.workstation?.length : "")
          .replaceAll("$SYSTEM:COUNT$", employee?.employeecount ? employee?.employeecount : "")
          .replaceAll("$UNIID$", newval ? newval : "")
          .replaceAll("$ATTENDANCEDATE$", attendanceDateStatus ? attendanceDateStatus : "")
          .replaceAll("$ATTENDANCEMONTH$", attendanceMonthStatus ? attendanceMonthStatus : "")
          .replaceAll("$PRODUCTIONDATEPOINT$", productionDateStatus ? productionDateStatus?.point : "")
          .replaceAll("$PRODUCTIONDATETARGET$", productionDateStatus ? productionDateStatus?.target : "")
          .replaceAll("$PRODUCTIONMONTHTARGET$", productionMonthStatus ? productionMonthStatus?.target : "")
          .replaceAll("$PRODUCTIONMONTHPOINT$", productionMonthStatus ? productionMonthStatus?.point : "")
          .replaceAll("$RSEAL$", sealPlacement ? `
            <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;" />
            ` : "")
          .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
              <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
      ${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
          <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
        ` : "")
          .replaceAll("$EMPLOYEESIGNATURE$", userESignature ? `
          <span style="position: relative; display: inline-block;">
              <img src="${userESignature}" alt="Signature" 
                  style="
                      position: absolute;
                      z-index: 10;
                      ${pageSizePdf === 'A3' ?
              'width: 200px !important; height: 30px !important; top: -25px;' :
              'width: 130px !important; height: 25px !important; top: -25px;'}
                      pointer-events: none;
                      background: transparent;
                  "
              />
          </span>
      ` : "")

        // .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
        // <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
        //      ` : "")
        //      .replaceAll("$EMPLOYEESIGNATURE$", userESignature ? `
        //       <span style="display: inline-flex; flex-direction: column; align-items: center; text-align: center;">
        //           <img src="${userESignature}" alt="Signature" style="${pageSizePdf === 'A3' ? 'width: 200px !important; height: 30px !important;' : 'width: 130px !important; height: 25px !important;'}"/>
        //       </span>
        //   ` : "");

        const answer = [];
        answer.push({
          empname: person,
          template: documentPrepartion?.template,
          documentname: documentPrepartion?.documentname,
          issuingauthority: documentPrepartion?.issuingauthority,
          department: String(documentPrepartion.department),
          company: employee?.company ? String(employee?.company) : String(documentPrepartion.company),
          branch: employee?.branch ? String(employee?.branch) : String(documentPrepartion.branch),
          unit: employee?.unit ? String(employee?.unit) : String(documentPrepartion.unit),
          team: employee?.team ? String(employee?.team) : String(documentPrepartion.team),
          autoid: newval,
          employeemode: String(documentPrepartion.employeemode),
          data: findMethod,
          referenceno: newvalRefNo,
          pagenumberneed: String(documentPrepartion.pagenumberneed),
          documentneed: String(documentPrepartion.documentneed),
          proption: String(documentPrepartion.proption),
          email: employee?.email,
          tempcode: templateCreationValue?.tempcode,
          watermark: waterMarkText,
          qrcodeNeed: qrCodeNeed,
          qrcode: imageUrl,
          signature: signature,
          seal: sealPlacement,
          frommailemail: fromEmail,
          pageheight: agendaEditStyles.height,
          pagewidth: agendaEditStyles.width,
          printoptions: documentPrepartion?.printoptions,
          header: head,
          footer: foot,
          headvalue: headvalueAdd,
          pagesize: pageSizePdf,
          sign: documentPrepartion.signature,
          sealing: documentPrepartion.seal,
          orientation: agendaEditStyles.orientation
        })
        setCheckingArray((prev) => [...prev, ...answer]);
        setIndexViewQuest(1)

      }
      setDocumentPrepartion({
        ...documentPrepartion,
        person: "Please Select Person",
        pagenumberneed: "All Pages",
        issuingauthority: "Please Select Issuing Authority",
        sort: "Please Select Sort",
        attendancedate: "",
        // documentneed: "Print Document",
        attendancemonth: "Please Select Attendance Month",
        attendanceyear: "Please Select Attendance Year",
        productiondate: "",
        productionmonth: "Please Select Production Month",
        productionyear: "Please Select Production Year",
        proption: "Please Select Print Option",
        pagesize: "Please Select pagesize",
        print: "Please Select Print Option",
        heading: "Please Select Header Option",
        signature: "Please Select Signature",
        seal: "Please Select Seal",
      });
      setSelectedEmployeeValues([])
      setSelectedEmployee([])
      setIndexViewQuest(1)
    }
    catch (err) { setLoadingGeneratingDatas(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const value = uniqueCode + employeeControlPanel?.team?.slice(0, 3) + "#" + templateCreationValue?.tempcode;
  const handlePrintDocument = (index) => {
    if (documentPrepartion?.documentneed !== "Employee Approval" && headerOptions === "Please Select Print Options") {
      // setButtonLoadingPreview(false);
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion?.documentneed !== "Employee Approval" && headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setPopupContentMalert("Please Select With Letter Head!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (generateData) {
      setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setButtonLoading(true)
      setLoadingPrintData(true);

      setHeaderOptionsButton(true);
      downloadPdfTesdtCheckTrue(index).then((isMultiPage) => {
        setHeaderOptionsButton(false);
        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoading(false)
          setLoadingPrintData(false)
          setHeaderOptionsButton(false);
          setPopupContentMalert(`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
            ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          setButtonLoading(false)
          handleClickOpenInfoImagePrint();

        }

      }).catch((error) => {
        console.error('Error generating PDF:', error);
      })
    }
  }
  const handlePrintDocumentManual = () => {
    if (documentPrepartion?.documentneed !== "Employee Approval" && headerOptions === "Please Select Print Options") {
      setButtonLoadingPreview(false);
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion?.documentneed !== "Employee Approval" && headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setPopupContentMalert("Please Select With Letter Head!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$EMPLOYEESIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0) {
      setPopupContentMalert("Fill All the Fields Which starts From $ and Ends with $");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();

    }
    else if (generateData) {
      setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setLoadingPrintManualData(true)
      setButtonLoading(true)
      downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {

        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoading(false)
          setLoadingPrintManualData(false)
          setPopupContentMalert(`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
            ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          setButtonLoading(false)
          handleClickOpenInfoImagePrintManual();

        }

      }).catch((error) => {
        console.error('Error generating PDF:', error);
      })
    }
  }


  const downloadPdfTesdt = (index) => {
    setButtonLoading(true)
    // Create a new div element to hold the Quill content
    const pdfElement = document.createElement("div");
    pdfElement.innerHTML = checkingArray[index]?.data;
    const pdfElementHead = document.createElement("div");
    pdfElementHead.innerHTML = checkingArray[index]?.header;
    // Add custom styles to the PDF content
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
      .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
      .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
      .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
      .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
      .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
      .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
      .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
      .ql-align-right { text-align: right; } 
      .ql-align-left { text-align: left; } 
      .ql-align-center { text-align: center; } 
      .ql-align-justify { text-align: justify; } 
    `;


    pdfElement.appendChild(styleElement);


    // Create a watermark element
    const watermarkElement = document.createElement("div");
    watermarkElement.style.position = "absolute";
    watermarkElement.style.left = "0";
    watermarkElement.style.top = "0";
    watermarkElement.style.width = "100%";
    watermarkElement.style.height = "100%";
    watermarkElement.style.display = "flex";
    watermarkElement.style.alignItems = "center";
    watermarkElement.style.justifyContent = "center";
    watermarkElement.style.opacity = "0.09"; // Adjust the opacity as needed
    watermarkElement.style.pointerEvents = "none"; // Make sure the watermark doesn't interfere with user interactions

    // Create and append an image element
    const watermarkImage = document.createElement("img");
    watermarkImage.src = checkingArray[index]?.watermark; // Replace "path_to_your_image" with the actual path to your image
    watermarkImage.style.width = "75%"; // Adjust the width of the image
    watermarkImage.style.height = "50%"; // Adjust the height of the image
    watermarkImage.style.objectFit = "contain"; // Adjust the object-fit property as needed

    watermarkElement.appendChild(watermarkImage);
    const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
      const totalPages = doc.internal.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Add header
        doc.setFontSize(12);
        // doc.text(convertToNumberedList(head), pageWidth / 2, 10, { align: 'center' });
        const headerImgWidth = pageWidth * 0.95; // Adjust as needed
        const headerImgHeight = pageHeight * 0.09; // Adjust as needed
        const headerX = 5; // Start from the left
        const headerY = 3.5; // Start from the top
        doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

        if (head !== "") {
          const imgWidth = pageWidth * 0.50;
          const imgHeight = pageHeight * 0.25;
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2 - 20;
          doc.setFillColor(0, 0, 0, 0.1);
          doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
        }
        // Add footer
        doc.setFontSize(10);
        // Add footer image stretched to page width
        const footerImgWidth = pageWidth * 0.95; // Stretch to full page width
        const footerImgHeight = pageHeight * 0.067; // Adjust height as needed
        const footerX = 5; // Start from the left
        const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3); // Position at the bottom
        doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
        if (checkingArray[index]?.pagenumberneed === "All Pages") {
          const textY = footerY - 3;
          doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
        } else if (checkingArray[index]?.pagenumberneed === "End Page" && i === totalPages) {
          const textY = footerY - 3;
          doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
        }
        if (checkingArray[index]?.qrcodeNeed) {
          // Add QR code and statement only on the last page
          if (i === totalPages) {
            // Add QR code in the left corner
            const qrCodeWidth = 25; // Adjust as needed
            const qrCodeHeight = 25; // Adjust as needed
            const qrCodeX = footerX; // Left corner
            const qrCodeY = footerY - qrCodeHeight - 15; // 15 units above the footer image
            doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);




            // Add statement on the right of the QR code
            const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
            const statementY1 = qrCodeY + 10; // Align with the top of the QR code
            const statementY2 = statementY1 + 5; // Adjust as needed for spacing
            const statementY3 = statementY2 + 5; // Adjust as needed for spacing

            // Add statements
            const statementText1 = '1. Scan to verify the authenticity of this document.';
            const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
            const statementText3 = `3. For questions, contact us at ${checkingArray[index]?.frommailemail}.`;

            doc.setFontSize(12);
            doc.text(statementText1, statementX, statementY1);
            doc.text(statementText2, statementX, statementY2);
            doc.text(statementText3, statementX, statementY3);
          }
          // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
        }

      }
    };
    // Convert the HTML content to PDF
    if (pdfElement) {
      html2pdf()
        .from(pdfElement)
        .set({
          margin: checkingArray[index]?.pagesize == "A3"
            ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
              : (head === "" && foot !== "") ? [20, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
              : (head === "" && foot !== "") ? [15, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: {
            unit: "mm",
            format: [
              parseFloat(checkingArray[index]?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
              parseFloat(checkingArray[index]?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
            ],
            orientation: checkingArray[index]?.orientation || "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
          },
          lineHeight: 0, // Increased line spacing
          fontSize: 12,
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }).toPdf().get('pdf').then((pdf) => {
          // Convert the watermark image to a base64 string
          const img = new Image();
          img.src = waterMarkText;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = 0.1;
            ctx.drawImage(img, 0, 0);
            const watermarkImage = canvas.toDataURL('image/png');
            // Add QR code image
            const qrImg = new Image();
            qrImg.src = checkingArray[index]?.qrcodeNeed ? checkingArray[index]?.qrcode : ''; // QR code image URL
            if (checkingArray[index]?.qrcodeNeed) {
              qrImg.onload = () => {
                const qrCanvas = document.createElement('canvas');
                qrCanvas.width = qrImg.width;
                qrCanvas.height = qrImg.height;
                const qrCtx = qrCanvas.getContext('2d');
                qrCtx.drawImage(qrImg, 0, 0);
                const qrCodeImage = qrCanvas.toDataURL('image/png');
                // Add page numbers, watermark, and QR code to each page
                addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
                // Save the PDF
                pdf.save(`${checkingArray[index]?.template}_${checkingArray[index]?.empname}.pdf`);
                setLoadingPrintData(false)
                setButtonLoading(false)
                setHeaderOptionsButton(false);
                handleCloseInfoImagePrint();
                handleClickCloseLetterHead();
              }
            }
            else {
              addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
              // Save the PDF
              pdf.save(`${checkingArray[index]?.template}_${checkingArray[index]?.empname}.pdf`);
              setLoadingPrintData(false)
              setButtonLoading(false)
              setHeaderOptionsButton(false);
              handleCloseInfoImagePrint();
              handleClickCloseLetterHead();
            }

          };
        }).catch((error) => {
          console.error("Error generating PDF:", error);
          setButtonLoading(false);
        });
    }



  };
  const downloadPdfTesdtManual = () => {
    setLoadingPrintMessage("Document is ready to print...")
    setButtonLoading(true)
    // Create a new div element to hold the Quill content
    const pdfElement = document.createElement("div");
    pdfElement.innerHTML = checking;
    let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
        <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;" />
        ` : "")
      .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
          <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
  ${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
      <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
    ` : "")
      .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
      <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
           ` : "")
    pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
    const pdfElementHead = document.createElement("div");
    pdfElementHead.innerHTML = head;


    // Add custom styles to the PDF content
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
      .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
      .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
      .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
      .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
      .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
      .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
      .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
      .ql-align-right { text-align: right; } 
      .ql-align-left { text-align: left; } 
      .ql-align-center { text-align: center; } 
      .ql-align-justify { text-align: justify; } 
    `;


    pdfElement.appendChild(styleElement);


    // Create a watermark element
    const watermarkElement = document.createElement("div");
    watermarkElement.style.position = "absolute";
    watermarkElement.style.left = "0";
    watermarkElement.style.top = "0";
    watermarkElement.style.width = "100%";
    watermarkElement.style.height = "100%";
    watermarkElement.style.display = "flex";
    watermarkElement.style.alignItems = "center";
    watermarkElement.style.justifyContent = "center";
    watermarkElement.style.opacity = "0.09"; // Adjust the opacity as needed
    watermarkElement.style.pointerEvents = "none"; // Make sure the watermark doesn't interfere with user interactions

    // Create and append an image element
    const watermarkImage = document.createElement("img");
    watermarkImage.src = waterMarkText; // Replace "path_to_your_image" with the actual path to your image
    watermarkImage.style.width = "75%"; // Adjust the width of the image
    watermarkImage.style.height = "50%"; // Adjust the height of the image
    watermarkImage.style.objectFit = "contain"; // Adjust the object-fit property as needed

    watermarkElement.appendChild(watermarkImage);

    const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
      const totalPages = doc.internal.getNumberOfPages();
      const margin = 15; // Adjust as needed
      const footerHeight = 15; // Adjust as needed
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        const headerImgWidth = pageWidth * 0.95;
        const headerImgHeight = pageHeight * 0.09;
        const headerX = 5;
        const headerY = 3.5;
        doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

        const imgWidth = pageWidth * 0.50;
        const imgHeight = pageHeight * 0.25;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2 - 20;
        doc.setFillColor(0, 0, 0, 0.1);
        doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);

        doc.setFontSize(10);
        const footerImgWidth = pageWidth * 0.95;
        const footerImgHeight = pageHeight * 0.067;
        const footerX = 5;
        const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
        doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
        if (documentPrepartion?.pagenumberneed === "All Pages") {
          const textY = footerY - 3;
          doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
        } else if (documentPrepartion?.pagenumberneed === "End Page" && i === totalPages) {
          const textY = footerY - 3;
          doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
        }


        if (qrCodeNeed) {
          if (i === totalPages) {
            const qrCodeWidth = 25;
            const qrCodeHeight = 25;
            const qrCodeX = footerX;
            const qrCodeY = footerY - qrCodeHeight - 4;
            doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

            const statementX = qrCodeX + qrCodeWidth + 10;
            const statementY1 = qrCodeY + 10;
            const statementY2 = statementY1 + 5;
            const statementY3 = statementY2 + 5;

            const statementText1 = '1. Scan to verify the authenticity of this document.';
            const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
            const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

            doc.setFontSize(12);
            doc.text(statementText1, statementX, statementY1);
            doc.text(statementText2, statementX, statementY2);
            doc.text(statementText3, statementX, statementY3);
          }
        }
        const contentAreaHeight = pageHeight - footerHeight - margin;
      }
    };





    // Convert the HTML content to PDF
    html2pdf()
      .from(pdfElement)
      .set({
        margin: pageSizePdf == "A3"
          ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
            : (head === "" && foot !== "") ? [20, 15, 45, 15]
              : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                [20, 15, 20, 15])

          :
          ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
            : (head === "" && foot !== "") ? [15, 15, 45, 15]
              : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: [
            parseFloat(agendaEditStyles.width) || 210, // Default to A4 width (210mm) if width is not defined or invalid
            parseFloat(agendaEditStyles.height) || 297 // Default to A4 height (297mm) if height is not defined or invalid
          ],
          orientation: agendaEditStyles.orientation || "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
        },
        lineHeight: 0, // Increased line spacing
        fontSize: 12,
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }).toPdf().get('pdf').then((pdf) => {
        // Convert the watermark image to a base64 string
        const img = new Image();
        img.src = waterMarkText;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.globalAlpha = 0.1;
          ctx.drawImage(img, 0, 0);
          const watermarkImage = canvas.toDataURL('image/png');


          // Add QR code image
          const qrImg = new Image();
          qrImg.src = qrCodeNeed ? imageUrl : ''; // QR code image URL
          if (qrCodeNeed) {
            qrImg.onload = () => {
              const qrCanvas = document.createElement('canvas');
              qrCanvas.width = qrImg.width;
              qrCanvas.height = qrImg.height;
              const qrCtx = qrCanvas.getContext('2d');
              qrCtx.drawImage(qrImg, 0, 0);
              const qrCodeImage = qrCanvas.toDataURL('image/png');

              // Add page numbers, watermark, and QR code to each page
              addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

              // Save the PDF
              pdf.save(`${documentPrepartion.template}_${documentPrepartion.person}.pdf`);
              setLoadingPrintManualData(false)
              setButtonLoading(false)
              handleCloseInfoImagePrint();
            };
          }
          else {

            // Add page numbers, watermark, and QR code to each page
            addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");

            // Save the PDF
            pdf.save(`${documentPrepartion.template}_${documentPrepartion.person}.pdf`);
            setLoadingPrintManualData(false)
            setButtonLoading(false)
            handleCloseInfoImagePrint();
          }

        };
      });
    setInfoOpenImagePrintManual(false);


  };



  const handlePreviewDocument = (index) => {
    if (documentPrepartion?.documentneed !== "Employee Approval" && headerOptions === "Please Select Print Options") {
      setButtonLoadingPreview(false);
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion?.documentneed !== "Employee Approval" && headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setPopupContentMalert("Please Select With Letter Head!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (generateData) {
      setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setButtonLoadingPreview(true);
      setLoadingPreviewData(true);
      handleClickCloseLetterHead();
      setHeaderOptionsButton(true)
      downloadPdfTesdtCheckTrue(index).then((isMultiPage) => {

        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoadingPreview(false)
          setPreviewManual(true)
          setLoadingPreviewData(false)
          setHeaderOptionsButton(false)
        }
        else {
          setLoadingPreviewData(true)
          setPreviewManual(false)
          setButtonLoadingPreview(true);
          // Create a new div element to hold the Quill content
          const pdfElement = document.createElement("div");
          pdfElement.innerHTML = checkingArray[index]?.data;
          const pdfElementHead = document.createElement("div");
          pdfElementHead.innerHTML = checkingArray[index]?.header;

          // Add custom styles to the PDF content
          const styleElement = document.createElement("style");
          styleElement.textContent = `
                .ql-indent-1 { margin-left: 75px; }
                .ql-indent-2 { margin-left: 150px; }
                .ql-indent-3 { margin-left: 225px; }
                .ql-indent-4 { margin-left: 275px; }
                .ql-indent-5 { margin-left: 325px; }
                .ql-indent-6 { margin-left: 375px; }
                .ql-indent-7 { margin-left: 425px; }
                .ql-indent-8 { margin-left: 475px; }
                .ql-align-right { text-align: right; }
                .ql-align-left { text-align: left; }
                .ql-align-center { text-align: center; }
                .ql-align-justify { text-align: justify; }
              `;

          pdfElement.appendChild(styleElement);

          // Create a watermark element
          const watermarkElement = document.createElement("div");
          watermarkElement.style.position = "absolute";
          watermarkElement.style.left = "0";
          watermarkElement.style.top = "0";
          watermarkElement.style.width = "100%";
          watermarkElement.style.height = "100%";
          watermarkElement.style.display = "flex";
          watermarkElement.style.alignItems = "center";
          watermarkElement.style.justifyContent = "center";
          watermarkElement.style.opacity = "0.09";
          watermarkElement.style.pointerEvents = "none";

          const watermarkImage = document.createElement("img");
          watermarkImage.src = checkingArray[index]?.watermark;
          watermarkImage.style.width = "75%";
          watermarkImage.style.height = "50%";
          watermarkImage.style.objectFit = "contain";

          watermarkElement.appendChild(watermarkImage);

          const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
            const totalPages = doc.internal.getNumberOfPages();
            const margin = 15; // Adjust as needed
            const footerHeight = 15; // Adjust as needed
            for (let i = 1; i <= totalPages; i++) {
              doc.setPage(i);
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();

              doc.setFontSize(12);
              if (checkingArray[index]?.header !== "") {
                const headerImgWidth = pageWidth * 0.95;
                const headerImgHeight = pageHeight * 0.09;
                const headerX = 5;
                const headerY = 3.5;
                doc.addImage(checkingArray[index]?.header, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);
              }

              if (checkingArray[index]?.header !== "") {
                const imgWidth = pageWidth * 0.50;
                const imgHeight = pageHeight * 0.25;
                const x = (pageWidth - imgWidth) / 2;
                const y = (pageHeight - imgHeight) / 2 - 20;
                doc.setFillColor(0, 0, 0, 0.1);
                doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
              }

              doc.setFontSize(10);

              const footerImgWidth = pageWidth * 0.95;
              const footerImgHeight = pageHeight * 0.067;
              const footerX = 5;
              const footerY = (pageHeight * 1) - (checkingArray[index]?.footer === "" ? 15 : footerImgHeight - 3);
              doc.addImage(checkingArray[index]?.footer, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);


              if (checkingArray[index]?.pagenumberneed === "All Pages") {
                const textY = footerY - 3;
                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
              } else if (checkingArray[index]?.pagenumberneed === "End Page" && i === totalPages) {
                const textY = footerY - 3;
                doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
              }


              if (checkingArray[index]?.qrcodeNeed) {
                if (i === totalPages) {
                  const qrCodeWidth = 25;
                  const qrCodeHeight = 25;
                  const qrCodeX = footerX;
                  const qrCodeY = footerY - qrCodeHeight - 4;
                  doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                  const statementX = qrCodeX + qrCodeWidth + 10;
                  const statementY1 = qrCodeY + 10;
                  const statementY2 = statementY1 + 5;
                  const statementY3 = statementY2 + 5;

                  const statementText1 = '1. Scan to verify the authenticity of this document.';
                  const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                  const statementText3 = `3. For questions, contact us at ${checkingArray[index]?.frommailemail}.`;

                  doc.setFontSize(12);
                  doc.text(statementText1, statementX, statementY1);
                  doc.text(statementText2, statementX, statementY2);
                  doc.text(statementText3, statementX, statementY3);
                }
              }
              const contentAreaHeight = pageHeight - footerHeight - margin;
            }
          };

          html2pdf()
            .from(pdfElement)
            .set({
              margin: checkingArray[index]?.pagesize == "A3"
                ? ((checkingArray[index]?.header !== "" && (checkingArray[index]?.footer !== "")) ? [45, 15, 45, 15]
                  : (checkingArray[index]?.header === "" && checkingArray[index]?.footer !== "") ? [20, 15, 45, 15]
                    : (checkingArray[index]?.header !== "" && checkingArray[index]?.footer === "") ? [45, 15, 20, 15] :
                      [20, 15, 20, 15])

                :
                ((checkingArray[index]?.header !== "" && (checkingArray[index]?.footer !== "")) ? [30, 15, 45, 15]
                  : (checkingArray[index]?.header === "" && checkingArray[index]?.footer !== "") ? [15, 15, 45, 15]
                    : (checkingArray[index]?.header !== "" && checkingArray[index]?.footer === "") ? [30, 15, 15, 15] : [15, 15, 15, 15]),
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: {
                unit: "mm",
                format: [
                  parseFloat(checkingArray[index]?.pagewidth) || 210,
                  parseFloat(checkingArray[index]?.pageheight) || 297
                ],
                orientation: checkingArray[index]?.orientation || "portrait"
              },
              lineHeight: 0,
              fontSize: 12,
              pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            })
            .toPdf()
            .get('pdf')
            .then((pdf) => {
              const img = new Image();
              img.src = waterMarkText;
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.globalAlpha = 0.1;
                ctx.drawImage(img, 0, 0);
                const watermarkImage = canvas.toDataURL('image/png');

                const qrImg = new Image();
                qrImg.src = checkingArray[index]?.qrcodeNeed ? checkingArray[index]?.qrcode : ''; // QR code image URL
                if (checkingArray[index]?.qrcodeNeed) {
                  qrImg.onload = () => {
                    const qrCanvas = document.createElement('canvas');
                    qrCanvas.width = qrImg.width;
                    qrCanvas.height = qrImg.height;
                    const qrCtx = qrCanvas.getContext('2d');
                    qrCtx.drawImage(qrImg, 0, 0);
                    const qrCodeImage = qrCanvas.toDataURL('image/png');
                    // Add page numbers, watermark, and QR code to each page
                    addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
                    const pdfBlob = pdf.output('blob');
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    const printWindow = window.open(pdfUrl);
                    setLoadingPrintData(false)
                    setButtonLoading(false)
                    handleCloseInfoImagePrint();
                  }
                }
                else {
                  addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
                  const pdfBlob = pdf.output('blob');
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  const printWindow = window.open(pdfUrl);
                  setLoadingPrintData(false)
                  setButtonLoading(false)
                  handleCloseInfoImagePrint();
                }
              };
            });
          setLoadingPreviewData(false)
        }
        setHeaderOptionsButton(false)
        setButtonLoadingPreview(false);
        setLoadingPreviewData(false);
        // setHeader("")
        // setfooter("")
        // setCheckingArray((prevArray) =>
        //   prevArray.map((item, ind) =>
        //     ind === (indexViewQuest - 1) ? {
        //       ...item,
        //       header: "",
        //       footer: ""
        //     } : item
        //   )
        // );
      }).catch((error) => {
        setHeaderOptionsButton(false)
        setButtonLoadingPreview(false);
        setLoadingPreviewData(false)
        console.error('Error generating PDF:', error);
      })
    }
  };

  const handlePreviewDocumentManual = () => {
    if (documentPrepartion?.documentneed !== "Employee Approval" && headerOptions === "Please Select Print Options") {
      setButtonLoadingPreview(false);
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion?.documentneed !== "Employee Approval" && headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setPopupContentMalert("Please Select With Letter Head!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$EMPLOYEESIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0) {
      setPopupContentMalert("Fill All the Fields Which starts From $ and Ends with $");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (generateData) {
      setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setLoadingPreviewManualData(true)
      setButtonLoadingPreview(true)
      downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {
        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoadingPreview(false)
          setPreviewManual(true)
          setLoadingPreviewManualData(false)
        }
        else {
          setPreviewManual(false)
          setButtonLoadingPreview(true);
          // Create a new div element to hold the Quill content
          const pdfElement = document.createElement("div");
          pdfElement.innerHTML = checking;
          let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
                <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;" />
                ` : "")
            .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
                  <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
          ${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
              <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
            ` : "");


          pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
          const pdfElementHead = document.createElement("div");
          pdfElementHead.innerHTML = head;

          // Add custom styles to the PDF content
          const styleElement = document.createElement("style");
          styleElement.textContent = `
                .ql-indent-1 { margin-left: 75px; }
                .ql-indent-2 { margin-left: 150px; }
                .ql-indent-3 { margin-left: 225px; }
                .ql-indent-4 { margin-left: 275px; }
                .ql-indent-5 { margin-left: 325px; }
                .ql-indent-6 { margin-left: 375px; }
                .ql-indent-7 { margin-left: 425px; }
                .ql-indent-8 { margin-left: 475px; }
                .ql-align-right { text-align: right; }
                .ql-align-left { text-align: left; }
                .ql-align-center { text-align: center; }
                .ql-align-justify { text-align: justify; }
              `;

          pdfElement.appendChild(styleElement);

          // Create a watermark element
          const watermarkElement = document.createElement("div");
          watermarkElement.style.position = "absolute";
          watermarkElement.style.left = "0";
          watermarkElement.style.top = "0";
          watermarkElement.style.width = "100%";
          watermarkElement.style.height = "100%";
          watermarkElement.style.display = "flex";
          watermarkElement.style.alignItems = "center";
          watermarkElement.style.justifyContent = "center";
          watermarkElement.style.opacity = "0.09";
          watermarkElement.style.pointerEvents = "none";

          const watermarkImage = document.createElement("img");
          watermarkImage.src = waterMarkText;
          watermarkImage.style.width = "75%";
          watermarkImage.style.height = "50%";
          watermarkImage.style.objectFit = "contain";

          watermarkElement.appendChild(watermarkImage);

          const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
            const totalPages = doc.internal.getNumberOfPages();
            const margin = 15; // Adjust as needed
            const footerHeight = 15; // Adjust as needed
            for (let i = 1; i <= totalPages; i++) {
              doc.setPage(i);
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();

              doc.setFontSize(12);
              const headerImgWidth = pageWidth * 0.95;
              const headerImgHeight = pageHeight * 0.09;
              const headerX = 5;
              const headerY = 3.5;
              doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

              const imgWidth = pageWidth * 0.50;
              const imgHeight = pageHeight * 0.25;
              const x = (pageWidth - imgWidth) / 2;
              const y = (pageHeight - imgHeight) / 2 - 20;
              doc.setFillColor(0, 0, 0, 0.1);
              doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);

              doc.setFontSize(10);
              const footerImgWidth = pageWidth * 0.95;
              const footerImgHeight = pageHeight * 0.067;
              const footerX = 5;
              const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
              // const footerY = pageHeight - footerHeight;
              doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
              if (documentPrepartion?.pagenumberneed === "All Pages") {
                const textY = footerY - 3;
                doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
              } else if (documentPrepartion?.pagenumberneed === "End Page" && i === totalPages) {
                const textY = footerY - 3;
                doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
              }


              if (qrCodeNeed) {
                if (i === totalPages) {
                  const qrCodeWidth = 25;
                  const qrCodeHeight = 25;
                  const qrCodeX = footerX;
                  const qrCodeY = footerY - qrCodeHeight - 4;
                  doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

                  const statementX = qrCodeX + qrCodeWidth + 10;
                  const statementY1 = qrCodeY + 10;
                  const statementY2 = statementY1 + 5;
                  const statementY3 = statementY2 + 5;

                  const statementText1 = '1. Scan to verify the authenticity of this document.';
                  const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                  const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                  doc.setFontSize(12);
                  doc.text(statementText1, statementX, statementY1);
                  doc.text(statementText2, statementX, statementY2);
                  doc.text(statementText3, statementX, statementY3);
                }
              }
              const contentAreaHeight = pageHeight - footerHeight - margin;
            }
          };

          html2pdf()
            .from(pdfElement)
            .set({
              margin: pageSizePdf == "A3"
                ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
                  : (head === "" && foot !== "") ? [20, 15, 45, 15]
                    : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                      [20, 15, 20, 15])

                :
                ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
                  : (head === "" && foot !== "") ? [15, 15, 45, 15]
                    : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: {
                unit: "mm",
                format: [
                  parseFloat(agendaEditStyles.width) || 210,
                  parseFloat(agendaEditStyles.height) || 297
                ],
                orientation: agendaEditStyles.orientation || "portrait"
              },
              lineHeight: 0,
              fontSize: 12,
              pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            })
            .toPdf()
            .get('pdf')
            .then((pdf) => {
              const img = new Image();
              img.src = waterMarkText;
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.globalAlpha = 0.1;
                ctx.drawImage(img, 0, 0);
                const watermarkImage = canvas.toDataURL('image/png');

                const qrImg = new Image();
                qrImg.src = imageUrl;
                qrImg.onload = () => {
                  const qrCanvas = document.createElement('canvas');
                  qrCanvas.width = qrImg.width;
                  qrCanvas.height = qrImg.height;
                  const qrCtx = qrCanvas.getContext('2d');
                  qrCtx.drawImage(qrImg, 0, 0);
                  const qrCodeImage = qrCanvas.toDataURL('image/png');

                  addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                  const pdfBlob = pdf.output('blob');
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  const printWindow = window.open(pdfUrl);
                  setButtonLoadingPreview(false);
                  setLoadingPreviewManualData(false)
                };
              };
            });
        }

      }).catch((error) => {
        console.error('Error generating PDF:', error);
      })

    }


  };


  const handleOpenPreviewManualfunc = () => {
    setButtonLoadingPreview(true);
    setPreviewManual(false)
    // Create a new div element to hold the Quill content
    const pdfElement = document.createElement("div");
    pdfElement.innerHTML = checking;
    let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
      <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1;width: 100px; height: 90px;" />
      ` : "")
      .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
        <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
    <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
  ` : "")
      .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
    <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
         ` : "")


    pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
    const pdfElementHead = document.createElement("div");
    pdfElementHead.innerHTML = head;

    // Add custom styles to the PDF content
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .ql-indent-1 { margin-left: 75px; }
      .ql-indent-2 { margin-left: 150px; }
      .ql-indent-3 { margin-left: 225px; }
      .ql-indent-4 { margin-left: 275px; }
      .ql-indent-5 { margin-left: 325px; }
      .ql-indent-6 { margin-left: 375px; }
      .ql-indent-7 { margin-left: 425px; }
      .ql-indent-8 { margin-left: 475px; }
      .ql-align-right { text-align: right; }
      .ql-align-left { text-align: left; }
      .ql-align-center { text-align: center; }
      .ql-align-justify { text-align: justify; }
    `;

    pdfElement.appendChild(styleElement);

    // Create a watermark element
    const watermarkElement = document.createElement("div");
    watermarkElement.style.position = "absolute";
    watermarkElement.style.left = "0";
    watermarkElement.style.top = "0";
    watermarkElement.style.width = "100%";
    watermarkElement.style.height = "100%";
    watermarkElement.style.display = "flex";
    watermarkElement.style.alignItems = "center";
    watermarkElement.style.justifyContent = "center";
    watermarkElement.style.opacity = "0.09";
    watermarkElement.style.pointerEvents = "none";

    const watermarkImage = document.createElement("img");
    watermarkImage.src = waterMarkText;
    watermarkImage.style.width = "75%";
    watermarkImage.style.height = "50%";
    watermarkImage.style.objectFit = "contain";

    watermarkElement.appendChild(watermarkImage);

    const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
      const totalPages = doc.internal.getNumberOfPages();
      const margin = 15; // Adjust as needed
      const footerHeight = 15; // Adjust as needed
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(12);
        const headerImgWidth = pageWidth * 0.95;
        const headerImgHeight = pageHeight * 0.09;
        const headerX = 5;
        const headerY = 3.5;
        doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

        const imgWidth = pageWidth * 0.50;
        const imgHeight = pageHeight * 0.25;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2 - 20;
        doc.setFillColor(0, 0, 0, 0.1);
        doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);

        doc.setFontSize(10);
        const footerImgWidth = pageWidth * 0.95;
        const footerImgHeight = pageHeight * 0.067;
        const footerX = 5;
        const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
        // const footerY = pageHeight - footerHeight;
        doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
        if (documentPrepartion?.pagenumberneed === "All Pages") {
          const textY = footerY - 3;
          doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
        } else if (documentPrepartion?.pagenumberneed === "End Page" && i === totalPages) {
          const textY = footerY - 3;
          doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
        }


        if (qrCodeNeed) {
          if (i === totalPages) {
            const qrCodeWidth = 25;
            const qrCodeHeight = 25;
            const qrCodeX = footerX;
            const qrCodeY = footerY - qrCodeHeight - 4;
            doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

            const statementX = qrCodeX + qrCodeWidth + 10;
            const statementY1 = qrCodeY + 10;
            const statementY2 = statementY1 + 5;
            const statementY3 = statementY2 + 5;

            const statementText1 = '1. Scan to verify the authenticity of this document.';
            const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
            const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

            doc.setFontSize(12);
            doc.text(statementText1, statementX, statementY1);
            doc.text(statementText2, statementX, statementY2);
            doc.text(statementText3, statementX, statementY3);
          }
        }
        const contentAreaHeight = pageHeight - footerHeight - margin;
      }
    };

    html2pdf()
      .from(pdfElement)
      .set({
        margin: pageSizePdf == "A3"
          ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
            : (head === "" && foot !== "") ? [20, 15, 45, 15]
              : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                [20, 15, 20, 15])

          :
          ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
            : (head === "" && foot !== "") ? [15, 15, 45, 15]
              : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: [
            parseFloat(agendaEditStyles.width) || 210,
            parseFloat(agendaEditStyles.height) || 297
          ],
          orientation: agendaEditStyles.orientation || "portrait"
        },
        lineHeight: 0,
        fontSize: 12,
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      })
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const img = new Image();
        img.src = waterMarkText;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.globalAlpha = 0.1;
          ctx.drawImage(img, 0, 0);
          const watermarkImage = canvas.toDataURL('image/png');

          const qrImg = new Image();
          qrImg.src = imageUrl;
          qrImg.onload = () => {
            const qrCanvas = document.createElement('canvas');
            qrCanvas.width = qrImg.width;
            qrCanvas.height = qrImg.height;
            const qrCtx = qrCanvas.getContext('2d');
            qrCtx.drawImage(qrImg, 0, 0);
            const qrCodeImage = qrCanvas.toDataURL('image/png');

            addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const printWindow = window.open(pdfUrl);
            setButtonLoadingPreview(false);
          };
        };
      });
  }


  const downloadPdfTesdtCheckTrue = (index) => {
    return new Promise((resolve, reject) => {
      // Create a new div element to hold the Quill content
      const pdfElement = document.createElement("div");

      pdfElement.innerHTML = checkingArray[index]?.data;
      const pdfElementHead = document.createElement("div");
      pdfElementHead.innerHTML = checkingArray[index]?.header;
      // Add custom styles to the PDF content
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        .ql-indent-1 { margin-left: 75px; }
        .ql-indent-2 { margin-left: 150px; }
        .ql-indent-3 { margin-left: 225px; }
        .ql-indent-4 { margin-left: 275px; }
        .ql-indent-5 { margin-left: 325px; }
        .ql-indent-6 { margin-left: 375px; }
        .ql-indent-7 { margin-left: 425px; }
        .ql-indent-8 { margin-left: 475px; }
        .ql-align-right { text-align: right; }
        .ql-align-left { text-align: left; }
        .ql-align-center { text-align: center; }
        .ql-align-justify { text-align: justify; }
      `;
      pdfElement.appendChild(styleElement);

      // Create a watermark element
      const watermarkElement = document.createElement("div");
      watermarkElement.style.position = "absolute";
      watermarkElement.style.left = "0";
      watermarkElement.style.top = "0";
      watermarkElement.style.width = "100%";
      watermarkElement.style.height = "100%";
      watermarkElement.style.display = "flex";
      watermarkElement.style.alignItems = "center";
      watermarkElement.style.justifyContent = "center";
      watermarkElement.style.opacity = "0.09";
      watermarkElement.style.pointerEvents = "none";

      // Create and append an image element for watermark
      const watermarkImage = document.createElement("img");
      watermarkImage.src = checkingArray[index]?.watermark;
      watermarkImage.style.width = "75%";
      watermarkImage.style.height = "50%";
      watermarkImage.style.objectFit = "contain";
      watermarkElement.appendChild(watermarkImage);

      const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
        const totalPages = doc.internal.getNumberOfPages();
        const margin = 15; // Adjust as needed
        const footerHeight = 15; // Adjust as needed
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          doc.setFontSize(12);
          const headerImgWidth = pageWidth * 0.95;
          const headerImgHeight = pageHeight * 0.09;
          const headerX = 5;
          const headerY = 3.5;
          doc.addImage(checkingArray[index]?.header, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

          if (checkingArray[index]?.header !== "") {
            const imgWidth = pageWidth * 0.50;
            const imgHeight = pageHeight * 0.25;
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2 - 20;
            doc.setFillColor(0, 0, 0, 0.1);
            doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
          }

          doc.setFontSize(10);
          const footerImgWidth = pageWidth * 0.95;
          const footerImgHeight = pageHeight * 0.067;
          const footerX = 5;
          const footerY = (pageHeight * 1) - (checkingArray[index]?.footer === "" ? 15 : footerImgHeight - 3);
          // const footerY = pageHeight - footerHeight;
          doc.addImage(checkingArray[index]?.footer, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
          if (checkingArray[index]?.pagenumberneed === "All Pages") {
            const textY = footerY - 3;
            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
          } else if (checkingArray[index]?.pagenumberneed === "End Page" && i === totalPages) {
            const textY = footerY - 3;
            doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
          }


          if (checkingArray[index]?.qrcodeNeed) {
            if (i === totalPages) {
              const qrCodeWidth = 25;
              const qrCodeHeight = 25;
              const qrCodeX = footerX;
              const qrCodeY = footerY - qrCodeHeight - 4;
              doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

              const statementX = qrCodeX + qrCodeWidth + 10;
              const statementY1 = qrCodeY + 10;
              const statementY2 = statementY1 + 5;
              const statementY3 = statementY2 + 5;

              const statementText1 = '1. Scan to verify the authenticity of this document.';
              const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
              const statementText3 = `3. For questions, contact us at ${checkingArray[index]?.frommailemail}.`;

              doc.setFontSize(12);
              doc.text(statementText1, statementX, statementY1);
              doc.text(statementText2, statementX, statementY2);
              doc.text(statementText3, statementX, statementY3);
            }
          }
          const contentAreaHeight = pageHeight - footerHeight - margin;
        }
      };

      // Convert the HTML content to PDF
      html2pdf()
        .from(pdfElement)
        .set({
          margin: checkingArray[index]?.pagesize == "A3"
            ? ((checkingArray[index]?.header !== "" && (checkingArray[index]?.footer !== "")) ? [45, 15, 45, 15]
              : (checkingArray[index]?.header === "" && checkingArray[index]?.footer !== "") ? [20, 15, 45, 15]
                : (checkingArray[index]?.header !== "" && checkingArray[index]?.footer === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((checkingArray[index]?.header !== "" && (checkingArray[index]?.footer !== "")) ? [30, 15, 45, 15]
              : (checkingArray[index]?.header === "" && checkingArray[index]?.footer !== "") ? [15, 15, 45, 15]
                : (checkingArray[index]?.header !== "" && checkingArray[index]?.footer === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: {
            unit: "mm",
            format: [
              parseFloat(checkingArray[index]?.pagewidth) || 210,
              parseFloat(checkingArray[index]?.pageheight) || 297
            ],
            orientation: checkingArray[index]?.orientation || "portrait"
          },
          lineHeight: 0,
          fontSize: 12,
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        })
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          // Convert the watermark image to a base64 string
          const img = new Image();
          img.src = waterMarkText;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = 0.1;
            ctx.drawImage(img, 0, 0);
            const watermarkImage = canvas.toDataURL('image/png');

            // Add QR code image
            const qrImg = new Image();
            qrImg.src = checkingArray[index]?.qrcode; // QR code image URL
            qrImg.onload = () => {
              const qrCanvas = document.createElement('canvas');
              qrCanvas.width = qrImg.width;
              qrCanvas.height = qrImg.height;
              const qrCtx = qrCanvas.getContext('2d');
              qrCtx.drawImage(qrImg, 0, 0);
              const qrCodeImage = qrCanvas.toDataURL('image/png');

              // Add page numbers, watermark, and QR code to each page
              addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

              // Return the boolean indicating if the document has more than one page
              const isMultiPage = pdf.internal.getNumberOfPages() > 1;
              resolve(isMultiPage);
            };
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  };


  const downloadPdfTesdtCheckTrueManual = () => {
    return new Promise((resolve, reject) => {
      // Create a new div element to hold the Quill content
      const pdfElement = document.createElement("div");

      pdfElement.innerHTML = checking;
      let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
        <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;" />
        ` : "")
        .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
          <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
  ${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
      <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
    ` : "")
        .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
      <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
           ` : "")
      pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
      const pdfElementHead = document.createElement("div");

      pdfElementHead.innerHTML = head;
      // Add custom styles to the PDF content
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        .ql-indent-1 { margin-left: 75px; }
        .ql-indent-2 { margin-left: 150px; }
        .ql-indent-3 { margin-left: 225px; }
        .ql-indent-4 { margin-left: 275px; }
        .ql-indent-5 { margin-left: 325px; }
        .ql-indent-6 { margin-left: 375px; }
        .ql-indent-7 { margin-left: 425px; }
        .ql-indent-8 { margin-left: 475px; }
        .ql-align-right { text-align: right; }
        .ql-align-left { text-align: left; }
        .ql-align-center { text-align: center; }
        .ql-align-justify { text-align: justify; }
      `;
      pdfElement.appendChild(styleElement);

      // Create a watermark element
      const watermarkElement = document.createElement("div");
      watermarkElement.style.position = "absolute";
      watermarkElement.style.left = "0";
      watermarkElement.style.top = "0";
      watermarkElement.style.width = "100%";
      watermarkElement.style.height = "100%";
      watermarkElement.style.display = "flex";
      watermarkElement.style.alignItems = "center";
      watermarkElement.style.justifyContent = "center";
      watermarkElement.style.opacity = "0.09";
      watermarkElement.style.pointerEvents = "none";

      // Create and append an image element for watermark
      const watermarkImage = document.createElement("img");
      watermarkImage.src = waterMarkText;
      watermarkImage.style.width = "75%";
      watermarkImage.style.height = "50%";
      watermarkImage.style.objectFit = "contain";
      watermarkElement.appendChild(watermarkImage);

      const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
        const totalPages = doc.internal.getNumberOfPages();
        const margin = 15; // Adjust as needed
        const footerHeight = 15; // Adjust as needed
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          doc.setFontSize(12);
          const headerImgWidth = pageWidth * 0.95;
          const headerImgHeight = pageHeight * 0.09;
          const headerX = 5;
          const headerY = 3.5;
          doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

          const imgWidth = pageWidth * 0.50;
          const imgHeight = pageHeight * 0.25;
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2 - 20;
          doc.setFillColor(0, 0, 0, 0.1);
          doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);

          doc.setFontSize(10);
          const footerImgWidth = pageWidth * 0.95;
          const footerImgHeight = pageHeight * 0.067;
          const footerX = 5;
          const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
          // const footerY = pageHeight - footerHeight;
          doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
          if (documentPrepartion?.pagenumberneed === "All Pages") {
            const textY = footerY - 3;
            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
          } else if (documentPrepartion?.pagenumberneed === "End Page" && i === totalPages) {
            const textY = footerY - 3;
            doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
          }


          if (qrCodeNeed) {
            if (i === totalPages) {
              const qrCodeWidth = 25;
              const qrCodeHeight = 25;
              const qrCodeX = footerX;
              const qrCodeY = footerY - qrCodeHeight - 4;
              doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

              const statementX = qrCodeX + qrCodeWidth + 10;
              const statementY1 = qrCodeY + 10;
              const statementY2 = statementY1 + 5;
              const statementY3 = statementY2 + 5;

              const statementText1 = '1. Scan to verify the authenticity of this document.';
              const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
              const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

              doc.setFontSize(12);
              doc.text(statementText1, statementX, statementY1);
              doc.text(statementText2, statementX, statementY2);
              doc.text(statementText3, statementX, statementY3);
            }
          }
          const contentAreaHeight = pageHeight - footerHeight - margin;
        }
      };

      // Convert the HTML content to PDF
      html2pdf()
        .from(pdfElement)
        .set({
          margin: pageSizePdf == "A3"
            ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
              : (head === "" && foot !== "") ? [20, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
              : (head === "" && foot !== "") ? [15, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: {
            unit: "mm",
            format: [
              parseFloat(agendaEditStyles.width) || 210,
              parseFloat(agendaEditStyles.height) || 297
            ],
            orientation: agendaEditStyles.orientation || "portrait"
          },
          lineHeight: 0,
          fontSize: 12,
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        })
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          // Convert the watermark image to a base64 string
          const img = new Image();
          img.src = waterMarkText;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = 0.1;
            ctx.drawImage(img, 0, 0);
            const watermarkImage = canvas.toDataURL('image/png');

            // Add QR code image
            const qrImg = new Image();
            qrImg.src = imageUrl; // QR code image URL
            qrImg.onload = () => {
              const qrCanvas = document.createElement('canvas');
              qrCanvas.width = qrImg.width;
              qrCanvas.height = qrImg.height;
              const qrCtx = qrCanvas.getContext('2d');
              qrCtx.drawImage(qrImg, 0, 0);
              const qrCodeImage = qrCanvas.toDataURL('image/png');

              // Add page numbers, watermark, and QR code to each page
              addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

              // Return the boolean indicating if the document has more than one page
              const isMultiPage = pdf.internal.getNumberOfPages() > 1;
              resolve(isMultiPage);
            };
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleBulkPrint = async () => {
    if (headerOptions === "Please Select Print Options") {
      setButtonLoadingPreview(false);
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setPopupContentMalert("Please Select With Letter Head!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setLoadingGeneratingDatas(true)
      // Create a new div element to hold the Quill content
      await Promise.all(selectedRows?.map(async (item) => {
        setBulkPrintStatus(true)
        let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await getUpdatePrintingStatus(item, response?.data?.sdocumentPreparation?.updatedby)

        setLoadingGeneratingMessage("Printing the set the Documents..!")
        const pdfElement = document.createElement("div");
        pdfElement.innerHTML = response?.data?.sdocumentPreparation?.document;


        // Add custom styles to the PDF content
        const styleElement = document.createElement("style");
        styleElement.textContent = `
    .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
    .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
    .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
    .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
    .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
    .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
    .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
    .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
    .ql-align-right { text-align: right; } 
    .ql-align-left { text-align: left; } 
    .ql-align-center { text-align: center; } 
    .ql-align-justify { text-align: justify; } 
  `;

        pdfElement.appendChild(styleElement);

        // pdfElement.appendChild(styleElement);
        const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
          const totalPages = doc.internal.getNumberOfPages();
          const margin = 15; // Adjust as needed
          const footerHeight = 15; // Adjust as needed
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Add header
            doc.setFontSize(12);
            // doc.text(convertToNumberedList(head), pageWidth / 2, 10, { align: 'center' });
            const headerImgWidth = pageWidth * 0.95; // Adjust as needed
            const headerImgHeight = pageHeight * 0.09;// Adjust as needed
            //const headerX = (pageWidth - headerImgWidth) / 2;
            // const headerY = 6; // Adjust as needed for header position
            const headerX = 5; // Start from the left
            const headerY = 3.5; // Start from the top
            doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

            const imgWidth = pageWidth * 0.50; // 75% of page width
            const imgHeight = pageHeight * 0.25; // 50% of page height
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2 - 20;
            doc.setFillColor(0, 0, 0, 0.1);
            doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
            // Add footer
            doc.setFontSize(10);
            // doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            // Add footer image stretched to page width
            const footerImgWidth = pageWidth * 0.95; // Stretch to full page width
            const footerImgHeight = pageHeight * 0.067; // Adjust height as needed
            const footerX = 5; // Start from the left
            const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
            doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
            if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
              const textY = footerY - 3;
              doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
            } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
              const textY = footerY - 3;
              doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
            }
            // Add QR code and statement only on the last page

            if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
              if (i === totalPages) {
                // Add QR code in the left corner
                const qrCodeWidth = 25; // Adjust as needed
                const qrCodeHeight = 25; // Adjust as needed
                const qrCodeX = footerX; // Left corner
                const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
                doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



                // Add statement on the right of the QR code
                const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
                const statementY1 = qrCodeY + 10; // Align with the top of the QR code
                const statementY2 = statementY1 + 5; // Adjust as needed for spacing
                const statementY3 = statementY2 + 5; // Adjust as needed for spacing



                // Add statements
                const statementText1 = '1. Scan to verify the authenticity of this document.';
                const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
                const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

                doc.setFontSize(12);
                doc.text(statementText1, statementX, statementY1);
                doc.text(statementText2, statementX, statementY2);
                doc.text(statementText3, statementX, statementY3);
                // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
              }
            }
          }
        };

        // Convert the HTML content to PDF
        html2pdf()
          .from(pdfElement)
          .set({
            margin: response.data.sdocumentPreparation?.pagesize == "A3"
              ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
                : (head === "" && foot !== "") ? [20, 15, 45, 15]
                  : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                    [20, 15, 20, 15])

              :
              ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
                : (head === "" && foot !== "") ? [15, 15, 45, 15]
                  : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
              unit: "mm",
              format: [
                parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
              ],
              orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
            },
            lineHeight: 0, // Increased line spacing
            fontSize: 12,
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          }).toPdf().get('pdf').then((pdf) => {
            // Convert the watermark image to a base64 string
            const img = new Image();
            img.src = response?.data?.sdocumentPreparation?.watermark;
            img.onload = () => {
              const canvas = document?.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.globalAlpha = 0.1;
              ctx.drawImage(img, 0, 0);
              const watermarkImage = canvas.toDataURL('image/png');

              // Add QR code image
              const qrImg = new Image();
              qrImg.src = response?.data?.sdocumentPreparation?.qrcode; // QR code image URL
              qrImg.onload = () => {
                const qrCanvas = document.createElement('canvas');
                qrCanvas.width = qrImg.width;
                qrCanvas.height = qrImg.height;
                const qrCtx = qrCanvas.getContext('2d');
                qrCtx.drawImage(qrImg, 0, 0);
                const qrCodeImage = qrCanvas.toDataURL('image/png');

                // Add page numbers and watermark to each page
                addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                // Save the PDF
                pdf.save(`${response?.data?.sdocumentPreparation?.template}_${response?.data?.sdocumentPreparation?.person}.pdf`);
                setBulkPrintStatus(false)

              };
            };
          });
      }))
      await fetchBrandMaster();
      handleClickCloseLetterHead();
      setChanged("dsdss")
      handleCloseBulkModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setLoadingGeneratingDatas(false)
    }
  };


  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // Alert delete popup
  let brandid = documentPreparationEdit?._id;
  const delBrand = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${brandid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBrandMaster();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //add function
  const sendRequest = async () => {
    setBtnLoad(true);
    setPageName(!pageName);
    setProgressOpen(false);
    setSavingDatas(true)
    const batchSize = 10; // Adjust batch size as needed
    const batches = [];

    // Split checkingArray into batches
    for (let i = 0; i < checkingArray.length; i += batchSize) {
      batches.push(checkingArray.slice(i, i + batchSize));
    }

    try {
      for (const batch of batches) {
        const batchRequests = batch.map(async (data) => {
          await axios.post(SERVICE.CREATE_DOCUMENT_PREPARATION, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            date: String(date),
            template: String(data.template),
            documentname: String(data.documentname),
            referenceno: data?.referenceno,
            tempcode: data?.tempcode,
            termsAndConditons: templateCreationValue?.termsAndConditons,
            templateno: data?.autoid,
            email: data?.email,
            employeemode: String(data.employeemode),
            issuingauthority: String(data.issuingauthority),
            department: String(data.department),
            company: String(data.company),
            branch: String(data.branch),
            unit: String(data.unit),
            team: String(data.team),
            pagenumberneed: String(data.pagenumberneed),
            documentneed: String(data.documentneed),
            person: data.empname === "Please Select Person" ? "" : data.empname,
            proption: String(data?.proption),
            watermark: data?.watermark,
            pageheight: data?.pageheight,
            pagewidth: data?.pagewidth,
            pagesize: data?.pagesize,
            head: data.documentneed === "Employee Approval" ? data?.header : "",
            foot: data.documentneed === "Employee Approval" ? data?.footer : "",
            qrCodeNeed: data?.qrcodeNeed,
            sign: data?.sign,
            sealing: data?.sealing,
            printingstatus: "Not-Printed",
            signature: data?.signature,
            seal: data?.seal,
            qrcode: data?.qrcode,
            issuedpersondetails: String(isUserRoleAccess.companyname),
            document: data?.data,
            frommailemail: data?.frommailemail,
            mail: "Send",
            printoptions: "",
            addedby: [
              {
                name: String(username),
                date: String(new Date()),
              },
            ],
          });
        });

        // Wait for the current batch to complete before proceeding to the next
        await Promise.all(batchRequests);
      }
      setSavingDatas(false)
      await fetchBrandMaster();
      handleCloseInfoImage();
      setDocumentPrepartion({
        ...documentPrepartion,
        person: "Please Select Person",
        documentneed: "Print Document"
      });
      setHeader("");
      // setFooter("");
      setSelectedHeadOptAdd([]);
      setQrCodeNeed(false);
      setChecking("");
      setCheckingArray([]);
      setIndexViewQuest(1);
      setEmployeeControlPanel("");
      setEmployeeValue([]);
      setEmployeeUserName("");
      window.scrollTo(0, 0);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    } finally {
      setBtnLoad(false);
      setSearchQuery("");
    }
  };

  const sendRequestManual = async () => {
    setBtnLoad(true)
    const constAuotId = await fetchAllRaisedTickets();
    let prefixLength = Number(constAuotId[1]) + 1;
    let prefixString = String(prefixLength);
    let postfixLength = prefixString.length == 1 ? `000${prefixString}` : prefixString.length == 2 ?
      `00${prefixString}` : prefixString.length == 3 ? `0${prefixString}` : prefixString.length == 4 ?
        `0${prefixString}` : prefixString.length == 5 ? `0${prefixString}`
          : prefixString.length == 6 ? `0${prefixString}` : prefixString.length == 7 ? `0${prefixString}` :
            prefixString.length == 8 ? `0${prefixString}` : prefixString.length == 9 ? `0${prefixString}` : prefixString.length == 10 ? `0${prefixString}` : prefixString;

    let newval = employeeControlPanel ? uniqueCode + employeeControlPanel?.team?.slice(0, 3) + "#" + templateCreationValue?.tempcode + "_" + postfixLength :
      "Man" + "#" + ((templateCreationValue?.tempcode === "" || templateCreationValue?.tempcode === undefined) ? ""
        : templateCreationValue?.tempcode) + "_" + postfixLength;

    let newvalRefNo = `DP_${postfixLength}`;

    const pdfElement = document.createElement("div");

    pdfElement.innerHTML = checking;
    let findMethod = checking?.replaceAll("$RSEAL$", sealPlacement ? `
      <img src="${sealPlacement}" alt="Seal" style="postion:absolute; z-index:-1; width: 100px; height: 90px;;" />
      ` : "")
      .replaceAll("$FSIGNATURE$", signatureContent?.seal === "For Seal" ? `
        <h4 style="color:#53177e;">${signatureContent?.topcontent}</h4><br/>
${signature ? `<img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;"" /> <br/>` : ""}
    <h4 style="color:#53177e;">${signatureContent?.bottomcontent}</h4><br/>
  ` : "")
      .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
    <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
         ` : "")
    pdfElement.innerHTML = DOMPurify.sanitize(findMethod);
    setPageName(!pageName);
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_DOCUMENT_PREPARATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: String(date),
        template: String(documentPrepartion.template),
        documentname: String(documentPrepartion.documentname),
        referenceno: newvalRefNo,
        tempcode: templateCreationValue?.tempcode,
        documentneed: documentPrepartion?.documentneed,
        templateno: newval,
        email: emailUser,
        employeemode: String(documentPrepartion.employeemode),
        issuingauthority: String(documentPrepartion.issuingauthority),
        department: String(documentPrepartion.department),
        pagenumberneed: String(documentPrepartion.pagenumberneed),
        company: String(documentPrepartion.company),
        branch: String(documentPrepartion.branch),
        unit: String(documentPrepartion.unit),
        team: String(documentPrepartion.team),
        person: documentPrepartion.person === "Please Select Person" ? "" : documentPrepartion.person,
        proption: String(documentPrepartion.proption),
        watermark: waterMarkText,
        pageheight: agendaEditStyles.height,
        pagewidth: agendaEditStyles.width,
        // headvalue: headvalue,
        pagesize: pageSizePdf,
        head: documentPrepartion?.documentneed === "Employee Approval" ? head : "",
        foot: documentPrepartion?.documentneed === "Employee Approval" ? foot : "",
        qrCodeNeed: qrCodeNeed,
        sign: documentPrepartion.signature,
        sealing: documentPrepartion.seal,
        termsAndConditons: templateCreationValue?.termsAndConditons,
        printingstatus: "Not-Printed",
        signature: signature,
        seal: sealPlacement,
        qrcode: imageUrl,
        issuedpersondetails: String(isUserRoleAccess.companyname),
        document: findMethod,
        frommailemail: fromEmail,
        mail: "Send",
        printoptions: "With Letter Head",
        addedby: [
          {
            name: String(username),
            date: String(new Date()),
          },
        ],
      });
      //   setTemplateCreation(brandCreate.data);
      await fetchBrandMaster();
      handleCloseInfoImageManual();
      setDocumentPrepartion({
        ...documentPrepartion,
        person: "Please Select Person",
      });
      setBtnLoad(false)
      handleCloseInfoImage();
      setChecking("");
      setEmployeeControlPanel("")
      setEmployeeValue([])
      setEmployeeUserName("")
      window.scrollTo(0, 0)
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup()
      setSearchQuery("");
      setBtnLoad(false)
    } catch (err) { setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  let userRoles = isUserRoleAccess?.role?.map(data => data?.toUpperCase().replace(/[^A-Z0-9]/g, ''));



  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const [first, second, third] = moment(new Date()).format("DD-MM-YYYY hh:mm a")?.split(" ")
    const vasr = `${first}_${second}_${third}`
    setDateFormat(vasr)
    const isNameMatch = templateCreationArrayCreate?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.person === documentPrepartion.person);
    const isNameMatchInside = checkingArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.empname === documentPrepartion.person);
    if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
      setPopupContentMalert("Please Select Template Name!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (documentPrepartion.employeemode === "" || documentPrepartion.employeemode === "Please Select Employee Mode") {
      setPopupContentMalert("Please Select Employee Mode!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (employeeMode !== "Manual" && allBranchValue === false && (documentPrepartion.department === "" || documentPrepartion.department === "Please Select Department")) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (departmentCheck === false && (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (departmentCheck === false && (documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.unit === "" || documentPrepartion.unit === "Please Select Unit")) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.team === "" || documentPrepartion.team === "Please Select Team")) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (employeeMode !== "Manual" && documentPrepartion?.reason !== "Document" && (documentPrepartion.person === "" || documentPrepartion.person === "Please Select Person")) {
      setPopupContentMalert("Please Select Person!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (employeeMode !== "Manual" && documentPrepartion?.reason === "Document" && (selectedEmployeeValues?.length < 1)) {
      setPopupContentMalert("Please Select Person!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.reason === "Attendance" && documentPrepartion.sort === "Please Select Sort") {
      setPopupContentMalert("Please Select Sort!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.reason === "Attendance" && documentPrepartion.sort === "Date" && documentPrepartion?.attendancedate === "") {
      setPopupContentMalert("Please Select Attendance Date!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.reason === "Attendance" && documentPrepartion.sort === "Month" && documentPrepartion?.attendancemonth === "Please Select Attendance Month") {
      setPopupContentMalert("Please Select Attendance Month!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.reason === "Attendance" && documentPrepartion.sort === "Month" && documentPrepartion?.attendanceyear === "Please Select Attendance Year") {
      setPopupContentMalert("Please Select Attendance Year!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.reason === "Production" && documentPrepartion.sort === "Please Select Sort") {
      setPopupContentMalert("Please Select Sort!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.reason === "Production" && documentPrepartion.sort === "Date" && documentPrepartion?.productiondate === "") {
      setPopupContentMalert("Please Select Production Date!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.reason === "Production" && documentPrepartion.sort === "Month" && documentPrepartion?.productionmonth === "Please Select Production Month") {
      setPopupContentMalert("Please Select Production Month!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.reason === "Production" && documentPrepartion.sort === "Month" && documentPrepartion?.productionyear === "Please Select Production Year") {
      setPopupContentMalert("Please Select Production Year!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.issuingauthority === "" || documentPrepartion.issuingauthority === "Please Select Issuing Authority") {
      setPopupContentMalert("Please Select Issuing Authority!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if ((signatureStatus === "With") && (documentPrepartion.signature === "" || documentPrepartion.signature === "Please Select Signature")) {
      setPopupContentMalert("Please Select Signature!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if ((sealStatus !== 'None' && sealStatus !== "" && signatureContent?.seal !== "None") && (documentPrepartion.seal === "" || documentPrepartion.seal === "Please Select Seal")) {
      setPopupContentMalert("Please Select Seal!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }

    else if (documentPrepartion?.employeemode !== "Manual" && isNameMatch) {
      setPopupContentMalert("Document with Person Name and Template already exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion?.employeemode !== "Manual" && isNameMatchInside) {
      setPopupContentMalert("Document with Person Name and Template already exists in Todo!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion?.documentneed === "Employee Approval" && documentPrepartion?.printoptions === "Please Select Print Options") {
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion?.documentneed === "Employee Approval" && documentPrepartion?.printoptions === "With Letter Head" && headvalueAdd?.length === 0) {
      setPopupContentMalert("Please Select Letter Head Options!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }

    else {
      setLoadingGeneratingDatas(true)
      if (selectedEmployeeValues?.length > 0) {
        selectedEmployeeValues?.map((data, index) => answerDefine(data, index))
      } else {
        answerDefine();
      }


    }
  };




  //submit option for saving
  const handleSubmited = async (e, index) => {
    e.preventDefault();
    let ans = [];
    const isNameMatch = templateCreationArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.person === documentPrepartion.person);
    if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
      setPopupContentMalert("Please Select Template Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (documentPrepartion.employeemode === "" || documentPrepartion.employeemode === "Please Select Employee Mode") {
      setPopupContentMalert("Please Select Employee Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (allBranchValue === false && (documentPrepartion.department === "" || documentPrepartion.department === "Please Select Department")) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (departmentCheck === false && (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (departmentCheck === false && (documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (departmentCheck === false && (documentPrepartion.unit === "" || documentPrepartion.unit === "Please Select Unit")) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (departmentCheck === false && (documentPrepartion.team === "" || documentPrepartion.team === "Please Select Team")) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (documentPrepartion.employeemode !== "Manual" && isNameMatch) {
      setPopupContentMalert("Document with Person Name and Template already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.employeemode === "Manual" && checking === "") {
      setPopupContentMalert("Document is Empty!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.employeemode !== "Manual" && checkingArray?.length < 1) {
      setPopupContentMalert("Document Todo is Empty!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (generateData) {
      setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.employeemode === "Manual" && (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$EMPLOYEESIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0)) {
      setPopupContentMalert("Fill All the Fields Which starts From $ and Ends with $!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      // const batchSize = 2;
      // // setBtnLoad(true);
      // const results = await processInBatches(checkingArray, batchSize);

      // const allFalse = results.every((isMultiPage) => !isMultiPage);
      // if (!allFalse && templateCreationValue?.pagemode === "Single Page") {
      //   setPopupContentMalert(`This Template has a page mode of ${templateCreationValue?.pagemode}, but the provided documents are ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"} to print documents.`);
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // } else {
      //   handleClickOpenInfoImage();
      // }


      handleClickOpenInfoImage();



    }
  };

  const generatePDFs = async (e) => {
    e.preventDefault()
    setBtnLoad(true);
    setProgressValue(0);
    setCurrentFile("")
    setProgressOpen(true); // Show the progress popup
    try {
      handleCloseInfoImage();
      const results = [];
      let localProgress = 0;
      const totalFiles = checkingArray?.length ?? 0;
      for (let i = 0; i < totalFiles; i++) {

        const isMultiPage = await downloadPdfTesdtCheckTrue(i);
        results.push(isMultiPage);
        setCurrentFile(`${checkingArray[i]?.documentname} - ${checkingArray[i]?.empname}`)
        localProgress = ((i + 1) / totalFiles) * 100;
        setProgressValue(localProgress);
      }

      const allFalse = results.every((isMultiPage) => !isMultiPage);

      if (!allFalse && templateCreationValue?.pagemode === "Single Page") {
        setPopupContentMalert(
          `This Template has a page mode of ${templateCreationValue?.pagemode}, but the provided documents are ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"
          } to print documents.`
        );
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        sendRequest(e)
      }
    } catch (error) {
      console.error("Error generating PDFs:", error);
    } finally {
      setBtnLoad(false);
      setProgressOpen(false); // Hide the progress popup
    }
  };


  // const generatePDFs = async () => {
  //   setBtnLoad(true);

  //   try {
  //     const results = await Promise.all([downloadPdfTesdtCheckTrue(0)]);
  //     const allFalse = results.every((isMultiPage) => !isMultiPage);

  //     if (!allFalse && templateCreationValue?.pagemode === "Single Page") {
  //       setPopupContentMalert(
  //         `This Template has a page mode of ${templateCreationValue?.pagemode}, but the provided documents are ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"
  //         } to print documents.`
  //       );
  //       setPopupSeverityMalert("info");
  //       handleClickOpenPopupMalert();
  //     } else {
  //       handleClickOpenInfoImage();
  //     }
  //   } catch (error) {
  //     console.error("Error generating PDFs:", error);
  //   } finally {
  //     setBtnLoad(false);
  //   }
  // };
  const processInBatches = async (array, batchSize) => {
    let results = [];
    for (let i = 0; i < array.length; i += batchSize) {
      const batch = array.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map((data, index) => downloadPdfTesdtCheckTrue(i + index)));
      results = results.concat(batchResults);
    }
    return results;
  };

  const handleSubmitedManual = (e) => {
    e.preventDefault();
    const isNameMatch = templateCreationArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.person === documentPrepartion.person);
    if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
      setPopupContentMalert("Please Select Template Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (documentPrepartion.employeemode === "" || documentPrepartion.employeemode === "Please Select Employee Mode") {
      setPopupContentMalert("Please Select Employee Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (allBranchValue === false && (documentPrepartion.department === "" || documentPrepartion.department === "Please Select Department")) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (departmentCheck === false && (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (departmentCheck === false && (documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.unit === "" || documentPrepartion.unit === "Please Select Unit")) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.team === "" || documentPrepartion.team === "Please Select Team")) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (documentPrepartion.employeemode !== "Manual" && isNameMatch) {
      setPopupContentMalert("Document with Person Name and Template already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (checking === "") {
      setPopupContentMalert("Document is Empty!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (generateData) {
      setPopupContentMalert("This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (documentPrepartion.employeemode === "Manual" && (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$", "$EMPLOYEESIGNATURE$"]?.includes(data))?.length > 0)) {
      setPopupContentMalert("Fill All the Fields Which starts From $ and Ends with $");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setBtnLoad(true)
      downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {
        setBtnLoad(true)

        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoading(false)
          setPopupContentMalert(`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
              ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          setBtnLoad(false)
          handleClickOpenInfoImageManual();
        }
      }).catch((error) => {
        console.error('Error generating PDF:', error);
      })

    }
  };
  const regex = /\$[A-Z]+\$/g;


  const handleclearDepartment = (e) => {
    e.preventDefault();
    setGenerateData(false)
    setDocumentPrepartion({
      ...documentPrepartion, department: "Please Select Department",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      person: "Please Select Person",
      pagenumberneed: "All Pages",
      issuingauthority: "Please Select Issuing Authority",
      sort: "Please Select Sort",
      attendancedate: "",
      attendancemonth: "Please Select Attendance Month",
      attendanceyear: "Please Select Attendance Year",
      productiondate: "",
      productionmonth: "Please Select Production Month",
      productionyear: "Please Select Production Year",
      proption: "Please Select Print Option",
      pagesize: "Please Select pagesize",
      print: "Please Select Print Option",
      heading: "Please Select Header Option",
      signature: "Please Select Signature",
      seal: "Please Select Seal",
    });
    setCheckingArray([])
    setSelectedEmployeeValues([])
    setSelectedEmployee([])
    setIndexViewQuest(1)
    setBranchOptions([])
    setUnitOptions([])
    setTeamOptions([])
    setEmployeenames([])
    setDepartmentCheck(false);
    setAllBranchValue(false);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };



  const handlecleared = (e) => {
    e.preventDefault();
    setGenerateData(false)
    setCheckingArray([])
    setIndexViewQuest(1)
    setDocumentPrepartion({
      date: "",
      documentname: "",
      template: "Please Select Template Name",
      referenceno: "", templateno: "",
      pagenumberneed: "All Pages",
      employeemode: "Please Select Employee Mode",
      reason: "Document",
      department: "Please Select Department",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      person: "Please Select Person",
      proption: "Please Select Print Option",
      printoptions: "Please Select Print Options",
      issuingauthority: "Please Select Issuing Authority",
      sort: "Please Select Sort",
      attendancedate: "",
      attendancemonth: "Please Select Attendance Month",
      attendanceyear: "Please Select Attendance Year",
      productiondate: "",
      productionmonth: "Please Select Production Month",
      productionyear: "Please Select Production Year",
      signature: "Please Select Signature",
      seal: "Please Select Seal",
      pagesize: "Please Select pagesize",
      print: "Please Select Print Option",
      heading: "Please Select Header Option",
      issuedpersondetails: "",
      documentneed: "Print Document",
    });
    setCheckingArray([])
    setSelectedEmployeeValues([])
    setSelectedEmployee([])
    setIndexViewQuest(1)
    // setHeadValue([])
    setSelectedHeadOpt([])
    // setHeader("")
    // setfooter("")
    setSealStatus("")
    setSignatureStatus("")
    setCompanyName("")
    setIssuingAutholrity([])
    setDepartmentCheck(false);
    setAllBranchValue(false);
    setButtonLoading(false)
    setBtnLoad(false)
    setBranchOptions([]);
    setUnitOptions([]);
    setTeamOptions([]);
    setEmployeenames([]);
    setChecking("");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };



  const handleclearedManual = (e) => {
    e.preventDefault();
    setGenerateData(false)
    setDocumentPrepartion({
      date: "",
      documentname: "",
      template: "Please Select Template Name",
      referenceno: "", templateno: "",
      pagenumberneed: "All Pages",
      employeemode: "Please Select Employee Mode",
      department: "Please Select Department",
      company: "Please Select Company",
      branch: "Please Select Branch",
      unit: "Please Select Unit",
      team: "Please Select Team",
      person: "Please Select Person",
      proption: "Please Select Print Option",
      issuingauthority: "Please Select Issuing Authority",
      sort: "Please Select Sort",
      attendancedate: "",
      attendancemonth: "Please Select Attendance Month",
      attendanceyear: "Please Select Attendance Year",
      productiondate: "",
      productionmonth: "Please Select Production Month",
      productionyear: "Please Select Production Year",
      signature: "Please Select Signature",
      seal: "Please Select Seal",
      pagesize: "Please Select pagesize",
      print: "Please Select Print Option",
      heading: "Please Select Header Option",
      issuedpersondetails: "",
    });
    // setHeadValue([])
    setSelectedHeadOpt([])
    // setHeader("")
    setCheckingArray([])
    setSelectedEmployeeValues([])
    setSelectedEmployee([])
    setIndexViewQuest(1)
    // setfooter("")
    setSealStatus("")
    setSignatureStatus("")
    setCompanyName("")
    setIssuingAutholrity([])
    setDepartmentCheck(false);
    setAllBranchValue(false);
    setButtonLoading(false)
    setBtnLoad(false)
    setBranchOptions([]);
    setUnitOptions([]);
    setTeamOptions([]);
    setEmployeenames([]);
    setChecking("");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };


  //get all brand master name.
  const fetchBrandMaster = async () => {

    const accessbranchs = accessbranch
      ? accessbranch.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
      : [];

    setPageName(!pageName);
    try {
      let res_freq = await axios.post(`${SERVICE.ACCESIBLEBRANCHALL_DOCUMENTPREPARATION}`, {
        assignbranch: accessbranchs,
        printed: "Not-Printed"
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setLoader(true);
      const answer = res_freq?.data?.documentPreparation?.length > 0 ? res_freq?.data?.documentPreparation?.filter(data => data?.printingstatus === "Not-Printed")?.map((item, index) => ({
        ...item,
        // ...item,
        serialNumber: index + 1,
        id: item?._id,
        approval: item?.approval === "sentforapproval" ? "Sent to Approval" : item?.approval === "approved" ? "Approved" : "Not yet sent",
        department: item?.department === "Please Select Department" ? "" : item?.department,
        date: moment(item.date).format("DD-MM-YYYY"),
        daystatus: item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(item),
      })) : [];
      setTemplateCreationArrayCreate(answer)
      setTemplateCreationArray(res_freq?.data?.overalldocuments);
      setChanged("ChangedStatus")
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchBrandMasterOverall = async () => {

    const accessbranchs = accessbranch
      ? accessbranch.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
      : [];

    setPageName(!pageName);
    try {
      let res_freq = await axios.post(`${SERVICE.ACCESIBLEBRANCHALL_DOCUMENTPREPARATION_OVERALL}`, {
        assignbranch: accessbranchs,
        printed: "Not-Printed"
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const answer = res_freq?.data?.overalldocuments?.length > 0 ? res_freq?.data?.overalldocuments?.filter(data => data?.printingstatus === "Not-Printed")?.map((item, index) => ({
        ...item,
        // ...item,
        serialNumber: index + 1,
        id: item?._id,
        approval: item?.approval === "sentforapproval" ? "Sent to Approval" : item?.approval === "approved" ? "Approved" : "Not yet sent",
        department: item?.department === "Please Select Department" ? "" : item?.department,
        date: moment(item.date).format("DD-MM-YYYY"),
        daystatus: item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(item),
      })) : [];
      setTemplateCreationArray(answer)
      setChanged("ChangedStatus")
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // console.log(checkingArray, 'jnsjnjs')
  useEffect(() => {
    TemplateDropdowns();
    DepartDropDowns();
    CompanyDropDowns();
    fetchBrandMaster();
  }, []);
  useEffect(() => {
    fetchBrandMaster();
  }, [Changed]);

  const delAreagrpcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchBrandMaster();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setAgendaEdit("");
    setUpdateGen(true)
  };

  //get single row to edit....
  const getApprovalDocument = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        approval: "sentforapproval",
        approvaldate: new Date()
      });
      // await fetchBrandMaster();
      setChanged(e)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const getViewFile = async (id) => {

    let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${id}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const fileUrl = `${BASE_URL}/uploadsDocuments/${response?.data?.sdocumentPreparation.approvedfilename}`;
    window.open(fileUrl, '_blank');
  }
  const getUpdatePrintingStatus = async (e, update) => {
    setPageName(!pageName);
    try {

      let response = await axios.post(SERVICE.FILTER_DOCUMENT_USER_LOGIN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        person: isUserRoleAccess.companyname,
      });
      if (response?.data?.user) {


        let res = await axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          printingstatus: "Printed",
          $inc: { printedcount: 1 },
          updatedby: update ? [...update, {
            name: isUserRoleAccess.companyname,
            date: new Date(),
          }] : []
        });
        // await fetchBrandMaster();
        setChanged(e)
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchEmailForUser = async (e, emailformat, fromemail, ccemail, bccemail) => {
    setLoading(true);
    if (headerOptions === "Please Select Print Options") {
      setButtonLoadingPreview(false);
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setPopupContentMalert("Please Select With Letter Head!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setLoadingMessage('Document is preparing...');

      let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      handleClickCloseLetterHead();
      const tempElementEmail = document?.createElement("div");
      tempElementEmail.innerHTML = emailformat;
      let textedEmail = tempElementEmail.innerHTML;
      let findMethodEmail = textedEmail
        .replaceAll("$TEMPLATENAME$", response.data.sdocumentPreparation?.template ? response.data.sdocumentPreparation?.template : "")
        .replaceAll("$REFERENCEID$", response.data.sdocumentPreparation?.templateno ? response.data.sdocumentPreparation?.templateno : "")
        .replaceAll("$CANDIDATENAME$", response.data.sdocumentPreparation?.person ? response.data.sdocumentPreparation?.person : "")
        .replaceAll("$COMPANYNAME$", isUserRoleAccess?.companyname ? isUserRoleAccess?.companyname : "")
        .replaceAll("$DESIGNATION$", isUserRoleAccess?.designation ? isUserRoleAccess?.designation : "")
        .replaceAll("$COMPANY$", isUserRoleAccess?.company ? isUserRoleAccess?.company : "");


      const pdfElement = document.createElement("div");
      pdfElement.innerHTML = response.data.sdocumentPreparation.document;

      const styleElement = document.createElement("style");
      styleElement.textContent = `
           .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
           .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
           .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
           .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
           .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
           .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
           .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
           .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
           .ql-align-right { text-align: right; } 
           .ql-align-left { text-align: left; } 
           .ql-align-center { text-align: center; } 
           .ql-align-justify { text-align: justify; } 
         `;
      pdfElement.appendChild(styleElement);

      // pdfElement.appendChild(styleElement);
      const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
        const totalPages = doc.internal.getNumberOfPages();
        const margin = 15; // Adjust as needed
        const footerHeight = 15; // Adjust as needed
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          // Add header
          doc.setFontSize(12);
          // doc.text(convertToNumberedList(head), pageWidth / 2, 10, { align: 'center' });
          const headerImgWidth = pageWidth * 0.95; // Adjust as needed
          const headerImgHeight = pageHeight * 0.09;// Adjust as needed
          //const headerX = (pageWidth - headerImgWidth) / 2;
          // const headerY = 6; // Adjust as needed for header position
          const headerX = 5; // Start from the left
          const headerY = 3.5; // Start from the top
          doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

          const imgWidth = pageWidth * 0.50; // 75% of page width
          const imgHeight = pageHeight * 0.25; // 50% of page height
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2 - 20;
          doc.setFillColor(0, 0, 0, 0.1);
          doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
          // Add footer
          doc.setFontSize(10);
          // doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
          // Add footer image stretched to page width
          const footerImgWidth = pageWidth * 0.95; // Stretch to full page width
          const footerImgHeight = pageHeight * 0.067; // Adjust height as needed
          const footerX = 5; // Start from the left
          const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
          doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
          if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
            const textY = footerY - 3;
            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
          } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
            const textY = footerY - 3;
            doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
          }
          // Add QR code and statement only on the last page

          if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
            if (i === totalPages) {
              // Add QR code in the left corner
              const qrCodeWidth = 25; // Adjust as needed
              const qrCodeHeight = 25; // Adjust as needed
              const qrCodeX = footerX; // Left corner
              const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
              doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



              // Add statement on the right of the QR code
              const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
              const statementY1 = qrCodeY + 10; // Align with the top of the QR code
              const statementY2 = statementY1 + 5; // Adjust as needed for spacing
              const statementY3 = statementY2 + 5; // Adjust as needed for spacing



              // Add statements
              const statementText1 = '1. Scan to verify the authenticity of this document.';
              const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
              const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

              doc.setFontSize(12);
              doc.text(statementText1, statementX, statementY1);
              doc.text(statementText2, statementX, statementY2);
              doc.text(statementText3, statementX, statementY3);
              // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
            }
          }
        }
      };


      return new Promise((resolve, reject) => {
        html2pdf()
          .from(pdfElement)
          .set({
            margin: response.data.sdocumentPreparation?.pagesize == "A3"
              ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
                : (head === "" && foot !== "") ? [20, 15, 45, 15]
                  : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                    [20, 15, 20, 15])

              :
              ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
                : (head === "" && foot !== "") ? [15, 15, 45, 15]
                  : (head !== "" && foot === "") ? [30, 15, 15, 15] : [15, 15, 15, 15]),
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
              unit: "mm",
              format: [
                parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
                parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
              ],
              orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
            },
            lineHeight: 0, // Increased line spacing
            fontSize: 12,
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          }).toPdf().get('pdf').then(async (pdf) => {
            const img = new Image();
            img.src = response.data.sdocumentPreparation?.watermark;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.globalAlpha = 0.1;
              ctx.drawImage(img, 0, 0);
              const watermarkImage = canvas.toDataURL('image/png');

              const qrImg = new Image();
              qrImg.src = response.data.sdocumentPreparation?.qrcode;
              qrImg.onload = () => {
                const qrCanvas = document.createElement('canvas');
                qrCanvas.width = qrImg.width;
                qrCanvas.height = qrImg.height;
                const qrCtx = qrCanvas.getContext('2d');
                qrCtx.drawImage(qrImg, 0, 0);
                const qrCodeImage = qrCanvas.toDataURL('image/png');

                addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);

                // Convert the PDF to a Blob
                const pdfBlob = pdf.output('blob');

                // Create FormData and append the PDF Blob
                const formData = new FormData();
                formData.append('file', pdfBlob, `${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);

                // Convert Blob to base64 string
                const reader = new FileReader();
                reader.readAsDataURL(pdfBlob);
                reader.onloadend = async () => {
                  setLoadingMessage('Document is converting to Email format...');
                  const base64String = reader.result.split(',')[1]; // Extract base64 string without data:image/jpeg;base64,

                  let res_module = await axios.post(SERVICE.DOCUMENT_PREPARATION_MAIL, {
                    document: base64String,
                    companyname: response?.data?.sdocumentPreparation?.person,
                    letter: response?.data?.sdocumentPreparation?.template,
                    email: response?.data?.sdocumentPreparation?.email,
                    emailformat: findMethodEmail,
                    fromemail: fromemail,
                    ccemail: ccemail,
                    bccemail: bccemail,
                    tempid: response?.data?.sdocumentPreparation?.templateno

                  }, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },
                  });
                  setLoadingMessage('Email is Sending...');
                  if (res_module.status === 200) {
                    setLoading(false)
                    NotificationManager.success('Email Sent Successfully 👍', '', 2000);
                  } else {
                    setLoading(false)
                  }

                  resolve(base64String);
                };


              };
            };
            if (response?.data?.sdocumentPreparation?.mail === "Send") {
              let res = await axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                mail: "Re-send",
              });
              await fetchBrandMaster();
            }

          }).catch(err => {
            setLoading(false)
            reject(err)
          });
      });
    }
  };



  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleClickOpeninfo();
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //frequency master name updateby edit page...
  let updateby = documentPreparationEdit?.updatedby;
  let addedby = documentPreparationEdit?.addedby;
  let frequencyId = documentPreparationEdit?._id;

  //image
  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Employee Document Preparation.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "EmployeeDocumentPreparation",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = (data) => {
    setItems(data);
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
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
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


  const handleOnChangeAllotDetails = (id, value) => {
    const answer = items?.map(data => {
      if (data?.id === id) {
        data.printoptions = value;
        return data
      }
      return data
    })
    setItems(answer)
  }
  const getCode = async (e, pagename) => {
    setPageName(!pageName)
    try {
      let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: e?.company,
        branch: e?.branch,
      });
      if (res?.data?.templatecontrolpanel) {
        const ans = res?.data?.templatecontrolpanel ?
          res?.data?.templatecontrolpanel?.templatecontrolpanellog[res?.data?.templatecontrolpanel?.templatecontrolpanellog?.length - 1] : "";
        setPersonId(ans);
        handleClickOpenLetterHeader(pagename);
        setDataTableId(e?.id);
      }

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert)
    }
  };
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "referenceno",
      headerName: "Reference No",
      flex: 0,
      width: 150,
      hide: !columnVisibility.referenceno,
      headerClassName: "bold-header",
    },
    {
      field: "templateno",
      headerName: "Template No",
      flex: 0,
      width: 150,
      hide: !columnVisibility.templateno,
      headerClassName: "bold-header",
    },
    {
      field: "template",
      headerName: "Template",
      flex: 0,
      width: 150,
      hide: !columnVisibility.template,
      headerClassName: "bold-header",
    },
    {
      field: "employeemode",
      headerName: "Employee Mode",
      flex: 0,
      width: 150,
      hide: !columnVisibility.employeemode,
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
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 150,
      hide: !columnVisibility.unit,
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
      field: "person",
      headerName: "Person",
      flex: 0,
      width: 150,
      hide: !columnVisibility.person,
      headerClassName: "bold-header",
    },
    {
      field: "document",
      headerName: "Documents",
      flex: 0,
      width: 250,
      minHeight: "40px",
      hide: !columnVisibility.document,
      cellRenderer: (params) => (
        <Grid>
          {/* {params.data?.approval === "Approved" && */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              getCode(params?.data, "Table View")
            }}

          >
            View
          </Button>
          &ensp;
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF9800",
              color: "white",
              "&:hover": {
                backgroundColor: "#E68900",
              },
            }}

            onClick={() => {
              getCode(params?.data, "Table Print")
            }}
          >
            Print
          </Button>

        </Grid>
      ),
    },
    {
      field: "printingstatus",
      headerName: "Printing Status",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.printingstatus,

    },
    // {
    //   field: "approval",
    //   headerName: "Approval Status",
    //   flex: 0,
    //   width: 250,
    //   minHeight: "40px",
    //   hide: !columnVisibility.approval,
    //   cellRenderer: (params) => (
    //     <Grid>
    //       <Typography
    //         color={params?.data?.approval === "Sent to Approval" ? "#009688" : params?.data?.approval === "Approved" ? "#4caf50" : "#c62828"}
    //         marginTop={1.5}>
    //         {params?.data?.approval}
    //       </Typography>
    //     </Grid>
    //   ),
    // },

    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.email,
      cellRenderer: (params) => (
        <Grid>
          {isUserRoleCompare?.includes("menuemployeedocumentpreparationmail") && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: params?.data?.mail === "Send" ? "#4CAF50" : "#F44336", // Green for "Send", Red otherwise
                color: "white",
                "&:hover": {
                  backgroundColor: params?.data?.mail === "Send" ? "#45A049" : "#D32F2F",
                },
              }}
              onClick={() => {
                extractEmailFormat(params.data.person, params.data.id)
              }}

            >
              {params?.data?.mail}
            </Button>
          )}
        </Grid>
      ),

    },
    {
      field: "issuedpersondetails",
      headerName: "Issued Person Details",
      flex: 0,
      width: 150,
      hide: !columnVisibility.issuedpersondetails,
      headerClassName: "bold-header",
    },
    {
      field: "issuingauthority",
      headerName: "Issuing Authority",
      flex: 0,
      width: 150,
      hide: !columnVisibility.issuingauthority,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 300,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("demployeedocumentpreparation") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vemployeedocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iemployeedocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];



  const downloadPdfTesdtTable = async (e) => {

    if (headerOptions === "Please Select Print Options") {
      setButtonLoadingPreview(false);
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setPopupContentMalert("Please Select With Letter Head!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      // Create a new div element to hold the Quill content
      let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await getUpdatePrintingStatus(response.data.sdocumentPreparation?._id, response.data.sdocumentPreparation?.updatedby)
      const pdfElement = document.createElement("div");
      pdfElement.innerHTML = response.data.sdocumentPreparation.document;
      // Add custom styles to the PDF content
      const styleElement = document.createElement("style");
      styleElement.textContent = `
     .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
     .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
     .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
     .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
     .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
     .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
     .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
     .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
     .ql-align-right { text-align: right; } 
     .ql-align-left { text-align: left; } 
     .ql-align-center { text-align: center; } 
     .ql-align-justify { text-align: justify; } 
   `;

      pdfElement.appendChild(styleElement);

      // pdfElement.appendChild(styleElement);
      const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(12);
          const headerImgWidth = pageWidth * 0.95;
          const headerImgHeight = pageHeight * 0.09;
          const headerX = 5;
          const headerY = 3.5;
          doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

          const imgWidth = pageWidth * 0.50;
          const imgHeight = pageHeight * 0.25;
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2 - 20;
          doc.setFillColor(0, 0, 0, 0.1);
          doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
          doc.setFontSize(10);
          const footerImgWidth = pageWidth * 0.95;
          const footerImgHeight = pageHeight * 0.067;
          const footerX = 5;
          const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
          doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
          if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
            const textY = footerY - 3;
            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
          } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
            const textY = footerY - 3;
            doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
          }

          if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
            if (i === totalPages) {
              const qrCodeWidth = 25; // Adjust as needed
              const qrCodeHeight = 25; // Adjust as needed
              const qrCodeX = footerX; // Left corner
              const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
              doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



              // Add statement on the right of the QR code
              const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
              const statementY1 = qrCodeY + 10; // Align with the top of the QR code
              const statementY2 = statementY1 + 5; // Adjust as needed for spacing
              const statementY3 = statementY2 + 5; // Adjust as needed for spacing



              // Add statements
              const statementText1 = '1. Scan to verify the authenticity of this document.';
              const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
              const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

              doc.setFontSize(12);
              doc.text(statementText1, statementX, statementY1);
              doc.text(statementText2, statementX, statementY2);
              doc.text(statementText3, statementX, statementY3);
              // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
            }
          }
        }
      };

      // Convert the HTML content to PDF
      html2pdf()
        .from(pdfElement)
        .set({
          margin: response?.data?.sdocumentPreparation?.pagesize == "A3"
            ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
              : (head === "" && foot !== "") ? [20, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
              : (head === "" && foot !== "") ? [15, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: {
            unit: "mm",
            format: [
              parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
              parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
            ],
            orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
          },
          lineHeight: 0, // Increased line spacing
          fontSize: 12,
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }).toPdf().get('pdf').then((pdf) => {
          // Convert the watermark image to a base64 string
          const img = new Image();
          img.src = response?.data?.sdocumentPreparation?.watermark;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = 0.1;
            ctx.drawImage(img, 0, 0);
            const watermarkImage = canvas.toDataURL('image/png');

            // Add QR code image
            const qrImg = new Image();
            qrImg.src = response.data.sdocumentPreparation?.qrcode; // QR code image URL
            if (response.data.sdocumentPreparation?.qrCodeNeed) {
              qrImg.onload = () => {
                const qrCanvas = document.createElement('canvas');
                qrCanvas.width = qrImg.width;
                qrCanvas.height = qrImg.height;
                const qrCtx = qrCanvas.getContext('2d');
                qrCtx.drawImage(qrImg, 0, 0);
                const qrCodeImage = qrCanvas.toDataURL('image/png');

                // Add page numbers and watermark to each page
                addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
                // Save the PDF
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const printWindow = window.open(pdfUrl);
                // pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
                handleClickCloseLetterHead();
              };
            }
            else {
              addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
              // Save the PDF
              const pdfBlob = pdf.output('blob');
              const pdfUrl = URL.createObjectURL(pdfBlob);
              const printWindow = window.open(pdfUrl);
              // pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
              handleClickCloseLetterHead();
            }

          };
        });

    }
  };
  const downloadPdfTesdtTablePrint = async (e) => {

    if (headerOptions === "Please Select Print Options") {
      setButtonLoadingPreview(false);
      setPopupContentMalert("Please Select Print Options!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (headerOptions === "With Letter Head" && selectedHeadOpt?.length < 1) {
      setPopupContentMalert("Please Select With Letter Head!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      // Create a new div element to hold the Quill content
      let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await getUpdatePrintingStatus(response.data.sdocumentPreparation?._id, response.data.sdocumentPreparation?.updatedby)
      const pdfElement = document.createElement("div");
      pdfElement.innerHTML = response.data.sdocumentPreparation.document;
      // Add custom styles to the PDF content
      const styleElement = document.createElement("style");
      styleElement.textContent = `
     .ql-indent-1 { margin-left: 75px; } /* Adjust margin for indent-1 class */
     .ql-indent-2 { margin-left: 150px; } /* Adjust margin for indent-2 class */
     .ql-indent-3 { margin-left: 225px; } /* Adjust margin for indent-3 class */
     .ql-indent-4 { margin-left: 275px; } /* Adjust margin for indent-4 class */
     .ql-indent-5 { margin-left: 325px; } /* Adjust margin for indent-5 class */
     .ql-indent-6 { margin-left: 375px; } /* Adjust margin for indent-6 class */
     .ql-indent-7 { margin-left: 425px; } /* Adjust margin for indent-7 class */
     .ql-indent-8 { margin-left: 475px; } /* Adjust margin for indent-8 class */
     .ql-align-right { text-align: right; } 
     .ql-align-left { text-align: left; } 
     .ql-align-center { text-align: center; } 
     .ql-align-justify { text-align: justify; } 
   `;

      pdfElement.appendChild(styleElement);

      // pdfElement.appendChild(styleElement);
      const addPageNumbersAndHeadersFooters = (doc, watermarkImage, qrCodeImage) => {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(12);
          const headerImgWidth = pageWidth * 0.95;
          const headerImgHeight = pageHeight * 0.09;
          const headerX = 5;
          const headerY = 3.5;
          doc.addImage(head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

          const imgWidth = pageWidth * 0.50;
          const imgHeight = pageHeight * 0.25;
          const x = (pageWidth - imgWidth) / 2;
          const y = (pageHeight - imgHeight) / 2 - 20;
          doc.setFillColor(0, 0, 0, 0.1);
          doc.addImage(watermarkImage, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST', 0.01);
          doc.setFontSize(10);
          const footerImgWidth = pageWidth * 0.95;
          const footerImgHeight = pageHeight * 0.067;
          const footerX = 5;
          const footerY = (pageHeight * 1) - (foot === "" ? 15 : footerImgHeight - 3);
          doc.addImage(foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
          if (response?.data?.sdocumentPreparation?.pagenumberneed === "All Pages") {
            const textY = footerY - 3;
            doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, textY, { align: 'center' });
          } else if (response?.data?.sdocumentPreparation?.pagenumberneed === "End Page" && i === totalPages) {
            const textY = footerY - 3;
            doc.text(`End of the document`, pageWidth / 2, textY, { align: 'center' });
          }

          if (response?.data?.sdocumentPreparation?.qrCodeNeed) {
            if (i === totalPages) {
              const qrCodeWidth = 25; // Adjust as needed
              const qrCodeHeight = 25; // Adjust as needed
              const qrCodeX = footerX; // Left corner
              const qrCodeY = footerY - qrCodeHeight - 4; // 15 units above the footer image
              doc.addImage(qrCodeImage, 'PNG', qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);



              // Add statement on the right of the QR code
              const statementX = qrCodeX + qrCodeWidth + 10; // 10 units right of the QR code
              const statementY1 = qrCodeY + 10; // Align with the top of the QR code
              const statementY2 = statementY1 + 5; // Adjust as needed for spacing
              const statementY3 = statementY2 + 5; // Adjust as needed for spacing



              // Add statements
              const statementText1 = '1. Scan to verify the authenticity of this document.';
              const statementText2 = `2. This document was generated on ${moment(new Date()).format("DD-MM-YYYY hh:mm a")}`;
              const statementText3 = `3. For questions, contact us at ${fromEmail}.`;

              doc.setFontSize(12);
              doc.text(statementText1, statementX, statementY1);
              doc.text(statementText2, statementX, statementY2);
              doc.text(statementText3, statementX, statementY3);
              // doc.text(statementText, statementX, statementY, { maxWidth: lineWidth });
            }
          }
        }
      };

      // Convert the HTML content to PDF
      html2pdf()
        .from(pdfElement)
        .set({
          margin: response?.data?.sdocumentPreparation?.pagesize == "A3"
            ? ((head !== "" && foot !== "") ? [45, 15, 45, 15]
              : (head === "" && foot !== "") ? [20, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((head !== "" && (foot !== "")) ? [30, 15, 45, 15]
              : (head === "" && foot !== "") ? [15, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: {
            unit: "mm",
            format: [
              parseFloat(response.data.sdocumentPreparation?.pagewidth) || 210, // Default to A4 width (210mm) if width is not defined or invalid
              parseFloat(response.data.sdocumentPreparation?.pageheight) || 297 // Default to A4 height (297mm) if height is not defined or invalid
            ],
            orientation: "portrait" // Use the orientation value from agendaEditStyles, fallback to default "portrait" if not set
          },
          lineHeight: 0, // Increased line spacing
          fontSize: 12,
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }).toPdf().get('pdf').then((pdf) => {
          // Convert the watermark image to a base64 string
          const img = new Image();
          img.src = response?.data?.sdocumentPreparation?.watermark;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.globalAlpha = 0.1;
            ctx.drawImage(img, 0, 0);
            const watermarkImage = canvas.toDataURL('image/png');

            // Add QR code image
            const qrImg = new Image();
            qrImg.src = response.data.sdocumentPreparation?.qrcode; // QR code image URL
            if (response.data.sdocumentPreparation?.qrCodeNeed) {
              qrImg.onload = () => {
                const qrCanvas = document.createElement('canvas');
                qrCanvas.width = qrImg.width;
                qrCanvas.height = qrImg.height;
                const qrCtx = qrCanvas.getContext('2d');
                qrCtx.drawImage(qrImg, 0, 0);
                const qrCodeImage = qrCanvas.toDataURL('image/png');

                // Add page numbers and watermark to each page
                addPageNumbersAndHeadersFooters(pdf, watermarkImage, qrCodeImage);
                // // Save the PDF
                // const pdfBlob = pdf.output('blob');
                // const pdfUrl = URL.createObjectURL(pdfBlob);
                // const printWindow = window.open(pdfUrl);
                pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
                handleClickCloseLetterHead();
              };
            }
            else {
              addPageNumbersAndHeadersFooters(pdf, watermarkImage, "");
              // // Save the PDF
              // const pdfBlob = pdf.output('blob');
              // const pdfUrl = URL.createObjectURL(pdfBlob);
              // const printWindow = window.open(pdfUrl);
              pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
              handleClickCloseLetterHead();
            }

          };
        });

    }
  };




  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      date: item.date,
      approval: item.approval,
      referenceno: item.referenceno,
      templateno: item.templateno,
      template: item.template,
      documentname: item.documentname,
      mail: item.mail,
      printingstatus: item.printingstatus,
      employeemode: item.employeemode,
      department: item.department === "Please Select Department" ? "" : item.department,
      company: item.company === "Please Select Company" ? "" : item.company,
      branch: item.branch === "Please Select Branch" ? "" : item.branch,
      unit: item.unit === "Please Select Unit" ? "" : item.unit,
      team: item.team === "Please Select Team" ? "" : item.team,
      person: item.person,
      issuedpersondetails: item.issuedpersondetails,
      issuingauthority: item.issuingauthority,
      daystatus: item.daystatus,
      printoptions: item.printoptions,
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
              {" "}
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
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  let newvalues = employeeControlPanel
    ? value + "_" + `000${checkingArray?.length === 0 ? 1 : (checkingArray?.length + 1)}` : "Man" + "#" + ((templateCreationValue?.tempcode === "" || templateCreationValue?.tempcode === undefined) ? ""
      : templateCreationValue?.tempcode) + "_" + "0001";

  // let refNo = templateCreationArray[templateCreationArray.length - 1].templateno;
  // let codenum = refNo.split("#");
  // let prefixLength = Number(codenum[1]) + 1;
  // let prefixString = String(prefixLength);
  // let postfixLength = prefixString.length == 1 ? 000${prefixString} : prefixString.length == 2 ? 00${prefixString} : prefixString.length == 3 ? 0${prefixString} : prefixString.length == 4 ? 0${prefixString} : prefixString.length == 5 ? 0${prefixString} : prefixString.length == 6 ? 0${prefixString} : prefixString.length == 7 ? 0${prefixString} : prefixString.length == 8 ? 0${prefixString} : prefixString.length == 9 ? 0${prefixString} : prefixString.length == 10 ? 0${prefixString} : prefixString

  // let newval = "VISIT#" + postfixLength;


  return (
    <Box>
      <Headtitle title={"DOCUMENT PREPARATION"} />
      <PageHeading title="Employee Document Preparation" modulename="Human Resources" submodulename="HR Documents" mainpagename="Employee Documents" subpagename="Employee Document Preparation" subsubpagename="" />

      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Employee Document Preparation</Typography> */}

      <>
        {isUserRoleCompare?.includes("aemployeedocumentpreparation") && (


          <Box sx={userStyle.selectcontainer}>
            <Typography>
              Add Employee Document Preparation
            </Typography>
            <br /> <br />
            <>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="text" value={moment(date).format("DD-MM-YYYY")} />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Template <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={templateValues}
                      value={{ label: documentPrepartion.template, value: documentPrepartion.template }}
                      onChange={(e) => {
                        setDocumentPrepartion({
                          ...documentPrepartion,
                          template: e.value,
                          documentname: e.documentname,
                          sign: "Please Select Signature",
                          sealing: "Please Select Seal",
                          person: "Please Select Person",
                          employeemode: "Please Select Employee Mode"
                        });
                        setSealPlacement("")
                        setSignature("")
                        setChecking("");
                        handleEmployeeModeOptions(e)
                        setTemplateCreationValue(e)
                        setSignatureStatus("")
                        setSealStatus("")
                        setCheckingArray([])
                        setIndexViewQuest(1)
                        setSelectedEmployeeValues([])
                        setSelectedEmployee([])

                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Mode <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={employeeModeOptions}
                      value={{ label: documentPrepartion.employeemode, value: documentPrepartion.employeemode }}
                      onChange={(e) => {
                        setDocumentPrepartion({
                          ...documentPrepartion,
                          employeemode: e.value,
                          department: "Please Select Department",
                          company: "Please Select Company",
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          person: "Please Select Person",
                        });

                        setEmployeeMode(e.value);
                        setDepartmentCheck(false);
                        setAllBranchValue(false);
                        setGenerateData(false);
                        setChecking("")
                        setCheckingArray([])
                        setEmployeenames([])
                        // setCompanyOptions([])
                        setBranchOptions([])
                        setUnitOptions([])
                        setSelectedEmployeeValues([])
                        setSelectedEmployee([])
                        setIndexViewQuest(1)
                        setTeamOptions([])
                        // fetchOpenDialogBox(e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={[{ label: "Document", value: "Document" },
                      { label: "Attendance", value: "Attendance" },
                      { label: "Production", value: "Production" }
                      ]}
                      value={{ label: documentPrepartion.reason, value: documentPrepartion.reason }}
                      onChange={(e) => {
                        setDocumentPrepartion({
                          ...documentPrepartion,
                          reason: e.value,
                          productiondate: "",
                          productionmonth: "Please Select Production Month",
                          attendancedate: "",
                          attendancemonth: "Please Select Attendance Month",
                          sort: "Please Select Sort",
                          sign: "Please Select Signature",
                          sealing: "Please Select Seal",
                          person: "Please Select Person",

                        });
                        setProductionDateStatus("")
                        setAttendanceDateStatus("")
                        setAttendanceMonthStatus("")
                        setProductionMonthStatus("")
                        setChecking("")
                        setCheckingArray([])
                        setSelectedEmployeeValues([])
                        setSelectedEmployee([])

                      }}
                    />
                  </FormControl>
                </Grid>
                {documentPrepartion.employeemode != "Manual" &&
                  <>
                    <Grid item md={2} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={departmentOptions}
                          isDisabled={allBranchValue}
                          value={{ label: documentPrepartion.department, value: documentPrepartion.department }}
                          onChange={(e) => {
                            setDocumentPrepartion({
                              ...documentPrepartion,
                              department: e.value,
                              company: "Please Select Company",
                              branch: "Please Select Branch",
                              unit: "Please Select Unit",
                              person: "Please Select Person",
                              team: "Please Select Team",
                              issuingauthority: "Please Select Issuing Authority"
                            });
                            setDepartmentCheck(true);
                            fetchTeamNames(e.value, documentPrepartion.employeemode);
                            fetchIsssuingAuthority(e, "Department")
                            setSelectedEmployee([])
                            setSelectedEmployeeValues([])
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={1} xs={12} sm={12}>
                      <Typography>&nbsp;</Typography>
                      <Button sx={buttonStyles.btncancel} onClick={handleclearDepartment}>
                        Clear
                      </Button>
                    </Grid>
                  </>
                }
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={CompanyOptions}
                      isDisabled={departmentCheck}
                      value={{ label: documentPrepartion.company, value: documentPrepartion.company }}
                      onChange={(e) => {
                        BranchDropDowns(e)
                        UnitDropDowns(e.value);
                        setAllBranch(e.value);
                        setAllBranchValue(true);
                        setTeamOptions([])
                        setDocumentPrepartion({
                          ...documentPrepartion,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          person: "Please Select Person",
                          signature: "Please Select Signature",
                          seal: "Please Select Seal"
                        });
                        setEmployeenames([]);
                        setSelectedEmployee([])
                        setSelectedEmployeeValues([])
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={BranchOptions}
                      isDisabled={departmentCheck}
                      value={{ label: documentPrepartion.branch, value: documentPrepartion.branch }}
                      onChange={(e) => {
                        UnitDropDowns(e.value);
                        setAllBranch(e.value);
                        setAllBranchValue(true);
                        if (documentPrepartion.employeemode === "Manual") {
                          TemplateDropdownsValueManual(documentPrepartion.company, e.value)
                        }
                        setDocumentPrepartion({
                          ...documentPrepartion,
                          branch: e.value,
                          unit: "Please Select Unit",
                          team: "Please Select Team",
                          person: "Please Select Person",
                        });
                        setEmployeenames([]);
                        TemplateManualDropDowns(templateCreationValue, documentPrepartion.employeemode, documentPrepartion.company, e.value)
                        setTeamOptions([])
                        fetchIsssuingAuthorityManual(e.value)
                        setSelectedEmployee([])
                        setSelectedEmployeeValues([])
                      }}
                    />
                  </FormControl>
                </Grid>

                {documentPrepartion.employeemode != "Manual" &&
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={UnitOptions}
                          isDisabled={departmentCheck}
                          value={{ label: documentPrepartion.unit, value: documentPrepartion.unit }}
                          onChange={(e) => {
                            fetchTeam(e.value);
                            setDocumentPrepartion({
                              ...documentPrepartion,
                              unit: e.value,
                              team: "Please Select Team",
                              person: "Please Select Person",
                            });
                            setEmployeenames([]);
                            setSelectedEmployee([])
                            setSelectedEmployeeValues([])
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={TeamOptions}
                          isDisabled={departmentCheck}
                          value={{ label: documentPrepartion.team, value: documentPrepartion.team }}
                          onChange={(e) => {
                            setDocumentPrepartion({
                              ...documentPrepartion,
                              team: e.value,
                              issuingauthority: "Please Select Issuing Authority"
                            });
                            fetchAllEmployee(e);
                            fetchIsssuingAuthority(e, "Team")
                            setSelectedEmployee([])
                            setSelectedEmployeeValues([])
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>}
                {((documentPrepartion.employeemode !== "Manual" && documentPrepartion?.reason !== "Document")) &&
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Person<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={employeenames}
                        value={{ label: documentPrepartion.person, value: documentPrepartion.person }}
                        onChange={(e) => {
                          setDocumentPrepartion({
                            ...documentPrepartion,
                            person: e.value,
                            sign: "Please Select Signature",
                            signature: "Please Select Signature",
                            sealing: "Please Select Seal",
                            sort: "Please Select Sort",
                            productiondate: "",
                            productionmonth: "Please Select Production Month",
                            attendancedate: "",
                            attendancemonth: "Please Select Attendance Month",
                          });

                          setEmployeeValue(e.value);
                          setEmployeeUserName(e.username);
                          TemplateDropdownsValue(templateCreationValue, e)
                          IdentifyUserCode(e)
                          setEmployeeControlPanel(e)
                          setChecking("")
                          setProductionDateStatus("")
                          setAttendanceDateStatus("")
                          setAttendanceMonthStatus("")
                          setProductionMonthStatus("")
                        }}
                      />
                    </FormControl>
                  </Grid>}
                {(documentPrepartion.employeemode !== "Manual" && documentPrepartion?.reason === "Document") &&
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Person<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={employeenames}
                        value={selectedEmployee}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Emoployee"
                      />
                    </FormControl>
                  </Grid>
                }

                {
                  documentPrepartion.reason === "Attendance" &&
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Sort<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={[{ label: "Date", value: "Date" },
                          { label: "Month", value: "Month" },
                          ]}
                          value={{ label: documentPrepartion?.sort, value: documentPrepartion?.sort }}
                          onChange={(e) => {
                            setDocumentPrepartion({
                              ...documentPrepartion,
                              sort: e.value,
                              productiondate: "",
                              productionmonth: "Please Select Production Month",
                              attendancedate: "",
                              attendancemonth: "Please Select Attendance Month",
                              sign: "Please Select Signature",
                              sealing: "Please Select Seal",
                            });
                            setSortingStatus(e.value)
                            setProductionDateStatus("")
                            setAttendanceDateStatus("")
                            setAttendanceMonthStatus("")
                            setProductionMonthStatus("")
                            setChecking("")
                          }}
                        />
                      </FormControl>
                    </Grid>

                    {
                      sortingStatus === "Date" ? <>
                        <Grid item md={2} xs={12} sm={12}>
                          <Box>
                            <FormControl fullWidth size="small">
                              <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                              <OutlinedInput id="component-outlined"
                                type="date"
                                value={documentPrepartion?.attendancedate}
                                onChange={(e) => {
                                  setDocumentPrepartion({
                                    ...documentPrepartion,
                                    attendancedate: e?.target?.value,
                                    sign: "Please Select Signature",
                                    sealing: "Please Select Seal",
                                  });
                                  setChecking("")
                                  setAttendanceMonthStatus("");
                                  setProductionDateStatus("")
                                  setProductionMonthStatus("")
                                  fetchAttendanceDateStatus(employeeUserName, e?.target?.value)
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                      </> : sortingStatus === "Month" ? <>
                        <Grid item md={3} xs={12} sm={12}>
                          <Box>
                            <FormControl fullWidth size="small">
                              <Typography>Month<b style={{ color: "red" }}>*</b></Typography>
                              <Selects
                                maxMenuHeight={300}
                                options={months}
                                value={{ label: documentPrepartion?.attendancemonth, value: documentPrepartion?.attendancemonth }}
                                onChange={handleMonthChange}

                              />
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography> Select Year<b style={{ color: "red" }}>*</b></Typography>
                            <Selects
                              maxMenuHeight={200}
                              styles={colourStyles}
                              options={availableYears}
                              value={{ label: documentPrepartion?.attendanceyear, value: documentPrepartion?.attendanceyear }}
                              onChange={handleYearChange}
                            />
                          </FormControl>
                        </Grid>
                      </> : ""
                    }



                  </>
                }
                {
                  documentPrepartion.reason === "Production" &&
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Sort<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={[{ label: "Date", value: "Date" },
                          { label: "Month", value: "Month" },
                          ]}
                          value={{ label: documentPrepartion?.sort, value: documentPrepartion?.sort }}
                          onChange={(e) => {
                            setDocumentPrepartion({
                              ...documentPrepartion,
                              sort: e.value,
                              productiondate: "",
                              productionmonth: "Please Select Production Month",
                              attendancedate: "",
                              attendancemonth: "Please Select Attendance Month",
                              sign: "Please Select Signature",
                              sealing: "Please Select Seal",
                            });
                            setSortingStatus(e.value)
                            setProductionDateStatus("")
                            setAttendanceDateStatus("")
                            setAttendanceMonthStatus("")
                            setProductionMonthStatus("")
                          }}
                        />
                      </FormControl>
                    </Grid>

                    {
                      sortingStatus === "Date" ? <>
                        <Grid item md={2} xs={12} sm={12}>
                          <Box>
                            <FormControl fullWidth size="small">
                              <Typography>Date<b style={{ color: "red" }}>*</b></Typography>
                              <OutlinedInput id="component-outlined"
                                type="date"
                                value={documentPrepartion?.productiondate}
                                onChange={(e) => {
                                  setDocumentPrepartion({
                                    ...documentPrepartion,
                                    productiondate: e?.target?.value,
                                    sign: "Please Select Signature",
                                    sealing: "Please Select Seal",
                                  });
                                  fetchProductionDateStatus(employeeControlPanel, e?.target?.value)
                                }}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                      </> : sortingStatus === "Month" ? <>

                        <>
                          <Grid item md={3} xs={12} sm={12}>
                            <Box>
                              <FormControl fullWidth size="small">
                                <Typography>Month<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                  maxMenuHeight={300}
                                  options={months}
                                  value={{ label: documentPrepartion?.productionmonth, value: documentPrepartion?.productionmonth }}
                                  onChange={handleMonthChangeProduction}

                                />
                              </FormControl>
                            </Box>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography> Select Year<b style={{ color: "red" }}>*</b></Typography>
                              <Selects
                                maxMenuHeight={200}
                                styles={colourStyles}
                                options={availableYears}
                                value={{ label: documentPrepartion?.productionyear, value: documentPrepartion?.productionyear }}
                                onChange={handleYearChangeProduction}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      </> : ""
                    }

                  </>
                }
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Issuing Authority<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={issuingauthority}
                      value={{ label: documentPrepartion.issuingauthority, value: documentPrepartion.issuingauthority }}
                      onChange={(e) => {
                        setDocumentPrepartion({
                          ...documentPrepartion,
                          issuingauthority: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {(signatureStatus === "With") &&
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Signature<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={companyName?.documentsignature?.map(data => ({
                          ...data,
                          label: `${data.signaturename} -- ${data.employee}`,
                          value: `${data.signaturename} -- ${data.employee}`
                        }))}
                        value={{ label: documentPrepartion.signature, value: documentPrepartion.signature }}
                        onChange={(e) => {
                          setDocumentPrepartion({
                            ...documentPrepartion,
                            signature: e.value,
                            seal: "Please Select Seal"
                          });
                          setSignature(e?.document[0]?.preview)
                          setSignatureContent(e)
                          setSealPlacement("")
                        }}
                      />
                    </FormControl>
                  </Grid>}
                {(sealStatus !== 'Document' && sealStatus !== "" && sealStatus !== 'None') &&
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Seal<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={companyName?.documentseal?.map(data => ({
                          ...data,
                          label: `${data.seal} -- ${data.name}`,
                          value: `${data.seal} -- ${data.name}`
                        }))}
                        value={{ label: documentPrepartion.seal, value: documentPrepartion.seal }}
                        onChange={(e) => {
                          setDocumentPrepartion({
                            ...documentPrepartion,
                            seal: e.value,
                          });

                          setSealPlacement(e?.document[0]?.preview)
                        }}
                      />

                    </FormControl>
                  </Grid>}
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Page Number<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={[{ label: "All Pages", value: "All Pages" }, { label: "End Page", value: "End Page" }, { label: "No Need", value: "No Need" }]}
                      value={{ label: documentPrepartion.pagenumberneed, value: documentPrepartion.pagenumberneed }}
                      onChange={(e) => {
                        setDocumentPrepartion({
                          ...documentPrepartion,
                          pagenumberneed: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {
                  ((documentPrepartion?.employeemode === "Manual" && documentPrepartion?.branch !== "Please Select Branch") ||
                    (documentPrepartion?.employeemode !== "Manual" && selectedEmployee?.length > 0)) &&

                  <>

                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Document Need
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={[{ label: "Print Document", value: "Print Document" }, { label: "Employee Approval", value: "Employee Approval" }]}
                          value={{ label: documentPrepartion.documentneed, value: documentPrepartion.documentneed }}
                          onChange={(e) => {
                            setDocumentPrepartion({
                              ...documentPrepartion,
                              documentneed: e.value,
                            });
                          }}
                        />

                      </FormControl>
                    </Grid>

                    {documentPrepartion?.documentneed === "Employee Approval" &&
                      <>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Print Option<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              maxMenuHeight={300}
                              options={HeaderDropDowns}
                              value={{ label: documentPrepartion.printoptions, value: documentPrepartion.printoptions }}
                              onChange={(e) => {
                                setDocumentPrepartion({
                                  ...documentPrepartion,
                                  printoptions: e.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        {documentPrepartion.printoptions === "With Letter Head" && (
                          <Grid item md={documentPrepartion.printoptions === "With Letter Head" ? 4 : 3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                With Letter Head <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <MultiSelect
                                maxMenuHeight={300}
                                options={WithHeaderOptions}
                                value={selectedHeadOptAdd}
                                onChange={handleHeadChangeAdd}
                                valueRenderer={customValueRenderHeadFromAdd}
                              />
                            </FormControl>
                          </Grid>)}
                      </>

                    }
                  </>
                }

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{ "& .MuiSvgIcon-root": { fontSize: 40, marginTop: 1 } }}
                          checked={qrCodeNeed}
                          onChange={() => setQrCodeNeed((val) => !val)}
                          color="primary"
                        />
                      }
                      // sx={{marginTop: 1}}
                      label="QR Code"
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                </Grid>
                <Grid item md={12} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Generate
                  </Button>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Document <b style={{ color: "red" }}>*</b>
                    </Typography>
                    {
                      documentPrepartion?.employeemode === "Manual" ?
                        <ReactQuill style={{ height: "max-content", minHeight: "150px" }}
                          value={checking}
                          onChange={documentPrepartion?.employeemode === "Manual" ? setChecking : undefined}
                          readOnly={documentPrepartion?.employeemode !== "Manual"}
                          modules={{
                            toolbar: [[{ header: "1" }, { header: "2" },
                            { font: [] }], ["tab"], [{ size: [] }],
                            ["bold", "italic", "underline", "strike", "blockquote"],
                            [{ align: [] }],
                            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                            ["link", "image", "video"], ["clean"]]
                          }}


                          formats={["header", "font", "size", "bold", "italic", "underline", "strike", "align", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                        />
                        :
                        <>
                          {checkingArray?.map((text, index) => {
                            if (index === (indexViewQuest - 1)) {
                              return (
                                < Grid item md={12} sm={12} xs={12} >
                                  <FormControl fullWidth size="small">
                                    <Typography>
                                      <b> Documents List</b>
                                    </Typography>
                                    <Grid container spacing={2}>
                                      <Grid item md={11} sm={12} xs={12}>
                                        <ReactQuill style={{ height: "max-content", minHeight: "150px" }}
                                          value={text.data}
                                          readOnly={documentPrepartion?.employeemode !== "Manual"}
                                          modules={{
                                            toolbar: [[{ header: "1" }, { header: "2" },
                                            { font: [] }], ["tab"], [{ size: [] }],
                                            ["bold", "italic", "underline", "strike", "blockquote"],
                                            [{ align: [] }],
                                            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                            ["link", "image", "video"], ["clean"]]
                                          }}


                                          formats={["header", "font", "size", "bold", "italic", "underline", "strike", "align", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                                        />
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <br></br>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                          {(indexViewQuest > 1 && (indexViewQuest) <= checkingArray?.length) ?
                                            <Button variant="contained" onClick={handlePrevPage}>Prev Page</Button>
                                            : null
                                          }
                                          {(((indexViewQuest) < checkingArray?.length)) ?
                                            <Button variant="contained" onClick={handleNextPage}>Next Page</Button>
                                            : null
                                          }

                                        </div>
                                      </Grid>
                                      <Grid item md={1} sm={12} xs={12}>
                                        <Button
                                          sx={userStyle.buttondelete}
                                          onClick={(e) => {
                                            HandleDeleteText(index)
                                          }}
                                        >
                                          <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} style={{ fontsize: "large" }} />
                                        </Button>

                                      </Grid>
                                    </Grid>
                                  </FormControl>

                                </Grid>
                              )
                            }
                          }
                          )}
                          {/* {checkingArray?.map((data, index) => (
                            // Your JSX goes here, e.g.:
                            <div key={index}>

                              <ReactQuill style={{ height: "max-content", minHeight: "150px" }}
                                value={data}
                                readOnly={documentPrepartion?.employeemode !== "Manual"}
                                modules={{
                                  toolbar: [[{ header: "1" }, { header: "2" },
                                  { font: [] }], ["tab"], [{ size: [] }],
                                  ["bold", "italic", "underline", "strike", "blockquote"],
                                  [{ align: [] }],
                                  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                                  ["link", "image", "video"], ["clean"]]
                                }}


                                formats={["header", "font", "size", "bold", "italic", "underline", "strike", "align", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                              />
                              <br />
                            </div>
                          ))} */}
                        </>



                    }



                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <div>
                {/* <QRCode value={generateRedirectUrl()} /> */}

              </div>
              <br />
              <br />
              <br />
              <br />
              {documentPrepartion.employeemode === "Manual" ?
                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    {checking ? (
                      <LoadingButton
                        loading={buttonLoadingPreview}
                        variant="contained"
                        color="primary"
                        sx={userStyle.buttonadd}
                        onClick={() => {
                          documentPrepartion?.documentneed === "Employee Approval" ? handlePreviewDocumentManual() : handleClickOpenLetterHeader("Preview Manual")
                        }
                        }
                      // onClick={handlePreviewDocumentManual}
                      >
                        Preview
                      </LoadingButton>
                    ) : (
                      ""
                    )}
                  </Grid>
                  &ensp;
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    {checking ? (
                      <LoadingButton
                        loading={buttonLoading}
                        variant="contained"
                        color="primary"
                        sx={userStyle.buttonadd}
                        onClick={() =>
                          documentPrepartion?.documentneed === "Employee Approval" ? handlePrintDocumentManual() : handleClickOpenLetterHeader("Print Manual")}
                      // onClick={handlePrintDocumentManual}
                      >
                        Print
                      </LoadingButton>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <LoadingButton loading={btnload} variant="contained" color="primary"
                      sx={buttonStyles.buttonsubmit}
                      onClick={handleSubmitedManual}>
                      Save
                    </LoadingButton>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button sx={buttonStyles.btncancel} onClick={handleclearedManual}>
                      Clear
                    </Button>
                  </Grid>
                </Grid>
                :
                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    {checkingArray?.length > 0 ? (
                      <LoadingButton
                        loading={buttonLoadingPreview}
                        variant="contained"
                        color="primary"
                        sx={userStyle.buttonadd}
                        onClick={() => documentPrepartion?.documentneed === "Employee Approval" ? handlePreviewDocument(indexViewQuest - 1) : handleClickOpenLetterHeader("Preview")}
                      // onClick={() => handlePreviewDocument(indexViewQuest - 1)}
                      >
                        Preview
                      </LoadingButton>
                    ) : (
                      ""
                    )}
                  </Grid>
                  &ensp;
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    {checkingArray?.length > 0 ? (
                      <LoadingButton
                        loading={buttonLoading}
                        variant="contained"
                        color="primary"
                        sx={userStyle.buttonadd}
                        onClick={() => documentPrepartion?.documentneed === "Employee Approval" ? handlePrintDocument(indexViewQuest - 1) : handleClickOpenLetterHeader("Print")}
                      // onClick={() => handlePrintDocument(indexViewQuest - 1)}
                      >
                        Print
                      </LoadingButton>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <LoadingButton loading={btnload} variant="contained" color="primary"
                      sx={buttonStyles.buttonsubmit}
                      onClick={(e) => handleSubmited(e, indexViewQuest - 1)}>
                      Save
                    </LoadingButton>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button sx={buttonStyles.btncancel} onClick={handlecleared}>
                      Clear
                    </Button>
                  </Grid>
                </Grid>}
            </>
          </Box>
        )}
      </>
      {/* } */}
      <br /> <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lemployeedocumentpreparation") && (
        <>
          <Box sx={userStyle.container}>
            <NotificationContainer />
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>List Document Preparation</Typography>
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
                    <MenuItem value={items?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelemployeedocumentpreparation") && (

                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("xl")
                        fetchBrandMasterOverall();
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvemployeedocumentpreparation") && (

                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        setFormat("csv")
                        fetchBrandMasterOverall();
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                  )}
                  {isUserRoleCompare?.includes("printemployeedocumentpreparation") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfemployeedocumentpreparation") && (

                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          fetchBrandMasterOverall();
                        }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}

                  {isUserRoleCompare?.includes("imageemployeedocumentpreparation") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={templateCreationArrayCreate}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={items}
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
            &ensp;
            {isUserRoleCompare?.includes("bdemployeedocumentpreparation") && (
              <Button sx={buttonStyles.buttonbulkdelete} variant="contained" color="error" onClick={handleClickOpenalert}>
                Bulk Delete
              </Button>
            )}
            &ensp;
            <Button variant="contained" color="error" onClick={
              handleClickOpenBulkalert
            }>
              Bulk Print
            </Button>
            <br />
            <br />
            {loader ?
              <>
                <Box sx={userStyle.container}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                  </Box>
                </Box>
              </>
              :
              <>
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
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
                    // totalDatas={totalProjects}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={items}
                  />

                  {/* <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick /> */}
                </Box>
              </>
            }
            {/* ****** Table End ****** */}
            <br />
            <br />
            <br />
            {/* {userRoles?.includes("MANAGER", "HIRINGMANAGER") && <DocumentsPrintedStatusList data={Changed} setData={setChanged} />} */}
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
            sx={buttonStyles.btncancel}
          >
            Cancel
          </Button>
          <Button autoFocus variant="contained" sx={buttonStyles.buttonsubmit} onClick={(e) => delBrand(brandid)}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        <Dialog
          open={isInfoOpenImage}
          onClose={handleCloseInfoImage}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">
              Once Check the Document by clicking Preview button while Saving/Printing the Document whether it's perfectly alligned
            </Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfoImage} sx={buttonStyles.btncancel}>Cancel</Button>
            <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnload} autoFocus variant="contained" color='primary'
              onClick={(e) => generatePDFs(e)}
            > Submit </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          open={isInfoOpenImageManual}
          onClose={handleCloseInfoImageManual}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">
              Once Check the Document by clicking Preview button while Saving/Printing the Document whether it's perfectly alligned
            </Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfoImageManual} sx={buttonStyles.btncancel}>Cancel</Button>
            <LoadingButton sx={buttonStyles.buttonsubmit} loading={btnload} autoFocus variant="contained" color='primary'
              onClick={(e) => sendRequestManual(e)}
            > Submit </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          open={isInfoOpenImagePrint}
          onClose={handleCloseInfoImagePrint}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">
              Once Check the Document by clicking Preview button while Saving/Printing the Document whether it's perfectly alligned
            </Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfoImagePrint} sx={buttonStyles.btncancel}>Cancel</Button>
            <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
              onClick={(e) => downloadPdfTesdt(indexViewQuest - 1)}
            > Download </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          open={previewManual}
          onClose={handleClosePreviewManual}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">
              {`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
            ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`}
            </Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePreviewManual} sx={userStyle.btncancel}>Change</Button>
            <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
              onClick={(e) => handleOpenPreviewManualfunc()}
            > View </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          open={isInfoOpenImagePrintManual}
          onClose={handleCloseInfoImagePrintManual}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">
              Once Check the Document by clicking Preview button while Saving/Printing the Document whether  it's perfectly alligned
            </Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfoImagePrintManual} sx={buttonStyles.btncancel}>Cancel</Button>
            <LoadingButton loading={buttonLoading} autoFocus variant="contained" color='primary'
              onClick={(e) => downloadPdfTesdtManual(e)}
            > Download </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog
          open={openDialogManual}
          onClose={handleCloseManualCheck}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">
              Manual User's List
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  {/* <Typography>{moment(documentPreparationEdit.date).format("DD-MM-YYYY")}</Typography> */}
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reference No</Typography>
                  {/* <Typography>{documentPreparationEdit.referenceno}</Typography> */}
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Template No</Typography>
                  {/* <Typography>{documentPreparationEdit.templateno}</Typography> */}
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Template</Typography>
                  {/* <Typography>{documentPreparationEdit.template}</Typography> */}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseManualCheck} sx={buttonStyles.btncancel}>Cancel</Button>
            <LoadingButton
              loading={buttonLoading}
              autoFocus
              variant="contained"
              color='primary'
            // onClick={(e) => downloadPdfTesdt(e)}
            > Download
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg" fullWidth={true}
        sx={{ marginTop: "80px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              <b>View Employee Document Preparation</b>
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{moment(documentPreparationEdit.date).format("DD-MM-YYYY")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reference No</Typography>
                  <Typography>{documentPreparationEdit.referenceno}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Template No</Typography>
                  <Typography>{documentPreparationEdit.templateno}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Template</Typography>
                  <Typography>{documentPreparationEdit.template}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Employee Mode</Typography>
                  <Typography>{documentPreparationEdit.employeemode}</Typography>
                </FormControl>
              </Grid>
              {documentPreparationEdit.branch === "Please Select Branch" ? (
                <>
                  {" "}
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Department</Typography>
                      <Typography>{documentPreparationEdit.department}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
              {documentPreparationEdit.department === "Please Select Department" ? (
                <>
                  {" "}
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Company</Typography>
                      <Typography>{documentPreparationEdit.company}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Branch</Typography>
                      <Typography>{documentPreparationEdit.branch}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Unit</Typography>
                      <Typography>{documentPreparationEdit.unit === "Please Select Unit" ? "" : documentPreparationEdit.unit}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Team</Typography>
                      <Typography>{documentPreparationEdit.team === "Please Select Team" ? "" : documentPreparationEdit.team}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}


              {documentPreparationEdit.person &&
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Person</Typography>
                    <Typography>{documentPreparationEdit.person}</Typography>
                  </FormControl>
                </Grid>}
              {documentPreparationEdit.issuingauthority === "Please Select Issuing Authority" ? "" :
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Issuing Authority</Typography>
                    <Typography>{documentPreparationEdit.issuingauthority}</Typography>
                  </FormControl>
                </Grid>}
              {(documentPreparationEdit?.sealing !== "Document" && documentPreparationEdit?.sealing !== "" && documentPreparationEdit?.sealing !== "Please Select Seal") &&
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Seal</Typography>
                    <Typography>{documentPreparationEdit.sealing}</Typography>
                  </FormControl>
                </Grid>}
              {(documentPreparationEdit.sign !== "Document" && documentPreparationEdit.sign !== "" && documentPreparationEdit.sign !== "Please Select Signature") &&
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Signature</Typography>
                    <Typography>{documentPreparationEdit.sign}</Typography>
                  </FormControl>
                </Grid>}

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Document Need</Typography>
                  <Typography>{documentPreparationEdit.documentneed}</Typography>
                </FormControl>
              </Grid>



              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Document</Typography>
                  <ReactQuill readOnly style={{ height: "max-content", minHeight: "150px" }}
                    value={documentPreparationEdit.document}
                    modules={{
                      toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ direction: "rtl" }],
                      [{ size: [] }],

                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ align: [] }],
                      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                      ["link", "image", "video"], ["clean"]]
                    }}

                    formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "align", "list", "bullet", "indent", "link", "image", "video"]} />
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <br /> <br />
            <br />
            <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
              <Button sx={buttonStyles.btncancel} variant="contained" color="primary" onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Bulk delete ALERT DIALOG */}
      <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" onClick={handleCloseModalert}>
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
            <Button onClick={handleCloseModcheckbox} sx={buttonStyles.btncancel}>
              Cancel
            </Button>
            <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" onClick={(e) => delAreagrpcheckbox(e)}>
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>



      {/* Bulk delete ALERT DIALOG */}
      <Dialog open={isDeleteBulkOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={buttonStyles.buttonsubmit} autoFocus variant="contained" onClick={handleCloseBulkModalert}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>


      <Box>
        <Dialog open={isDeleteOpenBulkcheckbox} onClose={handleCloseBulkModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure you want print all ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBulkModcheckbox} sx={buttonStyles.btncancel}>
              Cancel
            </Button>
            <LoadingButton sx={buttonStyles.buttonsubmit} loading={bulkPrintStatus} autoFocus variant="contained" onClick={(e) => handleClickOpenLetterHeader("Bulk Print")}>
              {" "}
              OK{" "}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>



      <Box>
        <Dialog open={isOpenLetterHeadPopup}
          onClose={handleClickCloseLetterHead}
          maxWidth="md"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
            marginTop: "50px"
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>View Letter Header Options</Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Print Option<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={HeaderDropDowns}
                      value={{ label: headerOptions, value: headerOptions }}
                      onChange={(e) => {
                        setHeaderOptions(e.value);
                        setSelectedHeadOpt([])
                        setHeadValue([])
                        setHeader("")
                        setfooter("")
                        setCheckingArray((prevArray) =>
                          prevArray.map((item, ind) =>
                            ind === (indexViewQuest - 1) ? {
                              ...item,
                              header: "",
                              footer: ""
                            } : item
                          )
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                {headerOptions === "With Letter Head" && (
                  <Grid item md={headerOptions === "With Letter Head" ? 4 : 3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        With Letter Head <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        maxMenuHeight={300}
                        options={WithHeaderOptions}
                        value={selectedHeadOpt}
                        onChange={handleHeadChange}
                        valueRenderer={customValueRenderHeadFrom}
                      />
                    </FormControl>
                  </Grid>)}

              </Grid>
              <br />
              <br /> <br />
              <br />
              <Grid container spacing={2} sx={{ marginLeft: "3px" }}>
                <Grid item md={4} xs={12} sm={12}>
                  <LoadingButton loading={HeaderOptionsButton} sx={buttonStyles.buttonsubmit} autoFocus variant="contained" onClick={(e) => {
                    if (pagePopeOpen === "Preview") {
                      handlePreviewDocument(indexViewQuest - 1)
                    }
                    else if (pagePopeOpen === "Print") {
                      handlePrintDocument(indexViewQuest - 1)
                    }
                    else if (pagePopeOpen === "Table View") {
                      downloadPdfTesdtTable(DataTableId)
                    }
                    else if (pagePopeOpen === "Table Print") {
                      downloadPdfTesdtTablePrint(DataTableId)
                    }
                    else if (pagePopeOpen === "Bulk Print") {
                      handleBulkPrint();
                    }
                    else if (pagePopeOpen === "Email") {
                      fetchEmailForUser(emailValuePage?.id, emailValuePage?.convert, emailValuePage?.fromemail, emailValuePage?.ccemail, emailValuePage?.bccemail)
                    }
                  }


                  }>
                    {" "}
                    OK{" "}
                  </LoadingButton>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Button onClick={handleClickCloseLetterHead} sx={buttonStyles.btncancel}>
                    Cancel
                  </Button>
                </Grid>

              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>


      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={items ?? []}
        filename={"Employee Document Preparation"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Employee Document Preparation Info"
        addedby={addedby}
        updateby={updateby}
      />
      <Dialog
        open={openOTPView}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth={true}
        sx={{
          zIndex: 6000, // Ensure the Dialog itself has a high z-index
        }}
        disableBackdropClick
      >
        <Box
          sx={{
            padding: "10px 15px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <>
            <DialogContent>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} display="flex" justifyContent="center">
                  <PinIcon
                    sx={{
                      fontSize: "100px",
                      color: "#FAC921",
                      textAlign: "center",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <FormControl sx={{ width: "100%", maxWidth: "300px", textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold" color="#FAC921" gutterBottom>
                      Enter Two Factor OTP
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => {
                        const enteredValue = e.target.value.replace(/\D/, "");
                        if (/^\d{0,6}$/.test(enteredValue)) {
                          setOtp(enteredValue);
                        }
                      }}
                      inputProps={{
                        maxLength: 6,
                      }}
                      sx={{
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                        "& .MuiOutlinedInput-input": {
                          fontSize: "15px",
                          textAlign: "center",
                          letterSpacing: "5px",
                        },
                      }}
                    />
                    {error && (
                      <Typography sx={{ color: "red", fontSize: "0.9rem", marginTop: "10px" }}>
                        {error}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                // size="small"
                onClick={verifyOtp}
              >
                Verify
              </Button>
              {/* {pendingApproval?.every(data => data?.remainingDays >= 1) && */}
              <Button
                onClick={() => {
                  handlViewCloseOTP();
                  setOtp("");
                  setError("");
                }}
                variant="contained"
                color="error"
                sx={buttonStyles?.btncancel}
              >
                Cancel
              </Button>
              {/* } */}
            </DialogActions>
          </>
        </Box>

      </Dialog>
      <Dialog
        open={progressOpen}
        maxWidth="md"
        fullWidth={false}
        PaperProps={{ style: progressDialogStyles.dialogPaper }}>
        <DialogTitle style={progressDialogStyles.dialogTitle}>📄 Checking Documents for Page Mode...</DialogTitle>
        <DialogContent>
          <p style={progressDialogStyles.checkingText}>
            Checking: <span style={progressDialogStyles.highlightText}>{currentFile}</span>
          </p>
          <div style={progressDialogStyles.progressBarContainer}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              style={progressDialogStyles.progressBar}
            />
          </div>
          <p style={progressDialogStyles.percentageText}>{Math.round(progressValue)}% Completed</p>
        </DialogContent>
      </Dialog>

      <br />
      <Loader loading={loading} message={loadingMessage} />
      <Loader loading={loadingAttMonth} message={loadingMessageAttMonth} />
      <Loader loading={loadingAttDate} message={loadingMessageAttDate} />
      <Loader loading={loadingProdDate} message={loadingMessageProdDate} />
      <Loader loading={loadingPreviewData} message={loadingPreviewMessage} />
      <Loader loading={loadingPreviewManualData} message={loadingPreviewMessage} />
      <Loader loading={loadingPrintData} message={loadingPrintMessage} />
      <Loader loading={loadingPrintManualData} message={loadingPrintMessage} />
      <Loader loading={loadingGeneratingDatas} message={loadingGeneratingMessages} />
      <Loader loading={savingDatas} message={savingDatasMessage} />
    </Box>
  );
}

export default DocumentPreparation;