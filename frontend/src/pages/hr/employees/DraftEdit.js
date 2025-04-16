import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  InputLabel,
  Dialog,
  DialogContent,
  FormGroup,
  Select,
  DialogActions,
  FormControl,
  Grid,
  TextareaAutosize,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
  MenuItem,
  TextField,
  Modal,
  IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import CloseIcon from "@mui/icons-material/Close";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { SERVICE } from "../../../services/Baseservice";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import Webcamimage from "./Webcamprofile";
import moment from "moment-timezone";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import axios from "axios";
import Selects from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import "jspdf-autotable";
import { Country, State, City } from "country-state-city";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import "./MultistepForm.css";
import { FaArrowAltCircleRight } from "react-icons/fa";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Headtitle from "../../../components/Headtitle";
import { MultiSelect } from "react-multi-select-component";
import { useLocation } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function DraftEdit() {
  const currentYear = new Date().getFullYear();
  const maxDate = `${currentYear - 16}-12-31`;

  const [step, setStep] = useState(1);

  const id = useParams().id;

  const [newstate, setnewstate] = useState(false);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedUnitCode, setSelectedUnitCode] = useState("");

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  const ShiftTypeOptions = [
    { label: "Standard", value: "Standard" },
    { label: "Daily", value: "Daily" },
    { label: "1 Week Rotation (2 Weeks)", value: "1 Week Rotation" },
    { label: "2 Week Rotation (Monthly)", value: "2 Week Rotation" },
    { label: "1 Month Rotation (2 Month)", value: "1 Month Rotation" },
  ];

  const [month, setMonth] = useState("");

  const [isFormComplete, setIsFormComplete] = useState("incomplete");

  const [loading, setLoading] = useState(false);
  const timer = useRef();

  const [categorys, setCategorys] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);
  const [email, setEmail] = useState("");
  const [overllsettings, setOverallsettings] = useState([]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours()?.toString().padStart(2, "0");
    const minutes = now.getMinutes()?.toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState("");

  const [salSlabs, setsalSlabs] = useState([]);

  const [tarPoints, setTarpoints] = useState([]);
  //get all employees list details
  const fetchTargetpoints = async () => {
    try {
      let res_employee = await axios.get(SERVICE.TARGETPOINTS_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTarpoints(res_employee.data.targetpoints);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchSalarySlabs = async () => {
    try {
      let res_employee = await axios.get(SERVICE.SALARYSLAB_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setsalSlabs(res_employee.data.salaryslab);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [empCode, setEmpCode] = useState([]);

  const [employee, setEmployee] = useState({
    wordcheck: false,
    shiftgrouping: "",
    prefix: "Mr",
    firstname: "",
    lastname: "",
    legalname: "",
    fathername: "",
    mothername: "",
    gender: "",
    maritalstatus: "",
    dom: "",
    dob: "",
    bloodgroup: "",
    profileimage: "",
    location: "",
    email: "",
    contactpersonal: "",
    shifttype: "Please Select Shift Type",
    shiftmode: "Please Select Shift Mode",
    shiftgrouping: "Please Select Shift Grouping",
    shifttiming: "Please Select Shift",
    contactfamily: "",
    emergencyno: "",
    wordcheck: "",
    doj: "",
    dot: "",
    name: "",
    contactno: "",
    details: "",
    username: "",
    password: "",
    companyname: "",
    pdoorno: "",
    pstreet: "",
    parea: "",
    plandmark: "",
    ptaluk: "",
    ppost: "",
    ppincode: "",
    pcountry: "",
    pstate: "",
    pcity: "",
    cdoorno: "",
    cstreet: "",
    carea: "",
    clandmark: "",
    ctaluk: "",
    cpost: "",
    cpincode: "",
    ccountry: "",
    cstate: "",
    ccity: "",
    branch: "",
    workstation: "",
    weekoff: "",
    unit: "",
    floor: "",
    department: "",
    team: "",
    designation: "",
    reportingto: "",
    empcode: "",
    remark: "",
    aadhar: "",
    panno: "",
    draft: "",
    intStartDate: "",
    intEndDate: "",
    intCourse: "",
    bankname: "ICICI BANK LTD",
    workmode: "Please Select Work Mode",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",

    categoryedu: "Please Select Category",
    subcategoryedu: "Please Select Sub Category",
    specialization: "Please Select Specialization",
    // starttime: currentDateTime.toTimeString().split(" ")[0],
    enddate: "present",
    endtime: "present",
    time: getCurrentTime(),
    statuss: false,
  });

  const [designationGroup, setDesignationGroup] = useState("");

  const [shifts, setShifts] = useState([]);
  const ShiftModeOptions = [
    { label: "Shift", value: "Shift" },
    { label: "Week Off", value: "Week Off" },
  ];
  const [todo, setTodo] = useState([]);

  const handleAddTodo = (value) => {
    if (value === "Standard") {
      setTodo([]);
    }
    if (value === "Daily") {
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
        shiftmode: "Please Select Shift Mode",
        shiftgrouping: "Please Select Shift Grouping",
        shifttiming: "Please Select Shift",
      }));
      setTodo(newTodoList);
    }

    if (value === "1 Week Rotation") {
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
      const week1 = "1st Week";
      const week2 = "2nd Week";
      const newTodoList = [
        ...days1.map((day, index) => ({
          day,
          daycount: index + 1,
          week: week1,
          shiftmode: "Please Select Shift Mode",
          shiftgrouping: "Please Select Shift Grouping",
          shifttiming: "Please Select Shift",
        })),
        ...days2.map((day, index) => ({
          day,
          daycount: index + 8,
          week: week2,
          shiftmode: "Please Select Shift Mode",
          shiftgrouping: "Please Select Shift Grouping",
          shifttiming: "Please Select Shift",
        })),
      ];
      setTodo(newTodoList);
    }

    if (value === "2 Week Rotation") {
      const daysInMonth = 42; // You may need to adjust this based on the actual month
      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const weeks = [
        "1st Week",
        "2nd Week",
        "3rd Week",
        "4th Week",
        "5th Week",
        "6th Week",
      ]; // You may need to adjust this based on the actual month

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
          shiftmode: "Please Select Shift Mode",
          shiftgrouping: "Please Select Shift Grouping",
          shifttiming: "Please Select Shift",
        });

        currentDayIndex = (currentDayIndex + 1) % 7;
        currentDayCount++;
        if (currentDayIndex === 0) {
          currentWeek++;
        }
      }

      setTodo(todoList);
    }

    if (value === "1 Month Rotation") {
      const daysInMonth = 84; // You may need to adjust this based on the actual month
      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const weeks = [
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
      ]; // You may need to adjust this based on the actual month

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
          shiftmode: "Please Select Shift Mode",
          shiftgrouping: "Please Select Shift Grouping",
          shifttiming: "Please Select Shift",
        });

        currentDayIndex = (currentDayIndex + 1) % 7;
        currentDayCount++;
        if (currentDayIndex === 0) {
          currentWeek++;
        }
      }

      setTodo(todoList);
    }
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

  const fetchCategoryBased = async (e) => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category.data.educationcategory.filter((data) => {
        return data.categoryname === e.value;
      });

      let get = data_set[0].subcategoryname.map((data) => ({
        label: data,
        value: data,
      }));
      setSubcategorys(get);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchCategoryEducation = async () => {
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_category.data.educationcategory.map(
        (d) => d.categoryname
      );
      let filter_opt = [...new Set(data_set)];

      setCategorys(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [empsettings, setEmpsettings] = useState(false);
  const [branchCodeGen, setBranchCodeGen] = useState("");
  let date = employee?.doj?.split("-") ?? [];
  let dateJoin = "";

  if (date.length === 3) {
    let year = date[0] ? date[0].slice(-2) : "";
    let month = date[1] ?? "";
    let day = date[2] ?? "";
    dateJoin = year + month + day;
  } else {
    dateJoin = "";
  }
  const [third, setThird] = useState("");
  const [enableLoginName, setEnableLoginName] = useState(true);
  const [companyEmailDomain, setCompanyEmailDomain] = useState("");
  useEffect(() => {
    // Split the domain names into an array and trim any whitespace
    const domainsArray = companyEmailDomain
      ?.split(",")
      .map((domain) => domain.trim());

    let usernames = (
      enableLoginName ? String(third) : employee.username
    ).toLowerCase();
    // Check if the domainsArray has any domains
    const companyEmails =
      domainsArray.length > 0
        ? domainsArray.map((domain) => `${usernames}@${domain}`).join(",")
        : "";

    setEmployee({
      ...employee,
      companyemail: companyEmails,
    });
  }, [enableLoginName, third, employee.username]);
  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filter = res?.data?.overallsettings[0].todos.filter(
        (item) =>
          item.branch.includes(selectedBranch) &&
          item.company == selectedCompany
      );
      setOverallsettings(filter);
      let lastObject =
        res?.data?.overallsettings[res?.data?.overallsettings?.length - 1];
      setCompanyEmailDomain(lastObject?.emaildomain || "");

      setEmpsettings(res?.data?.overallsettings[0].empdigits);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [getDepartment, setGetDepartment] = useState("");

  let newval =
    empsettings === true && overllsettings.length > 0
      ? (branchCodeGen?.toUpperCase() || "") +
        (dateJoin || "") +
        (overllsettings[0]?.empcodedigits || "")
      : (branchCodeGen?.toUpperCase() || "") + (dateJoin || "") + "001";

  const currDate = new Date();
  var currDay = String(currDate.getDate()).padStart(2, "0");
  var currMonth = String(currDate.getMonth() + 1).padStart(2, "0");
  const currYear = currDate.getFullYear()?.toString().slice(2, 5);
  // let newval1 = "HIAIPUT-23076";
  let newval1 = `${selectedBranchCode?.toString()}INT${currYear}${currMonth}${currDay}0001`;

  if (empCode.length > 0) {
    empCode &&
      empCode.forEach(() => {
        const numericEmpCode = empCode.filter(
          (employee) => !isNaN(parseInt(employee.empcode.slice(-3)))
        );

        const result = numericEmpCode.reduce((maxEmployee, currentEmployee) => {
          const lastThreeDigitsMax = parseInt(maxEmployee?.empcode.slice(-3));
          const lastThreeDigitsCurrent = parseInt(
            currentEmployee?.empcode?.slice(-3)
          );
          return lastThreeDigitsMax > lastThreeDigitsCurrent
            ? maxEmployee
            : currentEmployee;
        }, numericEmpCode[0]);

        let strings = branchCodeGen?.toUpperCase() + dateJoin;
        let refNoold = result?.empcode;
        // lastEmpCode = result?.empcode.slice(-3);
        let refNo =
          overllsettings?.length > 0 &&
          empsettings === true &&
          Number(overllsettings[0]?.empcodedigits) >
            Number(result?.empcode.slice(-3))
            ? branchCodeGen.toUpperCase() +
              dateJoin +
              Number(overllsettings[0]?.empcodedigits - 1)
            : refNoold;
        let digits = (empCode.length + 1).toString();
        const stringLength = refNo?.length;
        let getlastBeforeChar = refNo?.charAt(stringLength - 2);
        let getlastThreeChar = refNo?.charAt(stringLength - 3);
        let lastChar = refNo?.slice(-1);
        let lastBeforeChar = refNo?.slice(-2);
        let lastDigit = refNo?.slice(-3);
        let refNOINC = parseInt(lastChar) + 1;
        let refLstTwo = parseInt(lastBeforeChar) + 1;
        let refLstDigit = parseInt(lastDigit) + 1;
        if (
          digits.length < 4 &&
          getlastBeforeChar === "0" &&
          getlastThreeChar === "0"
        ) {
          refNOINC = "00" + refNOINC;
          newval = strings + refNOINC;
        } else if (
          digits.length < 4 &&
          getlastThreeChar === "0" &&
          getlastBeforeChar > "0"
        ) {
          refNOINC = "0" + refLstTwo;
          newval = strings + refNOINC;
        } else {
          refNOINC = refLstDigit;
          newval = strings + refNOINC;
        }
      });
  } else if (
    empCode?.length === 0 &&
    overllsettings?.length > 0 &&
    empsettings === true
  ) {
    newval =
      branchCodeGen?.toUpperCase() +
      dateJoin +
      overllsettings[0]?.empcodedigits;
  } else if (empCode?.length === 0 && overllsettings?.length == 0) {
    newval = branchCodeGen?.toUpperCase() + dateJoin + "001";
  }

  const fetchEducation = async (e) => {
    try {
      let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res.data.educationspecilizations.filter((data) => {
        return (
          data.category.includes(employee.categoryedu) &&
          data.subcategory.includes(e.value)
        );
      });

      let result = data_set[0].specilizationgrp.map((data) => ({
        label: data.label,
        value: data.label,
      }));

      setEducationsOpt(result);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const valueOpt = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const mode = ["Auto Increment", "Add", "Minus", "Fix"];
  const modetar = ["Target Stop"];
  const modeexp = ["Exp Stop"];

  const modeOption = mode.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));

  const modeOptiontar = modetar.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));

  const modeOptionexp = modeexp.map((data) => ({
    ...data,
    label: data,
    value: data,
  }));
  const [expDptDates, setExpDptDates] = useState([]);
  const [monthSets, setMonthsets] = useState([]);
  const [specificDates, setSpecificDates] = useState([]);
  const [ShiftGroupingOptions, setShiftGroupingOptions] = useState([]);
  const [allUsersLoginName, setAllUsersLoginName] = useState([]);

  const [expDateOptions, setExpDateOptions] = useState([]);

  useEffect(() => {
    let foundData = expDptDates.find(
      (item) =>
        item.department === employee.department &&
        new Date(employee.doj) >= new Date(item.fromdate) &&
        new Date(employee.doj) <= new Date(item.todate)
    );

    if (foundData) {
      let filteredDatas = expDptDates
        .filter(
          (d) =>
            d.department === employee.department &&
            new Date(d.fromdate) >= new Date(foundData.fromdate)
        )
        .map((data) => ({
          label: data.fromdate,
          value: data.fromdate,
        }));

      setExpDateOptions(filteredDatas);
      // setAssignExperience((prev)=>({
      //   ...prev,
      //   assignEndExpDate: filteredDatas[0]?.value,
      //   assignEndTarDate: filteredDatas[0]?.value,
      //   updatedate: filteredDatas[0]?.value

      // }));
    } else {
    }
  }, [expDptDates, employee]);

  const [assignExperience, setAssignExperience] = useState({
    assignExpMode: "Auto Increment",
    assignExpvalue: 0,
    assignEndExpDate: "",
    assignEndTarDate: "",
    assignEndExp: "Exp Stop",
    assignEndExpvalue: "No",
    assignEndTar: "Target Stop",
    assignEndTarvalue: "No",
    updatedate: "",
    assignTartype: "Department Month Set",
    assignExptype: "Department Month Set",
    grosssalary: "",
    modeexperience: "",
    targetexperience: "",
    endexp: "",
    endexpdate: "",
    endtar: "",
    endtardate: "",
    updatedate: "",
  });

  // Process allot add  details

  const [loginNotAllot, setLoginNotAllot] = useState({
    process: "Please Select Process",
    processtype: "Primary",
    processduration: "Full",
    time: "Hrs",
    timemins: "Mins",
  });

  const [hrsOption, setHrsOption] = useState([]);
  const [hours, setHours] = useState("Hrs");
  const [minsOption, setMinsOption] = useState([]);
  const [minutes, setMinutes] = useState("Mins");

  const processTypes = [
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "Tertiary", value: "Tertiary" },
  ];

  const processDuration = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  //function to generate hrs
  const generateHrsOptions = () => {
    const hrsOpt = [];
    for (let i = 0; i <= 23; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      hrsOpt.push({ value: i?.toString(), label: i?.toString() });
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
      minsOpt.push({ value: i?.toString(), label: i?.toString() });
    }
    setMinsOption(minsOpt);
  };

  const [ProcessOptions, setProcessOptions] = useState([]);

  const processTeamDropdowns = async () => {
    try {
      let res_freq = await axios.get(
        SERVICE.ALL_PROCESS_AND_TEAM_FILTER_LIMITED,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      const companyall = res_freq?.data?.processteam;
      setProcessOptions(companyall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    generateHrsOptions();
    generateMinsOptions();
  }, []);

  useEffect(() => {
    fetchSalarySlabs();
  }, [id, selectedBranch, selectedCompany]);

  useEffect(() => {
    fetchTargetpoints();
  }, [id]);

  useEffect(() => {
    processTeamDropdowns();
  }, [selectedTeam]);

  const [overallgrosstotal, setoverallgrosstotal] = useState("");
  const [modeexperience, setModeexperience] = useState("");
  const [targetexperience, setTargetexperience] = useState("");
  const [targetpts, setTargetpts] = useState("");

  useEffect(() => {
    let today1 = new Date();
    var mm = String(today1.getMonth() + 1).padStart(2, "0");
    var yyyy = today1.getFullYear();
    let curMonStartDate = yyyy + "-" + mm + "-01";

    let modevalue = new Date(today1) > new Date(assignExperience.updatedate);

    // let findexp = monthSets.find((d) => d.department === item.department);

    let findexp = monthSets.find((d) => d.department === employee.department);
    let findDate = findexp ? findexp.fromdate : curMonStartDate;
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

        return months;
      }

      return 0; // Return 0 if either date is missing
    };

    let differenceInMonths = 0;
    let differenceInMonthsexp = 0;
    let differenceInMonthstar = 0;
    if (modevalue) {
      //findexp end difference yes/no
      if (assignExperience.assignEndExpvalue === "Yes") {
        differenceInMonthsexp =
          differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
        differenceInMonthsexp = calculateMonthsBetweenDates(
          employee.doj,
          assignExperience.assignEndExpDate
        );
        if (assignExperience.assignEndExp === "Add") {
          differenceInMonthsexp += parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignEndExp === "Minus") {
          differenceInMonthsexp -= parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignEndExp === "Fix") {
          differenceInMonthsexp = parseInt(assignExperience.assignExpvalue);
        }
      } else {
        differenceInMonthsexp = calculateMonthsBetweenDates(
          employee.doj,
          findDate
        );
        differenceInMonthsexp =
          differenceInMonthsexp < 1 ? 0 : differenceInMonthsexp;
        // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        if (assignExperience.assignEndExp === "Add") {
          differenceInMonthsexp += parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignEndExp === "Minus") {
          differenceInMonthsexp -= parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignEndExp === "Fix") {
          differenceInMonthsexp = parseInt(assignExperience.assignExpvalue);
        } else {
          // differenceInMonths = parseInt(assignExperience.assignExpvalue);
          differenceInMonthsexp = calculateMonthsBetweenDates(
            employee.doj,
            findDate
          );
        }
      }

      //findtar end difference yes/no
      if (modevalue.endtar === "Yes") {
        differenceInMonthstar = calculateMonthsBetweenDates(
          employee.doj,
          assignExperience.assignEndExpvalue
        );
        //  Math.floor((new Date(assignExperience.assignEndExpvalue) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        differenceInMonthstar =
          differenceInMonthstar < 1 ? 0 : differenceInMonthstar;
        if (assignExperience.assignExpMode === "Add") {
          differenceInMonthstar += parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignExpMode === "Minus") {
          differenceInMonthstar -= parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignExpMode === "Fix") {
          differenceInMonthstar = parseInt(assignExperience.assignExpvalue);
        }
      } else {
        differenceInMonthstar = calculateMonthsBetweenDates(
          employee.doj,
          findDate
        );
        differenceInMonthstar =
          differenceInMonthstar < 1 ? 0 : differenceInMonthstar;
        if (assignExperience.assignExpMode === "Add") {
          differenceInMonthstar += parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignExpMode === "Minus") {
          differenceInMonthstar -= parseInt(assignExperience.assignExpvalue);
        } else if (assignExperience.assignExpMode === "Fix") {
          differenceInMonthstar = parseInt(assignExperience.assignExpvalue);
        } else {
          // differenceInMonths = parseInt(assignExperience.assignExpvalue);
          differenceInMonthstar = calculateMonthsBetweenDates(
            employee.doj,
            findDate
          );
        }
      }

      differenceInMonths = calculateMonthsBetweenDates(employee.doj, findDate);
      differenceInMonths = differenceInMonths < 1 ? 0 : differenceInMonths;
      if (assignExperience.assignExpMode === "Add") {
        differenceInMonths += parseInt(assignExperience.assignExpvalue);
      } else if (assignExperience.assignExpMode === "Minus") {
        differenceInMonths -= parseInt(assignExperience.assignExpvalue);
      } else if (assignExperience.assignExpMode === "Fix") {
        differenceInMonths = parseInt(assignExperience.assignExpvalue);
      } else {
        // differenceInMonths = parseInt(assignExperience.assignExpvalue);
        differenceInMonths = calculateMonthsBetweenDates(
          employee.doj,
          findDate
        );
      }
    } else {
      differenceInMonthsexp = calculateMonthsBetweenDates(
        employee.doj,
        findDate
      );
      differenceInMonthstar = calculateMonthsBetweenDates(
        employee.doj,
        findDate
      );
      differenceInMonths = calculateMonthsBetweenDates(employee.doj, findDate);
    }

    let getprocessCode = loginNotAllot.process;

    let processexp = employee.doj
      ? getprocessCode +
        (differenceInMonths < 1
          ? "00"
          : differenceInMonths <= 9
          ? `0${differenceInMonths}`
          : differenceInMonths)
      : "00";

    let findSalDetails = salSlabs.find(
      (d) =>
        d.company == selectedCompany &&
        d.branch == selectedBranch &&
        d.salarycode == processexp
    );

    let findSalDetailsTar = tarPoints.find(
      (d) =>
        d.company === selectedCompany &&
        d.branch === selectedBranch &&
        d.processcode === processexp
    );
    let targetpoints = findSalDetailsTar ? findSalDetailsTar.points : "";

    let grosstotal = findSalDetails
      ? Number(findSalDetails.basic) +
        Number(findSalDetails.hra) +
        Number(findSalDetails.conveyance) +
        Number(findSalDetails.medicalallowance) +
        Number(findSalDetails.productionallowance) +
        Number(findSalDetails.otherallowance)
      : "";

    let Modeexp = employee.doj
      ? differenceInMonths > 0
        ? differenceInMonths
        : 0
      : "";
    let Tarexp = employee.doj
      ? differenceInMonthstar > 0
        ? differenceInMonthstar
        : 0
      : "";

    setoverallgrosstotal(grosstotal);
    setModeexperience(Modeexp);
    setTargetexperience(Tarexp);
    setTargetpts(targetpoints);
  }, [
    newstate,
    loginNotAllot.process,
    assignExperience.updatedate,
    // assignExperience.assignExpMode,
    assignExperience.assignExpvalue,
    assignExperience.assignEndExp,
    assignExperience.assignEndExpvalue,
    assignExperience.assignEndExpvalue,
    assignExperience.assignEndExpvalue,
    assignExperience.assignEndExpDate,
    assignExperience.assignEndTar,
    assignExperience.assignEndTarvalue,
  ]);

  //get all employees list details
  const fetchDepartmentMonthsets = async () => {
    const now = new Date();
    let today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var currentyear = today.getFullYear();

    let months = [
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
    let currentmonth = months[mm - 1];

    try {
      let res_employee = await axios.get(SERVICE.DEPMONTHSET_ALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let filteredMonthsets = res_employee.data.departmentdetails.filter(
        (item) => item.year == currentyear && item.monthname == currentmonth
      );
      let filteredMonthsetsDATES = res_employee.data.departmentdetails.filter(
        (item) => item.fromdate
      );
      setExpDptDates(res_employee.data.departmentdetails);
      setMonthsets(filteredMonthsets);
      setSpecificDates(filteredMonthsetsDATES);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const [accessibleErrors, setAccessibleErrors] = useState({});
  const handleButtonClick = (e) => {
    e.preventDefault();

    handleSubmitMulti(e);
  };

  const fetchBranchCode = async () => {
    try {
      var response = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let branchcode =
        response.data.branch.length > 0 &&
        response.data.branch.filter((data) => {
          if (selectedBranch === data?.name) {
            setBranchCodeGen(data?.code);
          }
        });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchBranchCode();
    fetchUserDatas();
  }, [selectedBranch]);

  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);
  const [primaryWorkStation, setPrimaryWorkStation] = useState(
    "Please Select Primary Work Station"
  );

  const [selectedWorkStation, setSelectedWorkStation] = useState("");
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState(
    []
  );
  const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);

  const [enableWorkstation, setEnableWorkstation] = useState(false);

  const [valueWorkStation, setValueWorkStation] = useState([]);
  const [empcodelimited, setEmpCodeLimited] = useState([]);

  const [employeecodenew, setEmployeecodenew] = useState("");
  const [checkcode, setCheckcode] = useState(false);
  const [maxSelections, setMaxSelections] = useState("");

  // for status
  const statusOptions = [
    { label: "Users Purpose", value: "Users Purpose" },
    { label: "Enquiry Only", value: "Enquiry Purpose" },
  ];

  const workmodeOptions = [
    { label: "Remote", value: "Remote" },
    { label: "Office", value: "Office" },
  ];
  useEffect(() => {
    var filteredWorks;
    if (selectedUnit === "" && employee.floor === "") {
      filteredWorks = workStationOpt?.filter(
        (u) => u.company === selectedCompany && u.branch === selectedBranch
      );
    } else if (selectedUnit === "") {
      filteredWorks = workStationOpt?.filter(
        (u) =>
          u.company === selectedCompany &&
          u.branch === selectedBranch &&
          u.floor === employee.floor
      );
    } else if (employee.floor === "") {
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
          u.floor === employee.floor
      );
    }
    const result = filteredWorks?.flatMap((item) => {
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
    // setFilteredWorkStation(result.flat());
    setFilteredWorkStation(
      result.flat()?.map((d) => ({
        ...d,
        label: d,
        value: d,
      }))
    );
  }, [selectedCompany, selectedBranch, selectedUnit, employee.floor]);

  let today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  const location = useLocation();

  const { id: newId } = useParams();

  useEffect(() => {
    rowData();
  }, []);

  const rowData = async () => {
    try {
      let res = await axios.get(`${SERVICE.DRAFT_SINGLE}/${newId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setPrimaryWorkStation(res?.data?.sdraft?.workstation[0]);
      const employeeCount = res?.data?.sdraft?.employeecount || 0;
      setMaxSelections(employeeCount);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const ShiftDropdwonsSecond = async (e) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const ShiftGroupingDropdwons = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // company multi select
  // company multi select
  const handleEmployeesChange = (options) => {
    // If employeecount is greater than 0, limit the selections
    if (maxSelections > 0) {
      // Limit the selections to the maximum allowed
      options = options.slice(0, maxSelections - 1);
    }

    // Update the disabled property based on the current selections and employeecount
    const updatedOptions = filteredWorkStation.map((option) => ({
      ...option,
      disabled:
        maxSelections - 1 > 0 &&
        options.length >= maxSelections - 1 &&
        !options.find(
          (selectedOption) => selectedOption.value === option.value
        ),
    }));

    setValueWorkStation(options.map((a, index) => a.value));
    setSelectedOptionsWorkStation(options);
    setFilteredWorkStation(updatedOptions);
  };
  const customValueRendererEmployees = (
    valueWorkStation,
    _filteredWorkStation
  ) => {
    return valueWorkStation.length ? (
      valueWorkStation.map(({ label }) => label).join(", ")
    ) : (
      <span style={{ color: "hsl(0, 0%, 20%)" }}>
        Please Select Secondary Work Station
      </span>
    );
  };

  const fetchWorkStation = async () => {
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.locationgroupings.flatMap((item) => {
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
      setWorkStationOpt(res?.data?.locationgroupings);

      setAllWorkStationOpt(
        result.flat()?.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get settings data
  const fetchUserDatas = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let ALLusers = req?.data?.users.filter((item) => {
        if (item?.workmode != "Internship" && item.branch == selectedBranch) {
          return item;
        }
      });
      setEmpCode(ALLusers);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchOverAllSettings();
    fetchUserDatas();
    // fetchUserDatasLimitedEmpcode();
  }, []);

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

  let skno = 1;
  let eduno = 1;

  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    let showAlert = false;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const file = files[i];
      if (file.size > maxFileSize) {
        showAlert = true;
        continue; // Skip this file and continue with the next one
      }
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFiles((prevFiles) => [
          ...prevFiles,
          {
            name: file.name,
            preview: reader.result,
            type: file.type, // Include the file type
            data: reader.result.split(",")[1],
            remark: fileNames === "Please Select File Name" ? "" : fileNames,
          },
        ]);
      };
    }
    setfileNames("Please Select File Name");
    if (showAlert) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"File size is greater than 1MB, please upload a file below 1MB."}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  const handleFileDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleRemarkChange = (index, remark) => {
    setFiles((prevFiles) =>
      prevFiles.map((file, i) => (i === index ? { ...file, remark } : file))
    );
  };

  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const [errmsg, setErrmsg] = useState("");
  const [status, setStatus] = useState("");

  const [errors, setErrors] = useState({});
  const [errorsLog, setErrorsLog] = useState({});
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    let emailvalue = email ? email : employee.email;
    return regex.test(emailvalue);
  };

  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );

  const [selectedCountryp, setSelectedCountryp] = useState(null);
  const [selectedStatep, setSelectedStatep] = useState(null);
  const [selectedCityp, setSelectedCityp] = useState(null);

  const [selectedCountryc, setSelectedCountryc] = useState(null);
  const [selectedStatec, setSelectedStatec] = useState(null);
  const [selectedCityc, setSelectedCityc] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [floorNames, setFloorNames] = useState([]);
  const [department, setDepartment] = useState([]);
  const [team, setTeam] = useState([]);
  const [unitNames, setUnitNames] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [shifttiming, setShiftTiming] = useState([]);
  const [message, setErrorMessage] = useState("");
  const [usernameaddedby, setUsernameaddedby] = useState("");

  const [file, setFile] = useState("");

  let sno = 1;

  //ADDICTIONAL QUALIFICATION SECTION FUNCTIONALITY
  const [institution, setInstitution] = useState("");
  const [passedyear, setPassedyear] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [eduTodo, setEduTodo] = useState([]);

  const [addQual, setAddQual] = useState("");
  const [addInst, setAddInst] = useState("");
  const [duration, setDuration] = useState("");
  const [remarks, setRemarks] = useState("");
  const [addAddQuaTodo, setAddQuaTodo] = useState("");

  const [empNameTodo, setEmpNameTodo] = useState("");
  const [desigTodo, setDesigTodo] = useState("");
  const [joindateTodo, setJoindateTodo] = useState("");
  const [leavedateTodo, setLeavedateTodo] = useState("");
  const [dutiesTodo, setDutiesTodo] = useState("");
  const [reasonTodo, setReasonTodo] = useState("");
  const [workhistTodo, setWorkhistTodo] = useState("");
  const [areaNames, setAreaNames] = useState([]);
  const [errorstodo, setErrorstodo] = useState({});

  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");

  //crop image
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState("");
  const cropperRef = useRef(null);

  const [skillSet, setSkillSet] = useState("");
  const [repotingtonames, setrepotingtonames] = useState([]);

  const [internCourseNames, setInternCourseNames] = useState();

  //Submit function for TODO Education
  const handleSubmittodo = (e) => {
    const errorstodo = {};
    const Nameismatch = eduTodo?.some(
      (data, index) =>
        data.categoryedu == employee.categoryedu &&
        data.subcategoryedu == employee.subcategoryedu &&
        data.specialization == employee.specialization &&
        data.institution == institution &&
        data.passedyear == passedyear &&
        data.cgpa == cgpa
    );
    e.preventDefault();
    if (
      employee.categoryedu == "Please Select Category" ||
      employee.subcategoryedu == "Please Select Sub Category" ||
      employee.specialization == "Please Select Specialization" ||
      institution == "" ||
      passedyear == "" ||
      cgpa == ""
    ) {
      errorstodo.qualification = (
        <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
      );
      setErrorstodo(errorstodo);
    } else if (
      employee.categoryedu !== "Please Select Category" &&
      employee.subcategoryedu !== "Please Select Sub Category" &&
      employee.specialization !== "Please Select Specialization" &&
      institution !== "" &&
      passedyear !== "" &&
      passedyear?.length !== 4 &&
      cgpa !== ""
    ) {
      errorstodo.qualification = (
        <Typography style={{ color: "red" }}>
          Please Enter Valid Passed Year
        </Typography>
      );
      setErrorstodo(errorstodo);
    } else if (Nameismatch) {
      errorstodo.qualification = (
        <Typography style={{ color: "red" }}>Already Added!</Typography>
      );
      setErrorstodo(errorstodo);
    } else {
      setEduTodo([
        ...eduTodo,
        {
          categoryedu: employee.categoryedu,
          subcategoryedu: employee.subcategoryedu,
          specialization: employee.specialization,
          institution,
          passedyear,
          cgpa,
        },
      ]);
      setErrorstodo("");
      setEmployee((prev) => ({
        ...prev,
        categoryedu: "Please Select Category",
        subcategoryedu: "Please Select Sub Category",
        specialization: "Please Select Specialization",
      }));
      setInstitution("");
      setPassedyear("");
      setCgpa("");
      setSubcategorys([]);
      setEducationsOpt([]);
    }
  };
  //Delete for Education
  const handleDelete = (index) => {
    const newTodos = [...eduTodo];
    newTodos.splice(index, 1);
    setEduTodo(newTodos);
  };

  //Submit function for Additional Qualification
  const handleSubmitAddtodo = (e) => {
    const errorstodo = {};
    const Namematch = addAddQuaTodo?.some(
      (data, index) =>
        data.addQual == addQual &&
        data.addInst == addInst &&
        data.duration == duration &&
        data.remarks == remarks
    );
    e.preventDefault();
    if (addQual == "" || addInst == "" || duration == "") {
      errorstodo.addQual = (
        <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
      );
      setErrorstodo(errorstodo);
    } else if (Namematch) {
      errorstodo.addQual = (
        <Typography style={{ color: "red" }}>Already Added!</Typography>
      );
      setErrorstodo(errorstodo);
    } else {
      setAddQuaTodo([
        ...addAddQuaTodo,
        { addQual, addInst, duration, remarks },
      ]);
      setErrorstodo("");
      setAddQual("");
      setAddInst("");
      setDuration("");
      setRemarks("");
    }
  };
  //Delete for Additional Qualification
  const handleAddDelete = (index) => {
    const newTodosed = [...addAddQuaTodo];
    newTodosed.splice(index, 1);
    setAddQuaTodo(newTodosed);
  };

  //Submit function for Work History
  const handleSubmitWorkSubmit = (e) => {
    e.preventDefault();

    const errorstodo = {};

    // Check if empNameTodo already exists in workhistTodo
    const isDuplicate = workhistTodo?.some(
      (entry) =>
        entry.empNameTodo?.toLowerCase() === empNameTodo?.toLowerCase() &&
        entry.desigTodo?.toLowerCase() === desigTodo?.toLowerCase() &&
        entry.joindateTodo === joindateTodo &&
        entry.leavedateTodo === leavedateTodo &&
        entry.reasonTodo?.toLowerCase() === reasonTodo?.toLowerCase()
    );

    // Check if all fields are filled
    if (
      empNameTodo === "" ||
      desigTodo === "" ||
      joindateTodo === "" ||
      leavedateTodo === "" ||
      dutiesTodo === "" ||
      reasonTodo === ""
    ) {
      errorstodo.empNameTodo = (
        <Typography style={{ color: "red" }}>Please Fill All Fields</Typography>
      );
    } else if (isDuplicate) {
      errorstodo.empNameTodo = (
        <Typography style={{ color: "red" }}>Already Added!</Typography>
      );
    }

    setErrorstodo(errorstodo);

    if (Object.keys(errorstodo)?.length === 0) {
      setWorkhistTodo([
        ...workhistTodo,
        {
          empNameTodo,
          desigTodo,
          joindateTodo,
          leavedateTodo,
          dutiesTodo,
          reasonTodo,
        },
      ]);
      setErrorstodo("");

      setEmpNameTodo("");
      setDesigTodo("");
      setJoindateTodo("");
      setLeavedateTodo("");
      setDutiesTodo("");
      setReasonTodo("");
    }
  };
  //Delete for Work History
  const handleWorkHisDelete = (index) => {
    const newWorkHisTodo = [...workhistTodo];
    newWorkHisTodo.splice(index, 1);
    setWorkhistTodo(newWorkHisTodo);
  };

  const [oldData, setOldData] = useState({
    company: "",
    branch: "",
    unit: "",
    team: "",
  });

  const [oldHierarchyData, setOldHierarchyData] = useState([]);
  const [oldHierarchyDataSupervisor, setOldHierarchyDataSupervisor] = useState(
    []
  );
  const [newHierarchyData, setNewHierarchyData] = useState([]);
  const [getingOlddatas, setGettingOldDatas] = useState([]);
  const [lastUpdatedData, setLastUpdatedData] = useState([]);

  const checkHierarchyName = async (newValue, type) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const LoadingBackdrop = ({ open }) => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="pulsating-circle">
          <CircularProgress color="inherit" className="loading-spinner" />
        </div>
        <Typography
          variant="h6"
          sx={{ marginLeft: 2, color: "#fff", fontWeight: "bold" }}
        >
          Please Wait...
        </Typography>
      </Backdrop>
    );
  };

  const [workStationInputOldDatas, setWorkStationInputOldDatas] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    workStationAutoGenerate();
  }, [
    selectedCompany,
    selectedBranch,
    selectedUnit,
    employee.workmode,
    employee?.username,
    employee?.ifoffice,
  ]);

  const workStationAutoGenerate = async () => {
    try {
      let lastwscode;
      let lastworkstation = repotingtonames
        .filter(
          (item) =>
            // item?.workmode !== "Internship" &&
            item.company === selectedCompany &&
            item.branch === selectedBranch &&
            item.unit === selectedUnit
        )
        .filter((item) => /_[0-9]+_/.test(item?.workstationinput));

      if (lastworkstation.length === 0) {
        lastwscode = 0;
      } else {
        let highestWorkstation = lastworkstation.reduce(
          (max, item) => {
            const num = parseInt(item.workstationinput.split("_")[1]);
            return num > max.num ? { num, item } : max;
          },
          { num: 0, item: null }
        ).num;

        lastwscode = highestWorkstation?.toString().padStart(2, "0");
      }

      let autoWorkStation = `W${selectedBranchCode?.toUpperCase()}${selectedUnitCode?.toUpperCase()}_${
        lastwscode === 0
          ? "01"
          : (Number(lastwscode) + 1)?.toString().padStart(2, "0")
      }_${(enableLoginName
        ? String(third)
        : employee?.username
      )?.toUpperCase()}`;

      if (
        workStationInputOldDatas?.company === selectedCompany &&
        workStationInputOldDatas?.branch === selectedBranch &&
        workStationInputOldDatas?.unit === selectedUnit
        //&& workStationInputOldDatas?.workmode === employee.workmode
      ) {
        setPrimaryWorkStationInput(
          workStationInputOldDatas?.workstationinput === "" ||
            workStationInputOldDatas?.workstationinput == undefined
            ? autoWorkStation
            : workStationInputOldDatas?.workstationinput
        );
      } else {
        setPrimaryWorkStationInput(autoWorkStation);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchHandlerEdit = async () => {
    try {
      let response = await axios.get(`${SERVICE.DRAFT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPrimaryWorkStationInput(response?.data?.sdraft?.workstationinput);
      setWorkStationInputOldDatas({
        company: response?.data?.sdraft?.company,
        branch: response?.data?.sdraft?.branch,
        unit: response?.data?.sdraft?.unit,
        workmode: response?.data?.sdraft?.workmode,
        ifoffice: response?.data?.sdraft?.workstationofficestatus,
        workstationinput: response?.data?.sdraft?.workstationinput,
      });
      setBankTodo(
        response?.data?.sdraft?.bankdetails?.length > 0
          ? response?.data?.sdraft?.bankdetails?.map((data) => ({
              ...data,
              accountstatus: data?.accountstatus ?? "In-Active",
            }))
          : []
      );
      setRoles(response?.data?.sdraft?.role);
      setTodo(response?.data?.sdraft?.boardingLog[0]?.todo);
      setoverallgrosstotal(response?.data?.sdraft.grosssalary);
      setModeexperience(response?.data?.sdraft.modeexperience);
      setTargetexperience(response?.data?.sdraft.targetexperience);
      setTargetpts(response?.data?.sdraft.targetpts);
      setLoginNotAllot(response?.data?.sdraft);
      fetchSuperVisorDropdowns(response?.data?.suser?.team);
      setAccessible({
        company: response?.data?.sdraft?.accessiblecompany
          ? response?.data?.sdraft?.accessiblecompany
          : "Please Select Company",
        branch: response?.data?.sdraft?.accessiblebranch
          ? response?.data?.sdraft?.accessiblebranch
          : "Please Select Branch",
        unit: response?.data?.sdraft?.accessibleunit
          ? response?.data?.sdraft?.accessibleunit
          : "Please Select Unit",
        responsibleperson: response?.data?.sdraft?.companyname,
      });

      const savedEmployee = {
        ...response?.data?.sdraft,
      };

      let allData = response?.data?.sdraft?.accessibletodo;

      if (allData?.length > 0) {
        let todos = allData?.map((data) => ({
          fromcompany: data.fromcompany,
          frombranch: data.frombranch,
          fromunit: data.fromunit,
          companycode: data.companycode,
          branchcode: data.branchcode,
          unitcode: data.unitcode,
          branchemail: data.branchemail,
          branchaddress: data.branchaddress,
          branchstate: data.branchstate,
          branchcity: data.branchcity,
          branchcountry: data.branchcountry,
          branchpincode: data.branchpincode,

          company: data?.company,
          branch: data?.branch,
          unit: data?.unit,
          employee: companycaps,
          employeecode: String(
            employee.wordcheck === true ? employeecodenew : employee.empcode
          ),
        }));
        setAccessibleTodo(todos);
        setAccessible({
          company: "Please Select Company",
          branch: "Please Select Branch",
          unit: "Please Select Unit",
          responsibleperson: companycaps,
          companycode: "",
          branchcode: "",
          unitcode: "",
          branchemail: "",
          branchaddress: "",
          branchstate: "",
          branchcity: "",
          branchcountry: "",
          branchpincode: "",
        });
      } else {
        setAccessible({
          company: "Please Select Company",
          branch: "Please Select Branch",
          unit: "Please Select Unit",
          responsibleperson: companycaps,
          companycode: "",
          branchcode: "",
          unitcode: "",
          branchemail: "",
          branchaddress: "",
          branchstate: "",
          branchcity: "",
          branchcountry: "",
          branchpincode: "",
        });
        setAccessibleTodo([]);
      }

      setGettingOldDatas(response?.data?.sdraft);
      if (response?.data?.suser?.assignExpLog?.lenth === 0) {
        setAssignExperience({
          ...assignExperience,
          updatedate: response?.data?.suser?.doj,
        });
      } else {
        setAssignExperience({
          ...assignExperience,
          assignExpMode: response?.data?.suser?.assignExpLog[0]?.expmode,
          assignExpvalue: response?.data?.suser?.assignExpLog[0]?.expval,
          assignEndExpDate:
            response?.data?.suser?.assignExpLog[0]?.endexpdate !== ""
              ? moment(
                  response?.data?.suser?.assignExpLog[0]?.endexpdate
                ).format("YYYY-MM-DD")
              : "",
          assignEndTarDate:
            response?.data?.suser?.assignExpLog[0]?.endtardate !== ""
              ? moment(
                  response?.data?.suser?.assignExpLog[0]?.endtardate
                ).format("YYYY-MM-DD")
              : "",
          assignEndTarvalue: response?.data?.suser?.assignExpLog[0]?.endtar,
          assignEndExpvalue: response?.data?.suser?.assignExpLog[0]?.endexp,
          updatedate:
            response?.data?.suser?.assignExpLog[0]?.updatedate !== ""
              ? moment(
                  response?.data?.suser?.assignExpLog[0]?.updatedate
                ).format("YYYY-MM-DD")
              : "",
        });
      }

      setReferenceTodo(response?.data?.sdraft?.referencetodo);

      setFirst(
        response?.data?.sdraft?.firstname?.toLowerCase().split(" ").join("")
      );
      setSecond(
        response?.data?.sdraft?.lastname?.toLowerCase().split(" ").join("")
      );

      // Find the corresponding Country, State, and City objects
      const country = Country.getAllCountries().find(
        (country) => country.name === savedEmployee.ccountry
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === savedEmployee.cstate
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === savedEmployee.ccity);

      // Find the corresponding Country, State, and City objects
      const countryp = Country.getAllCountries().find(
        (country) => country.name === savedEmployee.pcountry
      );
      const statep = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === savedEmployee.pstate
      );
      const cityp = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === savedEmployee.pcity);

      setSelectedCityc(city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCountryp(countryp);
      setSelectedStatep(statep);
      setSelectedCityp(cityp);
      setEmployee(savedEmployee);
      ShiftDropdwonsSecond(response?.data?.sdraft?.shiftgrouping);
      setEnableLoginName(response?.data?.sdraft?.usernameautogenerate);
      fetchEditareaNames(
        response?.data?.sdraft?.company,
        response?.data?.sdraft?.branch,
        response?.data?.sdraft?.floor
      );
      setFiles(response?.data?.sdraft?.files);
      setEduTodo(response?.data?.sdraft?.eduTodo);
      setAddQuaTodo(response?.data?.sdraft?.addAddQuaTodo);
      setWorkhistTodo(response?.data?.sdraft?.workhistTodo);
      setIsValidEmail(validateEmail(response?.data?.sdraft?.email));
      setSelectedCompany(response?.data?.sdraft?.company);
      setSelectedBranch(response?.data?.sdraft?.branch);
      setSelectedUnit(response?.data?.sdraft?.unit);
      fetchDptDesignation(response?.data?.sdraft?.department);

      setSelectedDesignation(response?.data?.sdraft?.designation);
      setSelectedTeam(response?.data?.sdraft?.team);
      setEnableWorkstation(response?.data?.sdraft?.enableworkstation);

      setSelectedWorkStation(response?.data?.sdraft?.workstation.slice(1));
      setSelectedOptionsWorkStation(
        Array.isArray(response?.data?.sdraft?.workstation)
          ? response?.data?.sdraft?.workstation.slice(1).map((x) => ({
              ...x,
              label: x,
              value: x,
            }))
          : []
      );
      setSelectedWorkStation(
        response?.data?.sdraft?.workstation.slice(
          1,
          response?.data?.sdraft?.workstation?.length
        )
      );
      setSelectedOptionsWorkStation(
        Array.isArray(response?.data?.sdraft?.workstation)
          ? response?.data?.sdraft?.workstation
              .slice(1, response?.data?.sdraft?.workstation?.length)
              ?.map((x) => ({
                ...x,
                label: x,
                value: x,
              }))
          : []
      );
      setSelectedOptionsCate(
        Array.isArray(response?.data?.sdraft?.boardingLog[0]?.weekoff)
          ? response?.data?.sdraft?.boardingLog[0]?.weekoff?.map((x) => ({
              ...x,
              label: x,
              value: x,
            }))
          : []
      );
      setEmployee({
        ...savedEmployee,
        empcode: savedEmployee.wordcheck === true ? "" : savedEmployee.empcode,
        ifoffice: savedEmployee.workstationofficestatus,
        bankname: "ICICI BANK - ICICI",
        accountstatus: "In-Active",
        panstatus: savedEmployee?.panno
          ? "Have PAN"
          : savedEmployee?.panrefno
          ? "Applied"
          : "Yet to Apply",
        age: calculateAge(savedEmployee?.dob),
        callingname:
          savedEmployee?.callingname === "" ||
          savedEmployee?.callingname == undefined
            ? savedEmployee?.legalname
            : savedEmployee?.callingname,
      });
      setEmployeecodenew(
        savedEmployee.wordcheck === true ? savedEmployee.empcode : ""
      );
      setCheckcode(savedEmployee.wordcheck);

      setValueWorkStation(
        response?.data?.sdraft?.workstation.slice(
          1,
          response?.data?.sdraft?.workstation?.length
        )
      );

      setValueCate(response?.data?.sdraft?.boardingLog[0]?.weekoff);
      setOldData({
        ...oldData,
        empcode: response?.data?.sdraft?.empcode,
        company: response?.data?.sdraft?.company,
        unit: response?.data?.sdraft?.unit,
        branch: response?.data?.sdraft?.branch,
        team: response?.data?.sdraft?.team,
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Designation Dropdowns
  const fetchDptDesignation = async (value) => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENTANDDESIGNATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = req?.data?.departmentanddesignationgroupings.filter(
        (data, index) => {
          return value === data.department;
        }
      );
      setDesignation(result);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [designationsFileNames, setDesignationsFileNames] = useState([]);
  const [fileNames, setfileNames] = useState("Please Select File Name");

  useEffect(() => {
    fetchCandidatedocumentdropdowns(selectedDesignation);
  }, [selectedDesignation]);

  //get all Areas.
  const fetchCandidatedocumentdropdowns = async (name) => {
    try {
      let res_candidate = await axios.get(SERVICE.CANDIDATEDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_candidate.data.candidatedocuments.filter(
        (data) => data.designation === name
      );

      const desigall = [
        ...data_set.map((d) => ({
          ...d,
          label: d.candidatefilename,
          value: d.candidatefilename,
        })),
      ];

      setDesignationsFileNames([
        ...desigall,
        { label: "Other", value: "Other" },
      ]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Designation Dropdowns
  const fetchDesignation = async () => {
    try {
      let req = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setDesignation(req?.data?.designation);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchEditareaNames = async (
    singlecompany,
    singlebranch,
    singlefloor
  ) => {
    try {
      let req = await axios.post(SERVICE.MANPOWERAREAFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(singlecompany),
        floor: String(singlefloor),
        branch: String(singlebranch),
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [getunitname, setgetunitname] = useState("");
  // Unit Dropdowns
  const fetchUnitNames = async () => {
    // let branch = getunitname ? getunitname : employee.branch;
    try {
      let req = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUnitNames(req.data.units);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //SkillSet DropDowns

  const fetchSkillSet = async () => {
    try {
      let req = await axios.get(SERVICE.SKILLSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSkillSet(
        req.data.skillsets.length > 0 &&
          req.data.skillsets.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Image Upload
  function handleChangeImage(e) {
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    if (e.target.files[0]?.size < maxFileSize) {
      let profileimage = document.getElementById("profileimage");
      var path = (window.URL || window.webkitURL).createObjectURL(
        profileimage.files[0]
      );
      toDataURL(path, function (dataUrl) {
        profileimage.setAttribute("value", String(dataUrl));
        setEmployee({ ...employee, profileimage: String(dataUrl) });
        return dataUrl;
      });
      setFile(URL.createObjectURL(e.target.files[0]));
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"File size is greater than 1MB, please upload a file below 1MB."}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  }

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  //image cropping

  const handleCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
    setSelectedFile(null);
    setGetImg(null);
    // handleChangeImage()
  };

  const handleClearImage = () => {
    setFile(null);
    setGetImg(null);
    setSelectedFile(null);
    setCroppedImage(null);
    setEmployee({ ...employee, profileimage: "" });
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
  const [getbranchname, setgetbranchname] = useState("");
  let branchname = getbranchname ? setgetbranchname : employee.company;

  // Branch Dropdowns
  const fetchbranchNames = async () => {
    try {
      let req = await axios.get(SERVICE.BRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBranchNames(req.data.branch);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Floor Dropdowns
  const fetchfloorNames = async () => {
    try {
      let req = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setFloorNames(
        req.data.floors.length > 0 &&
          req.data.floors.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Floor Dropdowns
  const fetchUsernames = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setrepotingtonames(req.data.users);
      setAllUsersLoginName(
        req?.data?.users
          ?.filter((item) => item._id !== id)
          ?.map((user) => user.username)
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Departments Dropdowns
  const fetchDepartments = async () => {
    try {
      let req = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDepartment(
        req.data.departmentdetails.length > 0 &&
          req.data.departmentdetails.map((d) => ({
            ...d,
            label: d.deptname,
            value: d.deptname,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Team Dropdowns
  const fetchteamdropdowns = async () => {
    try {
      let req = await axios.get(SERVICE.TEAMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setTeam(req.data.teamsdetails);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Shift Dropdowns
  const fetchShiftDropdowns = async () => {
    try {
      let req = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftTiming(
        req.data.shifts.length > 0 &&
          req.data.shifts.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [name, setUserNameEmail] = useState("");
  const [reportingtonames, setreportingtonames] = useState([]);
  // User Name Functionality
  const fetchUserName = async () => {
    try {
      let req = await axios.get(SERVICE.USER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      // setreportingtonames(req.data.users);
      req.data.users.filter((data) => {
        if (data._id !== id) {
          if (first + second === data.username) {
            setThird(
              first +
                second.slice(0, 1) +
                new Date(employee.dob ? employee.dob : "").getDate()
            );
            setUserNameEmail(
              first +
                second.slice(0, 1) +
                new Date(employee.dob ? employee.dob : "").getDate()
            );
          } else if (
            first + second + new Date(employee.dob).getDate() ==
            data.username
          ) {
            setThird(
              first +
                second.slice(0, 1) +
                new Date(employee.dob ? employee.dob : "").getMonth()
            );
            setUserNameEmail(
              first +
                second.slice(0, 1) +
                new Date(employee.dob ? employee.dob : "").getMonth()
            );
          } else if (first + second.slice(0, 1) === data.username) {
            setThird(first + second.slice(0, 2));
            setUserNameEmail(first + second.slice(0, 2));
          } else if (first + second.slice(0, 2) === data.username) {
            setThird(first + second.slice(0, 3));
            setUserNameEmail(first + second.slice(0, 3));
          }
        }
      });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchSuperVisorDropdowns = async (team) => {
    let res = await axios.post(SERVICE.HIERARCHY_REPORTING_TO, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      team: team,
    });

    const resultUsers =
      res?.data?.result?.length > 0
        ? res?.data?.result[0]?.result?.supervisorchoose
        : [];
    setreportingtonames(resultUsers);
  };
  //fetching companies
  const fetchCompanies = async () => {
    try {
      let productlist = await axios.get(SERVICE.COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCompanies(productlist?.data?.companies);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const backPage = useNavigate();

  //webcam

  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
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
  //id for login

  let loginid = localStorage.LoginUserId;
  //get user row  edit  function
  const getusername = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let user =
        res.data.users.length > 0 &&
        res.data.users.filter((data) => {
          if (loginid === data?._id) {
            setUsernameaddedby(data?.username);
            return data;
          }
        });
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [referenceTodo, setReferenceTodo] = useState([]);
  const [referenceTodoError, setReferenceTodoError] = useState({});
  const [singleReferenceTodo, setSingleReferenceTodo] = useState({
    name: "",
    relationship: "",
    occupation: "",
    contact: "",
    details: "",
  });

  const addReferenceTodoFunction = () => {
    const isNameMatch = referenceTodo?.some(
      (item) => item.name === singleReferenceTodo.name
    );
    const newErrorsLog = {};

    if (singleReferenceTodo.name === "") {
      newErrorsLog.name = (
        <Typography style={{ color: "red" }}>Name must be required</Typography>
      );
    } else if (isNameMatch) {
      newErrorsLog.duplicate = (
        <Typography style={{ color: "red" }}>
          Reference Already Exist!
        </Typography>
      );
    }

    if (
      singleReferenceTodo.contact !== "" &&
      singleReferenceTodo.contact?.length !== 10
    ) {
      newErrorsLog.contactno = (
        <Typography style={{ color: "red" }}>
          Contack No must be 10 digits required
        </Typography>
      );
    }
    if (singleReferenceTodo !== "" && Object.keys(newErrorsLog).length === 0) {
      setReferenceTodo([...referenceTodo, singleReferenceTodo]);
      setSingleReferenceTodo({
        name: "",
        relationship: "",
        occupation: "",
        contact: "",
        details: "",
      });
    }
    setReferenceTodoError(newErrorsLog);
  };
  const deleteReferenceTodo = (index) => {
    const newTasks = [...referenceTodo];
    newTasks.splice(index, 1);
    setReferenceTodo(newTasks);
    // handleCloseMod();
  };

  const handlechangereferencecontactno = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value?.slice(0, 10);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      setSingleReferenceTodo({ ...singleReferenceTodo, contact: inputValue });
    }
  };

  const handlechangecpincode = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e?.target?.value?.slice(0, 6);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setEmployee({ ...employee, cpincode: inputValue });
    }
  };
  const handlechangeppincode = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e?.target?.value?.slice(0, 6);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setEmployee({ ...employee, ppincode: inputValue });
    }
  };

  // Itern Courses Dropdowns
  const fetchInternCourses = async () => {
    try {
      let req = await axios.get(SERVICE.INTERNCOURSE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setInternCourseNames(
        req.data.internCourses.length > 0 &&
          req.data.internCourses.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleCompanyChange = (event) => {
    const selectedCompany = event.value;
    setSelectedCompany(selectedCompany);
    setSelectedBranch("");
    setSelectedUnit("");
    setSelectedTeam("");
    setAreaNames([]);
    setEmployee({ ...employee, floor: "", area: "" });
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);
  };

  useEffect(() => {
    const branchCode = filteredBranches.filter(
      (item) => item.name === selectedBranch
    );
    setSelectedBranchCode(branchCode[0]?.code.slice(0, 2));

    const unitCode = filteredUnits.filter((item) => item.name === selectedUnit);
    setSelectedUnitCode(unitCode[0]?.code.slice(0, 2));
  }, [selectedBranch, selectedUnit]);

  const handleBranchChange = (event) => {
    const selectedBranch = event.value;
    const branchCode = filteredBranches.filter(
      (item) => item.name === event.value
    );
    setSelectedBranchCode(branchCode[0]?.code.slice(0, 2));
    setSelectedBranch(selectedBranch);
    setSelectedUnit("");
    setSelectedTeam("");
    setAreaNames([]);
    setEmployee({ ...employee, floor: "", area: "" });
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);
  };

  const handleUnitChange = (event) => {
    const selectedUnit = event.value;
    const unitCode = filteredUnits.filter((item) => item.name === event.value);
    setSelectedUnitCode(unitCode[0]?.code.slice(0, 2));
    setSelectedUnit(selectedUnit);
    setSelectedTeam("");
    setPrimaryWorkStation("Please Select Primary Work Station");
    setSelectedOptionsWorkStation([]);
    setValueWorkStation([]);
  };

  const handleTeamChange = (event) => {
    const selectedTeam = event.value;
    setSelectedTeam(selectedTeam);
    checkHierarchyName(selectedTeam, "Team");
    fetchSuperVisorDropdowns(selectedTeam);
    setEmployee((prev) => ({
      ...prev,
      reportingto: "",
    }));
  };

  const [roles, setRoles] = useState([]);

  const fetchDesignationgroup = async (e) => {
    try {
      let res_designationgroup = await axios.get(SERVICE.DESIGNATIONGRP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let res_designation = await axios.get(SERVICE.DESIGNATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let getGroupName = res_designation?.data?.designation
        .filter((data) => {
          return data.name === e.value;
        })
        .map((item) => item.group);

      let getRoles = res_designationgroup?.data?.desiggroup
        ?.filter((data) => {
          return getGroupName.includes(data.name);
        })
        .flatMap((data) => data.roles);

      let uniqueRoles = [...new Set(getRoles)];
      setRoles(uniqueRoles);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleDesignationChange = async (event) => {
    const selectedDesignation = event.value;
    setSelectedDesignation(selectedDesignation);
    fetchDesignationgroup(event);
    let req_designation = await axios.get(SERVICE.DESIGNATION, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });
    const groupname = req_designation?.data?.designation?.find(
      (data) => data.name === selectedDesignation
    );

    setDesignationGroup(groupname ? groupname?.group : "");
    checkHierarchyName(selectedDesignation, "Designation");
    setEmployee((prev) => ({
      ...prev,
      employeecount: event?.systemcount ?? "",
    }));
  };

  const filteredBranches = branchNames?.filter(
    (b) => b.company === selectedCompany
  );

  const filteredUnits = unitNames?.filter((u) => u.branch === selectedBranch);

  const filteredTeams = team?.filter(
    (t) =>
      t.unit === selectedUnit &&
      t.branch === selectedBranch &&
      t.department === employee.department
  );

  useEffect(() => {
    fetchCompanies();
    fetchfloorNames();
    fetchDepartments();
    fetchteamdropdowns();
    fetchShiftDropdowns();
    fetchWorkStation();
    fetchDesignation();
    fetchSkillSet();
    fetchHandlerEdit();
    fetchInternCourses();
    fetchUsernames();
    fetchDepartmentMonthsets();
    fetchCategoryEducation();
    fetchUserDatasLimitedEmpcodeAll();
  }, []);

  useEffect(() => {
    fetchbranchNames();
    ShiftGroupingDropdwons();
    fetchUnitNames();
    getusername();
  }, []);

  useEffect(() => {
    fetchbranchNames();
    fetchUnitNames();
  }, [branchname]);

  useEffect(() => {
    ShowErrMess();
    fetchUserName();
    setThird(first + second.slice(0, 1));
    setUserNameEmail(first + second.slice(0, 1));
  }, [first, second, name]);

  //ERROR MESSAGESE
  const ShowErrMess = () => {
    if (first.length == "" || second.length == 0) {
      setErrmsg("Unavailable");
    } else if (third.length >= 1) {
      setErrmsg("Available");
    }
  };

  const fetchareaNames = async (e) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  let conditions = [
    employee.prefix !== "",
    employee.firstname !== "",
    employee.lastname !== "",
    employee.legalname !== "",
    employee.fathername !== "",
    employee.mothername !== "",
    employee.gender !== "",
    employee.maritalstatus !== "",
    employee.maritalstatus === "Married" &&
      employee.dom !== "" &&
      employee.dob !== "",
    employee.bloodgroup !== "",
    employee.profileimage !== "",
    employee.location !== "",
    employee.email !== "",
    employee.contactpersonal !== "",
    employee.contactfamily !== "",
    employee.emergencyno !== "",
    employee.doj !== "",
    employee.dot !== "",
    employee.aadhar !== "",
    employee.panno !== "",

    employee.contactno !== "",
    employee.details !== "",

    employee.username !== "",
    employee.password !== "",
    employee.companyname !== "",

    employee.company !== "",
    employee.branch !== "",
    employee.unit !== "",
    employee.floor !== "",
    employee.department !== "",
    employee.team !== "",
    employee.designation !== "",
    employee.shifttiming !== "",
    employee.reportingto !== "",
    employee.empcode !== "",

    employee.pdoorno !== "",
    employee.pstreet !== "",
    employee.parea !== "",
    employee.plandmark !== "",
    employee.ptaluk !== "",
    employee.ppincode !== "",
    employee.ppost !== "",
    selectedCountryp !== "",
    selectedStatep !== "",
    selectedCityp !== "",
    !employee.samesprmnt ? employee.cdoorno : employee.pdoorno !== "",
    !employee.samesprmnt ? employee.cstreet : employee.pstreet !== "",
    !employee.samesprmnt ? employee.carea : employee.parea !== "",
    !employee.samesprmnt ? employee.clandmark : employee.plandmark !== "",
    !employee.samesprmnt ? employee.ctaluk : employee.ptaluk !== "",
    !employee.samesprmnt ? employee.cpost : employee.ppost !== "",
    !employee.samesprmnt ? employee.cpincode : employee.ppincode !== "",

    files.length > 0,
    addAddQuaTodo.length > 0,
    eduTodo.length > 0,
    workhistTodo.length > 0,
  ];

  const result = conditions.reduce(
    (acc, val) => {
      acc[val]++;
      return acc;
    },
    { true: 0, false: 0 }
  );

  const totalFields = 61;

  const completionPercentage = (result.true / totalFields) * 100;

  //Add employee details to the database
  const createUser = async () => {
    setLoading(true);
    setUserNameEmail(third);
    try {
      let hierarchyCheck = await axios.post(SERVICE.CHECKHIERARCHYADDNEWEMP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(selectedCompany),
        department: String(employee.department),
        designation: String(selectedDesignation),
        branch: String(selectedBranch),
        // workstation: String(selectedWorkStation),
        team: String(selectedTeam),
        unit: String(selectedUnit),
      });
      let hierarchyData = hierarchyCheck.data.resultString;

      if (hierarchyData && hierarchyData.length > 0) {
        function findUniqueEntries(array) {
          const seen = new Map();
          array.forEach((obj) => {
            const key = `${obj.company}-${obj.designationgroup}-${obj.department}-${obj.unit}-${obj.supervisorchoose[0]}-${obj.level}-${obj.mode}-${obj.branch}-${obj.team}`;
            if (!seen.has(key)) {
              seen.set(key, obj);
            }
          });
          return Array.from(seen.values());
        }

        // Find unique entries in the array
        const uniqueEntries = findUniqueEntries(hierarchyData);

        if (uniqueEntries.length > 0) {
          for (const item of uniqueEntries) {
            const res_queue = await axios.post(SERVICE.HIRERARCHI_CREATE, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },

              company: String(item.company),
              designationgroup: String(item.designationgroup),
              department: String(item.department),
              branch: String(item.branch),
              unit: String(item.unit),
              team: String(item.team),
              supervisorchoose: String(item.supervisorchoose),
              mode: String(item.mode),
              level: String(item.level),
              control: String(item.control),
              employeename: String(companycaps),
              access: "all",
              action: Boolean(true),
              empbranch: String(selectedBranch),
              empunit: String(selectedUnit),
              empcode: String(
                employee.wordcheck === false
                  ? getDepartment === "Internship"
                    ? newval1
                    : newval
                  : employee.empcode
              ),

              empteam: String(selectedTeam),
              addedby: [
                {
                  name: String(usernameaddedby),
                  date: String(new Date()),
                },
              ],
            });
          }
        } else {
          console.log("no update");
        }
      }
      const currentDate = moment();

      let trimmedWorkstation =
        primaryWorkStation == "Please Select Primary Work Station"
          ? []
          : primaryWorkStation;

      let employees_data = await axios.post(SERVICE.USER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        firstname: String(employee.firstname),
        lastname: String(employee.lastname),
        legalname: String(employee.legalname),
        callingname: String(employee.callingname),
        prefix: String(employee.prefix),
        fathername: String(employee.fathername),
        mothername: String(employee.mothername),
        gender: String(employee.gender),
        maritalstatus: String(employee.maritalstatus),
        dom: String(employee.dom),
        dob: String(employee.dob),
        bloodgroup: String(employee.bloodgroup),

        location: String(employee.location),
        email: String(employee.email),
        companyemail: String(employee.companyemail),
        contactpersonal: String(employee.contactpersonal),
        contactfamily: String(employee.contactfamily),
        emergencyno: String(employee.emergencyno),
        doj: String(employee.doj),
        dot: String(employee.dot),
        aadhar: String(employee.aadhar),
        panno: String(employee.panstatus === "Have PAN" ? employee.panno : ""),
        panstatus: String(employee.panstatus),
        panrefno: String(
          employee.panstatus === "Applied" ? employee.panrefno : ""
        ),

        referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
        contactno: String(employee.contactno),
        details: String(employee.details),
        username: enableLoginName ? String(third) : employee.username,
        usernameautogenerate: Boolean(enableLoginName),
        workmode: String(employee.workmode),
        password: String(employee.password),
        originalpassword: String(employee.password),
        companyname: String(companycaps),
        company: String(selectedCompany),
        role: roles,
        branch: String(selectedBranch),
        unit: String(selectedUnit),
        floor: String(employee.floor),
        area: String(employee.area),
        department: String(employee.department),
        team: String(selectedTeam),
        designation: String(selectedDesignation),
        shifttiming: String(employee.shifttiming),
        shifttype: String(employee.shifttype),
        shiftgrouping: String(employee.shiftgrouping),

        boardingLog: [
          {
            username: companycaps,
            company: String(selectedCompany),
            startdate: String(employee.doj),
            time: moment().format("HH:mm"),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            floor: String(employee.floor),
            area: String(employee.area),
            workstation:
              employee.workmode !== "Remote"
                ? valueWorkStation.length === 0
                  ? trimmedWorkstation
                  : [primaryWorkStation, ...valueWorkStation]
                : [primaryWorkStation, ...valueWorkStation],
            shifttype: String(employee.shifttype),
            shifttiming: String(employee.shifttiming),
            shiftgrouping: String(employee.shiftgrouping),
            weekoff: [...valueCate],
            todo: employee.shifttype === "Standard" ? [] : [...todo],
            logeditedby: [],
            updateddatetime: String(new Date()),
            updatedusername: String(isUserRoleAccess.companyname),
            logcreation: String("user"),
            ischangecompany: true,
            ischangebranch: true,
            ischangeunit: true,
            ischangeteam: true,
          },
        ],

        reportingto: String(employee.reportingto),
        enableworkstation:
          employee.workmode !== "Remote"
            ? Boolean(enableWorkstation)
            : Boolean(false),
        workstation:
          employee.workmode !== "Remote"
            ? valueWorkStation.length === 0
              ? trimmedWorkstation
              : [primaryWorkStation, ...valueWorkStation]
            : [primaryWorkStation, ...valueWorkStation],
        workstationinput: String(
          employee.workmode === "Remote" || employee.ifoffice
            ? primaryWorkStationInput
            : ""
        ),
        workstationofficestatus: Boolean(employee.ifoffice),
        empcode: String(
          employee.wordcheck === false
            ? getDepartment === "Internship"
              ? newval1
              : newval
            : employee.empcode
        ),
        wordcheck: Boolean(employee.wordcheck),
        intStartDate: String(employee.intStartDate),
        intEndDate: String(employee.intEndDate),
        modeOfInt: String(employee.modeOfInt),
        intDuration: String(employee.intDuration),

        pdoorno: String(employee.pdoorno),
        pstreet: String(employee.pstreet),
        parea: String(employee.parea),
        plandmark: String(employee.plandmark),
        ptaluk: String(employee.ptaluk),
        ppost: String(employee.ppost),
        ppincode: String(employee.ppincode),

        pcountry: String(
          selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
        ),
        pstate: String(
          selectedStatep?.name == undefined ? "" : selectedStatep?.name
        ),
        pcity: String(
          selectedCityp?.name == undefined ? "" : selectedCityp?.name
        ),

        samesprmnt: Boolean(employee.samesprmnt),
        cdoorno: String(
          !employee.samesprmnt ? employee.cdoorno : employee.pdoorno
        ),
        cstreet: String(
          !employee.samesprmnt ? employee.cstreet : employee.pstreet
        ),
        carea: String(!employee.samesprmnt ? employee.carea : employee.parea),
        clandmark: String(
          !employee.samesprmnt ? employee.clandmark : employee.plandmark
        ),
        ctaluk: String(
          !employee.samesprmnt ? employee.ctaluk : employee.ptaluk
        ),
        cpost: String(!employee.samesprmnt ? employee.cpost : employee.ppost),
        cpincode: String(
          !employee.samesprmnt ? employee.cpincode : employee.ppincode
        ),

        ccountry: String(
          !employee.samesprmnt ? selectedCountryc?.name : selectedCountryp?.name
        ),
        cstate: String(
          !employee.samesprmnt ? selectedStatec?.name : selectedStatep?.name
        ),
        ccity: String(
          !employee.samesprmnt ? selectedCityc?.name : selectedCityp?.name
        ),

        bankdetails: bankTodo,

        eduTodo: [...eduTodo],
        addAddQuaTodo: [...addAddQuaTodo],
        workhistTodo: [...workhistTodo],
        status: isFormComplete,
        experience: month,
        clickedGenerate: String("Clicked"),
        percentage: completionPercentage,
        enquirystatus: String(
          employee.enquirystatus === "Please Select Status"
            ? "Users Purpose"
            : employee.enquirystatus
        ),
        employeecount: String(employee?.employeecount),
        systemmode: String(employee?.systemmode ?? "Active"),

        assignExpLog: [
          {
            expmode: String(assignExperience.assignExpMode),
            expval: String(assignExperience.assignExpvalue),

            endexp: String(assignExperience.assignEndExpvalue),
            endexpdate:
              assignExperience.assignEndExpvalue === "Yes"
                ? String(assignExperience.assignEndExpDate)
                : "",
            endtar: String(assignExperience.assignEndTarvalue),
            endtardate:
              assignExperience.assignEndTarvalue === "Yes"
                ? String(assignExperience.assignEndTarDate)
                : "",
            updatedate: String(assignExperience.updatedate),
            type: String(""),
            updatename: String(""),
            salarycode: String(""),
            basic: String("0"),
            hra: String("0"),
            conveyance: String("0"),
            gross: String("0"),
            medicalallowance: String("0"),
            productionallowance: String("0"),
            otherallowance: String("0"),
            productionallowancetwo: String("0"),
            pfdeduction: false,
            esideduction: false,
            ctc: String(""),
            date: String(new Date()),
          },
        ],

        assignExpMode: String(assignExperience.assignExpMode),

        assignExpvalue: String(assignExperience.assignExpvalue),

        endexp: String(assignExperience.assignEndExpvalue),
        endexpdate:
          assignExperience.assignEndExpvalue === "Yes"
            ? String(assignExperience.assignEndExpDate)
            : "",
        endtar: String(assignExperience.assignEndTarvalue),
        endtardate:
          assignExperience.assignEndTarvalue === "Yes"
            ? String(assignExperience.assignEndTarDate)
            : "",
        updatedate: String(assignExperience.updatedate),
        process: String(loginNotAllot.process),
        processduration: String(loginNotAllot.processduration),
        processtype: String(loginNotAllot.processtype),
        date: formattedDate,
        time: String(loginNotAllot.time),
        timemins: String(loginNotAllot.timemins),

        grosssalary: String(overallgrosstotal),
        modeexperience: String(modeexperience),
        targetexperience: String(targetexperience),
        targetpts: String(targetpts),

        departmentlog: [
          {
            userid: String(
              employee.wordcheck === false
                ? getDepartment === "Internship"
                  ? newval1
                  : newval
                : employee.empcode
            ),
            username: String(companycaps),
            department: String(employee.department),
            startdate: String(employee?.doj),
            time: String(getCurrentTime()),
            branch: String(selectedBranch),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            logeditedby: [],
            unit: String(selectedUnit),
            team: String(selectedTeam),
            status: Boolean(employee.statuss),
            companyname: String(selectedCompany),
          },
        ],

        designationlog: [
          {
            username: String(companycaps),
            designation: String(selectedDesignation),
            startdate: String(employee?.doj),
            time: String(getCurrentTime()),
            branch: String(selectedBranch),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            logeditedby: [],
            companyname: String(selectedCompany),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            date: String(employee?.doj),
          },
        ],
        processlog: [
          {
            company: String(selectedCompany),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            empname: String(companycaps),
            updatedusername: String(isUserRoleAccess.companyname),
            updateddatetime: String(new Date()),
            logeditedby: [],
            process: String(loginNotAllot.process),
            processduration: String(loginNotAllot.processduration),
            processtype: String(loginNotAllot.processtype),
            date: String(employee?.doj),
            time: `${loginNotAllot.time}:${loginNotAllot?.timemins}`,
          },
        ],
        employee: [
          {
            username: String(companycaps),
            company: String(selectedCompany),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            shifttiming: String(employee.shifttiming),
            shiftgrouping: String(employee.shiftgrouping),
            process: String(
              loginNotAllot.process === "Please Select Process"
                ? ""
                : loginNotAllot.process
            ),
            startdate: formattedDate,
            time: String(getCurrentTime()),
          },
        ],

        addedby: [
          {
            name: String(usernameaddedby),
            date: String(new Date()),
          },
        ],
      });

      await Promise.all(
        accessibleTodo?.map(async (data) => {
          await axios.post(
            SERVICE.ASSIGNBRANCH_CREATE,
            {
              fromcompany: data.fromcompany,
              frombranch: data.frombranch,
              fromunit: data.fromunit,
              company: selectedCompany,
              branch: selectedBranch,
              unit: selectedUnit,
              companycode: data.companycode,
              branchcode: data.branchcode,
              branchemail: data.branchemail,
              branchaddress: data.branchaddress,
              branchstate: data.branchstate,
              branchcity: data.branchcity,
              branchcountry: data.branchcountry,
              branchpincode: data.branchpincode,
              unitcode: data.unitcode,
              employee: companycaps,
              employeecode: String(
                employee.wordcheck === false ? newval : employee.empcode
              ),
              addedby: [
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        })
      );

      let employeeDocuments = await axios.post(
        SERVICE.EMPLOYEEDOCUMENT_CREATE,
        {
          profileimage: croppedImage
            ? String(croppedImage)
            : employee.profileimage,
          files: [...files],
          commonid: employees_data?.data?.user?._id,
          empcode: String(
            employee.wordcheck === false
              ? getDepartment === "Internship"
                ? newval1
                : newval
              : employee.empcode
          ),
          companyname: String(companycaps),
          type: String("Employee"),
          addedby: [
            {
              name: String(usernameaddedby),
              date: String(new Date()),
            },
          ],
        }
      );

      const response = await fetch(SERVICE.EMAIL_SENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          message,
          email,
          company: selectedCompany,
        }),
      });
      if (response.ok) {
        setStatus("Email sent successfully");
      } else {
        setStatus("Error sending email");
      }

      await fetchUserName();
      // handleEmailSubmit(e);

      //birthday mail
      const birthdayresponse = await fetch(SERVICE.BIRTHDAYEMAIL_SENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          date: moment(employee.dob)
            .year(currentDate.year())
            .format("YYYY-MM-DD"),
          time: "06:00",
          name,
          company: selectedCompany,
        }),
      });

      //work anniversary
      const weddingresponse = await fetch(SERVICE.WORKANNIVERSARYEMAIL_SENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          date: moment(employee.doj)
            .year(currentDate.year())
            .format("YYYY-MM-DD"),
          time: "06:00",
          name,
          company: selectedCompany,
        }),
      });
      if (weddingresponse.ok) {
        setStatus("Work Anniversary Email sent successfully");
      } else {
        setStatus("Error sending email");
      }

      //WEDIING EMAIL
      if (employee.maritalstatus === "Married") {
        const weddingresponse = await fetch(SERVICE.WEDDINGEMAIL_SENT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            date: moment(employee.dom)
              .year(currentDate.year())
              .format("YYYY-MM-DD"),
            time: "06:00",
            name,
            company: selectedCompany,
          }),
        });
        if (weddingresponse.ok) {
          setStatus("Wedding Anniversary Email sent successfully");
        } else {
          setStatus("Error sending email");
        }
      }

      let deleteDraft = await axios.delete(`${SERVICE.DRAFT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();

      if (employee.enquirystatus === "Enquiry Purpose") {
        backPage("/enquirypurposelist");
      } else {
        backPage("/list");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [companycaps, setcompanycaps] = useState("");
  const [nextBtnLoading, setNextBtnLoading] = useState(false);

  const draftduplicateCheck = async () => {
    try {
      const newErrors = {};
      const missingFields = [];

      // Check the validity of field1

      if (!employee.firstname) {
        newErrors.firstname = (
          <Typography style={{ color: "red" }}>
            First name must be required
          </Typography>
        );
        missingFields.push("First Name");
      }

      if (!employee.lastname) {
        newErrors.lastname = (
          <Typography style={{ color: "red" }}>
            {" "}
            Last Name be required{" "}
          </Typography>
        );
      } else if (employee.lastname.length < 3) {
        newErrors.lastname = (
          <Typography style={{ color: "red" }}>
            {" "}
            Last Name must be 3 characters!{" "}
          </Typography>
        );
        missingFields.push("Last Name");
      }

      if (!employee.legalname) {
        newErrors.legalname = (
          <Typography style={{ color: "red" }}>
            Legal name must be required
          </Typography>
        );
        missingFields.push("Legal Name");
      }
      if (!employee.callingname) {
        newErrors.callingname = (
          <Typography style={{ color: "red" }}>
            Calling Name must be required
          </Typography>
        );
        missingFields.push("Calling Name");
      }
      if (
        employee.callingname !== "" &&
        employee.legalname !== "" &&
        employee.callingname?.toLowerCase() ===
          employee.legalname?.toLowerCase()
      ) {
        newErrors.callingname = (
          <Typography style={{ color: "red" }}>
            Legal Name and Calling Name can't be same
          </Typography>
        );
        missingFields.push("Legal Name and Calling Name can't be same");
      }
      if (!employee.email) {
        newErrors.email = (
          <Typography style={{ color: "red" }}>
            Email must be required
          </Typography>
        );
        missingFields.push("Email");
      } else if (!isValidEmail) {
        newErrors.email = (
          <Typography style={{ color: "red" }}>
            Please enter valid email
          </Typography>
        );
        missingFields.push("Enter valid Email");
      }

      if (!employee.emergencyno) {
        newErrors.emergencyno = (
          <Typography style={{ color: "red" }}>
            Emergency no must be required
          </Typography>
        );
        missingFields.push("Emergency No");
      } else if (employee.emergencyno.length !== 10) {
        newErrors.emergencyno = (
          <Typography style={{ color: "red" }}>
            Emergency no must be 10 digits required
          </Typography>
        );
        missingFields.push("Enter valid Emergency No");
      }
      if (employee.maritalstatus === "Married" && !employee.dom) {
        newErrors.dom = (
          <Typography style={{ color: "red" }}>DOM must be required</Typography>
        );
        missingFields.push("Date of Marriage ");
      }
      if (employee.contactfamily === "") {
        newErrors.contactfamily = (
          <Typography style={{ color: "red" }}>
            Contact(Family) no must be required
          </Typography>
        );
        missingFields.push("Contact(Family)");
      }
      if (
        employee.contactfamily !== "" &&
        employee.contactfamily.length !== 10
      ) {
        newErrors.contactfamily = (
          <Typography style={{ color: "red" }}>
            Contact(Family) no must be 10 digits required
          </Typography>
        );
        missingFields.push("Enter valid Contact(Family) No");
      }
      if (employee.contactpersonal === "") {
        newErrors.contactpersonal = (
          <Typography style={{ color: "red" }}>
            Contact(personal) no must be required
          </Typography>
        );
        missingFields.push("Contact(personal)");
      }

      if (
        employee.contactpersonal !== "" &&
        employee.contactpersonal.length !== 10
      ) {
        newErrors.contactpersonal = (
          <Typography style={{ color: "red" }}>
            Contact(personal) no must be 10 digits required
          </Typography>
        );
        missingFields.push("Enter valid Contact(personal)");
      }

      if (employee?.panno !== "" && employee?.panno?.length !== 10) {
        newErrors.panno = (
          <Typography style={{ color: "red" }}>
            PAN No must be 10 digits required
          </Typography>
        );
        missingFields.push("PAN No");
      }

      if (employee?.panno === "" && employee?.panstatus === "Have PAN") {
        newErrors.panno = (
          <Typography style={{ color: "red" }}>
            PAN No must be required
          </Typography>
        );
        missingFields.push("PAN Card Status");
      } else if (
        !PanValidate(employee?.panno) &&
        employee?.panstatus === "Have PAN"
      ) {
        newErrors.panno = (
          <Typography style={{ color: "red" }}>
            Please Enter Valid PAN Number
          </Typography>
        );
        missingFields.push("Enter Valid PAN Number");
      }

      if (employee?.panrefno === "" && employee?.panstatus === "Applied") {
        newErrors.panrefno = (
          <Typography style={{ color: "red" }}>
            Application Reference No must be required
          </Typography>
        );
        missingFields.push("Enter valid Application Reference");
      }

      if (!employee.dob) {
        newErrors.dob = (
          <Typography style={{ color: "red" }}>DOB must be required</Typography>
        );
        missingFields.push("Date of Birth");
      }

      if (!employee.aadhar) {
        newErrors.aadhar = (
          <Typography style={{ color: "red" }}>
            {" "}
            Aadhar must be required{" "}
          </Typography>
        );
        missingFields.push("Aadhar No");
      } else if (employee.aadhar.length < 12) {
        newErrors.aadhar = (
          <Typography style={{ color: "red" }}>
            {" "}
            Please Enter valid Aadhar Number{" "}
          </Typography>
        );
        missingFields.push("Enter valid Aadhar No");
      } else if (!AadharValidate(employee.aadhar)) {
        newErrors.aadhar = (
          <Typography style={{ color: "red" }}>
            {" "}
            Please Enter valid Aadhar Number{" "}
          </Typography>
        );
        missingFields.push("Enter valid Aadhar No");
      }

      setErrors(newErrors);

      // If there are missing fields, show an alert with the list of them
      if (missingFields.length > 0) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p
              style={{ fontSize: "20px", fontWeight: 900 }}
            >{`Please fill in the following fields: ${missingFields.join(
              ", "
            )}`}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        if (Object.keys(newErrors).length === 0) {
          function cleanString(str) {
            const trimmed = str.trim();
            const cleaned = trimmed.replace(/[^a-zA-Z0-9 ]/g, "");

            return cleaned.length > 0 ? cleaned : str;
          }

          setNextBtnLoading(true);
          let companynamecheck = await axios.post(
            SERVICE.COMPANYNAME_DUPLICATECHECK_CREATE,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              firstname: employee.firstname,
              lastname: employee.lastname,
              dob: employee.dob,
              // employeename: `${employee.firstname?.toUpperCase()}.${employee.lastname?.toUpperCase()}`,
              employeename: `${cleanString(
                employee.firstname?.toUpperCase().trim()
              )}.${cleanString(employee.lastname?.toUpperCase().trim())}`,
            }
          );

          // companycaps = companynamecheck?.data?.uniqueCompanyName;
          setcompanycaps(companynamecheck?.data?.uniqueCompanyName);
          setNextBtnLoading(false);

          nextStep(false);
        }
      }
    } catch (err) {
      setNextBtnLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Add employee details to the the Draft database
  const SendDraftEdit = async () => {
    let trimmedWorkstation =
      primaryWorkStation == "Please Select Primary Work Station"
        ? []
        : primaryWorkStation;
    try {
      setLoading(true);
      let employees_draft = await axios.put(`${SERVICE.DRAFT_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        firstname: String(employee.firstname),
        lastname: String(employee.lastname),
        legalname: String(employee.legalname),
        callingname: String(employee.callingname),
        prefix: String(employee.prefix),
        fathername: String(employee.fathername),
        mothername: String(employee.mothername),
        gender: String(employee.gender),
        maritalstatus: String(employee.maritalstatus),
        dom: String(employee.dom),
        dob: String(employee.dob),
        bloodgroup: String(employee.bloodgroup),
        profileimage: croppedImage
          ? String(croppedImage)
          : employee.profileimage,

        location: String(employee.location),
        email: String(employee.email),
        contactpersonal: String(employee.contactpersonal),
        contactfamily: String(employee.contactfamily),
        emergencyno: String(employee.emergencyno),
        doj: String(employee.doj),
        dot: String(employee.dot),
        aadhar: String(employee.aadhar),
        panno: String(employee.panstatus === "Have PAN" ? employee.panno : ""),
        panstatus: String(employee.panstatus),
        panrefno: String(
          employee.panstatus === "Applied" ? employee.panrefno : ""
        ),

        referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
        contactno: String(employee.contactno),
        details: String(employee.details),
        username: enableLoginName ? String(third) : employee.username,
        usernameautogenerate: Boolean(enableLoginName),
        workmode: String(employee.workmode),
        password: String(employee.password),
        originalpassword: String(employee.password),
        companyname: String(companycaps),
        company: String(selectedCompany),
        role: roles,
        branch: String(selectedBranch),
        unit: String(selectedUnit),
        floor: String(employee.floor),
        area: String(employee.area),
        department: String(employee.department),
        team: String(selectedTeam),
        designation: String(selectedDesignation),
        shifttiming: String(employee.shifttiming),
        shifttype: String(employee.shifttype),
        shiftgrouping: String(employee.shiftgrouping),
        files: [...files],
        accessibletodo: accessibleTodo,
        companyemail: String(employee.companyemail),
        employeecount: String(employee?.employeecount),
        systemmode: String(employee?.systemmode ?? "Active"),

        boardingLog: [
          {
            username: companycaps,
            company: String(selectedCompany),
            startdate: String(employee.doj),
            time: moment().format("HH:mm"),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            floor: String(employee.floor),
            area: String(employee.area),
            workstation:
              employee.workmode !== "Remote"
                ? valueWorkStation.length === 0
                  ? trimmedWorkstation
                  : [primaryWorkStation, ...valueWorkStation]
                : [primaryWorkStation, ...valueWorkStation],
            shifttype: String(employee.shifttype),
            shifttiming: String(employee.shifttiming),
            shiftgrouping: String(employee.shiftgrouping),
            weekoff: [...valueCate],
            todo: employee.shifttype === "Standard" ? [] : [...todo],
            logeditedby: [],
            updateddatetime: String(new Date()),
            updatedusername: String(isUserRoleAccess.companyname),
            logcreation: String("user"),
            ischangecompany: true,
            ischangebranch: true,
            ischangeunit: true,
            ischangeteam: true,
          },
        ],

        reportingto: String(employee.reportingto),
        enableworkstation:
          employee.workmode !== "Remote"
            ? Boolean(enableWorkstation)
            : Boolean(false),
        workstation:
          employee.workmode !== "Remote"
            ? valueWorkStation.length === 0
              ? trimmedWorkstation
              : [primaryWorkStation, ...valueWorkStation]
            : [primaryWorkStation, ...valueWorkStation],
        workstationinput: String(
          employee.workmode === "Remote" || employee.ifoffice
            ? primaryWorkStationInput
            : ""
        ),
        workstationofficestatus: Boolean(employee.ifoffice),
        empcode: String(
          employee.wordcheck === false
            ? getDepartment === "Internship"
              ? newval1
              : newval
            : employee.empcode
        ),
        wordcheck: Boolean(employee.wordcheck),
        intStartDate: String(employee.intStartDate),
        intEndDate: String(employee.intEndDate),
        modeOfInt: String(employee.modeOfInt),
        intDuration: String(employee.intDuration),

        pdoorno: String(employee.pdoorno),
        pstreet: String(employee.pstreet),
        parea: String(employee.parea),
        plandmark: String(employee.plandmark),
        ptaluk: String(employee.ptaluk),
        ppost: String(employee.ppost),
        ppincode: String(employee.ppincode),

        pcountry: String(
          selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
        ),
        pstate: String(
          selectedStatep?.name == undefined ? "" : selectedStatep?.name
        ),
        pcity: String(
          selectedCityp?.name == undefined ? "" : selectedCityp?.name
        ),

        samesprmnt: Boolean(employee.samesprmnt),
        cdoorno: String(
          !employee.samesprmnt ? employee.cdoorno : employee.pdoorno
        ),
        cstreet: String(
          !employee.samesprmnt ? employee.cstreet : employee.pstreet
        ),
        carea: String(!employee.samesprmnt ? employee.carea : employee.parea),
        clandmark: String(
          !employee.samesprmnt ? employee.clandmark : employee.plandmark
        ),
        ctaluk: String(
          !employee.samesprmnt ? employee.ctaluk : employee.ptaluk
        ),
        cpost: String(!employee.samesprmnt ? employee.cpost : employee.ppost),
        cpincode: String(
          !employee.samesprmnt ? employee.cpincode : employee.ppincode
        ),

        ccountry: String(
          !employee.samesprmnt ? selectedCountryc?.name : selectedCountryp?.name
        ),
        cstate: String(
          !employee.samesprmnt ? selectedStatec?.name : selectedStatep?.name
        ),
        ccity: String(
          !employee.samesprmnt ? selectedCityc?.name : selectedCityp?.name
        ),

        fromwhere: String("Employee"),

        bankdetails: bankTodo,

        eduTodo: [...eduTodo],
        addAddQuaTodo: [...addAddQuaTodo],
        workhistTodo: [...workhistTodo],
        status: isFormComplete,
        experience: month,
        clickedGenerate: String("Clicked"),
        percentage: completionPercentage,
        enquirystatus: String(
          employee.enquirystatus === "Please Select Status"
            ? "Users Purpose"
            : employee.enquirystatus
        ),

        assignExpLog: [
          {
            expmode: String(assignExperience.assignExpMode),
            expval: String(assignExperience.assignExpvalue),

            endexp: String(assignExperience.assignEndExpvalue),
            endexpdate:
              assignExperience.assignEndExpvalue === "Yes"
                ? String(assignExperience.assignEndExpDate)
                : "",
            endtar: String(assignExperience.assignEndTarvalue),
            endtardate:
              assignExperience.assignEndTarvalue === "Yes"
                ? String(assignExperience.assignEndTarDate)
                : "",
            updatedate: String(assignExperience.updatedate),
            type: String(""),
            updatename: String(""),
            salarycode: String(""),
            basic: String("0"),
            hra: String("0"),
            conveyance: String("0"),
            gross: String("0"),
            medicalallowance: String("0"),
            productionallowance: String("0"),
            otherallowance: String("0"),
            productionallowancetwo: String("0"),
            pfdeduction: false,
            esideduction: false,
            ctc: String(""),
            date: String(new Date()),
          },
        ],

        assignExpMode: String(assignExperience.assignExpMode),

        assignExpvalue: String(assignExperience.assignExpvalue),

        endexp: String(assignExperience.assignEndExpvalue),
        endexpdate:
          assignExperience.assignEndExpvalue === "Yes"
            ? String(assignExperience.assignEndExpDate)
            : "",
        endtar: String(assignExperience.assignEndTarvalue),
        endtardate:
          assignExperience.assignEndTarvalue === "Yes"
            ? String(assignExperience.assignEndTarDate)
            : "",
        updatedate: String(assignExperience.updatedate),
        process: String(loginNotAllot.process),
        processduration: String(loginNotAllot.processduration),
        processtype: String(loginNotAllot.processtype),
        date: formattedDate,
        time: String(loginNotAllot.time),
        timemins: String(loginNotAllot.timemins),

        grosssalary: String(overallgrosstotal),
        modeexperience: String(modeexperience),
        targetexperience: String(targetexperience),
        targetpts: String(targetpts),

        departmentlog: [
          {
            userid: String(
              employee.wordcheck === false
                ? getDepartment === "Internship"
                  ? newval1
                  : newval
                : employee.empcode
            ),
            logeditedby: [],
            updateddatetime: String(new Date()),
            updatedusername: String(isUserRoleAccess.companyname),
            companyname: String(selectedCompany),
            username: String(companycaps),
            department: String(employee.department),
            startdate: String(employee.doj),
            time: String(getCurrentTime()),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            status: Boolean(employee.statuss),
          },
        ],

        designationlog: [
          {
            logeditedby: [],
            updateddatetime: String(new Date()),
            updatedusername: String(isUserRoleAccess.companyname),
            companyname: String(selectedCompany),
            username: String(companycaps),
            designation: String(selectedDesignation),
            startdate: String(employee.doj),
            time: String(getCurrentTime()),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            date: String(employee.doj),
          },
        ],
        processlog:
          loginNotAllot.process === "Please Select Process" ||
          loginNotAllot.time === "00:00"
            ? []
            : [
                {
                  logeditedby: [],
                  updateddatetime: String(new Date()),
                  updatedusername: String(isUserRoleAccess.companyname),
                  companyname: String(selectedCompany),
                  company: String(selectedCompany),
                  branch: String(selectedBranch),
                  unit: String(selectedUnit),
                  team: String(selectedTeam),
                  empname: String(companycaps),
                  process: String(loginNotAllot.process),
                  processduration: String(loginNotAllot.processduration),
                  processtype: String(loginNotAllot.processtype),
                  date: String(employee.doj),
                  time: `${loginNotAllot.time}:${loginNotAllot?.timemins}`,
                },
              ],
        employee: [
          {
            username: String(companycaps),
            company: String(selectedCompany),
            branch: String(selectedBranch),
            unit: String(selectedUnit),
            team: String(selectedTeam),
            shifttiming: String(employee.shifttiming),
            shiftgrouping: String(employee.shiftgrouping),
            process: String(
              loginNotAllot.process === "Please Select Process"
                ? ""
                : loginNotAllot.process
            ),
            startdate: formattedDate,
            time: String(getCurrentTime()),
          },
        ],
      });
      setEmployee(employees_draft.data);
      setLoading(false);
      backPage("/draftlist");
    } catch (err) {
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  function AadharValidate(aadhar) {
    var adharcardTwelveDigit = /^\d{12}$/;
    var adharSixteenDigit = /^\d{16}$/;

    if (aadhar !== "") {
      if (
        aadhar.match(adharcardTwelveDigit) ||
        aadhar.match(adharSixteenDigit)
      ) {
        if (aadhar[0] !== "0" && aadhar[0] !== "1") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function PanValidate(pan) {
    let panregex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (pan !== "") {
      if (pan.match(panregex)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  const nextStep = (employeenameduplicate) => {
    const newErrors = {};

    // Check the validity of field1

    if (!employee.firstname) {
      newErrors.firstname = (
        <Typography style={{ color: "red" }}>
          First name must be required
        </Typography>
      );
    }

    if (!employee.lastname) {
      newErrors.lastname = (
        <Typography style={{ color: "red" }}>
          {" "}
          Last Name be required{" "}
        </Typography>
      );
    } else if (employee.lastname.length < 3) {
      newErrors.lastname = (
        <Typography style={{ color: "red" }}>
          {" "}
          Last Name must be 3 characters!{" "}
        </Typography>
      );
    }

    // if (employeenameduplicate && employee.firstname && employee.lastname) {
    //   newErrors.duplicatefirstandlastname = (
    //     <Typography style={{ color: "red" }}>
    //       First name and Last name already exist
    //     </Typography>
    //   );
    // }

    if (!employee.legalname) {
      newErrors.legalname = (
        <Typography style={{ color: "red" }}>
          Legal name must be required
        </Typography>
      );
    }
    if (!employee.callingname) {
      newErrors.callingname = (
        <Typography style={{ color: "red" }}>
          Calling Name must be required
        </Typography>
      );
    }
    if (
      employee.callingname !== "" &&
      employee.legalname !== "" &&
      employee.callingname?.toLowerCase() === employee.legalname?.toLowerCase()
    ) {
      newErrors.callingname = (
        <Typography style={{ color: "red" }}>
          Legal Name and Calling Name can't be same
        </Typography>
      );
    }
    if (!employee.email) {
      newErrors.email = (
        <Typography style={{ color: "red" }}>Email must be required</Typography>
      );
    } else if (!isValidEmail) {
      newErrors.email = (
        <Typography style={{ color: "red" }}>
          Please enter valid email
        </Typography>
      );
    }

    if (!employee.emergencyno) {
      newErrors.emergencyno = (
        <Typography style={{ color: "red" }}>
          Emergency no must be required
        </Typography>
      );
    } else if (employee.emergencyno.length !== 10) {
      newErrors.emergencyno = (
        <Typography style={{ color: "red" }}>
          Emergency no must be 10 digits required
        </Typography>
      );
    }
    if (employee.maritalstatus === "Married" && !employee.dom) {
      newErrors.dom = (
        <Typography style={{ color: "red" }}>DOM must be required</Typography>
      );
    }
    if (employee.contactfamily === "") {
      newErrors.contactfamily = (
        <Typography style={{ color: "red" }}>
          Contact(Family) no must be required
        </Typography>
      );
    }
    if (employee.contactfamily !== "" && employee.contactfamily.length !== 10) {
      newErrors.contactfamily = (
        <Typography style={{ color: "red" }}>
          Contact(Family) no must be 10 digits required
        </Typography>
      );
    }
    if (employee.contactpersonal === "") {
      newErrors.contactpersonal = (
        <Typography style={{ color: "red" }}>
          Contact(personal) no must be required
        </Typography>
      );
    }

    if (
      employee.contactpersonal !== "" &&
      employee.contactpersonal.length !== 10
    ) {
      newErrors.contactpersonal = (
        <Typography style={{ color: "red" }}>
          Contact(personal) no must be 10 digits required
        </Typography>
      );
    }

    if (employee?.panno !== "" && employee?.panno?.length !== 10) {
      newErrors.panno = (
        <Typography style={{ color: "red" }}>
          PAN No must be 10 digits required
        </Typography>
      );
    }

    if (employee?.panno === "" && employee?.panstatus === "Have PAN") {
      newErrors.panno = (
        <Typography style={{ color: "red" }}>
          PAN No must be required
        </Typography>
      );
    } else if (
      !PanValidate(employee?.panno) &&
      employee?.panstatus === "Have PAN"
    ) {
      newErrors.panno = (
        <Typography style={{ color: "red" }}>
          Please Enter Valid PAN Number
        </Typography>
      );
    }

    if (employee?.panrefno === "" && employee?.panstatus === "Applied") {
      newErrors.panrefno = (
        <Typography style={{ color: "red" }}>
          Application Reference No must be required
        </Typography>
      );
    }

    if (!employee.dob) {
      newErrors.dob = (
        <Typography style={{ color: "red" }}>DOB must be required</Typography>
      );
    }

    if (!employee.aadhar) {
      newErrors.aadhar = (
        <Typography style={{ color: "red" }}>
          {" "}
          Aadhar must be required{" "}
        </Typography>
      );
    } else if (employee.aadhar.length < 12) {
      newErrors.aadhar = (
        <Typography style={{ color: "red" }}>
          {" "}
          Please Enter valid Aadhar Number{" "}
        </Typography>
      );
    } else if (!AadharValidate(employee.aadhar)) {
      newErrors.aadhar = (
        <Typography style={{ color: "red" }}>
          {" "}
          Please Enter valid Aadhar Number{" "}
        </Typography>
      );
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(step + 1);
    }
  };

  const [finderrorindex, setFinderrorindex] = useState([]);
  const [finderrorindexgrp, setFinderrorindexgrp] = useState([]);
  const [finderrorindexshift, setFinderrorindexshift] = useState([]);

  const [empcodelimitedAll, setEmpCodeLimitedAll] = useState([]);

  const fetchUserDatasLimitedEmpcodeAll = async () => {
    try {
      let req = await axios.post(SERVICE.USERS_LIMITED_EMPCODE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        id: "",
      });

      let ALLusers = req?.data?.users;

      const allDigitsArray = ALLusers?.filter(
        (data) => data?.empcode !== ""
      )?.map((employee) => employee?.empcode);

      setEmpCodeLimitedAll(allDigitsArray);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //login detail validation
  const nextStepLog = () => {
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

    let value = todo.reduce((indexes, obj, index) => {
      if (obj.shiftmode === "Please Select Shift Mode") {
        // Check if the object has the 'name' property
        indexes.push(index);
      }
      return indexes;
    }, []);

    setFinderrorindex(value);

    let valuegrp = todo.reduce((indexes, obj, index) => {
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

    let valuegrpshift = todo.reduce((indexes, obj, index) => {
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

    let firstShift = todo?.filter((data) => data?.shiftmode !== "Week Off");

    if (firstShift?.length > 0) {
      let shifthoursA = shifttiming?.find(
        (data) => data?.name === firstShift[0]?.shifttiming
      );

      if (shifthoursA) {
        setLoginNotAllot({
          ...loginNotAllot,
          time: shifthoursA?.shifthours?.split(":")[0],
          timemins: shifthoursA?.shifthours?.split(":")[1],
        });
      }
    }

    const newErrorsLog = {};
    const missingFieldstwo = [];

    if (!enableLoginName && employee.username === "") {
      newErrorsLog.username = (
        <Typography style={{ color: "red" }}>
          username must be required
        </Typography>
      );
      missingFieldstwo.push("User Name");
    } else if (
      !enableLoginName &&
      allUsersLoginName.includes(employee.username)
    ) {
      newErrorsLog.username = (
        <Typography style={{ color: "red" }}>username already exist</Typography>
      );
      missingFieldstwo.push("User Already Exists");
    }
    // Check the validity of field1
    if (!employee.password) {
      newErrorsLog.password = (
        <Typography style={{ color: "red" }}>
          Password name must be required
        </Typography>
      );
      missingFieldstwo.push("Password");
    }
    // Check the work mode
    if (employee.workmode === "Please Select Work Mode") {
      newErrorsLog.workmode = (
        <Typography style={{ color: "red" }}>
          work mode must be required
        </Typography>
      );
      missingFieldstwo.push("Work Mode");
    }

    if (!selectedCompany) {
      newErrorsLog.company = (
        <Typography style={{ color: "red" }}>
          Company must be required
        </Typography>
      );
      missingFieldstwo.push("Company");
    }

    if (!selectedBranch) {
      newErrorsLog.branch = (
        <Typography style={{ color: "red" }}>
          Branch must be required
        </Typography>
      );
      missingFieldstwo.push("Branch");
    }

    if (!selectedUnit) {
      newErrorsLog.unit = (
        <Typography style={{ color: "red" }}>Unit must be required</Typography>
      );
      missingFieldstwo.push("Unit");
    }
    if (!selectedTeam) {
      newErrorsLog.team = (
        <Typography style={{ color: "red" }}>Team must be required</Typography>
      );
      missingFieldstwo.push("Team");
    }
    if (!selectedDesignation) {
      newErrorsLog.designation = (
        <Typography style={{ color: "red" }}>
          Designation must be required
        </Typography>
      );
      missingFieldstwo.push("Designation");
    }

    if (
      employee?.employeecount === "" ||
      employee?.employeecount === "0" ||
      !employee?.employeecount
    ) {
      newErrorsLog.systemcount = (
        <Typography style={{ color: "red" }}>
          System Count must be required
        </Typography>
      );
      missingFieldstwo.push("System Count");
    }

    if (!employee.department) {
      newErrorsLog.department = (
        <Typography style={{ color: "red" }}>
          Department must be required
        </Typography>
      );
      missingFieldstwo.push("Department");
    }

    if (employee.shifttype === "Please Select Shift Type") {
      newErrorsLog.shifttype = (
        <Typography style={{ color: "red" }}>
          Shifttype must be required
        </Typography>
      );
      missingFieldstwo.push("Shift Type");
    }

    if (employee.shifttype === "Standard") {
      if (employee.shiftgrouping === "Please Select Shift Grouping") {
        newErrorsLog.shiftgrouping = (
          <Typography style={{ color: "red" }}>
            Shiftgrouping must be required
          </Typography>
        );
        missingFieldstwo.push("Shift Grouping");
      } else if (employee.shifttiming === "Please Select Shift") {
        newErrorsLog.shifttiming = (
          <Typography style={{ color: "red" }}>
            Shifttiming must be required
          </Typography>
        );
        missingFieldstwo.push("Shift Timing");
      }
    }

    if (
      (employee.shifttype === "Daily" ||
        employee.shifttype === "1 Week Rotation" ||
        employee.shifttype === "2 Week Rotation" ||
        employee.shifttype === "1 Month Rotation") &&
      checkShiftMode.length > 0
    ) {
      newErrorsLog.checkShiftMode = (
        <Typography style={{ color: "red" }}>
          Shift Mode must be required
        </Typography>
      );
      missingFieldstwo.push("Shift Mode");
    }
    if (
      (employee.shifttype === "Daily" ||
        employee.shifttype === "1 Week Rotation" ||
        employee.shifttype === "2 Week Rotation" ||
        employee.shifttype === "1 Month Rotation") &&
      checkShiftGroup.length > 0
    ) {
      newErrorsLog.checkShiftGroup = (
        <Typography style={{ color: "red" }}>
          Shift Group must be required
        </Typography>
      );
      missingFieldstwo.push("Shift Group");
    }

    if (
      (employee.shifttype === "Daily" ||
        employee.shifttype === "1 Week Rotation" ||
        employee.shifttype === "2 Week Rotation" ||
        employee.shifttype === "1 Month Rotation") &&
      checkShift.length > 0
    ) {
      newErrorsLog.checkShift = (
        <Typography style={{ color: "red" }}>Shift must be required</Typography>
      );
      missingFieldstwo.push("Shift");
    }

    if (!employee.reportingto) {
      newErrorsLog.reportingto = (
        <Typography style={{ color: "red" }}>
          Reporting must be required
        </Typography>
      );
      missingFieldstwo.push("Reporting To");
    }

    if (!newval && employee.wordcheck === false) {
      newErrorsLog.empcode = (
        <Typography style={{ color: "red" }}>
          EmpCode must be required
        </Typography>
      );
      missingFieldstwo.push("Empcode");
    }

    if (!employee.doj) {
      newErrorsLog.doj = (
        <Typography style={{ color: "red" }}>DOJ must be required</Typography>
      );
      missingFieldstwo.push("DOJ");
    }

    // if (!employee.companyemail) {
    //   newErrorsLog.companyemail = (
    //     <Typography style={{ color: "red" }}>
    //       Company Email must be required
    //     </Typography>
    //   );
    // }
    // if (!validateEmail(employee.companyemail) && employee.companyemail) {
    //   newErrorsLog.companyemail = (
    //     <Typography style={{ color: "red" }}>
    //       Please enter valid Company Email
    //     </Typography>
    //   );
    //   missingFieldstwo.push("Enter Valid Company Email");
    // }

    if (employee.empcode === "" && employee.wordcheck === true) {
      newErrorsLog.empcode = (
        <Typography style={{ color: "red" }}>
          EmpCode must be required
        </Typography>
      );
      missingFieldstwo.push("Empcode");
    }

    if (
      (employee.wordcheck === false && empcodelimitedAll?.includes(newval)) ||
      (employee.wordcheck === true &&
        empcodelimitedAll?.includes(employee.empcode))
    ) {
      newErrorsLog.empcode = (
        <Typography style={{ color: "red" }}>Empcode Already Exist</Typography>
      );
      missingFieldstwo.push("Empcode Already Exist");
    }

    if (getDepartment !== "Internship" && !selectedTeam) {
      newErrorsLog.team = (
        <Typography style={{ color: "red" }}>Please select Team</Typography>
      );
      missingFieldstwo.push("Select Team");
    }

    if (employee.ifoffice === true && primaryWorkStationInput === "") {
      newErrorsLog.primaryworkstationinput = (
        <Typography style={{ color: "red" }}>
          Work Station (WFH) must be required
        </Typography>
      );
      missingFieldstwo.push("Work Station(WFH)");
    }

    if (
      employee.enquirystatus === "Please Select Status" &&
      (isUserRoleAccess.role.includes("Manager") ||
        isUserRoleCompare.includes("lassignenquierypurpose"))
    ) {
      newErrorsLog.enquirystatus = (
        <Typography style={{ color: "red" }}>
          Status must be required
        </Typography>
      );
      missingFieldstwo.push("Status");
    }

    setErrorsLog({ ...newErrorsLog, ...todo });

    if (missingFieldstwo.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p
            style={{ fontSize: "20px", fontWeight: 900 }}
          >{`Please fill in the following fields: ${missingFieldstwo.join(
            ", "
          )}`}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      if (Object.keys(newErrorsLog).length === 0) {
        setStep(step + 1);
      }
    }
  };
  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmitMulti = (e) => {
    e.preventDefault();

    const isValidObject = (obj) => {
      for (let key in obj) {
        if (
          obj[key] === "" ||
          obj[key] === undefined ||
          obj[key] === null ||
          obj[key] === "Please Select Account Type"
        ) {
          return false;
        }
      }
      return true;
    };

    const areAllObjectsValid = (arr) => {
      for (let obj of arr) {
        if (!isValidObject(obj)) {
          return false;
        }
      }
      return true;
    };

    const exists = bankTodo?.some(
      (obj, index, arr) =>
        arr.findIndex((item) => item.accountnumber === obj.accountnumber) !==
        index
    );

    const activeexists = bankTodo.filter(
      (data) => data.accountstatus === "Active"
    );

    const newErrorsLog = {};
    const missingFieldsthree = [];

    // Check the validity of field1
    if (!assignExperience.updatedate) {
      newErrorsLog.updatedate = (
        <Typography style={{ color: "red" }}>Please Select Date</Typography>
      );
      missingFieldsthree.push("Select Date");
    }
    if (
      assignExperience.assignExpMode !== "Auto Increment" &&
      assignExperience.assignExpvalue === ""
    ) {
      newErrorsLog.value = (
        <Typography style={{ color: "red" }}>Please Enter Value</Typography>
      );
      missingFieldsthree.push("Enter Value");
    }
    if (
      assignExperience.assignEndExpvalue === "Yes" &&
      assignExperience.assignEndExpDate === ""
    ) {
      newErrorsLog.endexpdate = (
        <Typography style={{ color: "red" }}>
          Please Select EndExp Date
        </Typography>
      );
      missingFieldsthree.push("Select EndExp Date");
    }
    if (
      assignExperience.assignEndTarvalue === "Yes" &&
      assignExperience.assignEndTarDate === ""
    ) {
      newErrorsLog.endtardate = (
        <Typography style={{ color: "red" }}>
          Please Select EndTar Date
        </Typography>
      );
      missingFieldsthree.push("Select EndTar Date");
    }

    if (employeecodenew === "" && employee.wordcheck === true) {
      newErrorsLog.empcode = (
        <Typography style={{ color: "red" }}>
          EmpCode must be required
        </Typography>
      );
      missingFieldsthree.push("Empcode");
    }

    if (bankTodo?.length > 0 && !areAllObjectsValid(bankTodo)) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please fill all the Fields in Bank Details Todo!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (bankTodo?.length > 0 && exists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Duplicate account number found!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (activeexists?.length > 1) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Only one active account is allowed at a time.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      newErrorsLog.accountstatus = (
        <Typography style={{ color: "red" }}>
          Only one active account is allowed at a time.
        </Typography>
      );
      missingFieldsthree.push(" Only one active account is allowed at a time");
    }

    const accessibleTodoexists = accessibleTodo.some(
      (obj, index, arr) =>
        arr.findIndex(
          (item) =>
            item.fromcompany === obj.fromcompany &&
            item.frombranch === obj.frombranch &&
            item.fromunit === obj.fromunit
        ) !== index
    );
    if (accessibleTodo?.length === 0) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Add Accessible Company/Branch/Unit.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      newErrorsLog.accessiblecompany = (
        <Typography style={{ color: "red" }}>
          Company must be required
        </Typography>
      );
      missingFieldsthree.push("Company");
    } else if (
      accessibleTodo?.some(
        (data) =>
          data?.fromcompany === "Please Select Company" ||
          data?.frombranch === "Please Select Branch" ||
          data?.fromunit === "Please Select Unit"
      )
    ) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Fill All the fields in Accessible Company/Branch/Unit Todo.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      newErrorsLog.accessiblecompany = (
        <Typography style={{ color: "red" }}>
          Company must be required
        </Typography>
      );
      missingFieldsthree.push("Company");
    } else if (accessibleTodoexists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Duplicate Accessible Company/Branch/Unit.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
      newErrorsLog.accessiblecompany = (
        <Typography style={{ color: "red" }}>
          Company must be required
        </Typography>
      );
    }

    if (
      (employee.wordcheck === false &&
        empcodelimitedAll?.includes(employee.empcode)) ||
      (employee.wordcheck === true &&
        empcodelimitedAll?.includes(employeecodenew))
    ) {
      newErrorsLog.empcode = (
        <Typography style={{ color: "red" }}>Empcode Already Exist</Typography>
      );
      missingFieldsthree.push("Empcode Already Exist");
    }

    if (
      loginNotAllot.process === "Please Select Process" ||
      loginNotAllot.process === "" ||
      loginNotAllot.process == undefined
    ) {
      newErrorsLog.process = (
        <Typography style={{ color: "red" }}>
          Process must be required
        </Typography>
      );
      missingFieldsthree.push("Process");
    }
    if (
      loginNotAllot.time === "Hrs" ||
      loginNotAllot.time === "" ||
      loginNotAllot.time == undefined ||
      loginNotAllot.timemins === "" ||
      loginNotAllot.timemins == undefined ||
      loginNotAllot.timemins === "Mins" ||
      (loginNotAllot.time === "00" && loginNotAllot.timemins === "00")
    ) {
      newErrorsLog.duration = (
        <Typography style={{ color: "red" }}>
          Duration must be required
        </Typography>
      );
      missingFieldsthree.push("Duration");
    }

    setErrorsLog(newErrorsLog);

    // If there are missing fields, show an alert with the list of them
    if (missingFieldsthree.length > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p
            style={{ fontSize: "20px", fontWeight: 900 }}
          >{`Please fill in the following fields: ${missingFieldsthree.join(
            ", "
          )}`}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      if (
        Object.keys(newErrorsLog).length === 0 &&
        (bankTodo?.length === 0 ||
          (bankTodo?.length > 0 && areAllObjectsValid(bankTodo) && !exists))
      ) {
        createUser();
      }
    }
  };

  //Submit Button For Add Employee draft section
  const handleDraftSubmit = (e) => {
    e.preventDefault();
    SendDraftEdit();
  };

  //change form
  const handlechangecontactpersonal = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, contactpersonal: inputValue });
    }
  };

  const handlechangecontactfamily = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, contactfamily: inputValue });
    }
  };

  const handlechangeemergencyno = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, emergencyno: inputValue });
    }
  };

  const handlechangeaadhar = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 12);
    if (regex.test(inputValue) || inputValue === "") {
      setEmployee({ ...employee, aadhar: inputValue });
    }
  };

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const renderStepOne = () => {
    return (
      <>
        <Headtitle title={"EMPLOYEE DRAFT EDIT"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            alignItems="center"
          ></Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Typography sx={userStyle.SubHeaderText}>
                Personal Information{" "}
              </Typography>
              <br />
              <br />
              <>
                <Grid container spacing={2}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Typography>
                      First Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid container sx={{ display: "flex" }}>
                      <Grid item md={3} sm={3} xs={3}>
                        <FormControl size="small" fullWidth>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            placeholder="Mr."
                            value={employee.prefix}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                prefix: e.target.value,
                              });
                            }}
                          >
                            <MenuItem value="Mr">Mr</MenuItem>
                            <MenuItem value="Ms">Ms</MenuItem>
                            <MenuItem value="Mrs">Mrs</MenuItem>
                          </Select>
                        </FormControl>
                        {errors.prefix && <div>{errors.prefix}</div>}
                      </Grid>
                      <Grid item md={9} sm={9} xs={9}>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="First Name"
                            value={employee.firstname}
                            onChange={(e) => {
                              function cleanString(str) {
                                const trimmed = str.trim();
                                const cleaned = trimmed.replace(
                                  /[^a-zA-Z0-9 ]/g,
                                  ""
                                );
                                return cleaned;
                              }
                              fetchUserName();
                              setFirst(
                                e.target.value.toLowerCase().split(" ").join("")
                              );
                              setEmployee({
                                ...employee,
                                firstname: cleanString(
                                  e.target.value.toUpperCase()
                                ),
                              });
                            }}
                          />
                        </FormControl>
                        {errors.firstname && <div>{errors.firstname}</div>}
                        {errors.duplicatefirstandlastname && (
                          <div>{errors.duplicatefirstandlastname}</div>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Last Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Last Name"
                        value={employee.lastname}
                        onChange={(e) => {
                          function cleanString(str) {
                            const trimmed = str.trim();
                            const cleaned = trimmed.replace(
                              /[^a-zA-Z0-9 ]/g,
                              ""
                            );
                            return cleaned;
                          }
                          setSecond(
                            e.target.value.toLowerCase().split(" ").join("")
                          );
                          setEmployee({
                            ...employee,
                            lastname: cleanString(e.target.value.toUpperCase()),
                          });
                        }}
                      />
                    </FormControl>
                    {errors.lastname && <div>{errors.lastname}</div>}
                    {errors.duplicatefirstandlastname && (
                      <div>{errors.duplicatefirstandlastname}</div>
                    )}
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Legal Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Legal Name"
                        value={employee.legalname}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            legalname: e.target.value,
                            //callingname: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                    {errors.legalname && <div>{errors.legalname}</div>}
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Calling Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Calling Name"
                        value={employee.callingname}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            callingname: e.target.value.replace(/\s/g, ""),
                          });
                        }}
                      />
                    </FormControl>
                    {errors.callingname && <div>{errors.callingname}</div>}
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Father Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Father Name"
                        value={employee.fathername}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            fathername: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Mother Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Mother Name"
                        value={employee.mothername}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            mothername: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>

                  {/* <Grid container spacing={2}> */}
                  <Grid item md={9} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Gender</Typography>

                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Others", value: "Others" },
                              { label: "Female", value: "Female" },
                              { label: "Male", value: "Male" },
                            ]}
                            value={{
                              label:
                                employee.gender === "" ||
                                employee.gender == undefined
                                  ? "Select Gender"
                                  : employee.gender,
                              value:
                                employee.gender === "" ||
                                employee.gender == undefined
                                  ? "Select Gender"
                                  : employee.gender,
                            }}
                            onChange={(e) => {
                              setEmployee({ ...employee, gender: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Marital Status</Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Single", value: "Single" },
                              { label: "Married", value: "Married" },
                              { label: "Divorced", value: "Divorced" },
                            ]}
                            value={{
                              label:
                                employee.maritalstatus === "" ||
                                employee.maritalstatus == undefined
                                  ? "Select Marital Status"
                                  : employee.maritalstatus,
                              value:
                                employee.maritalstatus === "" ||
                                employee.maritalstatus == undefined
                                  ? "Select Marital Status"
                                  : employee.maritalstatus,
                            }}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                maritalstatus: e.value,
                                dom: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {employee.maritalstatus === "Married" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Date Of Marriage<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              value={employee.dom}
                              onChange={(e) => {
                                setEmployee({
                                  ...employee,
                                  dom: e.target.value,
                                });
                              }}
                              type="date"
                              size="small"
                              name="dom"
                            />
                          </FormControl>
                          {errors.dom && <div>{errors.dom}</div>}
                        </Grid>
                      )}
                      <Grid item md={2.5} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Date Of Birth<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            value={employee.dob}
                            onChange={(e) => {
                              let age = calculateAge(e.target.value);
                              setEmployee({
                                ...employee,
                                dob: e.target.value,
                                age,
                              });
                            }}
                            type="date"
                            size="small"
                            name="dob"
                            inputProps={{ max: maxDate }}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                        </FormControl>
                        {errors.dob && <div>{errors.dob}</div>}
                      </Grid>
                      <Grid item md={1.5} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Age</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            value={employee.dob === "" ? "" : employee?.age}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Blood Group</Typography>

                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "A-ve-", value: "A-ve-" },
                              { label: "A+ve-", value: "A+ve-" },
                              { label: "B+ve", value: "B+ve" },
                              { label: "B-ve", value: "B-ve" },
                              { label: "O+ve", value: "O+ve" },
                              { label: "O-ve", value: "O-ve" },
                              { label: "AB+ve", value: "AB+ve" },
                              { label: "AB-ve", value: "AB-ve" },
                              { label: "A1+ve", value: "A1+ve" },
                              { label: "A1-ve", value: "A1-ve" },
                              { label: "A2+ve", value: "A2+ve" },
                              { label: "A2-ve", value: "A2-ve" },
                              { label: "A1B+ve", value: "A1B+ve" },
                              { label: "A1B-ve", value: "A1B-ve" },
                              { label: "A2B+ve", value: "A2B+ve" },
                              { label: "A2B-ve", value: "A2B-ve" },
                            ]}
                            value={{
                              label:
                                employee.bloodgroup === "" ||
                                employee.bloodgroup == undefined
                                  ? "Select Blood Group"
                                  : employee.bloodgroup,
                              value:
                                employee.bloodgroup === "" ||
                                employee.bloodgroup == undefined
                                  ? "Select Blood Group"
                                  : employee.bloodgroup,
                            }}
                            onChange={(e) => {
                              setEmployee({ ...employee, bloodgroup: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Email<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <TextField
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={employee.email}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                email: e.target.value,
                              });
                              setIsValidEmail(validateEmail(e.target.value));
                            }}
                            InputProps={{
                              inputProps: {
                                pattern: /^\S+@\S+\.\S+$/,
                              },
                            }}
                          />
                        </FormControl>
                        {errors.email && <div>{errors.email}</div>}
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Location</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="text"
                            placeholder="Location"
                            value={employee.location}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                location: e.target.value,
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Contact No (personal){" "}
                            <b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            placeholder="Contact No (personal)"
                            value={employee.contactpersonal}
                            onChange={(e) => {
                              handlechangecontactpersonal(e);
                            }}
                          />
                        </FormControl>
                        {errors.contactpersonal && (
                          <div>{errors.contactpersonal}</div>
                        )}
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Contact No (Family){" "}
                            <b style={{ color: "red" }}>*</b>{" "}
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            placeholder="Contact No (Family)"
                            value={employee.contactfamily}
                            onChange={(e) => {
                              handlechangecontactfamily(e);
                            }}
                          />
                        </FormControl>
                        {errors.contactfamily && (
                          <div>{errors.contactfamily}</div>
                        )}
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Emergency No<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            placeholder="Emergency No (Emergency)"
                            value={employee.emergencyno}
                            onChange={(e) => {
                              handlechangeemergencyno(e);
                            }}
                          />
                        </FormControl>
                        {errors.emergencyno && <div>{errors.emergencyno}</div>}
                      </Grid>
                      <Grid item md={4} sm={6} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            Aadhar No<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="Number"
                            sx={userStyle.input}
                            placeholder="Aadhar No"
                            value={employee.aadhar}
                            onChange={(e) => {
                              handlechangeaadhar(e);
                            }}
                          />
                        </FormControl>
                        {errors.aadhar && <div>{errors.aadhar}</div>}
                      </Grid>

                      <Grid item md={4} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>
                            PAN Card Status<b style={{ color: "red" }}>*</b>
                          </Typography>
                          <Selects
                            maxMenuHeight={300}
                            options={[
                              { label: "Have PAN", value: "Have PAN" },
                              { label: "Applied", value: "Applied" },
                              { label: "Yet to Apply", value: "Yet to Apply" },
                            ]}
                            value={{
                              label:
                                employee.panstatus === "" ||
                                employee.panstatus == undefined
                                  ? "Select PAN Status"
                                  : employee.panstatus,
                              value:
                                employee.panstatus === "" ||
                                employee.panstatus == undefined
                                  ? "Select PAN Status"
                                  : employee.panstatus,
                            }}
                            onChange={(e) => {
                              setEmployee({
                                ...employee,
                                panstatus: e.value,
                                panno: "",
                                panrefno: "",
                              });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      {employee?.panstatus === "Have PAN" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              PAN No<b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="PAN No"
                              value={employee.panno}
                              onChange={(e) => {
                                if (e.target.value.length < 11) {
                                  setEmployee({
                                    ...employee,
                                    panno: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          {errors.panno && <div>{errors.panno}</div>}
                        </Grid>
                      )}
                      {employee?.panstatus === "Applied" && (
                        <Grid item md={4} sm={6} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>
                              Application Ref No
                              <b style={{ color: "red" }}>*</b>
                            </Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              placeholder="Application Ref No"
                              value={employee.panrefno}
                              onChange={(e) => {
                                if (e.target.value.length < 16) {
                                  setEmployee({
                                    ...employee,
                                    panrefno: e.target.value,
                                  });
                                }
                              }}
                            />
                          </FormControl>
                          {errors.panrefno && <div>{errors.panrefno}</div>}
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>

                    {croppedImage && (
                      <>
                        <img
                          style={{ height: 120 }}
                          src={croppedImage}
                          alt=""
                        />
                      </>
                    )}
                    <div>
                      {employee.profileimage && !croppedImage ? (
                        <>
                          <Cropper
                            style={{ height: 120, width: "100%" }}
                            aspectRatio={1 / 1}
                            src={employee.profileimage}
                            ref={cropperRef}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              marginTop: "10px",
                              gap: "10px",
                            }}
                          >
                            <Box>
                              <Typography
                                sx={userStyle.uploadbtn}
                                onClick={handleCrop}
                              >
                                Crop Image
                              </Typography>
                            </Box>
                            <Box>
                              <Button
                                variant="outlined"
                                sx={userStyle.btncancel}
                                onClick={handleClearImage}
                              >
                                Clear
                              </Button>
                            </Box>
                          </Box>
                        </>
                      ) : (
                        <>
                          {employee.profileimage === "" && (
                            <Grid container sx={{ display: "flex" }}>
                              <Grid item md={4} sm={4}>
                                <section>
                                  {/* Input element for selecting files */}
                                  <input
                                    type="file"
                                    accept="image/*" // Limit to image files if needed
                                    id="profileimage"
                                    onChange={handleChangeImage}
                                    style={{ display: "none" }} // Hide the input element
                                  />
                                  <label htmlFor="profileimage">
                                    <Typography sx={userStyle.uploadbtn}>
                                      Upload
                                    </Typography>
                                  </label>
                                  <br />
                                </section>
                              </Grid>
                              <Grid item md={4} sm={4}>
                                <Button
                                  onClick={showWebcam}
                                  variant="contained"
                                  sx={userStyle.uploadbtn}
                                >
                                  <CameraAltIcon />
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                          {employee.profileimage && (
                            <>
                              <Grid item md={4} sm={4}>
                                <Button
                                  variant="outlined"
                                  sx={userStyle.btncancel}
                                  onClick={handleClearImage}
                                >
                                  Clear
                                </Button>
                              </Grid>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </>
              <br />
            </Box>
          </Grid>
          <br />
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <LoadingButton
                variant="contained"
                loading={nextBtnLoading}
                color="primary"
                size="small"
                onClick={draftduplicateCheck}
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Next
              </LoadingButton>

              <Link
                to="/draftlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              {employee.firstname !== "" &&
                employee.lastname !== "" &&
                employee.legalname !== "" &&
                employee.dob !== "" &&
                employee.aadhar !== "" &&
                employee.emergencyno !== "" && (
                  <LoadingButton
                    onClick={(e) => {
                      handleDraftSubmit(e);
                    }}
                    loading={loading}
                    loadingPosition="start"
                    variant="contained"
                    size="small"
                    sx={{
                      textTransform: "capitalize !important",
                      width: "73px",
                    }}
                  >
                    {" "}
                    Draft Save
                  </LoadingButton>
                )}
            </Box>
          </Grid>
        </Grid>

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
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={isWebcamOpen}
            onClose={webcamClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
              <Webcamimage getImg={getImg} setGetImg={setGetImg} />
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
        </Box>
      </>
    );
  };

  const renderStepTwo = () => {
    return (
      <>
        <Headtitle title={"EMPLOYEE DRAFT EDIT"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
              onClick={prevStep}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Reference Details{" "}
                </Typography>
                <br />
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={2.3} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Reference Name"
                      value={singleReferenceTodo.name}
                      onChange={(e) => {
                        setSingleReferenceTodo({
                          ...singleReferenceTodo,
                          name: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  {referenceTodoError.name && (
                    <div>{referenceTodoError.name}</div>
                  )}
                  {referenceTodoError.duplicate && (
                    <div>{referenceTodoError.duplicate}</div>
                  )}
                </Grid>
                <Grid item md={2.3} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Relationship</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Relationship"
                      value={singleReferenceTodo.relationship}
                      onChange={(e) => {
                        setSingleReferenceTodo({
                          ...singleReferenceTodo,
                          relationship: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.3} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Occupation</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Occupation"
                      value={singleReferenceTodo.occupation}
                      onChange={(e) => {
                        setSingleReferenceTodo({
                          ...singleReferenceTodo,
                          occupation: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.3} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Contact No</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Contact No"
                      value={singleReferenceTodo.contact}
                      onChange={(e) => {
                        handlechangereferencecontactno(e);
                      }}
                    />
                  </FormControl>
                  {referenceTodoError.contactno && (
                    <div>{referenceTodoError.contactno}</div>
                  )}
                </Grid>
                <Grid item md={2.3} sm={12} xs={12}>
                  <FormControl fullWidth>
                    <Typography>Details</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={5}
                      value={singleReferenceTodo.details}
                      onChange={(e) => {
                        setSingleReferenceTodo({
                          ...singleReferenceTodo,
                          details: e.target.value,
                        });
                      }}
                      placeholder="Reference Details"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.5} sm={6} xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: "30px",
                      minWidth: "20px",
                      padding: "19px 13px",
                      marginTop: "25px",
                    }}
                    onClick={addReferenceTodoFunction}
                  >
                    <FaPlus />
                  </Button>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  {" "}
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 700 }}
                      aria-label="customized table"
                      id="usertable"
                    >
                      <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                          <StyledTableCell>SNo</StyledTableCell>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Relationship</StyledTableCell>
                          <StyledTableCell>Occupation</StyledTableCell>
                          <StyledTableCell>Contact</StyledTableCell>
                          <StyledTableCell>Details</StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody align="left">
                        {referenceTodo?.length > 0 ? (
                          referenceTodo?.map((row, index) => (
                            <StyledTableRow>
                              <StyledTableCell>{index + 1}</StyledTableCell>
                              <StyledTableCell>{row.name}</StyledTableCell>
                              <StyledTableCell>
                                {row.relationship}
                              </StyledTableCell>
                              <StyledTableCell>
                                {row.occupation}
                              </StyledTableCell>
                              <StyledTableCell>{row.contact}</StyledTableCell>
                              <StyledTableCell>{row.details}</StyledTableCell>
                              <StyledTableCell>
                                <CloseIcon
                                  sx={{ color: "red", cursor: "pointer" }}
                                  onClick={() => {
                                    deleteReferenceTodo(index);
                                  }}
                                />
                              </StyledTableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            {" "}
                            <StyledTableCell colSpan={8} align="center">
                              No Data Available
                            </StyledTableCell>{" "}
                          </StyledTableRow>
                        )}
                        <StyledTableRow></StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>{" "}
              <br />
            </Box>
            <br />
            <Box sx={userStyle.selectcontainer}>
              <Grid item xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Login Details{" "}
                </Typography>
                <br />
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  {enableLoginName ? (
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Login Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="login Name"
                        value={third}
                      />
                    </FormControl>
                  ) : (
                    <FormControl size="small" fullWidth>
                      <Typography>
                        Login Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="login Name"
                        value={employee.username}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            username: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  )}
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={enableLoginName} />}
                      onChange={(e) => {
                        setEnableLoginName(!enableLoginName);
                      }}
                      label="Auto Generate"
                    />
                  </FormGroup>
                  {errmsg && enableLoginName && (
                    <div
                      className="alert alert-danger"
                      style={{ color: "green" }}
                    >
                      <Typography
                        color={errmsg == "Unavailable" ? "error" : "success"}
                        sx={{ margin: "5px" }}
                      >
                        <em>{errmsg}</em>
                      </Typography>
                    </div>
                  )}
                  {!enableLoginName && errorsLog.username && (
                    <div>{errorsLog.username}</div>
                  )}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      Password <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="password"
                      placeholder="Passsword"
                      value={employee.password}
                      onChange={(e) => {
                        setEmployee({ ...employee, password: e.target.value });
                      }}
                    />
                  </FormControl>
                  {errorsLog.password && <div>{errorsLog.password}</div>}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      company Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="company name"
                      value={companycaps}
                    />
                  </FormControl>
                </Grid>
              </Grid>{" "}
              <br />
            </Box>
            <br />
            <Box sx={userStyle.dialogbox}>
              <Typography sx={userStyle.importheadtext}>
                Boarding Information
              </Typography>

              <Grid container spacing={2}>
                {isUserRoleAccess.role.includes("Manager") ? (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Status <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={statusOptions}
                        placeholder="Please Select Status"
                        value={{
                          label:
                            employee.enquirystatus == "undefined" ||
                            employee.enquirystatus === ""
                              ? "Please Select Status"
                              : employee.enquirystatus,
                          value:
                            employee.enquirystatus == "undefined" ||
                            employee.enquirystatus === ""
                              ? "Please Select Status"
                              : employee.enquirystatus,
                        }}
                        onChange={(e) => {
                          setEmployee((prev) => ({
                            ...prev,
                            enquirystatus: e.value,
                          }));
                        }}
                      />
                    </FormControl>
                    {errorsLog.enquirystatus && (
                      <div>{errorsLog.enquirystatus}</div>
                    )}
                  </Grid>
                ) : isUserRoleCompare.includes("lassignenquierypurpose") ? (
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Status <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={statusOptions}
                        placeholder="Please Select Status"
                        value={{
                          label:
                            employee.enquirystatus == "undefined" ||
                            employee.enquirystatus === ""
                              ? "Please Select Status"
                              : employee.enquirystatus,
                          value:
                            employee.enquirystatus == "undefined" ||
                            employee.enquirystatus === ""
                              ? "Please Select Status"
                              : employee.enquirystatus,
                        }}
                        onChange={(e) => {
                          setEmployee((prev) => ({
                            ...prev,
                            enquirystatus: e.value,
                          }));
                        }}
                      />
                    </FormControl>
                    {errorsLog.enquirystatus && (
                      <div>{errorsLog.enquirystatus}</div>
                    )}
                  </Grid>
                ) : (
                  ""
                )}
                <Grid item md={4} sm={6} xs={12}>
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
                          employee.workmode !== ""
                            ? employee.workmode
                            : "Please Select Work Mode",
                        value:
                          employee.workmode !== ""
                            ? employee.workmode
                            : "Please Select Work Mode",
                      }}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          workmode: e.value,
                          ifoffice: false,
                        }));
                        setSelectedOptionsWorkStation([]);
                        setValueWorkStation([]);
                        setPrimaryWorkStation(
                          "Please Select Primary Work Station"
                        );
                      }}
                    />
                  </FormControl>
                  {errorsLog.workmode && <div>{errorsLog.workmode}</div>}
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      DOJ<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={employee.doj}
                      onChange={(e) => {
                        setEmployee({ ...employee, doj: e.target.value });
                        setAssignExperience((prev) => ({
                          ...prev,
                          updatedate: e.target.value,
                          assignEndExpDate: "",
                          assignEndTarDate: "",
                          assignExpMode: "Auto Increment",
                        }));
                        setLoginNotAllot({
                          ...loginNotAllot,
                          process: "Please Select Process",
                        });
                      }}
                    />
                    {errorsLog.doj && <div>{errorsLog.doj}</div>}
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DOT</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={employee.dot}
                      onChange={(e) => {
                        setEmployee({ ...employee, dot: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Company Email</Typography>
                    <TextField
                      id="email"
                      type="email"
                      placeholder="Company Email"
                      value={employee.companyemail}
                      // onChange={(e) => {
                      //   setEmployee({
                      //     ...employee,
                      //     companyemail: e.target.value,
                      //   });
                      // }}
                      // InputProps={{
                      //   inputProps: {
                      //     pattern: /^\S+@\S+\.\S+$/,
                      //   },
                      // }}
                      readOnly
                    />
                  </FormControl>
                  {errorsLog.companyemail && (
                    <div>{errorsLog.companyemail}</div>
                  )}
                </Grid>
                <Grid item xs={12} md={4} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={companies?.map((data) => ({
                        label: data.name,
                        value: data.name,
                      }))}
                      styles={colourStyles}
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
                      onChange={handleCompanyChange}
                    />
                  </FormControl>
                  {errorsLog.company && <div>{errorsLog.company}</div>}
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={filteredBranches?.map((data) => ({
                        label: data.name,
                        value: data.name,
                      }))}
                      styles={colourStyles}
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
                      onChange={handleBranchChange}
                    />
                  </FormControl>
                  {errorsLog.branch && <div>{errorsLog.branch}</div>}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={filteredUnits?.map((data) => ({
                        label: data.name,
                        value: data.name,
                      }))}
                      styles={colourStyles}
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
                      onChange={handleUnitChange}
                    />
                  </FormControl>
                  {errorsLog.unit && <div>{errorsLog.unit}</div>}
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Department <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={department?.map((data) => ({
                        label: data?.deptname,
                        value: data?.deptname,
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          employee?.department === "" ||
                          employee?.department == undefined
                            ? "Please Select Department"
                            : employee?.department,
                        value:
                          employee?.department === "" ||
                          employee?.department == undefined
                            ? "Please Select Department"
                            : employee?.department,
                      }}
                      onChange={(e) => {
                        fetchDptDesignation(e.value);
                        setEmployee({ ...employee, department: e.value });
                        setSelectedDesignation("");
                        setSelectedTeam("");
                        setAssignExperience((prev) => ({
                          ...prev,
                          assignEndExpDate: "",
                          assignEndTarDate: "",
                        }));
                      }}
                    />
                  </FormControl>
                  {errorsLog.department && <div>{errorsLog.department}</div>}
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Team <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={filteredTeams?.map((data) => ({
                        label: data?.teamname,
                        value: data?.teamname,
                      }))}
                      styles={colourStyles}
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
                      onChange={handleTeamChange}
                    />
                  </FormControl>
                  {errorsLog.team && <div>{errorsLog.team}</div>}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Floor</Typography>
                    <Selects
                      options={floorNames
                        ?.filter((u) => u.branch === selectedBranch)
                        ?.map((data) => ({
                          label: data.name,
                          value: data.name,
                        }))}
                      styles={colourStyles}
                      value={{
                        label:
                          employee?.floor === "" || employee?.floor == undefined
                            ? "Please Select Floor"
                            : employee?.floor,
                        value:
                          employee?.floor === "" || employee?.floor == undefined
                            ? "Please Select Floor"
                            : employee?.floor,
                      }}
                      onChange={(e) => {
                        fetchareaNames(e.value);
                        setEmployee({
                          ...employee,
                          floor: e.value,
                          area: "",
                        });
                        setPrimaryWorkStation(
                          "Please Select Primary Work Station"
                        );
                        setSelectedOptionsWorkStation([]);
                        setValueWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
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
                          employee?.area === "" || employee?.area == undefined
                            ? "Please Select Area"
                            : employee?.area,
                        value:
                          employee?.area === "" || employee?.area == undefined
                            ? "Please Select Area"
                            : employee?.area,
                      }}
                      onChange={(e) => {
                        setEmployee({ ...employee, area: e.value });
                        setPrimaryWorkStation(
                          "Please Select Primary Work Station"
                        );
                        setSelectedOptionsWorkStation([]);
                        setValueWorkStation([]);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Designation <b style={{ color: "red" }}>*</b>
                    </Typography>

                    <Selects
                      options={designation?.map((d) => ({
                        label: d.name || d.designation,
                        value: d.name || d.designation,
                        systemcount: d?.systemcount || "",
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          selectedDesignation === "" ||
                          selectedDesignation == undefined
                            ? "Please Select Designation"
                            : selectedDesignation,
                        value:
                          selectedDesignation === "" ||
                          selectedDesignation == undefined
                            ? "Please Select Designation"
                            : selectedDesignation,
                      }}
                      onChange={handleDesignationChange}
                    />
                  </FormControl>
                  {errorsLog.designation && <div>{errorsLog.designation}</div>}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      System Count <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      size="small"
                      placeholder="System Count"
                      value={employee.employeecount}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          employeecount: e.target.value.replace(
                            /[^0-9.;\s]/g,
                            ""
                          ),
                        }));
                      }}
                    />
                  </FormControl>
                  {errorsLog.systemcount && <div>{errorsLog.systemcount}</div>}
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
                        label: employee.shifttype,
                        value: employee.shifttype,
                      }}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          shifttype: e.value,
                          shiftgrouping: "Please Select Shift Grouping",
                          shifttiming: "Please Select Shift",
                        });
                        handleAddTodo(e.value);
                      }}
                    />
                  </FormControl>
                  {errorsLog.shifttype && <div>{errorsLog.shifttype}</div>}
                </Grid>
                {employee.shifttype === "Standard" ? (
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
                            label: employee.shiftgrouping,
                            value: employee.shiftgrouping,
                          }}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              shiftgrouping: e.value,
                              shifttiming: "Please Select Shift",
                            });
                            ShiftDropdwonsSecond(e.value);
                          }}
                        />
                      </FormControl>
                      {errorsLog.shiftgrouping && (
                        <div>{errorsLog.shiftgrouping}</div>
                      )}
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
                            label: employee.shifttiming,
                            value: employee.shifttiming,
                          }}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              shifttiming: e.value,
                            });
                            let shifthoursA = shifttiming?.find(
                              (data) => data?.name === e.value
                            );
                            setLoginNotAllot({
                              ...loginNotAllot,
                              time: shifthoursA?.shifthours?.split(":")[0],
                              timemins: shifthoursA?.shifthours?.split(":")[1],
                            });
                          }}
                        />
                      </FormControl>
                      {errorsLog.shifttiming && (
                        <div>{errorsLog.shifttiming}</div>
                      )}
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
                  {employee.shifttype === "Daily" ? (
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
                                    {/* Fetching options */}
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

                  {employee.shifttype === "1 Week Rotation" ? (
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
                                    {/* Fetching options */}
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

                  {employee.shifttype === "2 Week Rotation" ? (
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
                                    {/* Fetching options */}
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

                  {employee.shifttype === "1 Month Rotation" ? (
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
                                    {/* Fetching options */}
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
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Reporting To <b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      labelId="demo-select-small"
                      id="demo-select-small"
                      options={
                        reportingtonames &&
                        reportingtonames?.map((row) => ({
                          label: row,
                          value: row,
                        }))
                      }
                      value={{
                        label:
                          employee?.reportingto === "" ||
                          employee?.reportingto == undefined
                            ? "Please Select Reporting To"
                            : employee?.reportingto,
                        value:
                          employee?.reportingto === "" ||
                          employee?.reportingto == undefined
                            ? "Please Select Reporting To"
                            : employee?.reportingto,
                      }}
                      onChange={(e) => {
                        setEmployee({ ...employee, reportingto: e.value });
                      }}
                    />
                  </FormControl>
                  {errorsLog.reportingto && <div>{errorsLog.reportingto}</div>}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>
                      EmpCode <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="EmpCode"
                      value={
                        employee.wordcheck === false
                          ? getDepartment === "Internship"
                            ? newval1
                            : newval
                          : employee.empcode
                      }
                      onChange={(e) => {
                        const inputText = e.target.value;
                        if (employee.wordcheck) {
                          setEmployee({ ...employee, empcode: inputText });
                        }
                      }}
                    />
                  </FormControl>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={employee.wordcheck === true} />
                        }
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            wordcheck: !employee.wordcheck,
                          });
                          setPrimaryWorkStation(
                            "Please Select Primary Work Station"
                          );
                        }}
                        label="Enable Empcode"
                      />
                    </FormGroup>
                  </Grid>
                  {errorsLog.empcode && <div>{errorsLog.empcode}</div>}
                </Grid>
                {/* <Grid item md={4} sm={12} xs={12}>
              {employee.wordcheck === true ? (
                <FormControl size="small" fullWidth>
                  <Typography>
                    EmpCode(Manual) <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="EmpCode"
                    value={employeecodenew}
                    onChange={(e) => setEmployeecodenew(e.target.value)}
                  />
                </FormControl>
              ) : (
                <FormControl size="small" fullWidth>
                  <Typography>
                    EmpCode(Auto) <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="EmpCode"
                    value={employee.empcode}
                  />
                </FormControl>
              )}
              <Grid>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={checkcode === true}
                        checked={employee.wordcheck === true}
                      />
                    }
                    onChange={() => {
                      setEmployee({
                        ...employee,
                        wordcheck: !employee.wordcheck,
                      });
                    }}
                    label="Enable Empcode"
                  />
                </FormGroup>
              </Grid>
              {errorsLog.empcode && <div>{errorsLog.empcode}</div>}
            </Grid> */}

                {employee.workmode !== "Remote" ? (
                  <>
                    {" "}
                    {/* {employee.workstationofficestatus === false ? */}
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Primary)</Typography>
                        <Selects
                          options={filteredWorkStation}
                          label="Please Select Shift"
                          value={{
                            label: primaryWorkStation,
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
                    {/* :
                  <Grid item md={4} sm={12} xs={12}>
                  </Grid>
                } */}
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)</Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt.filter(
                            (item) => item.value !== primaryWorkStation
                          )}
                          value={selectedOptionsWorkStation}
                          onChange={handleEmployeesChange}
                          valueRenderer={customValueRendererEmployees}
                        />
                      </FormControl>
                    </Grid>
                    {employee.workmode === "Office" && (
                      <>
                        <Grid item md={4} sm={12} xs={12}>
                          <FormControl size="small" fullWidth>
                            <Typography>If Office</Typography>
                          </FormControl>
                          <Grid>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={employee.ifoffice === true}
                                  />
                                }
                                onChange={(e) => {
                                  setEmployee({
                                    ...employee,
                                    ifoffice: !employee.ifoffice,
                                    workstationofficestatus: !employee.ifoffice,
                                  });
                                }}
                                label="Work Station Other"
                              />
                            </FormGroup>
                          </Grid>
                          {errorsLog.ifoffice && (
                            <div>{errorsLog.ifoffice}</div>
                          )}
                        </Grid>
                      </>
                    )}
                    {employee.ifoffice === true && (
                      <>
                        <Grid item md={4} sm={6} xs={12}>
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
                              readOnly
                            />
                          </FormControl>
                          {errorsLog.primaryworkstationinput && (
                            <div>{errorsLog.primaryworkstationinput}</div>
                          )}
                        </Grid>
                      </>
                    )}
                  </>
                ) : null}

                {employee.workmode === "Remote" ? (
                  <>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Primary)</Typography>
                        <Selects
                          options={filteredWorkStation}
                          label="Please Select Shift"
                          value={{
                            label: primaryWorkStation,
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
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Work Station (Secondary)</Typography>
                        <MultiSelect
                          size="small"
                          options={allWorkStationOpt}
                          value={selectedOptionsWorkStation}
                          onChange={handleEmployeesChange}
                          valueRenderer={customValueRendererEmployees}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
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
                ) : null}
              </Grid>
            </Box>
            <br />
          </Grid>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={prevStep}
              >
                Previous
              </Button>
              <Button
                className="next"
                variant="contained"
                size="small"
                onClick={nextStepLog}
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Next
              </Button>
              <Link
                to="/draftlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              <LoadingButton
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
                loading={loading}
                loadingPosition="start"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize !important",
                  width: "73px",
                }}
              >
                {" "}
                Draft Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
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
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={isWebcamOpen}
            onClose={webcamClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
              <Webcamimage getImg={getImg} setGetImg={setGetImg} />
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
        </Box>
      </>
    );
  };

  const renderStepThree = () => {
    return (
      <>
        <Headtitle title={"EMPLOYEE DRAFT EDIT"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
              onClick={prevStep}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Permanent Address <b style={{ color: "red" }}>*</b>
              </Typography>
              <br />
              <br />

              <>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Door/Flat No</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Door/Flat No"
                        value={employee.pdoorno}
                        onChange={(e) => {
                          setEmployee({ ...employee, pdoorno: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Street/Block</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Street/Block"
                        value={employee.pstreet}
                        onChange={(e) => {
                          setEmployee({ ...employee, pstreet: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Area/village</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Area/Village"
                        value={employee.parea}
                        onChange={(e) => {
                          setEmployee({ ...employee, parea: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Landmark</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Landmark"
                        value={employee.plandmark}
                        onChange={(e) => {
                          setEmployee({
                            ...employee,
                            plandmark: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <br />
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Taluk</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Taluk"
                        value={employee.ptaluk}
                        onChange={(e) => {
                          setEmployee({ ...employee, ptaluk: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Post</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Post"
                        value={employee.ppost}
                        onChange={(e) => {
                          setEmployee({ ...employee, ppost: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Pincode</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Pincode"
                        value={employee.ppincode}
                        onChange={(e) => {
                          handlechangeppincode(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl size="small" fullWidth>
                      <Typography>Country</Typography>
                      <Selects
                        options={Country.getAllCountries()}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCountryp}
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedCountryp(item);
                          setSelectedStatep("");
                          setSelectedCityp("");
                          setEmployee((prevSupplier) => ({
                            ...prevSupplier,
                            pcountry: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>State</Typography>
                      <Selects
                        options={State?.getStatesOfCountry(
                          selectedCountryp?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedStatep}
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedStatep(item);
                          setSelectedCityp("");
                          setEmployee((prevSupplier) => ({
                            ...prevSupplier,
                            pstate: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>City</Typography>
                      <Selects
                        options={City.getCitiesOfState(
                          selectedStatep?.countryCode,
                          selectedStatep?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedCityp}
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedCityp(item);
                          setEmployee((prevSupplier) => ({
                            ...prevSupplier,
                            pcity: item?.name || "",
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    {" "}
                    Current Address<b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={employee.samesprmnt}
                        onChange={(e) =>
                          setEmployee({
                            ...employee,
                            samesprmnt: !employee.samesprmnt,
                          })
                        }
                      />
                    }
                    label="Same as permanent Address"
                  />
                </Grid>
              </Grid>
              <br />
              <br />
              {!employee.samesprmnt ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Door/Flat No</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Door/Flat No"
                          value={employee.cdoorno}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              cdoorno: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Street/Block</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Street/Block"
                          value={employee.cstreet}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              cstreet: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Area/village</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Area/Village"
                          value={employee.carea}
                          onChange={(e) => {
                            setEmployee({ ...employee, carea: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Landmark</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Landmark"
                          value={employee.clandmark}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              clandmark: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Taluk</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Taluk"
                          value={employee.ctaluk}
                          onChange={(e) => {
                            setEmployee({
                              ...employee,
                              ctaluk: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Post</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Post"
                          value={employee.cpost}
                          onChange={(e) => {
                            setEmployee({ ...employee, cpost: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Pincode</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          placeholder="Pincode"
                          value={employee.cpincode}
                          onChange={(e) => {
                            handlechangecpincode(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Country</Typography>
                        <Selects
                          options={Country.getAllCountries()}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCountryc}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCountryc(item);
                            setSelectedStatec("");
                            setSelectedCityc("");
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              ccountry: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>State</Typography>
                        <Selects
                          options={State?.getStatesOfCountry(
                            selectedCountryc?.isoCode
                          )}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedStatec}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedStatec(item);
                            setSelectedCityc("");
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              cstate: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>City</Typography>
                        <Selects
                          options={City.getCitiesOfState(
                            selectedStatec?.countryCode,
                            selectedStatec?.isoCode
                          )}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCityc}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCityc(item);
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              ccity: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                // else condition starts here
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Door/Flat No</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Door/Flat No"
                          value={employee.pdoorno}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Street/Block</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Street/Block"
                          value={employee.pstreet}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Area/village</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Area/Village"
                          value={employee.parea}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Landmark</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Landmark"
                          value={employee.plandmark}
                        />
                      </FormControl>
                    </Grid>
                    <br />
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Taluk</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Taluk"
                          value={employee.ptaluk}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Post</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Post"
                          value={employee.ppost}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Pincode</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Pincode"
                          value={employee.ppincode}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Country</Typography>
                        <Selects
                          options={Country.getAllCountries()}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCountryp}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCountryp(item);
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              ccountry: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>State</Typography>
                        <Selects
                          options={State?.getStatesOfCountry(
                            selectedCountryp?.isoCode
                          )}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedStatep}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedStatep(item);
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              cstate: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>City</Typography>
                        <Selects
                          options={City.getCitiesOfState(
                            selectedStatep?.countryCode,
                            selectedStatep?.isoCode
                          )}
                          getOptionLabel={(options) => {
                            return options["name"];
                          }}
                          getOptionValue={(options) => {
                            return options["name"];
                          }}
                          value={selectedCityp}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCityp(item);
                            setEmployee((prevSupplier) => ({
                              ...prevSupplier,
                              ccity: item?.name || "",
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
            <br />
          </Grid>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={prevStep}
              >
                Previous
              </Button>
              <Button
                className="next"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={nextStep}
              >
                Next
              </Button>

              <Link
                to="/draftlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              <LoadingButton
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
                loading={loading}
                loadingPosition="start"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                {" "}
                Draft Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  const handlechangepassedyear = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 4);
    if (regex.test(inputValue) || inputValue === "") {
      setPassedyear(inputValue);
    }
  };

  const handlechangecgpa = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value?.slice(0, 4);
    if (regex.test(inputValue) || inputValue === "") {
      setCgpa(inputValue);
    }
  };

  const renderStepFour = () => {
    return (
      <>
        <Headtitle title={"EMPLOYEE DRAFT EDIT"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Grid item xs={8}>
                <Typography sx={userStyle.SubHeaderText}>Document</Typography>
              </Grid>
              <>
                <Grid container sx={{ justifyContent: "center" }} spacing={1}>
                  <Selects
                    options={designationsFileNames}
                    styles={colourStyles}
                    value={{
                      label: fileNames,
                      value: fileNames,
                    }}
                    onChange={(e) => {
                      setfileNames(e.value);
                    }}
                  />
                  &nbsp;
                  <Button variant="outlined" component="label">
                    <CloudUploadIcon sx={{ fontSize: "21px" }} /> &ensp;Upload
                    Documents
                    <input
                      hidden
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Grid>
              </>
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Document List{" "}
              </Typography>
              <br />
              <br />
              <br />
              <TableContainer component={Paper}>
                <Table aria-label="simple table" id="branch">
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                      <StyledTableCell align="center">Document</StyledTableCell>
                      <StyledTableCell align="center">Remarks</StyledTableCell>
                      <StyledTableCell align="center">View</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {files &&
                      files.map((file, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {sno++}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {file.name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <FormControl>
                              <OutlinedInput
                                sx={{
                                  height: "30px !important",
                                  background: "white",
                                  border: "1px solid rgb(0 0 0 / 48%)",
                                }}
                                size="small"
                                type="text"
                                value={file.remark}
                                onChange={(event) =>
                                  handleRemarkChange(index, event.target.value)
                                }
                              />
                            </FormControl>
                          </StyledTableCell>

                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            <a
                              style={{ color: "#357ae8" }}
                              href={`data:application/octet-stream;base64,${file.data}`}
                              download={file.name}
                            >
                              Download
                            </a>
                            <a
                              style={{
                                color: "#357ae8",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => renderFilePreview(file)}
                            >
                              View
                            </a>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              onClick={() => handleFileDelete(index)}
                              variant="contained"
                              size="small"
                              sx={{
                                textTransform: "capitalize",
                                minWidth: "0px",
                              }}
                            >
                              <DeleteIcon style={{ fontSize: "20px" }} />
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br /> <br />
              {/* // <button onClick={handleDownloadAll}>download All</button> */}
            </Box>
            <br />
            <Box sx={userStyle.container}>
              <Typography sx={userStyle.SubHeaderText}>
                Educational qualification <b style={{ color: "red" }}>*</b>
              </Typography>
              <br />
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Category</Typography>
                    <Selects
                      options={categorys}
                      value={{
                        label:
                          employee.categoryedu === "" ||
                          employee.categoryedu == undefined
                            ? "Please Select Category"
                            : employee.categoryedu,
                        value:
                          employee.categoryedu === "" ||
                          employee.categoryedu == undefined
                            ? "Please Select Category"
                            : employee.categoryedu,
                      }}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          categoryedu: e.value,
                          subcategoryedu: "Please Select Sub Category",
                          specialization: "Please Select Specialization",
                        }));
                        fetchCategoryBased(e);
                        setSubcategorys([]);
                        setEducationsOpt([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Sub Category</Typography>
                    <Selects
                      options={subcategorys}
                      value={{
                        label:
                          employee.subcategoryedu === "" ||
                          employee.subcategoryedu == undefined
                            ? "Please Select Sub Category"
                            : employee.subcategoryedu,
                        value:
                          employee.subcategoryedu === "" ||
                          employee.subcategoryedu == undefined
                            ? "Please Select Sub Category"
                            : employee.subcategoryedu,
                      }}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          subcategoryedu: e.value,
                          specialization: "Please Select Specialization",
                        }));
                        fetchEducation(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <Typography> Specialization</Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={educationsOpt}
                      value={{
                        label:
                          employee.specialization === "" ||
                          employee.specialization == undefined
                            ? "Please Select Specialization"
                            : employee.specialization,
                        value:
                          employee.specialization === "" ||
                          employee.specialization == undefined
                            ? "Please Select Specialization"
                            : employee.specialization,
                      }}
                      onChange={(e) => {
                        setEmployee((prev) => ({
                          ...prev,
                          specialization: e.value,
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Institution </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={institution}
                      placeholder="Institution"
                      onChange={(e) => setInstitution(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Passed Year </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      placeholder="Passed Year"
                      sx={userStyle.input}
                      value={passedyear}
                      onChange={(e) => handlechangepassedyear(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> CGPA</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      placeholder="CGPA"
                      sx={userStyle.input}
                      value={cgpa}
                      onChange={(e) => handlechangecgpa(e)}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={1} sm={12} xs={12}>
                  <FormControl size="small">
                    <Button
                      variant="contained"
                      color="success"
                      type="button"
                      onClick={handleSubmittodo}
                      sx={userStyle.Todoadd}
                    >
                      <FaPlus />
                    </Button>
                    &nbsp;
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <br />
                  <br />
                  {errorstodo.qualification && (
                    <div>{errorstodo.qualification}</div>
                  )}
                </Grid>
              </Grid>
              <br /> <br />
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Educational Details{" "}
              </Typography>
              <br />
              <br />
              <br />
              {/* ****** Table start ****** */}
              <TableContainer component={Paper}>
                <Table aria-label="simple table" id="branch">
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                      <StyledTableCell align="center">Category</StyledTableCell>
                      <StyledTableCell align="center">
                        Sub Category
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Specialization
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Institution
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Passed Year
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        % or cgpa
                      </StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {eduTodo &&
                      eduTodo?.map((todo, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {eduno++}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {todo.categoryedu}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {todo.subcategoryedu}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {todo.specialization}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.institution}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.passedyear}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.cgpa}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={() => handleDelete(index)}
                                sx={userStyle.Todoadd}
                              >
                                <AiOutlineClose />
                              </Button>
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <br />
            <br />
          </Grid>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                onClick={prevStep}
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Previous
              </Button>
              <Button
                className="next"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize !important",
                  width: "73px",
                }}
                onClick={nextStep}
              >
                Next
              </Button>
              <Link
                to="/draftlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              <LoadingButton
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
                loading={loading}
                loadingPosition="start"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize !important",
                  width: "73px",
                }}
              >
                {" "}
                Draft Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
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
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
  };

  const renderStepFive = () => {
    return (
      <>
        <Headtitle title={"EMPLOYEE DRAFT EDIT"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              onClick={prevStep}
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.selectcontainer}>
              <Typography sx={userStyle.SubHeaderText}>
                Additional qualification{" "}
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Addtl. Qualification </Typography>
                    <Selects
                      options={skillSet?.map((data) => ({
                        label: data?.name,
                        value: data?.name,
                      }))}
                      styles={colourStyles}
                      value={{
                        label:
                          addQual === "" || addQual == undefined
                            ? "Please Select Additional Qualification"
                            : addQual,
                        value:
                          addQual === "" || addQual == undefined
                            ? "Please Select Additional Qualification"
                            : addQual,
                      }}
                      onChange={(e) => {
                        setAddQual(e.value);
                      }}
                    />
                  </FormControl>
                  {errorstodo.addQual && <div>{errorstodo.addQual}</div>}
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Institution </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Institution"
                      value={addInst}
                      onChange={(e) => setAddInst(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Durartion</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Durartion"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Remarks</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} sm={12} xs={12}>
                  <FormControl size="small">
                    <Button
                      variant="contained"
                      color="success"
                      type="button"
                      onClick={handleSubmitAddtodo}
                      sx={userStyle.Todoadd}
                    >
                      <FaPlus />
                    </Button>
                    &nbsp;
                  </FormControl>
                </Grid>
                <br />
              </Grid>
              <br />
              <br />
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Additional Qualification Details{" "}
              </Typography>

              {/* ****** Table start ****** */}
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  id="branch"
                  // ref={tableRef}
                >
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                      <StyledTableCell align="center">
                        Addl. Qualification
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Institution
                      </StyledTableCell>
                      <StyledTableCell align="center">Duration</StyledTableCell>
                      <StyledTableCell align="center">Remarks</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {addAddQuaTodo &&
                      addAddQuaTodo.map((addtodo, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {skno++}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {addtodo.addQual}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {addtodo.addInst}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {addtodo.duration}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {addtodo.remarks}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={() => handleAddDelete(index)}
                                sx={userStyle.Todoadd}
                              >
                                <AiOutlineClose />
                              </Button>
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <br />
            <Box sx={userStyle.container}>
              <Typography sx={userStyle.SubHeaderText}>Work History</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Employee Name</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Employee Name"
                      value={empNameTodo}
                      onChange={(e) => setEmpNameTodo(e.target.value)}
                    />
                  </FormControl>
                  {errorstodo.empNameTodo && (
                    <div>{errorstodo.empNameTodo}</div>
                  )}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Designation </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Designation"
                      value={desigTodo}
                      onChange={(e) => {
                        setDesigTodo(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Joined On </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={joindateTodo}
                      onChange={(e) => {
                        setJoindateTodo(e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Leave On</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="date"
                      value={leavedateTodo}
                      onChange={(e) => setLeavedateTodo(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Duties</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Duties"
                      value={dutiesTodo}
                      onChange={(e) => setDutiesTodo(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Reason for Leaving</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Reason for Leaving"
                      value={reasonTodo}
                      onChange={(e) => setReasonTodo(e.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} sm={12} xs={12}>
                  <FormControl size="small">
                    <Button
                      variant="contained"
                      color="success"
                      type="button"
                      onClick={handleSubmitWorkSubmit}
                      sx={userStyle.Todoadd}
                    >
                      <FaPlus />
                    </Button>
                    &nbsp;
                  </FormControl>
                </Grid>
                <br />
              </Grid>
              <Typography sx={userStyle.SubHeaderText}>
                {" "}
                Work History Details{" "}
              </Typography>
              <br />
              <br />
              <br />
              {/* ****** Table start ****** */}
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  id="branch"
                  // ref={tableRef}
                >
                  <TableHead sx={{ fontWeight: "600" }}>
                    <StyledTableRow>
                      <StyledTableCell align="center">SI.NO</StyledTableCell>
                      <StyledTableCell align="center">
                        Employee Name
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Designation
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Joined On
                      </StyledTableCell>
                      <StyledTableCell align="center">Leave On</StyledTableCell>
                      <StyledTableCell align="center">Duties</StyledTableCell>
                      <StyledTableCell align="center">
                        Reason for Leaving
                      </StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {workhistTodo &&
                      workhistTodo.map((todo, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="center">
                            {sno++}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {todo.empNameTodo}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.desigTodo}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.joindateTodo
                              ? moment(todo.joindateTodo)?.format("DD-MM-YYYY")
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.leavedateTodo
                              ? moment(todo.leavedateTodo)?.format("DD-MM-YYYY")
                              : ""}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.dutiesTodo}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {todo.reasonTodo}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {
                              <Button
                                variant="contained"
                                color="error"
                                type="button"
                                onClick={() => handleWorkHisDelete(index)}
                                sx={userStyle.Todoadd}
                              >
                                <AiOutlineClose />
                              </Button>
                            }
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <br />
          </Grid>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                onClick={prevStep}
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                Previous
              </Button>
              <Button
                className="next"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
                // onClick={nextStepLog}
                onClick={nextStep}
              >
                Next
              </Button>
              <Link
                to="/draftlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  Cancel
                </Button>
              </Link>

              <LoadingButton
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
                loading={loading}
                loadingPosition="start"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize !important",
                  width: "73px",
                }}
              >
                {" "}
                Draft Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  //bank name options
  const accounttypes = [
    { value: "ALLAHABAD BANK - AB", label: "ALLAHABAD BANK - AB" },
    { value: "ANDHRA BANK - ADB", label: "ANDHRA BANK - ADB" },
    { value: "AXIS BANK - AXIS", label: "AXIS BANK - AXIS" },
    { value: "STATE BANK OF INDIA - SBI", label: "STATE BANK OF INDIA - SBI" },
    { value: "BANK OF BARODA - BOB", label: "BANK OF BARODA - BOB" },
    { value: "CITY UNION BANK - CUB", label: "CITY UNION BANK - CUB" },
    { value: "UCO BANK - UCO", label: "UCO BANK - UCO" },
    { value: "UNION BANK OF INDIA - UBI", label: "UNION BANK OF INDIA - UBI" },
    { value: "BANK OF INDIA - BOI", label: "BANK OF INDIA - BOI" },
    {
      value: "BANDHAN BANK LIMITED - BBL",
      label: "BANDHAN BANK LIMITED - BBL",
    },
    { value: "CANARA BANK - CB", label: "CANARA BANK - CB" },
    { value: "GRAMIN VIKASH BANK - GVB", label: "GRAMIN VIKASH BANK - GVB" },
    { value: "CORPORATION BANK - CORP", label: "CORPORATION BANK - CORP" },
    { value: "INDIAN BANK - IB", label: "INDIAN BANK - IB" },
    {
      value: "INDIAN OVERSEAS BANK - IOB",
      label: "INDIAN OVERSEAS BANK - IOB",
    },
    {
      value: "ORIENTAL BANK OF COMMERCE - OBC",
      label: "ORIENTAL BANK OF COMMERCE - OBC",
    },
    {
      value: "PUNJAB AND SIND BANK - PSB",
      label: "PUNJAB AND SIND BANK - PSB",
    },
    {
      value: "PUNJAB NATIONAL BANK - PNB",
      label: "PUNJAB NATIONAL BANK - PNB",
    },
    {
      value: "RESERVE BANK OF INDIA - RBI",
      label: "RESERVE BANK OF INDIA - RBI",
    },
    { value: "SOUTH INDIAN BANK - SIB", label: "SOUTH INDIAN BANK - SIB" },
    {
      value: "UNITED BANK OF INDIA - UBI",
      label: "UNITED BANK OF INDIA - UBI",
    },
    {
      value: "CENTRAL BANK OF INDIA - CBI",
      label: "CENTRAL BANK OF INDIA - CBI",
    },
    { value: "VIJAYA BANK - VB", label: "VIJAYA BANK - VB" },
    { value: "DENA BANK - DEN", label: "DENA BANK - DEN" },
    {
      value: "BHARATIYA MAHILA BANK LIMITED - BMB",
      label: "BHARATIYA MAHILA BANK LIMITED - BMB",
    },
    { value: "FEDERAL BANK - FB", label: "FEDERAL BANK - FB" },
    { value: "HDFC BANK - HDFC", label: "HDFC BANK - HDFC" },
    { value: "ICICI BANK - ICICI", label: "ICICI BANK - ICICI" },
    { value: "IDBI BANK - IDBI", label: "IDBI BANK - IDBI" },
    { value: "PAYTM BANK - PAYTM", label: "PAYTM BANK - PAYTM" },
    { value: "FINO PAYMENT BANK - FINO", label: "FINO PAYMENT BANK - FINO" },
    { value: "INDUSIND BANK - IIB", label: "INDUSIND BANK - IIB" },
    { value: "KARNATAKA BANK - KBL", label: "KARNATAKA BANK - KBL" },
    {
      value: "KOTAK MAHINDRA BANK - KOTAK",
      label: "KOTAK MAHINDRA BANK - KOTAK",
    },
    { value: "YES BANK - YES", label: "YES BANK - YES" },
    { value: "SYNDICATE BANK - SYN", label: "SYNDICATE BANK - SYN" },
    { value: "BANK OF MAHARASHTRA - BOM", label: "BANK OF MAHARASHTRA - BOM" },
    { value: "DCB BANK - DCB", label: "DCB BANK - DCB" },
    { value: "IDFC BANK - IDFC", label: "IDFC BANK - IDFC" },
    {
      value: "JAMMU AND KASHMIR BANK - J&K",
      label: "JAMMU AND KASHMIR BANK - J&K",
    },
    { value: "KARUR VYSYA BANK - KVB", label: "KARUR VYSYA BANK - KVB" },
    { value: "RBL BANK - RBL", label: "RBL BANK - RBL" },
    { value: "DHANLAXMI BANK - DLB", label: "DHANLAXMI BANK - DLB" },
    { value: "CSB BANK - CSB", label: "CSB BANK - CSB" },
    {
      value: "TAMILNAD MERCANTILE BANK - TMB",
      label: "TAMILNAD MERCANTILE BANK - TMB",
    },
  ];

  const [accessible, setAccessible] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    responsibleperson:
      String(employee.firstname).toUpperCase() +
      "." +
      String(employee.lastname).toUpperCase(),
  });

  // bank todo start
  const typeofaccount = [
    { label: "Savings", value: "Savings" },
    { label: "Salary", value: "Salary" },
  ];

  const accountstatus = [
    { label: "Active", value: "Active" },
    { label: "In-Active", value: "In-Active" },
  ];

  const [bankTodo, setBankTodo] = useState([]);

  const handleBankTodoChange = (index, field, value) => {
    const updatedBankTodo = [...bankTodo];
    updatedBankTodo[index] = { ...updatedBankTodo[index], [field]: value };
    setBankTodo(updatedBankTodo);
  };

  const deleteTodoEdit = (index) => {
    setBankTodo(bankTodo.filter((_, i) => i !== index));
  };

  const [bankUpload, setBankUpload] = useState([]);

  const handleBankDetailsUpload = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    let showAlert = false;
    if (file) {
      if (file.size < maxFileSize) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          setBankUpload([
            {
              name: file.name,
              preview: reader.result,
              data: base64String,
            },
          ]);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"File size is greater than 1MB, please upload a file below 1MB."}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleBankTodoChangeProof = (e, index) => {
    const file = e.target.files[0];
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    let showAlert = false;
    if (file) {
      if (file.size < maxFileSize) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const updatedBankTodo = [...bankTodo];
          const base64String = reader.result.split(",")[1];

          updatedBankTodo[index] = {
            ...updatedBankTodo[index],
            proof: [
              {
                name: file.name,
                preview: reader.result,
                data: base64String,
              },
            ],
          };

          setBankTodo(updatedBankTodo);
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
        };
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"File size is greater than 1MB, please upload a file below 1MB."}
            </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  const handleDeleteProof = (index) => {
    setBankTodo((prevArray) => {
      const newArray = [...prevArray];
      newArray[index].proof = [];
      return newArray;
    });
  };

  const handleBankTodo = () => {
    let newObject = {
      bankname: employee.bankname,
      bankbranchname: employee.bankbranchname,
      accountholdername: employee.accountholdername,
      accountnumber: employee.accountnumber,
      ifsccode: employee.ifsccode,
      accounttype: employee.accounttype,
      accountstatus: employee.accountstatus,
      proof: bankUpload,
    };

    const isValidObject = (obj) => {
      for (let key in obj) {
        if (
          obj[key] === "" ||
          obj[key] === undefined ||
          obj[key] === null ||
          obj[key] === "Please Select Account Type"
        ) {
          return false;
        }
      }
      return true;
    };

    const exists = bankTodo.some(
      (obj) => obj.accountnumber === newObject.accountnumber
    );
    const activeexists = bankTodo.some((obj) => obj.accountstatus === "Active");
    if (!isValidObject(newObject)) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please fill all the Fields!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (exists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Account Number Already Exist!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (employee.accountstatus === "Active" && activeexists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Only one active account is allowed at a time.
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      setBankTodo((prevState) => [...prevState, newObject]);
      setEmployee((prev) => ({
        ...prev,
        bankname: "ICICI BANK - ICICI",
        bankbranchname: "",
        accountholdername: "",
        accountnumber: "",
        ifsccode: "",
        accounttype: "Please Select Account Type",
        accountstatus: "In-Active",
      }));
      setBankUpload([]);
    }
  };

  const [bankDetails, setBankDetails] = useState(null);
  const [ifscModalOpen, setIfscModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const capitalizedValue = value.toUpperCase();

    const regex = /^[A-Z0-9]*$/;
    if (!regex.test(capitalizedValue)) {
      return;
    }

    if (name === "ifscCode" && capitalizedValue.length > 11) {
      setEmployee({
        ...employee,
        [name]: capitalizedValue.slice(0, 11),
      });
    } else {
      setEmployee({
        ...employee,
        [name]: capitalizedValue,
      });
    }
  };

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://ifsc.razorpay.com/${employee.ifscCode}`
      );
      if (response.status === 200) {
        setBankDetails(response.data);
        setLoading(false);
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              Bank Details Not Found!
            </p>
          </>
        );
        handleClickOpenerr();
      }
    } catch (err) {
      setLoading(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleModalClose = () => {
    setIfscModalOpen(false);
    setBankDetails(null); // Reset bank details
  };

  const handleModalOpen = () => {
    setIfscModalOpen(true);
  };

  //Accessible Company/Branch/unit

  const [accessibleTodo, setAccessibleTodo] = useState([]);
  const handleAccessibleBranchTodoChange = (index, changes) => {
    const updatedTodo = [...accessibleTodo];
    updatedTodo[index] = { ...updatedTodo[index], ...changes };
    setAccessibleTodo(updatedTodo);
  };

  const handleAccessibleBranchTodo = () => {
    let newObject = {
      fromcompany: accessible.company,
      frombranch: accessible.branch,
      fromunit: accessible.unit,
      companycode: accessible.companycode,
      branchcode: accessible.branchcode,
      unitcode: accessible.unitcode,
      branchemail: accessible.branchemail,
      branchaddress: accessible.branchaddress,
      branchstate: accessible.branchstate,
      branchcity: accessible.branchcity,
      branchcountry: accessible.branchcountry,
      branchpincode: accessible.branchpincode,

      company: selectedCompany,
      branch: selectedBranch,
      unit: selectedUnit,
      employee: companycaps,
      employeecode: String(
        employee.wordcheck === true ? employeecodenew : employee.empcode
      ),
    };

    const exists = accessibleTodo.some(
      (obj) =>
        obj.fromcompany === newObject.fromcompany &&
        obj.frombranch === newObject.frombranch &&
        obj.fromunit === newObject.fromunit
    );
    if (accessible?.company === "Please Select Company") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Company!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (accessible?.branch === "Please Select Branch") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Branch!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (accessible?.branch === "Please Select Unit") {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Please Select Unit!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else if (exists) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />{" "}
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            Todo Already Exist!
          </p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      setAccessibleTodo((prevState) => [...prevState, newObject]);
      setAccessible({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        responsibleperson: companycaps,
        companycode: "",
        branchcode: "",
        unitcode: "",
        branchemail: "",
        branchaddress: "",
        branchstate: "",
        branchcity: "",
        branchcountry: "",
        branchpincode: "",
      });
    }
  };

  const deleteAccessibleBranchTodo = (index) => {
    setAccessibleTodo(accessibleTodo.filter((_, i) => i !== index));
  };

  const renderStepSix = () => {
    return (
      <>
        <Headtitle title={"EMPLOYEE DRAFT EDIT"} />
        <Grid container spacing={2}>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="center"
          >
            <Button
              className="prev"
              variant="contained"
              size="small"
              sx={{
                display: { xs: "none", md: "flex" }, // Hide on small screens, show on large screens
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                left: { md: "10px" }, // Align left for large screens
                top: { md: "50%" }, // Center vertically for large screens
                transform: { md: "translateY(-50%)" }, // Center transform for large screens
                textTransform: "capitalize",
                mt: { xs: 2, md: 0 }, // Margin top for small screens to add space
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
              onClick={prevStep}
            >
              Previous
            </Button>
          </Grid>
          <Grid item md={10} xs={12} sm={12}>
            <Box sx={userStyle.dialogbox}>
              <Typography sx={userStyle.SubHeaderText}>
                Bank Details{" "}
              </Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Bank Name</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accounttypes}
                      placeholder="Please Choose Bank Name"
                      value={{
                        label: employee.bankname
                          ? employee.bankname
                          : "ICICI BANK - ICICI",
                        value: employee.bankname
                          ? employee.bankname
                          : "ICICI BANK - ICICI",
                      }}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          bankname: e.value,
                          bankbranchname: "",
                          accountholdername: "",
                          accountnumber: "",
                          ifsccode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Bank Branch Name
                      <span
                        style={{
                          display: "inline",
                          fontSize: "0.8rem",
                          color: "blue",
                          textDecoration: "underline",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                        onClick={handleModalOpen}
                      >
                        {"(Get By IFSC Code)"}
                      </span>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Bank Branch Name"
                      name="bankbranchname"
                      value={employee.bankbranchname}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          bankbranchname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Account Holder Name</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Account Name"
                      value={employee.accountholdername}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          accountholdername: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Account Number</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Please Enter Account Number"
                      value={employee.accountnumber}
                      onChange={(e) => {
                        setEmployee({
                          ...employee,
                          accountnumber: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>IFSC Code</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter IFSC Code"
                      value={employee.ifsccode}
                      onChange={(e) => {
                        setEmployee({ ...employee, ifsccode: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Type of Account</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={typeofaccount}
                      placeholder="Please Choose Account Type"
                      value={{
                        label: employee.accounttype
                          ? employee.accounttype
                          : "Please Choose Account Type",
                        value: employee.accounttype
                          ? employee.accounttype
                          : "Please Choose Account Type",
                      }}
                      onChange={(e) => {
                        setEmployee({ ...employee, accounttype: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={8} xs={8}>
                  <FormControl fullWidth size="small">
                    <Typography>Status</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accountstatus}
                      placeholder="Please Select Status"
                      value={{
                        label: employee.accountstatus,
                        value: employee.accountstatus,
                      }}
                      onChange={(e) => {
                        setEmployee({ ...employee, accountstatus: e.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      md={2}
                      sm={8}
                      xs={8}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // marginTop: "10%",
                      }}
                    >
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10%",
                          height: "25px",
                        }}
                      >
                        Upload
                        <input
                          accept="image/*,application/pdf"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            handleBankDetailsUpload(e);
                          }}
                        />
                      </Button>
                    </Grid>
                    {bankUpload?.length > 0 && (
                      <Grid
                        item
                        md={5}
                        sm={8}
                        xs={8}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // marginTop: "10%",
                        }}
                      >
                        {bankUpload?.length > 0 &&
                          bankUpload.map((file) => (
                            <>
                              <Grid container spacing={2}>
                                <Grid item md={8} sm={8} xs={8}>
                                  <Typography
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      maxWidth: "100%",
                                    }}
                                    title={file.name}
                                  >
                                    {file.name}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={1} xs={1}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  />
                                </Grid>
                                <br />
                                <br />
                                <Grid item md={2} sm={1} xs={1}>
                                  <Button
                                    style={{
                                      fontsize: "large",
                                      color: "#357AE8",
                                      cursor: "pointer",
                                      marginTop: "-5px",
                                      marginRight: "10px",
                                    }}
                                    onClick={() => setBankUpload([])}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                      </Grid>
                    )}

                    <Grid item md={1} sm={8} xs={8}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleBankTodo}
                        type="button"
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <FaPlus />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              {bankTodo.map((data, index) => (
                <div key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${
                        index + 1
                      }`}</Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bank Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={accounttypes}
                          placeholder="Please Select Bank Name"
                          value={{ label: data.bankname, value: data.bankname }}
                          onChange={(e) => {
                            handleBankTodoChange(index, "bankname", e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Bank Branch Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={data.bankbranchname}
                          placeholder="Please Enter Bank Branch Name"
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "bankbranchname",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Account Holder Name<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={data.accountholdername}
                          placeholder="Please Enter Account Holder Name"
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "accountholdername",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Account Number<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={data.accountnumber}
                          placeholder="Please Enter Account Number"
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "accountnumber",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          IFSC Code<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={data.ifsccode}
                          placeholder="Please Enter IFSC Code"
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "ifsccode",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Type of Account</Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={typeofaccount}
                          placeholder="Please Choose Account Type"
                          value={{
                            label: data.accounttype,
                            value: data.accounttype,
                          }}
                          onChange={(e) => {
                            handleBankTodoChange(index, "accounttype", e.value);
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={12} sx={{ display: "flex" }}>
                      <FormControl fullWidth size="small">
                        <Typography>Status</Typography>
                        <Selects
                          maxMenuHeight={250}
                          options={accountstatus}
                          placeholder="Please Choose Status"
                          value={{
                            label: data.accountstatus,
                            value: data.accountstatus,
                          }}
                          onChange={(e) => {
                            handleBankTodoChange(
                              index,
                              "accountstatus",
                              e.value
                            );
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12} sm={12} sx={{ display: "flex" }}>
                      <Grid container spacing={2}>
                        <Grid
                          item
                          md={2}
                          sm={8}
                          xs={8}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // marginTop: "10%",
                          }}
                        >
                          <Button
                            variant="contained"
                            component="label"
                            size="small"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "10%",
                              height: "25px",
                            }}
                          >
                            Upload
                            <input
                              accept="image/*,application/pdf"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                handleBankTodoChangeProof(e, index);
                              }}
                            />
                          </Button>
                        </Grid>
                        {data?.proof?.length > 0 && (
                          <Grid
                            item
                            md={5}
                            sm={8}
                            xs={8}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              // marginTop: "10%",
                            }}
                          >
                            {data?.proof?.length > 0 &&
                              data?.proof.map((file) => (
                                <>
                                  <Grid container spacing={2}>
                                    <Grid item md={8} sm={8} xs={8}>
                                      <Typography
                                        style={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          maxWidth: "100%",
                                        }}
                                        title={file.name}
                                      >
                                        {file.name}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={1} sm={1} xs={1}>
                                      <VisibilityOutlinedIcon
                                        style={{
                                          fontsize: "large",
                                          color: "#357AE8",
                                          cursor: "pointer",
                                          marginLeft: "-7px",
                                        }}
                                        onClick={() => renderFilePreview(file)}
                                      />
                                    </Grid>
                                    <br />
                                    <br />
                                    <Grid item md={3} sm={1} xs={1}>
                                      <Button
                                        style={{
                                          fontsize: "large",
                                          color: "#357AE8",
                                          cursor: "pointer",
                                          marginTop: "-5px",
                                        }}
                                        onClick={() => handleDeleteProof(index)}
                                      >
                                        <DeleteIcon />
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              ))}
                          </Grid>
                        )}

                        <Grid item md={1} sm={8} xs={8}>
                          <Button
                            variant="contained"
                            color="error"
                            type="button"
                            onClick={() => deleteTodoEdit(index)}
                            sx={{
                              height: "30px",
                              minWidth: "30px",
                              marginTop: "28px",
                              padding: "6px 10px",
                            }}
                          >
                            <AiOutlineClose />
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <br />
                </div>
              ))}
            </Box>

            <br />
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={8} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Exp Log Details{" "}
                  </Typography>
                </Grid>
                <Grid item md={1} xs={12} sm={4} marginTop={1}>
                  <Typography>
                    Date <b style={{ color: "red" }}>*</b>
                  </Typography>
                </Grid>
                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Selects
                      maxMenuHeight={250}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu base
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 200, // Adjust the max height of the menu option list
                        }),
                      }}
                      options={expDateOptions}
                      value={{
                        label: assignExperience.updatedate,
                        value: assignExperience.updatedate,
                      }}
                      onChange={(e) => {
                        setAssignExperience({
                          ...assignExperience,
                          updatedate: e.value,
                        });
                        setnewstate(!newstate);
                      }}
                    />
                  </FormControl>
                  {errorsLog.updatedate && <div>{errorsLog.updatedate}</div>}
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>Mode Val</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={modeOption}
                      value={{
                        label: assignExperience.assignExpMode,
                        value: assignExperience.assignExpMode,
                      }}
                      onChange={(e) => {
                        setAssignExperience({
                          ...assignExperience,
                          assignExpMode: e.value,
                          assignExpvalue: e.value === "Auto Increment" ? 0 : "",
                        });
                        setnewstate(!newstate);
                      }}
                    />
                  </FormControl>
                </Grid>
                {assignExperience.assignExpMode === "Please Select Mode" ? (
                  ""
                ) : (
                  <>
                    <Grid item md={4} xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Value (In Months){" "}
                          {assignExperience.assignExpMode === "Add" ||
                          assignExperience.assignExpMode === "Minus" ||
                          assignExperience.assignExpMode === "Fix" ? (
                            <b style={{ color: "red" }}>*</b>
                          ) : (
                            ""
                          )}
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Please Enter Value (In Months)"
                          disabled={
                            assignExperience.assignExpMode === "Auto Increment"
                          }
                          value={assignExperience.assignExpvalue}
                          onChange={(e) => {
                            setAssignExperience({
                              ...assignExperience,
                              assignExpvalue: e.target.value,
                            });
                            setnewstate(!newstate);
                          }}
                        />
                      </FormControl>
                      {errorsLog.value && <div>{errorsLog.value}</div>}
                    </Grid>
                  </>
                )}
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>Mode Exp</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={modeOptionexp}
                      value={{
                        label: assignExperience.assignEndExp,
                        value: assignExperience.assignEndExp,
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>End Exp</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={valueOpt}
                      value={{
                        label: assignExperience.assignEndExpvalue,
                        value: assignExperience.assignEndExpvalue,
                      }}
                      onChange={(e) => {
                        setAssignExperience({
                          ...assignExperience,
                          assignEndExpvalue: e.value,
                        });
                        setnewstate(!newstate);
                      }}
                    />
                  </FormControl>
                </Grid>

                {assignExperience.assignEndExpvalue === "Yes" ? (
                  <>
                    <Grid item md={3} xs={12} sm={4}>
                      <Typography>
                        End Exp Date{" "}
                        {assignExperience.assignEndExpvalue === "Yes" ? (
                          <b style={{ color: "red" }}>*</b>
                        ) : (
                          ""
                        )}
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        menuPlacement="top"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: 200, // Adjust the max height of the menu base
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            maxHeight: 200, // Adjust the max height of the menu option list
                          }),
                        }}
                        options={expDateOptions}
                        value={{
                          label: assignExperience.assignEndExpDate,
                          value: assignExperience.assignEndExpDate,
                        }}
                        onChange={(e) => {
                          setAssignExperience({
                            ...assignExperience,
                            assignEndExpDate: e.value,
                          });
                          setnewstate(!newstate);
                        }}
                      />
                      {errorsLog.endexpdate && (
                        <div>{errorsLog.endexpdate}</div>
                      )}
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <br />
              <Grid container spacing={1}>
                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>Mode Target</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={modeOptiontar}
                      value={{
                        label: assignExperience.assignEndTar,
                        value: assignExperience.assignEndTar,
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Typography>End Tar</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={valueOpt}
                      value={{
                        label: assignExperience.assignEndTarvalue,
                        value: assignExperience.assignEndTarvalue,
                      }}
                      onChange={(e) => {
                        setAssignExperience({
                          ...assignExperience,
                          assignEndTarvalue: e.value,
                        });
                        setnewstate(!newstate);
                      }}
                    />
                  </FormControl>
                </Grid>

                {assignExperience.assignEndTarvalue === "Yes" ? (
                  <>
                    <Grid item md={3} xs={12} sm={4}>
                      <Typography>
                        End Tar Date{" "}
                        {assignExperience.assignEndTarvalue === "Yes" ? (
                          <b style={{ color: "red" }}>*</b>
                        ) : (
                          ""
                        )}
                      </Typography>

                      <Selects
                        maxMenuHeight={250}
                        menuPlacement="top"
                        options={expDateOptions}
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: 200, // Adjust the max height of the menu base
                          }),
                          menuList: (provided) => ({
                            ...provided,
                            maxHeight: 200, // Adjust the max height of the menu option list
                          }),
                        }}
                        value={{
                          label: assignExperience.assignEndTarDate,
                          value: assignExperience.assignEndTarDate,
                        }}
                        onChange={(e) => {
                          setAssignExperience({
                            ...assignExperience,
                            assignEndTarDate: e.value,
                          });
                          setnewstate(!newstate);
                        }}
                      />
                      {errorsLog.endtardate && (
                        <div>{errorsLog.endtardate}</div>
                      )}
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <br />
            </Box>
            <br />

            {/* process details add */}
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={8} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Process Allot{" "}
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Process <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  {/* <FormControl fullWidth size="small">
                <Selects
                  options={ProcessOptions}
                  value={{
                    label: loginNotAllot?.process,
                    value: loginNotAllot?.process,
                  }}
                  onChange={(e) => {
                    setLoginNotAllot({
                      ...loginNotAllot,
                      process: e.value,
                    });
                  }}
                />
              </FormControl> */}
                  <FormControl fullWidth size="small">
                    <Selects
                      options={Array.from(
                        new Set(
                          ProcessOptions?.filter(
                            (comp) => selectedTeam === comp.team
                          )?.map((com) => com.process)
                        )
                      ).map((name) => ({
                        label: name,
                        value: name,
                      }))}
                      value={{
                        label: loginNotAllot.process,
                        value: loginNotAllot.process,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          process: e.value,
                        });
                        setnewstate(!newstate);
                      }}
                    />
                  </FormControl>
                  {errorsLog.process && <div>{errorsLog.process}</div>}
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Process Type <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={processTypes}
                      value={{
                        label: loginNotAllot?.processtype,
                        value: loginNotAllot?.processtype,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          processtype: e.value,
                        });
                        setnewstate(!newstate);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                    Process Duration <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Selects
                      options={processDuration}
                      value={{
                        label: loginNotAllot?.processduration,
                        value: loginNotAllot?.processduration,
                      }}
                      onChange={(e) => {
                        setLoginNotAllot({
                          ...loginNotAllot,
                          processduration: e.value,
                        });
                        setnewstate(!newstate);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>
                    Duration <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item md={6} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Selects
                          maxMenuHeight={300}
                          options={hrsOption}
                          placeholder="Hrs"
                          value={{
                            label: loginNotAllot.time,
                            value: loginNotAllot.time,
                          }}
                          onChange={(e) => {
                            setLoginNotAllot({
                              ...loginNotAllot,
                              time: e.value,
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
                          value={{
                            label: loginNotAllot.timemins,
                            value: loginNotAllot.timemins,
                          }}
                          onChange={(e) => {
                            setLoginNotAllot({
                              ...loginNotAllot,
                              timemins: e.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  {errorsLog.duration && <div>{errorsLog.duration}</div>}
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Gross Salary</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      // placeholder="Please Enter IFSC Code"
                      value={overallgrosstotal}
                      // onChange={(e) => {
                      //   setEmployee({ ...employee, ifsccode: e.target.value });
                      // }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Mode Experience</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      // placeholder="Please Enter IFSC Code"
                      value={modeexperience}
                      // onChange={(e) => {
                      //   setEmployee({ ...employee, ifsccode: e.target.value });
                      // }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Target Experience</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      // placeholder="Please Enter IFSC Code"
                      value={targetexperience}
                      // onChange={(e) => {
                      //   setEmployee({ ...employee, ifsccode: e.target.value });
                      // }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Target Points</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      // placeholder="Please Enter IFSC Code"
                      value={targetpts}
                      // onChange={(e) => {
                      //   setEmployee({ ...employee, ifsccode: e.target.value });
                      // }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
            </Box>
            {/* Accessible Company/Branch/Unit add details */}
            <Box sx={userStyle.dialogbox}>
              <Grid container spacing={1}>
                <Grid item md={8} xs={0} sm={4}>
                  <Typography sx={userStyle.SubHeaderText}>
                    Accessible Company/Branch/Unit
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={2.8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={companies.map((data) => ({
                        label: data.name,
                        value: data.name,
                        code: data.code,
                      }))}
                      styles={colourStyles}
                      value={{
                        label: accessible.company,
                        value: accessible.company,
                      }}
                      onChange={(e) => {
                        setAccessible({
                          ...accessible,
                          company: e.value,
                          branch: "Please Select Branch",
                          unit: "Please Select Unit",
                          companycode: e.code,
                          branchcode: "",
                          unitcode: "",
                          branchemail: "",
                          branchaddress: "",
                          branchstate: "",
                          branchcity: "",
                          branchcountry: "",
                          branchpincode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={branchNames
                        ?.filter((comp) => comp.company === accessible.company)
                        ?.map((data) => ({
                          label: data.name,
                          value: data.name,
                          ...data,
                        }))}
                      styles={colourStyles}
                      value={{
                        label: accessible.branch,
                        value: accessible.branch,
                      }}
                      onChange={(e) => {
                        setAccessible({
                          ...accessible,
                          branch: e.value,
                          unit: "Please Select Unit",
                          branchcode: e.code,
                          branchemail: e.email,
                          branchaddress: e.address,
                          branchstate: e.state,
                          branchcity: e.city,
                          branchcountry: e.country,
                          branchpincode: e.pincode,
                          unitcode: "",
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2.8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Unit<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={unitNames
                        ?.filter(
                          (comp) =>
                            // comp.company === accessible.company &&
                            comp.branch === accessible.branch
                        )
                        ?.map((data) => ({
                          label: data.name,
                          value: data.name,
                          code: data.code,
                        }))}
                      styles={colourStyles}
                      value={{ label: accessible.unit, value: accessible.unit }}
                      onChange={(e) => {
                        setAccessible({
                          ...accessible,
                          unit: e.value,
                          unitcode: e.code,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={2.8} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Responsible Person</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={companycaps}
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item md={0.8} sm={8} xs={8}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAccessibleBranchTodo}
                    type="button"
                    sx={{
                      height: "30px",
                      minWidth: "30px",
                      marginTop: "28px",
                      padding: "6px 10px",
                    }}
                  >
                    <FaPlus />
                  </Button>
                </Grid>
              </Grid>
              <br />
              {accessibleTodo?.map((datas, index) => (
                <div key={index}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontWeight: "bold" }}>{`Row No : ${
                        index + 1
                      }`}</Typography>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2}>
                    <Grid item md={3.7} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Company<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={companies.map((data) => ({
                            label: data.name,
                            value: data.name,
                            code: data.code,
                          }))}
                          styles={colourStyles}
                          value={{
                            label: datas.fromcompany ?? "Please Select Company",
                            value: datas.fromcompany ?? "Please Select Company",
                          }}
                          onChange={(e) => {
                            handleAccessibleBranchTodoChange(index, {
                              fromcompany: e.value,
                              companycode: e.code,
                              frombranch: "Please Select Branch",
                              fromunit: "Please Select Unit",
                              branchcode: "",
                              unitcode: "",
                              branchemail: "",
                              branchaddress: "",
                              branchstate: "",
                              branchcity: "",
                              branchcountry: "",
                              branchpincode: "",
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.7} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Branch<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={branchNames
                            ?.filter(
                              (comp) => comp.company === datas.fromcompany
                            )
                            ?.map((data) => ({
                              label: data.name,
                              value: data.name,
                              ...data,
                            }))}
                          styles={colourStyles}
                          value={{
                            label: datas.frombranch ?? "Please Select Branch",
                            value: datas.frombranch ?? "Please Select Branch",
                          }}
                          onChange={(e) => {
                            handleAccessibleBranchTodoChange(index, {
                              frombranch: e.value,
                              fromunit: "Please Select Unit",
                              unitcode: "",
                              branchcode: e.code,
                              branchemail: e.email,
                              branchaddress: e.address,
                              branchstate: e.state,
                              branchcity: e.city,
                              branchcountry: e.country,
                              branchpincode: e.pincode,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3.7} xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Unit<b style={{ color: "red" }}>*</b>
                        </Typography>
                        <Selects
                          options={unitNames
                            ?.filter(
                              (comp) =>
                                // comp.company === accessible.company &&
                                comp.branch === datas.frombranch
                            )
                            ?.map((data) => ({
                              label: data.name,
                              value: data.name,
                              code: data.code,
                            }))}
                          styles={colourStyles}
                          value={{
                            label: datas.fromunit ?? "Please Select Unit",
                            value: datas.fromunit ?? "Please Select Unit",
                          }}
                          onChange={(e) => {
                            handleAccessibleBranchTodoChange(index, {
                              fromunit: e.value,
                              unitcode: e.code,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={0.9} xs={12} sm={12}>
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={() => deleteAccessibleBranchTodo(index)}
                        sx={{
                          height: "30px",
                          minWidth: "30px",
                          marginTop: "28px",
                          padding: "6px 10px",
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                </div>
              ))}
              <br />
            </Box>

            <br />
            <br />
          </Grid>
          <Grid
            item
            md={1}
            xs={12}
            sm={12}
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" }, // Row for small screens, column for larger screens
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "center",
                gap: "10px",
                position: { xs: "static", md: "fixed" }, // Static for small screens, fixed for larger screens
                bottom: { xs: 0, md: "auto" }, // Align to bottom for small screens
                right: { xs: "auto", md: "10px" }, // Align right for large screens
                top: { xs: "auto", md: "50%" }, // Center vertically for large screens
                transform: { xs: "none", md: "translateY(-50%)" }, // Center transform for large screens
                width: "auto",
                padding: { xs: "0 5px", md: "0 10px" }, // Reduce padding for small screens
                mb: { xs: 1, md: 0 }, // Margin bottom for small screens
              }}
            >
              <Button
                className="prev"
                variant="contained"
                size="small"
                sx={{
                  display: { xs: "block", md: "none" }, // Show on small screens, hide on large screens
                  textTransform: "capitalize",
                  width: "73px",
                }}
                onClick={prevStep}
              >
                Previous
              </Button>
              <LoadingButton
                onClick={(e) => {
                  handleButtonClick(e);
                }}
                loading={loading}
                loadingPosition="start"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize !important",
                  width: "73px",
                }}
              >
                <span>CREATE EMPLOYEE</span>
              </LoadingButton>
              <Link
                to="/draftlist"
                style={{
                  textDecoration: "none",
                  color: "white",
                  marginRight: "0px",
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ...userStyle.btncancel,
                    textTransform: "capitalize",
                    width: "73px",
                  }}
                >
                  {" "}
                  Cancel{" "}
                </Button>
              </Link>
              <LoadingButton
                onClick={(e) => {
                  handleDraftSubmit(e);
                }}
                loading={loading}
                loadingPosition="start"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  width: "73px",
                }}
              >
                {" "}
                Draft Save
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>

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
                color="error"
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    );
  };

  const renderIndicator = () => {
    return (
      <ul className="indicatoremployee">
        <li className={step === 1 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Personal Info
        </li>
        <li className={step === 2 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Login & Boarding Details
        </li>
        <li className={step === 3 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Address
        </li>
        <li className={step === 4 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Document
        </li>
        <li className={step === 5 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Work History
        </li>
        <li className={step === 6 ? "active" : null}>
          <FaArrowAltCircleRight />
          &ensp;Bank Details
        </li>
      </ul>
    );
  };

  return (
    <>
      <div className="multistep-form">
        {renderIndicator()}
        {step === 1 ? renderStepOne() : null}
        {step === 2 ? renderStepTwo() : null}
        {step === 3 ? renderStepThree() : null}
        {step === 4 ? renderStepFour() : null}
        {step === 5 ? renderStepFive() : null}
        {step === 6 ? renderStepSix() : null}

        <Modal
          open={ifscModalOpen}
          onClose={handleModalClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div
            style={{
              margin: "auto",
              backgroundColor: "white",
              padding: "20px",
              maxWidth: "500px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Enter IFSC Code</Typography>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <OutlinedInput
              type="text"
              placeholder="Enter IFSC Code"
              name="ifscCode"
              style={{ height: "30px", margin: "10px" }}
              value={employee.ifscCode}
              onChange={handleInputChange}
            />
            <LoadingButton
              variant="contained"
              loading={loading}
              color="primary"
              sx={{ borderRadius: "20px", marginLeft: "5px" }}
              onClick={fetchBankDetails}
            >
              Get Branch
            </LoadingButton>
            <br />
            {bankDetails && (
              <div>
                <Typography variant="subtitle1">
                  Bank Name: {bankDetails.BANK}
                </Typography>
                <Typography variant="subtitle1">
                  Branch Name: {bankDetails.BRANCH}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ borderRadius: "20px", padding: "0 10px" }}
                  onClick={(e) => {
                    const matchedBank = accounttypes.find((bank) => {
                      const labelBeforeHyphen = bank.label.split(" - ")[0];

                      return (
                        labelBeforeHyphen.toLowerCase()?.trim() ===
                        bankDetails.BANK.toLowerCase()?.trim()
                      );
                    });
                    setEmployee({
                      ...employee,
                      bankbranchname: String(bankDetails.BRANCH),
                      ifsccode: employee.ifscCode,
                      bankname: matchedBank?.value,
                    });
                    handleModalClose();
                  }}
                >
                  Submit
                </Button>
                {/* Add more details as needed */}
              </div>
            )}
          </div>
        </Modal>
      </div>
      <LoadingBackdrop open={isLoading} />
    </>
  );
}

export default DraftEdit;
