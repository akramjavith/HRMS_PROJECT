import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
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
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { Link, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import axios from "axios";
import Headtitle from "../../../../components/Headtitle";
import { handleApiError } from "../../../../components/Errorhandling";
import { SERVICE } from "../../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../../../components/TableStyle";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv, FaPlus, FaEdit } from "react-icons/fa";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

import { StyledTableRow, StyledTableCell } from "../../../../components/Table";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Selects from "react-select";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function ShiftLogListChange() {
  const gridRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const [boardinglogs, setBoardinglogs] = useState([]);
  const [userID, setUserID] = useState([]);
  const [showTeam, setShowTeam] = useState(true);
  const [boardinglogsTeam, setBoardinglogsTeam] = useState([]);
  const [isBoardinglogsTeam, setIsBoardinglogsTeam] = useState([]);
  const [items, setItems] = useState([]);
  const [teamlogcheck, setTeamlogcheck] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [copiedData, setCopiedData] = useState("");

  // info
  const [openInfo, setOpenInfo] = useState(false);
  const [infoDetails, setInfoDetails] = useState({});
  const handleCloseinfo = () => {
    setOpenInfo(false);
  };
  const handleOpeninfo = () => {
    setOpenInfo(true);
  };

  //view
  const [openView, setOpenView] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const handleCloseView = () => {
    setOpenView(false);
  };
  const handleOpenView = () => {
    setOpenView(true);
  };

  const [editDetails, setEditDetails] = useState({});
  const [editDetailsOld, setEditDetailsOld] = useState({});
  const [isLastLog, setIsLastLog] = useState(false);

  //get single row to edit....

  const editSubmit = (e) => {
    e.preventDefault();
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
      editDetails.originalstartdate === "" ||
      editDetails.originalstartdate === undefined
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Start Date"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (editDetails.time === "" || editDetails.time === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Time"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      editDetails.shifttype === "Please Select Shift Type" ||
      editDetails.shifttype === "" ||
      editDetails.shifttype === undefined
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
    } else if (
      editDetails.shifttype === "Standard" &&
      (editDetails.shiftgrouping === "" ||
        editDetails.shiftgrouping === "Please Select Shift Grouping" ||
        editDetails.shiftgrouping === undefined)
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
    } else if (
      editDetails.shifttype === "Standard" &&
      (editDetails.shifttiming === "" ||
        editDetails.shifttiming === "Please Select Shift" ||
        editDetails.shifttiming === undefined)
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
    } else if (
      editDetails.shifttype === "1 Week Rotation" &&
      oneweekrotation > 0
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
      editDetails.shifttype === "2 Week Rotation" &&
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
      editDetails.shifttype === "1 Month Rotation" &&
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
    } else if (editDetails.shifttype !== "Standard") {
      let hasError = false;

      // Iterate over each row in the todo list for validation
      for (let i = 0; i < todo?.length; i++) {
        const row = todo[i];

        if (row.shiftmode === "Please Select Shift Mode") {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                Please Select Shift Mode
              </p>
            </>
          );
          handleClickOpenerr();
          hasError = true;
          break; // Break the loop if an error is found
        } else if (
          row.shiftmode === "Shift" &&
          row.shiftgrouping === "Please Select Shift Grouping"
        ) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>
                Please Select Shift Grouping
              </p>
            </>
          );
          handleClickOpenerr();
          hasError = true;
          break;
        } else if (
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
                Please Select Shift
              </p>
            </>
          );
          handleClickOpenerr();
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        sendEditRequest();
      }
    }
    // else if (editDetails.shifttype === "Standard" && !isChanged) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"No Changes to Update"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // } else if (editDetails.shifttype !== "Standard" && !isChangedTodo) {
    //   setShowAlert(
    //     <>
    //       <ErrorOutlineOutlinedIcon
    //         sx={{ fontSize: "100px", color: "orange" }}
    //       />
    //       <p style={{ fontSize: "20px", fontWeight: 900 }}>
    //         {"No Changes to Update"}
    //       </p>
    //     </>
    //   );
    //   handleClickOpenerr();
    // }
    else {
      sendEditRequest();
    }
  };

  const sendEditRequest = async () => {
    try {
      if (isLastLog) {
        let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          shifttype: String(editDetails.shifttype),
          shifttiming: String(editDetails.shifttiming),
          shiftgrouping: String(editDetails.shiftgrouping),
        });
        await axios.put(
          `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=boardingLog`,
          {
            startdate: String(editDetails.originalstartdate),
            shifttype: String(editDetails.shifttype),
            shifttiming: String(editDetails.shifttiming),
            shiftgrouping: String(editDetails.shiftgrouping),
            weekoff: [...valueCate],
            todo: editDetails.shifttype === "Standard" ? [] : [...todo],

            logeditedby: [
              ...editDetails?.logeditedby,
              {
                username: String(isUserRoleAccess?.username),
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

        await rowData();

        handleCloseEdit();
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
      } else {
        await axios.put(
          `${SERVICE.UPDATEANYLOG}/?logid=${editDetails?.id}&logname=boardingLog`,
          {
            startdate: String(editDetails.originalstartdate),
            shifttype: String(editDetails.shifttype),
            shifttiming: String(editDetails.shifttiming),
            shiftgrouping: String(editDetails.shiftgrouping),
            weekoff: [...valueCate],
            todo: editDetails.shifttype === "Standard" ? [] : [...todo],

            logeditedby: [
              ...editDetails?.logeditedby,
              {
                username: String(isUserRoleAccess?.username),
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

        await rowData();

        handleCloseEdit();
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
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenDelete = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const [deleteionId, setDeletionId] = useState({});

  const handleDeleteLog = async () => {
    if (isLastLog) {
      const getindex = deleteionId?.index - 1;
      const getdata = isBoardinglogsTeam.filter((data, index) => {
        return Number(getindex) === index;
      });
      let res = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        shifttype: getdata[0]?.shifttype,
        shifttiming: getdata[0]?.shifttiming,
        shiftgrouping: getdata[0]?.shiftgrouping,
      });
      await axios.put(
        `${SERVICE.UPDATEANYLOG}/?logid=${deleteionId?.id}&logname=boardingLog`,
        {
          shifttype: getdata[0]?.shifttype,
          shifttiming: getdata[0]?.shifttiming,
          shiftgrouping: getdata[0]?.shiftgrouping,
          weekoff: getdata[0]?.weekoff,
          todo: getdata[0]?.todo,
          logcreation: "boarding",
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      await rowData();
      setPage(1);
      handleCloseDelete();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7AC767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      const getindex = deleteionId?.index - 1;
      const getdata = isBoardinglogsTeam.filter((data, index) => {
        return Number(getindex) === index;
      });
      await axios.put(
        `${SERVICE.UPDATEANYLOG}/?logid=${deleteionId?.id}&logname=boardingLog`,
        {
          shifttype: getdata[0]?.shifttype,
          shifttiming: getdata[0]?.shifttiming,
          shiftgrouping: getdata[0]?.shiftgrouping,
          weekoff: getdata[0]?.weekoff,
          todo: getdata[0]?.todo,
          logcreation: "boarding",
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      await rowData();
      setPage(1);
      handleCloseDelete();
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "#7AC767" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
    setEditDetails({});
    setEditDetailsOld({});
  };

  const ShiftTypeOptions = [
    { label: "Standard", value: "Standard" },
    { label: "Daily", value: "Daily" },
    { label: "1 Week Rotation (2 Weeks)", value: "1 Week Rotation" },
    { label: "2 Week Rotation (Monthly)", value: "2 Week Rotation" },
    { label: "1 Month Rotation (2 Month)", value: "1 Month Rotation" },
  ];

  // days
  const weekdays = [
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
      options?.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _days) => {
    return valueCate?.length
      ? valueCate?.map(({ label }) => label).join(", ")
      : "Please Select Days";
  };

  const [todoOld, setTodoOld] = useState([]);
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
    if (editDetails.shifttype === "Please Select Shift Type") {
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
      if (editDetails.shifttype === "Daily") {
        if (editDetails.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (editDetails.shifttiming === "Please Select Shift") {
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
              ? editDetails.shiftgrouping
              : "",
            shifttiming: !valueCate.includes(day)
              ? editDetails.shifttiming
              : "",
          }));
          setTodo(newTodoList);
        }
      }

      if (editDetails.shifttype === "1 Week Rotation") {
        if (editDetails.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (editDetails.shifttiming === "Please Select Shift") {
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
                    ? editDetails.shiftgrouping
                    : "",
                  shifttiming: !valueCate.includes(day)
                    ? editDetails.shifttiming
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
                    ? editDetails.shiftgrouping
                    : "",
                  shifttiming: !valueCate.includes(day)
                    ? editDetails.shifttiming
                    : "",
                }))
              : []), // Return an empty array if "2nd Week" is not in valueCateWeeks
          ];

          setTodo((prev) => [...prev, ...newTodoList]);
          setValueCateWeeks([]);
          setSelectedOptionsCateWeeks([]);
        }
      }

      if (editDetails.shifttype === "2 Week Rotation") {
        if (editDetails.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (editDetails.shifttiming === "Please Select Shift") {
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
                ? editDetails.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day)
                ? editDetails.shifttiming
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

      if (editDetails.shifttype === "1 Month Rotation") {
        if (editDetails.shiftgrouping === "Please Select Shift Grouping") {
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
        } else if (editDetails.shifttiming === "Please Select Shift") {
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
                ? editDetails.shiftgrouping
                : "",
              shifttiming: !valueCate.includes(day)
                ? editDetails.shifttiming
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
  const [ShiftGroupingOptions, setShiftGroupingOptions] = useState([]);
  const [shifts, setShifts] = useState([]);

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

  useEffect(() => {
    ShiftGroupingDropdwons();
  }, []);

  // Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
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

  // Copied fields Name
  const handleCopy = (message) => {
    NotificationManager.success(`${message} 👍`, "", 2000);
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
    starttime: true,
    username: true,
    startdate: true,
    time: true,
    branch: true,
    unit: true,
    team: true,
    company: true,
    createdby: true,
    shifttype: true,
    shift: true,
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

  const logid = useParams().id;
  const [userData, setUserData] = useState({});
  const rowData = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setBoardinglogs(res?.data?.suser.boardingLog);
      setUserData(res?.data?.suser);
      setUserID(logid);

      const currentUser = res?.data?.suser;

      // Step 2: Create a new array with necessary fields
      const newarray = res?.data?.suser.boardingLog
        ?.filter(
          (data) => data.logcreation === "user" || data.logcreation === "shift"
        )
        ?.map((item) => {
          return {
            _id: item._id,
            team: item.team,
            username: currentUser.companyname,
            startdate: item.startdate,
            createdby: item?.updatedusername,
            time: item.updateddatetime
              ? moment(item.updateddatetime).format("DD-MM-YYYY hh:mm:ss a")
              : "",
            branch: item.branch,
            unit: item.unit,
            company: item.company,
            shifttiming: item.shifttiming,
            shiftgrouping: item.shiftgrouping,
            shifttype: item.shifttype,
            weekoff: item.weekoff,
            todo: item.todo,
            logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
          };
        });

      // Step 3: Update the state
      setBoardinglogsTeam(newarray);
      setIsBoardinglogsTeam(newarray);
      setTeamlogcheck(true);
    } catch (err) {
      setTeamlogcheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [boardinglogsTeamArray, setBoardinglogsTeamArray] = useState([]);

  const rowDataArray = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${logid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const currentUser = res.data.suser;

      // Step 2: Create a new array with necessary fields
      const getarr = res?.data?.suser.boardingLog.filter((data, index) => {
        return data.logcreation === "user" || data.logcreation === "shift";
      });
      const newarray = getarr?.map((item) => {
        return {
          _id: item._id,
          team: item.team,
          username: currentUser.companyname,
          startdate: item.startdate,
          createdby: item?.updatedusername,
          time: item.updateddatetime
            ? moment(item.updateddatetime).format("DD-MM-YYYY hh:mm:ss a")
            : "",
          branch: item.branch,
          unit: item.unit,
          company: item.company,
          shifttiming: item.shifttiming,
          shiftgrouping: item.shiftgrouping,
          shifttype: item.shifttype,
          weekoff: item.weekoff,
          todo: item.todo,
        };
      });

      // Step 3: Update the state
      setBoardinglogsTeamArray(newarray);
      setTeamlogcheck(true);
    } catch (err) {
      setTeamlogcheck(true);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    rowDataArray();
  }, [isFilterOpen]);

  useEffect(() => {
    rowData();
  }, [logid]);

  const getCode = async (params) => {
    try {
      await ShiftDropdwonsSecond(params?.shiftgrouping);
      setValueCate(params?.weekoff);
      setSelectedOptionsCate(
        params?.weekoff?.length > 0
          ? params?.weekoff?.map((data) => ({
              label: data,
              value: data,
            }))
          : []
      );
      setTodo(params?.todo);
      setTodoOld(params?.todo);
      handleOpenEdit();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Excel
  const fileName = "Shift Log List";

  // print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Shift Log List",
    pageStyle: "print",
  });

  // pdf.....
  const columns = [
    { title: "Company ", field: "company" },
    { title: "Branch", field: "branch" },
    { title: "Unit", field: "unit" },
    { title: "Team", field: "team" },
    { title: "Employee Name", field: "username" },
    { title: "Start Date", field: "startdate" },
    { title: "Created Date&Time", field: "time" },
    { title: "Created By", field: "createdby" },
    { title: "Shift Type", field: "shifttype" },
  ];

  const downloadPdf = (isfilter) => {
    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns?.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial =
      isfilter === "filtered"
        ? rowDataTable?.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
          }))
        : boardinglogsTeamArray?.map((row) => ({
            ...row,
            serialNumber: serialNumberCounter++,
            startdate: moment(row.startdate).format("DD-MM-YYYY"),
          }));

    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("Shift Log List.pdf");
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Shift Log List.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const addSerialNumber = () => {
    const itemsWithSerialNumber = boardinglogsTeam?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      index,
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [boardinglogsTeam]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchOverTerms.every((term) =>
      Object.values(item)?.join(" ")?.toLowerCase()?.includes(term)
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

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const columnDataTable = [
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
      field: "unit",
      headerName: "Unit",
      flex: 0,
      width: 150,
      hide: !columnVisibility.unit,
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
      field: "startdate",
      headerName: "Start Date",
      flex: 0,
      width: 150,
      hide: !columnVisibility.startdate,
      headerClassName: "bold-header",
    },
    {
      field: "time",
      headerName: "Created Date&Time",
      flex: 0,
      width: 150,
      hide: !columnVisibility.time,
      headerClassName: "bold-header",
    },
    {
      field: "createdby",
      headerName: "Created By",
      flex: 0,
      width: 150,
      hide: !columnVisibility.createdby,
      headerClassName: "bold-header",
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
      renderCell: (params) => {
        return (
          <>
            {params?.row?.index === 0 ? (
              ""
            ) : (
              <Grid sx={{ display: "flex" }}>
                {isUserRoleCompare?.includes("eshiftlog") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        setEditDetails(params.row);
                        setEditDetailsOld(params.row);
                        getCode(params.row);
                        setIsLastLog(params?.row?.index === items?.length - 1);
                      }}
                    >
                      <EditOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                  </>
                )}
                {isUserRoleCompare?.includes("dshiftlog") && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpenDelete();
                        setDeletionId(params.row);
                        setIsLastLog(params?.row?.index === items?.length - 1);
                      }}
                    >
                      <DeleteOutlineOutlinedIcon
                        style={{ fontsize: "large" }}
                      />
                    </Button>
                  </>
                )}
              </Grid>
            )}
            <Grid sx={{ display: "flex" }}>
              {isUserRoleCompare?.includes("vshiftlog") && (
                <>
                  <Button
                    size="small"
                    sx={userStyle.buttondelete}
                    onClick={(e) => {
                      handleOpenView();
                      setViewDetails(params.row);
                      setTodo(params?.row?.todo);
                    }}
                  >
                    <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                  </Button>
                </>
              )}
              {isUserRoleCompare?.includes("ishiftlog") &&
                params?.row?.logeditedby?.length > 0 && (
                  <>
                    <Button
                      size="small"
                      sx={userStyle.buttondelete}
                      onClick={(e) => {
                        handleOpeninfo();
                        setInfoDetails(params.row);
                      }}
                    >
                      <InfoOutlinedIcon style={{ fontsize: "large" }} />
                    </Button>
                  </>
                )}
            </Grid>
          </>
        );
      },
    },
  ];
  const rowDataTable = filteredData?.map((item) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      startdate: moment(item.startdate).format("DD-MM-YYYY"),
      originalstartdate: item.startdate,
      username: item.username,
      starttime: item.starttime,
      time: item.time,
      createdby: item.createdby,
      company: item.company,
      branch: item.branch,
      unit: item.unit,
      team: item.team,
      process: item.process,
      shifttype: item.shifttype,
      shiftgrouping: item?.shiftgrouping,
      shifttiming: item?.shifttiming,
      weekoff: item.weekoff?.length > 0 ? item?.weekoff : [],
      todo: item.todo?.length > 0 ? item?.todo : [],
      logeditedby: item?.logeditedby?.length > 0 ? item?.logeditedby : [],
      index: item?.index,
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
          company: t.company,
          branch: t.branch,
          unit: t.unit,
          team: t.team,
          employeename: t.username,
          "Start Date": t.startdate,
          "Created Date&Time": t.time,
          "Created By": t.createdby,
          shifttype: t.shifttype,
        })),
        fileName
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        boardinglogsTeamArray?.map((t, index) => ({
          Sno: index + 1,
          company: t.company,
          branch: t.branch,
          unit: t.unit,
          team: t.team,
          employeename: t.username,
          "Start Date": t.startdate,
          "Created Date&Time": t.time,
          "Created By": t.createdby,
          shifttype: t.shifttype,
        })),
        fileName
      );
    }

    setIsFilterOpen(false);
  };

  return (
    <Box>
      <NotificationContainer />
      <Headtitle title={"SHIFT LOG LIST"} />

      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lshiftlog") && (
        <>
          <Box sx={userStyle.container}>
            <Grid container spacing={2}>
              <Grid item md={8} xs={8}>
                <Typography sx={userStyle.importheadtext}>
                  Shift Log List Employee Name : <b>{userData?.companyname}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={3}></Grid>
              <Grid item md={1} xs={1}>
                <Link to={"/updatepages/shiftlog"}>
                  <Button variant="contained">Back</Button>
                </Link>
              </Grid>
            </Grid>
            <br />
            <Box>
              <br />

              <br />
              {showTeam ? (
                <Box>
                  <Grid container spacing={2}>
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
                          {/* <MenuItem value={boardinglogsTeam?.length}>
                                                        All
                                                    </MenuItem> */}
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
                                rowDataArray();
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
                                rowDataArray();
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
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleprint}
                            >
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
                                rowDataArray();
                              }}
                            >
                              <FaFilePdf />
                              &ensp;Export to PDF&ensp;
                            </Button>
                          </>
                        )}
                        {isUserRoleCompare?.includes("imageshiftlog") && (
                          <>
                            <Button
                              sx={userStyle.buttongrp}
                              onClick={handleCaptureImage}
                            >
                              {" "}
                              <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                              &ensp;Image&ensp;{" "}
                            </Button>
                          </>
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
                  <Button
                    sx={userStyle.buttongrp}
                    onClick={handleShowAllColumns}
                  >
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
                  <br />
                  <br />
                  {!teamlogcheck ? (
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
                      <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                          {filteredData?.length > 0
                            ? (page - 1) * pageSize + 1
                            : 0}{" "}
                          to {Math.min(page * pageSize, filteredDatas?.length)}{" "}
                          of {filteredDatas?.length} entries
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
                              <TableCell>Start Date</TableCell>
                              <TableCell>Created Date&Time</TableCell>
                              <TableCell>Created By</TableCell>
                              <TableCell>Shift Type</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody align="left">
                            {rowDataTable &&
                              rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{row.company}</TableCell>
                                  <TableCell>{row.branch}</TableCell>
                                  <TableCell>{row.unit}</TableCell>
                                  <TableCell>{row.team}</TableCell>
                                  <TableCell>{row.username}</TableCell>
                                  <TableCell>{row.startdate}</TableCell>
                                  <TableCell>{row.time}</TableCell>
                                  <TableCell>{row.createdby}</TableCell>
                                  <TableCell>{row.shifttype}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </Box>
              ) : null}
              {/* {showProcess ? (
                <ProcessLogList boardinglogs={boardinglogs} userID={userID} />
              ) : null}
              {showShifts ? (
                <ShiftLogList boardinglogs={boardinglogs} userID={userID} />
              ) : null} */}
            </Box>
          </Box>
        </>
      )}

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
              rowDataArray();
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

      {/* VIEW */}
      <Dialog
        maxWidth="lg"
        open={openView}
        onClose={handleCloseView}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={8} sm={12} xs={12}>
              <Typography sx={userStyle.HeaderText}>
                View Shift Log{" "}
                <b style={{ color: "red" }}>{viewDetails?.username}</b>
              </Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Button
                variant="contained"
                onClick={() => {
                  handleCloseView();
                }}
              >
                Back
              </Button>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Company</b>
                </Typography>
                <Typography>{viewDetails?.company}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Branch</b>
                </Typography>
                <Typography>{viewDetails?.branch}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Unit</b>
                </Typography>
                <Typography>{viewDetails?.unit}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Team</b>
                </Typography>
                <Typography>{viewDetails?.team}</Typography>
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Start Date</b>
                </Typography>
                <Typography>{viewDetails?.startdate}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Created Date&Time</b>
                </Typography>
                <Typography>{viewDetails?.time}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Created By</b>
                </Typography>
                <Typography>{viewDetails?.createdby}</Typography>
              </FormControl>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  <b>Shift Type</b>
                </Typography>
                <Typography>{viewDetails?.shifttype}</Typography>
              </FormControl>
            </Grid>
            {viewDetails.shifttype === "Standard" ? (
              <>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>
                    Shift Grouping : <b>{viewDetails.shiftgrouping}</b>
                  </Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography>
                    Shift : <b>{viewDetails.shifttiming}</b>
                  </Typography>
                </Grid>
                <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
                  <Typography>Week Off</Typography>
                  {viewDetails?.weekoff?.length !== 0
                    ? viewDetails?.weekoff?.map((data, index) => (
                        <Typography>
                          {index + 1}.{data}
                        </Typography>
                      ))
                    : ""}
                </Grid>
              </>
            ) : null}

            <Grid item md={12} sm={12} xs={12}>
              {viewDetails.shifttype === "Daily" ? (
                <>
                  {todo?.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>
                          <b>Day</b>
                        </Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>
                          <b>Week</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift Mode</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift Grouping</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift</b>{" "}
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
                          <Typography>{todo.shiftmode}</Typography>
                        </Grid>
                        {todo.shiftmode === "Week Off" ? (
                          <Grid item md={6} sm={6} xs={12}></Grid>
                        ) : (
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Typography>{todo.shiftgrouping}</Typography>
                            </Grid>
                            <Grid item md={3} xs={6} sm={6}>
                              <Typography>{todo.shifttiming}</Typography>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ))}
                </>
              ) : null}

              {viewDetails.shifttype === "1 Week Rotation" ? (
                <>
                  {todo?.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>
                          <b>Day</b>
                        </Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>
                          <b>Week</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift Mode</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift Grouping</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift</b>
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
                          <Typography>{todo.shiftmode}</Typography>
                        </Grid>
                        {todo.shiftmode === "Week Off" ? (
                          <Grid item md={6} sm={6} xs={12}></Grid>
                        ) : (
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Typography>{todo.shiftgrouping}</Typography>
                            </Grid>
                            <Grid item md={3} xs={6} sm={6}>
                              <Typography>{todo.shifttiming}</Typography>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ))}
                </>
              ) : null}

              {viewDetails.shifttype === "2 Week Rotation" ? (
                <>
                  {todo?.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>
                          <b>Day</b>
                        </Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>
                          <b>Week</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift Mode</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift Grouping</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift</b>{" "}
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
                          <Typography>{todo.shiftmode}</Typography>
                        </Grid>
                        {todo.shiftmode === "Week Off" ? (
                          <Grid item md={6} sm={6} xs={12}></Grid>
                        ) : (
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Typography>{todo.shiftgrouping}</Typography>
                            </Grid>
                            <Grid item md={3} xs={6} sm={6}>
                              <Typography>{todo.shifttiming}</Typography>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ))}
                </>
              ) : null}

              {viewDetails.shifttype === "1 Month Rotation" ? (
                <>
                  {todo?.length > 0 ? (
                    <Grid container spacing={2}>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>
                          <b>Day</b>
                        </Typography>
                      </Grid>
                      <Grid item md={1.5} sm={12} xs={12}>
                        <Typography>
                          <b>Week</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift Mode</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift Grouping</b>
                        </Typography>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <Typography>
                          <b>Shift</b>
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
                          <Typography>{todo.shiftmode}</Typography>
                        </Grid>
                        {todo.shiftmode === "Week Off" ? (
                          <Grid item md={6} sm={6} xs={12}></Grid>
                        ) : (
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Typography>{todo.shiftgrouping}</Typography>
                            </Grid>
                            <Grid item md={3} xs={6} sm={6}>
                              <Typography>{todo.shifttiming}</Typography>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    ))}
                </>
              ) : null}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Edit DIALOG */}
      <Dialog
        open={isEditOpen}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <Box sx={{ padding: "20px" }}>
          <>
            {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
            <Typography sx={userStyle.HeaderText}>Edit Shift Log</Typography>
            <br></br>
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Employee Name : <b>{editDetails.username}</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <Typography>
                  Company : <b>{editDetails.company}</b>
                </Typography>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Typography>
                  Branch : <b>{editDetails.branch}</b>
                </Typography>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Typography>
                  Unit : <b>{editDetails.unit}</b>
                </Typography>
              </Grid>
              <Grid item md={2} xs={12} sm={12}>
                <Typography>
                  Team : <b>{editDetails.team}</b>
                </Typography>
              </Grid>

              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Start Date<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={editDetails.originalstartdate}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        originalstartdate: e.target.value,
                      });
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
                      label: editDetails.shifttype,
                      value: editDetails.shifttype,
                    }}
                    onChange={(e) => {
                      setEditDetails({
                        ...editDetails,
                        shifttype: e.value,
                        shiftgrouping: "",
                        shifttiming: "",
                      });
                      setTodo([]);
                      setValueCate([]);
                      setSelectedOptionsCate([]);
                      // handleAddTodo(e.value);
                      setValueCateWeeks([]);
                      setSelectedOptionsCateWeeks([]);
                    }}
                  />
                </FormControl>
              </Grid>
              {editDetails.shifttype === "Standard" ? (
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
                            editDetails.shiftgrouping === "" ||
                            editDetails.shiftgrouping === undefined
                              ? "Please Select Shift Grouping"
                              : editDetails.shiftgrouping,
                          value:
                            editDetails.shiftgrouping === "" ||
                            editDetails.shiftgrouping === undefined
                              ? "Please Select Shift Grouping"
                              : editDetails.shiftgrouping,
                        }}
                        onChange={(e) => {
                          setEditDetails({
                            ...editDetails,
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
                            editDetails.shifttiming === "" ||
                            editDetails.shifttiming === undefined
                              ? "Please Select Shift"
                              : editDetails.shifttiming,
                          value:
                            editDetails.shifttiming === "" ||
                            editDetails.shifttiming === undefined
                              ? "Please Select Shift"
                              : editDetails.shifttiming,
                        }}
                        onChange={(e) => {
                          setEditDetails({
                            ...editDetails,
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
                {editDetails.shifttype === "Daily" ? (
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
                                editDetails.shiftgrouping === "" ||
                                editDetails.shiftgrouping === undefined
                                  ? "Please Select Shift Grouping"
                                  : editDetails.shiftgrouping,
                              value:
                                editDetails.shiftgrouping === "" ||
                                editDetails.shiftgrouping === undefined
                                  ? "Please Select Shift Grouping"
                                  : editDetails.shiftgrouping,
                            }}
                            onChange={(e) => {
                              setEditDetails({
                                ...editDetails,
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
                                editDetails.shifttiming === "" ||
                                editDetails.shifttiming === undefined
                                  ? "Please Select Shift"
                                  : editDetails.shifttiming,
                              value:
                                editDetails.shifttiming === "" ||
                                editDetails.shifttiming === undefined
                                  ? "Please Select Shift"
                                  : editDetails.shifttiming,
                            }}
                            onChange={(e) => {
                              setEditDetails({
                                ...editDetails,
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
                                    style={{ fontSize: "1.5rem", color: "red" }}
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

                {editDetails.shifttype === "1 Week Rotation" ? (
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
                                editDetails.shiftgrouping === "" ||
                                editDetails.shiftgrouping === undefined
                                  ? "Please Select Shift Grouping"
                                  : editDetails.shiftgrouping,
                              value:
                                editDetails.shiftgrouping === "" ||
                                editDetails.shiftgrouping === undefined
                                  ? "Please Select Shift Grouping"
                                  : editDetails.shiftgrouping,
                            }}
                            onChange={(e) => {
                              setEditDetails({
                                ...editDetails,
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
                                editDetails.shifttiming === "" ||
                                editDetails.shifttiming === undefined
                                  ? "Please Select Shift"
                                  : editDetails.shifttiming,
                              value:
                                editDetails.shifttiming === "" ||
                                editDetails.shifttiming === undefined
                                  ? "Please Select Shift"
                                  : editDetails.shifttiming,
                            }}
                            onChange={(e) => {
                              setEditDetails({
                                ...editDetails,
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
                      <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
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
                                    style={{ fontSize: "1.5rem", color: "red" }}
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

                {editDetails.shifttype === "2 Week Rotation" ? (
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
                                editDetails.shiftgrouping === "" ||
                                editDetails.shiftgrouping === undefined
                                  ? "Please Select Shift Grouping"
                                  : editDetails.shiftgrouping,
                              value:
                                editDetails.shiftgrouping === "" ||
                                editDetails.shiftgrouping === undefined
                                  ? "Please Select Shift Grouping"
                                  : editDetails.shiftgrouping,
                            }}
                            onChange={(e) => {
                              setEditDetails({
                                ...editDetails,
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
                                editDetails.shifttiming === "" ||
                                editDetails.shifttiming === undefined
                                  ? "Please Select Shift"
                                  : editDetails.shifttiming,
                              value:
                                editDetails.shifttiming === "" ||
                                editDetails.shifttiming === undefined
                                  ? "Please Select Shift"
                                  : editDetails.shifttiming,
                            }}
                            onChange={(e) => {
                              setEditDetails({
                                ...editDetails,
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
                      <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
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
                                    style={{ fontSize: "1.5rem", color: "red" }}
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

                {editDetails.shifttype === "1 Month Rotation" ? (
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
                                editDetails.shiftgrouping === "" ||
                                editDetails.shiftgrouping === undefined
                                  ? "Please Select Shift Grouping"
                                  : editDetails.shiftgrouping,
                              value:
                                editDetails.shiftgrouping === "" ||
                                editDetails.shiftgrouping === undefined
                                  ? "Please Select Shift Grouping"
                                  : editDetails.shiftgrouping,
                            }}
                            onChange={(e) => {
                              setEditDetails({
                                ...editDetails,
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
                                editDetails.shifttiming === "" ||
                                editDetails.shifttiming === undefined
                                  ? "Please Select Shift"
                                  : editDetails.shifttiming,
                              value:
                                editDetails.shifttiming === "" ||
                                editDetails.shifttiming === undefined
                                  ? "Please Select Shift"
                                  : editDetails.shifttiming,
                            }}
                            onChange={(e) => {
                              setEditDetails({
                                ...editDetails,
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
                      <Grid item md={4} sm={6} xs={12} sx={{ display: "flex" }}>
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
                                    style={{ fontSize: "1.5rem", color: "red" }}
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
                {/* {editDetails.shifttype === "Daily" ? (
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

                {editDetails.shifttype === "1 Week Rotation" ? (
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

                {editDetails.shifttype === "2 Week Rotation" ? (
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

                {editDetails.shifttype === "1 Month Rotation" ? (
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
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <Button
                  variant="contained"
                  style={{
                    padding: "7px 13px",
                    color: "white",
                    background: "rgb(25, 118, 210)",
                  }}
                  onClick={editSubmit}
                >
                  Update
                </Button>
              </Grid>
              <Grid item md={6} xs={6} sm={6}>
                <Button sx={userStyle.btncancel} onClick={handleCloseEdit}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>

      {/* INFO */}
      <Dialog
        open={openInfo}
        onClose={handleCloseinfo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "550px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              Department Log Edited By
            </Typography>
            <br />
            <br />
            <Grid container spacing={2}>
              <Grid item md={12} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Edited by</Typography>
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
                      {infoDetails?.logeditedby?.map((item, i) => (
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
                            {item.username}
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
                sx={{ marginLeft: "15px" }}
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
        open={isDeleteOpen}
        onClose={handleCloseDelete}
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
          <Button onClick={handleCloseDelete} sx={userStyle.btncancel}>
            Cancel
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={(e) => handleDeleteLog(deleteionId)}
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ShiftLogListChange;
