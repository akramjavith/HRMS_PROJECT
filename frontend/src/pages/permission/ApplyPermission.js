import React, { useState, useEffect, useRef, useContext } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaEdit } from 'react-icons/fa';
import { handleApiError } from "../../components/Errorhandling";
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, Popover, Checkbox, IconButton, TextareaAutosize, InputLabel, CircularProgress } from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { SERVICE } from "../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment, { invalid } from "moment-timezone";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import ImageIcon from "@mui/icons-material/Image";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Webcamimage from "../hr/webcamprofile";
import FormControlLabel from '@mui/material/FormControlLabel';
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MuiInput from "@mui/material/Input";
import domtoimage from 'dom-to-image';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../components/ExportData";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AlertDialog from "../../components/Alert";
import InfoPopup from "../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import AdvancedSearchBar from '../../components/SearchbarEbList.js';
import ManageColumnsContent from "../../components/ManageColumn";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

const Input = styled(MuiInput)(({ theme }) => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none !important",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

function ApplyPermission() {

  const gridRefTableAppPerm = useRef(null);
  const gridRefImageAppPerm = useRef(null);

  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  // Calculate the minimum date as today
  useEffect(() => {
    const today = new Date();

    // // Format the date as 'YYYY-MM-DD' for the input element
    // const formattedToday = today.toISOString().split("T")[0];
    // setMinDate(formattedToday);

    // Calculate yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Calculate the date 30 days from today
    const after30Days = new Date(today);
    after30Days.setDate(after30Days.getDate() + 30);

    // Format the dates as 'YYYY-MM-DD'
    const formattedYesterday = yesterday.toISOString().split("T")[0];
    const formattedAfter30Days = after30Days.toISOString().split("T")[0];

    // Set min and max dates
    setMinDate(formattedYesterday);
    setMaxDate(formattedAfter30Days);
  }, []);

  const [isPermissions, setIsPermissions] = useState([]);
  const [Accessdrop, setAccesDrop] = useState("Employee");
  const [AccessdropEdit, setAccesDropEdit] = useState("Employee");
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersLimit, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
  const [selectStatus, setSelectStatus] = useState({});
  const [permissionSelf, setPermissionSelf] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState([]);
  const [valueCompany, setValueCompany] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [valueBranch, setValueBranch] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [valueUnit, setValueUnit] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [valueTeam, setValueTeam] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [valueEmp, setValueEmp] = useState([]);
  const [selectedApplyType, setSelectedApplyType] = useState([]);
  const [valueApplyType, setValueApplyType] = useState([]);
  const [filterUser, setFilterUser] = useState({ filtertype: "Individual" });

  const [applypermission, setApplyPermission] = useState({
    companyname: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Branch",
    team: "Please Select Team",
    employeename: "Please Select Employee Name",
    employeeid: "",
    permissiontype: "Minutes",
    date: "",
    fromtime: "",
    endtime: "",
    finaltime: '00:00',
    reasonforpermission: "",
    reportingto: "",
    shifttiming: "",
    requesthours: "",
    time: "",
    shiftmode: "",
    compensationapplytype: 'startshift',
    compensationstatus: '',
  });
  const [getTiming, setGetTiming] = useState("");
  const [getShiftMode, setGetShiftMode] = useState("");
  const [permissionedit, setPermissionEdit] = useState([]);
  const [applyleaves, setApplyleaves] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [allpermissions, setAllpermissions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [leaveId, setLeaveId] = useState("");
  const [allApplyleaveedit, setAllApplyleaveedit] = useState([]);

  const [type, settype] = useState("Minutes");
  const [leaveEdit, setLeaveEdit] = useState("Minutes");
  const [applytype, setApplytype] = useState("Please Select ApplyType");
  const [applytypeEdit, setApplytypeEdit] = useState("Please Select ApplyType");

  // State to track advanced filter
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");

  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => { setStatusOpen(true); };
  const handleStatusClose = () => { setStatusOpen(false); };

  const { auth } = useContext(AuthContext);

  const [applyleaveCheck, setApplyleavecheck] = useState(false);
  const [applyleaveCheckHistory, setApplyleavecheckHistory] = useState(false);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchQueryManageAppPerm, setSearchQueryManageAppPerm] = useState("");

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [pageAppPerm, setPageAppPerm] = useState(1);
  const [pageSizeAppPerm, setPageSizeAppPerm] = useState(10);
  const [searchQueryAppPerm, setSearchQueryAppPerm] = useState("");
  const [totalPagesAppPerm, setTotalPagesAppPerm] = useState(1);

  // view model
  const [openview, setOpenview] = useState(false);
  const handleClickOpenview = () => { setOpenview(true); };
  const handleCloseview = () => { setOpenview(false); };

  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => { setIsErrorOpenpop(true); };
  const handleCloseerrpop = () => { setIsErrorOpenpop(false); };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => { setIsErrorOpen(true); };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setBtnSubmit(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleCloseMod = () => { setIsDeleteOpen(false); };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => { setIsDeleteOpenalert(false); };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => { setIsDeleteOpencheckbox(true); };
  const handleCloseModcheckbox = () => { setIsDeleteOpencheckbox(false); };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // pageAppPerm refersh reload
  const handleCloseFilterMod = () => { setIsFilterOpen(false); };
  const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
  const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => { setOpenPopup(true); };
  const handleClosePopup = () => { setOpenPopup(false); }

  // Manage Columns
  const [isManageColumnsOpenAppPerm, setManageColumnsOpenAppPerm] = useState(false);
  const [anchorElAppPerm, setAnchorElAppPerm] = useState(null);
  const handleOpenManageColumnsAppPerm = (event) => {
    setAnchorElAppPerm(event.currentTarget);
    setManageColumnsOpenAppPerm(true);
  };
  const handleCloseManageColumnsAppPerm = () => {
    setManageColumnsOpenAppPerm(false);
    setSearchQueryManageAppPerm("");
  };

  const openAppPerm = Boolean(anchorElAppPerm);
  const idAppPerm = openAppPerm ? "simple-popover" : undefined;

  // Search bar
  const [anchorElSearchAppPerm, setAnchorElSearchAppPerm] = React.useState(null);
  const handleClickSearchAppPerm = (event) => {
    setAnchorElSearchAppPerm(event.currentTarget);
  };
  const handleCloseSearchAppPerm = () => {
    setAnchorElSearchAppPerm(null);
    setSearchQueryAppPerm("");
  };

  const openSearchAppPerm = Boolean(anchorElSearchAppPerm);
  const idSearchAppPerm = openSearchAppPerm ? 'simple-popover' : undefined;

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: '#f0f0f0' }; // Even row
    } else {
      return { background: '#ffffff' }; // Odd row
    }
  }

  const [isAssigned, setIsAssigned] = useState(false);

  const isChecklistAssigned = async () => {
    try {
      const res = await axios.get(`${SERVICE.MODULEBASEDASSIGNMENTCHECKLIST}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // Check if the response contains the required data
      const isAvailable = res?.data?.checklistverificationmasters?.some(
        (item) => item.mainpage === "Apply Permission"
      );
      if (isAvailable) {
        setIsAssigned(true);
      } else {
        setIsAssigned(false);
      }
    } catch (err) {
      console.error("API Error:", err); // For easier debugging
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    isChecklistAssigned();
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Apply Permission"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  }

  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];

        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  // Pre select dropdowns
  useEffect(() => {
    // Remove duplicates based on the 'company' field
    const uniqueIsAssignBranch = accessbranch.reduce((acc, current) => {
      const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
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
    // Create team options based on selected company, branch, and unit
    const team = allTeam
      ?.filter(val =>
        company.some(comp => comp.value === val.company) &&
        branch.some(br => br.value === val.branch) &&
        unit.some(uni => uni.value === val.unit)
      )
      .map(data => ({
        label: data.teamname,
        value: data.teamname,
      }));
    setSelectedTeam(team);
    setValueTeam(team.map(a => a.value));
    const allemployees = allUsersLimit
      ?.filter(val =>
        company.some(comp => comp.value === val.company) &&
        branch.some(br => br.value === val.branch) &&
        unit.some(uni => uni.value === val.unit) &&
        team.some(team => team.value === val.team)
      )
      .map(data => ({
        label: data.companyname,
        value: data.companyname,
      }));
    setSelectedEmp(allemployees);
    setValueEmp(allemployees.map(a => a.value));
  }, [isAssignBranch])

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
    setApplyPermission({
      ...applypermission,
      employeename: "Please Select Employee Name",
      employeeid: "",
      companyname: "",
      branch: "",
      unit: "",
      team: "",
      date: '',
      applytype: 'Please Select Apply Type',
      permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', finaltime: '00:00', reasonforpermission: '',
      reportingto: '', shifttiming: '', time: '', shiftmode: '',
    });
    setUnitOptions([]);
    setTeamOptions([]);
    setUserOptions([]);
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
    setApplyPermission({
      ...applypermission,
      employeename: "Please Select Employee Name",
      employeeid: "",
      companyname: "",
      branch: "",
      unit: "",
      team: "",
      date: '',
      applytype: 'Please Select Apply Type',
      permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', finaltime: '00:00', reasonforpermission: '',
      reportingto: '', shifttiming: '', time: '', shiftmode: '',
    });
    setTeamOptions([]);
    setUserOptions([]);
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
    setApplyPermission({
      ...applypermission,
      employeeid: "",
      employeename: "Please Select Employee Name",
      employeeid: "",
      companyname: "",
      branch: "",
      unit: "",
      team: "",
      date: '',
      applytype: 'Please Select Apply Type',
      permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', finaltime: '00:00', reasonforpermission: '',
      reportingto: '', shifttiming: '', time: '', shiftmode: '',
    });
    setUserOptions([]);
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
    setApplyPermission({
      ...applypermission,
      employeename: "Please Select Employee Name",
      employeeid: "",
      companyname: "",
      branch: "",
      unit: "",
      team: "",
      date: '',
      applytype: 'Please Select Apply Type',
      permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', finaltime: '00:00', reasonforpermission: '',
      reportingto: '', shifttiming: '', time: '', shiftmode: '',
    });
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibilityAppPerm = {
    serialNumber: true,
    checkbox: true,
    requesthours: true,
    permissiontype: true,
    fromtime: true,
    endtime: true,
    employeename: true,
    employeeid: true,
    date: true,
    reasonforpermission: true,
    reportingto: true,
    compensationstatus: true,
    compensationapplytype: true,
    status: true,
    actions: true,
  };

  const [isEditOpenCheckList, setIsEditOpenCheckList] = useState(false);
  const handleClickOpenEditCheckList = () => {
    setIsEditOpenCheckList(true);
  };
  const handleCloseModEditCheckList = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpenCheckList(false);
  };

  // Submit history
  const [isOpenHistory, setIsOpenHistory] = useState(false);
  const handleClickOpenHistory = () => {
    setIsOpenHistory(true);
  };
  const handleCloseModHistory = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsOpenHistory(false);
  };

  // Update history
  const [isOpenHistoryUpdate, setIsOpenHistoryUpdate] = useState(false);
  const handleClickOpenHistoryUpdate = () => {
    setIsOpenHistoryUpdate(true);
  };
  const handleCloseModHistoryUpdate = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsOpenHistoryUpdate(false);
  };

  const [isCheckedList, setIsCheckedList] = useState([]);
  const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
  const overallCheckListChange = () => {
    let newArrayChecked = isCheckedList.map((item) => item = !isCheckedListOverall);

    let returnOverall = groupDetails.map((row) => {

      {
        if (row.checklist === "DateTime") {
          if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16)) {
            return true;
          } else {
            return false;
          }
        }
        else if (row.checklist === "Date Multi Span") {
          if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21)) {
            return true;
          } else {
            return false;
          }
        }
        else if (row.checklist === "Date Multi Span Time") {
          if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33)) {
            return true;
          } else {
            return false;
          }
        }
        else if (row.checklist === "Date Multi Random Time") {
          if ((((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16)) {
            return true;
          } else {
            return false;
          }

        }
        else if (((row.data !== undefined && row.data !== "") || (row.files !== undefined))) {
          return true;
        } else {
          return false;
        }

      }

    })

    let allcondition = returnOverall.every((item) => item == true);

    if (allcondition) {
      setIsCheckedList(newArrayChecked);
      setIsCheckedListOverall(!isCheckedListOverall);
    } else {
      setPopupContentMalert("Please Fill all the Fields");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }


  }
  const handleCheckboxChange = (index) => {
    const newCheckedState = [...isCheckedList];
    newCheckedState[index] = !newCheckedState[index];

    let currentItem = groupDetails[index];

    let data = () => {
      if (currentItem.checklist === "DateTime") {
        if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 16)) {
          return true;
        } else {
          return false;
        }
      }
      else if (currentItem.checklist === "Date Multi Span") {
        if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 21)) {
          return true;
        } else {
          return false;
        }
      }
      else if (currentItem.checklist === "Date Multi Span Time") {
        if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 33)) {
          return true;
        } else {
          return false;
        }
      }
      else if (currentItem.checklist === "Date Multi Random Time") {
        if ((((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined)) && currentItem.data.length === 16)) {
          return true;
        } else {
          return false;
        }

      }
      else if (((currentItem.data !== undefined && currentItem.data !== "") || (currentItem.files !== undefined))) {
        return true;
      } else {
        return false;
      }
    }

    if (data()) {
      setIsCheckedList(newCheckedState);
      handleDataChange(newCheckedState[index], index, "Check Box");
      let overallChecked = newCheckedState.every((item) => item === true);

      if (overallChecked) {
        setIsCheckedListOverall(true);
      } else {
        setIsCheckedListOverall(false);
      }
    } else {
      setPopupContentMalert("Please Fill all the Fields");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }


  };

  let name = "create";

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [valNum, setValNum] = useState(0);

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };

  const renderFilePreviewEdit = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const handleFileDeleteEdit = (index) => {
    let getData = groupDetails[index];
    delete getData.files;
    let finalData = getData;

    let updatedTodos = [...groupDetails];
    updatedTodos[index] = finalData;
    setGroupDetails(updatedTodos);
  };

  const [assignDetails, setAssignDetails] = useState();
  const [groupDetails, setGroupDetails] = useState();
  const [datasAvailedDB, setDatasAvailedDB] = useState();
  const [disableInput, setDisableInput] = useState([]);
  const [getDetails, setGetDetails] = useState();


  const [dateValue, setDateValue] = useState([]);
  const [timeValue, setTimeValue] = useState([]);

  const [dateValueRandom, setDateValueRandom] = useState([]);
  const [timeValueRandom, setTimeValueRandom] = useState([]);

  const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
  const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
  const [postID, setPostID] = useState();
  const [pagesDetails, setPagesDetails] = useState({});
  const [fromWhere, setFromWhere] = useState("");

  const [firstDateValue, setFirstDateValue] = useState([]);
  const [firstTimeValue, setFirstTimeValue] = useState([]);
  const [secondDateValue, setSecondDateValue] = useState([]);
  const [secondTimeValue, setSecondTimeValue] = useState([]);

  const [isCheckList, setIsCheckList] = useState(true);

  let completedbyName = isUserRoleAccess.companyname;

  const updateIndividualData = async (index) => {
    setPageName(!pageName)
    let searchItem = datasAvailedDB.find((item) => item.commonid == postID && item.module == "Leave&Permission" && item.submodule == "Permission" && item.mainpage == "Apply Permission" && item.status.toLowerCase() !== "completed");

    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

      if (check) {
        return {
          ...data, completedby: completedbyName, completedat: new Date()
        }
      } else {
        return {
          ...data, completedby: "", completedat: ""
        }
      }

    })

    try {
      let objectID = combinedGroups[index]?._id;
      let objectData = combinedGroups[index];
      if (searchItem) {
        let assignbranches = await axios.put(
          `${SERVICE.MYCHECKLIST_SINGLEBYOBJECTID}/${objectID}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            data: String(objectData?.data),
            lastcheck: objectData?.lastcheck,
            newFiles: objectData?.files,
            completedby: objectData?.completedby,
            completedat: objectData?.completedat
          }
        );
        await fecthDBDatas();
      } else {
        let assignbranches = await axios.post(
          `${SERVICE.MYCHECKLIST_CREATE}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            commonid: postID,
            module: pagesDetails?.module,
            submodule: pagesDetails?.submodule,
            mainpage: pagesDetails?.mainpage,
            subpage: pagesDetails?.subpage,
            subsubpage: pagesDetails?.subsubpage,
            category: assignDetails?.category,
            subcategory: assignDetails?.subcategory,
            candidatename: assignDetails?.fullname,
            status: "progress",
            groups: combinedGroups,
            addedby: [
              {
                name: String(username),
                date: String(new Date()),
              },
            ],
          }
        );
        await fecthDBDatas();
      }
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }


  async function fecthDBDatas() {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let foundData = res?.data?.mychecklist.find((item) => item.commonid == postID)
      setGroupDetails(foundData?.groups);
    }
    catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }


  const updateDateValuesAtIndex = (value, index) => {

    setDateValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "date")
  };

  const updateTimeValuesAtIndex = (value, index) => {

    setTimeValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "time")
  };
  //---------------------------------------------------------------------------------------------------------------

  const updateFromDateValueAtIndex = (value, index) => {

    setDateValueMultiFrom(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "fromdate")
  };

  const updateToDateValueAtIndex = (value, index) => {

    setDateValueMultiTo(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "todate")
  };
  //---------------------------------------------------------------------------------------------------------------------------------
  const updateDateValueAtIndex = (value, index) => {

    setDateValueRandom(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "date")
  };

  const updateTimeValueAtIndex = (value, index) => {

    setTimeValueRandom(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "time")
  };
  //---------------------------------------------------------------------------------------------------------------------------------------



  const updateFirstDateValuesAtIndex = (value, index) => {

    setFirstDateValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromdate")
  };

  const updateFirstTimeValuesAtIndex = (value, index) => {

    setFirstTimeValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromtime")
  };

  const updateSecondDateValuesAtIndex = (value, index) => {

    setSecondDateValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "todate")
  };

  const updateSecondTimeValuesAtIndex = (value, index) => {

    setSecondTimeValue(prevArray => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "totime")
  };

  //------------------------------------------------------------------------------------------------------------

  const handleDataChange = (e, index, from, sub) => {

    let getData;
    let finalData;
    let updatedTodos;
    switch (from) {
      case 'Check Box':
        getData = groupDetails[index];
        finalData = {
          ...getData, lastcheck: e
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-number':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-alpha':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Text Box-alphanumeric':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Attachments':
        getData = groupDetails[index];
        finalData = {
          ...getData, files: e
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Pre-Value':
        break;
      case 'Date':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Time':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'DateTime':
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${e} ${timeValue[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${dateValue[index]} ${e}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }

        break;
      case 'Date Multi Span':
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${e} ${dateValueMultiTo[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${dateValueMultiFrom[index]} ${e}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Date Multi Span Time':
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "fromtime") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        else if (sub == "todate") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Date Multi Random':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case 'Date Multi Random Time':

        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${e} ${timeValueRandom[index]}`
          }


          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData, data: `${dateValueRandom[index]} ${e}`
          }

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case 'Radio':
        getData = groupDetails[index];
        finalData = {
          ...getData, data: e.target.value
        }

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
    }
  }

  const handleChangeImage = (event, index) => {

    const resume = event.target.files;


    const reader = new FileReader();
    const file = resume[0];
    reader.readAsDataURL(file);

    reader.onload = () => {
      handleDataChange(
        {
          name: file.name,
          preview: reader.result,
          data: reader.result.split(",")[1],
          remark: "resume file",
        }, index, "Attachments")

    };

  };

  const getCodeNew = async (details) => {
    setPageName(!pageName)
    setGetDetails(details);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);
      let searchItem = res?.data?.mychecklist.find((item) => item.commonid == details?.id && item.module == "Leave&Permission" && item.submodule == "Permission" && item.mainpage == "Apply Permission" && item.status.toLowerCase() !== "completed");

      if (searchItem) {
        setAssignDetails(searchItem);

        setPostID(searchItem?.commonid);

        setGroupDetails(
          searchItem?.groups?.map((data) => ({
            ...data,
            lastcheck: false,
          }))
        );

        setIsCheckedList(searchItem?.groups?.map((data) => data.lastcheck));


        let forFillDetails = searchItem?.groups?.map((data) => {
          if (data.checklist === "Date Multi Random Time") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }

          } else {
            return { date: "0", time: "0" };
          }
        });

        let forDateSpan = searchItem?.groups?.map((data) => {
          if (data.checklist === "Date Multi Span") {
            if (data?.data && data?.data !== "") {
              const [fromdate, todate] = data?.data?.split(" ");
              return { fromdate, todate };
            }
          } else {
            return { fromdate: "0", todate: "0" };
          }
        })


        let forDateTime = searchItem?.groups?.map((data) => {
          if (data.checklist === "DateTime") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        })

        let forDateMultiSpanTime = searchItem?.groups?.map((data) => {
          if (data.checklist === "Date Multi Span Time") {
            if (data?.data && data?.data !== "") {
              const [from, to] = data?.data?.split("/");
              const [fromdate, fromtime] = from?.split(" ");
              const [todate, totime] = to?.split(" ");
              return { fromdate, fromtime, todate, totime };
            }
          } else {
            return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
          }
        })

        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate))
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate))

        setDateValueRandom(forFillDetails.map((item) => item?.date))
        setTimeValueRandom(forFillDetails.map((item) => item?.time))

        setDateValue(forDateTime.map((item) => item?.date))
        setTimeValue(forDateTime.map((item) => item?.time))

        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate))
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime))
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate))
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime))

        setDisableInput(new Array(details?.groups?.length).fill(true))
      }
      else {
        setIsCheckList(false);
      }
      // else {
      //     setAssignDetails(details);
      //     setPostID(details?.id);
      //     let datasNew = details.groups.map((item) => {
      //         switch (item.details) {
      //             case 'LEGALNAME':
      //                 return {
      //                     ...item, data: details.fullname
      //                 }
      //                 break;
      //             case 'USERNAME':
      //                 return {
      //                     ...item, data: details.username
      //                 }
      //                 break;
      //             case 'PASSWORD':
      //                 return {
      //                     ...item, data: details.password
      //                 }
      //                 break;
      //             case 'DATE OF BIRTH':
      //                 return {
      //                     ...item, data: details.dateofbirth
      //                 }
      //                 break;
      //             case 'EMAIL':
      //                 return {
      //                     ...item, data: details.email
      //                 }
      //                 break;
      //             case 'PHONE NUMBER':
      //                 return {
      //                     ...item, data: details.mobile
      //                 }
      //                 break;
      //             case 'FIRST NAME':
      //                 return {
      //                     ...item, data: details.firstname
      //                 }
      //                 break;
      //             case 'LAST NAME':
      //                 return {
      //                     ...item, data: details.lastname
      //                 }
      //                 break;
      //             case 'AADHAAR NUMBER':
      //                 return {
      //                     ...item, data: details.adharnumber
      //                 }
      //                 break;
      //             case 'PAN NUMBER':
      //                 return {
      //                     ...item, data: details.pannumber
      //                 }
      //                 break;
      //             case 'CURRENT ADDRESS':
      //                 return {
      //                     ...item, data: details.address
      //                 }
      //                 break;
      //             default:
      //                 return {
      //                     ...item
      //                 }
      //         }
      //     })
      //     setGroupDetails(
      //         datasNew?.map((data) => ({
      //             ...data,
      //             lastcheck: false,
      //         }))
      //     );

      //     setDateValueRandom(new Array(details.groups.length).fill(0))
      //     setTimeValueRandom(new Array(details.groups.length).fill(0))

      //     setDateValueMultiFrom(new Array(details.groups.length).fill(0))
      //     setDateValueMultiTo(new Array(details.groups.length).fill(0))

      //     setDateValue(new Array(details.groups.length).fill(0))
      //     setTimeValue(new Array(details.groups.length).fill(0))

      //     setFirstDateValue(new Array(details.groups.length).fill(0))
      //     setFirstTimeValue(new Array(details.groups.length).fill(0))
      //     setSecondDateValue(new Array(details.groups.length).fill(0))
      //     setSecondTimeValue(new Array(details.groups.length).fill(0))

      //     setDisableInput(new Array(details.groups.length).fill(true))
      // }

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleCheckListSubmit = async () => {
    let nextStep = isCheckedList.every((item) => item == true);

    if (!nextStep) {
      setPopupContentMalert("Please check all the Fields");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendRequestCheckList();
    }
  }

  const sendRequestCheckList = async () => {
    setPageName(!pageName)
    let combinedGroups = groupDetails?.map((data) => {
      let check = (data.data !== undefined && data.data !== "") || data.files !== undefined;

      if (check) {
        return {
          ...data, completedby: completedbyName, completedat: new Date()
        }
      } else {
        return {
          ...data, completedby: "", completedat: ""
        }
      }

    })

    try {

      let assignbranches = await axios.put(
        `${SERVICE.MYCHECKLIST_SINGLE}/${assignDetails?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          commonid: assignDetails?.commonid,
          module: assignDetails?.module,
          submodule: assignDetails?.submodule,
          mainpage: assignDetails?.mainpage,
          subpage: assignDetails?.subpage,
          subsubpage: assignDetails?.subsubpage,
          category: assignDetails?.category,
          subcategory: assignDetails?.subcategory,
          candidatename: assignDetails?.fullname,
          status: "Completed",
          groups: combinedGroups,
          updatedby: [
            ...assignDetails?.updatedby,
            {
              name: String(username),
              date: String(new Date()),
            },
          ],
        }
      );
      handleCloseModEditCheckList()
      setIsCheckedListOverall(false);
      sendEditStatus();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [columnVisibilityAppPerm, setColumnVisibilityAppPerm] = useState(initialColumnVisibilityAppPerm);

  // pageAppPerm refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteApply, setDeleteApply] = useState("");

  const fetchPermissionsAll = async () => {
    setPageName(!pageName)
    try {
      const response = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllpermissions(response.data.permissions);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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

  const fetchAttendanceCriterias = async (empid, selectedDate, empbranch) => {
    setPageName(!pageName)
    let daysArray = [];
    let startMonthDate = new Date(selectedDate);
    let endMonthDate = new Date(selectedDate);

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

    try {
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        empcode: empid
      });

      let res_leave = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_emp = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_limitcontrol = await axios.post(SERVICE.LIMITCONTROLSETTING_BRANCH_FILTER_FOR_PERMISSION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: empbranch,
      });

      const findShiftTiming = (shiftName) => {
        const foundShift = res_emp.data.shifts?.find((d) => d.name === shiftName?.trim());
        return foundShift
          ? `${foundShift.fromhour}:${foundShift.frommin}${foundShift.fromtime} to ${foundShift.tohour}:${foundShift.tomin}${foundShift.totime} `
          : '';
      };

      setGetTiming(res.data.finaluser[0] === undefined ? '' : res.data.finaluser[0].shift);
      setGetShiftMode(res.data.finaluser[0] === undefined ? '' : res.data.finaluser[0].shiftMode);
      setApplyPermission({
        ...applypermission,
        date: selectedDate,
        shifttiming: res.data.finaluser[0] === undefined ? '' : res.data.finaluser[0].shift,
        time: res.data.finaluser[0] === undefined ? '' : findShiftTiming(res.data.finaluser[0].shift),
        shiftmode: res.data.finaluser[0] === undefined ? '' : res.data.finaluser[0].shiftMode,
        fromtime: ''
      });

      const [year, month, day] = selectedDate?.split('-');

      let result = res_vendor?.data?.permissions.filter((d) => d.employeeid === empid && d.status !== 'Rejected');

      const limitResult = res_limitcontrol.data.limitcontrolsettings;
      let checkCurrentDateData = [];

      if (res_leave?.data?.attendancecontrolcriteria[0].enablebranchlimit === true) {
        if (limitResult.length > 0) {
          res_vendor?.data?.permissions.map((item) => {
            if (item.branch === limitResult[0].branch && limitResult[0].modulename === "Leave&Permission" && limitResult[0].submodulename === "Permission" && limitResult[0].mainpagename === "Apply Permission") {
              if (item.date === selectedDate) {
                checkCurrentDateData.push(item);
              }
            }
          });
        }

        if (limitResult.length === 0) {
          setPopupContentMalert(`This branch does not have any data matches. Kindly contact the administrator to confirm the 'Limit Control Settings'.`);
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        } else if (limitResult.length > 0 && checkCurrentDateData.length >= Number(limitResult[0].limit)) {
          setPopupContentMalert("The limit for applying today has been reached!");
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        }
      }

      let matchedResult = result.filter((d) => {
        const [dataYear, dataMonth, dataDay] = d.date?.split('-');
        if (month === dataMonth && year === dataYear) {
          return d;
        }
      });

      let enableStatus;

      let isEmployeeEnable = res_leave?.data?.attendancecontrolcriteria[0].permissiontodos && res_leave?.data?.attendancecontrolcriteria[0].permissiontodos.find(d => d.empcode === empid);

      if (isEmployeeEnable) {
        enableStatus = isEmployeeEnable.enablepermcompensation;
      }
      else {
        enableStatus = res_leave?.data?.attendancecontrolcriteria[0].enablepermcompensation;
      }
      // console.log(enableStatus, 'enableStatus')
      if (limitResult.length > 0 && checkCurrentDateData.length < Number(limitResult[0].limit) && enableStatus && matchedResult.length >= parseInt(res_leave?.data?.attendancecontrolcriteria[0].permissionpermonthduration)) {
        handleClickOpenCompensation();
      } else if (!enableStatus && matchedResult.length >= parseInt(res_leave?.data?.attendancecontrolcriteria[0].permissionpermonthduration)) {
        setPopupContentMalert(`You have reached allowed count ${res_leave?.data?.attendancecontrolcriteria[0].permissionpermonthduration} per month. You cannot apply permission.`);
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchPermissionsAll();
  }, []);

  const rowData = async (id) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteApply(res?.data?.sPermission);
      handleClickOpen();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // Alert delete popup
  let Applysid = deleteApply?._id;
  const delApply = async () => {
    setPageName(!pageName)
    try {
      if (Applysid) {
        await axios.delete(`${SERVICE.PERMISSION_SINGLE}/${Applysid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchApplyPermissions();
        if (!isUserRoleAccess?.role?.includes("Manager") ||
          !isUserRoleAccess?.role?.includes("HiringManager") ||
          !isUserRoleAccess?.role?.includes("HR") ||
          !isUserRoleAccess?.role?.includes("Superadmin")) {
          await fetchApplyPermissionsForEmployee();
        }
        await fetchPermissionsAll();
        setIsHandleChange(false);
        handleCloseMod();
        setSelectedRows([]);
        setPageAppPerm(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSelectAllChecked(false);
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const delApplycheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.PERMISSION_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPageAppPerm(1);

      await fetchApplyPermissions();
      if (!isUserRoleAccess?.role?.includes("Manager") ||
        !isUserRoleAccess?.role?.includes("HiringManager") ||
        !isUserRoleAccess?.role?.includes("HR") ||
        !isUserRoleAccess?.role?.includes("Superadmin")) {
        await fetchApplyPermissionsForEmployee();
      }
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // const [empnames, setEmpname] = useState([]);
  // const [empnamesEdit, setEmpnameEdit] = useState([]);
  const [company, setCompany] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const fetchCategoryTicket = async () => {
    setPageName(!pageName)
    try {
      let res_emp = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const empall = [
        ...res_emp?.data?.users
          .filter((data) => data.companyname !== isUserRoleAccess.companyname)
          .map((d) => ({
            ...d,
            label: d.companyname,
            value: d.companyname,
          })),
      ];

      setEmpname(empall);
      setEmpnameEdit(empall);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [companyOption, setCompanyOption] = useState([]);
  const [branchOption, setBranchOption] = useState([]);
  const [unitOption, setUnitOption] = useState([]);
  const [teamOption, setTeamOption] = useState([]);
  const [empnames, setEmpname] = useState([]);
  const [empnamesEdit, setEmpnameEdit] = useState([]);

  //get all comnpany.
  const fetchCompanyAll = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompanyOption([
        ...res_location?.data?.companies?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //get all branches.
  const fetchBranchAll = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.BRANCH, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setBranchOption([
        ...res_location?.data?.branch?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //function to fetch unit
  const fetchUnitAll = async () => {
    setPageName(!pageName);
    try {
      let res_unit = await axios.get(`${SERVICE.UNIT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUnitOption([
        ...res_unit?.data?.units?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //function to fetch  team
  const fetchTeamAll = async () => {
    setPageName(!pageName);
    try {
      let res_team = await axios.get(SERVICE.TEAMS, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setTeamOption([
        ...res_team?.data?.teamsdetails?.map((t) => ({
          ...t,
          label: t.teamname,
          value: t.teamname,
        })),
      ]);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // List Filter
  const applyTypeData = [
    { label: 'Start Shift', value: 'startshift' },
    { label: 'In Between', value: 'inbetween' },
    { label: 'End Shift', value: 'endshift' },
  ]

  //company multiselect
  const handleCompanyChangeFilter = (options) => {
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
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedEmp([]);
    setValueEmp([]);
    setSelectedApplyType([]);
    setValueApplyType([]);
  };

  const customValueRendererCompanyFilter = (valueCompany, _categoryname) => {
    return valueCompany?.length
      ? valueCompany.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branchto multiselect dropdown changes
  const handleBranchChangeFilter = (options) => {
    setSelectedBranch(options);
    setValueBranch(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnit([]);
    setValueUnit([]);
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedEmp([]);
    setValueEmp([]);
    setSelectedApplyType([]);
    setValueApplyType([]);
  };

  const customValueRendererBranchFilter = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Branch";
  };

  // unitto multiselect dropdown changes
  const handleUnitChangeFilter = (options) => {
    setSelectedUnit(options);
    setValueUnit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeam([]);
    setValueTeam([]);
    setSelectedEmp([]);
    setValueEmp([]);
    setSelectedApplyType([]);
    setValueApplyType([]);
  };
  const customValueRendererUnitFilter = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Unit";
  };

  //Teamto multiselect dropdown changes
  const handleTeamChangeFilter = (options) => {
    setSelectedTeam(options);
    setValueTeam(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedEmp([]);
    setSelectedApplyType([]);
    setValueApplyType([]);
  };
  const customValueRendererTeamFilter = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please select Team";
  };

  // Employee    
  const handleEmployeeChangeFilter = (options) => {
    setSelectedEmp(options);
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedApplyType([]);
    setValueApplyType([]);
  };
  const customValueRendererEmpFilter = (valueCate, _employees) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };

  // Apply Type
  const handleApplyTypeChangeFilter = (options) => {
    setSelectedApplyType(options);
    setValueApplyType(
      options.map((a, index) => {
        return a.value;
      })
    );
  };
  const customValueRendererApplyTypeFilter = (valueCate, _employees) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Apply Type";
  };

  //company multiselect
  const [selectedOptionsCompanyEdit, setSelectedOptionsCompanyEdit] = useState([]);
  let [valueCompanyCatEdit, setValueCompanyCatEdit] = useState([]);

  const handleCompanyChangeEdit = (options) => {
    setValueCompanyCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyEdit(options);
    setValueBranchCatEdit([]);
    setSelectedOptionsBranchEdit([]);
    setValueUnitCatEdit([]);
    setSelectedOptionsUnitEdit([]);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
  };

  const customValueRendererCompanyEdit = (
    valueCompanyCatEdit,
    _categoryname
  ) => {
    return valueCompanyCatEdit?.length
      ? valueCompanyCatEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranchEdit, setSelectedOptionsBranchEdit] = useState(
    []
  );
  let [valueBranchCatEdit, setValueBranchCatEdit] = useState([]);

  const handleBranchChangeEdit = (options) => {
    setValueBranchCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchEdit(options);
    setValueUnitCatEdit([]);
    setSelectedOptionsUnitEdit([]);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
  };

  const customValueRendererBranchEdit = (valueBranchCatEdit, _categoryname) => {
    return valueBranchCatEdit?.length
      ? valueBranchCatEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnitEdit, setSelectedOptionsUnitEdit] = useState([]);
  let [valueUnitCatEdit, setValueUnitCatEdit] = useState([]);

  const handleUnitChangeEdit = (options) => {
    setValueUnitCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnitEdit(options);
    setValueTeamCatEdit([]);
    setSelectedOptionsTeamEdit([]);
  };

  const customValueRendererUnitEdit = (valueUnitCatEdit, _categoryname) => {
    return valueUnitCatEdit?.length
      ? valueUnitCatEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeamEdit, setSelectedOptionsTeamEdit] = useState([]);
  let [valueTeamCatEdit, setValueTeamCatEdit] = useState([]);

  const handleTeamChangeEdit = (options) => {
    setValueTeamCatEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamEdit(options);
  };

  const customValueRendererTeamEdit = (valueTeamCatEdit, _categoryname) => {
    return valueTeamCatEdit?.length
      ? valueTeamCatEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  useEffect(() => {
    fetchCompanyAll();
    fetchBranchAll();
    fetchUnitAll();
    fetchTeamAll();
    fetchCategoryTicket();
  }, [selectedOptionsCompany]);

  // fetching users  for options
  const fetchUsers = async (e) => {
    setPageName(!pageName)
    try {
      let res_emp = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getCompanyBranch = res_emp.data.users.filter(
        (data) => data.team == e.value
      );

      const getUser = [
        ...getCompanyBranch.map((d) => ({
          ...d,
          label: d.companyname,
          value: d.companyname,
        })),
      ];
      setUserOptions(getUser);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetching shift for optionsd
  const fetchShift = async (e) => {
    setPageName(!pageName)
    try {

      let res_emp = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filterShit = res_emp.data.shifts.find(
        (data) => data.name == e.shifttiming
      );

      setApplyPermission({
        ...applypermission,
        employeename: e.value,
        employeeid: e.empcode,
        reportingto: e.reportingto,
        // shifttiming: e.shifttiming,
        // time: `${filterShit.fromhour}:${filterShit.frommin}:${filterShit.fromtime} to ${filterShit.tohour}:${filterShit.tomin}:${filterShit.totime}`,
      });
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetching shift for optionsd
  const fetchShiftEdit = async (e) => {
    setPageName(!pageName)
    try {
      let res_emp = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filterShit = res_emp.data.shifts.find(
        (data) => data.name == e.shifttiming
      );

      setPermissionEdit({
        ...permissionedit,
        employeename: e.value,
        employeeid: e.empcode,
        reportingto: e.reportingto,
        shifttiming: e.shifttiming,
        time: `${filterShit.fromhour}:${filterShit.frommin}:${filterShit.fromtime} to ${filterShit.tohour}:${filterShit.tomin}:${filterShit.totime}`,
        shiftmode: e.shiftmode,
      });
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // fetching shift for optionsd
  const fetchShiftuser = async (e) => {
    setPageName(!pageName)
    try {
      let res_emp = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let filterShit = res_emp.data.shifts.find(
        (data) => data.name == isUserRoleAccess.shifttiming
      );
      // setGetTiming(
      //   `${filterShit.fromhour}:${filterShit.frommin}:${filterShit.fromtime} to ${filterShit.tohour}:${filterShit.tomin}:${filterShit.totime}`
      // );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    // fetchShiftuser();
  }, []);

  const [maxTime, setTimeMax] = useState("");
  const [minTime, setTimeMin] = useState("");
  const [showMinTime, setShowMinTime] = useState("");
  const [showMaxTime, setShowMaxTime] = useState("");

  const getTypeofHours = (e) => {
    if (getTiming === 'Week Off') {
      setPopupContentMalert("Please Select Week Dates!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (getTiming === 'Not Allotted') {
      setPopupContentMalert("Shift is not allotted. Please select shift allotted dates!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else {

      let timingShift = Accessdrop === "HR" ? applypermission.time : getTiming;

      if (!timingShift) {
        return ''
      }

      let splitedTime = timingShift.split("to");
      let setTimeBefore = splitedTime[0]?.trim();
      let setLastTime = splitedTime[1]?.trim();

      let isAMlast = setLastTime?.includes("PM");
      let [hoursl, minutesl] = setLastTime?.split(":").map(Number);

      let isAM = setTimeBefore?.includes("AM");
      let [hours, minutes] = setTimeBefore?.split(":").map(Number);

      if (!isAM && hoursl !== 12) {
        hours += 12;
      }

      if (!isAMlast && hours !== 12) {
        hours += 12;
      }
      const startTime = new Date(yyyy, 0, 1, hours, minutes);

      const endTime = new Date(yyyy, 0, 1, hoursl, minutesl);

      if (e === "startshift") {
        const beforeShiftTime = new Date(startTime.getTime());
        const formattedEndTime = beforeShiftTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMinTime(
          beforeShiftTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMin(formattedEndTime);
        const inBetweenTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
        const formattedEnd = inBetweenTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMaxTime(
          inBetweenTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMax(formattedEnd);
      } else if (e === "endshift") {
        const inBetweenTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
        const formattedEndTime = inBetweenTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMinTime(
          inBetweenTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMin(formattedEndTime);
        const maxBetween = new Date(inBetweenTime.getTime() + 4 * 60 * 60 * 1000);
        const formatMaxTime = maxBetween.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMaxTime(
          maxBetween.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMax(formatMaxTime);
      } else {
        const beforeShiftTime = new Date(startTime.getTime());
        const formattedEndTime = beforeShiftTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMinTime(
          beforeShiftTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMin(formattedEndTime);
        const inBetweenTime = new Date(endTime.getTime());
        const formattedEnd = inBetweenTime.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        setShowMaxTime(
          inBetweenTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setTimeMax(formattedEnd);
      }
    }

  };

  const [maxTimeEdit, setTimeMaxEdit] = useState("");
  const [minTimeEdit, setTimeMinEdit] = useState("");
  const [showMinTimeEdit, setShowMinTimeEdit] = useState("");
  const [showMaxTimeEdit, setShowMaxTimeEdit] = useState("");

  const getTypeofHoursEdit = (e) => {
    let timingShift = AccessdropEdit === "HR" ? permissionedit.time : getTiming;

    if (!timingShift) {
      return ''
    }

    let splitedTime = timingShift.split("to");
    let setTimeBefore = splitedTime[0]?.trim();
    let setLastTime = splitedTime[1]?.trim();

    let isAMlast = setLastTime.includes("PM");
    let [hoursl, minutesl] = setLastTime.split(":").map(Number);

    let isAM = setTimeBefore.includes("AM");
    let [hours, minutes] = setTimeBefore.split(":").map(Number);

    if (!isAM && hoursl !== 12) {
      hours += 12;
    }

    if (!isAMlast && hours !== 12) {
      hours += 12;
    }
    const startTime = new Date(yyyy, 0, 1, hours, minutes);

    const endTime = new Date(yyyy, 0, 1, hoursl, minutesl);

    if (e === "startshift") {
      const beforeShiftTime = new Date(startTime.getTime());
      const formattedEndTime = beforeShiftTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMinTimeEdit(
        beforeShiftTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMinEdit(formattedEndTime);
      const inBetweenTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
      const formattedEnd = inBetweenTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMaxTimeEdit(
        inBetweenTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMaxEdit(formattedEnd);
    } else if (e === "endshift") {
      const inBetweenTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
      const formattedEndTime = inBetweenTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMinTimeEdit(
        inBetweenTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMinEdit(formattedEndTime);
      const maxBetween = new Date(inBetweenTime.getTime() + 4 * 60 * 60 * 1000);
      const formatMaxTime = maxBetween.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMaxTimeEdit(
        maxBetween.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMaxEdit(formatMaxTime);
    } else {
      const beforeShiftTime = new Date(startTime.getTime());
      const formattedEndTime = beforeShiftTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMinTimeEdit(
        beforeShiftTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMinEdit(formattedEndTime);
      const inBetweenTime = new Date(endTime.getTime());
      const formattedEnd = inBetweenTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      setShowMaxTimeEdit(
        inBetweenTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTimeMaxEdit(formattedEnd);
    }
  };


  // const getRequestHours = (e) => {
  //   const requestedValue = e.target.value;
  //   const time = applypermission.fromtime;
  //   const startTime = new Date(`2022-01-01T${time}:00`); // Replace `yyyy` with a fixed year for now

  //   let endTime;

  //   if (type === "Minutes") {
  //     endTime = new Date(startTime.getTime() + requestedValue * 60 * 1000);
  //   } else { // default to hours
  //     endTime = new Date(startTime.getTime() + requestedValue * 60 * 60 * 1000);
  //   }

  //   const formattedEndTime = endTime.toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });

  //   setApplyPermission({
  //     ...applypermission,
  //     requesthours: requestedValue,
  //     endtime: formattedEndTime,
  //   });
  // };

  const getRequestHours = async (requestedValue) => {
    if (type === 'HalfDay') {
      const time = applypermission.fromtime;
      const startTime = new Date(`2022-01-01T${time}:00`); // Replace `yyyy` with a fixed year for now

      let endTime = new Date(startTime.getTime() + requestedValue * 60 * 60 * 1000); // Default to hours

      const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Convert requestedValue to HH:MM format
      const hours = Math.floor(requestedValue);
      const minutes = Math.round((requestedValue - hours) * 60);
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      setApplyPermission({
        ...applypermission,
        requesthours: requestedValue,
        endtime: formattedEndTime,
        finaltime: formattedTime,
      });

    } else if (type === "Hours" || type === "Minutes") {
      let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const permissionPerDayDuration = res?.data?.attendancecontrolcriteria[0].permissionperdayduration;

      // Convert "HH:mm" string to total minutes
      const [hours, minutes] = permissionPerDayDuration.split(":").map(Number);
      const maxAllowedMinutes = hours * 60 + minutes;

      // Convert requestedValue (in hours or minutes) to total minutes
      const requestedMinutes = type === "Minutes" ? requestedValue : requestedValue * 60;

      if (requestedMinutes > maxAllowedMinutes) {
        setPopupContentMalert(`Only ${permissionPerDayDuration} allowed per day. Please enter request time before or equal to ${permissionPerDayDuration}`);
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        const time = applypermission.fromtime;
        const startTime = new Date(`2022-01-01T${time}:00`); // Replace `yyyy` with a fixed year for now

        let endTime;

        if (type === "Minutes") {
          endTime = new Date(startTime.getTime() + requestedValue * 60 * 1000);
        } else { // Default to hours
          endTime = new Date(startTime.getTime() + requestedValue * 60 * 60 * 1000);
        }

        const formattedEndTime = endTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Convert requestedMinutes to HH:MM format
        const hours = Math.floor(requestedMinutes / 60);
        const minutes = requestedMinutes % 60;
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        setApplyPermission({
          ...applypermission,
          requesthours: requestedValue,
          endtime: formattedEndTime,
          finaltime: formattedTime,
        });
      }
    }
  };

  const getRequestHoursEdit = (e) => {
    const requestedValue = e.target.value;
    const time = permissionedit.fromtime;
    const startTime = new Date(`2022-01-01T${time}:00`); // Replace `yyyy` with a fixed year for now

    let endTime;

    if (leaveEdit === "Minutes") {
      endTime = new Date(startTime.getTime() + requestedValue * 60 * 1000);
    } else { // default to hours
      endTime = new Date(startTime.getTime() + requestedValue * 60 * 60 * 1000);
    }

    const formattedEndTime = endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Convert requestedMinutes to HH:MM format
    const hours = Math.floor(requestedValue / 60);
    const minutes = requestedValue % 60;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    setPermissionEdit({
      ...permissionedit,
      requesthours: requestedValue,
      endtime: formattedEndTime,
      finaltime: formattedTime,
    });
  };

  const getRequestFormat = (e) => {
    if (applypermission.requesthours.length > 0) {
      const requestedHours = applypermission.requesthours;
      const time = e.target.value;

      const startTime = new Date(`${yyyy}-01-01T${time}:00`);

      const endTime = new Date(
        startTime.getTime() + requestedHours * 60 * 60 * 1000
      );

      const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setApplyPermission({
        ...applypermission,
        fromtime: e.target.value,
        endtime: formattedEndTime,
      });
    } else {
      setApplyPermission({ ...applypermission, fromtime: e.target.value });
    }
  };

  const getRequestFormatEdit = (e) => {
    if (permissionedit.requesthours.length > 0) {
      const requestedHours = permissionedit.requesthours;
      const time = e.target.value;

      const startTime = new Date(`${yyyy}-01-01T${time}:00`);

      const endTime = new Date(
        startTime.getTime() + requestedHours * 60 * 60 * 1000
      );

      const formattedEndTime = endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setPermissionEdit({
        ...permissionedit,
        fromtime: e.target.value,
        endtime: formattedEndTime,
      });
    } else {
      setPermissionEdit({ ...permissionedit, fromtime: e.target.value });
    }
  };

  let dateselect = new Date();
  dateselect.setDate(dateselect.getDate() + 3);
  var ddt = String(dateselect.getDate()).padStart(2, "0");
  var mmt = String(dateselect.getMonth() + 1).padStart(2, "0");
  var yyyyt = dateselect.getFullYear();
  let formattedDatet = yyyyt + "-" + mmt + "-" + ddt;

  let datePresent = new Date();
  var ddp = String(datePresent.getDate());
  var mmp = String(datePresent.getMonth() + 1);
  var yyyyp = datePresent.getFullYear();
  let formattedDatePresent = yyyyp + "-" + mmp + "-" + ddp;

  // Assuming applypermission.date is the "from date" and applypermission.todate is the "to date"
  const calculateDaysDifference = () => {
    const fromDate = new Date(applypermission.date).getTime();
    const toDate = new Date(applypermission.todate).getTime();

    if (!isNaN(fromDate) && !isNaN(toDate)) {
      // Calculate the number of days between the two dates
      const daysDifference = Math.floor(
        (toDate - fromDate) / (1000 * 60 * 60 * 24)
      );
      return daysDifference;
    }

    return 0; // Return 0 if either date is invalid
  };

  // Call the function and set the result in state or use it as needed

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)

    const aggregationPipeline = [
      {
        $match: {
          empcode: isUserRoleAccess.empcode,
        },
      },
      {
        $project: {
          empcode: 1,
          companyname: 1,
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
        },
      },
    ];

    try {
      const res = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let empDetails = res?.data?.users[0];

      let subprojectscreate = await axios.post(SERVICE.PERMISSION_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        employeename:
          Accessdrop === "HR"
            ? String(applypermission.employeename)
            : isUserRoleAccess.companyname,
        employeeid:
          Accessdrop === "HR"
            ? String(applypermission.employeeid)
            : isUserRoleAccess.empcode,
        permissiontype: String(type),
        applytype: String(applytype),
        shifttiming: String(
          Accessdrop === "HR"
            ? applypermission.shifttiming
            : isUserRoleAccess.shifttiming
        ),
        time: String(Accessdrop === "HR" ? applypermission.time : getTiming),
        shiftmode: String(Accessdrop === "HR" ? applypermission.shiftmode : getShiftMode),
        companyname: String(Accessdrop === "HR" ? applypermission.companyname : empDetails?.company),
        branch: String(Accessdrop === "HR" ? applypermission.branch : empDetails?.branch),
        unit: String(Accessdrop === "HR" ? applypermission.unit : empDetails?.unit),
        team: String(Accessdrop === "HR" ? applypermission.team : empDetails?.team),
        // company: Accessdrop === "HR" ? [applypermission?.companyname] : [empDetails?.company],
        // branch: Accessdrop === "HR" ? [applypermission?.branch] : [empDetails?.branch],
        // unit: Accessdrop === "HR" ? [applypermission?.unit] : [empDetails?.unit],
        // team: Accessdrop === "HR" ? [applypermission?.team] : [empDetails?.team],
        access: Accessdrop,
        date: String(applypermission.date),
        fromtime: String(applypermission.fromtime),
        requesthours: String(applypermission.requesthours),
        endtime: String(applypermission.endtime),
        reasonforpermission: String(applypermission.reasonforpermission),
        // reportingto:
        //   Accessdrop === "HR"
        //     ? String(applypermission.reportingto)
        //     : isUserRoleAccess.reportingto,
        status: String("Applied"),
        rejectedreason: String(""),
        compensationapplytype: String(compensationValue === true ? applypermission.compensationapplytype : ''),
        compensationstatus: String(compensationValue === true ? 'Compensation' : ''),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchApplyPermissions();
      if (!isUserRoleAccess?.role?.includes("Manager") ||
        !isUserRoleAccess?.role?.includes("HiringManager") ||
        !isUserRoleAccess?.role?.includes("HR") ||
        !isUserRoleAccess?.role?.includes("Superadmin")) {
        await fetchApplyPermissionsForEmployee();
      }
      handleCloseModHistory();

      settype("Minutes");
      setApplytype("Please Select ApplyType");
      setBranchOptions([]);
      setUnitOptions([]);
      setTeamOptions([]);
      setUserOptions([]);
      setApplyPermission({
        ...applypermission,
        // companyname: "Please Select Company",
        // branch: "Please Select Branch",
        // unit: "Please Select Unit",
        // team: "Please Select Team",
        employeename: "Please Select Employee Name",
        employeeid: "",
        permissiontype: "",
        date: "",
        fromtime: "",
        requesthours: "",
        endtime: "",
        finaltime: "00:00",
        reasonforpermission: "",
        reportingto: "",
        shifttiming: "",
        time: "",
        shiftmode: "",
      });
      setBtnSubmit(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { setBtnSubmit(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [selectedEmpData, setSelectedEmpData] = useState({});
  const [selectedEmpDataUpdate, setSelectedEmpDataUpdate] = useState({});
  const [historyOverAllData, setHistoryOverAllData] = useState({});
  const [historyMonthData, setHistoryMonthData] = useState({});
  const [historyOverAllDataUpdate, setHistoryOverAllDataUpdate] = useState({});
  const [historyMonthDataUpdate, setHistoryMonthDataUpdate] = useState({});

  function getMonthsInRange(fromdate, todate) {
    const startDate = new Date(fromdate);
    const endDate = new Date(todate);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const result = [];

    // Previous month based on `fromdate`
    const prevMonth = startDate.getMonth() === 0 ? 11 : startDate.getMonth() - 1;
    const prevYear = startDate.getMonth() === 0 ? startDate.getFullYear() - 1 : startDate.getFullYear();
    result.push({ month: monthNames[prevMonth], year: prevYear.toString() });

    // Add selected months between `fromdate` and `todate`
    const currentDate = new Date(startDate);
    currentDate.setDate(1); // Normalize to the start of the month
    while (
      currentDate.getFullYear() < endDate.getFullYear() ||
      (currentDate.getFullYear() === endDate.getFullYear() && currentDate.getMonth() <= endDate.getMonth())
    ) {
      result.push({
        month: monthNames[currentDate.getMonth()],
        year: currentDate.getFullYear().toString()
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Next month based on `todate`
    const nextMonth = endDate.getMonth() === 11 ? 0 : endDate.getMonth() + 1;
    const nextYear = endDate.getMonth() === 11 ? endDate.getFullYear() + 1 : endDate.getFullYear();
    result.push({ month: monthNames[nextMonth], year: nextYear.toString() });

    return result;
  }

  const fetchPermissionHistory = async () => {
    setApplyleavecheckHistory(true);
    const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
    let startMonthDate = new Date(startOfYear);
    let endMonthDate = new Date();

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

    try {
      let empname = Accessdrop === 'HR' ? applypermission.employeename : isUserRoleAccess.companyname;
      let empid = Accessdrop === 'HR' ? applypermission.employeeid : isUserRoleAccess.empcode;
      const montharray = getMonthsInRange(applypermission.date, applypermission.date);
      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      let res_vendor = await axios.post(SERVICE.APPLYPERMISSIONS_EMPLOYEEID_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        employeeid: empid,
      });

      let res_vendoroverall = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER, {
        employee: empname,
        // userDates: daysArray,
        fromdate: applypermission.date,
        todate: applypermission.date,
        montharray: [...montharray],
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        }
      })

      let res_attcriteria = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let empbranch = Accessdrop === 'HR' ? applypermission.branch : isUserRoleAccess.branch;
      let res_limitcontrol = await axios.post(SERVICE.LIMITCONTROLSETTING_BRANCH_FILTER_FOR_PERMISSION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        branch: empbranch,
      });
      const limitResult = res_limitcontrol.data.limitcontrolsettings;

      const filteredBatch = res?.data?.finaluser?.filter(d => {
        // const [day, month, year] = d.rowformattedDate.split("/");
        // const formattedDate = new Date(`${year}-${month}-${day}`);
        const formattedDate = new Date(d.finalDate);
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

      let overallClockinoutStatusCounts = {};
      let monthlyClockinoutStatusCounts = {};

      if (filteredBatch?.length > 0) {

        // Filter for the current month's data
        const monthlyData = filteredBatch.filter((item) => {
          // const [day, month, year] = item.rowformattedDate?.split('/');
          // const formattedDate = `${year}-${month}-${day}`;
          const formattedDate = new Date(item.finalDate);
          const leaveDate = new Date(formattedDate);
          return (
            leaveDate.getMonth() + 1 === currentMonth &&
            leaveDate.getFullYear() === currentYear
          );
        });

        // Function to calculate leave counts
        const calculatePermissionCounts = (data) => {
          return data.reduce((acc, item) => {
            if (!acc[item.empcode]) {
              acc[item.empcode] = {
                employeename: item.username,
                empcode: item.empcode,
                approvedCount: 0,
                appliedCount: 0,
                rejectedCount: 0,
                lateClockinCount: 0,
                earlyClockoutCount: 0,
              };
            }

            // Count Approved and Applied statuses
            if (item.clockinstatus === "Late - ClockIn") {
              acc[item.empcode].lateClockinCount += 1;
            }
            if (item.clockoutstatus === "Early - ClockOut") {
              acc[item.empcode].earlyClockoutCount += 1;
            }
            return acc;
          }, {});
        };

        // Calculate leave counts for overall and monthly data
        overallClockinoutStatusCounts = calculatePermissionCounts(filteredBatch);
        monthlyClockinoutStatusCounts = calculatePermissionCounts(monthlyData);
      }

      let uninformResult = res_vendor?.data?.permissions;
      // console.log(uninformResult, 'uninformResult')
      if (uninformResult?.length > 0) {

        // Filter for the current month's data
        const monthlyData = uninformResult.filter((item) => {
          const leaveDate = new Date(item.date);
          return (
            leaveDate.getMonth() + 1 === currentMonth &&
            leaveDate.getFullYear() === currentYear
          );
        });

        // Function to calculate leave counts
        const calculatePermissionCounts = (data) => {
          return data.reduce((acc, item) => {
            if (!acc[item.employeeid]) {
              acc[item.employeeid] = {
                employeename: item.employeename,
                employeeid: item.employeeid,
                approvedCount: 0,
                appliedCount: 0,
                rejectedCount: 0,
                lateClockinCount: 0,
                earlyClockoutCount: 0,
              };
            }

            // Count Approved and Applied statuses
            if (item.status === "Approved") {
              acc[item.employeeid].approvedCount += 1;
            } else if (item.status === "Applied") {
              acc[item.employeeid].appliedCount += 1;
            } else if (item.status === "Rejected") {
              acc[item.employeeid].rejectedCount += 1;
            }
            setSelectedEmpData({ employeename: item.employeename, employeeid: item.employeeid });

            return acc;
          }, {});
        };

        // Calculate leave counts for overall and monthly data
        const overallPermissionCounts = calculatePermissionCounts(uninformResult);
        const monthlyPermissionCounts = calculatePermissionCounts(monthlyData);

        // Set state with overall and monthly data
        // setHistoryOverAllData(overallPermissionCounts[empid]);
        // setHistoryMonthData(monthlyPermissionCounts[empid]);

        // Transform the counts object into an array format
        // const transformCounts = (counts) => Object.values(counts);

        // setHistoryOverAllData(transformCounts(overallPermissionCounts));
        // setHistoryMonthData(transformCounts(monthlyPermissionCounts));

        setHistoryOverAllData([{ ...overallPermissionCounts[empid], lateClockinCount: overallClockinoutStatusCounts[empid]?.lateClockinCount, earlyClockoutCount: overallClockinoutStatusCounts[empid]?.earlyClockoutCount }]);
        setHistoryMonthData([{ ...monthlyPermissionCounts[empid], lateClockinCount: monthlyClockinoutStatusCounts[empid]?.lateClockinCount, earlyClockoutCount: monthlyClockinoutStatusCounts[empid]?.earlyClockoutCount }]);

      } else {
        setSelectedEmpData({ employeename: empname, employeeid: empid });
        setHistoryOverAllData([]);
        setHistoryMonthData([]);
      }

      if (res_attcriteria?.data?.attendancecontrolcriteria[0].enablebranchlimit === false) {
        setApplyleavecheckHistory(false);
        handleSubmit();
      }
      else if (res_attcriteria?.data?.attendancecontrolcriteria[0].enablebranchlimit === true) {
        let checkCurrentDateData = [];
        if (limitResult.length > 0) {
          res_vendoroverall?.data?.permissions.map((item) => {
            if (item.branch === limitResult[0].branch && limitResult[0].modulename === "Leave&Permission" && limitResult[0].submodulename === "Permission" && limitResult[0].mainpagename === "Apply Permission") {
              if (item.date === applypermission.date) {
                checkCurrentDateData.push(item);
              }
            }
          });
        }

        if (Accessdrop === "HR" && selectedOptionsCompany.length === 0) {
          setApplyleavecheckHistory(false);
          setPopupContentMalert("Please Select Company");
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        } else if (Accessdrop === "HR" && selectedOptionsBranch.length === 0) {
          setApplyleavecheckHistory(false);
          setPopupContentMalert("Please Select Branch");
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        } else if (Accessdrop === "HR" && selectedOptionsUnit.length === 0) {
          setApplyleavecheckHistory(false);
          setPopupContentMalert("Please Select Unit");
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        } else if (Accessdrop === "HR" && selectedOptionsTeam.length === 0) {
          setApplyleavecheckHistory(false);
          setPopupContentMalert("Please Select Team");
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        } else if (Accessdrop === "HR" && applypermission.employeename === "Please Select Employee Name") {
          setApplyleavecheckHistory(false);
          setPopupContentMalert("Please Select Employee Name");
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        }
        else if (limitResult.length === 0) {
          setApplyleavecheckHistory(false);
          setPopupContentMalert(`This branch does not have any data matches. Kindly contact the administrator to confirm the 'Limit Control Settings'.`);
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        }
        else if (limitResult.length > 0 && checkCurrentDateData.length >= Number(limitResult[0]?.limit)) {
          setApplyleavecheckHistory(false);
          setPopupContentMalert("The limit for applying today has been reached!");
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        }
        else {
          setApplyleavecheckHistory(false);
          handleSubmit();
        }
      }
    } catch (err) {
      setApplyleavecheckHistory(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  const fetchPermissionHistoryUpdate = async (empid, empname, permdate) => {
    const startOfYear = moment().startOf("year").format("YYYY-MM-DD");
    let startMonthDate = new Date(startOfYear);
    let endMonthDate = new Date();

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

    try {
      const montharray = getMonthsInRange(permdate, permdate);
      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      let res_vendor = await axios.post(SERVICE.APPLYPERMISSIONS_EMPLOYEEID_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        employeeid: empid,
      });

      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER, {
        employee: empname,
        // userDates: daysArray,
        fromdate: permdate,
        todate: permdate,
        montharray: [...montharray],
      }, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        }
      })

      const filteredBatch = res?.data?.finaluser?.filter(d => {
        // const [day, month, year] = d.rowformattedDate.split("/");
        // const formattedDate = new Date(`${year}-${month}-${day}`);
        const formattedDate = new Date(d.finalDate);
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

      let overallClockinoutStatusCounts = {};
      let monthlyClockinoutStatusCounts = {};

      if (filteredBatch?.length > 0) {

        // Filter for the current month's data
        const monthlyData = filteredBatch.filter((item) => {
          // const [day, month, year] = item.rowformattedDate?.split('/');
          // const formattedDate = `${year}-${month}-${day}`;
          const formattedDate = new Date(item.finalDate);
          const leaveDate = new Date(formattedDate);
          return (
            leaveDate.getMonth() + 1 === currentMonth &&
            leaveDate.getFullYear() === currentYear
          );
        });

        // Function to calculate leave counts
        const calculatePermissionCounts = (data) => {
          return data.reduce((acc, item) => {
            if (!acc[item.empcode]) {
              acc[item.empcode] = {
                employeename: item.username,
                empcode: item.empcode,
                approvedCount: 0,
                appliedCount: 0,
                rejectedCount: 0,
                lateClockinCount: 0,
                earlyClockoutCount: 0,
              };
            }

            // Count Approved and Applied statuses
            if (item.clockinstatus === "Late - ClockIn") {
              acc[item.empcode].lateClockinCount += 1;
            }
            if (item.clockoutstatus === "Early - ClockOut") {
              acc[item.empcode].earlyClockoutCount += 1;
            }
            return acc;
          }, {});
        };

        // Calculate leave counts for overall and monthly data
        overallClockinoutStatusCounts = calculatePermissionCounts(filteredBatch);
        monthlyClockinoutStatusCounts = calculatePermissionCounts(monthlyData);
      }

      let uninformResult = res_vendor?.data?.permissions

      if (uninformResult?.length > 0) {

        // Filter for the current month's data
        const monthlyData = uninformResult.filter((item) => {
          const leaveDate = new Date(item.date);
          return (
            leaveDate.getMonth() + 1 === currentMonth &&
            leaveDate.getFullYear() === currentYear
          );
        });

        // Function to calculate leave counts
        const calculatePermissionCounts = (data) => {
          return data.reduce((acc, item) => {
            if (!acc[item.employeeid]) {
              acc[item.employeeid] = {
                employeename: item.employeename,
                employeeid: item.employeeid,
                approvedCount: 0,
                appliedCount: 0,
                rejectedCount: 0,
                lateClockinCount: 0,
                earlyClockoutCount: 0,
              };
            }

            // Count Approved and Applied statuses
            if (item.status === "Approved") {
              acc[item.employeeid].approvedCount += 1;
            } else if (item.status === "Applied") {
              acc[item.employeeid].appliedCount += 1;
            } else if (item.status === "Rejected") {
              acc[item.employeeid].rejectedCount += 1;
            }
            setSelectedEmpDataUpdate({ employeename: item.employeename, employeeid: item.employeeid });
            return acc;
          }, {});
        };

        // Calculate leave counts for overall and monthly data
        const overallPermissionCounts = calculatePermissionCounts(uninformResult);
        const monthlyPermissionCounts = calculatePermissionCounts(monthlyData);

        // // Set state with overall and monthly data
        // setHistoryOverAllDataUpdate(overallPermissionCounts[empid]);
        // setHistoryMonthDataUpdate(monthlyPermissionCounts[empid]);

        // Transform the counts object into an array format
        // const transformCounts = (counts) => Object.values(counts);

        setHistoryOverAllDataUpdate([{ ...overallPermissionCounts[empid], lateClockinCount: overallClockinoutStatusCounts[empid]?.lateClockinCount, earlyClockoutCount: overallClockinoutStatusCounts[empid]?.earlyClockoutCount }]);
        setHistoryMonthDataUpdate([{ ...monthlyPermissionCounts[empid], lateClockinCount: monthlyClockinoutStatusCounts[empid]?.lateClockinCount, earlyClockoutCount: monthlyClockinoutStatusCounts[empid]?.earlyClockoutCount }]);
      } else {
        setSelectedEmpDataUpdate({ employeename: empname, employeeid: empid });
        setHistoryOverAllDataUpdate([]);
        setHistoryMonthDataUpdate([]);
      }
      handleClickOpenHistoryUpdate();

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  // //submit option for saving
  const handleSubmit = async () => {
    // e.preventDefault();

    let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let empid = Accessdrop === 'HR' ? applypermission.employeeid : isUserRoleAccess.empcode;
    const [year, month, day] = applypermission.date?.split('-');
    let result = res_vendor?.data?.permissions.filter((d) => d.employeeid === empid && d.status !== 'Rejected');
    let matchedResult = result.filter((d) => {
      const [dataYear, dataMonth, dataDay] = d.date?.split('-');
      if (month === dataMonth && year === dataYear) {
        return d;
      }
    })

    let enableStatus;

    let isEmployeeEnable = res?.data?.attendancecontrolcriteria[0].permissiontodos && res?.data?.attendancecontrolcriteria[0].permissiontodos.find(d => d.empcode === empid);

    if (isEmployeeEnable) {
      enableStatus = isEmployeeEnable.enablepermcompensation;
    }
    else {
      enableStatus = res?.data?.attendancecontrolcriteria[0].enablepermcompensation;
    }

    // Convert minTime to 24-hour format
    let minTimeDate = new Date(`${yyyy}-01-01T${minTime}`);
    let minTime24Hrs = minTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Convert maxTime to 24-hour format
    let maxTimeDate = new Date(`${yyyy}-01-01T${maxTime}`);
    let maxTime24Hrs = maxTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Convert applypermission.fromtime to 24-hour format
    let selectedTimeDate = new Date(
      `${yyyy}-01-01T${applypermission.fromtime}`
    );
    let selectedTime24Hrs = selectedTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    const [hours1, minutes1, seconds1] = selectedTime24Hrs
      .split(":")
      .map(Number);
    const [hours2, minutes2, seconds2] = maxTime24Hrs.split(":").map(Number);
    const [hours3, minutes3, seconds3] = minTime24Hrs.split(":").map(Number);

    const isNameMatch = res_vendor?.data?.permissions.some(
      (item) =>
        item.employeename?.toLowerCase() ===
        isUserRoleAccess.companyname.toLowerCase() &&
        item.date === applypermission.date
    );
    const nameCheck = res_vendor?.data?.permissions.some(
      (item) =>
        item.companyname === applypermission.companyname &&
        item.branch === applypermission.branch &&
        item.team === applypermission.team &&
        item.employeename.toLowerCase() === applypermission.employeename.toLowerCase() &&
        item.date === applypermission.date
    );

    // if (
    //   Accessdrop === "HR" &&
    //   applypermission.employeename === "Please Select Employee Name"
    // ) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"Please Select Employee Name"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } else 

    if (Accessdrop === "HR" && selectedOptionsCompany.length === 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (Accessdrop === "HR" && selectedOptionsBranch.length === 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (Accessdrop === "HR" && selectedOptionsUnit.length === 0) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (Accessdrop === "HR" && selectedOptionsTeam.length === 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (Accessdrop === "HR" && applypermission.employeename === "Please Select Employee Name") {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (applypermission.date === "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (applytype === "Please Select ApplyType") {
      setPopupContentMalert("Please Select Apply Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (type === "") {
      setPopupContentMalert("Please Select Permission Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (applypermission.fromtime === "") {
      setPopupContentMalert("Please Select From Time");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (applypermission.requesthours == "") {
      setPopupContentMalert("Please Select Request Hours");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (applypermission.reasonforpermission === "") {
      setPopupContentMalert("Please Enter Reason for Permission");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (applypermission.employeename === "Please Select Employee Name" && isNameMatch) {
      setPopupContentMalert("Permission Was Already Added to this Date!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (nameCheck) {
      setPopupContentMalert("Permission Was Already Added to this Employee on this Date!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      (applytype !== "inbetween" &&
        (applytype == "startshift" || applytype == "endshift") &&
        hours1 > hours2) ||
      (hours1 === hours2 && minutes1 > minutes2) ||
      (hours1 === hours2 && minutes1 === minutes2 && seconds1 > seconds2) ||
      hours1 < hours3 ||
      (hours1 === hours3 && minutes1 < minutes3) ||
      (hours1 === hours3 && minutes1 === minutes3 && seconds1 < seconds3)
    ) {
      setPopupContentMalert(`Select the time between ${showMinTime} and ${showMaxTime}`);
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (!enableStatus && matchedResult.length >= parseInt(res?.data?.attendancecontrolcriteria[0].permissionpermonthduration)) {
      setPopupContentMalert(`You have reached allowed count ${res?.data?.attendancecontrolcriteria[0].permissionpermonthduration} per month. You cannot apply permission.`);
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (enableStatus && matchedResult.length >= parseInt(res?.data?.attendancecontrolcriteria[0].permissionpermonthduration) && compensationValue === false) {
      setPopupContentMalert("Please Select Compensation Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (applypermission.compensationapplytype === '') {
      setPopupContentMalert("Please Select Compensation Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (applypermission.shifttiming === '' || applypermission.time === '' || getTiming === '') {
      setPopupContentMalert("Shift is not allotted for the selected date. Please select another date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else {
      // setBtnSubmit(true);
      // sendRequest();      
      handleClickOpenHistory();
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    settype("Minutes");
    setApplytype("Please Select ApplyType");
    setApplyPermission({
      ...applypermission,
      // companyname: "Please Select Company",
      // branch: "Please Select Branch",
      // unit: "Please Select Unit",
      // team: "Please Select Team",
      employeename: "Please Select Employee Name",
      employeeid: "",
      permissiontype: "",
      companyname: "",
      branch: "",
      unit: "",
      team: "",
      date: "",
      fromtime: "",
      requesthours: "",
      endtime: "",
      finaltime: "00:00",
      reasonforpermission: "",
      reportingto: "",
      shifttiming: "",
      time: "",
      shiftmode: "",
    });
    // setBranchOptions([]);
    // setUnitOptions([]);
    // setTeamOptions([]);
    // setUserOptions([]);
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setBranchOption([]);
    setUnitOption([]);
    setTeamOption([]);
    setEmpname([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    if (filterUser.filtertype === "Please Select Filter Type" || filterUser.filtertype === "" || filterUser.filtertype === undefined) {
      setPopupContentMalert("Please Select Filter Type for Employee Names");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (selectedCompany?.length === 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team", "Branch", "Unit"]?.includes(filterUser.filtertype) && selectedBranch.length === 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team", "Unit"]?.includes(filterUser.filtertype) && selectedUnit.length === 0) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual", "Team"]?.includes(filterUser.filtertype) && selectedTeam.length === 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (["Individual"]?.includes(filterUser.filtertype) && selectedEmp.length === 0) {
      setPopupContentMalert("Please Select Employee Names");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (selectedApplyType.length === 0) {
      setPopupContentMalert("Please Select Apply Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (filterUser.fromdate === '' && filterUser.todate === '') {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      fetchApplyPermissions();
    }
  };

  const handleClearFilter = async (e) => {
    e.preventDefault();
    setPermissions([]);
    setItems([]);
    setFilterUser({ filtertype: "Individual" });
    setSelectedCompany([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
    setSelectedEmp([]);
    setSelectedApplyType([]);
    setValueCompany([]);
    setValueBranch([]);
    setValueUnit([]);
    setValueTeam([]);
    setValueEmp([]);
    setValueApplyType([]);
    setPageAppPerm(1);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => { setIsEditOpen(true); };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // Compensation model
  const [compensationValue, setCompensationValue] = useState(false);
  const [isCompensationOpen, setIsCompensationOpen] = useState(false);
  const handleClickOpenCompensation = () => { setIsCompensationOpen(true); };
  const handleCloseModCompensation = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsCompensationOpen(false);
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
  const handleClickOpeninfo = () => { setOpeninfo(true); };
  const handleCloseinfo = () => { setOpeninfo(false); };

  //get single row to edit....
  const getCode = async (e, name) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setPermissionEdit(res?.data?.sPermission);
      setLeaveId(res?.data?.sPermission._id);
      setAccesDropEdit(res?.data?.sPermission.access);
      setLeaveEdit(res?.data?.sPermission.permissiontype);
      setApplytypeEdit(res?.data?.sPermission.applytype);
      setPermissionSelf(res?.data?.sPermission);
      // setSelectedOptionsCompanyEdit(
      //   res?.data?.sPermission?.company.map((item) => ({
      //     label: item,
      //     value: item,
      //   }))
      // );
      // setSelectedOptionsBranchEdit(
      //   res?.data?.sPermission?.branch.map((item) => ({
      //     label: item,
      //     value: item,
      //   }))
      // );
      // setSelectedOptionsUnitEdit(
      //   res?.data?.sPermission?.unit.map((item) => ({
      //     label: item,
      //     value: item,
      //   }))
      // );
      // setSelectedOptionsTeamEdit(
      //   res?.data?.sPermission?.team.map((item) => ({
      //     label: item,
      //     value: item,
      //   }))
      // );
      setSelectedOptionsCompanyEdit(res?.data?.sPermission?.companyname);
      setSelectedOptionsBranchEdit(res?.data?.sPermission?.branch);
      setSelectedOptionsUnitEdit(res?.data?.sPermission?.unit);
      setSelectedOptionsTeamEdit(res?.data?.sPermission?.team);
      setValueCompanyCatEdit(res?.data?.sPermission?.companyname);
      setValueBranchCatEdit(res?.data?.sPermission?.branch);
      setValueUnitCatEdit(res?.data?.sPermission?.unit);
      setValueTeamCatEdit(res?.data?.sPermission?.team);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPermissionEdit(res?.data?.sPermission);
      setSelectedOptionsCompanyEdit(res?.data?.sPermission?.companyname);
      setSelectedOptionsBranchEdit(res?.data?.sPermission?.branch);
      setSelectedOptionsUnitEdit(res?.data?.sPermission?.unit);
      setSelectedOptionsTeamEdit(res?.data?.sPermission?.team);
      // setSelectedOptionsCompanyEdit(
      //   res?.data?.sPermission?.company.map((item) => ({
      //     label: item,
      //     value: item,
      //   }))
      // );
      // setSelectedOptionsBranchEdit(
      //   res?.data?.sPermission?.branch.map((item) => ({
      //     label: item,
      //     value: item,
      //   }))
      // );
      // setSelectedOptionsUnitEdit(
      //   res?.data?.sPermission?.unit.map((item) => ({
      //     label: item,
      //     value: item,
      //   }))
      // );
      // setSelectedOptionsTeamEdit(
      //   res?.data?.sPermission?.team.map((item) => ({
      //     label: item,
      //     value: item,
      //   }))
      // );
      handleClickOpenview();
      setApplytypeEdit(res?.data?.sPermission.applytype);
      setLeaveEdit(res?.data?.sPermission.permissiontype);
      setAccesDropEdit(res?.data?.sPermission.access);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPermissionEdit(res?.data?.sPermission);
      handleClickOpeninfo();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const getinfoCodeStatus = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.PERMISSION_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSelectStatus(res?.data?.sPermission);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchCategoryTicket();
  }, []);

  //Project updateby edit pageAppPerm...
  let updateby = permissionedit?.updatedby;
  let addedby = permissionedit?.addedby;
  let updatedByStatus = selectStatus.updatedby;

  let subprojectsid = permissionedit?._id;

  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(`${SERVICE.PERMISSION_SINGLE}/${leaveId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        employeename:
          AccessdropEdit === "HR"
            ? String(permissionedit.employeename)
            : isUserRoleAccess.companyname,
        employeeid:
          AccessdropEdit === "HR"
            ? String(permissionedit.employeeid)
            : isUserRoleAccess.empcode,
        permissiontype: String(leaveEdit),
        applytype: String(applytypeEdit),
        date: String(permissionedit.date),
        shifttiming: String(
          Accessdrop === "HR"
            ? permissionedit.shifttiming
            : isUserRoleAccess.shifttiming
        ),
        time: String(Accessdrop === "HR" ? permissionedit.time : getTiming),
        shiftmode: String(Accessdrop === "HR" ? permissionedit.shiftmode : getShiftMode),
        reasonforpermission: String(permissionedit.reasonforpermission),
        // reportingto:
        //   AccessdropEdit === "HR"
        //     ? String(permissionedit.reportingto)
        //     : isUserRoleAccess.reportingto,
        companyname: String(
          AccessdropEdit === "HR" ? permissionedit.companyname : ""
        ),
        branch: String(AccessdropEdit === "HR" ? permissionedit.branch : ""),
        unit: String(AccessdropEdit === "HR" ? permissionedit.unit : ""),
        team: String(AccessdropEdit === "HR" ? permissionedit.team : ""),
        access: AccessdropEdit,
        fromtime: String(permissionedit.fromtime),
        requesthours: String(permissionedit.requesthours),
        endtime: String(permissionedit.endtime),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchApplyPermissions();
      if (!isUserRoleAccess?.role?.includes("Manager") ||
        !isUserRoleAccess?.role?.includes("HiringManager") ||
        !isUserRoleAccess?.role?.includes("HR") ||
        !isUserRoleAccess?.role?.includes("Superadmin")) {
        await fetchApplyPermissionsForEmployee();
      }
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const sendEditStatus = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.PERMISSION_SINGLE}/${selectStatus._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          status: String(selectStatus.status),
          rejectedreason: String(
            selectStatus.status == "Rejected" ? selectStatus.rejectedreason : ""
          ),
          actionby: String(isUserRoleAccess.companyname),
          updatedby: [
            ...updatedByStatus,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      await fetchApplyPermissions();
      if (!isUserRoleAccess?.role?.includes("Manager") ||
        !isUserRoleAccess?.role?.includes("HiringManager") ||
        !isUserRoleAccess?.role?.includes("HR") ||
        !isUserRoleAccess?.role?.includes("Superadmin")) {
        await fetchApplyPermissionsForEmployee();
      }
      handleStatusClose();
      handleCloseerr();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // const editStatus = () => {
  //   if (selectStatus.status == "Rejected") {
  //     if (selectStatus.rejectedreason == "") {
  //       setShowAlert(
  //         <>
  //           <ErrorOutlineOutlinedIcon
  //             sx={{ fontSize: "100px", color: "orange" }}
  //           />
  //           <p style={{ fontSize: "20px", fontWeight: 900 }}>
  //             {"Please Enter Rejected Reason"}
  //           </p>
  //         </>
  //       );
  //       handleClickOpenerr();
  //     } else {
  //       sendEditStatus();
  //     }
  //   } else {
  //     sendEditStatus();
  //   }
  // };

  const editStatus = () => {
    handleCloseModHistoryUpdate();
    if (selectStatus.status == "Rejected") {
      if (selectStatus.rejectedreason == "") {
        setPopupContentMalert("Please Enter Rejected Reason");
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        sendEditStatus();
      }
    }
    else if (selectStatus.status == "Approved") {
      if (isCheckList) {
        handleClickOpenEditCheckList();
      } else {
        setPopupContentMalert(<>
          Please Fill the Checklist. Click this link:{" "}
          <a href="/interview/myinterviewchecklist" target="_blank" rel="noopener noreferrer">
            My Checklist
          </a>
        </>);
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      }

    }
    else {
      sendEditStatus();
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchApplyleaveAll();

    // Convert minTime to 24-hour format
    let minTimeDate = new Date(`${yyyy}-01-01T${minTimeEdit}`);
    let minTime24Hrs = minTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Convert maxTime to 24-hour format
    let maxTimeDate = new Date(`${yyyy}-01-01T${maxTimeEdit}`);
    let maxTime24Hrs = maxTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });

    // Convert applypermission.fromtime to 24-hour format
    let selectedTimeDate = new Date(`${yyyy}-01-01T${permissionedit.fromtime}`);
    let selectedTime24Hrs = selectedTimeDate.toLocaleTimeString("en-US", {
      hour12: false,
    });
    const [hours1, minutes1, seconds1] = selectedTime24Hrs
      .split(":")
      .map(Number);
    const [hours2, minutes2, seconds2] = maxTime24Hrs.split(":").map(Number);
    const [hours3, minutes3, seconds3] = minTime24Hrs.split(":").map(Number);

    const isNameMatch = allApplyleaveedit.some((item) =>
      (item.employeename?.toLowerCase() === Accessdrop) === "HR"
        ? applypermission.employeename?.toLowerCase()
        : isUserRoleAccess.companyname && item.date === applypermission.date
    );
    const nameCheck = allApplyleaveedit.some(
      (item) =>
        item.company === permissionedit.company &&
        item.branch === permissionedit.branch &&
        item.team === permissionedit.team &&
        item.employeename.toLowerCase() ===
        permissionedit.employeename.toLowerCase() &&
        item.date === permissionedit.date
    );
    if (
      AccessdropEdit === "HR" &&
      permissionedit.employeename === "Please Select Employee Name"
    ) {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      AccessdropEdit === "HR" &&
      permissionedit.company === "Please Select Company"
    ) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      AccessdropEdit === "HR" &&
      permissionedit.branch === "Please Select Branch"
    ) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      AccessdropEdit === "HR" &&
      permissionedit.unit === "Please Select Unit"
    ) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      AccessdropEdit === "HR" &&
      permissionedit.team === "Please Select Team"
    ) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (applytypeEdit === "Please Select ApplyType") {
      setPopupContentMalert("Please Select Apply Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (leaveEdit === "") {
      setPopupContentMalert("Please Select Permission Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (permissionedit.date === "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (permissionedit.fromtime === "") {
      setPopupContentMalert("Please Select From Time");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (permissionedit.requesthours == "") {
      setPopupContentMalert("Please Select Request Hours");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (permissionedit.reasonforpermission === "") {
      setPopupContentMalert("Please Enter Reason For Permission");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      allApplyleaveedit == "Please Select Employee Name" &&
      isNameMatch
    ) {
      setPopupContentMalert("Permission Was Already Added to this Employee to Date!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (nameCheck) {
      setPopupContentMalert("Permission Was Already Added to this Employee to Date!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      (applytypeEdit !== "inbetween" &&
        (applytypeEdit == "startshift" || applytypeEdit == "endshift") &&
        hours1 > hours2) ||
      (hours1 === hours2 && minutes1 > minutes2) ||
      (hours1 === hours2 && minutes1 === minutes2 && seconds1 > seconds2) ||
      hours1 < hours3 ||
      (hours1 === hours3 && minutes1 < minutes3) ||
      (hours1 === hours3 && minutes1 === minutes3 && seconds1 < seconds3)
    ) {
      setPopupContentMalert(`Select the time between ${showMinTimeEdit} and ${showMaxTimeEdit}`);
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
      // await fetchApplyPermissions();
    }
  };

  //get all Sub vendormasters.
  const fetchApplyleave = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let answer =
        isUserRoleAccess?.role?.includes("Manager") ||
          isUserRoleAccess?.role?.includes("HiringManager") ||
          isUserRoleAccess?.role?.includes("HR") ||
          isUserRoleAccess?.role?.includes("Superadmin")
          ? res_vendor?.data?.applyleaves
          : res_vendor?.data?.applyleaves.filter(
            (data) => data.employeename === isUserRoleAccess.companyname
          );
      setApplyleaves(answer);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchApplyPermissions = async () => {
    setPageName(!pageName);
    // setApplyleavecheck(true);
    try {
      let res_vendor = await axios.post(SERVICE.APPLYPERMISSIONS_LIST_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        type: filterUser.filtertype,
        company: [...valueCompany],
        branch: [...valueBranch],
        unit: [...valueUnit],
        team: [...valueTeam],
        employee: [...valueEmp],
        applytype: [...valueApplyType],
        assignbranch: accessbranch,
      });
      let answer = res_vendor?.data?.permissions;

      const itemsWithSerialNumber = answer?.map((item, index) => {
        const militaryTime = item.fromtime;
        const militaryTimeArray = militaryTime.split(":");
        const hours = parseInt(militaryTimeArray[0], 10);
        const minutes = militaryTimeArray[1];

        const convertedTime = new Date(
          yyyy,
          0,
          1,
          hours,
          minutes
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        return {
          ...item,
          id: item._id,
          serialNumber: index + 1,
          employeeid: item.employeeid,
          employeename: item.employeename,
          fromtime: convertedTime,
          date: moment(item.date).format("DD-MM-YYYY"),
          endtime: item.endtime,
          requesthours: item.requesthours,
          reasonforpermission: item.reasonforpermission,
          compensationstatus: item.compensationstatus === "Compensation" ? "Yes" : "No",
          compensationapplytype: item.compensationapplytype === "startshift" ? "Start Shift" : item.compensationapplytype === "endshift" ? "End Shift" : item.compensationapplytype === "inbetween" ? "In Between" : "",
          status: item.status,
        };
      });
      setPermissions(itemsWithSerialNumber);
      setTotalPagesAppPerm(Math.ceil(itemsWithSerialNumber.length / pageSizeAppPerm));
      let Approve = res_vendor?.data?.permissions.filter(
        (data) => data.status === "Approved"
      )
      setIsPermissions(Approve);
      setSearchQueryAppPerm("");
      setApplyleavecheck(false);
    } catch (err) { setApplyleavecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchApplyPermissionsForEmployee = async () => {
    setPageName(!pageName);
    setApplyleavecheck(true);
    try {
      let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        }
      });
      let answer = res_vendor?.data?.permissions.filter(
        (data) => data.employeename === isUserRoleAccess.companyname
      );
      const itemsWithSerialNumber = answer?.map((item, index) => {
        const militaryTime = item.fromtime;
        const militaryTimeArray = militaryTime.split(":");
        const hours = parseInt(militaryTimeArray[0], 10);
        const minutes = militaryTimeArray[1];

        const convertedTime = new Date(
          yyyy,
          0,
          1,
          hours,
          minutes
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        return {
          ...item,
          id: item._id,
          serialNumber: index + 1,
          employeeid: item.employeeid,
          employeename: item.employeename,
          fromtime: convertedTime,
          date: moment(item.date).format("DD-MM-YYYY"),
          endtime: item.endtime,
          requesthours: item.requesthours,
          reasonforpermission: item.reasonforpermission,
          compensationstatus: item.compensationstatus === "Compensation" ? "Yes" : "No",
          compensationapplytype: item.compensationapplytype === "startshift" ? "Start Shift" : item.compensationapplytype === "endshift" ? "End Shift" : item.compensationapplytype === "inbetween" ? "In Between" : "",
          status: item.status,
        };
      });
      setPermissions(itemsWithSerialNumber);
      setTotalPagesAppPerm(Math.ceil(itemsWithSerialNumber.length / pageSizeAppPerm));
      let Approve = res_vendor?.data?.permissions.filter(
        (data) =>
          data.employeename === isUserRoleAccess.companyname &&
          data.status === "Approved"
      );
      setIsPermissions(Approve);
      setApplyleavecheck(false);
    } catch (err) { setApplyleavecheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    if (!isUserRoleAccess?.role?.includes("Manager") ||
      !isUserRoleAccess?.role?.includes("HiringManager") ||
      !isUserRoleAccess?.role?.includes("HR") ||
      !isUserRoleAccess?.role?.includes("Superadmin")) {
      fetchApplyPermissionsForEmployee();
    }
  }, []);

  //get all Sub vendormasters.
  const fetchApplyleaveAll = async () => {
    setPageName(!pageName)
    try {
      let res_vendor = await axios.get(SERVICE.PERMISSIONS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllApplyleaveedit(
        res_vendor?.data?.permissions.filter(
          (item) => item._id !== permissionedit._id
        )
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  // useEffect(() => {
  //   // getexcelDatas();
  // }, [permissionedit, applypermission, applyleaves]);

  useEffect(() => {
    fetchApplyleave();
  }, []);

  useEffect(() => {
    fetchApplyleaveAll();
    // }, [isEditOpen, permissionedit]);
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);
  const addSerialNumber = (data) => {
    setItems(data);
  };

  useEffect(() => {
    addSerialNumber(permissions);
  }, [permissions]);

  // Split the search query into individual terms
  const searchTerms = searchQueryAppPerm.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  // Pagination for outer filter
  const filteredData = filteredDatas?.slice((pageAppPerm - 1) * pageSizeAppPerm, pageAppPerm * pageSizeAppPerm);
  const totalPagesAppPermOuter = Math.ceil(filteredDatas?.length / pageSizeAppPerm);
  const visiblePages = Math.min(totalPagesAppPermOuter, 3);
  const firstVisiblePage = Math.max(1, pageAppPerm - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAppPermOuter);
  const pageNumbers = [];
  const indexOfLastItem = pageAppPerm * pageSizeAppPerm;
  const indexOfFirstItem = indexOfLastItem - pageSizeAppPerm;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const columnDataTableAppPerm = [
    {
      field: "checkbox",
      headerName: "",
      headerStyle: { fontWeight: "bold", },
      sortable: false,
      width: 75,
      filter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibilityAppPerm.checkbox,
      pinned: "left",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityAppPerm.serialNumber,
    },
    {
      field: "employeename",
      headerName: "Employee Name",
      flex: 0,
      width: 200,
      hide: !columnVisibilityAppPerm.employeename,
    },
    {
      field: "employeeid",
      headerName: "Employee Id",
      flex: 0,
      width: 120,
      hide: !columnVisibilityAppPerm.employeeid,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 110,
      hide: !columnVisibilityAppPerm.date,
    },
    {
      field: "fromtime",
      headerName: "From Time",
      flex: 0,
      width: 100,
      hide: !columnVisibilityAppPerm.fromtime,
    },
    {
      field: "requesthours",
      headerName: "Request Hours",
      flex: 0,
      width: 90,
      hide: !columnVisibilityAppPerm.requesthours,
    },
    {
      field: "permissiontype",
      headerName: "Permission Type",
      flex: 0,
      width: 90,
      hide: !columnVisibilityAppPerm.permissiontype,
    },
    {
      field: "endtime",
      headerName: "End Time",
      flex: 0,
      width: 100,
      hide: !columnVisibilityAppPerm.endtime,
    },
    {
      field: "reasonforpermission",
      headerName: "Reason for Permission",
      flex: 0,
      width: 180,
      hide: !columnVisibilityAppPerm.reasonforpermission,
    },
    {
      field: "compensationstatus",
      headerName: "Compensation Status",
      flex: 0,
      width: 180,
      hide: !columnVisibilityAppPerm.compensationstatus,
    },
    {
      field: "compensationapplytype",
      headerName: "Compensation Type",
      flex: 0,
      width: 180,
      hide: !columnVisibilityAppPerm.compensationapplytype,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 120,
      hide: !columnVisibilityAppPerm.status,
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex' }}>
          <Button
            variant="contained"
            sx={{
              margin: '5px',
              padding: "5px",
              backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
              color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
              fontSize: "10px",
              width: "90px",
              fontWeight: "bold",
              cursor: 'default',
              '&:hover': {
                color: params.value === "Applied" ? "black" : params.value === "Rejected" ? "white" : "white",
                backgroundColor: params.value === "Applied" ? "#FFC300" : params.value === "Rejected" ? "red" : params.value === "Approved" ? "green" : "inherit",
              }
            }}
          >
            {params.value}
          </Button>
        </Grid>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 270,
      minHeight: "40px !important",
      filter: false,
      sortable: false,
      hide: !columnVisibilityAppPerm.actions,
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {(!(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleAccess?.role?.includes("HiringManager") ||
            isUserRoleAccess?.role?.includes("HR") ||
            isUserRoleAccess?.role?.includes("Superadmin")
          ) &&
            ["Approved", "Rejected"].includes(params.data.status)) ||
            (isUserRoleCompare?.includes("eapplypermission") && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  handleClickOpenEdit();
                  getCode(params.data.id);
                }}
              >
                <EditOutlinedIcon sx={buttonStyles.buttonedit} />
              </Button>
            ))} */}
          {(!(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleCompare.includes("lassignapplypermission")
          ) &&
            ["Approved", "Rejected"].includes(params.data.status)) ||
            (isUserRoleCompare?.includes("dapplypermission") && (
              <Button
                sx={userStyle.buttondelete}
                onClick={(e) => {
                  rowData(params.data.id, params.data.name);
                }}
              >
                <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
              </Button>
            ))}
          {isUserRoleCompare?.includes("vapplypermission") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {(!(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleCompare.includes("lassignapplypermission")
          ) &&
            ["Approved", "Rejected"].includes(params.data.status)) ||
            (isUserRoleCompare?.includes("iapplypermission") && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getinfoCode(params.data.id);
                }}
              >
                <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
              </Button>
            ))}
          {!(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleCompare.includes("lassignapplypermission")
          )
            ? null
            : isUserRoleCompare?.includes("iapplypermission") && (
              <Button
                variant="contained"
                style={{
                  margin: '5px',
                  backgroundColor: "red",
                  minWidth: "15px",
                  padding: "6px 5px",
                }}
                onClick={(e) => {
                  getinfoCodeStatus(params.data.id);
                  handleStatusOpen();
                  getCodeNew(params.data);
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
      ...item,
      id: item._id,
      serialNumber: item.serialNumber,
    };
  });

  const DateFrom =
    (
      isUserRoleAccess.role.includes("Manager") ||
      isUserRoleCompare.includes("lapplypermission")) &&
      Accessdrop === "HR"
      ? formattedDatePresent
      : formattedDatet;

  // Datatable
  const handlePageSizeChange = (e) => {
    setPageSizeAppPerm(Number(e.target.value));
    setSelectAllChecked(false);
    setSelectedRows([]);
    setPageAppPerm(1);
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityAppPerm };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityAppPerm(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityAppPerm");
    if (savedVisibility) {
      setColumnVisibilityAppPerm(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem("columnVisibilityAppPerm", JSON.stringify(columnVisibilityAppPerm));
  }, [columnVisibilityAppPerm]);

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTableAppPerm.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManageAppPerm.toLowerCase())
  );

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibilityAppPerm((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // Excel
  // const fileName = "Apply Permission";
  const [fileFormat, setFormat] = useState('');
  let exportColumnNamescrt = ["Employee Id", "Employee Name", "Date", "From Time", "Request Hours", "Permission Type", "End Time", "Reason For Permission", "Compensation Status", "Compensation Type", "Status",]
  let exportRowValuescrt = ["employeeid", "employeename", "date", "fromtime", "requesthours", "permissiontype", "endtime", "reasonforpermission", "compensationstatus", "compensationapplytype", "status",]

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Apply Permission",
    pageStyle: "print",
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageAppPerm.current) {
      domtoimage.toBlob(gridRefImageAppPerm.current)
        .then((blob) => {
          saveAs(blob, "Apply Permission.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  return (
    <Box>
      <Headtitle title={"Apply Permission"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Apply Permission"
        modulename="Leave&Permission"
        submodulename="Permission"
        mainpagename="Apply Permission"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aapplypermission") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  {" "}
                  Add Apply Permission
                </Typography>
              </Grid>
              {(
                isUserRoleAccess.role.includes("Manager") ||
                isUserRoleCompare.includes("lassignapplypermission")) && (
                  <Grid item md={3} sm={6} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Access</Typography>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={Accessdrop}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                            },
                          },
                        }}
                        onChange={(e) => {
                          setAccesDrop(e.target.value);
                          setApplyPermission({
                            ...applypermission,
                            date: "",
                            todate: "",
                            shifttiming: ''
                          });
                        }}
                      >
                        <MenuItem value={"Employee"}>Self</MenuItem>
                        <MenuItem value={"HR"}>Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
            </Grid>
            <br />
            <Grid container spacing={2}>
              {Accessdrop === "HR" ? (
                <>
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
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
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter((comp) =>
                            valueCompanyCat?.includes(comp.company)
                          )
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
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
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Unit<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={accessbranch
                          ?.filter(
                            (comp) =>
                              valueCompanyCat?.includes(comp.company) &&
                              valueBranchCat?.includes(comp.branch)
                          )
                          ?.map((data) => ({
                            label: data.unit,
                            value: data.unit,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
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
                  <Grid item md={4} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        options={allTeam
                          ?.filter(
                            (u) =>
                              valueCompanyCat?.includes(u.company) &&
                              valueBranchCat?.includes(u.branch) &&
                              valueUnitCat?.includes(u.unit)
                          )
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
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={empnames
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
                            company: u.company,
                            branch: u.branch,
                            unit: u.unit,
                            team: u.team,
                          }))}
                        styles={colourStyles}
                        value={{
                          label: applypermission.employeename,
                          value: applypermission.employeename,
                        }}
                        onChange={(e) => {
                          // setApplyPermission({ ...applypermission, employeename: e.value, employeeid: e.empcode, reportingto: e.reportingto, date: formattedDate, shifttiming: e.shifttiming });
                          setApplyPermission({
                            ...applypermission, employeename: e.value, employeeid: e.empcode,
                            companyname: e.company,
                            branch: e.branch,
                            unit: e.unit,
                            team: e.team,
                            date: '',
                            applytype: 'Please Select Apply Type',
                            permissiontype: 'Hours', fromtime: '', requesthours: '', endtime: '', reasonforpermission: '',
                            reportingto: e.reportingto, shifttiming: '', time: '', shiftmode: '',
                          });
                          // fetchShift(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee ID </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={applypermission.employeeid}
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={isUserRoleAccess.companyname}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee ID </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={isUserRoleAccess.empcode}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  Date<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  {/* <OutlinedInput
                    id="component-outlined"
                    type="date"
                    value={applypermission.date}
                    onChange={(e) => {
                      if (
                        isUserRoleAccess?.role?.includes("Employee") &&
                        formattedDate <= e.target.value
                      ) {
                        setApplyPermission({
                          ...applypermission,
                          date: e.target.value,
                        });
                      } else if (
                        !isUserRoleAccess?.role?.includes("Employee")
                      ) {
                        setApplyPermission({
                          ...applypermission,
                          date: e.target.value,
                        });
                      }
                      fetchAttendanceCriterias(
                        Accessdrop === "HR" ? applypermission.employeeid : isUserRoleAccess.empcode,
                        e.target.value
                      );
                      setApplytype("Please Select ApplyType");
                      // fetchShiftuser(e.target.value);
                    }}
                    inputProps={{ max: maxDate, min: minDate }}
                  /> */}
                  <OutlinedInput
                    id="component-outlined"
                    type="date"
                    value={applypermission.date}
                    onChange={(e) => {
                      const selectedDate = e.target.value;

                      // Validate selected date
                      const selectedDateObj = new Date(selectedDate);
                      const minDateObj = new Date(minDate);
                      const maxDateObj = new Date(maxDate);

                      if (selectedDateObj < minDateObj || selectedDateObj > maxDateObj) {
                        // Show warning for invalid date
                        setPopupContentMalert(`Please enter a valid date between ${moment(minDate).format('DD-MM-YYYY')} and ${moment(maxDate).format('DD-MM-YYYY')}`);
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                        return; // Prevent invalid date selection
                      }

                      // If valid, update state
                      if (isUserRoleAccess?.role?.includes("Employee") && formattedDate <= e.target.value) {
                        setApplyPermission({ ...applypermission, date: e.target.value, });
                      } else if (!isUserRoleAccess?.role?.includes("Employee")) {
                        setApplyPermission({ ...applypermission, date: e.target.value, });
                      }

                      fetchAttendanceCriterias(
                        Accessdrop === "HR" ? applypermission.employeeid : isUserRoleAccess.empcode,
                        e.target.value,
                        Accessdrop === "HR" ? applypermission.branch : isUserRoleAccess.branch,
                      );
                      setApplytype("Please Select ApplyType");
                    }}
                    inputProps={{ max: maxDate, min: minDate }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Shift </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={
                      // Accessdrop === "HR" ? 
                      applypermission.shifttiming
                      // : isUserRoleAccess.shifttiming
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Apply Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 80,
                        },
                      },
                    }}
                    value={applytype}
                    onChange={(e) => {
                      if (applypermission.date === "") {
                        setPopupContentMalert("Please Select Date");
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                      } else {
                        setApplytype(e.target.value);
                        getTypeofHours(e.target.value);
                        // setApplyPermission({
                        //   ...applypermission, fromtime: e.target.value === "startshift"
                        //     ? (Accessdrop === "HR"
                        //       ? applypermission.shifttiming
                        //       : isUserRoleAccess.shifttiming)?.split("to")[0].replace(/AM|PM/g, "").padStart(5, "0")
                        //     : ""
                        // })
                        setApplyPermission({
                          ...applypermission, fromtime: e.target.value === "startshift"
                            ? applypermission.shifttiming?.split("to")[0].replace(/AM|PM/g, "").padStart(5, "0")
                            : ""
                        })
                      }

                    }}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="Please Select ApplyType" disabled>
                      {" "}
                      {"Please Select ApplyType"}{" "}
                    </MenuItem>
                    <MenuItem value="startshift"> {"Start Shift"} </MenuItem>
                    <MenuItem value="inbetween"> {"In Between"} </MenuItem>
                    <MenuItem value="endshift"> {"End Shift"} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Permission Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          width: 80,
                        },
                      },
                    }}
                    value={type}
                    onChange={(e) => {
                      settype(e.target.value);
                      setApplyPermission({
                        ...applypermission,
                        requesthours: "",
                        endtime: "",
                        finaltime: "00:00"
                      });
                    }}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {/* <MenuItem value="HalfDay"> {"Half Day"} </MenuItem> */}
                    {/* <MenuItem value="Hours"> {"Hours"} </MenuItem> */}
                    <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  From Time<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="time"
                    value={applypermission.fromtime}
                    onChange={(e) => {
                      getRequestFormat(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Typography>
                  Request Minutes<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={applypermission.requesthours}
                    onChange={(e) => {
                      getRequestHours(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Typography>HH:MM</Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    sx={userStyle.input}
                    value={applypermission.finaltime}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <Typography>
                  End Time<b style={{ color: "red" }}>*</b>
                </Typography>
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    id="component-outlined"
                    value={
                      applypermission.endtime == "Invalid Date" || undefined
                        ? ""
                        : applypermission.requesthours.length == 0
                          ? ""
                          : applypermission.endtime
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Reason for Permission<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    value={applypermission.reasonforpermission}
                    onChange={(e) => {
                      setApplyPermission({
                        ...applypermission,
                        reasonforpermission: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              {/* <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Reporting To </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={
                      Accessdrop === "HR"
                        ? applypermission.reportingto
                        : isUserRoleAccess.reportingto
                    }
                  />
                </FormControl>
              </Grid> */}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Timing </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={
                      Accessdrop === "HR" ? applypermission.time : getTiming
                    }
                  />
                </FormControl>
              </Grid>
              {/* </Grid>
            <Grid container spacing={1}> */}
              <Grid item lg={1} md={2} sm={2} xs={12} >
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                  {/* {isUserRoleCompare?.includes("aapplypermission") && ( */}
                  {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button> */}
                  <LoadingButton loading={btnSubmit} variant="contained" sx={buttonStyles.buttonsubmit} onClick={fetchPermissionHistory}>
                    Submit
                  </LoadingButton>
                  {/* )} */}
                </Box>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                  {/* {isUserRoleCompare?.includes("aapplypermission") && ( */}
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Box>
                {/* )} */}
              </Grid>
            </Grid>
          </>
        </Box>
      )}
      <br />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lapplypermission") && (
        <>
          {/* List Filter */}
          {(isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleCompare.includes("lassignapplypermission")) ?
            <>
              <Box sx={userStyle.selectcontainer}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Type<b style={{ color: "red" }}>*</b> </Typography>
                      <Selects
                        options={[
                          { label: "Individual", value: "Individual" },
                          { label: "Company", value: "Company" },
                          { label: "Branch", value: "Branch" },
                          { label: "Unit", value: "Unit" },
                          { label: "Team", value: "Team" },
                        ]}
                        styles={colourStyles}
                        value={{ label: filterUser.filtertype, value: filterUser.filtertype, }}
                        onChange={(e) => {
                          setFilterUser({ ...filterUser, filtertype: e.value });
                          setSelectedCompany([]);
                          setValueCompany([]);
                          setSelectedBranch([]);
                          setValueBranch([]);
                          setSelectedUnit([]);
                          setValueUnit([]);
                          setSelectedTeam([]);
                          setValueTeam([]);
                          setSelectedEmp([]);
                          setValueEmp([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                      <MultiSelect
                        options={accessbranch?.map(data => ({
                          label: data.company,
                          value: data.company,
                        })).filter((item, index, self) => {
                          return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                        })}
                        value={selectedCompany}
                        onChange={(e) => {
                          handleCompanyChangeFilter(e);
                        }}
                        valueRenderer={customValueRendererCompanyFilter}
                        labelledBy="Please Select Company"
                      />
                    </FormControl>
                  </Grid>
                  {["Individual", "Team"]?.includes(filterUser.filtertype) ? <>
                    {/* Branch Unit Team */}
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Branch<b style={{ color: "red" }}>*</b> </Typography>
                        <MultiSelect
                          options={accessbranch?.filter(
                            (comp) =>
                              valueCompany?.includes(comp.company)
                          )?.map(data => ({
                            label: data.branch,
                            value: data.branch,
                          })).filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                          value={selectedBranch}
                          onChange={handleBranchChangeFilter}
                          valueRenderer={customValueRendererBranchFilter}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Unit<b style={{ color: "red" }}>*</b></Typography>
                        <MultiSelect
                          options={accessbranch?.filter(
                            (comp) =>
                              valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                          )?.map(data => ({
                            label: data.unit,
                            value: data.unit,
                          })).filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                          value={selectedUnit}
                          onChange={handleUnitChangeFilter}
                          valueRenderer={customValueRendererUnitFilter}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
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
                          onChange={handleTeamChangeFilter}
                          valueRenderer={customValueRendererTeamFilter}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                  </>
                    : ["Branch"]?.includes(filterUser.filtertype) ?
                      <>
                        <Grid item md={3} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Branch<b style={{ color: "red" }}>*</b></Typography>
                            <MultiSelect
                              options={accessbranch?.filter(
                                (comp) =>
                                  valueCompany?.includes(comp.company)
                              )?.map(data => ({
                                label: data.branch,
                                value: data.branch,
                              })).filter((item, index, self) => {
                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                              })}
                              value={selectedBranch}
                              onChange={handleBranchChangeFilter}
                              valueRenderer={customValueRendererBranchFilter}
                              labelledBy="Please Select Branch"
                            />
                          </FormControl>
                        </Grid>
                      </>
                      :
                      ["Unit"]?.includes(filterUser.filtertype) ?
                        <>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography>Branch<b style={{ color: "red" }}>*</b></Typography>
                              <MultiSelect
                                options={accessbranch?.filter(
                                  (comp) =>
                                    valueCompany?.includes(comp.company)
                                )?.map(data => ({
                                  label: data.branch,
                                  value: data.branch,
                                })).filter((item, index, self) => {
                                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                })}
                                value={selectedBranch}
                                onChange={handleBranchChangeFilter}
                                valueRenderer={customValueRendererBranchFilter}
                                labelledBy="Please Select Branch"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                              <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                              <MultiSelect
                                options={accessbranch?.filter(
                                  (comp) =>
                                    valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                )?.map(data => ({
                                  label: data.unit,
                                  value: data.unit,
                                })).filter((item, index, self) => {
                                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                })}
                                value={selectedUnit}
                                onChange={handleUnitChangeFilter}
                                valueRenderer={customValueRendererUnitFilter}
                                labelledBy="Please Select Branch"
                              />
                            </FormControl>
                          </Grid>
                        </>
                        : ""
                  }
                  {["Individual"]?.includes(filterUser.filtertype) &&
                    <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee<b style={{ color: "red" }}>*</b> </Typography>
                        <MultiSelect
                          options={allUsersLimit?.filter(
                            (comp) =>
                              valueCompany?.includes(comp.company) && selectedBranch?.map(data => data.value)?.includes(comp.branch) && selectedUnit?.map(data => data.value)?.includes(comp.unit) && selectedTeam?.map(data => data.value)?.includes(comp.team)
                          )?.map(data => ({
                            label: data.companyname,
                            value: data.companyname,
                          })).filter((item, index, self) => {
                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                          })}
                          value={selectedEmp}
                          onChange={(e) => { handleEmployeeChangeFilter(e); }}
                          valueRenderer={customValueRendererEmpFilter}
                          labelledBy="Please Select Employee"
                        />
                      </FormControl>
                    </Grid>}
                  <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Apply Type<b style={{ color: "red" }}>*</b> </Typography>
                      <MultiSelect
                        options={applyTypeData}
                        value={selectedApplyType}
                        onChange={(e) => { handleApplyTypeChangeFilter(e); }}
                        valueRenderer={customValueRendererApplyTypeFilter}
                        labelledBy="Please Select Apply Type"
                      />
                    </FormControl>
                  </Grid>
                  {/* </Grid>
            <Grid container spacing={1}> */}
                  <Grid item lg={1} md={2} sm={2} xs={6} >
                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                      <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmitFilter} > Filter </Button>
                    </Box>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={6}>
                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                      <Button sx={buttonStyles.btncancel} onClick={handleClearFilter} > Clear </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box><br />
            </> : null}

          {applyleaveCheckHistory && (
            <Box sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}>
              <CircularProgress size="3rem" />
            </Box>
          )}
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Apply Permission List
              </Typography>
            </Grid>
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeAppPerm}
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
                    <MenuItem value={applyleaves?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelapplypermission") && (
                    <>
                      {/* <ExportXL csvData={applyData} fileName={fileName} /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvapplypermission") && (
                    <>
                      {/* <ExportCSV csvData={applyData} fileName={fileName} /> */}
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)

                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printapplypermission") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfapplypermission") && (
                    <>
                      {/* <Button
                        sx={userStyle.buttongrp}
                        onClick={() => downloadPdf()}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button> */}
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)

                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageapplypermission") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTableAppPerm}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPageAppPerm}
                  maindatas={permissions}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQueryAppPerm}
                  setSearchQuery={setSearchQueryAppPerm}
                  paginated={false}
                  totalDatas={permissions}
                />
              </Grid>
            </Grid>  <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAppPerm}> Manage Columns  </Button>&ensp;
            {isUserRoleCompare?.includes("bdapplypermission") && (<Button variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert}>Bulk Delete</Button>)}<br /><br />
            {applyleaveCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              </>
            ) : (
              <>
                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAppPerm} >
                  <AggridTable
                    rowDataTable={rowDataTable}
                    columnDataTable={columnDataTableAppPerm}
                    columnVisibility={columnVisibilityAppPerm}
                    page={pageAppPerm}
                    setPage={setPageAppPerm}
                    pageSize={pageSizeAppPerm}
                    totalPages={totalPagesAppPerm}
                    setColumnVisibility={setColumnVisibilityAppPerm}
                    isHandleChange={isHandleChange}
                    items={items}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    gridRefTable={gridRefTableAppPerm}
                    gridRefTableImg={gridRefImageAppPerm}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    itemsList={permissions}
                  />
                </Box>
              </>
            )}
          </Box>
        </>
      )}

      {/* Manage Column */}
      <Popover
        id={idAppPerm}
        open={isManageColumnsOpenAppPerm}
        anchorEl={anchorElAppPerm}
        onClose={handleCloseManageColumnsAppPerm}
        anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
        transformOrigin={{ vertical: 'center', horizontal: 'right', }}
      >
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsAppPerm}
          searchQuery={searchQueryManageAppPerm}
          setSearchQuery={setSearchQueryManageAppPerm}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityAppPerm}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityAppPerm}
          initialColumnVisibility={initialColumnVisibilityAppPerm}
          columnDataTable={columnDataTableAppPerm}
        />
      </Popover>

      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseModEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
        sx={{
          overflow: "scroll",
          "& .MuiPaper-root": {
            overflow: "scroll",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <>
            <form
            // onSubmit={editSubmit}
            >
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Edit Apply Permission
                  </Typography>
                </Grid>
                {(isUserRoleAccess.role.includes("Manager") ||
                  isUserRoleCompare.includes("lassignapplypermission")) && (
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Access</Typography>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={AccessdropEdit}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                              },
                            },
                          }}
                          onChange={(e) => {
                            setAccesDropEdit(e.target.value);
                            setBranchOptions([]);
                            setUnitOptions([]);
                            setTeamOptions([]);
                            setUserOptions([]);
                            if (e.target.value === "HR") {
                              setPermissionEdit({
                                ...permissionedit,
                                shifttiming: "",
                                time: "",
                                shiftmode: "",
                                reportingto: "",
                                date: "",
                                companyname: "Please Select Company Name",
                                branch: "Please Select Branch ",
                                unit: "Please Select Unit",
                                team: "Please Select Team",
                                employeename: "Please Select Employee Name",
                                employeeid: "",
                              });
                            } else {
                              setPermissionEdit({
                                ...permissionedit,
                                date: permissionSelf.date,
                                shifttiming: isUserRoleAccess.shifttiming,
                                time: getTiming,
                                shiftmode: getShiftMode,
                                reportingto: isUserRoleAccess.reportingto,
                                employeename: isUserRoleAccess.companyname,
                                employeeid: isUserRoleAccess.empcode,
                              });
                            }
                          }}
                        >
                          <MenuItem value={"Employee"}>Self</MenuItem>
                          <MenuItem value={"HR"}>Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
              </Grid>
              <br />
              <Grid container spacing={2}>
                {AccessdropEdit === "HR" ? (
                  <>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={companyOption}
                          value={selectedOptionsCompanyEdit}
                          onChange={(e) => {
                            handleCompanyChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererCompanyEdit}
                          labelledBy="Please Select Company"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={branchOption
                            ?.filter((u) =>
                              valueCompanyCatEdit?.includes(u.company)
                            )
                            .map((u) => ({
                              ...u,
                              label: u.name,
                              value: u.name,
                            }))}
                          value={selectedOptionsBranchEdit}
                          onChange={(e) => {
                            handleBranchChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererBranchEdit}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={unitOption
                            ?.filter((u) =>
                              valueBranchCatEdit?.includes(u.branch)
                            )
                            .map((u) => ({
                              ...u,
                              label: u.name,
                              value: u.name,
                            }))}
                          value={selectedOptionsUnitEdit}
                          onChange={(e) => {
                            handleUnitChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererUnitEdit}
                          labelledBy="Please Select Unit"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={teamOption
                            ?.filter((u) => valueUnitCatEdit?.includes(u.unit))
                            .map((u) => ({
                              ...u,
                              label: u.teamname,
                              value: u.teamname,
                            }))}
                          value={selectedOptionsTeamEdit}
                          onChange={(e) => {
                            handleTeamChangeEdit(e);
                          }}
                          valueRenderer={customValueRendererTeamEdit}
                          labelledBy="Please Select Team"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={empnamesEdit
                            ?.filter(
                              (u) =>
                                valueCompanyCatEdit?.includes(u.company) &&
                                valueBranchCatEdit?.includes(u.branch) &&
                                valueUnitCatEdit?.includes(u.unit) &&
                                valueTeamCatEdit?.includes(u.team)
                            )
                            .map((u) => ({
                              ...u,
                              label: u.companyname,
                              value: u.companyname,
                            }))}
                          styles={colourStyles}
                          value={{
                            label: permissionedit?.employeename,
                            value: permissionedit?.employeename,
                          }}
                          onChange={(e) => {
                            fetchShiftEdit(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee ID </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={permissionedit.employeeid}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee Name</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={permissionedit?.employeename}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee ID </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={permissionedit?.employeeid}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Apply Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={applytypeEdit}
                      onChange={async (e) => {
                        setApplytypeEdit(e.target.value);
                        // await fetchShiftuser();
                        getTypeofHoursEdit(e.target.value);
                        setPermissionEdit({
                          ...permissionedit, fromtime: e.target.value === "startshift"
                            ? permissionedit.shifttiming?.split("to")[0].replace(/AM|PM/g, "").padStart(5, "0")
                            : ""
                        })
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="Please Select ApplyType" disabled>
                        {" "}
                        {"Please Select ApplyType"}{" "}
                      </MenuItem>
                      <MenuItem value="startshift">
                        {" "}
                        {"Start Shift"}{" "}
                      </MenuItem>
                      <MenuItem value="inbetween"> {"In Between"} </MenuItem>
                      <MenuItem value="endshift"> {"End Shift"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Permission Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={leaveEdit}
                      onChange={(e) => {
                        setLeaveEdit(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      {/* <MenuItem value="HalfDay"> {"Half Day"} </MenuItem> */}
                      {/* <MenuItem value="Hours"> {"Hours"} </MenuItem> */}
                      <MenuItem value="Minutes"> {"Minutes"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={permissionedit.date}
                      min={
                        isUserRoleAccess?.role?.includes("Employee")
                          ? formattedDate
                          : undefined
                      }
                      onChange={(e) => {
                        if (
                          isUserRoleAccess?.role?.includes("Employee") &&
                          formattedDate <= e.target.value
                        ) {
                          setPermissionEdit({
                            ...permissionedit,
                            date: e.target.value,
                          });
                        } else if (
                          !isUserRoleAccess?.role?.includes("Employee")
                        ) {
                          setPermissionEdit({
                            ...permissionedit,
                            date: e.target.value,
                          });
                        }
                        setPermissionEdit({
                          ...permissionedit,
                          date: e.target.value,
                        });
                      }}
                      inputProps={{ max: maxDate, min: minDate }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Shift </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={
                        // AccessdropEdit === "HR" ?
                        permissionedit.shifttiming
                        // : isUserRoleAccess.shifttiming
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    From Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="time"
                      value={permissionedit.fromtime}
                      onChange={(e) => {
                        getRequestFormatEdit(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <Typography>
                    Request Minutes<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={permissionedit.requesthours}
                      onChange={(e) => {
                        getRequestHoursEdit(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <Typography>HH:MM</Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      sx={userStyle.input}
                      value={permissionedit.finaltime}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    End Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      value={
                        permissionedit.endtime === "Invalid Date" ||
                          permissionedit.endtime === undefined
                          ? ""
                          : permissionedit.requesthours.length === 0
                            ? ""
                            : permissionedit.endtime
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason for Permission<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={permissionedit.reasonforpermission}
                      onChange={(e) => {
                        setPermissionEdit({
                          ...permissionedit,
                          reasonforpermission: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Reporting To </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={
                        AccessdropEdit === "HR"
                          ? permissionedit.reportingto
                          : isUserRoleAccess.reportingto
                      }
                    />
                  </FormControl>
                </Grid> */}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Timing </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={
                        AccessdropEdit === "HR"
                          ? permissionedit.time
                          : getTiming
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={6} sm={6}>
                  <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                    Update
                  </Button>
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEdit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
              {/* </DialogContent> */}
            </form>
          </>
        </Box>
      </Dialog>

      {/* Compensation Model */}
      <Dialog
        open={isCompensationOpen}
        onClose={handleCloseModCompensation}
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
            <form >
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}> Compensation </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Compensation Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Select
                      fullWidth
                      labelId="demo-select-small"
                      id="demo-select-small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 80,
                          },
                        },
                      }}
                      value={applypermission.compensationapplytype}
                      onChange={(e) => { setApplyPermission({ ...applypermission, compensationapplytype: e.target.value }); }}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="startshift"> {"Start Shift"} </MenuItem>
                      <MenuItem value="endshift"> {"End Shift"} </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={6} sm={6}>
                  <Button variant="contained" onClick={(e) => {
                    handleCloseModCompensation();
                    setCompensationValue(true)
                  }}
                  > Ok </Button>
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <Button
                    sx={userStyle.btncancel}
                    onClick={(e) => {
                      setApplyPermission({ ...applypermission, compensationapplytype: '' });
                      handleCloseModCompensation();
                      setCompensationValue(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
              {/* </DialogContent> */}
            </form>
          </>
        </Box>
      </Dialog>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleCloseview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg" sx={{ marginTop: '95px' }}
      >
        <Box sx={{ padding: "20px" }}>
          <>
            <form
            // onSubmit={editSubmit}
            >
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    View Apply Permission
                  </Typography>
                </Grid>
                {(isUserRoleAccess.role.includes("Manager") ||
                  isUserRoleCompare.includes("lassignapplypermission")) && (
                    <Grid item md={3} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Access</Typography>

                        <OutlinedInput
                          value={AccessdropEdit === "HR" ? "Other" : "Self"}
                        />
                      </FormControl>
                    </Grid>
                  )}
              </Grid>
              <br />
              <Grid container spacing={2}>
                {AccessdropEdit === "HR" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput value={permissionedit.companyname} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput value={permissionedit.branch} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput readOnly value={permissionedit.unit} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Team<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput readOnly value={permissionedit.team} />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          readOnly
                          value={permissionedit.employeename}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee ID </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          readOnly
                          type="text"
                          value={permissionedit.employeeid}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee Name</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly
                          value={permissionedit.employeename}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee ID </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          readOnly
                          value={permissionedit.employeeid}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={permissionedit.date}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Shift </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={permissionedit.shifttiming}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Apply Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput value={applytypeEdit} readOnly />
                  </FormControl>
                </Grid>
                {permissionedit.compensationstatus === 'Compensation' ? (
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Compensation Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput value={permissionedit.compensationapplytype} readOnly />
                    </FormControl>
                  </Grid>
                ) : null}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Permission Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput value={leaveEdit} />
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    From Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="time"
                      value={permissionedit.fromtime}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Request Minutes<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      value={permissionedit.requesthours}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    End Time<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      value={
                        permissionedit.endtime == "Invalid Date" || undefined
                          ? ""
                          : permissionedit.endtime
                      }
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason for Permission<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={permissionedit.reasonforpermission}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Reporting To </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={permissionedit.reportingto}
                    />
                  </FormControl>
                </Grid> */}
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Timing </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={permissionedit.time}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={6} sm={6}>
                  <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseview}>
                    Back
                  </Button>
                </Grid>
              </Grid>
              {/* </DialogContent> */}
            </form>
          </>
        </Box>
      </Dialog>

      {/* dialog status change */}
      <Box>
        <Dialog
          maxWidth="lg"
          open={statusOpen}
          onClose={handleStatusClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
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
                <Typography sx={userStyle.HeaderText}>
                  Edit Apply Status
                </Typography>
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
                    value={{
                      label: selectStatus.status,
                      value: selectStatus.value,
                    }}
                    onChange={(e) => {
                      setSelectStatus({ ...selectStatus, status: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} sm={6} xs={12}></Grid>
              <Grid item md={12} sm={12} xs={12}>
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
                        setSelectStatus({
                          ...selectStatus,
                          rejectedreason: e.target.value,
                        });
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
              // style={{
              //   padding: "7px 13px",
              //   color: "white",
              //   background: "rgb(25, 118, 210)",
              // }}
              sx={buttonStyles.buttonsubmit}
              // onClick={() => {
              //   editStatus();
              //   // handleCloseerrpop();
              // }}
              onClick={() => fetchPermissionHistoryUpdate(selectStatus.employeeid, selectStatus.employeename, selectStatus.date)}
            >
              Update
            </Button>
            <Button
              // style={{
              //   backgroundColor: "#f4f4f4",
              //   color: "#444",
              //   boxShadow: "none",
              //   borderRadius: "3px",
              //   padding: "7px 13px",
              //   border: "1px solid #0000006b",
              //   "&:hover": {
              //     "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
              //       backgroundColor: "#f4f4f4",
              //     },
              //   },
              // }}
              sx={buttonStyles.btncancel}
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

      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
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
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        <Dialog open={isEditOpenCheckList} onClose={handleCloseModEditCheckList} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl" fullWidth={true} sx={{
          overflow: 'visible',
          '& .MuiPaper-root': {
            overflow: 'auto',
          },
          marginTop: '50px'
        }}>
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.SubHeaderText} onClick={() => { console.log(groupDetails); console.log(assignDetails); console.log(datasAvailedDB); console.log(isCheckedList) }}>
                My Check List
              </Typography>
              <br />
              <br />
              <Grid container spacing={2} >
                <Grid item md={12} xs={12} sm={12} >
                  <FormControl fullWidth size="small" sx={{ display: 'flex', justifyContent: 'center', border: '1px solid black', borderRadius: '20px' }} >
                    <Typography sx={{ fontSize: '1rem', textAlign: 'center' }} onClick={() => { console.log(dateValueRandom); console.log(timeValueRandom) }}>
                      Employee Name: <span style={{ fontWeight: '500', fontSize: '1.2rem', display: 'inline-block', textAlign: 'center' }}> {`${getDetails?.employeename}`}</span>
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead >
                    <TableRow>

                      <TableCell style={{ fontSize: '1.2rem' }}>
                        <Checkbox onChange={() => { overallCheckListChange() }} checked={isCheckedListOverall} />
                      </TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Details</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Field</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Allotted To</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Completed By</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Completed At</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Status</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Action</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Category</TableCell>
                      <TableCell style={{ fontSize: '1.2rem' }}>Sub Category</TableCell>


                      {/* Add more table headers as needed */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupDetails?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ fontSize: '1.2rem' }}>
                          <Checkbox onChange={() => { handleCheckboxChange(index) }} checked={isCheckedList[index]} />
                        </TableCell>

                        <TableCell>{row.details}</TableCell>
                        {
                          (() => {
                            switch (row.checklist) {
                              case "Text Box":

                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    // disabled={disableInput[index]}
                                    onChange={(e) => {
                                      handleDataChange(e, index, "Text Box")
                                    }}
                                  />
                                </TableCell>;
                              case "Text Box-number":
                                return <TableCell>
                                  <Input value={row.data}
                                    style={{ height: '32px' }}
                                    type="number"

                                    onChange={(e) => {

                                      handleDataChange(e, index, "Text Box-number")


                                    }}
                                  />
                                </TableCell>;
                              case "Text Box-alpha":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[a-zA-Z]*$/.test(inputValue)) {
                                        handleDataChange(e, index, "Text Box-alpha")
                                      }
                                    }}

                                  />
                                </TableCell>;
                              case "Text Box-alphanumeric":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    value={row.data}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                        handleDataChange(e, index, "Text Box-alphanumeric")
                                      }
                                    }}
                                    inputProps={{ pattern: '[A-Za-z0-9]*' }}
                                  />
                                </TableCell>;
                              case "Attachments":
                                return <TableCell>
                                  <div>
                                    <InputLabel sx={{ m: 1 }}>File</InputLabel>


                                    <div>

                                      <Box
                                        sx={{ display: "flex", marginTop: "10px", gap: "10px" }}
                                      >

                                        <Box item md={4} sm={4}>
                                          <section>
                                            <input
                                              type="file"
                                              accept="*/*"
                                              id={index}
                                              onChange={(e) => {
                                                handleChangeImage(e, index);

                                              }}
                                              style={{ display: 'none' }}
                                            />
                                            <label htmlFor={index}>
                                              <Typography sx={userStyle.uploadbtn}>Upload</Typography>
                                            </label>
                                            <br />
                                          </section>
                                        </Box>

                                        <Box item md={4} sm={4}>
                                          <Button
                                            onClick={showWebcam}
                                            variant="contained"
                                            sx={userStyle.uploadbtn}
                                          >
                                            <CameraAltIcon />
                                          </Button>
                                        </Box>


                                      </Box>
                                      {row.files && <Grid container spacing={2}>
                                        <Grid item lg={8} md={8} sm={8} xs={8}>
                                          <Typography>{row.files.name}</Typography>
                                        </Grid>
                                        <Grid item lg={1.5} md={1} sm={1} xs={1} sx={{ cursor: 'pointer' }} onClick={() => renderFilePreviewEdit(row.files)}>
                                          <VisibilityOutlinedIcon
                                            style={{
                                              fontsize: "large",
                                              color: "#357AE8",
                                              cursor: "pointer",
                                            }}

                                          />
                                        </Grid>
                                        <Grid item lg={1} md={1} sm={1} xs={1}>
                                          <Button
                                            style={{
                                              fontsize: "large",
                                              color: "#357AE8",
                                              cursor: "pointer",
                                              marginTop: "-5px",
                                            }}
                                            onClick={() => handleFileDeleteEdit(index)}
                                          >
                                            <DeleteIcon />
                                          </Button>
                                        </Grid>
                                      </Grid>}

                                    </div>
                                    <Dialog
                                      open={isWebcamOpen}
                                      onClose={webcamClose}
                                      aria-labelledby="alert-dialog-title"
                                      aria-describedby="alert-dialog-description"
                                    >
                                      <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
                                        <Webcamimage
                                          getImg={getImg}
                                          setGetImg={setGetImg}
                                          capturedImages={capturedImages}
                                          valNum={valNum}
                                          setValNum={setValNum}
                                          name={name}
                                        />
                                      </DialogContent>
                                      <DialogActions>
                                        <Button
                                          variant="contained"
                                          color="success"
                                          onClick={webcamDataStore}
                                        >
                                          OK
                                        </Button>
                                        <Button variant="contained" color="error" onClick={webcamClose}>
                                          CANCEL
                                        </Button>
                                      </DialogActions>
                                    </Dialog>

                                  </div>


                                </TableCell>;
                              case "Pre-Value":
                                return <TableCell><Typography>{row?.data}</Typography>
                                </TableCell>;
                              case "Date":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type='date'
                                    value={row.data}
                                    onChange={(e) => {

                                      handleDataChange(e, index, "Date")

                                    }}
                                  />
                                </TableCell>;
                              case "Time":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type='time'
                                    value={row.data}
                                    onChange={(e) => {

                                      handleDataChange(e, index, "Time")

                                    }}
                                  />
                                </TableCell>;
                              case "DateTime":
                                return <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type='date'
                                      value={dateValue[index]}
                                      onChange={(e) => {
                                        updateDateValuesAtIndex(e.target.value, index)


                                      }}
                                    />
                                    <OutlinedInput
                                      type='time'
                                      style={{ height: '32px' }}
                                      value={timeValue[index]}
                                      onChange={(e) => {
                                        updateTimeValuesAtIndex(e.target.value, index);

                                      }}
                                    />
                                  </Stack>
                                </TableCell>;
                              case "Date Multi Span":
                                return <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type='date'
                                      value={dateValueMultiFrom[index]}
                                      onChange={(e) => {
                                        updateFromDateValueAtIndex(e.target.value, index)


                                      }}
                                    />
                                    <OutlinedInput
                                      type='date'
                                      style={{ height: '32px' }}
                                      value={dateValueMultiTo[index]}
                                      onChange={(e) => {
                                        updateToDateValueAtIndex(e.target.value, index)


                                      }}
                                    />
                                  </Stack>
                                </TableCell>;
                              case "Date Multi Span Time":
                                return <TableCell>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type='date'
                                        value={firstDateValue[index]}
                                        onChange={(e) => {
                                          updateFirstDateValuesAtIndex(e.target.value, index)


                                        }}
                                      />
                                      <OutlinedInput
                                        type='time'
                                        style={{ height: '32px' }}
                                        value={firstTimeValue[index]}
                                        onChange={(e) => {
                                          updateFirstTimeValuesAtIndex(e.target.value, index);


                                        }}
                                      />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>

                                      <OutlinedInput
                                        type='date'
                                        style={{ height: '32px' }}
                                        value={secondDateValue[index]}
                                        onChange={(e) => {
                                          updateSecondDateValuesAtIndex(e.target.value, index)


                                        }}
                                      />
                                      <OutlinedInput
                                        style={{ height: '32px' }}
                                        type='time'
                                        value={secondTimeValue[index]}
                                        onChange={(e) => {
                                          updateSecondTimeValuesAtIndex(e.target.value, index);


                                        }}
                                      />
                                    </Stack>
                                  </div>

                                </TableCell>;
                              case "Date Multi Random":
                                return <TableCell>
                                  <OutlinedInput
                                    style={{ height: '32px' }}
                                    type='date'
                                    value={row.data}
                                    onChange={(e) => {

                                      handleDataChange(e, index, "Date Multi Random")

                                    }}
                                  />
                                </TableCell>;
                              case "Date Multi Random Time":
                                return <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: '32px' }}
                                      type='date'
                                      value={dateValueRandom[index]}
                                      onChange={(e) => {
                                        updateDateValueAtIndex(e.target.value, index)


                                      }}
                                    />
                                    <OutlinedInput
                                      type='time'
                                      style={{ height: '32px' }}
                                      value={timeValueRandom[index]}
                                      onChange={(e) => {
                                        updateTimeValueAtIndex(e.target.value, index);


                                      }}
                                    />
                                  </Stack>
                                </TableCell>;
                              case "Radio":
                                return <TableCell>
                                  <FormControl component="fieldset">
                                    <RadioGroup value={row.data} sx={{ display: 'flex', flexDirection: 'row !important' }} onChange={(e) => {
                                      handleDataChange(e, index, "Radio")
                                    }}>
                                      <FormControlLabel value="No" control={<Radio />} label="No" />
                                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />

                                    </RadioGroup>
                                  </FormControl>
                                </TableCell>;

                              default:
                                return <TableCell></TableCell>; // Default case
                            }
                          })()
                        }
                        <TableCell><span>
                          {row?.employee && row?.employee?.map((data, index) => (
                            <Typography key={index} variant="body1">{`${index + 1}.${data}, `}</Typography>
                          ))}
                        </span></TableCell>
                        <TableCell>
                          <Typography>{row?.completedby}</Typography>
                        </TableCell>
                        <TableCell>{row.completedat && moment(row.completedat).format("DD-MM-YYYY hh:mm:ss A")}</TableCell>
                        <TableCell>
                          {row.checklist === "DateTime" ?
                            (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                              <Typography>Completed</Typography>
                              : <Typography>Pending</Typography>
                            : row.checklist === "Date Multi Span" ?
                              (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21) ?
                                <Typography>Completed</Typography>
                                : <Typography>Pending</Typography>
                              : row.checklist === "Date Multi Span Time" ?
                                (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33) ?
                                  <Typography>Completed</Typography>
                                  : <Typography>Pending</Typography>
                                : row.checklist === "Date Multi Random Time" ?
                                  (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                    <Typography>Completed</Typography>
                                    : <Typography>Pending</Typography>
                                  : ((row.data !== undefined && row.data !== "") || (row.files !== undefined)) ?
                                    <Typography>Completed</Typography>
                                    : <Typography>Pending</Typography>
                          }
                        </TableCell>

                        <TableCell>
                          {row.checklist === "DateTime" ?
                            (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                              <>
                                <IconButton
                                  sx={{ color: 'green', cursor: 'pointer' }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                              : <IconButton
                                sx={{ color: '#1565c0', cursor: 'pointer' }}
                                onClick={() => {
                                  let itemValue = disableInput[index];
                                  itemValue = false;
                                  let spreadData = [...disableInput];
                                  spreadData[index] = false;
                                  setDisableInput(spreadData);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            : row.checklist === "Date Multi Span" ?
                              (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21) ?
                                <>
                                  <IconButton
                                    sx={{ color: 'green', cursor: 'pointer' }}
                                    onClick={() => {
                                      updateIndividualData(index);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </>
                                : <IconButton
                                  sx={{ color: '#1565c0', cursor: 'pointer' }}
                                  onClick={() => {
                                    let itemValue = disableInput[index];
                                    itemValue = false;
                                    let spreadData = [...disableInput];
                                    spreadData[index] = false;
                                    setDisableInput(spreadData);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              : row.checklist === "Date Multi Span Time" ?
                                (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33) ?
                                  <>
                                    <IconButton
                                      sx={{ color: 'green', cursor: 'pointer' }}
                                      onClick={() => {
                                        updateIndividualData(index);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  </>
                                  : <IconButton
                                    sx={{ color: '#1565c0', cursor: 'pointer' }}
                                    onClick={() => {
                                      let itemValue = disableInput[index];
                                      itemValue = false;
                                      let spreadData = [...disableInput];
                                      spreadData[index] = false;
                                      setDisableInput(spreadData);
                                    }}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                : row.checklist === "Date Multi Random Time" ?
                                  (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                    <>
                                      <IconButton
                                        sx={{ color: 'green', cursor: 'pointer' }}
                                        onClick={() => {
                                          updateIndividualData(index);
                                        }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                    : <IconButton
                                      sx={{ color: '#1565c0', cursor: 'pointer' }}
                                      onClick={() => {
                                        let itemValue = disableInput[index];
                                        itemValue = false;
                                        let spreadData = [...disableInput];
                                        spreadData[index] = false;
                                        setDisableInput(spreadData);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  : ((row.data !== undefined && row.data !== "") || (row.files !== undefined)) ?
                                    <>
                                      <IconButton
                                        sx={{ color: 'green', cursor: 'pointer' }}
                                        onClick={() => {
                                          updateIndividualData(index);
                                        }}
                                      >
                                        <CheckCircleIcon />
                                      </IconButton>
                                    </>
                                    : <IconButton
                                      sx={{ color: '#1565c0', cursor: 'pointer' }}
                                      onClick={() => {
                                        let itemValue = disableInput[index];
                                        itemValue = false;
                                        let spreadData = [...disableInput];
                                        spreadData[index] = false;
                                        setDisableInput(spreadData);
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                          }
                        </TableCell>

                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.subcategory}</TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1} sm={1}></Grid>
                <Button variant="contained" onClick={handleCheckListSubmit}>
                  Submit
                </Button>
                <Grid item md={1} sm={1}></Grid>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEditCheckList}>
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>

      {/* Submit History Popup */}
      <Dialog
        open={isOpenHistory}
        onClose={handleCloseModHistory}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: "95px", }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Employee Permission History</Typography><br /><br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Employee Name:&ensp;
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "1.2rem",
                        display: "inline-block",
                      }}
                    >{selectedEmpData?.employeename}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Employee ID:&ensp;
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "1.2rem",
                        display: "inline-block",
                      }}
                    >{selectedEmpData?.employeeid}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
            </Grid><br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Overall</Typography><br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Applied Count</b></TableCell>
                        <TableCell><b>Approved Count</b></TableCell>
                        <TableCell><b>Rejected Count</b></TableCell>
                        <TableCell><b>Late - ClockIn Count</b></TableCell>
                        <TableCell><b>Early - ClockOut Count</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyOverAllData.length > 0 ? (
                        historyOverAllData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.appliedCount || 0}</TableCell>
                            <TableCell>{row?.approvedCount || 0}</TableCell>
                            <TableCell>{row?.rejectedCount || 0}</TableCell>
                            <TableCell>{row?.lateClockinCount || 0}</TableCell>
                            <TableCell>{row?.earlyClockoutCount || 0}</TableCell>
                          </TableRow>
                        ))) : <TableRow><TableCell colSpan={4} align="center">No Data Available</TableCell> </TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid><br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Month</Typography><br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Applied Count</b></TableCell>
                        <TableCell><b>Approved Count</b></TableCell>
                        <TableCell><b>Rejected Count</b></TableCell>
                        <TableCell><b>Late - ClockIn Count</b></TableCell>
                        <TableCell><b>Early - ClockOut Count</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyMonthData.length > 0 ? (
                        historyMonthData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.appliedCount || 0}</TableCell>
                            <TableCell>{row?.approvedCount || 0}</TableCell>
                            <TableCell>{row?.rejectedCount || 0}</TableCell>
                            <TableCell>{row?.lateClockinCount || 0}</TableCell>
                            <TableCell>{row?.earlyClockoutCount || 0}</TableCell>
                          </TableRow>
                        ))) : <TableRow><TableCell colSpan={4} align="center">No Data Available</TableCell> </TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid><br />
            <Grid container spacing={2}>
              <Grid item md={1} sm={1}>
                <Button sx={buttonStyles.buttonsubmit} onClick={() => { setBtnSubmit(true); sendRequest(); }}>Ok</Button>
              </Grid>
              <Grid item md={1} sm={1}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseModHistory}>Cancel</Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Update History Popup */}
      <Dialog
        open={isOpenHistoryUpdate}
        onClose={handleCloseModHistoryUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: "95px", }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>Employee Permission History</Typography><br /><br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Employee Name:&ensp;
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "1.2rem",
                        display: "inline-block",
                      }}
                    >{selectedEmpDataUpdate?.employeename}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">
                    Employee ID:&ensp;
                    <span
                      style={{
                        fontWeight: "500",
                        fontSize: "1.2rem",
                        display: "inline-block",
                      }}
                    >{selectedEmpDataUpdate?.employeeid}
                    </span>
                  </Typography>
                </FormControl>
              </Grid>
            </Grid><br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Overall</Typography><br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Applied Count</b></TableCell>
                        <TableCell><b>Approved Count</b></TableCell>
                        <TableCell><b>Rejected Count</b></TableCell>
                        <TableCell><b>Late - ClockIn Count</b></TableCell>
                        <TableCell><b>Early - ClockOut Count</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyOverAllDataUpdate.length > 0 ? (
                        historyOverAllDataUpdate.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.appliedCount || 0}</TableCell>
                            <TableCell>{row?.approvedCount || 0}</TableCell>
                            <TableCell>{row?.rejectedCount || 0}</TableCell>
                            <TableCell>{row?.lateClockinCount || 0}</TableCell>
                            <TableCell>{row?.earlyClockoutCount || 0}</TableCell>
                          </TableRow>
                        ))) : <TableRow><TableCell colSpan={4} align="center">No Data Available</TableCell> </TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid><br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <Typography sx={userStyle.HeaderText}>Month</Typography><br />
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Applied Count</b></TableCell>
                        <TableCell><b>Approved Count</b></TableCell>
                        <TableCell><b>Rejected Count</b></TableCell>
                        <TableCell><b>Late - ClockIn Count</b></TableCell>
                        <TableCell><b>Early - ClockOut Count</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyMonthDataUpdate.length > 0 ? (
                        historyMonthDataUpdate.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.appliedCount || 0}</TableCell>
                            <TableCell>{row?.approvedCount || 0}</TableCell>
                            <TableCell>{row?.rejectedCount || 0}</TableCell>
                            <TableCell>{row?.lateClockinCount || 0}</TableCell>
                            <TableCell>{row?.earlyClockoutCount || 0}</TableCell>
                          </TableRow>
                        ))) : <TableRow><TableCell colSpan={4} align="center">No Data Available</TableCell> </TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid><br />
            <Grid container spacing={2}>
              <Grid item md={1} sm={1}>
                <Button sx={buttonStyles.buttonsubmit} onClick={editStatus}>Ok</Button>
              </Grid>
              <Grid item md={1} sm={1}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseModHistoryUpdate}>Cancel</Button>
              </Grid>
            </Grid>
          </>
        </Box>
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
            sx={{ width: "450px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={handleCloseerr}>
              Close
            </Button>
            <Button variant="contained" color="error" onClick={sendEditStatus}>
              ok
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
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={permissions ?? []}
        filename={"Apply Permission"}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Apply Permission Info"
        addedby={addedby}
        updateby={updateby}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delApply}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delApplycheckbox}
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

export default ApplyPermission;