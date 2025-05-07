import CloseIcon from "@mui/icons-material/Close";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
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
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextField,
  Typography,
  FormControlLabel,
  InputAdornment,
  Tooltip,
  Radio, RadioGroup,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MdClose } from "react-icons/md";
import { IoMdOptions } from "react-icons/io";
import AggridTableForPaginationTable from "../../../components/AggridTableForPaginationTable.js";
import Resizable from "react-resizable";
import { Link, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import ExportData from "../../../components/ExportData";
import Headtitle from "../../../components/Headtitle";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import StyledDataGrid from "../../../components/TableStyle";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import ScheduleMeetingNoticePeriod from "./ScheduleMeetingNoticePeriod";
import Selects from "react-select";
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const Loader = ({ loading, message }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}
      open={loading}
    >
      <div style={{ textAlign: "center" }}>
        <CircularProgress sx={{ color: "#edf1f7" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#edf1f7" }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};

function Noticestatuslist() {

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Please Wait...!");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryApproved, setSearchQueryApproved] = useState("");
  let exportColumnNames = [
    'Name', 'Company', 'Branch',
    'Unit',
    'Empcode', 'Team',
    'Department', 'Date',
    'Reason', 'Status',


  ];
  let exportRowValues = [
    'empname', 'company',
    'branch',
    'unit',

    'empcode',
    'team',
    'department',
    'noticedate',
    'reasonleavingname',
    'status',

  ];

  let exportColumnNamesApproved = [
    'Name', 'Company', 'Branch',
    'Unit',
    'Empcode', 'Team',
    'Department', 'Reason',
    'Status', 'Release Date'
  ];
  let exportRowValuesApproved = [
    'empname', 'company',
    'branch',
    'unit',

    'empcode',
    'team',
    'department',
    'reasonleavingname',
    'status',
    'releasedate'
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

  const [overallItems, setOverallItems] = useState([]);
  const [overallItemsNew, setOverallItemsNew] = useState([]);

  const [openviewReasonlev, setOpenviewReasonlev] = useState(false);
  const [leaving, setLeaving] = useState({ name: "" });
  // view model
  const handleClickOpenviewResonlev = () => {
    setOpenviewReasonlev(true);
  };

  const handleCloseviewReasonlev = () => {
    setOpenviewReasonlev(false);
    setLeaving({ name: "" });
  };

  const handleClearreason = () => {
    setLeaving({ name: "" });
  };

  const [leavingfetch, setleavingfetch] = useState([]);
  const [allReasons, setAllReasons] = useState([]);
  const handleUpdateRejectReason = async (id, event, from) => {

    const updatedValue = event?.value;

    // Find the row by ID
    const updatedRow = rejectReasons?.find((item) => item?.id === id);

    if (updatedRow) {
      // Update the field in the row (modify as needed)
      if (from === "reject") {
        updatedRow.rejectnoticereq = updatedValue;
      } else if (from === "recheck") {
        updatedRow.rechecknoticereq = updatedValue;
      }


      // Optional: setState to trigger re-render if you're managing state
      const updatedRows = rejectReasons.map((item) => {
        if (item.id === id) {
          let updatedField = "";

          if (from === "reject") {
            updatedField = "rejectnoticereq";
          } else if (from === "recheck") {
            updatedField = "rechecknoticereq";
          } else if (from === "cancel") {
            updatedField = "cancelnoticereq";
          }

          return {
            ...item,
            [updatedField]: updatedValue,
          };
        }
        return item;
      });

      setRejectReasons(updatedRows); // if using useState
    }
  };


  const [attendanceCriteria, setAttendanceCriteria] = useState({});
  const fecthAttendanceControlCriteria = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(
        SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setAttendanceCriteria(response?.data?.attendancecontrolcriteria[0])
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const fecthWithOutDates = async (datas, dateValue) => {
    setLoading(true);
    setPageName(!pageName);
    let inputDate = dateValue;
    try {
      const pipeline = [
        {
          $match: {
            companyname: datas?.empname
          },
        },
        {
          $project: {
            successfullyrejoined: 1,
            rejoineduser: 1,
            designation: 1,
            company: 1,
            branch: 1,
            unit: 1,
            team: 1,
            companyname: 1,
            workmode: 1,
          },
        },
      ];

      let resNew = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline: pipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let filteredDatas = resNew.data?.users;
      let res = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let designationDate = res?.data?.designation;
      var formatDate;
      var finaldate;
      const filteredDesignationDates = designationDate
        ?.filter((item) => item.name === filteredDatas[0]?.designation)
        .map(({ noticeperiodfrom, noticeperiodto }) => ({
          noticeperiodfrom,
          noticeperiodto,
        }));
      if (filteredDesignationDates && filteredDesignationDates.length > 0) {
        if (filteredDesignationDates[0].noticeperiodfrom === 'Month') {

          let monthsToAdd = Number(filteredDesignationDates[0].noticeperiodto);
          let date = moment(datas?.noticedate, "DD-MM-YYYY").toDate();
          date.setMonth(date.getMonth() + monthsToAdd);
          let dd = String(date.getDate()).padStart(2, '0');
          let mm = String(date.getMonth() + 1).padStart(2, '0');
          let yyyy = date.getFullYear();
          formatDate = yyyy + '-' + mm + '-' + dd;

        } else if (filteredDesignationDates[0].noticeperiodfrom === 'Day') {
          let datesToAdd = Number(filteredDesignationDates[0].noticeperiodto);
          let dated = moment(datas?.noticedate, "DD-MM-YYYY").toDate();
          dated.setDate(dated.getDate() + datesToAdd);
          let ddd = String(dated.getDate()).padStart(2, '0');
          let mmd = String(dated.getMonth() + 1).padStart(2, '0');
          let yyyyd = dated.getFullYear();
          formatDate = yyyyd + '-' + mmd + '-' + ddd;
        }
        const addonwithfromDate = moment(formatDate);
        const getdays = Number(filteredDesignationDates[0].noticeperiodto) <= 90 ? 30 : 60;
        const addonwithresult = addonwithfromDate.add(Number(getdays), 'days').format('YYYY-MM-DD');

        // let startMonthDate = new Date(datas?.noticedate);
        let startMonthDate = moment(datas?.noticedate, "DD-MM-YYYY").toDate();
        let endMonthDate = new Date(addonwithresult);
        const daysArray = [];

        while (startMonthDate <= endMonthDate) {
          const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
          const dayName = startMonthDate.toLocaleDateString('en-US', {
            weekday: 'long',
          });
          const dayCount = startMonthDate.getDate();
          const shiftMode = 'Main Shift';

          daysArray.push({ formattedDate, dayName, dayCount, shiftMode });

          // Move to the next day
          startMonthDate.setDate(startMonthDate.getDate() + 1);
        }

        let resdata = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_CHECKLOGIN, {
          userDates: daysArray,
          empcode: datas?.empcode,
        });
        // const resuser = resdata?.data?.finaluser.filter((data, index) => {
        //   return data.shift !== 'Week Off';
        // });
        const resuser = resdata?.data?.finaluser.filter((data) => {
          return /^(\d{2}:\d{2}[AP]M)to(\d{2}:\d{2}[AP]M)$/.test(data.shift);
        });
        const mappedDatas = resuser?.map((data) => {
          let [date, month, year] = data?.formattedDate?.split('/');
          return `${year}-${month}-${date}`
        })
        const resfinaldate = resuser.filter((data, index) => {
          if (Number(index - 1) === Number(filteredDesignationDates[0]?.noticeperiodto)) {
            return data;
          }
        });
        finaldate = mappedDatas[mappedDatas?.length - 1];

        let nameArray = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        let daysNameArray = Object.keys(attendanceCriteria || {})?.filter((item) => {
          let firstCond = nameArray?.includes(item);
          let secondCond = attendanceCriteria[item] === true;

          return firstCond && secondCond

        });

        let selectedDateNumber = inputDate?.split('-')[2]

        const from = Number(attendanceCriteria?.relievingfromdate);
        const to = Number(attendanceCriteria?.relievingtodate);

        let dayName = moment(inputDate).format('dddd').toLowerCase();

        if (inputDate > finaldate) {
          setPopupContentMalert('Selected Date is Outside of the Notice Period Duration!');
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          setLoading(false);
        } else if (!mappedDatas?.includes(inputDate)) {
          setPopupContentMalert('Selected Date is a Weekoff or Holiday!');
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          setLoading(false);
        } else if (!daysNameArray?.includes(dayName)) {
          setPopupContentMalert('Selected Date is the day which is not Present in the Relieving Days!');
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          setLoading(false);
        } else if (!(selectedDateNumber >= from && selectedDateNumber <= to)) {
          setPopupContentMalert('Selected Date is Not Between the Relieving Dates!');
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          setLoading(false);
        } else {
          setManualDate(inputDate);
          setLoading(false);
        }
      }
    } catch (err) {
      console.log(err, "err")
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fecthAttendanceControlCriteria();
  }, [])


  const handleUpdateRejectReasonApproved = async (id, event, from) => {
    const updatedValue = event?.value;

    // Find the row by ID
    const updatedRow = rejectReasonsApproved?.find((item) => item?.id === id);

    if (updatedRow) {
      // Update the field in the row (modify as needed)
      if (from === "cancel") {
        updatedRow.cancelreason = updatedValue;
      } else if (from === "continue") {
        updatedRow.continuereason = updatedValue;
      }


      // Optional: setState to trigger re-render if you're managing state
      const updatedRows = rejectReasonsApproved.map((item) => {
        if (item.id === id) {
          let updatedField = "";

          if (from === "cancel") {
            updatedField = "cancelreason";
          } else if (from === "continue") {
            updatedField = "continuereason";
          }
          return {
            ...item,
            [updatedField]: updatedValue,
          };
        }
        return item;
      });

      setRejectReasonsApproved(updatedRows); // if using useState
    }
  };
  const fetchreasonleaving = async () => {
    setPageName(!pageName);
    try {
      let res_project = await axios.get(SERVICE.NOTICEAPPROVEREASON, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let reason = res_project?.data?.noticereasons?.map((item) => item.name?.toLocaleLowerCase())
      setAllReasons(reason)
      const projall = [
        ...res_project?.data?.noticereasons.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setleavingfetch(projall);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchreasonleaving();
  }, [])

  const handleSubmitReason = (e) => {
    setReasonBtn(true);
    e.preventDefault();
    if (leaving.name === "" || leaving.name === undefined) {
      setPopupContentMalert('Please Enter Reason');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setReasonBtn(false);
    }
    else if (allReasons?.includes(leaving.name?.toLocaleLowerCase())) {
      setPopupContentMalert('Reason Already Exists!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setReasonBtn(false);
    }
    else {
      setSearchQuery("");
      sendRequestReason();
    }
  };
  const [reasonBtn, setReasonBtn] = useState(false);

  const sendRequestReason = async () => {
    setPageName(!pageName);
    try {
      let projectscreate = await axios.post(SERVICE.NOTICEAPPROVEREASON_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(leaving.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchreasonleaving();
      setLeaving(projectscreate.data);
      setLeaving("");
      handleCloseviewReasonlev();
      setReasonBtn(false);
    } catch (err) {
      setReasonBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const gridRef = useRef(null);
  const gridRef1 = useRef(null);
  const [vendorAuto, setVendorAuto] = useState("");

  useEffect(() => {
    fetchNoticeperiodlistApproved();
    fetchNoticeperiodlist();
    fetchChecklisttype();
    fetchChecklisttypeApproved();
  }, [vendorAuto]);

  const [employees, setEmployees] = useState([]);
  const [employeeApproved, setemployeeApproved] = useState([]);
  const [pageApproved, setPageApproved] = useState(1);
  const [pageSizeApproved, setPageApprovedSize] = useState(10);
  const [fileApproved, setFileApproved] = useState("");

  // clipboard
  const [copiedData, setCopiedData] = useState("");
  // const [selectedbranch, setselectedbranch] = useState([]);
  const [exceldataApproved, setexceldataApproved] = useState([]);

  const [isBoardingApproved, setIsBoardingApproved] = useState(true);

  // let username = isUserRoleAccess.name
  // const id = useParams().id
  const { isUserRoleAccess, isUserRoleCompare, pageName, setPageName, isAssignBranch, buttonStyles } = useContext(
    UserRoleAccessContext
  );



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
      pagename: String("Notice Period Approve List"),
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

  // page refersh reload code
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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth, setAuth } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [noticePeriod, setNoticeperiod] = useState("");

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  // const [selectedbranch, setselectedbranch] = useState([]);
  const [exceldata, setexceldata] = useState([]);

  const [isBoarding, setIsBoarding] = useState(true);

  const id = useParams().id;

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  //alert model for schedule meeting
  const [openMeetingPopup, setOpenMeetingPopup] = useState(false);
  const [meetingValues, setMeetingValues] = useState([]);
  // meeting popup model
  const handleClickOpenMeetingPopup = (
    company,
    branch,
    team,
    department,
    empname,
    noticeperiodid
  ) => {

    setMeetingValues([
      company,
      branch,
      team,
      department,
      empname,
      noticeperiodid,
    ]);
    setOpenMeetingPopup(true);

  };

  const handleClickCloseMeetingPopup = () => {
    setOpenMeetingPopup(false);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [isFilterOpen2, setIsFilterOpen2] = useState(false);
  const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

  // page refersh reload
  const handleCloseFilterMod2 = () => {
    setIsFilterOpen2(false);
  };

  const handleClosePdfFilterMod2 = () => {
    setIsPdfFilterOpen2(false);
  };

  //alert model for view schedule meeting
  const [openMeetingViewPopup, setOpenMeetingViewPopup] = useState(false);
  const [meetingData, setMeetingData] = useState(false);
  // meeting popup model
  const handleClickOpenMeetingViewPopup = () => {
    setOpenMeetingViewPopup(true);
  };

  const handleClickCloseMeetingViewPopup = () => {
    setOpenMeetingViewPopup(false);
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_NOTICEMEETING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setMeetingData(res?.data?.nschedulemeeting);
      handleClickOpenMeetingViewPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Notice Period Request List.png");
        });
      });
    }
  };
  const handleCaptureImageApproved = () => {
    if (gridRef1.current) {
      html2canvas(gridRef1.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Notice Period List Approved.png");
        });
      });
    }
  };

  // clipboard
  const [copiedDataApproved, setCopiedDataApproved] = useState("");

  // State for manage columns search query
  const [searchQueryManageApproved, setSearchQueryManageApproved] =
    useState("");
  // Manage Columns
  const [isManageColumnsOpenApproved, setManageColumnsOpenApproved] =
    useState(false);
  const [anchorElApproved, setAnchorElApproved] = useState(null);
  const handleOpenManageColumnsApproved = (event) => {
    setAnchorElApproved(event.currentTarget);
    setManageColumnsOpenApproved(true);
  };
  const handleCloseManageColumnsApproved = () => {
    setManageColumnsOpenApproved(false);
    setSearchQueryManageApproved("");
  };

  const openApproved = Boolean(anchorElApproved);
  const idApproved = openApproved ? "simple-popover" : undefined;

  const [selectedRowsApproved, setSelectedRowsApproved] = useState([]);

  // State for manage columns search query
  const [searchQueryManage, setSearchQueryManage] = useState("");

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
  const ids = open ? "simple-popover" : undefined;

  const [selectedRows, setSelectedRows] = useState([]);

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    empname: true,
    empcode: true,
    department: true,
    noticedate: true,
    reasonleavingname: true,
    status: true,
    team: true,
    files: true,
    releasedate: true,
    approved: true,
    requestdate: true,
    reject: true,
    recheck: true,
    cancel: true,
    continue: true,
    upload: true,
    requestdatereason: true,
    scheduleinterview: true,
    meetingremarks: true,
    meetingcompleted: true,
    actionsnew: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );


  // getcode for Approved statsu
  const getCode = async (e, statuss) => {
    setPageName(!pageName);
    setLoading(true);
    try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = rowDataTable.filter((data) => data.id === e);
      // if (statuss === "approve") {
      //   setAppdate(ans[0]?.approved);
      // } else  {
      //   setAppdate(ans[0]?.requestdate);
      // }
      setNoticeperiod(res?.data?.snoticeperiodapply);

      await handleSubmitApproved(res?.data?.snoticeperiodapply._id, statuss);
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  let bor = noticePeriod._id;
  const [approvedDate, setApprovedDate] = useState("");

  //add function...ApprovedStatus
  const sendRequestApproved = async (e, status) => {
    setPageName(!pageName);
    try {
      let ans = rowDataTable.filter((data) => data.id === e);
      if (status === "approve") {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          approvedStatus: "true",
          approvenoticereq:
            approvedDate.date === undefined
              ? ans[0]?.approved
              : approvedDate.date,
          approvedthrough: "Approved",
        });
        setNoticeperiod(res.data);
      } else if (status === "manualdate") {
        if (manualDate === "") {
          setPopupContentMalert('Please Select Manual Date');
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
        } else {
          let res = await axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },

              approvedStatus: "true",
              approvenoticereq: manualDate,
              approvedthrough: "Manual Date",
            }
          );
          setNoticeperiod(res.data);
        }
      } else {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          approvedStatus: "true",
          approvenoticereq: ans[0]?.requestdate,
          requestdate: ans[0]?.requestdate,
          approvedthrough: "Requestdate",
        });
        setNoticeperiod(res.data);
      }



      await fetchNoticeperiodlistApproved();
      await fetchNoticeperiodlist();
      await fetchChecklisttype();
      await fetchChecklisttypeApproved();
      setLoading(false);
      setManualDate("");
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving approved
  const handleSubmitApproved = (e, status) => {
    sendRequestApproved(e, status);
  };

  // getcode fro the recheck
  const getCodeRecheck = async (e, value) => {
    setPageName(!pageName);
    setLoading(true);
    try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNoticeperiod(res?.data?.snoticeperiodapply);
      handleSubmitRecheck(
        res?.data?.snoticeperiodapply._id,
        res?.data?.snoticeperiodapply?.rechecknoticereq
      );
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // recheck status
  const sendRequestRecheck = async (e, value) => {

    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        recheckStatus: "true",
        rechecknoticereq: value,
      });
      await fetchNoticeperiodlist();
      await fetchChecklisttype();
      setLoading(false);
      await fetchChecklisttypeApproved();

    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //submit option for saving recheck
  const handleSubmitRecheck = (e, value) => {
    const selectedRow = rejectReasons.find(item => item.id === e);
    let sendValue;
    if (selectedRow) {
      sendValue = selectedRow?.rechecknoticereq
    }
    console.log(sendValue, "sendValue")
    if (!selectedRow.rechecknoticereq) {
      setPopupContentMalert('Please Select Recheck Reason');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setLoading(false);
    } else {
      sendRequestRecheck(e, sendValue);
    }

  };

  // getcode for the reject
  const getCodeReject = async (e, value, status) => {
    setPageName(!pageName);
    setLoading(true);
    try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNoticeperiod(res?.data?.snoticeperiodapply);
      if (status === "reject") {
        handleSubmitReject(
          res?.data?.snoticeperiodapply._id,
          res?.data?.snoticeperiodapply?.rejectnoticereq,
          status
        );
      } else if (status === "cancel") {
        handleSubmitReject(
          res?.data?.snoticeperiodapply._id,
          res?.data?.snoticeperiodapply?.cancelreason,
          status
        );
      } else if (status === "continue") {
        handleSubmitReject(
          res?.data?.snoticeperiodapply._id,
          res?.data?.snoticeperiodapply?.continuereason,
          status
        );
      }
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // reject status
  const sendRequestReject = async (e, value, status) => {
    setPageName(!pageName);
    try {
      if (status === "reject") {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          rejectStatus: "true",
          rejectnoticereq: value,
        });
        setNoticeperiod(res.data);
      } else if (status === "cancel") {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          cancelstatus: Boolean(true),
          cancelreason: String(value),
        });
        setNoticeperiod(res.data);
      } else if (status === "continue") {
        let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          continuestatus: Boolean(true),
          continuereason: String(value),
        });
        setNoticeperiod(res.data);
      }

      await fetchNoticeperiodlist();
      await fetchNoticeperiodlistApproved();
      await fetchChecklisttype();
      await fetchChecklisttypeApproved();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); } finally {
      setLoading(false);
    }
  };

  //submit option for saving reject
  const handleSubmitReject = (e, value, status) => {
    const selectedRow = rejectReasons.find(item => item.id === e);
    const selectedRowApproved = rejectReasonsApproved.find(item => item.id === e);
    let sendValue;
    if (status === 'reject' && selectedRow.rejectnoticereq) {
      sendValue = selectedRow.rejectnoticereq
    } else if (status === 'cancel' && selectedRowApproved.cancelreason) {
      sendValue = selectedRowApproved.cancelreason
    } else if (status === 'continue' && selectedRowApproved.continuereason) {
      sendValue = selectedRowApproved.continuereason
    }

    if (status === 'reject' && !selectedRow.rejectnoticereq) {
      setPopupContentMalert('Please Select Reject Reason');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setLoading(false);
    } else if (status === 'cancel' && !selectedRowApproved.cancelreason) {
      setPopupContentMalert('Please Select Cancel Reason');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setLoading(false);
    } else if (status === 'continue' && !selectedRowApproved.continuereason) {
      setPopupContentMalert('Please Select Continue Reason');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      setLoading(false);
    }
    else {
      sendRequestReject(e, sendValue, status);
    }
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
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

  //get single row to edit....
  const fileData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      renderFilePreview(res?.data?.snoticeperiodapply.files[0]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get single row to edit....
  const fileDataDownload = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFile(res?.data?.snoticeperiodapply.files[0]);
      res?.data?.snoticeperiodapply.files.forEach((file) => {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${file.base64}`;
        link.download = file.name;
        link.click();
      });
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);

  const [totalPagesApproved, setTotalPagesApproved] = useState(0);
  const [totalDatasApproved, setTotalDatasApproved] = useState(0);

  //20.11.2024-------------------------------------------------------------------------------------------------------------------
  const [advancedFilter, setAdvancedFilter] = useState(null);


  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

  // Search bar
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

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter.map((filter, index) => {
        let showname = columnDataTable.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
    }
    return searchQuery;
  };

  useEffect(() => {
    fetchChecklisttype();
  }, [page, pageSize, searchQuery])



  const fetchChecklisttype = async () => {
    setPageName(!pageName)
    // setLoading(true);
    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const allFilters = [
      ...additionalFilters,
      { column: selectedColumn, condition: selectedCondition, value: filterValue }
    ];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {

      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }

    let isEmployee = (!isUserRoleAccess.role.includes("Manager") &&
      !isUserRoleAccess.role.includes("HiringManager") &&
      !isUserRoleAccess.role.includes("HR"))

    let employeeName = isUserRoleAccess.companyname

    queryParams.isEmployee = isEmployee;
    queryParams.employeeName = employeeName;
    queryParams.accessbranch = accessbranch;
    queryParams.fromwhere = 'approve';


    try {
      const [res_status] = await Promise.all([
        axios.post(SERVICE.NOTICEPERIODAPPLIESBYPAGINATION, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        }),
      ]);

      const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        id: item?._id,
        serialNumber: (page - 1) * pageSize + index + 1,
        noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"),
        meetingcompleted: item?.meetingcompleted ? 'Yes' : 'No',
        approved: item.approvenoticereq,
      }));


      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setEmployees(itemsWithSerialNumber);
      setLoading(false);


    } catch (err) {
      console.log(err)
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }

  }


  const handleResetSearch = async () => {
    setPageName(!pageName)


    // Reset all filters and pagination state
    setAdvancedFilter(null);
    setAdditionalFilters([]);
    setSearchQuery("");
    setIsSearchActive(false);
    setSelectedColumn("");
    setSelectedCondition("Contains");
    setFilterValue("");
    setLogicOperator("AND");
    // setFilteredChanges(null);

    const queryParams = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const allFilters = [];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQuery) {
      queryParams.searchQuery = searchQuery;  // Use searchQuery for regular search
    }

    let isEmployee = (!isUserRoleAccess.role.includes("Manager") &&
      !isUserRoleAccess.role.includes("HiringManager") &&
      !isUserRoleAccess.role.includes("HR"))

    let employeeName = isUserRoleAccess.companyname

    queryParams.isEmployee = isEmployee;
    queryParams.employeeName = employeeName;
    queryParams.accessbranch = accessbranch;
    queryParams.fromwhere = 'approve';



    try {
      const [res_status] = await Promise.all([
        axios.post(SERVICE.NOTICEPERIODAPPLIESBYPAGINATION, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        }),
      ]);

      const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        id: item?._id,
        serialNumber: (page - 1) * pageSize + index + 1,
        noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"),
        meetingcompleted: item?.meetingcompleted ? 'Yes' : 'No'
      }));


      setTotalDatas(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res_status?.data?.totalPages : 0);
      setPageSize((data) => { return ans?.length > 0 ? data : 10 });
      setPage((data) => { return ans?.length > 0 ? data : 1 });
      setEmployees(itemsWithSerialNumber);
      setLoading(false);

    } catch (err) {
      // setChecklisttypecheck(true);
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }

  }

  // new table items----------------------------------------------------------------------------------------

  const [advancedFilterApproved, setAdvancedFilterApproved] = useState(null);


  const [logicOperatorApproved, setLogicOperatorApproved] = useState("AND");

  const [selectedColumnApproved, setSelectedColumnApproved] = useState("");
  const [selectedConditionApproved, setSelectedConditionApproved] = useState("Contains");
  const [filterValueApproved, setFilterValueApproved] = useState("");
  const [additionalFiltersApproved, setAdditionalFiltersApproved] = useState([]);
  const [isSearchActiveApproved, setIsSearchActiveApproved] = useState(false);
  const conditionsApproved = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions

  // Search bar
  const [anchorElSearchApproved, setAnchorElSearchApproved] = React.useState(null);
  const handleClickSearchApproved = (event) => {
    setAnchorElSearchApproved(event.currentTarget);
    localStorage.removeItem("filterModel");
  };
  const handleCloseSearchApproved = () => {
    setAnchorElSearchApproved(null);
    setSearchQueryApproved("");
  };

  const openSearchApproved = Boolean(anchorElSearchApproved);
  const idSearchApproved = openSearchApproved ? 'simple-popover' : undefined;

  const handleAddFilterApproved = () => {
    if (selectedColumnApproved && filterValueApproved || ["Blank", "Not Blank"].includes(selectedConditionApproved)) {
      setAdditionalFiltersApproved([
        ...additionalFiltersApproved,
        { column: selectedColumnApproved, condition: selectedConditionApproved, value: filterValueApproved }
      ]);
      setSelectedColumnApproved("");
      setSelectedConditionApproved("Contains");
      setFilterValueApproved("");
    }
  };

  // Show filtered combination in the search bar
  const getSearchDisplayApproved = () => {
    if (advancedFilterApproved && advancedFilterApproved.length > 0) {
      return advancedFilterApproved.map((filter, index) => {
        let showname = columnDataTableApproved.find(col => col.field === filter.column)?.headerName;
        return `${showname} ${filter.condition} "${filter.value}"`;
      }).join(' ' + (advancedFilterApproved.length > 1 ? advancedFilterApproved[1].condition : '') + ' ');
    }
    return searchQueryApproved;
  };

  useEffect(() => {
    fetchChecklisttypeApproved();
  }, [pageApproved, pageSizeApproved, searchQueryApproved])



  const fetchChecklisttypeApproved = async () => {
    setPageName(!pageName)
    // setLoading(true);
    const queryParams = {
      page: Number(pageApproved),
      pageSize: Number(pageSizeApproved),
    };

    const allFilters = [
      ...additionalFiltersApproved,
      { column: selectedColumnApproved, condition: selectedConditionApproved, value: filterValueApproved }
    ];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumnApproved !== "") {

      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQueryApproved) {
      queryParams.searchQuery = searchQueryApproved;  // Use searchQuery for regular search
    }

    let isEmployee = (!isUserRoleAccess.role.includes("Manager") &&
      !isUserRoleAccess.role.includes("HiringManager") &&
      !isUserRoleAccess.role.includes("HR"))

    let employeeName = isUserRoleAccess.companyname

    queryParams.isEmployee = isEmployee;
    queryParams.employeeName = employeeName;
    queryParams.accessbranch = accessbranch;
    queryParams.fromwhere = 'approved';


    try {
      const [res_status] = await Promise.all([
        axios.post(SERVICE.NOTICEPERIODAPPLIESBYPAGINATION, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        }),
      ]);

      const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        id: item?._id,
        serialNumber: (pageApproved - 1) * pageSizeApproved + index + 1,
        noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"),
        meetingcompleted: item?.meetingcompleted ? 'Yes' : 'No'
      }));


      setTotalDatasApproved(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
      setTotalPagesApproved(ans?.length > 0 ? res_status?.data?.totalPages : 0);
      setPageApprovedSize((data) => { return ans?.length > 0 ? data : 10 });
      setPageApproved((data) => { return ans?.length > 0 ? data : 1 });
      setemployeeApproved(itemsWithSerialNumber);
      setLoading(false);


    } catch (err) {
      console.log(err)
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }

  }


  const handleResetSearchApproved = async () => {
    setPageName(!pageName)


    // Reset all filters and pagination state
    setAdvancedFilterApproved(null);
    setAdditionalFiltersApproved([]);
    setSearchQueryApproved("");
    setIsSearchActiveApproved(false);
    setSelectedColumnApproved("");
    setSelectedConditionApproved("Contains");
    setFilterValueApproved("");
    setLogicOperatorApproved("AND");
    // setFilteredChangesApproved(null);

    const queryParams = {
      page: Number(pageApproved),
      pageSize: Number(pageSizeApproved),
    };

    const allFilters = [];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumnApproved !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (searchQueryApproved) {
      queryParams.searchQuery = searchQueryApproved;  // Use searchQuery for regular search
    }

    let isEmployee = (!isUserRoleAccess.role.includes("Manager") &&
      !isUserRoleAccess.role.includes("HiringManager") &&
      !isUserRoleAccess.role.includes("HR"))

    let employeeName = isUserRoleAccess.companyname

    queryParams.isEmployee = isEmployee;
    queryParams.employeeName = employeeName;
    queryParams.accessbranch = accessbranch;
    queryParams.fromwhere = 'approved';



    try {
      const [res_status] = await Promise.all([
        axios.post(SERVICE.NOTICEPERIODAPPLIESBYPAGINATION, queryParams, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        }),
      ]);

      const ans = res_status?.data?.result?.length > 0 ? res_status?.data?.result : []

      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        id: item?._id,
        serialNumber: (pageApproved - 1) * pageSizeApproved + index + 1,
        noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"),
        meetingcompleted: item?.meetingcompleted ? 'Yes' : 'No'
      }));


      setTotalDatasApproved(ans?.length > 0 ? res_status?.data?.totalProjects : 0);
      setTotalPagesApproved(ans?.length > 0 ? res_status?.data?.totalPages : 0);
      setPageApprovedSize((data) => { return ans?.length > 0 ? data : 10 });
      setPageApproved((data) => { return ans?.length > 0 ? data : 1 });
      setemployeeApproved(itemsWithSerialNumber);
      setLoading(false);

    } catch (err) {
      // setChecklisttypecheck(true);
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }

  }

  //get all employees list details
  const fetchNoticeperiodlist = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer =
        !isUserRoleAccess.role.includes("Manager") &&
          !isUserRoleAccess.role.includes("HiringManager") &&
          !isUserRoleAccess.role.includes("HR")
          ? res?.data?.noticeperiodapply.filter(
            (data) => data.empname === isUserRoleAccess.companyname
          )
          : res?.data?.noticeperiodapply;
      let ans = answer.filter(
        (data) =>
          data.approvedStatus != "true" &&
          data.recheckStatus != "true" &&
          data.rejectStatus != "true"
      );

      setOverallItems(ans.map((item) => ({
        ...item, noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: item.approvenoticereq
      })));

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [employeesfilterArray, setEmployeesfilterArray] = useState([]);

  const fetchNoticeperiodlistArray = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) =>
          data.approvedStatus != "true" &&
          data.recheckStatus != "true" &&
          data.rejectStatus != "true"
      );

      setEmployeesfilterArray(ans);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useState(() => {
    fetchNoticeperiodlistArray();
  }, [isFilterOpen]);

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Name", field: "empname" },
    { title: "Empcode", field: "empcode" },
    { title: "Team", field: "team" },
    { title: "Department", field: "department" },
    { title: "Date", field: "noticedate" },
    { title: "Reason", field: "reasonleavingname" },
    { title: "Status", field: "status" },
    { title: "Request Date", field: "requestdate" },
    { title: "Request Reason", field: "requestdatereason" },
    { title: "Release Date", field: "approvenoticereq" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          approvenoticereq: moment(row.releasedate).format("DD-MM-YYYY"),
          noticedate: moment(row.noticedate).format("DD-MM-YYYY"),
          approved: moment(row.approvenoticereq).format("DD-MM-YYYY"),
          requestdate:
            row.requestdate === ""
              ? ""
              : moment(row.requestdate).format("DD-MM-YYYY"),
        }))
        : employeesfilterArray.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          noticedate: moment(row.noticedate).format("DD-MM-YYYY"),
          approvenoticereq: moment(row.releasedate).format("DD-MM-YYYY"),
          requestdate:
            row.requestdate === ""
              ? ""
              : moment(row.requestdate).format("DD-MM-YYYY"),
        }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Noticeperiodrequestlist.pdf");
  };

  // Excel
  const fileName = "Noticeperiodrequestlistt";
  let excelno = 1;

  // get particular columns for export excel
  const getexcelDatas = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) =>
          data.approvedStatus != "true" &&
          data.recheckStatus != "true" &&
          data.rejectStatus != "true"
      );
      var data =
        ans.length > 0 &&
        ans.map((t) => ({
          Sno: excelno++,
          Company: t.company,
          Branch: t.branch,
          unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          date: t.noticedate,
          Reason: t.reasonleavingname,
          Status: t.status,
          "Request Date": t.requestdate,
          "Request Reason": t.requestdatereason,
          Releasedate: t.approvenoticereq,
        }));
      setexceldata(data);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Notice Period Request List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchNoticeperiodlist();
  }, []);

  useEffect(() => {
    getexcelDatas();
  }, [employees]);

  //table entries ..,.
  const [items, setItems] = useState([]);
  const [rejectReasons, setRejectReasons] = useState([]);
  const addSerialNumber = (datas) => {

    setItems(datas);
    setRejectReasons(datas);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
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

  const [filteredDatalist, setfilteredDatalist] = useState([]);
  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // const totalPages = Math.ceil(employees.length / pageSize);

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

  const [manualDate, setManualDate] = useState("");

  const [rowIndex, setRowIndex] = useState();
  const [status, setStatus] = useState({});
  const [btnSubmit, setBtnSubmit] = useState(false);
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        approvethrough: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };
  const attStatusOption = [
    { label: "Aproved Date", value: "Aproved Date" },
    { label: "Request Date", value: "Request Date" },
    { label: "Manual Date", value: "Manual Date" },
  ];

  const [noticePeriodEdit, setNoticeperiodEdit] = useState({
    empcode: "",
    empname: "",
    name: "",
    reasonleavingname: "Please Select Reason",
    other: "",
  });

  const [openview, setOpenview] = useState(false);

  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  const getviewCodeNew = async (e) => {
    setPageName(!pageName);
    setLoading(true);
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNoticeperiodEdit(res?.data?.snoticeperiodapply);
      handleClickOpenview();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Table start colum and row
  // Define columns for the DataGrid
  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Approve Through",
      flex: 0,
      width: 450,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
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
                  style={{ minWidth: 150 }}
                  value={
                    status[params.row.id]?.approvethrough
                      ? status[params.row.id]?.approvethrough
                      : params.row.approvethrough
                  }
                  onChange={(e) => {
                    handleAction(
                      e.target.value,
                      params.row.id,
                      params.row.serialNumber
                    );
                    setManualDate("");
                  }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="Approve Date">Approve Date</MenuItem>
                  {params.row.requestdatestatus && (
                    <MenuItem value="Request Date">Request Date</MenuItem>
                  )}
                  <MenuItem value="Manual Date">Manual Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <br />
            <br />
            {status[params.row.id]?.btnShow &&
              rowIndex === params.row.serialNumber ? (
              <>
                {status[params.row.id]?.approvethrough === "Approve Date" && params.row.meetingscheduled ? (
                  <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={params.row.approved}
                          inputProps={{
                            min: params.row.approved,
                            max: params.row.approved,
                          }}
                        />
                      </FormControl>
                    </Grid>{" "}
                    <br /> <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          getCode(params.row.id, "approve");
                        }}
                      >
                        Approve
                      </Button>
                    </Grid>
                  </Grid>
                ) : status[params.row.id]?.approvethrough === "Request Date" && params.row.meetingscheduled ? (
                  <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          type="date"
                          value={params.row.requestdate}
                        />
                      </FormControl>
                    </Grid>{" "}
                    <br /> <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          getCode(params.row.id, "requestdate");
                        }}
                      >
                        Approve
                      </Button>
                    </Grid>
                  </Grid>
                ) : status[params.row.id]?.approvethrough === "Manual Date" && params.row.meetingscheduled ? (
                  <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="from-date"
                          type="date"
                          value={manualDate}
                          onChange={(e) => {
                            fecthWithOutDates(params.row, e.target.value);

                          }}
                        />
                      </FormControl>
                    </Grid>{" "}
                    <br /> <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          getCode(params.row.id, "manualdate");
                        }}
                      >
                        Approve
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        </Grid>
      ),
    },
    // {
    //   field: "reject",
    //   headerName: "Reject",
    //   flex: 0,
    //   width: 300,
    //   sortable: false,
    //   hide: !columnVisibility.reject,
    //   renderCell: (params) => (
    //     <Grid sx={{ display: "flex" }}>
    //       <Grid item md={3} xs={12} sm={12}>
    //         <FormControl size="small" fullWidth>
    //           {/* <OutlinedInput
    //             id="component-outlined"
    //             type="text"
    //             placeholder="Reason"
    //             value={params.row.rejectnoticereq}
    //             onChange={(e) => {
    //               RejectstatusFunction(params.row.id, e);
    //             }}
    //           /> */}
    //           <Selects
    //             options={leavingfetch}
    //             styles={colourStyles}
    //             value={{
    //               label: params.row.rejectnoticereq,
    //               value: params.row.rejectnoticereq,
    //             }}
    //           // onChange
    //           />
    //         </FormControl>
    //       </Grid>
    //       <Grid item md={0.5} sm={1} xs={1}>
    //         <Button
    //           variant="contained"
    //           style={{
    //             height: "30px",
    //             minWidth: "20px",
    //             padding: "19px 13px",
    //             color: "white",
    //             marginTop: "20px",
    //             background: "rgb(25, 118, 210)",
    //           }}
    //           onClick={() => {
    //             // handleClickOpenviewResonlev();
    //           }}
    //         >
    //           <FaPlus style={{ fontSize: "15px" }} />
    //         </Button>
    //       </Grid>
    //       {" "}
    //       <br /> <br />
    //       <Grid item md={3} xs={12} sm={12}>
    //         <Button
    //           variant="contained"
    //           color="error"
    //           onClick={() => {
    //             getCodeReject(
    //               params.row.id,
    //               params.row.rejectnoticereq,
    //               "reject"
    //             );
    //           }}
    //         >
    //           Reject
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   ),
    // },
    {
      field: "reject",
      headerName: "Reject",
      flex: 0,
      width: 350,
      sortable: false,
      hide: !columnVisibility.reject,
      renderCell: (params) => {
        const selectedRow = rejectReasons.find(item => item.id === params.row.id);
        return (
          <Grid container spacing={1} alignItems="center">
            {/* Select dropdown */}
            <Grid item xs={12} sm={6} md={6}>
              <FormControl size="small" fullWidth>
                <Selects
                  options={leavingfetch}
                  styles={{
                    ...colourStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                  value={
                    selectedRow?.rejectnoticereq
                      ? {
                        label: selectedRow.rejectnoticereq,
                        value: selectedRow.rejectnoticereq,
                      }
                      : null
                  }
                  onChange={(e) => {
                    handleUpdateRejectReason(params?.row?.id, e, 'reject')
                  }}
                />
              </FormControl>
            </Grid>

            {/* Plus icon button */}
            <Grid item xs={2} sm={2} md={2}>
              <Button
                variant="contained"
                sx={{
                  height: "36px",
                  minWidth: "36px",
                  backgroundColor: "rgb(25, 118, 210)",
                  color: "white",
                  padding: 0,
                }}
                onClick={() => {
                  handleClickOpenviewResonlev();
                }}
              >
                <FaPlus style={{ fontSize: "15px" }} />
              </Button>
            </Grid>

            {/* Reject button */}
            <Grid item xs={12} sm={4} md={4}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => {
                  getCodeReject(
                    params.row.id,
                    params.row.rejectnoticereq,
                    "reject"
                  );
                }}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        )
      }
    },
    {
      field: "recheck",
      headerName: "Recheck",
      flex: 0,
      width: 350,
      sortable: false,
      hide: !columnVisibility.recheck,
      renderCell: (params) => {
        const selectedRow = rejectReasons.find(item => item.id === params.row.id);
        return (
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sm={6} md={6}>
              <FormControl size="small" fullWidth>
                <Selects
                  options={leavingfetch}
                  styles={{
                    ...colourStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                  value={
                    selectedRow?.rechecknoticereq
                      ? {
                        label: selectedRow.rechecknoticereq,
                        value: selectedRow.rechecknoticereq,
                      }
                      : null
                  }
                  onChange={(e) => {
                    handleUpdateRejectReason(params?.row?.id, e, 'recheck')
                  }}
                />
              </FormControl>
            </Grid>

            {/* Plus icon button */}
            <Grid item xs={2} sm={2} md={2}>
              <Button
                variant="contained"
                sx={{
                  height: "36px",
                  minWidth: "36px",
                  backgroundColor: "rgb(25, 118, 210)",
                  color: "white",
                  padding: 0,
                }}
                onClick={() => {
                  handleClickOpenviewResonlev();
                }}
              >
                <FaPlus style={{ fontSize: "15px" }} />
              </Button>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  getCodeRecheck(params.row.id, params.row.rechecknoticereq);
                  // handleSubmit();
                }}
              >
                Recheck
              </Button>
            </Grid>
          </Grid>
        )
      }
    },
    {
      field: "scheduleinterview",
      headerName: "Schedule Interview",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.scheduleinterview,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <>
              {params.row.meetingscheduled != true ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleClickOpenMeetingPopup(
                      params.row.company,
                      params.row.branch,
                      params.row.team,
                      params.row.department,
                      params.row.empname,
                      params.row.id
                    );
                  }}
                >
                  Schedule Interview
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    getviewCode(params.row.id);
                  }}
                >
                  View Interview
                </Button>
              )}
            </>
          </Grid>{" "}
          :
        </Grid>
      ),
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.empname,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 100,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },

    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "noticedate",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.noticedate,
      headerClassName: "bold-header",
    },
    {
      field: "reasonleavingname",
      headerName: "Reason",
      flex: 0,
      width: 250,
      hide: !columnVisibility.reasonleavingname,
      headerClassName: "bold-header",
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 100,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
    },


    {
      field: "meetingcompleted",
      headerName: "Is Meeting Completed",
      flex: 0,
      width: 100,
      hide: !columnVisibility.meetingcompleted,
      headerClassName: "bold-header",
    },

    {
      field: "meetingremarks",
      headerName: "Remarks",
      flex: 0,
      width: 100,
      hide: !columnVisibility.meetingremarks,
      headerClassName: "bold-header",
    },

    {
      field: "files",
      headerName: "Document",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => {
        if (!params.row.hrupload) {
          return (
            <Grid sx={{ display: "flex", gap: '10px' }}>
              <Button
                onClick={() => {
                  fileData(params.row.id);
                }}
                variant="contained"
                sx={{ backgroundColor: 'orange' }}
              >
                View
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'purple' }}
                onClick={() => {
                  fileDataDownload(params.row.id);
                }}
              >
                Download
              </Button>
            </Grid>
          );
        }
        return null;
      }
    },
    {
      field: "actionsnew",
      headerName: "View",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.actionsnew,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>

          {isUserRoleCompare?.includes("vnoticeperiodapprove") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeNew(params.row.id);

              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}

        </Grid>
      ),
    },
  ];

  const rowDataTable = items.map((notice, index) => {
    return {
      ...notice
    };
  });

  const ApprovedDateFunc = async (id, olddate, newdate, status) => {
    let ans = filteredData?.filter((data, index) => {
      if (id === data._id) {
        if (status === "approve") {
          let projectscreate = axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              approvenoticereq:
                (new Date(newdate) - new Date(olddate)) / (1000 * 3600 * 24) < 0
                  ? olddate
                  : newdate,
            }
          );
        } else {
          let projectscreate = axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              requestdate:
                (new Date(newdate) - new Date(olddate)) / (1000 * 3600 * 24) < 0
                  ? olddate
                  : newdate,
            }
          );
        }
      }
    });
    await fetchNoticeperiodlist();
  };

  const RejectstatusFunction = async (id, e) => {
    const value = e.target.value;
    let ans = filteredData?.filter((data, index) => {
      if (id === data._id) {
        let projectscreate = axios.put(
          `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            rejectnoticereq: value,
          }
        );
      }
    });
    // setRejectNoticeMessage(value)
  };
  const cancelcontinuestatusFunction = async (id, e, func) => {
    const value = e.target.value;
    if (func === "cancel") {
      let ans = filteredDataApproved?.filter((data, index) => {
        if (id === data._id) {
          let projectscreate = axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              cancelreason: value,
            }
          );
        }
      });
    } else if (func === "continue") {
      let ans = filteredDataApproved?.filter((data, index) => {
        if (id === data._id) {
          let projectscreate = axios.put(
            `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              continuereason: value,
            }
          );
        }
      });
    }
  };

  const ReCheckStatement = async (id, e) => {
    const value = e.target.value;
    let ans = filteredData?.filter((data, index) => {
      if (id === data._id) {
        let projectscreate = axios.put(
          `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            rechecknoticereq: value,
          }
        );
      }
    });
  };

  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box
      sx={{
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
          {filteredColumns?.map((column) => (
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
                secondary={column.headerName}
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
              onClick={() => setColumnVisibility({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeight = () => {
    if (pageSize === "All") {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(pageSize, filteredDatas.length);
      const rowHeight = 65; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${visibleRows > 0
        ? visibleRows * rowHeight + extraSpace
        : scrollbarWidth + extraSpace
        }px`;
    }
  };

  const renderFilePreviewApproved = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const initialColumnVisibilityApproved = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empname: true,
    empcode: true,
    department: true,
    date: true,
    reason: true,
    document: true,
    status: true,
    approvedthrough: true,
    reasonleavingname: true,
    releasedate: true,
    files: true,
    cancel: true,
    continue: true,
    scheduleinterview: true,
    meetingremarks: true,
    meetingcompleted: true,
    actionsnew: true
  };

  // Show all columns
  const [columnVisibilityApproved, setColumnVisibilityApproved] = useState(
    initialColumnVisibilityApproved
  );

  const getRowClassNameAll = (params) => {
    const itemTat = params.row.status || "";
    return "custom-others-row";
    // }
  };

  // Styles for the resizable column
  const ResizableColumnApproved = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  const StyledDataGridApproved = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },
  }));

  //get all employeeApproved list details
  const fetchNoticeperiodlistApproved = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer =
        !isUserRoleAccess.role.includes("Manager") &&
          !isUserRoleAccess.role.includes("HiringManager") &&
          !isUserRoleAccess.role.includes("HR")
          ? res?.data?.noticeperiodapply.filter(
            (data) => data.empname === isUserRoleAccess.companyname
          )
          : res?.data?.noticeperiodapply;
      let ans = answer.filter(
        (data) =>
          data.approvedStatus === "true" &&
          data.cancelstatus === false &&
          data.continuestatus === false
      );

      setOverallItemsNew(ans.map((item) => ({
        ...item, noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"), releasedate: moment(item.approvenoticereq).format("DD-MM-YYYY")
      })));
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [employeeApprovedFilterArray, setemployeeApprovedFilterArray] =
    useState([]);

  const fetchNoticeperiodlistApprovedArray = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) =>
          data.approvedStatus === "true" &&
          data.cancelstatus === false &&
          data.continuestatus === false
      );

      setemployeeApprovedFilterArray(ans);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchNoticeperiodlistApprovedArray();
  }, [isFilterOpen2]);

  //get single row to edit....
  const fileDataApproved = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      renderFilePreviewApproved(res?.data?.snoticeperiodapply.files[0]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get single row to edit....
  const fileDataApprovedDownload = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFileApproved(res?.data?.snoticeperiodapply.files[0]);
      res?.data?.snoticeperiodapply.files.forEach((file) => {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${file.base64}`;
        link.download = file.name;
        link.click();
      });
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Error Popup model
  const [isErrorOpenApproved, setIsErrorOpenApproved] = useState(false);
  const [setShowAlertApproved] = useState();
  const handleClickOpenerrApproved = () => {
    setIsErrorOpenApproved(true);
  };
  const handleCloseerrApproved = () => {
    setIsErrorOpenApproved(false);
  };

  //  PDF
  const columnsApproved = [
    // { title: "Sno", field: "Sno" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Name", field: "empname" },
    { title: "Empcode", field: "empcode" },
    { title: "Team", field: "team" },
    { title: "Department", field: "department" },
    { title: "Reason", field: "reasonleavingname" },
    { title: "Status", field: "status" },
    { title: "Release Date", field: "releasedate" },
  ];

  const downloadPdf2 = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columnsApproved.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTableApproved.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          approvenoticereq: moment(row.releasedate).format("DD-MM-YYYY"),
        }))
        : employeeApprovedFilterArray.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          status: "Approved",
          releasedate: moment(row.approvenoticereq).format("DD-MM-YYYY"),
        }));

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto",
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("NoticePeriodListApproved.pdf");
  };

  // Excel
  const fileNameApproved = "NoticePeriodListApproved";
  let excelnoapproved = 1;

  // get particular columnsApproved for export excel
  const getexcelDatasApproved = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.post(SERVICE.NOTICEPERIODAPPLYBYASSIGNBRANCH, {
        assignbranch: accessbranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res?.data?.noticeperiodapply.filter(
        (data) => data.approvedStatus === "true"
      );
      var data =
        ans.length > 0 &&
        ans.map((t) => ({
          Sno: excelnoapproved++,
          Company: t.company,
          Branch: t.branch,
          unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          date: t.noticedate,
          Reason: t.reasonleavingname,
          approvedthrough: t.approvedthrough,
          Status: "Approved",
          Releasedate: t.approvenoticereq,
        }));
      setexceldataApproved(data);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //print...
  const componentRefApproved = useRef();
  const handleprintApproved = useReactToPrint({
    content: () => componentRefApproved.current,
    documentTitle: "Notice Period Approved List",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchNoticeperiodlistApproved();
  }, []);

  useEffect(() => {
    getexcelDatasApproved();
  }, [employeeApproved]);

  //table entries ..,.
  const [itemsApproved, setItemsApproved] = useState([]);
  const [rejectReasonsApproved, setRejectReasonsApproved] = useState([]);
  const addSerialNumberApproved = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      id: item._id,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      empname: item.empname,
      empcode: item.empcode,
      team: item.team,
      department: item.department,
      noticedate: item.noticedate,
      reasonleavingname: item.reasonleavingname,
      files: item.files,
      // status: notice.status,
      status: "Approved",
      approvedthrough: item.approvedthrough,
      releasedate: item.releasedate,
      cancelreason: item.cancelreason,
      continuereason: item.continuereason,
      meetingscheduled: item?.meetingscheduled,
      meetingcompleted: item?.meetingcompleted ? "Yes" : 'No',
    }));
    setItemsApproved(datas);
    setRejectReasonsApproved(datas);
  };

  useEffect(() => {
    addSerialNumberApproved(employeeApproved);
  }, [employeeApproved]);

  //table sorting
  const [sortingApproved, setSortingApproved] = useState({
    column: "",
    direction: "",
  });

  const handleSortingApproved = (column) => {
    const direction =
      sortingApproved.column === column && sortingApproved.direction === "asc"
        ? "desc"
        : "asc";
    setSortingApproved({ column, direction });
  };

  itemsApproved.sort((a, b) => {
    if (sortingApproved.direction === "asc") {
      return a[sortingApproved.column] > b[sortingApproved.column] ? 1 : -1;
    } else if (sortingApproved.direction === "desc") {
      return a[sortingApproved.column] < b[sortingApproved.column] ? 1 : -1;
    }
    return 0;
  });

  //Datatable
  const handlePageChangeApproved = (newPage) => {
    setPageApproved(newPage);
  };

  const handlePageSizeChangeApproved = (event) => {
    setPageApprovedSize(Number(event.target.value));
    setPageApproved(1);
  };

  //datatable....

  const handleSearchChangeApproved = (event) => {
    setSearchQueryApproved(event.target.value);
  };

  // Split the search query into individual terms
  const searchTermsApproved = searchQueryApproved.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatasApproved = itemsApproved?.filter((item) => {
    return searchTermsApproved.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataApproved = filteredDatasApproved.slice(
    (pageApproved - 1) * pageSizeApproved,
    pageApproved * pageSizeApproved
  );

  // const totalPagesApproved = Math.ceil(
  //   employeeApproved.length / pageSizeApproved
  // );

  const visiblePagesApproved = Math.min(totalPagesApproved, 3);

  const firstVisiblePageApproved = Math.max(1, pageApproved - 1);
  const lastVisiblePageApproved = Math.min(
    firstVisiblePageApproved + visiblePagesApproved - 1,
    totalPagesApproved
  );

  const pageNumbersApproved = [];

  for (let i = firstVisiblePageApproved; i <= lastVisiblePageApproved; i++) {
    pageNumbersApproved.push(i);
  }

  const [selectAllCheckedApproved, setSelectAllCheckedApproved] =
    useState(false);

  const CheckboxHeaderApproved = ({
    selectAllCheckedApproved,
    onSelectAll,
  }) => (
    <div>
      <Checkbox checked={selectAllCheckedApproved} onChange={onSelectAll} />
    </div>
  );

  // Table start colum and row
  // Define columnsApproved for the DataGrid
  const columnDataTableApproved = [

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibilityApproved.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "cancel",
      headerName: "Cancel",
      flex: 0,
      width: 350,
      sortable: false,
      hide: !columnVisibility.cancel,
      renderCell: (params) => {
        const selectedRow = rejectReasonsApproved.find(item => item.id === params.row.id);
        return (
          <Grid container spacing={1} alignItems="center">

            <Grid item xs={12} sm={6} md={6}>
              <FormControl size="small" fullWidth>
                <Selects
                  options={leavingfetch}
                  styles={{
                    ...colourStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                  value={
                    selectedRow?.cancelreason
                      ? {
                        label: selectedRow.cancelreason,
                        value: selectedRow.cancelreason,
                      }
                      : null
                  }
                  onChange={(e) => {
                    handleUpdateRejectReasonApproved(params?.row?.id, e, 'cancel')
                  }}
                />
              </FormControl>
            </Grid>

            {/* Plus icon button */}
            <Grid item xs={2} sm={2} md={2}>
              <Button
                variant="contained"
                sx={{
                  height: "36px",
                  minWidth: "36px",
                  backgroundColor: "rgb(25, 118, 210)",
                  color: "white",
                  padding: 0,
                }}
                onClick={() => {
                  handleClickOpenviewResonlev();
                }}
              >
                <FaPlus style={{ fontSize: "15px" }} />
              </Button>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  getCodeReject(params.row.id, params.row.cancelreason, "cancel");
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        )
      }
    },
    {
      field: "continue",
      headerName: "Continue",
      flex: 0,
      width: 350,
      sortable: false,
      hide: !columnVisibility.continue,
      renderCell: (params) => {
        const selectedRow = rejectReasonsApproved.find(item => item.id === params.row.id);
        return (
          <Grid container spacing={1} alignItems="center">
            {/* <Grid item md={3} xs={12} sm={12}>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Reason"
                  value={params.row.continuereason}
                  onChange={(e) => {
                    cancelcontinuestatusFunction(params.row.id, e, "continue");
                  }}
                />
              </FormControl>
            </Grid>{" "} */}
            <Grid item xs={12} sm={6} md={6}>
              <FormControl size="small" fullWidth>
                <Selects
                  options={leavingfetch}
                  styles={{
                    ...colourStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPortalTarget={document.body}
                  value={
                    selectedRow?.continuereason
                      ? {
                        label: selectedRow.continuereason,
                        value: selectedRow.continuereason,
                      }
                      : null
                  }
                  onChange={(e) => {
                    handleUpdateRejectReasonApproved(params?.row?.id, e, 'continue')
                  }}
                />
              </FormControl>
            </Grid>

            {/* Plus icon button */}
            <Grid item xs={2} sm={2} md={2}>
              <Button
                variant="contained"
                sx={{
                  height: "36px",
                  minWidth: "36px",
                  backgroundColor: "rgb(25, 118, 210)",
                  color: "white",
                  padding: 0,
                }}
                onClick={() => {
                  handleClickOpenviewResonlev();
                }}
              >
                <FaPlus style={{ fontSize: "15px" }} />
              </Button>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  getCodeReject(
                    params.row.id,
                    params.row.continuereason,
                    "continue"
                  );
                }}
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        )
      }
    },
    {
      field: "scheduleinterview",
      headerName: "Schedule Interview",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibility.scheduleinterview,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <Grid item md={3} xs={12} sm={12}>
            <>
              {params.row.meetingscheduled != true ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleClickOpenMeetingPopup(
                      params.row.company,
                      params.row.branch,
                      params.row.team,
                      params.row.department,
                      params.row.empname,
                      params.row.id
                    );
                  }}
                >
                  Schedule Interview
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    getviewCode(params.row.id);
                  }}
                >
                  View Interview
                </Button>
              )}
            </>
          </Grid>{" "}
          :
        </Grid>
      ),
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibilityApproved.empname,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Comapny",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.unit,
      headerClassName: "bold-header",
    },

    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.department,
      headerClassName: "bold-header",
    },
    {
      field: "noticedate",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.noticedate,
      headerClassName: "bold-header",
    },
    {
      field: "reasonleavingname",
      headerName: "Reason",
      flex: 0,
      width: 250,
      hide: !columnVisibilityApproved.reasonleavingname,
      headerClassName: "bold-header",
    },
    {
      field: "meetingcompleted",
      headerName: "Is Meeting Completed",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.meetingcompleted,
      headerClassName: "bold-header",
    },

    {
      field: "meetingremarks",
      headerName: "Remarks",
      flex: 0,
      width: 100,
      hide: !columnVisibilityApproved.meetingremarks,
      headerClassName: "bold-header",
    },
    {
      field: "files",
      headerName: "Document",
      flex: 0,
      width: 250,
      sortable: false,
      hide: !columnVisibilityApproved.actions,
      headerClassName: "bold-header",
      renderCell: (params) => {
        if (!params.row.hrupload) {
          return (
            <Grid sx={{ display: "flex", gap: '10px' }}>
              <Button
                onClick={() => {
                  fileDataApproved(params.row.id);
                }}
                variant="contained"
                sx={{ backgroundColor: 'orange' }}
              >
                View
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: 'purple' }}
                onClick={() => {
                  fileDataApprovedDownload(params.row.id);
                }}
              >
                Download
              </Button>
            </Grid>
          )
        }
        return null;
      }
    },
    {
      field: "approvedthrough",
      headerName: "Approved Through",
      flex: 0,
      width: 150,
      hide: !columnVisibilityApproved.approvedthrough,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            background:
              params.row.status === "Approved"
                ? "green"
                : params.row.status === "Reject"
                  ? "red"
                  : params.row.status === "Recheck"
                    ? "blue"
                    : params.row.status === "Applied"
                      ? "yellow"
                      : params.row.status,
            color: params.row.status === "Applied" ? "black" : "white",
            // color: params.value === "Approved" ? "black" : params.value === "Rejected" ? "white" : "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
          }}
        >
          {params.row.status}
        </Button>
      ),
      hide: !columnVisibilityApproved.status,
    },
    {
      field: "releasedate",
      headerName: "Release Date",
      flex: 0,
      width: 150,
      hide: !columnVisibilityApproved.releasedate,
      headerClassName: "bold-header",
    },
    {
      field: "actionsnew",
      headerName: "Action",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibilityApproved.actionsnew,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>

          {isUserRoleCompare?.includes("lnoticeperiodapprove") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCodeNew(params.row.id);

              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}

        </Grid>
      ),
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTableApproved = itemsApproved.map((notice, index) => {
    return {
      ...notice
    };
  });
  console.log(rowDataTableApproved, "rowDataTableApproved")
  console.log(rowDataTable, "rowDataTable")
  const handleShowAllcolumnsApproved = () => {
    const updatedVisibility = { ...columnVisibilityApproved };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityApproved(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityApproved");
    if (savedVisibility) {
      setColumnVisibilityApproved(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem(
      "columnVisibilityApproved",
      JSON.stringify(columnVisibilityApproved)
    );
  }, [columnVisibilityApproved]);
  // Manage Columns functionality
  const toggleColumnVisibilityApproved = (field) => {
    setColumnVisibilityApproved((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // Function to filter columns based on search query
  const filteredColumnsApproved = columnDataTableApproved.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageApproved.toLowerCase())
  );
  // JSX for the "Manage Columns" popover content
  const manageColumnsContentApproved = (
    <Box
      sx={{
        padding: "10px",
        minWidth: "325px",
        "& .MuiDialogContent-root": { padding: "10px 0" },
      }}
    >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumnsApproved}
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
          value={searchQueryManageApproved}
          onChange={(e) => setSearchQueryManageApproved(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsApproved?.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibilityApproved[column.field]}
                    onChange={() =>
                      toggleColumnVisibilityApproved(column.field)
                    }
                  />
                }
                secondary={column.headerName}
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
              onClick={() =>
                setColumnVisibilityApproved(initialColumnVisibilityApproved)
              }
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibilityApproved({})}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  // Calculate the DataGrid height based on the number of rows
  const calculateDataGridHeightApproved = () => {
    if (pageSizeApproved === "All") {
      return "auto"; // Auto height for 'All' entries
    } else {
      // Calculate the height based on the number of rows displayed
      const visibleRows = Math.min(
        pageSizeApproved,
        filteredDatasApproved.length
      );
      const rowHeight = 52; // Assuming row height is 52px (adjust as needed)
      const extraSpace = 70; // Add some extra space to prevent the last row from being hidden
      const scrollbarWidth = 52; // Width of the scrollbar (adjust as needed)
      return `${visibleRows > 0
        ? visibleRows * rowHeight + extraSpace
        : scrollbarWidth + extraSpace
        }px`;
    }
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
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: moment(t.noticedate).format("DD-MM-YYYY"),
          Reason: t.reasonleavingname,
          Status: t.status,
          Requestdate:
            t.requestdate === ""
              ? ""
              : moment(t.requestdate).format("DD-MM-YYYY"),
          Requestdatereason: t.requestdatereason,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employeesfilterArray.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: moment(t.noticedate).format("DD-MM-YYYY"),
          Reason: t.reasonleavingname,
          Status: t.status,
          Requestdate:
            t.requestdate === ""
              ? ""
              : moment(t.requestdate).format("DD-MM-YYYY"),
          Requestdatereason: t.requestdatestatus ? t.requestdatereason : "",
          Releasedate: t.releasedate,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const handleExportXL2 = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTableApproved?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Reason: t.reasonleavingname,
          Status: t.status,
          Releasedate: t.releasedate,
        })),
        fileNameApproved
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        employeeApprovedFilterArray.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Date: moment(t.noticedate).format("DD-MM-YYYY"),
          Reason: t.reasonleavingname,
          Status: "Approved",
          Releasedate: moment(t.approvenoticereq).format("DD-MM-YYYY"),
        })),
        fileNameApproved
      );
    }

    setIsFilterOpen2(false);
  };

  return (
    <Box>
      {/* ****** Header Content ****** */}
      <Headtitle title={"NOTICE PERIOD REQUEST LIST"} />
      <PageHeading
        title="Notice Period Request list"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Notice Period"
        subsubpagename="Notice Period Approve"
      />

      <br />
      {isUserRoleCompare?.includes("lnoticeperiodapprove") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>
                  Notice Period Request list
                </Typography>
              </Grid>
            </Grid>
            {!isBoarding ? (
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
                <br />

                {/* added to the pagination grid */}
                <Grid style={{ ...userStyle.dataTablestyle, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                  <Box>
                    <label htmlFor="pageSizeSelect">Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      sx={{ width: "77px" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                      {/* <MenuItem value={employees.length}>All</MenuItem> */}
                    </Select>
                  </Box>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <Grid>
                      {isUserRoleCompare?.includes(
                        "csvnoticeperiodapprove"
                      ) && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpen(true);
                                fetchNoticeperiodlistArray();
                                setFormat("xl");
                              }}
                              sx={userStyle.buttongrp}
                            >
                              <FaFileExcel />
                              &ensp;Export to Excel&ensp;
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "excelnoticeperiodapprove"
                      ) && (
                          <>
                            <Button
                              onClick={(e) => {
                                setIsFilterOpen(true);
                                fetchNoticeperiodlistArray();
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
                        "printnoticeperiodapprove"
                      ) && (
                          <>
                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                              &ensp;
                              <FaPrint />
                              &ensp;Print&ensp;
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "pdfnoticeperiodapprove"
                      ) && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={() => {
                                setIsPdfFilterOpen(true);
                                fetchNoticeperiodlistArray();
                              }}
                            >
                              <FaFilePdf />
                              &ensp;Export to PDF&ensp;
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "imagenoticeperiodapprove"
                      ) && (
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={handleCaptureImage}
                          >
                            {" "}
                            <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                            &ensp;Image&ensp;{" "}
                          </Button>
                        )}
                    </Grid>
                  </Grid>
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
                <br />
                {/* ****** Table Grid Container ****** */}
                <Grid container>
                  <Grid md={4} sm={2} xs={1}></Grid>
                  <Grid md={8} sm={10} xs={10} sx={{ align: "center" }}></Grid>
                </Grid>
                <br />
                {/* ****** Table start ****** */}
                <Button
                  sx={userStyle.buttongrp}
                  onClick={() => {
                    handleShowAllColumns();
                    setColumnVisibility(initialColumnVisibility);
                  }}
                >
                  Show All Columns
                </Button>
                &ensp;
                <Button
                  sx={userStyle.buttongrp}
                  onClick={handleOpenManageColumns}
                >
                  Manage Columns
                </Button>
                <br />
                <br />
                {/* {isLoader ? ( */}
                <>
                  <Box style={{ width: "100%", overflowY: "hidden" }}>
                    <StyledDataGrid
                      rows={rowDataTable}
                      columns={columnDataTable.filter(
                        (column) => columnVisibility[column.field]
                      )}
                      autoHeight={true}
                      density="standard"
                      ref={gridRef}
                      hideFooter
                      // getRowClassName={getRowClassNameAll}
                      disableRowSelectionOnClick
                      unstable_cellSelection
                      onClipboardCopy={(copiedString) =>
                        setCopiedData(copiedString)
                      }
                      unstable_ignoreValueFormatterDuringExport
                    />
                  </Box>
                  <Box style={userStyle.dataTablestyle}>
                    {/* Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries */}
                    Showing {rowDataTable.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalDatas)} of {totalDatas} entries
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
                  </Box>{" "}
                  <br /> <br />
                </>
              </>
            )}
          </Box>
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
          <Box sx={userStyle.container}>
            <Box>
              {/* ****** Header Content ****** */}
              {/* <Typography sx={userStyle.HeaderText}>Notice Period List</Typography> */}
              <br />
              {isUserRoleCompare?.includes("lnoticeperiodapprove") && (
                <>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography sx={userStyle.SubHeaderText}>
                          Notice Period Approved List
                        </Typography>
                      </Grid>
                    </Grid>
                    {!isBoardingApproved ? (
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
                        <br />
                        {/* added to the pagination grid */}
                        <Grid style={{ ...userStyle.dataTablestyle, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                          <Box>
                            <label htmlFor="pageSizeSelect">
                              Show entries:
                            </label>
                            <Select
                              id="pageSizeSelect"
                              value={pageSizeApproved}
                              onChange={handlePageSizeChangeApproved}
                              sx={{ width: "77px" }}
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                              <MenuItem value={100}>100</MenuItem>
                              {/* <MenuItem value={employeeApproved.length}>
                                All
                              </MenuItem> */}
                            </Select>
                          </Box>
                          <Grid container sx={{ justifyContent: "center" }}>
                            <Grid>
                              {isUserRoleCompare?.includes(
                                "csvnoticeperiodapprove"
                              ) && (
                                  <>
                                    <Button
                                      onClick={(e) => {
                                        setIsFilterOpen2(true);
                                        fetchNoticeperiodlistApprovedArray();
                                        setFormat("xl");
                                      }}
                                      sx={userStyle.buttongrp}
                                    >
                                      <FaFileExcel />
                                      &ensp;Export to Excel&ensp;
                                    </Button>
                                  </>
                                )}
                              {isUserRoleCompare?.includes(
                                "excelnoticeperiodapprove"
                              ) && (
                                  <>
                                    <Button
                                      onClick={(e) => {
                                        setIsFilterOpen2(true);
                                        fetchNoticeperiodlistApprovedArray();

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
                                "printnoticeperiodapprove"
                              ) && (
                                  <>
                                    <Button
                                      sx={userStyle.buttongrp}
                                      onClick={handleprintApproved}
                                    >
                                      &ensp;
                                      <FaPrint />
                                      &ensp;Print&ensp;
                                    </Button>
                                  </>
                                )}
                              {isUserRoleCompare?.includes(
                                "pdfnoticeperiodapprove"
                              ) && (
                                  <>
                                    <Button
                                      sx={userStyle.buttongrp}
                                      onClick={() => {
                                        setIsPdfFilterOpen2(true);
                                        fetchNoticeperiodlistApprovedArray();
                                      }}
                                    >
                                      <FaFilePdf />
                                      &ensp;Export to PDF&ensp;
                                    </Button>
                                  </>
                                )}
                              {isUserRoleCompare?.includes(
                                "imagenoticeperiodapprove"
                              ) && (
                                  <Button
                                    sx={userStyle.buttongrp}
                                    onClick={handleCaptureImageApproved}
                                  >
                                    {" "}
                                    <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                    &ensp;Image&ensp;{" "}
                                  </Button>
                                )}
                            </Grid>
                          </Grid>
                          <Box>
                            <FormControl fullWidth size="small">
                              <Typography>Search</Typography>
                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQueryApproved}
                                onChange={handleSearchChangeApproved}
                              />
                            </FormControl>
                          </Box>
                        </Grid>
                        <br />
                        {/* ****** Table Grid Container ****** */}
                        <Grid container>
                          <Grid md={4} sm={2} xs={1}></Grid>
                          <Grid
                            md={8}
                            sm={10}
                            xs={10}
                            sx={{ align: "center" }}
                          ></Grid>
                        </Grid>
                        <br />
                        {/* ****** Table start ****** */}
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => {
                            handleShowAllcolumnsApproved();
                            setColumnVisibilityApproved(
                              initialColumnVisibilityApproved
                            );
                          }}
                        >
                          Show All Columns
                        </Button>
                        &ensp;
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleOpenManageColumnsApproved}
                        >
                          Manage Columns
                        </Button>
                        <br />
                        <br />
                        {/* {isLoader ? ( */}
                        <>
                          <Box
                            style={{
                              height: calculateDataGridHeightApproved(),
                              width: "100%",
                              overflowY: "hidden", // Hide the y-axis scrollbar
                            }}
                          >
                            <Box style={{ width: "100%", overflowY: "hidden" }}>
                              <StyledDataGrid
                                rows={rowDataTableApproved}
                                columns={columnDataTableApproved.filter(
                                  (column) =>
                                    columnVisibilityApproved[column.field]
                                )}
                                autoHeight={true}
                                density="standard"
                                hideFooter
                                ref={gridRef1}
                                disableRowSelectionOnClick
                                unstable_cellSelection
                                onClipboardCopy={(copiedString) =>
                                  setCopiedDataApproved(copiedString)
                                }
                                unstable_ignoreValueFormatterDuringExport
                              />
                            </Box>
                          </Box>

                          <Box style={userStyle.dataTablestyle}>
                            <Box>
                              {/* Showing{" "}
                              {filteredDataApproved.length > 0
                                ? (pageApproved - 1) * pageSizeApproved + 1
                                : 0}{" "}
                              to{" "}
                              {Math.min(
                                pageApproved * pageSizeApproved,
                                filteredDatasApproved.length
                              )}{" "}
                              of {filteredDatasApproved.length} entries */}
                              Showing {rowDataTableApproved.length > 0 ? (pageApproved - 1) * pageSizeApproved + 1 : 0} to {Math.min(pageApproved * pageSizeApproved, totalDatasApproved)} of {totalDatasApproved} entries
                            </Box>
                            <Box>
                              <Button
                                onClick={() => setPageApproved(1)}
                                disabled={pageApproved === 1}
                                sx={userStyle.paginationbtn}
                              >
                                <FirstPageIcon />
                              </Button>
                              <Button
                                onClick={() =>
                                  handlePageChangeApproved(pageApproved - 1)
                                }
                                disabled={pageApproved === 1}
                                sx={userStyle.paginationbtn}
                              >
                                <NavigateBeforeIcon />
                              </Button>
                              {pageNumbersApproved?.map((pageNumber) => (
                                <Button
                                  key={pageNumber}
                                  sx={userStyle.paginationbtn}
                                  onClick={() =>
                                    handlePageChangeApproved(pageNumber)
                                  }
                                  className={
                                    pageApproved === pageNumber ? "active" : ""
                                  }
                                  disabled={pageApproved === pageNumber}
                                >
                                  {pageNumber}
                                </Button>
                              ))}
                              {lastVisiblePageApproved < totalPagesApproved && (
                                <span>...</span>
                              )}
                              <Button
                                onClick={() =>
                                  handlePageChangeApproved(pageApproved + 1)
                                }
                                disabled={pageApproved === totalPagesApproved}
                                sx={userStyle.paginationbtn}
                              >
                                <NavigateNextIcon />
                              </Button>
                              <Button
                                onClick={() =>
                                  setPageApproved(totalPagesApproved)
                                }
                                disabled={pageApproved === totalPagesApproved}
                                sx={userStyle.paginationbtn}
                              >
                                <LastPageIcon />
                              </Button>
                            </Box>
                          </Box>
                          {/* Manage Column */}
                          <Popover
                            id={idApproved}
                            open={isManageColumnsOpenApproved}
                            anchorEl={anchorElApproved}
                            onClose={handleCloseManageColumnsApproved}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            {manageColumnsContentApproved}
                          </Popover>
                        </>
                      </>
                    )}
                  </Box>
                </>
              )}
              <br />
              {/* ****** Table End ****** */}
            </Box>
          </Box>
        </>
      )}
      <br />

      {/* schedule meeting popup*/}
      <Dialog
        open={openMeetingPopup}
        onClose={handleClickCloseMeetingPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: '50px' }}
      >
        {/* <VendorPopup setVendorAuto={setVendorAuto} handleCloseviewalertvendor={handleCloseviewalertvendor} /> */}
        <ScheduleMeetingNoticePeriod
          setVendorAuto={setVendorAuto}
          handleClickCloseMeetingPopup={handleClickCloseMeetingPopup}
          meetingValues={meetingValues}

        />
      </Dialog>

      {/* schdedule meeting view model */}
      <Dialog
        open={openMeetingViewPopup}
        onClose={handleClickCloseMeetingViewPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: '50px' }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Schedule Interview
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>
                    {meetingData.company
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>
                    {meetingData.branch
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>
                    {meetingData.team
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Department</Typography>
                  <Typography>
                    {meetingData.department
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Category</Typography>
                  <Typography>{meetingData.meetingcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Interviewer</Typography>
                  <Typography>
                    {meetingData.interviewer
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Type</Typography>
                  <Typography>{meetingData.meetingtype}</Typography>
                </FormControl>
              </Grid>
              {meetingData.meetingtype === "Online" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Meeting Mode</Typography>
                      <Typography>{meetingData.meetingmode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Link</Typography>
                      <Link
                        to={meetingData.link}
                        variant="body3"
                        underline="none"
                        target="_blank"
                      >
                        {meetingData.link}
                      </Link>
                    </FormControl>
                  </Grid>
                </>
              )}
              {meetingData.meetingtype === "Offline" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Branch</Typography>
                      <Typography>
                        {meetingData.branchvenue
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Floor</Typography>
                      <Typography>
                        {meetingData.floorvenue
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Area</Typography>
                      <Typography>{meetingData.venue}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Title</Typography>
                  <Typography>{meetingData.title}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(meetingData.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time</Typography>
                  <Typography>{meetingData.time}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Duration</Typography>
                  <Typography>{meetingData.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time Zone</Typography>
                  <Typography>{meetingData.timezone}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Meeting Participant</Typography>
                  <Typography>
                    {meetingData.participants
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Type</Typography>
                  <Typography>{meetingData.meetingtype}</Typography>
                </FormControl>
              </Grid>
              {meetingData.reminder && (
                <>
                  {" "}
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Repeat Type</Typography>
                      <Typography>{meetingData.repeattype}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickCloseMeetingViewPopup}
                sx={buttonStyles.btncancel}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Alert Dialog */}
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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={overallItems ?? []}
        filename={"Notice Period Request List"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />


      <ExportData
        isFilterOpen={isFilterOpen2}
        handleCloseFilterMod={handleCloseFilterMod2}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen2}
        isPdfFilterOpen={isPdfFilterOpen2}
        setIsPdfFilterOpen={setIsPdfFilterOpen2}
        handleClosePdfFilterMod={handleClosePdfFilterMod2}
        filteredDataTwo={rowDataTableApproved ?? []}
        itemsTwo={overallItemsNew ?? []}
        filename={"Notice Period Approved List"}
        exportColumnNames={exportColumnNamesApproved}
        exportRowValues={exportRowValuesApproved}
        componentRef={componentRefApproved}
      />

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
      <Dialog
        open={openviewReasonlev}
        onClose={handleClickOpenviewResonlev}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              Reason For Leaving- Quick Add
            </Typography>
            <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl size="small" fullWidth>
                  <Typography>Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    size="small"
                    value={leaving.name}
                    onChange={(e) => {
                      setLeaving({ ...leaving, name: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <br />
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitReason}
                  loading={reasonBtn}
                  sx={buttonStyles.buttonsubmit}
                >
                  Save
                </LoadingButton>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleClearreason}

                >
                  {" "}
                  Clear
                </Button>
              </Grid>
              <Grid item md={0.2} xs={12} sm={12}></Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseviewReasonlev}
                >
                  {" "}
                  Close
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      <Loader loading={loading} message={loadingMessage} />
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: '50px' }}
      >
        <Box sx={{ width: "750px", padding: "20px 70px", }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Notice Period Apply
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Employee Name</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.empname}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Employee Code</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.empcode}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Apply Date</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.noticedate === "undefined" ? "" : moment(noticePeriodEdit.noticedate).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Reason of Leaving</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.reasonleavingname}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Request Details</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.other}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Is Meeting Completed</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.meetingcompleted ? 'Yes' : 'No'}
                  </Typography>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    <b>Remarks</b>
                  </Typography>
                  <Typography variant="h6">
                    {noticePeriodEdit.meetingremarks}
                  </Typography>
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
    </Box>
  );
}

export default Noticestatuslist;