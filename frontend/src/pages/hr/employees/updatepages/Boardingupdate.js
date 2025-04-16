import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Popover,
  Checkbox,
  TextField,
  IconButton,
  Select,
  OutlinedInput,
  FormControl,
  MenuItem,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Button,
  TableBody,
} from "@mui/material";
import { userStyle } from "../../../../pageStyle";
import { handleApiError } from "../../../../components/Errorhandling";
import { FaPrint, FaFilePdf, FaPlus, FaEdit } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../../services/Baseservice";
import moment from "moment-timezone";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../../../components/TableStyle";
import Selects from "react-select";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { MultiSelect } from "react-multi-select-component";
import Headtitle from "../../../../components/Headtitle";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import PageHeading from "../../../../components/PageHeading";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

function Boardingupdate() {
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
  } = useContext(UserRoleAccessContext);
  const [hierarchyall, setHierarchyall] = useState([]);
  const [designationsName, setDesignationsName] = useState([]);
  const [superVisorChoosen, setSuperVisorChoosen] = useState(
    "Please Select Supervisor"
  );
  const [changeToDesign, setChangeToDesign] = useState(
    "Please Select New/Replace"
  );
  const fetchAllHierarchy = async () => {
    try {
      let res = await axios.get(SERVICE.HIRERARCHI, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setHierarchyall(res?.data?.hirerarchi);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Shift Type"}{" "}
          </p>
        </>
      );
      handleClickOpenerr();
      return; // Stop further processing if validation fails
    } else {
      if (empaddform.shifttype === "Daily") {
        if (empaddform.shiftgrouping === "Please Select Shift Grouping") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (empaddform.shifttiming === "Please Select Shift") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Week Off"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
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
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (empaddform.shifttiming === "Please Select Shift") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Weeks"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Week Off"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
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
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (empaddform.shifttiming === "Please Select Shift") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Weeks"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Week Off"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
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
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (empaddform.shifttiming === "Please Select Shift") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (valueCateWeeks.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Weeks"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        } else if (selectedOptionsCate.length === 0) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Week Off"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
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
    workStationAutoGenerate();
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
        ?.filter((item) => /_[0-9]+_/.test(item?.workstationinput));

      if (lastworkstation.length === 0) {
        lastwscode = 0;
      } else {
        let highestWorkstation = lastworkstation.reduce(
          (max, item) => {
            const num = parseInt(item?.workstationinput.split("_")[1]);
            return num > max.num ? { num, item } : max;
          },
          { num: 0, item: null }
        ).num;

        lastwscode = highestWorkstation.toString().padStart(2, "0");
      }

      let autoWorkStation = `W${selectedBranchCode?.toUpperCase()}${selectedUnitCode?.toUpperCase()}_${
        lastwscode === 0
          ? "01"
          : (Number(lastwscode) + 1).toString().padStart(2, "0")
      }_${workStationInputOldDatas?.username?.toUpperCase()}`;

      if (
        workStationInputOldDatas?.company === selectedCompany &&
        workStationInputOldDatas?.branch === selectedBranch &&
        workStationInputOldDatas?.unit === selectedUnit
        // &&
        // workStationInputOldDatas?.workmode === empaddform.workmode
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

  // week off details
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };
  const customValueRendererCate = (valueCate, _days) => {
    return valueCate.length
      ? valueCate?.map(({ label }) => label).join(", ")
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

    setUnitOptions([]);
    setTeamOptions([]);
    setEmpaddform({ ...empaddform, floor: "" });
  };

  const handleBranchChange = (event) => {
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

  const handleUnitChange = (event) => {
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

  const handleTeamChange = (event) => {
    const selectedTeam = event.value;
    fetchUsernames(selectedTeam, "new");
    setSelectedTeam(selectedTeam);
    checkHierarchyName(selectedTeam, "Team");
  };

  const [oldHierarchyData, setOldHierarchyData] = useState([]);
  const [oldHierarchyDataSupervisor, setOldHierarchyDataSupervisor] = useState(
    []
  );
  const [newHierarchyData, setNewHierarchyData] = useState([]);
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        res?.data?.shiftgroupings?.map((data) => ({
          ...data,
          label: data.shiftday + "_" + data.shifthours,
          value: data.shiftday + "_" + data.shifthours,
        }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    // setFilteredWorkStation(result.flat());
    setFilteredWorkStation(
      result.flat()?.map((d) => ({
        ...d,
        label: d,
        value: d,
      }))
    );
  }, [selectedCompany, selectedBranch, selectedUnit, empaddform.floor]);

  const [boardingLog, setBoardingLog] = useState([]);
  const [boardingLogLength, setBoardingLogLength] = useState();
  const [branchNames, setBranchNames] = useState([]);

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

  const getCode = async (e) => {
    try {
      handleClickOpenEdit();
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setRoles(res?.data?.suser?.role);
      let req = await axios.post(SERVICE.MANPOWERAREAFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: res?.data?.suser.company,
        floor: String(res?.data?.suser.floor),
        branch: res?.data?.suser.branch,
      });

      let result = req?.data?.allareas
        ?.map((item) => {
          return item.area.map((data) => {
            return data;
          });
        })
        .flat();

      setAreaNames(result);
      setEmpaddform({
        ...res?.data?.suser,
        ifoffice: res?.data?.suser?.workstationofficestatus,
      });
      setGettingOldDatas(res?.data?.suser);
      fetchUsernames(res?.data?.suser?.team, "old");
      setOldDesignation(res?.data?.suser?.designation);
      let designationGrpName = alldesignation?.find(
        (data) => res?.data?.suser?.designation === data?.name
      )?.group;
      setOldDesignationGroup(designationGrpName);
      setNewDesignationGroup(designationGrpName);
      setPrimaryWorkStationInput(res?.data?.suser?.workstationinput);
      setWorkStationInputOldDatas({
        company: res?.data?.suser?.company,
        branch: res?.data?.suser?.branch,
        unit: res?.data?.suser?.unit,
        workmode: res?.data?.suser?.workmode,
        ifoffice: res?.data?.suser?.workstationofficestatus,
        workstationinput: res?.data?.suser?.workstationinput,
        username: res?.data?.suser?.username,
      });
      setSelectedCompany(res.data.suser.company);
      setSelectedBranch(res.data.suser.branch);
      setSelectedUnit(res.data.suser.unit);
      setSelectedDesignation(res.data.suser.designation);
      setSelectedTeam(res.data.suser.team);
      let allDesignations = alldesignation
        ?.filter((data) => designationGrpName === data?.group)
        ?.map((item) => item?.name);
      setDesignationsName(allDesignations);
      setEnableWorkstation(res?.data?.suser?.enableworkstation);
      setTodo(res?.data?.suser?.boardingLog[0]?.todo);
      setSelectedWorkStation(
        res?.data?.suser?.workstation.slice(
          1,
          res?.data?.suser?.workstation.length
        )
      );

      const fitleredUsers = [
        ...allUsersData
          ?.filter(
            (data) =>
              data?.designation === res?.data?.suser?.designation &&
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
        (u) => u.branch === res?.data?.suser?.branch
      );
      setFilteredUnits(filteredUnits);

      const filteredBranches = branchNames?.filter(
        (b) => b.company === res?.data?.suser?.company
      );

      setFilteredBranches(filteredBranches);

      setUnitOptions(
        filteredUnits?.map((data) => ({ label: data.name, value: data.name }))
      );

      const filteredTeams = team?.filter(
        (t) =>
          t.unit === res?.data?.suser?.unit &&
          t.branch === res?.data?.suser?.branch
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
            process: res?.data?.suser?.process,
            username: res?.data?.suser?.username,
            _id: res?.data?.suser?._id,
          },
        ]);
        setBoardingLogLength(1);
      } else {
        setBoardingLog(res?.data?.suser?.boardingLog);
        setBoardingLogLength(res?.data?.suser?.boardingLog?.length);
      }

      fetchDptDesignation(res?.data?.suser?.department);
      ShiftDropdwonsSecond(res?.data?.suser?.shiftgrouping);
      setPrimaryWorkStation(res?.data?.suser?.workstation[0]);
      const employeeCount = res?.data?.suser.employeecount || 0;
      setMaxSelections(employeeCount);

      setSelectedOptionsWorkStation(
        Array.isArray(res?.data?.suser?.workstation).length > 1
          ? //  &&
            //   res?.data?.suser?.workstation[1] !== ""
            res?.data?.suser?.workstation
              .slice(1, res?.data?.suser?.workstation?.length)
              ?.map((x) => ({
                ...x,
                label: x,
                value: x,
              }))
          : []
      );

      setSelectedOptionsWorkStation(
        (res?.data?.suser?.workstation).length > 1
          ? //  &&
            //   res?.data?.suser?.workstation[1] !== ""
            res?.data?.suser?.workstation
              .slice(1, res?.data?.suser?.workstation?.length)
              ?.map((x) => ({
                ...x,
                label: x,
                value: x,
              }))
          : []
      );
      setValueCate(res?.data?.suser?.boardingLog[0]?.weekoff);
      setValueWorkStation(
        res?.data?.suser?.workstation.slice(
          1,
          res?.data?.suser?.workstation.length
        )
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setEmpaddform(res?.data?.suser);
      setRowGetid(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [getbranchname, setgetbranchname] = useState("");
  const [getDepartment, setGetDepartment] = useState("");

  // Floor Dropdowns
  const fetchUsernames = async (team, check) => {
    const answer = boardingLog?.length > 1 ? false : true;
    if (answer && check === "new") {
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
      });
      const resultUsers =
        res?.data?.result?.length > 0
          ? res?.data?.result[0]?.result?.supervisorchoose
          : [];
      const answer = allUsersData?.filter((data) =>
        resultUsers?.includes(data?.companyname)
      );
      setrepotingtonames(answer);
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
          req.data.internCourses?.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchUnitNames = async () => {
    // let branch = getunitname ? getunitname : empaddform.branch;
    try {
      let req = await axios.get(SERVICE.UNIT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setUnitNames(req?.data?.units);
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
          req.data.floors?.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Area Dropdowns
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
          req.data.departmentdetails?.map((d) => ({
            ...d,
            label: d.deptname,
            value: d.deptname,
          }))
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchDptDesignation = async (value) => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Shift Dropdowns
  const fetchShift = async () => {
    try {
      let res_shift = await axios.get(SERVICE.SHIFT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setShiftTiming(res_shift?.data?.shifts);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
    const changedboardlog1st = boardingLog.slice(0, 1);
    const changeboardinglogwiout1st = boardingLog.slice(1);
    const finalboardinglog = [
      {
        ...changedboardlog1st[0],
        username: empaddform.companyname,
        company: String(selectedCompany),
        startdate: String(empaddform.doj),
        time: moment().format("HH:mm"),
        branch: String(selectedBranch),
        unit: String(selectedUnit),
        team: String(selectedTeam),
        floor: String(empaddform.floor),
        area: String(empaddform.area),
        shifttype: String(empaddform.shifttype),
        shifttiming: String(empaddform.shifttiming),
        shiftgrouping: String(empaddform.shiftgrouping),
        weekoff: [...valueCate],
        ischangecompany: true,
        ischangebranch: true,
        ischangeunit: true,
        ischangeteam: true,
        logeditedby: [],
        workstation:
          empaddform.workmode !== "Remote"
            ? valueWorkStation.length === 0
              ? primaryWorkStation
              : [primaryWorkStation, ...valueWorkStation]
            : [primaryWorkStation, ...valueWorkStation],
        updateddatetime: String(new Date()),
        updatedusername: String(isUserRoleAccess.companyname),
        logcreation: String("user"),
        todo:
          empaddform?.shifttype === "Standard"
            ? []
            : Array.isArray(todo)
            ? [...todo]
            : [],
      },
      ...changeboardinglogwiout1st,
    ];

    try {
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        // branch: String(selectedBranch),
        // unit: String(selectedUnit),
        floor:
          empaddform.floor == "Please Select Floor"
            ? ""
            : String(empaddform.floor),
        // department: String(empaddform.department),
        shifttype: String(empaddform.shifttype),
        shiftgrouping:
          empaddform.shiftgrouping == "Please Select Shift Group"
            ? ""
            : String(empaddform.shiftgrouping),
        // designation: String(selectedDesignation),
        shifttiming:
          empaddform.shifttiming == "Please Select Shift"
            ? ""
            : String(empaddform.shifttiming),
        reportingto:
          boardingLog?.length > 1
            ? String(empaddform.reportingto)
            : getingOlddatas.reportingto,
        role: roles,
        enableworkstation: Boolean(enableWorkstation),
        workstation:
          empaddform.workmode !== "Remote"
            ? valueWorkStation.length === 0
              ? primaryWorkStation
              : [primaryWorkStation, ...valueWorkStation]
            : [primaryWorkStation, ...valueWorkStation],
        workstationinput: String(
          empaddform.workmode === "Remote" || empaddform.ifoffice
            ? primaryWorkStationInput
            : ""
        ),
        workstationofficestatus: Boolean(empaddform.ifoffice),
        workmode: String(empaddform.workmode),
        boardingLog: finalboardinglog,
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });

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
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
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
            });
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
            let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
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
            });
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

      setEmpaddform(res.data);
      handleCloseModEdit();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7AC767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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

    if (empaddform.shifttype === "1 Week Rotation" && oneweekrotation > 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Please Add all the weeks in the todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.shifttype === "2 Week Rotation" &&
      twoweekrotation > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Please Add all the weeks in the todo"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.shifttype === "1 Month Rotation" &&
      onemonthrotation > 0
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" Please Add all the weeks in the todo"}
          </p>
        </>
      );
      handleClickOpenerr();
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedBranch == "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedUnit === "" || selectedUnit === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.department === "" ||
      empaddform.department == undefined
    ) {
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
    } else if (selectedTeam === "" || selectedTeam == undefined) {
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
    } else if (selectedDesignation === "" || selectedDesignation == undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Designation"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.shifttype === "" ||
      empaddform.shifttype == undefined ||
      empaddform.shifttype === "Please Select Shift Type"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Shift Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.shifttype === "Standard" &&
      (empaddform.shiftgrouping === "" ||
        empaddform.shiftgrouping == undefined ||
        empaddform.shiftgrouping === "Please Select Shift Group")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Shift Group"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.shifttype === "Standard" &&
      (empaddform.shifttiming === "" ||
        empaddform.shifttiming == undefined ||
        empaddform.shifttiming === "Please Select Shift")
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Shift Timing"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.reportingto === "" ||
      empaddform.reportingto == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Reporting"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.workmode === "Please Select Work Mode" ||
      empaddform.workmode === "" ||
      empaddform.workmode == undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Work Mode!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      empaddform.workmode === "Office" &&
      empaddform.ifoffice === true &&
      primaryWorkStationInput === ""
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Work Station (WFH)!"}
          </p>
        </>
      );
      handleClickOpenerr();
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select New/Replace"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      changeToDesign === "Replace" &&
      identifySuperVisor &&
      superVisorChoosen === "Please Select Supervisor"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Supervisor"}
          </p>
        </>
      );
      handleClickOpenerr();
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {
              "These Employee's Designation is not matched in hierarchy ,Add Hierarchy and update"
            }
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      // if (Object.keys(newErrorsLog).length === 0) {
      sendRequestt();
      // }
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

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "BoardingUpdatelist.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  useEffect(() => {
    fetchWorkStation();
    ShiftGroupingDropdwons();
    // fetchUnithNameschange();
    fetchfloorNames();
    // fetchareaNames();
    fetchbranchNames();
    fetchUnitNames();
    fetchDepartments();
    fetchReportingUser();
    fetchShift();
    fetchInternCourses();
  }, [empaddform]);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = employees?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      workstationexcel:
        Array.isArray(item?.workstation) && item?.workstation?.length > 0
          ? item?.workstation?.map((t, i) => `${i + 1 + ". "}` + t).toString()
          : "",
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
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
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable?.map((row) => row.id);
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

            // Update the "Select All" checkbox based on whether all rows are selected
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
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "empcode",
      headerName: "Emp Code",
      flex: 0,
      width: 100,
      hide: !columnVisibility.empcode,
      headerClassName: "bold-header",
      renderCell: (params) => (
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
              text={params?.row?.empcode}
            >
              <ListItemText primary={params?.row?.empcode} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "companyname",
      headerName: "Employee Name",
      flex: 0,
      width: 100,
      hide: !columnVisibility.companyname,
      headerClassName: "bold-header",
      renderCell: (params) => (
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
              text={params?.row?.companyname}
            >
              <ListItemText primary={params?.row?.companyname} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 100,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 100,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 100,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 0,
      width: 100,
      hide: !columnVisibility.department,
      headerClassName: "bold-header",
    },
    {
      field: "team",
      headerName: "Team",
      flex: 0,
      width: 100,
      hide: !columnVisibility.team,
      headerClassName: "bold-header",
    },
    {
      field: "workstation",
      headerName: "Workstation",
      flex: 0,
      width: 150,
      hide: !columnVisibility.workstation,
      headerClassName: "bold-header",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0,
      width: 100,
      hide: !columnVisibility.designation,
      headerClassName: "bold-header",
    },
    {
      field: "shifttiming",
      headerName: "Shift timing",
      flex: 0,
      width: 100,
      hide: !columnVisibility.shifttiming,
      headerClassName: "bold-header",
    },
    {
      field: "workmode",
      headerName: "Work Mode",
      flex: 0,
      width: 100,
      hide: !columnVisibility.workmode,
      headerClassName: "bold-header",
    },
    {
      field: "reportingto",
      headerName: "Reporting to",
      flex: 0,
      width: 100,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("eboardinginfoupdate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.row.id);
              }}
            >
              <EditIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iboardinginfoupdate") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData?.map((item, index) => {
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
      workstationexcel: item?.workstation,
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

  const handleClearFilter = () => {
    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setEmployees([]);
    setShowAlert(
      <>
        <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();
  };

  //MULTISELECT ONCHANGE START

  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);

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
  let [valueBranchCat, setValueBranchCat] = useState([]);

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
  let [valueUnitCat, setValueUnitCat] = useState([]);

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
  let [valueTeamCat, setValueTeamCat] = useState([]);

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
    if (selectedOptionsCompany?.length === 0) {
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
    } else {
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
          workstation: 1,
          weekoff: 1,
          originalpassword: 1,
          enquirystatus: 1,
          area: 1,
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
      console.log(err);
      setIsBoarding(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //auto select all dropdowns
  const handleAutoSelect = async () => {
    try {
      let selectedValues = isAssignBranch
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
      setValueTeamCat(selectedTeam);
      setSelectedOptionsTeam(mappedTeam);

      setAllAssignCompany(selectedCompany);

      setAllAssignBranch(selectedBranch);

      setAllAssignUnit(selectedUnit);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
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
        title="Manage Assign Boarding Information"
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
                <Grid item md={3} xs={12} sm={12}>
                  <Typography>
                    Company<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl size="small" fullWidth>
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
                        handleCompanyChangeFilter(e);
                      }}
                      valueRenderer={customValueRendererCompany}
                      labelledBy="Please Select Company"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Branch</Typography>
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
                      value={selectedOptionsBranch}
                      onChange={(e) => {
                        handleBranchChangeFilter(e);
                      }}
                      valueRenderer={customValueRendererBranch}
                      labelledBy="Please Select Branch"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography> Unit</Typography>
                    <MultiSelect
                      options={isAssignBranch
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
                                i.label === item.label && i.value === item.value
                            ) === index
                          );
                        })}
                      value={selectedOptionsUnit}
                      onChange={(e) => {
                        handleUnitChangeFilter(e);
                      }}
                      valueRenderer={customValueRendererUnit}
                      labelledBy="Please Select Unit"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <Typography>Team</Typography>
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
                        handleTeamChangeFilter(e);
                      }}
                      valueRenderer={customValueRendererTeam}
                      labelledBy="Please Select Team"
                    />
                  </FormControl>
                </Grid>
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
                  sx={userStyle.buttonadd}
                  variant="contained"
                  onClick={handleFilter}
                >
                  {" "}
                  Filter{" "}
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClearFilter}>
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
                    {/* <MenuItem value={employees?.length}>All</MenuItem> */}
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
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
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
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
        >
          <Box sx={userStyle.dialogbox}>
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
                      options={isAssignBranch
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
                      onChange={handleBranchChange}
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
                      options={isAssignBranch
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
                      onChange={handleUnitChange}
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

                {empaddform.department === "Intern" ? (
                  <>
                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Mode of Intern</Typography>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={empaddform.modeOfInt}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e, i) => {
                            setEmpaddform({
                              ...empaddform,
                              modeOfInt: e.target.value,
                            });
                            setModeInt(e.target.value);
                          }}
                        >
                          <MenuItem value="Online">Online</MenuItem>
                          <MenuItem value="Offline">Offline</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {empaddform.modeOfInt === "Offline" ? (
                      <Grid item md={6} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Duration</Typography>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={empaddform.intDuration}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 200,
                                  width: 80,
                                },
                              },
                            }}
                            onChange={(e, i) => {
                              setEmpaddform({
                                ...empaddform,
                                intDuration: e.target.value,
                              });
                            }}
                          >
                            <MenuItem value="Part-time">Part-Time</MenuItem>
                            <MenuItem value="Full-time">Full-Time</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    ) : (
                      ""
                    )}
                    <Grid item md={6} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Intern Course</Typography>
                        <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={empaddform.intCourse}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 80,
                              },
                            },
                          }}
                          onChange={(e, i) => {
                            setEmpaddform({
                              ...empaddform,
                              intCourse: e.target.value,
                            });
                          }}
                        >
                          {internCourseNames &&
                            internCourseNames?.map((row) => (
                              <MenuItem value={row.name}>{row.name}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <Grid container spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Intern start date</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="date"
                              value={empaddform.intStartDate}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  intStartDate: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Intern end date</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="date"
                              value={empaddform.intEndDate}
                              onChange={(e) => {
                                setEmpaddform({
                                  ...empaddform,
                                  intEndDate: e.target.value,
                                });
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : (
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
                          onChange={handleTeamChange}
                        />
                        {/* <OutlinedInput
                          id="component-outlined"
                          type="text"
                          value={selectedTeam}
                          readonly
                        /> */}
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
                                    (data) =>
                                      data?.designation === olddesignation
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
                )}

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
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  <Button onClick={handleUpdateTodocheck}>
                                    <CheckCircleIcon
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "#216d21",
                                      }}
                                    />
                                  </Button>
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
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  <Button onClick={handleUpdateTodocheck}>
                                    <CheckCircleIcon
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "#216d21",
                                      }}
                                    />
                                  </Button>
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
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  <Button onClick={handleUpdateTodocheck}>
                                    <CheckCircleIcon
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "#216d21",
                                      }}
                                    />
                                  </Button>
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
                                <Grid item md={1} sm={1} xs={1}>
                                  {/* Confirm button */}
                                  <Button onClick={handleUpdateTodocheck}>
                                    <CheckCircleIcon
                                      style={{
                                        fontSize: "1.5rem",
                                        color: "#216d21",
                                      }}
                                    />
                                  </Button>
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
                    <Grid item md={6} sm={12} xs={12}>
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

                    <Grid item md={6} sm={12} xs={12}>
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
                <Button variant="contained" onClick={editSubmit}>
                  Update
                </Button>
                <Grid item md={1}></Grid>
                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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
          {fileFormat === "xl" ? (
            <>
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

              <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          ) : (
            <>
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

              <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Choose Export
              </Typography>
            </>
          )}
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
    </Box>
  );
}

export default Boardingupdate;
