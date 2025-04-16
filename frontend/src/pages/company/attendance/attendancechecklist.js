import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import StyledDataGrid from "../../../components/TableStyle";
import { handleApiError } from "../../../components/Errorhandling";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  Paper,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import moment from "moment-timezone";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";

function AttendanceCheckList() {
  // get current year
  const currentYear = new Date().getFullYear();

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
  const currentYearObject = { label: currentYear, value: currentYear };
  const years = Array.from(new Array(10), (val, index) => currentYear - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  const gridRef = useRef(null);
  const { isUserRoleCompare, isAssignBranch, allTeam,alldepartment } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [status, setStatus] = useState({});
  const [userShifts, setUserShifts] = useState([]);
  const [attStatus, setAttStatus] = useState([]);
  const [attStatusOption, setAttStatusOption] = useState([]);
  const [filterBasedItems, setFilterBasedItems] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const cuurentDate = new Date();

  const [filterUser, setFilterUser] = useState({
    mode: "Please Select Mode",
    fromdate: moment(cuurentDate).format("YYYY-MM-DD"),
    todate: moment(cuurentDate).format("YYYY-MM-DD"),
  });
  const [isMonthyear, setIsMonthYear] = useState({
    ismonth: currentMonthObject,
    isyear: currentYearObject,
  });

  // Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  // page refersh reload
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

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQueryManage, setSearchQueryManage] = useState("");
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

  const modeOptions = [
    { label: 'Department', value: "Department" },
    { label: "Employee", value: "Employee" },
  ];

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [btnSubmit, setBtnSubmit] = useState(false);

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    serialNumber: true,
    empcode: true,
    username: true,
    company: true,
    branch: true,
    unit: true,
    department: true,
    date: true,
    shift: true,
    clockin: true,
    clockout: true,
    clockinstatus: true,
    clockoutstatus: true,
    attendance: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  useEffect(() => {
    fetchAttedanceStatus();
    fetchAttedanceMode();
    document.getElementById("to-date").min =
      moment(cuurentDate).format("YYYY-MM-DD");
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
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchAttedanceMode = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_vendor?.data?.allattmodestatus.filter((data, index) => {
        return data.appliedthrough != "Auto";
      });

      setAttStatusOption(
        result.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };


  //company multiselect
  const [employees, setEmployees] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  let [valueCompany, setValueCompany] = useState([]);

  const handleCompanyChange = (options) => {
    setValueCompany(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompany(options);
    setValueBranch([]);
    setSelectedBranch([]);
    setValueUnit([]);
    setSelectedUnit([]);
    setValueTeam([]);
    setSelectedTeam([]);
    setSelectedDep([]);
    setValueDep([]);
    setSelectedEmp([]);
    setValueEmp([]);
  };

  const customValueRendererCompany = (valueCompany, _categoryname) => {
    return valueCompany?.length
      ? valueCompany.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedBranch, setSelectedBranch] = useState([]);
  let [valueBranch, setValueBranch] = useState([]);

  const handleBranchChange = (options) => {
    setValueBranch(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranch(options);
    setValueUnit([]);
    setSelectedUnit([]);
    setValueTeam([]);
    setSelectedTeam([]);
    setSelectedDep([]);
    setValueDep([]);
    setSelectedEmp([]);
    setValueEmp([]);
  };

  const customValueRendererBranch = (valueBranch, _categoryname) => {
    return valueBranch?.length
      ? valueBranch.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedUnit, setSelectedUnit] = useState([]);
  let [valueUnit, setValueUnit] = useState([]);

  const handleUnitChange = (options) => {
    setValueUnit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnit(options);

    setValueTeam([]);
    setSelectedTeam([]);
    setSelectedDep([]);
    setValueDep([]);
    setSelectedEmp([]);
    setValueEmp([]);
  };

  const customValueRendererUnit = (valueUnit, _categoryname) => {
    return valueUnit?.length
      ? valueUnit.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedTeam, setSelectedTeam] = useState([]);
  let [valueTeam, setValueTeam] = useState([]);

  const handleTeamChange = (options) => {
    setValueTeam(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeam(options);
    setSelectedDep([]);
    setValueDep([]);
    setSelectedEmp([]);
    setValueEmp([]);
  };

  const customValueRendererTeam = (valueTeam, _categoryname) => {
    return valueTeam?.length
      ? valueTeam.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  useEffect(() => {
    // Remove duplicates based on the 'company' field
    const uniqueIsAssignBranch = isAssignBranch.reduce((acc, current) => {
      const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
      if (!x) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Remove duplicates based on the 'teamname' field
    const uniqueAllTeam = allTeam.reduce((acc, current) => {
      const x = acc.find(item => item.teamname === current.teamname);
      if (!x) {
        acc.push(current);
      }
      return acc;
    }, []);

    const company = [...new Set(uniqueIsAssignBranch.map(data => data.company))].map((data) => ({
      label: data,
      value: data,
    }));

    setSelectedCompany(company);
    setValueCompany(
      company.map((a, index) => {
        return a.value;
      })
    );

    const branch = uniqueIsAssignBranch?.filter(
      (val) =>
        company?.map(comp => comp.value === val.company)
    )?.map(data => ({
      label: data.branch,
      value: data.branch,
    })).filter((item, index, self) => {
      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    })
    setSelectedBranch(branch);
    setValueBranch(
      branch.map((a, index) => {
        return a.value;
      })
    );

    const unit = uniqueIsAssignBranch?.filter(
      (val) =>
        company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch)
    )?.map(data => ({
      label: data.unit,
      value: data.unit,
    })).filter((item, index, self) => {
      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    })
    setSelectedUnit(unit);
    setValueUnit(
      unit.map((a, index) => {
        return a.value;
      })
    );

    const team = uniqueAllTeam?.filter(
      (val) =>
        company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch) && unit?.map(comp => comp.value === val.unit)
    )?.map(data => ({
      label: data.teamname,
      value: data.teamname,
    })).filter((item, index, self) => {
      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    })
    setSelectedTeam(team);
    setValueTeam(
      team.map((a, index) => {
        return a.value;
      })
    );
  }, [isAssignBranch, allTeam])

  const [selectedDep, setSelectedDep] = useState([]);
  const [valueDep, setValueDep] = useState("");
  //Department multiselect dropdown changes
  const handleDepChangeFrom = (options) => {
    setSelectedDep(options);
    setValueDep(options.map((a, index) => {
      return a.value;
    }))
    setSelectedEmp([]);
    setValueEmp("");
  };

  const customValueRendererDepFrom = (valueDep, _employeename) => {
    return valueDep.length
      ? valueDep.map(({ label }) => label).join(", ")
      : "Please Select Department";
  };

  const fetchEmployee = async () => {

    try {
      let res_emp = await axios.get(SERVICE.USER_X_EMPLOYEES, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmployees(res_emp.data.users);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  useEffect(() => {
    fetchEmployee();
  }, [])

  //Employee Multi Select
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [valueEmp, setValueEmp] = useState([]);

  const handleCategoryChange = (options) => {
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmp(options);
  };
  const customValueRendererCate = (valueEmp, _employeename) => {
    return valueEmp.length
      ? valueEmp.map(({ label }) => label).join(", ")
      : "Please Select Employee Name";
  };

  const getattendancestatus = (alldata) => {
    let result = attStatus.filter((data, index) => {
      return (
        data?.clockinstatus === alldata?.clockinstatus &&
        data?.clockoutstatus === alldata?.clockoutstatus
      );
    });

    return result[0]?.name;
  };

  // get week for month's start to end
  function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
  }

  const fetchFilteredUsersStatus = async () => {
    setUserShifts([]);
    setLoader(true);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    let startMonthDate = new Date(filterUser.fromdate);
    let endMonthDate = new Date(filterUser.todate);

    const daysArray = [];
    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(
        2,
        "0"
      )}/${String(startMonthDate.getMonth() + 1).padStart(
        2,
        "0"
      )}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const dayCount = startMonthDate.getDate();
      const shiftMode = "Main Shift";
      const weekNumberInMonth =
        getWeekNumberInMonth(startMonthDate) === 1
          ? `${getWeekNumberInMonth(startMonthDate)}st Week`
          : getWeekNumberInMonth(startMonthDate) === 2
            ? `${getWeekNumberInMonth(startMonthDate)}nd Week`
            : getWeekNumberInMonth(startMonthDate) === 3
              ? `${getWeekNumberInMonth(startMonthDate)}rd Week`
              : getWeekNumberInMonth(startMonthDate) > 3
                ? `${getWeekNumberInMonth(startMonthDate)}th Week`
                : "";

      daysArray.push({
        formattedDate,
        dayName,
        dayCount,
        shiftMode,
        weekNumberInMonth,
      });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }

    try {

      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });

      let leaveresult = res_applyleave?.data?.applyleaves;

      // let res_emp = await axios.get(SERVICE.USER_X_EMPLOYEES, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });

      // let userResult = res_emp?.data?.users?.filter((data) => {
      //   if (valueCompany?.includes(data.company) && valueBranch?.includes(data.branch) && valueUnit?.includes(data.unit) && valueTeam?.includes(data.team)
      //     && ((valueEmp?.includes(data.companyname)) || data.departmentlog.some(log => valueDep.includes(log.department)))
      //   ) {

      //     return data;
      //   }
      // })

      let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: [...valueCompany],
        branch: [...valueBranch],
        unit: [...valueUnit],
        team: [...valueTeam],
        employee: [...valueEmp],
        department: [...valueDep]
      });

      console.log(res_emp?.data?.users.length, 'userResult')
      function splitArray(array, chunkSize) {
        const resultarr = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          const chunk = array.slice(i, i + chunkSize);
          resultarr.push({
            data: chunk,
          });
        }
        return resultarr;
      }

      let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map(item => item.companyname))] : []
      const resultarr = splitArray(employeelistnames, 10);
      console.log(resultarr.length, 'resultarr')

      async function sendBatchRequest(batch) {
        try {
          let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER_DATEWISE, {
            employee: batch.data,
            userDates: daysArray,
          }, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            }
          })

          const filteredBatch = res?.data?.finaluser?.filter(d => {
            const [day, month, year] = d.rowformattedDate.split("/");
            const formattedDate = new Date(`${year}-${month}-${day}`);
            const reasonDate = new Date(d.reasondate);
            const dojDate = new Date(d.doj);

            if (d.reasondate && d.reasondate !== "") {
              return (formattedDate <= reasonDate);
            } else if (d.doj && d.doj !== "") {
              return (formattedDate >= dojDate);
            } else {
              return d;
            }
          });

          let filtered = valueDep.length > 0 ? (filteredBatch?.filter((data) => valueDep.includes(data.department))) : filteredBatch;

          const updateResult = filtered?.map((data) => {
            data.attendancestatus === "" || data.attendancestatus == undefined
              ? (data.dbattendancestatus = "NOTFOUND")
              : (data.dbattendancestatus = "FOUND");
            data.attendancestatus === ""
              ? (data.attendancestatus = getattendancestatus(data))
              : (data.attendancestatus = data.attendancestatus);

            return data;
          });

          return updateResult;

        } catch (err) {
          console.error("Error in POST request for batch:", batch.data, err);
        }
      }

      async function getAllResults() {
        let allResults = [];
        for (let batch of resultarr) {
          const finaldata = await sendBatchRequest(batch);
          allResults = allResults.concat(finaldata);
        }

        return { allResults }; // Return both results as an object
      }

      getAllResults().then(async (results) => {
        console.log(results.allResults.length, 'results.allResults')
        let countByEmpcodeClockin = {}; // Object to store count for each empcode
        let countByEmpcodeClockout = {};

        const result = results.allResults?.map((item, index) => {
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
          const absentItems = results.allResults?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

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
            serialNumber: index + 1,
            clockinstatus: updatedClockInStatus,
            clockoutstatus: updatedClockOutStatus,
          };
        });
        console.log(result.length)
        setUserShifts(result);
        setLoader(false);
      }).catch(error => {
        setLoader(true);
        console.error('Error in getting all results:', error);
      });
    } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (filterUser.mode === 'Please Select Mode') {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Mode"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (valueCompany.length === 0) {
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
    }
    else if (valueBranch.length === 0) {
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
    }
    else if (valueUnit.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (valueTeam.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
    else if (filterUser.mode === 'Department' && selectedDep.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (filterUser.mode === 'Employee' && selectedEmp.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (filterUser.fromdate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select From Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (filterUser.todate === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select To Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      setLoader(false);
      fetchFilteredUsersStatus();
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setFilterUser({
      mode: "Please Select Mode",
      fromdate: moment(cuurentDate).format("YYYY-MM-DD"),
      todate: moment(cuurentDate).format("YYYY-MM-DD"),
    });
    document.getElementById("to-date").min =
      moment(cuurentDate).format("YYYY-MM-DD");
    setUserShifts([]);
    setValueCompany([]);
    setSelectedCompany([]);
    setValueBranch([]);
    setSelectedBranch([]);
    setValueUnit([]);
    setSelectedUnit([]);
    setValueTeam([]);
    setSelectedTeam([]);
    setSelectedDep([]);
    setValueDep([]);
    setValueEmp([]);
    setSelectedEmp([]);
    setIsMonthYear({ ismonth: currentMonthObject, isyear: currentYearObject });
    setPage(1);
    // // Remove duplicates based on the 'company' field
    // const uniqueIsAssignBranch = isAssignBranch.reduce((acc, current) => {
    //   const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
    //   if (!x) {
    //     acc.push(current);
    //   }
    //   return acc;
    // }, []);

    // // Remove duplicates based on the 'teamname' field
    // const uniqueAllTeam = allTeam.reduce((acc, current) => {
    //   const x = acc.find(item => item.teamname === current.teamname);
    //   if (!x) {
    //     acc.push(current);
    //   }
    //   return acc;
    // }, []);

    // const company = [...new Set(uniqueIsAssignBranch.map(data => data.company))].map((data) => ({
    //   label: data,
    //   value: data,
    // }));

    // setSelectedCompany(company);
    // setValueCompany(
    //   company.map((a, index) => {
    //     return a.value;
    //   })
    // );

    // const branch = uniqueIsAssignBranch?.filter(
    //   (val) =>
    //     company?.map(comp => comp.value === val.company)
    // )?.map(data => ({
    //   label: data.branch,
    //   value: data.branch,
    // })).filter((item, index, self) => {
    //   return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    // })
    // setSelectedBranch(branch);
    // setValueBranch(
    //   branch.map((a, index) => {
    //     return a.value;
    //   })
    // );

    // const unit = uniqueIsAssignBranch?.filter(
    //   (val) =>
    //     company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch)
    // )?.map(data => ({
    //   label: data.unit,
    //   value: data.unit,
    // })).filter((item, index, self) => {
    //   return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    // })
    // setSelectedUnit(unit);
    // setValueUnit(
    //   unit.map((a, index) => {
    //     return a.value;
    //   })
    // );

    // const team = uniqueAllTeam?.filter(
    //   (val) =>
    //     company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch) && unit?.map(comp => comp.value === val.unit)
    // )?.map(data => ({
    //   label: data.teamname,
    //   value: data.teamname,
    // })).filter((item, index, self) => {
    //   return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
    // })
    // setSelectedTeam(team);
    // setValueTeam(
    //   team.map((a, index) => {
    //     return a.value;
    //   })
    // );
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  // const addSerialNumber = async () => {
  //   if (!userShifts || userShifts.length === 0) {
  //     console.log("User shifts data is empty or undefined.");
  //     return;
  //   }

  //   let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
  //     headers: {
  //       Authorization: `Bearer ${auth.APIToken}`,
  //     },
  //     status: String("Approved"),
  //   });

  //   let leaveresult = res_applyleave?.data?.applyleaves;

  //   let countByEmpcodeClockin = {}; // Object to store count for each empcode
  //   let countByEmpcodeClockout = {};

  //   const itemsWithSerialNumber = userShifts?.map((item, index) => {
  //     // Initialize count for empcode if not already present
  //     if (!countByEmpcodeClockin[item.empcode]) {
  //       countByEmpcodeClockin[item.empcode] = 1;
  //     }
  //     if (!countByEmpcodeClockout[item.empcode]) {
  //       countByEmpcodeClockout[item.empcode] = 1;
  //     }

  //     // Adjust clockinstatus based on lateclockincount
  //     let updatedClockInStatus = item.clockinstatus;
  //     // Adjust clockoutstatus based on earlyclockoutcount
  //     let updatedClockOutStatus = item.clockoutstatus;

  //     // Filter out only 'Absent' items for the current employee
  //     const absentItems = userShifts?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

  //     // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
  //     if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
  //       // Define the date format for comparison
  //       const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

  //       const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
  //       const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

  //       const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
  //       const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

  //       if (isPreviousDayLeave) {
  //         updatedClockInStatus = 'BeforeWeekOffLeave';
  //         updatedClockOutStatus = 'BeforeWeekOffLeave';
  //       }
  //       if (isPreviousDayAbsent) {
  //         updatedClockInStatus = 'BeforeWeekOffAbsent';
  //         updatedClockOutStatus = 'BeforeWeekOffAbsent';
  //       }
  //       if (isNextDayLeave) {
  //         updatedClockInStatus = 'AfterWeekOffLeave';
  //         updatedClockOutStatus = 'AfterWeekOffLeave';
  //       }
  //       if (isNextDayAbsent) {
  //         updatedClockInStatus = 'AfterWeekOffAbsent';
  //         updatedClockOutStatus = 'AfterWeekOffAbsent';
  //       }
  //     }

  //     // Check if 'Late - ClockIn' count exceeds the specified limit
  //     if (updatedClockInStatus === 'Late - ClockIn') {
  //       updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
  //       countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
  //     }
  //     // Check if 'Early - ClockOut' count exceeds the specified limit
  //     if (updatedClockOutStatus === 'Early - ClockOut') {
  //       updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
  //       countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
  //     }

  //     return {
  //       ...item,
  //       serialNumber: index + 1,
  //       clockinstatus: updatedClockInStatus,
  //       clockoutstatus: updatedClockOutStatus,
  //     };
  //   });
  //   let filteredUserData = itemsWithSerialNumber.flat()?.filter((data) => valueDep.includes(data.department) || valueEmp.includes(data.username));
  //   setFilterBasedItems(filteredUserData);
  // };

  // useEffect(() => {
  //   addSerialNumber();
  // }, [userShifts]);

  const handleUpdate = async (e, attendancestatus, date, alldata) => {
    let findAttendatceStatus = await axios.post(
      `${SERVICE.FIND_ATTANDANCESTATUS}`,
      {
        userid: e,
        date: moment(alldata.rowformattedDate.trim(), "DD/MM/YYYY").format(
          "DD-MM-YYYY"
        ),
        shiftmode: String(alldata.shiftMode),
      }
    );
    // Parse the original date string
    const parsedDate = moment(date, "DD/MM/YYYY dddd HH");
    // Format the parsed date to "DD-MM-YYYY"
    const formattedDate = moment(alldata.date).format("DD-MM-YYYY");

    setBtnSubmit(true);
    let resdate = moment(alldata.date, "DD/MM/YYYY").format("DD-MM-YYYY");

    if (findAttendatceStatus?.data?.found) {
      let endshift = alldata?.shift?.split("to");
      try {
        let response = await axios.put(
          `${SERVICE.UPDATE_ATTANDANCESTATUS}/${e}`,
          {
            attendancestatus: attendancestatus,
            date: moment(date, "DD-MM-YYYY"),
            shiftmode: String(alldata.shiftMode),
          }
        );

        await fetchFilteredUsersStatus();
        setStatus({});
        setBtnSubmit(false);
        setShowAlert(
          <>
            {" "}
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Updated Successfully👍"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    } else if (!findAttendatceStatus?.data?.found) {
      try {
        let endshift = alldata?.shift?.split("to");
        let resuser = await axios.get(
          `${SERVICE.USER_SINGLE}/${alldata.userid}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }
        );
        let response = await axios.post(
          `${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            username: String(resuser?.data?.suser?.username),
            userid: String(alldata.userid),
            clockintime: String("00:00:00"),
            clockouttime: String("00:00:00"),
            clockinipaddress: "",
            clockoutipaddress: "",
            status: true,
            buttonstatus: "false",
            calculatedshiftend: "",
            shiftname: alldata.shift,
            shiftendtime: endshift[1],
            autoclockout: Boolean(false),
            attendancestatus: attendancestatus,
            date: String(resdate),
            shiftmode: String(alldata.shiftMode),
          }
        );
        await fetchFilteredUsersStatus();
        setStatus({});
        setBtnSubmit(false);
        setShowAlert(
          <>
            {" "}
            <CheckCircleOutlineIcon
              sx={{ fontSize: "100px", color: "green" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {"Updated Successfully👍"}{" "}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }
  };
  const [rowIndex, setRowIndex] = useState();
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        attendancestatus: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };

  const columnDataTable = [
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Attendance Status",
      flex: 0,
      width: 270,
      sortable: false,
      hide: !columnVisibility.actions,
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            <Grid item md={12} xs={12} sm={12}>
              <FormControl size="large" fullWidth>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: "auto",
                      },
                    },
                  }}
                  style={{ minWidth: 150 }}
                  value={
                    status[params.row.id]?.attendancestatus
                      ? status[params.row.id]?.attendancestatus
                      : params.row.attendancestatus
                  }
                  onChange={(e) => {
                    handleAction(
                      e.target.value,
                      params.row.id,
                      params.row.serialNumber
                    );
                  }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  {attStatusOption?.map((d) => (
                    <MenuItem key={d._id} value={d.value}>
                      {d.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <br />
            <br />
            {status[params.row.id]?.btnShow &&
              rowIndex === params.row.serialNumber ? (
              <>
                {" "}
                <LoadingButton
                  sx={{
                    ...userStyle.buttonedit,
                    marginLeft: "10px",
                  }}
                  variant="contained"
                  loading={btnSubmit}
                  style={{ minWidth: "0px" }}
                  onClick={(e) =>
                    handleUpdate(
                      params.row.userid,
                      status[params.row.id]?.attendancestatus,
                      params.row.date,
                      params.row
                    )
                  }
                >
                  SAVE
                </LoadingButton>
              </>
            ) : (
              <></>
            )}
          </>
        </Grid>
      ),
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 130,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "Employee Name",
      flex: 0,
      width: 130,
      hide: !columnVisibility.username,
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
      width: 130,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 130,
      hide: !columnVisibility.unit,
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
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 110,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "shift",
      headerName: "Shift Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.shift,
      headerClassName: "bold-header",
    },
    {
      field: "clockinstatus",
      headerName: "ClockIn Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.clockinstatus,
      headerClassName: "bold-header",
    },
    {
      field: "clockoutstatus",
      headerName: "ClockOut Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.clockoutstatus,
      headerClassName: "bold-header",
    },
    {
      field: "attendance",
      headerName: "Mode",
      flex: 0,
      width: 130,
      hide: !columnVisibility.attendance,
      headerClassName: "bold-header",
      renderCell: (params) => {
        return (
          <Grid>
            <Button
              size="small"
              sx={{
                textTransform: "capitalize",
                borderRadius: "4px",
                boxShadow: "none",
                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                fontWeight: "400",
                fontSize: "0.575rem",
                lineHeight: "1.43",
                letterSpacing: "0.01071em",
                display: "flex",
                padding: "3px 8px",
                cursor: "default",
                color: "#052106",
                backgroundColor: "rgb(156 239 156)",
                '&:hover': {
                  color: "#052106",
                  backgroundColor: "rgb(156 239 156)",
                }
              }}
            >
              {params.row.attendance}
            </Button>
          </Grid>
        );
      },
    },
  ];

  const rowDataTable = userShifts?.flatMap((item, index) => {
    return {
      id: item.id,
      userid: item.userid,
      serialNumber: item.serialNumber,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      department: item.department,
      username: item.username,
      empcode: item.empcode,
      weekoff: item.weekoff,
      boardingLog: item.boardingLog,
      shiftallot: item.shiftallot,
      shift: item.shift,
      shiftMode: item.shiftMode,
      date: item.date,
      date: item.date,
      clockin: item.clockin,
      clockinstatus: item.clockinstatus,
      clockout: item.clockout,
      clockoutstatus: item.clockoutstatus,
      attendance: getattendancestatus(item),
      daystatus: item.daystatus ? item.daystatus : item.daystatus,
      attendancestatus: item.attendancestatus,
      shiftmode: item.shiftMode,
      rowformattedDate: item.rowformattedDate,
    }
  });

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = rowDataTable?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas?.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredDatas?.length / pageSize);
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

  const rowsWithCheckboxes = filteredData.map((row) => ({
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


  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Function to filter columns based on search query
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
      </Box>{" "}
      <br /> <br />
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
              {" "}
              Show All{" "}
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
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  // Excel
  const fileName = "Attendance Check List";
  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        filteredData?.map((t, index) => ({
          "SNo": index + 1,
          "Emp Code": t.empcode,
          "Employee Name": t.username,
          "Company": t.company,
          "Branch": t.branch,
          "Unit": t.unit,
          "Department": t.department,
          "Date": t.date,
          "Shift": t.shift,
          "ClockIn Status": t.clockinstatus,
          "ClockOut Status": t.clockoutstatus,
          "Mode": t.attendance,
          "AttendanceStatus": t.attendancestatus,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        rowDataTable.map((t, index) => ({
          "SNo": index + 1,
          "Emp Code": t.empcode,
          "Employee Name": t.username,
          "Company": t.company,
          "Branch": t.branch,
          "Unit": t.unit,
          "Department": t.department,
          "Date": t.date,
          "Shift": t.shift,
          "ClockIn Status": t.clockinstatus,
          "ClockOut Status": t.clockoutstatus,
          "Mode": t.attendance,
          "AttendanceStatus": t.attendancestatus,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };

  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendance Check List",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "SNo", field: "serialNumber" },
    { title: "Emp Code", field: "empcode" },
    { title: "Employee Name", field: "username" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Department", field: "department" },
    { title: "Date", field: "date" },
    { title: "Shift", field: "shift" },
    { title: "ClockIn Status", field: "clockinstatus" },
    { title: "ClockOut Status", field: "clockoutstatus" },
    { title: "Mode", field: "attendance" },
    { title: "Attendance Status", field: "attendancestatus" },
  ];

  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    // Initialize serial number counter
    let serialNumberCounter = 1;


    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      filteredData.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: { fontSize: 5 },
      // columns: columnsWithSerial,
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: dataWithSerial,
    });

    doc.save("Attendance Check List.pdf");
  };

  // image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "AttendanceCheckList.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"ATTENDANCE CHECKLIST"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Attendance Check List</Typography>
      {isUserRoleCompare?.includes("lattendancechecklist") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Mode<b style={{ color: "red" }}>*</b></Typography>
                    <Selects
                      options={modeOptions}
                      styles={colourStyles}
                      value={{ label: filterUser.mode, value: filterUser.mode }}
                      onChange={(e) => {
                        setFilterUser({ ...filterUser, mode: e.value, });
                        setSelectedDep([]);
                        setValueDep([]);
                        setSelectedEmp([]);
                        setValueEmp([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <MultiSelect
                      options={isAssignBranch?.map(data => ({
                        label: data.company,
                        value: data.company,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={isAssignBranch?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company)
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedBranch}
                      onChange={(e) => {
                        handleBranchChange(e);
                      }}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={isAssignBranch?.filter(
                        (comp) =>
                          valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                      )?.map(data => ({
                        label: data.unit,
                        value: data.unit,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                      value={selectedUnit}
                      onChange={(e) => {
                        handleUnitChange(e);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Team<b style={{ color: "red" }}>*</b></Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter((u) => valueCompany?.includes(u.company) && valueBranch?.includes(u.branch) && valueUnit?.includes(u.unit))
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedTeam}
                      onChange={(e) => {
                        handleTeamChange(e);
                      }}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4}>
                  {filterUser.mode === 'Department' ?
                    // <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Department<b style={{ color: "red" }}>*</b> </Typography>
                      <MultiSelect
                        options={alldepartment?.map(data => ({
                          label: data.deptname,
                          value: data.deptname,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedDep}
                        onChange={(e) => {
                          handleDepChangeFrom(e);
                        }}
                        valueRenderer={customValueRendererDepFrom}
                        labelledBy="Please Select Department"
                      />
                    </FormControl>
                    // </Grid>
                    : null}
                  {filterUser.mode === 'Employee' ?
                    // <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee Name<b style={{ color: "red" }}>*</b></Typography>
                      <MultiSelect
                        options={employees
                          ?.filter(
                            (u) =>
                              valueCompany?.includes(u.company) &&
                              valueBranch?.includes(u.branch) &&
                              valueUnit?.includes(u.unit) &&
                              valueTeam?.includes(u.team)
                          )
                          .map((u) => ({
                            ...u,
                            label: u.companyname,
                            value: u.companyname,
                          }))}
                        value={selectedEmp}
                        onChange={handleCategoryChange}
                        valueRenderer={customValueRendererCate}
                        labelledBy="Please Select Employee Name"
                      />
                    </FormControl>
                    // </Grid>
                    : null}
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      From Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="from-date"
                      type="date"
                      value={filterUser.fromdate}
                      onChange={(e) => {
                        setFilterUser({
                          ...filterUser,
                          fromdate: e.target.value,
                          todate: e.target.value,
                        });
                        document.getElementById("to-date").min = e.target.value;
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      To Date<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="to-date"
                      type="date"
                      value={filterUser.todate}
                      onChange={(e) => {
                        setFilterUser({
                          ...filterUser,
                          todate: e.target.value,
                        });
                      }}
                      min={filterUser.fromdate}
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
                  onClick={handleSubmit}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <br />
          <br />
          {/* ****** Table Start ****** */}
          {loader ? (
            <Box sx={userStyle.container}>
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
              </Box>
            </Box>
          ) : (
            <>
              <Box sx={userStyle.container}>
                {/* ******************************************************EXPORT Buttons****************************************************** */}
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    {" "}
                    Attendance Check List{" "}
                  </Typography>
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
                        {/* <MenuItem value={rowDataTable?.length}>All</MenuItem> */}
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
                        "excelattendancechecklist"
                      ) && (
                          <>

                            <Button onClick={(e) => {
                              setIsFilterOpen(true)
                              setFormat("xl")
                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "csvattendancechecklist"
                      ) && (
                          <>

                            <Button onClick={(e) => {
                              setIsFilterOpen(true)
                              setFormat("csv")
                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "printattendancechecklist"
                      ) && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleprint}
                            >
                              {" "}
                              &ensp; <FaPrint /> &ensp;Print&ensp;{" "}
                            </Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "pdfattendancechecklist"
                      ) && (
                          <>

                            <Button sx={userStyle.buttongrp}
                              onClick={() => {
                                setIsPdfFilterOpen(true)
                              }}
                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                          </>
                        )}
                      {isUserRoleCompare?.includes(
                        "imageattendancechecklist"
                      ) && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleCaptureImage}
                            >
                              {" "}
                              <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                              &ensp;Image&ensp;{" "}
                            </Button>
                          </>
                        )}
                    </Box>
                  </Grid>
                  <Grid item md={2} xs={12} sm={12}>
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
                </Grid>{" "}
                <br />
                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                  {" "}
                  Show All Columns{" "}
                </Button>{" "}
                &ensp;
                <Button
                  sx={userStyle.buttongrp}
                  onClick={handleOpenManageColumns}
                >
                  {" "}
                  Manage Columns{" "}
                </Button>{" "}
                <br /> <br />
                <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                    {filteredDatas.length > 0 ? (page - 1) * pageSize + 1 : 0}{" "}
                    to {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                    {filteredDatas?.length} entries
                  </Box>
                  <Box>
                    <Button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      {" "}
                      <FirstPageIcon />{" "}
                    </Button>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      {" "}
                      <NavigateBeforeIcon />{" "}
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                        disabled={page === pageNumber}
                      >
                        {" "}
                        {pageNumber}{" "}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      {" "}
                      <NavigateNextIcon />{" "}
                    </Button>
                    <Button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      {" "}
                      <LastPageIcon />{" "}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </>
          )}
          {/* ****** Table End ****** */}
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

      {/* Print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          id="usertable"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell>SNo</TableCell>
              <TableCell>Emp Code</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>ClockIn Status</TableCell>
              <TableCell>ClockOut Status</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Attendance Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {filteredData &&
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.serialNumber}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.shift}</TableCell>
                  <TableCell>{row.clockinstatus}</TableCell>
                  <TableCell>{row.clockoutstatus}</TableCell>
                  <TableCell>{row.attendance}</TableCell>
                  <TableCell>{row.attendancestatus}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

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

          {fileFormat === 'xl' ?
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
            : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
          }
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("filtered")
            }}
          >
            Export Filtered Data
          </Button>
          <Button autoFocus variant="contained"
            onClick={(e) => {
              handleExportXL("overall")
              // fetchFilteredUsersStatus()
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
              downloadPdf("filtered")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button variant="contained"
            onClick={(e) => {
              downloadPdf("overall")
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

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
  );
}

export default AttendanceCheckList;