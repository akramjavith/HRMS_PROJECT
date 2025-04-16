import React, { useState, useEffect, useRef, useContext } from "react";
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
  FormGroup,
  FormControlLabel,
  Link,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
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
import Selects from "react-select";
import { saveAs } from "file-saver";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MultiSelect } from "react-multi-select-component";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { v4 as uuidv4 } from "uuid";

function ScheduleMeetingNoticePeriod({
  setVendorAuto,
  handleClickCloseMeetingPopup,
  meetingValues,
}) {
  useEffect(() => {
    setValueCompanyCat(meetingValues[0]);
    setSelectedOptionsCompany([
      { label: meetingValues[0], value: meetingValues[0] },
    ]);
    setValueBranchCat(meetingValues[1]);
    setSelectedOptionsBranch([
      { label: meetingValues[1], value: meetingValues[1] },
    ]);

    setValueTeamCat(meetingValues[2]);
    setSelectedOptionsTeam([
      { label: meetingValues[2], value: meetingValues[2] },
    ]);

    setValueDepartmentCat(meetingValues[3]);
    setSelectedOptionsDepartment([
      { label: meetingValues[3], value: meetingValues[3] },
    ]);

    fetchSingleNoticePeriod(meetingValues[5]);
    fetchAssignInterviewr(meetingValues[0], meetingValues[1], meetingValues[2]);
  }, [meetingValues]);
  const currDate = new Date();
  const gridRef = useRef(null);
  //useStates
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  //state to handle meeting values
  const [meetingState, setMeetingState] = useState({
    branch: "Please Select Branch",
    department: "Please Select Department",
    team: "Please Select Team",
    meetingcategory: "Please Select Meeting Category",
    meetingtype: "Please Select Meeting Type",
    meetingmode: "Please Select Meeting Mode",
    venue: "Please Select Area",
    link: "",
    title: "",
    date: "",
    time: "",
    duration: "00:00",
    timezone: "Please Select Time Zone",
    reminder: "Please Select Reminder",
    recuringmeeting: false,
    repeattype: "Repeat Type",
    repeatevery: "00 days",
  });
  //state to handle edit meeting values
  const [meetingEdit, setMeetingEdit] = useState([]);
  const [agenda, setAgenda] = useState("");
  const [floorOption, setFloorOption] = useState([]);
  const [meetingArray, setMeetingArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(
    UserRoleAccessContext
  );
  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));
  const { auth } = useContext(AuthContext);
  const [meetingCheck, setMeetingCheck] = useState(false);
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [openview, setOpenview] = useState(false);
  const [openInfo, setOpeninfo] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMultipleEditOpen, setIsMultipleEditOpen] = useState(false);
  const [deleteMeeting, setDeleteMeeting] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [meetingData, setMeetingData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allStatusEdit, setAllStatusEdit] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [companyOption, setCompanyOption] = useState([]);
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
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
    reminder: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [locationOption, setLocationOption] = useState([]);
  const [departmentOption, setDepartmentOption] = useState([]);
  const [meetingCatOption, setMeetingCatOption] = useState([]);
  const [repeatEveryOption, setRepeatEveryOption] = useState([]);
  const [participantsOption, setParticipantsOption] = useState([]);
  const [hours, setHours] = useState("Hrs");
  const [minutes, setMinutes] = useState("Mins");
  const [oldDate, setOldDate] = useState();
  const [newDate, setNewDate] = useState();
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const [valueCate, setValueCate] = useState("");
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  const [valueCateEdit, setValueCateEdit] = useState("");
  const [teamOption, setTeamOption] = useState([]);

  //useEffect
  useEffect(() => {
    fetchMeeting();
    fetchCompanyAll();
    fetchTeamAll();
    fetchMeetingCategoryAll();
    generateHrsOptions();
    generateMinsOptions();
    generateRepeatEveryOptions();
    fetchFloorAll();
    fetchAllLocation();
    fetchDepartmentAll();
    // fetchParticipants();
  }, []);
  useEffect(() => {
    addSerialNumber();
  }, [meetingArray]);

  useEffect(() => {
    fetchMeeting();
    fetchMeetingAll();
  }, [isEditOpen, meetingEdit.branch]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [noticePeriodUpdatedBy, setNoticePeriodUpdatedBy] = useState([]);
  //get single row to edit....
  const fetchSingleNoticePeriod = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setNoticePeriodUpdatedBy(res?.data?.snoticeperiodapply?.updatedby);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //reminder options
  const reminderOption = [
    { value: "5 minutes before", label: "5 minutes before" },
    { value: "10 minutes before", label: "10 minutes before" },
    { value: "15 minutes before", label: "15 minutes before" },
    { value: "30 minutes before", label: "30 minutes before" },
    { value: "1 hour before", label: "1 hour before" },
    { value: "2 hours before", label: "2 hours before" },
    { value: "1 day before", label: "1 day before" },
    { value: "2 days before", label: "2 days before" },
  ];
  const meetingModeOption = [
    { value: "Zoom", label: "Zoom" },
    { value: "Microsoft Teams", label: "Microsoft Teams" },
    { value: "Google Meet", label: "Google Meet" },
    { value: "Jio Meet", label: "Jio Meet" },
    { value: "Slack", label: "Slack" },
    { value: "Skype", label: "Skype" },
    { value: "In Person", label: "In Person" },
  ];
  //meeting type options
  const meetingTypeOption = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];
  //meeting type options
  const repeatTypeOption = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
  ];
  const timeZoneOptions = [
    {
      value: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi",
      label: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi",
    },
    {
      value: "(GMT -12:00) Eniwetok, Kwajalein",
      label: "(GMT -12:00) Eniwetok, Kwajalein",
    },
    {
      value: "(GMT -11:00) Midway Island, Samoa",
      label: "(GMT -11:00) Midway Island, Samoa",
    },
    { value: "(GMT -10:00) Hawaii", label: "(GMT -10:00) Hawaii" },
    { value: "(GMT -9:30) Taiohae", label: "(GMT -9:30) Taiohae" },
    { value: "(GMT -9:00) Alaska", label: "(GMT -9:00) Alaska" },
    {
      value: "(GMT -8:00) Pacific Time (US & Canada)",
      label: "(GMT -8:00) Pacific Time (US & Canada)",
    },
    {
      value: "(GMT -7:00) Mountain Time (US & Canada)",
      label: "(GMT -7:00) Mountain Time (US & Canada)",
    },
    {
      value: "(GMT -6:00) Central Time (US & Canada), Mexico City",
      label: "(GMT -6:00) Central Time (US & Canada), Mexico City",
    },
    {
      value: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima",
      label: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima",
    },
    { value: "(GMT -4:30) Caracas", label: "(GMT -4:30) Caracas" },
    {
      value: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz",
      label: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz",
    },
    { value: "(GMT -3:30) Newfoundland", label: "(GMT -3:30) Newfoundland" },
    {
      value: "(GMT -3:00) Brazil, Buenos Aires, Georgetown",
      label: "(GMT -3:00) Brazil, Buenos Aires, Georgetown",
    },
    { value: "(GMT -2:00) Mid-Atlantic", label: "(GMT -2:00) Mid-Atlantic" },
    {
      value: "(GMT -1:00) Azores, Cape Verde Islands",
      label: "(GMT -1:00) Azores, Cape Verde Islands",
    },
    {
      value: "(GMT) Western Europe Time, London, Lisbon, Casablanca",
      label: "(GMT) Western Europe Time, London, Lisbon, Casablanca",
    },
    {
      value: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris",
      label: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris",
    },
    {
      value: "(GMT +2:00) Kaliningrad, South Africa",
      label: "(GMT +2:00) Kaliningrad, South Africa",
    },
    {
      value: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg",
      label: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg",
    },
    { value: "(GMT +3:30) Tehran", label: "(GMT +3:30) Tehran" },
    {
      value: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi",
      label: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi",
    },
    { value: "(GMT +4:30) Kabul", label: "(GMT +4:30) Kabul" },
    {
      value: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent",
      label: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent",
    },
    {
      value: "(GMT +5:45) Kathmandu, Pokhara",
      label: "(GMT +5:45) Kathmandu, Pokhara",
    },
    {
      value: "(GMT +6:00) Almaty, Dhaka, Colombo",
      label: "(GMT +6:00) Almaty, Dhaka, Colombo",
    },
    {
      value: "(GMT +6:30) Yangon, Mandalay",
      label: "(GMT +6:30) Yangon, Mandalay",
    },
    {
      value: "(GMT +7:00) Bangkok, Hanoi, Jakarta",
      label: "(GMT +7:00) Bangkok, Hanoi, Jakarta",
    },
    {
      value: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong",
      label: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong",
    },
    { value: "(GMT +8:45) Eucla", label: "(GMT +8:45) Eucla" },
    {
      value: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk",
      label: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk",
    },
    {
      value: "(GMT +9:30) Adelaide, Darwin",
      label: "(GMT +9:30) Adelaide, Darwin",
    },
    {
      value: "(GMT +10:00) Eastern Australia, Guam, Vladivostok",
      label: "(GMT +10:00) Eastern Australia, Guam, Vladivostok",
    },
    {
      value: "(GMT +10:30) Lord Howe Island",
      label: "(GMT +10:30) Lord Howe Island",
    },
    {
      value: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia",
      label: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia",
    },
    {
      value: "(GMT +11:30) Norfolk Island",
      label: "(GMT +11:30) Norfolk Island",
    },
    {
      value: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka",
      label: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka",
    },
    {
      value: "(GMT +12:45) Chatham Islands",
      label: "(GMT +12:45) Chatham Islands",
    },
    {
      value: "(GMT +13:00) Apia, Nukualofa",
      label: "(GMT +13:00) Apia, Nukualofa",
    },
    {
      value: "(GMT +14:00) Line Islands, Tokelau",
      label: "(GMT +14:00) Line Islands, Tokelau",
    },
  ];
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
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
    }
  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] =
    useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState("");

  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueCate([]);
    setSelectedOptionsCate([]);
    setMeetingState({ ...meetingState, venue: "Please Select Area" });
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

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
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] =
    useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState("");

  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueCate([]);
    setSelectedOptionsCate([]);
    setMeetingState({ ...meetingState, venue: "Please Select Area" });
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

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
  const customValueRendererBranchEdit = (
    branchValueCateEdit,
    _employeename
  ) => {
    return branchValueCateEdit?.length
      ? branchValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] =
    useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState("");

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueCate([]);
    setSelectedOptionsCate([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

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
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);
  const [
    selectedDepartmentOptionsCateEdit,
    setSelectedDepartmentOptionsCateEdit,
  ] = useState([]);
  const [departmentValueCateEdit, setDepartmentValueCateEdit] = useState("");

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueCate([]);
    setSelectedOptionsCate([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };

  const handleDepartmentChangeEdit = (options) => {
    setDepartmentValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedDepartmentOptionsCateEdit(options);
    setValueCateEdit([]);
    setSelectedOptionsCateEdit([]);
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
  const [selectedOptionsBranchVenue, setSelectedOptionsBranchVenue] = useState(
    []
  );
  let [valueBranchVenueCat, setValueBranchVenueCat] = useState([]);
  const [
    selectedBranchVenueOptionsCateEdit,
    setSelectedBranchVenueOptionsCateEdit,
  ] = useState([]);
  const [branchVenueValueCateEdit, setBranchVenueValueCateEdit] = useState("");

  const handleBranchVenueChange = (options) => {
    setValueBranchVenueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchVenue(options);
    setValueFloorVenueCat([]);
    setSelectedOptionsFloorVenue([]);
    setMeetingState({ ...meetingState, venue: "Please Select Area" });
  };

  const customValueRendererBranchVenue = (
    valueBranchVenueCat,
    _categoryname
  ) => {
    return valueBranchVenueCat?.length
      ? valueBranchVenueCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

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
  const [selectedOptionsFloorVenue, setSelectedOptionsFloorVenue] = useState(
    []
  );
  let [valueFloorVenueCat, setValueFloorVenueCat] = useState([]);
  const [
    selectedFloorVenueOptionsCateEdit,
    setSelectedFloorVenueOptionsCateEdit,
  ] = useState([]);
  const [floorVenueValueCateEdit, setFloorVenueValueCateEdit] = useState("");

  const handleFloorVenueChange = (options) => {
    setValueFloorVenueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsFloorVenue(options);
    setMeetingState({ ...meetingState, venue: "Please Select Area" });
  };

  const customValueRendererFloorVenue = (valueFloorVenueCat, _categoryname) => {
    return valueFloorVenueCat?.length
      ? valueFloorVenueCat.map(({ label }) => label)?.join(", ")
      : "Please Select Floor";
  };

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

  //get all comnpany.
  const fetchCompanyAll = async () => {
    try {
      setCompanyOption(
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

  //function to fetch  team
  const fetchTeamAll = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all branches.
  const fetchMeetingCategoryAll = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all floor.
  const fetchFloorAll = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get locations
  const fetchAllLocation = async () => {
    try {
      let res_location = await axios.get(SERVICE.AREAGROUPING, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      let result = res_location?.data?.areagroupings.filter((data, index) => {
        return data.locationareastatus == true;
      });
      setLocationOption(result);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //function to fetch department based on branch and team
  const fetchDepartmentAll = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [hrManName, setHrManName] = useState([]);

  const fetchAssignInterviewr = async (company, branch, team) => {
    try {
      let res = await await axios.post(
        SERVICE.ASSIGNINTERVIEWERS,
        {
          assignbranch: accessbranch,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      let ans = res?.data?.assigninterview.filter(
        (data) =>
          data?.fromcompany?.includes(company) &&
          data?.frombranch?.includes(branch) &&
          data.type === "Interviewer"
      );
      let he = ans.flatMap((d) => d.employee);

      setHrManName(
        he.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MEETING}/${id}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      setDeleteMeeting(res?.data?.sschedulemeeting);
      handleClickOpen();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // Alert delete popup
  let meetingid = deleteMeeting._id;
  const delMeeting = async () => {
    try {
      await axios.delete(`${SERVICE.SINGLE_MEETING}/${meetingid}`, {
        headers: { Authorization: `Bearer ${auth.APIToken}` },
      });
      await fetchMeeting();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Deleted Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const bulkdeletefunction = async () => {
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
      setMeetingCheck(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchMeeting();
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Deleted Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    // let compopt = selectedOptionsCompany.map((item) => item.value);
    // let branchopt = selectedOptionsBranch.map((item) => item.value);
    // let deptopt = selectedOptionsDepartment.map((item) => item.value);
    // let teamopt = selectedOptionsTeam.map((item) => item.value);
    // let empopt = selectedOptionsCate.map((item) => item.value);
    // const isNameMatch = meetingArray.some(
    //   (item) =>
    //     item.company.some((data) => compopt.includes(data)) &&
    //     item.branch.some((data) => branchopt.includes(data)) &&
    //     item.department.some((data) => deptopt.includes(data)) &&
    //     item.team.some((data) => teamopt.includes(data)) &&
    //     item.participants.some((data) => empopt.includes(data)) &&
    //     item.meetingcategory?.toLowerCase() ===
    //       meetingState.meetingcategory?.toLowerCase() &&
    //     item.meetingtype?.toLowerCase() ===
    //       meetingState.meetingtype?.toLowerCase() &&
    //     item.title?.toLowerCase() === meetingState.title?.toLowerCase() &&
    //     item.date === meetingState.date &&
    //     item.time === meetingState.time
    // );
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
    } else if (valueBranchCat?.length == 0) {
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
    } else if (valueTeamCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueDepartmentCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Department"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingcategory === "Please Select Meeting Category"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Category"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (valueCate.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Interviewer"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.meetingtype === "Please Select Meeting Type") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Type"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Online" &&
      meetingState.meetingmode === "Please Select Meeting Mode"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Mode"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Offline" &&
      valueBranchVenueCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Location-Branch"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Offline" &&
      valueFloorVenueCat?.length == 0
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Location-Floor"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Online" &&
      meetingState.link === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Enter Meeting Link"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.meetingtype === "Offline" &&
      meetingState.venue === "Please Select Area"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Location-Area"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.title === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Title"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.date === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Date"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.time === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Time"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.duration === "00:00" ||
      meetingState.duration.includes("Mins")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Duration"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.timezone === "Please Select Time Zone") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Time Zone"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingState.reminder === "Please Select Reminder") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Reminder"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingState.recuringmeeting &&
      (meetingState.repeattype === "Repeat Type" ||
        meetingState.repeattype === "")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Repeat Type"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    // else if (new Date(`${meetingState.date}:${meetingState.time}`) < currDate) {
    //     setShowAlert(<>  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select a Future Date"}  </p>  </>);
    //     handleClickOpenerr();
    // }
    // else if (isNameMatch) {
    //   setShowAlert(
    //     <>
    //       {" "}
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />{" "}
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {" "}
    //         {"Meeting Already Exists"}{" "}
    //       </p>{" "}
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else {
      sendRequest();
    }
  };

  //add function
  const sendRequest = async () => {
    try {
      // Generate a unique ID using uuid
      const uniqueId = uuidv4();

      let statusCreate = await axios.post(SERVICE.CREATE_MEETING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: valueCompanyCat,
        branch: valueBranchCat,
        team: valueTeamCat,
        department: valueDepartmentCat,
        meetingcategory: String(meetingState.meetingcategory),
        meetingtype: String(meetingState.meetingtype),
        venue: String(
          meetingState.meetingtype === "Offline" ? meetingState.venue : ""
        ),
        meetingmode: String(
          meetingState.meetingtype === "Online" ? meetingState.meetingmode : ""
        ),
        branchvenue:
          meetingState.meetingtype === "Offline"
            ? [...valueBranchVenueCat]
            : [],
        floorvenue:
          meetingState.meetingtype === "Offline" ? [...valueFloorVenueCat] : [],
        link: String(
          meetingState.meetingtype === "Online" ? meetingState.link : ""
        ),
        title: String(meetingState.title),
        date: String(meetingState.date),
        time: String(meetingState.time),
        duration: String(meetingState.duration),
        timezone: String(meetingState.timezone),

        interviewer: [...valueCate],
        participants: [meetingValues[4]],
        noticeperiodid: String(meetingValues[5]),
        meetingassignedthrough: "Notice Period",

        reminder: String(meetingState.reminder),
        agenda: String(agenda),
        recuringmeeting: Boolean(meetingState.recuringmeeting),
        repeattype: "Once",
        uniqueid: String(uniqueId),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      //updateing noticeperiod meetingf status
      let res = await axios.put(
        `${SERVICE.NOTICEPERIODAPPLY_SINGLE}/${meetingValues[5]}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          meetingscheduled: true,
          updatedby: [
            ...noticePeriodUpdatedBy,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      setVendorAuto("none");
      await fetchMeeting();
      setMeetingState({
        ...meetingState,
        title: "",
        date: "",
        link: "",
        time: "",
      });
      setAgenda("");
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Added Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      handleClickCloseMeetingPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Interviewer";
  };
  //multiselect edit
  const handleCategoryChangeEdit = (options) => {
    setValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCateEdit(options);
  };
  const customValueRendererCateEdit = (valueCateEdit, _employeename) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Participants";
  };
  const handleclear = (e) => {
    e.preventDefault();
    setMeetingState({
      branch: "Please Select Branch",
      department: "Please Select Department",
      team: "Please Select Team",
      meetingcategory: "Please Select Meeting Category",
      meetingtype: "Please Select Meeting Type",
      meetingmode: "Please Select Meeting Mode",
      venue: "Please Select Area",
      link: "",
      title: "",
      date: "",
      time: "",
      duration: "00:00",
      timezone: "Please Select Time Zone",
      reminder: "Please Select Reminder",
      recuringmeeting: false,
      repeattype: "Repeat Type",
      repeatevery: "00 days",
    });
    setHours("Hrs");
    setMinutes("Mins");
    setAgenda("");
    setSelectedOptionsCate([]);
    setValueCate([]);

    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
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
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MEETING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMeetingEdit(res?.data?.sschedulemeeting);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_MEETING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMeetingEdit(res?.data?.sschedulemeeting);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // updateby edit page...
  let updateby = meetingEdit.updatedby;
  let addedby = meetingEdit.addedby;
  let meetingId = meetingEdit._id;
  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.SINGLE_MEETING}/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: [...companyValueCateEdit],
        branch: [...branchValueCateEdit],
        branchvenue:
          meetingEdit.meetingtype === "Offline"
            ? [...branchVenueValueCateEdit]
            : [],
        floorvenue:
          meetingEdit.meetingtype === "Offline"
            ? [...floorVenueValueCateEdit]
            : [],
        team: [...teamValueCateEdit],
        department: [...departmentValueCateEdit],
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
        reminder: String(meetingEdit.reminder),
        agenda: String(agenda),
        recuringmeeting: Boolean(meetingEdit.recuringmeeting),
        repeattype: String(
          meetingEdit.recuringmeeting ? meetingEdit.repeattype : "Once"
        ),
        // repeatevery: String(meetingEdit.recuringmeeting ? meetingEdit.repeatevery : "00 days"),
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
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //editing the single data...
  const sendMultipleEditRequest = async () => {
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
          branchvenue:
            meetingEdit.meetingtype === "Offline"
              ? [...branchVenueValueCateEdit]
              : [],
          floorvenue:
            meetingEdit.meetingtype === "Offline"
              ? [...floorVenueValueCateEdit]
              : [],
          department: [...departmentValueCateEdit],
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
          reminder: String(meetingEdit.reminder),
          agenda: String(agenda),
          recuringmeeting: Boolean(meetingEdit.recuringmeeting),
          repeattype: String(
            meetingEdit.recuringmeeting ? meetingEdit.repeattype : "Once"
          ),
          // repeatevery: String(meetingEdit.recuringmeeting ? meetingEdit.repeatevery : "00 days"),
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
      setShowAlert(
        <>
          {" "}
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Updated Successfully👍"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    } else if (branchValueCateEdit?.length == 0) {
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
    } else if (teamValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (departmentValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Department"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingEdit.meetingcategory === "Please Select Meeting Category"
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Category"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingEdit.meetingtype === "Please Select Meeting Type") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Type"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingEdit.meetingtype === "Offline" &&
      branchVenueValueCateEdit?.length == 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Location-Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingEdit.meetingtype === "Offline" &&
      floorVenueValueCateEdit?.length == 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Location-Floor"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingEdit.meetingtype === "Online" &&
      (meetingEdit.meetingmode === "Please Select Meeting Mode" ||
        meetingEdit.meetingmode === "")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Mode"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingEdit.meetingtype === "Online" &&
      meetingEdit.link === ""
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Enter Meeting Link"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingEdit.meetingtype === "Offline" &&
      (meetingEdit.venue === "Please Select Area" || meetingEdit.venue === "")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Location-Area"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingEdit.title === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Enter Title"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingEdit.date === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Date"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingEdit.time === "") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Time"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingEdit.duration === "00:00" ||
      meetingEdit.duration.includes("Mins")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Duration"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingEdit.timezone === "Please Select Time Zone") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Time Zone"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (valueCateEdit.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Interviewer"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingEdit.reminder === "Please Select Reminder") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Reminder"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (
      meetingEdit.recuringmeeting &&
      (meetingEdit.repeattype === "Repeat Type" ||
        meetingEdit.repeattype === "Once")
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Repeat Type"}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    }
    //  else if (new Date(`${meetingEdit.date}:${meetingEdit.time}`) < currDate) {
    //     setShowAlert(<>  <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select a Future Date"}  </p>  </>);
    //     handleClickOpenerr();
    // }
    //   else if (isNameMatch) {
    //     setShowAlert(
    //       <>
    //         {" "}
    //         <ErrorOutlineOutlinedIcon
    //           sx={{ fontSize: "100px", color: "orange" }}
    //         />{" "}
    //         <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //           {" "}
    //           {"Meeting Already Exists"}{" "}
    //         </p>{" "}
    //       </>
    //     );
    //     handleClickOpenerr();
    // }
    else if (meetingEdit.recuringmeeting && oldDate === newDate) {
      handleClickOpenMultiple();
    } else {
      sendEditRequest();
    }
  };
  //get all data.
  const fetchMeeting = async () => {
    try {
      let res_status = await axios.post(SERVICE.ALL_MEETING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setMeetingCheck(true);
      setMeetingArray(res_status?.data?.schedulemeeting);
    } catch (err) {
      setMeetingCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all data.
  const fetchMeetingAll = async () => {
    try {
      let res_status = await axios.post(SERVICE.ALL_MEETING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });
      setMeetingArray(res_status?.data?.schedulemeeting);
      setAllStatusEdit(
        res_status?.data?.schedulemeeting.filter(
          (item) => item._id !== meetingEdit._id
        )
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ScheduleMeetingNoticePeriod.png");
        });
      });
    }
  };
  // pdf.....
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Company ", field: "company" },
    { title: "Branch ", field: "branch" },
    { title: "Team ", field: "team" },
    { title: "Department ", field: "department" },
    { title: "Title ", field: "title" },
    { title: "Meeting Type ", field: "meetingtype" },
    { title: "Meeting Category ", field: "meetingcategory" },
    { title: "Date ", field: "date" },
    { title: "Time ", field: "time" },
    { title: "Duration ", field: "duration" },
    { title: "Time Zone", field: "timezone" },
    { title: "Participants", field: "participants" },
    { title: "Reminder", field: "reminder" },
  ];
  //  pdf download functionality
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: rowDataTable,
      styles: { fontSize: 5 },
    });
    doc.save("ScheduleMeetingNoticePeriod.pdf");
  };
  // Excel
  const fileName = "ScheduleMeetingNoticePeriod";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Schedule Interview List",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = meetingArray?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
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
  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      headerStyle: { fontWeight: "bold" },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
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
      width: 80,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
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
      width: 100,
      hide: !columnVisibility.participants,
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
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eschedulemeeting") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditOutlinedIcon style={{ fontsize: "large" }} />{" "}
            </Button>
          )}
          {isUserRoleCompare?.includes("dschedulemeeting") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id);
              }}
            >
              {" "}
              <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />{" "}
            </Button>
          )}
          {/* {isUserRoleCompare?.includes("vschedulemeeting") && ( */}
          <Button
            sx={userStyle.buttonedit}
            onClick={() => {
              getviewCode(params.row.id);
            }}
          >
            <VisibilityOutlinedIcon style={{ fontsize: "large" }} />{" "}
          </Button>
          {/* )} */}
          {isUserRoleCompare?.includes("ischedulemeeting") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />{" "}
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
      title: item.title,
      meetingtype: item.meetingtype,
      meetingcategory: item.meetingcategory,
      date: moment(item.date).format("DD-MM-YYYY"),
      time: item.time,
      duration: item.duration,
      timezone: item.timezone,
      participants: item.participants
        ?.map((t, i) => `${i + 1 + ". "}` + t)
        .toString(),
      reminder: item.reminder,
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
      <Headtitle title={"SCHEDULE INTERVIEW"} />
      {/* {isUserRoleCompare?.includes("aschedulemeeting") && ( */}
      <Box sx={userStyle.selectcontainer}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {" "}
              <Typography sx={userStyle.importheadtext}>
                {" "}
                Schedule Notice Period Interview
              </Typography>{" "}
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Company <b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={meetingValues[0]}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Branch<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={meetingValues[1]}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Team<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={meetingValues[2]}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Department<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={meetingValues[3]}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Meeting Category<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={meetingCatOption}
                  placeholder="Please Select Meeting Category"
                  value={{
                    label: meetingState.meetingcategory,
                    value: meetingState.meetingcategory,
                  }}
                  onChange={(e) => {
                    setMeetingState({
                      ...meetingState,
                      meetingcategory: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Interviewer<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={hrManName}
                  value={selectedOptionsCate}
                  onChange={handleCategoryChange}
                  valueRenderer={customValueRendererCate}
                  labelledBy="Please Select Interviewer"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Meeting Type<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={meetingTypeOption}
                  placeholder="Please Select Meeting Type"
                  value={{
                    label: meetingState.meetingtype,
                    value: meetingState.meetingtype,
                  }}
                  onChange={(e) => {
                    setMeetingState({ ...meetingState, meetingtype: e.value });
                  }}
                />
              </FormControl>
            </Grid>
            {meetingState.meetingtype === "Offline" && (
              <>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location-Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                      value={selectedOptionsBranchVenue}
                      onChange={(e) => {
                        handleBranchVenueChange(e);
                      }}
                      valueRenderer={customValueRendererBranchVenue}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Location-Floor<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={floorOption
                        ?.filter((u) => valueBranchVenueCat?.includes(u.branch))
                        .map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      value={selectedOptionsFloorVenue}
                      onChange={(e) => {
                        handleFloorVenueChange(e);
                      }}
                      valueRenderer={customValueRendererFloorVenue}
                      labelledBy="Please Select Floor"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
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
                                valueFloorVenueCat?.includes(item.floor) &&
                                valueBranchVenueCat?.includes(item.branch)
                            )
                            .flatMap((item) => item.area)
                        ),
                      ].map((location) => ({
                        label: location,
                        value: location,
                      }))}
                      placeholder="Please Select Area"
                      value={{
                        label: meetingState.venue,
                        value: meetingState.venue,
                      }}
                      onChange={(e) => {
                        setMeetingState({ ...meetingState, venue: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
            {meetingState.meetingtype === "Online" && (
              <>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Meeting Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={meetingModeOption}
                      placeholder="Please Select Meeting Mode"
                      value={{
                        label: meetingState.meetingmode,
                        value: meetingState.meetingmode,
                      }}
                      onChange={(e) => {
                        setMeetingState({
                          ...meetingState,
                          meetingmode: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Link<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Link"
                      value={meetingState.link}
                      onChange={(e) => {
                        setMeetingState({
                          ...meetingState,
                          link: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Title<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Title"
                  value={meetingState.title}
                  onChange={(e) => {
                    setMeetingState({ ...meetingState, title: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Date<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={meetingState.date}
                  onChange={(e) => {
                    setMeetingState({ ...meetingState, date: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Time<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="time"
                  placeholder="HH:MM:AM/PM"
                  value={meetingState.time}
                  onChange={(e) => {
                    setMeetingState({ ...meetingState, time: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <Typography>
                Duration<b style={{ color: "red" }}>*</b>
              </Typography>
              <Grid container spacing={1}>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={300}
                      options={hrsOption}
                      placeholder="Hrs"
                      value={{ label: hours, value: hours }}
                      onChange={(e) => {
                        setHours(e.value);
                        setMeetingState({
                          ...meetingState,
                          duration: `${e.value}:${minutes}`,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Selects
                      maxMenuHeight={300}
                      options={minsOption}
                      placeholder="Mins"
                      value={{ label: minutes, value: minutes }}
                      onChange={(e) => {
                        setMinutes(e.value);
                        setMeetingState({
                          ...meetingState,
                          duration: `${hours}:${e.value}`,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Time Zone<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={timeZoneOptions}
                  placeholder="Please Select Time Zone"
                  value={{
                    label: meetingState.timezone,
                    value: meetingState.timezone,
                  }}
                  onChange={(e) => {
                    setMeetingState({ ...meetingState, timezone: e.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Reminder<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  maxMenuHeight={300}
                  options={reminderOption}
                  placeholder="Please Select Reminder"
                  value={{
                    label: meetingState.reminder,
                    value: meetingState.reminder,
                  }}
                  onChange={(e) => {
                    setMeetingState({ ...meetingState, reminder: e.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Meeting Participant</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={meetingValues[4]}
                  readOnly
                />
              </FormControl>
            </Grid>
            {/* <Grid item md={4} xs={12} sm={6}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={meetingState.recuringmeeting} />}
                  onChange={(e) =>
                    setMeetingState({
                      ...meetingState,
                      recuringmeeting: !meetingState.recuringmeeting,
                    })
                  }
                  label="Recuring Meeting"
                />
              </FormGroup>
              {meetingState.recuringmeeting && (
                <Grid container spacing={1}>
                  <Grid item md={6} xs={12} sm={12}>
                    <Typography>
                      Repeat Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Selects
                        maxMenuHeight={300}
                        options={repeatTypeOption}
                        placeholder="Repeat Type"
                        value={{
                          label: meetingState.repeattype,
                          value: meetingState.repeattype,
                        }}
                        onChange={(e) => {
                          setMeetingState({
                            ...meetingState,
                            repeattype: e.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <br />
                </Grid>
              )}
            </Grid> */}
            <Grid item md={12} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Description</Typography>
                <ReactQuill
                  style={{ maxHeight: "200px", height: "200px" }}
                  value={agenda}
                  onChange={setAgenda}
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
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
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Grid container>
            <Grid item md={3} xs={12} sm={6}>
              {/* {isUserRoleCompare?.includes("sschedulemeeting") && ( */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {" "}
                Submit{" "}
              </Button>
              {/* )} */}
            </Grid>
            {/* <Grid item md={3} xs={12} sm={6}>
              <Button sx={userStyle.btncancel} onClick={handleclear}>
                {" "}
                Clear{" "}
              </Button>
            </Grid> */}
            <Grid item md={3} xs={12} sm={6}>
              <Button
                sx={userStyle.btncancel}
                onClick={handleClickCloseMeetingPopup}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </>
      </Box>
      {/* )} */}

      {/*DELETE ALERT DIALOG */}
      <Dialog
        open={isDeleteOpen}
        onClose={handleCloseMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "80px", color: "orange" }}
          />
          <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
            {" "}
            Are you sure?{" "}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMod}
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
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => delMeeting(meetingid)}
          >
            {" "}
            OK
          </Button>
        </DialogActions>
      </Dialog>
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
      {/* this is info view details */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Schedule Interview Info
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">addedby</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {addedby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Updated by</Typography>
                  <br />
                  <Table>
                    <TableHead>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {"SNO"}.
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"UserName"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                        {" "}
                        {"Date"}
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {updateby?.map((item, i) => (
                        <StyledTableRow>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {i + 1}.
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {item.name}
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{ padding: "5px 10px !important" }}
                          >
                            {" "}
                            {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br />
            <br />
            <Grid container spacing={2}>
              <Button variant="contained" onClick={handleCloseinfo}>
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          id="usertable"
          ref={componentRef}
        >
          <TableHead>
            <TableRow>
              <TableCell> SI.No</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Meeting Type</TableCell>
              <TableCell>Meeting Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Time Zone</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Reminder</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="left">
            {rowDataTable &&
              rowDataTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.branch}</TableCell>
                  <TableCell>{row.team}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.meetingtype}</TableCell>
                  <TableCell>{row.meetingcategory}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.timezone}</TableCell>
                  <TableCell>{row.participants}</TableCell>
                  <TableCell>{row.reminder}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <Box sx={{ padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Schedule Interview
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
                  <Typography variant="h6"> Meeting Type</Typography>
                  <Typography>{meetingEdit.meetingtype}</Typography>
                </FormControl>
              </Grid>
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
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                color="primary"
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
          fullWidth={true}
        >
          <Box sx={{ padding: "20px 50px" }}>
            <>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>
                  {" "}
                  Edit Schedule Interview{" "}
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
                      options={companyOption}
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
                      options={isAssignBranch
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
                      options={teamOption
                        ?.filter((u) => branchValueCateEdit?.includes(u.branch))
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
                          options={isAssignBranch
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
                      options={participantsOption
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
                        }))}
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
                      // onChange={(e) =>
                      //   setMeetingEdit({
                      //     ...meetingEdit,
                      //     recuringmeeting: !meetingEdit.recuringmeeting,
                      //   })
                      // }
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
                          {/* <Selects
                            maxMenuHeight={300}
                            options={repeatTypeOption}
                            placeholder="Repeat Type"
                            value={{
                              label:
                                meetingEdit.repeattype === "Once"
                                  ? "Repeat Type"
                                  : meetingEdit.repeattype,
                              value:
                                meetingEdit.repeattype === "Once"
                                  ? "Repeat Type"
                                  : meetingEdit.repeattype,
                            }}
                            onChange={(e) => {
                              setMeetingEdit({
                                ...meetingEdit,
                                repeattype: e.value,
                              });
                            }}
                          /> */}
                          <OutlinedInput
                            value={meetingEdit.repeattype}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      {/* <Grid item md={6} xs={12} sm={12}>
                                            <Typography>Repeat Every</Typography>
                                            <FormControl fullWidth size="small" >
                                                <Selects maxMenuHeight={300} options={repeatEveryOption} placeholder="Repeat Every" repeatevery }} onChange={(e) => {setMeetingEdit({ ...meetingEdit, repeatevery: e.value });}} />
                                            </FormControl>
                                        </Grid> */}
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
                </Grid>
              </Grid>
              <br /> <br />
              <br />
              <br />
              <br />
              <br />
              <Grid container spacing={2}></Grid>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={editSubmit}
                  sx={userStyle.buttonadd}
                >
                  {" "}
                  Update
                </Button>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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

      {/* Bulk delete ALERT DIALOG */}
      <Dialog
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
        >
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "70px", color: "orange" }}
          />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            Please Select any Row
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={handleCloseModalert}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "80px", color: "orange" }}
            />
            <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
              Are you sure?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={(e) => bulkdeletefunction(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
export default ScheduleMeetingNoticePeriod;