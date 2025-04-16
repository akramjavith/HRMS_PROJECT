import React, { useState, useEffect, useContext, useRef } from "react";
import {
    Box, TableHead, TableContainer, Table,
    Dialog, FormControl, Divider,
    DialogContent,
    Button,
    Chip, List, ListItem, ListItemText,
    Avatar,
    DialogActions,
    DialogTitle,
    DialogContentText,
    Grid, TableBody, Paper,
    Typography,
    Tooltip,
} from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../components/Table";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { userStyle, colourStyles } from "../pageStyle";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { Link } from "react-router-dom";
import { handleApiError } from "../components/Errorhandling";
import { format, addDays, differenceInDays } from "date-fns";
import { UserRoleAccessContext, AuthContext } from "../context/Appcontext";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import BlockIcon from "@mui/icons-material/Block";
import WarningIcon from "@mui/icons-material/Warning";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import moment from "moment-timezone";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";


const HomeProduction = () => {

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


    const getattendancestatus = (alldata, attS) => {

        let result = attS.filter((data, index) => {

            return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
        })

        return result[0]?.name
    }

    const [loader, setLoader] = useState(false)


    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);

    let listpageaccessby =
        listPageAccessMode?.find(
            (data) =>
                data.modulename === "Production" &&
                data.submodulename === "Manual Entry" &&
                data.mainpagename === "Production Manual Entry Filter" &&
                data.subpagename === "" &&
                data.subsubpagename === ""
        )?.listpageaccessmode || "Overall";





    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };




    const [upcomingInterview, setUpcomingInterview] = useState([]);
    const [btnselect, setBtnSelect] = useState("Original", "Today")
    const [btnselecttoday, setBtnSelectToday] = useState("Today")


    const [prodHierarchy, setProdHierarchy] = useState(0);
    const [leaveHome, setLeaveHome] = useState(0);
    const [permission, setPermission] = useState(0);
    const [longabsent, setLongAbsent] = useState(0);
    const [advance, setAdvance] = useState(0);
    const [loan, setLoan] = useState(0);

    const fetchEmployee = async () => {

        try {

            let [res_prodhierarchy, res_leavehome, res_permission, res_longabsent, res_advance, res_loan] = await Promise.all([

                await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_HIERARCHYFILTER_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },

                    username: isUserRoleAccess.companyname,
                    hierachy: "myallhierarchy",
                    sector: "all",
                    listpageaccessmode: listpageaccessby,
                }),
                axios.get(SERVICE.APPLYLEAVE_FILTERED_HOME_COUNT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.PERMISSIONS_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                await axios.post(SERVICE.LONG_ABSENT_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    filterin: "Employee",
                    username: isUserRoleAccess.companyname,
                    hierachy: "My + All Hierarchy List",
                    sector: "all",
                    listpageaccessmode: listpageaccessby,
                    team: isUserRoleAccess.team,
                    module: "Human Resources",
                    submodule: "HR",
                    mainpage: "Employee",
                    subpage: "Employee Status Details",
                    subsubpage: "Long Absent Restriction List",
                    status: "completed",
                }),
                axios.get(SERVICE.ADVANCE_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.LOAN_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
            ]);
            setProdHierarchy(res_prodhierarchy?.data?.resultAccessFilter)
            setLeaveHome(res_leavehome?.data?.applyleaves)
            setPermission(res_permission?.data?.permissions)
            setLongAbsent(res_longabsent?.data?.filterallDatauser)
            setAdvance(res_advance?.data?.advance)
            setLoan(res_loan?.data?.loan)
        } catch (err) {
            console.log(err, "err")
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    useEffect(() => {
        fetchEmployee();
    }, [])

    const [meetingArray, setMeetingArray] = useState([]);
    const [clientUserIDArray, setClientUserIDArray] = useState([]);

    const handleFilter = async (btnselect, btntemp) => {
        setBtnSelectToday(btnselect)
        setBtnSelect(btntemp)
        setLoader(true)
        // console.log(btntemp, "btntemp")
        try {
            let fromdate, todate
            const today = new Date();
            const selectedFilter = btnselect;
            // const formatDate = (date) => date.toISOString().split("T")[0];
            const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const year = date.getFullYear();
                return `${year}-${month}-${day}`;
            };



            // switch (selectedFilter) {
            //     // case "Today":
            //     //     fromdate = formatDate(new Date());
            //     //     break;

            //     // case "Tomorrow":
            //     //     const tomorrow = new Date();
            //     //     tomorrow.setDate(tomorrow.getDate() + 1);
            //     //     fromdate = formatDate(tomorrow);
            //     //     break;

            //     case "Today":
            //         fromdate = todate = formatDate(today);
            //         break;
            //     case "Tomorrow":
            //         const tomorrow = new Date(today);
            //         tomorrow.setDate(today.getDate() + 1);
            //         fromdate = todate = formatDate(tomorrow);
            //         break;

            //     // case "This Week":
            //     //     fromdate = formatDate(getWeekStartDate(new Date()));
            //     //     todate = formatDate(getWeekEndDate(new Date()));
            //     //     break;

            //     // case "This Month":
            //     //     fromdate = formatDate(getMonthStartDate(new Date()));
            //     //     todate = formatDate(getMonthEndDate(new Date()));
            //     //     break;

            //     case "This Week":
            //         const startOfThisWeek = new Date(today);
            //         startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
            //         const endOfThisWeek = new Date(startOfThisWeek);
            //         endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
            //         fromdate = formatDate(startOfThisWeek);
            //         todate = formatDate(endOfThisWeek);
            //         break;
            //     case "This Month":
            //         fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
            //         todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


            //         break;

            //     default:
            //         fromdate = ""
            //         // fromdate = formatDate(new Date());
            //         break;
            // }



            switch (selectedFilter) {


                case "Last Month":
                    fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                    todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                    break;
                case "Last Week":
                    const startOfLastWeek = new Date(today);
                    startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                    const endOfLastWeek = new Date(startOfLastWeek);
                    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                    fromdate = formatDate(startOfLastWeek);
                    todate = formatDate(endOfLastWeek);
                    break;
                case "Yesterday":
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                    fromdate = todate = formatDate(yesterday);
                    break;

                case "Today":
                    fromdate = todate = formatDate(today);
                    break;
                case "Tomorrow":
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    fromdate = todate = formatDate(tomorrow);
                    break;
                case "This Week":
                    const startOfThisWeek = new Date(today);
                    startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                    const endOfThisWeek = new Date(startOfThisWeek);
                    endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                    fromdate = formatDate(startOfThisWeek);
                    todate = formatDate(endOfThisWeek);
                    break;
                case "This Month":
                    fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                    todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


                    break;

                default:
                    fromdate = "";
            }






            // console.log(fromdate, todate, "month")

            let FINALAPI = btntemp === "Original" ? SERVICE.DAY_POINTS_FILTER_HOME : SERVICE.TEMP_DAY_POINTS_FILTER_HOME
            // console.log(FINALAPI, "FINALAPI")

            let res1 = await axios.post(FINALAPI, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                fromdate: fromdate,
                todate: todate ? todate : fromdate,

                compare: "All",
            });

            // console.log(fromdate, todate, "ddatessss")

            const itemsWithSerialNumber = res1.data?.map((item, index) => {
                let status = "";
                if (Number(item.point) < Number(item.daypoint)) {
                    status = "Below Min Points";
                } else if (item.avgpoint <= 50) {
                    status = "Below 50%";
                } else if (item.avgpoint > 50 && item.avgpoint <= 75) {
                    status = "Between 51 - 75%";
                } else if (item.avgpoint > 75 && item.avgpoint <= 100) {
                    status = "Between 76 - 100%";
                } else if (item.avgpoint > 100 && item.avgpoint <= 149) {
                    status = "Between 101 - 149%";
                } else if (item.avgpoint > 149) {
                    status = "150% and Above";
                }

                let mindiffval = Number(item.point) - Number(item.daypoint);
                let tardiffval = Number(item.point) - Number(item.target);
                return {
                    ...item,
                    serialNumber: index + 1,
                    production: String(item.production),
                    manual: String(item.manual),
                    nonproduction: String(item.nonproduction),
                    point: Number(item.point).toFixed(2),
                    allowancepoint: String(item.allowancepoint),
                    nonallowancepoint: String(item.nonallowancepoint),
                    avgpoint: Number(item.avgpoint).toFixed(2),
                    daypoint: item.daypoint ? Number(item.daypoint).toFixed(2) : "",
                    mindiff: item.daypoint ? mindiffval <= 0 ? mindiffval.toFixed(2) : ("+" + mindiffval.toFixed(2)) : "",
                    tardiff: item.target ? tardiffval <= 0 ? tardiffval.toFixed(2) : ("+" + tardiffval.toFixed(2)) : "",
                    status: item.target == 0 ? " " : status,
                    oldstartdate: item.startDate,
                    oldenddate: item.endDate,

                    startDate: moment(item.startDate).format("DD-MM-YYYY"),
                    endDate: moment(item.endDate).format("DD-MM-YYYY"),
                    minreached: Number(item.point) < Number(item.daypoint) ? "Not Reached" : "Reached"
                }
            })

            // console.log(itemsWithSerialNumber, "itemsWithSerialNumber")
            let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });


            let startMonthDate = new Date(fromdate);
            let endMonthDate = new Date(todate ? todate : fromdate);
            // console.log(startMonthDate, endMonthDate)

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
            // console.log(daysArray, "daysArray")


            let res = await axios.post(SERVICE.GET_WEEOFF_DAYS_FORUSER_ATTENDANCE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                // empname: selectedEmployee.map((item) => item.value),
                // empcode: selectedEmployee.map((item) => item.empcode),
                // username: selectedEmployee.map((item) => item.username),
                // company: selectedCompany.map((item) => item.value),
                // branch: selectedBranch.map((item) => item.value),
                // unit: selectedUnit.map((item) => item.value),
                // team: selectedTeam.map((item) => item.value),
                userDates: daysArray,
                deptQuery: {},
                fromdate: fromdate
            });

            let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Approved"),
            });
            // console.log(res?.data?.finaluser, "finalusdfjiwoerj")
            let filtered = res?.data?.finaluser?.filter(d => {
                const [day, month, year] = d.rowformattedDate.split("/");
                const formattedDate = new Date(`${year}-${month}-${day}`);

                const reasonDate = new Date(d.reasondate);
                if (d.reasondate && d.reasondate != "") {
                    return (
                        formattedDate <= reasonDate
                    )
                } else {
                    return d
                }
            })
            // console.log(filtered, "filtered")


            let leaveresult = res_applyleave?.data?.applyleaves;

            let countByEmpcodeClockin = {}; // Object to store count for each empcode
            let countByEmpcodeClockout = {};

            const itemsWithSerialNumber1 = filtered?.map((item, index) => {
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
                const absentItems = res?.data?.finaluser?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

                // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
                if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
                    // Define the date format for comparison
                    const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                    const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

                    const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

                    if (isPreviousDayLeave) {
                        updatedClockInStatus = 'AfterWeekOffLeave';
                        updatedClockOutStatus = 'AfterWeekOffLeave';
                    }
                    if (isPreviousDayAbsent) {
                        updatedClockInStatus = 'AfterWeekOffAbsent';
                        updatedClockOutStatus = 'AfterWeekOffAbsent';
                    }
                    if (isNextDayLeave) {
                        updatedClockInStatus = 'BeforeWeekOffLeave';
                        updatedClockOutStatus = 'BeforeWeekOffLeave';
                    }
                    if (isNextDayAbsent) {
                        updatedClockInStatus = 'BeforeWeekOffAbsent';
                        updatedClockOutStatus = 'BeforeWeekOffAbsent';
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
                    clockinstatus: updatedClockInStatus,
                    clockoutstatus: updatedClockOutStatus,
                };
            });
            // console.log(itemsWithSerialNumber1, "itemsWithSerialNumber1")
            const rowDataTableData = itemsWithSerialNumber1?.map((item, index) => {

                return {
                    ...item,
                    boardingLog: item.boardingLog,
                    shiftallot: item.shiftallot,
                    shift: item.shift,
                    date: item.date,
                    shiftmode: item.shiftMode,
                    clockin: item.clockin,
                    clockinstatus: item.clockinstatus,
                    lateclockincount: item.lateclockincount,
                    earlyclockoutcount: item.earlyclockoutcount,
                    clockout: item.clockout,
                    clockoutstatus: item.clockoutstatus,
                    attendanceauto: getattendancestatus(item, res_vendor?.data?.attendancestatus),
                    daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item, res_vendor?.data?.attendancestatus),

                };
            });
            // console.log(rowDataTableData, "rowDataTableData")
            // console.log(itemsWithSerialNumber, "itemsWithSerialNumber555")

            let finalData = itemsWithSerialNumber.map(item => {
                const [year, month, day] = item.oldstartdate?.split("-");
                let formattedDate = `${day}/${month}/${year}`
                return {
                    ...item,
                    daystatus: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.daystatus,
                    shift: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.shift,
                    weekoff: rowDataTableData.find(d => d.date.split(" ")[0] === formattedDate)?.shift === "Week Off" ? "Week Off" : ""
                }
            });
            // console.log(finalData, "finalData")
            setClientUserIDArray(finalData.filter((item, index) => index <= 5));
            setLoader(false)
        } catch (err) {
            setLoader(false)
            console.log(err, "error013");
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    // console.log(clientUserIDArray, "clientUserIDArray")

    useEffect(() => {
        fetchEmployee();
    }, [])
    useEffect(() => {
        handleFilter("Today", "Original");
    }, [])


    const getColorFromTitle = (title) => {
        const letter = title.charAt(0).toUpperCase();
        const colors = {
            A: '#e5d652a8', B: '#e5d652a8', C: '#e5d652a8', D: '#e5d652a8', E: '#e5d652a8', F: '#e5d652a8', L: '#e5d652a8', // Group 1
            G: '#f5888899', H: '#f5888899', I: '#f5888899', J: '#f5888899', K: '#f5888899', T: '#f5888899',               // Group 2
            M: '#82f2c4ab', N: '#82f2c4ab', O: '#82f2c4ab', P: '#82f2c4ab', Q: '#82f2c4ab', R: '#82f2c4ab', Z: '#82f2c4ab', // Group 3
            S: '#88c3f599',                                                                                      // Group 4
            U: '#e184b699', V: '#e184b699', W: '#673ab782', X: '#673ab782', Y: '#673ab782'                             // Group 5 and 6
        };

        return colors[letter] || '#88c3f599';
    };



    const getColorFromTitleLetter = (title) => {
        const letter = title.charAt(0).toUpperCase();
        const colors = {
            A: '#b5a626', B: '#b5a626', C: '#b5a626', D: '#b5a626', E: '#b5a626', F: '#b5a626', L: '#b5a626', // Group 1
            G: '#d76a6a', H: '#d76a6a', I: '#d76a6a', J: '#d76a6a', K: '#d76a6a', T: '#d76a6a',               // Group 2
            M: '#49b589', N: '#49b589', O: '#49b589', P: '#49b589', Q: '#49b589', R: '#49b589', Z: '#49b589', // Group 3
            S: '#6095c2',                                                                                      // Group 4
            U: '#ce6fa2', V: '#ce6fa2', W: '#7952be', X: '#7952be', Y: '#7952be'                             // Group 5 and 6
        };

        return colors[letter] || '#6095c2';
    };







    return (
        <>
            {isUserRoleCompare?.includes("lproductions") && (

                <Grid item xs={12} md={8} sm={8}>
                    <Box
                        sx={{
                            ...userStyle?.homepagecontainer,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                        }}
                    >

                        <Typography sx={{ fontWeight: "700" }}>Production</Typography>
                        <br />

                        <Box
                            sx={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: {
                                    xs: "wrap",
                                },
                                flexDirection: {
                                    xs: "row", // Stack buttons vertically on small screens
                                    sm: "row", // Align buttons in a row on larger screens
                                },
                                alignItems: {
                                    xs: "flex-start", // Align items to start for mobile
                                    sm: "center", // Center items on larger screens
                                    md: "center", // Center items on larger screens
                                    lg: "center", // Center items on larger screens
                                },
                                justifyContent: {
                                    md: "space-between",
                                    lg: "space-between",
                                    xs: "center",
                                    sm: "center",
                                },
                            }}
                        >


                            <Box sx={{
                                display: "flex",
                                gap: "10px",
                            }}>
                                {["Original", "Temp"].map((label) => (
                                    <Button
                                        key={label}
                                        variant="outlined"
                                        onClick={() => handleFilter(btnselecttoday, label)}
                                        // onClick={() => fetchButtonEvents(label)}
                                        sx={{
                                            backgroundColor: btnselect === label ? "#34abab" : "none",
                                            color: btnselect === label ? "white" : "inherit",
                                            "&:hover": {
                                                backgroundColor: btnselect === label ? "#34abab" : "none",
                                                color: btnselect === label ? "white" : "inherit",
                                            },
                                            borderRadius: "28px",
                                            textTransform: "capitalize",
                                            fontSize: {
                                                xs: "12px", // Smaller font size for mobile
                                                sm: "14px", // Larger font size for bigger screens
                                            },
                                        }}
                                        color="success"
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Box>

                            {/* <Box sx={{
                                display: "flex",
                                gap: "10px",
                            }}>
                                {["Today", "Tomorrow", "This Week", "This Month"].map((label) => (
                                    <Button
                                        key={label}
                                        variant="outlined"
                                        onClick={() => handleFilter(label, btnselect)}
                                        sx={{
                                            backgroundColor: btnselecttoday === label ? "#34abab" : "none",
                                            color: btnselecttoday === label ? "white" : "inherit",
                                            "&:hover": {
                                                backgroundColor: btnselecttoday === label ? "#34abab" : "none",
                                                color: btnselecttoday === label ? "white" : "inherit",
                                            },
                                            borderRadius: "28px",
                                            textTransform: "capitalize",
                                            fontSize: {
                                                xs: "12px", // Smaller font size for mobile
                                                sm: "14px", // Larger font size for bigger screens
                                            },
                                        }}
                                        color="primary"
                                    >
                                        {label}
                                    </Button>
                                ))}

                            </Box> */}


                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "10px", // Space between buttons
                                    flexWrap: "nowrap", // Prevent wrapping to the next row
                                    justifyContent: {
                                        xs: "space-around", // Distribute buttons evenly on smaller screens
                                        sm: "space-between", // Adjust spacing for medium screens
                                    },
                                    alignItems: "center", // Align buttons vertically in the center
                                    overflowX: "auto", // Enable horizontal scrolling if the screen is too small
                                }}
                            >
                                {["Last Month", "Last Week", "Yesterday", "Today", "Tomorrow", "This Week", "This Month"].map((label) => (
                                    <Button
                                        key={label}
                                        variant="outlined"
                                        onClick={() => handleFilter(label, btnselect)}
                                        sx={{
                                            backgroundColor: btnselecttoday === label ? "#34abab" : "none",
                                            color: btnselecttoday === label ? "white" : "inherit",
                                            "&:hover": {
                                                backgroundColor: btnselecttoday === label ? "#34abab" : "none",
                                                color: btnselecttoday === label ? "white" : "inherit",
                                            },
                                            borderRadius: "28px",
                                            textTransform: "capitalize",
                                            padding: "6px 12px", // Adjust padding for a smaller button
                                            fontSize: {
                                                xs: "08px", // Reduced font size for mobile
                                                sm: "10px", // Slightly larger for small screens
                                                md: "12px", // Default size for medium and above
                                            },
                                            whiteSpace: "nowrap", // Prevent text wrapping within buttons
                                        }}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </Box>



                        </Box>

                        <br />

                        <br />

                        <Grid container spacing={2} >
                            {/* Conditional rendering if meetingArray is empty */}
                            {loader ? (
                                <>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
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
                                    </Grid>
                                </>
                            ) : (
                                <>

                                    {clientUserIDArray.length === 0 ? (
                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                            <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                                        </Grid>
                                    ) : (

                                        <Grid container columnSpacing={2}>
                                            {clientUserIDArray.map((exercise, index) => (
                                                <Grid item md={6} lg={6} xs={12} sm={12} key={index}>
                                                    <Grid container sx={{ m: 1.5 }}>


                                                        <Grid item md={2} lg={2} xs={2} sm={2}>
                                                            {/* <Chip
                                                        label={exercise.name}
                                                        sx={{ bgcolor: '#f2f2f2', color: '#555', width: 40, height: 40, fontSize: '18px', fontWeight: 'bold' }}
                                                    /> */}
                                                            <Chip
                                                                label={exercise.name.charAt(0).toUpperCase()}
                                                                sx={{
                                                                    bgcolor: getColorFromTitle(exercise.name),
                                                                    color: getColorFromTitleLetter(exercise.name),
                                                                    width: 40,
                                                                    height: 40,
                                                                    fontSize: '18px',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid item md={6} lg={6} xs={6} sm={6}>
                                                            {/* <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{exercise.name}</Typography> */}
                                                            <Tooltip title={exercise.name.length > 10 ? exercise.name : ''}>
                                                                <Typography
                                                                    sx={{
                                                                        fontWeight: 800,
                                                                        fontSize: {
                                                                            xs: "10px", // Smaller font size for mobile
                                                                            sm: "12px",
                                                                        },
                                                                        textTransform: "uppercase",
                                                                    }}
                                                                >
                                                                    {exercise.name.length > 10
                                                                        ? `${exercise.name.substring(0, 10)}...`
                                                                        : exercise.name}
                                                                </Typography>
                                                            </Tooltip>
                                                            <Typography variant="body2" color="textSecondary">
                                                                {/* {exercise.target}: */}
                                                                {`${moment(exercise.oldstartdate.split("T")[0]).format("DD/MM/YYYY")} to ${moment(exercise.oldenddate.split("T")[0]).format("DD/MM/YYYY")}`}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item md={4} lg={4} xs={4} sm={4}>

                                                            <Typography variant="subtitle2" sx={{ color: '#4cb3b0', fontWeight: 'bold' }}>{`${exercise.point} / ${exercise.target}`}</Typography>
                                                            <Typography variant="subtitle2" sx={{ color: '#db8c39', fontWeight: 'bold' }}>{exercise.status}</Typography>
                                                        </Grid>



                                                    </Grid>
                                                    <Divider />
                                                </Grid>

                                            ))}
                                        </Grid>


                                    )}
                                </>
                            )}

                        </Grid>
                        {/* Always render the View More button at the bottom */}


                        <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>
                            {btnselect === "Original" ?
                                <Link to="/production/listproductionpointsfilter" target="_blank">
                                    <Button variant="contained" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }} size="small">
                                        View More
                                    </Button>
                                </Link>
                                :
                                <Link to="/production/tempproductionreviewew" target="_blank">
                                    <Button variant="contained" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }} size="small">
                                        View More
                                    </Button>
                                </Link>
                            }
                        </Grid>


                    </Box>
                </Grid>

            )}
        </>

    );
};

export default HomeProduction;
