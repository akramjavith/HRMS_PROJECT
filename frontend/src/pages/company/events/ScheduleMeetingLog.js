import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent,
  DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover,
  Checkbox, TextField, IconButton, FormGroup, FormControlLabel, Link, DialogTitle, TextareaAutosize,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Selects from "react-select";
import { saveAs } from "file-saver";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate, useParams } from "react-router-dom";
import { reminderOption, timeZoneOptions, meetingTypeOption, meetingModeOption, } from "../../../components/Componentkeyword";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import LoadingButton from "@mui/lab/LoadingButton";
import UpdateIcon from "@mui/icons-material/Update";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ExportData from "../../../components/ExportData";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";
import InfoPopup from "../../../components/InfoPopup.js";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import PageHeading from "../../../components/PageHeading";
import AggregatedSearchBar from "../../../components/AggregatedSearchBar";
import AggridTable from "../../../components/AggridTable";
import domtoimage from 'dom-to-image';

function ScheduleMeetingLog() {
  const pathname = window.location.pathname;
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [isHandleChange, setIsHandleChange] = useState(false);
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

  let exportColumnNames = ['Company', 'Branch', 'Team', 'Department', 'Title', 'Meeting Type', 'Meeting Category', 'Date', 'Time', 'Duartion', 'Time Zone', 'Participants', 'Meeting Host', 'Reminder', 'Meeting Status'];
  let exportRowValues = ['company', 'branch', 'team', 'department', 'title', 'meetingtype', 'meetingcategory', 'date', 'time', 'duration', 'timezone', 'participants', 'interviewer', 'reminder', 'meetingstatus']

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");

  const backpage = useNavigate();
  const currDate = new Date();
  let uqid = useParams().id;
  const gridRef = useRef(null);
  const gridRefTable = useRef(null);
  //useStates
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  //state to handle edit meeting values
  const [meetingEdit, setMeetingEdit] = useState([]);
  const [agenda, setAgenda] = useState("");
  const [floorOption, setFloorOption] = useState([]);
  const [meetingArray, setMeetingArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allUsersData, allTeam, buttonStyles, pageName, setPageName } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [meetingCheck, setMeetingCheck] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedString, setSearchedString] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMultipleEditOpen, setIsMultipleEditOpen] = useState(false);
  const [deleteMeeting, setDeleteMeeting] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allStatusEdit, setAllStatusEdit] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    meetingstatus: true,
    company: true,
    branch: true,
    branchvenue: true,
    floorvenue: true,
    team: true,
    department: true,
    title: true,
    meetingtype: true,
    meetingcategory: true,
    date: true,
    time: true,
    duration: true,
    timezone: true,
    participants: true,
    interviewer: true,
    reminder: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [locationOption, setLocationOption] = useState([]);
  const [departmentOption, setDepartmentOption] = useState([]);
  const [meetingCatOption, setMeetingCatOption] = useState([]);
  const [repeatEveryOption, setRepeatEveryOption] = useState([]);
  const [hours, setHours] = useState("Hrs");
  const [minutes, setMinutes] = useState("Mins");
  const [oldDate, setOldDate] = useState();
  const [newDate, setNewDate] = useState();
  const [participantIDEdit, setParticipantIDEdit] = useState([]);
  const [meetingHostIDEdit, setMeetingHostIDEdit] = useState([]);
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  const [valueCateEdit, setValueCateEdit] = useState("");

  //useEffect
  useEffect(() => {
    fetchMeetingCategoryAll();
    generateHrsOptions();
    generateMinsOptions();
    generateRepeatEveryOptions();
    fetchFloorAll();
    fetchAllLocation();
    fetchDepartmentAll();
  }, [uqid]);
  useEffect(() => {
    addSerialNumber(meetingArray);
  }, [meetingArray]);

  useEffect(() => {
    fetchMeeting();
    fetchMeetingAll();
  }, [isEditOpen, meetingEdit.branch, uqid]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  //reminder options

  //function to generate repeat every days
  const generateRepeatEveryOptions = () => {
    const repeatEveryOpt = [];
    for (let i = 0; i <= 31; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      repeatEveryOpt.push({
        value: i.toString() + " days",
        label: i.toString() + " days",
      });
    }
    setRepeatEveryOption(repeatEveryOpt);
  };
  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setHrsOption(hrsOpt);
  };
  //function to generate mins
  const generateMinsOptions = () => {
    const minsOpt = [];
    for (let i = 0; i <= 59; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      minsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMinsOption(minsOpt);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    setIsHandleChange(true);
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] =
    useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState("");

  //company multiselect
  const handleCompanyChangeEdit = (options) => {
    setCompanyValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompanyOptionsCateEdit(options);
    setBranchValueCateEdit([]);
    setSelectedBranchOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setDepartmentValueCateEdit([]);
    setSelectedDepartmentOptionsCateEdit([]);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);
    setMeetingEdit({ ...meetingEdit, venue: "Please Select Area" });
  };
  const customValueRendererCompanyEdit = (
    companyValueCateEdit,
    _employeename
  ) => {
    return companyValueCateEdit?.length
      ? companyValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect

  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] = useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState("");

  const handleBranchChangeEdit = (options) => {
    setBranchValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCateEdit(options);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setDepartmentValueCateEdit([]);
    setSelectedDepartmentOptionsCateEdit([]);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);
    setMeetingEdit({ ...meetingEdit, venue: "Please Select Area" });
  };
  const customValueRendererBranchEdit = (branchValueCateEdit, _employeename) => {
    return branchValueCateEdit?.length
      ? branchValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //team multiselect

  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] = useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState("");

  const handleTeamChangeEdit = (options) => {
    setTeamValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCateEdit(options);
    setDepartmentValueCateEdit([]);
    setSelectedDepartmentOptionsCateEdit([]);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);
  };
  const customValueRendererTeamEdit = (teamValueCateEdit, _employeename) => {
    return teamValueCateEdit?.length
      ? teamValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //Department multiselect
  const [selectedDepartmentOptionsCateEdit, setSelectedDepartmentOptionsCateEdit,] = useState([]);
  const [departmentValueCateEdit, setDepartmentValueCateEdit] = useState("");
  const [employeeLengthEdit, setEmployeeLengthEdit] = useState([]);
  const handleDepartmentChangeEdit = (options) => {
    let dep = options.map((a, index) => {
      return a.value;
    });
    setDepartmentValueCateEdit(dep);
    setSelectedDepartmentOptionsCateEdit(options);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);

    let emplen = [
      ...allUsersData
        ?.filter(
          (u) =>
            companyValueCateEdit?.includes(u.company) &&
            branchValueCateEdit?.includes(u.branch) &&
            dep?.includes(u.department) &&
            teamValueCateEdit?.includes(u.team)
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        })),
    ];
    setEmployeeLengthEdit(emplen);
  };
  const customValueRendererDepartmentEdit = (
    departmentValueCateEdit,
    _employeename
  ) => {
    return departmentValueCateEdit?.length
      ? departmentValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };

  //branch venue multiselect
  const [selectedBranchVenueOptionsCateEdit, setSelectedBranchVenueOptionsCateEdit,] = useState([]);
  const [branchVenueValueCateEdit, setBranchVenueValueCateEdit] = useState("");

  const handleBranchVenueChangeEdit = (options) => {
    setBranchVenueValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchVenueOptionsCateEdit(options);
    setFloorVenueValueCateEdit([]);
    setSelectedFloorVenueOptionsCateEdit([]);
    setMeetingEdit({ ...meetingEdit, venue: "Please Select Area" });
  };
  const customValueRendererBranchVenueEdit = (
    branchVenueValueCateEdit,
    _employeename
  ) => {
    return branchVenueValueCateEdit?.length
      ? branchVenueValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //floor venue multiselect
  const [
    selectedFloorVenueOptionsCateEdit,
    setSelectedFloorVenueOptionsCateEdit,
  ] = useState([]);
  const [floorVenueValueCateEdit, setFloorVenueValueCateEdit] = useState("");

  const handleFloorVenueChangeEdit = (options) => {
    setFloorVenueValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedFloorVenueOptionsCateEdit(options);
    setMeetingEdit({ ...meetingEdit, venue: "Please Select Area" });
  };
  const customValueRendererFloorVenueEdit = (
    floorVenueValueCateEdit,
    _employeename
  ) => {
    return floorVenueValueCateEdit?.length
      ? floorVenueValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Floor";
  };

  //host company multiselect
  const [selectedCompanyHostOptionsCateEdit, setSelectedCompanyHostOptionsCateEdit,] = useState([]);
  const [companyHostValueCateEdit, setCompanyHostValueCateEdit] = useState("");

  const handleCompanyHostChangeEdit = (options) => {
    setCompanyHostValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompanyHostOptionsCateEdit(options);
    setBranchHostValueCateEdit([]);
    setSelectedBranchHostOptionsCateEdit([]);
    setTeamHostValueCateEdit([]);
    setSelectedTeamHostOptionsCateEdit([]);
    setDepartmentHostValueCateEdit([]);
    setSelectedDepartmentHostOptionsCateEdit([]);
    setValueCateHostEdit([]);
    setSelectedOptionsCateHostEdit([]);
  };
  const customValueRendererCompanyHostEdit = (
    companyHostValueCateEdit,
    _employeename
  ) => {
    return companyHostValueCateEdit?.length
      ? companyHostValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch host  multiselect

  const [selectedBranchHostOptionsCateEdit, setSelectedBranchHostOptionsCateEdit,] = useState([]);
  const [branchHostValueCateEdit, setBranchHostValueCateEdit] = useState("");

  const handleBranchHostChangeEdit = (options) => {
    setBranchHostValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchHostOptionsCateEdit(options);
    setTeamHostValueCateEdit([]);
    setSelectedTeamHostOptionsCateEdit([]);
    setDepartmentHostValueCateEdit([]);
    setSelectedDepartmentHostOptionsCateEdit([]);
    setValueCateHostEdit([]);
    setSelectedOptionsCateHostEdit([]);
  };
  const customValueRendererBranchHostEdit = (
    branchHostValueCateEdit,
    _employeename
  ) => {
    return branchHostValueCateEdit?.length
      ? branchHostValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //team host multiselect
  const [selectedTeamHostOptionsCateEdit, setSelectedTeamHostOptionsCateEdit] =
    useState([]);
  const [teamHostValueCateEdit, setTeamHostValueCateEdit] = useState("");

  const handleTeamHostChangeEdit = (options) => {
    setTeamHostValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamHostOptionsCateEdit(options);
    setDepartmentHostValueCateEdit([]);
    setSelectedDepartmentHostOptionsCateEdit([]);
    setValueCateHostEdit([]);
    setSelectedOptionsCateHostEdit([]);
  };
  const customValueRendererTeamHostEdit = (
    teamHostValueCateEdit,
    _employeename
  ) => {
    return teamHostValueCateEdit?.length
      ? teamHostValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //Department host multiselect

  const [selectedDepartmentHostOptionsCateEdit, setSelectedDepartmentHostOptionsCateEdit,] = useState([]);
  const [departmentHostValueCateEdit, setDepartmentHostValueCateEdit] =
    useState("");
  const [hostLengthEdit, setHostlengthEdit] = useState([]);
  const handleDepartmentHostChangeEdit = (options) => {
    let hostdep = options.map((a, index) => {
      return a.value;
    });

    setDepartmentHostValueCateEdit(hostdep);
    setSelectedDepartmentHostOptionsCateEdit(options);
    setValueCateHostEdit([]);
    setSelectedOptionsCateHostEdit([]);

    let hostlen = [
      ...allUsersData
        ?.filter(
          (u) =>
            companyHostValueCateEdit?.includes(u.company) &&
            branchHostValueCateEdit?.includes(u.branch) &&
            hostdep?.includes(u.department) &&
            teamHostValueCateEdit?.includes(u.team)
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        })),
    ];
    setHostlengthEdit(hostlen);
  };
  const customValueRendererDepartmentHostEdit = (
    departmentHostValueCateEdit,
    _employeename
  ) => {
    return departmentHostValueCateEdit?.length
      ? departmentHostValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };

  //meeting host multiselect

  const [selectedOptionsCateHostEdit, setSelectedOptionsCateHostEdit] =
    useState([]);
  const [valueCateHostEdit, setValueCateHostEdit] = useState("");

  const handleCategoryChangeEditHost = (options) => {
    if (hostLengthEdit.length === options.length) {
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsCateHostEdit(filteredOptions);
      setValueCateHostEdit(filteredOptions.map((option) => option.value));
      setMeetingHostIDEdit(filteredOptions.map((option) => option._id));
    }
    // Check if "ALL" is selected
    else if (options.some((option) => option.value === "ALL")) {
      // Set "ALL" as the only selected option
      setSelectedOptionsCateHostEdit([{ value: "ALL", label: "ALL" }]);
      setValueCateHostEdit(["ALL"]);
      setMeetingHostIDEdit([]);
    } else {
      // Filter out "ALL" if any other option is selected
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsCateHostEdit(filteredOptions);
      setValueCateHostEdit(filteredOptions.map((option) => option.value));
      setMeetingHostIDEdit(filteredOptions.map((option) => option._id));
    }
  };
  const customValueRendererCateEditHost = (valueCateEdit, _employeename) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Meeting Host";
  };

  //get all branches.
  const fetchMeetingCategoryAll = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.MEETINGMASTER, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setMeetingCatOption([
        ...res_location?.data?.meetingmasters?.map((t) => ({
          ...t,
          label: t.namemeeting,
          value: t.namemeeting,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get all floor.
  const fetchFloorAll = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.FLOOR, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setFloorOption([
        ...res_location?.data?.floors?.map((t) => ({
          ...t,
          label: t.name,
          value: t.name,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get locations
  const fetchAllLocation = async () => {
    setPageName(!pageName);
    try {
      let res_location = await axios.get(SERVICE.AREAGROUPING, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setLocationOption(res_location?.data?.areagroupings);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //function to fetch department based on branch and team
  const fetchDepartmentAll = async () => {
    setPageName(!pageName);
    try {
      let res_deptandteam = await axios.get(SERVICE.DEPARTMENT, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });

      setDepartmentOption([
        ...res_deptandteam?.data?.departmentdetails?.map((t) => ({
          ...t,
          label: t.deptname,
          value: t.deptname,
        })),
      ]);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

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
  // view model
  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };
  // info model
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };
  //Delete model
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  //multiple edit  model
  const handleClickOpenMultiple = () => {
    setIsMultipleEditOpen(true);
  };
  const handleClickCloseMultiple = () => {
    setIsMultipleEditOpen(false);
  };
  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };
  const username = isUserRoleAccess.username;
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

  //set function to get particular row
  const rowData = async (id, name) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MEETING}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setDeleteMeeting(res?.data?.sschedulemeeting);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Alert delete popup
  let meetingid = deleteMeeting._id;
  const delMeeting = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.SINGLE_MEETING}/${meetingid}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      await fetchMeeting();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const bulkdeletefunction = async () => {
    setPageName(!pageName);
    try {
      setMeetingCheck(true);
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_MEETING}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      await Promise.all(deletePromises);
      setIsHandleChange(false);
      setMeetingCheck(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchMeeting();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //multiselect edit
  const handleCategoryChangeEdit = (options) => {
    if (employeeLengthEdit.length === options.length) {
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsCateEdit(filteredOptions);
      setValueCateEdit(filteredOptions.map((option) => option.value));
      setParticipantIDEdit(filteredOptions.map((option) => option._id));
    }
    // Check if "ALL" is selected
    else if (options.some((option) => option.value === "ALL")) {
      // Set "ALL" as the only selected option
      setSelectedOptionsCateEdit([{ value: "ALL", label: "ALL" }]);
      setValueCateEdit(["ALL"]);
      setParticipantIDEdit([]);
    } else {
      // Filter out "ALL" if any other option is selected
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsCateEdit(filteredOptions);
      setValueCateEdit(filteredOptions.map((option) => option.value));
      setParticipantIDEdit(filteredOptions.map((option) => option._id));
    }
  };
  const customValueRendererCateEdit = (valueCateEdit, _employeename) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Participants";
  };

  //Edit model...
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setHours("Hrs");
    setMinutes("Mins");
    setAgenda("");
  };
  //get single row to edit....
  const getCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MEETING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMeetingEdit(res?.data?.sschedulemeeting);
      setOldDate(res?.data?.sschedulemeeting?.date);
      setNewDate(res?.data?.sschedulemeeting?.date);
      handleClickOpenEdit();
      setAgenda(res?.data?.sschedulemeeting.agenda);
      const [hours, minutes] = res?.data?.sschedulemeeting.duration.split(":");
      setHours(hours);
      setMinutes(minutes);
      setParticipantIDEdit(res?.data?.sschedulemeeting?.participantsid);
      setMeetingHostIDEdit(res?.data?.sschedulemeeting?.meetinghostid);
      setValueCateEdit(res?.data?.sschedulemeeting?.participants);
      setSelectedOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.participants.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      setCompanyValueCateEdit(res?.data?.sschedulemeeting?.company);
      setSelectedCompanyOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.company.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setBranchValueCateEdit(res?.data?.sschedulemeeting?.branch);
      setSelectedBranchOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.branch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setDepartmentValueCateEdit(res?.data?.sschedulemeeting?.department);
      setSelectedDepartmentOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.department.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setTeamValueCateEdit(res?.data?.sschedulemeeting?.team);
      setSelectedTeamOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.team.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setBranchVenueValueCateEdit(res?.data?.sschedulemeeting?.branchvenue);
      setSelectedBranchVenueOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.branchvenue.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setFloorVenueValueCateEdit(res?.data?.sschedulemeeting?.floorvenue);
      setSelectedFloorVenueOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.floorvenue.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      setValueCateHostEdit(res?.data?.sschedulemeeting?.interviewer);
      setSelectedOptionsCateHostEdit([
        ...res?.data?.sschedulemeeting?.interviewer.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      setCompanyHostValueCateEdit(res?.data?.sschedulemeeting?.hostcompany);
      setSelectedCompanyHostOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.hostcompany.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setBranchHostValueCateEdit(res?.data?.sschedulemeeting?.hostbranch);
      setSelectedBranchHostOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.hostbranch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setDepartmentHostValueCateEdit(
        res?.data?.sschedulemeeting?.hostdepartment
      );
      setSelectedDepartmentHostOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.hostdepartment.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setTeamHostValueCateEdit(res?.data?.sschedulemeeting?.hostteam);
      setSelectedTeamHostOptionsCateEdit([
        ...res?.data?.sschedulemeeting?.hostteam.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      let emplen = [
        ...allUsersData
          ?.filter(
            (u) =>
              res?.data?.sschedulemeeting?.company?.includes(u.company) &&
              res?.data?.sschedulemeeting?.branch?.includes(u.branch) &&
              res?.data?.sschedulemeeting?.department?.includes(u.department) &&
              res?.data?.sschedulemeeting?.team?.includes(u.team)
          )
          .map((u) => ({
            label: u.companyname,
            value: u.companyname,
          })),
      ];
      setEmployeeLengthEdit(emplen);

      let hostlen = [
        ...allUsersData
          ?.filter(
            (u) =>
              res?.data?.sschedulemeeting?.hostcompany?.includes(u.company) &&
              res?.data?.sschedulemeeting?.hostbranch?.includes(u.branch) &&
              res?.data?.sschedulemeeting?.hostdepartment?.includes(
                u.department
              ) &&
              res?.data?.sschedulemeeting?.hostteam?.includes(u.team)
          )
          .map((u) => ({
            label: u.companyname,
            value: u.companyname,
          })),
      ];
      setHostlengthEdit(hostlen);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MEETING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMeetingEdit(res?.data?.sschedulemeeting);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MEETING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMeetingEdit(res?.data?.sschedulemeeting);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // updateby edit page...
  let updateby = meetingEdit.updatedby;
  let addedby = meetingEdit.addedby;
  let meetingId = meetingEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(`${SERVICE.SINGLE_MEETING}/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: [...companyValueCateEdit],
        branch: [...branchValueCateEdit],
        team: [...teamValueCateEdit],
        department: [...departmentValueCateEdit],
        branchvenue:
          meetingEdit.meetingtype === "Offline"
            ? [...branchVenueValueCateEdit]
            : [],
        floorvenue:
          meetingEdit.meetingtype === "Offline"
            ? [...floorVenueValueCateEdit]
            : [],

        meetingcategory: String(meetingEdit.meetingcategory),
        meetingtype: String(meetingEdit.meetingtype),
        venue: String(
          meetingEdit.meetingtype === "Offline" ? meetingEdit.venue : ""
        ),
        meetingmode: String(
          meetingEdit.meetingtype === "Online" ? meetingEdit.meetingmode : ""
        ),
        link: String(
          meetingEdit.meetingtype === "Online" ? meetingEdit.link : ""
        ),
        title: String(meetingEdit.title),
        date: String(meetingEdit.date),
        time: String(meetingEdit.time),
        duration: String(meetingEdit.duration),
        timezone: String(meetingEdit.timezone),
        participants: [...valueCateEdit],
        participantsid: participantIDEdit,
        meetinghostid: meetingHostIDEdit,
        reminder: String(meetingEdit.reminder),
        agenda: String(agenda),
        recuringmeeting: Boolean(meetingEdit.recuringmeeting),
        repeattype: String(
          meetingEdit.recuringmeeting ? meetingEdit.repeattype : "Once"
        ),
        // repeatevery: String(meetingEdit.recuringmeeting ? meetingEdit.repeatevery : "00 days"),
        hostcompany: [...companyHostValueCateEdit],
        hostbranch: [...branchHostValueCateEdit],
        hostteam: [...teamHostValueCateEdit],
        hostdepartment: [...departmentHostValueCateEdit],
        interviewer: [...valueCateHostEdit],
        interviewscheduledby: String(isUserRoleAccess?._id),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
        edittype: "single",
      });
      await fetchMeeting();
      await fetchMeetingAll();
      setAgenda("");
      setHours("Hrs");
      setMinutes("Mins");
      handleCloseModEdit();
      handleClickCloseMultiple();
      setValueCateEdit("");
      setSelectedOptionsCateEdit([]);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //editing the single data...
  const sendMultipleEditRequest = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_MEETING}/${meetingEdit.uniqueid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: [...companyValueCateEdit],
          branch: [...branchValueCateEdit],
          team: [...teamValueCateEdit],
          department: [...departmentValueCateEdit],
          branchvenue:
            meetingEdit.meetingtype === "Offline"
              ? [...branchVenueValueCateEdit]
              : [],
          floorvenue:
            meetingEdit.meetingtype === "Offline"
              ? [...floorVenueValueCateEdit]
              : [],

          meetingcategory: String(meetingEdit.meetingcategory),
          meetingtype: String(meetingEdit.meetingtype),
          venue: String(
            meetingEdit.meetingtype === "Offline" ? meetingEdit.venue : ""
          ),
          meetingmode: String(
            meetingEdit.meetingtype === "Online" ? meetingEdit.meetingmode : ""
          ),
          link: String(
            meetingEdit.meetingtype === "Online" ? meetingEdit.link : ""
          ),
          title: String(meetingEdit.title),
          // date: String(meetingEdit.date),
          time: String(meetingEdit.time),
          duration: String(meetingEdit.duration),
          timezone: String(meetingEdit.timezone),
          participants: [...valueCateEdit],
          participantsid: participantIDEdit,
          meetinghostid: meetingHostIDEdit,
          reminder: String(meetingEdit.reminder),
          agenda: String(agenda),
          recuringmeeting: Boolean(meetingEdit.recuringmeeting),
          repeattype: String(
            meetingEdit.recuringmeeting ? meetingEdit.repeattype : "Once"
          ),
          // repeatevery: String(meetingEdit.recuringmeeting ? meetingEdit.repeatevery : "00 days"),
          hostcompany: [...companyHostValueCateEdit],
          hostbranch: [...branchHostValueCateEdit],
          hostteam: [...teamHostValueCateEdit],
          hostdepartment: [...departmentHostValueCateEdit],
          interviewer: [...valueCateHostEdit],
          interviewscheduledby: String(isUserRoleAccess?._id),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
          edittype: "multiple",
        }
      );
      await fetchMeeting();
      await fetchMeetingAll();
      setAgenda("");
      setHours("Hrs");
      setMinutes("Mins");
      handleCloseModEdit();
      handleClickCloseMultiple();
      setValueCateEdit("");
      setSelectedOptionsCateEdit([]);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const editSubmit = (e) => {
    e.preventDefault();
    fetchMeetingAll();
    // let compopt = selectedCompanyOptionsCateEdit.map((item) => item.value);
    // let branchopt = selectedBranchOptionsCateEdit.map((item) => item.value);
    // let deptopt = selectedDepartmentOptionsCateEdit.map((item) => item.value);
    // let teamopt = selectedTeamOptionsCateEdit.map((item) => item.value);
    // let empopt = selectedOptionsCateEdit.map((item) => item.value);
    // const isNameMatch = allStatusEdit.some(
    //   (item) =>
    //     item.company.some((data) => compopt.includes(data)) &&
    //     item.branch.some((data) => branchopt.includes(data)) &&
    //     item.department.some((data) => deptopt.includes(data)) &&
    //     item.team.some((data) => teamopt.includes(data)) &&
    //     item.participants.some((data) => empopt.includes(data)) &&
    //     item.meetingcategory?.toLowerCase() ===
    //       meetingEdit.meetingcategory?.toLowerCase() &&
    //     item.meetingtype?.toLowerCase() ===
    //       meetingEdit.meetingtype?.toLowerCase() &&
    //     item.title?.toLowerCase() === meetingEdit.title?.toLowerCase() &&
    //     item.date === meetingEdit.date &&
    //     item.time === meetingEdit.time
    // );
    if (companyValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branchValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (teamValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (departmentValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      meetingEdit.meetingcategory === "Please Select Meeting Category"
    ) {
      setPopupContentMalert("Please Select Meeting Category");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (meetingEdit.meetingtype === "Please Select Meeting Type") {
      setPopupContentMalert("Please Select Meeting Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      meetingEdit.meetingtype === "Offline" &&
      branchVenueValueCateEdit?.length == 0
    ) {
      setPopupContentMalert("Please Select Location-Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      meetingEdit.meetingtype === "Offline" &&
      floorVenueValueCateEdit?.length == 0
    ) {
      setPopupContentMalert("Please Select Location-Floor");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      meetingEdit.meetingtype === "Online" &&
      (meetingEdit.meetingmode === "Please Select Meeting Mode" ||
        meetingEdit.meetingmode === "")
    ) {
      setPopupContentMalert("Please Select Meeting Mode");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      meetingEdit.meetingtype === "Online" &&
      meetingEdit.link === ""
    ) {
      setPopupContentMalert("Please Enter Meeting Link");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      meetingEdit.meetingtype === "Offline" &&
      (meetingEdit.venue === "Please Select Area" || meetingEdit.venue === "")
    ) {
      setPopupContentMalert("Please Select Meeting Location-Area");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (meetingEdit.title === "") {
      setPopupContentMalert("Please Enter Title");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (meetingEdit.date === "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (meetingEdit.time === "") {
      setPopupContentMalert("Please Select Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      meetingEdit.duration === "00:00" ||
      meetingEdit.duration.includes("Mins")
    ) {
      setPopupContentMalert("Please Select Duration");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (meetingEdit.timezone === "Please Select Time Zone") {
      setPopupContentMalert("Please Select Time Zone");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueCateEdit.length === 0) {
      setPopupContentMalert("Please Select Participants");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (meetingEdit.reminder === "Please Select Reminder") {
      setPopupContentMalert("Please Select Reminder");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      meetingEdit.recuringmeeting &&
      (meetingEdit.repeattype === "Repeat Type" ||
        meetingEdit.repeattype === "Once")
    ) {
      setPopupContentMalert("Please Select Repeat Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (companyHostValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Meeting Host Company");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branchHostValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Meeting Host Branch");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (teamHostValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Meeting Host Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (departmentHostValueCateEdit?.length == 0) {
      setPopupContentMalert("Please Select Meeting Host Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueCateHostEdit.length === 0) {
      setPopupContentMalert("Please Select Meeting Host");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (meetingEdit.recuringmeeting && oldDate === newDate) {
      handleClickOpenMultiple();
    } else {
      sendEditRequest();
    }
  };

  //get all data.
  const fetchMeeting = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.get(
        `${SERVICE.SCHEDULE_MEETING_LOG}/${uqid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const { company, branch, department, team, companyname, _id, username } =
        isUserRoleAccess;

      const result = res_status?.data?.schedulemeetinglog.filter((data) => {
        const participantsIncludesAll = data?.participants?.includes("ALL");
        const interviewerIncludesAll = data?.interviewer?.includes("ALL");

        if (participantsIncludesAll || interviewerIncludesAll) {
          const companyMatch =
            data?.company?.includes(company) ||
            data?.hostcompany?.includes(company);
          const branchMatch =
            data?.branch?.includes(branch) ||
            data?.hostbranch?.includes(branch);
          const departmentMatch =
            data?.department?.includes(department) ||
            data?.hostdepartment?.includes(department);
          const teamMatch =
            data?.team?.includes(team) || data?.hostteam?.includes(team);
          const participantsOrInterviewerIncludes =
            data?.participants?.includes(companyname) ||
            data?.interviewer?.includes(companyname);

          if (
            (companyMatch &&
              branchMatch &&
              departmentMatch &&
              teamMatch &&
              (participantsIncludesAll || participantsOrInterviewerIncludes)) ||
            interviewerIncludesAll ||
            participantsOrInterviewerIncludes ||
            data?.addedby?.some((item) => item?.name === username)
          ) {
            return true;
          }
        }

        return (
          data?.participantsid?.includes(_id) ||
          data?.participants?.includes(companyname) ||
          data?.meetinghostid?.includes(_id) ||
          data?.interviewer?.includes(companyname) ||
          data?.interviewscheduledby === _id ||
          data?.addedby?.some((item) => item?.name === username)
        );
      });

      const resdata = isUserRoleAccess.role.includes("Manager")
        ? res_status?.data?.schedulemeetinglog
        : result;

      setMeetingArray(resdata.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        company: item.company?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        branch: item.branch?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        branchvenue: item.branchvenue
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        floorvenue: item.floorvenue
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        team: item.team?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
        department: item.department
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        date: moment(item.date).format("DD-MM-YYYY"),
        participants: item.participants
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
        interviewer: item.interviewer
          ?.map((t, i) => `${i + 1 + ". "}` + t)
          .toString(),
      })));
      setMeetingCheck(true);
    } catch (err) {
      setMeetingCheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //get all data.
  const fetchMeetingAll = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(SERVICE.ALL_MEETING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      setAllStatusEdit(
        res_status?.data?.schedulemeeting.filter(
          (item) => item._id !== meetingEdit._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Schedule Meeting Log.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };



  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Schedule Meeting Log",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = (datas) => {
    setItems(datas);
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
  const searchOverAllTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverAllTerms.every((term) =>
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
  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const [btnSubmit, setBtnSubmit] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const [status, setStatus] = useState({});
  const handleAction = (value, rowId, sno) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [rowId]: {
        ...prevStatus[rowId],
        meetingstatus: value,
        btnShow: true,
      },
    }));
    setRowIndex(sno);
  };
  const [meetingStatus, setMeetingStatus] = useState({
    id: "",
    status: "",
  });
  const handleUpdate = async (status, candiId) => {
    setPageName(!pageName);
    try {
      if (status === "Completed") {
        handleOpenMinutesOfMeeting();
        setMeetingStatus({
          id: candiId,
          status: status,
        });
      } else {
        setBtnSubmit(true);
        let res = await axios.put(`${SERVICE.SINGLE_MEETING}/${candiId}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          meetingstatus: String(status),
          edittype: "single",
          minutesofmeeting: "",
        });

        await fetchMeeting();
        setStatus({});
        setBtnSubmit(false);
        setPopupContent("Updated Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      setBtnSubmit(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const [openMinutesOfMeeting, setOpenMinutesOfMeeting] = useState(false);
  const [minutesOfMeeting, setMinutesOfMeeting] = useState("");

  const handleOpenMinutesOfMeeting = () => {
    setOpenMinutesOfMeeting(true);
  };
  const handleCloseMinutesOfMeeting = () => {
    setOpenMinutesOfMeeting(false);
    setMinutesOfMeeting(""); // Clear the text area when closing
  };

  const handleUpdateMinutesOfMeeting = async () => {
    setPageName(!pageName);
    // Add your update logic here

    try {
      setBtnSubmit(true);
      let res = await axios.put(
        `${SERVICE.SINGLE_MEETING}/${meetingStatus?.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          meetingstatus: String(meetingStatus?.status),
          minutesofmeeting: String(minutesOfMeeting),
          edittype: "single",
        }
      );

      await fetchMeeting();
      setStatus({});
      setMeetingStatus({});
      setBtnSubmit(false);
      setOpenMinutesOfMeeting(false);
      setMinutesOfMeeting(""); // Clear after update
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      setBtnSubmit(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: { fontWeight: "bold" },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 150,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 150,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0,
      width: 100,
      hide: !columnVisibility.title,
      headerClassName: "bold-header",
    },
    {
      field: "meetingtype",
      headerName: "Meeting Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.meetingtype,
      headerClassName: "bold-header",
    },
    {
      field: "meetingcategory",
      headerName: "Meeting Category",
      flex: 0,
      width: 150,
      hide: !columnVisibility.meetingcategory,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0,
      width: 100,
      hide: !columnVisibility.date,
      headerClassName: "bold-header",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 0,
      width: 100,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0,
      width: 100,
      hide: !columnVisibility.duration,
      headerClassName: "bold-header",
    },
    {
      field: "timezone",
      headerName: "Time Zone",
      flex: 0,
      width: 200,
      hide: !columnVisibility.timezone,
      headerClassName: "bold-header",
    },
    {
      field: "participants",
      headerName: "Participants",
      flex: 0,
      width: 150,
      hide: !columnVisibility.participants,
      headerClassName: "bold-header",
    },
    {
      field: "interviewer",
      headerName: "Meeting Host",
      flex: 0,
      width: 150,
      hide: !columnVisibility.interviewer,
      headerClassName: "bold-header",
    },
    {
      field: "reminder",
      headerName: "Reminder",
      flex: 0,
      width: 100,
      hide: !columnVisibility.reminder,
      headerClassName: "bold-header",
    },
    {
      field: "meetingstatus",
      headerName: "Meeting Status",
      flex: 0,
      width: 300,
      sortable: false,
      hide: !columnVisibility.meetingstatus,
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            <>
              <Grid item md={4} xs={12} sm={12} marginTop={3.4} marginBottom={3}>
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
                    style={{ minWidth: 150, width: 200, overflow: "hidden" }}
                    value={
                      status[params.data.id]?.meetingstatus
                        ? status[params.data.id]?.meetingstatus
                        : params.data.meetingstatus
                    }
                    onChange={(e) => {
                      handleAction(
                        e.target.value,
                        params?.data?.id,
                        params.data.serialNumber
                      );
                    }}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <br />
              <br />
              {status[params.data.id]?.btnShow &&
                rowIndex === params.data.serialNumber ? (
                <>
                  {" "}
                  <LoadingButton
                    sx={{
                      ...userStyle.buttonedit,
                      marginLeft: "10px",
                    }}
                    variant="contained"
                    size="small"
                    loading={btnSubmit}
                    style={{ minWidth: "0px" }}
                    onClick={(e) =>
                      handleUpdate(
                        status[params.data.id]?.meetingstatus,
                        params?.data?.id
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
          </>
        </Grid>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eschedulemeeting") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("dschedulemeeting") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id);
              }}
            >
              {" "}
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("vschedulemeeting") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("ischedulemeeting") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
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
      company: item.company,
      branch: item.branch,
      branchvenue: item.branchvenue,
      floorvenue: item.floorvenue,
      team: item.team,
      department: item.department,
      date: item.date,
      participants: item.participants,
      interviewer: item.interviewer,
      title: item.title,
      meetingtype: item.meetingtype,
      meetingcategory: item.meetingcategory,
      time: item.time,
      duration: item.duration,
      timezone: item.timezone,
      reminder: item.reminder,
      recuringmeeting: item.recuringmeeting,
      meetingstatus: item.meetingstatus || "No Status",
    };
  });
  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
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
              {" "}
              Hide All{" "}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );
  return (
    <Box>
      <Headtitle title={"SCHEDULE MEETING LOG"} />
      <Typography sx={userStyle.HeaderText}>Schedule Meeting Log</Typography>

      {/* ****** Table Start ****** */}

      {!meetingCheck ? (
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
          {isUserRoleCompare?.includes("lschedulemeeting") && (
            <Box sx={userStyle.container}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    List Schedule Meeting Log
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <>
                    <Button
                      variant="contained"
                      sx={buttonStyles.btncancel}
                      onClick={() => {
                        backpage(`/setup/schedulemeeting`);
                      }}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        float: "right",
                      }}
                    >
                      BACK
                    </Button>
                  </>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={userStyle.dataTablestyle}>
                <Grid item md={2} xs={12} sm={12}>
                  <Box>
                    <label>Show entries:</label>
                    <Select
                      id="pageSizeSelect"
                      value={pageSize}
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 180, width: 80 } },
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
                      <MenuItem value={meetingArray?.length}>All</MenuItem>
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
                    {isUserRoleCompare?.includes("excelschedulemeeting") && (
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
                    {isUserRoleCompare?.includes("csvschedulemeeting") && (
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
                    {isUserRoleCompare?.includes("printschedulemeeting") && (
                      <>
                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                          &ensp; <FaPrint /> &ensp;Print&ensp;
                        </Button>
                      </>
                    )}
                    {isUserRoleCompare?.includes("pdfschedulemeeting") && (
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
                    {isUserRoleCompare?.includes("imageschedulemeeting") && (
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
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={meetingArray}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={meetingArray}
                  />
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
              &ensp;
              {isUserRoleCompare?.includes("bdschedulemeeting") && (
                <Button
                  variant="contained"
                  sx={buttonStyles.buttonbulkdelete}
                  onClick={handleClickOpenalert}
                >
                  Bulk Delete
                </Button>
              )}
              <br />
              <Box style={{ width: "100%", overflowY: "hidden" }}>
                <>
                  <AggridTable
                    rowDataTable={rowDataTable}
                    columnDataTable={columnDataTable}
                    columnVisibility={columnVisibility}
                    page={page}
                    setPage={setPage}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    setColumnVisibility={setColumnVisibility}
                    isHandleChange={isHandleChange}
                    items={items}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    gridRefTable={gridRefTable}
                    paginated={false}
                    filteredDatas={filteredDatas}
                    // totalDatas={totalDatas}
                    searchQuery={searchedString}
                    handleShowAllColumns={handleShowAllColumns}
                    setFilteredRowData={setFilteredRowData}
                    filteredRowData={filteredRowData}
                    setFilteredChanges={setFilteredChanges}
                    filteredChanges={filteredChanges}
                    gridRefTableImg={gridRefTableImg}
                    itemsList={meetingArray}
                  />
                </>
              </Box>

            </Box>
          )}
        </>
      )}

      {/* ****** Table End ****** */}
      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {manageColumnsContent}
      </Popover>


      {/*multiple ALERT DIALOG */}
      <Dialog
        open={isMultipleEditOpen}
        onClose={handleClickCloseMultiple}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "450px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Do you want to edit this particular data or all similar datas?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => sendEditRequest()}
          >
            {" "}
            Replace this
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => sendMultipleEditRequest()}
          >
            {" "}
            Replace all
          </Button>
          <Button
            onClick={handleClickCloseMultiple}
            style={{
              backgroundColor: "#f4f4f4",
              color: "#444",
              boxShadow: "none",
              borderRadius: "3px",
              border: "1px solid #0000006b",
              "&:hover": {
                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                  backgroundColor: "#f4f4f4",
                },
              },
            }}
          >
            {" "}
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "47px" }}
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Schedule Meeting
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Company</Typography>
                  <Typography>
                    {meetingEdit.company
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Branch</Typography>
                  <Typography>
                    {meetingEdit.branch
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Team</Typography>
                  <Typography>
                    {meetingEdit.team
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Department</Typography>
                  <Typography>
                    {meetingEdit.department
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Category</Typography>
                  <Typography>{meetingEdit.meetingcategory}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Type</Typography>
                  <Typography>{meetingEdit.meetingtype}</Typography>
                </FormControl>
              </Grid>
              {meetingEdit.meetingtype === "Online" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Meeting Mode</Typography>
                      <Typography>{meetingEdit.meetingmode}</Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Link</Typography>
                      <Link
                        href={meetingEdit.link}
                        variant="body3"
                        underline="none"
                        target="_blank"
                      >
                        {meetingEdit.link}
                      </Link>
                    </FormControl>
                  </Grid>
                </>
              )}
              {meetingEdit.meetingtype === "Offline" && (
                <>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Branch</Typography>
                      <Typography>
                        {meetingEdit.branchvenue
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Floor</Typography>
                      <Typography>
                        {meetingEdit.floorvenue
                          ?.map((t, i) => `${i + 1 + ". "}` + t)
                          .toString()}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Location-Area</Typography>
                      <Typography>{meetingEdit.venue}</Typography>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Title</Typography>
                  <Typography>{meetingEdit.title}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Date</Typography>
                  <Typography>
                    {moment(meetingEdit.date).format("DD-MM-YYYY")}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time</Typography>
                  <Typography>{meetingEdit.time}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Duration</Typography>
                  <Typography>{meetingEdit.duration}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Time Zone</Typography>
                  <Typography>{meetingEdit.timezone}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Participants</Typography>
                  <Typography>
                    {meetingEdit.participants
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Meeting Host</Typography>
                  <Typography>
                    {meetingEdit.interviewer
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Type</Typography>
                  <Typography>{meetingEdit.meetingtype}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Meeting Status</Typography>
                  <Typography>
                    {meetingEdit?.meetingstatus || "No Status"}
                  </Typography>
                </FormControl>
              </Grid>
              {meetingEdit?.meetingstatus === "Completed" && (
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Minutes of Meeting</Typography>
                    <Typography>{meetingEdit?.minutesofmeeting}</Typography>
                  </FormControl>
                </Grid>
              )}
              {meetingEdit.reminder && (
                <>
                  {" "}
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Repeat Type</Typography>
                      <Typography>{meetingEdit.repeattype}</Typography>
                    </FormControl>
                  </Grid>
                  {/* <Grid item md={6} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Repeat Every</Typography>
                                        <Typography>{meetingEdit.repeatevery}</Typography>
                                    </FormControl>
                                </Grid> */}
                </>
              )}
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    {" "}
                    Meeting Host
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Company</Typography>
                  <Typography>
                    {meetingEdit.hostcompany
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Branch</Typography>
                  <Typography>
                    {meetingEdit.hostbranch
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Department</Typography>
                  <Typography>
                    {meetingEdit.hostdepartment
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Team</Typography>
                  <Typography>
                    {meetingEdit.hostteam
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Host</Typography>
                  <Typography>
                    {meetingEdit.interviewer
                      ?.map((t, i) => `${i + 1 + ". "}` + t)
                      .toString()}
                  </Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                Back
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Edit DIALOG */}
      <Box>
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{ marginTop: "47px" }}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  Edit Schedule Meeting{" "}
                </Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
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
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedCompanyOptionsCateEdit}
                      onChange={handleCompanyChangeEdit}
                      valueRenderer={customValueRendererCompanyEdit}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) =>
                          companyValueCateEdit?.includes(comp.company)
                        )
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
                      value={selectedBranchOptionsCateEdit}
                      onChange={handleBranchChangeEdit}
                      valueRenderer={customValueRendererBranchEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (u) =>
                            companyValueCateEdit?.includes(u.company) &&
                            branchValueCateEdit?.includes(u.branch)
                        )
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedTeamOptionsCateEdit}
                      onChange={handleTeamChangeEdit}
                      valueRenderer={customValueRendererTeamEdit}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={departmentOption}
                      value={selectedDepartmentOptionsCateEdit}
                      onChange={handleDepartmentChangeEdit}
                      valueRenderer={customValueRendererDepartmentEdit}
                      labelledBy="Please Select Department"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Meeting Category<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={meetingCatOption}
                      placeholder="Please Select Meeting Category"
                      value={{
                        label: meetingEdit.meetingcategory,
                        value: meetingEdit.meetingcategory,
                      }}
                      onChange={(e) => {
                        setMeetingEdit({
                          ...meetingEdit,
                          meetingcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Meeting Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={meetingTypeOption}
                      placeholder="Please Select Meeting Type"
                      value={{
                        label: meetingEdit.meetingtype,
                        value: meetingEdit.meetingtype,
                      }}
                      onChange={(e) => {
                        setMeetingEdit({
                          ...meetingEdit,
                          meetingtype: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                {meetingEdit.meetingtype === "Offline" && (
                  <>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Location-Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={accessbranch
                            ?.filter((comp) =>
                              companyValueCateEdit?.includes(comp.company)
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
                          value={selectedBranchVenueOptionsCateEdit}
                          onChange={handleBranchVenueChangeEdit}
                          valueRenderer={customValueRendererBranchVenueEdit}
                          labelledBy="Please Select Branch"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Location-Floor<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={floorOption
                            ?.filter((u) =>
                              branchVenueValueCateEdit?.includes(u.branch)
                            )
                            .map((u) => ({
                              ...u,
                              label: u.name,
                              value: u.name,
                            }))}
                          value={selectedFloorVenueOptionsCateEdit}
                          onChange={handleFloorVenueChangeEdit}
                          valueRenderer={customValueRendererFloorVenueEdit}
                          labelledBy="Please Select Floor"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Location-Area<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={[
                            ...new Set(
                              locationOption
                                .filter(
                                  (item) =>
                                    floorVenueValueCateEdit?.includes(
                                      item.floor
                                    ) &&
                                    branchVenueValueCateEdit?.includes(
                                      item.branch
                                    )
                                )
                                .flatMap((item) => item.area)
                            ),
                          ].map((location) => ({
                            label: location,
                            value: location,
                          }))}
                          placeholder="Please Select Area"
                          value={{
                            label:
                              meetingEdit.venue === ""
                                ? "Please Select Area"
                                : meetingEdit.venue,
                            value:
                              meetingEdit.venue === ""
                                ? "Please Select Area"
                                : meetingEdit.venue,
                          }}
                          onChange={(e) => {
                            setMeetingEdit({ ...meetingEdit, venue: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                {meetingEdit.meetingtype === "Online" && (
                  <>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Meeting Mode<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={300}
                          options={meetingModeOption}
                          placeholder="Please Select Meeting Mode"
                          value={{
                            label:
                              meetingEdit.meetingmode === ""
                                ? "Please Select Meeting Mode"
                                : meetingEdit.meetingmode,
                            value:
                              meetingEdit.meetingmode === ""
                                ? "Please Select Meeting Mode"
                                : meetingEdit.meetingmode,
                          }}
                          onChange={(e) => {
                            setMeetingEdit({
                              ...meetingEdit,
                              meetingmode: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Link<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Link"
                          value={meetingEdit.link}
                          onChange={(e) => {
                            setMeetingEdit({
                              ...meetingEdit,
                              link: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Title<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Title"
                      value={meetingEdit.title}
                      onChange={(e) => {
                        setMeetingEdit({
                          ...meetingEdit,
                          title: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Date
                      {oldDate !== newDate && meetingEdit.recuringmeeting && (
                        <>(if the date is changed can't edit multiple datas)</>
                      )}
                      <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={meetingEdit.date}
                      onChange={(e) => {
                        setMeetingEdit({
                          ...meetingEdit,
                          date: e.target.value,
                        });
                        setNewDate(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Time<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="time"
                      placeholder="HH:MM:AM/PM"
                      value={meetingEdit.time}
                      onChange={(e) => {
                        setMeetingEdit({
                          ...meetingEdit,
                          time: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <Typography>
                    Duration<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{ label: hours, value: hours }}
                          onChange={(e) => {
                            setHours(e.value);
                            setMeetingEdit({
                              ...meetingEdit,
                              duration: `${e.value}:${minutes}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={minsOption}
                          placeholder="Mins"
                          value={{ label: minutes, value: minutes }}
                          onChange={(e) => {
                            setMinutes(e.value);
                            setMeetingEdit({
                              ...meetingEdit,
                              duration: `${hours}:${e.value}`,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Time Zone<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={timeZoneOptions}
                      placeholder="Please Select Time Zone"
                      value={{
                        label: meetingEdit.timezone,
                        value: meetingEdit.timezone,
                      }}
                      onChange={(e) => {
                        setMeetingEdit({ ...meetingEdit, timezone: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Participants<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        { label: "ALL", value: "ALL" },
                        ...allUsersData
                          ?.filter(
                            (u) =>
                              companyValueCateEdit?.includes(u.company) &&
                              branchValueCateEdit?.includes(u.branch) &&
                              departmentValueCateEdit?.includes(u.department) &&
                              teamValueCateEdit?.includes(u.team)
                          )
                          .map((u) => ({
                            ...u,
                            label: u.companyname,
                            value: u.companyname,
                          })),
                      ]}
                      value={selectedOptionsCateEdit}
                      onChange={handleCategoryChangeEdit}
                      valueRenderer={customValueRendererCateEdit}
                      labelledBy="Please Select Participants"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reminder<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={reminderOption}
                      placeholder="Please Select Reminder"
                      value={{
                        label: meetingEdit.reminder,
                        value: meetingEdit.reminder,
                      }}
                      onChange={(e) => {
                        setMeetingEdit({ ...meetingEdit, reminder: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={meetingEdit.recuringmeeting}
                          readOnly
                        />
                      }
                      label="Recuring Meeting"
                    />
                  </FormGroup>
                  {meetingEdit.recuringmeeting && (
                    <Grid container spacing={1} direction="row">
                      <Grid item md={6} xs={12} sm={12}>
                        <Typography>
                          Repeat Type<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <FormControl fullWidth size="small">
                          <OutlinedInput
                            value={meetingEdit.repeattype}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Agenda</Typography>
                    <ReactQuill
                      style={{ height: "150px" }}
                      value={agenda}
                      onChange={setAgenda}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "video",
                      ]}
                    />
                  </FormControl>
                  <br /> <br />
                  <br />
                  <br />
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Meeting Host
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
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
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedCompanyHostOptionsCateEdit}
                      onChange={handleCompanyHostChangeEdit}
                      valueRenderer={customValueRendererCompanyHostEdit}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={accessbranch
                        ?.filter((comp) =>
                          companyHostValueCateEdit?.includes(comp.company)
                        )
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
                      value={selectedBranchHostOptionsCateEdit}
                      onChange={handleBranchHostChangeEdit}
                      valueRenderer={customValueRendererBranchHostEdit}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={allTeam
                        ?.filter(
                          (u) =>
                            companyHostValueCateEdit?.includes(u.company) &&
                            branchHostValueCateEdit?.includes(u.branch)
                        )
                        .map((u) => ({
                          ...u,
                          label: u.teamname,
                          value: u.teamname,
                        }))}
                      value={selectedTeamHostOptionsCateEdit}
                      onChange={handleTeamHostChangeEdit}
                      valueRenderer={customValueRendererTeamHostEdit}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={departmentOption}
                      value={selectedDepartmentHostOptionsCateEdit}
                      onChange={handleDepartmentHostChangeEdit}
                      valueRenderer={customValueRendererDepartmentHostEdit}
                      labelledBy="Please Select Department"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Host<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={[
                        { label: "ALL", value: "ALL" },
                        ...allUsersData
                          ?.filter(
                            (u) =>
                              companyHostValueCateEdit?.includes(u.company) &&
                              branchHostValueCateEdit?.includes(u.branch) &&
                              departmentHostValueCateEdit?.includes(
                                u.department
                              ) &&
                              teamHostValueCateEdit?.includes(u.team)
                          )
                          .map((u) => ({
                            ...u,
                            label: u.companyname,
                            value: u.companyname,
                          })),
                      ]}
                      value={selectedOptionsCateHostEdit}
                      onChange={handleCategoryChangeEditHost}
                      valueRenderer={customValueRendererCateEditHost}
                      labelledBy="Please Select Participants"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <br />
              <br />
              <Grid container spacing={2}></Grid>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={editSubmit}
                  sx={buttonStyles.buttonsubmit}
                >
                  {" "}
                  Update
                </Button>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                  {" "}
                  Cancel{" "}
                </Button>
              </DialogActions>
            </>
          </Box>
        </Dialog>
      </Box>
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

      {/* Dialog */}
      <Dialog
        open={openMinutesOfMeeting}
        onClose={handleCloseMinutesOfMeeting}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <MeetingRoomIcon fontSize="large" sx={{ marginRight: 2 }} />
            <Typography variant="h6" flexGrow={1}>
              Minutes of Meeting
            </Typography>
            <IconButton onClick={handleCloseMinutesOfMeeting}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            Please type the minutes of the meeting below:
          </Typography>

          <TextareaAutosize
            minRows={5}
            placeholder="Enter minutes of the meeting..."
            style={{ width: "100%", padding: "10px" }}
            value={minutesOfMeeting}
            onChange={(e) => setMinutesOfMeeting(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseMinutesOfMeeting}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateMinutesOfMeeting}
            color="primary"
            variant="contained"
            startIcon={<UpdateIcon />}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
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
        itemsTwo={meetingArray ?? []}
        filename={"Schedule Meeting Log"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Schedule Meeting Log Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delMeeting}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={bulkdeletefunction}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
      {/* EXTERNAL COMPONENTS -------------- END */}
      <br />

    </Box>
  );
}
export default ScheduleMeetingLog;
