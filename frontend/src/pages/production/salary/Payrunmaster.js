import React, { useState, useCallback, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Checkbox, Select, MenuItem, Dialog, Divider, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, InputAdornment, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import { FaPrint, FaFilePdf, FaFileExcel, FaDownload, FaTrash, FaFileCsv } from "react-icons/fa";
import axios from "axios";
import * as XLSX from "xlsx";
import { SERVICE } from "../../../services/Baseservice.js";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext.js";
import Headtitle from "../../../components/Headtitle.js";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import ExportData from "../../../components/ExportData.js";
import PageHeading from "../../../components/PageHeading.js";
import MessageAlert from "../../../components/MessageAlert.js";
import AlertDialog from "../../../components/Alert.js";
import Selects from "react-select";
import moment from "moment-timezone";
import { CsvBuilder } from "filefy";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { handleApiError } from "../../../components/Errorhandling.js";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import UndoIcon from "@mui/icons-material/Undo";
import domtoimage from "dom-to-image";

// import Grid from '@mui/icons-material/Grid2';

const CustomRateField = ({ oldValue, value, row, column, fieldName, updateRowData, otherfieldval }) => {
  const { auth } = useContext(AuthContext);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState("");

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(true);
  };

  const [isEditing, setIsEditing] = useState(false); // Tracks if the row is in edit mode
  const [isEdited, setIsEdited] = useState(false); // Tracks if the row is in edit mode
  const [editedValue, setEditedValue] = useState(value); // The current edited value
  const [originalValue, setOriginalValue] = useState(oldValue); // Backup for undo
  const [fieldValue, setFieldValue] = useState(value); // Backup for undo
  const [logdata, setLogdata] = useState(row[fieldName].filter((item) => item.month === row.selectedmonth && item.year == row.selectedyear)); // Backup for undo

  const handleEdit = () => {
    // console.log(fieldName, row.totalshift, column.field, 'fieldName');
    setIsEditing(true); // Enter edit mode
  };

  const handleSave = async () => {
    setIsEditing(false); // Exit edit mode

    if (editedValue != "" && !isNaN(editedValue) && Number(editedValue) >= 0) {
      let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: String(row.department),
        month: String(row.selectedmonth),
        year: String(row.selectedyear),
      });

      let findDeptDupe = res.data.payrunlist;

      if (findDeptDupe.length > 0) {
        setEditedValue(value);
        setIsEdited(false);
        console.log("Pay Run Already Genarated");
        alert("Pay Run Already Genarated");
      } else if ((fieldName === "totalabsentlog" || fieldName === "totalpaiddayslog") && Number(editedValue) > Number(row.totalshift)) {
        setIsEdited(false);
        setEditedValue(value);
        const message = fieldName === "totalabsentlog" ? "Total Absent" : "Total Paid Shift";
        alert(`Please enter a valid value for ${message}.It should not exceed the total number of shifts.`);
      } else {
        try {
          let otherField = [];
          let otherFieldName = fieldName === "totalabsentlog" ? "totalpaiddayslog" : "totalabsentlog";
          let otherColumnFieldName = column.field === "totalasbleave" ? "totalpaidDays" : "totalasbleave";
          let res = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },

            outerId: row.id,
            // inid: row.id,
            value: String(editedValue),
            month: String(row.selectedmonth),
            year: String(row.selectedyear),
            date: String(new Date()),
            fieldName: fieldName,
          });
          if (fieldName === "totalabsentlog") {
            const otherFieldRes = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },

              outerId: row.id,
              // inid: row.id,
              value: row.totalshift - Number(editedValue),
              month: String(row.selectedmonth),
              year: String(row.selectedyear),
              date: String(new Date()),
              fieldName: "totalpaiddayslog",
            });
            otherField = otherFieldRes.data.upayrunlist["totalpaiddayslog"];
          }
          if (fieldName === "totalpaiddayslog") {
            const otherFieldRes = await axios.post(`${SERVICE.UPDATE_PAYRUNLIST_INNERDATA_USER}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },

              outerId: row.id,
              // inid: row.id,
              value: row.totalshift - Number(editedValue),
              month: String(row.selectedmonth),
              year: String(row.selectedyear),
              date: String(new Date()),
              fieldName: "totalabsentlog",
            });
            otherField = otherFieldRes.data.upayrunlist["totalabsentlog"];
          }
          if (res.statusText === "OK") {
            setIsEdited(true);
            const updatedData = res.data.upayrunlist[fieldName];
            const checkIsEdited = updatedData.filter((item) => item.month === row.selectedmonth && item.year == row.selectedyear);
            const updatedDataOtherfield = otherField;

            setLogdata(checkIsEdited);
            setFieldValue(editedValue);

            // Immediately update the parent with the updated data
            const updatedRow = {
              ...row,
              [column.field]: editedValue,
              [fieldName]: updatedData,
              ...(fieldName === "totalabsentlog" || fieldName === "totalpaiddayslog"
                ? {
                    [otherColumnFieldName]: row.totalshift - Number(editedValue),
                    [otherFieldName]: updatedDataOtherfield,
                  }
                : {}),
            };
            updateRowData(updatedRow);
            setIsEdited(true);
          }
        } catch (err) {
          setIsEdited(false);
          console.log(err);
        }
      }
    } else {
      setEditedValue(value);
      setIsEdited(false);
      alert("It should be valid number and not be empty");
    }
  };

  const handleUndo = async () => {
    try {
      let res = await axios.post(`${SERVICE.CHECK_PAYRUN_ISCREATED}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        department: String(row.department),
        month: String(row.selectedmonth),
        year: String(row.selectedyear),
      });

      let findDeptDupe = res.data.payrunlist;

      let otherField = [];
      let otherFieldName = fieldName === "totalabsentlog" ? "totalpaiddayslog" : "totalabsentlog";
      let otherColumnFieldName = column.field === "totalasbleave" ? "totalpaidDays" : "totalasbleave";

      if (findDeptDupe.length === 0) {
        let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          outerId: row.id,
          month: String(row.selectedmonth),
          year: String(row.selectedyear),
          fieldName: fieldName,
        });
        if (fieldName === "totalabsentlog") {
          let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            outerId: row.id,
            month: String(row.selectedmonth),
            year: String(row.selectedyear),
            fieldName: "totalpaiddayslog",
          });
          otherField = res.data.upayrunlist["totalpaiddayslog"];
        }
        if (fieldName === "totalpaiddayslog") {
          let res = await axios.post(`${SERVICE.UNDO_PAYRUNLIST_INNERDATA_USER}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            outerId: row.id,
            month: String(row.selectedmonth),
            year: String(row.selectedyear),
            fieldName: "totalabsentlog",
          });
          otherField = res.data.upayrunlist["totalabsentlog"];
        }

        if (res.statusText === "OK") {
          const revertedValue = originalValue;

          setLogdata([]);
          setFieldValue(originalValue);
          setEditedValue(revertedValue); // Restore original value
          setIsEditing(false); // Exit edit mode
          const updatedRow = {
            ...row,
            [column.field]: oldValue,
            [fieldName]: res.data.upayrunlist[fieldName],

            ...(fieldName === "totalabsentlog" || fieldName === "totalpaiddayslog"
              ? {
                  [otherColumnFieldName]: otherfieldval,
                  [otherFieldName]: otherField,
                }
              : {}),
          };
          setIsEdited(false);
          updateRowData(updatedRow); // Update parent data
        }
      } else {
        setEditedValue(value);
        setIsEdited(false);
        console.log("Pay Run Already Genarated");
        alert("Pay Run Already Genarated");
        // setShowAlert(
        //   <>
        //     <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
        //     <p style={{ fontSize: "20px", fontWeight: 900 }}>{'Pay Run Already Genarated'}</p>
        //   </>
        // );
        // handleClickOpenerr();
      }
    } catch (err) {
      setIsEdited(false);
      console.log(err);
    }
  };

  const handleChange = (event) => {
    setEditedValue(event.target.value); // Update local edited value
  };

  return (
    <div style={{ display: "flex", background: logdata.length > 0 || isEdited ? "#ffa5006b" : "inherit", height: "40px", alignItems: "center", gap: "8px" }}>
      {isEditing ? (
        <>
          <OutlinedInput type="number" value={editedValue} onChange={handleChange} style={{ width: "100%" }} />
          <CheckCircleIcon sx={{ fontSize: "20px", cursor: "pointer" }} color="success" onClick={handleSave} />
        </>
      ) : (
        <>
          <Typography sx={{ padding: "0px 5px" }}>{fieldValue}</Typography>

          {(logdata.length > 0 || isEdited) && <UndoIcon sx={{ fontSize: "16px", cursor: "pointer", fontWeight: "bold" }} color="error" onClick={handleUndo} />}
          <ModeEditIcon sx={{ fontSize: "15px", cursor: "pointer" }} color="primary" onClick={handleEdit} />
        </>
      )}
      {/* {isEditing ? (
        <>
        </>
      ) : (
      )} */}

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
    </div>
  );
};

function PayRunMaster() {
  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

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

  let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let currentMonth = monthsArr[mm - 1];
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [productionFilter, setProductionFilter] = useState([]);

  const [isBankdetail, setBankdetail] = useState(false);

  const [fileUploadName, setFileUploadName] = useState("");
  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [manageshortagemasters, setManageshortagemasters] = useState([]);
  const [revenueAmount, setRevenueAmount] = useState([]);
  const [salSlabs, setsalSlabs] = useState([]);
  const [eraAmounts, setEraAmounts] = useState([]);
  const [acPointCal, setAcPointCal] = useState([]);
  const [attStatus, setAttStatus] = useState([]);
  const [attModearr, setAttModearr] = useState([]);
  const [attStatusOption, setAttStatusOption] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryManage, setSearchQueryManage] = useState("");

  // Multiselectdropdowns
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState([]);

  const [employeesAllDrops, setEmployeesAllDrops] = useState([]);

  // Multiselectdropdowns
  const [branches, setBranches] = useState([]);
  const [units, setUnits] = useState([]);
  const [teams, setTeams] = useState([]);
  const [employeesDrops, setEmployeesDrops] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  // const [departmentsList, setDepartmentsList] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [selectedYear, setSelectedYear] = useState(yyyy);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedMonthNum, setSelectedMonthNum] = useState(mm);
  const [selectmonthname, setSelectMonthName] = useState(currentMonth);
  const [selectedMonthExcel, setSelectedMonthExcel] = useState("");

  const [items, setItems] = useState([]);

  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [rows, setRows] = useState([]);

  const [fileFormat, setFormat] = useState("");
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.value);
    setSelectedEmployee([]);
    fetchUserMonthYearBased(selectedMonth, event.value, selectedDepartment, selectedMonthNum);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    // updateDateValue(selectedYear, event.value);
    setSelectMonthName(event.label);
    setSelectedMonthNum(event.numval);
    setSelectedEmployee([]);
    // let employees = employeesAllDrops?.filter(
    //   (comp) =>
    //     (selectedCompany.length > 0 ? selectedCompany.map((item) => item.value).includes(comp.company) : true) &&
    //     (selectedBranch.length > 0 ? selectedBranch.map((item) => item.value).includes(comp.branch) : true) &&
    //     (selectedUnit.length > 0 ? selectedUnit.map((item) => item.value).includes(comp.unit) : true) &&
    //     (selectedTeam.length > 0 ? selectedTeam.map((item) => item.value).includes(comp.team) : true) &&
    //     selectedDepartment.map((item) => item.value).includes(comp.department) &&
    //     (selectedDesignation.length > 0 ? selectedDesignation.map((item) => item.value).includes(comp.designation) : true)
    // );
    // setEmployeesDrops(employees);

    fetchUserMonthYearBased(event.value, selectedYear, selectedDepartment, event.numval);
  };

  const fetchUserMonthYearBased = async (month, year, department, monthnum) => {
    // let res = await axios.post(SERVICE.USERS_BY_MONTHYEAR, {
    //   headers: {
    //     Authorization: `Bearer ${auth.APIToken}`,
    //   },
    //   month: month,
    //   year: year,
    //   department: department,
    // });
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

  let exportColumnNames = [
    "Company",
    "Branch",
    "Unit",
    "Emp Code",
    "Aadhar Name",
    "Company Name",
    "Department",
    "Designation",
    "Team",
    "Process Code",
    "DOJ",
    "Actual Exp",
    "Prod Exp",

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
    "Acheived Points",
    "Acheived %",
    "Acutal Penalty Amount",
    "Bank Name",
    "Account Name",
    "Account Number",
    "IFSC Code",
    "UAN",
    "PF Member Name",
    "Insurance No",
    "IP Name",
    "No Allowance Shift",
    "Shift Allowance Point",
    "Shift Allowance Target",
    "Night Shift Allowance",
    "ERA",
    "Revenue Allowance",
    "Shortage",
    `Current (${monthsArr[Number(selectedMonthExcel) + 1 > 12 ? 0 : Number(selectedMonthExcel)]}) Month Avg`,
    `Current (${monthsArr[Number(selectedMonthExcel) + 1 > 12 ? 0 : Number(selectedMonthExcel)]}) Month Attendance`,

    "Paid Status",
  ];
  let exportRowValues = [
    "company",
    "branch",
    "unit",
    "empcode",
    "legalname",
    "companyname",
    "department",
    "designation",
    "team",
    "processcodeexp",
    "doj",
    "experience",
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
    "monthPoint",
    "acheivedpoints",
    "acheivedpercent",
    "actualpenalty",
    "bankname",
    "accountname",
    "accountnumber",
    "ifsccode",
    "uan",
    "pfmembername",
    "insuranceno",
    "ipname",
    "noallowanceshift",
    "shiftallowancepoint",
    "shiftallowancetarget",
    "nightshiftallowance",
    "era",
    "revenueallow",
    "shortage",
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
  const gridRefImg = useRef(null);
  // image;
  const handleCaptureImage = () => {
    if (gridRefImg.current) {
      domtoimage
        .toBlob(gridRefImg.current)
        .then((blob) => {
          saveAs(blob, "Payrun Master.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
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

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //get all  company.
  const fetchCompany = async () => {
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
      ? []
      : // isAssignBranch?.map((data) => ({
        //     // branch: data.branch,
        //     company: data.company,
        //     // unit: data.unit,
        //   }))
        isAssignBranch
          ?.filter((data) => {
            let fetfinalurl = [];

            if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
              fetfinalurl = data.modulenameurl;
            } else {
              fetfinalurl = [];
            }

            const remove = [window.location.pathname?.substring(1), window.location.pathname];
            return fetfinalurl?.some((item) => remove?.includes(item));
          })
          ?.map((data) => ({
            // branch: data.branch,
            name: data.company,
            // unit: data.unit,
          }));

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
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
      ? []
      : isAssignBranch
          ?.filter((data) => {
            let fetfinalurl = [];

            if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
              fetfinalurl = data.modulenameurl;
            } else {
              fetfinalurl = [];
            }

            const remove = [window.location.pathname?.substring(1), window.location.pathname];
            return fetfinalurl?.some((item) => remove?.includes(item));
          })
          ?.map((data) => ({
            name: data.branch,
            company: data.company,
            // unit: data.unit,
          }));
    try {
      let res_location = await axios.post(SERVICE.BRANCH_BY_COMPANY_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        assignbranch: accessbranch,
        company: company.map((item) => item.value),
      });

      let branchOptfirstthree = [...new Set(res_location?.data?.branches.map((data) => data.name))].map((name) => ({
        label: name,
        value: name,
      }));
      setBranches(branchOptfirstthree);
    } catch (err) {
      console.log(err, "err");
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get unit by branch
  const fetchUnitAll = async (company, branch) => {
    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
      ? []
      : isAssignBranch
          ?.filter((data) => {
            let fetfinalurl = [];

            if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subsubpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.subpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.mainpagenameurl;
            } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
              fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
              fetfinalurl = data.modulenameurl;
            } else {
              fetfinalurl = [];
            }

            const remove = [window.location.pathname?.substring(1), window.location.pathname];
            return fetfinalurl?.some((item) => remove?.includes(item));
          })
          ?.map((data) => ({
            branch: data.branch,
            // company: data.company,
            // unit: data.unit,
          }));
    try {
      let res_location = await axios.post(SERVICE.UNIT_BY_ACCESS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        role: isUserRoleAccess.role,
        assignbranch: accessbranch,
        branch: branch.map((item) => item.value),
      });

      let units = [...new Set(res_location?.data?.units.map((data) => data.name))].map((name) => ({
        label: name,
        value: name,
      }));
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
  const [targetPoints, setTargetPoints] = useState([]);
  const fetchAll = async () => {
    // setBankdetail(true);
    try {
      const [RES_USERS, RES_DESIG, RES_SHIFT, RES_SALARYSLAB, RES_SHORTAGE, RES_ERA, RES_REVENUE, RES_ACPOINT, RES_ATTSTS, RES_ATTMODE, RES_DEPT, RES_TARGET] = await Promise.all([
        // axios.get(SERVICE.COMPANY, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        // axios.get(SERVICE.BRANCH, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.post(SERVICE.USERS_LIMITED_DROPDOWN_FINALSALARY, { headers: { Authorization: `Bearer ${auth.APIToken}` }, month: selectedMonth, monthnum: selectedMonthNum, year: selectedYear }),
        // axios.get(SERVICE.UNIT, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.DESIGNATION, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        // axios.get(SERVICE.TEAMS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.SHIFTS_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.SALARYSLAB_LIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.MANAGESHORTAGEMASTER, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ERAAMOUNTSLIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.REVENUEAMOUNTSLIMITED, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ACPOINTCALCULATION, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ATTENDANCE_STATUS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.ATTENDANCE_MODE_STATUS, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.DEPARTMENT, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
        axios.get(SERVICE.TARGETPOINTS_LIMITED, {
          headers: { Authorization: `Bearer ${auth.APIToken}` },
        }),
      ]);

      setAcPointCal(RES_ACPOINT?.data?.acpointcalculation);
      setRevenueAmount(RES_REVENUE?.data?.revenueamounts);
      setEraAmounts(RES_ERA?.data?.eraamounts);
      setManageshortagemasters(RES_SHORTAGE?.data?.manageshortagemasters);
      setsalSlabs(RES_SALARYSLAB.data.salaryslab);
      setShifts(RES_SHIFT?.data?.shifts);

      // setTeams(RES_TEAMS.data.teamsdetails);
      setDesignations(RES_DESIG.data.designation);
      // setUnits(RES_UNIT.data.units);
      setEmployeesDrops(RES_USERS.data.users);
      setEmployeesAllDrops(RES_USERS.data.users);
      // setBranches(RES_BRANCH.data.branch);
      // setCompanies(RES_COM.data.companies);
      setAttStatus(RES_ATTSTS?.data?.attendancestatus);
      setAttModearr(RES_ATTMODE?.data?.allattmodestatus);
      let result = RES_ATTMODE?.data?.allattmodestatus.filter((data, index) => {
        return data.appliedthrough != "Auto";
      });
      setAttStatusOption(result.map((d) => d.name));
      setDepartments(
        RES_DEPT.data.departmentdetails.map((item) => ({
          label: item.deptname,
          value: item.deptname,
        }))
      );
      setTargetPoints(RES_TARGET.data.targetpoints);
      setBankdetail(false);
    } catch (err) {
      setBankdetail(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

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
  // const getattendancestatus = (alldata) => {
  //   let result = attStatus.filter((data, index) => {
  //     return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus;
  //   });
  //   return result[0]?.name;
  // };

  // // const getAttModeAppliedThr = (rowdaystatus) => {
  // //   let result = attModearr.filter((data, index) => {
  // //     return data?.name === rowdaystatus;
  // //   });
  // //   return result[0]?.appliedthrough;
  // // };

  // const getAttModeLop = (rowdaystatus) => {
  //   let result = attModearr.filter((data, index) => {
  //     return data?.name === rowdaystatus;
  //   });
  //   return result[0]?.lop === true ? "Yes" : "No";
  // };

  // const getAttModeLopType = (rowdaystatus) => {
  //   let result = attModearr.filter((data, index) => {
  //     return data?.name === rowdaystatus;
  //   });
  //   return result[0]?.loptype;
  // };

  // const getFinalLop = (rowlop, rowloptype) => {
  //   return rowloptype === undefined || rowloptype === "" ? rowlop : rowlop + " - " + rowloptype;
  // };

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

  // const getAttModeTarget = (rowdaystatus) => {
  //   let result = attModearr.filter((data, index) => {
  //     return data?.name === rowdaystatus;
  //   });
  //   return result[0]?.target === true ? "Yes" : "No";
  // };

  // const getAttModePaidPresent = (rowdaystatus) => {
  //   let result = attModearr.filter((data, index) => {
  //     return data?.name === rowdaystatus;
  //   });
  //   return result[0]?.paidleave === true ? "Yes" : "No";
  // };

  // const getAttModePaidPresentType = (rowdaystatus) => {
  //   let result = attModearr.filter((data, index) => {
  //     return data?.name === rowdaystatus;
  //   });
  //   return result[0]?.paidleavetype;
  // };

  // const getFinalPaid = (rowpaid, rowpaidtype) => {
  //   return rowpaidtype === undefined || rowpaidtype === "" ? rowpaid : rowpaid + " - " + rowpaidtype;
  // };

  // // const getAssignLeaveDayForLop = (rowlopday) => {
  // //   if (rowlopday === 'Yes - Double Day') {
  // //     return '2';
  // //   } else if (rowlopday === 'Yes - Full Day') {
  // //     return '1';
  // //   } else if (rowlopday === 'Yes - Half Day') {
  // //     return '0.5';
  // //   } else {
  // //     return '0';
  // //   }
  // // };

  // const getAssignLeaveDayForPaid = (rowpaidday) => {
  //   if (rowpaidday === "Yes - Double Day") {
  //     return "2";
  //   } else if (rowpaidday === "Yes - Full Day") {
  //     return "1";
  //   } else if (rowpaidday === "Yes - Half Day") {
  //     return "0.5";
  //   } else {
  //     return "0";
  //   }
  // };
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
      // setShowAlert(
      //   <>
      //     <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
      //     <p style={{ fontSize: '20px', fontWeight: 900 }}>{'Please Select Department'}</p>
      //   </>
      // );
      // handleClickOpenerr();
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
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
        setSelectedMonthExcel(Number(selectedMonthNum));

        let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: selectedDepartment.map((item) => item.value),
          branch: selectedBranch.map((item) => item.value),
          unit: selectedUnit.map((item) => item.value),
          team: selectedTeam.map((item) => item.value),
          // employees: selectedEmployee.length > 0 ? selectedEmployee.map((item) => item.value) : employeesDrops.map((item) => item.companyname),
          employees: selectedEmployee.map((item) => item.value),
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
          // console.log(resultarr2, 'resultarr2');

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
                  return formattedDate >= dojDate && formattedDate <= reasonDate;
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
                  ismonth: Number(selectedMonthNum) + 1 > 12 ? 1 : Number(selectedMonthNum) + 1,
                  isyear: Number(selectedMonthNum) + 1 > 12 ? Number(selectedYear) + 1 : Number(selectedYear),
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
                  monthname: Number(selectedMonthNum) + 1 > 12 ? "January" : monthsArr[selectedMonthNum],
                  year: Number(selectedMonthNum) + 1 > 12 ? String(Number(selectedYear) + 1) : selectedYear,
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
              setBankdetail(false);
              console.error("Error fetching API data:", err.response?.data?.message || err);
              throw err;
            }
          }

          getAllResults()
            .then((results) => {
              console.log("Final consolidated results for resultarr:", results.allResults.length);
              console.log("Final consolidated results for resultarr2:", results.allResults2.length);

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
                // console.log(dayPointsUser, 'dayPointsUser');
                let monthSets = data.monthSets;
                let monthSetsNxt = data.monthSetsNxt;

                // console.log(finalresult, 'finalresult');
                let findTotalNoOfDays = finalresult.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.username === item.companyname);
                let findTotalNoOfDaysNxtMonth = finalresultNxt.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.username === item.companyname);
                // console.log(finalresultNxt, 'finalresultNxt');
                const groupedByMonth = {};

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
                // Find the first item in the sorted array1 that meets the criteria
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

                let selectedmonthnumalterNxt = Number(selectedMonthNum) + 1 > 12 ? "01" : Number(selectedMonthNum) + 1 <= 9 ? `0${Number(selectedMonthNum) + 1}` : Number(selectedMonthNum) + 1;

                let Nxtmonth = Number(selectedMonthNum) + 1 > 12 ? 1 : Number(selectedMonthNum) + 1;
                let Nxtyear = Number(selectedMonthNum) + 1 > 12 ? Number(selectedYear) + 1 : selectedYear;

                const NxtnextMonthFirstDay = new Date(Number(Nxtyear), Number(Nxtmonth), 1);

                // Subtract one day to get the last day of the given month
                const lastDateNxtNextmonth = new Date(NxtnextMonthFirstDay - 1);

                let lastdateOfNxtSelectedMonth = lastDateNxtNextmonth.getDate();

                let selectedMonNxtStartDate = `${Nxtyear}-${selectedmonthnumalterNxt}-01`;

                let selectedMonNxtEndDate = `${Nxtyear}-${selectedmonthnumalterNxt}-${lastdateOfNxtSelectedMonth}`;

                let findNxtStartDate = findexpNxt ? findexpNxt.fromdate : selectedMonNxtStartDate;
                let findNxtEndDate = findexpNxt ? findexpNxt.todate : selectedMonNxtEndDate;

                //FIND SELECTEDMONTH MONTH END DATE
                const nextMonthFirstDay = new Date(Number(selectedYear), Number(selectedMonthNum), 1);

                // Subtract one day to get the last day of the given month
                const lastDate = new Date(nextMonthFirstDay - 1);

                let lastdateOfSelectedMonth = lastDate.getDate();
                let selectedMonEndDate = `${selectedYear}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
                let findmonthenddate = findexp ? findexp.todate : selectedMonEndDate;

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

                let getprocessCode = filteredItem ? filteredItem.process : "";

                let processcodemodeexperiecevalue =
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

                let processcodeexpvaluesalary =
                  item.doj && modevalue && modevalue.expmode === "Manual"
                    ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00")
                    : item.doj
                    ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00")
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

                // let findAcPointVal = acPointCal.find((d) => d.company === item.company && d.branch === item.branch && d.department === item.department);

                let totalShiftTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
                let totalWeekoffTrgt = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoff) : 0;
                let totalWeekoffall = findTotalNoOfDays ? Number(findTotalNoOfDays.weekoffall) : 0;

                let totalShiftTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.shift) : 0;
                let totalWeekoffTrgtNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoff) : 0;
                let totalWeekoffallNxt = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.weekoffall) : 0;

                // let findTarDetails = targetPoints.filter((d) => d.processcode === processcodeexpvalue).find((tr) => item.branch === tr.branch && item.company === tr.company && tr.processcode === processcodeexpvalue);

                // let findTargetVal = findTarDetails ? Number(findTarDetails.points) : 0;

                // let findTarDetailsNxtMonth = targetPoints.filter((d) => d.processcode === processcodeexpvalueNxtMonth).find((tr) => item.branch === tr.branch && item.company === tr.company && tr.processcode === processcodeexpvalueNxtMonth);

                // let findTargetValNxtMonth = findTarDetailsNxtMonth ? Number(findTarDetailsNxtMonth.points) : 0;

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
                // console.log(findPenaltyDetails,'findPenaltyDetails')

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

                let paidpresentdayvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.paidpresentday) : 0;
                let leaveCountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.leaveCount) : 0;
                let holidayCountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.holidayCount) : 0;
                let shiftvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.shift) : 0;
                let lopcountvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.lopcount) : 0;
                // console.log(findTotalNoOfDays.lopcount, "findTotalNoOfDays.lopcount");

                // let paiddayscalcvalfrommonthstatus = Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue) > Number(shiftvalue) ? Number(shiftvalue) - Number(lopcountvalue) : Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue);
                let paiddayscalcvalfrommonthstatus = paidpresentdayvalue;

                let paidpresentdayallCalcVal = shiftvalue;
                let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
                let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays ? Number(findTotalNoOfDays.lopcount) : 0;
                let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 && totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ? Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : paiddayscalcvalfrommonthstatus;

                let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? Number(TargetPointAmt[TargetPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.target) : 0;
                let AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? Number(AcheivedPointAmt[AcheivedPointAmt.length - 1].value) : findPointsDetails ? Number(findPointsDetails.point) : 0;
                // let AcheivedPercentCalcVal =
                //   item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 && item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0
                //     ? ((AcheivedPointAmt[AcheivedPointAmt.length - 1].value / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2)
                //     : item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0
                //       ? (((findPointsDetails ? findPointsDetails.point : 0) / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2)
                //       : item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0
                //         ? ((AcheivedPointAmt[AcheivedPointAmt.length - 1].value / (findPointsDetails ? findPointsDetails.target : 0)) * 100).toFixed(2)
                //         : (findPointsDetails ? findPointsDetails.avgpoint.toFixed(2) : 0);
                let AcheivedPercentCalcVal = Number(targetPointCalcVaue) > 0 ? Number(((Number(AcheivedPointsCalcVal) / Number(targetPointCalcVaue)) * 100).toFixed(2)) : 0;
                // console.log(findPointsDetails, 'findPointsDetails');

                let allowancepointCalcVal = item.shiftallowancelog && item.shiftallowancelog.length > 0 && shiftAllowAmt && shiftAllowAmt.length > 0 ? Number(Number(shiftAllowAmt[shiftAllowAmt.length - 1].value).toFixed(2)) : findPointsDetails ? Number(findPointsDetails.allowancepoint) : 0;
                allowancepointCalcVal = Number(Number(allowancepointCalcVal).toFixed(2));

                let ERAAmountCalcVal = findERAaountValue ? Number(findERAaountValue.amount) : 0;
                let penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value).toFixed(2)) : findPenaltyDetails ? Number(findPenaltyDetails.amount) : 0;
                penaltyCalcVal = Number(Number(penaltyCalcVal).toFixed(2));

                let totalNoOfDaysCalcVal = findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0;

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

                let prodAllowanceCalcVal = Number(((Number(oldprodAllowanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                let prodAllowancetwoCalcVal = Number(((Number(oldprodAllowancetwoCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                //calculated  ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
                let actualBasicCalcVal = Number(((Number(oldactualBasicCalcVal) / tond) * totalshiftCalcVal).toFixed(2));

                let actualHraCalcVal = Number(((Number(oldactualHraCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                let actualConveyanceCalcVal = Number(((Number(oldactualConveyanceCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                let actualMedicalAllowCalcVal = Number(((Number(oldactualMedicalAllowCalcVal) / tond) * totalshiftCalcVal).toFixed(2));
                let actualOtherCalVAL = Number(((Number(oldactualOtherCalVAL) / tond) * totalshiftCalcVal).toFixed(2));

                let oldgross = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.gross) : Number(oldactualBasicCalcVal) + Number(oldactualHraCalcVal) + Number(oldactualConveyanceCalcVal) + Number(oldactualMedicalAllowCalcVal) + Number(oldprodAllowanceCalcVal) + Number(oldactualOtherCalVAL);

                let grossValue = modevalue && modevalue.expmode === "Manual" ? Number(modevalue.gross) : actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + prodAllowanceCalcVal + actualOtherCalVAL;
                grossValue = Number(Number(grossValue).toFixed(2));
                let currentMonthAttendanceVal = findTotalNoOfDaysNxtMonth ? Number(findTotalNoOfDaysNxtMonth.lopcount) : 0;
                let currentMonthAvgVal = findPointsDetailsNxtMonth ? Number(Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2)) : 0;
                let currMonAvgFinalcalVal = item.currmonthavglog && item.currmonthavglog.length > 0 && currMonAvgLogVal && currMonAvgLogVal.length > 0 ? Number(currMonAvgLogVal[currMonAvgLogVal.length - 1].value) : currentMonthAvgVal;

                let currMonAttFinalcalVal = item.currmonthattlog && item.currmonthattlog.length > 0 && currMonAttLogVal && currMonAttLogVal.length > 0 ? Number(currMonAttLogVal[currMonAttLogVal.length - 1].value) : currentMonthAttendanceVal;

                // const frequencyOrder = ['FIRST', 'SECOND', 'THIRD', 'LAST', 'HOLD'];
                // Number(totalasbleaveCalcVal) >= Number(d.fromvalue) &&
                // Number(totalasbleaveCalcVal) <= Number(d.tovalue) &&
                // Number(AcheivedPercentCalcVal) >= Number(d.frompoint) &&
                // Number(AcheivedPercentCalcVal) <= Number(d.topoint) &&
                // (d.currentabsentmodes === 'Greater than or Equal'
                //   ? currMonAttFinalcalVal >= Number(d.currentabsentvalue)
                //   : d.currentabsentmodes === 'Greater than'
                //   ? currMonAttFinalcalVal > Number(d.currentabsentvalue)
                //   : d.currentabsentmodes === 'Less than or Equal'
                //   ? currMonAttFinalcalVal <= Number(d.currentabsentvalue)
                //   : currMonAttFinalcalVal < Number(d.currentabsentvalue)) &&
                // (d.currentachievedmodes === 'Greater than or Equal'
                //   ? currMonAvgFinalcalVal >= Number(d.currentachievedvalue)
                //   : d.currentachievedmodes === 'Greater than'
                //   ? currMonAvgFinalcalVal > Number(d.currentachievedvalue)
                //   : d.currentachievedmodes === 'Less than or Equal'
                //   ? currMonAvgFinalcalVal <= Number(d.currentachievedvalue)
                //   : currMonAvgFinalcalVal < Number(d.currentachievedvalue))

                const ctodate = new Date(findmonthenddate).toISOString();
                const CLOP = Number(currMonAttFinalcalVal); // Current Leave or Points
                const CTotalPointsAverage = Number(currMonAvgFinalcalVal);

                let getpaidStatusVal = "";
                paidStatusFix
                  .filter((data) => {
                    //   data.month.toLowerCase() === selectedMonth.toLowerCase() &&
                    //   data.department.includes(item.department) &&
                    //   data.year == selectedYear &&
                    //  (( (item.reasondate >= findDate ) && (item.resonablestatus === "Absconded" || item.resonablestatus === "Terminate")) ? data.frequency === "REJECT" : ( (item.reasondate >= findDate ) && (item.resonablestatus === "Releave Employee" )) ? data.frequency === "HOLD" :  true ) &&

                    //   Number(data.fromvalue) <= Number(totalasbleaveCalcVal) &&
                    //   Number(data.tovalue) >= Number(totalasbleaveCalcVal) &&
                    //   Number(data.frompoint) <= Number(AcheivedPercentCalcVal) &&
                    //   Number(data.topoint) >= Number(AcheivedPercentCalcVal)
                    const isMonthAndDepartmentMatched = data.month.toLowerCase() === selectedMonth.toLowerCase() && data.department.includes(item.department) && data.year == selectedYear;

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

                // Set paidStatusVal if a matching row is found
                let paidStatusVal = getpaidStatusVal === "" ? "No Status" : getpaidStatusVal;

                let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? findPointsDetails.noallowancepoint : 0;

                // FIND SHIFTALLOWACE
                // let checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
                // let CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";

                // let noshiftlogvalfinal = noShiftLogVal
                let shiftallowanceTargetDaypoint = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : findPointsDetails ? Number(findPointsDetails.allowancetarget) : 0;

                let shiftallowancetarget = noshiftlogvalfinal > 0 ? shiftallowanceTargetDaypoint : 0;

                let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;

                let nightAllowancefinalcalculation = noshiftlogvalfinal > 0 ? ((1000 / totalNoOfDaysCalcVal) * noshiftlogvalfinal * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100 : 0;

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
                  // processcodeexp: processcodeexpvalue,
                  processcodeexp: processcodemodeexperiecevalue,

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
                  totalabsentcalVal1: findTotalNoOfDays ? Number(Number(findTotalNoOfDays.lopcount)) : 0,
                  penaltyCalVal1: findPenaltyDetails ? Number(Number(findPenaltyDetails.amount).toFixed(2)) : Number(0).toFixed(2),
                  targetpointCalVal1: findPointsDetails ? Number(findPointsDetails.target) : 0,
                  acheivedpointCalVal1: findPointsDetails ? Number(Number(findPointsDetails.point).toFixed(2)) : Number(0).toFixed(2),
                  shiftallowanceCalVal1: findPointsDetails ? Number(Number(findPointsDetails.allowancepoint).toFixed(2)) : Number(0).toFixed(2),
                  // paidpresentday: Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),

                  //LIST PRODUCTION POINTS
                  monthPoint: targetPointCalcVaue,

                  acheivedpoints: Number(Number(AcheivedPointsCalcVal).toFixed(2)),

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
                  nightshiftallowance: Number(nightAllowanceCalcVal.toFixed(2)),

                  nightshiftallowlog: item.nightshiftallowlog,
                  nightshiftallowlogCalVal1: nightAllowancefinalcalculation,

                  shiftallowtargetlog: item.shiftallowtargetlog,
                  shiftallowtargetlogCalVal1: shiftallowancetarget,
                  from: findDate,
                  to: findmonthenddate,
                  selectedmonth: selectedMonth,
                  selectedyear: selectedYear,
                };
              }

              async function sendBatchRequestItems(batch, data) {
                try {
                  const itemsWithSerialNumber = batch.emps.map(async (item, index) => processEmployeeItem(item, index, data));
                  // const results = await Promise.all(itemsWithSerialNumber);
                  return await Promise.all(itemsWithSerialNumber);
                } catch (err) {
                  console.error("Error processing batch request items:", err);
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
                  console.log(err, "err");
                }
              }

              getAllResultsItems().then((result) => {
                // console.log(result, 'result');
                try {
                  setSelectedMonthExcel(Number(selectedMonthNum));
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
                          ...item,
                          id: item._id,
                          serialNumber: index + 1,
                          company: item.company,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          empcode: item.empcode,
                          companyname: item.companyname,
                          doj: item.doj,
                          experience: item.experience,
                          //ASSIGN EXP LOG DETAILS
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
                          salexp: item.salexp,
                          processcodeexp: item.processcodeexp,

                          // gross: grossValue,

                          //SALRY SLAB FILTER PAGE
                          actualbasic: item.basic,
                          actualhra: item.hra,
                          actualconveyance: item.conveyance,
                          actualmedicalallowance: item.medicalallowance,
                          actualproductionallowance: item.productionallowance,
                          actualproductionallowancetwo: item.productionallowancetwo,
                          actualotherallowance: item.otherallowance,

                          oldgross: item.oldgross,
                          oldbasic: item.oldbasic,
                          oldhra: item.oldhra,
                          oldconveyance: item.oldconveyance,
                          oldmedicalallowance: item.oldmedicalallowance,
                          oldproductionallowance: item.oldproductionallowance,
                          oldproductionallowancetwo: item.oldproductionallowancetwo,
                          oldotherallowance: item.oldotherallowance,
                          newgross: item.gross,

                          //REVENUE ALLOWANCE MASTER PAGE
                          revenueallow: item.revenueallow ? Number(item.revenueallow) : 0,
                          //SHORTAGE MASTER PAGE
                          shortage: item.shortage ? Number(item.shortage) : 0,

                          //ATTENDANCE MONTH STATUS
                          totalnumberofdays: item.totalnumberofdays,
                          // totalshift: findTotalNoOfDays && Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),
                          totalshift: item.totalshift,
                          clsl: item.clsl,
                          weekoff: item.weekoffcount,
                          holiday: item.holiday,
                          totalasbleave: item.totalasbleave ? Number(item.totalasbleave) : 0,
                          totalpaidDays: item.totalpaidDays,

                          //old value
                          totalasbleaveOldValue: item.totalasbleave,
                          totalpaidDaysOldValue: item.totalpaidDays,
                          monthPointOldValue: item.monthPoint,
                          acheivedpointsOldValue: item.acheivedpoints,
                          actualpenaltyOldValue: item.actualpenalty,
                          noallowanceshiftOldValue: item.noallowancepoint,
                          shiftallowancepointOldValue: item.allowancepoint,
                          shiftallowancetargetOldValue: item.shiftallowancetarget,
                          nightshiftallowanceOldValue: item.nightshiftallowance,
                          currentmonthavgOldValue: Number(item.currentmonthavg),
                          currentmonthattendanceOldValue: item.currentmonthattendance,

                          //old value and log
                          totalpaiddaycalVal1: item.totalpaiddaycalVal1,
                          totalabsentcalVal1: item.totalabsentcalVal1,
                          penaltyCalVal1: item.penaltyCalVal1,
                          targetpointCalVal1: item.targetpointCalVal1,
                          acheivedpointCalVal1: item.acheivedpointCalVal1,
                          shiftallowanceCalVal1: item.shiftallowanceCalVal1,
                          // paidpresentday: Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),

                          //LIST PRODUCTION POINTS
                          monthPoint: item.monthPoint,

                          acheivedpoints: item.acheivedpoints ? Number(item.acheivedpoints) : 0,

                          // acheivedpercent: item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? (((item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? AcheivedPointAmt[AcheivedPointAmt.length - 1].value : findPointsDetails && findPointsDetails.point) / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2) : findPointsDetails && findPointsDetails.avgpoint.toFixed(2),
                          acheivedpercent: item.acheivedpercent ? Number(item.acheivedpercent) : 0,

                          //DAY POINTS UPLOAD SHIFTALOWANCE AMOUNT
                          noallowanceshift: item.noallowancepoint,
                          shiftallowancepoint: item.allowancepoint ? Number(item.allowancepoint) : 0,

                          shiftallowancetarget: item.shiftallowancetarget,
                          nightshiftallowance: item.nightshiftallowance,

                          //ERA MASTER PAGE
                          era: item.eramount ? Number(item.eramount) : 0,
                          //PENALTY MASTER PAGE
                          actualpenalty: item.penalty,
                          //USER INOIVIDUAL VALUE
                          ipname: item.ipname,
                          insuranceno: item.insurancenumber,
                          pfmembername: item.pfmembername,
                          uan: item.uan,
                          accountname: item.accountholdername,

                          currentmonthavg: Number(item.currentmonthavg),
                          currentmonthavgCalVal1: item.currentmonthavgCalVal1,

                          currentmonthattendance: item.currentmonthattendance ? Number(item.currentmonthattendance) : 0,
                          currentmonthattCalVal1: item.currentmonthattCalVal1,

                          paidstatus: item.paidstatus,

                          noshiftlog: item.noshiftlog,
                          noshiftlogCalVal1: item.noshiftlogCalVal1,

                          nightshiftallowlog: item.nightshiftallowlog,
                          nightshiftallowlogCalVal1: item.nightshiftallowlogCalVal1,

                          shiftallowtargetlog: item.shiftallowtargetlog,
                          shiftallowtargetlogCalVal1: item.shiftallowtargetlogCalVal1,
                          from: item.from,
                          to: item.to,
                          selectedmonth: item.selectedmonth,
                          selectedyear: item.selectedyear,
                        };
                      })
                  );
                  setRows(
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
                          ...item,
                          id: item._id,
                          serialNumber: index + 1,
                          company: item.company,
                          branch: item.branch,
                          unit: item.unit,
                          team: item.team,
                          empcode: item.empcode,
                          companyname: item.companyname,
                          doj: item.doj,
                          experience: item.experience,
                          //ASSIGN EXP LOG DETAILS
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
                          salexp: item.salexp,
                          processcodeexp: item.processcodeexp,

                          // gross: grossValue,

                          //SALRY SLAB FILTER PAGE
                          actualbasic: item.basic,
                          actualhra: item.hra,
                          actualconveyance: item.conveyance,
                          actualmedicalallowance: item.medicalallowance,
                          actualproductionallowance: item.productionallowance,
                          actualproductionallowancetwo: item.productionallowancetwo,
                          actualotherallowance: item.otherallowance,

                          oldgross: item.oldgross,
                          oldbasic: item.oldbasic,
                          oldhra: item.oldhra,
                          oldconveyance: item.oldconveyance,
                          oldmedicalallowance: item.oldmedicalallowance,
                          oldproductionallowance: item.oldproductionallowance,
                          oldproductionallowancetwo: item.oldproductionallowancetwo,
                          oldotherallowance: item.oldotherallowance,
                          newgross: item.gross,

                          //REVENUE ALLOWANCE MASTER PAGE
                          revenueallow: item.revenueallow,
                          //SHORTAGE MASTER PAGE
                          shortage: item.shortage,

                          //ATTENDANCE MONTH STATUS
                          totalnumberofdays: item.totalnumberofdays,
                          // totalshift: findTotalNoOfDays && Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),
                          totalshift: item.totalshift,
                          clsl: item.clsl,
                          weekoff: item.weekoffcount,
                          holiday: item.holiday,
                          totalasbleave: item.totalasbleave,
                          totalpaidDays: item.totalpaidDays,

                          //old value
                          totalasbleaveOldValue: item.totalasbleave,
                          totalpaidDaysOldValue: item.totalpaidDays,
                          monthPointOldValue: item.monthPoint,
                          acheivedpointsOldValue: item.acheivedpoints,
                          actualpenaltyOldValue: item.actualpenalty,
                          noallowanceshiftOldValue: item.noallowancepoint,
                          shiftallowancepointOldValue: item.allowancepoint,
                          shiftallowancetargetOldValue: item.shiftallowancetarget,
                          nightshiftallowanceOldValue: item.nightshiftallowance,
                          currentmonthavgOldValue: Number(item.currentmonthavg),
                          currentmonthattendanceOldValue: item.currentmonthattendance,

                          //old value and log
                          totalpaiddaycalVal1: item.totalpaiddaycalVal1,
                          totalabsentcalVal1: item.totalabsentcalVal1,
                          penaltyCalVal1: item.penaltyCalVal1,
                          targetpointCalVal1: item.targetpointCalVal1,
                          acheivedpointCalVal1: item.acheivedpointCalVal1,
                          shiftallowanceCalVal1: item.shiftallowanceCalVal1,
                          // paidpresentday: Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),

                          //LIST PRODUCTION POINTS
                          monthPoint: item.monthPoint,

                          acheivedpoints: item.acheivedpoints,

                          // acheivedpercent: item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? (((item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ? AcheivedPointAmt[AcheivedPointAmt.length - 1].value : findPointsDetails && findPointsDetails.point) / TargetPointAmt[TargetPointAmt.length - 1].value) * 100).toFixed(2) : findPointsDetails && findPointsDetails.avgpoint.toFixed(2),
                          acheivedpercent: item.acheivedpercent,

                          //DAY POINTS UPLOAD SHIFTALOWANCE AMOUNT
                          noallowanceshift: item.noallowancepoint,
                          shiftallowancepoint: item.allowancepoint,

                          shiftallowancetarget: item.shiftallowancetarget,
                          nightshiftallowance: item.nightshiftallowance,

                          //ERA MASTER PAGE
                          era: item.eramount,
                          //PENALTY MASTER PAGE
                          actualpenalty: item.penalty,
                          //USER INOIVIDUAL VALUE
                          ipname: item.ipname,
                          insuranceno: item.insurancenumber,
                          pfmembername: item.pfmembername,
                          uan: item.uan,
                          accountname: item.accountholdername,

                          currentmonthavg: Number(item.currentmonthavg),
                          currentmonthavgCalVal1: item.currentmonthavgCalVal1,

                          currentmonthattendance: item.currentmonthattendance,
                          currentmonthattCalVal1: item.currentmonthattCalVal1,

                          paidstatus: item.paidstatus,

                          noshiftlog: item.noshiftlog,
                          noshiftlogCalVal1: item.noshiftlogCalVal1,

                          nightshiftallowlog: item.nightshiftallowlog,
                          nightshiftallowlogCalVal1: item.nightshiftallowlogCalVal1,

                          shiftallowtargetlog: item.shiftallowtargetlog,
                          shiftallowtargetlogCalVal1: item.shiftallowtargetlogCalVal1,
                          from: item.from,
                          to: item.to,
                          selectedmonth: item.selectedmonth,
                          selectedyear: item.selectedyear,
                        };
                      })
                  );
                  setBankdetail(false);
                } catch (err) {
                  console.log(err, "err");
                }
              });
            })
            .catch((error) => {
              setBankdetail(false);
              console.error("Error in getting all results:", error);
            });
        } else {
          console.log("no data", "123");
          setBankdetail(false);
        }
      } catch (err) {
        console.log(err, "123");
        setBankdetail(false);
        handleApiError(err, setShowAlert, handleClickOpenerr);
      }
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setProductionFilter([]);

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Pay Run Master",
    pageStyle: "print",
  });

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to the first page when search changes
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPage(1); // Reset to the first page when page size changes
  };

  // Filter data based on search query
  const filteredData = rows.filter((row) => {
    return Object.values(row).some((value) => value?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  // const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const maxVisiblePages = 3;

  const calculatePageNumbers = (totalPages, currentPage, maxVisiblePages) => {
    const pageNumbers = [];
    // Number of pages to show at a time
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Determine the start and end of the visible range
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);

    // Adjust range if close to the start or end
    if (currentPage <= halfVisible) {
      end = Math.min(maxVisiblePages, totalPages);
    } else if (currentPage > totalPages - halfVisible) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleCellEdit = (params) => {
    const updatedRows = rows.map((row) => (row.id === params.data.id ? { ...row, [params.colDef.field]: params.newValue } : row));
    setRows(updatedRows); // Update only the modified row.
  };

  // const updateRowData = (updatedRow) => {
  //   // const updatedRows = rows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
  //   // setRows(updatedRows); // Efficiently update the row data.
  //   setRows((prevRows) => prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
  //   // gridApi.applyTransaction({ update: [updatedRow] });

  // };
  const updateRowData = (updatedRow) => {
    setRows((prevRowData) => prevRowData.map((row) => (row.id === updatedRow.id ? { ...updatedRow } : row)));

    // If gridApi is available, apply the transaction and refresh cells
    // if (gridApi) {
    //   gridApi.applyTransaction({ update: [updatedRow] });
    //   gridApi.refreshCells({
    //     rowNodes: [gridApi.getRowNode(updatedRow.id)],
    //   });
    // }
  };

  const gridApi = useRef(null);
  const columnApi = useRef(null);
  // const [columnsapidata, setcolumnsapidata] = useState();

  let minRowHeight = 25;
  // let currentRowHeight;

  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
    columnApi.current = params.columnApi;

    // minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
    // currentRowHeight = minRowHeight;
  }, []);

  const handleUpdate = async (data) => {
    if (data.mrate === "") {
      setPopupContentMalert("Please Enter Mrate");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (Number(data.mrate) === 0) {
      setPopupContentMalert("Please Enter Non Zero Value in Mrate");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      try {
        let resCreate = await axios.post(SERVICE.UNITRATE_UNALLOT_SINGLE_UPDATE, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          mrate: String(data.mrate),
          id: String(data.id),
          // updatedby: {
          name: String(isUserRoleAccess.companyname),
          date: new Date(),
          // },
        });
        const updatedRows = rows.map((row) => {
          // If the row id matches, update it with the new data
          if (row.id === data.id) {
            return { ...row, isedited: true }; // Update only the mrate or other fields as necessary
          }
          return row; // Keep other rows unchanged
        });

        const updatedRemovedRows = updatedRows.filter((row) => row.isedited !== true);
        setRows(updatedRemovedRows);
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      } catch (err) {
        console.log(err, "err");
      }
    }
  };
  // console.log(selectedRows, 'selectedRows');
  const handleBulkUndo = async () => {
    try {
      let resCreate = await axios.post(SERVICE.PAYRUN_BULKUNDO, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        selectedRows: selectedRows,
      });
      if (resCreate.statusText === "OK") {
        setPopupContent("Updated values are removed");
        setPopupSeverity("success");
        handleClickOpenPopup();
        handleFilter();
      }
    } catch (err) {
      console.log(err, "err");
    }
    //
  };
  const [fileData, setFileData] = useState([]);
  // const fileData1 = [
  //   {
  //     Empcode: 'TT241004973',
  //     Name: 'AISHWARYA.LOGANATHAN',
  //     'Total Absent/Leave Shift': '5',
  //     'Total Paid Shift': '25',
  //     'Target Points': '1000',
  //     'Acheived Points': '50',
  //     'Acutal Penalty Amount': '75',
  //     'No Allowance Shift': '5',
  //     'Shift Allowance Point': '100',
  //     'Shift Allowance Target': '5',
  //     'Night Shift Allowance': '10',
  //     'Current Month Avg': '25',
  //     'Current Month Attendance': '4',
  //   },
  // ];
  // const fileDataAltered1 = [
  //   {
  //     empcode: 'TT241004973',
  //     name: 'AISHWARYA.LOGANATHAN',
  //     month: 'November',
  //     year: '2024',
  //     totalabsentlog: '5',
  //     totalpaiddayslog: '25',
  //     targetpointlog: '1000',
  //     acheivedpointlog: '50',
  //     penaltylog: '75',
  //     noshiftlog: '5',
  //     shiftallowancelog: '100',
  //     shiftallowtargetlog: '5',
  //     nightshiftallowlog: '10',
  //     currmonthavglog: '25',
  //     currmonthattlog: '4',
  //   },
  // ];

  // const ExportsHead = () => {
  //   let fileDownloadName = 'PayrunMaster';
  //   // if (selectedMonth=== '' || selectedYear === '') {
  //   //   let alertMsg = selectedCompany === 'Please Select Company' && selectedBranch === 'Please Select Branch' ? 'Please Select Company & Branch' : selectedCompany === 'Please Select Company' ? 'Please Select Company' : 'Please Select Branch';
  //   //   setPopupContentMalert(alertMsg);
  //   //   setPopupSeverityMalert('info');
  //   //   handleClickOpenPopupMalert();
  //   // } else {
  //   const body = employeesDrops.map((item) => ({
  //     Name: item.companyname,
  //     'Total Absent/Leave Shift': '',
  //     'Total Paid Shift': '',
  //     'Target Points': '',
  //     'Acheived Points': '',
  //     'Acutal Penalty Amount': '',
  //     'No Allowance Shift': '',
  //     'Shift Allowance Point': '',
  //     'Night Shift Allowance': '',
  //     'Current Month Avg': '',
  //     'Current Month Attendance': '',
  //   }));
  //   new CsvBuilder(fileDownloadName)
  //     .setColumns(['Name', 'Total Absent/Leave Shift', 'Total Paid Shift', 'Target Points', 'Acheived Points', 'Acutal Penalty Amount', 'No Allowance Shift', 'Shift Allowance Point', 'Night Shift Allowance', 'Current Month Avg', 'Current Month Attendance'], body)
  //     .exportFile();
  //   // }
  // };

  const ExportsHead = () => {
    const fileDownloadName = "PayrunMaster.xlsx";

    // const employeesDrops = [{ companyname: 'Company A' }, { companyname: 'Company B' }];

    const headers = ["Name", "Total Absent/Leave Shift", "Total Paid Shift", "Target Points", "Achieved Points", "Actual Penalty Amount", "No Allowance Shift", "Shift Allowance Point", "Night Shift Allowance", "Current Month Avg", "Current Month Attendance", "Month", "Year"];

    const data = employeesDrops.map((item) => [item.companyname, "", "", "", "", "", "", "", "", "", "", selectedMonth, selectedYear]);

    // Add headers as the first row
    data.unshift(headers);
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payrun Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), fileDownloadName);
  };

  const readExcel = (file) => {
    if (!(file instanceof Blob)) {
      // Handle the case when the file is not a Blob
      return;
    }

    if (selectedMonth === "") {
      setPopupContentMalert("Please Select Month");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
      return;
    }

    if (selectedYear === "") {
      setPopupContentMalert("Please Select Year");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
      return;
    }

    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      const filteredData = data.filter((row) => {
        // Get all the keys excluding 'Name'
        const keys = Object.keys(row).filter((key) => key !== "Name" && key !== "Month" && key !== "Year");

        // Check if at least one key has a non-empty value
        return keys.some((key) => row[key] !== "" && row[key] !== null && row[key] !== undefined && !isNaN(row[key]));
      });

      // Check for empty file
      if (filteredData.length === 0) {
        setPopupContentMalert("The selected File value are empty");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        const finalData = filteredData
          .map((item) => ({
            name: item.Name,
            month: item.Month,
            year: item.Year,
            totalabsentlog: item["Total Absent/Leave Shift"],
            totalpaiddayslog: item["Total Paid Shift"],
            targetpointlog: item["Target Points"],
            acheivedpointlog: item["Achieved Points"],
            penaltylog: item["Actual Penalty Amount"],
            noshiftlog: item["No Allowance Shift"],
            shiftallowancelog: item["Shift Allowance Point"],
            shiftallowtargetlog: item["Shift Allowance Target"],
            nightshiftallowlog: item["Night Shift Allowance"],
            currmonthavglog: item["Current Month Avg"],
            currmonthattlog: item["Current Month Attendance"],
          }))
          .map((row) => {
            // Create a new object with only non-empty fields
            const cleanedRow = {};
            for (const key in row) {
              if (row[key] !== "" && row[key] !== null && row[key] !== undefined) {
                cleanedRow[key] = row[key];
              }
            }
            return cleanedRow;
          });

        setFileData(finalData);
      }
    });
  };

  const handleFileUploadUpdate = async () => {
    try {
      let resCreate = await axios.post(SERVICE.PAYRUN_BULK_UPDATE_BYFILEUPLOAD, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        multiUsers: fileData,
      });
      if (resCreate.statusText === "OK") {
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setFileUploadName("");
        setFileData([]);
        handleFilter();
      }
    } catch (err) {
      console.log(err, "err");
    }
    //
  };

  const clearFileSelection = () => {
    setFileUploadName("");
    setFileData([]);
    readExcel(null);
  };

  // const editCellWidth =

  const [columnName, setColumnName] = useState("");
  const inputRef = useRef(null);

  const handleColumnChange = (e) => {
    const value = e.target.value;
    setColumnName(value);

    if (!value.trim()) {
      return;
    }

    const api = gridApi.current;
    if (!api) {
      console.error("Grid API is not available.");
      return;
    }
    // console.log(api,'api')
    // Retrieve all columns
    const allColumns = api.getColumns();
    // console.log(allColumns,'allColumns')
    if (allColumns) {
      const column = allColumns.find(
        // (col) => col.colDef.headerName.toLowerCase() === value.trim().toLowerCase()
        (col) => col.colDef.headerName.toLowerCase().includes(value.trim().toLowerCase())
      );

      if (column) {
        api.ensureColumnVisible(column);
      } else {
        console.warn(`Column with headerName "${value}" not found.`);
      }
    } else {
      console.error("Unable to retrieve columns.");
    }
  };
  const headerStyle = { wrapHeaderText: true, autoHeaderHeight: true };

  const columns = [
    {
      field: "checkbox",
      headerName: "",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      flex: 0,
      width: 70,
      hide: !columnVisibility.checkbox,
      pinned: "left",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      filter: true,
      pinned: "left",
      hide: !columnVisibility.serialNumber,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 120,
      filter: true,

      hide: !columnVisibility.company,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      filter: true,
      hide: !columnVisibility.branch,
    },
    { field: "unit", headerName: "Unit", flex: 0, width: 90, filter: true, hide: !columnVisibility.unit },
    { field: "empcode", headerName: "Emp Code", flex: 0, pinned: "left", width: 120, filter: true, hide: !columnVisibility.empcode },
    { field: "legalname", headerName: "Aadhar Name", flex: 0, width: 250, filter: true, hide: !columnVisibility.legalname },
    { field: "companyname", headerName: "Company Name", flex: 0, pinned: "left", width: 250, filter: true, hide: !columnVisibility.companyname },
    { field: "department", headerName: "Department", flex: 0, width: 200, filter: true, hide: !columnVisibility.department },
    { field: "designation", headerName: "Designation", flex: 0, width: 200, filter: true, hide: !columnVisibility.designation },
    { field: "team", headerName: "Team", flex: 0, width: 100, filter: true, hide: !columnVisibility.team },
    { field: "processcodeexp", headerName: "Process Code", flex: 0, width: 170, filter: true, hide: !columnVisibility.processcodeexp },
    { field: "doj", headerName: "DOJ", flex: 0, width: 110, filter: true, hide: !columnVisibility.doj },
    { field: "experience", headerName: "Actual Exp", flex: 0, width: 100, filter: true, hide: !columnVisibility.experience },
    { field: "prodexp", headerName: "Prod Exp", flex: 0, width: 100, filter: true, hide: !columnVisibility.prodexp },

    { field: "totalnumberofdays", headerName: "Total No.of Days", flex: 0, width: 100, filter: true, hide: !columnVisibility.totalnumberofdays },
    { field: "totalshift", headerName: "Total Shift", flex: 0, width: 100, filter: true, hide: !columnVisibility.totalshift },
    { field: "clsl", headerName: "C.L. / S.L.", flex: 0, width: 100, filter: true, hide: !columnVisibility.clsl },
    { field: "weekoff", headerName: "Week Off", flex: 0, width: 100, filter: true, hide: !columnVisibility.weekoff },
    { field: "holiday", headerName: "Holiday", flex: 0, width: 100, filter: true, hide: !columnVisibility.holiday },
    {
      field: "totalasbleave",
      headerName: "Total Absent/Leave Shift",
      flex: 0,
      // width: 100,
      filter: true,

      hide: !columnVisibility.totalasbleave,
      cellRenderer: (params) => <CustomRateField oldValue={params.data.totalasbleaveOldValue} fieldName={"totalabsentlog"} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} otherfieldval={params.data.totalpaidDaysOldValue} gridApi={gridApi} />,
    },
    {
      field: "totalpaidDays",
      headerName: "Total Paid Shift",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.totalpaidDays,
      cellRenderer: (params) => <CustomRateField oldValue={params.data.totalpaidDaysOldValue} fieldName={"totalpaiddayslog"} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} otherfieldval={params.data.totalasbleaveOldValue} gridApi={gridApi} />,
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 0,
    //   width: 120,
    //   cellRenderer: (params) => (
    //     <Button variant="contained" sx={{ textTransform: "capitalize" }} size="small" onClick={() => handleUpdate(params.data)}>
    //       Update
    //     </Button>
    //   ),
    // },

    { field: "oldgross", headerName: "Gross", flex: 0, width: 100, filter: true, hide: !columnVisibility.oldgross },
    { field: "oldbasic", headerName: "Basic", flex: 0, width: 100, filter: true, hide: !columnVisibility.oldbasic },
    { field: "oldhra", headerName: "HRA", flex: 0, width: 100, filter: true, hide: !columnVisibility.oldhra },
    { field: "oldconveyance", headerName: "Conveyance", flex: 0, width: 100, filter: true, hide: !columnVisibility.oldconveyance },
    { field: "oldmedicalallowance", headerName: "Medical Allowance", flex: 0, width: 120, filter: true, hide: !columnVisibility.oldmedicalallowance },
    { field: "oldproductionallowance", headerName: "Production Allowance", flex: 0, width: 120, filter: true, hide: !columnVisibility.oldproductionallowance },
    { field: "oldproductionallowancetwo", headerName: "Production Allowance 2", flex: 0, width: 120, filter: true, hide: !columnVisibility.oldproductionallowancetwo },
    { field: "oldotherallowance", headerName: "Other Allowance", flex: 0, width: 120, filter: true, hide: !columnVisibility.oldotherallowance },

    { field: "newgross", headerName: "New Gross", flex: 0, width: 100, filter: true, hide: !columnVisibility.newgross },
    { field: "actualbasic", headerName: "Actual Basic", flex: 0, width: 100, filter: true, hide: !columnVisibility.actualbasic },
    { field: "actualhra", headerName: "Actual HRA", flex: 0, width: 100, filter: true, hide: !columnVisibility.actualhra },
    { field: "actualconveyance", headerName: "Actual Conveyance", flex: 0, width: 100, filter: true, hide: !columnVisibility.actualconveyance },
    { field: "actualmedicalallowance", headerName: "Actual Medical Allowance", flex: 0, width: 120, filter: true, hide: !columnVisibility.actualmedicalallowance },
    { field: "actualproductionallowance", headerName: "Actual Production Allowance", flex: 0, width: 120, filter: true, hide: !columnVisibility.actualproductionallowance },
    { field: "actualproductionallowancetwo", headerName: "Actual Production Allowance 2", flex: 0, width: 120, filter: true, hide: !columnVisibility.actualproductionallowancetwo },
    { field: "actualotherallowance", headerName: "Actual Other Allowance", flex: 0, width: 120, filter: true, hide: !columnVisibility.actualotherallowance },
    {
      field: "monthPoint",
      headerName: "Target Points",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.monthPoint,
      cellRenderer: (params) => <CustomRateField fieldName={"targetpointlog"} oldValue={params.data.monthPointOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    {
      field: "acheivedpoints",
      headerName: "Acheived Points",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.acheivedpoints,
      cellRenderer: (params) => <CustomRateField fieldName={"acheivedpointlog"} oldValue={params.data.acheivedpointsOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    {
      field: "acheivedpercent",
      headerName: "Acheived %",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.acheivedpercent,
    },
    {
      field: "actualpenalty",
      headerName: "Acutal Penalty Amount",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.actualpenalty,
      cellRenderer: (params) => <CustomRateField fieldName={"penaltylog"} oldValue={params.data.actualpenaltyOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    { field: "bankname", headerName: "Bank Name", flex: 0, width: 150, filter: true, hide: !columnVisibility.bankname },
    { field: "accountname", headerName: "Account Name", flex: 0, width: 150, filter: true, hide: !columnVisibility.accountname },
    { field: "accountnumber", headerName: "Account Number", flex: 0, width: 150, filter: true, hide: !columnVisibility.accountnumber },
    { field: "ifsccode", headerName: "IFSC Code", flex: 0, width: 100, filter: true, hide: !columnVisibility.ifsccode },
    { field: "uan", headerName: "UAN", flex: 0, width: 100, filter: true, hide: !columnVisibility.uan },
    { field: "pfmembername", headerName: "PF Member Name", flex: 0, width: 110, filter: true, hide: !columnVisibility.pfmembername },
    { field: "insuranceno", headerName: "Insurance No", flex: 0, width: 110, filter: true, hide: !columnVisibility.insuranceno },
    { field: "ipname", headerName: "IP Name", flex: 0, width: 100, filter: true, hide: !columnVisibility.ipname },

    {
      field: "noallowanceshift",
      headerName: "No Allowance Shift",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.noallowanceshift,
      cellRenderer: (params) => <CustomRateField fieldName={"noshiftlog"} oldValue={params.data.noallowanceshiftOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    {
      field: "shiftallowancepoint",
      headerName: "Shift Allowance Point",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.shiftallowancepoint,
      cellRenderer: (params) => <CustomRateField fieldName={"shiftallowancelog"} oldValue={params.data.shiftallowancepointOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    {
      field: "shiftallowancetarget",
      headerName: "Shift Allowance Target",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.shiftallowancetarget,
      cellRenderer: (params) => <CustomRateField fieldName={"shiftallowtargetlog"} oldValue={params.data.shiftallowancetargetOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    {
      field: "nightshiftallowance",
      headerName: "Night Shift Allowance",
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.nightshiftallowance,
      cellRenderer: (params) => <CustomRateField fieldName={"nightshiftallowlog"} oldValue={params.data.nightshiftallowanceOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    { field: "era", headerName: "ERA", flex: 0, width: 100, filter: true, hide: !columnVisibility.era },
    { field: "revenueallow", headerName: "Revenue Allowance", flex: 0, width: 110, filter: true, hide: !columnVisibility.revenueallow },
    { field: "shortage", headerName: "Shortage", flex: 0, width: 110, filter: true, hide: !columnVisibility.shortage },
    {
      field: "currentmonthavg",
      headerName: `Current Month Avg`,
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.currentmonthavg,
      cellRenderer: (params) => <CustomRateField fieldName={"currmonthavglog"} oldValue={params.data.currentmonthavgOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    {
      field: "currentmonthattendance",
      headerName: `Current Month Att`,
      flex: 0,
      // width: 160,
      filter: true,

      hide: !columnVisibility.currentmonthattendance,
      cellRenderer: (params) => <CustomRateField fieldName={"currmonthattlog"} oldValue={params.data.currentmonthattendanceOldValue} value={params.value} row={params.data} column={params.colDef} updateRowData={updateRowData} gridApi={gridApi} />,
    },
    { field: "paidstatus", headerName: "Paid Status", flex: 0, width: 200, filter: true, hide: !columnVisibility.paidstatus },
  ];

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columns.filter((column) => {
    if (searchQueryManage.toLowerCase() === "checkbox") {
      return column.headerName === "";
    }

    return column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase());
  });

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
                columns.forEach((column) => {
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

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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
    fetchAll();
    fetchCompany();
  }, []);

  return (
    <Box>
      <Headtitle title={"Pay Run Master"} />
      {/* ****** Header Content ****** */}
      <PageHeading title="Pay Run Master" modulename="PayRoll" submodulename="PayRoll Setup" mainpagename="Pay Run Master" subpagename="" subsubpagename="" />
      {isUserRoleCompare?.includes("apayrunmaster") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Filters</Typography>
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
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect options={branches} value={selectedBranch} onChange={handleBranchChange} valueRenderer={customValueRendererBranch} labelledBy="Please Select Branch" />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Unit</Typography>
                    <MultiSelect options={units} value={selectedUnit} onChange={handleUnitChange} valueRenderer={customValueRendererUnit} labelledBy="Please Select Unit" />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Team</Typography>
                    <MultiSelect options={teams} value={selectedTeam} onChange={handleTeamChange} valueRenderer={customValueRendererTeam} labelledBy="Please Select Team" />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department<b style={{ color: "red" }}>*</b>
                    </Typography>
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
                      options={employeesDrops.map((item) => ({
                        label: item.companyname,
                        value: item.companyname,
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
                  <Button variant="contained" disabled={isBankdetail === true} onClick={handleFilter}>
                    Filter
                  </Button>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <Button variant="contained" color="success" sx={{ textTransform: "Capitalize" }} onClick={(e) => ExportsHead()}>
                    <FaDownload />
                    &ensp;Download template file
                  </Button>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Button variant="contained" component="label" sx={{ textTransform: "capitalize" }}>
                    Choose File
                    <input
                      hidden
                      type="file"
                      accept=".xlsx, .xls , .csv"
                      onChange={(e) => {
                        const file = e.target.files[0];

                        readExcel(file);
                        setFileUploadName(file.name);
                        e.target.value = null;
                      }}
                    />
                  </Button>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  {fileUploadName != "" && fileData.length > 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "left" }}>
                      <p>{fileUploadName}</p>
                      <Button sx={{ minWidth: "36px", borderRadius: "50%" }} onClick={() => clearFileSelection()}>
                        <FaTrash style={{ color: "red" }} />
                      </Button>
                    </Box>
                  ) : null}
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Button variant="contained" disabled={isBankdetail === true} onClick={handleFileUploadUpdate}>
                    SUBMIT
                  </Button>
                </Grid>
              </Grid>
              <Typography sx={{ color: "#d11a1a", fontWeight: 600, marginTop: "10px" }}>Note: Leave the field blank where the value does not need to be edited in the template file.</Typography>
            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lpayrunmaster") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            {/* <Grid item xs={8}> */}
            <Typography sx={userStyle.importheadtext}>Pay Run Master</Typography>
            {/* </Grid> */}
            <Grid container style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <Typography>Show entries:</Typography>
                  <Select
                    id="pageSizeSelect"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={rows.length}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("excelpayrunmaster") && (
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
                  {isUserRoleCompare?.includes("csvpayrunmaster") && (
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
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp; Jump to:-
            <input type="text" style={{ padding: "8px", borderRadius: "4px" }} placeholder="Enter header name" ref={inputRef} value={columnName} onChange={handleColumnChange} />
            &ensp;
            <Button variant="contained" onClick={handleBulkUndo}>
              Bulk Undo
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
            {isBankdetail ? (
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
                    // height: 300,

                    width: "100%",
                    // overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                  className="ag-theme-quartz"
                  ref={gridRefImg}
                >
                  <AgGridReact
                    rowData={paginatedData}
                    columnDefs={columns}
                    defaultColDef={{
                      flex: 1,
                      resizable: true,
                      ...headerStyle,
                    }}
                    ref={gridRef}
                    onCellEditingStopped={handleCellEdit} // Triggers when cell editing is complete.
                    suppressRowClickSelection={true}
                    rowSelection="multiple"
                    onGridReady={onGridReady}
                    onSelectionChanged={(event) => {
                      const selectedRowsData = event.api.getSelectedRows();
                      // setSelectedRows(selectedRowsData);
                      setSelectedRows(selectedRowsData.map((item) => ({ month: item.selectedmonth, year: item.selectedyear, id: item._id })));
                    }}
                    domLayout="autoHeight"
                    getRowId={(params) => params.data.id}
                    getRowNodeId={(data) => data.id}
                  />
                  {/* <StyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columns.filter((column) => columnVisibility[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    ref={gridRef}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  /> */}
                </Box>
                <Box sx={userStyle.dataTablestyle}>
                  <Box>
                    Showing {paginatedData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredData.length)} of {filteredData.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>

                    {/* {pageNumbers.slice(0, 3).map((pageNumber) => (
                      <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} disabled={page === pageNumber} className={page === pageNumber ? "active" : ""} sx={userStyle.paginationbtn}>
                        {pageNumber}
                      </Button>
                    ))} */}
                    {/* Pagination Buttons */}
                    {page > Math.floor(maxVisiblePages / 2) + 1 && <span>...</span>}
                    {calculatePageNumbers(totalPages, page, maxVisiblePages).map((pageNumber) => (
                      <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} disabled={page === pageNumber} className={page === pageNumber ? "active" : ""} sx={userStyle.paginationbtn}>
                        {pageNumber}
                      </Button>
                    ))}

                    {totalPages > 3 && page < totalPages - 2 && <span>...</span>}

                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage(Number(totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </>
      )}

      {/* Delete Modal */}
      <Box>
        {/* print layout */}
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
            <TableHead>
              <TableRow>
                <TableCell> SI.No</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>SubCategory</TableCell>
                <TableCell>Production</TableCell>
                <TableCell>Mode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rows &&
                rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.datenew}</TableCell>
                    <TableCell>{row.project}</TableCell>
                    <TableCell>{row.filename}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.productioncount}</TableCell>
                    <TableCell>{row.mode}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={paginatedData ?? []}
        itemsTwo={items ?? []}
        filename={"Pay Run Master"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
    </Box>
  );
}

export default PayRunMaster;
