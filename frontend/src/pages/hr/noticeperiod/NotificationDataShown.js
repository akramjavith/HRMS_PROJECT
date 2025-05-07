import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
  Modal,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
  DialogTitle,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

import LoadingButton from "@mui/lab/LoadingButton";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import * as FileSaver from "file-saver";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

import { MultiSelect } from "react-multi-select-component";
import PageHeading from "../../../components/PageHeading";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import AggregatedSearchBar from '../../../components/AggregatedSearchBar';
import AggridTable from "../../../components/AggridTable";
import AlertDialog from "../../../components/Alert";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import domtoimage from 'dom-to-image';
import PersonIcon from "@mui/icons-material/Person";
import { BASE_URL } from "../../../services/Authservice";
function NotificationDatasShown() {

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [startTestFullName, setStartTestFullName] = useState("");

  const startInterviewRoundByCandidate = async (roundlink) => {
    setPageName(!pageName);
    try {
      handleCloseModcheckboxStartTest();
      const url = `${roundlink}`;

      const updatedUrl = url.replace("/false", "/true");

      window.open(updatedUrl, "_blank");
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [overallItems, setOverallItems] = useState([]);
  let exportColumnNames = [
    'Company',
    'Name',
    'Branch',
    'Unit',
    'Team',
    'Department',
    'Apply Date',
    'Reason',
    'Release Date',
    'Interviewer',
    'Is Meeting Completed',
    'Remarks'
  ];
  let exportRowValues = [
    'company',
    'empname',
    'branch',
    'unit',
    'team',
    'department',
    'noticedate',
    'reasonleavingname',
    'approvenoticereq',
    'interviewer',
    'meetingcompleted',
    'meetingremarks',
  ];

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

  //start test model
  const [isStartTestOpencheckbox, setIsStartTestOpencheckbox] = useState(false);

  const handleCloseModcheckboxStartTest = () => {
    setIsStartTestOpencheckbox(false);
  };
  const handleOpenModcheckboxStartTest = () => {
    setIsStartTestOpencheckbox(true);
  };

  const [startTestRoundLink, setStartTestRoundLink] = useState("");

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  const [employee, setEmployee] = useState({
    bankname: "ICICI BANK - ICICI",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    accounttype: "Please Select Account Type",
    accountstatus: "In-Active",
  });

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
    allUsersData
  } = useContext(UserRoleAccessContext);

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
    fetchEmployee();
    getapi();

  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Notice Period Scheduled Meeting Details"),
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

  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };
  //employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

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
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth, setAuth } = useContext(AuthContext);
  const [getrowid, setRowGetid] = useState([]);

  const [empaddform, setEmpaddform] = useState({
    bankname: "Please Select Bank Name",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
  });
  const [isBankdetail, setBankdetail] = useState(false);

  let username = isUserRoleAccess.username;

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Notice Period Scheduled Meeting Details.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };


  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
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

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
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
    company: true,
    branch: true,
    unit: true,
    empname: true,
    team: true,
    department: true,
    noticedate: true,
    reasonleavingname: true,
    approvenoticereq: true,
    meetingremarks: true,
    meetingcompleted: true,
    interviewer: true,
    actions: true,
    typenew: true,
    candidatestarttest: true,
    scheduledat: true,
    testcompleted: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform({ ...empaddform, ...res?.data?.snoticeperiodapply });

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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

    setEmployee((prev) => ({
      ...prev,
      bankname: "ICICI BANK - ICICI",
      bankbranchname: "",
      accountholdername: "",
      accountnumber: "",
      ifsccode: "",
      accounttype: "Please Select Account Type",
      accountstatus: "In-Active",
    }));
  };

  //get all employees list details

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  //edit post call
  let boredit = empaddform?._id;
  const sendRequestt = async () => {
    setPageName(!pageName);

    try {
      let res = await axios.put(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        meetingcompleted: Boolean(true),
        meetingremarks: String(employee?.remarks),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchEmployee();
      handleCloseModEdit();
      setPopupContent('Updated Successfully');
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();

    if (!employee?.remarks) {
      setPopupContentMalert('Please Enter Remarks!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestt();
    }
  };

  //bank name options
  const accounttypes = [
    { value: "ALLAHABAD BANK - AB", label: "ALLAHABAD BANK - AB" },
    { value: "ANDHRA BANK - ADB", label: "ANDHRA BANK - ADB" },
    { value: "AXIS BANK - AXIS", label: "AXIS BANK - AXIS" },
    { value: "STATE BANK OF INDIA - SBI", label: "STATE BANK OF INDIA - SBI" },
    { value: "BANK OF BARODA - BOB", label: "BANK OF BARODA - BOB" },
    { value: "CITY UNION BANK - CUB", label: "CITY UNION BANK - CUB" },
    { value: "UCO BANK - UCO", label: "UCO BANK - UCO" },
    { value: "UNION BANK OF INDIA - UBI", label: "UNION BANK OF INDIA - UBI" },
    { value: "BANK OF INDIA - BOI", label: "BANK OF INDIA - BOI" },
    {
      value: "BANDHAN BANK LIMITED - BBL",
      label: "BANDHAN BANK LIMITED - BBL",
    },
    { value: "CANARA BANK - CB", label: "CANARA BANK - CB" },
    { value: "GRAMIN VIKASH BANK - GVB", label: "GRAMIN VIKASH BANK - GVB" },
    { value: "CORPORATION BANK - CORP", label: "CORPORATION BANK - CORP" },
    { value: "INDIAN BANK - IB", label: "INDIAN BANK - IB" },
    {
      value: "INDIAN OVERSEAS BANK - IOB",
      label: "INDIAN OVERSEAS BANK - IOB",
    },
    {
      value: "ORIENTAL BANK OF COMMERCE - OBC",
      label: "ORIENTAL BANK OF COMMERCE - OBC",
    },
    {
      value: "PUNJAB AND SIND BANK - PSB",
      label: "PUNJAB AND SIND BANK - PSB",
    },
    {
      value: "PUNJAB NATIONAL BANK - PNB",
      label: "PUNJAB NATIONAL BANK - PNB",
    },
    {
      value: "RESERVE BANK OF INDIA - RBI",
      label: "RESERVE BANK OF INDIA - RBI",
    },
    { value: "SOUTH INDIAN BANK - SIB", label: "SOUTH INDIAN BANK - SIB" },
    {
      value: "UNITED BANK OF INDIA - UBI",
      label: "UNITED BANK OF INDIA - UBI",
    },
    {
      value: "CENTRAL BANK OF INDIA - CBI",
      label: "CENTRAL BANK OF INDIA - CBI",
    },
    { value: "VIJAYA BANK - VB", label: "VIJAYA BANK - VB" },
    { value: "DENA BANK - DEN", label: "DENA BANK - DEN" },
    {
      value: "BHARATIYA MAHILA BANK LIMITED - BMB",
      label: "BHARATIYA MAHILA BANK LIMITED - BMB",
    },
    { value: "FEDERAL BANK - FB", label: "FEDERAL BANK - FB" },
    { value: "HDFC BANK - HDFC", label: "HDFC BANK - HDFC" },
    { value: "ICICI BANK - ICICI", label: "ICICI BANK - ICICI" },
    { value: "IDBI BANK - IDBI", label: "IDBI BANK - IDBI" },
    { value: "PAYTM BANK - PAYTM", label: "PAYTM BANK - PAYTM" },
    { value: "FINO PAYMENT BANK - FINO", label: "FINO PAYMENT BANK - FINO" },
    { value: "INDUSIND BANK - IIB", label: "INDUSIND BANK - IIB" },
    { value: "KARNATAKA BANK - KBL", label: "KARNATAKA BANK - KBL" },
    {
      value: "KOTAK MAHINDRA BANK - KOTAK",
      label: "KOTAK MAHINDRA BANK - KOTAK",
    },
    { value: "YES BANK - YES", label: "YES BANK - YES" },
    { value: "SYNDICATE BANK - SYN", label: "SYNDICATE BANK - SYN" },
    { value: "BANK OF MAHARASHTRA - BOM", label: "BANK OF MAHARASHTRA - BOM" },
    { value: "DCB BANK - DCB", label: "DCB BANK - DCB" },
    { value: "IDFC BANK - IDFC", label: "IDFC BANK - IDFC" },
    {
      value: "JAMMU AND KASHMIR BANK - J&K",
      label: "JAMMU AND KASHMIR BANK - J&K",
    },
    { value: "KARUR VYSYA BANK - KVB", label: "KARUR VYSYA BANK - KVB" },
    { value: "RBL BANK - RBL", label: "RBL BANK - RBL" },
    { value: "DHANLAXMI BANK - DLB", label: "DHANLAXMI BANK - DLB" },
    { value: "CSB BANK - CSB", label: "CSB BANK - CSB" },
    {
      value: "TAMILNAD MERCANTILE BANK - TMB",
      label: "TAMILNAD MERCANTILE BANK - TMB",
    },
  ];

  // bank todo start
  const [loading, setLoading] = useState(false);
  const typeofaccount = [
    { label: "Savings", value: "Savings" },
    { label: "Salary", value: "Salary" },
  ];

  const accountstatus = [
    { label: "Active", value: "Active" },
    { label: "In-Active", value: "In-Active" },
  ];

  const [bankTodo, setBankTodo] = useState([]);

  const handleBankTodoChange = (index, field, value) => {
    const updatedBankTodo = [...bankTodo];
    updatedBankTodo[index] = { ...updatedBankTodo[index], [field]: value };
    setBankTodo(updatedBankTodo);
  };

  const deleteTodoEdit = (index) => {
    setBankTodo(bankTodo?.filter((_, i) => i !== index));
  };

  const handleBankTodoChangeProof = (e, index) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    if (file) {
      if (file.size < maxFileSize) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const updatedBankTodo = [...bankTodo];
          const base64String = reader.result.split(",")[1];

          updatedBankTodo[index] = {
            ...updatedBankTodo[index],
            proof: [
              {
                name: file.name,
                preview: reader.result,
                data: base64String,
              },
            ],
          };

          // console.log(updatedBankTodo, "updatedBankTodo");

          setBankTodo(updatedBankTodo);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
      } else {
        setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } else {
      console.error("No file selected");
    }
  };

  const handleDeleteProof = (index) => {
    setBankTodo((prevArray) => {
      const newArray = [...prevArray];
      newArray[index].proof = [];
      return newArray;
    });
  };

  const [bankUpload, setBankUpload] = useState([]);

  const handleBankDetailsUpload = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    if (file) {
      if (file.size < maxFileSize) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          setBankUpload([
            {
              name: file.name,
              preview: reader.result,
              data: base64String,
            },
          ]);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
      } else {
        setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } else {
      console.error("No file selected");
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

  const handleBankTodo = () => {
    let newObject = {
      bankname: employee.bankname,
      bankbranchname: employee.bankbranchname,
      accountholdername: employee.accountholdername,
      accountnumber: employee.accountnumber,
      ifsccode: employee.ifsccode,
      accounttype: employee.accounttype,
      accountstatus: employee.accountstatus,
      proof: bankUpload,
    };

    const isValidObject = (obj) => {
      for (let key in obj) {
        if (
          obj[key] === "" ||
          obj[key] === undefined ||
          obj[key] === null ||
          obj[key] === "Please Select Account Type"
        ) {
          return false;
        }
      }
      return true;
    };

    const exists = bankTodo.some(
      (obj) => obj.accountnumber === newObject.accountnumber
    );
    const activeexists = bankTodo.some((obj) => obj.accountstatus === "Active");
    if (!isValidObject(newObject)) {
      setPopupContentMalert('Please fill all the Fields!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (exists) {
      setPopupContentMalert('Account Number Already Exist!');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (employee.accountstatus === "Active" && activeexists) {
      setPopupContentMalert('Only one active account is allowed at a time.');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setBankTodo((prevState) => [...prevState, newObject]);
      setEmployee((prev) => ({
        ...prev,
        bankname: "ICICI BANK - ICICI",
        bankbranchname: "",
        accountholdername: "",
        accountnumber: "",
        ifsccode: "",
        accounttype: "Please Select Account Type",
        accountstatus: "In-Active",
      }));
      setBankUpload([]);
    }
  };

  const [bankDetails, setBankDetails] = useState(null);
  const [ifscModalOpen, setIfscModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert small alphabets to capital letters
    const capitalizedValue = value.toUpperCase();

    // Validate input to allow only capital letters and numbers
    const regex = /^[A-Z0-9]*$/;
    if (!regex.test(capitalizedValue)) {
      // If the input contains invalid characters, do not update the state
      return;
    }

    // Validate length of IFSC code (should be 11 characters)
    if (name === "ifscCode" && capitalizedValue.length > 11) {
      // If the IFSC code is longer than 11 characters, truncate it
      setEmployee({
        ...employee,
        [name]: capitalizedValue.slice(0, 11),
      });
    } else {
      setEmployee({
        ...employee,
        [name]: capitalizedValue,
      });
    }
  };

  const fetchBankDetails = async () => {
    setLoading(true);
    setPageName(!pageName);
    try {
      const response = await axios.get(
        `https://ifsc.razorpay.com/${employee.ifscCode}`
      );
      if (response.status === 200) {
        setBankDetails(response.data);
        setLoading(false);
      } else {
        setPopupContentMalert('Bank Details Not Found!');
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      setLoading(false);
      if (err?.response?.data === "Not Found") {
        setPopupContentMalert("Data is Not Found. Please Check IFSC Code!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
      }
    }
  };

  const handleModalClose = () => {
    setIfscModalOpen(false);
    // setEmployee({
    //   ...employee,
    //   ifscCode: '', // Reset the IFSC code field
    // });
    setBankDetails(null); // Reset bank details
  };

  const handleModalOpen = () => {
    setIfscModalOpen(true);
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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName);
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatData = (data) => {
    return data?.map((item, index) => {
      return {
        Sno: index + 1,
        Empcode: item.empcode || "",
        "Employee Name": item.companyname || "",
        "Bank Name": item.bankname || "",
        "Branch Name": item.bankbranchname || "",
        "Account Name": item.accountholdername || "",
        "Account Number": item.accountnumber || "",
        "IFSC Code": item.ifsccode || "",
        "Account Type": item.accounttype || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Notice Period Scheduled Meeting Details");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "Emp Code", field: "empcode" },
    { title: "Name", field: "companyname" },
    { title: "Bank Name", field: "bankname" },
    { title: "Branch Name", field: "bankbranchname" },
    { title: "Account Name", field: "accountholdername" },
    { title: "Account Number", field: "accountnumber" },
    { title: "IFSC Code", field: "ifsccode" },
    { title: "Account Type", field: "accounttype" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns?.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData?.map((t, index) => ({
          ...t,
          serialNumber: index + 1,
        }))
        : employees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
          bankname: item?.bankdetails
            ?.map((t, i) => t?.bankname)
            ?.join(",")
            .toString(),
          bankbranchname: item?.bankdetails
            ?.map((t, i) => t?.bankbranchname)
            ?.join(",")
            .toString(),
          accountholdername: item?.bankdetails
            ?.map((t, i) => t?.accountholdername)
            ?.join(",")
            .toString(),
          accountnumber: item?.bankdetails
            ?.map((t, i) => t?.accountnumber)
            ?.join(",")
            .toString(),
          ifsccode: item?.bankdetails
            ?.map((t, i) => t?.ifsccode)
            ?.join(",")
            .toString(),
          accounttype: item?.bankdetails
            ?.map((t, i) => t?.accounttype)
            ?.join(",")
            .toString(),
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Notice Period Scheduled Meeting Details.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Notice Period Scheduled Meeting Details",
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {

    setItems(datas);
    setOverallItems(datas);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

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

  const totalPages = Math.ceil(employees.length / pageSize);

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

  const columnDataTable = [

    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "empname",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.empname,
      headerClassName: "bold-header",
      pinned: 'left',
    },
    {
      field: "typenew",
      headerName: "Type",
      flex: 0,
      width: 130,
      hide: !columnVisibility.typenew,
      headerClassName: "bold-header",
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
      width: 200,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",


    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 180,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 130,
      hide: !columnVisibility.team,
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
      field: "noticedate",
      headerName: "Apply Date",
      flex: 0,
      width: 130,
      hide: !columnVisibility.noticedate,
      headerClassName: "bold-header",
    },
    {
      field: "reasonleavingname",
      headerName: "Reason",
      flex: 0,
      width: 130,
      hide: !columnVisibility.reasonleavingname,
      headerClassName: "bold-header",
    },
    {
      field: "approvenoticereq",
      headerName: "Release Date",
      flex: 0,
      width: 130,
      hide: !columnVisibility.approvenoticereq,
      headerClassName: "bold-header",
    },
    {
      field: "interviewer",
      headerName: "Interviewer",
      flex: 0,
      width: 350,
      hide: !columnVisibility.interviewer,
      headerClassName: "bold-header",
    },
    {
      field: "scheduledat",
      headerName: "Scheduled At",
      flex: 0,
      width: 350,
      hide: !columnVisibility.scheduledat,
      headerClassName: "bold-header",
    },
    {
      field: "candidatestarttest",
      headerName: "Test",
      flex: 0,
      width: 150,
      minHeight: "40px",
      hide: !columnVisibility.candidatestarttest,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {params?.data?.interviewscheduled &&
            (!params?.data?.interviewForm || params?.data?.interviewForm?.length === 0) && !interviewersList?.includes(isUserRoleAccess?.companyname) && (
              <Button
                endIcon={<PersonIcon />}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  handleOpenModcheckboxStartTest();


                  setStartTestFullName(params.data.testname);
                  setStartTestRoundLink(params?.data?.roundlink);
                }}
              >
                START
              </Button>
            )}
        </Grid>
      ),
    },
    {
      field: "testcompleted",
      headerName: "Is Test Completed",
      flex: 0,
      width: 130,
      hide: !columnVisibility.testcompleted,
      headerClassName: "bold-header",
    },
    {
      field: "meetingcompleted",
      headerName: "Is Meeting Completed",
      flex: 0,
      width: 130,
      hide: !columnVisibility.meetingcompleted,
      headerClassName: "bold-header",
    },
    {
      field: "meetingremarks",
      headerName: "Remarks",
      flex: 0,
      width: 130,
      hide: !columnVisibility.meetingremarks,
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
          {isUserRoleCompare?.includes("enoticeperiodscheduledmeetinglist") && interviewersList?.includes(isUserRoleAccess?.companyname) && !params?.data?.interviewscheduled && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {/*{isUserRoleCompare?.includes("inoticeperiodscheduledmeetinglist") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}*/}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      ...item
    };
  });

  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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

  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setEmployees([]);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
    setSearchQuery("")
  };

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat?.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {
    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSearchQuery("")

    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const [interviewersList, setInterviewersList] = useState([]);
  //get all employees list details
  const fetchEmployee = async () => {
    setBankdetail(true);
    setPageName(!pageName);
    const aggregationPipeline = [
      {
        $match: {
          meetingscheduled: true
        },
      },
      {
        $project: {
          empname: 1,
          empcode: 1,
          companyname: 1,
          hrupload: 1,
          reasonleavingname: 1,
          noticedate: 1,
          approvenoticereq: 1,
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          department: 1,
          noticedate: 1,
          status: 1,
          requestdate: 1,
          requestdatereason: 1,
          requestdatestatus: 1,
          cancelstatus: 1,
          continuestatus: 1,
          meetingscheduled: 1,
          meetingremarks: 1,
          meetingcompleted: 1,
          interviewer: 1,
          interviewscheduled: 1,
          testname: 1,
          date: 1,
          time: 1,
          interviewForm: 1,
        },
      },
    ];
    try {
      let response = await axios.post(
        SERVICE.DYNAMICNOTICEPERIODAPPLIES,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      console.log(response?.data?.users, "response?.data?.users");

      let getInterviewers = [...new Set(response?.data?.users?.flatMap((item) => item?.interviewer))];
      setInterviewersList(getInterviewers);

      let filteredDatas = response?.data?.users?.filter((item) => item?.interviewer?.includes(isUserRoleAccess?.companyname) || item?.empname === isUserRoleAccess?.companyname)

      const itemsWithSerialNumber = filteredDatas?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        noticedate: item.noticedate === "undefined" ? "" : moment(item.noticedate).format("DD-MM-YYYY"),
        approvenoticereq: moment(item.approvenoticereq).format("DD-MM-YYYY"),
        id: item._id,
        index: index + 1,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        empname: item.empname,
        empcode: item.empcode,
        team: item.team,
        department: item.department,
        noticedate: item.noticedate,
        reasonleavingname: item.reasonleavingname,
        status:
          item.status === "Exited" ? item.status :
            item.approvedStatus === "true" &&
              item.cancelstatus === false &&
              item.continuestatus === false
              ? "Approved"
              : item.approvedStatus === "true" && item.cancelstatus === true
                ? "Canceled"
                : item.approvedStatus === "true" && item.continuestatus === true
                  ? "Continue"
                  : item.rejectStatus === "true"
                    ? "Reject"
                    : item.recheckStatus === "true"
                      ? "Recheck"
                      : item.status,
        rejectStatus:
          item?.rejectStatus === "true"
            ? item?.rejectnoticereq
              ? item?.rejectnoticereq
              : "---"
            : item?.cancelstatus === true
              ? item?.cancelreason == "undefined"
                ? "---"
                : item?.cancelreason
              : item?.continuestatus === true
                ? item?.continuereason == "undefined"
                  ? "---"
                  : item?.continuereason
                : "---",
        approvenoticereq: item.approvenoticereq,
        meetingcompleted: item.meetingcompleted ? "Yes" : "No",
        typenew: item.interviewscheduled ? "Exit Interview" : "Notice Period Meeting",
        roundlink: `${BASE_URL}/interview/exitinterview/${item._id}/${item.testname}/false`,
        scheduledat: (item?.date && item?.time) ? `${moment(item?.date).format('DD-MM-YYYY')}_${item?.time}` : "",
        testcompleted: item?.interviewForm?.length > 0 ? "Yes" : 'No'

      }));

      setEmployees(itemsWithSerialNumber);

      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = isAssignBranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        ?.map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        ?.map((u) => u.teamname);

      //----------------------------
      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
        )
        .map((u) => u.companyname);
      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      //-----------------
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);

      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <Headtitle title={"Notice Period Scheduled Meeting Details"} />

      <PageHeading
        title="Notice Period Scheduled Meeting Details"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Notice Period"
        subsubpagename="Notice Period Scheduled Meeting List"
      />

      <br />
      {isUserRoleCompare?.includes("lnoticeperiodscheduledmeetinglist") && (
        <>
          {/* <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>Filters</Typography>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={TypeOptions}
                      styles={colourStyles}
                      value={{
                        label: filterState.type ?? "Please Select Type",
                        value: filterState.type ?? "Please Select Type",
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          type: e.value,
                        }));
                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);
                        setValueBranchCat([]);
                        setSelectedOptionsBranch([]);
                        setValueUnitCat([]);
                        setSelectedOptionsUnit([]);
                        setValueTeamCat([]);
                        setSelectedOptionsTeam([]);
                        setValueDepartmentCat([]);
                        setSelectedOptionsDepartment([]);
                        setValueEmployeeCat([]);
                        setSelectedOptionsEmployee([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={accessbranch
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
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                {["Individual", "Team"]?.includes(filterState.type) ? (
                  <>
                   
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
                            )
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter(
                              (comp) =>
                                valueCompanyCat?.includes(comp.company) &&
                                valueBranchCat?.includes(comp.branch)
                            )
                            ?.map((data) => ({
                              label: data.unit,
                              value: data.unit,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsUnit}
                          onChange={(e) => {
                            handleUnitChange(e);
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={allTeam
                            ?.filter(
                              (u) =>
                                valueCompanyCat?.includes(u.company) &&
                                valueBranchCat?.includes(u.branch) &&
                                valueUnitCat?.includes(u.unit)
                            )
                            .map((u) => ({
                              ...u,
                              label: u.teamname,
                              value: u.teamname,
                            }))}
                          value={selectedOptionsTeam}
                          onChange={(e) => {
                            handleTeamChange(e);
                          }}
                          valueRenderer={customValueRendererTeam}
                          labelledBy="Please Select Team"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Department"]?.includes(filterState.type) ? (
                  <>
                    
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={departmentOptions}
                          value={selectedOptionsDepartment}
                          onChange={(e) => {
                            handleDepartmentChange(e);
                          }}
                          valueRenderer={customValueRendererDepartment}
                          labelledBy="Please Select Department"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Branch"]?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
                            )
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Unit"]?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              valueCompanyCat?.includes(comp.company)
                            )
                            ?.map((data) => ({
                              label: data.branch,
                              value: data.branch,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Unit <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter(
                              (comp) =>
                                valueCompanyCat?.includes(comp.company) &&
                                valueBranchCat?.includes(comp.branch)
                            )
                            ?.map((data) => ({
                              label: data.unit,
                              value: data.unit,
                            }))
                            .filter((item, index, self) => {
                              return (
                                self.findIndex(
                                  (i) =>
                                    i.label === item.label &&
                                    i.value === item.value
                                ) === index
                              );
                            })}
                          value={selectedOptionsUnit}
                          onChange={(e) => {
                            handleUnitChange(e);
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
                {["Individual"]?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={allUsersData
                          ?.filter(
                            (u) =>
                              valueCompanyCat?.includes(u.company) &&
                              valueBranchCat?.includes(u.branch) &&
                              valueUnitCat?.includes(u.unit) &&
                              valueTeamCat?.includes(u.team)
                          )
                          .map((u) => ({
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        value={selectedOptionsEmployee}
                        onChange={(e) => {
                          handleEmployeeChange(e);
                        }}
                        valueRenderer={customValueRendererEmployee}
                        labelledBy="Please Select Employee"
                      />
                    </FormControl>
                  </Grid>
                )}
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={buttonStyles.buttonsubmit}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={buttonStyles.btncancel} onClick={handleClearFilter}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box> */}
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lnoticeperiodscheduledmeetinglist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Notice Period Scheduled Meeting Details List
              </Typography>
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
                    <MenuItem value={employees?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelnoticeperiodscheduledmeetinglist") && (
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
                  {isUserRoleCompare?.includes("csvnoticeperiodscheduledmeetinglist") && (
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
                  {isUserRoleCompare?.includes("printnoticeperiodscheduledmeetinglist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfnoticeperiodscheduledmeetinglist") && (
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
                  {isUserRoleCompare?.includes("imagenoticeperiodscheduledmeetinglist") && (
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
                <AggregatedSearchBar columnDataTable={columnDataTable} setItems={setItems} addSerialNumber={addSerialNumber} setPage={setPage} maindatas={employees} setSearchedString={setSearchedString}

                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={overallItems}
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
            <br />
            <br />
            {isBankdetail ? (
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
                  gridRefTable={gridRef}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}
                />
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
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="edit-dialog-title"
          fullWidth
          maxWidth="md"
          sx={{ mt: 6 }}
        >
          <Box >
            <DialogTitle id="edit-dialog-title">
              <Typography sx={userStyle.SubHeaderText}>
                Edit Notice Period Scheduled Meeting Details
              </Typography>
            </DialogTitle>

            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ fontWeight: 600, mr: 1 }}>Name:</Typography>
                    <Typography sx={{ fontSize: "0.8rem" }}>{empaddform.empname}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Typography sx={{ fontWeight: 600, mr: 1 }}>Emp Code:</Typography>
                    <Typography sx={{ fontSize: "0.8rem" }}>{empaddform.empcode}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box mb={1}>
                    <Typography fontWeight={600}>Remarks</Typography>
                  </Box>
                  <TextField

                    multiline
                    minRows={6}
                    fullWidth
                    size="small"
                    value={employee.remarks}
                    onChange={(e) =>
                      setEmployee({
                        ...employee,
                        remarks: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                variant="contained"
                onClick={editSubmit}
                sx={{ ...buttonStyles.buttonsubmit, mr: 2 }}
              >
                Update
              </Button>
              <Button onClick={handleCloseModEdit} sx={buttonStyles.btncancel}>
                Cancel
              </Button>
            </DialogActions>
          </Box>
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

      <Box>
        <Dialog
          // open={isErrorOpen}
          onClose={handleCloseerr}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6"></Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error">
              ok
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
            <Typography sx={userStyle.HeaderText}> Notice Period Scheduled Meeting Details</Typography>
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

      <Box>
        <Dialog
          open={isErrorOpen}
          // onClose={handleCloseerr}
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

      <Modal
        open={ifscModalOpen}
        onClose={handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        sx={{ marginTop: '30px' }}
      >
        <div
          style={{
            margin: "5% auto",
            backgroundColor: "white",
            padding: "20px",
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Enter IFSC Code</Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <OutlinedInput
            type="text"
            placeholder="Enter IFSC Code"
            name="ifscCode"
            style={{ height: "30px", margin: "10px" }}
            value={employee.ifscCode}
            onChange={handleInputChange}
          />
          <LoadingButton
            variant="contained"
            loading={loading}
            color="primary"
            sx={{
              borderRadius: "20px", marginLeft: "5px", ...buttonStyles.buttonsubmit
            }}
            onClick={fetchBankDetails}
          >
            Get Branch
          </LoadingButton>
          <br />
          {bankDetails && (
            <div>
              <Typography variant="subtitle1">
                Bank Name: {bankDetails.BANK}
              </Typography>
              <Typography variant="subtitle1">
                Branch Name: {bankDetails.BRANCH}
              </Typography>
              <Button
                variant="contained"
                sx={{ borderRadius: "20px", padding: "0 10px", ...buttonStyles.buttonsubmit }}
                onClick={(e) => {
                  const matchedBank = accounttypes.find((bank) => {
                    const labelBeforeHyphen = bank.label.split(" - ")[0];

                    return (
                      labelBeforeHyphen.toLowerCase()?.trim() ===
                      bankDetails.BANK.toLowerCase()?.trim()
                    );
                  });
                  setEmployee({
                    ...employee,
                    bankbranchname: String(bankDetails.BRANCH),
                    ifsccode: employee.ifscCode,
                    bankname: matchedBank?.value,
                  });
                  handleModalClose();
                }}
              >
                Submit
              </Button>
              {/* Add more details as needed */}
            </div>
          )}
        </div>
      </Modal>

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
        filename={"Notice Period Scheduled Meeting Details"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
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

                startInterviewRoundByCandidate(startTestRoundLink);

              }}
            >
              {" "}
              Yes{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default NotificationDatasShown;
