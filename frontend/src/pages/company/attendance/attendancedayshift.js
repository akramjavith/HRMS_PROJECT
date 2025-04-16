import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import { MultiSelect } from "react-multi-select-component";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent,
    DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import StyledDataGrid from "../../../components/TableStyle";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import moment from 'moment';

function ProductionDayShiftAttendance() {

    const [loading, setLoading] = useState(false)
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    // get current year
    const currentYear = new Date().getFullYear();

    // get current month in string name
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthObject = { label: monthstring[currentMonthIndex], value: currentMonthIndex + 1 };
    const currentYearObject = { label: currentYear, value: currentYear };
    const years = Array.from(new Array(10), (val, index) => currentYear - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

    const gridRef = useRef(null);
    const { isUserRoleCompare, isAssignBranch, allTeam } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [userShifts, setUserShifts] = useState([]);
    const [items, setItems] = useState([]);
    const [attStatus, setAttStatus] = useState([]);
    const [attModearr, setAttModearr] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const [filterUser, setFilterUser] = useState({
        fromdate: today,
        todate: today,
    });


    const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
    const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
    const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);
    const [selectedTeamFrom, setSelectedTeamFrom] = useState([]);
    const [selectedEmployeeFrom, setSelectedEmployeeFrom] = useState([]);

    //Company multiselect dropdown changes
    const handleCompanyChangeFrom = (options) => {
        setSelectedCompanyFrom(options);
        setSelectedBranchFrom([]);
        setSelectedUnitFrom([]);
        setSelectedTeamFrom([])
        setSelectedEmployeeFrom([]);
    };
    const customValueRendererCompanyFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Company";
    };

    //branch multiselect dropdown changes
    const handleBranchChangeFrom = (options) => {
        setSelectedBranchFrom(options);
        setSelectedUnitFrom([]);
        setSelectedTeamFrom([])
        setSelectedEmployeeFrom([]);
    };
    const customValueRendererBranchFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    //unit multiselect dropdown changes
    const handleUnitChangeFrom = (options) => {
        setSelectedUnitFrom(options);
        setSelectedTeamFrom([]);
        setSelectedEmployeeFrom([]);
    };
    const customValueRendererUnitFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };

    //Team multiselect dropdown changes
    const handleTeamChangeFrom = (options) => {
        setSelectedTeamFrom(options);
        setSelectedEmployeeFrom([]);
    };
    const customValueRendererTeamFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };

    //employee multiselect dropdown changes
    const handleEmployeeChangeFrom = (options) => {
        setSelectedEmployeeFrom(options)
    };
    const customValueRendererEmployeeFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Employee";
    };


    //get all months
    const months = [
        { value: 1, label: "January", },
        { value: 2, label: "February", },
        { value: 3, label: "March", },
        { value: 4, label: "April", },
        { value: 5, label: "May", },
        { value: 6, label: "June", },
        { value: 7, label: "July", },
        { value: 8, label: "August", },
        { value: 9, label: "September", },
        { value: 10, label: "October", },
        { value: 11, label: "November", },
        { value: 12, label: "December" },
    ];

    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    // page refersh reload
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

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQueryManage, setSearchQueryManage] = useState("");
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
        checkbox: true,
        serialNumber: true,
        empcode: true,
        prodshift: true,
        prodstartdate: true,
        prodstarttime: true,
        prodenddate: true,
        prodendtime: true,
        nextshift: true,
        username: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        date: true,
        shiftmode: true,
        shift: true,
        clockin: true,
        clockout: true,
        clockinstatus: true,
        clockoutstatus: true,
        attendanceauto: true,
        daystatus: true,
        appliedthrough: true,
        lopcalculation: true,
        modetarget: true,
        paidpresent: true,
        lopday: true,
        paidpresentday: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const [allEmp, setAllEmp] = useState([])
    const fetchAllEmployee = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.USER_X_EMPLOYEES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAllEmp(res_vendor?.data?.users);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    useEffect(() => {
        fetchAllEmployee()
    }, [])


    useEffect(() => {
        // Remove duplicates based on the 'company' field
        const uniqueIsAssignBranch = isAssignBranch.reduce((acc, current) => {
            const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
            if (!x) {
                acc.push(current);
            }
            return acc;
        }, []);

        // Remove duplicates based on the 'teamname' field
        const uniqueAllTeam = allTeam.reduce((acc, current) => {
            const x = acc.find(item => item.teamname === current.teamname);
            if (!x) {
                acc.push(current);
            }
            return acc;
        }, []);

        const company = [...new Set(uniqueIsAssignBranch.map(data => data.company))].map((data) => ({
            label: data,
            value: data,
        }));
        setSelectedCompanyFrom(company);

        const branch = uniqueIsAssignBranch?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company)
        )?.map(data => ({
            label: data.branch,
            value: data.branch,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedBranchFrom(branch);

        const unit = uniqueIsAssignBranch?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch)
        )?.map(data => ({
            label: data.unit,
            value: data.unit,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedUnitFrom(unit);

        const team = uniqueAllTeam?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch) && unit?.map(comp => comp.value === val.unit)
        )?.map(data => ({
            label: data.teamname,
            value: data.teamname,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedTeamFrom(team);
    }, [isAssignBranch, allTeam])

    //get all Sub vendormasters.
    const fetchAttedanceStatus = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setAttStatus(res_vendor?.data?.attendancestatus);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    //get all Attendance Status name.
    const fetchAttMode = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAttModearr(res_freq?.data?.allattmodestatus);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchAttedanceStatus();
        fetchAttMode();
    }, []);


    // get week for month's start to end
    function getWeekNumberInMonth(date) {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

        // If the first day of the month is not Monday (1), calculate the adjustment
        const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        // Calculate the day of the month adjusted for the starting day of the week
        const dayOfMonthAdjusted = date.getDate() + adjustment;

        // Calculate the week number based on the adjusted day of the month
        const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

        return weekNumber;
    }


    const fetchFilteredUsersStatus = async () => {
        setItems([]);
        setLoading(true)

        let startMonthDate = new Date(filterUser.fromdate);

        const currentDate = new Date(filterUser.todate);
        const nextDay = new Date(currentDate);
        nextDay.setDate(currentDate.getDate() + 1);
        let endMonthDate = new Date(nextDay);

        const daysArray = [];
        while (startMonthDate <= endMonthDate) {
            const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
            const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
            const dayCount = startMonthDate.getDate();
            const shiftMode = 'Main Shift';
            const weekNumberInMonth = (getWeekNumberInMonth(startMonthDate) === 1 ? `${getWeekNumberInMonth(startMonthDate)}st Week` :
                getWeekNumberInMonth(startMonthDate) === 2 ? `${getWeekNumberInMonth(startMonthDate)}nd Week` :
                    getWeekNumberInMonth(startMonthDate) === 3 ? `${getWeekNumberInMonth(startMonthDate)}rd Week` :
                        getWeekNumberInMonth(startMonthDate) > 3 ? `${getWeekNumberInMonth(startMonthDate)}th Week` : '')

            daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

            // Move to the next day
            startMonthDate.setDate(startMonthDate.getDate() + 1);
        }

        try {
            let res = await axios.post(SERVICE.USER_PRODUCTION_DAY_SHIFT_ATTENDANCE_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: selectedCompanyFrom.map(d => d.value),
                branch: selectedBranchFrom.map(d => d.value),
                unit: selectedUnitFrom.map(d => d.value),
                team: selectedTeamFrom.map(d => d.value),
                empname: selectedEmployeeFrom.map(d => d.value),
                userDates: daysArray,

                fromdate: filterUser.fromdate,
                todate: filterUser.todate,
            });

            // Parse the date string (DD/MM/YYYY)
            const currentDate = new Date(filterUser.todate);
            const currdate = new Date(currentDate);
            // Add one day
            currdate.setDate(currdate.getDate() + 1);

            // Format the new date as DD/MM/YYYY
            const newDay = String(currdate.getDate()).padStart(2, '0');
            const newMonth = String(currdate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const newYear = currdate.getFullYear();

            const nextDateFormatted = `${newDay}/${newMonth}/${newYear}`;

            let reasonDateFilteredData = res?.data?.finaluser.filter(d => {
                const [day, month, year] = d.rowformattedDate.split("/");
                const formattedDate = new Date(`${year}-${month}-${day}`);

                const reasonDate = new Date(d.reasondate);
                const dojDate = new Date(d.doj);
                if (d.reasondate && d.reasondate != "") {
                    return (
                        formattedDate <= reasonDate
                    )
                }
                else if (d.doj && d.doj != "") {
                    return (
                        formattedDate >= dojDate
                    )
                }
                else {
                    return d
                }
            })

            let filtered = reasonDateFilteredData.filter(d => d.rowformattedDate != nextDateFormatted);

            let res_vendor = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let attendancecontrol = res_vendor?.data?.attendancecontrolcriteria;
            const itemsWithSerialNumber = filtered?.map((item, index) => {
                // Parse the date string (DD/MM/YYYY)
                const [day, month, year] = item.rowformattedDate.split('/').map(Number);
                const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

                // Add one day
                date.setDate(date.getDate() + 1);

                // Format the new date as DD/MM/YYYY
                const newDay = String(date.getDate()).padStart(2, '0');
                const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
                const newYear = date.getFullYear();

                const nextDateFormatted = `${newDay}/${newMonth}/${newYear}`;

                let userShiftTimingsFrom = { date: item.rowformattedDate, shifttiming: item.shift }
                let userShiftTimingsFromTwo = { date: nextDateFormatted, shifttiming: item.shift }
                let userShiftTimingsTo = { date: nextDateFormatted, shifttiming: item.nextshift }
                let userShiftTimingsBefore = { date: item.rowformattedDate, shifttiming: item.nextshift }

                const currentShift = userShiftTimingsFrom;
                const currentShiftTwo = userShiftTimingsFromTwo;
                const nextShift = userShiftTimingsTo;
                const nextShiftBefor = userShiftTimingsBefore;


                function padTime(time) {
                    let [hours, minutes] = time.split(':');
                    if (hours.length === 1) {
                        hours = '0' + hours;
                    }
                    return `${hours}:${minutes}`;
                }


                // Helper function to parse date and time from shift objects
                function parseFromDateTimeEnd(shift) {
                    const [day, month, year] = shift.date.split('/');
                    // const timeString = shift.shifttiming.split('to')[0].trim();
                    let timeString = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" ? ("00:00AMto00:00AM").split('to')[1].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off") ? shift.shifttiming.split('to')[1].trim() : ("00:00AMto11:59PM").split('to')[1].trim());
                    let timeStringFrom = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" ? ("00:00AMto00:00AM").split('to')[0].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off") ? shift.shifttiming.split('to')[0].trim() : ("00:00AMto11:59PM").split('to')[0].trim());

                    // Normalize time separators (replace dots with colons)
                    timeString = timeString.replace('.', ':');
                    timeStringFrom = timeStringFrom.replace('.', ':');

                    // Handle missing leading zeros in hour values
                    timeString = padTime(timeString);
                    timeStringFrom = padTime(timeStringFrom);


                    let [hours, minutes] = timeString.slice(0, -2).split(':');
                    let [hoursFrom, minutesFrom] = timeStringFrom.slice(0, -2).split(':');

                    const period = timeString.slice(-2);
                    const periodFrom = timeStringFrom.slice(-2);

                    if (period === 'PM' && hours !== '12') {
                        hours = parseInt(hours, 10) + 12;
                    } else if (period === 'AM' && hours === '12') {
                        hours = '00';
                    }

                    const dateTimeString = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
                    // return new Date(dateTimeString);
                    // let newTime = new Date(dateTimeString.getTime() - 4 * 60 * 60 * 1000);

                    if (periodFrom === 'PM' && hoursFrom !== '12') {
                        dateTimeString.setDate(dateTimeString.getDate() + 1);
                    }

                    //from time
                    let newTime = new Date(dateTimeString.getTime() + Number(attendancecontrol.clockout) * 60 * 60 * 1000);

                    // console.log(newTime.toISOString());
                    return (newTime.toISOString());
                }
                // Parse initial date and time from current shift
                const shiftEndTime = currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" ? parseFromDateTimeEnd(currentShift) : "";


                // Helper function to parse date and time from shift objects
                function parseFromDateTime(shift) {
                    const [day, month, year] = shift.date.split('/');
                    // const timeString = shift.shifttiming.split('to')[0].trim();
                    let timeString = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" ? ("00:00AMto00:00AM").split('to')[0].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off") ? shift.shifttiming.split('to')[0].trim() : ("00:00AMto11:59PM").split('to')[0].trim());

                    // Normalize time separators (replace dots with colons)
                    timeString = timeString.replace('.', ':');

                    // Handle missing leading zeros in hour values
                    timeString = padTime(timeString);


                    let [hours, minutes] = timeString.slice(0, -2).split(':');
                    const period = timeString.slice(-2);

                    if (period === 'PM' && hours !== '12') {
                        hours = parseInt(hours, 10) + 12;
                    } else if (period === 'AM' && hours === '12') {
                        hours = '00';
                    }

                    const dateTimeString = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
                    // return new Date(dateTimeString);
                    // let newTime = new Date(dateTimeString.getTime() - 4 * 60 * 60 * 1000);

                    //from time
                    let newTime = new Date(dateTimeString.getTime() - Number(attendancecontrol.clockin) * 60 * 60 * 1000);

                    // console.log(newTime.toISOString());
                    return (newTime.toISOString());
                }
                // Parse initial date and time from current shift
                const shiftFromTime = currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" ? parseFromDateTime(currentShift) : "";

                return {
                    ...item,
                    prodshift: currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" ? `${shiftFromTime.split(".000Z")[0]}to${shiftEndTime.split(".000Z")[0]}` : ""
                };
            });

            setUserShifts(itemsWithSerialNumber);
            setLoading(false);
        } catch (err) { setLoading(false); console.log(err, "errorororo"); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCompanyFrom.length === 0) {
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
        } else if (selectedBranchFrom.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Branch"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (selectedUnitFrom.length === 0) {
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
        } else if (selectedTeamFrom.length === 0) {
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
        } else if (selectedEmployeeFrom.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Employeename"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (filterUser.fromdate === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select FromDate"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (filterUser.todate === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select ToDate"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            fetchFilteredUsersStatus();
        }

    };

    const handleClear = async (e) => {
        e.preventDefault();
        setSelectedCompanyFrom([]);
        setSelectedBranchFrom([]);
        setSelectedUnitFrom([]);
        setSelectedTeamFrom([]);
        setSelectedEmployeeFrom([]);

        setFilterUser({
            ...filterUser,
            fromdate: today,
            todate: today,
        });
        setUserShifts([]);

    }

    const addSerialNumber = async () => {

        function convertTo12HourFormatWithSeconds(time) {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            const isPM = hours >= 12;
            const convertedHours = hours % 12 || 12; // Convert to 12-hour format
            const formattedTime = ` ${convertedHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
            return formattedTime;
        }


        // const time12 = convertTo12HourFormat(time24);

        const itemsWithSerialNumber = userShifts.map((item, index) => {
            const fromtodate = item.prodshift ? item.prodshift.split("to") : "";
            const fromdate = fromtodate ? fromtodate[0].split("T")[0] : "";
            const fromtime = fromtodate ? fromtodate[0].split("T")[1] : "";

            const enddate = fromtodate ? fromtodate[1].split("T")[0] : "";
            const endtime = fromtodate ? fromtodate[1].split("T")[1] : "";

            return {
                ...item,
                serialNumber: index + 1,
                prodstartdate: item.prodshift !== "" ? moment(fromdate).format("DD/MM/YYYY") : "",
                prodstarttime: item.prodshift !== "" ? convertTo12HourFormatWithSeconds(fromtime) : "",
                prodenddate: item.prodshift !== "" ? moment(enddate).format("DD/MM/YYYY") : "",
                prodendtime: item.prodshift !== "" ? convertTo12HourFormatWithSeconds(endtime) : "",

            }
        });
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [userShifts]);

    const columnDataTable = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 110, hide: !columnVisibility.empcode, headerClassName: "bold-header", },
        { field: "username", headerName: "Employee Name", flex: 0, width: 130, hide: !columnVisibility.username, headerClassName: "bold-header", },
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibility.company, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 90, hide: !columnVisibility.unit, headerClassName: "bold-header", },
        { field: "team", headerName: "Team", flex: 0, width: 90, hide: !columnVisibility.team, headerClassName: "bold-header", },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibility.department, headerClassName: "bold-header", },
        { field: "date", headerName: "Date", flex: 0, width: 100, hide: !columnVisibility.date, headerClassName: "bold-header", },
        { field: "shift", headerName: "Shift", flex: 0, width: 150, hide: !columnVisibility.shift, headerClassName: "bold-header", },
        { field: "prodstartdate", headerName: "Production Shift Start Date", flex: 0, width: 220, hide: !columnVisibility.prodstartdate, headerClassName: "bold-header", },
        { field: "prodstarttime", headerName: "Production Shift Start Time", flex: 0, width: 220, hide: !columnVisibility.prodstarttime, headerClassName: "bold-header", },
        { field: "prodenddate", headerName: "Production Shift End Date", flex: 0, width: 220, hide: !columnVisibility.prodenddate, headerClassName: "bold-header", },
        { field: "prodendtime", headerName: "Production Shift End Time", flex: 0, width: 220, hide: !columnVisibility.prodendtime, headerClassName: "bold-header", },
    ]

    const rowDataTable = items?.flatMap((item, index) => {
        return {
            id: item.id,
            uniqueid: item.id,
            userid: item.userid,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            nextshift: item.nextshift,
            department: item.department,
            username: item.username,
            empcode: item.empcode,
            weekoff: item.weekoff,
            boardingLog: item.boardingLog,
            shiftallot: item.shiftallot,
            shift: item.shift,
            date: item.date,
            shiftmode: item.shiftMode,
            prodshift: item.prodshift,
            prodstartdate: item.prodstartdate,
            prodstarttime: item.prodstarttime,
            prodenddate: item.prodenddate,
            prodendtime: item.prodendtime,
        };
    });

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
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term    
    const filteredDatas = rowDataTable?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    const rowsWithCheckboxes = filteredData.map((row) => ({
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

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);

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
            </Box> <br /> <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }} >
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
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}> {" "} Show All </Button>
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
                            }}>
                            {" "}Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Excel
    const fileName = "Attendance Shift Report";
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

    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                filteredData?.map((t, index) => ({
                    'SNo': index + 1,
                    'Emp Code': t.empcode,
                    'Employee Name': t.username,
                    'Company': t.company,
                    'Branch': t.branch,
                    'Unit': t.unit,
                    'Team': t.team,
                    'Department': t.department,
                    'Date': t.date,

                    'Shift': t.shift,
                    "Production Shift Start Date": t.prodstartdate,
                    "Production Shift Start Time": t.prodstarttime,
                    "Production Shift End Date": t.prodenddate,
                    "Production Shift End Time": t.prodendtime

                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                rowDataTable.map((t, index) => ({
                    'SNo': index + 1,
                    'Emp Code': t.empcode,
                    'Employee Name': t.username,
                    'Company': t.company,
                    'Branch': t.branch,
                    'Unit': t.unit,
                    'Team': t.team,
                    'Department': t.department,
                    'Date': t.date,
                    'Shift': t.shift,
                    "Production Shift Start Date": t.prodstartdate,
                    "Production Shift Start Time": t.prodstarttime,
                    "Production Shift End Date": t.prodenddate,
                    "Production Shift End Time": t.prodendtime

                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Attendance Shift Report",
        pageStyle: "print",
    });

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF({ oriantation: 'landscape' });

        const headers = ["SNo", "Emp Code", "Employee Name", "Company", "Branch", "Unit", "Team", "Department",
            "Date", "Shift", "Production Shift Start Date", "Production Shift Start Time",
            "Production Shift End Date", "Production Shift End Time"
        ];

        let data = [];
        // Add a serial number to each row
        if (isfilter === "filtered") {
            data = filteredData.map((item, index) => {
                return [
                    index + 1,
                    item.empcode,
                    item.username,
                    item.company,
                    item.branch,
                    item.unit,
                    item.team,
                    item.department,
                    item.date,
                    item.shift,
                    item.prodstartdate,
                    item.prodstarttime,
                    item.prodenddate,
                    item.prodendtime,
                ]
            })
        }
        else {
            data = rowDataTable.map((item, index) => {
                return [
                    index + 1,
                    item.empcode,
                    item.username,
                    item.company,
                    item.branch,
                    item.unit,
                    item.team,
                    item.department,
                    item.date,
                    item.shift,
                    item.prodstartdate,
                    item.prodstarttime,
                    item.prodenddate,
                    item.prodendtime,

                ]
            })
        }

        const maxColumnsPerPage = 15; // Maximum number of columns per page
        const totalPages = Math.ceil(headers.length / maxColumnsPerPage); // Calculate total pages needed

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const startIdx = (currentPage - 1) * maxColumnsPerPage;
            const endIdx = Math.min(startIdx + maxColumnsPerPage, headers.length);

            const currentPageColumns = headers.slice(startIdx, endIdx);

            doc.autoTable({
                theme: "grid",
                styles: {
                    fontSize: 5,
                },
                columns: currentPageColumns,
                body: data,
            });

            if (currentPage < totalPages) {
                doc.addPage(); // Add a new page if there are more columns to display
            }
        }

        doc.save("Attendance Shift Report.pdf");
    };

    // image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Attendance Shift Report.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"Attendance Shift Report"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Attendance Shift Report</Typography>
            {isUserRoleCompare?.includes("lattendancedayshift") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch?.map(data => ({
                                                label: data.company,
                                                value: data.company,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            styles={colourStyles}
                                            value={selectedCompanyFrom}
                                            onChange={handleCompanyChangeFrom}
                                            valueRenderer={customValueRendererCompanyFrom}
                                            labelledBy="Please Select Company"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    selectedCompanyFrom.map(d => d.value).includes(comp.company)
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedBranchFrom}
                                            onChange={handleBranchChangeFrom}
                                            valueRenderer={customValueRendererBranchFrom}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={isAssignBranch?.filter(
                                                (comp) =>
                                                    selectedCompanyFrom.map(d => d.value).includes(comp.company) &&
                                                    selectedBranchFrom
                                                        .map((item) => item.value)
                                                        .includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedUnitFrom}
                                            onChange={handleUnitChangeFrom}
                                            valueRenderer={customValueRendererUnitFrom}
                                            labelledBy="Please Select Unit"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Team<b style={{ color: "red" }}>*</b>
                                        </Typography>

                                        <MultiSelect
                                            options={allTeam?.filter(
                                                (comp) =>
                                                    selectedCompanyFrom.map(d => d.value).includes(comp.company) &&
                                                    selectedBranchFrom
                                                        .map((item) => item.value)
                                                        .includes(comp.branch) && selectedUnitFrom
                                                            .map((item) => item.value)
                                                            .includes(comp.unit)
                                            )?.map(data => ({
                                                label: data.teamname,
                                                value: data.teamname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedTeamFrom}
                                            onChange={handleTeamChangeFrom}
                                            valueRenderer={customValueRendererTeamFrom}
                                            labelledBy="Please Select Team"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee Name<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            options={
                                                allEmp
                                                    ?.filter(
                                                        (comp) =>
                                                            selectedCompanyFrom.map(d => d.value).includes(comp.company) &&
                                                            selectedBranchFrom
                                                                .map((item) => item.value)
                                                                .includes(comp.branch) &&
                                                            selectedUnitFrom
                                                                .map((item) => item.value)
                                                                .includes(comp.unit) &&
                                                            selectedTeamFrom
                                                                .map((item) => item.value)
                                                                .includes(comp.team)
                                                    )
                                                    ?.map((com) => ({
                                                        ...com,
                                                        label: com.companyname,
                                                        value: com.companyname,
                                                    }))}
                                            value={selectedEmployeeFrom}
                                            onChange={handleEmployeeChangeFrom}
                                            valueRenderer={customValueRendererEmployeeFrom}
                                            labelledBy="Please Select Employeename"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={filterUser.fromdate}
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                // Ensure that the selected date is not in the future
                                                const currentDate = new Date().toISOString().split("T")[0];
                                                if (selectedDate <= currentDate) {
                                                    setFilterUser({ ...filterUser, fromdate: selectedDate, todate: selectedDate });
                                                } else {
                                                    // Handle the case where the selected date is in the future (optional)
                                                    // You may choose to show a message or take other actions.
                                                }
                                            }}
                                            // Set the max attribute to the current date
                                            inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>{" "} To Date<b style={{ color: "red" }}>*</b>{" "}</Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={filterUser.todate}
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                // Ensure that the selected date is not in the future
                                                const currentDate = new Date().toISOString().split("T")[0];
                                                const fromdateval = filterUser.fromdate != "" && new Date(filterUser.fromdate).toISOString().split("T")[0];
                                                if (filterUser.fromdate == "") {
                                                    setShowAlert(
                                                        <>
                                                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{`Please Select From date`}</p>
                                                        </>
                                                    );
                                                    handleClickOpenerr();
                                                } else if (selectedDate < fromdateval) {
                                                    setFilterUser({ ...filterUser, todate: "" });
                                                    setShowAlert(
                                                        <>
                                                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                                                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{`To Date should be after or equal to From Date`}</p>
                                                        </>
                                                    );
                                                    handleClickOpenerr();
                                                } else if (selectedDate <= currentDate) {
                                                    setFilterUser({ ...filterUser, todate: selectedDate });
                                                } else {
                                                }
                                            }}
                                            // Set the max attribute to the current date
                                            inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        </Grid><br /><br /><br />
                        <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button sx={userStyle.buttonadd} variant="contained" onClick={(e) => handleSubmit(e)} > Filter </Button>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Button sx={userStyle.btncancel} onClick={handleClear} > Clear </Button>
                            </Grid>
                        </Grid>
                    </Box><br /><br />
                    {/* ****** Table Start ****** */}

                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}> Attendance Shift Report </Typography>
                        </Grid>
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
                                        {/* <MenuItem value={rowDataTable?.length}>  All </MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                                <Box>
                                    {isUserRoleCompare?.includes("excelattendancedayshift") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                // fetchUsersStatus()
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvattendancedayshift") && (
                                        <>

                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                // fetchUsersStatus()
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printattendancedayshift") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfattendancedayshift") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageattendancedayshift") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp; </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12}>
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
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button> &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}> Manage Columns  </Button>  <br />  <br />
                        {loading ? (
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

                                <Box style={{ width: "100%", overflowY: "hidden", }} >
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
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing{" "}
                                        {filteredDatas.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                        {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                        {filteredDatas?.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn} > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}  >  <NavigateBeforeIcon /> </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}  > {pageNumber}  </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn} > <LastPageIcon /> </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* ****** Table End ****** */}
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

            {/* Print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Emp Code</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Shift</TableCell>
                            <TableCell>Production Shift Start Date</TableCell>
                            <TableCell>Production Shift Start Time</TableCell>
                            <TableCell>Production Shift End Date</TableCell>
                            <TableCell>Production Shift End Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredData &&
                            filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.serialNumber}</TableCell>
                                    <TableCell>{row.empcode}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.shift}</TableCell>
                                    <TableCell>{row.prodstartdate}</TableCell>
                                    <TableCell>{row.prodstarttime}</TableCell>
                                    <TableCell>{row.prodenddate}</TableCell>
                                    <TableCell>{row.prodendtime}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>


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

                    {fileFormat === 'xl' ?
                        <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
                        : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
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
                            // fetchUsersStatus()
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

            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }} >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)", }} onClick={handleCloseerr} >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default ProductionDayShiftAttendance;