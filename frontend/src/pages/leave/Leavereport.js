import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent,
    DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../components/Export";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import { handleApiError } from "../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../context/Appcontext";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
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
import { MultiSelect } from "react-multi-select-component";

function LeaveReportList() {

    const currentDateAttStatus = new Date();
    const currentYearAttStatus = currentDateAttStatus.getFullYear();

    // get current month in string name
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthObject = { label: monthstring[currentMonthIndex], value: currentMonthIndex + 1 };
    const currentYearObject = { label: currentYearAttStatus, value: currentYearAttStatus };
    const years = Array.from(new Array(10), (val, index) => currentYearAttStatus + index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

    const gridRef = useRef(null);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [companyOption, setCompanyOption] = useState([]);
    const [branchOption, setBranchOption] = useState([]);
    const [unitOption, setUnitOption] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [leaveTypeOption, setLeaveTypeOption] = useState([]);
    const [leavecriterias, setLeavecriterias] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const [filterUser, setFilterUser] = useState({ company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select Unit", employee: 'Please Select Employee', leavetype: "Please Select Leave Type", });
    const [isMonthyear, setIsMonthYear] = useState({ ismonth: currentMonthObject, isyear: currentYearObject });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
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
        employeeid: true,
        employeename: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        leavetype: true,
        eligible: true,
        startsfrom: true,
        pendingleave: true,
        currentmonthcount: true,
        availabledays: true,
        appliedleave: true,
        approvedleave: true,
        rejectedleave: true,
        balancecount: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    //get all comnpany.
    const fetchCompanyAll = async () => {
        try {
            let res_location = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setCompanyOption([
                ...res_location?.data?.companies?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //get all branches.
    const fetchBranchAll = async () => {
        try {
            let res_location = await axios.get(SERVICE.BRANCH, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
            });
            setBranchOption([
                ...res_location?.data?.branch?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //function to fetch unit
    const fetchUnitAll = async () => {
        try {
            let res_unit = await axios.get(`${SERVICE.UNIT}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setUnitOption([
                ...res_unit?.data?.units?.map((t) => ({
                    ...t,
                    label: t.name,
                    value: t.name,
                })),
            ]);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchEmployee = async () => {
        try {
            let res_emp = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setEmployeeOptions([
                ...res_emp?.data?.users?.map((t) => ({
                    ...t,
                    label: t.companyname,
                    value: t.companyname,
                })),
            ]);

       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //company multiselect
    const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
    let [valueCompanyCat, setValueCompanyCat] = useState([]);

    const handleCompanyChange = (options) => {
        setValueCompanyCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCompany(options);
        setValueBranchCat([]);
        setSelectedOptionsBranch([]);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
        return valueCompanyCat?.length
            ? valueCompanyCat.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect
    const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
    let [valueBranchCat, setValueBranchCat] = useState([]);

    const handleBranchChange = (options) => {
        setValueBranchCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBranch(options);
        setValueUnitCat([]);
        setSelectedOptionsUnit([]);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererBranch = (valueBranchCat, _categoryname) => {
        return valueBranchCat?.length
            ? valueBranchCat.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };


    //unit multiselect
    const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
    let [valueUnitCat, setValueUnitCat] = useState([]);


    const handleUnitChange = (options) => {
        setValueUnitCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsUnit(options);
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([]);
    };

    const customValueRendererUnit = (valueUnitCat, _categoryname) => {
        return valueUnitCat?.length
            ? valueUnitCat.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //employee multiselect
    const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
    let [valueEmployeeCat, setValueEmployeeCat] = useState([]);

    const handleEmployeeChange = (options) => {
        setValueEmployeeCat(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsEmployee(options);
    };

    const customValueRendererEmployee = (valueEmployeeCat, _categoryname) => {
        return valueEmployeeCat?.length
            ? valueEmployeeCat.map(({ label }) => label)?.join(", ")
            : "Please Select Employee";
    };

    useEffect(() => {
        fetchCompanyAll();
        fetchBranchAll();
        fetchUnitAll();
        fetchEmployee();
    }, [selectedOptionsCompany]);

    //get all leave types.
    const fetchLeaveTypesAll = async () => {
        try {
            let res = await axios.get(SERVICE.LEAVETYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeaveTypeOption([
                ...res?.data?.leavetype
                    ?.map((t) => ({
                        ...t,
                        label: t.leavetype,
                        value: t.leavetype,
                    })),
            ]);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        fetchLeaveTypesAll();
    }, [])

    const fetchLeaveCriteria = async (user, empdoj, selectedYear, selectedMonth, departmentMonthSetDataPre, total, finalanswer, filteredData, leavetype, finalanswerApplied, finalanswerApproved, finalanswerRejected) => {
        user.leavetype = leavetype;
        let currentDate = new Date();
        let doj = new Date(empdoj);
        let monthsDiff = (selectedYear - doj.getFullYear()) * 12 + ((selectedMonth - 1) - doj.getMonth());
        let yearsDiff = selectedYear - doj.getFullYear();

        filteredData?.forEach((d) => {
            let comparedYear = d.pendingleave === true ? parseInt(d.pendingfromyear) : '';
            let comparedMonth = d.pendingleave === true ? d.pendingfrommonth : '';

            let previousYearData = departmentMonthSetDataPre?.filter((dep) => {
                if (Number(dep.year) === comparedYear) {
                    return dep;
                }
            });

            // check the experience month is completed or not
            let comparedMonthValue = ((`${d.experience} ${d.experiencein}` === '1 Month') ? 1 :
                (`${d.experience} ${d.experiencein}` === '2 Month') ? 2 :
                    (`${d.experience} ${d.experiencein}` === '3 Month') ? 3 :
                        (`${d.experience} ${d.experiencein}` === '4 Month') ? 4 :
                            (`${d.experience} ${d.experiencein}` === '5 Month') ? 5 :
                                (`${d.experience} ${d.experiencein}` === '6 Month') ? 6 :
                                    0);

            // Calculate the year difference
            let comparedYearValue = ((`${d.experience} ${d.experiencein}` === '1 Year') ? 1 :
                (`${d.experience} ${d.experiencein}` === '2 Year') ? 2 :
                    (`${d.experience} ${d.experiencein}` === '3 Year') ? 3 :
                        (`${d.experience} ${d.experiencein}` === '4 Year') ? 4 :
                            (`${d.experience} ${d.experiencein}` === '5 Year') ? 5 :
                                (`${d.experience} ${d.experiencein}` === '6 Year') ? 6 :
                                    0);

            let yearStartDate = total[0].fromdate;
            let yearEndDate = total[total.length - 1].todate;

            let lastYearStartDate = previousYearData.length > 0 ? previousYearData[0].fromdate : '';
            let lastYearEndDate = previousYearData.length > 0 ? previousYearData[previousYearData.length - 1].todate : '';

            // check auto increase
            if (d.leaveautocheck === true && d.leaveautodays === 'Month') {
                // Applicable From
                if (d.experiencein === 'Month' && monthsDiff < comparedMonthValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else if (d.experiencein === 'Year' && yearsDiff < comparedYearValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else {

                    // To get Previous year's leave count
                    let withinRangeCountLastYear = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');

                            const date = new Date(`${month}/${day}/${year}`);

                            // Convert yearStartDate and yearEndDate to Date objects if they're not already
                            const startDate = new Date(lastYearStartDate);
                            const endDate = new Date(lastYearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate) {
                                // Increment the counter if date is within the range
                                withinRangeCountLastYear++;
                            }
                        });
                    });

                    // findout previous month's all leave count
                    let withinRangeCount = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCount++;
                            }
                        });
                    });

                    let withinRangeCountPreviousReject = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Rejected") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousReject++;
                            }
                        });
                    });

                    let withinRangeCountPreviousApplied = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Applied") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousApplied++;
                            }
                        });
                    });

                    // findout current month's applied leave count
                    let withinRangeCountApplied = 0;
                    finalanswerApplied.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApplied++;
                            } else {
                            }
                        });
                    });

                    // findout current month's approve leave count
                    let withinRangeCountApproved = 0;
                    finalanswerApproved.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApproved++;
                            }
                        });
                    });

                    // findout current month's reject leave count
                    let withinRangeCountReject = 0;
                    finalanswerRejected.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountReject++;
                            }
                        });
                    });

                    const currentYear = selectedYear;
                    const currentMonth = selectedMonth - 1;

                    const doj = new Date(empdoj);
                    const dojYear = doj.getFullYear();
                    const dojMonth = doj.getMonth();
                    const dojDate = doj.getDate();

                    let totalAvailableDaysLastYear = 0;
                    const lastYear = selectedYear - 1;

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassedLastYear) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = (dojMonth + leaveAutoIncreaseLastYear);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            if (currentDate.getDate() > dojDate) {
                                totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            }
                        }
                    }
                    else {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                        else if (oneMonthPassedLastYear) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(dojMonth + leaveAutoIncreaseLastYear);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                    }

                    let finalleaveremovedtotaldays = totalAvailableDaysLastYear - withinRangeCountLastYear;

                    // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                    let totalAvailableDays = 0; // till the current month count
                    let currentMonthDays = 0 // per months count

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }

                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassed) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const pendingFromMonth = dojMonth + leaveAutoIncrease;

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }

                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }

                            // if (currentDate.getDate() > dojDate) {
                            //     currentMonthDays -= (currentDate.getDate() - dojDate);
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 2) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }
                        }
                        else if (oneMonthPassed) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(dojMonth + leaveAutoIncrease);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }

                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 3) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname + 1);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < selectedMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= selectedMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[selectedMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            // Calculate the month index to check if it's a valid month for counting leave
                            const monthIndexToCheck = (currentMonth + 1) % leaveAutoIncrease; // Adding 1 to currentMonth because months are 0-indexed

                            // Check if the current month is within the leaveautoincrease period
                            if (monthIndexToCheck === 0) {
                                // If the current month is a valid month within the leaveautoincrease period,
                                // count leave days for this month
                                currentMonthDays = numberofdays;
                            }
                        }

                    }

                    let remainingLeaveDays = totalAvailableDays;

                    // If pendingleave is true, add the remaining days from the previous year to the total available days
                    if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                        remainingLeaveDays += finalleaveremovedtotaldays;
                    } else {
                        remainingLeaveDays = totalAvailableDays;
                    }

                    let finalRemainingLeaveDays = remainingLeaveDays < 0 ? 0 : remainingLeaveDays;

                    // Update the user object with the correct available days
                    user.eligible = 'Yes';
                    user.startsfrom = monthsDiff < 12 ? `${monthstring[dojMonth + parseInt(d.leaveautoincrease)]}/${dojYear}` : `${total[0].monthname}/${total[0].year}`;
                    // user.pendingleave = (currentMonth === currentDate.getMonth()) ? ((finalRemainingLeaveDays - currentMonthDays) - withinRangeCount) : (finalRemainingLeaveDays - currentMonthDays);
                    user.pendingleave = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied));
                    user.currentmonthcount = currentMonthDays;
                    user.availabledays = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays;
                    user.appliedleave = withinRangeCountApplied;
                    user.approvedleave = withinRangeCountApproved;
                    user.rejectedleave = withinRangeCountReject;
                    user.balancecount = (((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays) - withinRangeCountApproved;

                }
            }
            else if (d.leaveautocheck === true && d.leaveautodays === 'Year') {
                // Applicable From
                if (d.experiencein === 'Month' && monthsDiff < comparedMonthValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else if (d.experiencein === 'Year' && yearsDiff < comparedYearValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else {

                    // To get Previous year's leave count
                    let withinRangeCountLastYear = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');

                            const date = new Date(`${month}/${day}/${year}`);

                            // Convert yearStartDate and yearEndDate to Date objects if they're not already
                            const startDate = new Date(lastYearStartDate);
                            const endDate = new Date(lastYearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate) {
                                // Increment the counter if date is within the range
                                withinRangeCountLastYear++;
                            }
                        });
                    });

                    // findout previous month's all leave count
                    let withinRangeCount = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCount++;
                            }
                        });
                    });

                    let withinRangeCountPreviousReject = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Rejected") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousReject++;
                            }
                        });
                    });

                    let withinRangeCountPreviousApplied = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Applied") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousApplied++;
                            }
                        });
                    });

                    // findout current month's applied leave count
                    let withinRangeCountApplied = 0;
                    finalanswerApplied.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApplied++;
                            } else {
                            }
                        });
                    });

                    // findout current month's approve leave count
                    let withinRangeCountApproved = 0;
                    finalanswerApproved.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApproved++;
                            }
                        });
                    });

                    // findout current month's reject leave count
                    let withinRangeCountReject = 0;
                    finalanswerRejected.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountReject++;
                            }
                        });
                    });

                    const currentYear = selectedYear;
                    const currentMonth = selectedMonth - 1;

                    const doj = new Date(empdoj);
                    const dojYear = doj.getFullYear();
                    const dojMonth = doj.getMonth();
                    const dojDate = doj.getDate();

                    let totalAvailableDaysLastYear = 0;
                    const lastYear = selectedYear - 1;

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassedLastYear) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = (dojMonth + leaveAutoIncreaseLastYear);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            if (currentDate.getDate() > dojDate) {
                                totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            }
                        }
                    }
                    else {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                        else if (oneMonthPassedLastYear) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(dojMonth + leaveAutoIncreaseLastYear);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                    }

                    let finalleaveremovedtotaldays = totalAvailableDaysLastYear - withinRangeCountLastYear;

                    // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                    let totalAvailableDays = 0; // till the current month count
                    let currentMonthDays = 0 // per months count

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }

                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassed) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const pendingFromMonth = (dojMonth + leaveAutoIncrease);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }
                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }

                            // if (currentDate.getDate() > dojDate) {
                            //     currentMonthDays -= (currentDate.getDate() - dojDate);
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 2) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }
                        }
                        else if (oneMonthPassed) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(dojMonth + leaveAutoIncrease);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }

                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 3) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = parseInt(d.numberofdays) / parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname + 1);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < selectedMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= selectedMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[selectedMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            // Calculate the month index to check if it's a valid month for counting leave
                            const monthIndexToCheck = (currentMonth + 1) % leaveAutoIncrease; // Adding 1 to currentMonth because months are 0-indexed

                            // Check if the current month is within the leaveautoincrease period
                            if (monthIndexToCheck === 0) {
                                // If the current month is a valid month within the leaveautoincrease period,
                                // count leave days for this month
                                currentMonthDays = numberofdays;
                            }
                        }

                    }

                    let remainingLeaveDays = totalAvailableDays;

                    // If pendingleave is true, add the remaining days from the previous year to the total available days
                    if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                        remainingLeaveDays += finalleaveremovedtotaldays;
                    } else {
                        remainingLeaveDays = totalAvailableDays;
                    }

                    let finalRemainingLeaveDays = remainingLeaveDays < 0 ? 0 : remainingLeaveDays;

                    // Update the user object with the correct available days
                    user.eligible = 'Yes';
                    user.startsfrom = monthsDiff < 12 ? `${monthstring[dojMonth + parseInt(d.leaveautoincrease)]}/${dojYear}` : `${total[0].monthname}/${total[0].year}`;
                    // user.pendingleave = (currentMonth === currentDate.getMonth()) ? ((finalRemainingLeaveDays - currentMonthDays) - withinRangeCount) : (finalRemainingLeaveDays - currentMonthDays);
                    user.pendingleave = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied));
                    user.currentmonthcount = currentMonthDays;
                    user.availabledays = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays;
                    user.appliedleave = withinRangeCountApplied;
                    user.approvedleave = withinRangeCountApproved;
                    user.rejectedleave = withinRangeCountReject;
                    user.balancecount = (((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays) - withinRangeCountApproved;

                }
            }
            else if (d.leaveautocheck === false && (d.leaveautodays === 'Month' || d.leaveautodays === 'Year')) {
                // Applicable From
                if (d.experiencein === 'Month' && monthsDiff < comparedMonthValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else if (d.experiencein === 'Year' && yearsDiff < comparedYearValue) {
                    user.availabledays = 0;
                    user.eligible = 'No';
                    user.startsfrom = '';
                    user.pendingleave = 0;
                    user.currentmonthcount = 0;
                    user.availabledays = 0;
                    user.appliedleave = 0;
                    user.approvedleave = 0;
                    user.rejectedleave = 0;
                    user.balancecount = 0;
                }
                else {

                    // To get Previous year's leave count
                    let withinRangeCountLastYear = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');

                            const date = new Date(`${month}/${day}/${year}`);

                            // Convert yearStartDate and yearEndDate to Date objects if they're not already
                            const startDate = new Date(lastYearStartDate);
                            const endDate = new Date(lastYearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate) {
                                // Increment the counter if date is within the range
                                withinRangeCountLastYear++;
                            }
                        });
                    });

                    // findout previous month's all leave count
                    let withinRangeCount = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCount++;
                            }
                        });
                    });

                    let withinRangeCountPreviousReject = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Rejected") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousReject++;
                            }
                        });
                    });

                    let withinRangeCountPreviousApplied = 0;
                    finalanswer.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const date = new Date(`${month}/${day}/${year}`);
                            const formattedMonth = String(parseInt(month, 10));
                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) < selectedMonth && leave.status === "Applied") {
                                // Increment the counter if date is within the range
                                withinRangeCountPreviousApplied++;
                            }
                        });
                    });

                    // findout current month's applied leave count
                    let withinRangeCountApplied = 0;
                    finalanswerApplied.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApplied++;
                            } else {
                            }
                        });
                    });

                    // findout current month's approve leave count
                    let withinRangeCountApproved = 0;
                    finalanswerApproved.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountApproved++;
                            }
                        });
                    });

                    // findout current month's reject leave count
                    let withinRangeCountReject = 0;
                    finalanswerRejected.forEach((leave) => {
                        leave.date.forEach((leaveDate) => {

                            const [day, month, year] = leaveDate.split('/');
                            const formattedMonth = String(parseInt(month, 10));
                            const date = new Date(`${month}/${day}/${year}`);

                            const startDate = new Date(yearStartDate);
                            const endDate = new Date(yearEndDate);

                            // Check if date is between startDate and endDate (inclusive)
                            if (date >= startDate && date <= endDate && parseInt(formattedMonth) === selectedMonth) {
                                // Increment the counter if date is within the range
                                withinRangeCountReject++;
                            }
                        });
                    });

                    const currentYear = selectedYear;
                    const currentMonth = selectedMonth - 1;

                    const doj = new Date(empdoj);
                    const dojYear = doj.getFullYear();
                    const dojMonth = doj.getMonth();
                    const dojDate = doj.getDate();

                    let totalAvailableDaysLastYear = 0;
                    const lastYear = selectedYear - 1;

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassedLastYear = lastYear > dojYear || (lastYear === dojYear && currentMonth > dojMonth) || (lastYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassedLastYear) {
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const pendingFromMonthLastYear = (dojMonth + leaveAutoIncreaseLastYear);

                            for (let i = pendingFromMonthLastYear; i <= currentMonth; i += leaveAutoIncreaseLastYear) {
                                totalAvailableDaysLastYear += numberofdaysLastYear;
                            }
                            if (currentDate.getDate() > dojDate) {
                                totalAvailableDaysLastYear -= (currentDate.getDate() - dojDate);
                            }
                        }
                    }
                    else {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(comparedMonth);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(lastYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                        else if (oneMonthPassedLastYear) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncreaseLastYear = parseInt(d.leaveautoincrease);
                            const numberofdaysLastYear = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDaysLastYear = [];
                            const pendingFromMonthLastYear = monthstring.indexOf(dojMonth + leaveAutoIncreaseLastYear);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonthLastYear; i < currentMonth; i += leaveAutoIncreaseLastYear) {
                                monthsToAddDaysLastYear.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDaysLastYear.forEach(month => {
                                const monthIndexLastYear = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndexLastYear !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndexLastYear <= currentMonth) {
                                        totalAvailableDaysLastYear += numberofdaysLastYear;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDaysLastYear.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonthLastYear = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonthLastYear = currentDate.getDate();
                                totalAvailableDaysLastYear -= daysPassedInCurrentMonthLastYear;
                                totalAvailableDaysLastYear += daysInCurrentMonthLastYear;
                            }
                        }
                    }

                    let finalleaveremovedtotaldays = totalAvailableDaysLastYear - withinRangeCountLastYear;

                    // current year's remianing days based on the d.leaveautoincrease and d.leaveautodays
                    let totalAvailableDays = 0; // till the current month count
                    let currentMonthDays = 0 // per months count

                    // Check if the user has completed one month from their date of joining
                    const oneMonthPassed = currentYear > dojYear || (currentYear === dojYear && currentMonth > dojMonth) || (currentYear === dojYear && currentMonth === dojMonth && currentDate.getDate() >= dojDate);

                    if (parseInt(d.leaveautoincrease) === 1) {
                        if (monthsDiff > 12) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }

                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }
                            // if (currentDate.getDate() > dojDate) {
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                        else if (oneMonthPassed) {
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const pendingFromMonth = (dojMonth + leaveAutoIncrease);

                            for (let i = pendingFromMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                totalAvailableDays += numberofdays;
                            }
                            for (let i = currentMonth; i <= currentMonth; i += leaveAutoIncrease) {
                                currentMonthDays += numberofdays;
                            }

                            // if (currentDate.getDate() > dojDate) {
                            //     currentMonthDays -= (currentDate.getDate() - dojDate);
                            //     totalAvailableDays -= (currentDate.getDate() - dojDate);
                            // }
                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 2) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }
                        }
                        else if (oneMonthPassed) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(dojMonth + leaveAutoIncrease);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < currentMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= currentMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[currentMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            const isCurrentMonthEven = currentMonth % parseInt(d.leaveautoincrease) !== 0; // Check if the current month is even (0-indexed)
                            if (isCurrentMonthEven) {
                                // If current month is even, count leave days
                                currentMonthDays = numberofdays;
                            }

                        }
                    }
                    else if (parseInt(d.leaveautoincrease) === 3) {
                        if (monthsDiff > 12) {
                            // Logic to calculate totalAvailableDays based on leaveautoincrease and numberofdays
                            const leaveAutoIncrease = parseInt(d.leaveautoincrease);
                            const numberofdays = d.leaveautodays === 'Year' ? (parseInt(d.numberofdays) / parseInt(d.numberofdays)) : parseInt(d.numberofdays);
                            const monthsToAddDays = [];
                            const pendingFromMonth = monthstring.indexOf(total[0].monthname + 1);

                            // Create an array of months based on leaveautoincrease
                            for (let i = pendingFromMonth; i < selectedMonth; i += leaveAutoIncrease) {
                                monthsToAddDays.push(monthstring[i]);
                            }

                            // Calculate totalAvailableDays by summing numberofdays for each month
                            monthsToAddDays.forEach(month => {
                                const monthIndex = monthstring.indexOf(month);
                                // Add numberofdays for the month
                                if (monthIndex !== -1) {
                                    // If the month is before the current month or is the current month, add numberofdays
                                    if (monthIndex <= selectedMonth) {
                                        totalAvailableDays += numberofdays;
                                    }
                                }
                            });

                            // Adjust totalAvailableDays if the current month is within the range of monthsToAddDays
                            if (monthsToAddDays.includes(monthstring[selectedMonth])) {
                                // Adjust based on the current day of the month
                                const daysInCurrentMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
                                const daysPassedInCurrentMonth = currentDate.getDate();
                                totalAvailableDays -= daysPassedInCurrentMonth;
                                totalAvailableDays += daysInCurrentMonth;
                            }

                            // Calculate the month index to check if it's a valid month for counting leave
                            const monthIndexToCheck = (currentMonth + 1) % leaveAutoIncrease; // Adding 1 to currentMonth because months are 0-indexed

                            // Check if the current month is within the leaveautoincrease period
                            if (monthIndexToCheck === 0) {
                                // If the current month is a valid month within the leaveautoincrease period,
                                // count leave days for this month
                                currentMonthDays = numberofdays;
                            }
                        }

                    }

                    let remainingLeaveDays = totalAvailableDays;

                    // If pendingleave is true, add the remaining days from the previous year to the total available days
                    if (d.pendingleave === true && monthsDiff > 12 && currentDate.getFullYear() > comparedYear) {
                        remainingLeaveDays += finalleaveremovedtotaldays;
                    } else {
                        remainingLeaveDays = totalAvailableDays;
                    }

                    let finalRemainingLeaveDays = remainingLeaveDays < 0 ? 0 : remainingLeaveDays;

                    // Update the user object with the correct available days
                    user.eligible = 'Yes';
                    user.startsfrom = monthsDiff < 12 ? `${monthstring[dojMonth + parseInt(d.leaveautoincrease)]}/${dojYear}` : `${total[0].monthname}/${total[0].year}`;
                    // user.pendingleave = (currentMonth === currentDate.getMonth()) ? ((finalRemainingLeaveDays - currentMonthDays) - withinRangeCount) : (finalRemainingLeaveDays - currentMonthDays);
                    user.pendingleave = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied));
                    user.currentmonthcount = currentMonthDays;
                    user.availabledays = ((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays;
                    user.appliedleave = withinRangeCountApplied;
                    user.approvedleave = withinRangeCountApproved;
                    user.rejectedleave = withinRangeCountReject;
                    user.balancecount = (((finalRemainingLeaveDays - (currentMonthDays + withinRangeCount)) + (withinRangeCountPreviousReject + withinRangeCountPreviousApplied)) + currentMonthDays) - withinRangeCountApproved;

                }
            }

        });

        // Return the updated user object
        return user;
    };

    const fetchUsers = async () => {
        setLoader(true);
        try {
            let res_emp = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let res_leavecriteria = await axios.get(SERVICE.LEAVECRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_vendor = await axios.get(SERVICE.APPLYLEAVE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let departmentMonthSetData = res_status.data.departmentdetails;
            let applyleaveData = res_vendor?.data?.applyleaves;
            let leavecriteriaData = res_leavecriteria?.data?.leavecriterias;
            const users = res_emp?.data?.users || [];

            let filteredResult = await Promise.all(users
                ?.filter(d => {
                    return (
                        valueCompanyCat.includes(d.company) &&
                        valueBranchCat.includes(d.branch) &&
                        valueUnitCat.includes(d.unit) &&
                        valueEmployeeCat.includes(d.companyname)
                    );
                })
                .map(async (d) => {
                    let total = departmentMonthSetData?.filter((dep) => {
                        if (dep.department === d.department && Number(dep.year) === isMonthyear.isyear.value) {
                            return dep;
                        }
                    });
                    let departmentMonthSetDataPre = departmentMonthSetData?.filter((dep) => {
                        if (dep.department === d.department) {
                            return dep;
                        }
                    });

                    let answer = applyleaveData.filter((data) => data.employeeid === d.empcode);
                    let finalanswer = answer.filter(anw => {
                        if (anw.employeeid === d.empcode && anw.leavetype === filterUser.leavetype) {
                            return anw.date;
                        }
                    });

                    let finalanswerApplied = answer.filter(anw => {
                        if (anw.employeeid === d.empcode && anw.leavetype === filterUser.leavetype && anw.status === 'Applied') {
                            return anw.date;
                        }
                    });

                    let finalanswerApproved = answer.filter(anw => {
                        if (anw.employeeid === d.empcode && anw.leavetype === filterUser.leavetype && anw.status === 'Approved') {
                            return anw.date;
                        }
                    });

                    let finalanswerRejected = answer.filter(anw => {
                        if (anw.employeeid === d.empcode && anw.leavetype === filterUser.leavetype && anw.status === 'Rejected') {
                            return anw.date;
                        }
                    });


                    let filteredData = leavecriteriaData?.filter((item) => {
                        if (item.mode === 'Employee' && item.employee?.includes(d.companyname) && item.leavetype === filterUser.leavetype) {
                            return item;
                        }
                        else if (item.mode === 'Department' && item.department?.includes(d.department) && item.leavetype === filterUser.leavetype) {
                            return item;
                        }
                        else if (item.mode === 'Designation' && item.designation?.includes(d.designation) && item.leavetype === filterUser.leavetype) {
                            return item;
                        }
                        // if ((item.employee?.includes(d.companyname) || item.department?.includes(d.department) || item.designation?.includes(d.designation)) && item.leavetype === filterUser.leavetype) {
                        //     return item;
                        // }
                    });

                    return await fetchLeaveCriteria(d, d.doj, isMonthyear.isyear.value, isMonthyear.ismonth.value, departmentMonthSetDataPre, total, finalanswer, filteredData, filterUser.leavetype, finalanswerApplied, finalanswerApproved, finalanswerRejected);
                }));

            // Update state with updated users
            setAllUsers(filteredResult);
            setLoader(false);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOptionsCompany.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Company"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsBranch.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsUnit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedOptionsEmployee.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (filterUser.leavetype === 'Please Select Leave Type') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Leave Type"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            setLoader(false);
            fetchUsers();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setFilterUser({ company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select Unit", employee: 'Please Select Employee', leavetype: "Please Select Leave Type", });
        setIsMonthYear({ ismonth: currentMonthObject, isyear: currentYearObject });
        setAllUsers([]);
        setValueCompanyCat([]);
        setSelectedOptionsCompany([])
        setValueBranchCat([]);
        setSelectedOptionsBranch([])
        setValueUnitCat([]);
        setSelectedOptionsUnit([])
        setValueEmployeeCat([]);
        setSelectedOptionsEmployee([])
        setBranchOption([])
        setUnitOption([])
        setEmployeeOptions([])
        setPage(1);
    };

    const addSerialNumber = async () => {
        const itemsWithSerialNumber = allUsers?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber,);
    }

    useEffect(() => {
        addSerialNumber();
    }, [allUsers]);

    // const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    //     <div>
    //         <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    //     </div>
    // );

    const columnDataTable = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox",
        //     headerStyle: {
        //         fontWeight: "bold", // Apply the font-weight style to make the header text bold
        //         // Add any other CSS styles as needed
        //     },
        //     renderHeader: (params) => (
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

        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={selectedRows.includes(params.row.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRows.includes(params.row.id)) {
        //                     updatedSelectedRows = selectedRows.filter(
        //                         (selectedId) => selectedId !== params.row.id
        //                     );
        //                 } else {
        //                     updatedSelectedRows = [...selectedRows, params.row.id];
        //                 }
        //                 setSelectedRows(updatedSelectedRows);
        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllChecked(
        //                     updatedSelectedRows.length === filteredData.length
        //                 );
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 80,
        //     hide: !columnVisibility.checkbox,
        //     headerClassName: "bold-header",
        // },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", },
        { field: "employeeid", headerName: "Emp Code", flex: 0, width: 130, hide: !columnVisibility.employeeid, headerClassName: "bold-header", },
        { field: "employeename", headerName: "Employee Name", flex: 0, width: 130, hide: !columnVisibility.employeename, headerClassName: "bold-header", },
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibility.company, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibility.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibility.unit, headerClassName: "bold-header", },
        { field: "team", headerName: "Team", flex: 0, width: 130, hide: !columnVisibility.team, headerClassName: "bold-header", },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibility.department, headerClassName: "bold-header", },
        { field: "leavetype", headerName: "Leave Type", flex: 0, width: 110, hide: !columnVisibility.leavetype, headerClassName: "bold-header", },
        { field: "eligible", headerName: "Eligible", flex: 0, width: 110, hide: !columnVisibility.eligible, headerClassName: "bold-header", },
        { field: "startsfrom", headerName: "Start Month/Year", flex: 0, width: 110, hide: !columnVisibility.startsfrom, headerClassName: "bold-header", },
        { field: "pendingleave", headerName: "Pending Count", flex: 0, width: 110, hide: !columnVisibility.pendingleave, headerClassName: "bold-header", },
        { field: "currentmonthcount", headerName: "Current Month Count", flex: 0, width: 110, hide: !columnVisibility.currentmonthcount, headerClassName: "bold-header", },
        { field: "availabledays", headerName: "Available Count", flex: 0, width: 110, hide: !columnVisibility.availabledays, headerClassName: "bold-header", },
        { field: "appliedleave", headerName: "Applied Leave", flex: 0, width: 110, hide: !columnVisibility.appliedleave, headerClassName: "bold-header", },
        { field: "approvedleave", headerName: "Approved Leave", flex: 0, width: 110, hide: !columnVisibility.approvedleave, headerClassName: "bold-header", },
        { field: "rejectedleave", headerName: "Rejected Leave", flex: 0, width: 110, hide: !columnVisibility.rejectedleave, headerClassName: "bold-header", },
        { field: "balancecount", headerName: "Balance Count", flex: 0, width: 150, hide: !columnVisibility.balancecount, headerClassName: "bold-header", },
    ];

    const rowDataTable = items?.flatMap((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            employeeid: item.empcode,
            employeename: item.companyname,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            leavetype: item.leavetype,
            eligible: item.eligible,
            startsfrom: item.startsfrom,
            currentmonthcount: item.currentmonthcount,
            pendingleave: item.pendingleave ? (item.pendingleave < 0 ? 0 : item.pendingleave) : 0,
            availabledays: item.availabledays ? (item.availabledays < 0 ? 0 : item.availabledays) : 0,
            appliedleave: item.appliedleave ? (item.appliedleave < 0 ? 0 : item.appliedleave) : 0,
            approvedleave: item.approvedleave ? (item.approvedleave < 0 ? 0 : item.approvedleave) : 0,
            rejectedleave: item.rejectedleave ? (item.rejectedleave < 0 ? 0 : item.rejectedleave) : 0,
            balancecount: item.balancecount ? (item.balancecount < 0 ? 0 : item.balancecount) : 0,
        }
    });

    // Datatable
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
    const fileName = 'Leave Report';
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
                    'Emp Code': t.employeeid,
                    'Employee Name': t.employeename,
                    'Company': t.company,
                    'Branch': t.branch,
                    'Unit': t.unit,
                    'Team': t.team,
                    'Department': t.department,
                    'Leave Type': t.leavetype,
                    'Eligible': t.eligible,
                    'Start Month/Year': t.startsfrom,
                    'Pending Count': t.pendingleave ? t.pendingleave : 0,
                    'Current Month Count': t.currentmonthcount ? t.currentmonthcount : 0,
                    'Available Count': t.availabledays ? t.availabledays : 0,
                    'Applied Leave': t.appliedleave ? t.appliedleave : 0,
                    'Approved Leave': t.approvedleave ? t.approvedleave : 0,
                    'Rejected Leave': t.rejectedleave ? t.rejectedleave : 0,
                    'Balance Count': t.balancecount ? t.balancecount : 0,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                allUsers.map((t, index) => ({
                    'S.No': index + 1,
                    'Emp Code': t.empcode,
                    'Employee Name': t.companyname,
                    'Company': t.company,
                    'Branch': t.branch,
                    'Unit': t.unit,
                    'Team': t.team,
                    'Department': t.department,
                    'Leave Type': t.leavetype,
                    'Eligible': t.eligible,
                    'Start Month/Year': t.startsfrom,
                    'Pending Count': t.pendingleave ? t.pendingleave : 0,
                    'Current Month Count': t.currentmonthcount ? t.currentmonthcount : 0,
                    'Available Count': t.availabledays ? t.availabledays : 0,
                    'Applied Leave': t.appliedleave ? t.appliedleave : 0,
                    'Approved Leave': t.approvedleave ? t.approvedleave : 0,
                    'Rejected Leave': t.rejectedleave ? t.rejectedleave : 0,
                    'Balance Count': t.balancecount ? t.balancecount : 0,
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
        documentTitle: "Leave Report",
        pageStyle: "print",
    });

    // PDF
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Emp Code", field: "employeeid" },
        { title: "Employee Name", field: "employeename" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Department", field: "department" },
        { title: 'Leave Type', field: "leavetype" },
        { title: 'Eligible', field: "eligible" },
        { title: 'Start Month/Year', field: "startsfrom" },
        { title: 'Pending Count', field: "pendingleave" },
        { title: 'Current Month Count', field: "currentmonthcount" },
        { title: 'Available Count', field: "availabledays" },
        { title: 'Applied Leave', field: "appliedleave" },
        { title: 'Approved Leave', field: "approvedleave" },
        { title: 'Rejected Leave', field: "rejectedleave" },
        { title: 'Balance Count', field: "balancecount" },
    ];

    //  pdf download functionality
    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();

        let finalItem = isfilter === "filtered" ?
            filteredData.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                pendingleave: item.pendingleave ? item.pendingleave : 0,
                availabledays: item.availabledays ? item.availabledays : 0,
                appliedleave: item.appliedleave ? item.appliedleave : 0,
                approvedleave: item.approvedleave ? item.approvedleave : 0,
                rejectedleave: item.rejectedleave ? item.rejectedleave : 0,
                balancecount: item.balancecount ? item.balancecount : 0,
            }))
            :
            allUsers.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                employeeid: item.empcode,
                employeename: item.companyname,
                pendingleave: item.pendingleave ? item.pendingleave : 0,
                availabledays: item.availabledays ? item.availabledays : 0,
                appliedleave: item.appliedleave ? item.appliedleave : 0,
                approvedleave: item.approvedleave ? item.approvedleave : 0,
                rejectedleave: item.rejectedleave ? item.rejectedleave : 0,
                balancecount: item.balancecount ? item.balancecount : 0,
            }));

        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 4, },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: finalItem,
        });
        doc.save("Leave Report.pdf");
    };

    // image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Leave Report.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"LEAVE REPORT"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Leave Report</Typography>
            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid container spacing={2}>
                        <>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={companyOption}
                                        value={selectedOptionsCompany}
                                        onChange={(e) => {
                                            handleCompanyChange(e);
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={branchOption
                                            ?.filter((u) => valueCompanyCat?.includes(u.company))
                                            .map((u) => ({
                                                ...u,
                                                label: u.name,
                                                value: u.name,
                                            }))}
                                        value={selectedOptionsBranch}
                                        onChange={(e) => {
                                            handleBranchChange(e);
                                        }}
                                        valueRenderer={customValueRendererBranch}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={unitOption
                                            ?.filter((u) => valueBranchCat?.includes(u.branch))
                                            .map((u) => ({
                                                ...u,
                                                label: u.name,
                                                value: u.name,
                                            }))}
                                        value={selectedOptionsUnit}
                                        onChange={(e) => {
                                            handleUnitChange(e);
                                        }}
                                        valueRenderer={customValueRendererUnit}
                                        labelledBy="Please Select Unit"
                                    />
                                </FormControl>
                            </Grid>
                            {/* <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Department <b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        styles={colourStyles}
                                        options={departments}
                                        value={{ label: filterUser.department, value: filterUser.department }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, department: e.value, });
                                        }}
                                    />
                                </FormControl>
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Employee Name<b style={{ color: "red" }}>*</b> </Typography>
                                    <MultiSelect
                                        options={employeeOptions
                                            ?.filter((u) => valueUnitCat?.includes(u.unit))
                                            .map((u) => ({
                                                ...u,
                                                label: u.companyname,
                                                value: u.companyname,
                                            }))}
                                        value={selectedOptionsEmployee}
                                        onChange={(e) => {
                                            handleEmployeeChange(e);
                                        }}
                                        valueRenderer={customValueRendererEmployee}
                                        labelledBy="Please Select Employee"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={6}>
                                <Typography>Leave Type<b style={{ color: 'red' }}>*</b> </Typography>
                                <FormControl fullWidth size="small">
                                    <Selects
                                        options={leaveTypeOption}
                                        value={{ label: filterUser.leavetype, value: filterUser.leavetype }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, leavetype: e.value, });
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Select Month</Typography>
                                    <Selects
                                        maxMenuHeight={200}
                                        styles={colourStyles}
                                        options={months}
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
                                <Typography sx={userStyle.importheadtext}> Leave Report </Typography>
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
                                        {isUserRoleCompare?.includes("excelleavereport") && (
                                            <>
                                                {/* <ExportXL csvData={filteredData?.map((t, index) => ({
                                                    'S.No': t.serialNumber,
                                                    'Emp Code': t.employeeid,
                                                    'Employee Name': t.employeename,
                                                    'Company': t.company,
                                                    'Branch': t.branch,
                                                    'Unit': t.unit,
                                                    'Team': t.team,
                                                    'Department': t.department,
                                                    'Leave Type': t.leavetype,
                                                    'Eligible': t.eligible,
                                                    'Start Month/Year': t.startsfrom,
                                                    'Pending Count': t.pendingleave ? t.pendingleave : 0,
                                                    'Current Month Count': t.currentmonthcount ? t.currentmonthcount : 0,
                                                    'Available Count': t.availabledays ? t.availabledays : 0,
                                                    'Applied Leave': t.appliedleave ? t.appliedleave : 0,
                                                    'Approved Leave': t.approvedleave ? t.approvedleave : 0,
                                                    'Rejected Leave': t.rejectedleave ? t.rejectedleave : 0,
                                                    'Balance Count': t.balancecount ? t.balancecount : 0,
                                                }))} fileName={"Leave Report"} /> */}
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    // fetchUsers()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvleavereport") && (
                                            <>
                                                {/* <ExportCSV csvData={filteredData?.map((t, index) => ({
                                                    'S.No': t.serialNumber,
                                                    'Emp Code': t.employeeid,
                                                    'Employee Name': t.employeename,
                                                    'Company': t.company,
                                                    'Branch': t.branch,
                                                    'Unit': t.unit,
                                                    'Team': t.team,
                                                    'Department': t.department,
                                                    'Leave Type': t.leavetype,
                                                    'Eligible': t.eligible,
                                                    'Start Month/Year': t.startsfrom,
                                                    'Pending Count': t.pendingleave ? (t.pendingleave < 0 ? 0 : t.pendingleave) : 0,
                                                    'Current Month Count': t.currentmonthcount ? (t.currentmonthcount < 0 ? 0 : t.currentmonthcount) : 0,
                                                    'Available Count': t.availabledays ? (t.availabledays < 0 ? 0 : t.availabledays) : 0,
                                                    'Applied Leave': t.appliedleave ? (t.appliedleave < 0 ? 0 : t.appliedleave) : 0,
                                                    'Approved Leave': t.approvedleave ? (t.approvedleave < 0 ? 0 : t.approvedleave) : 0,
                                                    'Rejected Leave': t.rejectedleave ? (t.rejectedleave < 0 ? 0 : t.rejectedleave) : 0,
                                                    'Balance Count': t.balancecount ? (t.balancecount < 0 ? 0 : t.balancecount) : 0,
                                                }))} fileName={"Leave Report"} /> */}
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    // fetchUsers()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printleavereport") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfleavereport") && (
                                            <>
                                                {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}  > <FaFilePdf /> &ensp;Export to PDF&ensp; </Button> */}
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                        // fetchUsers()
                                                    }}
                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageleavereport") && (
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
                            <TableCell>Leave Type</TableCell>
                            <TableCell>Eligible</TableCell>
                            <TableCell>Start Mmonth/Year</TableCell>
                            <TableCell>Pending Count</TableCell>
                            <TableCell>Current Month Count</TableCell>
                            <TableCell>Available Count</TableCell>
                            <TableCell>Applied Leave</TableCell>
                            <TableCell>Approved Leave</TableCell>
                            <TableCell>Rejected Leave</TableCell>
                            <TableCell>Balance Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredData &&
                            filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.serialNumber}</TableCell>
                                    <TableCell>{row.employeeid}</TableCell>
                                    <TableCell>{row.employeename}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.leavetype}</TableCell>
                                    <TableCell>{row.eligible}</TableCell>
                                    <TableCell>{row.startsfrom}</TableCell>
                                    <TableCell>{row.pendingleave ? (row.pendingleave < 0 ? 0 : row.pendingleave) : 0}</TableCell>
                                    <TableCell>{row.currentmonthcount ? (row.currentmonthcount < 0 ? 0 : row.currentmonthcount) : 0}</TableCell>
                                    <TableCell>{row.availabledays ? (row.availabledays < 0 ? 0 : row.availabledays) : 0}</TableCell>
                                    <TableCell>{row.appliedleave ? (row.appliedleave < 0 ? 0 : row.appliedleave) : 0}</TableCell>
                                    <TableCell>{row.approvedleave ? (row.approvedleave < 0 ? 0 : row.approvedleave) : 0}</TableCell>
                                    <TableCell>{row.rejectedleave ? (row.rejectedleave < 0 ? 0 : row.rejectedleave) : 0}</TableCell>
                                    <TableCell>{row.balancecount ? (row.balancecount < 0 ? 0 : row.balancecount) : 0}</TableCell>
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
                            fetchUsers()
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
        </Box >
    );
}

export default LeaveReportList;