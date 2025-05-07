import React, { useState, useEffect, useRef, useContext } from "react";
import {
  DialogTitle,
  Checkbox,
  Box,
  Typography,
  OutlinedInput,
  TableBody,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import { colourStyles, userStyle } from "../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import "jspdf-autotable";
import axios from "axios";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { handleApiError } from "../../components/Errorhandling";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Selects from "react-select";
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import csvIcon from "../../components/Assets/CSV.png";
import fileIcon from "../../components/Assets/file-icons.png";
import { FaTrash } from "react-icons/fa";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useParams } from "react-router-dom";
import Webcamimage from "../task/webcamimagetaskview";

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
    complete: {
      textTransform: "capitalize !IMPORTANT",
      padding: "7px 19px",
      backgroundColor: "#00905d",
      height: "fit-content",
    },
  },
}));

function TaskMaintenanceUserPanelView() {
  const classes = useStyles();

  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const [filterValue, setFilterValue] = useState("Please Select Status");
  const [filterValueTicket, setFilterValueTicket] = useState("Please Select Status");
  const [allUploadedFiles, setAllUploadedFiles] = useState([]);
  const [checkTimerStart, setCheckTimerStart] = useState(false);
  const [userStatusDes, setUserStatusDes] = useState("");
  const { isUserRoleCompare, isUserRoleAccess, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [selectedRows, setSelectedRows] = useState([]);
  //Datatable
  const [queueCheck, setQueueCheck] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // Error Popup model
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    handleCloseDelete();
  };

  const newcurrentTime = new Date();

  const currentHour = newcurrentTime.getHours();
  const currentMinute = newcurrentTime.getMinutes();
  const period = currentHour >= 12 ? "PM" : "AM";
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);

  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);
  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    webcamClose();
    setGetImg("");
  };
  const showWebcam = () => {
    webcamOpen();
  };
  const [getimgbillcode, setGetImgbillcode] = useState([]);

  let name = "create";
  //   let allUploadedFiles = [];
  const [isimgviewbill, setImgviewbill] = useState(false);
  const handleImgcodeviewbill = () => {
    setImgviewbill(true);
  };
  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };
  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [uploadImageIndex, setUploadImageIndex] = useState(-1);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  //reference images
  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImage(newSelectedFiles);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        handleClickOpenalert();
      }
    }
  };
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const removeCapturedImage = (index) => {
    const newCapturedImages = [...capturedImages];
    newCapturedImages.splice(index, 1);
    setCapturedImages(newCapturedImages);
  };
  const resetImage = () => {
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    previewFile(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDrag];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newSelectedFilesDrag.push({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: reader.result,
            base64: reader.result.split(",")[1],
          });
          setRefImageDrag(newSelectedFilesDrag);
        };
        reader.readAsDataURL(file);
      } else {
        setShowAlert(
          <>
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Only Accept Images!"}
            </p>
          </>
        );
        handleClickOpenalert();
      }
    }
  };
  const handleUploadOverAll = () => {
    const FilteredData =
      updateDetails?.length > 0 ? updateDetails : tableFormat;
    const updatedTodos = [...FilteredData];
    updatedTodos[uploadImageIndex].files = combinedArray;
    updateDetails?.length > 0
      ? setUpDateDetails(updatedTodos)
      : setTableFormat(updatedTodos);
    setUploadPopupOpen(false);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...refImageDrag];
    newSelectedFiles.splice(index, 1);
    setRefImageDrag(newSelectedFiles);
  };

  const [userShiftDetails, setUserShiftDetails] = useState("");
  const [updatedShiftDetails, setUpdatedShiftDetails] = useState("");
  const [
    updatedStartShiftDetailsMinus2Hours,
    setUpdatedStartShiftDetailsMinus2Hours,
  ] = useState("");
  const [updatedEndShiftDetailsAdd4Hours, setUpdatedEndShiftDetailsAdd4Hours] =
    useState("");

  const checkCurrentDate = new Date();

  // get current time
  const currentHours = checkCurrentDate.getHours();
  const currentMinutes = checkCurrentDate.getMinutes();

  // Determine whether it's AM or PM
  const currentperiod = currentHours >= 12 ? "PM" : "AM";

  // Format the current time manually
  const formattedHours = currentHours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes =
    currentMinutes >= 10 ? currentMinutes : "0" + currentMinutes;
  // const formattedSeconds = currentSeconds >= 10 ? currentSeconds : '0' + currentSeconds;
  const currentTime = `${formattedHours}:${formattedMinutes}${currentperiod}`;

  const [calculatedTime, setCalculatedTime] = useState();
  const [shiftClosed, setShiftClosed] = useState("BLANK");

  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);
  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
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

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
  };

  const backPage = useNavigate();
  const open = Boolean(anchorEl);

  const handleCloseViewpop = () => {
    backPage("/asset/taskmaintenaceforuser");
  };
  //delete model
  const [openDelete, setOpenDelete] = useState(false);
  const handleClickOpen = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const convertTo24HourFormat = (time) => {
    let [hours, minutes] = time?.slice(0, -2).split(":");
    hours = parseInt(hours, 10);
    if (time.slice(-2) === "PM" && hours !== 12) {
      hours += 12;
    }
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  const fetchUsers = async () => {
    try {
      await fetchOverAllSettings();
      const [res_status] = await Promise.all([
        axios.get(SERVICE.TODAY_HOLIDAY, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      const mainShiftTiming = isUserRoleAccess?.mainshifttiming?.split("-");
      const secondShiftTiming = isUserRoleAccess?.issecondshift
        ? isUserRoleAccess?.secondshifttiming?.split("-")
        : "";
      const secondShiftStart = isUserRoleAccess?.issecondshift
        ? secondShiftTiming[0]?.split(":")
        : "";
      const secondShiftEnd = isUserRoleAccess?.issecondshift
        ? secondShiftTiming[1].split(":")
        : "";
      const secondShiftStartHour = isUserRoleAccess?.issecondshift
        ? parseInt(await convertTo24HourFormat(secondShiftTiming[0]), 10)
        : "";
      const secondShiftStartMinute = isUserRoleAccess?.issecondshift
        ? parseInt(secondShiftStart[1]?.slice(0, 2), 10)
        : "";
      const secondShiftStartPeriod = isUserRoleAccess?.issecondshift
        ? secondShiftStart[1]?.slice(2)
        : "";

      const secondShiftEndHour = isUserRoleAccess?.issecondshift
        ? parseInt(await convertTo24HourFormat(secondShiftTiming[1]), 10)
        : "";
      const secondShiftEndMinute = isUserRoleAccess?.issecondshift
        ? parseInt(secondShiftEnd[1]?.slice(0, 2), 10)
        : "";

      const isInSecondShift =
        (currentHour > secondShiftStartHour ||
          (currentHour === secondShiftStartHour &&
            currentMinute >= secondShiftStartMinute)) &&
        (currentHour < secondShiftEndHour ||
          (currentHour === secondShiftEndHour &&
            currentMinute <= secondShiftEndMinute)) &&
        period === secondShiftStartPeriod;

      if (
        mainShiftTiming[0]?.includes("PM") &&
        mainShiftTiming[1]?.includes("AM")
      ) {
        if (isUserRoleAccess?.issecondshift && isInSecondShift) {
          let res_shift = await axios.post(SERVICE.GETTODAYSHIFT, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            todayshifttiming: isUserRoleAccess?.secondshifttiming,
          });
          const regularshift = isUserRoleAccess?.secondshifttiming;
          const stcl = await fetchOverAllSettings();

          const [cin, cout] = stcl?.split("-");
          setUserShiftDetails(regularshift);
          updateTimeRange(regularshift, cin, cout);
          // Send approved shift endtime to the attandance's clockouttime
          const regularShiftEndTime = regularshift?.match(
            /\b\d{2}:\d{2}[APMapm]{2}\b/g
          );
          const regularEndTime = regularShiftEndTime
            ? regularShiftEndTime[1]
            : "";

          if (regularEndTime) {
            const originalTime = regularEndTime?.slice(0, -2);
            const period = regularEndTime?.slice(-2);

            const [hours, minutes] = originalTime?.split(":").map(Number);

            // Format the new time manually
            const formattedHours = hours >= 10 ? hours : "0" + hours;
            const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
              }${minutes}:00`;
          } else {
          }
        } else {
          const regularshift = isUserRoleAccess?.mainshifttiming;
          const stcl = await fetchOverAllSettings();

          const [cin, cout] = stcl?.split("-");
          setUserShiftDetails(regularshift);
          updateTimeRange(regularshift, cin, cout);
          // Send approved shift endtime to the attandance's clockouttime
          const regularShiftEndTime = regularshift?.match(
            /\b\d{2}:\d{2}[APMapm]{2}\b/g
          );
          const regularEndTime = regularShiftEndTime
            ? regularShiftEndTime[1]
            : "";

          if (regularEndTime) {
            const originalTime = regularEndTime?.slice(0, -2);
            const period = regularEndTime?.slice(-2);

            const [hours, minutes] = originalTime?.split(":").map(Number);

            // Format the new time manually
            const formattedHours = hours >= 10 ? hours : "0" + hours;
            const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
              }${minutes}:00`;
          } else {
          }
        }
      } else {
        if (isUserRoleAccess?.issecondshift && isInSecondShift) {
          const regularshift = isUserRoleAccess?.secondshifttiming;
          const stcl = await fetchOverAllSettings();

          const [cin, cout] = stcl?.split("-");
          setUserShiftDetails(regularshift);
          updateTimeRange(regularshift, cin, cout);
          // Send approved shift endtime to the attandance's clockouttime
          const regularShiftEndTime = regularshift?.match(
            /\b\d{2}:\d{2}[APMapm]{2}\b/g
          );
          const regularEndTime = regularShiftEndTime
            ? regularShiftEndTime[1]
            : "";

          if (regularEndTime) {
            const originalTime = regularEndTime?.slice(0, -2);
            const period = regularEndTime?.slice(-2);

            const [hours, minutes] = originalTime?.split(":").map(Number);

            // Format the new time manually
            const formattedHours = hours >= 10 ? hours : "0" + hours;
            const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
              }${minutes}:00`;
          } else {
          }
        } else {
          const regularshift = isUserRoleAccess?.mainshifttiming;
          const stcl = await fetchOverAllSettings();

          const [cin, cout] = stcl?.split("-");
          setUserShiftDetails(regularshift);
          updateTimeRange(regularshift, cin, cout);
          // Send approved shift endtime to the attandance's clockouttime
          const regularShiftEndTime = regularshift?.match(
            /\b\d{2}:\d{2}[APMapm]{2}\b/g
          );
          const regularEndTime = regularShiftEndTime
            ? regularShiftEndTime[1]
            : "";

          if (regularEndTime) {
            const originalTime = regularEndTime?.slice(0, -2);
            const period = regularEndTime?.slice(-2);

            const [hours, minutes] = originalTime?.split(":").map(Number);

            // Format the new time manually
            const formattedHours = hours >= 10 ? hours : "0" + hours;
            const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
              }${minutes}:00`;
          } else {
          }
        }
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [userShiftDetails, isUserRoleAccess]);

  useEffect(() => {
    // Calculate before 2 hours from the user's shift start time
    const userShiftDetailsStartTime = userShiftDetails.match(
      /\b\d{2}:\d{2}[APMapm]{2}\b/
    );
    const startTime = userShiftDetailsStartTime
      ? userShiftDetailsStartTime[0]
      : "";
    if (startTime) {
      const fetchOverAllSettings = async () => {
        try {
          let res = await axios.get(
            `${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`,
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );

          const settingsclockin =
            res?.data?.attendancecontrolcriteria[
              res?.data?.attendancecontrolcriteria?.length - 1
            ]?.clockin;
          const settingsclockoout =
            res?.data?.attendancecontrolcriteria[
              res?.data?.attendancecontrolcriteria?.length - 1
            ]?.clockout;
          return settingsclockin + "-" + settingsclockoout;
        } catch (err) {
          handleApiError(err, setShowAlert, handleClickOpenerr);
        }
      };
      const originalTime = startTime.slice(0, -2);
      const period = startTime.slice(-2);

      const [hours, minutes] = originalTime.split(":").map(Number);

      // Subtract 2 hours
      const newHours = hours - 2;

      // Format the new time manually
      const formattedHours = newHours >= 10 ? newHours : "0" + newHours;
      const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes}`;

      setUpdatedShiftDetails(`${newTime}${period}`);
    } else {
    }

    // Add 10 min to the start time
    const updatedShiftDetailsTime = userShiftDetails?.match(
      /\b\d{2}:\d{2}[APMapm]{2}\b/
    );
    const shiftTime = updatedShiftDetailsTime ? updatedShiftDetailsTime[0] : "";

    if (shiftTime) {
      const originalTime = shiftTime.slice(0, -2);
      const period = shiftTime.slice(-2);

      const [hours, minutes] = originalTime.split(":").map(Number);

      // Convert to 24-hour format
      const hours24 = period === "PM" && hours !== 12 ? hours + 12 : hours;

      // Add 10 minutes
      const newMinutes = minutes + 10;

      // Format the new time manually
      const newHours = hours24 < 10 ? "0" + hours24 : hours24;
      const newTime = `${newHours}:${newMinutes < 10 ? "0" : ""}${newMinutes}`;

      setUpdatedStartShiftDetailsMinus2Hours(`${newTime}${period}`);
    } else {
    }

    // Calculate before 4 hours from the user's shift end time
    const userShiftDetailsEndTime = userShiftDetails.match(
      /\b\d{2}:\d{2}[APMapm]{2}\b/g
    );
    const endTime = userShiftDetailsEndTime ? userShiftDetailsEndTime[1] : "";

    if (endTime) {
      const originalTime = endTime.slice(0, -2);
      const period = endTime.slice(-2);

      const [hours, minutes] = originalTime.split(":").map(Number);

      // Add 4 hours
      const newHours = hours + 4;

      // Format the new time manually
      const formattedHours = newHours >= 10 ? newHours : "0" + newHours;
      const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
        }${minutes}:00`;

      setUpdatedEndShiftDetailsAdd4Hours(`${newTime} ${period}`);
    } else {
    }
  }, [
    updatedShiftDetails,
    updatedStartShiftDetailsMinus2Hours,
    updatedEndShiftDetailsAdd4Hours,
  ]);

  const updateTimeRange = async (e, cin, cout) => {
    const [startTimes, endTimes] = e.split("-");

    // Convert start time to 24-hour format
    const convertedStartTime = await convertTo24HourFormat(startTimes);

    // Convert end time to 24-hour format
    const convertedEndTime = await convertTo24HourFormat(endTimes);

    const start = convertedStartTime;
    const end = convertedEndTime;
    // Convert start time to 24-hour format
    let [startHour, startMinute] = start?.slice(0, -2).split(":");

    startHour = parseInt(startHour, 10);

    // Convert end time to 24-hour format
    let [endHour, endMinute] = end?.slice(0, -2).split(":");
    endHour = parseInt(endHour, 10);
    // Add hours from startTime and endTime
    startHour -= cin ? Number(cin) : 0;
    endHour += cout ? Number(cout) : 0;

    // Format the new start and end times
    const newStart = `${String(startHour).padStart(
      2,
      "0"
    )}:${startMinute}${start.slice(-2)}`;

    const newEnd = `${String(endHour).padStart(2, "0")}:${endMinute}${end.slice(
      -2
    )}`;

    setCalculatedTime(`${newStart} - ${newEnd}`);
    await checkTimeRange(`${newStart} - ${newEnd}`);
  };

  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const settingsclockin =
        res?.data?.attendancecontrolcriteria[
          res?.data?.attendancecontrolcriteria?.length - 1
        ]?.clockin;
      const settingsclockoout =
        res?.data?.attendancecontrolcriteria[
          res?.data?.attendancecontrolcriteria?.length - 1
        ]?.clockout;
      return settingsclockin + "-" + settingsclockoout;
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  // Set the date to the 11th day of the current month and year

  useEffect(() => {
    fetchOverAllSettings();
  }, []);

  const checkTimeRange = (e) => {
    // Get current time
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const [startTime, endTime] = e.split(" - ");

    // Parse start time
    const [startHour, startMinute] = startTime.split(":").map(Number);

    // Parse end time
    const [endHour, endMinute] = endTime.split(":").map(Number);

    if (
      startHour < endHour ||
      (startHour === endHour && startMinute <= endMinute)
    ) {
      // Shift falls within the same day Shift
      if (
        (currentHour > startHour ||
          (currentHour === startHour && currentMinute >= startMinute)) &&
        (currentHour < endHour ||
          (currentHour === endHour && currentMinute <= endMinute))
      ) {
        // Current time is within the specified time range
        setShiftClosed("NOT CLOSED");
      } else {
        setShiftClosed("CLOSED");
      }
    }
    //Night Shift
    else {
      // Shift spans across two days
      if (
        currentHour > startHour ||
        (currentHour === startHour && currentMinute >= startMinute) ||
        currentHour < endHour ||
        (currentHour === endHour && currentMinute <= endMinute)
      ) {
        // Current time is within the specified time range
        setShiftClosed("NOT CLOSED");
      } else {
        setShiftClosed("CLOSED");
      }
    }
  };

  useEffect(() => {
    getrowData();
  }, []);

  const [singleDoc, setSingleDoc] = useState({});
  const [updateDetails, setUpDateDetails] = useState([]);

  const ids = useParams().id;

  const getrowData = async () => {
    try {
      const [res,
        // res_task, 
        res_Data] = await Promise.all([
          axios.get(`${SERVICE.SINGLE_TASKMAINTENACEFORUSER}/${ids}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }),
          // axios.get(`${SERVICE.MAINTENANCE_EXCEL_LIMITED}`, {
          //   headers: {
          //     Authorization: `Bearer ${auth.APIToken}`,
          //   },
          // }),
          axios.post(`${SERVICE.TASK_PANEL_VIEW_LIMITED}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            state: "running",
            // res?.data?.staskmaintenanceforuser?._id !== data._id &&
            username: isUserRoleAccess?.companyname
          }),
        ]);

      let answeercheck = res_Data?.data?.taskmaintenanceforuser?.some(
        (data) =>
          // data.state === "running" &&
          res?.data?.staskmaintenanceforuser?._id !== data._id
        // data.username === isUserRoleAccess?.companyname
      );

      // let schedule = res_task?.data?.maintenances?.find(
      //   (data) =>
      //     data._id === answeercheck?.orginalid &&
      //     data.assetmaterial === answeercheck?.assetmaterial &&
      //     data.frequency === answeercheck?.frequency
      // );

      setCheckTimerStart(answeercheck);
      setQueueCheck(true);
      setSingleDoc(res?.data?.staskmaintenanceforuser);
      setUpDateDetails(res?.data?.staskmaintenanceforuser?.tableFormat);
    } catch (err) {
      console.log(err, "eroroe")
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Combine all arrays into a single array
  let combinedArray = allUploadedFiles?.concat(
    refImage,
    refImageDrag,
    capturedImages
  );
  let uniqueValues = {};

  //serial no for listing items
  const addSerialNumber = () => {
    const itemsWithSerialNumber = raiseTicketList?.map((item, index) => ({
      serialNumber: index + 1,
      id: item._id,
      assetmaterial: item.assetmaterial,
      frequency: item.frequency,
      schedule: item.schedule,
      duration: item.duration,
      type: item.type,
      required: item?.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
      breakup: item?.breakup,
      description: convertToNumberedList(item.description),
    }));

    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [raiseTicketList]);

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

  // Function to remove HTML tags and convert to numbered list
  const convertToNumberedList = (htmlContent) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    const listItems = Array.from(tempElement.querySelectorAll("li"));
    listItems.forEach((li, index) => {
      li.innerHTML = `\u2022 ${li.innerHTML}\n`;
    });

    return tempElement.innerText;
  };

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item.id,
      serialNumber: item.serialNumber,
      assetmaterial: item.assetmaterial,
      schedule: item.schedule,
      duration: item.duration,
      frequency: item.frequency,
      required: item?.required,
      breakup: item?.breakup,
      description: item.description,
    };
  });

  const columns = [
    { title: "S.NO", field: "serialNumber" },
    { title: "Frequency", field: "frequency" },
    { title: "Schedule", field: "schedule" },
    { title: "Task", field: "category" },
    { title: "Sub Task", field: "subcategory" },
    { title: "Duration", field: "duration" },
    { title: "Required", field: "required" },
    { title: "Break Up", field: "breakup" },
  ];

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

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );
  const delAccountcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.RAISETICKET_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
      setPage(1);

      handleCloseModcheckbox();
      setSelectedRows([]);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const now = new Date();
  const [runningIndex, setRunningIndex] = useState(null);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so we add 1.
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      // Convert hours to 12-hour format
      hours = hours % 12 || 12;

      let formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;

      setTimestamp(formattedDateTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleUpdateTodoEditrunning = async () => {
    try {
      let today = new Date();

      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      let formattedDate = dd + "/" + mm + "/" + yyyy;
      let oldstarttime = singleDoc?.startTime;
      let oldschedule = singleDoc?.startTimeSchedule;
      const newTodosedit = [
        ...oldstarttime,
        formattedDate + " " + now.toLocaleTimeString(),
      ];
      const newTodoseditSchedule = [...oldschedule, today];
      const split = calculatedTime?.split("-");

      await sendEditRequest(newTodosedit, "running", newTodoseditSchedule);
      await addFutureTimeToCurrentTime(split[1]);
      setRunningIndex(ids);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleUpdateTodoEditpaused = async (idval) => {
    try {
      let today = new Date();

      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      let formattedDate = dd + "/" + mm + "/" + yyyy;

      let oldendtime = singleDoc?.endTime;
      let oldendtimeschedule = singleDoc?.endTimeSchedule;
      const newTodosedit = [
        ...oldendtime,
        formattedDate + " " + now.toLocaleTimeString(),
      ];
      const newTodoseditschedule = [...oldendtimeschedule, today];
      await sendEditpausRequest(newTodosedit, "paused", newTodoseditschedule);
      setRunningIndex(null);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [dateArray, setDateArray] = useState([]);
  const [timeArray, setTimeArray] = useState([]);
  const [tableFormat, setTableFormat] = useState([]);

  const FetchTime = () => {
    const result = [];

    if (singleDoc?.startTimeSchedule?.length > 0) {
      const initialTime = singleDoc?.startTimeSchedule[0];

      const formattedDate = new Date(initialTime);
      const hours = formattedDate.getHours();
      const minutes = formattedDate.getMinutes();
      const seconds = formattedDate.getSeconds();
      // 01,12,23,34,45
      const period = hours >= 12 ? "PM" : "AM";
      const formattedTimeSchedule = `${hours}:${minutes}`;

      const datesArray = [];
      const datesTimeArray = [];

      for (let i = 0; i <= Number(singleDoc?.breakupcount); i++) {
        const newDate = new Date(
          formattedDate?.getTime() + i * Number(singleDoc?.breakup) * 60 * 1000
        ); // Adding 40 minutes
        const hours = newDate.getHours();
        const minutes = newDate.getMinutes();
        const seconds = newDate.getSeconds();
        // Determine whether it's AM or PM

        // 01,12,23,34,45
        const period = hours >= 12 ? "PM" : "AM";
        // Adjust hours for 12-hour format
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

        const formattedTime = `${hours}:${minutes}:${seconds} ${period}`;
        datesArray.push(String(newDate));
        datesTimeArray.push(formattedTime);
      }

      function generateTimeRanges(timeArray) {
        const result = [];

        for (let i = 0; i < timeArray?.length - 1; i++) {
          const startTime = timeArray[i];
          const endTime = timeArray[i + 1];
          const startDate = datesArray[i];
          const endDate = datesArray[i + 1];
          const sno = i + 1;
          const task = singleDoc?.assetmaterial;
          const totalduration = singleDoc?.duration;
          const breakupcount = i + 1;
          const reason = "";
          result.push({
            sno,
            task,
            totalduration,
            breakupcount,
            startDate,
            startTime,
            endDate,
            endTime,
            reason,
          });
        }

        return result;
      }
      const timeRanges = generateTimeRanges(datesTimeArray);
      setTableFormat(timeRanges);
      setTimeArray(datesTimeArray);
      setDateArray(datesArray);
    }
  };

  useEffect(() => {
    FetchTime();
  }, [singleDoc]);

  const handleOnChanegFieldsCheckDate = (e, indexs) => {
    const FilteredData =
      updateDetails?.length > 0 ? updateDetails : tableFormat;
    const updatedTodos = [...FilteredData];
    updatedTodos[indexs].reason = e;
    updateDetails?.length > 0
      ? setUpDateDetails(updatedTodos)
      : setTableFormat(updatedTodos);
  };

  const handleOnChanegFieldsImageCheck = (e, indexs, index, id) => {
    const FilteredData =
      updateDetails?.length > 0 ? updateDetails : tableFormat;
    const updatedTodos = [...FilteredData];
    const files = e.target.files;
    // let newSelectedFiles = [...refImage];
    let ans = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      const reader = new FileReader();
      reader.onload = () => {
        ans.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        updatedTodos[indexs].files = ans;
        updateDetails?.length > 0
          ? setUpDateDetails(updatedTodos)
          : setTableFormat(updatedTodos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteFileCheck = (indexs) => {
    const FilteredData =
      updateDetails?.length > 0 ? updateDetails : tableFormat;
    const updatedTodos = [...FilteredData];
    updatedTodos[indexs].files = [];
    updateDetails?.length > 0
      ? setUpDateDetails(updatedTodos)
      : setTableFormat(updatedTodos);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  const getDownloadFile = async (file) => {
    //Rendering File
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleUpdatesubmitTable = async (indexs, files) => {
    const FilteredData =
      updateDetails?.length > 0 ? updateDetails : tableFormat;
    const updatedTodos = [...FilteredData];
    updatedTodos[indexs].status = "Added";
    updatedTodos[indexs].files = files;
    let res = await axios.put(
      `${SERVICE.SINGLE_TASKMAINTENACEFORUSER}/${ids}`,
      {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        tableFormat: updatedTodos,
        files: files,
      }
    );
    setAllUploadedFiles([]);
    setRefImage([]);
    setRefImageDrag([]);
    setCapturedImages([]);
  };

  const sendEditRequest = async (newTodosedit, running, date) => {
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_TASKMAINTENACEFORUSER}/${ids}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          state: String(running),
          startTime: newTodosedit,
          startTimeSchedule: date,
          taskstatus: "OnProgress",
        }
      );
      await getrowData();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const sendEditpausRequest = async (newTodosedit, paused, date) => {
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_TASKMAINTENACEFORUSER}/${ids}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          state: String(paused),
          endTime: newTodosedit,
          endTimeSchedule: date,
          taskstatus: "Paused",
        }
      );

      await getrowData();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const calculateTotalTimes = () => {
    const matchedItem = singleDoc;
    const startTimes = matchedItem && matchedItem?.startTime;
    const endTimes = matchedItem && matchedItem?.endTime;

    let totalMilliseconds = 0;

    for (let i = 0; i < startTimes?.length; i++) {
      // Rearrange the date format to "MM/DD/YYYY hh:mm:ss A"
      const startTime = new Date(
        startTimes[i]?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
      );
      const endTime = new Date(
        endTimes[i]?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
      );

      const timeDifference = endTime - startTime;
      totalMilliseconds += timeDifference;
    }

    // Calculate the total time difference in seconds, minutes, hours, and days
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours = totalHours % 24;

    // Convert total days to hours and add it to "24:00:04"
    const totalHoursWithDays = totalDays * 24 + hours;
    return `${String(totalHoursWithDays).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const lastStartTime =
    singleDoc?.startTime?.length > 0 &&
    singleDoc?.startTime[singleDoc?.startTime?.length - 1];
  // Parse the first time string into a Date object
  const time1 =
    lastStartTime &&
    new Date(lastStartTime?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
  const timestamprun = new Date(
    timestamp?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
  );

  const timeDifferencecurrent = timestamprun - time1;
  const totalSecondsrun = Math.floor(timeDifferencecurrent / 1000);
  const totalMinutesrun = Math.floor(totalSecondsrun / 60);
  const totalHoursrun = Math.floor(totalMinutesrun / 60);
  const totalDaysrun = Math.floor(totalHoursrun / 24);

  const secondsrun = totalSecondsrun % 60;
  const minutesrun = totalMinutesrun % 60;
  const hoursrun = totalHoursrun % 24;

  // Convert total days to hours and add it to "24:00:04"
  const totalHoursWithDaysrun = totalDaysrun * 24 + hoursrun;
  let durationTimerun = `${String(totalHoursWithDaysrun).padStart(
    2,
    "0"
  )}:${String(minutesrun).padStart(2, "0")}:${String(secondsrun).padStart(
    2,
    "0"
  )}`;

  const FilteredData = updateDetails?.length > 0 ? updateDetails : tableFormat;

  const [shiftEndDate, setShiftEndDate] = useState([]);
  function addFutureTimeToCurrentTime(futureTime) {
    // Parse the future time string into hours and minutes
    const [futureHours, futureMinutes] = futureTime.split(":").map(Number);

    // Get the current time
    const currentTime = new Date();

    // Get the current date
    const currentDate = currentTime.getDate();

    // Get the current hours and minutes
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    // Calculate the time difference
    let timeDifferenceHours = futureHours - currentHours;
    let timeDifferenceMinutes = futureMinutes - currentMinutes;

    // Adjust for negative time difference
    if (timeDifferenceMinutes < 0) {
      timeDifferenceHours--;
      timeDifferenceMinutes += 60;
    }

    // Check if the future time falls on the next day
    if (timeDifferenceHours < 0) {
      // Add 1 day to the current date
      currentTime.setDate(currentDate + 1);
      timeDifferenceHours += 24;
    }

    // Create a new Date object by adding the time difference to the current time
    const newDate = new Date();
    newDate.setHours(newDate.getHours() + timeDifferenceHours);
    newDate.setMinutes(newDate.getMinutes() + timeDifferenceMinutes);

    setShiftEndDate(newDate);
    return newDate;
  }

  const HandleSubmit = async () => {
    if (filterValue === "Please Select Status") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please select Task Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (userStatusDes === "" || userStatusDes === "<p><br></p>") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Description For Task Status"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (singleDoc?.startTimeSchedule?.length < 1) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please On Timer to work on the Task"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      await getrowData();
      handleClickOpen();
    }
  };
  function getTextAfterFirstDash(str1, str2) {
    // Use String.prototype.replace to remove the first occurrence of str1 from str2
    const newStr = str2.replace(new RegExp(`^${str1}[-]?`), "");
    return newStr;
  }
  const handleOnCloseTicket = async () => {
    try {
      await handleCompleteothers(filterValue, filterValueTicket);

      const tableReason = singleDoc?.tableFormat?.map((data) => data?.reason);
      const split = calculatedTime?.split("-");
      const shiftEndTime = addFutureTimeToCurrentTime(split[1]);
      let userCheck = await axios.post(SERVICE.ALL_TASKMAINTENACEFORUSER_USERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        username: isUserRoleAccess?.companyname
      });
      let userStatus = userCheck?.data?.taskmaintenanceforuser
      let scheduledDates = userStatus?.scheduledDates;
      let today = new Date();

      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var yyyy = today.getFullYear();
      let formattedDate = dd + "/" + mm + "/" + yyyy;

      let oldendtime = singleDoc?.endTime;
      let oldendtimeschedule = singleDoc?.endTimeSchedule;
      const newTodosedit = [
        ...oldendtime,
        formattedDate + " " + now.toLocaleTimeString(),
      ];
      const newTodoseditschedule = [...oldendtimeschedule, today];

      if (
        singleDoc?.required?.length > 0 &&
        (tableReason?.length < 1 ||
          singleDoc?.tableFormat?.some(
            (data) => data?.reason === "" || data?.reason === undefined
          ))
      ) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {"Add the Progress Check Details"}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        let res = await axios.put(
          `${SERVICE.SINGLE_TASKMAINTENACEFORUSER}/${ids}`,
          {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            scheduledDates: [...scheduledDates, shiftEndTime],
            taskstatus: filterValue,
            ticketstatus: singleDoc?.ticketid ? filterValueTicket : "",
            userdescription: userStatusDes,
            state: "paused",
            endTime: newTodosedit,
            endTimeSchedule: newTodoseditschedule,
            completedbyuser: singleDoc.username,
          }
        );
        if (singleDoc?.ticketid) {
          const resultss = await getTextAfterFirstDash(singleDoc?.assetmaterialname, singleDoc?.assetmaterial);
          // console.log(resultss, "asdfhabdjkasbd");
          let finalMaterialStatus = (filterValueTicket === "Completed (Resolved)" || filterValueTicket === "Finished By Others (Resolved)") ? "In Working"
            : (filterValueTicket === "Completed (Damage)" || filterValueTicket === "Finished By Others (Damage)") ? "Damage" : "In Working"
          let res = await axios.put(`${SERVICE.ASSETDETAIL_SINGLE_REPAIR}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            materialcode: String(resultss),
            status: finalMaterialStatus,
          });



          let respos = await axios.put(`${SERVICE.RAISETICKET_SINGLE}/${singleDoc?.ticketid}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            raiseself: "Closed",
            materialstatus: finalMaterialStatus,
            ticketclosed: isUserRoleAccess.companyname,
            ticketclosedbytask: true,
            resolvedate: moment(new Date()).format("DD-MM-YYYY hh:mm:ss a"),
          });
        }
        backPage("/asset/taskmaintenaceforuser");
        handleCloseDelete();
      }
    } catch (err) {
      console.log(err, "erronclsoe")
    }
  };

  const handleCompleteothers = async (value, ticketstatus) => {
    if (value === "Completed") {
      let res = await axios.post(`${SERVICE.MAINTENANCE_FOR_USER_ASSIGNID}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        assignId: String(singleDoc?.assignId),
        username: singleDoc?.username,
      });

      if (res?.data?.taskforuser?.length > 0) {
        let ans = res?.data?.taskforuser?.map((data) => {
          axios.put(`${SERVICE.SINGLE_TASKMAINTENACEFORUSER}/${data._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            taskstatus: value,
            ticketstatus: singleDoc?.ticketid ? ticketstatus : "",
            state: "paused",
            completedbyuser: singleDoc.username,
          });
        });
      }
    }
  };

  return (
    <Box>
      <Headtitle title={"User Maintenance Task Panel VIEW"} />
      {/* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>
        User Maintenance Task Panel View
      </Typography>

      {!queueCheck ? (
        <Box sx={userStyle.dialogbox}>
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
          <>
            <Box sx={userStyle.dialogbox}>
              {/* ******************************************************EXPORT Buttons****************************************************** */}
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.SubHeaderText}>
                    User Maintenance Task Panel View
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ padding: "12px" }}>
                <div></div>
              </Box>
              <br></br>
              {!checkTimerStart ? (
                <Grid container spacing={2} justify="flex-end">
                  <Grid md={10} sm={12} xs={12}></Grid>
                  <Grid md={1} sm={12} xs={12}>
                    <Typography variant="subtitle2">
                      {singleDoc?.state === "running"
                        ? durationTimerun
                        : singleDoc?.state === ""
                          ? "00:00:00"
                          : calculateTotalTimes()}
                    </Typography>
                  </Grid>

                  <Grid
                    md={1}
                    sm={12}
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    {singleDoc?.state === "running" ? (
                      <Button
                        style={{
                          textTransform: "capitalize",
                          minWidth: "30px",
                          padding: "0px 10px",
                          background: "#f5f5f5",
                          border: "1px solid",
                          color: "#0000008f",
                        }}
                        onClick={() => {
                          handleUpdateTodoEditpaused();
                        }}
                      >
                        Pause
                      </Button>
                    ) : (
                      <Button
                        style={{
                          textTransform: "capitalize",
                          minWidth: "30px",
                          padding: "0px 10px",
                          background: "#f5f5f5",
                          border:
                            (runningIndex !== null &&
                              runningIndex !== singleDoc?._id) ||
                              singleDoc?.state === "stopped"
                              ? "none"
                              : "1px solid",
                          color: "#0000008f",
                        }}
                        disabled={
                          (runningIndex !== null &&
                            runningIndex !== singleDoc?._id) ||
                          singleDoc?.state === "stopped"
                        }
                        onClick={() => {
                          handleUpdateTodoEditrunning();
                        }}
                      >
                        Start
                      </Button>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2} justify="flex-end">
                  <Grid md={9} sm={12} xs={12}></Grid>
                  <Grid md={3} sm={12} xs={12}>
                    <Typography sx={{ color: "red" }}>
                      Timer is Already Running in Previous Task
                    </Typography>
                  </Grid>
                </Grid>
              )}
              <br></br>
              <Box sx={{ padding: "20px 20px" }}>
                <>
                  <br /> <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Task</Typography>
                        <Typography>{singleDoc?.assetmaterial}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> Frequency</Typography>
                        <Typography>{singleDoc?.frequency}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Schedule</Typography>
                        <Typography>{singleDoc?.schedule}</Typography>
                      </FormControl>
                    </Grid>
                    <br /> <br />
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> Duration</Typography>
                        <Typography>{singleDoc?.duration}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> Breakup Count</Typography>
                        <Typography>{singleDoc?.breakupcount}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6"> Breakup</Typography>
                        <Typography>{`${singleDoc?.breakup} mins`}</Typography>
                      </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">Required</Typography>
                        <Typography>
                          {singleDoc?.required?.map(
                            (t, i) => `${i + 1 + ". "}` + t
                          )}
                        </Typography>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br /> <br />
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      {singleDoc?.frequency === "Daily" && (
                        <>
                          <Typography variant="h6">Time</Typography>
                          <Typography>
                            {singleDoc?.timetodo?.map(
                              (t, i) =>
                                `${i + 1 + ". "}` +
                                `${t?.hour}:${t?.min} ${t?.timetype}`
                            )}
                          </Typography>
                        </>
                      )}
                      {(singleDoc?.frequency === "Monthly" ||
                        singleDoc?.frequency === "Date Wise") && (
                          <>
                            <Typography variant="h6">Days</Typography>
                            <Typography>
                              {singleDoc?.weekdays?.map(
                                (t, i) => `${i + 1 + ". "}` + t
                              )}
                            </Typography>
                          </>
                        )}
                      {(singleDoc?.frequency === "Weekly" ||
                        singleDoc?.frequency === "Day Wise") && (
                          <>
                            <Typography variant="h6">Days</Typography>
                            <Typography>
                              {singleDoc?.weekdays?.map(
                                (t, i) => `${i + 1 + ". "}` + t
                              )}
                            </Typography>
                          </>
                        )}
                      {singleDoc?.frequency === "Annually" && (
                        <>
                          <Typography variant="h6">Annual</Typography>
                          <Typography>{`${singleDoc?.annumonth} month ${singleDoc?.annuday} days`}</Typography>
                        </>
                      )}
                    </Grid>
                    <Grid item md={9} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">
                          Task Description{" "}
                        </Typography>
                        <ReactQuill
                          readOnly
                          style={{ maxHeight: "180px", height: "150px" }}
                          value={singleDoc?.description}
                          modules={{
                            toolbar: [
                              [
                                { header: "1" },
                                { header: "2" },
                                { font: [] },
                              ],
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
                      <br /> <br /> <br />
                      <br /> <br /> <br />
                    </Grid>
                    <Grid container spacing={2}></Grid>
                  </Grid>
                  <br /> <br />
                  <Grid container spacing={2}>
                    {FilteredData?.length > 0 && (
                      <>
                        <Grid item md={12} xs={12} sm={12}>
                          <Typography variant="h6">Progress Check</Typography>
                          <br></br>

                          <TableContainer>
                            <Table
                              aria-label="simple table"
                              id="excel"
                              sx={{ overflow: "auto" }}
                            >
                              <TableHead sx={{ fontWeight: "600" }}>
                                <StyledTableRow>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Sno"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Task"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Total Duration"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Breakup Count"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Start Date"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Start Time"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"End Date"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"End Time"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Upload Documents"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Remarks"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={userStyle.tableheadstyle}>
                                      <Box>{"Status"}</Box>
                                    </Box>
                                  </StyledTableCell>
                                </StyledTableRow>
                              </TableHead>
                              <TableBody align="left">
                                {FilteredData?.length > 0
                                  ? FilteredData?.map((item, indexs) => {
                                    return (
                                      <StyledTableRow id={indexs}>
                                        <StyledTableCell>
                                          {item?.sno}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {item?.task}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {item?.totalduration}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {item?.breakupcount}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {moment(item.startDate).format(
                                            "DD-MM-YYYY"
                                          )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {item?.startTime}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {moment(item.endDate).format(
                                            "DD-MM-YYYY"
                                          )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {item?.endTime}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {item?.status === undefined ? (
                                            <>
                                              {item?.files === undefined ||
                                                item?.files?.length < 1 ? (
                                                <>
                                                  <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                      handleClickUploadPopupOpen();
                                                      setUploadImageIndex(
                                                        indexs
                                                      );
                                                    }}
                                                  >
                                                    Upload
                                                  </Button>
                                                </>
                                              ) : (
                                                <Button
                                                  sx={{
                                                    padding: "14px 14px",
                                                    minWidth:
                                                      "40px !important",
                                                    borderRadius:
                                                      "50% !important",
                                                    ":hover": {
                                                      backgroundColor:
                                                        "#80808036", // theme.palette.primary.main
                                                    },
                                                  }}
                                                  onClick={() =>
                                                    handleDeleteFileCheck(
                                                      indexs
                                                    )
                                                  }
                                                >
                                                  <FaTrash
                                                    style={{
                                                      fontSize: "medium",
                                                      color: "#a73131",
                                                      fontSize: "14px",
                                                    }}
                                                  />
                                                </Button>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {item?.files?.map(
                                                (data, indexs) => {
                                                  return (
                                                    <>
                                                      <Typography>
                                                        {data && data?.name}
                                                      </Typography>
                                                      <Button
                                                        onClick={() =>
                                                          getDownloadFile(
                                                            data
                                                          )
                                                        }
                                                      >
                                                        View
                                                      </Button>
                                                    </>
                                                  );
                                                }
                                              )}
                                            </>
                                          )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {
                                            <OutlinedInput
                                              id="component-outlined"
                                              type="text"
                                              disabled={
                                                item?.status === "Added"
                                                  ? true
                                                  : false
                                              }
                                              value={item?.reason}
                                              onChange={(e) =>
                                                handleOnChanegFieldsCheckDate(
                                                  e.target.value,
                                                  indexs
                                                )
                                              }
                                            />
                                          }
                                        </StyledTableCell>
                                        <StyledTableCell>
                                          {item?.reason &&
                                            !item?.status && (
                                              <Button
                                                variant="contained"
                                                onClick={() =>
                                                  handleUpdatesubmitTable(
                                                    indexs,
                                                    item?.files
                                                  )
                                                }
                                              >
                                                Add
                                              </Button>
                                            )}
                                        </StyledTableCell>
                                      </StyledTableRow>
                                    );
                                  })
                                  : ""}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <br></br>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <br /> <br /> <br />
                  <Grid container spacing={2}>
                    {singleDoc?.documentfiles?.length > 0 && (
                      <Grid item md={9} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">Document Files</Typography>
                          {singleDoc?.documentfiles?.map((file, index) => (
                            <Grid container key={index}>
                              <Grid item md={1} sm={2} xs={2}>
                                <Box
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {file?.type?.includes("image/") ? (
                                    <img
                                      src={file?.preview}
                                      alt={file?.name}
                                      height={50}
                                      style={{
                                        maxWidth: "-webkit-fill-available",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      className={classes.preview}
                                      src={getFileIcon(file.name)}
                                      height="10"
                                      alt="file icon"
                                    />
                                  )}
                                </Box>
                              </Grid>
                              <Grid
                                item
                                md={4}
                                sm={7}
                                xs={7}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {" "}
                                  {file.name}{" "}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={1} xs={1}>
                                <Grid sx={{ display: "flex" }}>
                                  <Button
                                    sx={{
                                      padding: "14px 14px",
                                      minWidth: "40px !important",
                                      borderRadius: "50% !important",
                                      ":hover": {
                                        backgroundColor: "#80808036", // theme.palette.primary.main
                                      },
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  >
                                    <VisibilityOutlinedIcon
                                      style={{
                                        fontsize: "12px",
                                        color: "#357AE8",
                                      }}
                                    />
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          ))}
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12} sm={12}>
                      <FormControl fullWidth size="small">
                        <Typography variant="h6">
                          Task Status <b style={{ color: "red" }}>*</b>{" "}
                        </Typography>
                        <Selects
                          options={singleDoc?.ticketid ? [
                            { label: "Completed (Resolved)", value: "Completed (Resolved)", originalvalue: "Completed" },
                            { label: "Completed (Damage)", value: "Completed (Damage)", originalvalue: "Completed" },
                            { label: "Finished By Others (Resolved)", value: "Finished By Others (Resolved)", originalvalue: "Finished By Others" },
                            { label: "Finished By Others (Damage)", value: "Finished By Others (Damage)", originalvalue: "Finished By Others" },

                          ] : [
                            { label: "Completed", value: "Completed" },
                            { label: "Pending", value: "Pending" },
                            { label: "Postponed", value: "Postponed" },
                            {
                              label: "Finished By Others",
                              value: "Finished By Others",
                            },
                            {
                              label: "Not Applicable to Me",
                              value: "Not Applicable to Me",
                            },
                          ]}
                          styles={colourStyles}
                          value={{ label: singleDoc?.ticketid ? filterValueTicket : filterValue, value: singleDoc?.ticketid ? filterValueTicket : filterValue }}
                          onChange={(e) => {
                            setFilterValue(singleDoc?.ticketid ? e.originalvalue : e.value);
                            setFilterValueTicket(singleDoc?.ticketid ? e.value : "");
                          }}
                        />{" "}
                      </FormControl>
                    </Grid>
                    <br /> <br /> <br />
                    <br /> <br /> <br />
                    {filterValue !== "Please Select Status" && (
                      <Grid item md={9} xs={12} sm={12}>
                        <FormControl fullWidth size="small">
                          <Typography variant="h6">
                            User Status Description{" "}
                            <b style={{ color: "red" }}>*</b>{" "}
                          </Typography>
                          <ReactQuill
                            style={{ maxHeight: "180px", height: "150px" }}
                            value={userStatusDes}
                            onChange={(e) => {
                              setUserStatusDes(e);
                            }}
                            modules={{
                              toolbar: [
                                [
                                  { header: "1" },
                                  { header: "2" },
                                  { font: [] },
                                ],
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
                        <br /> <br /> <br />
                        <br /> <br /> <br />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item md={2} xs={12} sm={6}>
                      <Button
                        variant="contained"
                        sx={buttonStyles.buttonsubmit}
                        onClick={HandleSubmit}
                      >
                        Close Task
                      </Button>
                    </Grid>
                    <Grid item md={2} xs={12} sm={6}>
                      <Button
                        variant="contained"
                        sx={buttonStyles.buttonsubmit}
                        onClick={handleCloseViewpop}
                      >
                        Back
                      </Button>
                    </Grid>
                  </Grid>
                </>
              </Box>
            </Box>
          </>
        </>
      )}

      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
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
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
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
              onClick={(e) => delAccountcheckbox(e)}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
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

      {/* UPLOAD IMAGE DIALOG */}
      <Dialog
        open={uploadPopupOpen}
        onClose={handleUploadPopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                Max File size: 5MB
              </Typography>
              <div onDragOver={handleDragOver} onDrop={handleDrop}>
                {previewURL && refImageDrag.length > 0 ? (
                  <>
                    {refImageDrag.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button
                          onClick={() => handleRemoveFile(index)}
                          style={{ marginTop: "0px", color: "red" }}
                        >
                          X
                        </Button>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon /> Drag and drop
                    </div>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      accept="image/*"
                      hidden
                      onChange={handleInputChange}
                    />
                  </Button>
                  &ensp;
                  <Button
                    variant="contained"
                    onClick={showWebcam}
                    sx={userStyle.uploadbtn}
                  >
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true &&
                capturedImages.map((image, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={12}>
                      <Box
                        style={{
                          isplay: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "37px",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          height={50}
                          style={{ maxWidth: "-webkit-fill-available" }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {" "}
                        {image.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={12}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(image)}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "12px",
                              color: "#357AE8",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036",
                            },
                          }}
                          onClick={() => removeCapturedImage(index)}
                        >
                          <FaTrash
                            style={{
                              color: "#a73131",
                              fontSize: "12px",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              {refImage.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIcon(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpen}
        onClose={webcamClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={name}
            getImg={getImg}
            setGetImg={setGetImg}
            valNum={valNum}
            setValNum={setValNum}
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            setRefImage={setRefImage}
            setRefImageDrag={setRefImageDrag}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStore}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamClose}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isimgviewbill}
        onClose={handlecloseImgcodeviewbill}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6">Images</Typography>
          {getimgbillcode.map((imagefilebill, index) => (
            <Grid container key={index}>
              <Grid item md={6} sm={10} xs={10}>
                <img
                  src={imagefilebill.preview}
                  style={{
                    maxWidth: "70px",
                    maxHeight: "70px",
                    marginTop: "10px",
                  }}
                />
              </Grid>
              <Grid
                item
                md={4}
                sm={10}
                xs={10}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography>{imagefilebill.name}</Typography>
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <Button
                  sx={{
                    padding: "14px 14px",
                    minWidth: "40px !important",
                    borderRadius: "50% !important",
                    ":hover": {
                      backgroundColor: "#80808036", // theme.palette.primary.main
                    },
                  }}
                  onClick={() => renderFilePreview(imagefilebill)}
                >
                  <VisibilityOutlinedIcon
                    style={{
                      fontsize: "12px",
                      color: "#357AE8",
                      marginTop: "35px !important",
                    }}
                  />
                </Button>
              </Grid>
            </Grid>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlecloseImgcodeviewbill} sx={userStyle.btncancel}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDelete}
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
            Are you sure want to close the task?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={(e) => handleOnCloseTicket()}
            autoFocus
            variant="contained"
            color="error"
          >
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
      <br />
      <br />
    </Box>
  );
}

export default TaskMaintenanceUserPanelView;