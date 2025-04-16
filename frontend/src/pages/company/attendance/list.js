import React, { useState, useEffect, useRef, useContext } from "react";
import {
  IconButton,
  Box,
  Typography,
  TableContainer,
  Paper,
  Select,
  TableBody,
  TableRow,
  TableHead,
  Table,
  MenuItem,
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Popover,
  TableCell,
  FormControl,
  OutlinedInput,
  Grid,
  Button,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import LinearProgress from "@mui/material/LinearProgress";
import "jspdf-autotable";
import Selects from "react-select";
import { SERVICE } from "../../../services/Baseservice";
import axios from "axios";
import moment from "moment";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../../../App.css";
import { FaEdit } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "./exportcsv";
import ImageIcon from "@mui/icons-material/Image";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

function Attendancecreate() {
  //get current month
  let month = new Date().getMonth() + 1;

  const { auth } = useContext(AuthContext);

  //get current year
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
  let monthname = monthstring[new Date().getMonth()];
  const currentMonthIndex = new Date().getMonth();
  const currentMonthObject = {
    label: monthstring[currentMonthIndex],
    value: currentMonthIndex + 1,
  };
  const currentYearObject = { label: currentYear, value: currentYear };

  const [isMonthyear, setIsMonthYear] = useState({
    ismonth: currentMonthObject,
    isyear: currentYearObject,
    isuser: "",
  });

  // const [isMonthyear, setIsMonthYear] = useState({ ismonth: { label: month, value: month }, isyear: { label: currentYear, value: currentYear }, isuser: "" });
  const [isempdatas, setIsEmpDatas] = useState({});
  const [isempid, setIsEmpid] = useState([]);
  const [isuser, setisuser] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isAttandance, setIsAttandance] = useState({
    username: "",
    month: "",
    year: "",
  });
  const [showdata, setShowdata] = useState([
    {
      clockintime: "",
      today: "",
      clockouttime: "",
      status: "",
      id: "",
      statusvalue: "",
      userid: "",
    },
  ]);
  const { isUserRoleCompare, allUsersData, isAssignBranch, allTeam } = useContext(
    UserRoleAccessContext
  );

  const [isRead, setIsRead] = useState(false);
  const [isanoRead, setIsanoRead] = useState(false);
  const [timesDifference, setTimeDifference] = useState("");
  const [selectedOptionsEmployees, setSelectedOptionsEmployees] = useState([]);
  let [valueEmployees, setValueEmployees] = useState("");
  const gridRef = useRef(null);
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Attendance_List.png");
        });
      });
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const [send, setSend] = useState(false);

  const openAlert = () => {
    setSend(true);
  };

  const closeAlert = () => {
    setSend(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

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
    setValueEmployees([]);
    setSelectedOptionsEmployees([]);
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
    setValueEmployees([]);
    setSelectedOptionsEmployees([]);
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
    setValueEmployees([]);
    setSelectedOptionsEmployees([]);
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
    setValueEmployees([]);
    setSelectedOptionsEmployees([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  // Employee multi select
  const handleEmployeesChange = (options) => {
    setValueEmployees(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsEmployees(options);
  };
  const customValueRendererEmployees = (valueEmployees, _employees) => {
    return valueEmployees.length ? (
      valueEmployees.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Employee Name
      </span>
    );
  };

  //fetch all attendance...
  const fetchAttendance = async (e) => {
    try {
      let req = await axios.get(SERVICE.ATTANDANCE_STATUS_DATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setIsEmpid(req?.data?.resultdateid);
      setIsEmpDatas(req?.data?.trail);
      setIsAttandance(true);
    } catch (err) {setIsAttandance(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const handleClear = (e) => {
    e.preventDefault();
    setisuser([]);
    fetchAttendance();
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsEmployees([]);
    setIsMonthYear({
      ...isMonthyear,
      ismonth: currentMonthObject,
      isyear: currentYearObject,
    });
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleChangeAttendance = async () => {
    try {
      let res = allUsersData.filter((data, index) => {
        if (valueEmployees.length > 0) {
          return valueCompanyCat.includes(data.company) && valueBranchCat.includes(data.branch) && valueUnitCat.includes(data.unit) && valueTeamCat.includes(data.team) && valueEmployees.includes(data.companyname)
        } else if (valueTeamCat.length > 0) {
          return valueCompanyCat.includes(data.company) && valueBranchCat.includes(data.branch) && valueUnitCat.includes(data.unit) && valueTeamCat.includes(data.team)
        } else if (valueUnitCat.length > 0) {
          return valueCompanyCat.includes(data.company) && valueBranchCat.includes(data.branch) && valueUnitCat.includes(data.unit)
        } else if (valueBranchCat.length > 0) {
          return valueCompanyCat.includes(data.company) && valueBranchCat.includes(data.branch)
        } else {
          return valueCompanyCat.includes(data.company)
        }
      })
      setisuser(res);
      setLoader(true);
    } catch (err) {setLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valueCompanyCat?.length == 0) {
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
      setLoader(false);
      handleChangeAttendance();
    }
  };

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

  const fetchAttendanceData = async (date, id) => {
    try {
      let req = await axios.post(`${SERVICE.ATTANDANCE_STATUS_USERDATE}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userid: String(id),
        staffcurrentdate: String(date),
      });
      if (req?.data?.attendanceresult?.length != 0) {
        setShowdata({
          ...showdata,
          statusvalue: "",
          clockintime: req?.data?.attendanceresult[0]?.clockintime
            ? req?.data?.attendanceresult[0]?.clockintime
            : "00:00:00",
          clockouttime: req?.data?.attendanceresult[0]?.clockouttime
            ? req?.data?.attendanceresult[0]?.clockouttime
            : "00:00:00",
          buttonstatus: req?.data?.attendanceresult[0]?.buttonstatus
            ? req?.data?.attendanceresult[0]?.buttonstatus
            : "",
          clockinipaddress: req?.data?.attendanceresult[0]?.clockinipaddress
            ? req?.data?.attendanceresult[0]?.clockinipaddress
            : "",
          clockoutipaddress: req?.data?.attendanceresult[0]?.clockoutipaddress
            ? req?.data?.attendanceresult[0]?.clockoutipaddress
            : "",
          userid: req?.data?.attendanceresult[0]?.userid
            ? req?.data?.attendanceresult[0]?.userid
            : "",
          username: req?.data?.attendanceresult[0]?.username
            ? req?.data?.attendanceresult[0]?.username
            : "",
          status: req?.data?.attendanceresult[0]?.status
            ? req?.data?.attendanceresult[0]?.status
            : null,
          date: req?.data?.attendanceresult[0]?.date
            ? req?.data?.attendanceresult[0]?.date
            : "",
          id: req?.data?.attendanceresult[0]?._id
            ? req?.data?.attendanceresult[0]?._id
            : "",
        });
      }

      await fetchAttendance();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  // clockinout difference calculation
  const calculateTimeDifference = () => {
    const clockInTime = moment(showdata.clockintime, "hh:mm:ss A");
    const clockOutTime = moment(showdata.clockouttime, "hh:mm:ss A");

    const shiftime = "19:00:00";
    const clockshiftime = moment(shiftime, "hh:mm:ss A");
    const currentTime = moment();
    // const
    const today = new Date();

    if (!clockInTime.isValid()) {
      setTimeDifference("");
      return;
    }

    let difference;
    if (showdata.buttonstatus == "false") {
      difference = moment.duration(clockOutTime.diff(clockInTime));
    } else if (
      showdata.buttonstatus == "true" &&
      moment(today).format("DD-MM-YYYY") == showdata.date
    ) {
      // Calculate time difference with current time
      difference = moment.duration(currentTime.diff(clockInTime));
    } else if (
      showdata.buttonstatus == "true" &&
      moment(today).format("DD-MM-YYYY") != showdata.date
    ) {
      difference = moment.duration(clockshiftime.diff(clockInTime));
    }

    const hours = difference?.hours();
    const minutes = difference?.minutes();
    const seconds = difference?.seconds();

    const formattedTimeDifference = `${hours}h:${minutes}m:${seconds}s`;
    setTimeDifference(formattedTimeDifference);
  };

  useEffect(() => {
    calculateTimeDifference();
  }, [showdata.statusvalue]);

  const postAttendanceData = async () => {
    try {
      let req = await axios.put(`${SERVICE.ATTANDANCE_SINGLE}/${showdata.id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        clockintime: String(showdata.clockintime),
        clockouttime: String(showdata.clockouttime),
      });
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const years = Array.from(new Array(10), (val, index) => currentYear - index);
  const getyear = years.map((year) => {
    return { value: year, label: year };
  });

  const currentDate = new Date(); // Get the current date
  const currentDay = currentDate.getDate(); // Get the day of the month
  const currentMonth = currentDate.getMonth() + 1; // Get the day of the month

  // Get the total number of days in the month
  const daysInMonth = getDaysInMonth(
    isMonthyear.isyear.value,
    isMonthyear.ismonth.value
  );

  // Create an array of days from 1 to the total number of days in the month
  // const daysArray = Array.from(new Array(daysInMonth), (val, index) => index + 1 );

  // Create an array of days from 1 to the total number of days in the month
  const daysArray = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  );

  // const daysArray = Array.from(new Array(daysInMonth), (val, index) => {
  //     const dayOfMonth = index + 1;
  //     const currentDate = new Date(isMonthyear.isyear.value, isMonthyear.ismonth.value - 1, dayOfMonth);
  //     const formattedDate = format(currentDate, 'dd-MM-yyyy');

  //     return { dayOfMonth, formattedDate };
  // });

  const hanldefetchEmployee = (userid, dayvalue) => {
    let d = 5;
    let dateval;

    dateval = moment({
      day: dayvalue,
      month: isMonthyear.ismonth.value - 1, // months in moment are zero-based (0-11)
      year: isMonthyear.isyear.value,
    }).format("DD-MM-YYYY");

    if (isempid?.includes(userid)) {
      if (isempdatas[userid]?.includes(dateval)) {
        return (
          <FaCheckCircle
            onClick={(e) => {
              openAlert();
              fetchAttendanceData(dateval, userid);
              setShowdata((prevData) => ({
                ...prevData,
                status: "Present",
                statusvalue: "Present",
                username:
                  isuser.find((item) => item._id === userid)?.username || "",
              }));
            }}
            style={{
              color: "green",
              fontWeight: "900",
              cursor: "pointer",
              fontSize: "14px",
              background: "#0080000d",
            }}
          />
        );
      }
    }

    return (
      <FaTimesCircle
        onClick={(e) => {
          openAlert();
          setShowdata((prevData) => ({
            ...prevData,
            clockintime: "00:00:00",
            clockouttime: "00:00:00",
            date: `${dayvalue <= 9 ? "0" + dayvalue : dayvalue}-${isMonthyear.ismonth.value <= 9
                ? "0" + isMonthyear.ismonth.value
                : isMonthyear.ismonth.value
              }-${isMonthyear.isyear.value}`,
            timesDifference: "00:00:00",
            status: "Absent",
            clockinipaddress: "",
            clockoutipaddress: "",
            statusvalue: "Absent",
            // username: isuser.find((item) => item._id === userid)?.username || '',
          }));
          fetchAttendanceData(dateval, userid);
        }}
        style={{
          color: "red",
          fontWeight: "900",
          fontSize: "14px",
          background: "#ff00000d",
          cursor: "pointer",
        }}
      />
    );
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendance_Hierarchy",
    pageStyle: "print",
  });

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    profileimage: true,
    // username: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    companyname: true,
    department: true,
    ...daysArray.reduce((acc, day, index) => {
      acc[`${index + 1}`] = true;
      return acc;
    }, {}),
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = isuser?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [isuser]);

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
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
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

  const indexOfLastItem = page * pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [projectData, setProjectData] = useState([]);
  // Excel
  const fileName = "Attendance_List";

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
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "profileimage",
      headerName: "Profile Image",
      flex: 0,
      width: 110,
      renderCell: (params) => (
        <img
          src={
            params.row.profileimage
              ? params.row.profileimage
              : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"
          }
          alt={`Profile Image ${params.row.id}`}
          style={{ borderRadius: "50%", height: "35px" }}
        />
      ),
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      flex: 0,
      width: 170,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company Name",
      flex: 0,
      width: 170,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "unit",
      headerName: "Unit Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },

    {
      field: "department",
      headerName: "Department Name",
      flex: 0,
      width: 120,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    ...daysArray.map((day, index) => ({
      field: `${index + 1}`, // Assumes daysArray is 1-indexed
      headerName: `${index + 1}`,
      flex: 0,
      width: 70,
      renderCell: (params) => (
        <TableCell
          sx={{
            color: "inherit",
            padding: "3px 3px",
            textAlign: "center",
          }}
          onClick={openAlert} // Add your onClick logic here
        >
          <Box>{params.row.days[index].dayData}</Box>
        </TableCell>
      ),
    })),
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      profileimage: item.profileimage,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      companyname: item.companyname,
      department: item.department,
      date: item.date,
      days: daysArray.map((dayvalue, index) => {
        let isFutureDate = dayvalue > currentDay;

        return {
          isFutureMonthCell:
            currentYear === isMonthyear.isyear.value &&
            isMonthyear.ismonth.value > currentMonth,
          isFutureDate:
            isFutureDate &&
            isMonthyear.ismonth.value === currentMonth &&
            currentYear === isMonthyear.isyear.value,
          dayData:
            isFutureDate &&
              isMonthyear.ismonth.value === currentMonth &&
              currentYear === isMonthyear.isyear.value
              ? null
              : hanldefetchEmployee(item._id, dayvalue),
        };
      }), // Fixed the syntax error here
    };
  });

  const hanldefetchEmployeeexcel = async (userid, dayvalue) => {
    let d = 5;
    let dateval;

    dateval = moment({
      day: dayvalue,
      month: isMonthyear.ismonth.value - 1, // months in moment are zero-based (0-11)
      year: isMonthyear.isyear.value,
    }).format("DD-MM-YYYY");

    if (isempid?.includes(userid)) {
      if (isempdatas[userid]?.includes(dateval)) {
        let reqval = await axios.post(`${SERVICE.ATTANDANCE_STATUS_USERDATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          userid: String(userid),
          staffcurrentdate: String(dateval),
        });
        let stringval = reqval?.data?.attendanceresult[0].clockintime;
        let stringvalclockout = reqval?.data?.attendanceresult[0].clockouttime;
        let stringvalip = reqval?.data?.attendanceresult[0].clockinipaddress;

        return (
          // String(stringval)
          String(
            stringval +
            " /" +
            (stringvalclockout ? stringvalclockout : "00 : 00 : 00") +
            " /" +
            stringvalip
          )
        );
      }
    }

    return "Absent";
  };

  const rowDataTableexcel = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      profileimage: item.profileimage,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      companyname: item.companyname,
      department: item.department,
      days: daysArray.map((dayvalue, index) => {
        let isFutureDate = dayvalue > currentDay;
        return {
          isFutureMonthCell:
            currentYear === isMonthyear.isyear.value &&
            isMonthyear.ismonth.value > currentMonth,
          isFutureDate:
            isFutureDate &&
            isMonthyear.ismonth.value === currentMonth &&
            currentYear === isMonthyear.isyear.value,
          dayData:
            isFutureDate &&
              isMonthyear.ismonth.value === currentMonth &&
              currentYear === isMonthyear.isyear.value
              ? null
              : hanldefetchEmployeeexcel(item._id, dayvalue),
        };
      }), // Fixed the syntax error here
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

  //  PDF

  const columns = [
    // Add dynamic columns for daysArray
    ...daysArray.map((day, index) => ({
      title: `${index + 1}`, // Customize the title as needed
      field: `${index}`,
    })),
    { title: "Sno", field: "serialNumber" },
    { title: "Company Name", field: "companyname" },
    { title: "Company", field: "company" },
    { title: "Branch Name", field: "branch" },
    { title: "Unit Name", field: "unit" },
    { title: "Team Name", field: "team" },
    { title: "Department Name", field: "department" },
  ];

  const downloadPdf = async () => {
    try {
      const result = await Promise.all(
        rowDataTableexcel.map(async (t, index) => {
          const dayDataArray = await Promise.all(
            t.days.map(async (day) => {
              const result = await day.dayData;
              return result !== null ? result : "";
            })
          );

          const firstPart = {
            serialNumber: t.serialNumber,
            companyname: t.companyname,
            company: t.company,
            branch: t.branch,
            unit: t.unit,
            team: t.team,
            department: t.department,
          };

          const secondPart = daysArray.reduce((acc, _, index) => {
            acc[`Day${index + 1}`] = dayDataArray[index];
            return acc;
          }, {});

          return {
            ...firstPart,
            ...secondPart,
          };
        })
      );

      const doc = new jsPDF({ orientation: "landscape" });

      // Define columns
      const fixedColumns = [
        { title: "Sno", dataKey: "serialNumber" },
        { title: "Company Name", dataKey: "companyname" },
        { title: "Company", dataKey: "company" },
        { title: "Branch Name", dataKey: "branch" },
        { title: "Unit Name", dataKey: "unit" },
        { title: "Team Name", dataKey: "team" },
        { title: "Department Name", dataKey: "department" },
        // Add dynamic columns for daysArray
        ...daysArray.map((_, index) => ({
          title: `Day${index + 1}`,
          dataKey: `Day${index + 1}`,
        })),
      ];

      const formattedResult = result.map((row) => ({
        ...row,
        sno: row.serialNumber,
        companyname: row.companyname,
        company: row.company,
        branch: row.branch,
        unit: row.unit,
        team: row.team,
        department: row.department,
      }));

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 4,
        },
        columns: fixedColumns,
        body: formattedResult,
      });

      doc.save("Attendance_List.pdf");
    } catch (error) {
      console.error("Error downloading PDF:", error);
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

  // const [excel, setExcel] = useState("")

  // const fetchData = async () => {
  //     const result = await Promise.all(
  //         rowDataTableexcel.map(async (t, index) => {
  //             const dayDataArray = await Promise.all(
  //                 t.days.map(async (day) => {
  //                     const result = await day.dayData;
  //                     return result !== null ? result : "";
  //                 })
  //             );

  //             const firstPart = {
  //                 serialNumber: t.serialNumber,
  //                 companyname: t.companyname,
  //                 company: t.company,
  //                 branch: t.branch,
  //                 unit: t.unit,
  //                 team: t.team,
  //                 department: t.department,
  //             };

  //             const secondPart = daysArray.reduce((acc, _, index) => {

  //                 acc[`Day${index + 1}`] = dayDataArray[index];
  //                 return acc;
  //             }, {});
  //             // const secondPart = dayDataArray.reduce((acc, dayData, dayIndex) => {
  //             //     acc[dayIndex + 1] = dayData; // Use dayIndex + 1 to start from 1
  //             //     return acc;
  //             // }, {});

  //             return {
  //                 ...firstPart,
  //                 ...secondPart,
  //             };
  //         })
  //     );

  //     setProjectData(result);
  // };

  // useEffect(() => {
  //     fetchData();
  // }, [items, isuser, excel])

  return (
    <Box>
      <Headtitle title={"Attendance"} />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("lattendancelist") && (
        <Box>
          <Grid display="flex">
            <Typography sx={userStyle.HeaderText}>
              Attendance Manager
            </Typography>
          </Grid>
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item md={12} sm={12} xs={12}>
                <Typography>
                  <b>Assign To</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={isAssignBranch?.map(data => ({
                      label: data.company,
                      value: data.company,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Branch</Typography>
                  <MultiSelect
                    options={

                      isAssignBranch?.filter(
                        (comp) =>
                          valueCompanyCat?.includes(comp.company)
                      )?.map(data => ({
                        label: data.branch,
                        value: data.branch,
                      })).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Unit</Typography>
                  <MultiSelect
                    options={isAssignBranch?.filter(
                      (comp) =>
                        valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch)
                    )?.map(data => ({
                      label: data.unit,
                      value: data.unit,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
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
                      ?.filter((comp) => valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch) && valueUnitCat?.includes(comp.unit))
                      .map((u) => ({
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
              <Grid item md={3} sm={6} xs={12}>
                <Typography>Employee Name</Typography>
                <FormControl size="small" fullWidth>
                  <MultiSelect
                    size="small"
                    options={allUsersData
                      ?.filter(
                        (u) =>
                          valueCompanyCat?.includes(u.company) &&
                          valueBranchCat?.includes(u.branch) &&
                          valueUnitCat?.includes(u.unit) &&
                          valueTeamCat?.includes(u.team)
                      )
                      .map((u) => ({
                        ...u,
                        label: u.companyname,
                        value: u.companyname,
                      }))}
                    value={selectedOptionsEmployees}
                    onChange={handleEmployeesChange}
                    valueRenderer={customValueRendererEmployees}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                md={2}
                lg={2}
                xs={12}
                sm={6}
                sx={{ marginTop: "20px" }}
              >
                <FormControl size="small" fullWidth>
                  <Button
                    style={{
                      padding: "7px 19px",
                      backgroundColor: "#1976d2",
                      height: "fit-content",
                      color: "white",
                    }}
                    variant="contained"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {" "}
                    Apply
                  </Button>
                </FormControl>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <Typography>Select Month</Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={200}
                    value={isMonthyear.ismonth} // Use value directly, assuming the component expects a simple value
                    onChange={(e) => handleGetMonth(e.value)}
                    options={months}
                  />
                </FormControl>
              </Grid>

              <Grid item md={3} sm={6} xs={12}>
                <Typography> Select Year</Typography>
                <FormControl fullWidth size="small">
                  <Selects
                    maxMenuHeight={200}
                    // value={isAttandance.getyear}
                    value={isMonthyear.isyear}
                    // placeholder={isMonthyear.isyear.value}
                    // onChange={(e) => { setIsMonthYear({ ...isMonthyear, isyear: e.value }) }}
                    onChange={(e) => handleGetYear(e.value)}
                    options={getyear}
                  />
                </FormControl>
              </Grid>
              <Grid item md={1} xs={6} sm={12} sx={{ marginTop: "20px" }}>
                <Button
                  sx={userStyle.btncancel}
                  onClick={(e) => handleClear(e)}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
            <br />
          </Box>
          <br />
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Attendance List
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
                      <MenuItem value={isuser?.length}>All</MenuItem>
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
                    {isUserRoleCompare?.includes("excelattendancelist") && (
                      <>
                        <ExportXL
                          // csvData={projectData}
                          rowDataTableexcel={rowDataTableexcel}
                          daysArray={daysArray}
                          fileName={fileName}
                        />
                        {/* <ExportXL /> */}
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvattendancelist") && (
                      <>
                        <ExportCSV
                          // csvData={projectData}
                          rowDataTableexcel={rowDataTableexcel}
                          daysArray={daysArray}
                          fileName={fileName}
                        />
                      </>
                    )}
                    {isUserRoleCompare?.includes("printattendancelist") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfattendancelist") && (
                      <>
                        <Button
                          sx={userStyle.buttongrp}
                          onClick={() => downloadPdf()}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageattendancelist") && (
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
                        {" "}
                        <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                        &ensp;Image&ensp;{" "}
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
                  <Box
                    style={{
                      width: "100%",
                      overflowY: "hidden", // Hide the y-axis scrollbar
                    }}
                  >
                    {isAttandance ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <LinearProgress />
                      </>
                    )}
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
            </>
          </Box>
        </Box>
      )}
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          id="usertable"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: "14px", fontWeight: "550" }}>
                S.No
              </TableCell>
              <TableCell sx={{ fontSize: "14px", fontWeight: "550" }}>
                Employee Name
              </TableCell>
              <TableCell sx={{ fontSize: "14px", fontWeight: "550" }}>
                Company Name
              </TableCell>
              <TableCell sx={{ fontSize: "14px", fontWeight: "550" }}>
                Branch Name
              </TableCell>
              <TableCell sx={{ fontSize: "14px", fontWeight: "550" }}>
                Unit Name
              </TableCell>
              <TableCell sx={{ fontSize: "14px", fontWeight: "550" }}>
                Team Name
              </TableCell>
              <TableCell sx={{ fontSize: "14px", fontWeight: "550" }}>
                Department Name
              </TableCell>

              {daysArray &&
                daysArray.map(({ dayName }, i) => (
                  <React.Fragment key={i}>
                    <TableCell sx={{ fontSize: "14px", fontWeight: "550" }}>
                      {i + 1}{" "}
                    </TableCell>
                  </React.Fragment>
                ))}
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.companyname}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.unit}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.department}</TableCell>

                  {row.days.map((day, index) => (
                    <TableCell key={index}>{day.dayData}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog popup */}
      <Box>
        <Dialog open={send} onClose={closeAlert}>
          <DialogContent
            sx={{
              width: "600px",
              textAlign: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Box>
              <Grid container spacing={2}>
                <Grid item md={6} lg={6}>
                  <Typography
                    sx={{
                      textAlign: "left",
                      color: showdata.statusvalue ? "red" : "green",
                    }}
                  >
                    <b>
                      {showdata.statusvalue ? showdata.statusvalue : "Present"}
                    </b>
                  </Typography>
                </Grid>
                <Grid item md={6} lg={6}>
                  <Typography sx={{ textAlign: "left" }}>
                    <b>Date:</b> {showdata.date}
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} lg={6}>
                  <Typography sx={{ textAlign: "left" }}>
                    <b> {showdata.username}</b>
                  </Typography>
                </Grid>
                <Grid item md={6} lg={6}></Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} lg={4}>
                  <Typography sx={{ textAlign: "right", marginTop: "5px" }}>
                    <b>Clockin :</b>
                  </Typography>
                </Grid>
                <Grid item md={5} lg={5}>
                  <FormControl size="small">
                    {showdata.statusvalue !== "Absent" && isRead ? (
                      <OutlinedInput
                        size="small"
                        value={showdata.clockintime}
                        sx={userStyle.input}
                        id="component-outlined"
                        type="text"
                        onChange={(e) => {
                          setShowdata({
                            ...showdata,
                            clockintime: e.target.value,
                          });
                        }}
                      />
                    ) : (
                      <OutlinedInput
                        readOnly
                        value={showdata.clockintime}
                        size="small"
                        sx={userStyle.input}
                        id="component-outlined"
                      />
                    )}
                  </FormControl>
                  {showdata.statusvalue ? null : (
                    <Typography sx={{ textAlign: "left" }}>
                      <b>IP:</b>{" "}
                      {showdata.statusvalue ? null : showdata.clockinipaddress}
                    </Typography>
                  )}
                </Grid>
                {showdata.statusvalue ? null : (
                  <Grid item md={1} lg={1}>
                    <IconButton aria-label="Example" sx={{ marginTop: "5px" }}>
                      {showdata.statusvalue !== "Absent" ? (
                        <FaEdit
                          onClick={(e) => {
                            setIsRead(!isRead);
                          }}
                          style={{
                            color: isRead ? "green" : "red",
                            cursor: "pointer",
                          }}
                          fontSize="small"
                        />
                      ) : (
                        <FaEdit
                          style={{ color: "gray", cursor: "not-allowed" }}
                          fontSize="small"
                        />
                      )}
                    </IconButton>
                  </Grid>
                )}
              </Grid>
              <Grid item md={1} lg={1}></Grid>
              <Grid item md={4} lg={4}></Grid>
              <Grid item md={1} lg={1}></Grid>

              <br></br>
              <Grid container spacing={2}>
                <Grid item md={4} lg={4}>
                  <Typography sx={{ textAlign: "right", marginTop: "6px" }}>
                    <b>Clockout :</b>
                  </Typography>
                </Grid>
                <Grid item md={5} lg={5}>
                  <FormControl size="small" fullWidth>
                    {showdata.statusvalue !== "Absent" && isanoRead ? (
                      <OutlinedInput
                        size="small"
                        value={showdata.clockouttime}
                        sx={userStyle.input}
                        id="component-outlined"
                        type="text"
                        onChange={(e) => {
                          setShowdata({
                            ...showdata,
                            clockouttime: e.target.value,
                          });
                        }}
                      />
                    ) : (
                      <OutlinedInput
                        size="small"
                        value={showdata.clockouttime}
                        sx={userStyle.input}
                        id="component-outlined"
                      />
                    )}
                  </FormControl>
                  {showdata.statusvalue ? null : (
                    <Typography sx={{ textAlign: "left" }}>
                      <b>IP:</b> {showdata.clockoutipaddress}
                    </Typography>
                  )}
                </Grid>
                {showdata.statusvalue ? null : (
                  <Grid item md={1} lg={1}>
                    <IconButton aria-label="Example" sx={{ marginTop: "5px" }}>
                      {showdata.statusvalue !== "Absent" ? (
                        <FaEdit
                          onClick={(e) => {
                            setIsanoRead(!isanoRead);
                          }}
                          style={{
                            color: isanoRead ? "green" : "red",
                            cursor: "pointer",
                          }}
                          fontSize="small"
                          onChange={(e) => {
                            setShowdata(...showdata, showdata.clockouttime);
                          }}
                        />
                      ) : (
                        <FaEdit
                          style={{ color: "gray", cursor: "not-allowed" }}
                          fontSize="small"
                        />
                      )}
                    </IconButton>
                  </Grid>
                )}
                <br />
                <br />
                <br />
                <br />
                <Grid
                  container
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Box>
                    <div className="total-hours-container">
                      {showdata.statusvalue !== "Absent" && timesDifference ? (
                        <div className="total-hours-value">
                          {timesDifference}
                        </div>
                      ) : (
                        <div className="total-hours-value">00:00:00</div>
                      )}
                    </div>
                  </Box>
                </Grid>
              </Grid>
              <br></br>
              <br></br>
              <Grid container spacing={2}>
                <Grid item md={5} lg={5}></Grid>
                <Grid item md={5} lg={5}></Grid>
                <Grid item md={1} lg={1}></Grid>
                <Grid item md={1} lg={1}></Grid>
                <Grid item md={3} lg={3}></Grid>
              </Grid>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "left" }}>
              <Grid container spacing={2}>
                {showdata.statusvalue ? null : (
                  <Grid item md={3} lg={3}>
                    <>
                      {isRead || isanoRead ? (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={(e) => {
                            postAttendanceData();
                            setIsanoRead(false);
                            setIsRead(false);
                            closeAlert();
                          }}
                        >
                          UPDATE
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={(e) => {
                            postAttendanceData();
                            setIsanoRead(false);
                            setIsRead(false);
                            closeAlert();
                          }}
                        >
                          UPDATE
                        </Button>
                      )}
                    </>
                  </Grid>
                )}

                <Grid item md={3} lg={3}>
                  <Button
                    variant="contained"
                    style={userStyle.btncancel}
                    onClick={(e) => {
                      setIsRead(false);
                      closeAlert();
                      setIsanoRead(false);
                    }}
                  >
                    CANCEL
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Attendancecreate;