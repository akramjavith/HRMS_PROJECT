import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
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
  Checkbox,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../../services/Baseservice";
import { handleApiError } from "../../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { AuthContext } from "../../../../context/Appcontext";
import StyledDataGrid from "../../../../components/TableStyle";
import Headtitle from "../../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { MultiSelect } from "react-multi-select-component";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import moment from "moment";

function AttendanceAbsentReport() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

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
  const { isUserRoleCompare, isAssignBranch, alldepartment } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [userShifts, setUserShifts] = useState([]);
  const [items, setItems] = useState([]);
  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);
  const [showAlert, setShowAlert] = useState();
  const [loader, setLoader] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [filterUser, setFilterUser] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    department: "Please Select Department",
    fromdate: today,
    todate: today,
  });
  const [isMonthyear, setIsMonthYear] = useState({
    ismonth: currentMonthObject,
    isyear: currentYearObject,
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

  // Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
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

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    checkbox: true,
    serialNumber: true,
    empcode: true,
    username: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    department: true,
    date: true,
    shiftmode: true,
    shift: true,
    clockin: true,
    clockout: true,
    clockinstatus: true,
    clockoutstatus: true,
    attendanceauto: true,
    daystatus: true,
    appliedthrough: true,
    lopcalculation: true,
    modetarget: true,
    paidpresent: true,
    lopday: true,
    paidpresentday: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const fetchCompany = async () => {
    try {
      setCompanies(
        isAssignBranch
          ?.map((data) => ({
            label: data.company,
            value: data.company,
          }))
          .filter((item, index, self) => {
            return (
              self.findIndex(
                (i) => i.label === item.label && i.value === item.value
              ) === index
            );
          })
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchAttedanceStatus();
    fetchAttMode();
  }, []);

  // // get all assignBranches
  // const fetchBranch = async (company) => {
  //     try {
  //         let arr = isAssignBranch?.filter(
  //             (comp) =>
  //                 company === comp.company
  //         )?.map(data => ({
  //             label: data.branch,
  //             value: data.branch,
  //         })).filter((item, index, self) => {
  //             return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
  //         })

  //         setBranches(arr);

  //     } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  // };

  // // get units
  // const fetchUnit = async (branch) => {
  //     try {
  //         let arr = isAssignBranch?.filter(
  //             (comp) =>
  //                 branch === comp.branch
  //         )?.map(data => ({
  //             label: data.unit,
  //             value: data.unit,
  //         })).filter((item, index, self) => {
  //             return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
  //         })
  //         setUnits(arr);

  //     } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  // };

  const fetchBranch = async () => {
    try {
      let res = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBranches(res.data.branch);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get units
  const fetchUnit = async () => {
    try {
      let res = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUnits(res.data.units);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchBranch();
    fetchUnit();
  }, []);

  const [selectedCompany, setSelectedCompany] = useState([]);
  const [valueCompany, setValueCompany] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [valueBranch, setValueBranch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [valueUnit, setValueUnit] = useState("");
  const [selectedDep, setSelectedDep] = useState([]);
  const [valueDep, setValueDep] = useState("");
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [valueEmp, setValueEmp] = useState("");

  useEffect(() => {
    // Remove duplicates based on the 'company' field
    const uniqueIsAssignBranch = isAssignBranch.reduce((acc, current) => {
      const x = acc.find((item) => item.company === current.company);
      if (!x) {
        acc.push(current);
      }
      return acc;
    }, []);

    const company = uniqueIsAssignBranch
      .map((data) => data.company)
      .map((data) => ({
        label: data,
        value: data,
      }));
    setSelectedCompany(company);
    setValueCompany(
      company.map((a, index) => {
        return a.value;
      })
    );
    const branch = uniqueIsAssignBranch
      .map((data) => data.branch)
      .map((data) => ({
        label: data,
        value: data,
      }));
    setSelectedBranch(branch);
    setValueBranch(
      branch.map((a, index) => {
        return a.value;
      })
    );
    const unit = uniqueIsAssignBranch
      .map((data) => data.unit)
      .map((data) => ({
        label: data,
        value: data,
      }));
    setSelectedUnit(unit);
    setValueUnit(
      unit.map((a, index) => {
        return a.value;
      })
    );
  }, [isAssignBranch]);

  //company multiselect
  const handleCompanyChange = (options) => {
    setValueCompany(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompany(options);
    setSelectedBranch([]);
    setValueBranch([]);
    setSelectedUnit([]);
    setValueUnit([]);
    setSelectedDep([]);
    setValueDep("");
    setSelectedEmp([]);
    setValueEmp("");
  };

  const customValueRendererCompany = (valueCompany, _categoryname) => {
    return valueCompany?.length
      ? valueCompany.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect dropdown changes
  const handleBranchChangeFrom = (options) => {
    setSelectedBranch(options);
    setValueBranch(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnit([]);
    setValueUnit("");
    setSelectedDep([]);
    setValueDep("");
    setSelectedEmp([]);
    setValueEmp("");
  };
  const customValueRendererBranchFrom = (valueBranch, _employeename) => {
    return valueBranch.length
      ? valueBranch.map(({ label }) => label).join(", ")
      : "Please Select Branch";
  };

  //unit multiselect dropdown changes
  const handleUnitChangeFrom = (options) => {
    setSelectedUnit(options);
    setValueUnit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDep([]);
    setValueDep("");
    setSelectedEmp([]);
    setValueEmp("");
  };
  const customValueRendererUnitFrom = (valueUnit, _employeename) => {
    return valueUnit.length
      ? valueUnit.map(({ label }) => label).join(", ")
      : "Please Select Unit";
  };

  const fetchDepartment = async () => {
    try {
      let res_dep = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // Remove duplicates from departments
      let uniqueDepartments = Array.from(
        new Set(res_dep.data.departmentdetails?.map((t) => t.deptname))
      );
      setDepartments(
        uniqueDepartments.map((t) => ({
          label: t,
          value: t,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  //Department multiselect dropdown changes
  const handleDepChangeFrom = (options) => {
    setSelectedDep(options);
    setValueDep(
      options.map((a, index) => {
        return a.value;
      })
    );
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

      // let data_set = res_emp.data.users.filter((data) => {
      //     if (valueCompany.includes(data.company) && valueBranch.includes(data.branch) && valueUnit.includes(data.unit)) {
      //         // return value === data.department;
      //         return value.includes(data.department);
      //     }
      // });

      // const emps = [
      //     // { value: "ALL", label: "ALL" },

      //     ...data_set.map((d) => ({
      //         ...d,
      //         label: d.companyname,
      //         value: d.companyname,
      //     })),
      // ];

      // setEmployees(emps);
      setEmployees(res_emp.data.users);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  // Employee multiselect
  const handleEmployeeChange = (options) => {
    setValueEmp(options.map((option) => option.value));
    setSelectedEmp(options);
    // if (employees.length === options.length) {
    //     const filteredOptions = options.filter(option => option.value !== "ALL");
    //     setSelectedEmp(filteredOptions);
    //     setValueEmp(filteredOptions.map(option => option.value));
    // }
    // // Check if "ALL" is selected
    // else if (options.some(option => option.value === "ALL")) {
    //     // Set "ALL" as the only selected option
    //     setSelectedEmp([{ value: "ALL", label: "ALL" }]);
    //     setValueEmp(["ALL"]);
    // } else {
    //     // Filter out "ALL" if any other option is selected
    //     const filteredOptions = options.filter(option => option.value !== "ALL");
    //     setSelectedEmp(filteredOptions);
    //     setValueEmp(filteredOptions.map(option => option.value));
    // }
  };

  const customValueRendererEmp = (valueEmp, _employees) => {
    return valueEmp.length
      ? valueEmp.map(({ label }) => label).join(", ")
      : "Please Select Employee";
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
    return result[0]?.lop === true ? "YES" : "No";
  };

  const getAttModeLopType = (rowdaystatus) => {
    let result = attModearr.filter((data, index) => {
      return data?.name === rowdaystatus;
    });
    return result[0]?.loptype;
  };

  const getFinalLop = (rowlop, rowloptype) => {
    return rowloptype === undefined || rowloptype === ""
      ? rowlop
      : rowlop + " - " + rowloptype;
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
    return rowpaidtype === undefined || rowpaidtype === ""
      ? rowpaid
      : rowpaid + " - " + rowpaidtype;
  };

  const getAssignLeaveDayForLop = (rowlopday) => {
    if (rowlopday === "YES - Double Day") {
      return "2";
    } else if (rowlopday === "YES - Full Day") {
      return "1";
    } else if (rowlopday === "YES - Half Day") {
      return "0.5";
    } else {
      return "0";
    }
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

  // get all users
  const fetchUsersStatus = async () => {
    // let endMonthDate = new Date(`${isMonthyear.isyear.value}-${isMonthyear.ismonth.value}-31`);
    // let startMonthDate = new Date(`${isMonthyear.isyear.value}-${isMonthyear.ismonth.value}-01`);

    // let endmonth = (mm == isMonthyear.ismonth.value && yyyy == isMonthyear.isyear.value) ? new Date(today) : endMonthDate;

    // const daysArray = [];
    // while (startMonthDate <= endmonth) {
    //     const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
    //     const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
    //     const dayCount = startMonthDate.getDate();
    //     daysArray.push({ formattedDate, dayName, dayCount });

    //     // Move to the next day
    //     startMonthDate.setDate(startMonthDate.getDate() + 1);
    // }

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
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        fromdate: filterUser.fromdate,
        // todate: filterUser.todate,
      });
      // setUserShifts(res?.data?.finaluser.filter(item => item !== null));
      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });

      let filtered = res?.data?.finaluser?.filter((d) => {
        const [day, month, year] = d.rowformattedDate.split("/");
        const formattedDate = new Date(`${year}-${month}-${day}`);

        const reasonDate = new Date(d.reasondate);
        const dojDate = new Date(d.doj);
        if (d.reasondate && d.reasondate != "") {
          return formattedDate <= reasonDate;
        } else if (d.doj && d.doj != "") {
          return formattedDate >= dojDate;
        } else {
          return d;
        }
      });

      let leaveresult = res_applyleave?.data?.applyleaves;

      let countByEmpcodeClockin = {}; // Object to store count for each empcode
      let countByEmpcodeClockout = {};

      const itemsWithSerialNumber = filtered?.map((item, index) => {
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
        const absentItems = filtered?.filter(
          (d) =>
            d.clockinstatus === "Absent" &&
            item.empcode === d.empcode &&
            d.clockin === "00:00:00" &&
            d.clockout === "00:00:00"
        );

        // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
        if (
          item.clockinstatus === "Week Off" &&
          item.clockoutstatus === "Week Off"
        ) {
          // Define the date format for comparison
          const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

          const isPreviousDayLeave = leaveresult.some(
            (leaveItem) =>
              moment(leaveItem.date, "DD/MM/YYYY").isSame(
                itemDate.clone().subtract(1, "days"),
                "day"
              ) && leaveItem.empcode === item.empcode
          );
          const isPreviousDayAbsent = absentItems.some((absentItem) =>
            moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(
              itemDate.clone().subtract(1, "days"),
              "day"
            )
          );

          const isNextDayLeave = leaveresult.some(
            (leaveItem) =>
              moment(leaveItem.date, "DD/MM/YYYY").isSame(
                itemDate.clone().add(1, "days"),
                "day"
              ) && leaveItem.empcode === item.empcode
          );
          const isNextDayAbsent = absentItems.some((absentItem) =>
            moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(
              itemDate.clone().add(1, "days"),
              "day"
            )
          );

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
          updatedClockInStatus = `${
            countByEmpcodeClockin[item.empcode]
          }Late - ClockIn`;
          countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
        }
        // Check if 'Early - ClockOut' count exceeds the specified limit
        if (updatedClockOutStatus === "Early - ClockOut") {
          updatedClockOutStatus = `${
            countByEmpcodeClockout[item.empcode]
          }Early - ClockOut`;
          countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
        }

        return {
          ...item,
          clockinstatus: updatedClockInStatus,
          clockoutstatus: updatedClockOutStatus,
        };
      });

      setUserShifts(itemsWithSerialNumber);
      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchUsersStatus();
  }, []);

  const fetchFilteredUsersStatus = async () => {
    // let endMonthDate = new Date(`${isMonthyear.isyear.value}-${isMonthyear.ismonth.value}-31`);
    // let startMonthDate = new Date(`${isMonthyear.isyear.value}-${isMonthyear.ismonth.value}-01`);
    // let endmonth = (mm == isMonthyear.ismonth.value && yyyy == isMonthyear.isyear.value) ? new Date(today) : endMonthDate;

    // const daysArray = [];
    // while (startMonthDate <= endmonth) {
    //     const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
    //     const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
    //     const dayCount = startMonthDate.getDate();
    //     daysArray.push({ formattedDate, dayName, dayCount });

    //     // Move to the next day
    //     startMonthDate.setDate(startMonthDate.getDate() + 1);
    // }

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
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: [...valueCompany],
        branch: [...valueBranch],
        unit: [...valueUnit],
        // department: [...valueDep],
        employee: [...valueEmp],
        userDates: daysArray,
        fromdate: filterUser.fromdate,
        // todate: filterUser.todate,
      });

      // setUserShifts(res?.data?.finaluser.filter(item => item !== null));
      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });

      let filtered = res?.data?.finaluser?.filter((d) => {
        const [day, month, year] = d.rowformattedDate.split("/");
        const formattedDate = new Date(`${year}-${month}-${day}`);

        const reasonDate = new Date(d.reasondate);
        const dojDate = new Date(d.doj);
        if (d.reasondate && d.reasondate != "") {
          return formattedDate <= reasonDate;
        } else if (d.doj && d.doj != "") {
          return formattedDate >= dojDate;
        } else {
          return d;
        }
      });

      let leaveresult = res_applyleave?.data?.applyleaves;

      let countByEmpcodeClockin = {}; // Object to store count for each empcode
      let countByEmpcodeClockout = {};

      const itemsWithSerialNumber = filtered?.map((item, index) => {
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
        const absentItems = filtered?.filter(
          (d) =>
            d.clockinstatus === "Absent" &&
            item.empcode === d.empcode &&
            d.clockin === "00:00:00" &&
            d.clockout === "00:00:00"
        );

        // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
        if (
          item.clockinstatus === "Week Off" &&
          item.clockoutstatus === "Week Off"
        ) {
          // Define the date format for comparison
          const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

          const isPreviousDayLeave = leaveresult.some(
            (leaveItem) =>
              moment(leaveItem.date, "DD/MM/YYYY").isSame(
                itemDate.clone().subtract(1, "days"),
                "day"
              ) && leaveItem.empcode === item.empcode
          );
          const isPreviousDayAbsent = absentItems.some((absentItem) =>
            moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(
              itemDate.clone().subtract(1, "days"),
              "day"
            )
          );

          const isNextDayLeave = leaveresult.some(
            (leaveItem) =>
              moment(leaveItem.date, "DD/MM/YYYY").isSame(
                itemDate.clone().add(1, "days"),
                "day"
              ) && leaveItem.empcode === item.empcode
          );
          const isNextDayAbsent = absentItems.some((absentItem) =>
            moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(
              itemDate.clone().add(1, "days"),
              "day"
            )
          );

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
          updatedClockInStatus = `${
            countByEmpcodeClockin[item.empcode]
          }Late - ClockIn`;
          countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
        }
        // Check if 'Early - ClockOut' count exceeds the specified limit
        if (updatedClockOutStatus === "Early - ClockOut") {
          updatedClockOutStatus = `${
            countByEmpcodeClockout[item.empcode]
          }Early - ClockOut`;
          countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
        }

        return {
          ...item,
          clockinstatus: updatedClockInStatus,
          clockoutstatus: updatedClockOutStatus,
        };
      });

      setUserShifts(itemsWithSerialNumber);
      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCompany.length !== 0) {
      if (selectedBranch.length === 0) {
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
      } else if (selectedUnit.length === 0) {
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
      // else if (selectedDep.length === 0) {
      //     setShowAlert(
      //         <>
      //             <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
      //             <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
      //         </>
      //     );
      //     handleClickOpenerr();
      // }
      else if (selectedEmp.length === 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Please Select Employee"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else if (filterUser.fromdate === "" && filterUser.todate === "") {
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
      } else {
        setLoader(false);
        fetchFilteredUsersStatus();
      }
    } else {
      if (filterUser.fromdate === "" && filterUser.todate === "") {
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
      } else {
        setLoader(false);
        fetchUsersStatus();
      }
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setLoader(false);
    setFilterUser({
      company: "Please Select Company",
      department: "Please Select Department",
      fromdate: today,
      todate: today,
    });
    // setBranches([]);
    // setUnits([]);
    setSelectedCompany([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedDep([]);
    setSelectedEmp([]);
    setValueBranch("");
    setValueUnit("");
    setValueDep("");
    setValueEmp("");
    setIsMonthYear({ ismonth: currentMonthObject, isyear: currentYearObject });
    setPage(1);
    let startMonthDate = new Date(today);
    let endMonthDate = new Date(today);

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
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        fromdate: filterUser.fromdate,
        // todate: filterUser.todate,
      });

      // setUserShifts(res?.data?.finaluser.filter(item => item !== null));
      let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String("Approved"),
      });

      let filtered = res?.data?.finaluser?.filter((d) => {
        const [day, month, year] = d.rowformattedDate.split("/");
        const formattedDate = new Date(`${year}-${month}-${day}`);

        const reasonDate = new Date(d.reasondate);
        const dojDate = new Date(d.doj);
        if (d.reasondate && d.reasondate != "") {
          return formattedDate <= reasonDate;
        } else if (d.doj && d.doj != "") {
          return formattedDate >= dojDate;
        } else {
          return d;
        }
      });

      let leaveresult = res_applyleave?.data?.applyleaves;

      let countByEmpcodeClockin = {}; // Object to store count for each empcode
      let countByEmpcodeClockout = {};

      const itemsWithSerialNumber = filtered?.map((item, index) => {
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
        const absentItems = filtered?.filter(
          (d) =>
            d.clockinstatus === "Absent" &&
            item.empcode === d.empcode &&
            d.clockin === "00:00:00" &&
            d.clockout === "00:00:00"
        );

        // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
        if (
          item.clockinstatus === "Week Off" &&
          item.clockoutstatus === "Week Off"
        ) {
          // Define the date format for comparison
          const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

          const isPreviousDayLeave = leaveresult.some(
            (leaveItem) =>
              moment(leaveItem.date, "DD/MM/YYYY").isSame(
                itemDate.clone().subtract(1, "days"),
                "day"
              ) && leaveItem.empcode === item.empcode
          );
          const isPreviousDayAbsent = absentItems.some((absentItem) =>
            moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(
              itemDate.clone().subtract(1, "days"),
              "day"
            )
          );

          const isNextDayLeave = leaveresult.some(
            (leaveItem) =>
              moment(leaveItem.date, "DD/MM/YYYY").isSame(
                itemDate.clone().add(1, "days"),
                "day"
              ) && leaveItem.empcode === item.empcode
          );
          const isNextDayAbsent = absentItems.some((absentItem) =>
            moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(
              itemDate.clone().add(1, "days"),
              "day"
            )
          );

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
          updatedClockInStatus = `${
            countByEmpcodeClockin[item.empcode]
          }Late - ClockIn`;
          countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
        }
        // Check if 'Early - ClockOut' count exceeds the specified limit
        if (updatedClockOutStatus === "Early - ClockOut") {
          updatedClockOutStatus = `${
            countByEmpcodeClockout[item.empcode]
          }Early - ClockOut`;
          countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
        }

        return {
          ...item,
          clockinstatus: updatedClockInStatus,
          clockoutstatus: updatedClockOutStatus,
        };
      });

      setUserShifts(itemsWithSerialNumber);
      setLoader(true);
    } catch (err) {
      setLoader(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleGetMonth = (e) => {
    const selectedMonthObject = months.find((d) => d.value === e);
    setIsMonthYear({ ...isMonthyear, ismonth: selectedMonthObject });
  };
  const handleGetYear = (e) => {
    const selectedYearObject = getyear.find((d) => d.value === e);
    setIsMonthYear({ ...isMonthyear, isyear: selectedYearObject });
  };

  const addSerialNumber = async () => {
    const itemsWithSerialNumber = userShifts.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [userShifts]);

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
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 110,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "shiftmode",
      headerName: "Shift Mode",
      flex: 0,
      width: 110,
      hide: !columnVisibility.shiftmode,
      headerClassName: "bold-header",
    },
    {
      field: "shift",
      headerName: "Shift",
      flex: 0,
      width: 150,
      hide: !columnVisibility.shift,
      headerClassName: "bold-header",
    },
    {
      field: "clockin",
      headerName: "ClockIn",
      flex: 0,
      width: 120,
      hide: !columnVisibility.clockin,
      headerClassName: "bold-header",
    },
    {
      field: "clockinstatus",
      headerName: "ClockInStatus",
      flex: 0,
      width: 130,
      hide: !columnVisibility.clockinstatus,
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
                padding:
                  params.row.clockinstatus === "BeforeWeekOffAbsent" ||
                  params.row.clockinstatus === "BeforeWeekOffLeave"
                    ? "3px 5px"
                    : "3px 8px",
                cursor: "default",
                color:
                  params.row.clockinstatus === "Present" ||
                  params.row.clockinstatus === "Early - ClockIn"
                    ? "black"
                    : params.row.clockinstatus === "Holiday"
                    ? "black"
                    : params.row.clockinstatus === "Leave"
                    ? "white"
                    : params.row.clockinstatus === "Absent"
                    ? "#462929"
                    : params.row.clockinstatus === "Week Off"
                    ? "white"
                    : params.row.clockinstatus === "Grace - ClockIn"
                    ? "#052106"
                    : params.row.clockinstatus === "On - Present"
                    ? "black"
                    : params.row.clockinstatus === "HBLOP"
                    ? "white"
                    : params.row.clockinstatus === "FLOP"
                    ? "white"
                    : params.row.clockinstatus === "AfterWeekOffAbsent" ||
                      params.row.clockinstatus === "AfterWeekOffLeave"
                    ? "black"
                    : params.row.clockinstatus === "BeforeWeekOffAbsent" ||
                      params.row.clockinstatus === "BeforeWeekOffLeave"
                    ? "black"
                    : params.row.clockinstatus === "Late - ClockIn"
                    ? "#15111d"
                    : "#15111d",
                backgroundColor:
                  params.row.clockinstatus === "Present" ||
                  params.row.clockinstatus === "Early - ClockIn"
                    ? "rgb(156 239 156)"
                    : params.row.clockinstatus === "Holiday"
                    ? "#B6FFFA"
                    : params.row.clockinstatus === "Leave"
                    ? "#1640D6"
                    : params.row.clockinstatus === "Absent"
                    ? "#ff00007d"
                    : params.row.clockinstatus === "Week Off"
                    ? "#6b777991"
                    : params.row.clockinstatus === "Grace - ClockIn"
                    ? "rgb(243 203 117)"
                    : params.row.clockinstatus === "On - Present"
                    ? "#E1AFD1"
                    : params.row.clockinstatus === "HBLOP"
                    ? "#DA0C81"
                    : params.row.clockinstatus === "FLOP"
                    ? "#FE0000"
                    : params.row.clockinstatus === "AfterWeekOffAbsent" ||
                      params.row.clockinstatus === "AfterWeekOffLeave"
                    ? "#F2D1D1"
                    : params.row.clockinstatus === "BeforeWeekOffAbsent" ||
                      params.row.clockinstatus === "BeforeWeekOffLeave"
                    ? "#EEE3CB"
                    : params.row.clockinstatus === "Late - ClockIn"
                    ? "#610c9f57"
                    : "rgb(243 203 117)",
                "&:hover": {
                  color:
                    params.row.clockinstatus === "Present" ||
                    params.row.clockinstatus === "Early - ClockIn"
                      ? "black"
                      : params.row.clockinstatus === "Holiday"
                      ? "black"
                      : params.row.clockinstatus === "Leave"
                      ? "white"
                      : params.row.clockinstatus === "Absent"
                      ? "#462929"
                      : params.row.clockinstatus === "Week Off"
                      ? "white"
                      : params.row.clockinstatus === "Grace - ClockIn"
                      ? "#052106"
                      : params.row.clockinstatus === "On - Present"
                      ? "black"
                      : params.row.clockinstatus === "HBLOP"
                      ? "white"
                      : params.row.clockinstatus === "FLOP"
                      ? "white"
                      : params.row.clockinstatus === "AfterWeekOffAbsent" ||
                        params.row.clockinstatus === "AfterWeekOffLeave"
                      ? "black"
                      : params.row.clockinstatus === "BeforeWeekOffAbsent" ||
                        params.row.clockinstatus === "BeforeWeekOffLeave"
                      ? "black"
                      : params.row.clockinstatus === "Late - ClockIn"
                      ? "#15111d"
                      : "#15111d",
                  backgroundColor:
                    params.row.clockinstatus === "Present" ||
                    params.row.clockinstatus === "Early - ClockIn"
                      ? "rgb(156 239 156)"
                      : params.row.clockinstatus === "Holiday"
                      ? "#B6FFFA"
                      : params.row.clockinstatus === "Leave"
                      ? "#1640D6"
                      : params.row.clockinstatus === "Absent"
                      ? "#ff00007d"
                      : params.row.clockinstatus === "Week Off"
                      ? "#6b777991"
                      : params.row.clockinstatus === "Grace - ClockIn"
                      ? "rgb(243 203 117)"
                      : params.row.clockinstatus === "On - Present"
                      ? "#E1AFD1"
                      : params.row.clockinstatus === "HBLOP"
                      ? "#DA0C81"
                      : params.row.clockinstatus === "FLOP"
                      ? "#FE0000"
                      : params.row.clockinstatus === "AfterWeekOffAbsent" ||
                        params.row.clockinstatus === "AfterWeekOffLeave"
                      ? "#F2D1D1"
                      : params.row.clockinstatus === "BeforeWeekOffAbsent" ||
                        params.row.clockinstatus === "BeforeWeekOffLeave"
                      ? "#EEE3CB"
                      : params.row.clockinstatus === "Late - ClockIn"
                      ? "#610c9f57"
                      : "rgb(243 203 117)",
                },
              }}
            >
              {params.row.clockinstatus}
            </Button>
          </Grid>
        );
      },
    },
    {
      field: "clockout",
      headerName: "ClockOut",
      flex: 0,
      width: 120,
      hide: !columnVisibility.clockout,
      headerClassName: "bold-header",
    },
    {
      field: "clockoutstatus",
      headerName: "ClockOutStatus",
      flex: 0,
      width: 130,
      hide: !columnVisibility.clockoutstatus,
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
                padding:
                  params.row.clockoutstatus === "BeforeWeekOffAbsent" ||
                  params.row.clockoutstatus === "BeforeWeekOffLeave"
                    ? "3px 5px"
                    : "3px 8px",
                cursor: "default",
                color:
                  params.row.clockoutstatus === "Holiday"
                    ? "black"
                    : params.row.clockoutstatus === "Leave"
                    ? "white"
                    : params.row.clockoutstatus === "Absent"
                    ? "#462929"
                    : params.row.clockoutstatus === "Week Off"
                    ? "white"
                    : params.row.clockoutstatus === "On - ClockOut"
                    ? "black"
                    : params.row.clockoutstatus === "Over - ClockOut"
                    ? "#052106"
                    : params.row.clockoutstatus === "Mis - ClockOut"
                    ? "#15111d"
                    : params.row.clockoutstatus === "Early - ClockOut"
                    ? "#052106"
                    : params.row.clockoutstatus === "HALOP"
                    ? "white"
                    : params.row.clockoutstatus === "FLOP"
                    ? "white"
                    : params.row.clockoutstatus === "AfterWeekOffAbsent" ||
                      params.row.clockoutstatus === "AfterWeekOffLeave"
                    ? "black"
                    : params.row.clockoutstatus === "BeforeWeekOffAbsent" ||
                      params.row.clockoutstatus === "BeforeWeekOffLeave"
                    ? "black"
                    : params.row.clockoutstatus === "Pending"
                    ? "#052106"
                    : "#052106",
                backgroundColor:
                  params.row.clockoutstatus === "Holiday"
                    ? "#B6FFFA"
                    : params.row.clockoutstatus === "Leave"
                    ? "#1640D6"
                    : params.row.clockoutstatus === "Absent"
                    ? "#ff00007d"
                    : params.row.clockoutstatus === "Week Off"
                    ? "#6b777991"
                    : params.row.clockoutstatus === "On - ClockOut"
                    ? "#E1AFD1"
                    : params.row.clockoutstatus === "Over - ClockOut"
                    ? "rgb(156 239 156)"
                    : params.row.clockoutstatus === "Mis - ClockOut"
                    ? "#610c9f57"
                    : params.row.clockoutstatus === "Early - ClockOut"
                    ? "rgb(243 203 117)"
                    : params.row.clockoutstatus === "HALOP"
                    ? "#DA0C81"
                    : params.row.clockoutstatus === "FLOP"
                    ? "#FE0000"
                    : params.row.clockoutstatus === "AfterWeekOffAbsent" ||
                      params.row.clockoutstatus === "AfterWeekOffLeave"
                    ? "#F2D1D1"
                    : params.row.clockoutstatus === "BeforeWeekOffAbsent" ||
                      params.row.clockoutstatus === "BeforeWeekOffLeave"
                    ? "#EEE3CB"
                    : params.row.clockoutstatus === "Pending"
                    ? "rgb(243 203 117)"
                    : "rgb(243 203 117)",
                "&:hover": {
                  color:
                    params.row.clockoutstatus === "Holiday"
                      ? "black"
                      : params.row.clockoutstatus === "Leave"
                      ? "white"
                      : params.row.clockoutstatus === "Absent"
                      ? "#462929"
                      : params.row.clockoutstatus === "Week Off"
                      ? "white"
                      : params.row.clockoutstatus === "On - ClockOut"
                      ? "black"
                      : params.row.clockoutstatus === "Over - ClockOut"
                      ? "#052106"
                      : params.row.clockoutstatus === "Mis - ClockOut"
                      ? "#15111d"
                      : params.row.clockoutstatus === "Early - ClockOut"
                      ? "#052106"
                      : params.row.clockoutstatus === "HALOP"
                      ? "white"
                      : params.row.clockoutstatus === "FLOP"
                      ? "white"
                      : params.row.clockoutstatus === "AfterWeekOffAbsent" ||
                        params.row.clockoutstatus === "AfterWeekOffLeave"
                      ? "black"
                      : params.row.clockoutstatus === "BeforeWeekOffAbsent" ||
                        params.row.clockoutstatus === "BeforeWeekOffLeave"
                      ? "black"
                      : params.row.clockoutstatus === "Pending"
                      ? "#052106"
                      : "#052106",
                  backgroundColor:
                    params.row.clockoutstatus === "Holiday"
                      ? "#B6FFFA"
                      : params.row.clockoutstatus === "Leave"
                      ? "#1640D6"
                      : params.row.clockoutstatus === "Absent"
                      ? "#ff00007d"
                      : params.row.clockoutstatus === "Week Off"
                      ? "#6b777991"
                      : params.row.clockoutstatus === "On - ClockOut"
                      ? "#E1AFD1"
                      : params.row.clockoutstatus === "Over - ClockOut"
                      ? "rgb(156 239 156)"
                      : params.row.clockoutstatus === "Mis - ClockOut"
                      ? "#610c9f57"
                      : params.row.clockoutstatus === "Early - ClockOut"
                      ? "rgb(243 203 117)"
                      : params.row.clockoutstatus === "HALOP"
                      ? "#DA0C81"
                      : params.row.clockoutstatus === "FLOP"
                      ? "#FE0000"
                      : params.row.clockoutstatus === "AfterWeekOffAbsent" ||
                        params.row.clockoutstatus === "AfterWeekOffLeave"
                      ? "#F2D1D1"
                      : params.row.clockoutstatus === "BeforeWeekOffAbsent" ||
                        params.row.clockoutstatus === "BeforeWeekOffLeave"
                      ? "#EEE3CB"
                      : params.row.clockoutstatus === "Pending"
                      ? "rgb(243 203 117)"
                      : "rgb(243 203 117)",
                },
              }}
            >
              {params.row.clockoutstatus}
            </Button>
          </Grid>
        );
      },
    },
    {
      field: "attendanceauto",
      headerName: "Attendance",
      flex: 0,
      width: 130,
      hide: !columnVisibility.attendanceauto,
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
                "&:hover": {
                  backgroundColor: "rgb(156 239 156)",
                  color: "#052106",
                },
              }}
            >
              {params.row.attendanceauto}
            </Button>
          </Grid>
        );
      },
    },
    {
      field: "daystatus",
      headerName: "Day Status",
      flex: 0,
      width: 130,
      hide: !columnVisibility.daystatus,
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
                "&:hover": {
                  backgroundColor: "rgb(156 239 156)",
                  color: "#052106",
                },
              }}
            >
              {params.row.daystatus}
            </Button>
          </Grid>
        );
      },
    },
    {
      field: "appliedthrough",
      headerName: "Applied Through",
      flex: 0,
      width: 120,
      hide: !columnVisibility.appliedthrough,
      headerClassName: "bold-header",
    },
    {
      field: "lopcalculation",
      headerName: "LOP Calculation",
      flex: 0,
      width: 120,
      hide: !columnVisibility.lopcalculation,
      headerClassName: "bold-header",
    },
    {
      field: "modetarget",
      headerName: "Target",
      flex: 0,
      width: 120,
      hide: !columnVisibility.modetarget,
      headerClassName: "bold-header",
    },
    {
      field: "paidpresent",
      headerName: "Paid Present",
      flex: 0,
      width: 120,
      hide: !columnVisibility.paidpresent,
      headerClassName: "bold-header",
    },
    {
      field: "lopday",
      headerName: "LOP Day",
      flex: 0,
      width: 120,
      hide: !columnVisibility.lopday,
      headerClassName: "bold-header",
    },
    {
      field: "paidpresentday",
      headerName: "Paid Present Day",
      flex: 0,
      width: 120,
      hide: !columnVisibility.paidpresentday,
      headerClassName: "bold-header",
    },
  ];

  const rowDataTable = items?.flatMap((item, index) => {
    return {
      id: item.id,
      uniqueid: item.id,
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
      date: item.date,
      shiftmode: item.shiftMode,
      clockin: item.clockin,
      clockinstatus: item.clockinstatus,
      lateclockincount: item.lateclockincount,
      earlyclockoutcount: item.earlyclockoutcount,
      clockout: item.clockout,
      clockoutstatus: item.clockoutstatus,
      attendanceauto: getattendancestatus(item),
      daystatus: item.attendanceautostatus
        ? item.attendanceautostatus
        : getattendancestatus(item),
      appliedthrough: getAttModeAppliedThr(
        item.attendanceautostatus
          ? item.attendanceautostatus
          : getattendancestatus(item)
      ),
      lop: getAttModeLop(
        item.attendanceautostatus
          ? item.attendanceautostatus
          : getattendancestatus(item)
      ),
      loptype: getAttModeLopType(
        item.attendanceautostatus
          ? item.attendanceautostatus
          : getattendancestatus(item)
      ),
      lopcalculation: getFinalLop(
        getAttModeLop(
          item.attendanceautostatus
            ? item.attendanceautostatus
            : getattendancestatus(item)
        ),
        getAttModeLopType(
          item.attendanceautostatus
            ? item.attendanceautostatus
            : getattendancestatus(item)
        )
      ),
      modetarget: getAttModeTarget(
        item.attendanceautostatus
          ? item.attendanceautostatus
          : getattendancestatus(item)
      ),
      paidpresentbefore: getAttModePaidPresent(
        item.attendanceautostatus
          ? item.attendanceautostatus
          : getattendancestatus(item)
      ),
      paidleavetype: getAttModePaidPresentType(
        item.attendanceautostatus
          ? item.attendanceautostatus
          : getattendancestatus(item)
      ),
      paidpresent: getFinalPaid(
        getAttModePaidPresent(
          item.attendanceautostatus
            ? item.attendanceautostatus
            : getattendancestatus(item)
        ),
        getAttModePaidPresentType(
          item.attendanceautostatus
            ? item.attendanceautostatus
            : getattendancestatus(item)
        )
      ),
      lopday: getAssignLeaveDayForLop(
        getFinalLop(
          getAttModeLop(
            item.attendanceautostatus
              ? item.attendanceautostatus
              : getattendancestatus(item)
          ),
          getAttModeLopType(
            item.attendanceautostatus
              ? item.attendanceautostatus
              : getattendancestatus(item)
          )
        )
      ),
      paidpresentday: getAssignLeaveDayForPaid(
        getFinalPaid(
          getAttModePaidPresent(
            item.attendanceautostatus
              ? item.attendanceautostatus
              : getattendancestatus(item)
          ),
          getAttModePaidPresentType(
            item.attendanceautostatus
              ? item.attendanceautostatus
              : getattendancestatus(item)
          )
        )
      ),
    };
  });

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

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibility");
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

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
  const fileName = "Attendance Absent Report";
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
        filteredData?.map((t, index) => ({
          SNo: index + 1,
          "Emp Code": t.empcode,
          "Employee Name": t.username,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Department: t.department,
          Date: t.date,
          "Shift Mode": t.shiftmode,
          Shift: t.shift,
          ClockIn: t.clockin,
          ClockInStatus: t.clockinstatus,
          ClockOut: t.clockout,
          ClockOutStatus: t.clockoutstatus,
          Attendance: t.attendanceauto,
          "Day Status": t.daystatus,
          "Applied Through": t.appliedthrough,
          "LOP Calculation": t.lopcalculation,
          Target: t.modetarget,
          "Paid Present": t.paidpresent,
          "LOP Day": t.lopday,
          "Paid Present Day": t.paidpresentday,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        rowDataTable.map((t, index) => ({
          SNo: index + 1,
          "Emp Code": t.empcode,
          "Employee Name": t.username,
          Company: t.company,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          Department: t.department,
          Date: t.date,
          "Shift Mode": t.shiftmode,
          Shift: t.shift,
          ClockIn: t.clockin,
          ClockInStatus: t.clockinstatus,
          ClockOut: t.clockout,
          ClockOutStatus: t.clockoutstatus,
          Attendance: t.attendanceauto,
          "Day Status": t.daystatus,
          "Applied Through": t.appliedthrough,
          "LOP Calculation": t.lopcalculation,
          Target: t.modetarget,
          "Paid Present": t.paidpresent,
          "LOP Day": t.lopday,
          "Paid Present Day": t.paidpresentday,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendance Absent Report",
    pageStyle: "print",
  });

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF({ oriantation: "landscape" });

    const headers = [
      "SNo",
      "Emp Code",
      "Employee Name",
      "Company",
      "Branch",
      "Unit",
      "Team",
      "Department",
      "Date",
      "Shift Mode",
      "Shift",
      "ClockIn",
      "ClockInStatus",
      "ClockOut",
      "ClockOutStatus",
      "Attendance",
      "Day Status",
      "Applied Through",
      "LOP Calculation",
      "Target",
      "Paid Present",
      "LOP Day",
      "Paid Present Day",
    ];

    let data = [];
    // Add a serial number to each row
    if (isfilter === "filtered") {
      data = filteredData.map((item, index) => {
        return [
          index + 1,
          item.empcode,
          item.username,
          item.company,
          item.branch,
          item.unit,
          item.team,
          item.department,
          item.date,
          item.shiftmode,
          item.shift,
          item.clockin,
          item.clockinstatus,
          item.clockout,
          item.clockoutstatus,
          item.attendanceauto,
          item.daystatus,
          item.appliedthrough,
          item.lopcalculation,
          item.modetarget,
          item.paidpresent,
          item.lopday,
          item.paidpresentday,
        ];
      });
    } else {
      data = rowDataTable.map((item, index) => {
        return [
          index + 1,
          item.empcode,
          item.username,
          item.company,
          item.branch,
          item.unit,
          item.team,
          item.department,
          item.date,
          item.shiftmode,
          item.shift,
          item.clockin,
          item.clockinstatus,
          item.clockout,
          item.clockoutstatus,
          item.attendanceauto,
          item.daystatus,
          item.appliedthrough,
          item.lopcalculation,
          item.modetarget,
          item.paidpresent,
          item.lopday,
          item.paidpresentday,
        ];
      });
    }

    // Split data into chunks to fit on pages
    const columnsPerSheet = 10; // Number of columns per sheet
    const chunks = [];

    for (let i = 0; i < headers.length; i += columnsPerSheet) {
      const chunkHeaders = headers.slice(i, i + columnsPerSheet);
      const chunkData = data.map((row) =>
        row.slice(i, i + columnsPerSheet + 1)
      );

      chunks.push({ headers: chunkHeaders, data: chunkData });
    }

    chunks.forEach((chunk, index) => {
      if (index > 0) {
        doc.addPage({ orientation: "landscape" }); // Add a new landscape page for each chunk, except the first one
      }

      doc.autoTable({
        theme: "grid",
        styles: { fontSize: 8 },
        head: [chunk.headers],
        body: chunk.data,
        startY: 20, // Adjust startY to leave space for headers
        margin: { top: 20, left: 10, right: 10, bottom: 10 }, // Adjust margin as needed
      });
    });

    doc.save("Attendance Absent Report.pdf");
  };

  // image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Attendance Absent Report.png");
        });
      });
    }
  };

  return (
    <Box>
      <Headtitle title={"ATTENDANCE ABSENT REPORT"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        Attendance Absent Report
      </Typography>
      {isUserRoleCompare?.includes("lusershiftroaster") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
                    {/* <Selects
                                            styles={colourStyles}
                                            options={companies}
                                            value={{ label: filterUser.company, value: filterUser.company }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, company: e.value });
                                                setSelectedBranch([]);
                                                setSelectedUnit([]);
                                                setValueBranch("");
                                                setValueUnit("");
                                            }}
                                        /> */}
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
                      value={selectedCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                        setFilterUser({
                          ...filterUser,
                          department: "Please Select Department",
                        });
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Branch<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    {/* <Selects
                                            styles={colourStyles}
                                            options={branches}
                                            value={{ label: filterUser.branch, value: filterUser.branch }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, branch: e.value, unit: 'Please Select Unit' });
                                                fetchUnit(e.value);
                                            }}
                                        /> */}
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter((comp) => valueCompany?.includes(comp.company))
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
                      value={selectedBranch}
                      onChange={(e) => {
                        handleBranchChangeFrom(e);
                        setFilterUser({
                          ...filterUser,
                          department: "Please Select Department",
                        });
                      }}
                      valueRenderer={customValueRendererBranchFrom}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      Unit<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    {/* <Selects
                                            styles={colourStyles}
                                            options={units}
                                            value={{ label: filterUser.unit, value: filterUser.unit }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, unit: e.value, });
                                            }}
                                        /> */}
                    <MultiSelect
                      options={isAssignBranch
                        ?.filter(
                          (comp) =>
                            valueCompany?.includes(comp.company) &&
                            valueBranch?.includes(comp.branch)
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
                      value={selectedUnit}
                      onChange={(e) => {
                        handleUnitChangeFrom(e);
                        setFilterUser({
                          ...filterUser,
                          department: "Please Select Department",
                        });
                      }}
                      valueRenderer={customValueRendererUnitFrom}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Department<b style={{ color: "red" }}>*</b> </Typography> */}
                {/* <Selects
                                            styles={colourStyles}
                                            options={departments}
                                            value={{ label: filterUser.department, value: filterUser.department }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, department: e.value, });
                                                setSelectedEmp([]);
                                                setValueEmp("");
                                                setEmployees([]);
                                                fetchEmployee(e.value);
                                            }}
                                        /> */}
                {/* <MultiSelect
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
                                </Grid> */}
                <Grid
                  item
                  md={3}
                  sm={12}
                  xs={12}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      // options={employees}
                      options={employees
                        ?.filter(
                          (comp) =>
                            valueCompany?.includes(comp.company) &&
                            valueBranch?.includes(comp.branch) &&
                            valueUnit?.includes(comp.unit)
                          // && valueDep?.includes(comp.department)
                        )
                        ?.map((data) => ({
                          label: data.companyname,
                          value: data.companyname,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedEmp}
                      onChange={(e) => {
                        handleEmployeeChange(e);
                      }}
                      valueRenderer={customValueRendererEmp}
                      labelledBy="Please Select Employee"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  {/* <FormControl fullWidth size="small">
                                        <Typography>Select Month</Typography>
                                        <Selects
                                            maxMenuHeight={200}
                                            styles={colourStyles}
                                            options={months}
                                            value={isMonthyear.ismonth}
                                            onChange={(e) => handleGetMonth(e.value)}
                                        />
                                    </FormControl> */}
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      From Date<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={filterUser.fromdate}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        // Ensure that the selected date is not in the future
                        const currentDate = new Date()
                          .toISOString()
                          .split("T")[0];
                        if (selectedDate <= currentDate) {
                          setFilterUser({
                            ...filterUser,
                            fromdate: selectedDate,
                            todate: selectedDate,
                          });
                        } else {
                          // Handle the case where the selected date is in the future (optional)
                          // You may choose to show a message or take other actions.
                        }
                      }}
                      // Set the max attribute to the current date
                      inputProps={{
                        max: new Date().toISOString().split("T")[0],
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  {/* <FormControl fullWidth size="small">
                                        <Typography> Select Year</Typography>
                                        <Selects
                                            maxMenuHeight={200}
                                            styles={colourStyles}
                                            options={getyear}
                                            value={isMonthyear.isyear}
                                            onChange={(e) => handleGetYear(e.value)}
                                        />
                                    </FormControl> */}
                  <FormControl fullWidth size="small">
                    <Typography>
                      {" "}
                      To Date<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={filterUser.todate}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        // Ensure that the selected date is not in the future
                        const currentDate = new Date()
                          .toISOString()
                          .split("T")[0];
                        const fromdateval =
                          filterUser.fromdate != "" &&
                          new Date(filterUser.fromdate)
                            .toISOString()
                            .split("T")[0];
                        if (filterUser.fromdate == "") {
                          setShowAlert(
                            <>
                              <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                              />
                              <p
                                style={{ fontSize: "20px", fontWeight: 900 }}
                              >{`Please Select From date`}</p>
                            </>
                          );
                          handleClickOpenerr();
                        } else if (selectedDate < fromdateval) {
                          setFilterUser({ ...filterUser, todate: "" });
                          setShowAlert(
                            <>
                              <ErrorOutlineOutlinedIcon
                                sx={{ fontSize: "100px", color: "orange" }}
                              />
                              <p
                                style={{ fontSize: "20px", fontWeight: 900 }}
                              >{`To Date should be after or equal to From Date`}</p>
                            </>
                          );
                          handleClickOpenerr();
                        } else if (selectedDate <= currentDate) {
                          setFilterUser({
                            ...filterUser,
                            todate: selectedDate,
                          });
                        } else {
                        }
                      }}
                      // Set the max attribute to the current date
                      inputProps={{
                        max: new Date().toISOString().split("T")[0],
                        min:
                          filterUser.fromdate !== ""
                            ? filterUser.fromdate
                            : null,
                      }}
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
          {!loader ? (
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
                    Attendance Absent Report{" "}
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
                        {/* <MenuItem value={rowDataTable?.length}>  All </MenuItem> */}
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
                      {isUserRoleCompare?.includes("excelusershiftroaster") && (
                        <>
                          {/* <ExportXL csvData={filteredData?.map((t, index) => ({
                                                        'SNo': t.serialNumber,
                                                        'Emp Code': t.empcode,
                                                        'Employee Name': t.username,
                                                        'Company': t.company,
                                                        'Branch': t.branch,
                                                        'Unit': t.unit,
                                                        'Team': t.team,
                                                        'Department': t.department,
                                                        'Date': t.date,
                                                        'Shift': t.shift,
                                                        'ClockIn': t.clockin,
                                                        'ClockInStatus': t.clockinstatus,
                                                        'ClockOut': t.clockout,
                                                        'ClockOutStatus': t.clockoutstatus,
                                                        'Attendance': t.attendanceauto,
                                                        'Day Status': t.daystatus,
                                                        'Applied Through': t.appliedthrough,
                                                        'LOP Calculation': t.lopcalculation,
                                                        'Target': t.modetarget,
                                                        'Paid Present': t.paidpresent,
                                                        'LOP Day': t.lopday,
                                                        'Paid Present Day': t.paidpresentday,
                                                    }))} fileName={"Attendance Absent Report"} /> */}
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              // fetchUsersStatus()
                              setFormat("xl");
                            }}
                            sx={userStyle.buttongrp}
                          >
                            <FaFileExcel />
                            &ensp;Export to Excel&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("csvusershiftroaster") && (
                        <>
                          {/* <ExportCSV csvData={filteredData?.map((t, index) => ({
                                                        'SNo': t.serialNumber,
                                                        'Emp Code': t.empcode,
                                                        'Employee Name': t.username,
                                                        'Company': t.company,
                                                        'Branch': t.branch,
                                                        'Unit': t.unit,
                                                        'Team': t.team,
                                                        'Department': t.department,
                                                        'Date': t.date,
                                                        'Shift': t.shift,
                                                        'ClockIn': t.clockin,
                                                        'ClockInStatus': t.clockinstatus,
                                                        'ClockOut': t.clockout,
                                                        'ClockOutStatus': t.clockoutstatus,
                                                        'Attendance': t.attendanceauto,
                                                        'Day Status': t.daystatus,
                                                        'Applied Through': t.appliedthrough,
                                                        'LOP Calculation': t.lopcalculation,
                                                        'Target': t.modetarget,
                                                        'Paid Present': t.paidpresent,
                                                        'LOP Day': t.lopday,
                                                        'Paid Present Day': t.paidpresentday,
                                                    }))} fileName={"Attendance Absent Report"} /> */}
                          <Button
                            onClick={(e) => {
                              setIsFilterOpen(true);
                              // fetchUsersStatus()
                              setFormat("csv");
                            }}
                            sx={userStyle.buttongrp}
                          >
                            <FaFileCsv />
                            &ensp;Export to CSV&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("printusershiftroaster") && (
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
                      {isUserRoleCompare?.includes("pdfusershiftroaster") && (
                        <>
                          {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}  > <FaFilePdf /> &ensp;Export to PDF&ensp; </Button> */}
                          <Button
                            sx={userStyle.buttongrp}
                            onClick={() => {
                              setIsPdfFilterOpen(true);
                              // fetchUsersStatus()
                            }}
                          >
                            <FaFilePdf />
                            &ensp;Export to PDF&ensp;
                          </Button>
                        </>
                      )}
                      {isUserRoleCompare?.includes("imageusershiftroaster") && (
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
              <TableCell>Team</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Shift Mode</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>ClockIn</TableCell>
              <TableCell>ClockInStatus</TableCell>
              <TableCell>ClockOut</TableCell>
              <TableCell>ClockOutStatus</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Day Status</TableCell>
              <TableCell>Applied Through</TableCell>
              <TableCell>LOP Calculation</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Paid Present</TableCell>
              <TableCell>LOP Day</TableCell>
              <TableCell>Paid Present Day</TableCell>
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
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.shiftmode}</TableCell>
                  <TableCell>{row.shift}</TableCell>
                  <TableCell>{row.clockin}</TableCell>
                  <TableCell>{row.clockinstatus}</TableCell>
                  <TableCell>{row.clockout}</TableCell>
                  <TableCell>{row.clockoutstatus}</TableCell>
                  <TableCell>{row.attendanceauto}</TableCell>
                  <TableCell>{row.daystatus}</TableCell>
                  <TableCell>{row.appliedthrough}</TableCell>
                  <TableCell>{row.lopcalculation}</TableCell>
                  <TableCell>{row.modetarget}</TableCell>
                  <TableCell>{row.paidpresent}</TableCell>
                  <TableCell>{row.lopday}</TableCell>
                  <TableCell>{row.paidpresentday}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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

          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
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
              // fetchUsersStatus()
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

export default AttendanceAbsentReport;
