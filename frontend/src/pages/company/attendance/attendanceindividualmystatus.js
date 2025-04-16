import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem,
    ListItemText, Popover, TextField, IconButton,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import StyledDataGrid from "../../../components/TableStyle";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
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

function AttendanceIndividualMyStatus() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    var newtoday = dd + '/' + mm + '/' + yyyy

    // get current year
    const currentYear = new Date().getFullYear();

    // get current month in string name
    const monthstring = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
    ];
    const currentMonthIndex = new Date().getMonth();
    const years = Array.from(new Array(10), (val, index) => currentYear - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

    const gridRef = useRef(null);
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [attStatus, setAttStatus] = useState([]);
    const [userShifts, setUserShifts] = useState([]);
    const [items, setItems] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);

    const [filterUser, setFilterUser] = useState({
        fromdate: "",
        todate: "",
    });

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
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

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
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        department: true,
        empcode: true,
        shift: true,
        clockin: true,
        clockout: true,
        clockinstatus: true,
        clockoutstatus: true,
        date: true,
        bookby: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );


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

    useEffect(() => {
        fetchAttedanceStatus();
    }, [])


    const getattendancestatus = (alldata) => {
        let result = attStatus.filter((data, index) => {
            return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
        })

        return result[0]?.name
    }

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
        setLoader(false);

        let startMonthDate = new Date(filterUser.fromdate);
        let endMonthDate = new Date(filterUser.todate);

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
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_MYINDVL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                username: isUserRoleAccess?.companyname,
                empcode: isUserRoleAccess?.empcode,
            });

            let filtered = res?.data?.finaluser.filter(d => {
                const [day, month, year] = d.rowformattedDate.split("/");
                const formattedDate = new Date(`${year}-${month}-${day}`);

                const dojDate = new Date(d.doj);
                if (d.doj && d.doj != "") {
                    return (
                        formattedDate >= dojDate
                    )
                }
                else {
                    return d
                }
            })

            const result = filtered.filter((item) => item !== null);
            setUserShifts(result);
            setLoader(true);
        } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchFilteredUsersStatusForExports = async () => {
        let startMonthDate = new Date(filterUser.fromdate);
        let endMonthDate = new Date(filterUser.todate);

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
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_MYINDVL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userDates: daysArray,
                username: isUserRoleAccess?.companyname,
                empcode: isUserRoleAccess?.empcode,
            });

            let filtered = res?.data?.finaluser.filter(d => {
                const [day, month, year] = d.rowformattedDate.split("/");
                const formattedDate = new Date(`${year}-${month}-${day}`);

                const dojDate = new Date(d.doj);
                if (d.doj && d.doj != "") {
                    return (
                        formattedDate >= dojDate
                    )
                }
                else {
                    return d
                }
            })

            const result = filtered.filter((item) => item !== null);
            setUserShifts(result);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (filterUser.fromdate == "" && filterUser.todate == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select From/TO Date"} </p>
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
        setFilterUser({
            fromdate: "",
            todate: "",
        });
        setUserShifts([]);
        setItems([]);
        setPage(1);
        setShowAlert(
            <>
                <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "#7ac767" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    };

    //serial no for listing items
    const addSerialNumber = async () => {
        if (!userShifts || userShifts.length === 0) {
            console.log("User shifts data is empty or undefined.");
            return;
        }

        let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            status: String("Approved"),
        });

        let leaveresult = res_applyleave?.data?.applyleaves;

        let countByEmpcodeClockin = {}; // Object to store count for each empcode
        let countByEmpcodeClockout = {};

        const itemsWithSerialNumber = userShifts?.map((item, index) => {
            // Initialize count for empcode if not already present
            if (!countByEmpcodeClockin[item.empcode]) {
                countByEmpcodeClockin[item.empcode] = 1;
            }
            if (!countByEmpcodeClockout[item.empcode]) {
                countByEmpcodeClockout[item.empcode] = 1;
            }

            // Adjust clockinstatus based on lateclockincount
            let updatedClockInStatus = item.clockinstatus;
            // Adjust clockoutstatus based on earlyclockoutcount
            let updatedClockOutStatus = item.clockoutstatus;

            // Filter out only 'Absent' items for the current employee
            const absentItems = userShifts?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

            // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
            if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
                // Define the date format for comparison
                const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

                const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

                if (isPreviousDayLeave) {
                    updatedClockInStatus = 'BeforeWeekOffLeave';
                    updatedClockOutStatus = 'BeforeWeekOffLeave';
                }
                if (isPreviousDayAbsent) {
                    updatedClockInStatus = 'BeforeWeekOffAbsent';
                    updatedClockOutStatus = 'BeforeWeekOffAbsent';
                }
                if (isNextDayLeave) {
                    updatedClockInStatus = 'AfterWeekOffLeave';
                    updatedClockOutStatus = 'AfterWeekOffLeave';
                }
                if (isNextDayAbsent) {
                    updatedClockInStatus = 'AfterWeekOffAbsent';
                    updatedClockOutStatus = 'AfterWeekOffAbsent';
                }
            }

            // Check if 'Late - ClockIn' count exceeds the specified limit
            if (updatedClockInStatus === 'Late - ClockIn') {
                updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
            }
            // Check if 'Early - ClockOut' count exceeds the specified limit
            if (updatedClockOutStatus === 'Early - ClockOut') {
                updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
            }

            return {
                ...item,
                serialNumber: index + 1,
                clockinstatus: updatedClockInStatus,
                clockoutstatus: updatedClockOutStatus,
            };
        });
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [userShifts]);

    const columnDataTable = [

        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibility.date, headerClassName: "bold-header", },
        { field: "shift", headerName: "Shift", flex: 0, width: 200, hide: !columnVisibility.shift, headerClassName: "bold-header", },
        { field: "clockin", headerName: "ClockIn", flex: 0, width: 120, hide: !columnVisibility.clockin, headerClassName: "bold-header", },
        {
            field: "clockinstatus", headerName: "ClockInStatus", flex: 0, width: 230, hide: !columnVisibility.clockinstatus, headerClassName: "bold-header",
            renderCell: (params) => {
                return (
                    <TableCell>
                        <Button size="small"
                            sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.575rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: params.row.clockinstatus === 'BeforeWeekOffAbsent' ? '3px 5px' : '3px 8px',
                                cursor: 'default',
                                color: (params.row.clockinstatus === 'Present' || params.row.clockinstatus === 'Early - ClockIn') ? 'black' : params.row.clockinstatus === 'Holiday' ? 'black' : params.row.clockinstatus === 'Leave' ? 'white' : params.row.clockinstatus === 'Absent' ? '#462929' : params.row.clockinstatus === 'Week Off' ? 'white' : params.row.clockinstatus === 'Grace - ClockIn' ? '#052106' : params.row.clockinstatus === 'On - Present' ? 'black' : params.row.clockinstatus === 'HBLOP' ? 'white' : params.row.clockinstatus === 'FLOP' ? 'white' : params.row.clockinstatus === 'AfterWeekOffAbsent' ? 'black' : params.row.clockinstatus === 'BeforeWeekOffAbsent' ? 'black' : params.row.clockinstatus === 'Late - ClockIn' ? '#15111d' : '#15111d',
                                backgroundColor: (params.row.clockinstatus === 'Present' || params.row.clockinstatus === 'Early - ClockIn') ? 'rgb(156 239 156)' : params.row.clockinstatus === 'Holiday' ? '#B6FFFA' : params.row.clockinstatus === 'Leave' ? '#1640D6' : params.row.clockinstatus === "Absent" ? '#ff00007d' : params.row.clockinstatus === 'Week Off' ? '#6b777991' : params.row.clockinstatus === 'Grace - ClockIn' ? 'rgb(243 203 117)' : params.row.clockinstatus === 'On - Present' ? '#E1AFD1' : params.row.clockinstatus === 'HBLOP' ? '#DA0C81' : params.row.clockinstatus === 'FLOP' ? '#FE0000' : params.row.clockinstatus === 'AfterWeekOffAbsent' ? '#F2D1D1' : params.row.clockinstatus === 'BeforeWeekOffAbsent' ? '#EEE3CB' : params.row.clockinstatus === 'Late - ClockIn' ? '#610c9f57' : '#610c9f57',
                                '&:hover': {
                                    color: (params.row.clockinstatus === 'Present' || params.row.clockinstatus === 'Early - ClockIn') ? 'black' : params.row.clockinstatus === 'Holiday' ? 'black' : params.row.clockinstatus === 'Leave' ? 'white' : params.row.clockinstatus === 'Absent' ? '#462929' : params.row.clockinstatus === 'Week Off' ? 'white' : params.row.clockinstatus === 'Grace - ClockIn' ? '#052106' : params.row.clockinstatus === 'On - Present' ? 'black' : params.row.clockinstatus === 'HBLOP' ? 'white' : params.row.clockinstatus === 'FLOP' ? 'white' : params.row.clockinstatus === 'AfterWeekOffAbsent' ? 'black' : params.row.clockinstatus === 'BeforeWeekOffAbsent' ? 'black' : params.row.clockinstatus === 'Late - ClockIn' ? '#15111d' : '#15111d',
                                    backgroundColor: (params.row.clockinstatus === 'Present' || params.row.clockinstatus === 'Early - ClockIn') ? 'rgb(156 239 156)' : params.row.clockinstatus === 'Holiday' ? '#B6FFFA' : params.row.clockinstatus === 'Leave' ? '#1640D6' : params.row.clockinstatus === "Absent" ? '#ff00007d' : params.row.clockinstatus === 'Week Off' ? '#6b777991' : params.row.clockinstatus === 'Grace - ClockIn' ? 'rgb(243 203 117)' : params.row.clockinstatus === 'On - Present' ? '#E1AFD1' : params.row.clockinstatus === 'HBLOP' ? '#DA0C81' : params.row.clockinstatus === 'FLOP' ? '#FE0000' : params.row.clockinstatus === 'AfterWeekOffAbsent' ? '#F2D1D1' : params.row.clockinstatus === 'BeforeWeekOffAbsent' ? '#EEE3CB' : params.row.clockinstatus === 'Late - ClockIn' ? '#610c9f57' : '#610c9f57',
                                }
                            }}
                        >
                            {params.row.clockinstatus}
                        </Button>
                    </TableCell >
                );
            },
        },
        { field: "clockout", headerName: "ClockOut", flex: 0, width: 120, hide: !columnVisibility.clockout, headerClassName: "bold-header", },
        {
            field: "clockoutstatus", headerName: "ClockOutStatus", flex: 0, width: 230, hide: !columnVisibility.clockoutstatus, headerClassName: "bold-header",
            renderCell: (params) => {
                return (
                    <TableCell>
                        <Button size="small"
                            sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.575rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: params.row.clockoutstatus === 'BeforeWeekOffAbsent' ? '3px 5px' : '3px 8px',
                                cursor: 'default',
                                color: params.row.clockoutstatus === 'Holiday' ? 'black' : params.row.clockoutstatus === 'Leave' ? 'white' : params.row.clockoutstatus === 'Absent' ? '#462929' : params.row.clockoutstatus === 'Week Off' ? 'white' : params.row.clockoutstatus === 'On - ClockOut' ? 'black' : params.row.clockoutstatus === 'Over - ClockOut' ? '#052106' : params.row.clockoutstatus === 'Mis - ClockOut' ? '#15111d' : params.row.clockoutstatus === 'Early - ClockOut' ? '#052106' : params.row.clockoutstatus === 'HBLOP' ? 'white' : params.row.clockoutstatus === 'FLOP' ? 'white' : params.row.clockoutstatus === 'AfterWeekOffAbsent' ? 'black' : params.row.clockoutstatus === 'BeforeWeekOffAbsent' ? 'black' : params.row.clockoutstatus === 'Pending' ? '#052106' : '#052106',
                                backgroundColor: params.row.clockoutstatus === 'Holiday' ? '#B6FFFA' : params.row.clockoutstatus === 'Leave' ? '#1640D6' : params.row.clockoutstatus === "Absent" ? '#ff00007d' : params.row.clockoutstatus === 'Week Off' ? '#6b777991' : params.row.clockoutstatus === 'On - ClockOut' ? '#E1AFD1' : params.row.clockoutstatus === 'Over - ClockOut' ? 'rgb(156 239 156)' : params.row.clockoutstatus === 'Mis - ClockOut' ? '#610c9f57' : params.row.clockoutstatus === 'Early - ClockOut' ? 'rgb(243 203 117)' : params.row.clockoutstatus === 'HBLOP' ? '#DA0C81' : params.row.clockoutstatus === 'FLOP' ? '#FE0000' : params.row.clockoutstatus === 'AfterWeekOffAbsent' ? '#F2D1D1' : params.row.clockoutstatus === 'BeforeWeekOffAbsent' ? '#EEE3CB' : params.row.clockoutstatus === 'Pending' ? 'rgb(243 203 117)' : 'rgb(243 203 117)',
                                '&:hover': {
                                    color: params.row.clockoutstatus === 'Holiday' ? 'black' : params.row.clockoutstatus === 'Leave' ? 'white' : params.row.clockoutstatus === 'Absent' ? '#462929' : params.row.clockoutstatus === 'Week Off' ? 'white' : params.row.clockoutstatus === 'On - ClockOut' ? 'black' : params.row.clockoutstatus === 'Over - ClockOut' ? '#052106' : params.row.clockoutstatus === 'Mis - ClockOut' ? '#15111d' : params.row.clockoutstatus === 'Early - ClockOut' ? '#052106' : params.row.clockoutstatus === 'HBLOP' ? 'white' : params.row.clockoutstatus === 'FLOP' ? 'white' : params.row.clockoutstatus === 'AfterWeekOffAbsent' ? 'black' : params.row.clockoutstatus === 'BeforeWeekOffAbsent' ? 'black' : params.row.clockoutstatus === 'Pending' ? '#052106' : '#052106',
                                    backgroundColor: params.row.clockoutstatus === 'Holiday' ? '#B6FFFA' : params.row.clockoutstatus === 'Leave' ? '#1640D6' : params.row.clockoutstatus === "Absent" ? '#ff00007d' : params.row.clockoutstatus === 'Week Off' ? '#6b777991' : params.row.clockoutstatus === 'On - ClockOut' ? '#E1AFD1' : params.row.clockoutstatus === 'Over - ClockOut' ? 'rgb(156 239 156)' : params.row.clockoutstatus === 'Mis - ClockOut' ? '#610c9f57' : params.row.clockoutstatus === 'Early - ClockOut' ? 'rgb(243 203 117)' : params.row.clockoutstatus === 'HBLOP' ? '#DA0C81' : params.row.clockoutstatus === 'FLOP' ? '#FE0000' : params.row.clockoutstatus === 'AfterWeekOffAbsent' ? '#F2D1D1' : params.row.clockoutstatus === 'BeforeWeekOffAbsent' ? '#EEE3CB' : params.row.clockoutstatus === 'Pending' ? 'rgb(243 203 117)' : 'rgb(243 203 117)',
                                }
                            }}
                        >
                            {params.row.clockoutstatus}
                        </Button>
                    </TableCell >
                );
            },
        },
        {
            field: "bookby", headerName: "Day Status", flex: 0, width: 230, hide: !columnVisibility.bookby, headerClassName: "bold-header",
            renderCell: (params) => {
                return (
                    <TableCell>
                        <Button size="small"
                            sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.575rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                cursor: 'default',
                                color: '#052106',
                                backgroundColor: 'rgb(156 239 156)',
                                '&:hover': { backgroundColor: 'rgb(156 239 156)', color: '#052106', }
                            }}
                        >
                            {params.row.bookby}
                        </Button>
                    </TableCell >
                );
            },
        },

    ];
    const rowDataTable = items?.flatMap((item, index) => {
        return {
            id: item.id,
            userid: item.userid,
            serialNumber: item.serialNumber,
            username: item.username,
            rowusername: item.rowusername,
            empcode: item.empcode,
            shift: item.shift,
            date: item.date,
            clockin: item.clockin,
            clockinstatus: item.clockinstatus,
            lateclockincount: item.lateclockincount,
            earlyclockoutcount: item.earlyclockoutcount,
            clockout: item.clockout,
            clockoutstatus: item.clockoutstatus,
            bookby: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
        };
    });

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
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = rowDataTable?.filter((item) => {
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
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
            </Box>{" "}
            <br /> <br />
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
                            {" "}
                            Show All{" "}
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

    // Excel 
    const fileName = "My Attendance Status";
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
                    "S.No": index + 1,
                    "Date": t.date,
                    'Shift': t.shift,
                    'ClockIn': t.clockin,
                    'ClockInStatus': t.clockinstatus,
                    'ClockOut': t.clockout,
                    'ClockOutStatus': t.clockoutstatus,
                    "Day Status": t.bookby,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                rowDataTable.map((t, index) => ({
                    "S.No": index + 1,
                    "Date": t.date,
                    'Shift': t.shift,
                    'ClockIn': t.clockin,
                    'ClockInStatus': t.clockinstatus,
                    'ClockOut': t.clockout,
                    'ClockOutStatus': t.clockoutstatus,
                    "Day Status": t.bookby,
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
        documentTitle: "My Attendance Status",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Date", field: "date" },
        { title: "Shift", field: "shift" },
        { title: "ClockIn", field: "clockin" },
        { title: "ClockInStatus", field: "clockinstatus" },
        { title: "ClockOut", field: "clockout" },
        { title: "ClockOutStatus", field: "clockoutstatus" },
        { title: "Day Status", field: "bookby" },
    ];

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            filteredData.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("My Attendance Status.pdf");
    };

    // image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "My Attendance Status.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"My Attendance Status"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>
                My Attendance Status
            </Typography>
            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid container spacing={2}>
                        <>
                            <Grid item md={3} xs={12} sm={12}>
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
                                                console.log("Please select a date on or before today.");
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
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
                                                console.log("Please select a date on or before today.");
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
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
                            <Button sx={userStyle.buttonadd} variant="contained" onClick={handleSubmit}  > {" "} Filter{" "} </Button>
                        </Grid>
                        <Grid item lg={1} md={2} sm={2} xs={12}>
                            <Button sx={userStyle.btncancel} onClick={handleClear}>
                                {" "}
                                Clear{" "}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <br />
                <br />
                {/* ****** Table Start ****** */}
                {!loader ? (
                    <Box sx={userStyle.container}>
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
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>
                                    {" "}
                                    My Attendance Status{" "}
                                </Typography>
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
                                            {/* <MenuItem value={rowDataTable?.length}>All</MenuItem> */}
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
                                        {isUserRoleCompare?.includes(
                                            "excelmyattendancestatus"
                                        ) && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        setFormat("xl")
                                                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "csvmyattendancestatus"
                                        ) && (
                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        setFormat("csv")
                                                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "printmyattendancestatus"
                                        ) && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                        {" "}
                                                        &ensp; <FaPrint /> &ensp;Print&ensp;{" "}
                                                    </Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "pdfmyattendancestatus"
                                        ) && (
                                                <>
                                                    <Button sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpen(true)
                                                        }}
                                                    ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes(
                                            "imagemyattendancestatus"
                                        ) && (
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
                            </Grid>{" "}
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                {" "}
                                Show All Columns{" "}
                            </Button>{" "}
                            &ensp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                {" "}
                                Manage Columns{" "}
                            </Button>{" "}
                            <br /> <br />
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
                                    {filteredDatas.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                    {Math.min(page * pageSize, filteredDatas?.length)} of{" "}
                                    {filteredDatas?.length} entries
                                </Box>
                                <Box>
                                    <Button
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        {" "}
                                        <FirstPageIcon />{" "}
                                    </Button>
                                    <Button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        {" "}
                                        <NavigateBeforeIcon />{" "}
                                    </Button>
                                    {pageNumbers?.map((pageNumber) => (
                                        <Button
                                            key={pageNumber}
                                            sx={userStyle.paginationbtn}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={page === pageNumber ? "active" : ""}
                                            disabled={page === pageNumber}
                                        >
                                            {" "}
                                            {pageNumber}{" "}
                                        </Button>
                                    ))}
                                    {lastVisiblePage < totalPages && <span>...</span>}
                                    <Button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        {" "}
                                        <NavigateNextIcon />{" "}
                                    </Button>
                                    <Button
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        {" "}
                                        <LastPageIcon />{" "}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}
                {/* ****** Table End ****** */}
            </>

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
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRef}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Shift</TableCell>
                            <TableCell>ClockIn</TableCell>
                            <TableCell>ClockInStatus</TableCell>
                            <TableCell>ClockOut</TableCell>
                            <TableCell>ClockOutStatus</TableCell>
                            <TableCell>Day Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredData &&
                            filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.serialNumber}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.shift}</TableCell>
                                    <TableCell>{row.clockin}</TableCell>
                                    <TableCell>{row.clockinstatus}</TableCell>
                                    <TableCell>{row.clockout}</TableCell>
                                    <TableCell>{row.clockoutstatus}</TableCell>
                                    <TableCell>{row.bookby}</TableCell>
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
                            // fetchFilteredUsersStatusForExports()
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

        </Box>
    );
}

export default AttendanceIndividualMyStatus;