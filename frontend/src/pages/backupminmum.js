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


const HomeMinimum = () => {

    const monthsArray = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [manageshortagemasters, setManageshortagemasters] = useState([]);


    const [loader, setLoader] = useState(false)


    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);


    const accessbranchsalary = isAssignBranch
        ? isAssignBranch.map((data) => ({
            branch: data.branch,
            company: data.company,
            // unit: data.unit
        }))
        : [];



    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };

    const [upcomingInterview, setUpcomingInterview] = useState([]);
    const [btnselect, setBtnSelect] = useState("Original", "Today")
    const [btnselecttoday, setBtnSelectToday] = useState("This Month")


    const [revenueAmount, setRevenueAmount] = useState([]);
    const [acPointCal, setAcPointCal] = useState([]);
    const [salSlabs, setsalSlabs] = useState([]);

    const [attStatus, setAttStatus] = useState([]);
    const [attModearr, setAttModearr] = useState([]);
    const [monthSets, setMonthsets] = useState([]);


    const fetchEmployee = async () => {


        try {

            let [res_freq, res_vendor, res_employee, Res, Revenue, dept] = await Promise.all([


                axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.ATTENDANCE_STATUS, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),

                axios.post(SERVICE.SALARYSLAB_LIMITEDASSIGNBRANCH, {
                    assignbranch: accessbranchsalary
                }, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),

                axios.get(SERVICE.ACPOINTCALCULATION, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.REVENUEAMOUNTSLIMITED, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
                axios.get(SERVICE.DEPMONTHSET_ALL, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),

            ]);
            // let filteredMonthsets = dept?.data?.departmentdetails.filter((item) => item.year == selectedYear && item.monthname == selectedMonth);
            // setMonthsets(filteredMonthsets);


            setAttStatus(res_vendor?.data?.attendancestatus);
            setAttModearr(res_freq?.data?.allattmodestatus);
            setsalSlabs(res_employee?.data?.salaryslab);
            setAcPointCal(Res?.data?.acpointcalculation);
            setRevenueAmount(Revenue?.data?.revenueamounts);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };






    useEffect(() => {
        fetchEmployee();
    }, []);

    const getattendancestatus = (clockinstatus, clockoutstatus) => {
        let result = attStatus.filter((data, index) => {
            return data?.clockinstatus === clockinstatus && data?.clockoutstatus === clockoutstatus
        })
        return result[0]?.name
    }

    const getAttModeLop = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.lop === true ? 'YES' : 'No';
    }

    const getAttModeLopType = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.loptype
    }

    const getFinalLop = (rowlop, rowloptype) => {
        return (rowloptype === undefined || rowloptype === "") ? rowlop : (rowlop + ' - ' + rowloptype);
    }

    const getCount = (rowlopstatus) => {
        if (rowlopstatus === 'YES - Double Day') {
            return '2'
        } else if (rowlopstatus === 'YES - Full Day') {
            return '1';
        } else if (rowlopstatus === 'YES - Half Day') {
            return '0.5'
        } else {
            return '0';
        }
    }

    const getAttModeTarget = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.target === true ? 'YES' : 'No';
    }

    const getAttModePaidPresent = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.paidleave === true ? 'YES' : 'No';
    }

    const getAttModePaidPresentType = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.paidleavetype;
    }

    const getFinalPaid = (rowpaid, rowpaidtype) => {
        return (rowpaidtype === undefined || rowpaidtype === "") ? rowpaid : (rowpaid + ' - ' + rowpaidtype);
    }

    const getAssignLeaveDayForPaid = (rowpaidday) => {
        if (rowpaidday === 'YES - Double Day') {
            return '2'
        } else if (rowpaidday === 'YES - Full Day') {
            return '1';
        } else if (rowpaidday === 'YES - Half Day') {
            return '0.5'
        } else {
            return '0';
        }
    }



    const [items, setItems] = useState([]);


    const handleFilter = async () => {
        setLoader(true)
        try {


            let [res_applyleave, res_employee1] = await Promise.all([
                axios.get(SERVICE.APPLY_LEAVE_HOME, {

                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    // status: String("Approved"),

                }),
                axios.get(SERVICE.USEREXCELDATA_HOME, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }),
            ]);
            let leaveresult = res_applyleave?.data?.applyleaves;
            console.log(res_employee1.data.users);

            const batchSize = 6; // Example batch size


            const batches = [];
            let pageone = 1; // Start from page 1

            async function fetchData(pageone) {
                try {
                    const response = await axios.post(
                        SERVICE.MINIMUM_HOME,
                        {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            page: pageone,
                            pageSize: batchSize,
                        }
                    );
                    if (Array.isArray(response.data.finaluser)) {
                        batches.push(...response.data.finaluser);

                        // handleOpenLoadingMessage(percent);
                        // Check if there's more data to fetch
                        if (response.data.finaluser.length != 0) {
                            // If yes, fetch the next page
                            pageone++;
                            await fetchData(pageone);
                        }
                    } else {
                        // handleCloseLoadingMessage();
                        console.error("Response data is not an array:", response.data.finaluser);
                        // Handle error as needed
                    }
                } catch (error) {
                    console.error("Error sending request:", error);
                    // Handle error as needed
                }
            }

            fetchData(pageone).then(async () => {

                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
                const currentYear = currentDate.getFullYear();

                const selectedMonthNum = Number(currentMonth)
                const selectedYear = Number(currentYear)

                let countByEmpcodeClockin = {}; // Object to store count for each empcode
                let countByEmpcodeClockout = {};
                // return res_usershift.data.finaluser;
                let result = batches.flatMap((item, index) => {

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
                    const absentItems = batches?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

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
                        shiftallot: item.shiftallot,
                        weekOffDates: item.weekOffDates,
                        clockinstatus: updatedClockInStatus,
                        clockoutstatus: updatedClockOutStatus,
                        totalnumberofdays: item.totalnumberofdays,
                        empshiftdays: item.empshiftdays,
                        totalcounttillcurrendate: item.totalcounttillcurrendate,
                        totalshift: item.totalshift,
                        attendanceauto: getattendancestatus(updatedClockInStatus, updatedClockOutStatus),
                        daystatus: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus),
                        lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                        loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                        lopcalculation: getFinalLop(
                            getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                            getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                        ),
                        lopcount: getCount(
                            getFinalLop(
                                getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                                getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                            )
                        ),
                        modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                        paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                        paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                        paidpresent: getFinalPaid(
                            getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                            getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                        ),
                        paidpresentday: getAssignLeaveDayForPaid(
                            getFinalPaid(
                                getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                                getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                            )
                        ),
                        // weekoffCount: attresult.length > 0 ? uniqueWeekOffDates.filter(d => !uniqueAttandanceDates.includes(d)).length : uniqueWeekOffDates.length,
                    }
                })

                const finalresult = [];

                result.forEach(item => {

                    const leaveOnDateApproved = leaveresult.find((d) => d.date === item.rowformattedDate && d.empcode === item.empcode);

                    const existingEntryIndex = finalresult.findIndex(entry => entry.empcode === item.empcode);


                    if (existingEntryIndex !== -1) {
                        finalresult[existingEntryIndex].shift++;

                        if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.clockin === '00:00:00' && item.clockout === '00:00:00') {
                            finalresult[existingEntryIndex].weekoff++;
                        }

                        if (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') {
                            finalresult[existingEntryIndex].holidayCount++;
                        }

                        // if (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') {
                        //     finalresult[existingEntryIndex].leaveCount++;
                        // }
                        if (leaveOnDateApproved) {
                            // if ((item.clockinstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved.code} ${leaveOnDateApproved.status}`)) {
                            finalresult[existingEntryIndex].leaveCount++;
                            // }
                        }

                        if (item.attendanceauto === undefined && item.daystatus === undefined) {
                            finalresult[existingEntryIndex].nostatuscount++;
                        }

                        finalresult[existingEntryIndex].lopcount = String(parseFloat(finalresult[existingEntryIndex].lopcount) + parseFloat(item.lopcount));
                        finalresult[existingEntryIndex].paidpresentday = String(parseFloat(finalresult[existingEntryIndex].paidpresentday) + parseFloat(item.paidpresentday));

                    } else {

                        const newItem = {
                            id: item.id,
                            empcode: item.empcode,
                            username: item.username,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,
                            department: item.department,
                            totalnumberofdays: item.totalnumberofdays,
                            empshiftdays: item.empshiftdays,
                            shift: 1,
                            // weekoff: item.weekoffCount,
                            weekoff: (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,
                            lopcount: item.lopcount,
                            paidpresentday: item.paidpresentday,
                            totalcounttillcurrendate: item.totalcounttillcurrendate,
                            totalshift: item.totalshift,
                            holidayCount: (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') ? 1 : 0,
                            // leaveCount: (item.clockinstatus === 'Leave' && item.clockoutstatus === 'Leave') ? 1 : 0,
                            // leaveCount: leaveOnDateApproved ? ((item.clockinstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) && (item.clockoutstatus === `${leaveOnDateApproved && leaveOnDateApproved.code} ${leaveOnDateApproved && leaveOnDateApproved.status}`) ? 1 : 0) : 0,
                            leaveCount: leaveOnDateApproved ? 1 : 0,
                            clsl: 0,
                            holiday: 0,
                            totalpaiddays: 0,
                            nostatus: 0,
                            nostatuscount: (item.paidpresent === 'No' && item.modetarget === 'No' && item.lopcalculation === 'No') ? 1 : 0,
                        };
                        finalresult.push(newItem);
                    }
                });

                const itemsWithSerialNumber = res_employee1.data.users?.map(async (item, index) => {
                    try {
                        let findTotalNoOfDays = finalresult.find(d =>
                            d.company == item.company &&
                            d.branch == item.branch
                            && d.department == item.department
                            && d.team == item.team
                            && d.empcode == item.empcode
                            && d.unit == item.unit
                            && d.username == item.companyname
                        )


                        // const lastItemsForEachMonth = Object.values(groupedByMonth);

                        // // Extract the last item of each group

                        const groupedByMonth = {};
                        if (item?.assignExpLog?.length > 0) {
                            // Group items by month
                            item?.assignExpLog?.forEach((item) => {
                                const monthYear = item?.updatedate?.split("-").slice(0, 2).join("-");
                                if (!groupedByMonth[monthYear]) {
                                    groupedByMonth[monthYear] = [];
                                }
                                groupedByMonth[monthYear].push(item);
                            });
                        }
                        // Extract the last item of each group
                        const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

                        // Filter the data array based on the month and year
                        lastItemsForEachMonth.sort((a, b) => {
                            return new Date(a.updatedate) - new Date(b.updatedate);
                        });
                        let filteredDataMonth = null;
                        if (lastItemsForEachMonth.length > 0) {
                            // Find the first item in the sorted array that meets the criteria

                            for (let i = 0; i < lastItemsForEachMonth.length; i++) {
                                const date = lastItemsForEachMonth[i].updatedate;
                                const splitedDate = date.split("-");
                                const itemYear = splitedDate[0];
                                const itemMonth = splitedDate[1]; // Adding 1 because getMonth() returns 0-indexed month
                                if (Number(itemYear) === selectedYear && Number(itemMonth) === Number(selectedMonthNum)) {
                                    filteredDataMonth = lastItemsForEachMonth[i];
                                    break;
                                } else if (Number(itemYear) < selectedYear || (Number(itemYear) === selectedYear && Number(itemMonth) < Number(selectedMonthNum))) {
                                    filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
                                } else {
                                    break; // Break the loop if we encounter an item with year and month greater than selected year and month
                                }
                            }
                        }
                        // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
                        let modevalue = filteredDataMonth;


                        let selectedmonthnumvalue = Number(selectedMonthNum) <= 9 ? `0${selectedMonthNum}` : selectedMonthNum;
                        let selectedMonStartDate = `${selectedYear}-${selectedmonthnumvalue}-01`;

                        let findexp = monthSets.find((d) => d.department === item.department);
                        let findDate = findexp ? findexp.fromdate : selectedMonStartDate;

                        const calculateMonthsBetweenDates = (startDate, endDate) => {
                            if (startDate && endDate) {
                                const start = new Date(startDate);
                                const end = new Date(endDate);

                                let years = end.getFullYear() - start.getFullYear();
                                let months = end.getMonth() - start.getMonth();
                                let days = end.getDate() - start.getDate();

                                // Convert years to months
                                months += years * 12;

                                // Adjust for negative days
                                if (days < 0) {
                                    months -= 1; // Subtract a month
                                    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
                                }

                                // Adjust for days 15 and above
                                if (days >= 15) {
                                    months += 1; // Count the month if 15 or more days have passed
                                }

                                return months;
                            }

                            return 0; // Return 0 if either date is missing
                        };



                        // Calculate difference in months between findDate and item.doj
                        let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
                        if (modevalue) {
                            //findexp end difference yes/no
                            if (modevalue.endexp === "Yes") {
                                differenceInMonthsexp = calculateMonthsBetweenDates(
                                    item.doj,
                                    modevalue.endexpdate
                                );
                                //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                                if (modevalue.expmode === "Add") {
                                    differenceInMonthsexp += parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Minus") {
                                    differenceInMonthsexp -= parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Fix") {
                                    differenceInMonthsexp = parseInt(modevalue.expval);
                                }
                            } else {
                                differenceInMonthsexp = calculateMonthsBetweenDates(
                                    item.doj,
                                    findDate
                                );
                                // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                                if (modevalue.expmode === "Add") {
                                    differenceInMonthsexp += parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Minus") {
                                    differenceInMonthsexp -= parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Fix") {
                                    differenceInMonthsexp = parseInt(modevalue.expval);
                                } else {
                                    // differenceInMonths = parseInt(modevalue.expval);
                                    differenceInMonthsexp = calculateMonthsBetweenDates(
                                        item.doj,
                                        findDate
                                    );
                                }
                            }

                            //findtar end difference yes/no
                            if (modevalue.endtar === "Yes") {
                                differenceInMonthstar = calculateMonthsBetweenDates(
                                    item.doj,
                                    modevalue.endtardate
                                );
                                //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                                if (modevalue.expmode === "Add") {
                                    differenceInMonthstar += parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Minus") {
                                    differenceInMonthstar -= parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Fix") {
                                    differenceInMonthstar = parseInt(modevalue.expval);
                                }
                            } else {
                                differenceInMonthstar = calculateMonthsBetweenDates(
                                    item.doj,
                                    findDate
                                );
                                if (modevalue.expmode === "Add") {
                                    differenceInMonthstar += parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Minus") {
                                    differenceInMonthstar -= parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Fix") {
                                    differenceInMonthstar = parseInt(modevalue.expval);
                                } else {
                                    // differenceInMonths = parseInt(modevalue.expval);
                                    differenceInMonthstar = calculateMonthsBetweenDates(
                                        item.doj,
                                        findDate
                                    );
                                }
                            }

                            differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                            if (modevalue.expmode === "Add") {
                                differenceInMonths += parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Minus") {
                                differenceInMonths -= parseInt(modevalue.expval);
                            } else if (modevalue.expmode === "Fix") {
                                differenceInMonths = parseInt(modevalue.expval);
                            } else {
                                // differenceInMonths = parseInt(modevalue.expval);
                                differenceInMonths = calculateMonthsBetweenDates(
                                    item.doj,
                                    findDate
                                );
                            }
                        } else {
                            differenceInMonthsexp = calculateMonthsBetweenDates(
                                item.doj,
                                findDate
                            );
                            differenceInMonthstar = calculateMonthsBetweenDates(
                                item.doj,
                                findDate
                            );
                            differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                        }

                        //GET PROCESS CODE FUNCTION

                        const groupedByMonthProcs = {};
                        if (item.processlog.length > 0) {
                            // Group items by month
                            item.processlog.forEach((item) => {
                                const monthYear = item.date?.split("-").slice(0, 2).join("-");
                                if (!groupedByMonthProcs[monthYear]) {
                                    groupedByMonthProcs[monthYear] = [];
                                }
                                groupedByMonthProcs[monthYear].push(item);
                            });
                        }
                        // Extract the last item of each group
                        const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                        // Filter the data array based on the month and year
                        lastItemsForEachMonthPros.sort((a, b) => {
                            return new Date(a.date) - new Date(b.date);
                        });
                        // Find the first item in the sorted array that meets the criteria
                        let filteredItem = null;
                        if (lastItemsForEachMonthPros.length > 0) {
                            for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                                const date = lastItemsForEachMonthPros[i].date;
                                const splitedDate = date?.split("-");
                                const itemYear = splitedDate && splitedDate[0];
                                const itemMonth = splitedDate && splitedDate[1]; // Adding 1 because getMonth() returns 0-indexed month
                                if (Number(itemYear) === selectedYear && Number(itemMonth) === Number(selectedMonthNum)) {
                                    filteredItem = lastItemsForEachMonthPros[i];
                                    break;
                                } else if (Number(itemYear) < selectedYear || (Number(itemYear) === selectedYear && Number(itemMonth) < Number(selectedMonthNum))) {
                                    filteredItem = lastItemsForEachMonthPros[i]; // Keep updating the filteredItem until the criteria is met
                                } else {
                                    break; // Break the loop if we encounter an item with year and month greater than selected year and month
                                }
                            }
                        }

                        let getprocessCode = filteredItem ? filteredItem.process : "";

                        // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
                        let processcodeexpvalue = item.doj && modevalue && modevalue.expmode == "Manual" ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "";


                        //findsalary from salaryslab
                        let findSalDetails = salSlabs.find((d) => d.company === item.company && d.branch === item.branch && d.salarycode === processcodeexpvalue);
                        //shortageamount from shortage master
                        let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
                        //revenue amount from revenue  master
                        let findRevenueAllow = revenueAmount.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvalue);

                        let findAcPointVal = acPointCal.find((d) => d.company === item.company && d.branch === item.branch && d.department === item.department);


                        // GROSS VALUE
                        let grossValue = modevalue && modevalue.expmode == "Manual" ? modevalue.gross : findSalDetails ? (Number(findSalDetails.basic) + Number(findSalDetails.hra) + Number(findSalDetails.conveyance) + Number(findSalDetails.medicalallowance) + Number(findSalDetails.productionallowance) + Number(findSalDetails.otherallowance)) : ""
                        let egvalue = Number(grossValue) + (findShortage ? Number(findShortage.amount) : 0);

                        let hfvalue = egvalue - (findRevenueAllow ? Number(findRevenueAllow.amount) : 0);
                        let i60value = Number(hfvalue) / (findAcPointVal && Number(findAcPointVal.multiplevalue));
                        let j85value = i60value * (findAcPointVal && Number(findAcPointVal.dividevalue));
                        // let totalpaiddaysvalue = findTotalNoOfDays ? Number(findTotalNoOfDays.empshiftdays) - (Number(findTotalNoOfDays.weekoff) + Number(findTotalNoOfDays.holiday)) : 0
                        let totalpaiddaysvalue = findTotalNoOfDays ? (Number(findTotalNoOfDays.empshiftdays) - (Number(findTotalNoOfDays.weekoff))) : 0
                        return {
                            ...item,
                            serialNumber: index + 1,
                            company: item.company,
                            branch: item.branch,
                            unit: item.unit,
                            team: item.team,
                            empcode: item.empcode,
                            companyname: item.companyname,
                            doj: item.doj ? moment(item.doj)?.format("DD-MM-YYYY") : "",

                            experience: item.doj ? calculateMonthsBetweenDates(item.doj, findDate) : "",

                            endtar: modevalue ? modevalue.endtar : "",
                            endtardate: modevalue && modevalue.endtardate ? moment(modevalue.endtardate)?.format("DD-MM-YYYY") : "",
                            endexp: modevalue ? modevalue.endexp : "",
                            endexpdate: modevalue && modevalue.endexpdate ? moment(modevalue.endexpdate)?.format("DD-MM-YYYY") : "",

                            assignExpMode: modevalue ? modevalue.expmode : "",
                            modevalue: modevalue ? modevalue.expval : "",

                            targetexp: item.doj ? (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",
                            prodexp: item.doj ? (differenceInMonthsexp > 0 ? differenceInMonthsexp : 0) : "",
                            modeexp: item.doj ? (differenceInMonths > 0 ? differenceInMonths : 0) : "",

                            // processcode: item.doj ? getprocessCode : "",
                            // salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
                            // processcodeexp: item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",

                            processcode: item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode : "",
                            salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
                            processcodeexp: processcodeexpvalue,
                            // item.doj && modevalue && modevalue.expmode == "Manual" ?( modevalue.salarycode + (differenceInMonthsexp <= 9 ? "0"+differenceInMonthsexp : differenceInMonthsexp )):  (item.doj ? getprocessCode +   differenceInMonthsexp : ""),

                            // processcodetar: item.doj ? getprocessCode + (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",

                            basic: modevalue && modevalue.expmode === "Manual" ? modevalue.basic : findSalDetails ? findSalDetails.basic : "",
                            hra: modevalue && modevalue.expmode === "Manual" ? modevalue.hra : findSalDetails ? findSalDetails.hra : "",
                            conveyance: modevalue && modevalue.expmode === "Manual" ? modevalue.conveyance : findSalDetails ? findSalDetails.conveyance : "",
                            medicalallowance: modevalue && modevalue.expmode === "Manual" ? modevalue.medicalallowance : findSalDetails ? findSalDetails.medicalallowance : "",
                            productionallowance: modevalue && modevalue.expmode === "Manual" ? modevalue.productionallowance : findSalDetails ? findSalDetails.productionallowance : "",
                            otherallowance: modevalue && modevalue.expmode === "Manual" ? modevalue.otherallowance : findSalDetails ? findSalDetails.otherallowance : "",
                            gross: grossValue,
                            //  modevalue && modevalue.expmode == "Manual" ? modevalue.gross : findSalDetails ? Number(findSalDetails.basic) + Number(findSalDetails.hra) + Number(findSalDetails.conveyance) + Number(findSalDetails.medicalallowance) + Number(findSalDetails.productionallowance) + Number(findSalDetails.otherallowance) : "",

                            revenueallow: findRevenueAllow ? findRevenueAllow.amount : 0,
                            shortage: findShortage ? findShortage.amount : 0,
                            "E+G": egvalue,
                            "H-F": hfvalue,
                            "I/60": i60value,
                            "J*8.5": j85value,
                            "K/27": j85value / 27,
                            totalnumberofdays: findTotalNoOfDays ? findTotalNoOfDays.empshiftdays : 0,
                            totalpaidDays: totalpaiddaysvalue,
                            monthPoint: j85value ? j85value.toFixed(2) : "",
                            month: monthsArray[selectedMonthNum - 1],
                            year: selectedYear,

                            dayPoint: totalpaiddaysvalue > 0 && j85value ? (j85value / totalpaiddaysvalue).toFixed(2) : "",
                        };

                    } catch (err) {
                    }
                });
                const results = await Promise.all(itemsWithSerialNumber);
                setItems(results.filter(item => item !== undefined));

            }).catch(error => {

                console.error('Error fetching shifts:', error);
            });

            setLoader(false)
        } catch (err) { setLoader(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    useEffect(() => {
        handleFilter();
    }, [])

    console.log(items, "items")


    const getColorFromTitle = (title) => {
        const letter = title?.charAt(0).toUpperCase();
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
        const letter = title?.charAt(0).toUpperCase();
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


        <Grid item xs={12} md={6} sm={8}>
            <Box
                sx={{
                    ...userStyle?.homepagecontainer,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >

                <Typography sx={{ fontWeight: "700" }}>Minimum Points</Typography>
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
                        {["This Month"].map((label) => (
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

                            {items?.length === 0 ? (
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>No Data</Typography>
                                </Grid>
                            ) : (
                                <Grid container columnSpacing={2}>
                                    {items?.map((exercise, index) => (
                                        <Grid item md={6} lg={6} xs={12} sm={12} key={index}>
                                            <Grid container sx={{ m: 1.5 }}>


                                                <Grid item md={2} lg={2} xs={2} sm={2}>
                                                    <Chip
                                                        label={exercise?.companyname?.charAt(0).toUpperCase()}
                                                        sx={{
                                                            bgcolor: getColorFromTitle(exercise.companyname
                                                            ),
                                                            color: getColorFromTitleLetter(exercise.companyname
                                                            ),
                                                            width: 40,
                                                            height: 40,
                                                            fontSize: '18px',
                                                            fontWeight: 'bold',
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item md={6} lg={6} xs={6} sm={6}>
                                                    {/* <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{exercise.name}</Typography> */}
                                                    <Tooltip title={exercise.companyname?.length > 10 ? exercise.companyname : ''}>
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
                                                            {exercise.companyname.length > 10
                                                                ? `${exercise.companyname.substring(0, 10)}...`
                                                                : exercise.companyname}
                                                        </Typography>
                                                    </Tooltip>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {exercise.month} - {exercise.year}
                                                        {/* {moment(exercise.date).format("DD/MM/YYYY")} */}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={4} lg={4} xs={4} sm={4}>


                                                    <Typography variant="subtitle2" sx={{ color: '#4cb3b0', fontWeight: 'bold' }}>{`${exercise.totalpaidDays} / ${exercise.totalnumberofdays}`}</Typography>
                                                    <Typography variant="subtitle2" sx={{ color: '#db8c39', fontWeight: 'bold' }}>{`${exercise.dayPoint} - ${exercise.monthPoint}`}</Typography>
                                                </Grid>



                                            </Grid>
                                            <Divider />
                                            <br />
                                        </Grid>

                                    ))}
                                </Grid>


                            )}
                        </>
                    )}

                </Grid>
                {/* Always render the View More button at the bottom */}

                <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>

                    <Link to="/production/minimumpointscalculation" target="_blank">
                        <Button variant="contained" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }} size="small">
                            View More
                        </Button>
                    </Link>
                </Grid>
            </Box>
        </Grid>


    );
};

export default HomeMinimum;
