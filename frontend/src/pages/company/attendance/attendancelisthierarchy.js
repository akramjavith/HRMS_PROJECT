import React, { useState, useEffect, useContext, useRef } from "react";
import { IconButton, Box, Typography, Paper, TableBody, TextField, List, ListItem, ListItemText, Popover, Checkbox, TableRow, Select, MenuItem, TableCell, FormControl, OutlinedInput, TableContainer, Grid, Table, TableHead, Button, DialogContent, DialogActions, Dialog } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import "jspdf-autotable";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../../services/Baseservice";
import { ExportXL, ExportCSV } from "./exporthierarchy";
import axios from "axios";
import moment from "moment";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import StyledDataGrid from "../../../components/TableStyle";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Selects from "react-select";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import "jspdf-autotable";


function Attendancehierarchy() {

  const gridRef = useRef(null);

  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Attendance_List.png');
        });
      });
    }
  };


  //get current month
  let month = new Date().getMonth() + 1;

  const { auth } = useContext(AuthContext);

  const [statusCheck, setStatusCheck] = useState(false);

  //get current year
  const currentYear = new Date().getFullYear();


  // get current month in string name
  const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthname = monthstring[new Date().getMonth()];

  const [isMonthyear, setIsMonthYear] = useState({ ismonth: month, isyear: currentYear, isuser: "" });
  const [isempdatas, setIsEmpDatas] = useState({});
  const [isempid, setIsEmpid] = useState([]);
  const [isuser, setisuser] = useState([]);
  const [isAttandance, setIsAttandance] = useState({ companyname: "", month: "", year: "" });
  const [showdata, setShowdata] = useState([
    {
      clockintime: "",
      today: "",
      clockouttime: "",
      status: "",
      id: "",
      statusvalue: "",
      userid: "",
      // username: ""
    },
  ]);
  const { isUserRoleAccess, allUsersLimit, isUserRoleCompare } = useContext(UserRoleAccessContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");


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
  const daysInMonth = getDaysInMonth(isMonthyear.isyear, isMonthyear.ismonth);

  // Create an array of days from 1 to the total number of days in the month
  const daysArray = Array.from(new Array(daysInMonth), (val, index) => index + 1);

  const modeDropDowns = [
    { label: "My Hierarchy List", value: "myhierarchy" },
    { label: "All Hierarchy List", value: "allhierarchy" },
    { label: "My + All Hierarchy List", value: "myallhierarchy" },
  ];
  const sectorDropDowns = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
    { label: "All", value: "all" },
  ];
  const [modeselection, setModeSelection] = useState({ label: "My Hierarchy List", value: "myhierarchy" });
  const [sectorSelection, setSectorSelection] = useState({ label: "Primary", value: "Primary" });

  const handleClear = (e) => {
    e.preventDefault()
    setSectorSelection({ label: "Primary", value: "Primary" });
    setModeSelection({ label: "My Hierarchy List", value: "myhierarchy" });
    TableFilterAnother()
  }

  const [levelp, setLevelp] = useState([]);
  const [levels, setLevels] = useState([]);
  const [levelt, setLevelt] = useState([]);

  const [levelpall, setLevelpall] = useState([]);
  const [levelsall, setLevelsall] = useState([]);
  const [leveltall, setLeveltall] = useState([]);

  const [levelpallfinal, setLevelpallfinal] = useState([]);
  const [levelsallfinal, setLevelsallfinal] = useState([]);
  const [leveltallfinal, setLeveltallfinal] = useState([]);

  const hanldefetchEmployee = (userid, dayvalue) => {
    let d = 5;
    let dateval;

    dateval = moment({
      day: dayvalue,
      month: isMonthyear.ismonth - 1, // months in moment are zero-based (0-11)
      year: isMonthyear.isyear,
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
                username: isuser.find((item) => item._id === userid)?.username || "",
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
            date: `${dayvalue <= 9 ? "0" + dayvalue : dayvalue}-${isMonthyear.ismonth <= 9 ? "0" + isMonthyear.ismonth : isMonthyear.ismonth}-${isMonthyear.isyear}`,
            timesDifference: "00:00:00",
            status: "Absent",
            clockinipaddress: "",
            clockoutipaddress: "",
            statusvalue: "Absent",
            username: isuser.find((item) => item._id === userid)?.username || "",
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
  // Excel
  const fileName = "Attendance_Hierarchy_List";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Attendance_Hierarchy",
    pageStyle: "print",
  });



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

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    profileimage: true,
    companyname: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    department: true,
    level: true,
    ...daysArray.reduce((acc, day, index) => {
      acc[`${index + 1}`] = true;
      return acc;
    }, {}),
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = isuser?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
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
            if (rowDataTable?.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable?.map((row) => row.id);
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
          src={params.row.profileimage ? params.row.profileimage : "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg"}
          alt={`Profile Image ${params.row.id}`}
          style={{ borderRadius: "50%", height: "35px" }}
        />
      ),
    },
    { field: "companyname", headerName: "Employee Name", flex: 0, width: 170, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
    { field: "company", headerName: "Company Name", flex: 0, width: 170, hide: !columnVisibility.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch Name", flex: 0, width: 120, hide: !columnVisibility.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit Name", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
    { field: "team", headerName: "Team Name", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
    { field: "department", headerName: "Department Name", flex: 0, width: 120, hide: !columnVisibility.department, headerClassName: "bold-header" },
    { field: "level", headerName: "Level", flex: 0, width: 140, hide: !columnVisibility.level, headerClassName: "bold-header" },
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

  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      profileimage: item.profileimage,
      companyname: item.companyname,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      department: item.department,
      level: modeselection.value === "myhierarchy" && levelp
        ? levelp?.includes(item.companyname) ? "Primary -" + item.control
          : levels && levels?.includes(item.companyname) ? "Secondary -" + item.control
            : levelt && levelt?.includes(item.companyname) ? "Tertiary -" + item.control
              : "dsfa"
        : modeselection.value === "allhierarchy" && levelpall
          ? levelpall?.includes(item.companyname) ? "Primary -" + item.control
            : levelsall && levelsall?.includes(item.companyname) ? "Secondary -" + item.control
              : leveltall && leveltall?.includes(item.companyname) ? "Tertiary -" + item.control
                : ""
          :
          levelpallfinal && [...levelpallfinal]?.includes(item.companyname) ? "Primary -" + item.control
            : levelsallfinal && [...levelsallfinal]?.includes(item.companyname) ? "Secondary -" + item.control
              : leveltallfinal && [...leveltallfinal]?.includes(item.companyname) ? "Tertiary -" + item.control
                : "",
      days: daysArray.map((dayvalue, index) => {
        let isFutureDate = dayvalue > currentDay;
        return {
          isFutureMonthCell: currentYear === isMonthyear.isyear && isMonthyear.ismonth > currentMonth,
          isFutureDate: isFutureDate && isMonthyear.ismonth === currentMonth && currentYear === isMonthyear.isyear,
          dayData: isFutureDate && isMonthyear.ismonth === currentMonth && currentYear === isMonthyear.isyear
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
      month: isMonthyear.ismonth - 1, // months in moment are zero-based (0-11)
      year: isMonthyear.isyear,
    }).format('DD-MM-YYYY');


    if (isempid?.includes(userid)) {
      if (isempdatas[userid]?.includes(dateval)) {
        let reqval = await axios.post(`${SERVICE.ATTANDANCE_STATUS_USERDATE}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          },

          userid: String(userid),
          staffcurrentdate: String(dateval),
        });
        let stringval = reqval?.data?.attendanceresult[0].clockintime
        let stringvalclockout = reqval?.data?.attendanceresult[0].clockouttime
        let stringvalip = reqval?.data?.attendanceresult[0].clockinipaddress

        return (
          // String(stringval)
          String((stringval) + " /" + (stringvalclockout ? stringvalclockout : "00 : 00 : 00") + " /" + (stringvalip))
        );
      }
    }
    return (
      "Absent"
    );
  };


  const rowDataTableexcel = filteredData?.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      profileimage: item.profileimage,
      companyname: item.companyname,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      department: item.department,
      level: modeselection.value === "myhierarchy" && levelp
        ? levelp?.includes(item.companyname) ? "Primary -" + item.control
          : levels && levels?.includes(item.companyname) ? "Secondary -" + item.control
            : levelt && levelt?.includes(item.companyname) ? "Tertiary -" + item.control
              : "dsfa"
        : modeselection.value === "allhierarchy" && levelpall
          ? levelpall?.includes(item.companyname) ? "Primary -" + item.control
            : levelsall && levelsall?.includes(item.companyname) ? "Secondary -" + item.control
              : leveltall && leveltall?.includes(item.companyname) ? "Tertiary -" + item.control
                : ""
          :
          levelpallfinal && [...levelpallfinal]?.includes(item.companyname) ? "Primary -" + item.control
            : levelsallfinal && [...levelsallfinal]?.includes(item.companyname) ? "Secondary -" + item.control
              : leveltallfinal && [...leveltallfinal]?.includes(item.companyname) ? "Tertiary -" + item.control
                : "",
      days: daysArray.map((dayvalue, index) => {
        let isFutureDate = dayvalue > currentDay;
        return {
          isFutureMonthCell: currentYear === isMonthyear.isyear && isMonthyear.ismonth > currentMonth,
          isFutureDate: isFutureDate && isMonthyear.ismonth === currentMonth && currentYear === isMonthyear.isyear,
          dayData: isFutureDate && isMonthyear.ismonth === currentMonth && currentYear === isMonthyear.isyear
            ? null
            : hanldefetchEmployeeexcel(item._id, dayvalue),
        };
      }), // Fixed the syntax error here
    };
  });



  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
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

  // const userName = isUserRoleAccess.userName;
  const [assignprofileimg, setAssignprofileimg] = useState();
  const [isRead, setIsRead] = useState(false);
  const [isanoRead, setIsanoRead] = useState(false);
  const [timesDifference, setTimeDifference] = useState("");
  const getAssignedbyProfile = async () => {
    try {
      let res_project = await axios.get(`${SERVICE.USERALLLIMIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssignprofileimg(res_project.data.userss);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const TableFilter = async () => {
    setIsAttandance(false)
    try {
      let res_employee = await axios.post(SERVICE.ATTENDANCE_HIERARCHYFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        hierachy: modeselection.value,
        sector: sectorSelection.value,
        username: isUserRoleAccess.companyname,
        team: isUserRoleAccess.team,
      });
      setisuser(res_employee.data.resultAccessFilter);
      setLevelp(res_employee.data.primaryhierarchy);
      setLevels(res_employee.data.secondaryhierarchy);
      setLevelt(res_employee.data.tertiaryhierarchy);
      setLevelpall(res_employee.data.primaryhierarchyall);
      setLevelsall(res_employee.data.secondaryhierarchyall);
      setLeveltall(res_employee.data.tertiaryhierarchyall);
      // primaryhierarchyfinal,
      setLevelpallfinal(res_employee.data.primaryhierarchyfinal);
      setLevelsallfinal(res_employee.data.secondaryhierarchyfinal);
      setLeveltallfinal(res_employee.data.tertiaryhierarchyfinal);
      setIsAttandance(true)
      setStatusCheck(true)
    } catch (err) {setIsAttandance(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const TableFilterAnother = async () => {
    try {
      let res_employee = await axios.post(SERVICE.ATTENDANCE_HIERARCHYFILTERANOTHER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username: isUserRoleAccess.companyname,
      });
      setisuser(res_employee?.data?.resulted);
      setLevelp(res_employee?.data?.primaryhierarchy);
      setLevels(res_employee?.data?.secondaryhierarchy);
      setLevelt(res_employee?.data?.tertiaryhierarchy);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    TableFilterAnother();
  }, []);

  const HandleTablesubmit = (e) => {
    e.preventDefault();
    if (modeselection.value === "Please Select Mode") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Mode"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (sectorSelection.value === "Please Select Sector") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Sector"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      TableFilter();
    }
  };

  useEffect(() => {
    fetchAttendance();
    getAssignedbyProfile();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [allUsersLimit]);

  const handleChangeAttendance = async (e) => {
    try {
      let res = await axios.post(SERVICE.USERFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userlogin: String(isMonthyear.isuser),
      });
      setisuser(res?.data?.attandancefilter);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isMonthyear.isuser == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee "}</p>
        </>
      );
      handleClickOpenerr();
    } else {
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
      if (req.data.attendanceresult?.length != 0) {
        setShowdata({
          ...showdata,
          statusvalue: "",
          clockintime: req.data.attendanceresult[0].clockintime ? req.data.attendanceresult[0].clockintime : "00:00:00",
          clockouttime: req.data.attendanceresult[0].clockouttime ? req.data.attendanceresult[0].clockouttime : "00:00:00",
          buttonstatus: req.data.attendanceresult[0].buttonstatus ? req.data.attendanceresult[0].buttonstatus : "",
          clockinipaddress: req.data.attendanceresult[0].clockinipaddress ? req.data.attendanceresult[0].clockinipaddress : "",
          clockoutipaddress: req.data.attendanceresult[0].clockoutipaddress ? req.data.attendanceresult[0].clockoutipaddress : "",
          userid: req.data.attendanceresult[0].userid ? req.data.attendanceresult[0].userid : "",
          username: req.data.attendanceresult[0].username ? req.data.attendanceresult[0].username : "",
          status: req.data.attendanceresult[0].status ? req.data.attendanceresult[0].status : null,
          date: req.data.attendanceresult[0].date ? req.data.attendanceresult[0].date : "",
          id: req.data.attendanceresult[0]._id ? req.data.attendanceresult[0]._id : "",
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
    } else if (showdata.buttonstatus == "true" && moment(today).format("DD-MM-YYYY") == showdata.date) {
      // Calculate time difference with current time
      difference = moment.duration(currentTime.diff(clockInTime));
    } else if (showdata.buttonstatus == "true" && moment(today).format("DD-MM-YYYY") != showdata.date) {
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
    { title: "Level", field: "level" },
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
            level: t.level,
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
        { title: "Level", dataKey: "level" },
        // Add dynamic columns for daysArray
        ...daysArray.map((_, index) => ({ title: `Day${index + 1}`, dataKey: `Day${index + 1}` })),
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
        level: row.level,
      }));

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 4,
        },
        columns: fixedColumns,
        body: formattedResult,
      });

      doc.save("Attendance_List_Hierarchy.pdf");
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const fetchData = async () => {
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
          level: t.level,
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

  };

  useEffect(() => {
    fetchData()
  }, [isuser, items])



  return (
    <Box>
      <Headtitle title={"Attendance"} />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("lattendancelistheirarchy") && (
        <Box>
          <Grid display="flex">
            <Typography sx={userStyle.HeaderText}>Attendance Manager</Typography>
          </Grid>
          <Box sx={userStyle.dialogbox}>
            <Grid container spacing={2}>
              <Grid item lg={2} md={2.5} xs={12} sm={6}>
                <Selects options={modeDropDowns} styles={colourStyles} value={{ label: modeselection.label, value: modeselection.value }} onChange={(e) => { setModeSelection(e); setisuser([]); }} />
              </Grid>
              <Grid item lg={2} md={2.5} xs={12} sm={6}>
                <Selects options={sectorDropDowns} styles={colourStyles} value={{ label: sectorSelection.label, value: sectorSelection.value }} onChange={(e) => { setSectorSelection(e); setisuser([]); }} />
              </Grid>
              <Grid item lg={1} md={1} xs={12} sm={6}>
                <Button variant="contained" onClick={(e) => HandleTablesubmit(e)}>
                  Filter
                </Button>
              </Grid>
              <Grid item lg={3} md={1} xs={12} sm={6}>
                <Button sx={userStyle.btncancel}
                  onClick={(e) => handleClear(e)}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
          <br />
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>Attendance Hierarchy List</Typography>
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
                      {/* <MenuItem value={isuser?.length}>All</MenuItem> */}
                    </Select>
                  </Box>
                </Grid>
                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box>
                    {isUserRoleCompare?.includes("excelattendancelist") && (
                      <>
                        <ExportXL
                          rowDataTableexcel={rowDataTableexcel}
                          daysArray={daysArray}
                          fileName={fileName}
                        />
                      </>
                    )}
                    {isUserRoleCompare?.includes("csvattendancelist") && (
                      <>
                        <ExportCSV
                          rowDataTableexcel={rowDataTableexcel}
                          daysArray={daysArray}
                          fileName={fileName}
                        />
                      </>
                    )}
                    {isUserRoleCompare?.includes("printattendancelist") && (
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={handleprint}
                        >
                          &ensp;
                          <FaPrint />
                          &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfattendancelist") && (
                      <>
                        <Button sx={userStyle.buttongrp}
                          onClick={() => downloadPdf()}
                        >
                          <FaFilePdf />
                          &ensp;Export to PDF&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("imageattendancelist") && (
                      <Button sx={userStyle.buttongrp}
                        onClick={handleCaptureImage}
                      >
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
              {!isuser ? (
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
                    {isAttandance ? (
                      <>
                        <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                          rows={rowsWithCheckboxes}
                          columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                          onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows}
                          autoHeight={true} ref={gridRef} density="compact" hideFooter
                          getRowClassName={getRowClassName} disableRowSelectionOnClick
                        />
                      </>
                    ) : (
                      <>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                      </>
                    )}

                  </Box>
                  <Box style={userStyle.dataTablestyle}>
                    <Box>
                      Showing {filteredData?.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas?.length)} of {filteredDatas?.length} entries
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

            </>

          </Box>
        </Box>
      )}



      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>S.No</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Employee Name</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Company Name</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Branch Name</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Unit Name</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Team Name</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Department Name</TableCell>
              <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Level</TableCell>

              {daysArray && (
                daysArray.map(({ dayName }, i) => (
                  <React.Fragment key={i}>
                    <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>{i + 1} </TableCell>
                  </React.Fragment>
                ))
              )}
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
                  <TableCell>{row.level}</TableCell>

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
          <DialogContent sx={{ width: "600px", textAlign: "center", alignItems: "center", padding: "20px" }}>
            <Box>
              <Grid container spacing={2}>
                <Grid item md={6} lg={6}>
                  <Typography sx={{ textAlign: "left", color: showdata.statusvalue ? "red" : "green" }}>
                    <b>{showdata.statusvalue ? showdata.statusvalue : "Present"}</b>
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
                          setShowdata({ ...showdata, clockintime: e.target.value });
                        }}
                      />
                    ) : (
                      <OutlinedInput readOnly value={showdata.clockintime} size="small" sx={userStyle.input} id="component-outlined" />
                    )}
                  </FormControl>
                  {showdata.statusvalue ? null : (
                    <Typography sx={{ textAlign: "left" }}>
                      <b>IP:</b> {showdata.statusvalue ? null : showdata.clockinipaddress}
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
                          style={{ color: isRead ? "green" : "red", cursor: "pointer" }}
                          fontSize="small"
                        />
                      ) : (
                        <FaEdit style={{ color: "gray", cursor: "not-allowed" }} fontSize="small" />
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
                          setShowdata({ ...showdata, clockouttime: e.target.value });
                        }}
                      />
                    ) : (
                      <OutlinedInput size="small" value={showdata.clockouttime} sx={userStyle.input} id="component-outlined" />
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
                          style={{ color: isanoRead ? "green" : "red", cursor: "pointer" }}
                          fontSize="small"
                          onChange={(e) => {
                            setShowdata(...showdata, showdata.clockouttime);
                          }}
                        />
                      ) : (
                        <FaEdit style={{ color: "gray", cursor: "not-allowed" }} fontSize="small" />
                      )}
                    </IconButton>
                  </Grid>
                )}
                <br />
                <br />
                <br />
                <br />
                <Grid container sx={{ display: "flex", justifyContent: "center" }}>
                  <Box>
                    <div className="total-hours-container">{showdata.statusvalue !== "Absent" && timesDifference ? <div className="total-hours-value">{timesDifference}</div> : <div className="total-hours-value">00:00:00</div>}</div>
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

export default Attendancehierarchy;