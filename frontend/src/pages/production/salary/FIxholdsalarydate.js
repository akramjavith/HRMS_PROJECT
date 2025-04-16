import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";

// Cell Renderer Components

const ButtonCellRenderer = (props) => {
  const { data, node } = props;
  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const { employees } = props.context;

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [storedIds, setStoredIds] = useState([]);

  useEffect(() => {
    const storedIdsJSON = localStorage.getItem('userIds');
    if (storedIdsJSON) {
      setStoredIds(JSON.parse(storedIdsJSON));
    }
  }, []);

  const confirmSubmit = async (e) => {
    // let oldholdpercentvalue = node.data.holdpercent
    e.preventDefault();
    try {
      if (node.data.status == "Choose Status" || node.data.status == undefined || node.data.status == "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Status"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(3);
      } else if (!node.data.status.includes("HOLD") && (node.data.changedate == "Choose Date" || node.data.changedate == undefined || node.data.changedate == "")) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Date"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(3);
      }

      else if (node.data.status !== "Choose Status" && node.data.status.split("_")[1] === "HOLD" && node.data.holdpercent != 100) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Hold Percent should not be less than 100"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(3);
      }
      else if (Number(node.data.holdpercent) >= 0 && Number(node.data.holdpercent) < 100 && (node.data.paydate === "" || node.data.paidstatus === "" || node.data.paidstatus === undefined || node.data.paydate === undefined) && (node.data.status == "Choose Status" || node.data.changedate === "Choose Date" || node.data.changedate === "" || node.data.status === "")) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose status and date"}</p>
          </>
        );
        handleClickOpenerr();
      }

      else if (Number(node.data.holdpercent) > 0 && node.data.reason === "") {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Reason"}</p>
          </>
        );
        handleClickOpenerr();
        console.log(5);
      }

      else {

        let oldholdpercentvalue = Number(node.data.holdpercent) / 100
        let finalsalary = Number(node.data.finalusersalary);
        let holdpercentAmount = (finalsalary * oldholdpercentvalue);

        if (Number(node.data.holdpercent) == 100) {

          let res = await axios.post(`${SERVICE.CONFIRM_FIXHOLDSALARY_LOGUPDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data.innerId,
            logid: node.data._id,
            holdsalaryconfirm: "No"
          });


          if (res.statusText === "OK") {

            const updatedIds = [...storedIds, node.data._id];
            localStorage.setItem('userIds', JSON.stringify(updatedIds));
            setStoredIds(updatedIds);
          }
        }
        else if (Number(node.data.holdpercent) > 0 && Number(node.data.holdpercent) < 100) {


          let res = await axios.post(`${SERVICE.CONFIRM_FIXHOLDSALARYDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data.innerId,
            logid: node.data._id,
            logdata:
              [
                {
                  status: "holdstatusrelease",
                  statuspage: "fixholdsalary",
                  holdsalaryconfirm: "No",
                  holdreleaseconfirm: "Yes",
                  matchid: node.data._id,
                  outerId: node.data.outerId,
                  innerId: node.data.innerId,
                  currentmonthavg: node.data.currentmonthavg,
                  currentmonthattendance: node.data.currentmonthattendance,
                  companyname: node.data.companyname,
                  company: node.data.company,
                  branch: node.data.branch,
                  unit: node.data.unit,
                  empcode: node.data.empcode,
                  legalname: node.data.legalname,
                  designation: node.data.designation,
                  team: node.data.team,
                  department: node.data.department,

                  totalnumberofdays: node.data.totalnumberofdays,
                  totalshift: node.data.totalshift,
                  clsl: node.data.clsl,

                  totalasbleave: node.data.totalasbleave,
                  totalpaidDays: node.data.totalpaidDays,
                  targetpoints: node.data.targetpoints,
                  acheivedpoints: node.data.achievedpoints,

                  acheivedpercent: node.data.achieved,
                  penaltyamount: node.data.penaltyamount,
                  accountholdername: node.data.accountholdername,
                  bankname: node.data.bankname,
                  accountnumber: node.data.accountno,
                  ifsccode: node.data.ifsccode,
                  releaseamount: "",
                  otherdeductionamount: "",
                  totalexcess: "",
                  totaladvance: "",
                  payamount: "",
                  paidstatus: node.data.paidstatus,
                  approvedby: "",
                  description: "",
                  recheckreason: "",
                  updatedpaidstatus: node.data.status === "Choose Status" ? "" : node.data.status,
                  updatechangedate: node.data.changedate === "Choose Date" ? "" : node.data.changedate,
                  updatedholdpercent: node.data.holdpercent,
                  payamount: (Number(node.data.balanceamount) - (Number(node.data.balanceamount) * oldholdpercentvalue)).toFixed(2),
                  balanceamount: (Number(node.data.balanceamount) * oldholdpercentvalue).toFixed(2),
                  updatedholdreason: node.data.reason,
                  payonsalarytype: node.data.payonsalarytype,
                  paymonth: node.data.paymonth,
                  payyear: node.data.payyear,
                  paydate: node.data.paydate,
                  finalusersalary: node.data.finalusersalary
                },


              ]
          });
          let resConfirm = await axios.post(`${SERVICE.CONFIRM_FIXHOLDSALARY_LOGUPDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data.innerId,
            logid: node.data._id,
            holdsalaryconfirm: "No"
          });

          if (res.statusText === "OK") {

            const updatedIds = [...storedIds, node.data._id];
            localStorage.setItem('userIds', JSON.stringify(updatedIds));
            setStoredIds(updatedIds);
          }
        }

        else if (Number(node.data.holdpercent) === 0) {

          let findReleaseYear = node.data.changedate ? node.data.changedate.split("-")[0] : "";
          let findMonthNumber = node.data.changedate ? node.data.changedate.split("-")[1] : -1;
          let findReleaseMonth = monthNames[Number(findMonthNumber) - 2];
          let res = await axios.post(`${SERVICE.CONFIRM_FIXHOLDSALARYDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data.innerId,
            logdata:
              [

                {
                  status: "bankrelease",
                  statuspage: "fixholdsalary",
                  holdsalaryconfirm: "Yes",
                  outerId: node.data.outerId,
                  innerId: node.data.innerId,
                  currentmonthavg: node.data.currentmonthavg,
                  currentmonthattendance: node.data.currentmonthattendance,
                  companyname: node.data.companyname,
                  company: node.data.company,
                  branch: node.data.branch,
                  unit: node.data.unit,
                  empcode: node.data.empcode,
                  legalname: node.data.legalname,
                  designation: node.data.designation,
                  team: node.data.team,
                  department: node.data.department,

                  totalnumberofdays: node.data.totalnumberofdays,
                  totalshift: node.data.totalshift,
                  clsl: node.data.clsl,

                  totalasbleave: node.data.totalasbleave,
                  totalpaidDays: node.data.totalpaidDays,
                  targetpoints: node.data.targetpoints,
                  acheivedpoints: node.data.achievedpoints,

                  acheivedpercent: node.data.achieved,
                  penaltyamount: node.data.penaltyamount,
                  accountholdername: node.data.accountholdername,
                  bankname: node.data.bankname,
                  accountnumber: node.data.accountno,
                  ifsccode: node.data.ifsccode,
                  releaseamount: "",
                  otherdeductionamount: "",
                  totalexcess: "",
                  totaladvance: "",

                  paidstatus: node.data.paidstatus,
                  approvedby: isUserRoleAccess.companyname,
                  description: node.data.logdatalength > 2 ? `Hold Salary: From: ${node.data.payyear} ${node.data.paymonth} - Release: ${findReleaseYear} ${findReleaseMonth}` : `Direct Salary: From: ${node.data.payyear} ${node.data.paymonth} - Release: ${findReleaseYear} ${findReleaseMonth}`,

                  recheckreason: "",
                  updatedpaidstatus: node.data.status === "Choose Status" ? "" : node.data.status,
                  updatechangedate: node.data.changedate === "Choose Date" ? "" : node.data.changedate,
                  updatedholdpercent: node.data.holdpercent,
                  updatedreason: node.data.reason,
                  payonsalarytype: node.data.payonsalarytype,
                  paymonth: node.data.paymonth,
                  payyear: node.data.payyear,
                  paydate: node.data.paydate,
                  finalusersalary: node.data.balanceamount,
                  payamount: (Number(node.data.balanceamount)).toFixed(2),
                  balanceamount: 0,
                },

              ]

          });

          let resConfirm = await axios.post(`${SERVICE.CONFIRM_FIXHOLDSALARY_LOGUPDATE}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: node.data.outerId,
            innerId: node.data.innerId,
            logid: node.data._id,
            holdsalaryconfirm: "Yes"
          });

          if (res.statusText === "OK") {

            const updatedIds = [...storedIds, node.data._id];
            localStorage.setItem('userIds', JSON.stringify(updatedIds));
            setStoredIds(updatedIds);
          }
        }

      }

    } catch (err) {
      const messages = err?.response?.data?.message;
      console.error(messages);
    }
  };

  return (
    <>
      <Button variant="contained" size="small" color="error" disabled={storedIds?.includes(data._id)} onClick={confirmSubmit}>
        {storedIds?.includes(data._id) ? "Confirmed" : "Confirm"}
      </Button>

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
    </>
  )
};

function FixHoldsalarydate() {
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }
  const gridRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const [itemsTwo, setItemsTwo] = useState([]);

  const [lastVisiblePage, setlastVisiblePage] = useState([]);


  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

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
  const holdPercentOpt = [
    { label: 0, value: 0 },
    { label: 25, value: 25 },
    { label: 50, value: 50 },
    { label: 75, value: 75 },
    { label: 100, value: 100 },
  ];
  const [modeselection, setModeSelection] = useState({ label: "My Hierarchy List", value: "myhierarchy" });
  const [sectorSelection, setSectorSelection] = useState({ label: "Primary", value: "Primary" });

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  const [selectAllCheckedTwo, setSelectAllCheckedTwo] = useState(false);

  const [pageTwo, setPageTwo] = useState(1);
  const [pageSizeTwo, setPageSizeTwo] = useState(10);

  const [selectedRowsTwo, setSelectedRowsTwo] = useState([]);
  const [searchQueryTwo, setSearchQueryTwo] = useState("");
  const [searchQueryManageTwo, setSearchQueryManageTwo] = useState("");

  const [copiedData, setCopiedData] = useState("");

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


  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Fix Hold Salary Date Confirm List.png");
        });
      });
    }
  };

  const gridRefContainer = useRef(null);

  const handleCaptureImageNew = () => {
    if (gridRefContainer.current) {
      domtoimage.toBlob(gridRefContainer.current)
        .then((blob) => {
          saveAs(blob, "Fix Hold salary date.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
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

  // Manage TWO Columns
  const [isManageColumnsOpenTwo, setManageColumnsOpenTwo] = useState(false);
  const [anchorElTwo, setAnchorElTwo] = useState(null);

  const handleOpenManageTwoColumns = (event) => {
    setAnchorElTwo(event.currentTarget);
    setManageColumnsOpenTwo(true);
  };
  const handleCloseManageTwoColumns = () => {
    setManageColumnsOpenTwo(false);
    setSearchQueryManageTwo("");
  };

  const openTwo = Boolean(anchorElTwo);
  const idTwo = openTwo ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "hidden",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      // fontSize: "11px",
      fontWeight: "bold !important",
      lineHeight: "17px",
      whiteSpace: "normal", // Wrap text within the available space
      overflow: "visible", // Allow overflowed text to be visible
      minWidth: "20px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: "50px !important",
      // background: "#b7b3b347",
      padding: 0,
      maxHeight: "51px",
    },
    "& .MuiDataGrid-row": {
      fontSize: "13px", // Change the font size for row data
      minWidth: "20px",
      color: "black",
      // Add any other styles you want to apply to the row data
    },

    "& .MuiDataGrid-cell[data-field='prodlossdeduction']": {
      backgroundColor: "#2f87187a !important",
    },

    "& .MuiDataGrid-row.Mui-selected": {
      "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
        backgroundColor: "unset !important", // Clear the background color for selected rows
      },
    },
  }));
  const initialColumnVisibilityTwo = {
    serialNumber: true,
    checkbox: true,
    department: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    holdreleasesonconfirm: true,
    reason: true,
    plusminusamount: true,
    designation: true,
    employeename: true,
    aadharname: true,
    confirmation: true,
    finalusersalary: true,
    balanceamount: true,
    payamount: true,
    payyear: true,
    paymonth: true,

    bankname: true,
    accountnumber: true,
    accountno: true,
    ifsccode: true,

    updatechangedate: true,
    updatedpaidstatus: true,
    actions: true,
    updatedholdpercent: 1,
    updatedreason: 1,
  };

  const [columnVisibilityTwo, setColumnVisibilityTwo] = useState(initialColumnVisibilityTwo);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const handleClear = (e) => {
    e.preventDefault();
    setPage(1);
    setPageSize(10);
    setSelectedYear(yyyy);
    setSelectedMonth(currentMonth);
    setSelectMonthName(currentMonth);
    setSelectedMonthNum(mm);
    setFilteredData([]);
    setItemsTwo([]);
  };

  const columns = [
    // Serial number column
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Empcode", dataKey: "empcode" },
    // { title: "Aadhar Name", dataKey: "legalname" },
    { title: "TTS Name", dataKey: "employeename" },
    { title: "Designation", dataKey: "designation" },

    { title: "Team", dataKey: "team" },

    { title: "totalnumberofdays", dataKey: "totalnumberofdays" },
    { title: "Total Shift", dataKey: "totalshift" },
    { title: "CL/SL", dataKey: "clsl" },
    { title: "Total Absent/Leave", dataKey: "totalasbleave" },
    { title: "Total Paid Days", dataKey: "totalpaidDays" },

    { title: "Target Points", dataKey: "targetpoints" },
    { title: "Achieved Points", dataKey: "achievedpoints" },
    { title: "Achieved %", dataKey: "achieved" },

    { title: "Penalty Amount", dataKey: "penaltyamount" },

    { title: "Salary Amount", dataKey: "finalusersalary" },
    // { title: "Pay Amount", dataKey: "payamount" },
    { title: "Balance Amount", dataKey: "balanceamount" },

    { title: "Status", dataKey: "updatedpaidstatus" },
    { title: "Change Date", dataKey: "updatedpaydate" },
    { title: "Pay Year", dataKey: "payyear" },
    { title: "Pay Month", dataKey: "paymonth" },
    { title: "Hold %", dataKey: "holdpercent" },
    { title: "Hold Reason", dataKey: "reason" },

  ];

  const columnsTwo = [
    // Serial number column
    { title: "SNo", dataKey: "serialNumber" },
    { title: "Company", dataKey: "company" },
    { title: "Branch", dataKey: "branch" },
    { title: "Unit", dataKey: "unit" },
    { title: "Empcode", dataKey: "empcode" },
    { title: "Aadhar Name", dataKey: "legalname" },
    { title: "TTS Name", dataKey: "employeename" },
    { title: "Designation", dataKey: "designation" },

    { title: "Team", dataKey: "team" },

    { title: "totalnumberofdays", dataKey: "totalnumberofdays" },
    { title: "Total Shift", dataKey: "totalshift" },
    { title: "CL/SL", dataKey: "clsl" },
    { title: "Total Absent/Leave", dataKey: "totalasbleave" },
    { title: "Total Paid Days", dataKey: "totalpaidDays" },

    { title: "Target Points", dataKey: "targetpoints" },
    { title: "Achieved Points", dataKey: "achievedpoints" },
    { title: "Achieved %", dataKey: "achieved" },

    { title: "Penalty Amount", dataKey: "penaltyamount" },

    { title: "Salary Amount", dataKey: "finalusersalary" },
    { title: "+/- Amount", dataKey: "plusminusamount" },
    { title: "Balance Amount", dataKey: "balanceamount" },

    { title: "Status", dataKey: "updatedpaidstatus" },
    { title: "Change Date", dataKey: "updatechangedate" },
    { title: "Pay Year", dataKey: "payyear" },
    { title: "Pay Month", dataKey: "paymonth" },
    { title: "Hold %", dataKey: "updatedholdpercent" },
    { title: "Hold Reason", dataKey: "reason" },

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

    doc.save("Fix Hold Salary List.pdf");
  };


  const downloadPdfTwo = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const maxColumnsPerPage = 15; // Maximum number of columns per page
    const totalPages = Math.ceil(columnsTwo.length / maxColumnsPerPage); // Calculate total pages needed

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const startIdx = (currentPage - 1) * maxColumnsPerPage;
      const endIdx = Math.min(startIdx + maxColumnsPerPage, columnsTwo.length);

      const currentPageColumns = columnsTwo.slice(startIdx, endIdx);

      doc.autoTable({
        theme: "grid",
        styles: {
          fontSize: 5,
        },
        columns: currentPageColumns,
        body: rowDataTableTwo,
      });

      if (currentPage < totalPages) {
        doc.addPage(); // Add a new page if there are more columns to display
      }
    }

    doc.save("Fix Hold Salary Date Confirm List.pdf");
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Fix Hold Salary Date List",
    pageStyle: "print",
  });

  //print...
  const componentRefTwo = useRef();
  const handleprintTwo = useReactToPrint({
    content: () => componentRefTwo.current,
    documentTitle: "Fix Hold Salary Date Confrim List",
    pageStyle: "print",
  });


  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);


  const [rowData, setRowData] = useState([]);

  const handleSubmit = async (e) => {
    setIsActive(true);
    try {

      let Res = await axios.post(SERVICE.HIERARCHI_SALARY_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        hierachy: modeselection.value,
        sector: sectorSelection.value,
        username: isUserRoleAccess.companyname,
        team: isUserRoleAccess.team,
      });

      if (Res.data.resultAccessFilter.length > 0) {


        let employees = Res.data.resultAccessFilter.map((item) => item.companyname);


        let Res_Data = await axios.post(SERVICE.FETCH_PAYRUNLIST_MONTHWISE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          month: selectedMonth,
          year: String(selectedYear),
        });


        let mergedData = Res_Data.data.payrunlists.map(item => ({ data: item.data.map(t => ({ ...t, outerId: item._id })) })).map(d => d.data).flat();



        let mergedDatafinal = mergedData.filter(d => employees.includes(d.companyname) && d.sentfixsalary === "Yes")?.sort((a, b) => {
          // First, sort by experienceinmonth
          if (Number(b.experience) !== Number(a.experience)) {
            return Number(b.experience) - Number(a.experience);
          }
          // If experienceinmonth is the same, sort by employeename
          return a.companyname.localeCompare(b.companyname);
        });

        //SECOND TABLE
        let addserialnumberfilteredTabletwo = mergedDatafinal.filter(d => d.fixsalarydateconfirm === "Yes").reduce((acc, item) => {
          return acc.concat(item.logdata);
        }, []);

        let finalitemsTabletwo = addserialnumberfilteredTabletwo.filter(d => (d.holdreleaseconfirm === "Rejected" || d.holdreleaseconfirm === "Approved" || d.holdreleaseconfirm === "Yes") && (d.statuspage === "fixholdsalary" || d.statuspage === "fixsalary") && (d.status === "holdstatusrelease")).map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
        setItemsTwo(finalitemsTabletwo);

        //first table
        let addserialnumberfilteredHold = mergedDatafinal.filter(d => d.fixsalarydateconfirm === "Yes").reduce((acc, item) => {
          return acc.concat(item.logdata);
        }, []);

        let finalitemsHoldOne = addserialnumberfilteredHold.filter(d => (d.holdsalaryconfirm !== "Yes" && (d.statuspage === "fixsalary" || d.statuspage === "fixholdsalary") && (d.status === "holdrelease" || d.status === "holdbankrelease"))).map((item, index) => ({
          ...item,

        }))

        console.log(finalitemsHoldOne, 'finalitemsHoldOne')

        let prodDateFix = await axios.post(SERVICE.PAIDDATEFIX_FITLERED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          month: selectmonthname,
          year: selectedYear,
        });
        let prodDateFixFuture = await axios.get(SERVICE.PAIDDATEFIX_FUTUREDATEONLY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

        });
        let futurePaidDates = prodDateFixFuture.data.paiddatefixs
        console.log(futurePaidDates, 'futurePaidDates')
        let paidDatesFixed = prodDateFix.data.paiddatefixs;

        let res_employee = await axios.post(SERVICE.PAIDSTATUSFIX_FILTERED, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          month: selectmonthname,
          year: String(selectedYear),

        });

        let paidStatusFixDeptModeOnly = res_employee.data.paidstatusfixs;


        let addSerialNumber = finalitemsHoldOne.map((item, index) => {
          console.log(item, mergedDatafinal, 'item')
          let findLogData = mergedDatafinal.find(d => item.innerId == d._id)?.logdata;
          let filteredBankReleaseDate = findLogData.filter(data => data.status === "bankrelease" || ((data.holdreleaseconfirm === "Yes" || data.holdreleaseconfirm === "Rejected") && data.status === "holdstatusrelease" && data.holdsalaryconfirm === "No"));
          let totalPayAmount = filteredBankReleaseDate && filteredBankReleaseDate.length > 0 ? filteredBankReleaseDate.reduce((sum, obj) => Number(sum) + Number(obj.payamount), 0) : 0;

          let paidStatusVal = item.updatedpaidstatus ? item.updatedpaidstatus : item.paidstatus;


          let deptFiltered = paidStatusFixDeptModeOnly.filter((d) => d.department.includes(item.department));

          const order = ["FIRST", "SECOND", "THIRD", "LAST", "HOLD", "REJECT", "ADV1", "ADV2", "MISS"];

          let sorted = deptFiltered.sort((a, b) => {
            // Dates are the same, sort by name according to the order array
            const nameA = order.indexOf(a.paidstatus?.split("_")[1]);
            const nameB = order.indexOf(b.paidstatus?.split("_")[1]);
            return nameA - nameB;
          });

          const inD = sorted.findIndex((d) => d.paidstatus.includes(paidStatusVal?.split("_")[1]));

          // Filter the array to get elements after the found index
          const resultStatus = sorted.slice(inD + 1);

          let finalresultStatus = resultStatus.map((d) => d.paidstatus);


          const order2 = ["FIRST", "SECOND", "THIRD", "LAST", "HOLD", "REJECT", "ADVANCE1", "ADVANCE2", "MISS"];

          let sortedDateFix = paidDatesFixed.filter((data) => data.department.includes(item.department)).sort((a, b) => {
            // Dates are the same, sort by name according to the order array
            const nameA = order2.indexOf(a.paymode);
            const nameB = order2.indexOf(b.paymode);
            return nameA - nameB;
          });

          const inDDatefix = sortedDateFix.findIndex((d) => d.paymode.includes(paidStatusVal?.split("_")[1]));

          let currentDate = new Date();
          const resultStatusDatefix = sortedDateFix.slice(inDDatefix + 1);

          let finalresultStatusDatefix = resultStatusDatefix.map((item) => {
            let datevalue = new Date(item.date) < new Date(currentDate) && item.afterexpiry != "Enable";
            return (datevalue ? `${item.date}(Expired) Choose Next` : item.date)
          })

          let paydatesfinal = finalresultStatusDatefix;
          let futurePaidDatesOnly = futurePaidDates.filter((data) => data.department.includes(item.department)).map(d => d.date)
          console.log(futurePaidDatesOnly, 'futurePaidDatesOnly')
          return {
            ...item,
            serialNumber: index + 1,
            statusopt: finalresultStatus && finalresultStatus.length > 0 ? ["Choose Status", ...finalresultStatus] : ["Choose Status"],
            // dateopt: paydatesfinal && paydatesfinal.length > 0 ? ["Choose Date", ...paydatesfinal] : ["Choose Date"],
            dateopt: futurePaidDatesOnly && futurePaidDatesOnly.length > 0 ? ["Choose Date", ...futurePaidDatesOnly] : ["Choose Date"],
            percentopt: [0, 15, 25, 50, 75, 90, 100],
            holdpercent: 0,
            status: "Choose Status",
            datefixes: paidDatesFixed.filter((data) => data.department.includes(item.department)),
            // payamount: (Number(item.finalusersalary) - (Number(item.finalusersalary) * oldholdpercentvalue)).toFixed(2),
            balanceamount: (Number(item.finalusersalary) - Number(totalPayAmount)).toFixed(2),
            paidstatus: item.updatedpaidstatus ? item.updatedpaidstatus : item.paidstatus,
            paydate: item.updatechangedate ? item.updatechangedate : item.paydate,
            logdatalength: filteredBankReleaseDate ? filteredBankReleaseDate.length : 0
          }
        })

        console.log(addSerialNumber, 'addSerialNumber')

        setRowData(addSerialNumber);
        setFilteredData(addSerialNumber);
        setIsActive(false);
      }

      setIsActive(false);
      setUndoIds([]);
      localStorage.removeItem("userIds");
    } catch (err) {

    }

  }


  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );


  const gridApi = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const onQuickFilterChanged = useCallback((event) => {
    if (gridApi.current) {
      const filterText = event.target.value;
      gridApi.current.setQuickFilter(filterText);
      const filtered = rowData.filter(row => JSON.stringify(row).toLowerCase().includes(filterText.toLowerCase()));
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  }, [rowData]);

  let minRowHeight = 25;
  let currentRowHeight;
  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
    columnApi.current = params.columnApi;
    minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
    currentRowHeight = minRowHeight;
  }, []);

  useEffect(() => {
    updateGridData();
  }, [currentPage, filteredData, pageSize]);

  const updateGridData = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setCurrentData(filteredData.slice(start, end));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page whenever page size changes
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage === 1) {
        pageNumbers.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const columnDataTable = [
    { headerName: "Sno", field: "serialNumber", sortable: true, width: 80, filter: true, resizable: true, pinned: "left" },
    { headerName: "Company", field: "company", sortable: true, filter: true, resizable: true },
    { headerName: "Branch", field: "branch", sortable: true, filter: true, resizable: true },
    { headerName: "Unit", field: "unit", sortable: true, filter: true, resizable: true },
    { headerName: "Emp Code", field: "empcode", sortable: true, filter: true, resizable: true },
    // { headerName: "Aadhar Name", field: "legalname", sortable: true, filter: true, resizable: true },

    { headerName: "TTS Name", field: "employeename", sortable: true, filter: true, resizable: true, pinned: "left" },

    { headerName: "Designation", field: "designation", sortable: true, filter: true, resizable: true },

    { headerName: "Team", field: "team", sortable: true, filter: true, resizable: true },

    { headerName: "Total No.of Days", field: "totalnumberofdays", sortable: true, filter: true, resizable: true },
    { headerName: "Total Shift", field: "totalshift", sortable: true, filter: true, resizable: true },
    { headerName: "CLSL", field: "clsl", sortable: true, filter: true, resizable: true },
    { headerName: "Total Absent/Leave", field: "totalasbleave", sortable: true, filter: true, resizable: true },
    { headerName: "Total Paid Days", field: "totalpaidDays", sortable: true, filter: true, resizable: true },

    { headerName: "Target Points", field: "targetpoints", sortable: true, filter: true, resizable: true },
    { headerName: "Achievedpoints", field: "achievedpoints", sortable: true, filter: true, resizable: true },
    { headerName: "Achieved", field: "achieved", sortable: true, filter: true, resizable: true },

    { headerName: "Penalty Amount", field: "penaltyamount", sortable: true, filter: true, resizable: true },
    { headerName: "Salary Amount", field: "finalusersalary", sortable: true, filter: true, resizable: true },
    // { headerName: "Pay Amount", field: "payamount", sortable: true, filter: true, resizable: true },
    { headerName: "Balance Amount", field: "balanceamount", sortable: true, filter: true, resizable: true },

    {
      headerName: 'Change Date', field: 'changedate', editable: true, cellEditor: 'agSelectCellEditor',

      // cellEditorParams: (params) => {
      //   const rowData = params.node.data;
      //   const statusopt = rowData.status;
      //   const dateOpt = rowData.dateopt;

      //   // let resultStatusDatefix = rowData.datefixes.filter((item) => item.paymode.includes(statusopt?.split("_")[1]));

      //   // let finalresultStatusDatefix = resultStatusDatefix.map((item) => item.date);

      //   // Ensure statusopt is an array
      //   const dropdown2Values = Array.isArray([...dateOpt]) ? [...dateOpt] : [];


      //   return {
      //     values: dropdown2Values
      //   };
      // }
      cellEditorParams: (params) => {
        const rowData = params.node.data;
        const dateopt = rowData.dateopt;
        const statusopt = rowData.statusopt;
        // const paystatus = rowData.paidstatus;

        // let resultStatusDatefix = rowData.datefixes.filter((item) => item.paymode.includes(statusopt?.split("_")[1]));
        // let resultStatusDatefix = statusopt === "Choose Status" ?
        //   rowData.datefixes.filter(item => item.paymode.includes(paystatus?.split("_")[1]))
        //   : rowData.datefixes.filter(item => item.paymode.includes(statusopt?.split("_")[1])
        //   );

        // let currentDate = new Date();

        // let finalresultStatusDatefix = resultStatusDatefix.map((item) => {
        //   const datevalue = new Date(item.date) < currentDate && item.afterexpiry != "Enable";
        //   return {
        //     value: item.date,
        //     label: datevalue ? `${item.date} (Expired)` : item.date,
        //     expired: datevalue
        //   };
        // });

        return {
          values: dateopt, // Only return value for the dropdown


        };

      },

      valueSetter: (params) => {

        if (params.newValue.includes("(Expired)")) {

          alert("You cannot select an expired date. Please Choose Next Date")
          if (params.data.changedate && params.data.changedate.includes("(Expired)")) {
            params.data.changedate = "Choose Date"
          }
          return false;
        } else {
          params.data.changedate = params.newValue
          return true;
        }

      }

    },

    {
      headerName: 'Status', field: 'status', editable: true, cellEditor: 'agSelectCellEditor',

      cellEditorParams: (params) => {
        const rowData = params.node.data;
        const statusopt = rowData.statusopt;

        // Ensure statusopt is an array
        const dropdown1Values = Array.isArray(statusopt) ? statusopt : [];
        // console.log('Dropdown 1 values:', dropdown1Values); // Debugging line

        return {
          values: dropdown1Values
        };
      },
      valueSetter: (params) => {
        const newValue = params.newValue;
        // Retrieve the value selected in 'Status'
        params.data.holdpercent = params.newValue.includes("HOLD") ? 100 : 0
        // params.data.changedate = "Choose Date"
        params.data.status = newValue
        // Return true to indicate value was set successfully
        return true;
      }
    },


    { headerName: "Pay Year", field: "payyear", sortable: true, filter: true, resizable: true },
    { headerName: "Pay Month", field: "paymonth", sortable: true, filter: true, resizable: true },
    {
      headerName: "Hold %", field: "holdpercent", suppressClickEdit: true, sortable: true, editable: true, cellEditor: 'agSelectCellEditor', filter: true, resizable: true,
      cellEditorParams: (params) => {
        const rowData = params.node.data;
        const percentOpt = rowData.percentopt;

        // Ensure statusopt is an array
        const holdValues = Array.isArray(percentOpt) ? percentOpt : [];
        // console.log('Dropdown 1 values:', dropdown1Values); // Debugging line

        return {
          values: holdValues
        };
      }
    },

    {
      headerName: "Hold Reason", field: "reason", editable: true, suppressClickEdit: true, sortable: true,
      filter: true, resizable: true,
      cellEditor: 'agTextCellEditor',
      suppressDestroy: true,

    },

    {
      headerName: 'Sent Confirmation',
      field: 'confirmation',
      cellRenderer: ButtonCellRenderer,
      editable: false,

    },
  ]

  const rowDataTable = currentData.map((item, index) => {
    return {
      ...item,
      id: item._id,
      index: index,
      change: item.change,
      employeename: item.companyname,
      aadharname: item.legalname,
      processcode: item.processcodeexp,
      payonsalarytype: item.payonsalarytype,
      experienceinmonth: item.experience,
      prodexp: item.prodexp,
      reason: "",
      dateopt: item.dateopt,
      achievedpoints: item.acheivedpoints,
      achieved: item.acheivedpercent,

    };
  })

  const context = {
    employees: rowData.map(d => d.companyname)
  }

  const gridRefnew = useRef();

  const columnApi = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(anchorEl);

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseManageColumns = () => {
    setAnchorEl(null);
  };

  const [columnVisibility, setColumnVisibility] = useState(
    columnDataTable.reduce((acc, col) => {
      acc[col.field] = !col.hide;
      return acc;
    }, {})
  );

  const toggleColumnVisibility = (field) => {
    const newVisibility = !columnVisibility[field];
    setColumnVisibility({
      ...columnVisibility,
      [field]: newVisibility
    });
    gridRefnew.current.columnApi.setColumnVisible(field, newVisibility);
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  const filteredColumns = columnDataTable.filter(col =>
    col.headerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initialColumnVisibility = columnDataTable.reduce((acc, col) => {
    acc[col.field] = true;
    return acc;
  }, {});

  const manageColumnsContent = (
    <Box style={{ padding: '10px', minWidth: '325px' }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 5, position: 'absolute' }}
        />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: 'flex' }}
                primary={
                  <Switch
                    sx={{ marginTop: '-5px' }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={column.headerName}
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
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = true;
                });
                setColumnVisibility(newColumnVisibility);
                columnDataTable.forEach((column) => {
                  gridRefnew.current.columnApi.setColumnVisible(column.field, true);
                });
              }}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false;
                });
                setColumnVisibility(newColumnVisibility);
                columnDataTable.forEach((column) => {
                  gridRefnew.current.columnApi.setColumnVisible(column.field, false);
                });
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  //Datatable
  const handlePageChangeTwo = (newPage) => {
    setPageTwo(newPage);
    setSelectedRowsTwo([]);
    setSelectAllCheckedTwo(false);
  };

  const handlePageSizeChangeTwo = (event) => {
    setPageSizeTwo(Number(event.target.value));
    setSelectedRowsTwo([]);
    setSelectAllCheckedTwo(false);
    setPageTwo(1);
  };

  //datatable....
  const handleSearchChangeTwo = (event) => {
    setSearchQueryTwo(event.target.value);
  };
  // Split the search query into individual terms
  const searchTermsTwo = searchQueryTwo.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatasTwo = itemsTwo?.filter((item) => {
    return searchTermsTwo.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
  });

  let filteredDataTwo = filteredDatasTwo.slice((pageTwo - 1) * pageSizeTwo, pageTwo * pageSizeTwo);

  const totalPagesTwo = Math.ceil(filteredDatasTwo.length / pageSizeTwo);

  const visiblePagesTwo = Math.min(totalPagesTwo, 3);

  const firstVisiblePageTwo = Math.max(1, pageTwo - 1);
  const lastVisiblePageTwo = Math.min(firstVisiblePageTwo + visiblePagesTwo - 1, totalPagesTwo);

  const pageTwoNumbersTwo = [];

  const indexOfLastItemTwo = pageTwo * pageSizeTwo;
  const indexOfFirstItemTwo = indexOfLastItemTwo - pageSizeTwo;

  for (let i = firstVisiblePageTwo; i <= lastVisiblePageTwo; i++) {
    pageTwoNumbersTwo.push(i);
  }

  // DATATABLETWO
  const columnDataTableTwo = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllCheckedTwo={selectAllCheckedTwo}
          onSelectAll={() => {
            if (rowDataTableTwo.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllCheckedTwo) {
              setSelectedRowsTwo([]);
            } else {
              const allRowIds = rowDataTableTwo.map((row) => row.id);
              setSelectedRowsTwo(allRowIds);
            }
            setSelectAllCheckedTwo(!selectAllCheckedTwo);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRowsTwo.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRowsTwo.includes(params.row.id)) {
              updatedSelectedRows = selectedRowsTwo.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRowsTwo, params.row.id];
            }

            setSelectedRowsTwo(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllCheckedTwo(updatedSelectedRows.length === filteredDataTwo.length);
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 50,

      hide: !columnVisibilityTwo.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 60,
      hide: !columnVisibilityTwo.serialNumber,
      headerClassName: "bold-header",
    },

    {
      field: "holdreleasesonconfirm",
      headerName: "Confirmation",
      flex: 0,
      width: 140,
      hide: !columnVisibilityTwo.actions,
      headerClassName: "bold-header",
      renderCell: (params) => {
        console.log(params.row.holdreleaseconfirm, 'params')
        return (
          params.row.holdreleaseconfirm === "Rejected" ?
            <>
              <Button variant="contained" size="small" color="error" sx={{ textTransform: "capitalize", border: undoIds.includes(params.row.id) ? "1px solid #1976d2" : "inherit" }} disabled={undoIds.includes(params.row.id)} onClick={(e) => undoSubmit(params.row.id, params.row.outerId, params.row.innerId, params.row.matchid)}>
                {undoIds.includes(params.row.id) ? "Removed" : "Remove-Reject"}
              </Button>
            </>
            :
            <>
              <Typography sx={{ padding: "2px 6px", borderRadius: "3px", backgroundColor: params.row.holdreleaseconfirm === "Yes" ? "#FF9800" : "#009688", color: "white" }}>
                {params.row.holdreleaseconfirm === "Yes" ? "Pending" : params.row.holdreleaseconfirm}

              </Typography>
            </>

        )
      }



    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 0,
      width: 180,
      hide: !columnVisibilityTwo.updatedreason,
    },
    // { field: "department", headerName: "Department", flex: 0, width: 180, hide: !columnVisibilityTwo.department, headerClassName: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, width: 80, hide: !columnVisibilityTwo.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 110, hide: !columnVisibilityTwo.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 80, hide: !columnVisibilityTwo.unit, headerClassName: "bold-header" },
    { field: "empcode", headerName: "Empcode", flex: 0, width: 140, hide: !columnVisibilityTwo.empcode, headerClassName: "bold-header" },
    { field: "legalname", headerName: "Aadhar Name", flex: 0, width: 220, hide: !columnVisibilityTwo.legalname, headerClassName: "bold-header" },
    { field: "employeename", headerName: "Employee Name", flex: 0, width: 220, hide: !columnVisibilityTwo.employeename, headerClassName: "bold-header" },


    { field: "designation", headerName: "Designation", flex: 0, width: 190, hide: !columnVisibilityTwo.designation, headerClassName: "bold-header" },

    { field: "team", headerName: "Team", flex: 0, width: 80, hide: !columnVisibilityTwo.team, headerClassName: "bold-header" },



    { field: "bankname", headerName: "Bank Name", flex: 0, width: 150, hide: !columnVisibilityTwo.bankname },
    { field: "accountnumber", headerName: "Account No", flex: 0, width: 150, hide: !columnVisibilityTwo.accountno },
    { field: "ifsccode", headerName: "IFSC Code", flex: 0, width: 150, hide: !columnVisibilityTwo.ifsccode },

    { field: "finalusersalary", headerName: "Salary Amount", flex: 0, width: 150, hide: !columnVisibilityTwo.salaryamount },
    { field: "plusminusamount", headerName: "+/- Amount", flex: 0, width: 150, hide: !columnVisibilityTwo.plusminusamount },
    { field: "payamount", headerName: "Pay Amount", flex: 0, width: 150, hide: !columnVisibilityTwo.payamount },



    {
      field: "updatedpaidstatus",
      headerName: "Pay Status",
      flex: 0,
      width: 200,
      hide: !columnVisibilityTwo.updatedpaidstatus,
    },

    {
      field: "updatechangedate",
      headerName: "Pay Date",
      flex: 0,
      width: 150,
      hide: !columnVisibilityTwo.updatechangedate,
    },
    { field: "payyear", headerName: "Pay Year", flex: 0, width: 150, hide: !columnVisibilityTwo.payyear },
    { field: "paymonth", headerName: "Pay Month", flex: 0, width: 150, hide: !columnVisibilityTwo.paymonth },
    {
      field: "updatedholdpercent",
      headerName: "Hold %",
      flex: 0,
      width: 150,
      hide: !columnVisibilityTwo.updatedholdpercent,
    },


  ];

  const rowDataTableTwo = filteredDataTwo.map((item, index) => {
    return {
      ...item,
      id: item._id,
      employeename: item.companyname,
      aadharname: item.legalname,
      processcode: item.processcodeexp,
      confirmation: "",
      reason: item.updatedholdreason + " " + (item.rejectreason ? item.rejectreason : ""),
      holdpercent: item.updatedholdpercent,
      status: item.updatedpaidstatus,


    };
  });

  const rowsWithCheckboxesTwo = rowDataTableTwo.map((row) => ({
    ...row,

    checkbox: selectedRowsTwo.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumnsTwo = () => {
    const updatedVisibilityTwo = { ...columnVisibilityTwo };
    for (const columnKey in updatedVisibilityTwo) {
      updatedVisibilityTwo[columnKey] = true;
    }
    setColumnVisibilityTwo(updatedVisibilityTwo);
  };

  useEffect(() => {
    // Retrieve column VisibilityTwo from localStorage (if available)
    const savedVisibilityTwo = localStorage.getItem("columnVisibilityTwo");
    if (savedVisibilityTwo) {
      setColumnVisibilityTwo(JSON.parse(savedVisibilityTwo));
    }
  }, []);

  useEffect(() => {
    // Save column VisibilityTwo to localStorage whenever it changes
    localStorage.setItem("columnVisibilityTwo", JSON.stringify(columnVisibilityTwo));
  }, [columnVisibilityTwo]);

  // // Function to filter columns based on search query
  const filteredColumnsTwo = columnDataTableTwo.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageTwo.toLowerCase()));

  // ManageTwo Columns functionality
  const toggleColumnVisibilityTwo = (field) => {
    setColumnVisibilityTwo((prevVisibilityTwo) => ({
      ...prevVisibilityTwo,
      [field]: !prevVisibilityTwo[field],
    }));
  };

  // JSX for the "ManageTwo Columns" popover content
  const manageColumnsContentTwo = (
    <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
      <Typography variant="h6">ManageTwo Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageTwoColumns}
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
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageTwo} onChange={(e) => setSearchQueryManageTwo(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumnsTwo.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityTwo[column.field]} onChange={() => toggleColumnVisibilityTwo(column.field)} />}
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
            <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityTwo(initialColumnVisibilityTwo)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newColumnVisibilityTwo = {};
                columnDataTableTwo.forEach((column) => {
                  newColumnVisibilityTwo[column.field] = false; // Set hide property to true
                });
                setColumnVisibilityTwo(newColumnVisibilityTwo);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [undoIds, setUndoIds] = useState([]);

  const undoSubmit = async (id, outerId, innerId, matchid) => {
    try {
      let res = await axios.post(`${SERVICE.UPDATE_REMOVE_REJECT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        innerId: innerId,
        logid: id,
        outerId: outerId,
        matchid: matchid

      });
      setUndoIds(prev => [...prev, id])
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


  return (
    <Box>
      <Headtitle title={"Fix Hold Salary Date"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}> Fix Hold Salary Date</Typography>
      {isUserRoleCompare?.includes("afixholdsalarydate") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>

                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={modeDropDowns}
                      value={{ label: modeselection.label, value: modeselection.value }}
                      onChange={(e) => {
                        setModeSelection(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={2} md={2.5} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Level<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={sectorDropDowns}
                      value={{ label: sectorSelection.label, value: sectorSelection.value }}
                      onChange={(e) => {
                        setSectorSelection(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Year<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects options={years} value={{ label: selectedYear, value: selectedYear }} onChange={handleYearChange} />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
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
      {isUserRoleCompare?.includes("lfixholdsalarydate") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Pay Run-Details:</Typography>
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
                    <MenuItem value={rowData?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelfixholdsalarydate") && (
                    <>
                      <ExportXL
                        csvData={rowDataTable.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Empcode: t.empcode,

                          "TTS Name": t.employeename,
                          Designation: t.designation,

                          Team: t.team,

                          "Total No Of Days": Number(t.totalnumberofdays),
                          "Total Shift": Number(t.totalshift),
                          CLSL: Number(t.clsl),
                          "Total Absent/Leave": Number(t.totalasbleave),
                          "Total Paid Dyas": Number(t.totalpaidDays),

                          "Target Points": Number(t.targetpoints),
                          "Achieved Points": Number(t.achievedpoints),
                          "Achieved  %": Number(t.achieved),

                          "Penalty Amount": Number(t.penaltyamount),

                          "Salary Amount": Number(t.finalusersalary),
                          // "Pay Amount": Number(t.payamount),
                          "Balance Amount": Number(t.balanceamount),


                          "Status": t.updatedpaidstatus,
                          "Change Date": t.updatechangedate,

                          "Pay Year": t.payyear,
                          "Pay Month": t.paymonth,
                          "Hold %": t.holdpercent,
                          "Reason": t.updatedreason,



                        }))}
                        fileName={"Fix Hold salay Date List"}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvfixholdsalarydate") && (
                    <>
                      <ExportCSV
                        csvData={rowDataTable.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Empcode: t.empcode,

                          "TTS Name": t.employeename,
                          Designation: t.designation,

                          Team: t.team,

                          "Total No Of Days": Number(t.totalnumberofdays),
                          "Total Shift": Number(t.totalshift),
                          CLSL: Number(t.clsl),
                          "Total Absent/Leave": Number(t.totalasbleave),
                          "Total Paid Dyas": Number(t.totalpaidDays),

                          "Target Points": Number(t.targetpoints),
                          "Achieved Points": Number(t.achievedpoints),
                          "Achieved  %": Number(t.achieved),

                          "Penalty Amount": Number(t.penaltyamount),

                          "Salary Amount": Number(t.finalusersalary),
                          // "Pay Amount": Number(t.payamount),
                          "Balance Amount": Number(t.balanceamount),


                          "Status": t.updatedpaidstatus,
                          "Change Date": t.updatechangedate,

                          "Pay Year": t.payyear,
                          "Pay Month": t.paymonth,
                          "Hold %": t.holdpercent,
                          "Reason": t.updatedreason,



                        }))}
                        fileName={"Fix Hold salay Date List"}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("printfixholdsalarydate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdffixholdsalarydate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagefixholdsalarydate") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImageNew}>
                      {" "}
                      <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <OutlinedInput
                  size="small"
                  variant="outlined"
                  onChange={onQuickFilterChanged}
                  style={{ width: '100%' }}
                />
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
            <Popover
              open={isPopoverOpen}
              anchorEl={anchorEl}
              onClose={handleCloseManageColumns}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              {manageColumnsContent}
            </Popover>

            <br />
            {isActive ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>

                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Box>
              </>
            ) : (
              <>
                <Box
                  style={{
                    // height: 500,
                    width: "100%",
                  }}
                  className="ag-theme-quartz"
                  ref={gridRefContainer}
                >

                  <AgGridReact
                    columnDefs={columnDataTable}
                    ref={gridRefnew}
                    rowData={rowDataTable}
                    context={context}
                    getRowId={(params) => params.data.id}

                    onGridReady={onGridReady}

                    domLayout={"autoHeight"}
                  />

                </Box>

                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers[0] > 1 && <span>...</span>}
                    {pageNumbers.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={currentPage === pageNumber ? 'active' : ''}
                        disabled={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>

                  </Box>
                </Box>
              </>
            )}
          </Box>
        </>
      )}
      <br />
      {/* ****** Table TWO Start ****** */}
      {isUserRoleCompare?.includes("lfixholdsalarydate") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Approval Status</Typography>
            </Grid>
            <br />
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeTwoSelect"
                    value={pageSizeTwo}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChangeTwo}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={itemsTwo?.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelfixholdsalarydate") && (
                    <>
                      <ExportXL
                        csvData={rowDataTableTwo.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Empcode: t.empcode,
                          "Aadhar Name": t.legalname,
                          "Employee Name": t.employeename,
                          Designation: t.designation,
                          Team: t.team,
                          "Bank Name": (t.bankname),
                          "Account No": (t.accountno),
                          "IFSC Code": (t.ifsccode),
                          "Salary Amount": (t.finalusersalary),
                          "+/- Amount": (t.plusminusamount),
                          "Balance Amount": (t.balanceamount),

                          "Paid Status": t.updatedpaidstatus,
                          "Pay Date": t.updatechangedate,
                          "Pay Year": t.payyear,
                          "Pay Month": t.paymonth,
                          "Hold %": t.holdpercent,
                          "Reason": t.updatedreason,


                        }))}
                        fileName={"Fix hold salary Approval Status List"}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvfixholdsalarydate") && (
                    <>
                      <ExportCSV
                        csvData={rowDataTableTwo.map((t, index) => ({
                          Sno: index + 1,
                          Company: t.company,
                          Branch: t.branch,
                          Unit: t.unit,
                          Empcode: t.empcode,
                          "Aadhar Name": t.legalname,
                          "Employee Name": t.employeename,
                          Designation: t.designation,
                          Team: t.team,
                          "Bank Name": (t.bankname),
                          "Account No": (t.accountno),
                          "IFSC Code": (t.ifsccode),
                          "Salary Amount": (t.finalusersalary),
                          "+/- Amount": (t.plusminusamount),
                          "Balance Amount": (t.balanceamount),

                          "Paid Status": t.updatedpaidstatus,
                          "Pay Date": t.updatechangedate,
                          "Pay Year": t.payyear,
                          "Pay Month": t.paymonth,
                          "Hold %": t.holdpercent,
                          "Reason": t.updatedreason,


                        }))}
                        fileName={"Fix hold salary Approval Status List"}
                      />
                    </>
                  )}
                  {isUserRoleCompare?.includes("printfixholdsalarydate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprintTwo}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdffixholdsalarydate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdfTwo()}>
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagefixholdsalarydate") && (
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
                    <OutlinedInput id="component-outlined" type="text" value={searchQueryTwo} onChange={handleSearchChangeTwo} />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsTwo}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageTwoColumns}>
              Manage Columns
            </Button>
            &ensp;
            {/* Manage Column */}
            <Popover
              id={idTwo}
              open={isManageColumnsOpenTwo}
              anchorEl={anchorElTwo}
              onClose={handleCloseManageTwoColumns}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              {manageColumnsContentTwo}
            </Popover>
            {/* {isUserRoleCompare?.includes("bdfixholdsalarydate") && (
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
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    //stop autoscroll
                    disableVirtualization
                    rows={rowsWithCheckboxesTwo}
                    columns={columnDataTableTwo.filter((column) => columnVisibilityTwo[column.field])}
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
                    Showing {filteredDataTwo.length > 0 ? (pageTwo - 1) * pageSizeTwo + 1 : 0} to {Math.min(pageTwo * pageSizeTwo, filteredDatasTwo.length)} of {filteredDatasTwo.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPageTwo(1)} disabled={pageTwo === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChangeTwo(pageTwo - 1)} disabled={pageTwo === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageTwoNumbersTwo?.map((pageTwoNumber) => (
                      <Button key={pageTwoNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeTwo(pageTwoNumber)} className={pageTwo === pageTwoNumber ? "active" : ""} disabled={pageTwo === pageTwoNumber}>
                        {pageTwoNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPagesTwo && <span>...</span>}
                    <Button onClick={() => handlePageChangeTwo(pageTwo + 1)} disabled={pageTwo === totalPagesTwo} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPageTwo(totalPagesTwo)} disabled={pageTwo === totalPagesTwo} sx={userStyle.paginationbtn}>
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
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Emp Code</TableCell>
                <TableCell>TTS Name</TableCell>
                <TableCell>Desination</TableCell>

                <TableCell>Team</TableCell>

                <TableCell>Total No of Dyas</TableCell>
                <TableCell>Total Shift</TableCell>
                <TableCell>CLSL</TableCell>
                <TableCell>Total Absent/Leave</TableCell>
                <TableCell>Total Paid Days</TableCell>

                <TableCell>Target Points</TableCell>
                <TableCell>Achieved Points</TableCell>
                <TableCell>Achieved %</TableCell>


                <TableCell>Penalty Amount</TableCell>
                <TableCell>Salary Amount</TableCell>
                <TableCell>Balance Amount</TableCell>

                <TableCell>Pay on</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Change Date</TableCell>
                <TableCell>Pay Year</TableCell>
                <TableCell>Pay Month</TableCell>
                <TableCell>Hold %</TableCell>
                <TableCell>Reason</TableCell>


              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.empcode}</TableCell>
                    <TableCell>{row.employeename}</TableCell>
                    <TableCell>{row.designation}</TableCell>

                    <TableCell>{row.team}</TableCell>

                    <TableCell>{row.totalnumberofdays}</TableCell>
                    <TableCell>{row.totalshift}</TableCell>
                    <TableCell>{row.clsl}</TableCell>
                    <TableCell>{row.totalasbleave}</TableCell>
                    <TableCell>{row.totalpaidDays}</TableCell>

                    <TableCell>{row.targetpoints}</TableCell>
                    <TableCell>{row.achievedpoints}</TableCell>
                    <TableCell>{row.achieved}</TableCell>

                    <TableCell>{row.penaltyamount}</TableCell>
                    <TableCell>{row.finalusersalary}</TableCell>
                    <TableCell>{row.balanceamount}</TableCell>

                    <TableCell>{row.updatedpaidstatus}</TableCell>
                    <TableCell>{row.updatedpaydate}</TableCell>
                    <TableCell>{row.payyear}</TableCell>
                    <TableCell>{row.paymonth}</TableCell>
                    <TableCell>{row.holdpercent}</TableCell>
                    <TableCell>{row.reason}</TableCell>


                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* print layout */}

        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRefTwo}>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Empcode</TableCell>
                <TableCell>Aadhar Name</TableCell>
                <TableCell>TTS Name</TableCell>
                <TableCell>Designation</TableCell>

                <TableCell>Team</TableCell>

                <TableCell>Bank Name</TableCell>
                <TableCell>Account NO</TableCell>
                <TableCell>IFSC Code</TableCell>

                <TableCell>Salary Amount</TableCell>
                <TableCell>+/- Amount</TableCell>
                <TableCell>Pay Amount</TableCell>

                <TableCell>Pay Status</TableCell>
                <TableCell>Pay Date</TableCell>
                <TableCell>Pay Year</TableCell>
                <TableCell>Pay Month</TableCell>
                <TableCell>Hold %</TableCell>
                <TableCell>Reason</TableCell>

              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTableTwo &&
                rowDataTableTwo.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.empcode}</TableCell>
                    <TableCell>{row.legalname}</TableCell>
                    <TableCell>{row.employeename}</TableCell>
                    <TableCell>{row.designation}</TableCell>

                    <TableCell>{row.team}</TableCell>


                    <TableCell>{row.bankname}</TableCell>
                    <TableCell>{row.accountno}</TableCell>
                    <TableCell>{row.ifsccode}</TableCell>

                    <TableCell>{row.finalusersalary}</TableCell>
                    <TableCell>{""}</TableCell>
                    <TableCell>{row.payamount}</TableCell>

                    <TableCell>{row.updatedpaidstatus}</TableCell>
                    <TableCell>{row.updatechangedate}</TableCell>
                    <TableCell>{row.payyear}</TableCell>
                    <TableCell>{row.paymonth}</TableCell>
                    <TableCell>{row.updatedholdpercent}</TableCell>
                    <TableCell>{row.reason}</TableCell>



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
    </Box>
  );
}
export default FixHoldsalarydate;
