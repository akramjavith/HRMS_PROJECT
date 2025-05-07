import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
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
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEdit, FaFilePdf, FaPlus, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import {
  daysOptions,
  frequencyOption,
} from "../../components/Componentkeyword";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import VendorPopup from "../account/vendorpop";
import domtoimage from 'dom-to-image';
import { FaFileCsv, FaFileExcel } from "react-icons/fa";

import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";

import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";

function SchedulePaymentMaster() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setIsBtn(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
    setIsBtn(false);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  let exportColumnNames = [
    "Status",
    "Comapny",
    "Branch",
    "Expense Category",
    "Expense SubCategory",
    "Purpose",
    "Vendor",
    "Frequency",
    "DueDays",
  ];
  let exportRowValues = [
    "status",
    "company",
    "branch",
    "expensecategory",
    "expensesubcategory",
    "purpose",
    "vendor",
    "frequency",
    "duedays",
  ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

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

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");

  const navigate = useNavigate();
  const [payments, setpayments] = useState([]);
  const [paymentsEdit, setpaymentsEdit] = useState([]);
  const [vendorAuto, setVendorAuto] = useState(""); const [sasassendDataToParent, sendDataToParent] = useState("")
  const handleCloseviewalertvendor = () => {
    setOpenviewalertvendro(false);
  };
  const statusOption = [
    { label: "Active", value: "Active" },
    { label: "In Active", value: "In Active" },
  ];
  const handleClickOpenviewalertvendor = () => {
    setOpenviewalertvendro(true);
  };

  const [openviewalertvendor, setOpenviewalertvendro] = useState(false);

  // Get the current date and format it as "YYYY-MM-DD"
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;


  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Schedule Payment Master.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };
  //weekdays multiselect
  const [selectedOptionsDays, setSelectedOptionsDays] = useState([]);
  let [valueDaysCat, setValueDaysCat] = useState([]);
  const [selectedDaysOptionsCateEdit, setSelectedDaysOptionsCateEdit] =
    useState([]);
  const [DaysValueCateEdit, setDaysValueCateEdit] = useState([]);

  const handleDaysChange = (options) => {
    setValueDaysCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDays(options);
  };

  const customValueRendererDays = (valueDaysCat, _categoryname) => {
    return valueDaysCat?.length
      ? valueDaysCat.map(({ label }) => label)?.join(", ")
      : "Please Select Days";
  };

  const handleDaysChangeEdit = (options) => {
    setDaysValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDaysOptionsCateEdit(options);
  };
  const customValueRendererDaysEdit = (DaysValueCateEdit, _employeename) => {
    return DaysValueCateEdit?.length
      ? DaysValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Days";
  };
  const [vendorId, setVendorId] = useState("");
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

  const [newotherPaymnets, setnewotherPaymnets] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    purpose: "Please Select Purpose",
    billno: "",
    vendor: "Please Select Vendor",
    vendorgrouping: "",
    dueamount: "",
    accountholdername: "",
    paymentfrequency: "",
    bankname: "",
    ifsccode: "",
    gstno: "",
    status: "Active",
    receiptdate: formattedDate,
    referenceno: "",
    paidstatus: "Not Paid",
    expansecategory: "Please Select Expense Category",
    expansesubcategory: "Please Select Expense Sub Category",
    frequency: "Please Select Frequency",
    monthdate: "",
    annuallymonth: "",
    annuallyday: "",
    duedays: "",
  });
  const [groupCheck, setGroupCheck] = useState(false);

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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    actions: true,
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    expensecategory: true,
    expensesubcategory: true,
    purpose: true,
    vendor: true,
    frequency: true,
    status: true,
    duedays: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Excel
  const fileName = "Schedule Payment Master";

  useEffect(() => {
    fetchPurposeDropdowns();
    fetchExpenseCate();
  }, []);

  useEffect(() => {
    fetchVendor();
    fetchVendorGrouping();
  }, [vendorAuto]);

  useEffect(() => {
    fetchAllPayments();
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
    documentTitle: "Schedule Payment Master",
    pageStyle: "print",
  });

  const { auth } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [vendorOptions, setVendorOptions] = useState([]);

  const [purposes, setPurposes] = useState([]);
  const [purposesEdit, setPurposesEdit] = useState([]);

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
      setVendorOptions(
        response.data.vendordetails?.filter(item => item.vendorstatus === "Active")?.map((data) => ({
          ...data,
          label: data.vendorname,
          value: data.vendorname,
        }))
      );
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
      checkUsedByOtherBulk();
      // setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  const handleClear = () => {
    setnewotherPaymnets({
      ...newotherPaymnets,
      company: "Please Select Company",
      branch: "Please Select Branch",
      purpose: "Please Select Purpose",
      billno: "",
      vendor: "Please Select Vendor",
      vendorgrouping: "",
      dueamount: "",
      accountholdername: "",
      paymentfrequency: "",
      bankname: "",
      ifsccode: "",
      gstno: "",
      status: "Active",
      receiptdate: formattedDate,
      referenceno: "",
      paidstatus: "Not Paid",
      expansecategory: "Please Select Expense Category",
      expansesubcategory: "Please Select Expense Sub Category",
      frequency: "Please Select Frequency",
      monthdate: "",
      annuallymonth: "",
      annuallyday: "",
      duedays: "",
    });

    setValueDaysCat([]);
    setSelectedOptionsDays([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  const [isBtn, setIsBtn] = useState(false);
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      setIsBtn(true)
      await axios.post(`${SERVICE.NEW_SCHEDULEPAYMENTMASTER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(newotherPaymnets.company),

        branch: String(newotherPaymnets.branch),
        expensecategory: String(newotherPaymnets.expansecategory),
        expensesubcategory: String(newotherPaymnets.expansesubcategory),
        purpose: String(newotherPaymnets.purpose),
        vendor: String(newotherPaymnets.vendor),
        vendorgrouping: String(newotherPaymnets.vendorgrouping),
        gstno: String(newotherPaymnets.gstno),
        status: String(newotherPaymnets.status),
        frequency: String(newotherPaymnets.frequency),

        daywiseandweeklydays: valueDaysCat,
        datewiseandmonthlydate: String(newotherPaymnets.monthdate),
        annuallymonth: String(newotherPaymnets.annuallymonth),
        annuallyday: String(newotherPaymnets.annuallyday),

        vendorid: String(vendorId),

        duedays: String(newotherPaymnets.duedays),

        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],

        statuslog: [
          {
            company: String(newotherPaymnets.company),
            branch: String(newotherPaymnets.branch),
            expensecategory: String(newotherPaymnets.expansecategory),
            expensesubcategory: String(newotherPaymnets.expansesubcategory),
            purpose: String(newotherPaymnets.purpose),
            vendor: String(newotherPaymnets.vendor),
            gstno: String(newotherPaymnets.gstno),
            status: String(newotherPaymnets.status),
            frequency: String(newotherPaymnets.frequency),

            daywiseandweeklydays: valueDaysCat,
            datewiseandmonthlydate: String(newotherPaymnets.monthdate),
            annuallymonth: String(newotherPaymnets.annuallymonth),
            annuallyday: String(newotherPaymnets.annuallyday),

            vendorid: String(vendorId),

            duedays: String(newotherPaymnets.duedays),

            logchangedby: [
              {
                name: String(isUserRoleAccess.companyname),
                date: String(new Date()),
              },
            ],
          },
        ],
      });
      setnewotherPaymnets({
        ...newotherPaymnets,
        company: "Please Select Company",
        branch: "Please Select Branch",
        purpose: "Please Select Purpose",
        billno: "",
        vendor: "Please Select Vendor",
        vendorgrouping: "",
        dueamount: "",
        accountholdername: "",
        paymentfrequency: "",
        bankname: "",
        ifsccode: "",
        gstno: "",
        status: "Active",
        receiptdate: formattedDate,
        referenceno: "",
        paidstatus: "Not Paid",
        expansecategory: "Please Select Expense Category",
        expansesubcategory: "Please Select Expense Sub Category",
        frequency: "Please Select Frequency",
        monthdate: "",
        annuallymonth: "",
        annuallyday: "",
        duedays: "",
      });
      setGroupedVendorNames([]);
      setValueDaysCat([]);
      setSelectedOptionsDays([]);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchAllPayments();
      setIsBtn(false)
    } catch (err) {
      setIsBtn(false)
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const handleSubmit = () => {
    const isNameMatch = payments.some(
      (item) =>
        item.company === newotherPaymnets.company &&
        item.branch === newotherPaymnets.branch &&
        item.expensecategory === newotherPaymnets.expansecategory &&
        item.expensesubcategory === newotherPaymnets.expansesubcategory &&
        item.purpose == newotherPaymnets.purpose &&
        item.frequency == newotherPaymnets.frequency &&
        item.vendor === newotherPaymnets.vendor
    );
    if (newotherPaymnets?.company === "Please Select Company") {
      setPopupContentMalert("Please  Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.branch === "Please Select Branch") {
      setPopupContentMalert("Please  Select Branch!");
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
    }
    else if (newotherPaymnets.vendorgrouping === "" || !newotherPaymnets.vendorgrouping) {
      setPopupContentMalert("Please Select Vendor Grouping!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (newotherPaymnets?.vendor === "Please Select Vendor") {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (newotherPaymnets?.frequency === "Please Select Frequency") {
      setPopupContentMalert("Please Select Frequency!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (newotherPaymnets?.frequency === "Day Wise" ||
        newotherPaymnets?.frequency === "Weekly") &&
      valueDaysCat?.length === 0
    ) {
      setPopupContentMalert("Please Select Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (newotherPaymnets?.frequency === "Date Wise" ||
        newotherPaymnets?.frequency === "Monthly") &&
      newotherPaymnets?.monthdate === ""
    ) {
      setPopupContentMalert("Please Select Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.frequency === "Annually" &&
      newotherPaymnets?.annuallymonth === ""
    ) {
      setPopupContentMalert("Please Select Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      newotherPaymnets?.frequency === "Annually" &&
      newotherPaymnets?.annuallyday === ""
    ) {
      setPopupContentMalert("Please Select Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.status === "") {
      setPopupContentMalert("Please Select Status!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newotherPaymnets?.duedays === "") {
      setPopupContentMalert("Please Enter Due Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleSubmitEdit = async () => {
    const isNameMatch = paymentsEdit?.some(
      (item) =>
        item.company === singlePay.company &&
        item.branch === singlePay.branch &&
        item.expensecategory === singlePay.expensecategory &&
        item.expensesubcategory === singlePay.expensesubcategory &&
        item.purpose == singlePay.purpose &&
        item.frequency == singlePay.frequency &&
        item.vendor === singlePay.vendor
    );
    if (
      singlePay?.company === "Please Select Comapny" ||
      singlePay?.company === "" ||
      singlePay?.company == undefined
    ) {
      setPopupContentMalert("Please  Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.branch === "Please Select Branch" ||
      singlePay?.branch === ""
    ) {
      setPopupContentMalert("Please  Select Branch!");
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
    else if (singlePay?.frequency === "Please Select Frequency") {
      setPopupContentMalert("Please Select Frequency!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (singlePay?.frequency === "Day Wise" ||
        singlePay?.frequency === "Weekly") &&
      DaysValueCateEdit?.length === 0
    ) {
      setPopupContentMalert("Please Select Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      (singlePay?.frequency === "Date Wise" ||
        singlePay?.frequency === "Monthly") &&
      singlePay?.datewiseandmonthlydate === ""
    ) {
      setPopupContentMalert("Please Select Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.frequency === "Annually" &&
      singlePay?.annuallymonth === ""
    ) {
      setPopupContentMalert("Please Select Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      singlePay?.frequency === "Annually" &&
      singlePay?.annuallyday === ""
    ) {
      setPopupContentMalert("Please Select Day!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singlePay?.duedays === "") {
      setPopupContentMalert("Please Enter Due Days!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {

      if (
        oldData.company !== singlePay.company ||
        oldData.branch !== singlePay.branch ||
        oldData.purpose !== singlePay.purpose ||
        oldData.vendor !== singlePay.vendor ||
        oldData.expensecategory !== singlePay.expensecategory ||
        oldData.expensesubcategory !== singlePay.expensesubcategory ||
        oldData.frequency !== singlePay.frequency ||
        oldData.duedays !== singlePay.duedays
      ) {
        const [resNew] = await Promise.all([

          axios.post(SERVICE.SCHEDULE_PAYMENT_MASTER_OVERALL_EDIT, {
            combinedData: [{
              company: oldData.company,
              branch: oldData.branch,
              purpose: oldData.purpose,
              vendor: oldData.vendor,
              expensecategory: oldData.expensecategory,
              expensesubcategory: oldData.expensesubcategory,
              frequency: oldData.frequency,
              duedays: oldData.duedays,
            }]
          })
        ]);
        let isOpen = resNew.data.exist;
        if (isOpen) {

          setShowAlertNew(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`${resNew.data.message},Do you want to update?`}</p>
            </>
          );
          handleClickOpenerrNew();;
        } else {
          sendRequestEdit();
        }
      } else {
        sendRequestEdit();
      }
    }
  };

  //get all project.
  const fetchAllPayments = async () => {
    setPageName(!pageName);
    try {
      let res_grp = await axios.post(
        SERVICE.ALL_SCHEDULEPAYMENTMASTER,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setpayments(
        res_grp?.data?.schedulepaymentmaster?.map((data, index) => ({
          ...data,
          id: data._id,
          serialNumber: index + 1,
          duedays: `${data?.duedays} Days`,
          daywiseandweeklydays: data.daywiseandweeklydays
            ?.map((t, i) => `${i + 1 + ". "}` + t)
            .toString(),
        }))
      );
      setGroupCheck(true);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all project.
  const fetchAllPaymentsEditCheck = async (e) => {
    setPageName(!pageName);
    try {
      let res_grp = await axios.post(
        SERVICE.ALL_SCHEDULEPAYMENTMASTER,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setpaymentsEdit([
        ...res_grp?.data?.schedulepaymentmaster.filter(
          (item) => item._id !== e
        ),
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

  const [openEdit, setOpenEdit] = useState(false);
  const handleEditOpen = () => {
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  };

  //status dialog

  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => {
    setStatusOpen(true);
  };
  const handleStatusClose = () => {
    setStatusOpen(false);
  };

  const [singlePay, setSinglePay] = useState({});
  const [groupedVendorNames, setGroupedVendorNames] = useState([]);
  const [groupedVendorNamesEdit, setGroupedVendorNamesEdit] = useState([]);
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
  const [oldData, setOldData] = useState({})
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      handleEditOpen();
      setOldData(res.data.sschedulepaymentmaster);
      setSinglePay({ ...res.data.sschedulepaymentmaster });
      setVendorIdEdit(res?.data?.sschedulepaymentmaster.vendorid);
      setGroupedVendorNamesEdit(vendorGrouping?.filter(item => item.name === res?.data?.sotherpayment?.vendorgrouping)?.map(data => data?.vendor));
      setDaysValueCateEdit(
        res?.data?.sschedulepaymentmaster?.daywiseandweeklydays
      );
      setSelectedDaysOptionsCateEdit([
        ...res?.data?.sschedulepaymentmaster?.daywiseandweeklydays?.map(
          (t) => ({
            label: t,
            value: t,
          })
        ),
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
  //get single row to edit....
  const getCodeStatus = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setSinglePay({ ...res.data.sschedulepaymentmaster });
      setVendorIdEdit(res?.data?.sschedulepaymentmaster.vendorid);

      setDaysValueCateEdit(
        res?.data?.sschedulepaymentmaster?.daywiseandweeklydays
      );
      setSelectedDaysOptionsCateEdit([
        ...res?.data?.sschedulepaymentmaster?.daywiseandweeklydays?.map(
          (t) => ({
            label: t,
            value: t,
          })
        ),
      ]);
      handleStatusOpen();
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
      let res = await axios.get(
        `${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      handleViewOpen();
      setSinglePay(res?.data?.sschedulepaymentmaster);
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
      let res = await axios.get(
        `${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${e}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setSinglePay(res?.data?.sschedulepaymentmaster);
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

  const [deleteGroup, setDeletegroup] = useState("");
  const checkUsedByOtherBulk = async (data) => {
    let collectedDatas = selectedRows.map((item) => {
      return rowDataTable.find((data) => data.id === item)
    }).map((item) => {


      let combinedData = {
        company: item.company,
        branch: item.branch,
        purpose: item.purpose,
        vendor: item.vendor,
        expensecategory: item.expensecategory,
        expensesubcategory: item.expensesubcategory,
        id: item.id
      }

      return combinedData;
    })

    try {
      let res = await axios.post(SERVICE.SCHEDULE_PAYMENT_MASTER_OVERALL_DELETE, {
        combinedData: collectedDatas
      })
      const uniqueData = Array.from(new Map(res?.data?.matchedConditions?.map(item => [item?.id, item])).values());
      if (res.data.exists) {
        if (uniqueData.length === selectedRows.length) {
          setPopupContentMalert(`All the Selected ${res.data.popupMessage}`);
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          setSelectAllChecked(false);
        } else {
          // setPopupContentMalert(`Some of the Data's are used in ${res.data.popupMessage}`);
          // setPopupSeverityMalert("info");
          // handleClickOpenPopupMalert();
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Some of the Data's are used in ${res.data.popupMessage}`}</p>
            </>
          );
          handleClickOpenerr();
          setSelectAllChecked(false);
        }

        setSelectedRows((prev) => {
          return prev.filter((item) => !res.data.matchedConditions.some((data) => data.id === item))
        })
      } else {
        setIsDeleteOpencheckbox(true);
      }
    } catch (err) {
      console.log(err)
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }
  const checkUsedByOther = async (data) => {

    let combinedData = [{
      company: data?.company,
      branch: data?.branch,
      purpose: data?.purpose,
      vendor: data?.vendor,
      expensecategory: data?.expensecategory,
      expensesubcategory: data?.expensesubcategory,
      id: data.id
    }]

    try {
      let res = await axios.post(SERVICE.SCHEDULE_PAYMENT_MASTER_OVERALL_DELETE, {
        combinedData
      })
      if (res.data.exists) {
        setPopupContentMalert(`${res.data.popupMessage}`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        handleClickOpen();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }
  const rowData = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(
        `${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setDeletegroup(res?.data?.sschedulepaymentmaster);
      // handleClickOpen();
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
      await axios.delete(
        `${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${groupEditt}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
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
        return axios.delete(`${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseerr();
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
  const [showAlertNew, setShowAlertNew] = useState();
  const [isErrorOpenNew, setIsErrorOpenNew] = useState(false);
  const handleClickOpenerrNew = () => {
    setIsErrorOpenNew(true);
  };
  const handleCloseerrNew = () => {
    setIsErrorOpenNew(false);
  };
  const sendRequestEdit = async (e) => {
    setPageName(!pageName);
    try {
      await axios.put(
        `${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${singlePay?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(singlePay.company),
          branch:
            singlePay.branch === String(singlePay.branch)
              ? String(singlePay.branch)
              : String(singlePay?.branch?.value),
          expensecategory: String(singlePay?.expensecategory),
          expensesubcategory: String(singlePay?.expensesubcategory),
          purpose: String(singlePay.purpose),
          vendor: String(singlePay.vendor),
          vendorgrouping: String(singlePay.vendorgrouping),
          gstno: String(singlePay.gstno),

          vendorid: String(vendorIdEdit),

          frequency: String(singlePay.frequency),
          duedays: String(singlePay.duedays),

          daywiseandweeklydays: DaysValueCateEdit,
          datewiseandmonthlydate: String(singlePay.datewiseandmonthlydate),
          annuallymonth: String(singlePay.annuallymonth),
          annuallyday: String(singlePay.annuallyday),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );

      let categoryUpdate = await axios.post(SERVICE.SCHEDULE_PAYMENT_MASTER_OVERALL_UPDATE, {
        combinedData: {
          newcompany: singlePay?.company,
          newbranch: singlePay?.branch,
          newpurpose: singlePay?.purpose,
          newvendor: singlePay?.vendor,
          newexpensecategory: singlePay?.expensecategory,
          newexpensesubcategory: singlePay?.expensesubcategory,
          newfrequency: String(singlePay.frequency),
          newduedays: String(singlePay.duedays),

          oldcompany: oldData?.company,
          oldbranch: oldData?.branch,
          oldpurpose: oldData?.purpose,
          oldvendor: oldData?.vendor,
          oldexpensecategory: oldData?.expensecategory,
          oldexpensesubcategory: oldData?.expensesubcategory,
          oldfrequency: oldData?.frequency,
          oldduedays: oldData?.duedays,

          daywiseandweeklydays: DaysValueCateEdit,
          datewiseandmonthlydate: singlePay.datewiseandmonthlydate,
          annuallymonth: singlePay.annuallymonth,
          annuallyday: singlePay.annuallyday,
        }
      })
      handleCloseerrNew()
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
  const editStatus = async (e) => {
    setPageName(!pageName);
    try {
      await axios.put(
        `${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${singlePay?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: String(singlePay.status),

          statuslog: [
            ...singlePay?.statuslog,
            {
              company: String(singlePay?.company),
              branch:
                singlePay.branch === String(singlePay?.branch)
                  ? String(singlePay?.branch)
                  : String(singlePay?.branch?.value),
              expensecategory: String(singlePay?.expensecategory),
              expensesubcategory: String(singlePay?.expensesubcategory),
              purpose: String(singlePay?.purpose),
              vendor: String(singlePay?.vendor),
              vendorgrouping: String(singlePay?.vendorgrouping),

              gstno: String(singlePay?.gstno),

              vendorid: String(vendorIdEdit),

              frequency: String(singlePay?.frequency),
              status: String(singlePay?.status),
              daywiseandweeklydays: DaysValueCateEdit,
              datewiseandmonthlydate: String(singlePay?.datewiseandmonthlydate),
              annuallymonth: String(singlePay?.annuallymonth),
              annuallyday: String(singlePay?.annuallyday),
              duedays: String(singlePay.duedays),
              logchangedby: [
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            },
          ],
        }
      );
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchAllPayments();
      handleStatusClose();
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

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(payments);
  }, [payments]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

  // / Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
      cellRenderer: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            background:
              params.data.status === "Active"
                ? "green"
                : params.data.status === "In Active"
                  ? "red"
                  : "brown",
            color: "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
            cursor: "default",
          }}
        >
          {params.data.status}
        </Button>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 130,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
      //lockPinned: true,
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
      field: "purpose",
      headerName: "Purpose",
      flex: 0,
      width: 150,
      hide: !columnVisibility.purpose,
      headerClassName: "bold-header",
    },
    {
      field: "vendor",
      headerName: "Vendor",
      flex: 0,
      width: 130,
      hide: !columnVisibility.vendor,
      headerClassName: "bold-header",
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 0,
      width: 130,
      hide: !columnVisibility.frequency,
      headerClassName: "bold-header",
    },
    {
      field: "duedays",
      headerName: "Due Days",
      flex: 0,
      width: 100,
      hide: !columnVisibility.duedays,
      headerClassName: "bold-header",
    },
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
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eschedulepaymentmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
                fetchAllPaymentsEditCheck(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dschedulepaymentmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
                checkUsedByOther(params?.data)
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vschedulepaymentmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeView(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ischedulepaymentmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {

                getCodeInfo(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vschedulepaymentmaster") && (
            <Button
              variant="contained"
              style={{
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={(e) => {
                navigate(
                  `/expense/schedulepaymentmasterlog/${params?.data?.id}`
                );
              }}
            >
              <MenuIcon style={{ fontsize: "small" }} />
            </Button>
          )}
          &nbsp;&nbsp;
          {isUserRoleCompare?.includes("eschedulepaymentmaster") && (
            <Button
              variant="contained"
              style={{
                backgroundColor: "red",
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={(e) => {
                getCodeStatus(params.data.id);
              }}
            >
              <FaEdit style={{ color: "white", fontSize: "17px" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item) => {
    return {
      id: item.id,
      serialNumber: item?.serialNumber,
      company: item.company,
      branch: item.branch,
      purpose: item.purpose,
      vendor: item.vendor,
      status: item.status,
      expensecategory: item?.expensecategory,
      expensesubcategory: item?.expensesubcategory,
      frequency: item.frequency,
      daywiseandweeklydays: item.daywiseandweeklydays,
      datewiseandmonthlydate: item.datewiseandmonthlydate,
      annuallymonth: item.annuallymonth,
      annuallyday: item.annuallyday,
      duedays: item?.duedays,
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
  useEffect(() => {
    getapi();
    fetchVendorGrouping();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Schedule Payment Master"),
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
  return (
    <Box>
      <PageHeading
        title="Schedule Payment Master"
        modulename="Expenses"
        submodulename="Payment"
        mainpagename="Schedule Payment Master"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aschedulepaymentmaster") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.HeaderText}>
                  Add Schedule Payment Master
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
                        branch: "Please Select Branch",
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
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
                      label: newotherPaymnets?.branch,
                      value: newotherPaymnets?.branch,
                    }}
                    onChange={(e) => {
                      setnewotherPaymnets({
                        ...newotherPaymnets,
                        branch: e.value,
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
                        vendor: "Please Select Vendor",
                        vendorfrequency: "",
                        duedate: "",
                        paidmode: "Please Select Paid Mode",
                      });
                      setGroupedVendorNames(vendorGrouping?.filter(item => item.name === e.value)?.map(data => data?.vendor));
                      setVendorId("");
                    }}
                  />
                </FormControl>
              </Grid>
              {/* next grdi */}
              <>
                <Grid item md={2.5} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={vendorOptions?.filter(data =>
                        groupedVendorNames?.includes?.(data?.value)
                      )}
                      value={{
                        label: newotherPaymnets?.vendor,
                        value: newotherPaymnets?.vendor,
                      }}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          vendor: e.value,
                          gstno: e.gstnumber,
                        });
                        setVendorId(e._id);
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
                    {/* // )} */}
                  </Grid>
                )}

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Frequency<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={frequencyOption}
                      placeholder="Please Select Frequency"
                      value={{
                        label: newotherPaymnets.frequency,
                        value: newotherPaymnets.frequency,
                      }}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          frequency: e.value,

                          monthdate: "",

                          annuallymonth: "",
                          annuallyday: "",
                        });

                        setValueDaysCat([]);
                        setSelectedOptionsDays([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                {(newotherPaymnets.frequency === "Weekly" ||
                  newotherPaymnets.frequency === "Day Wise") && (
                    <>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b>
                            {" "}
                            Days <b style={{ color: "red" }}>*</b>
                          </b>
                        </InputLabel>
                        <FormControl fullWidth size="small">
                          <MultiSelect
                            options={daysOptions}
                            value={selectedOptionsDays}
                            onChange={(e) => {
                              handleDaysChange(e);
                            }}
                            valueRenderer={customValueRendererDays}
                            labelledBy="Please Select Days"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                {(newotherPaymnets.frequency === "Monthly" ||
                  newotherPaymnets.frequency === "Date Wise") && (
                    <>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b>
                            {" "}
                            Date<b style={{ color: "red" }}>*</b>{" "}
                          </b>
                        </InputLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={newotherPaymnets.monthdate}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            onChange={(e) => {
                              setnewotherPaymnets({
                                ...newotherPaymnets,
                                monthdate: e.target.value,
                              });
                            }}
                          >
                            <MenuItem value={"01"}>01</MenuItem>
                            <MenuItem value={"02"}>02</MenuItem>
                            <MenuItem value={"03"}>03</MenuItem>
                            <MenuItem value={"04"}>04</MenuItem>
                            <MenuItem value={"05"}>05</MenuItem>
                            <MenuItem value={"06"}>06</MenuItem>
                            <MenuItem value={"07"}>07</MenuItem>
                            <MenuItem value={"08"}>08</MenuItem>
                            <MenuItem value={"09"}>09</MenuItem>
                            <MenuItem value={"10"}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={16}>16</MenuItem>
                            <MenuItem value={17}>17</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={19}>19</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={21}>21</MenuItem>
                            <MenuItem value={22}>22</MenuItem>
                            <MenuItem value={23}>23</MenuItem>
                            <MenuItem value={24}>24</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={26}>26</MenuItem>
                            <MenuItem value={27}>27</MenuItem>
                            <MenuItem value={28}>28</MenuItem>
                            <MenuItem value={29}>29</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={31}>31</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                {newotherPaymnets.frequency === "Annually" && (
                  <>
                    <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                      <InputLabel>
                        {" "}
                        <b>
                          {" "}
                          Month <b style={{ color: "red" }}>*</b>{" "}
                        </b>
                      </InputLabel>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={newotherPaymnets.annuallymonth}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setnewotherPaymnets({
                              ...newotherPaymnets,
                              annuallymonth: e.target.value,
                            });
                          }}
                        >
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                      <InputLabel>
                        {" "}
                        <b>
                          {" "}
                          Day <b style={{ color: "red" }}>*</b>{" "}
                        </b>
                      </InputLabel>

                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={newotherPaymnets.annuallyday}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setnewotherPaymnets({
                              ...newotherPaymnets,
                              annuallyday: e.target.value,
                            });
                          }}
                        >
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                          <MenuItem value={13}>13</MenuItem>
                          <MenuItem value={14}>14</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={16}>16</MenuItem>
                          <MenuItem value={17}>17</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={19}>19</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={21}>21</MenuItem>
                          <MenuItem value={22}>22</MenuItem>
                          <MenuItem value={23}>23</MenuItem>
                          <MenuItem value={24}>24</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={26}>26</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                          <MenuItem value={28}>28</MenuItem>
                          <MenuItem value={29}>29</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                          <MenuItem value={31}>31</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Status<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={statusOption}
                      placeholder="Please Select Status"
                      value={{
                        label: newotherPaymnets.status,
                        value: newotherPaymnets.status,
                      }}
                      onChange={(e) => {
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          status: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Due Days<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Due Days"
                      value={newotherPaymnets?.duedays}
                      onChange={(e) => {
                        const numericOnly = e.target.value
                          .replace(/[^0-9.;\s]/g, "")
                          .slice(0, 3);
                        setnewotherPaymnets({
                          ...newotherPaymnets,
                          duedays: numericOnly,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
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
                    <LoadingButton
                      variant="contained"
                      onClick={handleSubmit}
                      sx={buttonStyles.buttonsubmit}
                      loading={isBtn}
                    >
                      {" "}
                      SAVE
                    </LoadingButton>
                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                      {" "}
                      CLEAR
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </Box>
          <br />
          <br />
        </>
      )}
      <Box>
        <Headtitle title={"SCHEDULE PAYMENT MASTER"} />
        {/* ****** Header Content ****** */}
        {isUserRoleCompare?.includes("lschedulepaymentmaster") && (
          <>
            <br />
            {/* ****** Table Start ****** */}

            <Box sx={userStyle.container}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Schedule Payment Master List
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
                      <MenuItem value={payments?.length}>All</MenuItem>
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
                      "excelschedulepaymentmaster"
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
                    {isUserRoleCompare?.includes(
                      "csvschedulepaymentmaster"
                    ) && (
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
                      "printschedulepaymentmaster"
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
                      "pdfschedulepaymentmaster"
                    ) && (
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
                      "imageschedulepaymentmaster"
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

                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={payments}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={payments}
                  />
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
              {isUserRoleCompare?.includes("bdschedulepaymentmaster") && (
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
                    searchQuery={searchQuery}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={payments}
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

        <Box>
          <Dialog
            open={openEdit}
            onClose={handleEditClose}
            maxWidth="lg"
            sx={{
              overflow: "visible",
              "& .MuiPaper-root": {
                overflow: "visible",
              },
            }}
          >
            <Box sx={{ padding: "20px" }}>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Schedule Payment Master Edit
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
                        label: singlePay.company,
                        value: singlePay.company,
                      }}
                      onChange={(e) => {
                        setSinglePay({
                          ...singlePay,
                          company: e.value,
                          branch: "Please Select Branch",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      id="component-outlined"
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
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={{
                        label: singlePay.branch,
                        value: singlePay.branch,
                      }}
                      onChange={(e) => {
                        setSinglePay({
                          ...singlePay,
                          branch: e.value,
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
                        setVendorIdEdit("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.5} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={vendorOptions}
                      placeholder={singlePay?.vendor}
                      value={{
                        label: !singlePay?.vendor ? "Please Select Vendor" : singlePay?.vendor,
                        value: !singlePay?.vendor ? "Please Select Vendor" : singlePay?.vendor,
                      }}
                      onChange={(e) => {
                        setSinglePay({
                          ...singlePay,
                          vendor: e.value,
                          gstno: e.gstnumber,
                        });
                        setVendorIdEdit(e._id);
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
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Frequency<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={frequencyOption}
                      placeholder="Please Select Frequency"
                      value={{
                        label: singlePay.frequency,
                        value: singlePay.frequency,
                      }}
                      onChange={(e) => {
                        setSinglePay({
                          ...singlePay,
                          frequency: e.value,

                          datewiseandmonthlydate: "",

                          annuallymonth: "",
                          annuallyday: "",
                        });

                        setDaysValueCateEdit([]);
                        setSelectedDaysOptionsCateEdit([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                {(singlePay.frequency === "Weekly" ||
                  singlePay.frequency === "Day Wise") && (
                    <>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b>
                            {" "}
                            Days <b style={{ color: "red" }}>*</b>
                          </b>
                        </InputLabel>
                        <FormControl fullWidth size="small">
                          <MultiSelect
                            options={daysOptions}
                            value={selectedDaysOptionsCateEdit}
                            onChange={handleDaysChangeEdit}
                            valueRenderer={customValueRendererDaysEdit}
                            labelledBy="Please Select Company"
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                {(singlePay.frequency === "Monthly" ||
                  singlePay.frequency === "Date Wise") && (
                    <>
                      <Grid item lg={3} md={3} sm={12} xs={12}>
                        <InputLabel>
                          {" "}
                          <b>
                            {" "}
                            Date<b style={{ color: "red" }}>*</b>{" "}
                          </b>
                        </InputLabel>
                        <FormControl fullWidth size="small">
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={singlePay.datewiseandmonthlydate}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            onChange={(e) => {
                              setSinglePay({
                                ...singlePay,
                                datewiseandmonthlydate: e.target.value,
                              });
                            }}
                          >
                            <MenuItem value={"01"}>01</MenuItem>
                            <MenuItem value={"02"}>02</MenuItem>
                            <MenuItem value={"03"}>03</MenuItem>
                            <MenuItem value={"04"}>04</MenuItem>
                            <MenuItem value={"05"}>05</MenuItem>
                            <MenuItem value={"06"}>06</MenuItem>
                            <MenuItem value={"07"}>07</MenuItem>
                            <MenuItem value={"08"}>08</MenuItem>
                            <MenuItem value={"09"}>09</MenuItem>
                            <MenuItem value={"10"}>10</MenuItem>
                            <MenuItem value={11}>11</MenuItem>
                            <MenuItem value={12}>12</MenuItem>
                            <MenuItem value={13}>13</MenuItem>
                            <MenuItem value={14}>14</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={16}>16</MenuItem>
                            <MenuItem value={17}>17</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={19}>19</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={21}>21</MenuItem>
                            <MenuItem value={22}>22</MenuItem>
                            <MenuItem value={23}>23</MenuItem>
                            <MenuItem value={24}>24</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={26}>26</MenuItem>
                            <MenuItem value={27}>27</MenuItem>
                            <MenuItem value={28}>28</MenuItem>
                            <MenuItem value={29}>29</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={31}>31</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                {singlePay.frequency === "Annually" && (
                  <>
                    <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                      <InputLabel>
                        {" "}
                        <b>
                          {" "}
                          Month <b style={{ color: "red" }}>*</b>{" "}
                        </b>
                      </InputLabel>
                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={singlePay.annuallymonth}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setSinglePay({
                              ...singlePay,
                              annuallymonth: e.target.value,
                            });
                          }}
                        >
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={1.5} md={1.5} sm={12} xs={12}>
                      <InputLabel>
                        {" "}
                        <b>
                          {" "}
                          Day <b style={{ color: "red" }}>*</b>{" "}
                        </b>
                      </InputLabel>

                      <FormControl size="small" fullWidth>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={singlePay.annuallyday}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setSinglePay({
                              ...singlePay,
                              annuallyday: e.target.value,
                            });
                          }}
                        >
                          <MenuItem value={"01"}>01</MenuItem>
                          <MenuItem value={"02"}>02</MenuItem>
                          <MenuItem value={"03"}>03</MenuItem>
                          <MenuItem value={"04"}>04</MenuItem>
                          <MenuItem value={"05"}>05</MenuItem>
                          <MenuItem value={"06"}>06</MenuItem>
                          <MenuItem value={"07"}>07</MenuItem>
                          <MenuItem value={"08"}>08</MenuItem>
                          <MenuItem value={"09"}>09</MenuItem>
                          <MenuItem value={"10"}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                          <MenuItem value={13}>13</MenuItem>
                          <MenuItem value={14}>14</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={16}>16</MenuItem>
                          <MenuItem value={17}>17</MenuItem>
                          <MenuItem value={18}>18</MenuItem>
                          <MenuItem value={19}>19</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={21}>21</MenuItem>
                          <MenuItem value={22}>22</MenuItem>
                          <MenuItem value={23}>23</MenuItem>
                          <MenuItem value={24}>24</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={26}>26</MenuItem>
                          <MenuItem value={27}>27</MenuItem>
                          <MenuItem value={28}>28</MenuItem>
                          <MenuItem value={29}>29</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                          <MenuItem value={31}>31</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Due Days<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Due Days"
                      value={singlePay?.duedays}
                      onChange={(e) => {
                        const numericOnly = e.target.value
                          .replace(/[^0-9.;\s]/g, "")
                          .slice(0, 3);
                        setSinglePay({
                          ...singlePay,
                          duedays: numericOnly,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

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
          </Dialog>
        </Box>
        <Box>
          <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="lg">
            <DialogContent>
              <Box>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Schedule Payment Master View
                    </Typography>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Company</Typography>
                      <Typography>{singlePay.company}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Branch</Typography>
                      <Typography>{singlePay.branch}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Expense Category</Typography>
                      <Typography>{singlePay.expensecategory}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Expense Sub Category</Typography>
                      <Typography>{singlePay.expensesubcategory}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Purpose</Typography>
                      <Typography>{singlePay.purpose}</Typography>
                    </FormControl>
                  </Grid>
                  {/* next grdi */}
                  <>
                    <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Vendor</Typography>
                        <Typography>{singlePay.vendor}</Typography>
                      </FormControl>
                      &emsp;
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> Frequency</Typography>
                        <Typography>{singlePay.frequency}</Typography>
                      </FormControl>
                    </Grid>

                    {(singlePay.frequency === "Weekly" ||
                      singlePay.frequency === "Day Wise") && (
                        <>
                          <Grid item md={4} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Days</Typography>
                              <Typography>
                                {singlePay.daywiseandweeklydays
                                  ?.map((t, i) => `${i + 1 + ". "}` + t)
                                  .toString()}
                              </Typography>
                            </FormControl>
                          </Grid>
                        </>
                      )}
                    {(singlePay.frequency === "Monthly" ||
                      singlePay.frequency === "Date Wise") && (
                        <>
                          <Grid item md={4} sm={12} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography variant="h6"> Date</Typography>
                              <Typography>
                                {singlePay.datewiseandmonthlydate}
                              </Typography>
                            </FormControl>
                          </Grid>
                        </>
                      )}

                    {singlePay.frequency === "Annually" && (
                      <>
                        <Grid item md={2} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6"> Month</Typography>
                            <Typography>{singlePay.annuallymonth}</Typography>
                          </FormControl>
                        </Grid>
                        <Grid item md={2} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography variant="h6"> Day</Typography>
                            <Typography>{singlePay.annuallyday}</Typography>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Status</Typography>
                        <Typography>{singlePay.status}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Due Days</Typography>
                        <Typography>{singlePay.duedays}</Typography>
                      </FormControl>
                    </Grid>
                  </>
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

        {/* ALERT DIALOG */}
        <Box>
          <Dialog
            open={isErrorOpen}
            onClose={handleCloseerr}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent
              sx={{ width: "450px", textAlign: "center", alignItems: "center" }}
            >
              <Typography
                variant="h6"
                style={{ fontSize: "20px", fontWeight: 900 }}
              >
                {showAlert}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                style={{
                  padding: "7px 13px",
                  color: "#000",

                }}
                onClick={handleCloseerr}
              >
                close
              </Button>
              <Button
                variant="contained"
                style={{
                  padding: "7px 13px",
                  color: "white",
                  background: "rgb(25, 118, 210)",
                }}
                onClick={delGroupcheckbox}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Dialog
        open={openviewalertvendor}
        onClose={handleClickOpenviewalertvendor}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: "50px" }}
      >
        <VendorPopup
          setVendorAuto={setVendorAuto}
          handleCloseviewalertvendor={handleCloseviewalertvendor}
          sendDataToParent={sendDataToParent}
        />
      </Dialog>

      {/* dialog status change */}
      <Box>
        <Dialog
          maxWidth="lg"
          open={statusOpen}
          onClose={handleStatusClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "600px",
              height: "220px",
              overflow: "visible",
              "& .MuiPaper-root": {
                overflow: "visible",
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Edit Status</Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Status<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={statusOption}
                    placeholder="Please Select Status"
                    value={{
                      label: singlePay.status,
                      value: singlePay.status,
                    }}
                    onChange={(e) => {
                      setSinglePay({
                        ...singlePay,
                        status: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          {/* {selectStatus.status == "Rejected" ? <br /> : null} */}
          <DialogActions>
            <Button
              variant="contained"
              sx={buttonStyles.buttonsubmit}
              onClick={() => {
                editStatus();
              }}
            >
              Update
            </Button>
            <Button
              sx={buttonStyles.btncancel}
              onClick={() => {
                handleStatusClose();
                setSinglePay({});
              }}
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
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={payments ?? []}
        filename={"SchedulePaymentMaster"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Schedule Payment Master Info"
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


      <Box>
        <Dialog
          open={isErrorOpenNew}
          onClose={handleCloseerrNew}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "450px", textAlign: "center", alignItems: "center" }}
          >
            <Typography
              variant="h6"
              style={{ fontSize: "20px", fontWeight: 900 }}
            >
              {showAlertNew}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              style={{
                padding: "7px 13px",
                color: "#000",

              }}
              onClick={handleCloseerrNew}
            >
              close
            </Button>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={sendRequestEdit}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}
export default SchedulePaymentMaster;
