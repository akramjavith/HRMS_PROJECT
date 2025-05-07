import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileExcel } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import StyledDataGrid from "../../../components/TableStyle";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
// import { DataGrid } from '@mui/x-data-grid';
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import ExportData from "../../../components/ExportData";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { handleApiError } from "../../../components/Errorhandling.js";

function ProductionSalaryList() {
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }

  const [isActive, setIsActive] = useState(false);
  const [employeesPayRun, setEmployeesPayRun] = useState([]);

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

  const [manageshortagemasters, setManageshortagemasters] = useState([]);
  const [revenueAmount, setRevenueAmount] = useState([]);
  const [salSlabs, setsalSlabs] = useState([]);
  const [eraAmounts, setEraAmounts] = useState([]);
  const [acPointCal, setAcPointCal] = useState([]);
  const [monthSets, setMonthsets] = useState([]);
  const [monthSetsNxt, setMonthsetsNxt] = useState([]);

  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);
  const [paidStatusFix, setPaidStatusFix] = useState([]);
  const [payruncontrolmaster, setPayruncontrolmaster] = useState([]);
  const [employeesAllDrops, setEmployeesAllDrops] = useState([]);
  const [attStatusOption, setAttStatusOption] = useState([]);

  const [profTaxMaster, setProfTaxMaster] = useState([]);
  const [shifts, setShifts] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  const [selectedMonthExcel, setSelectedMonthExcel] = useState("");

  const [fileFormat, setFormat] = useState("");

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
    "& .MuiDataGrid-cell": {
      whiteSpace: "normal !important",
      wordWrap: "break-word !important",
      lineHeight: "1.2 !important", // Optional: Adjusts line height for better readability
    },
    "& .MuiDataGrid-row:nth-of-type(odd)": {
      backgroundColor: "#f5f5f5", // Light grey for odd rows
    },
    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: "#ffffff", // White for even rows
    },
  }));

  let exportColumnNames = [
    "Department",
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Designation",
    "Emp Code",
    "Employee Name",
    "Aadhar Name",
    "Process Code",
    "DOJ",
    "Experience In Month",
    "Total No.of Days",
    "Total Shift",
    "C.L. / S.L.",
    "Week Off",
    "Holiday",
    "Total Absent/Leave Shift",
    "Total Paid Shift",
    "Gross",
    "Basic",
    "HRA",
    "Conveyance",
    "Medical Allowance",
    "Production Allowance",
    "Production Allowance 2",
    "Other Allowance",
    "New Gross",
    "Actual Basic",
    "Actual HRA",
    "Actual Conveyance",
    "Actual Medical Allowance",
    "Actual Production Allowance",
    "Actual Production Allowance 2",
    "Actual Other Allowance",
    "Target Points",
    "Achieved Points",
    "Achieved %",
    "Achieved Production Allowance",
    "Actual Net Salary",
    "No. Allowance Shift",
    "Shift Allowance Point",
    "Shift Allowance Target",
    "Night Shift Allowance",
    "Total Points Value",
    "ERA",
    "Actual ERA",
    "Revenue Allowance",
    "Attendance LOP",
    "Actual Penalty Amount",
    "Penalty Amount",
    "Other Deduction",
    "Shortage",
    "Shortage 1",
    "PROD Loss Deduction",
    "PROD NET_Salary",
    "PROD Basic",
    "PROD HRA",
    "PROD Conveyance",
    "PROD Medical Allowance",
    "PROD Production Allowance",
    "PROD Other Allowance",
    "PROD NET_Salary1",
    "PROD Emp_pf",
    "PROD Emp_esi",
    "PROD Emp_ptax",
    "PROD Empr_pf",
    "PROD Empr_Esi",
    "PROD Shift_Allowance",
    "PROD Total Deductions",
    "PROD Salary",
    "PROD Salary+Penalty",
    "PROD LOP Days",
    "PROD LOP",
    "PROD Leave Deduction",
    "PROD CTC",
    "PROD Final Value",
    "PROD Actual Deduction",
    "PROD Minimum Deduction",
    `Current (${monthsArr[Number(selectedMonthExcel) >= 12 ? 0 : Number(selectedMonthExcel)]}) Month Avg`,
    `Current (${monthsArr[Number(selectedMonthExcel) >= 12 ? 0 : Number(selectedMonthExcel)]}) Month Attendance`,
    "Paid Status",
  ];

  let exportRowValues = [
    "department",
    "company",
    "branch",
    "unit",
    "team",
    "designation",
    "empcode",
    "employeename",
    "aadharname",
    "processcode",
    "doj",
    "experienceinmonth",
    "totalnumberofdays",
    "totalshift",
    "clsl",
    "weekoff",
    "holiday",
    "totalasbleave",
    "totalpaidDays",
    "oldgross",
    "oldbasic",
    "oldhra",
    "oldconveyance",
    "oldmedicalallowance",
    "oldproductionallowance",
    "oldproductionallowancetwo",
    "oldotherallowance",
    "newgross",
    "actualbasic",
    "actualhra",
    "actualconveyance",
    "actualmedicalallowance",
    "actualproductionallowance",
    "actualproductionallowancetwo",
    "actualotherallowance",
    "targetpoints",
    "achievedpoints",
    "achieved",
    "achievedproductionallowance",
    "actualnetsalary",
    "noallowanceshift",
    "shiftallowancepoint",
    "shiftallowancetarget",
    "nightshiftallowance",
    "totalpointsvalue",
    "era",
    "actualera",
    "revenueallowance",
    "attendancelop",
    "actualpenaltyamount",
    "penaltyamount",
    "otherdeduction",
    "shortage",
    "shortageone",
    "prodlossdeduction",
    "prodnetsalary",
    "prodbasicp",
    "prodhrap",
    "prodconveyancep",
    "prodmedicalallowancep",
    "prodproductionallowancep",
    "prodotherallowancep",
    "prodnetsalaryonep",
    "prodemppf",
    "prodempesi",
    "prodempptax",
    "prodemprpf",
    "prodempresi",
    "prodshiftallowance",
    "prodtotaldeductions",
    "prodsalary",
    "prodsalarypenalty",
    "prodlopdays",
    "prodlop",
    "prodleavededuction",
    "prodctc",
    "prodfinalvalue",
    "prodactualdeduction",
    "prodminimumdeduction",
    "currentmonthavg",
    "currentmonthattendance",
    "paidstatus",
  ];
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  // const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
    setSelectedEmployee([]);
    fetchUserMonthYearBased(selectedMonth, event.value, selectedDepartment, event.numval);

    // updateDateValue(event.value, selectedMonth);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    // updateDateValue(selectedYear, event.value);
    setSelectMonthName(event.label);
    setSelectedEmployee([]);
    setSelectedMonthNum(event.numval);
    fetchUserMonthYearBased(event.value, selectedYear, selectedDepartment, event.numval);
  };

  //get all  company.
  const fetchCompany = async () => {
    try {
      let res = await axios.post(SERVICE.COMPANY_LIMITED_BY_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        assignbranch: accessbranch,
      });

      let companies = [...new Set(res?.data?.companies.map((data) => data.name))].map((name) => ({
        label: name,
        value: name,
      }));
      setCompanies(companies);
      // setSelectedCompany(companies);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all branch by company.
  const fetchBranchAll = async (company) => {
    try {
      let res_location = await axios.post(SERVICE.BRANCH_BY_COMPANY_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        assignbranch: accessbranch,
        company: company.map((item) => item.value),
      });

      let branchOptfirstthree = res_location?.data?.branches;
      setBranches(branchOptfirstthree);
    } catch (err) {
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get unit by branch
  const fetchUnitAll = async (company, branch) => {
    try {
      let res_location = await axios.post(SERVICE.UNIT_BY_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        assignbranch: accessbranch,
        branch: branch.map((item) => item.value),
      });

      let units = res_location?.data?.units;
      setUnits(units);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all Team.
  const fetchTeamAll = async (company, branch, unit) => {
    // let unitArr = e.map(data => data.name)

    try {
      let res_location = await axios.post(SERVICE.TEAMS_BY_UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: company.map((item) => item.value),
        branch: branch.map((item) => item.value),
        unit: unit.map((item) => item.value),
      });
      // const TeamOpt = res_location?.data?.teamsdetails?.filter((t) => unitArr.includes(t.unit))
      let TeamOpt = [...new Set(res_location?.data?.teamsdetails.map((data) => data.teamname))].map((name) => ({
        label: name,
        value: name,
      }));

      setTeams(TeamOpt);
      // setSelectedTeam(TeamOpt);
      // fetchEmployeesAll(company, branch, unit, TeamOpt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchUserMonthYearBased = async (month, year, department, monthnum) => {
    let res = await axios.post(SERVICE.USERS_LIMITED_DROPDOWN_FINALSALARY, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      month: month,
      monthnum: monthnum,
      year: year,
    });
    setEmployeesAllDrops(res?.data?.users);
    // axios.post(SERVICE.USERS_LIMITED_DROPDOWN_FINALSALARY, { headers: { Authorization: `Bearer ${auth.APIToken}` },month: selectedMonth,monthnum: selectedMonthNum, year:selectedYear }),
    let employees = res?.data?.users?.filter(
      (comp) =>
        (selectedCompany.length > 0 ? selectedCompany.map((item) => item.value).includes(comp.company) : true) &&
        (selectedBranch.length > 0 ? selectedBranch.map((item) => item.value).includes(comp.branch) : true) &&
        (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(comp.unit) : true) &&
        (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(comp.team) : true) &&
        (selectedDepartment.length > 0 ? selectedDepartment.map((item) => item.value).includes(comp.department) : true) &&
        (selectedDesignation.length > 0 ? selectedDesignation.map((item) => item.value).includes(comp.designation) : true)
    );
    let allusers = employees;
    // let allusers = [...new Set(employees.map((data) => data.companyname))];
    // .map((name) => ({
    //   label: name,
    //   value: name,
    // }));
    // console.log(allusers, 'allusers');
    setEmployeesDrops(allusers);
  };

  // loading popup
  const [loadingMessage, setLoadingMessage] = useState(false);
  const handleOpenLoadingMessage = (sts, progress, reason) => {
    setStatus(sts);
    setLoadingProgress(progress);
    // setShowAlert(progress.toFixed(2));
    if (reason && reason === "backdropClick") return;
    setLoadingMessage(true);
  };
  const handleCloseLoadingMessage = async () => {
    setLoadingMessage(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let currentMonth = monthNames[mm - 1];

  const [selectedYear, setSelectedYear] = useState(yyyy);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectmonthname, setSelectMonthName] = useState(currentMonth);
  const [selectedMonthNum, setSelectedMonthNum] = useState(mm);

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
  const [targetPoints, setTargetPoints] = useState([]);
  const fetchCompanies = async () => {
    setIsActive(true);
    try {
      const [RES_USERS, RES_DESIG, RES_TEAMS, RES_TAX, RES_SHIFT, RES_SALARYSLAB, RES_SHORTAGE, RES_ERA, RES_REVENUE, RES_ACPOINT, RES_ATTSTS, RES_ATTMODE, RES_TARGET] = await Promise.all([
        // axios.get(SERVICE.COMPANY, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        // axios.get(SERVICE.BRANCH, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.post(SERVICE.USERS_LIMITED_DROPDOWN_FINALSALARY, { headers: { Authorization: `Bearer ${auth.APIToken}` }, month: selectedMonth, monthnum: selectedMonthNum, year: selectedYear }),
        // axios.get(SERVICE.UNIT, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.DESIGNATION, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.TEAMS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ALL_PROFFESIONALTAXMASTER, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.SHIFTS_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.SALARYSLAB_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.MANAGESHORTAGEMASTER, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ERAAMOUNTSLIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.REVENUEAMOUNTSLIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ACPOINTCALCULATION, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ATTENDANCE_STATUS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ATTENDANCE_MODE_STATUS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.TARGETPOINTS_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
      ]);

      setAcPointCal(RES_ACPOINT?.data?.acpointcalculation);
      setRevenueAmount(RES_REVENUE?.data?.revenueamounts);
      setEraAmounts(RES_ERA?.data?.eraamounts);
      setManageshortagemasters(RES_SHORTAGE?.data?.manageshortagemasters);
      setsalSlabs(RES_SALARYSLAB?.data.salaryslab);
      setShifts(RES_SHIFT?.data?.shifts);
      setProfTaxMaster(RES_TAX?.data?.professionaltaxmaster);
      setTeams(RES_TEAMS.data.teamsdetails);
      setDesignations(RES_DESIG?.data.designation);
      // setUnits(RES_UNIT?.data.units);
      setEmployeesDrops(RES_USERS?.data.users);
      setEmployeesAllDrops(RES_USERS?.data.users);
      // setBranches(RES_BRANCH?.data.branch);
      // setCompanies(RES_COM?.data.companies);
      setAttStatus(RES_ATTSTS?.data?.attendancestatus);
      setAttModearr(RES_ATTMODE?.data?.allattmodestatus);
      let result = RES_ATTMODE?.data?.allattmodestatus.filter((data, index) => {
        return data.appliedthrough != "Auto";
      });
      setAttStatusOption(result.map((d) => d.name));
      setTargetPoints(RES_TARGET?.data.targetpoints);
      setIsActive(false);
    } catch (err) {
      setIsActive(false);
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchCompany();
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [selectedUnit, selectedTeam]);

  //multiselect onchange
  //Company multiselect dropdown changes
  const handleCompanyChange = (options) => {
    setSelectedCompany(options);
    fetchBranchAll(options);
    setSelectedBranch([]);

    setSelectedEmployee([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
    let employees = employeesAllDrops?.filter(
      (comp) =>
        (options.length > 0 ? options.map((item) => item.value).includes(comp.company) : true) &&
        (selectedBranch.length > 0 ? selectedBranch.map((item) => item.value).includes(comp.branch) : true) &&
        (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(comp.unit) : true) &&
        (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(comp.team) : true) &&
        (selectedDepartment.length > 0 ? selectedDepartment.map((item) => item.value).includes(comp.department) : true) &&
        (selectedDesignation.length > 0 ? selectedDesignation.map((item) => item.value).includes(comp.designation) : true)
    );
    setEmployeesDrops(employees);
  };
  const customValueRendererCompany = (valueCate, _companyname) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Company";
  };

  //branch multiselect dropdown changes
  const handleBranchChange = (options) => {
    setSelectedBranch(options);
    fetchUnitAll(selectedCompany, options);
    setSelectedUnit([]);
    setSelectedEmployee([]);
    setSelectedTeam([]);

    let employees = employeesAllDrops?.filter(
      (comp) =>
        (selectedCompany.length > 0 ? selectedCompany.map((item) => item.value).includes(comp.company) : true) &&
        (options.length > 0 ? options.map((item) => item.value).includes(comp.branch) : true) &&
        (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(comp.unit) : true) &&
        (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(comp.team) : true) &&
        (selectedDepartment.length > 0 ? selectedDepartment.map((item) => item.value).includes(comp.department) : true) &&
        (selectedDesignation.length > 0 ? selectedDesignation.map((item) => item.value).includes(comp.designation) : true)
    );
    // console.log(employees, 'employees');
    setEmployeesDrops(employees);
  };
  const customValueRendererBranch = (valueCate, _branchname) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Branch";
  };

  //unit multiselect dropdown changes
  const handleUnitChange = (options) => {
    setSelectedUnit(options);
    fetchTeamAll(selectedCompany, selectedBranch, options);
    setSelectedTeam([]);
    setSelectedEmployee([]);
    setSelectedDepartment([]);
    let employees = employeesAllDrops?.filter(
      (comp) =>
        (selectedCompany.length > 0 ? selectedCompany.map((item) => item.value).includes(comp.company) : true) &&
        (selectedBranch.length > 0 ? selectedBranch.map((item) => item.value).includes(comp.branch) : true) &&
        (options.length > 0 ? options.map((item) => item.value).includes(comp.unit) : true) &&
        (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(comp.team) : true) &&
        (selectedDepartment.length > 0 ? selectedDepartment.map((item) => item.value).includes(comp.department) : true) &&
        (selectedDesignation.length > 0 ? selectedDesignation.map((item) => item.value).includes(comp.designation) : true)
    );
    setEmployeesDrops(employees);
  };
  const customValueRendererUnit = (valueCate, _unitname) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
  };

  //Team multiselect dropdown changes
  const handleTeamChange = (options) => {
    setSelectedTeam(options);
    setSelectedEmployee([]);
    setSelectedDepartment([]);
    let employees = employeesAllDrops?.filter(
      (comp) =>
        (selectedCompany.length > 0 ? selectedCompany.map((item) => item.value).includes(comp.company) : true) &&
        (selectedBranch.length > 0 ? selectedBranch.map((item) => item.value).includes(comp.branch) : true) &&
        (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(comp.unit) : true) &&
        (options.length > 0 ? options.map((item) => item.value).includes(comp.team) : true) &&
        (selectedDepartment.length > 0 ? selectedDepartment.map((item) => item.value).includes(comp.department) : true) &&
        (selectedDesignation.length > 0 ? selectedDesignation.map((item) => item.value).includes(comp.designation) : true)
    );
    setEmployeesDrops(employees);
  };
  const customValueRendererTeam = (valueCate, _teamname) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Team";
  };

  //department multiselect dropdown changes
  const handleDepartmentChange = (options) => {
    setSelectedDepartment(options);
    setSelectedEmployee([]);
    // fetchUserMonthYearBased(selectedMonth, selectedYear, options);
    let employees = employeesAllDrops?.filter(
      (comp) =>
        (selectedCompany.length > 0 ? selectedCompany.map((item) => item.value).includes(comp.company) : true) &&
        (selectedBranch.length > 0 ? selectedBranch.map((item) => item.value).includes(comp.branch) : true) &&
        (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(comp.unit) : true) &&
        (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(comp.team) : true) &&
        (options.length > 0 ? options.map((item) => item.value).includes(comp.department) : true) &&
        (selectedDesignation.length > 0 ? selectedDesignation.map((item) => item.value).includes(comp.designation) : true)
    );
    setEmployeesDrops(employees);
  };
  const customValueRendererDepartment = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Department";
  };

  //designation multiselect dropdown changes
  const handleDesignationChange = (options) => {
    setSelectedDesignation(options);
    setSelectedEmployee([]);
    let employees = employeesAllDrops?.filter(
      (comp) =>
        (selectedCompany.length > 0 ? selectedCompany.map((item) => item.value).includes(comp.company) : true) &&
        (selectedBranch.length > 0 ? selectedBranch.map((item) => item.value).includes(comp.branch) : true) &&
        (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(comp.unit) : true) &&
        (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(comp.team) : true) &&
        (selectedDepartment.length > 0 ? selectedDepartment.map((item) => item.value).includes(comp.department) : true) &&
        (options.length > 0 ? options.map((item) => item.value).includes(comp.designation) : true)
    );
    // console.log(employees);
    setEmployeesDrops(employees);
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Production Salary List.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setIsActive(false);
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
    company: true,
    branch: true,
    unit: true,
    team: true,
    designation: true,
    employeename: true,
    aadharname: true,
    processcode: true,
    doj: true,
    experienceinmonth: true,
    totalnumberofdays: true,
    totalshift: true,
    clsl: true,
    weekoff: true,
    holiday: true,
    totalasbleave: true,
    totalpaidDays: true,

    oldgross: true,
    oldbasic: true,
    oldhra: true,
    oldconveyance: true,
    oldmedicalallowance: true,
    oldproductionallowance: true,
    oldproductionallowancetwo: true,
    oldotherallowance: true,

    newgross: true,
    actualbasic: true,
    actualhra: true,
    actualconveyance: true,
    actualmedicalallowance: true,
    actualproductionallowance: true,
    actualproductionallowancetwo: true,
    actualotherallowance: true,

    targetpoints: true,
    achievedpoints: true,
    achieved: true,
    achievedproductionallowance: true,
    actualnetsalary: true,
    noallowanceshift: true,
    shiftallowancepoint: true,
    shiftallowancetarget: true,
    nightshiftallowance: true,
    // lopbasic: true,
    // lophra: true,
    // lopconveyance: true,
    // lopmedicalallowance: true,
    // lopproductionallowance: true,
    // lopotherallowance: true,
    // lopnetsalary: true,
    // prodbasic: true,
    // prodhra: true,
    // prodconveyance: true,
    // prodmedicalallowance: true,
    // prodproductionallowance: true,
    // prodotherallowance: true,
    attendancelop: true,
    // calculatednetsalary: true,
    actualpenaltyamount: true,
    penaltyamount: true,
    // lossdeduction: true,
    otherdeduction: true,
    totalpointsvalue: true,
    era: true,
    actualera: true,
    revenueallowance: true,
    shortage: true,
    shortageone: true,
    prodlossdeduction: true,
    prodnetsalary: true,
    prodbasicp: true,
    prodhrap: true,
    prodconveyancep: true,
    prodmedicalallowancep: true,
    prodproductionallowancep: true,
    prodotherallowancep: true,
    prodnetsalaryonep: true,
    prodemppf: true,
    prodempesi: true,
    prodempptax: true,
    prodemprpf: true,
    prodempresi: true,
    prodshiftallowance: true,
    prodtotaldeductions: true,
    prodsalary: true,
    prodsalarypenalty: true,
    prodlopdays: true,
    prodlop: true,
    prodleavededuction: true,
    prodctc: true,
    prodfinalvalue: true,
    prodactualdeduction: true,

    prodminimumdeduction: true,

    currentmonthavg: true,
    currentmonthattendance: true,
    paidstatus: true,

    salarytype: true,
    deductiontype: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [status, setStatus] = useState("");

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [items, setItems] = useState([]);
  //submit option for saving
  const handleSubmit = async (e) => {
    // e.preventDefault();
    // if (selectedCompany.length === 0) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
    //       <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select Company'}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } else
    if (selectedDepartment.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedUnit.legnth === 0 && selectedTeam.length === 0 && selectedDepartment.length === 0 && selectedDesignation.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team or Department or Designation"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedTeam.length === 0 && selectedDepartment.length === 0 && selectedDesignation.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team or Department or Designation"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      try {
        setIsActive(true);
        setSelectedMonthExcel(Number(selectedMonthNum));
        handleOpenLoadingMessage();
        setStatus("Fetching Attendance Details");
        let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: selectedDepartment.map((item) => item.value),
          branch: selectedBranch.map((item) => item.value),
          unit: selectedUnit.map((item) => item.value),
          team: selectedTeam.map((item) => item.value),
          employees: selectedEmployee.length > 0 ? selectedEmployee.map((item) => item.value) : employeesDrops.map((item) => item.companyname),
          month: String(selectmonthname),
          year: String(selectedYear),
        });
        let employeelistnames = res.data.users.length > 0 ? [...new Set(res.data.users.map((item) => item.companyname))] : [];

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
                month: Number(selectedMonthNum) + 1 > 12 ? 1 : Number(selectedMonthNum) + 1,
                year: Number(selectedMonthNum) + 1 > 12 ? Number(selectedYear) + 1 : Number(selectedYear),
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
              const filteredBatch = res_usershift?.data?.finaluser?.filter((d) => {
                const [day, month, year] = d.rowformattedDate.split("/");
                const formattedDate = new Date(`${year}-${month}-${day}`);
                const reasonDate = new Date(d.reasondate);
                const dojDate = new Date(d.doj);

                if (d.reasondate && d.reasondate !== "") {
                  return formattedDate <= reasonDate;
                } else if (d.doj && d.doj !== "") {
                  return formattedDate >= dojDate;
                } else {
                  return d;
                }
              });

              let filtered = filteredBatch;
              let countByEmpcodeClockin = {}; // Object to store count for each empcode
              let countByEmpcodeClockout = {};

              let result = filtered.flatMap((item, index) => {
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
                const absentItems = filtered?.filter((d) => d.clockinstatus === "Absent" && item.empcode === d.empcode && d.clockin === "00:00:00" && d.clockout === "00:00:00");

                // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
                if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
                  // Define the date format for comparison
                  const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                  const isPreviousDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && leaveItem.empcode === item.empcode);
                  const isPreviousDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, "days"), "day") && absentItem.empcode === item.empcode);

                  const isNextDayLeave = leaveresult.some((leaveItem) => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && leaveItem.empcode === item.empcode);
                  const isNextDayAbsent = absentItems.some((absentItem) => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, "days"), "day") && absentItem.empcode === item.empcode);

                  if (isPreviousDayLeave) {
                    updatedClockInStatus = "BeforeWeekOffLeave";
                    updatedClockOutStatus = "BeforeWeekOffLeave";
                  }
                  if (isPreviousDayAbsent) {
                    updatedClockInStatus = "BeforeWeekOffAbsent";
                    updatedClockOutStatus = "BeforeWeekOffAbsent";
                  }
                  if (isNextDayLeave) {
                    updatedClockInStatus = "AfterWeekOffLeave";
                    updatedClockOutStatus = "AfterWeekOffLeave";
                  }
                  if (isNextDayAbsent) {
                    updatedClockInStatus = "AfterWeekOffAbsent";
                    updatedClockOutStatus = "AfterWeekOffAbsent";
                  }
                }

                // Check if 'Late - ClockIn' count exceeds the specified limit
                if (updatedClockInStatus === "Late - ClockIn") {
                  updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                  countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
                }
                // Check if 'Early - ClockOut' count exceeds the specified limit
                if (updatedClockOutStatus === "Early - ClockOut") {
                  updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                  countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
                }

                return {
                  ...item,
                  shiftallot: item.shiftallot,
                  weekOffDates: item.weekOffDates,
                  clockinstatus: updatedClockInStatus,
                  clockoutstatus: updatedClockOutStatus,
                };
              });
              const itemsWithSerialNumber = result?.map((item, index) => ({
                ...item,
                shiftmode: item.shiftMode,
                uniqueid: item.id,
                userid: item.userid,
                totalnumberofdays: item.totalnumberofdays,
                empshiftdays: item.empshiftdays,
                totalcounttillcurrendate: item.totalcounttillcurrendate,
                totalshift: item.totalshift,
                attendanceauto: getattendancestatus(item),
                daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
                appliedthrough: getAttModeAppliedThr(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                lopcalculation: getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
                lopcount: getCount(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
                modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)),
                paidpresent: getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item))),
                lopday: getAssignLeaveDayForLop(getFinalLop(getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
                paidpresentday: getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)), getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item)))),
              }));

              const weekOption = ["BeforeWeekOffAbsent", "AfterWeekOffAbsent", "BeforeWeekOffLeave", "AfterWeekOffLeave"];
              itemsWithSerialNumber.forEach((item, index, array) => {
                if (attStatusOption.includes(item.daystatus) && item.clockin === "00:00:00" && item.clockout === "00:00:00" && item.paidpresent === "Yes - Full Day") {
                  const previousItem = array[index - 1];
                  const nextItem = array[index + 1];

                  const hasRelevantStatus = (entry) => entry && (weekOption.includes(entry.clockinstatus) || (weekOption.includes(entry.clockoutstatus) && entry.shift === "Week Off"));

                  // if (hasRelevantStatus(previousItem)) {
                  //     previousItem.clockinstatus = 'Week Off';
                  //     previousItem.clockoutstatus = 'Week Off';
                  //     previousItem.attendanceauto = getattendancestatus(previousItem);
                  //     previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                  // }
                  // if (hasRelevantStatus(nextItem)) {
                  //     nextItem.clockinstatus = 'Week Off';
                  //     nextItem.clockoutstatus = 'Week Off';
                  //     nextItem.attendanceauto = getattendancestatus(nextItem);
                  //     nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                  // }
                  if (hasRelevantStatus(previousItem)) {
                    previousItem.clockinstatus = "Week Off";
                    previousItem.clockoutstatus = "Week Off";
                    previousItem.attendanceauto = getattendancestatus(previousItem);
                    previousItem.daystatus = previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem);
                    previousItem.appliedthrough = getAttModeAppliedThr(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.lop = getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.loptype = getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.lopcalculation = getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                    previousItem.lopcount = getCount(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                    previousItem.modetarget = getAttModeTarget(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.paidpresentbefore = getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.paidleavetype = getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem));
                    previousItem.paidpresent = getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)));
                    previousItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModeLopType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem))));
                    previousItem.paidpresentday = getAssignLeaveDayForPaid(
                      getFinalPaid(getAttModePaidPresent(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)), getAttModePaidPresentType(previousItem.attendanceautostatus ? previousItem.attendanceautostatus : getattendancestatus(previousItem)))
                    );
                  }
                  if (hasRelevantStatus(nextItem)) {
                    nextItem.clockinstatus = "Week Off";
                    nextItem.clockoutstatus = "Week Off";
                    nextItem.attendanceauto = getattendancestatus(nextItem);
                    nextItem.daystatus = nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem);
                    nextItem.appliedthrough = getAttModeAppliedThr(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.lop = getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.loptype = getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.lopcalculation = getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                    nextItem.lopcount = getCount(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                    nextItem.modetarget = getAttModeTarget(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.paidpresentbefore = getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.paidleavetype = getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem));
                    nextItem.paidpresent = getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)));
                    nextItem.lopday = getAssignLeaveDayForLop(getFinalLop(getAttModeLop(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModeLopType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                    nextItem.paidpresentday = getAssignLeaveDayForPaid(getFinalPaid(getAttModePaidPresent(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem)), getAttModePaidPresentType(nextItem.attendanceautostatus ? nextItem.attendanceautostatus : getattendancestatus(nextItem))));
                  }
                }
              });

              const finalresult = [];

              itemsWithSerialNumber.forEach((item) => {
                // console.log(item, "item");
                const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

                const existingEntryIndex = finalresult.findIndex((entry) => entry.empcode === item.empcode);

                if (existingEntryIndex !== -1) {
                  if (item.shift !== "Not Allotted") {
                    finalresult[existingEntryIndex].shift++;
                  }
                  if ((item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00") || (item.daystatus === "MWEEKOFF" && item.paidpresent === "Yes - Full Day")) {
                    finalresult[existingEntryIndex].weekoff++;
                  }

                  if (item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday") {
                    finalresult[existingEntryIndex].holidayCount++;
                  }
                  if (item.shift === "Week Off") {
                    finalresult[existingEntryIndex].weekoffall++;
                  }
                  if (item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP") {
                    finalresult[existingEntryIndex].dlob++;
                  }
                  if (["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus)) {
                    finalresult[existingEntryIndex].present++;
                  }
                  // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
                  //     finalresult[existingEntryIndex].leaveCount++;
                  // }
                  if (leaveOnDateApproved) {
                    // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                    finalresult[existingEntryIndex].leaveCount++;
                    // }
                  }
                  if (item.lopcalculation === "Yes - Double Day") {
                    finalresult[existingEntryIndex].doublelopcount++;
                  }

                  if (item.lopcalculation === "Yes - Double Half Day") {
                    finalresult[existingEntryIndex].doublehalflopcount++;
                  }

                  if (item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.attendanceauto === undefined && item.daystatus === undefined) {
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
                    //  shift: (item.clockinstatus !== 'Not Allotted' && item.clockoutstatus !== 'Not Allotted' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,

                    shift: 1,

                    // weekoff: item.weekoffCount,
                    weekoff: item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off" && item.clockin === "00:00:00" && item.clockout === "00:00:00" ? 1 : 0,
                    lopcount: item.lopcount,

                    paidpresentday: item.paidpresentday,
                    totalcounttillcurrendate: item.totalcounttillcurrendate,
                    totalshift: item.totalshift,
                    holidayCount: item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday" ? 1 : 0,
                    // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                    // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
                    leaveCount: leaveOnDateApproved ? 1 : 0,
                    clsl: 0,
                    holiday: 0,
                    totalpaiddays: 0,
                    nostatus: 0,

                    // nostatuscount: item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No' ? 1 : 0,
                    nostatuscount: item.clockinstatus !== "Not Allotted" && item.clockoutstatus !== "Not Allotted" && item.paidpresent === "No" && item.modetarget === "No" && item.lopcalculation === "No" ? 1 : 0,
                    weekoffall: item.shift === "Week Off" ? 1 : 0,
                    present: ["MPRESENT", "PRESENT"].includes(item.daystatus) && ["MPRESENT", "PRESENT"].includes(item.daystatus) ? 1 : 0,
                    dlob: item.clockinstatus === "DLOP" && item.clockoutstatus === "DLOP" ? 1 : 0,
                    doublelopcount: item.lopcalculation === "Yes - Double Day" ? 1 : 0,
                    doublehalflopcount: item.lopcalculation === "Double Half Day" ? 0.5 : 0,
                  };
                  finalresult.push(newItem);
                }
              });
              let resultdata = finalresult?.map((item, index) => {
                const finalPaidPresentDays = Number(item.paidpresentday) - (Number(item.holidayCount) + Number(item.leaveCount));

                return {
                  ...item,
                  serialNumber: index + 1,
                  totalnumberofdays: Number(item.totalnumberofdays),
                  lopcount: Number(item.lopcount),
                  // paidpresentday: finalPaidPresentDays,
                  paidpresentday: Number(item.paidpresentday) > Number(item.shift) ? Number(item.shift) - Number(item.lopcount) : Number(item.paidpresentday) - (Number(item.doublelopcount) + Number(item.doublehalflopcount)),
                };
              });

              return resultdata;
            } catch (error) {
              console.error("Error in sending batch request:", error);
              return [];
            }
          }

          async function getAllResults() {
            const [allResults, allResults2] = await Promise.all([processBatches(resultarr), processBatches(resultarr2)]);

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
              console.error("Error fetching API data:", err.response?.data?.message || err);
              throw err;
            }
          }

          getAllResults()
            .then((results) => {
              console.log("Final consolidated results for resultarr:", results.allResults.length);
              console.log("Final consolidated results for resultarr2:", results.allResults2.length);
              // console.log(res.data.users.length, 'sdf');
              setEmployeesPayRun(res.data.users);

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
                try {
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
                  // Group items by month
                  item.assignExpLog &&
                    item.assignExpLog.length > 0 &&
                    item.assignExpLog
                      .filter((d) => d.expmode !== "Auto")
                      .sort((a, b) => {
                        return new Date(a.updatedate) - new Date(b.updatedate);
                      })
                      .forEach((item) => {
                        const monthYear = item.updatedate?.split("-").slice(0, 2).join("-");
                        if (!groupedByMonth[monthYear]) {
                          groupedByMonth[monthYear] = [];
                        }
                        groupedByMonth[monthYear].push(item);
                      });

                  // Extract the last item of each group
                  const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

                  // Filter the data array based on the month and year
                  // lastItemsForEachMonth.sort((a, b) => {
                  //   return new Date(a.updatedate) - new Date(b.updatedate);
                  // });
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

                      return months <= 0 ? 0 : months;
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

                  let experienceinmonthCalcVal = item.doj ? (calculateMonthsBetweenDates(item.doj, findDate) < 0 ? 0 : calculateMonthsBetweenDates(item.doj, findDate)) : "";
                  //GET PROCESS CODE FUNCTION
                  const groupedByMonthProcs = {};

                  // Group items by month
                  item.processlog &&
                    item.processlog
                      .sort((a, b) => {
                        return new Date(a.date) - new Date(b.date);
                      })
                      .forEach((item) => {
                        const monthYear = item.date?.split("-")?.slice(0, 2).join("-");
                        if (!groupedByMonthProcs[monthYear]) {
                          groupedByMonthProcs[monthYear] = [];
                        }
                        groupedByMonthProcs[monthYear].push(item);
                      });

                  // Extract the last item of each group
                  const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                  // Filter the data array based on the month and year
                  // lastItemsForEachMonthPros.sort((a, b) => {
                  //   return new Date(a.date) - new Date(b.date);
                  // });

                  const nextMonthFirstDay = new Date(Number(selectedYear), Number(selectedMonthNum), 1);

                  // Subtract one day to get the last day of the given month
                  const lastDate = new Date(nextMonthFirstDay - 1);

                  let lastdateOfSelectedMonth = lastDate.getDate();
                  let selectedMonEndDate = `${selectedYear}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
                  let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;

                  const thisMonthEndDate = findexp ? findexp.todate : selectedMonEndDate;
                  const totaluserDays = (new Date(thisMonthEndDate) - new Date(item.doj)) / (1000 * 60 * 60 * 24);
                  const totaluserDaysNxtMonth = (new Date(findNxtEndDate) - new Date(item.doj)) / (1000 * 60 * 60 * 24);
                  // Find the first item in the sorted array that meets the criteria
                  let filteredItem = null;
                  let filteredItemNxtMonth = null;
                  for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                    const date = lastItemsForEachMonthPros[i].date;

                    if (findDate >= date) {
                      filteredItem = lastItemsForEachMonthPros[i];
                    } else if (thisMonthEndDate >= date && totaluserDays < 31) {
                      filteredItem = lastItemsForEachMonthPros[i];
                    } else {
                      break;
                    }
                  }
                  for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                    const date = lastItemsForEachMonthPros[i].date;

                    if (findNxtStartDate >= date) {
                      filteredItemNxtMonth = lastItemsForEachMonthPros[i];
                    } else if (findNxtEndDate >= date && totaluserDaysNxtMonth < 31) {
                      filteredItem = lastItemsForEachMonthPros[i];
                    } else {
                      break;
                    }
                  }
                  let CHECK_DEPARTMENT_ACCESS = departmentsList.find((d) => d.deptname === item.department);
                  let getprocessCode = filteredItem ? filteredItem.process : "";

                  let processcodemodeexperiecevalue =
                    item.doj && modevalue && modevalue.expmode === "Manual"
                      ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00")
                      : item.doj
                      ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00")
                      : "";
                  let processcodeexpvaluesalary =
                    item.doj && modevalue && modevalue.expmode === "Manual"
                      ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00")
                      : item.doj
                      ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00")
                      : "";

                  // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
                  let processcodeexpvalue =
                    item.doj && modevalue && modevalue.expmode === "Manual"
                      ? modevalue.salarycode + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00")
                      : item.doj
                      ? getprocessCode + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00")
                      : "";

                  let getprocessCodeNxtMonth = filteredItemNxtMonth ? filteredItemNxtMonth.process : "";

                  let processcodeexpvalueNxtMonth =
                    item.doj && modevalue && modevalue.expmode === "Manual"
                      ? modevalue.salarycode + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00")
                      : item.doj
                      ? getprocessCodeNxtMonth + (differenceInMonthstar > 0 ? (differenceInMonthstar <= 9 ? `0${differenceInMonthstar}` : differenceInMonthstar) : "00")
                      : "";

                  //findsalary from salaryslab
                  let findSalDetails =
                    modevalue && modevalue.expmode === "Manual"
                      ? {
                          basic: modevalue.basic,
                          hra: modevalue.hra,
                          conveyance: modevalue.conveyance,
                          gross: modevalue.gross,
                          medicalallowance: modevalue.medicalallowance,
                          productionallowance: modevalue.productionallowance,
                          otherallowance: modevalue.otherallowance,
                          productionallowancetwo: modevalue.productionallowancetwo,
                        }
                      : salSlabs.find((d) => d.company === item.company && d.branch === item.branch && d.salarycode === processcodeexpvaluesalary);
                  //shortageamount from shortage master
                  let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
                  //revenue amount from revenue  master
                  let findRevenueAllow = revenueAmount.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvaluesalary);
                  //finderaamount from eraamount
                  let findERAaountValue = eraAmounts.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvaluesalary);

                  let findAcPointVal = acPointCal.find((d) => d.company === item.company && d.branch === item.branch && d.department === item.department);

                  let totalShiftTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
                  let totalWeekoffTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
                  let totalWeekoffall = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoffall) : 0;

                  let totalShiftTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.shift) : 0;
                  let totalWeekoffTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoff) : 0;
                  let totalWeekoffallNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoffall) : 0;

                  const isHadreasondate = item.reasondate != "" && item.reasondate != undefined;

                  const enddateproduction = isHadreasondate ? item.reasondate : findexp ? findexp.todate : selectedMonEndDate;

                  //GET POINTS FOR SELECTEDMONTH
                  let getdayPointsMonth = dayPointsUser
                    .filter(
                      (d) =>
                        // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
                        d.date >= findDate && d.date <= enddateproduction && d.name === item.companyname
                    )
                    .reduce((acc, current) => {
                      const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.empcode === current.empcode);

                      if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.point += Number(current.point);
                        // existingItem.pointarray +=[ Number(current.point)];

                        // existingItem.daypoint += Number(current.daypoint);
                        existingItem.target += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target);
                        // existingItem.weekoffcount += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 1 : 0;
                        existingItem.date.push(current.date);
                        // existingItem.pointarray.push(current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target));

                        existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;

                        if (current.shiftsts === "Enable" || current.allowancepoint >= 1) {
                          existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
                        }

                        existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;
                        existingItem.allowancetarget += current.shiftsts === "Enable" ? Number(current.target) : 0;
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
                          target: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target),
                          // _id: current.id,
                          branch: current.branch,
                          date: [current.date],
                          unit: current.unit,
                          team: current.team,
                          empcode: current.empcode,
                          // weekoffcount: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 1 : 0,
                          // doj: current.doj,
                          // department: current.department,
                          // prod: current.prod,
                          startDate: current.date,
                          endDate: current.date,
                          allowancetarget: current.shiftsts === "Enable" ? Number(current.target) : 0,
                          // pointarray: [current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off"  || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target)],
                          allowancepoint: current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,

                          noallowancepoint: current.shiftsts === "Enable" || current.allowancepoint >= 1 ? 1 : 0,
                        });
                      }
                      return acc;
                    }, []);

                  let findPointsDetails = getdayPointsMonth.find((d) => d.companyname === item.company && d.branch === item.branch && d.unit === item.unit && d.name === item.companyname);
                  const enddateproductionnxtmonth = isHadreasondate ? item.reasondate : findNxtEndDate;

                  //GET POINTS FOR CURRENT MONTH WHICH IS THE AFTER MONTH OF SELECTED MONTH
                  let getdayPointsMonthNxtMonth = dayPointsUserNxtMonth
                    .filter(
                      (d) =>
                        // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
                        d.date >= findNxtStartDate && d.date <= enddateproductionnxtmonth && d.name === item.companyname
                    )
                    .reduce((acc, current) => {
                      const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

                      if (existingItemIndex !== -1) {
                        // Update existing item
                        const existingItem = acc[existingItemIndex];

                        existingItem.point += Number(current.point);
                        // existingItem.daypoint += Number(current.daypoint);
                        // existingItem.target = Number(findTargetValNxtMonth) * existingItem.date.length;
                        existingItem.target += current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target);

                        existingItem.date.push(current.date);

                        existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;
                        if ((current.conshiftpoints >= 1 && current.shiftsts === "Enable") || current.allowancepoint >= 1) {
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
                          target: current.weekoff == "Not Allotted" || current.weekoff == "Not Allot" || current.weekoff == "" || current.weekoff == "Week Off" || current.daypointsts === "WEEKOFF" ? 0 : Number(current.target),
                          // _id: current.id,
                          branch: current.branch,
                          date: [current.date],
                          unit: current.unit,
                          team: current.team,
                          empcode: current.empcode,

                          startDate: current.date,
                          endDate: current.date,
                          allowancepoint: current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,
                          // noallowancepoint:Number(current.noallowancepoint),
                          noallowancepoint: (current.conshiftpoints && current.shiftsts === "Enable" ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0) > 0 ? 1 : 0,
                        });
                      }
                      return acc;
                    }, []);

                  let findPointsDetailsNxtMonth = getdayPointsMonthNxtMonth.find(
                    (d) => d.companyname == item.company && d.branch == item.branch && d.unit == item.unit && d.name == item.companyname
                    // && d.empcode === item.empcode
                  );
                  // console.log(findPointsDetailsNxtMonth,'findPointsDetailsNxtMonth')
                  // console.log(dayPointsUserNxtMonth, findPointsDetailsNxtMonth, findNxtStartDate, findNxtEndDate, 'dayPointsUserNxtMonth');

                  let getdayPenaltyMonth = dayPenaltyUser
                    .filter((d) => d.date >= findDate && d.date <= (findexp ? findexp.todate : selectedMonEndDate))
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

                  let findPenaltyDetails = getdayPenaltyMonth.find(
                    (d) =>
                      d.company === item.company &&
                      d.branch === item.branch &&
                      d.unit === item.unit &&
                      // && d.team === item.team
                      d.name === item.companyname
                  );
                  // REVENUE AMOUNT
                  let revenueAmountCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (findRevenueAllow ? Number(findRevenueAllow.amount) : 0) : 0;

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

                  //EDIT FIELDS CALCULATION FILTER AND VALUE GET

                  // ATTENDANCE VALUE CALC
                  let totalNoOfDaysCalcVal = findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0;
                  // let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
                  // let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays && Number(findTotalNoOfDays.lopcount ? findTotalNoOfDays.lopcount : 0);
                  // let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : totalpaiddaysallCalvaAL;

                  let paidpresentdayvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.paidpresentday) : 0;
                  let leaveCountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.leaveCount) : 0;
                  let holidayCountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.holidayCount) : 0;
                  let shiftvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
                  let lopcountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.lopcount) : 0;
                  let paiddayscalcvalfrommonthstatus = paidpresentdayvalue;
                  // let paiddayscalcvalfrommonthstatus = Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue) > Number(shiftvalue) ? Number(shiftvalue) - Number(lopcountvalue) : Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue);

                  let paidpresentdayallCalcVal = shiftvalue;
                  let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
                  let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays ? Number(findTotalNoOfDays.lopcount) : 0;
                  let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : paiddayscalcvalfrommonthstatus;

                  let checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
                  let CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";

                  //DAYS POINTS TARGETAND POINTS
                  let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? Number(TargetPointAmt[TargetPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.target) : 0;
                  let AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? Number(AcheivedPointAmt[AcheivedPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.point) : 0;
                  let AcheivedPercentCalcVal =
                    item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 && item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0
                      ? ((AcheivedPointAmt[AcheivedPointAmt.length - 1].value / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2)
                      : item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0
                      ? (((findPointsDetails && findPointsDetails.point) / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2)
                      : item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0
                      ? ((AcheivedPointAmt[AcheivedPointAmt.length - 1].value / (findPointsDetails && findPointsDetails.target)) * 100).toFixed(2)
                      : findPointsDetails
                      ? findPointsDetails.avgpoint.toFixed(2)
                      : 0;
                  AcheivedPercentCalcVal = Number(AcheivedPercentCalcVal);
                  //SHIFT ALLOWANCE ERA PENALY CALCULATION
                  let allowancepointCalcVal = item.shiftallowancelog && item.shiftallowancelog.length > 0 && shiftAllowAmt && shiftAllowAmt.length > 0 ? shiftAllowAmt[shiftAllowAmt.length - 1].value : findPointsDetails ? findPointsDetails.allowancepoint.toFixed(2) : 0;
                  let ERAAmountCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (findERAaountValue ? Number(findERAaountValue.amount) : 0) : 0;

                  let penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value).toFixed(2) : findPenaltyDetails ? findPenaltyDetails.amount.toFixed(2) : 0;

                  let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? findPointsDetails.noallowancepoint : 0;

                  let shiftallowancetarget = CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0 ? targetPointCalcVaue : 0;
                  let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;

                  let nightAllowancefinalcalculation = CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0 ? ((1000 / totalNoOfDaysCalcVal) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

                  let nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

                  //PRODUCTION AND PRODCTION ALLOWACE2
                  let oldprodAllowanceCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.productionallowance) : findSalDetails ? Number(findSalDetails.productionallowance) : 0;
                  let oldprodAllowancetwoCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.productionallowancetwo) : findSalDetails ? Number(findSalDetails.productionallowancetwo) : 0;
                  // ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
                  let oldactualBasicCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.basic) : findSalDetails ? Number(findSalDetails.basic) : 0;
                  let oldactualHraCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.hra) : findSalDetails ? Number(findSalDetails.hra) : 0;
                  let oldactualConveyanceCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.conveyance) : findSalDetails ? Number(findSalDetails.conveyance) : 0;
                  let oldactualMedicalAllowCalcVal = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.medicalallowance) : findSalDetails ? Number(findSalDetails.medicalallowance) : 0;
                  let oldactualOtherCalVAL = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.otherallowance) : findSalDetails ? Number(findSalDetails.otherallowance) : 0;

                  // const getDatesInRange = (fromDate, toDate) => {
                  //   const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                  //   const startDate = new Date(fromDate);
                  //   const endDate = new Date(toDate);

                  //   // Add one day to include the end date
                  //   endDate.setDate(endDate.getDate() + 1);

                  //   let count = 0;
                  //   for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
                  //     count++;
                  //   }

                  //   return count;
                  // };

                  // let tond = getDatesInRange(findDate, findmonthenddate);
                  function getTotalDaysInMonthByName(monthName, year) {
                    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth() + 1; // Convert month name to number
                    return new Date(year, monthIndex, 0).getDate();
                  }

                  let tond = getTotalDaysInMonthByName(selectedMonth, Number(selectedYear));
                  // let tond = Number(totalNoOfDaysCalcVal);
                  // console.log(tond, 'tond');
                  let prodAllowanceCalcVal = Number(((Number(oldprodAllowanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                  let prodAllowancetwoCalcVal = Number(((Number(oldprodAllowancetwoCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                  //calculated  ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
                  let actualBasicCalcVal = Number(((Number(oldactualBasicCalcVal) / tond) * totalshiftCalcVal).toFixed(2));

                  let actualHraCalcVal = Number(((Number(oldactualHraCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                  let actualConveyanceCalcVal = Number(((Number(oldactualConveyanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                  let actualMedicalAllowCalcVal = Number(((Number(oldactualMedicalAllowCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                  let actualOtherCalVAL = Number(((Number(oldactualOtherCalVAL) / tond) * totalshiftCalcVal).toFixed(2));
                  let oldgross = modevalue && modevalue.expmode === "Manual" ? modevalue.gross : Number(oldactualBasicCalcVal) + Number(oldactualHraCalcVal) + Number(oldactualConveyanceCalcVal) + Number(oldactualMedicalAllowCalcVal) + Number(oldprodAllowanceCalcVal) + Number(oldactualOtherCalVAL);

                  let grossValue = modevalue && modevalue.expmode === "Manual" ? modevalue.gross : actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + prodAllowanceCalcVal + actualOtherCalVAL;
                  grossValue = Number(Number(grossValue).toFixed(2));
                  let findPFpercentage = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.pfemployeepercentage) : findSalDetails ? Number(findSalDetails.pfemployeepercentage) : 0;
                  let findESIpercentage = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.esiemployeepercentage) : findSalDetails ? Number(findSalDetails.esiemployeepercentage) : 0;
                  let findEsiMAXSalary = findSalDetails ? Number(findSalDetails.esimaxsalary) : 0;
                  let findEmployerPercentage = findSalDetails ? Number(findSalDetails.pfpercentage) : 0;
                  let findEmployerESIPercentage = findSalDetails ? Number(findSalDetails.esipercentage) : 0;

                  // let pfvalues = item.assignpfesilog && item.assignpfesilog.length > 0 ? item.assignpfesilog[0] : {};

                  //ATTENDANCE LOP CALCUCLATION
                  let attendanceLopCalVal = totalshiftCalcVal > 0 ? ((actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL) / totalshiftCalcVal) * Number(totalasbleaveCalcVal) : 0;

                  let acutalERAValCalc = totalasbleaveCalcVal > 2 && totalshiftCalcVal > 0 ? (Number(ERAAmountCalcVal) - (Number(ERAAmountCalcVal) / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

                  let ShortageCalVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? findShortage && Number(findShortage.amount) : 0;
                  let Shortage1ValCalc = ShortageCalVal > 0 && totalNoOfDaysCalcVal > 0 ? (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (Number(ShortageCalVal) * Number(totalpaiddaycalVal)) / Number(tond) : 0) : 0;

                  //ACHEIVED PRODUCTION ALLOWANCE
                  let acheivedProductionAllowanceValCal =
                    AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0 && targetPointCalcVaue > 0
                      ? AcheivedPointsCalcVal < targetPointCalcVaue
                        ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
                        : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)
                      : 0;
                  let penaltyAmtCalculationVal =
                    Number(differenceInMonthsexp) <= 0
                      ? 0
                      : Number(differenceInMonthsexp) >= 1
                      ? Number(differenceInMonthsexp) >= 2
                        ? Number(differenceInMonthsexp) >= 3
                          ? Number(differenceInMonthsexp) >= 4
                            ? Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0
                            : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.25
                          : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.5
                        : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.75
                      : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 1;

                  // let lossDed = 0;
                  let OtherDed = 0;
                  //PRODUCTION
                  let lossDed = 0;

                  let PROD_Loss_Deduction = 0;
                  let pfvalues = item.assignpfesilog && item.assignpfesilog.length > 0 ? item.assignpfesilog[item.assignpfesilog.length - 1] : {};

                  let PROD_NET_Salary = grossValue * (AcheivedPercentCalcVal / 100);
                  let PROD_BASIC_ValCalc =
                    (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                  let PROD_HRA_ValCalc =
                    (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                  let PROD_CONVEYANCE_ValCalc =
                    (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                  let PROD_MEDICALALLOW_ValCalc =
                    (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                  let PROD_PRODUCTION_ValCalc =
                    (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                  let PROD_OTHER_ValCalc =
                    (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                  let PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

                  //PFDAYS AND PFDEDUCTION
                  let userWeekoff = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
                  let userCLSL = findTotalNoOfDays ? Number(findTotalNoOfDays.clsl) : 0;
                  let DLOB = findTotalNoOfDays ? Number(findTotalNoOfDays.dlob) : 0;
                  let Present = findTotalNoOfDays ? Number(findTotalNoOfDays.present) : 0;
                  //PFDAYS AND PFDEDUCTION
                  // let pfdatcal = 0;
                  // let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
                  // let IsExDate = pfvalues.pfenddate && pfvalues.pfenddate !== '' ? true : false;
                  // //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
                  // let pfmode = pfvalues.pffromdate > findDate ? 'S' : IsExDate ? 'E' : 'ALL';
                  // let PLOP = userWeekoff + userCLSL;

                  // pfdatcal = pfmode === 'S' || pfmode === 'E' ? Number(pfdatcal) + userWeekoff + userCLSL + Number(Present) - DLOB : Number(Present) + Number(PLOP);
                  // let PfDate = daysp >= pfdatcal ? (IsExDate === true && new Date(pfvalues.pfenddate) < new Date(findDate) ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp) + Number(totalasbleaveCalcVal);
                  // let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
                  // let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;
                  let pfdatcal = 0;
                  let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
                  let IsExDate = pfvalues.pfenddate ? true : false;
                  //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
                  let pfmode = pfvalues.pffromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
                  let PLOP = (findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0) + (findTotalNoOfDays ? findTotalNoOfDays.clsl : 0);
                  pfdatcal = pfmode === "S" || pfmode === "E" ? Number(pfdatcal) + Number(totalpaiddaycalVal) : Number(totalpaiddaycalVal);
                  let PfDate = daysp >= pfdatcal ? (IsExDate === true && new Date(pfvalues.pfenddate) < new Date(findDate) ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp ? daysp : 0) + Number(totalasbleaveCalcVal ? totalasbleaveCalcVal : 0);
                  // console.log(daysp >= pfdatcal, daysp, pfdatcal, PfDate, 'PfDate');

                  let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
                  let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;
                  // console.log(pfDaysVal, 'PfDate');
                  // console.log(pfDaysVal, 'PfDate');
                  let PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                  let Esiper = pfvalues.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

                  let PROD_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                  let findprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= PROD_NET_Salary1 && Number(d.toamount) + 0.99 >= PROD_NET_Salary1);

                  let PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

                  let pfAmount1 = findEmployerPercentage / 100;

                  let PROD_PF_Emper_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal * pfAmount1 : 0;
                  // // let pfEmployerDeductionCalc = PF_Emper_deduction
                  //ESI-DEDCUTION
                  let ESI_EMPR_Perncetage = pfvalues.esideduction === true ? Number(findESIpercentage) / 100 : 0;

                  let PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                  let PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                  let PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 ? ((1000 / totalNoOfDaysCalcVal) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

                  let PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

                  let PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

                  let PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 && grossValue > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

                  let PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                  let Mvalue = findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0;
                  let Dvalue = findAcPointVal ? Number(findAcPointVal.dividevalue) : 0;
                  // let Dvalue = findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0;
                  // let Mvalue = findAcPointVal ? Number(findAcPointVal.dividevalue) : 0;

                  let totalPointsValueCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true && AcheivedPointsCalcVal ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0) : 0;

                  //  item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department === "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;

                  let PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                  let PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                  let PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);
                  // console.log(totalPointsValueCalc,revenueAmountCalc,PROD_CTC_Valcalc,Shortage1ValCalc,(( (totalPointsValueCalc + revenueAmountCalc) - (PROD_CTC_Valcalc + Shortage1ValCalc) ) ),'vhr' )

                  let PROD_Actual_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (totalPointsValueCalc + revenueAmountCalc - (PROD_CTC_Valcalc + Shortage1ValCalc) < 0 ? totalPointsValueCalc + revenueAmountCalc - (PROD_CTC_Valcalc + Shortage1ValCalc) : 0) : 0;

                  let PROD_Minimum_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val < 0 ? Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val : 0) : 0;

                  PROD_Loss_Deduction = 0;

                  let PLossDeduction = PROD_Minimum_Deduction_Val + (PROD_Actual_Deduction_Val - OtherDed - PROD_Minimum_Deduction_Val);

                  PROD_Loss_Deduction = PLossDeduction > 0 ? PLossDeduction : -1 * PLossDeduction;

                  //RE-CALULCATION

                  PROD_BASIC_ValCalc =
                    (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                  PROD_HRA_ValCalc =
                    (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                  PROD_CONVEYANCE_ValCalc =
                    (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                  PROD_MEDICALALLOW_ValCalc =
                    (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                  PROD_PRODUCTION_ValCalc =
                    (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;
                  PROD_OTHER_ValCalc =
                    (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0
                      ? 0
                      : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0
                      ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01
                      : 0;

                  PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

                  PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                  PROD_ESI_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                  findprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && Number(d.fromamount) <= PROD_NET_Salary1 && Number(d.toamount) + 0.99 >= PROD_NET_Salary1);

                  PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.tax === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

                  PROD_PF_Emper_deduction = pfDaysVal > 0 && totalshiftCalcVal > 0 ? (PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal * pfAmount1 : 0;

                  PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary || oldgross >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                  PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                  PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 ? ((1000 / totalNoOfDaysCalcVal) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

                  PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

                  PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

                  PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 && grossValue > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

                  PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                  totalPointsValueCalc = AcheivedPointsCalcVal ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0) : 0;
                  //  item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department === "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;

                  PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 || grossValue === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                  PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                  PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);

                  let currentMonthAttendanceVal = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.lopcount) : 0;
                  let currentMonthAvgVal = findPointsDetailsNxtMonth ? Number(Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2)) : 0;

                  // let getPayTypes = payruncontrolmaster.find(d =>

                  //   (d.userdepartment.includes(item.department) || (d.userbranch.includes(item.branch) && d.userunit.includes(item.unit) && d.userteam.includes(item.team))) && d.empname.includes(item.companyname)

                  //   && (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))

                  //   && (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) < Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                  //   // && Number(d.newgross) === Number(grossValue)
                  // )

                  // let salaryTypeVal = getPayTypes ? getPayTypes.salraytype : ""
                  // let deductionTypeVal = getPayTypes ? getPayTypes.deductiontype : ""

                  let currMonAvgFinalcalVal = item.currmonthavglog && item.currmonthavglog.length > 0 && currMonAvgLogVal && currMonAvgLogVal.length > 0 ? Number(currMonAvgLogVal[currMonAvgLogVal.length - 1].value) : currentMonthAvgVal;

                  let currMonAttFinalcalVal = item.currmonthattlog && item.currmonthattlog.length > 0 && currMonAttLogVal && currMonAttLogVal.length > 0 ? Number(currMonAttLogVal[currMonAttLogVal.length - 1].value) : currentMonthAttendanceVal;

                  const ctodate = new Date(findmonthenddate).toISOString();
                  const CLOP = Number(currMonAttFinalcalVal); // Current Leave or Points
                  const CTotalPointsAverage = Number(currMonAvgFinalcalVal);
                  let getpaidStatusVal = "";
                  paidStatusFix
                    .filter((data) => {
                      const isMonthAndDepartmentMatched = data.month.toLowerCase() === selectmonthname.toLowerCase() && data.department.includes(item.department) && data.year == selectedYear;

                      const isReasonStatusValid = item.reasondate >= findDate && (item.resonablestatus === "Absconded" || item.resonablestatus === "Terminate") ? data.frequency === "REJECT" : item.reasondate >= findDate && item.resonablestatus === "Releave Employee" ? data.frequency === "HOLD" : true;

                      const isValueAndPointValid = Number(data.fromvalue) <= Number(totalasbleaveCalcVal) && Number(data.tovalue) >= Number(totalasbleaveCalcVal) && Number(data.frompoint) <= Number(AcheivedPercentCalcVal) && Number(data.topoint) >= Number(AcheivedPercentCalcVal);

                      return isMonthAndDepartmentMatched && isReasonStatusValid && isValueAndPointValid;
                    })
                    .sort((a, b) => {
                      if (a.currentabsentvalue !== b.currentabsentvalue) {
                        return b.currentabsentvalue - a.currentabsentvalue; // Sort descending
                      }
                      return b.currentachievedvalue - a.currentachievedvalue; // Sort descending
                    })
                    .forEach((row) => {
                      let F1 = false,
                        F2 = false,
                        F3 = false,
                        F4 = false;

                      // Check AbsentMode
                      const totalLeave = totalasbleaveCalcVal;
                      const absentValue = parseFloat(row.fromvalue);

                      switch (row.absentmodes) {
                        case "Less than or Equal":
                          F1 = totalLeave <= absentValue;
                          break;
                        case "Less than":
                          F1 = totalLeave < absentValue;
                          break;
                        case "Greater than":
                          F1 = totalLeave > absentValue;
                          break;
                        case "Greater than or Equal":
                          F1 = totalLeave >= absentValue;
                          break;
                        case "Between":
                          F1 = totalLeave >= absentValue && totalLeave <= parseFloat(row.tovalue);
                          break;
                        default:
                          F1 = false;
                      }

                      // Check AchievedMode
                      const achievedPerc = AcheivedPercentCalcVal;
                      const achievedValue = parseFloat(row.frompoint);

                      switch (row.achievedmodes) {
                        case "Less than or Equal":
                          F2 = achievedPerc <= achievedValue;
                          break;
                        case "Less than":
                          F2 = achievedPerc < achievedValue;
                          break;
                        case "Greater than":
                          F2 = achievedPerc > achievedValue;
                          break;
                        case "Greater than or Equal":
                          F2 = achievedPerc >= achievedValue;
                          break;
                        case "Between":
                          F2 = achievedPerc >= achievedValue && achievedPerc <= parseFloat(row.topoint);
                          break;
                        default:
                          F2 = false;
                      }

                      // Date comparison
                      const now = new Date();
                      const fiveDaysAgo = new Date(now);
                      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

                      if (new Date(ctodate) > fiveDaysAgo) {
                        F3 = true;
                        F4 = true;
                      } else {
                        // Current Absent Mode
                        const currentAbsentValue = parseFloat(row.currentabsentvalue);
                        switch (row.currentabsentmodes) {
                          case "Less than or Equal":
                            F3 = CLOP <= currentAbsentValue;
                            break;
                          case "Less than":
                            F3 = CLOP < currentAbsentValue;
                            break;
                          case "Greater than":
                            F3 = CLOP > currentAbsentValue;
                            break;
                          case "Greater than or Equal":
                            F3 = CLOP >= currentAbsentValue;
                            break;

                          default:
                            F3 = false;
                        }

                        // Current Achieved Mode
                        const currentAchievedValue = parseFloat(row.currentachievedvalue);
                        switch (row.currentachievedmodes) {
                          case "Less than or Equal":
                            F4 = CTotalPointsAverage <= currentAchievedValue;
                            break;
                          case "Less than":
                            F4 = CTotalPointsAverage < currentAchievedValue;
                            break;
                          case "Greater than":
                            F4 = CTotalPointsAverage > currentAchievedValue;
                            break;
                          case "Greater than or Equal":
                            F4 = CTotalPointsAverage >= currentAchievedValue;
                            break;
                          default:
                            F4 = false;
                        }
                      }

                      // Final check
                      if (F1 && F2 && F3 && F4) {
                        getpaidStatusVal = row.paidstatus;

                        // if (row.Frequency === 'HOLD' || row.Frequency === 'REJECT') {
                        //   empObj.HoldPersentage = 0;
                        //   empObj.ApReason = 'Reject Auto Hold Full';
                        // } else {
                        //   empObj.HoldPersentage = 0;
                        //   empObj.ApReason = '';
                        // }
                      }
                    });
                  // console.log(getpaidStatusVal, 'getpaidStatusVal');
                  // Set paidStatusVal if a matching row is found
                  let paidStatusVal = getpaidStatusVal === "" ? "No Status" : getpaidStatusVal;

                  return {
                    // ...item,
                    _id: item._id,
                    serialNumber: index + 1,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    team: item.team,
                    empcode: item.empcode,
                    companyname: item.companyname,
                    doj: item.doj ? moment(item.doj)?.format("DD-MM-YYYY") : "",
                    experience: experienceinmonthCalcVal,

                    legalname: item.legalname,
                    designation: item.designation,
                    department: item.department,

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

                    // processcode: item.doj ? getprocessCode : "",
                    // salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
                    // processcodeexp: item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",

                    processcode: item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode : "",
                    salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
                    processcodeexp: processcodemodeexperiecevalue,
                    // item.doj && modevalue && modevalue.expmode == "Manual" ?( modevalue.salarycode + (differenceInMonthsexp <= 9 ? "0"+differenceInMonthsexp : differenceInMonthsexp )):  (item.doj ? getprocessCode +   differenceInMonthsexp : ""),
                    // processcodetar: item.doj ? getprocessCode + (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",

                    oldgross: oldgross,
                    oldbasic: oldactualBasicCalcVal,
                    oldhra: oldactualHraCalcVal,
                    oldconveyance: oldactualConveyanceCalcVal,
                    oldmedicalallowance: oldactualMedicalAllowCalcVal,
                    oldproductionallowance: oldprodAllowanceCalcVal,
                    oldproductionallowancetwo: oldprodAllowancetwoCalcVal,
                    oldotherallowance: oldactualOtherCalVAL,
                    //SALRY SLAB FILTER PAGE
                    basic: actualBasicCalcVal,
                    hra: actualHraCalcVal,
                    conveyance: actualConveyanceCalcVal,
                    medicalallowance: actualMedicalAllowCalcVal,
                    productionallowance: prodAllowanceCalcVal,
                    productionallowancetwo: prodAllowancetwoCalcVal,

                    otherallowance: actualOtherCalVAL,
                    gross: grossValue,

                    //REVENUE ALLOWANCE MASTER PAGE
                    revenueallow: revenueAmountCalc,
                    //SHORTAGE MASTER PAGE
                    // shortage: ShortageCalVal,

                    // "E+G": egvalue,
                    // "H-F": hfvalue,
                    // "I/60": i60value,
                    // "J*8.5": j85value,
                    // "K/27": j85value / (findTotalNoOfDays && Number(findTotalNoOfDays.totalpaiddays)),

                    //ATTENDANCE MONTH STATUS
                    totalnumberofdays: totalNoOfDaysCalcVal,
                    totalshift: totalshiftCalcVal,
                    clsl: findTotalNoOfDays ? findTotalNoOfDays.clsl : 0,
                    weekoff: findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0,
                    holiday: findTotalNoOfDays ? findTotalNoOfDays.holiday : 0,
                    totalasbleave: totalasbleaveCalcVal,
                    totalpaidDays: totalpaiddaycalVal,

                    //LIST PRODUCTION POINTS
                    monthPoint: targetPointCalcVaue,

                    acheivedpoints: AcheivedPointsCalcVal,

                    // acheivedpercent: item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? (((item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? AcheivedPointAmt[AcheivedPointAmt.length - 1].value : findPointsDetails && findPointsDetails.point) / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2) : findPointsDetails && findPointsDetails.avgpoint.toFixed(2),
                    acheivedpercent: AcheivedPercentCalcVal,

                    //DAY POINTS UPLOAD SHIFTALOWANCE AMOUNT
                    allowancepoint: allowancepointCalcVal,
                    noallowancepoint: noshiftlogvalfinal,

                    shiftallowancetarget: shiftallowancetargetfinal,
                    nightshiftallowance: Number(Number(nightAllowanceCalcVal).toFixed(2)),

                    //ERA MASTER PAGE
                    eramount: ERAAmountCalcVal,
                    //PENALTY MASTER PAGE
                    penalty: penaltyCalcVal,
                    penaltyamount: penaltyAmtCalculationVal.toFixed(2),
                    //USER INOIVIDUAL VALUE
                    ipname: item.ipname,
                    insurancenumber: item.insurancenumber,
                    pfmembername: item.pfmembername,
                    uan: item.uan,
                    acheivedproductionallowance: Number(acheivedProductionAllowanceValCal).toFixed(2),
                    attendancelop: Number(attendanceLopCalVal).toFixed(2),
                    actualnetsalary: (actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL - Number(attendanceLopCalVal) + Number(acheivedProductionAllowanceValCal)).toFixed(2),
                    // lopbasic: Number(lopBasicValCal).toFixed(2),
                    // lophra: Number(lopHRAValCal).toFixed(2),
                    // lopconveyance: Number(lopConveyValCal).toFixed(2),
                    // lopmedicalallowance: Number(lopMedicalValCal).toFixed(2),
                    // lopotherallowance: Number(lopOtherValCal).toFixed(2),
                    // lopproductionallowance: lopProductionAllowance.toFixed(2),
                    // lopnetsalary: Number(lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal).toFixed(2),
                    // prodbasic: Number(prodBasicValCalc).toFixed(2),
                    // prodhra: Number(prodHraValCalc).toFixed(2),
                    // prodconveyance: Number(prodConveyanceValCalc).toFixed(2),
                    // prodmedicalallowance: Number(prodMEDAllowanceValCalc).toFixed(2),
                    // prodotherallowance: Number(prodOtherValCalc).toFixed(2),
                    // prodproductionallowance: Number(prodPRODValCalc).toFixed(2),
                    // calculatednetsalary: Number(calcNetSalaryValCalc).toFixed(2),

                    otherdeduction: Number(OtherDed).toFixed(2),

                    shortageone: Number(Shortage1ValCalc).toFixed(2),

                    totalpointsvalue: Number(totalPointsValueCalc).toFixed(2),
                    era: Number(acutalERAValCalc).toFixed(2),
                    shortage: ShortageCalVal,

                    // production
                    prodlossdeduction: Number(PROD_Loss_Deduction).toFixed(2),
                    prodnetsalary: Number(PROD_NET_Salary).toFixed(2),
                    prodbasicp: Number(PROD_BASIC_ValCalc).toFixed(2),
                    prodhrap: Number(PROD_HRA_ValCalc).toFixed(2),
                    prodconveyancep: Number(PROD_CONVEYANCE_ValCalc).toFixed(2),
                    prodmedicalallowancep: Number(PROD_MEDICALALLOW_ValCalc).toFixed(2),
                    prodproductionallowancep: Number(PROD_PRODUCTION_ValCalc).toFixed(2),
                    prodotherallowancep: Number(PROD_OTHER_ValCalc).toFixed(2),
                    prodnetsalaryonep: Number(PROD_NET_Salary1).toFixed(2),
                    prodemppf: Number(PROD_PF_deduction).toFixed(2),
                    prodempesi: Number(PROD_ESI_deduction).toFixed(2),
                    prodempptax: Number(PROD_TaxCalcVal).toFixed(2),
                    prodemprpf: Number(PROD_PF_Emper_deduction).toFixed(2),
                    prodempresi: Number(PROD_ESI_EMPR_deduction).toFixed(2),
                    prodtotaldeductions: Number(PROD_Total_deductions).toFixed(2),
                    prodshiftallowance: Number(PROD_Shift_Allowance).toFixed(2),
                    prodsalary: Number(PROD_SALARY_Calcval).toFixed(2),
                    prodsalarypenalty: Number(PROD_SALARY_PENALTY_Calcval).toFixed(2),
                    prodlopdays: Number(PROD_LOP_days).toFixed(0),
                    prodlop: Number(PROD_LOP_calcval).toFixed(0),
                    prodleavededuction: Number(PROD_Leave_Deduction).toFixed(2),
                    prodctc: Number(PROD_CTC_Valcalc).toFixed(2),
                    prodfinalvalue: Number(PROD_Final_Value_Calc).toFixed(2),
                    prodactualdeduction: Number(PROD_Actual_Deduction_Val).toFixed(2),
                    prodminimumdeduction: Number(PROD_Minimum_Deduction_Val).toFixed(2),

                    currentmonthavg: Number(currMonAvgFinalcalVal),
                    currentmonthattendance: currMonAttFinalcalVal,
                    paidstatus: paidStatusVal,
                    // salarytype: salaryTypeVal,
                    // deductiontype: deductionTypeVal
                  };
                } catch (err) {
                  console.log(err, "err");
                }
              }

              async function sendBatchRequestItems(batch, data) {
                try {
                  const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItem(item, index, data));
                  // const results = await Promise.all(itemsWithSerialNumber);
                  return await Promise.all(itemsWithSerialNumber);
                } catch (err) {
                  console.error("Error processing batch request items:", err);
                  // setBankdetail(false);
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
                  console.log(err, "err");
                }
              }

              getAllResultsItems().then((result) => {
                // console.log(result);
                try {
                  setStatus("Fetched Attendance Details");
                  handleOpenLoadingMessage("Fetched Attendance Details", 75);

                  setItems(
                    result.allResultsItems
                      .sort((a, b) => {
                        // Parse the date (`doj`) in `DD-MM-YYYY` format and compare in ascending order
                        const dateA = new Date(a.doj.split("-").reverse().join("-"));
                        const dateB = new Date(b.doj.split("-").reverse().join("-"));

                        const dateComparison = dateA - dateB;
                        if (dateComparison !== 0) {
                          return dateComparison; // Sort by date if they differ
                        }

                        // Handle `empcode` comparison
                        const getLastFiveDigits = (empcode) => {
                          if (!empcode || typeof empcode !== "string") return null; // Handle missing or invalid empcode
                          const numericPart = empcode.slice(-5); // Extract last 5 characters
                          return parseInt(numericPart, 10); // Convert to number, returns NaN if invalid
                        };

                        const numA = getLastFiveDigits(a.empcode);
                        const numB = getLastFiveDigits(b.empcode);

                        // Place missing or invalid `empcode` last
                        if (numA === null && numB === null) return 0; // Both are invalid, keep their order
                        if (numA === null) return 1; // `a.empcode` is invalid, place it after `b`
                        if (numB === null) return -1; // `b.empcode` is invalid, place it after `a`

                        // Compare numeric parts of `empcode`
                        const empcodeNumericComparison = numA - numB;
                        if (empcodeNumericComparison !== 0) {
                          return empcodeNumericComparison;
                        }

                        // Fallback to full `empcode` comparison (lexicographically)
                        return a.empcode.localeCompare(b.empcode, undefined, {
                          sensitivity: "base",
                        });
                      })
                      .map((item, index) => {
                        return {
                          id: item._id,
                          serialNumber: index + 1,
                          department: item.department,
                          company: item.company,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          designation: item.designation,
                          employeename: item.companyname,
                          empcode: item.empcode,
                          aadharname: item.legalname,
                          processcode: item.processcodeexp,
                          doj: item.doj,
                          experienceinmonth: Number(item.experience),
                          totalnumberofdays: item.totalnumberofdays ? Number(item.totalnumberofdays) : 0,
                          totalshift: item.totalshift ? Number(item.totalshift) : 0,
                          clsl: item.clsl ? Number(item.clsl) : 0,
                          weekoff: item.weekoff ? Number(item.weekoff) : 0,
                          holiday: item.holiday ? Number(item.holiday) : 0,
                          totalasbleave: item.totalasbleave ? Number(item.totalasbleave) : 0,
                          totalpaidDays: item.totalpaidDays ? Number(item.totalpaidDays) : 0,

                          oldgross: item.oldgross ? Number(item.oldgross) : 0,
                          oldbasic: item.oldbasic ? Number(item.oldbasic) : 0,
                          oldhra: item.oldhra ? Number(item.oldhra) : 0,
                          oldconveyance: item.oldconveyance ? Number(item.oldconveyance) : 0,
                          oldmedicalallowance: item.oldmedicalallowance ? Number(item.oldmedicalallowance) : 0,
                          oldproductionallowance: item.oldproductionallowance ? Number(item.oldproductionallowance) : 0,
                          oldproductionallowancetwo: item.oldproductionallowancetwo ? Number(item.oldproductionallowancetwo) : 0,
                          oldotherallowance: item.oldotherallowance ? Number(item.oldotherallowance) : 0,
                          gross: item.oldgross ? Number(item.oldgross) : 0,

                          newgross: item.gross ? Number(item.gross) : 0,
                          actualbasic: item.basic ? Number(item.basic) : 0,
                          actualhra: item.hra ? Number(item.hra) : 0,
                          actualconveyance: item.conveyance ? Number(item.conveyance) : 0,
                          actualmedicalallowance: item.medicalallowance ? Number(item.medicalallowance) : 0,
                          actualproductionallowance: item.productionallowance ? Number(item.productionallowance) : 0,
                          actualproductionallowancetwo: item.productionallowancetwo ? Number(item.productionallowancetwo) : 0,
                          actualotherallowance: item.otherallowance ? Number(item.otherallowance) : 0,

                          targetpoints: item.monthPoint ? Number(item.monthPoint) : 0,
                          achievedpoints: Number(item.acheivedpoints),
                          achieved: Number(item.acheivedpercent),
                          achievedproductionallowance: Number(item.acheivedproductionallowance),
                          actualnetsalary: Number(item.actualnetsalary),
                          //   lopbasic: item.lopbasic,
                          //   lophra: item.lophra,
                          //   lopconveyance: item.lopconveyance,
                          //   lopmedicalallowance: item.lopmedicalallowance,
                          //   lopproductionallowance: item.lopproductionallowance,
                          //   lopotherallowance: item.lopotherallowance,
                          //   lopnetsalary: item.lopnetsalary,
                          //   prodbasic: item.prodbasic,
                          //   prodhra: item.prodhra,
                          //   prodconveyance: item.prodconveyance,
                          //   prodmedicalallowance: item.prodmedicalallowance,
                          //   prodproductionallowance: item.prodproductionallowance,
                          //   prodotherallowance: item.prodotherallowance,
                          noallowanceshift: item.noallowancepoint ? Number(item.noallowancepoint) : 0,
                          shiftallowancepoint: item.allowancepoint ? Number(item.allowancepoint) : 0,
                          shiftallowancetarget: item.shiftallowancetarget ? Number(item.shiftallowancetarget) : 0,
                          nightshiftallowance: item.nightshiftallowance ? Number(item.nightshiftallowance) : 0,

                          totalpointsvalue: Number(item.totalpointsvalue),
                          era: item.eramount ? Number(item.eramount) : 0,
                          actualera: item.era ? Number(item.era) : 0,
                          revenueallowance: item.revenueallow ? Number(item.revenueallow) : 0,

                          shortage: item.shortage ? Number(item.shortage) : 0,
                          shortageone: item.shortageone ? Number(item.shortageone) : 0,

                          attendancelop: item.attendancelop ? Number(item.attendancelop) : 0,
                          calculatednetsalary: item.calculatednetsalary ? Number(item.calculatednetsalary) : 0,
                          actualpenaltyamount: item.penalty ? Number(item.penalty) : 0,
                          penaltyamount: item.penaltyamount ? Number(item.penaltyamount) : 0,
                          lossdeduction: item.lossdeduction ? Number(item.lossdeduction) : 0,
                          otherdeduction: item.otherdeduction ? Number(item.otherdeduction) : 0,

                          prodlossdeduction: item.prodlossdeduction ? Number(item.prodlossdeduction) : 0,
                          prodnetsalary: item.prodnetsalary ? Number(item.prodnetsalary) : 0,
                          prodbasicp: item.prodbasicp ? Number(item.prodbasicp) : 0,
                          prodhrap: item.prodhrap ? Number(item.prodhrap) : 0,
                          prodconveyancep: item.prodconveyancep ? Number(item.prodconveyancep) : 0,
                          prodmedicalallowancep: item.prodmedicalallowancep ? Number(item.prodmedicalallowancep) : 0,
                          prodproductionallowancep: item.prodproductionallowancep ? Number(item.prodproductionallowancep) : 0,
                          prodotherallowancep: item.prodotherallowancep ? Number(item.prodotherallowancep) : 0,
                          prodnetsalaryonep: item.prodnetsalaryonep ? Number(item.prodnetsalaryonep) : 0,
                          prodemppf: item.prodemppf ? Number(item.prodemppf) : 0,
                          prodempesi: item.prodempesi ? Number(item.prodempesi) : 0,
                          prodempptax: item.prodempptax ? Number(item.prodempptax) : 0,
                          prodemprpf: item.prodemprpf ? Number(item.prodemprpf) : 0,
                          prodempresi: item.prodempresi ? Number(item.prodempresi) : 0,
                          prodshiftallowance: item.prodshiftallowance ? Number(item.prodshiftallowance) : 0,
                          prodtotaldeductions: item.prodtotaldeductions ? Number(item.prodtotaldeductions) : 0,
                          prodsalary: item.prodsalary ? Number(item.prodsalary) : 0,
                          prodsalarypenalty: item.prodsalarypenalty ? Number(item.prodsalarypenalty) : 0,
                          prodlopdays: item.prodlopdays ? Number(item.prodlopdays) : 0,
                          prodlop: item.prodlop ? item.prodlop : 0,
                          prodleavededuction: item.prodleavededuction ? Number(item.prodleavededuction) : 0,
                          prodctc: item.prodctc ? Number(item.prodctc) : 0,
                          prodfinalvalue: item.prodfinalvalue ? Number(item.prodfinalvalue) : 0,
                          prodactualdeduction: item.prodactualdeduction ? Number(item.prodactualdeduction) : 0,
                          prodminimumdeduction: item.prodminimumdeduction ? Number(item.prodminimumdeduction) : 0,
                          paidstatus: item.paidstatus,

                          currentmonthavg: item.currentmonthavg ? Number(item.currentmonthavg) : 0,
                          currentmonthattendance: item.currentmonthattendance ? Number(item.currentmonthattendance) : 0,

                          salarytype: item.salarytype,
                          deductiontype: item.deductiontype,
                        };
                      })
                  );

                  setIsActive(false);
                  // setBankdetail(false);
                } catch (err) {
                  console.log(err, "err");
                }
              });
            })
            .catch((error) => {
              console.error("Error in getting all results:", error);
            });
        } else {
          console.log("no data", "123");
          setIsActive(false);
        }

        // setEmployeesPayRun(res.data.users);
        // addSerialNumber(res.data.users, finalresult, finalresultNxt);
      } catch (err) {
        console.log(err);
        handleCloseLoadingMessage();
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
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

    setEmployeesPayRun([]);
    setItems([]);
    setPage(1);
    setPageSize(10);
    setSelectedYear(yyyy);
    setSelectedMonth(currentMonth);
    setSelectMonthName(currentMonth);
    setSelectedMonthNum(mm);
  };

  const columns = [
    {
      title: "SNo",
      dataKey: "serialNumber",
    },
    {
      title: "Department",
      dataKey: "department",
    },
    {
      title: "Company",
      dataKey: "company",
    },
    {
      title: "Branch",
      dataKey: "branch",
    },
    {
      title: "Unit",
      dataKey: "unit",
    },
    {
      title: "Team",
      dataKey: "team",
    },
    {
      title: "Designation",
      dataKey: "designation",
    },
    {
      title: "Emp Code",
      dataKey: "empcode",
    },
    {
      title: "Employee Name",
      dataKey: "employeename",
    },
    {
      title: "Aadhar Name",
      dataKey: "aadharname",
    },
    {
      title: "Process Code",
      dataKey: "processcode",
    },
    {
      title: "DOJ",
      dataKey: "doj",
    },
    {
      title: "Experience In Month",
      dataKey: "experienceinmonth",
    },
    {
      title: "Total No.of Days",
      dataKey: "totalnumberofdays",
    },
    {
      title: "Total Shift",
      dataKey: "totalshift",
    },
    {
      title: "C.L. / S.L.",
      dataKey: "clsl",
    },
    {
      title: "Week Off",
      dataKey: "weekoff",
    },
    {
      title: "Holiday",
      dataKey: "holiday",
    },
    {
      title: "Total Absent/Leave Shift",
      dataKey: "totalasbleave",
    },
    {
      title: "Total Paid Shift",
      dataKey: "totalpaidDays",
    },
    {
      title: "Gross",
      dataKey: "oldgross",
    },
    {
      title: "Basic",
      dataKey: "oldbasic",
    },
    {
      title: "HRA",
      dataKey: "oldhra",
    },
    {
      title: "Conveyance",
      dataKey: "oldconveyance",
    },
    {
      title: "Medical Allowance",
      dataKey: "oldmedicalallowance",
    },
    {
      title: "Production Allowance",
      dataKey: "oldproductionallowance",
    },
    {
      title: "Production Allowance 2",
      dataKey: "oldproductionallowancetwo",
    },
    {
      title: "Other Allowance",
      dataKey: "oldotherallowance",
    },
    {
      title: "New Gross",
      dataKey: "newgross",
    },
    {
      title: "Actual Basic",
      dataKey: "actualbasic",
    },
    {
      title: "Actual HRA",
      dataKey: "actualhra",
    },
    {
      title: "Actual Conveyance",
      dataKey: "actualconveyance",
    },
    {
      title: "Actual Medical Allowance",
      dataKey: "actualmedicalallowance",
    },
    {
      title: "Actual Production Allowance",
      dataKey: "actualproductionallowance",
    },
    {
      title: "Actual Production Allowance 2",
      dataKey: "actualproductionallowancetwo",
    },
    {
      title: "Actual Other Allowance",
      dataKey: "actualotherallowance",
    },
    {
      title: "Target Points",
      dataKey: "targetpoints",
    },
    {
      title: "Achieved Points",
      dataKey: "achievedpoints",
    },
    {
      title: "Achieved %",
      dataKey: "achieved",
    },
    {
      title: "Achieved Production Allowance",
      dataKey: "achievedproductionallowance",
    },
    {
      title: "Actual Net Salary",
      dataKey: "actualnetsalary",
    },
    {
      title: "No. Allowance Shift",
      dataKey: "noallowanceshift",
    },
    {
      title: "Shift Allowance Point",
      dataKey: "shiftallowancepoint",
    },
    {
      title: "Shift Allowance Target",
      dataKey: "shiftallowancetarget",
    },
    {
      title: "Night Shift Allowance",
      dataKey: "nightshiftallowance",
    },
    {
      title: "Total Points Value",
      dataKey: "totalpointsvalue",
    },
    {
      title: "ERA",
      dataKey: "era",
    },
    {
      title: "Actual ERA",
      dataKey: "actualera",
    },
    {
      title: "Revenue Allowance",
      dataKey: "revenueallowance",
    },
    {
      title: "Attendance LOP",
      dataKey: "attendancelop",
    },
    {
      title: "Actual Penalty Amount",
      dataKey: "actualpenaltyamount",
    },
    {
      title: "Penalty Amount",
      dataKey: "penaltyamount",
    },
    {
      title: "Other Deduction",
      dataKey: "otherdeduction",
    },
    {
      title: "Shortage",
      dataKey: "shortage",
    },
    {
      title: "Shortage 1",
      dataKey: "shortageone",
    },
    {
      title: "PROD Loss Deduction",
      dataKey: "prodlossdeduction",
    },
    {
      title: "PROD NET_Salary",
      dataKey: "prodnetsalary",
    },
    {
      title: "PROD Basic",
      dataKey: "prodbasicp",
    },
    {
      title: "PROD HRA",
      dataKey: "prodhrap",
    },
    {
      title: "PROD Conveyance",
      dataKey: "prodconveyancep",
    },
    {
      title: "PROD Medical Allowance",
      dataKey: "prodmedicalallowancep",
    },
    {
      title: "PROD Production Allowance",
      dataKey: "prodproductionallowancep",
    },
    {
      title: "PROD Other Allowance",
      dataKey: "prodotherallowancep",
    },
    {
      title: "PROD NET_Salary1",
      dataKey: "prodnetsalaryonep",
    },
    {
      title: "PROD Emp_pf",
      dataKey: "prodemppf",
    },
    {
      title: "PROD Emp_esi",
      dataKey: "prodempesi",
    },
    {
      title: "PROD Emp_ptax",
      dataKey: "prodempptax",
    },
    {
      title: "PROD Empr_pf",
      dataKey: "prodemprpf",
    },
    {
      title: "PROD Empr_Esi",
      dataKey: "prodempresi",
    },
    {
      title: "PROD Shift_Allowance",
      dataKey: "prodshiftallowance",
    },
    {
      title: "PROD Total Deductions",
      dataKey: "prodtotaldeductions",
    },
    {
      title: "PROD Salary",
      dataKey: "prodsalary",
    },
    {
      title: "PROD Salary+Penalty",
      dataKey: "prodsalarypenalty",
    },
    {
      title: "PROD LOP Days",
      dataKey: "prodlopdays",
    },
    {
      title: "PROD LOP",
      dataKey: "prodlop",
    },
    {
      title: "PROD Leave Deduction",
      dataKey: "prodleavededuction",
    },
    {
      title: "PROD CTC",
      dataKey: "prodctc",
    },
    {
      title: "PROD Final Value",
      dataKey: "prodfinalvalue",
    },
    {
      title: "PROD Actual Deduction",
      dataKey: "prodactualdeduction",
    },
    {
      title: "PROD Minimum Deduction",
      dataKey: "prodminimumdeduction",
    },
    {
      title: `Current (${monthsArr[Number(selectedMonthExcel) + 1 > 12 ? 0 : Number(selectedMonthExcel)]}) Month Avg`,
      dataKey: "currentmonthavg",
    },
    {
      title: `Current (${monthsArr[Number(selectedMonthExcel) + 1 > 12 ? 0 : Number(selectedMonthExcel)]}) Month Attendance`,
      dataKey: "currentmonthattendance",
    },
    {
      title: "Paid Status",
      dataKey: "paidstatus",
    },
  ];

  const downloadPdf = (type) => {
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
          fontSize: 6,
        },
        columns: currentPageColumns,
        body: type === "filtered" ? rowDataTable : items,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }

    doc.save("Production Salary List.pdf");
  };

  // Excel
  const fileName = "Production Salary List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Production Salary List",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus;
    });
    return result[0]?.name;
  };

  const getAttModeAppliedThr = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.appliedthrough;
  };

  const getAttModeLop = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.lop === true ? "Yes" : "No";
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

  const getAttModeTarget = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.target === true ? "Yes" : "No";
  };

  const getAttModePaidPresent = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.paidleave === true ? "Yes" : "No";
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

  const getAssignLeaveDayForLop = (rowlopday) => {
    if (rowlopday === "Yes - Double Day") {
      return "2";
    } else if (rowlopday === "Yes - Full Day") {
      return "1";
    } else if (rowlopday === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };

  const getAssignLeaveDayForPaid = (rowpaidday) => {
    if (rowpaidday === "Yes - Double Day") {
      return "2";
    } else if (rowpaidday === "Yes - Full Day") {
      return "1";
    } else if (rowpaidday === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };
  const getCount = (rowlopstatus) => {
    if (rowlopstatus === "Yes - Double Day") {
      return "2";
    } else if (rowlopstatus === "Yes - Full Day") {
      return "1";
    } else if (rowlopstatus === "Yes - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
  };
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
    return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

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
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
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
      width: 60,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibility.department, headerClassName: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, width: 90, hide: !columnVisibility.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 120, hide: !columnVisibility.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 80, hide: !columnVisibility.unit, headerClassName: "bold-header" },
    { field: "team", headerName: "Team", flex: 0, width: 80, hide: !columnVisibility.team, headerClassName: "bold-header" },
    { field: "designation", headerName: "Designation", flex: 0, width: 170, hide: !columnVisibility.designation, headerClassName: "bold-header" },
    { field: "empcode", headerName: "Emp Code", flex: 0, width: 120, filter: true, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
    { field: "employeename", headerName: "Employee Name", flex: 0, width: 180, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
    { field: "aadharname", headerName: "Aadhar Name", flex: 0, width: 180, hide: !columnVisibility.aadharname, headerClassName: "bold-header" },
    { field: "processcode", headerName: "Process Code", flex: 0, width: 120, hide: !columnVisibility.processcode, headerClassName: "bold-header" },
    { field: "doj", headerName: "DOJ", flex: 0, width: 100, hide: !columnVisibility.doj, headerClassName: "bold-header" },
    { field: "experienceinmonth", headerName: "Experience In Month", flex: 0, width: 100, hide: !columnVisibility.experienceinmonth, headerClassName: "bold-header" },
    { field: "totalnumberofdays", headerName: "Total No.of Days", flex: 0, width: 80, hide: !columnVisibility.totalnumberofdays },
    { field: "totalshift", headerName: "Total Shift", flex: 0, width: 80, hide: !columnVisibility.totalshift, headerClassName: "bold-header" },
    { field: "clsl", headerName: "C.L. / S.L.", flex: 0, width: 80, hide: !columnVisibility.clsl, headerClassName: "bold-header" },
    { field: "weekoff", headerName: "Week Off", flex: 0, width: 80, hide: !columnVisibility.weekoff, headerClassName: "bold-header" },
    { field: "holiday", headerName: "Holiday", flex: 0, width: 80, hide: !columnVisibility.holiday, headerClassName: "bold-header" },
    { field: "totalasbleave", headerName: "Total Absent/Leave Shift", flex: 0, width: 80, hide: !columnVisibility.totalasbleave, headerClassName: "bold-header" },
    { field: "totalpaidDays", headerName: "Total Paid Shift", flex: 0, width: 80, hide: !columnVisibility.totalpaidDays },

    { field: "oldgross", headerName: "Gross", flex: 0, width: 100, hide: !columnVisibility.oldgross, headerClassName: "bold-header" },
    { field: "oldbasic", headerName: "Basic", flex: 0, width: 100, hide: !columnVisibility.oldbasic, headerClassName: "bold-header" },
    { field: "oldhra", headerName: "HRA", flex: 0, width: 100, hide: !columnVisibility.oldhra, headerClassName: "bold-header" },
    { field: "oldconveyance", headerName: "Conveyance", flex: 0, width: 100, hide: !columnVisibility.oldconveyance, headerClassName: "bold-header" },
    { field: "oldmedicalallowance", headerName: "Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.oldmedicalallowance, headerClassName: "bold-header" },
    { field: "oldproductionallowance", headerName: "Production Allowance", flex: 0, width: 100, hide: !columnVisibility.oldproductionallowance, headerClassName: "bold-header" },
    { field: "oldproductionallowancetwo", headerName: "Production Allowance 2", flex: 0, width: 100, hide: !columnVisibility.oldproductionallowancetwo, headerClassName: "bold-header" },
    { field: "oldotherallowance", headerName: "Other Allowance", flex: 0, width: 100, hide: !columnVisibility.oldotherallowance, headerClassName: "bold-header" },

    { field: "newgross", headerName: "New Gross", flex: 0, width: 100, hide: !columnVisibility.newgross, headerClassName: "bold-header" },
    { field: "actualbasic", headerName: "Actual Basic", flex: 0, width: 100, hide: !columnVisibility.actualbasic, headerClassName: "bold-header" },
    { field: "actualhra", headerName: "Actual HRA", flex: 0, width: 100, hide: !columnVisibility.actualhra, headerClassName: "bold-header" },
    { field: "actualconveyance", headerName: "Actual Conveyance", flex: 0, width: 100, hide: !columnVisibility.actualconveyance, headerClassName: "bold-header" },
    { field: "actualmedicalallowance", headerName: "Actual Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.actualmedicalallowance, headerClassName: "bold-header" },
    { field: "actualproductionallowance", headerName: "Actual Production Allowance", flex: 0, width: 100, hide: !columnVisibility.actualproductionallowance, headerClassName: "bold-header" },
    { field: "actualproductionallowancetwo", headerName: "Actual Production Allowance 2", flex: 0, width: 100, hide: !columnVisibility.actualproductionallowancetwo, headerClassName: "bold-header" },
    { field: "actualotherallowance", headerName: "Actual Other Allowance", flex: 0, width: 100, hide: !columnVisibility.actualotherallowance, headerClassName: "bold-header" },

    { field: "targetpoints", headerName: "Target Points", flex: 0, width: 100, hide: !columnVisibility.targetpoints, headerClassName: "bold-header" },
    { field: "achievedpoints", headerName: "Achieved Points", flex: 0, width: 100, hide: !columnVisibility.achievedpoints, headerClassName: "bold-header" },
    { field: "achieved", headerName: "Achieved %", flex: 0, width: 100, hide: !columnVisibility.achieved, headerClassName: "bold-header" },
    { field: "achievedproductionallowance", headerName: "Achieved Production Allowance", flex: 0, width: 100, hide: !columnVisibility.achievedproductionallowance, headerClassName: "bold-header" },
    { field: "actualnetsalary", headerName: "Actual Net Salary", flex: 0, width: 100, hide: !columnVisibility.actualnetsalary, headerClassName: "bold-header" },
    // { field: "lopbasic", headerName: "LOP Basic", flex: 0, width: 100, hide: !columnVisibility.lopbasic, headerClassName: "bold-header" },
    // { field: "lophra", headerName: "LOP HRA", flex: 0, width: 100, hide: !columnVisibility.lophra, headerClassName: "bold-header" },
    // { field: "lopconveyance", headerName: "LOP Conveyance", flex: 0, width: 100, hide: !columnVisibility.lopconveyance, headerClassName: "bold-header" },
    // { field: "lopmedicalallowance", headerName: "LOP Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.lopmedicalallowance, headerClassName: "bold-header" },
    // { field: "lopproductionallowance", headerName: "LOP Production Allowance", flex: 0, width: 100, hide: !columnVisibility.lopproductionallowance, headerClassName: "bold-header" },
    // { field: "lopotherallowance", headerName: "LOP Other Allowance", flex: 0, width: 100, hide: !columnVisibility.lopotherallowance, headerClassName: "bold-header" },
    // { field: "lopnetsalary", headerName: "LOP Net Salary", flex: 0, width: 100, hide: !columnVisibility.lopnetsalary, headerClassName: "bold-header" },
    // { field: "prodbasic", headerName: "PROD Basic", flex: 0, width: 100, hide: !columnVisibility.prodbasic, headerClassName: "bold-header" },
    // { field: "prodhra", headerName: "PROD HRA", flex: 0, width: 100, hide: !columnVisibility.prodhra, headerClassName: "bold-header" },
    // { field: "prodconveyance", headerName: "PROD Conveyance", flex: 0, width: 100, hide: !columnVisibility.prodconveyance, headerClassName: "bold-header" },
    // { field: "prodmedicalallowance", headerName: "PROD Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.prodmedicalallowance, headerClassName: "bold-header" },
    // { field: "prodproductionallowance", headerName: " PROD Production Allowance", flex: 0, width: 100, hide: !columnVisibility.prodproductionallowance, headerClassName: "bold-header" },
    // { field: "prodotherallowance", headerName: "PROD Other Allowance", flex: 0, width: 100, hide: !columnVisibility.prodotherallowance, headerClassName: "bold-header" },
    { field: "noallowanceshift", headerName: "No. Allowance Shift", flex: 0, width: 100, hide: !columnVisibility.noallowanceshift, headerClassName: "bold-header" },
    { field: "shiftallowancepoint", headerName: "Shift Allowance Point", flex: 0, width: 100, hide: !columnVisibility.shiftallowancepoint, headerClassName: "bold-header" },
    { field: "shiftallowancetarget", headerName: "Shift Allowance Target", flex: 0, width: 100, hide: !columnVisibility.shiftallowancetarget, headerClassName: "bold-header" },
    { field: "nightshiftallowance", headerName: "Night Shift Allowance", flex: 0, width: 100, hide: !columnVisibility.nightshiftallowance, headerClassName: "bold-header" },

    { field: "totalpointsvalue", headerName: "Total Points Value", flex: 0, width: 100, hide: !columnVisibility.totalpointsvalue, headerClassName: "bold-header" },
    { field: "era", headerName: "ERA", flex: 0, width: 100, hide: !columnVisibility.era, headerClassName: "bold-header" },
    { field: "actualera", headerName: "Actual ERA", flex: 0, width: 100, hide: !columnVisibility.actualera, headerClassName: "bold-header" },
    { field: "revenueallowance", headerName: "Revenue Allowance", flex: 0, width: 100, hide: !columnVisibility.revenueallowance, headerClassName: "bold-header" },
    { field: "attendancelop", headerName: "Attendance LOP", flex: 0, width: 100, hide: !columnVisibility.attendancelop, headerClassName: "bold-header" },
    // { field: "calculatednetsalary", headerName: "Calculated Net Salary", flex: 0, width: 100, hide: !columnVisibility.calculatednetsalary, headerClassName: "bold-header" },
    { field: "actualpenaltyamount", headerName: "Actual Penalty Amount", flex: 0, width: 100, hide: !columnVisibility.actualpenaltyamount, headerClassName: "bold-header" },
    { field: "penaltyamount", headerName: "Penalty Amount", flex: 0, width: 100, hide: !columnVisibility.penaltyamount, headerClassName: "bold-header" },
    // { field: "lossdeduction", headerName: "Loss Deduction", flex: 0, width: 100, hide: !columnVisibility.lossdeduction, headerClassName: "bold-header" },
    { field: "otherdeduction", headerName: "Other Deduction", flex: 0, width: 100, hide: !columnVisibility.otherdeduction, headerClassName: "bold-header" },
    { field: "shortage", headerName: "Shortage", flex: 0, width: 100, hide: !columnVisibility.shortage, headerClassName: "bold-header" },
    { field: "shortageone", headerName: "Shortage 1", flex: 0, width: 100, hide: !columnVisibility.shortageone, headerClassName: "bold-header" },

    { field: "prodlossdeduction", headerName: "PROD Loss Deduction", flex: 0, width: 100, hide: !columnVisibility.prodlossdeduction, headerClassName: "bold-header" },
    { field: "prodnetsalary", headerName: "PROD NET_Salary", flex: 0, width: 100, hide: !columnVisibility.prodnetsalary, headerClassName: "bold-header" },
    { field: "prodbasicp", headerName: "PROD Basic", flex: 0, width: 100, hide: !columnVisibility.prodbasicp, headerClassName: "bold-header" },
    { field: "prodhrap", headerName: "PROD HRA", flex: 0, width: 100, hide: !columnVisibility.prodhrap, headerClassName: "bold-header" },
    { field: "prodconveyancep", headerName: "PROD Conveyance", flex: 0, width: 100, hide: !columnVisibility.prodconveyancep, headerClassName: "bold-header" },
    { field: "prodmedicalallowancep", headerName: "PROD Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.prodmedicalallowancep, headerClassName: "bold-header" },
    { field: "prodproductionallowancep", headerName: "PROD Production Allowance", flex: 0, width: 100, hide: !columnVisibility.prodproductionallowancep, headerClassName: "bold-header" },
    { field: "prodotherallowancep", headerName: "PROD Other Allowance", flex: 0, width: 100, hide: !columnVisibility.prodotherallowancep, headerClassName: "bold-header" },
    { field: "prodnetsalaryonep", headerName: "PROD NET_Salary1", flex: 0, width: 100, hide: !columnVisibility.prodnetsalaryonep, headerClassName: "bold-header" },
    { field: "prodemppf", headerName: "PROD Emp_pf", flex: 0, width: 90, hide: !columnVisibility.prodemppf, headerClassName: "bold-header" },
    { field: "prodempesi", headerName: "PROD Emp_esi", flex: 0, width: 90, hide: !columnVisibility.prodempesi, headerClassName: "bold-header" },
    { field: "prodempptax", headerName: "PROD Emp_ptax", flex: 0, width: 90, hide: !columnVisibility.prodempptax, headerClassName: "bold-header" },
    { field: "prodemprpf", headerName: "PROD Empr_pf", flex: 0, width: 90, hide: !columnVisibility.prodemprpf, headerClassName: "bold-header" },
    { field: "prodempresi", headerName: "PROD Empr_Esi", flex: 0, width: 90, hide: !columnVisibility.prodempresi, headerClassName: "bold-header" },
    { field: "prodshiftallowance", headerName: "PROD Shift_Allowance", flex: 0, width: 100, hide: !columnVisibility.prodshiftallowance, headerClassName: "bold-header" },
    { field: "prodtotaldeductions", headerName: "PROD Total Deductions", flex: 0, width: 100, hide: !columnVisibility.prodtotaldeductions, headerClassName: "bold-header" },
    { field: "prodsalary", headerName: "PROD Salary", flex: 0, width: 100, hide: !columnVisibility.prodsalary, headerClassName: "bold-header" },
    { field: "prodsalarypenalty", headerName: "PROD Salary+Penalty", flex: 0, width: 100, hide: !columnVisibility.prodsalarypenalty, headerClassName: "bold-header" },
    { field: "prodlopdays", headerName: "PROD LOP Days", flex: 0, width: 100, hide: !columnVisibility.prodlopdays, headerClassName: "bold-header" },
    { field: "prodlop", headerName: "PROD LOP", flex: 0, width: 100, hide: !columnVisibility.prodlop, headerClassName: "bold-header" },
    { field: "prodleavededuction", headerName: "PROD Leave Deduction", flex: 0, width: 100, hide: !columnVisibility.prodleavededuction, headerClassName: "bold-header" },
    { field: "prodctc", headerName: "PROD CTC", flex: 0, width: 100, hide: !columnVisibility.prodctc, headerClassName: "bold-header" },
    { field: "prodfinalvalue", headerName: "PROD Final Value", flex: 0, width: 100, hide: !columnVisibility.prodfinalvalue, headerClassName: "bold-header" },
    { field: "prodactualdeduction", headerName: "PROD Actual Deduction", flex: 0, width: 100, hide: !columnVisibility.prodactualdeduction, headerClassName: "bold-header" },
    { field: "prodminimumdeduction", headerName: "PROD Minimum Deduction", flex: 0, width: 100, hide: !columnVisibility.prodminimumdeduction, headerClassName: "bold-header" },
    { field: "currentmonthavg", headerName: `Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`, flex: 0, width: 100, hide: !columnVisibility.currentmonthavg },
    { field: "currentmonthattendance", headerName: `Current Month (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Attendance`, flex: 0, width: 100, hide: !columnVisibility.currentmonthattendance },
    { field: "paidstatus", headerName: "Paid Status", flex: 0, width: 150, hide: !columnVisibility.paidstatus },

    // { field: "salarytype", headerName: "Salary Type", flex: 0, width: 130, hide: !columnVisibility.salarytype, headerClassName: "bold-header" },
    // { field: "deductiontype", headerName: "Deduction Type", flex: 0, width: 130, hide: !columnVisibility.deductiontype, headerClassName: "bold-header" },
  ];

  const rowDataTable = filteredData;

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
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                // secondary={column.headerName }
              />
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

  return (
    <Box>
      <Headtitle title={"Production Salary List"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}> Manage Production Salary List</Typography>
      {isUserRoleCompare?.includes("aproductionsalarylist") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Production Salary List</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={companies} value={selectedCompany} onChange={handleCompanyChange} valueRenderer={customValueRendererCompany} labelledBy="Please Select Company" />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Branch</Typography>
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
                    <Typography>
                      Department <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={departments} value={selectedDepartment} onChange={handleDepartmentChange} valueRenderer={customValueRendererDepartment} labelledBy="Please Select Company" />
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

                <Grid item md={1.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Year<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                  </FormControl>
                </Grid>
                <Grid item md={1.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Month <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={selectedYear === "Select Year" ? [] : months} value={{ label: selectmonthname, value: selectmonthname }} onChange={handleMonthChange} />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Employee Name</Typography>
                    <MultiSelect
                      options={employeesDrops?.map((com) => ({
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
              </Grid>
              <br />
              <Grid item md={12} sm={12} xs={12}>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button variant="contained" disabled={isActive === true} onClick={(e) => handleSubmit(e)}>
                    Filter
                  </Button>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}

      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lproductionsalarylist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Production Salary List List</Typography>
            </Grid>
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
                  {isUserRoleCompare?.includes("excelproductionsalarylist") && (
                    // <>
                    //   <ExportXL
                    //     csvData={
                    //       rowDataTable
                    //         .sort((a, b) => {
                    //           // First, sort by experienceinmonth
                    //           if (Number(b.experienceinmonth) !== Number(a.experienceinmonth)) {
                    //             return Number(b.experienceinmonth) - Number(a.experienceinmonth);
                    //           }
                    //           // If experienceinmonth is the same, sort by employeename
                    //           return a.employeename.localeCompare(b.employeename);
                    //         }).map((t, index) => ({
                    //           Sno: index + 1,
                    //           Department: t.department,
                    //           Company: t.company,
                    //           Branch: t.branch,
                    //           Unit: t.unit,
                    //           Team: t.team,
                    //           Designation: t.designation,
                    //           "Employee Name": t.employeename,
                    //           "Aadhar Name": t.aadharname,
                    //           "Process Code": t.processcode,
                    //           DOJ: t.doj,
                    //           "Experience In Month": Number(t.experienceinmonth),

                    //           "Total No of Days": Number(t.totalnumberofdays),
                    //           "Total Shift": Number(t.totalshift),
                    //           "CLSL": Number(t.clsl),
                    //           "WeekOff": Number(t.weekoff),
                    //           "Holiday": Number(t.holiday),
                    //           "Total Absent/Leave": Number(t.totalasbleave),
                    //           "Total Paid Days": Number(t.totalpaidDays),

                    //           "Gross": Number(t.oldgross),
                    //           "Basic": Number(t.oldbasic),
                    //           "HRA": Number(t.oldhra),
                    //           "Conveyance": Number(t.oldconveyance),
                    //           "Medical Allowance": Number(t.oldmedicalallowance),
                    //           "Production Allowance": Number(t.oldproductionallowance),
                    //           "Production Allowance 2": Number(t.oldproductionallowancetwo),
                    //           "Other Allowance": Number(t.oldotherallowance),

                    //           "New Gross": Number(t.newgross),
                    //           "Actual Basic": Number(t.actualbasic),
                    //           "Actual HRA": Number(t.actualhra),
                    //           "Actual Conveyance": Number(t.actualconveyance),
                    //           "Actual Medical Allowance": Number(t.actualmedicalallowance),
                    //           "Actual Production Allowance": Number(t.actualproductionallowance),
                    //           "Actual Production Allowance 2": Number(t.actualproductionallowancetwo),
                    //           "Actual Other Allowance": Number(t.actualotherallowance),
                    //           "Target Points": Number(t.targetpoints),
                    //           "Achieved Points": Number(t.achievedpoints),
                    //           "Achieved  %": Number(t.achieved),
                    //           "Achieved Production Allowance": Number(t.achievedproductionallowance),
                    //           "Actual Net Salary": Number(t.actualnetsalary),

                    //           "Attendance LOP": Number(t.attendancelop),
                    //           "Actual Penalty Amount": Number(t.actualpenaltyamount),
                    //           "Penalty Amount": Number(t.penaltyamount),
                    //           "Other Deduction": Number(t.otherdeduction),

                    //           "No Shift Allowance": Number(t.noallowanceshift),
                    //           "Shift Allowance Point": Number(t.shiftallowancepoint),
                    //           "Shift Allowance Target": Number(t.shiftallowancetarget),
                    //           "Night Shift Allowance": Number(t.nightshiftallowance),

                    //           "Total Points Value": Number(t.totalpointsvalue),
                    //           "ERA": Number(t.era),
                    //           "Actual ERA": Number(t.actualera),
                    //           "Revenue Allowance": Number(t.revenueallowance),
                    //           Shortage: (t.shortage),
                    //           "Shortage 1": (t.shortageone),

                    //           "PROD Loss Deduction": Number(t.prodlossdeduction),
                    //           PROD_NET_Salary: Number(t.prodnetsalary),
                    //           "PROD Basic": Number(t.prodbasicp),
                    //           "PROD HRA": Number(t.prodhrap),
                    //           "PROD Conveyance": Number(t.prodconveyancep),
                    //           "PROD Medical Allowance": Number(t.prodmedicalallowancep),
                    //           "PROD Production Allowance": Number(t.prodproductionallowancep),
                    //           "PROD Other Allowance": Number(t.prodotherallowancep),
                    //           PROD_NET_Salary1: Number(t.prodnetsalaryonep),

                    //           "PROD_Emp_pf": Number(t.prodemppf),
                    //           "PROD_Emp_esi": Number(t.prodempesi),
                    //           "PROD_Emp_ptax": Number(t.prodempptax),
                    //           "PROD_Empr_pf": Number(t.prodemprpf),
                    //           "PROD_Empr_Esi": Number(t.prodempresi),
                    //           "PROD_Shift_Allowance": Number(t.prodshiftallowance),
                    //           "PROD Total Deductions": Number(t.prodtotaldeductions),

                    //           "PROD Salary": Number(t.prodsalary),
                    //           "PROD Salary+Penalty": Number(t.prodsalarypenalty),
                    //           "PROD LOP Days": Number(t.prodlopdays),
                    //           "PROD LOP": Number(t.prodlop),
                    //           "PROD Leave Deduction": Number(t.prodleavededuction),

                    //           "PROD CTC": Number(t.prodctc),
                    //           "PROD Final Value": Number(t.prodfinalvalue),

                    //           "PROD Actual Deduction": Number(t.prodactualdeduction),
                    //           "PROD Minimum Deduction": Number(t.prodminimumdeduction),
                    //           [`Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
                    //           [`Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
                    //           "Paid Status": t.paidstatus,

                    //           "Salary Type": t.salarytype,
                    //           "Deduction Type": t.deductiontype,
                    //         }))}
                    //     fileName={fileName}
                    //   />
                    // </>
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);

                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvproductionsalarylist") && (
                    // <>
                    //   <ExportCSV
                    //     csvData={
                    //       rowDataTable
                    //         .sort((a, b) => {
                    //           // First, sort by experienceinmonth
                    //           if (Number(b.experienceinmonth) !== Number(a.experienceinmonth)) {
                    //             return Number(b.experienceinmonth) - Number(a.experienceinmonth);
                    //           }
                    //           // If experienceinmonth is the same, sort by employeename
                    //           return a.employeename.localeCompare(b.employeename);
                    //         }).map((t, index) => ({
                    //           Sno: index + 1,
                    //           Department: t.department,
                    //           Company: t.company,
                    //           Branch: t.branch,
                    //           Unit: t.unit,
                    //           Team: t.team,
                    //           Designation: t.designation,
                    //           "Employee Name": t.employeename,
                    //           "Aadhar Name": t.aadharname,
                    //           "Process Code": t.processcode,
                    //           DOJ: t.doj,
                    //           "Experience In Month": Number(t.experienceinmonth),

                    //           "Total No of Days": Number(t.totalnumberofdays),
                    //           "Total Shift": Number(t.totalshift),
                    //           "CLSL": Number(t.clsl),
                    //           "WeekOff": Number(t.weekoff),
                    //           "Holiday": Number(t.holiday),
                    //           "Total Absent/Leave": Number(t.totalasbleave),
                    //           "Total Paid Days": Number(t.totalpaidDays),

                    //           "Gross": Number(t.oldgross),
                    //           "Basic": Number(t.oldbasic),
                    //           "HRA": Number(t.oldhra),
                    //           "Conveyance": Number(t.oldconveyance),
                    //           "Medical Allowance": Number(t.oldmedicalallowance),
                    //           "Production Allowance": Number(t.oldproductionallowance),
                    //           "Production Allowance 2": Number(t.oldproductionallowancetwo),
                    //           "Other Allowance": Number(t.oldotherallowance),

                    //           "New Gross": Number(t.newgross),
                    //           "Actual Basic": Number(t.actualbasic),
                    //           "Actual HRA": Number(t.actualhra),
                    //           "Actual Conveyance": Number(t.actualconveyance),
                    //           "Actual Medical Allowance": Number(t.actualmedicalallowance),
                    //           "Actual Production Allowance": Number(t.actualproductionallowance),
                    //           "Actual Production Allowance 2": Number(t.actualproductionallowancetwo),
                    //           "Actual Other Allowance": Number(t.actualotherallowance),
                    //           "Target Points": Number(t.targetpoints),
                    //           "Achieved Points": Number(t.achievedpoints),
                    //           "Achieved  %": Number(t.achieved),
                    //           "Achieved Production Allowance": Number(t.achievedproductionallowance),
                    //           "Actual Net Salary": Number(t.actualnetsalary),

                    //           "Attendance LOP": Number(t.attendancelop),
                    //           "Actual Penalty Amount": Number(t.actualpenaltyamount),
                    //           "Penalty Amount": Number(t.penaltyamount),
                    //           "Other Deduction": Number(t.otherdeduction),

                    //           "No Shift Allowance": Number(t.noallowanceshift),
                    //           "Shift Allowance Point": Number(t.shiftallowancepoint),
                    //           "Shift Allowance Target": Number(t.shiftallowancetarget),
                    //           "Night Shift Allowance": Number(t.nightshiftallowance),

                    //           "Total Points Value": Number(t.totalpointsvalue),
                    //           "ERA": Number(t.era),
                    //           "Actual ERA": Number(t.actualera),
                    //           "Revenue Allowance": Number(t.revenueallowance),
                    //           Shortage: Number(t.shortage),
                    //           "Shortage 1": Number(t.shortageone),
                    //           "PROD Loss Deduction": Number(t.prodlossdeduction),
                    //           PROD_NET_Salary: Number(t.prodnetsalary),
                    //           "PROD Basic": Number(t.prodbasicp),
                    //           "PROD HRA": Number(t.prodhrap),
                    //           "PROD Conveyance": Number(t.prodconveyancep),
                    //           "PROD Medical Allowance": Number(t.prodmedicalallowancep),
                    //           "PROD Production Allowance": Number(t.prodproductionallowancep),
                    //           "PROD Other Allowance": Number(t.prodotherallowancep),
                    //           PROD_NET_Salary1: Number(t.prodnetsalaryonep),

                    //           "PROD_Emp_pf": Number(t.prodemppf),
                    //           "PROD_Emp_esi": Number(t.prodempesi),
                    //           "PROD_Emp_ptax": Number(t.prodempptax),
                    //           "PROD_Empr_pf": Number(t.prodemprpf),
                    //           "PROD_Empr_Esi": Number(t.prodempresi),
                    //           "PROD_Shift_Allowance": Number(t.prodshiftallowance),
                    //           "PROD Total Deductions": Number(t.prodtotaldeductions),

                    //           "PROD Salary": Number(t.prodsalary),
                    //           "PROD Salary+Penalty": Number(t.prodsalarypenalty),
                    //           "PROD LOP Days": Number(t.prodlopdays),
                    //           "PROD LOP": Number(t.prodlop),
                    //           "PROD Leave Deduction": Number(t.prodleavededuction),

                    //           "PROD CTC": Number(t.prodctc),
                    //           "PROD Final Value": Number(t.prodfinalvalue),

                    //           "PROD Actual Deduction": Number(t.prodactualdeduction),
                    //           "PROD Minimum Deduction": Number(t.prodminimumdeduction),
                    //           [`Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
                    //           [`Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
                    //           "Paid Status": t.paidstatus,

                    //           "Salary Type": t.salarytype,
                    //           "Deduction Type": t.deductiontype,
                    //         }))}
                    //     fileName={fileName}
                    //   />
                    // </>
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);

                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printproductionsalarylist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfproductionsalarylist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => setIsPdfFilterOpen(true)}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageproductionsalarylist") && (
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
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
            {/* {isUserRoleCompare?.includes("bdproductionsalarylist") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)} */}
            <br />
            <br />
            {isActive ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                  {/* <Box>
                      <RotatingLines
                        visible={true}
                        height="96"
                        width="96"
                        strokeColor="#1976d2"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        />
                        </Box>
                      </Box> */}
                  {/*  
                      <Box style={{  width: '50%', height: '96px' }}>
                      <Typography> {status}</Typography>
                        <LinearProgressBar progress={loadingProgress} />
              
                      </Box> 
                    */}
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
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        // isPdfFilterOpen={isPdfFilterOpen}
        // setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
    </Box>
  );
}

export default ProductionSalaryList;
