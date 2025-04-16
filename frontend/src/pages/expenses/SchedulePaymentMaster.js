import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Checkbox,
  Popover,
  TextField,
  IconButton,
  Switch,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  TableRow,
  Typography,
  TableContainer,
  TableCell,
  OutlinedInput,
  Dialog,
  Select,
  MenuItem,
  TableBody,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  Button,
  InputLabel,
} from "@mui/material";
import { handleApiError } from "../../components/Errorhandling";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf, FaPlus, FaEdit } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { SERVICE } from "../../services/Baseservice";
import MenuIcon from "@mui/icons-material/Menu";
import jsPDF from "jspdf";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import {
  daysOptions,
  frequencyOption,
} from "../../components/Componentkeyword";
import StyledDataGrid from "../../components/TableStyle";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Selects from "react-select";
import "jspdf-autotable";
import CloseIcon from "@mui/icons-material/Close";
import VendorPopup from "../account/vendorpop";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../components/PageHeading";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";

function SchedulePaymentMaster() {
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
        rowDataTable.map((item, index) => {
          return {
            "S.No": index + 1,
            Status: item.status,
            Comapny: item.company,
            Branch: item.branch,
            "Expense Category": item?.expensecategory,
            "Expense SubCategory": item?.expensesubcategory,
            Purpose: item.purpose,
            Vendor: item.vendor,
            Frequency: item.frequency,
            DueDays: item?.duedays,
          };
        }),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        payments?.map((item, index) => ({
          "S.No": index + 1,
          Status: item.status,
          Comapny: item.company,
          Branch: item.branch,
          "Expense Category": item?.expensecategory,
          "Expense SubCategory": item?.expensesubcategory,
          Purpose: item.purpose,
          Vendor: item.vendor,
          Frequency: item.frequency,
          DueDays: item?.duedays,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  const columns = [
    { title: "Status", field: "status" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Expense Category", field: "expensecategory" },
    { title: "Expense SubCategory", field: "expensesubcategory" },
    { title: "Purpose", field: "purpose" },
    { title: "Vendor", field: "vendor" },
    { title: "Frequency", field: "frequency" },
    { title: "Due Days", field: "duedays" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((item, index) => {
            return {
              serialNumber: index + 1,
              company: item.company,
              branch: item.branch,
              expensecategory: item?.expensecategory,
              expensesubcategory: item?.expensesubcategory,
              purpose: item.purpose,
              vendor: item.vendor,
              frequency: item.frequency,
              status: item.status,
              duedays: item?.duedays,
            };
          })
        : payments?.map((item, index) => ({
            serialNumber: index + 1,
            company: item.company,
            branch: item.branch,
            expensecategory: item?.expensecategory,
            expensesubcategory: item?.expensesubcategory,
            purpose: item.purpose,
            vendor: item.vendor,
            frequency: item.frequency,
            status: item.status,
            duedays: item?.duedays,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("Schedule Payment Master.pdf");
  };

  const navigate = useNavigate();
  const [payments, setpayments] = useState([]);
  const [paymentsEdit, setpaymentsEdit] = useState([]);
  const [vendorAuto, setVendorAuto] = useState("");
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

  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Schedule Payment Master .png");
        });
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
  } = useContext(UserRoleAccessContext);

  const accessbranch = isAssignBranch?.map((data) => ({
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        response.data.vendordetails.map((data) => ({
          ...data,
          label: data.vendorname,
          value: data.vendorname,
        }))
      );
      setVendorAuto("");
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
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
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  const sendRequest = async () => {
    setPageName(!pageName);
    try {
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      await fetchAllPayments();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please  Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (newotherPaymnets?.branch === "Please Select Branch") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please  Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      newotherPaymnets?.expansecategory === "Please Select Expense Category"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Expense Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      newotherPaymnets?.expansesubcategory ===
      "Please Select Expense Sub Category"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Expense Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (newotherPaymnets?.purpose === "Please Select Purpose") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Purpose"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (newotherPaymnets?.vendor === "Please Select Vendor") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Vendor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (newotherPaymnets?.frequency === "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (newotherPaymnets?.frequency === "Day Wise" ||
        newotherPaymnets?.frequency === "Weekly") &&
      valueDaysCat?.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (newotherPaymnets?.frequency === "Date Wise" ||
        newotherPaymnets?.frequency === "Monthly") &&
      newotherPaymnets?.monthdate === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      newotherPaymnets?.frequency === "Annually" &&
      newotherPaymnets?.annuallymonth === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Month"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      newotherPaymnets?.frequency === "Annually" &&
      newotherPaymnets?.annuallyday === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Day"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (newotherPaymnets?.status === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (newotherPaymnets?.duedays === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Due Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Data already Exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
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
      singlePay?.branch === "Please Select Branch" ||
      singlePay?.branch === ""
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
      singlePay?.expensecategory === "Please Select Expense Category" ||
      singlePay?.expensecategory === "" ||
      singlePay?.expensecategory === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Expense Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      singlePay?.expensesubcategory === "Please Select Expense Sub Category" ||
      singlePay?.expensesubcategory === "" ||
      singlePay?.expensesubcategory === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Expense Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (singlePay?.purpose === "Please Select Purpose") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Purpose"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (singlePay?.vendor === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Vendor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (singlePay?.frequency === "Please Select Frequency") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Frequency"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (singlePay?.frequency === "Day Wise" ||
        singlePay?.frequency === "Weekly") &&
      DaysValueCateEdit?.length === 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      (singlePay?.frequency === "Date Wise" ||
        singlePay?.frequency === "Monthly") &&
      singlePay?.datewiseandmonthlydate === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      singlePay?.frequency === "Annually" &&
      singlePay?.annuallymonth === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Month"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      singlePay?.frequency === "Annually" &&
      singlePay?.annuallyday === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Day"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (singlePay?.duedays === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Due Days"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Data already Exist!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestEdit();
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
        res_grp?.data?.schedulepaymentmaster?.map((data) => ({
          ...data,
          duedays: `${data?.duedays} Days`,
        }))
      );
      setGroupCheck(true);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [deleteGroup, setDeletegroup] = useState("");

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
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchAllPayments();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //Project updateby edit page...
  let updateby = singlePay?.updatedby;
  let addedby = singlePay?.addedby;

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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      await fetchAllPayments();
      handleEditClose();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      setShowAlert(
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "green" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      await fetchAllPayments();
      handleStatusClose();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
  const filteredDatas = payments?.filter((item) => {
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
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Button
          variant="contained"
          style={{
            padding: "5px",
            background:
              params.row.status === "Active"
                ? "green"
                : params.row.status === "In Active"
                ? "red"
                : "brown",
            color: "white",
            fontSize: "10px",
            width: "90px",
            fontWeight: "bold",
            cursor: "default",
          }}
        >
          {params.row.status}
        </Button>
      ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 120,
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
      width: 150,
      hide: !columnVisibility.vendor,
      headerClassName: "bold-header",
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 0,
      width: 150,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eschedulepaymentmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
                fetchAllPaymentsEditCheck(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dschedulepaymentmaster") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vschedulepaymentmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCodeView(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ischedulepaymentmaster") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getCodeInfo(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
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
                  `/expense/schedulepaymentmasterlog/${params?.row?.id}`
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
                getCodeStatus(params.row.id);
              }}
            >
              <FaEdit style={{ color: "white", fontSize: "17px" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: index + 1,
      company: item.company,
      branch: item.branch,
      purpose: item.purpose,
      vendor: item.vendor,
      status: item.status,
      expensecategory: item?.expensecategory,
      expensesubcategory: item?.expensesubcategory,
      frequency: item.frequency,
      daywiseandweeklydays: item.daywiseandweeklydays
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
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

  return (
    <Box>
      <PageHeading
        title="Manage Schedule Payment Master"
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
                    options={isAssignBranch
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
              {/* next grdi */}
              <>
                <Grid item md={2.5} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={vendorOptions}
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
                    <Button variant="contained" onClick={handleSubmit}>
                      {" "}
                      SAVE
                    </Button>
                    <Button sx={userStyle.btncancel} onClick={handleClear}>
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
                  color="error"
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
                    <StyledDataGrid
                      onClipboardCopy={(copiedString) =>
                        setCopiedData(copiedString)
                      }
                      rows={rowsWithCheckboxes}
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
                    />
                  </Box>
                  <Box style={userStyle.dataTablestyle}>
                    <Box>
                      Showing{" "}
                      {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                      to {Math.min(page * pageSize, filteredDatas.length)} of{" "}
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
                      options={isAssignBranch
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
                <Grid item md={2.5} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={vendorOptions}
                      placeholder={singlePay?.vendor}
                      value={{
                        label: singlePay?.vendor,
                        value: singlePay?.vendor,
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
                      <Button variant="contained" onClick={handleSubmitEdit}>
                        {" "}
                        UPDATE
                      </Button>
                      <Button
                        sx={userStyle.btncancel}
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
                      <Button variant="contained" onClick={handleViewClose}>
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

        {/* Delete Modal */}
        <Box>
          {/* ALERT DIALOG */}
          <Dialog
            open={isDeleteOpen}
            onClose={handleCloseMod}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent
              sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
            >
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "80px", color: "orange" }}
              />
              <Typography
                variant="h5"
                sx={{ color: "red", textAlign: "center" }}
              >
                Are you sure?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                Cancel
              </Button>
              <Button
                autoFocus
                variant="contained"
                color="error"
                onClick={(e) => deleGroup()}
              >
                {" "}
                OK{" "}
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
                  Schedule Payment Master Info
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
          {/* print layout */}

          <TableContainer component={Paper} sx={userStyle.printcls}>
            <Table
              sx={{ minWidth: 700 }}
              aria-label="customized table"
              id="usertable"
              ref={componentRef}
            >
              <TableHead>
                <TableRow>
                  <TableCell> SI.No</TableCell>
                  <TableCell> Status</TableCell>
                  <TableCell> Company</TableCell>
                  <TableCell> Branch</TableCell>
                  <TableCell> Expense Category</TableCell>
                  <TableCell> Expense Sub Category</TableCell>
                  <TableCell> Purpose </TableCell>
                  <TableCell> Vendor </TableCell>
                  <TableCell> Frequency</TableCell>
                  <TableCell> Due Days</TableCell>
                </TableRow>
              </TableHead>
              <TableBody align="left">
                {rowDataTable &&
                  rowDataTable.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.serialNumber}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.company}</TableCell>
                      <TableCell>{row.branch}</TableCell>
                      <TableCell>{row.expensecategory}</TableCell>
                      <TableCell>{row.expensesubcategory}</TableCell>
                      <TableCell>{row.purpose}</TableCell>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell>{row.frequency}</TableCell>
                      <TableCell>{row?.duedays}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

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
              <Typography
                variant="h5"
                sx={{ color: "red", textAlign: "center" }}
              >
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
                onClick={(e) => delGroupcheckbox(e)}
              >
                {" "}
                OK{" "}
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
        {/* ALERT DIALOG */}
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
                color="error"
                onClick={handleCloseerr}
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
      >
        <VendorPopup
          setVendorAuto={setVendorAuto}
          handleCloseviewalertvendor={handleCloseviewalertvendor}
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
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                editStatus();
              }}
            >
              Update
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
              // fetchProductionClientRateArray();
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
    </Box>
  );
}
export default SchedulePaymentMaster;
