import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Box, Typography, Divider, Dialog, DialogContent, List, ListItem, ListItemText, Popover, TextField, IconButton, Select, OutlinedInput, FormControl, MenuItem, DialogActions, Grid, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { SERVICE } from "../../../services/Baseservice";
import moment from "moment-timezone";
import domtoimage from 'dom-to-image';
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import LoadingButton from '@mui/lab/LoadingButton';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { handleApiError } from "../../../components/Errorhandling";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import Headtitle from "../../../components/Headtitle";
import * as XLSX from 'xlsx';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";



const ButtonCellRenderer = (props) => {

    const { data, api, node } = props;

    const [isLoad, setIsLoad] = useState(false);
    console.log(data);

    const confirmSubmit = () => {
        setIsLoad(true);

        // Get the latest waiver value directly from the node data
        const waiver = parseFloat(node.data.waiver) || 0;
        const lossDeduction = parseFloat(node.data.lossdeductionfinal) || 0;
        const otherdeductionfinal = node.data.otherdeductionfinal ? parseFloat(node.data.otherdeductionfinal) : 0;
        const newLossDeduction = (lossDeduction - (lossDeduction * (waiver / 100))).toFixed(2);

        const updatedData = { ...data, lossdeductionischanged: "Yes", otherdeductionfinal: otherdeductionfinal, waiver: node.data.waiver, lossdeductionfinal: newLossDeduction };
        api.applyTransaction({ update: [updatedData] });
        setIsLoad(false);
    };


    return (
        <>

            <LoadingButton
                loading={isLoad}
                onClick={confirmSubmit}
                variant="contained" size="small" color="error"
                sx={{ textTransform: "capitalize" }}
            >
                Calculate
            </LoadingButton >

        </>
    )
};



