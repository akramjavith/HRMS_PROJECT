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
  Tooltip,
  DialogTitle,
  TextareaAutosize,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { GridActionsCellItem, useGridApiRef } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  repeatTypeOption,
  reminderOption,
  meetingModeOption,
  meetingTypeOption,
  timeZoneOptions,
} from "../../../components/Componentkeyword";
import StyledDataGrid from "../../../components/TableStyle";
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
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Update";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import PageHeading from "../../../components/PageHeading";

function ScheduleMeeting() {
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
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Team: t.team,
          Department: t.department,
          Title: t.title,
          "Meeting Type": t.meetingtype,
          "Meeting Category": t.meetingcategory,
          Date: t.date,
          Time: t.time,
          Duration: t.duration,
          "Time Zone": t.timezone,
          Participants: t.participants,
          "Meeting Host": t.interviewer,
          Reminder: t.reminder,
          MeetingStatus: t.meetingstatus || "No Status",
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        items?.map((t, index) => ({
          Sno: index + 1,
          Company: t.company,
          Branch: t.branch,
          Team: t.team,
          Department: t.department,
          Title: t.title,
          "Meeting Type": t.meetingtype,
          "Meeting Category": t.meetingcategory,
          Date: t.date,
          Time: t.time,
          Duration: t.duration,
          "Time Zone": t.timezone,
          Participants: t.participants,
          "Meeting Host": t.interviewer,
          Reminder: t.reminder,
          MeetingStatus: t.meetingstatus || "No Status",
        })),
        fileName
      );
    }
    setIsFilterOpen(false);
  };

  // pdf.....
  const columns = [
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
    { title: "Meeting Host", field: "interviewer" },
    { title: "Reminder", field: "reminder" },
    { title: "Meeting Status", field: "meetingstatus" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" }, // Serial number column
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            team: t.team,
            department: t.department,
            title: t.title,
            meetingtype: t.meetingtype,
            meetingcategory: t.meetingcategory,
            date: t.date,
            time: t.time,
            duration: t.duration,
            timezone: t.timezone,
            participants: t.participants,
            interviewer: t.interviewer,
            reminder: t.reminder,
            meetingstatus: t.meetingstatus || "No Status",
          }))
        : items?.map((t, index) => ({
            serialNumber: index + 1,
            company: t.company,
            branch: t.branch,
            team: t.team,
            department: t.department,
            title: t.title,
            meetingtype: t.meetingtype,
            meetingcategory: t.meetingcategory,
            date: t.date,
            time: t.time,
            duration: t.duration,
            timezone: t.timezone,
            participants: t.participants,
            interviewer: t.interviewer,
            reminder: t.reminder,
            meetingstatus: t.meetingstatus || "No Status",
          }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: "5" },
    });

    doc.save("ScheduleMeeting.pdf");
  };

  const backpage = useNavigate();
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
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    isAssignBranch,
    allUsersData,
    allTeam,
    allfloor,
    allareagrouping,
    alldepartment,
    pageName,
    setPageName,
  } = useContext(UserRoleAccessContext);
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
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const accessbranch = isAssignBranch?.map((data) => ({
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
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [hrsOption, setHrsOption] = useState([]);
  const [minsOption, setMinsOption] = useState([]);
  const [locationOption, setLocationOption] = useState([]);
  const [departmentOption, setDepartmentOption] = useState([]);
  const [meetingCatOption, setMeetingCatOption] = useState([]);
  const [hours, setHours] = useState("Hrs");
  const [minutes, setMinutes] = useState("Mins");
  const [oldDate, setOldDate] = useState();
  const [newDate, setNewDate] = useState();
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  const [valueCate, setValueCate] = useState("");
  const [participantID, setParticipantID] = useState([]);
  const [participantIDEdit, setParticipantIDEdit] = useState([]);
  const [meetingHostID, setMeetingHostID] = useState([]);
  const [meetingHostIDEdit, setMeetingHostIDEdit] = useState([]);
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);
  const [valueCateEdit, setValueCateEdit] = useState("");

  useEffect(() => {
    fetchMeetingCategoryAll();
    generateHrsOptions();
    generateMinsOptions();
    generateRepeatEveryOptions();
    fetchFloorAll();
    fetchAllLocation();
    fetchDepartmentAll();
  }, []);
  useEffect(() => {
    addSerialNumber();
  }, [meetingArray]);

  useEffect(() => {
    fetchMeeting();
  }, [isEditOpen, meetingEdit.branch]);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

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
  const [employeeLength, setEmployeeLength] = useState([]);

  const handleDepartmentChange = (options) => {
    let department = options.map((a, index) => {
      return a.value;
    });

    setValueDepartmentCat(department);
    setSelectedOptionsDepartment(options);
    setValueCate([]);
    setSelectedOptionsCate([]);

    let emplength = [
      ...allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            department?.includes(u.department) &&
            valueTeamCat?.includes(u.team)
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        })),
    ];
    setEmployeeLength(emplength);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };

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

  //host company multiselect
  const [selectedOptionsCompanyHost, setSelectedOptionsCompanyHost] = useState(
    []
  );
  let [valueCompanyHostCat, setValueCompanyHostCat] = useState([]);
  const [
    selectedCompanyHostOptionsCateEdit,
    setSelectedCompanyHostOptionsCateEdit,
  ] = useState([]);
  const [companyHostValueCateEdit, setCompanyHostValueCateEdit] = useState("");

  const handleCompanyHostChange = (options) => {
    setValueCompanyHostCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompanyHost(options);
    setValueBranchHostCat([]);
    setSelectedOptionsBranchHost([]);
    setValueTeamHostCat([]);
    setSelectedOptionsTeamHost([]);
    setValueDepartmentHostCat([]);
    setSelectedOptionsDepartmentHost([]);
    setValueCateHost([]);
    setSelectedOptionsCateHost([]);
  };

  const customValueRendererCompanyHost = (
    valueCompanyHostCat,
    _categoryname
  ) => {
    return valueCompanyHostCat?.length
      ? valueCompanyHostCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

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
  const [selectedOptionsBranchHost, setSelectedOptionsBranchHost] = useState(
    []
  );
  let [valueBranchHostCat, setValueBranchHostCat] = useState([]);
  const [
    selectedBranchHostOptionsCateEdit,
    setSelectedBranchHostOptionsCateEdit,
  ] = useState([]);
  const [branchHostValueCateEdit, setBranchHostValueCateEdit] = useState("");

  const handleBranchHostChange = (options) => {
    setValueBranchHostCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranchHost(options);
    setValueTeamHostCat([]);
    setSelectedOptionsTeamHost([]);
    setValueDepartmentHostCat([]);
    setSelectedOptionsDepartmentHost([]);
    setValueCateHost([]);
    setSelectedOptionsCateHost([]);
  };

  const customValueRendererBranchHost = (valueBranchHostCat, _categoryname) => {
    return valueBranchHostCat?.length
      ? valueBranchHostCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

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
  const [selectedOptionsTeamHost, setSelectedOptionsTeamHost] = useState([]);
  let [valueTeamHostCat, setValueTeamHostCat] = useState([]);
  const [selectedTeamHostOptionsCateEdit, setSelectedTeamHostOptionsCateEdit] =
    useState([]);
  const [teamHostValueCateEdit, setTeamHostValueCateEdit] = useState("");

  const handleTeamHostChange = (options) => {
    setValueTeamHostCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeamHost(options);
    setValueDepartmentHostCat([]);
    setSelectedOptionsDepartmentHost([]);
    setValueCateHost([]);
    setSelectedOptionsCateHost([]);
  };

  const customValueRendererTeamHost = (valueTeamHostCat, _categoryname) => {
    return valueTeamHostCat?.length
      ? valueTeamHostCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

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
  const [selectedOptionsDepartmentHost, setSelectedOptionsDepartmentHost] =
    useState([]);
  let [valueDepartmentHostCat, setValueDepartmentHostCat] = useState([]);
  const [
    selectedDepartmentHostOptionsCateEdit,
    setSelectedDepartmentHostOptionsCateEdit,
  ] = useState([]);
  const [departmentHostValueCateEdit, setDepartmentHostValueCateEdit] =
    useState("");
  const [hostLength, setHostlength] = useState([]);
  const [hostLengthEdit, setHostlengthEdit] = useState([]);

  const handleDepartmentHostChange = (options) => {
    let dep = options.map((a, index) => {
      return a.value;
    });

    setValueDepartmentHostCat(dep);
    setSelectedOptionsDepartmentHost(options);
    setValueCateHost([]);
    setSelectedOptionsCateHost([]);

    let hostlen = [
      ...allUsersData
        ?.filter(
          (u) =>
            valueCompanyHostCat?.includes(u.company) &&
            valueBranchHostCat?.includes(u.branch) &&
            dep?.includes(u.department) &&
            valueTeamHostCat?.includes(u.team)
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        })),
    ];
    setHostlength(hostlen);
  };

  const customValueRendererDepartmentHost = (
    valueDepartmentHostCat,
    _categoryname
  ) => {
    return valueDepartmentHostCat?.length
      ? valueDepartmentHostCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };

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
  const [selectedOptionsCateHost, setSelectedOptionsCateHost] = useState([]);
  const [valueCateHost, setValueCateHost] = useState("");
  const [selectedOptionsCateHostEdit, setSelectedOptionsCateHostEdit] =
    useState([]);
  const [valueCateHostEdit, setValueCateHostEdit] = useState("");

  const handleCategoryChangeHost = (options) => {
    if (hostLength.length === options.length) {
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsCateHost(filteredOptions);
      setValueCateHost(filteredOptions.map((option) => option.value));
      setMeetingHostID(filteredOptions.map((option) => option._id));
    }
    // Check if "ALL" is selected
    else if (options.some((option) => option.value === "ALL")) {
      // Set "ALL" as the only selected option
      setSelectedOptionsCateHost([{ value: "ALL", label: "ALL" }]);
      setValueCateHost(["ALL"]);
      setMeetingHostID([]);
    } else {
      // Filter out "ALL" if any other option is selected
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsCateHost(filteredOptions);
      setValueCateHost(filteredOptions.map((option) => option.value));
      setMeetingHostID(filteredOptions.map((option) => option._id));
    }
  };

  const customValueRendererCateHost = (valueCateHost, _employeename) => {
    return valueCateHost.length
      ? valueCateHost.map(({ label }) => label).join(", ")
      : "Please Select Meeting Host";
  };

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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all floor.
  const fetchFloorAll = async () => {
    setPageName(!pageName);
    try {
      setFloorOption([
        ...allfloor?.map((t) => ({
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
    setPageName(!pageName);
    try {
      setLocationOption(allareagrouping);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //function to fetch department based on branch and team
  const fetchDepartmentAll = async () => {
    setPageName(!pageName);
    try {
      setDepartmentOption([
        ...alldepartment?.map((t) => ({
          ...t,
          label: t.deptname,
          value: t.deptname,
        })),
      ]);
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
    setPageName(!pageName);
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
  let meetingid = deleteMeeting.uniqueid;
  const delMeeting = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.MEETING_DELETE}/${meetingid}`, {
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
    setPageName(!pageName);
    try {
      setMeetingCheck(true);
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.MEETING_DELETE}/${item}`, {
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
    } else if (valueCate.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Participants"}{" "}
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
    } else if (valueCompanyHostCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting Host Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueBranchHostCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting Host Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueTeamHostCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting Host Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueDepartmentHostCat?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting Host Department"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueCateHost.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Host"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };

  const [isBtn, setIsBtn] = useState(false);

  //add function
  const sendRequest = async () => {
    setPageName(!pageName);
    try {
      setIsBtn(true);
      // Generate a unique ID using uuid
      const uniqueId = uuidv4();

      let statusCreate = await axios.post(SERVICE.CREATE_MEETING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: [...valueCompanyCat],
        branch: [...valueBranchCat],
        team: [...valueTeamCat],
        department: [...valueDepartmentCat],
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
        participants: [...valueCate],
        participantsid: participantID,
        meetinghostid: meetingHostID,
        reminder: String(meetingState.reminder),
        agenda: String(agenda),
        recuringmeeting: Boolean(meetingState.recuringmeeting),
        repeattype: String(
          meetingState.recuringmeeting ? meetingState.repeattype : "Once"
        ),
        uniqueid: String(uniqueId),
        hostcompany: [...valueCompanyHostCat],
        hostbranch: [...valueBranchHostCat],
        hostteam: [...valueTeamHostCat],
        hostdepartment: [...valueDepartmentHostCat],
        interviewer: [...valueCateHost],
        interviewscheduledby: String(isUserRoleAccess?._id),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
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
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleCategoryChange = (options) => {
    if (employeeLength.length === options.length) {
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsCate(filteredOptions);
      setValueCate(filteredOptions.map((option) => option.value));
      setParticipantID(filteredOptions.map((option) => option._id));
    }
    // Check if "ALL" is selected
    else if (options.some((option) => option.value === "ALL")) {
      // Set "ALL" as the only selected option
      setSelectedOptionsCate([{ value: "ALL", label: "ALL" }]);
      setValueCate(["ALL"]);
      setParticipantID([]);
    } else {
      // Filter out "ALL" if any other option is selected
      const filteredOptions = options.filter(
        (option) => option.value !== "ALL"
      );
      setSelectedOptionsCate(filteredOptions);
      setValueCate(filteredOptions.map((option) => option.value));
      setParticipantID(filteredOptions.map((option) => option._id));
    }
  };

  const customValueRendererCate = (valueCate, _employeename) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Participants";
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

    setValueBranchVenueCat([]);
    setSelectedOptionsBranchVenue([]);
    setValueFloorVenueCat([]);
    setSelectedOptionsFloorVenue([]);

    setSelectedOptionsCateHost([]);
    setValueCateHost([]);
    setValueCompanyHostCat([]);
    setSelectedOptionsCompanyHost([]);
    setValueBranchHostCat([]);
    setSelectedOptionsBranchHost([]);
    setValueDepartmentHostCat([]);
    setSelectedOptionsDepartmentHost([]);
    setValueTeamHostCat([]);
    setSelectedOptionsTeamHost([]);
    setShowAlert(
      <>
        {" "}
        <ErrorOutlineOutlinedIcon
          sx={{ fontSize: "100px", color: "orange" }}
        />{" "}
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Clearded Successfully"}
        </p>{" "}
      </>
    );
    handleClickOpenerr();
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
            {"Please Select Participants"}{" "}
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
    } else if (companyHostValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting Host Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (branchHostValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting Host Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (teamHostValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting Host Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (departmentHostValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Meeting Host Department"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (valueCateHostEdit.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Meeting Host"}{" "}
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (meetingEdit.recuringmeeting && oldDate === newDate) {
      handleClickOpenMultiple();
    } else {
      sendEditRequest();
    }
  };
  //get all data.
  const fetchMeeting = async () => {
    setPageName(!pageName);
    try {
      let res_status = await axios.post(SERVICE.ALL_MEETING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignbranch: accessbranch,
      });

      const results = res_status?.data?.schedulemeeting.filter(
        (data, index) => {
          return (
            data?.participantsid?.includes(isUserRoleAccess?._id) ||
            data?.participants?.includes(isUserRoleAccess?.companyname) ||
            data?.meetinghostid?.includes(isUserRoleAccess?._id) ||
            data?.interviewer?.includes(isUserRoleAccess?.companyname) ||
            data?.interviewscheduledby === isUserRoleAccess?._id ||
            data?.addedby?.some(
              (item) => item?.name === isUserRoleAccess?.username
            )
          );
        }
      );

      const { company, branch, department, team, companyname, _id, username } =
        isUserRoleAccess;

      const result = res_status?.data?.schedulemeeting.filter((data) => {
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
        ? res_status?.data?.schedulemeeting
        : result;

      const removeDuplicates = (array) => {
        const uniqueIds = new Set();
        return array.filter((obj) => {
          if (uniqueIds.has(obj.uniqueid)) {
            return false;
          } else {
            uniqueIds.add(obj.uniqueid);
            return true;
          }
        });
      };
      const final = removeDuplicates(resdata);

      setMeetingArray(final);
      setMeetingCheck(true);
    } catch (err) {
      setMeetingCheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //get all data.

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "ScheduleMeeting.png");
        });
      });
    }
  };

  // Excel
  const fileName = "ScheduleMeeting";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Schedule Meeting List",
    pageStyle: "print",
  });
  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = meetingArray?.map((item, index) => ({
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
  const apiRef = useGridApiRef();
  const [isChanged, setIsChanged] = useState({});
  const [isEditing, setIsEditing] = useState({});

  // Handle the edit icon click to activate editing for that cell
  const handleEditClick = (id) => {
    setIsEditing((prevState) => ({ ...prevState, [id]: true }));
  };

  const handleCellEditCommit = (params) => {
    if (params.field === "meetingstatus") {
      setIsChanged((prevState) => ({ ...prevState, [params.id]: true })); // Mark this row as changed
    }
  };

  const handleSaveClick = (id) => {
    const row = apiRef.current.getRow(id); // Get the row data
    console.log("Saving row:", row); // API call to save data
    setIsChanged((prevState) => ({ ...prevState, [id]: false })); // Reset changed state after saving
    setIsEditing((prevState) => ({ ...prevState, [id]: false })); // Exit editing mode after saving
  };
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
    console.log(candiId);

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
      }
    } catch (err) {
      console.log(err);
      setBtnSubmit(false);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
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
      console.log(err);
      setBtnSubmit(false);
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            {" "}
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />{" "}
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
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
              const allRowIds = rowDataTable.map((row) => row.uniqueid);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.uniqueid)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.uniqueid)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.uniqueid
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.uniqueid];
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          <>
            <>
              <Grid item md={12} xs={12} sm={12}>
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
                      status[params.row.id]?.meetingstatus
                        ? status[params.row.id]?.meetingstatus
                        : params.row.meetingstatus
                    }
                    onChange={(e) => {
                      handleAction(
                        e.target.value,
                        params?.row?.id,
                        params.row.serialNumber
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
              {status[params.row.id]?.btnShow &&
              rowIndex === params.row.serialNumber ? (
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
                        status[params.row.id]?.meetingstatus,
                        params?.row?.id
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
    // {
    //   field: "meetingstatus",
    //   headerName: "Meeting Status",
    //   width: 500,
    //   flex: 0,
    //   hide: !columnVisibility.meetingstatus,
    //   headerClassName: "bold-header",
    //   editable: true,
    //   type: "singleSelect",
    //   valueOptions: ["Completed", "Cancelled"],
    //   cellClassName: (params) => "editable-cell", // Add a custom class for editable cells
    //   renderCell: (params) => (
    //     <div>
    //       {params.value ? (
    //         params.value
    //       ) : (
    //         <span style={{ color: "#aaa" }}>No Status</span>
    //       )}
    //     </div>
    //   ),
    //   getActions: ({ id }) => {
    //     return (
    //       // isChanged &&
    //       <GridActionsCellItem
    //         icon={<SaveIcon />}
    //         label="Save"
    //         sx={{ color: "primary.main" }}
    //         onClick={() => handleSaveClick(id)}
    //       />
    //     );
    //   },
    // },
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
          {isUserRoleCompare?.includes("vschedulemeeting") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />{" "}
            </Button>
          )}
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
          {isUserRoleCompare?.includes("vschedulemeeting") && (
            <>
              {params.row.recuringmeeting == true && (
                <Button
                  variant="contained"
                  sx={{
                    minWidth: "15px",
                    padding: "6px 5px",
                  }}
                  onClick={() => {
                    backpage(
                      `/setup/schedulemeetinglog/${params.row.uniqueid}`
                    );
                  }}
                >
                  <MenuIcon style={{ fontsize: "small" }} />
                </Button>
              )}
            </>
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
      uniqueid: item.uniqueid,
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
      <Headtitle title={"SCHEDULE MEETING"} />

      <PageHeading
        title="Schedule Meeting"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Meeting"
        subpagename="Schedule Meeting"
        subsubpagename=""
      />

      <Box sx={userStyle.selectcontainer}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {" "}
              <Typography sx={userStyle.importheadtext}>
                {" "}
                Add Schedule Meeting{" "}
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
                <MultiSelect
                  options={isAssignBranch
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
                  options={isAssignBranch
                    ?.filter((comp) => valueCompanyCat?.includes(comp.company))
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
                  Team<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={allTeam
                    ?.filter(
                      (u) =>
                        valueCompanyCat?.includes(u.company) &&
                        valueBranchCat?.includes(u.branch)
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
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Department<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={departmentOption}
                  value={selectedOptionsDepartment}
                  onChange={(e) => {
                    handleDepartmentChange(e);
                  }}
                  valueRenderer={customValueRendererDepartment}
                  labelledBy="Please Select Department"
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
                  Participants<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={[
                    ...(valueDepartmentCat.length > 0 && allUsersData.length > 0
                      ? [{ label: "ALL", value: "ALL" }]
                      : []),
                    ...allUsersData
                      ?.filter(
                        (u) =>
                          valueCompanyCat?.includes(u.company) &&
                          valueBranchCat?.includes(u.branch) &&
                          valueDepartmentCat?.includes(u.department) &&
                          valueTeamCat?.includes(u.team)
                      )
                      .map((u) => ({
                        label: u.companyname,
                        value: u.companyname,
                      })),
                  ]}
                  value={selectedOptionsCate}
                  onChange={handleCategoryChange}
                  valueRenderer={customValueRendererCate}
                  labelledBy="Please Select Participants"
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
            </Grid>
            <Grid item md={12} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Agenda</Typography>
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
              <br />
              <br />
              <br />
              <br />
            </Grid>

            <Grid item md={12} xs={12} sm={12}></Grid>
            <Grid item md={12} xs={12} sm={12}>
              <Typography sx={{ fontWeight: "bold" }}>Meeting Host</Typography>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Company <b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={isAssignBranch
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
                  value={selectedOptionsCompanyHost}
                  onChange={(e) => {
                    handleCompanyHostChange(e);
                  }}
                  valueRenderer={customValueRendererCompanyHost}
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
                  options={isAssignBranch
                    ?.filter((comp) =>
                      valueCompanyHostCat?.includes(comp.company)
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
                  value={selectedOptionsBranchHost}
                  onChange={(e) => {
                    handleBranchHostChange(e);
                  }}
                  valueRenderer={customValueRendererBranchHost}
                  labelledBy="Please Select Branch"
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
                        valueCompanyHostCat?.includes(u.company) &&
                        valueBranchHostCat?.includes(u.branch)
                    )
                    .map((u) => ({
                      ...u,
                      label: u.teamname,
                      value: u.teamname,
                    }))}
                  value={selectedOptionsTeamHost}
                  onChange={(e) => {
                    handleTeamHostChange(e);
                  }}
                  valueRenderer={customValueRendererTeamHost}
                  labelledBy="Please Select Team"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Department<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={departmentOption}
                  value={selectedOptionsDepartmentHost}
                  onChange={(e) => {
                    handleDepartmentHostChange(e);
                  }}
                  valueRenderer={customValueRendererDepartmentHost}
                  labelledBy="Please Select Department"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>
                  Host<b style={{ color: "red" }}>*</b>
                </Typography>
                <MultiSelect
                  options={[
                    ...(valueDepartmentHostCat.length > 0 &&
                    allUsersData.length > 0
                      ? [{ label: "ALL", value: "ALL" }]
                      : []),
                    ...allUsersData
                      ?.filter(
                        (u) =>
                          valueCompanyHostCat?.includes(u.company) &&
                          valueBranchHostCat?.includes(u.branch) &&
                          valueDepartmentHostCat?.includes(u.department) &&
                          valueTeamHostCat?.includes(u.team)
                      )
                      .map((u) => ({
                        label: u.companyname,
                        value: u.companyname,
                      })),
                  ]}
                  value={selectedOptionsCateHost}
                  onChange={handleCategoryChangeHost}
                  valueRenderer={customValueRendererCateHost}
                  labelledBy="Please Select Participants"
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <br />
          <Grid container>
            <Grid item md={3} xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isBtn}
              >
                {" "}
                Submit{" "}
              </Button>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Button sx={userStyle.btncancel} onClick={handleclear}>
                {" "}
                Clear{" "}
              </Button>
            </Grid>
          </Grid>
        </>
      </Box>
      {/* )} */}

      <br />
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
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                List Schedule Meeting
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
                    {/* <MenuItem value={meetingArray?.length}>All</MenuItem> */}
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
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
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
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdschedulemeeting") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            <Box style={{ width: "100%", overflowY: "hidden" }}>
              <StyledDataGrid
                onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
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
                // onCellEditCommit={handleCellEditCommit}
                // apiRef={apiRef}
              />
            </Box>
            <Box style={userStyle.dataTablestyle}>
              <Box>
                Showing{" "}
                {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                {filteredDatas?.length} entries
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
          </Box>
        </>
      )}
      {/* )} */}
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
              Schedule Meeting Info
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
              <TableCell>Meeting Host</TableCell>
              <TableCell>Reminder</TableCell>
              <TableCell>Meeting Status</TableCell>
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
                  <TableCell>{row.interviewer}</TableCell>
                  <TableCell>{row.reminder}</TableCell>
                  <TableCell>{row.meetingstatus}</TableCell>
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
                  <Typography>{meetingEdit?.meetingstatus || "No Status"}</Typography>
                </FormControl>
              </Grid>
              {meetingEdit?.meetingstatus === "Completed" &&
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Minutes of Meeting</Typography>
                  <Typography>{meetingEdit?.minutesofmeeting}</Typography>
                </FormControl>
              </Grid>}
              {meetingEdit.reminder && (
                <>
                  {" "}
                  <Grid item md={6} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography variant="h6">Repeat Type</Typography>
                      <Typography>{meetingEdit.repeattype}</Typography>
                    </FormControl>
                  </Grid>
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
                      options={isAssignBranch
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
                        ...(departmentValueCateEdit.length > 0 &&
                        allUsersData.length > 0
                          ? [{ label: "ALL", value: "ALL" }]
                          : []),
                        ...allUsersData
                          ?.filter(
                            (u) =>
                              companyValueCateEdit?.includes(u.company) &&
                              branchValueCateEdit?.includes(u.branch) &&
                              departmentValueCateEdit?.includes(u.department) &&
                              teamValueCateEdit?.includes(u.team)
                          )
                          .map((u) => ({
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
                      options={isAssignBranch
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
                      options={isAssignBranch
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
                        ...(departmentHostValueCateEdit.length > 0 &&
                        allUsersData.length > 0
                          ? [{ label: "ALL", value: "ALL" }]
                          : []),
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

      {/*Export XL Data  */}
      <Dialog
        open={isFilterOpen}
        onClose={handleCloseFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {fileFormat === "csv" ? (
            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
          ) : (
            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
          )}

          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("filtered");
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            autoFocus
            variant="contained"
            onClick={(e) => {
              handleExportXL("overall");
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>
      {/*Export pdf Data  */}
      <Dialog
        open={isPdfFilterOpen}
        onClose={handleClosePdfFilterMod}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClosePdfFilterMod}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Choose Export
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("filtered");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Filtered Data
          </Button>
          <Button
            variant="contained"
            onClick={(e) => {
              downloadPdf("overall");
              setIsPdfFilterOpen(false);
            }}
          >
            Export Over All Data
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
export default ScheduleMeeting;
