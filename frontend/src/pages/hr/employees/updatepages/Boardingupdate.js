import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
  Chip
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
import * as XLSX from "xlsx";
import AggregatedSearchBar from "../../../../components/AggregatedSearchBar";
import AggridTable from "../../../../components/AggridTable";
import AlertDialog from "../../../../components/Alert";
import { handleApiError } from "../../../../components/Errorhandling";
import ExportData from "../../../../components/ExportData";
import Headtitle from "../../../../components/Headtitle";
import MessageAlert from "../../../../components/MessageAlert";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import {
  AuthContext,
  UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";
import domtoimage from "dom-to-image";

function Boardingupdate() {
  const [oldUserCompanyname, setOldUserCompanyname] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [overallItems, setOverallItems] = useState([]);

  let exportColumnNames = [
    "Emp Code",
    "Employee Name",
    "Branch",
    "Floor",
    "Department",
    "Area",
    "Workstation",
    "Team",
    "Designation",
    "Shifttiming",
    "Workmode",
    "Reportingto",
  ];
  let exportRowValues = [
    "empcode",
    "companyname",
    "branch",
    "floor",
    "department",
    "area",
    "workstation",
    "team",
    "designation",
    "shifttiming",
    "workmode",
    "reportingto",
  ];

  const [isHandleChange, setIsHandleChange] = useState(false);
  const [searchedString, setSearchedString] = useState("");

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
  const [employees, setEmployees] = useState([]);
  const [unitNames, setUnitNames] = useState([]);
  const [floorNames, setFloorNames] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [department, setDepartment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [team, setTeam] = useState();
  const [designation, setDesignation] = useState();
  const [designationDataGroup, setDesignationDataGroup] = useState([]);
  const [designationGroup, setDesignationGroup] = useState("");
  const [shifttiming, setShiftTiming] = useState();
  const [reporting, setReporting] = useState();
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
  const [enableWorkstation, setEnableWorkstation] = useState(false);
  const [users, setUsers] = useState([]);
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    allUsersData,
    allTeam,
    isAssignBranch,
    pageName,
    setPageName,
    alldesignation,
    buttonStyles,
    workStationSystemName,
    allUsersLimit
  } = useContext(UserRoleAccessContext);

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
      pagename: String("Boarding Update"),
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

  const handleBranchChangeNew = (event) => {
    const selectedBranch = event.value;
    setSelectedBranch(selectedBranch);
    setSelectedUnit("");
    setSelectedTeam("");
    setSelectedWorkStation("");
    setEmpaddform({
      ...empaddform,
      floor: "Please Select Floor",
      area: "Please Select Area",
    });
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);
  };

  const handleUnitChangeNew = (event) => {
    const selectedUnit = event.value;
    setSelectedUnit(selectedUnit);
    setSelectedTeam("");
    setSelectedWorkStation("");
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);

    const filteredTeams = team?.filter(
      (t) => t.unit === event.value && t.branch === selectedBranch
    );

    setFilteredTeams(filteredTeams);

    setTeamOptions(
      filteredTeams?.map((item) => ({
        label: item.teamname,
        value: item.teamname,
      }))
    );
  };

  const handleTeamChangeNew = (event) => {
    const selectedTeam = event.value;
    fetchUsernames(selectedTeam, "new", oldUserCompanyname);
    setSelectedTeam(selectedTeam);
    checkHierarchyName(selectedTeam, "Team");
  };

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
          data?.subsubpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
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

  const [filterState, setFilterState] = useState({
    type: "Individual",
    employeestatus: "Please Select Employee Status",
  });
  const TypeOptions = [
    { label: "Individual", value: "Individual" },
    { label: "Department", value: "Department" },
    { label: "Company", value: "Company" },
    { label: "Branch", value: "Branch" },
    { label: "Unit", value: "Unit" },
    { label: "Team", value: "Team" },
  ];
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const fetchDepartmentsNew = async () => {
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
  useEffect(() => {
    fetchDepartmentsNew();
  }, []);

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

  const [hierarchyall, setHierarchyall] = useState([]);
  const [designationsName, setDesignationsName] = useState([]);
  const [superVisorChoosen, setSuperVisorChoosen] = useState(
    "Please Select Supervisor"
  );
  const [changeToDesign, setChangeToDesign] = useState(
    "Please Select New/Replace"
  );
  // week off details
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");
  const fetchAllHierarchy = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.HIRERARCHI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setHierarchyall(res?.data?.hirerarchi);
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
    fetchAllHierarchy();
  }, []);

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [maxSelections, setMaxSelections] = useState("");

  const [modeInt, setModeInt] = useState("");
  const [internCourseNames, setInternCourseNames] = useState();
  const { auth, setAuth } = useContext(AuthContext);
  const [getrowid, setRowGetid] = useState([]);
  const [repotingtonames, setrepotingtonames] = useState([]);

  const [getingOlddatas, setGettingOldDatas] = useState([]);
  const [empaddform, setEmpaddform] = useState({
    ifoffice: false,
    branch: "",
    floor: "",
    department: "",
    company: "",
    unit: "",
    team: "",
    designation: "",
    shiftgrouping: "",
    shifttiming: "",
    reportingto: "",
    workmode: "Please Select Work Mode",
  });

  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");
  const [workStationInputOldDatas, setWorkStationInputOldDatas] = useState({});

  // SELECT DROPDOWN STYLES
  const colourStyles = {
    menuList: (styles) => ({
      ...styles,
      background: "white",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      // color:'black',
      color: isFocused
        ? "rgb(255 255 255, 0.5)"
        : isSelected
          ? "white"
          : "black",
      background: isFocused
        ? "rgb(25 118 210, 0.7)"
        : isSelected
          ? "rgb(25 118 210, 0.5)"
          : null,
      zIndex: 1,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const [finderrorindex, setFinderrorindex] = useState([]);
  const [finderrorindexgrp, setFinderrorindexgrp] = useState([]);
  const [finderrorindexshift, setFinderrorindexshift] = useState([]);

  const ShiftModeOptions = [
    { label: "Shift", value: "Shift" },
    { label: "Week Off", value: "Week Off" },
  ];

  const ShiftTypeOptions = [
    { label: "Standard", value: "Standard" },
    { label: "Daily", value: "Daily" },
    { label: "1 Week Rotation (2 Weeks)", value: "1 Week Rotation" },
    { label: "2 Week Rotation (Monthly)", value: "2 Week Rotation" },
    { label: "1 Month Rotation (2 Month)", value: "1 Month Rotation" },
  ];

  const workmodeOptions = [
    { label: "Remote", value: "Remote" },
    { label: "Office", value: "Office" },
  ];

  const [todo, setTodo] = useState([]);
  const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
  const [editTodoBackup, setEditTodoBackup] = useState(null);

  // const handleAddTodo = (value) => {
  //   if (value === "Daily") {
  //     const days = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const week = "1st Week";
  //     const newTodoList = days?.map((day, index) => ({
  //       day,
  //       daycount: index + 1,
  //       week,
  //       shiftmode: "Please Select Shift Mode",
  //       shiftgrouping: "Please Select Shift Grouping",
  //       shifttiming: "Please Select Shift",
  //     }));
  //     setTodo(newTodoList);
  //   }

  //   if (value === "1 Week Rotation") {
  //     const days1 = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const days2 = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const week1 = "1st Week";
  //     const week2 = "2nd Week";
  //     const newTodoList = [
  //       ...days1?.map((day, index) => ({
  //         day,
  //         daycount: index + 1,
  //         week: week1,
  //         shiftmode: "Please Select Shift Mode",
  //         shiftgrouping: "Please Select Shift Grouping",
  //         shifttiming: "Please Select Shift",
  //       })),
  //       ...days2?.map((day, index) => ({
  //         day,
  //         daycount: index + 8,
  //         week: week2,
  //         shiftmode: "Please Select Shift Mode",
  //         shiftgrouping: "Please Select Shift Grouping",
  //         shifttiming: "Please Select Shift",
  //       })),
  //     ];
  //     setTodo(newTodoList);
  //   }

  //   if (value === "2 Week Rotation") {
  //     const daysInMonth = 42; // You may need to adjust this based on the actual month
  //     const days = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const weeks = [
  //       "1st Week",
  //       "2nd Week",
  //       "3rd Week",
  //       "4th Week",
  //       "5th Week",
  //       "6th Week",
  //     ]; // You may need to adjust this based on the actual month

  //     let todoList = [];
  //     let currentWeek = 1;
  //     let currentDayCount = 1;
  //     let currentDayIndex = 0;

  //     for (let i = 1; i <= daysInMonth; i++) {
  //       const day = days[currentDayIndex];
  //       const week = weeks[currentWeek - 1];

  //       todoList.push({
  //         day,
  //         daycount: currentDayCount,
  //         week,
  //         shiftmode: "Please Select Shift Mode",
  //         shiftgrouping: "Please Select Shift Grouping",
  //         shifttiming: "Please Select Shift",
  //       });

  //       currentDayIndex = (currentDayIndex + 1) % 7;
  //       currentDayCount++;
  //       if (currentDayIndex === 0) {
  //         currentWeek++;
  //       }
  //     }

  //     setTodo(todoList);
  //   }

  //   if (value === "1 Month Rotation") {
  //     const daysInMonth = 84; // You may need to adjust this based on the actual month
  //     const days = [
  //       "Monday",
  //       "Tuesday",
  //       "Wednesday",
  //       "Thursday",
  //       "Friday",
  //       "Saturday",
  //       "Sunday",
  //     ];
  //     const weeks = [
  //       "1st Week",
  //       "2nd Week",
  //       "3rd Week",
  //       "4th Week",
  //       "5th Week",
  //       "6th Week",
  //       "7th Week",
  //       "8th Week",
  //       "9th Week",
  //       "10th Week",
  //       "11th Week",
  //       "12th Week",
  //     ]; // You may need to adjust this based on the actual month

  //     let todoList = [];
  //     let currentWeek = 1;
  //     let currentDayCount = 1;
  //     let currentDayIndex = 0;

  //     for (let i = 1; i <= daysInMonth; i++) {
  //       const day = days[currentDayIndex];
  //       const week = weeks[currentWeek - 1];

  //       todoList.push({
  //         day,
  //         daycount: currentDayCount,
  //         week,
  //         shiftmode: "Please Select Shift Mode",
  //         shiftgrouping: "Please Select Shift Grouping",
  //         shifttiming: "Please Select Shift",
  //       });

  //       currentDayIndex = (currentDayIndex + 1) % 7;
  //       currentDayCount++;
  //       if (currentDayIndex === 0) {
  //         currentWeek++;
  //       }
  //     }

  //     setTodo(todoList);
  //   }
  // };

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
    if (empaddform.shifttype === "Please Select Shift Type") {
      setPopupContentMalert("Please Select Shift Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return; // Stop further processing if validation fails
    } else {
      if (empaddform.shifttype === "Daily") {
        if (empaddform.shiftgrouping === "Please Select Shift Grouping") {
          setPopupContentMalert("Please Select Shift Grouping");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (empaddform.shifttiming === "Please Select Shift") {
          setPopupContentMalert("Please Select Shift");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setPopupContentMalert("Please Select Week Off");
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
              ? empaddform.shiftgrouping
              : "",
            shifttiming: !valueCate.includes(day) ? empaddform.shifttiming : "",
          }));
          setTodo(newTodoList);
        }
      }

      if (empaddform.shifttype === "1 Week Rotation") {
        if (empaddform.shiftgrouping === "Please Select Shift Grouping") {
          setPopupContentMalert("Please Select Shift Grouping");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (empaddform.shifttiming === "Please Select Shift") {
          setPopupContentMalert("Please Select Shift");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setPopupContentMalert("Please Select Weeks");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setPopupContentMalert("Please Select Week Off");
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
                  ? empaddform.shiftgrouping
                  : "",
                shifttiming: !valueCate.includes(day)
                  ? empaddform.shifttiming
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
                  ? empaddform.shiftgrouping
                  : "",
                shifttiming: !valueCate.includes(day)
                  ? empaddform.shifttiming
                  : "",
              }))
              : []), // Return an empty array if "2nd Week" is not in valueCateWeeks
          ];

          setTodo((prev) => [...prev, ...newTodoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }

      if (empaddform.shifttype === "2 Week Rotation") {
        if (empaddform.shiftgrouping === "Please Select Shift Grouping") {
          setPopupContentMalert("Please Select Shift Grouping");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();

          return; // Stop further processing if validation fails
        } else if (empaddform.shifttiming === "Please Select Shift") {
          setPopupContentMalert("Please Select Shift");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setPopupContentMalert("Please Select Weeks");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();

          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setPopupContentMalert("Please Select Week Off");
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
                ? empaddform.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day)
                ? empaddform.shifttiming
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

      if (empaddform.shifttype === "1 Month Rotation") {
        if (empaddform.shiftgrouping === "Please Select Shift Grouping") {
          setPopupContentMalert("Please Select Shift Grouping");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (empaddform.shifttiming === "Please Select Shift") {
          setPopupContentMalert("Please Select Shift");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setPopupContentMalert("Please Select Weeks");
          setPopupSeverityMalert("info");
          handleClickOpenPopupMalert();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setPopupContentMalert("Please Select Week Off");
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
                ? empaddform.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day)
                ? empaddform.shifttiming
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
            ?.map((u) => ({
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

  const [isBoarding, setIsBoarding] = useState(false);

  let username = isUserRoleAccess.username;

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [errorsLog, setErrorsLog] = useState({});

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedUnitCode, setSelectedUnitCode] = useState("");

  useEffect(() => {
    allotWorkStation();
  }, [
    selectedCompany,
    selectedBranch,
    selectedUnit,
    empaddform.workmode,
    empaddform?.ifoffice,
    selectedBranchCode,
    selectedUnitCode,
  ]);

  useEffect(() => {
    const branchCode = branchNames?.filter(
      (item) => item.name === selectedBranch && item.company === selectedCompany
    );
    setSelectedBranchCode(branchCode[0]?.code.slice(0, 2));

    const unitCode = unitNames?.filter((item) => item.name === selectedUnit);
    setSelectedUnitCode(unitCode[0]?.code.slice(0, 2));
  }, [selectedBranch, selectedUnit]);

  const allotWorkStation = async () => {
    setPageName(!pageName);
    try {
      let aggregationPipeline = [
        {
          $match: {
            company: selectedCompany,
            branch: selectedBranch,
            unit: selectedUnit,
            workstationinput: { $regex: "_[0-9]+_" }, // Match workstation codes
          },
        },
        {
          $addFields: {
            workstationNumber: {
              $toInt: {
                $arrayElemAt: [{ $split: ["$workstationinput", "_"] }, 1],
              },
            },
          },
        },
        {
          $sort: { workstationNumber: -1 }, // Get the highest workstation number
        },
        {
          $limit: 1,
        },
      ];

      let req = await axios.post(
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
      let result = req.data.users;

      let lastwscode = result.length > 0 ? result[0].workstationNumber + 1 : 1;
      let formattedWorkstationCode = lastwscode.toString().padStart(2, "0");



      let autoWorkStation = `W${selectedBranchCode
        ?.slice(0, 2)
        ?.toUpperCase()}${selectedUnitCode
          ?.slice(0, 2)
          ?.toUpperCase()}_${formattedWorkstationCode}_${workStationInputOldDatas?.username?.toUpperCase()}`;

      let finalAuto = autoWorkStation?.slice(0, 15);

      if (
        workStationInputOldDatas?.company === selectedCompany &&
        workStationInputOldDatas?.branch === selectedBranch &&
        workStationInputOldDatas?.unit === selectedUnit &&
        workStationInputOldDatas?.workstationinput !== ""
      ) {
        setPrimaryWorkStationInput(
          workStationInputOldDatas?.workstationinput?.slice(0, 15)
        );
        return workStationInputOldDatas?.workstationinput?.slice(0, 15);
      } else {
        setPrimaryWorkStationInput(finalAuto);
        return finalAuto;
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setSelectedOptionsCate([]);
    setValueCate("");
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);
  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };
  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
  };

  const [ShiftOptions, setShiftOptions] = useState([]);
  const [ShiftGroupingOptions, setShiftGroupingOptions] = useState([]);

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

  const handleCategoryChange = (options) => {
    setValueCate(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    // Validate that valueCate is an array
    if (!Array.isArray(valueCate)) {
      return "Please Select Days";
    }

    // Filter out invalid or undefined elements
    const validItems = valueCate.filter((item) => item && item.label);

    // Map through valid items only
    return validItems.length > 0
      ? validItems.map((item) => item.label).join(", ")
      : "Please Select Days";
  };

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
    companyname: true,
    branch: true,
    floor: true,
    area: true,
    workstation: true,
    department: true,
    team: true,
    designation: true,
    shifttiming: true,
    reportingto: true,
    workmode: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Please Select Primary Work Station"
  );
  const [primaryWorkStationLabel, setPrimaryWorkStationLabel] = useState(
    "Select Primary Workstation"
  );
  const [selectedWorkStation, setSelectedWorkStation] = useState("");
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );
  let [valueWorkStation, setValueWorkStation] = useState("");

  // company multi select
  const handleEmployeesChange = (options) => {
    // If employeecount is greater than 0, limit the selections
    if (maxSelections > 0) {
      // Limit the selections to the maximum allowed
      options = options.slice(0, maxSelections - 1);
    }

    // Update the disabled property based on the current selections and employeecount
    const updatedOptions = filteredWorkStation?.map((option) => ({
      ...option,
      disabled:
        maxSelections - 1 > 0 &&
        options.length >= maxSelections - 1 &&
        !options.find(
          (selectedOption) => selectedOption.value === option.value
        ),
    }));

    setValueWorkStation(options?.map((a, index) => a.value));
    setSelectedOptionsWorkStation(options);
    setFilteredWorkStation(updatedOptions);
  };

  const customValueRendererEmployees = (
    valueWorkStation,
    _filteredWorkStation
  ) => {
    return valueWorkStation.length ? (
      valueWorkStation?.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Secondary Work Station
      </span>
    );
  };

  const fetchWorkStation = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos.length > 0
            ? combinstationItem.subTodos?.map(
              (subTodo) =>
                subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"
            )
            : [
              combinstationItem.cabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")",
            ];
        });
      });
      setWorkStationOpt(res?.data?.locationgroupings);
      const processedResult = result.map((e) => {
        const selectedCabinName = e?.split("(")[0];

        const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

        const hyphenCount = Bracketsbranch.split("-").length - 1;

        const Branch =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[0].trim()
            : Bracketsbranch.split("-").slice(0, 2).join("-");

        const Floor =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[1].trim()
            : hyphenCount === 2
              ? Bracketsbranch.split("-").pop()
              : Bracketsbranch.split("-").slice(-2).join("-").replace(")", "");

        const shortname = workStationSystemName
          ?.filter(
            (item) =>
              item?.branch === Branch &&
              (Floor === "" || Floor === item?.floor) &&
              item?.cabinname === selectedCabinName
          )
          ?.map((item) => item?.systemshortname)
          ?.toString();

        return e + `(${shortname})`;
      });
      setAllWorkStationOpt(
        [
          ...processedResult.map((t) => ({
            label: t,
            value: t.replace(/\([^)]*\)$/, ""),
          })),
        ].filter((data) => data.value !== primaryWorkStation)
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

  const handleCompanyChange = (event) => {
    const selectedCompany = event.value;
    setSelectedCompany(selectedCompany);
    setSelectedBranch("");
    setSelectedUnit("");
    setSelectedTeam("");
    setSelectedWorkStation("");
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);

    setValueCompanyCat(
      event.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(event);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueDepartmentCat([]);

    setUnitOptions([]);
    setTeamOptions([]);
    setEmpaddform({ ...empaddform, floor: "" });
    setValueDepartmentCat([]);
    setSelectedOptionsDepartment([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
    setValueEmp([]);
  };

  const handleCompanyChangeNew = (event) => {
    const selectedCompany = event.value;
    setSelectedCompany(selectedCompany);
    setSelectedBranch("");
    setSelectedUnit("");
    setSelectedTeam("");
    setSelectedWorkStation("");
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);

    setUnitOptions([]);
    setTeamOptions([]);
    setEmpaddform({ ...empaddform, floor: "" });
  };

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

  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const [oldHierarchyData, setOldHierarchyData] = useState([]);
  const [oldHierarchyDataSupervisor, setOldHierarchyDataSupervisor] = useState(
    []
  );
  const [newHierarchyData, setNewHierarchyData] = useState([]);
  const [lastUpdatedData, setLastUpdatedData] = useState([]);
  const checkHierarchyName = async (newValue, type) => {
    setPageName(!pageName);
    try {
      if (
        type === "Designation"
          ? newValue != getingOlddatas?.designation
          : newValue != getingOlddatas?.team
      ) {
        let res = await axios.post(SERVICE.HIERARCHI_TEAM_DESIGNATION_CHECK, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          oldname: getingOlddatas,
          newname: newValue,
          type: type,
          username: getingOlddatas.companyname,
        });

        setOldHierarchyData(res?.data?.hierarchyold);
        setNewHierarchyData(res?.data?.hierarchyfindchange);
        setOldHierarchyDataSupervisor(res?.data?.hierarchyoldsupervisor);
        setLastUpdatedData(type);
      }
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [oldUpdatedData, setOldUpdatedData] = useState([]);
  const [newUpdatingData, setNewUpdatingData] = useState([]);
  const [oldEmployeeHierData, setOldEmployeeHierData] = useState([]);
  const [userReportingToChange, setUserReportingToChange] = useState([]);
  const [olddesignation, setOldDesignation] = useState("");
  const [oldDesignationGroup, setOldDesignationGroup] = useState("");
  const [newDesignationGroup, setNewDesignationGroup] = useState("");
  const [designationdatasEdit, setDesignationdatasEdit] = useState([]);
  const [newDesignatonChoosed, setnewDesignationChoosed] = useState("");

  const fetchSuperVisorChangingHierarchy = async (value) => {
    if (olddesignation !== value) {
      let designationGrpName = alldesignation?.find(
        (data) => value === data?.name
      )?.group;
      let res = await axios.post(SERVICE.HIERARCHY_DEISGNATIONLOG_RELATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        olddesig: oldDesignationGroup,
        designation: value,
        desiggroup: designationGrpName,
        user: getingOlddatas,
        company: selectedCompany,
        branch: selectedBranch,
        unit: selectedUnit,
        department: empaddform.department,
        team: selectedTeam,
      });
      const oldData = res?.data?.olddata?.length > 0 ? res?.data?.olddata : [];
      const newdata = res?.data?.newdata?.length > 0 ? res?.data?.newdata : [];
      const oldDataEmp =
        res?.data?.olddataEmp?.length > 0 ? res?.data?.olddataEmp : [];
      setOldUpdatedData(oldData);
      setNewUpdatingData(newdata);
      setOldEmployeeHierData(oldDataEmp);
    } else {
      setOldUpdatedData([]);
      setNewUpdatingData([]);
      setOldEmployeeHierData([]);
    }
  };

  const fetchReportingToUserHierarchy = async (value) => {
    if (getingOlddatas?.designation !== value) {
      let designationGrpName = alldesignation?.find(
        (data) => value === data?.name
      )?.group;
      let res = await axios.post(
        SERVICE.REPORTINGTO_DESIGNATION_USER_HIERARCHY_RELATION,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          olddesig: oldDesignationGroup,
          designation: value,
          desiggroup: designationGrpName,
          user: getingOlddatas,
          company: selectedCompany,
          branch: selectedBranch,
          unit: selectedUnit,
          department: empaddform.department,
          team: selectedTeam,
        }
      );
      const userResponse =
        res?.data?.newdata[0]?.result?.length > 0
          ? res?.data?.newdata[0]?.result
          : [];
      setUserReportingToChange(userResponse);
    } else {
      setUserReportingToChange([]);
    }
  };

  const [roles, setRoles] = useState([]);

  const fetchDesignationgroup = async (e) => {
    setPageName(!pageName);
    try {
      const [res_designationgroup, res_designation] = await Promise.all([
        axios.get(SERVICE.DESIGNATIONGRP, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.DESIGNATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let getGroupName = res_designation?.data?.designation
        .filter((data) => {
          return data.name === e.value;
        })
        ?.map((item) => item.group);

      let getRoles = res_designationgroup?.data?.desiggroup
        ?.filter((data) => {
          return getGroupName.includes(data.name);
        })
        .flatMap((data) => data.roles);

      let uniqueRoles = [...new Set(getRoles)];
      setRoles(uniqueRoles);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const fetchNewDesignationGroup = (value) => {
    let designationGrpName = alldesignation?.find(
      (data) => value === data?.name
    )?.group;
    setNewDesignationGroup(designationGrpName);
  };
  const changeTo = [
    { label: "Replace", value: "Replace" },
    { label: "New", value: "New" },
  ];
  const handleDesignationChange = (event) => {
    const selectedDesignation = event.value;
    fetchSuperVisorChangingHierarchy(selectedDesignation);
    fetchReportingToUserHierarchy(selectedDesignation);
    setSelectedDesignation(selectedDesignation);
    fetchDesignationgroup(event);
    setEmpaddform({
      ...empaddform,
      reportingto: "",
    });

    fetchNewDesignationGroup(selectedDesignation);
    setSuperVisorChoosen("Please Select Supervisor");
    setChangeToDesign("Please Select New/Replace");
    const ans = designationDataGroup?.find(
      (data) => data.name === selectedDesignation
    );
    setDesignationGroup(ans?.group);
    checkHierarchyName(selectedDesignation, "Designation");
  };

  const identifySuperVisor =
    hierarchyall
      ?.map((item) => item.supervisorchoose[0])
      ?.includes(getingOlddatas?.companyname) &&
    !designationsName?.includes(selectedDesignation);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);

  const [unitOptions, setUnitOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

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

      setShiftOptions(
        shiftFlat?.map((data) => ({
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

  const ShiftGroupingDropdwons = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftGroupingOptions(
        res?.data?.shiftgroupings?.map((data) => ({
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

  useEffect(() => {
    var filteredWorks;
    if (selectedUnit === "" && empaddform.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) => u.company === selectedCompany && u.branch === selectedBranch
      );
    } else if (selectedUnit === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === selectedCompany &&
          u.branch === selectedBranch &&
          u.floor === empaddform.floor
      );
    } else if (empaddform.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === selectedCompany &&
          u.branch === selectedBranch &&
          u.unit === selectedUnit
      );
    } else {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === selectedCompany &&
          u.branch === selectedBranch &&
          u.unit === selectedUnit &&
          u.floor === empaddform.floor
      );
    }
    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos.length > 0
          ? combinstationItem.subTodos?.map(
            (subTodo) =>
              subTodo.subcabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")"
          )
          : [
            combinstationItem.cabinname +
            "(" +
            item.branch +
            "-" +
            item.floor +
            ")",
          ];
      });
    });

    const processedResult = result.map((e) => {
      const selectedCabinName = e?.split("(")[0];

      const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

      const hyphenCount = Bracketsbranch.split("-").length - 1;

      const Branch =
        hyphenCount === 1
          ? Bracketsbranch.split("-")[0].trim()
          : Bracketsbranch.split("-").slice(0, 2).join("-");

      const Floor =
        hyphenCount === 1
          ? Bracketsbranch.split("-")[1].trim()
          : hyphenCount === 2
            ? Bracketsbranch.split("-").pop()
            : Bracketsbranch.split("-").slice(-2).join("-").replace(")", "");

      const shortname = workStationSystemName
        ?.filter(
          (item) =>
            item?.branch === Branch &&
            (Floor === "" || Floor === item?.floor) &&
            item?.cabinname === selectedCabinName
        )
        ?.map((item) => item?.systemshortname)
        ?.toString();

      return e + `(${shortname})`;
    });

    // setFilteredWorkStation(result.flat());
    setFilteredWorkStation([
      ...processedResult.map((t) => ({
        label: t,
        value: t.replace(/\([^)]*\)$/, ""),
      })),
    ]);
  }, [selectedCompany, selectedBranch, selectedUnit, empaddform.floor]);

  const [boardingLog, setBoardingLog] = useState([]);
  const [boardingLogBefore, setBoardingLogBefore] = useState([]);
  const [boardingLogAfter, setBoardingLogAfter] = useState([]);
  const [branchNames, setBranchNames] = useState([]);

  // Branch Dropdowns
  const fetchbranchNames = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBranchNames(req?.data?.branch);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  const [isBoadingDataLog, setIsBoadingDataLog] = useState([]);
  const [fromIntern, setFromIntern] = useState(false);
  const getCode = async (e) => {
    setPageName(!pageName);

    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let isIntern = !res?.data?.suser?.internstatus
        ? false
        : res?.data?.suser?.internstatus === "Moved";
      setFromIntern(isIntern);
      //boardingLog
      let boardingLog = res?.data?.suser?.boardingLog;
      const movetoliveIndex = boardingLog.findIndex(
        (item) => item.movetolive === true
      );

      let afterArrayBoard = [];

      if (movetoliveIndex !== -1) {
        afterArrayBoard = boardingLog.slice(movetoliveIndex);
      }
      let boardFirstLog =
        isIntern && movetoliveIndex !== -1 && afterArrayBoard?.length > 0
          ? afterArrayBoard[0]
          : res?.data?.suser?.boardingLog?.length > 0
            ? res?.data?.suser?.boardingLog[0]
            : undefined;
      //department
      let departmentlog = res?.data?.suser?.departmentlog;
      const movetoliveIndexDepartment = departmentlog.findIndex(
        (item) => item.movetolive === true
      );

      let afterArrayDepartment = [];

      if (movetoliveIndexDepartment !== -1) {
        afterArrayDepartment = departmentlog.slice(movetoliveIndexDepartment);
      }
      let departmentFirstLog =
        isIntern &&
          movetoliveIndexDepartment !== -1 &&
          afterArrayDepartment?.length > 0
          ? afterArrayDepartment[0]
          : res?.data?.suser?.departmentlog?.length > 0
            ? res?.data?.suser?.departmentlog[0]
            : undefined;

      //designation
      let designationlog = res?.data?.suser?.designationlog;
      const movetoliveIndexDesignation = designationlog.findIndex(
        (item) => item.movetolive === true
      );

      let afterArrayDesignation = [];

      if (movetoliveIndexDesignation !== -1) {
        afterArrayDesignation = designationlog.slice(
          movetoliveIndexDesignation
        );
      }
      let designationFirstLog =
        isIntern &&
          movetoliveIndexDesignation !== -1 &&
          afterArrayDesignation?.length > 0
          ? afterArrayDesignation[0]
          : res?.data?.suser?.designationlog?.length > 0
            ? res?.data?.suser?.designationlog[0]
            : undefined;
      setRoles(res?.data?.suser?.role);
      let req = await axios.post(SERVICE.MANPOWERAREAFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: boardFirstLog?.company || res?.data?.suser?.company,
        floor: boardFirstLog?.floor || String(res?.data?.suser?.floor),
        branch: boardFirstLog?.branch || res?.data?.suser?.branch,
      });
      const resbdl = res?.data?.suser?.boardingLog?.filter((data, index) => {
        return data.logcreation !== "shift";
      });

      setIsBoadingDataLog(resbdl);
      let result = req?.data?.allareas
        ?.map((item) => {
          return item.area.map((data) => {
            return data;
          });
        })
        .flat();

      setAreaNames(result);
      setOldUserCompanyname(res?.data?.suser);
      setEmpaddform({
        ...res?.data?.suser,
        company: boardFirstLog?.company || res?.data?.suser?.company,
        branch: boardFirstLog?.branch || res?.data?.suser?.branch,
        unit: boardFirstLog?.unit || res?.data?.suser?.unit,
        team: boardFirstLog?.team || res?.data?.suser?.team,
        floor: boardFirstLog?.floor || res?.data?.suser?.floor,
        area: boardFirstLog?.area || res?.data?.suser?.area,
        workstation: boardFirstLog?.workstation || res?.data?.suser?.workstation,
        workmode: boardFirstLog?.workmode || res?.data?.suser?.workmode,
        workstationinput: boardFirstLog?.workstationinput || res?.data?.suser?.workstationinput || res?.data?.suser?.workstationinput,
        shifttype: boardFirstLog?.shifttype || res?.data?.suser?.shifttype,
        shiftgrouping: boardFirstLog?.shiftgrouping || res?.data?.suser?.shiftgrouping,
        shifttiming: boardFirstLog?.shifttiming || res?.data?.suser?.shifttiming,
        weekoff: boardFirstLog?.weekoff || res?.data?.suser?.weekoff,
        department: departmentFirstLog?.department || res?.data?.suser?.department,
        designation: designationFirstLog?.weekoff || res?.data?.suser?.weekoff,
        process: designationFirstLog?.process || res?.data?.suser?.process,
        processduration: designationFirstLog?.processduration || res?.data?.suser?.processduration,
        processtype: designationFirstLog?.processtype || res?.data?.suser?.processtype,
        time: designationFirstLog?.time || res?.data?.suser?.time,
        ifoffice: boardFirstLog?.workstationofficestatus || res?.data?.suser?.workstationofficestatus,
      });
      setGettingOldDatas(res?.data?.suser);
      fetchUsernames(
        boardFirstLog?.team,
        "old",
        res?.data?.suser
      );
      setOldDesignation(designationFirstLog?.designation || res?.data?.suser?.designation);

      let designationGrpName = alldesignation?.find(
        (data) =>
          designationFirstLog?.designation === data?.name
      )?.group;
      setOldDesignationGroup(designationGrpName);
      setNewDesignationGroup(designationGrpName);
      setPrimaryWorkStationInput(res?.data?.suser?.workstationinput);
      setWorkStationInputOldDatas({
        company: boardFirstLog?.company || res?.data?.suser?.company,
        branch: boardFirstLog?.branch || res?.data?.suser?.branch,
        unit: boardFirstLog?.unit || res?.data?.suser?.unit,
        workmode: res?.data?.suser?.workmode,
        ifoffice: res?.data?.suser?.workstationofficestatus,
        workstationinput: res?.data?.suser?.workstationinput,
        username: res?.data?.suser?.username,
      });
      setSelectedCompany(boardFirstLog?.company || res?.data?.suser?.company);
      setSelectedBranch(boardFirstLog?.branch || res?.data?.suser?.branch);
      setSelectedUnit(boardFirstLog?.unit || res?.data?.suser?.unit);
      setSelectedDesignation(designationFirstLog?.designation || res?.data?.suser?.designation);
      setSelectedTeam(boardFirstLog?.team || res?.data?.suser?.team);
      let allDesignations = alldesignation
        ?.filter((data) => designationGrpName === data?.group)
        ?.map((item) => item?.name);
      setDesignationsName(allDesignations);
      setEnableWorkstation(res?.data?.suser?.enableworkstation);
      setTodo(boardFirstLog?.todo || []);
      setSelectedWorkStation(
        boardFirstLog?.workstation.slice(
          1,
          boardFirstLog?.workstation?.length
        )
      );

      const fitleredUsers = [
        ...allUsersData
          ?.filter(
            (data) =>
              data?.designation ===
              designationFirstLog?.designation &&
              data?.companyname !== res?.data?.suser?.companyname
          )
          .map((d) => ({
            label: d?.companyname,
            value: d?.companyname,
            designation: d?.designation,
          })),
      ];

      setUsers(fitleredUsers);
      const filteredUnits = unitNames?.filter(
        (u) => u.branch === boardFirstLog?.branch || res?.data?.suser?.branch
      );
      setFilteredUnits(filteredUnits);

      const filteredBranches = branchNames?.filter(
        (b) => b.company === boardFirstLog?.company || res?.data?.suser?.company
      );

      setFilteredBranches(filteredBranches);

      setUnitOptions(
        filteredUnits?.map((data) => ({ label: data.name, value: data.name }))
      );

      const filteredTeams = team?.filter(
        (t) =>
          t.unit === boardFirstLog?.unit || res?.data?.suser?.unit &&
          t.branch === boardFirstLog?.branch || res?.data?.suser?.branch
      );

      setFilteredTeams(filteredTeams);
      setTeamOptions(
        filteredTeams?.map((item) => ({
          label: item.teamname,
          value: item.teamname,
        }))
      );

      // boarding log
      if (res?.data?.suser?.boardingLog?.length === 0) {
        setBoardingLog([
          {
            company: res?.data?.suser?.company,
            branch: res?.data?.suser?.branch,
            department: res?.data?.suser?.department,
            startdate: formattedDate,
            team: res?.data?.suser?.team,
            unit: res?.data?.suser?.unit,
            floor: res?.data?.suser?.floor,
            area: res?.data?.suser?.area,
            workstation: res?.data?.suser?.workstation,
            shifttiming: res?.data?.suser?.shifttiming,
            shiftgrouping: res?.data?.suser?.shiftgrouping,
            username: res?.data?.suser?.username,
            _id: res?.data?.suser?._id,
          },
        ]);
      } else {
        let boardinglogs = res?.data?.suser?.boardingLog;
        const movetoliveIndex = boardinglogs.findIndex(
          (item) => item.movetolive === true
        );

        let beforeArray = [];
        let afterArray = [];

        if (movetoliveIndex !== -1) {
          // Separate the arrays based on the found index
          beforeArray = boardinglogs.slice(0, movetoliveIndex);
          afterArray = boardinglogs.slice(movetoliveIndex);
          setBoardingLogBefore(beforeArray);
          setBoardingLogAfter(afterArray);
          setBoardingLog(afterArray);
        } else {
          setBoardingLog(res?.data?.suser?.boardingLog);
        }
      }

      setPrimaryWorkStationInput(boardFirstLog?.workstationinput || res?.data?.suser?.workstationinput);

      fetchDptDesignation(departmentFirstLog?.department || res?.data?.suser?.department);
      ShiftDropdwonsSecond(boardFirstLog?.shiftgrouping);
      setPrimaryWorkStation(boardFirstLog?.workstation[0]);

      var filteredWorks;
      if (res?.data?.suser?.unit === "" && res?.data?.suser?.floor === "") {
        filteredWorks = workStationOpt?.filter(
          (u) =>
            u.company === res?.data?.suser?.company &&
            u.branch === res?.data?.suser?.branch
        );
      } else if (res?.data?.suser?.unit === "") {
        filteredWorks = workStationOpt?.filter(
          (u) =>
            u.company === res?.data?.suser?.company &&
            u.branch === res?.data?.suser?.branch &&
            u.floor === res?.data?.suser?.floor
        );
      } else if (res?.data?.suser?.floor === "") {
        filteredWorks = workStationOpt?.filter(
          (u) =>
            u.company === res?.data?.suser?.company &&
            u.branch === res?.data?.suser?.branch &&
            u.unit === res?.data?.suser?.unit
        );
      } else {
        filteredWorks = workStationOpt?.filter(
          (u) =>
            u.company === res?.data?.suser?.company &&
            u.branch === res?.data?.suser?.branch &&
            u.unit === res?.data?.suser?.unit &&
            u.floor === res?.data?.suser?.floor
        );
      }

      const resultNew = filteredWorks.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos.length > 0
            ? combinstationItem.subTodos.map(
              (subTodo) =>
                subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"
            )
            : [
              combinstationItem.cabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")",
            ];
        });
      });

      const processedResult = resultNew.map((e) => {
        const selectedCabinName = e?.split("(")[0];

        const Bracketsbranch = e?.match(/\(([^)]+)\)/)?.[1];

        const hyphenCount = Bracketsbranch.split("-").length - 1;

        const Branch =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[0].trim()
            : Bracketsbranch.split("-").slice(0, 2).join("-");

        const Floor =
          hyphenCount === 1
            ? Bracketsbranch.split("-")[1].trim()
            : hyphenCount === 2
              ? Bracketsbranch.split("-").pop()
              : Bracketsbranch.split("-").slice(-2).join("-").replace(")", "");

        const shortname = workStationSystemName
          ?.filter(
            (item) =>
              item?.branch === Branch &&
              (Floor === "" || Floor === item?.floor) &&
              item?.cabinname === selectedCabinName
          )
          ?.map((item) => item?.systemshortname)
          ?.toString();

        return e + `(${shortname})`;
      });

      // The processedResult array now contains all the mapped `shortname` values
      let workstationsFinal = [
        ...processedResult.map((t) => ({
          label: t,
          value: t.replace(/\([^)]*\)$/, ""),
        })),
      ];

      let primaryWorkstationNew =
        boardFirstLog?.workstation[0];

      let findLabel = workstationsFinal?.find((item) =>
        item.label.includes(primaryWorkstationNew)
      );

      setPrimaryWorkStationLabel(findLabel?.label);

      const employeeCount =
        Number(res?.data?.suser?.employeecount ?? 0) +
        Number(res?.data?.suser?.wfhcount ?? 0);
      setMaxSelections(employeeCount);

      let secondaryWorkstation =
        boardFirstLog?.workstation?.length > 1
          ? boardFirstLog?.workstation
            .slice(1, boardFirstLog?.workstation?.length)
            ?.map((x) => ({
              ...x,
              label: x,
              value: x,
            }))
          : [];


      let foundDataNew = secondaryWorkstation?.map((item) => {
        let getData = allWorkStationOpt?.find(
          (data) => data.value === item.value
        );
        return {
          ...item,
          label: getData?.label,
        };
      });

      setSelectedOptionsWorkStation(foundDataNew);

      setValueCate(boardFirstLog?.weekoff || []);
      const weekOff = Array.isArray(res?.data?.suser?.boardingLog?.[0]?.weekoff)
        ? boardFirstLog?.weekoff.map((a) => ({
          label: a,
          value: a,
        })) // Extract `value`
        : [];
      setSelectedOptionsCate(weekOff);
      setValueWorkStation(
        boardFirstLog?.workstation.slice(
          1,
          boardFirstLog?.workstation?.length
        )
      );
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

  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
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

  const [getbranchname, setgetbranchname] = useState("");
  const [getDepartment, setGetDepartment] = useState("");

  // Floor Dropdowns
  const fetchUsernames = async (team, check, user) => {
    const answer = boardingLog?.length > 1 ? false : true;
    if (answer && check === "new") {
      let res = await axios.post(SERVICE.HIERARCHY_REPORTING_TO, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        team: team,
        company: user?.company,
        branch: user?.branch,
        unit: user?.unit,
      });
      const resultUsers =
        res?.data?.result?.length > 0
          ? res?.data?.result[0]?.result?.supervisorchoose?.filter(
            (data) => data !== user?.companyname
          )
          : [];
      const answer = allUsersData?.filter((data) =>
        resultUsers?.includes(data?.companyname)
      );
      setrepotingtonames(answer);
    } else {
      let res = await axios.post(SERVICE.HIERARCHY_REPORTING_TO, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        team: team,
        company: user?.company,
        branch: user?.branch,
        unit: user?.unit,
      });
      const resultUsers =
        res?.data?.result?.length > 0
          ? res?.data?.result[0]?.result?.supervisorchoose?.filter(
            (data) => data !== user?.companyname
          )
          : [];
      const answer = allUsersData?.filter((data) =>
        resultUsers?.includes(data?.companyname)
      );
      setrepotingtonames(answer);
    }
  };

  // Itern Courses Dropdowns
  const fetchInternCourses = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.INTERNCOURSE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setInternCourseNames(
        req.data.internCourses.length > 0 &&
        req.data.internCourses?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
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

  const fetchUnitNames = async () => {
    // let branch = getunitname ? getunitname : empaddform.branch;
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUnitNames(req?.data?.units);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Floor Dropdowns
  const fetchfloorNames = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFloorNames(
        req.data.floors.length > 0 &&
        req.data.floors?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
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

  // Area Dropdowns
  const fetchareaNames = async (e) => {
    setPageName(!pageName);
    try {
      let req = await axios.post(SERVICE.MANPOWERAREAFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(selectedCompany),
        floor: String(e),
        branch: String(selectedBranch),
      });

      let result = req?.data?.allareas
        ?.map((item) => {
          return item.area.map((data) => {
            return data;
          });
        })
        .flat();

      setAreaNames(result);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Departments Dropdowns
  const fetchDepartments = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartment(
        req.data.departmentdetails.length > 0 &&
        req.data.departmentdetails?.map((d) => ({
          ...d,
          label: d.deptname,
          value: d.deptname,
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

  const fetchDptDesignation = async (value) => {
    setPageName(!pageName);
    try {
      const [req, req_Desig] = await Promise.all([
        axios.get(SERVICE.DEPARTMENTANDDESIGNATIONGROUPING, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.DESIGNATION, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let result = req?.data?.departmentanddesignationgroupings.filter(
        (data, index) => {
          return value === data.department;
        }
      );
      const designationall = [
        ...result?.map((d) => ({
          ...d,
          label: d.designation,
          value: d.designation,
        })),
      ];
      setDesignationdatasEdit(designationall);
      setDesignation(result);
      setDesignationDataGroup(req_Desig?.data?.designation);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Shift Dropdowns
  const fetchShift = async () => {
    setPageName(!pageName);
    try {
      let res_shift = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftTiming(res_shift?.data?.shifts);
    } catch (err) {
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };

  // Reporting Dropdowns
  const fetchReportingUser = async () => {
    setReporting(allUsersData);
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

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  //Boardingupadate updateby edit page...
  let updateby = empaddform?.updatedby;
  let addedby = empaddform?.addedby;

  //edit post call
  let boredit = empaddform?._id;
  const sendRequestt = async () => {
    // boarding log details
    let workStationInput = await allotWorkStation();
    const finalboardinglog = [
      ...(boardingLog.length > 0
        ? [
          {
            ...boardingLog[0], // Spread the original object to maintain immutability
            username: empaddform?.companyname,
            startdate: String(empaddform.doj),
            time: moment().format("HH:mm"),
            company: String(selectedCompany),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            floor: String(empaddform.floor),
            area: String(empaddform.area),
            workmode: String(empaddform.workmode),
            workstationofficestatus: Boolean(empaddform.ifoffice),
            workstationinput: String(
              empaddform.workmode === "Remote" || empaddform.ifoffice
                ? workStationInput
                : ""
            ),
            workstation:
              empaddform.workmode !== "Remote"
                ? valueWorkStation?.length === 0
                  ? primaryWorkStation
                  : [primaryWorkStation, ...valueWorkStation]
                : [primaryWorkStation, ...valueWorkStation],
            shifttype: String(empaddform.shifttype),
            shifttiming: String(empaddform.shifttiming),
            shiftgrouping: String(empaddform.shiftgrouping),
            weekoff: [...valueCate],
            todo: empaddform.shifttype === "Standard" ? [] : [...todo],
            logeditedby: [],
            updateddatetime: String(new Date()),
            updatedusername: String(isUserRoleAccess.companyname),
            logcreation: String("user"),
            ischangecompany: true,
            ischangebranch: true,
            ischangeunit: true,
            ischangeteam: true,
            ischangefloor: true,
            ischangearea: true,
            ischangeworkstation: true,
            ischangeworkmode: true,
          },
        ]
        : []),
      ...boardingLog.slice(1),
    ];
    // const finalboardinglog = [
    //   {
    //     ...changedboardlog1st[0],
    //     company: String(selectedCompany),
    //     time: moment().format("HH:mm"),
    //     branch: String(selectedBranch),
    //     unit: String(selectedUnit),
    //     team: String(selectedTeam),
    //     floor: String(empaddform.floor),
    //     area: String(empaddform.area),
    //     shifttype: String(empaddform.shifttype),
    //     shifttiming: String(empaddform.shifttiming),
    //     shiftgrouping: String(empaddform.shiftgrouping),
    //     weekoff: [...valueCate],
    //     ischangecompany: true,
    //     ischangebranch: true,
    //     ischangeunit: true,
    //     ischangeteam: true,
    //     ischangefloor: true,
    //     ischangearea: true,
    //     ischangeworkstation: true,
    //     logeditedby: [],
    //     workstation:
    //       empaddform.workmode !== "Remote"
    //         ? valueWorkStation.length === 0
    //           ? primaryWorkStation
    //           : [primaryWorkStation, ...valueWorkStation]
    //         : [primaryWorkStation, ...valueWorkStation],
    //     updateddatetime: String(new Date()),
    //     updatedusername: String(isUserRoleAccess.companyname),
    //     logcreation: String("user"),
    //     todo:
    //       empaddform?.shifttype === "Standard"
    //         ? []
    //         : Array.isArray(todo)
    //           ? [...todo]
    //           : [],
    //   },
    //   ...changeboardinglogwiout1st,
    // ];

    // departmentlog details
    const changeddptlog1st = getingOlddatas?.departmentlog?.slice(0, 1);
    const changedptlogwiout1st = getingOlddatas?.departmentlog?.slice(1);
    const finaldot = [
      {
        ...changeddptlog1st[0],
        logeditedby: [],
        updateddatetime: String(new Date()),
        updatedusername: String(isUserRoleAccess.companyname),
        department: String(empaddform.department),
        companyname: String(selectedCompany),
        branch: String(selectedBranch),
        unit: String(selectedUnit),
        team: String(selectedTeam),
      },
      ...changedptlogwiout1st,
    ];

    // designation log details
    const changeddeslog1st = getingOlddatas?.designationlog?.slice(0, 1);
    const changedeslogwiout1st = getingOlddatas?.designationlog?.slice(1);
    const finaldesignationlog = [
      {
        ...changeddeslog1st[0],
        logeditedby: [],
        updateddatetime: String(new Date()),
        updatedusername: String(isUserRoleAccess.companyname),
        designation: String(selectedDesignation),
        companyname: String(selectedCompany),
        branch: String(selectedBranch),
        unit: String(selectedUnit),
        team: String(selectedTeam),
      },
      ...changedeslogwiout1st,
    ];

    setPageName(!pageName);
    try {
      if (isBoadingDataLog?.length === 1) {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(selectedCompany),
          area: String(selectedBranch),
          branch: String(selectedBranch),
          unit: String(selectedUnit),
          team: String(selectedTeam),
          floor:
            empaddform.floor == "Please Select Floor"
              ? ""
              : String(empaddform.floor),
          shifttype: String(empaddform.shifttype),
          shiftgrouping:
            empaddform.shiftgrouping == "Please Select Shift Group"
              ? ""
              : String(empaddform.shiftgrouping),
          shifttiming:
            empaddform.shifttiming == "Please Select Shift"
              ? ""
              : String(empaddform.shifttiming),
          workmode: String(empaddform.workmode),
          workstationofficestatus: Boolean(empaddform.ifoffice),
          workstationinput: String(
            empaddform.workmode === "Remote" || empaddform.ifoffice
              ? workStationInput
              : ""
          ),
          workstation:
            empaddform.workmode !== "Remote"
              ? valueWorkStation.length === 0
                ? primaryWorkStation
                : [primaryWorkStation, ...valueWorkStation]
              : [primaryWorkStation, ...valueWorkStation],
        });
      }
      if (getingOlddatas?.departmentlog?.length === 1) {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          department: String(empaddform.department),
        });
      }
      if (getingOlddatas?.designationlog?.length === 1) {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          designation: String(selectedDesignation),
        });
      }
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },

        reportingto:
          boardingLog?.length > 1
            ? String(empaddform.reportingto)
            : getingOlddatas.reportingto,
        role: roles,
        boardingLog: fromIntern
          ? [...boardingLogBefore, ...finalboardinglog]
          : finalboardinglog,
        // boardingLog: finalboardinglog,
        departmentlog: finaldot,
        designationlog: finaldesignationlog,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

      if (
        isBoadingDataLog?.length === 1 &&
        getingOlddatas?.designationlog?.length === 1
      ) {
        if (identifySuperVisor) {
          // Changing the old Supervisor to to new Group
          if (newUpdatingData?.length > 0) {
            const primaryDep = newUpdatingData[0]?.primaryDep;
            const secondaryDep = newUpdatingData[0]?.secondaryDep;
            const tertiary = newUpdatingData[0]?.tertiaryDep;
            const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
            const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
            const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
            const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
            const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
            const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;

            if (
              [
                primaryDep,
                secondaryDep,
                tertiary,
                primaryDepAll,
                secondaryDepAll,
                tertiaryAll,
                primaryWithoutDep,
                secondaryWithoutDep,
                tertiaryWithoutDep,
              ].some((dep) => dep?.length > 0) &&
              userReportingToChange?.length > 0
            ) {
              const supervisor = userReportingToChange[0]?.supervisorchoose;
              let res = await axios.put(
                `${SERVICE.USER_SINGLE_PWD}/${boredit}`,
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  reportingto: String(supervisor[0]),
                  updatedby: [
                    ...updateby,
                    {
                      name: String(isUserRoleAccess.companyname),
                      date: String(new Date()),
                    },
                  ],
                }
              );
            }

            if (primaryDep?.length > 0) {
              const uniqueEntries = primaryDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryDep?.length > 0) {
              const uniqueEntries = secondaryDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiary?.length > 0) {
              const uniqueEntries = tertiary?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (primaryDepAll?.length > 0) {
              const uniqueEntries = primaryDepAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryDepAll?.length > 0) {
              const uniqueEntries = secondaryDepAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiaryAll?.length > 0) {
              const uniqueEntries = tertiaryAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (primaryWithoutDep?.length > 0) {
              const uniqueEntries = primaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryWithoutDep?.length > 0) {
              const uniqueEntries = secondaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiaryWithoutDep?.length > 0) {
              const uniqueEntries = tertiaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
          }
          //Removing old supervisor to new supervisor
          if (oldUpdatedData?.length > 0) {
            oldUpdatedData?.map(async (data, index) => {
              axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                supervisorchoose: superVisorChoosen,
              });
            });
          }
          // Changing Employee from one deignation to another ==>> Replace
          if (oldEmployeeHierData?.length > 0 && newUpdatingData?.length > 0) {
            let ans = oldEmployeeHierData?.map((data) => {
              axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            });
          }
        }
        // Only for Employees
        if (!identifySuperVisor) {
          if (oldEmployeeHierData?.length > 0) {
            let ans = oldEmployeeHierData?.map((data) => {
              axios.delete(`${SERVICE.HIRERARCHI_SINGLE}/${data?._id}`, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
              });
            });
          }
          if (newUpdatingData?.length > 0) {
            const primaryDep = newUpdatingData[0]?.primaryDep;
            const secondaryDep = newUpdatingData[0]?.secondaryDep;
            const tertiary = newUpdatingData[0]?.tertiaryDep;
            const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
            const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
            const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
            const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
            const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
            const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;
            if (
              [
                primaryDep,
                secondaryDep,
                tertiary,
                primaryDepAll,
                secondaryDepAll,
                tertiaryAll,
                primaryWithoutDep,
                secondaryWithoutDep,
                tertiaryWithoutDep,
              ].some((dep) => dep?.length > 0) &&
              userReportingToChange?.length > 0
            ) {
              const supervisor = userReportingToChange[0]?.supervisorchoose;
              let res = await axios.put(
                `${SERVICE.USER_SINGLE_PWD}/${boredit}`,
                {
                  headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                  },
                  reportingto: String(supervisor[0]),
                  updatedby: [
                    ...updateby,
                    {
                      name: String(isUserRoleAccess.companyname),
                      date: String(new Date()),
                    },
                  ],
                }
              );
            }

            if (primaryDep?.length > 0) {
              const uniqueEntries = primaryDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryDep?.length > 0) {
              const uniqueEntries = secondaryDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiary?.length > 0) {
              const uniqueEntries = tertiary?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (primaryDepAll?.length > 0) {
              const uniqueEntries = primaryDepAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryDepAll?.length > 0) {
              const uniqueEntries = secondaryDepAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiaryAll?.length > 0) {
              const uniqueEntries = tertiaryAll?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.company === item.company &&
                      t.branch === item.branch &&
                      t.unit === item.unit &&
                      t.team === item.team &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (primaryWithoutDep?.length > 0) {
              const uniqueEntries = primaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (secondaryWithoutDep?.length > 0) {
              const uniqueEntries = secondaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
            if (tertiaryWithoutDep?.length > 0) {
              const uniqueEntries = tertiaryWithoutDep?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.department === item.department &&
                      t.supervisorchoose?.length ===
                      item.supervisorchoose?.length &&
                      t.supervisorchoose?.every((dta) =>
                        item.supervisorchoose.includes(dta)
                      )
                  )
              );

              let answer = uniqueEntries?.map(
                async (data) =>
                  await axios.post(`${SERVICE.HIRERARCHI_CREATE}`, {
                    headers: {
                      Authorization: `Bearer ${auth.APIToken}`,
                    },

                    company: String(data?.company),
                    designationgroup: designationGroup,
                    department: String(data?.department),
                    branch: String(data?.branch),
                    unit: String(data?.unit),
                    team: String(data?.team),
                    supervisorchoose: String(data.supervisorchoose),
                    mode: String(data.mode),
                    level: String(data.level),
                    control: String(data.control),
                    pagecontrols: data.pagecontrols,
                    employeename: empaddform.companyname,
                    access: data.access,
                    action: Boolean(true),
                    empbranch: selectedBranch,
                    empunit: selectedUnit,
                    empcode: getingOlddatas?.empcode,
                    empteam: selectedTeam,
                    addedby: [
                      {
                        name: String(isUserRoleAccess?.username),
                        date: String(new Date()),
                      },
                    ],
                  })
              );
            }
          }
        }
      }

      setEmpaddform(res.data);
      handleCloseModEdit();
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
    const primaryDep = newUpdatingData[0]?.primaryDep;
    const secondaryDep = newUpdatingData[0]?.secondaryDep;
    const tertiary = newUpdatingData[0]?.tertiaryDep;
    const primaryDepAll = newUpdatingData[0]?.primaryDepAll;
    const secondaryDepAll = newUpdatingData[0]?.secondaryDepAll;
    const tertiaryAll = newUpdatingData[0]?.tertiaryDepAll;
    const primaryWithoutDep = newUpdatingData[0]?.primaryNotDep;
    const secondaryWithoutDep = newUpdatingData[0]?.secondaryNotDep;
    const tertiaryWithoutDep = newUpdatingData[0]?.tertiaryNotDep;

    const checkShiftMode = todo?.filter(
      (d) => d.shiftmode === "Please Select Shift Mode"
    );
    const checkShiftGroup = todo?.filter(
      (d) =>
        d.shiftmode === "Shift" &&
        d.shiftgrouping === "Please Select Shift Grouping"
    );
    const checkShift = todo?.filter(
      (d) => d.shiftmode === "Shift" && d.shifttiming === "Please Select Shift"
    );

    let value = todo?.reduce((indexes, obj, index) => {
      if (obj.shiftmode === "Please Select Shift Mode") {
        // Check if the object has the 'name' property
        indexes.push(index);
      }
      return indexes;
    }, []);

    setFinderrorindex(value);

    let oneweekrotation = weekoptions2weeks?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;
    let twoweekrotation = weekoptions1month?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;
    let onemonthrotation = weekoptions2months?.filter(
      (item) => !todo?.some((val) => val?.week === item)
    )?.length;

    let valuegrp = todo?.reduce((indexes, obj, index) => {
      if (
        obj.shiftmode === "Shift" &&
        obj.shiftgrouping === "Please Select Shift Grouping"
      ) {
        // Check if the object has the 'name' property
        indexes.push(index);
      }
      return indexes;
    }, []);

    setFinderrorindexgrp(valuegrp);

    let valuegrpshift = todo?.reduce((indexes, obj, index) => {
      if (
        obj.shiftmode === "Shift" &&
        obj.shifttiming === "Please Select Shift"
      ) {
        // Check if the object has the 'name' property
        indexes.push(index);
      }
      return indexes;
    }, []);

    setFinderrorindexshift(valuegrpshift);

    const newErrorsLog = {};
    if (empaddform.shifttype === "Daily" && todo?.length === 0) {
      setPopupContentMalert("Please Add all the weeks in the todo");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (
      empaddform.shifttype === "1 Week Rotation" &&
      oneweekrotation > 0
    ) {
      setPopupContentMalert("Please Add all the weeks in the todo");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (
      empaddform.shifttype === "2 Week Rotation" &&
      twoweekrotation > 0
    ) {
      setPopupContentMalert("Please Add all the weeks in the todo");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (
      empaddform.shifttype === "1 Month Rotation" &&
      onemonthrotation > 0
    ) {
      setPopupContentMalert("Please Add all the weeks in the todo");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
      return;
    } else if (
      (empaddform?.shifttype === "Daily" ||
        empaddform?.shifttype === "1 Week Rotation" ||
        empaddform?.shifttype === "2 Week Rotation" ||
        empaddform?.shifttype === "1 Month Rotation") &&
      checkShiftMode?.length > 0
    ) {
      newErrorsLog.checkShiftMode = (
        <Typography style={{ color: "red" }}>
          Shift Mode must be required
        </Typography>
      );
      return;
    }
    if (
      (empaddform.shifttype === "Daily" ||
        empaddform.shifttype === "1 Week Rotation" ||
        empaddform.shifttype === "2 Week Rotation" ||
        empaddform.shifttype === "1 Month Rotation") &&
      checkShiftGroup?.length > 0
    ) {
      newErrorsLog.checkShiftGroup = (
        <Typography style={{ color: "red" }}>
          Shift Group must be required
        </Typography>
      );
    }

    if (
      (empaddform.shifttype === "Daily" ||
        empaddform.shifttype === "1 Week Rotation" ||
        empaddform.shifttype === "2 Week Rotation" ||
        empaddform.shifttype === "1 Month Rotation") &&
      checkShift?.length > 0
    ) {
      newErrorsLog.checkShift = (
        <Typography style={{ color: "red" }}>Shift must be required</Typography>
      );
    }

    setErrorsLog({ ...newErrorsLog });

    if (selectedCompany == "") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedBranch == "") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedUnit === "" || selectedUnit === undefined) {
      setPopupContentMalert("Please Select Unit");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.department === "" ||
      empaddform.department == undefined
    ) {
      setPopupContentMalert("Please Select Department");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedTeam === "" || selectedTeam == undefined) {
      setPopupContentMalert("Please Select Team");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedDesignation === "" || selectedDesignation == undefined) {
      setPopupContentMalert("Please Select Designation");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.shifttype === "" ||
      empaddform.shifttype == undefined ||
      empaddform.shifttype === "Please Select Shift Type"
    ) {
      setPopupContentMalert("Please Select Shift Type");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.shifttype === "Standard" &&
      (empaddform.shiftgrouping === "" ||
        empaddform.shiftgrouping == undefined ||
        empaddform.shiftgrouping === "Please Select Shift Group")
    ) {
      setPopupContentMalert("Please Select Shift Group");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.shifttype === "Standard" &&
      (empaddform.shifttiming === "" ||
        empaddform.shifttiming == undefined ||
        empaddform.shifttiming === "Please Select Shift")
    ) {
      setPopupContentMalert("Please Select Shift Timing");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.reportingto === "" ||
      empaddform.reportingto == undefined
    ) {
      setPopupContentMalert("Please Select Reporting");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.workmode === "Please Select Work Mode" ||
      empaddform.workmode === "" ||
      empaddform.workmode == undefined
    ) {
      setPopupContentMalert("Please Select Work Mode!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      empaddform.workmode === "Office" &&
      empaddform.ifoffice === true &&
      primaryWorkStationInput === ""
    ) {
      setPopupContentMalert("Please Enter Work Station (WFH)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }

    //  else if (newHierarchyData[0]?.department !== empaddform?.department) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {
    //           "These employees designations and departments are not the same as in the hierarchy. Update in hierarchy first."
    //         }
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else if (
      changeToDesign === "Please Select New/Replace" &&
      identifySuperVisor
    ) {
      setPopupContentMalert("Please Select New/Replace");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      changeToDesign === "Replace" &&
      identifySuperVisor &&
      superVisorChoosen === "Please Select Supervisor"
    ) {
      setPopupContentMalert("Please Select Supervisor");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      changeToDesign === "Replace" &&
      oldEmployeeHierData?.length > 0 &&
      primaryDep?.length < 1 &&
      secondaryDep?.length < 1 &&
      tertiary?.length < 1 &&
      primaryDepAll?.length < 1 &&
      secondaryDepAll?.length < 1 &&
      tertiaryAll?.length < 1 &&
      primaryWithoutDep?.length < 1 &&
      secondaryWithoutDep?.length < 1 &&
      tertiaryWithoutDep?.length < 1
    ) {
      setPopupContentMalert(
        "These Employee's Designation is not matched in hierarchy ,Add Hierarchy and update"
      );
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequestt();
    }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

  const exportToExcel = (excelData, fileName) => {
    setPageName(!pageName);
    try {
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Check if the browser supports Blob and FileSaver
      if (!Blob || !FileSaver) {
        console.error("Blob or FileSaver not supported");
        return;
      }

      const data = new Blob([excelBuffer], { type: fileType });

      // Check if FileSaver.saveAs is available
      if (!FileSaver.saveAs) {
        console.error("FileSaver.saveAs is not available");
        return;
      }

      FileSaver.saveAs(data, fileName + fileExtension);
    } catch (error) {
      console.error("Error exporting to Excel", error);
    }
  };

  const formatData = (data) => {
    return data?.map((item, index) => {
      return {
        Sno: index + 1,
        Empcode: item.empcode || "",
        "Employee Name": item.companyname || "",
        Branch: item.branch || "",
        Floor: item.floor || "",
        Area: item.area || "",
        Wrokstation: item?.workstationexcel || "",
        Department: item.department || "",
        Team: item.team || "",
        Designation: item.designation || "",
        Shifttiming: item.shifttiming || "",
        Workmode: item?.workmode || "",
        Reportingto: item.reportingto || "",
      };
    });
  };

  const handleExportXL = (isfilter) => {
    const dataToExport = isfilter === "filtered" ? filteredData : items;

    if (!dataToExport || dataToExport.length === 0) {
      console.error("No data available to export");
      return;
    }

    exportToExcel(formatData(dataToExport), "BoardingUpdatelist");
    setIsFilterOpen(false);
  };

  //  PDF
  // pdf.....
  const columns = [
    { title: "Emp Code", field: "empcode" },
    { title: "Employee Name", field: "companyname" },
    { title: "Branch", field: "branch" },
    { title: "Floor", field: "floor" },
    { title: "Department", field: "department" },
    { title: "Area", field: "area" },
    { title: "Workstation", field: "workstation" },
    { title: "Team", field: "team" },
    { title: "Designation", field: "designation" },
    { title: "Shifttiming", field: "shifttiming" },
    { title: "Workmode", field: "workmode" },

    { title: "Reportingto", field: "reportingto" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    // Initialize serial number counter
    // Modify columns to include serial number column
    const columnsWithSerial = [
      { title: "S.No", dataKey: "serialNumber" }, // Serial number column
      ...columns?.map((col) => ({ title: col.title, dataKey: col.field })),
    ];

    // Modify row data to include serial number
    const dataWithSerial =
      isfilter === "filtered"
        ? filteredData?.map((t, index) => ({
          ...t,
          serialNumber: index + 1,
        }))
        : employees?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }));

    // Generate PDF
    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
      styles: { fontSize: 5 },
    });

    doc.save("BoardingUpdatelist.pdf");
  };

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

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "BoardingUpdatelist",
    pageStyle: "print",
  });

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Boarding Update List.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  useEffect(() => {
    fetchWorkStation();
    ShiftGroupingDropdwons();
    fetchfloorNames();
    fetchbranchNames();
    fetchUnitNames();
    fetchDepartments();
    fetchReportingUser();
    fetchShift();
    fetchInternCourses();
  }, [empaddform]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      workstationexcel:
        Array.isArray(item?.workstation) && item?.workstation?.length > 0
          ? item?.workstation?.map((t, i) => `${i + 1 + ". "}` + t).toString()
          : "",
    }));
    setItems(itemsWithSerialNumber);
    setOverallItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

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
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(employees.length / pageSize);

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

  const [selectAllChecked, setSelectAllChecked] = useState(false);

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
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
      pinned: "left",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 250,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      pinned: "left",
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
                handleCopy("Copied Emp Code!");
              }}
              options={{ message: "Copied Emp Code!" }}
              text={params?.data?.empcode}
            >
              <ListItemText primary={params?.data?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      flex: 0,
      width: 350,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
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
              text={params?.data?.companyname}
            >
              <ListItemText primary={params?.data?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 200,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 200,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 200,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 200,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 200,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "workstation",
      headerName: "Workstation",
      flex: 0,
      width: 350,
      hide: !columnVisibility.workstation,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 300,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "shifttiming",
      headerName: "Shift timing",
      flex: 0,
      width: 250,
      hide: !columnVisibility.shifttiming,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 150,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "reportingto",
      headerName: "Reporting to",
      flex: 0,
      width: 350,
      hide: !columnVisibility.reportingto,
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
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eboardinginfoupdate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id);
              }}
            >
              <EditIcon
                style={{ fontsize: "large" }}
                sx={buttonStyles.buttonedit}
              />
            </Button>
          )}
          {isUserRoleCompare?.includes("iboardinginfoupdate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon
                style={{ fontsize: "large" }}
                sx={buttonStyles.buttoninfo}
              />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
    let filteredWorkstation = item?.workstation?.filter(
      (item) => item !== "Please Select Workstation"
    );
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      companyname: item.companyname,
      branch: item.branch,
      floor: item.floor == "Please Select Floor" ? "" : item.floor,
      department: item.department,
      team: item.team,
      area: item.area,
      workstation: item?.workstation,
      workstationexcel: filteredWorkstation,
      designation: item.designation,
      shifttiming:
        item.shifttiming === "Please Select Shift" ? "" : item?.shifttiming,
      reportingto: item.reportingto,
      workmode: item.workmode,
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
          {filteredColumns?.map((column) => (
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
              // secondary={column.headerName }
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

  let [valueTeamCat, setValueTeamCat] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

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

    const availableOptions = allUsersData
      ?.filter(
        (comp) =>
          valueCompanyCat?.includes(comp.company) &&
          valueBranchCat?.includes(comp.branch) &&
          valueUnitCat?.includes(comp.unit) &&
          valueTeamCat?.includes(comp.team)
        //  &&
        // comp.workmode !== "Internship"
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
    setValueEmp([]); setEmployees([]);
    setFilterState({
      type: "Individual",
      employeestatus: "Please Select Employee Status",
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
    setSearchQuery("");
  };

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);

  const handleCompanyChangeFilter = (options) => {
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
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);

  const handleBranchChangeFilter = (options) => {
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
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);

  const handleUnitChangeFilter = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);

  const handleTeamChangeFilter = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //MULTISELECT ONCHANGE END

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
    } else if (
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
      setSearchQuery("");
      fetchEmployee();
    }
  };
  const [allAssignCompany, setAllAssignCompany] = useState([]);
  const [allAssignBranch, setAllAssignBranch] = useState([]);
  const [allAssignUnit, setAllAssignUnit] = useState([]);
  //get all employees list details
  const fetchEmployee = async () => {
    setIsBoarding(true);
    setPageName(!pageName);
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
          status: 1,
          resonablestatus: 1,
          reasonname: 1,
          rejoin: 1,
          reasonablestatusremarks: 1,
          department: 1,
          dob: 1,
          gender: 1,
          maritalstatus: 1,
          bloodgroup: 1,
          loginUserStatus: 1,
          location: 1,
          contactpersonal: 1,
          panno: 1,
          aadhar: 1,
          designationlog: 1,
          contactfamily: 1,
          ctaluk: 1,
          dom: 1,
          processlog: 1,
          boardingLog: 1,
          company: 1,
          reasondate: 1,
          empreason: 1,
          percentage: 1,
          empcode: 1,
          companyname: 1,
          team: 1,
          username: 1,
          usernameautogenerate: 1,
          workmode: 1,
          email: 1,
          employeecount: 1,
          systemmode: 1,
          companyemail: 1,

          unit: 1,
          branch: 1,
          area: 1,
          workstation: 1,
          designation: 1,
          floor: 1,
          shift: 1,
          reportingto: 1,
          experience: 1,
          doj: 1,
          dot: 1,
          bankdetails: 1,
          shifttiming: 1,
          shiftgrouping: 1,
          legalname: 1,
          callingname: 1,
          pdoorno: 1,
          pstreet: 1,
          candidateid: 1,
          parea: 1,
          plandmark: 1,
          ptaluk: 1,
          ppost: 1,
          ppincode: 1,
          pcountry: 1,
          pstate: 1,
          pcity: 1,
          cdoorno: 1,
          cstreet: 1,
          carea: 1,
          role: 1,
          clandmark: 1,
          cpost: 1,
          cpincode: 1,
          ccountry: 1,
          cstate: 1,
          ccity: 1,
          process: 1,

          weekoff: 1,
          originalpassword: 1,
          enquirystatus: 1,

          enableworkstation: 1,
          wordcheck: 1,
          shiftallot: 1,
          firstname: 1,
          lastname: 1,
          emergencyno: 1,
          name: 1,
          salarysetup: 1,
          mode: 1,
          salarycode: 1,
          basic: 1,
          hra: 1,
          conveyance: 1,
          medicalallowance: 1,
          productionallowance: 1,
          otherallowance: 1,
          productionallowancetwo: 1,
          pffromdate: 1,
          pfenddate: 1,
          esifromdate: 1,
          esienddate: 1,
          pfesistatus: 1,

          twofaenabled: 1,
          fathername: 1,
          mothername: 1,
          workstationinput: 1,
          referencetodo: 1,
          contactno: 1,
          details: 1,
          assignExpLog: 1,
          grosssalary: 1,
          timemins: 1,
          modeexperience: 1,
          targetexperience: 1,
          targetpts: 1,
          expval: 1,
          expmode: 1,
          processtype: 1,
          processduration: 1,
          duration: 1,
          workstationofficestatus: 1,
        },
      },
    ];
    setPageName(!pageName);
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
      setEmployees(response.data.users);
      setIsBoarding(false);
    } catch (err) {
      setIsBoarding(false);
      handleApiError(
        err,
        setPopupContentMalert,
        setPopupSeverityMalert,
        handleClickOpenPopupMalert
      );
    }
  };
  //auto select all dropdowns
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

      //----------------------------
      let mappedemployees = allUsersData
        ?.filter(
          (u) =>
            selectedCompany?.includes(u.company) &&
            selectedBranch?.includes(u.branch) &&
            selectedUnit?.includes(u.unit) &&
            selectedTeam?.includes(u.team)
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
            selectedTeam?.includes(u.team)
        )
        .map((u) => u.companyname);
      setValueEmployeeCat(employees);
      setSelectedOptionsEmployee(mappedemployees);
      setValueEmp(mappedemployees?.map((item) => item?.value));

      //-----------------
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);

      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
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

  return (
    <Box>
      <NotificationContainer />
      {/* ****** Header Content ****** */}
      <Headtitle title={"BOARDING INFO UPDATE"} />
      <PageHeading
        title="Assign Boarding Information"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="Employee"
        subpagename="Employee Update Details"
        subsubpagename="Boarding Info update"
      />
      <br />
      {isUserRoleCompare?.includes("lboardinginfoupdate") && (
        <>
          <Box sx={userStyle.selectcontainer}>
            <Grid container spacing={2}>
              <>
                <Grid item xs={12}>
                  <Typography sx={userStyle.importheadtext}>Filters</Typography>
                </Grid>
                <br />
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
                          options={allUsersData
                            ?.filter(
                              (u) =>
                                valueCompanyCat?.includes(u.company) &&
                                valueBranchCat?.includes(u.branch) &&
                                valueUnitCat?.includes(u.unit) &&
                                valueTeamCat?.includes(u.team)
                              // &&
                              // u.workmode !== "Internship"
                            )
                            .map((u) => ({
                              label: u.companyname,
                              value: u.companyname,
                            }))}
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
              </>
            </Grid>
            <br />
            <br />
            <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={buttonStyles.buttonsubmit}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button onClick={handleClearFilter} sx={buttonStyles.btncancel}>
                  {" "}
                  Clear{" "}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <br />
      {isUserRoleCompare?.includes("lboardinginfoupdate") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Boarding Information List
              </Typography>
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
                    <MenuItem value={employees?.length}>All</MenuItem>
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
                  {isUserRoleCompare?.includes("excelboardinginfoupdate") && (
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
                  {isUserRoleCompare?.includes("csvboardinginfoupdate") && (
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
                  {isUserRoleCompare?.includes("printboardinginfoupdate") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfboardinginfoupdate") && (
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
                  {isUserRoleCompare?.includes("imageboardinginfoupdate") && (
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
                  maindatas={employees}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={overallItems}
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
            {isBoarding ? (
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
                  gridRefTable={gridRef}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={overallItems}
                />
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

      {/* Delete Modal */}

      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          sx={{ marginTop: "50px" }}
        >
          <Box sx={{ ...userStyle.dialogbox }}>
            <>
              <Typography sx={userStyle.SubHeaderText}>
                Edit Boarding Information
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                  <Typography sx={{ fontWeight: "600", marginRight: "5px" }}>
                    Employee Name:
                  </Typography>
                  <Typography>{empaddform.companyname}</Typography>
                </Grid>
                <Grid item md={6} sm={12} xs={12} sx={{ display: "flex" }}>
                  <Typography sx={{ fontWeight: "600", marginRight: "5px" }}>
                    Emp Code:
                  </Typography>
                  <Typography>{empaddform.empcode}</Typography>
                </Grid>
              </Grid>{" "}
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
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
                      value={{
                        label:
                          selectedCompany === "" || selectedCompany == undefined
                            ? "Please Select Company"
                            : selectedCompany,
                        value:
                          selectedCompany === "" || selectedCompany == undefined
                            ? "Please Select Company"
                            : selectedCompany,
                      }}
                      onChange={handleCompanyChangeNew}
                    />
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="First Name"
                      value={selectedCompany}
                      readonly
                    /> */}
                  </FormControl>
                  {/* {errorsLog.company && <div>{errorsLog.company}</div>} */}
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>

                    <Selects
                      options={accessbranch
                        ?.filter((comp) => {
                          return selectedCompany === comp.company;
                        })
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
                      value={{
                        label:
                          selectedBranch === "" || selectedBranch == undefined
                            ? "Please Select Branch"
                            : selectedBranch,
                        value:
                          selectedBranch === "" || selectedBranch == undefined
                            ? "Please Select Branch"
                            : selectedBranch,
                      }}
                      onChange={handleBranchChangeNew}
                    />
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="First Name"
                      value={selectedBranch}
                      readonly
                    /> */}
                  </FormControl>
                  {/* {errorsLog.branch && <div>{errorsLog.branch}</div>} */}
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit <b style={{ color: "red" }}>*</b>
                    </Typography>

                    <Selects
                      options={accessbranch
                        ?.filter((comp) => {
                          return (
                            selectedCompany === comp.company &&
                            selectedBranch === comp.branch
                          );
                        })
                        ?.map((data) => ({
                          label: data.unit,
                          value: data.unit,
                        }))
                        .filter((item, index, self) => {
                          return (
                            self.findIndex(
                              (i) =>
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={{
                        label:
                          selectedUnit === "" || selectedUnit == undefined
                            ? "Please Select Unit"
                            : selectedUnit,
                        value:
                          selectedUnit === "" || selectedUnit == undefined
                            ? "Please Select Unit"
                            : selectedUnit,
                      }}
                      onChange={handleUnitChangeNew}
                    />

                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="First Name"
                      value={selectedUnit}
                      readonly
                    /> */}
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Floor</Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={floorNames
                        ?.filter((u) => u.branch === selectedBranch)
                        ?.map((u) => ({
                          ...u,
                          label: u.name,
                          value: u.name,
                        }))}
                      placeholder="Please Select Floor"
                      value={{
                        label:
                          empaddform.floor !== ""
                            ? empaddform.floor
                            : "Please Select Floor",
                        value:
                          empaddform.floor !== ""
                            ? empaddform.floor
                            : "Please Select Floor",
                      }}
                      onChange={(e, i) => {
                        setEmpaddform({
                          ...empaddform,
                          floor: e.value,
                          area: "Please Select Area",
                        });
                        fetchareaNames(e.value);
                        setPrimaryWorkStation(
                          "Please Select Primary Work Station"
                        );
                        setSelectedOptionsWorkStation([]);
                        setValueWorkStation([]);
                      }}
                    />
                    {/* <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={empaddform.floor}
                      readonly
                    /> */}
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Area</Typography>

                    <Selects
                      options={areaNames?.map((data) => ({
                        label: data,
                        value: data,
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          empaddform?.area === "" ||
                            empaddform?.area == undefined
                            ? "Please Select Area"
                            : empaddform?.area,
                        value:
                          empaddform?.area === "" ||
                            empaddform?.area == undefined
                            ? "Please Select Area"
                            : empaddform?.area,
                      }}
                      onChange={(e) => {
                        setEmpaddform({ ...empaddform, area: e.value });
                        setPrimaryWorkStation(
                          "Please Select Primary Work Station"
                        );
                        setSelectedOptionsWorkStation([]);
                        setValueWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                <>
                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Team <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={allTeam
                          ?.filter((comp) => {
                            return (
                              selectedCompany === comp.company &&
                              selectedBranch === comp.branch &&
                              selectedUnit === comp.unit
                            );
                          })
                          ?.map((data) => ({
                            label: data.teamname,
                            value: data.teamname,
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
                        value={{
                          label:
                            selectedTeam === "" || selectedTeam == undefined
                              ? "Please Select Team"
                              : selectedTeam,
                          value:
                            selectedTeam === "" || selectedTeam == undefined
                              ? "Please Select Team"
                              : selectedTeam,
                        }}
                        onChange={handleTeamChangeNew}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Department <b style={{ color: "red" }}>*</b>
                      </Typography>

                      <Selects
                        options={department}
                        value={{
                          label: empaddform.department,
                          value: empaddform.department,
                        }}
                        onChange={(e, i) => {
                          setEmpaddform({
                            ...empaddform,
                            department: e.value,
                            reportingto: "",
                          });

                          fetchDptDesignation(e.value);
                          setGetDepartment(e.value);
                          setSelectedDesignation("");
                          setNewDesignationGroup("");
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Old Designation</Typography>
                      <OutlinedInput value={getingOlddatas.designation} />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12} sm={12}>
                    <Typography>Old Designation Group</Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput value={oldDesignationGroup} />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        New Designation <b style={{ color: "red" }}>*</b>
                      </Typography>

                      <Selects
                        options={designation?.map((item) => ({
                          label: item?.designation,
                          value: item?.designation,
                        }))}
                        value={{
                          label: selectedDesignation,
                          value: selectedDesignation,
                        }}
                        onChange={handleDesignationChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <Typography>New Designation Group</Typography>
                    <FormControl fullWidth size="small">
                      <OutlinedInput value={newDesignationGroup} />
                    </FormControl>
                  </Grid>
                  {hierarchyall
                    ?.map((item) => item.supervisorchoose[0])
                    ?.includes(getingOlddatas?.companyname) &&
                    !designationsName?.includes(selectedDesignation) && (
                      <>
                        <Grid item md={3} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Change To<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <Selects
                              options={changeTo}
                              value={{
                                label: changeToDesign,
                                value: changeToDesign,
                              }}
                              onChange={(e) => {
                                setChangeToDesign(e.value);
                                setSuperVisorChoosen(
                                  "Please Select Supervisor"
                                );
                              }}
                            />
                          </FormControl>
                        </Grid>

                        {changeToDesign === "Replace" && (
                          <Grid item md={3} sm={6} xs={12}>
                            <FormControl fullWidth size="small">
                              <Typography>
                                Choose Supervisor{" "}
                                <b style={{ color: "red" }}>*</b>
                              </Typography>
                              <Selects
                                options={users?.filter(
                                  (data) => data?.designation === olddesignation
                                )}
                                value={{
                                  label: superVisorChoosen,
                                  value: superVisorChoosen,
                                }}
                                onChange={(e) => {
                                  setSuperVisorChoosen(e.value);
                                }}
                              />
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    )}
                </>
                <Grid item md={6} sm={6} xs={12}>
                  <Typography>
                    Shift Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={ShiftTypeOptions}
                      label="Please Select Shift Type"
                      value={{
                        label:
                          empaddform.shifttype === "" ||
                            empaddform.shifttype == undefined
                            ? "Please Select Shift Type"
                            : empaddform.shifttype,
                        value:
                          empaddform.shifttype === "" ||
                            empaddform.shifttype == undefined
                            ? "Please Select Shift Type"
                            : empaddform.shifttype,
                      }}
                      onChange={(e) => {
                        setEmpaddform({
                          ...empaddform,
                          shifttype: e.value,
                          shifttiming: "Please Select Shift",
                          shiftgrouping: "Please Select Shift Group",
                        });
                        // handleAddTodo(e.value);
                        setTodo([]);
                        setValueCate([]);
                        setSelectedOptionsCate([]);
                        setValueCateWeeks([]);
                        setSelectedOptionsCateWeeks([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                {empaddform.shifttype === "Standard" ? (
                  <>
                    <Grid item md={6} sm={6} xs={12}>
                      <Typography>
                        Shift Grouping<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Selects
                          options={ShiftGroupingOptions}
                          label="Please Select Shift Group"
                          value={{
                            label: empaddform.shiftgrouping,
                            value: empaddform.shiftgrouping,
                          }}
                          onChange={(e) => {
                            // // UnitDropDowns(e.value)
                            setEmpaddform({
                              ...empaddform,
                              shiftgrouping: e.value,
                              shifttiming: "Please Select Shift",
                            });
                            ShiftDropdwonsSecond(e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Shift Timing<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={ShiftOptions}
                          label="Please Select Shift"
                          value={{
                            label: empaddform.shifttiming,
                            value: empaddform.shifttiming,
                          }}
                          onChange={(e) => {
                            setEmpaddform({
                              ...empaddform,
                              shifttiming: e.value,
                            });
                          }}
                        />
                      </FormControl>
                      {errorsLog.shifttiming && (
                        <div>{errorsLog.shifttiming}</div>
                      )}
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Week off</Typography>
                        <MultiSelect
                          size="small"
                          options={weekdays || []}
                          value={selectedOptionsCate || []}
                          onChange={handleCategoryChange}
                          valueRenderer={customValueRendererCate}
                          labelledBy="Please Select Days"
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : null}

                <Grid item md={12} sm={12} xs={12}>
                  {empaddform.shifttype === "Daily" ? (
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
                                  empaddform.shiftgrouping === "" ||
                                    empaddform.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : empaddform.shiftgrouping,
                                value:
                                  empaddform.shiftgrouping === "" ||
                                    empaddform.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : empaddform.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
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
                              options={ShiftOptions}
                              styles={colourStyles}
                              value={{
                                label:
                                  empaddform.shifttiming === "" ||
                                    empaddform.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : empaddform.shifttiming,
                                value:
                                  empaddform.shifttiming === "" ||
                                    empaddform.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : empaddform.shifttiming,
                              }}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
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
                                {todo.shiftmode === "Shift" ? (
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
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} sm={4} xs={4}></Grid>
                                    <Grid item md={2.5} sm={4} xs={4}></Grid>
                                  </>
                                )}
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  {todo.shiftmode === "Shift" &&
                                    (todo.shiftgrouping ===
                                      "Please Select Shift Grouping" ||
                                      todo.shifttiming ===
                                      "Please Select Shift") ? null : (
                                    <Button onClick={handleUpdateTodocheck}>
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#216d21",
                                        }}
                                      />
                                    </Button>
                                  )}
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
                                {todo.shiftmode === "Shift" ? (
                                  <>
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
                                        {todo.shifttiming ===
                                          "Please Select Shift"
                                          ? ""
                                          : todo.shifttiming}
                                      </Typography>
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} sm={6} xs={12}></Grid>
                                    <Grid item md={2} sm={6} xs={12}></Grid>
                                  </>
                                )}
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

                  {empaddform.shifttype === "1 Week Rotation" ? (
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
                                  empaddform.shiftgrouping === "" ||
                                    empaddform.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : empaddform.shiftgrouping,
                                value:
                                  empaddform.shiftgrouping === "" ||
                                    empaddform.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : empaddform.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
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
                              options={ShiftOptions}
                              styles={colourStyles}
                              value={{
                                label:
                                  empaddform.shifttiming === "" ||
                                    empaddform.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : empaddform.shifttiming,
                                value:
                                  empaddform.shifttiming === "" ||
                                    empaddform.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : empaddform.shifttiming,
                              }}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
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
                          {errorsLog.shiftweeks && (
                            <div>{errorsLog.shiftweeks}</div>
                          )}
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
                                {todo.shiftmode === "Shift" ? (
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
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} sm={4} xs={4}></Grid>
                                    <Grid item md={2.5} sm={4} xs={4}></Grid>
                                  </>
                                )}
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  {todo.shiftmode === "Shift" &&
                                    (todo.shiftgrouping ===
                                      "Please Select Shift Grouping" ||
                                      todo.shifttiming ===
                                      "Please Select Shift") ? null : (
                                    <Button onClick={handleUpdateTodocheck}>
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#216d21",
                                        }}
                                      />
                                    </Button>
                                  )}
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
                                {todo.shiftmode === "Shift" ? (
                                  <>
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
                                        {todo.shifttiming ===
                                          "Please Select Shift"
                                          ? ""
                                          : todo.shifttiming}
                                      </Typography>
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} sm={6} xs={12}></Grid>
                                    <Grid item md={2} sm={6} xs={12}></Grid>
                                  </>
                                )}
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

                  {empaddform.shifttype === "2 Week Rotation" ? (
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
                                  empaddform.shiftgrouping === "" ||
                                    empaddform.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : empaddform.shiftgrouping,
                                value:
                                  empaddform.shiftgrouping === "" ||
                                    empaddform.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : empaddform.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
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
                              options={ShiftOptions}
                              styles={colourStyles}
                              value={{
                                label:
                                  empaddform.shifttiming === "" ||
                                    empaddform.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : empaddform.shifttiming,
                                value:
                                  empaddform.shifttiming === "" ||
                                    empaddform.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : empaddform.shifttiming,
                              }}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
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
                          {errorsLog.shiftweeks && (
                            <div>{errorsLog.shiftweeks}</div>
                          )}
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
                                {todo.shiftmode === "Shift" ? (
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
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} sm={4} xs={4}></Grid>
                                    <Grid item md={2.5} sm={4} xs={4}></Grid>
                                  </>
                                )}
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  {todo.shiftmode === "Shift" &&
                                    (todo.shiftgrouping ===
                                      "Please Select Shift Grouping" ||
                                      todo.shifttiming ===
                                      "Please Select Shift") ? null : (
                                    <Button onClick={handleUpdateTodocheck}>
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#216d21",
                                        }}
                                      />
                                    </Button>
                                  )}
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
                                {todo.shiftmode === "Shift" ? (
                                  <>
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
                                        {todo.shifttiming ===
                                          "Please Select Shift"
                                          ? ""
                                          : todo.shifttiming}
                                      </Typography>
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} sm={6} xs={12}></Grid>
                                    <Grid item md={2} sm={6} xs={12}></Grid>
                                  </>
                                )}
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

                  {empaddform.shifttype === "1 Month Rotation" ? (
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
                                  empaddform.shiftgrouping === "" ||
                                    empaddform.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : empaddform.shiftgrouping,
                                value:
                                  empaddform.shiftgrouping === "" ||
                                    empaddform.shiftgrouping === undefined
                                    ? "Please Select Shift Grouping"
                                    : empaddform.shiftgrouping,
                              }}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
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
                              options={ShiftOptions}
                              styles={colourStyles}
                              value={{
                                label:
                                  empaddform.shifttiming === "" ||
                                    empaddform.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : empaddform.shifttiming,
                                value:
                                  empaddform.shifttiming === "" ||
                                    empaddform.shifttiming === undefined
                                    ? "Please Select Shift"
                                    : empaddform.shifttiming,
                              }}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
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
                          {errorsLog.shiftweeks && (
                            <div>{errorsLog.shiftweeks}</div>
                          )}
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
                                {todo.shiftmode === "Shift" ? (
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
                                    </Grid>{" "}
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} sm={4} xs={4}></Grid>
                                    <Grid item md={2.5} sm={4} xs={4}></Grid>
                                  </>
                                )}
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  {todo.shiftmode === "Shift" &&
                                    (todo.shiftgrouping ===
                                      "Please Select Shift Grouping" ||
                                      todo.shifttiming ===
                                      "Please Select Shift") ? null : (
                                    <Button onClick={handleUpdateTodocheck}>
                                      <CheckCircleIcon
                                        style={{
                                          fontSize: "1.5rem",
                                          color: "#216d21",
                                        }}
                                      />
                                    </Button>
                                  )}
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
                                {todo.shiftmode === "Shift" ? (
                                  <>
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
                                        {todo.shifttiming ===
                                          "Please Select Shift"
                                          ? ""
                                          : todo.shifttiming}
                                      </Typography>
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid item md={2} sm={6} xs={12}></Grid>
                                    <Grid item md={2} sm={6} xs={12}></Grid>
                                  </>
                                )}
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

                  {/* {empaddform.shifttype === "Daily" ? (
                    <>
                      {todo?.length > 0 ? (
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
                          <Grid
                            container
                            spacing={2}
                            key={index}
                            sx={{ paddingTop: "5px" }}
                          >
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.day}</Typography>
                            </Grid>
                            <Grid item md={1.5} sm={6} xs={12}>
                              <Typography>{todo.week}</Typography>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
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
                              {errorsLog.checkShiftMode &&
                                finderrorindex.includes(index) && (
                                  <div>{errorsLog.checkShiftMode}</div>
                                )}
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
                                  {errorsLog.checkShiftGroup &&
                                    finderrorindexgrp.includes(index) && (
                                      <div>{errorsLog.checkShiftGroup}</div>
                                    )}
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
                                  {errorsLog.checkShift &&
                                    finderrorindexshift.includes(index) && (
                                      <div>{errorsLog.checkShift}</div>
                                    )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {empaddform.shifttype === "1 Week Rotation" ? (
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
                            <Grid item md={3} sm={6} xs={12}>
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
                              {errorsLog.checkShiftMode &&
                                finderrorindex.includes(index) && (
                                  <div>{errorsLog.checkShiftMode}</div>
                                )}
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
                                  {errorsLog.checkShiftGroup &&
                                    finderrorindexgrp.includes(index) && (
                                      <div>{errorsLog.checkShiftGroup}</div>
                                    )}
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
                                  {errorsLog.checkShift &&
                                    finderrorindexshift.includes(index) && (
                                      <div>{errorsLog.checkShift}</div>
                                    )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {empaddform.shifttype === "2 Week Rotation" ? (
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
                            <Grid item md={3} sm={6} xs={12}>
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
                              {errorsLog.checkShiftMode &&
                                finderrorindex.includes(index) && (
                                  <div>{errorsLog.checkShiftMode}</div>
                                )}
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
                                  {errorsLog.checkShiftGroup &&
                                    finderrorindexgrp.includes(index) && (
                                      <div>{errorsLog.checkShiftGroup}</div>
                                    )}
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
                                  {errorsLog.checkShift &&
                                    finderrorindexshift.includes(index) && (
                                      <div>{errorsLog.checkShift}</div>
                                    )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null}

                  {empaddform.shifttype === "1 Month Rotation" ? (
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
                            <Grid item md={3} sm={6} xs={12}>
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
                              {errorsLog.checkShiftMode &&
                                finderrorindex.includes(index) && (
                                  <div>{errorsLog.checkShiftMode}</div>
                                )}
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
                                  {errorsLog.checkShiftGroup &&
                                    finderrorindexgrp.includes(index) && (
                                      <div>{errorsLog.checkShiftGroup}</div>
                                    )}
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
                                  {errorsLog.checkShift &&
                                    finderrorindexshift.includes(index) && (
                                      <div>{errorsLog.checkShift}</div>
                                    )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        ))}
                    </>
                  ) : null} */}
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reporting To <b style={{ color: "red" }}>*</b>
                    </Typography>

                    <Selects
                      options={repotingtonames?.map((item) => ({
                        label: item.companyname,
                        value: item.companyname,
                      }))}
                      value={{
                        label: empaddform.reportingto,
                        value: empaddform.reportingto,
                      }}
                      onChange={(e, i) => {
                        setEmpaddform({
                          ...empaddform,
                          reportingto: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Work Mode<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={300}
                      options={workmodeOptions}
                      placeholder="Please Select Work Mode"
                      value={{
                        label:
                          empaddform.workmode !== ""
                            ? empaddform.workmode
                            : "Please Select Work Mode",
                        value:
                          empaddform.workmode !== ""
                            ? empaddform.workmode
                            : "Please Select Work Mode",
                      }}
                      onChange={(e) => {
                        setEmpaddform((prev) => ({
                          ...prev,
                          workmode: e.value,
                          ifoffice: false,
                        }));
                        setPrimaryWorkStationInput("");
                        setSelectedOptionsWorkStation([]);
                        setValueWorkStation([]);
                        setPrimaryWorkStation(
                          "Please Select Primary Work Station"
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                {empaddform.workmode !== "Remote" ? (
                  <>
                    {" "}
                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Primary)</Typography>
                        <Selects
                          options={filteredWorkStation}
                          label="Please Select Shift"
                          value={{
                            label: primaryWorkStationLabel,
                            value: primaryWorkStation,
                          }}
                          onChange={(e) => {
                            setPrimaryWorkStation(e.value);
                            setPrimaryWorkStationLabel(e.label);
                            setSelectedOptionsWorkStation([]);
                            setValueWorkStation([]);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)</Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt.filter(
                            (item, index, self) => {
                              return (
                                index ===
                                self.findIndex(
                                  (i) => i.value === item.value
                                ) && item.value !== primaryWorkStation
                              );
                            }
                          )}
                          value={selectedOptionsWorkStation}
                          onChange={handleEmployeesChange}
                          valueRenderer={customValueRendererEmployees}
                          disabled={
                            empaddform?.employeecount === "" ||
                            Number(empaddform?.employeecount) < 1 ||
                            primaryWorkStation ===
                            "Please Select Primary Work Station"
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>If Office</Typography>
                      </FormControl>
                      <Grid>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={empaddform.ifoffice === true}
                              />
                            }
                            onChange={(e) => {
                              setEmpaddform({
                                ...empaddform,
                                ifoffice: !empaddform.ifoffice,
                              });
                              // setPrimaryWorkStation("Please Select Primary Work Station")
                              setPrimaryWorkStationInput("");
                            }}
                            label="Work Station Other"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    {empaddform.ifoffice === true && (
                      <>
                        <Grid item md={6} sm={6} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>
                              Work Station (WFH)
                              <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Please Enter Work Station"
                              value={primaryWorkStationInput}
                              // onChange={(e) => {
                              //   setPrimaryWorkStationInput(e.target.value);
                              // }}
                              readOnly
                            />
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Primary)</Typography>
                        <Selects
                          options={filteredWorkStation}
                          label="Please Select Shift"
                          value={{
                            label: primaryWorkStationLabel,
                            value: primaryWorkStation,
                          }}
                          onChange={(e) => {
                            setPrimaryWorkStation(e.value);
                            setSelectedOptionsWorkStation([]);
                            setValueWorkStation([]);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)</Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt.filter(
                            (item, index, self) => {
                              return (
                                index ===
                                self.findIndex(
                                  (i) => i.value === item.value
                                ) && item.value !== primaryWorkStation
                              );
                            }
                          )}
                          value={selectedOptionsWorkStation}
                          onChange={handleEmployeesChange}
                          valueRenderer={customValueRendererEmployees}
                          disabled={
                            empaddform?.employeecount === "" ||
                            Number(empaddform?.employeecount) < 1 ||
                            primaryWorkStation ===
                            "Please Select Primary Work Station"
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (WFH)</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Work Station"
                          value={primaryWorkStationInput}
                          // onChange={(e) => {
                          //   setPrimaryWorkStationInput(e.target.value);
                          // }}
                          readOnly
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <br />
              </Grid>{" "}
              <br /> <br /> <br />
              <Grid container>
                <Grid item md={1}></Grid>
                <Button
                  variant="contained"
                  onClick={editSubmit}
                  sx={buttonStyles.buttonsubmit}
                >
                  Update
                </Button>
                <Grid item md={1}></Grid>
                <Button
                  sx={buttonStyles.btncancel}
                  onClick={handleCloseModEdit}
                >
                  Cancel
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <Box>
        {/* ALERT DIALOG */}
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
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
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
      </Box>

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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* this is info view details */}

      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ marginTop: "50px" }}
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}> Boarding Info</Typography>
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
              <br />
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
              <Button
                variant="contained"
                onClick={handleCloseinfo}
                sx={buttonStyles.btncancel}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="branch" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600" }}>
            <StyledTableRow>
              <StyledTableCell>SI.NO</StyledTableCell>
              <StyledTableCell>Emp Code</StyledTableCell>
              <StyledTableCell>Employee Name</StyledTableCell>
              <StyledTableCell>Branch</StyledTableCell>
              <StyledTableCell>Floor </StyledTableCell>
              <StyledTableCell>Area</StyledTableCell>
              <StyledTableCell>Department</StyledTableCell>
              <StyledTableCell>Team</StyledTableCell>
              <StyledTableCell>Workstation</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>Shift Timing</StyledTableCell>
              <StyledTableCell>Work Mode</StyledTableCell>

              <StyledTableCell>Reporting To</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rowDataTable &&
              rowDataTable?.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.empcode} </StyledTableCell>
                  <StyledTableCell>{row.companyname} </StyledTableCell>
                  <StyledTableCell>{row.branch} </StyledTableCell>
                  <StyledTableCell> {row.floor}</StyledTableCell>
                  <StyledTableCell>{row.area}</StyledTableCell>
                  <StyledTableCell>{row.department}</StyledTableCell>
                  <StyledTableCell>{row.team}</StyledTableCell>
                  <StyledTableCell>{row.workstation}</StyledTableCell>
                  <StyledTableCell>{row.designation}</StyledTableCell>
                  <StyledTableCell>{row.shifttiming}</StyledTableCell>
                  <StyledTableCell>{row.workmode}</StyledTableCell>

                  <StyledTableCell>{row.reportingto}</StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={
          (filteredChanges !== null ? filteredRowData : rowDataTable) ?? []
        }
        itemsTwo={employees ?? []}
        filename={"Boarding Update"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

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
    </Box>
  );
}

export default Boardingupdate;