const ButtonCellRendererSent = (props) => {


    const { data, api, node } = props;
    const { auth } = useContext(AuthContext);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [isLoad, setIsLoad] = useState(false);
    const [isLoadSent, setIsLoadSent] = useState(false);

    // const confirmSaveSubmit = async () => {
    //     setIsLoad(true);

    //     // Get the latest waiver value directly from the node data
    //     const lossfinal = parseFloat(node.data.lossdeductionfinal) || 0;

    //     const updatedData = { ...data, lossdeductionfinal: lossfinal };
    //     api.applyTransaction({ update: [updatedData] });

    //     let res = await axios.post(`${SERVICE.UPDATE_INNERDATA_SINGLE_USER_WAIVER}`, {
    //         headers: {
    //             Authorization: `Bearer ${auth.APIToken}`,
    //         },

    //         outerId: data.outerId,
    //         innerId: data.id,
    //         lossdeductionfinal: lossfinal,
    //         lossdeductionischanged: node.data.lossdeductionischanged,
    //         salarytypefinal: node.data.salarytypeedit,
    //         deductiontypefinal: node.data.deductiontypeedit,
    //         otherdeduction: node.data.otherdeduction || 0,
    //         waiver: node.data.waiver || 0,


    //     });

    //     setIsLoad(false);
    // };



    //month dropdown options
    const months = [
        { value: "January", label: "January", numval: 1 },
        { value: "February", label: "February", numval: 2 },
        { value: "March", label: "March", numval: 3 },
        { value: "April", label: "April", numval: 4 },
        { value: "May", label: "May", numval: 5 },
        { value: "June", label: "June", numval: 6 },
        { value: "July", label: "July", numval: 7 },
        { value: "August", label: "August", numval: 8 },
        { value: "September", label: "September", numval: 9 },
        { value: "October", label: "October", numval: 10 },
        { value: "November", label: "November", numval: 11 },
        { value: "December", label: "December", numval: 12 },
    ];

    const {
        profTaxMaster,
        shifts,
        payruncontrolmaster,
        monthsArr,
        departmentsList,
        salSlabs,
        eraAmounts,
        acPointCal,
        attModearr,
        attStatus,
        manageshortagemasters,
        revenueAmount,
    } = props.context;

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const getattendancestatus = (clockinstatus, clockoutstatus) => {
        let result = attStatus.filter((data, index) => {
            return data?.clockinstatus === clockinstatus && data?.clockoutstatus === clockoutstatus;
        });
        return result[0]?.name;
    };

    const getAttModeLop = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus;
        });
        return result[0]?.lop === true ? "YES" : "No";
    };

    const getAttModeLopType = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus;
        });
        return result[0]?.loptype;
    };

    const getFinalLop = (rowlop, rowloptype) => {
        return rowloptype === undefined || rowloptype === "" ? rowlop : rowlop + " - " + rowloptype;
    };

    const getCount = (rowlopstatus) => {
        if (rowlopstatus === "YES - Double Day") {
            return "2";
        } else if (rowlopstatus === "YES - Full Day") {
            return "1";
        } else if (rowlopstatus === "YES - Half Day") {
            return "0.5";
        } else {
            return "0";
        }
    };

    const getAttModeTarget = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus;
        });
        return result[0]?.target === true ? "YES" : "No";
    };

    const getAttModePaidPresent = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus;
        });
        return result[0]?.paidleave === true ? "YES" : "No";
    };

    const getAttModePaidPresentType = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus;
        });
        return result[0]?.paidleavetype;
    };

    const getFinalPaid = (rowpaid, rowpaidtype) => {
        return rowpaidtype === undefined || rowpaidtype === "" ? rowpaid : rowpaid + " - " + rowpaidtype;
    };

    const getAssignLeaveDayForPaid = (rowpaidday) => {
        if (rowpaidday === "YES - Double Day") {
            return "2";
        } else if (rowpaidday === "YES - Full Day") {
            return "1";
        } else if (rowpaidday === "YES - Half Day") {
            return "0.5";
        } else {
            return "0";
        }
    };

    let updatedLossdeductionfinal = (node.data.lossdeductionfinal);
    let otherDedVal = node.data.otherdeductionfinal ? Number(node.data.otherdeductionfinal) : 0;

    console.log(node.data.otherdeductionfinal, 'hg');

    const confirmSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoadSent(true);
            let res = await axios.post(SERVICE.USER_PAYRUNDATA_LIMITED_FINAL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },

                employees: [data.companyname],

            });
            console.log(res.data.users, "sdf");
            let findSelectedMonthNum = months.find(d => d.value === node.data.selectedmonth).numval;

            function splitArray(array, chunkSize) {
                const resultarr = [];
                for (let i = 0; i < array.length; i += chunkSize) {
                    const chunk = array.slice(i, i + chunkSize);
                    resultarr.push({
                        data: chunk,
                        month: Number(findSelectedMonthNum),
                        year: Number(node.data.selectedyear),
                    });
                }
                return resultarr;
            }
            function splitArray2(array, chunkSize) {
                const resultarr2 = [];
                for (let i = 0; i < array.length; i += chunkSize) {
                    const chunk = array.slice(i, i + chunkSize);
                    resultarr2.push({
                        data: chunk,
                        month: Number(findSelectedMonthNum) + 1 >= 12 ? 1 : Number(findSelectedMonthNum) + 1,
                        year: Number(findSelectedMonthNum) + 1 >= 12 ? Number(node.data.selectedyear) + 1 : Number(node.data.selectedyear),
                    });
                }
                return resultarr2;
            }

            const resultarr = splitArray([data.companyname], 10);
            const resultarr2 = splitArray2([data.companyname], 10);
            console.log(resultarr2, 'resultarr2')
            let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Approved"),
            });

            let leaveresult = res_applyleave?.data?.applyleaves;

            async function sendBatchRequest(batch) {
                try {
                    let res_usershift = await axios.post(SERVICE.USER_ATTENDANCE_PAYRUN, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        employees: batch.data,
                        ismonth: batch.month,
                        isyear: batch.year,

                    });
                    let countByEmpcodeClockin = {}; // Object to store count for each empcode
                    let countByEmpcodeClockout = {};
                    // return res_usershift.data.finaluser;
                    let result = res_usershift?.data?.finaluser.flatMap((item, index) => {

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
                        const absentItems = res_usershift?.data?.finaluser?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

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
                            shiftallot: item.shiftallot,
                            weekOffDates: item.weekOffDates,
                            clockinstatus: updatedClockInStatus,
                            clockoutstatus: updatedClockOutStatus,
                            totalnumberofdays: item.totalnumberofdays,
                            empshiftdays: item.empshiftdays,
                            totalcounttillcurrendate: item.totalcounttillcurrendate,
                            totalshift: item.totalshift,
                            attendanceauto: getattendancestatus(updatedClockInStatus, updatedClockOutStatus),
                            daystatus: item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus),
                            lop: getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                            loptype: getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                            lopcalculation: getFinalLop(
                                getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                                getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                            ),
                            lopcount: getCount(
                                getFinalLop(
                                    getAttModeLop(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                                    getAttModeLopType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                                )
                            ),
                            modetarget: getAttModeTarget(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                            paidpresentbefore: getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                            paidleavetype: getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                            paidpresent: getFinalPaid(
                                getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                                getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
                            ),
                            paidpresentday: getAssignLeaveDayForPaid(
                                getFinalPaid(
                                    getAttModePaidPresent(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus)),
                                    getAttModePaidPresentType(item.attendanceautostatus ? item.attendanceautostatus : item.weekoffpresentstatus ? 'WEEKOFF PRESENT' : getattendancestatus(updatedClockInStatus, updatedClockOutStatus))
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
                    return finalresult
                } catch (error) {
                    console.error('Error in sending batch request:', error);
                    return [];
                }
            }


            async function getAllResults() {
                let allResults = [];
                let allResults2 = [];
                for (let batch of resultarr) {
                    const finaldata = await sendBatchRequest(batch);
                    allResults = allResults.concat(finaldata);

                }
                for (let batch of resultarr2) {
                    const finaldata = await sendBatchRequest(batch);
                    allResults2 = allResults2.concat(finaldata);

                }

                return { allResults, allResults2 }; // Return both results as an object
            }

            getAllResults().then(async (results) => {

                console.log('Final consolidated results for resultarr:', results.allResults);
                console.log('Final consolidated results for resultarr2:', results.allResults2);

                console.log(res.data.users, 'res.data.users');

                let emps = res.data.users;
                let finalresult = results.allResults;
                let finalresultNxt = results.allResults2;


                let findSelectedMonthNum = months.find(d => d.value === node.data.selectedmonth).numval;

                try {

                    // Fetch all necessary data
                    let [prodFilter, prodFilterNxt, penaltyFilter, res_employee, res_employeeNxt, Res] = await Promise.all([
                        axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            ismonth: Number(findSelectedMonthNum),
                            isyear: Number(node.data.selectedyear),
                        }),
                        axios.post(SERVICE.DAY_POINTS_MONTH_YEAR_FILTER_NXTMONTH, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            ismonth: Number(findSelectedMonthNum) >= 12 ? 1 : Number(findSelectedMonthNum) + 1,
                            isyear: Number(findSelectedMonthNum) >= 12 ? Number(node.data.selectedyear) + 1 : Number(node.data.selectedyear),
                        }),
                        axios.post(SERVICE.PENALTY_DAY_FILTERED, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            ismonth: Number(findSelectedMonthNum),
                            isyear: Number(node.data.selectedyear),
                        }),
                        axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            monthname: node.data.selectedmonth,
                            year: node.data.selectedyear,
                        }),
                        axios.post(SERVICE.DEPTMONTHSET_LIMITED, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            monthname: Number(findSelectedMonthNum) >= 12 ? "January" : monthsArr[Number(findSelectedMonthNum)],
                            year: Number(findSelectedMonthNum) >= 12 ? String((Number(node.data.selectedyear) + 1)) : node.data.selectedyear,
                        }),
                        axios.post(SERVICE.PAIDSTATUSFIX_LIMITED, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            month: node.data.selectedmonth,
                            year: node.data.selectedyear,
                        }),
                    ]);

                    // Extract data from responses
                    let dayPointsUser = prodFilter.data.answer;
                    let dayPointsUserNxtMonth = prodFilterNxt.data.answer;
                    let dayPenaltyUser = penaltyFilter.data.answer;
                    let monthSetDatas = res_employee.data.departmentdetails;
                    let monthSetsNxtDatas = res_employeeNxt.data.departmentdetails;
                    let paidStsFixData = Res?.data?.paidstatusfixs;

                    const itemsWithSerialNumber = emps?.map(async (item, index) => {
                        console.log("3", index)
                        let findTotalNoOfDays = finalresult.find((d) => d.company == item.company && d.branch == item.branch && d.department == item.department && d.team == item.team && d.empcode == item.empcode && d.unit == item.unit && d.username == item.companyname);
                        let findTotalNoOfDaysNxtMonth = finalresultNxt.find((d) => d.company == item.company && d.branch == item.branch && d.department == item.department && d.team == item.team && d.empcode == item.empcode && d.unit == item.unit && d.username == item.companyname);

                        const groupedByMonth = {};

                        // Group items by month
                        item.assignExpLog && item.assignExpLog.forEach((item) => {
                            const monthYear = item.updatedate.split("-").slice(0, 2).join("-");
                            if (!groupedByMonth[monthYear]) {
                                groupedByMonth[monthYear] = [];
                            }
                            groupedByMonth[monthYear].push(item);
                        });

                        // Extract the last item of each group
                        const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

                        // Filter the data array based on the month and year
                        lastItemsForEachMonth.sort((a, b) => {
                            return new Date(a.updatedate) - new Date(b.updatedate);
                        });
                        // Find the first item in the sorted array that meets the criteria
                        let filteredDataMonth = null;
                        for (let i = 0; i < lastItemsForEachMonth.length; i++) {
                            const date = lastItemsForEachMonth[i]?.updatedate;
                            const splitedDate = date?.split("-");
                            const itemYear = splitedDate ? splitedDate[0] : -1;
                            const itemMonth = splitedDate ? splitedDate[1] : -1; // Adding 1 because getMonth() returns 0-indexed month
                            if (Number(itemYear) === data.selectedyear && Number(itemMonth) === Number(findSelectedMonthNum)) {
                                filteredDataMonth = lastItemsForEachMonth[i];
                                break;
                            } else if (Number(itemYear) < data.selectedyear || (Number(itemYear) === data.selectedyear && Number(itemMonth) < Number(findSelectedMonthNum))) {
                                filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
                            } else {
                                break; // Break the loop if we encounter an item with year and month greater than selected year and month
                            }
                        }
                        // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
                        let modevalue = filteredDataMonth;

                        let selectedmonthnumalter = Number(findSelectedMonthNum) <= 9 ? `0${Number(findSelectedMonthNum)}` : findSelectedMonthNum;

                        let selectedMonStartDate = node.data.selectedyear + "-" + selectedmonthnumalter + "-01";



                        let findexp = monthSetDatas.find((d) => d.department === item.department);
                        let findexpNxt = monthSetsNxtDatas.find((d) => d.department === item.department);

                        let findDate = findexp ? findexp.fromdate : selectedMonStartDate;
                        console.log(findDate, 'findDate');
                        //NEXT MONTH MONTH START AND END DATE

                        let selectedmonthnumalterNxt = Number(findSelectedMonthNum) + 1 >= 12 ? "01" : Number(findSelectedMonthNum) + 1 <= 9 ? `0${Number(findSelectedMonthNum) + 1}` : Number(findSelectedMonthNum) + 1;

                        let Nxtmonth = Number(findSelectedMonthNum) + 1 >= 12 ? 1 : Number(findSelectedMonthNum) + 1;
                        let Nxtyear = Number(findSelectedMonthNum) + 1 >= 12 ? Number(node.data.selectedyear) + 1 : node.data.selectedyear;

                        const NxtnextMonthFirstDay = new Date(Number(Nxtyear), Number(Nxtmonth), 1);

                        // Subtract one day to get the last day of the given month
                        const lastDateNxtNextmonth = new Date(NxtnextMonthFirstDay - 1);

                        let lastdateOfNxtSelectedMonth = lastDateNxtNextmonth.getDate();

                        let selectedMonNxtStartDate = `${Nxtyear}-${selectedmonthnumalterNxt}-01`;

                        let selectedMonNxtEndDate = `${Nxtyear}-${selectedmonthnumalterNxt}-${lastdateOfNxtSelectedMonth}`;

                        let findNxtStartDate = findexpNxt ? findexpNxt.fromdate : selectedMonNxtStartDate;
                        let findNxtEndDate = findexpNxt ? findexpNxt.todate : selectedMonNxtEndDate;
                        console.log(findNxtStartDate, findNxtEndDate, 'findDate');

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
                                    months -= 1;
                                    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
                                }

                                // Adjust months for every 15 days
                                months += Math.floor(days / 16);

                                return months;
                            }
                        };

                        // Calculate difference in months between findDate and item.doj
                        let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
                        if (modevalue) {
                            //findexp end difference yes/no
                            if (modevalue.endexp === "Yes") {
                                differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
                                //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                                if (modevalue.expmode === "Add") {
                                    differenceInMonthsexp += parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Minus") {
                                    differenceInMonthsexp -= parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Fix") {
                                    differenceInMonthsexp = parseInt(modevalue.expval);
                                }
                            } else {
                                differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                                // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                                if (modevalue.expmode === "Add") {
                                    differenceInMonthsexp += parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Minus") {
                                    differenceInMonthsexp -= parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Fix") {
                                    differenceInMonthsexp = parseInt(modevalue.expval);
                                } else {
                                    // differenceInMonths = parseInt(modevalue.expval);
                                    differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                                }
                            }

                            //findtar end difference yes/no
                            if (modevalue.endtar === "Yes") {
                                differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
                                //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                                if (modevalue.expmode === "Add") {
                                    differenceInMonthstar += parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Minus") {
                                    differenceInMonthstar -= parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Fix") {
                                    differenceInMonthstar = parseInt(modevalue.expval);
                                }
                            } else {
                                differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                                if (modevalue.expmode === "Add") {
                                    differenceInMonthstar += parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Minus") {
                                    differenceInMonthstar -= parseInt(modevalue.expval);
                                } else if (modevalue.expmode === "Fix") {
                                    differenceInMonthstar = parseInt(modevalue.expval);
                                } else {
                                    // differenceInMonths = parseInt(modevalue.expval);
                                    differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
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
                                differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                            }
                        } else {
                            differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                            differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                            differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                        }


                        //GET PROCESS CODE FUNCTION
                        const groupedByMonthProcs = {};

                        // Group items by month
                        item.processlog && item.processlog.forEach((item) => {
                            const monthYear = item.date?.split("-")?.slice(0, 2).join("-");
                            if (!groupedByMonthProcs[monthYear]) {
                                groupedByMonthProcs[monthYear] = [];
                            }
                            groupedByMonthProcs[monthYear].push(item);
                        });

                        // Extract the last item of each group
                        const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                        // Filter the data array based on the month and year
                        lastItemsForEachMonthPros.sort((a, b) => {
                            return new Date(a.date) - new Date(b.date);
                        });
                        // Find the first item in the sorted array that meets the criteria
                        let filteredItem = null;
                        for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                            const date = lastItemsForEachMonthPros[i]?.date;
                            const splitedDate = date?.split("-");
                            const itemYear = splitedDate ? splitedDate[0] : -1;
                            const itemMonth = splitedDate ? splitedDate[1] : -1; // Adding 1 because getMonth() returns 0-indexed month
                            if (Number(itemYear) === Number(data.selectedyear) && Number(itemMonth) === Number(findSelectedMonthNum)) {
                                filteredItem = lastItemsForEachMonthPros[i];
                                break;
                            } else if (Number(itemYear) < Number(data.selectedyear) || (Number(itemYear) === Number(data.selectedyear) && Number(itemMonth) < Number(findSelectedMonthNum))) {
                                filteredItem = lastItemsForEachMonthPros[i]; // Keep updating the filteredItem until the criteria is met
                            } else {
                                break; // Break the loop if we encounter an item with year and month greater than selected year and month
                            }
                        }
                        let CHECK_DEPARTMENT_ACCESS = departmentsList.find((d) => d.deptname === item.department);

                        let getprocessCode = filteredItem ? filteredItem.process : "";
                        // console.log(getprocessCode, 'getprocessCode', filteredItem, 'filteredItem')
                        // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
                        let processcodeexpvalue = item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "";

                        //findsalary from salaryslab
                        let findSalDetails = salSlabs.find((d) => d.company === item.company && d.branch === item.branch && d.salarycode === processcodeexpvalue);
                        //shortageamount from shortage master
                        let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
                        //revenue amount from revenue  master
                        let findRevenueAllow = revenueAmount.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvalue);
                        //finderaamount from eraamount
                        let findERAaountValue = eraAmounts.find((d) => d.company === item.company && d.branch === item.branch && d.processcode === processcodeexpvalue);

                        let findAcPointVal = acPointCal.find((d) => d.company === item.company && d.branch === item.branch && d.department === item.department);


                        //FIND SELECTEDMONTH MONTH END DATE
                        const nextMonthFirstDay = new Date(Number(data.selectedyear), Number(findSelectedMonthNum), 1);

                        // Subtract one day to get the last day of the given month
                        const lastDate = new Date(nextMonthFirstDay - 1);

                        let lastdateOfSelectedMonth = lastDate.getDate();
                        let selectedMonEndDate = `${data.selectedyear}-${selectedmonthnumalter}-${lastdateOfSelectedMonth}`;
                        let findmonthenddate = (findexp ? findexp.todate : selectedMonEndDate)
                        //GET POINTS FOR SELECTEDMONTH
                        let getdayPointsMonth = dayPointsUser
                            .filter(
                                (d) =>
                                    // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
                                    d.date >= findDate && d.date <= (findexp ? findexp.todate : selectedMonEndDate)
                            )
                            .reduce((acc, current) => {
                                const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

                                if (existingItemIndex !== -1) {
                                    // Update existing item
                                    const existingItem = acc[existingItemIndex];

                                    existingItem.point += Number(current.point);
                                    // existingItem.daypoint += Number(current.daypoint);
                                    existingItem.target += Number(current.target);
                                    existingItem.date.push(current.date);

                                    existingItem.allowancepoint += Number(current.allowancepoint);
                                    if (current.allowancepoint > 1) {
                                        existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
                                    }

                                    existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

                                    // Convert the dates array to Date objects
                                    const dateObjects = existingItem.date.map((date) => new Date(date));

                                    // Find the earliest (from) and latest (to) dates
                                    const fromDate = new Date(Math.min(...dateObjects));
                                    const toDate = new Date(Math.max(...dateObjects));
                                    // Update start and end date
                                    existingItem.startDate = fromDate;
                                    existingItem.endDate = toDate;
                                } else {
                                    // Add new item
                                    acc.push({
                                        companyname: current.companyname,
                                        name: current.name,
                                        // daypoint: Number(current.daypoint),
                                        avgpoint: (Number(current.point) / Number(current.target)) * 100,
                                        point: Number(current.point),
                                        target: Number(current.target),
                                        // _id: current.id,
                                        branch: current.branch,
                                        date: [current.date],
                                        unit: current.unit,
                                        team: current.team,
                                        empcode: current.empcode,
                                        // doj: current.doj,
                                        // department: current.department,
                                        // prod: current.prod,
                                        startDate: current.date,
                                        endDate: current.date,
                                        allowancepoint: Number(current.allowancepoint),
                                        // noallowancepoint:Number(current.noallowancepoint),
                                        noallowancepoint: current.allowancepoint > 0 ? 1 : 0,
                                    });
                                }
                                return acc;
                            }, []);

                        let findPointsDetails = getdayPointsMonth.find(
                            (d) => d.companyname == item.company && d.branch == item.branch && d.unit == item.unit && d.team == item.team && d.name == item.companyname
                            // && d.empcode === item.empcode
                        );

                        //GET POINTS FOR CURRENT MONTH WHICH IS THE AFTER MONTH OF SELECTED MONTH
                        let getdayPointsMonthNxtMonth = dayPointsUserNxtMonth
                            .filter(
                                (d) =>
                                    // console.log(   d.date , findDate , d.date , (findexp ? findexp.todate : selectedMonEndDate))
                                    d.date >= findNxtStartDate && d.date <= findNxtEndDate
                            )
                            .reduce((acc, current) => {
                                const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.companyname === current.companyname && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

                                if (existingItemIndex !== -1) {
                                    // Update existing item
                                    const existingItem = acc[existingItemIndex];

                                    existingItem.point += Number(current.point);
                                    // existingItem.daypoint += Number(current.daypoint);
                                    existingItem.target += Number(current.target);
                                    existingItem.date.push(current.date);

                                    existingItem.allowancepoint += Number(current.allowancepoint);
                                    if (current.allowancepoint > 1) {
                                        existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
                                    }

                                    existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

                                    // Convert the dates array to Date objects
                                    const dateObjects = existingItem.date.map((date) => new Date(date));

                                    // Find the earliest (from) and latest (to) dates
                                    const fromDate = new Date(Math.min(...dateObjects));
                                    const toDate = new Date(Math.max(...dateObjects));
                                    // Update start and end date
                                    existingItem.startDate = fromDate;
                                    existingItem.endDate = toDate;
                                } else {
                                    // Add new item
                                    acc.push({
                                        companyname: current.companyname,
                                        name: current.name,
                                        // daypoint: Number(current.daypoint),
                                        avgpoint: (Number(current.point) / Number(current.target)) * 100,
                                        point: Number(current.point),
                                        target: Number(current.target),
                                        // _id: current.id,
                                        branch: current.branch,
                                        date: [current.date],
                                        unit: current.unit,
                                        team: current.team,
                                        empcode: current.empcode,

                                        startDate: current.date,
                                        endDate: current.date,
                                        allowancepoint: Number(current.allowancepoint),

                                        noallowancepoint: current.allowancepoint > 0 ? 1 : 0,
                                    });
                                }
                                return acc;
                            }, []);

                        let findPointsDetailsNxtMonth = getdayPointsMonthNxtMonth.find(
                            (d) => d.companyname == item.company && d.branch == item.branch && d.unit == item.unit && d.team == item.team && d.name == item.companyname
                            // && d.empcode === item.empcode
                        );

                        // console.log(dayPointsUserNxtMonth.length, findNxtStartDate, findNxtEndDate, "dayPointsUserNxtMonth");

                        let getdayPenaltyMonth = dayPenaltyUser
                            .filter((d) => d.date >= findDate && d.date <= (findexp ? findexp.todate : lastdateOfSelectedMonth))
                            .reduce((acc, current) => {
                                const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

                                if (existingItemIndex !== -1) {
                                    // Update existing item
                                    const existingItem = acc[existingItemIndex];

                                    existingItem.amount += Number(current.amount);

                                    existingItem.date.push(current.date);

                                    // Convert the dates array to Date objects
                                    const dateObjects = existingItem.date.map((date) => new Date(date));

                                    // Find the earliest (from) and latest (to) dates
                                    const fromDate = new Date(Math.min(...dateObjects));
                                    const toDate = new Date(Math.max(...dateObjects));
                                    // Update start and end date
                                    existingItem.startDate = fromDate;
                                    existingItem.endDate = toDate;
                                } else {
                                    // Add new item
                                    acc.push({
                                        company: current.company,
                                        name: current.name,
                                        amount: Number(current.amount),
                                        _id: current.id,
                                        branch: current.branch,
                                        date: [current.date],
                                        unit: current.unit,
                                        team: current.team,
                                        empcode: current.empcode,
                                        startDate: current.date,
                                        endDate: current.date,
                                    });
                                }
                                return acc;
                            }, []);
                        let experienceinmonthCalcVal = item.doj ? calculateMonthsBetweenDates(item.doj, findDate) : 0;


                        let findPenaltyDetails = getdayPenaltyMonth.find((d) => d.company === item.company && d.branch === item.branch && d.unit === item.unit && d.team === item.team && d.name === item.companyname);
                        // REVENUE AMOUNT
                        let revenueAmountCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (findRevenueAllow ? Number(findRevenueAllow.amount) : 0) : 0;


                        let shiftAllowAmt =
                            item.shiftallowancelog && item.shiftallowancelog.length > 0
                                ? item.shiftallowancelog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];

                        let TargetPointAmt =
                            item.targetpointlog && item.targetpointlog.length > 0
                                ? item.targetpointlog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];

                        let AcheivedPointAmt =
                            item.acheivedpointlog && item.acheivedpointlog.length > 0
                                ? item.acheivedpointlog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];
                        let PenaltyPointAmt =
                            item.penaltylog && item.penaltylog.length > 0
                                ? item.penaltylog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];
                        let totalPaidDaysLogVal =
                            item.totalpaiddayslog && item.totalpaiddayslog.length > 0
                                ? item.totalpaiddayslog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];
                        let totalAbsentLogVal =
                            item.totalabsentlog && item.totalabsentlog.length > 0
                                ? item.totalabsentlog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];
                        let currMonAvgLogVal =
                            item.currmonthavglog && item.currmonthavglog.length > 0
                                ? item.currmonthavglog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];
                        let currMonAttLogVal =
                            item.currmonthattlog && item.currmonthattlog.length > 0
                                ? item.currmonthattlog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];

                        let noShiftLogVal =
                            item.noshiftlog && item.noshiftlog.length > 0
                                ? item.noshiftlog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];

                        let shiftAllowTargetlogVal =
                            item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0
                                ? item.shiftallowtargetlog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];
                        let nightShiftAllowlogLogVal =
                            item.nightshiftallowlog && item.nightshiftallowlog.length > 0
                                ? item.nightshiftallowlog.filter((d) => {
                                    return d.month === node.data.selectedmonth && d.year == node.data.selectedyear;
                                })
                                : [];

                        let paidpresentdayvalue = findTotalNoOfDays ? findTotalNoOfDays.paidpresentday : 0;
                        let leaveCountvalue = findTotalNoOfDays ? findTotalNoOfDays.leaveCount : 0;
                        let holidayCountvalue = findTotalNoOfDays ? findTotalNoOfDays.holidayCount : 0;
                        let shiftvalue = findTotalNoOfDays ? findTotalNoOfDays.shift : 0;
                        let lopcountvalue = findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0;

                        let paiddayscalcvalfrommonthstatus = Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue) > Number(shiftvalue) ? Number(shiftvalue) - Number(lopcountvalue) : Number(paidpresentdayvalue) + Number(leaveCountvalue) + Number(holidayCountvalue);

                        let paidpresentdayallCalcVal = shiftvalue;
                        let totalshiftCalcVal = Number(paidpresentdayallCalcVal);
                        let totalasbleaveCalcVal = item.totalabsentlog && item.totalabsentlog.length > 0 && totalAbsentLogVal && totalAbsentLogVal.length > 0 ? Number(totalAbsentLogVal[totalAbsentLogVal.length - 1].value) : findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0;
                        let totalpaiddaycalVal = item.totalpaiddayslog && item.totalpaiddayslog.length > 0 &&
                            totalPaidDaysLogVal && totalPaidDaysLogVal.length > 0 ?
                            Number(totalPaidDaysLogVal[totalPaidDaysLogVal.length - 1].value) : paiddayscalcvalfrommonthstatus;

                        let pfvalues = item.assignpfesilog && item.assignpfesilog.length > 0 ? item.assignpfesilog[0] : {};
                        let targetPointCalcVaue = item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 ? TargetPointAmt[TargetPointAmt.length - 1].value : (findPointsDetails ? findPointsDetails.target : 0);

                        let AcheivedPointsCalcVal = item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0 ?
                            Number(AcheivedPointAmt[AcheivedPointAmt.length - 1].value) : findPointsDetails ? Number(Number(findPointsDetails.point).toFixed(2)) : 0;

                        let AcheivedPercentCalcVal =
                            item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0 && item.acheivedpointlog &&
                                item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0
                                ?
                                Number(TargetPointAmt[TargetPointAmt.length - 1].value > 0) ? (((Number(AcheivedPointAmt[AcheivedPointAmt.length - 1].value) / Number(TargetPointAmt[TargetPointAmt.length - 1].value)) * 100).toFixed(2)) : 0
                                :
                                item.targetpointlog && item.targetpointlog.length > 0 && TargetPointAmt && TargetPointAmt.length > 0
                                    ?
                                    Number(TargetPointAmt[TargetPointAmt.length - 1].value > 0) ? (((Number(findPointsDetails ? findPointsDetails.point : 0) / Number(TargetPointAmt[TargetPointAmt.length - 1].value)) * 100).toFixed(2)) : 0
                                    :
                                    item.acheivedpointlog && item.acheivedpointlog.length > 0 && AcheivedPointAmt && AcheivedPointAmt.length > 0
                                        ?
                                        (findPointsDetails ? findPointsDetails.target : 0) > 0 ? ((AcheivedPointAmt[AcheivedPointAmt.length - 1].value / (findPointsDetails ? findPointsDetails.target : 0)) * 100).toFixed(2) : 0
                                        :
                                        findPointsDetails ? Number(findPointsDetails.avgpoint.toFixed(2)) : 0;

                        let allowancepointCalcVal = item.shiftallowancelog && item.shiftallowancelog.length > 0 && shiftAllowAmt && shiftAllowAmt.length > 0 ? shiftAllowAmt[shiftAllowAmt.length - 1].value : (findPointsDetails ? findPointsDetails.allowancepoint.toFixed(2) : 0);
                        let ERAAmountCalcVal = findERAaountValue ? findERAaountValue.amount : 0;
                        let penaltyCalcVal = item.penaltylog && item.penaltylog.length > 0 && PenaltyPointAmt && PenaltyPointAmt.length > 0 ? Number(PenaltyPointAmt[PenaltyPointAmt.length - 1].value).toFixed(2) : (findPenaltyDetails ? Number(findPenaltyDetails.amount.toFixed(2)) : 0);

                        let totalNoOfDaysCalcVal = findTotalNoOfDays ? Number(findTotalNoOfDays.totalcounttillcurrendate) : 0;

                        //PRODUCTION AND PRODCTION ALLOWACE2
                        let oldprodAllowanceCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.productionallowance : findSalDetails ? findSalDetails.productionallowance : 0;
                        let oldprodAllowancetwoCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.productionallowancetwo : findSalDetails ? findSalDetails.productionallowancetwo : 0;
                        // ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
                        let oldactualBasicCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.basic : findSalDetails ? findSalDetails.basic : 0;
                        let oldactualHraCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.hra : findSalDetails ? findSalDetails.hra : 0;
                        let oldactualConveyanceCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.conveyance : findSalDetails ? findSalDetails.conveyance : 0;
                        let oldactualMedicalAllowCalcVal = modevalue && modevalue.expmode === "Manual" ? modevalue.medicalallowance : findSalDetails ? findSalDetails.medicalallowance : 0;
                        let oldactualOtherCalVAL = modevalue && modevalue.expmode === "Manual" ? modevalue.otherallowance : findSalDetails ? findSalDetails.otherallowance : 0;



                        const getDatesInRange = (fromDate, toDate) => {
                            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                            const startDate = new Date(fromDate);
                            const endDate = new Date(toDate);

                            // Add one day to include the end date
                            endDate.setDate(endDate.getDate() + 1);

                            let count = 0;
                            for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
                                count++;
                            }

                            return count;
                        };

                        let tond = getDatesInRange(findDate, findmonthenddate)


                        let prodAllowanceCalcVal = Number(((Number(oldprodAllowanceCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
                        let prodAllowancetwoCalcVal = Number(((Number(oldprodAllowancetwoCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
                        //calculated  ACUTAL BASIC/HRA/CONVEYACE/MEDICAL/OTHER ALLOWANCE
                        let actualBasicCalcVal = Number(((Number(oldactualBasicCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));

                        let actualHraCalcVal = Number(((Number(oldactualHraCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
                        let actualConveyanceCalcVal = Number(((Number(oldactualConveyanceCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
                        let actualMedicalAllowCalcVal = Number(((Number(oldactualMedicalAllowCalcVal) / tond) * totalNoOfDaysCalcVal).toFixed(2));
                        let actualOtherCalVAL = Number(((Number(oldactualOtherCalVAL) / tond) * totalNoOfDaysCalcVal).toFixed(2));

                        let oldgross = modevalue && modevalue.expmode === "Manual" ? modevalue.gross :
                            Number(oldactualBasicCalcVal) + Number(oldactualHraCalcVal) + Number(oldactualConveyanceCalcVal) + Number(oldactualMedicalAllowCalcVal) +
                            Number(oldprodAllowanceCalcVal) + Number(oldactualOtherCalVAL)

                        let grossValue = modevalue && modevalue.expmode === "Manual" ? modevalue.gross :
                            actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal +
                            prodAllowanceCalcVal + actualOtherCalVAL

                        ///FINAL-FIXED-PROD SALARY CALCULATION STARTED--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

                        let findPFpercentage = modevalue && modevalue.expmode === "Manual" ? modevalue.pfemployeepercentage : findSalDetails ? findSalDetails.pfemployeepercentage : 0;
                        let findESIpercentage = modevalue && modevalue.expmode === "Manual" ? modevalue.esiemployeepercentage : findSalDetails ? findSalDetails.esiemployeepercentage : 0;
                        let findEsiMAXSalary = findSalDetails ? Number(findSalDetails.esimaxsalary) : 0;
                        let findEmployerPercentage = findSalDetails ? Number(findSalDetails.pfpercentage) : 0;
                        let findEmployerESIPercentage = findSalDetails ? Number(findSalDetails.esipercentage) : 0;


                        //ATTENDANCE LOP CALCUCLATION
                        let attendanceLopCalVal = totalshiftCalcVal > 0 ? (((actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL) / totalshiftCalcVal) * Number(totalasbleaveCalcVal)) : 0;
                        //ACHEIVED PRODUCTION ALLOWANCE
                        let acheivedProductionAllowanceValCal = (AcheivedPointsCalcVal ? Number(AcheivedPointsCalcVal) : 0) > 0 && Number(targetPointCalcVaue ? targetPointCalcVaue : 0) ? (AcheivedPointsCalcVal < targetPointCalcVaue ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01) : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)) : 0;

                        //LOP BASIC
                        let lopBasicValCal = totalNoOfDaysCalcVal > 0 ? (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? ((Number(actualBasicCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal) : ((Number(actualBasicCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal)) : 0;

                        let lopHRAValCal = totalNoOfDaysCalcVal > 0 ? (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? (Number(actualHraCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualHraCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                        let lopConveyValCal = totalNoOfDaysCalcVal > 0 ? (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? (Number(actualConveyanceCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualConveyanceCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                        let lopMedicalValCal = totalNoOfDaysCalcVal > 0 ? (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? (Number(actualMedicalAllowCalcVal) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualMedicalAllowCalcVal) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                        let lopOtherValCal = totalNoOfDaysCalcVal > 0 ? (((Number(totalpaiddaycalVal) + Number(totalasbleaveCalcVal)) > Number(totalNoOfDaysCalcVal)) ? (Number(actualOtherCalVAL) / (totalasbleaveCalcVal + totalpaiddaycalVal)) * totalNoOfDaysCalcVal : (Number(actualOtherCalVAL) / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                        let lopProductionAllowance = AcheivedPointsCalcVal && Number(AcheivedPointsCalcVal) > 0 ? (AcheivedPointsCalcVal < targetPointCalcVaue ? Number(prodAllowanceCalcVal) - (prodAllowancetwoCalcVal ? Number(prodAllowancetwoCalcVal) : 0) * ((100 - (Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01) : Number(prodAllowanceCalcVal) * (((Number(AcheivedPointsCalcVal ? AcheivedPointsCalcVal : 0) * 100) / Number(targetPointCalcVaue ? targetPointCalcVaue : 0)) * 0.01)) : 0;
                        //  AcheivedPointsCalcVal > 0 ? (AcheivedPointsCalcVal < targetPointCalcVaue ? prodAllowanceCalcVal - (prodAllowancetwoCalcVal * (100 - (AcheivedPointsCalcVal * 100) / targetPointCalcVaue)) * 0.01 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal) : 0;

                        //PROD BASIC
                        let prodBasicValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopBasicValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopBasicValCal : lopBasicValCal + (lopBasicValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                        //PROD HRA
                        let prodHraValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopHRAValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopHRAValCal : lopHRAValCal + (lopHRAValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;
                        //PROD CONVEYANCE
                        let prodConveyanceValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopConveyValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopConveyValCal : lopConveyValCal + (lopConveyValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

                        //PROD MEDICAL ALLOWANCE
                        let prodMEDAllowanceValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopMedicalValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopMedicalValCal : lopMedicalValCal + (lopMedicalValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

                        //PROD OTHER ALLOWANCE
                        let prodOtherValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopOtherValCal : acheivedProductionAllowanceValCal === 0 ? 0 : acheivedProductionAllowanceValCal > 0 ? lopOtherValCal : lopOtherValCal + (lopOtherValCal * ((100 * acheivedProductionAllowanceValCal) / (lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopOtherValCal))) / 100;

                        //PROD PRODUCTION ALLOWANCE
                        let prodPRODValCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? lopProductionAllowance : acheivedProductionAllowanceValCal > 0 ? acheivedProductionAllowanceValCal : 0;

                        let penaltyAmtCalculationVal = Number(experienceinmonthCalcVal) <= 0 ? 0 : Number(experienceinmonthCalcVal) >= 1 ? (Number(experienceinmonthCalcVal) >= 2 ? (Number(experienceinmonthCalcVal) >= 3 ? (Number(experienceinmonthCalcVal) >= 4 ? Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0 : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.25) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.5) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 0.75) : Number(penaltyCalcVal) - Number(penaltyCalcVal) * 1;

                        let calcNetSalaryValCalc = lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal;

                        let ProdNetSalaryFinal = prodBasicValCalc + prodHraValCalc + prodConveyanceValCalc + prodMEDAllowanceValCalc + prodPRODValCalc + prodOtherValCalc

                        let lossDed = updatedLossdeductionfinal;
                        let OtherDed = otherDedVal;

                        let finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                        let finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                        let finalConveyValCalc = prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

                        let finalMedicalAllowValcCalc = prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                        let finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                        let finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

                        let finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;

                        //PFDAYS AND PFDEDUCTION
                        let pfdatcal = 0;
                        let daysp = totalshiftCalcVal - totalasbleaveCalcVal;
                        let IsExDate = pfvalues.pfenddate ? pfvalues.pfenddate : false;
                        //Dftdate = pfesifromdate findDate = monthstart fromdate or month fromdate
                        let pfmode = pfvalues.pffromdate > findDate ? "S" : IsExDate ? "E" : "ALL";
                        let PLOP = (findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0) + (findTotalNoOfDays ? findTotalNoOfDays.clsl : 0);

                        pfdatcal = pfmode === "S" || pfmode === "E" ? pfdatcal + (findTotalNoOfDays && findTotalNoOfDays.weekoff) + (findTotalNoOfDays && findTotalNoOfDays.clsl) + totalshiftCalcVal : totalshiftCalcVal + PLOP;
                        let PfDate = daysp >= pfdatcal ? ((IsExDate === true && item.pfesienddate) < findDate ? 0 : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : Number(daysp) + Number(totalasbleaveCalcVal);

                        let pfDaysVal = pfvalues.pfdeduction === true ? Number(PfDate) : 0;
                        let pfAmount = pfvalues.pfdeduction === true ? Number(findPFpercentage) / 100 : 0;

                        let PF_deduction = (pfDaysVal > 0 && totalshiftCalcVal > 0) ? (((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2)) : 0;

                        //  let PF_deduction  = ((pfDaysVal >= totalshiftCalcVal) ? (finalBasicValCalc * (Number(findPFpercentage)/100)) : ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal) * (Number(findPFpercentage)/100)) : 0
                        // FIND SHIFTALLOWACE
                        let checkShiftAllowApplies = shifts.find((d) => d.name === item.shifttiming);
                        let CHECKSHIFTALLOWANCE = checkShiftAllowApplies ? checkShiftAllowApplies.isallowance : "Disable";

                        let noshiftlogvalfinal = item.noshiftlog && item.noshiftlog.length > 0 && noShiftLogVal && noShiftLogVal.length > 0 ? Number(noShiftLogVal[noShiftLogVal.length - 1].value) : (findPointsDetails ? findPointsDetails.noallowancepoint : 0);

                        let shiftallowancetarget = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? targetPointCalcVaue : 0;
                        let shiftallowancetargetfinal = item.shiftallowtargetlog && item.shiftallowtargetlog.length > 0 && shiftAllowTargetlogVal && shiftAllowTargetlogVal.length > 0 ? Number(shiftAllowTargetlogVal[shiftAllowTargetlogVal.length - 1].value) : shiftallowancetarget;

                        let nightAllowancefinalcalculation = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? ((((1000 / totalNoOfDaysCalcVal) * totalpaiddaycalVal) * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100) : 0;


                        let nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;

                        //ESI-DEDCUTIONss
                        let Esiper = pfvalues.esideduction === true ? Number(findEmployerESIPercentage) / 100 : 0;

                        let ESI_deduction = grossValue >= findEsiMAXSalary ? 0 : (pfDaysVal > 0 && totalshiftCalcVal > 0) ? (((finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal) * Esiper) : 0;
                        // console.log(  ( Number(totalNoOfDaysCalcVal) , (Math.abs(Math.round(((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal))))), "round1")
                        let ncpDaysVal =
                            totalpaiddaycalVal > 0
                                ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
                                (Number(totalNoOfDaysCalcVal) - (Math.abs(Math.round(((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)))))
                                : 0;

                        let finalLOPDaysCalcVal =
                            Math.round(Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0
                                : (Number(totalshiftCalcVal) - ((Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)))) < Number(totalshiftCalcVal) ?
                                Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) : Number(totalshiftCalcVal))

                        // let findlopvaluecalc =    Number(totalasbleaveCalcVal) + 
                        // (
                        //     (Number(actualBasicCalcVal) === 0 ? 0 : ( Number(totalshiftCalcVal) - ((Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal))   )    ) 
                        //   )

                        // let finalLOPDaysCalcVal = Number(findlopvaluecalc) <   Number(totalshiftCalcVal) ?  Number(findlopvaluecalc)  : Number(totalshiftCalcVal) ;


                        let paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 :
                            (totalshiftCalcVal) - (Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)) < 0 ? 0
                                : ((totalshiftCalcVal) - (Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)))

                        let finalLeaveDeductionValCalc =
                            //  totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * ((totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue).toFixed(0) < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);
                            (totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0) ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue);

                        let findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && d.fromamount <= finalNetSalaryValcCalc && d.toamount >= finalNetSalaryValcCalc);

                        let profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

                        let totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);

                        let finalSalaryCalcVal = ((finalNetSalaryValcCalc - totalDeductionValCalc) + nightAllowanceCalcVal) > grossValue && AcheivedPercentCalcVal < 100 ? grossValue : (finalNetSalaryValcCalc - totalDeductionValCalc) + nightAllowanceCalcVal;
                        let finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;
                        let Mvalue = (findAcPointVal ? Number(findAcPointVal.multiplevalue) : 0);
                        let Dvalue = (findAcPointVal ? Number(findAcPointVal.dividevalue) : 0);
                        let totalPointsValueCalc = ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue) ? ((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue).toFixed(2) : Number(0).toFixed(2);


                        let acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

                        let pfAmount1 = findEmployerPercentage;

                        let PF_Emper_deduction = pfAmount1 > 0 && totalshiftCalcVal > 0 ? ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal * (pfAmount1 / 100)) : 0;

                        //ESI-DEDCUTION
                        let ESI_EMPR_Perncetage = pfvalues.esideduction === true ? Number(findESIpercentage) / 100 : 0;

                        let ESI_EMPR_deduction = Number(grossValue) >= (findEsiMAXSalary) ? 0 : pfDaysVal > 0 && totalshiftCalcVal > 0 ? ((finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal) * ESI_EMPR_Perncetage : 0;

                        let CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

                        let finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

                        let final_Value_PenaltyCalcval = finalValueCalcVal - (penaltyAmtCalculationVal + OtherDed);

                        final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

                        let ShortageCalVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? findShortage && Number(findShortage.amount) : 0;
                        let Shortage1ValCalc = ShortageCalVal > 0 ? (CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.era === true ? (Number(ShortageCalVal) * Number(totalpaiddaycalVal)) / Number(totalNoOfDaysCalcVal) : 0) : 0;

                        let acutalDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? ((Number(totalPointsValueCalc) + Number(revenueAmountCalc)) - ((Number(CTC_Calcval) + Number(Shortage1ValCalc))) >= 0 ? 0 : (Number(totalPointsValueCalc) + Number(revenueAmountCalc)) - ((Number(CTC_Calcval) + Number(Shortage1ValCalc)))) : 0;

                        let minimumDeductionCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? ((Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal)) >= 0 ? 0 : (Number(Shortage1ValCalc) + Number(acutalDeductionCalcVal))) : 0;



                        let LossDeduction = Number(minimumDeductionCalcVal) + ((Number(acutalDeductionCalcVal) - Number(OtherDed)) - Number(minimumDeductionCalcVal));

                        lossDed = LossDeduction > 0 ? Number(LossDeduction) : (Number(-1) * Number(LossDeduction));

                        // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

                        // RCALCULATION AFTER FIND LOSS DEDUCTION

                        if (calcNetSalaryValCalc > 0) {
                            finalBasicValCalc = prodBasicValCalc === 0 ? 0 : prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodBasicValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                            finalHraValCalc = prodHraValCalc === 0 ? 0 : prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodHraValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                            finalConveyValCalc = prodConveyanceValCalc === 0 ? 0 : prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodConveyanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

                            finalMedicalAllowValcCalc = prodMEDAllowanceValCalc === 0 ? 0 : prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodMEDAllowanceValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                            finalOtherValcCalc = prodOtherValCalc === 0 ? 0 : prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodOtherValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;
                            finalProductionValcCalc = prodPRODValCalc === 0 ? 0 : prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) > 0 ? prodPRODValCalc * ((((ProdNetSalaryFinal - (penaltyAmtCalculationVal + lossDed + OtherDed)) * 100) / ProdNetSalaryFinal) * 0.01) : 0;

                            finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;
                        }

                        finalBasicValCalc = finalBasicValCalc > 0 ? finalBasicValCalc : 0;
                        finalHraValCalc = finalHraValCalc > 0 ? finalHraValCalc : 0;
                        finalConveyValCalc = finalConveyValCalc > 0 ? finalConveyValCalc : 0;

                        finalMedicalAllowValcCalc = finalMedicalAllowValcCalc > 0 ? finalMedicalAllowValcCalc : 0;
                        finalOtherValcCalc = finalOtherValcCalc > 0 ? finalOtherValcCalc : 0;
                        finalProductionValcCalc = finalProductionValcCalc > 0 ? finalProductionValcCalc : 0;

                        finalNetSalaryValcCalc = finalBasicValCalc + finalHraValCalc + finalConveyValCalc + finalMedicalAllowValcCalc + finalProductionValcCalc + finalOtherValcCalc;

                        PF_deduction = pfDaysVal > 0 ? ((Number(finalBasicValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                        ESI_deduction = grossValue >= findEsiMAXSalary ? 0 : (pfDaysVal > 0 && totalshiftCalcVal > 0) ? ((finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal) * Esiper : 0;


                        let ncpvaluecalc = (Number(totalNoOfDaysCalcVal) - (Math.round(((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal))))
                        let ncpvaluecalc1 = (Number(totalNoOfDaysCalcVal) - (Math.round(((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal))))

                        ncpDaysVal =
                            totalpaiddaycalVal > 0
                                ? // ( totalNoOfDaysCalcVal - ((((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal) - (totalNoOfDaysCalcVal - pfDaysVal)).toFixed(0)) )
                                // totalNoOfDaysCalcVal - Math.round((finalBasicValCalc * totalNoOfDaysCalcVal) / actualBasicCalcVal - (totalNoOfDaysCalcVal - pfDaysVal))
                                (pfvalues.pfdeduction === true ? (ncpvaluecalc) : ncpvaluecalc1)

                                : 0;

                        finalLOPDaysCalcVal =
                            Math.round(Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0
                                : (Number(totalshiftCalcVal) - ((Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)))) < Number(totalshiftCalcVal) ?
                                Number(totalasbleaveCalcVal) + (Number(actualBasicCalcVal) === 0 ? 0 : Number(totalshiftCalcVal) - (Number(totalshiftCalcVal) * Number(finalBasicValCalc)) / Number(actualBasicCalcVal)) : Number(totalshiftCalcVal))

                        paySlipLopCalval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 :
                            (totalshiftCalcVal) - (Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)) < 0 ? 0
                                : ((totalshiftCalcVal) - (Math.round((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)))

                        finalLeaveDeductionValCalc = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * ((totalshiftCalcVal - ((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)) < 0 ? 0 :
                            (totalshiftCalcVal - ((totalshiftCalcVal * finalNetSalaryValcCalc) / grossValue)));

                        findprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && d.fromamount <= finalNetSalaryValcCalc && d.toamount >= finalNetSalaryValcCalc);

                        profTaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

                        totalDeductionValCalc = Number(profTaxCalcVal) + Number(ESI_deduction) + Number(PF_deduction);
                        nightAllowancefinalcalculation = (CHECKSHIFTALLOWANCE === "Enable" && totalNoOfDaysCalcVal > 0) ? ((((1000 / totalNoOfDaysCalcVal) * totalpaiddaycalVal) * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / shiftallowancetargetfinal : 0)) / 100) : 0;

                        nightAllowanceCalcVal = item.nightshiftallowlog && item.nightshiftallowlog.length > 0 && nightShiftAllowlogLogVal && nightShiftAllowlogLogVal.length > 0 ? Number(nightShiftAllowlogLogVal[nightShiftAllowlogLogVal.length - 1].value) : nightAllowancefinalcalculation;


                        finalSalaryCalcVal = (((finalNetSalaryValcCalc - totalDeductionValCalc) + nightAllowanceCalcVal) > grossValue) && (Number(AcheivedPercentCalcVal) < 100) ? grossValue : ((Number(finalNetSalaryValcCalc) - Number(totalDeductionValCalc)) + Number(nightAllowanceCalcVal));
                        finalSalary_Penalty = finalSalaryCalcVal + penaltyAmtCalculationVal > 0 ? (finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed > grossValue ? finalSalaryCalcVal : finalSalaryCalcVal + penaltyAmtCalculationVal + lossDed + OtherDed) : 0;

                        pfAmount1 = findEmployerPercentage;

                        PF_Emper_deduction = pfAmount1 > 0 && totalshiftCalcVal > 0 ? ((finalBasicValCalc / totalshiftCalcVal) * pfDaysVal * (pfAmount1 / 100)) : 0;

                        ESI_EMPR_deduction = grossValue >= findEsiMAXSalary ? 0 : (pfDaysVal > 0 && totalshiftCalcVal > 0) ? (((finalNetSalaryValcCalc / totalshiftCalcVal) * pfDaysVal) * ESI_EMPR_Perncetage) : 0;

                        CTC_Calcval = Number(finalSalaryCalcVal) + Number(ESI_deduction) + Number(PF_deduction) + Number(ESI_EMPR_deduction) + Number(PF_Emper_deduction) + Number(profTaxCalcVal);

                        finalValueCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === true ? Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(CTC_Calcval)) + Number(revenueAmountCalc) : 0;

                        final_Value_PenaltyCalcval = finalValueCalcVal - (penaltyAmtCalculationVal + OtherDed);

                        final_Value_PenaltyCalcval = final_Value_PenaltyCalcval > 0 ? (finalValueCalcVal >= grossValue ? finalValueCalcVal : final_Value_PenaltyCalcval) : 0;

                        let finalValueReviewCalc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval < -acutalERAValCalc ? "REVENUE LOSS" : "OK") : "";

                        let finalValueStatus = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (finalValueCalcVal > -10000 ? (finalValueCalcVal >= -2000 ? (finalValueCalcVal >= 0 ? (finalValueCalcVal >= 2000 ? (finalValueCalcVal >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";

                        let revenuePenaltyStatus = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (final_Value_PenaltyCalcval > -10000 ? (final_Value_PenaltyCalcval >= -2000 ? (final_Value_PenaltyCalcval >= 0 ? (final_Value_PenaltyCalcval >= 2000 ? (final_Value_PenaltyCalcval >= 4000 ? "HIGH" : "OK") : "LOSS OK") : "LOSS") : "VERY LOSS") : "VERY VERY LOSS") : "";


                        //   FIXED CALCULATION START------------------
                        //FIXED
                        let Fixed_Loss_Deduction_Calcval = updatedLossdeductionfinal;

                        let Fixed_NET_Salary = totalshiftCalcVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * totalpaiddaycalVal;
                        let Fixed_Basic_CalcVal = totalshiftCalcVal === 0 ? 0 : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        let Fixed_HRA_CalcVal = totalshiftCalcVal === 0 ? 0 : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;
                        // console.log(actualHraCalcVal, totalshiftCalcVal, totalpaiddaycalVal, Fixed_NET_Salary, Number(penaltyAmtCalculationVal), Fixed_Loss_Deduction_Calcval, OtherDed);

                        let Fixed_Conveyance_CalcVal = totalshiftCalcVal === 0 ? 0 : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        let Fixed_Med_Allowace = totalshiftCalcVal === 0 ? 0 : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        let Fixed_PROD_Allowace = totalshiftCalcVal === 0 ? 0 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        let Fixed_OTHER_Allowace = totalshiftCalcVal === 0 ? 0 : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        let Fixed_NET_Salary1 = Fixed_Basic_CalcVal + Fixed_HRA_CalcVal + Fixed_Conveyance_CalcVal + Fixed_Med_Allowace + Fixed_PROD_Allowace + Fixed_OTHER_Allowace;

                        let Fixed_PF_deduction = pfDaysVal > 0 ? ((Number(Fixed_Basic_CalcVal) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                        let Fixed_ESI_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (((Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal) * Esiper) : 0;

                        let FixedfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && d.fromamount <= Fixed_NET_Salary1 && d.toamount >= Fixed_NET_Salary1);

                        let Fixed_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : FixedfindprofTaxAmt ? Number(FixedfindprofTaxAmt.taxamount) : 0;

                        let FixedpfAmount1 = findEmployerPercentage / 100;

                        let Fixed_PF_Emper_deduction = FixedpfAmount1 > 0 && totalshiftCalcVal > 0 ? ((Fixed_Basic_CalcVal / totalshiftCalcVal) * pfDaysVal * FixedpfAmount1) : 0;

                        let Fixed_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * ESI_EMPR_Perncetage : 0;

                        let Fixed_Shift_Allowance = (1000 / totalNoOfDaysCalcVal) * (findPointsDetails ? Number(findPointsDetails.noallowancepoint) : 0);

                        let Fixed_Total_Deductions = Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);

                        let Fixed_Salary = Fixed_NET_Salary1 - (Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction)) + Number(Fixed_Shift_Allowance);

                        let Fixed_Salary_penalty = Fixed_Salary + Number(penaltyAmtCalculationVal) > 0 ? (Fixed_Salary >= grossValue ? Fixed_Salary : Fixed_Salary + (penaltyAmtCalculationVal + Fixed_Loss_Deduction_Calcval + OtherDed)) : 0;

                        let Fixed_LOP1 = Fixed_Salary < grossValue ? (Fixed_Salary > 0 ? totalshiftCalcVal - (Fixed_Salary * totalshiftCalcVal) / grossValue : totalshiftCalcVal) : 0;

                        let Fixed_Lop_Days = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue;

                        let Fixed_Leave_Dedcution = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue);

                        let Fixed_CTC_Calcval = Fixed_Salary + Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);
                        let FIXED_Final_Value = Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(Fixed_CTC_Calcval)) + Number(revenueAmountCalc);

                        let Fixed_Acutal_Deduction_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ?
                            (((Number(totalPointsValueCalc) + Number(revenueAmountCalc)) - (Number(Fixed_CTC_Calcval) + Number(Shortage1ValCalc))) < 0 ?
                                ((Number(totalPointsValueCalc) + Number(revenueAmountCalc)) - (Number(Fixed_CTC_Calcval) + Number(Shortage1ValCalc))) : 0)
                            : 0;

                        let Fixed_Min_Deduction = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? (
                            (Number(Shortage1ValCalc) + Number(Fixed_Acutal_Deduction_Calc)) < 0 ? (Number(Shortage1ValCalc) + Number(Fixed_Acutal_Deduction_Calc)) : 0) : 0;

                        let FLossDeduction = Fixed_Min_Deduction + ((Fixed_Acutal_Deduction_Calc - OtherDed) - Fixed_Min_Deduction);
                        Fixed_Loss_Deduction_Calcval = FLossDeduction > 0 ? FLossDeduction : -1 * FLossDeduction;

                        //RE CALCULATION STARTED

                        Fixed_NET_Salary = totalshiftCalcVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * totalpaiddaycalVal;
                        Fixed_Basic_CalcVal = totalshiftCalcVal === 0 ? 0 : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualBasicCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        Fixed_HRA_CalcVal = totalshiftCalcVal === 0 ? 0 : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualHraCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        Fixed_Conveyance_CalcVal = totalshiftCalcVal === 0 ? 0 : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualConveyanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        Fixed_Med_Allowace = totalshiftCalcVal === 0 ? 0 : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualMedicalAllowCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        Fixed_PROD_Allowace = totalshiftCalcVal === 0 ? 0 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (prodAllowanceCalcVal / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        Fixed_OTHER_Allowace = totalshiftCalcVal === 0 ? 0 : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal === 0 ? 0 : (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 > 0 ? (actualOtherCalVAL / totalshiftCalcVal) * totalpaiddaycalVal * (((Fixed_NET_Salary - (Number(penaltyAmtCalculationVal) + Fixed_Loss_Deduction_Calcval + OtherDed)) * 100) / Fixed_NET_Salary) * 0.01 : 0;

                        Fixed_NET_Salary1 = Fixed_Basic_CalcVal + Fixed_HRA_CalcVal + Fixed_Conveyance_CalcVal + Fixed_Med_Allowace + Fixed_PROD_Allowace + Fixed_OTHER_Allowace;

                        //PFDAYS AND PFDEDUCTION

                        //   PfDate = daysp >= pfdatcal ? ((IsExDate == true && item.pfesienddate) < findDate ? "0" : Number(pfdatcal) + Number(totalasbleaveCalcVal)) : daysp + totalasbleaveCalcVal;

                        Fixed_PF_deduction = pfDaysVal > 0 ? ((Number(Fixed_Basic_CalcVal) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                        Fixed_ESI_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                        findprofTaxAmt = profTaxMaster.find((d) => d.company == item.company && d.branch === item.branch && d.fromamount <= Fixed_NET_Salary1 && d.toamount >= Fixed_NET_Salary1);

                        Fixed_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : findprofTaxAmt ? Number(findprofTaxAmt.taxamount) : 0;

                        Fixed_PF_Emper_deduction = FixedpfAmount1 > 0 && totalshiftCalcVal > 0 ? (((Fixed_Basic_CalcVal / totalshiftCalcVal) * pfDaysVal) * FixedpfAmount1) : 0;

                        Fixed_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (((Fixed_NET_Salary1 / totalshiftCalcVal) * pfDaysVal) * ESI_EMPR_Perncetage) : 0;

                        Fixed_Total_Deductions = Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);

                        Fixed_Salary = Fixed_NET_Salary1 - (Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction)) + Number(Fixed_Shift_Allowance);

                        Fixed_Salary_penalty = Fixed_Salary + Number(penaltyAmtCalculationVal) > 0 ? (Fixed_Salary >= grossValue ? Fixed_Salary : Fixed_Salary + (penaltyAmtCalculationVal + Fixed_Loss_Deduction_Calcval + OtherDed)) : 0;

                        Fixed_LOP1 = Fixed_Salary < grossValue ? (Fixed_Salary > 0 ? totalshiftCalcVal - (Fixed_Salary * totalshiftCalcVal) / grossValue : totalshiftCalcVal) : 0;

                        Fixed_Lop_Days = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 :
                            totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0
                                : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue;

                        Fixed_Leave_Dedcution = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * Fixed_NET_Salary1) / grossValue);
                        totalPointsValueCalc = AcheivedPointsCalcVal ? (((Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue) ? (Number(AcheivedPointsCalcVal) / Dvalue) * Mvalue : 0) : 0

                        acutalERAValCalc = totalasbleaveCalcVal > 2 ? (ERAAmountCalcVal - (ERAAmountCalcVal / totalshiftCalcVal) * totalasbleaveCalcVal).toFixed(2) : Number(ERAAmountCalcVal);

                        Fixed_CTC_Calcval = Fixed_Salary + Number(Fixed_PF_deduction) + Number(Fixed_ESI_deduction) + Number(Fixed_TaxCalcVal) + Number(Fixed_PF_Emper_deduction) + Number(Fixed_ESI_EMPR_deduction);
                        FIXED_Final_Value = Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(Fixed_CTC_Calcval)) + Number(revenueAmountCalc);

                        //PRODUCTION
                        let PROD_Loss_Deduction = updatedLossdeductionfinal;

                        let PROD_NET_Salary = AcheivedPercentCalcVal > 0 ? (grossValue * (AcheivedPercentCalcVal / 100)) : 0;
                        let PROD_BASIC_ValCalc = (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;

                        let PROD_HRA_ValCalc = (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;

                        let PROD_CONVEYANCE_ValCalc = (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;
                        let PROD_MEDICALALLOW_ValCalc = (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;
                        let PROD_PRODUCTION_ValCalc = (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;
                        let PROD_OTHER_ValCalc = (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;

                        let PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

                        //PFDAYS AND PFDEDUCTION

                        let PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;

                        let PROD_ESI_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                        let PRODfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && d.fromamount <= PROD_NET_Salary1 && d.toamount >= PROD_NET_Salary1);

                        let PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : PRODfindprofTaxAmt ? Number(PRODfindprofTaxAmt.taxamount) : 0;

                        let PRODpfAmount1 = findEmployerPercentage / 100;

                        let PROD_PF_Emper_deduction = PRODpfAmount1 > 0 && totalshiftCalcVal > 0 ? (((PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal) * PRODpfAmount1) : 0;
                        //ESI-DEDCUTION

                        let PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? ((PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal) * ESI_EMPR_Perncetage : 0;

                        let PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);


                        let PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 ? (((1000 / totalNoOfDaysCalcVal) * (findPointsDetails ? Number(findPointsDetails.noallowancepoint) : 0) * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / targetPointCalcVaue : 0)) / 100) : 0;

                        let PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

                        let PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

                        let PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

                        let PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                        let PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                        let PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                        let PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);

                        let PROD_Actual_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ?
                            (((totalPointsValueCalc + revenueAmountCalc) - (PROD_CTC_Valcalc + Shortage1ValCalc)) < 0 ? ((totalPointsValueCalc + revenueAmountCalc) - (PROD_CTC_Valcalc + Shortage1ValCalc)) : 0)

                            : 0

                        let PROD_Minimum_Deduction_Val = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.deduction === true ? ((Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val) < 0 ? (Number(Shortage1ValCalc) + PROD_Actual_Deduction_Val) : 0) : 0

                        PROD_Loss_Deduction = 0;

                        let PLossDeduction = PROD_Minimum_Deduction_Val + ((PROD_Actual_Deduction_Val - (OtherDed)) - PROD_Minimum_Deduction_Val);

                        PROD_Loss_Deduction = PLossDeduction > 0 ? PLossDeduction : -1 * PLossDeduction;

                        //RE-CALULCATION

                        PROD_BASIC_ValCalc = (actualBasicCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualBasicCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;

                        PROD_HRA_ValCalc = (actualHraCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualHraCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;

                        PROD_CONVEYANCE_ValCalc = (actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualConveyanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;
                        PROD_MEDICALALLOW_ValCalc = (actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualMedicalAllowCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;
                        PROD_PRODUCTION_ValCalc = (prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((prodAllowanceCalcVal * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;
                        PROD_OTHER_ValCalc = (actualOtherCalVAL * AcheivedPercentCalcVal) / 100 === 0 ? 0 : ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 > 0 ? ((actualOtherCalVAL * AcheivedPercentCalcVal) / 100) * (((PROD_NET_Salary - (penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed)) * 100) / PROD_NET_Salary) * 0.01 : 0;

                        PROD_NET_Salary1 = PROD_BASIC_ValCalc + PROD_HRA_ValCalc + PROD_CONVEYANCE_ValCalc + PROD_MEDICALALLOW_ValCalc + PROD_PRODUCTION_ValCalc + PROD_OTHER_ValCalc;

                        PROD_PF_deduction = pfDaysVal > 0 ? ((Number(PROD_BASIC_ValCalc) / Number(totalshiftCalcVal)) * Number(pfDaysVal) * Number(pfAmount)).toFixed(2) : 0;



                        PROD_ESI_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? (PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal * Esiper : 0;

                        PRODfindprofTaxAmt = profTaxMaster.find((d) => d.company === item.company && d.branch === item.branch && d.fromamount <= PROD_NET_Salary1 && d.toamount >= PROD_NET_Salary1);

                        PROD_TaxCalcVal = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : PRODfindprofTaxAmt ? Number(PRODfindprofTaxAmt.taxamount) : 0;


                        PROD_PF_Emper_deduction = PRODpfAmount1 > 0 && totalshiftCalcVal > 0 ? (((PROD_BASIC_ValCalc / totalshiftCalcVal) * pfDaysVal) * PRODpfAmount1) : 0;


                        PROD_ESI_EMPR_deduction = grossValue >= findEsiMAXSalary ? 0 : pfDaysVal > 0 ? ((PROD_NET_Salary1 / totalshiftCalcVal) * pfDaysVal) * ESI_EMPR_Perncetage : 0;

                        PROD_Total_deductions = Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);


                        PROD_Shift_Allowance = totalNoOfDaysCalcVal > 0 ? (((1000 / totalNoOfDaysCalcVal) * (findPointsDetails ? Number(findPointsDetails.noallowancepoint) : 0) * (allowancepointCalcVal > 0 ? (allowancepointCalcVal * 100) / targetPointCalcVaue : 0)) / 100) : 0;

                        PROD_SALARY_Calcval = PROD_NET_Salary1 - PROD_Total_deductions + PROD_Shift_Allowance;

                        PROD_SALARY_PENALTY_Calcval = PROD_SALARY_Calcval + penaltyAmtCalculationVal > 0 ? (PROD_SALARY_Calcval >= grossValue ? PROD_SALARY_Calcval : PROD_SALARY_Calcval + penaltyAmtCalculationVal + PROD_Loss_Deduction + OtherDed) : 0;

                        PROD_LOP_days = PROD_SALARY_Calcval < grossValue ? (PROD_SALARY_Calcval > 0 ? Math.round(totalshiftCalcVal - (PROD_SALARY_Calcval * totalshiftCalcVal) / grossValue) : totalshiftCalcVal) : 0;

                        PROD_LOP_calcval = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue) < 0 ? 0 : Math.round(totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                        PROD_Leave_Deduction = totalNoOfDaysCalcVal === 0 || totalpaiddaycalVal === 0 ? 0 : (grossValue / totalshiftCalcVal) * (totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue < 0 ? 0 : totalshiftCalcVal - (totalshiftCalcVal * PROD_NET_Salary1) / grossValue);

                        PROD_CTC_Valcalc = PROD_SALARY_Calcval + Number(PROD_PF_deduction) + Number(PROD_ESI_deduction) + Number(PROD_TaxCalcVal) + Number(PROD_PF_Emper_deduction) + Number(PROD_ESI_EMPR_deduction);

                        PROD_Final_Value_Calc = CHECK_DEPARTMENT_ACCESS && CHECK_DEPARTMENT_ACCESS.target === false ? 0 : Number(totalPointsValueCalc) - (Number(acutalERAValCalc) + Number(PROD_CTC_Valcalc)) + Number(revenueAmountCalc);


                        ////daystatus---------------------------------------------------------------------------------------------------------
                        let currentMonthAttendanceVal = findTotalNoOfDaysNxtMonth ? findTotalNoOfDaysNxtMonth.lopcount : 0;
                        let currentMonthAvgVal = findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0

                        let currMonAvgFinalcalVal = item.currmonthavglog && item.currmonthavglog.length > 0 && currMonAvgLogVal && currMonAvgLogVal.length > 0 ? Number(currMonAvgLogVal[currMonAvgLogVal.length - 1].value) : currentMonthAvgVal;

                        let currMonAttFinalcalVal = item.currmonthattlog && item.currmonthattlog.length > 0 && currMonAttLogVal && currMonAttLogVal.length > 0 ? Number(currMonAttLogVal[currMonAttLogVal.length - 1].value) : currentMonthAttendanceVal;

                        let getpaidStatusVal = paidStsFixData.find(d =>
                            (d.month).toLowerCase() === node.data.selectedmonth.toLowerCase() && d.department.includes(item.department) && d.year == node.data.selectedyear
                            && Number(totalasbleaveCalcVal) >= Number(d.fromvalue) && Number(totalasbleaveCalcVal) <= Number(d.tovalue) && Number(AcheivedPercentCalcVal) >= Number(d.frompoint) && Number(AcheivedPercentCalcVal) <= Number(d.topoint)

                            && (d.currentabsentmodes === "Less than or Equal" ? currMonAttFinalcalVal <= Number(d.currentabsentvalue) : d.currentabsentmodes === "Less than" ? currMonAttFinalcalVal < Number(d.currentabsentvalue) : d.currentabsentmodes === "Greater than" ? currMonAttFinalcalVal > Number(d.currentabsentvalue) : currMonAttFinalcalVal >= Number(d.currentabsentvalue))
                            && (d.currentachievedmodes === "Less than or Equal" ? currMonAvgFinalcalVal <= Number(d.currentachievedvalue) : d.currentachievedmodes === "Less than" ? currMonAvgFinalcalVal < Number(d.currentachievedvalue) : d.currentachievedmodes === "Greater than" ? currMonAvgFinalcalVal > Number(d.currentachievedvalue) : currMonAvgFinalcalVal >= Number(d.currentachievedvalue))

                        )
                        let paidStatusVal = getpaidStatusVal ? getpaidStatusVal.paidstatus : "";


                        let getPayTypes = payruncontrolmaster.find(d => {
                            return (
                                d.filtertype === "Individual" && d.empname.includes(item.companyname) ?
                                    (d.choosetype === false && d.choosestatus === "Both" ?
                                        (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                        && (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                        : d.choosetype === false && d.choosestatus === "Production" ?
                                            (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                            : d.choosetype === false && d.choosestatus === "New Gross" ?
                                                (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                                : d.choosetype === true
                                    ) :
                                    d.filtertype === "Team" && d.branch.includes(item.branch) && d.unit.includes(item.unit) && d.team.includes(item.team) ?
                                        (d.choosetype === false && d.choosestatus === "Both" ?
                                            (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                            && (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                            : d.choosetype === false && d.choosestatus === "Production" ?
                                                (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                                : d.choosetype === false && d.choosestatus === "New Gross" ?
                                                    (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                                    : true
                                        )

                                        :
                                        d.filtertype === "Unit" && d.branch.includes(item.branch) && d.unit.includes(item.unit) ?
                                            (d.choosetype === false && d.choosestatus === "Both" ?
                                                (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                                && (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                                : d.choosetype === false && d.choosestatus === "Production" ?
                                                    (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                                    : d.choosetype === false && d.choosestatus === "New Gross" ?
                                                        (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                                        : true
                                            )
                                            :
                                            d.filtertype === "Branch" && d.branch.includes(item.branch) ?
                                                (d.choosetype === false && d.choosestatus === "Both" ?
                                                    (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                                    && (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                                    : d.choosetype === false && d.choosestatus === "Production" ?
                                                        (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                                        : d.choosetype === false && d.choosestatus === "New Gross" ?
                                                            (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                                            : true
                                                )
                                                :
                                                d.filtertype === "Department" && d.department.includes(item.department) ?
                                                    (d.choosetype === false && d.choosestatus === "Both" ?
                                                        (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                                        && (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                                        : d.choosetype === false && d.choosestatus === "Production" ?
                                                            (d.achievedsymbol === "Between" ? Number(AcheivedPercentCalcVal) >= Number(d.achievedfrom) && Number(AcheivedPercentCalcVal) <= Number(d.achievedto) : d.achievedsymbol === "Less than or equal" ? Number(AcheivedPercentCalcVal) <= Number(d.achieved) : d.achievedsymbol === "Less than" ? Number(AcheivedPercentCalcVal) < Number(d.achieved) : d.achievedsymbol === "Greater than" ? Number(AcheivedPercentCalcVal) > Number(d.achieved) : Number(AcheivedPercentCalcVal) >= Number(d.achieved))
                                                            : d.choosetype === false && d.choosestatus === "New Gross" ?
                                                                (d.newgrosssymbol === "Between" ? Number(grossValue) >= Number(d.newgrossfrom) && Number(grossValue) <= Number(d.newgrossto) : d.newgrosssymbol === "Less than or equal" ? Number(grossValue) <= Number(d.newgross) : d.newgrosssymbol === "Less than" ? Number(grossValue) < Number(d.newgross) : d.newgrosssymbol === "Greater than" ? Number(grossValue) > Number(d.newgross) : Number(grossValue) >= Number(d.newgross))
                                                                : true
                                                    )
                                                    :
                                                    false
                            )
                        }
                        )
                        let salaryTypeVal = getPayTypes ? getPayTypes.salraytype : "Final Salary"
                        let deductionTypeVal = getPayTypes ? getPayTypes.deductiontype : "Acutal Deduction"
                        ////daystatus---------------------------------------------------------------------------------------------------------

                        let lowestValueSal, highestValueSal;

                        if (finalSalaryCalcVal < Fixed_Salary && finalSalaryCalcVal < PROD_SALARY_Calcval) {
                            lowestValueSal = "Final Salary";
                        } else if (Fixed_Salary < finalSalaryCalcVal && Fixed_Salary < PROD_SALARY_Calcval) {
                            lowestValueSal = "Fixed Salary";
                        } else {
                            lowestValueSal = "Production Salary";
                        }

                        if (finalSalaryCalcVal > Fixed_Salary && finalSalaryCalcVal > PROD_SALARY_Calcval) {
                            highestValueSal = "Final Salary";
                        } else if (Fixed_Salary > finalSalaryCalcVal && Fixed_Salary > PROD_SALARY_Calcval) {
                            highestValueSal = "Fixed Salary";
                        } else {
                            highestValueSal = "Production Salary";
                        }


                        let findSalaryTypeValue = salaryTypeVal === "Whichever is Lower" ? lowestValueSal : salaryTypeVal === "Whichever is Higher" ? highestValueSal : salaryTypeVal;

                        let lowestValueDed, highestValueDed;
                        // console.log(findSalaryTypeValue,acutalDeductionCalcVal,finalValueCalcVal,final_Value_PenaltyCalcval,minimumDeductionCalcVal,'final',-7629.176272197961 < 0 )
                        //salary type is final salary
                        if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Final Salary") {
                            if (acutalDeductionCalcVal < finalValueCalcVal && acutalDeductionCalcVal < final_Value_PenaltyCalcval && acutalDeductionCalcVal < minimumDeductionCalcVal) {
                                lowestValueDed = "Acutal Deduction";
                            } else if (finalValueCalcVal < final_Value_PenaltyCalcval && finalValueCalcVal < minimumDeductionCalcVal) {
                                lowestValueDed = "On Value";
                            } else if (final_Value_PenaltyCalcval < minimumDeductionCalcVal) {
                                lowestValueDed = "On Penalty";
                            } else {
                                lowestValueDed = "Minimum Deduction";
                            }
                        }
                        if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Final Salary") {
                            if (acutalDeductionCalcVal > finalValueCalcVal && acutalDeductionCalcVal > final_Value_PenaltyCalcval && acutalDeductionCalcVal > minimumDeductionCalcVal) {
                                highestValueDed = "Acutal Deduction";
                            } else if (finalValueCalcVal > final_Value_PenaltyCalcval && finalValueCalcVal > minimumDeductionCalcVal) {
                                highestValueDed = "On Value";
                            } else if (final_Value_PenaltyCalcval > minimumDeductionCalcVal) {
                                highestValueDed = "On Penalty";
                            } else {
                                highestValueDed = "Minimum Deduction";
                            }
                        }
                        //salary type is fixed salary
                        if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Fixed Salary") {
                            if (Fixed_Acutal_Deduction_Calc < FIXED_Final_Value && Fixed_Acutal_Deduction_Calc < Fixed_Min_Deduction) {
                                lowestValueDed = "Acutal Deduction";
                            } else if (FIXED_Final_Value < Fixed_Min_Deduction) {
                                lowestValueDed = "On Value";
                            } else {
                                lowestValueDed = "Minimum Deduction";
                            }
                        }
                        if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Fixed Salary") {
                            if (Fixed_Acutal_Deduction_Calc > FIXED_Final_Value && Fixed_Acutal_Deduction_Calc > Fixed_Min_Deduction) {
                                lowestValueDed = "Acutal Deduction";
                            } else if (FIXED_Final_Value > Fixed_Min_Deduction) {
                                lowestValueDed = "On Value";
                            } else {
                                lowestValueDed = "Minimum Deduction";
                            }
                        }
                        //salary type is PROD salary
                        if (deductionTypeVal === "Whichever is Lower" && findSalaryTypeValue === "Production Salary") {
                            if (PROD_Actual_Deduction_Val < PROD_Final_Value_Calc && PROD_Actual_Deduction_Val < PROD_Minimum_Deduction_Val) {
                                lowestValueDed = "Acutal Deduction";
                            } else if (PROD_Final_Value_Calc < PROD_Minimum_Deduction_Val) {
                                lowestValueDed = "On Value";
                            } else {
                                lowestValueDed = "Minimum Deduction";
                            }
                        }
                        if (deductionTypeVal === "Whichever is Higher" && findSalaryTypeValue === "Production Salary") {
                            if (PROD_Actual_Deduction_Val > PROD_Final_Value_Calc && PROD_Actual_Deduction_Val > PROD_Minimum_Deduction_Val) {
                                lowestValueDed = "Acutal Deduction";
                            } else if (PROD_Final_Value_Calc > PROD_Minimum_Deduction_Val) {
                                lowestValueDed = "On Value";
                            } else {
                                lowestValueDed = "Minimum Deduction";
                            }
                        }

                        let findDeductionTypeVal = deductionTypeVal === "Whichever is Lower" ? lowestValueDed : deductionTypeVal === "Whichever is Higher" ? highestValueDed : deductionTypeVal;
                        let salarytypefinal = node.data.salarytypeedit;
                        let deductiontypefinal = node.data.deductiontypeedit;
                        let waiver = node.data.waiver || 0;
                        let otherdeduction = node.data.otherdeduction || 0;

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
                            experience: item.doj ? (calculateMonthsBetweenDates(item.doj, findDate) < 0 ? 0 : calculateMonthsBetweenDates(item.doj, findDate)) : "",
                            //ASSIGN EXP LOG DETAILS
                            endtar: modevalue ? modevalue.endtar : "",
                            endtardate: modevalue && modevalue.endtardate ? moment(modevalue.endtardate)?.format("DD-MM-YYYY") : "",
                            endexp: modevalue ? modevalue.endexp : "",
                            endexpdate: modevalue && modevalue.endexpdate ? moment(modevalue.endexpdate)?.format("DD-MM-YYYY") : "",

                            assignExpMode: modevalue ? modevalue.expmode : "",
                            modevalue: modevalue ? modevalue.expval : "",

                            targetexp: item.doj ? (differenceInMonthstar > 0 ? differenceInMonthstar : 0) : "",
                            prodexp: item.doj ? (differenceInMonthsexp > 0 ? differenceInMonthsexp : 0) : "",
                            modeexp: item.doj ? (differenceInMonths > 0 ? differenceInMonths : 0) : "",

                            processcode: item.doj && modevalue && modevalue.expmode === "Manual" ? modevalue.salarycode : item.doj ? getprocessCode : "",
                            salexp: item.doj ? (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "",
                            processcodeexp: processcodeexpvalue,

                            // gross: grossValue,

                            //SALRY SLAB FILTER PAGE
                            basic: actualBasicCalcVal,
                            hra: actualHraCalcVal,
                            conveyance: actualConveyanceCalcVal,
                            medicalallowance: actualMedicalAllowCalcVal,
                            productionallowance: prodAllowanceCalcVal,
                            productionallowancetwo: prodAllowancetwoCalcVal,
                            otherallowance: actualOtherCalVAL,

                            oldgross: oldgross,
                            oldbasic: oldactualBasicCalcVal,
                            oldhra: oldactualHraCalcVal,
                            oldconveyance: oldactualConveyanceCalcVal,
                            oldmedicalallowance: oldactualMedicalAllowCalcVal,
                            oldproductionallowance: oldprodAllowanceCalcVal,
                            oldproductionallowancetwo: oldprodAllowancetwoCalcVal,
                            oldotherallowance: oldactualOtherCalVAL,
                            gross: grossValue,

                            //REVENUE ALLOWANCE MASTER PAGE
                            revenueallow: findRevenueAllow ? findRevenueAllow.amount : 0,
                            //SHORTAGE MASTER PAGE
                            shortage: findShortage ? findShortage.amount : 0,

                            //ATTENDANCE MONTH STATUS
                            totalnumberofdays: findTotalNoOfDays ? findTotalNoOfDays.totalcounttillcurrendate : 0,
                            // totalshift: findTotalNoOfDays && Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),
                            totalshift: totalshiftCalcVal,
                            clsl: findTotalNoOfDays ? findTotalNoOfDays.clsl : 0,
                            weekoffcount: findTotalNoOfDays ? findTotalNoOfDays.weekoff : 0,
                            holiday: findTotalNoOfDays ? findTotalNoOfDays.holiday : 0,
                            totalasbleave: totalasbleaveCalcVal,
                            totalpaidDays: totalpaiddaycalVal,


                            //old value and log
                            totalpaiddaycalVal1: paiddayscalcvalfrommonthstatus,
                            totalabsentcalVal1: findTotalNoOfDays ? findTotalNoOfDays.lopcount : 0,
                            penaltyCalVal1: findPenaltyDetails ? findPenaltyDetails.amount.toFixed(2) : Number(0).toFixed(2),
                            targetpointCalVal1: findPointsDetails ? findPointsDetails.target : 0,
                            acheivedpointCalVal1: findPointsDetails ? findPointsDetails.point.toFixed(2) : Number(0).toFixed(2),
                            shiftallowanceCalVal1: findPointsDetails ? findPointsDetails.allowancepoint.toFixed(2) : Number(0).toFixed(2),
                            // paidpresentday: Number(findTotalNoOfDays && findTotalNoOfDays.paidpresentday) - Number(findTotalNoOfDays && findTotalNoOfDays.weekoff),

                            //LIST PRODUCTION POINTS
                            monthPoint: targetPointCalcVaue,

                            acheivedpoints: AcheivedPointsCalcVal,
                            editedacheivedpoints: AcheivedPointsCalcVal,
                            iseditedacheivedpoints: data.iseditedacheivedpoints,
                            acheivedpercent: AcheivedPercentCalcVal,

                            //DAY POINTS UPLOAD SHIFTALOWANCE AMOUNT
                            allowancepoint: allowancepointCalcVal,
                            noallowancepoint: noshiftlogvalfinal,

                            //ERA MASTER PAGE
                            eramount: ERAAmountCalcVal,
                            //PENALTY MASTER PAGE
                            penalty: penaltyCalcVal ? penaltyCalcVal : 0,
                            penaltyamount: penaltyAmtCalculationVal ? penaltyAmtCalculationVal.toFixed(2) : 0,
                            editedpenaltyamount: penaltyAmtCalculationVal ? penaltyAmtCalculationVal.toFixed(2) : 0,
                            iseditedpenaltyamount: data.iseditedpenaltyamount,

                            //USER INOIVIDUAL VALUE
                            ipname: item.ipname,
                            insurancenumber: item.insurancenumber,
                            pfmembername: item.pfmembername,
                            uan: item.uan,

                            currentmonthavg: Number(currMonAvgFinalcalVal),
                            currentmonthavgCalVal1: findPointsDetailsNxtMonth ? Number(findPointsDetailsNxtMonth.avgpoint).toFixed(2) : 0,


                            // currentmonthattendance: currMonAttFinalcalVal,
                            currentmonthattCalVal1: currentMonthAttendanceVal,

                            // paidstatus: paidStatusVal,

                            noshiftlog: item.noshiftlog,
                            noshiftlogCalVal1: findPointsDetails ? findPointsDetails.noallowancepoint : 0,


                            shiftallowancetarget: shiftallowancetargetfinal,
                            nightshiftallowance: Number((nightAllowanceCalcVal).toFixed(2)),

                            nightshiftallowlog: item.nightshiftallowlog,
                            nightshiftallowlogCalVal1: nightAllowancefinalcalculation,

                            shiftallowtargetlog: item.shiftallowtargetlog,
                            shiftallowtargetlogCalVal1: shiftallowancetarget,
                            from: findDate,
                            to: findmonthenddate,

                            ///FINALFIXPRODSALARY STARTED
                            acheivedproductionallowance: Number(acheivedProductionAllowanceValCal).toFixed(2),
                            attendancelop: Number(attendanceLopCalVal).toFixed(2),
                            actualnetsalary: (((actualBasicCalcVal + actualHraCalcVal + actualConveyanceCalcVal + actualMedicalAllowCalcVal + actualOtherCalVAL) - Number(attendanceLopCalVal)) + Number(acheivedProductionAllowanceValCal)).toFixed(2),
                            lopbasic: Number(lopBasicValCal).toFixed(2),
                            lophra: Number(lopHRAValCal).toFixed(2),
                            lopconveyance: Number(lopConveyValCal).toFixed(2),
                            lopmedicalallowance: Number(lopMedicalValCal).toFixed(2),
                            lopotherallowance: Number(lopOtherValCal).toFixed(2),
                            lopproductionallowance: lopProductionAllowance.toFixed(2),
                            lopnetsalary: Number(lopBasicValCal + lopHRAValCal + lopConveyValCal + lopMedicalValCal + lopProductionAllowance + lopOtherValCal).toFixed(2),
                            prodbasic: Number(prodBasicValCalc).toFixed(2),
                            prodhra: Number(prodHraValCalc).toFixed(2),
                            prodconveyance: Number(prodConveyanceValCalc).toFixed(2),
                            prodmedicalallowance: Number(prodMEDAllowanceValCalc).toFixed(2),
                            prodotherallowance: Number(prodOtherValCalc).toFixed(2),
                            prodproductionallowance: Number(prodPRODValCalc).toFixed(2),
                            calculatednetsalary: Number(calcNetSalaryValCalc).toFixed(2),
                            lossdeduction: Number(lossDed).toFixed(2),
                            otherdeduction: Number(OtherDed).toFixed(2),
                            finalbasic: Number(finalBasicValCalc).toFixed(2),
                            finalhra: Number(finalHraValCalc).toFixed(2),
                            finalconveyance: Number(finalConveyValCalc).toFixed(2),
                            finalmedicalallowance: Number(finalMedicalAllowValcCalc).toFixed(2),
                            finalproductionallowance: Number(finalProductionValcCalc).toFixed(2),
                            finalotherallowance: Number(finalOtherValcCalc).toFixed(2),
                            finalnetsalary: Number(finalNetSalaryValcCalc).toFixed(2),
                            pfdays: pfDaysVal,
                            ncpdays: ncpDaysVal,
                            pfdeduction: Number(PF_deduction).toFixed(2),
                            esideduction: Number(ESI_deduction).toFixed(2),
                            finallopdays: finalLOPDaysCalcVal,
                            paysliplop: Number(paySlipLopCalval).toFixed(0),
                            finalleavededuction: Number(finalLeaveDeductionValCalc).toFixed(2),
                            professionaltax: profTaxCalcVal,
                            totaldeductions: Number(totalDeductionValCalc).toFixed(2),
                            shiftallowancetarget: shiftallowancetargetfinal,
                            nightshiftallowance: Number(Number(nightAllowanceCalcVal).toFixed(2)),
                            finalsalary: Number(finalSalaryCalcVal).toFixed(2),
                            finalsalarypenalty: Number(finalSalary_Penalty).toFixed(2),
                            totalpointsvalue: Number(totalPointsValueCalc).toFixed(2),
                            era: Number(acutalERAValCalc).toFixed(2),
                            pfemployerdeduction: Number(PF_Emper_deduction).toFixed(2),
                            esiemployerdeduction: Number(ESI_EMPR_deduction).toFixed(2),
                            ctc: Number(CTC_Calcval).toFixed(2),
                            // finalvaluetwo:Number(finalValueCalcVal).toFixed(2),
                            finalvalue: Number(finalValueCalcVal).toFixed(2),
                            finalvaluepenalty: Number(final_Value_PenaltyCalcval).toFixed(2),
                            shortageone: Number(Shortage1ValCalc).toFixed(2),
                            actualdeduction: Number(acutalDeductionCalcVal).toFixed(2),
                            minimumdeduction: Number(minimumDeductionCalcVal).toFixed(2),
                            finalvaluereview: finalValueReviewCalc,
                            finalvaluestatus: finalValueStatus,
                            finalvaluepenaltystatus: revenuePenaltyStatus,


                            //FIXED
                            fixedlossdeduction: Number(Fixed_Loss_Deduction_Calcval).toFixed(2),
                            fixednetsalary: Number(Fixed_NET_Salary).toFixed(2),
                            fixedbasic: Number(Fixed_Basic_CalcVal).toFixed(2),
                            fixedhra: Number(Fixed_HRA_CalcVal).toFixed(2),
                            fixedconveyance: Number(Fixed_Conveyance_CalcVal).toFixed(2),
                            fixedmedicalallowance: Number(Fixed_Med_Allowace).toFixed(2),
                            fixedproductionallowance: Number(Fixed_PROD_Allowace).toFixed(2),
                            fixedotherallowance: Number(Fixed_OTHER_Allowace).toFixed(2),
                            fixednetsalaryone: Number(Fixed_NET_Salary1).toFixed(2),
                            fixedemppf: Number(Fixed_PF_deduction).toFixed(2),
                            fixedempesi: Number(Fixed_ESI_deduction).toFixed(2),
                            fixedempptax: Number(Fixed_TaxCalcVal).toFixed(2),
                            fixedemprpf: Number(Fixed_PF_Emper_deduction).toFixed(2),
                            fixedempresi: Number(Fixed_ESI_EMPR_deduction).toFixed(2),
                            fixedshiftallowance: Number(Fixed_Shift_Allowance).toFixed(2),
                            fixedtotaldeductions: Number(Fixed_Total_Deductions).toFixed(2),
                            fixedsalary: Number(Fixed_Salary).toFixed(2),
                            fixedsalarypenalty: Number(Fixed_Salary_penalty).toFixed(2),
                            fixedlop: Number(Fixed_LOP1).toFixed(0),
                            fixedlopdays: Number(Fixed_Lop_Days).toFixed(0),
                            fixedctc: Number(Fixed_CTC_Calcval).toFixed(2),
                            fixedfinalvalue: Number(FIXED_Final_Value).toFixed(2),
                            fixedleavededuction: Number(Fixed_Leave_Dedcution).toFixed(2),
                            fixedactualdeduction: Number(Fixed_Acutal_Deduction_Calc).toFixed(2),
                            fixedminimumdeduction: Number(Fixed_Min_Deduction).toFixed(2),

                            // production
                            prodlossdeduction: Number(PROD_Loss_Deduction).toFixed(2),
                            prodnetsalary: Number(PROD_NET_Salary).toFixed(2),
                            prodbasicp: Number(PROD_BASIC_ValCalc).toFixed(2),
                            prodhrap: Number(PROD_HRA_ValCalc).toFixed(2),
                            prodconveyancep: Number(PROD_CONVEYANCE_ValCalc).toFixed(2),
                            prodmedicalallowancep: Number(PROD_MEDICALALLOW_ValCalc).toFixed(2),
                            prodproductionallowancep: Number(PROD_PRODUCTION_ValCalc).toFixed(2),
                            prodotherallowancep: Number(PROD_OTHER_ValCalc).toFixed(2),
                            prodnetsalaryonep: Number(PROD_NET_Salary1).toFixed(2),
                            prodemppf: Number(PROD_PF_deduction).toFixed(2),
                            prodempesi: Number(PROD_ESI_deduction).toFixed(2),
                            prodempptax: Number(PROD_TaxCalcVal).toFixed(2),
                            prodemprpf: Number(PROD_PF_Emper_deduction).toFixed(2),
                            prodempresi: Number(PROD_ESI_EMPR_deduction).toFixed(2),
                            prodtotaldeductions: Number(PROD_Total_deductions).toFixed(2),
                            prodshiftallowance: Number(PROD_Shift_Allowance).toFixed(2),
                            prodsalary: Number(PROD_SALARY_Calcval).toFixed(2),
                            prodsalarypenalty: Number(PROD_SALARY_PENALTY_Calcval).toFixed(2),
                            prodlopdays: Number(PROD_LOP_days).toFixed(2),
                            prodlop: Number(PROD_LOP_calcval).toFixed(2),
                            prodleavededuction: Number(PROD_Leave_Deduction).toFixed(2),
                            prodctc: Number(PROD_CTC_Valcalc).toFixed(2),
                            prodfinalvalue: Number(PROD_Final_Value_Calc).toFixed(2),
                            prodactualdeduction: Number(PROD_Actual_Deduction_Val).toFixed(2),
                            prodminimumdeduction: Number(PROD_Minimum_Deduction_Val).toFixed(2),

                            currentmonthavg: Number(currMonAvgFinalcalVal),
                            currentmonthattendance: currMonAttFinalcalVal,

                            paidstatus: paidStatusVal,
                            salarytype: findSalaryTypeValue ? findSalaryTypeValue : "",
                            deductiontype: findDeductionTypeVal ? findDeductionTypeVal : "",


                            salarytypefinal: salarytypefinal,
                            waiver: node.data.waiver,
                            deductiontypefinal: deductiontypefinal,
                            otherdeductionfinal: node.data.otherdeductionfinal,
                            lossdeductionfinal: node.data.lossdeductionfinal,

                        };
                    });

                    const results = await Promise.all(itemsWithSerialNumber);
                    console.log(results[0], 'resrulst[0]')

                    let res = await axios.post(`${SERVICE.UPDATE_INNERDATA_SINGLE_USER_RERUN}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        outerId: node.data.outerId,
                        innerId: node.data.id,
                        updateData: results[0],

                    });

                    setShowAlert(
                        <>
                            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "100px", color: "#1d8510de" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully"}</p>
                        </>
                    );
                    handleClickOpenerr();
                    console.log("ok");
                    setIsLoadSent(false);
                } catch (err) {
                    console.log(err, 'err')
                    setIsLoad(false);
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
                                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something  5 went wrong!"}</p>
                            </>
                        );
                        handleClickOpenerr();
                    }
                }

            }).catch(error => {
                setIsLoadSent(false);
                console.error('Error in getting all results:', error);
            });

        } catch (err) {
            setIsLoadSent(false);
            const messages = err?.response?.data?.message;
            console.error(messages);
        }
    };

    return (
        <>

            <LoadingButton
                loading={isLoadSent}
                onClick={confirmSubmit}
                variant="contained" size="small" color="warning"
                sx={{ textTransform: "capitalize" }}
            >
                Save
            </LoadingButton >

            <LoadingButton sx={{ textTransform: "capitalize" }}
                // loading={isLoadSent}
                // onClick={confirmSubmit}

                variant="contained"
                size="small"
                color="info">Sent</LoadingButton>

            {/* ALERT DIALOG */}
            {/* < Box >
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box > */}
        </>
    )

}

function Losspayrun() {

    const [manageshortagemasters, setManageshortagemasters] = useState([]);
    const [revenueAmount, setRevenueAmount] = useState([]);
    const [salSlabs, setsalSlabs] = useState([]);
    const [eraAmounts, setEraAmounts] = useState([]);
    const [acPointCal, setAcPointCal] = useState([]);
    const [attStatus, setAttStatus] = useState([]);
    const [attModearr, setAttModearr] = useState([]);

    const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    // Multiselectdropdowns

    const [departments, setDepartments] = useState([]);
    const [departmentsList, setDepartmentsList] = useState([]);

    // const [paidStatusFix, setPaidStatusFix] = useState([]);
    const [payruncontrolmaster, setPayruncontrolmaster] = useState([]);

    const [profTaxMaster, setProfTaxMaster] = useState([]);
    const [shifts, setShifts] = useState([]);

    const [payRunList, setPayRunList] = useState([]);
    const [payRunCalcList, setPayRunCalcList] = useState([]);

    const [employeesPayRun, setEmployeesPayRun] = useState([]);
    const { auth } = useContext(AuthContext);

    //Datatable non calculate
    const gridRefList = useRef(null);
    const [pageList, setPageList] = useState(1);
    const [pageSizeList, setPageSizeList] = useState(10);
    const [itemsList, setItemsList] = useState([]);

    const [searchQueryManageList, setSearchQueryManageList] = useState("");
    const [searchQueryList, setSearchQueryList] = useState("");

    //Datatable two
    const gridRefCalcList = useRef(null);
    const [pageCalcList, setPageCalcList] = useState(1);
    const [pageSizeCalcList, setPageSizeCalcList] = useState(10);
    const [itemsCalcList, setItemsCalcList] = useState([]);

    const [searchQueryManageCalcList, setSearchQueryManageCalcList] = useState("");
    const [searchQueryCalcList, setSearchQueryCalcList] = useState("");


    //  Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let currentMonth = monthsArr[mm - 1];

    const [items, setItems] = useState([]);
    const [rowData, setRowData] = useState([]);
    //yeardropdown
    const years = [];
    for (let year = yyyy; year >= 1977; year--) {
        years.push({ value: year, label: year.toString() });
    }
    //month dropdown options
    const months = [
        { value: "January", label: "January", numval: 1 },
        { value: "February", label: "February", numval: 2 },
        { value: "March", label: "March", numval: 3 },
        { value: "April", label: "April", numval: 4 },
        { value: "May", label: "May", numval: 5 },
        { value: "June", label: "June", numval: 6 },
        { value: "July", label: "July", numval: 7 },
        { value: "August", label: "August", numval: 8 },
        { value: "September", label: "September", numval: 9 },
        { value: "October", label: "October", numval: 10 },
        { value: "November", label: "November", numval: 11 },
        { value: "December", label: "December", numval: 12 },
    ];


    const [isBankdetail, setBankdetail] = useState(false);

    const gridRef = useRef(null);
    const gridRefContainer = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");

    //image
    // const handleCaptureImage = () => {
    //     console.log(gridRef.current);
    //     if (gridRef.current) {
    //         html2canvas(gridRef.current).then((canvas) => {
    //             canvas.toBlob((blob) => {
    //                 saveAs(blob, "Loss Pay Run.png");
    //             });
    //         });
    //     }
    // };
    const handleCaptureImage = () => {
        if (gridRefContainer.current) {
            domtoimage.toBlob(gridRefContainer.current)
                .then((blob) => {
                    saveAs(blob, "Loss Pay Run.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Manage Columns
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


    const fetchDepartments = async () => {
        try {


            let res_min = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDepartmentsList(res_min.data.departmentdetails);
            setDepartments(
                res_min.data.departmentdetails.map((item) => ({
                    label: item.deptname,
                    value: item.deptname,
                }))
            );

        } catch (err) {
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




    //get all Attendance Status name.
    const fetchProfTax = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROFFESIONALTAXMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setProfTaxMaster(res_freq?.data?.professionaltaxmaster);
        } catch (err) {
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

    //get all Attendance Status name.
    const fetchShifts = async () => {
        try {
            let res_freq = await axios.get(SERVICE.SHIFTS_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setShifts(res_freq?.data?.shifts);
        } catch (err) {
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

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden",
        },

        "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "12px",
            fontWeight: "bold !important",
            lineHeight: "15px",
            whiteSpace: "normal", // Wrap text within the available space
            overflow: "visible", // Allow overflowed text to be visible
            minWidth: "20px",
        },
        "& .MuiDataGrid-columnHeaders": {
            minHeight: "42px !important",
            background: "#b7b3b347",
            maxHeight: "45px",
        },
        "& .MuiDataGrid-row": {
            fontSize: "13px", // Change the font size for row data
            minWidth: "20px",
            color: "#444",
            // Add any other styles you want to apply to the row data
        },

        "& .MuiDataGrid-row.Mui-selected": {
            "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
                backgroundColor: "unset !important", // Clear the background color for selected rows
            },
        },
    }));

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        actions: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        empcode: true,
        companyname: true,
        legalname: true,
        doj: true,
        designation: true,
        department: true,
        processcodeexp: true,
        experience: true,
        prodexp: true,

        //need to fetch from users
        bankname: true,
        accountname: true,
        accountnumber: true,
        ifsccode: true,
        totalnumberofdays: true,
        totalshift: true,
        clsl: true,
        weekoff: true,
        holiday: true,
        totalasbleave: true,
        totalpaidDays: true,

        //fetched from salary slab filter
        newgross: true,
        actualbasic: true,
        actualhra: true,
        actualconveyance: true,
        actualmedicalallowance: true,
        actualproductionallowance: true,
        actualproductionallowancetwo: true,
        actualotherallowance: true,
        oldgross: true,
        oldbasic: true,
        oldhra: true,
        oldconveyance: true,
        oldmedicalallowance: true,
        oldproductionallowance: true,
        oldproductionallowancetwo: true,
        oldotherallowance: true,


        //need to fetch from daypoints upload
        targetpoints: true,
        acheivedpoints: true,
        acheivedpercent: true,
        actualpenalty: true,
        penaltyamt: true,
        uan: true,
        pfmembername: true,
        insuranceno: true,
        ipname: true,
        noallowanceshift: true,
        shiftallowancepoint: true,
        shiftallowancetarget: true,
        nightshiftallowance: true,
        era: true,

        revenueallow: true,
        shortage: true,
        monthPoint: true,

        currentmonthavg: true,
        currentmonthattendance: true,
        paidstatus: true,

        achievedproductionallowance: true,
        actualnetsalary: true,

        //FINAL
        lopbasic: true,
        lophra: true,
        lopconveyance: true,
        lopmedicalallowance: true,
        lopproductionallowance: true,
        lopotherallowance: true,
        lopnetsalary: true,
        prodbasic: true,
        prodhra: true,
        prodconveyance: true,
        prodmedicalallowance: true,
        prodproductionallowance: true,
        prodotherallowance: true,
        attendancelop: true,
        calculatednetsalary: true,
        actualpenaltyamount: true,
        penaltyamount: true,
        lossdeduction: true,
        otherdeduction: true,
        finalbasic: true,
        finalhra: true,
        finalconveyance: true,
        finalmedicalallowance: true,
        finalproductionallowance: true,
        finalotherallowance: true,
        finalnetsalary: true,
        pfdays: true,
        ncpdays: true,
        pfdeduction: true,
        esideduction: true,
        finallopdays: true,
        paysliplop: true,
        finalleavededuction: true,
        professionaltax: true,
        totaldeductions: true,
        uan: true,
        ipname: true,
        noallowanceshift: true,
        shiftallowancepoint: true,
        shiftallowancetarget: true,
        nightshiftallowance: true,
        finalsalary: true,
        finalsalarypenalty: true,
        totalpointsvalue: true,
        era: true,
        actualera: true,
        pfemployerdeduction: true,
        esiemployerdeduction: true,
        ctc: true,
        revenueallowance: true,
        finalvalue: true,
        finalvaluetwo: true,
        finalvaluepenalty: true,
        shortage: true,
        shortageone: true,
        actualdeduction: true,
        minimumdeduction: true,
        finalvaluereview: true,
        finalvaluestatus: true,
        finalvaluepenaltystatus: true,

        //FIXED
        fixedlossdeduction: true,
        fixednetsalary: true,
        fixedbasic: true,
        fixedhra: true,
        fixedconveyance: true,
        fixedmedicalallowance: true,
        fixedproductionallowance: true,
        fixedotherallowance: true,
        fixednetsalaryone: true,
        fixedemppf: true,
        fixedempesi: true,
        fixedempptax: true,
        fixedemprpf: true,
        fixedempresi: true,
        fixedshiftallowance: true,
        fixedtotaldeductions: true,
        fixedsalary: true,
        fixedsalarypenalty: true,
        fixedlop: true,
        fixedlopdays: true,
        fixedleavededuction: true,
        fixedctc: true,
        fixedfinalvalue: true,
        fixedactualdeduction: true,
        fixedminimumdeduction: true,

        //PRODUCTION
        prodlossdeduction: true,
        prodnetsalary: true,
        prodbasicp: true,
        prodhrap: true,
        prodconveyancep: true,
        prodmedicalallowancep: true,
        prodproductionallowancep: true,
        prodotherallowancep: true,
        prodnetsalaryonep: true,
        prodemppf: true,
        prodempesi: true,
        prodempptax: true,
        prodemprpf: true,
        prodempresi: true,
        prodshiftallowance: true,
        prodtotaldeductions: true,
        prodsalary: true,
        prodsalarypenalty: true,
        prodlopdays: true,
        prodlop: true,
        prodleavededuction: true,
        prodctc: true,
        prodfinalvalue: true,
        prodactualdeduction: true,
        prodminimumdeduction: true,

        salarytype: true,
        deductiontype: true,
        salarytypeedit: true,
        deductiontypeedit: true,
        waiver: true,
        otherdeductionfinal: true,
        lossdeductionfinal: true,
        sentconfirm: true,
    };

    //get all Sub vendormasters.
    const fetchAttedanceStatus = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ATTENDANCE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAttStatus(res_vendor?.data?.attendancestatus);
        } catch (err) {
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

    //get all Attendance Status name.
    const fetchAttMode = async () => {
        try {
            let res_freq = await axios.get(SERVICE.ATTENDANCE_MODE_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAttModearr(res_freq?.data?.allattmodestatus);
        } catch (err) {
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

    useEffect(() => {
        fetchAttedanceStatus();
        fetchAttMode();
    }, []);




    //get all employees list details
    const fetchSalarySlabs = async () => {
        try {
            setBankdetail(true);
            let res_employee = await axios.get(SERVICE.SALARYSLAB_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setsalSlabs(res_employee.data.salaryslab);

            setBankdetail(false);
        } catch (err) {
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
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something went7 wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    //get all data.
    const fetchManageshortagemaster = async () => {
        try {
            let res_status = await axios.get(SERVICE.MANAGESHORTAGEMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setManageshortagemasters(res_status?.data?.manageshortagemasters);
            // setStatusCheck(true);
        } catch (err) {
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
                        {" "}
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something 6 went wrong!"}</p>{" "}
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    const fetchERAamount = async () => {
        try {
            let res_status = await axios.get(SERVICE.ERAAMOUNTSLIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEraAmounts(res_status?.data?.eraamounts);
        } catch (err) {
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
                        {" "}
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something 6 went wrong!"}</p>{" "}
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    const fetchTargetPointsData = async () => {
        try {
            let Res = await axios.get(SERVICE.REVENUEAMOUNTSLIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setRevenueAmount(Res?.data?.revenueamounts);
        } catch (err) {
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

    const fetchAcpointCalculation = async () => {
        try {
            let Res = await axios.get(SERVICE.ACPOINTCALCULATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcPointCal(Res?.data?.acpointcalculation);
        } catch (err) {
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

    //get all PayRunContr.
    const fetchPayRunControls = async () => {
        try {
            let res_project = await axios.get(SERVICE.PAYRUNCONTROL_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setPayruncontrolmaster(res_project?.data?.payruncontrol);
        } catch (err) {
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
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something2020 went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //  PDF
    const columns = [
        // Serial number column
        { title: "SNo", dataKey: "serialNumber" },
        { title: "Department", dataKey: "department" },
        { title: "Company", dataKey: "company" },
        { title: "Branch", dataKey: "branch" },
        { title: "Unit", dataKey: "unit" },
        { title: "Team", dataKey: "team" },
        { title: "Designation", dataKey: "designation" },
        { title: "Employee Name", dataKey: "companyname" },
        { title: "Employee Code", dataKey: "empcode" },
        { title: "Aadhar Name", dataKey: "legalname" },
        { title: "Process Code", dataKey: "processcode" },
        { title: "DOJ", dataKey: "doj" },
        { title: "Experience In Month", dataKey: "experience" },
        { title: "Prod Exp", dataKey: "prodexp" },
        { title: "totalnumberofdays", dataKey: "totalnumberofdays" },
        { title: "Total Shift", dataKey: "totalshift" },
        { title: "CLSL", dataKey: "clsl" },
        { title: "WeekOff", dataKey: "weekoff" },
        { title: "Holiday", dataKey: "holiday" },
        { title: "Total Absent/Leave", dataKey: "totalasbleave" },
        { title: "Total Paid Days", dataKey: "totalpaidDays" },

        { title: "Gross", dataKey: "oldgross" },
        { title: "Basic", dataKey: "oldbasic" },
        { title: "HRA", dataKey: "oldhra" },
        { title: "Conveyance", dataKey: "oldconveyance" },
        { title: "Medical Allowance", dataKey: "oldmedicalallowance" },
        { title: "Production Allowance", dataKey: "oldproductionallowance" },
        { title: "Production Allowance 2", dataKey: "oldproductionallowancetwo" },
        { title: "Other Allowance", dataKey: "oldotherallowance" },

        { title: "New Gross", dataKey: "newgross" },
        { title: "Actual Basic", dataKey: "actualbasic" },
        { title: "Actual HRA", dataKey: "actualhra" },
        { title: "Actual Conveyance", dataKey: "actualconveyance" },
        { title: "Actual Medical Allowance", dataKey: "actualmedicalallowance" },
        { title: "Actual Production Allowance", dataKey: "actualproductionallowance" },
        { title: "Actual Production Allowance 2", dataKey: "actualproductionallowancetwo" },
        { title: "Actual Other Allowance", dataKey: "actualotherallowance" },
        { title: "Target Points", dataKey: "targetpoints" },
        { title: "Achieved Points", dataKey: "acheivedpoints" },
        { title: "Achieved %", dataKey: "acheivedpercent" },
        { title: "Achieved Production Allowance", dataKey: "achievedproductionallowance" },
        { title: "Actual Net Salary", dataKey: "actualnetsalary" },
        { title: "LOP Basic", dataKey: "lopbasic" },
        { title: "LOP HRA", dataKey: "lophra" },
        { title: "LOP Conveyance", dataKey: "lopconveyance" },
        { title: "LOP Medical Allowance", dataKey: "lopmedicalallowance" },
        { title: "LOP Production Allowance", dataKey: "lopproductionallowance" },
        { title: "LOP Other Allowance", dataKey: "lopotherallowance" },
        { title: "LOP Net Salary", dataKey: "lopnetsalary" },
        { title: "PROD Basic", dataKey: "prodbasic" },
        { title: "PROD HRA", dataKey: "prodhra" },
        { title: "PROD Conveyance", dataKey: "prodconveyance" },
        { title: "PROD Medical Allowance", dataKey: "prodmedicalallowance" },
        { title: "PROD Production Allowance", dataKey: "prodproductionallowance" },
        { title: "PROD Other Allowance", dataKey: "prodotherallowance" },
        { title: "Attendance LOP", dataKey: "attendancelop" },
        { title: "Calculated Net Salary", dataKey: "calculatednetsalary" },
        { title: "Actual Penalty Amount", dataKey: "actualpenaltyamount" },
        { title: "Penalty Amount", dataKey: "penaltyamount" },
        { title: "Loss Deduction", dataKey: "lossdeduction" },
        { title: "Other Deduction", dataKey: "otherdeduction" },
        { title: "Final Basic", dataKey: "finalbasic" },
        { title: "Final HRA", dataKey: "finalhra" },
        { title: "Final Conveyance", dataKey: "finalconveyance" },
        { title: "Final Medical Allowance", dataKey: "finalmedicalallowance" },
        { title: "Final Production Allowance", dataKey: "finalproductionallowance" },
        { title: "Final Other Allowance", dataKey: "finalotherallowance" },
        { title: "Final Net Salary", dataKey: "finalnetsalary" },
        { title: "PF Days", dataKey: "pfdays" },
        { title: "NCP Days", dataKey: "ncpdays" },
        { title: "PF Deduction", dataKey: "pfdeduction" },
        { title: "ESI Deduction", dataKey: "esideduction" },
        { title: "Final LOP", dataKey: "finallopdays" },
        { title: "Final LOP Days", dataKey: "paysliplop" },
        { title: "finalleavededuction", dataKey: "finalleavededuction" },
        { title: "Professional Tax", dataKey: "professionaltax" },
        { title: "Total Deductions", dataKey: "totaldeductions" },
        { title: "UAN", dataKey: "uan" },
        { title: "IP Name", dataKey: "ipname" },
        { title: "No. Allowance Shift", dataKey: "noallowanceshift" },
        { title: "Shift Allowance Point", dataKey: "shiftallowancepoint" },
        { title: "Shift Allowance Target", dataKey: "shiftallowancetarget" },
        { title: "Night Shift Allowance", dataKey: "nightshiftallowance" },
        { title: "Final Salary", dataKey: "finalsalary" },
        { title: "Final Salary-Penalty", dataKey: "finalsalarypenalty" },
        { title: "Total Points Value", dataKey: "totalpointsvalue" },
        { title: "ERA", dataKey: "era" },
        { title: "Actual ERA", dataKey: "actualera" },
        { title: "PF Employer Deduction", dataKey: "pfemployerdeduction" },
        { title: "ESI Employer Deduction", dataKey: "esiemployerdeduction" },
        { title: "CTC", dataKey: "ctc" },
        { title: "Revenue Allowance", dataKey: "revenueallowance" },
        { title: "Final Value", dataKey: "finalvalue" },
        { title: "Final Value-Penalty", dataKey: "finalvaluepenalty" },
        { title: "Shortage", dataKey: "shortage" },
        { title: "Shortage 1", dataKey: "shortageone" },
        { title: "Actual Deduction", dataKey: "actualdeduction" },
        { title: "Minimum Deduction", dataKey: "minimumdeduction" },
        { title: "Final Value Review", dataKey: "finalvaluereview" },
        { title: "Final Value Status", dataKey: "finalvaluestatus" },
        { title: "Final Value Penalty Status", dataKey: "finalvaluepenaltystatus" },

        { title: "Fixed Loss Deduction", dataKey: "fixedlossdeduction" },
        { title: "Fixed Net Salary", dataKey: "fixednetsalary" },
        { title: "Fixed Basic", dataKey: "fixedbasic" },
        { title: "Fixed HRA", dataKey: "fixedhra" },
        { title: "Fixed Conveyance", dataKey: "fixedconveyance" },
        { title: "Fixed Medical Allowance", dataKey: "fixedmedicalallowance" },
        { title: "Fixed Production Allowance", dataKey: "fixedproductionallowance" },
        { title: "Fixed Other Allowance", dataKey: "fixedotherallowance" },
        { title: "Fixed Net Salary1", dataKey: "fixednetsalaryone" },
        { title: "PF Deduction", dataKey: "fixedemppf" },
        { title: "ESI Deduction", dataKey: "fixedempesi" },
        { title: "Fixed Emp Tax", dataKey: "fixedempptax" },
        { title: "PF Employer Deduction", dataKey: "fixedemprpf" },
        { title: "ESI Employer Deduction", dataKey: "fixedempresi" },
        { title: "Fixed Shift Allowance", dataKey: "fixedshiftallowance" },
        { title: "Fixed Total Deductions", dataKey: "fixedtotaldeductions" },
        { title: "Fixed Salary", dataKey: "fixedsalary" },
        { title: "Fixed Salary-Penalty", dataKey: "fixedsalarypenalty" },
        { title: "Fixed LOP", dataKey: "fixedlop" },
        { title: "Fixed LOP Days", dataKey: "fixedlopdays" },
        { title: "Fixed leave Deduction", dataKey: "fixedleavededuction" },
        { title: "Fixed CTC", dataKey: "fixedctc" },
        { title: "Fixed Final Value", dataKey: "fixedfinalvalue" },
        { title: "Fixed Actual Deduction", dataKey: "fixedactualdeduction" },
        { title: "Fixed Minimum Deduction", dataKey: "fixedminimumdeduction" },



        { title: "Current Month Avg", dataKey: "currentmonthavg" },
        { title: "CurrenT Month Attendance", dataKey: "currentmonthattendance" },
        { title: "Paid Status", dataKey: "paidstatus" },

        { title: "Salary Type", dataKey: "salarytype" },
        { title: "Deduction Type", dataKey: "deductiontype" },
    ];

    const downloadPdf = () => {
        const doc = new jsPDF({
            orientation: "landscape",
        });

        const maxColumnsPerPage = 15; // Maximum number of columns per page
        const totalPages = Math.ceil(columns.length / maxColumnsPerPage); // Calculate total pages needed

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const startIdx = (currentPage - 1) * maxColumnsPerPage;
            const endIdx = Math.min(startIdx + maxColumnsPerPage, columns.length);

            const currentPageColumns = columns.slice(startIdx, endIdx);

            doc.autoTable({
                theme: "grid",
                styles: {
                    fontSize: 5,
                },
                columns: currentPageColumns,
                body: rowDataTable,
            });

            if (currentPage < totalPages) {
                doc.addPage(); // Add a new page if there are more columns to display
            }
        }

        doc.save("Pay Run List.pdf");
    };

    // Excel
    const fileName = "Pay Run List";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Pay Run List",
        pageStyle: "print",
    });



    // const gridApi = useRef(null);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [currentData, setCurrentData] = useState([]);
    // const totalPages = Math.ceil(rowData.length / pageSize);

    // const onQuickFilterChanged = useCallback((event) => {
    //     if (gridApi.current) {
    //         gridApi.current.setQuickFilter(event.target.value);
    //     }
    // }, []);

    // const onGridReady = (params) => {
    //     gridApi.current = params.api;
    // };

    // useEffect(() => {
    //     updateGridData();
    // }, [currentPage, rowData, pageSize]);

    // const updateGridData = () => {
    //     const start = (currentPage - 1) * pageSize;
    //     const end = start + pageSize;
    //     setCurrentData(rowData.slice(start, end));
    // };

    // const handlePageChange = (page) => {
    //     if (page >= 1 && page <= totalPages) {
    //         setCurrentPage(page);
    //     }
    // };

    // const handlePageSizeChange = (e) => {
    //     setPageSize(Number(e.target.value));
    //     setCurrentPage(1); // Reset to the first page whenever page size changes
    // };

    // const getPageNumbers = () => {
    //     const pageNumbers = [];
    //     if (totalPages <= 3) {
    //         for (let i = 1; i <= totalPages; i++) {
    //             pageNumbers.push(i);
    //         }
    //     } else {
    //         if (currentPage === 1) {
    //             pageNumbers.push(1, 2, 3);
    //         } else if (currentPage === totalPages) {
    //             pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
    //         } else {
    //             pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
    //         }
    //     }
    //     return pageNumbers;
    // };

    // const pageNumbers = getPageNumbers();

    const gridApi = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [filteredData, setFilteredData] = useState(rowData);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const onQuickFilterChanged = useCallback((event) => {
        if (gridApi.current) {
            const filterText = event.target.value;
            gridApi.current.setQuickFilter(filterText);
            const filtered = rowData.filter(row => JSON.stringify(row).toLowerCase().includes(filterText.toLowerCase()));
            setFilteredData(filtered);
            setCurrentPage(1);
        }
    }, [rowData]);

    const onGridReady = (params) => {
        gridApi.current = params.api;
    };

    useEffect(() => {
        updateGridData();
    }, [currentPage, filteredData, pageSize]);

    const updateGridData = () => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setCurrentData(filteredData.slice(start, end));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page whenever page size changes
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage === 1) {
                pageNumbers.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();



    const [selectedViewMonthNum, setSelectedViewMonthNum] = useState();


    const columnDataTable = [
        {
            field: "serialNumber",
            headerName: "SNo",
            width: 80,
            sortable: true, filter: true, resizable: true, pinned: "left",
            hide: !columnVisibility.serialNumber,
        },
        { field: "department", headerName: "Department", sortable: true, filter: true, resizable: true, hide: !columnVisibility.department },
        { field: "company", headerName: "Company", sortable: true, filter: true, resizable: true, hide: !columnVisibility.company },
        { field: "branch", headerName: "Branch", sortable: true, filter: true, resizable: true, hide: !columnVisibility.branch },
        { field: "unit", headerName: "Unit", sortable: true, filter: true, resizable: true, hide: !columnVisibility.unit },
        { field: "team", headerName: "Team", sortable: true, filter: true, resizable: true, hide: !columnVisibility.team },
        { field: "designation", headerName: "Designation", sortable: true, filter: true, resizable: true, hide: !columnVisibility.designation },
        {
            field: "companyname", headerName: "Employee Name", sortable: true, filter: true, resizable: true, pinned: "left",
            hide: !columnVisibility.companyname,
        },

        { field: "empcode", headerName: "Emp Code", sortable: true, filter: true, resizable: true, hide: !columnVisibility.empcode },
        { field: "legalname", headerName: "Aadhar Name", sortable: true, filter: true, resizable: true, hide: !columnVisibility.legalname },

        { field: "processcode", headerName: "Process Code", sortable: true, filter: true, resizable: true, hide: !columnVisibility.processcode },

        { field: "doj", headerName: "DOJ", sortable: true, filter: true, resizable: true, hide: !columnVisibility.doj },
        { field: "experience", headerName: "Actual Exp", sortable: true, filter: true, resizable: true, hide: !columnVisibility.experience },
        { field: "prodexp", headerName: "Prod Exp", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodexp },


        { field: "totalnumberofdays", headerName: "Total No.of Days", sortable: true, filter: true, resizable: true, hide: !columnVisibility.totalnumberofdays },
        { field: "totalshift", headerName: "Total Shift", sortable: true, filter: true, resizable: true, hide: !columnVisibility.totalshift },
        { field: "clsl", headerName: "C.L. / S.L.", sortable: true, filter: true, resizable: true, hide: !columnVisibility.clsl },
        { field: "weekoff", headerName: "Week Off", sortable: true, filter: true, resizable: true, hide: !columnVisibility.weekoff },
        { field: "holiday", headerName: "Holiday", sortable: true, filter: true, resizable: true, hide: !columnVisibility.holiday },
        {
            field: "totalasbleave", headerName: "Total Absent/Leave Shift", sortable: true, filter: true, resizable: true, hide: !columnVisibility.totalasbleave,

        },
        {
            field: "totalpaidDays", headerName: "Total Paid Shift", sortable: true, filter: true, resizable: true, hide: !columnVisibility.totalpaidDays,

        },

        { field: "oldgross", headerName: "Gross", sortable: true, filter: true, resizable: true, hide: !columnVisibility.oldgross, },
        { field: "oldbasic", headerName: "Basic", sortable: true, filter: true, resizable: true, hide: !columnVisibility.oldbasic },
        { field: "oldhra", headerName: "HRA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.oldhra },
        { field: "oldconveyance", headerName: "Conveyance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.oldconveyance },
        { field: "oldmedicalallowance", headerName: "Medical Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.oldmedicalallowance },
        { field: "oldproductionallowance", headerName: "Production Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.oldproductionallowance },
        { field: "oldproductionallowancetwo", headerName: "Production Allowance 2", sortable: true, filter: true, resizable: true, hide: !columnVisibility.oldproductionallowancetwo },
        { field: "oldotherallowance", headerName: "Other Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.oldotherallowance },


        { field: "newgross", headerName: "New Gross", sortable: true, filter: true, resizable: true, hide: !columnVisibility.newgross },
        { field: "actualbasic", headerName: "Actual Basic", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualbasic },
        { field: "actualhra", headerName: "Actual HRA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualhra },
        { field: "actualconveyance", headerName: "Actual Conveyance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualconveyance },
        { field: "actualmedicalallowance", headerName: "Actual Medical Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualmedicalallowance },
        { field: "actualproductionallowance", headerName: "Actual Production Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualproductionallowance },
        { field: "actualproductionallowancetwo", headerName: "Actual Production Allowance 2", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualproductionallowancetwo },
        { field: "actualotherallowance", headerName: "Actual Other Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualotherallowance },



        {
            field: "monthPoint",
            headerName: "Target Points",
            sortable: true, filter: true, resizable: true,

            hide: !columnVisibility.monthPoint,

        },
        {
            field: "acheivedpoints",
            headerName: "Acheived Points",

            sortable: true, filter: true, resizable: true,
            // valueSetter: params => {
            //     params.data.acheivedpoints = params.newValue;
            //     params.data.iseditedacheivedpoints = "Yes";
            //     params.api.applyTransaction({ update: [params.data] });
            //     return true;
            // },
            // editable: true,

            hide: !columnVisibility.acheivedpoints,

        },
        {
            field: "acheivedpercent",
            headerName: "Acheived %",
            sortable: true, filter: true, resizable: true,

            hide: !columnVisibility.acheivedpercent,

        },

        { field: "achievedproductionallowance", headerName: "Achieved Production Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.achievedproductionallowance, headerClassName: "bold-header" },
        { field: "actualnetsalary", headerName: "Actual Net Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualnetsalary, headerClassName: "bold-header" },
        { field: "lopbasic", headerName: "LOP Basic", sortable: true, filter: true, resizable: true, hide: !columnVisibility.lopbasic, headerClassName: "bold-header" },
        { field: "lophra", headerName: "LOP HRA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.lophra, headerClassName: "bold-header" },
        { field: "lopconveyance", headerName: "LOP Conveyance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.lopconveyance, headerClassName: "bold-header" },
        { field: "lopmedicalallowance", headerName: "LOP Medical Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.lopmedicalallowance, headerClassName: "bold-header" },
        { field: "lopproductionallowance", headerName: "LOP Production Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.lopproductionallowance, headerClassName: "bold-header" },
        { field: "lopotherallowance", headerName: "LOP Other Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.lopotherallowance, headerClassName: "bold-header" },
        { field: "lopnetsalary", headerName: "LOP Net Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.lopnetsalary, headerClassName: "bold-header" },
        { field: "prodbasic", headerName: "PROD Basic", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodbasic, headerClassName: "bold-header" },
        { field: "prodhra", headerName: "PROD HRA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodhra, headerClassName: "bold-header" },
        { field: "prodconveyance", headerName: "PROD Conveyance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodconveyance, headerClassName: "bold-header" },
        { field: "prodmedicalallowance", headerName: "PROD Medical Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodmedicalallowance, headerClassName: "bold-header" },
        { field: "prodproductionallowance", headerName: " PROD Production Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodproductionallowance, headerClassName: "bold-header" },
        { field: "prodotherallowance", headerName: "PROD Other Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodotherallowance, headerClassName: "bold-header" },
        { field: "attendancelop", headerName: "Attendance LOP", sortable: true, filter: true, resizable: true, hide: !columnVisibility.attendancelop, headerClassName: "bold-header" },
        { field: "calculatednetsalary", headerName: "Calculated Net Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.calculatednetsalary, headerClassName: "bold-header" },

        { field: "actualpenaltyamount", headerName: "Actual Penalty Amount", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualpenaltyamount, headerClassName: "bold-header" },
        {
            field: "penaltyamount", headerName: "Penalty Amount", sortable: true,
            // editable: true,
            // valueSetter: params => {
            //     params.data.penaltyamount = params.newValue;
            //     params.data.iseditedpenaltyamount = "Yes";
            //     params.api.applyTransaction({ update: [params.data] });
            //     return true;
            // },
            filter: true, resizable: true, hide: !columnVisibility.penaltyamount, headerClassName: "bold-header"
        },


        { field: "lossdeduction", headerName: "Loss Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.lossdeduction, headerClassName: "bold-header" },
        { field: "otherdeduction", headerName: "Other Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.otherdeduction, headerClassName: "bold-header" },


        //FIXED

        { field: "finalbasic", headerName: "Final Basic", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalbasic, headerClassName: "bold-header" },
        { field: "finalhra", headerName: "Final HRA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalhra, headerClassName: "bold-header" },
        { field: "finalconveyance", headerName: "Final Conveyance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalconveyance, headerClassName: "bold-header" },
        { field: "finalmedicalallowance", headerName: "Final Medical Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalmedicalallowance, headerClassName: "bold-header" },
        { field: "finalproductionallowance", headerName: "Final Production Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalproductionallowance, headerClassName: "bold-header" },
        { field: "finalotherallowance", headerName: "Final Other Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalotherallowance, headerClassName: "bold-header" },
        { field: "finalnetsalary", headerName: "Final Net Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalnetsalary, headerClassName: "bold-header" },
        { field: "pfdays", headerName: "PF Days", sortable: true, filter: true, resizable: true, hide: !columnVisibility.pfdays, headerClassName: "bold-header" },
        { field: "ncpdays", headerName: "NCP Days", sortable: true, filter: true, resizable: true, hide: !columnVisibility.ncpdays, headerClassName: "bold-header" },
        { field: "pfdeduction", headerName: "PF Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.pfdeduction, headerClassName: "bold-header" },
        { field: "esideduction", headerName: "ESI Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.esideduction, headerClassName: "bold-header" },
        { field: "finallopdays", headerName: "Final-LOP ", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finallopdays, headerClassName: "bold-header" },
        { field: "paysliplop", headerName: "Final LOP Days", sortable: true, filter: true, resizable: true, hide: !columnVisibility.paysliplop, headerClassName: "bold-header" },
        { field: "finalleavededuction", headerName: "Final Leave Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalleavededuction, headerClassName: "bold-header" },
        { field: "professionaltax", headerName: "Professional Tax", sortable: true, filter: true, resizable: true, hide: !columnVisibility.professionaltax, headerClassName: "bold-header" },
        { field: "totaldeductions", headerName: "Total Deductions", sortable: true, filter: true, resizable: true, hide: !columnVisibility.totaldeductions, headerClassName: "bold-header" },
        { field: "uan", headerName: "UAN", sortable: true, filter: true, resizable: true, hide: !columnVisibility.uan, headerClassName: "bold-header" },
        { field: "ipname", headerName: "IP Name", sortable: true, filter: true, resizable: true, hide: !columnVisibility.ipname, headerClassName: "bold-header" },
        { field: "noallowanceshift", headerName: "No. Allowance Shift", sortable: true, filter: true, resizable: true, hide: !columnVisibility.noallowanceshift, headerClassName: "bold-header" },
        { field: "shiftallowancepoint", headerName: "Shift Allowance Point", sortable: true, filter: true, resizable: true, hide: !columnVisibility.shiftallowancepoint, headerClassName: "bold-header" },
        { field: "shiftallowancetarget", headerName: "Shift Allowance Target", sortable: true, filter: true, resizable: true, hide: !columnVisibility.shiftallowancetarget, headerClassName: "bold-header" },
        { field: "nightshiftallowance", headerName: "Night Shift Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.nightshiftallowance, headerClassName: "bold-header" },
        { field: "finalsalary", headerName: "Final Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalsalary, headerClassName: "bold-header" },
        { field: "finalsalarypenalty", headerName: "Final Salary + Penalty", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalsalarypenalty, headerClassName: "bold-header" },
        { field: "totalpointsvalue", headerName: "Total Points Value", sortable: true, filter: true, resizable: true, hide: !columnVisibility.totalpointsvalue, headerClassName: "bold-header" },
        { field: "era", headerName: "ERA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.era, headerClassName: "bold-header" },
        { field: "actualera", headerName: "Actual ERA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualera, headerClassName: "bold-header" },
        { field: "pfemployerdeduction", headerName: "PF Employer Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.pfemployerdeduction, headerClassName: "bold-header" },
        { field: "esiemployerdeduction", headerName: "ESI Employer Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.esiemployerdeduction, headerClassName: "bold-header" },
        { field: "ctc", headerName: "CTC", sortable: true, filter: true, resizable: true, hide: !columnVisibility.ctc, headerClassName: "bold-header" },
        { field: "revenueallowance", headerName: "Revenue Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.revenueallowance, headerClassName: "bold-header" },
        { field: "finalvalue", headerName: "Final Value", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalvalue, headerClassName: "bold-header" },
        // { field: "finalvaluetwo", headerName: "Final Value 2", sortable: true, filter: true, resizable: true, , hide: !columnVisibility.finalvaluetwo, headerClassName: "bold-header" },
        { field: "finalvaluepenalty", headerName: "Final Value-Penalty", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalvaluepenalty, headerClassName: "bold-header" },
        { field: "shortage", headerName: "Shortage", sortable: true, filter: true, resizable: true, hide: !columnVisibility.shortage, headerClassName: "bold-header" },
        { field: "shortageone", headerName: "Shortage 1", sortable: true, filter: true, resizable: true, hide: !columnVisibility.shortageone, headerClassName: "bold-header" },
        { field: "actualdeduction", headerName: "Actual Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actualdeduction, headerClassName: "bold-header" },
        { field: "minimumdeduction", headerName: "Minimum Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.minimumdeduction, headerClassName: "bold-header" },
        {
            field: "finalvaluereview", headerName: "Final Value Review", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalvaluereview, headerClassName: "bold-header",
            cellRenderer: (props) => {
                const { data, node } = props;
                return (
                    <>
                        <Typography sx={{
                            width: "max-content",
                            color: data.finalvaluereview === "OK" ? "white" : "black", background: data.finalvaluereview === "OK" ? "skyblue" : "inherit", padding: "3px 5px", fontSize: "11px", borderRadius: "4px"
                        }}>{data.finalvaluereview}</Typography>
                    </>
                )
            }
        },
        {
            field: "finalvaluestatus", headerName: "Final Value Status", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalvaluestatus, headerClassName: "bold-header",
            cellRenderer: (props) => {
                const { data, node } = props;
                return (
                    <>
                        <Typography sx={{ width: "max-content", color: data.finalvaluestatus === "VERY LOSS" ? "black" : "white", background: data.finalvaluestatus === "VERY LOSS" ? "yellow" : data.finalvaluestatus === "OK" ? "lightgreen" : data.finalvaluestatus === "HIGH" ? "red" : data.finalvaluestatus === "LOSS OK" ? "black" : "inherit", padding: "3px 5px", fontSize: "11px", borderRadius: "4px" }}>
                            {data.finalvaluestatus}</Typography>
                    </>
                )
            }
        },
        {
            field: "finalvaluepenaltystatus", headerName: "Final Value Penalty Status", sortable: true, filter: true, resizable: true, hide: !columnVisibility.finalvaluepenaltystatus, headerClassName: "bold-header",
            cellRenderer: (props) => {
                const { data, node } = props;
                return (
                    <>
                        <Typography sx={{ width: "max-content", color: data.finalvaluepenaltystatus === "VERY LOSS" ? "black" : "white", background: data.finalvaluepenaltystatus === "VERY LOSS" ? "yellow" : data.finalvaluepenaltystatus === "OK" ? "lightgreen" : data.finalvaluepenaltystatus === "HIGH" ? "red" : data.finalvaluepenaltystatus === "LOSS OK" ? "black" : "inherit", padding: "3px 5px", fontSize: "11px", borderRadius: "4px" }}>
                            {data.finalvaluepenaltystatus}</Typography>
                    </>
                )
            }

        },

        //FIXED
        { field: "fixedlossdeduction", headerName: "Fixed Loss Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedlossdeduction, headerClassName: "bold-header" },
        { field: "fixednetsalary", headerName: "Fixed NET Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixednetsalary, headerClassName: "bold-header" },
        { field: "fixedbasic", headerName: "Fixed Basic", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedbasic, headerClassName: "bold-header" },
        { field: "fixedhra", headerName: "Fixed HRA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedhra, headerClassName: "bold-header" },
        { field: "fixedconveyance", headerName: "Fixed Conveyance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedconveyance, headerClassName: "bold-header" },
        { field: "fixedmedicalallowance", headerName: "Fixed Medical Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedmedicalallowance, headerClassName: "bold-header" },
        { field: "fixedproductionallowance", headerName: "Fixed Production Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedproductionallowance, headerClassName: "bold-header" },
        { field: "fixedotherallowance", headerName: "Fixed Other Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedotherallowance, headerClassName: "bold-header" },
        { field: "fixednetsalaryone", headerName: "Fixed NET Salary1", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixednetsalaryone, headerClassName: "bold-header" },
        { field: "fixedemppf", headerName: "Fixed Emp_pf", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedemppf, headerClassName: "bold-header" },
        { field: "fixedempesi", headerName: "Fixed Emp_Esi", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedempesi, headerClassName: "bold-header" },
        { field: "fixedempptax", headerName: "Fixed Emp_ptax", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedempptax, headerClassName: "bold-header" },
        { field: "fixedemprpf", headerName: "Fixed Empr_pf", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedemprpf, headerClassName: "bold-header" },
        { field: "fixedempresi", headerName: "Fixed Empr_Esi", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedempresi, headerClassName: "bold-header" },
        { field: "fixedshiftallowance", headerName: "Fixed Shift Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedshiftallowance, headerClassName: "bold-header" },
        { field: "fixedtotaldeductions", headerName: "Fixed Total Deductions", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedtotaldeductions, headerClassName: "bold-header" },
        { field: "fixedsalary", headerName: "Fixed Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedsalary, headerClassName: "bold-header" },
        { field: "fixedsalarypenalty", headerName: "Fixed Salary + Penalty", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedsalarypenalty, headerClassName: "bold-header" },
        { field: "fixedlop", headerName: "Fixed-LOP", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedlop, headerClassName: "bold-header" },
        { field: "fixedlopdays", headerName: "Fixed LOP Days", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedlopdays, headerClassName: "bold-header" },
        { field: "fixedleavededuction", headerName: "Fixed Leave Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedleavededuction, headerClassName: "bold-header" },
        { field: "fixedctc", headerName: "Fixed CTC", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedctc, headerClassName: "bold-header" },
        { field: "fixedfinalvalue", headerName: "Fixed Final Value", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedfinalvalue, headerClassName: "bold-header" },
        { field: "fixedactualdeduction", headerName: "Fixed Actual Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedactualdeduction, headerClassName: "bold-header" },
        { field: "fixedminimumdeduction", headerName: "Fixed Minimum Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.fixedminimumdeduction, headerClassName: "bold-header" },

        //PRODUCTION
        { field: "prodlossdeduction", headerName: "PROD Loss Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodlossdeduction, headerClassName: "bold-header" },
        { field: "prodnetsalary", headerName: "PROD NET_Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodnetsalary, headerClassName: "bold-header" },
        { field: "prodbasicp", headerName: "PROD Basic", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodbasicp, headerClassName: "bold-header" },
        { field: "prodhrap", headerName: "PROD HRA", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodhrap, headerClassName: "bold-header" },
        { field: "prodconveyancep", headerName: "PROD Conveyance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodconveyancep, headerClassName: "bold-header" },
        { field: "prodmedicalallowancep", headerName: "PROD Medical Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodmedicalallowancep, headerClassName: "bold-header" },
        { field: "prodproductionallowancep", headerName: "PROD Production Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodproductionallowancep, headerClassName: "bold-header" },
        { field: "prodotherallowancep", headerName: "PROD Other Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodotherallowancep, headerClassName: "bold-header" },
        { field: "prodnetsalaryonep", headerName: "PROD NET_Salary1", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodnetsalaryonep, headerClassName: "bold-header" },
        { field: "prodemppf", headerName: "PROD Emp_pf", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodemppf, headerClassName: "bold-header" },
        { field: "prodempesi", headerName: "PROD Emp_esi", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodempesi, headerClassName: "bold-header" },
        { field: "prodempptax", headerName: "PROD Emp_ptax", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodempptax, headerClassName: "bold-header" },
        { field: "prodemprpf", headerName: "PROD Empr_pf", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodemprpf, headerClassName: "bold-header" },
        { field: "prodempresi", headerName: "PROD Empr_Esi", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodempresi, headerClassName: "bold-header" },
        { field: "prodshiftallowance", headerName: "PROD Shift_Allowance", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodshiftallowance, headerClassName: "bold-header" },
        { field: "prodtotaldeductions", headerName: "PROD Total Deductions", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodtotaldeductions, headerClassName: "bold-header" },
        { field: "prodsalary", headerName: "PROD Salary", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodsalary, headerClassName: "bold-header" },
        { field: "prodsalarypenalty", headerName: "PROD Salary+Penalty", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodsalarypenalty, headerClassName: "bold-header" },
        { field: "prodlopdays", headerName: "PROD LOP Days", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodlopdays, headerClassName: "bold-header" },
        { field: "prodlop", headerName: "PROD LOP", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodlop, headerClassName: "bold-header" },
        { field: "prodleavededuction", headerName: "PROD Leave Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodleavededuction, headerClassName: "bold-header" },
        { field: "prodctc", headerName: "PROD CTC", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodctc, headerClassName: "bold-header" },
        { field: "prodfinalvalue", headerName: "PROD Final Value", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodfinalvalue, headerClassName: "bold-header" },
        { field: "prodactualdeduction", headerName: "PROD Actual Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodactualdeduction, headerClassName: "bold-header" },
        { field: "prodminimumdeduction", headerName: "PROD Minimum Deduction", sortable: true, filter: true, resizable: true, hide: !columnVisibility.prodminimumdeduction, headerClassName: "bold-header" },



        { field: "bankname", headerName: "Bank Name", sortable: true, filter: true, resizable: true, hide: !columnVisibility.bankname },
        { field: "accountname", headerName: "Account Name", sortable: true, filter: true, resizable: true, hide: !columnVisibility.accountname },
        { field: "accountnumber", headerName: "Account Number", sortable: true, filter: true, resizable: true, hide: !columnVisibility.accountnumber },
        { field: "ifsccode", headerName: "IFSC Code", sortable: true, filter: true, resizable: true, hide: !columnVisibility.ifsccode },

        { field: "uan", headerName: "UAN", sortable: true, filter: true, resizable: true, hide: !columnVisibility.uan },
        { field: "pfmembername", headerName: "pf Member Name", sortable: true, filter: true, resizable: true, hide: !columnVisibility.pfmembername },
        { field: "insuranceno", headerName: "Insurance No", sortable: true, filter: true, resizable: true, hide: !columnVisibility.insuranceno },
        { field: "ipname", headerName: "IP Name", sortable: true, filter: true, resizable: true, hide: !columnVisibility.ipname },


        { field: "currentmonthavg", headerName: `Current (${monthsArr[Number(selectedViewMonthNum) >= 12 ? 0 : Number(selectedViewMonthNum)]}) Month Avg`, sortable: true, filter: true, resizable: true, minWidth: 160, hide: !columnVisibility.currentmonthavg },
        { field: "currentmonthattendance", headerName: `Current Month (${monthsArr[Number(selectedViewMonthNum) >= 12 ? 0 : Number(selectedViewMonthNum)]}) Attendance`, sortable: true, filter: true, resizable: true, minWidth: 160, hide: !columnVisibility.currentmonthattendance },

        { field: "paidstatus", headerName: "Paid Status", sortable: true, filter: true, resizable: true, hide: !columnVisibility.paidstatus },

        {
            headerName: "Salary Type", minWidth: 160, field: "salarytypeedit", sortable: true, editable: true, cellEditor: 'agSelectCellEditor', filter: true, resizable: true, width: 100,
            cellEditorParams: (params) => {
                const rowData = params.node.data;
                const salaryTypeOpt = rowData.salaryTypeOpt;

                // Ensure statusopt is an array
                const typeSalOptValues = Array.isArray(salaryTypeOpt) ? salaryTypeOpt : [];

                return {
                    values: typeSalOptValues,

                };
            }
        },
        {
            headerName: "Deduction Type", minWidth: 170, field: "deductiontypeedit", sortable: true, editable: true, cellEditor: 'agSelectCellEditor', filter: true, resizable: true, width: 100,
            cellEditorParams: (params) => {
                const rowData = params.node.data;
                const deductionTypeOpt = rowData.deductionOpt;

                // Ensure statusopt is an array
                const typeDedOptValues = Array.isArray(deductionTypeOpt) ? deductionTypeOpt : [];

                return {
                    values: typeDedOptValues
                };
            }
        },
        {
            field: "waiver", headerName: "Waiver %", sortable: true, editable: true,
            valueSetter: params => {
                params.data.waiver = params.newValue;
                return true;
            },
            filter: true, resizable: true, hide: !columnVisibility.waiver
        },
        {
            field: "otherdeductionfinal",
            headerName: "Other-Deductions",
            valueSetter: params => {
                params.data.otherdeductionfinal = params.newValue;
                params.api.applyTransaction({ update: [params.data] });
                return true;
            },
            editable: true, sortable: true, filter: true, resizable: true, hide: !columnVisibility.otherdeductionfinal
        },

        {
            field: "actions", headerName: "Action", sortable: true, filter: true, resizable: true, hide: !columnVisibility.actions, headerClassName: "bold-header",
            cellRenderer: ButtonCellRenderer,

        },
        {
            field: "lossdeductionfinal", headerName: "Loss-Deductions",
            valueSetter: params => {
                params.data.lossdeductionfinal = params.newValue;
                params.api.applyTransaction({ update: [params.data] });
                return true;
            },
            editable: true, sortable: true, filter: true, resizable: true, hide: !columnVisibility.lossdeductionfinal
        },

        {
            field: "sentconfirm", headerName: "Sent Confirmation", sortable: true, filter: true, resizable: true, hide: !columnVisibility.sentconfirm,
            cellRenderer: ButtonCellRendererSent,
        },


    ];

    const rowDataTable = currentData.map((item, index) => {
        let allowancepointCalcVal = item.allowancepoint;
        let totalasbleaveCalcVal = item.totalasbleave;
        let targetPointCalcVaue = item.monthPoint;
        let AcheivedPointsCalcVal = item.acheivedpoints;

        let penaltyCalcVal = item.penalty;

        let totalpaiddaycalVal = item.totalpaidDays;
        let currMonAvgFinalcalVal = item.currentmonthavg;

        let currMonAttFinalcalVal = item.currentmonthattendance;

        let noshiftlogvalfinal = item.noallowancepoint;

        let shiftallowancetargetfinal = item.shiftallowancetarget;

        let nightAllowanceCalcVal = item.nightshiftallowance;




        return {
            //usersdatas
            ...item,
            id: item._id,
            outerId: item.outerId,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            empcode: item.empcode,
            companyname: item.companyname,
            legalname: item.legalname,
            doj: item.doj,
            designation: item.designation,
            department: item.department,
            processcode: item.processcode,
            prodexp: item.prodexp,
            processcodeexp: item.processcodeexp,
            experience: Number(item.experience),
            //need to fetch from users
            bankname: item.bankname,
            accountname: item.accountholdername,
            accountnumber: item.accountnumber,
            ifsccode: item.ifsccode,
            totalnumberofdays: Number(item.totalnumberofdays),
            totalshift: Number(item.totalshift),
            clsl: Number(item.clsl),
            weekoff: Number(item.weekoffcount),
            holiday: Number(item.holiday),
            totalasbleave: Number(totalasbleaveCalcVal),
            totalpaidDays: Number(totalpaiddaycalVal),

            //fetched from salary slab filter
            calcualted: item.calcualted,
            waiver: 0,
            oldgross: Number(item.oldgross),
            oldbasic: Number(item.oldbasic),
            oldhra: Number(item.oldhra),
            oldconveyance: Number(item.oldconveyance),
            oldmedicalallowance: Number(item.oldmedicalallowance),
            oldproductionallowance: Number(item.oldproductionallowance),
            oldproductionallowancetwo: Number(item.oldproductionallowancetwo),
            oldotherallowance: Number(item.oldotherallowance),
            gross: Number(item.oldgross),

            newgross: Number(item.gross),
            actualbasic: Number(item.basic),
            actualhra: Number(item.hra),
            actualconveyance: Number(item.conveyance),
            actualmedicalallowance: Number(item.medicalallowance),
            actualproductionallowance: Number(item.productionallowance),
            actualproductionallowancetwo: Number(item.productionallowancetwo),
            actualotherallowance: Number(item.otherallowance),

            //need to fetch from daypoints upload
            targetpoints: Number(targetPointCalcVaue),
            acheivedpoints: Number(AcheivedPointsCalcVal),
            acheivedpercent: item.acheivedpercent,

            // actualpenalty: penaltyCalcVal,
            actualpenaltyamount: Number(item.penalty),
            penaltyamount: Number(item.penaltyamount),
            // penaltyamt: item.penalty,
            uan: item.uan,
            pfmembername: item.pfmembername,
            insuranceno: item.insurancenumber,
            ipname: item.ipname,
            noallowanceshift: Number(noshiftlogvalfinal),
            shiftallowancepoint: Number(allowancepointCalcVal),

            shiftallowancetarget: Number(shiftallowancetargetfinal),
            nightshiftallowance: Number(nightAllowanceCalcVal),

            era: item.eramount ? Number(item.eramount) : 0,

            revenueallow: item.revenueallow ? Number(item.revenueallow) : 0,
            shortage: item.shortage ? Number(item.shortage) : 0,

            endtar: item.endtar,
            endtardate: item.endtardate,
            endexp: item.endexp,
            endexpdate: item.endexpdate,

            assignExpMode: item.assignExpMode,
            modevalue: item.modevalue,

            targetexp: item.targetexp,
            prodexp: item.prodexp,
            modeexp: item.modeexp,
            processcode: item.processcode,

            processcodetar: item.processcodetar,

            salexp: item.salexp,

            monthPoint: Number(targetPointCalcVaue),
            dayPoint: Number(item.dayPoint),

            currentmonthavg: Number(currMonAvgFinalcalVal),
            currentmonthattendance: Number(currMonAttFinalcalVal),
            paidstatus: Number(item.paidstatus),

            //logs and value
            totalpaiddayslog: item.totalpaiddayslog,
            totalpaiddaycalVal1: item.totalpaiddaycalVal1,

            totalabsentlog: item.totalabsentlog,
            totalabsentcalVal1: item.totalabsentcalVal1,

            penaltylog: item.penaltylog,
            penaltylogcalVal1: item.penaltyCalVal1,

            targetpointlog: item.targetpointlog,
            targetpointcalVal1: item.targetpointCalVal1,

            acheivedpointlog: item.acheivedpointlog,
            acheivedpointcalVal1: item.acheivedpointCalVal1,

            shiftallowancelog: item.shiftallowancelog,
            shiftallowanceCalVal1: item.shiftallowanceCalVal1,

            currmonthavglog: item.currmonthavglog,
            currentmonthavgCalVal1: item.currentmonthavgCalVal1,

            currmonthattlog: item.currmonthattlog,
            currentmonthattCalVal1: item.currentmonthattCalVal1,

            noshiftlog: item.noshiftlog,
            noshiftlogCalVal1: item.noshiftlogCalVal1,


            shiftallowtargetlog: item.shiftallowtargetlog,
            shiftallowtargetlogCalVal1: item.shiftallowtargetlogCalVal1,


            nightshiftallowlog: item.nightshiftallowlog,
            nightshiftallowlogCalVal1: item.nightshiftallowlogCalVal1,

            selectedmonth: item.selectedmonth,
            selectedyear: item.selectedyear,

            achievedproductionallowance: Number(item.acheivedproductionallowance),
            actualnetsalary: Number(item.actualnetsalary),
            lopbasic: Number(item.lopbasic),
            lophra: Number(item.lophra),
            lopconveyance: Number(item.lopconveyance),
            lopmedicalallowance: Number(item.lopmedicalallowance),
            lopproductionallowance: Number(item.lopproductionallowance),
            lopotherallowance: Number(item.lopotherallowance),
            lopnetsalary: Number(item.lopnetsalary),
            prodbasic: Number(item.prodbasic),
            prodhra: Number(item.prodhra),
            prodconveyance: Number(item.prodconveyance),
            prodmedicalallowance: Number(item.prodmedicalallowance),
            prodproductionallowance: Number(item.prodproductionallowance),
            prodotherallowance: Number(item.prodotherallowance),
            attendancelop: Number(item.attendancelop),
            calculatednetsalary: Number(item.calculatednetsalary),
            actualpenaltyamount: Number(item.penalty),
            penaltyamount: Number(item.penaltyamount),
            lossdeduction: Number(item.lossdeduction),
            otherdeduction: Number(item.otherdeduction),
            finalbasic: Number(item.finalbasic),
            finalhra: Number(item.finalhra),
            finalconveyance: Number(item.finalconveyance),
            finalmedicalallowance: Number(item.finalmedicalallowance),
            finalproductionallowance: Number(item.finalproductionallowance),
            finalotherallowance: Number(item.finalotherallowance),
            finalnetsalary: Number(item.finalnetsalary),
            pfdays: Number(item.pfdays),
            ncpdays: Number(item.ncpdays),
            pfdeduction: Number(item.pfdeduction),
            esideduction: Number(item.esideduction),
            finallopdays: Number(item.finallopdays),
            paysliplop: Number(item.paysliplop),
            finalleavededuction: Number(item.finalleavededuction),
            professionaltax: Number(item.professionaltax),
            totaldeductions: Number(item.totaldeductions),
            uan: item.uan,
            ipname: item.ipname,
            noallowanceshift: Number(item.noallowancepoint),
            shiftallowancepoint: Number(item.allowancepoint),
            shiftallowancetarget: Number(item.shiftallowancetarget),
            nightshiftallowance: Number(item.nightshiftallowance),
            finalsalary: Number(item.finalsalary),
            finalsalarypenalty: Number(item.finalsalarypenalty),
            totalpointsvalue: Number(item.totalpointsvalue),
            era: Number(item.eramount),
            actualera: Number(item.era),
            pfemployerdeduction: Number(item.pfemployerdeduction),
            esiemployerdeduction: Number(item.esiemployerdeduction),
            ctc: Number(item.ctc),
            revenueallowance: Number(item.revenueallow),
            finalvalue: Number(item.finalvalue),
            finalvaluetwo: Number(item.finalvaluetwo),
            finalvaluepenalty: Number(item.finalvaluepenalty),
            shortage: Number(item.shortage),
            shortageone: Number(item.shortageone),
            actualdeduction: Number(item.actualdeduction),
            minimumdeduction: Number(item.minimumdeduction),
            finalvaluereview: item.finalvaluereview,
            finalvaluestatus: item.finalvaluestatus,
            finalvaluepenaltystatus: item.finalvaluepenaltystatus,


            //FIXED
            fixedlossdeduction: item.fixedlossdeduction,
            fixednetsalary: item.fixednetsalary,
            fixedbasic: item.fixedbasic,
            fixedhra: item.fixedhra,
            fixedconveyance: item.fixedconveyance,
            fixedmedicalallowance: item.fixedmedicalallowance,
            fixedproductionallowance: item.fixedproductionallowance,
            fixedotherallowance: item.fixedotherallowance,
            fixednetsalaryone: item.fixednetsalaryone,
            fixedemppf: item.fixedemppf,
            fixedempesi: item.fixedempesi,
            fixedempptax: item.fixedempptax,
            fixedemprpf: item.fixedemprpf,
            fixedempresi: item.fixedempresi,
            fixedshiftallowance: item.fixedshiftallowance,
            fixedtotaldeductions: item.fixedtotaldeductions,
            fixedsalary: item.fixedsalary,
            fixedsalarypenalty: item.fixedsalarypenalty,
            fixedlop: item.fixedlop,
            fixedlopdays: item.fixedlopdays,
            fixedleavededuction: item.fixedleavededuction,
            fixedctc: item.fixedctc,
            fixedfinalvalue: item.fixedfinalvalue,
            fixedactualdeduction: item.fixedactualdeduction,
            fixedminimumdeduction: item.fixedminimumdeduction,

            //PRODUCTION
            prodlossdeduction: item.prodlossdeduction,
            prodnetsalary: item.prodnetsalary,
            prodbasicp: item.prodbasicp,
            prodhrap: item.prodhrap,
            prodconveyancep: item.prodconveyancep,
            prodmedicalallowancep: item.prodmedicalallowancep,
            prodproductionallowancep: item.prodproductionallowancep,
            prodotherallowancep: item.prodotherallowancep,
            prodnetsalaryonep: item.prodnetsalaryonep,
            prodemppf: item.prodemppf,
            prodempesi: item.prodempesi,
            prodempptax: item.prodempptax,
            prodemprpf: item.prodemprpf,
            prodempresi: item.prodempresi,
            prodshiftallowance: item.prodshiftallowance,
            prodtotaldeductions: item.prodtotaldeductions,
            prodsalary: item.prodsalary,
            prodsalarypenalty: item.prodsalarypenalty,
            prodlopdays: item.prodlopdays,
            prodlop: item.prodlop,
            prodleavededuction: item.prodleavededuction,
            prodctc: item.prodctc,
            prodfinalvalue: item.prodfinalvalue,
            prodactualdeduction: item.prodactualdeduction,
            prodminimumdeduction: item.prodminimumdeduction,


            currentmonthavg: item.currentmonthavg,
            currentmonthattendance: item.currentmonthattendance,
            paidstatus: item.paidstatus,

            salarytype: item.salarytype,
            deductiontype: item.deductiontype,

            waiver: item.waiver,
            lossdeductionfinal: item.lossdeductionfinal,
            otherdeductionfinal: Number(item.otherdeductionfinal),

        };
    });


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

    useEffect(() => {

        fetchDepartments();
        fetchManageshortagemaster();
        fetchTargetPointsData();
        fetchERAamount();
        fetchAcpointCalculation();
        fetchShifts();
        fetchProfTax();
        fetchPayRunControls();
        // fetchUsersFilter();
    }, []);

    useEffect(() => {
        setColumnVisibility(initialColumnVisibility);
    }, []);


    useEffect(() => {
        fetchSalarySlabs();
    }, [employeesPayRun]);

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
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




    // Show All Columns & Manage Columns
    const initialColumnVisibilityList = {
        serialNumber: true,
        department: true,
        from: true,
        to: true,
        month: true,
        year: true,
        empcount: true,
        totalpf: true,
        totalctc: true,
        totalesi: true,
        totalproftax: true,
        generatedon: true,
        actions: true,
    };

    const [columnVisibilityList, setColumnVisibilityList] = useState(initialColumnVisibilityList);

    //image
    const handleCaptureImageList = () => {
        if (gridRefList.current) {
            html2canvas(gridRefList.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Pay Run List.png");
                });
            });
        }
    };

    // Manage Columns
    const [isManageColumnsOpenList, setManageColumnsOpenList] = useState(false);
    const [anchorElList, setAnchorElList] = useState(null);

    const openList = Boolean(anchorElList);
    const idList = openList ? "simple-popover" : undefined;

    const handleOpenManageColumnsList = (event) => {
        setAnchorElList(event.currentTarget);
        setManageColumnsOpenList(true);
    };
    const handleCloseManageColumnsList = () => {
        setManageColumnsOpenList(false);
        setSearchQueryManageList("");
    };

    const handlePageChangeList = (newPage) => {
        setPageList(newPage);
    };

    const handlePageSizeChangeList = (event) => {
        setPageSizeList(Number(event.target.value));
        setPageList(1);
    };

    //datatable....
    const handleSearchChangeList = (event) => {
        setPageList(1);
        setSearchQueryList(event.target.value);
    };

    const fetchPayRunList = async () => {
        try {
            let res_data = await axios.get(SERVICE.PAYRUNLIST_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setPayRunList(res_data.data.payrunlists);

            setPayRunCalcList(res_data.data.payrunlists);
        } catch (err) {
            setBankdetail(false);
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
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something  5 went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    }
    useEffect(() => {
        fetchPayRunList()
    }, [])

    const addSerialNumberList = async () => {
        try {
            let sortedData = payRunList.sort((a, b) => {
                if (a.from === b.from) {
                    return a.department.localeCompare(b.department);
                }
                return a.from - b.from;
            })
            let itemsWithResultsFinal = sortedData.map((item, index) => {

                return {
                    ...item,
                    serialNumber: index + 1,
                    // totalctc: item.total,
                    generatedon: moment(item.generatedon).format("DD-MM-YYYY hh:mm A"),
                    from: moment(new Date(item.from)).format("DD-MM-YYYY"),
                    to: moment(new Date(item.to)).format("DD-MM-YYYY"),
                }
            })

            // Initialize an object to store the totals per department
            const result = {};


            // Iterate through userData
            itemsWithResultsFinal.forEach(({ department, _id, generatedon, serialNumber, month, year, from, to, empcount, data }) => {
                // Initialize totals for this department
                let totalctc = 0;
                let totalpf = 0;
                let totalesi = 0;
                let totalproftax = 0;

                // Calculate totals based on salarytype
                data.forEach(entry => {
                    const { ctc, prodctc, fixedctc, salarytype, pfdeduction, fixedemppf, prodemppf, fixedempesi, prodempesi, professionaltax,
                        fixedempptax,
                        prodempptax } = entry;

                    switch (salarytype) {
                        case "Final Salary":
                            totalctc += parseFloat(ctc);
                            totalpf += parseFloat(pfdeduction); // Assuming pfdeduction is a string representing a float
                            totalesi += parseFloat(fixedempesi); // Assuming fixedempesi is a string representing a float
                            totalproftax += parseFloat(professionaltax); // Assuming fixedempesi is a string representing a float
                            break;
                        case "Production Salary":
                            totalctc += parseFloat(prodctc);
                            totalpf += parseFloat(prodemppf); // Assuming prodemppf is a string representing a float
                            totalesi += parseFloat(prodempesi); // Assuming prodempesi is a string representing a float
                            totalproftax += parseFloat(prodempptax); // Assuming prodempesi is a string representing a float
                            break;
                        case "Fixed Salary":
                            totalctc += parseFloat(fixedctc);
                            totalpf += parseFloat(fixedemppf); // Assuming fixedemppf is a string representing a float
                            totalesi += parseFloat(fixedempesi); // Assuming fixedempesi is a string representing a float
                            totalproftax += parseFloat(fixedempptax);
                            break;
                        default:
                            break;
                    }
                });

                // Add the totals to the result object
                if (result[_id]) {
                    result[_id].totalctc += totalctc;
                    result[_id].totalpf += totalpf;
                    result[_id].totalesi += totalesi;
                    result[_id].totalproftax += totalproftax;
                } else {
                    result[_id] = { department, _id, totalctc, month, year, totalproftax, totalpf, totalesi, generatedon, serialNumber, from, to, empcount };
                }
            });

            // Convert result object to the desired array format
            const results = Object.values(result);

            console.log(results.length, 'results');

            setItemsList(results);

        } catch (err) {
            setBankdetail(false);
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
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something  5 went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    useEffect(() => {
        addSerialNumberList();
    }, [payRunList])


    // Split the search query into individual terms
    const searchTermsList = searchQueryList.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    // Modify the filtering logic to check each term
    const filteredDatasList = itemsList?.filter((item) => {
        return searchTermsList.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataList = filteredDatasList?.slice((pageList - 1) * pageSizeList, pageList * pageSizeList);

    const totalPagesList = Math.ceil(filteredDatasList?.length / pageSizeList);

    const visiblePagesList = Math.min(totalPagesList, 3);

    const firstVisiblePageList = Math.max(1, pageList - 1);
    const lastVisiblePageList = Math.min(firstVisiblePageList + visiblePagesList - 1, totalPagesList);

    const pageNumbersList = [];

    const indexOfLastItemList = pageList * pageSizeList;
    const indexOfFirstItemList = indexOfLastItemList - pageSizeList;

    for (let i = firstVisiblePageList; i <= lastVisiblePageList; i++) {
        pageNumbersList.push(i);
    }




    //Edit model...
    const [isViewOpen, setIsViewOpen] = useState(false);
    const handleClickOpenView = () => {
        setIsViewOpen(true);
    };
    const handleCloseModView = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsViewOpen(false);
    };


    const [deleteId, setDeleteId] = useState("");
    const [viewlistname, setViewlistname] = useState("");


    const handleDataFromChild = async (data) => {

        let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data.id}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        setViewlistname(data.viewlistname);
        const sortedData = res.data.spayrunlist.data.sort((a, b) => {

            if (Number(b.experience) !== Number(a.experience)) {
                return Number(b.experience) - Number(a.experience);
            }

            return a.companyname.localeCompare(b.companyname);
        })

        const salary = [
            'Final Salary', "Fixed Salary", "Production Salay",
        ];
        const deduction = ['Actual Deduction', "On Value", "On Penalty", "Minimum Deduction",
        ];

        let dataWithSerialNumber = sortedData.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            outerId: data.id,
            selectedmonth: data.month,
            selectedyear: data.year,
            salaryTypeOpt: salary,
            deductionOpt: deduction,
            waiver: item.waiver,
            salarytypeedit: item.salarytypefinal ? item.salarytypefinal : item.salarytype,
            deductiontypeedit: item.deductiontypefinal ? item.deductiontypefinal : item.deductiontype,
            otherdeductionfinal: item.otherdeductionfinal ? item.otherdeductionfinal : 0,
            lossdeductionfinal: item.lossdeductionfinal ? item.lossdeductionfinal : (item.salarytype === "Final Salary" ? item.lossdeduction : item.salarytype === "Fixed Salary" ? item.fixedlossdeduction : item.prodlossdeduction)

        }))
        let findSelectedMonthNum = months.find(d => d.value === data.month).numval;

        setSelectedViewMonthNum(findSelectedMonthNum)
        // setItems(dataWithSerialNumber);
        setRowData(dataWithSerialNumber);
        setFilteredData(dataWithSerialNumber);
        handleClickOpenView();

    };

    const handleDataFromChildDel = (data) => {
        setDeleteId(data);
    };

    const [exceldataName, setExceldataName] = useState("")

    const handleDataFromChildDown = async (data) => {

        let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data.id}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        setExceldataName(data.filename);
        let filename = data.filename
        let findSelectedMonthNum = months.find(d => d.value === data.month).numval;

        console.log("123")
        const sortedData = res.data.spayrunlist.data.sort((a, b) => {

            if (Number(b.experience) !== Number(a.experience)) {
                return Number(b.experience) - Number(a.experience);
            }

            return a.companyname.localeCompare(b.companyname);
        })

        console.log("456")

        let finaldata = sortedData.map((t, index) => ({
            Sno: index + 1,
            Department: t.department,
            Company: t.company,
            Branch: t.branch,
            Unit: t.unit,
            Team: t.team,
            Designation: t.designation,
            "Employee Name": t.companyname,
            "Aadhar Name": t.legalname,
            "Process Code": t.processcode,
            DOJ: t.doj,
            "Experience In Month": Number(t.experience),
            "ProcessCode Exp": (t.processcodeexp),
            "Total No Of Days": Number(t.totalnumberofdays),
            "Total Shift": Number(t.totalshift),
            CLSL: Number(t.clsl),
            "Week Off": Number(t.weekoffcount),
            Holiday: Number(t.holiday),
            "Total Absent/Leave": Number(t.totalasbleave),
            "Total Paid Dyas": Number(t.totalpaidDays),

            "Gross": Number(t.oldgross),
            "Basic": Number(t.oldbasic),
            "HRA": Number(t.oldhra),
            "Conveyance": Number(t.oldconveyance),
            "Medical Allowance": Number(t.oldmedicalallowance),
            "Production Allowance": Number(t.oldproductionallowance),
            "Production Allowance 2": Number(t.oldproductionallowancetwo),
            "Other Allowance": Number(t.oldotherallowance),

            "New Gross": Number(t.gross),
            "Actual Basic": Number(t.basic),
            "Actual HRA": Number(t.hra),
            "Actual Conveyance": Number(t.conveyance),
            "Actual Medical Allowance": Number(t.medicalallowance),
            "Actual Production Allowance": Number(t.productionallowance),
            "Actual Production Allowance 2": Number(t.productionallowancetwo),
            "Actual Other Allowance": Number(t.otherallowance),

            "Target Points": Number(t.monthPoint),
            "Achieved Points": Number(t.acheivedpoints),
            "Achieved  %": Number(t.acheivedpercent),
            "Achieved Production Allowance": Number(t.acheivedproductionallowance),
            "Actual Net Salary": Number(t.actualnetsalary),
            "LOP Basic": Number(t.lopbasic),
            "LOP HRA": Number(t.lophra),
            "LOP Conveyance": Number(t.lopconveyance),
            "LOP Medical Allowance": Number(t.lopmedicalallowance),
            "LOP Production Allowance": Number(t.lopproductionallowance),
            "LOP Other Allowance": Number(t.lopotherallowance),
            "LOP Net Salary": Number(t.lopnetsalary),
            "Prod Basic": Number(t.prodbasic),
            "Prod HRA": Number(t.prodhra),
            "Prod Conveyance": Number(t.prodconveyance),
            "Prod Medical Allowance": Number(t.prodmedicalallowance),
            "Prod Production Allowance": Number(t.prodproductionallowance),
            "Prod Other Allowance": Number(t.prodotherallowance),
            "Attendance LOP": Number(t.attendancelop),
            "Calculated Net Salary": Number(t.calculatednetsalary),
            "Actual Penalty Amount": Number(t.penalty),
            "Penalty Amount": Number(t.penaltyamount),
            "Loss Deduction": Number(t.lossdeduction),
            "Other Deduction": Number(t.otherdeduction),
            "Final Basic": Number(t.finalbasic),
            "Final HRA": Number(t.finalhra),
            "Final Conveyance": Number(t.finalconveyance),
            "Final Medical Allowance": Number(t.finalmedicalallowance),
            "Final Production Allowance": Number(t.finalproductionallowance),
            "Final Other Allowance": Number(t.finalotherallowance),
            "Final Net Salary": Number(t.finalnetsalary),
            "PF Days": Number(t.pfdays),
            "NCP Days": Number(t.ncpdays),
            "PF Deduction": Number(t.pfdeduction),
            "ESI Deduction": Number(t.esideduction),
            "Final-LOP": Number(t.finallopdays),
            "Final LOP Days": Number(t.paysliplop),
            "Final Leave Deduction": Number(t.finalleavededuction),
            "Professional Tax": Number(t.professionaltax),
            "Total Deductions": Number(t.totaldeductions),
            UAN: t.uan,
            "IP Name": t.ipname,
            "No. Allowance Shift": Number(t.noallowancepoint),
            "Shift Allowance Point": Number(t.allowancepoint),
            "Shift Allowance Target": Number(t.shiftallowancetarget),
            "Night Shift Allowance": Number(t.nightshiftallowance),
            "Final Salary": Number(t.finalsalary),
            "Final Salary-Penalty": Number(t.finalsalarypenalty),
            "Total Points Value": Number(t.totalpointsvalue),
            ERA: Number(t.eramount),
            "Actual ERA": Number(t.era),
            "PF Employer Deduction": Number(t.pfemployerdeduction),
            "ESI Employer Deduction": Number(t.esiemployerdeduction),
            CTC: Number(t.ctc),
            "Revenue Allowance": Number(t.revenueallow),
            "Final Value": Number(t.finalvalue),
            "Final Value-Penalty": Number(t.finalvaluepenalty),
            Shortage: Number(t.shortage),
            "Shortage 1": Number(t.shortageone),
            "Actual Deduction": Number(t.actualdeduction),
            "Minimum Deduction": Number(t.minimumdeduction),
            "Final Value Review": t.finalvaluereview,
            "Final Value Status": t.finalvaluestatus,
            "Final Value Penalty Status": t.finalvaluepenaltystatus,

            //FIXED
            "Fixed Loss Deduction": Number(t.fixedlossdeduction),
            Fixed_NET_Salary: Number(t.fixednetsalary),
            "Fixed Basic": Number(t.fixedbasic),
            "Fixed HRA": Number(t.fixedhra),
            "Fixed Conveyance": Number(t.fixedconveyance),
            "Fixed Medical Allowance": Number(t.fixedmedicalallowance),
            "Fixed Production Allowance": Number(t.fixedproductionallowance),
            "Fixed Other Allowance": Number(t.fixedotherallowance),
            Fixed_NET_Salary1: Number(t.fixednetsalaryone),
            Fixed_Emp_pf: Number(t.fixedemppf),
            Fixed_Emp_Esi: Number(t.fixedempesi),
            Fixed_Emp_ptax: Number(t.fixedempptax),
            "Fixed Empr_pf": Number(t.fixedemprpf),
            "Fixed Empr_Esi": Number(t.fixedempresi),
            Fixed_Shift_Allowance: Number(t.fixedshiftallowance),
            "Fixed Total Deductions": Number(t.fixedtotaldeductions),
            "Fixed Salary": Number(t.fixedsalary),
            "Fixed Salary+Penalty": Number(t.fixedsalarypenalty),
            "Fixed-LOP": Number(t.fixedlop),
            "Fixed LOP Days": Number(t.fixedlopdays),
            "Fixed Leave Deduction": Number(t.fixedleavededuction),
            "Fixed CTC": Number(t.fixedctc),
            "Fixed Final Value": Number(t.fixedfinalvalue),
            "Fixed Actual Deduction": Number(t.fixedactualdeduction),
            "Fixed Minimum Deduction": Number(t.fixedminimumdeduction),

            //PRODUCTION

            "PROD Loss Deduction": Number(t.prodlossdeduction),
            PROD_NET_Salary: Number(t.prodnetsalary),
            "PROD Basic": Number(t.prodbasicp),
            "PROD HRA": Number(t.prodhrap),
            "PROD Conveyance": Number(t.prodconveyancep),
            "PROD Medical Allowance": Number(t.prodmedicalallowancep),
            "PROD Production Allowance": Number(t.prodproductionallowancep),
            "PROD Other Allowance": Number(t.prodotherallowancep),
            PROD_NET_Salary1: Number(t.prodnetsalaryonep),

            "PROD_Emp_pf": Number(t.prodemppf),
            "PROD_Emp_esi": Number(t.prodempesi),
            "PROD_Emp_ptax": Number(t.prodempptax),
            "PROD_Empr_pf": Number(t.prodemprpf),
            "PROD_Empr_Esi": Number(t.prodempresi),
            "PROD_Shift_Allowance": Number(t.prodshiftallowance),
            "PROD Total Deductions": Number(t.prodtotaldeductions),

            "PROD Salary": Number(t.prodsalary),
            "PROD Salary+Penalty": Number(t.prodsalarypenalty),
            "PROD LOP Days": Number(t.prodlopdays),
            "PROD LOP": Number(t.prodlop),
            "PROD Leave Deduction": Number(t.prodleavededuction),

            "PROD CTC": Number(t.prodctc),
            "PROD Final Value": Number(t.prodfinalvalue),

            "PROD Actual Deduction": Number(t.prodactualdeduction),
            "PROD Minimum Deduction": Number(t.prodminimumdeduction),

            "Banck Name": (t.bankname),
            "Account Name": (t.accountname),
            "Account Number": (t.accountnumber),
            "IFSC Code": (t.ifsccode),

            [`Current (${monthsArr[Number(findSelectedMonthNum) >= 12 ? 0 : Number(findSelectedMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
            [`Current (${monthsArr[Number(findSelectedMonthNum) >= 12 ? 0 : Number(findSelectedMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
            "Paid Status": t.paidstatus,
            "Salary Type": t.salarytype,
            "Deduction Type": t.deductiontype,
        }))

        downloadExcel(finaldata, filename);
        console.log("dgdf")
    }
    const handleDataFromChildPaySlip = async (data) => {

        let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data.id}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });

        setExceldataName(data.filename);
        let filename = data.filename
        let findSelectedMonthNum = months.find(d => d.value === data.month).numval;

        let dataWithSerialNumber = res.data.spayrunlist.data.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
            outerId: data.id,
            selectedmonth: data.month,
            selectedyear: data.year,

            salarytypefinal: item.salarytypefinal ? item.salarytypefinal : item.salarytype,
            deductiontypefinal: item.deductiontypefinal ? item.deductiontypefinal : item.deductiontype,
            otherdeductionfinal: item.otherdeductionfinal ? item.otherdeductionfinal : item.otherdeduction,

            lossdeductionfinal: item.lossdeductionfinal ? item.lossdeductionfinal : (item.salarytype === "Final Salary" ? item.lossdeduction : item.salarytype === "Fixed Salary" ? item.fixedlossdeduction : item.prodlossdeduction)

        }))

        console.log("123")
        const sortedData = dataWithSerialNumber.sort((a, b) => {

            if (Number(b.experience) !== Number(a.experience)) {
                return Number(b.experience) - Number(a.experience);
            }

            return a.companyname.localeCompare(b.companyname);
        })

        const datasplitted = Object.values(sortedData.reduce((acc, item) => {
            const { salarytypefinal } = item;
            if (!acc[salarytypefinal]) {
                acc[salarytypefinal] = { salarytypefinal, data: [] };
            }
            acc[salarytypefinal].data.push({ ...item });
            return acc;
        }, {}));

        console.log(datasplitted, 'datasplitted');


        let finaldownloadData = datasplitted.map(d => {
            return d.data.map((t, index) => {
                let commonFields = {
                    Sno: index + 1,
                    Company: t.company,
                    Branch: t.branch,
                    Unit: t.unit,
                    "Emp Code": t.empcode,
                    "Aadhar Name": t.legalname,
                    "TTS Name": t.companyname,
                    Designation: t.designation,
                    Team: t.team,
                    "ProcessCode Exp": t.processcodeexp,
                    DOJ: t.doj,
                    "Experience In Months": Number(t.experience),
                    "Bank Name": t.bankname,
                    "Account Name": t.accountname,
                    "Account Number": t.accountnumber,
                    "IFSC Code": t.ifsccode,
                    UAN: t.uan,
                    "IP Name": t.ipname,
                    "Total No Of Days": Number(t.totalnumberofdays),
                    "Total Shift": Number(t.totalshift),
                    CLSL: Number(t.clsl),
                    "Week Off": Number(t.weekoffcount),
                    Holiday: Number(t.holiday),
                    "Total Absent/Leave": Number(t.totalasbleave),
                    "Total Paid Days": Number(t.totalpaidDays),
                    "Actual Basic": Number(t.basic),
                    "Actual HRA": Number(t.hra),
                    "Actual Conveyance": Number(t.conveyance),
                    "Actual Medical Allowance": Number(t.medicalallowance),
                    "Actual Production Allowance": Number(t.productionallowance),
                    "Actual Production Allowance 2": Number(t.productionallowancetwo),
                    "Actual Other Allowance": Number(t.otherallowance),
                    "Target Points": Number(t.monthPoint),
                    "Achieved Points": Number(t.acheivedpoints),
                    "Achieved %": Number(t.acheivedpercent),
                    "Penalty Amount": Number(t.penaltyamount),


                };

                if (d.salarytypefinal === "Final Salary") {
                    return {
                        ...commonFields,
                        "Other Deduction": Number(t.otherdeduction),
                        "Loss Deduction": Number(t.lossdeduction),
                        "Basic": Number(t.finalbasic),
                        "HRA": Number(t.finalhra),
                        "Conveyance": Number(t.finalconveyance),
                        "Medical Allowance": Number(t.finalmedicalallowance),
                        "Production Allowance": Number(t.finalproductionallowance),
                        "Other Allowance": Number(t.finalotherallowance),
                        "Net Salary": Number(t.finalnetsalary),
                        "PF Days": Number(t.pfdays),
                        "PF Deduction": Number(t.pfdeduction),
                        "ESI Deduction": Number(t.esideduction),
                        "F.L.O.P": Number(t.paysliplop),
                        "Professional Tax": Number(t.professionaltax),
                        "Total Deductions": Number(t.totaldeductions),
                        "PF Employer Deduction": Number(t.pfemployerdeduction),
                        "ESI Employer Deduction": Number(t.esiemployerdeduction),
                        "Salary": Number(t.finalsalary),
                        "Salary-Penalty": Number(t.finalsalarypenalty),
                        "Final Value": Number(t.finalvalue),
                        "Final Value-Penalty": Number(t.finalvaluepenalty),
                        CTC: Number(t.ctc),
                        "Actual Deduction": Number(t.actualdeduction),
                        "Minimum Deduction": Number(t.minimumdeduction),
                        "Salary Type": t.salarytype,
                        "Deduction Type": t.deductiontype,
                    };
                } else if (d.salarytypefinal === "Fixed Salary") {
                    return {
                        ...commonFields,
                        "Other Deduction": Number(t.otherdeduction),
                        "Fixed Loss Deduction": Number(t.fixedlossdeduction),
                        "Basic": Number(t.fixedbasic),
                        "HRA": Number(t.fixedhra),
                        "Conveyance": Number(t.fixedconveyance),
                        "Medical Allowance": Number(t.fixedmedicalallowance),
                        "Production Allowance": Number(t.fixedproductionallowance),
                        "Other Allowance": Number(t.fixedotherallowance),
                        "Net Salary": Number(t.fixednetsalaryone),
                        "PF Days": Number(t.pfdays),

                        "PF Deduction": Number(t.fixedemppf),
                        "ESI Deduction": Number(t.fixedempesi),
                        "F.L.O.P": Number(t.fixedlop),
                        "Professional Tax": Number(t.fixedempptax),
                        "Total Deductions": Number(t.fixedtotaldeductions),
                        "No. Allowance Shift": Number(t.noallowancepoint),
                        "Night Shift Allowance": Number(t.nightshiftallowance),
                        "PF Employer Deduction": Number(t.pfemployerdeduction),
                        "ESI Employer Deduction": Number(t.esiemployerdeduction),
                        "Salary": Number(t.fixedsalary),
                        "Salary+Penalty": Number(t.fixedsalarypenalty),
                        "Final Value": Number(t.fixedfinalvalue),
                        "Final Value-Penalty": Number(t.fixedfinalvalue),
                        "Fixed CTC": Number(t.fixedctc),
                        "Fixed Actual Deduction": Number(t.fixedactualdeduction),
                        "Fixed Minimum Deduction": Number(t.fixedminimumdeduction),
                        "Salary Type": t.salarytype,
                        "Deduction Type": t.deductiontype,
                    };
                } else {
                    return {
                        ...commonFields,
                        "PROD Loss Deduction": Number(t.prodlossdeduction),
                        "Basic": Number(t.prodbasicp),
                        "HRA": Number(t.prodhrap),
                        "Conveyance": Number(t.prodconveyancep),
                        "Medical Allowance": Number(t.prodmedicalallowancep),
                        "Production Allowance": Number(t.prodproductionallowancep),
                        "Other Allowance": Number(t.prodotherallowancep),
                        "Net Salary": Number(t.prodnetsalaryonep),
                        "PF Days": Number(t.pfdays),

                        "PF Deduction": Number(t.prodemppf),
                        "ESI Deduction": Number(t.prodempesi),
                        "FLOP": Number(t.prodlop),
                        "Professional Tax": Number(t.prodempptax),
                        "Total Deductions": Number(t.prodtotaldeductions),
                        "No. Allowance Shift": Number(t.noallowancepoint),
                        "Night Shift Allowance": Number(t.nightshiftallowance),
                        "PF Employer Deduction": Number(t.pfemployerdeduction),
                        "ESI Employer Deduction": Number(t.esiemployerdeduction),
                        "Salary": Number(t.prodsalary),
                        "Salary-Penalty": Number(t.prodsalarypenalty),
                        "Final Value": Number(t.prodfinalvalue),
                        "Final Value-Penalty": Number(0),
                        "PROD CTC": Number(t.prodctc),
                        "PROD Actual Deduction": Number(t.prodactualdeduction),
                        "PROD Minimum Deduction": Number(t.prodminimumdeduction),
                        "Salary Type": t.salarytype,
                        "Deduction Type": t.deductiontype,
                    };
                }
            });
        });
        let excelData = finaldownloadData.flat().map((d, index) => ({ ...d, Sno: index + 1 }))

        downloadExcel(excelData, filename);

    }

    const downloadExcel = (data, filename) => {
        const fileNameXl = `Payrun List ${filename}.xlsx`;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, fileNameXl);
    };

    const handleDataFromChildSentFixSalary = async (data) => {

        console.log(data, 'data');
        let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data.outerId}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },

        });
        let findisSent = res.data.spayrunlist.data.some(item => item.sentfixsalary != "Yes");

        console.log(findisSent, res.data.spayrunlist.data);

        if (findisSent) {
            let resupdate = await axios.post(`${SERVICE.PAYRUNLIST_SENT_FIXSALARYDATE}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                outerId: data.outerId,

            });
            setShowAlert(
                <>
                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "100px", color: "#1d8510de" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Sent Sucessfully"}</p>
                </>
            );
            handleClickOpenerr();
        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Already Data Sent!"}</p>
                </>
            );
            handleClickOpenerr();
        }


    }

    const [oldrerunData, setOldRerunData] = useState([]);
    const handleDataFromChildRerun = async (data) => {
        setOldRerunData([]);

        let res = await axios.get(`${SERVICE.PAYRUNLIST_SINGLE}/${data.id}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
        });
        setOldRerunData(res.data.spayrunlist);

        // if (res.data.spayrunlist.data.some(d => d.iseditedacheivedpoints === "Yes" || d.iseditedpenaltyamount === "Yes")) {
        //     handleClickOpenRerun();
        // }
    };

    const RowPopover = ({ params, sendDataToParentView, sendDataToParentDel, sendDataToParentDown, sendDataToParentRerun }) => {
        const [anchorEl, setAnchorEl] = useState(null);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);
        const id = open ? 'simple-popover' : undefined;
        // const [viewOpen, setViewOpen] = useState("");

        const handleViewPayrunClick = () => {
            // setViewOpen(params.row.id);
            let id = params.row.id;
            let month = params.row.month;
            let year = params.row.year;
            let from = params.row.from;
            let to = params.row.to;
            let viewlistname = `${from}-to-${to} (${month}-${year})`
            sendDataToParentView({ id, month, year, viewlistname });
            // handleClose();
        };

        return (
            <div>
                <Button aria-describedby={id} onClick={handleClick}>
                    <MoreHorizIcon />
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box sx={{ padding: 0 }}>

                        <List sx={{
                            p: 0,
                            width: '100%',
                            maxWidth: 360,
                            borderRadius: 2,
                            // border: '1px solid',
                            // borderColor: 'divider',
                            backgroundColor: 'background.paper',
                        }}
                            aria-label="mailbox folders">
                            <ListItem sx={{ cursor: "pointer", padding: "5px" }} onClick={handleViewPayrunClick}>
                                <ListItemText primary="View payrun" />
                            </ListItem>

                        </List>
                    </Box>
                </Popover>
            </div>
        );
    };

    const columnDataTableList = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 70,
            hide: !columnVisibilityList.serialNumber,
        },
        { field: "department", headerName: "Department", flex: 0, width: 170, hide: !columnVisibilityList.department },
        { field: "from", headerName: "From", flex: 0, width: 110, hide: !columnVisibilityList.from },
        { field: "to", headerName: "To", flex: 0, width: 110, hide: !columnVisibilityList.to },
        { field: "empcount", headerName: "Emp Count", flex: 0, width: 90, hide: !columnVisibilityList.empcount },

        { field: "totalctc", headerName: "Total CTC", flex: 0, width: 130, hide: !columnVisibilityList.totalctc },
        { field: "totalpf", headerName: "Total PF", flex: 0, width: 110, hide: !columnVisibilityList.totalpf },
        { field: "totalesi", headerName: "Total ESI", flex: 0, width: 110, hide: !columnVisibilityList.totalesi },
        { field: "totalproftax", headerName: "Total Prof. Tax", flex: 0, width: 110, hide: !columnVisibilityList.totalproftax },
        { field: "generatedon", headerName: "Generated On", flex: 0, width: 170, hide: !columnVisibilityList.generatedon },
        { field: "month", headerName: "Month", flex: 0, width: 80, hide: !columnVisibilityList.month },
        { field: "year", headerName: "Year", flex: 0, width: 80, hide: !columnVisibilityList.year },
        {
            field: "actions", headerName: "Actions",
            flex: 0,
            width: 100,
            hide: !columnVisibilityList.actions,
            renderCell: (params) => <RowPopover sendDataToParentView={handleDataFromChild} sendDataToParentDown={handleDataFromChildDown} sendDataToParentDel={handleDataFromChildDel} sendDataToParentRerun={handleDataFromChildRerun} params={params} />,
        },

    ];

    const rowDataTableList = filteredDataList.map((item, index) => {
        return {

            ...item,
            id: item._id,
            totalctc: Number(item.totalctc).toFixed(2),
            totalpf: Number(item.totalpf).toFixed(2),
            totalesi: Number(item.totalesi).toFixed(2),
            // generatedon: moment(item.generatedon).format("DD-MM-YYYY HH:MM"),
            // from: moment(item.from).format("DD-MM-YYYY"),
            // to: moment(item.to).format("DD-MM-YYYY"),
        };
    });

    // Show All Columns functionality
    const handleShowAllColumnsList = () => {
        const updatedVisibility = { ...columnVisibilityList };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityList(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityList");
        if (savedVisibility) {
            setColumnVisibilityList(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityList", JSON.stringify(columnVisibilityList));
    }, [columnVisibilityList]);

    //  PDF
    const columnsList = [
        { title: "SNo", dataKey: "serialNumber" },
        { title: "Departmet", dataKey: "department" },
        { title: "From", dataKey: "from" },
        { title: "To", dataKey: "to" },
        { title: "Total CTC", dataKey: "totalctc" },
        { title: "Total PF", dataKey: "totalpf" },
        { title: "Total ESI", dataKey: "totalesi" },
        { title: "Total Prof.tax", dataKey: "totalproftax" },
        { title: "Genrated On", dataKey: "generatedon" },
        { title: "Month", dataKey: "month" },
        { title: "Year", dataKey: "year" },

    ];

    const downloadPdfList = () => {
        const doc = new jsPDF({
            orientation: "landscape",
        });

        const maxColumnsPerPage = 15; // Maximum number of columns per page
        const totalPages = Math.ceil(columnsList.length / maxColumnsPerPage); // Calculate total pages needed

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const startIdx = (currentPage - 1) * maxColumnsPerPage;
            const endIdx = Math.min(startIdx + maxColumnsPerPage, columnsList.length);

            const currentPageColumns = columnsList.slice(startIdx, endIdx);

            doc.autoTable({
                theme: "grid",
                styles: {
                    fontSize: 5,
                },
                columns: currentPageColumns,
                body: rowDataTableList,
            });

            if (currentPage < totalPages) {
                doc.addPage(); // Add a new page if there are more columns to display
            }
        }

        doc.save("Pay Run List.pdf");
    };


    //print...
    const componentRefList = useRef();
    const handleprintList = useReactToPrint({
        content: () => componentRefList.current,
        documentTitle: "Pay Run List",
        pageStyle: "print",
    });


    // // Function to filter columns based on search query
    const filteredColumnsList = columnDataTableList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageList.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilityList = (field) => {
        setColumnVisibilityList((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentList = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsList}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageList} onChange={(e) => setSearchQueryManageList(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsList.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityList[column.field]} onChange={() => toggleColumnVisibilityList(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityList(initialColumnVisibilityList)}>
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
                                columnDataTableList.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityList(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    //DATATABLE TWO CALCULATED LIST

    // Show All Columns & Manage Columns
    const initialColumnVisibilityCalcList = {
        serialNumber: true,
        department: true,
        from: true,
        to: true,
        month: true,
        year: true,
        empcount: true,
        totalpf: true,
        totalctc: true,
        totalesi: true,
        totalproftax: true,
        generatedon: true,
        actions: true,
    };

    const [columnVisibilityCalcList, setColumnVisibilityCalcList] = useState(initialColumnVisibilityCalcList);

    //image
    const handleCaptureImageCalcList = () => {
        if (gridRefCalcList.current) {
            html2canvas(gridRefCalcList.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Pay Run CalcList.png");
                });
            });
        }
    };

    // Manage Columns
    const [isManageColumnsOpenCalcList, setManageColumnsOpenCalcList] = useState(false);
    const [anchorElCalcList, setAnchorElCalcList] = useState(null);

    const openCalcList = Boolean(anchorElCalcList);
    const idCalcList = openCalcList ? "simple-popover" : undefined;

    const handleOpenManageColumnsCalcList = (event) => {
        setAnchorElCalcList(event.currentTarget);
        setManageColumnsOpenCalcList(true);
    };
    const handleCloseManageColumnsCalcList = () => {
        setManageColumnsOpenCalcList(false);
        setSearchQueryManageCalcList("");
    };

    const handlePageChangeCalcList = (newPage) => {
        setPageCalcList(newPage);
    };

    const handlePageSizeChangeCalcList = (event) => {
        setPageSizeCalcList(Number(event.target.value));
        setPageCalcList(1);
    };

    //datatable....
    const handleSearchChangeCalcList = (event) => {
        setPageCalcList(1);
        setSearchQueryCalcList(event.target.value);
    };

    const addSerialNumberCalcList = async () => {
        try {
            let sortedData = payRunCalcList.sort((a, b) => {
                if (a.from === b.from) {
                    return a.department.localeCompare(b.department);
                }
                return a.from - b.from;
            })
            let itemsWithResultsFinal = sortedData.map((item, index) => {

                return {
                    ...item,

                    serialNumber: index + 1,
                    // totalctc: item.total,
                    generatedon: moment(item.generatedon).format("DD-MM-YYYY hh:mm A"),
                    from: moment(new Date(item.from)).format("DD-MM-YYYY"),
                    to: moment(new Date(item.to)).format("DD-MM-YYYY"),
                }
            })

            // Initialize an object to store the totals per department
            const result = {};


            // Iterate through userData
            itemsWithResultsFinal.forEach(({ department, _id, generatedon, serialNumber, month, year, from, to, empcount, data }) => {
                // Initialize totals for this department
                let totalctc = 0;
                let totalpf = 0;
                let totalesi = 0;
                let totalproftax = 0;

                // Calculate totals based on salarytype
                data.forEach(entry => {
                    const { ctc, prodctc, fixedctc, salarytype, pfdeduction, fixedemppf, prodemppf, fixedempesi, prodempesi, professionaltax,
                        fixedempptax,
                        prodempptax } = entry;

                    switch (salarytype) {
                        case "Final Salary":
                            totalctc += parseFloat(ctc);
                            totalpf += parseFloat(pfdeduction); // Assuming pfdeduction is a string representing a float
                            totalesi += parseFloat(fixedempesi); // Assuming fixedempesi is a string representing a float
                            totalproftax += parseFloat(professionaltax); // Assuming fixedempesi is a string representing a float
                            break;
                        case "Production Salary":
                            totalctc += parseFloat(prodctc);
                            totalpf += parseFloat(prodemppf); // Assuming prodemppf is a string representing a float
                            totalesi += parseFloat(prodempesi); // Assuming prodempesi is a string representing a float
                            totalproftax += parseFloat(prodempptax); // Assuming prodempesi is a string representing a float
                            break;
                        case "Fixed Salary":
                            totalctc += parseFloat(fixedctc);
                            totalpf += parseFloat(fixedemppf); // Assuming fixedemppf is a string representing a float
                            totalesi += parseFloat(fixedempesi); // Assuming fixedempesi is a string representing a float
                            totalproftax += parseFloat(fixedempptax);
                            break;
                        default:
                            break;
                    }
                });

                // Add the totals to the result object
                if (result[_id]) {
                    result[_id].totalctc += totalctc;
                    result[_id].totalpf += totalpf;
                    result[_id].totalesi += totalesi;
                    result[_id].totalproftax += totalproftax;
                } else {
                    result[_id] = { department, _id, totalctc, month, year, totalproftax, totalpf, totalesi, generatedon, serialNumber, from, to, empcount };
                }
            });

            // Convert result object to the desired array format
            const results = Object.values(result);



            setItemsCalcList(results);

        } catch (err) {
            setBankdetail(false);
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
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something  5 went wrong!"}</p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    useEffect(() => {
        addSerialNumberCalcList();
    }, [payRunCalcList])


    // Split the search query into individual terms
    const searchTermsCalcList = searchQueryCalcList.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    // Modify the filtering logic to check each term
    const filteredDatasCalcList = itemsCalcList?.filter((item) => {
        return searchTermsCalcList.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataCalcList = filteredDatasCalcList?.slice((pageCalcList - 1) * pageSizeCalcList, pageCalcList * pageSizeCalcList);

    const totalPagesCalcList = Math.ceil(filteredDatasCalcList?.length / pageSizeCalcList);

    const visiblePagesCalcList = Math.min(totalPagesCalcList, 3);

    const firstVisiblePageCalcList = Math.max(1, pageCalcList - 1);
    const lastVisiblePageCalcList = Math.min(firstVisiblePageCalcList + visiblePagesCalcList - 1, totalPagesCalcList);

    const pageNumbersCalcList = [];

    const indexOfLastItemCalcList = pageCalcList * pageSizeCalcList;
    const indexOfFirstItemCalcList = indexOfLastItemCalcList - pageSizeCalcList;

    for (let i = firstVisiblePageCalcList; i <= lastVisiblePageCalcList; i++) {
        pageNumbersCalcList.push(i);
    }

    const RowPopoverCalc = ({ params, sendDataToParentView, sendDataToParentDownPaySlip, sendDataToParentDown, sendDataToParentSentFixSalary }) => {
        const [anchorEl, setAnchorEl] = useState(null);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);
        const id = open ? 'simple-popover' : undefined;
        // const [viewOpen, setViewOpen] = useState("");

        const handleViewPayrunClick = () => {
            // setViewOpen(params.row.id);
            let id = params.row.id;
            let month = params.row.month;
            let year = params.row.year;
            let from = params.row.from;
            let to = params.row.to;
            let viewlistname = `${from}-to-${to} (${month}-${year})`
            sendDataToParentView({ id, month, year, viewlistname });
            // handleClose();
        };

        const handleDownloadPayrunClick = () => {
            let id = params.row.id;
            let month = params.row.month;
            let year = params.row.year;
            let filename = `${params.row.from}-to-${params.row.to} (${params.row.month} - ${params.row.year})`
            sendDataToParentDown({ id, month, year, filename });
        }
        const handleDownloadPaySlipClick = () => {
            let id = params.row.id;
            let month = params.row.month;
            let year = params.row.year;
            let filename = `${params.row.from}-to-${params.row.to} (${params.row.month} - ${params.row.year})`
            sendDataToParentDownPaySlip({ id, month, year, filename });
        }
        const handleSentFixSalary = () => {

            let outerId = params.row.id;

            sendDataToParentSentFixSalary({ id, outerId });
        }

        return (
            <div>
                <Button aria-describedby={id} onClick={handleClick}>
                    <MoreHorizIcon />
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box sx={{ padding: 0 }}>

                        <List sx={{
                            p: 0,
                            width: '100%',
                            maxWidth: 360,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: 'background.paper',
                        }}
                            aria-label="mailbox folders">

                            <ListItem sx={{ cursor: "pointer", padding: "5px" }} onClick={handleDownloadPayrunClick}>
                                <ListItemText primary="Download Excel" />
                            </ListItem>
                            <Divider component="li" />
                            <ListItem sx={{ cursor: "pointer", padding: "5px" }} onClick={handleDownloadPaySlipClick}>
                                <ListItemText primary="Payslip Excel" />
                            </ListItem>
                            <Divider component="li" />
                            <ListItem sx={{ cursor: "pointer", padding: "5px" }} onClick={handleSentFixSalary}>
                                <ListItemText primary="Sent Fix Salary" />
                            </ListItem>
                        </List>
                    </Box>
                </Popover>
            </div>
        );
    };


    const columnDataTableCalcList = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 70,
            hide: !columnVisibilityCalcList.serialNumber,
        },
        { field: "department", headerName: "Department", flex: 0, width: 170, hide: !columnVisibilityCalcList.department },
        { field: "from", headerName: "From", flex: 0, width: 110, hide: !columnVisibilityCalcList.from },
        { field: "to", headerName: "To", flex: 0, width: 110, hide: !columnVisibilityCalcList.to },
        { field: "empcount", headerName: "Emp Count", flex: 0, width: 90, hide: !columnVisibilityCalcList.empcount },

        { field: "totalctc", headerName: "Total CTC", flex: 0, width: 130, hide: !columnVisibilityCalcList.totalctc },
        { field: "totalpf", headerName: "Total PF", flex: 0, width: 110, hide: !columnVisibilityCalcList.totalpf },
        { field: "totalesi", headerName: "Total ESI", flex: 0, width: 110, hide: !columnVisibilityCalcList.totalesi },
        { field: "totalproftax", headerName: "Total Prof. Tax", flex: 0, width: 110, hide: !columnVisibilityCalcList.totalproftax },
        { field: "generatedon", headerName: "Generated On", flex: 0, width: 170, hide: !columnVisibilityCalcList.generatedon },
        { field: "month", headerName: "Month", flex: 0, width: 80, hide: !columnVisibilityCalcList.month },
        { field: "year", headerName: "Year", flex: 0, width: 80, hide: !columnVisibilityCalcList.year },
        {
            field: "actions", headerName: "Actions",
            flex: 0,
            width: 100,
            hide: !columnVisibilityCalcList.actions,
            renderCell: (params) => <RowPopoverCalc sendDataToParentView={handleDataFromChild} sendDataToParentDown={handleDataFromChildDown} sendDataToParentDownPaySlip={handleDataFromChildPaySlip} sendDataToParentSentFixSalary={handleDataFromChildSentFixSalary} params={params} />,
        },

    ];

    const rowDataTableCalcList = filteredDataCalcList.map((item, index) => {
        return {

            ...item,
            id: item._id,
            totalctc: Number(item.totalctc).toFixed(2),
            totalpf: Number(item.totalpf).toFixed(2),
            totalesi: Number(item.totalesi).toFixed(2),
            // generatedon: moment(item.generatedon).format("DD-MM-YYYY HH:MM"),
            // from: moment(item.from).format("DD-MM-YYYY"),
            // to: moment(item.to).format("DD-MM-YYYY"),
        };
    });

    // Show All Columns functionality
    const handleShowAllColumnsCalcList = () => {
        const updatedVisibility = { ...columnVisibilityCalcList };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityCalcList(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityCalcList");
        if (savedVisibility) {
            setColumnVisibilityCalcList(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityCalcList", JSON.stringify(columnVisibilityCalcList));
    }, [columnVisibilityCalcList]);

    //  PDF
    const columnsCalcList = [
        { title: "SNo", dataKey: "serialNumber" },
        { title: "Departmet", dataKey: "department" },
        { title: "From", dataKey: "from" },
        { title: "To", dataKey: "to" },
        { title: "Total CTC", dataKey: "totalctc" },
        { title: "Total PF", dataKey: "totalpf" },
        { title: "Total ESI", dataKey: "totalesi" },
        { title: "Total Prof.tax", dataKey: "totalproftax" },
        { title: "Genrated On", dataKey: "generatedon" },
        { title: "Month", dataKey: "month" },
        { title: "Year", dataKey: "year" },

    ];

    const downloadPdfCalcList = () => {
        const doc = new jsPDF({
            orientation: "landscape",
        });

        const maxColumnsPerPage = 15; // Maximum number of columns per page
        const totalPages = Math.ceil(columnsCalcList.length / maxColumnsPerPage); // Calculate total pages needed

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            const startIdx = (currentPage - 1) * maxColumnsPerPage;
            const endIdx = Math.min(startIdx + maxColumnsPerPage, columnsCalcList.length);

            const currentPageColumns = columnsCalcList.slice(startIdx, endIdx);

            doc.autoTable({
                theme: "grid",
                styles: {
                    fontSize: 5,
                },
                columns: currentPageColumns,
                body: rowDataTableCalcList,
            });

            if (currentPage < totalPages) {
                doc.addPage(); // Add a new page if there are more columns to display
            }
        }

        doc.save("Pay Run CalcList.pdf");
    };


    //print...
    const componentRefCalcList = useRef();
    const handleprintCalcList = useReactToPrint({
        content: () => componentRefCalcList.current,
        documentTitle: "Pay Run CalcList",
        pageStyle: "print",
    });


    // // Function to filter columns based on search query
    const filteredColumnsCalcList = columnDataTableCalcList.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageCalcList.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilityCalcList = (field) => {
        setColumnVisibilityCalcList((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentCalcList = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsCalcList}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageCalcList} onChange={(e) => setSearchQueryManageCalcList(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsCalcList.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityCalcList[column.field]} onChange={() => toggleColumnVisibilityCalcList(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityCalcList(initialColumnVisibilityCalcList)}>
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
                                columnDataTableCalcList.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityCalcList(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    const context = {
        profTaxMaster,
        shifts,
        payruncontrolmaster,
        monthsArr,
        departmentsList,
        salSlabs,
        eraAmounts,
        acPointCal,
        attModearr,
        attStatus,
        manageshortagemasters,
        revenueAmount,
    };



    return (
        <Box>
            <Headtitle title={"Loss Payrun"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Non CalCulate Details</Typography>

            {
                isUserRoleCompare?.includes("llosspayrun") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}

                            <Grid container style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Typography>Show entries:</Typography>
                                    <Box>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSizeList}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChangeList}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={employeesPayRun?.length}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Box>
                                        {/* {isUserRoleCompare?.includes("excellosspayrun") && (
                                            <>
                                                <ExportXL
                                                    csvData={
                                                        rowDataTableList.map((item, index) => ({
                                                            SNo: index + 1,
                                                            Department: item.department,
                                                            From: item.from,
                                                            To: item.to,
                                                            EmpCount: Number(item.empcount),
                                                            "Total CTC": Number(item.totalctc),
                                                            "Total PF": Number(item.totalpf),
                                                            "Total ESI": Number(item.totalesi),
                                                            "Total Prof.tax": Number(item.totalproftax),
                                                            "Generated On": item.generatedon,
                                                            Month: item.month,
                                                            Year: item.year,

                                                        }))}
                                                    fileName={fileName}
                                                />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvlosspayrun") && (
                                            <>
                                                <ExportCSV
                                                    csvData={
                                                        rowDataTableList.map((item, index) => ({
                                                            SNo: index + 1,
                                                            Department: item.department,
                                                            From: item.from,
                                                            To: item.to,
                                                            EmpCount: Number(item.empcount),
                                                            "Total CTC": Number(item.totalctc),
                                                            "Total PF": Number(item.totalpf),
                                                            "Total ESI": Number(item.totalesi),
                                                            "Total Prof.tax": Number(item.totalproftax),
                                                            "Generated On": item.generatedon,
                                                            Month: item.month,
                                                            Year: item.year,

                                                        }))}
                                                    fileName={fileName}
                                                />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printlosspayrun") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintList}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdflosspayrun") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdfList()}>
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagelosspayrun") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageList}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )} */}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <Typography>Search</Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={searchQueryList} onChange={handleSearchChangeList} />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item md={3.9} xs={12} sm={12} marginTop={3}>
                                    <Box>
                                        <Button sx={userStyle.buttongrpexp} size="small" onClick={handleShowAllColumnsList}>
                                            Show All Columns
                                        </Button>

                                        <Button sx={userStyle.buttongrpexp} size="small" onClick={handleOpenManageColumnsList}>
                                            Manage Columns
                                        </Button>
                                        {/* Manage Column */}
                                        <Popover
                                            id={idList}
                                            open={isManageColumnsOpenList}
                                            anchorEl={anchorElList}
                                            onClose={handleCloseManageColumnsList}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                            }}
                                        >
                                            {manageColumnsContentList}
                                        </Popover>
                                    </Box>
                                </Grid>

                            </Grid>
                            <br />
                            {isBankdetail ? (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        {/* <CircularProgress color="inherit" />  */}
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            rows={rowDataTableList}
                                            columns={columnDataTableList.filter((column) => columnVisibilityList[column.field])}
                                            onSelectionModelChange={handleSelectionChange}
                                            autoHeight={true}
                                            ref={gridRefList}
                                            density="compact" hideFooter
                                            getRowClassName={getRowClassName} disableRowSelectionOnClick

                                            columnBuffer={90}
                                        />
                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredDataList.length > 0 ? (pageList - 1) * pageSizeList + 1 : 0} to {Math.min(pageList * pageSizeList, filteredDatasList.length)} of {filteredDatasList.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPageList(1)} disabled={pageList === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangeList(pageList - 1)} disabled={pageList === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersList?.map((pageNumberList) => (
                                                <Button key={pageNumberList} sx={userStyle.paginationbtn} onClick={() => handlePageChangeList(pageNumberList)} className={pageList === pageNumberList ? "active" : ""} disabled={pageList === pageNumberList}>
                                                    {pageNumberList}
                                                </Button>
                                            ))}
                                            {lastVisiblePageList < totalPagesList && <span>...</span>}
                                            <Button onClick={() => handlePageChangeList(pageList + 1)} disabled={pageList === totalPagesList} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPageList(totalPagesList)} disabled={pageList === totalPagesList} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </>
                )
            }
            <br />
            <Typography sx={userStyle.HeaderText}>CalCulate Details</Typography>

            {
                isUserRoleCompare?.includes("llosspayrun") && (
                    <>
                        <Box sx={userStyle.container}>
                            <Grid container style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Typography>Show entries:</Typography>
                                    <Box>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSizeCalcList}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChangeCalcList}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={rowData?.length}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Box>
                                        {/* {isUserRoleCompare?.includes("excellosspayrun") && (
                                            <>
                                                <ExportXL
                                                    csvData={
                                                        rowDataTableList.map((item, index) => ({
                                                            SNo: index + 1,
                                                            Department: item.department,
                                                            From: item.from,
                                                            To: item.to,
                                                            EmpCount: Number(item.empcount),
                                                            "Total CTC": Number(item.totalctc),
                                                            "Total PF": Number(item.totalpf),
                                                            "Total ESI": Number(item.totalesi),
                                                            "Total Prof.tax": Number(item.totalproftax),
                                                            "Generated On": item.generatedon,
                                                            Month: item.month,
                                                            Year: item.year,

                                                        }))}
                                                    fileName={fileName}
                                                />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvlosspayrun") && (
                                            <>
                                                <ExportCSV
                                                    csvData={
                                                        rowDataTableList.map((item, index) => ({
                                                            SNo: index + 1,
                                                            Department: item.department,
                                                            From: item.from,
                                                            To: item.to,
                                                            EmpCount: Number(item.empcount),
                                                            "Total CTC": Number(item.totalctc),
                                                            "Total PF": Number(item.totalpf),
                                                            "Total ESI": Number(item.totalesi),
                                                            "Total Prof.tax": Number(item.totalproftax),
                                                            "Generated On": item.generatedon,
                                                            Month: item.month,
                                                            Year: item.year,

                                                        }))}
                                                    fileName={fileName}
                                                />
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printlosspayrun") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprintList}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdflosspayrun") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdfList()}>
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imagelosspayrun") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageList}>
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )} */}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <Typography>Search</Typography>
                                            <OutlinedInput id="component-outlined" type="text" value={searchQueryCalcList} onChange={handleSearchChangeCalcList} />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item md={3.9} xs={12} sm={12} marginTop={3}>
                                    <Box>
                                        <Button sx={userStyle.buttongrpexp} size="small" onClick={handleShowAllColumnsCalcList}>
                                            Show All Columns
                                        </Button>

                                        <Button sx={userStyle.buttongrpexp} size="small" onClick={handleOpenManageColumnsCalcList}>
                                            Manage Columns
                                        </Button>
                                        {/* Manage Column */}
                                        <Popover
                                            id={idCalcList}
                                            open={isManageColumnsOpenCalcList}
                                            anchorEl={anchorElCalcList}
                                            onClose={handleCloseManageColumnsCalcList}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                            }}
                                        >
                                            {manageColumnsContentCalcList}
                                        </Popover>
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={6}>

                                </Grid>
                                <Grid item md={2} xs={12} sm={6}>
                                </Grid>
                                <Grid item md={2} xs={12} sm={6} marginTop={3}>
                                </Grid>
                            </Grid>
                            <br />
                            {isBankdetail ? (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        {/* <CircularProgress color="inherit" />  */}
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                                            onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                                            rows={rowDataTableCalcList}
                                            columns={columnDataTableCalcList.filter((column) => columnVisibilityCalcList[column.field])}
                                            onSelectionModelChange={handleSelectionChange}
                                            autoHeight={true}
                                            ref={gridRefCalcList}
                                            density="compact" hideFooter
                                            getRowClassName={getRowClassName} disableRowSelectionOnClick

                                            columnBuffer={90}
                                        />
                                    </Box>
                                    <Box style={userStyle.dataTablestyle}>
                                        <Box>
                                            Showing {filteredDataCalcList.length > 0 ? (pageCalcList - 1) * pageSizeCalcList + 1 : 0} to {Math.min(pageCalcList * pageSizeCalcList, filteredDatasCalcList.length)} of {filteredDatasCalcList.length} entries
                                        </Box>
                                        <Box>
                                            <Button onClick={() => setPageCalcList(1)} disabled={pageCalcList === 1} sx={userStyle.paginationbtn}>
                                                <FirstPageIcon />
                                            </Button>
                                            <Button onClick={() => handlePageChangeCalcList(pageCalcList - 1)} disabled={pageCalcList === 1} sx={userStyle.paginationbtn}>
                                                <NavigateBeforeIcon />
                                            </Button>
                                            {pageNumbersCalcList?.map((pageNumberCalcList) => (
                                                <Button key={pageNumberCalcList} sx={userStyle.paginationbtn} onClick={() => handlePageChangeCalcList(pageNumberCalcList)} className={pageCalcList === pageNumberCalcList ? "active" : ""} disabled={pageCalcList === pageNumberCalcList}>
                                                    {pageNumberCalcList}
                                                </Button>
                                            ))}
                                            {lastVisiblePageCalcList < totalPagesCalcList && <span>...</span>}
                                            <Button onClick={() => handlePageChangeCalcList(pageCalcList + 1)} disabled={pageCalcList === totalPagesCalcList} sx={userStyle.paginationbtn}>
                                                <NavigateNextIcon />
                                            </Button>
                                            <Button onClick={() => setPageCalcList(totalPagesCalcList)} disabled={pageCalcList === totalPagesCalcList} sx={userStyle.paginationbtn}>
                                                <LastPageIcon />
                                            </Button>
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </>
                )
            }
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>

                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Dialog open={isViewOpen} onClose={handleCloseModView} fullWidth={true} aria-labelledby="alert-dialog-title-view" aria-describedby="alert-dialog-description-view" maxWidth={"1600px"}>
                <DialogContent sx={{ padding: "20px" }}>

                    <Box>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item md={8} xs={12} sm={12}>
                            <Typography sx={userStyle.importheadtext}><span style={{ fontSize: "20px" }}>Pay Run List </span>-  <span style={{ fontWeight: "700", fontSize: "22px" }}>{viewlistname}</span></Typography>
                        </Grid>
                        <br />
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSize}
                                        size="small"
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
                                        <MenuItem value={rowData?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excellosspayrun") && (
                                        <>
                                            <ExportXL
                                                csvData={
                                                    rowDataTable.map((t, index) => ({
                                                        Sno: index + 1,
                                                        Department: t.department,
                                                        Company: t.company,
                                                        Branch: t.branch,
                                                        Unit: t.unit,
                                                        Team: t.team,
                                                        Designation: t.designation,
                                                        "Employee Name": t.companyname,
                                                        "Employee Code": t.empcode,
                                                        "Aadhar Name": t.legalname,
                                                        "Process Code": t.processcode,
                                                        DOJ: t.doj,
                                                        "Experience In Month": Number(t.experience),
                                                        "ProcessCode Exp": (t.processcodeexp),
                                                        "Total No Of Days": Number(t.totalnumberofdays),
                                                        "Total Shift": Number(t.totalshift),
                                                        CLSL: Number(t.clsl),
                                                        "Week Off": Number(t.weekoffcount),
                                                        Holiday: Number(t.holiday),
                                                        "Total Absent/Leave": Number(t.totalasbleave),
                                                        "Total Paid Days": Number(t.totalpaidDays),

                                                        "Gross": Number(t.oldgross),
                                                        "Basic": Number(t.oldbasic),
                                                        "HRA": Number(t.oldhra),
                                                        "Conveyance": Number(t.oldconveyance),
                                                        "Medical Allowance": Number(t.oldmedicalallowance),
                                                        "Production Allowance": Number(t.oldproductionallowance),
                                                        "Production Allowance 2": Number(t.oldproductionallowancetwo),
                                                        "Other Allowance": Number(t.oldotherallowance),

                                                        "New Gross": Number(t.gross),
                                                        "Actual Basic": Number(t.basic),
                                                        "Actual HRA": Number(t.hra),
                                                        "Actual Conveyance": Number(t.conveyance),
                                                        "Actual Medical Allowance": Number(t.medicalallowance),
                                                        "Actual Production Allowance": Number(t.productionallowance),
                                                        "Actual Production Allowance 2": Number(t.productionallowancetwo),
                                                        "Actual Other Allowance": Number(t.otherallowance),

                                                        "Target Points": Number(t.monthPoint),
                                                        "Achieved Points": Number(t.acheivedpoints),
                                                        "Achieved  %": Number(t.acheivedpercent),
                                                        "Achieved Production Allowance": Number(t.acheivedproductionallowance),
                                                        "Actual Net Salary": Number(t.actualnetsalary),
                                                        "LOP Basic": Number(t.lopbasic),
                                                        "LOP HRA": Number(t.lophra),
                                                        "LOP Conveyance": Number(t.lopconveyance),
                                                        "LOP Medical Allowance": Number(t.lopmedicalallowance),
                                                        "LOP Production Allowance": Number(t.lopproductionallowance),
                                                        "LOP Other Allowance": Number(t.lopotherallowance),
                                                        "LOP Net Salary": Number(t.lopnetsalary),
                                                        "Prod Basic": Number(t.prodbasic),
                                                        "Prod HRA": Number(t.prodhra),
                                                        "Prod Conveyance": Number(t.prodconveyance),
                                                        "Prod Medical Allowance": Number(t.prodmedicalallowance),
                                                        "Prod Production Allowance": Number(t.prodproductionallowance),
                                                        "Prod Other Allowance": Number(t.prodotherallowance),
                                                        "Attendance LOP": Number(t.attendancelop),
                                                        "Calculated Net Salary": Number(t.calculatednetsalary),
                                                        "Actual Penalty Amount": Number(t.penalty),
                                                        "Penalty Amount": Number(t.penaltyamount),
                                                        "Loss Deduction": Number(t.lossdeduction),
                                                        "Other Deduction": Number(t.otherdeduction),
                                                        "Final Basic": Number(t.finalbasic),
                                                        "Final HRA": Number(t.finalhra),
                                                        "Final Conveyance": Number(t.finalconveyance),
                                                        "Final Medical Allowance": Number(t.finalmedicalallowance),
                                                        "Final Production Allowance": Number(t.finalproductionallowance),
                                                        "Final Other Allowance": Number(t.finalotherallowance),
                                                        "Final Net Salary": Number(t.finalnetsalary),
                                                        "PF Days": Number(t.pfdays),
                                                        "NCP Days": Number(t.ncpdays),
                                                        "PF Deduction": Number(t.pfdeduction),
                                                        "ESI Deduction": Number(t.esideduction),
                                                        "Final-LOP": Number(t.finallopdays),
                                                        "Final LOP Days": Number(t.paysliplop),
                                                        "Final Leave Deduction": Number(t.finalleavededuction),
                                                        "Professional Tax": Number(t.professionaltax),
                                                        "Total Deductions": Number(t.totaldeductions),
                                                        UAN: t.uan,
                                                        "IP Name": t.ipname,
                                                        "No. Allowance Shift": Number(t.noallowancepoint),
                                                        "Shift Allowance Point": Number(t.allowancepoint),
                                                        "Shift Allowance Target": Number(t.shiftallowancetarget),
                                                        "Night Shift Allowance": Number(t.nightshiftallowance),
                                                        "Final Salary": Number(t.finalsalary),
                                                        "Final Salary-Penalty": Number(t.finalsalarypenalty),
                                                        "Total Points Value": Number(t.totalpointsvalue),
                                                        ERA: Number(t.eramount),
                                                        "Actual ERA": Number(t.era),
                                                        "PF Employer Deduction": Number(t.pfemployerdeduction),
                                                        "ESI Employer Deduction": Number(t.esiemployerdeduction),
                                                        CTC: Number(t.ctc),
                                                        "Revenue Allowance": Number(t.revenueallow),
                                                        "Final Value": Number(t.finalvalue),
                                                        "Final Value-Penalty": Number(t.finalvaluepenalty),
                                                        Shortage: Number(t.shortage),
                                                        "Shortage 1": Number(t.shortageone),
                                                        "Actual Deduction": Number(t.actualdeduction),
                                                        "Minimum Deduction": Number(t.minimumdeduction),
                                                        "Final Value Review": t.finalvaluereview,
                                                        "Final Value Status": t.finalvaluestatus,
                                                        "Final Value Penalty Status": t.finalvaluepenaltystatus,

                                                        //FIXED
                                                        "Fixed Loss Deduction": Number(t.fixedlossdeduction),
                                                        Fixed_NET_Salary: Number(t.fixednetsalary),
                                                        "Fixed Basic": Number(t.fixedbasic),
                                                        "Fixed HRA": Number(t.fixedhra),
                                                        "Fixed Conveyance": Number(t.fixedconveyance),
                                                        "Fixed Medical Allowance": Number(t.fixedmedicalallowance),
                                                        "Fixed Production Allowance": Number(t.fixedproductionallowance),
                                                        "Fixed Other Allowance": Number(t.fixedotherallowance),
                                                        Fixed_NET_Salary1: Number(t.fixednetsalaryone),
                                                        Fixed_Emp_pf: Number(t.fixedemppf),
                                                        Fixed_Emp_Esi: Number(t.fixedempesi),
                                                        Fixed_Emp_ptax: Number(t.fixedempptax),
                                                        "Fixed Empr_pf": Number(t.fixedemprpf),
                                                        "Fixed Empr_Esi": Number(t.fixedempresi),
                                                        Fixed_Shift_Allowance: Number(t.fixedshiftallowance),
                                                        "Fixed Total Deductions": Number(t.fixedtotaldeductions),
                                                        "Fixed Salary": Number(t.fixedsalary),
                                                        "Fixed Salary+Penalty": Number(t.fixedsalarypenalty),
                                                        "Fixed-LOP": Number(t.fixedlop),
                                                        "Fixed LOP Days": Number(t.fixedlopdays),
                                                        "Fixed Leave Deduction": Number(t.fixedleavededuction),
                                                        "Fixed CTC": Number(t.fixedctc),
                                                        "Fixed Final Value": Number(t.fixedfinalvalue),
                                                        "Fixed Actual Deduction": Number(t.fixedactualdeduction),
                                                        "Fixed Minimum Deduction": Number(t.fixedminimumdeduction),

                                                        //PRODUCTION

                                                        "PROD Loss Deduction": Number(t.prodlossdeduction),
                                                        PROD_NET_Salary: Number(t.prodnetsalary),
                                                        "PROD Basic": Number(t.prodbasicp),
                                                        "PROD HRA": Number(t.prodhrap),
                                                        "PROD Conveyance": Number(t.prodconveyancep),
                                                        "PROD Medical Allowance": Number(t.prodmedicalallowancep),
                                                        "PROD Production Allowance": Number(t.prodproductionallowancep),
                                                        "PROD Other Allowance": Number(t.prodotherallowancep),
                                                        PROD_NET_Salary1: Number(t.prodnetsalaryonep),

                                                        "PROD_Emp_pf": Number(t.prodemppf),
                                                        "PROD_Emp_esi": Number(t.prodempesi),
                                                        "PROD_Emp_ptax": Number(t.prodempptax),
                                                        "PROD_Empr_pf": Number(t.prodemprpf),
                                                        "PROD_Empr_Esi": Number(t.prodempresi),
                                                        "PROD_Shift_Allowance": Number(t.prodshiftallowance),
                                                        "PROD Total Deductions": Number(t.prodtotaldeductions),

                                                        "PROD Salary": Number(t.prodsalary),
                                                        "PROD Salary+Penalty": Number(t.prodsalarypenalty),
                                                        "PROD LOP Days": Number(t.prodlopdays),
                                                        "PROD LOP": Number(t.prodlop),
                                                        "PROD Leave Deduction": Number(t.prodleavededuction),

                                                        "PROD CTC": Number(t.prodctc),
                                                        "PROD Final Value": Number(t.prodfinalvalue),

                                                        "PROD Actual Deduction": Number(t.prodactualdeduction),
                                                        "PROD Minimum Deduction": Number(t.prodminimumdeduction),

                                                        "Banck Name": (t.bankname),
                                                        "Account Name": (t.accountname),
                                                        "Account Number": (t.accountnumber),
                                                        "IFSC Code": (t.ifsccode),

                                                        [`Current (${monthsArr[Number(selectedViewMonthNum) >= 12 ? 0 : Number(selectedViewMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
                                                        [`Current (${monthsArr[Number(selectedViewMonthNum) >= 12 ? 0 : Number(selectedViewMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
                                                        "Paid Status": t.paidstatus,
                                                        "Salary Type": t.salarytype,
                                                        "Deduction Type": t.deductiontype,
                                                    }))}
                                                fileName={`Pay Run List - ${viewlistname}`}
                                            />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvlosspayrun") && (
                                        <>
                                            <ExportCSV
                                                csvData={
                                                    rowDataTable.map((t, index) => ({
                                                        Sno: index + 1,
                                                        Department: t.department,
                                                        Company: t.company,
                                                        Branch: t.branch,
                                                        Unit: t.unit,
                                                        Team: t.team,
                                                        Designation: t.designation,
                                                        "Employee Name": t.companyname,
                                                        "Aadhar Name": t.legalname,
                                                        "Process Code": t.processcode,
                                                        DOJ: t.doj,
                                                        "Experience In Month": Number(t.experience),
                                                        "ProcessCode Exp": (t.processcodeexp),
                                                        "Total No Of Days": Number(t.totalnumberofdays),
                                                        "Total Shift": Number(t.totalshift),
                                                        CLSL: Number(t.clsl),
                                                        "Week Off": Number(t.weekoffcount),
                                                        Holiday: Number(t.holiday),
                                                        "Total Absent/Leave": Number(t.totalasbleave),
                                                        "Total Paid Dyas": Number(t.totalpaidDays),

                                                        "Gross": Number(t.oldgross),
                                                        "Basic": Number(t.oldbasic),
                                                        "HRA": Number(t.oldhra),
                                                        "Conveyance": Number(t.oldconveyance),
                                                        "Medical Allowance": Number(t.oldmedicalallowance),
                                                        "Production Allowance": Number(t.oldproductionallowance),
                                                        "Production Allowance 2": Number(t.oldproductionallowancetwo),
                                                        "Other Allowance": Number(t.oldotherallowance),

                                                        "New Gross": Number(t.gross),
                                                        "Actual Basic": Number(t.basic),
                                                        "Actual HRA": Number(t.hra),
                                                        "Actual Conveyance": Number(t.conveyance),
                                                        "Actual Medical Allowance": Number(t.medicalallowance),
                                                        "Actual Production Allowance": Number(t.productionallowance),
                                                        "Actual Production Allowance 2": Number(t.productionallowancetwo),
                                                        "Actual Other Allowance": Number(t.otherallowance),

                                                        "Target Points": Number(t.monthPoint),
                                                        "Achieved Points": Number(t.acheivedpoints),
                                                        "Achieved  %": Number(t.acheivedpercent),
                                                        "Achieved Production Allowance": Number(t.acheivedproductionallowance),
                                                        "Actual Net Salary": Number(t.actualnetsalary),
                                                        "LOP Basic": Number(t.lopbasic),
                                                        "LOP HRA": Number(t.lophra),
                                                        "LOP Conveyance": Number(t.lopconveyance),
                                                        "LOP Medical Allowance": Number(t.lopmedicalallowance),
                                                        "LOP Production Allowance": Number(t.lopproductionallowance),
                                                        "LOP Other Allowance": Number(t.lopotherallowance),
                                                        "LOP Net Salary": Number(t.lopnetsalary),
                                                        "Prod Basic": Number(t.prodbasic),
                                                        "Prod HRA": Number(t.prodhra),
                                                        "Prod Conveyance": Number(t.prodconveyance),
                                                        "Prod Medical Allowance": Number(t.prodmedicalallowance),
                                                        "Prod Production Allowance": Number(t.prodproductionallowance),
                                                        "Prod Other Allowance": Number(t.prodotherallowance),
                                                        "Attendance LOP": Number(t.attendancelop),
                                                        "Calculated Net Salary": Number(t.calculatednetsalary),
                                                        "Actual Penalty Amount": Number(t.penalty),
                                                        "Penalty Amount": Number(t.penaltyamount),
                                                        "Loss Deduction": Number(t.lossdeduction),
                                                        "Other Deduction": Number(t.otherdeduction),
                                                        "Final Basic": Number(t.finalbasic),
                                                        "Final HRA": Number(t.finalhra),
                                                        "Final Conveyance": Number(t.finalconveyance),
                                                        "Final Medical Allowance": Number(t.finalmedicalallowance),
                                                        "Final Production Allowance": Number(t.finalproductionallowance),
                                                        "Final Other Allowance": Number(t.finalotherallowance),
                                                        "Final Net Salary": Number(t.finalnetsalary),
                                                        "PF Days": Number(t.pfdays),
                                                        "NCP Days": Number(t.ncpdays),
                                                        "PF Deduction": Number(t.pfdeduction),
                                                        "ESI Deduction": Number(t.esideduction),
                                                        "Final-LOP": Number(t.finallopdays),
                                                        "Final LOP Days": Number(t.paysliplop),
                                                        "Final Leave Deduction": Number(t.finalleavededuction),
                                                        "Professional Tax": Number(t.professionaltax),
                                                        "Total Deductions": Number(t.totaldeductions),
                                                        UAN: t.uan,
                                                        "IP Name": t.ipname,
                                                        "No. Allowance Shift": Number(t.noallowancepoint),
                                                        "Shift Allowance Point": Number(t.allowancepoint),
                                                        "Shift Allowance Target": Number(t.shiftallowancetarget),
                                                        "Night Shift Allowance": Number(t.nightshiftallowance),
                                                        "Final Salary": Number(t.finalsalary),
                                                        "Final Salary-Penalty": Number(t.finalsalarypenalty),
                                                        "Total Points Value": Number(t.totalpointsvalue),
                                                        ERA: Number(t.eramount),
                                                        "Actual ERA": Number(t.era),
                                                        "PF Employer Deduction": Number(t.pfemployerdeduction),
                                                        "ESI Employer Deduction": Number(t.esiemployerdeduction),
                                                        CTC: Number(t.ctc),
                                                        "Revenue Allowance": Number(t.revenueallow),
                                                        "Final Value": Number(t.finalvalue),
                                                        "Final Value-Penalty": Number(t.finalvaluepenalty),
                                                        Shortage: Number(t.shortage),
                                                        "Shortage 1": Number(t.shortageone),
                                                        "Actual Deduction": Number(t.actualdeduction),
                                                        "Minimum Deduction": Number(t.minimumdeduction),
                                                        "Final Value Review": t.finalvaluereview,
                                                        "Final Value Status": t.finalvaluestatus,
                                                        "Final Value Penalty Status": t.finalvaluepenaltystatus,

                                                        //FIXED
                                                        "Fixed Loss Deduction": Number(t.fixedlossdeduction),
                                                        Fixed_NET_Salary: Number(t.fixednetsalary),
                                                        "Fixed Basic": Number(t.fixedbasic),
                                                        "Fixed HRA": Number(t.fixedhra),
                                                        "Fixed Conveyance": Number(t.fixedconveyance),
                                                        "Fixed Medical Allowance": Number(t.fixedmedicalallowance),
                                                        "Fixed Production Allowance": Number(t.fixedproductionallowance),
                                                        "Fixed Other Allowance": Number(t.fixedotherallowance),
                                                        Fixed_NET_Salary1: Number(t.fixednetsalaryone),
                                                        Fixed_Emp_pf: Number(t.fixedemppf),
                                                        Fixed_Emp_Esi: Number(t.fixedempesi),
                                                        Fixed_Emp_ptax: Number(t.fixedempptax),
                                                        "Fixed Empr_pf": Number(t.fixedemprpf),
                                                        "Fixed Empr_Esi": Number(t.fixedempresi),
                                                        Fixed_Shift_Allowance: Number(t.fixedshiftallowance),
                                                        "Fixed Total Deductions": Number(t.fixedtotaldeductions),
                                                        "Fixed Salary": Number(t.fixedsalary),
                                                        "Fixed Salary+Penalty": Number(t.fixedsalarypenalty),
                                                        "Fixed-LOP": Number(t.fixedlop),
                                                        "Fixed LOP Days": Number(t.fixedlopdays),
                                                        "Fixed Leave Deduction": Number(t.fixedleavededuction),
                                                        "Fixed CTC": Number(t.fixedctc),
                                                        "Fixed Final Value": Number(t.fixedfinalvalue),
                                                        "Fixed Actual Deduction": Number(t.fixedactualdeduction),
                                                        "Fixed Minimum Deduction": Number(t.fixedminimumdeduction),

                                                        //PRODUCTION

                                                        "PROD Loss Deduction": Number(t.prodlossdeduction),
                                                        PROD_NET_Salary: Number(t.prodnetsalary),
                                                        "PROD Basic": Number(t.prodbasicp),
                                                        "PROD HRA": Number(t.prodhrap),
                                                        "PROD Conveyance": Number(t.prodconveyancep),
                                                        "PROD Medical Allowance": Number(t.prodmedicalallowancep),
                                                        "PROD Production Allowance": Number(t.prodproductionallowancep),
                                                        "PROD Other Allowance": Number(t.prodotherallowancep),
                                                        PROD_NET_Salary1: Number(t.prodnetsalaryonep),

                                                        "PROD_Emp_pf": Number(t.prodemppf),
                                                        "PROD_Emp_esi": Number(t.prodempesi),
                                                        "PROD_Emp_ptax": Number(t.prodempptax),
                                                        "PROD_Empr_pf": Number(t.prodemprpf),
                                                        "PROD_Empr_Esi": Number(t.prodempresi),
                                                        "PROD_Shift_Allowance": Number(t.prodshiftallowance),
                                                        "PROD Total Deductions": Number(t.prodtotaldeductions),

                                                        "PROD Salary": Number(t.prodsalary),
                                                        "PROD Salary+Penalty": Number(t.prodsalarypenalty),
                                                        "PROD LOP Days": Number(t.prodlopdays),
                                                        "PROD LOP": Number(t.prodlop),
                                                        "PROD Leave Deduction": Number(t.prodleavededuction),

                                                        "PROD CTC": Number(t.prodctc),
                                                        "PROD Final Value": Number(t.prodfinalvalue),

                                                        "PROD Actual Deduction": Number(t.prodactualdeduction),
                                                        "PROD Minimum Deduction": Number(t.prodminimumdeduction),

                                                        "Banck Name": (t.bankname),
                                                        "Account Name": (t.accountname),
                                                        "Account Number": (t.accountnumber),
                                                        "IFSC Code": (t.ifsccode),

                                                        [`Current (${monthsArr[Number(selectedViewMonthNum) >= 12 ? 0 : Number(selectedViewMonthNum)]}) Month Avg`]: Number(t.currentmonthavg),
                                                        [`Current (${monthsArr[Number(selectedViewMonthNum) >= 12 ? 0 : Number(selectedViewMonthNum)]}) Month Attendance`]: Number(t.currentmonthattendance),
                                                        "Paid Status": t.paidstatus,
                                                        "Salary Type": t.salarytype,
                                                        "Deduction Type": t.deductiontype,
                                                    }))}
                                                fileName={`Pay Run List - ${viewlistname}`}
                                            />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printlosspayrun") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdflosspayrun") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagelosspayrun") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>

                                <Box>
                                    <OutlinedInput
                                        size="small"
                                        variant="outlined"
                                        onChange={onQuickFilterChanged}
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={3.9} xs={12} sm={12} marginTop={3}>
                                <Box>
                                    <Button sx={userStyle.buttongrpexp} size="small" onClick={handleShowAllColumns}>
                                        Show All Columns
                                    </Button>

                                    <Button sx={userStyle.buttongrpexp} size="small" onClick={handleOpenManageColumns}>
                                        Manage Columns
                                    </Button>
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
                                </Box>
                            </Grid>

                        </Grid>
                        <br />
                        {isBankdetail ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>

                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    style={{
                                        height: 500,
                                        width: "100%",

                                    }}
                                    ref={gridRefContainer}
                                    className="ag-theme-quartz"
                                >

                                    <AgGridReact
                                        columnDefs={columnDataTable}
                                        ref={gridRef}
                                        context={context}
                                        rowData={rowDataTable}
                                        onGridReady={onGridReady}
                                        getRowId={(params) => params.data.serialNumber}
                                        getRowNodeId={data => data.serialNumber}
                                    />

                                </Box>

                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers[0] > 1 && <span>...</span>}
                                        {pageNumbers.map((pageNumber) => (
                                            <Button
                                                key={pageNumber}
                                                sx={userStyle.paginationbtn}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={currentPage === pageNumber ? 'active' : ''}
                                                disabled={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {pageNumbers[pageNumbers.length - 1] < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>

                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseModView}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRefList}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>S.NO</StyledTableCell>
                            <StyledTableCell>Department</StyledTableCell>
                            <StyledTableCell>From</StyledTableCell>
                            <StyledTableCell>To</StyledTableCell>
                            <StyledTableCell>Emp Count</StyledTableCell>
                            <StyledTableCell>Total CTC</StyledTableCell>
                            <StyledTableCell>Total PF</StyledTableCell>
                            <StyledTableCell>Total ESI</StyledTableCell>
                            <StyledTableCell>Total Prof.tax</StyledTableCell>
                            <StyledTableCell>Generated On</StyledTableCell>
                            <StyledTableCell>Month </StyledTableCell>
                            <StyledTableCell>Year </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTableList &&
                            rowDataTableList.map((item, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{item.department}</StyledTableCell>
                                    <StyledTableCell>{item.from}</StyledTableCell>
                                    <StyledTableCell>{item.to}</StyledTableCell>
                                    <StyledTableCell>{item.empcount}</StyledTableCell>
                                    <StyledTableCell>{item.totalctc}</StyledTableCell>
                                    <StyledTableCell>{item.totalpf}</StyledTableCell>
                                    <StyledTableCell>{item.totalesi}</StyledTableCell>
                                    <StyledTableCell>{item.totalproftax}</StyledTableCell>
                                    <StyledTableCell>{item.generatedon}</StyledTableCell>
                                    <StyledTableCell>{item.month}</StyledTableCell>
                                    <StyledTableCell>{item.year}</StyledTableCell>

                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple-tablelosspayrun" id="losspayrun" ref={componentRef}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>S.no</StyledTableCell>
                            <StyledTableCell>Department</StyledTableCell>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Unit</StyledTableCell>
                            <StyledTableCell>Team</StyledTableCell>
                            <StyledTableCell>Designation</StyledTableCell>
                            <StyledTableCell>Employee Name</StyledTableCell>
                            <StyledTableCell>Aadhar Name</StyledTableCell>
                            <StyledTableCell>Process Code</StyledTableCell>
                            <StyledTableCell>DOJ</StyledTableCell>
                            <StyledTableCell>Experience In Month</StyledTableCell>
                            <StyledTableCell>Prod Exp</StyledTableCell>
                            <StyledTableCell>Total No of Dyas</StyledTableCell>
                            <StyledTableCell>Total Shift</StyledTableCell>
                            <StyledTableCell>CLSL</StyledTableCell>
                            <StyledTableCell>Week Off</StyledTableCell>
                            <StyledTableCell>Holiday</StyledTableCell>
                            <StyledTableCell>Total Absent/Leave</StyledTableCell>
                            <StyledTableCell>Total Paid Days</StyledTableCell>


                            <StyledTableCell>Gross</StyledTableCell>

                            <StyledTableCell>Basic</StyledTableCell>
                            <StyledTableCell>HRA</StyledTableCell>
                            <StyledTableCell>Conveyance</StyledTableCell>
                            <StyledTableCell>Medical Allowance</StyledTableCell>
                            <StyledTableCell>Production Allowance</StyledTableCell>
                            <StyledTableCell>Production Allowance 2</StyledTableCell>
                            <StyledTableCell>Other Allowance</StyledTableCell>

                            <StyledTableCell>New Gross</StyledTableCell>
                            <StyledTableCell>Actual Basic</StyledTableCell>
                            <StyledTableCell>Actual HRA</StyledTableCell>
                            <StyledTableCell>Actual Conveyance</StyledTableCell>
                            <StyledTableCell>Actual Medical Allowance</StyledTableCell>
                            <StyledTableCell>Actual Production Allowance</StyledTableCell>
                            <StyledTableCell>Actual Production Allowance 2</StyledTableCell>
                            <StyledTableCell>Actual Other Allowance</StyledTableCell>
                            <StyledTableCell>Target Points</StyledTableCell>
                            <StyledTableCell>Achieved Points</StyledTableCell>
                            <StyledTableCell>Achieved %</StyledTableCell>
                            <StyledTableCell>Achieved Production Allowance</StyledTableCell>
                            <StyledTableCell>Actual Net Salary</StyledTableCell>
                            <StyledTableCell>LOP Basic</StyledTableCell>
                            <StyledTableCell>LOP HRA</StyledTableCell>
                            <StyledTableCell>LOP Conveyance</StyledTableCell>
                            <StyledTableCell>LOP Medical Allowance</StyledTableCell>
                            <StyledTableCell>LOP Production Allowance</StyledTableCell>
                            <StyledTableCell>LOP Other Allowance</StyledTableCell>
                            <StyledTableCell>LOP Net Salary</StyledTableCell>
                            <StyledTableCell>Prod Basic</StyledTableCell>
                            <StyledTableCell>Prod HRA</StyledTableCell>
                            <StyledTableCell>Prod Conveyance</StyledTableCell>
                            <StyledTableCell>Prod Medical Allowance</StyledTableCell>
                            <StyledTableCell>Prod Production Allowance</StyledTableCell>
                            <StyledTableCell>Prod Other Allowance</StyledTableCell>
                            <StyledTableCell>Attendance LOP</StyledTableCell>
                            <StyledTableCell>Calculated Net Salary</StyledTableCell>
                            <StyledTableCell>Actual Penalty Amount</StyledTableCell>
                            <StyledTableCell>Penalty Amount</StyledTableCell>
                            <StyledTableCell>Loss Deduction</StyledTableCell>
                            <StyledTableCell>Other Deduction</StyledTableCell>
                            <StyledTableCell>Final Basic</StyledTableCell>
                            <StyledTableCell>Final HRA</StyledTableCell>
                            <StyledTableCell>Final Conveyance</StyledTableCell>
                            <StyledTableCell>Final Medical Allowance</StyledTableCell>
                            <StyledTableCell>Final Production Allowance</StyledTableCell>
                            <StyledTableCell>Final Other Allowance</StyledTableCell>
                            <StyledTableCell>Final Net Salary</StyledTableCell>
                            <StyledTableCell>PF Days</StyledTableCell>
                            <StyledTableCell>NCP Days</StyledTableCell>
                            <StyledTableCell>PF Deduction</StyledTableCell>
                            <StyledTableCell>ESI Deduction</StyledTableCell>
                            <StyledTableCell>Final LOP</StyledTableCell>
                            <StyledTableCell>Final LOP Days</StyledTableCell>
                            <StyledTableCell>Final Leave Deduction</StyledTableCell>
                            <StyledTableCell>Professional Tax</StyledTableCell>
                            <StyledTableCell>Total Deductions</StyledTableCell>
                            <StyledTableCell>UAN</StyledTableCell>
                            <StyledTableCell>IP Name</StyledTableCell>
                            <StyledTableCell>No. Allowance Shift</StyledTableCell>
                            <StyledTableCell>Shift Allowance Point</StyledTableCell>
                            <StyledTableCell>Shift Allowance Target</StyledTableCell>
                            <StyledTableCell>Night Shift Allowance</StyledTableCell>
                            <StyledTableCell>Final Salary</StyledTableCell>
                            <StyledTableCell>Final Salary-Penalty</StyledTableCell>
                            <StyledTableCell>Total Points Value</StyledTableCell>
                            <StyledTableCell>ERA</StyledTableCell>
                            <StyledTableCell>Actual ERA</StyledTableCell>
                            <StyledTableCell>PF Employer Deduction</StyledTableCell>
                            <StyledTableCell>ESI Employer Deduction</StyledTableCell>
                            <StyledTableCell>CTC</StyledTableCell>
                            <StyledTableCell>Revenue Allowance</StyledTableCell>
                            <StyledTableCell>Final Value</StyledTableCell>
                            <StyledTableCell>Final Value-Penalty</StyledTableCell>
                            <StyledTableCell>Shortage</StyledTableCell>
                            <StyledTableCell>Shortage 1</StyledTableCell>
                            <StyledTableCell>Actual Deduction</StyledTableCell>
                            <StyledTableCell>Minimum Deduction</StyledTableCell>
                            <StyledTableCell>Final Value Review</StyledTableCell>
                            <StyledTableCell>Final Value Status</StyledTableCell>
                            <StyledTableCell>Final Value Penalty Status</StyledTableCell>

                            {/* FIXED */}
                            <StyledTableCell>Fixed Loss Deduction</StyledTableCell>
                            <StyledTableCell>Fixed Net Salary</StyledTableCell>
                            <StyledTableCell>Fixed Basic</StyledTableCell>
                            <StyledTableCell>Fixed HRA</StyledTableCell>
                            <StyledTableCell>Fixed Conveyance</StyledTableCell>
                            <StyledTableCell>Fixed Medical Allowance</StyledTableCell>
                            <StyledTableCell>Fixed Production Allowance</StyledTableCell>
                            <StyledTableCell>Fixed Other Allowance</StyledTableCell>
                            <StyledTableCell>Fixed Net Salary1</StyledTableCell>
                            <StyledTableCell>PF Deduction</StyledTableCell>
                            <StyledTableCell>ESI Deduction</StyledTableCell>
                            <StyledTableCell>Fixed Emp Tax</StyledTableCell>
                            <StyledTableCell>Fixed PF Employer Deduction</StyledTableCell>
                            <StyledTableCell>Fixed ESI Employer Deduction</StyledTableCell>
                            <StyledTableCell>Fixed Shift Allowance</StyledTableCell>
                            <StyledTableCell>Fixed Total Deductions</StyledTableCell>
                            <StyledTableCell>Fixed Salary</StyledTableCell>
                            <StyledTableCell>Fixed Salary-Penalty</StyledTableCell>
                            <StyledTableCell>Fixed LOP</StyledTableCell>
                            <StyledTableCell>Fixed LOP Days</StyledTableCell>
                            <StyledTableCell>Fixed Leave Deduction</StyledTableCell>
                            <StyledTableCell>Fixed CTC</StyledTableCell>
                            <StyledTableCell>Fixed Final Value</StyledTableCell>
                            <StyledTableCell>Fixed Actual Deduction</StyledTableCell>
                            <StyledTableCell>Fixed Minimum Deduction</StyledTableCell>
                            {/* PRODUCTION */}
                            <StyledTableCell>PROD Loss Deduction</StyledTableCell>
                            <StyledTableCell>PROD Net Salary</StyledTableCell>
                            <StyledTableCell>PROD Basic</StyledTableCell>
                            <StyledTableCell>PROD HRA</StyledTableCell>
                            <StyledTableCell>PROD Conveyance</StyledTableCell>
                            <StyledTableCell>PROD Medical Allowance</StyledTableCell>
                            <StyledTableCell>PROD Production Allowance</StyledTableCell>
                            <StyledTableCell>PROD Other Allowance</StyledTableCell>
                            <StyledTableCell>PROD Net Salary1</StyledTableCell>
                            <StyledTableCell>PROD_Emp_pf</StyledTableCell>
                            <StyledTableCell>PROD_Emp_esi</StyledTableCell>
                            <StyledTableCell>PROD Emp Tax</StyledTableCell>
                            <StyledTableCell>PROD_Emp_ptax</StyledTableCell>
                            <StyledTableCell>PROD_Empr_pf</StyledTableCell>
                            <StyledTableCell>PROD_Empr_Esi</StyledTableCell>
                            <StyledTableCell>PROD Shift Allowance</StyledTableCell>
                            <StyledTableCell>PROD Total Deductions</StyledTableCell>
                            <StyledTableCell>PROD Salary</StyledTableCell>
                            <StyledTableCell>PROD Salary-Penalty</StyledTableCell>
                            <StyledTableCell>PROD LOP Days</StyledTableCell>
                            <StyledTableCell>PROD LOP </StyledTableCell>
                            <StyledTableCell>PROD Leave Deduction</StyledTableCell>
                            <StyledTableCell>PROD CTC</StyledTableCell>
                            <StyledTableCell>PROD Final Value</StyledTableCell>
                            <StyledTableCell>PROD Actual Deduction</StyledTableCell>
                            <StyledTableCell>PROD Minimum Deduction</StyledTableCell>



                            <StyledTableCell>Current Month Avg</StyledTableCell>
                            <StyledTableCell>Current Month Attendance</StyledTableCell>
                            <StyledTableCell>Paid Status</StyledTableCell>

                            <StyledTableCell>Salary Type</StyledTableCell>
                            <StyledTableCell>Deduction Type</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.department}</StyledTableCell>
                                    <StyledTableCell>{row.company}</StyledTableCell>
                                    <StyledTableCell>{row.branch}</StyledTableCell>
                                    <StyledTableCell>{row.unit}</StyledTableCell>
                                    <StyledTableCell>{row.team}</StyledTableCell>
                                    <StyledTableCell>{row.designation}</StyledTableCell>
                                    <StyledTableCell>{row.employeename}</StyledTableCell>
                                    <StyledTableCell>{row.aadharname}</StyledTableCell>
                                    <StyledTableCell>{row.processcode}</StyledTableCell>
                                    <StyledTableCell>{row.doj}</StyledTableCell>
                                    <StyledTableCell>{row.experienceinmonth}</StyledTableCell>
                                    <StyledTableCell>{row.prodexp}</StyledTableCell>
                                    <StyledTableCell>{row.totalnumberofdays}</StyledTableCell>
                                    <StyledTableCell>{row.totalshift}</StyledTableCell>
                                    <StyledTableCell>{row.clsl}</StyledTableCell>
                                    <StyledTableCell>{row.weekoff}</StyledTableCell>
                                    <StyledTableCell>{row.holiday}</StyledTableCell>
                                    <StyledTableCell>{row.totalasbleave}</StyledTableCell>
                                    <StyledTableCell>{row.totalpaidDays}</StyledTableCell>

                                    <StyledTableCell>{row.oldgross}</StyledTableCell>
                                    <StyledTableCell>{row.oldbasic}</StyledTableCell>
                                    <StyledTableCell>{row.oldhra}</StyledTableCell>
                                    <StyledTableCell>{row.oldconveyance}</StyledTableCell>
                                    <StyledTableCell>{row.oldmedicalallowance}</StyledTableCell>
                                    <StyledTableCell>{row.oldproductionallowance}</StyledTableCell>
                                    <StyledTableCell>{row.oldproductionallowancetwo}</StyledTableCell>
                                    <StyledTableCell>{row.oldotherallowance}</StyledTableCell>

                                    <StyledTableCell>{row.newgross}</StyledTableCell>
                                    <StyledTableCell>{row.actualbasic}</StyledTableCell>
                                    <StyledTableCell>{row.actualhra}</StyledTableCell>
                                    <StyledTableCell>{row.actualconveyance}</StyledTableCell>
                                    <StyledTableCell>{row.actualmedicalallowance}</StyledTableCell>
                                    <StyledTableCell>{row.actualproductionallowance}</StyledTableCell>
                                    <StyledTableCell>{row.actualproductionallowancetwo}</StyledTableCell>
                                    <StyledTableCell>{row.actualotherallowance}</StyledTableCell>
                                    <StyledTableCell>{row.targetpoints}</StyledTableCell>
                                    <StyledTableCell>{row.achievedpoints}</StyledTableCell>
                                    <StyledTableCell>{row.achieved}</StyledTableCell>
                                    <StyledTableCell>{row.achievedproductionallowance}</StyledTableCell>
                                    <StyledTableCell>{row.actualnetsalary}</StyledTableCell>
                                    <StyledTableCell>{row.lopbasic}</StyledTableCell>
                                    <StyledTableCell>{row.lophra}</StyledTableCell>
                                    <StyledTableCell>{row.lopconveyance}</StyledTableCell>
                                    <StyledTableCell>{row.lopmedicalallowance}</StyledTableCell>
                                    <StyledTableCell>{row.lopproductionallowance}</StyledTableCell>
                                    <StyledTableCell>{row.lopotherallowance}</StyledTableCell>
                                    <StyledTableCell>{row.lopnetsalary}</StyledTableCell>
                                    <StyledTableCell>{row.prodbasic}</StyledTableCell>
                                    <StyledTableCell>{row.prodhra}</StyledTableCell>
                                    <StyledTableCell>{row.prodconveyance}</StyledTableCell>
                                    <StyledTableCell>{row.prodmedicalallowance}</StyledTableCell>
                                    <StyledTableCell>{row.prodproductionallowance}</StyledTableCell>
                                    <StyledTableCell>{row.prodotherallowance}</StyledTableCell>
                                    <StyledTableCell>{row.attendancelop}</StyledTableCell>
                                    <StyledTableCell>{row.calculatednetsalary}</StyledTableCell>
                                    <StyledTableCell>{row.actualpenaltyamount}</StyledTableCell>
                                    <StyledTableCell>{row.penaltyamount}</StyledTableCell>
                                    <StyledTableCell>{row.lossdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.otherdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.finalbasic}</StyledTableCell>
                                    <StyledTableCell>{row.finalhra}</StyledTableCell>
                                    <StyledTableCell>{row.finalconveyance}</StyledTableCell>
                                    <StyledTableCell>{row.finalmedicalallowance}</StyledTableCell>
                                    <StyledTableCell>{row.finalproductionallowance}</StyledTableCell>
                                    <StyledTableCell>{row.finalotherallowance}</StyledTableCell>
                                    <StyledTableCell>{row.finalnetsalary}</StyledTableCell>
                                    <StyledTableCell>{row.pfdays}</StyledTableCell>
                                    <StyledTableCell>{row.ncpdays}</StyledTableCell>
                                    <StyledTableCell>{row.pfdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.esideduction}</StyledTableCell>
                                    <StyledTableCell>{row.finallopdays}</StyledTableCell>
                                    <StyledTableCell>{row.paysliplop}</StyledTableCell>
                                    <StyledTableCell>{row.finalleavededuction}</StyledTableCell>
                                    <StyledTableCell>{row.professionaltax}</StyledTableCell>
                                    <StyledTableCell>{row.totaldeductions}</StyledTableCell>
                                    <StyledTableCell>{row.uan}</StyledTableCell>
                                    <StyledTableCell>{row.ipname}</StyledTableCell>
                                    <StyledTableCell>{row.noallowanceshift}</StyledTableCell>
                                    <StyledTableCell>{row.shiftallowancepoint}</StyledTableCell>
                                    <StyledTableCell>{row.shiftallowancetarget}</StyledTableCell>
                                    <StyledTableCell>{row.nightshiftallowance}</StyledTableCell>
                                    <StyledTableCell>{row.finalsalary}</StyledTableCell>
                                    <StyledTableCell>{row.finalsalarypenalty}</StyledTableCell>
                                    <StyledTableCell>{row.totalpointsvalue}</StyledTableCell>
                                    <StyledTableCell>{row.era}</StyledTableCell>
                                    <StyledTableCell>{row.actualera}</StyledTableCell>
                                    <StyledTableCell>{row.pfemployerdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.esiemployerdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.ctc}</StyledTableCell>
                                    <StyledTableCell>{row.revenueallowance}</StyledTableCell>
                                    <StyledTableCell>{row.finalvalue}</StyledTableCell>
                                    <StyledTableCell>{row.finalvaluepenalty}</StyledTableCell>
                                    <StyledTableCell>{row.shortage}</StyledTableCell>
                                    <StyledTableCell>{row.shortageone}</StyledTableCell>
                                    <StyledTableCell>{row.actualdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.minimumdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.finalvaluereview}</StyledTableCell>
                                    <StyledTableCell>{row.finalvaluestatus}</StyledTableCell>
                                    <StyledTableCell>{row.finalvaluepenaltystatus}</StyledTableCell>
                                    {/* FIXED */}
                                    <StyledTableCell>{row.fixedlossdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.fixednetsalary}</StyledTableCell>
                                    <StyledTableCell>{row.fixedbasic}</StyledTableCell>
                                    <StyledTableCell>{row.fixedhra}</StyledTableCell>
                                    <StyledTableCell>{row.fixedconveyance}</StyledTableCell>
                                    <StyledTableCell>{row.fixedmedicalallowance}</StyledTableCell>
                                    <StyledTableCell>{row.fixedproductionallowance}</StyledTableCell>
                                    <StyledTableCell>{row.fixedotherallowance}</StyledTableCell>
                                    <StyledTableCell>{row.fixednetsalaryone}</StyledTableCell>
                                    <StyledTableCell>{row.fixedemppf}</StyledTableCell>
                                    <StyledTableCell>{row.fixedempesi}</StyledTableCell>
                                    <StyledTableCell>{row.fixedempptax}</StyledTableCell>
                                    <StyledTableCell>{row.fixedemprpf}</StyledTableCell>
                                    <StyledTableCell>{row.fixedempresi}</StyledTableCell>
                                    <StyledTableCell>{row.fixedshiftallowance}</StyledTableCell>
                                    <StyledTableCell>{row.fixedtotaldeductions}</StyledTableCell>
                                    <StyledTableCell>{row.fixedsalary}</StyledTableCell>
                                    <StyledTableCell>{row.fixedsalarypenalty}</StyledTableCell>
                                    <StyledTableCell>{row.fixedlop}</StyledTableCell>
                                    <StyledTableCell>{row.fixedlopdays}</StyledTableCell>
                                    <StyledTableCell>{row.fixedleavededuction}</StyledTableCell>
                                    <StyledTableCell>{row.fixedctc}</StyledTableCell>
                                    <StyledTableCell>{row.fixedfinalvalue}</StyledTableCell>
                                    <StyledTableCell>{row.fixedfinalvaluepenalty}</StyledTableCell>
                                    <StyledTableCell>{row.fixedactualdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.fixedminimumdeduction}</StyledTableCell>

                                    {/* PRODUCTION */}
                                    <StyledTableCell>{row.prodlossdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.prodnetsalary}</StyledTableCell>
                                    <StyledTableCell>{row.prodbasicp}</StyledTableCell>
                                    <StyledTableCell>{row.prodhrap}</StyledTableCell>
                                    <StyledTableCell>{row.prodconveyancep}</StyledTableCell>
                                    <StyledTableCell>{row.prodmedicalallowancep}</StyledTableCell>
                                    <StyledTableCell>{row.prodproductionallowancep}</StyledTableCell>
                                    <StyledTableCell>{row.prodotherallowancep}</StyledTableCell>
                                    <StyledTableCell>{row.prodnetsalaryonep}</StyledTableCell>
                                    <StyledTableCell>{row.prodemppf}</StyledTableCell>
                                    <StyledTableCell>{row.prodempesi}</StyledTableCell>
                                    <StyledTableCell>{row.prodempptax}</StyledTableCell>
                                    <StyledTableCell>{row.prodemprpf}</StyledTableCell>
                                    <StyledTableCell>{row.prodempresi}</StyledTableCell>
                                    <StyledTableCell>{row.prodshiftallowance}</StyledTableCell>
                                    <StyledTableCell>{row.prodtotaldeductions}</StyledTableCell>
                                    <StyledTableCell>{row.prodsalary}</StyledTableCell>
                                    <StyledTableCell>{row.prodsalarypenalty}</StyledTableCell>
                                    <StyledTableCell>{row.prodlopdays}</StyledTableCell>
                                    <StyledTableCell>{row.fixedlopdays}</StyledTableCell>
                                    <StyledTableCell>{row.prodlop}</StyledTableCell>
                                    <StyledTableCell>{row.prodleavededuction}</StyledTableCell>
                                    <StyledTableCell>{row.prodctc}</StyledTableCell>
                                    <StyledTableCell>{row.prodfinalvalue}</StyledTableCell>
                                    <StyledTableCell>{row.prodactualdeduction}</StyledTableCell>
                                    <StyledTableCell>{row.prodminimumdeduction}</StyledTableCell>

                                    <StyledTableCell>{row.currentmonthavg}</StyledTableCell>
                                    <StyledTableCell>{row.currentmonthattendance}</StyledTableCell>
                                    <StyledTableCell>{row.paidstatus}</StyledTableCell>

                                    <StyledTableCell>{row.salarytype}</StyledTableCell>
                                    <StyledTableCell>{row.deductiontype}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box >
    );
}

export default Losspayrun;
