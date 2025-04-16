import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, DialogTitle, IconButton, ListItem, List, CheckboxHeader, Checkbox, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { colourStyles, userStyle } from "../../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { BASE_URL } from "../../../services/Authservice";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { handleApiError } from "../../../components/Errorhandling";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import { htmlToText } from "html-to-text"; // Import htmlToText specifically
import { makeStyles } from "@material-ui/core";
import pdfIcon from "../../../components/Assets/pdf-icon.png";
import wordIcon from "../../../components/Assets/word-icon.png";
import excelIcon from "../../../components/Assets/excel-icon.png";
import csvIcon from "../../../components/Assets/CSV.png";
import fileIcon from "../../../components/Assets/file-icons.png";
import { FaTrash } from "react-icons/fa";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useParams } from "react-router-dom";
import Webcamimage from "../webcamimagetaskview";


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


function TrainingUserPanelView() {
    const classes = useStyles();

    const [raiseTicketList, setRaiseTicketList] = useState([]);
    const [filterValue, setFilterValue] = useState("Please Select Status");
    const [allUploadedFiles, setAllUploadedFiles] = useState([]);
    const [checkTimerStart, setCheckTimerStart] = useState(false);
    const [onlineTest, setOnlineTest] = useState("true")
    const [onlineTestDate, setOnlineTestDate] = useState("")
    const [onlineTestTime, setOnlineTestTime] = useState("")

    const [userStatusDes, setUserStatusDes] = useState("");
    const [openPageList, setOpenPageList] = useState("");
    const [closedPageList, setClosedPageList] = useState("");
    const [statusMaster, setStatusMaster] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
    //Datatable
    const [queueCheck, setQueueCheck] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;


    const [queueData, setQueueData] = useState([]);
    const [items, setItems] = useState([]);
    const [sorting, setSorting] = useState({ column: "", direction: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [taskgettingStatus, setTaskGettingStatus] = useState("");
    const [startTime, setStartTime] = useState();
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
    const period = currentHour >= 12 ? 'PM' : 'AM';
    const [weekOffShow, setWeekOffShow] = useState(true);
    const [holidayShow, setHolidayShow] = useState(true);
    const currDate = new Date();
    const currDay = currDate.getDay();
    const [shiftMode, setShiftMode] = useState("Main Shift")
    const [checkShiftTiming, setCheckShiftTiming] = useState("");
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
        const FilteredData = updateDetails?.length > 0 ? updateDetails : tableFormat;
        const updatedTodos = [...FilteredData];
        updatedTodos[uploadImageIndex].files = combinedArray;
        updateDetails?.length > 0 ? setUpDateDetails(updatedTodos) : setTableFormat(updatedTodos);
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













    const navigate = useNavigate();

    const buttonStyle = {
        color: "black",
        "&:hover": {
            backgroundColor: "transparent",
        },
    };




    const [getid, setgetid] = useState();

    const fetchIP = async () => {
        try {
            const response = await axios.get("https://api.ipify.org?format=json");
            setIP(response?.data?.ip);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const formatDate = (inputDate) => {
        if (!inputDate) {
            return "";
        }
        // Assuming inputDate is in the format "dd-mm-yyyy"
        const [day, month, year] = inputDate?.split("/");

        // // Use padStart to add leading zeros
        const formattedDay = String(day).padStart(2, "0");
        const formattedMonth = String(month).padStart(2, "0");

        return `${formattedDay}/${formattedMonth}/${year}`;
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
    // const currentSeconds = checkCurrentDate.getSeconds();

    // Determine whether it's AM or PM
    const currentperiod = currentHours >= 12 ? "PM" : "AM";

    // Format the current time manually
    const formattedHours = currentHours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes =
        currentMinutes >= 10 ? currentMinutes : "0" + currentMinutes;
    // const formattedSeconds = currentSeconds >= 10 ? currentSeconds : '0' + currentSeconds;
    const currentTime = `${formattedHours}:${formattedMinutes}${currentperiod}`;

    // const [weekOffShow, setWeekOffShow] = useState(true);
    // const [holidayShow, setHolidayShow] = useState(true);

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
            const [res_status, res_shift] = await Promise.all([
                axios.get(SERVICE.TODAY_HOLIDAY, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.post(SERVICE.GETTODAYSHIFT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    todayshifttiming: isUserRoleAccess?.mainshifttiming
                }),
            ])

            const holidayDate = res_status?.data?.holiday.filter((data, index) => {
                return (
                    data.company.includes(isUserRoleAccess.company) &&
                    data.applicablefor.includes(isUserRoleAccess.branch) &&
                    data.unit.includes(isUserRoleAccess.unit) &&
                    data.team.includes(isUserRoleAccess.team)
                );
            });


            const mainShiftTiming = isUserRoleAccess?.mainshifttiming?.split('-');
            const secondShiftTiming = isUserRoleAccess?.issecondshift ? isUserRoleAccess?.secondshifttiming?.split('-') : "";
            const secondShiftStart = isUserRoleAccess?.issecondshift ? secondShiftTiming[0]?.split(':') : "";
            const secondShiftEnd = isUserRoleAccess?.issecondshift ? secondShiftTiming[1].split(':') : "";
            const secondShiftStartHour = isUserRoleAccess?.issecondshift ? parseInt(await convertTo24HourFormat(secondShiftTiming[0]), 10) : "";
            const secondShiftStartMinute = isUserRoleAccess?.issecondshift ? parseInt(secondShiftStart[1]?.slice(0, 2), 10) : "";
            const secondShiftStartPeriod = isUserRoleAccess?.issecondshift ? secondShiftStart[1]?.slice(2) : "";

            const secondShiftEndHour = isUserRoleAccess?.issecondshift ? parseInt(await convertTo24HourFormat(secondShiftTiming[1]), 10) : "";
            const secondShiftEndMinute = isUserRoleAccess?.issecondshift ? parseInt(secondShiftEnd[1]?.slice(0, 2), 10) : "";
            const secondShiftEndPeriod = isUserRoleAccess?.issecondshift ? secondShiftEnd[1]?.slice(2) : "";

            const isInSecondShift =
                ((currentHour > secondShiftStartHour || (currentHour === secondShiftStartHour && currentMinute >= secondShiftStartMinute)) &&
                    (currentHour < secondShiftEndHour || (currentHour === secondShiftEndHour && currentMinute <= secondShiftEndMinute))) &&
                period === secondShiftStartPeriod;

            const isNtgInSecondShift =
                ((currentHour > secondShiftStartHour || (currentHour === secondShiftStartHour && currentMinute >= secondShiftStartMinute))) &&
                period === secondShiftStartPeriod;


            if (holidayDate?.some((item) => moment(item.date).format("DD-MM-YYYY") == moment(currDate).format("DD-MM-YYYY"))) {
                setHolidayShow(false);
            } else if (isUserRoleAccess?.userdayshift[0]?.shift?.includes("Week Off")) {
                setWeekOffShow(false);
            } else if (mainShiftTiming[0]?.includes("PM") && mainShiftTiming[1]?.includes("AM")) {
                if (isUserRoleAccess?.issecondshift && isInSecondShift) {
                    let res_shift = await axios.post(SERVICE.GETTODAYSHIFT, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        todayshifttiming: isUserRoleAccess?.secondshifttiming
                    });
                    const regularshift = isUserRoleAccess?.secondshifttiming;
                    const stcl = await fetchOverAllSettings();

                    const [cin, cout] = stcl?.split("-")
                    setShiftMode("Second Shift");
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

                        setShiftTimings(`${newTime} ${period}`);
                    } else {
                    }
                } else {
                    const regularshift = isUserRoleAccess?.mainshifttiming;
                    const stcl = await fetchOverAllSettings();

                    const [cin, cout] = stcl?.split("-")
                    setShiftMode("Main Shift");
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

                        setShiftTimings(`${newTime} ${period}`);
                    } else {
                    }
                }
            } else {
                if (isUserRoleAccess?.issecondshift && isInSecondShift) {

                    let res_shift = await axios.post(SERVICE.GETTODAYSHIFT, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        todayshifttiming: isUserRoleAccess?.secondshifttiming
                    });
                    const regularshift = isUserRoleAccess?.secondshifttiming;
                    const stcl = await fetchOverAllSettings();

                    const [cin, cout] = stcl?.split("-")
                    setShiftMode("Second Shift");

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

                        setShiftTimings(`${newTime} ${period}`);
                    } else {
                    }
                } else {

                    const regularshift = isUserRoleAccess?.mainshifttiming;
                    const stcl = await fetchOverAllSettings();

                    const [cin, cout] = stcl?.split("-")

                    setShiftMode("Main Shift");

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

                        setShiftTimings(`${newTime} ${period}`);
                    } else {
                    }
                }
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
                    let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    });
                    setStartTime(
                        res?.data?.attendancecontrolcriteria[
                            res?.data?.attendancecontrolcriteria?.length - 1
                        ]?.clockin
                    );
                    setEndTime(
                        res?.data?.attendancecontrolcriteria[
                            res?.data?.attendancecontrolcriteria?.length - 1
                        ]?.clockout
                    );
                    const settingsclockin = res?.data?.attendancecontrolcriteria[
                        res?.data?.attendancecontrolcriteria?.length - 1
                    ]?.clockin;
                    const settingsclockoout = res?.data?.attendancecontrolcriteria[
                        res?.data?.attendancecontrolcriteria?.length - 1
                    ]?.clockout;
                    return settingsclockin + "-" + settingsclockoout;
                } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
            setStartTime(
                res?.data?.attendancecontrolcriteria[
                    res?.data?.attendancecontrolcriteria?.length - 1
                ]?.clockin
            );
            setEndTime(
                res?.data?.attendancecontrolcriteria[
                    res?.data?.attendancecontrolcriteria?.length - 1
                ]?.clockout
            );
            const settingsclockin = res?.data?.attendancecontrolcriteria[
                res?.data?.attendancecontrolcriteria?.length - 1
            ]?.clockin;
            const settingsclockoout = res?.data?.attendancecontrolcriteria[
                res?.data?.attendancecontrolcriteria?.length - 1
            ]?.clockout;
            return settingsclockin + "-" + settingsclockoout;
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    // Set the date to the 11th day of the current month and year

    useEffect(() => {
        fetchOverAllSettings()
    }, [])

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
                setCheckShiftTiming("Morning")
                setShowButtonShift(true);
                setShiftClosed("NOT CLOSED");
            } else {
                setCheckShiftTiming("Morning False")
                setShowButtonShift(false);
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
                setShowButtonShift(true);
                setCheckShiftTiming("Evening")
                setShiftClosed("NOT CLOSED");
            } else {
                setCheckShiftTiming("Evening False")
                setShowButtonShift(false);
                setShiftClosed("CLOSED");
            }
        }
    };






    const [shiftTimings, setShiftTimings] = useState("");
    const [endTime, setEndTime] = useState();
    const [calculatedTime, setCalculatedTime] = useState();
    const [showButtonShift, setShowButtonShift] = useState(false);
    const [shiftClosed, setShiftClosed] = useState("BLANK");
    const [IP, setIP] = useState("");























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
    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
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
    const id = open ? "simple-popover" : undefined;

    // Error Popup model
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [showViewAlert, setShowViewAlert] = useState();
    const handleClickOpenViewpop = () => {
        setIsViewOpen(true);
    };
    const handleCloseViewpop = () => {
        backPage("/task/training/master/traininguserpanel");

    };



    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    //delete model
    const [openDelete, setOpenDelete] = useState(false);
    const handleClickOpen = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const dataGridStyles = {
        root: {
            "& .MuiDataGrid-row": {
                height: "15px",
            },
        },
    };

























    useEffect(() => {
        getrowData();
    }, []);



    const [singleDoc, setSingleDoc] = useState({});
    const [updateDetails, setUpDateDetails] = useState([]);
    let updateby = singleDoc?.updatedby;
    let addedby = singleDoc?.addedby;

    const ids = useParams().id;

    const getrowData = async () => {
        try {
            let res = await axios.get(`${SERVICE.SINGLE_TRAINING_FOR_USER}/${ids}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let res_task = await axios.get(`${SERVICE.ALL_TRAININGDETAILS}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let res_Data = await axios.get(`${SERVICE.ALL_TRAINING_FOR_USER}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let answeercheck = res_Data?.data?.trainingforuser?.some(data => data.state === "running" && res?.data?.strainingforuser?._id !== data._id && data.username === isUserRoleAccess?.companyname)
            let schedule = res_task?.data?.trainingdetails?.find(data => data._id === answeercheck?.orginalid
                && data.category === answeercheck?.category
                && data.subcategory === answeercheck?.subcategory
                && data.frequency === answeercheck?.frequency)

            setCheckTimerStart(answeercheck)
            setQueueCheck(true)
            setSingleDoc(res?.data?.strainingforuser);
            setUpDateDetails(res?.data?.strainingforuser?.tableFormat);

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);

    const handleDownload = async (data) => {

        const pages = data;
        const numPages = pages.length;
        const pageNumber = 1;

        const goToPrevPage = () => setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
        const goToNextPage = () => setPageNumber((prevPage) => Math.min(prevPage + 1, numPages));

        const handlePageClick = (page) => {
            setPageNumber(page);
        };

        function updatePage() {
            const currentPageContent = pages[pageNumber - 1];
            document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
            document.querySelector('.pdf-content').innerHTML = currentPageContent;
        }

        const doc = new jsPDF();

        // Show the content of the current page
        doc.text(10, 10, pages[pageNumber - 1]);

        // Convert the content to a data URL
        const pdfDataUri = doc.output('datauristring');

        const newTab = window.open();
        newTab.document.write(`
          <html>
            <style>
              body {
                font-family: 'Arial, sans-serif';
                margin: 0;
                padding: 0;
                background-color: #fff;
                color: #000;
              }
              .pdf-viewer {
                display: flex;
                flex-direction: column;
              }
              .pdf-navigation {
                display: flex;
                justify-content: space-between;
                margin: 20px;
                align-items: center;
              }
              button {
                background-color: #007bff;
                color: #fff;
                padding: 10px;
                border: none;
                cursor: pointer;
              }
              .pdf-content {
                background-color: #fff;
                padding: 20px;
                box-sizing: border-box;
                flex: 1;
              }
              .pdf-thumbnails {
                display: flex;
                justify-content: center;
                margin-top: 20px;
              }
              .pdf-thumbnail {
                cursor: pointer;
                margin: 0 5px;
                font-size: 14px;
                padding: 5px;
              }
            </style>
            <body>
              <div class="pdf-viewer">
                <div class="pdf-navigation">
                  <button onclick="goToPrevPage()">Prev</button>
                  <span>Page ${pageNumber} of ${numPages}</span>
                  <button onclick="goToNextPage()">Next</button>
                </div>
                <div class="pdf-content">
                  ${/* Render PDF content directly in the embed tag */ ''}
                  <embed src="${pdfDataUri}" type="application/pdf" width="100%" height="600px" />
                </div>
                <div class="pdf-thumbnails">
                  ${pages.map((_, index) => `<div class="pdf-thumbnail" onclick="handlePageClick(${index + 1})">${index + 1}</div>`).join('')}
                </div>
              </div>
              <script>
                let pageNumber = ${pageNumber};
                let numPages = ${numPages};
                let pagesData = ${JSON.stringify(pages)};
    
                function goToPrevPage() {
                  if (pageNumber > 1) {
                    pageNumber--;
                    updatePage();
                  }
                }
    
                function goToNextPage() {
                  if (pageNumber < numPages) {
                    pageNumber++;
                    updatePage();
                  }
                }
    
                function updatePage() {
                  document.querySelector('.pdf-navigation span').innerText = 'Page ' + pageNumber + ' of ' + numPages;
                  document.querySelector('.pdf-content').innerHTML = pagesData[pageNumber - 1];
                }
    
                function handlePageClick(page) {
                  pageNumber = page;
                  updatePage();
                }
                
                // Load initial content
                updatePage();
              </script>
            </body>
          </html>
        `);
    };







    // Combine all arrays into a single array
    let combinedArray = allUploadedFiles?.concat(refImage, refImageDrag, capturedImages);
    // Create an empty object to keep track of unique values
    let uniqueValues = {};

    // Filter out duplicates and create a new array
    let resultArray = combinedArray.filter((item) => {
        if (!uniqueValues[item.name]) {
            uniqueValues[item.name] = true;
            return true;
        }
        return false;
    });


    const getviewCode = async (e) => {
        try {
            let res = await axios.delete(`${SERVICE.RAISETICKET_SINGLE}/${singleDoc._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setOpenPageList("changed")
            setClosedPageList("changed")
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        checkbox: true,
        serialNumber: true,
        frequency: true,
        category: true,
        subcategory: true,
        subsubcategory: true,
        schedule: true,
        duration: true,
        type: true,
        required: true,
        breakup: true,
        description: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = raiseTicketList?.map((item, index) => ({
            serialNumber: index + 1,
            id: item._id,
            category: item.category,
            frequency: item.frequency,
            subcategory: item.subcategory,
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
        setPage(1);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchOverTerms.every((term) => Object.values(item)?.join(" ")?.toLowerCase()?.includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }




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
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);
                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
                    }}
                />
            ),
            sortable: false, // Optionally, you can make this column not sortable
            width: 75,

            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 50,
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 100,
            hide: !columnVisibility.frequency,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography sx={{
                            color: params.row.frequency === "Daily" ? "red" :
                                params.row.frequency === "Date Wise" ? "green" :
                                    params.row.frequency === "Monthly" ? "blue" :
                                        params.row.frequency === "Annually" ? 'Orange' :
                                            params.row.frequency === "Day Wise" ? "palevioletred" : 'violet'
                        }}>{params.row.frequency}</Typography>
                    </Grid>

                </Grid>

            ),
        },
        {
            field: "schedule",
            headerName: "Schedule",
            flex: 0,
            width: 100,
            hide: !columnVisibility.schedule,
        },
        {
            field: "category",
            headerName: "Training",
            flex: 0,
            width: 250,
            hide: !columnVisibility.category,
        },

        {
            field: "subcategory",
            headerName: "Sub Training",
            flex: 0,
            width: 250,

            hide: !columnVisibility.subcategory,
        },
        {
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 100,
            hide: !columnVisibility.duration,
        },
        {
            field: "breakup",
            headerName: "Break Up",
            flex: 0,
            width: 100,
            hide: !columnVisibility.breakup,
        },

        {
            field: "required",
            headerName: "Required",
            flex: 0,
            width: 100,
            hide: !columnVisibility.required,
        },
        {
            field: "description",
            headerName: "Description",
            flex: 0,
            width: 100,
            hide: !columnVisibility.description,
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            sortable: false,
            hide: !columnVisibility.actions,
            renderCell: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {/* {((params.row.status !== 'Closed') && (params.row.status !== 'Resolved') && (params.row.status !== 'Reject')) ?
                        (isUserRoleCompare?.includes("eraiseticket")) && (
                            <Link to={`/tickets/raiseticketmaster/${params.row.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                                {
                                    params.row.status === "Details Needed" ?
                                        <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                                            {"Re-Raise"}
                                        </Button> :
                                        <Button sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                                            <EditOutlinedIcon style={{ fontSize: "large" }} />
                                        </Button>
                                }


                            </Link>
                        ) : ""}
                    {((params.row.status !== 'Closed') && (params.row.status !== 'Resolved') && (params.row.status !== 'Reject')) ?
                        (isUserRoleCompare?.includes("draiseticket")) && (
                            <Button
                                sx={userStyle.buttondelete}
                                onClick={(e) => {
                                    getinfoCode(params.row.id);
                                    handleClickOpen();
                                }}
                            >
                                <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} />
                            </Button>
                        ) : ""} */}
                    {isUserRoleCompare?.includes("vtaskuserpanel") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {

                                handleClickOpenViewpop();
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )}
                    {/* {isUserRoleCompare?.includes("iraiseticket") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                getInfoDetails(params.row.id);
                                handleClickOpeninfo();
                            }}
                        >
                            <InfoOutlinedIcon style={{ fontSize: "large" }} />
                        </Button>
                    )} */}
                </Grid>
            ),
        },
    ];

    const sendUserResponseOnlineTest = async () => {
        try {

            let answer = await axios.get(SERVICE.ALL_TRAINING_USER_RESPONSE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let answerQuestions = await axios.get(SERVICE.ALL_ONLINE_TEST_QUESTION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let answerMaster = await axios.get(SERVICE.ALL_ONLINE_TEST_MASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let checkAns = answer?.data?.traininguserresponses?.find(data => data.trainingid === singleDoc?._id)
            let checkMaster = answer?.data?.traininguserresponses?.filter(data => data?.typequestion === singleDoc?.typequestion 
                && data?.username === singleDoc?.username)

            let answ = checkMaster?.length > 0 ? (checkMaster[checkMaster?.length - 1]?.questioncount) : "";
            console.log(answ, checkMaster,'answ')
            let [start, end] = answ?.split("-")?.map(Number);
            let [startAct, endAct] = singleDoc?.questioncount?.split("-")?.map(Number);
            const cateSubCate = singleDoc?.testnames?.replace("(", "")?.replace(")", "")?.split("-")
            let data_question = answerQuestions?.data?.onlinetestquestions?.filter(item => cateSubCate[cateSubCate.length - 2] === item?.category && cateSubCate[cateSubCate.length - 1] === item?.subcategory);
            let data_question_Master = answerMaster?.data?.onlinetestmasters?.find(item => cateSubCate[cateSubCate.length - 2] === item?.category && cateSubCate[cateSubCate.length - 1] === item?.subcategory && item.type === "Running");

            let newStart = (end) > data_question?.length ? 1 : (end);
            let newEnd = newStart + (endAct - startAct);
            let newAnsw = `${newStart}-${newEnd}`;
            let ansCount = checkMaster?.length > 0 ? singleDoc?.typequestion === "Manual" ? newAnsw : Number(checkMaster[checkMaster?.length - 1]?.questioncount) : 0

            console.log(checkMaster?.length > 0 ?
                singleDoc?.typequestion === "Manual"
                    ? newAnsw
                    : (ansCount + Number(data_question_Master?.questioncount)) >= data_question?.length
                        ? data_question_Master?.questioncount
                        : (ansCount + Number(data_question_Master?.questioncount))
                : singleDoc?.questioncount)
console.log("Manual - ", newAnsw,data_question?.length ,end)
console.log("ansCount - ", ansCount ,data_question_Master?.questioncount, singleDoc?.typequestion)
            if (checkAns === "" || checkAns === undefined) {
                let res = await axios.post(
                    `${SERVICE.CREATE_TRAINING_USER_RESPONSE}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        username: singleDoc?.username,
                        trainingdetails: singleDoc?.trainingdetails,
                        trainingassigneddate: singleDoc?.taskassigneddate,
                        trainingdate: moment(new Date()).format("DD-MM-YYYY"),
                        trainingtype: singleDoc?.taskdetails,
                        typequestion: singleDoc?.typequestion,
                        questioncount: checkMaster?.length > 0 ?
                            singleDoc?.typequestion === "Manual"
                                ? newAnsw
                                : (ansCount + Number(data_question_Master?.questioncount)) >= data_question?.length
                                    ? data_question_Master?.questioncount
                                    : (ansCount + Number(data_question_Master?.questioncount))
                            : singleDoc?.questioncount,
                        estimationtimetraining: singleDoc?.estimationtimetraining,
                        estimationtraining: singleDoc?.estimationtraining,
                        trainingid: singleDoc?._id,
                    }
                );
            }
            await getrowData();
            const url = `${BASE_URL}/training/${ids}`
            window.open(url, "_self");
        } catch (err) {console.log(err , 'err'); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const handleNotNowCheck = () => {
        setOnlineTest('False');
    }
    const handleOnTimeTrainig = () => {
        sendUserResponseOnlineTest();
    }

    const handleOnlineTestDateCheck = () => {
        if (onlineTestDate === "" || onlineTestDate === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Online Test Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (onlineTestTime === "" || onlineTestTime === undefined) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon style={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Online Test Time"}</p>
                </>
            );
            handleClickOpenerr();
        } else {
            handlePostponedStatus();

        }
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
            category: item.category,
            subcategory: item.subcategory,
            schedule: item.schedule,
            duration: item.duration,
            frequency: item.frequency,
            required: item?.required,
            breakup: item?.breakup,
            description: item.description,
        };
    });

    // Excel
    const fileName = "User Training Panel";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User Training Panel",
        pageStyle: "print",
    });

    const columns = [
        { title: "S.NO", field: "serialNumber" },
        { title: "Frequency", field: "frequency" },
        { title: "Schedule", field: "schedule" },
        { title: "Training", field: "category" },
        { title: "Sub Training", field: "subcategory" },
        { title: "Duration", field: "duration" },
        { title: "Required", field: 'required' },
        { title: "Break Up", field: "breakup" },



    ];

    // PDF
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: filteredData,
        });
        doc.save("User Training Panel.pdf");
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "User Training Panel.png");
                });
            });
        }
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <div style={{ padding: "10px", minWidth: "325px" }}>
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-10px" }} checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility({})}>
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </div>
    );

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

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));
    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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
            let oldschedule = singleDoc?.startTimeSchedule
            const newTodosedit = [...oldstarttime, formattedDate + " " + now.toLocaleTimeString()];
            const newTodoseditSchedule = [...oldschedule, today];
            const split = calculatedTime?.split("-")

            await sendEditRequest(newTodosedit, "running", newTodoseditSchedule);
            await addFutureTimeToCurrentTime(split[1])
            setRunningIndex(ids);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleUpdateTodoEditpaused = async (idval) => {
        try {
            let today = new Date();

            var dd = String(today.getDate()).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0");
            var yyyy = today.getFullYear();
            let formattedDate = dd + "/" + mm + "/" + yyyy

            let oldendtime = singleDoc?.endTime;
            let oldendtimeschedule = singleDoc?.endTimeSchedule;
            const newTodosedit = [...oldendtime, formattedDate + " " + now.toLocaleTimeString()];
            const newTodoseditschedule = [...oldendtimeschedule, today];
            await sendEditpausRequest(newTodosedit, 'paused', newTodoseditschedule);
            setRunningIndex(null);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
        // localStorage.setItem("runningIndex", null);
    };

    const [dateArray, setDateArray] = useState([])
    const [timeArray, setTimeArray] = useState([])
    const [tableFormat, setTableFormat] = useState([])



    const FetchTime = () => {
        const result = [];

        if (singleDoc?.startTimeSchedule?.length > 0) {
            const initialTime = singleDoc?.startTimeSchedule[0]

            const formattedDate = new Date(initialTime);
            const hours = formattedDate.getHours();
            const minutes = formattedDate.getMinutes();
            const seconds = formattedDate.getSeconds();
            // Determine whether it's AM or PM


            // 01,12,23,34,45
            const period = hours >= 12 ? 'PM' : 'AM';
            const formattedTimeSchedule = `${hours}:${minutes}`;

            const datesArray = [];
            const datesTimeArray = [];

            for (let i = 0; i <= Number(singleDoc?.breakupcount); i++) {
                const newDate = new Date(formattedDate?.getTime() + i * Number(singleDoc?.breakup) * 60 * 1000); // Adding 40 minutes
                const hours = newDate.getHours();
                const minutes = newDate.getMinutes();
                const seconds = newDate.getSeconds();
                // Determine whether it's AM or PM


                // 01,12,23,34,45
                const period = hours >= 12 ? 'PM' : 'AM';
                // Adjust hours for 12-hour format
                const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

                const formattedTime = `${hours}:${minutes}:${seconds} ${period}`;
                datesArray.push(String(newDate))
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
                    const task = singleDoc?.category;
                    const subtask = singleDoc?.subcategory;
                    const totalduration = singleDoc?.duration;
                    const breakupcount = i + 1;
                    const reason = "";
                    result.push({ sno, task, subtask, totalduration, breakupcount, startDate, startTime, endDate, endTime, reason });
                }

                return result;
            }
            const timeRanges = generateTimeRanges(datesTimeArray);
            setTableFormat(timeRanges)
            setTimeArray(datesTimeArray)
            setDateArray(datesArray)


        }

    }


    useEffect(() => {
        FetchTime();
    }, [singleDoc])


    const handleOnChanegFieldsCheckDate = (e, indexs) => {
        const FilteredData = updateDetails?.length > 0 ? updateDetails : tableFormat;
        const updatedTodos = [...FilteredData];
        updatedTodos[indexs].reason = e;
        updateDetails?.length > 0 ? setUpDateDetails(updatedTodos) : setTableFormat(updatedTodos);

    }

    const handleOnChanegFieldsImageCheck = (e, indexs, index, id) => {
        const FilteredData = updateDetails?.length > 0 ? updateDetails : tableFormat;
        const updatedTodos = [...FilteredData];
        const files = e.target.files;
        // let newSelectedFiles = [...refImage];
        let ans = []
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
                updateDetails?.length > 0 ? setUpDateDetails(updatedTodos) : setTableFormat(updatedTodos);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleDeleteFileCheck = (indexs) => {
        const FilteredData = updateDetails?.length > 0 ? updateDetails : tableFormat;
        const updatedTodos = [...FilteredData];
        updatedTodos[indexs].files = [];
        updateDetails?.length > 0 ? setUpDateDetails(updatedTodos) : setTableFormat(updatedTodos);
        setGetImg("");
        setRefImage([]);
        setPreviewURL(null);
        setRefImageDrag([]);
        setCapturedImages([]);

    }


    const getDownloadFile = async (file) => {
        try {
            //Rendering File
            const response = await fetch(file.preview);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            window.open(link, "_blank");

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    const handleUpdatesubmitTable = async (indexs, files) => {
        const FilteredData = updateDetails?.length > 0 ? updateDetails : tableFormat;
        const updatedTodos = [...FilteredData];
        updatedTodos[indexs].status = "Added";
        updatedTodos[indexs].files = files;


        let res = await axios.put(
            `${SERVICE.SINGLE_TRAINING_FOR_USER}/${ids}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                tableFormat: updatedTodos,
                files: files

            }
        );

        setAllUploadedFiles([])
        setRefImage([])
        setRefImageDrag([])
        setCapturedImages([])
    }




    const sendEditRequest = async (newTodosedit, running, date) => {
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_TRAINING_FOR_USER}/${ids}`,
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const sendEditpausRequest = async (newTodosedit, paused, date) => {
        try {
            let res = await axios.put(
                `${SERVICE.SINGLE_TRAINING_FOR_USER}/${ids}`,
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    const calculateTotalTimes = () => {
        const matchedItem = singleDoc;
        const startTimes = matchedItem && matchedItem?.startTime;
        const endTimes = matchedItem && matchedItem?.endTime;

        let totalMilliseconds = 0;

        for (let i = 0; i < startTimes?.length; i++) {
            // Rearrange the date format to "MM/DD/YYYY hh:mm:ss A"
            const startTime = new Date(startTimes[i]?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
            const endTime = new Date(endTimes[i]?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));

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
        return `${String(totalHoursWithDays).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };


    const lastStartTime = singleDoc?.startTime?.length > 0 && singleDoc?.startTime[singleDoc?.startTime?.length - 1];
    // Parse the first time string into a Date object
    const time1 = lastStartTime && new Date(lastStartTime?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
    const timestamprun = new Date(timestamp?.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));

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
    let durationTimerun = `${String(totalHoursWithDaysrun).padStart(2, "0")}:${String(minutesrun).padStart(2, "0")}:${String(secondsrun).padStart(2, "0")}`;


    const FilteredData = updateDetails?.length > 0 ? updateDetails : tableFormat;


    const [shiftEndDate, setShiftEndDate] = useState([])
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

        setShiftEndDate(newDate)
        return newDate;
    }



    const HandleSubmit = async () => {

        //3 conditions
        //1----> Shift Time
        //2---> button 
        //3 --->> reason

        if (filterValue === "Please Select Status") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please select Training Status"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (userStatusDes === "" || userStatusDes === "<p><br></p>") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Description For Training Status"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (singleDoc?.startTimeSchedule?.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please On Timer to work on the Training"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            await getrowData();

            if (["Completed"]?.includes(filterValue) && (singleDoc?.isOnlineTest === "true" || singleDoc?.isOnlineTest === true)) {
                handleClickOpenview();
            } else {
                handleClickOpen();
            }
        }
    }


    const handleOnCloseTicket = async () => {
        const tableReason = singleDoc?.tableFormat?.map(data => (data?.reason))
        const split = calculatedTime?.split("-")
        const shiftEndTime = addFutureTimeToCurrentTime(split[1])
        let userCheck = await axios.get(SERVICE.ALL_TRAINING_FOR_USER, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let userStatus = userCheck?.data?.trainingforuser?.find(data => data.username === isUserRoleAccess?.companyname);
        let scheduledDates = userStatus?.scheduledDates;
        let today = new Date();

        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var yyyy = today.getFullYear();
        let formattedDate = dd + "/" + mm + "/" + yyyy

        let oldendtime = singleDoc?.endTime;
        let oldendtimeschedule = singleDoc?.endTimeSchedule;
        const newTodosedit = [...oldendtime, formattedDate + " " + now.toLocaleTimeString()];
        const newTodoseditschedule = [...oldendtimeschedule, today];
        let res = await axios.put(
            `${SERVICE.SINGLE_TRAINING_FOR_USER}/${ids}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                scheduledDates: [...scheduledDates, shiftEndTime],
                taskstatus: filterValue,
                userdescription: userStatusDes,
                state: "paused",
                endTime: newTodosedit,
                endTimeSchedule: newTodoseditschedule,
            }
        )
        backPage("/task/training/master/traininguserpanel");
        handleCloseDelete();


    }
    const handlePostponedStatus = async () => {
        // await handleCompleteothers(filterValue);
        const tableReason = singleDoc?.tableFormat?.map(data => (data?.reason))
        const split = calculatedTime?.split("-")
        const shiftEndTime = addFutureTimeToCurrentTime(split[1])
        let userCheck = await axios.get(SERVICE.ALL_TRAINING_FOR_USER, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        let userStatus = userCheck?.data?.trainingforuser?.find(data => data.username === isUserRoleAccess?.companyname);
        let scheduledDates = userStatus?.scheduledDates;
        let today = new Date();

        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0");
        var yyyy = today.getFullYear();
        let formattedDate = dd + "/" + mm + "/" + yyyy

        let oldendtime = singleDoc?.endTime;
        let oldendtimeschedule = singleDoc?.endTimeSchedule;
        const newTodosedit = [...oldendtime, formattedDate + " " + now.toLocaleTimeString()];
        const newTodoseditschedule = [...oldendtimeschedule, today];
        let res = await axios.put(
            `${SERVICE.SINGLE_TRAINING_FOR_USER}/${ids}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                scheduledDates: [...scheduledDates, shiftEndTime],
                taskstatus: "Postponed",
                onlinetestdate: onlineTestDate,
                onlinetesttime: onlineTestTime,
                userdescription: userStatusDes,
                state: "paused",
                endTime: newTodosedit,
                endTimeSchedule: newTodoseditschedule,
            }
        )
        backPage("/task/training/master/trainingpostponedlist");
        handleCloseview();


    }

    const handleCompleteothers = async (value) => {
        if (value === "Completed") {
            let res = await axios.post(
                `${SERVICE.TRAINING_FOR_USER_ASSIGNID}`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    assignId: String(singleDoc?.assignId),
                    username: singleDoc?.username
                }
            );

            // if (res?.data?.taskforuser?.length > 0) {
            //     let ans = res?.data?.taskforuser?.map((data) => {
            //         axios.put(
            //             `${SERVICE.SINGLE_TRAINING_FOR_USER}/${data._id}`,
            //             {
            //                 headers: {
            //                     Authorization: `Bearer ${auth.APIToken}`,
            //                 },
            //                 taskstatus: "Completed",
            //                 state: "paused",
            //             }
            //         )
            //     })

            // }
        }

    }




    return (
        <Box>
            <Headtitle title={"USER TRAINING PANEL VIEW"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>User Training Panel View</Typography>

            {!queueCheck ? (
                <Box sx={userStyle.dialogbox}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("vtraininguserpanel") && (
                        <>
                            <Box sx={userStyle.dialogbox}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <Typography sx={userStyle.SubHeaderText}>User Training Panel View</Typography>
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
                                            <Typography variant="subtitle2">{singleDoc?.state === "running" ? durationTimerun : singleDoc?.state === "" ? "00:00:00" : calculateTotalTimes()}</Typography>
                                        </Grid>

                                        <Grid md={1} sm={12} xs={12} style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                                            {singleDoc?.state === "running" ? (
                                                <Button
                                                    style={{ textTransform: "capitalize", minWidth: "30px", padding: "0px 10px", background: "#f5f5f5", border: "1px solid", color: "#0000008f" }}
                                                    onClick={() => {
                                                        handleUpdateTodoEditpaused();
                                                    }}
                                                >
                                                    Pause
                                                </Button>
                                            ) : (
                                                <Button
                                                    style={{ textTransform: "capitalize", minWidth: "30px", padding: "0px 10px", background: "#f5f5f5", border: (runningIndex !== null && runningIndex !== singleDoc?._id) || singleDoc?.state === "stopped" ? "none" : "1px solid", color: "#0000008f" }}
                                                    disabled={(runningIndex !== null && runningIndex !== singleDoc?._id) || singleDoc?.state === "stopped"}
                                                    onClick={() => {
                                                        handleUpdateTodoEditrunning();
                                                    }}
                                                >
                                                    Start
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                ) :
                                    <Grid container spacing={2} justify="flex-end">
                                        <Grid md={9} sm={12} xs={12}></Grid>
                                        <Grid md={3} sm={12} xs={12}>
                                            <Typography sx={{ color: "red" }}>Timer is Already Running in Previous Training</Typography>
                                        </Grid>
                                    </Grid>

                                }
                                <br></br>
                                <Box sx={{ padding: "20px 20px" }}>
                                    <>

                                        <br /> <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6">Training Details</Typography>
                                                    <Typography>{singleDoc?.trainingdetails}</Typography>
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
                                        </Grid>
                                        <br /> <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12}>
                                                {(singleDoc?.frequency === "Daily") &&
                                                    <>
                                                        <Typography variant="h6">Time</Typography>
                                                        <Typography>{singleDoc?.timetodo?.map((t, i) => `${i + 1 + ". "}` + `${t?.hour}:${t?.min} ${t?.timetype}`)}</Typography>
                                                    </>
                                                }
                                                {
                                                    (singleDoc?.frequency === "Monthly" || singleDoc?.frequency === "Date Wise") &&
                                                    <>
                                                        <Typography variant="h6">Days</Typography>
                                                        <Typography>{singleDoc?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t)}</Typography>
                                                    </>
                                                }
                                                {(singleDoc?.frequency === "Weekly" || singleDoc?.frequency === "Day Wise") &&
                                                    <>
                                                        <Typography variant="h6">Days</Typography>
                                                        <Typography>{singleDoc?.weekdays?.map((t, i) => `${i + 1 + ". "}` + t)}</Typography>
                                                    </>
                                                }
                                                {(singleDoc?.frequency === "Annually") &&
                                                    <>
                                                        <Typography variant="h6">Annual</Typography>
                                                        <Typography>{`${singleDoc?.annumonth} month ${singleDoc?.annuday} days`}</Typography>
                                                    </>
                                                }
                                                <br /> <br />
                                                <br /> <br />
                                            </Grid>

                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Typography sx={{ fontWeight: "bold" }}>Training Documents List</Typography>
                                            <br /> <br />
                                            {singleDoc?.trainingdocuments?.length > 0 &&
                                                <>                  <Grid container spacing={2}>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <Typography variant="h6">Training</Typography>
                                                    </Grid>
                                                    <Grid item md={3} xs={12} sm={12}>
                                                        <Typography variant="h6">Sub-Training</Typography>
                                                    </Grid>
                                                    <Grid item md={5} xs={12} sm={12}>
                                                        <Typography variant="h6">Training Documents</Typography>
                                                    </Grid>
                                                </Grid></>}
                                            {singleDoc?.trainingdocuments?.length > 0 &&
                                                singleDoc?.trainingdocuments?.map((row, index) => {
                                                    return (
                                                        <Grid container spacing={2}>
                                                            <Grid item md={3} xs={12} sm={12}>
                                                                <Typography>{row?.category}</Typography>
                                                            </Grid>
                                                            <Grid item md={3} xs={12} sm={12}>
                                                                <Typography>{row?.subcategory}</Typography>
                                                            </Grid>
                                                            <Grid item md={5} xs={12} sm={12}>
                                                                <FormControl fullWidth size="small">
                                                                    {row?.subcatgeoryDocuments?.length > 0 &&
                                                                        row?.subcatgeoryDocuments?.map((data, index) => {
                                                                            return (
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item md={5} xs={12} sm={12}>
                                                                                        <Typography>{`${index + 1}. ${data?.name}`}</Typography>
                                                                                    </Grid>
                                                                                    <Grid item md={2} xs={12} sm={12}>
                                                                                        {data.files.length < 1 ?
                                                                                            <div className="page-pdf">
                                                                                                <Button onClick={() => {
                                                                                                    handleDownload(data.document);
                                                                                                }} className="next-pdf-btn pdf-button">
                                                                                                    View
                                                                                                </Button>
                                                                                            </div> :
                                                                                            <Button
                                                                                                variant="text"
                                                                                                onClick={() => {
                                                                                                    renderFilePreview(data.files);
                                                                                                }}
                                                                                                sx={userStyle.buttonview}
                                                                                            >
                                                                                                Views
                                                                                            </Button>
                                                                                        }
                                                                                    </Grid>
                                                                                </Grid>
                                                                            )
                                                                        })

                                                                    }
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })

                                            }<br />
                                        </Grid>
                                        <br /> <br />
                                        <br /> <br />
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6">Training Status <b style={{ color: "red" }}>*</b> </Typography>
                                                    <Selects
                                                        options={[
                                                            { label: "Completed", value: "Completed" },
                                                            { label: "Pending", value: "Pending" },
                                                            // { label: "Postponed", value: "Postponed" },
                                                            { label: "Finished By Others", value: "Finished By Others" },
                                                            { label: "Not Applicable to Me", value: "Not Applicable to Me" },
                                                        ]}
                                                        styles={colourStyles}
                                                        value={{ label: filterValue, value: filterValue }}
                                                        onChange={(e) => {
                                                            setFilterValue(e.value);

                                                        }}
                                                    />                                </FormControl>

                                            </Grid>
                                            <br /> <br /> <br />
                                            <br /> <br /> <br />
                                            {filterValue !== "Please Select Status" && <Grid item md={9} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography variant="h6">User Status Description <b style={{ color: "red" }}>*</b> </Typography>
                                                    <ReactQuill
                                                        style={{ maxHeight: "180px", height: "150px" }}
                                                        value={userStatusDes}
                                                        onChange={(e) => { setUserStatusDes(e) }}
                                                        modules={{
                                                            toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }],
                                                            ["bold", "italic", "underline", "strike", "blockquote"],
                                                            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]]
                                                        }}
                                                        formats={["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"]}
                                                    />
                                                </FormControl>
                                                <br /> <br /> <br />
                                                <br /> <br /> <br />
                                            </Grid>}
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={HandleSubmit}
                                                >
                                                    Close Training
                                                </Button>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={6}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
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
                    )}
                </>
            )
            }




            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog open={isDeleteOpencheckbox} onClose={handleCloseModcheckbox} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent
                        sx={{
                            width: "350px",
                            textAlign: "center",
                            alignItems: "center",
                        }}
                    >
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => delAccountcheckbox(e)}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="sm"
                fullWidth={true}
            >
                <Box sx={{ padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>Are You Ready For an Online Test...??</Typography>
                        <br /> <br />

                        {onlineTest === "False" &&
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>When you want to attend the Online Test...??</Typography>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="Date"
                                            value={onlineTestDate}
                                            onChange={(e) => {
                                                const date = (e.target.value) > formattedDate ? (e.target.value) : ""
                                                setOnlineTestDate(date);
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="time"
                                            value={onlineTestTime}
                                            onChange={(e) => {
                                                setOnlineTestTime(e.target.value);
                                            }}

                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        }

                        <DialogActions>

                            {onlineTest === "true" ?
                                <>
                                    <Button onClick={() => handleNotNowCheck()} variant="outlined">
                                        Not Now
                                    </Button>
                                    <Button autoFocus onClick={() => handleOnTimeTrainig()} variant="contained" color="primary">
                                        {" "}
                                        Sure{" "}
                                    </Button>
                                </> : <Button onClick={() => handleOnlineTestDateCheck()} autoFocus variant="contained" color="primary">
                                    {" "}
                                    Ok{" "}
                                </Button>}
                        </DialogActions>
                    </>
                </Box>
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




            <Dialog open={openDelete}

                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        Are you sure you want to close the training?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={(e) => handleOnCloseTicket()} autoFocus variant="contained" color="error">
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>

            <br />
            <br />
        </Box >
    );
}

export default TrainingUserPanelView;