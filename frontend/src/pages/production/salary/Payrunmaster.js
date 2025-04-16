import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Dialog, DialogContent, List, ListItem, ListItemText, Popover, TextField, IconButton, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileExcel } from "react-icons/fa";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
// import { handleApiError } from "../../../components/Errorhandling";
import StyledDataGrid from "../../../components/TableStyle";
import moment from "moment-timezone";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Headtitle from "../../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import UndoIcon from "@mui/icons-material/Undo";
// import * as XLSX from 'xlsx';
import Selects from "react-select";
import ExportData from "../../../components/ExportData";


function PayrunMaster() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [manageshortagemasters, setManageshortagemasters] = useState([]);
  const [revenueAmount, setRevenueAmount] = useState([]);
  const [salSlabs, setsalSlabs] = useState([]);
  const [eraAmounts, setEraAmounts] = useState([]);
  const [acPointCal, setAcPointCal] = useState([]);
  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);

  const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Multiselectdropdowns
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState([]);

  // Multiselectdropdowns
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [employeesDrops, setEmployeesDrops] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [selectedMonthExcel, setSelectedMonthExcel] = useState("")

  const [employeesPayRun, setEmployeesPayRun] = useState([]);
  const { auth } = useContext(AuthContext);

  const CustomStyledDataGrid = styled(StyledDataGrid)(({ theme }) => ({
    "& .MuiDataGrid-columnHeaderTitle": {
      fontSize: "14px",
      fontWeight: "bold !important",
      lineHeight: "15px",
      whiteSpace: "normal", // Wrap text within the available space
      overflow: "visible", // Allow overflowed text to be visible
      minWidth: "20px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "60px !important",
      maxHeight: "60px",
    },
    "& .MuiDataGrid-row": {
      fontSize: "12px", // Change the font size for row data
      minWidth: "20px",
      color: "#000000de",
      // minHeight: "50px !important",
      // Add any other styles you want to apply to the row data
    },
    '& .MuiDataGrid-cell': {
      whiteSpace: 'normal !important',
      wordWrap: 'break-word !important',
      lineHeight: '1.2 !important',  // Optional: Adjusts line height for better readability
    },
    '& .MuiDataGrid-row:nth-of-type(odd)': {
      backgroundColor: '#f5f5f5',  // Light grey for odd rows
    },
    '& .MuiDataGrid-row:nth-of-type(even)': {
      backgroundColor: '#ffffff',  // White for even rows
    },


  }));



  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let currentMonth = monthsArr[mm - 1];

  const [selectedYear, setSelectedYear] = useState(yyyy);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedMonthNum, setSelectedMonthNum] = useState(mm);
  const [selectmonthname, setSelectMonthName] = useState(currentMonth);

  const [items, setItems] = useState([]);
  //yeardropdown
  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }
  //month dropdown options
  const months = [
    { value: "January", label: "January", numval: 1 },
    { value: "February", label: "February", numval: 2 },
    { value: "March", label: "March", numval: 3 },
    { value: "April", label: "April", numval: 4 },
    { value: "May", label: "May", numval: 5 },
    { value: "June", label: "June", numval: 6 },
    { value: "July", label: "July", numval: 7 },
    { value: "August", label: "August", numval: 8 },
    { value: "September", label: "September", numval: 9 },
    { value: "October", label: "October", numval: 10 },
    { value: "November", label: "November", numval: 11 },
    { value: "December", label: "December", numval: 12 },
  ];

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    // updateDateValue(selectedYear, event.value);
    setSelectMonthName(event.label);
    setSelectedMonthNum(event.numval);
  };

  const [isBankdetail, setBankdetail] = useState(false);

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Pay Run Master.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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

  const fetchCompanies = async () => {
    setBankdetail(true);
    try {
      const [RES_COM, RES_BRANCH, RES_USERS, RES_UNIT, RES_DESIG, RES_TEAMS, RES_SHIFT, RES_SALARYSLAB, RES_SHORTAGE, RES_ERA, RES_REVENUE, RES_ACPOINT, RES_ATTSTS, RES_ATTMODE
      ] = await Promise.all([
        axios.get(SERVICE.COMPANY, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.BRANCH, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.USERS_LIMITED_DROPDOWN_FINALSALARY, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.UNIT, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.DESIGNATION, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.TEAMS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.SHIFTS_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.SALARYSLAB_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.MANAGESHORTAGEMASTER, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ERAAMOUNTSLIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.REVENUEAMOUNTSLIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ACPOINTCALCULATION, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ATTENDANCE_STATUS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ATTENDANCE_MODE_STATUS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),

      ]);

      setAcPointCal(RES_ACPOINT?.data?.acpointcalculation);
      setRevenueAmount(RES_REVENUE?.data?.revenueamounts);
      setEraAmounts(RES_ERA?.data?.eraamounts);
      setManageshortagemasters(RES_SHORTAGE?.data?.manageshortagemasters);
      setsalSlabs(RES_SALARYSLAB.data.salaryslab);
      setShifts(RES_SHIFT?.data?.shifts);

      setTeams(RES_TEAMS.data.teamsdetails);
      setDesignations(RES_DESIG.data.designation);
      setUnits(RES_UNIT.data.units);
      setEmployeesDrops(RES_USERS.data.users);
      setBranches(RES_BRANCH.data.branch);
      setCompanies(RES_COM.data.companies);
      setAttStatus(RES_ATTSTS?.data?.attendancestatus);
      setAttModearr(RES_ATTMODE?.data?.allattmodestatus);
      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      if (selectedUnit.length > 0 || selectedTeam.length > 0) {
        let res_min = await axios.get(SERVICE.TEAMS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        let removeDupes = res_min.data.teamsdetails.filter((d) => (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(d.unit) : true) && (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(d.teamname) : true));

        const seen = new Set();
        let removedDupeDatas = removeDupes.filter((item) => {
          const value = item["department"];
          if (seen.has(value)) {
            return false;
          }
          seen.add(value);
          return true;
        });
        setDepartments(
          removedDupeDatas.map((item) => ({
            label: item.department,
            value: item.department,
          }))
        );
      } else {
        let res_min = await axios.get(SERVICE.DEPARTMENT, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setDepartments(
          res_min.data.departmentdetails.map((item) => ({
            label: item.deptname,
            value: item.deptname,
          }))
        );
      }
      let res_min = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentsList(res_min.data.departmentdetails);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
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
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    legalname: true,
    doj: true,
    department: true,
    designation: true,
    processcodeexp: true,
    experience: true,
    prodexp: true,

    //need to fetch from users
    bankname: true,
    accountname: true,
    accountnumber: true,
    ifsccode: true,
    totalnumberofdays: true,
    totalshift: true,
    clsl: true,
    weekoff: true,
    holiday: true,
    totalasbleave: true,
    totalpaidDays: true,

    //fetched from salary slab filter
    newgross: true,
    actualbasic: true,
    actualhra: true,
    actualconveyance: true,
    actualmedicalallowance: true,
    actualproductionallowance: true,
    actualproductionallowancetwo: true,
    actualotherallowance: true,
    oldgross: true,
    oldbasic: true,
    oldhra: true,
    oldconveyance: true,
    oldmedicalallowance: true,
    oldproductionallowance: true,
    oldproductionallowancetwo: true,
    oldotherallowance: true,


    //need to fetch from daypoints upload
    targetpoints: true,
    acheivedpoints: true,
    acheivedpercent: true,
    actualpenalty: true,
    penaltyamt: true,
    uan: true,
    pfmembername: true,
    insuranceno: true,
    ipname: true,
    noallowanceshift: true,
    shiftallowancepoint: true,
    shiftallowancetarget: true,
    nightshiftallowance: true,
    era: true,

    revenueallow: true,
    shortage: true,
    monthPoint: true,

    currentmonthavg: true,
    currentmonthattendance: true,
    paidstatus: true,
  };



  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };




  const [fileFormat, setFormat] = useState('')

  let exportColumnNames = [

    'Company',
    'Branch',
    'Unit',
    'Emp Code',
    'Aadhar Name',
    'Comapny Name',
    'Team',
    'Process Code',
    'DOJ',
    'Experience',
    'Bank Name',
    'Account Name',
    'Account Number',
    'IFSC Code',
    'Total Number of Days',
    'Total Shift',
    'C.L / S.L',
    'Weekoff',
    'Holiday',
    'Total Absent/Leave',
    'Total Paid Days',
    'Gross',
    'Basic',
    'Hra',
    'Conveyance',
    'Medical Allowance',
    'Production Allowance',
    'Other Allowance',
    'Target Points',
    'Acheived Points',
    'Acheived Percent',
    'Actual Penalty',
    'UAN',
    'PF Member Name',

    'Insurance NO',
    'IP Name',
    'No Allowance Shift',
    'Shift Allowance Point',
    'ERA',
    'Revenue Allowance',
    'Shortage',
    `Current (${monthsArr[Number(selectedMonthExcel) >= 12 ? 0 : Number(selectedMonthExcel)]}) Month Avg`,
    `Current (${monthsArr[Number(selectedMonthExcel) >= 12 ? 0 : Number(selectedMonthExcel)]}) Month Attendance`,
    'Paid Status'
  ]
  let exportRowValues = [
    'company',
    'branch', 'unit',
    'empcode', 'legalname',
    'companyname', 'team',
    'processcodeexp', 'doj',
    'experience', 'bankname',
    'accountname', 'accountnumber',
    'ifsccode', 'totalnumberofdays',
    'totalshift', 'clsl',
    'weekoff', 'holiday',
    'totalasbleave', 'totalpaidDays',
    'gross', 'basic',
    'hra', 'conveyance',
    'medicalallowance', 'productionallowance',
    'otherallowance', 'monthPoint',
    'acheivedpoints', 'acheivedpercent',
    'actualpenalty', 'uan',
    'pfmembername',
    'insuranceno', 'ipname',
    'noallowanceshift', 'shiftallowancepoint',
    'era', 'revenueallow',
    'shortage', 'currentmonthavg',
    'currentmonthattendance', 'paidstatus'
  ]


  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);



  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };




  //  PDF
  const columns = [
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Emp Code", dataKey: "empcode" },
    { title: "Aadhar Name", dataKey: "legalname" },
    { title: "Comapny Name", dataKey: "companyname" },
    { title: "Team", dataKey: "team" },
    { title: "Process Code", dataKey: "processcodeexp" },
    { title: "DOJ", dataKey: "doj" },
    { title: "Experience", dataKey: "experience" },
    { title: "Bank Name", dataKey: "bankname" },
    { title: "Account Name", dataKey: "accountname" },
    { title: "Account Number", dataKey: "accountnumber" },
    { title: "IFSC Code", dataKey: "ifsccode" },
    { title: "Total Number of Days", dataKey: "totalnumberofdays" },
    { title: "Total Shift", dataKey: "totalshift" },
    { title: "C.L / S.L", dataKey: "clsl" },
    { title: "Weekoff", dataKey: "weekoff" },
    { title: "Holiday", dataKey: "holiday" },
    { title: "Total Absent/Leave", dataKey: "totalasbleave" },
    { title: "Total Paid Days", dataKey: "totalpaidDays" },
    // { title: "Calcualted", dataKey: "calcualted" },
    { title: "Gross", dataKey: "gross" },
    { title: "Basic", dataKey: "basic" },
    { title: "Hra", dataKey: "hra" },
    { title: "Conveyance", dataKey: "conveyance" },
    { title: "Medical Allowance", dataKey: "medicalallowance" },
    { title: "Production Allowance", dataKey: "productionallowance" },
    { title: "Other Allowance", dataKey: "otherallowance" },
    { title: "Target Points", dataKey: "monthPoint" },
    { title: "Acheived Points", dataKey: "acheivedpoints" },
    { title: "Acheived Percent", dataKey: "acheivedpercent" },
    { title: "Actual Penalty", dataKey: "actualpenalty" },
    { title: "UAN", dataKey: "uan" },
    { title: "PF Member Name", dataKey: "pfmembername" },
    { title: "Insurance NO", dataKey: "insuranceno" },
    { title: "IP Name", dataKey: "ipname" },
    { title: "No Allowance Shift", dataKey: "noallowanceshift" },
    { title: "Shift Allowance Point", dataKey: "shiftallowancepoint" },

    { title: "ERA", dataKey: "era" },
    { title: "Revenue Allowance", dataKey: "revenueallow" },

    { title: "Shortage", dataKey: "shortage" },
    { title: "Current Month Avg", dataKey: "currentmonthavg" },
    { title: "CurrenT Month Attendance", dataKey: "currentmonthattendance" },
    { title: "Paid Status", dataKey: "paidstatus" },
  ];

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const maxColumnsPerPage = 15; // Maximum number of columns per page
    const totalPages = Math.ceil(columns.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columns.length);

      const currentPageColumns = columns.slice(startIdx, endIdx);

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: rowDataTable,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }

    doc.save("Pay Run Master.pdf");
  };

  // Excel
  const fileName = `Pay Run Master (${selectedMonth}-${selectedYear})`;

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: fileName,
    pageStyle: "print",
  });


  //submit option for saving
  const handleFilter = async (e) => {

    // e.preventDefault();
    // if (selectedCompany.length === 0) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } else if (selectedBranch.length === 0) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } else if (selectedUnit.legnth === 0 && selectedTeam.length === 0 && selectedDepartment.length === 0 && selectedDesignation.length === 0) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team or Department or Designation"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } 
    // else

    // let findDeptDupe = payRunList.filter(d => d.month == selectedMonth && d.year == String(selectedYear) && selectedDepartment.map(d => d.value).includes(d.department));

    if (selectedDepartment.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    }
    //  else if (findDeptDupe.length > 0) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />

    //       <p >{`Alredy this`}</p>
    //       <p style={{ fontSize: "20px", fontWeight: 900, wordBreak: "break-word" }}>{findDeptDupe.map(d => d.department).join(", ")}</p>
    //       <p>{`department Added for this selected Month and Year`}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else {
      setBankdetail(true);
      try {
        setSelectedMonthExcel(Number(selectedMonthNum))

        let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: selectedDepartment.map((item) => item.value),
          branch: selectedBranch.map((item) => item.value),
          unit: selectedUnit.map((item) => item.value),
          team: selectedTeam.map((item) => item.value),
          employees: selectedEmployee.map((item) => item.value),
          month: String(selectmonthname),
          year: String(selectedYear),
        });
        let employeelistnames = res.data.users.length > 0 ? [...new Set(res.data.users.map(item => item.companyname))] : []

        if (res.data.users.length > 0) {
          function splitArray(array, chunkSize) {
            const resultarr = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              const chunk = array.slice(i, i + chunkSize);
              resultarr.push({

                data: chunk,
                month: Number(selectedMonthNum),
                year: Number(selectedYear),
              });
            }
            return resultarr;
          }
          function splitArray2(array, chunkSize) {
            const resultarr2 = [];
            for (let i = 0; i < array.length; i += chunkSize) {
              const chunk = array.slice(i, i + chunkSize);
              resultarr2.push({
                data: chunk,
                month: Number(selectedMonthNum) + 1 >= 12 ? 1 : Number(selectedMonthNum) + 1,
                year: Number(selectedMonthNum) + 1 >= 12 ? Number(selectedYear) + 1 : Number(selectedYear),
              });
            }
            return resultarr2;
          }

          const resultarr = splitArray(employeelistnames, 5);
          const resultarr2 = splitArray2(employeelistnames, 5);

          let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            status: String("Approved"),
          });

          let leaveresult = res_applyleave?.data?.applyleaves;

          async function sendBatchRequest(batch) {
            try {
              let res_usershift = await axios.post(SERVICE.USER_ATTENDANCE_PAYRUN, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                department: selectedDepartment.map((item) => item.value),
                employees: batch.data,
                ismonth: batch.month,
                isyear: batch.year,

              });
              let countByEmpcodeClockin = {}; // Object to store count for each empcode
              let countByEmpcodeClockout = {};
              // return res_usershift.data.finaluser;
              // console.log(res_usershift.data.finaluser, 'res_usershift.data.finaluser')

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
                    updatedClockInStatus = 'BeforeWeekOffLeave';
                    updatedClockOutStatus = 'BeforeWeekOffLeave';
                  }
                  if (isPreviousDayAbsent) {
                    updatedClockInStatus = 'BeforeWeekOffAbsent';
                    updatedClockOutStatus = 'BeforeWeekOffAbsent';
                  }
                  if (isNextDayLeave) {
                    updatedClockInStatus = 'AfterWeekOffLeave';
                    updatedClockOutStatus = 'AfterWeekOffLeave';
                  }
                  if (isNextDayAbsent) {
                    updatedClockInStatus = 'AfterWeekOffAbsent';
                    updatedClockOutStatus = 'AfterWeekOffAbsent';
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
                  attendanceauto: getattendancestatus(updatedClockInStatus, updatedClockOutStatus),
                  daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus),
                  lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                  loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                  lopcalculation: getFinalLop(
                    getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                    getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                  ),
                  lopcount: getCount(
                    getFinalLop(
                      getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                      getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                    )
                  ),
                  modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                  paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                  paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                  paidpresent: getFinalPaid(
                    getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                    getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                  ),
                  paidpresentday: getAssignLeaveDayForPaid(
                    getFinalPaid(
                      getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                      getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                    )
                  ),
                  // weekoffCount: attresult.length > 0 ? uniqueWeekOffDates.filter(d => !uniqueAttandanceDates.includes(d)).length : uniqueWeekOffDates.length,
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

                  // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
                  //     finalresult[existingEntryIndex].leaveCount++;
                  // }
                  if (leaveOnDateApproved) {
                    // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                    finalresult[existingEntryIndex].leaveCount++;
                    // }
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
                    // weekoff: item.weekoffCount,
                    weekoff: (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,
                    lopcount: item.lopcount,
                    paidpresentday: item.paidpresentday,
                    totalcounttillcurrendate: item.totalcounttillcurrendate,
                    totalshift: item.totalshift,
                    holidayCount: (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') ? 1 : 0,
                    // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                    // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
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
              return finalresult
            } catch (error) {

              console.error('Error in sending batch request:', error);
              return [];
            }
          }


          // async function getAllResults() {
          //   let allResults = [];
          //   let allResults2 = [];
          //   for (let batch of resultarr) {
          //     const finaldata = await sendBatchRequest(batch);
          //     allResults = allResults.concat(finaldata);

          //   }
          //   for (let batch of resultarr2) {
          //     const finaldata = await sendBatchRequest(batch);
          //     allResults2 = allResults2.concat(finaldata);

          //   }

          //   return { allResults, allResults2 }; // Return both results as an object
          // }
          async function getAllResults() {
            const [allResults, allResults2] = await Promise.all([
              processBatches(resultarr),
              processBatches(resultarr2)
            ]);

            return { allResults, allResults2 };
          }

          async function processBatches(resultArray) {
            let results = [];
            for (let batch of resultArray) {
              const finaldata = await sendBatchRequest(batch);
              results = results.concat(finaldata);
            }
            return results;
          }

          async function fetchApiData() {
            try {
              const [prodFilter, prodFilterNxt, penaltyFilter, Res, res_employee, res_employeeNxt] = await Promise.all([
                axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER, {
                  headers: { Authorization: `Bearer ${auth.APIToken}` },
                  ismonth: Number(selectedMonthNum),
                  isyear: Number(selectedYear),
                }),
                axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER_NXTMONTH, {
                  headers: { Authorization: `Bearer ${auth.APIToken}` },
                  ismonth: Number(selectedMonthNum) >= 12 ? 1 : Number(selectedMonthNum) + 1,
                  isyear: Number(selectedMonthNum) >= 12 ? Number(selectedYear) + 1 : Number(selectedYear),
                }),
                axios.post(SERVICE.PENALTY_DAY_FILTERED, {
                  headers: { Authorization: `Bearer ${auth.APIToken}` },
                  ismonth: Number(selectedMonthNum),
                  isyear: Number(selectedYear),
                }),
                axios.post(SERVICE.PAIDSTATUSFIX_LIMITED, {
                  headers: { Authorization: `Bearer ${auth.APIToken}` },
                  month: selectedMonth,
                  year: selectedYear,
                }),
                axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
                  headers: { Authorization: `Bearer ${auth.APIToken}` },
                  monthname: selectedMonth,
                  year: selectedYear,
                }),
                axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
                  headers: { Authorization: `Bearer ${auth.APIToken}` },
                  monthname: selectedMonthNum >= 12 ? "January" : monthsArr[selectedMonthNum],
                  year: selectedMonthNum >= 12 ? String(Number(selectedYear) + 1) : selectedYear,
                }),
              ]);

              return {
                dayPointsUser: prodFilter.data.answer,
                dayPointsUserNxtMonth: prodFilterNxt.data.answer,
                dayPenaltyUser: penaltyFilter.data.answer,
                paidStatusFix: Res?.data?.paidstatusfixs,
                monthSets: res_employee.data.departmentdetails,
                monthSetsNxt: res_employeeNxt.data.departmentdetails,
              };
            } catch (err) {

              console.error('Error fetching API data:', err.response?.data?.message || err);
              throw err;
            }
          }

          getAllResults().then(results => {
            console.log('Final consolidated results for resultarr:', results.allResults.length);
            console.log('Final consolidated results for resultarr2:', results.allResults2.length);

            function splitArrayItems(array, chunkSize) {
              const resultarr = [];
              for (let i = 0; i < array.length; i += chunkSize) {
                const chunk = array.slice(i, i + chunkSize);
                resultarr.push({

                  emps: chunk,
                });
              }
              return resultarr;
            }

            const resultarrItems = splitArrayItems(res.data.users, 50);


            function processEmployeeItem(item, index, data) {
              // console.log(item, index, data, 'sdfgdf')
              let finalresult = results.allResults;
              let finalresultNxt = results.allResults2;

              let dayPointsUser = data.dayPointsUser;
              let dayPointsUserNxtMonth = data.dayPointsUserNxtMonth;
              let dayPenaltyUser = data.dayPenaltyUser;
              let paidStatusFix = data.paidStatusFix;

              let monthSets = data.monthSets;
              let monthSetsNxt = data.monthSetsNxt;

              // console.log(bankDetails, "3", index)
              let findTotalNoOfDays = finalresult.find((d) => d.company == item.company && d.branch == item.branch && d.department == item.department && d.team == item.team && d.empcode == item.empcode && d.unit == item.unit && d.username == item.companyname);
              let findTotalNoOfDaysNxtMonth = finalresultNxt.find((d) => d.company == item.company && d.branch == item.branch && d.department == item.department && d.team == item.team && d.empcode == item.empcode && d.unit == item.unit && d.username == item.companyname);


              const groupedByMonth = {};

              // Group items by month
              item.assignExpLog && item.assignExpLog.forEach((item) => {
                const monthYear = item.updatedate.split("-").slice(0, 2).join("-");
                if (!groupedByMonth[monthYear]) {
                  groupedByMonth[monthYear] = [];
                }
                groupedByMonth[monthYear].push(item);
              });

              // Extract the last item of each group
              const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

              // Filter the data array based on the month and year
              lastItemsForEachMonth.sort((a, b) => {
                return new Date(a.updatedate) - new Date(b.updatedate);
              });
              // Find the first item in the sorted array that meets the criteria
              let filteredDataMonth = null;
              for (let i = 0; i < lastItemsForEachMonth.length; i++) {
                const date = lastItemsForEachMonth[i]?.updatedate;
                const splitedDate = date?.split("-");
                const itemYear = splitedDate ? splitedDate[0] : -1;
                const itemMonth = splitedDate ? splitedDate[1] : -1; // Adding 1 because getMonth() returns 0-indexed month
                if (Number(itemYear) === selectedYear && Number(itemMonth) === Number(selectedMonthNum)) {
                  filteredDataMonth = lastItemsForEachMonth[i];
                  break;
                } else if (Number(itemYear) < selectedYear || (Number(itemYear) === selectedYear && Number(itemMonth) < Number(selectedMonthNum))) {
                  filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
                } else {
                  break; // Break the loop if we encounter an item with year and month greater than selected year and month
                }
              }
              // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
              let modevalue = filteredDataMonth;

              let selectedmonthnumalter = Number(selectedMonthNum) <= 9 ? `0${Number(selectedMonthNum)}` : selectedMonthNum;

              let selectedMonStartDate = selectedYear + "-" + selectedmonthnumalter + "-01";

              let findexp = monthSets.find((d) => d.department === item.department);
              let findexpNxt = monthSetsNxt.find((d) => d.department === item.department);

              let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

              //NEXT MONTH MONTH START AND END DATE

              let selectedmonthnumalterNxt = Number(selectedMonthNum) + 1 >= 12 ? "01" : Number(selectedMonthNum) + 1 <= 9 ? `0${Number(selectedMonthNum) + 1}` : Number(selectedMonthNum) + 1;

              let Nxtmonth = Number(selectedMonthNum) + 1 >= 12 ? 1 : Number(selectedMonthNum) + 1;
              let Nxtyear = Number(selectedMonthNum) + 1 >= 12 ? Number(selectedYear) + 1 : selectedYear;

              const NxtnextMonthFirstDay = new Date(Number(Nxtyear), Number(Nxtmonth), 1);

              // Subtract one day to get the last day of the given month
              const lastDateNxtNextmonth = new Date(NxtnextMonthFirstDay - 1);

              let lastdateOfNxtSelectedMonth = lastDateNxtNextmonth.getDate();

              let selectedMonNxtStartDate = `${Nxtyear}-${selectedmonthnumalterNxt}-01`;

              let selectedMonNxtEndDate = `${Nxtyear}-${selectedmonthnumalterNxt}-${lastdateOfNxtSelectedMonth}`;

              let findNxtStartDate = findexpNxt ? findexpNxt.fromdate : selectedMonNxtStartDate;
              let findNxtEndDate = findexpNxt ? findexpNxt.todate : selectedMonNxtEndDate;

              const calculateMonthsBetweenDates = (startDate, endDate) => {
                if (startDate && endDate) {
                  const start = new Date(startDate);
                  const end = new Date(endDate);

                  let years = end.getFullYear() - start.getFullYear();
                  let months = end.getMonth() - start.getMonth();
                  let days = end.getDate() - start.getDate();

                  // Convert years to months
                  months += years * 12;

                  // Adjust for negative days
                  if (days < 0) {
                    months -= 1; // Subtract a month
                    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
                  }

                  // Adjust for days 15 and above
                  if (days >= 15) {
                    months += 1; // Count the month if 15 or more days have passed
                  }

                  return months;
                }

                return 0; // Return 0 if either date is missing
              };

              // Calculate difference in months between findDate and item.doj
              let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
              if (modevalue) {
                //findexp end difference yes/no
                if (modevalue.endexp === "Yes") {
                  differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
                  //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                  if (modevalue.expmode === "Add") {
                    differenceInMonthsexp += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Minus") {
                    differenceInMonthsexp -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Fix") {
                    differenceInMonthsexp = parseInt(modevalue.expval);
                  }
                } else {
                  differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                  // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                  if (modevalue.expmode === "Add") {
                    differenceInMonthsexp += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Minus") {
                    differenceInMonthsexp -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Fix") {
                    differenceInMonthsexp = parseInt(modevalue.expval);
                  } else {
                    // differenceInMonths = parseInt(modevalue.expval);
                    differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                  }
                }

                //findtar end difference yes/no
                if (modevalue.endtar === "Yes") {
                  differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
                  //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                  if (modevalue.expmode === "Add") {
                    differenceInMonthstar += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Minus") {
                    differenceInMonthstar -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Fix") {
                    differenceInMonthstar = parseInt(modevalue.expval);
                  }
                } else {
                  differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                  if (modevalue.expmode === "Add") {
                    differenceInMonthstar += parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Minus") {
                    differenceInMonthstar -= parseInt(modevalue.expval);
                  } else if (modevalue.expmode === "Fix") {
                    differenceInMonthstar = parseInt(modevalue.expval);
                  } else {
                    // differenceInMonths = parseInt(modevalue.expval);
                    differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                  }
                }

                differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                if (modevalue.expmode === "Add") {
                  differenceInMonths += parseInt(modevalue.expval);
                } else if (modevalue.expmode === "Minus") {
                  differenceInMonths -= parseInt(modevalue.expval);
                } else if (modevalue.expmode === "Fix") {
                  differenceInMonths = parseInt(modevalue.expval);
                } else {
                  // differenceInMonths = parseInt(modevalue.expval);
                  differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                }
              } else {
                differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
              }


              //GET PROCESS CODE FUNCTION
              const groupedByMonthProcs = {};

              // Group items by month
              item.processlog && item.processlog.forEach((item) => {
                const monthYear = item.date?.split("-")?.slice(0, 2).join("-");
                if (!groupedByMonthProcs[monthYear]) {
                  groupedByMonthProcs[monthYear] = [];
                }
                groupedByMonthProcs[monthYear].push(item);
              });

              // Extract the last item of each group
              const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

              // Filter the data array based on the month and year
              lastItemsForEachMonthPros.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
              });
              // Find the first item in the sorted array that meets the criteria
              let filteredItem = null;
              for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                const date = lastItemsForEachMonthPros[i]?.date;
                const splitedDate = date?.split("-");
                const itemYear = splitedDate ? splitedDate[0] : -1;
                const itemMonth = splitedDate ? splitedDate[1] : -1; // Adding 1 because getMonth() returns 0-indexed month
                if (Number(itemYear) === selectedYear && Number(itemMonth) === Number(selectedMonthNum)) {
                  filteredItem = lastItemsForEachMonthPros[i];
                  break;
                } else if (Number(itemYear) < selectedYear || (Number(itemYear) === selectedYear && Number(itemMonth) < Number(selectedMonthNum))) {
                  filteredItem = lastItemsForEachMonthPros[i]; // Keep updating the filteredItem until the criteria is met
                } else {
                  break; // Break the loop if we encounter an item with year and month greater than selected year and month
                }
              }

              let getprocessCode = filteredItem ? filteredItem.process : "";

              // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
              let processcodeexpvalue = item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "";

              //findsalary from salaryslab
              let findSalDetails = salSlabs.find((d) => d.company === item.company && d.branch === item.branch && d.salarycode === processcodeexpvalue);
              //shortageamount from shortage master
              let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
              //revenue amount from revenue  master
              let findRevenueAllow = revenueAmount.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvalue);
              //finderaamount from eraamount
              let findERAaountValue = eraAmounts.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvalue);

              let findAcPointVal = acPointCal.find((d) => d.company === item.company && d.branch === item.branch && d.department === item.department);


              //FIND SELECTEDMONTH MONTH END DATE
              const nextMonthFirstDay = new Date(Number(selectedYear), Number(selectedMonthNum), 1);

              // Subtract one day to get the last day of the given month
              const lastDate = new Date(nextMonthFirstDay - 1);

              let lastdateOfSelectedMonth = lastDate.getDate();
              let selectedMonEndDate = `${selectedYear}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
              let findmonthenddate = (findexp ? findexp.todate : selectedMonEndDate)


              let totalShiftTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
              let totalWeekoffTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;


              let totalShiftTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.shift) : 0;
              let totalWeekoffTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoff) : 0;

              //GET POINTS FOR SELECTEDMONTH
              let getdayPointsMonth = dayPointsUser
                .filter(
                  (d) =>
                    // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
                    d.date >= findDate && d.date <= (findexp ? findexp.todate : selectedMonEndDate)
                )
                .reduce((acc, current) => {
                  const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

                  if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.point += Number(current.point);
                    // existingItem.daypoint += Number(current.daypoint);
                    existingItem.target = Number(current.target) * (totalShiftTrgt - totalWeekoffTrgt);
                    existingItem.date.push(current.date);

                    existingItem.allowancepoint += (current.allowancepoint ? Number(current.allowancepoint) : 0);
                    if (current.allowancepoint > 1) {
                      existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
                    }

                    existingItem.avgpoint = existingItem.target > 0 ? ((existingItem.point / existingItem.target) * 100) : 0;

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
                      target: Number(current.target) * (totalShiftTrgt - totalWeekoffTrgt),
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
                      allowancepoint: current.allowancepoint ? Number(current.allowancepoint) : 0,
                      // noallowancepoint:Number(current.noallowancepoint),
                      noallowancepoint: (current.allowancepoint ? Number(current.allowancepoint) : 0) > 0 ? 1 : 0,
                    });
                  }
                  return acc;
                }, []);

              let findPointsDetails = getdayPointsMonth.find(
                (d) => d.companyname == item.company && d.branch == item.branch && d.unit == item.unit && d.team == item.team && d.name == item.companyname
                // && d.empcode === item.empcode
              );
              // console.log(findPointsDetails, 'findPointsDetails')
              //GET POINTS FOR CURRENT MONTH WHICH IS THE AFTER MONTH OF SELECTED MONTH
              let getdayPointsMonthNxtMonth = dayPointsUserNxtMonth
                .filter(
                  (d) =>
                    // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
                    d.date >= findNxtStartDate && d.date <= findNxtEndDate
                )
                .reduce((acc, current) => {
                  const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

                  if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.point += Number(current.point);
                    // existingItem.daypoint += Number(current.daypoint);
                    existingItem.target = Number(current.target) * (totalShiftTrgtNxt - totalWeekoffTrgtNxt);
                    existingItem.date.push(current.date);

                    existingItem.allowancepoint += Number(current.allowancepoint);
                    if (current.allowancepoint > 1) {
                      existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
                    }

                    existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;

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
                      target: Number(current.target) * (totalShiftTrgtNxt - totalWeekoffTrgtNxt),
                      // _id: current.id,
                      branch: current.branch,
                      date: [current.date],
                      unit: current.unit,
                      team: current.team,
                      empcode: current.empcode,

                      startDate: current.date,
                      endDate: current.date,
                      allowancepoint: Number(current.allowancepoint),

                      noallowancepoint: current.allowancepoint > 0 ? 1 : 0,
                    });
                  }
                  return acc;
                }, []);

              let findPointsDetailsNxtMonth = getdayPointsMonthNxtMonth.find(
                (d) => d.companyname == item.company && d.branch == item.branch && d.unit == item.unit && d.team == item.team && d.name == item.companyname
                // && d.empcode === item.empcode
              );

              // console.log(dayPointsUserNxtMonth.length, findNxtStartDate, findNxtEndDate, "dayPointsUserNxtMonth");

              let getdayPenaltyMonth = dayPenaltyUser
                .filter((d) => d.date >= findDate && d.date <= (findexp ? findexp.todate : lastdateOfSelectedMonth))
                .reduce((acc, current) => {
                  const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

                  if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.amount += Number(current.amount);

                    existingItem.date.push(current.date);

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
                      company: current.company,
                      name: current.name,
                      amount: Number(current.amount),
                      _id: current.id,
                      branch: current.branch,
                      date: [current.date],
                      unit: current.unit,
                      team: current.team,
                      empcode: current.empcode,
                      startDate: current.date,
                      endDate: current.date,
                    });
                  }
                  return acc;
                }, []);

              let findPenaltyDetails = getdayPenaltyMonth.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.team === item.team && d.name === item.companyname);

              let shiftAllowAmt =
                item.shiftallowancelog && item.shiftallowancelog.length > 0
                  ? item.shiftallowancelog.filter((d) => {

                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];

              let TargetPointAmt =
                item.targetpointlog && item.targetpointlog.length > 0
                  ? item.targetpointlog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];

              let AcheivedPointAmt =
                item.acheivedpointlog && item.acheivedpointlog.length > 0
                  ? item.acheivedpointlog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];
              let PenaltyPointAmt =
                item.penaltylog && item.penaltylog.length > 0
                  ? item.penaltylog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];
              let totalPaidDaysLogVal =
                item.totalpaiddayslog && item.totalpaiddayslog.length > 0
                  ? item.totalpaiddayslog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];
              let totalAbsentLogVal =
                item.totalabsentlog && item.totalabsentlog.length > 0
                  ? item.totalabsentlog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];
              let currMonAvgLogVal =
                item.currmonthavglog && item.currmonthavglog.length > 0
                  ? item.currmonthavglog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];
              let currMonAttLogVal =
                item.currmonthattlog && item.currmonthattlog.length > 0
                  ? item.currmonthattlog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];

              let noShiftLogVal =
                item.noshiftlog && item.noshiftlog.length > 0
                  ? item.noshiftlog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];

              let shiftAllowTargetlogVal =
                item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0
                  ? item.shiftallowtargetlog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];
              let nightShiftAllowlogLogVal =
                item.nightshiftallowlog && item.nightshiftallowlog.length > 0
                  ? item.nightshiftallowlog.filter((d) => {
                    return d.month === selectedMonth && d.year == selectedYear;
                  })
                  : [];

              let paidpresentdayvalue = findTotalNoOfDays ? findTotalNoOfDays.paidpresentday : 0;
              let leaveCountvalue = findTotalNoOfDays ? findTotalNoOfDays.leaveCount : 0;
              let holidayCountvalue = findTotalNoOfDays ? findTotalNoOfDays.holidayCount : 0;
              let shiftvalue = findTotalNoOfDays ? findTotalNoOfDays.shift : 0;
              let lopcountvalue = findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0;

              let paiddayscalcvalfrommonthstatus = Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue) > Number(shiftvalue) ? Number(shiftvalue) - Number(lopcountvalue) : Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue);

              let paidpresentdayallCalcVal = shiftvalue;
              let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
              let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0;
              let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : paiddayscalcvalfrommonthstatus;

              let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? TargetPointAmt[TargetPointAmt.length - 1].value : (findPointsDetails ? findPointsDetails.target : 0);
              let AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? AcheivedPointAmt[AcheivedPointAmt.length - 1].value : (findPointsDetails ? findPointsDetails.point.toFixed(2) : 0);
              // let AcheivedPercentCalcVal =
              //   item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 && item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0
              //     ? ((AcheivedPointAmt[AcheivedPointAmt.length - 1].value / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2)
              //     : item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0
              //       ? (((findPointsDetails ? findPointsDetails.point : 0) / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2)
              //       : item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0
              //         ? ((AcheivedPointAmt[AcheivedPointAmt.length - 1].value / (findPointsDetails ? findPointsDetails.target : 0)) * 100).toFixed(2)
              //         : (findPointsDetails ? findPointsDetails.avgpoint.toFixed(2) : 0);
              let AcheivedPercentCalcVal = targetPointCalcVaue > 0 ? ((Number(AcheivedPointsCalcVal) / Number(targetPointCalcVaue)) * 100).toFixed(2) : 0
              // console.log(findPointsDetails, 'findPointsDetails');

              let allowancepointCalcVal = item.shiftallowancelog && item.shiftallowancelog.length > 0 && shiftAllowAmt && shiftAllowAmt.length > 0 ? shiftAllowAmt[shiftAllowAmt.length - 1].value : (findPointsDetails ? (findPointsDetails.allowancepoint).toFixed(2) : 0);
              let ERAAmountCalcVal = findERAaountValue ? findERAaountValue.amount : 0;
              let penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value).toFixed(2) : (findPenaltyDetails ? findPenaltyDetails.amount.toFixed(2) : 0);

              let totalNoOfDaysCalcVal = findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0;

              //PRODUCTION AND PRODCTION ALLOWACE2
              let oldprodAllowanceCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.productionallowance : findSalDetails ? findSalDetails.productionallowance : 0;
              let oldprodAllowancetwoCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.productionallowancetwo : findSalDetails ? findSalDetails.productionallowancetwo : 0;
              // ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
              let oldactualBasicCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.basic : findSalDetails ? findSalDetails.basic : 0;
              let oldactualHraCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.hra : findSalDetails ? findSalDetails.hra : 0;
              let oldactualConveyanceCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.conveyance : findSalDetails ? findSalDetails.conveyance : 0;
              let oldactualMedicalAllowCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.medicalallowance : findSalDetails ? findSalDetails.medicalallowance : 0;
              let oldactualOtherCalVAL = modevalue && modevalue.expmode === "Manual" ? modevalue.otherallowance : findSalDetails ? findSalDetails.otherallowance : 0;



              const getDatesInRange = (fromDate, toDate) => {
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const startDate = new Date(fromDate);
                const endDate = new Date(toDate);

                // Add one day to include the end date
                endDate.setDate(endDate.getDate() + 1);

                let count = 0;
                for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
                  count++;
                }

                return count;
              };

              let tond = getDatesInRange(findDate, findmonthenddate)


              let prodAllowanceCalcVal = Number(((Number(oldprodAllowanceCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
              let prodAllowancetwoCalcVal = Number(((Number(oldprodAllowancetwoCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
              //calculated  ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
              let actualBasicCalcVal = Number(((Number(oldactualBasicCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));

              let actualHraCalcVal = Number(((Number(oldactualHraCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
              let actualConveyanceCalcVal = Number(((Number(oldactualConveyanceCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
              let actualMedicalAllowCalcVal = Number(((Number(oldactualMedicalAllowCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
              let actualOtherCalVAL = Number(((Number(oldactualOtherCalVAL) / tond) * totalNoOfDaysCalcVal).toFixed(2));

              let oldgross = modevalue && modevalue.expmode === "Manual" ? modevalue.gross :
                Number(oldactualBasicCalcVal) + Number(oldactualHraCalcVal) + Number(oldactualConveyanceCalcVal) + Number(oldactualMedicalAllowCalcVal) +
                Number(oldprodAllowanceCalcVal) + Number(oldactualOtherCalVAL)

              let grossValue = modevalue && modevalue.expmode === "Manual" ? modevalue.gross :
                actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal +
                prodAllowanceCalcVal + actualOtherCalVAL



              let currentMonthAttendanceVal = findTotalNoOfDaysNxtMonth ? findTotalNoOfDaysNxtMonth.lopcount : 0;
              let currentMonthAvgVal = findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0




              let getpaidStatusVal = paidStatusFix.find(d =>
                (d.month).toLowerCase() === selectedMonth.toLowerCase() && d.department.includes(item.department) && d.year == selectedYear
                && Number(totalasbleaveCalcVal) >= Number(d.fromvalue) && Number(totalasbleaveCalcVal) <= Number(d.tovalue) && Number(AcheivedPercentCalcVal) >= Number(d.frompoint) && Number(AcheivedPercentCalcVal) <= Number(d.topoint)

                && (d.currentabsentmodes === "Greater than or Equal" ? currentMonthAttendanceVal >= Number(d.currentabsentvalue) : d.currentabsentmodes === "Greater than" ? currentMonthAttendanceVal > Number(d.currentabsentvalue) : d.currentabsentmodes === "Less than or Equal" ? currentMonthAttendanceVal <= Number(d.currentabsentvalue) : currentMonthAttendanceVal < Number(d.currentabsentvalue))
                && (d.currentachievedmodes === "Greater than or Equal" ? currentMonthAvgVal >= Number(d.currentachievedvalue) : d.currentachievedmodes === "Greater than" ? currentMonthAvgVal > Number(d.currentachievedvalue) : d.currentachievedmodes === "Less than or Equal" ? currentMonthAvgVal <= Number(d.currentachievedvalue) : currentMonthAvgVal < Number(d.currentachievedvalue))

              )

              let paidStatusVal = getpaidStatusVal ? getpaidStatusVal.paidstatus : "";


              let currMonAvgFinalcalVal = item.currmonthavglog && item.currmonthavglog.length > 0 && currMonAvgLogVal && currMonAvgLogVal.length > 0 ? Number(currMonAvgLogVal[currMonAvgLogVal.length - 1].value) : currentMonthAvgVal;

              let currMonAttFinalcalVal = item.currmonthattlog && item.currmonthattlog.length > 0 && currMonAttLogVal && currMonAttLogVal.length > 0 ? Number(currMonAttLogVal[currMonAttLogVal.length - 1].value) : currentMonthAttendanceVal;
              let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : (findPointsDetails ? findPointsDetails.noallowancepoint : 0);

              // FIND SHIFTALLOWACE
              let checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
              let CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";

              // let noshiftlogvalfinal = noShiftLogVal

              let shiftallowancetarget = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? targetPointCalcVaue : 0;
              let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;
              // console.log(totalNoOfDaysCalcVal, totalpaiddaycalVal, allowancepointCalcVal, shiftallowancetargetfinal)
              let nightAllowancefinalcalculation = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? ((((1000 / totalNoOfDaysCalcVal) * totalpaiddaycalVal) * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100) : 0;
              // 1000 * 118.5

              let nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;


              return {
                ...item,
                serialNumber: index + 1,
                company: item.company,
                branch: item.branch,
                unit: item.unit,
                team: item.team,
                empcode: item.empcode,
                companyname: item.companyname,
                doj: item.doj ? moment(item.doj)?.format("DD-MM-YYYY") : "",
                experience: item.doj ? (calculateMonthsBetweenDates(item.doj, findDate) < 0 ? 0 : calculateMonthsBetweenDates(item.doj, findDate)) : "",
                //ASSIGN EXP LOG DETAILS
                endtar: modevalue ? modevalue.endtar : "",
                endtardate: modevalue && modevalue.endtardate ? moment(modevalue.endtardate)?.format("DD-MM-YYYY") : "",
                endexp: modevalue ? modevalue.endexp : "",
                endexpdate: modevalue && modevalue.endexpdate ? moment(modevalue.endexpdate)?.format("DD-MM-YYYY") : "",

                assignExpMode: modevalue ? modevalue.expmode : "",
                modevalue: modevalue ? modevalue.expval : "",

                targetexp: item.doj ? (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",
                prodexp: item.doj ? (differenceInMonthsexp > 0 ? differenceInMonthsexp : 0) : "",
                modeexp: item.doj ? (differenceInMonths > 0 ? differenceInMonths : 0) : "",

                processcode: item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode : "",
                salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
                processcodeexp: processcodeexpvalue,

                // gross: grossValue,

                //SALRY SLAB FILTER PAGE
                basic: actualBasicCalcVal,
                hra: actualHraCalcVal,
                conveyance: actualConveyanceCalcVal,
                medicalallowance: actualMedicalAllowCalcVal,
                productionallowance: prodAllowanceCalcVal,
                productionallowancetwo: prodAllowancetwoCalcVal,
                otherallowance: actualOtherCalVAL,

                oldgross: oldgross,
                oldbasic: oldactualBasicCalcVal,
                oldhra: oldactualHraCalcVal,
                oldconveyance: oldactualConveyanceCalcVal,
                oldmedicalallowance: oldactualMedicalAllowCalcVal,
                oldproductionallowance: oldprodAllowanceCalcVal,
                oldproductionallowancetwo: oldprodAllowancetwoCalcVal,
                oldotherallowance: oldactualOtherCalVAL,
                gross: grossValue,

                //REVENUE ALLOWANCE MASTER PAGE
                revenueallow: findRevenueAllow ? findRevenueAllow.amount : 0,
                //SHORTAGE MASTER PAGE
                shortage: findShortage ? findShortage.amount : 0,

                //ATTENDANCE MONTH STATUS
                totalnumberofdays: findTotalNoOfDays ? findTotalNoOfDays.totalcounttillcurrendate : 0,
                // totalshift: findTotalNoOfDays && Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),
                totalshift: totalshiftCalcVal,
                clsl: findTotalNoOfDays ? findTotalNoOfDays.clsl : 0,
                weekoffcount: findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0,
                holiday: findTotalNoOfDays ? findTotalNoOfDays.holiday : 0,
                totalasbleave: totalasbleaveCalcVal,
                totalpaidDays: totalpaiddaycalVal,


                //old value and log
                totalpaiddaycalVal1: paiddayscalcvalfrommonthstatus,
                totalabsentcalVal1: findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0,
                penaltyCalVal1: findPenaltyDetails ? findPenaltyDetails.amount.toFixed(2) : Number(0).toFixed(2),
                targetpointCalVal1: findPointsDetails ? findPointsDetails.target : 0,
                acheivedpointCalVal1: findPointsDetails ? findPointsDetails.point.toFixed(2) : Number(0).toFixed(2),
                shiftallowanceCalVal1: findPointsDetails ? (findPointsDetails.allowancepoint).toFixed(2) : Number(0).toFixed(2),
                // paidpresentday: Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),

                //LIST PRODUCTION POINTS
                monthPoint: targetPointCalcVaue,

                acheivedpoints: AcheivedPointsCalcVal,

                // acheivedpercent: item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? (((item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? AcheivedPointAmt[AcheivedPointAmt.length - 1].value : findPointsDetails && findPointsDetails.point) / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2) : findPointsDetails && findPointsDetails.avgpoint.toFixed(2),
                acheivedpercent: AcheivedPercentCalcVal,

                //DAY POINTS UPLOAD SHIFTALOWANCE AMOUNT
                allowancepoint: allowancepointCalcVal,
                noallowancepoint: noshiftlogvalfinal,

                //ERA MASTER PAGE
                eramount: ERAAmountCalcVal,
                //PENALTY MASTER PAGE
                penalty: penaltyCalcVal ? penaltyCalcVal : 0,
                //USER INOIVIDUAL VALUE
                ipname: item.ipname,
                insurancenumber: item.insurancenumber,
                pfmembername: item.pfmembername,
                uan: item.uan,

                currentmonthavg: Number(currMonAvgFinalcalVal),
                currentmonthavgCalVal1: findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0,


                currentmonthattendance: currMonAttFinalcalVal,
                currentmonthattCalVal1: currentMonthAttendanceVal,

                paidstatus: paidStatusVal,

                noshiftlog: item.noshiftlog,
                noshiftlogCalVal1: findPointsDetails ? findPointsDetails.noallowancepoint : 0,


                shiftallowancetarget: shiftallowancetargetfinal,
                nightshiftallowance: Number((nightAllowanceCalcVal).toFixed(2)),

                nightshiftallowlog: item.nightshiftallowlog,
                nightshiftallowlogCalVal1: nightAllowancefinalcalculation,

                shiftallowtargetlog: item.shiftallowtargetlog,
                shiftallowtargetlogCalVal1: shiftallowancetarget,
                from: findDate,
                to: findmonthenddate,
                selectedmonth: selectedMonth,
                selectedyear: selectedYear
              };


            }


            async function sendBatchRequestItems(batch, data) {


              try {
                const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItem(item, index, data));
                // const results = await Promise.all(itemsWithSerialNumber);
                return await Promise.all(itemsWithSerialNumber);

              } catch (err) {
                console.error('Error processing batch request items:', err);
                setBankdetail(false);
                const messages = err?.response?.data?.message;
                const alertMessage = messages || "Something went wrong!";

                setShowAlert(
                  <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{alertMessage}</p>
                  </>
                );

                handleClickOpenerr();
              }

            }


            async function getAllResultsItems() {
              try {
                const apiData = await fetchApiData();

                let allResultsItems = [];
                for (let batch of resultarrItems) {
                  const batchResults = await sendBatchRequestItems(batch, apiData);
                  allResultsItems.push(...batchResults);
                }

                return { allResultsItems };
              } catch (err) {
                console.log(err, 'err')
              }
            }

            getAllResultsItems().then(result => {
              // console.log(result);
              try {
                setSelectedMonthExcel(Number(selectedMonthNum))
                setItems(result.allResultsItems)

                setBankdetail(false);
              } catch (err) {

                console.log(err, 'err')
              }
            })


          }).catch(error => {

            console.error('Error in getting all results:', error);
          });

        }

      } catch (err) {
        console.log(err, '123')
        setBankdetail(false);
        const messages = err?.response?.data?.message;
        if (messages) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
            </>
          );
          handleClickOpenerr();
        } else {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something  5 went wrong!"}</p>
            </>
          );
          handleClickOpenerr();
        }
      }
    }
  };

  const [itemsOverall, setItemsOverall] = useState([])
  const addOverallData = async () => {
    const rowDataTableItems = items.sort((a, b) => {

      if (Number(b.experience) !== Number(a.experience)) {
        return Number(b.experience) - Number(a.experience);
      }

      return a.companyname.localeCompare(b.companyname);
    }).map((item, index) => {
      //shiftallowancepoint
      let shiftAllowAmt =
        item.shiftallowancelog && item.shiftallowancelog.length > 0
          ? item.shiftallowancelog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let allowancepointCalcVal = item.allowancepointCalcVal;

      // totalabsentleave
      let totalAbsentLogVal =
        item.totalabsentlog && item.totalabsentlog.length > 0
          ? item.totalabsentlog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : item.totalasbleave;

      // TARGETPOINTS
      let TargetPointAmt =
        item.targetpointlog && item.targetpointlog.length > 0
          ? item.targetpointlog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? TargetPointAmt[TargetPointAmt.length - 1].value : item.monthPoint;

      //acheivedpoint
      let AcheivedPointAmt =
        item.acheivedpointlog && item.acheivedpointlog.length > 0
          ? item.acheivedpointlog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? AcheivedPointAmt[AcheivedPointAmt.length - 1].value : item.acheivedpoints;


      //penaltyamount
      let PenaltyPointAmt =
        item.penaltylog && item.penaltylog.length > 0
          ? item.penaltylog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value).toFixed(2) : item.penalty;


      //totalpaiddayslog
      let totalPaidDaysLogVal =
        item.totalpaiddayslog && item.totalpaiddayslog.length > 0
          ? item.totalpaiddayslog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];

      let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : item.totalpaidDays;

      //currentmonthacg
      let currMonAvgLogVal =
        item.currmonthavglog && item.currmonthavglog.length > 0
          ? item.currmonthavglog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let currMonAvgFinalcalVal = item.currmonthavglog && item.currmonthavglog.length > 0 && currMonAvgLogVal && currMonAvgLogVal.length > 0 ? Number(currMonAvgLogVal[currMonAvgLogVal.length - 1].value) : item.currentmonthavg;

      //currentmontha ttendace
      let currMonAttLogVal =
        item.currmonthattlog && item.currmonthattlog.length > 0
          ? item.currmonthattlog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let currMonAttFinalcalVal = item.currmonthattlog && item.currmonthattlog.length > 0 && currMonAttLogVal && currMonAttLogVal.length > 0 ? Number(currMonAttLogVal[currMonAttLogVal.length - 1].value) : item.currentmonthattendance;

      //no of shiftlog
      let noShiftLogVal =
        item.noshiftlog && item.noshiftlog.length > 0
          ? item.noshiftlog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : item.noallowancepoint;

      //shiftallowancetarget
      let shiftAllowTargetlogVal =
        item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0
          ? item.shiftallowtargetlog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : item.shiftallowancetarget;

      //nightshiftallowance log
      let nightShiftAllowlogLogVal =
        item.nightshiftallowlog && item.nightshiftallowlog.length > 0
          ? item.nightshiftallowlog.filter((d) => {
            return d.month === selectedMonth && d.year === selectedYear;
          })
          : [];
      let nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : item.nightshiftallowance;


      return {
        //usersdatas
        id: item._id,
        serialNumber: index + 1,
        outerId: item.outerId,
        company: item.company,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        empcode: item.empcode,
        companyname: item.companyname,
        department: item.department,
        legalname: item.legalname,
        doj: item.doj,
        designation: item.designation,
        processcodeexp: item.processcodeexp,
        experience: item.experience,
        //need to fetch from users
        bankname: item.bankname,
        accountname: item.accountholdername,
        accountnumber: item.accountnumber,
        ifsccode: item.ifsccode,
        totalnumberofdays: item.totalnumberofdays,
        totalshift: item.totalshift,
        clsl: item.clsl,
        weekoff: item.weekoffcount,
        holiday: item.holiday,
        totalasbleave: Number(totalasbleaveCalcVal),
        totalpaidDays: totalpaiddaycalVal,

        //fetched from salary slab filter
        calcualted: item.calcualted,

        oldgross: item.oldgross,
        oldbasic: item.oldbasic,
        oldhra: item.oldhra,
        oldconveyance: item.oldconveyance,
        oldmedicalallowance: item.oldmedicalallowance,
        oldproductionallowance: item.oldproductionallowance,
        oldproductionallowancetwo: item.oldproductionallowancetwo,
        oldotherallowance: item.oldotherallowance,
        gross: item.oldgross,

        newgross: item.gross,
        actualbasic: item.basic,
        actualhra: item.hra,
        actualconveyance: item.conveyance,
        actualmedicalallowance: item.medicalallowance,
        actualproductionallowance: item.productionallowance,
        actualproductionallowancetwo: item.productionallowancetwo,
        actualotherallowance: item.otherallowance,

        //need to fetch from daypoints upload
        targetpoints: targetPointCalcVaue,
        acheivedpoints: Number(AcheivedPointsCalcVal),
        acheivedpercent: Number(item.acheivedpercent),

        actualpenalty: Number(penaltyCalcVal),
        // penaltyamt: item.penalty,
        uan: item.uan,
        pfmembername: item.pfmembername,
        insuranceno: item.insurancenumber,
        ipname: item.ipname,
        noallowanceshift: Number(noshiftlogvalfinal),
        shiftallowancepoint: Number(item.allowancepoint),

        shiftallowancetarget: shiftallowancetargetfinal,
        nightshiftallowance: nightAllowanceCalcVal,

        era: item.eramount ? Number(item.eramount) : 0,

        revenueallow: item.revenueallow ? Number(item.revenueallow) : 0,
        shortage: item.shortage ? Number(item.shortage) : 0,

        endtar: item.endtar,
        endtardate: item.endtardate,
        endexp: item.endexp,
        endexpdate: item.endexpdate,

        assignExpMode: item.assignExpMode,
        modevalue: item.modevalue,

        targetexp: item.targetexp,
        prodexp: item.prodexp,
        modeexp: item.modeexp,
        processcode: item.processcode,

        processcodetar: item.processcodetar,

        salexp: item.salexp,

        monthPoint: Number(targetPointCalcVaue),
        dayPoint: Number(item.dayPoint),

        currentmonthavg: Number(currMonAvgFinalcalVal),
        currentmonthattendance: Number(currMonAttFinalcalVal),
        paidstatus: item.paidstatus,

        //logs and value
        totalpaiddayslog: item.totalpaiddayslog,
        totalpaiddaycalVal1: item.totalpaiddaycalVal1,

        totalabsentlog: item.totalabsentlog,
        totalabsentcalVal1: item.totalabsentcalVal1,

        penaltylog: item.penaltylog,
        penaltylogcalVal1: item.penaltyCalVal1,

        targetpointlog: item.targetpointlog,
        targetpointcalVal1: item.targetpointCalVal1,

        acheivedpointlog: item.acheivedpointlog,
        acheivedpointcalVal1: item.acheivedpointCalVal1,

        shiftallowancelog: item.shiftallowancelog,
        shiftallowanceCalVal1: item.shiftallowanceCalVal1,

        currmonthavglog: item.currmonthavglog,
        currentmonthavgCalVal1: item.currentmonthavgCalVal1,

        currmonthattlog: item.currmonthattlog,
        currentmonthattCalVal1: item.currentmonthattCalVal1,

        noshiftlog: item.noshiftlog,
        noshiftlogCalVal1: item.noshiftlogCalVal1,


        shiftallowtargetlog: item.shiftallowtargetlog,
        shiftallowtargetlogCalVal1: item.shiftallowtargetlogCalVal1,


        nightshiftallowlog: item.nightshiftallowlog,
        nightshiftallowlogCalVal1: item.nightshiftallowlogCalVal1,

        selectedmonth: item.selectedmonth,
        selectedyear: item.selectedyear,

      };
    });
    setItemsOverall(rowDataTableItems)
  }

  useEffect(() => {
    addOverallData()
  }, [items])


  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    // setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    // setSelectAllChecked(false);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setPage(1);
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  const filteredDatas = itemsOverall?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }


  const CustomCell = ({ id, initialValue, fieldname, shiftallowancelogval, shiftallowancecalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);

    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : shiftallowancelogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };

    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {
            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {
              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "shiftallowancelog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.shiftallowancelog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.shiftallowancelog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }
            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }

          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(shiftallowancecalVal1);
      setUpdateValue(shiftallowancecalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "shiftallowancelog"
      });

    };

    return isEditing === id && fieldname === "shiftallowancelog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: (checkIsEdited.length > 0 || isEdited === true) ? "#e1823b57" : "inherit", overflow: "hidden" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {(checkIsEdited.length > 0 || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };


  const CustomCellTarget = ({ id, initialValue, fieldname, targetpointlogval, targetpointcalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : targetpointlogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };

    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {

            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {

              let resdata = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "targetpointlog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (resdata.statusText === "OK") {

                console.log(res.data.upayrunlist.targetpointlog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.targetpointlog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }

            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }


          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(targetpointcalVal1);
      setUpdateValue(targetpointcalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "targetpointlog"
      });

    };

    return isEditing === id && fieldname === "targetpointlog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: (checkIsEdited.length > 0 || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {(checkIsEdited.length > 0 || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };

  const CustomCellAcheived = ({ id, initialValue, fieldname, acheivedpointlogval, acheivedpointcalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    // let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : acheivedpointlogval?.filter((item) => item.month === selectedMonth && item.year == selectedYear);
    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : acheivedpointlogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };


    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {
            let resNew = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = resNew.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {


              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "acheivedpointlog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.acheivedpointlog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.acheivedpointlog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }

            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }


          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(acheivedpointcalVal1);
      setUpdateValue(acheivedpointcalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "acheivedpointlog"
      });

    };
    return isEditing === id && fieldname === "acheivedpointlog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: (checkIsEdited.length > 0 || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {(checkIsEdited.length > 0 || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };

  const CustomCellPenalty = ({ id, initialValue, fieldname, penaltylogval, penaltycalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : penaltylogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };

    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {
            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {
              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "penaltylog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.penaltylog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.penaltylog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }

            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }


          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(penaltycalVal1);
      setUpdateValue(penaltycalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "penaltylog"
      });

    };

    return isEditing === id && fieldname === "penaltylog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: (checkIsEdited.length > 0 || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {(checkIsEdited.length > 0 || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };

  const CustomCellTotalPaidDays = ({ id, initialValue, fieldname, totalpaiddayslogval, totalpaiddaycalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : totalpaiddayslogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };

    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {

            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {


              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "totalpaiddayslog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.totalpaiddayslog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.totalpaiddayslog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }
            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }

          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(totalpaiddaycalVal1);
      setUpdateValue(totalpaiddaycalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "totalpaiddayslog"
      });

    };

    return isEditing === id && fieldname === "totalpaiddayslog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: checkIsEdited.length > 0 || isEdited === true ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {(checkIsEdited.length > 0 || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };

  const CustomCellTotalAbsent = ({ id, initialValue, fieldname, totalabsentlogval, totalabsentcalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : totalabsentlogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };
    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {

            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {

              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "totalabsentlog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data, 'ghf')
                // .find(d => d._id === id).totalabsentlog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.totalabsentlog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }

            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }


          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(totalabsentcalVal1);
      setUpdateValue(totalabsentcalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "totalabsentlog"
      });

    };
    return isEditing === id && fieldname === "totalabsentlog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: (checkIsEdited.length > 0 || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {(checkIsEdited.length > 0 || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };

  const CustomCellCurrMonAvgLog = ({ id, initialValue, fieldname, currentmonthavglogval, currentmonthavgcalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    // let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : currentmonthavglogval?.filter((item) => item.month === selectedMonth && item.year == selectedYear);

    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : currentmonthavglogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };


    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {

            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {

              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "currmonthavglog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.currmonthavglog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.currmonthavglog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }

            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }

          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(currentmonthavgcalVal1);
      setUpdateValue(currentmonthavgcalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "currmonthavglog"
      });

    };

    return isEditing === id && fieldname === "currmonthavglog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: ((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };
  const CustomCellCurrMonAttLog = ({ id, initialValue, fieldname, currmonthattlogval, currmonthattlogcalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    // let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : currmonthattlogval?.filter((item) => item.month === selectedMonth && item.year == selectedYear);
    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : currmonthattlogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };

    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {

            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {


              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "currmonthattlog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.currmonthattlog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.currmonthattlog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }
            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }

          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(currmonthattlogcalVal1);
      setUpdateValue(currmonthattlogcalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "currmonthattlog"
      });

    };

    return isEditing === id && fieldname === "currmonthattlog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: ((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };

  const CustomCellNoShiftLog = ({ id, initialValue, fieldname, noshiftlogval, noshiftlogCalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : noshiftlogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };
    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {
            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {


              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "noshiftlog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.noshiftlog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.noshiftlog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }

            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }

          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(noshiftlogCalVal1);
      setUpdateValue(noshiftlogCalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "noshiftlog"
      });

    };

    return isEditing === id && fieldname === "noshiftlog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: ((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };


  const CustomCellShiftAllowTargetLog = ({ id, initialValue, fieldname, shiftallowtargetlogval, shiftallowtargetlogCalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : shiftallowtargetlogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };

    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {

            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {

              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "shiftallowtargetlog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.shiftallowtargetlog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.shiftallowtargetlog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }

            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }

          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(shiftallowtargetlogCalVal1);
      setUpdateValue(shiftallowtargetlogCalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "shiftallowtargetlog"
      });

    };
    return isEditing === id && fieldname === "shiftallowtargetlog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: ((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };

  const CustomCellNightShiftAllowLog = ({ id, initialValue, fieldname, nightshiftallowlogval, nightshiftallowlogCalVal1, outerId, month, year, department }) => {
    const [isEditing, setIsEditing] = useState("");
    const [editValue, setEditValue] = useState(initialValue);
    const [textValue, setTextvalue] = useState(initialValue);
    const [updateValue, setUpdateValue] = useState(undefined);
    const [isEdited, setIsEdited] = useState(false);
    const [checkedupdatedVal, setCheckedupdatedVal] = useState(undefined);


    let checkIsEdited = checkedupdatedVal ? checkedupdatedVal : nightshiftallowlogval?.filter((item) => item.month === month && item.year == year);


    const handleDoubleClick = (e) => {

      e.preventDefault();
      setIsEditing(id);
      setEditValue(updateValue ? updateValue : initialValue);
      setTextvalue(updateValue ? updateValue : initialValue);
    };

    const handleInputChange = (event) => {
      setEditValue(event.target.value);
    };

    const handleKeyPress = async (event) => {
      try {
        if (event.key === "Enter") {

          if (editValue != "") {

            let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              department: String(department),
              month: String(month),
              year: String(year),
            });

            let findDeptDupe = res.data.payrunlist
            //  console.log(findDeptDupe, 'findDeptDupe');
            if (findDeptDupe.length === 0) {

              let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },

                outerId: outerId,
                inid: id,
                value: String(editValue),
                month: String(month),
                year: String(year),
                date: String(new Date()),
                fieldName: "nightshiftallowlog"

              });

              setIsEdited(true);
              setTextvalue(editValue);
              setUpdateValue(editValue);
              setIsEditing(false);

              if (res.statusText === "OK") {

                console.log(res.data.upayrunlist.nightshiftallowlog.filter((item) => item.month === month && item.year == year));
                let checkIsEditednewresgetupdated = res.data.upayrunlist.nightshiftallowlog.filter((item) => item.month === month && item.year == year);
                checkIsEdited = checkIsEditednewresgetupdated;
                setCheckedupdatedVal(checkIsEditednewresgetupdated);
              }

            } else {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{"PAY RUN ALREADY GENERATED"}</p>
                </>
              );
              handleClickOpenerr();
            }

          } else {
            setEditValue(initialValue);
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.log(err)
      }
    };

    const handleBlur = () => {
      setIsEditing("");

    };
    const handleDelete = async () => {


      setTextvalue(nightshiftallowlogCalVal1);
      setUpdateValue(nightshiftallowlogCalVal1);
      setIsEdited(false);
      checkIsEdited = [];
      setCheckedupdatedVal([]);

      let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        outerId: outerId,
        inid: id,
        fieldName: "nightshiftallowlog"
      });

    };

    return isEditing === id && fieldname === "nightshiftallowlog" ? (
      <OutlinedInput type="text" size="small" value={editValue} onChange={handleInputChange} onBlur={handleBlur} onKeyPress={handleKeyPress} sx={{ fontSize: "11px" }} autoFocus />
    ) : (
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "10px 4px", background: ((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) ? "#e1823b57" : "inherit" }}>
        <Box>
          <Typography sx={{ fontSize: "10px", display: "flex", justifyContent: "end", alignItems: "center" }} onDoubleClick={(e) => handleDoubleClick(e)}>
            {textValue}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          {((checkIsEdited && checkIsEdited.length > 0) || isEdited === true) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={(e) => handleDelete(e)} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={(e) => handleDoubleClick(e)} />
        </Box>
      </Box>
    );
  };

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 40,
      hide: !columnVisibility.serialNumber,
    },
    { field: "company", headerName: "Company", flex: 0, width: 85, hide: !columnVisibility.company },
    { field: "branch", headerName: "Branch", flex: 0, width: 110, hide: !columnVisibility.branch },
    { field: "unit", headerName: "Unit", flex: 0, width: 80, hide: !columnVisibility.unit },

    { field: "empcode", headerName: "Emp Code", flex: 0, width: 100, hide: !columnVisibility.empcode },
    { field: "legalname", headerName: "Aadhar Name", flex: 0, width: 220, hide: !columnVisibility.legalname },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 220,
      hide: !columnVisibility.companyname,
    },
    { field: "department", headerName: "Department", flex: 0, width: 220, hide: !columnVisibility.department },
    { field: "designation", headerName: "Designation", flex: 0, width: 220, hide: !columnVisibility.designation },
    { field: "team", headerName: "Team", flex: 0, width: 80, hide: !columnVisibility.team },
    { field: "processcodeexp", headerName: "Process Code", flex: 0, width: 120, hide: !columnVisibility.processcodeexp },

    { field: "doj", headerName: "DOJ", flex: 0, width: 95, hide: !columnVisibility.doj },
    { field: "experience", headerName: "Actual Exp", flex: 0, width: 45, hide: !columnVisibility.experience },

    { field: "prodexp", headerName: "Prod Exp", flex: 0, width: 50, hide: !columnVisibility.prodexp },

    { field: "bankname", headerName: "Bank Name", flex: 0, width: 140, hide: !columnVisibility.bankname },
    { field: "accountname", headerName: "Account Name", flex: 0, width: 140, hide: !columnVisibility.accountname },
    { field: "accountnumber", headerName: "Account Number", flex: 0, width: 110, hide: !columnVisibility.accountnumber },
    { field: "ifsccode", headerName: "IFSC Code", flex: 0, width: 100, hide: !columnVisibility.ifsccode },

    { field: "totalnumberofdays", headerName: "Total No.of Days", flex: 0, width: 80, hide: !columnVisibility.totalnumberofdays },
    { field: "totalshift", headerName: "Total Shift", flex: 0, width: 80, hide: !columnVisibility.totalshift },
    { field: "clsl", headerName: "C.L. / S.L.", flex: 0, width: 80, hide: !columnVisibility.clsl },
    { field: "weekoff", headerName: "Week Off", flex: 0, width: 80, hide: !columnVisibility.weekoff },
    { field: "holiday", headerName: "Holiday", flex: 0, width: 80, hide: !columnVisibility.holiday },
    {
      field: "totalasbleave",
      headerName: "Total Absent/Leave Shift",
      flex: 0,
      width: 80,
      hide: !columnVisibility.totalasbleave,
      renderCell: (params) => (
        <CustomCellTotalAbsent
          id={params.row.id}
          initialValue={params.row.totalasbleave}
          fieldname={"totalabsentlog"}
          totalabsentlogval={params.row.totalabsentlog}
          totalabsentcalVal1={params.row.totalabsentcalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}
        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },
    {
      field: "totalpaidDays",
      headerName: "Total Paid Shift",
      flex: 0,
      width: 90,
      hide: !columnVisibility.totalpaidDays,
      renderCell: (params) => (
        <CustomCellTotalPaidDays
          id={params.row.id}
          initialValue={params.row.totalpaidDays}
          fieldname={"totalpaiddayslog"}
          totalpaiddayslogval={params.row.totalpaiddayslog}
          totalpaiddaycalVal1={params.row.totalpaiddaycalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}

        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },

    // { field: "assignExpMode", headerName: "Mode", flex: 0, width: 100, hide: !columnVisibility.assignExpMode },
    // { field: "modevalue", headerName: "Value", flex: 0, width: 45, hide: !columnVisibility.modevalue },
    // { field: "modeexp", headerName: "Mode Exp", flex: 0, width: 50, hide: !columnVisibility.modeexp },

    // { field: "endexp", headerName: "End Exp", flex: 0, width: 45, hide: !columnVisibility.endexp },
    // { field: "endexpdate", headerName: "End-Exp Date", flex: 0, width: 80, hide: !columnVisibility.endexpdate },


    // { field: "endtar", headerName: "End Tar", flex: 0, width: 50, hide: !columnVisibility.endtar },
    // { field: "endtardate", headerName: "End-Tar Date", flex: 0, width: 80, hide: !columnVisibility.endtardate },
    // { field: "targetexp", headerName: "Target Exp", flex: 0, width: 50, hide: !columnVisibility.targetexp },

    // { field: "processcode", headerName: "Process Code", flex: 0, width: 90, hide: !columnVisibility.processcode },
    // { field: "salexp", headerName: "Salary Exp", flex: 0, width: 55, hide: !columnVisibility.salexp },

    { field: "oldgross", headerName: "Gross", flex: 0, width: 100, hide: !columnVisibility.oldgross, },
    { field: "oldbasic", headerName: "Basic", flex: 0, width: 100, hide: !columnVisibility.oldbasic },
    { field: "oldhra", headerName: "HRA", flex: 0, width: 100, hide: !columnVisibility.oldhra },
    { field: "oldconveyance", headerName: "Conveyance", flex: 0, width: 100, hide: !columnVisibility.oldconveyance },
    { field: "oldmedicalallowance", headerName: "Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.oldmedicalallowance },
    { field: "oldproductionallowance", headerName: "Production Allowance", flex: 0, width: 100, hide: !columnVisibility.oldproductionallowance },
    { field: "oldproductionallowancetwo", headerName: "Production Allowance 2", flex: 0, width: 100, hide: !columnVisibility.oldproductionallowancetwo },
    { field: "oldotherallowance", headerName: "Other Allowance", flex: 0, width: 100, hide: !columnVisibility.oldotherallowance },


    { field: "newgross", headerName: "New Gross", flex: 0, width: 100, hide: !columnVisibility.newgross },
    { field: "actualbasic", headerName: "Actual Basic", flex: 0, width: 100, hide: !columnVisibility.actualbasic },
    { field: "actualhra", headerName: "Actual HRA", flex: 0, width: 100, hide: !columnVisibility.actualhra },
    { field: "actualconveyance", headerName: "Actual Conveyance", flex: 0, width: 100, hide: !columnVisibility.actualconveyance },
    { field: "actualmedicalallowance", headerName: "Actual Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.actualmedicalallowance },
    { field: "actualproductionallowance", headerName: "Actual Production Allowance", flex: 0, width: 100, hide: !columnVisibility.actualproductionallowance },
    { field: "actualproductionallowancetwo", headerName: "Actual Production Allowance 2", flex: 0, width: 100, hide: !columnVisibility.actualproductionallowancetwo },
    { field: "actualotherallowance", headerName: "Actual Other Allowance", flex: 0, width: 100, hide: !columnVisibility.actualotherallowance },

    {
      field: "monthPoint",
      headerName: "Target Points",
      flex: 0,
      width: 90,
      hide: !columnVisibility.monthPoint,
      renderCell: (params) => (
        <CustomCellTarget
          id={params.row.id}
          initialValue={params.row.monthPoint}
          fieldname={"targetpointlog"}
          targetpointlogval={params.row.targetpointlog}
          targetpointcalVal1={params.row.targetpointcalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}

        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },
    {
      field: "acheivedpoints",
      headerName: "Acheived Points",
      flex: 0,
      width: 90,
      hide: !columnVisibility.acheivedpoints,
      renderCell: (params) => (
        <CustomCellAcheived
          id={params.row.id}
          initialValue={params.row.acheivedpoints}
          fieldname={"acheivedpointlog"}
          targetvalue={params.row.monthPoint}
          Percent={params.row.acheivedpercent}
          acheivedpointlogval={params.row.acheivedpointlog}
          acheivedpointcalVal1={params.row.acheivedpointcalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}
        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },
    {
      field: "acheivedpercent",
      headerName: "Acheived %",
      flex: 0,
      width: 90,
      hide: !columnVisibility.acheivedpercent,
      // renderCell: (params) => (
      //   <CustomCellAcheived
      //     id={params.row.id}
      //     // initialValue={params.row.acheivedpoints}
      //     fieldname={"acheivedpercent"}
      //     Percent={params.row.acheivedpercent}
      //     // targetvalue={params.row.monthPoint}
      //     // onBlur={(value) => {
      //     //   // Here you can handle updating the value in your data source

      //     // }}
      //   />
      // ),
    },
    {
      field: "actualpenalty",
      headerName: "Acutal Penalty Amount",
      flex: 0,
      width: 90,
      hide: !columnVisibility.actualpenalty,
      renderCell: (params) =>
        <CustomCellPenalty
          id={params.row.id}
          initialValue={params.row.actualpenalty}
          fieldname={"penaltylog"}
          penaltylogval={params.row.penaltylog}
          penaltycalVal1={params.row.penaltylogcalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}
        />,
    },
    // { field: "penaltyamt", headerName: "Penalty Amount", flex: 0, width: 90, hide: !columnVisibility.penaltyamt },

    { field: "uan", headerName: "UAN", flex: 0, width: 120, hide: !columnVisibility.uan },
    { field: "pfmembername", headerName: "pf Member Name", flex: 0, width: 170, hide: !columnVisibility.pfmembername },
    { field: "insuranceno", headerName: "Insurance No", flex: 0, width: 100, hide: !columnVisibility.insuranceno },
    { field: "ipname", headerName: "IP Name", flex: 0, width: 150, hide: !columnVisibility.ipname },
    {
      field: "noallowanceshift", headerName: "No Allowance Shift", flex: 0, width: 90, hide: !columnVisibility.noallowanceshift,
      renderCell: (params) => <CustomCellNoShiftLog
        id={params.row.id}
        initialValue={params.row.noallowanceshift} fieldname={"noshiftlog"}
        noshiftlogval={params.row.noshiftlog}
        noshiftlogCalVal1={params.row.noshiftlogCalVal1}
        outerId={params.row.id}
        month={params.row.selectedmonth}
        year={params.row.selectedyear}
        department={params.row.department}

      />,

    },
    {
      field: "shiftallowancepoint",
      headerName: "Shift Allowance Point",
      flex: 0,
      width: 90,
      hide: !columnVisibility.shiftallowancepoint,

      renderCell: (params) => (
        <CustomCell
          id={params.row.id}
          initialValue={params.row.shiftallowancepoint}
          fieldname={"shiftallowancelog"}
          shiftallowancelogval={params.row.shiftallowancelog}
          shiftallowancecalVal1={params.row.shiftallowanceCalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}

        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },
    {
      field: "shiftallowancetarget",
      headerName: "Shift Allowance Target",
      flex: 0,
      width: 90,
      hide: !columnVisibility.shiftallowancetarget,

      renderCell: (params) => (
        <CustomCellShiftAllowTargetLog
          id={params.row.id}
          initialValue={params.row.shiftallowancetarget}
          fieldname={"shiftallowtargetlog"}
          shiftallowtargetlogval={params.row.shiftallowtargetlog}
          shiftallowtargetlogCalVal1={params.row.shiftallowtargetlogCalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}

        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },
    {
      field: "nightshiftallowance",
      headerName: "Night Shift Allowance",
      flex: 0,
      width: 90,
      hide: !columnVisibility.nightshiftallowance,

      renderCell: (params) => (
        <CustomCellNightShiftAllowLog
          id={params.row.id}
          initialValue={params.row.nightshiftallowance}
          fieldname={"nightshiftallowlog"}
          nightshiftallowlogval={params.row.nightshiftallowlog}
          nightshiftallowlogCalVal1={params.row.nightshiftallowlogCalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}

        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },
    { field: "era", headerName: "ERA", flex: 0, width: 90, hide: !columnVisibility.era },

    // { field: "processcodetar", headerName: "Tar. Process Code + Month", flex: 0, width: 90, hide: !columnVisibility.processcodetar },
    { field: "revenueallow", headerName: "Revenue Allowance", flex: 0, width: 100, hide: !columnVisibility.revenueallow },
    { field: "shortage", headerName: "Shortage", flex: 0, width: 100, hide: !columnVisibility.shortage },
    // { field: "E+G", headerName: "E+G", flex: 0, width: 70, hide: !columnVisibility["E+G"] },
    // { field: "H-F", headerName: "H-F", flex: 0, width: 70, hide: !columnVisibility["H-F"] },
    // { field: "I/60", headerName: "I/60", flex: 0, width: 70, hide: !columnVisibility["I/60"] },
    // { field: "J*8.5", headerName: "J*8.5", flex: 0, width: 70, hide: !columnVisibility["J*8.5"] },

    // { field: "K/27", headerName: "K/27", flex: 0, width: 65, hide: !columnVisibility["K/27"] },

    // { field: "monthPoint", headerName: "tARGET Point", flex: 0, width: 90, hide: !columnVisibility.monthPoint },
    // { field: "dayPoint", headerName: "Day  Point", flex: 0, width: 90, hide: !columnVisibility.dayPoint },
    {
      field: "currentmonthavg", headerName: `Current (${monthsArr[Number(selectedMonthExcel) >= 12 ? 0 : Number(selectedMonthExcel)]}) Month Avg`, flex: 0, width: 100, hide: !columnVisibility.currentmonthavg,

      renderCell: (params) => (
        <CustomCellCurrMonAvgLog
          id={params.row.id}
          initialValue={params.row.currentmonthavg}
          fieldname={"currmonthavglog"}
          currentmonthavglogval={params.row.currmonthavglog}
          currentmonthavgcalVal1={params.row.currentmonthavgCalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}

        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },
    {
      field: "currentmonthattendance", headerName: `Current (${monthsArr[Number(selectedMonthExcel) >= 12 ? 0 : Number(selectedMonthExcel)]}) Month Att`, flex: 0, width: 100, hide: !columnVisibility.currentmonthattendance
      , renderCell: (params) => (
        <CustomCellCurrMonAttLog
          id={params.row.id}
          initialValue={params.row.currentmonthattendance}
          fieldname={"currmonthattlog"}
          currmonthattlogval={params.row.currmonthattlog}
          currmonthattlogcalVal1={params.row.currentmonthattCalVal1}
          outerId={params.row.id}
          month={params.row.selectedmonth}
          year={params.row.selectedyear}
          department={params.row.department}

        // onBlur={(value) => {
        //   // Here you can handle updating the value in your data source

        // }}
        />
      ),
    },
    { field: "paidstatus", headerName: "Paid Status", flex: 0, width: 150, hide: !columnVisibility.paidstatus },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
    }
  });


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

  useEffect(() => {
    fetchCompanies();

  }, []);
  useEffect(() => {

    fetchDepartments();
  }, [selectedUnit, selectedTeam]);


  // // Function to filter columns based on search query
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
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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


  //Company multiselect dropdown changes
  const handleCompanyChange = (options) => {
    setSelectedCompany(options);
    setSelectedBranch([]);

    setSelectedEmployee([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
  };
  const customValueRendererCompany = (valueCate, _companyname) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Company";
  };

  //branch multiselect dropdown changes
  const handleBranchChange = (options) => {
    setSelectedBranch(options);
    setSelectedUnit([]);
    setSelectedEmployee([]);
    setSelectedTeam([]);
  };
  const customValueRendererBranch = (valueCate, _branchname) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Branch";
  };

  //unit multiselect dropdown changes
  const handleUnitChange = (options) => {
    setSelectedUnit(options);
    setSelectedTeam([]);
    setSelectedEmployee([]);
    setSelectedDepartment([]);
  };
  const customValueRendererUnit = (valueCate, _unitname) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
  };

  //Team multiselect dropdown changes
  const handleTeamChange = (options) => {
    setSelectedTeam(options);
    setSelectedEmployee([]);
    setSelectedDepartment([]);
  };
  const customValueRendererTeam = (valueCate, _teamname) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Team";
  };

  //department multiselect dropdown changes
  const handleDepartmentChange = (options) => {
    setSelectedDepartment(options);
    setSelectedEmployee([]);
  };
  const customValueRendererDepartment = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Department";
  };

  //designation multiselect dropdown changes
  const handleDesignationChange = (options) => {
    setSelectedDesignation(options);
  };
  const customValueRendererDesignation = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Designation";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChange = (options) => {
    setSelectedEmployee(options);
  };
  const customValueRendererEmployee = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Employee";
  };



  const getattendancestatus = (clockinstatus, clockoutstatus) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === clockinstatus && data?.clockoutstatus === clockoutstatus;
    });
    return result[0]?.name;
  };

  const getAttModeLop = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.lop === true ? "YES" : "No";
  };

  const getAttModeLopType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.loptype;
  };

  const getFinalLop = (rowlop, rowloptype) => {
    return rowloptype === undefined || rowloptype === "" ? rowlop : rowlop + " - " + rowloptype;
  };

  const getCount = (rowlopstatus) => {
    if (rowlopstatus === "YES - Double Day") {
      return "2";
    } else if (rowlopstatus === "YES - Full Day") {
      return "1";
    } else if (rowlopstatus === "YES - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };

  const getAttModeTarget = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.target === true ? "YES" : "No";
  };

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleave === true ? "YES" : "No";
  };

  const getAttModePaidPresentType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleavetype;
  };

  const getFinalPaid = (rowpaid, rowpaidtype) => {
    return rowpaidtype === undefined || rowpaidtype === "" ? rowpaid : rowpaid + " - " + rowpaidtype;
  };

  const getAssignLeaveDayForPaid = (rowpaidday) => {
    if (rowpaidday === "YES - Double Day") {
      return "2";
    } else if (rowpaidday === "YES - Full Day") {
      return "1";
    } else if (rowpaidday === "YES - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };


  const handleClear = (e) => {
    e.preventDefault();

    setSelectedEmployee([]);
    setSelectedCompany([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
    setSelectedDepartment([]);
    setSelectedDesignation([]);

    setEmployees([]);
    setItems([]);
    setPage(1);
    setPageSize(10);
    setSelectedYear(yyyy);
    setSelectedMonth(currentMonth);
    setSelectMonthName(currentMonth);
    setSelectedMonthNum(mm);
  };


  return (
    <Box>
      <Headtitle title={"Pay Run Master"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Pay Run Master</Typography>
      <br />

      <Box sx={userStyle.dialogbox}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Filters</Typography>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Company <b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={companies.map((item) => ({
                    label: item.name,
                    value: item.name,
                  }))}
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  valueRenderer={customValueRendererCompany}
                  labelledBy="Please Select Company"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Branch <b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={Array.from(new Set(branches?.filter((comp) => selectedCompany.map((item) => item.value).includes(comp.company))?.map((com) => com.name))).map((name) => ({
                    label: name,
                    value: name,
                  }))}
                  value={selectedBranch}
                  onChange={handleBranchChange}
                  valueRenderer={customValueRendererBranch}
                  labelledBy="Please Select Branch"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Unit</Typography>
                <MultiSelect
                  options={Array.from(new Set(units?.filter((comp) => selectedBranch.map((item) => item.value).includes(comp.branch))?.map((com) => com.name))).map((name) => ({
                    label: name,
                    value: name,
                  }))}
                  value={selectedUnit}
                  onChange={handleUnitChange}
                  valueRenderer={customValueRendererUnit}
                  labelledBy="Please Select Unit"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Team</Typography>
                <MultiSelect
                  options={Array.from(new Set(teams?.filter((comp) => selectedBranch.map((item) => item.value).includes(comp.branch) && selectedUnit.map((item) => item.value).includes(comp.unit))?.map((com) => com.teamname))).map((teamname) => ({
                    label: teamname,
                    value: teamname,
                  }))}
                  value={selectedTeam}
                  onChange={handleTeamChange}
                  valueRenderer={customValueRendererTeam}
                  labelledBy="Please Select Team"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Department</Typography>
                <MultiSelect options={departments} value={selectedDepartment} onChange={handleDepartmentChange} valueRenderer={customValueRendererDepartment} />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Designation</Typography>
                <MultiSelect
                  options={designations.map((item) => ({
                    label: item.name,
                    value: item.name,
                  }))}
                  value={selectedDesignation}
                  onChange={handleDesignationChange}
                  valueRenderer={customValueRendererDesignation}
                  labelledBy="Please Select Company"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Employee Name</Typography>
                <MultiSelect
                  options={employeesDrops
                    ?.filter((comp) => (selectedCompany.length > 0 ? selectedCompany.map((item) => item.value).includes(comp.company) : true) && (selectedBranch.length > 0 ? selectedBranch.map((item) => item.value).includes(comp.branch) : true) && (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(comp.unit) : true) && (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(comp.team) : true) && (selectedDepartment.length > 0 ? selectedDepartment.map((item) => item.value).includes(comp.department) : true) && (selectedDesignation.length > 0 ? selectedDesignation.map((item) => item.value).includes(comp.designation) : true))
                    ?.map((com) => ({
                      ...com,
                      label: com.companyname,
                      value: com.companyname,
                    }))}
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  valueRenderer={customValueRendererEmployee}
                  labelledBy="Please Select Employeename"
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Year<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Month <b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects options={selectedYear === "Select Year" ? [] : months} value={{ label: selectmonthname, value: selectmonthname }} onChange={handleMonthChange} />
              </FormControl>
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
              <Button variant="contained" disabled={isBankdetail === true} onClick={handleFilter}>
                Filter
              </Button>
              <Button sx={userStyle.btncancel} onClick={handleClear}>
                CLEAR
              </Button>
            </Grid>
          </Grid>
        </>
      </Box>

      <br />


      {isUserRoleCompare?.includes("lpayrunmaster") && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Pay Run Master List</Typography>
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
                    <MenuItem value={employeesPayRun?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelpayrunmaster") && (
                    // <>
                    //   <ExportXL
                    //     csvData={
                    //       rowDataTable
                    //         .sort((a, b) => {

                    //           if (Number(b.experience) !== Number(a.experience)) {
                    //             return Number(b.experience) - Number(a.experience);
                    //           }

                    //           return a.companyname.localeCompare(b.companyname);
                    //         }).map((item, index) => ({
                    //           SNo: index + 1,
                    //           Company: item.company,
                    //           Branch: item.branch,
                    //           Unit: item.unit,
                    //           "Emp Code": item.empcode,
                    //           "Aadhar Name": item.legalname,
                    //           "Company Name": item.companyname,
                    //           Designation: item.designation,
                    //           Team: item.team,
                    //           "Process Code": item.processcodeexp,
                    //           DOJ: item.doj,
                    //           Experience: Number(item.experience),
                    //           "Prod Exp": Number(item.prodexp),
                    //           //need to fetch from users
                    //           "Bank Name": item.bankname,
                    //           "Account Name": item.accountname,
                    //           "Account Number": item.accountnumber,
                    //           "IFSC Code": item.ifsccode,
                    //           "Total Number of Days": Number(item.totalnumberofdays),
                    //           "Total Shift": Number(item.totalshift),
                    //           "C.L / S.L": Number(item.clsl),
                    //           Weekoff: Number(item.weekoff),
                    //           Holiday: Number(item.holiday),
                    //           "Total Absent/Leave": Number(item.totalasbleave),
                    //           "Total Paid Days": Number(item.totalpaidDays),

                    //           //fetched from salary slab filter
                    //           // Calcualted: item.calcualted,
                    //           "Gross": Number(item.oldgross),
                    //           "Basic": Number(item.oldbasic),
                    //           "HRA": Number(item.oldhra),
                    //           "Conveyance": Number(item.oldconveyance),
                    //           "Medical Allowance": Number(item.oldmedicalallowance),
                    //           "Production Allowance": Number(item.oldproductionallowance),
                    //           "Production Allowance 2": Number(item.oldproductionallowancetwo),
                    //           "Other Allowance": Number(item.oldotherallowance),

                    //           "New Gross": Number(item.newgross),
                    //           "Actual Basic": Number(item.actualbasic),
                    //           "Actual HRA": Number(item.actualhra),
                    //           "Actual Conveyance": Number(item.actualconveyance),
                    //           "Actual Medical Allowance": Number(item.actualmedicalallowance),
                    //           "Actual Production Allowance": Number(item.actualproductionallowance),
                    //           "Actual Production Allowance 2": Number(item.actualproductionallowancetwo),
                    //           "Actual Other Allowance": Number(item.actualotherallowance),

                    //           //need to fetch from daypoints upload
                    //           "Target Points": Number(item.monthPoint),
                    //           "Acheived Points": Number(item.acheivedpoints),
                    //           "Acheived Percent": Number(item.acheivedpercent),
                    //           "Actual Penalty": Number(item.actualpenalty),
                    //           // penaltyamt: item.penalty,
                    //           UAN: item.uan,
                    //           "PF Member Name": item.pfmembername,
                    //           "Insurance Number": item.insuranceno,
                    //           "IP Name": item.ipname,
                    //           "No Allowance Shift": Number(item.noallowanceshift),
                    //           "Shift Allowance Point": Number(item.shiftallowancepoint),
                    //           ERA: Number(item.era),

                    //           "Revenue Allow": Number(item.revenueallow),
                    //           Shortage: Number(item.shortage),

                    //           // `Current (${monthsArr[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum) ]}) Month Avg`: item.currentmonthavg,
                    //           [`Current (${monthsArr[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`]: Number(item.currentmonthavg),
                    //           [`Current (${monthsArr[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Attendance`]: Number(item.currentmonthattendance),
                    //           // "Current Month Avg": Number(item.currentmonthavg),
                    //           // "Current Month Attendance": Number(item.currentmonthattendance),
                    //           "Paid Status": item.paidstatus,
                    //         }))}
                    //     fileName={fileName}
                    //   />
                    // </>
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvpayrunmaster") && (

                    // <>
                    //   <ExportCSV
                    //     csvData={
                    //       rowDataTable
                    //         .sort((a, b) => {
                    //           // First, sort by experienceinmonth
                    //           if (Number(b.experience) !== Number(a.experience)) {
                    //             return Number(b.experience) - Number(a.experience);
                    //           }
                    //           // If experienceinmonth is the same, sort by employeename
                    //           return a.companyname.localeCompare(b.companyname);
                    //         }).map((item, index) => ({
                    //           SNo: index + 1,
                    //           Company: item.company,
                    //           Branch: item.branch,
                    //           Unit: item.unit,
                    //           "Emp Code": item.empcode,
                    //           "Aadhar Name": item.legalname,
                    //           "Company Name": item.companyname,
                    //           Designation: item.designation,
                    //           Team: item.team,
                    //           "Process Code": item.processcodeexp,
                    //           DOJ: item.doj,
                    //           Experience: Number(item.experience),
                    //           "Prod Exp": Number(item.prodexp),
                    //           //need to fetch from users
                    //           "Bank Name": item.bankname,
                    //           "Account Name": item.accountname,
                    //           "Account Number": item.accountnumber,
                    //           "IFSC Code": item.ifsccode,
                    //           "Total Number of Days": Number(item.totalnumberofdays),
                    //           "Total Shift": Number(item.totalshift),
                    //           "C.L / S.L": Number(item.clsl),
                    //           Weekoff: Number(item.weekoff),
                    //           Holiday: Number(item.holiday),
                    //           "Total Absent/Leave": Number(item.totalasbleave),
                    //           "Total Paid Days": Number(item.totalpaidDays),

                    //           //fetched from salary slab filter
                    //           // Calcualted: item.calcualted,
                    //           "Gross": Number(item.oldgross),
                    //           "Basic": Number(item.oldbasic),
                    //           "HRA": Number(item.oldhra),
                    //           "Conveyance": Number(item.oldconveyance),
                    //           "Medical Allowance": Number(item.oldmedicalallowance),
                    //           "Production Allowance": Number(item.oldproductionallowance),
                    //           "Production Allowance 2": Number(item.oldproductionallowancetwo),
                    //           "Other Allowance": Number(item.oldotherallowance),

                    //           "New Gross": Number(item.newgross),
                    //           "Actual Basic": Number(item.actualbasic),
                    //           "Actual HRA": Number(item.actualhra),
                    //           "Actual Conveyance": Number(item.actualconveyance),
                    //           "Actual Medical Allowance": Number(item.actualmedicalallowance),
                    //           "Actual Production Allowance": Number(item.actualproductionallowance),
                    //           "Actual Production Allowance 2": Number(item.actualproductionallowancetwo),
                    //           "Actual Other Allowance": Number(item.actualotherallowance),

                    //           //need to fetch from daypoints upload
                    //           "Target Points": Number(item.monthPoint),
                    //           "Acheived Points": Number(item.acheivedpoints),
                    //           "Acheived Percent": Number(item.acheivedpercent),
                    //           "Actual Penalty": Number(item.actualpenalty),
                    //           // penaltyamt: item.penalty,
                    //           UAN: item.uan,
                    //           "PF Member Name": item.pfmembername,
                    //           "Insurance Number": item.insuranceno,
                    //           "IP Name": item.ipname,
                    //           "No Allowance Shift": Number(item.noallowanceshift),
                    //           "Shift Allowance Point": Number(item.shiftallowancepoint),
                    //           ERA: Number(item.era),

                    //           "Revenue Allow": Number(item.revenueallow),
                    //           Shortage: Number(item.shortage),
                    //           [`Current (${monthsArr[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`]: Number(item.currentmonthavg),
                    //           [`Current (${monthsArr[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Attendance`]: Number(item.currentmonthattendance),
                    //           // "Current Month Avg": Number(item.currentmonthavg),
                    //           // "Current Month Attendance": Number(item.currentmonthattendance),
                    //           "Paid Status": item.paidstatus,
                    //         }))}
                    //     fileName={fileName}
                    //   />
                    // </>
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printpayrunmaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfpayrunmaster") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagepayrunmaster") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3.9} xs={12} sm={12} marginTop={3}>
                <Box>
                  <Button sx={userStyle.buttongrpexp} size="small" onClick={handleShowAllColumns}>
                    Show All Columns
                  </Button>

                  <Button sx={userStyle.buttongrpexp} size="small" onClick={handleOpenManageColumns}>
                    Manage Columns
                  </Button>

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
                </Box>
              </Grid>

            </Grid>
            <br />
            {isBankdetail ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>

                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  <CustomStyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowDataTable}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}

                    onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true}
                    ref={gridRef} density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                    columnBuffer={90}
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
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
              </>
            )}
          </Box>
        </>
      )}

      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>

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
      {/* <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Company</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Unit</StyledTableCell>
              <StyledTableCell>Emp Code</StyledTableCell>

              <StyledTableCell>Aadhar Name</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Process Code</StyledTableCell>
              <StyledTableCell>DOJ</StyledTableCell>
              <StyledTableCell>Experience</StyledTableCell>
              <StyledTableCell>Bank Name</StyledTableCell>
              <StyledTableCell>Account Name</StyledTableCell>
              <StyledTableCell>Account Number</StyledTableCell>
              <StyledTableCell>IFSC Code</StyledTableCell>

              <StyledTableCell>Total No.Of Days</StyledTableCell>
              <StyledTableCell>Total Shift</StyledTableCell>
              <StyledTableCell>C.L / S.L</StyledTableCell>
              <StyledTableCell>Weekoff</StyledTableCell>
              <StyledTableCell>Holiday</StyledTableCell>
              <StyledTableCell>Total Absent/Leave</StyledTableCell>
              <StyledTableCell>Total Paid Days</StyledTableCell>


              <StyledTableCell>Gross</StyledTableCell>

              <StyledTableCell>Basic</StyledTableCell>
              <StyledTableCell>HRA</StyledTableCell>
              <StyledTableCell>Conveyance</StyledTableCell>
              <StyledTableCell>Medical Allowance</StyledTableCell>
              <StyledTableCell>Production Allowance</StyledTableCell>
              <StyledTableCell>Production Allowance 2</StyledTableCell>
              <StyledTableCell>Other Allowance</StyledTableCell>



              <StyledTableCell>New Gross</StyledTableCell>
              <StyledTableCell>Actual Basic</StyledTableCell>
              <StyledTableCell>Actual HRA</StyledTableCell>
              <StyledTableCell>Actual Conveyance</StyledTableCell>
              <StyledTableCell>Actual Medical Allowance</StyledTableCell>
              <StyledTableCell>Actual Production Allowance</StyledTableCell>
              <StyledTableCell>Actual Production Allowance 2</StyledTableCell>
              <StyledTableCell>Actual Other Allowance</StyledTableCell>

              <StyledTableCell>Target Points</StyledTableCell>
              <StyledTableCell>Acheived Points</StyledTableCell>
              <StyledTableCell>Acheived Percent</StyledTableCell>
              <StyledTableCell>Actual Penalty</StyledTableCell>

              <StyledTableCell>UAN</StyledTableCell>
              <StyledTableCell>PF Member Name</StyledTableCell>
              <StyledTableCell>Insurance Number</StyledTableCell>
              <StyledTableCell>IP Name</StyledTableCell>
              <StyledTableCell>No Allowance Shift</StyledTableCell>
              <StyledTableCell>Shift Allowance Point</StyledTableCell>
              <StyledTableCell>ERA</StyledTableCell>

              <StyledTableCell>Revenue Allowance</StyledTableCell>
              <StyledTableCell>Shortage</StyledTableCell>
              <StyledTableCell>Current Month Avg</StyledTableCell>
              <StyledTableCell>Current Month Attendance</StyledTableCell>
              <StyledTableCell>Paid Status</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{item.company}</StyledTableCell>
                  <StyledTableCell>{item.branch}</StyledTableCell>
                  <StyledTableCell>{item.unit}</StyledTableCell>
                  <StyledTableCell>{item.empcode}</StyledTableCell>

                  <StyledTableCell>{item.legalname}</StyledTableCell>
                  <StyledTableCell>{item.companyname}</StyledTableCell>
                  <StyledTableCell>{item.designation}</StyledTableCell>
                  <StyledTableCell>{item.team}</StyledTableCell>
                  <StyledTableCell>{item.processcodeexp}</StyledTableCell>
                  <StyledTableCell>{item.doj}</StyledTableCell>
                  <StyledTableCell>{item.experience}</StyledTableCell>
                  <StyledTableCell>{item.bankname}</StyledTableCell>
                  <StyledTableCell>{item.accountname}</StyledTableCell>
                  <StyledTableCell>{item.accountnumber}</StyledTableCell>
                  <StyledTableCell>{item.ifsccode}</StyledTableCell>

                  <StyledTableCell>{item.totalnumberofdays}</StyledTableCell>
                  <StyledTableCell>{item.totalshift}</StyledTableCell>
                  <StyledTableCell>{item.clsl}</StyledTableCell>
                  <StyledTableCell>{item.weekoff}</StyledTableCell>
                  <StyledTableCell>{item.holiday}</StyledTableCell>
                  <StyledTableCell>{item.totalasbleave}</StyledTableCell>
                  <StyledTableCell>{item.totalpaidDays}</StyledTableCell>

                  <StyledTableCell>{item.oldgross}</StyledTableCell>
                  <StyledTableCell>{item.oldbasic}</StyledTableCell>
                  <StyledTableCell>{item.oldhra}</StyledTableCell>
                  <StyledTableCell>{item.oldconveyance}</StyledTableCell>
                  <StyledTableCell>{item.oldmedicalallowance}</StyledTableCell>
                  <StyledTableCell>{item.oldproductionallowance}</StyledTableCell>
                  <StyledTableCell>{item.oldproductionallowancetwo}</StyledTableCell>
                  <StyledTableCell>{item.oldotherallowance}</StyledTableCell>

                  <StyledTableCell>{item.newgross}</StyledTableCell>
                  <StyledTableCell>{item.actualbasic}</StyledTableCell>
                  <StyledTableCell>{item.actualhra}</StyledTableCell>
                  <StyledTableCell>{item.actualconveyance}</StyledTableCell>
                  <StyledTableCell>{item.actualmedicalallowance}</StyledTableCell>
                  <StyledTableCell>{item.actualproductionallowance}</StyledTableCell>
                  <StyledTableCell>{item.actualproductionallowancetwo}</StyledTableCell>
                  <StyledTableCell>{item.actualotherallowance}</StyledTableCell>


                  <StyledTableCell>{item.monthPoint}</StyledTableCell>
                  <StyledTableCell>{item.acheivedpoints}</StyledTableCell>
                  <StyledTableCell>{item.acheivedpercent}</StyledTableCell>
                  <StyledTableCell>{item.actualpenalty}</StyledTableCell>

                  <StyledTableCell>{item.uan}</StyledTableCell>
                  <StyledTableCell>{item.pfmembername}</StyledTableCell>
                  <StyledTableCell>{item.insuranceno}</StyledTableCell>
                  <StyledTableCell>{item.ipname}</StyledTableCell>
                  <StyledTableCell>{item.noallowanceshift}</StyledTableCell>
                  <StyledTableCell>{item.shiftallowancepoint}</StyledTableCell>
                  <StyledTableCell>{item.era}</StyledTableCell>

                  <StyledTableCell>{item.revenueallow}</StyledTableCell>
                  <StyledTableCell>{item.shortage}</StyledTableCell>
                  <StyledTableCell>{item.currentmonthavg}</StyledTableCell>
                  <StyledTableCell>{item.currentmonthattendance}</StyledTableCell>
                  <StyledTableCell>{item.paidstatus}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={itemsOverall ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box >
  );
}

export default PayrunMaster;