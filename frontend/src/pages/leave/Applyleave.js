import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, Tooltip, Typography, CircularProgress } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiInput from "@mui/material/Input";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint, FaSearch, } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import ResizeObserver from "resize-observer-polyfill";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import ManageColumnsContent from "../../components/ManageColumn";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AdvancedSearchBar from "../../components/SearchbarEbList";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import Webcamimage from "../hr/webcamprofile";
window.ResizeObserver = ResizeObserver;

const Input = styled(MuiInput)(({ theme }) => ({
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    display: "none !important",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

const customStyles = {
  menu: (provided) => ({
    ...provided,
    maxHeight: "100px",
    overflowY: "auto",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "100px",
    overflowY: "auto",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: "4px",
    },
  }),
};

function Applyleave() {

  const gridRefTableApplyLeave = useRef(null);
  const gridRefImageApplyLeave = useRef(null);

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const [Accessdrop, setAccesDrop] = useState("Employee");
  const [AccessdropEdit, setAccesDropEdit] = useState("Employee");

  const [appleave, setAppleave] = useState({
    employeename: "Please Select Employee Name",
    employeeid: "",
    leavetype: "Please Select LeaveType",
    date: "",
    todate: "",
    reasonforleave: "",
    reportingto: "",
    department: "",
    designation: "",
    doj: "", company: "",
    branch: "",
    unit: "",
    team: "",
    availabledays: "",
    durationtype: "Random",
    boardingLog: "",
    workmode: "",
  });

  const [appleaveEdit, setAppleaveEdit] = useState([]);
  const [selectStatus, setSelectStatus] = useState({});
  const [isApplyLeave, setIsApplyLeave] = useState([]);

  const [applyleaves, setApplyleaves] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [leaveId, setLeaveId] = useState("");
  const [allApplyleaveedit, setAllApplyleaveedit] = useState([]);
  const [relatedCountEdit, setRelatedCountEdit] = useState(0);
  const [selectedValue, setSelectedValue] = useState([]);

  const [leave, setLeave] = useState("Please Select LeaveType");
  const [leaveEdit, setLeaveEdit] = useState("Please Select LeaveType");

  const [tookLeaveDaysWithAllUsers, setTookLeaveDaysWithAllUsers] = useState([]);
  const [leaveCriteriaApplyDays, setLeaveCriteriaApplyDays] = useState('');
  const [leaveCriteriaLopDays, setLeaveCriteriaLopDays] = useState('');

  const {
    isUserRoleCompare,
    allProjects,
    isUserRoleAccess,
    isAssignBranch,
    allTeam,
    pageName,
    setPageName,
    buttonStyles, allUsersLimit,
  } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);

  const [applyleaveCheck, setApplyleavecheck] = useState(false);
  const [applyleaveCheckHistory, setApplyleavecheckHistory] = useState(false);
  const [btnSubmit, setBtnSubmit] = useState(false);

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
  const [selectedLeaveType, setSelectedLeaveType] = useState([]);
  const [valueLeaveType, setValueLeaveType] = useState([]);
  const [filterUser, setFilterUser] = useState({ filtertype: "Individual" });

  // State to track advanced filter
  const [advancedFilter, setAdvancedFilter] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [filteredDataItems, setFilteredDataItems] = useState(applyleaves);
  const [filteredRowData, setFilteredRowData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);

  const [statusOpen, setStatusOpen] = useState(false);
  const handleStatusOpen = () => {
    setStatusOpen(true);
  };
  const handleStatusClose = () => {
    setStatusOpen(false);
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

  //Datatable
  const [pageApplyLeave, setPageApplyLeave] = useState(1);
  const [pageSizeApplyLeave, setPageSizeApplyLeave] = useState(10);
  const [searchQueryApplyLeave, setSearchQueryApplyLeave] = useState("");
  const [totalPagesApplyLeave, setTotalPagesApplyLeave] = useState(1);

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
    setBtnSubmit(false);
  };

  const [isErrorOpenForTookLeaveCheck, setIsErrorOpenForTookLeaveCheck] =
    useState(false);
  const handleClickOpenerrForTookLeaveCheck = () => {
    setIsErrorOpenForTookLeaveCheck(true);
  };
  const handleCloseerrForTookLeaveCheck = () => {
    setIsErrorOpenForTookLeaveCheck(false);
    setAppleave({
      ...appleave,
      employeename: "Please Select Employee Name",
      employeeid: "",
      leavetype: "Please Select LeaveType",
      durationtype: "Random",
      availabledays: "",
      date: "",
      todate: "", company: "",
      branch: "",
      unit: "",
      team: "",
      reasonforleave: "",
      reportingto: "",
      noofshift: "",
    });
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Update model
  const [isDeleteOpenUpdateStatus, setIsDeleteOpenUpdateStatus] = useState(false);
  const handleClickOpenUpdateStatus = () => {
    setIsDeleteOpenUpdateStatus(true);
  };
  const handleCloseModUpdateStatus = () => {
    setIsDeleteOpenUpdateStatus(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
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
  const [searchQueryManageApplyLeave, setSearchQueryManageApplyLeave] =
    useState("");
  const [isManageColumnsOpenApplyLeave, setManageColumnsOpenApplyLeave] =
    useState(false);
  const [anchorElApplyLeave, setAnchorElApplyLeave] = useState(null);

  const handleOpenManageColumnsApplyLeave = (event) => {
    setAnchorElApplyLeave(event.currentTarget);
    setManageColumnsOpenApplyLeave(true);
  };
  const handleCloseManageColumnsApplyLeave = () => {
    setManageColumnsOpenApplyLeave(false);
    setSearchQueryManageApplyLeave("");
  };

  const openApplyLeave = Boolean(anchorElApplyLeave);
  const idApplyLeave = openApplyLeave ? "simple-popover" : undefined;

  // Search bar
  const [anchorElSearchApplyLeave, setAnchorElSearchApplyLeave] =
    React.useState(null);
  const handleClickSearchApplyLeave = (event) => {
    setAnchorElSearchApplyLeave(event.currentTarget);
  };
  const handleCloseSearchApplyLeave = () => {
    setAnchorElSearchApplyLeave(null);
    setSearchQueryApplyLeave("");
  };

  const openSearchApplyLeave = Boolean(anchorElSearchApplyLeave);
  const idSearchApplyLeave = openSearchApplyLeave
    ? "simple-popover"
    : undefined;

  const leaveStatusOptions = [
    { label: "Shift", value: "Shift" },
    { label: "Before Half Shift", value: "Before Half Shift" },
    { label: "After Half Shift", value: "After Half Shift" },
  ];

  const durationOptions = [
    { label: "Continous", value: "Continous" },
    { label: "Random", value: "Random" },
  ];

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

  // Table row color
  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#f0f0f0" }; // Even row
    } else {
      return { background: "#ffffff" }; // Odd row
    }
  };

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
        (item) => item.mainpage === "Apply Leave"
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
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Apply Leave"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };

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

  const [isCheckedList, setIsCheckedList] = useState([]);
  const [isCheckedListOverall, setIsCheckedListOverall] = useState(false);
  const overallCheckListChange = () => {
    let newArrayChecked = isCheckedList.map(
      (item) => (item = !isCheckedListOverall)
    );

    let returnOverall = groupDetails.map((row) => {
      {
        if (row.checklist === "DateTime") {
          if (
            ((row.data !== undefined && row.data !== "") ||
              row.files !== undefined) &&
            row.data.length === 16
          ) {
            return true;
          } else {
            return false;
          }
        } else if (row.checklist === "Date Multi Span") {
          if (
            ((row.data !== undefined && row.data !== "") ||
              row.files !== undefined) &&
            row.data.length === 21
          ) {
            return true;
          } else {
            return false;
          }
        } else if (row.checklist === "Date Multi Span Time") {
          if (
            ((row.data !== undefined && row.data !== "") ||
              row.files !== undefined) &&
            row.data.length === 33
          ) {
            return true;
          } else {
            return false;
          }
        } else if (row.checklist === "Date Multi Random Time") {
          if (
            ((row.data !== undefined && row.data !== "") ||
              row.files !== undefined) &&
            row.data.length === 16
          ) {
            return true;
          } else {
            return false;
          }
        } else if (
          (row.data !== undefined && row.data !== "") ||
          row.files !== undefined
        ) {
          return true;
        } else {
          return false;
        }
      }
    });

    let allcondition = returnOverall.every((item) => item == true);

    if (allcondition) {
      setIsCheckedList(newArrayChecked);
      setIsCheckedListOverall(!isCheckedListOverall);
    } else {
      setPopupContentMalert("Please Fill All the Fields");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
  };

  const handleCheckboxChange = (index) => {
    const newCheckedState = [...isCheckedList];
    newCheckedState[index] = !newCheckedState[index];

    let currentItem = groupDetails[index];

    let data = () => {
      if (currentItem.checklist === "DateTime") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 16
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Span") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 21
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Span Time") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 33
        ) {
          return true;
        } else {
          return false;
        }
      } else if (currentItem.checklist === "Date Multi Random Time") {
        if (
          ((currentItem.data !== undefined && currentItem.data !== "") ||
            currentItem.files !== undefined) &&
          currentItem.data.length === 16
        ) {
          return true;
        } else {
          return false;
        }
      } else if (
        (currentItem.data !== undefined && currentItem.data !== "") ||
        currentItem.files !== undefined
      ) {
        return true;
      } else {
        return false;
      }
    };

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
      setPopupContentMalert("Please Fill the Fields");
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
    setPageName(!pageName);
    let searchItem = datasAvailedDB.find(
      (item) =>
        item.commonid == postID &&
        item.module == "Leave&Permission" &&
        item.submodule == "Leave" &&
        item.mainpage == "Apply Leave" &&
        item.status.toLowerCase() !== "completed"
    );

    let combinedGroups = groupDetails?.map((data) => {
      let check =
        (data.data !== undefined && data.data !== "") ||
        data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: "",
          completedat: "",
        };
      }
    });

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
            completedat: objectData?.completedat,
          }
        );
        await fecthDBDatas();
      } else {
        let assignbranches = await axios.post(`${SERVICE.MYCHECKLIST_CREATE}`, {
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
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
        await fecthDBDatas();
      }
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  async function fecthDBDatas() {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);

      let foundData = res?.data?.mychecklist.find(
        (item) => item.commonid == postID
      );
      setGroupDetails(foundData?.groups);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  const updateDateValuesAtIndex = (value, index) => {
    setDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "date");
  };

  const updateTimeValuesAtIndex = (value, index) => {
    setTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "DateTime", "time");
  };
  //---------------------------------------------------------------------------------------------------------------

  const updateFromDateValueAtIndex = (value, index) => {
    setDateValueMultiFrom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "fromdate");
  };

  const updateToDateValueAtIndex = (value, index) => {
    setDateValueMultiTo((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span", "todate");
  };
  //---------------------------------------------------------------------------------------------------------------------------------
  const updateDateValueAtIndex = (value, index) => {
    setDateValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "date");
  };

  const updateTimeValueAtIndex = (value, index) => {
    setTimeValueRandom((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Random Time", "time");
  };
  //---------------------------------------------------------------------------------------------------------------------------------------

  const updateFirstDateValuesAtIndex = (value, index) => {
    setFirstDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromdate");
  };

  const updateFirstTimeValuesAtIndex = (value, index) => {
    setFirstTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "fromtime");
  };

  const updateSecondDateValuesAtIndex = (value, index) => {
    setSecondDateValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "todate");
  };

  const updateSecondTimeValuesAtIndex = (value, index) => {
    setSecondTimeValue((prevArray) => {
      const newArray = [...prevArray]; // Create a copy of the array
      newArray[index] = value; // Update value at the specified index
      return newArray; // Return the updated array
    });
    handleDataChange(value, index, "Date Multi Span Time", "totime");
  };

  //------------------------------------------------------------------------------------------------------------

  const handleDataChange = (e, index, from, sub) => {
    let getData;
    let finalData;
    let updatedTodos;
    switch (from) {
      case "Check Box":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          lastcheck: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-number":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-alpha":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Text Box-alphanumeric":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Attachments":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          files: e,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Pre-Value":
        break;
      case "Date":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Time":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "DateTime":
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }

        break;
      case "Date Multi Span":
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${dateValueMultiTo[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueMultiFrom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Date Multi Span Time":
        if (sub == "fromdate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${firstTimeValue[index]}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "fromtime") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${e}/${secondDateValue[index]} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else if (sub == "todate") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${e} ${secondTimeValue[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${firstDateValue[index]} ${firstTimeValue[index]}/${secondDateValue[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Date Multi Random":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
      case "Date Multi Random Time":
        if (sub == "date") {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${e} ${timeValueRandom[index]}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        } else {
          getData = groupDetails[index];
          finalData = {
            ...getData,
            data: `${dateValueRandom[index]} ${e}`,
          };

          updatedTodos = [...groupDetails];
          updatedTodos[index] = finalData;
          setGroupDetails(updatedTodos);
        }
        break;
      case "Radio":
        getData = groupDetails[index];
        finalData = {
          ...getData,
          data: e.target.value,
        };

        updatedTodos = [...groupDetails];
        updatedTodos[index] = finalData;
        setGroupDetails(updatedTodos);
        break;
    }
  };

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
        },
        index,
        "Attachments"
      );
    };
  };

  const getCodeNew = async (details) => {
    setPageName(!pageName);
    setGetDetails(details);
    try {
      let res = await axios.get(SERVICE.MYCHECKLIST);
      setDatasAvailedDB(res?.data?.mychecklist);
      let searchItem = res?.data?.mychecklist.find(
        (item) =>
          item.commonid == details?.id &&
          item.module == "Leave&Permission" &&
          item.submodule == "Leave" &&
          item.mainpage == "Apply Leave" &&
          item.status.toLowerCase() !== "completed"
      );

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
        });

        let forDateTime = searchItem?.groups?.map((data) => {
          if (data.checklist === "DateTime") {
            if (data?.data && data?.data !== "") {
              const [date, time] = data?.data?.split(" ");
              return { date, time };
            }
          } else {
            return { date: "0", time: "0" };
          }
        });

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
        });

        setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate));
        setDateValueMultiTo(forDateSpan.map((item) => item?.todate));

        setDateValueRandom(forFillDetails.map((item) => item?.date));
        setTimeValueRandom(forFillDetails.map((item) => item?.time));

        setDateValue(forDateTime.map((item) => item?.date));
        setTimeValue(forDateTime.map((item) => item?.time));

        setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate));
        setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime));
        setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate));
        setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime));

        setDisableInput(new Array(details?.groups?.length).fill(true));
      } else {
        setIsCheckList(false);
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleCheckListSubmit = async () => {
    let nextStep = isCheckedList.every((item) => item == true);

    if (!nextStep) {
      setPopupContentMalert("Please Check All the Fields");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      sendRequestCheckList();
    }
  };

  const sendRequestCheckList = async () => {
    setPageName(!pageName);
    let combinedGroups = groupDetails?.map((data) => {
      let check =
        (data.data !== undefined && data.data !== "") ||
        data.files !== undefined;

      if (check) {
        return {
          ...data,
          completedby: completedbyName,
          completedat: new Date(),
        };
      } else {
        return {
          ...data,
          completedby: "",
          completedat: "",
        };
      }
    });

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
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      handleCloseModEditCheckList();
      setIsCheckedListOverall(false);
      sendEditStatus();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibilityApplyLeave = {
    serialNumber: true,
    checkbox: true,
    employeename: true,
    employeeid: true,
    leavetype: true,
    date: true,
    todate: true,
    noofshift: true,
    reasonforleave: true,
    reportingto: true,
    actions: true,
    status: true,
  };

  const [columnVisibilityApplyLeave, setColumnVisibilityApplyLeave] = useState(
    initialColumnVisibilityApplyLeave
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const fetchLeaveType = async () => {
    setPageName(!pageName);
    try {
      let res_leavetype = await axios.get(SERVICE.LEAVETYPE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const leaveall = [
        { label: "Leave Without Pay (LWP)", value: "Leave Without Pay (LWP)" },
        ...res_leavetype?.data?.leavetype.map((d) => ({
          ...d,
          label: d.leavetype,
          value: d.leavetype,
        })),
      ];
      setLeaveTypeData(leaveall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchLeaveType();
  }, []);

  const [deleteApply, setDeleteApply] = useState("");

  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeleteApply(res?.data?.sapplyleave);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [updateStatus, setUpdateStatus] = useState("");

  const getDataForUpdate = async (id) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUpdateStatus(res?.data?.sapplyleave);
      handleClickOpenUpdateStatus();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let Applysid = deleteApply?._id;
  const delApply = async () => {
    setPageName(!pageName);
    try {
      if (Applysid) {
        await axios.delete(`${SERVICE.APPLYLEAVE_SINGLE}/${Applysid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        await fetchApplyleave();
        if (!isUserRoleAccess?.role?.includes("Manager") ||
          !isUserRoleCompare.includes("lassignleaveapply")) {
          await fetchApplyleaveForEmployee();
        }
        handleCloseMod();
        setSelectedRows([]);
        setPageApplyLeave(1);
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  let updatestatusid = updateStatus?._id;
  const handleCancelLeave = async () => {
    let res = await axios.put(`${SERVICE.APPLYLEAVE_SINGLE}/${updatestatusid}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      status: 'Cancelled'
    });
    handleCloseModUpdateStatus();
  }

  const delApplycheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.APPLYLEAVE_SINGLE}/${item}`, {
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
      setPageApplyLeave(1);

      await fetchApplyleave();
      if (!isUserRoleAccess?.role?.includes("Manager") ||
        !isUserRoleCompare.includes("lassignleaveapply")) {
        await fetchApplyleaveForEmployee();
      }
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchCategoryTicket = async () => {
    setPageName(!pageName);
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
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
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
    setAppleave({
      ...appleave,
      employeename: "Please Select Employee Name",
      employeeid: "",
      leavetype: "Please Select LeaveType",
      noofshift: "",
      reasonforleave: "", company: "",
      branch: "",
      unit: "",
      team: "",
      reportingto: "",
    });
    setAllUsers([]);
    setSelectStatus([]);
    setAvailableDays("");
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
    setAppleave({
      ...appleave,
      employeename: "Please Select Employee Name",
      employeeid: "",
      leavetype: "Please Select LeaveType",
      noofshift: "", company: "",
      branch: "",
      unit: "",
      team: "",
      reasonforleave: "",
      reportingto: "",
    });
    setAllUsers([]);
    setSelectStatus([]);
    setAvailableDays("");
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
    setAppleave({
      ...appleave,
      employeename: "Please Select Employee Name",
      employeeid: "",
      leavetype: "Please Select LeaveType",
      noofshift: "", company: "",
      branch: "",
      unit: "",
      team: "",
      reasonforleave: "",
      reportingto: "",
    });
    setAllUsers([]);
    setSelectStatus([]);
    setAvailableDays("");
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
    setAppleave({
      ...appleave,
      employeename: "Please Select Employee Name",
      employeeid: "",
      leavetype: "Please Select LeaveType",
      noofshift: "",
      reasonforleave: "", company: "",
      branch: "",
      unit: "",
      team: "",
      reportingto: "",
    });
    setAllUsers([]);
    setSelectStatus([]);
    setAvailableDays("");
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  // List Filter
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
    setSelectedLeaveType([]);
    setValueLeaveType([]);
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
    setSelectedLeaveType([]);
    setValueLeaveType([]);
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
    setSelectedLeaveType([]);
    setValueLeaveType([]);
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
    setSelectedLeaveType([]);
    setValueLeaveType([]);
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
    setSelectedLeaveType([]);
    setValueLeaveType([]);
  };
  const customValueRendererEmpFilter = (valueCate, _employees) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Employee";
  };

  // Leave Type
  const handleLeaveTypeChangeFilter = (options) => {
    setSelectedLeaveType(options);
    setValueLeaveType(
      options.map((a, index) => {
        return a.value;
      })
    );
  };
  const customValueRendererLeaveTypeFilter = (valueCate, _employees) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Leave Type";
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

  let dateselect = new Date();
  // dateselect.setDate(dateselect.getDate() + 3);
  dateselect.setDate(dateselect.getDate() + Number(leaveCriteriaApplyDays));
  var ddt = String(dateselect.getDate()).padStart(2, "0");
  var mmt = String(dateselect.getMonth() + 1).padStart(2, "0");
  var yyyyt = dateselect.getFullYear();
  let formattedDatet = yyyyt + "-" + mmt + "-" + ddt;

  let datePresent = new Date();
  var ddp = String(datePresent.getDate());
  var mmp = String(datePresent.getMonth() + 1);
  var yyyyp = datePresent.getFullYear();
  let formattedDatePresent = yyyyp + "-" + mmp + "-" + ddp;

  // Assuming appleave.date is the "from date" and appleave.todate is the "to date"
  const calculateDaysDifference = () => {
    const fromDate = new Date(appleave.date).getTime();
    const toDate = new Date(appleave.todate).getTime();

    if (!isNaN(fromDate) && !isNaN(toDate)) {
      // Calculate the number of days between the two dates
      const daysDifference = Math.floor(
        (toDate - fromDate) / (1000 * 60 * 60 * 24)
      );
      return daysDifference + 1;
    }

    return 0; // Return 0 if either date is invalid
  };

  // Call the function and set the result in state or use it as needed
  const daysDifference = calculateDaysDifference();

  // Assuming appleave.date is the "from date" and appleave.todate is the "to date"
  const calculateDaysDifferenceEdit = () => {
    const fromDate = new Date(appleaveEdit.date).getTime();
    const toDate = new Date(appleaveEdit.todate).getTime();

    if (!isNaN(fromDate) && !isNaN(toDate)) {
      // Calculate the number of days between the two dates
      const daysDifferenceEdit = Math.floor(
        (toDate - fromDate) / (1000 * 60 * 60 * 24)
      );
      return daysDifferenceEdit + 1;
    }

    return 0; // Return 0 if either date is invalid
  };

  // Call the function and set the result in state or use it as needed
  const daysDifferenceEdit = calculateDaysDifferenceEdit();

  const [allUsers, setAllUsers] = useState([]);
  const [allUsersWithPrevNext, setAllUsersWithPrevNext] = useState([]);
  const [leavecriterias, setLeavecriterias] = useState([]);
  const [availableDays, setAvailableDays] = useState("");
  const [weekOffDays, setWeekOffDays] = useState("");
  const [getSelectedDates, setGetSelectedDates] = useState([]);
  const [leaveRestriction, setLeaveRestriction] = useState(false);
  const [checkDuplicate, setCheckDuplicate] = useState([]);

  const [allUsersEdit, setAllUsersEdit] = useState([]);
  const [leavecriteriasEdit, setLeavecriteriasEdit] = useState([]);
  const [availableDaysEdit, setAvailableDaysEdit] = useState("");
  const [getSelectedDatesEdit, setGetSelectedDatesEdit] = useState([]);
  const [leaveRestrictionEdit, setLeaveRestrictionEdit] = useState(false);
  const [checkDuplicateEdit, setCheckDuplicateEdit] = useState([]);

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

  const fetchUsersRandom = async (value, date) => {
    setPageName(!pageName);
    let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let empid = Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode;

    let result = res_vendor?.data?.applyleaves
      .filter((item) => item.employeeid === empid)
      .flatMap((d) => d.date);

    let check = result.includes(moment(date, "YYYY-MM-DD").format("DD/MM/YYYY"));

    let daysArray = [];
    if (date === "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (getSelectedDates.includes(moment(date, "YYYY-MM-DD").format("DD/MM/YYYY"))) {
      setPopupContentMalert("Date Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (check) {
      setPopupContentMalert("Date Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      let startMonthDate = new Date(date);
      let endMonthDate = new Date(date);

      // Find the previous day
      const previousDay = new Date(startMonthDate);
      previousDay.setDate(startMonthDate.getDate() - 1);

      // Find the next day
      const nextDay = new Date(startMonthDate);
      nextDay.setDate(startMonthDate.getDate() + 1);

      // while (startMonthDate <= endMonthDate) {
      //   const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
      //   const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
      //   const dayCount = startMonthDate.getDate();
      //   const shiftMode = 'Main Shift';
      //   const weekNumberInMonth = (getWeekNumberInMonth(startMonthDate) === 1 ? `${getWeekNumberInMonth(startMonthDate)}st Week` :
      //     getWeekNumberInMonth(startMonthDate) === 2 ? `${getWeekNumberInMonth(startMonthDate)}nd Week` :
      //       getWeekNumberInMonth(startMonthDate) === 3 ? `${getWeekNumberInMonth(startMonthDate)}rd Week` :
      //         getWeekNumberInMonth(startMonthDate) > 3 ? `${getWeekNumberInMonth(startMonthDate)}th Week` : '')

      //   daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

      //   // Move to the next day
      //   startMonthDate.setDate(startMonthDate.getDate() + 1);
      // }

      while (previousDay <= nextDay) {
        const formattedDate = `${String(previousDay.getDate()).padStart(
          2,
          "0"
        )}/${String(previousDay.getMonth() + 1).padStart(
          2,
          "0"
        )}/${previousDay.getFullYear()}`;
        const dayName = previousDay.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dayCount = previousDay.getDate();
        const shiftMode = "Main Shift";
        const weekNumberInMonth =
          getWeekNumberInMonth(previousDay) === 1
            ? `${getWeekNumberInMonth(previousDay)}st Week`
            : getWeekNumberInMonth(previousDay) === 2
              ? `${getWeekNumberInMonth(previousDay)}nd Week`
              : getWeekNumberInMonth(previousDay) === 3
                ? `${getWeekNumberInMonth(previousDay)}rd Week`
                : getWeekNumberInMonth(previousDay) > 3
                  ? `${getWeekNumberInMonth(previousDay)}th Week`
                  : "";

        daysArray.push({
          formattedDate,
          dayName,
          dayCount,
          shiftMode,
          weekNumberInMonth,
        });

        // Move to the next day
        previousDay.setDate(previousDay.getDate() + 1);
      }
    }

    try {
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        empcode: value,
      });
      if (
        date !== "" &&
        !getSelectedDates.includes(
          moment(date, "YYYY-MM-DD").format("DD/MM/YYYY")
        ) &&
        !check &&
        res?.data?.finaluser.length === 0
      ) {
        setPopupContentMalert(
          "Shift is not alloted for the selected date. Please select another date"
        );
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
        setAppleave({ ...appleave, date: "" });
      } else {
        const uniqueHeadings = [...new Set(res?.data?.finaluser)];

        let result = uniqueHeadings.filter((d) => {
          const [day, month, year] = d.formattedDate?.split("/");
          const finaldate = `${year}-${month}-${day}`;
          // return d.shiftMode === "Main Shift" && finaldate === date;
          return finaldate === date;
        });
        let filteredDateResult = uniqueHeadings.find((d) => {
          const [day, month, year] = d.formattedDate?.split("/");
          const finaldate = `${year}-${month}-${day}`;
          return d.shiftMode === "Second Shift" && finaldate === date;
        });

        if (result.length > 1) {
          if (Accessdrop === "HR") {
            setPopupContentMalert(`${appleave.employeename} have double shift on ${filteredDateResult && filteredDateResult.formattedDate}. You cannot apply leave.`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else {
            setPopupContentMalert(`You have double shift on ${filteredDateResult && filteredDateResult.formattedDate}. You cannot apply leave.`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          }
        } else {
          // setAllUsers(prevUsers => [...prevUsers, ...res?.data?.finaluser]);
          setAllUsers((prevUsers) => [...prevUsers, ...result]);
          setAllUsersWithPrevNext(uniqueHeadings);

          // Extract formatted dates from response data and set to getSelectedDates
          // const selectedDates = res?.data?.finaluser.map(d => d.formattedDate);
          const selectedDates = result.map((d) => d.formattedDate);
          setGetSelectedDates((prevDates) => [...prevDates, ...selectedDates]);
          setAppleave({ ...appleave, date: "" });
        }
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchUsersRandomEdit = async (value, date) => {
    let check = checkDuplicateEdit.includes(moment(date, "YYYY-MM-DD").format("DD/MM/YYYY"));

    let daysArray = [];
    if (date === "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (
      getSelectedDatesEdit.includes(
        moment(date, "YYYY-MM-DD").format("DD/MM/YYYY")
      )
    ) {
      setPopupContentMalert("Date Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (check) {
      setPopupContentMalert("Date Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      let startMonthDate = new Date(date);
      let endMonthDate = new Date(date);

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
    }

    try {
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        empcode: value,
      });

      setAllUsersEdit((prevUsers) => [...prevUsers, ...res?.data?.finaluser]);

      // Extract formatted dates from response data and set to getSelectedDates
      const selectedDatesEdit = res?.data?.finaluser.map(
        (d) => d.formattedDate
      );
      setGetSelectedDatesEdit((prevDates) => [
        ...prevDates,
        ...selectedDatesEdit,
      ]);
      setAppleaveEdit({ ...appleaveEdit, date: "" });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchUsers = async (value, date, todate) => {
    setPageName(!pageName);
    let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let empid =
      Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode;
    let result = res_vendor?.data?.applyleaves
      .filter((item) => item.employeeid === empid)
      .flatMap((d) => d.date);

    const isOverlap = result.some((leave) => {
      const startDate = moment(date, "YYYY-MM-DD");
      const endDate = moment(todate, "YYYY-MM-DD");
      const leaveDate = moment(leave, "DD/MM/YYYY");

      // Check if any of the selected dates overlap with the leave date
      return (
        leaveDate.isBetween(startDate, endDate, "day", "[]") || // Within leave period
        leaveDate.isSame(startDate, "day") || // Leave starts on the given date
        leaveDate.isSame(endDate, "day") // Leave ends on the given date
      );
    });

    const isOverlap1 = getSelectedDates.some((leave) => {
      const startDate = moment(date, "YYYY-MM-DD");
      const endDate = moment(todate, "YYYY-MM-DD");
      const leaveDate = moment(leave, "DD/MM/YYYY");

      // Check if any of the selected dates overlap with the leave date
      return (
        leaveDate.isBetween(startDate, endDate, "day", "[]") || // Within leave period
        leaveDate.isSame(startDate, "day") || // Leave starts on the given date
        leaveDate.isSame(endDate, "day") // Leave ends on the given date
      );
    });

    let daysArray = [];
    let daysArrayNew = [];
    if (date === "") {
      setPopupContentMalert("Please Select From Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    if (todate === "") {
      setPopupContentMalert("Please Select To Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isOverlap1) {
      setPopupContentMalert("Date Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isOverlap) {
      setPopupContentMalert("Date Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      let startMonthDate = new Date(date);
      let endMonthDate = new Date(todate);

      // Find the previous day
      const previousDay = new Date(startMonthDate);
      previousDay.setDate(startMonthDate.getDate() - 1);

      // Find the next day
      const nextDay = new Date(endMonthDate);
      nextDay.setDate(endMonthDate.getDate() + 1);

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

        daysArrayNew.push({
          formattedDate,
          dayName,
          dayCount,
          shiftMode,
          weekNumberInMonth,
        });

        // Move to the next day
        startMonthDate.setDate(startMonthDate.getDate() + 1);
      }

      while (previousDay <= nextDay) {
        const formattedDate = `${String(previousDay.getDate()).padStart(
          2,
          "0"
        )}/${String(previousDay.getMonth() + 1).padStart(
          2,
          "0"
        )}/${previousDay.getFullYear()}`;
        const dayName = previousDay.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const dayCount = previousDay.getDate();
        const shiftMode = "Main Shift";
        const weekNumberInMonth =
          getWeekNumberInMonth(previousDay) === 1
            ? `${getWeekNumberInMonth(previousDay)}st Week`
            : getWeekNumberInMonth(previousDay) === 2
              ? `${getWeekNumberInMonth(previousDay)}nd Week`
              : getWeekNumberInMonth(previousDay) === 3
                ? `${getWeekNumberInMonth(previousDay)}rd Week`
                : getWeekNumberInMonth(previousDay) > 3
                  ? `${getWeekNumberInMonth(previousDay)}th Week`
                  : "";

        daysArray.push({
          formattedDate,
          dayName,
          dayCount,
          shiftMode,
          weekNumberInMonth,
        });

        // Move to the next day
        previousDay.setDate(previousDay.getDate() + 1);
      }
    }

    try {
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        empcode: value,
      });
      if (
        date !== "" &&
        todate !== "" &&
        !isOverlap1 &&
        !isOverlap &&
        res?.data?.finaluser.length === 0
      ) {
        setPopupContentMalert(
          "Shift is not alloted for the selected date. Please select another date"
        );
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
        setAppleave({ ...appleave, date: "", todate: "" });
      } else {
        const uniqueHeadings = [...new Set(res?.data?.finaluser)];
        let result = uniqueHeadings.filter(
          (d) =>
            // d.shiftMode === "Main Shift" &&
            daysArrayNew.some((day) => day.formattedDate === d.formattedDate)
        );

        let checkresult = uniqueHeadings.some((d) => d.shiftMode === "Second Shift");

        let filteredDateResult = uniqueHeadings.find((d) => {
          return d.shiftMode === "Second Shift" && daysArrayNew.some((day) => day.formattedDate === d.formattedDate);
        });

        if (checkresult) {
          if (Accessdrop === "HR") {
            setPopupContentMalert(`${appleave.employeename} have double shift on ${filteredDateResult && filteredDateResult.formattedDate}. You cannot apply leave.`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else {
            setPopupContentMalert(`You have double shift on ${filteredDateResult && filteredDateResult.formattedDate}. You cannot apply leave.`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          }
        } else {
          // setAllUsers(prevUsers => [...prevUsers, ...res?.data?.finaluser]);
          setAllUsers((prevUsers) => [...prevUsers, ...result]);
          setAllUsersWithPrevNext(uniqueHeadings);

          // Extract formatted dates from response data and set to getSelectedDates
          // const selectedDates = res?.data?.finaluser.map(d => d.formattedDate);
          const selectedDates = result.map((d) => d.formattedDate);
          setGetSelectedDates((prevDates) => [...prevDates, ...selectedDates]);
          setAppleave({ ...appleave, date: "", todate: "" });
        }
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchUsersEdit = async (value, date, todate) => {
    setPageName(!pageName);
    const isOverlap = checkDuplicateEdit.some((leave) => {
      const startDate = moment(date, "YYYY-MM-DD");
      const endDate = moment(todate, "YYYY-MM-DD");
      const leaveDate = moment(leave, "DD/MM/YYYY");

      // Check if any of the selected dates overlap with the leave date
      return (
        leaveDate.isBetween(startDate, endDate, "day", "[]") || // Within leave period
        leaveDate.isSame(startDate, "day") || // Leave starts on the given date
        leaveDate.isSame(endDate, "day") // Leave ends on the given date
      );
    });

    const isOverlap1 = getSelectedDatesEdit.some((leave) => {
      const startDate = moment(date, "YYYY-MM-DD");
      const endDate = moment(todate, "YYYY-MM-DD");
      const leaveDate = moment(leave, "DD/MM/YYYY");

      // Check if any of the selected dates overlap with the leave date
      return (
        leaveDate.isBetween(startDate, endDate, "day", "[]") || // Within leave period
        leaveDate.isSame(startDate, "day") || // Leave starts on the given date
        leaveDate.isSame(endDate, "day") // Leave ends on the given date
      );
    });

    let daysArray = [];
    if (date === "") {
      setPopupContentMalert("Please Select From Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    if (todate === "") {
      setPopupContentMalert("Please Select To Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isOverlap1) {
      setPopupContentMalert("Date Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isOverlap) {
      setPopupContentMalert("These Date Range is Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      let startMonthDate = new Date(date);
      let endMonthDate = new Date(todate);

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
    }

    try {
      let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        userDates: daysArray,
        empcode: value,
      });

      setAllUsersEdit((prevUsers) => [...prevUsers, ...res?.data?.finaluser]);

      // Extract formatted dates from response data and set to getSelectedDates
      const selectedDatesEdit = res?.data?.finaluser.map(
        (d) => d.formattedDate
      );
      setGetSelectedDatesEdit((prevDates) => [
        ...prevDates,
        ...selectedDatesEdit,
      ]);
      setAppleaveEdit({ ...appleaveEdit, date: "", todate: "" });
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchLeaveCriteria = async (empname, empdepartment, empdesignation, leavetype, empdoj, empid, empcompany, empbranch, empunit, empteam) => {
    setPageName(!pageName);
    try {
      let res_leavecriteria = await axios.post(SERVICE.LEAVECRITERIA_FOR_APPLY_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empname: empname,
        empdept: empdepartment,
        empdesg: empdesignation,
        leavetype: leavetype,
        empcompany: empcompany,
        empbranch: empbranch,
        empunit: empunit,
        empteam: empteam
      });

      let res_statuspre = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let currentDate = new Date();

      // let total = res_status.data.departmentdetails.filter((dep) => {
      //   if (dep.department === empdepartment && Number(dep.year) === currentDate.getFullYear()) {
      //     return dep;
      //   }
      // });

      let res_status = await axios.post(SERVICE.DEPTMONTHSET_LIMITED_WITH_DEPT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empdepartment: empdepartment,
        year: String(currentDate.getFullYear()),
      });
      let total = [];
      // if (res_status.data.departmentdetails.length === 0) {
      //   setPopupContentMalert("This Employee Department StartEndDate Didn't Found!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // } else {
      //   total = res_status.data.departmentdetails;
      // }

      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let answer =
        isUserRoleAccess?.role?.includes("Manager") ||
          isUserRoleCompare.includes("lassignleaveapply")
          ? res_vendor?.data?.applyleaves
          : res_vendor?.data?.applyleaves.filter(
            (data) => data.employeename === isUserRoleAccess.companyname
          );

      // let filteredData = res_leavecriteria?.data?.leavecriterias?.filter((d) => {
      //   if (d.mode === 'Employee' && d.employee?.includes(empname) && d.leavetype === leavetype) {
      //     return d;
      //   }
      //   if (d.mode === 'Designation' && d.designation?.includes(empdesignation) && d.leavetype === leavetype) {
      //     return d;
      //   }
      //   if (d.mode === 'Department' && d.department?.includes(empdepartment) && d.leavetype === leavetype) {
      //     return d;
      //   }
      // })

      let filteredData = res_leavecriteria?.data?.leavecriterias;
      // console.log(filteredData, 'filteredData')
      let doj = new Date(empdoj);
      let monthsDiff =
        (currentDate.getFullYear() - doj.getFullYear()) * 12 +
        (currentDate.getMonth() - doj.getMonth());
      let yearsDiff = currentDate.getFullYear() - doj.getFullYear();
      let monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];

      let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empid: empid,
      });

      let noticeresult = res?.data?.noticeperiodapply;

      if (res_status.data.departmentdetails.length === 0) {
        setPopupContentMalert("This Department Start And End Date Didn't Found!");
        // setPopupContentMalert(`${empname}'s Department Didn't Found!`);
        setPopupSeverityMalert("info");
        handleClickOpenPopupMalert();
      }
      // else if (leavetype !== "Leave Without Pay (LWP)" && filteredData.length === 0) {
      else if (filteredData.length === 0) {
        setPopupContentMalert(`${leavetype} Not Applicable, Please check with your Supervisor`);
        setPopupSeverityMalert("warning");
        handleClickOpenPopupMalert();
      } else {
        // total = res_status.data.departmentdetails;
        // Remove duplicates based on 'month' and 'year'
        const total = res_status.data.departmentdetails.reduce((acc, curr) => {
          const exists = acc.some(
            (item) => item.month === curr.month && item.year === curr.year
          );
          if (!exists) {
            acc.push(curr);
          }
          return acc;
        }, []);

        // Sort from January to December
        total.sort((a, b) => parseInt(a.month) - parseInt(b.month));

        filteredData?.forEach((d) => {

          let applicableMonth = monthstring.indexOf(d.applicablefrommonth);
          let applicableYear = parseInt(d.applicablefromyear, 10);
          let applicableDate = new Date(applicableYear, applicableMonth, 1);

          // If current date is before the applicable date, show alert
          if (currentDate < applicableDate) {
            // setPopupContentMalert(`It's applicable from ${d.applicablefrommonth}, ${d.applicablefromyear} for this ${leavetype !== "Leave Without Pay (LWP)" ? leavetype : ''}. Can you apply leave for "Leave Without Pay (LWP)" Leave Type.`);
            setPopupContentMalert(`It's applicable from ${d.applicablefrommonth}, ${d.applicablefromyear} for this ${leavetype}.`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          }
          else {
            let comparedYear = d.pendingleave === true ? parseInt(d.pendingfromyear) : "";
            let comparedMonth = d.pendingleave === true ? d.pendingfrommonth : "";

            let finalanswer = answer.filter((d) => {
              if (d.employeeid === empid && d.leavetype === leavetype && d.status !== 'Cancelled') {
                return d.date;
              }
            });

            let previousYearDataBefore =
              res_statuspre.data.departmentdetails?.filter((dep) => {
                if (dep.department === empdepartment && Number(dep.year) === comparedYear) {
                  return dep;
                }
              });

            let previousYearData = d.pendingleave === true ? previousYearDataBefore : [];

            // let previousYearData = [];
            // if (d.pendingleave === true) {
            //   let res_statuspre = axios.post(SERVICE.DEPTMONTHSET_LIMITED_WITH_DEPT, {
            //     headers: {
            //       Authorization: `Bearer ${auth.APIToken}`,
            //     },
            //     empdepartment: empdepartment,
            //     year: String(comparedYear),
            //   });

            //   previousYearData.push(res_statuspre.data.departmentdetails);
            // }
            // else {
            //   previousYearData = []
            // }

            setTookLeaveDaysWithAllUsers(d.tookleave);
            setLeaveCriteriaApplyDays(d.applydays);
            setLeaveCriteriaLopDays(d.lopdays);

            let yearStartDate = total[0]?.fromdate;
            let yearEndDate = total[total?.length - 1]?.todate;

            let lastYearStartDate = previousYearData?.length > 0 ? previousYearData[0]?.fromdate : "";
            let lastYearEndDate = previousYearData?.length > 0
              ? previousYearData[previousYearData?.length - 1]?.todate
              : "";

            // // To get Previous year's leave count
            // let withinRangeCountLastYear = 0;
            // finalanswer.forEach((leave) => {
            //   leave.date.forEach((leaveDate) => {
            //     const [day, month, year] = leaveDate.split("/");

            //     const date = new Date(`${month}/${day}/${year}`);

            //     // Convert yearStartDate and yearEndDate to Date objects if they're not already
            //     const startDate = new Date(lastYearStartDate);
            //     const endDate = new Date(lastYearEndDate);

            //     // Check if date is between startDate and endDate (inclusive)
            //     if (date >= startDate && date <= endDate) {
            //       // Increment the counter if date is within the range
            //       withinRangeCountLastYear++;
            //     } else {
            //     }
            //   });
            // });

            // // To get Current year's leave count
            // let withinRangeCount = 0;
            // finalanswer.forEach((leave) => {
            //   leave.date.forEach((leaveDate) => {
            //     const [day, month, year] = leaveDate.split("/");             
            //     const date = new Date(`${month}/${day}/${year}`);

            //     const startDate = new Date(yearStartDate);
            //     const endDate = new Date(yearEndDate);

            //     // Check if date is between startDate and endDate (inclusive)
            //     if (date >= startDate && date <= endDate) {
            //       // Increment the counter if date is within the range                  
            //       withinRangeCount++;
            //     } else {
            //     }
            //   });
            // });

            //  // To get Current year's leave count
            //  let withinRangeNoOfShiftCount = 0;
            //  finalanswer.forEach((leave) => {
            //    leave.date.forEach((leaveDate) => {
            //      const [day, month, year] = leaveDate.split("/");
            //      const date = new Date(`${month}/${day}/${year}`);

            //      const startDate = new Date(yearStartDate);
            //      const endDate = new Date(yearEndDate);

            //      // Check if date is between startDate and endDate (inclusive)
            //      if (date >= startDate && date <= endDate) {
            //        // Increment the counter by parsing and adding the noofshift value
            //        withinRangeNoOfShiftCount += leave.noofshift; // Parse as float
            //      }
            //    });
            //  });

            // After added Double Day concept
            // To get Previous year's leave count
            let withinRangeCountLastYear = 0;
            finalanswer.forEach((leave) => {
              leave.usershifts.forEach((leaveDate) => {
                const [day, month, year] = leaveDate.formattedDate.split("/");

                const date = new Date(`${month}/${day}/${year}`);

                // Convert yearStartDate and yearEndDate to Date objects if they're not already
                const startDate = new Date(lastYearStartDate);
                const endDate = new Date(lastYearEndDate);
                const shiftCountForDoubleDay = leaveDate.leavestatus === 'Shift' ? 2 : 1;

                // Check if date is between startDate and endDate (inclusive)
                if (date >= startDate && date <= endDate && leave.status !== 'Cancelled') {
                  // // Increment the counter if date is within the range
                  // if (leaveDate.tookleavecheckstatus === "Single" || leaveDate.tookleavecheckstatus === "Double") {
                  //   // withinRangeCountLastYear += 1; // Add 1 for Single or Double
                  //   withinRangeCountLastYear += Number(leaveDate.shiftcount);
                  // } else if (leaveDate.tookleavecheckstatus === "Double Day") {
                  //   // withinRangeCountLastYear += 2; // Add 2 for Double Day
                  //   withinRangeCountLastYear += shiftCountForDoubleDay;
                  // }
                  withinRangeCountLastYear += Number(leaveDate.shiftcount);
                } else {
                }
              });
            });

            let withinRangeCount = 0;
            finalanswer.forEach((leave) => {
              leave.usershifts.forEach((leaveDate) => {
                const [day, month, year] = leaveDate.formattedDate.split("/");
                const date = new Date(`${month}/${day}/${year}`);

                const startDate = new Date(yearStartDate);
                const endDate = new Date(yearEndDate);
                const shiftCountForDoubleDay = leaveDate.leavestatus === 'Shift' ? 2 : 1;

                // Check if date is between startDate and endDate (inclusive)
                if (date >= startDate && date <= endDate) {
                  // Increment the counter if date is within the range                  
                  // if (leaveDate.tookleavecheckstatus === "Single" || leaveDate.tookleavecheckstatus === "Double") {
                  //   // withinRangeCount += 1; // Add 1 for Single or Double
                  //   withinRangeCount += Number(leaveDate.shiftcount);
                  // } else if (leaveDate.tookleavecheckstatus === "Double Day") {
                  //   // withinRangeCount += 2; // Add 2 for Double Day
                  //   withinRangeCount += shiftCountForDoubleDay;
                  // }
                  withinRangeCount += Number(leaveDate.shiftcount);
                } else {
                }
              });
            });

            // To get Current year's leave count
            let withinRangeNoOfShiftCount = 0;
            finalanswer.forEach((leave) => {
              leave.usershifts.forEach((leaveDate) => {
                const [day, month, year] = leaveDate.formattedDate.split("/");
                const date = new Date(`${month}/${day}/${year}`);

                const startDate = new Date(yearStartDate);
                const endDate = new Date(yearEndDate);

                // Check if date is between startDate and endDate (inclusive)
                if (date >= startDate && date <= endDate) {
                  // Increment the counter by parsing and adding the noofshift value
                  // if (leaveDate.tookleavecheckstatus === "Single" || leaveDate.tookleavecheckstatus === "Double") {
                  //   withinRangeNoOfShiftCount += leave.noofshift; // Parse as float
                  // } else if (leaveDate.tookleavecheckstatus === "Double Day") {
                  //   withinRangeNoOfShiftCount += leave.noofshift; // Parse as float
                  // }
                  withinRangeNoOfShiftCount += leave.noofshift; // Parse as float
                }
              });
            });

            // check the experience month is completed or not
            let comparedMonthValue =
              `${d.experience} ${d.experiencein}` === "1 Month"
                ? 1
                : `${d.experience} ${d.experiencein}` === "2 Month"
                  ? 2
                  : `${d.experience} ${d.experiencein}` === "3 Month"
                    ? 3
                    : `${d.experience} ${d.experiencein}` === "4 Month"
                      ? 4
                      : `${d.experience} ${d.experiencein}` === "5 Month"
                        ? 5
                        : `${d.experience} ${d.experiencein}` === "6 Month"
                          ? 6
                          : 0;

            // Calculate the year difference
            let comparedYearValue =
              `${d.experience} ${d.experiencein}` === "1 Year"
                ? 1
                : `${d.experience} ${d.experiencein}` === "2 Year"
                  ? 2
                  : `${d.experience} ${d.experiencein}` === "3 Year"
                    ? 3
                    : `${d.experience} ${d.experiencein}` === "4 Year"
                      ? 4
                      : `${d.experience} ${d.experiencein}` === "5 Year"
                        ? 5
                        : `${d.experience} ${d.experiencein}` === "6 Year"
                          ? 6
                          : 0;

            if (d.uninformedleave === true) {
              setLeaveRestriction(true);
            }

            // check auto increase
            if (d.leaveautocheck === true && d.leaveautodays === "Month") {
              // Applicable From
              if (d.experiencein === "Year" &&
                // yearsDiff <= comparedYearValue
                yearsDiff <= Number(d.experience)
              ) {
                setAvailableDays("");
                setPopupContentMalert("You are in Training");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              } else if (
                d.experiencein === "Month" &&
                // monthsDiff <= comparedMonthValue
                monthsDiff <= Number(d.experience)
              ) {
                setAvailableDays("");

                setPopupContentMalert("You are in Training");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              } else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                setPopupContentMalert("You are in notice period. Cannot apply leave");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              } else {
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth();

                const doj = new Date(empdoj);
                const dojYear = doj.getFullYear();
                const dojMonth = doj.getMonth();
                const dojDate = doj.getDate();

                let totalAvailableDaysLastYear = 0;
                const lastYear = currentDate.getFullYear() - 1;

                // Check if the user has completed one month from their date of joining
                const oneMonthPassedLastYear =
                  lastYear > dojYear ||
                  (lastYear === dojYear && currentMonth > dojMonth) ||
                  (lastYear === dojYear &&
                    currentMonth === dojMonth &&
                    currentDate.getDate() >= dojDate);

                if (parseInt(d.leaveautoincrease) === 1) {
                  if (oneMonthPassedLastYear) {
                    const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                    const numberofdaysLastYear = parseInt(d.numberofdays);
                    const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                    for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                      // for (let i = 0; i <= currentMonth; i++) {
                      totalAvailableDaysLastYear += numberofdaysLastYear;
                    }
                    // if (currentDate.getDate() > dojDate) {
                    //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                    // }
                  } else {
                    if (currentDate.getDate() > dojDate) {
                      totalAvailableDaysLastYear -= currentDate.getDate() - dojDate;
                    }
                  }
                } else {
                  if (oneMonthPassedLastYear) {
                    // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                    const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                    const numberofdaysLastYear = parseInt(d.numberofdays);
                    const monthsToAddDaysLastYear = [];
                    const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                    // Create an array of months based on leaveautoincrease
                    // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                    for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                      monthsToAddDaysLastYear.push(monthstring[i]);
                    }

                    // Calculate totalAvailableDays by summing numberofdays for each month
                    monthsToAddDaysLastYear.forEach((month) => {
                      const monthIndexLastYear = monthstring.indexOf(month);
                      // Add numberofdays for the month
                      if (monthIndexLastYear !== -1) {
                        // If the month is before the current month or is the current month, add numberofdays
                        if (monthIndexLastYear <= currentMonth) {
                          totalAvailableDaysLastYear += numberofdaysLastYear;
                        }
                      }
                    });

                    // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                    if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                      // Adjust based on the current day of the month
                      const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                      const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                      totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                      totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                    }

                    // console.log(leaveAutoIncreaseLastYear, 'leaveAutoIncreaseLastYear')
                    // console.log(numberofdaysLastYear, 'numberofdaysLastYear')
                    // console.log(monthsToAddDaysLastYear, 'monthsToAddDaysLastYear')
                    // console.log(pendingFromMonthLastYear, 'pendingFromMonthLastYear')
                  }
                }

                // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                let totalAvailableDays = 0;

                // Check if the user has completed one month from their date of joining
                const oneMonthPassed =
                  currentYear > dojYear ||
                  (currentYear === dojYear && currentMonth > dojMonth) ||
                  (currentYear === dojYear &&
                    currentMonth === dojMonth &&
                    currentDate.getDate() >= dojDate);

                if (parseInt(d.leaveautoincrease) === 1) {
                  if (oneMonthPassed) {
                    const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    const numberofdays = parseInt(d.numberofdays);
                    const pendingFromMonth = monthstring.indexOf(total[0]?.monthname);

                    for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                      // for (let i = 0; i <= currentMonth; i++) {
                      totalAvailableDays += numberofdays;
                    }
                  } else {
                    if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                      totalAvailableDays -= currentDate.getDate() - dojDate;
                    }
                  }
                } else {
                  if (oneMonthPassed) {
                    // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                    const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    const numberofdays = parseInt(d.numberofdays);
                    const monthsToAddDays = [];
                    const pendingFromMonth = monthstring.indexOf(total[0]?.monthname);
                    // console.log(total[0]);
                    // console.log(currentMonth, 'currentMonth')
                    // Create an array of months based on leaveautoincrease
                    // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                    for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                      monthsToAddDays.push(monthstring[i]);
                    }

                    // Calculate totalAvailableDays by summing numberofdays for each month
                    monthsToAddDays.forEach((month) => {
                      const monthIndex = monthstring.indexOf(month);
                      // Add numberofdays for the month
                      if (monthIndex !== -1) {
                        // If the month is before the current month or is the current month, add numberofdays
                        if (monthIndex <= currentMonth) {
                          totalAvailableDays += numberofdays;
                        }
                      }
                    });

                    // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                    if (monthsToAddDays.includes(monthstring[currentMonth])) {
                      // Adjust based on the current day of the month
                      const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                      const daysPassedInCurrentMonth = currentDate.getDate();
                      totalAvailableDays -= daysPassedInCurrentMonth;
                      totalAvailableDays += daysInCurrentMonth;
                    }


                    // console.log(leaveAutoIncrease, 'leaveAutoIncrease 3125')
                    // console.log(numberofdays, 'numberofdays 3126')
                    // console.log(monthsToAddDays, 'monthsToAddDays 3127')
                    // console.log(pendingFromMonth, 'pendingFromMonth 3128')
                  }
                }

                let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                // let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeNoOfShiftCount

                // If pendingleave is true, add the remaining days from the previous year to the total available days
                if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                  remainingLeaveDays += (oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear;
                } else {
                  // console.log(totalAvailableDays, 'totalAvailableDays')
                  remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                  // remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeNoOfShiftCount;
                }
                setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
              }
            } else if (d.leaveautocheck === true && d.leaveautodays === "Year") {
              // Applicable From
              if (d.experiencein === "Year" &&
                // yearsDiff <= comparedYearValue
                yearsDiff <= d.experience
              ) {
                setAvailableDays("");
                setPopupContentMalert("You are in Training");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              } else if (
                d.experiencein === "Month" &&
                // monthsDiff <= comparedMonthValue
                monthsDiff <= d.experience
              ) {
                setAvailableDays("");
                setPopupContentMalert("You are in Training");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              } else if (
                noticeresult.length > 0 &&
                d.leavefornoticeperiod === false
              ) {
                setPopupContentMalert(
                  "You are in notice period. Cannot apply leave"
                );
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              }
              // else {

              //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

              //   // Adjust totalAvailableDays based on leaveautoincrease value
              //   if (parseInt(d.leaveautoincrease) > 1) {
              //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
              //     const pendingFromYear = comparedYear;
              //     const currentYear = currentDate.getFullYear() - 1;

              //     const yearsToAddDays = currentYear - pendingFromYear;

              //     // Multiply the number of days by the leaveautoincrease value
              //     totalAvailableDaysLastYear *= Math.floor(yearsToAddDays / leaveAutoIncrease);
              //   }

              //   let totalAvailableDays = parseInt(d.numberofdays);

              //   // Adjust totalAvailableDays based on leaveautoincrease value
              //   if (parseInt(d.leaveautoincrease) > 1) {
              //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
              //     const pendingFromYear = parseInt(total[0]?.year);
              //     const currentYear = currentDate.getFullYear();

              //     const yearsToAddDays = currentYear - pendingFromYear;

              //     // Multiply the number of days by the leaveautoincrease value
              //     totalAvailableDays *= Math.floor(yearsToAddDays / leaveAutoIncrease);
              //   }

              //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

              //   // If pendingleave is true, add the remaining days from the previous year to the total available days
              //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
              //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
              //   } else {
              //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
              //   }

              //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
              // }
              else {
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth();

                const doj = new Date(empdoj);
                const dojYear = doj.getFullYear();
                const dojMonth = doj.getMonth();
                const dojDate = doj.getDate();

                let totalAvailableDaysLastYear = 0;
                const lastYear = currentDate.getFullYear() - 1;

                // Check if the user has completed one month from their date of joining
                const oneMonthPassedLastYear =
                  lastYear > dojYear ||
                  (lastYear === dojYear && currentMonth > dojMonth) ||
                  (lastYear === dojYear &&
                    currentMonth === dojMonth &&
                    currentDate.getDate() >= dojDate);

                if (parseInt(d.leaveautoincrease) === 1) {
                  if (oneMonthPassedLastYear) {
                    const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                    const numberofdaysLastYear =
                      parseInt(d.numberofdays) / parseInt(d.numberofdays);
                    const pendingFromMonthLastYear =
                      monthstring.indexOf(comparedMonth);

                    for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                      // for (let i = 0; i <= currentMonth; i++) {
                      totalAvailableDaysLastYear += numberofdaysLastYear;
                    }
                    // if (currentDate.getDate() > dojDate) {
                    //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                    // }
                  } else {
                    if (currentDate.getDate() > dojDate) {
                      totalAvailableDaysLastYear -= currentDate.getDate() - dojDate;
                    }
                  }
                } else {
                  if (oneMonthPassedLastYear) {
                    // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                    const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                    const numberofdaysLastYear =
                      parseInt(d.numberofdays) / parseInt(d.numberofdays);
                    const monthsToAddDaysLastYear = [];
                    const pendingFromMonthLastYear =
                      monthstring.indexOf(comparedMonth);

                    // Create an array of months based on leaveautoincrease
                    // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                    for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                      monthsToAddDaysLastYear.push(monthstring[i]);
                    }

                    // Calculate totalAvailableDays by summing numberofdays for each month
                    monthsToAddDaysLastYear.forEach((month) => {
                      const monthIndexLastYear = monthstring.indexOf(month);
                      // Add numberofdays for the month
                      if (monthIndexLastYear !== -1) {
                        // If the month is before the current month or is the current month, add numberofdays
                        if (monthIndexLastYear <= currentMonth) {
                          totalAvailableDaysLastYear += numberofdaysLastYear;
                        }
                      }
                    });

                    // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                    if (
                      monthsToAddDaysLastYear.includes(monthstring[currentMonth])
                    ) {
                      // Adjust based on the current day of the month
                      const daysInCurrentMonthLastYear = new Date(
                        lastYear,
                        currentMonth + 1,
                        0
                      ).getDate();
                      const daysPassedInCurrentMonthLastYear =
                        currentDate.getDate();
                      totalAvailableDaysLastYear -=
                        daysPassedInCurrentMonthLastYear;
                      totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                    }
                  }
                }

                // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                let totalAvailableDays = 0;

                // Check if the user has completed one month from their date of joining
                const oneMonthPassed =
                  currentYear > dojYear ||
                  (currentYear === dojYear && currentMonth > dojMonth) ||
                  (currentYear === dojYear &&
                    currentMonth === dojMonth &&
                    currentDate.getDate() >= dojDate);

                if (parseInt(d.leaveautoincrease) === 1) {
                  if (oneMonthPassed) {
                    const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    const numberofdays =
                      parseInt(d.numberofdays) / parseInt(d.numberofdays);
                    const pendingFromMonth = monthstring.indexOf(
                      total[0]?.monthname
                    );

                    for (
                      let i = pendingFromMonth;
                      i <= currentMonth;
                      i += leaveAutoIncrease
                    ) {
                      // for (let i = 0; i <= currentMonth; i++) {
                      totalAvailableDays += numberofdays;
                    }
                  } else {
                    if (
                      currentDate.getDate() > dojDate &&
                      currentMonth <= dojMonth
                    ) {
                      totalAvailableDays -= currentDate.getDate() - dojDate;
                    }
                  }
                } else {
                  if (oneMonthPassed) {
                    // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                    const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    const numberofdays =
                      parseInt(d.numberofdays) / parseInt(d.numberofdays);
                    const monthsToAddDays = [];
                    const pendingFromMonth = monthstring.indexOf(
                      total[0]?.monthname
                    );

                    // Create an array of months based on leaveautoincrease
                    // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                    for (
                      let i = pendingFromMonth;
                      i < currentMonth;
                      i += leaveAutoIncrease
                    ) {
                      monthsToAddDays.push(monthstring[i]);
                    }

                    // Calculate totalAvailableDays by summing numberofdays for each month
                    monthsToAddDays.forEach((month) => {
                      const monthIndex = monthstring.indexOf(month);
                      // Add numberofdays for the month
                      if (monthIndex !== -1) {
                        // If the month is before the current month or is the current month, add numberofdays
                        if (monthIndex <= currentMonth) {
                          totalAvailableDays += numberofdays;
                        }
                      }
                    });

                    // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                    if (monthsToAddDays.includes(monthstring[currentMonth])) {
                      // Adjust based on the current day of the month
                      const daysInCurrentMonth = new Date(
                        currentYear,
                        currentMonth + 1,
                        0
                      ).getDate();
                      const daysPassedInCurrentMonth = currentDate.getDate();
                      totalAvailableDays -= daysPassedInCurrentMonth;
                      totalAvailableDays += daysInCurrentMonth;
                    }
                  }
                }

                let remainingLeaveDays =
                  (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

                // If pendingleave is true, add the remaining days from the previous year to the total available days
                if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                  remainingLeaveDays +=
                    (oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) -
                    withinRangeCountLastYear;
                } else {
                  remainingLeaveDays =
                    (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                }
                setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
              }
            } else if (d.leaveautocheck === false && (d.leaveautodays === "Month" || d.leaveautodays === "Year")) {
              // Applicable From
              if (d.experiencein === "Year" &&
                // yearsDiff <= comparedYearValue
                yearsDiff <= d.experience
              ) {
                setAvailableDays("");
                setPopupContentMalert("You are in Training");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              } else if (
                d.experiencein === "Month" &&
                // monthsDiff <= comparedMonthValue
                monthsDiff <= d.experience
              ) {
                setAvailableDays("");
                setPopupContentMalert("You are in Training");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              } else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
                setPopupContentMalert("You are in notice period. Cannot apply leave");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              }
              // else {

              //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

              //   let totalAvailableDays = parseInt(d.numberofdays);
              //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

              //   // If pendingleave is true, add the remaining days from the previous year to the total available days
              //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
              //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
              //   } else {
              //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
              //   }

              //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
              // }
              else {
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth();

                const doj = new Date(empdoj);
                const dojYear = doj.getFullYear();
                const dojMonth = doj.getMonth();
                const dojDate = doj.getDate();

                let totalAvailableDaysLastYear = 0;
                const lastYear = currentDate.getFullYear() - 1;

                // Check if the user has completed one month from their date of joining
                const oneMonthPassedLastYear =
                  lastYear > dojYear ||
                  (lastYear === dojYear && currentMonth > dojMonth) ||
                  (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                if (parseInt(d.leaveautoincrease) === 1) {
                  if (oneMonthPassedLastYear) {
                    const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                    const numberofdaysLastYear =
                      d.leaveautodays === "Year"
                        ? parseInt(d.numberofdays) / parseInt(d.numberofdays)
                        : parseInt(d.numberofdays);
                    const pendingFromMonthLastYear =
                      monthstring.indexOf(comparedMonth);

                    for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                      // for (let i = 0; i <= currentMonth; i++) {
                      totalAvailableDaysLastYear += numberofdaysLastYear;
                    }
                    // if (currentDate.getDate() > dojDate) {
                    //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                    // }
                  } else {
                    if (currentDate.getDate() > dojDate) {
                      totalAvailableDaysLastYear -= currentDate.getDate() - dojDate;
                    }
                  }
                } else {
                  if (oneMonthPassedLastYear) {
                    // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                    const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                    const numberofdaysLastYear =
                      d.leaveautodays === "Year"
                        ? parseInt(d.numberofdays) / parseInt(d.numberofdays)
                        : parseInt(d.numberofdays);
                    const monthsToAddDaysLastYear = [];
                    const pendingFromMonthLastYear =
                      monthstring.indexOf(comparedMonth);

                    // Create an array of months based on leaveautoincrease
                    // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                    for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                      monthsToAddDaysLastYear.push(monthstring[i]);
                    }

                    // Calculate totalAvailableDays by summing numberofdays for each month
                    monthsToAddDaysLastYear.forEach((month) => {
                      const monthIndexLastYear = monthstring.indexOf(month);
                      // Add numberofdays for the month
                      if (monthIndexLastYear !== -1) {
                        // If the month is before the current month or is the current month, add numberofdays
                        if (monthIndexLastYear <= currentMonth) {
                          totalAvailableDaysLastYear += numberofdaysLastYear;
                        }
                      }
                    });

                    // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                    if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                      // Adjust based on the current day of the month
                      const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                      const daysPassedInCurrentMonthLastYear =
                        currentDate.getDate();
                      totalAvailableDaysLastYear -=
                        daysPassedInCurrentMonthLastYear;
                      totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                    }
                  }
                }

                // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                let totalAvailableDays = 0;

                // Check if the user has completed one month from their date of joining
                const oneMonthPassed =
                  currentYear > dojYear ||
                  (currentYear === dojYear && currentMonth > dojMonth) ||
                  (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);
                if (parseInt(d.leaveautoincrease) === 1) {
                  if (oneMonthPassed) {
                    const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    const numberofdays =
                      d.leaveautodays === "Year"
                        ? parseInt(d.numberofdays) / parseInt(d.numberofdays)
                        : parseInt(d.numberofdays);
                    const pendingFromMonth = monthstring.indexOf(
                      total[0]?.monthname
                    );

                    for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                      // for (let i = 0; i <= currentMonth; i++) {
                      totalAvailableDays += numberofdays;
                    }
                  } else {
                    if (currentDate.getDate() > dojDate && currentMonth <= dojMonth) {
                      totalAvailableDays -= currentDate.getDate() - dojDate;
                    }
                  }
                } else {
                  if (oneMonthPassed) {
                    // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                    const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                    const numberofdays =
                      d.leaveautodays === "Year"
                        ? parseInt(d.numberofdays) / parseInt(d.numberofdays)
                        : parseInt(d.numberofdays);
                    const monthsToAddDays = [];
                    const pendingFromMonth = monthstring.indexOf(total[0]?.monthname);

                    // Create an array of months based on leaveautoincrease
                    // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                    for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                      monthsToAddDays.push(monthstring[i]);
                    }

                    // Calculate totalAvailableDays by summing numberofdays for each month
                    monthsToAddDays.forEach((month) => {
                      const monthIndex = monthstring.indexOf(month);
                      // Add numberofdays for the month
                      if (monthIndex !== -1) {
                        // If the month is before the current month or is the current month, add numberofdays
                        if (monthIndex <= currentMonth) {
                          totalAvailableDays += numberofdays;
                        }
                      }
                    });

                    // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                    if (monthsToAddDays.includes(monthstring[currentMonth])) {
                      // Adjust based on the current day of the month
                      const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                      const daysPassedInCurrentMonth = currentDate.getDate();
                      totalAvailableDays -= daysPassedInCurrentMonth;
                      totalAvailableDays += daysInCurrentMonth;
                    }
                  }
                }

                let remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                // If pendingleave is true, add the remaining days from the previous year to the total available days
                if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                  remainingLeaveDays += (oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) - withinRangeCountLastYear;
                } else {
                  remainingLeaveDays = (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
                }
                setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
              }
            }
          }
        });

        setLeavecriterias(filteredData);
      }
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchLeaveCriteriaEdit = async (empname, empdepartment, empdesignation, leavetype, empdoj, empid) => {
    try {
      let res_leavecriteria = await axios.post(
        SERVICE.LEAVECRITERIA_FOR_APPLY_LEAVE,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          empname: empname,
          empdept: empdepartment,
          empdesg: empdesignation,
          leavetype: leavetype,
        }
      );

      // let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });

      let currentDate = new Date();
      // let total = res_status.data.departmentdetails.filter((dep) => {
      //   if (dep.department === empdepartment && Number(dep.year) === currentDate.getFullYear()) {
      //     return dep;
      //   }
      // });

      let res_status = await axios.post(
        SERVICE.DEPTMONTHSET_LIMITED_WITH_DEPT,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          empdepartment: empdepartment,
          year: String(currentDate.getFullYear()),
        }
      );

      let total = res_status.data.departmentdetails;

      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let answer =
        isUserRoleAccess?.role?.includes("Manager") ||
          isUserRoleCompare.includes("lassignleaveapply")
          ? res_vendor?.data?.applyleaves
          : res_vendor?.data?.applyleaves.filter(
            (data) => data.employeename === isUserRoleAccess.companyname
          );

      // let filteredData = res_leavecriteria?.data?.leavecriterias?.filter((d) => {
      //   if (d.mode === 'Employee' && d.employee?.includes(empname) && d.leavetype === leavetype) {
      //     return d;
      //   }
      //   else if (d.mode === 'Designation' && d.designation?.includes(empdesignation) && d.leavetype === leavetype) {
      //     return d;
      //   }
      //   else if (d.mode === 'Department' && d.department?.includes(empdepartment) && d.leavetype === leavetype) {
      //     return d;
      //   }
      //   // if ((d.employee?.includes(empname) || d.department?.includes(empdepartment) || d.designation?.includes(empdesignation)) && d.leavetype === leavetype) {
      //   //   return d;
      //   // }
      // })

      let filteredData = res_leavecriteria?.data?.leavecriterias;

      let doj = new Date(empdoj);
      let monthsDiff =
        (currentDate.getFullYear() - doj.getFullYear()) * 12 +
        (currentDate.getMonth() - doj.getMonth());
      let yearsDiff = currentDate.getFullYear() - doj.getFullYear();

      let monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];

      let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empid: empid,
      });

      let noticeresult = res?.data?.noticeperiodapply;

      filteredData?.forEach((d) => {
        let comparedYear =
          d.pendingleave === true ? parseInt(d.pendingfromyear) : "";
        let comparedMonth = d.pendingleave === true ? d.pendingfrommonth : "";

        let finalanswer = answer.filter((d) => {
          if (d.employeeid === empid && d.leavetype === leavetype) {
            return d.date;
          }
        });

        let previousYearData = [];
        if (d.pendingleave === true) {
          let res_statuspre = axios.post(
            SERVICE.DEPTMONTHSET_LIMITED_WITH_DEPT,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              empdepartment: empdepartment,
              year: String(comparedYear),
            }
          );

          previousYearData.push(res_statuspre.data.departmentdetails);
        } else {
          previousYearData = [];
        }

        // let previousYearData = res_status.data.departmentdetails?.filter((dep) => {
        //   if (dep.department === empdepartment && Number(dep.year) === comparedYear) {
        //     return dep;
        //   }
        // });

        let yearStartDate = total[0]?.fromdate;
        let yearEndDate = total[total?.length - 1]?.todate;

        let lastYearStartDate =
          previousYearData?.length > 0 ? previousYearData[0]?.fromdate : "";
        let lastYearEndDate =
          previousYearData?.length > 0
            ? previousYearData[previousYearData?.length - 1]?.todate
            : "";

        // To get Previous year's leave count
        let withinRangeCountLastYear = 0;
        finalanswer.forEach((leave) => {
          leave.date.forEach((leaveDate) => {
            const [day, month, year] = leaveDate.split("/");

            const date = new Date(`${month}/${day}/${year}`);

            // Convert yearStartDate and yearEndDate to Date objects if they're not already
            const startDate = new Date(lastYearStartDate);
            const endDate = new Date(lastYearEndDate);

            // Check if date is between startDate and endDate (inclusive)
            if (date >= startDate && date <= endDate) {
              // Increment the counter if date is within the range
              withinRangeCountLastYear++;
            } else {
            }
          });
        });

        // To get Current year's leave count
        let withinRangeCount = 0;
        finalanswer.forEach((leave) => {
          leave.date.forEach((leaveDate) => {
            const [day, month, year] = leaveDate.split("/");
            const date = new Date(`${month}/${day}/${year}`);

            const startDate = new Date(yearStartDate);
            const endDate = new Date(yearEndDate);

            // Check if date is between startDate and endDate (inclusive)
            if (date >= startDate && date <= endDate) {
              // Increment the counter if date is within the range
              withinRangeCount++;
            } else {
            }
          });
        });

        // check the experience month is completed or not
        let comparedMonthValue =
          `${d.experience} ${d.experiencein}` === "1 Month"
            ? 1
            : `${d.experience} ${d.experiencein}` === "2 Month"
              ? 2
              : `${d.experience} ${d.experiencein}` === "3 Month"
                ? 3
                : `${d.experience} ${d.experiencein}` === "4 Month"
                  ? 4
                  : `${d.experience} ${d.experiencein}` === "5 Month"
                    ? 5
                    : `${d.experience} ${d.experiencein}` === "6 Month"
                      ? 6
                      : 0;

        // Calculate the year difference
        let comparedYearValue =
          `${d.experience} ${d.experiencein}` === "1 Year"
            ? 1
            : `${d.experience} ${d.experiencein}` === "2 Year"
              ? 2
              : `${d.experience} ${d.experiencein}` === "3 Year"
                ? 3
                : `${d.experience} ${d.experiencein}` === "4 Year"
                  ? 4
                  : `${d.experience} ${d.experiencein}` === "5 Year"
                    ? 5
                    : `${d.experience} ${d.experiencein}` === "6 Year"
                      ? 6
                      : 0;

        if (d.uninformedleave === true) {
          setLeaveRestrictionEdit(true);
        }

        // check auto increase
        if (d.leaveautocheck === true && d.leaveautodays === "Month") {
          // Applicable From
          if (d.experiencein === "Year" &&
            // yearsDiff <= comparedYearValue
            yearsDiff <= d.experience
          ) {
            setAvailableDaysEdit("");
            setPopupContentMalert("You are in Training");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            d.experiencein === "Month" &&
            // monthsDiff <= comparedMonthValue
            monthsDiff <= d.experience
          ) {
            setAvailableDaysEdit("");
            setPopupContentMalert("You are in Training");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            noticeresult.length > 0 &&
            d.leavefornoticeperiod === false
          ) {
            setPopupContentMalert(
              "You are in notice period. Cannot apply leave"
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else {
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();

            const doj = new Date(empdoj);
            const dojYear = doj.getFullYear();
            const dojMonth = doj.getMonth();
            const dojDate = doj.getDate();

            let totalAvailableDaysLastYear = 0;
            const lastYear = currentDate.getFullYear() - 1;

            // Check if the user has completed one month from their date of joining
            const oneMonthPassedLastYear =
              lastYear > dojYear ||
              (lastYear === dojYear && currentMonth > dojMonth) ||
              (lastYear === dojYear &&
                currentMonth === dojMonth &&
                currentDate.getDate() >= dojDate);

            if (parseInt(d.leaveautoincrease) === 1) {
              if (oneMonthPassedLastYear) {
                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                const numberofdaysLastYear = parseInt(d.numberofdays);
                const pendingFromMonthLastYear =
                  monthstring.indexOf(comparedMonth);

                for (
                  let i = pendingFromMonthLastYear;
                  i <= currentMonth;
                  i += leaveAutoIncreaseLastYear
                ) {
                  // for (let i = 0; i <= currentMonth; i++) {
                  totalAvailableDaysLastYear += numberofdaysLastYear;
                }
                // if (currentDate.getDate() > dojDate) {
                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                // }
              } else {
                if (currentDate.getDate() > dojDate) {
                  totalAvailableDaysLastYear -= currentDate.getDate() - dojDate;
                }
              }
            } else {
              if (oneMonthPassedLastYear) {
                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                const numberofdaysLastYear = parseInt(d.numberofdays);
                const monthsToAddDaysLastYear = [];
                const pendingFromMonthLastYear =
                  monthstring.indexOf(comparedMonth);

                // Create an array of months based on leaveautoincrease
                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                for (
                  let i = pendingFromMonthLastYear;
                  i < currentMonth;
                  i += leaveAutoIncreaseLastYear
                ) {
                  monthsToAddDaysLastYear.push(monthstring[i]);
                }

                // Calculate totalAvailableDays by summing numberofdays for each month
                monthsToAddDaysLastYear.forEach((month) => {
                  const monthIndexLastYear = monthstring.indexOf(month);
                  // Add numberofdays for the month
                  if (monthIndexLastYear !== -1) {
                    // If the month is before the current month or is the current month, add numberofdays
                    if (monthIndexLastYear <= currentMonth) {
                      totalAvailableDaysLastYear += numberofdaysLastYear;
                    }
                  }
                });

                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                if (
                  monthsToAddDaysLastYear.includes(monthstring[currentMonth])
                ) {
                  // Adjust based on the current day of the month
                  const daysInCurrentMonthLastYear = new Date(
                    lastYear,
                    currentMonth + 1,
                    0
                  ).getDate();
                  const daysPassedInCurrentMonthLastYear =
                    currentDate.getDate();
                  totalAvailableDaysLastYear -=
                    daysPassedInCurrentMonthLastYear;
                  totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                }
              }
            }

            // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
            let totalAvailableDays = 0;

            // Check if the user has completed one month from their date of joining
            const oneMonthPassed =
              currentYear > dojYear ||
              (currentYear === dojYear && currentMonth > dojMonth) ||
              (currentYear === dojYear &&
                currentMonth === dojMonth &&
                currentDate.getDate() >= dojDate);

            if (parseInt(d.leaveautoincrease) === 1) {
              if (oneMonthPassed) {
                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                const numberofdays = parseInt(d.numberofdays);
                const pendingFromMonth = monthstring.indexOf(
                  total[0]?.monthname
                );

                for (
                  let i = pendingFromMonth;
                  i <= currentMonth;
                  i += leaveAutoIncrease
                ) {
                  // for (let i = 0; i <= currentMonth; i++) {
                  totalAvailableDays += numberofdays;
                }
              } else {
                if (
                  currentDate.getDate() > dojDate &&
                  currentMonth <= dojMonth
                ) {
                  totalAvailableDays -= currentDate.getDate() - dojDate;
                }
              }
            } else {
              if (oneMonthPassed) {
                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                const numberofdays = parseInt(d.numberofdays);
                const monthsToAddDays = [];
                const pendingFromMonth = monthstring.indexOf(
                  total[0]?.monthname
                );

                // Create an array of months based on leaveautoincrease
                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                for (
                  let i = pendingFromMonth;
                  i < currentMonth;
                  i += leaveAutoIncrease
                ) {
                  monthsToAddDays.push(monthstring[i]);
                }

                // Calculate totalAvailableDays by summing numberofdays for each month
                monthsToAddDays.forEach((month) => {
                  const monthIndex = monthstring.indexOf(month);
                  // Add numberofdays for the month
                  if (monthIndex !== -1) {
                    // If the month is before the current month or is the current month, add numberofdays
                    if (monthIndex <= currentMonth) {
                      totalAvailableDays += numberofdays;
                    }
                  }
                });

                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                  // Adjust based on the current day of the month
                  const daysInCurrentMonth = new Date(
                    currentYear,
                    currentMonth + 1,
                    0
                  ).getDate();
                  const daysPassedInCurrentMonth = currentDate.getDate();
                  totalAvailableDays -= daysPassedInCurrentMonth;
                  totalAvailableDays += daysInCurrentMonth;
                }
              }
            }

            let remainingLeaveDays =
              (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

            // If pendingleave is true, add the remaining days from the previous year to the total available days
            if (
              d.pendingleave === true &&
              monthsDiff > 12 &&
              currentDate.getFullYear() > comparedYear
            ) {
              remainingLeaveDays +=
                (oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) -
                withinRangeCountLastYear;
            } else {
              remainingLeaveDays =
                (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
            }
            setAvailableDaysEdit(
              remainingLeaveDays < 0 ? 0 : remainingLeaveDays
            );
          }
        } else if (d.leaveautocheck === true && d.leaveautodays === "Year") {
          // Applicable From
          if (d.experiencein === "Year" &&
            // yearsDiff <= comparedYearValue
            yearsDiff <= d.experience
          ) {
            setAvailableDaysEdit("");
            setPopupContentMalert("You are in Training");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            d.experiencein === "Month" &&
            // monthsDiff <= comparedMonthValue
            monthsDiff <= d.experience
          ) {
            setAvailableDaysEdit("");

            setPopupContentMalert("You are in Training");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            noticeresult.length > 0 &&
            d.leavefornoticeperiod === false
          ) {
            setPopupContentMalert(
              "You are in notice period. Cannot apply leave"
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          }
          // else {

          //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

          //   // Adjust totalAvailableDays based on leaveautoincrease value
          //   if (parseInt(d.leaveautoincrease) > 1) {
          //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
          //     const pendingFromYear = comparedYear;
          //     const currentYear = currentDate.getFullYear() - 1;

          //     const yearsToAddDays = currentYear - pendingFromYear;

          //     // Multiply the number of days by the leaveautoincrease value
          //     totalAvailableDaysLastYear *= Math.floor(yearsToAddDays / leaveAutoIncrease);
          //   }

          //   let totalAvailableDays = parseInt(d.numberofdays);

          //   // Adjust totalAvailableDays based on leaveautoincrease value
          //   if (parseInt(d.leaveautoincrease) > 1) {
          //     const leaveAutoIncrease = parseInt(d.leaveautoincrease);
          //     const pendingFromYear = parseInt(total[0]?.year);
          //     const currentYear = currentDate.getFullYear();

          //     const yearsToAddDays = currentYear - pendingFromYear;

          //     // Multiply the number of days by the leaveautoincrease value
          //     totalAvailableDays *= Math.floor(yearsToAddDays / leaveAutoIncrease);
          //   }

          //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

          //   // If pendingleave is true, add the remaining days from the previous year to the total available days
          //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
          //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
          //   } else {
          //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
          //   }

          //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
          // }
          else {
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();

            const doj = new Date(empdoj);
            const dojYear = doj.getFullYear();
            const dojMonth = doj.getMonth();
            const dojDate = doj.getDate();

            let totalAvailableDaysLastYear = 0;
            const lastYear = currentDate.getFullYear() - 1;

            // Check if the user has completed one month from their date of joining
            const oneMonthPassedLastYear =
              lastYear > dojYear ||
              (lastYear === dojYear && currentMonth > dojMonth) ||
              (lastYear === dojYear &&
                currentMonth === dojMonth &&
                currentDate.getDate() >= dojDate);

            if (parseInt(d.leaveautoincrease) === 1) {
              if (oneMonthPassedLastYear) {
                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                const numberofdaysLastYear =
                  parseInt(d.numberofdays) / parseInt(d.numberofdays);
                const pendingFromMonthLastYear =
                  monthstring.indexOf(comparedMonth);

                for (
                  let i = pendingFromMonthLastYear;
                  i <= currentMonth;
                  i += leaveAutoIncreaseLastYear
                ) {
                  // for (let i = 0; i <= currentMonth; i++) {
                  totalAvailableDaysLastYear += numberofdaysLastYear;
                }
                // if (currentDate.getDate() > dojDate) {
                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                // }
              } else {
                if (currentDate.getDate() > dojDate) {
                  totalAvailableDaysLastYear -= currentDate.getDate() - dojDate;
                }
              }
            } else {
              if (oneMonthPassedLastYear) {
                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                const numberofdaysLastYear =
                  parseInt(d.numberofdays) / parseInt(d.numberofdays);
                const monthsToAddDaysLastYear = [];
                const pendingFromMonthLastYear =
                  monthstring.indexOf(comparedMonth);

                // Create an array of months based on leaveautoincrease
                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                for (
                  let i = pendingFromMonthLastYear;
                  i < currentMonth;
                  i += leaveAutoIncreaseLastYear
                ) {
                  monthsToAddDaysLastYear.push(monthstring[i]);
                }

                // Calculate totalAvailableDays by summing numberofdays for each month
                monthsToAddDaysLastYear.forEach((month) => {
                  const monthIndexLastYear = monthstring.indexOf(month);
                  // Add numberofdays for the month
                  if (monthIndexLastYear !== -1) {
                    // If the month is before the current month or is the current month, add numberofdays
                    if (monthIndexLastYear <= currentMonth) {
                      totalAvailableDaysLastYear += numberofdaysLastYear;
                    }
                  }
                });

                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                if (
                  monthsToAddDaysLastYear.includes(monthstring[currentMonth])
                ) {
                  // Adjust based on the current day of the month
                  const daysInCurrentMonthLastYear = new Date(
                    lastYear,
                    currentMonth + 1,
                    0
                  ).getDate();
                  const daysPassedInCurrentMonthLastYear =
                    currentDate.getDate();
                  totalAvailableDaysLastYear -=
                    daysPassedInCurrentMonthLastYear;
                  totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                }
              }
            }

            // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
            let totalAvailableDays = 0;

            // Check if the user has completed one month from their date of joining
            const oneMonthPassed =
              currentYear > dojYear ||
              (currentYear === dojYear && currentMonth > dojMonth) ||
              (currentYear === dojYear &&
                currentMonth === dojMonth &&
                currentDate.getDate() >= dojDate);

            if (parseInt(d.leaveautoincrease) === 1) {
              if (oneMonthPassed) {
                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                const numberofdays =
                  parseInt(d.numberofdays) / parseInt(d.numberofdays);
                const pendingFromMonth = monthstring.indexOf(
                  total[0]?.monthname
                );

                for (
                  let i = pendingFromMonth;
                  i <= currentMonth;
                  i += leaveAutoIncrease
                ) {
                  // for (let i = 0; i <= currentMonth; i++) {
                  totalAvailableDays += numberofdays;
                }
              } else {
                if (
                  currentDate.getDate() > dojDate &&
                  currentMonth <= dojMonth
                ) {
                  totalAvailableDays -= currentDate.getDate() - dojDate;
                }
              }
            } else {
              if (oneMonthPassed) {
                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                const numberofdays =
                  parseInt(d.numberofdays) / parseInt(d.numberofdays);
                const monthsToAddDays = [];
                const pendingFromMonth = monthstring.indexOf(
                  total[0]?.monthname
                );

                // Create an array of months based on leaveautoincrease
                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                for (
                  let i = pendingFromMonth;
                  i < currentMonth;
                  i += leaveAutoIncrease
                ) {
                  monthsToAddDays.push(monthstring[i]);
                }

                // Calculate totalAvailableDays by summing numberofdays for each month
                monthsToAddDays.forEach((month) => {
                  const monthIndex = monthstring.indexOf(month);
                  // Add numberofdays for the month
                  if (monthIndex !== -1) {
                    // If the month is before the current month or is the current month, add numberofdays
                    if (monthIndex <= currentMonth) {
                      totalAvailableDays += numberofdays;
                    }
                  }
                });

                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                  // Adjust based on the current day of the month
                  const daysInCurrentMonth = new Date(
                    currentYear,
                    currentMonth + 1,
                    0
                  ).getDate();
                  const daysPassedInCurrentMonth = currentDate.getDate();
                  totalAvailableDays -= daysPassedInCurrentMonth;
                  totalAvailableDays += daysInCurrentMonth;
                }
              }
            }

            let remainingLeaveDays =
              (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

            // If pendingleave is true, add the remaining days from the previous year to the total available days
            if (
              d.pendingleave === true &&
              monthsDiff > 12 &&
              currentDate.getFullYear() > comparedYear
            ) {
              remainingLeaveDays +=
                (oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) -
                withinRangeCountLastYear;
            } else {
              remainingLeaveDays =
                (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
            }
            setAvailableDaysEdit(
              remainingLeaveDays < 0 ? 0 : remainingLeaveDays
            );
          }
        } else if (
          d.leaveautocheck === false &&
          (d.leaveautodays === "Month" || d.leaveautodays === "Year")
        ) {
          // Applicable From
          if (d.experiencein === "Year" &&
            // yearsDiff <= comparedYearValue
            yearsDiff <= d.experience
          ) {
            setAvailableDaysEdit("");
            setPopupContentMalert("You are in Training");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            d.experiencein === "Month" &&
            // monthsDiff <= comparedMonthValue
            monthsDiff <= d.experience
          ) {
            setAvailableDaysEdit("");

            setPopupContentMalert("You are in Training");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            noticeresult.length > 0 &&
            d.leavefornoticeperiod === false
          ) {
            setPopupContentMalert(
              "You are in notice period. Cannot apply leave"
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          }
          // else {

          //   let totalAvailableDaysLastYear = parseInt(d.numberofdays);

          //   let totalAvailableDays = parseInt(d.numberofdays);
          //   let remainingLeaveDays = totalAvailableDays - withinRangeCount;

          //   // If pendingleave is true, add the remaining days from the previous year to the total available days
          //   if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
          //     remainingLeaveDays += (totalAvailableDaysLastYear - withinRangeCountLastYear);
          //   } else {
          //     remainingLeaveDays = totalAvailableDays - withinRangeCount;
          //   }

          //   setAvailableDays(remainingLeaveDays < 0 ? 0 : remainingLeaveDays);
          // }
          else {
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();

            const doj = new Date(empdoj);
            const dojYear = doj.getFullYear();
            const dojMonth = doj.getMonth();
            const dojDate = doj.getDate();

            let totalAvailableDaysLastYear = 0;
            const lastYear = currentDate.getFullYear() - 1;

            // Check if the user has completed one month from their date of joining
            const oneMonthPassedLastYear =
              lastYear > dojYear ||
              (lastYear === dojYear && currentMonth > dojMonth) ||
              (lastYear === dojYear &&
                currentMonth === dojMonth &&
                currentDate.getDate() >= dojDate);

            if (parseInt(d.leaveautoincrease) === 1) {
              if (oneMonthPassedLastYear) {
                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                const numberofdaysLastYear =
                  d.leaveautodays === "Year"
                    ? parseInt(d.numberofdays) / parseInt(d.numberofdays)
                    : parseInt(d.numberofdays);
                const pendingFromMonthLastYear =
                  monthstring.indexOf(comparedMonth);

                for (
                  let i = pendingFromMonthLastYear;
                  i <= currentMonth;
                  i += leaveAutoIncreaseLastYear
                ) {
                  // for (let i = 0; i <= currentMonth; i++) {
                  totalAvailableDaysLastYear += numberofdaysLastYear;
                }
                // if (currentDate.getDate() > dojDate) {
                //   totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                // }
              } else {
                if (currentDate.getDate() > dojDate) {
                  totalAvailableDaysLastYear -= currentDate.getDate() - dojDate;
                }
              }
            } else {
              if (oneMonthPassedLastYear) {
                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                const numberofdaysLastYear =
                  d.leaveautodays === "Year"
                    ? parseInt(d.numberofdays) / parseInt(d.numberofdays)
                    : parseInt(d.numberofdays);
                const monthsToAddDaysLastYear = [];
                const pendingFromMonthLastYear =
                  monthstring.indexOf(comparedMonth);

                // Create an array of months based on leaveautoincrease
                // for (let i = 0; i < 12; i += leaveAutoIncreaseLastYear) {
                for (
                  let i = pendingFromMonthLastYear;
                  i < currentMonth;
                  i += leaveAutoIncreaseLastYear
                ) {
                  monthsToAddDaysLastYear.push(monthstring[i]);
                }

                // Calculate totalAvailableDays by summing numberofdays for each month
                monthsToAddDaysLastYear.forEach((month) => {
                  const monthIndexLastYear = monthstring.indexOf(month);
                  // Add numberofdays for the month
                  if (monthIndexLastYear !== -1) {
                    // If the month is before the current month or is the current month, add numberofdays
                    if (monthIndexLastYear <= currentMonth) {
                      totalAvailableDaysLastYear += numberofdaysLastYear;
                    }
                  }
                });

                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                if (
                  monthsToAddDaysLastYear.includes(monthstring[currentMonth])
                ) {
                  // Adjust based on the current day of the month
                  const daysInCurrentMonthLastYear = new Date(
                    lastYear,
                    currentMonth + 1,
                    0
                  ).getDate();
                  const daysPassedInCurrentMonthLastYear =
                    currentDate.getDate();
                  totalAvailableDaysLastYear -=
                    daysPassedInCurrentMonthLastYear;
                  totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                }
              }
            }

            // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
            let totalAvailableDays = 0;

            // Check if the user has completed one month from their date of joining
            const oneMonthPassed =
              currentYear > dojYear ||
              (currentYear === dojYear && currentMonth > dojMonth) ||
              (currentYear === dojYear &&
                currentMonth === dojMonth &&
                currentDate.getDate() >= dojDate);

            if (parseInt(d.leaveautoincrease) === 1) {
              if (oneMonthPassed) {
                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                const numberofdays =
                  d.leaveautodays === "Year"
                    ? parseInt(d.numberofdays) / parseInt(d.numberofdays)
                    : parseInt(d.numberofdays);
                const pendingFromMonth = monthstring.indexOf(
                  total[0]?.monthname
                );

                for (
                  let i = pendingFromMonth;
                  i <= currentMonth;
                  i += leaveAutoIncrease
                ) {
                  // for (let i = 0; i <= currentMonth; i++) {
                  totalAvailableDays += numberofdays;
                }
              } else {
                if (
                  currentDate.getDate() > dojDate &&
                  currentMonth <= dojMonth
                ) {
                  totalAvailableDays -= currentDate.getDate() - dojDate;
                }
              }
            } else {
              if (oneMonthPassed) {
                // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                const numberofdays =
                  d.leaveautodays === "Year"
                    ? parseInt(d.numberofdays) / parseInt(d.numberofdays)
                    : parseInt(d.numberofdays);
                const monthsToAddDays = [];
                const pendingFromMonth = monthstring.indexOf(
                  total[0]?.monthname
                );

                // Create an array of months based on leaveautoincrease
                // for (let i = 0; i < 12; i += leaveAutoIncrease) {
                for (
                  let i = pendingFromMonth;
                  i < currentMonth;
                  i += leaveAutoIncrease
                ) {
                  monthsToAddDays.push(monthstring[i]);
                }

                // Calculate totalAvailableDays by summing numberofdays for each month
                monthsToAddDays.forEach((month) => {
                  const monthIndex = monthstring.indexOf(month);
                  // Add numberofdays for the month
                  if (monthIndex !== -1) {
                    // If the month is before the current month or is the current month, add numberofdays
                    if (monthIndex <= currentMonth) {
                      totalAvailableDays += numberofdays;
                    }
                  }
                });

                // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                if (monthsToAddDays.includes(monthstring[currentMonth])) {
                  // Adjust based on the current day of the month
                  const daysInCurrentMonth = new Date(
                    currentYear,
                    currentMonth + 1,
                    0
                  ).getDate();
                  const daysPassedInCurrentMonth = currentDate.getDate();
                  totalAvailableDays -= daysPassedInCurrentMonth;
                  totalAvailableDays += daysInCurrentMonth;
                }
              }
            }

            let remainingLeaveDays =
              (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;

            // If pendingleave is true, add the remaining days from the previous year to the total available days
            if (
              d.pendingleave === true &&
              monthsDiff > 12 &&
              currentDate.getFullYear() > comparedYear
            ) {
              remainingLeaveDays +=
                (oneMonthPassedLastYear ? totalAvailableDaysLastYear : 0) -
                withinRangeCountLastYear;
            } else {
              remainingLeaveDays =
                (oneMonthPassed ? totalAvailableDays : 0) - withinRangeCount;
            }
            setAvailableDaysEdit(
              remainingLeaveDays < 0 ? 0 : remainingLeaveDays
            );
          }
        }
      });

      setLeavecriteriasEdit(filteredData);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  function multiLeaveStatusInputs(referenceIndex, inputvalue) {
    let shiftValue = 0;

    // Calculate shift value based on selected option
    if (inputvalue === "Shift") {
      shiftValue = 1;
    } else if (
      inputvalue === "Before Half Shift" ||
      inputvalue === "After Half Shift"
    ) {
      shiftValue = 0.5;
    }

    // Update isSubCategory state
    const updatedData = allUsers.map((value, index) => {
      if (referenceIndex === index) {
        return { ...value, leavestatus: inputvalue, shiftcount: shiftValue };
      } else {
        return value;
      }
    });

    setAllUsers(updatedData);

    // Calculate total shift value
    const totalShifts = updatedData.reduce((acc, cur) => {
      if (cur.leavestatus === "Shift") {
        return acc + 1;
      } else if (
        cur.leavestatus === "Before Half Shift" ||
        cur.leavestatus === "After Half Shift"
      ) {
        return acc + 0.5;
      }
      return acc;
    }, 0);

    // Update state
    setAppleave({ ...appleave, noofshift: totalShifts });
  }

  const handleDelete = (referenceIndex) => {
    let deleteIndex;

    let updatedData = allUsers.filter((value, index) => {
      if (referenceIndex != index) {
        return value;
      } else {
        if (allUsers[index + 1]) {
          deleteIndex = index;
        }
      }
      return false;
    });

    // Calculate total shift value
    const totalShifts = updatedData.reduce((acc, cur) => {
      if (cur.leavestatus === "Shift") {
        return acc + 1;
      } else if (
        cur.leavestatus === "Before Half Shift" ||
        cur.leavestatus === "After Half Shift"
      ) {
        return acc + 0.5;
      }
      return acc;
    }, 0);

    // Update state
    setAppleave({ ...appleave, noofshift: totalShifts, date: "", todate: "" });

    setAllUsers(updatedData);
    setGetSelectedDates(updatedData.map((d) => d.formattedDate));
  };

  function multiLeaveStatusInputsEdit(referenceIndex, inputvalue) {
    let shiftValue = 0;

    // Calculate shift value based on selected option
    if (inputvalue === "Shift") {
      shiftValue = 1;
    } else if (
      inputvalue === "Before Half Shift" ||
      inputvalue === "After Half Shift"
    ) {
      shiftValue = 0.5;
    }

    // Update isSubCategory state
    const updatedData = allUsersEdit.map((value, index) => {
      if (referenceIndex === index) {
        return { ...value, leavestatus: inputvalue, shiftcount: shiftValue };
      } else {
        return value;
      }
    });

    setAllUsersEdit(updatedData);

    // Calculate total shift value
    const totalShifts = updatedData.reduce((acc, cur) => {
      if (cur.leavestatus === "Shift") {
        return acc + 1;
      } else if (
        cur.leavestatus === "Before Half Shift" ||
        cur.leavestatus === "After Half Shift"
      ) {
        return acc + 0.5;
      }
      return acc;
    }, 0);

    // Update state
    setAppleaveEdit({ ...appleaveEdit, noofshift: totalShifts });
  }

  const handleDeleteEdit = (referenceIndex) => {
    let deleteIndex;

    let updatedData = allUsersEdit.filter((value, index) => {
      if (referenceIndex != index) {
        return value;
      } else {
        if (allUsersEdit[index + 1]) {
          deleteIndex = index;
        }
      }
      return false;
    });

    // Calculate total shift value
    const totalShifts = updatedData.reduce((acc, cur) => {
      if (cur.leavestatus === "Shift") {
        return acc + 1;
      } else if (
        cur.leavestatus === "Before Half Shift" ||
        cur.leavestatus === "After Half Shift"
      ) {
        return acc + 0.5;
      }
      return acc;
    }, 0);

    // Update state
    setAppleaveEdit({
      ...appleaveEdit,
      noofshift: totalShifts,
      date: "",
      todate: "",
    });

    setAllUsersEdit(updatedData);
    setGetSelectedDatesEdit(updatedData.map((d) => d.formattedDate));
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    setBtnSubmit(true);
    let comp = selectedOptionsCompany.map((item) => item.value);
    let bran = selectedOptionsBranch.map((item) => item.value);
    let unit = selectedOptionsUnit.map((item) => item.value);
    let team = selectedOptionsTeam.map((item) => item.value);

    const currentDate = moment();

    const isAnyPastDate = allUsers.some((user) => {
      const userDate = moment(user.formattedDate, "DD/MM/YYYY");
      return userDate.isBefore(currentDate, "day");
    });

    const isAnyPastDateForCommon = allUsers.some((user) => {
      const userDate = moment(user.formattedDate, "DD/MM/YYYY");
      return userDate.isSameOrBefore(currentDate, "day");
    });

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

    let empid = Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode;
    const [res, resEmpDetails] = await Promise.all([
      axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empid: empid,
      }),
      axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      ),
    ]);

    let empDetails = resEmpDetails?.data?.users[0];
    let noticeresult = res?.data?.noticeperiodapply;

    let finalAllUsers = allUsers.map((d) => {
      return { ...d, shiftmode: d.shiftMode, tookleavecheckstatus: "Single" };
    });
    try {
      let subprojectscreate = await axios.post(SERVICE.APPLYLEAVE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: Accessdrop === "HR" ? [appleave?.company] : [empDetails?.company],
        branch: Accessdrop === "HR" ? [appleave?.branch] : [empDetails?.branch],
        unit: Accessdrop === "HR" ? [appleave?.unit] : [empDetails?.unit],
        team: Accessdrop === "HR" ? [appleave?.team] : [empDetails?.team],
        employeename:
          Accessdrop === "HR"
            ? String(appleave.employeename)
            : isUserRoleAccess.companyname,
        employeeid:
          Accessdrop === "HR"
            ? String(appleave.employeeid)
            : isUserRoleAccess.empcode,
        leavetype: String(appleave.leavetype),
        access: Accessdrop,
        // date: String(appleave.date),
        // todate: String(appleave.todate),
        date: [...getSelectedDates],
        numberofdays: String(allUsers.length),
        usershifts: [...finalAllUsers],
        noofshift: Number(appleave.noofshift),
        durationtype: String(appleave.durationtype),
        availabledays: Number(availableDays),
        reasonforleave: String(appleave.reasonforleave),
        department: String(appleave.department),
        designation: String(appleave.designation),
        doj: String(appleave.doj),
        weekoff: appleave.weekoff,
        workmode: String(appleave.workmode),
        // reportingto:
        //   Accessdrop === "HR"
        //     ? String(appleave.reportingto)
        //     : isUserRoleAccess.reportingto,
        status: String("Applied"),
        uninformedleavestatus: String(
          leaveRestriction === true && isAnyPastDate ? "Uninformed" : ""
        ),
        noticeperiodstatus: String(
          noticeresult.length > 0 ? "Noticeperiod" : ""
        ),
        rejectedreason: String(""),
        tookleavecheckstatus: String("Single"),
        commonuninformedleavestatus: isAnyPastDateForCommon ? "Uninformed" : "Informed",
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchApplyleave();
      handleCloseModHistory();

      setLeave("Please Select LeaveType");
      setAppleave({
        ...appleave,
        employeename: "Please Select Employee Name",
        employeeid: "",
        leavetype: "Please Select LeaveType",
        durationtype: "Random",
        availabledays: "",
        date: "", company: "",
        branch: "",
        unit: "",
        team: "",
        todate: "",
        reasonforleave: "",
        reportingto: "",
        noofshift: "",
      });
      setAllUsers([]);
      setGetSelectedDates([]);
      setAvailableDays("");
      // setValueCompanyCat([]);
      // setSelectedOptionsCompany([]);
      // setValueBranchCat([]);
      // setSelectedOptionsBranch([]);
      // setValueUnitCat([]);
      // setSelectedOptionsUnit([]);
      // setValueTeamCat([]);
      // setSelectedOptionsTeam([]);
      setBranchOption([]);
      setUnitOption([]);
      setTeamOption([]);
      // setEmpname([]);
      handleCloseerrForTookLeaveCheck();
      setBtnSubmit(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      setBtnSubmit(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendRequestDouble = async () => {
    setPageName(!pageName);
    let comp = selectedOptionsCompany.map((item) => item.value);
    let bran = selectedOptionsBranch.map((item) => item.value);
    let unit = selectedOptionsUnit.map((item) => item.value);
    let team = selectedOptionsTeam.map((item) => item.value);

    const currentDate = moment();

    const isAnyPastDate = allUsers.some((user) => {
      const userDate = moment(user.formattedDate, "DD/MM/YYYY");
      return userDate.isBefore(currentDate, "day");
    });

    const isAnyPastDateForCommon = allUsers.some((user) => {
      const userDate = moment(user.formattedDate, "DD/MM/YYYY");
      return userDate.isSameOrBefore(currentDate, "day");
    });

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

    let empid = Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode;
    // let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
    //   headers: {
    //     Authorization: `Bearer ${auth.APIToken}`,
    //   },
    //   empid: empid,
    // });
    const [res, resEmpDetails] = await Promise.all([
      axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empid: empid,
      }),
      axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      ),
    ]);

    let noticeresult = res?.data?.noticeperiodapply;

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

    let dayNamesArray = [];
    allUsers.forEach((all) => {
      tookLeaveDaysWithAllUsers.map((val) => {
        const [day, month, year] = all.formattedDate.split("/").map(Number);

        if (
          parseInt(val.year) === year &&
          val.month === monthstring[month - 1] &&
          val.week === all.weekNumberInMonth
        ) {
          dayNamesArray.push(val.day);
        }
      });
    });
    let finalNoOfShiftCount;
    let uniqueDayNames = Array.from(new Set(dayNamesArray.map((t) => t)));
    let empDetails = resEmpDetails?.data?.users[0];
    let finalAllUsers = allUsers.map((d) => {
      if (uniqueDayNames.includes(d.dayName)) {
        if (leaveCriteriaLopDays === "Double Day / Double LOP") {
          return { ...d, tookleavecheckstatus: "Double", shiftmode: d.shiftMode };
        } else if (leaveCriteriaLopDays === "Single Day consider as Double day") {
          finalNoOfShiftCount = d.leavestatus === "Shift" ? 2 : 1;
          return { ...d, tookleavecheckstatus: "Double Day", shiftcount: d.leavestatus === "Shift" ? 2 : 1, shiftmode: d.shiftMode };
        } else {
          return { ...d, tookleavecheckstatus: "Single", shiftmode: d.shiftMode };
        }
      } else {
        return { ...d, tookleavecheckstatus: "Single", shiftmode: d.shiftMode };
      }
    });
    // console.log(leaveCriteriaLopDays, 'leaveCriteriaLopDays')
    // console.log(finalAllUsers, 'finalAllUsers')
    // console.log(finalNoOfShiftCount)

    try {
      let subprojectscreate = await axios.post(SERVICE.APPLYLEAVE_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // company: [appleave?.company],
        // branch: [appleave?.branch],
        // unit: [appleave?.unit],
        // team: [appleave?.team],
        company: Accessdrop === "HR" ? [appleave?.company] : [empDetails?.company],
        branch: Accessdrop === "HR" ? [appleave?.branch] : [empDetails?.branch],
        unit: Accessdrop === "HR" ? [appleave?.unit] : [empDetails?.unit],
        team: Accessdrop === "HR" ? [appleave?.team] : [empDetails?.team],
        employeename:
          Accessdrop === "HR"
            ? String(appleave.employeename)
            : isUserRoleAccess.companyname,
        employeeid:
          Accessdrop === "HR"
            ? String(appleave.employeeid)
            : isUserRoleAccess.empcode,
        leavetype: String(appleave.leavetype),
        access: Accessdrop,
        // date: String(appleave.date),
        // todate: String(appleave.todate),
        date: [...getSelectedDates],
        numberofdays: String(allUsers.length),
        usershifts: [...finalAllUsers],
        noofshift: finalNoOfShiftCount,
        durationtype: String(appleave.durationtype),
        availabledays: Number(availableDays),
        reasonforleave: String(appleave.reasonforleave),
        department: String(appleave.department),
        designation: String(appleave.designation),
        doj: String(appleave.doj),
        weekoff: appleave.weekoff,
        workmode: String(appleave.workmode),
        // reportingto:
        //   Accessdrop === "HR"
        //     ? String(appleave.reportingto)
        //     : isUserRoleAccess.reportingto,
        status: String("Applied"),
        uninformedleavestatus: String(
          leaveRestriction === true && isAnyPastDate ? "Uninformed" : ""
        ),
        noticeperiodstatus: String(
          noticeresult.length > 0 ? "Noticeperiod" : ""
        ),
        rejectedreason: String(""),
        tookleavecheckstatus: String("Double"),
        commonuninformedleavestatus: isAnyPastDateForCommon ? "Uninformed" : "Informed",
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchApplyleave();
      setLeave("Please Select LeaveType");
      setAppleave({
        ...appleave,
        employeename: "Please Select Employee Name",
        employeeid: "",
        leavetype: "Please Select LeaveType",
        durationtype: "Random",
        availabledays: "", company: "",
        branch: "",
        unit: "",
        team: "",
        date: "",
        todate: "",
        reasonforleave: "",
        reportingto: "",
        noofshift: "",
      });
      setAllUsers([]);
      setGetSelectedDates([]);
      setAvailableDays("");
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
      handleCloseerrForTookLeaveCheck();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Function to find the day before and after a given day name
  function getDayBeforeAndAfter(dayName) {
    const index = daysOfWeek.indexOf(dayName);
    const beforeIndex = index === 0 ? 6 : index - 1; // Wrap around to Saturday if Sunday
    const afterIndex = index === 6 ? 0 : index + 1; // Wrap around to Sunday if Saturday
    return [daysOfWeek[beforeIndex], daysOfWeek[afterIndex]];
  }

  const [selectedEmpData, setSelectedEmpData] = useState({});
  const [selectedEmpDataUpdate, setSelectedEmpDataUpdate] = useState({});
  const [historyOverAllData, setHistoryOverAllData] = useState([]);
  const [historyMonthData, setHistoryMonthData] = useState([]);
  const [historyOverAllDataUpdate, setHistoryOverAllDataUpdate] = useState([]);
  const [historyMonthDataUpdate, setHistoryMonthDataUpdate] = useState([]);

  const fetchLeaveHistory = async () => {
    try {
      let empname = Accessdrop === "HR" ? appleave.employeename : isUserRoleAccess.companyname;
      let empid = Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode;
      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      let res_vendor = await axios.post(SERVICE.APPLYLEAVE_EMPLOYEEID_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        employeeid: empid,
      });

      let uninformResult = res_vendor?.data?.applyleaves;
      // console.log(uninformResult, 'uninformResult')
      if (uninformResult?.length > 0) {

        // Filter for the current month's data
        const monthlyData = uninformResult.filter((item) => {
          return item.date.some((date) => {
            const leaveDate = new Date(date.split("/").reverse().join("-"));

            return (
              leaveDate.getMonth() + 1 === currentMonth &&
              leaveDate.getFullYear() === currentYear
            );
          });
        });

        // Function to calculate leave counts grouped by leavetype
        const calculateLeaveCounts = (data, type) => {
          return data.reduce((acc, item) => {
            const key = `${item.employeeid}_${item.leavetype}`;

            if (!acc[key]) {
              acc[key] = {
                employeename: item.employeename,
                employeeid: item.employeeid,
                leavetype: item.leavetype,
                approvedCount: 0,
                appliedCount: 0,
                rejectedCount: 0,
                uninformedCount: 0,
              };
            }

            // Loop through all dates to count leaves separately for each date
            item.date.forEach((date) => {
              const leaveDate = new Date(date.split("/").reverse().join("-"));

              if (type === 'Month' && leaveDate.getMonth() + 1 === currentMonth && leaveDate.getFullYear() === currentYear) {

                // Count Approved, Applied, and Rejected statuses
                if (item.status === "Approved") {
                  acc[key].approvedCount += 1;
                } else if (item.status === "Applied") {
                  acc[key].appliedCount += 1;
                } else if (item.status === "Rejected") {
                  acc[key].rejectedCount += 1;
                }
              }
              else {
                // Count Approved, Applied, and Rejected statuses
                if (item.status === "Approved") {
                  acc[key].approvedCount += 1;
                } else if (item.status === "Applied") {
                  acc[key].appliedCount += 1;
                } else if (item.status === "Rejected") {
                  acc[key].rejectedCount += 1;
                }
              }
              if (item.commonuninformedleavestatus === "Uninformed") {
                acc[key].uninformedCount += 1;
              }
              setSelectedEmpData({ employeename: item.employeename, employeeid: item.employeeid });
            });
            return acc;
          }, {});
        };

        // Calculate leave counts for overall and monthly data
        const overallLeaveCounts = calculateLeaveCounts(uninformResult, 'Overall');
        const monthlyLeaveCounts = calculateLeaveCounts(monthlyData, 'Month');

        // Transform the counts object into an array format
        const transformCounts = (counts) => Object.values(counts);

        setHistoryOverAllData(transformCounts(overallLeaveCounts));
        setHistoryMonthData(transformCounts(monthlyLeaveCounts));
      } else {
        setSelectedEmpData({ employeename: empname, employeeid: empid });
        setHistoryOverAllData([]);
        setHistoryMonthData([]);
      }
      handleSubmit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  const fetchLeaveHistoryUpdate = async (empid, empname) => {
    try {
      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      let res_vendor = await axios.post(SERVICE.APPLYLEAVE_EMPLOYEEID_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        employeeid: empid,
      });

      let uninformResult = res_vendor?.data?.applyleaves;

      if (uninformResult?.length > 0) {

        // Filter for the current month's data
        const monthlyData = uninformResult.filter((item) => {
          return item.date.some((date) => {
            const leaveDate = new Date(date.split("/").reverse().join("-"));

            return (
              leaveDate.getMonth() + 1 === currentMonth &&
              leaveDate.getFullYear() === currentYear
            );
          });
        });

        // Function to calculate leave counts grouped by leavetype
        const calculateLeaveCounts = (data) => {
          return data.reduce((acc, item) => {
            const key = `${item.employeeid}_${item.leavetype}`;

            if (!acc[key]) {
              acc[key] = {
                employeename: item.employeename,
                employeeid: item.employeeid,
                leavetype: item.leavetype,
                approvedCount: 0,
                appliedCount: 0,
                rejectedCount: 0,
                uninformedCount: 0,
              };
            }

            // Loop through all dates to count leaves separately for each date
            item.date.forEach((date, type) => {
              const leaveDate = new Date(date.split("/").reverse().join("-"));

              if (type === 'Month' && leaveDate.getMonth() + 1 === currentMonth && leaveDate.getFullYear() === currentYear) {
                // Count Approved, Applied, and Rejected statuses
                if (item.status === "Approved") {
                  acc[key].approvedCount += 1;
                } else if (item.status === "Applied") {
                  acc[key].appliedCount += 1;
                } else if (item.status === "Rejected") {
                  acc[key].rejectedCount += 1;
                }
              }
              else {
                // Count Approved, Applied, and Rejected statuses
                if (item.status === "Approved") {
                  acc[key].approvedCount += 1;
                } else if (item.status === "Applied") {
                  acc[key].appliedCount += 1;
                } else if (item.status === "Rejected") {
                  acc[key].rejectedCount += 1;
                }
              }
              if (item.commonuninformedleavestatus === "Uninformed") {
                acc[key].uninformedCount += 1;
              }
              setSelectedEmpDataUpdate({ employeename: item.employeename, employeeid: item.employeeid });
            });
            return acc;
          }, {});
        };

        // Calculate leave counts for overall and monthly data
        const overallLeaveCounts = calculateLeaveCounts(uninformResult, 'Overall');
        const monthlyLeaveCounts = calculateLeaveCounts(monthlyData, 'Month');

        // Transform the counts object into an array format
        const transformCounts = (counts) => Object.values(counts);

        setHistoryOverAllDataUpdate(transformCounts(overallLeaveCounts));
        setHistoryMonthDataUpdate(transformCounts(monthlyLeaveCounts));
      } else {
        setSelectedEmpData({ employeename: empname, employeeid: empid });
        setHistoryOverAllData([]);
        setHistoryMonthData([]);
      }
      handleClickOpenHistoryUpdate();

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  }

  //submit option for saving
  const handleSubmit = async () => {
    // e.preventDefault();
    // setApplyleavecheckHistory(true);
    const checkLeaveStatus = allUsers?.find((d) => d.leavestatus === "");
    // const isNameMatch = applyleaves.some(item => item.reasonforleave.toLowerCase() === (appleave.reasonforleave).toLowerCase() && item.employeename === appleave.employeename && item.leavetype === leave && item.date === appleave.date && item.todate === appleave.todate);

    let empid = Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode;
    let empbranch = Accessdrop === "HR" ? appleave.branch : isUserRoleAccess.branch;

    let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empid: empid,
    });
    let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let res_limitcontrol = await axios.post(SERVICE.LIMITCONTROLSETTING_BRANCH_FILTER_FOR_LEAVE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      branch: empbranch,
    });
    const limitResult = res_limitcontrol.data.limitcontrolsettings;
    const isNameMatch = res_vendor?.data?.applyleaves.some(
      (item) =>
        item.employeename === appleave.employeename &&
        item.date === appleave.date &&
        item.todate === appleave.todate
    );

    let uninformResult = res_vendor?.data?.applyleaves
      .filter(
        (item) =>
          item.employeeid === empid &&
          item.uninformedleavestatus === "Uninformed"
      )
      .flatMap((d) => d.date);
    let noticeresult = res?.data?.noticeperiodapply;
    let noticeresultDate = res_vendor?.data?.applyleaves
      .filter(
        (item) =>
          item.employeeid === empid &&
          item.noticeperiodstatus === "Noticeperiod"
      )
      .flatMap((d) => d.date);
    let result = res_vendor?.data?.applyleaves
      .filter((item) => item.employeeid === empid)
      .flatMap((d) => d.date);

    let checkDuplicateDates = allUsers.some((d) =>
      result.includes(d.formattedDate)
    );

    let checkWkOffForLWP = allUsers.find(data => data.shift === 'Week Off');
    let checkNAForLWP = allUsers.find(data => data.shift === 'Not Allotted');

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
    } else if (Accessdrop === "HR" && appleave.employeename === "Please Select Employee Name") {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (appleave.leavetype === "Please Select LeaveType") {
      setPopupContentMalert("Please Select Leave Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    //  else if (appleave.leavetype === "Leave Without Pay (LWP)" && checkWkOffForLWP) {
    //   setPopupContentMalert(`You cannot apply leave on Week Off date ${checkWkOffForLWP.formattedDate}`);
    //   setPopupSeverityMalert("warning");
    //   handleClickOpenPopupMalert();
    // }
    else if (appleave.leavetype === "Leave Without Pay (LWP)" && checkNAForLWP) {
      setPopupContentMalert(`Shift is not assigned on ${checkNAForLWP.formattedDate}. You cannot apply leave.`);
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (allUsers.length === 0) {
      setPopupContentMalert("Please click plus button to add leave");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (checkDuplicateDates) {
      setPopupContentMalert("Date Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (appleave.noofshift === "") {
      setPopupContentMalert("Please Select All Leave");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (checkLeaveStatus) {
      setPopupContentMalert("Please Select All Leave");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (appleave.reasonforleave === "") {
      setPopupContentMalert("Please Enter Reason for Leave");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      if (leavecriterias.length > 0) {
        let weekoff = [];
        let updatedDatesWeekOffDates = [];

        allUsersWithPrevNext.filter((day) => {
          if (day.shift === "Week Off") {
            weekoff.push(day.dayName);
            updatedDatesWeekOffDates.push(day.formattedDate);
          }
        });
        leavecriterias.forEach((d) => {
          let hasWeekOffDay, beforeDay, afterDay, hasBeforeDay, hasAfterDay;
          // let dayNamesArray = [];

          let check = allUsers.length > parseInt(d.uninformedleavecount);
          let uninformedcheck =
            uninformResult.length >= parseInt(d.uninformedleavecount);
          let noticeperiodcheck =
            noticeresultDate.length >= parseInt(d.leavefornoticeperiodcount);
          let check2 = allUsers.length > parseInt(d.leavefornoticeperiodcount);

          const currentDate = moment();

          const isAnyPastDate = allUsers.some((user) => {
            const userDate = moment(user.formattedDate, "DD/MM/YYYY");
            return userDate.isBefore(currentDate, "day");
          });

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

          // allUsers.forEach((all) => {
          //   d.tookleave.map((val) => {
          //     const [day, month, year] = all.formattedDate.split('/').map(Number);
          //     if ((parseInt(val.year) === year) && (val.month === monthstring[month - 1]) && (val.week === all.weekNumberInMonth)) {

          //       dayNamesArray.push(val.day);
          //     }
          //   })
          // })

          let userDaysArray = [];

          allUsers.forEach((all) => {
            let dayNamesArray = [];

            d.tookleave.forEach((val) => {
              const [day, month, year] = all.formattedDate
                .split("/")
                .map(Number);

              if (
                parseInt(val.year) === year &&
                val.month === monthstring[month - 1] &&
                val.week === all.weekNumberInMonth
              ) {
                dayNamesArray.push(val.day);
              }
            });

            userDaysArray.push(dayNamesArray); // Save the result for each user
          });

          let uniqueDayNames = Array.from(
            new Set(userDaysArray.flatMap((t) => t))
          );
          const checkTookLeaveDays = allUsers.some((val) =>
            uniqueDayNames.includes(val.dayName)
          );
          weekoff?.forEach((empwkoffday) => {
            // find out weekoff's before and after dayname
            [beforeDay, afterDay] = getDayBeforeAndAfter(empwkoffday);
            hasBeforeDay = allUsers.some((user) => user.dayName === beforeDay);
            hasAfterDay = allUsers.some((user) => user.dayName === afterDay);
            hasWeekOffDay = allUsers.some((user) =>
              updatedDatesWeekOffDates.includes(user.formattedDate)
            );
          });

          if (d.leaverespecttoweekoff === true && (hasBeforeDay || hasAfterDay) && !hasWeekOffDay) {
            setPopupContentMalert(`Please select Weekoff date (${updatedDatesWeekOffDates.map((d) => d)}) with these selected date`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.leaverespecttoweekoff === false && hasAfterDay) {
            setPopupContentMalert(`You cannot take leave on ${afterDay}`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.leaverespecttoweekoff === false && hasBeforeDay) {
            setPopupContentMalert(`You cannot take leave on ${beforeDay}`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (availableDays == "" || availableDays == 0) {
            setPopupContentMalert("No More Available Leave");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (checkNAForLWP) {
            setPopupContentMalert(`Shift is not assigned on ${checkNAForLWP.formattedDate}. You cannot apply leave.`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (allUsers.length > availableDays) {
            setPopupContentMalert("You applied leave more than available days");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.leaverespecttotraining === false && appleave.workmode === "Internship") {
            setPopupContentMalert("You are in training period. Cannot apply leave");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (noticeresult.length > 0 && d.leavefornoticeperiod === false) {
            setPopupContentMalert("You are in notice period. Cannot apply leave");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.tookleavecheck === false && checkTookLeaveDays) {
            setPopupContentMalert(`You are not allowed to take leave on ${allUsers.filter((val) => uniqueDayNames.includes(val.dayName)).map((day) => day.dayName)}`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.uninformedleave === true && isAnyPastDate && check) {
            setPopupContentMalert(`You can only apply for ${d.uninformedleavecount} days of leave for an uninformed case.`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.uninformedleave === true && isAnyPastDate && uninformedcheck && !check) {
            setPopupContentMalert(`You have already applied Uninformed Leave`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (noticeresult.length > 0 && d.leavefornoticeperiod === true && check2) {
            setPopupContentMalert(`You can apply only ${d.leavefornoticeperiodcount} days of leave`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (noticeresult.length > 0 && d.leavefornoticeperiod === true && noticeperiodcheck && !check2) {
            setPopupContentMalert(`You have already applied leave in the noticeperiod`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else {
            if (d.tookleavecheck === true && checkTookLeaveDays) {
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon style={{ fontSize: "3.5rem", color: "orange" }} />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>{`You are not allowed to take leave on ${allUsers
                    .filter((val) => uniqueDayNames.includes(val.dayName))
                    .map(
                      (day) => day.dayName
                    )}. If you want to apply leave on this day it will be calculate as a ${d.lopdays}. Do you want to apply?`}</p>
                </>
              );
              handleClickOpenerrForTookLeaveCheck();
            }
            else if (d.branchlimitcheck === false) {
              handleClickOpenHistory();
              // sendRequest();
            }
            else if (d.branchlimitcheck === true) {
              const checkCurrentDateData = [];
              if (limitResult.length > 0) {
                res_vendor?.data?.applyleaves.map((item) => {
                  if (item.branch?.includes(limitResult[0].branch) && limitResult[0].modulename === "Leave&Permission" && limitResult[0].submodulename === "Leave" && limitResult[0].mainpagename === "Apply Leave") {
                    allUsers.forEach((val) => {
                      if (item.date?.includes(val.formattedDate)) {
                        checkCurrentDateData.push(item)
                      }
                    })
                  }
                });
              }

              if (limitResult.length === 0) {
                // setApplyleavecheckHistory(false);
                setPopupContentMalert(`This branch does not have any data matches. Kindly contact the administrator to confirm the 'Limit Control Settings'.`);
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              }
              else if (limitResult.length > 0 && checkCurrentDateData.length >= Number(limitResult[0].limit)) {
                // setApplyleavecheckHistory(false);
                setPopupContentMalert("The limit for applying today has been reached!");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
              }
              else {
                // setApplyleavecheckHistory(false);
                handleClickOpenHistory();
                // sendRequest();
              }
            }
          }
        });
      } else {
        // setApplyleavecheckHistory(false);
        handleClickOpenHistory();
        // sendRequest();
      }
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setLeave("Please Select LeaveType");
    setAppleave({
      employeename: "Please Select Employee Name",
      employeeid: "",
      leavetype: "Please Select LeaveType",
      durationtype: "Random",
      date: "",
      todate: "", company: "",
      branch: "",
      unit: "",
      team: "",
      reasonforleave: "",
      reportingto: "",
      noofshift: "",
      availabledays: "",
    });
    setAllUsers([]);
    setAvailableDays("");
    setGetSelectedDates([]);
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
    else if (selectedLeaveType.length === 0) {
      setPopupContentMalert("Please Select Leave Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    else if (filterUser.fromdate === '' && filterUser.todate === '') {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      fetchApplyleave();
    }
  };

  const handleClearFilter = async (e) => {
    e.preventDefault();
    setApplyleaves([]);
    setFilteredDataItems([]);
    setFilterUser({ filtertype: "Individual" });
    setSelectedCompany([]);
    setSelectedBranch([]);
    setSelectedUnit([]);
    setSelectedTeam([]);
    setSelectedEmp([]);
    setSelectedLeaveType([]);
    setValueCompany([]);
    setValueBranch([]);
    setValueUnit([]);
    setValueTeam([]);
    setValueEmp([]);
    setValueLeaveType([]);
    setPageApplyLeave(1);
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
  const getCode = async (e, name) => {
    try {
      let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAppleaveEdit(res?.data?.sapplyleave);
      setLeaveId(res?.data?.sapplyleave._id);
      setAccesDropEdit(res?.data?.sapplyleave.access);
      setLeaveEdit(res?.data?.sapplyleave.leavetype);
      setAllUsersEdit(res?.data?.sapplyleave.usershifts);
      setGetSelectedDatesEdit(res?.data?.sapplyleave.date);
      setSelectedOptionsCompanyEdit(
        res?.data?.sapplyleave?.company.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsBranchEdit(
        res?.data?.sapplyleave?.branch.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsUnitEdit(
        res?.data?.sapplyleave?.unit.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsTeamEdit(
        res?.data?.sapplyleave?.team.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setValueCompanyCatEdit(res?.data?.sapplyleave?.company);
      setValueBranchCatEdit(res?.data?.sapplyleave?.branch);
      setValueUnitCatEdit(res?.data?.sapplyleave?.unit);
      setValueTeamCatEdit(res?.data?.sapplyleave?.team);
      await fetchApplyleaveAll();
      fetchLeaveCriteriaEdit(
        AccessdropEdit === "HR"
          ? res?.data?.sapplyleave.employeename
          : isUserRoleAccess.companyname,
        AccessdropEdit === "HR"
          ? res?.data?.sapplyleave.department
          : isUserRoleAccess.department,
        AccessdropEdit === "HR"
          ? res?.data?.sapplyleave.designation
          : isUserRoleAccess.designation,
        res?.data?.sapplyleave.leavetype,
        AccessdropEdit === "HR"
          ? res?.data?.sapplyleave.doj
          : isUserRoleAccess.doj,
        AccessdropEdit === "HR"
          ? res?.data?.sapplyleave.employeeid
          : isUserRoleAccess.empcode
      );

      setAvailableDaysEdit(res?.data?.sapplyleave?.availabledays);

      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_vendor?.data?.applyleaves
        .filter(
          (item) =>
            item._id !== res?.data?.sapplyleave._id &&
            item.employeeid === res?.data?.sapplyleave.employeeid
        )
        .flatMap((d) => d.date);
      setCheckDuplicateEdit(result);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const getinfoCodeStatus = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSelectStatus(res?.data?.sapplyleave);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAppleaveEdit(res?.data?.sapplyleave);
      handleClickOpenview();
      setAllUsersEdit(res?.data?.sapplyleave.usershifts);
      setSelectedOptionsCompanyEdit(
        res?.data?.sapplyleave?.company.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsBranchEdit(
        res?.data?.sapplyleave?.branch.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsUnitEdit(
        res?.data?.sapplyleave?.unit.map((item) => ({
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsTeamEdit(
        res?.data?.sapplyleave?.team.map((item) => ({
          label: item,
          value: item,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.APPLYLEAVE_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAppleaveEdit(res?.data?.sapplyleave);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //Project updateby edit page...
  let updateby = appleaveEdit?.updatedby;
  let addedby = appleaveEdit?.addedby;
  let updatedByStatus = selectStatus.updatedby;

  let subprojectsid = appleaveEdit?._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    let comp = selectedOptionsCompanyEdit.map((item) => item.value);
    let bran = selectedOptionsBranchEdit.map((item) => item.value);
    let unit = selectedOptionsUnitEdit.map((item) => item.value);
    let team = selectedOptionsTeamEdit.map((item) => item.value);

    const currentDate = moment();

    const isAnyPastDate = allUsersEdit.some((user) => {
      const userDate = moment(user.formattedDate, "DD/MM/YYYY");
      return userDate.isBefore(currentDate, "day");
    });

    let empid =
      Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode;
    let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empid: empid,
    });

    let noticeresult = res?.data?.noticeperiodapply;

    try {
      let res = await axios.put(`${SERVICE.APPLYLEAVE_SINGLE}/${leaveId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: comp,
        branch: bran,
        unit: unit,
        team: team,
        employeename:
          AccessdropEdit === "HR"
            ? String(appleaveEdit.employeename)
            : isUserRoleAccess.companyname,
        employeeid:
          AccessdropEdit === "HR"
            ? String(appleaveEdit.employeeid)
            : isUserRoleAccess.empcode,
        leavetype: String(appleaveEdit.leavetype),
        // date: String(appleaveEdit.date),
        // todate: String(appleaveEdit.todate),
        // numberofdays: String(calculateDaysDifferenceEdit()),
        department: String(appleaveEdit.department),
        designation: String(appleaveEdit.designation),
        doj: String(appleaveEdit.doj),
        weekoff: appleaveEdit.weekoff,
        workmode: String(appleaveEdit.workmode),
        date: [...getSelectedDatesEdit],
        numberofdays: String(allUsersEdit.length),
        usershifts: [...allUsersEdit],
        noofshift: Number(appleaveEdit.noofshift),
        durationtype: String(appleaveEdit.durationtype),
        availabledays: Number(
          appleaveEdit.availabledays
            ? appleaveEdit.availabledays
            : availableDaysEdit
        ),
        reasonforleave: String(appleaveEdit.reasonforleave),
        // reportingto:
        //   AccessdropEdit === "HR"
        //     ? String(appleaveEdit.reportingto)
        //     : isUserRoleAccess.reportingto,
        uninformedleavestatus: String(
          appleaveEdit.uninformedleavestatus
            ? appleaveEdit.uninformedleavestatus
            : leaveRestrictionEdit === true && isAnyPastDate
              ? "Uninformed"
              : ""
        ),
        noticeperiodstatus: String(
          appleaveEdit.noticeperiodstatus
            ? appleaveEdit.noticeperiodstatus
            : noticeresult
              ? "Noticeperiod"
              : ""
        ),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      await fetchApplyleave();
      handleCloseModEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    const checkLeaveStatus = allUsersEdit?.find((d) => d.leavestatus === "");

    fetchApplyleaveAll();

    let empid =
      AccessdropEdit === "HR"
        ? appleaveEdit.employeeid
        : isUserRoleAccess.empcode;
    let res = await axios.post(SERVICE.NOTICEPERIODAPPLY_FOR_LEAVE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empid: empid,
    });

    let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let uninformResult = res_vendor?.data?.applyleaves
      .filter(
        (item) =>
          item._id !== appleaveEdit._id &&
          item.employeeid === empid &&
          item.uninformedleavestatus === "Uninformed"
      )
      .flatMap((d) => d.date);
    let noticeresult = res?.data?.noticeperiodapply;
    let noticeresultDate = res_vendor?.data?.applyleaves
      .filter(
        (item) =>
          item._id !== appleaveEdit._id &&
          item.employeeid === empid &&
          item.noticeperiodstatus === "Noticeperiod"
      )
      .flatMap((d) => d.date);

    const isNameMatch = allApplyleaveedit.some(
      (item) =>
        item.reasonforleave.toLowerCase() ===
        appleaveEdit.reasonforleave.toLowerCase() &&
        item.employeename === appleaveEdit.employeename &&
        item.leavetype === leaveEdit &&
        item.date === appleaveEdit.date &&
        item.todate === appleaveEdit.todate
    );

    if (appleaveEdit.employeename === "Please Select Employee Name") {
      setPopupContentMalert("Please Select Employee Name");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (appleaveEdit.availabledays == "") {
      setPopupContentMalert("No More Available Leave");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (allUsersEdit.length > appleaveEdit.availabledays) {
      setPopupContentMalert("You applied leave more than available days");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (appleaveEdit.leavetype === "Please Select LeaveType") {
      setPopupContentMalert("Please Select Leave Type");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    }
    // else if (appleaveEdit.date === "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    // else if (appleaveEdit.todate === "") {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (allUsersEdit.length === 0) {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (appleaveEdit.noofshift === "") {
      setPopupContentMalert("Please Select All Leave");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (checkLeaveStatus) {
      setPopupContentMalert("Please Select All Leave");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (appleaveEdit.reasonforleave === "") {
      setPopupContentMalert("Please Enter Reason for Leave");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Name Already Exists!");
      setPopupSeverityMalert("warning");
      handleClickOpenPopupMalert();
    } else {
      let weekoff = AccessdropEdit === "HR" ? appleaveEdit.weekoff : isUserRoleAccess.weekoff;
      leavecriteriasEdit.forEach((d) => {
        let check = allUsersEdit.length > parseInt(d.uninformedleavecount);
        let uninformedcheck = uninformResult.length >= parseInt(d.uninformedleavecount);
        let noticeperiodcheck = noticeresultDate.length >= parseInt(d.leavefornoticeperiodcount);
        let check2 = allUsersEdit.length > parseInt(d.leavefornoticeperiodcount);

        const currentDate = moment();

        const isAnyPastDate = allUsersEdit.some((user) => {
          const userDate = moment(user.formattedDate, "DD/MM/YYYY");
          return userDate.isBefore(currentDate, "day");
        });

        weekoff?.forEach((empwkoffday) => {
          // find out weekoff's before and after dayname
          const [beforeDay, afterDay] = getDayBeforeAndAfter(empwkoffday);

          const hasBeforeDay = allUsersEdit.some((user) => user.dayName === beforeDay);
          const hasAfterDay = allUsersEdit.some((user) => user.dayName === afterDay);
          // const hasWeekOffDay = allUsersEdit.some(user => user.dayName === empwkoffday);

          const hasBeforeDayDate = allUsersEdit
            .filter((user) => user.dayName === beforeDay)
            .map((d) => d.formattedDate);
          const hasAfterDayDate = allUsersEdit
            .filter((user) => user.dayName === afterDay)
            .map((d) => d.formattedDate);

          let updatedDatesBeforeWeekOffDates = [];
          let updatedDatesAfterWeekOffDates = [];

          //for example if selected date is monday
          hasAfterDayDate.forEach((date) => {
            const [day, month, year] = date.split("/");
            const currentDate = new Date(`${year}-${month}-${day}`);

            // Get the day before
            const dayBefore = new Date(currentDate);
            dayBefore.setDate(currentDate.getDate() - 1);
            const formattedDayBefore = `${dayBefore.getDate()}`.padStart(
              2,
              "0"
            );
            const formattedMonthBefore = `${dayBefore.getMonth() + 1}`.padStart(
              2,
              "0"
            );
            updatedDatesBeforeWeekOffDates.push(
              `${formattedDayBefore}/${formattedMonthBefore}/${dayBefore.getFullYear()}`
            );
          });

          hasBeforeDayDate.forEach((date) => {
            const [day, month, year] = date.split("/");
            const currentDate = new Date(`${year}-${month}-${day}`);

            // Get the day after
            const dayAfter = new Date(currentDate);
            dayAfter.setDate(currentDate.getDate() + 1);
            const formattedDayAfter = `${dayAfter.getDate()}`.padStart(2, "0");
            const formattedMonthAfter = `${dayAfter.getMonth() + 1}`.padStart(
              2,
              "0"
            );
            updatedDatesAfterWeekOffDates.push(
              `${formattedDayAfter}/${formattedMonthAfter}/${dayAfter.getFullYear()}`
            );
          });

          const hasWeekOffDayNext = allUsersEdit.some((user) =>
            updatedDatesAfterWeekOffDates.includes(user.formattedDate)
          );
          const hasWeekOffDayBefore = allUsersEdit.some((user) =>
            updatedDatesBeforeWeekOffDates.includes(user.formattedDate)
          );

          if (
            d.leaverespecttoweekoff === false &&
            hasBeforeDay &&
            !hasWeekOffDayNext &&
            !hasWeekOffDayBefore
          ) {
            setPopupContentMalert(
              `Please select Weekoff date (${updatedDatesAfterWeekOffDates.map(
                (d) => d
              )}, ${updatedDatesBeforeWeekOffDates.map(
                (d) => d
              )}) with these selected date`
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            d.leaverespecttoweekoff === true &&
            hasAfterDay &&
            !hasWeekOffDayBefore &&
            !hasWeekOffDayNext
          ) {
            setPopupContentMalert(
              `Please select Weekoff date(${updatedDatesBeforeWeekOffDates.map(
                (d) => d
              )}) with these selected date`
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.leaverespecttoweekoff === false && hasAfterDay) {
            setPopupContentMalert(`You cannot take leave on ${afterDay}`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.leaverespecttoweekoff === false && hasBeforeDay) {
            setPopupContentMalert(`You cannot take leave on ${beforeDay}`);
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            d.leaverespecttotraining === false &&
            appleaveEdit.workmode === "Internship"
          ) {
            setPopupContentMalert(
              `You are in training period. Cannot apply leave`
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            noticeresult.length > 0 &&
            d.leavefornoticeperiod === false
          ) {
            setPopupContentMalert(
              `You are in notice period. Cannot apply leave`
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            allUsersEdit.some((val) =>
              d.tookleave.includes(val.dayName.toLowerCase())
            )
          ) {
            setPopupContentMalert(
              `You are not allowed to take leave on ${d.tookleave.map((d) =>
                d.toUpperCase()
              )}`
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (d.uninformedleave === true && isAnyPastDate && check) {
            setPopupContentMalert(
              `You can apply only ${d.uninformedleavecount} days of leave`
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            d.uninformedleave === true &&
            isAnyPastDate &&
            uninformedcheck &&
            !check
          ) {
            setPopupContentMalert("You have already applied Uninformed Leave");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            noticeresult.length > 0 &&
            d.leavefornoticeperiod === true &&
            check2
          ) {
            setPopupContentMalert(
              `You can apply only ${d.leavefornoticeperiodcount} days of leave`
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else if (
            noticeresult.length > 0 &&
            d.leavefornoticeperiod === true &&
            noticeperiodcheck &&
            !check2
          ) {
            setPopupContentMalert(
              "You have already applied leave in the noticeperiod"
            );
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
          } else {
            sendEditRequest();
          }
        });
      });
    }
  };

  const sendEditStatus = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.APPLYLEAVE_SINGLE}/${selectStatus._id}`,
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
      await fetchApplyleave();
      handleStatusClose();
      handleCloseerr();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

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
    } else if (selectStatus.status == "Approved") {
      if (isAssigned) {
        if (isCheckList) {
          handleClickOpenEditCheckList();
        } else {
          setPopupContentMalert(
            <>
              Please Fill the Checklist. Click this link:{" "}
              <a
                href="/interview/myinterviewchecklist"
                target="_blank"
                rel="noopener noreferrer"
              >
                My Checklist
              </a>
            </>
          );
          setPopupSeverityMalert("warning");
          handleClickOpenPopupMalert();
        }
      }
      else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Checklist is Not Assigned for this Page. Wish to continue?"}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } else {
      sendEditStatus();
    }
  };

  //get all Sub vendormasters.
  const fetchApplyleave = async () => {
    setPageName(!pageName);
    setApplyleavecheck(true);
    try {

      let res_vendor = await axios.post(SERVICE.APPLYLEAVE_LIST_FILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        type: filterUser.filtertype,
        company: [...valueCompany],
        branch: [...valueBranch],
        unit: [...valueUnit],
        team: [...valueTeam],
        employee: [...valueEmp],
        leavetype: [...valueLeaveType],
        assignbranch: accessbranch,
      });
      let answer = res_vendor?.data?.applyleaves;

      // Employees month error history based on the department month set
      const groupedMonthData = res_vendor?.data?.applyleaves?.reduce((acc, item) => {
        const {
          _id, employeeid, employeename, leavetype, date, noofshift, reasonforleave, status
        } = item;

        // Initialize entry if not present
        if (!acc[employeeid]) {
          acc[employeeid] = {
            _id, employeeid, employeename, leavetype, date, noofshift, reasonforleave, status,
            appliedCount: 0, approvedCount: 0, rejectedCount: 0, uninformedCount: 0,
          };
        }

        // Calculate totalapply, totalapproved, totalreject, and totalamount
        acc[employeeid].appliedCount += item.status === "Applied";
        acc[employeeid].approvedCount += item.status === "Approved";
        acc[employeeid].rejectedCount += item.status === "Rejected";
        acc[employeeid].uninformedCount += item.commonuninformedleavestatus === "Uninformed";

        return acc;
      }, {});
      // console.log(groupedMonthData, 'groupedMonthData')
      // appliedCount: groupedItemMonth?.appliedCount || 0,
      //     approvedCount: groupedItemMonth?.approvedCount || 0,
      //     rejectedCount: groupedItemMonth?.rejectedCount || 0,

      const itemsWithSerialNumber = answer?.map((item, index) => {
        const groupedItemMonth = groupedMonthData[item.employeeid];
        return {
          ...item,
          id: item._id,
          serialNumber: index + 1,
          employeeid: item.employeeid,
          employeename: item.employeename,
          leavetype: item.leavetype,
          // date: item.date + "--" + item.todate,
          date: item.date,
          noofshift: item.noofshift,
          reasonforleave: item.reasonforleave,
          status: item.status,
        }
      });
      setApplyleaves(itemsWithSerialNumber);
      setFilteredDataItems(itemsWithSerialNumber);
      setTotalPagesApplyLeave(Math.ceil(answer.length / pageSizeApplyLeave));
      let Approve = res_vendor?.data?.applyleaves.filter((data) => data.status === "Approved")
      setIsApplyLeave(Approve);
      setApplyleavecheck(false);
    } catch (err) {
      setApplyleavecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchApplyleaveForEmployee = async () => {
    setPageName(!pageName);
    // setApplyleavecheck(true);
    try {
      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        }
      });

      let answer = res_vendor?.data?.applyleaves.filter(
        (data) => data.employeename === isUserRoleAccess.companyname
      );
      const itemsWithSerialNumber = answer?.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
        employeeid: item.employeeid,
        employeename: item.employeename,
        leavetype: item.leavetype,
        // date: item.date + "--" + item.todate,
        date: item.date,
        noofshift: item.noofshift,
        reasonforleave: item.reasonforleave,
        status: item.status,
      }));
      setApplyleaves(itemsWithSerialNumber);
      setFilteredDataItems(itemsWithSerialNumber);
      setTotalPagesApplyLeave(Math.ceil(answer.length / pageSizeApplyLeave));
      let Approve = res_vendor?.data?.applyleaves.filter(
        (data) =>
          data.employeename === isUserRoleAccess.companyname &&
          data.status === "Approved"
      );
      setIsApplyLeave(Approve);
      setApplyleavecheck(false);
    } catch (err) {
      setApplyleavecheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    if (!isUserRoleAccess?.role?.includes("Manager") ||
      !isUserRoleCompare.includes("lassignleaveapply")) {
      fetchApplyleaveForEmployee();
    }
  }, [])

  //get all Sub vendormasters.
  const fetchApplyleaveAll = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllApplyleaveedit(
        res_vendor?.data?.applyleaves.filter(
          (item) => item._id !== appleaveEdit._id
        )
      );
      let empid = Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode;
      let result = res_vendor?.data?.applyleaves
        .filter((item) => item.employeeid === empid)
        .flatMap((d) => d.date);
      setCheckDuplicate(result);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //id for login...
  let loginid = localStorage.LoginUserId;
  let authToken = localStorage.APIToken;

  useEffect(() => {
    // getexcelDatas();
  }, [appleaveEdit, appleave, checkDuplicate]);

  // useEffect(() => {
  //   fetchApplyleave();
  // }, []);

  // useEffect(() => {
  //   fetchApplyleaveAll();
  // }, [isEditOpen, appleaveEdit]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(applyleaves);
  }, [applyleaves]);

  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      resizable: true,
      filterParams: {
        buttons: ["apply", "reset", "cancel"],
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }, []);

  // Function to handle filter changes
  const onFilterChanged = () => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel(); // Get the current filter model

      // Check if filters are active
      if (Object.keys(filterModel).length === 0) {
        // No filters active, clear the filtered data state
        setFilteredRowData([]);
      } else {
        // Filters are active, capture filtered data
        const filteredData = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
          filteredData.push(node.data); // Collect filtered row data
        });
        setFilteredRowData(filteredData);
      }
    }
  };

  const onPaginationChanged = useCallback(() => {
    if (gridRefTableApplyLeave.current) {
      const gridApi = gridRefTableApplyLeave.current.api;
      const currentPage = gridApi.paginationGetCurrentPage() + 1;
      const totalPagesApplyLeave = gridApi.paginationGetTotalPages();
      setPageApplyLeave(currentPage);
      setTotalPagesApplyLeave(totalPagesApplyLeave);
    }
  }, []);

  // Pagination for innter filter
  const getVisiblePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    const startPage = Math.max(1, pageApplyLeave - 1);
    const endPage = Math.min(
      totalPagesApplyLeave,
      startPage + maxVisiblePages - 1
    );

    // Loop through and add visible pageApplyLeave numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // If there are more pages after the last visible pageApplyLeave, show ellipsis
    if (endPage < totalPagesApplyLeave) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };

  // Pagination for outer filter
  const filteredData = filteredDataItems?.slice(
    (pageApplyLeave - 1) * pageSizeApplyLeave,
    pageApplyLeave * pageSizeApplyLeave
  );
  const totalPagesApplyLeaveOuter = Math.ceil(
    filteredDataItems?.length / pageSizeApplyLeave
  );
  const visiblePages = Math.min(totalPagesApplyLeaveOuter, 3);
  const firstVisiblePage = Math.max(1, pageApplyLeave - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPagesApplyLeaveOuter
  );
  const pageNumbers = [];
  const indexOfLastItem = pageApplyLeave * pageSizeApplyLeave;
  const indexOfFirstItem = indexOfLastItem - pageSizeApplyLeave;
  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTableApplyLeave = [
    // {
    //   field: "checkbox",
    //   headerName: "Checkbox", // Default header name
    //   headerStyle: {
    //     fontWeight: "bold", // Apply the font-weight style to make the header text bold
    //     // Add any other CSS styles as needed
    //   },
    //   headerComponent: (params) => (
    //     <CheckboxHeader
    //       selectAllChecked={selectAllChecked}
    //       onSelectAll={() => {
    //         if (filteredData.length === 0) {
    //           // Do not allow checking when there are no rows
    //           return;
    //         }
    //         if (selectAllChecked) {
    //           setSelectedRows([]);
    //         } else {
    //           const allRowIds = filteredData.map((row) => row.id);
    //           setSelectedRows(allRowIds);
    //         }
    //         setSelectAllChecked(!selectAllChecked);
    //       }}
    //     />
    //   ),

    //   cellRenderer: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.data.id)}
    //       onChange={() => {
    //         let updatedSelectedRows;
    //         if (selectedRows.includes(params.data.id)) {
    //           updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.data.id);
    //         } else {
    //           updatedSelectedRows = [...selectedRows, params.data.id];
    //         }

    //         setSelectedRows(updatedSelectedRows);

    //         // Update the "Select All" checkbox based on whether all rows are selected
    //         setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
    //       }}
    //     />
    //   ),
    //   sortable: false, // Optionally, you can make this column not sortable
    //   width: 90,

    //   hide: !columnVisibilityApplyLeave.checkbox,
    //   headerClassName: "bold-header",
    // },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibilityApplyLeave.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "employeeid",
      headerName: "Employee Id",
      flex: 0,
      width: 150,
      hide: !columnVisibilityApplyLeave.employeeid,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "employeename",
      headerName: "Employee Name",
      flex: 0,
      width: 250,
      hide: !columnVisibilityApplyLeave.employeename,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "leavetype",
      headerName: "Leave Type",
      flex: 0,
      width: 160,
      hide: !columnVisibilityApplyLeave.leavetype,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 110,
      hide: !columnVisibilityApplyLeave.date,
      headerClassName: "bold-header",
    },
    {
      field: "noofshift",
      headerName: "Number of Shift",
      flex: 0,
      width: 120,
      hide: !columnVisibilityApplyLeave.noofshift,
      headerClassName: "bold-header",
    },
    {
      field: "reasonforleave",
      headerName: "Reason for Leave",
      flex: 0,
      width: 200,
      hide: !columnVisibilityApplyLeave.reasonforleave,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      width: 180,
      hide: !columnVisibilityApplyLeave.status,
      headerClassName: "bold-header",
      cellRenderer: (params) => {
        if (
          !(
            isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleCompare.includes("lassignleaveapply")
          ) &&
          !["Approved", "Rejected"].includes(params.data.status)
        ) {
          return (
            <Grid sx={{ display: "flex" }}>
              <Button
                variant="contained"
                style={{
                  margin: "5px",
                  backgroundColor: params.value === "Applied"
                    ? "#FFC300"
                    : params.value === "Rejected"
                      ? "red"
                      : params.value === "Cancelled" ?
                        "#FF4D00"
                        : params.value === "Approved"
                          ? "green"
                          : "inherit",
                  color: params.value === "Applied"
                    ? "black"
                    : params.value === "Rejected" || params.value === "Cancelled"
                      ? "white"
                      : "white",
                  fontSize: "10px",
                  width: params.value === "Cancelled" ? "70px" : "60px",
                  fontWeight: "bold",
                  cursor: "default",
                  paddingLeft: '10px',
                  paddingRight: '10px'
                }}
              >
                {params.value}
              </Button>
            </Grid>
          );
        } else {
          return (
            <Grid sx={{ display: "flex" }}>
              <Button
                variant="contained"
                style={{
                  margin: "5px",
                  backgroundColor: params.value === "Applied"
                    ? "#FFC300"
                    : params.value === "Rejected"
                      ? "red"
                      : params.value === "Cancelled" ?
                        "#FF4D00"
                        : params.value === "Approved"
                          ? "green"
                          : "inherit",
                  color: params.value === "Applied"
                    ? "black"
                    : params.value === "Rejected" || params.value === "Cancelled"
                      ? "white"
                      : "white",
                  fontSize: "10px",
                  width: params.value === "Cancelled" ? "70px" : "60px",
                  fontWeight: "bold",
                  cursor: "default",
                  paddingLeft: '10px',
                  paddingRight: '10px'
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
      width: 310,
      minHeight: "40px !important",
      filter: false,
      sortable: false,
      hide: !columnVisibilityApplyLeave.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {/* {(!(isUserRoleAccess?.role?.includes("Manager")) && ["Approved", "Rejected"].includes(params.data.status)) ||
                          (isUserRoleCompare?.includes("eapplyleave") && params.data.status !== 'Approved' && (
                            <Button
                              sx={userStyle.buttonedit}
                              onClick={() => {
                                handleClickOpenEdit();
                                getCode(params.data.id, params.data.name);
                              }}
                            >
                              <EditOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                          ))} */}
          {params.data.status === 'Applied' ?
            <Button sx={{ color: 'red' }} onClick={(e) => { getDataForUpdate(params.data.id); }}>Cancel</Button>
            : null}
          {(!(isUserRoleAccess?.role?.includes("Manager")) && ["Approved", "Rejected"].includes(params.data.status)) ||
            (isUserRoleCompare?.includes("dapplyleave") &&
              params.data.status !== "Approved" && params.data.status !== "Cancelled" && (
                <Button
                  sx={userStyle.buttondelete}
                  onClick={(e) => {
                    rowData(params.data.id, params.data.name);
                  }}
                >
                  <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                </Button>
              ))}
          {isUserRoleCompare?.includes("vapplyleave") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {(
            (isUserRoleAccess?.role?.includes("Manager") ||
              isUserRoleCompare.includes("lassignleaveapply")) &&
            ["Approved", "Rejected"].includes(params.data.status)) ||
            (isUserRoleCompare?.includes("iapplyleave") && (
              <Button
                sx={userStyle.buttonedit}
                onClick={() => {
                  getinfoCode(params.data.id);
                }}
              >
                <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
              </Button>
            ))}
          {!(isUserRoleAccess?.role?.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply"))
            ? null
            : isUserRoleCompare?.includes("iapplyleave") && (
              params.data.status !== "Cancelled" && (
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    style={{
                      margin: "5px",
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
                </Grid>
              ))}
        </Grid>
      ),
    },
  ];

  // Datatable
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQueryApplyLeave(value);
    applyNormalFilter(value);
    setFilteredRowData([]);
  };

  const applyNormalFilter = (searchValue) => {
    // Split the search query into individual terms
    const searchTerms = searchValue.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filtered = items?.filter((item) => {
      return searchTerms.every((term) =>
        Object.values(item).join(" ").toLowerCase().includes(term)
      );
    });
    setFilteredDataItems(filtered);
    setPageApplyLeave(1);
  };

  const applyAdvancedFilter = (filters, logicOperator) => {
    // Apply filtering logic with multiple conditions
    const filtered = items?.filter((item) => {
      return filters.reduce((acc, filter, index) => {
        const { column, condition, value } = filter;
        const itemValue = String(item[column])?.toLowerCase();
        const filterValue = String(value).toLowerCase();

        let match;
        switch (condition) {
          case "Contains":
            match = itemValue.includes(filterValue);
            break;
          case "Does Not Contain":
            match = !itemValue?.includes(filterValue);
            break;
          case "Equals":
            match = itemValue === filterValue;
            break;
          case "Does Not Equal":
            match = itemValue !== filterValue;
            break;
          case "Begins With":
            match = itemValue.startsWith(filterValue);
            break;
          case "Ends With":
            match = itemValue.endsWith(filterValue);
            break;
          case "Blank":
            match = !itemValue;
            break;
          case "Not Blank":
            match = !!itemValue;
            break;
          default:
            match = true;
        }

        // Combine conditions with AND/OR logic
        if (index === 0) {
          return match; // First filter is applied directly
        } else if (logicOperator === "AND") {
          return acc && match;
        } else {
          return acc || match;
        }
      }, true);
    });

    setFilteredDataItems(filtered); // Update filtered data
    setAdvancedFilter(filters);
    // handleCloseSearchApplyLeave(); // Close the popover after search
  };

  // Undo filter funtion
  const handleResetSearch = () => {
    setAdvancedFilter(null);
    setSearchQueryApplyLeave("");
    setFilteredDataItems(items);
  };

  // Show filtered combination in the search bar
  const getSearchDisplay = () => {
    if (advancedFilter && advancedFilter.length > 0) {
      return advancedFilter
        .map((filter, index) => {
          let showname = columnDataTableApplyLeave.find(
            (col) => col.field === filter.column
          )?.headerName;
          return `${showname} ${filter.condition} "${filter.value}"`;
        })
        .join(
          " " +
          (advancedFilter.length > 1 ? advancedFilter[1].condition : "") +
          " "
        );
    }
    return searchQueryApplyLeave;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesApplyLeave) {
      setPageApplyLeave(newPage);
      gridRefTableApplyLeave.current.api.paginationGoToPage(newPage - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSizeApplyLeave(newSize);
    if (gridApi) {
      gridApi.paginationSetPageSize(newSize);
    }
  };

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibilityApplyLeave };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibilityApplyLeave(updatedVisibility);
  };

  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem("columnVisibilityApplyLeave");
    if (savedVisibility) {
      setColumnVisibilityApplyLeave(JSON.parse(savedVisibility));
    }
  }, []);

  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem(
      "columnVisibilityApplyLeave",
      JSON.stringify(columnVisibilityApplyLeave)
    );
  }, [columnVisibilityApplyLeave]);

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTableApplyLeave.filter((column) =>
    column.headerName
      .toLowerCase()
      .includes(searchQueryManageApplyLeave.toLowerCase())
  );

  const DateFrom =
    (
      isUserRoleAccess.role.includes("Manager") ||
      isUserRoleCompare.includes("lassignleaveapply")) &&
      Accessdrop === "HR"
      ? formattedDatePresent
      : formattedDatet;

  // Calculate the date 30 days from today
  const after30Days = new Date(formattedDatePresent);
  after30Days.setDate(after30Days.getDate() + 30);
  const formattedAfter30Days = after30Days.toISOString().split("T")[0];

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    if (!gridApi) return;

    setColumnVisibilityApplyLeave((prevVisibility) => {
      const newVisibility = !prevVisibility[field];

      // Update the visibility in the grid
      gridApi.setColumnVisible(field, newVisibility);

      return {
        ...prevVisibility,
        [field]: newVisibility,
      };
    });
  };

  const handleColumnMoved = useCallback(
    debounce((event) => {
      if (!event.columnApi) return;

      const visible_columns = event.columnApi
        .getAllColumns()
        .filter((col) => {
          const colState = event.columnApi
            .getColumnState()
            .find((state) => state.colId === col.colId);
          return colState && !colState.hide;
        })
        .map((col) => col.colId);

      setColumnVisibilityApplyLeave((prevVisibility) => {
        const updatedVisibility = { ...prevVisibility };

        // Ensure columns that are visible stay visible
        Object.keys(updatedVisibility).forEach((colId) => {
          updatedVisibility[colId] = visible_columns.includes(colId);
        });

        return updatedVisibility;
      });
    }, 300),
    []
  );

  const handleColumnVisible = useCallback((event) => {
    const colId = event.column.getColId();

    // Update visibility based on event, but only when explicitly triggered by grid
    setColumnVisibilityApplyLeave((prevVisibility) => ({
      ...prevVisibility,
      [colId]: event.visible, // Set visibility directly from the event
    }));
  }, []);

  // Excel
  const [fileFormat, setFormat] = useState("");
  let exportColumnNamescrt = [
    "Employee Id",
    "Employee Name",
    "Leavetype",
    "Date",
    "Number of Shift",
    "Reason for leave",
  ];
  let exportRowValuescrt = [
    "employeeid",
    "employeename",
    "leavetype",
    "date",
    "noofshift",
    "reasonforleave",
  ];

  // Print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Applyleave",
    pageStyle: "print",
  });

  // image
  const handleCaptureImage = () => {
    if (gridRefImageApplyLeave.current) {
      domtoimage
        .toBlob(gridRefImageApplyLeave.current)
        .then((blob) => {
          saveAs(blob, "Apply Leave.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  return (
    <Box>
      <Headtitle title={"Apply Leave"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Apply Leave"
        modulename="Leave&Permission"
        submodulename="Leave"
        mainpagename="Apply Leave"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aapplyleave") && (
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  {" "}
                  Add Apply Leave
                </Typography>
              </Grid>
              {(
                isUserRoleAccess.role.includes("Manager") ||
                isUserRoleCompare.includes("lassignleaveapply")) && (
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
                          setAppleave({
                            ...appleave,
                            durationtype: "Random",
                            date: "",
                            todate: "",
                          });
                          setAllUsers([]);
                          setGetSelectedDates([]);
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
                  <Grid item md={3} xs={12} sm={6}>
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
                  <Grid item md={3} xs={12} sm={6}>
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
                  <Grid item md={3} xs={12} sm={6}>
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
                  <Grid item md={3} xs={12} sm={6}>
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
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        // options={empnames}
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
                          label: appleave.employeename,
                          value: appleave.employeename,
                        }}
                        onChange={(e) => {
                          setAppleave({
                            ...appleave,
                            employeename: e.value,
                            employeeid: e.empcode,
                            reportingto: e.reportingto,
                            department: e.department,
                            designation: e.designation,
                            doj: (e.boardingLog.length > 0 ? e.boardingLog[0].startdate : e.doj),
                            boardingLog: e.boardingLog,
                            workmode: e.workmode,
                            company: e.company,
                            branch: e.branch,
                            unit: e.unit,
                            team: e.team,
                            date: "",
                            todate: "",
                            noofshift: "",
                            leavetype: "Please Select LeaveType",
                          });
                          setAllUsers([]);
                          setGetSelectedDates([]);
                          setAvailableDays("");
                          // fetchLeaveCriteria(e.employeename, e.department, e.designation, appleave.leavetype, e.doj,);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee ID </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={appleave.employeeid}
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Employee Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={isUserRoleAccess.companyname}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
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

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Leave Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    size="small"
                    options={leaveTypeData}
                    styles={colourStyles}
                    value={{
                      label: appleave.leavetype,
                      value: appleave.leavetype,
                    }}
                    onChange={(e) => {
                      setAppleave({ ...appleave, leavetype: e.value, noofshift: 0, reasonforleave: "" });
                      fetchLeaveCriteria(
                        Accessdrop === "HR" ? appleave.employeename : isUserRoleAccess.companyname,
                        Accessdrop === "HR" ? appleave.department : isUserRoleAccess.department,
                        Accessdrop === "HR" ? appleave.designation : isUserRoleAccess.designation,
                        e.value,
                        Accessdrop === "HR"
                          ? appleave.doj
                          : (isUserRoleAccess.boardingLog.length > 0 ? isUserRoleAccess.boardingLog[0].startdate : isUserRoleAccess.doj),
                        Accessdrop === "HR" ? appleave.employeeid : isUserRoleAccess.empcode,
                        Accessdrop === "HR" ? appleave.company : isUserRoleAccess.company,
                        Accessdrop === "HR" ? appleave.branch : isUserRoleAccess.branch,
                        Accessdrop === "HR" ? appleave.unit : isUserRoleAccess.unit,
                        Accessdrop === "HR" ? appleave.team : isUserRoleAccess.team
                      );
                      setAllUsers([]);
                      setAvailableDays("");
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Remaining Days </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={
                      appleave.leavetype === "Casual Leave"
                        ? availableDays
                        : availableDays
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Duration Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    size="small"
                    options={durationOptions}
                    styles={colourStyles}
                    value={{
                      label: appleave.durationtype,
                      value: appleave.durationtype,
                    }}
                    onChange={(e) => {
                      setAppleave({
                        ...appleave,
                        durationtype: e.value,
                        date: "",
                        todate: "",
                        noofshift: "",
                      });
                      setAllUsers([]);
                      setGetSelectedDates([]);
                    }}
                  />
                </FormControl>
              </Grid>
              {appleave.durationtype === "Random" ? (
                <>
                  <Grid item md={4} xs={12} sm={12}>
                    <Grid container spacing={1.2} marginTop={1}>
                      <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                        <Typography>
                          Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      {/* <Grid item md={4.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={appleave.date}
                            onChange={(e) => {
                              if (leaveRestriction === true) {
                                setAppleave({
                                  ...appleave,
                                  date: e.target.value,
                                });
                              } else {
                                setAppleave({
                                  ...appleave,
                                  date:
                                    isUserRoleAccess.role.includes(
                                      "SuperAdmin"
                                    ) ||
                                      isUserRoleAccess.role.includes("Manager")
                                      ? e.target.value
                                      : (new Date(e.target.value) -
                                        new Date(DateFrom)) /
                                        (1000 * 3600 * 24) <
                                        0
                                        ? ""
                                        : e.target.value,
                                });
                              }
                            }}
                          />
                        </FormControl>
                      </Grid> */}
                      <Grid item md={4.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={appleave.date}
                            onChange={(e) => {
                              const selectedDate = e.target.value;

                              const isSuperAdminOrManager = isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply");

                              // Validate selected date
                              const selectedDateObj = new Date(selectedDate);
                              const minDateObj = new Date(DateFrom);
                              const maxDateObj = new Date(formattedAfter30Days);

                              if (!isSuperAdminOrManager && (selectedDateObj < minDateObj || selectedDateObj > maxDateObj)) {
                                // Show warning for invalid date
                                setPopupContentMalert(`Please enter a valid date between ${moment(DateFrom).format('DD-MM-YYYY')} and ${moment(formattedAfter30Days).format('DD-MM-YYYY')}`);
                                setPopupSeverityMalert("warning");
                                handleClickOpenPopupMalert();
                                return; // Prevent invalid date selection
                              }

                              // If valid, update state
                              if (leaveRestriction === true) {
                                setAppleave({ ...appleave, date: selectedDate, });
                              } else {

                                const daysDifference = (selectedDateObj - new Date(DateFrom)) / (1000 * 3600 * 24);

                                if (!isSuperAdminOrManager && daysDifference < 0) {
                                  setPopupContentMalert("You cannot apply leave 3 days from today");
                                  setPopupSeverityMalert("warning");
                                  handleClickOpenPopupMalert();
                                } else {
                                  setAppleave({ ...appleave, date: selectedDate, });
                                }
                              }
                            }}
                            inputProps={{
                              max:
                                !isUserRoleCompare.includes("lassignleaveapply") &&
                                  !isUserRoleAccess.role.includes("Manager")
                                  ? formattedAfter30Days
                                  : "",
                              min:
                                !isUserRoleCompare.includes("lassignleaveapply") &&
                                  !isUserRoleAccess.role.includes("Manager")
                                  ? DateFrom
                                  : "",
                            }}
                            onBlur={(e) => {
                              const typedDate = e.target.value;

                              const isSuperAdminOrManager = isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply");

                              // Validate manually typed date
                              const typedDateObj = new Date(typedDate);
                              const minDateObj = new Date(DateFrom);
                              const maxDateObj = new Date(formattedAfter30Days);

                              if (!isSuperAdminOrManager && (typedDateObj < minDateObj || typedDateObj > maxDateObj)) {
                                // Clear invalid date and show warning
                                setAppleave({ ...appleave, date: "" });
                                setPopupContentMalert(`Please enter a valid date between ${moment(DateFrom).format('DD-MM-YYYY')} and ${moment(formattedAfter30Days).format('DD-MM-YYYY')}`);
                                setPopupSeverityMalert("error");
                                handleClickOpenPopupMalert();
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={1} sm={12} xs={12} marginTop={1}>
                        <Button
                          variant="contained"
                          color="success"
                          type="button"
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            padding: "6px 10px",
                            marginTop: "4px",
                          }}
                          onClick={(e) => {
                            if (
                              Accessdrop === "HR" &&
                              appleave.employeename ===
                              "Please Select Employee Name"
                            ) {
                              setPopupContentMalert(
                                "Please Select Employee Name"
                              );
                              setPopupSeverityMalert("warning");
                              handleClickOpenPopupMalert();
                            } else {
                              fetchUsersRandom(
                                Accessdrop === "HR"
                                  ? appleave.employeeid
                                  : isUserRoleAccess.empcode,
                                appleave.date
                              );
                            }
                          }}
                        >
                          <FaPlus />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={5} xs={12} sm={12}></Grid>
                </>
              ) : (
                <>
                  <Grid item md={5} xs={12} sm={12}>
                    <Grid container spacing={1.2} marginTop={1}>
                      <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                        <Typography>
                          Date<b style={{ color: "red" }}>*</b>
                        </Typography>
                      </Grid>
                      {/* <Grid item md={4.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={appleave.date}
                            onChange={(e) => {
                              if (leaveRestriction === true) {
                                setAppleave({
                                  ...appleave,
                                  date: e.target.value,
                                });
                              } else {
                                setAppleave({
                                  ...appleave,
                                  date:
                                    isUserRoleAccess.role.includes(
                                      "SuperAdmin"
                                    ) ||
                                      isUserRoleAccess.role.includes("Manager")
                                      ? e.target.value
                                      : (new Date(e.target.value) -
                                        new Date(DateFrom)) /
                                        (1000 * 3600 * 24) <
                                        0
                                        ? ""
                                        : e.target.value,
                                });

                                //   fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), e.target.value, appleave.todate)
                              }
                            }}
                          />
                        </FormControl>
                      </Grid> */}
                      <Grid item md={4.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={appleave.date}
                            onChange={(e) => {
                              const selectedDate = e.target.value;

                              const isSuperAdminOrManager =
                                isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply");

                              // Validate selected date
                              const selectedDateObj = new Date(selectedDate);
                              const minDateObj = new Date(DateFrom);
                              const maxDateObj = new Date(formattedAfter30Days);

                              if (!isSuperAdminOrManager && (selectedDateObj < minDateObj || selectedDateObj > maxDateObj)) {
                                // Show warning for invalid date
                                setPopupContentMalert(`Please enter a valid date between ${moment(DateFrom).format('DD-MM-YYYY')} and ${moment(formattedAfter30Days).format('DD-MM-YYYY')}`);
                                setPopupSeverityMalert("warning");
                                handleClickOpenPopupMalert();
                                return; // Prevent invalid date selection
                              }

                              // If valid, update state
                              if (leaveRestriction === true) {
                                setAppleave({ ...appleave, date: selectedDate, });
                              } else {

                                const daysDifference = (selectedDateObj - new Date(DateFrom)) / (1000 * 3600 * 24);

                                if (!isSuperAdminOrManager && daysDifference < 0) {
                                  setPopupContentMalert("You cannot apply leave 3 days from today");
                                  setPopupSeverityMalert("warning");
                                  handleClickOpenPopupMalert();
                                } else {
                                  setAppleave({ ...appleave, date: selectedDate, });
                                }
                              }
                            }}
                            inputProps={{
                              max:
                                !isUserRoleCompare.includes("lassignleaveapply") &&
                                  !isUserRoleAccess.role.includes("Manager")
                                  ? formattedAfter30Days
                                  : "",
                              min:
                                !isUserRoleCompare.includes("lassignleaveapply") &&
                                  !isUserRoleAccess.role.includes("Manager")
                                  ? DateFrom
                                  : "",
                            }}
                            onBlur={(e) => {
                              const typedDate = e.target.value;

                              const isSuperAdminOrManager =
                                isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply");

                              // Validate manually typed date
                              const typedDateObj = new Date(typedDate);
                              const minDateObj = new Date(DateFrom);
                              const maxDateObj = new Date(formattedAfter30Days);

                              if (!isSuperAdminOrManager && (typedDateObj < minDateObj || typedDateObj > maxDateObj)) {
                                // Clear invalid date and show warning
                                setAppleave({ ...appleave, date: "" });
                                setPopupContentMalert(`Please enter a valid date between ${moment(DateFrom).format('DD-MM-YYYY')} and ${moment(formattedAfter30Days).format('DD-MM-YYYY')}`);
                                setPopupSeverityMalert("error");
                                handleClickOpenPopupMalert();
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={1} xs={12} sm={12} marginTop={1}>
                        <Typography>To</Typography>
                      </Grid>
                      {/* <Grid item md={4.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={appleave.todate}
                            onChange={(e) => {
                              if (leaveRestriction === true) {
                                setAppleave({
                                  ...appleave,
                                  todate: e.target.value,
                                });
                              } else {
                                setAppleave({
                                  ...appleave,
                                  todate:
                                    isUserRoleAccess.role.includes(
                                      "SuperAdmin"
                                    ) ||
                                      isUserRoleAccess.role.includes("Manager")
                                      ? new Date(e.target.value) >=
                                        new Date(appleave.date)
                                        ? e.target.value
                                        : ""
                                      : (new Date(e.target.value) -
                                        new Date(DateFrom)) /
                                        (1000 * 3600 * 24) <
                                        0
                                        ? ""
                                        : new Date(e.target.value) >=
                                          new Date(appleave.date)
                                          ? e.target.value
                                          : "",
                                });
                                // setAppleave({ ...appleave, todate: e.target.value });
                                // fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), appleave.date, e.target.value)
                              }
                            }}
                          />
                        </FormControl>
                      </Grid> */}
                      <Grid item md={4.5} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            id="component-outlined"
                            type="date"
                            value={appleave.todate}
                            onChange={(e) => {
                              const selectedDate = e.target.value;

                              const isSuperAdminOrManager =
                                isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply");

                              // Validate selected date
                              const selectedDateObj = new Date(selectedDate);
                              const minDateObj = new Date(DateFrom);
                              const maxDateObj = new Date(formattedAfter30Days);

                              if (!isSuperAdminOrManager && (selectedDateObj < minDateObj || selectedDateObj > maxDateObj)) {
                                // Show warning for invalid date
                                setPopupContentMalert(`Please enter a valid date between ${moment(DateFrom).format('DD-MM-YYYY')} and ${moment(formattedAfter30Days).format('DD-MM-YYYY')}`);
                                setPopupSeverityMalert("warning");
                                handleClickOpenPopupMalert();
                                return; // Prevent invalid date selection
                              }

                              // If valid, update state
                              if (leaveRestriction === true) {
                                setAppleave({ ...appleave, todate: selectedDate, });
                              } else {

                                const daysDifference = (selectedDateObj - new Date(DateFrom)) / (1000 * 3600 * 24);

                                if (!isSuperAdminOrManager && daysDifference < 0) {
                                  setPopupContentMalert("You cannot apply leave 3 days from today");
                                  setPopupSeverityMalert("warning");
                                  handleClickOpenPopupMalert();
                                } else {
                                  setAppleave({ ...appleave, todate: selectedDate, });
                                }
                              }
                            }}
                            inputProps={{
                              max:
                                !isUserRoleCompare.includes("lassignleaveapply") &&
                                  !isUserRoleAccess.role.includes("Manager")
                                  ? formattedAfter30Days
                                  : "",
                              min:
                                !isUserRoleCompare.includes("lassignleaveapply") &&
                                  !isUserRoleAccess.role.includes("Manager")
                                  ? DateFrom
                                  : "",
                            }}
                            onBlur={(e) => {
                              const typedDate = e.target.value;

                              const isSuperAdminOrManager =
                                isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply");

                              // Validate manually typed date
                              const typedDateObj = new Date(typedDate);
                              const minDateObj = new Date(DateFrom);
                              const maxDateObj = new Date(formattedAfter30Days);

                              if (!isSuperAdminOrManager && (typedDateObj < minDateObj || typedDateObj > maxDateObj)) {
                                // Clear invalid date and show warning
                                setAppleave({ ...appleave, todate: "" });
                                setPopupContentMalert(`Please enter a valid date between ${moment(DateFrom).format('DD-MM-YYYY')} and ${moment(formattedAfter30Days).format('DD-MM-YYYY')}`);
                                setPopupSeverityMalert("error");
                                handleClickOpenPopupMalert();
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={0.5} sm={12} xs={12} marginTop={1}>
                        <Button
                          variant="contained"
                          color="success"
                          type="button"
                          sx={{
                            height: "30px",
                            minWidth: "30px",
                            padding: "6px 10px",
                            marginTop: "-2px",
                          }}
                          onClick={(e) => {
                            if (
                              Accessdrop === "HR" &&
                              appleave.employeename ===
                              "Please Select Employee Name"
                            ) {
                              setPopupContentMalert(
                                "Please Select Employee Name"
                              );
                              setPopupSeverityMalert("warning");
                              handleClickOpenPopupMalert();
                            } else {
                              fetchUsers(
                                Accessdrop === "HR"
                                  ? appleave.employeeid
                                  : isUserRoleAccess.empcode,
                                appleave.date,
                                appleave.todate
                              );
                            }
                          }}
                        >
                          <FaPlus />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}></Grid>
                </>
              )}
              {allUsers.length > 0 ? (
                <>
                  <Grid item md={6} sm={12} xs={12}>
                    <>
                      {allUsers.length > 0 ? (
                        <Grid container>
                          <Grid item md={5} sm={12} xs={12}>
                            <Typography>Shift</Typography>
                          </Grid>
                          <Grid item md={4} sm={12} xs={12}>
                            <Typography>
                              Leave<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Count<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {allUsers &&
                        allUsers.map((column, index) => (
                          <Grid container key={index}>
                            <React.Fragment key={index}>
                              <Grid item md={5} sm={6} xs={12} fullWidth>
                                <Box
                                  sx={{
                                    border: "1px solid #80808094",
                                    font: "inherit",
                                    color: "currentColor",
                                    fontSize: "14px",
                                    lineHeight: 1.3,
                                    padding: "8.5px 14px",
                                    borderRadius: "3.5px",
                                    display: "block",
                                    background: "#80808030",
                                    margin: "0.5px",
                                  }}
                                >
                                  {`${column.formattedDate} (${column.shift})`}
                                </Box>
                              </Grid>
                              <Grid item md={4} sm={6} xs={12} fullWidth>
                                <Box sx={{ display: "block", margin: "0.5px" }}>
                                  <Selects
                                    size="small"
                                    options={leaveStatusOptions}
                                    styles={colourStyles}
                                    value={leaveStatusOptions.find(
                                      (option) =>
                                        option.value === column.leavestatus
                                    )}
                                    onChange={(selectedOption) =>
                                      multiLeaveStatusInputs(
                                        index,
                                        selectedOption.value
                                      )
                                    }
                                  />
                                </Box>
                              </Grid>
                              <Grid item md={2} sm={6} xs={12} fullWidth>
                                <Box sx={{ display: "block", margin: "0.5px" }}>
                                  <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={column.shiftcount}
                                  />
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={1}
                                sm={6}
                                xs={1}
                                sx={{ display: "flex" }}
                              >
                                <Button
                                  variant="contained"
                                  color="error"
                                  type="button"
                                  onClick={(e) => handleDelete(index)}
                                  sx={{
                                    height: "30px",
                                    minWidth: "30px",
                                    marginTop: "4px",
                                    padding: "6px 10px",
                                  }}
                                >
                                  x
                                </Button>
                              </Grid>
                            </React.Fragment>
                          </Grid>
                        ))}
                    </>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}></Grid>
                </>
              ) : null}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Number of Shift</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={appleave.noofshift}
                  //  onChange={(e) => {
                  //   setAppleave({ ...appleave, reasonforleave: e.target.value });
                  // }}
                  />
                </FormControl>
              </Grid>
              {/* <Grid item md={8} xs={12} sm={12}></Grid> */}
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Reason for Leave<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    value={appleave.reasonforleave}
                    onChange={(e) => {
                      setAppleave({
                        ...appleave,
                        reasonforleave: e.target.value,
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
                        ? appleave.reportingto
                        : isUserRoleAccess.reportingto
                    }
                  />
                </FormControl>
              </Grid> */}
              {/* </Grid>
            <Grid container spacing={1}> */}
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                  {/* {isUserRoleCompare?.includes("aapplyleave") && ( */}
                  {/* <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button> */}
                  <LoadingButton
                    loading={btnSubmit}
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={fetchLeaveHistory}
                  // onClick={handleSubmit}
                  >
                    Submit
                  </LoadingButton>
                  {/* )} */}
                </Box>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0 } })}>
                  {/* {isUserRoleCompare?.includes("aapplyleave") && ( */}
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
      {isUserRoleCompare?.includes("lapplyleave") && (
        <>
          {(isUserRoleAccess?.role?.includes("Manager") ||
            isUserRoleCompare?.includes("lassignleaveapply")) ?
            <>
              {/* List Filter */}
              <Box sx={userStyle.selectcontainer}>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography> Type<b style={{ color: "red" }}>*</b> </Typography>
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
                      <Typography>
                        Company<b style={{ color: "red" }}>*</b>
                      </Typography>
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
                        <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
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
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography> Team<b style={{ color: "red" }}>*</b></Typography>
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
                            <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
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
                              <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
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
                      <Typography>Leave Type<b style={{ color: "red" }}>*</b> </Typography>
                      <MultiSelect
                        options={leaveTypeData}
                        value={selectedLeaveType}
                        onChange={(e) => { handleLeaveTypeChangeFilter(e); }}
                        valueRenderer={customValueRendererLeaveTypeFilter}
                        labelledBy="Please Select Leave Type"
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
          {/* {applyleaveCheckHistory && (
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
          )} */}
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid container spacing={2} >
              <Grid item md={12} sm={12} xs={12}>
                <Typography sx={userStyle.importheadtext}>
                  Apply Leave List
                </Typography>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSizeApplyLeave}
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
                  {isUserRoleCompare?.includes("excelapplyleave") && (
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
                  {isUserRoleCompare?.includes("csvapplyleave") && (
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
                  {isUserRoleCompare?.includes("printapplyleave") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfapplyleave") && (
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
                  {isUserRoleCompare?.includes("imageapplyleave") && (
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
                <FormControl fullWidth size="small">
                  <OutlinedInput
                    size="small"
                    id="outlined-adornment-weight"
                    startAdornment={
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        {advancedFilter && (
                          <IconButton onClick={handleResetSearch}>
                            <MdClose />
                          </IconButton>
                        )}
                        <Tooltip title="Show search options">
                          <span>
                            <IoMdOptions
                              style={{ cursor: "pointer" }}
                              onClick={handleClickSearchApplyLeave}
                            />
                          </span>
                        </Tooltip>
                      </InputAdornment>
                    }
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{ "aria-label": "weight" }}
                    type="text"
                    value={getSearchDisplay()}
                    onChange={handleSearchChange}
                    placeholder="Type to search..."
                    disabled={!!advancedFilter}
                  />
                </FormControl>
              </Grid>
            </Grid><br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsApplyLeave}>Manage Columns</Button>
            {/* {isUserRoleCompare?.includes("bdapplyleave") && (
              <>
                <Button variant="contained" color="error" onClick={handleClickOpenalert}>
                  Bulk Delete
                </Button>
              </>
            )} */}
            <br /> <br />
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
                <Box
                  sx={{ width: "100%" }}
                  className={"ag-theme-quartz"}
                  ref={gridRefImageApplyLeave}
                >
                  <AgGridReact
                    rowData={filteredDataItems}
                    columnDefs={columnDataTableApplyLeave.filter(
                      (column) => columnVisibilityApplyLeave[column.field]
                    )}
                    ref={gridRefTableApplyLeave}
                    defaultColDef={defaultColDef}
                    domLayout={"autoHeight"}
                    getRowStyle={getRowStyle}
                    pagination={true}
                    paginationPageSize={pageSizeApplyLeave}
                    onPaginationChanged={onPaginationChanged}
                    onGridReady={onGridReady}
                    onColumnMoved={handleColumnMoved}
                    onColumnVisible={handleColumnVisible}
                    onFilterChanged={onFilterChanged}
                    // suppressPaginationPanel={true}
                    suppressSizeToFit={true}
                    suppressAutoSize={true}
                    suppressColumnVirtualisation={true}
                    colResizeDefault={"shift"}
                  />
                </Box>
                {/* show and hide based on the inner filter and outer filter */}
                {/* <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        (filteredDataItems.length > 0 ? (pageApplyLeave - 1) * pageSizeApplyLeave + 1 : 0)
                      ) : (
                        filteredRowData.length > 0 ? (pageApplyLeave - 1) * pageSizeApplyLeave + 1 : 0
                      )
                    }{" "}to{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        Math.min(pageApplyLeave * pageSizeApplyLeave, filteredDataItems.length)
                      ) : (
                        filteredRowData.length > 0 ? Math.min(pageApplyLeave * pageSizeApplyLeave, filteredRowData.length) : 0
                      )
                    }{" "}of{" "}
                    {
                      gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                        filteredDataItems.length
                      ) : (
                        filteredRowData.length
                      )
                    } entries
                  </Box>
                  <Box>
                    <Button onClick={() => handlePageChange(1)} disabled={pageApplyLeave === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                    <Button onClick={() => handlePageChange(pageApplyLeave - 1)} disabled={pageApplyLeave === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                    {getVisiblePageNumbers().map((pageNumber, index) => (
                      <Button
                        key={index}
                        onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                        sx={{
                          ...userStyle.paginationbtn,
                          ...(pageNumber === "..." && {
                            cursor: "default",
                            color: "black",
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: "transparent",
                            border: "none",
                            "&:hover": {
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            },
                          }),
                        }}
                        className={pageApplyLeave === pageNumber ? "active" : ""}
                        disabled={pageApplyLeave === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button onClick={() => handlePageChange(pageApplyLeave + 1)} disabled={pageApplyLeave === totalPagesApplyLeave} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                    <Button onClick={() => handlePageChange(totalPagesApplyLeave)} disabled={pageApplyLeave === totalPagesApplyLeave} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                  </Box>
                </Box> */}
              </>
            )}
          </Box>
        </>
      )}
      {/* Manage Column */}
      <Popover
        id={idApplyLeave}
        open={isManageColumnsOpenApplyLeave}
        anchorEl={anchorElApplyLeave}
        onClose={handleCloseManageColumnsApplyLeave}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <ManageColumnsContent
          handleClose={handleCloseManageColumnsApplyLeave}
          searchQuery={searchQueryManageApplyLeave}
          setSearchQuery={setSearchQueryManageApplyLeave}
          filteredColumns={filteredColumns}
          columnVisibility={columnVisibilityApplyLeave}
          toggleColumnVisibility={toggleColumnVisibility}
          setColumnVisibility={setColumnVisibilityApplyLeave}
          initialColumnVisibility={initialColumnVisibilityApplyLeave}
          columnDataTable={columnDataTableApplyLeave}
        />
      </Popover>

      {/* Search Bar */}
      <Popover
        id={idSearchApplyLeave}
        open={openSearchApplyLeave}
        anchorEl={anchorElSearchApplyLeave}
        onClose={handleCloseSearchApplyLeave}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <AdvancedSearchBar
          columns={columnDataTableApplyLeave?.filter(
            (data) => data.field !== "actions"
          )}
          onSearch={applyAdvancedFilter}
          initialSearchValue={searchQueryApplyLeave}
          handleCloseSearch={handleCloseSearchApplyLeave}
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
        sx={{ marginTop: "95px" }}
      // sx={{
      //   overflow: "visible",
      //   "& .MuiPaper-root": {
      //     overflow: "visible",
      //   },
      // }}
      >
        <Box sx={{ padding: "20px" }}>
          <>
            <form>
              {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
              <Grid container spacing={2}>
                <Grid item md={8} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Edit Apply Leave
                  </Typography>
                </Grid>
                {(isUserRoleAccess.role.includes("Manager") ||
                  isUserRoleCompare.includes("lassignleaveapply")) && (
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
                            setAppleaveEdit({
                              ...appleaveEdit,
                              date: "",
                              todate: "",
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
                {AccessdropEdit === "HR" ? (
                  <>
                    <Grid item md={3} xs={12} sm={6}>
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
                    <Grid item md={3} xs={12} sm={6}>
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
                    <Grid item md={3} xs={12} sm={6}>
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
                    <Grid item md={3} xs={12} sm={6}>
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
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Employee Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          // options={empnamesEdit}
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
                            label: appleaveEdit.employeename,
                            value: appleaveEdit.employeename,
                          }}
                          onChange={(e) => {
                            setAppleaveEdit({
                              ...appleaveEdit,
                              employeename: e.value,
                              employeeid: e.empcode,
                              reportingto: e.reportingto,
                              department: e.department,
                              designation: e.designation,
                              doj: (e.boardingLog.length > 0 ? e.boardingLog[0].startdate : e.doj),
                              weekoff: e.weekoff,
                              workmode: e.workmode,
                              date: "",
                              todate: "",
                            });
                            setAvailableDaysEdit("");
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Employee ID </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={appleaveEdit.employeeid}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
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
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Leave Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      size="small"
                      options={leaveTypeData}
                      styles={colourStyles}
                      value={{
                        label: appleaveEdit.leavetype,
                        value: appleaveEdit.leavetype,
                      }}
                      onChange={(e) => {
                        setAppleaveEdit({
                          ...appleaveEdit,
                          leavetype: e.value,
                        });
                        fetchLeaveCriteriaEdit(
                          AccessdropEdit === "HR"
                            ? appleaveEdit.employeename
                            : isUserRoleAccess.companyname,
                          AccessdropEdit === "HR"
                            ? appleaveEdit.department
                            : isUserRoleAccess.department,
                          AccessdropEdit === "HR"
                            ? appleaveEdit.designation
                            : isUserRoleAccess.designation,
                          e.value,
                          AccessdropEdit === "HR"
                            ? appleaveEdit.doj
                            : (isUserRoleAccess.boardingLog.length > 0 ? isUserRoleAccess.boardingLog[0].startdate : isUserRoleAccess.doj),
                          AccessdropEdit === "HR"
                            ? appleaveEdit.employeeid
                            : isUserRoleAccess.empcode
                        );
                        setAvailableDaysEdit("");
                      }}
                    />
                  </FormControl>
                </Grid>
                <br />
                {/* <Grid item md={4} xs={12} sm={12}>
                                  <Grid container spacing={1.2} marginTop={1}>
                                    <Grid item md={1.2} xs={12} sm={12} marginTop={1}>
                                      <Typography>
                                        Date<b style={{ color: "red" }}>*</b>
                                      </Typography>
                                    </Grid>
                                    <Grid item md={4.5} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          value={appleaveEdit.date}
                                          onChange={(e) => {
                                            setAppleaveEdit({ ...appleaveEdit, date: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? e.target.value : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : e.target.value });
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={1.2} xs={12} sm={12} marginTop={1}>
                                      <Typography>To</Typography>
                                    </Grid>
                                    <Grid item md={4.5} xs={12} sm={12}>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          value={appleaveEdit.todate}
                                          onChange={(e) => {
                                            setAppleaveEdit({ ...appleaveEdit, todate: isUserRoleAccess.role.includes("SuperAdmin") || isUserRoleAccess.role.includes("Manager") ? (new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "") : (new Date(e.target.value) - new Date(DateFrom)) / (1000 * 3600 * 24) < 0 ? "" : new Date(e.target.value) >= new Date(appleaveEdit.date) ? e.target.value : "" });
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={12} sm={12}></Grid>
                                  </Grid>
                                </Grid>
                                <br /> */}

                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Remaining Days </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={
                        appleaveEdit.availabledays
                          ? appleaveEdit.availabledays
                          : availableDaysEdit
                      }
                    />
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Duration Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={appleaveEdit.durationtype}
                    />
                    {/* <Selects
                                      size="small"
                                      options={durationOptions}
                                      styles={colourStyles}
                                      value={{ label: appleaveEdit.durationtype, value: appleaveEdit.durationtype }}
                                      onChange={(e) => {
                                        setAppleaveEdit({ ...appleaveEdit, durationtype: e.value, date: '', todate: '', noofshift: '' });
                                        // setAllUsersEdit([]);
                                        // setGetSelectedDatesEdit([]);
                                      }}
                                    /> */}
                  </FormControl>
                </Grid>
                {appleaveEdit.durationtype === "Random" ? (
                  <>
                    <Grid item md={4} xs={12} sm={12}>
                      <Grid container spacing={1.2} marginTop={1}>
                        <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                          <Typography>
                            Date<b style={{ color: "red" }}>*</b>
                          </Typography>
                        </Grid>
                        <Grid item md={4.5} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="date"
                              value={appleaveEdit.date}
                              onChange={(e) => {
                                if (leaveRestrictionEdit === true) {
                                  setAppleaveEdit({
                                    ...appleaveEdit,
                                    date: e.target.value,
                                  });
                                } else {
                                  // setAppleaveEdit({
                                  //   ...appleaveEdit,
                                  //   date:
                                  //     isUserRoleAccess.role.includes(
                                  //       "SuperAdmin"
                                  //     ) ||
                                  //       isUserRoleAccess.role.includes("Manager")
                                  //       ? e.target.value
                                  //       : (new Date(e.target.value) -
                                  //         new Date(DateFrom)) /
                                  //         (1000 * 3600 * 24) <
                                  //         0
                                  //         ? ""
                                  //         : e.target.value,
                                  // });
                                  const isSuperAdminOrManager =
                                    isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply");

                                  const daysDifference =
                                    (new Date(e.target.value) - new Date(DateFrom)) /
                                    (1000 * 3600 * 24);

                                  if (!isSuperAdminOrManager && daysDifference < 0) {
                                    setPopupContentMalert("You cannot apply leave 3 days from today");
                                    setPopupSeverityMalert("warning");
                                    handleClickOpenPopupMalert();
                                  } else {
                                    setAppleave({
                                      ...appleave,
                                      date: e.target.value,
                                    });
                                  }
                                }
                              }}
                              inputProps={{
                                max: ((!isUserRoleCompare.includes("lassignleaveapply") || !isUserRoleAccess.role.includes("Manager"))) ? formattedAfter30Days : "",
                                min: ((!isUserRoleCompare.includes("lassignleaveapply") || !isUserRoleAccess.role.includes("Manager"))) ? DateFrom : ''
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={1} sm={12} xs={12} marginTop={1}>
                          <Button
                            variant="contained"
                            color="success"
                            type="button"
                            sx={{
                              height: "30px",
                              minWidth: "30px",
                              padding: "6px 10px",
                              marginTop: "4px",
                            }}
                            onClick={(e) => {
                              if (
                                AccessdropEdit === "HR" &&
                                appleaveEdit.employeename ===
                                "Please Select Employee Name"
                              ) {
                                setPopupContentMalert(
                                  "Please Select Employee Name"
                                );
                                setPopupSeverityMalert("warning");
                                handleClickOpenPopupMalert();
                              } else {
                                fetchUsersRandomEdit(
                                  AccessdropEdit === "HR"
                                    ? appleaveEdit.employeeid
                                    : isUserRoleAccess.empcode,
                                  appleaveEdit.date
                                );
                              }
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item md={5} xs={12} sm={12}>
                      <Grid container spacing={1.2} marginTop={1}>
                        <Grid item md={1.5} xs={12} sm={12} marginTop={1}>
                          <Typography>
                            Date<b style={{ color: "red" }}>*</b>
                          </Typography>
                        </Grid>
                        <Grid item md={4.5} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="date"
                              value={appleaveEdit.date}
                              onChange={(e) => {
                                if (leaveRestrictionEdit === true) {
                                  setAppleaveEdit({
                                    ...appleaveEdit,
                                    date: e.target.value,
                                  });
                                } else {
                                  // setAppleaveEdit({
                                  //   ...appleaveEdit,
                                  //   date:
                                  //     isUserRoleAccess.role.includes(
                                  //       "SuperAdmin"
                                  //     ) ||
                                  //       isUserRoleAccess.role.includes("Manager")
                                  //       ? e.target.value
                                  //       : (new Date(e.target.value) -
                                  //         new Date(DateFrom)) /
                                  //         (1000 * 3600 * 24) <
                                  //         0
                                  //         ? ""
                                  //         : e.target.value,
                                  // });

                                  // //   fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), e.target.value, appleave.todate)

                                  const isSuperAdminOrManager =
                                    isUserRoleAccess.role.includes("Manager") || isUserRoleCompare.includes("lassignleaveapply");

                                  const daysDifference =
                                    (new Date(e.target.value) - new Date(DateFrom)) /
                                    (1000 * 3600 * 24);

                                  if (!isSuperAdminOrManager && daysDifference < 0) {
                                    setPopupContentMalert("You cannot apply leave 3 days from today");
                                    setPopupSeverityMalert("warning");
                                    handleClickOpenPopupMalert();
                                  } else {
                                    setAppleave({
                                      ...appleave,
                                      date: e.target.value,
                                    });
                                  }
                                }
                              }}
                              inputProps={{
                                max: ((!isUserRoleCompare.includes("lassignleaveapply") || !isUserRoleAccess.role.includes("Manager"))) ? formattedAfter30Days : "",
                                min: ((!isUserRoleCompare.includes("lassignleaveapply") || !isUserRoleAccess.role.includes("Manager"))) ? DateFrom : ''
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={1} xs={12} sm={12} marginTop={1}>
                          <Typography>To</Typography>
                        </Grid>
                        <Grid item md={4.5} xs={12} sm={12}>
                          <FormControl fullWidth size="small">
                            <OutlinedInput
                              id="component-outlined"
                              type="date"
                              value={appleaveEdit.todate}
                              onChange={(e) => {
                                if (leaveRestrictionEdit === true) {
                                  setAppleaveEdit({
                                    ...appleaveEdit,
                                    todate: e.target.value,
                                  });
                                } else {
                                  setAppleaveEdit({
                                    ...appleaveEdit,
                                    todate:
                                      isUserRoleCompare.includes("lassignleaveapply") ||
                                        isUserRoleAccess.role.includes("Manager")
                                        ? new Date(e.target.value) >=
                                          new Date(appleaveEdit.date)
                                          ? e.target.value
                                          : ""
                                        : (new Date(e.target.value) -
                                          new Date(DateFrom)) /
                                          (1000 * 3600 * 24) <
                                          0
                                          ? ""
                                          : new Date(e.target.value) >=
                                            new Date(appleaveEdit.date)
                                            ? e.target.value
                                            : "",
                                  });
                                  // setAppleave({ ...appleave, todate: e.target.value });
                                  // fetchUsers((Accessdrop === 'HR' ? appleave.employeeid : isUserRoleAccess.empcode), appleave.date, e.target.value)
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={0.5} sm={12} xs={12} marginTop={1}>
                          <Button
                            variant="contained"
                            color="success"
                            type="button"
                            sx={{
                              height: "30px",
                              minWidth: "30px",
                              padding: "6px 10px",
                              marginTop: "-2px",
                            }}
                            onClick={(e) => {
                              if (
                                AccessdropEdit === "HR" &&
                                appleaveEdit.employeename ===
                                "Please Select Employee Name"
                              ) {
                                setPopupContentMalert(
                                  "Please Select Employee Name"
                                );
                                setPopupSeverityMalert("warning");
                                handleClickOpenPopupMalert();
                              } else {
                                fetchUsersEdit(
                                  AccessdropEdit === "HR"
                                    ? appleaveEdit.employeeid
                                    : isUserRoleAccess.empcode,
                                  appleaveEdit.date,
                                  appleaveEdit.todate
                                );
                              }
                            }}
                          >
                            <FaPlus />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
                <br />
                <Grid item md={8} xs={12} sm={12}></Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <>
                    {allUsersEdit?.length > 0 ? (
                      <Grid container>
                        <Grid item md={5} sm={12} xs={12}>
                          <Typography>Shift</Typography>
                        </Grid>
                        <Grid item md={4} sm={12} xs={12}>
                          <Typography>
                            Leave<b style={{ color: "red" }}>*</b>
                          </Typography>
                        </Grid>
                        <Grid item md={2} sm={12} xs={12}>
                          <Typography>
                            Count<b style={{ color: "red" }}>*</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null}
                    {allUsersEdit &&
                      allUsersEdit?.map((column, index) => (
                        <Grid container key={index}>
                          <React.Fragment key={index}>
                            <Grid item md={5} sm={6} xs={12} fullWidth>
                              <Box
                                sx={{
                                  border: "1px solid #80808094",
                                  font: "inherit",
                                  color: "currentColor",
                                  fontSize: "14px",
                                  lineHeight: 1.3,
                                  padding: "8.5px 14px",
                                  borderRadius: "3.5px",
                                  display: "block",
                                  background: "#80808030",
                                  margin: "0.5px",
                                }}
                              >
                                {`${column.formattedDate} (${column.shift})`}
                              </Box>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12} fullWidth>
                              <Box sx={{ display: "block", margin: "0.5px" }}>
                                <Selects
                                  size="small"
                                  options={leaveStatusOptions}
                                  styles={colourStyles}
                                  value={leaveStatusOptions.find(
                                    (option) =>
                                      option.value === column.leavestatus
                                  )}
                                  onChange={(selectedOption) =>
                                    multiLeaveStatusInputsEdit(
                                      index,
                                      selectedOption.value
                                    )
                                  }
                                />
                              </Box>
                            </Grid>
                            <Grid item md={2} sm={6} xs={12} fullWidth>
                              <Box sx={{ display: "block", margin: "0.5px" }}>
                                <OutlinedInput
                                  id="component-outlined"
                                  type="text"
                                  value={column.shiftcount}
                                />
                              </Box>
                            </Grid>
                            <Grid
                              item
                              md={1}
                              sm={6}
                              xs={1}
                              sx={{ display: "flex" }}
                            >
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={(e) => handleDeleteEdit(index)}
                                sx={{
                                  height: "30px",
                                  minWidth: "30px",
                                  marginTop: "4px",
                                  padding: "6px 10px",
                                }}
                              >
                                x
                              </Button>
                            </Grid>
                          </React.Fragment>
                        </Grid>
                      ))}
                  </>
                </Grid>
                <Grid item md={6} sm={12} xs={12}></Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Number of Shift</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={appleaveEdit.noofshift}
                    //  onChange={(e) => {
                    //   setAppleave({ ...appleave, reasonforleave: e.target.value });
                    // }}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item md={8} xs={12} sm={12}></Grid> */}

                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reason for Leave<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={appleaveEdit.reasonforleave}
                      onChange={(e) => {
                        setAppleaveEdit({
                          ...appleaveEdit,
                          reasonforleave: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  {/* <FormControl fullWidth size="small">
                    <Typography>Reporting To </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={
                        AccessdropEdit === "HR"
                          ? appleaveEdit.reportingto
                          : isUserRoleAccess.reportingto
                      }
                    />
                  </FormControl> */}
                </Grid>
              </Grid>
              <br />
              <br />

              <Grid container spacing={2}>
                <Grid item md={6} xs={6} sm={6}>
                  <Button
                    variant="contained"
                    sx={buttonStyles.buttonsubmit}
                    onClick={editSubmit}
                  >
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

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: "95px" }}
      >
        <Box sx={{ width: "950px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> View Apply Leave</Typography>
            <br /> <br />
            <Grid container spacing={2}>
              {(isUserRoleAccess.role.includes("Manager") ||
                isUserRoleCompare.includes("lassignleaveapply")) && (
                  <Grid item md={3} sm={6} xs={12}>
                    <Typography variant="h6">Access</Typography>
                    <Typography>{appleaveEdit.access}</Typography>
                  </Grid>
                )}
            </Grid>
            <br />
            <Grid container spacing={2}>
              {appleaveEdit.access === "HR" ? (
                <>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Company </Typography>
                      <Typography>
                        {Array.isArray(selectedOptionsCompanyEdit)
                          ? selectedOptionsCompanyEdit.map(
                            (item, index) => `${index + 1}. ${item.value} `
                          )
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Branch</Typography>
                      <Typography>
                        {Array.isArray(selectedOptionsBranchEdit)
                          ? selectedOptionsBranchEdit.map(
                            (item, index) => `${index + 1}. ${item.value} `
                          )
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Unit </Typography>
                      <Typography>
                        {Array.isArray(selectedOptionsUnitEdit)
                          ? selectedOptionsUnitEdit.map(
                            (item, index) => `${index + 1}. ${item.value} `
                          )
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6"> Team </Typography>
                      <Typography>
                        {Array.isArray(selectedOptionsTeamEdit)
                          ? selectedOptionsTeamEdit.map(
                            (item, index) => `${index + 1}. ${item.value} `
                          )
                          : ""}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Employee Name</Typography>
                      <Typography>{appleaveEdit.employeename}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Employee ID </Typography>
                      <Typography>{appleaveEdit.employeeid}</Typography>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Employee Name</Typography>
                      <Typography>{appleaveEdit.employeename}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Employee ID </Typography>
                      <Typography>{appleaveEdit.employeeid}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Leave Type</Typography>
                  <Typography>{appleaveEdit.leavetype}</Typography>
                </FormControl>
              </Grid>
              {/* <Grid item md={2} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">Date</Typography>
                                <Typography>{appleaveEdit.date}</Typography>
                              </FormControl>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
                              <FormControl fullWidth size="small">
                                <Typography variant="h6">To Date</Typography>
                                <Typography>{appleaveEdit.todate}</Typography>
                              </FormControl>
                            </Grid> */}
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Remaining Days </Typography>
                  <Typography>{appleaveEdit.availabledays}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Duration Type</Typography>
                  <Typography>{appleaveEdit.durationtype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>{appleaveEdit.date + ", "}</Typography>
                </FormControl>
              </Grid>
              <br />
              <Grid item md={8} xs={12} sm={12}></Grid>
              <Grid item md={6} sm={12} xs={12}>
                <>
                  {allUsersEdit?.length > 0 ? (
                    <Grid container>
                      <Grid item md={5} sm={6} xs={12}>
                        <Typography variant="h6">Shift</Typography>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <Typography variant="h6">Leave</Typography>
                      </Grid>
                      <Grid item md={2} sm={6} xs={12}>
                        <Typography variant="h6">Count</Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                  {allUsersEdit &&
                    allUsersEdit?.map((column, index) => (
                      <Grid container key={index}>
                        <React.Fragment key={index}>
                          <Grid item md={5} sm={6} xs={12} fullWidth>
                            <Typography>{`${column.formattedDate} (${column.shift})`}</Typography>
                          </Grid>
                          <Grid item md={4} sm={6} xs={12} fullWidth>
                            <Typography>{column.leavestatus}</Typography>
                          </Grid>
                          <Grid item md={2} sm={6} xs={12} fullWidth>
                            <Typography>{column.shiftcount}</Typography>
                          </Grid>
                        </React.Fragment>
                      </Grid>
                    ))}
                </>
              </Grid>
              <Grid item md={6} sm={12} xs={12}></Grid>
              <Grid item md={4} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Number of Shift</Typography>
                  <Typography>{appleaveEdit.noofshift}</Typography>
                </FormControl>
              </Grid>
              {/* <Grid item md={8} xs={12} sm={12}></Grid> */}
              <Grid item md={3.5} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Reason for Leave</Typography>
                  <Typography>{appleaveEdit.reasonforleave}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={3.7} xs={12} sm={12}>
                {/* <FormControl fullWidth size="small">
                  <Typography variant="h6">Reporting To</Typography>
                  <Typography>{appleaveEdit.reportingto}</Typography>
                </FormControl> */}
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* ALERT DIALOG */}
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
        filteredDataTwo={
          (filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []
        }
        itemsTwo={items ?? []}
        filename={"Apply Leave"}
        exportColumnNames={exportColumnNamescrt}
        exportRowValues={exportRowValuescrt}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Apply Leave Info"
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
        open={isDeleteOpenUpdateStatus}
        onClose={handleCloseModUpdateStatus}
        onConfirm={handleCancelLeave}
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

      <Box>
        <Dialog
          open={isErrorOpenForTookLeaveCheck}
          onClose={handleCloseerrForTookLeaveCheck}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={sendRequestDouble}
            >
              ok
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseerrForTookLeaveCheck}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

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
                  <Selects styles={customStyles}
                    options={[
                      { label: "Approved", value: "Approved" },
                      { label: "Rejected", value: "Rejected" },
                      { label: "Applied", value: "Applied" },
                    ]}
                    value={{ label: selectStatus.status, value: selectStatus.value, }}
                    onChange={(e) => {
                      setSelectStatus({ ...selectStatus, status: e.value });
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
              sx={buttonStyles.buttonsubmit}
              // style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }}
              // onClick={() => {
              //   editStatus();
              //   // handleCloseerrpop();
              // }}
              onClick={() => fetchLeaveHistoryUpdate(selectStatus.employeeid, selectStatus.employeename)}
            >
              Update
            </Button>
            <Button
              sx={buttonStyles.btncancel}
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
      <Box>
        <Dialog
          open={isEditOpenCheckList}
          onClose={handleCloseModEditCheckList}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
          fullWidth={true}
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "auto",
            },
            marginTop: "50px",
          }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.SubHeaderText}>
                My Check List
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      border: "1px solid black",
                      borderRadius: "20px",
                    }}
                  >
                    <Typography sx={{ fontSize: "1rem", textAlign: "center" }}>
                      Employee Name:{" "}
                      <span
                        style={{
                          fontWeight: "500",
                          fontSize: "1.2rem",
                          display: "inline-block",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        {`${getDetails?.employeename}`}
                      </span>
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        <Checkbox
                          onChange={() => {
                            overallCheckListChange();
                          }}
                          checked={isCheckedListOverall}
                        />
                      </TableCell>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Details
                      </TableCell>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Field
                      </TableCell>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Allotted To
                      </TableCell>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Completed By
                      </TableCell>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Completed At
                      </TableCell>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Status
                      </TableCell>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Action
                      </TableCell>

                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Category
                      </TableCell>
                      <TableCell style={{ fontSize: "1.2rem" }}>
                        Sub Category
                      </TableCell>

                      {/* Add more table headers as needed */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupDetails?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ fontSize: "1.2rem" }}>
                          <Checkbox
                            onChange={() => {
                              handleCheckboxChange(index);
                            }}
                            checked={isCheckedList[index]}
                          />
                        </TableCell>

                        <TableCell>{row.details}</TableCell>
                        {(() => {
                          switch (row.checklist) {
                            case "Text Box":
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    value={row.data}
                                    // disabled={disableInput[index]}
                                    onChange={(e) => {
                                      handleDataChange(e, index, "Text Box");
                                    }}
                                  />
                                </TableCell>
                              );
                            case "Text Box-number":
                              return (
                                <TableCell>
                                  <Input
                                    value={row.data}
                                    style={{ height: "32px" }}
                                    type="number"
                                    onChange={(e) => {
                                      handleDataChange(
                                        e,
                                        index,
                                        "Text Box-number"
                                      );
                                    }}
                                  />
                                </TableCell>
                              );
                            case "Text Box-alpha":
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    value={row.data}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[a-zA-Z]*$/.test(inputValue)) {
                                        handleDataChange(
                                          e,
                                          index,
                                          "Text Box-alpha"
                                        );
                                      }
                                    }}
                                  />
                                </TableCell>
                              );
                            case "Text Box-alphanumeric":
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    value={row.data}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
                                        handleDataChange(
                                          e,
                                          index,
                                          "Text Box-alphanumeric"
                                        );
                                      }
                                    }}
                                    inputProps={{ pattern: "[A-Za-z0-9]*" }}
                                  />
                                </TableCell>
                              );
                            case "Attachments":
                              return (
                                <TableCell>
                                  <div>
                                    <InputLabel sx={{ m: 1 }}>File</InputLabel>

                                    <div>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          marginTop: "10px",
                                          gap: "10px",
                                        }}
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
                                              style={{ display: "none" }}
                                            />
                                            <label htmlFor={index}>
                                              <Typography
                                                sx={userStyle.uploadbtn}
                                              >
                                                Upload
                                              </Typography>
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
                                      {row.files && (
                                        <Grid container spacing={2}>
                                          <Grid
                                            item
                                            lg={8}
                                            md={8}
                                            sm={8}
                                            xs={8}
                                          >
                                            <Typography>
                                              {row.files.name}
                                            </Typography>
                                          </Grid>
                                          <Grid
                                            item
                                            sx={{ cursor: "pointer" }}
                                            lg={2}
                                            md={2}
                                            sm={2}
                                            xs={2}
                                            onClick={() =>
                                              renderFilePreviewEdit(row.files)
                                            }
                                          >
                                            <VisibilityOutlinedIcon
                                              style={{
                                                fontsize: "large",
                                                color: "#357AE8",
                                                cursor: "pointer",
                                              }}
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            xs={1}
                                          >
                                            <Button
                                              style={{
                                                fontsize: "large",
                                                color: "#357AE8",
                                                cursor: "pointer",
                                                marginTop: "-5px",
                                              }}
                                              onClick={() =>
                                                handleFileDeleteEdit(index)
                                              }
                                            >
                                              <DeleteIcon />
                                            </Button>
                                          </Grid>
                                        </Grid>
                                      )}
                                    </div>
                                    <Dialog
                                      open={isWebcamOpen}
                                      onClose={webcamClose}
                                      aria-labelledby="alert-dialog-title"
                                      aria-describedby="alert-dialog-description"
                                    >
                                      <DialogContent
                                        sx={{
                                          textAlign: "center",
                                          alignItems: "center",
                                        }}
                                      >
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
                                        <Button
                                          variant="contained"
                                          color="error"
                                          onClick={webcamClose}
                                        >
                                          CANCEL
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </div>
                                </TableCell>
                              );
                            case "Pre-Value":
                              return (
                                <TableCell>
                                  <Typography>{row?.data}</Typography>
                                </TableCell>
                              );
                            case "Date":
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    type="date"
                                    value={row.data}
                                    onChange={(e) => {
                                      handleDataChange(e, index, "Date");
                                    }}
                                  />
                                </TableCell>
                              );
                            case "Time":
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    type="time"
                                    value={row.data}
                                    onChange={(e) => {
                                      handleDataChange(e, index, "Time");
                                    }}
                                  />
                                </TableCell>
                              );
                            case "DateTime":
                              return (
                                <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="date"
                                      value={dateValue[index]}
                                      onChange={(e) => {
                                        updateDateValuesAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                    <OutlinedInput
                                      type="time"
                                      style={{ height: "32px" }}
                                      value={timeValue[index]}
                                      onChange={(e) => {
                                        updateTimeValuesAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                  </Stack>
                                </TableCell>
                              );
                            case "Date Multi Span":
                              return (
                                <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="date"
                                      value={dateValueMultiFrom[index]}
                                      onChange={(e) => {
                                        updateFromDateValueAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                    <OutlinedInput
                                      type="date"
                                      style={{ height: "32px" }}
                                      value={dateValueMultiTo[index]}
                                      onChange={(e) => {
                                        updateToDateValueAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                  </Stack>
                                </TableCell>
                              );
                            case "Date Multi Span Time":
                              return (
                                <TableCell>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "10px",
                                    }}
                                  >
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        type="date"
                                        value={firstDateValue[index]}
                                        onChange={(e) => {
                                          updateFirstDateValuesAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                      <OutlinedInput
                                        type="time"
                                        style={{ height: "32px" }}
                                        value={firstTimeValue[index]}
                                        onChange={(e) => {
                                          updateFirstTimeValuesAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                      <OutlinedInput
                                        type="date"
                                        style={{ height: "32px" }}
                                        value={secondDateValue[index]}
                                        onChange={(e) => {
                                          updateSecondDateValuesAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                      <OutlinedInput
                                        style={{ height: "32px" }}
                                        type="time"
                                        value={secondTimeValue[index]}
                                        onChange={(e) => {
                                          updateSecondTimeValuesAtIndex(
                                            e.target.value,
                                            index
                                          );
                                        }}
                                      />
                                    </Stack>
                                  </div>
                                </TableCell>
                              );
                            case "Date Multi Random":
                              return (
                                <TableCell>
                                  <OutlinedInput
                                    style={{ height: "32px" }}
                                    type="date"
                                    value={row.data}
                                    onChange={(e) => {
                                      handleDataChange(
                                        e,
                                        index,
                                        "Date Multi Random"
                                      );
                                    }}
                                  />
                                </TableCell>
                              );
                            case "Date Multi Random Time":
                              return (
                                <TableCell>
                                  <Stack direction="row" spacing={2}>
                                    <OutlinedInput
                                      style={{ height: "32px" }}
                                      type="date"
                                      value={dateValueRandom[index]}
                                      onChange={(e) => {
                                        updateDateValueAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                    <OutlinedInput
                                      type="time"
                                      style={{ height: "32px" }}
                                      value={timeValueRandom[index]}
                                      onChange={(e) => {
                                        updateTimeValueAtIndex(
                                          e.target.value,
                                          index
                                        );
                                      }}
                                    />
                                  </Stack>
                                </TableCell>
                              );
                            case "Radio":
                              return (
                                <TableCell>
                                  <FormControl component="fieldset">
                                    <RadioGroup
                                      value={row.data}
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row !important",
                                      }}
                                      onChange={(e) => {
                                        handleDataChange(e, index, "Radio");
                                      }}
                                    >
                                      <FormControlLabel
                                        value="No"
                                        control={<Radio />}
                                        label="No"
                                      />
                                      <FormControlLabel
                                        value="Yes"
                                        control={<Radio />}
                                        label="Yes"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </TableCell>
                              );

                            default:
                              return <TableCell></TableCell>; // Default case
                          }
                        })()}
                        <TableCell>
                          <span>
                            {row?.employee &&
                              row?.employee?.map((data, index) => (
                                <Typography key={index} variant="body1">{`${index + 1
                                  }.${data}, `}</Typography>
                              ))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Typography>{row?.completedby}</Typography>
                        </TableCell>
                        <TableCell>
                          {row.completedat &&
                            moment(row.completedat).format(
                              "DD-MM-YYYY hh:mm:ss A"
                            )}
                        </TableCell>
                        <TableCell>
                          {row.checklist === "DateTime" ? (
                            ((row.data !== undefined && row.data !== "") ||
                              row.files !== undefined) &&
                              row.data.length === 16 ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )
                          ) : row.checklist === "Date Multi Span" ? (
                            ((row.data !== undefined && row.data !== "") ||
                              row.files !== undefined) &&
                              row.data.length === 21 ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )
                          ) : row.checklist === "Date Multi Span Time" ? (
                            ((row.data !== undefined && row.data !== "") ||
                              row.files !== undefined) &&
                              row.data.length === 33 ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )
                          ) : row.checklist === "Date Multi Random Time" ? (
                            ((row.data !== undefined && row.data !== "") ||
                              row.files !== undefined) &&
                              row.data.length === 16 ? (
                              <Typography>Completed</Typography>
                            ) : (
                              <Typography>Pending</Typography>
                            )
                          ) : (row.data !== undefined && row.data !== "") ||
                            row.files !== undefined ? (
                            <Typography>Completed</Typography>
                          ) : (
                            <Typography>Pending</Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {row.checklist === "DateTime" ? (
                            ((row.data !== undefined && row.data !== "") ||
                              row.files !== undefined) &&
                              row.data.length === 16 ? (
                              <>
                                <IconButton
                                  sx={{ color: "green", cursor: "pointer" }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: "#1565c0", cursor: "pointer" }}
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
                            )
                          ) : row.checklist === "Date Multi Span" ? (
                            ((row.data !== undefined && row.data !== "") ||
                              row.files !== undefined) &&
                              row.data.length === 21 ? (
                              <>
                                <IconButton
                                  sx={{ color: "green", cursor: "pointer" }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: "#1565c0", cursor: "pointer" }}
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
                            )
                          ) : row.checklist === "Date Multi Span Time" ? (
                            ((row.data !== undefined && row.data !== "") ||
                              row.files !== undefined) &&
                              row.data.length === 33 ? (
                              <>
                                <IconButton
                                  sx={{ color: "green", cursor: "pointer" }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: "#1565c0", cursor: "pointer" }}
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
                            )
                          ) : row.checklist === "Date Multi Random Time" ? (
                            ((row.data !== undefined && row.data !== "") ||
                              row.files !== undefined) &&
                              row.data.length === 16 ? (
                              <>
                                <IconButton
                                  sx={{ color: "green", cursor: "pointer" }}
                                  onClick={() => {
                                    updateIndividualData(index);
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                sx={{ color: "#1565c0", cursor: "pointer" }}
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
                            )
                          ) : (row.data !== undefined && row.data !== "") ||
                            row.files !== undefined ? (
                            <>
                              <IconButton
                                sx={{ color: "green", cursor: "pointer" }}
                                onClick={() => {
                                  updateIndividualData(index);
                                }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              sx={{ color: "#1565c0", cursor: "pointer" }}
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
                          )}
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
                <Button
                  sx={userStyle.btncancel}
                  onClick={handleCloseModEditCheckList}
                >
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
            <Typography sx={userStyle.HeaderText}>Employee Leave History</Typography><br /><br />
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
                        <TableCell><b>Leave Type</b></TableCell>
                        <TableCell><b>Applied Count</b></TableCell>
                        <TableCell><b>Approved Count</b></TableCell>
                        <TableCell><b>Rejected Count</b></TableCell>
                        <TableCell><b>Uninformed Count</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyOverAllData.length > 0 ? (
                        historyOverAllData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.leavetype}</TableCell>
                            <TableCell>{row?.appliedCount}</TableCell>
                            <TableCell>{row?.approvedCount}</TableCell>
                            <TableCell>{row?.rejectedCount}</TableCell>
                            <TableCell>{row?.uninformedCount}</TableCell>
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
                        <TableCell><b>Leave Type</b></TableCell>
                        <TableCell><b>Applied Count</b></TableCell>
                        <TableCell><b>Approved Count</b></TableCell>
                        <TableCell><b>Rejected Count</b></TableCell>
                        <TableCell><b>Uninformed Count</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyMonthData.length > 0 ? (
                        historyMonthData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.leavetype}</TableCell>
                            <TableCell>{row?.appliedCount}</TableCell>
                            <TableCell>{row?.approvedCount}</TableCell>
                            <TableCell>{row?.rejectedCount}</TableCell>
                            <TableCell>{row?.uninformedCount}</TableCell>
                          </TableRow>
                        ))) : <TableRow><TableCell colSpan={4} align="center">No Data Available</TableCell> </TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid><br />
            <Grid container spacing={2}>
              <Grid item md={1} sm={1}>
                <Button sx={buttonStyles.buttonsubmit} onClick={sendRequest}>Ok</Button>
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
            <Typography sx={userStyle.HeaderText}>Employee Leave History</Typography><br /><br />
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
                        <TableCell><b>Leave Type</b></TableCell>
                        <TableCell><b>Applied Count</b></TableCell>
                        <TableCell><b>Approved Count</b></TableCell>
                        <TableCell><b>Rejected Count</b></TableCell>
                        <TableCell><b>Uninformed Count</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyOverAllDataUpdate.length > 0 ? (
                        historyOverAllDataUpdate.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.leavetype}</TableCell>
                            <TableCell>{row?.appliedCount}</TableCell>
                            <TableCell>{row?.approvedCount}</TableCell>
                            <TableCell>{row?.rejectedCount}</TableCell>
                            <TableCell>{row?.uninformedCount}</TableCell>
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
                        <TableCell><b>Leave Type</b></TableCell>
                        <TableCell><b>Applied Count</b></TableCell>
                        <TableCell><b>Approved Count</b></TableCell>
                        <TableCell><b>Rejected Count</b></TableCell>
                        <TableCell><b>Uninformed Count</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {historyMonthDataUpdate.length > 0 ? (
                        historyMonthDataUpdate.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row?.leavetype}</TableCell>
                            <TableCell>{row?.appliedCount}</TableCell>
                            <TableCell>{row?.approvedCount}</TableCell>
                            <TableCell>{row?.rejectedCount}</TableCell>
                            <TableCell>{row?.uninformedCount}</TableCell>
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
    </Box>
  );
}

export default Applyleave;