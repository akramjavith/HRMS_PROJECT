import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
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
  Switch,
  TextField,
  Typography, Radio, RadioGroup, FormControlLabel, InputAdornment, Tooltip,
} from "@mui/material";
import axios from "axios";
import {
  paidOpt,
  statusOpt,
  particularModeOptions,
} from "../../components/Componentkeyword";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFilePdf, FaPlus, FaPrint, FaTrash, FaSearch } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import VendorPopup from "./vendorpop.js";
import PageHeading from "../../components/PageHeading";
import domtoimage from 'dom-to-image';
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import AggridTableForPaginationTable from "../../components/AggridTableForPaginationTable.js";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
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

function AddOtherPayments() {
  const [isHandleChange, setIsHandleChange] = useState(false);
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
  const [vendorModeOfPayments, setVendorModeOfPayments] = useState([]);
  const [vendorModeOfPaymentsEdit, setVendorModeOfPaymentsEdit] = useState([]);
  let exportColumnNames = [
    "Company",
    "Branch",
    "Expense Category",
    "Expense SubCategory",
    "Vendor Name",
    "Frequency",
    "GST NO",
    "Purpose",
    "Bill Date",
    "Bill No",
    "Amount",
    "Paid Amount",
    "Balance Amount",
    "Paid Date",
    "Bill Status",
    "Due Date",
    "Pay Mode",
    "Bank Name",
    "IFSC Code",
    "Paid Status",
  ];
  let exportRowValues = [
    "company",
    "branchname",
    "expensecategory",
    "expensesubcategory",
    "vendor",
    "vendorfrequency",
    "gstno",
    "purpose",
    "billdate",
    "billno",
    "dueamount",
    "paidamount",
    "balanceamount",
    "paiddate",
    "paidbillstatus",
    "receiptdate",
    "paidthrough",
    "bankname",
    "ifsccode",
    "paidstatus",
  ];
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

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };
  const [payments, setpayments] = useState([]);
  useEffect(() => {
    addSerialNumber(payments);
  }, [payments]);




  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");

  const [vendorAuto, setVendorAuto] = useState("");
  const [sasassendDataToParent, sendDataToParent] = useState("")
  const handleCloseviewalertvendor = () => {
    setOpenviewalertvendro(false);
  };

  const handleClickOpenviewalertvendor = () => {
    setOpenviewalertvendro(true);
  };
  const [openviewalertvendor, setOpenviewalertvendro] = useState(false);
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
      pagename: String("List Schedule Payment Bills"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };
  // Get the current date and format it as "YYYY-MM-DD"
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const gridRefTableImg = useRef(null);
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "List Schedule Payment Bills.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  let statusOpt = [
    { value: "Paid", label: "Paid" },
    { value: "Not Paid", label: "Not Paid" },
  ];

  const [vendor, setVendorNew] = useState({
    bankname: "",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    upinumber: "",
    chequenumber: "",
    cardnumber: "",
    cardholdername: "",
    cardtransactionnumber: "",
    cardtype: "",
    cardmonth: "",
    cardyear: "",
    cardsecuritycode: "",
  });

  const [vendorEdit, setVendorNewEdit] = useState({
    bankname: "",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    upinumber: "",
    chequenumber: "",
    cardnumber: "",
    cardholdername: "",
    cardtransactionnumber: "",
    cardtype: "",
    cardmonth: "",
    cardyear: "",
    cardsecuritycode: "",
  });

  const [frequencyValue, setFrequencyValue] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [frequencyValueEdit, setFrequencyValueEdit] = useState("");
  const [vendorIdEdit, setVendorIdEdit] = useState("");

  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
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
          data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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

  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  const [groupedVendorNames, setGroupedVendorNames] = useState([]);
  const [groupedVendorNamesEdit, setGroupedVendorNamesEdit] = useState([]);
  const [newotherPaymnets, setnewotherPaymnets] = useState({
    branchname: {
      label: "Please Select Branch",
      value: "Please Select Branch",
    },
    headname: {
      label: "Please  Select Head Name",
      value: "Please  Select Head Name",
    },
    company: "Please Select Company",
    purpose: "Please Select Purpose",
    billno: "",
    vendor: { label: "Please Select Vendor", value: "Please Select Vendor" },
    dueamount: "",
    accountholdername: "",
    paymentfrequency: "",
    bankname: "",
    ifsccode: "",
    gstno: "",
    billdate: formattedDate,
    receiptdate: formattedDate,
    paidthrough: {
      label: "Please Select Paidthrough",
      value: "Please Select Paidthrough",
    },
    paid: {
      label: "Please Select Paid",
      value: "Please Select Paid",
    },
    referenceno: "",
    paidstatus: "Not Paid",
    expansecategory: "Please Select Expense Category",
    expansesubcategory: "Please Select Expense Sub Category",
  });


  const [holidays, setHolidays] = useState([])

  const fetchHoliday = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(SERVICE.ALL_HOLIDAY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });



      setHolidays(res_status?.data?.holiday);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Helper function to find the next available date that's not a Sunday or a holiday
  const getNextValidDate = (date, holidays) => {
    const holidaysSet = new Set(holidays); // Store holidays for quick lookup
    let nextDate = moment(date); // Convert the date to a Moment instance

    // Increment the date until it's not a Sunday or a holiday
    while (nextDate.day() === 0 || holidaysSet.has(nextDate.format("YYYY-MM-DD"))) {
      nextDate.add(1, 'day'); // Move to the next day
    }

    return nextDate;
  };

  const setDueDate = (e) => {
    let dueDate = ""; // Default value if not monthly
    if (e.paymentfrequency === "Monthly" && e.monthlyfrequency) {
      // Get the current month and year
      const today = moment();
      let proposedDate = moment(`${today.year()}-${today.month() + 1}-${e.monthlyfrequency}`, "YYYY-MM-DD");

      // If proposedDate is in the past, set it to next month
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'month');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(newotherPaymnets.company) &&
          data.applicablefor?.includes(newotherPaymnets?.branchname?.label)
        )
        ?.map(item => item?.date);


      // Get the valid due date (not Sunday or a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    }



    setnewotherPaymnets({
      ...newotherPaymnets,
      vendor: {
        label: e.label,
        value: e.value,
      },
      vendorfrequency: e.paymentfrequency,
      paidmode: "Please Select Paid Mode",
      receiptdate: dueDate
    });
  };


  const setDueDateEdit = (e) => {
    let dueDate = ""; // Default value if not monthly
    if (e.paymentfrequency === "Monthly" && e.monthlyfrequency) {
      // Get the current month and year
      const today = moment(singlePay.billdate);
      let proposedDate = moment(`${today.year()}-${today.month() + 1}-${e.monthlyfrequency}`, "YYYY-MM-DD");

      // If proposedDate is in the past, set it to next month
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'month');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(singlePay.company) &&
          data.applicablefor?.includes(singlePay?.branchname)
        )
        ?.map(item => item?.date);


      // Get the valid due date (not Sunday or a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    } else if (e.paymentfrequency === "Weekly" && e.weeklyfrequency) {
      // Set today to "2024-05-17"
      const today = moment(singlePay.billdate);

      // Map days of the week to their numeric values (Sunday = 0, Monday = 1, ..., Saturday = 6)
      const dayMapping = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
      };

      // Get the numeric value of the desired day
      const targetDay = dayMapping[e.weeklyfrequency];

      // Calculate the next target day from today
      let proposedDate = today.clone().isoWeekday(targetDay);

      // If the proposed day is earlier than today, move to the next week
      if (proposedDate.isBefore(today, 'day')) {
        proposedDate.add(1, 'week');
      }

      // Filter holidays specific to the selected company, branch, and unit
      let mappedHolidays = holidays
        ?.filter(data =>
          data.company?.includes(singlePay.company) &&
          data.applicablefor?.includes(singlePay?.branchname)
        )
        ?.map(item => item?.date);

      // Get the valid due date (not a holiday)
      const validDueDate = getNextValidDate(proposedDate, mappedHolidays);
      dueDate = validDueDate.format("YYYY-MM-DD"); // Format as YYYY-MM-DD
    }


    setSinglePay({
      ...singlePay,
      vendor: e.value,
      gstno:
        e.gstnumber == undefined || e.gstnumber == ""
          ? ""
          : e.gstnumber,
      accountholdername:
        e.accountholdername == undefined ||
          e.accountholdername == ""
          ? ""
          : e.accountholdername,
      bankname:
        e.bankname == undefined || e.bankname == ""
          ? ""
          : e.bankname,
      ifsccode:
        e.ifsccode == undefined || e.ifsccode == ""
          ? ""
          : e.ifsccode,
      endorfrequency: e.paymentfrequency,
      paidmode: "",
      receiptdate: dueDate,
      paidthrough: "Please Select Paid Through",
    });


  };
  const [groupCheck, setGroupCheck] = useState(false);

  const [fetchsavepurpose, setFetchsavepurpose] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("");
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
  const [searchQuery, setSearchQuery] = useState("");

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const renderFilePreviewMulter = async (file) => {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const renderFilePreviewMulterUploaded = async (file) => {
    if (!file) return false;
    const imageUrl = `${SERVICE.VEIW_EXPENSE_FILES}/${file.filename}`;
    window.open(imageUrl, '_blank'); // Open image in a new tab
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    checkbox: true,
    company: true,
    branchname: true,
    expensecategory: true,
    expensesubcategory: true,
    purpose: true,
    billno: true,
    vendor: true,
    gstno: true,
    billdate: true,
    receiptdate: true,
    dueamount: true,
    vendorfrequency: true,
    bankname: true,
    ifsccode: true,
    paidthrough: true,
    referenceno: true,
    paidstatus: true,
    paidamount: true,
    balanceamount: true,
    paiddate: true,
    paidbillstatus: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Excel
  useEffect(() => {
    fetchPurposeDropdowns();
    fetchExpenseCate();
    fetchVendor();
    fetchVendorGrouping();
  }, []);

  useEffect(() => {
    fetchVendor();
    fetchVendorGrouping();
  }, [vendorAuto]);

  useEffect(() => {
    fetchHoliday();
  }, []);

  const [viewOpen, setViewpen] = useState(false);

  const handleViewOpen = () => {
    setViewpen(true);
  };
  const handleViewClose = () => {
    setViewpen(false);
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "List Schedule Payment Bills",
    pageStyle: "print",
  });

  const classes = useStyles();
  // FILEICONPREVIEW CREATE
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
  const { auth } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [refDocuments, setrefDocuments] = useState([]);
  const [refRecDocuments, setRefRecDouments] = useState([]);

  const [branchOptions, setBranchOptions] = useState([]);
  const [headNameOptions, setHeadnameoptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [gstOptions, setGstOptions] = useState({});

  const OptionsType = [
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
    { value: "Card", label: "Card" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Cheque", label: "Cheque" },
  ];
  const paid = [
    { value: "Paid", label: "Paid" },
    { value: "Not Paid", label: "Not Paid" },
  ];
  const [purposes, setPurposes] = useState([]);
  const [purposesEdit, setPurposesEdit] = useState([]);

  //get all  vendordetails.
  const fetchVendorNew = async (e) => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filtered = res_vendor?.data?.vendordetails.filter((data) => {
        return data.vendorname === e.value;
      });

      setVendorNew((prev) => ({
        ...prev,
        ...filtered[0],
      }));
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchPurposeDropdowns = async () => {
    try {
      let res_category = await axios.get(SERVICE.ALL_PURPOSE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const purposeall = [
        ...res_category?.data?.purpose.map((d) => ({
          ...d,
          label: d.purposename,
          value: d.purposename,
        })),
      ];

      setPurposes(purposeall);
      setPurposesEdit(purposeall);
      setFetchsavepurpose("");
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [expanseOption, setExpanseOption] = useState([]);
  const [expense, setExpense] = useState([]);
  const fetchExpenseCate = async () => {
    try {
      let res = await axios.get(SERVICE.EXPENSECATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setExpense(res?.data?.expensecategory);
      setExpanseOption([
        ...res?.data?.expensecategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchVendor = async (e) => {
    try {
      let response = await axios.get(`${SERVICE.ALL_VENDORDETAILS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.vendordetails?.filter(item => item.vendorstatus === "Active");
      let filter_opt = [...new Set(data_set)];
      setVendorOptions(
        data_set?.map((data) => ({
          ...data,
          label: data.vendorname,
          value: data.vendorname,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [vendorGrouping, setVendorGrouping] = useState([])
  const fetchVendorGrouping = async () => {
    try {
      let res = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorGrouping([
        ...res?.data?.vendorgrouping?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        }))
      ]);
      setVendorAuto("");
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
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

  const fetchGstNo = async (e) => {
    try {
      let response = await axios.get(`${SERVICE.ALL_VENDORDETAILS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.vendordetails.find((data) => {
        return data._id === e._id;
      });
      setGstOptions(data_set);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const fetchGstNoEdit = async (e) => {
    try {
      let response = await axios.get(`${SERVICE.ALL_VENDORDETAILS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.vendordetails.find((data) => {
        return data._id === e._id;
      });
      setSinglePay({
        ...singlePay,
        vendor: data_set.vendorname,
        gstno:
          data_set.gstnumber == undefined || data_set.gstnumber == ""
            ? ""
            : data_set.gstnumber,
        accountholdername:
          data_set.accountholdername == undefined ||
            data_set.accountholdername == ""
            ? ""
            : data_set.accountholdername,
        bankname:
          data_set.bankname == undefined || data_set.bankname == ""
            ? ""
            : data_set.bankname,
        ifsccode:
          data_set.ifsccode == undefined || data_set.ifsccode == ""
            ? ""
            : data_set.ifsccode,
      });
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleChangeInput = (e) => {
    // Remove any numeric characters from the input value
    const newValue = e.target.value.replace(/[0-9]/g, "");
    setnewotherPaymnets({ ...newotherPaymnets, purpose: newValue });
  };

  //get all  vendordetails.
  const fetchVendorNewEdit = async (e) => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filtered = res_vendor?.data?.vendordetails.filter((data) => {
        return data.vendorname === e.value;
      });

      setVendorNewEdit((prev) => ({
        ...prev,
        ...filtered[0],
      }));
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleClear = () => {
    console.log("clear");
    setnewotherPaymnets({
      ...newotherPaymnets,
      branchname: {
        label: "Please Select Branch",
        value: "Please Select Branch",
      },
      company: "Please Select Company",
      headname: {
        label: "Please  Select Head Name",
        value: "Please  Select Head Name",
      },
      purpose: "Please Select Purpose",
      billno: "",
      vendor: { label: "Please Select Vendor", value: "Please Select Vendor" },
      dueamount: "",
      vendorgrouping: "",
      accountholdername: "",
      paymentfrequency: "",
      bankname: "",
      ifsccode: "",
      gstno: "",
      billdate: formattedDate,
      receiptdate: formattedDate,
      paidthrough: {
        label: "Please Select Paidthrough",
        value: "Please Select Paidthrough",
      },
      paid: {
        label: "Please Select Paid",
        value: "Please Select Paid",
      },
      referenceno: "",
      paidstatus: "Not Paid",
      expansecategory: "Please Select Expense Category",
      expansesubcategory: "Please Select Expense Sub Category",
    });

    setFrequencyValue("");

    setGstOptions({});
    setRefRecDouments([]);
    setrefDocuments([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);


  const [billUploadedFiles, setBillUploadedFiles] = useState([]);
  const [uploadBills, setUploadBills] = useState([]);
  const [deletedBillFiles, setDeletedBillFiles] = useState([]);

  const [receiptUploadedFiles, setReceiptUploadedFiles] = useState([]);
  const [uploadReceipt, setUploadReceipt] = useState([]);
  const [deletedReceiptFiles, setDeletedReceiptFiles] = useState([]);
  const handleSubmitEdit = () => {
    if (
      singlePay?.company === "Please Select Comapny" ||
      singlePay?.company === "" ||
      singlePay?.company == undefined
    ) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.branchname === "Please Select Branch" ||
      singlePay?.branchname === ""
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.expensecategory === "Please Select Expense Category" ||
      singlePay?.expensecategory === "" ||
      singlePay?.expensecategory === undefined
    ) {
      setPopupContentMalert("Please Select Expense Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.expensesubcategory === "Please Select Expense Sub Category" ||
      singlePay?.expensesubcategory === "" ||
      singlePay?.expensesubcategory === undefined
    ) {
      setPopupContentMalert("Please Select Expense Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singlePay?.purpose === "Please Select Purpose") {
      setPopupContentMalert("Please Select Purpose!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singlePay?.billno === "") {
      setPopupContentMalert("Please Enter Billno!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (singlePay?.vendorgrouping === "" || !singlePay?.vendorgrouping) {
      setPopupContentMalert("Please Select Vendor Grouping!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (singlePay?.vendor === "") {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (singlePay?.billdate === "") {
      setPopupContentMalert("Please Select Bill Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singlePay?.receiptdate === "") {
      setPopupContentMalert("Please Select Due Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singlePay?.dueamount === "") {
      setPopupContentMalert("Please Enter Dueamount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.paidstatus === "Paid" &&
      singlePay?.paidamount === 0
    ) {
      setPopupContentMalert("Please Enter Paid Amount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (
      singlePay?.paidstatus === "Paid" &&
      !singlePay?.paiddate
    ) {
      setPopupContentMalert("Please Select Paid Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.paidstatus === "Paid" &&
      (singlePay?.paidthrough === "" ||
        singlePay?.paidthrough === "Please Select Paid Through")
    ) {
      setPopupContentMalert("Please Select Paid Through!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.paidstatus === "Paid" &&
      singlePay?.referenceno === ""
    ) {
      setPopupContentMalert("Please Enter Reference No!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if ([...uploadBills, ...billUploadedFiles].length === 0) {
      setPopupContentMalert("Please Upload Bills!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestEdit();
    }
  };

  // bill docs
  const handleInputChangedocument = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...refDocuments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
        file.type === "application/zip" ||
        file.type.startsWith("image/")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setrefDocuments(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {

        setPopupContentMalert("Only Accept Documents!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  // bill doc delete
  const handleDeleteFileDocument = (index) => {
    const newSelectedFiles = [...refDocuments];

    newSelectedFiles.splice(index, 1);
    setrefDocuments(newSelectedFiles?.length > 0 ? newSelectedFiles : []);
  };

  // receipt docs
  const handleInputChangedocumentRec = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...refRecDocuments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "text/plain" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // Handle Excel
        file.type === "application/zip" ||
        file.type.startsWith("image/")
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefRecDouments(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {

        setPopupContentMalert("Only Accept Documents!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  const handleDeleteFileDocumentRef = (index) => {
    const newSelectedFiles = [...refRecDocuments];
    newSelectedFiles.splice(index, 1);
    setRefRecDouments(newSelectedFiles);
  };




  const handleInputChangedocumentEdit = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setUploadBills((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
      })),
    ]);
  };

  // bill edit delete
  const handleDeleteFileDocumentEdit = (index) => {
    const newSelectedFiles = [...billdocs];
    newSelectedFiles.splice(index, 1);
    setUploadBills(newSelectedFiles);
  };


  const handleInputChangedocumentRecEd = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to Array
    if (!selectedFiles.length) return;

    let largeFiles = []; // To store names of files larger than 1MB

    // Filter files that are <= 1MB (1,024,000 bytes)
    const filteredFiles = selectedFiles.filter((file) => {
      if (file.size > 1024000) {
        largeFiles.push(file.name); // Collect large file names
        return false;
      }
      return true;
    });

    // If there are large files, show a single popup message
    if (largeFiles.length > 0) {
      setPopupContentMalert(
        `The following files are larger than 1MB and will not be uploaded:\n${largeFiles.join(", ")}`
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    if (filteredFiles.length === 0) return; // If no valid files, exit

    setUploadReceipt((prevFiles) => [
      ...prevFiles,
      ...filteredFiles.map((file) => ({
        file,
      })),
    ]);
  };

  const handleDeleteFileDocumentRefEd = (index) => {
    const newSelectedFiles = [...receiptDocs];
    newSelectedFiles.splice(index, 1);
    setUploadReceipt(newSelectedFiles);
  };

  const [advancedFilter, setAdvancedFilter] = useState(null);


  const [logicOperator, setLogicOperator] = useState("AND");

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("Contains");
  const [filterValue, setFilterValue] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
  const [totalPages, setTotalPages] = useState(0);
  const [totalDatas, setTotalDatas] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalProjectsData, setTotalProjectsData] = useState([]);
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
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
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

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery); // Update debounced query after the timeout
    }, 300); // Debounce delay in milliseconds (adjust as needed)

    return () => {
      clearTimeout(handler); // Clear the timeout if searchQuery changes within the delay
    };
  }, [searchQuery]);
  const [filterClicked, setFilterClicked] = useState(false)

  useEffect(() => {
    if (filterClicked) {
      fetchAllPayments(filterClicked);
    }
  }, [page, pageSize, debouncedQuery]);
  const handleResetSearch = async () => {
    setPageName(!pageName)
    // setLoader(false);

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
      page: Number(page),
      pageSize: Number(pageSize),
    };

    const allFilters = [];

    // Only include advanced filters if they exist, otherwise just use regular searchQuery
    if (allFilters.length > 0 && selectedColumn !== "") {
      queryParams.allFilters = allFilters
      queryParams.logicOperator = logicOperator;
    } else if (debouncedQuery) {
      queryParams.searchQuery = debouncedQuery;  // Use searchQuery for regular search
    }


    try {
      setGroupCheck(true);
      let res = await axios.post(SERVICE.SKIPPEDOTHERPAYMENTS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        ...queryParams,
        assignbranch: accessbranch,
      });

      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: (page - 1) * pageSize + index + 1,
        billdate: moment(item.billdate).format("DD-MM-YYYY"),
        receiptdate: moment(item.receiptdate).format("DD-MM-YYYY"),
        paiddate: item?.paiddate ? moment(item?.paiddate).format("DD-MM-YYYY") : "",
        balanceamount: Number(item?.dueamount) - Number(item?.paidamount || 0),
        paidbillstatus: item.paidstatus === "Not Paid" ? "InComplete" : (item.paidstatus === "Paid" && Number(item.dueamount) === Number(item.paidamount)) ? "Completed" : "Partially Paid",

      }));

      setpayments(itemsWithSerialNumber);
      setTotalProjectsData(res?.data?.totalProjectsDatas?.length > 0 ?
        res?.data?.totalProjectsDatas?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          billdate: moment(item.billdate).format("DD-MM-YYYY"),
          receiptdate: moment(item.receiptdate).format("DD-MM-YYYY"),
          paiddate: item?.paiddate ? moment(item?.paiddate).format("DD-MM-YYYY") : "",
          balanceamount: Number(item?.dueamount) - Number(item?.paidamount || 0),
          paidbillstatus: item.paidstatus === "Not Paid" ? "InComplete" : (item.paidstatus === "Paid" && Number(item.dueamount) === Number(item.paidamount)) ? "Completed" : "Partially Paid",
        })) : []);
      setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
      setTotalDatas(ans?.length > 0 ? res?.data?.totalProjects : 0);
      setPageSize((data) => {
        return ans?.length > 0 ? data : 10;
      });
      setPage((data) => {
        return ans?.length > 0 ? data : 1;
      });

      setGroupCheck(false);

    } catch (err) {
      setGroupCheck(false); handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }

  }

  //get all project.


  const [openEdit, setOpenEdit] = useState(false);
  const handleEditOpen = () => {
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);

    setBillUploadedFiles([])
    setUploadBills([])
    setDeletedBillFiles([])

    setReceiptUploadedFiles([])
    setUploadReceipt([])
    setDeletedReceiptFiles([])
  };

  const [singlePay, setSinglePay] = useState({});
  const [billdocs, setBillDocs] = useState([]);
  const [receiptDocs, setReceiptDocs] = useState([]);
  const fetchVendorSingle = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorModeOfPaymentsEdit(res?.data?.svendordetails?.modeofpayments);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [oldTotalAmount, setOldTotalAmount] = useState(0)
  const [oldPaidAmount, setOldPaidAmount] = useState(0)
  //get single row to edit....



  const handleDeleteUploadedBills = (index) => {
    setBillUploadedFiles((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setDeletedBillFiles((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });

  };
  const handleDeleteUploadedReceipt = (index) => {
    setReceiptUploadedFiles((prevFiles) => {
      const fileToDelete = prevFiles[index];

      // Store the deleted file separately
      setDeletedReceiptFiles((prevDeleted) => [...prevDeleted, fileToDelete]);

      // Remove from uploadedFiles state
      return prevFiles.filter((_, i) => i !== index);
    });

  };

  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_OTHERPAYMENTS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorNewEdit(res?.data?.sotherpayment);

      // await fetchVendorNewEdit({ value: res?.data?.sotherpayment?.vendor });
      setSinglePay({ ...res?.data?.sotherpayment, balanceamount: Number(res?.data?.sotherpayment?.dueamount) - Number(res?.data?.sotherpayment?.paidamount || 0) });
      setOldTotalAmount(res?.data?.sotherpayment?.dueamount || 0);
      setOldPaidAmount(res?.data?.sotherpayment?.paidamount || 0);

      // setBillDocs(res?.data?.sotherpayment?.billsdocument);
      // setReceiptDocs(res?.data?.sotherpayment?.receiptdocument);

      let multerUploadedFiles = res?.data?.sotherpayment?.billsdocument?.filter(data => !data.preview)
      setBillUploadedFiles(multerUploadedFiles);

      let multerUploadedreceiptFiles = res?.data?.sotherpayment?.receiptdocument?.filter(data => !data.preview)
      setReceiptUploadedFiles(multerUploadedreceiptFiles);

      setFrequencyValueEdit(res?.data?.sotherpayment?.vendorfrequency);
      setVendorIdEdit(res?.data?.sotherpayment?.vendorid);
      setGroupedVendorNamesEdit(vendorGrouping?.filter(item => item.name === res?.data?.sotherpayment?.vendorgrouping)?.map(data => data?.vendor));
      await fetchVendorSingle(res?.data?.sotherpayment?.vendorid);
      handleEditOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getCodeView = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_OTHERPAYMENTS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSinglePay({ ...res?.data?.sotherpayment, balanceamount: Number(res?.data?.sotherpayment?.dueamount) - Number(res?.data?.sotherpayment?.paidamount || 0) });
      setBillDocs(res?.data?.sotherpayment?.billsdocument);
      setReceiptDocs(res?.data?.sotherpayment?.receiptdocument);
      handleViewOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const getCodeInfo = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_OTHERPAYMENTS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSinglePay(res?.data?.sotherpayment);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  const [deleteGroup, setDeletegroup] = useState("");

  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_OTHERPAYMENTS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletegroup(res?.data?.sotherpayment);
      handleClickOpen();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Alert delete popup
  let groupEditt = deleteGroup?._id;
  const deleGroup = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_OTHERPAYMENTS}/${groupEditt}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllPayments(filterClicked);
      handleCloseMod();
      setPage(1);

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const delGroupcheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_OTHERPAYMENTS}/${item}`, {
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

      await fetchAllPayments(filterClicked);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //Project updateby edit page...
  let updateby = singlePay?.updatedby;
  let addedby = singlePay?.addedby;

  const sendRequestEdit = async (e) => {
    const currentDate = new Date();
    const currentTimeString = currentDate.toLocaleTimeString([], {
      hour12: false,
    });
    const dateTimeString = `${singlePay.receiptdate} ${currentTimeString}`;
    try {

      const formData = new FormData();

      if (uploadBills.length > 0) {
        uploadBills.forEach((item) => {
          formData.append("billsdocument", item.file); // `files` is the key for multiple files
        });
      }
      if (uploadReceipt.length > 0) {
        uploadReceipt.forEach((item) => {
          formData.append("receiptdocument", item.file); // `files` is the key for multiple files
        });
      }
      if (deletedBillFiles.length > 0) {
        formData.append("deletedBillFiles", JSON.stringify(deletedBillFiles));
      }
      if (deletedReceiptFiles.length > 0) {
        formData.append("deletedReceiptFiles", JSON.stringify(deletedReceiptFiles));
      }

      const jsonData = {
        company: String(singlePay.company),
        branchname:
          singlePay.branchname === String(singlePay.branchname)
            ? String(singlePay.branchname)
            : String(singlePay?.branchname?.value),
        expensecategory: String(singlePay?.expensecategory),
        expensesubcategory: String(singlePay?.expensesubcategory),
        purpose: String(singlePay.purpose),
        billno: String(singlePay.billno),
        vendor: String(singlePay.vendor),
        vendorgrouping: String(singlePay.vendorgrouping),
        gstno: String(singlePay.gstno),
        billdate: String(singlePay.billdate),
        receiptdate: String(singlePay.receiptdate),
        dueamount: Number(singlePay.dueamount),
        paymentfrequency: String(singlePay.paymentfrequency),
        paidthrough:
          singlePay.paidstatus === "Paid"
            ? String(singlePay.paidthrough)
            : "",

        bankname:
          singlePay.paidthrough === "Bank Transfer" &&
            singlePay.paidstatus === "Paid"
            ? String(vendorEdit.bankname)
            : "",
        bankbranchname:
          singlePay.paidthrough === "Bank Transfer" &&
            singlePay.paidstatus === "Paid"
            ? String(vendorEdit.bankbranchname)
            : "",
        accountholdername:
          singlePay.paidthrough === "Bank Transfer" &&
            singlePay.paidstatus === "Paid"
            ? String(vendorEdit.accountholdername)
            : "",
        accountnumber:
          singlePay.paidthrough === "Bank Transfer" &&
            singlePay.paidstatus === "Paid"
            ? String(vendorEdit.accountnumber)
            : "",
        ifsccode:
          singlePay.paidthrough === "Bank Transfer" &&
            singlePay.paidstatus === "Paid"
            ? String(vendorEdit.ifsccode)
            : "",

        upinumber:
          singlePay.paidthrough === "UPI" && singlePay.paidstatus === "Paid"
            ? String(vendorEdit.upinumber)
            : "",

        cardnumber:
          singlePay.paidthrough === "Card" && singlePay.paidstatus === "Paid"
            ? String(vendorEdit.cardnumber)
            : "",
        cardholdername:
          singlePay.paidthrough === "Card" && singlePay.paidstatus === "Paid"
            ? String(vendorEdit.cardholdername)
            : "",
        cardtransactionnumber:
          singlePay.paidthrough === "Card" && singlePay.paidstatus === "Paid"
            ? String(vendorEdit.cardtransactionnumber)
            : "",
        cardtype:
          singlePay.paidthrough === "Card" && singlePay.paidstatus === "Paid"
            ? String(vendorEdit.cardtype)
            : "",
        cardmonth:
          singlePay.paidthrough === "Card" && singlePay.paidstatus === "Paid"
            ? String(vendorEdit.cardmonth)
            : "",
        cardyear:
          singlePay.paidthrough === "Card" && singlePay.paidstatus === "Paid"
            ? String(vendorEdit.cardyear)
            : "",
        cardsecuritycode:
          singlePay.paidthrough === "Card" && singlePay.paidstatus === "Paid"
            ? String(vendorEdit.cardsecuritycode)
            : "",

        chequenumber:
          singlePay.paidthrough === "Cheque" &&
            singlePay.paidstatus === "Paid"
            ? String(vendorEdit.chequenumber)
            : "",

        cash:
          singlePay.paidthrough === "Cash" && singlePay.paidstatus === "Paid"
            ? String("Cash")
            : "",

        paid:
          singlePay.paid === String(singlePay.paid)
            ? String(singlePay.paid)
            : String(singlePay.paid?.value),
        referenceno:
          singlePay.paidstatus === "Paid"
            ? String(singlePay.referenceno)
            : "",
        vendorfrequency: String(frequencyValueEdit),
        vendorid: String(vendorIdEdit),
        source: "Scheduled Payment",
        paidstatus: String(singlePay.paidstatus),
        sortdate: String(
          singlePay.paidstatus === "Paid" ? dateTimeString : ""
        ),


        paidbillstatus: String(singlePay.paidstatus === "Not Paid" ? "InComplete" : (singlePay.paidstatus === "Paid" && Number(singlePay.dueamount) === Number(singlePay.paidamount)) ? "Completed" : "Partially Paid"),
        paiddate: singlePay.paidstatus === "Paid" ? singlePay?.paiddate : "",
        paidamount: singlePay.paidstatus === "Paid" ? Number(singlePay?.paidamount) : 0,

        ...((Number(oldPaidAmount) !== Number(singlePay.paidamount)) &&
        {
          paymentduereminderlog: singlePay.paidstatus === "Paid" ? [
            ...((singlePay.paymentduereminderlog?.length > 0 && Number(oldTotalAmount) === Number(singlePay.dueamount)) ? singlePay.paymentduereminderlog : []),
            {
              balanceamount: Number(
                singlePay.paidstatus === "Not Paid"
                  ? singlePay.dueamount
                  : Number(singlePay.dueamount) - Number(singlePay.paidamount)
              ),
              expensetotal: singlePay.dueamount,
              modeofpayments: singlePay.paidthrough.value,
              payamountdate: singlePay?.paiddate,
              payamount: Number(
                singlePay.paidstatus === "Not Paid" ? 0 : singlePay.paidamount
              ),
              bankname: singlePay.paidthrough.value === "Bank Transfer"
                ? String(vendor.bankname)
                : "",
              bankbranchname: singlePay.paidthrough.value === "Bank Transfer"
                ? vendor.bankbranchname
                : "",
              accountholdername: singlePay.paidthrough.value === "Bank Transfer"
                ? vendor.accountholdername
                : "",
              accountnumber: singlePay.paidthrough.value === "Bank Transfer"
                ? vendor.accountnumber
                : "",
              ifsccode: singlePay.paidthrough.value === "Bank Transfer" ? vendor.ifsccode : "",

              upinumber: singlePay.paidthrough.value === "UPI" ? vendor.upinumber : "",

              cardnumber: singlePay.paidthrough.value === "Card" ? vendor.cardnumber : "",
              cardholdername: singlePay.paidthrough.value === "Card"
                ? vendor.cardholdername
                : "",
              cardtransactionnumber: singlePay.paidthrough.value === "Card"
                ? vendor.cardtransactionnumber
                : "",
              cardtype: singlePay.paidthrough.value === "Card" ? vendor.cardtype : "",
              cardmonth: singlePay.paidthrough.value === "Card" ? vendor.cardmonth : "",
              cardyear: singlePay.paidthrough.value === "Card" ? vendor.cardyear : "",
              cardsecuritycode: singlePay.paidthrough.value === "Card"
                ? vendor.cardsecuritycode
                : "",
              chequenumber: singlePay.paidthrough.value === "Cheque"
                ? vendor.chequenumber
                : "",
              addedby: [
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            }] : []
        }),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      }
      formData.append("jsonData", JSON.stringify(jsonData));
      let response = await axios.put(
        `${SERVICE.SINGLE_OTHERPAYMENTS}/${singlePay?._id}`, formData,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        }
      );
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchAllPayments(filterClicked);
      handleEditClose();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
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
  // / Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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
      field: "branchname",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branchname,
      headerClassName: "bold-header",
    },
    {
      field: "expensecategory",
      headerName: "Expense Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.expensecategory,
      headerClassName: "bold-header",
    },
    {
      field: "expensesubcategory",
      headerName: "Expense SubCategory",
      flex: 0,
      width: 150,
      hide: !columnVisibility.expensesubcategory,
      headerClassName: "bold-header",
    },
    {
      field: "vendor",
      headerName: "Vendor Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.vendor,
      headerClassName: "bold-header",
    },
    {
      field: "vendorfrequency",
      headerName: "Frequency",
      flex: 0,
      width: 150,
      hide: !columnVisibility.vendorfrequency,
      headerClassName: "bold-header",
    },
    {
      field: "gstno",
      headerName: "GST NO",
      flex: 0,
      width: 150,
      hide: !columnVisibility.gstno,
      headerClassName: "bold-header",
    },
    {
      field: "purpose",
      headerName: "Purpose",
      flex: 0,
      width: 150,
      hide: !columnVisibility.purpose,
      headerClassName: "bold-header",
    },
    {
      field: "billdate",
      headerName: "Bill Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.billdate,
      headerClassName: "bold-header",
    },
    {
      field: "billno",
      headerName: "Bill No",
      flex: 0,
      width: 150,
      hide: !columnVisibility.billno,
      headerClassName: "bold-header",
    },
    {
      field: "dueamount",
      headerName: " Amount",
      flex: 0,
      width: 150,
      hide: !columnVisibility.dueamount,
      headerClassName: "bold-header",
    },
    {
      field: "paidamount",
      headerName: "Paid Amount",
      flex: 0,
      width: 150,
      hide: !columnVisibility.paidamount,
      headerClassName: "bold-header",
    },
    {
      field: "balanceamount",
      headerName: "Balance Amount",
      flex: 0,
      width: 150,
      hide: !columnVisibility.balanceamount,
      headerClassName: "bold-header",
    },
    {
      field: "paiddate",
      headerName: "Paid Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.paiddate,
      headerClassName: "bold-header",
    },
    {
      field: "paidbillstatus",
      headerName: "Bill Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.paidbillstatus,
      headerClassName: "bold-header",
    },
    {
      field: "receiptdate",
      headerName: "Due Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.receiptdate,
      headerClassName: "bold-header",
    },
    {
      field: "paidthrough",
      headerName: "Pay Mode",
      flex: 0,
      width: 150,
      hide: !columnVisibility.paidthrough,
      headerClassName: "bold-header",
    },
    {
      field: "bankname",
      headerName: "Bank Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.bankname,
      headerClassName: "bold-header",
    },
    {
      field: "ifsccode",
      headerName: "IFSC Code",
      flex: 0,
      width: 150,
      hide: !columnVisibility.ifsccode,
      headerClassName: "bold-header",
    },
    {
      field: "paidstatus",
      headerName: "Paid Status",
      flex: 0,
      width: 130,
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
          {isUserRoleCompare?.includes("elistschedulepaymentbills") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dlistschedulepaymentbills") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vlistschedulepaymentbills") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeView(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ilistschedulepaymentbills") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCodeInfo(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const filteredSelectedColumn = columnDataTable.filter(data => data.field !== 'checkbox' && data.field !== "actions" && data.field !== "serialNumber");

  const rowDataTable = filteredDatas.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      company: item.company,
      branchname: item.branchname,
      headname: item.headname,
      purpose: item.purpose,
      billno: item.billno,
      vendor: item.vendor,
      gstno: item.gstno,
      billdate: item.billdate,
      receiptdate: item.receiptdate,
      dueamount: item.dueamount,
      vendorfrequency: item.vendorfrequency,
      bankname: item.bankname,
      ifsccode: item.ifsccode,
      paidthrough: item.paidthrough,
      paid: item.paid,
      referenceno: item.referenceno,
      paidstatus: item.paidstatus,
      expensecategory: item?.expensecategory,
      expensesubcategory: item?.expensesubcategory,
      paidamount: item?.paidamount || 0,
      balanceamount: item?.balanceamount || 0,
      paiddate: item?.paiddate || "",
      paidbillstatus: item?.paidbillstatus || "",
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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



  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };




  const daysoptions = [
    { label: "Yesterday", value: "Yesterday" },
    { label: "Last Week", value: "Last Week" },
    { label: "Last Month", value: "Last Month" },
    { label: "Today", value: "Today" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Custom Fields", value: "Custom Fields" },
  ]


  const [filterUser, setFilterUser] = useState({
    day: "Today",
    fromtime: '00:00',
    totime: '23:59',
    fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD')
  });

  const handleChangeFilterDate = (e) => {
    let fromDate = '';
    let toDate = moment().format('YYYY-MM-DD');
    switch (e.value) {
      case 'Today':
        setFilterUser((prev) => ({ ...prev, fromdate: toDate, todate: toDate }))
        break;
      case 'Yesterday':
        fromDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
        toDate = fromDate; // Yesterday’s date
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Week':
        fromDate = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Week':
        fromDate = moment().startOf('week').format('YYYY-MM-DD');
        toDate = moment().endOf('week').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Last Month':
        fromDate = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
        toDate = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'This Month':
        fromDate = moment().startOf('month').format('YYYY-MM-DD');
        toDate = moment().endOf('month').format('YYYY-MM-DD');
        setFilterUser((prev) => ({ ...prev, fromdate: fromDate, todate: toDate }))
        break;

      case 'Custom Fields':
        setFilterUser((prev) => ({ ...prev, fromdate: "", todate: "" }))
        break;
      default:
        return;
    }
  }
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = accessbranch.filter(
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
        .map((a, index) => {
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

      setValueCompanyCat([
        ...selectedCompany,
        // isUserRoleCompare?.includes("lassignexpenseothers") && "Others",
      ]);
      setSelectedOptionsCompany([
        ...mappedCompany,
        // isUserRoleCompare?.includes("lassignexpenseothers") && {
        //   label: "Others",
        //   value: "Others",
        // },
      ]);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
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
        .map((a, index) => {
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
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);


  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (filterUser.day === "Custom Fields" && (!filterUser.fromdate || !filterUser.todate)) {
      setPopupContentMalert("Please Select All Date Fields!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      setFilterClicked(true);
      fetchAllPayments(true);
    }
  };

  const fetchAllPayments = async (clicked) => {
    setPageName(!pageName);
    try {
      if (clicked) {
        setGroupCheck(true);
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
        } else if (debouncedQuery) {
          queryParams.searchQuery = debouncedQuery;  // Use searchQuery for regular search
        }

        let res = await axios.post(SERVICE.SKIPPEDOTHERPAYMENTS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ...queryParams,
          assignbranch: accessbranch,
          dateFilter: filterUser?.day ? filterUser : null,
          company: valueCompanyCat,
          branch: valueBranchCat,
          unit: valueUnitCat,
        });

        const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
        const itemsWithSerialNumber = ans?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          billdate: moment(item.billdate).format("DD-MM-YYYY"),
          receiptdate: moment(item.receiptdate).format("DD-MM-YYYY"),
          paiddate: item?.paiddate ? moment(item?.paiddate).format("DD-MM-YYYY") : "",
          balanceamount: Number(item?.dueamount) - Number(item?.paidamount || 0),
          paidbillstatus: item.paidstatus === "Not Paid" ? "InComplete" : (item.paidstatus === "Paid" && Number(item.dueamount) === Number(item.paidamount)) ? "Completed" : "Partially Paid",
        }));

        setpayments(itemsWithSerialNumber);
        setTotalProjectsData(res?.data?.totalProjectsDatas?.length > 0 ?
          res?.data?.totalProjectsDatas?.map((item, index) => ({
            ...item,
            id: item._id,
            serialNumber: (page - 1) * pageSize + index + 1,
            billdate: moment(item.billdate).format("DD-MM-YYYY"),
            receiptdate: moment(item.receiptdate).format("DD-MM-YYYY"),
            paiddate: item?.paiddate ? moment(item?.paiddate).format("DD-MM-YYYY") : "",
            balanceamount: Number(item?.dueamount) - Number(item?.paidamount || 0),
            paidbillstatus: item.paidstatus === "Not Paid" ? "InComplete" : (item.paidstatus === "Paid" && Number(item.dueamount) === Number(item.paidamount)) ? "Completed" : "Partially Paid",
          })) : []);
        setTotalProjects(ans?.length > 0 ? res?.data?.totalProjects : 0);
        setTotalPages(ans?.length > 0 ? res?.data?.totalPages : 0);
        setTotalDatas(ans?.length > 0 ? res?.data?.totalProjects : 0);
        setPageSize((data) => {
          return ans?.length > 0 ? data : 10;
        });
        setPage((data) => {
          return ans?.length > 0 ? data : 1;
        });
      }
      setGroupCheck(false);
    } catch (err) {
      setGroupCheck(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setpayments([]);

    setFilterUser({
      day: "Today",
      fromtime: '00:00',
      totime: '23:59',
      fromdate: moment().format('YYYY-MM-DD'), todate: moment().format('YYYY-MM-DD')
    });
    setTotalProjectsData([]);
    setTotalProjects([]);
    setTotalPages(0);
    setTotalDatas(0);
    setPageSize(10);
    setPage(1);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  return (
    <Box>
      <PageHeading
        title="List Schedule Payment Bills"
        modulename="Expenses"
        submodulename="Payment"
        mainpagename="List Schedule Payment Bills"
        subpagename=""
        subsubpagename=""
      />

      <Box>
        <Headtitle title={"LIST SCHEDULE PAYMENT BILLS"} />
        {/* ****** Header Content ****** */}
        {isUserRoleCompare?.includes("llistschedulepaymentbills") && (
          <>
            <Box sx={userStyle.selectcontainer}>
              <Grid container spacing={2}>
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <MultiSelect
                        options={[
                          ...accessbranch?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          })),

                        ]
                          ?.filter(Boolean) // Filter out falsy values, including `undefined`
                          ?.filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
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
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Branch</Typography>
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
                        disabled={valueCompanyCat?.includes("Others")}
                      />
                    </FormControl>
                  </Grid>
                  {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Unit</Typography>
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
                        disabled={valueCompanyCat?.includes("Others")}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography sx={{ fontWeight: "500" }}>
                        Days
                      </Typography>
                      <Selects
                        options={daysoptions}
                        // styles={colourStyles}
                        value={{ label: filterUser.day ? filterUser.day : "Please Select Days", value: filterUser.day ? filterUser.day : "Please Select Days" }}
                        onChange={(e) => {
                          handleChangeFilterDate(e);
                          setFilterUser((prev) => ({ ...prev, day: e.value }))
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {filterUser.day !== "" && <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          From Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="from-date"
                          type="date"
                          disabled={filterUser.day !== "Custom Fields"}
                          value={filterUser.fromdate}
                          onChange={(e) => {
                            const newFromDate = e.target.value;
                            setFilterUser((prevState) => ({
                              ...prevState,
                              fromdate: newFromDate,
                              todate: prevState.todate && new Date(prevState.todate) > new Date(newFromDate) ? prevState.todate : ""
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          To Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="to-date"
                          type="date"
                          value={filterUser.todate}
                          disabled={filterUser.day !== "Custom Fields"}
                          onChange={(e) => {
                            const selectedToDate = new Date(e.target.value);
                            const selectedFromDate = new Date(filterUser.fromdate);

                            if (selectedToDate >= selectedFromDate && selectedToDate >= new Date(selectedFromDate)) {
                              setFilterUser({
                                ...filterUser,
                                todate: e.target.value
                              });
                            } else {
                              setFilterUser({
                                ...filterUser,
                                todate: "" // Reset to empty string if the condition fails
                              });
                            }
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>}
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
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleClearFilter}
                  >
                    {" "}
                    Clear{" "}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
        <br />
        {isUserRoleCompare?.includes("llistschedulepaymentbills") && (
          <>
            <br />
            {/* ****** Table Start ****** */}

            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Schedule Payment Bills List
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {isUserRoleCompare?.includes("aaddincome") && (
                    <>
                      <Link
                        to={`/account/addotherpayments`}
                        style={{
                          textDecoration: "none",
                          color: "white",
                          float: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={buttonStyles.buttonsubmit}
                        >
                          ADD
                        </Button>
                      </Link>
                    </>
                  )}
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
                      {/* <MenuItem value={payments?.length}>All</MenuItem> */}
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
                      "excellistschedulepaymentbills"
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
                    {isUserRoleCompare?.includes("csvlistschedulepaymentbills") && (
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
                      "printlistschedulepaymentbills"
                    ) && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                    {isUserRoleCompare?.includes("pdflistschedulepaymentbills") && (
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
                      "imagelistschedulepaymentbills"
                    ) && (
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={handleCaptureImage}
                        >
                          <ImageIcon sx={{ fontSize: "15px" }} />
                          &ensp;image&ensp;
                        </Button>
                      )}
                  </Box>
                </Grid>
                <Grid item md={2} xs={6} sm={6}>
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
              <br />
              <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                Show All Columns
              </Button>
              &ensp;
              <Button
                sx={userStyle.buttongrp}
                onClick={handleOpenManageColumns}
              >
                Manage Columns
              </Button>
              &ensp;
              {isUserRoleCompare?.includes("bdlistschedulepaymentbills") && (
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonbulkdelete}
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
              <br />
              <br />
              {groupCheck ? (
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


                        totalDatas={totalDatas}

                        setFilteredRowData={setFilteredRowData}
                        filteredRowData={filteredRowData}
                        gridRefTableImg={gridRefTableImg}
                        itemsList={totalProjectsData}
                      />
                    </>
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
                        fetchAllPayments(filterClicked);
                        handleCloseSearch();
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
        <Box>
          <Dialog open={openEdit} onClose={handleEditClose} maxWidth="lg" sx={{ marginTop: "50px" }}>
            <DialogContent>
              <Box>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Schedule Payment Bills Edit
                    </Typography>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
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
                        styles={colourStyles}
                        value={{
                          label: singlePay.company,
                          value: singlePay.company,
                        }}
                        onChange={(e) => {
                          setSinglePay({
                            ...singlePay,
                            company: e.value,
                            branchname: "Please Select Branch",
                            vendorgrouping: "",
                            vendor: "",
                            vendorfrequency: "",
                            duedate: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        id="component-outlined"
                        type="text"
                        styles={colourStyles}
                        options={accessbranch
                          ?.filter((comp) => singlePay.company === comp.company)
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
                        placeholder={singlePay?.branchname}
                        onChange={(e) => {
                          setSinglePay({
                            ...singlePay,
                            branchname: {
                              label: e.label,
                              value: e.value,
                            },
                            vendor: "",
                            vendorfrequency: "",
                            duedate: "",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Expense Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        id="component-outlined"
                        styles={colourStyles}
                        options={expanseOption}
                        value={{
                          label:
                            singlePay?.expensecategory === "" ||
                              singlePay?.expensecategory === undefined
                              ? "Please Select Expense Category"
                              : singlePay?.expensecategory,
                          value:
                            singlePay?.expensecategory === "" ||
                              singlePay?.expensecategory === undefined
                              ? "Please Select Expense Category"
                              : singlePay?.expensecategory,
                        }}
                        placeholder="Please  Select Category"
                        onChange={(e) => {
                          setSinglePay({
                            ...singlePay,
                            expensecategory: e.value,
                            expensesubcategory:
                              "Please Select Expense Sub Category",
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Expense Sub Category <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        id="component-outlined"
                        styles={colourStyles}
                        options={expense
                          ?.filter(
                            (item) =>
                              item.categoryname === singlePay?.expensecategory
                          )
                          .map((item) => {
                            return item.subcategoryname.map((subCatName) => ({
                              label: subCatName,
                              value: subCatName,
                            }));
                          })
                          .flat()}
                        value={{
                          label:
                            singlePay?.expensesubcategory === "" ||
                              singlePay?.expensesubcategory === undefined
                              ? "Please Select Expense Sub Category"
                              : singlePay?.expensesubcategory,
                          value:
                            singlePay?.expensesubcategory === "" ||
                              singlePay?.expensesubcategory === undefined
                              ? "Please Select Expense Sub Category"
                              : singlePay?.expensesubcategory,
                        }}
                        placeholder="Please Select Sub Category"
                        onChange={(e) => {
                          setSinglePay({
                            ...singlePay,
                            expensesubcategory: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Purpose<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={purposesEdit}
                        styles={colourStyles}
                        value={{
                          label: singlePay.purpose,
                          value: singlePay.purpose,
                        }}
                        onChange={(e) => {
                          setSinglePay({
                            ...singlePay,
                            purpose: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Bill No<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        value={singlePay.billno}
                        onChange={(e) => {
                          setSinglePay({
                            ...singlePay,
                            billno: e.target.value,
                          });
                        }}
                        type="text"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Vendor Grouping<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={vendorGrouping.filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                        placeholder="Please choose Vendor Grouping"
                        value={{
                          label: !singlePay.vendorgrouping ? "Please Select Vendor Grouping" : singlePay.vendorgrouping,
                          value: !singlePay.vendorgrouping ? "Please Select Vendor Grouping" : singlePay.vendorgrouping,
                        }}
                        onChange={(e) => {
                          setSinglePay({
                            ...singlePay,
                            vendorgrouping: e.value,
                            vendor: "",
                            vendorfrequency: "",
                            duedate: "",
                            paidmode: "Please Select Paid Mode",
                          });
                          setGroupedVendorNamesEdit(vendorGrouping?.filter(item => item.name === e.value)?.map(data => data?.vendor));
                          setFrequencyValueEdit("");
                          setVendorIdEdit("");
                          setVendorModeOfPaymentsEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {/* next grdi */}
                  <>
                    <Grid
                      item
                      md={2.5}
                      sm={12}
                      xs={12}
                      sx={{ display: "flex" }}
                    >
                      <FormControl fullWidth size="small">
                        <Typography>
                          Vendor Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={vendorOptions?.filter(data =>
                            groupedVendorNamesEdit?.includes?.(data?.value)
                          )}
                          value={{
                            label: singlePay?.vendor ? singlePay?.vendor : "Please Select Vendor",
                            value: singlePay?.vendor ? singlePay?.vendor : "Please Select Vendor",
                          }}
                          placeholder={singlePay?.vendor}
                          onChange={(e) => {
                            // fetchGstNoEdit(e);
                            setDueDateEdit(e)
                            setFrequencyValueEdit(e.paymentfrequency);
                            setVendorIdEdit(e._id);
                            fetchVendorNewEdit(e);
                            setVendorModeOfPaymentsEdit(e?.modeofpayments);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {isUserRoleCompare?.includes("avendormaster") && (
                      <Grid item md={0.5} sm={1} xs={1}>
                        <Button
                          variant="contained"
                          style={{
                            height: "30px",
                            minWidth: "20px",
                            padding: "19px 13px",
                            color: "white",
                            marginTop: "23px",
                            marginLeft: "-10px",
                            background: "rgb(25, 118, 210)",
                          }}
                          onClick={() => {
                            handleClickOpenviewalertvendor();
                          }}
                        >
                          <FaPlus style={{ fontSize: "15px" }} />
                        </Button>
                      </Grid>
                    )}
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography> GSTNO</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={singlePay.gstno}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Frequency</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          sx={userStyle.input}
                          placeholder="Please Enter Frequency"
                          value={frequencyValueEdit}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bill Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          type="date"
                          value={singlePay.billdate}
                          onChange={(e) => {
                            setSinglePay({
                              ...singlePay,
                              billdate: e.target.value,
                              receiptdate: "",
                              paiddate: ""
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Due Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          type="date"
                          value={singlePay.receiptdate}
                          onChange={(e) => {
                            setSinglePay({
                              ...singlePay,
                              receiptdate: e.target.value,
                              paiddate: ""
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                  {/* next grdi */}
                  <>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Due Amount<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          sx={userStyle.input}
                          type="number"
                          value={singlePay.dueamount}
                          onChange={(e) => {
                            setSinglePay({
                              ...singlePay,
                              dueamount: e.target.value,
                              paidamount: 0,
                              balanceamount: 0,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Paid Status<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={statusOpt}
                          placeholder="Please Select Status"
                          value={{
                            label: singlePay.paidstatus,
                            value: singlePay.paidstatus,
                          }}
                          onChange={(e) => {
                            setSinglePay({
                              ...singlePay,
                              paidstatus: e.value,
                              paidthrough: "Please Select Paid Through",
                              referenceno: "",
                              paidamount: 0,
                              balanceamount: 0,
                              paiddate: "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {singlePay.paidstatus === "Paid" && (
                      <>
                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Paid Amount<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              placeholder="Please Enter Paid Amount"
                              sx={userStyle.input}
                              value={singlePay.paidamount}
                              onChange={(e) => {
                                if (
                                  Number(e.target.value) <=
                                  Number(singlePay.dueamount)
                                ) {
                                  setSinglePay({
                                    ...singlePay,
                                    paidamount: e.target.value,
                                    balanceamount:
                                      Number(singlePay.dueamount) - e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Balance Amount
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              placeholder="Balance Amount"
                              sx={userStyle.input}
                              value={singlePay.balanceamount} readOnly

                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Paid Date<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              type="date"
                              value={singlePay.paiddate}
                              onChange={(e) => {
                                setSinglePay({
                                  ...singlePay,
                                  paiddate: e.target.value,
                                });
                              }}
                              inputProps={{
                                min: singlePay.billdate,
                                max: singlePay.receiptdate
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          md={3}
                          sm={12}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>
                              Paid Through<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              options={paidOpt?.filter((data) =>
                                vendorModeOfPaymentsEdit?.includes(data?.label)
                              )}
                              placeholder={singlePay?.paidthrough}
                              value={{
                                label: singlePay.paidthrough,
                                value: singlePay.paidthrough,
                              }}
                              onChange={(e) => {
                                setSinglePay({
                                  ...singlePay,
                                  paidthrough: e.value,
                                });
                              }}
                            />
                          </FormControl>
                          &emsp;
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Reference No<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Form"
                              value={singlePay.referenceno}
                              onChange={(e) => {
                                setSinglePay({
                                  ...singlePay,
                                  referenceno: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography variant="h6">Attachments</Typography>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <br />
                    <Typography variant="h6">
                      Bill<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <input
                      className={classes.inputs}
                      type="file"
                      id="file-inputuploadcreatefirst"
                      accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip, .png , .jpg , "
                      multiple
                      onChange={(e) => {
                        handleInputChangedocumentEdit(e);
                      }}
                    />
                    <label htmlFor="file-inputuploadcreatefirst">
                      <Button
                        component="span"
                        style={{
                          backgroundColor: "#f4f4f4",
                          color: "#444",
                          minWidth: "40px",
                          boxShadow: "none",
                          borderRadius: "5px",
                          marginTop: "-5px",
                          textTransform: "capitalize",
                          border: "1px solid #0000006b",
                          "&:hover": {
                            "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                              backgroundColor: "#f4f4f4",
                            },
                          },
                        }}
                      >
                        Upload Document &ensp; <CloudUploadIcon />
                      </Button>
                    </label>
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {uploadBills?.length > 0 && uploadBills?.map((data, index) => (
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

                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(data.name || data.file.name)}
                                    height="25"
                                    alt="file icon"
                                  />
                                  {/* )} */}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {data.name || data.file.name}{" "}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={2} xs={2}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                    }}
                                    onClick={() => renderFilePreviewMulter(data.file)}
                                  />
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
                                  onClick={() =>
                                    handleDeleteFileDocumentEdit(index)
                                  }
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "medium",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                        {billUploadedFiles?.length > 0 && billUploadedFiles?.map((data, index) => (
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

                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(data.name || data.file.name)}
                                    height="25"
                                    alt="file icon"
                                  />
                                  {/* )} */}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {data.name || data.file.name}{" "}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={2} xs={2}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                    }}
                                    onClick={() => renderFilePreviewMulterUploaded(data)}
                                  />
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
                                  onClick={() =>
                                    handleDeleteUploadedBills(index)
                                  }
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "medium",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <br />
                    <Typography variant="h6">Receipt</Typography>
                    <input
                      className={classes.inputs}
                      type="file"
                      id="file-inputupload"
                      accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip, .png , .jpg , "
                      multiple
                      onChange={(e) => {
                        handleInputChangedocumentRecEd(e);
                      }}
                    />
                    <label htmlFor="file-inputupload">
                      <Button
                        component="span"
                        style={{
                          backgroundColor: "#f4f4f4",
                          color: "#444",
                          minWidth: "40px",
                          boxShadow: "none",
                          borderRadius: "5px",
                          marginTop: "-5px",
                          textTransform: "capitalize",
                          border: "1px solid #0000006b",
                          "&:hover": {
                            "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                              backgroundColor: "#f4f4f4",
                            },
                          },
                        }}
                      >
                        Upload Document &ensp; <CloudUploadIcon />
                      </Button>
                    </label>
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {uploadReceipt?.length > 0 && uploadReceipt?.map((data, index) => (
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

                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(data.name || data.file.name)}
                                    height="25"
                                    alt="file icon"
                                  />
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {data.name || data.file.name}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                md={2}
                                sm={2}
                                xs={2}
                                sx={{ display: "flex" }}
                              >
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                    }}
                                    onClick={() => renderFilePreviewMulter(data.file)}
                                  />
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
                                  onClick={() =>
                                    handleDeleteFileDocumentRefEd(index)
                                  }
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "medium",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                        {receiptUploadedFiles?.length > 0 && receiptUploadedFiles?.map((data, index) => (
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

                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(data.name || data.file.name)}
                                    height="25"
                                    alt="file icon"
                                  />
                                  {/* )} */}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {data.name || data.file.name}{" "}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={2} xs={2}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                    }}
                                    onClick={() => renderFilePreviewMulterUploaded(data)}
                                  />
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
                                  onClick={() =>
                                    handleDeleteUploadedReceipt(index)
                                  }
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "medium",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                  {singlePay.paidthrough === "Cash" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <br />
                        <br />
                        <br />

                        <Grid
                          item
                          md={4}
                          lg={3}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography sx={{ fontWeight: "bold" }}>
                              Cash
                            </Typography>
                            <br />

                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              readOnly={true}
                              value={"Cash"}
                              onChange={(e) => { }}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}

                  {singlePay.paidthrough === "Bank Transfer" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <br />
                        <br />

                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Bank Details
                          </Typography>
                        </Grid>

                        <br />
                        <br />

                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Bank Name</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.bankname}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Bank Branch Name</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.bankbranchname}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Account Holder Name</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.accountholdername}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Account Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.accountnumber}
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          md={4}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>IFSC Code</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.ifsccode}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}

                  {singlePay.paidthrough === "UPI" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            UPI Details
                          </Typography>
                        </Grid>

                        <br />
                        <br />

                        <Grid
                          item
                          md={3}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>UPI Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.upinumber}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}

                  {singlePay.paidthrough === "Card" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <Grid md={12} item xs={8}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Card Details
                          </Typography>
                        </Grid>

                        <br />
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.cardnumber}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Holder Name</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.cardholdername}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Transaction Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.cardtransactionnumber}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Card Type</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.cardtype}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={6}>
                          <Typography>Expire At</Typography>
                          <Grid container spacing={1}>
                            <Grid item md={6} xs={12} sm={6}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  readOnly={true}
                                  value={vendorEdit.cardmonth}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={6}>
                              <FormControl fullWidth size="small">
                                <OutlinedInput
                                  readOnly={true}
                                  value={vendorEdit.cardyear}
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          md={3}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>Security Code</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.cardsecuritycode}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}

                  {singlePay.paidthrough === "Cheque" &&
                    singlePay.paidstatus === "Paid" && (
                      <>
                        <Grid item md={12} xs={8}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            Cheque Details
                          </Typography>
                        </Grid>

                        <br />

                        <Grid
                          item
                          md={3}
                          xs={12}
                          sm={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>Cheque Number</Typography>
                            <OutlinedInput
                              readOnly={true}
                              value={vendorEdit.chequenumber}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  <Grid container spacing={2}>
                    <Grid item md={12} sm={12} xs={12}>
                      <br />
                      <br />
                      <Grid
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "15px",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={handleSubmitEdit}
                          sx={buttonStyles.buttonsubmit}
                        >
                          {" "}
                          UPDATE
                        </Button>
                        <Button
                          sx={buttonStyles.btncancel}
                          onClick={handleEditClose}
                        >
                          {" "}
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
        <Box>
          <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="lg" sx={{ marginTop: "50px" }}>
            <DialogContent>
              <Box >
                <Grid container spacing={2}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Schedule Payment Bills View
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Company</Typography>
                      <OutlinedInput
                        readOnly
                        id="component-outlined"
                        value={singlePay?.company}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Branch</Typography>
                      <OutlinedInput
                        readOnly
                        id="component-outlined"
                        value={singlePay?.branchname}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Expense Category</Typography>
                      <OutlinedInput
                        readOnly
                        id="component-outlined"
                        value={singlePay?.expensecategory}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Expense Sub Category</Typography>
                      <OutlinedInput
                        readOnly
                        id="component-outlined"
                        value={singlePay?.expensesubcategory}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Purpose</Typography>
                      <OutlinedInput readOnly value={singlePay.purpose} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Bill No</Typography>
                      <OutlinedInput readOnly value={singlePay.billno} />
                    </FormControl>
                  </Grid>
                  {/* next grdi */}
                  <>
                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Vendor Grouping</Typography>
                        <OutlinedInput readOnly value={singlePay?.vendorgrouping} />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Vendor Name</Typography>
                        <OutlinedInput readOnly value={singlePay?.vendor} />
                      </FormControl>
                      &emsp;
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography> GSTNO</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={singlePay.gstno}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography> Frequency</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={singlePay.vendorfrequency}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Bill Date</Typography>
                        <OutlinedInput
                          readOnly
                          value={moment(singlePay.billdate).format(
                            "DD-MM-YYYY"
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Due Date</Typography>
                        <OutlinedInput
                          readOnly
                          value={moment(singlePay.receiptdate).format(
                            "DD-MM-YYYY"
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>
                  {/* next grdi */}
                  <>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Due Amount</Typography>
                        <OutlinedInput
                          readOnly
                          id="component-outlined"
                          value={singlePay.dueamount}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Paid Status</Typography>
                        <OutlinedInput value={singlePay?.paidstatus} readOnly />
                      </FormControl>
                      &emsp;
                    </Grid>

                    {singlePay?.paidstatus === "Paid" && (
                      <>
                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                          <FormControl fullWidth size="small">
                            <Typography>Paid Amount</Typography>
                            <OutlinedInput value={singlePay?.paidamount || 0} readOnly />
                          </FormControl>
                          &emsp;
                        </Grid>
                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                          <FormControl fullWidth size="small">
                            <Typography>Balance Amount</Typography>
                            <OutlinedInput value={Number(singlePay?.dueamount) - Number(singlePay?.paidamount || 0)} readOnly />
                          </FormControl>
                          &emsp;
                        </Grid>
                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                          <FormControl fullWidth size="small">
                            <Typography>Paid Date</Typography>
                            <OutlinedInput value={singlePay?.paiddate || ""} readOnly />
                          </FormControl>
                          &emsp;
                        </Grid>
                        <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                          <FormControl fullWidth size="small">
                            <Typography>Bill Status</Typography>
                            <OutlinedInput value={singlePay.paidstatus === "Not Paid" ? "InComplete" : (singlePay?.paidstatus === "Paid" && Number(singlePay?.dueamount) === Number(singlePay?.paidamount)) ? "Completed" : "Partially Paid"} readOnly />
                          </FormControl>
                          &emsp;
                        </Grid>
                        <Grid
                          item
                          md={3}
                          sm={12}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>Paid Through</Typography>
                            <OutlinedInput
                              value={singlePay?.paidthrough}
                              readOnly
                            />
                          </FormControl>
                          &emsp;
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Reference No</Typography>
                            <OutlinedInput
                              readOnly
                              value={singlePay.referenceno}
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}

                    {singlePay.paidthrough === "Cash" &&
                      singlePay.paidstatus === "Paid" && (
                        <>
                          <br />
                          <br />
                          <br />

                          <Grid
                            item
                            md={4}
                            lg={3}
                            xs={12}
                            sm={12}
                            sx={{ display: "flex" }}
                          >
                            <FormControl fullWidth size="small">
                              <Typography sx={{ fontWeight: "bold" }}>
                                Cash
                              </Typography>
                              <br />

                              <OutlinedInput
                                id="component-outlined"
                                type="text"
                                readOnly={true}
                                value={"Cash"}
                                onChange={(e) => { }}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {singlePay.paidthrough === "Bank Transfer" &&
                      singlePay.paidstatus === "Paid" && (
                        <>
                          <br />
                          <br />

                          <Grid item md={12} xs={8}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Bank Details
                            </Typography>
                          </Grid>

                          <br />
                          <br />

                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Bank Name</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.bankname}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Bank Branch Name</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.bankbranchname}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Account Holder Name</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.accountholdername}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Account Number</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.accountnumber}
                              />
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            md={4}
                            xs={12}
                            sm={12}
                            sx={{ display: "flex" }}
                          >
                            <FormControl fullWidth size="small">
                              <Typography>IFSC Code</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.ifsccode}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {singlePay.paidthrough === "UPI" &&
                      singlePay.paidstatus === "Paid" && (
                        <>
                          <Grid item md={12} xs={8}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              UPI Details
                            </Typography>
                          </Grid>

                          <br />
                          <br />

                          <Grid
                            item
                            md={3}
                            xs={12}
                            sm={12}
                            sx={{ display: "flex" }}
                          >
                            <FormControl fullWidth size="small">
                              <Typography>UPI Number</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.upinumber}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {singlePay.paidthrough === "Card" &&
                      singlePay.paidstatus === "Paid" && (
                        <>
                          <Grid md={12} item xs={8}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Card Details
                            </Typography>
                          </Grid>

                          <br />
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Card Number</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.cardnumber}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Card Holder Name</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.cardholdername}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Card Transaction Number</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.cardtransactionnumber}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Card Type</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.cardtype}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={6}>
                            <Typography>Expire At</Typography>
                            <Grid container spacing={1}>
                              <Grid item md={6} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <OutlinedInput
                                    readOnly={true}
                                    value={singlePay.cardmonth}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item md={6} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <OutlinedInput
                                    readOnly={true}
                                    value={singlePay.cardyear}
                                  />
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            md={3}
                            xs={12}
                            sm={12}
                            sx={{ display: "flex" }}
                          >
                            <FormControl fullWidth size="small">
                              <Typography>Security Code</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.cardsecuritycode}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {singlePay.paidthrough === "Cheque" &&
                      singlePay.paidstatus === "Paid" && (
                        <>
                          <Grid item md={12} xs={8}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Cheque Details
                            </Typography>
                          </Grid>

                          <br />

                          <Grid
                            item
                            md={3}
                            xs={12}
                            sm={12}
                            sx={{ display: "flex" }}
                          >
                            <FormControl fullWidth size="small">
                              <Typography>Cheque Number</Typography>
                              <OutlinedInput
                                readOnly={true}
                                value={singlePay.chequenumber}
                              />
                            </FormControl>
                          </Grid>
                        </>
                      )}
                  </>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography variant="h6">Attachments</Typography>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <br />
                    <Typography variant="h6">Bill </Typography>

                    <label htmlFor="file-inputuploadcreatefirst"></label>
                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {billdocs?.map((file, index) => (
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
                                  {/* {file.type.includes("image/") ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      height={50}
                                      style={{
                                        maxWidth: "-webkit-fill-available",
                                      }}
                                    />
                                  ) : ( */}
                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(file.name)}
                                    height="25"
                                    alt="file icon"
                                  />
                                  {/* )} */}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {file.name}{" "}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={2} xs={2}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    marginTop: "16px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                    }}
                                    onClick={() => {
                                      if (file.preview) {
                                        renderFilePreview(file)
                                      } else {
                                        renderFilePreviewMulterUploaded(file)
                                      }
                                    }
                                    }
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <br />
                    <Typography variant="h6">Receipt</Typography>

                    <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        {receiptDocs?.map((file, index) => (
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
                                  {/* {file.type.includes("image/") ? (
                                    <img
                                      src={file.preview}
                                      alt={file.name}
                                      height={50}
                                      style={{
                                        maxWidth: "-webkit-fill-available",
                                      }}
                                    />
                                  ) : ( */}
                                  <img
                                    className={classes.preview}
                                    src={getFileIcon(file.name)}
                                    height="25"
                                    alt="file icon"
                                  />
                                  {/* )} */}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={8}
                                sm={8}
                                xs={8}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {file.name}{" "}
                                </Typography>
                              </Grid>
                              <Grid item md={2} sm={2} xs={2}>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    marginTop: "16px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036", // theme.palette.primary.main
                                    },
                                  }}
                                >
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                    }}
                                    onClick={() => {
                                      if (file.preview) {
                                        renderFilePreview(file)
                                      } else {
                                        renderFilePreviewMulterUploaded(file)
                                      }
                                    }
                                    }
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                  <br /> <br />
                  <Grid item md={12} sm={12} xs={12}>
                    <br />
                    <br />
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                      }}
                    >
                      <Button variant="contained" onClick={handleViewClose} sx={buttonStyles.btncancel}>
                        {" "}
                        Back
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
      <Dialog
        open={openviewalertvendor}
        onClose={handleClickOpenviewalertvendor}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: "50px" }}
        fullWidth={true}
      >
        <VendorPopup
          setVendorAuto={setVendorAuto}
          handleCloseviewalertvendor={handleCloseviewalertvendor}
          sendDataToParent={sendDataToParent}
        />
      </Dialog>

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
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={totalProjectsData ?? []}
        filename={"SchedulePaymentBills"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Schedule Payment Bills Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleGroup}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delGroupcheckbox}
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
    </Box>
  );
}
export default AddOtherPayments;
