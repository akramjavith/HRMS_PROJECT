import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import * as XLSX from "xlsx";
import { LoadingButton } from "@mui/lab";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List, ListItem, ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Tooltip,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { MdClose } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert.js";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import { handleApiError } from "../../../components/Errorhandling.js";
import ExportData from "../../../components/ExportData.js";
import Headtitle from "../../../components/Headtitle.js";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert.js";
import PageHeading from "../../../components/PageHeading.js";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext.js";
import { userStyle } from "../../../pageStyle.js";
import { SERVICE } from "../../../services/Baseservice.js";
import domtoimage from 'dom-to-image';
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";

function PaidStatusFix() {

  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("")
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [updateSheet, setUpdatesheet] = useState([])
  const [valueCate, setValueCate] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const gridRefTable = useRef(null);

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
      pagename: String("Paid Status Fix List"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });

  }

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
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




  let exportColumnNames = ['Department', 'Month', 'Year', 'Frequency', 'Absent Mode', 'From Value', 'To Value', 'Achieved mode', 'From Point', 'To Point', 'Current Absent Mode', 'Current Absend Value', 'Current Achieved Modes', 'Current Achieved Value', 'Paid Status'];
  let exportRowValues = ['department', 'month', 'year', 'frequency', 'absentmodes', 'fromvalue', 'tovalue', 'achievedmodes', 'frompoint', 'topoint', 'currentabsentmodes', 'currentabsentvalue', 'currentachievedmodes', 'currentachievedvalue', 'paidstatus'];
  //get current month
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  const ans = new Date().getMonth();
  //   filter
  let yeardata = new Date().getFullYear();
  const anss = new Date().getMonth();
  //get current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYear - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  //get current year filter
  const currentYeardata = new Date().getFullYear();
  const yearsdata = Array.from(new Array(10), (val, index) => currentYeardata - index);
  const getyeardata = yearsdata.map((yeardata) => {
    return { value: yeardata, label: yeardata };
  });


  const xeroxyears = Array.from(
    new Array(10),
    (val, index) => Number(Number(currentYear) + 1) - index
  );
  const xeroxgetyear = xeroxyears.map((year) => {
    return { value: year, label: year };
  });
  //get all months
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
  const check = months.find((item) => item.value === ans + 1);

  //get all months filter
  const monthsfilter = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: 'September', label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];
  // const checkfilter = monthsfilter.find((item) => item.value === anss + 1);

  const [paidstatusfix, setPaidstatusfix] = useState({
    department: "Please Select Department",
    month: check.label,
    year: year,
    frequency: "",
    absentmodes: "Between",
    fromvalue: "",
    tovalue: "",
    achievedmodes: "Between",
    frompoint: "",
    topoint: "",
    currentabsentmodes: "Less Than or Equal",
    currentabsentvalue: "",
    currentachievedmodes: "Less Than or Equal",
    currentachievedvalue: "",
    paidstatus: "",
  });

  // overall edit date
  const [ovProj, setOvProj] = useState("");
  const [ovProjj, setOvProjj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");

  const [isBtn, setIsBtn] = useState(false);

  const [paidstatusfixfilter, setPaidstatusfixfilter] = useState({
    // monthdata: checkfilter.label,
    monthdata: "",
    yeardata: year,
    frequency: "Please Select Status",
  });
  const [paidstatusfixEdit, setPaidstatusfixEdit] = useState({
    department: "Please Select Department",
    month: "",
    year: "",
    frequency: "",
    absentmodes: "Between",
    fromvalue: "",
    tovalue: "",
    achievedmodes: "Between",
    frompoint: "",
    topoint: "",
    currentabsentmodes: "Less Than or Equal",
    currentabsentvalue: "",
    currentachievedmodes: "Less Than or Equal",
    currentachievedvalue: "",
    paidstatus: "",
  });

  // Multi Select Department
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState([]);
  const [valueDepartment, setValueDepartment] = useState("");
  const handleDepartmentChange = (options) => {
    setValueDepartment(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
  };
  const customValueRendererDepartment = (valueDepartment, _month) => {
    return valueDepartment?.length
      ? valueDepartment?.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };



  const [selectedOptionsMonth, setSelectedOptionsMonth] = useState([]);
  const [valueMonth, setValueMonth] = useState("");
  const handleMonthChange = (options) => {
    setValueMonth(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsMonth(options);
  };
  const customValueRendererMonth = (valueMonth, _month) => {
    return valueMonth.length
      ? valueMonth.map(({ label }) => label).join(", ")
      : "Please Select Month";
  };

  // Multi Select Year
  const [selectedOptionsYear, setSelectedOptionsYear] = useState([]);
  const [valueYear, setValueYear] = useState("");
  const handleYearChange = (options) => {
    setValueYear(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsYear(options);
  };
  const customValueRendererYear = (valueYear, _year) => {
    return valueYear.length
      ? valueYear.map(({ label }) => label).join(", ")
      : "Please Select Year";
  };

  // Multi Select Status
  const [selectedOptionsStatus, setSelectedOptionsStatus] = useState([]);
  const [valueStatus, setValueStatus] = useState("");
  const handleStatusChange = (options) => {
    setValueStatus(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsStatus(options);
  };
  const customValueRendererStatus = (valueStatus, _status) => {
    return valueStatus.length
      ? valueStatus.map(({ label }) => label).join(", ")
      : "Please Select Status";
  };

  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // // page refersh reload
  // const handleCloseFilterMod = () => {
  //   setIsFilterOpen(false);
  // };
  // const handleClosePdfFilterMod = () => {
  //   setIsPdfFilterOpen(false);
  // };

  const [exportLoading, setExportLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
    // setloadingdeloverall(false);
    setExportLoading(false)
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
    setExportLoading(false)
  };

  const [paidstatusfixs, setPaidstatusfixs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPaidstatusfixedit, setAllPaidstatusfixedit] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [absentmodes, setAbsentmodes] = useState("Between");
  const [achievedmodes, setAchievedmodes] = useState("Between");
  const [currentabsentmodes, setCurrentabsentmodes] = useState("Less Than or Equal");
  const [currentachievedmodes, setCurrentachievedmodes] = useState("Less Than or Equal");
  const [absentmodesEdit, setAbsentmodesEdit] = useState("Between");
  const [achievedmodesEdit, setAchievedmodesEdit] = useState("Between");
  const [currentabsentmodesEdit, setCurrentabsentmodesEdit] = useState("Less Than or Equal");
  const [currentachievedmodesEdit, setCurrentachievedmodesEdit] = useState("Less Than or Equal");
  const [paidstatusfixCheck, setPaidstatusfixcheck] = useState(false);
  const [isXeroxLoad, setIsXeroxLoad] = useState(false);
  const username = isUserRoleAccess.username;
  //xerox
  const [isXerox, setIsXerox] = useState({
    fromyear: "Select Year",
    frommonth: "Select Month",
    toyear: "Select Year",
    tomonth: "Select Month",
  });
  // excelupload
  const [fileUploadName, setFileUploadName] = useState("");
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("Please Select Sheet");
  const [splitArray, setSplitArray] = useState([]);
  const [selectedSheetindex, setSelectedSheetindex] = useState();
  const [loading, setLoading] = useState(false);
  const [dataupdated, setDataupdated] = useState("");
  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "-" + mm + "-" + yyyy;
  let currentdate = new Date();
  let currentyear = currentdate.getFullYear();
  // get current month in string name
  const monthstring = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let monthname = monthstring[new Date().getMonth()];


  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [departments, setDepartments] = useState([]);
  const [paymodes, setPaymodes] = useState([]);
  const [departmentsEdit, setDepartmentsEdit] = useState([]);

  // Multi Select Create
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
    setFileUploadName("");
    setSplitArray([]);
    setDataupdated("");
    setSheets([]);
    setSelectedSheet("Please Select Sheet");
  };
  const customValueRendererCate = (valueCate, _department) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };

  // Edit functionlity
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  let [valueCateEdit, setValueCateEdit] = useState("");
  const handleCategoryChangeEdit = (options) => {
    setSelectedOptionsCateEdit(options);
  };
  const customValueRendererCateEdit = (valueCateEdit, _department) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };
  //get all Areas.
  const fetchDepartmentDropdown = async () => {
    setPageName(!pageName)
    try {
      let res_dept = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const deptall = [
        ...res_dept?.data?.departmentdetails.map((d) => ({
          ...d,
          label: d.deptname,
          value: d.deptname,
        })),
      ];
      setDepartments(deptall);
      setDepartmentsEdit(deptall);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchStatusDropdown = async (e) => {
    try {
      let res_pay = await axios.get(SERVICE.PAIDSTATUSFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_pay.data.paidstatusfixs;

      const uniqueData = new Set();

      const all = result.filter((d) => {
        const isDuplicate = uniqueData.has(d.frequency);
        uniqueData.add(d.frequency);
        return !isDuplicate;
      }).map((d) => ({
        ...d,
        label: d.frequency,
        value: d.frequency,
      }));

      setPaymodes(all);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //xerox function
  const handleXerox = async () => {

    if (isXerox.fromyear === 'Select Year') {
      setPopupContentMalert('Please Select FromYear');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isXerox.frommonth === 'Select Month') {
      setPopupContentMalert('Please Select FromMonth');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isXerox.toyear === 'Select Year') {
      setPopupContentMalert('Please Select ToYear');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isXerox.tomonth === 'Select Month') {
      setPopupContentMalert('Please Select ToMonth');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (isXerox.toyear === isXerox.toyear && isXerox.frommonth == isXerox.tomonth) {
      setPopupContentMalert('Please Select different ToMonth');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      setIsXeroxLoad(true)
      let res_status = await axios.post(SERVICE.XEROXMONTHYEARPAIDSTATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        fromyear: String(isXerox.fromyear),
        frommonth: String(isXerox.frommonth),
        tomonth: String(isXerox.tomonth),
        toyear: String(isXerox.toyear),
        companyname: String(isUserRoleAccess.companyname),
        path: String(SERVICE.PAIDSTATUSFIX_CREATE),
        Authorization: `Bearer ${auth.APIToken}`
      });
      // const resdata = res_status?.data.statusresults;
      // if (resdata.length > 0) {
      //   setIsXeroxLoad(true);
      //    //duplictae check
      //     // const isNameMatch = paidstatusfixs.some(
      //     //   (item) =>
      //     //     item.frequency?.toLowerCase() === data.frequency?.toLowerCase() &&
      //     //     item.month === isXerox.tomonth &&
      //     //     item.year == isXerox.toyear &&
      //     //     item.absentmodes === data.absentmodes &&
      //     //     item.fromvalue.toLowerCase() === data.fromvalue.toLowerCase() &&
      //     //     item.tovalue.toLowerCase() === data.tovalue.toLowerCase() &&
      //     //     item.achievedmodes === data.achievedmodes &&
      //     //     item.frompoint.toLowerCase() === data.frompoint.toLowerCase() &&
      //     //     item.topoint.toLowerCase() === data.topoint.toLowerCase() &&
      //     //     item.currentabsentmodes === data.currentabsentmodes &&
      //     //     item.currentabsentvalue.toLowerCase() === data.currentabsentvalue.toLowerCase() &&
      //     //     item.currentachievedmodes === data.currentachievedmodes &&
      //     //     item.currentachievedvalue.toLowerCase() === data.currentachievedvalue.toLowerCase() &&
      //     //     item.paidstatus.toLowerCase() === (changedslicedate + monthslice + '_' + changedpaidstatus[1] + '_' + changedpaidstatus[2]).toLowerCase() &&
      //     //     item.department.some((data) => data.department.includes(data))
      //     // );
      //   await resdata.forEach((data, index) => {
      //     const changedpaidstatus = data?.paidstatus?.split('_');
      //     const changedslicedate = changedpaidstatus[0]?.substring(0, changedpaidstatus[0]?.length - 3);
      //     const monthslice = isXerox?.tomonth?.slice(0, 3);

      //     let subprojectscreate = axios.post(SERVICE.PAIDSTATUSFIX_CREATE, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },
      //       department: [...data.department],
      //       month: String(isXerox.tomonth),
      //       year: String(isXerox.toyear),
      //       frequency: String(data.frequency),
      //       absentmodes: String(data.absentmodes),
      //       fromvalue: String(data.fromvalue),
      //       tovalue: String(data.tovalue),
      //       achievedmodes: String(data.achievedmodes),
      //       frompoint: String(data.frompoint),
      //       topoint: String(data.topoint),
      //       currentabsentmodes: String(data.currentabsentmodes),
      //       currentabsentvalue: String(data.currentabsentvalue),
      //       currentachievedmodes: String(data.currentachievedmodes),
      //       currentachievedvalue: String(data.currentachievedvalue),
      //       paidstatus: String(changedslicedate + monthslice + '_' + changedpaidstatus[1] + '_' + changedpaidstatus[2]),
      //       addedby: [
      //         {
      //           name: String(isUserRoleAccess.companyname),
      //           date: String(new Date()),
      //         },
      //       ],
      //     });
      //   });
      //   // await fetchEmployee();
      //   await fetchPaidStatusfixDup();
      //   await sendRequestFilter();
      //   setPopupContentMalert('Generated Successfully');
      //   setPopupSeverityMalert('info');
      //   handleClickOpenPopupMalert();
      //   setIsXerox({
      //     fromyear: 'Select Year',
      //     frommonth: 'Select Month',
      //     toyear: 'Select Year',
      //     tomonth: 'Select Month',
      //   });
      //   setIsXeroxLoad(false);
      // } else {
      //   setPopupContentMalert('Selected FromYear/Month there is no any data!');
      //   setPopupSeverityMalert('info');
      //   handleClickOpenPopupMalert();
      // }
      setIsXeroxLoad(false)
      setPopupContentMalert('Generated Successfully');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
      await fetchPaidStatusfixDup();
      await sendRequestFilter();

    }
  };
  const handleclearXerox = () => {
    setIsXeroxLoad(false);
    setIsXerox({
      fromyear: "Select Year",
      frommonth: "Select Month",
      toyear: "Select Year",
      tomonth: "Select Month",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "PaidstatusFix.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsXeroxLoad(false);
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
    setIsHandleChange(true);
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
    department: true,
    month: true,
    year: true,
    frequency: true,
    absentmodes: true,
    fromvalue: true,
    tovalue: true,
    achievedmodes: true,
    frompoint: true,
    topoint: true,
    currentabsentmodes: true,
    currentabsentvalue: true,
    currentachievedmodes: true,
    currentachievedvalue: true,
    paidstatus: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [deletePaidstatus, setDeletePaidstatus] = useState("");

  const [checkPaidstatuspayrun, setCheckPaidstatuspayrun] = useState();

  const rowData = async (id, paidstatus) => {
    setPageName(!pageName)
    try {
      const [res, respayrun] = await Promise.all([
        axios.get(`${SERVICE.PAIDSTATUSFIX_SINGLE}/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.post(SERVICE.CHECKPAIDSTATUS_PAYRUN, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          checkpayrunpaidstatus: String(paidstatus),
          // checkpayrundepartment: departmentpayrun.split(','),
        }),

      ])
      setDeletePaidstatus(res?.data?.spaidstatusfix);
      setCheckPaidstatuspayrun(respayrun?.data?.payrunlists);
      if ((respayrun?.data?.payrunlists)?.length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  // Alert delete popup
  let Paidstatussid = deletePaidstatus?._id;
  const delPaidstatus = async (e) => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.PAIDSTATUSFIX_SINGLE}/${Paidstatussid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // await fetchEmployee();
      // await fetchPaidStatusfixDup();
      await sendRequestFilter('filtered');
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const delPaidstatuscheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PAIDSTATUSFIX_SINGLE}/${item}`, {
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
      // await fetchEmployee();
      // await fetchPaidStatusfixDup();
      await sendRequestFilter('filtered');
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //add function
  const sendRequest = async () => {
    setIsXeroxLoad(true);
    setPageName(!pageName)
    try {
      let subprojectscreate = await axios.post(SERVICE.PAIDSTATUSFIX_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: [...valueCate],
        month: String(paidstatusfix.month),
        year: String(paidstatusfix.year),
        frequency: String(paidstatusfix.frequency),
        absentmodes: String(absentmodes),
        fromvalue: String(paidstatusfix.fromvalue),
        tovalue: String(paidstatusfix.tovalue),
        achievedmodes: String(achievedmodes),
        frompoint: String(paidstatusfix.frompoint),
        topoint: String(paidstatusfix.topoint),
        currentabsentmodes: String(currentabsentmodes),
        currentabsentvalue: String(paidstatusfix.currentabsentvalue),
        currentachievedmodes: String(currentachievedmodes),
        currentachievedvalue: String(paidstatusfix.currentachievedvalue),
        paidstatus: String(paidstatusfix.paidstatus),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      // await fetchEmployee();
      await fetchPaidStatusfixDup();
      await sendRequestFilter('filtered');
      setPaidstatusfix({
        ...paidstatusfix,
        department: "Please Select Department",
        month: check.label,
        year: year,
        frequency: "",
        absentmodes: "Between",
        fromvalue: "",
        tovalue: "",
        achievedmodes: "Between",
        frompoint: "",
        topoint: "",
        currentabsentmodes: "Less Than or Equal",
        currentabsentvalue: "",
        currentachievedmodes: "Less Than or Equal",
        currentachievedvalue: "",
        paidstatus: "",
      });
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsXeroxLoad(false);
    } catch (err) { setIsXeroxLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const sendRequestFilter = async (value) => {
    setPaidstatusfixcheck(true)
    setPageName(!pageName);
    try {
      if (value === "filtered") {

        const queryParams = {
          monthfilter: valueMonth,
          department: valueDepartment,
          yearfilter: valueYear,
          frequencystatusfilter: valueStatus,
          page: Number(page),
          pageSize: Number(pageSize),
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

        // setIsBtn(true)
        const response = await axios.post(SERVICE.PAIDSTATUSFIX_FILTEREDDATA, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        const ans = response?.data?.result?.length > 0 ? response?.data?.result : []
        const anstotalDatas = response?.data?.totalDatas?.length > 0 ? response?.data?.totalDatas : []
        const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          // serialNumber: (page - 1) * pageSize + index + 1,
          // serialNumber: index + 1,
        }));

        setPaidstatusfixs(anstotalDatas?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        })))

        setOverallFilterdata(itemsWithSerialNumber?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
        })));


        setOverallItems(response?.data?.totalDatas?.map((data, index) => ({ ...data, serialNumber: index + 1 })));

        setTotalProjects(ans?.length > 0 ? response?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? response?.data?.totalPages : 0);
        setPageSize((data) => { return ans?.length > 0 ? data : 10 });
        setPage((data) => { return ans?.length > 0 ? data : 1 });

        // setIsBtn(false)
      }
      setPaidstatusfixcheck(false);

    } catch (err) {
      setPaidstatusfixcheck(false);
      // setIsBtn(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [additionalFilters, setAdditionalFilters] = useState([]);

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [logicOperator, setLogicOperator] = useState("AND");
  const [filterValue, setFilterValue] = useState("");

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



  const handleResetSearch = async (value) => {

    setPaidstatusfixcheck(true);
    setPageName(!pageName);
    setFilterdata(true)

    // Reset all filters and pagination state
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
      monthfilter: valueMonth,
      department: valueDepartment,
      yearfilter: valueYear,
      frequencystatusfilter: valueStatus,
      page: Number(page),
      pageSize: Number(pageSize),
      searchQuery: searchQuery
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
      if (value === "filtered") {
        // setIsBtn(true)
        const response = await axios.post(SERVICE.PAIDSTATUSFIX_FILTEREDDATA, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        const ans = response?.data?.result?.length > 0 ? response?.data?.result : []
        const anstotalDatas = response?.data?.totalDatas?.length > 0 ? response?.data?.totalDatas : []
        const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          // serialNumber: (page - 1) * pageSize + index + 1,
          // serialNumber: index + 1,
        }));

        setPaidstatusfixs(anstotalDatas?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        })))
        setItems(itemsWithSerialNumber?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
        })));
        setOverallFilterdata(itemsWithSerialNumber?.map((item, index) => ({
          ...item,
          serialNumber: (page - 1) * pageSize + index + 1,
        })));
        setOverallItems(response?.data?.totalDatas?.map((data, index) => ({ ...data, serialNumber: index + 1 })));

        setTotalProjects(ans?.length > 0 ? response?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? response?.data?.totalPages : 0);
        setPageSize((data) => { return ans?.length > 0 ? data : 10 });
        setPage((data) => { return ans?.length > 0 ? data : 1 });

        // setIsBtn(false)
      }
      setPaidstatusfixcheck(false);

    } catch (err) {
      setPaidstatusfixcheck(false);
      // setIsBtn(false)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  const [paidstatusfixsDup, setPaidstatusfixsDup] = useState([])


  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    let departments = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = paidstatusfixsDup.some(
      (item) =>
        item.frequency?.toLowerCase() ===
        paidstatusfix.frequency?.toLowerCase() &&
        item.month?.toLowerCase() === paidstatusfix.month?.toLowerCase() &&
        item.year == paidstatusfix.year &&
        item.absentmodes?.toLowerCase() === absentmodes?.toLowerCase() &&
        item.achievedmodes?.toLowerCase() === achievedmodes?.toLowerCase() &&
        item.currentabsentmodes?.toLowerCase() === currentabsentmodes?.toLowerCase() &&
        item.currentachievedmodes?.toLowerCase() === currentachievedmodes?.toLowerCase() &&
        item.paidstatus?.toLowerCase() ===
        paidstatusfix.paidstatus?.toLowerCase() &&
        item.department.some((data) => departments.includes(data))
    );
    if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      fileUploadName != "" &&
      selectedSheet === "Please Select Sheet"
    ) {
      setPopupContentMalert("Please Select Sheet");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paidstatusfix.frequency === "") {
      setPopupContentMalert("Please Enter Frequency");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paidstatusfix.paidstatus === "") {
      setPopupContentMalert("Please Enter Paid Status");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!paidstatusfix.paidstatus.includes("_")) {
      setPopupContentMalert("Please Enter Paid Status Format Correctly");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exists!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  //submit option for saving
  const handleSubmitFilter = (e) => {
    e.preventDefault();

    if (
      selectedOptionsDepartment.length === 0 &&
      selectedOptionsMonth.length === 0 &&
      selectedOptionsYear.length === 0 &&
      selectedOptionsStatus.length === 0
    ) {
      setPopupContentMalert("Please Select Any One Field");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestFilter("filtered");
    }

  };

  const handleClearFilter = (e) => {
    e.preventDefault();
    sendRequestFilter("clear");
    setPaidstatusfixs([]);
    setOverallFilterdata([]);
    setTotalProjects(0);
    setTotalPages(0);
    setPaidstatusfixfilter({
      monthdata: "",
      yeardata: year,
      frequency: "Please Select Status",
    });
    setSelectedOptionsMonth([]);
    setSelectedOptionsDepartment([]);
    setSelectedOptionsYear([]);
    setSelectedOptionsStatus([]);
    setForsearch(false)
    setFilterdata(false);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
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
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PAIDSTATUSFIX_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixEdit(res?.data?.spaidstatusfix);
      setSelectedOptionsCateEdit(
        res?.data?.spaidstatusfix.department.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setAbsentmodesEdit(res?.data?.spaidstatusfix.absentmodes);
      setAchievedmodesEdit(res?.data?.spaidstatusfix.achievedmodes);
      setCurrentabsentmodesEdit(res?.data?.spaidstatusfix.currentabsentmodes);
      setCurrentachievedmodesEdit(
        res?.data?.spaidstatusfix.currentachievedmodes
      );
      // getOverallEditSection(res?.data?.spaidstatusfix?.department);
      getOverallEditSection(res?.data?.spaidstatusfix?.paidstatus, res?.data?.spaidstatusfix?.department);
      // setOvProj(res?.data?.spaidstatusfix?.department);
      setOvProj(res?.data?.spaidstatusfix?.paidstatus);
      setOvProjj(res?.data?.spaidstatusfix?.department);
      handleClickOpenEdit();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PAIDSTATUSFIX_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixEdit(res?.data?.spaidstatusfix);
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PAIDSTATUSFIX_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixEdit(res?.data?.spaidstatusfix);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //Project updateby edit page...
  let updateby = paidstatusfixEdit?.updatedby;
  let addedby = paidstatusfixEdit?.addedby;
  let subprojectsid = paidstatusfixEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    let empCate = selectedOptionsCateEdit.map((item) => item.value);
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.PAIDSTATUSFIX_SINGLE}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: [...empCate],
          month: String(paidstatusfixEdit.month),
          year: String(paidstatusfixEdit.year),
          frequency: String(paidstatusfixEdit.frequency),
          absentmodes: String(absentmodesEdit),
          fromvalue: String(paidstatusfixEdit.fromvalue === undefined ? "" : paidstatusfixEdit.fromvalue),
          tovalue: String(paidstatusfixEdit.tovalue === undefined ? "" : paidstatusfixEdit.tovalue),
          achievedmodes: String(achievedmodesEdit),
          frompoint: String(paidstatusfixEdit.frompoint === undefined ? "" : paidstatusfixEdit.frompoint),
          topoint: String(paidstatusfixEdit.topoint === undefined ? "" : paidstatusfixEdit.topoint),
          currentabsentmodes: String(currentabsentmodesEdit),
          currentabsentvalue: String(paidstatusfixEdit.currentabsentvalue === undefined ? "" : paidstatusfixEdit.currentabsentvalue),
          currentachievedmodes: String(currentachievedmodesEdit),
          currentachievedvalue: String(paidstatusfixEdit.currentachievedvalue === undefined ? "" : paidstatusfixEdit.currentachievedvalue),
          paidstatus: String(paidstatusfixEdit.paidstatus),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await sendRequestFilter("filtered");;
      await fetchPaidStatusfixDup();
      await fetchPaidstatusfixAll();
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchPaidstatusfixAll();
    let departmentsEditt = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = allPaidstatusfixedit.some(
      (item) =>
        item.frequency?.toLowerCase() ===
        paidstatusfixEdit.frequency?.toLowerCase() &&
        item.month === paidstatusfixEdit.month &&
        item.year == paidstatusfixEdit.year &&
        item.absentmodes === absentmodesEdit &&
        // item.fromvalue.toLowerCase() ===
        // paidstatusfixEdit.fromvalue.toLowerCase() &&
        // item.tovalue.toLowerCase() ===
        // paidstatusfixEdit.tovalue.toLowerCase() &&
        item.achievedmodes === achievedmodesEdit &&
        // item.frompoint.toLowerCase() ===
        // paidstatusfixEdit.frompoint.toLowerCase() &&
        // item.topoint.toLowerCase() ===
        // paidstatusfixEdit.topoint.toLowerCase() &&
        item.currentabsentmodes === currentabsentmodesEdit &&
        // item.currentabsentvalue.toLowerCase() ===
        // paidstatusfixEdit.currentabsentvalue.toLowerCase() &&
        // item.currentachievedmodes === currentachievedmodesEdit &&
        // item.currentachievedvalue.toLowerCase() ===
        // paidstatusfixEdit.currentachievedvalue.toLowerCase() &&
        item.paidstatus.toLowerCase() ===
        paidstatusfixEdit.paidstatus.toLowerCase() &&
        item.department.some((data) => departmentsEditt.includes(data))
    );
    if (selectedOptionsCateEdit.length == 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paidstatusfixEdit.frequency === "") {
      setPopupContentMalert("Please Enter Frequency");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (paidstatusfixEdit.paidstatus === "") {
      setPopupContentMalert("Please Enter Paid Status");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!paidstatusfixEdit.paidstatus.includes("_")) {
      setPopupContentMalert("Please Enter Paid Status Format Correctly");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data already exits!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedOptionsCateEdit.length != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }

    else {
      sendEditRequest();
    }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e, department) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDITPAYRUNLIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
        oldname2: department,
      });
      setOvProjCount(res?.data?.count);
      // console.log(res?.data?.payrunlists)

      if (res?.data?.payrunlists?.length > 0) {
        let answ = res?.data?.payrunlists.map((d, i) => {
          // let ans = d?.data?.filter((item) => item.paidstatus = e)
          let ans = d?.data
          let anss = ans.map(item => {
            if (item.paidstatus === e) {
              item.paidstatus = paidstatusfixEdit.paidstatus;
            }
            return item;
          });
          // console.log(ans, 'ans')
          // console.log(anss, 'anss')
        });
      }
      setGetOverallCount(`The ${e} is linked in ${res?.data?.payrunlists?.length > 0 ? "Pay Run List ," : ""}   
              whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDITPAYRUNLIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
        oldname2: ovProjj

      });
      sendEditRequestOverall(res?.data?.payrunlists);
      // console.log(res?.data?.payrunlists, 'ghdghd')
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (paidstatus) => {
    // console.log(paidstatus, 'dhgdg')
    try {
      if (paidstatus.length > 0) {
        let answ = paidstatus.map((d, i) => {
          // let ans = d?.data?.filter((item) => item.paidstatus === oldname);
          let ans = d?.data
          let anss = ans.map(item => {
            if (item.paidstatus === ovProj) {
              item.paidstatus = paidstatusfixEdit.paidstatus;
            }
            return item;
          });
          let res = axios.put(`${SERVICE.PAYRUNLIST_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            // paidstatus: String(paidstatusfixEdit.paidstatus),
            data: anss,

          });
        });
      }

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  //get all Sub vendormasters.
  const fetchPaidStatusfixDup = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.PAIDSTATUSFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setPaidstatusfixcheck(true);
      setPaidstatusfixsDup(res_vendor?.data?.paidstatusfixs);
    } catch (err) {
      //  setPaidstatusfixcheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [paidstatusfixsFilterArray, setPaidstatusfixsFilterArray] = useState([])
  const fetchPaidStatusfixArray = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.PAIDSTATUSFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPaidstatusfixsFilterArray(res_vendor?.data?.paidstatusfixs);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchPaidStatusfixArray()
  }, [isFilterOpen])
  const [overallFilterdata, setOverallFilterdata] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fetchEmployee = async () => {
    setPageName(!pageName)
    try {
      let res_employee = await axios.post(SERVICE.PAIDSTATUSFIX_SORT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        page: Number(page),
        pageSize: Number(pageSize),
        searchQuery: searchQuery
      });
      const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        // serialNumber: (page - 1) * pageSize + index + 1,
        // serialNumber: index + 1,
      }));
      // setAcpointCalculation(res_vendor?.data?.acpointcalculation);
      setPaidstatusfixs(itemsWithSerialNumber?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
      })))
      setOverallFilterdata(itemsWithSerialNumber?.map((item, index) => ({
        ...item,
        serialNumber: (page - 1) * pageSize + index + 1,
      })));
      // setClientUserIDArray(itemsWithSerialNumber)
      setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // useEffect(() => {
  //   fetchEmployee();
  // }, [page, pageSize, searchQuery]);

  const [filterdata, setFilterdata] = useState(false)
  const [forsearch, setForsearch] = useState(false)


  useEffect(() => {
    if ((items?.length > 0 && filterdata) || forsearch) {
      sendRequestFilter("filtered");
    }
  }, [page, pageSize, searchQuery]);

  //get all Sub vendormasters.
  const fetchPaidstatusfixAll = async () => {
    setPageName(!pageName)
    try {
      let res_meet = await axios.get(SERVICE.PAIDSTATUSFIX, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllPaidstatusfixedit(
        res_meet?.data?.paidstatusfixs.filter(
          (item) => item._id !== paidstatusfixEdit._id
        )
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Paid Status Fix List",
    pageStyle: "print",
  });
  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;
  useEffect(() => {
    fetchDepartmentDropdown();
    fetchStatusDropdown();
  }, []);
  useEffect(() => {
    // fetchEmployee();
    fetchPaidStatusfixDup();
    fetchPaidstatusfixAll();
  }, []);
  useEffect(() => {
    fetchPaidstatusfixAll();
  }, [isEditOpen, paidstatusfixEdit]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const [items, setItems] = useState([]);
  const addSerialNumber = (datas) => {
    setItems(datas);

  };
  useEffect(() => {
    addSerialNumber(overallFilterdata);
  }, [overallFilterdata]);
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
    setFilterdata(true)

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
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
      sortable: false, // Optionally, you can make this column not sortable
      width: 80,
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
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "month",
      headerName: "Month",
      flex: 0,
      width: 100,
      hide: !columnVisibility.month,
      headerClassName: "bold-header",
    },
    {
      field: "year",
      headerName: "Year",
      flex: 0,
      width: 100,
      hide: !columnVisibility.year,
      headerClassName: "bold-header",
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 0,
      width: 100,
      hide: !columnVisibility.frequency,
      headerClassName: "bold-header",
    },
    {
      field: "absentmodes",
      headerName: "Absent Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.absentmodes,
      headerClassName: "bold-header",
    },
    {
      field: "fromvalue",
      headerName: "From Value",
      flex: 0,
      width: 100,
      hide: !columnVisibility.fromvalue,
      headerClassName: "bold-header",
    },
    {
      field: "tovalue",
      headerName: "To Value",
      flex: 0,
      width: 100,
      hide: !columnVisibility.tovalue,
      headerClassName: "bold-header",
    },
    {
      field: "achievedmodes",
      headerName: "Achieved mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.achievedmodes,
      headerClassName: "bold-header",
    },
    {
      field: "frompoint",
      headerName: "From Point",
      flex: 0,
      width: 100,
      hide: !columnVisibility.frompoint,
      headerClassName: "bold-header",
    },
    {
      field: "topoint",
      headerName: "To Point",
      flex: 0,
      width: 100,
      hide: !columnVisibility.topoint,
      headerClassName: "bold-header",
    },
    {
      field: "currentabsentmodes",
      headerName: "Current Absent Modes",
      flex: 0,
      width: 100,
      hide: !columnVisibility.currentabsentmodes,
      headerClassName: "bold-header",
    },
    {
      field: "currentabsentvalue",
      headerName: "Current Absent Value",
      flex: 0,
      width: 100,
      hide: !columnVisibility.currentabsentvalue,
      headerClassName: "bold-header",
    },
    {
      field: "currentachievedmodes",
      headerName: "Current Acheieved Modes",
      flex: 0,
      width: 100,
      hide: !columnVisibility.currentachievedmodes,
      headerClassName: "bold-header",
    },
    {
      field: "currentachievedvalue",
      headerName: "Current Acheieved Value",
      flex: 0,
      width: 100,
      hide: !columnVisibility.currentachievedvalue,
      headerClassName: "bold-header",
    },
    {
      field: "paidstatus",
      headerName: "Paid Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.paidstatus,
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
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("epaidstatusfixlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCode(params.data.id, params.data.name);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dpaidstatusfixlist") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.paidstatus);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vpaidstatusfixlist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ipaidstatusfixlist") && (
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
      department: item.department.join(",").toString(),
      month: item.month,
      year: item.year,
      frequency: item.frequency,
      absentmodes: item.absentmodes,
      fromvalue: item.fromvalue,
      tovalue: item.tovalue,
      achievedmodes: item.achievedmodes,
      frompoint: item.frompoint,
      topoint: item.topoint,
      currentabsentmodes: item.currentabsentmodes,
      currentabsentvalue: item.currentabsentvalue,
      currentachievedmodes: item.currentachievedmodes,
      currentachievedvalue: item.currentachievedvalue,
      paidstatus: item.paidstatus,
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
  const [fileFormat, setFormat] = useState('')



  const handleExportXL = async (isfilter) => {
    try {

      if (isfilter === "filtered") {
        // Define headers
        let headers = ["Department",
          "Month",
          "Year",
          "Frequency",
          "Absent Mode",
          "From Value",
          "To Value",
          "Achieved Mode",
          "From Point",
          "To Point",
          "Current Absent Modes",
          "Current Absent Value",
          "Current Achieved Modes",
          "Current Achieved Value",
          "Paid Status"];

        // Transform data
        const excelData = rowDataTable.map((entry) => [
          entry.department,
          entry.month,
          entry.year,
          entry.frequency,
          entry.absentmodes,
          entry.fromvalue,
          entry.tovalue,
          entry.achievedmodes,
          entry.frompoint,
          entry.topoint,
          entry.currentabsentmodes,
          entry.currentabsentvalue,
          entry.currentachievedmodes,
          entry.currentachievedvalue,
          entry.paidstatus,

        ]);

        // Combine headers and data
        const finalData = [headers, ...excelData];

        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(finalData);

        // Create workbook and export
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Save file
        XLSX.writeFile(wb, "PaidstatusList.xlsx");
        setIsFilterOpen(false);
      } else if (isfilter === "overall") {
        let result = [];
        setExportLoading(true);

        let response = await axios.post(
          SERVICE.PAID_STATUS_LIST_EXCELDOWNLOAD,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            monthfilter: valueMonth,
            department: valueDepartment,
            yearfilter: valueYear,
            frequencystatusfilter: valueStatus,
            // ✅ Ensure Axios returns a Blob
          },
          {
            responseType: "blob",
          }
        );
        console.log(response, "response");
        // Create a Blob from the response
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "PaidstatusList.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Assuming response.data is the binary data for the Excel file

        setExportLoading(false);
        setIsFilterOpen(false);
      }
    } catch (err) {

      setExportLoading(false)
    }
  };

  const downloadCSV = async (isfilter) => {
    try {
      if (isfilter === "filtered") {
        let headers = ["Department",
          "Month",
          "Year",
          "Frequency",
          "Absent Mode",
          "From Value",
          "To Value",
          "Achieved Mode",
          "From Point",
          "To Point",
          "Current Absent Modes",
          "Current Absent Value",
          "Current Achieved Modes",
          "Current Achieved Value",
          "Paid Status"];

        // Transform data
        const excelData = rowDataTable.map((entry) => [
          entry.department,
          entry.month,
          entry.year,
          entry.frequency,
          entry.absentmodes,
          entry.fromvalue,
          entry.tovalue,
          entry.achievedmodes,
          entry.frompoint,
          entry.topoint,
          entry.currentabsentmodes,
          entry.currentabsentvalue,
          entry.currentachievedmodes,
          entry.currentachievedvalue,
          entry.paidstatus,

        ]);
        // Combine headers and data
        const finalData = [headers, ...excelData];
        // Convert to CSV
        const ws = XLSX.utils.aoa_to_sheet(finalData);
        const csvOutput = XLSX.utils.sheet_to_csv(ws);

        // Trigger CSV file download in browser
        const blob = new Blob([csvOutput], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "PaidstatusList.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (isfilter === "overall") {
        let result = [];
        setExportLoading(true);

        try {
          let response = await axios.post(
            SERVICE.PAID_STATUS_LIST_CSVDOWNLOAD,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              monthfilter: valueMonth,
              department: valueDepartment,
              yearfilter: valueYear,
              frequencystatusfilter: valueStatus,
            },
            {
              responseType: "blob",
            }
          );
          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");

          a.href = url;
          a.download = "PaidstatusList.csv"; // File name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url); // Clean up
          setExportLoading(false);
          setIsFilterOpen(false);
        } catch (error) {
          console.error("Error downloading CSV:", error);
        }
      }
    } catch (err) {
      setExportLoading(false)
    }
  };

  const downloadPdf = async (isfilter) => {
    try {
      if (isfilter === "filtered") {
        try {
          let headers = ["Department",
            "Month",
            "Year",
            "Frequency",
            "Absent Mode",
            "From Value",
            "To Value",
            "Achieved Mode",
            "From Point",
            "To Point",
            "Current Absent Modes",
            "Current Absent Value",
            "Current Achieved Modes",
            "Current Achieved Value",
            "Paid Status"];
          // Transform data
          const excelData = rowDataTable.map((entry) => [
            entry.department,
            entry.month,
            entry.year,
            entry.frequency,
            entry.absentmodes,
            entry.fromvalue,
            entry.tovalue,
            entry.achievedmodes,
            entry.frompoint,
            entry.topoint,
            entry.currentabsentmodes,
            entry.currentabsentvalue,
            entry.currentachievedmodes,
            entry.currentachievedvalue,
            entry.paidstatus,
          ]);


          // Combine headers and data
          const tableData = [headers, ...excelData];

          const docDefinition = {
            pageSize: "A4",
            pageOrientation: "landscape", // Landscape mode
            content: [
              { text: "projmaster", style: "header", alignment: "center" },
              { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "right" },
              "\n",
              {
                table: {
                  headerRows: 1,
                  widths: ["auto", "auto", "auto",
                    "auto", "auto", "auto", "auto", "auto", "auto",
                    "auto", "auto", "auto", "auto", "auto", "auto"],
                  body: tableData,
                },
                layout: "lightHorizontalLines", // Table styling
              },
            ],
            styles: {
              header: { fontSize: 14, bold: true },
              subheader: { fontSize: 10, italics: true },
            },
            defaultStyle: { fontSize: 8 }, // Reduce font size
          };

          pdfMake.createPdf(docDefinition).download("PaidstatusList.pdf"); // Trigger downloa
          setIsPdfFilterOpen(false);
        } catch (err) {
          console.log(err);
        }
      } else if (isfilter === "overall") {
        setExportLoading(true);
        let response = await axios.post(
          SERVICE.PAID_STATUS_LIST_PDFDOWNLOAD,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            monthfilter: valueMonth,
            department: valueDepartment,
            yearfilter: valueYear,
            frequencystatusfilter: valueStatus,
          },
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "PaidstatusList.pdf";
        link.click();
        URL.revokeObjectURL(link.href);
        setExportLoading(false);
        setIsFilterOpen(false);
      }
    } catch (err) {
      console.log(err, "errpdf")
      setExportLoading(false)
    }
  };


  return (
    <Box>
      <Headtitle title={"Paid Status Fix List"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Paid Status Fix List"
        modulename="PayRoll"
        submodulename="PayRoll Setup"
        mainpagename="Paid Status Fix List"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("apaidstatusfixlist") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Paid Status Fix List
                  </Typography>
                </Grid>
              </Grid>
              <br />

              <Grid container spacing={2}>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={departments}
                      value={selectedOptionsDepartment}
                      onChange={handleDepartmentChange}
                      valueRenderer={customValueRendererDepartment}
                      labelledBy="Please Select Department"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Month<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={monthsfilter}
                      value={selectedOptionsMonth}
                      onChange={handleMonthChange}
                      valueRenderer={customValueRendererMonth}
                      labelledBy="Please Select Month"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Year<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={getyeardata}
                      value={selectedOptionsYear}
                      onChange={handleYearChange}
                      valueRenderer={customValueRendererYear}
                      labelledBy="Please Select Year"
                    />
                  </FormControl>
                </Grid>


                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Status<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={paymodes}
                      value={selectedOptionsStatus}
                      onChange={handleStatusChange}
                      valueRenderer={customValueRendererStatus}
                      labelledBy="Please Select Status"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12} mt={5} sx={{
                  display: "flex",
                  //  justifyContent: "center",
                  gap: "20px"
                }}>
                  {/* <Grid
                    container
                    spacing={2}
                    sx={{ display: "flex", justifyContent: "center" }}
                  > */}


                  <Button
                    variant="contained"
                    onClick={(e) => {
                      handleSubmitFilter(e)
                      setFilterdata(true)
                      setForsearch(true)
                    }}
                    // disabled={isBtn}

                    sx={buttonStyles.buttonsubmit}
                  >
                    Filter
                  </Button>



                  <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                    Clear
                  </Button>

                  {/* </Grid> */}
                </Grid>



              </Grid>



            </>
          </Box>
        </>
      )}

      <Box>
        {/* Edit DIALOG */}
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
              marginTop: '50px'
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Paid Status Fix List
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Department </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.department}
                      />
                    </FormControl>
                    {/* <FormControl fullWidth size="small">
                      <Typography>
                        Department<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={departmentsEdit}
                        value={selectedOptionsCateEdit}
                        // onChange={handleCategoryChangeEdit}
                        readOnly
                        valueRenderer={customValueRendererCateEdit}
                        labelledBy="Please Select Department"
                      // className="scrollable-multiselect"
                      />
                    </FormControl> */}
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Typography>Select Month</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={200}
                        value={{
                          label: paidstatusfixEdit.month,
                          value: paidstatusfixEdit.month,
                        }}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            month: e.label,
                          });
                        }}
                        options={months}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={6} xs={12}>
                    <Typography> Select Year</Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={200}
                        value={{
                          label: paidstatusfixEdit.year,
                          value: paidstatusfixEdit.year,
                        }}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            year: e.value,
                          });
                        }}
                        options={getyear}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Frequency <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.frequency}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            frequency: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Absent Mode </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={absentmodesEdit}
                        onChange={(e) => {
                          setAbsentmodesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="Between"> {"Between"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>From Value </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.fromvalue}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            fromvalue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>To Value </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.tovalue}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            tovalue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Achieved Mode </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={achievedmodesEdit}
                        onChange={(e) => {
                          setAchievedmodesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="Between"> {"Between"} </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>From Point </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.frompoint}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            frompoint: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>To Point </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.topoint}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            topoint: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Current Absent Mode </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={currentabsentmodesEdit}
                        onChange={(e) => {
                          setCurrentabsentmodesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="Less Than or Equal">
                          {" "}
                          {"Less Than or Equal"}{" "}
                        </MenuItem>
                        <MenuItem value="Less Than"> {"Less Than"} </MenuItem>
                        <MenuItem value="Greater Than">
                          {" "}
                          {"Greater Than"}{" "}
                        </MenuItem>
                        <MenuItem value="Greater Than  or Equal">
                          {" "}
                          {"Greater Than or Equal"}{" "}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Current Absent Value </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.currentabsentvalue}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            currentabsentvalue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Current Achieved Mode </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        value={currentachievedmodesEdit}
                        onChange={(e) => {
                          setCurrentachievedmodesEdit(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="Less Than or Equal">
                          {" "}
                          {"Less Than or Equal"}{" "}
                        </MenuItem>
                        <MenuItem value="Less Than"> {"Less Than"} </MenuItem>
                        <MenuItem value="Greater Than">
                          {" "}
                          {"Greater Than"}{" "}
                        </MenuItem>
                        <MenuItem value="Greater Than  or Equal">
                          {" "}
                          {"Greater Than or Equal"}{" "}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Current Achieved Value </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.currentachievedvalue}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            currentachievedvalue: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Paid Status<b style={{ color: "red" }}>*</b>{" "}
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={paidstatusfixEdit.paidstatus}
                        onChange={(e) => {
                          setPaidstatusfixEdit({
                            ...paidstatusfixEdit,
                            paidstatus: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lpaidstatusfixlist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Paid Status Fix List
              </Typography>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={2} sm={6} xs={12}>
                <Typography> From Year</Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={200}
                    value={{ label: isXerox.fromyear, value: isXerox.fromyear }}
                    onChange={(e) => {
                      setIsXerox({ ...isXerox, fromyear: e.value });
                    }}
                    options={getyear}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} sm={6} xs={12}>
                <Typography>From Month</Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={200}
                    value={{
                      label: isXerox.frommonth,
                      value: isXerox.frommonth,
                    }}
                    onChange={(e) => {
                      setIsXerox({ ...isXerox, frommonth: e.label });
                    }}
                    options={months}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} sm={6} xs={12}>
                <Typography> To Year</Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={200}
                    value={{ label: isXerox.toyear, value: isXerox.toyear }}
                    onChange={(e) => {
                      setIsXerox({ ...isXerox, toyear: e.value });
                    }}
                    options={xeroxgetyear}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} sm={6} xs={12}>
                <Typography> To Month</Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={200}
                    value={{ label: isXerox.tomonth, value: isXerox.tomonth }}
                    onChange={(e) => {
                      setIsXerox({ ...isXerox, tomonth: e.label });
                    }}
                    options={months}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6} mt={0.5}>
                <br />
                <Button
                  variant="contained"
                  disabled={isXeroxLoad === true}
                  onClick={handleXerox}
                  sx={buttonStyles.buttonsubmit}
                >
                  XEROX
                </Button>
                &nbsp;&nbsp;
                <Button sx={buttonStyles.btncancel} onClick={handleclearXerox}>
                  Clear
                </Button>
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
                    <MenuItem value={overallItems?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelpaidstatusfixlist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchPaidStatusfixArray()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvpaidstatusfixlist") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchPaidStatusfixArray()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printpaidstatusfixlist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfpaidstatusfixlist") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchPaidStatusfixArray()
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagepaidstatusfixlist") && (
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
                {/* <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={paidstatusfixs} setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={true}
                  totalDatas={overallItems}

                /> */}
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
                          <IconButton onClick={(e) => {
                            handleResetSearch("filtered")
                          }}>
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

            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <Button
              variant="contained"
              color="error"
              onClick={handleClickOpenalert}
              sx={buttonStyles.buttonbulkdelete}
            >
              Bulk Delete
            </Button>
            <br />
            <br />
            {paidstatusfixCheck ? (
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
                  totalDatas={totalProjects}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={paidstatusfixs}
                />

                {/* <AggridTable
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
                  gridRefTable={gridRef}
                  paginated={true}
                  totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  filteredDatas={filteredDatas}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}
                /> */}
              </>
            )}
          </Box>
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
                          sendRequestFilter("filtered");
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
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: '50px' }}
      >
        <Box sx={{ width: "auto", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Paid Status Fix List
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Department</Typography>
                  <Typography>{paidstatusfixEdit.department + ","}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Select Month</Typography>
                  <Typography>{paidstatusfixEdit.month}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Select Year</Typography>
                  <Typography>{paidstatusfixEdit.year}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Frequency</Typography>
                  <Typography>{paidstatusfixEdit.frequency}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Absent Mode</Typography>
                  <Typography>{paidstatusfixEdit.absentmodes}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Value</Typography>
                  <Typography>{paidstatusfixEdit.fromvalue}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Value</Typography>
                  <Typography>{paidstatusfixEdit.tovalue}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Achieved Mode</Typography>
                  <Typography>{paidstatusfixEdit.achievedmodes}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">From Point</Typography>
                  <Typography>{paidstatusfixEdit.frompoint}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">To Point</Typography>
                  <Typography>{paidstatusfixEdit.topoint}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Absent Mode</Typography>
                  <Typography>
                    {paidstatusfixEdit.currentabsentmodes}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Absent Value</Typography>
                  <Typography>
                    {paidstatusfixEdit.currentabsentvalue}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Achieved Mode</Typography>
                  <Typography>
                    {paidstatusfixEdit.currentachievedmodes}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Current Achieved Value </Typography>
                  <Typography>
                    {paidstatusfixEdit.currentachievedvalue}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Paid Status</Typography>
                  <Typography>{paidstatusfixEdit.paidstatus}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseview}
                sx={buttonStyles.btncancel}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* Check delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

                <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                  <>
                    {checkPaidstatuspayrun?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletePaidstatus.paidstatus} `}</span>
                        was linked in <span style={{ fontWeight: "700" }}>Pay Run  </span>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                </Typography>

              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      </Box>

      {/* ALERT DIALOG for the overall edit*/}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        // isFilterOpen={isFilterOpen}
        // handleCloseFilterMod={handleCloseFilterMod}
        // fileFormat={fileFormat}
        // setIsFilterOpen={setIsFilterOpen}
        // isPdfFilterOpen={isPdfFilterOpen}
        // setIsPdfFilterOpen={setIsPdfFilterOpen}
        // handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={paidstatusfixsFilterArray ?? []}
        // itemsTwo={overallItems ?? []}
        filename={"Paid Status Fix List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Paid Status Fix List Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delPaidstatus}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delPaidstatuscheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}

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
          {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} /> : <FaFileCsv style={{ fontSize: "80px", color: "green" }} />}
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              fileFormat === "xl" ? handleExportXL("filtered") : downloadCSV("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <LoadingButton
            autoFocus
            loading={exportLoading}
            variant="contained"
            onClick={(e) => {
              fileFormat === "xl" ? handleExportXL("overall") : downloadCSV("overall");
            }}
          >
            Export Over All Data
          </LoadingButton>
        </DialogActions>
      </Dialog>

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
              downloadPdf("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <LoadingButton
            variant="contained"
            loading={exportLoading}
            onClick={(e) => {
              downloadPdf("overall");
            }}
          >
            Export Over All Data
          </LoadingButton>
        </DialogActions>
      </Dialog>


    </Box>
  );
}

export default PaidStatusFix;