import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaSearch, FaPrint, FaFilePdf } from 'react-icons/fa';
import { MultiSelect } from "react-multi-select-component";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, InputAdornment, DialogActions, FormControl, Grid, Button, List, ListItem, ListItemText, Popover, TextField, IconButton, Tooltip, Chip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import Selects from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
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
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import moment from 'moment';
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ExportData from "../../../components/ExportData";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import AdvancedSearchBar from '../../../components/SearchbarEbList.js';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function AttendanceShortTimeListTable() {

    const [loading, setLoading] = useState(false)
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const gridRefTableAttDay = useRef(null);
    const gridRefImageAttDay = useRef(null);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, allUsersLimit, alldepartment, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [userShifts, setUserShifts] = useState([]);
    const [items, setItems] = useState([]);
    const [showAlert, setShowAlert] = useState();

    const [filterUser, setFilterUser] = useState({ filtertype: "Individual", fromdate: today, todate: today, });

    const [selectedCompany, setSelectedCompany] = useState([]);
    const [valueCompany, setValueCompany] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [valueBranch, setValueBranch] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [valueUnit, setValueUnit] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [valueTeam, setValueTeam] = useState([]);
    const [selectedDep, setSelectedDep] = useState([]);
    const [valueDep, setValueDep] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [valueEmp, setValueEmp] = useState([]);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState(userShifts);
    const [filteredRowData, setFilteredRowData] = useState([]);

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); }

    const headerStyle = { wrapHeaderText: true, autoHeaderHeight: true, headerClassName: 'bold-header' };

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    useEffect(() => {
        getapi();
    }, []);

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Attendance Short Time"),
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
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedDep([]);
        setValueDep([]);
        setSelectedEmp([]);
        setValueEmp([]);
    };

    const customValueRendererCompany = (valueCompany, _categoryname) => {
        return valueCompany?.length
            ? valueCompany.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branchto multiselect dropdown changes
    const handleBranchChange = (options) => {
        setSelectedBranch(options);
        setValueBranch(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedUnit([]);
        setValueUnit([]);
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
        setSelectedDep([]);
        setValueDep([]);
    };

    const customValueRendererBranch = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    // unitto multiselect dropdown changes
    const handleUnitChange = (options) => {
        setSelectedUnit(options);
        setValueUnit(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
    };
    const customValueRendererUnit = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };

    //Teamto multiselect dropdown changes
    const handleTeamChange = (options) => {
        setSelectedTeam(options);
        setValueTeam(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedEmp([]);
        setValueEmp([]);
    };
    const customValueRendererTeam = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };

    // Employee    
    const handleEmployeeChange = (options) => {
        setSelectedEmp(options);
        setValueEmp(
            options.map((a, index) => {
                return a.value;
            })
        );
    };

    const customValueRendererEmp = (valueCate, _employees) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    const [searchInputValue, setSearchInputValue] = useState('');
    const [isBoxFocused, setIsBoxFocused] = React.useState(false);

    const handlePasteForEmp = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        // Process the pasted text
        const pastedNames = pastedText
            .split(/[\n,]+/)
            .map(name => name.trim())
            .filter(name => name !== "");

        // Update the state
        updateEmployees(pastedNames);

        // Clear the search input after paste
        setSearchInputValue('');

        // Refocus the element
        e.target.focus();
    };

    useEffect(() => {
        updateEmployees([]); // Pass an empty array instead of an empty string
    }, [allUsersLimit, valueCompany, valueBranch, valueUnit, valueTeam]);

    const updateEmployees = (pastedNames) => {

        const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

        const availableOptions = allUsersLimit
            ?.filter(
                (comp) =>
                    valueCompany?.includes(comp.company) &&
                    valueBranch?.includes(comp.branch) &&
                    valueUnit?.includes(comp.unit) &&
                    valueTeam?.includes(comp.team)
            )
            ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

        const matchedValues = namesArray.filter((name) =>
            availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
        );

        // Update selected options
        const newOptions = matchedValues.map(value => ({
            label: value,
            value: value
        }));

        setSelectedEmp(prev => {
            const newValues = newOptions.filter(
                newOpt => !prev.some(prevOpt => prevOpt.value === newOpt.value)
            );
            return [...prev, ...newValues];
        });

        // Update other states...
        setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
    };

    // Handle clicks outside the Box
    useEffect(() => {
        const handleClickOutside = (e) => {
            const boxElement = document.getElementById("paste-box"); // Add an ID to the Box
            if (boxElement && !boxElement.contains(e.target)) {
                setIsBoxFocused(false); // Reset focus state if clicking outside the Box
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = (e, value) => {
        e.preventDefault();
        setSelectedEmp((current) => current.filter(emp => emp.value !== value));
        setValueEmp((current) => current.filter(empValue => empValue !== value));
    };

    // Department
    const handleDepartmentChange = (options) => {
        setSelectedDep(options);
        setValueDep(
            options.map((a, index) => {
                return a.value;
            })
        );
    };

    const customValueRendererDepartment = (valueDep, _categoryname) => {
        return valueDep?.length
            ? valueDep.map(({ label }) => label)?.join(", ")
            : "Please Select Department";
    };

    // Datatable
    const [pageAttDay, setPageAttDay] = useState(1);
    const [pageSizeAttDay, setPageSizeAttDay] = useState(10);
    const [searchQueryAttDay, setSearchQueryAttDay] = useState("");
    const [totalPagesAttDay, setTotalPagesAttDay] = useState("");

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // Exports
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
    const [isManageColumnsOpenAttDay, setManageColumnsOpenAttDay] = useState(false);
    const [anchorElAttDay, setAnchorElAttDay] = useState(null);
    const [searchQueryManageAttDay, setSearchQueryManageAttDay] = useState("");
    const handleOpenManageColumnsAttDay = (event) => {
        setAnchorElAttDay(event.currentTarget);
        setManageColumnsOpenAttDay(true);
    };
    const handleCloseManageColumnsAttDay = () => {
        setManageColumnsOpenAttDay(false);
        setSearchQueryManageAttDay("");
    };
    const openAttDay = Boolean(anchorElAttDay);
    const idAttDay = openAttDay ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchAttDay, setAnchorElSearchAttDay] = React.useState(null);
    const handleClickSearchAttDay = (event) => {
        setAnchorElSearchAttDay(event.currentTarget);
    };
    const handleCloseSearchAttDay = () => {
        setAnchorElSearchAttDay(null);
        setSearchQueryAttDay("");
    };

    const openSearchAttDay = Boolean(anchorElSearchAttDay);
    const idSearchAttDay = openSearchAttDay ? 'simple-popover' : undefined;

    const [selectedMode, setSelectedMode] = useState("Today");
    const mode = [
        { label: "Today", value: "Today" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    // Show All Columns & Manage Columns
    const initialColumnVisibilityAttDay = {
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
        leavestatus: true,
        permissionstatus: true,
        shiftworkinghours: true,
        shiftbeforeshorthours: true,
        shiftaftershorthours: true,
        totalshorthours: true,
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
    };
    const [columnVisibilityAttDay, setColumnVisibilityAttDay] = useState(initialColumnVisibilityAttDay);

    const getDateRange = (mode) => {
        const today = new Date();
        let fromdate, todate;

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        switch (mode) {
            case "Today":
                fromdate = todate = formatDate(today);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            case "Last Week":
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                fromdate = formatDate(startOfLastWeek);
                todate = formatDate(endOfLastWeek);
                break;
            case "Last Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                break;
            default:
                fromdate = todate = "";
        }

        return { fromdate, todate };
    };

    const formatDateForInput = (date) => {
        if (isNaN(date.getTime())) {
            return ''; // Return empty if the date is invalid
        }
        return date.toISOString().split("T")[0]; // Converts date to 'yyyy-MM-dd' format
    };

    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));

    useEffect(() => {
        // Remove duplicates based on the 'company', 'branch', and 'unit' fields
        const uniqueIsAssignBranch = accessbranch?.reduce((acc, current) => {
            const x = acc.find(item => item.company === current.company && item.branch === current.branch && item.unit === current.unit);
            if (!x) {
                acc.push(current);
            }
            return acc;
        }, []);

        // Create company options
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
        // Create branch options based on selected company
        const branch = uniqueIsAssignBranch
            .filter(val => company.some(comp => comp.value === val.company))
            .map(data => ({
                label: data.branch,
                value: data.branch,
            }))
            .filter((item, index, self) => {
                return self.findIndex(i => i.label === item.label && i.value === item.value) === index;
            });
        setSelectedBranch(branch);
        setValueBranch(
            branch.map((a, index) => {
                return a.value;
            })
        );
        // Create unit options based on selected branch
        const unit = uniqueIsAssignBranch
            .filter(val => company.some(comp => comp.value === val.company) && branch.some(br => br.value === val.branch))
            .map(data => ({
                label: data.unit,
                value: data.unit,
            }))
            .filter((item, index, self) => {
                return self.findIndex(i => i.label === item.label && i.value === item.value) === index;
            });
        setSelectedUnit(unit);
        setValueUnit(
            unit.map((a, index) => {
                return a.value;
            })
        );
        // Create team options based on selected company, branch, and unit
        const team = allTeam
            ?.filter(val =>
                company.some(comp => comp.value === val.company) &&
                branch.some(br => br.value === val.branch) &&
                unit.some(uni => uni.value === val.unit)
            )
            .map(data => ({
                label: data.teamname,
                value: data.teamname,
            }));
        setSelectedTeam(team);
        setValueTeam(team.map(a => a.value));
        const allemployees = allUsersLimit
            ?.filter(val =>
                company.some(comp => comp.value === val.company) &&
                branch.some(br => br.value === val.branch) &&
                unit.some(uni => uni.value === val.unit) &&
                team.some(team => team.value === val.team)
            )?.map(data => ({
                label: data.companyname,
                value: data.companyname,
            })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
            })
        setSelectedEmp(allemployees);
        setValueEmp(allemployees.map(a => a.value));
    }, [isAssignBranch, allTeam]);

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
        setPageName(!pageName)
        setItems([]);
        setLoading(true)
        setPageAttDay(1);
        setPageSizeAttDay(10);

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


            let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_INDIVIDUAL_TYPE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                type: filterUser.filtertype,
                company: [...valueCompany],
                branch: [...valueBranch],
                unit: [...valueUnit],
                team: [...valueTeam],
                employee: [...valueEmp],
                department: [...valueDep],
                assignbranch: accessbranch,
            });

            // console.log(res_emp?.data?.users.length, 'userResult')

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
            // console.log(resultarr.length, 'resultarr')

            async function sendBatchRequest(batch) {
                try {
                    let res = await axios.post(SERVICE.USER_PRODUCTION_DAY_SHIFT_ATTENDANCE_FILTER, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        // company: selectedCompany.map(d => d.value),
                        // branch: selectedBranch.map(d => d.value),
                        // unit: selectedUnit.map(d => d.value),
                        // team: selectedTeam.map(d => d.value),
                        // empname: selectedEmp.map(d => d.value),
                        // userDates: daysArray,
                        // fromdate: filterUser.fromdate,
                        // todate: filterUser.todate,
                        employee: batch.data,
                        userDates: daysArray,
                    });
                    // console.log(res?.data?.finaluser, 'res?.data?.finaluser')
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

                        if (d.reasondate && d.reasondate !== "") {
                            return (formattedDate <= reasonDate);
                        } else if (d.doj && d.doj !== "") {
                            return (formattedDate >= dojDate);
                        } else {
                            return d;
                        }
                    })
                    // console.log(reasonDateFilteredData, 'reasonDateFilteredData')

                    let filtered = reasonDateFilteredData.filter(d => d.rowformattedDate != nextDateFormatted);
                    // console.log(filtered, 'filtered')
                    let res_vendor = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });
                    let attendancecontrol = res_vendor?.data?.attendancecontrolcriteria;
                    // console.log(filtered, 'filtered')
                    // Swap logic
                    const updatedShifts = filtered.reduce((acc, item) => {
                        const key = `${item.empcode}-${item.date}`;
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(item);
                        return acc;
                    }, {});

                    // Process each group
                    const result = Object.values(updatedShifts).flatMap((shifts) => {
                        const mainShift = shifts.find((shift) => shift.shiftMode === 'Main Shift');
                        const secondShift = shifts.find((shift) => shift.shiftMode === 'Second Shift');

                        // Check if the Main Shift starts with PM
                        if (mainShift && secondShift && mainShift.shift.split('to')[0].includes('PM')) {
                            console.log(mainShift.clockin)
                            // Swap shift
                            [mainShift.clockin, secondShift.clockin] = [secondShift.clockin, mainShift.clockin];
                            [mainShift.clockout, secondShift.clockout] = [secondShift.clockout, mainShift.clockout];
                            [mainShift.shift, secondShift.shift] = [secondShift.shift, mainShift.shift];
                            [mainShift.shiftworkinghours, secondShift.shiftworkinghours] = [secondShift.shiftworkinghours, mainShift.shiftworkinghours];
                            [mainShift.shiftbeforeshorthours, secondShift.shiftbeforeshorthours] = [secondShift.shiftbeforeshorthours, mainShift.shiftbeforeshorthours];
                            [mainShift.shiftaftershorthours, secondShift.shiftaftershorthours] = [secondShift.shiftaftershorthours, mainShift.shiftaftershorthours];
                            [mainShift.totalshorthours, secondShift.totalshorthours] = [secondShift.totalshorthours, mainShift.totalshorthours];
                        }

                        return shifts;
                    });

                    // console.log(result);

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
                        // let userShiftTimingsFromTwo = { date: nextDateFormatted, shifttiming: item.shift }
                        // let userShiftTimingsTo = { date: nextDateFormatted, shifttiming: item.nextshift }
                        // let userShiftTimingsBefore = { date: item.rowformattedDate, shifttiming: item.nextshift }

                        let currentShift = userShiftTimingsFrom;
                        // const currentShiftTwo = userShiftTimingsFromTwo;
                        // const nextShift = userShiftTimingsTo;
                        // const nextShiftBefor = userShiftTimingsBefore;

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
                            let timeString = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" && shift.shifttiming == "Not Allotted" ? ("00:00AMto00:00AM").split('to')[1].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off" && shift.shifttiming != "Not Allotted") ? shift.shifttiming.split('to')[1].trim() : ("00:00AMto11:59PM").split('to')[1].trim());
                            let timeStringFrom = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" && shift.shifttiming == "Not Allotted" ? ("00:00AMto00:00AM").split('to')[0].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off" && shift.shifttiming != "Not Allotted") ? shift.shifttiming.split('to')[0].trim() : ("00:00AMto11:59PM").split('to')[0].trim());

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
                        const shiftEndTime = currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" && currentShift.shifttiming !== "Not Allotted" ? parseFromDateTimeEnd(currentShift) : "";

                        // Helper function to parse date and time from shift objects
                        function parseFromDateTime(shift) {
                            const [day, month, year] = shift.date.split('/');
                            // const timeString = shift.shifttiming.split('to')[0].trim();
                            let timeString = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" && shift.shifttiming == "Not Allotted" ? ("00:00AMto00:00AM").split('to')[0].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off" && shift.shifttiming != "Not Allotted") ? shift.shifttiming.split('to')[0].trim() : ("00:00AMto11:59PM").split('to')[0].trim());

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
                        const shiftFromTime = currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" && currentShift.shifttiming !== "Not Allotted" ? parseFromDateTime(currentShift) : "";

                        return {
                            ...item,
                            prodshift: currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" && currentShift.shifttiming !== "Not Allotted" ? `${shiftFromTime.split(".000Z")[0]}to${shiftEndTime.split(".000Z")[0]}` : ""
                        };
                    });

                    // console.log(itemsWithSerialNumber, 'itemsWithSerialNumber')
                    return itemsWithSerialNumber;

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

            // const time12 = convertTo12HourFormat(time24);
            getAllResults().then(async (results) => {
                function convertTo12HourFormatWithSeconds(time) {
                    const [hours, minutes, seconds] = time.split(':').map(Number);
                    const isPM = hours >= 12;
                    const convertedHours = hours % 12 || 12; // Convert to 12-hour format
                    const formattedTime = `${convertedHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
                    return formattedTime;
                }
                // console.log(results.allResults, 'results.allResults')
                const itemsWithSerialNumberFinal = results.allResults.map((item, index) => {

                    const fromtodate = item.prodshift ? item.prodshift.split("to") : "";
                    const fromdate = fromtodate ? fromtodate[0].split("T")[0] : "";
                    const fromtime = fromtodate ? fromtodate[0].split("T")[1] : "";

                    const enddate = fromtodate ? fromtodate[1].split("T")[0] : "";
                    const endtime = fromtodate ? fromtodate[1].split("T")[1] : "";
                    // console.log(item.shiftMode === 'Second Shift' ?  )

                    return {
                        ...item,
                        id: item.id,
                        serialNumber: index + 1,
                        shiftmode: item.shiftMode,
                        prodstartdate: item.prodshift !== "" ? moment(fromdate).format("DD/MM/YYYY") : "",
                        prodstarttime: item.prodshift !== "" ? convertTo12HourFormatWithSeconds(fromtime) : "",
                        prodenddate: item.prodshift !== "" ? moment(enddate).format("DD/MM/YYYY") : "",
                        prodendtime: item.prodshift !== "" ? convertTo12HourFormatWithSeconds(endtime) : "",
                    }
                });
                const filteredMainShift = itemsWithSerialNumberFinal?.filter((shift) => shift.shiftMode === "Main Shift");
                const filteredSecondShift = itemsWithSerialNumberFinal?.filter((shift) => shift.shiftMode === "Second Shift");

                itemsWithSerialNumberFinal.forEach((data) => {
                    if (data.shiftMode === 'Main Shift') {

                        // Check if this user also has a "Second Shift"
                        const hasSecondShift = filteredSecondShift.some(
                            (shift) =>
                                shift.empcode === data.empcode &&
                                shift.rowformattedDate === data.rowformattedDate &&
                                shift.shiftMode === 'Second Shift'
                        );

                        if (hasSecondShift) {
                            const mainShift = filteredMainShift.find(
                                (shift) =>
                                    shift.empcode === data.empcode &&
                                    shift.rowformattedDate === data.rowformattedDate &&
                                    shift.shiftMode === 'Main Shift'
                            );

                            if (mainShift) {

                                const endtime = mainShift.shift?.split('to')[1]?.trim(); // Extract end time

                                const mainShiftEndTime = moment(endtime, 'h:mm A'); // Convert to moment
                                const changedMainShiftEndTime = mainShiftEndTime.format('h:mm:ss A');

                                data.prodendtime = changedMainShiftEndTime; // Update the end time
                            }
                        }
                    }

                    if (data.shiftMode === 'Second Shift') {
                        const mainShift = filteredMainShift.find(
                            (shift) =>
                                shift.empcode === data.empcode &&
                                shift.rowformattedDate === data.rowformattedDate &&
                                shift.shiftMode === 'Main Shift'
                        );

                        if (mainShift) {
                            const endtime = mainShift.clockout !== '00:00:00' ? mainShift.clockout : mainShift.shift?.split('to')[1]?.trim(); // Extract end time
                            // let startTimeWithPM = mainShift.shift?.split('to')[0];

                            const mainShiftEndTime = moment(endtime, 'h:mm:ss A'); // Convert to moment
                            const changedMainShiftEndTime = mainShiftEndTime.add(1, 'second').format('h:mm:ss A'); // Add 1 minute

                            data.prodstarttime = changedMainShiftEndTime; // Set second shift's start time to main shift's end time
                            // if (startTimeWithPM.includes('PM')) {
                            //     data.prodstartdate = mainShift.prodenddate;
                            //     data.prodenddate = mainShift.prodenddate;
                            // }
                        }
                    }
                });

                // console.log(itemsWithSerialNumberFinal, 'itemsWithSerialNumberFinal')
                setUserShifts(itemsWithSerialNumberFinal);
                setFilteredDataItems(itemsWithSerialNumberFinal);
                setLoading(false);
                setSearchQueryAttDay("");
                setTotalPagesAttDay(Math.ceil(itemsWithSerialNumberFinal.length / pageSizeAttDay));
            }).catch(error => {
                setLoading(true);
                console.error('Error in getting all results:', error);
            });
        } catch (err) { setLoading(true); console.log(err.message, "errorororo"); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // const fetchFilteredUsersStatus = async () => {
    //     setPageName(!pageName)
    //     setItems([]);
    //     setLoading(true)
    //     setPageAttDay(1);
    //     setPageSizeAttDay(10);

    //     let startMonthDate = new Date(filterUser.fromdate);

    //     const currentDate = new Date(filterUser.todate);
    //     const nextDay = new Date(currentDate);
    //     nextDay.setDate(currentDate.getDate() + 1);
    //     let endMonthDate = new Date(nextDay);

    //     const daysArray = [];
    //     while (startMonthDate <= endMonthDate) {
    //         const formattedDate = `${String(startMonthDate.getDate()).padStart(2, '0')}/${String(startMonthDate.getMonth() + 1).padStart(2, '0')}/${startMonthDate.getFullYear()}`;
    //         const dayName = startMonthDate.toLocaleDateString('en-US', { weekday: 'long' });
    //         const dayCount = startMonthDate.getDate();
    //         const shiftMode = 'Main Shift';
    //         const weekNumberInMonth = (getWeekNumberInMonth(startMonthDate) === 1 ? `${getWeekNumberInMonth(startMonthDate)}st Week` :
    //             getWeekNumberInMonth(startMonthDate) === 2 ? `${getWeekNumberInMonth(startMonthDate)}nd Week` :
    //                 getWeekNumberInMonth(startMonthDate) === 3 ? `${getWeekNumberInMonth(startMonthDate)}rd Week` :
    //                     getWeekNumberInMonth(startMonthDate) > 3 ? `${getWeekNumberInMonth(startMonthDate)}th Week` : '')

    //         daysArray.push({ formattedDate, dayName, dayCount, shiftMode, weekNumberInMonth });

    //         // Move to the next day
    //         startMonthDate.setDate(startMonthDate.getDate() + 1);
    //     }

    //     try {
    //         let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_INDIVIDUAL_TYPE, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //             // company: [...valueCompany],
    //             // branch: [...valueBranch],
    //             // unit: [...valueUnit],
    //             // employee: [...valueEmp],
    //             // department: [...valueDep]
    //             type: filterUser.filtertype,
    //             company: [...valueCompany],
    //             branch: [...valueBranch],
    //             unit: [...valueUnit],
    //             team: [...valueTeam],
    //             employee: [...valueEmp],
    //             department: [...valueDep],
    //             assignbranch: accessbranch,
    //         });

    //         // console.log(res_emp?.data?.users.length, 'userResult')

    //         function splitArray(array, chunkSize) {
    //             const resultarr = [];
    //             for (let i = 0; i < array.length; i += chunkSize) {
    //                 const chunk = array.slice(i, i + chunkSize);
    //                 resultarr.push({
    //                     data: chunk,
    //                 });
    //             }
    //             return resultarr;
    //         }

    //         let employeelistnames = res_emp?.data?.users.length > 0 ? [...new Set(res_emp?.data?.users.map(item => item.companyname))] : []
    //         const resultarr = splitArray(employeelistnames, 10);
    //         // console.log(resultarr.length, 'resultarr')

    //         async function sendBatchRequest(batch) {
    //             try {
    //                 let res = await axios.post(SERVICE.USER_PRODUCTION_DAY_SHIFT_ATTENDANCE_FILTER, {
    //                     headers: {
    //                         Authorization: `Bearer ${auth.APIToken}`,
    //                     },
    //                     // company: selectedCompany.map(d => d.value),
    //                     // branch: selectedBranch.map(d => d.value),
    //                     // unit: selectedUnit.map(d => d.value),
    //                     // team: selectedTeam.map(d => d.value),
    //                     // empname: selectedEmp.map(d => d.value),
    //                     // userDates: daysArray,
    //                     // fromdate: filterUser.fromdate,
    //                     // todate: filterUser.todate,
    //                     employee: batch.data,
    //                     userDates: daysArray,
    //                 });
    //                 // console.log(res?.data?.finaluser, 'res?.data?.finaluser')
    //                 // Parse the date string (DD/MM/YYYY)
    //                 const currentDate = new Date(filterUser.todate);
    //                 const currdate = new Date(currentDate);
    //                 // Add one day
    //                 currdate.setDate(currdate.getDate() + 1);

    //                 // Format the new date as DD/MM/YYYY
    //                 const newDay = String(currdate.getDate()).padStart(2, '0');
    //                 const newMonth = String(currdate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    //                 const newYear = currdate.getFullYear();

    //                 const nextDateFormatted = `${newDay}/${newMonth}/${newYear}`;

    //                 let reasonDateFilteredData = res?.data?.finaluser.filter(d => {
    //                     const [day, month, year] = d.rowformattedDate.split("/");
    //                     const formattedDate = new Date(`${year}-${month}-${day}`);

    //                     const reasonDate = new Date(d.reasondate);
    //                     const dojDate = new Date(d.doj);

    //                     if (d.reasondate && d.reasondate !== "") {
    //                         return (formattedDate <= reasonDate);
    //                     } else if (d.doj && d.doj !== "") {
    //                         return (formattedDate >= dojDate);
    //                     } else {
    //                         return d;
    //                     }
    //                 })
    //                 // console.log(reasonDateFilteredData, 'reasonDateFilteredData')

    //                 let filtered = reasonDateFilteredData.filter(d => d.rowformattedDate != nextDateFormatted);
    //                 // console.log(filtered, 'filtered')
    //                 let res_vendor = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA_LAST_INDEX, {
    //                     headers: {
    //                         'Authorization': `Bearer ${auth.APIToken}`
    //                     }
    //                 });
    //                 let attendancecontrol = res_vendor?.data?.attendancecontrolcriteria;

    //                 // Swap logic
    //                 const updatedShifts = filtered.reduce((acc, item) => {
    //                     const key = `${item.empcode}-${item.date}`;
    //                     if (!acc[key]) acc[key] = [];
    //                     acc[key].push(item);
    //                     return acc;
    //                 }, {});

    //                 // Process each group
    //                 const result = Object.values(updatedShifts).flatMap((shifts) => {
    //                     const mainShift = shifts.find((shift) => shift.shiftMode === 'Main Shift');
    //                     const secondShift = shifts.find((shift) => shift.shiftMode === 'Second Shift');

    //                     // Check if the Main Shift starts with PM
    //                     if (mainShift && mainShift.shift.split('to')[0].includes('PM')) {
    //                         // Swap shift
    //                         [mainShift.clockin, secondShift.clockin] = [secondShift.clockin, mainShift.clockin];
    //                         [mainShift.clockout, secondShift.clockout] = [secondShift.clockout, mainShift.clockout];
    //                         [mainShift.shift, secondShift.shift] = [secondShift.shift, mainShift.shift];
    //                         [mainShift.shiftworkinghours, secondShift.shiftworkinghours] = [secondShift.shiftworkinghours, mainShift.shiftworkinghours];
    //                         [mainShift.shiftbeforeshorthours, secondShift.shiftbeforeshorthours] = [secondShift.shiftbeforeshorthours, mainShift.shiftbeforeshorthours];
    //                         [mainShift.shiftaftershorthours, secondShift.shiftaftershorthours] = [secondShift.shiftaftershorthours, mainShift.shiftaftershorthours];
    //                         [mainShift.totalshorthours, secondShift.totalshorthours] = [secondShift.totalshorthours, mainShift.totalshorthours];
    //                     }

    //                     return shifts;
    //                 });

    //                 const itemsWithSerialNumber = filtered?.map((item, index) => {
    //                     // Parse the date string (DD/MM/YYYY)
    //                     const [day, month, year] = item.rowformattedDate.split('/').map(Number);
    //                     const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

    //                     // Add one day
    //                     date.setDate(date.getDate() + 1);

    //                     // Format the new date as DD/MM/YYYY
    //                     const newDay = String(date.getDate()).padStart(2, '0');
    //                     const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    //                     const newYear = date.getFullYear();

    //                     const nextDateFormatted = `${newDay}/${newMonth}/${newYear}`;

    //                     let userShiftTimingsFrom = { date: item.rowformattedDate, shifttiming: item.shift }
    //                     let userShiftTimingsFromTwo = { date: nextDateFormatted, shifttiming: item.shift }
    //                     let userShiftTimingsTo = { date: nextDateFormatted, shifttiming: item.nextshift }
    //                     let userShiftTimingsBefore = { date: item.rowformattedDate, shifttiming: item.nextshift }

    //                     const currentShift = userShiftTimingsFrom;
    //                     const currentShiftTwo = userShiftTimingsFromTwo;
    //                     const nextShift = userShiftTimingsTo;
    //                     const nextShiftBefor = userShiftTimingsBefore;


    //                     function padTime(time) {
    //                         let [hours, minutes] = time.split(':');
    //                         if (hours.length === 1) {
    //                             hours = '0' + hours;
    //                         }
    //                         return `${hours}:${minutes}`;
    //                     }


    //                     // Helper function to parse date and time from shift objects
    //                     function parseFromDateTimeEnd(shift) {
    //                         const [day, month, year] = shift.date.split('/');
    //                         // const timeString = shift.shifttiming.split('to')[0].trim();
    //                         let timeString = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" && shift.shifttiming !== "Not Allotted" ? ("00:00AMto00:00AM").split('to')[1].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off" && shift.shifttiming !== "Not Allotted") ? shift.shifttiming.split('to')[1].trim() : ("00:00AMto11:59PM").split('to')[1].trim());
    //                         let timeStringFrom = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" && shift.shifttiming !== "Not Allotted" ? ("00:00AMto00:00AM").split('to')[0].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off" && shift.shifttiming !== "Not Allotted") ? shift.shifttiming.split('to')[0].trim() : ("00:00AMto11:59PM").split('to')[0].trim());

    //                         // Normalize time separators (replace dots with colons)
    //                         timeString = timeString.replace('.', ':');
    //                         timeStringFrom = timeStringFrom.replace('.', ':');

    //                         // Handle missing leading zeros in hour values
    //                         timeString = padTime(timeString);
    //                         timeStringFrom = padTime(timeStringFrom);


    //                         let [hours, minutes] = timeString.slice(0, -2).split(':');
    //                         let [hoursFrom, minutesFrom] = timeStringFrom.slice(0, -2).split(':');

    //                         const period = timeString.slice(-2);
    //                         const periodFrom = timeStringFrom.slice(-2);

    //                         if (period === 'PM' && hours !== '12') {
    //                             hours = parseInt(hours, 10) + 12;
    //                         } else if (period === 'AM' && hours === '12') {
    //                             hours = '00';
    //                         }

    //                         const dateTimeString = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
    //                         // return new Date(dateTimeString);
    //                         // let newTime = new Date(dateTimeString.getTime() - 4 * 60 * 60 * 1000);

    //                         if (periodFrom === 'PM' && hoursFrom !== '12') {
    //                             dateTimeString.setDate(dateTimeString.getDate() + 1);
    //                         }

    //                         //from time
    //                         let newTime = new Date(dateTimeString.getTime() + Number(attendancecontrol.clockout) * 60 * 60 * 1000);

    //                         // console.log(newTime.toISOString());
    //                         return (newTime.toISOString());
    //                     }
    //                     // Parse initial date and time from current shift
    //                     const shiftEndTime = currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" && currentShift.shifttiming !== "Not Allotted" ? parseFromDateTimeEnd(currentShift) : "";

    //                     // Helper function to parse date and time from shift objects
    //                     function parseFromDateTime(shift) {
    //                         const [day, month, year] = shift.date.split('/');
    //                         // const timeString = shift.shifttiming.split('to')[0].trim();
    //                         let timeString = shift.shifttiming && shift.shifttiming != "" && shift.shifttiming == "Week Off" && currentShift.shifttiming !== "Not Allotted" ? ("00:00AMto00:00AM").split('to')[0].trim() : ((shift.shifttiming && shift.shifttiming != "" && shift.shifttiming != "Week Off" && shift.shifttiming !== "Not Allotted") ? shift.shifttiming.split('to')[0].trim() : ("00:00AMto11:59PM").split('to')[0].trim());

    //                         // Normalize time separators (replace dots with colons)
    //                         timeString = timeString.replace('.', ':');

    //                         // Handle missing leading zeros in hour values
    //                         timeString = padTime(timeString);


    //                         let [hours, minutes] = timeString.slice(0, -2).split(':');
    //                         const period = timeString.slice(-2);

    //                         if (period === 'PM' && hours !== '12') {
    //                             hours = parseInt(hours, 10) + 12;
    //                         } else if (period === 'AM' && hours === '12') {
    //                             hours = '00';
    //                         }

    //                         const dateTimeString = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
    //                         // return new Date(dateTimeString);
    //                         // let newTime = new Date(dateTimeString.getTime() - 4 * 60 * 60 * 1000);

    //                         //from time
    //                         let newTime = new Date(dateTimeString.getTime() - Number(attendancecontrol.clockin) * 60 * 60 * 1000);

    //                         // console.log(newTime.toISOString());
    //                         return (newTime.toISOString());
    //                     }
    //                     // Parse initial date and time from current shift
    //                     const shiftFromTime = currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" && currentShift.shifttiming !== "Not Allotted" ? parseFromDateTime(currentShift) : "";

    //                     return {
    //                         ...item,
    //                         prodshift: currentShift.shifttiming && currentShift.shifttiming != "" && currentShift.shifttiming !== "Week Off" && currentShift.shifttiming !== "Not Allotted" ? `${shiftFromTime.split(".000Z")[0]}to${shiftEndTime.split(".000Z")[0]}` : ""
    //                     };
    //                 });
    //                 // console.log(itemsWithSerialNumber, 'itemsWithSerialNumber')
    //                 return itemsWithSerialNumber;

    //             } catch (err) {
    //                 console.error("Error in POST request for batch:", batch.data, err);
    //             }
    //         }

    //         async function getAllResults() {
    //             let allResults = [];
    //             for (let batch of resultarr) {
    //                 const finaldata = await sendBatchRequest(batch);
    //                 allResults = allResults.concat(finaldata);
    //             }

    //             return { allResults }; // Return both results as an object
    //         }

    //         // const time12 = convertTo12HourFormat(time24);
    //         getAllResults().then(async (results) => {
    //             function convertTo12HourFormatWithSeconds(time) {
    //                 const [hours, minutes, seconds] = time.split(':').map(Number);
    //                 const isPM = hours >= 12;
    //                 const convertedHours = hours % 12 || 12; // Convert to 12-hour format
    //                 const formattedTime = `${convertedHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
    //                 return formattedTime;
    //             }
    //             // console.log(results.allResults, 'results.allResults')
    //             const itemsWithSerialNumberFinal = results.allResults.map((item, index) => {

    //                 const fromtodate = item.prodshift ? item.prodshift.split("to") : "";
    //                 const fromdate = fromtodate ? fromtodate[0].split("T")[0] : "";
    //                 const fromtime = fromtodate ? fromtodate[0].split("T")[1] : "";

    //                 const enddate = fromtodate ? fromtodate[1].split("T")[0] : "";
    //                 const endtime = fromtodate ? fromtodate[1].split("T")[1] : "";

    //                 return {
    //                     ...item,
    //                     id: item.id,
    //                     serialNumber: index + 1,
    //                     shiftmode: item.shiftMode,
    //                     prodstartdate: item.prodshift !== "" ? moment(fromdate).format("DD/MM/YYYY") : "",
    //                     prodstarttime: item.prodshift !== "" ? convertTo12HourFormatWithSeconds(fromtime) : "",
    //                     prodenddate: item.prodshift !== "" ? moment(enddate).format("DD/MM/YYYY") : "",
    //                     prodendtime: item.prodshift !== "" ? convertTo12HourFormatWithSeconds(endtime) : "",
    //                 }
    //             });

    //             const filteredMainShift = itemsWithSerialNumberFinal?.filter((shift) => shift.shiftMode === "Main Shift");
    //             const filteredSecondShift = itemsWithSerialNumberFinal?.filter((shift) => shift.shiftMode === "Second Shift");

    //             itemsWithSerialNumberFinal.forEach((data) => {
    //                 if (data.shiftMode === 'Main Shift') {

    //                     // Check if this user also has a "Second Shift"
    //                     const hasSecondShift = filteredSecondShift.some(
    //                         (shift) =>
    //                             shift.empcode === data.empcode &&
    //                             shift.rowformattedDate === data.rowformattedDate &&
    //                             shift.shiftMode === 'Second Shift'
    //                     );

    //                     if (hasSecondShift) {
    //                         const mainShift = filteredMainShift.find(
    //                             (shift) =>
    //                                 shift.empcode === data.empcode &&
    //                                 shift.rowformattedDate === data.rowformattedDate &&
    //                                 shift.shiftMode === 'Main Shift'
    //                         );

    //                         if (mainShift) {

    //                             const endtime = mainShift.shift?.split('to')[1]?.trim(); // Extract end time

    //                             const mainShiftEndTime = moment(endtime, 'h:mm A'); // Convert to moment
    //                             const changedMainShiftEndTime = mainShiftEndTime.format('h:mm:ss A');

    //                             data.prodendtime = changedMainShiftEndTime; // Update the end time
    //                         }
    //                     }
    //                 }

    //                 if (data.shiftMode === 'Second Shift') {
    //                     const mainShift = filteredMainShift.find(
    //                         (shift) =>
    //                             shift.empcode === data.empcode &&
    //                             shift.rowformattedDate === data.rowformattedDate &&
    //                             shift.shiftMode === 'Main Shift'
    //                     );

    //                     if (mainShift) {
    //                         const endtime = mainShift.shift?.split('to')[1]?.trim(); // Extract end time
    //                         // let startTimeWithPM = mainShift.shift?.split('to')[0];

    //                         const mainShiftEndTime = moment(endtime, 'h:mm A'); // Convert to moment
    //                         const changedMainShiftEndTime = mainShiftEndTime.add(1, 'second').format('h:mm:ss A'); // Add 1 minute

    //                         data.prodstarttime = changedMainShiftEndTime; // Set second shift's start time to main shift's end time
    //                         // if (startTimeWithPM.includes('PM')) {
    //                         //     data.prodstartdate = mainShift.prodenddate;
    //                         //     data.prodenddate = mainShift.prodenddate;
    //                         // }
    //                     }
    //                 }
    //             });

    //             // console.log(itemsWithSerialNumberFinal, 'itemsWithSerialNumberFinal')
    //             setUserShifts(itemsWithSerialNumberFinal);
    //             setFilteredDataItems(itemsWithSerialNumberFinal);
    //             setLoading(false);
    //             setSearchQueryAttDay("");
    //             setTotalPagesAttDay(Math.ceil(itemsWithSerialNumberFinal.length / pageSizeAttDay));
    //         }).catch(error => {
    //             setLoading(true);
    //             console.error('Error in getting all results:', error);
    //         });
    //     } catch (err) { setLoading(true); console.log(err.message, "errorororo"); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterUser.filtertype === "Please Select Filter Type" || filterUser.filtertype === "" || filterUser.filtertype === undefined) {
            setPopupContentMalert("Please Select Filter Type for Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedCompany?.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Branch", "Unit"]?.includes(filterUser.filtertype) && selectedBranch.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team", "Unit"]?.includes(filterUser.filtertype) && selectedUnit.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual", "Team"]?.includes(filterUser.filtertype) && selectedTeam.length === 0) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Individual"]?.includes(filterUser.filtertype) && selectedEmp.length === 0) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (["Department"]?.includes(filterUser.filtertype) && selectedDep.length === 0) {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.fromdate === '' && filterUser.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            fetchFilteredUsersStatus();
        }
    };

    const handleClear = async (e) => {
        e.preventDefault();
        setUserShifts([]);
        setFilterUser({ filtertype: "Individual", fromdate: today, todate: today, });
        setSelectedMode("Today");
        setSelectedCompany([]);
        setSelectedBranch([]);
        setSelectedUnit([]);
        setSelectedTeam([]);
        setSelectedDep([]);
        setSelectedEmp([]);
        setValueCompany([]);
        setValueBranch([]);
        setValueUnit([]);
        setValueTeam([])
        setValueDep([]);
        setValueEmp([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(userShifts);
    }, [userShifts]);

    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
            },
        };
    }, []);

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    }, []);

    // Function to handle filter changes
    const onFilterChanged = () => {
        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowData([]);
            } else {
                // Filters are active, capture filtered data
                const filteredData = [];
                gridApi.forEachNodeAfterFilterAndSort((node) => {
                    filteredData.push(node.data); // Collect filtered row data
                });
                setFilteredRowData(filteredData);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableAttDay.current) {
            const gridApi = gridRefTableAttDay.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesAttDay = gridApi.paginationGetTotalPages();
            setPageAttDay(currentPage);
            setTotalPagesAttDay(totalPagesAttDay);
        }
    }, []);

    const columnDataTableAttDay = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityAttDay.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityAttDay.empcode, pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityAttDay.username, pinned: 'left', lockPinned: true, },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibilityAttDay.company, },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityAttDay.branch, },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibilityAttDay.unit, },
        { field: "team", headerName: "Team", flex: 0, width: 150, hide: !columnVisibilityAttDay.team, },
        { field: "department", headerName: "Department", flex: 0, width: 200, hide: !columnVisibilityAttDay.department, },
        { field: "date", headerName: "Date", flex: 0, width: 170, hide: !columnVisibilityAttDay.date, },
        { field: "shift", headerName: "Shift", flex: 0, width: 170, hide: !columnVisibilityAttDay.shift, },
        { field: "leavestatus", headerName: "Leave Status", flex: 0, width: 150, hide: !columnVisibilityAttDay.leavestatus, },
        { field: "permissionstatus", headerName: "Permission Status", flex: 0, width: 150, hide: !columnVisibilityAttDay.permissionstatus, },
        { field: "shiftworkinghours", headerName: "Shift Working Hours (HH:MM:SS)", flex: 0, width: 200, hide: !columnVisibilityAttDay.shiftworkinghours, ...headerStyle, },
        { field: "prodstartdate", headerName: "Production Shift Start Date", flex: 0, width: 200, hide: !columnVisibilityAttDay.prodstartdate, ...headerStyle, },
        { field: "prodstarttime", headerName: "Production Shift Start Time", flex: 0, width: 200, hide: !columnVisibilityAttDay.prodstarttime, ...headerStyle, },
        { field: "prodenddate", headerName: "Production Shift End Date", flex: 0, width: 200, hide: !columnVisibilityAttDay.prodenddate, ...headerStyle, },
        { field: "prodendtime", headerName: "Production Shift End Time", flex: 0, width: 200, hide: !columnVisibilityAttDay.prodendtime, ...headerStyle, },
        { field: "clockin", headerName: "Clock In Time", flex: 0, width: 200, hide: !columnVisibilityAttDay.clockin, ...headerStyle, },
        { field: "clockout", headerName: "Clock Out Time", flex: 0, width: 200, hide: !columnVisibilityAttDay.clockout, ...headerStyle, },
        { field: "shiftbeforeshorthours", headerName: "Shift Before Short Hours (HH:MM:SS)", flex: 0, width: 200, hide: !columnVisibilityAttDay.shiftbeforeshorthours, ...headerStyle, },
        { field: "shiftaftershorthours", headerName: "Shift After Short Hours (HH:MM:SS)", flex: 0, width: 200, hide: !columnVisibilityAttDay.shiftaftershorthours, ...headerStyle, },
        { field: "totalshorthours", headerName: "Total Short Hours (HH:MM:SS)", flex: 0, width: 200, hide: !columnVisibilityAttDay.totalshorthours, ...headerStyle, },
    ]

    //Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryAttDay(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = items?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageAttDay(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = items?.filter((item) => {
            return filters.reduce((acc, filter, index) => {
                const { column, condition, value } = filter;
                const itemValue = String(item[column])?.toLowerCase();
                const filterValue = String(value).toLowerCase();

                let match;
                switch (condition) {
                    case "Contains":
                        match = itemValue.includes(filterValue);
                        break;
                    case "Does Not Contain":
                        match = !itemValue?.includes(filterValue);
                        break;
                    case "Equals":
                        match = itemValue === filterValue;
                        break;
                    case "Does Not Equal":
                        match = itemValue !== filterValue;
                        break;
                    case "Begins With":
                        match = itemValue.startsWith(filterValue);
                        break;
                    case "Ends With":
                        match = itemValue.endsWith(filterValue);
                        break;
                    case "Blank":
                        match = !itemValue;
                        break;
                    case "Not Blank":
                        match = !!itemValue;
                        break;
                    default:
                        match = true;
                }

                // Combine conditions with AND/OR logic
                if (index === 0) {
                    return match; // First filter is applied directly
                } else if (logicOperator === "AND") {
                    return acc && match;
                } else {
                    return acc || match;
                }
            }, true);
        });

        setFilteredDataItems(filtered);
        setAdvancedFilter(filters);
        // handleCloseSearchAttDay(); 
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryAttDay("");
        setFilteredDataItems(userShifts);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableAttDay.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryAttDay;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesAttDay) {
            setPageAttDay(newPage);
            gridRefTableAttDay.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeAttDay(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityAttDay };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAttDay(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityAttDay");
        if (savedVisibility) {
            setColumnVisibilityAttDay(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityAttDay", JSON.stringify(columnVisibilityAttDay));
    }, [columnVisibilityAttDay]);

    // Function to filter columns based on search query
    const filteredColumns = columnDataTableAttDay.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageAttDay.toLowerCase())
    );

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        if (!gridApi) return;

        setColumnVisibilityAttDay((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApi.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMoved = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityAttDay((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisible = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityAttDay((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('')
    let exportColumnNamescrt = [
        "Emp Code", "Employee Name", "Company", "Branch", "Unit", "Team", "Department",
        "Date", "Shift", "Leave Status", "Permission Status", "Shift Working Hours (HH:MM:SS)", "Production Shift Start Date", "Production Shift Start Time",
        "Production Shift End Date", "Production Shift End Time", "Clock In Time", "Clock Out Time", "Shift Before Short Hours (HH:MM:SS)", "Shift After Short Hours (HH:MM:SS)", "Total Short Hours (HH:MM:SS)"
    ]
    let exportRowValuescrt = [
        'empcode', 'username', 'company', 'branch', 'unit', 'team',
        'department', 'date', 'shift', 'leavestatus', 'permissionstatus', 'shiftworkinghours', 'prodstartdate', 'prodstarttime', 'prodenddate', 'prodendtime', 'clockin', 'clockout', 'shiftbeforeshorthours', 'shiftaftershorthours', 'totalshorthours'
    ]

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Attendance Short Time Report",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageAttDay.current) {
            domtoimage.toBlob(gridRefImageAttDay.current)
                .then((blob) => {
                    saveAs(blob, "Attendance Short Time Report.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // Pagination for innter filter
    const getVisiblePageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        const startPage = Math.max(1, pageAttDay - 1);
        const endPage = Math.min(totalPagesAttDay, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageAttDay numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageAttDay, show ellipsis
        if (endPage < totalPagesAttDay) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageAttDay - 1) * pageSizeAttDay, pageAttDay * pageSizeAttDay);
    const totalPagesAttDayOuter = Math.ceil(filteredDataItems?.length / pageSizeAttDay);
    const visiblePages = Math.min(totalPagesAttDayOuter, 3);
    const firstVisiblePage = Math.max(1, pageAttDay - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttDayOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageAttDay * pageSizeAttDay;
    const indexOfFirstItem = indexOfLastItem - pageSizeAttDay;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            <Headtitle title={"Attendance Short Time Report"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Attendance Short Time Report"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Reports"
                subsubpagename="Attendance Short Time"
            />
            {isUserRoleCompare?.includes("lattendanceshorttime") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}> Attendance Short Time Report </Typography>
                            </Grid>
                            {/* <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={accessbranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        styles={colourStyles}
                                        value={selectedCompany}
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
                                        options={accessbranch?.filter(
                                            (comp) =>
                                                selectedCompany.map(d => d.value).includes(comp.company)
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
                                    <Typography>
                                        Unit<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={accessbranch?.filter(
                                            (comp) =>
                                                selectedCompany.map(d => d.value).includes(comp.company) &&
                                                selectedBranch
                                                    .map((item) => item.value)
                                                    .includes(comp.branch)
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
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Team<b style={{ color: "red" }}>*</b>
                                    </Typography>

                                    <MultiSelect
                                        options={allTeam?.filter(
                                            (comp) =>
                                                selectedCompany.map(d => d.value).includes(comp.company) &&
                                                selectedBranch
                                                    .map((item) => item.value)
                                                    .includes(comp.branch) && selectedUnit
                                                        .map((item) => item.value)
                                                        .includes(comp.unit)
                                        )?.map(data => ({
                                            label: data.teamname,
                                            value: data.teamname,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedTeam}
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
                                            allUsersLimit
                                                ?.filter(
                                                    (comp) =>
                                                        selectedCompany.map(d => d.value).includes(comp.company) &&
                                                        selectedBranch
                                                            .map((item) => item.value)
                                                            .includes(comp.branch) &&
                                                        selectedUnit
                                                            .map((item) => item.value)
                                                            .includes(comp.unit) &&
                                                        selectedTeam
                                                            .map((item) => item.value)
                                                            .includes(comp.team)
                                                )
                                                ?.map((com) => ({
                                                    ...com,
                                                    label: com.companyname,
                                                    value: com.companyname,
                                                }))}
                                        value={selectedEmp}
                                        onChange={handleEmployeeChangeFrom}
                                        valueRenderer={customValueRendererEmployeeFrom}
                                        labelledBy="Please Select Employeename"
                                    />
                                </FormControl>
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Type<b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        options={[
                                            { label: "Individual", value: "Individual" },
                                            { label: "Company", value: "Company" },
                                            { label: "Branch", value: "Branch" },
                                            { label: "Unit", value: "Unit" },
                                            { label: "Team", value: "Team" },
                                            { label: "Department", value: "Department" },
                                        ]}
                                        styles={colourStyles}
                                        value={{ label: filterUser.filtertype, value: filterUser.filtertype, }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, filtertype: e.value });
                                            setSelectedCompany([]);
                                            setValueCompany([]);
                                            setSelectedBranch([]);
                                            setValueBranch([]);
                                            setSelectedUnit([]);
                                            setValueUnit([]);
                                            setSelectedTeam([]);
                                            setValueTeam([]);
                                            setSelectedEmp([]);
                                            setValueEmp([]);
                                            setSelectedDep([]);
                                            setValueDep([]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Company<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={accessbranch?.map(data => ({
                                            label: data.company,
                                            value: data.company,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedCompany}
                                        onChange={(e) => {
                                            handleCompanyChange(e);
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>
                            {["Individual", "Team"]?.includes(filterUser.filtertype) ? <>
                                {/* Branch Unit Team */}
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company)
                                            )?.map(data => ({
                                                label: data.branch,
                                                value: data.branch,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedBranch}
                                            onChange={handleBranchChange}
                                            valueRenderer={customValueRendererBranch}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={accessbranch?.filter(
                                                (comp) =>
                                                    valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                            )?.map(data => ({
                                                label: data.unit,
                                                value: data.unit,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedUnit}
                                            onChange={handleUnitChange}
                                            valueRenderer={customValueRendererUnit}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography> Team<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={allTeam
                                                ?.filter((u) => valueCompany?.includes(u.company) && valueBranch?.includes(u.branch) && valueUnit?.includes(u.unit))
                                                .map((u) => ({
                                                    ...u,
                                                    label: u.teamname,
                                                    value: u.teamname,
                                                }))}
                                            value={selectedTeam}
                                            onChange={handleTeamChange}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                                : ["Branch"]?.includes(filterUser.filtertype) ?
                                    <>
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                                                <MultiSelect
                                                    options={accessbranch?.filter(
                                                        (comp) =>
                                                            valueCompany?.includes(comp.company)
                                                    )?.map(data => ({
                                                        label: data.branch,
                                                        value: data.branch,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedBranch}
                                                    onChange={handleBranchChange}
                                                    valueRenderer={customValueRendererBranch}
                                                    labelledBy="Please Select Branch"
                                                />
                                            </FormControl>
                                        </Grid>
                                    </>
                                    :
                                    ["Unit"]?.includes(filterUser.filtertype) ?
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography> Branch<b style={{ color: "red" }}>*</b></Typography>
                                                    <MultiSelect
                                                        options={accessbranch?.filter(
                                                            (comp) =>
                                                                valueCompany?.includes(comp.company)
                                                        )?.map(data => ({
                                                            label: data.branch,
                                                            value: data.branch,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={selectedBranch}
                                                        onChange={handleBranchChange}
                                                        valueRenderer={customValueRendererBranch}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography> Unit<b style={{ color: "red" }}>*</b></Typography>
                                                    <MultiSelect
                                                        options={accessbranch?.filter(
                                                            (comp) =>
                                                                valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                                        )?.map(data => ({
                                                            label: data.unit,
                                                            value: data.unit,
                                                        })).filter((item, index, self) => {
                                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                        })}
                                                        value={selectedUnit}
                                                        onChange={handleUnitChange}
                                                        valueRenderer={customValueRendererUnit}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                        : ["Individual", "Department"]?.includes(filterUser.filtertype) ?
                                            <>
                                                {/* Department */}
                                                <Grid item md={3} xs={12} sm={6}>
                                                    <FormControl fullWidth size="small">
                                                        <Typography>
                                                            Department<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <MultiSelect
                                                            options={alldepartment?.map(data => ({
                                                                label: data.deptname,
                                                                value: data.deptname,
                                                            })).filter((item, index, self) => {
                                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                            })}
                                                            value={selectedDep}
                                                            onChange={(e) => {
                                                                handleDepartmentChange(e);
                                                            }}
                                                            valueRenderer={customValueRendererDepartment}
                                                            labelledBy="Please Select Department"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </>
                                            : ""
                            }
                            {["Individual"]?.includes(filterUser.filtertype) &&
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Employee<b style={{ color: "red" }}>*</b> </Typography>
                                        <div
                                            onPaste={handlePasteForEmp}
                                            style={{ position: 'relative' }}
                                        >
                                            <MultiSelect
                                                options={allUsersLimit?.filter(
                                                    (comp) =>
                                                        valueCompany?.includes(comp.company) && selectedBranch?.map(data => data.value)?.includes(comp.branch) && selectedUnit?.map(data => data.value)?.includes(comp.unit) && selectedTeam?.map(data => data.value)?.includes(comp.team)
                                                )?.map(data => ({
                                                    label: data.companyname,
                                                    value: data.companyname,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                value={selectedEmp}
                                                onChange={(e) => { handleEmployeeChange(e); }}
                                                valueRenderer={customValueRendererEmp}
                                                labelledBy="Please Select Employee"
                                            />
                                        </div>
                                    </FormControl>
                                </Grid>}
                            {['Individual']?.includes(filterUser.filtertype) && (
                                <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Selected Employees</Typography>
                                        <Box
                                            id="paste-box"
                                            tabIndex={0}
                                            sx={{
                                                border: '1px solid #ccc',
                                                borderRadius: '3.75px',
                                                height: '110px',
                                                overflow: 'auto',
                                                '& .MuiChip-clickable': {
                                                    margin: '1px',
                                                    cursor: 'pointer',
                                                    userSelect: 'none',
                                                    background: '#e0e0e0',
                                                },
                                            }}
                                            onPaste={handlePasteForEmp}
                                            onFocus={() => setIsBoxFocused(true)}
                                            onBlur={(e) => {
                                                if (isBoxFocused) {
                                                    e.target.focus();
                                                }
                                            }}
                                        >
                                            {valueEmp.map((value) => (
                                                <Chip key={value} label={value} clickable sx={{ margin: 2, backgroundColor: '#FFF' }} onDelete={(e) => handleDelete(e, value)} onClick={() => console.log('clicked chip')} />
                                            ))}
                                        </Box>
                                    </FormControl>
                                </Grid>
                            )}
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Filter Mode<b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        labelId="mode-select-label"
                                        options={mode}
                                        value={{ label: selectedMode, value: selectedMode }}
                                        onChange={(selectedOption) => {
                                            // Reset the date fields to empty strings
                                            let fromdate = '';
                                            let todate = '';

                                            // If a valid option is selected, get the date range
                                            if (selectedOption.value) {
                                                const dateRange = getDateRange(selectedOption.value);
                                                fromdate = dateRange.fromdate; // Already formatted in 'dd-MM-yyyy'
                                                todate = dateRange.todate; // Already formatted in 'dd-MM-yyyy'
                                            }
                                            // Set the state with formatted dates
                                            setFilterUser({
                                                ...filterUser,
                                                fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                                todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                            });
                                            setSelectedMode(selectedOption.value); // Update the mode
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        disabled={selectedMode != "Custom"}
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
                                        disabled={selectedMode != "Custom"}
                                        value={filterUser.todate}
                                        onChange={(e) => {
                                            const selectedDate = e.target.value;
                                            // Ensure that the selected date is not in the future
                                            const currentDate = new Date().toISOString().split("T")[0];
                                            const fromdateval = filterUser.fromdate != "" && new Date(filterUser.fromdate).toISOString().split("T")[0];
                                            if (filterUser.fromdate == "") {
                                                setPopupContentMalert("Please Select From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
                                            } else if (selectedDate < fromdateval) {
                                                setFilterUser({ ...filterUser, todate: "" });
                                                setPopupContentMalert("To Date should be after or equal to From Date");
                                                setPopupSeverityMalert("warning");
                                                handleClickOpenPopupMalert();
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
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item lg={1} md={2} sm={2} xs={12} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmit} > Filter </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={12}>
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear} > Clear </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box><br />
                    {/* ****** Table Start ****** */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}> Attendance Short Time Report </Typography>
                        </Grid>
                        <Grid container spacing={2} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeAttDay}
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
                                        <MenuItem value={userShifts?.length}>  All </MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                                <Box>
                                    {isUserRoleCompare?.includes("excelattendanceshorttime") && (
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
                                <FormControl fullWidth size="small">
                                    <OutlinedInput size="small"
                                        id="outlined-adornment-weight"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <FaSearch />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                {advancedFilter && (
                                                    <IconButton onClick={handleResetSearch}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAttDay} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplay()}
                                        onChange={handleSearchChange}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilter}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAttDay}> Manage Columns  </Button> <br /><br />
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
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAttDay} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableAttDay.filter((column) => columnVisibilityAttDay[column.field])}
                                        ref={gridRefTableAttDay}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSize={pageSizeAttDay}
                                        onPaginationChanged={onPaginationChanged}
                                        onGridReady={onGridReady}
                                        onColumnMoved={handleColumnMoved}
                                        onColumnVisible={handleColumnVisible}
                                        onFilterChanged={onFilterChanged}
                                        // suppressPaginationPanel={true}
                                        suppressSizeToFit={true}
                                        suppressAutoSize={true}
                                        suppressColumnVirtualisation={true}
                                        colResizeDefault={"shift"}
                                        cellSelection={true}
                                        copyHeadersToClipboard={true}
                                    />
                                </Box>
                                {/* show and hide based on the inner filter and outer filter */}
                                {/* <Box style={userStyle.dataTablestyle}>                                    
                                    <Box>
                                        Showing{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                (filteredDataItems.length > 0 ? (pageAttDay - 1) * pageSizeAttDay + 1 : 0)
                                            ) : (
                                                filteredRowData.length > 0 ? (pageAttDay - 1) * pageSizeAttDay + 1 : 0
                                            )
                                        }{" "}to{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                Math.min(pageAttDay * pageSizeAttDay, filteredDataItems.length)
                                            ) : (
                                                filteredRowData.length > 0 ? Math.min(pageAttDay * pageSizeAttDay, filteredRowData.length) : 0
                                            )
                                        }{" "}of{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                filteredDataItems.length
                                            ) : (
                                                filteredRowData.length
                                            )
                                        } entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChange(1)} disabled={pageAttDay === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChange(pageAttDay - 1)} disabled={pageAttDay === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                        {getVisiblePageNumbers().map((pageNumber, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => pageNumber !== "..." && handlePageChange(pageNumber)}
                                                sx={{
                                                    ...userStyle.paginationbtn,
                                                    ...(pageNumber === "..." && {
                                                        cursor: "default",
                                                        color: "black",
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        "&:hover": {
                                                            backgroundColor: "transparent",
                                                            boxShadow: "none",
                                                        },
                                                    }),
                                                }}
                                                className={pageAttDay === pageNumber ? "active" : ""}
                                                disabled={pageAttDay === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChange(pageAttDay + 1)} disabled={pageAttDay === totalPagesAttDay} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChange(totalPagesAttDay)} disabled={pageAttDay === totalPagesAttDay} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                    </Box>
                                </Box> */}
                            </>
                        )}
                    </Box>
                    {/* ****** Table End ****** */}
                </>
            )}
            {/* Manage Column */}
            <Popover
                id={idAttDay}
                open={isManageColumnsOpenAttDay}
                anchorEl={anchorElAttDay}
                onClose={handleCloseManageColumnsAttDay}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsAttDay}
                    searchQuery={searchQueryManageAttDay}
                    setSearchQuery={setSearchQueryManageAttDay}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityAttDay}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityAttDay}
                    initialColumnVisibility={initialColumnVisibilityAttDay}
                    columnDataTable={columnDataTableAttDay}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchAttDay}
                open={openSearchAttDay}
                anchorEl={anchorElSearchAttDay}
                onClose={handleCloseSearchAttDay}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <Box sx={{ padding: '10px' }}>
                    <AdvancedSearchBar columns={columnDataTableAttDay} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryAttDay} handleCloseSearch={handleCloseSearchAttDay} />
                </Box>
            </Popover>

            {/* Alert  */}
            <Box>
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
            </Box>
            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />
            {/* SUCCESS */}
            <AlertDialog
                openPopup={openPopup}
                handleClosePopup={handleClosePopup}
                popupContent={popupContent}
                popupSeverity={popupSeverity}
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredRowData.length > 0 ? filteredRowData : filteredData) ?? []}
                itemsTwo={items ?? []}
                filename={"Attendance Short Time Report"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
        </Box>
    );
}

export default AttendanceShortTimeListTable;