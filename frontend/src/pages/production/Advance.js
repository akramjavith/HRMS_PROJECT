import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextareaAutosize, TextField, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Resizable from "react-resizable";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import PageHeading from "../../components/PageHeading";

function Advance() {
  const [fileFormat, setFormat] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };
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
  }
  let today = new Date();
  const currYear = today.getFullYear();
  const years = [];
  // for (let year = currYear; year <= currYear + 10; year++) {
  //   years.push({ value: year, label: year.toString() });
  // }
  for (let i = 0; i <= 1; i++) {
    const year = (currYear - 1) + i;
    years.push({ label: year.toString(), value: year });
  }
  const [selectedYear, setSelectedYear] = useState("Select Year");
  const [selectedYearEdit, setSelectedYearEdit] = useState("Select Year");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedMonthEdit, setSelectedMonthEdit] = useState("");
  const [selectmonthname, setSelectMonthName] = useState("Select Month");
  const [selectmonthnameEdit, setSelectMonthNameEdit] = useState("Select Month");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateEdit, setSelectedDateEdit] = useState("");
  const currentdate = new Date();
  const [advance, setAdvance] = useState({
    advanceamount: "",
    requestmonth: getCurrentMonth(),
    requestyear: "Please Select Year",
    requestdate: moment(currentdate).format("YYYY-MM-DD"),
    description: "",
    access: "Self",
    employeename: "Please Select Employee Name"
  });
  const [isBtn, setIsBtn] = useState(false)
  const [selectStatus, setSelectStatus] = useState({});
  const [advanceEdit, setAdvanceEdit] = useState({
    advanceamount: "",
    requestmonth: "",
    requestdate: "Please Select Request Date"
  });
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allGroupEdit, setAllGroupEdit] = useState([]);
  const [groupCheck, setGroupCheck] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [advanceApprovalMonth, setAdvanceApprovalMonth] = useState("")
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const username = isUserRoleAccess.username;
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [openviewalert, setOpenviewalert] = useState(false);
  // view model
  const handleClickOpenviewalert = () => {
    setOpenviewalert(true);
  };
  const handleCloseviewalert = () => {
    setOpenviewalert(false);
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Advance.png");
        });
      });
    }
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
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
  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows?.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };
  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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
  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };
  const [companyOpt, setCompanyOpt] = useState([]);
  const [branchOption, setBranchOption] = useState([]);
  const [unitOption, setUnitOption] = useState([]);
  const [teamOption, setTeamOption] = useState([]);
  const [employeeOption, setEmployeeOption] = useState([]);
  const fetchCompany = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompanyOpt([
        ...res?.data?.companies?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //get all branches.
  const fetchBranchAll = async (e) => {
    const branchArr = e.map((t) => t.name)
    setPageName(!pageName)
    try {
      let res_location = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const BranchOpt = res_location?.data?.branch?.filter((t) => branchArr.includes(t.company))
      setBranchOption(
        BranchOpt?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //get all unit.
  const fetchUnitAll = async (e) => {
    let branchArr = e.map(data => data.name)
    setPageName(!pageName)
    try {
      let res_location = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const UnitOpt = res_location?.data?.units?.filter((t) => branchArr.includes(t.branch))
      setUnitOption(
        UnitOpt?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //get all Team.
  const fetchTeamAll = async (e) => {
    let unitArr = e.map(data => data.name)
    setPageName(!pageName)
    try {
      let res_location = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const TeamOpt = res_location?.data?.teamsdetails?.filter((t) => unitArr.includes(t.unit))
      setTeamOption(
        TeamOpt?.map((t) => ({
          ...t,
          label: t.teamname,
          value: t.teamname,
        })),
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //function to fetch Employee
  const fetchEmployeeAll = async (teamOpt) => {
    let companyArr = valueCompanyCat
    let branchArr = valueBranchCat
    let unitArr = valueUnitCat
    let teamArr = teamOpt.map(data => data.teamname)
    setPageName(!pageName)
    try {
      let res_participants = await axios.get(SERVICE.USERALLLIMIT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      const empOpt = res_participants?.data?.users?.filter((t) => companyArr?.includes(t.company) && branchArr?.includes(t.branch) && unitArr?.includes(t.unit) && teamArr?.includes(t.team))
      setEmployeeOption(
        empOpt?.map((t) => ({
          ...t,
          label: t.companyname,
          value: t.companyname,
        })),
      );
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchCompany();
  }, []);
  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };
  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };
  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };
  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([])
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([])
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([])
  let [valueUnitCat, setValueUnitCat] = useState([]);
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([])
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    fetchBranchAll(options)
  };
  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    fetchUnitAll(options)
  };
  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    fetchTeamAll(options)
  };
  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    fetchEmployeeAll(options)
  };
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    advanceamount: true,
    requestdate: true,
    requestyear: true,
    requestmonth: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    empcode: true,
    companyname: true,
    employeename: true,
    shifttiming: true,
    status: true,
    document: true,
    description: true,
    createddatetime: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const [deleteGroup, setDeletegroup] = useState("");
  const rowData = async (id, advanceamount) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ADVANCE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletegroup(res?.data?.sadvance);
      handleClickOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // Alert delete popup
  let groupEditt = deleteGroup._id;
  const deleGroup = async () => {
    setPageName(!pageName)
    try {
      await axios.delete(`${SERVICE.ADVANCE_SINGLE}/${groupEditt}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchAllGroup();
      handleCloseMod();
      handleCloseCheck();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setPage(1);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const delGroupcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.ADVANCE_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      await fetchAllGroup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [employeeDetails, setEmployeeDetails] = useState([])
  //add function
  const sendRequest = async () => {
    setIsBtn(true)
    setPageName(!pageName)
    try {
      let grpcreate = await axios.post(SERVICE.ADVANCE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        advanceamount: String(advance.advanceamount),
        requestyear: String(selectedYear),
        requestmonth: String(selectmonthname),
        requestdate: String(advance.requestdate),
        description: String(advance.description),
        document: documentFiles,
        // company: String(isUserRoleAccess.company),
        // branch: String(isUserRoleAccess.branch),
        // unit: String(isUserRoleAccess.unit),
        // team: String(isUserRoleAccess.team),
        empcode: String(advance.access === "Self" ? isUserRoleAccess.empcode : employeeDetails.empcode),
        companyname: String(isUserRoleAccess.companyname),
        shifttiming: String(isUserRoleAccess.shifttiming),
        company: advance.access === "Self" ? isUserRoleAccess.company : employeeDetails.company,
        branch: advance.access === "Self" ? isUserRoleAccess.branch : employeeDetails.branch,
        unit: advance.access === "Self" ? isUserRoleAccess.unit : employeeDetails.unit,
        team: advance.access === "Self" ? isUserRoleAccess.team : employeeDetails.team,
        employeename: advance.access === "Self" ? String(isUserRoleAccess.companyname) : String(employeeDetails.companyname),
        status: String("Applied"),
        rejectedreason: String(""),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setAdvance(grpcreate.data);
      await fetchAllGroup();
      setAdvance({
        advanceamount: "",
        requestmonth: getCurrentMonth(),
        requestdate: moment(currentdate).format("YYYY-MM-DD"),
        description: "",
        access: "Self",
      });
      setdocumentFiles([])
      setSelectedYear("Select Year");
      setSelectMonthName("Select Month");
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) { setIsBtn(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [approvedAdvance, setIsApprovedAdvance] = useState()
  useEffect(() => {
    function addMonthsToDate(startDate, numMonths) {
      startDate = new Date(startDate);
      let year = startDate.getFullYear();
      let month = startDate.getMonth();
      let date = startDate.getDate();
      month += Number(numMonths);
      if (month > 12) {
        year += Math.floor(month / 12);
        month %= 12;
      }
      let resultDate = new Date(year, month, date);
      let currentDate = new Date();
      if (resultDate >= currentDate) {
        let monthDiff = (resultDate.getFullYear() - currentDate.getFullYear()) * 12 + resultDate.getMonth() - currentDate.getMonth();
        return { monthDiff: monthDiff };
      } else {
        return { monthDiff: null };
      }
    }
    const isApproved = addMonthsToDate(advance.access === "Self" ? isUserRoleAccess?.doj : employeeDetails.doj, advanceApprovalMonth);
    setIsApprovedAdvance(isApproved)
  }, [advanceApprovalMonth])
  console.log(employeeDetails)
  console.log(isUserRoleAccess)
  console.log(groups)
  // console.log(selectmonthname)
  const handleSubmit = (e) => {
    console.log("is")
    e.preventDefault();
    console.log(employeeDetails)
    const isNameMatch = groups.some((item) => {
      const requestMonthMatch = item.requestmonth?.toLowerCase() === selectmonthname?.toLowerCase();
      const companyNameMatch = advance.access === "Self"
        ? item.employeename?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase()
        : item.employeename?.toLowerCase() === employeeDetails?.companyname?.toLowerCase();
      return requestMonthMatch && companyNameMatch;
    });
    console.log(isNameMatch)
    if (advance.access === "Please Select Access") {
      setPopupContentMalert("Please Select Access");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (advance.advanceamount === "") {
      setPopupContentMalert("Please Enter Advance Amount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedYear === "Select Year") {
      setPopupContentMalert("Please Select Request Year");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectmonthname === "Select Month") {
      setPopupContentMalert("Please Select Request Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    }
    else if (advance.requestdate === "") {
      setPopupContentMalert("Please Select Request Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert(`Advance Amount already exists for ${selectmonthname} Month!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (approvedAdvance.monthDiff !== null) {
      setPopupContentMalert(`Eligible for Advance After ${approvedAdvance.monthDiff} Month!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (advance.access === "Others" && isUserRoleCompare.includes("lassignadvance") && selectedOptionsCompany.length === 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    }
    else if (advance.access === "Others" && isUserRoleCompare.includes("lassignadvance") && selectedOptionsBranch.length === 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    }
    else if (advance.access === "Others" && isUserRoleCompare.includes("lassignadvance") && selectedOptionsUnit.length === 0) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    }
    else if (advance.access === "Others" && isUserRoleCompare.includes("lassignadvance") && selectedOptionsTeam.length === 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    }
    else if (advance.access === "Others" && advance.employeename === "Please Select Employee Name") {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert()
    }
    else {
      sendRequest();
    }
  };
  const handleClear = () => {
    setAdvance({
      advanceamount: "",
      requestdate: moment(currentdate).format("YYYY-MM-DD"),
      description: "",
      access: "Self",
    });
    setEmployeeDetails([])
    setdocumentFiles([])
    setSelectedOptionsTeam([]);
    setSelectedOptionsUnit([]);
    setSelectedOptionsBranch([]);
    setSelectedOptionsCompany([]);
    setEmployeeOption([]);
    setTeamOption([]);
    setUnitOption([]);
    setBranchOption([]);
    updateDateValue(today.getFullYear(), today.getMonth() + 1);
    setSelectedYear("Select Year");
    setSelectMonthName("Select Month");
    setSelectedMonth("");
    setSelectedDate("");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };
  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setSelectStatus({});
  };
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };
  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //get single row to edit....
  const getCode = async (e, advanceamount) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ADVANCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleClickOpenEdit();
      setAdvanceEdit(res?.data?.sadvance);
      setSelectedYearEdit(res?.data?.sadvance?.requestyear)
      setSelectMonthNameEdit(res?.data?.sadvance?.requestmonth)
      setSelectedDateEdit(res?.data?.sadvance?.requestdate)
      updateDateValueEdit(
        res?.data?.sadvance?.requestyear,
        res?.data?.sadvance?.requestmonth === "January" ? 1 :
          res?.data?.sadvance?.requestmonth === "February" ? 2 :
            res?.data?.sadvance?.requestmonth === "March" ? 3 :
              res?.data?.sadvance?.requestmonth === "April" ? 4 :
                res?.data?.sadvance?.requestmonth === "May" ? 5 :
                  res?.data?.sadvance?.requestmonth === "June" ? 6 :
                    res?.data?.sadvance?.requestmonth === "July" ? 7 :
                      res?.data?.sadvance?.requestmonth === "August" ? 8 :
                        res?.data?.sadvance?.requestmonth === "September" ? 9 :
                          res?.data?.sadvance?.requestmonth === "October" ? 10 :
                            res?.data?.sadvance?.requestmonth === "November" ? 11 :
                              res?.data?.sadvance?.requestmonth === "December" ? 12 : ""
      )
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [documentFilesView, setdocumentFilesView] = useState([]);
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ADVANCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAdvanceEdit(res?.data?.sadvance);
      setdocumentFilesView(res?.data?.sadvance?.document)
      handleClickOpenview();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ADVANCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      handleClickOpeninfo();
      setAdvanceEdit(res?.data?.sadvance);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //Project updateby edit page...
  let updateby = advanceEdit.updatedby;
  let addedby = advanceEdit.addedby;
  let projectsid = advanceEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.ADVANCE_SINGLE}/${projectsid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        advanceamount: String(advanceEdit.advanceamount),
        requestyear: String(selectedYearEdit),
        requestmonth: String(selectmonthnameEdit),
        requestdate: String(selectedDateEdit),
        company: String(isUserRoleAccess.company),
        branch: String(isUserRoleAccess.branch),
        unit: String(isUserRoleAccess.unit),
        team: String(isUserRoleAccess.team),
        empcode: String(isUserRoleAccess.empcode),
        companyname: String(isUserRoleAccess.companyname),
        shifttiming: String(isUserRoleAccess.shifttiming),
        rejectedreason: String(selectStatus.status == "Rejected" ? selectStatus.rejectedreason : ""),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setAdvanceEdit(res.data);
      await fetchAllGroup();
      await fetchGroupAll();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseModEdit();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchGroupAll();
    const isNameMatch = allGroupEdit.some((item) => item?.requestmonth?.toLowerCase() === selectmonthnameEdit?.toLowerCase() &&
      item?.companyname?.toLowerCase() === isUserRoleAccess?.companyname?.toLowerCase()
    );
    if (advanceEdit.advanceamount === "") {
      setPopupContentMalert("Please Enter Advance Amount");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedYearEdit === "Select Year") {
      setPopupContentMalert("Please Select Request Year");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectmonthnameEdit === "Select Month") {
      setPopupContentMalert("Please Select Request Month");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (selectedDateEdit === "") {
      setPopupContentMalert("Please Select Request Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert(`Advance Amount already exists for ${selectmonthnameEdit} Month!`);
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendEditRequest();
    }
  };
  const [overAllsettingsCount, setOverAllsettingsCount] = useState("")
  const fetchOverAllSettings = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      if (res?.data?.count === 0) {
        setOverAllsettingsCount(res?.data?.count);
      } else {
        setAdvanceApprovalMonth(
          res?.data?.overallsettings[res?.data?.overallsettings?.length - 1]
            ?.advanceapprovalmonth
        );
      }
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  //get all project.
  const fetchAllGroup = async () => {
    setPageName(!pageName)
    try {
      let res_grp = await axios.post(SERVICE.ADVANCEBYASSIGNBRANCH, {
        assignbranch: isAssignBranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setGroupCheck(true);
      setGroups(res_grp?.data?.advance.map((t, index) => ({
        ...t,
        requestdate: moment(t.requestdate).format("DD-MM-YYYY"),
        createddatetime: moment(t.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
      })));
    } catch (err) { setGroupCheck(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const [advanceArray, setAdvanceArray] = useState([])
  const fetchAllGroupArray = async () => {
    setPageName(!pageName)
    try {
      let res_grp = await axios.post(SERVICE.ADVANCEBYASSIGNBRANCH, {
        assignbranch: isAssignBranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAdvanceArray(res_grp?.data?.advance?.map((t, index) => ({
        ...t,
        requestdate: moment(t.requestdate).format("DD-MM-YYYY"),
        createddatetime: moment(t.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a"),
      })));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchAllGroupArray();
  }, [isFilterOpen])
  //get all project.
  const fetchGroupAll = async () => {
    setPageName(!pageName)
    try {
      let res_grp = await axios.post(SERVICE.ADVANCEBYASSIGNBRANCH, {
        assignbranch: isAssignBranch
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllGroupEdit(res_grp?.data?.advance.filter((item) => item._id !== advanceEdit._id));
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  let updatedByStatus = selectStatus.updatedby;
  const sendEditStatus = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.ADVANCE_SINGLE}/${selectStatus._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        status: String(selectStatus.status),
        rejectedreason: String(selectStatus.status == "Rejected" ? selectStatus.rejectedreason : ""),
        actionby: String(isUserRoleAccess.companyname),
        updatedby: [
          ...updatedByStatus,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchAllGroup();
      setSelectStatus({});
      handleStatusClose();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const getinfoCodeStatus = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.ADVANCE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSelectStatus(res?.data?.sadvance);
      handleStatusOpen();
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  const editStatus = () => {
    if (selectStatus.status == "Rejected") {
      if (selectStatus.rejectedreason == "") {
        setPopupContentMalert("Please Enter Rejected Reason");
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      } else {
        sendEditStatus();
      }
    } else {
      sendEditStatus();
    }
  };
  let snos = 1;
  // pdf.....
  const columns = [
    // { title: "Sno", field: "serialNumber" },
    { title: "Advance Amount", field: "advanceamount" },
    { title: "Request Year", field: "requestyear" },
    { title: "Request Month", field: "requestmonth" },
    { title: "Request Date", field: "requestdate" },
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Emp Code", field: "empcode" },
    { title: "Employee", field: "companyname" },
    { title: "Shift Time", field: "shifttiming" },
    { title: "Description", field: "description" },
  ];
  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Initialize serial number counter
    let serialNumberCounter = 1;
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];
    // Modify row data to include serial number
    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      advanceArray.map(row => ({
        ...row,
        serialNumber: serialNumberCounter++,
        requestdate: moment(row.requestdate).format("DD-MM-YYYY")
      }));
    // Generate PDF
    doc.autoTable({
      theme: "grid",
      styles: {
        fontSize: 4,
        cellWidth: "auto"
      },
      columns: columnsWithSerial,
      body: dataWithSerial,
    });
    doc.save("Advance.pdf");
  };
  // Excel
  const fileName = "Advance";
  let excelno = 1;
  // get particular columns for export excel
  const getexcelDatas = async () => {
    var data = groups.map((t, i) => ({
      Sno: i + 1,
      "Advance Amount": t.advanceamount,
    }));
    setGroupData(data);
  };
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Advance",
    pageStyle: "print",
  });
  useEffect(() => {
    getexcelDatas();
  }, [advanceEdit, advance, groups]);
  useEffect(() => {
    fetchAllGroup();
    fetchGroupAll();
    fetchOverAllSettings();
  }, []);
  useEffect(() => {
    fetchGroupAll();
  }, [isEditOpen, advanceEdit]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => {
    setStatusOpen(true);
  };
  const handleStatusClose = () => {
    setStatusOpen(false);
  };
  const [items, setItems] = useState([]);
  const addSerialNumber = () => {
    const itemsWithSerialNumber = groups?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };
  useEffect(() => {
    addSerialNumber();
  }, [groups]);
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
  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);
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
  const getDownloadFile = async (data) => {
    data.forEach(async (d) => {
      const fileExtension = getFileExtension(d.name);
      if (fileExtension === "xlsx" || fileExtension === "xls" || fileExtension === "csv") {
        readExcel(d.data)
          .then((excelData) => {
            const newTab = window.open();
            newTab.document.open();
            newTab.document.write('<html><head><title>Excel File</title></head><body></body></html>');
            newTab.document.close();
            const htmlTable = generateHtmlTable(excelData);
            newTab.document.body.innerHTML = htmlTable;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (fileExtension === "pdf") {
        const newTab = window.open();
        newTab.document.write('<iframe width="100%" height="100%" src="' + d.preview + '"></iframe>');
      } else if (fileExtension === "png" || fileExtension === 'jpg') {
        const response = await fetch(d.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const newTab = window.open(url, '_blank');
      }
    });
    function getFileExtension(filename) {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    }
    function readExcel(base64Data) {
      return new Promise((resolve, reject) => {
        const bufferArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0)).buffer;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      });
    }
    function generateHtmlTable(data) {
      const headers = Object.keys(data[0]);
      const tableHeader = `<tr>${headers.map((header) => `<th style="padding: 4px; background-color: #f2f2f2;">${header}</th>`).join("")}</tr>`;
      const tableRows = data.map((row, index) => {
        const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "";
        const cells = headers.map((header) => `<td style="padding: 4px;${rowStyle}">${row[header]}</td>`).join("");
        return `<tr>${cells}</tr>`;
      });
      return `<table style="border-collapse: collapse; width: 100%;" border="1"; overflow :"scroll">${tableHeader}${tableRows.join("")}</table>`;
    }
  };
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header advanceamount
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
            setSelectAllChecked(updatedSelectedRows?.length === filteredData?.length);
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
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    { field: "advanceamount", headerName: "Advance Amount", flex: 0, width: 130, hide: !columnVisibility.advanceamount, headerClassName: "bold-header" },
    { field: "requestyear", headerName: "Request Year", flex: 0, width: 130, hide: !columnVisibility.requestyear, headerClassName: "bold-header" },
    { field: "requestmonth", headerName: "Request Month", flex: 0, width: 130, hide: !columnVisibility.requestmonth, headerClassName: "bold-header" },
    { field: "requestdate", headerName: "Request Date", flex: 0, width: 130, hide: !columnVisibility.requestdate, headerClassName: "bold-header" },
    { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
    { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibility.branch, headerClassName: "bold-header" },
    { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibility.unit, headerClassName: "bold-header" },
    { field: "team", headerName: "Team", flex: 0, width: 100, hide: !columnVisibility.team, headerClassName: "bold-header" },
    { field: "empcode", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
    { field: "employeename", headerName: "Employee", flex: 0, width: 130, hide: !columnVisibility.employeename, headerClassName: "bold-header" },
    { field: "shifttiming", headerName: "Shift Time", flex: 0, width: 100, hide: !columnVisibility.shifttiming, headerClassName: "bold-header" },
    { field: "description", headerName: "Description", flex: 0, width: 100, hide: !columnVisibility.description, headerClassName: "bold-header" },
    { field: "createddatetime", headerName: "Created Date/Time", flex: 0, width: 230, hide: !columnVisibility.createddatetime, headerClassName: "bold-header" },
    { field: "companyname", headerName: "Added By", flex: 0, width: 130, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
    {
      field: "document",
      headerName: "Document",
      sortable: false,
      flex: 0,
      width: 180,
      minHeight: "40px",
      hide: !columnVisibility.document,
      renderCell: (params) => (
        <Grid>
          <Button
            variant="text"
            onClick={() => {
              getDownloadFile(params.row.document);
            }}
            sx={userStyle.buttonview}
          >
            {params.row.document?.length > 0 ? "View" : " "}
          </Button>
        </Grid>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 90,
      hide: !columnVisibility.status,
      headerClassName: "bold-header",
      renderCell: (params) => {
        if (!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && !["Approved", "Rejected"].includes(params.row.status)) {
          return (
            <Grid>
              <Button
                variant="contained"
                style={{
                  backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                  color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                  fontSize: "10px",
                  width: "60px",
                  fontWeight: "bold",
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        } else {
          return (
            <Grid>
              <Button
                variant="contained"
                style={{
                  backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
                  color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                  fontSize: "10px",
                  width: "60px",
                  fontWeight: "bold",
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        }
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 350,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("dadvance") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, params.row.advanceamount);
              }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vadvance") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {((isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin")) && ["Approved", "Rejected"].includes(params.row.status)) ||
            (isUserRoleCompare?.includes("iadvance") && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getinfoCode(params.row.id);
                }}
              >
                <InfoOutlinedIcon style={{ fontsize: "large" }} />
              </Button>
            ))}
          {!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleAccess?.role?.includes("HiringManager") || isUserRoleAccess?.role?.includes("HR") || isUserRoleAccess?.role?.includes("Superadmin"))
            ? null
            : isUserRoleCompare?.includes("iadvance") && (
              <Button
                variant="contained"
                style={{
                  backgroundColor: "red",
                  minWidth: "15px",
                  padding: "6px 5px",
                }}
                onClick={(e) => {
                  getinfoCodeStatus(params.row.id);
                }}
              >
                <FaEdit style={{ color: "white", fontSize: "17px" }} />
              </Button>
            )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      advanceamount: item.advanceamount,
      requestyear: item.requestyear,
      requestmonth: item.requestmonth,
      requestdate: item.requestdate,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      empcode: item.empcode,
      employeename: item.employeename,
      companyname: item.companyname,
      shifttiming: item.shifttiming,
      status: item.status,
      document: item.document,
      description: item.description,
      createddatetime: item.createddatetime,
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
  function getCurrentMonth() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentDate = new Date();
    return monthNames[currentDate.getMonth()];
  }
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
  const currentYear = new Date().getFullYear();
  let startyearOpt = [];
  for (let i = 0; i <= 10; i++) {
    const year = currentYear + i;
    startyearOpt.push({ label: year.toString(), value: year });
  }
  const [totalDays, setTotalDays] = useState(null);
  const [toDate, setToDate] = useState("");
  const monthOpt = [
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
  ]
  const [selectedMont, setSelectMonth] = useState([
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
  ])
  const handleYearChange = (event) => {
    setSelectedYear(event.value);
    updateDateValue(event.value, selectedMonth);
    setSelectMonthName("Select Month")
    setSelectedDate("")
    const year = event.value;
    let updatedMonthOpt;
    if (year === currentYear) {
      const currentMonthIndex = new Date().getMonth();
      updatedMonthOpt = monthOpt.slice(Math.max(0, currentMonthIndex - 1), Math.max(0, currentMonthIndex - 1) + 2);
    } else {
      updatedMonthOpt = monthOpt;
    }
    setSelectMonth(updatedMonthOpt)
  };
  const handleYearChangeEdit = (event) => {
    setSelectedYearEdit(event.value);
    updateDateValueEdit(event.value, selectedMonthEdit);
    setSelectMonthNameEdit("Select Month")
    setSelectedDateEdit("")
  };
  const handleMonthChange = (event) => {
    setSelectedMonth(event.value);
    updateDateValue(selectedYear, event.value);
    setSelectMonthName(event.label);
    setSelectedDate("");
  };
  const handleMonthChangeEdit = (event) => {
    setSelectedMonthEdit(event.value);
    updateDateValueEdit(selectedYearEdit, event.value);
    setSelectMonthNameEdit(event.label);
    setSelectedDateEdit("");
  };
  // const updateDateValue = (year, month) => {
  //   const currentDate = new Date();
  //   const monthShow = currentDate.getMonth();
  //   currentDate.setFullYear(year);
  //   currentDate.setMonth(month === "" ? monthShow : month - 1);
  //   currentDate.setDate(1);
  //   const selectedDate = currentDate?.toISOString()?.split("T")[0];
  //   // Set selected month, previous month, and next month
  //   const previousMonth = new Date(currentDate);
  //   previousMonth.setMonth(currentDate.getMonth());
  //   const nextMonth = new Date(currentDate);
  //   nextMonth.setMonth(currentDate.getMonth() + 1);
  //   const minimumDate = previousMonth.toISOString().split("T")[0];
  //   const maxSet = nextMonth.toISOString().split("T")[0];
  //   // Update your UI or other logic as needed
  //   // const dateFromInput = document.getElementById("datefrom");
  //   const dateToDate = document.getElementById("datefrom");
  //   if (dateToDate) {
  //     dateToDate.min = minimumDate;
  //     dateToDate.max = maxSet;
  //   }
  // };
  const updateDateValue = (year, month) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-indexed month, so add 1
    const currentDay = currentDate.getDate();
    const selectedDate = new Date(year, month === "" ? currentMonth - 1 : month - 1, 1); // month is 0-indexed
    const dateToDate = document.getElementById("datefrom");
    if (dateToDate) {
      if (year === currentYear && month == currentMonth) {
        // If selected year and month are the current year and month
        dateToDate.min = `${year}-${String(month).padStart(2, '0')}-01`;
        dateToDate.max = `${year}-${String(month).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
      } else {
        // If selected year and month are not the current year and month
        const selectedMonthStartDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const nextMonth = new Date(year, month - 1 + 1, 0); // Setting date to 0 gets the last day of the previous month (end of the selected month)
        const selectedMonthEndDate = nextMonth.toISOString().split("T")[0];
        dateToDate.min = selectedMonthStartDate;
        dateToDate.max = selectedMonthEndDate;
      }
    }
  };
  const updateDateValueEdit = (year, month) => {
    const currentDate = new Date();
    const monthShow = currentDate.getMonth();
    currentDate.setFullYear(year);
    currentDate.setMonth(month === "" ? monthShow : month - 1);
    currentDate.setDate(1);
    const selectedDate = currentDate?.toISOString()?.split("T")[0];
    // Set selected month, previous month, and next month
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(currentDate.getMonth());
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    const minimumDate = previousMonth.toISOString().split("T")[0];
    const maxSet = nextMonth.toISOString().split("T")[0];
    const dateToDate = document.getElementById("datefromedit");
    if (dateToDate) {
      dateToDate.min = minimumDate;
      dateToDate.max = maxSet;
    }
  };
  const handleFromDateChange = (event) => {
    if (selectedYear === "Select Year") {
      setPopupContentMalert("Select Year");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSelectedDate(event.target.value);
      // updateTotalDays(event.target.value, toDate);
    }
  };
  const handleFromDateChangeEdit = (event) => {
    if (selectedYearEdit === "Select Year") {
      setPopupContentMalert("Select Year");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setSelectedDateEdit(event.target.value);
      // updateTotalDays(event.target.value, toDate);
    }
  };
  const [documentFiles, setdocumentFiles] = useState([]);
  const handleFileDelete = (index) => {
    setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleResumeUpload = (event) => {
    const resume = event.target.files;
    for (let i = 0; i < resume?.length; i++) {
      const reader = new FileReader();
      const file = resume[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setdocumentFiles((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
      };
    }
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  let exportColumnNames = ["Advance Amount", "Request Year", "Request Month", "Request Date", "Company", "Branch", "Unit", "Team", "Emp Code", "Employee", "Shift Time", "Description", "Created Date/Time", "Added By"];
  let exportRowValues = ["advanceamount", "requestyear", "requestmonth", "requestdate", "company", "branch", "unit", "team", "empcode", "employeename", "shifttiming", "description", "createddatetime", "companyname"];
  const accessOption = [{ label: "Self", value: "Self" }, { label: "Others", value: "Others" }]
  return (
    <Box>
      <Headtitle title={"Advance"} />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("aadvance") && (
        <>
          <PageHeading
            title="Advance (Deduct In Next Month Salary)"
            modulename="PayRoll"
            submodulename="Loan & Advance"
            mainpagename="Advance"
            subpagename=""
            subsubpagename=""
          />
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>Add Advance</Typography>
                </Grid>
                {(isUserRoleCompare.includes("lassignadvance") || isUserRoleAccess?.role?.includes("Manager")) && (
                  <>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Access<b style={{ color: "red" }}>*</b></Typography>
                        <Selects
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={{ label: advance.access, value: advance.access }}
                          options={accessOption}
                          onChange={(e) => {
                            setAdvance({
                              ...advance,
                              access: e.value,
                              employeename: "Please Select Employee Name"
                            });
                            setSelectedOptionsTeam([]);
                            setSelectedOptionsUnit([]);
                            setSelectedOptionsBranch([]);
                            setSelectedOptionsCompany([]);
                            setEmployeeOption([]);
                            setTeamOption([]);
                            setUnitOption([]);
                            setBranchOption([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Advance Amount <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Advance Amount"
                      value={advance.advanceamount}
                      onChange={(e) => {
                        const enteredValue = e.target.value
                          .replace(/\D/g, "")
                        //   .slice(0, 2);
                        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                          setAdvance({
                            ...advance,
                            advanceamount: enteredValue,
                          });
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Request Year<b style={{ color: "red" }}>*</b></Typography>
                    <Selects
                      styles={colourStyles}
                      options={years}
                      value={{ label: selectedYear, value: selectedYear }}
                      onChange={(e) => {
                        handleYearChange(e)
                        setAdvance({ ...advance, requestdate: "" });
                      }
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Request Month<b style={{ color: "red" }}>*</b></Typography>
                    <Selects
                      styles={colourStyles}
                      options={selectedYear === "Select Year" ? [] : selectedMont}
                      value={{ label: selectmonthname, value: selectmonthname }}
                      onChange={(e) => {
                        handleMonthChange(e)
                        setAdvance({ ...advance, requestdate: "" });
                      }
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Request Date <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      value={advance.requestdate}
                      type="date"
                      onChange={(e) => {
                        setAdvance({ ...advance, requestdate: e.target.value });
                      }}
                      id="datefrom"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Description</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={advance.description}
                      onChange={(e) => {
                        setAdvance({ ...advance, description: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={8} sm={12} xs={12}>
                  <Typography >Upload Document</Typography>
                  <Grid >
                    <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                      Upload
                      <input
                        type="file"
                        id="resume"
                        accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                        name="file"
                        hidden
                        onChange={(e) => {
                          handleResumeUpload(e);
                        }}
                      />
                    </Button>
                    <br />
                    <br />
                    {documentFiles?.length > 0 &&
                      documentFiles.map((file, index) => (
                        <>
                          <Grid container spacing={2}>
                            <Grid item md={6} sm={6} xs={6}>
                              <Typography>{file.name}</Typography>
                            </Grid>
                            <Grid></Grid>
                            <Grid item md={1} sm={6} xs={6}>
                              <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                            </Grid>
                            <Grid item md={1} sm={6} xs={6}>
                              <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                                <DeleteIcon />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ))}
                  </Grid>
                </Grid>
                {(advance.access === "Others") && (
                  <  >
                    <Grid item md={3} xs={12} sm={6} >
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          sx={{ position: "absolute" }}
                          options={companyOpt}
                          value={selectedOptionsCompany}
                          onChange={(e) => {
                            handleCompanyChange(e);
                            setSelectedOptionsBranch([])
                            setBranchOption([])
                            setSelectedOptionsUnit([])
                            setSelectedOptionsTeam([])
                            setUnitOption([])
                            setTeamOption([])
                            setEmployeeDetails([])
                            setAdvance({
                              ...advance,
                              employeename: "Please Select Employee Name"
                            })
                            setEmployeeOption([])
                          }}
                          valueRenderer={customValueRendererCompany}
                          labelledBy="Please Select Company"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={branchOption}
                          value={selectedOptionsBranch}
                          onChange={(e) => {
                            handleBranchChange(e);
                            setSelectedOptionsTeam([])
                            setSelectedOptionsUnit([])
                            setUnitOption([])
                            setTeamOption([])
                            setEmployeeDetails([])
                            setAdvance({
                              ...advance,
                              employeename: "Please Select Employee Name"
                            })
                            setEmployeeOption([])
                          }}
                          valueRenderer={customValueRendererBranch}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={unitOption}
                          value={selectedOptionsUnit}
                          onChange={(e) => {
                            handleUnitChange(e);
                            setTeamOption([])
                            setSelectedOptionsTeam([])
                            setEmployeeDetails([])
                            setAdvance({
                              ...advance,
                              employeename: "Please Select Employee Name"
                            })
                            setEmployeeOption([])
                          }}
                          valueRenderer={customValueRendererUnit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={teamOption}
                          value={selectedOptionsTeam}
                          onChange={(e) => {
                            handleTeamChange(e);
                            setAdvance({
                              ...advance,
                              employeename: "Please Select Employee Name"
                            })
                            setEmployeeOption([])
                            setEmployeeDetails([])
                          }}
                          valueRenderer={customValueRendererTeam}
                          labelledBy="Please Select Team"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee <b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={employeeOption}
                          value={{ label: advance.employeename, value: advance.employeename }}
                          onChange={((e) => {
                            setEmployeeDetails(e)
                            setAdvance({
                              ...advance,
                              employeename: e.value
                            })
                          })}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
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
                  <Button variant="contained"
                    onClick={handleSubmit}
                    disabled={isBtn}
                  >
                    SAVE
                  </Button>
                  <Button sx={userStyle.btncancel}
                    onClick={handleClear}
                  >
                    CLEAR
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="sm"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>Edit Advance</Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Advance Amount <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Advance Amount"
                        value={advanceEdit.advanceamount}
                        onChange={(e) => {
                          const enteredValue = e.target.value
                            .replace(/\D/g, "")
                          //   .slice(0, 2);
                          if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
                            setAdvanceEdit({
                              ...advanceEdit,
                              advanceamount: enteredValue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Request Year<b style={{ color: "red" }}>*</b></Typography>
                      <Selects
                        styles={colourStyles}
                        options={years}
                        value={{ label: selectedYearEdit, value: selectedYearEdit }}
                        onChange={handleYearChangeEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Request Month<b style={{ color: "red" }}>*</b></Typography>
                      <Selects
                        styles={colourStyles}
                        options={selectedYearEdit === "Select Year" ? [] : months}
                        value={{ label: selectmonthnameEdit, value: selectmonthnameEdit }}
                        onChange={handleMonthChangeEdit}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Request Date <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        value={selectedDateEdit}
                        type="date"
                        onChange={handleFromDateChangeEdit}
                        id="datefromedit" />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12} sm={12}>
                    <Button
                      variant="contained"
                      style={{
                        padding: "7px 13px",
                        color: "white",
                        background: "rgb(25, 118, 210)",
                      }}
                      onClick={editSubmit}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("ladvance") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Advance List</Typography>
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
                    {/* <MenuItem value={groups?.length}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box>
                  {isUserRoleCompare?.includes("exceladvance") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchAllGroupArray()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvadvance") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchAllGroupArray()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printadvance") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfadvance") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchAllGroupArray()
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageadvance") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                        <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;
                      </Button>
                    </>
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
            <br />
            <br />
            {!groupCheck ? (
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
                  <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} ref={gridRef} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
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
          </Box>
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
      {/* view model */}
      <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth={true}>
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Advance</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Advance Amount</Typography>
                  <Typography>{advanceEdit.advanceamount}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Request Year</Typography>
                  <Typography>{advanceEdit.requestyear}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Request Month</Typography>
                  <Typography>{advanceEdit.requestmonth}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Request Date</Typography>
                  <Typography>{moment(advanceEdit.requestdate).format("DD-MM-YYYY")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Description</Typography>
                  <Typography>{advanceEdit.description !== undefined ? advanceEdit.description : ""}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} sm={12} xs={12}>
                <Typography variant="h6">Upload Document</Typography>
                <Grid >
                  <br />
                  {documentFilesView?.length > 0 &&
                    documentFilesView.map((file, index) => (
                      <>
                        <Grid container spacing={2}>
                          <Grid item md={6} sm={6} xs={6}>
                            <Typography>{file.name}</Typography>
                          </Grid>
                          <Grid></Grid>
                          <Grid item md={1} sm={6} xs={6}>
                            <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                          </Grid>
                        </Grid>
                      </>
                    ))}
                </Grid>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>{advanceEdit.company}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>{advanceEdit.branch}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Unit</Typography>
                  <Typography>{advanceEdit.unit}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Team</Typography>
                  <Typography>{advanceEdit.team}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Employee</Typography>
                  <Typography>{advanceEdit.employeename}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Emp Code</Typography>
                  <Typography>{advanceEdit.empcode}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Shift Timing</Typography>
                  <Typography>{advanceEdit.shifttiming}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Description</Typography>
                  <Typography>{advanceEdit.description}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Created Date/Time</Typography>
                  <Typography>{Array.isArray(advanceEdit.addedby) && moment(advanceEdit.addedby[0].date).format("DD-MM-YYYY hh:mm:ss a")}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Added By</Typography>
                  <Typography>{advanceEdit.companyname}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button variant="contained" color="primary" onClick={handleCloseview}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Reason of Leaving  */}
      <Dialog open={openviewalert} onClose={handleClickOpenviewalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"></Typography>
                    <FormControl size="small" fullWidth>
                      <TextField
                      />
                    </FormControl>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleCloseviewalert}>
                  Save
                </Button>
              </Grid>
              <Grid item md={0.2} xs={12} sm={12}></Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Button variant="contained" color="primary" onClick={handleCloseviewalert}>
                  {" "}
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
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
      {/* dialog status change */}
      <Box>
        <Dialog maxWidth="lg" open={statusOpen} onClose={handleStatusClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent
            sx={{
              width: "600px",
              height: selectStatus.status == "Rejected" ? "260px" : "220px",
              overflow: "visible",
              "& .MuiPaper-root": {
                overflow: "visible",
              },
            }}
          >
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Edit Advance Status</Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Status<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    fullWidth
                    options={[
                      { label: "Approved", value: "Approved" },
                      { label: "Rejected", value: "Rejected" },
                      { label: "Applied", value: "Applied" },
                    ]}
                    value={{ label: selectStatus.status, value: selectStatus.value }}
                    onChange={(e) => {
                      setSelectStatus({
                        ...selectStatus,
                        status: e.value,
                        rejectedreason: ""
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12}>
                {selectStatus.status == "Rejected" ? (
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason for Rejected<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={selectStatus.rejectedreason}
                      onChange={(e) => {
                        setSelectStatus({ ...selectStatus, rejectedreason: e.target.value });
                      }}
                    />
                  </FormControl>
                ) : null}
              </Grid>
            </Grid>
          </DialogContent>
          {selectStatus.status == "Rejected" ? <br /> : null}
          <DialogActions>
            <Button
              variant="contained"
              style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
              onClick={() => {
                editStatus();
                // handleCloseerrpop();
              }}
            >
              Update
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={() => {
                handleStatusClose();
                setSelectStatus({});
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      {/* SUCCESS */}
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={filteredData ?? []}
        itemsTwo={advanceArray ?? []}
        filename={"Advance"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Advance Info"
        addedby={addedby}
        updateby={updateby}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={deleGroup}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delGroupcheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
    </Box>
  );
}
export default Advance;