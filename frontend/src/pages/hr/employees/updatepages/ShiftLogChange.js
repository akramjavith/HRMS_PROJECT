import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import LoadingButton from "@mui/lab/LoadingButton";
import domtoimage from 'dom-to-image';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextField,
  Typography,
  Chip
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaEdit,
  FaFileCsv,
  FaFileExcel,
  FaFilePdf,
  FaPlus,
  FaPrint,
} from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import InfoPopup from "../../../../components/InfoPopup.js";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
function ShiftLogChange() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    // setSubmitLoader(false);
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

  let exportColumnNames = [
    "Company Name",
    "Branch",
    "Unit",
    "Team",
    "Work Mode",
    "Employee Name",
    "Shift Type",
  ];
  let exportRowValues = [
    "companyname",
    "branch",
    "unit",
    "team",
    "workmode",
    "username",
    "shifttype",
  ];

  const gridRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    alldesignation,
    allUsersData,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
    allTeam,
    allUsersLimit
  } = useContext(UserRoleAccessContext);

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
          data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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

  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Shift Log"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [boardinglogs, setBoardinglogs] = useState([]);
  const [boardinglogcheck, setBoardinglogcheck] = useState(false);
  const [boardinglogEdit, setBoardinglogEdit] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [items, setItems] = useState([]);
  const [usernews, setUsernews] = useState([]);

  const [shifts, setShifts] = useState([]);

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  useEffect(() => {
    // Update the default time whenever the component mounts
    setBoardingLog((prevBoardingLog) => ({
      ...prevBoardingLog,
      time: moment().format("HH:mm"),
    }));
  }, []);

  const [boardingLog, setBoardingLog] = useState({
    username: "",
    empcode: "",
    company: "Select Company",
    branch: "Select Branch",
    unit: "Select Unit",
    team: "Select Team",
    startdate: formattedDate,
    starttime: currentDateTime.toTimeString().split(" ")[0],
    enddate: "present",
    endtime: "present",
    shifttype: "Please Select Shift Type",
    shiftmode: "Please Select Shift Mode",
    shiftgrouping: "Please Select Shift Grouping",
    shifttiming: "Please Select Shift",
    time: moment().format("HH:mm"),
  });
  const [boardingLogOld, setBoardingLogOld] = useState({});

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  // Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
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

  // Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    // if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  // Manage Columns
  const [searchQueryManage, setSearchQueryManage] = useState("");
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
    empcode: true,
    username: true,
    companyname: true,
    branch: true,
    unit: true,
    team: true,
    shifttype: true,
    workmode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [ShiftGroupingOptions, setShiftGroupingOptions] = useState([]);
  const ShiftTypeOptions = [
    { label: "Standard", value: "Standard" },
    { label: "Daily", value: "Daily" },
    { label: "1 Week Rotation (2 Weeks)", value: "1 Week Rotation" },
    { label: "2 Week Rotation (Monthly)", value: "2 Week Rotation" },
    { label: "1 Month Rotation (2 Month)", value: "1 Month Rotation" },
  ];

  // days
  const weekdays = [
    { label: "None", value: "None" },
    { label: "Sunday", value: "Sunday" },
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
  ];

  const ShiftModeOptions = [
    { label: "Shift", value: "Shift" },
    { label: "Week Off", value: "Week Off" },
  ];

  // for attendance mode
  const attModeOptions = [
    { label: "Domain", value: "Domain" },
    { label: "Hrms-Self", value: "Hrms-Self" },
    { label: "Hrms-Manual", value: "Hrms-Manual" },
    { label: "Biometric", value: "Biometric" },
    { label: "Production", value: "Production" },
  ];

  const [selectedAttMode, setSelectedAttMode] = useState([]);
  const [valueAttMode, setValueAttMode] = useState([]);
  //att mode multiselect
  const handleAttModeChange = (options) => {
    setSelectedAttMode(options);
    setValueAttMode(options.map((a, index) => {
      return a.value;
    }))
  };

  const customValueRendererAttMode = (valueCompany, _attmode) => {
    return valueCompany?.length
      ? valueCompany.map(({ label }) => label)?.join(", ")
      : "Please Select Attendance Mode";
  };

  // week off details
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  const [todoOld, setTodoOld] = useState([]);
  const [todo, setTodo] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  // const [editingIndexcheck, setEditingIndexcheck] = useState(null);
  const [editTodoBackup, setEditTodoBackup] = useState(null); // Backup of the original todo before editing

  const weekoptions2weeks = ["1st Week", "2nd Week"];
  const weekoptions1month = [
    "1st Week",
    "2nd Week",
    "3rd Week",
    "4th Week",
    "5th Week",
    "6th Week",
  ];
  const weekoptions2months = [
    "1st Week",
    "2nd Week",
    "3rd Week",
    "4th Week",
    "5th Week",
    "6th Week",
    "7th Week",
    "8th Week",
    "9th Week",
    "10th Week",
    "11th Week",
    "12th Week",
  ];

  const [selectedOptionsCateWeeks, setSelectedOptionsCateWeeks] = useState([]);
  let [valueCateWeeks, setValueCateWeeks] = useState("");

  const handleWeeksChange = (options) => {
    setValueCateWeeks(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCateWeeks(options);
  };

  const customValueRendererCateWeeks = (valueCate, _days) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Weeks";
  };

  const handleAddTodo = () => {
    if (boardingLog.shifttype === "Please Select Shift Type") {
      setPopupContentMalert("Please Select Shift Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Stop further processing if validation fails
    } else {
      if (boardingLog.shifttype === "Daily") {
        if (boardingLog.shiftgrouping === "Please Select Shift Grouping" || boardingLog.shiftgrouping === "" || !boardingLog.shiftgrouping) {
          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (boardingLog.shifttiming === "Please Select Shift" || boardingLog.shifttiming === "" || !boardingLog.shifttiming) {
          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setPopupContentMalert("Please Select Week Off!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else {
          const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const week = "1st Week";
          const newTodoList = days.map((day, index) => ({
            day,
            daycount: index + 1,
            week,
            shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
            shiftgrouping: !valueCate.includes(day)
              ? boardingLog.shiftgrouping
              : "",
            shifttiming: !valueCate.includes(day)
              ? boardingLog.shifttiming
              : "",
          }));
          setTodo(newTodoList);
        }
      }

      if (boardingLog.shifttype === "1 Week Rotation") {
        if (boardingLog.shiftgrouping === "Please Select Shift Grouping" || boardingLog.shiftgrouping === "" || !boardingLog.shiftgrouping) {
          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (boardingLog.shifttiming === "Please Select Shift" || boardingLog.shifttiming === "" || !boardingLog.shifttiming) {
          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setPopupContentMalert("Please Select Weeks!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setPopupContentMalert("Please Select Week Off!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else {
          const days1 = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const days2 = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const newTodoList = [
            // Check if "1st Week" is in valueCateWeeks and map days1 if true
            ...(valueCateWeeks.includes("1st Week")
              ? days1.map((day, index) => ({
                day,
                daycount: index + 1,
                week: "1st Week", // Replacing week1 with "1st Week"
                shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
                shiftgrouping: !valueCate.includes(day)
                  ? boardingLog.shiftgrouping
                  : "",
                shifttiming: !valueCate.includes(day)
                  ? boardingLog.shifttiming
                  : "",
              }))
              : []), // Return an empty array if "1st Week" is not in valueCateWeeks

            // Check if "2nd Week" is in valueCateWeeks and map days2 if true
            ...(valueCateWeeks.includes("2nd Week")
              ? days2.map((day, index) => ({
                day,
                daycount: index + 8,
                week: "2nd Week", // Replacing week2 with "2nd Week"
                shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
                shiftgrouping: !valueCate.includes(day)
                  ? boardingLog.shiftgrouping
                  : "",
                shifttiming: !valueCate.includes(day)
                  ? boardingLog.shifttiming
                  : "",
              }))
              : []), // Return an empty array if "2nd Week" is not in valueCateWeeks
          ];

          setTodo((prev) => [...prev, ...newTodoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }

      if (boardingLog.shifttype === "2 Week Rotation") {
        if (boardingLog.shiftgrouping === "Please Select Shift Grouping" || boardingLog.shiftgrouping === "" || !boardingLog.shiftgrouping) {
          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (boardingLog.shifttiming === "Please Select Shift" || boardingLog.shifttiming === "" || !boardingLog.shifttiming) {
          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setPopupContentMalert("Please Select Weeks!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setPopupContentMalert("Please Select Week Off!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else {
          const daysInMonth = valueCateWeeks?.length * 7;
          const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const weeks = [...valueCateWeeks]; // You may need to adjust this based on the actual month

          let todoList = [];
          let currentWeek = 1;
          let currentDayCount = 1;
          let currentDayIndex = 0;

          for (let i = 1; i <= daysInMonth; i++) {
            const day = days[currentDayIndex];
            const week = weeks[currentWeek - 1];

            todoList.push({
              day,
              daycount: currentDayCount,
              week,
              shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
              shiftgrouping: !valueCate.includes(day)
                ? boardingLog.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day)
                ? boardingLog.shifttiming
                : "",
            });

            currentDayIndex = (currentDayIndex + 1) % 7;
            currentDayCount++;
            if (currentDayIndex === 0) {
              currentWeek++;
            }
          }
          setTodo((prev) => [...prev, ...todoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }

      if (boardingLog.shifttype === "1 Month Rotation") {
        if (boardingLog.shiftgrouping === "Please Select Shift Grouping" || boardingLog.shiftgrouping === "" || !boardingLog.shiftgrouping) {
          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (boardingLog.shifttiming === "Please Select Shift" || boardingLog.shifttiming === "" || !boardingLog.shifttiming) {
          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setPopupContentMalert("Please Select Weeks!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setPopupContentMalert("Please Select Week Off!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else {
          const daysInMonth = valueCateWeeks?.length * 7;
          const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const weeks = [...valueCateWeeks]; // You may need to adjust this based on the actual month

          let todoList = [];
          let currentWeek = 1;
          let currentDayCount = 1;
          let currentDayIndex = 0;

          for (let i = 1; i <= daysInMonth; i++) {
            const day = days[currentDayIndex];
            const week = weeks[currentWeek - 1];

            todoList.push({
              day,
              daycount: currentDayCount,
              week,
              shiftmode: valueCate.includes(day) ? "Week Off" : "Shift",
              shiftgrouping: !valueCate.includes(day)
                ? boardingLog.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day)
                ? boardingLog.shifttiming
                : "",
            });

            currentDayIndex = (currentDayIndex + 1) % 7;
            currentDayCount++;
            if (currentDayIndex === 0) {
              currentWeek++;
            }
          }

          setTodo((prev) => [...prev, ...todoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }
    }
  };

  // Function to handle editing start
  const handleEditTodocheck = (index) => {
    // Backup the current values before editing
    setEditTodoBackup(todo[index]);
    setEditingIndexcheck(index); // Set the index of the current todo being edited
  };

  // Function to handle confirming the changes
  const handleUpdateTodocheck = () => {
    // Confirm the changes and update the todo list
    setEditingIndexcheck(null); // Reset the editing state
  };

  // Function to handle canceling the changes
  const handleCancelEdit = () => {
    // Revert to the original todo state if editing is canceled
    const updatedTodos = [...todo];
    updatedTodos[editingIndexcheck] = editTodoBackup;
    setTodo(updatedTodos); // Restore original values
    setEditingIndexcheck(null); // Reset the editing state
    setEditTodoBackup(null); // Clear the backup
  };

  function multiInputs(referenceIndex, reference, inputvalue) {
    // Update isSubCategory state
    if (reference === "shiftmode") {
      let updatedShiftMode = todo?.map((value, index) => {
        if (referenceIndex === index) {
          return {
            ...value,
            shiftmode: inputvalue,
            shiftgrouping: "Please Select Shift Grouping",
            shifttiming: "Please Select Shift",
          };
        } else {
          return value;
        }
      });
      setTodo(updatedShiftMode);
    }

    // Update isSubCategory state
    if (reference === "shiftgrouping") {
      let updatedShiftGroup = todo?.map((value, index) => {
        if (referenceIndex === index) {
          return {
            ...value,
            shiftgrouping: inputvalue,
            shifttiming: "Please Select Shift",
          };
        } else {
          return value;
        }
      });
      setTodo(updatedShiftGroup);
    }

    // Update isSubCategory state
    if (reference === "shifttiming") {
      let updatedShiftTime = todo?.map((value, index) => {
        if (referenceIndex === index) {
          return { ...value, shifttiming: inputvalue };
        } else {
          return value;
        }
      });
      setTodo(updatedShiftTime);
    }
  }

  const AsyncShiftTimingSelects = ({
    todo,
    index,
    auth,
    multiInputs,
    colourStyles,
  }) => {
    const fetchShiftTimings = async () => {
      let ansGet = todo.shiftgrouping;
      let answerFirst = ansGet?.split("_")[0];
      let answerSecond = ansGet?.split("_")[1];

      let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const shiftGroup = res?.data?.shiftgroupings.filter(
        (data) =>
          data.shiftday === answerFirst && data.shifthours === answerSecond
      );

      const options =
        shiftGroup?.length > 0
          ? shiftGroup
            .flatMap((data) => data.shift)
            .map((u) => ({
              ...u,
              label: u,
              value: u,
            }))
          : [];

      return options;
    };

    const [shiftTimings, setShiftTimings] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const options = await fetchShiftTimings();
        setShiftTimings(options);
      };
      fetchData();
    }, [todo.shiftgrouping, auth.APIToken]);

    return (
      <Selects
        size="small"
        options={shiftTimings}
        styles={colourStyles}
        value={{ label: todo.shifttiming, value: todo.shifttiming }}
        onChange={(selectedOption) =>
          multiInputs(index, "shifttiming", selectedOption.value)
        }
      />
    );
  };

  const ShiftGroupingDropdwons = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftGroupingOptions(
        res?.data?.shiftgroupings.map((data) => ({
          ...data,
          label: data.shiftday + "_" + data.shifthours,
          value: data.shiftday + "_" + data.shifthours,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const ShiftDropdwonsSecond = async (e) => {
    setPageName(!pageName);
    try {
      let ansGet = e;
      let answerFirst = ansGet?.split("_")[0];
      let answerSecond = ansGet?.split("_")[1];

      let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const shiftGroup = res?.data?.shiftgroupings.filter(
        (data) =>
          data.shiftday === answerFirst && data.shifthours === answerSecond
      );
      const shiftFlat =
        shiftGroup?.length > 0 ? shiftGroup?.flatMap((data) => data.shift) : [];

      setShifts(
        shiftFlat.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    ShiftGroupingDropdwons();
  }, []);

  const [oldData, setOldData] = useState({
    company: "",
    branch: "",
    unit: "",
    team: "",
  });
  const [prevLogDates, setPrveLogDates] = useState([])
  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBoardinglogEdit(res?.data?.suser);
      let prevLogDates = res?.data?.suser?.boardingLog?.length > 0 ? res?.data?.suser?.boardingLog?.filter(
        (data) => data.logcreation === "user" || data.logcreation === "shift"
      )?.map((item) => item?.startdate) : []
      setPrveLogDates(prevLogDates)
      let isThere = res?.data?.suser?.attendancemode ? res?.data?.suser?.attendancemode?.map((data) => ({
        ...data,
        label: data,
        value: data
      })) : [];
      setSelectedAttMode(isThere);

      setValueAttMode(res?.data?.suser?.attendancemode ? res?.data?.suser?.attendancemode?.map(data => data) : []);

      setBoardingLog({
        ...boardingLog,
        username: res?.data?.suser?.username,
        empcode: res?.data?.suser?.empcode,
        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        team: res?.data?.suser?.team,
        doj: res?.data?.suser?.doj,
        shifttype:
          res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog.length - 1
          ]?.shifttype,
        prevstartdate:
          res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog.length - 1
          ]?.startdate,
        shiftgrouping:
          res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog.length - 1
          ]?.shiftgrouping,
        shifttiming:
          res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog.length - 1
          ]?.shifttiming,
        shiftmode: res?.data?.suser?.shiftmode,
      });
      setBoardingLogOld({
        ...boardingLogOld,
        username: res?.data?.suser?.username,
        empcode: res?.data?.suser?.empcode,
        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        team: res?.data?.suser?.team,
        shifttype:
          res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog.length - 1
          ]?.shifttype,
        shiftgrouping:
          res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog.length - 1
          ]?.shiftgrouping,
        shifttiming:
          res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog.length - 1
          ]?.shifttiming,
        shiftmode: res?.data?.suser?.shiftmode,
      });

      setTodo(
        res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog.length - 1]
          ?.todo
      );
      setTodoOld(
        res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog.length - 1]
          ?.todo
      );
      setSelectedOptionsCate(
        Array.isArray(
          res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.weekoff
        )
          ? res?.data?.suser?.boardingLog[
            res?.data?.suser?.boardingLog?.length - 1
          ]?.weekoff?.map((x) => ({
            ...x,
            label: x,
            value: x,
          }))
          : []
      );
      setValueCate(
        res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog?.length - 1]
          ?.weekoff
      );
      ShiftDropdwonsSecond(
        res?.data?.suser?.boardingLog[res?.data?.suser?.boardingLog?.length - 1]
          ?.shiftgrouping
      );
      setOldData({
        ...oldData,
        empcode: res?.data?.suser?.empcode,
        company: res?.data?.suser?.company,
        unit: res?.data?.suser?.unit,
        branch: res?.data?.suser?.branch,
        team: res?.data?.suser?.team,
      });

      handleClickOpenEdit();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [showButton, setShowButton] = useState(true);

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBoardinglogEdit(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //Project updateby edit page...
  let updateby = boardinglogEdit?.updatedby;
  let addedby = boardinglogEdit?.addedby;

  const sendEditRequest = async () => {
    setPageName(!pageName);
    try {

      let rocketchatshiftgrouping = [];
      let rocketchatshift = [];

      if (boardingLog.shifttype === "Standard") {
        if (boardingLog.shiftgrouping) {
          rocketchatshiftgrouping.push(boardingLog.shiftgrouping);
        }
        if (boardingLog.shifttiming) {
          rocketchatshift.push(boardingLog.shifttiming);
        }
      } else if (boardingLog.shifttype !== "Standard") {

        if (todo && todo.length > 0) {
          // Iterate over the todo array and push shiftgrouping and shifttiming
          todo.forEach(item => {
            if (item.shiftgrouping) {
              rocketchatshiftgrouping.push(item.shiftgrouping);
            }
            if (item.shifttiming) {
              rocketchatshift.push(item.shifttiming);
            }
          });
        }
      }


      let res = await axios.put(
        `${SERVICE.USER_SINGLE_PWD}/${boardinglogEdit._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          shifttiming: String(
            boardingLog.shifttype === "Standard" ? boardingLog.shifttiming : ""
          ),
          shiftgrouping: String(
            boardingLog.shifttype === "Standard"
              ? boardingLog.shiftgrouping
              : ""
          ),
          shifttype: String(boardingLog.shifttype),
          attendancemode: [...valueAttMode],



          rocketchatemail: boardinglogEdit?.rocketchatemail,
          rocketchatid: boardinglogEdit?.rocketchatid,
          rocketchatroles: boardinglogEdit?.rocketchatroles,
          rocketchatteamid: boardinglogEdit?.rocketchatteamid,
          rocketchatchannelid: boardinglogEdit?.rocketchatchannelid,
          username: boardinglogEdit?.username,
          workmode: boardinglogEdit?.workmode,
          rocketchatshiftgrouping,
          rocketchatshift,

          company: String(boardinglogEdit?.company),
          branch: String(boardinglogEdit?.branch),
          unit: String(boardinglogEdit?.unit),
          team: String(boardinglogEdit?.team),
          designation: String(boardinglogEdit?.designation),
          department: String(boardinglogEdit?.department),
          process: String(boardinglogEdit?.process),
          companyname: boardinglogEdit?.companyname,

          boardingLog: [
            ...boardinglogEdit.boardingLog,
            {
              username: String(boardinglogEdit.companyname),
              company: String(boardinglogEdit.company),
              startdate: String(boardingLog.startdate),
              time: `${boardinglogEdit.time}:${boardinglogEdit.timemins}`,
              branch: String(boardinglogEdit.branch),
              unit: String(boardinglogEdit.unit),
              team: String(boardinglogEdit.team),
              shifttype: String(boardingLog.shifttype),
              shifttiming: String(boardingLog.shifttiming),
              shiftgrouping: String(boardingLog.shiftgrouping),
              weekoff: [...valueCate],
              todo: boardingLog.shifttype === "Standard" ? [] : [...todo],
              ischangecompany: Boolean(false),
              ischangebranch: Boolean(false),
              ischangeunit: Boolean(false),
              ischangeteam: Boolean(false),
              ischangefloor: Boolean(false),
              ischangearea: Boolean(false),
              ischangeworkstation: Boolean(false),
              logcreation: "shift",
              updatedusername: String(isUserRoleAccess.companyname),
              updateddatetime: String(new Date()),
              logeditedby: [],
            },
          ],
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        },
        {}
      );

      handleCloseModEdit();
      setFilteredChanges(null)
      setFilteredRowData([]);
      await fetchBoardinglog();
      setBoardingLog({
        ...boardingLog,
        company: "Select Company",
        branch: "Select Branch",
        unit: "Select Unit",
        team: "Select Team",
        shiftgrouping: "Please Select Shift",
        shifttiming: "Please Select Shift",
        shifttype: "Please Select Shift Type",
      });
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const editSubmit = (e) => {
    e.preventDefault();

    // Check if there are any changes
    const isChanged = Object.keys(boardingLog).some(
      (key) => boardingLog[key] !== boardingLogOld[key]
    );

    const isChangedTodo = todo.some((newLog, index) => {
      const prevLog = todoOld[index];
      return (
        !prevLog ||
        Object.keys(newLog).some((key) => newLog[key] !== prevLog[key])
      );
    });

    let oneweekrotation = weekoptions2weeks?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;
    let twoweekrotation = weekoptions1month?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;
    let onemonthrotation = weekoptions2months?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;

    if (
      prevLogDates?.includes(boardingLog.startdate)
    ) {
      setPopupContentMalert("Date Can not be same as prev logs!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (
      boardingLog.shifttype === "Please Select Shift Type" ||
      boardingLog.shifttype === "" ||
      boardingLog.shifttype === undefined
    ) {
      setPopupContentMalert("Please Select Shift Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Stop further processing if validation fails
    }
    if (boardingLog.startdate === "") {
      setPopupContentMalert("Please Select Start Date!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Stop further processing if validation fails
    }
    if (selectedAttMode.length === 0) {
      setPopupContentMalert("Please Select Attendance Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Stop further processing if validation fails
    }
    if (
      boardingLog.shifttype === "Standard" &&
      (boardingLog.shiftgrouping === "" ||
        boardingLog.shiftgrouping === "Please Select Shift Grouping" ||
        boardingLog.shiftgrouping === undefined)
    ) {
      setPopupContentMalert("Please Select Shift Grouping!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Stop further processing if validation fails
    }
    if (
      boardingLog.shifttype === "Standard" &&
      (boardingLog.shifttiming === "" ||
        boardingLog.shifttiming === "Please Select Shift" ||
        boardingLog.shifttiming === undefined)
    ) {
      setPopupContentMalert("Please Select Shift!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Stop further processing if validation fails
    }

    if (boardingLog.shifttype === "Daily" && todo?.length === 0) {
      setPopupContentMalert("Please Add Todo and Update!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    else if (boardingLog.shifttype === "1 Week Rotation" && oneweekrotation > 0) {
      setPopupContentMalert("Please Add all the weeks in the todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    else if (
      boardingLog.shifttype === "2 Week Rotation" &&
      twoweekrotation > 0
    ) {
      setPopupContentMalert("Please Add all the weeks in the todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (
      boardingLog.shifttype === "1 Month Rotation" &&
      onemonthrotation > 0
    ) {
      setPopupContentMalert("Please Add all the weeks in the todo!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }

    if (boardingLog.shifttype !== "Standard") {
      // Iterate over each row in todo list for validation
      for (let i = 0; i < todo.length; i++) {
        const row = todo[i];

        if (row.shiftmode === "Please Select Shift Mode") {
          setPopupContentMalert("Please Select Shift Mode!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        }

        if (
          row.shiftmode === "Shift" &&
          row.shiftgrouping === "Please Select Shift Grouping"
        ) {
          setPopupContentMalert("Please Select Shift Grouping!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        }

        if (
          row.shiftmode === "Shift" &&
          row.shiftgrouping !== "Please Select Shift Grouping" &&
          row.shifttiming === "Please Select Shift"
        ) {
          setPopupContentMalert("Please Select Shift!");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        }
      }
    }

    if (boardingLog.shifttype === "Standard" && !isChanged) {
      setPopupContentMalert("No Changes to Update!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }
    if (boardingLog.shifttype !== "Standard" && !isChangedTodo) {
      setPopupContentMalert("No Changes to Update!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    }

    // If all validations passed, proceed with sending the edit request
    sendEditRequest();
  };

  const fetchBoardinglognew = async () => {
    setPageName(!pageName);
    try {
      let res_users = await axios.get(SERVICE.LOGALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUsernews(res_users?.data?.allusers);
      setBoardinglogcheck(true);
    } catch (err) {
      setBoardinglogcheck(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    fetchBoardinglognew();
  }, [isFilterOpen]);

  // Excel
  const fileName = "Shift Log";

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Shift Log",
    pageStyle: "print",
  });

  // image
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "ShiftLog.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const addSerialNumber = (datas) => {

    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(boardinglogs);
  }, [boardinglogs]);

  const [searchedString, setSearchedString] = useState("");
  const [isHandleChange, setIsHandleChange] = useState(false);
  const gridRefTable = useRef(null);

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

  // datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  // Modify the filtering logic to check each term
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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
  const indexOfFirstItem = indexOfLastItem - pageSize;

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
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 130,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 130,
      hide: !columnVisibility.unit,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 130,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 130,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "username",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          <ListItem
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              },
            }}
          >
            <CopyToClipboard
              onCopy={() => {
                handleCopy("Copied Employee Name!");
              }}
              options={{ message: "Copied Employee Name!" }}
              text={params?.data?.username}
            >
              <ListItemText primary={params?.data?.username} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "shifttype",
      headerName: "Shift Type",
      flex: 0,
      width: 150,
      hide: !columnVisibility.shifttype,
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
      cellStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("vshiftlog") && (
            <Button
              variant="contained"
              sx={{
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={() => {
                window.open(
                  `/updatepages/shiftloglist/${params.data.id}`,
                  "_blank"
                );
              }}
            >
              <MenuIcon style={{ fontsize: "small" }} />
            </Button>
          )}
          &ensp;
          {isUserRoleCompare?.includes("eshiftlog") && (
            <Button
              style={{
                backgroundColor: "red",
                minWidth: "15px",
                padding: "6px 5px",
              }}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <FaEdit style={{ color: "white", fontSize: "18px" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ishiftlog") && (
            <Button
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
      id: item.id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      username: item.username,
      companyname: item.companyname,
      workmode: item.workmode,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      shifttype: item.shifttype,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    setColumnVisibility(initialColumnVisibility);
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

  const [fileFormat, setFormat] = useState("");

  //FILTER START
  const [internChecked, setInternChecked] = useState(false);
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartments = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartmentOptions(
        req?.data?.departmentdetails?.map((data) => ({
          label: data?.deptname,
          value: data?.deptname,
        }))
      );
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const EmployeeStatusOptions = [
    { label: "Live Employee", value: "Live Employee" },
    { label: "Releave Employee", value: "Releave Employee" },
    { label: "Absconded", value: "Absconded" },
    { label: "Hold", value: "Hold" },
    { label: "Terminate", value: "Terminate" },
  ];
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];

  //MULTISELECT ONCHANGE START

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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
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
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //department multiselect
  const [selectedOptionsDepartment, setSelectedOptionsDepartment] = useState(
    []
  );
  let [valueDepartmentCat, setValueDepartmentCat] = useState([]);

  const handleDepartmentChange = (options) => {
    setValueDepartmentCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsDepartment(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const customValueRendererDepartment = (valueDepartmentCat, _categoryname) => {
    return valueDepartmentCat?.length
      ? valueDepartmentCat.map(({ label }) => label)?.join(", ")
      : "Please Select Department";
  };
  //employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setValueEmp(
      options.map((a, index) => {
        return a.value;
      })
    );

    setSelectedOptionsEmployee(options);
  };

  const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
    return valueEmployeeCat?.length
      ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
      : "Please Select Employee";
  };

  const [valueEmp, setValueEmp] = React.useState([]); // State for employees
  const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state


  const [searchInputValue, setSearchInputValue] = useState('');

  const handlePasteForEmp = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    // Process the pasted text
    const pastedNames = pastedText
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name !== "");

    // Update the state
    updateEmployees(pastedNames);

    // Clear the search input after paste
    setSearchInputValue('');

    // Refocus the element
    e.target.focus();
  };

  useEffect(() => {
    updateEmployees([]); // Pass an empty array instead of an empty string
  }, [allUsersData, valueCompanyCat, valueBranchCat, valueUnitCat, valueTeamCat]);

  const updateEmployees = (pastedNames) => {
    // Your existing update logic...
    const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    const availableOptions = internChecked
      ? allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            valueUnitCat?.includes(u.unit) &&
            valueTeamCat?.includes(u.team) &&
            u.workmode === "Internship"
        )
        ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())
      : allUsersData
        ?.filter(
          (u) =>
            valueCompanyCat?.includes(u.company) &&
            valueBranchCat?.includes(u.branch) &&
            valueUnitCat?.includes(u.unit) &&
            valueTeamCat?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())


    const matchedValues = namesArray.filter((name) =>
      availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
    );

    // Update selected options
    const newOptions = matchedValues.map(value => ({
      label: value,
      value: value
    }));

    setSelectedOptionsEmployee(prev => {
      const newValues = newOptions.filter(
        newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
      );
      return [...prev, ...newValues];
    });

    // Update other states...
    setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
    setValueEmployeeCat(prev => [...new Set([...prev, ...matchedValues])]);
  };

  // Handle clicks outside the Box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
      if (boxElement && !boxElement.contains(e.target)) {
        setIsBoxFocused(false); // Reset focus state if clicking outside the Box
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = (e, value) => {
    e.preventDefault();
    setSelectedOptionsEmployee((current) => current.filter(emp => emp.value !== value));
    setValueEmp((current) => current.filter(empValue => empValue !== value));
    setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
  };

  //MULTISELECT ONCHANGE END
  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]); setEmployeeOptions([]);
    setBoardinglogs([]);
    setInternChecked(false);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [filterLoader, setFilterLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const handleFilter = () => {
    if (
      filterState?.type === "Please Select Type" ||
      filterState?.type === ""
    ) {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCompany?.length === 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    // else if (
    //   filterState?.employeestatus === "Please Select Employee Status" ||
    //   filterState?.employeestatus === ""
    // ) {
    //   setPopupContentMalert("Please Select Employee Status!");
    //   setPopupSeverityMalert("info");
    //   handleClickOpenPopupMalert();
    // }
    else if (
      ["Individual", "Branch", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsBranch?.length === 0
    ) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Unit", "Team"]?.includes(filterState?.type) &&
      selectedOptionsUnit?.length === 0
    ) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      ["Individual", "Team"]?.includes(filterState?.type) &&
      selectedOptionsTeam?.length === 0
    ) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Individual" &&
      selectedOptionsEmployee?.length === 0
    ) {
      setPopupContentMalert("Please Select Employee!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      filterState?.type === "Department" &&
      selectedOptionsDepartment?.length === 0
    ) {
      setPopupContentMalert("Please Select Department!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      fetchBoardinglog();
    }
  };

  const fetchBoardinglog = async () => {
    setFilterLoader(true);
    setTableLoader(true);
    setPageName(!pageName);
    setSearchQuery("");
    setSearchedString("");
    const aggregationPipeline = [
      {
        $match: {
          $and: [
            // Enquiry status filter
            {
              enquirystatus: {
                $nin: ["Enquiry Purpose"],
              },
            },
            // Reasonable status filter
            {
              resonablestatus: {
                $nin: [
                  "Not Joined",
                  "Postponed",
                  "Rejected",
                  "Closed",
                  "Releave Employee",
                  "Absconded",
                  "Hold",
                  "Terminate",
                ],
              },
            },
            // Conditional company filter
            ...(valueCompanyCat.length > 0
              ? [
                {
                  company: { $in: valueCompanyCat },
                },
              ]
              : [
                {
                  company: { $in: allAssignCompany },
                },
              ]),
            // Conditional branch filter
            ...(valueBranchCat.length > 0
              ? [
                {
                  branch: { $in: valueBranchCat },
                },
              ]
              : [
                {
                  branch: { $in: allAssignBranch },
                },
              ]),
            // Conditional unit filter
            ...(valueUnitCat.length > 0
              ? [
                {
                  unit: { $in: valueUnitCat },
                },
              ]
              : [
                {
                  unit: { $in: allAssignUnit },
                },
              ]),
            // Conditional team filter
            ...(valueTeamCat.length > 0
              ? [
                {
                  team: { $in: valueTeamCat },
                },
              ]
              : []),
            // Conditional department filter
            ...(valueDepartmentCat.length > 0
              ? [
                {
                  department: { $in: valueDepartmentCat },
                },
              ]
              : []),
            // Conditional Employee filter
            ...(valueEmployeeCat.length > 0
              ? [
                {
                  companyname: { $in: valueEmployeeCat },
                },
              ]
              : []),
          ],
        },
      },
      {
        $project: {
          empcode: 1,
          companyname: 1,
          username: 1,
          branch: 1,
          unit: 1,
          team: 1,
          company: 1,
          shift: 1,
          doj: 1,
          department: 1,
          designationlog: 1,
          departmentlog: 1,
          processlog: 1,
          boardingLog: 1,
          designation: 1,
          floor: 1,
          reportingto: 1,
          shifttiming: 1,
          shiftgrouping: 1,
          shifttype: 1,
          weekoff: 1,
          area: 1,
          shiftallot: 1,
          workmode: 1,
        },
      },
    ];
    try {
      let response = await axios.post(
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
      const itemsWithSerialNumber = response.data.users?.map((item, index) => ({
        ...item,
        serialNumber: index + 1,
        id: item._id,
        username: item.companyname,
        companyname: item.company,
        workmode: item.workmode,
      }));
      setSearchQuery("");
      setFilteredChanges(null)
      setFilteredRowData([]);
      setBoardinglogs(itemsWithSerialNumber);

      setFilterLoader(false);
      setTableLoader(false);
    } catch (err) {
      console.log(err);
      setFilterLoader(true);
      setTableLoader(true);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  //auto select all dropdowns
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  const handleAutoSelect = async () => {
    setPageName(!pageName);
    try {
      let selectedValues = accessbranch
        ?.map((data) => ({
          company: data.company,
          branch: data.branch,
          unit: data.unit,
        }))
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        );
      let selectedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        .map((a, index) => {
          return a.company;
        });

      let mappedCompany = selectedValues
        ?.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.company === value.company)
        )
        ?.map((data) => ({
          label: data?.company,
          value: data?.company,
        }));

      setValueCompanyCat(selectedCompany);
      setSelectedOptionsCompany(mappedCompany);

      let selectedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        .map((a, index) => {
          return a.branch;
        });

      let mappedBranch = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.company === value.company && t.branch === value.branch
            )
        )
        ?.map((data) => ({
          label: data?.branch,
          value: data?.branch,
        }));

      setValueBranchCat(selectedBranch);
      setSelectedOptionsBranch(mappedBranch);

      let selectedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        .map((a, index) => {
          return a.unit;
        });

      let mappedUnit = selectedValues
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.company === value.company &&
                t.branch === value.branch &&
                t.unit === value.unit
            )
        )
        ?.map((data) => ({
          label: data?.unit,
          value: data?.unit,
        }));

      setValueUnitCat(selectedUnit);
      setSelectedOptionsUnit(mappedUnit);

      let mappedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => ({
          label: u.teamname,
          value: u.teamname,
        }));

      let selectedTeam = allTeam
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit)
        )
        .map((u) => u.teamname);

      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        .map((u) => ({
          label: u.companyname,
          value: u.companyname,
        }));

      let employees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team) &&
            u.workmode !== "Internship"
        )
        .map((u) => u.companyname);
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);
      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);

      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map((item) => item?.value));

    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  useEffect(() => {
    handleAutoSelect();
  }, [isAssignBranch]);

  //FILTER END

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"SHIFT LOG"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Shift Log"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Log Details"
        subsubpagename="Shift Log"
      />
      {isUserRoleCompare?.includes("lshiftlog") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Type<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={TypeOptions}
                      styles={colourStyles}
                      value={{
                        label: filterState.type ?? "Please Select Type",
                        value: filterState.type ?? "Please Select Type",
                      }}
                      onChange={(e) => {
                        setFilterState((prev) => ({
                          ...prev,
                          type: e.value,
                        }));
                        setValueCompanyCat([]);
                        setSelectedOptionsCompany([]);
                        setValueBranchCat([]);
                        setSelectedOptionsBranch([]);
                        setValueUnitCat([]);
                        setSelectedOptionsUnit([]);
                        setValueTeamCat([]);
                        setSelectedOptionsTeam([]);
                        setValueDepartmentCat([]);
                        setSelectedOptionsDepartment([]);
                        setValueEmployeeCat([]);
                        setSelectedOptionsEmployee([]);
                        setValueEmp([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
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
                      value={selectedOptionsCompany}
                      onChange={(e) => {
                        handleCompanyChange(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>

                {/* <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee Status<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={EmployeeStatusOptions}
                        styles={colourStyles}
                        value={{
                          label:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                          value:
                            filterState.employeestatus ??
                            "Please Select Employee Status",
                        }}
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            employeestatus: e.value,
                          }));
                          setValueBranchCat([]);
                          setSelectedOptionsBranch([]);
                          setValueUnitCat([]);
                          setSelectedOptionsUnit([]);
                          setValueTeamCat([]);
                          setSelectedOptionsTeam([]);
                          setValueDepartmentCat([]);
                          setSelectedOptionsDepartment([]);
                          setValueEmployeeCat([]);
                          setSelectedOptionsEmployee([]);
                        }}
                      />
                    </FormControl>
                  </Grid> */}

                {["Individual", "Team"]?.includes(filterState.type) ? (
                  <>
                    {/* Branch Unit Team */}
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch <b style={{ color: "red" }}>*</b>
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
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
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
                  </>
                ) : ["Department"]?.includes(filterState.type) ? (
                  <>
                    {/* Department */}
                    <Grid item md={3} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Department<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <MultiSelect
                          options={departmentOptions}
                          value={selectedOptionsDepartment}
                          onChange={(e) => {
                            handleDepartmentChange(e);
                          }}
                          valueRenderer={customValueRendererDepartment}
                          labelledBy="Please Select Department"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : ["Branch"]?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Branch <b style={{ color: "red" }}>*</b>
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
                  </>
                ) : ["Unit"]?.includes(filterState.type) ? (
                  <>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
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
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          {" "}
                          Unit <b style={{ color: "red" }}>*</b>
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
                  </>
                ) : (
                  ""
                )}
                {["Individual"]?.includes(filterState.type) && (
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Employee<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <div
                        onPaste={handlePasteForEmp}
                        style={{ position: 'relative' }}
                      >
                        <MultiSelect
                          options={
                            internChecked
                              ? allUsersData
                                ?.filter(
                                  (u) =>
                                    valueCompanyCat?.includes(u.company) &&
                                    valueBranchCat?.includes(u.branch) &&
                                    valueUnitCat?.includes(u.unit) &&
                                    valueTeamCat?.includes(u.team) &&
                                    u.workmode === "Internship"
                                )
                                .map((u) => ({
                                  label: u.companyname,
                                  value: u.companyname,
                                }))
                              : allUsersData
                                ?.filter(
                                  (u) =>
                                    valueCompanyCat?.includes(u.company) &&
                                    valueBranchCat?.includes(u.branch) &&
                                    valueUnitCat?.includes(u.unit) &&
                                    valueTeamCat?.includes(u.team) &&
                                    u.workmode !== "Internship"
                                )
                                .map((u) => ({
                                  label: u.companyname,
                                  value: u.companyname,
                                }))
                          }
                          value={selectedOptionsEmployee}
                          onChange={(e) => {
                            handleEmployeeChange(e);
                          }}
                          valueRenderer={customValueRendererEmployee}
                          labelledBy="Please Select Employee"
                          // Add these props if your MultiSelect supports them
                          inputValue={searchInputValue} // Add this state if needed
                          onInputChange={(newValue) => setSearchInputValue(newValue)}
                        />
                      </div>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={internChecked}
                          onChange={(event) => {
                            setInternChecked(event.target.checked);
                            setValueEmployeeCat([]);
                            setSelectedOptionsEmployee([]);
                            setValueEmp([]);
                          }}
                        />
                      }
                      label="Internship"
                    />
                  </Grid>
                )}
                {["Individual"]?.includes(filterState.type) &&
                  <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                    <FormControl fullWidth size="small">
                      <Typography>Selected Employees</Typography>
                      <div
                        id="paste-box" // Add an ID to the Box
                        tabIndex={0} // Make the div focusable
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '3.75px',
                          height: '110px',
                          overflow: 'auto',
                        }}
                        onPaste={handlePasteForEmp}
                        onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                        onBlur={(e) => {
                          if (isBoxFocused) {
                            e.target.focus(); // Refocus only if the Box was previously focused
                          }
                        }}
                      >
                        {valueEmp.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            clickable
                            sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                            onDelete={(e) => handleDelete(e, value)}
                            onClick={() => console.log("clicked chip")}
                          />
                        ))}
                      </div>
                    </FormControl>
                  </Grid>
                }
                <Grid item md={3} xs={12} sm={6} mt={3}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      onClick={handleFilter}
                      loading={filterLoader}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Filter
                    </LoadingButton>

                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleClearFilter}
                    >
                      Clear
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lshiftlog") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Shift Log</Typography>
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
                    <MenuItem value={boardinglogs?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelshiftlog") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchBoardinglognew();
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvshiftlog") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          fetchBoardinglognew();
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printshiftlog") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfshiftlog") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                          fetchBoardinglognew();
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageshiftlog") && (
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
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={boardinglogs}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={boardinglogs}
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
            <br />
            <br />
            {tableLoader ? (
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
                  // totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={boardinglogs}
                />
              </>
            )}
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
          maxWidth="lg"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
            marginTop: "50px"
          }}
        >
          <Box sx={{ overflow: "auto", padding: "20px" }}>
            <>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <Typography sx={userStyle.HeaderText}>
                    Shift Log Change
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Employee Name : <b>{boardinglogEdit.companyname}</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <Typography>
                    Company : <b>{boardingLog.company}</b>
                  </Typography>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Typography>
                    Branch : <b>{boardingLog.branch}</b>
                  </Typography>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Typography>
                    Unit : <b>{boardingLog.unit}</b>
                  </Typography>
                </Grid>
                <Grid item md={2} xs={12} sm={6}>
                  <Typography>
                    Team : <b>{boardingLog.team}</b>
                  </Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Attendance Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={attModeOptions}
                      value={selectedAttMode}
                      onChange={(e) => { handleAttModeChange(e); }}
                      valueRenderer={customValueRendererAttMode}
                      labelledBy="Please Select Attendance Mode"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>Start Date<b style={{ color: "red" }}>*</b></Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={boardingLog.startdate}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          startdate: e.target.value,
                        });
                      }}
                      inputProps={{
                        min: boardingLog?.prevstartdate || boardingLog?.doj, // Set the minimum date to today
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>
                    Shift Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={ShiftTypeOptions}
                      label="Please Select Shift Type"
                      value={{
                        label: boardingLog.shifttype,
                        value: boardingLog.shifttype,
                      }}
                      onChange={(e) => {
                        setBoardingLog({
                          ...boardingLog,
                          shifttype: e.value,
                          shiftgrouping: "Please Select Shift Grouping",
                          shifttiming: "Please Select Shift",
                        });
                        // handleAddTodo(e.value);
                        setTodo([]);
                        setShifts([])
                        setSelectedOptionsCate([]);
                        setValueCate([]);
                        setValueCateWeeks([]);
                        setSelectedOptionsCateWeeks([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                {boardingLog.shifttype === "Standard" ? (
                  <>
                    <Grid item md={4} sm={6} xs={12}>
                      <Typography>
                        Shift Grouping<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          options={ShiftGroupingOptions}
                          label="Please Select Shift Group"
                          value={{
                            label:
                              boardingLog.shiftgrouping === "" ||
                                boardingLog.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingLog.shiftgrouping,
                            value:
                              boardingLog.shiftgrouping === "" ||
                                boardingLog.shiftgrouping === undefined
                                ? "Please Select Shift Grouping"
                                : boardingLog.shiftgrouping,
                          }}
                          onChange={(e) => {
                            setBoardingLog({
                              ...boardingLog,
                              shiftgrouping: e.value,
                              shifttiming: "Please Select Shift",
                            });
                            ShiftDropdwonsSecond(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                      <Typography>
                        Shift<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          size="small"
                          options={shifts}
                          styles={colourStyles}
                          value={{
                            label:
                              boardingLog.shifttiming === "" ||
                                boardingLog.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingLog.shifttiming,
                            value:
                              boardingLog.shifttiming === "" ||
                                boardingLog.shifttiming === undefined
                                ? "Please Select Shift"
                                : boardingLog.shifttiming,
                          }}
                          onChange={(e) => {
                            setBoardingLog({
                              ...boardingLog,
                              shifttiming: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Week Off</Typography>
                        <MultiSelect
                          size="small"
                          options={weekdays}
                          value={selectedOptionsCate}
                          onChange={handleCategoryChange}
                          valueRenderer={customValueRendererCate}
                          labelledBy="Please Select Days"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : null}

                <Grid item md={12} sm={12} xs={12}>
                  {boardingLog.shifttype === "Daily" ? (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={3.5} sm={6} xs={12}>
                          <Typography>
                            Shift Grouping<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              options={ShiftGroupingOptions}
                              label="Please Select Shift Group"
                              value={{
                                label:
                                  boardingLog.shiftgrouping === "" ||
                                    boardingLog.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : boardingLog.shiftgrouping,
                                value:
                                  boardingLog.shiftgrouping === "" ||
                                    boardingLog.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : boardingLog.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setBoardingLog({
                                  ...boardingLog,
                                  shiftgrouping: e.value,
                                  shifttiming: "Please Select Shift",
                                });
                                ShiftDropdwonsSecond(e.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3.5} sm={6} xs={12}>
                          <Typography>
                            Shift<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              size="small"
                              options={shifts}
                              styles={colourStyles}
                              value={{
                                label:
                                  boardingLog.shifttiming === "" ||
                                    boardingLog.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : boardingLog.shifttiming,
                                value:
                                  boardingLog.shifttiming === "" ||
                                    boardingLog.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : boardingLog.shifttiming,
                              }}
                              onChange={(e) => {
                                setBoardingLog({
                                  ...boardingLog,
                                  shifttiming: e.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          md={3.5}
                          sm={6}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>
                              Week Off<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              size="small"
                              options={weekdays}
                              value={selectedOptionsCate}
                              onChange={handleCategoryChange}
                              valueRenderer={customValueRendererCate}
                              labelledBy="Please Select Days"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={1} sm={12} xs={12}>
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                              color: "white",
                              background: "rgb(25, 118, 210)",
                              marginTop: "25px",
                            }}
                            onClick={handleAddTodo}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        </Grid>
                      </Grid>
                      <br />
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Shift Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Shift Grouping<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2.5} sm={12} xs={12}>
                            <Typography>
                              Shift<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo?.length > 0 &&
                        todo.map((todo, index) => (
                          <div key={index}>
                            {editingIndexcheck === index ? (
                              <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.day}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.week}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftModeOptions}
                                      value={{
                                        label: todo.shiftmode,
                                        value: todo.shiftmode,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftmode",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                {todo.shiftmode === "Shift" ?
                                  <>
                                    <Grid item md={2} sm={4} xs={4}>
                                      <FormControl fullWidth size="small">
                                        <Selects
                                          size="small"
                                          options={ShiftGroupingOptions}
                                          value={{
                                            label: todo.shiftgrouping,
                                            value: todo.shiftgrouping,
                                          }}
                                          onChange={(selectedOption) =>
                                            multiInputs(
                                              index,
                                              "shiftgrouping",
                                              selectedOption.value
                                            )
                                          }
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={2.5} sm={4} xs={4}>
                                      <FormControl fullWidth size="small">
                                        <AsyncShiftTimingSelects
                                          todo={todo}
                                          index={index}
                                          auth={auth}
                                          multiInputs={multiInputs}
                                          colourStyles={colourStyles}
                                        />
                                      </FormControl>
                                    </Grid> </> : <>
                                    <Grid item md={2} sm={4} xs={4}></Grid>
                                    <Grid item md={2.5} sm={4} xs={4}></Grid>
                                  </>}
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  {(todo.shiftmode === "Shift" && (todo.shiftgrouping === "Please Select Shift Grouping" || todo.shifttiming === "Please Select Shift")) ? null :
                                    <Button onClick={handleUpdateTodocheck}>
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#216d21",
                                        }}
                                      />
                                    </Button>
                                  }
                                </Grid>
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Cancel button */}
                                  <Button onClick={handleCancelEdit}>
                                    <CancelIcon
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.day}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.week}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.shiftmode}
                                  </Typography>
                                </Grid>
                                {todo.shiftmode === "Shift" ? <>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {todo.shiftgrouping ===
                                        "Please Select Shift Grouping"
                                        ? ""
                                        : todo.shiftgrouping}
                                    </Typography>
                                  </Grid>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {todo.shifttiming === "Please Select Shift"
                                        ? ""
                                        : todo.shifttiming}
                                    </Typography>
                                  </Grid>
                                </> : <>
                                  <Grid item md={2} sm={6} xs={12}></Grid>
                                  <Grid item md={2} sm={6} xs={12}></Grid>
                                </>}

                                <Grid item md={1} sm={6} xs={6}>
                                  {/* Edit button */}
                                  <Button
                                    onClick={() => handleEditTodocheck(index)}
                                  >
                                    <FaEdit
                                      style={{
                                        color: "#1976d2",
                                        fontSize: "1.2rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                            <br />
                          </div>
                        ))}
                    </>
                  ) : null}

                  {boardingLog.shifttype === "1 Week Rotation" ? (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={3.5} sm={6} xs={12}>
                          <Typography>
                            Shift Grouping<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              options={ShiftGroupingOptions}
                              label="Please Select Shift Group"
                              value={{
                                label:
                                  boardingLog.shiftgrouping === "" ||
                                    boardingLog.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : boardingLog.shiftgrouping,
                                value:
                                  boardingLog.shiftgrouping === "" ||
                                    boardingLog.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : boardingLog.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setBoardingLog({
                                  ...boardingLog,
                                  shiftgrouping: e.value,
                                  shifttiming: "Please Select Shift",
                                });
                                ShiftDropdwonsSecond(e.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3.5} sm={6} xs={12}>
                          <Typography>
                            Shift<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              size="small"
                              options={shifts}
                              styles={colourStyles}
                              value={{
                                label:
                                  boardingLog.shifttiming === "" ||
                                    boardingLog.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : boardingLog.shifttiming,
                                value:
                                  boardingLog.shifttiming === "" ||
                                    boardingLog.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : boardingLog.shifttiming,
                              }}
                              onChange={(e) => {
                                setBoardingLog({
                                  ...boardingLog,
                                  shifttiming: e.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Weeks <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              size="small"
                              options={weekoptions2weeks
                                ?.filter(
                                  (item) =>
                                    !todo?.some((val) => val?.week === item)
                                )
                                ?.map((data) => ({
                                  label: data,
                                  value: data,
                                }))}
                              value={selectedOptionsCateWeeks}
                              onChange={handleWeeksChange}
                              valueRenderer={customValueRendererCateWeeks}
                              labelledBy="Please Select Weeks"
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>
                              Week Off<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              size="small"
                              options={weekdays}
                              value={selectedOptionsCate}
                              onChange={handleCategoryChange}
                              valueRenderer={customValueRendererCate}
                              labelledBy="Please Select Days"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={1} sm={12} xs={12}>
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                              color: "white",
                              background: "rgb(25, 118, 210)",
                              marginTop: "25px",
                            }}
                            onClick={handleAddTodo}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        </Grid>
                      </Grid>
                      <br />
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Shift Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Shift Grouping<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2.5} sm={12} xs={12}>
                            <Typography>
                              Shift<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo?.length > 0 &&
                        todo.map((todo, index) => (
                          <div key={index}>
                            {editingIndexcheck === index ? (
                              <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.day}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.week}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftModeOptions}
                                      value={{
                                        label: todo.shiftmode,
                                        value: todo.shiftmode,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftmode",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                {todo.shiftmode === "Shift" ? <>
                                  <Grid item md={2} sm={4} xs={4}>
                                    <FormControl fullWidth size="small">
                                      <Selects
                                        size="small"
                                        options={ShiftGroupingOptions}
                                        value={{
                                          label: todo.shiftgrouping,
                                          value: todo.shiftgrouping,
                                        }}
                                        onChange={(selectedOption) =>
                                          multiInputs(
                                            index,
                                            "shiftgrouping",
                                            selectedOption.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2.5} sm={4} xs={4}>
                                    <FormControl fullWidth size="small">
                                      <AsyncShiftTimingSelects
                                        todo={todo}
                                        index={index}
                                        auth={auth}
                                        multiInputs={multiInputs}
                                        colourStyles={colourStyles}
                                      />
                                    </FormControl>
                                  </Grid>
                                </> : <>
                                  <Grid item md={2} sm={4} xs={4}></Grid>
                                  <Grid item md={2.5} sm={4} xs={4}></Grid>
                                </>}

                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  {(todo.shiftmode === "Shift" && (todo.shiftgrouping === "Please Select Shift Grouping" || todo.shifttiming === "Please Select Shift")) ? null :
                                    <Button onClick={handleUpdateTodocheck}>
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#216d21",
                                        }}
                                      />
                                    </Button>
                                  }
                                </Grid>
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Cancel button */}
                                  <Button onClick={handleCancelEdit}>
                                    <CancelIcon
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.day}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.week}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.shiftmode}
                                  </Typography>
                                </Grid>
                                {todo.shiftmode === "Shift" ? <>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {todo.shiftgrouping ===
                                        "Please Select Shift Grouping"
                                        ? ""
                                        : todo.shiftgrouping}
                                    </Typography>
                                  </Grid>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {todo.shifttiming === "Please Select Shift"
                                        ? ""
                                        : todo.shifttiming}
                                    </Typography>
                                  </Grid>
                                </> : <>
                                  <Grid item md={2} sm={6} xs={12}></Grid>
                                  <Grid item md={2} sm={6} xs={12}></Grid>
                                </>}
                                <Grid item md={1} sm={6} xs={6}>
                                  {/* Edit button */}
                                  <Button
                                    onClick={() => handleEditTodocheck(index)}
                                  >
                                    <FaEdit
                                      style={{
                                        color: "#1976d2",
                                        fontSize: "1.2rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                            <br />
                          </div>
                        ))}
                    </>
                  ) : null}

                  {boardingLog.shifttype === "2 Week Rotation" ? (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={3.5} sm={6} xs={12}>
                          <Typography>
                            Shift Grouping<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              options={ShiftGroupingOptions}
                              label="Please Select Shift Group"
                              value={{
                                label:
                                  boardingLog.shiftgrouping === "" ||
                                    boardingLog.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : boardingLog.shiftgrouping,
                                value:
                                  boardingLog.shiftgrouping === "" ||
                                    boardingLog.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : boardingLog.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setBoardingLog({
                                  ...boardingLog,
                                  shiftgrouping: e.value,
                                  shifttiming: "Please Select Shift",
                                });
                                ShiftDropdwonsSecond(e.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3.5} sm={6} xs={12}>
                          <Typography>
                            Shift<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              size="small"
                              options={shifts}
                              styles={colourStyles}
                              value={{
                                label:
                                  boardingLog.shifttiming === "" ||
                                    boardingLog.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : boardingLog.shifttiming,
                                value:
                                  boardingLog.shifttiming === "" ||
                                    boardingLog.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : boardingLog.shifttiming,
                              }}
                              onChange={(e) => {
                                setBoardingLog({
                                  ...boardingLog,
                                  shifttiming: e.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Weeks <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              size="small"
                              options={weekoptions1month
                                ?.filter(
                                  (item) =>
                                    !todo?.some((val) => val?.week === item)
                                )
                                ?.map((data) => ({
                                  label: data,
                                  value: data,
                                }))}
                              value={selectedOptionsCateWeeks}
                              onChange={handleWeeksChange}
                              valueRenderer={customValueRendererCateWeeks}
                              labelledBy="Please Select Weeks"
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>
                              Week Off<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              size="small"
                              options={weekdays}
                              value={selectedOptionsCate}
                              onChange={handleCategoryChange}
                              valueRenderer={customValueRendererCate}
                              labelledBy="Please Select Days"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={1} sm={12} xs={12}>
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                              color: "white",
                              background: "rgb(25, 118, 210)",
                              marginTop: "25px",
                            }}
                            onClick={handleAddTodo}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        </Grid>
                      </Grid>
                      <br />
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Shift Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Shift Grouping<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2.5} sm={12} xs={12}>
                            <Typography>
                              Shift<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo?.length > 0 &&
                        todo.map((todo, index) => (
                          <div key={index}>
                            {editingIndexcheck === index ? (
                              <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.day}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.week}
                                  </Typography>
                                </Grid>

                                <Grid item md={2} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftModeOptions}
                                      value={{
                                        label: todo.shiftmode,
                                        value: todo.shiftmode,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftmode",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                {todo.shiftmode === "Shift" ? <>
                                  <Grid item md={2} sm={4} xs={4}>
                                    <FormControl fullWidth size="small">
                                      <Selects
                                        size="small"
                                        options={ShiftGroupingOptions}
                                        value={{
                                          label: todo.shiftgrouping,
                                          value: todo.shiftgrouping,
                                        }}
                                        onChange={(selectedOption) =>
                                          multiInputs(
                                            index,
                                            "shiftgrouping",
                                            selectedOption.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2.5} sm={4} xs={4}>
                                    <FormControl fullWidth size="small">
                                      <AsyncShiftTimingSelects
                                        todo={todo}
                                        index={index}
                                        auth={auth}
                                        multiInputs={multiInputs}
                                        colourStyles={colourStyles}
                                      />
                                    </FormControl>
                                  </Grid>
                                </> : <>
                                  <Grid item md={2} sm={4} xs={4}></Grid>
                                  <Grid item md={2.5} sm={4} xs={4}></Grid>
                                </>}
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  {(todo.shiftmode === "Shift" && (todo.shiftgrouping === "Please Select Shift Grouping" || todo.shifttiming === "Please Select Shift")) ? null :
                                    <Button onClick={handleUpdateTodocheck}>
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#216d21",
                                        }}
                                      />
                                    </Button>
                                  }
                                </Grid>
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Cancel button */}
                                  <Button onClick={handleCancelEdit}>
                                    <CancelIcon
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.day}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.week}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.shiftmode}
                                  </Typography>
                                </Grid>
                                {todo.shiftmode === "Shift" ? <>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {todo.shiftgrouping ===
                                        "Please Select Shift Grouping"
                                        ? ""
                                        : todo.shiftgrouping}
                                    </Typography>
                                  </Grid>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {todo.shifttiming === "Please Select Shift"
                                        ? ""
                                        : todo.shifttiming}
                                    </Typography>
                                  </Grid>
                                </> : <>
                                  <Grid item md={2} sm={6} xs={12}></Grid>
                                  <Grid item md={2} sm={6} xs={12}></Grid>
                                </>}
                                <Grid item md={1} sm={6} xs={6}>
                                  {/* Edit button */}
                                  <Button
                                    onClick={() => handleEditTodocheck(index)}
                                  >
                                    <FaEdit
                                      style={{
                                        color: "#1976d2",
                                        fontSize: "1.2rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                            <br />
                          </div>
                        ))}
                    </>
                  ) : null}

                  {boardingLog.shifttype === "1 Month Rotation" ? (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={3.5} sm={6} xs={12}>
                          <Typography>
                            Shift Grouping<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              options={ShiftGroupingOptions}
                              label="Please Select Shift Group"
                              value={{
                                label:
                                  boardingLog.shiftgrouping === "" ||
                                    boardingLog.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : boardingLog.shiftgrouping,
                                value:
                                  boardingLog.shiftgrouping === "" ||
                                    boardingLog.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : boardingLog.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setBoardingLog({
                                  ...boardingLog,
                                  shiftgrouping: e.value,
                                  shifttiming: "Please Select Shift",
                                });
                                ShiftDropdwonsSecond(e.value);
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3.5} sm={6} xs={12}>
                          <Typography>
                            Shift<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Selects
                              size="small"
                              options={shifts}
                              styles={colourStyles}
                              value={{
                                label:
                                  boardingLog.shifttiming === "" ||
                                    boardingLog.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : boardingLog.shifttiming,
                                value:
                                  boardingLog.shifttiming === "" ||
                                    boardingLog.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : boardingLog.shifttiming,
                              }}
                              onChange={(e) => {
                                setBoardingLog({
                                  ...boardingLog,
                                  shifttiming: e.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Weeks <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              size="small"
                              options={weekoptions2months
                                ?.filter(
                                  (item) =>
                                    !todo?.some((val) => val?.week === item)
                                )
                                ?.map((data) => ({
                                  label: data,
                                  value: data,
                                }))}
                              value={selectedOptionsCateWeeks}
                              onChange={handleWeeksChange}
                              valueRenderer={customValueRendererCateWeeks}
                              labelledBy="Please Select Weeks"
                            />
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{ display: "flex" }}
                        >
                          <FormControl fullWidth size="small">
                            <Typography>
                              Week Off<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <MultiSelect
                              size="small"
                              options={weekdays}
                              value={selectedOptionsCate}
                              onChange={handleCategoryChange}
                              valueRenderer={customValueRendererCate}
                              labelledBy="Please Select Days"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={1} sm={12} xs={12}>
                          <Button
                            variant="contained"
                            style={{
                              height: "30px",
                              minWidth: "20px",
                              padding: "19px 13px",
                              color: "white",
                              background: "rgb(25, 118, 210)",
                              marginTop: "25px",
                            }}
                            onClick={handleAddTodo}
                          >
                            <FaPlus style={{ fontSize: "15px" }} />
                          </Button>
                        </Grid>
                      </Grid>
                      <br />
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Shift Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2} sm={12} xs={12}>
                            <Typography>
                              Shift Grouping<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={2.5} sm={12} xs={12}>
                            <Typography>
                              Shift<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo?.length > 0 &&
                        todo.map((todo, index) => (
                          <div key={index}>
                            {editingIndexcheck === index ? (
                              <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.day}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.week}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={4} xs={4}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftModeOptions}
                                      value={{
                                        label: todo.shiftmode,
                                        value: todo.shiftmode,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftmode",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                {todo.shiftmode === "Shift" ? <>
                                  <Grid item md={2} sm={4} xs={4}>
                                    <FormControl fullWidth size="small">
                                      <Selects
                                        size="small"
                                        options={ShiftGroupingOptions}
                                        value={{
                                          label: todo.shiftgrouping,
                                          value: todo.shiftgrouping,
                                        }}
                                        onChange={(selectedOption) =>
                                          multiInputs(
                                            index,
                                            "shiftgrouping",
                                            selectedOption.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={2.5} sm={4} xs={4}>
                                    <FormControl fullWidth size="small">
                                      <AsyncShiftTimingSelects
                                        todo={todo}
                                        index={index}
                                        auth={auth}
                                        multiInputs={multiInputs}
                                        colourStyles={colourStyles}
                                      />
                                    </FormControl>
                                  </Grid>
                                </> : <>
                                  <Grid item md={2} sm={4} xs={4}></Grid>
                                  <Grid item md={2.5} sm={4} xs={4}></Grid>
                                </>}
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  {(todo.shiftmode === "Shift" && (todo.shiftgrouping === "Please Select Shift Grouping" || todo.shifttiming === "Please Select Shift")) ? null :
                                    <Button onClick={handleUpdateTodocheck}>
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#216d21",
                                        }}
                                      />
                                    </Button>
                                  }
                                </Grid>
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Cancel button */}
                                  <Button onClick={handleCancelEdit}>
                                    <CancelIcon
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "red",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={1}>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.day}
                                  </Typography>
                                </Grid>
                                <Grid item md={1.5} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.week}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.shiftmode}
                                  </Typography>
                                </Grid>
                                {todo.shiftmode === "Shift" ? <>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {todo.shiftgrouping ===
                                        "Please Select Shift Grouping"
                                        ? ""
                                        : todo.shiftgrouping}
                                    </Typography>
                                  </Grid>
                                  <Grid item md={2} sm={6} xs={12}>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {todo.shifttiming === "Please Select Shift"
                                        ? ""
                                        : todo.shifttiming}
                                    </Typography>
                                  </Grid>
                                </> : <>
                                  <Grid item md={2} sm={6} xs={12}></Grid>
                                  <Grid item md={2} sm={6} xs={12}></Grid>
                                </>}
                                <Grid item md={1} sm={6} xs={6}>
                                  {/* Edit button */}
                                  <Button
                                    onClick={() => handleEditTodocheck(index)}
                                  >
                                    <FaEdit
                                      style={{
                                        color: "#1976d2",
                                        fontSize: "1.2rem",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            )}
                            <br />
                          </div>
                        ))}
                    </>
                  ) : null}

                  {/* {boardingLog.shifttype === "1 Week Rotation" ? (
                    <>
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift Grouping<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo &&
                        todo?.map((todo, index) => (
                          <Grid container spacing={2} key={index}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.day}</Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.week}</Typography>
                            </Grid>
                            <Grid
                              item
                              md={3}
                              sm={6}
                              xs={12}
                              sx={{ display: "flex" }}
                            >
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftModeOptions}
                                  value={{
                                    label: todo.shiftmode,
                                    value: todo.shiftmode,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftmode",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Week Off" ? (
                              <Grid item md={6} sm={6} xs={12}></Grid>
                            ) : (
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftGroupingOptions}
                                      value={{
                                        label: todo.shiftgrouping,
                                        value: todo.shiftgrouping,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftgrouping",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={6} sm={6}>
                                  <FormControl fullWidth size="small">
                                    <AsyncShiftTimingSelects
                                      todo={todo}
                                      index={index}
                                      auth={auth}
                                      multiInputs={multiInputs}
                                      colourStyles={colourStyles}
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {boardingLog.shifttype === "2 Week Rotation" ? (
                    <>
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift Grouping<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo &&
                        todo?.map((todo, index) => (
                          <Grid container spacing={2} key={index}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.day}</Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.week}</Typography>
                            </Grid>
                            <Grid
                              item
                              md={3}
                              sm={6}
                              xs={12}
                              sx={{ display: "flex" }}
                            >
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftModeOptions}
                                  value={{
                                    label: todo.shiftmode,
                                    value: todo.shiftmode,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftmode",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Week Off" ? (
                              <Grid item md={6} sm={6} xs={12}></Grid>
                            ) : (
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftGroupingOptions}
                                      value={{
                                        label: todo.shiftgrouping,
                                        value: todo.shiftgrouping,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftgrouping",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={6} sm={6}>
                                  <FormControl fullWidth size="small">
                                    <AsyncShiftTimingSelects
                                      todo={todo}
                                      index={index}
                                      auth={auth}
                                      multiInputs={multiInputs}
                                      colourStyles={colourStyles}
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {boardingLog.shifttype === "1 Month Rotation" ? (
                    <>
                      {todo.length > 0 ? (
                        <Grid container spacing={2}>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Day</Typography>
                          </Grid>
                          <Grid item md={1.5} sm={12} xs={12}>
                            <Typography>Week</Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift Mode<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift Grouping<b style={{ color: "red" }}>*</b>
                            </Typography>
                          </Grid>
                          <Grid item md={3} sm={12} xs={12}>
                            <Typography>
                              Shift<b style={{ color: "red" }}>*</b>{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : null}
                      {todo &&
                        todo?.map((todo, index) => (
                          <Grid container spacing={2} key={index}>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.day}</Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.week}</Typography>
                            </Grid>
                            <Grid
                              item
                              md={3}
                              sm={6}
                              xs={12}
                              sx={{ display: "flex" }}
                            >
                              <FormControl fullWidth size="small">
                                <Selects
                                  size="small"
                                  options={ShiftModeOptions}
                                  value={{
                                    label: todo.shiftmode,
                                    value: todo.shiftmode,
                                  }}
                                  onChange={(selectedOption) =>
                                    multiInputs(
                                      index,
                                      "shiftmode",
                                      selectedOption.value
                                    )
                                  }
                                />
                              </FormControl>
                            </Grid>
                            {todo.shiftmode === "Week Off" ? (
                              <Grid item md={6} sm={6} xs={12}></Grid>
                            ) : (
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <FormControl fullWidth size="small">
                                    <Selects
                                      size="small"
                                      options={ShiftGroupingOptions}
                                      value={{
                                        label: todo.shiftgrouping,
                                        value: todo.shiftgrouping,
                                      }}
                                      onChange={(selectedOption) =>
                                        multiInputs(
                                          index,
                                          "shiftgrouping",
                                          selectedOption.value
                                        )
                                      }
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={3} xs={6} sm={6}>
                                  <FormControl fullWidth size="small">
                                    <AsyncShiftTimingSelects
                                      todo={todo}
                                      index={index}
                                      auth={auth}
                                      multiInputs={multiInputs}
                                      colourStyles={colourStyles}
                                    />
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null} */}
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  {showButton ? (
                    <Button
                      variant="contained"
                      onClick={editSubmit}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Update
                    </Button>
                  ) : null}
                  &emsp;
                  <Button
                    sx={buttonStyles.btncancel}
                    onClick={handleCloseModEdit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
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
        itemsTwo={boardinglogs ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Shift Log Info"
        addedby={addedby}
        updateby={updateby}
      />

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default ShiftLogChange;
