import { makeStyles } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
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
import VendorPopup from "../asset/VendorPopup";
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
    " Amount",
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
      pagename: String("Schedule Payment Bills"),
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
          saveAs(blob, "Schedule Payment Bills.png");
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
        // assignbranch: accessbranch,
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
      const today = moment();
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
      receiptdate: dueDate
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
  }, [vendorAuto]);

  useEffect(() => {
    fetchAllPayments();
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
    documentTitle: "Schedule Payment Bills",
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

  const sendRequest = async () => {
    setPageName(!pageName);
    // Get the current date and time
    const currentDate = new Date();
    const currentTimeString = currentDate.toLocaleTimeString([], {
      hour12: false,
    });
    const dateTimeString = `${newotherPaymnets.receiptdate} ${currentTimeString}`;
    try {
      let response = await axios.post(`${SERVICE.NEW_OTHERPAYMENTS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branchname: String(newotherPaymnets.branchname.value),
        company: String(newotherPaymnets.company),
        expensecategory: String(newotherPaymnets.expansecategory),
        expensesubcategory: String(newotherPaymnets.expansesubcategory),
        vendorgrouping: String(newotherPaymnets.vendorgrouping),
        purpose: String(newotherPaymnets.purpose),
        billno: String(newotherPaymnets.billno),
        vendor: String(newotherPaymnets.vendor.value),
        gstno: String(
          gstOptions.gstnumber == undefined ? "" : gstOptions.gstnumber
        ),
        billdate: String(newotherPaymnets.billdate),
        receiptdate: String(newotherPaymnets.receiptdate),
        dueamount: Number(newotherPaymnets.dueamount),
        accountholdername: String(
          gstOptions.accountholdername == undefined
            ? ""
            : gstOptions.accountholdername
        ),
        paymentfrequency: String(
          gstOptions.paymentfrequency == undefined
            ? ""
            : gstOptions.paymentfrequency
        ),
        bankname: String(
          gstOptions.bankname == undefined ? "" : gstOptions.bankname
        ),
        ifsccode: String(
          gstOptions.ifsccode == undefined ? "" : gstOptions.ifsccode
        ),
        paidthrough:
          newotherPaymnets.paidstatus === "Paid"
            ? String(newotherPaymnets.paidthrough.value)
            : "",
        paid: String(newotherPaymnets.paid.value),
        referenceno:
          newotherPaymnets.paidstatus === "Paid"
            ? String(newotherPaymnets.referenceno)
            : "",
        billsdocument: [...refDocuments],
        receiptdocument: [...refRecDocuments],
        paidstatus: String(newotherPaymnets.paidstatus),
        sortdate: String(
          newotherPaymnets.paidstatus === "Paid" ? dateTimeString : ""
        ),
        vendorfrequency: String(frequencyValue),
        vendorid: String(vendorId),
        source: "Scheduled Payment",

        bankname:
          newotherPaymnets.paidthrough.value === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.bankname)
            : "",
        bankbranchname:
          newotherPaymnets.paidthrough.value === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.bankbranchname)
            : "",
        accountholdername:
          newotherPaymnets.paidthrough.value === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.accountholdername)
            : "",
        accountnumber:
          newotherPaymnets.paidthrough.value === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.accountnumber)
            : "",
        ifsccode:
          newotherPaymnets.paidthrough.value === "Bank Transfer" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.ifsccode)
            : "",

        upinumber:
          newotherPaymnets.paidthrough.value === "UPI" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.upinumber)
            : "",

        cardnumber:
          newotherPaymnets.paidthrough.value === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardnumber)
            : "",
        cardholdername:
          newotherPaymnets.paidthrough.value === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardholdername)
            : "",
        cardtransactionnumber:
          newotherPaymnets.paidthrough.value === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardtransactionnumber)
            : "",
        cardtype:
          newotherPaymnets.paidthrough.value === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardtype)
            : "",
        cardmonth:
          newotherPaymnets.paidthrough.value === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardmonth)
            : "",
        cardyear:
          newotherPaymnets.paidthrough.value === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardyear)
            : "",
        cardsecuritycode:
          newotherPaymnets.paidthrough.value === "Card" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.cardsecuritycode)
            : "",

        chequenumber:
          newotherPaymnets.paidthrough.value === "Cheque" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String(vendor.chequenumber)
            : "",

        cash:
          newotherPaymnets.paidthrough.value === "Cash" &&
            newotherPaymnets.paidstatus === "Paid"
            ? String("Cash")
            : "",

        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setnewotherPaymnets({
        ...newotherPaymnets,
        branchname: {
          label: newotherPaymnets.branchname.label,
          value: newotherPaymnets.branchname.value,
        },
        headname: {
          label: newotherPaymnets.headname.label,
          value: newotherPaymnets.headname.value,
        },
        // purpose: "",
        billno: "",
        vendor: {
          label: newotherPaymnets.vendor.label,
          value: newotherPaymnets.vendor.value,
        },
        dueamount: "",
        accountholdername: "",
        paymentfrequency: "",
        bankname: "",
        ifsccode: "",
        billdate: formattedDate,
        receiptdate: formattedDate,
        paidthrough: {
          label: newotherPaymnets.paidthrough.label,
          value: newotherPaymnets.paidthrough.value,
        },
        paid: {
          label: newotherPaymnets.paid.label,
          value: newotherPaymnets.paid.value,
        },
        referenceno: "",
      });
      setrefDocuments([]);
      setRefRecDouments([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchAllPayments();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const handleSubmit = () => {
    if (newotherPaymnets?.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.branchname?.value === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.expansecategory === "Please Select Expense Category"
    ) {
      setPopupContentMalert("Please Select Expense Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.expansesubcategory ===
      "Please Select Expense Sub Category"
    ) {
      setPopupContentMalert("Please Select Expense Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.purpose === "Please Select Purpose") {
      setPopupContentMalert("Please Select Purpose!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.billno === "") {
      setPopupContentMalert("Please Enter Billno!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets.vendorgrouping === "" || !newotherPaymnets.vendorgrouping) {
      setPopupContentMalert("Please Select Vendor Grouping!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.vendor?.value === "Please Select Vendor") {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.billdate === "") {
      setPopupContentMalert("Please Select Bill Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets.receiptdate === "") {
      setPopupContentMalert("Please Select Due Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.dueamount === "") {
      setPopupContentMalert("Please Enter Dueamount!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.paidstatus === "Paid" &&
      newotherPaymnets?.paidthrough?.value === "Please Select Paidthrough"
    ) {
      setPopupContentMalert("Please Select Paid Through!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.paidstatus === "Paid" &&
      newotherPaymnets?.referenceno === ""
    ) {
      setPopupContentMalert("Please Enter Reference No!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (refDocuments.length === 0) {
      setPopupContentMalert("Please Upload Bills!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

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
    } else if (billdocs.length === 0) {
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

  // bill edit
  const handleInputChangedocumentEdit = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...billdocs];
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
          setBillDocs(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {

        setPopupContentMalert("Only Accept Documents!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  // bill edit delete
  const handleDeleteFileDocumentEdit = (index) => {
    const newSelectedFiles = [...billdocs];
    newSelectedFiles.splice(index, 1);
    setBillDocs(newSelectedFiles);
  };

  const handleInputChangedocumentRecEd = (event, index) => {
    const files = event.target.files;
    let newSelectedFiles = [...receiptDocs];
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
          setReceiptDocs(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {

        setPopupContentMalert("Only Accept Documents!");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
    }
  };

  const handleDeleteFileDocumentRefEd = (index) => {
    const newSelectedFiles = [...receiptDocs];
    newSelectedFiles.splice(index, 1);
    setReceiptDocs(newSelectedFiles);
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
    fetchAllPayments();
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
      setGroupCheck(false);
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
      }));

      setpayments(itemsWithSerialNumber);
      setTotalProjectsData(res?.data?.totalProjectsDatas?.length > 0 ?
        res?.data?.totalProjectsDatas?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          billdate: moment(item.billdate).format("DD-MM-YYYY"),
          receiptdate: moment(item.receiptdate).format("DD-MM-YYYY"),
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

      setGroupCheck(true);

    } catch (err) {
      setGroupCheck(true); handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }

  }

  //get all project.
  const fetchAllPayments = async () => {
    setPageName(!pageName);
    try {

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
      });

      const ans = res?.data?.result?.length > 0 ? res?.data?.result : [];
      const itemsWithSerialNumber = ans?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: (page - 1) * pageSize + index + 1,
        billdate: moment(item.billdate).format("DD-MM-YYYY"),
        receiptdate: moment(item.receiptdate).format("DD-MM-YYYY"),
      }));

      setpayments(itemsWithSerialNumber);
      setTotalProjectsData(res?.data?.totalProjectsDatas?.length > 0 ?
        res?.data?.totalProjectsDatas?.map((item, index) => ({
          ...item,
          id: item._id,
          serialNumber: (page - 1) * pageSize + index + 1,
          billdate: moment(item.billdate).format("DD-MM-YYYY"),
          receiptdate: moment(item.receiptdate).format("DD-MM-YYYY"),
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

      setGroupCheck(true);
    } catch (err) {
      setGroupCheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleEditOpen = () => {
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
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
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_OTHERPAYMENTS}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });


      await fetchVendorNewEdit({ value: res?.data?.sotherpayment?.vendor });
      setSinglePay({ ...res?.data?.sotherpayment });
      setBillDocs(res?.data?.sotherpayment?.billsdocument);
      setReceiptDocs(res?.data?.sotherpayment?.receiptdocument);
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
      setSinglePay(res?.data?.sotherpayment);
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
      await fetchAllPayments();
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

      await fetchAllPayments();
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
      let response = await axios.put(
        `${SERVICE.SINGLE_OTHERPAYMENTS}/${singlePay?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
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
          accountholdername: String(singlePay.accountholdername),
          paymentfrequency: String(singlePay.paymentfrequency),
          bankname: String(singlePay.bankname),
          ifsccode: String(singlePay.ifsccode),
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
          billsdocument: [...billdocs],
          receiptdocument: [...receiptDocs],
          vendorfrequency: String(frequencyValueEdit),
          vendorid: String(vendorIdEdit),
          source: "Scheduled Payment",
          paidstatus: String(singlePay.paidstatus),
          sortdate: String(
            singlePay.paidstatus === "Paid" ? dateTimeString : ""
          ),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchAllPayments();
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
          {isUserRoleCompare?.includes("eschedulepaymentbills") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dschedulepaymentbills") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vschedulepaymentbills") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeView(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ischedulepaymentbills") && (
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

  return (
    <Box>
      <PageHeading
        title="Schedule Payment Bills"
        modulename="Expenses"
        submodulename="Expense Setup"
        mainpagename="Schedule Payment Bills"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aschedulepaymentbills") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Add Schedule Payment Bills
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
                              i.label === item.label && i.value === item.value
                          ) === index
                        );
                      })}
                    styles={colourStyles}
                    value={{
                      label: newotherPaymnets.company,
                      value: newotherPaymnets.company,
                    }}
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
                        company: e.value,
                        branchname: {
                          label: "Please Select Branch",
                          value: "Please Select Branch",
                        },
                        vendorgrouping: "",
                        vendor: {
                          lable: "Please Select Vendor",
                          value: "Please Select Vendor",
                        },
                        duedate: "",
                      });
                      setBranchOptions([]);
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
                      ?.filter(
                        (comp) => newotherPaymnets.company === comp.company
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
                    value={{
                      label: newotherPaymnets?.branchname?.label,
                      value: newotherPaymnets?.branchname?.value,
                    }}
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
                        branchname: {
                          label: e.label,
                          value: e.value,
                        },
                        vendorgrouping: "",
                        duedate: "",
                        vendor: {
                          lable: "Please Select Vendor",
                          value: "Please Select Vendor",
                        },
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
                      label: newotherPaymnets?.expansecategory,
                      value: newotherPaymnets?.expansecategory,
                    }}
                    placeholder="Please  Select Category"
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
                        expansecategory: e.value,
                        expansesubcategory:
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
                          item.categoryname ===
                          newotherPaymnets?.expansecategory
                      )
                      .map((item) => {
                        return item.subcategoryname.map((subCatName) => ({
                          label: subCatName,
                          value: subCatName,
                        }));
                      })
                      .flat()}
                    value={{
                      label: newotherPaymnets?.expansesubcategory,
                      value: newotherPaymnets?.expansesubcategory,
                    }}
                    placeholder="Please Select Sub Category"
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
                        expansesubcategory: e.value,
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
                    options={purposes}
                    styles={colourStyles}
                    value={{
                      label: newotherPaymnets.purpose,
                      value: newotherPaymnets.purpose,
                    }}
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
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
                    value={newotherPaymnets.billno}
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
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
                      label: !newotherPaymnets.vendorgrouping ? "Please Select Vendor Grouping" : newotherPaymnets.vendorgrouping,
                      value: !newotherPaymnets.vendorgrouping ? "Please Select Vendor Grouping" : newotherPaymnets.vendorgrouping,
                    }}
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
                        vendorgrouping: e.value,
                        vendor: {
                          lable: "Please Select Vendor",
                          value: "Please Select Vendor",
                        },
                        vendorfrequency: "",
                        duedate: "",
                        paidmode: "Please Select Paid Mode",
                      });
                      setGroupedVendorNames(vendorGrouping?.filter(item => item.name === e.value)?.map(data => data?.vendor));
                      setFrequencyValue("");
                      setVendorId("");
                      setVendorModeOfPayments("");
                    }}
                  />
                </FormControl>
              </Grid>
              {/* next grdi */}
              <>
                <Grid item md={2.5} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={vendorOptions?.filter(data =>
                        groupedVendorNames?.includes?.(data?.value)
                      )}
                      value={{
                        label: newotherPaymnets?.vendor?.label,
                        value: newotherPaymnets?.vendor?.value,
                      }}
                      onChange={(e) => {
                        // setnewotherPaymnets({
                        //   ...newotherPaymnets,
                        //   vendor: {
                        //     label: e.label,
                        //     value: e.value,
                        //   },
                        // });
                        // fetchGstNo(e);
                        setGstOptions(e);
                        setFrequencyValue(e.paymentfrequency);
                        setVendorModeOfPayments(e?.modeofpayments);
                        setVendorId(e._id);
                        setVendorNew((prev) => ({
                          ...prev,
                          ...e,
                        }));

                        setDueDate(e)
                        // fetchVendorNew(e);
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
                      value={
                        Object.keys(gstOptions).length === 0
                          ? " "
                          : gstOptions.gstnumber
                      }
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
                      // placeholder="Please Enter Frequency"
                      value={frequencyValue}
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
                      value={newotherPaymnets.billdate}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          billdate: e.target.value,
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
                      value={newotherPaymnets.receiptdate}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          receiptdate: e.target.value,
                        });
                      }}
                      inputProps={{
                        min: newotherPaymnets.billdate,
                        // max: today
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
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
                      value={newotherPaymnets.dueamount}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          dueamount: e.target.value,
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
                        label: newotherPaymnets.paidstatus,
                        value: newotherPaymnets.paidstatus,
                      }}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          paidstatus: e.value,
                          paidthrough: {
                            label: "Please Select Paidthrough",
                            value: "Please Select Paidthrough",
                          },
                          referenceno: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Paid Through<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={paidOpt?.filter((data) =>
                            vendorModeOfPayments?.includes(data?.label)
                          )}
                          value={{
                            label: newotherPaymnets?.paidthrough?.label,
                            value: newotherPaymnets?.paidthrough?.value,
                          }}
                          onChange={(e) => {
                            setnewotherPaymnets({
                              ...newotherPaymnets,
                              paidthrough: {
                                label: e.label,
                                value: e.value,
                              },
                            });
                          }}
                        />
                      </FormControl>
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
                          value={newotherPaymnets.referenceno}
                          onChange={(e) => {
                            setnewotherPaymnets({
                              ...newotherPaymnets,
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
              <Grid item md={12} sm={12} xs={12} sx={{ display: "flex" }}>
                <Grid>
                  <Typography variant="h6">
                    Bill<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <input
                    className={classes.inputs}
                    type="file"
                    id="file-inputuploadcreatefirstedit"
                    accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip, .png , .jpg , "
                    multiple
                    onChange={handleInputChangedocument}
                  />
                  <label htmlFor="file-inputuploadcreatefirstedit">
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
                </Grid>
                &emsp;
                <Grid>
                  <Typography variant="h6">Receipt</Typography>
                  <input
                    className={classes.inputs}
                    type="file"
                    id="file-inputuploadedit"
                    accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip, .png , .jpg , "
                    multiple
                    onChange={handleInputChangedocumentRec}
                  />
                  <label htmlFor="file-inputuploadedit">
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
                </Grid>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refDocuments?.map((file, index) => (
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
                                <img
                                  className={classes.preview}
                                  src={getFileIcon(file.name)}
                                  height="25"
                                  alt="file icon"
                                />
                              )}
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
                          <Grid item md={1} sm={1} xs={1}>
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
                                onClick={() => renderFilePreview(file)}
                              />
                            </Button>
                          </Grid>
                          <Grid item md={1} sm={1} xs={1}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handleDeleteFileDocument(index)}
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

                <Grid container>
                  <Grid item md={12} sm={12} xs={12}>
                    {refRecDocuments?.map((file, index) => (
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
                                <img
                                  className={classes.preview}
                                  src={getFileIcon(file.name)}
                                  height="25"
                                  alt="file icon"
                                />
                              )}
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
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036", // theme.palette.primary.main
                                },
                              }}
                              onClick={() => handleDeleteFileDocumentRef(index)}
                            >
                              <FaTrash
                                style={{ fontSize: "medium", color: "#a73131" }}
                              />
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              {newotherPaymnets.paidthrough.value === "Cash" &&
                newotherPaymnets.paidstatus === "Paid" && (
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

              {newotherPaymnets.paidthrough.value === "Bank Transfer" &&
                newotherPaymnets.paidstatus === "Paid" && (
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
                          value={vendor.bankname}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Bank Branch Name</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.bankbranchname}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Account Holder Name</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.accountholdername}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Account Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.accountnumber}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>IFSC Code</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.ifsccode}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

              {newotherPaymnets.paidthrough.value === "UPI" &&
                newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <br />
                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        UPI Details
                      </Typography>
                    </Grid>

                    <br />
                    <br />

                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>UPI Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.upinumber}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

              {newotherPaymnets.paidthrough.value === "Card" &&
                newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <br /> <br />
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
                          value={vendor.cardnumber}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Card Holder Name</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardholdername}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Card Transaction Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardtransactionnumber}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Card Type</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardtype}
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
                              value={vendor.cardmonth}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} xs={12} sm={6}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              readOnly={true}
                              value={vendor.cardyear}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Security Code</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.cardsecuritycode}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

              {newotherPaymnets.paidthrough.value === "Cheque" &&
                newotherPaymnets.paidstatus === "Paid" && (
                  <>
                    <br />
                    <br />

                    <Grid item md={12} xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cheque Details
                      </Typography>
                    </Grid>

                    <br />

                    <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Cheque Number</Typography>
                        <OutlinedInput
                          readOnly={true}
                          value={vendor.chequenumber}
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
                      onClick={handleSubmit}
                      sx={buttonStyles.buttonsubmit}
                    >
                      {" "}
                      SAVE
                    </Button>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      {" "}
                      CLEAR
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
          </Box>
          <br />
          <br />
        </>
      )}
      <Box>
        <Headtitle title={"Schedule Payment Bills"} />
        {/* ****** Header Content ****** */}
        {isUserRoleCompare?.includes("lschedulepaymentbills") && (
          <>
            <br />
            {/* ****** Table Start ****** */}

            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Schedule Payment Bills List
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
                      "excelschedulepaymentbills"
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
                    {isUserRoleCompare?.includes("csvschedulepaymentbills") && (
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
                      "printschedulepaymentbills"
                    ) && (
                        <>
                          <Button sx={userStyle.buttongrp} onClick={handleprint}>
                            &ensp;
                            <FaPrint />
                            &ensp;Print&ensp;
                          </Button>
                        </>
                      )}
                    {isUserRoleCompare?.includes("pdfschedulepaymentbills") && (
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
                      "imageschedulepaymentbills"
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
              {isUserRoleCompare?.includes("bdschedulepaymentbills") && (
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
              {!groupCheck ? (
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
                        fetchAllPayments();
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
                            label: !singlePay?.vendor ? "Please Select Vendor" : singlePay?.vendor,
                            value: !singlePay?.vendor ? "Please Select Vendor" : singlePay?.vendor,
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
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {singlePay.paidstatus === "Paid" && (
                      <>
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
                                    <img
                                      className={classes.preview}
                                      src={getFileIcon(file.name)}
                                      height="25"
                                      alt="file icon"
                                    />
                                  )}
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
                                    onClick={() => renderFilePreview(file)}
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
                                    <img
                                      className={classes.preview}
                                      src={getFileIcon(file.name)}
                                      height="25"
                                      alt="file icon"
                                    />
                                  )}
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
                                    onClick={() => renderFilePreview(file)}
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
                        value={singlePay?.expensecategory}
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
                    <input
                      className={classes.inputs}
                      type="file"
                      id="file-inputuploadcreatefirst"
                      accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip"
                      multiple
                      onChange={(e) => {
                        handleInputChangedocumentEdit(e);
                      }}
                    />
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
                                    <img
                                      className={classes.preview}
                                      src={getFileIcon(file.name)}
                                      height="25"
                                      alt="file icon"
                                    />
                                  )}
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
                                    onClick={() => renderFilePreview(file)}
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
                      accept=".pdf, .doc, .docx, .txt, .xls, .xlsx, .zip"
                      multiple
                      onChange={(e) => {
                        handleInputChangedocumentRecEd(e);
                      }}
                    />
                    <label htmlFor="file-inputupload"></label>
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
                                    <img
                                      className={classes.preview}
                                      src={getFileIcon(file.name)}
                                      height="25"
                                      alt="file icon"
                                    />
                                  )}
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
                                    onClick={() => renderFilePreview(file)}
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
