import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
  Select,
  OutlinedInput,
  FormControl,
  MenuItem,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../../services/Baseservice";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { handleApiError } from "../../../../components/Errorhandling";
import { ThreeDots } from "react-loader-spinner";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StyledDataGrid from "../../../../components/TableStyle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Headtitle from "../../../../components/Headtitle";
import Selects from "react-select";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { LoadingButton } from "@mui/lab";
import MenuIcon from "@mui/icons-material/Menu";
import { MultiSelect } from "react-multi-select-component";
import PageHeading from "../../../../components/PageHeading";

import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "react-notifications/lib/notifications.css";

function Assignmanualsalarydetails() {
  const [employees, setEmployees] = useState([]);
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);
  const [btnSubmit, setBtnSubmit] = useState(false);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  //Datatable Info
  const [pageInfo, setPageInfo] = useState(1);
  const [pageSizeInfo, setPageSizeInfo] = useState(10);
  const [searchQueryInfo, setSearchQueryInfo] = useState("");
  const { auth } = useContext(AuthContext);

  const [salarySetUpForm, setSalarysetupForm] = useState({
    mode: "",
    empcode: "",
    employeename: "",
    salarycode: "Please Select Salary Code",
  });

  const [formValue, setFormValue] = useState({
    esideduction: false,
    pfdeduction: false,
  });
  const [empDetailsform, setEmpDetailsForm] = useState({
    esideduction: false,
    pfdeduction: false,
    uan: "",
    pfmembername: "",
    insurancenumber: "",
    ipname: "",
    pfesifromdate: "",
    isenddate: false,
    pfesienddate: "",
    mode: "Manual",
  });

  const currentDateAttStatus = new Date();
  const currentYearAttStatus = currentDateAttStatus.getFullYear();
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
  const currentMonthIndex = new Date().getMonth();
  const currentMonthObject = {
    label: monthstring[currentMonthIndex],
    value: currentMonthIndex + 1,
  };
  const currentYearObject = {
    label: currentYearAttStatus,
    value: currentYearAttStatus,
  };
  const years = Array.from(
    new Array(20),
    (val, index) => currentYearAttStatus - 5 + index
  );
  const getyear = years.map((year) => {
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

  const [isMonthyear, setIsMonthYear] = useState({
    startMonth: currentMonthObject?.label,
    startMonthValue: currentMonthObject?.value,
    startYear: currentYearObject?.value,
  });

  const [isActive, setIsActive] = useState(false);

  const [isAddOpenalert, setAddOpenalert] = useState(false);
  const [salarySlabOpt, setSalarySlabOpt] = useState([]);
  const [isBankdetail, setBankdetail] = useState(false);
  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const gridRef = useRef(null);
  const gridRefinfo = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Assign Manual Salary Details.png");
        });
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [expDptDates, setExpDptDates] = useState([]);
  const [oldDatalog, setOldDatalog] = useState({
    expmode: "",
    expval: "",
    endexp: "",
    endexpdate: "",
    endtar: "",
    endtardate: "",
    updatedate: "",
  });

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleOpeneinfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setSalarysetupForm({
      ...salarySetUpForm,
      mode: "Manual",
      salarycode: "Please Select Salary Code",
    });

    setFormValue([]);
    setCtc("");
    setIsActive(false);
  };

  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setExpDptDates(res?.data?.departmentdetails);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const StyledDataGridInfo = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "10px",
      fontWeight: "bold !important",
      lineHeight: "15px",
      whiteSpace: "normal", // Wrap text within the available space
      overflow: "visible", // Allow overflowed text to be visible
      minWidth: "30px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "40px !important",
      background: "#b7b3b347",
      maxHeight: "40px",
    },
    "& .MuiDataGrid-row": {
      fontSize: "9px", // Change the font size for row data
      minWidth: "30px",
      color: "black",
      // Add any other styles you want to apply to the row data
    },

    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
  }));

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const getMonthName = (monthNumber) => {
    const monthNames = [
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
    if (monthNumber) {
      return monthNames[monthNumber - 1];
    } else {
      return undefined;
    }
  };

  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpDetailsForm(res?.data?.suser);

      if (res?.data?.suser?.assignExpLog?.length > 0) {

        let lastexplog =
          res?.data?.suser.assignExpLog[
            res?.data?.suser?.assignExpLog?.length - 1
          ];
          const mondatefilter = lastexplog?.updatedate?.split("-");
          const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09'  ? "September" :  mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08'  ? "August" : mondatefilter[1] ===  '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06'  ? "June" : mondatefilter[1] ===  '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04'  ? "April" : mondatefilter[1] ===  '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March": mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01'  ? "January" : mondatefilter[1] === '1' ? "January" : "";  
        setOldDatalog(lastexplog);
        setSalarysetupForm({
          ...salarySetUpForm,
          mode: lastexplog.expmode != "Manual" ? "Auto" : "Manual",
          salarycode: lastexplog.salarycode ? lastexplog.salarycode : "",
        });
        setFormValue({
          ...formValue,
          gross: lastexplog.gross ? lastexplog.gross : "",
          hra: lastexplog.hra ? lastexplog.hra : "",
          conveyance: lastexplog.conveyance ? lastexplog.conveyance : "",
          startDate: lastexplog.updatedate ? lastexplog.updatedate : "",
          startmonthlabel:getmonth, 
          startmonth: mondatefilter[1], 
          startyear:mondatefilter[0],
          basic: lastexplog.basic ? lastexplog.basic : "",
          medicalallowance: lastexplog.medicalallowance
            ? lastexplog.medicalallowance
            : "",
          productionallowance: lastexplog.productionallowance
            ? lastexplog.productionallowance
            : "",
          productionallowancetwo: lastexplog.productionallowancetwo
            ? lastexplog.productionallowancetwo
            : "",
          otherallowance: lastexplog.otherallowance
            ? lastexplog.otherallowance
            : "",
          pfdeduction: lastexplog.pfdeduction ? lastexplog.pfdeduction : "",
          esideduction: lastexplog.esideduction ? lastexplog.esideduction : "",
        });

      } else {
        setSalarysetupForm({
          ...salarySetUpForm,
          mode: "Auto",
          startDate: "",
        });
      }
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [empDetailInfo, setempDetailInfo] = useState([]);

  const getInfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      if (
        res?.data?.suser.assignExpLog &&
        res?.data?.suser.assignExpLog.length > 0
      ) {
        let lastexplog =
          res?.data?.suser.assignExpLog[
            res?.data?.suser.assignExpLog.length - 1
          ];
        setOldDatalog(lastexplog);
        setempDetailInfo(
          res?.data?.suser.assignExpLog
            .filter((d) => d.expmode == "Manual")
            .map((item) => ({
              ...item,
              companyname: res?.data?.suser.companyname,
              startdate: item.updatedate,
            }))
        );
      } else {
        setOldDatalog([]);
        setempDetailInfo([]);
      }

      handleOpeneinfo();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //change form
  const handleChangeGross = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        gross: inputValue,
        basic: "",
        hra: "",
        conveyance: "",
        medicalallowance: "",
        productionallowance: "",
        productionallowancetwo: "",
        otherallowance: "",
      });
    }
  };

  //change form
  const handleChangeBasic = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        basic: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeHra = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        hra: e.target.value,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeConveyance = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        conveyance: e.target.value,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };
  //change form
  const handleChangeMedAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        medicalallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.basic) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        productionallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowancetwo) +
          Number(formValue.otherallowance),
      });
    }
  };

  //change form
  const handleChangeProdAllowtwo = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        productionallowancetwo: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.otherallowance),
      });
    }
  };
  //change form
  const handleChangeOtherAllow = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value;

    if (regex.test(inputValue) || inputValue === "") {
      setFormValue({
        ...formValue,
        otherallowance: inputValue,
        gross:
          Number(e.target.value) +
          Number(formValue.basic) +
          Number(formValue.hra) +
          Number(formValue.conveyance) +
          Number(formValue.medicalallowance) +
          Number(formValue.medicalallowance) +
          Number(formValue.productionallowance) +
          Number(formValue.productionallowancetwo),
      });
    }
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //Boardingupadate updateby edit page...
  let updateby = empDetailsform?.updatedby;

  //edit post call
  let boredit = empDetailsform?._id;
  const sendRequestt = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignExpLog: [
          ...empDetailsform.assignExpLog,
          {
            type: salarySetUpForm.mode,
            expmode: salarySetUpForm.mode,
            salarycode: salarySetUpForm.salarycode,
            endexp: "No",
            endexpdate: "",
            endtar: "No",
            endtardate: "",
            basic: String(formValue.basic),
            hra: String(formValue.hra),
            conveyance: String(formValue.conveyance),
            gross: String(formValue.gross),
            medicalallowance: String(formValue.medicalallowance),
            productionallowance: String(formValue.productionallowance),
            otherallowance: String(formValue.otherallowance),
            productionallowancetwo: String(formValue.productionallowancetwo),
            pfdeduction: Boolean(formValue.pfdeduction),
            esideduction: Boolean(formValue.esideduction),
            ctc: String(Ctc),
            updatedate: String(formValue.startDate),
            updatename: String(isUserRoleAccess.companyname),
            date: String(new Date()),
            startmonth: String(formValue?.startmonth),
            startyear: String(formValue?.startyear),
            endmonth: String(""),
            endyear: String(""),
          },
        ],
        salarysetup: true,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      setIsMonthYear({
        startMonth: currentMonthObject?.label,
        startMonthValue: currentMonthObject?.value,
        startYear: currentYearObject?.value,
      });
      setBtnSubmit(false);
      await fetchEmployee();

      setIsActive(false);
      handleCloseModEdit();
      setAddOpenalert(true);
      setTimeout(() => {
        setAddOpenalert(false);
      }, 1000);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    setBtnSubmit(true);
    if (
      salarySetUpForm.mode === "Auto" &&
      (formValue.startDate === "" || formValue.startDate === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Start Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      formValue.startDate === "" ||
      formValue.startDate === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Start Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    }else if (salarySetUpForm.mode === "Manual" && formValue.gross === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Gross amount"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequestt();
    }
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
    return data.map((item, index) => {
      return {
        Sno: index + 1,
        Company: item.company || "",
        Branch: item.branch || "",
        Unit: item.unit || "",
        Team: item.team || "",
        Empcode: item.empcode || "",
        Name: item.companyname || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : employees;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "Assign Manual Salary Details");
    setIsFilterOpen(false);
  };
  //  PDF
  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Emp Code", field: "empcode" },
    { title: "Name", field: "companyname" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData.map((t, index) => ({
            ...t,
            serialNumber: index + 1,
          }))
        : employees?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 8 },
    });

    doc.save("Assign Manual Salary Details.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Assign Manual Salary Details",
    pageStyle: "print",
  });

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [employees]);

  useEffect(() => {
    fetchDepartmentMonthsets();
  }, []);

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
      width: 75,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 140,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 160,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 120,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 120,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 160,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Emp Code!");
              }}
              options={{ message: "Copied Emp Code!" }}
              text={params?.row?.empcode}
            >
              <ListItemText primary={params?.row?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Name!");
              }}
              options={{ message: "Copied Name!" }}
              text={params?.row?.companyname}
            >
              <ListItemText primary={params?.row?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
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
      // Assign Bank Detail
      renderCell: (params) => (
        <Grid sx={{ display: "flex", gap: "10px" }}>
          {isUserRoleCompare?.includes("eassignmanualsalarydetails") && (
            <Button
              variant="contained"
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              Assign
            </Button>
          )}{" "}
          &ensp;
          {isUserRoleCompare?.includes("vassignmanualsalarydetails") && (
            <Button
              variant="contained"
              sx={{
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={() => {
                window.open(
                  `/assignmanualsalarydetails/${params.row.id}`,
                  "_blank"
                );
              }}
            >
              <MenuIcon style={{ fontsize: "small" }} />
            </Button>
          )}
          &ensp;
          {isUserRoleCompare?.includes("iassignmanualsalarydetails") && (
            <Button
              //   variant="outlined"
              onClick={() => {
                getInfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon />
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
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      companyname: item.companyname,
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

  const ModeOpt = [
    { label: "Manual", value: "Manual" },
    { label: "Auto", value: "Auto" },
  ];

  //get all client user id.
  const fetchProfessionalTax = async (process, salarycode) => {
    setPageName(!pageName);
    try {
      let res_freq = await axios.get(SERVICE.SALARYSLAB_PROCESS_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        process: process,
      });
      const OptSlaball = res_freq?.data?.salaryslab;
      const OptSlab = res_freq?.data?.salaryslab.filter((slab) => {
        return slab.salarycode === salarycode;
      });

      setSalarySlabOpt(OptSlaball);
      setFormValue(OptSlab[0]);
      setCtc(
        OptSlab[0].basic +
          OptSlab[0].hra +
          OptSlab[0].conveyance +
          OptSlab[0].medicalallowance +
          OptSlab[0].productionallowance +
          OptSlab[0].productionallowancetwo +
          OptSlab[0].otherallowance
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [Ctc, setCtc] = useState("");

  const handleclear = (e) => {
    e.preventDefault();

    setFormValue({
      basic: "",
      hra: "",
      conveyance: "",
      medicalallowance: "",
      productionallowance: "",
      productionallowancetwo: "",
      otherallowance: "",
      gross: "",
    });
    setCtc("");
    setShowAlert(
      <>
        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //INFO table entries ..,.
  const [itemsInfo, setItemsInfo] = useState([]);

  const addSerialNumberInfo = () => {
    const itemsWithSerialNumber = empDetailInfo?.map((item, index) => {
      const newDate = new Date(item.date);
      // Extract year, month, and day
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to get the correct month since January is 0
      const day = String(newDate.getDate()).padStart(2, "0");
      const formattedDate = `${day}-${month}-${year}`;
      const updatestartdate = moment(item.startdate).format("YYYY-MM-DD");

      return {
        ...item,
        serialNumber: index + 1,
        date: item.updatename + " / " + formattedDate,
        startdate: updatestartdate,
      };
    });
    setItemsInfo(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumberInfo();
  }, [empDetailInfo]);

  //Datatable
  const handlePageChangeInfo = (newPage) => {
    setPageInfo(newPage);
  };

  const handlePageSizeChangeInfo = (event) => {
    setPageSizeInfo(Number(event.target.value));
    setPageInfo(1);
  };

  //datatable....
  const handleSearchChangeInfo = (event) => {
    setSearchQueryInfo(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsInfo = searchQueryInfo.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasInfo = itemsInfo?.filter((item) => {
    return searchTermsInfo.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredDataInfo = filteredDatasInfo.slice(
    (pageInfo - 1) * pageSizeInfo,
    pageInfo * pageSizeInfo
  );

  const totalPagesInfo = Math.ceil(empDetailInfo.length / pageSizeInfo);

  const visiblePagesInfo = Math.min(totalPagesInfo, 3);

  const firstVisiblePageInfo = Math.max(1, pageInfo - 1);
  const lastVisiblePageInfo = Math.min(
    firstVisiblePageInfo + visiblePagesInfo - 1,
    totalPagesInfo
  );

  const pageNumbersInfo = [];

  for (let i = firstVisiblePageInfo; i <= lastVisiblePageInfo; i++) {
    pageNumbersInfo.push(i);
  }

  const columnDataTableInfo = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 45,
      // hide: !columnVisibilityInfo.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "expmode",
      headerName: "Mode",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Name",
      flex: 0,
      width: 150,
      headerClassName: "bold-header",
    },

    {
      field: "gross",
      headerName: "Gross",
      flex: 0,
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "basic",
      headerName: "Basic",
      flex: 0,
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "hra",
      headerName: "Hra",
      flex: 0,
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "conveyance",
      headerName: "Conveyance",
      flex: 0,
      width: 70,
      headerClassName: "bold-header",
    },
    {
      field: "medicalallowance",
      headerName: "Medical Allowance",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowance",
      headerName: "Production Allowance",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "productionallowancetwo",
      headerName: "Production Allowance2",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "otherallowance",
      headerName: "Other Allowance",
      flex: 0,
      width: 60,
      otherallowance: "bold-header",
    },
    {
      field: "esideduction",
      headerName: "ESI Deduction",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },
    {
      field: "pfdeduction",
      headerName: "PF Deduction",
      flex: 0,
      width: 60,
      headerClassName: "bold-header",
    },

    {
      field: "startdate",
      headerName: "Start Date",
      flex: 0,
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Updated By",
      flex: 0,
      width: 150,
      headerClassName: "bold-header",
    },
  ];

  const rowDataTableInfo = filteredDataInfo.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      companyname: item.companyname,
      expmode: item.expmode,
      salarycode: item.salarycode,
      gross: item.gross,
      basic: item.basic,
      hra: item.hra,
      conveyance: item.conveyance,
      medicalallowance: item.medicalallowance,
      productionallowance: item.productionallowance,
      productionallowancetwo: item.productionallowancetwo,
      otherallowance: item.otherallowance,
      esideduction: item.esideduction,
      pfdeduction: item.pfdeduction,
      updatename: item.updatename,

      startdate: item.startdate,
      date: item.date,
    };
  });

  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setEmployees([]);
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

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
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
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
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
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
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //MULTISELECT ONCHANGE END

  const handleFilter = () => {
    if (selectedOptionsCompany?.length === 0) {
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
    } else {
      fetchEmployee();
    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  //get all employees list details
  const fetchEmployee = async () => {
    setBankdetail(true);
    setPageName(!pageName);
    const aggregationPipeline = [
      {
        $match: {
          $and: [
            // Enquiry status filter
            {
              enquirystatus: {
                $nin: ["Enquiry Purpose"],
              },
            },
            // Reasonable status filter
            {
              resonablestatus: {
                $nin: [
                  "Not Joined",
                  "Postponed",
                  "Rejected",
                  "Closed",
                  "Releave Employee",
                  "Absconded",
                  "Hold",
                  "Terminate",
                ],
              },
            },
            // Conditional company filter
            ...(valueCompanyCat.length > 0
              ? [
                  {
                    company: { $in: valueCompanyCat },
                  },
                ]
              : [
                  {
                    company: { $in: allAssignCompany },
                  },
                ]),
            // Conditional branch filter
            ...(valueBranchCat.length > 0
              ? [
                  {
                    branch: { $in: valueBranchCat },
                  },
                ]
              : [
                  {
                    branch: { $in: allAssignBranch },
                  },
                ]),
            // Conditional unit filter
            ...(valueUnitCat.length > 0
              ? [
                  {
                    unit: { $in: valueUnitCat },
                  },
                ]
              : [
                  {
                    unit: { $in: allAssignUnit },
                  },
                ]),
            // Conditional team filter
            ...(valueTeamCat.length > 0
              ? [
                  {
                    team: { $in: valueTeamCat },
                  },
                ]
              : []),
          ],
        },
      },
      {
        $project: {
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          empcode: 1,
          companyname: 1,
        },
      },
    ];
    try {
      let response = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      setEmployees(response.data.users);
      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
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
        .map((u) => u.teamname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"ASSIGN MANUAL SALARY DETAILS"} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Manage Assign Manual Salary Details"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Log Details"
        subsubpagename="Assign Manual Salary Details"
      />
      <br />
      {isUserRoleCompare?.includes("lassignmanualsalarydetails") && (
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
                      options={isAssignBranch
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
                                i.label === item.label && i.value === item.value
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
                    <Typography> Unit</Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                                i.label === item.label && i.value === item.value
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
                    <Typography>Team</Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (u) =>
                            valueCompanyCat?.includes(u.company) &&
                            valueBranchCat?.includes(u.branch) &&
                            valueUnitCat?.includes(u.unit)
                        )
                        ?.map((u) => ({
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
                  sx={userStyle.buttonadd}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClearFilter}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lassignmanualsalarydetails") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Assign Manual Salary Details List
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
                    "excelassignmanualsalarydetails"
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
                    "csvassignmanualsalarydetails"
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
                    "printassignmanualsalarydetails"
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
                    "pdfassignmanualsalarydetails"
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
                    "imageassignmanualsalarydetails"
                  ) && (
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            <br />
            <br />
            {isBankdetail ? (
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
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
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

      {/* Delete Modal */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
        >
          <Box sx={userStyle.dialogbox}>
            <>
              <br />
              <Grid container spacing={2}>
                <Grid
                  item
                  md={4}
                  sm={12}
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={userStyle.SubHeaderText}>
                    Salary Setup
                  </Typography>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      styles={colourStyles}
                      options={ModeOpt}
                      value={{
                        label: salarySetUpForm.mode,
                        value: salarySetUpForm.mode,
                      }}
                      onChange={(e) => {
                        setSalarysetupForm({
                          ...salarySetUpForm,
                          mode: e.value,
                          salarycode: e.value == "Manual" ? "MANUAL" : "",
                        });
                        if (e.value === "Auto") {
                          setIsActive(true);
                          setFormValue({
                            ...formValue,
                            gross: "",
                            basic: "",
                            hra: "",
                            conveyance: "",
                            medicalallowance: "",
                            productionallowance: "",
                            productionallowancetwo: "",
                            otherallowance: "",
                          });
                          setCtc("");
                        } else {
                          setIsActive(false);
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  md={4}
                  sm={12}
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography>
                    Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth>
                    <Selects
                      maxMenuHeight={250}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu base
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu option list
                        }),
                      }}
                      options={expDptDates
                        .filter((d) =>
                          oldDatalog.updatedate !== undefined ||
                          oldDatalog.updatedate !== "" ||
                          oldDatalog.updatedate != "undefined" // Problematic part
                            ? d.department === empDetailsform.department &&
                              d.fromdate >= oldDatalog.updatedate
                            : d.department === empDetailsform.department
                        )
                        .map((item) => ({
                          ...item,
                          label: item.fromdate,
                          value: item.fromdate,
                        }))}
                      value={{
                        label: formValue.startDate,
                        value: formValue.startDate,
                      }}
                      onChange={(e) => {
                        const mondatefilter = e?.value?.split("-");
                        const getmonth = mondatefilter[1] === '12' ? "December" : mondatefilter[1] === '11' ? "November" : mondatefilter[1] === '10' ? "October" : mondatefilter[1] === '09'  ? "September" :  mondatefilter[1] === '9' ? "September" : mondatefilter[1] === '08'  ? "August" : mondatefilter[1] ===  '8' ? "August" : mondatefilter[1] === '07' ? "July" : mondatefilter[1] === '7' ? "July" : mondatefilter[1] === '06'  ? "June" : mondatefilter[1] ===  '6' ? "June" : mondatefilter[1] === '05' ? "May" : mondatefilter[1] === '5' ? "May" : mondatefilter[1] === '04'  ? "April" : mondatefilter[1] ===  '4' ? "April" : mondatefilter[1] === '03' ? "March" : mondatefilter[1] === '3' ? "March": mondatefilter[1] === '02' ? 'February' : mondatefilter[1] === '2' ? 'February' : mondatefilter[1] === '01'  ? "January" : mondatefilter[1] === '1' ? "January" : "";  
                        setFormValue({ ...formValue, startmonthlabel:getmonth, startmonth: mondatefilter[1], startyear:mondatefilter[0], startDate: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>{" "}
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Emp Code <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={isActive}
                      placeholder="Please Enter Emp Code"
                      value={empDetailsform.empcode}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={isActive}
                      placeholder="Please Enter Employee Code"
                      value={empDetailsform.companyname}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} xs={12} sm={12}>
                  {salarySetUpForm.mode === "Manual" ? (
                    <FormControl fullWidth size="small">
                      <Typography>
                        Salary Code <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Salary Code"
                        value={salarySetUpForm.salarycode}
                      />
                    </FormControl>
                  ) : (
                    <FormControl fullWidth size="small">
                      <Typography>Salary Code</Typography>
                      <Selects
                      isDisabled
                        options={salarySlabOpt
                          .filter(
                            (item) =>
                              item.processqueue === empDetailsform.process
                          )
                          .map((sc) => ({
                            ...sc,
                            value: sc.salarycode,
                            label: sc.salarycode,
                          }))}
                        value={{
                          label: salarySetUpForm.salarycode,
                          value: salarySetUpForm.salarycode,
                        }}
                        onChange={(e) => {
                          setSalarysetupForm({
                            ...salarySetUpForm,
                            salarycode: e.value,
                          });
                          fetchProfessionalTax(e.process, e.value);
                        }}
                      />
                    </FormControl>
                  )}
                </Grid>
                <>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Start Month <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={formValue.startmonthlabel}
                    />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        {" "}
                        Start Year <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={formValue.startyear}
                    />
                    </FormControl>
                  </Grid>
                </>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Gross Salary <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Gross"
                      value={formValue.gross}
                      onChange={handleChangeGross}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Basic</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Basic"
                      value={formValue.basic}
                      onChange={handleChangeBasic}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>HRA</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter HRA"
                      value={formValue.hra}
                      onChange={handleChangeHra}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Conveyance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Conveyance"
                      value={formValue.conveyance}
                      onChange={handleChangeConveyance}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Medical Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Medical Allowance"
                      value={formValue.medicalallowance}
                      onChange={handleChangeMedAllow}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Production Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Production Allowance"
                      value={formValue.productionallowance}
                      onChange={handleChangeProdAllow}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Production Allowance 2</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Production Allowance 2"
                      value={formValue.productionallowancetwo}
                      onChange={handleChangeProdAllowtwo}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Other Allowance</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      disabled={salarySetUpForm.mode === "Auto"}
                      placeholder="Please Enter Other Allowance"
                      value={formValue.otherallowance}
                      onChange={handleChangeOtherAllow}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={12}></Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      sx={{ height: "20", padding: "0  25px" }}
                      checked={formValue.esideduction}
                      disabled={salarySetUpForm.mode === "Auto"}
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          esideduction: e.target.checked,
                        });
                      }}
                    />
                    <Typography>ESI Deduction</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      sx={{ height: "20", padding: "0  25px" }}
                      checked={formValue.pfdeduction}
                      disabled={salarySetUpForm.mode === "Auto"}
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          pfdeduction: e.target.checked,
                        });
                      }}
                    />
                    <Typography>PF Deduction</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Box sx={{ display: "flex", justifyContent: "center" }}></Box>
              <br />
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <LoadingButton
                    loading={btnSubmit}
                    variant="contained"
                    onClick={editSubmit}
                  >
                    SAVE
                  </LoadingButton>
                  <Button sx={userStyle.btncancel} onClick={handleclear}>
                    CLEAR
                  </Button>
                  <Button variant="contained" onClick={handleCloseModEdit}>
                    Back
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      {/* Submit DIALOG */}
      <Dialog
        open={isAddOpenalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            padding: "37px 23px",
            width: "350px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Updated Successfully👍</b>
          </Typography>
        </DialogContent>
      </Dialog>
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

      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ padding: "20px" }}>
          <Typography sx={userStyle.HeaderText}>
            Manual Salary Details Info
          </Typography>

          <Box>
            <br />
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelectInfo"
                    size="small"
                    value={pageSizeInfo}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeInfo}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={empDetailInfo?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQueryInfo}
                      onChange={handleSearchChangeInfo}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Box
              style={{
                width: "100%",
                overflowY: "hidden", // Hide the y-axis scrollbar
              }}
            >
              <StyledDataGridInfo
                rows={rowDataTableInfo}
                columns={columnDataTableInfo}
                onSelectionModelChange={handleSelectionChange}
                autoHeight={true}
                ref={gridRefinfo}
                density="compact"
                hideFooter
                getRowClassName={getRowClassName}
                disableRowSelectionOnClick
              />
            </Box>
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing{" "}
                {filteredDataInfo.length > 0
                  ? (pageInfo - 1) * pageSizeInfo + 1
                  : 0}{" "}
                to {Math.min(pageInfo * pageSizeInfo, filteredDatasInfo.length)}{" "}
                of {filteredDatasInfo.length} entries
              </Box>
              <Box>
                <Button
                  onClick={() => setPageInfo(1)}
                  disabled={pageInfo === 1}
                  sx={userStyle.paginationbtn}
                >
                  <FirstPageIcon />
                </Button>
                <Button
                  onClick={() => handlePageChangeInfo(pageInfo - 1)}
                  disabled={pageInfo === 1}
                  sx={userStyle.paginationbtn}
                >
                  <NavigateBeforeIcon />
                </Button>
                {pageNumbersInfo?.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    sx={userStyle.paginationbtn}
                    onClick={() => handlePageChangeInfo(pageNumber)}
                    className={pageInfo === pageNumber ? "active" : ""}
                    disabled={pageInfo === pageNumber}
                  >
                    {pageNumber}
                  </Button>
                ))}
                {lastVisiblePageInfo < totalPagesInfo && <span>...</span>}
                <Button
                  onClick={() => handlePageChangeInfo(pageInfo + 1)}
                  disabled={pageInfo === totalPagesInfo}
                  sx={userStyle.paginationbtn}
                >
                  <NavigateNextIcon />
                </Button>
                <Button
                  onClick={() => setPage(totalPagesInfo)}
                  disabled={pageInfo === totalPagesInfo}
                  sx={userStyle.paginationbtn}
                >
                  <LastPageIcon />
                </Button>
              </Box>
            </Box>

            <br />
            <Button variant="contained" onClick={handleCloseinfo}>
              {" "}
              Back{" "}
            </Button>
          </Box>
        </Box>
      </Dialog>

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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Name </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.company} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell>{row.unit} </StyledTableCell>
                  <StyledTableCell>{row.team} </StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell> {row.companyname}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
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

export default Assignmanualsalarydetails;
