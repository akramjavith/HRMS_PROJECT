import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  TextField,
  List,
  ListItem,
  ListItemText,
  Popover,
  IconButton,
  TableBody,
  Checkbox,
  TextareaAutosize,
  FormControlLabel,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import { userStyle, colourStyles } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { FaPrint, FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import jsPDF from "jspdf";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { DataGrid } from "@mui/x-data-grid";
import Resizable from "react-resizable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StyledDataGrid from "../../../components/TableStyle";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { styled } from "@mui/system";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Selects from "react-select";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import { makeStyles } from "@material-ui/core";
import fileIcon from "../../../components/Assets/file-icons.png";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";

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

function NoticeperiodApplyHierarchy() {
  const [loader, setLoader] = useState(false);
  const [noticeHierarchy, setNoticeHierarchy] = useState([]);
  const gridRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess, listPageAccessMode } =
    useContext(UserRoleAccessContext);
  let listpageaccessby =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Human Resources" &&
        data.submodulename === "HR" &&
        data.mainpagename === "Employee" &&
        data.subpagename === "Notice Period" &&
        data.subsubpagename === "Notice Period List Hierarchy"
    )?.listpageaccessmode || "Overall";
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [leaving, setLeaving] = useState({ name: "" });
  const [leavingfetch, setleavingfetch] = useState([]);
  const [empuser, setEmpuser] = useState([]);
  const [empid, setempid] = useState([]);
  const [getAllUsers, setgetAllUser] = useState([]);
  const [selectedempcode, setSelectedempcode] = useState("");
  const [selectedempDesignation, setSelectedempDesignation] = useState("");
  const [selectedempDesignationEdit, setSelectedempDesignationEdit] =
    useState("");
  const [selectedempname, setSelectedempname] = useState(
    "Please Select Employeename"
  );
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [empCode, setEmpCode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  let today = new Date();

  const [employeesList, setEmployeesList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [file, setFile] = useState("");
  const [leavingfetchEdit, setleavingfetchEdit] = useState([]);
  const [selectedempcodeEdit, setSelectedempcodeEdit] = useState("");
  const [selectedempnameEdit, setSelectedempnameEdit] = useState(
    "Please Select Empolyeename"
  );
  const [filteredCategoriesEdit, setFilteredCategoriesEdit] = useState([]);
  const [filteredSubCategoriesEdit, setFilteredSubCategoriesEdit] = useState(
    []
  );
  const [empCodeEdit, setEmpCodeEdit] = useState(false);
  const [deleteproject, setDeleteproject] = useState({});
  const [empUserEdit, setEmpuserEdit] = useState([]);
  const [getAllUserEdit, setGetAllUserEdit] = useState([]);
  const [empidEdit, setEmpidEdit] = useState([]);
  const [leavingEdit, setLeavingEdit] = useState({ name: "" });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  let todayEdit = new Date();
  var ddEdit = String(todayEdit.getDate()).padStart(2, "0");
  var mmEdit = String(todayEdit.getMonth() + 1).padStart(2, "0");
  var yyyyEdit = todayEdit.getFullYear();
  let formattedDateEdit = yyyyEdit + "-" + mmEdit + "-" + ddEdit;
  const [noticePeriodEdit, setNoticeperiodEdit] = useState({
    empcode: "",
    empname: "",
    noticedate: formattedDateEdit,
    name: "",
    reasonleavingname: "Please Select Reason",
    other: "",
  });

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Notice Period Hierarchy.png");
        });
      });
    }
  };

  const [exceldata, setexceldata] = useState([]);
  const [selectedFilesedit, setSelectedFilesedit] = useState([]);
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [empnameList, setEmpNameList] = useState("");
  const [onEmpEdit, setEmpOnEdit] = useState();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  // clipboard
  const [copiedData, setCopiedData] = useState("");

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

  const [noticePeriod, setNoticeperiod] = useState({
    empcode: "",
    empname: "",
    noticedate: formattedDate,
    name: "",
    reasonleavingname: "Please Select Reason",
    other: "",
  });

  const username = isUserRoleAccess.username;

  const [onemp, setempon] = useState();
  const [onempself, setemponself] = useState();

  const handleUserNameChange = async (e) => {
    let res_employee = await axios.get(SERVICE.ALLUSER, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const ans = res_employee?.data?.allusers.filter((empname) => {
      return empname.companyname === e.companyname;
    });
    setEmployees(res_employee?.data?.allusers);
    setempon(ans);

    const selectedempcode = e.value;
    setSelectedempname(selectedempcode);
    setSelectedempcode(e.empcode);
    setSelectedempDesignation(e.designation);
    setEmpCode(true);
  };

  const handleUserNameChangeemp = async () => {
    let res_employee = await axios.get(SERVICE.ALLUSER, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const ans = res_employee?.data?.allusers.filter((empname) => {
      return empname.companyname === isUserRoleAccess.companyname;
    });
    setemponself(ans);

    setEmpCode(true);
  };
  useEffect(() => {
    handleUserNameChangeemp();
  }, []);

  // Error Popup model

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //send Request popup
  const [isSendReqOpen, setIsSendReqOpen] = useState(false);
  const handleClickOpensendReq = () => {
    setIsSendReqOpen(true);
  };
  const handleClosesendReq = () => {
    setIsSendReqOpen(false);
  };

  //Request date popup
  const [isReqDateOpen, setIsReqDateOpen] = useState(false);
  const [requestDate, setRequestDate] = useState("");
  const [requestDateReason, setRequestDateReason] = useState("");
  const [requestDateStatus, setRequestDateStatus] = useState(false);
  const handleClickOpensendReqDate = () => {
    setIsReqDateOpen(true);
    setRequestDateStatus(true);
  };
  const handleClosesendReqDate = () => {
    setIsReqDateOpen(false);
  };
  //send Request Edit popup
  const [isSendReqOpenEdit, setIsSendReqOpenEdit] = useState(false);
  const handleClickOpensendReqEdit = () => {
    setIsSendReqOpenEdit(true);
  };
  const handleClosesendReqEdit = () => {
    setIsSendReqOpenEdit(false);
  };

  //Request date Edit popup
  const [isReqDateOpenEdit, setIsReqDateOpenEdit] = useState(false);
  const [requestDateEdit, setRequestDateEdit] = useState("");
  const [requestDateReasonEdit, setRequestDateReasonEdit] = useState("");
  const [requestDateStatusEdit, setRequestDateStatusEdit] = useState(false);
  const handleClickOpensendReqDateEdit = () => {
    setIsReqDateOpenEdit(true);
    setRequestDateStatusEdit(true);
  };
  const handleClosesendReqDateEdit = () => {
    setIsReqDateOpenEdit(false);
  };

  const [openviewReasonlev, setOpenviewReasonlev] = useState(false);
  // view model
  const handleClickOpenviewResonlev = () => {
    setOpenviewReasonlev(true);
  };

  const handleCloseviewReasonlev = () => {
    setOpenviewReasonlev(false);
    setLeaving({ name: "" });
  };

  //cancel for reason section
  const handleClearreason = () => {
    setLeaving({ name: "" });
  };

  //cancel for create section
  const handleClear = () => {
    setSelectedFiles([]);
    setSelectedempname("Please Select Employeename");
    setSelectedempcode("");
    setNoticeperiod({
      empcode: "",
      empname: "",
      noticedate: formattedDate,
      name: "",
      reasonleavingname: "Please Select Reason",
      other: "",
    });
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

  const classes = useStyles();

  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...selectedFiles];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an documents
      if (file.type.startsWith("image/")) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Documents!"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setSelectedFiles(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
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

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  // Array of reason datas
  const reasonOption = [
    {
      label: "Better Employment Conditions",
      value: "Better Employment Conditions",
    },
    { label: "Death", value: "Death" },
    { label: "Dessertion", value: "Dessertion" },
    { label: "Dismissed", value: "Dismissed" },
    { label: "Dissatisfaction", value: "Dissatisfaction" },
    { label: "Dissatisfaction with Job", value: "Dissatisfaction with Job" },
    { label: "Emigrating", value: "Emigrating" },
    { label: "Health", value: "Health" },
    { label: "Higher Pay", value: "Higher Pay" },
    { label: "Personality Confilcts", value: "Personality Confilcts" },
    { label: "Retirements", value: "Retirements" },
    { label: "Retrenchment", value: "Retrenchment" },
    { label: "Carrer prospect", value: "Carrer prospect" },
    { label: "Higher Education", value: "Higher Education" },
  ];

  // dropdwon fetching status for the reason of leaving
  const fetchreasonleaving = async () => {
    try {
      let res_project = await axios.get(SERVICE.NOTICEREASON, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...reasonOption,
        ...res_project?.data?.noticereasons.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setleavingfetch(projall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all employees list details
  const fetchNoticeperiodlist = async () => {
    try {
      let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEmployee(res?.data?.noticeperiodapply);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [noticePeriodArray, setNoticePeriodArray] = useState([]);

  const fetchNoticeperiodlistArray = async () => {
    try {
      let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setNoticePeriodArray(res?.data?.noticeperiodapply);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchNoticeperiodlistArray();
  }, [isFilterOpen]);

  // dropdwon fetching status for the reason of leaving
  const fecthemployeename = async (e) => {
    try {
      let res_project = await axios.get(SERVICE.ALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.allusers.map((d) => ({
          ...d,
          label: d.companyname,
          value: d.companyname,
        })),
      ];
      setEmpuser(projall);
      setFilteredSubCategories(projall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // dropdwon fetching status for the reason of leaving
  const fecthemployid = async () => {
    try {
      //  if(e === "ALL"){
      let res_project = await axios.get(SERVICE.ALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.allusers.map((d) => ({
          ...d,
          label: d.empcode,
          value: d.empcode,
        })),
      ];
      setgetAllUser(res_project?.data?.users);
      setempid(projall);
      setFilteredCategories(projall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    // Filter categories based on the selected project and vendors
    const filteredCategories = empid
      .filter((subpro) => subpro.username === selectedempname)
      .map((subpro) => ({
        ...subpro,
        label: subpro.empcode,
        value: subpro.empcode,
      }));
    setFilteredCategories(filteredCategories);
  }, [selectedempcode]);

  //add function
  const sendRequestReason = async () => {
    try {
      let projectscreate = await axios.post(SERVICE.NOTICEREASON_CREATE, {
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchDesignations = async () => {
    try {
      let res = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDesignationDate(res?.data?.designation);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function...
  const sendRequest = async () => {
    try {
      if (requestDateStatus && requestDate === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Choose Request Date"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (requestDateStatus && requestDateReason === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Enter Request Reason"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_CREATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          // empcode: String(selectedempcode),
          // empname: String(selectedempname),
          empname: String(
            Access === "Manager"
              ? selectedempname
              : isUserRoleAccess.companyname
          ),
          empcode: String(
            Access === "Manager" ? selectedempcode : isUserRoleAccess.empcode
          ),
          reasonleavingname:
            noticePeriod.reasonleavingname === "Please Select Reason"
              ? ""
              : noticePeriod.reasonleavingname,
          noticedate: String(noticePeriod.noticedate),
          other: String(noticePeriod.other),
          // access: Accessdrop,
          files: [...selectedFiles],
          branch:
            isUserRoleAccess.role.includes("Manager") && Access === "Manager"
              ? onemp && onemp.length > 0
                ? String(onemp[0].branch)
                : ""
              : onempself && onempself.length > 0
                ? String(onempself[0].branch)
                : "",
          company:
            isUserRoleAccess.role.includes("Manager") && Access === "Manager"
              ? onemp && onemp.length > 0
                ? String(onemp[0].company)
                : ""
              : onempself && onempself.length > 0
                ? String(onempself[0].company)
                : "",
          unit:
            isUserRoleAccess.role.includes("Manager") && Access === "Manager"
              ? onemp && onemp.length > 0
                ? String(onemp[0].unit)
                : ""
              : onempself && onempself.length > 0
                ? String(onempself[0].unit)
                : "",
          team:
            isUserRoleAccess.role.includes("Manager") && Access === "Manager"
              ? onemp && onemp.length > 0
                ? String(onemp[0].team)
                : ""
              : onempself && onempself.length > 0
                ? String(onempself[0].team)
                : "",
          department:
            isUserRoleAccess.role.includes("Manager") && Access === "Manager"
              ? onemp && onemp.length > 0
                ? String(onemp[0].department)
                : ""
              : onempself && onempself.length > 0
                ? String(onempself[0].department)
                : "",
          approvenoticereq: noticePeriodDate,
          requestdate: requestDateStatus ? requestDate : "",
          requestdatereason: requestDateStatus ? requestDateReason : "",
          requestdatestatus: requestDateStatus,
          status: "Applied",
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        setNoticeperiod(res);
        setSelectedFiles([]);
        setSelectedempname("Please Select Employeename");
        setSelectedempcode("");
        await fetchNoticeperiodlistEdit();

        setNoticeperiod({
          empcode: "",
          empname: "",
          noticedate: formattedDate,
          name: "",
          reasonleavingname: "Please Select Reason",
          other: "",
        });
        setShowAlert(
          <>
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "#7ac767" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Added Successfully 👍"}
            </p>
          </>
        );
        handleClickOpenerr();
        handleClosesendReq();
        handleClosesendReqDate();
        setRequestDateStatus(false);
        setRequestDate("");
        setRequestDateReason("");
        setNoticePeriodDate("");
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [isNoticeperiod, setIsNoticeperiod] = useState("");
  const [isApplied, setIsApplied] = useState([]);

  const [overallSate, setOverAllLoan] = useState([]);

  const fetchAllGroup = async () => {
    try {
      let res_grp = await axios.get(SERVICE.LOAN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setOverAllLoan(res_grp?.data?.loan);

      const data = res_grp?.data?.loan?.filter(
        (item) => item.status === "Approved" || item.status === "Applied"
      );

      setIsApplied(data);

      const checknoticeperiodEli = data.filter((item) => {
        return (
          item.companyname?.toLowerCase() ==
          isUserRoleAccess?.companyname?.toLowerCase() &&
          item.empcode?.toLowerCase() ==
          isUserRoleAccess?.empcode?.toLowerCase()
        );
      });

      const checkElegable =
        checknoticeperiodEli[checknoticeperiodEli.length - 1]?.emitodo
          ?.length === 0
          ? checknoticeperiodEli[checknoticeperiodEli.length - 1]?.emitodo
            ?.length
          : checknoticeperiodEli[checknoticeperiodEli.length - 1]?.emitodo[
          checknoticeperiodEli[checknoticeperiodEli.length - 1]?.emitodo
            ?.length - 1
          ];

      // const checkElegable = checknoticeperiodEli[0]?.emitodo?.length === 0 ? checknoticeperiodEli[0]?.emitodo?.length :
      // checknoticeperiodEli[0]?.emitodo[checknoticeperiodEli[0]?.emitodo?.length - 1]

      const month = checkElegable?.months;
      const year = checkElegable?.year;

      if (month == undefined || year === undefined) {
        setIsNoticeperiod(0);
      } else {
        const months = [
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

        const monthIndex = months.findIndex(
          (m) => m?.toLowerCase() === month?.toLowerCase()
        );

        const currentDate = new Date(year, monthIndex, 1);

        currentDate?.setMonth(currentDate?.getMonth() + 6);

        const newMonth = months[currentDate?.getMonth()];
        const newYear = currentDate?.getFullYear();

        const monthIndexs = months?.findIndex(
          (m) => m?.toLowerCase() === newMonth?.toLowerCase()
        );

        var currentDates = new Date();

        var currentMonth = currentDates?.getMonth() + 1;
        var currentYear = currentDates?.getFullYear();

        var yearDifference = newYear - currentYear;
        var monthDifference = monthIndexs + 1 - currentMonth;

        var totalMonthDifference = yearDifference * 12 + monthDifference;

        setIsNoticeperiod(totalMonthDifference);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [isBtn, setIsBtn] = useState(false);

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();

    const isLoanExistUser = overallSate.filter(
      (item) =>
        item.companyname?.toLowerCase() ===
        isUserRoleAccess.companyname?.toLowerCase() &&
        item.empcode?.toLowerCase() === isUserRoleAccess.empcode?.toLowerCase()
    );

    const isAPplied = isLoanExistUser.some((item) => item.status === "Applied");

    if (isNoticeperiod > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`Eligible To Apply Notice Period After ${isNoticeperiod} Months`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isAPplied) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`You Have Applied Loan, Not Eligible To Apply Notice Period`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      isUserRoleAccess.role.includes("Manager") &&
      Access === "Manager" &&
      (selectedempname === "" ||
        selectedempname === "Please Select Employeename")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employeename"}
          </p>
        </>
      );
      handleClickOpenerr();
      // setIsBtn(false)
    } else if (selectedFiles.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Upload Files "}
          </p>
        </>
      );
      handleClickOpenerr();
      // setIsBtn(false)
    } else {
      var formatDate;
      const filteredDesignationDates = designationDate
        ?.filter((item) => item.name === selectedempDesignation)
        .map(({ noticeperiodfrom, noticeperiodto }) => ({
          noticeperiodfrom,
          noticeperiodto,
        }));
      if (filteredDesignationDates && filteredDesignationDates.length > 0) {
        if (filteredDesignationDates[0].noticeperiodfrom === "Month") {
          let monthsToAdd = Number(filteredDesignationDates[0].noticeperiodto);
          let date = new Date(noticePeriod.noticedate);
          date.setMonth(date.getMonth() + monthsToAdd);
          let dd = String(date.getDate()).padStart(2, "0");
          let mm = String(date.getMonth() + 1).padStart(2, "0");
          let yyyy = date.getFullYear();
          formatDate = yyyy + "-" + mm + "-" + dd;
        } else if (filteredDesignationDates[0].noticeperiodfrom === "Day") {
          let datesToAdd = Number(filteredDesignationDates[0].noticeperiodto);
          let dated = new Date(noticePeriod.noticedate);
          dated.setDate(dated.getDate() + datesToAdd);
          let ddd = String(dated.getDate()).padStart(2, "0");
          let mmd = String(dated.getMonth() + 1).padStart(2, "0");
          let yyyyd = dated.getFullYear();
          formatDate = yyyyd + "-" + mmd + "-" + ddd;
        }
      }
      setNoticePeriodDate(formatDate);
      // sendRequest();
      if (isNoticeperiod <= 0) {
        handleClickOpensendReq();
        // setIsBtn(false)
      }
      // setIsBtn(false)
    }
  };

  //submit option for saving
  const handleSubmitReason = (e) => {
    e.preventDefault();
    if (leaving.name === "" || leaving.name === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Reason "}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestReason();
    }
  };

  useEffect(() => {
    fetchreasonleaving();
    fecthemployeename();
    fecthemployid();
    fetchNoticeperiodlist();
    fetchDesignations();
  }, [isNoticeperiod]);

  useEffect(() => {
    fetchAllGroup();
  }, []);

  const handleUserNameChangeEdit = async (e) => {
    let res_employee = await axios.get(SERVICE.ALLUSER, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    let ans = res_employee?.data?.allusers?.filter((empname) => {
      return empname.companyname === e;
    });
    setEmpOnEdit(ans[0]);
    const selectedempcode = e.value;
    setSelectedempnameEdit(e);
    setSelectedempcodeEdit(ans[0]?.empcode);
    setSelectedempDesignationEdit(ans[0]?.designation);
    setEmpCodeEdit(true);
  };

  // let username = isUserRoleAccess.username
  const id = useParams().id;
  // const classes = useStyles();

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
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

  const [openviewReasonlevEdit, setOpenviewReasonlevEdit] = useState(false);
  const [designationDate, setDesignationDate] = useState([]);
  const [noticePeriodDate, setNoticePeriodDate] = useState("");
  const [noticePeriodDateEdit, setNoticePeriodDateEdit] = useState("");

  // view model
  const handleClickOpenviewResonlevEdit = () => {
    setOpenviewReasonlevEdit(true);
  };

  const handleCloseviewReasonlevEdit = () => {
    setOpenviewReasonlevEdit(false);
    setLeavingEdit({ name: "" });
  };

  const handleInputChangeEdit = (event) => {
    const files = event.target.files;
    let newSelectedFilesedit = [...selectedFilesedit];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        newSelectedFilesedit.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
          //  data: reader.result.split(',')[1]
        });
        setSelectedFilesedit(newSelectedFilesedit);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteFileEdit = (index) => {
    const newSelectedFilesedit = [...selectedFilesedit];
    newSelectedFilesedit.splice(index, 1);
    setSelectedFilesedit(newSelectedFilesedit);
  };

  const getFileIconEdit = (fileName) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
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

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  // dropdwon fetching status for the reason of leaving
  const fecthemployeenameEdit = async (e) => {
    try {
      let res_project = await axios.get(SERVICE.ALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.allusers.map((d) => ({
          ...d,
          label: d.companyname,
          value: d.companyname,
        })),
      ];
      setEmpuserEdit(projall);
      setFilteredSubCategoriesEdit(projall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // dropdwon fetching status for the reason of leaving
  const fecthemployidEdit = async () => {
    try {
      //  if(e === "ALL"){
      let res_project = await axios.get(SERVICE.ALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...res_project?.data?.allusers.map((d) => ({
          ...d,
          label: d.empcode,
          value: d.empcode,
        })),
      ];
      setGetAllUserEdit(res_project?.data?.allusers);
      setEmpidEdit(projall);
      setFilteredCategoriesEdit(projall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Array of reason datas
  const reasonOptionEdit = [
    {
      label: "Better Employment Conditions",
      value: "Better Employment Conditions",
    },
    { label: "Death", value: "Death" },
    { label: "Dessertion", value: "Dessertion" },
    { label: "Dismissed", value: "Dismissed" },
    { label: "Dissatisfaction", value: "Dissatisfaction" },
    { label: "Dissatisfaction with Job", value: "Dissatisfaction with Job" },
    { label: "Emigrating", value: "Emigrating" },
    { label: "Health", value: "Health" },
    { label: "Higher Pay", value: "Higher Pay" },
    { label: "Personality Confilcts", value: "Personality Confilcts" },
    { label: "Retirements", value: "Retirements" },
    { label: "Retrenchment", value: "Retrenchment" },
    { label: "Carrer prospect", value: "Carrer prospect" },
    { label: "Higher Education", value: "Higher Education" },
  ];

  // dropdwon fetching status for the reason of leaving
  const fetchreasonleavingEdit = async () => {
    try {
      let res_project = await axios.get(SERVICE.NOTICEREASON, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projall = [
        ...reasonOptionEdit,
        ...res_project?.data?.noticereasons.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        })),
      ];
      setleavingfetchEdit(projall);
      // setProjects(res_project.data.projects);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //add function
  const sendRequestReasonEdit = async () => {
    try {
      let projectscreate = await axios.post(SERVICE.NOTICEREASON_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        name: String(leavingEdit.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchreasonleavingEdit();
      setLeavingEdit(projectscreate.data);
      handleCloseviewReasonlevEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //cancel for reason section
  const handleClearreasonEdit = () => {
    setLeavingEdit({ name: "" });
  };

  //submit option for saving
  const handleSubmitReasonEdit = (e) => {
    e.preventDefault();
    if (leavingEdit.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Project Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestReasonEdit();
    }
  };

  // Alert delete popup
  let projectid = deleteproject._id;
  const delProject = async () => {
    try {
      await axios.delete(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${projectid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleCloseMod();
      await fetchNoticeperiodlistEdit();
      setPage(1);
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7ac767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully 👍"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    actions: true,
    serialNumber: true,
    branch: true,
    company: true,
    unit: true,
    empname: true,
    empcode: true,
    team: true,
    department: true,
    noticedate: true,
    reasonleavingname: true,
    files: true,
    status: true,
    rejectStatus: true,
    approvenoticereq: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

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

  //get all employees list details
  const fetchNoticeperiodlistEdit = async () => {
    try {
      let res = await axios.get(SERVICE.NOTICEPERIODAPPLY, {
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

      setEmployeesList(answer);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //id for login...;
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  //Boardingupadate updateby edit page...
  let updateby = noticePeriodEdit?.updatedby;
  let addedby = noticePeriodEdit?.addedby;

  //get single row to edit....
  const fileData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      renderFilePreviewEdit(res?.data?.snoticeperiodapply.files[0]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get single row to edit....
  const fileDataDownload = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFile(res?.data?.snoticeperiodapply.files);
      res?.data?.snoticeperiodapply.files.forEach((file) => {
        const link = document.createElement("a");
        link.href = `data:application/octet-stream;base64,${file.base64}`;
        link.download = file.name;
        link.click();
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //  PDF
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Name", field: "empname" },
    { title: "Empcode", field: "empcode" },
    { title: "Team", field: "team" },
    { title: "Department", field: "department" },
    { title: "Apply Date", field: "noticedate" },
    { title: "Reason", field: "reasonleavingname" },
    { title: "Status", field: "status" },
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
          reasonleavingname: row.reasonleavingname,
          approvenoticereq:
            row.approvenoticereq !== ""
              ? moment(row.approvenoticereq).format("DD-MM-YYYY")
              : "",
        }))
        : noticeHierarchy.map((row) => ({
          ...row,
          serialNumber: serialNumberCounter++,
          reasonleavingname: row.reasonleavingname,
          approvenoticereq:
            row.approvenoticereq !== ""
              ? moment(row.approvenoticereq).format("DD-MM-YYYY")
              : "",
          noticedate:
            row.noticedate === "undefined"
              ? ""
              : moment(row.noticedate).format("DD-MM-YYYY"),
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

    doc.save("Notice Period Hierarchy.pdf");
  };

  // Excel
  const fileName = "Notice Period Hierarchy";
  let excelno = 1;

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Notice Period Hierarchy",
    pageStyle: "print",
  });

  // useEffect(() => {
  //     handleUserNameChangeEdit(empnameList);
  // }, [isEditOpen])

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = noticeHierarchy?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [noticeHierarchy]);

  //table sorting
  const [sorting, setSorting] = useState({ column: "", direction: "" });

  const handleSorting = (column) => {
    const direction =
      sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
    setSorting({ column, direction });
  };

  items.sort((a, b) => {
    if (sorting.direction === "asc") {
      return a[sorting.column] > b[sorting.column] ? 1 : -1;
    } else if (sorting.direction === "desc") {
      return a[sorting.column] < b[sorting.column] ? 1 : -1;
    }
    return 0;
  });

  const renderSortingIcon = (column) => {
    if (sorting.column !== column) {
      return (
        <>
          <Box sx={{ color: "#bbb6b6" }}>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropUpOutlinedIcon />
            </Grid>
            <Grid sx={{ height: "6px", fontSize: "1.6rem" }}>
              <ArrowDropDownOutlinedIcon />
            </Grid>
          </Box>
        </>
      );
    } else if (sorting.direction === "asc") {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropUpOutlinedIcon
                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
              />
            </Grid>
            <Grid sx={{ height: "6px" }}>
              <ArrowDropDownOutlinedIcon
                style={{ color: "black", fontSize: "1.6rem" }}
              />
            </Grid>
          </Box>
        </>
      );
    }
  };

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  //datatable....
  const [searchQuery, setSearchQuery] = useState("");
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

  const totalPages = Math.ceil(noticeHierarchy.length / pageSize);

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

  // Table start colum and row
  // Define columns for the DataGrid
  // const columnDataTable = [
  //     {
  //         field: "checkbox",
  //         headerName: "Checkbox", // Default header name
  //         headerStyle: {
  //             fontWeight: "bold", // Apply the font-weight style to make the header text bold
  //             // Add any other CSS styles as needed
  //         },
  //         renderHeader: (params) => (
  //             <CheckboxHeader
  //                 selectAllChecked={selectAllChecked}
  //                 onSelectAll={() => {
  //                     if (rowDataTable.length === 0) {
  //                         // Do not allow checking when there are no rows
  //                         return;
  //                     }
  //                     if (selectAllChecked) {
  //                         setSelectedRows([]);
  //                     } else {
  //                         const allRowIds = rowDataTable.map((row) => row.id);
  //                         setSelectedRows(allRowIds);
  //                     }
  //                     setSelectAllChecked(!selectAllChecked);
  //                 }}
  //             />
  //         ),

  //         renderCell: (params) => (
  //             <Checkbox
  //                 checked={selectedRows.includes(params.row.id)}
  //                 onChange={() => {
  //                     let updatedSelectedRows;
  //                     if (selectedRows.includes(params.row.id)) {
  //                         updatedSelectedRows = selectedRows.filter(
  //                             (selectedId) => selectedId !== params.row.id
  //                         );
  //                     } else {
  //                         updatedSelectedRows = [...selectedRows, params.row.id];
  //                     }

  //                     setSelectedRows(updatedSelectedRows);

  //                     // Update the "Select All" checkbox based on whether all rows are selected
  //                     setSelectAllChecked(
  //                         updatedSelectedRows.length === filteredData.length
  //                     );
  //                 }}
  //             />
  //         ),
  //         sortable: false, // Optionally, you can make this column not sortable
  //         width: 90,

  //         hide: !columnVisibility.checkbox,
  //         headerClassName: "bold-header",
  //     },

  //     {
  //         field: "serialNumber",
  //         headerName: "SNo",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.serialNumber,
  //     },
  //     {
  //         field: "company",
  //         headerName: "Company",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.company,
  //     },
  //     {
  //         field: "branch",
  //         headerName: "Branch",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.branch,
  //     },
  //     {
  //         field: "unit",
  //         headerName: "Unit",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.unit,
  //     },
  //     {
  //         field: "empname",
  //         headerName: "Name",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.empname,
  //     },
  //     {
  //         field: "empcode",
  //         headerName: "Empcode",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.empcode,
  //     },
  //     {
  //         field: "team",
  //         headerName: "Team",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.team,
  //     },
  //     {
  //         field: "department",
  //         headerName: "Department",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.department,
  //     },
  //     {
  //         field: "noticedate",
  //         headerName: "Apply Date",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.noticedate,
  //     },
  //     {
  //         field: "reasonleavingname",
  //         headerName: "Reason",
  //         flex: 0,
  //         width: 75,
  //         hide: !columnVisibility.reasonleavingname,
  //     },

  //     {
  //         field: "rejectStatus",
  //         headerName: "Reason",
  //         flex: 0,
  //         width: 200,
  //         hide: !columnVisibility.rejectStatus,
  //     },
  //     {
  //         field: "approvenoticereq",
  //         headerName: "Release Date",
  //         flex: 0,
  //         width: 200,
  //         hide: !columnVisibility.approvenoticereq,
  //     },

  // ];

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
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 140,
      hide: !columnVisibility.branch,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 130,
      hide: !columnVisibility.unit,
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 200,
      hide: !columnVisibility.empname,
    },
    {
      field: "empcode",
      headerName: "Empcode",
      flex: 0,
      width: 130,
      hide: !columnVisibility.empcode,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 140,
      hide: !columnVisibility.department,
    },
    {
      field: "noticedate",
      headerName: "Apply Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.noticedate,
    },
    {
      field: "reasonleavingname",
      headerName: "Reason",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reasonleavingname,
    },
    {
      field: "files",
      headerName: "Document",
      flex: 0,
      width: 200,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <a
            onClick={() => {
              fileData(params.row.id);
            }}
            style={{ minWidth: "0px", color: "#357AE8", cursor: "pointer" }}
          >
            View
          </a>
          <a
            style={{
              minWidth: "0px",
              textDecoration: "none",
              color: "#357AE8",
              cursor: "pointer",
            }}
            onClick={() => {
              fileDataDownload(params.row.id);
            }}
          >
            Download
          </a>
        </Grid>
      ),
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
                  : params.row.status === "Canceled"
                    ? "red"
                    : params.row.status === "Continue"
                      ? "green"
                      : params.row.status === "Recheck"
                        ? "blue"
                        : params.row.status === "Applied"
                          ? "yellow"
                          : params.row.status,
            color: params.row.status === "Applied" ? "black" : "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
          }}
        >
          {params.row.status}
        </Button>
      ),
      hide: !columnVisibility.status,
    },
    {
      field: "rejectStatus",
      headerName: "Reason",
      flex: 0,
      width: 200,
      hide: !columnVisibility.rejectStatus,
    },
    {
      field: "approvenoticereq",
      headerName: "Release Date",
      flex: 0,
      width: 200,
      hide: !columnVisibility.approvenoticereq,
    },
  ];

  // Create a row data object for the DataGrid
  const rowDataTable = filteredData.map((notice, index) => {
    return {
      id: notice._id,
      index: index + 1,
      serialNumber: notice.serialNumber,
      company: notice.company,
      branch: notice.branch,
      unit: notice.unit,
      empname: notice.empname,
      empcode: notice.empcode,
      team: notice.team,
      department: notice.department,
      noticedate:
        notice.noticedate === "undefined"
          ? ""
          : moment(notice.noticedate).format("DD-MM-YYYY"),
      reasonleavingname: notice.reasonleavingname,
      files: notice.files,
      status:
        notice.approvedStatus === "true" &&
          notice.cancelstatus === false &&
          notice.continuestatus === false
          ? "Approved"
          : notice.approvedStatus === "true" && notice.cancelstatus === true
            ? "Canceled"
            : notice.approvedStatus === "true" && notice.continuestatus === true
              ? "Continue"
              : notice.rejectStatus === "true"
                ? "Reject"
                : notice.recheckStatus === "true"
                  ? "Recheck"
                  : notice.status,
      rejectStatus:
        notice?.rejectStatus === "true"
          ? notice?.rejectnoticereq
            ? notice?.rejectnoticereq
            : "---"
          : notice?.cancelstatus === true
            ? notice?.cancelreason == "undefined"
              ? "---"
              : notice?.cancelreason
            : notice?.continuestatus === true
              ? notice?.continuereason == "undefined"
                ? "---"
                : notice?.continuereason
              : "---",
      approvenoticereq: moment(notice.approvenoticereq).format("DD-MM-YYYY"),
      // releasedate:
    };
  });

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

  const fetchAllLoanClosed = async () => {
    try {
      let res_grp = await axios.get(SERVICE.LOAN, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setAllLoan(res_grp?.data?.loan?.filter((item) => item.status === "Approved" || item.status === "Applied"));
      const data = res_grp?.data?.loan?.filter(
        (item) => item.status === "Approved" || item.status === "Applied"
      );

      const checknoticeperiodEli = data.filter((item) => {
        return (
          item.companyname?.toLowerCase() ==
          isUserRoleAccess?.companyname?.toLowerCase() &&
          item.empcode?.toLowerCase() ==
          isUserRoleAccess?.empcode?.toLowerCase()
        );
      });

      const checkElegable =
        checknoticeperiodEli[checknoticeperiodEli.length - 1]?.emitodo
          ?.length === 0
          ? checknoticeperiodEli[checknoticeperiodEli.length - 1]?.emitodo
            ?.length
          : checknoticeperiodEli[checknoticeperiodEli.length - 1]?.emitodo[
          checknoticeperiodEli[checknoticeperiodEli.length - 1]?.emitodo
            ?.length - 1
          ];

      const month = checkElegable?.months;
      const year = checkElegable?.year;

      if (month == undefined || year === undefined) {
        setIsNoticeperiod(0);
      } else {
        const months = [
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

        const monthIndex = months.findIndex(
          (m) => m?.toLowerCase() === month?.toLowerCase()
        );

        const currentDate = new Date(year, monthIndex, 1);

        currentDate?.setMonth(currentDate?.getMonth() + 6);

        const newMonth = months[currentDate?.getMonth()];
        const newYear = currentDate?.getFullYear();

        const monthIndexs = months?.findIndex(
          (m) => m?.toLowerCase() === newMonth?.toLowerCase()
        );

        var currentDates = new Date();

        var currentMonth = currentDates?.getMonth() + 1;
        var currentYear = currentDates?.getFullYear();

        var yearDifference = newYear - currentYear;
        var monthDifference = monthIndexs + 1 - currentMonth;

        var totalMonthDifference = yearDifference * 12 + monthDifference;

        setIsNoticeperiod(totalMonthDifference);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [Access, setAcces] = useState();
  const [Accessdrop, setAccesDrop] = useState("Employee");
  const [AccessdropEdit, setAccesDropEdit] = useState("Employee");

  useEffect(() => {
    setAcces("Employee");
    setSelectedempDesignation(isUserRoleAccess.designation);
    fetchAllLoanClosed();
  }, []);

  useEffect(() => {
    setAcces(Accessdrop);
  }, [Accessdrop]);

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
          unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          Applydate: t.noticedate,
          Reason: t.reasonleavingname,
          Status: t.status,
          Releasedate: moment(t.approvenoticereq).format("DD-MM-YYYY"),
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        noticeHierarchy.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Name: t.empname,
          Empcode: t.empcode,
          Team: t.team,
          Department: t.department,
          ApplyDate:
            t.noticedate === "undefined"
              ? ""
              : moment(t.noticedate).format("DD-MM-YYYY"),
          Reason: t.reasonleavingname,
          Status:
            t.approvedStatus === "true" &&
              t.cancelstatus === false &&
              t.continuestatus === false
              ? "Approved"
              : t.approvedStatus === "true" && t.cancelstatus === true
                ? "Canceled"
                : t.approvedStatus === "true" && t.continuestatus === true
                  ? "Continue"
                  : t.rejectStatus === "true"
                    ? "Reject"
                    : t.recheckStatus === "true"
                      ? "Recheck"
                      : t.status,
          Releasedate: moment(t.approvenoticereq).format("DD-MM-YYYY"),
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const fetchNoticeApplyHierarchy = async () => {
    setLoader(true);
    try {
      let res_vendor = await axios.post(SERVICE.NOTICE_HIERARCHY_LIST, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username: isUserRoleAccess.companyname,
        sector: "all",
        pagename: "menunoticeperiodlisthierarchy",
        listpageaccessmode: listpageaccessby,
      });
      setNoticeHierarchy(res_vendor.data.resultAccessFilter);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchNoticeApplyHierarchy();
  }, []);
  return (
    <Box>
      <Headtitle title={"NOTICE PERIOD APPLY"} />
      <Typography sx={userStyle.HeaderText}>
        Notice Period Hierarchy
        <Typography sx={userStyle.SubHeaderText}></Typography>
      </Typography>

      <Box sx={userStyle.container}>
        <Box>
          {/* ****** Header Content ****** */}
          <Typography sx={userStyle.HeaderText}>
            Notice Period Hierarchy List
          </Typography>
          <br />
          {isUserRoleCompare?.includes("lnoticeperiodlisthierarchy") && (
            <>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={8}></Grid>
                </Grid>
                <br />
                <br />
                <Grid container sx={{ justifyContent: "center" }}>
                  <Grid>
                    {isUserRoleCompare?.includes(
                      "csvnoticeperiodlisthierarchy"
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
                      "excelnoticeperiodlisthierarchy"
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
                      "printnoticeperiodlisthierarchy"
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
                      "pdfnoticeperiodlisthierarchy"
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
                      "imagenoticeperiodlisthierarchy"
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
                <br />
                {/* added to the pagination grid */}
                <Grid style={userStyle.dataTablestyle}>
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
                      {/* <MenuItem value={employeesList.length}>All</MenuItem> */}
                    </Select>
                  </Box>
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
                <br /> {/* {isLoader ? ( */}
                <>
                  {loader ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        minHeight: "350px",
                      }}
                    >
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
                      {/* <FacebookCircularProgress /> */}
                    </Box>
                  ) : (
                    <>
                      <Box style={{ width: "100%", overflowY: "hidden" }}>
                        <StyledDataGrid
                          rows={rowDataTable}
                          columns={columnDataTable.filter(
                            (column) => columnVisibility[column.field]
                          )}
                          autoHeight={true}
                          density="compact"
                          ref={gridRef}
                          hideFooter
                          checkboxSelection={columnVisibility.checkboxSelection}
                          getRowClassName={getRowClassName}
                          disableRowSelectionOnClick
                          unstable_cellSelection
                          onClipboardCopy={(copiedString) =>
                            setCopiedData(copiedString)
                          }
                          unstable_ignoreValueFormatterDuringExport
                        />
                      </Box>
                      <br />
                      <Box style={userStyle.dataTablestyle}>
                        <Box>
                          Showing{" "}
                          {filteredData.length > 0
                            ? (page - 1) * pageSize + 1
                            : 0}{" "}
                          to {Math.min(page * pageSize, filteredDatas.length)}{" "}
                          of {filteredDatas.length} entries
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
                      </Box>{" "}
                    </>
                  )}
                  <br /> <br />
                </>
              </Box>
              <br />
            </>
          )}
          {/* Manage Column */}
          <Popover
            id={ids}
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

          {/* ****** Table End ****** */}

          {/* print layout */}
          <TableContainer component={Paper} sx={userStyle.printcls}>
            <Table aria-label="simple table" id="branch" ref={componentRef}>
              <TableHead sx={{ fontWeight: "600" }}>
                <StyledTableRow>
                  <StyledTableCell>SI.NO</StyledTableCell>
                  <StyledTableCell>Company</StyledTableCell>
                  <StyledTableCell>Branch</StyledTableCell>
                  <StyledTableCell>Unit </StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Empcode</StyledTableCell>
                  <StyledTableCell>Team</StyledTableCell>
                  <StyledTableCell>Department</StyledTableCell>
                  <StyledTableCell>Apply Date</StyledTableCell>
                  <StyledTableCell>Reason</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Releasedate</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rowDataTable &&
                  rowDataTable.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.company} </StyledTableCell>
                      <StyledTableCell>{row.branch} </StyledTableCell>
                      <StyledTableCell> {row.unit}</StyledTableCell>
                      <StyledTableCell>{row.empname}</StyledTableCell>
                      <StyledTableCell>{row.empcode}</StyledTableCell>
                      <StyledTableCell>{row.team}</StyledTableCell>
                      <StyledTableCell>{row.department}</StyledTableCell>
                      <StyledTableCell>{row.noticedate}</StyledTableCell>
                      <StyledTableCell>{row.reasonleavingname}</StyledTableCell>
                      <StyledTableCell>{row.status}</StyledTableCell>
                      <StyledTableCell>{row.approvenoticereq}</StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ALERT DIALOG */}
          <Box>
            <Dialog
              open={isErrorOpen}
              onClose={handleCloseerr}
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

          {/* Reason of Leaving  */}
          <Dialog
            open={openviewReasonlevEdit}
            onClose={handleClickOpenviewResonlevEdit}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box sx={{ width: "550px", padding: "20px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  Reason For Leaving- Quick Add
                </Typography>
                <br /> <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">
                        {" "}
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                    </FormControl>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={8} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"></Typography>

                        <FormControl size="small" fullWidth>
                          <TextField
                            value={leavingEdit.name}
                            onChange={(e) => {
                              setLeavingEdit({
                                ...leavingEdit,
                                name: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <br /> <br /> <br />
                <Grid container spacing={2}>
                  <Grid item md={2} xs={12} sm={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitReasonEdit}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClearreasonEdit}
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
                      onClick={handleCloseviewReasonlevEdit}
                    >
                      {" "}
                      Close
                    </Button>
                  </Grid>
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

              {fileFormat === "xl" ? (
                <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
              ) : (
                <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
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
                  fetchNoticeperiodlistArray();
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

          {/* this is info view details */}
          <Dialog
            open={openInfo}
            onClose={handleCloseinfo}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box sx={{ width: "550px", padding: "20px 50px" }}>
              <>
                <Typography sx={userStyle.HeaderText}>
                  Notice Period Apply Info
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
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {"SNO"}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {"UserName"}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
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
                                {moment(item.date).format(
                                  "DD-MM-YYYY hh:mm:ss a"
                                )}
                              </StyledTableCell>
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
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {"SNO"}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {"UserName"}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
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
                                {moment(item.date).format(
                                  "DD-MM-YYYY hh:mm:ss a"
                                )}
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
        </Box>
      </Box>
    </Box>
  );
}

export default NoticeperiodApplyHierarchy;
