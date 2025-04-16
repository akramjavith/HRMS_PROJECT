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
import { ExportXL, ExportCSV } from "../../../components/Export";
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
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import moment from 'moment';
import PageHeading from "../../../components/PageHeading";

function ProductionDayShift() {
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
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [units, setUnits] = useState([]);
    const [departments, setDepartments] = useState([]);
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
        setPageName(!pageName)
        try {
            let res_vendor = await axios.get(SERVICE.GET_ALL_USER_EMPLOYEE, {
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


    const fetchCompany = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // Remove duplicates from companies
            let uniqueCompanies = Array.from(new Set(res_category?.data?.companies.map((t) => t.name)));
            setCompanies(uniqueCompanies.map((t) => ({
                label: t,
                value: t
            })));
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all Sub vendormasters.
    const fetchAttedanceStatus = async () => {
        setPageName(!pageName)
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
        setPageName(!pageName)
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
        fetchCompany();
        fetchAttedanceStatus();
        fetchAttMode();
    }, []);

    // get all assignBranches
    const fetchBranch = async (company) => {
        setPageName(!pageName)
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = []
            res_branch?.data?.branch.map(t => {
                if (company == t.company) {
                    arr.push(t.name)
                }
            })
            setBranches(arr.map((t) => ({
                label: t,
                value: t
            })));

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    // get units
    const fetchUnit = async (branch) => {
        setPageName(!pageName)
        try {
            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let arr = []
            res_unit.data.units.map(t => {
                if (branch == t.branch) {
                    arr.push(t.name)
                }
            })
            setUnits(arr.map((t) => ({
                label: t,
                value: t
            })));

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchDepartment = async () => {
        setPageName(!pageName)
        try {
            let res_dep = await axios.get(SERVICE.DEPARTMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            // Remove duplicates from departments
            let uniqueDepartments = Array.from(new Set(res_dep.data.departmentdetails?.map((t) => t.deptname)));
            setDepartments(uniqueDepartments.map((t) => ({
                label: t,
                value: t
            })));

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const getattendancestatus = (alldata) => {
        let result = attStatus.filter((data, index) => {
            return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
        })
        return result[0]?.name
    }

    const getAttModeAppliedThr = (rowdaystatus) => {
        let result = attModearr.filter((data, index) => {
            return data?.name === rowdaystatus
        })
        return result[0]?.appliedthrough
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

    const getAssignLeaveDayForLop = (rowlopday) => {
        if (rowlopday === 'YES - Double Day') {
            return '2'
        } else if (rowlopday === 'YES - Full Day') {
            return '1';
        } else if (rowlopday === 'YES - Half Day') {
            return '0.5'
        } else {
            return '0';
        }
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

        const accessbranch = isAssignBranch
            ? isAssignBranch.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit
            }))
            : [];

        setPageName(!pageName)
        try {
            setLoading(true)

            let res = await axios.post(SERVICE.USER_PRODUCTION_DAY_SHIFT_FILTER, {
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
                assignbranch: accessbranch

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

            let filtered = res?.data?.finaluser.filter(d => d.rowformattedDate != nextDateFormatted);
            let res_vendor = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let attendenceControlCriteria = res_vendor?.data?.attendancecontrolcriteria;


            let dayShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshifthourday) : 4;
            let dayShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshiftminday) : 0;
            let nightShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshifthournight) : 4;
            let nightShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshiftminnight) : 0;

            const itemsWithSerialNumber = filtered?.map((item, index) => {
                // Parse the date string (DD/MM/YYYY)
                const [day, month, year] = item.rowformattedDate?.split('/')?.map(Number);
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

                function convertToISODateTime(currentShift, nextShift) {

                    function padTime(time) {
                        let [hours, minutes] = time.split(':');
                        if (hours.length === 1) {
                            hours = '0' + hours;
                        }
                        return `${hours}:${minutes}`;
                    }
                    // Helper function to parse date and time from shift objects
                    function parseDateTime(shift) {
                        // console.log(shift)
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

                        const dateTimeString = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00.000Z`);
                        // let newTime = new Date(dateTimeString.getTime() - 4 * 60 * 60 * 1000);
                        let finalHrs = period === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                        let finalMin = period === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
                        let newTime = new Date(dateTimeString.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin * 60 * 1000)));

                        // console.log(newTime.toISOString());
                        return (newTime?.toISOString());
                    }

                    // Parse initial date and time from current shift
                    const initialDateTime = currentShift?.shifttiming === "Week Off" ? parseDateTime(nextShiftBefor) : parseDateTime(currentShift);

                    const initialEndDateTime = new Date(initialDateTime);
                    initialEndDateTime.setHours(initialEndDateTime.getHours() + 23);
                    initialEndDateTime.setMinutes(initialEndDateTime.getMinutes() + 59);


                    // Parse start time of the next shift
                    const nextShiftStartTime = nextShift.shifttiming === "Week Off" ? parseDateTime(currentShiftTwo) : parseDateTime(nextShift);
                    // If initial end time is greater than or equal to next shift start time, adjust it
                    if (new Date(initialEndDateTime) >= new Date(nextShiftStartTime)) {
                        initialEndDateTime.setTime(new Date(nextShiftStartTime).getTime() - 60000); // Set to 1 minute before next shift
                    }



                    // Convert to ISO 8601 format with 'Z' to indicate UTC
                    const isoString = initialEndDateTime.toISOString();
                    return isoString;
                }

                const currentShift = userShiftTimingsFrom;
                const currentShiftTwo = userShiftTimingsFromTwo;
                const nextShift = userShiftTimingsTo;
                const nextShiftBefor = userShiftTimingsBefore;

                const shiftEndTime = convertToISODateTime(currentShift, nextShift);

                function padTime(time) {
                    let [hours, minutes] = time.split(':');
                    if (hours.length === 1) {
                        hours = '0' + hours;
                    }
                    return `${hours}:${minutes}`;
                }
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
                    // let newTime = new Date(dateTimeString.getTime() - 4 * 60 * 60 * 1000);
                    let finalHrs = period === 'PM' ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                    let finalMin = period === 'PM' ? nightShiftBeforeMin : dayShiftBeforeMin;
                    let newTime = new Date(dateTimeString.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin * 60 * 1000)));

                    // console.log(newTime.toISOString());
                    return (newTime.toISOString());
                }
                // Parse initial date and time from current shift
                const shiftFromTime = parseFromDateTime(userShiftTimingsFrom);


                return {
                    ...item,
                    prodshift: `${shiftFromTime.split(".000Z")[0]}to${shiftEndTime.split("00.000Z")[0]}59`
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


    const handleGetMonth = (e) => {
        const selectedMonthObject = months.find((d) => d.value === e);
        setIsMonthYear({ ...isMonthyear, ismonth: selectedMonthObject });
    }
    const handleGetYear = (e) => {
        const selectedYearObject = getyear.find((d) => d.value === e);
        setIsMonthYear({ ...isMonthyear, isyear: selectedYearObject });
    }

    const addSerialNumber = async () => {
        const itemsWithSerialNumber = userShifts.map((item, index) => {
            const fromtodate = item.prodshift ? item.prodshift.split("to") : "";
            const fromdate = fromtodate ? fromtodate[0].split("T")[0] : "";
            const fromtime = fromtodate ? fromtodate[0].split("T")[1] : "";

            const enddate = fromtodate ? fromtodate[1].split("T")[0] : "";
            const endtime = fromtodate ? fromtodate[1].split("T")[1] : "";

            return {
                ...item,
                serialNumber: index + 1,

                prodstartdate: fromdate,
                prodstarttime: fromtime,
                prodenddate: enddate,
                prodendtime: endtime,

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
        // { field: "shiftmode", headerName: "Shift Mode", flex: 0, width: 110, hide: !columnVisibility.shiftmode, headerClassName: "bold-header", },
        { field: "shift", headerName: "Shift", flex: 0, width: 150, hide: !columnVisibility.shift, headerClassName: "bold-header", },
        // { field: "nextshift", headerName: "Production Shift", flex: 0, width: 150, hide: !columnVisibility.nextshift, headerClassName: "bold-header", },
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
    const fileName = "Production Day Shift";
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
        documentTitle: "Production Day Shift",
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
                    // item.shiftmode,
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
                    // item.shiftmode,
                    item.shift,
                    item.prodstartdate,
                    item.prodstarttime,
                    item.prodenddate,
                    item.prodendtime,

                ]
            })
        }
        // const columnStyles = {
        //     0: { cellWidth: 10 },
        //     1: { cellWidth: 30 },
        //     2: { cellWidth: 10 },
        //     3: { cellWidth: 30 },
        //     4: { cellWidth: 20 },
        //     5: { cellWidth: 15 },
        //     6: { cellWidth: 15 },
        //     7: { cellWidth: 15 },
        //     8: { cellWidth: 15 },
        //     9: { cellWidth: 30 },
        //     10: { cellWidth: 30 },

        // };

        // // Split data into chunks to fit on pages
        // const columnsPerSheet = 11; // Number of columns per sheet
        // const chunks = [];

        // for (let i = 0; i < headers.length; i += columnsPerSheet) {
        //     const chunkHeaders = headers.slice(i, i + columnsPerSheet);
        //     const chunkData = data.map(row => row.slice(i, i + columnsPerSheet + 1));

        //     chunks.push({ headers: chunkHeaders, data: chunkData });
        // }

        // chunks.forEach((chunk, index) => {
        //     if (index > 0) {
        //         doc.addPage({ orientation: "landscape" }); // Add a new landscape page for each chunk, except the first one
        //     }

        //     doc.autoTable({
        //         theme: "grid",
        //         styles: { fontSize: 8 },
        //         head: [chunk.headers],
        //         body: chunk.data,
        //         startY: 20, // Adjust startY to leave space for headers
        //         margin: { top: 20, left: 10, right: 10, bottom: 10 }, // Adjust margin as needed
        //         columnStyles: columnStyles,
        //     });
        // });

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

        doc.save("Production Day Shift.pdf");
    };

    // image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Production Day Shift.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"Production Day Shift"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}></Typography>
            <PageHeading
                title="Production Day Shift"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="Production Day Shift"
                subpagename=""
                subsubpagename=""
            />
            {/* {isUserRoleCompare?.includes("lproductiondayshift") && ( */}
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
                                        Employee Name <b style={{ color: "red" }}>*</b>
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
                                {/* <FormControl fullWidth size="small">
                                        <Typography>Select Month</Typography>
                                        <Selects
                                            maxMenuHeight={200}
                                            styles={colourStyles}
                                            options={months}
                                            value={isMonthyear.ismonth}
                                            onChange={(e) => handleGetMonth(e.value)}
                                        />
                                    </FormControl> */}
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
                                {/* <FormControl fullWidth size="small">
                                        <Typography> Select Year</Typography>
                                        <Selects
                                            maxMenuHeight={200}
                                            styles={colourStyles}
                                            options={getyear}
                                            value={isMonthyear.isyear}
                                            onChange={(e) => handleGetYear(e.value)}
                                        />
                                    </FormControl> */}
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
                            <Button sx={userStyle.buttonadd} variant="contained" onClick={handleSubmit} > Filter </Button>
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
                        <Typography sx={userStyle.importheadtext}> Production Day Shift </Typography>
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
                                {isUserRoleCompare?.includes("excelproductiondayshift") && (
                                    <>
                                        {/* <ExportXL csvData={filteredData?.map((t, index) => ({
                                                        'SNo': t.serialNumber,
                                                        'Emp Code': t.empcode,
                                                        'Employee Name': t.username,
                                                        'Company': t.company,
                                                        'Branch': t.branch,
                                                        'Unit': t.unit,
                                                        'Team': t.team,
                                                        'Department': t.department,
                                                        'Date': t.date,
                                                        'Shift': t.shift,
                                                        'ClockIn': t.clockin,
                                                        'ClockInStatus': t.clockinstatus,
                                                        'ClockOut': t.clockout,
                                                        'ClockOutStatus': t.clockoutstatus,
                                                        'Attendance': t.attendanceauto,
                                                        'Day Status': t.daystatus,
                                                        'Applied Through': t.appliedthrough,
                                                        'LOP Calculation': t.lopcalculation,
                                                        'Target': t.modetarget,
                                                        'Paid Present': t.paidpresent,
                                                        'LOP Day': t.lopday,
                                                        'Paid Present Day': t.paidpresentday,
                                                    }))} fileName={"Production Day Shift"} /> */}
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            // fetchUsersStatus()
                                            setFormat("xl")
                                        }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("csvproductiondayshift") && (
                                    <>
                                        {/* <ExportCSV csvData={filteredData?.map((t, index) => ({
                                                        'SNo': t.serialNumber,
                                                        'Emp Code': t.empcode,
                                                        'Employee Name': t.username,
                                                        'Company': t.company,
                                                        'Branch': t.branch,
                                                        'Unit': t.unit,
                                                        'Team': t.team,
                                                        'Department': t.department,
                                                        'Date': t.date,
                                                        'Shift': t.shift,
                                                        'ClockIn': t.clockin,
                                                        'ClockInStatus': t.clockinstatus,
                                                        'ClockOut': t.clockout,
                                                        'ClockOutStatus': t.clockoutstatus,
                                                        'Attendance': t.attendanceauto,
                                                        'Day Status': t.daystatus,
                                                        'Applied Through': t.appliedthrough,
                                                        'LOP Calculation': t.lopcalculation,
                                                        'Target': t.modetarget,
                                                        'Paid Present': t.paidpresent,
                                                        'LOP Day': t.lopday,
                                                        'Paid Present Day': t.paidpresentday,
                                                    }))} fileName={"Production Day Shift"} /> */}
                                        <Button onClick={(e) => {
                                            setIsFilterOpen(true)
                                            // fetchUsersStatus()
                                            setFormat("csv")
                                        }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("printproductiondayshift") && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("pdfproductiondayshift") && (
                                    <>
                                        {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}  > <FaFilePdf /> &ensp;Export to PDF&ensp; </Button> */}
                                        <Button sx={userStyle.buttongrp}
                                            onClick={() => {
                                                setIsPdfFilterOpen(true)
                                                // fetchUsersStatus()
                                            }}
                                        ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                    </>
                                )}
                                {isUserRoleCompare?.includes("imageproductiondayshift") && (
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
            {/* )} */}
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
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
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

export default ProductionDayShift;