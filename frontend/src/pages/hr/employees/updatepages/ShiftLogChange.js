import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Paper,
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
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { SERVICE } from "../../../../services/Baseservice";
import { handleApiError } from "../../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useReactToPrint } from "react-to-print";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import moment from "moment-timezone";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import StyledDataGrid from "../../../../components/TableStyle";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MultiSelect } from "react-multi-select-component";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv, FaPlus } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function ShiftLogChange() {
  const gridRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
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
      if (boardingLog.shifttype === "Daily") {
        if (boardingLog.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (boardingLog.shifttiming === "Please Select Shift") {
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
        if (boardingLog.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (boardingLog.shifttiming === "Please Select Shift") {
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
        if (boardingLog.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (boardingLog.shifttiming === "Please Select Shift") {
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
        if (boardingLog.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (boardingLog.shifttiming === "Please Select Shift") {
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

  useEffect(() => {
    ShiftGroupingDropdwons();
  }, []);

  const [oldData, setOldData] = useState({
    company: "",
    branch: "",
    unit: "",
    team: "",
  });

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBoardinglogEdit(res?.data?.suser);

      setBoardingLog({
        ...boardingLog,
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [showButton, setShowButton] = useState(true);

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBoardinglogEdit(res?.data?.suser);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Project updateby edit page...
  let updateby = boardinglogEdit?.updatedby;
  let addedby = boardinglogEdit?.addedby;

  const sendEditRequest = async () => {
    try {
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
      boardingLog.shifttype === "Please Select Shift Type" ||
      boardingLog.shifttype === "" ||
      boardingLog.shifttype === undefined
    ) {
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
    }
    if (
      boardingLog.shifttype === "Standard" &&
      (boardingLog.shiftgrouping === "" ||
        boardingLog.shiftgrouping === "Please Select Shift Grouping" ||
        boardingLog.shiftgrouping === undefined)
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {" "}
            {"Please Select Shift Grouping"}{" "}
          </p>
        </>
      );
      handleClickOpenerr();
      return; // Stop further processing if validation fails
    }
    if (
      boardingLog.shifttype === "Standard" &&
      (boardingLog.shifttiming === "" ||
        boardingLog.shifttiming === "Please Select Shift" ||
        boardingLog.shifttiming === undefined)
    ) {
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
    }

    if (boardingLog.shifttype === "1 Week Rotation" && oneweekrotation > 0) {
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
      return;
    } else if (
      boardingLog.shifttype === "2 Week Rotation" &&
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
      return;
    } else if (
      boardingLog.shifttype === "1 Month Rotation" &&
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
      return;
    }

    if (boardingLog.shifttype !== "Standard") {
      // Iterate over each row in todo list for validation
      for (let i = 0; i < todo.length; i++) {
        const row = todo[i];

        if (row.shiftmode === "Please Select Shift Mode") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Mode"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        }

        if (
          row.shiftmode === "Shift" &&
          row.shiftgrouping === "Please Select Shift Grouping"
        ) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                {" "}
                {"Please Select Shift Grouping"}{" "}
              </p>
            </>
          );
          handleClickOpenerr();
          return; // Stop further processing if validation fails
        }

        if (
          row.shiftmode === "Shift" &&
          row.shiftgrouping !== "Please Select Shift Grouping" &&
          row.shifttiming === "Please Select Shift"
        ) {
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
        }
      }
    }

    if (boardingLog.shifttype === "Standard" && !isChanged) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No Changes to Update"}
          </p>
        </>
      );
      handleClickOpenerr();
      return;
    }
    if (boardingLog.shifttype !== "Standard" && !isChangedTodo) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No Changes to Update"}
          </p>
        </>
      );
      handleClickOpenerr();
      return;
    }

    // If all validations passed, proceed with sending the edit request
    sendEditRequest();
  };

  const fetchBoardinglog = async () => {
    try {
      let res_users = await axios.get(SERVICE.LOGALLUSER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setBoardinglogs(res_users?.data?.allusers);
      setBoardinglogcheck(true);
    } catch (err) {
      setBoardinglogcheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchBoardinglognew = async () => {
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
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchBoardinglog();
  }, []);

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

  // pdf.....
  const columns = [
    { title: "Company", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Employee Name", field: "username" },
    { title: "Shift Type", field: "shifttype" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
            company: row.companyname,
            branch: row.branch,
            unit: row.unit,
            team: row.team,
            username: row.username,
          }))
        : usernews.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
            company: row.company,
            branch: row.branch,
            unit: row.unit,
            team: row.team,
            username: row.companyname,
          }));

    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Shift Log.pdf");
  };

  // image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Shift Log.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const addSerialNumber = () => {
    const itemsWithSerialNumber = boardinglogs?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [boardinglogs]);

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
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: { fontWeight: "bold" },
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
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "companyname",
      headerName: "Company Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
      headerClassName: "bold-header",
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
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 100,
      hide: !columnVisibility.unit,
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
      field: "username",
      headerName: "Employee Name",
      flex: 0,
      width: 150,
      hide: !columnVisibility.username,
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
              text={params?.row?.username}
            >
              <ListItemText primary={params?.row?.username} />
            </CopyToClipboard>
          </ListItem>
        </Grid>
      ),
    },
    {
      field: "shifttype",
      headerName: "Shift Type",
      flex: 0,
      width: 120,
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
      renderCell: (params) => (
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
                  `/updatepages/shiftloglist/${params.row.id}`,
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
              onClick={async () => {
                await getviewCode(params.row.id);
              }}
            >
              <FaEdit style={{ color: "white", fontSize: "18px" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ishiftlog") && (
            <Button
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

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empcode: item.empcode,
      username: item.companyname,
      companyname: item.company,
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
        rowDataTable?.map((t, index) => ({
          Sno: index + 1,
          "Company Name": t.companyname,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          "Employee Name": t.username,
          "Shift Type": t.shifttype,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        usernews.map((t, index) => ({
          Sno: index + 1,
          "Company Name": t.company,
          Branch: t.branch,
          Unit: t.unit,
          Team: t.team,
          "Employee Name": t.companyname,
          "Shift Type": t.shifttype,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"SHIFT LOG"} />
      {/* ****** Header Content ****** */}
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
                    {/* <MenuItem value={boardinglogs?.length}>All</MenuItem> */}
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
            {!boardinglogcheck ? (
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
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
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
                <Grid item md={4} xs={12} sm={6}>
                  <Typography>Start Date</Typography>
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
                        min: new Date().toISOString().split("T")[0], // Set the minimum date to today
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
                        setSelectedOptionsCate([]);
                        setValueCate([]);
                        setValueCateWeeks([]);
                        setSelectedOptionsCateWeeks([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={0} xs={0}></Grid>
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
                                    {todo.shiftgrouping}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.shifttiming}
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
                                    {todo.shiftgrouping}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.shifttiming}
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
                                    {todo.shiftgrouping}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.shifttiming}
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
                                    {todo.shiftgrouping}
                                  </Typography>
                                </Grid>
                                <Grid item md={2} sm={6} xs={12}>
                                  <Typography
                                    variant="subtitle2"
                                    color="textSecondary"
                                  >
                                    {todo.shifttiming}
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
                    <Button variant="contained" onClick={editSubmit}>
                      Update
                    </Button>
                  ) : null}
                  &emsp;
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
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

      {/* Delete Modal */}
      <Box>
        {/* this is info view details */}

        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}>Shift Log Info</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
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
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
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
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {"SNO"}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {"UserName"}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
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
                              {moment(item.date).format(
                                "DD-MM-YYYY hh:mm:ss a"
                              )}
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
                <TableCell>SNo</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Shift Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="left">
              {rowDataTable &&
                rowDataTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.companyname}</TableCell>
                    <TableCell>{row.branch}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.team}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.shiftgrouping}</TableCell>
                    <TableCell>{row.shifttype}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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

          {fileFormat === "xl" ? (
            <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
          ) : (
            <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
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
              fetchBoardinglognew();
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ShiftLogChange;
