import React, { useState, useEffect, useRef, useContext } from "react";
import { TextField, IconButton, ListItem, List, Checkbox, ListItemText, Popover, Box, Typography, OutlinedInput, TableBody, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, FaEdit, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import StyledDataGrid from "../../../components/TableStyle";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function TrainingUserAllocation() {
    const [raiseTicketList, setRaiseTicketList] = useState([]);
    const [openPageList, setOpenPageList] = useState("");
    const [closedPageList, setClosedPageList] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridRef = useRef(null);
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
    const [IP, setIP] = useState("");
    const accessbranch = isAssignBranch?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));
    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd
    const [dateManual, setDateManual] = useState(formattedDate);
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

    const [weekOffShow, setWeekOffShow] = useState(true);
    const [holidayShow, setHolidayShow] = useState(true);



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

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

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

    const fetchUsers = async () => {
        try {
            let res_status = await axios.post(SERVICE.ALL_HOLIDAY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                assignbranch: accessbranch,
            });
            const holidayDate = res_status?.data?.holiday.filter((data, index) => {
                return (
                    data.company.includes(isUserRoleAccess.company) &&
                    data.unit.includes(isUserRoleAccess.unit) &&
                    data.team.includes(isUserRoleAccess.team) &&
                    data.employee.includes(isUserRoleAccess.companyname) &&
                    data.applicablefor.includes(isUserRoleAccess.branch)
                );
            });

            const daysOfWeek = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];

            const currDate = new Date();
            const currDay = currDate.getDay();
            const currDayName = daysOfWeek[currDay];

            if (
                holidayDate?.some(
                    (item) =>
                        moment(item.date).format("DD-MM-YYYY") ==
                        moment(currDate).format("DD-MM-YYYY")
                )
            ) {
                setHolidayShow(false);
            }

            if (isUserRoleAccess?.weekoff.includes(currDayName)) {
                setWeekOffShow(false);
            }

            let res_shift = await axios.get(SERVICE.SHIFT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // await fetchOverAllSettings();

            let resultshiftallot = [];
            isUserRoleAccess?.shiftallot?.length > 0 &&
                isUserRoleAccess?.shiftallot?.map((allot) => {
                    resultshiftallot.push({ ...allot });
                });

            let regularshift = "";
            res_shift?.data?.shifts?.map((d) => {
                if (d.name == isUserRoleAccess?.shifttiming) {
                    regularshift = `${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`;
                }
            });

            // get current date
            let currentday = String(checkCurrentDate.getDate()).padStart(2, "0");
            let currentmonth = String(checkCurrentDate.getMonth() + 1).padStart(
                2,
                "0"
            );
            let currentyear = checkCurrentDate.getFullYear();
            const formattedCurrentDate = `${currentday}/${currentmonth}/${currentyear}`;

            resultshiftallot &&
                resultshiftallot?.filter((value) => {
                    if (
                        ((value.adjustmentstatus === false && value.status === "Manual") ||
                            (value.adjustmentstatus === true &&
                                value.adjstatus === "Reject")) &&
                        formatDate(value.date) === formattedCurrentDate
                    ) {
                        const [day, month, year] = value?.date?.split("/").map(Number);
                        const adjustDate = new Date(year, month - 1, day);
                        const dayOfWeek = adjustDate.getDay();
                        const dayName = daysOfWeek[dayOfWeek];
                        if (isUserRoleAccess?.weekoff.includes(dayName)) {
                            setWeekOffShow(true);
                        }

                        if (
                            holidayDate?.some(
                                (item) =>
                                    moment(item.date).format("DD-MM-YYYY") ==
                                    moment(value?.date).format("DD-MM-YYYY")
                            )
                        ) {
                            setHolidayShow(true);
                        }

                        // if (formatDate(value.date) === formattedCurrentDate) {
                        setUserShiftDetails(value.firstshift);
                        updateTimeRange(value.firstshift);

                        // Send alloted shift endtime to the attandance's clockouttime
                        const manualShiftEndTime = value.firstshift.match(
                            /\b\d{2}:\d{2}[APMapm]{2}\b/g
                        );
                        const mandualEndTime = manualShiftEndTime
                            ? manualShiftEndTime[1]
                            : "";

                        if (mandualEndTime) {
                            const originalTime = mandualEndTime.slice(0, -2);
                            const period = mandualEndTime.slice(-2);

                            const [hours, minutes] = originalTime.split(":").map(Number);

                            // Format the new time manually
                            const formattedHours = hours >= 10 ? hours : "0" + hours;
                            const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
                                }${minutes}:00`;

                            setShiftTimings(`${newTime} ${period}`);
                        } else {
                        }
                        // }
                    } else if (
                        value.adjustmentstatus === true &&
                        value.adjstatus === "Approved" &&
                        value.adjdate === formattedCurrentDate
                    ) {
                        // if (value.adjdate === formattedCurrentDate) {
                        setUserShiftDetails(
                            value.adjustmenttype === "Change Shift"
                                ? value.adjchangeshiftime
                                : value.adjtypeshifttime
                        );

                        const [day, month, year] = value?.adjdate?.split("/").map(Number);
                        const adjustDate = new Date(year, month - 1, day);
                        const dayOfWeek = adjustDate.getDay();

                        const dayName = daysOfWeek[dayOfWeek];

                        if (isUserRoleAccess?.weekoff.includes(dayName)) {
                            setWeekOffShow(true);
                        }

                        if (
                            holidayDate?.some(
                                (item) =>
                                    moment(item.date).format("DD-MM-YYYY") ==
                                    moment(value?.date).format("DD-MM-YYYY")
                            )
                        ) {
                            setHolidayShow(true);
                        }


                        updateTimeRange(
                            value.adjustmenttype === "Change Shift"
                                ? value.adjchangeshiftime
                                : value.adjtypeshifttime
                        );
                        const getshifts =
                            value.adjustmenttype === "Change Shift"
                                ? value.adjchangeshiftime
                                : value.adjtypeshifttime;

                        // Send approved shift endtime to the attandance's clockouttime
                        const manualShiftEndTime = getshifts.match(
                            /\b\d{2}:\d{2}[APMapm]{2}\b/g
                        );
                        const mandualEndTime = manualShiftEndTime
                            ? manualShiftEndTime[1]
                            : "";

                        if (mandualEndTime) {
                            const originalTime = mandualEndTime.slice(0, -2);
                            const period = mandualEndTime.slice(-2);

                            const [hours, minutes] = originalTime.split(":").map(Number);

                            // Format the new time manually
                            const formattedHours = hours >= 10 ? hours : "0" + hours;
                            const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
                                }${minutes}:00`;

                            setShiftTimings(`${newTime} ${period}`);
                        } else {

                        }
                        // }
                    } else if (
                        value.adjustmentstatus === undefined ||
                        value.date === undefined ||
                        value.adjdate === undefined ||
                        value.adjstatus === undefined
                    ) {
                        setUserShiftDetails(regularshift);
                        updateTimeRange(regularshift);

                        // Send approved shift endtime to the attandance's clockouttime
                        const regularShiftEndTime = regularshift?.match(
                            /\b\d{2}:\d{2}[APMapm]{2}\b/g
                        );
                        const regularEndTime = regularShiftEndTime
                            ? regularShiftEndTime[1]
                            : "";

                        if (regularEndTime) {
                            const originalTime = regularEndTime.slice(0, -2);
                            const period = regularEndTime.slice(-2);

                            const [hours, minutes] = originalTime.split(":").map(Number);

                            // Format the new time manually
                            const formattedHours = hours >= 10 ? hours : "0" + hours;
                            const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
                                }${minutes}:00`;

                            setShiftTimings(`${newTime} ${period}`);
                        } else {

                        }
                    }
                });
            if (resultshiftallot.length === 0) {
                setUserShiftDetails(regularshift);
                updateTimeRange(regularshift);
                // Send approved shift endtime to the attandance's clockouttime
                const regularShiftEndTime = regularshift?.match(
                    /\b\d{2}:\d{2}[APMapm]{2}\b/g
                );
                const regularEndTime = regularShiftEndTime
                    ? regularShiftEndTime[1]
                    : "";

                if (regularEndTime) {
                    const originalTime = regularEndTime.slice(0, -2);
                    const period = regularEndTime.slice(-2);

                    const [hours, minutes] = originalTime.split(":").map(Number);

                    // Format the new time manually
                    const formattedHours = hours >= 10 ? hours : "0" + hours;
                    const newTime = `${formattedHours}:${minutes < 10 ? "0" : ""
                        }${minutes}:00`;

                    setShiftTimings(`${newTime} ${period}`);
                } else {

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

    const convertTo24HourFormat = (time) => {
        let [hours, minutes] = time?.slice(0, -2).split(":");
        hours = parseInt(hours, 10);
        if (time.slice(-2) === "PM" && hours !== 12) {
            hours += 12;
        }
        return `${String(hours).padStart(2, "0")}:${minutes}`;
    };

    const updateTimeRange = async (e) => {
        const [startTimes, endTimes] = e.split(" - ");

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
        startHour -= startTime ? Number(startTime) : 0;
        endHour += endTime ? Number(endTime) : 0;

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
                    res?.data?.attendancecontrolcriteria.length - 1
                ]?.clockin
            );
            setEndTime(
                res?.data?.attendancecontrolcriteria[
                    res?.data?.attendancecontrolcriteria.length - 1
                ]?.clockout
            );
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

    const [userPostCall, setUsersPostCall] = useState([])

    //get all project.
    const fetchAllRaisedTickets = async (date) => {
        try {
            setQueueCheck(false)
            if (date === "") {
                setQueueCheck(false);
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Date"}</p>
                    </>
                );
                handleClickOpenerr();

            } else {
                setQueueCheck(true)
                let res_shift_User = await axios.get(SERVICE.SHIFT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                let res_Training = await axios.get(SERVICE.ALL_TRAININGDETAILS_DOCUMENT_ACTIVE, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });

                const shiftUser = res_shift_User?.data?.shifts?.find(item => item.name === isUserRoleAccess.shifttiming)



                let taskStatusDep = res_Training.data.trainingdetails.filter(data => {
                    if (data?.type === "Designation") {
                        return data.designation?.includes(isUserRoleAccess?.designation)
                            && (data.employeenames?.includes(isUserRoleAccess?.companyname) || data?.employeenames?.includes('ALL'))
                    }
                    if (data.type === "Department") {
                        return data.department?.includes(isUserRoleAccess?.department)
                            && (data.employeenames?.includes(isUserRoleAccess?.companyname) || data?.employeenames?.includes('ALL'))

                    }
                    if (data.type === "Employee") {
                        return data.company?.includes(isUserRoleAccess?.company) && data.branch?.includes(isUserRoleAccess?.branch) && data.unit?.includes(isUserRoleAccess?.unit) && data.team?.includes(isUserRoleAccess?.team)
                            && (data.employeenames?.includes(isUserRoleAccess?.companyname) || data?.employeenames?.includes('ALL'))
                    }
                })



                let userTaskDesignation = taskStatusDep?.length > 0 ? taskStatusDep?.flatMap(data => data.employeenames) : []

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
                const today = new Date(date);
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
                function addEstimationToDate(userDOJ, estimation) {
                    // Split estimation into value and unit
                    const [value, unit] = estimation.split("-");

                    // Parse the value as a number
                    const intValue = parseInt(value);

                    // Create a new Date object based on user's date of joining
                    const newUserDOJ = new Date(userDOJ);

                    // Add the specified duration
                    if (unit === "Month") {
                        newUserDOJ.setMonth(newUserDOJ.getMonth() + intValue);
                    } else if (unit === "Year") {
                        newUserDOJ.setFullYear(newUserDOJ.getFullYear() + intValue);
                    } else if (unit === "Days") {
                        newUserDOJ.setDate(newUserDOJ.getDate() + intValue);
                    }

                    return newUserDOJ;
                }
                const updatedArray = taskStatusDep?.length > 0 ? taskStatusDep.map(item2 => {
                    const matchingItem = taskStatusDep.find(item1 => {
                        if (item1?.type === "Designation") {
                            return item1?.designation?.includes(isUserRoleAccess?.designation) &&
                                (item1.employeenames?.includes(isUserRoleAccess?.companyname) || item1?.employeenames?.includes('ALL'))
                        }
                        if (item1?.type === "Department") {
                            return item1?.department?.includes(isUserRoleAccess?.department) &&
                                (item1.employeenames?.includes(isUserRoleAccess?.companyname) || item1?.employeenames?.includes('ALL'))
                        }
                        if (item1?.type === "Employee") {
                            return item1?.company?.includes(isUserRoleAccess?.company)
                                && item1?.branch?.includes(isUserRoleAccess?.branch) &&
                                item1?.unit?.includes(isUserRoleAccess?.unit) &&
                                item1?.team?.includes(isUserRoleAccess?.team) &&
                                (item1.employeenames?.includes(isUserRoleAccess?.companyname) || item1?.employeenames?.includes('ALL'))
                        }
                    })

                    if (matchingItem) {
                        const newDate = addEstimationToDate(isUserRoleAccess?.doj, `${item2.estimationtime}-${item2.estimation}`);
                        return { ...item2, dueDateCheck: new Date(date) >= newDate, dueFromdate: newDate.toDateString() };
                    }
                }) : [];
                let anstaskUserPanel = updatedArray?.length > 0 ? updatedArray?.filter(item => item !== undefined) : []

                const getNextDays = (currentDays) => {
                    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    return currentDays.map(currentDay => {
                        const currentDayIndex = daysOfWeek.indexOf(currentDay);
                        const nextDayIndex = (currentDayIndex + 1) % 7; // Ensure it wraps around to Sunday if needed
                        return daysOfWeek[nextDayIndex];
                    });
                };


                let priorityCheck = anstaskUserPanel?.length > 0 ? anstaskUserPanel?.filter((item) => {
                    if (item?.required === "Mandatory" && item.dueDateCheck && item.status === "Active") {
                        if (item?.frequency === "Daily" && holidayShow) {

                            //Shift Basis 
                            if (item?.schedule === "Time-Based") {

                                return item;

                            }
                            else if (item?.schedule === "Time-Based") {
                                return item;
                            }
                            //Anytime Basis 
                            else if (item?.schedule === "Any Time") {
                                return item;

                            }
                        }
                        if ((item?.frequency === "Day Wise" || item?.frequency === "Weekly" && holidayShow)) {
                            if (item?.schedule === "Time-Based") {
                                return item?.weekdays?.includes(dayOfWeek);

                            }
                            else if (item?.schedule === "Time-Based") {
                                const dayOfWeekTomorrow = getNextDays(item?.weekdays);
                                const ans = item?.weekdays?.push(...dayOfWeekTomorrow)
                                const nightDays = [dayOfWeek, ...dayOfWeekTomorrow]
                                return item?.weekdays?.includes(dayOfWeek);
                            }
                            //Anytime Basis s
                            else if (item?.schedule === "Any Time") {
                                const dayOfWeekTomorrow = getNextDays(item?.weekdays);
                                const ans = item?.weekdays?.push(...dayOfWeekTomorrow)
                                const nightDays = [dayOfWeek, ...dayOfWeekTomorrow]
                                return item?.weekdays?.includes(dayOfWeek);


                            }
                            else if (item?.schedule === "Any Time") {
                                const dayOfWeekTomorrow = getNextDays(item?.weekdays);
                                const ans = item?.weekdays?.push(...dayOfWeekTomorrow)
                                const nightDays = [dayOfWeek, ...dayOfWeekTomorrow]
                                return item?.weekdays?.includes(dayOfWeek);
                            }

                        }
                        if (item?.frequency === "Monthly" || item?.frequency === "Date Wise" && holidayShow) {
                            //Shift Basis 
                            if (item?.schedule === "Time-Based") {
                                const formattedDay = Number(currentDay) < 10 ? `0${currentDay}` : currentDay;
                                return item?.monthdate == formattedDay;

                            }
                            else if (item?.schedule === "Time-Based") {
                                const today = new Date(date);


                                const tomorrow = new Date(today);
                                tomorrow.setDate(today.getDate() - 1);
                                const tomorrowNight = new Date(tomorrow);
                                if (new Date(date).getDate() == Number(item?.monthdate)) {
                                    return item;

                                } else if (tomorrowNight.getDate() == Number(item?.monthdate)) {
                                    return item
                                }

                            }
                            //Anytime Basis 
                            else if (item?.schedule === "Any Time") {
                                const formattedDay = Number(currentDay) < 10 ? `0${currentDay}` : currentDay;
                                return item?.monthdate == formattedDay;

                            }
                            else if (item?.schedule === "Any Time") {
                                const today = new Date(date);
                                const tomorrow = new Date(today);
                                tomorrow.setDate(today.getDate() - 1);
                                const tomorrowNight = new Date(tomorrow);
                                if (new Date(date).getDate() == Number(item?.monthdate)) {
                                    return item;

                                } else if (tomorrowNight.getDate() == Number(item?.monthdate)) {
                                    return item
                                }

                            }
                        }
                        if (item?.frequency === "Annually" && holidayShow) {
                            //Shift Basis 
                            if (item?.schedule === "Time-Based") {
                                const formattedDay = Number(currentDay) < 10 ? `0${currentDay}` : currentDay;
                                const formattedMonth = Number(dayOfMonth) < 10 ? `0${dayOfMonth}` : dayOfMonth;
                                return Number(item?.annumonth) == Number(formattedMonth) && Number(item?.annuday) == Number(formattedDay);
                            }
                            else if (item?.schedule === "Time-Based") {

                                const today = new Date(date);

                                const tomorrow = new Date(today);
                                tomorrow.setDate(today.getDate() - 1);
                                const tomorrowNight = new Date(tomorrow);

                                if (new Date(date).getDate() == Number(item?.annuday) && new Date(date).getMonth() + 1 == Number(item?.annumonth)) {
                                    return item;

                                } else if (tomorrowNight.getDate() == Number(item?.annuday) && tomorrowNight.getMonth() + 1 == Number(item?.annumonth)) {
                                    return item
                                }

                            }
                            //Anytime Basis 
                            else if (item?.schedule === "Any Time") {
                                const formattedDay = Number(currentDay) < 10 ? `0${currentDay}` : currentDay;
                                const formattedMonth = Number(dayOfMonth) < 10 ? `0${dayOfMonth}` : dayOfMonth;
                                return Number(item?.annumonth) == Number(formattedMonth) && Number(item?.annuday) == Number(formattedDay);

                            }
                            else if (item?.schedule === "Any Time") {
                                const today = new Date(date);

                                const tomorrow = new Date(today);
                                tomorrow.setDate(today.getDate() - 1);
                                const tomorrowNight = new Date(tomorrow);

                                if (new Date(date).getDate() == Number(item?.annuday) && new Date(date).getMonth() + 1 == Number(item?.annumonth)) {
                                    return item;

                                } else if (tomorrowNight.getDate() == Number(item?.annuday) && tomorrowNight.getMonth() + 1 == Number(item?.annumonth)) {
                                    return item
                                }
                            }
                        }
                    } if (item?.required === "NonSchedule" && holidayShow && item.status === "Active") {
                        const NonSchedule = new Date(date);
                        const locateDateDead = new Date(item.deadlinedate);

                        return NonSchedule <= locateDateDead
                    }
                    if (item?.required === "Schedule" && holidayShow && item.status === "Active") {
                        const todayDateCheck = moment(new Date(date)).format("DD-MM-YYYY");
                        const locateDate = moment(new Date(item.date)).format("DD-MM-YYYY");
                        return todayDateCheck === locateDate

                    }


                }) : [];
                let final = priorityCheck.sort((a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]);
                let userCheck = await axios.get(SERVICE.ALL_TRAINING_FOR_USER, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
                let userStatus = final?.length > 0 ? final?.filter(item2 => {
                    const matchingItem = userCheck?.data?.trainingforuser?.find(data1 => data1?.username === isUserRoleAccess?.companyname && data1.status === "Active" && ["Completed", "Finished By Others", "Not Applicable to Me"]?.includes(data1?.taskstatus) && new Date(date) <= new Date(data1?.shiftEndTime))

                    if (matchingItem?.orginalid !== item2._id) {
                        return item2; // Include this item in the filtered array
                    }
                }) : [];



                const updatedAns1 = final.map(item => {
                    const matchingItem = res_Training?.data?.trainingdetails?.find(ansItem => ansItem._id === item._id);
                    if (matchingItem) {
                        return { ...item, weekdays: matchingItem.weekdays, };
                    }
                    return item;
                });

                let uniqueElements = updatedAns1?.filter(obj1 => {
                    return obj1.required === "Mandatory" ? !userCheck?.data?.trainingforuser?.some(obj2 =>
                        obj2.required?.includes(obj1.required)
                        && obj1.frequency === obj2.frequency
                        && obj1.schedule === obj2.schedule
                        && obj1.trainingdetails === obj2.trainingdetails
                        && obj2.username === isUserRoleAccess?.companyname
                        && new Date(date) <= new Date(obj2.shiftEndTime) && obj2?.taskdetails === "Mandatory")
                        :
                        !userCheck?.data?.trainingforuser?.some(obj2 =>
                            obj1.trainingdetails === obj2.trainingdetails
                            &&
                            obj2.required?.includes(obj1.required)
                            && obj2.username === isUserRoleAccess?.companyname
                            && new Date(date) <= new Date(obj2.shiftEndTime))
                }
                );


                // Split the time range into start and end times
                const [startTimeStr, endTimeStr] = userShiftDetails?.split(' - ');

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
                        const key = element?.trainingdetails + '-' + element?.frequency + '-' + element?.required;
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
                            const time = element.timetodo[0];

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


                // const closestFilter = answerClosest ? closestElements?.filter(data => data?.length > 0) : closestElements
                const closestFilter = answerClosest ? closestElements?.filter(data => data.length !== 0) : closestElements
                const removeDuplicates = (dataArray, filterArray) => {
                    return dataArray.filter(item => {
                        const found = filterArray.find(filterItem => (
                            filterItem?.required.includes(item?.required) &&
                            filterItem?.trainingdetails === item?.trainingdetails &&
                            filterItem?.frequency === item?.frequency &&
                            filterItem?.schedule === item?.schedule &&
                            moment(new Date(date)).format("DD-MM-YYYY") === filterItem.taskassigneddate
                        ));
                        return !found;
                    });
                };


                const RemoveDuplicateClosest = removeDuplicates(closestFilter, raiseTicketList);
                const removedLengthDuplicate = RemoveDuplicateClosest.filter(array => array.length > 0);
                const answerUnique = uniqueElements?.filter(data => data.schedule !== "Time-Based")
                const filterTimeTodo = [...RemoveDuplicateClosest, ...answerUnique]
                setQueueCheck(false)
                setRaiseTicketList(priorityCheck)
            }
        } catch (err) { setQueueCheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleClear = () => {
        setDateManual("")
        setRaiseTicketList([])
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully!"}</p>
            </>
        );
        handleClickOpenerr();
    }



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


    const getviewCode = async (e) => {
        try {
            let res = await axios.delete(`${SERVICE.RAISETICKET_SINGLE}/${singleDoc._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            handleCloseDelete();
            // await fetchAllRaisedTickets();
            setOpenPageList("changed")
            setClosedPageList("changed")
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        actions: true,
        taskstatus: true,
        status: true,
        checkbox: true,
        serialNumber: true,
        frequency: true,
        trainingdetails: true,
        schedule: true,
        tasktime: true,
        duration: true,
        type: true,

        required: true,
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
    const addSerialNumber = () => {
        const itemsWithSerialNumber = raiseTicketList?.map((item, index) => ({
            serialNumber: index + 1,
            id: item._id,
            trainingdetails: item.trainingdetails,
            status: item.status,
            tasktime: !item?.required?.includes("Mandatory") ? "" : item.schedule === "Any Time" ? "" : `${item?.timetodo[0]?.hour}:${item?.timetodo[0]?.min} ${item?.timetodo[0]?.timetype}`,
            frequency: item.frequency,

            schedule: item.schedule,
            duration: item.duration,
            type: item.type,
            required: item?.required,
            breakup: item?.breakup,
        }));

        setItems(itemsWithSerialNumber);
    };



    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    const [fileFormat, setFormat] = useState('')
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                filteredData?.map((item, index) => ({
                    "Sno": index + 1,
                    Trainingdetails: item.trainingdetails,
                    Status: item.status,
                    TrainingTime: item?.tasktime,
                    Frequency: item.frequency,
                    Schedule: item.schedule,
                    Duration: item.duration,
                    Required: item?.required,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items.map((item, index) => ({
                    "Sno": index + 1,
                    Trainingdetails: item.trainingdetails,
                    Status: item.status,
                    TrainingTime: item?.tasktime,
                    Frequency: item.frequency,
                    Schedule: item.schedule,
                    Duration: item.duration,
                    Required: item?.required,
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };



    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            filteredData.map(item => ({
                serialNumber: serialNumberCounter++,
                trainingdetails: item.trainingdetails,
                status: item.status,
                trainingtime: item?.tasktime,
                frequency: item.frequency,
                schedule: item.schedule,
                duration: item.duration,
                required: item?.required,
            })) :
            items?.map(item => ({
                serialNumber: serialNumberCounter++,
                trainingdetails: item.trainingdetails,
                status: item.status,
                trainingtime: item?.tasktime,
                frequency: item.frequency,
                schedule: item.schedule,
                duration: item.duration,
                required: item?.required,
            }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("TrainingUserAllocation.pdf");
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
            field: "trainingdetails",
            headerName: "Training Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.trainingdetails,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.status,
        },
        {
            field: "tasktime",
            headerName: "Training Time",
            flex: 0,
            width: 100,
            hide: !columnVisibility.tasktime,
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
            field: "duration",
            headerName: "Duration",
            flex: 0,
            width: 100,
            hide: !columnVisibility.duration,
        },
        {
            field: "required",
            headerName: "Required",
            flex: 0,
            width: 100,
            hide: !columnVisibility.required,
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
            trainingdetails: item.trainingdetails,
            status: item.status,
            tasktime: item?.tasktime,
            frequency: item.frequency,
            taskdetails: item.taskdetails,
            schedule: item.schedule,
            duration: item.duration,
            type: item.type,
            required: item?.required,
        };
    });

    // Excel
    const fileName = "TrainingUserAllocation";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "TrainingUserAllocation",
        pageStyle: "print",
    });

    const columns = [
        { title: "Training Name", field: "trainingdetails" },
        { title: "Status", field: "status" },
        { title: "Training Time", field: "trainingtime" },
        { title: "Frequency", field: "frequency" },
        { title: "Schedule", field: "schedule" },
        { title: "Duration", field: "duration" },
        { title: "Required", field: 'required' },
    ];



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
                    saveAs(blob, "TrainingUserAllocation.png");
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
            // await fetchAllRaisedTickets();
            handleCloseModcheckbox();
            setSelectedRows([]);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [copiedData, setCopiedData] = useState("");



    return (
        <Box>
            <Headtitle title={"USER TRAINING PANEL ALLOCATION"} />

            <>
                {isUserRoleCompare?.includes("ltrainingusersallocation") && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.SubHeaderText}>User Training Panel Allocations List</Typography>
                                </Grid>
                            </Grid>
                            <br></br><br></br><br></br>

                            <Grid container spacing={2}>
                                <Grid item md={3} xs={6} sm={6}></Grid>
                                <Grid item md={1.5} xs={6} sm={6}><Typography>Date : <b style={{ color: "red" }}>*</b></Typography></Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="date"
                                                value={dateManual}
                                                onChange={(e) => {
                                                    setDateManual(e.target?.value);
                                                }}
                                            />
                                        </FormControl>
                                    </Box>
                                </Grid>
                                {<Grid item md={3} sm={12} xs={12}>
                                    <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                        <Button variant="contained" sx={{ marginTop: "5px" }} onClick={() => fetchAllRaisedTickets(dateManual)}>
                                            Filter
                                        </Button>
                                        <Button sx={{ ...userStyle.btncancel, marginTop: "5px" }}
                                            onClick={() => { handleClear() }}
                                        >
                                            {" "}
                                            CLEAR
                                        </Button>
                                    </Grid>
                                </Grid>}
                            </Grid>
                            <br></br><br></br><br></br>

                            <Grid container sx={{ justifyContent: "center" }}>
                                <Grid>
                                    {isUserRoleCompare?.includes("exceltrainingusersallocation") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvtrainingusersallocation") && (

                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printtrainingusersallocation") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdftrainingusersallocation") && (

                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagetrainingusersallocation") && (
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
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
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
                            {/* ****** Table start ****** */}
                            {queueCheck ? (
                                <Box sx={userStyle.container}>
                                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </Box>
                            ) : (
                                <StyledDataGrid
                                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                    rows={rowsWithCheckboxes}
                                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                                    onSelectionModelChange={handleSelectionChange}
                                    selectionModel={selectedRows}
                                    autoHeight={true}
                                    ref={gridRef}
                                    density="compact"
                                    hideFooter
                                    getRowClassName={getRowClassName}
                                    disableRowSelectionOnClick
                                />
                            )}
                            <Box style={userStyle.dataTablestyle}>
                                <Box>
                                    Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                </Box>
                                <Box>
                                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                        <FirstPageIcon />
                                    </Button>
                                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                        <NavigateBeforeIcon />
                                    </Button>
                                    {pageNumbers?.map((pageNumber) => (
                                        <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                            {pageNumber}
                                        </Button>
                                    ))}
                                    {lastVisiblePage < totalPages && <span>...</span>}
                                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                        <NavigateNextIcon />
                                    </Button>
                                    <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                        <LastPageIcon />
                                    </Button>
                                </Box>
                            </Box>
                            {/* ****** Table End ****** */}
                        </Box>




                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="customized table" id="raisetickets" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }}>
                                    <StyledTableRow>
                                        <StyledTableCell>S.No</StyledTableCell>
                                        <StyledTableCell>Training Name</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
                                        <StyledTableCell>Training Time</StyledTableCell>
                                        <StyledTableCell>Frequency</StyledTableCell>
                                        <StyledTableCell>Schedule</StyledTableCell>
                                        <StyledTableCell>Duration</StyledTableCell>
                                        <StyledTableCell>Required</StyledTableCell>

                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData?.length > 0 ? (
                                        filteredData?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell>{row.trainingdetails}</StyledTableCell>
                                                <StyledTableCell>{row.status}</StyledTableCell>
                                                <StyledTableCell>{row.tasktime}</StyledTableCell>
                                                <StyledTableCell>{row.frequency}</StyledTableCell>
                                                <StyledTableCell>{row.schedule}</StyledTableCell>
                                                <StyledTableCell>{row.duration}</StyledTableCell>
                                                <StyledTableCell>{row.required}</StyledTableCell>

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


            <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>User Training Panel Info</Typography>
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

            {/*Export XL Data  */}
            <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
                    {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                        :
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                    }
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
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
                            downloadPdf("filtered")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall")
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
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
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={(e) => getviewCode()} autoFocus variant="contained" color="error">
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

export default TrainingUserAllocation;