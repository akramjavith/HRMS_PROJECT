import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import StyledDataGrid from "../../../components/TableStyle";
import Headtitle from "../../../components/Headtitle";
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
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import ExportData from "../../../components/ExportData";

function FinalSalaryList() {
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

  const [profTaxMaster, setProfTaxMaster] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [selectedMonthExcel, setSelectedMonthExcel] = useState("")

  const { isUserRoleCompare, isUserRoleAccess, allCompany, allBranch, allUnit, allTeam } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  // const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [copiedData, setCopiedData] = useState("");
  let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



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
      minHeight: "53px !important",
      maxHeight: "53px",
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

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    setSelectMonthName(event.label);
    setSelectedMonthNum(event.numval);
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


  const fetchCompanies = async () => {
    setIsActive(true);
    try {
      const [RES_COM, RES_BRANCH, RES_USERS, RES_UNIT, RES_DESIG, RES_TEAMS, RES_TAX, RES_SHIFT, RES_SALARYSLAB, RES_SHORTAGE, RES_ERA, RES_REVENUE, RES_ACPOINT, RES_ATTSTS, RES_ATTMODE
      ] = await Promise.all([
        axios.get(SERVICE.COMPANY, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.BRANCH, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.USERS_LIMITED_DROPDOWN_FINALSALARY, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.UNIT, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
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

      ]);

      setAcPointCal(RES_ACPOINT?.data?.acpointcalculation);
      setRevenueAmount(RES_REVENUE?.data?.revenueamounts);
      setEraAmounts(RES_ERA?.data?.eraamounts);
      setManageshortagemasters(RES_SHORTAGE?.data?.manageshortagemasters);
      setsalSlabs(RES_SALARYSLAB.data.salaryslab);
      setShifts(RES_SHIFT?.data?.shifts);
      setProfTaxMaster(RES_TAX?.data?.professionaltaxmaster);
      setTeams(RES_TEAMS.data.teamsdetails);
      setDesignations(RES_DESIG.data.designation);
      setUnits(RES_UNIT.data.units);
      setEmployeesDrops(RES_USERS.data.users);
      setBranches(RES_BRANCH.data.branch);
      setCompanies(RES_COM.data.companies);
      setAttStatus(RES_ATTSTS?.data?.attendancestatus);
      setAttModearr(RES_ATTMODE?.data?.allattmodestatus);
      setIsActive(false);
    } catch (err) {
      setIsActive(false);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [selectedUnit, selectedTeam]);



  //multiselect onchange
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Final Salary List.png");
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
    prodexp: true,
    totalnumberofdays: true,
    totalshift: true,
    clsl: true,
    weekoff: true,
    holiday: true,
    totalasbleave: true,
    totalpaidDays: true,
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

    targetpoints: true,
    achievedpoints: true,
    achieved: true,
    achievedproductionallowance: true,
    actualnetsalary: true,
    lopbasic: true,
    lophra: true,
    lopconveyance: true,
    lopmedicalallowance: true,
    lopproductionallowance: true,
    lopotherallowance: true,
    lopnetsalary: true,
    prodbasic: true,
    prodhra: true,
    prodconveyance: true,
    prodmedicalallowance: true,
    prodproductionallowance: true,
    prodotherallowance: true,
    attendancelop: true,
    calculatednetsalary: true,
    actualpenaltyamount: true,
    penaltyamount: true,
    lossdeduction: true,
    otherdeduction: true,
    finalbasic: true,
    finalhra: true,
    finalconveyance: true,
    finalmedicalallowance: true,
    finalproductionallowance: true,
    finalotherallowance: true,
    finalnetsalary: true,
    pfdays: true,
    ncpdays: true,
    pfdeduction: true,
    esideduction: true,
    finallopdays: true,
    paysliplop: true,
    finalleavededuction: true,
    professionaltax: true,
    totaldeductions: true,
    uan: true,
    ipname: true,
    noallowanceshift: true,
    shiftallowancepoint: true,
    shiftallowancetarget: true,
    nightshiftallowance: true,
    finalsalary: true,
    finalsalarypenalty: true,
    totalpointsvalue: true,
    era: true,
    actualera: true,
    pfemployerdeduction: true,
    esiemployerdeduction: true,
    ctc: true,
    revenueallowance: true,
    finalvalue: true,
    finalvaluetwo: true,
    finalvaluepenalty: true,
    shortage: true,
    shortageone: true,
    actualdeduction: true,
    minimumdeduction: true,
    finalvaluereview: true,
    finalvaluestatus: true,
    finalvaluepenaltystatus: true,
    salarytype: true,
    deductiontype: true,
    currentmonthavg: true,
    currentmonthattendance: true,
    paidstatus: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [items, setItems] = useState([]);

  //submit option for saving
  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (selectedCompany.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
        </>
      );
      handleClickOpenerr();

    }
    // else if (selectedBranch.length === 0) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } 
    else if (selectedUnit.legnth === 0 && selectedTeam.length === 0 && selectedDepartment.length === 0 && selectedDesignation.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team or Department or Designation"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedTeam.length === 0 && selectedDepartment.length === 0 && selectedDesignation.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Team or Department or Designation"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      setIsActive(true);
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

            let experienceinmonthCalcVal = item.doj ? (calculateMonthsBetweenDates(item.doj, findDate) < 0 ? 0 : calculateMonthsBetweenDates(item.doj, findDate)) : "";
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

            let CHECK_DEPARTMENT_ACCESS = departmentsList.find((d) => d.deptname === item.department);



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
            console.log(findPointsDetails, 'findPointsDetails')
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

            let paidpresentdayvalue = findTotalNoOfDays ? findTotalNoOfDays.paidpresentday : 0;
            let leaveCountvalue = findTotalNoOfDays ? findTotalNoOfDays.leaveCount : 0;
            let holidayCountvalue = findTotalNoOfDays ? findTotalNoOfDays.holidayCount : 0;
            let shiftvalue = findTotalNoOfDays ? findTotalNoOfDays.shift : 0;
            let lopcountvalue = findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0;


            let paiddayscalcvalfrommonthstatus =
              Number(paidpresentdayvalue)
                + Number(leaveCountvalue) + Number(holidayCountvalue) >
                Number(shiftvalue) ? Number(shiftvalue) - Number(lopcountvalue) : Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue);


            let paidpresentdayallCalcVal = shiftvalue;
            let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
            let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ?
              Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0;
            let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value)
              : paiddayscalcvalfrommonthstatus;



            //DAYS POINTS TARGETAND POINTS
            let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? TargetPointAmt[TargetPointAmt.length - 1].value : findPointsDetails ? findPointsDetails.target : 0;
            let AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? AcheivedPointAmt[AcheivedPointAmt.length - 1].value : findPointsDetails ? findPointsDetails.point.toFixed(2) : 0;
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

            //SHIFT ALLOWANCE ERA PENALY CALCULATION
            let allowancepointCalcVal = item.shiftallowancelog && item.shiftallowancelog.length > 0 && shiftAllowAmt && shiftAllowAmt.length > 0 ? shiftAllowAmt[shiftAllowAmt.length - 1].value : findPointsDetails ? findPointsDetails.allowancepoint.toFixed(2) : 0;
            let ERAAmountCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? findERAaountValue && findERAaountValue.amount : 0;

            let penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value).toFixed(2) : findPenaltyDetails ? findPenaltyDetails.amount.toFixed(2) : 0;
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


            let findPFpercentage = modevalue && modevalue.expmode === "Manual" ? modevalue.pfemployeepercentage : findSalDetails ? findSalDetails.pfemployeepercentage : 0;
            let findESIpercentage = modevalue && modevalue.expmode === "Manual" ? modevalue.esiemployeepercentage : findSalDetails ? findSalDetails.esiemployeepercentage : 0;
            let findEsiMAXSalary = findSalDetails ? Number(findSalDetails.esimaxsalary) : 0;
            let findEmployerPercentage = findSalDetails ? findSalDetails.pfpercentage : 0;
            let findEmployerESIPercentage = findSalDetails ? findSalDetails.esipercentage : 0;

            let pfvalues = item.assignpfesilog && item.assignpfesilog.length > 0 ? item.assignpfesilog[0] : {};

            //ATTENDANCE LOP CALCUCLATION
            let attendanceLopCalVal = totalNoOfDaysCalcVal > 0 && totalshiftCalcVal > 0 ? (((actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL) / totalshiftCalcVal) * totalasbleaveCalcVal) : 0;
            //ACHEIVED PRODUCTION ALLOWANCE
            let acheivedProductionAllowanceValCal = AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0 ? (AcheivedPointsCalcVal < targetPointCalcVaue ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01) : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)) : 0;
            //LOP BASIC
            let lopBasicValCal = totalNoOfDaysCalcVal === 0 ? 0 : (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? ((Number(actualBasicCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal) : ((Number(actualBasicCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal));
            // let lopBasicValCal = totalNoOfDaysCalcVal === 0 ? 0 : (Number(actualBasicCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal;

            let lopHRAValCal = totalNoOfDaysCalcVal === 0 ? 0 : (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? (Number(actualHraCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualHraCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal);

            let lopConveyValCal = totalNoOfDaysCalcVal === 0 ? 0 : (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? (Number(actualConveyanceCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualConveyanceCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal);

            let lopMedicalValCal = totalNoOfDaysCalcVal === 0 ? 0 : (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? (Number(actualMedicalAllowCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualMedicalAllowCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal);

            let lopOtherValCal = totalNoOfDaysCalcVal === 0 ? 0 : (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? (Number(actualOtherCalVAL) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualOtherCalVAL) / totalshiftCalcVal) * totalpaiddaycalVal);

            let lopProductionAllowance = AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0 ? (AcheivedPointsCalcVal < targetPointCalcVaue ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01) : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)) : 0;
            //  AcheivedPointsCalcVal > 0 ? (AcheivedPointsCalcVal < targetPointCalcVaue ? prodAllowanceCalcVal - (prodAllowancetwoCalcVal * (100 - (AcheivedPointsCalcVal * 100) / targetPointCalcVaue)) * 0.01 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

            //PROD BASIC
            let prodBasicValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopBasicValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopBasicValCal : lopBasicValCal + (lopBasicValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
            //PROD HRA
            let prodHraValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopHRAValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopHRAValCal : lopHRAValCal + (lopHRAValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
            //PROD CONVEYANCE
            let prodConveyanceValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopConveyValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopConveyValCal : lopConveyValCal + (lopConveyValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

            //PROD MEDICAL ALLOWANCE
            let prodMEDAllowanceValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopMedicalValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopMedicalValCal : lopMedicalValCal + (lopMedicalValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

            //PROD OTHER ALLOWANCE
            let prodOtherValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopOtherValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopOtherValCal : lopOtherValCal + (lopOtherValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

            //PROD PRODUCTION ALLOWANCE
            let prodPRODValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopProductionAllowance : acheivedProductionAllowanceValCal > 0 ? acheivedProductionAllowanceValCal : 0;

            let penaltyAmtCalculationVal = Number(experienceinmonthCalcVal) <= 0 ? 0 : Number(experienceinmonthCalcVal) >= 1 ? (Number(experienceinmonthCalcVal) >= 2 ? (Number(experienceinmonthCalcVal) >= 3 ? (Number(experienceinmonthCalcVal) >= 4 ? Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0 : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.25) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.5) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.75) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 1;

            let calcNetSalaryValCalc = lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal;

            let lossDed = 0;
            let OtherDed = 0;

            let finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodBasicValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
            let finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodHraValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
            let finalConveyValCalc = prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;

            // prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
            let finalMedicalAllowValcCalc = prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
            let finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodOtherValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
            let finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodPRODValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;

            let finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;

            //PFDAYS AND PFDEDUCTION
            let pfdatcal = 0;
            let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
            let IsExDate = pfvalues.pfenddate ? pfvalues.pfenddate : false;
            //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
            let pfmode = pfvalues.pffromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
            let PLOP = (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl);

            pfdatcal = pfmode === "S" || pfmode === "E" ? pfdatcal +
              (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl) + totalshiftCalcVal : totalshiftCalcVal + PLOP;
            let PfDate = daysp >= pfdatcal ? ((IsExDate === true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

            let pfDaysVal = pfvalues.pfdeduction === true ? PfDate : 0;
            let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;

            let PF_deduction = pfDaysVal > 0 ? ((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

            //  let PF_deduction  = ((pfDaysVal >= totalshiftCalcVal) ? (finalBasicValCalc * (Number(findPFpercentage)/100)) : ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (Number(findPFpercentage)/100)) : 0
            // FIND SHIFTALLOWACE
            let checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
            let CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";

            //ESI-DEDCUTIONss
            let Esiper = pfvalues.esideduction === true ? (Number(findEmployerESIPercentage) / 100) : 0;
            let ESI_EMPR_Perncetage = pfvalues.esideduction === true ? (Number(findESIpercentage) / 100) : 0;
            let ESI_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (pfDaysVal >= totalshiftCalcVal ? (Number(finalNetSalaryValcCalc) * Esiper) : (((Number(finalNetSalaryValcCalc) / Number(totalshiftCalcVal)) * pfDaysVal) * Esiper)) : 0;
            let ncpDaysVal =
              totalpaiddaycalVal > 0
                ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
                (Number(totalNoOfDaysCalcVal) - (Math.abs(Math.round(((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)))))
                : 0;

            let finalLOPDaysCalcVal =
              Math.round(Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0
                : (Number(totalshiftCalcVal) - ((Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)))) < Number(totalshiftCalcVal) ?
                Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) : Number(totalshiftCalcVal))

            // let findlopvaluecalc =    Number(totalasbleaveCalcVal) + 
            // (
            //     (Number(actualBasicCalcVal) === 0 ? 0 : ( Number(totalshiftCalcVal) - ((Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))   )    ) 
            //   )

            // let finalLOPDaysCalcVal = Number(findlopvaluecalc) <   Number(totalshiftCalcVal) ?  Number(findlopvaluecalc)  : Number(totalshiftCalcVal) ;


            let paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 :
              (totalshiftCalcVal) - (Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)) < 0 ? 0
                : ((totalshiftCalcVal) - (Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)))

            let finalLeaveDeductionValCalc =
              //  totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * ((totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue).toFixed(0) < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);
              totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

            let findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && d.fromamount <= finalNetSalaryValcCalc && d.toamount >= finalNetSalaryValcCalc);

            let profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

            let totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);
            // (((decimal.Parse(shiftAllowance) / tond)) * ShiftNight) * (ShiftAcived / 100);
            // tond-NOOFDAYS
            // ShiftAcived = AlloweTarget > 0 ? (AllowePoint * 100) / AlloweTarget : AllowePoint;
            let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : (findPointsDetails ? findPointsDetails.noallowancepoint : 0);

            let shiftallowancetarget = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? targetPointCalcVaue : 0;
            let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;

            let nightAllowancefinalcalculation = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? ((((1000 / totalNoOfDaysCalcVal) * totalpaiddaycalVal) * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100) : 0;


            let nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;




            let finalSalaryCalcVal = ((finalNetSalaryValcCalc - totalDeductionValCalc) + nightAllowanceCalcVal) > grossValue && AcheivedPercentCalcVal < 100 ? grossValue : (finalNetSalaryValcCalc - totalDeductionValCalc) + nightAllowanceCalcVal;
            let finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;

            // let totalPointsValueCalc = item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department == "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;
            let Mvalue = (findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0);
            let Dvalue = (findAcPointVal ? Number(findAcPointVal.dividevalue) : 0);
            let totalPointsValueCalc = ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue) ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : Number(0).toFixed(2);


            let acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

            let pfAmount1 = findEmployerPercentage;

            let PF_Emper_deduction = pfDaysVal > 0 ? ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (pfAmount1 / 100) : 0;
            // // let pfEmployerDeductionCalc = PF_Emper_deduction
            //ESI-DEDCUTION


            let ESI_EMPR_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? ((finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal) * ESI_EMPR_Perncetage : 0;

            let CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

            let finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

            let final_Value_PenaltyCalcval = finalValueCalcVal - (penaltyAmtCalculationVal + OtherDed);

            final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

            let ShortageCalVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? findShortage && Number(findShortage.amount) : 0;
            let Shortage1ValCalc = ShortageCalVal > 0 && totalNoOfDaysCalcVal > 0 ? (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (Number(ShortageCalVal) * Number(totalpaiddaycalVal)) / Number(totalNoOfDaysCalcVal) : 0) : 0;

            let acutalDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ?
              ((Number(totalPointsValueCalc) + Number(revenueAmountCalc)) - ((Number(CTC_Calcval) + Number(Shortage1ValCalc))) >= 0 ? 0 :
                (Number(totalPointsValueCalc) + Number(revenueAmountCalc)) - ((Number(CTC_Calcval) + Number(Shortage1ValCalc)))) : 0;

            let minimumDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? ((Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal)) >= 0 ? 0 : (Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal))) : 0;



            let LossDeduction = Number(minimumDeductionCalcVal) + ((Number(acutalDeductionCalcVal) - Number(OtherDed)) - Number(minimumDeductionCalcVal));

            lossDed = LossDeduction > 0 ? Number(LossDeduction) : (Number(-1) * Number(LossDeduction));

            // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            // RCALCULATION AFTER FIND LOSS DEDUCTION
            if (calcNetSalaryValCalc > 0) {
              finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodBasicValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
              finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodHraValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
              finalConveyValCalc = prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;

              // prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
              finalMedicalAllowValcCalc = prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
              finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodOtherValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
              finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodPRODValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;

              finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;
            }

            finalBasicValCalc = finalBasicValCalc > 0 ? finalBasicValCalc : 0;
            finalHraValCalc = finalHraValCalc > 0 ? finalHraValCalc : 0;
            finalConveyValCalc = finalConveyValCalc > 0 ? finalConveyValCalc : 0;

            // prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) > 0 ? prodConveyanceValCalc * ((((calcNetSalaryValCalc - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / calcNetSalaryValCalc) * 0.01) : 0;
            finalMedicalAllowValcCalc = finalMedicalAllowValcCalc > 0 ? finalMedicalAllowValcCalc : 0;
            finalOtherValcCalc = finalOtherValcCalc > 0 ? finalOtherValcCalc : 0;
            finalProductionValcCalc = finalProductionValcCalc > 0 ? finalProductionValcCalc : 0;

            finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;
            //PFDAYS AND PFDEDUCTION
            //  pfdatcal = 0;
            //  daysp = totalshiftCalcVal - totalasbleaveCalcVal;
            //  IsExDate = item.isenddate ? item.isenddate : false;
            // //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
            //  pfmode = item.pfesifromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
            //  PLOP = (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl);

            // pfdatcal = pfmode == "S" || pfmode == "E" ? pfdatcal + (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl) + totalshiftCalcVal : totalshiftCalcVal + PLOP;
            //  PfDate = daysp >= pfdatcal ? ((IsExDate == true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

            //  pfDaysVal = item.pfdeduction === true ? PfDate : 0;
            //  pfAmount = item.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;


            PF_deduction = (pfDaysVal > 0 && totalshiftCalcVal > 0) ? (((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal)) * Number(pfAmount)).toFixed(2) : 0;

            // PF_deduction  = ((pfDaysVal >= totalshiftCalcVal) ? (finalBasicValCalc * (Number(findPFpercentage)/100)) : ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (Number(findPFpercentage)/100)) : 0
            // FIND SHIFTALLOWACE
            //  checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
            //  CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";
            //ESI-DEDCUTIONss
            //  Esiper = item.esideduction === true ? Number(findESIpercentage) / 100 : 0;

            ESI_deduction = grossValue >= findEsiMAXSalary ? 0 : (pfDaysVal > 0 && totalshiftCalcVal > 0) ? (pfDaysVal >= totalshiftCalcVal ? (Number(finalNetSalaryValcCalc) * Esiper) : (((Number(finalNetSalaryValcCalc) / Number(totalshiftCalcVal)) * pfDaysVal) * Esiper)) : 0;


            let ncpvaluecalc = (Number(totalNoOfDaysCalcVal) - (Math.round(((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal))))
            let ncpvaluecalc1 = (Number(totalNoOfDaysCalcVal) - (Math.round(((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal))))

            ncpDaysVal =
              totalpaiddaycalVal > 0
                ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
                // totalNoOfDaysCalcVal - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal))
                (pfvalues.pfdeduction === true ? (ncpvaluecalc) : ncpvaluecalc1)

                : 0;

            finalLOPDaysCalcVal =
              Math.round(Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0
                : (Number(totalshiftCalcVal) - ((Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)))) < Number(totalshiftCalcVal) ?
                Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) : Number(totalshiftCalcVal))

            paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 :
              (totalshiftCalcVal) - (Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)) < 0 ? 0
                : ((totalshiftCalcVal) - (Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)))

            // finalLOPDaysCalcVal = totalasbleaveCalcVal + (actualBasicCalcVal === 0 ? 0 : (totalshiftCalcVal - ((totalshiftCalcVal * finalBasicValCalc) / actualBasicCalcVal)) < totalshiftCalcVal) ? Math.round(totalasbleaveCalcVal + (actualBasicCalcVal === 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalBasicValCalc) / actualBasicCalcVal)) : totalshiftCalcVal.toFixed(0);
            // finalLOPDaysCalcVal = (Math.Round((totalshiftCalcVal) - ((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue), 0)) < 0 ?
            // 0 :
            // (Math.Round((totalshiftCalcVal - ((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)), 0));
            //     finalLOPDaysCalcVal = (Math.round((totalshiftCalcVal) - ((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)) < 0 ?
            // 0 :
            // (Math.round((totalshiftCalcVal - ((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)))));

            finalLeaveDeductionValCalc =
              //  ( totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0) ? 0 :
              //   (grossValue / totalshiftCalcVal) * ((totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue).toFixed(0) < 0 ?
              //    0 :

              // totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

              totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * ((totalshiftCalcVal - ((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)) < 0 ? 0 :
                (totalshiftCalcVal - ((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)));

            findprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && d.fromamount <= finalNetSalaryValcCalc && d.toamount >= finalNetSalaryValcCalc);

            profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

            totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);
            // (((decimal.Parse(shiftAllowance) / tond)) * ShiftNight) * (ShiftAcived / 100);
            // tond-NOOFDAYS
            // ShiftAcived = AlloweTarget > 0 ? (AllowePoint * 100) / AlloweTarget : AllowePoint;

            shiftallowancetarget = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? targetPointCalcVaue : 0;
            shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;

            nightAllowancefinalcalculation = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? ((((1000 / totalNoOfDaysCalcVal) * totalpaiddaycalVal) * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100) : 0;


            nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

            finalSalaryCalcVal = (((finalNetSalaryValcCalc - totalDeductionValCalc) + nightAllowanceCalcVal) > grossValue) && (Number(AcheivedPercentCalcVal) < 100) ? grossValue : ((Number(finalNetSalaryValcCalc) - Number(totalDeductionValCalc)) + Number(nightAllowanceCalcVal));
            finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;

            // totalPointsValueCalc = item.department === "PROD_GrubHub" ? (AcheivedPointsCalcVal / 1) * 360 : item.department == "TRAINEE" ? (AcheivedPointsCalcVal / 8.5) * 70 : (AcheivedPointsCalcVal / 8.5) * 60;
            totalPointsValueCalc = ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue) ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : Number(0).toFixed(2);
            //  acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

            // pfAmount1 = findEmployerPercentage;

            PF_Emper_deduction = pfDaysVal > 0 ? (((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (pfAmount1 / 100)) : 0;
            // // let pfEmployerDeductionCalc = PF_Emper_deduction
            //ESI-DEDCUTION
            // ESI_EMPR_Perncetage = item.esideduction === true ? (Number(findEmployerPercentage) / 100) : 0;

            ESI_EMPR_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? ((Number(finalNetSalaryValcCalc) / Number(totalshiftCalcVal)) * pfDaysVal) * ESI_EMPR_Perncetage : 0;

            CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

            finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? (Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc)) : 0;

            final_Value_PenaltyCalcval = finalValueCalcVal - (penaltyAmtCalculationVal + OtherDed);

            final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

            //  ShortageCalVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? findShortage && Number(findShortage.amount) : 0;
            //  Shortage1ValCalc = ShortageCalVal ? (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (Number(ShortageCalVal) * Number(totalpaiddaycalVal)) / Number(totalNoOfDaysCalcVal) : 0) : 0;

            //          acutalDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ?
            //          (Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc)) >= 0 ? 0
            //          : Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc))) : 0;

            // console.log( Number(totalPointsValueCalc) + Number(revenueAmountCalc) - (Number(CTC_Calcval) + Number(Shortage1ValCalc)) ,  (Number(totalPointsValueCalc) + Number(revenueAmountCalc)) ,  (Number(CTC_Calcval) + Number(Shortage1ValCalc)  ))

            // minimumDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (Shortage1ValCalc + acutalDeductionCalcVal >= 0 ? 0 : Shortage1ValCalc + acutalDeductionCalcVal) : 0;

            let finalValueReviewCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval < -acutalERAValCalc ? "REVENUE LOSS" : "OK") : "";

            let finalValueStatus = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (finalValueCalcVal > -10000 ? (finalValueCalcVal >= -2000 ? (finalValueCalcVal >= 0 ? (finalValueCalcVal >= 2000 ? (finalValueCalcVal >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";

            let revenuePenaltyStatus = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval > -10000 ? (final_Value_PenaltyCalcval >= -2000 ? (final_Value_PenaltyCalcval >= 0 ? (final_Value_PenaltyCalcval >= 2000 ? (final_Value_PenaltyCalcval >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";

            let currentMonthAttendanceVal = findTotalNoOfDaysNxtMonth ? findTotalNoOfDaysNxtMonth.lopcount : 0;
            let currentMonthAvgVal = findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0





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

            let getpaidStatusVal = paidStatusFix.find(d =>
              (d.month).toLowerCase() === selectedMonth.toLowerCase() && d.department.includes(item.department) && d.year == selectedYear
              && Number(totalasbleaveCalcVal) >= Number(d.fromvalue) && Number(totalasbleaveCalcVal) <= Number(d.tovalue) && Number(AcheivedPercentCalcVal) >= Number(d.frompoint) && Number(AcheivedPercentCalcVal) <= Number(d.topoint)

              && (d.currentabsentmodes === "Less than or Equal" ? currMonAttFinalcalVal <= Number(d.currentabsentvalue) : d.currentabsentmodes === "Less than" ? currMonAttFinalcalVal < Number(d.currentabsentvalue) : d.currentabsentmodes === "Greater than" ? currMonAttFinalcalVal > Number(d.currentabsentvalue) : currMonAttFinalcalVal >= Number(d.currentabsentvalue))
              && (d.currentachievedmodes === "Less than or Equal" ? currMonAvgFinalcalVal <= Number(d.currentachievedvalue) : d.currentachievedmodes === "Less than" ? currMonAvgFinalcalVal < Number(d.currentachievedvalue) : d.currentachievedmodes === "Greater than" ? currMonAvgFinalcalVal > Number(d.currentachievedvalue) : currMonAvgFinalcalVal >= Number(d.currentachievedvalue))

            )
            let paidStatusVal = getpaidStatusVal ? getpaidStatusVal.paidstatus : "";
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

              // prodexp: item.doj ? (differenceInMonthsexp > 0 ? differenceInMonthsexp : 0) : "",

              // processcode: item.doj ? getprocessCode : "",
              // salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
              // processcodeexp: item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",

              processcode: item.doj && modevalue && modevalue.expmode == "Manual" ? modevalue.salarycode : item.doj ? getprocessCode : "",
              salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
              processcodeexp: processcodeexpvalue,
              // item.doj && modevalue && modevalue.expmode == "Manual" ?( modevalue.salarycode + (differenceInMonthsexp <= 9 ? "0"+differenceInMonthsexp : differenceInMonthsexp )):  (item.doj ? getprocessCode +   differenceInMonthsexp : ""),
              // processcodetar: item.doj ? getprocessCode + (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",

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
              revenueallow: revenueAmountCalc,
              //SHORTAGE MASTER PAGE
              shortage: ShortageCalVal,

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
              actualnetsalary: (((actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL) - attendanceLopCalVal) + Number(acheivedProductionAllowanceValCal)).toFixed(2),
              lopbasic: Number(lopBasicValCal).toFixed(2),
              lophra: Number(lopHRAValCal).toFixed(2),
              lopconveyance: Number(lopConveyValCal).toFixed(2),
              lopmedicalallowance: Number(lopMedicalValCal).toFixed(2),
              lopotherallowance: Number(lopOtherValCal).toFixed(2),
              lopproductionallowance: lopProductionAllowance.toFixed(2),
              lopnetsalary: Number(lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal).toFixed(2),
              prodbasic: Number(prodBasicValCalc).toFixed(2),
              prodhra: Number(prodHraValCalc).toFixed(2),
              prodconveyance: Number(prodConveyanceValCalc).toFixed(2),
              prodmedicalallowance: Number(prodMEDAllowanceValCalc).toFixed(2),
              prodotherallowance: Number(prodOtherValCalc).toFixed(2),
              prodproductionallowance: Number(prodPRODValCalc).toFixed(2),
              calculatednetsalary: Number(calcNetSalaryValCalc).toFixed(2),
              lossdeduction: Number(lossDed).toFixed(2),
              otherdeduction: Number(OtherDed).toFixed(2),
              finalbasic: Number(finalBasicValCalc).toFixed(2),
              finalhra: Number(finalHraValCalc).toFixed(2),
              finalconveyance: Number(finalConveyValCalc).toFixed(2),
              finalmedicalallowance: Number(finalMedicalAllowValcCalc).toFixed(2),
              finalproductionallowance: Number(finalProductionValcCalc).toFixed(2),
              finalotherallowance: Number(finalOtherValcCalc).toFixed(2),
              finalnetsalary: Number(finalNetSalaryValcCalc).toFixed(2),
              pfdays: pfDaysVal,
              ncpdays: ncpDaysVal,
              pfdeduction: Number(PF_deduction).toFixed(2),
              esideduction: Number(ESI_deduction).toFixed(2),
              finallopdays: finalLOPDaysCalcVal,
              paysliplop: Number(paySlipLopCalval).toFixed(0),
              finalleavededuction: Number(finalLeaveDeductionValCalc).toFixed(2),
              professionaltax: profTaxCalcVal,
              totaldeductions: Number(totalDeductionValCalc).toFixed(2),
              shiftallowancetarget: shiftallowancetargetfinal,
              nightshiftallowance: Number(Number(nightAllowanceCalcVal).toFixed(2)),
              finalsalary: Number(finalSalaryCalcVal).toFixed(2),
              finalsalarypenalty: Number(finalSalary_Penalty).toFixed(2),
              totalpointsvalue: Number(totalPointsValueCalc).toFixed(2),
              era: Number(acutalERAValCalc).toFixed(2),
              pfemployerdeduction: Number(PF_Emper_deduction).toFixed(2),
              esiemployerdeduction: Number(ESI_EMPR_deduction).toFixed(2),
              ctc: Number(CTC_Calcval).toFixed(2),
              // finalvaluetwo:Number(finalValueCalcVal).toFixed(2),
              finalvalue: Number(finalValueCalcVal).toFixed(2),
              finalvaluepenalty: Number(final_Value_PenaltyCalcval).toFixed(2),
              shortageone: Number(Shortage1ValCalc).toFixed(2),
              actualdeduction: Number(acutalDeductionCalcVal).toFixed(2),
              minimumdeduction: Number(minimumDeductionCalcVal).toFixed(2),
              finalvaluereview: finalValueReviewCalc,
              finalvaluestatus: finalValueStatus,
              finalvaluepenaltystatus: revenuePenaltyStatus,

              currentmonthavg: Number(currMonAvgFinalcalVal),
              currentmonthattendance: currMonAttFinalcalVal,
              paidstatus: paidStatusVal,
              // salarytype: salaryTypeVal,
              // deductiontype: deductionTypeVal

            };



          }


          async function sendBatchRequestItems(batch, data) {


            try {
              const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItem(item, index, data));
              // const results = await Promise.all(itemsWithSerialNumber);
              return await Promise.all(itemsWithSerialNumber);

            } catch (err) {
              console.error('Error processing batch request items:', err);
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
              console.log(err, 'err')
            }
          }

          getAllResultsItems().then(result => {
            // console.log(result);
            try {
              setItems(result.allResultsItems)

              setIsActive(false);
              // setBankdetail(false);
            } catch (err) {

              console.log(err, 'err')
            }
          })


        }).catch(error => {

          console.error('Error in getting all results:', error);
        });

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
        aadharname: item.legalname,
        processcode: item.processcodeexp,
        doj: item.doj,
        experienceinmonth: item.experience,
        prodexp: item.prodexp,
        totalnumberofdays: item.totalnumberofdays,
        totalshift: item.totalshift,
        clsl: item.clsl,
        weekoff: item.weekoff,
        holiday: item.holiday,
        totalasbleave: item.totalasbleave,
        totalpaidDays: item.totalpaidDays,

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

        targetpoints: item.monthPoint,
        achievedpoints: item.acheivedpoints ? Number(item.acheivedpoints) : 0,
        achieved: item.acheivedpercent ? Number(item.acheivedpercent) : 0,
        achievedproductionallowance: item.acheivedproductionallowance ? Number(item.acheivedproductionallowance) : 0,
        actualnetsalary: item.actualnetsalary ? Number(item.actualnetsalary) : 0,
        lopbasic: item.lopbasic ? Number(item.lopbasic) : 0,
        lophra: item.lophra ? Number(item.lophra) : 0,
        lopconveyance: item.lopconveyance ? Number(item.lopconveyance) : 0,
        lopmedicalallowance: item.lopmedicalallowance ? Number(item.lopmedicalallowance) : 0,
        lopproductionallowance: item.lopproductionallowance ? Number(item.lopproductionallowance) : 0,
        lopotherallowance: item.lopotherallowance ? Number(item.lopotherallowance) : 0,
        lopnetsalary: item.lopnetsalary ? Number(item.lopnetsalary) : 0,
        prodbasic: item.prodbasic ? Number(item.prodbasic) : 0,
        prodhra: item.prodhra ? Number(item.prodhra) : 0,
        prodconveyance: item.prodconveyance ? Number(item.prodconveyance) : 0,
        prodmedicalallowance: item.prodmedicalallowance ? Number(item.prodmedicalallowance) : 0,
        prodproductionallowance: item.prodproductionallowance ? Number(item.prodproductionallowance) : 0,
        prodotherallowance: item.prodotherallowance ? Number(item.prodotherallowance) : 0,
        attendancelop: item.attendancelop ? Number(item.attendancelop) : 0,
        calculatednetsalary: item.calculatednetsalary ? Number(item.calculatednetsalary) : 0,
        actualpenaltyamount: item.penalty ? Number(item.penalty) : 0,
        penaltyamount: item.penaltyamount ? Number(item.penaltyamount) : 0,
        lossdeduction: item.lossdeduction ? Number(item.lossdeduction) : 0,
        otherdeduction: item.otherdeduction ? Number(item.otherdeduction) : 0,
        finalbasic: item.finalbasic ? Number(item.finalbasic) : 0,
        finalhra: item.finalhra ? Number(item.finalhra) : 0,
        finalconveyance: item.finalconveyance ? Number(item.finalconveyance) : 0,
        finalmedicalallowance: item.finalmedicalallowance ? Number(item.finalmedicalallowance) : 0,
        finalproductionallowance: item.finalproductionallowance ? Number(item.finalproductionallowance) : 0,
        finalotherallowance: item.finalotherallowance ? Number(item.finalotherallowance) : 0,
        finalnetsalary: item.finalnetsalary ? Number(item.finalnetsalary) : 0,
        pfdays: item.pfdays ? Number(item.pfdays) : 0,
        ncpdays: item.ncpdays ? Number(item.ncpdays) : 0,
        pfdeduction: item.pfdeduction ? Number(item.pfdeduction) : 0,
        esideduction: item.esideduction ? Number(item.esideduction) : 0,
        finallopdays: item.finallopdays ? Number(item.finallopdays) : 0,
        paysliplop: item.paysliplop ? Number(item.paysliplop) : 0,
        finalleavededuction: item.finalleavededuction ? Number(item.finalleavededuction) : 0,
        professionaltax: item.professionaltax ? Number(item.professionaltax) : 0,
        totaldeductions: item.totaldeductions ? Number(item.totaldeductions) : 0,
        uan: item.uan,
        ipname: item.ipname,
        noallowanceshift: item.noallowancepoint ? Number(item.noallowancepoint) : 0,
        shiftallowancepoint: item.allowancepoint ? Number(item.allowancepoint) : 0,
        shiftallowancetarget: item.shiftallowancetarget ? Number(item.shiftallowancetarget) : 0,
        nightshiftallowance: item.nightshiftallowance ? Number(item.nightshiftallowance) : 0,
        finalsalary: item.finalsalary ? Number(item.finalsalary) : 0,
        finalsalarypenalty: item.finalsalarypenalty ? Number(item.finalsalarypenalty) : 0,
        totalpointsvalue: item.totalpointsvalue,
        era: item.eramount ? Number(item.eramount) : 0,
        actualera: item.era ? Number(item.era) : 0,
        pfemployerdeduction: item.pfemployerdeduction ? Number(item.pfemployerdeduction) : 0,
        esiemployerdeduction: item.esiemployerdeduction ? Number(item.esiemployerdeduction) : 0,
        ctc: item.ctc ? Number(item.ctc) : 0,
        revenueallowance: item.revenueallow ? Number(item.revenueallow) : 0,
        finalvalue: item.finalvalue ? Number(item.finalvalue) : 0,
        finalvaluetwo: item.finalvaluetwo ? Number(item.finalvaluetwo) : 0,
        finalvaluepenalty: item.finalvaluepenalty ? Number(item.finalvaluepenalty) : 0,
        shortage: item.shortage ? Number(item.shortage) : 0,
        shortageone: item.shortageone ? Number(item.shortageone) : 0,
        actualdeduction: item.actualdeduction ? Number(item.actualdeduction) : 0,
        minimumdeduction: item.minimumdeduction ? Number(item.minimumdeduction) : 0,
        finalvaluereview: item.finalvaluereview,
        finalvaluestatus: item.finalvaluestatus,
        finalvaluepenaltystatus: item.finalvaluepenaltystatus,

        currentmonthavg: item.currentmonthavg ? item.currentmonthavg : 0,
        currentmonthattendance: item.currentmonthattendance ? item.currentmonthattendance : 0,
        paidstatus: item.paidstatus,

        salarytype: item.salarytype,
        deductiontype: item.deductiontype,
      };
    });
    setItemsOverall(rowDataTableItems)
  }

  useEffect(() => {
    addOverallData()
  }, [items])


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

  const [fileFormat, setFormat] = useState('')


  let exportColumnNames = [

    "Department",
    "Company",
    "Branch",
    "Unit",
    "Team",
    "Designation",
    "Employee Name",
    "Aadhar Name",
    "Process Code",
    "DOJ",
    "Experience In Month",
    "Prod Exp",
    "totalnumberofdays",
    "Total Shift",
    "CLSL",
    "WeekOff",
    "Holiday",
    "Total Absent/Leave",
    "Total Paid Days",
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
    "LOP Basic",
    "LOP HRA",
    "LOP Conveyance",
    "LOP Medical Allowance",
    "LOP Production Allowance",
    "LOP Other Allowance",
    "LOP Net Salary",
    "PROD Basic",
    "PROD HRA",
    "PROD Conveyance",
    "PROD Medical Allowance",
    "PROD Production Allowance",
    "PROD Other Allowance",
    "Attendance LOP",
    "Calculated Net Salary",
    "Actual Penalty Amount",
    "Penalty Amount",
    "Loss Deduction",
    "Other Deduction",
    "Final Basic",
    "Final HRA",
    "Final Conveyance",
    "Final Medical Allowance",
    "Final Production Allowance",
    "Final Other Allowance",
    "Final Net Salary",
    "PF Days",
    "NCP Days",
    "PF Deduction",
    "ESI Deduction",
    "Final LOP",
    "Final LOP Days",
    "finalleavededuction",
    "Professional Tax",
    "Total Deductions",
    "UAN",
    "IP Name",
    "No. Allowance Shift",
    "Shift Allowance Point",
    "Shift Allowance Target",
    "Night Shift Allowance",
    "Final Salary",
    "Final Salary-Penalty",
    "Total Points Value",
    "ERA",
    "Actual ERA",
    "PF Employer Deduction",
    "ESI Employer Deduction",
    "CTC",
    "Revenue Allowance",
    "Final Value",
    "Final Value-Penalty",
    "Shortage",
    "Shortage 1",
    "Actual Deduction",
    "Minimum Deduction",
    "Final Value Review",
    "Final Value Status",
    "Final Value Penalty Status",
    `Current (${monthsArr[Number(selectedMonthExcel) >= 12 ? 0 : Number(selectedMonthExcel)]}) Month Avg`,
    `Current (${monthsArr[Number(selectedMonthExcel) >= 12 ? 0 : Number(selectedMonthExcel)]}) Month Attendance`,
    "Paid Status",
  ]
  let exportRowValues = [
    "department",
    "company",
    "branch",
    "unit",
    "team",
    "designation",
    "employeename",
    "aadharname",
    "processcode",
    "doj",
    "experienceinmonth",
    "prodexp",
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
    "lopbasic",
    "lophra",
    "lopconveyance",
    "lopmedicalallowance",
    "lopproductionallowance",
    "lopotherallowance",
    "lopnetsalary",
    "prodbasic",
    "prodhra",
    "prodconveyance",
    "prodmedicalallowance",
    "prodproductionallowance",
    "prodotherallowance",
    "attendancelop",
    "calculatednetsalary",
    "actualpenaltyamount",
    "penaltyamount",
    "lossdeduction",
    "otherdeduction",
    "finalbasic",
    "finalhra",
    "finalconveyance",
    "finalmedicalallowance",
    "finalproductionallowance",
    "finalotherallowance",
    "finalnetsalary",
    "pfdays",
    "ncpdays",
    "pfdeduction",
    "esideduction",
    "finallopdays",
    "paysliplop",
    "finalleavededuction",
    "professionaltax",
    "totaldeductions",
    "uan",
    "ipname",
    "noallowanceshift",
    "shiftallowancepoint",
    "shiftallowancetarget",
    "nightshiftallowance",
    "finalsalary",
    "finalsalarypenalty",
    "totalpointsvalue",
    "era",
    "actualera",
    "pfemployerdeduction",
    "esiemployerdeduction",
    "ctc",
    "revenueallowance",
    "finalvalue",
    "finalvaluepenalty",
    "shortage",
    "shortageone",
    "actualdeduction",
    "minimumdeduction",
    "finalvaluereview",
    "finalvaluestatus",
    "finalvaluepenaltystatus",
    "currentmonthavg",
    "currentmonthattendance",
    "paidstatus",
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

  const columns = [
    // Serial number column
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Department", dataKey: "department" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Team", dataKey: "team" },
    { title: "Designation", dataKey: "designation" },
    { title: "Employee Name", dataKey: "employeename" },
    { title: "Aadhar Name", dataKey: "aadharname" },
    { title: "Process Code", dataKey: "processcode" },
    { title: "DOJ", dataKey: "doj" },
    { title: "Experience In Month", dataKey: "experienceinmonth" },
    { title: "Prod Exp", dataKey: "prodexp" },
    { title: "totalnumberofdays", dataKey: "totalnumberofdays" },
    { title: "Total Shift", dataKey: "totalshift" },
    { title: "CLSL", dataKey: "clsl" },
    { title: "WeekOff", dataKey: "weekoff" },
    { title: "Holiday", dataKey: "holiday" },
    { title: "Total Absent/Leave", dataKey: "totalasbleave" },
    { title: "Total Paid Days", dataKey: "totalpaidDays" },

    { title: "Gross", dataKey: "oldgross" },
    { title: "Basic", dataKey: "oldbasic" },
    { title: "HRA", dataKey: "oldhra" },
    { title: "Conveyance", dataKey: "oldconveyance" },
    { title: "Medical Allowance", dataKey: "oldmedicalallowance" },
    { title: "Production Allowance", dataKey: "oldproductionallowance" },
    { title: "Production Allowance 2", dataKey: "oldproductionallowancetwo" },
    { title: "Other Allowance", dataKey: "oldotherallowance" },

    { title: "New Gross", dataKey: "newgross" },
    { title: "Actual Basic", dataKey: "actualbasic" },
    { title: "Actual HRA", dataKey: "actualhra" },
    { title: "Actual Conveyance", dataKey: "actualconveyance" },
    { title: "Actual Medical Allowance", dataKey: "actualmedicalallowance" },
    { title: "Actual Production Allowance", dataKey: "actualproductionallowance" },
    { title: "Actual Production Allowance 2", dataKey: "actualproductionallowancetwo" },
    { title: "Actual Other Allowance", dataKey: "actualotherallowance" },

    { title: "Target Points", dataKey: "targetpoints" },
    { title: "Achieved Points", dataKey: "achievedpoints" },
    { title: "Achieved %", dataKey: "achieved" },
    { title: "Achieved Production Allowance", dataKey: "achievedproductionallowance" },
    { title: "Actual Net Salary", dataKey: "actualnetsalary" },
    { title: "LOP Basic", dataKey: "lopbasic" },
    { title: "LOP HRA", dataKey: "lophra" },
    { title: "LOP Conveyance", dataKey: "lopconveyance" },
    { title: "LOP Medical Allowance", dataKey: "lopmedicalallowance" },
    { title: "LOP Production Allowance", dataKey: "lopproductionallowance" },
    { title: "LOP Other Allowance", dataKey: "lopotherallowance" },
    { title: "LOP Net Salary", dataKey: "lopnetsalary" },
    { title: "PROD Basic", dataKey: "prodbasic" },
    { title: "PROD HRA", dataKey: "prodhra" },
    { title: "PROD Conveyance", dataKey: "prodconveyance" },
    { title: "PROD Medical Allowance", dataKey: "prodmedicalallowance" },
    { title: "PROD Production Allowance", dataKey: "prodproductionallowance" },
    { title: "PROD Other Allowance", dataKey: "prodotherallowance" },
    { title: "Attendance LOP", dataKey: "attendancelop" },
    { title: "Calculated Net Salary", dataKey: "calculatednetsalary" },
    { title: "Actual Penalty Amount", dataKey: "actualpenaltyamount" },
    { title: "Penalty Amount", dataKey: "penaltyamount" },
    { title: "Loss Deduction", dataKey: "lossdeduction" },
    { title: "Other Deduction", dataKey: "otherdeduction" },
    { title: "Final Basic", dataKey: "finalbasic" },
    { title: "Final HRA", dataKey: "finalhra" },
    { title: "Final Conveyance", dataKey: "finalconveyance" },
    { title: "Final Medical Allowance", dataKey: "finalmedicalallowance" },
    { title: "Final Production Allowance", dataKey: "finalproductionallowance" },
    { title: "Final Other Allowance", dataKey: "finalotherallowance" },
    { title: "Final Net Salary", dataKey: "finalnetsalary" },
    { title: "PF Days", dataKey: "pfdays" },
    { title: "NCP Days", dataKey: "ncpdays" },
    { title: "PF Deduction", dataKey: "pfdeduction" },
    { title: "ESI Deduction", dataKey: "esideduction" },
    { title: "Final LOP", dataKey: "finallopdays" },
    { title: "Final LOP Days", dataKey: "paysliplop" },
    { title: "finalleavededuction", dataKey: "finalleavededuction" },
    { title: "Professional Tax", dataKey: "professionaltax" },
    { title: "Total Deductions", dataKey: "totaldeductions" },
    { title: "UAN", dataKey: "uan" },
    { title: "IP Name", dataKey: "ipname" },
    { title: "No. Allowance Shift", dataKey: "noallowanceshift" },
    { title: "Shift Allowance Point", dataKey: "shiftallowancepoint" },
    { title: "Shift Allowance Target", dataKey: "shiftallowancetarget" },
    { title: "Night Shift Allowance", dataKey: "nightshiftallowance" },
    { title: "Final Salary", dataKey: "finalsalary" },
    { title: "Final Salary-Penalty", dataKey: "finalsalarypenalty" },
    { title: "Total Points Value", dataKey: "totalpointsvalue" },
    { title: "ERA", dataKey: "era" },
    { title: "Actual ERA", dataKey: "actualera" },
    { title: "PF Employer Deduction", dataKey: "pfemployerdeduction" },
    { title: "ESI Employer Deduction", dataKey: "esiemployerdeduction" },
    { title: "CTC", dataKey: "ctc" },
    { title: "Revenue Allowance", dataKey: "revenueallowance" },
    { title: "Final Value", dataKey: "finalvalue" },
    { title: "Final Value-Penalty", dataKey: "finalvaluepenalty" },
    { title: "Shortage", dataKey: "shortage" },
    { title: "Shortage 1", dataKey: "shortageone" },
    { title: "Actual Deduction", dataKey: "actualdeduction" },
    { title: "Minimum Deduction", dataKey: "minimumdeduction" },
    { title: "Final Value Review", dataKey: "finalvaluereview" },
    { title: "Final Value Status", dataKey: "finalvaluestatus" },
    { title: "Final Value Penalty Status", dataKey: "finalvaluepenaltystatus" },
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

    doc.save("Final Salary List.pdf");
  };

  // Excel
  const fileName = `Final Salary List (${selectedMonth}-${selectedYear})`;

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Final Salary List",
    pageStyle: "print",
  });

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  //get all Sub vendormasters.
  const fetchAttedanceStatus = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttStatus(res_vendor?.data?.attendancestatus);
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

  //get all Attendance Status name.
  const fetchAttMode = async () => {
    try {
      let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAttModearr(res_freq?.data?.allattmodestatus);
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

  useEffect(() => {
    fetchAttedanceStatus();
    fetchAttMode();
  }, []);

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



  // useEffect(() => {
  //   addSerialNumber();
  // }, [ ]);

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
  const filteredDatas = itemsOverall?.filter((item) => {
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
      width: 50,

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
    { field: "department", headerName: "Department", flex: 0, width: 140, hide: !columnVisibility.department, headerClassName: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, width: 70, hide: !columnVisibility.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 110, hide: !columnVisibility.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 80, hide: !columnVisibility.unit, headerClassName: "bold-header" },
    { field: "team", headerName: "Team", flex: 0, width: 80, hide: !columnVisibility.team, headerClassName: "bold-header" },
    { field: "designation", headerName: "Designation", flex: 0, width: 150, hide: !columnVisibility.designation, headerClassName: "bold-header" },
    { field: "employeename", headerName: "Employee Name", flex: 0, width: 190, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
    { field: "aadharname", headerName: "Aadhar Name", flex: 0, width: 190, hide: !columnVisibility.aadharname, headerClassName: "bold-header" },
    { field: "processcode", headerName: "Process Code", flex: 0, width: 120, hide: !columnVisibility.processcode, headerClassName: "bold-header" },
    { field: "doj", headerName: "DOJ", flex: 0, width: 100, hide: !columnVisibility.doj, headerClassName: "bold-header" },
    { field: "experienceinmonth", headerName: "Experience In Month", flex: 0, width: 100, hide: !columnVisibility.experienceinmonth, headerClassName: "bold-header" },
    { field: "prodexp", headerName: "Prod Exp", flex: 0, width: 100, hide: !columnVisibility.prodexp, headerClassName: "bold-header" },
    { field: "totalnumberofdays", headerName: "Total No.of Days", flex: 0, width: 80, hide: !columnVisibility.totalnumberofdays, headerClassName: "bold-header" },
    { field: "totalshift", headerName: "Total Shift", flex: 0, width: 80, hide: !columnVisibility.totalshift, headerClassName: "bold-header" },
    { field: "clsl", headerName: "C.L. / S.L.", flex: 0, width: 80, hide: !columnVisibility.clsl, headerClassName: "bold-header" },
    { field: "weekoff", headerName: "Week Off", flex: 0, width: 80, hide: !columnVisibility.weekoff, headerClassName: "bold-header" },
    { field: "holiday", headerName: "Holiday", flex: 0, width: 80, hide: !columnVisibility.holiday, headerClassName: "bold-header" },
    { field: "totalasbleave", headerName: "Total Absent/Leave Shift", flex: 0, width: 80, hide: !columnVisibility.totalasbleave, headerClassName: "bold-header" },
    { field: "totalpaidDays", headerName: "Total Paid Shift", flex: 0, width: 80, hide: !columnVisibility.totalpaidDays, headerClassName: "bold-header" },

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
    { field: "lopbasic", headerName: "LOP Basic", flex: 0, width: 100, hide: !columnVisibility.lopbasic, headerClassName: "bold-header" },
    { field: "lophra", headerName: "LOP HRA", flex: 0, width: 100, hide: !columnVisibility.lophra, headerClassName: "bold-header" },
    { field: "lopconveyance", headerName: "LOP Conveyance", flex: 0, width: 100, hide: !columnVisibility.lopconveyance, headerClassName: "bold-header" },
    { field: "lopmedicalallowance", headerName: "LOP Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.lopmedicalallowance, headerClassName: "bold-header" },
    { field: "lopproductionallowance", headerName: "LOP Production Allowance", flex: 0, width: 100, hide: !columnVisibility.lopproductionallowance, headerClassName: "bold-header" },
    { field: "lopotherallowance", headerName: "LOP Other Allowance", flex: 0, width: 100, hide: !columnVisibility.lopotherallowance, headerClassName: "bold-header" },
    { field: "lopnetsalary", headerName: "LOP Net Salary", flex: 0, width: 100, hide: !columnVisibility.lopnetsalary, headerClassName: "bold-header" },
    { field: "prodbasic", headerName: "PROD Basic", flex: 0, width: 100, hide: !columnVisibility.prodbasic, headerClassName: "bold-header" },
    { field: "prodhra", headerName: "PROD HRA", flex: 0, width: 100, hide: !columnVisibility.prodhra, headerClassName: "bold-header" },
    { field: "prodconveyance", headerName: "PROD Conveyance", flex: 0, width: 100, hide: !columnVisibility.prodconveyance, headerClassName: "bold-header" },
    { field: "prodmedicalallowance", headerName: "PROD Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.prodmedicalallowance, headerClassName: "bold-header" },
    { field: "prodproductionallowance", headerName: " PROD Production Allowance", flex: 0, width: 100, hide: !columnVisibility.prodproductionallowance, headerClassName: "bold-header" },
    { field: "prodotherallowance", headerName: "PROD Other Allowance", flex: 0, width: 100, hide: !columnVisibility.prodotherallowance, headerClassName: "bold-header" },
    { field: "attendancelop", headerName: "Attendance LOP", flex: 0, width: 100, hide: !columnVisibility.attendancelop, headerClassName: "bold-header" },
    { field: "calculatednetsalary", headerName: "Calculated Net Salary", flex: 0, width: 100, hide: !columnVisibility.calculatednetsalary, headerClassName: "bold-header" },
    { field: "actualpenaltyamount", headerName: "Actual Penalty Amount", flex: 0, width: 100, hide: !columnVisibility.actualpenaltyamount, headerClassName: "bold-header" },
    { field: "penaltyamount", headerName: "Penalty Amount", flex: 0, width: 100, hide: !columnVisibility.penaltyamount, headerClassName: "bold-header" },
    { field: "lossdeduction", headerName: "Loss Deduction", flex: 0, width: 100, hide: !columnVisibility.lossdeduction, headerClassName: "bold-header" },
    { field: "otherdeduction", headerName: "Other Deduction", flex: 0, width: 100, hide: !columnVisibility.otherdeduction, headerClassName: "bold-header" },

    { field: "finalbasic", headerName: "Final Basic", flex: 0, width: 100, hide: !columnVisibility.finalbasic, headerClassName: "bold-header" },
    { field: "finalhra", headerName: "Final HRA", flex: 0, width: 100, hide: !columnVisibility.finalhra, headerClassName: "bold-header" },
    { field: "finalconveyance", headerName: "Final Conveyance", flex: 0, width: 100, hide: !columnVisibility.finalconveyance, headerClassName: "bold-header" },
    { field: "finalmedicalallowance", headerName: "Final Medical Allowance", flex: 0, width: 100, hide: !columnVisibility.finalmedicalallowance, headerClassName: "bold-header" },
    { field: "finalproductionallowance", headerName: "Final Production Allowance", flex: 0, width: 100, hide: !columnVisibility.finalproductionallowance, headerClassName: "bold-header" },
    { field: "finalotherallowance", headerName: "Final Other Allowance", flex: 0, width: 100, hide: !columnVisibility.finalotherallowance, headerClassName: "bold-header" },
    { field: "finalnetsalary", headerName: "Final Net Salary", flex: 0, width: 100, hide: !columnVisibility.finalnetsalary, headerClassName: "bold-header" },
    { field: "pfdays", headerName: "PF Days", flex: 0, width: 100, hide: !columnVisibility.pfdays, headerClassName: "bold-header" },
    { field: "ncpdays", headerName: "NCP Days", flex: 0, width: 100, hide: !columnVisibility.ncpdays, headerClassName: "bold-header" },
    { field: "pfdeduction", headerName: "PF Deduction", flex: 0, width: 100, hide: !columnVisibility.pfdeduction, headerClassName: "bold-header" },
    { field: "esideduction", headerName: "ESI Deduction", flex: 0, width: 100, hide: !columnVisibility.esideduction, headerClassName: "bold-header" },
    { field: "finallopdays", headerName: "Final-LOP ", flex: 0, width: 100, hide: !columnVisibility.finallopdays, headerClassName: "bold-header" },
    { field: "paysliplop", headerName: "Final LOP Days", flex: 0, width: 100, hide: !columnVisibility.paysliplop, headerClassName: "bold-header" },
    { field: "finalleavededuction", headerName: "Final Leave Deduction", flex: 0, width: 100, hide: !columnVisibility.finalleavededuction, headerClassName: "bold-header" },
    { field: "professionaltax", headerName: "Professional Tax", flex: 0, width: 100, hide: !columnVisibility.professionaltax, headerClassName: "bold-header" },
    { field: "totaldeductions", headerName: "Total Deductions", flex: 0, width: 100, hide: !columnVisibility.totaldeductions, headerClassName: "bold-header" },
    { field: "uan", headerName: "UAN", flex: 0, width: 110, hide: !columnVisibility.uan, headerClassName: "bold-header" },
    { field: "ipname", headerName: "IP Name", flex: 0, width: 150, hide: !columnVisibility.ipname, headerClassName: "bold-header" },
    { field: "noallowanceshift", headerName: "No. Allowance Shift", flex: 0, width: 100, hide: !columnVisibility.noallowanceshift, headerClassName: "bold-header" },
    { field: "shiftallowancepoint", headerName: "Shift Allowance Point", flex: 0, width: 100, hide: !columnVisibility.shiftallowancepoint, headerClassName: "bold-header" },
    { field: "shiftallowancetarget", headerName: "Shift Allowance Target", flex: 0, width: 100, hide: !columnVisibility.shiftallowancetarget, headerClassName: "bold-header" },
    { field: "nightshiftallowance", headerName: "Night Shift Allowance", flex: 0, width: 100, hide: !columnVisibility.nightshiftallowance, headerClassName: "bold-header" },
    { field: "finalsalary", headerName: "Final Salary", flex: 0, width: 100, hide: !columnVisibility.finalsalary, headerClassName: "bold-header" },
    { field: "finalsalarypenalty", headerName: "Final Salary + Penalty", flex: 0, width: 100, hide: !columnVisibility.finalsalarypenalty, headerClassName: "bold-header" },
    { field: "totalpointsvalue", headerName: "Total Points Value", flex: 0, width: 100, hide: !columnVisibility.totalpointsvalue, headerClassName: "bold-header" },
    { field: "era", headerName: "ERA", flex: 0, width: 100, hide: !columnVisibility.era, headerClassName: "bold-header" },
    { field: "actualera", headerName: "Actual ERA", flex: 0, width: 100, hide: !columnVisibility.actualera, headerClassName: "bold-header" },
    { field: "pfemployerdeduction", headerName: "PF Employer Deduction", flex: 0, width: 100, hide: !columnVisibility.pfemployerdeduction, headerClassName: "bold-header" },
    { field: "esiemployerdeduction", headerName: "ESI Employer Deduction", flex: 0, width: 100, hide: !columnVisibility.esiemployerdeduction, headerClassName: "bold-header" },
    { field: "ctc", headerName: "CTC", flex: 0, width: 100, hide: !columnVisibility.ctc, headerClassName: "bold-header" },
    { field: "revenueallowance", headerName: "Revenue Allowance", flex: 0, width: 100, hide: !columnVisibility.revenueallowance, headerClassName: "bold-header" },
    { field: "finalvalue", headerName: "Final Value", flex: 0, width: 100, hide: !columnVisibility.finalvalue, headerClassName: "bold-header" },
    // { field: "finalvaluetwo", headerName: "Final Value 2", flex: 0, width: 100, hide: !columnVisibility.finalvaluetwo, headerClassName: "bold-header" },
    { field: "finalvaluepenalty", headerName: "Final Value-Penalty", flex: 0, width: 100, hide: !columnVisibility.finalvaluepenalty, headerClassName: "bold-header" },
    { field: "shortage", headerName: "Shortage", flex: 0, width: 100, hide: !columnVisibility.shortage, headerClassName: "bold-header" },
    { field: "shortageone", headerName: "Shortage 1", flex: 0, width: 100, hide: !columnVisibility.shortageone, headerClassName: "bold-header" },
    { field: "actualdeduction", headerName: "Actual Deduction", flex: 0, width: 100, hide: !columnVisibility.actualdeduction, headerClassName: "bold-header" },
    { field: "minimumdeduction", headerName: "Minimum Deduction", flex: 0, width: 100, hide: !columnVisibility.minimumdeduction, headerClassName: "bold-header" },
    { field: "finalvaluereview", headerName: "Final Value Review", flex: 0, width: 120, hide: !columnVisibility.finalvaluereview, headerClassName: "bold-header" },
    { field: "finalvaluestatus", headerName: "Final Value Status", flex: 0, width: 130, hide: !columnVisibility.finalvaluestatus, headerClassName: "bold-header" },
    { field: "finalvaluepenaltystatus", headerName: "Final Value Penalty Status", flex: 0, width: 120, hide: !columnVisibility.finalvaluepenaltystatus, headerClassName: "bold-header" },

    { field: "currentmonthavg", headerName: `Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Avg`, flex: 0, width: 100, hide: !columnVisibility.currentmonthavg },
    { field: "currentmonthattendance", headerName: `Current (${monthNames[Number(selectedMonthNum) >= 12 ? 0 : Number(selectedMonthNum)]}) Month Att`, flex: 0, width: 100, hide: !columnVisibility.currentmonthattendance },
    { field: "paidstatus", headerName: "Paid Status", flex: 0, width: 150, hide: !columnVisibility.paidstatus },

    // { field: "salarytype", headerName: "Salary Type", flex: 0, width: 140, hide: !columnVisibility.salarytype, headerClassName: "bold-header" },
    // { field: "deductiontype", headerName: "Deduction Type", flex: 0, width: 140, hide: !columnVisibility.deductiontype, headerClassName: "bold-header" },


  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      ...item,
    }
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
      <Headtitle title={"Final Salary List"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}> Manage Final Salary List</Typography>
      {isUserRoleCompare?.includes("afinalsalarylist") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Final Salary List</Typography>
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
      {isUserRoleCompare?.includes("lfinalsalarylist") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Final Salary List</Typography>
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
                  {isUserRoleCompare?.includes("excelfinalsalarylist") && (
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
                    //           "Prod Exp": Number(t.prodexp),
                    //           "Total No Of Days": Number(t.totalnumberofdays),
                    //           "Total Shift": Number(t.totalshift),
                    //           CLSL: Number(t.clsl),
                    //           "Week Off": Number(t.weekoff),
                    //           Holiday: Number(t.holiday),
                    //           "Total Absent/Leave": Number(t.totalasbleave),
                    //           "Total Paid Dyas": Number(t.totalpaidDays),


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
                    //           "LOP Basic": Number(t.lopbasic),
                    //           "LOP HRA": Number(t.lophra),
                    //           "LOP Conveyance": Number(t.lopconveyance),
                    //           "LOP Medical Allowance": Number(t.lopmedicalallowance),
                    //           "LOP Production Allowance": Number(t.lopproductionallowance),
                    //           "LOP Other Allowance": Number(t.lopotherallowance),
                    //           "LOP Net Salary": Number(t.lopnetsalary),
                    //           "PROD Basic": Number(t.prodbasic),
                    //           "PROD HRA": Number(t.prodhra),
                    //           "PROD Conveyance": Number(t.prodconveyance),
                    //           "PROD Medical Allowance": Number(t.prodmedicalallowance),
                    //           "PROD Production Allowance": Number(t.prodproductionallowance),
                    //           "PROD Other Allowance": Number(t.prodotherallowance),
                    //           "Attendance LOP": Number(t.attendancelop),
                    //           "Calculated Net Salary": Number(t.calculatednetsalary),
                    //           "Actual Penalty Amount": Number(t.actualpenaltyamount),
                    //           "Penalty Amount": Number(t.penaltyamount),
                    //           "Loss Deduction": Number(t.lossdeduction),
                    //           "Other Deduction": Number(t.otherdeduction),
                    //           "Final Basic": Number(t.finalbasic),
                    //           "Final HRA": Number(t.finalhra),
                    //           "Final Conveyance": Number(t.finalconveyance),
                    //           "Final Medical Allowance": Number(t.finalmedicalallowance),
                    //           "Final Production Allowance": Number(t.finalproductionallowance),
                    //           "Final Other Allowance": Number(t.finalotherallowance),
                    //           "Final Net Salary": Number(t.finalnetsalary),
                    //           "PF Days": Number(t.pfdays),
                    //           "NCP Days": Number(t.ncpdays),
                    //           "PF Deduction": Number(t.pfdeduction),
                    //           "ESI Deduction": Number(t.esideduction),
                    //           "Final-LOP": Number(t.finallopdays),
                    //           "Final LOP Days": Number(t.paysliplop),
                    //           "Final Leave Deduction": Number(t.finalleavededuction),
                    //           "Professional Tax": Number(t.professionaltax),
                    //           "Total Deductions": Number(t.totaldeductions),
                    //           UAN: t.uan,
                    //           "IP Name": t.ipname,
                    //           "No. Allowance Shift": Number(t.noallowanceshift),
                    //           "Shift Allowance Point": Number(t.shiftallowancepoint),
                    //           "Shift Allowance Target": Number(t.shiftallowancetarget),
                    //           "Night Shift Allowance": Number(t.nightshiftallowance),
                    //           "Final Salary": Number(t.finalsalary),
                    //           "Final Salary-Penalty": Number(t.finalsalarypenalty),
                    //           "Total Points Value": Number(t.totalpointsvalue),
                    //           ERA: Number(t.era),
                    //           "Actual ERA": Number(t.actualera),
                    //           "PF Employer Deduction": Number(t.pfemployerdeduction),
                    //           "ESI Employer Deduction": Number(t.esiemployerdeduction),
                    //           CTC: Number(t.ctc),
                    //           "Revenue Allowance": Number(t.revenueallowance),
                    //           "Final Value": Number(t.finalvalue),
                    //           "Final Value-Penalty": Number(t.finalvaluepenalty),
                    //           Shortage: Number(t.shortage),
                    //           "Shortage 1": Number(t.shortageone),
                    //           "Actual Deduction": Number(t.actualdeduction),
                    //           "Minimum Deduction": Number(t.minimumdeduction),
                    //           "Final Value Review": t.finalvaluereview,
                    //           "Final Value Status": t.finalvaluestatus,
                    //           "Final Value Penalty Status": t.finalvaluepenaltystatus,
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
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvfinalsalarylist") && (
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
                    //           "Prod Exp": Number(t.prodexp),
                    //           "Total No Of Days": Number(t.totalnumberofdays),
                    //           "Total Shift": Number(t.totalshift),
                    //           CLSL: Number(t.clsl),
                    //           "Week Off": Number(t.weekoff),
                    //           Holiday: Number(t.holiday),
                    //           "Total Absent/Leave": Number(t.totalasbleave),
                    //           "Total Paid Dyas": Number(t.totalpaidDays),


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
                    //           "LOP Basic": Number(t.lopbasic),
                    //           "LOP HRA": Number(t.lophra),
                    //           "LOP Conveyance": Number(t.lopconveyance),
                    //           "LOP Medical Allowance": Number(t.lopmedicalallowance),
                    //           "LOP Production Allowance": Number(t.lopproductionallowance),
                    //           "LOP Other Allowance": Number(t.lopotherallowance),
                    //           "LOP Net Salary": Number(t.lopnetsalary),
                    //           "PROD Basic": Number(t.prodbasic),
                    //           "PROD HRA": Number(t.prodhra),
                    //           "PROD Conveyance": Number(t.prodconveyance),
                    //           "PROD Medical Allowance": Number(t.prodmedicalallowance),
                    //           "PROD Production Allowance": Number(t.prodproductionallowance),
                    //           "PROD Other Allowance": Number(t.prodotherallowance),
                    //           "Attendance LOP": Number(t.attendancelop),
                    //           "Calculated Net Salary": Number(t.calculatednetsalary),
                    //           "Actual Penalty Amount": Number(t.actualpenaltyamount),
                    //           "Penalty Amount": Number(t.penaltyamount),
                    //           "Loss Deduction": Number(t.lossdeduction),
                    //           "Other Deduction": Number(t.otherdeduction),
                    //           "Final Basic": Number(t.finalbasic),
                    //           "Final HRA": Number(t.finalhra),
                    //           "Final Conveyance": Number(t.finalconveyance),
                    //           "Final Medical Allowance": Number(t.finalmedicalallowance),
                    //           "Final Production Allowance": Number(t.finalproductionallowance),
                    //           "Final Other Allowance": Number(t.finalotherallowance),
                    //           "Final Net Salary": Number(t.finalnetsalary),
                    //           "PF Days": Number(t.pfdays),
                    //           "NCP Days": Number(t.ncpdays),
                    //           "PF Deduction": Number(t.pfdeduction),
                    //           "ESI Deduction": Number(t.esideduction),
                    //           "Final-LOP": Number(t.finallopdays),
                    //           "Final LOP Days": Number(t.paysliplop),
                    //           "Final Leave Deduction": Number(t.finalleavededuction),
                    //           "Professional Tax": Number(t.professionaltax),
                    //           "Total Deductions": Number(t.totaldeductions),
                    //           UAN: t.uan,
                    //           "IP Name": t.ipname,
                    //           "No. Allowance Shift": Number(t.noallowanceshift),
                    //           "Shift Allowance Point": Number(t.shiftallowancepoint),
                    //           "Shift Allowance Target": Number(t.shiftallowancetarget),
                    //           "Night Shift Allowance": Number(t.nightshiftallowance),
                    //           "Final Salary": Number(t.finalsalary),
                    //           "Final Salary-Penalty": Number(t.finalsalarypenalty),
                    //           "Total Points Value": Number(t.totalpointsvalue),
                    //           ERA: Number(t.era),
                    //           "Actual ERA": Number(t.actualera),
                    //           "PF Employer Deduction": Number(t.pfemployerdeduction),
                    //           "ESI Employer Deduction": Number(t.esiemployerdeduction),
                    //           CTC: Number(t.ctc),
                    //           "Revenue Allowance": Number(t.revenueallowance),
                    //           "Final Value": Number(t.finalvalue),
                    //           "Final Value-Penalty": Number(t.finalvaluepenalty),
                    //           Shortage: Number(t.shortage),
                    //           "Shortage 1": Number(t.shortageone),
                    //           "Actual Deduction": Number(t.actualdeduction),
                    //           "Minimum Deduction": Number(t.minimumdeduction),
                    //           "Final Value Review": t.finalvaluereview,
                    //           "Final Value Status": t.finalvaluestatus,
                    //           "Final Value Penalty Status": t.finalvaluepenaltystatus,
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
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printfinalsalarylist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdffinalsalarylist") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagefinalsalarylist") && (
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
            {/* {isUserRoleCompare?.includes("bdfinalsalarylist") && (
                            <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)} */}
            <br />
            <br />
            {isActive ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {/* <CircularProgress color="inherit" />  */}
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
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true} ref={gridRef}
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

      <Box>
        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Aadhar Name</TableCell>
                <TableCell>Process Code</TableCell>
                <TableCell>DOJ</TableCell>
                <TableCell>Experience In Month</TableCell>
                <TableCell>Prod Exp</TableCell>
                <TableCell>Total No of Dyas</TableCell>
                <TableCell>Total Shift</TableCell>
                <TableCell>CLSL</TableCell>
                <TableCell>Week Off</TableCell>
                <TableCell>Holiday</TableCell>
                <TableCell>Total Absent/Leave</TableCell>
                <TableCell>Total Paid Days</TableCell>


                <TableCell>Gross</TableCell>

                <TableCell>Basic</TableCell>
                <TableCell>HRA</TableCell>
                <TableCell>Conveyance</TableCell>
                <TableCell>Medical Allowance</TableCell>
                <TableCell>Production Allowance</TableCell>
                <TableCell>Production Allowance 2</TableCell>
                <TableCell>Other Allowance</TableCell>



                <TableCell>New Gross</TableCell>
                <TableCell>Actual Basic</TableCell>
                <TableCell>Actual HRA</TableCell>
                <TableCell>Actual Conveyance</TableCell>
                <TableCell>Actual Medical Allowance</TableCell>
                <TableCell>Actual Production Allowance</TableCell>
                <TableCell>Actual Production Allowance 2</TableCell>
                <TableCell>Actual Other Allowance</TableCell>


                <TableCell>Target Points</TableCell>
                <TableCell>Achieved Points</TableCell>
                <TableCell>Achieved %</TableCell>
                <TableCell>Achieved Production Allowance</TableCell>
                <TableCell>Actual Net Salary</TableCell>
                <TableCell>LOP Basic</TableCell>
                <TableCell>LOP HRA</TableCell>
                <TableCell>LOP Conveyance</TableCell>
                <TableCell>LOP Medical Allowance</TableCell>
                <TableCell>LOP Production Allowance</TableCell>
                <TableCell>LOP Other Allowance</TableCell>
                <TableCell>LOP Net Salary</TableCell>
                <TableCell>PROD Basic</TableCell>
                <TableCell>PROD HRA</TableCell>
                <TableCell>PROD Conveyance</TableCell>
                <TableCell>PROD Medical Allowance</TableCell>
                <TableCell>PROD Production Allowance</TableCell>
                <TableCell>PROD Other Allowance</TableCell>
                <TableCell>Attendance LOP</TableCell>
                <TableCell>Calculated Net Salary</TableCell>
                <TableCell>Actual Penalty Amount</TableCell>
                <TableCell>Penalty Amount</TableCell>
                <TableCell>Loss Deduction</TableCell>
                <TableCell>Other Deduction</TableCell>
                <TableCell>Final Basic</TableCell>
                <TableCell>Final HRA</TableCell>
                <TableCell>Final Conveyance</TableCell>
                <TableCell>Final Medical Allowance</TableCell>
                <TableCell>Final Production Allowance</TableCell>
                <TableCell>Final Other Allowance</TableCell>
                <TableCell>Final Net Salary</TableCell>
                <TableCell>PF Days</TableCell>
                <TableCell>NCP Days</TableCell>
                <TableCell>PF Deduction</TableCell>
                <TableCell>ESI Deduction</TableCell>
                <TableCell>Final LOP</TableCell>
                <TableCell>Final LOP Days</TableCell>
                <TableCell>Final Leave Deduction</TableCell>
                <TableCell>Professional Tax</TableCell>
                <TableCell>Total Deductions</TableCell>
                <TableCell>UAN</TableCell>
                <TableCell>IP Name</TableCell>
                <TableCell>No. Allowance Shift</TableCell>
                <TableCell>Shift Allowance Point</TableCell>
                <TableCell>Shift Allowance Target</TableCell>
                <TableCell>Night Shift Allowance</TableCell>
                <TableCell>Final Salary</TableCell>
                <TableCell>Final Salary-Penalty</TableCell>
                <TableCell>Total Points Value</TableCell>
                <TableCell>ERA</TableCell>
                <TableCell>Actual ERA</TableCell>
                <TableCell>PF Employer Deduction</TableCell>
                <TableCell>ESI Employer Deduction</TableCell>
                <TableCell>CTC</TableCell>
                <TableCell>Revenue Allowance</TableCell>
                <TableCell>Final Value</TableCell>
                <TableCell>Final Value-Penalty</TableCell>
                <TableCell>Shortage</TableCell>
                <TableCell>Shortage 1</TableCell>
                <TableCell>Actual Deduction</TableCell>
                <TableCell>Minimum Deduction</TableCell>
                <TableCell>Final Value Review</TableCell>
                <TableCell>Final Value Status</TableCell>
                <TableCell>Final Value Penalty Status</TableCell>

                <TableCell>Current Month Avg</TableCell>
                <TableCell>Current Month Attendance</TableCell>
                <TableCell>Paid Status</TableCell>

                {/* <TableCell>Salary Type</TableCell>
                <TableCell>Deduction Type</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.designation}</TableCell>
                    <TableCell>{row.employeename}</TableCell>
                    <TableCell>{row.aadharname}</TableCell>
                    <TableCell>{row.processcode}</TableCell>
                    <TableCell>{row.doj}</TableCell>
                    <TableCell>{row.experienceinmonth}</TableCell>
                    <TableCell>{row.prodexp}</TableCell>
                    <TableCell>{row.totalnumberofdays}</TableCell>
                    <TableCell>{row.totalshift}</TableCell>
                    <TableCell>{row.clsl}</TableCell>
                    <TableCell>{row.weekoff}</TableCell>
                    <TableCell>{row.holiday}</TableCell>
                    <TableCell>{row.totalasbleave}</TableCell>
                    <TableCell>{row.totalpaidDays}</TableCell>

                    <TableCell>{row.oldgross}</TableCell>
                    <TableCell>{row.oldbasic}</TableCell>
                    <TableCell>{row.oldhra}</TableCell>
                    <TableCell>{row.oldconveyance}</TableCell>
                    <TableCell>{row.oldmedicalallowance}</TableCell>
                    <TableCell>{row.oldproductionallowance}</TableCell>
                    <TableCell>{row.oldproductionallowancetwo}</TableCell>
                    <TableCell>{row.oldotherallowance}</TableCell>

                    <TableCell>{row.newgross}</TableCell>
                    <TableCell>{row.actualbasic}</TableCell>
                    <TableCell>{row.actualhra}</TableCell>
                    <TableCell>{row.actualconveyance}</TableCell>
                    <TableCell>{row.actualmedicalallowance}</TableCell>
                    <TableCell>{row.actualproductionallowance}</TableCell>
                    <TableCell>{row.actualproductionallowancetwo}</TableCell>
                    <TableCell>{row.actualotherallowance}</TableCell>


                    <TableCell>{row.targetpoints}</TableCell>
                    <TableCell>{row.achievedpoints}</TableCell>
                    <TableCell>{row.achieved}</TableCell>
                    <TableCell>{row.achievedproductionallowance}</TableCell>
                    <TableCell>{row.actualnetsalary}</TableCell>
                    <TableCell>{row.lopbasic}</TableCell>
                    <TableCell>{row.lophra}</TableCell>
                    <TableCell>{row.lopconveyance}</TableCell>
                    <TableCell>{row.lopmedicalallowance}</TableCell>
                    <TableCell>{row.lopproductionallowance}</TableCell>
                    <TableCell>{row.lopotherallowance}</TableCell>
                    <TableCell>{row.lopnetsalary}</TableCell>
                    <TableCell>{row.prodbasic}</TableCell>
                    <TableCell>{row.prodhra}</TableCell>
                    <TableCell>{row.prodconveyance}</TableCell>
                    <TableCell>{row.prodmedicalallowance}</TableCell>
                    <TableCell>{row.prodproductionallowance}</TableCell>
                    <TableCell>{row.prodotherallowance}</TableCell>
                    <TableCell>{row.attendancelop}</TableCell>
                    <TableCell>{row.calculatednetsalary}</TableCell>
                    <TableCell>{row.actualpenaltyamount}</TableCell>
                    <TableCell>{row.penaltyamount}</TableCell>
                    <TableCell>{row.lossdeduction}</TableCell>
                    <TableCell>{row.otherdeduction}</TableCell>
                    <TableCell>{row.finalbasic}</TableCell>
                    <TableCell>{row.finalhra}</TableCell>
                    <TableCell>{row.finalconveyance}</TableCell>
                    <TableCell>{row.finalmedicalallowance}</TableCell>
                    <TableCell>{row.finalproductionallowance}</TableCell>
                    <TableCell>{row.finalotherallowance}</TableCell>
                    <TableCell>{row.finalnetsalary}</TableCell>
                    <TableCell>{row.pfdays}</TableCell>
                    <TableCell>{row.ncpdays}</TableCell>
                    <TableCell>{row.pfdeduction}</TableCell>
                    <TableCell>{row.esideduction}</TableCell>
                    <TableCell>{row.finallopdays}</TableCell>
                    <TableCell>{row.paysliplop}</TableCell>
                    <TableCell>{row.finalleavededuction}</TableCell>
                    <TableCell>{row.professionaltax}</TableCell>
                    <TableCell>{row.totaldeductions}</TableCell>
                    <TableCell>{row.uan}</TableCell>
                    <TableCell>{row.ipname}</TableCell>
                    <TableCell>{row.noallowanceshift}</TableCell>
                    <TableCell>{row.shiftallowancepoint}</TableCell>
                    <TableCell>{row.shiftallowancetarget}</TableCell>
                    <TableCell>{row.nightshiftallowance}</TableCell>
                    <TableCell>{row.finalsalary}</TableCell>
                    <TableCell>{row.finalsalarypenalty}</TableCell>
                    <TableCell>{row.totalpointsvalue}</TableCell>
                    <TableCell>{row.era}</TableCell>
                    <TableCell>{row.actualera}</TableCell>
                    <TableCell>{row.pfemployerdeduction}</TableCell>
                    <TableCell>{row.esiemployerdeduction}</TableCell>
                    <TableCell>{row.ctc}</TableCell>
                    <TableCell>{row.revenueallowance}</TableCell>
                    <TableCell>{row.finalvalue}</TableCell>
                    <TableCell>{row.finalvaluepenalty}</TableCell>
                    <TableCell>{row.shortage}</TableCell>
                    <TableCell>{row.shortageone}</TableCell>
                    <TableCell>{row.actualdeduction}</TableCell>
                    <TableCell>{row.minimumdeduction}</TableCell>
                    <TableCell>{row.finalvaluereview}</TableCell>
                    <TableCell>{row.finalvaluestatus}</TableCell>
                    <TableCell>{row.finalvaluepenaltystatus}</TableCell>

                    <TableCell>{row.currentmonthavg}</TableCell>
                    <TableCell>{row.currentmonthattendance}</TableCell>
                    <TableCell>{row.paidstatus}</TableCell>

                    {/* <TableCell>{row.salarytype}</TableCell>
                    <TableCell>{row.deductiontype}</TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
    </Box>
  );
}

export default FinalSalaryList;