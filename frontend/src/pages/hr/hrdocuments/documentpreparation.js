import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
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
import { htmlToText } from "html-to-text";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import StyledDataGrid from "../../../components/TableStyle";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
// import QRCodeGenerator from './QRCodeComponent';y
import QRCode from 'qrcode';
import LoadingButton from "@mui/lab/LoadingButton";
import DocumentsPrintedStatusList from "./documentsPrintedStatusList"
import { BASE_URL } from "../../../services/Authservice";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Backdrop from '@mui/material/Backdrop';
import { MultiSelect } from "react-multi-select-component";
import CircularProgress from '@mui/material/CircularProgress';
import DOMPurify from 'dompurify';
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
  const [templateCreation, setTemplateCreation] = useState({ name: "" });
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
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
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
  const [openPopup, setOpenPopup] = useState(false);


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
  const handleExportXL = (isfilter) => {

    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((item, index) => ({
          "Sno": index + 1,
          Date: item.date,
          "Reference No": item.referenceno,
          "Templateno": item.templateno,
          Template: item.template,
          "Employee Mode": item.employeemode,
          Department: item.department === "Please Select Department" ? "" : item.department,
          Company: item.company === "Please Select Company" ? "" : item.company,
          Branch: item.branch === "Please Select Branch" ? "" : item.branch,
          Unit: item.unit === "Please Select Unit" ? "" : item.unit,
          Team: item.team === "Please Select Team" ? "" : item.team,
          Person: item.person,
          "Printing Status": item.printingstatus,
          "Issued Person Details": item.issuedpersondetails,
          "Issued Authority": item.issuingauthority,

        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        overallExcelDatas.map((item, index) => ({
          "Sno": index + 1,
          Date: moment(item.date).format("DD-MM-YYYY"),
          "Reference No": item.referenceno,
          "Templateno": item.templateno,
          Template: item.template,
          "Employee Mode": item.employeemode,
          Department: item.department === "Please Select Department" ? "" : item.department,
          Company: item.company === "Please Select Company" ? "" : item.company,
          Branch: item.branch === "Please Select Branch" ? "" : item.branch,
          Unit: item.unit === "Please Select Unit" ? "" : item.unit,
          Team: item.team === "Please Select Team" ? "" : item.team,
          Person: item.person,
          "Printing Status": item.printingstatus,
          "Issued Person Details": item.issuedpersondetails,
          "Issued Authority": item.issuingauthority,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  // get all branches
  const fetchOverallExcelDatas = async () => {
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : [];

    try {
       let res_freq = await axios.post(`${SERVICE.ACCESIBLEBRANCHALL_DOCUMENTPREPARATION}`, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverallExcelDatas(res_freq?.data?.documentPreparation?.filter(data => data?.printingstatus === "Not-Printed"))
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  useEffect(() => {
    fetchOverallExcelDatas();
  }, [isFilterOpen])

  const [headEdit, setHeaderEdit] = useState("");
  const [footEdit, setfooterEdit] = useState("");

  const [headvalue, setHeadValue] = useState([])
  const [selectedHeadOpt, setSelectedHeadOpt] = useState([])
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



  const customValueRenderHeadFrom = (valueCate) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Option";
  };
  const [headvalueEdit, setHeadValueEdit] = useState([])
  const [selectedHeadOptEdit, setSelectedHeadOptEdit] = useState([])
  const handleHeadChangeEdit = (options) => {

    setHeadValueEdit(options.map((a) => {
      return a.value;
    }))
    setHeaderEdit("")
    setfooterEdit("")
    setSelectedHeadOptEdit(options)

  }

  const customValueRenderHeadFromEdit = (valueCate) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Option";
  };




  const employeeModeOptions = [
    { value: "Current List", label: "Current List" },
    { value: "Abscond", label: "Abscond" },
    { value: "Releave Employee", label: "Releave Employee" },
    { value: "Hold", label: "Hold" },
    { value: "Terminate", label: "Terminate" },
    { value: "Manual", label: "Manual" },
  ];
  const printOptions = [
    { value: "With Letter Head", label: "With Letter Head" },
    { value: "Without Letter Head", label: "Without Letter Head" },
  ];


  const headingcontentOptions = [
    { value: "With Head content", label: "With Head content" },
    { value: "With Footer content", label: "With Footer content" }

  ];

  const signatureOptions = [
    { value: "None", label: "None" },
    { value: "With", label: "With" },
    { value: "Without", label: "Without" },
  ];
  const sealOptions = [
    { value: "None", label: "None" },
    { value: "Round Seal", label: "Round Seal" },
    { value: "For Seal", label: "For Seal" },
  ];
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
    issuingauthority:true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  useEffect(() => {
    addSerialNumber();
  }, [templateCreationArray]);



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
  const username = isUserRoleAccess.username;
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
      setIsDeleteOpenBulkcheckbox(true);
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
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
    }))
    : [];
    try {
      let res = await axios.post(SERVICE.EMPLOYEE_TEMPLATECREATION, {
        assignbranch: accessbranch
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const TemplateDropdownsValue = async (e, control) => {
    try {
      let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: control?.company,
        branch: control?.branch,
      });

      setHeadValue(e?.headvalue);
      setPageSizepdf(e?.pagesize)
      handlePagenameChange(e.pagesize)
      if (res?.data?.templatecontrolpanel?.length > 0) {
        const answer = res?.data?.templatecontrolpanel?.length > 0 ? res?.data?.templatecontrolpanel?.find(data => data?.company === control?.company && data?.branch === control?.branch) : ""

        const ans = answer ?
          answer?.templatecontrolpanellog[answer?.templatecontrolpanellog?.length - 1] : ""
          ;


        setPersonId(answer)
        setFromEmail(ans?.fromemail)
        setCompanyName(ans)
        if (e.headvalue?.includes("With Head content")) {
          setHeader(ans?.letterheadcontentheader[0]?.preview)
        }
        if (e.headvalue?.includes("With Footer content")) {
          setfooter(ans?.letterheadcontentfooter[0]?.preview)
        }
        setWaterMarkText(ans?.letterheadbodycontent[0].preview)
        setSignatureStatus(e?.signature)
        setSealStatus(e?.seal)
        setGenerateData(false)
      }
      else {
        setGenerateData(true)
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
          </>
        );
        handleClickOpenerr();
      }

    } catch (err) { console.log(err, 'err'); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const TemplateManualDropDowns = async (e, mode, company, branch) => {
    try {
      if (mode === 'Manual') {
        let res = await axios.post(SERVICE.FILTERTEMPLATECONTROLPANEL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: company,
          branch: branch,
        });

        setHeadValue(e?.headvalue);
        setPageSizepdf(e.pagesize)
        handlePagenameChange(e.pagesize)

        const answer = res?.data?.templatecontrolpanel?.find(data => data?.company === company && data?.branch === branch)
        // const answer = res?.data?.templatecontrolpanel?.find(data => data?.company === "TTS" && data?.branch === "TTS-KULITHALAI")

        const ans =
          answer?.templatecontrolpanellog[answer?.templatecontrolpanellog?.length - 1]
          ;

        setPersonId(answer)
        setFromEmail(ans?.fromemail)

        setCompanyName(ans)
        if (e.headvalue?.includes("With Head content")) {
          setHeader(ans?.letterheadcontentheader[0]?.preview)
        }
        if (e.headvalue?.includes("With Footer content")) {
          setfooter(ans?.letterheadcontentfooter[0]?.preview)
        }
        setWaterMarkText(ans?.letterheadbodycontent[0].preview)
        setSignatureStatus(e.signature)
        setSealStatus(e.seal)
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  //Reason for Sending Mail for an Person
  const fetchAttendanceDateStatus = async (person, date) => {
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
          daystatus: item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(item),

        };
      });
      const answerDate = rowDataTable?.length > 0 ? rowDataTable[0]?.daystatus : ""
      setLoadingAttDate(false)
      setAttendanceDateStatus(answerDate)
    }
    catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }

  //get all Sub vendormasters.
  const fetchAttedanceStatus = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setAttStatus(res_vendor?.data?.attendancestatus);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttModearr(res_freq?.data?.allattmodestatus);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  const fetchAttendanceMonthStatus = async (person, month, year) => {
    setLoadingAttMonth(true)
    let ans = months.findIndex(dat => dat.value === month)
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
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  }



  // Fetching PRoduction Date Wise Report 
  const fetchProductionDateStatus = async (person, date) => {
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
    catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Employee's have different company and branch.Please Select Users With same company and same branch`}</p>
        </>
      );
      handleClickOpenerr();
    } else if (uniqueEntries?.length === 1) {
      TemplateDropdownsValue(templateCreationValue, uniqueEntries[0])
      IdentifyUserCode(uniqueEntries[0])
      setSelectedEmployee(options);

      let ans = options?.flatMap((a, index) => {
        return a.value;
      })
      CheckNoticePeriodMulti(ans);
      setEmployeeControlPanel(uniqueEntries[0])
      setSelectedEmployeeValues(ans);
    }



  };

  const customValueRendererEmployee = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Employee";
  };



  const [uniqueCode, setUniqueCode] = useState("")

  const IdentifyUserCode = async (e) => {
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

    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const IdentifyUserCodeEdit = async (e) => {
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


    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  const CheckNoticePeriod = async (e) => {

    try {
      let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const answer = res?.data?.noticeperiodapply?.some(data => data.empname === e && data.exitstatus == true)
      const answerPerson = res?.data?.noticeperiodapply?.some(data => data.empname === e)
      setNoticePeriodEmpCheck(answer)
      setNoticePeriodEmpCheckPerson(answerPerson)
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const CheckNoticePeriodMulti = async (e) => {

    try {
      let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const answer = res?.data?.noticeperiodapply?.some(data => e?.includes(data.empname) && data.exitstatus == true)
      const answerPerson = res?.data?.noticeperiodapply?.some(data => e?.includes(data.empname))
      setNoticePeriodEmpCheck(answer)
      setNoticePeriodEmpCheckPerson(answerPerson)
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };



  const CheckNoticePeriodEdit = async (e) => {

    try {
      let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const answer = res?.data?.noticeperiodapply?.some(data => data.empname === e && data.exitstatus == true)
      const answerPerson = res?.data?.noticeperiodapply?.some(data => data.empname === e)
      setNoticePeriodEmpCheckEdit(answer)
      setNoticePeriodEmpCheckPersonEdit(answerPerson)
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const [issuingauthority, setIssuingAutholrity] = useState([])
  const fetchIsssuingAuthority = async (e, val) => {
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchIsssuingAuthorityManual = async (e) => {
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };





  const DepartDropDowns = async () => {
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const CompanyDropDowns = async () => {
    try {
      setCompanyOptions(isAssignBranch?.map(data => ({
        label: data.company,
        value: data.company,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const BranchDropDowns = async (e) => {
    try {

      setBranchOptions(isAssignBranch?.filter(
        (comp) =>
          e.value === comp.company
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const BranchDropDownsEdit = async (e) => {
    try {

      setBranchOptionsEdit(isAssignBranch?.filter(
        (comp) =>
          e === comp.company
      )?.map(data => ({
        label: data.branch,
        value: data.branch,
      })).filter((item, index, self) => {
        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
      }));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const UnitDropDowns = (e) => {
    try {
      let resdata = isAssignBranch?.filter(
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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


    await fetchEmailForUser(id, convert, fromemail, ccemail, bccemail)

  }


  const fetchTeam = async (e) => {
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchTeamNames = async (e) => {
    try {
      let res_type = await axios.post(SERVICE.USER_STATUS_DEP_CHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: e,
      });

      let usersEmployeemode = res_type.data.usersstatus.filter((data) => {
        if (employeeMode === "Abscond") {
          return data.resonablestatus === "Absconded";
        } else if (employeeMode === "Current List") {
          return data.resonablestatus === "" || data.resonablestatus === undefined;
        } else if (employeeMode === "Releave Employee") {
          return data.resonablestatus === "Releave Employee";
        } else if (employeeMode === "Hold") {
          return data.resonablestatus === "Hold";
        } else if (employeeMode === "Terminate") {
          return data.resonablestatus === "Terminate";
        }
      });

      let usersDepartment = usersEmployeemode;
      setEmployeenames(
        usersDepartment.map((data) => ({
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchNamesEmpMode = async (e, value) => {
    try {
      let res_type = await axios.get(SERVICE.USER_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let usersEmployeemode = res_type.data.usersstatus.filter((data) => {
        if (e === "Abscond") {
          return data.resonablestatus === "Absconded";
        } else if (e === "Current List") {
          return data.resonablestatus === "" || data.resonablestatus === undefined;
        } else if (e === "Releave Employee") {
          return data.resonablestatus === "Releave Employee";
        } else if (e === "Hold") {
          return data.resonablestatus === "Hold";
        } else if (e === "Terminate") {
          return data.resonablestatus === "Terminate";
        }
      });


      setEmployeenames(
        usersEmployeemode.map((data) => ({
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };



  // const fetchOpenDialogBox = (value) => {
  //   if (value === 'Manual') {
  //     handleClickOpenManualCheck();
  //   }
  //   else {
  //     setOpenDialogManual(false);
  //   }
  // }
  //get all Employeename.
  const fetchAllEmployee = async (e) => {

    try {
      let res_module = await axios.post(SERVICE.USEREMP_TEAMGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: documentPrepartion.company === "Please Select Company" ? "" : documentPrepartion.company,
        branch: documentPrepartion.branch === "Please Select Branch" ? "" : documentPrepartion.branch,
        unit: documentPrepartion.unit === "Please Select Unit" ? "" : documentPrepartion.unit,
        team: e.value,
      });
      let usersEmployeemode = res_module?.data?.userteamgroup.filter((data) => {
        if (employeeMode === "Abscond") {
          return data.resonablestatus === "Absconded";
        } else if (employeeMode === "Current List") {
          return data.resonablestatus === "" || data.resonablestatus === undefined;
        } else if (employeeMode === "Releave Employee") {
          return data.resonablestatus === "Releave Employee";
        } else if (employeeMode === "Hold") {
          return data.resonablestatus === "Hold";
        } else if (employeeMode === "Terminate") {
          return data.resonablestatus === "Terminate";
        }
      });

      setEmployeenames(
        usersEmployeemode.map((data) => ({
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

  const [agendaEditStyles1, setAgendaEditStyles1] = useState({});

  const handlePagenameChange1 = (format) => {

    if (format === "A3") {
      setAgendaEditStyles1({ width: "297mm", height: "420mm" });
    }
    else if (format === "A4") {
      setAgendaEditStyles1({ width: "210mm", height: "297mm" });
    }
    else if (format === "Certificate") {
      setAgendaEditStyles1({ width: "279mm", height: "180mm" });
    }
    else if (format === "Certificate1") {
      setAgendaEditStyles1({ width: "279mm", height: "220mm" });
    }
    else if (format === "Envelope") {
      setAgendaEditStyles1({ width: "220mm", height: "110mm" });
    }

  }


  // const componentRef1 = useRef(null);

  // const handleprintones = useReactToPrint({
  //   content: () => componentRef1.current,
  //   documentTitle: "Document Preparation",
  //   pageStyle: `
  //   @page {
  //     size: ${agendaEditStyles1.width}mm ${agendaEditStyles1.height}mm; /* Set the width and height */
  //   }

  // `,
  // });

  // const handleprintone = async (e) => {

  //   const pdfElement = document.createElement("div");
  //   pdfElement.innerHTML = checking;

  //      componentRef1.current = pdfElement;

  // };







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
    try {
      const response = await QRCode.toDataURL(`${Allcodedata}`);
      setImageUrl(response);
    } catch (error) {

    }
  }
  const generateQrCodeEdit = async () => {
    try {
      const response = await QRCode.toDataURL(` ${AllcodedataEdit}`);
      setImageUrlEdit(response);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  }

  useEffect(() => {
    generateQrCode();
  }, [Allcodedata])

  useEffect(() => {
    generateQrCodeEdit();
  }, [documentPreparationEdit, companyNameEdit])



  const createFooterElementImageEdit = () => {
    const footerElement = document.createElement("div");
    footerElement.innerHTML = `
      <div style="margin-top: 10px; page-break-inside: avoid; page-break-before: auto; page-break-after: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid; page-break-before: auto; page-break-after: auto;">
      <img src="${imageUrlEdit}" alt="img" width="100" height="100" style="margin-top: -10px; page-break-inside: avoid; page-break-before: auto; page-break-after: auto;" />
      <img src="${sealPlacementEdit}" alt="img" width="100" height="100" style="margin-top: -10px;  margin-right : 40px;  page-break-inside: avoid; page-break-before: auto; page-break-after: auto;" />
    </div>  
      </div>
    `;
    return footerElement;
  };







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

  const [employeeControlPanel, setEmployeeControlPanel] = useState("");

  const fetchAllRaisedTickets = async () => {
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


    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };




  const answer = async (person, index) => {
    let employeename = person ? person : employeeValue;
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
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
    }))
    : [];
    try {

      const [res, res_emp, res_emp_break] = await Promise.all([
        axios.post(SERVICE.EMPLOYEE_TEMPLATECREATION, {
          assignbranch: accessbranch,
        },{
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.USER_STATUS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.SHIFT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        })
      ])
      let matches = documentPrepartion?.template?.replaceAll("(" , "")?.replaceAll(")", "")?.split("--");
      let format = res?.data?.templatecreation?.find((data) => data.company === matches[1] &&  data.branch === matches[2] && data?.name === documentPrepartion?.template?.split("--")[0]);
      let employee = res_emp?.data?.usersstatus?.find((data) => data?.companyname === employeename);
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

      if (employeeMode === "Manual") {
        let findMethod = texted
          .replaceAll("$UNIID$", newval ? newval : "");
        setChecking(findMethod)

      }
      else {
        let caddress = `<br>${!employee?.cdoorno ? "" : employee?.cdoorno + ","}
    <br>${!employee?.cstreet ? "" : employee?.cstreet + ","}
<br>${!employee?.carea ? "" : employee?.carea + ","}
    <br>${!employee?.clandmark ? "" : employee?.clandmark + ","}
    <br>${!employee?.ctaluk ? "" : employee?.ctaluk + ","}
    <br>${!employee?.cpost ? "" : employee?.cpost + ","}
    <br>${!employee?.ccity ? "" : employee?.ccity + ","}
    <br>${!employee?.cstate ? "" : employee?.cstate + ","}
    <br>${!employee?.ccountry ? "" : employee?.ccountry + ","}
    ${!employee?.cpincode ? "" : "-" + employee?.cpincode}`;
    
        let GenderHeShe = (employee?.gender !== "" || employee?.gender !== undefined) 
        ? employee?.gender === "Male" ? "He" : employee?.gender === "Female" ? "She" : "He/She" : "He/She";
       
        let GenderHeShesmall = (employee?.gender !== "" || employee?.gender !== undefined) 
        ? employee?.gender === "Male" ? "he" : employee?.gender === "Female" ? "she" : "he/she" : "he/she";
       
        let GenderHimHer = (employee?.gender !== "" || employee?.gender !== undefined) 
        ? employee?.gender === "Male" ? "him" : employee?.gender === "Female" ? "her" : "him/her" : "him/her";



        let paddress = `<br>${!employee?.pdoorno ? "" : employee?.pdoorno + ","}
    ${!employee?.pstreet ? "" : employee?.pstreet + ","}
    <br>${!employee?.parea ? "" : employee?.parea + ","}
    <br>${!employee?.plandmark ? "" : employee?.plandmark + ","}
    <br>${!employee?.ptaluk ? "" : employee?.ptaluk + ","}
    <br>${!employee?.ppost ? "" : employee?.ppost + ","}
    <br>${!employee?.pcity ? "" : employee?.pcity + ","}
    <br>${!employee?.pstate ? "" : employee?.pstate + ","}
    <br>${!employee?.pcountry ? "" : employee?.pcountry + ","}
    ${!employee?.ppincode ? "" : "-" + employee?.ppincode}`;

        let findMethod = texted
          .replaceAll("$LEGALNAME$", employee?.legalname ? employee?.legalname : "")
          .replaceAll("$DOB$", employee?.dob ? employee?.dob : "")
          .replaceAll("$C:ADDRESS$", caddress)
          .replaceAll("$LOGIN$", employee?.username ? employee?.username : "")
          .replaceAll("$GENDERHIM/HER$", GenderHimHer)
          .replaceAll("$SALUTATION$",  employee?.prefix ? employee?.prefix : "Mr/Ms")
          .replaceAll("$P:ADDRESS$", paddress)
          .replaceAll("$F.COMPANY$",  "")
          .replaceAll("$F.BRANCH$", "")
          .replaceAll("$F.BRANCHADDRESS$",  "")
          .replaceAll("$T.COMPANY$", "")
          .replaceAll("$T.COMPANYADDRESS$","")
          .replaceAll("$GENDERHE/SHE$", GenderHeShe)
          .replaceAll("$GENDERHE/SHE/SMALL$", GenderHeShesmall)
          .replaceAll("$EMAIL$", employee?.email ? employee?.email : "")
          .replaceAll("$P:NUMBER$", employee?.contactpersonal ? employee?.contactpersonal : "")
          .replaceAll("$DOJ$", employee?.doj ? employee?.doj : "")
          .replaceAll("$EMPCODE$", employee?.empcode ? employee?.empcode : "")
          .replaceAll("$BRANCH$", employee?.branch ? employee?.branch : "")
          .replaceAll("$UNIT$", employee.unit ? employee.unit : "")
          .replaceAll("$DESIGNATION$", employee?.designation ? employee?.designation : "")
          .replaceAll("$C:NAME$", employee?.companyname ? employee?.companyname : "")
          .replaceAll("$TEAM$", employee?.team ? employee?.team : "")
          .replaceAll("$PROCESS$", employee?.process ? employee?.process : "")
          .replaceAll("$DEPARTMENT$", employee.department ? employee.department : "")
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
          .replaceAll("$SIGNATURE$", signatureContent?.seal === "None" ? `
          <img src="${signature}" alt="Signature" style="postion:absolute; z-index:-1; width: 200px; height: 30px;" />
               ` : "");

        const answer = [];
        answer.push({
          empname: person,
          template: documentPrepartion?.template,
          issuingauthority: documentPrepartion?.issuingauthority,
          department: String(documentPrepartion.department),
          company: String(documentPrepartion.company),
          branch: String(documentPrepartion.branch),
          unit: String(documentPrepartion.unit),
          team: String(documentPrepartion.team),
          autoid: newval,
          employeemode: String(documentPrepartion.employeemode),
          data: findMethod,
          referenceno: newvalRefNo,
          pagenumberneed: String(documentPrepartion.pagenumberneed),
          proption: String(documentPrepartion.proption),
          header: head,
          footer: foot,
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
          headvalue: headvalue,
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
    catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  const value = uniqueCode + employeeControlPanel?.team?.slice(0, 3) + "#" + templateCreationValue?.tempcode;


  const handlePrintDocument = (index) => {
    if (generateData) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      setButtonLoading(true)
      setLoadingPrintData(true)
      downloadPdfTesdtCheckTrue(index).then((isMultiPage) => {

        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoading(false)
          setLoadingPrintData(false)
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
            ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`}</p>
            </>
          );
          handleClickOpenerr();
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
    if (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Fill All the Fields Which starts From $ and Ends with $"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (generateData) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      setLoadingPrintManualData(true)
      setButtonLoading(true)
      downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {

        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoading(false)
          setLoadingPrintManualData(false)
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
            ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`}</p>
            </>
          );
          handleClickOpenerr();
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
    if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee is not eligibile to receieve any kind of documents"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
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
          doc.addImage(checkingArray[index]?.header, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

          if (checkingArray[index]?.header !== "") {
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
          const footerY = (pageHeight * 1) - footerImgHeight - 5; // Position at the bottom
          doc.addImage(checkingArray[index]?.footer, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
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
              handleCloseInfoImagePrint();
            };
          };
        });
    }

  };
  const downloadPdfTesdtManual = () => {
    if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee is not eligibile to receieve any kind of documents"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
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
          const footerY = (pageHeight * 1) - footerImgHeight - 5;
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
            ? ((head !== "" && (foot !== "")) ? [45, 15, 45, 15]
              : (head === "" && foot !== "") ? [20, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((head !== "" && foot !== "") ? [30, 15, 45, 15]
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
          };
        });
        setInfoOpenImagePrintManual(false);
    }

  };



  const handlePreviewDocument = (index) => {
    if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
      setButtonLoadingPreview(false);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"This Employee is not eligible to receive any kind of documents"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (generateData) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      setButtonLoadingPreview(true);
      setLoadingPreviewData(true)
      downloadPdfTesdtCheckTrue(index).then((isMultiPage) => {
        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoadingPreview(false)
          setPreviewManual(true)
          setLoadingPreviewData(false)
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
              const footerY = (pageHeight * 1) - footerImgHeight - 5;
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
                qrImg.src = checkingArray[index]?.qrcode;
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
            setLoadingPreviewData(false)
        }
      }).catch((error) => {
        console.error('Error generating PDF:', error);
      })
    }
  };

  const handlePreviewDocumentManual = () => {
    if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
      setButtonLoadingPreview(false);
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"This Employee is not eligible to receive any kind of documents"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Fill All the Fields Which starts From $ and Ends with $"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (generateData) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
        </>
      );
      handleClickOpenerr();
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
              const footerY = (pageHeight * 1) - footerImgHeight - 5;
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
                ? ((head !== "" && (foot !== "")) ? [45, 15, 45, 15]
                  : (head === "" && foot !== "") ? [20, 15, 45, 15]
                    : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                      [20, 15, 20, 15])

                :
                ((head !== "" && foot !== "") ? [30, 15, 45, 15]
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
        const footerY = (pageHeight * 1) - footerImgHeight - 5;
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
          ? ((head !== "" && (foot !== "")) ? [45, 15, 45, 15]
            : (head === "" && foot !== "") ? [20, 15, 45, 15]
              : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                [20, 15, 20, 15])

          :
          ((head !== "" && foot !== "") ? [30, 15, 45, 15]
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
          const footerY = (pageHeight * 1) - footerImgHeight - 5;
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
          const footerY = (pageHeight * 1) - footerImgHeight - 5;
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
            ? ((head !== "" && (foot !== "")) ? [45, 15, 45, 15]
              : (head === "" && foot !== "") ? [20, 15, 45, 15]
                : (head !== "" && foot === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((head !== "" && foot !== "") ? [30, 15, 45, 15]
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
    // Create a new div element to hold the Quill content
    await Promise.all(selectedRows?.map(async (item) => {
      setBulkPrintStatus(true)
      let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${item}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res = await axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${item}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        printingstatus: "Printed",
      });


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
          doc.addImage(response.data.sdocumentPreparation.head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

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
          const footerY = (pageHeight * 1) - footerImgHeight - 5;
          doc.addImage(response?.data?.sdocumentPreparation?.foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
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
            ? ((response.data.sdocumentPreparation?.head !== "" && (response.data.sdocumentPreparation?.foot !== "")) ? [45, 15, 45, 15]
              : (response.data.sdocumentPreparation?.head === "" && response.data.sdocumentPreparation?.foot !== "") ? [20, 15, 45, 15]
                : (response.data.sdocumentPreparation?.head !== "" && response.data.sdocumentPreparation?.foot === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((response.data.sdocumentPreparation?.head !== "" && (response.data.sdocumentPreparation?.foot !== "")) ? [30, 15, 45, 15]
              : (response.data.sdocumentPreparation?.head === "" && response.data.sdocumentPreparation?.foot !== "") ? [15, 15, 45, 15]
                : (response.data.sdocumentPreparation?.head !== "" && response.data.sdocumentPreparation?.foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
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

    setChanged("dsdss")
    handleCloseBulkModcheckbox();
    setSelectedRows([]);
    setSelectAllChecked(false);
  };


  const downloadPdfTesdtTable = async (e) => {
    // Create a new div element to hold the Quill content
    let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

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
        doc.addImage(response.data.sdocumentPreparation.head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

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
        const footerY = (pageHeight * 1) - footerImgHeight - 5;
        doc.addImage(response?.data?.sdocumentPreparation?.foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
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
          ? ((response.data.sdocumentPreparation?.head !== "" && (response.data.sdocumentPreparation?.foot !== "")) ? [45, 15, 45, 15]
            : (response.data.sdocumentPreparation?.head === "" && response.data.sdocumentPreparation?.foot !== "") ? [20, 15, 45, 15]
              : (response.data.sdocumentPreparation?.head !== "" && response.data.sdocumentPreparation?.foot === "") ? [45, 15, 20, 15] :
                [20, 15, 20, 15])

          :
          ((response.data.sdocumentPreparation?.head !== "" && (response.data.sdocumentPreparation?.foot !== "")) ? [30, 15, 45, 15]
            : (response.data.sdocumentPreparation?.head === "" && response.data.sdocumentPreparation?.foot !== "") ? [15, 15, 45, 15]
              : (response.data.sdocumentPreparation?.head !== "" && response.data.sdocumentPreparation?.foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
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
            pdf.save(`${response.data.sdocumentPreparation?.template}_${response.data.sdocumentPreparation?.person}.pdf`);
          };
        };
      });
  };


  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Alert delete popup
  let brandid = documentPreparationEdit?._id;
  const delBrand = async () => {
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

  //add function
  const sendRequest = async () => {
    setBtnLoad(true)
    try {
      const answer = checkingArray?.map(async (data, index) => {
        await axios.post(SERVICE.CREATE_DOCUMENT_PREPARATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          date: String(date),
          template: String(data.template),
          referenceno: data?.referenceno,
          tempcode: data?.tempcode,
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
          person: data.empname === "Please Select Person" ? "" : data.empname,
          proption: String(data?.proption),
          watermark: data?.watermark,
          pageheight: data?.pageheight,
          pagewidth: data?.pagewidth,
          headvalue: data?.headvalue,
          pagesize: data?.pagesize,
          head: data?.header,
          foot: data?.footer,
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
          addedby: [
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        });
      })

      //   setTemplateCreation(brandCreate.data);
      await fetchBrandMaster();
      handleCloseInfoImage();
      setDocumentPrepartion({
        ...documentPrepartion,
        person: "Please Select Person",
      });
      setBtnLoad(false)
      handleCloseInfoImage();
      setChecking("");
      setCheckingArray([])
      setIndexViewQuest(1)
      setEmployeeControlPanel("")
      setEmployeeValue([])
      setEmployeeUserName("")
      window.scrollTo(0, 0)
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
      setBtnLoad(false)
    } catch (err) { setBtnLoad(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
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
    try {
      let brandCreate = await axios.post(SERVICE.CREATE_DOCUMENT_PREPARATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        date: String(date),
        template: String(documentPrepartion.template),
        referenceno: newvalRefNo,
        tempcode: templateCreationValue?.tempcode,
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
        headvalue: headvalue,
        pagesize: pageSizePdf,
        head: head,
        foot: foot,
        qrCodeNeed: qrCodeNeed,
        sign: documentPrepartion.signature,
        sealing: documentPrepartion.seal,
        printingstatus: "Not-Printed",
        signature: signature,
        seal: sealPlacement,
        qrcode: imageUrl,
        issuedpersondetails: String(isUserRoleAccess.companyname),
        document: findMethod,
        frommailemail: fromEmail,
        mail: "Send",
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
      setBtnLoad(false)
    } catch (err) { setBtnLoad(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  let userRoles = isUserRoleAccess?.role?.map(data => data?.toUpperCase().replace(/[^A-Z0-9]/g, ''));



  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const [first, second, third] = moment(new Date()).format("DD-MM-YYYY hh:mm a")?.split(" ")
    const vasr = `${first}_${second}_${third}`
    setDateFormat(vasr)
    const isNameMatch = templateCreationArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.person === documentPrepartion.person);
    const isNameMatchInside = checkingArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.empname === documentPrepartion.person);

    if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Template Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (documentPrepartion.employeemode === "" || documentPrepartion.employeemode === "Please Select Employee Mode") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Mode"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeMode !== "Manual" && allBranchValue === false && (documentPrepartion.department === "" || documentPrepartion.department === "Please Select Department")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (departmentCheck === false && (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (departmentCheck === false && (documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.unit === "" || documentPrepartion.unit === "Please Select Unit")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.team === "" || documentPrepartion.team === "Please Select Team")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (employeeMode !== "Manual" && documentPrepartion?.reason !== "Document" && (documentPrepartion.person === "" || documentPrepartion.person === "Please Select Person")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Person"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (employeeMode !== "Manual" && documentPrepartion?.reason === "Document" && (selectedEmployeeValues?.length < 1)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Person"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.reason === "Attendance" && documentPrepartion.sort === "Please Select Sort") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Sort"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.reason === "Attendance" && documentPrepartion.sort === "Date" && documentPrepartion?.attendancedate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Attendance Date"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.reason === "Attendance" && documentPrepartion.sort === "Month" && documentPrepartion?.attendancemonth === "Please Select Attendance Month") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Attendance Month"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.reason === "Attendance" && documentPrepartion.sort === "Month" && documentPrepartion?.attendanceyear === "Please Select Attendance Year") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Attendance Year"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.reason === "Production" && documentPrepartion.sort === "Please Select Sort") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Sort"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.reason === "Production" && documentPrepartion.sort === "Date" && documentPrepartion?.productiondate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Production Date"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.reason === "Production" && documentPrepartion.sort === "Month" && documentPrepartion?.productionmonth === "Please Select Production Month") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Production Month"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.reason === "Production" && documentPrepartion.sort === "Month" && documentPrepartion?.productionyear === "Please Select Production Year") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Production Year"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.issuingauthority === "" || documentPrepartion.issuingauthority === "Please Select Issuing Authority") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Issuing Authority"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((signatureStatus === "With") && (documentPrepartion.signature === "" || documentPrepartion.signature === "Please Select Signature")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Signature"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if ((sealStatus !== 'None' && sealStatus !== "" && signatureContent?.seal === "None") && (documentPrepartion.seal === "" || documentPrepartion.seal === "Please Select Seal")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Seal"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else if (documentPrepartion?.employeemode !== "Manual" && isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Document with Person Name and Template already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion?.employeemode !== "Manual" && isNameMatchInside) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Document with Person Name and Template already exists in Todo!"}</p>
        </>
      );
      handleClickOpenerr();
    }

    else {
      if (selectedEmployeeValues?.length > 0) {
        selectedEmployeeValues?.map((data, index) => answer(data, index))
      } else {
        answer();
      }


    }
  };




  //submit option for saving
  const handleSubmited = (e, index) => {
    e.preventDefault();
    let ans = [];
    const isNameMatch = templateCreationArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.person === documentPrepartion.person);
    if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Template Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (documentPrepartion.employeemode === "" || documentPrepartion.employeemode === "Please Select Employee Mode") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Mode"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (allBranchValue === false && (documentPrepartion.department === "" || documentPrepartion.department === "Please Select Department")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (departmentCheck === false && (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (departmentCheck === false && (documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (departmentCheck === false && (documentPrepartion.unit === "" || documentPrepartion.unit === "Please Select Unit")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (departmentCheck === false && (documentPrepartion.team === "" || documentPrepartion.team === "Please Select Team")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (documentPrepartion.employeemode !== "Manual" && isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Document with Person Name and Template already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.employeemode === "Manual" && checking === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Document is Empty"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.employeemode !== "Manual" && checkingArray?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Document Todo is Empty"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee is not eligibile to receieve any kind of documents"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (generateData) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.employeemode === "Manual" && (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Fill All the Fields Which starts From $ and Ends with $"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {

      setBtnLoad(true);

      const promises = checkingArray?.map((data, index) =>
        downloadPdfTesdtCheckTrue(index)
      );

      Promise.all(promises)
        .then((results) => {
          const allFalse = results.every((isMultiPage) => !isMultiPage);

          if (!allFalse && templateCreationValue?.pagemode === "Single Page") {
            setBtnLoad(false);
            setShowAlert(
              <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                  {`This Template has a page mode of ${templateCreationValue?.pagemode}, but the provided documents are ${templateCreationValue?.pagemode === "Single Page"
                    ? "more than expected"
                    : "not sufficient"
                    } to print documents.`}
                </p>
              </>
            );
            handleClickOpenerr();
          } else {
            setBtnLoad(false);
            handleClickOpenInfoImage();
          }
        })
        .catch((error) => {
          console.error("Error generating PDF:", error);
          setBtnLoad(false); // Ensure loading state is reset even on error
        });

    }
  };
  const handleSubmitedManual = (e) => {
    e.preventDefault();
    const isNameMatch = templateCreationArray?.some((item) => item.template?.toLowerCase() === documentPrepartion.template?.toLowerCase() && item.person === documentPrepartion.person);
    if (documentPrepartion.template === "" || documentPrepartion.template === "Please Select Template Name") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Template Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (documentPrepartion.employeemode === "" || documentPrepartion.employeemode === "Please Select Employee Mode") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee Mode"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (allBranchValue === false && (documentPrepartion.department === "" || documentPrepartion.department === "Please Select Department")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (departmentCheck === false && (documentPrepartion.company === "" || documentPrepartion.company === "Please Select Company")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (departmentCheck === false && (documentPrepartion.branch === "" || documentPrepartion.branch === "Please Select Branch")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.unit === "" || documentPrepartion.unit === "Please Select Unit")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeMode !== "Manual" && departmentCheck === false && (documentPrepartion.team === "" || documentPrepartion.team === "Please Select Team")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (documentPrepartion.employeemode !== "Manual" && isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Document with Person Name and Template already exists!"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (checking === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Document is Empty"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (!noticePeriodEmpCheck && noticePeriodEmpCheckPerson) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee is not eligibile to receieve any kind of documents"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (generateData) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"This Employee's company and branch is not matched with Template control panel data.Add the details in Template control panel"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (documentPrepartion.employeemode === "Manual" && (checking.match(regex)?.filter(data => !["$SIGNATURE$", "$FSIGNATURE$", "$RSEAL$"]?.includes(data))?.length > 0)) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Fill All the Fields Which starts From $ and Ends with $"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      setBtnLoad(true)
      downloadPdfTesdtCheckTrueManual().then((isMultiPage) => {
        setBtnLoad(true)

        if (isMultiPage && templateCreationValue?.pagemode === "Single Page") {
          setButtonLoading(false)
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`This Template has  page mode of ${templateCreationValue?.pagemode} but provided is
              ${templateCreationValue?.pagemode === "Single Page" ? "more than expected" : "not sufficient"}  to print documents`}</p>
            </>
          );
          handleClickOpenerr();
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
  };



  const handlecleared = (e) => {
    e.preventDefault();
    setGenerateData(false)
    setCheckingArray([])
    setIndexViewQuest(1)
    setDocumentPrepartion({
      date: "", template: "Please Select Template Name",
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
    setCheckingArray([])
    setSelectedEmployeeValues([])
    setSelectedEmployee([])
    setIndexViewQuest(1)
    setHeadValue([])
    setSelectedHeadOpt([])
    setHeader("")
    setfooter("")
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
  const handleclearedManual = (e) => {
    e.preventDefault();
    setGenerateData(false)
    setDocumentPrepartion({
      date: "", template: "Please Select Template Name",
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
    setHeadValue([])
    setSelectedHeadOpt([])
    setHeader("")
    setCheckingArray([])
    setSelectedEmployeeValues([])
    setSelectedEmployee([])
    setIndexViewQuest(1)
    setfooter("")
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


  //get all brand master name.
  const fetchBrandMaster = async () => {
    setLoader(true);
    const accessbranch = isAssignBranch
    ? isAssignBranch.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : [];

    try {
       let res_freq = await axios.post(`${SERVICE.ACCESIBLEBRANCHALL_DOCUMENTPREPARATION}`, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTemplateCreationArrayCreate(res_freq?.data?.documentPreparation?.filter(data => data?.printingstatus === "Not-Printed"))
      setTemplateCreationArray(res_freq?.data?.documentPreparation);
      setAutoId(res_freq?.data?.documentPreparation);
      setChanged("ChangedStatus")
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchBrandMaster();
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
      await fetchBrandMaster();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
  const getUpdatePrintingStatus = async (e) => {
    try {
      let res = await axios.put(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        printingstatus: "Printed",
      });
      await fetchBrandMaster();
      setChanged(e)
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const fetchEmailForUser = async (e, emailformat, fromemail, ccemail, bccemail) => {
    setLoading(true);
    setLoadingMessage('Document is preparing...');
    let response = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });


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
        doc.addImage(response.data.sdocumentPreparation.head, 'JPEG', headerX, headerY, headerImgWidth, headerImgHeight, '', 'FAST', 0.1);

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
        const footerY = (pageHeight * 1) - footerImgHeight - 5;
        doc.addImage(response?.data?.sdocumentPreparation?.foot, 'JPEG', footerX, footerY, footerImgWidth, footerImgHeight, '', 'FAST', 0.1);
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
            ? ((response.data.sdocumentPreparation?.head !== "" && (response.data.sdocumentPreparation?.foot !== "")) ? [45, 15, 45, 15]
              : (response.data.sdocumentPreparation?.head === "" && response.data.sdocumentPreparation?.foot !== "") ? [20, 15, 45, 15]
                : (response.data.sdocumentPreparation?.head !== "" && response.data.sdocumentPreparation?.foot === "") ? [45, 15, 20, 15] :
                  [20, 15, 20, 15])

            :
            ((response.data.sdocumentPreparation?.head !== "" && (response.data.sdocumentPreparation?.foot !== "")) ? [30, 15, 45, 15]
              : (response.data.sdocumentPreparation?.head === "" && response.data.sdocumentPreparation?.foot !== "") ? [15, 15, 45, 15]
                : (response.data.sdocumentPreparation?.head !== "" && response.data.sdocumentPreparation?.foot === "") ? [45, 15, 15, 15] : [15, 15, 15, 15]),
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
  };



  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_DOCUMENTPREPARATION}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentPreparationEdit(res?.data?.sdocumentPreparation);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  //frequency master name updateby edit page...
  let updateby = documentPreparationEdit?.updatedby;
  let addedby = documentPreparationEdit?.addedby;
  let frequencyId = documentPreparationEdit?._id;

  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "EmployeeDocumentPreparation.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Date ", field: "date" },
    { title: "Reference No", field: "referenceno" },
    { title: "Template No", field: "templateno" },
    { title: "Template", field: "template" },
    { title: "EmployeeMode", field: "employeemode" },
    { title: "Department", field: "department" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Person", field: "person" },
    { title: "Printing Status", field: "printingstatus" },
    { title: "Issued Person Details", field: "issuedpersondetails" },
    { title: "Issuing Authority", field: "issuingauthority" },
  ];
  const downloadPdf = (isfilter) => {


    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;

    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable?.map((item, index) => ({
        "serialNumber": index + 1,
        date: item.date,
        referenceno: item.referenceno,
        templateno: item.templateno,
        template: item.template,
        employeemode: item.employeemode,
        department: item.department === "Please Select Department" ? "" : item.department,
        company: item.company === "Please Select Company" ? "" : item.company,
        branch: item.branch === "Please Select Branch" ? "" : item.branch,
        unit: item.unit === "Please Select Unit" ? "" : item.unit,
        team: item.team === "Please Select Team" ? "" : item.team,
        person: item.person,
        printingstatus: item.printingstatus,
        issuedpersondetails: item.issuedpersondetails,
        issuingauthority: item.issuingauthority,

      })) :
      overallExcelDatas.map((item, index) => ({
        "serialNumber": index + 1,
        date: moment(item.date).format("DD-MM-YYYY"),
        referenceno: item.referenceno,
        templateno: item.templateno,
        template: item.template,
        employeemode: item.employeemode,
        department: item.department === "Please Select Department" ? "" : item.department,
        company: item.company === "Please Select Company" ? "" : item.company,
        branch: item.branch === "Please Select Branch" ? "" : item.branch,
        unit: item.unit === "Please Select Unit" ? "" : item.unit,
        team: item.team === "Please Select Team" ? "" : item.team,
        person: item.person,
        printingstatus: item.printingstatus,
        issuedpersondetails: item.issuedpersondetails,
        issuingauthority: item.issuingauthority,

      }))
      ;

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 5,
        cellWidth: 'auto'
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("EmployeeDocumentPreparation.pdf");
  };
  // Excel
  const fileName = "EmployeeDocumentPreparation";


  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "EmployeeDocumentPreparation",
    pageStyle: "print",
  });

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = templateCreationArrayCreate?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      date: moment(item.date).format("DD-MM-YYYY"),
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
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 80,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 40,
      hide: !columnVisibility.serialNumber,
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
      field: "referenceno",
      headerName: "Reference No",
      flex: 0,
      width: 100,
      hide: !columnVisibility.referenceno,
      headerClassName: "bold-header",
    },
    {
      field: "templateno",
      headerName: "Template No",
      flex: 0,
      width: 100,
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
      width: 100,
      hide: !columnVisibility.employeemode,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 140,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 80,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 80,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 80,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 80,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "person",
      headerName: "Person",
      flex: 0,
      width: 100,
      hide: !columnVisibility.person,
      headerClassName: "bold-header",
    },
    {
      field: "document",
      headerName: "Documents",
      flex: 0,
      width: 100,
      minHeight: "40px",
      hide: !columnVisibility.document,
      renderCell: (params) => (
        <Grid>
          <Button
            variant="text"
            onClick={() => {
              downloadPdfTesdtTable(params.row.id);
              getUpdatePrintingStatus(params.row.id)
            }}
            sx={userStyle.buttonview}
          >
            View
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
    {
      field: "email",
      headerName: "Email",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.email,
      renderCell: (params) => (
        <Grid>
          {isUserRoleCompare?.includes("menuemployeedocumentpreparationmail") && (
            <Button
              variant="contained"
              color={params?.row?.mail === "Send" ? "success" : "error"}
              onClick={() => {

                extractEmailFormat(params.row.person, params.row.id)
              }}
              sx={userStyle.buttonview}
            >
              {params?.row?.mail}
            </Button>
          )}
        </Grid>
      ),

    },
    {
      field: "issuedpersondetails",
      headerName: "Issued Person Details",
      flex: 0,
      width: 100,
      hide: !columnVisibility.issuedpersondetails,
      headerClassName: "bold-header",
    },
    {
      field: "issuingauthority",
      headerName: "Issuing Authority",
      flex: 0,
      width: 100,
      hide: !columnVisibility.issuingauthority,
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
          {/* {isUserRoleCompare?.includes("edocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )} */}
          {isUserRoleCompare?.includes("demployeedocumentpreparation") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vemployeedocumentpreparation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iemployeedocumentpreparation") && (
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
      date: item.date,
      referenceno: item.referenceno,
      templateno: item.templateno,
      template: item.template,
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
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Employee Document Preparation</Typography>

      <>
        {isUserRoleCompare?.includes("aemployeedocumentpreparation") && (


          <Box sx={userStyle.selectcontainer}>
            <Typography>
              Add Employee Document Preparation
            </Typography>
            <br /> <br />
            <>
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput id="component-outlined" type="text" value={moment(date).format("DD-MM-YYYY")} />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
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
                          sign: "Please Select Signature",
                          sealing: "Please Select Seal",
                          person: "Please Select Person",
                        });
                        setSealPlacement("")
                        setSignature("")
                        setChecking("")
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
                <Grid item md={4} xs={12} sm={12}>
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
                          person: "Please Select Person",
                        });

                        setEmployeeMode(e.value);
                        setDepartmentCheck(false);
                        setAllBranchValue(false);
                        setGenerateData(false);
                        fetchNamesEmpMode(e.value, "EmpMode");
                        setChecking("")
                        setCheckingArray([])
                        setSelectedEmployeeValues([])
                        setSelectedEmployee([])
                        setIndexViewQuest(1)
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
                    <Grid item md={4} xs={12} sm={12}>
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
                            fetchTeamNames(e.value);
                            fetchIsssuingAuthority(e, "Department")
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <Typography>&nbsp;</Typography>
                      <Button sx={userStyle.btncancel} onClick={handleclearDepartment}>
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


                          CheckNoticePeriod(e.value)
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
                  </Grid>}

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
                <Grid item md={4} xs={12} sm={12}>
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
                {(signatureStatus === "With") && <Grid item md={4} xs={12} sm={12}>
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
                {(sealStatus !== 'Document' && sealStatus !== "") && <Grid item md={4} xs={12} sm={12}>
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
                <Grid item md={4} xs={12} sm={12}>
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
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    {/* <Typography variant="h6">QR Code</Typography> */}
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
                <Grid item md={12} xs={12} sm={12}></Grid>
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
                                          <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
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
                        onClick={handlePreviewDocumentManual}
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
                        // onClick={getDownloadFile}
                        onClick={handlePrintDocumentManual}
                      >
                        Print
                      </LoadingButton>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <LoadingButton loading={btnload} variant="contained" color="primary" sx={userStyle.buttonadd} onClick={handleSubmitedManual}>
                      Save
                    </LoadingButton>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button sx={userStyle.btncancel} onClick={handleclearedManual}>
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
                        onClick={() => handlePreviewDocument(indexViewQuest - 1)}
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
                        onClick={() => handlePrintDocument(indexViewQuest - 1)}
                      >
                        Print
                      </LoadingButton>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <LoadingButton loading={btnload} variant="contained" color="primary" sx={userStyle.buttonadd} onClick={(e) => handleSubmited(e, indexViewQuest - 1)}>
                      Save
                    </LoadingButton>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button sx={userStyle.btncancel} onClick={handlecleared}>
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
                        fetchOverallExcelDatas()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvemployeedocumentpreparation") && (

                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchOverallExcelDatas()
                        setFormat("csv")
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
                    // <>
                    //   <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                    //     <FaFilePdf />
                    //     &ensp;Export to PDF&ensp;
                    //   </Button>
                    // </>
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchOverallExcelDatas()
                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                    {" "}
                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                  </Button>
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined"
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
            {isUserRoleCompare?.includes("bdemployeedocumentpreparation") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert}>
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
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                </Box>
              </>
            }
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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
            {/* ****** Table End ****** */}
            <br />
            <br />
            <br />
            {userRoles?.includes("MANAGER", "HIRINGMANAGER") && <DocumentsPrintedStatusList data={Changed} setData={setChanged} />}
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
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Reference No</TableCell>
              <TableCell>Template No</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Employee Mode</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Person</TableCell>
              <TableCell>Printing Status</TableCell>
              <TableCell>Issued Person Details</TableCell>
              <TableCell>Issuing Authority</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable?.length > 0 &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.referenceno}</TableCell>
                  <TableCell>{row.templateno}</TableCell>
                  <TableCell>{row.template}</TableCell>
                  <TableCell>{row.employeemode}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.person}</TableCell>
                  <TableCell>{row.printingstatus}</TableCell>
                  <TableCell>{row.issuedpersondetails}</TableCell>
                  <TableCell>{row.issuingauthority}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* this is info view details */}
      <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              <b>Document Preparation Info</b>
            </Typography>
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
          <Button autoFocus variant="contained" color="error" onClick={(e) => delBrand(brandid)}>
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
            <Button onClick={handleCloseInfoImage} sx={userStyle.btncancel}>Cancel</Button>
            <LoadingButton loading={btnload} autoFocus variant="contained" color='primary'
              onClick={(e) => sendRequest(e)}
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
            <Button onClick={handleCloseInfoImageManual} sx={userStyle.btncancel}>Cancel</Button>
            <LoadingButton loading={btnload} autoFocus variant="contained" color='primary'
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
              Once Check the Document by clicking Preview button while Saving/Printing the Document whether  it's perfectly alligned
            </Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInfoImagePrint} sx={userStyle.btncancel}>Cancel</Button>
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
            <Button onClick={handleCloseInfoImagePrintManual} sx={userStyle.btncancel}>Cancel</Button>
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
            <Button onClick={handleCloseManualCheck} sx={userStyle.btncancel}>Cancel</Button>
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
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              <b>View Document Preparation</b>
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
                      <Typography>{documentPreparationEdit.unit}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Team</Typography>
                      <Typography>{documentPreparationEdit.team}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                ""
              )}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Person</Typography>
                  <Typography>{documentPreparationEdit.person}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Issuing Authority</Typography>
                  <Typography>{documentPreparationEdit.issuingauthority}</Typography>
                </FormControl>
              </Grid>
              {(documentPreparationEdit.sealing !== "Document" && documentPreparationEdit.sealing !== "") && <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Seal</Typography>
                  <Typography>{documentPreparationEdit.sealing}</Typography>
                </FormControl>
              </Grid>}
              {(documentPreparationEdit.sign !== "Document" && documentPreparationEdit.sign !== "") &&
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Signature</Typography>
                    <Typography>{documentPreparationEdit.sign}</Typography>
                  </FormControl>
                </Grid>}





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
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
            :
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
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
              fetchOverallExcelDatas()
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
            <Button autoFocus variant="contained" color="error" onClick={(e) => delAreagrpcheckbox(e)}>
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
          <Button autoFocus variant="contained" color="error" onClick={handleCloseBulkModalert}>
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
            <Button onClick={handleCloseBulkModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <LoadingButton loading={bulkPrintStatus} autoFocus variant="contained" color="error" onClick={(e) => handleBulkPrint(e)}>
              {" "}
              OK{" "}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Box>
      <br />
      <Loader loading={loading} message={loadingMessage} />
      <Loader loading={loadingAttMonth} message={loadingMessageAttMonth} />
      <Loader loading={loadingAttDate} message={loadingMessageAttDate} />
      <Loader loading={loadingProdDate} message={loadingMessageProdDate} />
      <Loader loading={loadingPreviewData} message={loadingPreviewMessage} />
      <Loader loading={loadingPreviewManualData} message={loadingPreviewMessage} />
      <Loader loading={loadingPrintData} message={loadingPrintMessage} />
      <Loader loading={loadingPrintManualData} message={loadingPrintMessage} />
    </Box>
  );
}

export default DocumentPreparation;