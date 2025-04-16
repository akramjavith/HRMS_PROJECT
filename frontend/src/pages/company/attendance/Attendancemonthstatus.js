import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent,
    DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import StyledDataGrid from "../../../components/TableStyle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { MultiSelect } from "react-multi-select-component";
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
import Selects from "react-select";
import moment from 'moment';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function AttendanceMonthStatusList() {

    const currentDateAttStatus = new Date();
    const currentYearAttStatus = currentDateAttStatus.getFullYear();

    // get current month in string name
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthObject = { label: monthstring[currentMonthIndex], value: currentMonthIndex + 1 };
    const currentYearObject = { label: currentYearAttStatus, value: currentYearAttStatus };
    const years = Array.from(new Array(10), (val, index) => currentYearAttStatus - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

    const gridRef = useRef(null);
    const { isUserRoleCompare, isAssignBranch, alldepartment } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [branches, setBranches] = useState([]);
    const [units, setUnits] = useState([]);
    const [attStatus, setAttStatus] = useState([]);
    const [attModearr, setAttModearr] = useState([]);
    const [userShifts, setUserShifts] = useState([]);
    const [items, setItems] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const [filterUser, setFilterUser] = useState({ mode: "Please Select Mode" });
    const [isMonthyear, setIsMonthYear] = useState({ ismonth: currentMonthObject, isyear: currentYearObject });

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

    const modeOptions = [
        { label: 'Department', value: "Department" },
        { label: "Employee", value: "Employee" },
    ];

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const handleGetMonth = (e) => {
        const selectedMonthObject = months.find((d) => d.value === e);
        setIsMonthYear({ ...isMonthyear, ismonth: selectedMonthObject });
    }
    const handleGetYear = (e) => {
        const selectedYearObject = getyear.find((d) => d.value === e);
        setIsMonthYear({ ...isMonthyear, isyear: selectedYearObject });
    }

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        checkbox: true,
        serialNumber: true,
        empcode: true,
        username: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        totalnumberofdays: true,
        empshiftdays: true,
        totalcounttillcurrendate: true,
        shift: true,
        totalshift: true,
        clsl: true,
        totalpresentdays: true,
        weekoff: true,
        holiday: true,
        lopcount: true,
        totalabsentleave: true,
        totalpaiddays: true,
        paidpresentday: true,
        nostatuscount: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

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

    // const fetchBranch = async () => {
    //     try {
    //         let res = await axios.get(SERVICE.BRANCH, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         setBranches(res.data.branch);
    //     } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    // };

    // // get units
    // const fetchUnit = async () => {
    //     try {
    //         let res = await axios.get(SERVICE.UNIT, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         setUnits(res.data.units);
    //     } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    // };

    // useEffect(() => {
    //     fetchBranch();
    //     fetchUnit();
    // }, []);

    const [employees, setEmployees] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [valueCompany, setValueCompany] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [valueBranch, setValueBranch] = useState("");
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [valueUnit, setValueUnit] = useState("");
    const [selectedDep, setSelectedDep] = useState([]);
    const [valueDep, setValueDep] = useState("");
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [valueEmp, setValueEmp] = useState("");

    useEffect(() => {
        // Remove duplicates based on the 'company' field
        const uniqueIsAssignBranch = isAssignBranch.reduce((acc, current) => {
            const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
            if (!x) {
                acc.push(current);
            }
            return acc;
        }, []);

        const company = [...new Set(uniqueIsAssignBranch.map(data => data.company))].map((data) => ({
            label: data,
            value: data,
        }));
        setSelectedCompany(company);
        setValueCompany(
            company.map((a, index) => {
                return a.value;
            })
        );
        const branch = uniqueIsAssignBranch?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company)
        )?.map(data => ({
            label: data.branch,
            value: data.branch,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedBranch(branch);
        setValueBranch(
            branch.map((a, index) => {
                return a.value;
            })
        );
        const unit = uniqueIsAssignBranch?.filter(
            (val) =>
                company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch)
        )?.map(data => ({
            label: data.unit,
            value: data.unit,
        })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        })
        setSelectedUnit(unit);
        setValueUnit(
            unit.map((a, index) => {
                return a.value;
            })
        );
    }, [isAssignBranch])

    //company multiselect
    const handleCompanyChange = (options) => {
        setValueCompany(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedCompany(options);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit([]);
        setSelectedDep([]);
        setValueDep("");
        setSelectedEmp([]);
        setValueEmp("");
    };

    const customValueRendererCompany = (valueCompany, _categoryname) => {
        return valueCompany?.length
            ? valueCompany.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect dropdown changes
    const handleBranchChangeFrom = (options) => {
        setSelectedBranch(options);
        setValueBranch(options.map((a, index) => {
            return a.value
        }))
        setSelectedUnit([]);
        setValueUnit("");
        setSelectedDep([]);
        setValueDep("");
        setSelectedEmp([]);
        setValueEmp("");
    };
    const customValueRendererBranchFrom = (valueBranch, _employeename) => {
        return valueBranch.length
            ? valueBranch.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };

    //unit multiselect dropdown changes
    const handleUnitChangeFrom = (options) => {
        setSelectedUnit(options);
        setValueUnit(options.map((a, index) => {
            return a.value
        }))
        setSelectedDep([]);
        setValueDep("");
        setSelectedEmp([]);
        setValueEmp("");
    };
    const customValueRendererUnitFrom = (valueUnit, _employeename) => {
        return valueUnit.length
            ? valueUnit.map(({ label }) => label).join(", ")
            : "Please Select Unit";
    };

    //Department multiselect dropdown changes
    const handleDepChangeFrom = (options) => {
        setSelectedDep(options);
        setValueDep(options.map((a, index) => {
            return a.value;
        }))
        setSelectedEmp([]);
        setValueEmp("");
    };

    const customValueRendererDepFrom = (valueDep, _employeename) => {
        return valueDep.length
            ? valueDep.map(({ label }) => label).join(", ")
            : "Please Select Department";
    };

    const fetchEmployee = async () => {

        try {
            let res_emp = await axios.get(SERVICE.USER_X_EMPLOYEES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // let data_set = res_emp.data.users.filter((data) => {
            //     if (valueCompany.includes(data.company) && valueBranch.includes(data.branch) && valueUnit.includes(data.unit)) {
            //         // return value === data.department;
            //         return value.includes(data.department);
            //     }
            // });

            // const emps = [
            //     // { value: "ALL", label: "ALL" },

            //     ...data_set.map((d) => ({
            //         ...d,
            //         label: d.companyname,
            //         value: d.companyname,
            //     })),
            // ];

            // setEmployees(emps);
            setEmployees(res_emp.data.users);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchEmployee();
    }, [])

    // Employee multiselect
    const handleEmployeeChange = (options) => {
        setValueEmp(options.map(option => option.value))
        setSelectedEmp(options);
        // if (employees.length === options.length) {
        //     const filteredOptions = options.filter(option => option.value !== "ALL");
        //     setSelectedEmp(filteredOptions);
        //     setValueEmp(filteredOptions.map(option => option.value));
        // }
        // // Check if "ALL" is selected
        // else if (options.some(option => option.value === "ALL")) {
        //     // Set "ALL" as the only selected option
        //     setSelectedEmp([{ value: "ALL", label: "ALL" }]);
        //     setValueEmp(["ALL"]);
        // } else {
        //     // Filter out "ALL" if any other option is selected
        //     const filteredOptions = options.filter(option => option.value !== "ALL");
        //     setSelectedEmp(filteredOptions);
        //     setValueEmp(filteredOptions.map(option => option.value));
        // }
    };

    const customValueRendererEmp = (valueEmp, _employees) => {
        return valueEmp.length
            ? valueEmp.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

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

    const fetchUsersFilter = async () => {
        setLoader(true);
        try {
            // let res_usershift = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            //     company: [...valueCompany],
            //     branch: [...valueBranch],
            //     unit: [...valueUnit],
            //     department: [...valueDep],
            //     employee: [...valueEmp],
            //     ismonth: Number(isMonthyear.ismonth.value),
            //     isyear: Number(isMonthyear.isyear.value),
            // });

            let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Approved"),
            });

            let leaveresult = res_applyleave?.data?.applyleaves;

            let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: [...valueCompany],
                branch: [...valueBranch],
                unit: [...valueUnit],
                employee: [...valueEmp],
                department: [...valueDep]
            });

            console.log(res_emp?.data?.users.length, 'userResult')

            function splitArray(array, chunkSize) {
                const resultarr = [];
                for (let i = 0; i < array.length; i += chunkSize) {
                    const chunk = array.slice(i, i + chunkSize);
                    resultarr.push({
                        data: chunk,
                    });
                }
                return resultarr;
            }

            let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map(item => item.companyname))] : []
            const resultarr = splitArray(employeelistnames, 10);
            console.log(resultarr.length, 'resultarr')

            async function sendBatchRequest(batch) {
                try {

                    let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FOR_MONTH_LOP_CAL_FILTER, {
                        employee: batch.data,
                        ismonth: Number(isMonthyear.ismonth.value),
                        isyear: Number(isMonthyear.isyear.value),
                    }, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    })

                    const filteredBatch = res?.data?.finaluser?.filter(d => {
                        const [day, month, year] = d.rowformattedDate.split("/");
                        const formattedDate = new Date(`${year}-${month}-${day}`);
                        const reasonDate = new Date(d.reasondate);
                        const dojDate = new Date(d.doj);

                        if (d.reasondate && d.reasondate !== "") {
                            return (formattedDate <= reasonDate);
                        } else if (d.doj && d.doj !== "") {
                            return (formattedDate >= dojDate);
                        } else {
                            return d;
                        }
                    });

                    let filtered = valueDep.length > 0 ? (filteredBatch?.filter((data) => valueDep.includes(data.department))) : filteredBatch;

                    let countByEmpcodeClockin = {}; // Object to store count for each empcode
                    let countByEmpcodeClockout = {};

                    const result = filtered?.map((item, index) => {
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
                        const absentItems = filteredBatch?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

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
                        }
                    });
                    return result;

                } catch (err) {
                    console.error("Error in POST request for batch:", batch.data, err);
                }
            }

            async function getAllResults() {
                let allResults = [];
                for (let batch of resultarr) {
                    const finaldata = await sendBatchRequest(batch);
                    allResults = allResults.concat(finaldata);
                }

                return { allResults }; // Return both results as an object
            }

            getAllResults().then(async (results) => {
                console.log(results.length)
                const finalresult = [];

                results.allResults?.forEach(item => {

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

                        if (leaveOnDateApproved) {
                            finalresult[existingEntryIndex].leaveCount++;

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
                            weekoff: (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off' && item.clockin === '00:00:00' && item.clockout === '00:00:00') ? 1 : 0,
                            lopcount: item.lopcount,
                            paidpresentday: item.paidpresentday,
                            totalcounttillcurrendate: item.totalcounttillcurrendate,
                            totalshift: item.totalshift,
                            holidayCount: (item.clockinstatus === 'Holiday' && item.clockoutstatus === 'Holiday') ? 1 : 0,

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

                setUserShifts(finalresult?.map((item, index) => ({ ...item, serialNumber: index + 1, })));
                setLoader(false);
            }).catch(error => {
                setLoader(true);
                console.error('Error in getting all results:', error);
            });
        } catch (err) { setLoader(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    // const addSerialNumber = async () => {
    //     const itemsWithSerialNumber = userShifts?.map((item, index) => ({
    //         ...item,
    //         serialNumber: index + 1,
    //     }));
    //     setItems(itemsWithSerialNumber);
    // }

    // useEffect(() => {
    //     addSerialNumber();
    // }, [userShifts]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterUser.mode === 'Please Select Mode') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Mode"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedCompany.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedBranch.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedUnit.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (filterUser.mode === 'Department' && selectedDep.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (filterUser.mode === 'Employee' && selectedEmp.length === 0 && isMonthyear.ismonth.value === currentMonthIndex + 1 && isMonthyear.isyear.value === currentYearAttStatus) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            fetchUsersFilter();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setLoader(false);
        setFilterUser({ mode: "Please Select Mode", });
        // setBranches([]);
        // setUnits([]);
        setUserShifts([]);
        setSelectedCompany([]);
        setValueCompany([]);
        setSelectedBranch([]);
        setValueBranch("");
        setSelectedUnit([]);
        setValueUnit("");
        setSelectedEmp([]);
        setValueEmp("");
        setIsMonthYear({ ismonth: currentMonthObject, isyear: currentYearObject });
        setPage(1);

        // // Remove duplicates based on the 'company' field
        // const uniqueIsAssignBranch = isAssignBranch.reduce((acc, current) => {
        //     const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
        //     if (!x) {
        //         acc.push(current);
        //     }
        //     return acc;
        // }, []);

        // const company = [...new Set(uniqueIsAssignBranch.map(data => data.company))].map((data) => ({
        //     label: data,
        //     value: data,
        // }));
        // setSelectedCompany(company);
        // setValueCompany(
        //     company.map((a, index) => {
        //         return a.value;
        //     })
        // );
        // const branch = uniqueIsAssignBranch?.filter(
        //     (val) =>
        //         company?.map(comp => comp.value === val.company)
        // )?.map(data => ({
        //     label: data.branch,
        //     value: data.branch,
        // })).filter((item, index, self) => {
        //     return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        // })
        // setSelectedBranch(branch);
        // setValueBranch(
        //     branch.map((a, index) => {
        //         return a.value;
        //     })
        // );
        // const unit = uniqueIsAssignBranch?.filter(
        //     (val) =>
        //         company?.map(comp => comp.value === val.company) && branch?.map(comp => comp.value === val.branch)
        // )?.map(data => ({
        //     label: data.unit,
        //     value: data.unit,
        // })).filter((item, index, self) => {
        //     return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
        // })
        // setSelectedUnit(unit);
        // setValueUnit(
        //     unit.map((a, index) => {
        //         return a.value;
        //     })
        // );

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

    const columnDataTable = [

        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: "bold-header", },
        { field: "username", headerName: "Employee Name", flex: 0, width: 130, hide: !columnVisibility.username, headerClassName: "bold-header", },
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibility.company, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibility.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibility.unit, headerClassName: "bold-header", },
        { field: "team", headerName: "Team", flex: 0, width: 130, hide: !columnVisibility.team, headerClassName: "bold-header", },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibility.department, headerClassName: "bold-header", },
        { field: "totalnumberofdays", headerName: "Total No. Of Days", flex: 0, width: 110, hide: !columnVisibility.totalnumberofdays, headerClassName: "bold-header", },
        { field: "empshiftdays", headerName: "Employee Shift Days", flex: 0, width: 110, hide: !columnVisibility.empshiftdays, headerClassName: "bold-header", },
        { field: "totalcounttillcurrendate", headerName: "Till Current Date Count", flex: 0, width: 110, hide: !columnVisibility.totalcounttillcurrendate, headerClassName: "bold-header", },
        { field: "shift", headerName: "Till Current Shift", flex: 0, width: 150, hide: !columnVisibility.shift, headerClassName: "bold-header", },
        { field: "clsl", headerName: "C.L. / S.L.", flex: 0, width: 120, hide: !columnVisibility.clsl, headerClassName: "bold-header", },
        { field: "weekoff", headerName: "Week Off", flex: 0, width: 130, hide: !columnVisibility.weekoff, headerClassName: "bold-header", },
        { field: "holiday", headerName: "Holiday", flex: 0, width: 130, hide: !columnVisibility.holiday, headerClassName: "bold-header", },
        { field: "paidpresentday", headerName: "Total Present Shift", flex: 0, width: 130, hide: !columnVisibility.paidpresentday, headerClassName: "bold-header", },
        { field: "lopcount", headerName: "Total Absent / LOP", flex: 0, width: 120, hide: !columnVisibility.lopcount, headerClassName: "bold-header", },
        { field: "totalpaiddays", headerName: "Total Paid Shift", flex: 0, width: 130, hide: !columnVisibility.totalpaiddays, headerClassName: "bold-header", },
        { field: "nostatuscount", headerName: "Total No Status Shift", flex: 0, width: 130, hide: !columnVisibility.nostatuscount, headerClassName: "bold-header", },
    ];

    const rowDataTable = userShifts?.flatMap((item, index) => {
        return {
            id: item.id,
            userid: item.userid,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            username: item.username,
            empcode: item.empcode,
            totalnumberofdays: item.totalnumberofdays,
            empshiftdays: item.empshiftdays,
            totalcounttillcurrendate: item.totalcounttillcurrendate,
            shift: item.shift,
            totalshift: item.totalshift,
            clsl: item.leaveCount,
            weekoff: item.weekoff,
            holiday: item.holidayCount,
            paidpresentday: Number(item.paidpresentday) - (Number(item.weekoff) + Number(item.holidayCount) + Number(item.leaveCount)),
            lopcount: item.lopcount,
            totalpaiddays: Number(item.paidpresentday) > Number(item.shift) ? (Number(item.shift) - Number(item.lopcount)) : Number(item.paidpresentday),
            nostatuscount: item.nostatuscount
        }
    });

    // Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setPage(1);
    };

    // datatable....
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

    // Excel
    const fileName = "Attendance Month Status";
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
                    'S.No': index + 1,
                    'Emp Code': t.empcode,
                    'Employee Name': t.username,
                    'Company': t.company,
                    'Branch': t.branch,
                    'Unit': t.unit,
                    'Team': t.team,
                    'Department': t.department,
                    'Total No. of Days': t.totalnumberofdays,
                    'Employee Shift Days': t.empshiftdays,
                    'Till Current Date Count': t.totalcounttillcurrendate,
                    'Total Current Shift': t.shift,
                    'C.L. / S.L.': t.clsl,
                    'Week Off': t.weekoff,
                    'Holiday': t.holiday,
                    'Total Present Shift': t.paidpresentday,
                    'Total Absent / LOP': t.lopcount,
                    'Total Paid Shift': t.totalpaiddays,
                    'Total No Status Shift': t.nostatuscount
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                rowDataTable.map((t, index) => ({
                    'S.No': index + 1,
                    'Emp Code': t.empcode,
                    'Employee Name': t.username,
                    'Company': t.company,
                    'Branch': t.branch,
                    'Unit': t.unit,
                    'Team': t.team,
                    'Department': t.department,
                    'Total No. of Days': t.totalnumberofdays,
                    'Employee Shift Days': t.empshiftdays,
                    'Till Current Date Count': t.totalcounttillcurrendate,
                    'Total Current Shift': t.shift,
                    'C.L. / S.L.': t.clsl,
                    'Week Off': t.weekoff,
                    'Holiday': t.holiday,
                    'Total Present Shift': t.paidpresentday,
                    'Total Absent / LOP': t.lopcount,
                    'Total Paid Shift': t.totalpaiddays,
                    'Total No Status Shift': t.nostatuscount
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
        documentTitle: "Attendance Month Status",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Emp Code", field: "empcode" },
        { title: "Employee Name", field: "username" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Department", field: "department" },
        { title: 'Total No. of Days', field: "totalnumberofdays" },
        { title: 'Employee Shift Days', field: "empshiftdays" },
        { title: 'Till Current Date Count', field: "totalcounttillcurrendate" },
        { title: 'Till Current Shift', field: "shift" },
        { title: 'C.L. / S.L.', field: "clsl" },
        { title: 'Week Off', field: "weekoff" },
        { title: 'Holiday', field: "holiday" },
        { title: 'Total Present Shift', field: "paidpresentday" },
        { title: 'Total Absent / LOP', field: "lopcount" },
        { title: 'Total Paid Shift', field: "totalpaiddays" },
        { title: 'Total No Status Shift', field: "nostatuscount" },
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
            // columns: columnsWithSerial,
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("Attendance Month Status.pdf");
    };

    // image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Attendance Month Status.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"ATTENDANCE MONTH STATUS"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Attendance Month Status</Typography>
            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid container spacing={2}>
                        <>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Mode<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={modeOptions}
                                        styles={colourStyles}
                                        value={{ label: filterUser.mode, value: filterUser.mode }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, mode: e.value, });
                                            setSelectedDep([]);
                                            setValueDep([]);
                                            setSelectedEmp([]);
                                            setValueEmp([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                <FormControl size="small" fullWidth>
                                    {/* <Selects
                                        styles={colourStyles}
                                        options={isAssignBranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={{ label: filterUser.company, value: filterUser.company }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, company: e.value, branch: 'Please Select Branch', unit: 'Please Select Unit' });
                                            setSelectedBranch([]);
                                            setSelectedUnit([]);
                                            setValueBranch("");
                                            setValueUnit("");
                                        }}
                                    /> */}
                                    <MultiSelect
                                        options={isAssignBranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedCompany}
                                        onChange={(e) => {
                                            handleCompanyChange(e);
                                            setFilterUser({ ...filterUser, department: 'Please Select Department' });
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
                                    {/* <Selects
                                        styles={colourStyles}
                                        options={isAssignBranch?.filter(
                                            (comp) =>
                                                filterUser.company === comp.company
                                        )?.map(data => ({
                                            label: data.branch,
                                            value: data.branch,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={{ label: filterUser.branch, value: filterUser.branch }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, branch: e.value, unit: 'Please Select Unit' });

                                        }}
                                    /> */}
                                    <MultiSelect
                                        options={isAssignBranch?.filter(
                                            (comp) =>
                                                valueCompany?.includes(comp.company)
                                        )?.map(data => ({
                                            label: data.branch,
                                            value: data.branch,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedBranch}
                                        onChange={handleBranchChangeFrom}
                                        valueRenderer={customValueRendererBranchFrom}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Unit<b style={{ color: "red" }}>*</b> </Typography>
                                    {/* <Selects
                                        styles={colourStyles}
                                        options={isAssignBranch?.filter(
                                            (comp) =>
                                                filterUser.company === comp.company && filterUser.branch === comp.branch
                                        )?.map(data => ({
                                            label: data.unit,
                                            value: data.unit,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={{ label: filterUser.unit, value: filterUser.unit }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, unit: e.value, });
                                        }}
                                    /> */}
                                    <MultiSelect
                                        options={isAssignBranch?.filter(
                                            (comp) =>
                                                valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                        )?.map(data => ({
                                            label: data.unit,
                                            value: data.unit,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedUnit}
                                        onChange={handleUnitChangeFrom}
                                        valueRenderer={customValueRendererUnitFrom}
                                        labelledBy="Please Select Unit"
                                    />
                                </FormControl>
                            </Grid>
                            {filterUser.mode === 'Department' ?
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Department<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={alldepartment?.map(data => ({
                                                label: data.deptname,
                                                value: data.deptname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedDep}
                                            onChange={(e) => {
                                                handleDepChangeFrom(e);
                                            }}
                                            valueRenderer={customValueRendererDepFrom}
                                            labelledBy="Please Select Department"
                                        />
                                    </FormControl>
                                </Grid>
                                : null}
                            {filterUser.mode === 'Employee' ?
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            // options={employees}
                                            options={employees?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch) && valueUnit?.includes(comp.unit)
                                                // && valueDep?.includes(comp.department)
                                            )?.map(data => ({
                                                label: data.companyname,
                                                value: data.companyname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedEmp}
                                            onChange={(e) => {
                                                handleEmployeeChange(e);
                                            }}
                                            valueRenderer={customValueRendererEmp}
                                            labelledBy="Please Select Employee"
                                        />
                                    </FormControl>
                                </Grid>
                                : null}
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Select Month</Typography>
                                    <Selects
                                        maxMenuHeight={200}
                                        styles={colourStyles}
                                        options={(isMonthyear.isyear.value < new Date().getFullYear()) ? months : months.filter((d) => d.value <= currentMonthIndex + 1)}
                                        value={isMonthyear.ismonth}
                                        onChange={(e) => handleGetMonth(e.value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Select Year</Typography>
                                    <Selects
                                        maxMenuHeight={200}
                                        styles={colourStyles}
                                        options={getyear}
                                        value={isMonthyear.isyear}
                                        onChange={(e) => handleGetYear(e.value)}
                                    />
                                </FormControl>
                            </Grid>
                        </>
                    </Grid><br /><br /><br />
                    <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid item lg={1} md={2} sm={2} xs={12}>
                            <Button sx={userStyle.buttonadd} variant="contained" onClick={handleSubmit} > Filter </Button>
                        </Grid>
                        <Grid item lg={1} md={2} sm={2} xs={12}>
                            <Button sx={userStyle.btncancel} onClick={handleClear} > Clear </Button>
                        </Grid>
                    </Grid>
                </Box><br /><br />
                {/* ****** Table Start ****** */}
                {loader ?
                    <Box sx={userStyle.container}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box>
                    </Box> :
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}> Attendance Month Status </Typography>
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
                                            {/* <MenuItem value={rowDataTable?.length}> All </MenuItem> */}
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                                    <Box>
                                        {isUserRoleCompare?.includes("excelattendancemonthstatus") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvattendancemonthstatus") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printattendancemonthstatus") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfattendancemonthstatus") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}
                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageattendancemonthstatus") && (
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
                        </Box>
                    </>
                }
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
                            <TableCell>Total No. of Days</TableCell>
                            <TableCell>Employee Shift Days</TableCell>
                            <TableCell>Till Current Date Count</TableCell>
                            <TableCell>Total Current Shift</TableCell>
                            <TableCell>C.L. / S.L.</TableCell>
                            <TableCell>Week Off</TableCell>
                            <TableCell>Holiday</TableCell>
                            <TableCell>Total Present Shift</TableCell>
                            <TableCell>Total Absent / LOP</TableCell>
                            <TableCell>Total Paid Shift</TableCell>
                            <TableCell>Total No Status Shift</TableCell>
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
                                    <TableCell>{row.totalnumberofdays}</TableCell>
                                    <TableCell>{row.empshiftdays}</TableCell>
                                    <TableCell>{row.totalcounttillcurrendate}</TableCell>
                                    <TableCell>{row.shift}</TableCell>
                                    <TableCell>{row.clsl}</TableCell>
                                    <TableCell>{row.weekoff}</TableCell>
                                    <TableCell>{row.holiday}</TableCell>
                                    <TableCell>{row.paidpresentday}</TableCell>
                                    <TableCell>{row.lopcount}</TableCell>
                                    <TableCell>{row.totalpaiddays}</TableCell>
                                    <TableCell>{row.nostatuscount}</TableCell>
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

export default AttendanceMonthStatusList;