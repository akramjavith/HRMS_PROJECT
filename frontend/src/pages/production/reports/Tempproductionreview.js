import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, InputAdornment, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Avatar from "@mui/material/Avatar";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { handleApiError } from "../../../components/Errorhandling";
import StyledDataGrid from "../../../components/TableStyle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Chip from "@mui/material/Chip";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import * as XLSX from "xlsx";

function ListProductionPoints() {
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");

  const [clientUserIDArray, setClientUserIDArray] = useState([]);
  const { isUserRoleCompare, isAssignBranch, allCompany, allBranch, allUnit, allTeam } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);

  // Multiselectdropdowns
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);

  // Multiselectdropdowns
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const [pointsFilter, setPointsFilter] = useState({ fromdate: today, todate: today, greater: "", less: "", betweenfrom: "", betweento: "", compare: "All" });

  const compares = [
    { label: "Below Minimum Points", value: "Below Minimum Points" },
    { label: "Below Target Points", value: "Below Target Points" },
    { label: "Less than", value: "Less than" },
    { label: "Greater than", value: "Greater than" },
    { label: "Between", value: "Between" },
    { label: "All", value: "All" },
  ];

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    name: true,
    empcode: true,
    companyname: true,
    branch: true,
    unit: true,
    team: true,
    date: true,
    target: true,
    point: true,
    daypoint: true,
    avgpoint: true,
    mindiff: true,
    tardiff: true,
    startDate: true,
    endDate: true,
    minreached: true,
    daystatus: true,
    status: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Manage Columns
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

  //get all client user id.
  const fetchProductionLists = async () => {
    try {
      setLoader(true);

      let res_freq = await axios.post(SERVICE.TEMP_DAY_POINTS_DATAS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        fromdate: String(pointsFilter.fromdate),
        todate: String(pointsFilter.todate),
      });

      setClientUserIDArray(res_freq?.data?.productionupload);

      setLoader(false);
    } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); } finally {
      setLoader(false);
    }
  };

  const fetchEmployee = async () => {
    try {
      let res_min = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setEmployees(res_min.data.users);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchTeamAll = async () => {
    try {
      let res_min = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setTeams(res_min.data.teamsdetails);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const fetchTeamAlls = async (e) => {
    // let unitArr = e.map(data => data.name)

    try {
      let res_location = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let teamsOptfirstthree = res_location?.data?.teamsdetails.map(data => data.teamname).map((name) => ({
        label: name,
        value: name,
      }));
      setSelectedTeam(teamsOptfirstthree)

    } catch (err) {
      console.log(err, "error014");
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"something went wrong!"}
            </p>{" "}
          </>
        );
        handleClickOpenerr();
      }

    }
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

    // Remove duplicates based on the 'company' field


    const company = [...new Set(uniqueIsAssignBranch.map(data => data.company))].map((data) => ({
      label: data,
      value: data,
    }));

    setSelectedCompany(company);

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



  }, [isAssignBranch])


  const handleSubmit = (e) => {
    e.preventDefault();

    if (pointsFilter.fromdate === "" && pointsFilter.todate === "" && pointsFilter.compare === "" && selectedCompany.length === 0 && selectedBranch.length === 0 && selectedUnit.length === 0 && selectedTeam.length === 0 && selectedEmployee.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select any filter"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (pointsFilter.compare === "Less than" && pointsFilter.less == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter a Value"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (pointsFilter.compare === "Greater than" && pointsFilter.greater == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter a Value"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (pointsFilter.compare === "Between" && (pointsFilter.betweenfrom == "" || pointsFilter.betweento === "")) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter a Value"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (selectedEmployee.length === 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      handleFilter();
    }
  };
  const handleClear = async (e) => {
    setLoader(true);

    setSelectedEmployee([]);
    setSelectedCompany([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);

    setPointsFilter({ ...pointsFilter, fromdate: today, todate: today, less: "", greater: "", betweenfrom: "", betweento: "", compare: "All" });

    let res_freq = await axios.post(SERVICE.TEMP_DAY_POINTS_DATAS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      fromdate: String(today),
      todate: String(today),
    });

    setClientUserIDArray(res_freq.data.productionupload);

    setLoader(false);
  };

  //multiselect onchange
  //Company multiselect dropdown changes
  const handleCompanyChange = (options) => {
    setSelectedCompany(options);
    setSelectedBranch([]);
    setSelectedEmployee([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
  };
  const customValueRendererCompany = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Company";
  };

  //branch multiselect dropdown changes
  const handleBranchChange = (options) => {
    setSelectedBranch(options);
    setSelectedEmployee([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
  };
  const customValueRendererBranch = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Branch";
  };

  //unit multiselect dropdown changes
  const handleUnitChange = (options) => {
    setSelectedUnit(options);
    fetchTeamAll(options)

    setSelectedEmployee([]);
    setSelectedTeam([]);
  };
  const customValueRendererUnit = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Unit";
  };

  //Team multiselect dropdown changes
  const handleTeamChange = (options) => {
    setSelectedTeam(options);
    setSelectedEmployee([]);
  };
  const customValueRendererTeam = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Team";
  };

  //employee multiselect dropdown changes
  const handleEmployeeChange = (options) => {
    setSelectedEmployee(options);
  };
  const customValueRendererEmployee = (valueCate, _employeename) => {
    return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please select Employee";
  };

  const handleFilter = async () => {
    try {
      setLoader(true);

      let res = await axios.post(SERVICE.TEMP_DAY_POINTS_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        fromdate: pointsFilter.fromdate,
        todate: pointsFilter.todate,
        less: Number(pointsFilter.less),
        greater: Number(pointsFilter.greater),
        betweenfrom: Number(pointsFilter.betweenfrom),
        betweento: Number(pointsFilter.betweento),
        compare: pointsFilter.compare,
        company: selectedCompany.map((item) => item.value),
        branch: selectedBranch.map((item) => item.value),
        unit: selectedUnit.map((item) => item.value),
        team: selectedTeam.map((item) => item.value),
        empnames: selectedEmployee.map((item) => item.value),
      });

      setClientUserIDArray(res.data);
      setPage(1);
      setLoader(false);
    } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };

  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ListProductionPoints.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Employee Code", field: "empcode" },
    { title: "Employee Name", field: "name" },
    { title: "Branch", field: "branch" },
    { title: "Company Name", field: "companyname" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "From Date", field: "startDate" },
    { title: "To Date", field: "endDate" },
    { title: "Min Points", field: "daypoint" },
    { title: "Target", field: "target" },
    { title: "Points", field: "point" },
    { title: "Avg Point", field: "avgpoint" },
    { title: "Min Diff", field: "mindiff" },
    { title: "Tar Diff", field: "tardiff" },
    { title: "Status", field: "status" },
    ...(pointsFilter.fromdate === pointsFilter.todate
      ? [
        { title: "Day Status", field: "daystatus" },
      ]
      : []),
  ];
  //  pdf download functionality
  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 6,
        cellWidth: "auto",
      },
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: rowDataTable,
    });
    doc.save("List Temp Production Points.pdf");
  };
  // Excel
  const fileName = "List Temp Production Points";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "List Temp Production Points",
    pageStyle: "print",
  });

  //serial no for listing items
  // const addSerialNumber = async () => {
  //   const itemsWithSerialNumber = clientUserIDArray?.map((item, index) => {
  //     let status = "";
  //     if (Number(item.point) < Number(item.daypoint)) {
  //       status = "Below Min Points";
  //     } else if (item.avgpoint <= 50) {
  //       status = "Below 50%";
  //     } else if (item.avgpoint > 50 && item.avgpoint <= 75) {
  //       status = "Between 51 - 75%";
  //     } else if (item.avgpoint > 75 && item.avgpoint <= 100) {
  //       status = "Between 76 - 100%";
  //     } else if (item.avgpoint > 100 && item.avgpoint <= 149) {
  //       status = "Between 101 - 149%";
  //     } else if (item.avgpoint > 149) {
  //       status = "150% and Above";
  //     }

  //     // let status =
  //     let mindiffval = Number(item.point) - Number(item.daypoint);
  //     let tardiffval = Number(item.point) - Number(item.target);

  //     return {
  //       ...item,
  //       serialNumber: index + 1,
  //       production: String(item.production),
  //       manual: String(item.manual),
  //       nonproduction: String(item.nonproduction),
  //       point: String(item.point),
  //       allowancepoint: String(item.allowancepoint),
  //       nonallowancepoint: String(item.nonallowancepoint),
  //       avgpoint: item.avgpoint,
  //       daypoint: item.daypoint ? Number(item.daypoint) : "",
  //       mindiff: item.daypoint && item.point ? mindiffval.toFixed(3) : "",
  //       tardiff: item.target && item.point ? tardiffval.toFixed(3) : "",
  //       status: item.target == 0 ? " " : status,
  //       startDate: moment(item.startDate).format("DD-MM-YYYY"),
  //       endDate: moment(item.endDate).format("DD-MM-YYYY"),
  //       minreached: Number(item.point) < Number(item.daypoint) ? "Not Reached" : "Reached",
  //     };
  //   });
  //   setItems(itemsWithSerialNumber);
  // };
  //serial no for listing items
  const addSerialNumber = async () => {
    console.log(clientUserIDArray, "clientUserIDArray")
    const itemsWithSerialNumber = clientUserIDArray?.map((item, index) => {
      let status = "";
      if (Number(item.point) < Number(item.daypoint)) {
        status = "Below Min Points";
      } else if (item.avgpoint <= 50) {
        status = "Below 50%";
      } else if (item.avgpoint > 50 && item.avgpoint <= 75) {
        status = "Between 51 - 75%";
      } else if (item.avgpoint > 75 && item.avgpoint <= 100) {
        status = "Between 76 - 100%";
      } else if (item.avgpoint > 100 && item.avgpoint <= 149) {
        status = "Between 101 - 149%";
      } else if (item.avgpoint > 149) {
        status = "150% and Above";
      }

      let mindiffval = Number(item.point) - Number(item.daypoint);
      let tardiffval = Number(item.point) - Number(item.target);
      return {
        ...item,
        serialNumber: index + 1,
        production: String(item.production),
        manual: String(item.manual),
        nonproduction: String(item.nonproduction),
        point: Number(item.point).toFixed(2),
        allowancepoint: String(item.allowancepoint),
        nonallowancepoint: String(item.nonallowancepoint),
        avgpoint: Number(item.avgpoint).toFixed(2),
        daypoint: item.daypoint ? Number(item.daypoint).toFixed(2) : "",
        mindiff: item.daypoint ? mindiffval <= 0 ? mindiffval.toFixed(2) : ("+" + mindiffval.toFixed(2)) : "",
        tardiff: item.target ? tardiffval <= 0 ? tardiffval.toFixed(2) : ("+" + tardiffval.toFixed(2)) : "",
        status: item.target == 0 ? " " : status,
        oldstartdate: item.startDate,
        oldenddate: item.endDate,
        startDate: moment(item.startDate).format("DD-MM-YYYY"),
        endDate: moment(item.endDate).format("DD-MM-YYYY"),
        minreached: Number(item.point) < Number(item.daypoint) ? "Not Reached" : "Reached"
      }
    })

    console.log(itemsWithSerialNumber, "itemsWithSerialNumber")
    let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`
      }
    });


    let startMonthDate = new Date(pointsFilter.fromdate);
    let endMonthDate = new Date(pointsFilter.fromdate);
    console.log(startMonthDate, endMonthDate)

    const daysArray = [];

    while (startMonthDate <= endMonthDate) {
      const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
      const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayCount = startMonthDate.getDate();
      const shiftMode = 'Main Shift';
      const weekNumberInMonth = (getWeekNumberInMonth(startMonthDate) === 1 ? `${getWeekNumberInMonth(startMonthDate)}st Week` :
        getWeekNumberInMonth(startMonthDate) === 2 ? `${getWeekNumberInMonth(startMonthDate)}nd Week` :
          getWeekNumberInMonth(startMonthDate) === 3 ? `${getWeekNumberInMonth(startMonthDate)}rd Week` :
            getWeekNumberInMonth(startMonthDate) > 3 ? `${getWeekNumberInMonth(startMonthDate)}th Week` : '')

      daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

      // Move to the next day
      startMonthDate.setDate(startMonthDate.getDate() + 1);
    }
    console.log(daysArray, "daysArray")


    let res = await axios.post(SERVICE.GET_WEEOFF_DAYS_FORUSER_ATTENDANCE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empname: selectedEmployee.map((item) => item.value),
      empcode: selectedEmployee.map((item) => item.empcode),
      username: selectedEmployee.map((item) => item.username),
      company: selectedCompany.map((item) => item.value),
      branch: selectedBranch.map((item) => item.value),
      unit: selectedUnit.map((item) => item.value),
      team: selectedTeam.map((item) => item.value),
      userDates: daysArray,
      deptQuery: {},
      fromdate: pointsFilter.fromdate ? pointsFilter.fromdate : "",
    });

    let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      status: String("Approved"),
    });
    console.log(res?.data?.finaluser, "finalusdfjiwoerj")
    let filtered = res?.data?.finaluser?.filter(d => {
      const [day, month, year] = d.rowformattedDate.split("/");
      const formattedDate = new Date(`${year}-${month}-${day}`);

      const reasonDate = new Date(d.reasondate);
      if (d.reasondate && d.reasondate != "") {
        return (
          formattedDate <= reasonDate
        )
      } else {
        return d
      }
    })
    console.log(filtered, "filtered")


    let leaveresult = res_applyleave?.data?.applyleaves;

    let countByEmpcodeClockin = {}; // Object to store count for each empcode
    let countByEmpcodeClockout = {};

    const itemsWithSerialNumber1 = filtered?.map((item, index) => {
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
      const absentItems = res?.data?.finaluser?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

      // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
      if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
        // Define the date format for comparison
        const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

        const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
        const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

        const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
        const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

        if (isPreviousDayLeave) {
          updatedClockInStatus = 'AfterWeekOffLeave';
          updatedClockOutStatus = 'AfterWeekOffLeave';
        }
        if (isPreviousDayAbsent) {
          updatedClockInStatus = 'AfterWeekOffAbsent';
          updatedClockOutStatus = 'AfterWeekOffAbsent';
        }
        if (isNextDayLeave) {
          updatedClockInStatus = 'BeforeWeekOffLeave';
          updatedClockOutStatus = 'BeforeWeekOffLeave';
        }
        if (isNextDayAbsent) {
          updatedClockInStatus = 'BeforeWeekOffAbsent';
          updatedClockOutStatus = 'BeforeWeekOffAbsent';
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
        clockinstatus: updatedClockInStatus,
        clockoutstatus: updatedClockOutStatus,
      };
    });
    console.log(itemsWithSerialNumber1, "itemsWithSerialNumber1")
    const rowDataTableData = itemsWithSerialNumber1?.map((item, index) => {

      return {
        ...item,
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
        attendanceauto: getattendancestatus(item, res_vendor?.data?.attendancestatus),
        daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item, res_vendor?.data?.attendancestatus),

      };
    });
    console.log(rowDataTableData, "rowDataTableData")
    console.log(itemsWithSerialNumber, "itemsWithSerialNumber555")

    let finalData = itemsWithSerialNumber.map(item => {
      const [year, month, day] = item.oldstartdate?.split("-");
      let formattedDate = `${day}/${month}/${year}`
      return {
        ...item,
        daystatus: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.daystatus,
        shift: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.shift,
        weekoff: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.shift === "Week Off" ? "Week Off" : ""
      }
    });
    console.log(finalData, "finalData")


    setItems(finalData);
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

  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");

  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
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

  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const columnDataTable = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox",
    //   headerStyle: {
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   renderHeader: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (rowDataTable.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = rowDataTable.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   renderCell: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.row.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.row.id)) {
    //           updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.row.id];
    //         }
    //         setSelectedRows(updatedSelectedRows);
    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 50,
    //   hide: !columnVisibility.checkbox,
    //   headerClassName: "bold-header",
    // },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 50,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Employee Code",
      flex: 0,
      width: 90,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Employee Name",
      flex: 0,
      width: 170,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Company",
      flex: 0,
      width: 90,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 110,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 70,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 80,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "startDate",
      headerName: "From Date",
      flex: 0,
      width: 80,
      hide: !columnVisibility.startDate,
      headerClassName: "bold-header",
    },
    {
      field: "endDate",
      headerName: "To Date",
      flex: 0,
      width: 80,
      hide: !columnVisibility.endDate,
      headerClassName: "bold-header",
    },
    {
      field: "daypoint",
      headerName: "Min Points",
      flex: 0,
      width: 65,
      hide: !columnVisibility.daypoint,
      headerClassName: "bold-header",
    },
    {
      field: "target",
      headerName: "Target",
      flex: 0,
      width: 60,
      hide: !columnVisibility.target,
      headerClassName: "bold-header",
    },

    {
      field: "point",
      headerName: "Point",
      flex: 0,
      width: 75,
      hide: !columnVisibility.point,
      headerClassName: "bold-header",
    },

    {
      field: "avgpoint",
      headerName: "Avg Points",
      flex: 0,
      width: 75,
      hide: !columnVisibility.avgpoint,
      headerClassName: "bold-header",
    },
    {
      field: "mindiff",
      headerName: "Min Diff",
      flex: 0,
      width: 75,
      hide: !columnVisibility.mindiff,
      headerClassName: "bold-header",
      renderCell: (params) => <Typography sx={{ color: params.row.mindiff < 0 ? "red" : params.row.mindiff === 0 ? "inherit" : "green", fontSize: "10px" }}>{params.row.mindiff}</Typography>,
    },
    {
      field: "tardiff",
      headerName: "Tar Diff",
      flex: 0,
      width: 65,
      hide: !columnVisibility.tardiff,
      headerClassName: "bold-header",
      renderCell: (params) => <Typography sx={{ color: params.row.tardiff < 0 ? "red" : params.row.tardiff === 0 ? "inherit" : "green", fontSize: "10px" }}>{params.row.tardiff}</Typography>,
    },
    {
      field: "minreached",
      headerName: "Min Reached",
      flex: 0,
      width: 115,
      hide: !columnVisibility.minreached,
      headerClassName: "bold-header",
      renderCell: (params) => <Chip variant="outlined" sx={{ fontSize: "10px" }} size="small" color={params.row.minreached === "Not Reached" ? "error" : "success"} icon={params.row.minreached === "Not Reached" ? <ClearIcon /> : <CheckIcon />} label={params.row.minreached} />,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 150,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => (params.row.target ? <Chip sx={{ fontSize: "10px", background: params.row.status === "Between 101 - 149%" || params.row.status === "150% and Above" ? "#88b288" : params.row.status === "Below Min Points" ? "#FF6868" : "#fdbb56" }} size="small" avatar={params.row.status === "Between 76 - 100%" ? <Avatar>{"👍"}</Avatar> : params.row.status === "150% and Above" ? <Avatar>{"🔥"}</Avatar> : params.row.status === "Between 101 - 149%" ? <Avatar>{"👌"}</Avatar> : params.row.status === "Below Min Points" ? <Avatar>{"👎"}</Avatar> : ""} label={params.row.status} variant="outlined" /> : null),
    },
    ...(pointsFilter.fromdate === pointsFilter.todate
      ? [
        {
          field: "daystatus",
          headerName: "Day Status",
          flex: 0,
          width: 150,
          hide: !columnVisibility.daystatus,
          headerClassName: "bold-header",
        },
      ]
      : []),

  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.serialNumber,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      name: item.name,
      companyname: item.companyname,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      startDate: item.startDate,
      endDate: item.endDate,
      target: item.target,
      point: Number(item.point),
      daypoint: item.daypoint,
      avgpoint: item.avgpoint,
      minreached: item.minreached,
      mainid: item.mainid,
      mindiff: Number(item.mindiff),
      tardiff: Number(item.tardiff),
      status: item.status,
      daystatus: (item.startDate === item.endDate) ? item.daystatus : "",
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
  // Function to filter columns based on search query
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
              {" "}
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
              {" "}
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //useEffect
  useEffect(() => {
    addSerialNumber();
  }, [clientUserIDArray]);

  useEffect(() => {
    fetchProductionLists();
    fetchTeamAlls();

  }, []);

  useEffect(() => {
    fetchTeamAll();
  }, [selectedUnit])

  useEffect(() => {
    fetchEmployee();
  }, [selectedTeam])

  // page refersh reload password
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

  const getattendancestatus = (alldata, attS) => {

    let result = attS.filter((data, index) => {

      return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
    })

    return result[0]?.name
  }

  return (
    <Box>
      <Headtitle title={"REVIEW TEMP PRODUCTION POINTS"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Review Temp Production Points</Typography>

      <Box sx={userStyle.dialogbox}>
        <Typography sx={userStyle.HeaderText}>Filters</Typography>
        <Grid container spacing={2}>
          <Grid item md={2.5} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>Company</Typography>
              <MultiSelect
                options={isAssignBranch?.map(data => ({
                  label: data.company,
                  value: data.company,
                })).filter((item, index, self) => {
                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                })}
                value={selectedCompany}
                onChange={handleCompanyChange}
                valueRenderer={customValueRendererCompany}
                labelledBy="Please Select Company"
              />
            </FormControl>
          </Grid>
          <Grid item md={2.5} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>Branch</Typography>
              <MultiSelect
                options={isAssignBranch?.filter(
                  (comp) =>
                    selectedCompany.map((item) => item.value).includes(comp.company)
                )?.map(data => ({
                  label: data.branch,
                  value: data.branch,
                })).filter((item, index, self) => {
                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                })}
                value={selectedBranch}
                onChange={handleBranchChange}
                valueRenderer={customValueRendererBranch}
                labelledBy="Please Select Branch"
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>Unit</Typography>
              <MultiSelect
                options={isAssignBranch?.filter(
                  (comp) =>
                    selectedCompany.map((item) => item.value).includes(comp.company) && selectedBranch.map((item) => item.value).includes(comp.branch)
                )?.map(data => ({
                  label: data.unit,
                  value: data.unit,
                })).filter((item, index, self) => {
                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                })}
                value={selectedUnit}
                onChange={handleUnitChange}
                valueRenderer={customValueRendererUnit}
                labelledBy="Please Select Unit"
              />
            </FormControl>
          </Grid>
          <Grid item md={2} xs={12} sm={12}>
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
          <Grid item md={3} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>Employee Name<b style={{ color: "red" }}>*</b></Typography>
              <MultiSelect
                options={employees
                  ?.filter((comp) => selectedCompany.map((item) => item.value).includes(comp.company) && selectedBranch.map((item) => item.value).includes(comp.branch) && selectedUnit.map((item) => item.value).includes(comp.unit) && selectedTeam.map((item) => item.value).includes(comp.team))
                  ?.map((com) => ({
                    ...com,
                    label: com.companyname,
                    value: com.companyname,
                    empcode: com.empcode,
                    username: com.username,
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
        <Grid container spacing={2}>
          <Grid item md={2.5} sm={6} lg={2.5} xs={12}>
            <Typography>From Date</Typography>
            <FormControl fullWidth>
              <OutlinedInput
                id="component-outlined"
                type="date"
                value={pointsFilter.fromdate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  // Ensure that the selected date is not in the future
                  const currentDate = new Date().toISOString().split("T")[0];
                  if (selectedDate <= currentDate) {
                    setPointsFilter({ ...pointsFilter, fromdate: selectedDate, todate: selectedDate });
                  } else {

                  }
                }}
                // Set the max attribute to the current date
                inputProps={{ max: new Date().toISOString().split("T")[0] }}
              />
            </FormControl>
          </Grid>
          <Grid item md={2.5} sm={6} lg={2.5} xs={12}>
            <Typography>To Date</Typography>
            <FormControl fullWidth size="small">
              <OutlinedInput
                id="component-outlined"
                type="date"
                value={pointsFilter.todate}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  // Ensure that the selected date is not in the future
                  const currentDate = new Date().toISOString().split("T")[0];
                  const fromdateval = pointsFilter.fromdate != "" && new Date(pointsFilter.fromdate).toISOString().split("T")[0];
                  if (pointsFilter.fromdate == "") {
                    setShowAlert(
                      <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please Select From date`}</p>
                      </>
                    );
                    handleClickOpenerr();
                  } else if (selectedDate < fromdateval) {
                    setPointsFilter({ ...pointsFilter, todate: "" });
                    setShowAlert(
                      <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{`To Date should be after or equal to From Date`}</p>
                      </>
                    );
                    handleClickOpenerr();
                  } else if (selectedDate <= currentDate) {
                    setPointsFilter({ ...pointsFilter, todate: selectedDate });
                  } else {
                  }
                }}
                // Set the max attribute to the current date
                inputProps={{ max: new Date().toISOString().split("T")[0], min: pointsFilter.fromdate !== "" ? pointsFilter.fromdate : null }}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} sm={6} lg={2} xs={12}>
            <Typography>Compare</Typography>
            <FormControl fullWidth>
              <Selects
                options={compares}
                value={{ label: pointsFilter.compare, value: pointsFilter.compare }}
                onChange={(e) => {
                  setPointsFilter({ ...pointsFilter, compare: e.value, less: "", greater: "", betweenfrom: "", betweento: "" });
                }}
              />
            </FormControl>
          </Grid>
          {pointsFilter.compare === "Less than" && (
            <Grid item md={2} sm={6} lg={2} xs={12}>
              <Typography>
                Value (%) <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Value(%)"
                  value={pointsFilter.less}
                  onChange={(e) => {
                    setPointsFilter({
                      ...pointsFilter,
                      less: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
          )}
          {pointsFilter.compare === "Greater than" && (
            <Grid item md={2} sm={6} lg={2} xs={12}>
              <Typography>
                Value (%) <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Value(%)"
                  value={pointsFilter.greater}
                  onChange={(e) => {
                    setPointsFilter({
                      ...pointsFilter,
                      greater: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
          )}
          {pointsFilter.compare === "Between" && (
            <>
              <Grid item md={2} sm={6} lg={2} xs={12}>
                <Typography>
                  Value from (%) <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter From Value(%)"
                    value={pointsFilter.betweenfrom}
                    onChange={(e) => {
                      setPointsFilter({
                        ...pointsFilter,
                        betweenfrom: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} sm={6} lg={2} xs={12}>
                <Typography>
                  Value to (%) <b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter To Value(%)"
                    value={pointsFilter.betweento}
                    onChange={(e) => {
                      setPointsFilter({
                        ...pointsFilter,
                        betweento: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
          <Grid item md={2} sm={6} lg={2} xs={12} marginTop={3}>
            <Button variant="contained" onClick={(e) => handleSubmit(e)}>
              Generate
            </Button>
          </Grid>
          <Grid item md={1} sm={6} lg={1} xs={12} marginTop={3}>
            <Button sx={userStyle.btncancel} onClick={(e) => handleClear(e)}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      <>
        <Box sx={userStyle.container}>
          {/* ******************************************************EXPORT Buttons****************************************************** */}
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>List Temp Production Points</Typography>
          </Grid>
          {loader ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>

                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            </>
          ) : (
            <>
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
                      <MenuItem value={clientUserIDArray?.length}>All</MenuItem>
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
                    {isUserRoleCompare?.includes("exceltempreview") && (
                      <>
                        <ExportXL
                          csvData={
                            pointsFilter.fromdate === pointsFilter.todate ?
                              rowDataTable.map((item, index) => ({
                                Sno: item.serialNumber,
                                "Employee Code": item.empcode,
                                "Employee Name": item.name,
                                Company: item.companyname,
                                Branch: item.branch,
                                Unit: item.unit,
                                Team: item.team,
                                "From Date": item.startDate,
                                "To Date": item.endDate,
                                "Minimum Points": item.daypoint,
                                Target: item.target,
                                Points: item.point,
                                "Average Points": item.avgpoint,
                                "Minimum points Diff": item.mindiff,
                                "Target Diff": item.tardiff,
                                Status: item.status,
                                "Day Status": item.daystatus,
                              }))
                              :
                              rowDataTable.map((item, index) => ({
                                Sno: item.serialNumber,
                                "Employee Code": item.empcode,
                                "Employee Name": item.name,
                                Company: item.companyname,
                                Branch: item.branch,
                                Unit: item.unit,
                                Team: item.team,
                                "From Date": item.startDate,
                                "To Date": item.endDate,
                                "Minimum Points": item.daypoint,
                                Target: item.target,
                                Points: item.point,
                                "Average Points": item.avgpoint,
                                "Minimum points Diff": item.mindiff,
                                "Target Diff": item.tardiff,
                                Status: item.status,
                              }))
                          }
                          fileName={fileName}
                        />
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvtempreview") && (
                      <>
                        <ExportCSV
                          csvData={
                            pointsFilter.fromdate === pointsFilter.todate ?
                              rowDataTable.map((item, index) => ({
                                Sno: item.serialNumber,
                                "Employee Code": item.empcode,
                                "Employee Name": item.name,
                                Company: item.companyname,
                                Branch: item.branch,
                                Unit: item.unit,
                                Team: item.team,
                                "From Date": item.startDate,
                                "To Date": item.endDate,
                                "Minimum Points": item.daypoint,
                                Target: item.target,
                                Points: item.point,
                                "Average Points": item.avgpoint,
                                "Minimum points Diff": item.mindiff,
                                "Target Diff": item.tardiff,
                                Status: item.status,
                                "Day Status": item.daystatus,
                              }))
                              :
                              rowDataTable.map((item, index) => ({
                                Sno: item.serialNumber,
                                "Employee Code": item.empcode,
                                "Employee Name": item.name,
                                Company: item.companyname,
                                Branch: item.branch,
                                Unit: item.unit,
                                Team: item.team,
                                "From Date": item.startDate,
                                "To Date": item.endDate,
                                "Minimum Points": item.daypoint,
                                Target: item.target,
                                Points: item.point,
                                "Average Points": item.avgpoint,
                                "Minimum points Diff": item.mindiff,
                                "Target Diff": item.tardiff,
                                Status: item.status,
                              }))
                          }
                          fileName={fileName}
                        />
                      </>
                    )}
                    {isUserRoleCompare?.includes("printtempreview") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdftempreview") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imagetempreview") && (
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
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
              <br />
              <br />
              <Box
                style={{
                  width: "100%",
                  overflowY: "hidden", // Hide the y-axis scrollbar
                }}
              >
                <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
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

          {/* ****** Table End ****** */}
        </Box>

        {/* ****** Table End ****** */}
      </>
      {/* // )} */}
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Min Points</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Point</TableCell>
              <TableCell>Avg Points</TableCell>
              <TableCell>Min Diff</TableCell>
              <TableCell>Tar Diff</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Day Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.serialNumber}</TableCell>
                  <TableCell>{row.empcode}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.companyname}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>{row.daypoint}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell>{row.point}</TableCell>
                  <TableCell>{row.avgpoint}</TableCell>
                  <TableCell>{row.mindiff}</TableCell>
                  <TableCell>{row.tardiff}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.daystatus}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
      <br />
    </Box>
  );
}

export default ListProductionPoints;