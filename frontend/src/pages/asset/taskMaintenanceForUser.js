import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { TextField, InputAdornment, IconButton, ListItem, List, Checkbox, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import StyledDataGrid from "../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import LoadingButton from "@mui/lab/LoadingButton";
import TaskMaintenanceForUserOnProgress from "./taskusermaintenanceonprogress";
import TaskMaintenanceForUserCompleted from "./taskusermaintenancecompleted";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";

//new table
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../components/Searchbar';
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";


function TaskMaintenaceForUser() {
    const [raiseTicketList, setRaiseTicketList] = useState([]);

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);
    const gridRefTableImg = useRef(null);
    const gridRefTable = useRef(null);


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


    let exportColumnNames = [
        'Task Status', 'Task Date',
        'Task Time', 'Priority',
        'Task Details', 'Frequency',
        'Schedule', 'Task',
        'Duration', 'Break Up',
        'Required'
    ];
    let exportRowValues = [
        'taskstatus',
        'taskassigneddate',
        'tasktime',
        'priority',
        'taskdetails',
        'frequency',
        'schedule',
        'assetmaterial',
        'duration',
        'breakup',
        'required'
    ];



    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Task Maintenance User Panel"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });

    }

    useEffect(() => {
        getapi();
    }, []);


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




    const [filtercompleted, setFiltercompleted] = useState("start");
    const [CheckExtraTasksAdded, setCheckExtraTasksAdded] = useState([]);
    const [CheckExtraTasksSchedule, setCheckExtraTasksSchedule] = useState([]);
    const [ExtraNonScheduleTasks, setExtraNonScheduleTasks] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);

    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "UserMaintenancePanel -Pending.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    //Datatable
    const [queueCheck, setQueueCheck] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [btnSubmit, setBtnSubmit] = useState(false);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [shiftTimings, setShiftTimings] = useState("");
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [calculatedTime, setCalculatedTime] = useState();
    const [showButtonShift, setShowButtonShift] = useState(false);
    const [shiftClosed, setShiftClosed] = useState("BLANK");
    // Error Popup model
    const [showAlert, setShowAlert] = useState();
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnSubmit(false)
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const [checkShiftTiming, setCheckShiftTiming] = useState("");

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

    const newcurrentTime = new Date();

    const currentHour = newcurrentTime.getHours();
    const currentMinute = newcurrentTime.getMinutes();
    const period = currentHour >= 12 ? 'PM' : 'AM';
    const [weekOffShow, setWeekOffShow] = useState(true);
    const [holidayShow, setHolidayShow] = useState(true);
    const currDate = new Date();
    const currDay = currDate.getDay();
    const [shiftMode, setShiftMode] = useState("Main Shift")

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
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

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
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
        setPageName(!pageName)
        try {
            await fetchOverAllSettings();
            const [res_status] = await Promise.all([
                axios.get(SERVICE.TODAY_HOLIDAY, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
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
            } else if (isUserRoleAccess?.userdayshift && isUserRoleAccess?.userdayshift[0]?.shift?.includes("Week Off")) {
                setWeekOffShow(false);
            } else if (mainShiftTiming && mainShiftTiming[0]?.includes("PM") && mainShiftTiming[1]?.includes("AM")) {
                if (isUserRoleAccess?.issecondshift && isInSecondShift) {

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
                    const cin = stcl ? stcl?.split("-")[0] : ""
                    const cout = stcl ? stcl?.split("-")[1] : ""
                    // const [cin, cout] = stcl?.split("-")
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
        } catch (err) {
            console.log(err, "error")
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
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
        // console.log(userShiftDetailsStartTime, "userShiftDetailsStartTime")
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
                } catch (err) { console.log(err, "error1"); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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

        // const [startTimes, endTimes] = e.split("-");
        const startTimes = e ? e.split("-")[0] : "";
        const endTimes = e ? e.split("-")[1] : "";

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
        } catch (err) { console.log(err, "error2"); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
    const [userPostCall, setUsersPostCall] = useState([])

    //get all project.
    const fetchAllRaisedTickets = async () => {
        try {
            if (userShiftDetails !== "" && calculatedTime !== "" && raiseTicketList) {
                const [res_task_Schedule, res_shift_User, userChecknonschedule] = await Promise.all([
                    axios.get(SERVICE.MAINTENTANCE_ACTIVE, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }),
                    axios.get(SERVICE.SHIFT, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    }),
                    axios.get(SERVICE.ALL_TASK_MAINTENANCE_NONSCHEDULEGROUPING, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                    })
                ]);


                const shiftUser = res_shift_User?.data?.shifts?.find(item => item.name === isUserRoleAccess.shifttiming)

                let userTaskDesignation = res_task_Schedule?.data?.maintenances?.length > 0 ?
                    res_task_Schedule?.data?.maintenances?.filter(item =>
                        item?.companyto === isUserRoleAccess?.company
                        && item?.branchto?.includes(isUserRoleAccess?.branch) &&
                        item?.unitto?.includes(isUserRoleAccess?.unit) &&
                        item?.teamto?.includes(isUserRoleAccess?.team) &&
                        (item.employeenameto.includes(isUserRoleAccess.companyname) || item?.employeenameto?.includes("ALL"))
                    ).flatMap(item => item.employeenameto) : []
                const DuplicateRemoval = [...new Set(userTaskDesignation)]
                const userDuplicate = DuplicateRemoval?.includes("ALL") ? [isUserRoleAccess?.companyname] : DuplicateRemoval?.filter(data => data === isUserRoleAccess?.companyname)
                setUsersPostCall(userDuplicate)
                const frequencyOrder = {
                    Daily: 1,
                    "Date wise": 2,
                    "Day wise": 3,
                    Weekly: 4,
                    Monthly: 5,
                    Annually: 6,
                };
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const tomorrowNight = new Date(today);
                tomorrowNight.setDate(today.getDate() + 1);
                // const dayOfWeekTomorrow = tomorrow.toLocaleString('en-US', { weekday: 'long' });
                const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
                const currentDay = today.getDate();
                const dayOfMonth = today.getMonth() + 1;

                // Convert shift start and end times to 24-hour format
                tomorrowNight.setHours(shiftUser?.totime === 'AM' ? shiftUser?.tohour : Number(shiftUser?.tohour) + 12, shiftUser?.tomin, 0, 0);
                let anstaskUserPanel =
                    res_task_Schedule?.data?.maintenances?.filter(item =>
                        item?.companyto === isUserRoleAccess?.company
                        && item?.branchto?.includes(isUserRoleAccess?.branch) &&
                        item?.unitto?.includes(isUserRoleAccess?.unit) &&
                        item?.teamto?.includes(isUserRoleAccess?.team) &&
                        (item.employeenameto.includes(isUserRoleAccess.companyname) || item?.employeenameto?.includes("ALL"))
                    )

                const getNextDays = (currentDays) => {
                    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    return currentDays.map(currentDay => {
                        const currentDayIndex = daysOfWeek.indexOf(currentDay);
                        const nextDayIndex = (currentDayIndex + 1) % 7; // Ensure it wraps around to Sunday if needed
                        return daysOfWeek[nextDayIndex];
                    });
                };

                let priorityCheck = anstaskUserPanel?.length > 0 ? anstaskUserPanel?.filter((item) => {
                    if (item?.frequency === "Daily" && weekOffShow && holidayShow) {
                        //Shift Basis 
                        if (checkShiftTiming === "Morning" && item?.schedule === "Time Based" && weekOffShow) {
                            return item;

                        }
                        else if (checkShiftTiming === "Evening" && item?.schedule === "Time Based" && weekOffShow) {
                            return item;
                        }
                        //Anytime Basis 
                        else if (item?.schedule === "Any Time" && weekOffShow) {
                            return item;

                        }
                    }
                    if ((item?.frequency === "Day Wise" || item?.frequency === "Weekly" && weekOffShow && holidayShow)) {

                        if (checkShiftTiming === "Morning" && item?.schedule === "Time Based") {
                            return item?.weekdays?.includes(dayOfWeek);

                        }
                        else if (checkShiftTiming === "Evening" && item?.schedule === "Time Based") {
                            const dayOfWeekTomorrow = getNextDays(item?.weekdays);
                            const ans = item?.weekdays?.push(...dayOfWeekTomorrow)
                            const nightDays = [dayOfWeek, ...dayOfWeekTomorrow]
                            return item?.weekdays?.includes(dayOfWeek);
                        }
                        //Anytime Basis s
                        else if ((checkShiftTiming === "Morning" || checkShiftTiming === "Morning False") && item?.schedule === "Any Time") {
                            const dayOfWeekTomorrow = getNextDays(item?.weekdays);
                            const ans = item?.weekdays?.push(...dayOfWeekTomorrow)
                            const nightDays = [dayOfWeek, ...dayOfWeekTomorrow]
                            return item?.weekdays?.includes(dayOfWeek);


                        }
                        else if ((checkShiftTiming === "Evening" || checkShiftTiming === "Evening False") && item?.schedule === "Any Time") {
                            const dayOfWeekTomorrow = getNextDays(item?.weekdays);
                            const ans = item?.weekdays?.push(...dayOfWeekTomorrow)
                            const nightDays = [dayOfWeek, ...dayOfWeekTomorrow]
                            return item?.weekdays?.includes(dayOfWeek);
                        }

                    }
                    if (item?.frequency === "Monthly" || item?.frequency === "Date Wise" && weekOffShow && holidayShow) {
                        //Shift Basis 
                        if (checkShiftTiming === "Morning" && item?.schedule === "Time Based") {
                            const formattedDay = Number(currentDay) < 10 ? `0${currentDay}` : currentDay;
                            return item?.monthdate == formattedDay;

                        }
                        else if (checkShiftTiming === "Evening" && item?.schedule === "Time Based") {
                            const today = new Date();


                            const tomorrow = new Date(today);
                            tomorrow.setDate(today.getDate() - 1);
                            const tomorrowNight = new Date(tomorrow);
                            if (new Date().getDate() == Number(item?.monthdate)) {
                                return item;

                            } else if (tomorrowNight.getDate() == Number(item?.monthdate)) {
                                return item
                            }

                        }
                        //Anytime Basis 
                        else if ((checkShiftTiming === "Morning" || checkShiftTiming === "Morning False") && item?.schedule === "Any Time") {
                            const formattedDay = Number(currentDay) < 10 ? `0${currentDay}` : currentDay;
                            return item?.monthdate == formattedDay;

                        }
                        else if ((checkShiftTiming === "Evening" || checkShiftTiming === "Evening False") && item?.schedule === "Any Time") {
                            const today = new Date();
                            const tomorrow = new Date(today);
                            tomorrow.setDate(today.getDate() - 1);
                            const tomorrowNight = new Date(tomorrow);
                            if (new Date().getDate() == Number(item?.monthdate)) {
                                return item;

                            } else if (tomorrowNight.getDate() == Number(item?.monthdate)) {
                                return item
                            }

                        }
                    }
                    if (item?.frequency === "Annually" && weekOffShow && holidayShow) {
                        //Shift Basis 
                        if (checkShiftTiming === "Morning" && item?.schedule === "Time Based" && weekOffShow) {
                            const formattedDay = Number(currentDay) < 10 ? `0${currentDay}` : currentDay;
                            const formattedMonth = Number(dayOfMonth) < 10 ? `0${dayOfMonth}` : dayOfMonth;
                            return Number(item?.annumonth) == Number(formattedMonth) && Number(item?.annuday) == Number(formattedDay);
                        }
                        else if (checkShiftTiming === "Evening" && item?.schedule === "Time Based" && weekOffShow) {

                            const today = new Date();

                            const tomorrow = new Date(today);
                            tomorrow.setDate(today.getDate() - 1);
                            const tomorrowNight = new Date(tomorrow);

                            if (new Date().getDate() == Number(item?.annuday) && new Date().getMonth() + 1 == Number(item?.annumonth)) {
                                return item;

                            } else if (tomorrowNight.getDate() == Number(item?.annuday) && tomorrowNight.getMonth() + 1 == Number(item?.annumonth)) {
                                return item
                            }

                        }
                        //Anytime Basis 
                        else if ((checkShiftTiming === "Morning" || checkShiftTiming === "Morning False") && item?.schedule === "Any Time" && weekOffShow) {
                            const formattedDay = Number(currentDay) < 10 ? `0${currentDay}` : currentDay;
                            const formattedMonth = Number(dayOfMonth) < 10 ? `0${dayOfMonth}` : dayOfMonth;
                            return Number(item?.annumonth) == Number(formattedMonth) && Number(item?.annuday) == Number(formattedDay);

                        }
                        else if ((checkShiftTiming === "Evening" || checkShiftTiming === "Evening False") && item?.schedule === "Any Time" && weekOffShow) {
                            const today = new Date();

                            const tomorrow = new Date(today);
                            tomorrow.setDate(today.getDate() - 1);
                            const tomorrowNight = new Date(tomorrow);

                            if (new Date().getDate() == Number(item?.annuday) && new Date().getMonth() + 1 == Number(item?.annumonth)) {
                                return item;

                            } else if (tomorrowNight.getDate() == Number(item?.annuday) && tomorrowNight.getMonth() + 1 == Number(item?.annumonth)) {
                                return item
                            }
                        }
                    }
                }) : [];
                let final = priorityCheck.sort((a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]);
                const updatedAns1 = final.map(item => {
                    const matchingItem = res_task_Schedule?.data?.maintenances?.find(ansItem => ansItem._id === item._id);
                    if (matchingItem) {
                        return { ...item, weekdays: matchingItem.weekdays, };
                    }
                    return item;
                });

                let userCheck = await axios.post(SERVICE.ALL_TASKMAINTENACEFORUSER_AUTOGENERATE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    final: updatedAns1?.length > 0 ? updatedAns1 : [],
                    dateNow: new Date(),
                    username: isUserRoleAccess?.companyname,
                });
                let uniqueElements = userCheck?.data?.uniqueElements?.length > 0 ? userCheck?.data?.uniqueElements : []
                let nonschedule = userChecknonschedule?.data?.taskmaintenancenonschedulegrouping?.filter(data => data?.employeenames?.includes(isUserRoleAccess?.companyname) &&
                    data?.date === moment(new Date()).format("YYYY-MM-DD"))
                let result = [];
                let answer = nonschedule?.length > 0 && nonschedule?.forEach(item => {
                    item?.employeenames?.forEach(username => {
                        let newItem = {
                            assetmaterial: String(item.assetmaterial),
                            taskdate: String(item.date),
                            tasktime: String(item.time),
                            type: String(item.type),
                            orginalid: item._id,
                            designation: item.designation,
                            schedule: item.schedule,
                            department: item.department,
                            priority: item.priority,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,
                            username: username,
                            taskdetails: "nonschedule",
                            duration: String(item.duration),
                            breakupcount: String(item.breakupcount),
                            breakup: item.breakup,
                            required: item.required,
                            taskstatus: "Assigned"
                        };
                        result.push(newItem);
                    });
                });


                const answerUserNonSchedule = userCheck?.data?.taskmaintenanceforuser?.filter(data => data?.taskdetails === "nonschedule" &&
                    data?.username === isUserRoleAccess?.companyname && data?.taskdate === moment(new Date()).format("YYYY-MM-DD"))
                let uniqueElementsNonSchedule = result?.length > 0 ? result?.filter(obj1 => !answerUserNonSchedule?.some(obj2 =>
                    obj1.assetmaterial === obj2.assetmaterial &&
                    obj2?.taskdate === moment(new Date()).format("YYYY-MM-DD")
                    && obj2.username === isUserRoleAccess?.companyname
                    && obj2?.orginalid == obj1?.orginalid
                    && obj2?.taskdetails === "nonschedule"
                )) : [];

                // Split the time range into start and end times
                const [startTimeStr, endTimeStr] = userShiftDetails?.replace("TO", "-")?.replace("to", "-").split('-');

                // Parse start time
                const [startHourStr, startMinStr, startTimetype] = startTimeStr ? startTimeStr?.split(/:|(?=[AP]M)/) : ""; // Split by colon or lookahead for AM/PM
                let startHour = parseInt(startHourStr);
                const startMin = parseInt(startMinStr);

                // Parse end time
                const [endHourStr, endMinStr, endTimetype] = endTimeStr ? endTimeStr?.split(/:|(?=[AP]M)/) : ""; // Split by colon or lookahead for AM/PM
                let endHour = parseInt(endHourStr);
                const endMin = parseInt(endMinStr);

                // Create shift start and end objects
                const shiftStart = { hour: String(startHour)?.padStart(2, '0'), min: String(startMin).padStart(2, '0'), timetype: startTimetype };
                const shiftEnd = { hour: String(endHour)?.padStart(2, '0'), min: String(endMin).padStart(2, '0'), timetype: endTimetype };


                function findClosestElements(FromThis, shiftStart, shiftEnd) {
                    const groupedElements = {};

                    // Group elements by cate and subcate
                    FromThis.forEach(element => {
                        const key = element?.assetmaterial + '-' + element?.frequency;
                        if (!groupedElements[key]) {
                            groupedElements[key] = [];
                        }
                        groupedElements[key].push(element);
                    });

                    // Filter out elements with the same cate and subcate and find the closest element
                    const closestElements = [];
                    for (const key in groupedElements) {
                        const group = groupedElements[key];
                        let closestTimeDiff = Infinity;
                        let closestElement;
                        group.forEach(element => {
                            const time = element.timetodo && element.timetodo[0];

                            const timeString = `${time?.hour}:${time?.min} ${time?.timetype}`;

                            const diff = getTimeDifference(timeString, shiftStart);
                            // checkShiftTiming === "Evening" ? 

                            const maximumCheck = diff >= (Math?.abs(getTimeDifference(`${shiftEnd?.hour}:${shiftEnd?.min} ${shiftEnd?.timetype}`, shiftStart)))

                            const maximumCheckEve = diff <= (Math?.abs(getTimeDifference(`${shiftEnd?.hour}:${shiftEnd?.min} ${shiftEnd?.timetype}`, shiftStart)))

                            if (diff >= 0 && diff < closestTimeDiff && (checkShiftTiming === "Evening" ? (maximumCheck || maximumCheckEve) : diff <= getTimeDifference(`${shiftEnd?.hour}:${shiftEnd?.min} ${shiftEnd?.timetype}`, shiftStart))) {

                                closestTimeDiff = diff;
                                closestElement = element;
                            }
                        });
                        if (closestElement) {
                            closestElements.push(closestElement);
                        } else {
                            closestElements.push([]);
                        }

                    }
                    return closestElements;
                }

                function getTimeDifference(time1, time2) {
                    const date1 = new Date('2000-01-01 ' + time1);
                    const date2 = new Date('2000-01-01 ' + time2.hour + ':' + time2.min + ' ' + time2.timetype);
                    const shiftEndTime = new Date('2000-01-01 ' + shiftEnd.hour + ':' + shiftEnd.min + ' ' + shiftEnd.timetype);
                    if (date1 < shiftEndTime && checkShiftTiming === "Evening") {
                        return Math.abs((date1 - date2) / (1000 * 60));
                    } else {
                        return (date1 - date2) / (1000 * 60);
                    }

                }
                const closestElements = findClosestElements(uniqueElements?.filter(data => data.schedule !== "Any Time"), shiftStart, shiftEnd);
                const answerClosest = closestElements?.some(data => Array.isArray(data));
                const closestFilter = answerClosest ? closestElements?.filter(data => data.length !== 0) : closestElements
                const removeDuplicates = (dataArray, filterArray) => {
                    return dataArray.filter(item => {
                        const found = filterArray.find(filterItem => (
                            filterItem?.assetmaterial === item?.assetmaterial &&
                            filterItem?.frequency === item?.frequency &&
                            filterItem?.schedule === item?.schedule &&
                            moment(new Date()).format("DD-MM-YYYY") === filterItem.taskassigneddate
                        ));
                        return !found;
                    });
                };
                const RemoveDuplicateClosest = removeDuplicates(closestFilter, raiseTicketList);
                const removedLengthDuplicate = RemoveDuplicateClosest.filter(array => array.length > 0);
                const answerUnique = uniqueElements?.filter(data => data.schedule !== "Time Based")
                const filterTimeTodo = [...RemoveDuplicateClosest, ...answerUnique]
                const uniqueScheduleNonschedule = [...uniqueElementsNonSchedule, ...filterTimeTodo]
                setExtraNonScheduleTasks(result)
                setCheckExtraTasksSchedule(filterTimeTodo)
                setCheckExtraTasksAdded(uniqueScheduleNonschedule)
                const split = calculatedTime?.split("-")
                const shiftEndTime = calculatedTime ? addFutureTimeToCurrentTime(split[1]) : ""
            }
        } catch (err) { console.log(err, "error34"); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    useEffect(() => {
        fetchAllRaisedTickets();
    }, [userShiftDetails, calculatedTime, raiseTicketList])


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
    const [singleDoc, setSingleDoc] = useState({});
    let updateby = singleDoc?.updatedby;
    let addedby = singleDoc?.addedby;


    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        taskstatus: true,
        taskassigneddate: true,
        date: true,
        checkbox: true,
        serialNumber: true,
        frequency: true,
        taskname: true,
        taskdate: true,
        completedbyuser: true,
        username: true,
        category: true,
        assetmaterial: true,
        subcategory: true,
        subsubcategory: true,
        schedule: true,
        tasktime: true,
        priority: true,
        duration: true,
        type: true,
        taskdetails: true,
        required: true,
        breakup: true,
        description: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const convertTimeToAMPMFormat = (time) => {
        let [hour, minute] = time.split(':').map(Number);
        let timetype = 'AM';

        if (hour >= 12) {
            timetype = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }

        if (hour === 0) {
            hour = 12;
        }

        return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute} ${timetype}`;
    };
    //serial no for listing items
    const addSerialNumber = (datas) => {
        // const itemsWithSerialNumber = datas;

        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(raiseTicketList);
    }, [raiseTicketList]);

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





    const columnDataTable = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     headerComponent: (params) => (
        //         <CheckboxHeader
        //             selectAllChecked={selectAllChecked}
        //             onSelectAll={() => {
        //                 if (rowDataTable.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }
        //                 if (selectAllChecked) {
        //                     setSelectedRows([]);
        //                 } else {
        //                     const allRowIds = rowDataTable.map((row) => row.id);
        //                     setSelectedRows(allRowIds);
        //                 }
        //                 setSelectAllChecked(!selectAllChecked);
        //             }}
        //         />
        //     ),

        //     cellRenderer: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.data.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.data.id)) {
        //                     updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.data.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.data.id];
        //                 }

        //                 setSelectedRows(updatedSelectedRows);
        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 75,

        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        {
            field: "checkbox",
            headerName: "Checkbox", // Default header name
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "S.No",
            flex: 0,
            width: 90,
            hide: !columnVisibility.serialNumber,
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 140,
            sortable: false,
            hide: !columnVisibility.actions,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Link to={`/asset/taskmaintenanceuserview/${params.data.id}`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                        <Button variant="contained" sx={userStyle.buttonedit} style={{ minWidth: "0px" }}>
                            View
                        </Button>
                    </Link>
                </Grid>
            ),
        },
        {
            field: "taskstatus",
            headerName: "Task Status",
            flex: 0,
            width: 180,
            hide: !columnVisibility.taskstatus,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ color: params?.data?.taskstatus === "Assigned" ? "green" : params?.data?.taskstatus === "Pending" ? "red" : "blue" }}>{params?.data?.taskstatus}</Typography>
                </Grid>
            ),
        },
        {
            field: "taskassigneddate",
            headerName: "Task Date",
            flex: 0,
            width: 150,
            hide: !columnVisibility.taskassigneddate,
        },
        {
            field: "tasktime",
            headerName: "Task Time",
            flex: 0,
            width: 100,
            hide: !columnVisibility.tasktime,
        },
        {
            field: "priority",
            headerName: "Priority",
            flex: 0,
            width: 150,
            hide: !columnVisibility.priority,
        },
        {
            field: "taskdetails",
            headerName: "Task Details",
            flex: 0,
            width: 190,
            hide: !columnVisibility.taskdetails,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Typography sx={{ color: params?.data?.taskdetails === "schedule" ? "green" : "blue" }}>{params?.data?.taskdetails}</Typography>
                </Grid>
            ),
        },



        {
            field: "frequency",
            headerName: "Frequency",
            flex: 0,
            width: 140,
            hide: !columnVisibility.frequency,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <Grid item md={3} xs={12} sm={12}>
                        <Typography sx={{
                            color: params.data.frequency === "Daily" ? "red" :
                                params.data.frequency === "Date Wise" ? "green" :
                                    params.data.frequency === "Monthly" ? "blue" :
                                        params.data.frequency === "Annually" ? 'Orange' :
                                            params.data.frequency === "Day Wise" ? "palevioletred" : 'violet'
                        }}>{params.data.frequency}</Typography>
                    </Grid>

                </Grid>

            ),
        },
        {
            field: "schedule",
            headerName: "Schedule",
            flex: 0,
            width: 150,
            hide: !columnVisibility.schedule,
        },
        {
            field: "assetmaterial",
            headerName: "Task",
            flex: 0,
            width: 250,
            hide: !columnVisibility.assetmaterial,
        },
        {
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 140,
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
            width: 140,
            hide: !columnVisibility.required,
        },
        {
            field: "description",
            headerName: "Description",
            flex: 0,
            width: 140,
            hide: !columnVisibility.description,
        },


    ];

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

    const rowDataTable = filteredData?.map((item, index) => {
        return {
            id: item?.id,
            serialNumber: item?.serialNumber,
            taskstatus: item?.taskstatus,
            taskassigneddate: item?.taskassigneddate,
            taskdetails: item?.taskdetails,
            priority: item.priority,
            tasktime: item?.tasktime,
            assetmaterial: item?.assetmaterial,
            subcategory: item?.subcategory,
            schedule: item?.schedule,
            duration: item?.duration,
            frequency: item?.frequency,
            required: item?.required,
            breakup: item?.breakup,
            description: item?.description,
        };
    });

    // Excel
    const fileName = "UserMaintenancePanel -Pending";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "UserMaintenancePanel -Pending",
        pageStyle: "print",
    });

    const columns = [
        { title: "S.NO", field: "serialNumber" },
        { title: "Task Status", field: "taskstatus" },
        { title: "Task Date", field: "taskassigneddate" },
        { title: "Task Time", field: "tasktime" },
        { title: "Priority", field: "priority" },
        { title: "Task Details", field: "taskdetails" },
        { title: "Frequency", field: "frequency" },
        { title: "Schedule", field: "schedule" },
        { title: "Task", field: "assetmaterial" },
        { title: "Duration", field: "duration" },
        { title: "Break Up", field: "breakup" },
        { title: "Required", field: 'required' },

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
            body: rowDataTable,
        });
        doc.save("UserMaintenancePanel -Pending.pdf");
    };

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
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
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


    const ButtonCheckStatus = async (e) => {
        e.preventDefault()
        setBtnSubmit(true)
        let ans = [];
        userPostCall.forEach((employeeName) => {
            CheckExtraTasksSchedule.forEach((category) => {
                ans.push({
                    assetmaterial: category.assetmaterial,
                    employeename: employeeName,
                    priority: category.priority,
                    timetodo: category?.timetodo?.length > 0 ? category?.timetodo : [],
                    monthdate: category?.timetodo ? category.monthdate : "",
                    weekdays: category?.weekdays?.length > 0 ? category?.weekdays : [],
                    annumonth: category.annuday ? category.annuday : "",
                    annuday: category.annumonth ? category.annumonth : "",
                    schedule: String(category.schedule),
                    frequency: String(category.frequency),
                    taskassign: String(category.taskassign),
                    assignId: String(category._id),
                    duration: String(category.duration),
                    breakupcount: String(category.breakupcount),
                    breakup: category?.breakup,
                    required: category?.required,
                    description: category?.description ? category?.description : "",
                    documentfiles: category?.documentfiles ? category?.documentfiles : "",
                    orginalid: category?._id ? category?._id : category?.orginalid,
                    taskstatus: "Assigned",

                });
            });
        });

        await ClickButtonToShowDate(ans)
        await ListPageLoad();
        await fetchAllRaisedTickets();
    }

    const ClickButtonToShowDate = async (ans) => {

        try {
            const split = calculatedTime?.split("-")
            const shiftEndTime = addFutureTimeToCurrentTime(split[1])

            const answer = ans?.map((data) => {
                axios.post(
                    `${SERVICE.CREATE_TASKMAINTENACEFORUSER}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        assetmaterial: String(data.assetmaterial),
                        timetodo: data?.timetodo?.length > 0 ? data?.timetodo : [],
                        monthdate: data?.timetodo ? data.monthdate : "",
                        weekdays: data?.weekdays?.length > 0 ? data?.weekdays : [],
                        annumonth: data.annuday ? data.annuday : "",
                        annuday: data.annumonth ? data.annumonth : "",
                        schedule: String(data.schedule),
                        username: data?.employeename,
                        frequency: String(data.frequency),
                        taskdate: moment(new Date()).format("DD-MM-YYYY"),
                        priority: String(data.priority),
                        duration: String(data.duration),
                        orginalid: data.orginalid,
                        taskassign: String(data.taskassign),
                        assignId: String(data.assignId),
                        breakupcount: String(data.breakupcount),
                        breakup: data?.breakup,
                        required: data?.required,
                        description: data?.description,
                        documentfiles: data?.documentfiles,
                        taskstatus: "Assigned",
                        created: new Date(),
                        taskdetails: "schedule",
                        shiftEndTime: shiftEndTime,
                        taskassigneddate: moment(new Date()).format("DD-MM-YYYY")
                    }
                );
            });

            const answerNonSchedule = ExtraNonScheduleTasks?.length > 0 && ExtraNonScheduleTasks?.map((data) => {
                axios.post(
                    `${SERVICE.CREATE_TASKMAINTENACEFORUSER}`,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        assetmaterial: String(data.assetmaterial),
                        username: data?.username,
                        frequency: "",
                        description: "",
                        duration: String(data.duration),
                        orginalid: data.orginalid,
                        taskdate: moment(data?.taskdate).format("YYYY-MM-DD"),
                        tasktime: String(data.tasktime),
                        breakupcount: String(data.breakupcount),
                        breakup: data?.breakup,
                        schedule: String(data.schedule),
                        required: data?.required,
                        priority: String(data.priority),
                        taskstatus: "Assigned",
                        created: new Date(),
                        taskdetails: data?.taskdetails,
                        shiftEndTime: shiftEndTime,
                        taskassigneddate: moment(new Date()).format("DD-MM-YYYY")
                    }
                );

            })
            await ListPageLoad();
            await fetchAllRaisedTickets();
            setBtnSubmit(false)
        } catch (err) { console.log(err, "error45"); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }

    const ListPageLoad = async () => {
        setPageName(!pageName)
        try {
            let res_tasks = await axios.post(SERVICE.ALL_SORTED_TASKMAINTENACEFORUSER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                username: isUserRoleAccess?.companyname,
                date: moment(new Date()).format("YYYY-MM-DD"),
                todaysDate: new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).split('/').join('-')
            });
            setRaiseTicketList(res_tasks?.data?.sortedTasks?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: item._id,
                taskstatus: item.taskstatus,
                taskassigneddate: item.taskassigneddate,
                priority: item.priority,
                assetmaterial: item.assetmaterial,
                tasktime: item?.taskdetails === "nonschedule" ? item.schedule === "Any Time" ? "" : convertTimeToAMPMFormat(item.tasktime) : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
                frequency: item.frequency,
                taskdetails: item.taskdetails,
                schedule: item.schedule,
                duration: item.duration,
                type: item.type,
                required: item?.required?.map((t, i) => `${i + 1 + ". "}` + t).toString(),
                breakup: item?.breakup,
                description: item?.description ? convertToNumberedList(item?.description) : "",
            })));
            setFiltercompleted('completed');
            setQueueCheck(true);
            await fetchAllRaisedTickets();
        } catch (err) { console.log(err, "error8585"); setQueueCheck(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        ListPageLoad()
    }, [])

    const backPage = useNavigate();
    const handleRedirectAddPage = () => {
        backPage("/task/taskmanualcreation");
    }

    // console.log(isUserRoleCompare, "rle")

    return (
        <Box>
            <Headtitle title={"USER MAINTENANCE PANEL "} />
            <PageHeading
                title="User Maintenance Panel"
                modulename="Asset"
                submodulename="Maintenance"
                mainpagename="Task Maintenace User Panel"
                subpagename=""
                subsubpagename=""
            />

            {!queueCheck ? (
                <Box sx={userStyle.container}>
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </Box>
            ) : (
                <>
                    {isUserRoleCompare?.includes("ltaskmaintenaceuserpanel") && (
                        <>
                            <Box sx={userStyle.dialogbox}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}

                                <Grid container spacing={2}>
                                    <Grid item md={10} xs={12} sm={12}>
                                        <Typography sx={userStyle.SubHeaderText}>User Maintenance Panel  - <b style={{ backgroundColor: 'red', color: "white" }}>Pending Tasks</b></Typography>

                                    </Grid>
                                </Grid>

                                <Grid container sx={{ justifyContent: "center" }}>
                                    <Grid>
                                        {isUserRoleCompare?.includes("exceltaskmaintenaceuserpanel") && (
                                            <>
                                                {/* <ExportXL csvData={rowDataTable.map((item, index) => {
                                                return {
                                                    serialNumber: item.serialNumber,
                                                    TaskStatus: item.taskstatus,
                                                    TaskDate: item.taskassigneddate,
                                                    TaskTime: item.tasktime,
                                                    Priority: item.priority,
                                                    TaskDetails: item.taskdetails,
                                                    frequency: item.frequency,
                                                    schedule: item.schedule,
                                                    Task: item.assetmaterial,
                                                    duration: item.duration,
                                                    required: item?.required,
                                                    breakup: item?.breakup,
                                                    description: item.description,
                                                };
                                            })} fileName={fileName} /> */}
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
                                        {isUserRoleCompare?.includes("csvtaskmaintenaceuserpanel") && (
                                            <>
                                                {/* <ExportCSV csvData={rowDataTable.map((item, index) => {
                                                return {
                                                    serialNumber: item.serialNumber,
                                                    TaskStatus: item.taskstatus,
                                                    TaskDate: item.taskassigneddate,
                                                    TaskTime: item.tasktime,
                                                    Priority: item.priority,
                                                    TaskDetails: item.taskdetails,
                                                    frequency: item.frequency,
                                                    schedule: item.schedule,
                                                    Task: item.assetmaterial,
                                                    duration: item.duration,
                                                    required: item?.required,
                                                    breakup: item?.breakup,
                                                    description: item.description,
                                                };
                                            })} fileName={fileName} /> */}
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
                                        {isUserRoleCompare?.includes("printtaskmaintenaceuserpanel") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdftaskmaintenaceuserpanel") && (
                                            <>
                                                {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button> */}
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
                                        {isUserRoleCompare?.includes("imagetaskmaintenaceuserpanel") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                                {/* ****** Table Grid Container ****** */}
                                <Grid style={userStyle.dataTablestyle}>
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
                                            <MenuItem value={raiseTicketList?.length}>All</MenuItem>
                                        </Select>
                                    </Box>
                                    <Box>
                                        <AggregatedSearchBar
                                            columnDataTable={columnDataTable}
                                            setItems={setItems}
                                            addSerialNumber={addSerialNumber}
                                            setPage={setPage}
                                            maindatas={raiseTicketList}
                                            setSearchedString={setSearchedString}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            paginated={false}
                                            totalDatas={raiseTicketList}
                                        />
                                    </Box>
                                </Grid>
                                <Button
                                    sx={userStyle.buttongrp}
                                    onClick={() => {
                                        handleShowAllColumns();
                                        setColumnVisibility(initialColumnVisibility);
                                    }}
                                >
                                    Show All Columns
                                </Button>
                                &emsp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                    Manage Columns
                                </Button>{" "}
                                &emsp;
                                {CheckExtraTasksAdded?.length > 0 ?
                                    <LoadingButton
                                        sx={{
                                            ...userStyle.buttonedit,
                                            marginLeft: "10px",
                                        }}
                                        variant="contained"
                                        loading={btnSubmit}
                                        style={{ minWidth: "0px" }}
                                        onClick={(e) =>
                                            ButtonCheckStatus(e)
                                        }
                                    >
                                        Click To Show Tasks
                                    </LoadingButton>
                                    : ""}
                                <br />
                                <br />
                                {/* ****** Table start ****** */}


                                <Box style={{ width: "100%", overflowY: "hidden" }}>
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
                                            // totalDatas={totalDatas}
                                            searchQuery={searchedString}
                                            handleShowAllColumns={handleShowAllColumns}
                                            setFilteredRowData={setFilteredRowData}
                                            filteredRowData={filteredRowData}
                                            setFilteredChanges={setFilteredChanges}
                                            filteredChanges={filteredChanges}
                                            gridRefTableImg={gridRefTableImg}
                                            itemsList={raiseTicketList}
                                        />
                                    </>
                                </Box>
                            </Box>
                            <br />
                            <Box sx={userStyle.container}>
                                <TaskMaintenanceForUserOnProgress com={filtercompleted} />

                            </Box>
                            <br />
                            <Box sx={userStyle.container}>
                                <TaskMaintenanceForUserCompleted com={filtercompleted} />
                            </Box>

                            {/* ****** Table End ****** */}
                            <TableContainer component={Paper} sx={userStyle.printcls}>
                                <Table aria-label="customized table" id="raisetickets" ref={componentRef}>
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell>S.No</StyledTableCell>
                                            <StyledTableCell>Task Status</StyledTableCell>
                                            <StyledTableCell>Task Date</StyledTableCell>
                                            <StyledTableCell>Task Time</StyledTableCell>
                                            <StyledTableCell>Priority</StyledTableCell>
                                            <StyledTableCell>Task Details</StyledTableCell>
                                            <StyledTableCell>Frequency</StyledTableCell>
                                            <StyledTableCell>Schedule</StyledTableCell>
                                            <StyledTableCell>Task</StyledTableCell>
                                            <StyledTableCell>Duration</StyledTableCell>
                                            <StyledTableCell>Required</StyledTableCell>
                                            <StyledTableCell>Break Up</StyledTableCell>

                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData?.length > 0 ? (
                                            filteredData?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                                    <StyledTableCell>{row.taskstatus}</StyledTableCell>
                                                    <StyledTableCell>{row.taskassigneddate}</StyledTableCell>
                                                    <StyledTableCell>{row.tasktime}</StyledTableCell>
                                                    <StyledTableCell>{row.priority}</StyledTableCell>
                                                    <StyledTableCell>{row.taskdetails}</StyledTableCell>
                                                    <StyledTableCell>{row.frequency}</StyledTableCell>
                                                    <StyledTableCell>{row.schedule}</StyledTableCell>
                                                    <StyledTableCell>{row.assetmaterial}</StyledTableCell>
                                                    <StyledTableCell>{row.duration}</StyledTableCell>
                                                    <StyledTableCell>{row.required}</StyledTableCell>
                                                    <StyledTableCell>{row.breakup}</StyledTableCell>

                                                </StyledTableRow>
                                            ))
                                        ) : (
                                            <StyledTableRow>
                                                {" "}
                                                <StyledTableCell colSpan={7} align="center">
                                                    No Data Available
                                                </StyledTableCell>{" "}
                                            </StyledTableRow>
                                        )}
                                        <StyledTableRow></StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

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
                        </>
                    )}
                </>
            )}

            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>UserMaintenancePanel Info</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                                                    <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
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

            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={raiseTicketList ?? []}
                filename={"UserMaintenancePanel -Pending"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />




            <br />
            <br />
        </Box>
    );
}

export default TaskMaintenaceForUser;