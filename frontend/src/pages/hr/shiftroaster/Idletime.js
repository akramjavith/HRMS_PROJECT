import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, Chip, DialogContent, InputAdornment, DialogActions, FormControl, Grid, Button, Popover, IconButton, Tooltip, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper, TableFooter } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { format } from 'date-fns';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { MultiSelect } from "react-multi-select-component";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import moment from 'moment';
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
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
import AdvancedSearchBar from '../../../components/SearchbarEbList';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function IdleTimeList() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const gridRefTableIdleTime = useRef(null);
    const gridRefImageIdleTime = useRef(null);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, allUsersData, allTeam, alldepartment, pageName, setPageName, buttonStyles, allUsersLimit } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [selectedCompany, setSelectedCompany] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [selectedDep, setSelectedDep] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [allIdleTimes, setAllIdleTimes] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(false);
    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);

    const [filterUser, setFilterUser] = useState({ filtertype: "Individual", fromdate: today, todate: today });

    const [idleTimeView, setIdleTimeView] = useState({
        companyname: '', empcode: '', company: '', branch: '', unit: '', team: '', department: ''
    });

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => { setOpenview(true); };
    const handleCloseview = () => { setOpenview(false); };

    // Datatable
    const [pageIdleTime, setPageIdleTime] = useState(1);
    const [pageSizeIdleTime, setPageSizeIdleTime] = useState(10);
    const [searchQueryIdleTime, setSearchQueryIdleTime] = useState("");
    const [totalPagesIdleTime, setTotalPagesIdleTime] = useState(1);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // pageIdleTime refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

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

    // pageIdleTime refersh reload
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
    const [isManageColumnsOpenIdleTime, setManageColumnsOpenIdleTime] = useState(false);
    const [anchorElIdleTime, setAnchorElIdleTime] = useState(null);
    const [searchQueryManageIdleTime, setSearchQueryManageIdleTime] = useState("");
    const handleOpenManageColumnsIdleTime = (event) => {
        setAnchorElIdleTime(event.currentTarget);
        setManageColumnsOpenIdleTime(true);
    };
    const handleCloseManageColumnsIdleTime = () => {
        setManageColumnsOpenIdleTime(false);
        setSearchQueryManageIdleTime("");
    };
    const openManageColumnsIdleTime = Boolean(anchorElIdleTime);
    const idManageColumnsIdleTime = openManageColumnsIdleTime ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchIdleTime, setAnchorElSearchIdleTime] = React.useState(null);
    const handleClickSearchIdleTime = (event) => {
        setAnchorElSearchIdleTime(event.currentTarget);
    };
    const handleCloseSearchIdleTime = () => {
        setAnchorElSearchIdleTime(null);
        setSearchQueryIdleTime("");
    };

    const openSearchIdleTime = Boolean(anchorElSearchIdleTime);
    const idSearchIdleTime = openSearchIdleTime ? 'simple-popover' : undefined;

    const [selectedMode, setSelectedMode] = useState("Today");
    const mode = [
        { label: "Today", value: "Today" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    // Show All Columns & Manage Columns
    const initialColumnVisibilityIdleTime = {
        serialNumber: true,
        empcode: true,
        companyname: true,
        date: true,
        totalhours: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        workmode: true,
        actions: true,
    };
    const [columnVisibilityIdleTime, setColumnVisibilityIdleTime] = useState(initialColumnVisibilityIdleTime);

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
            pagename: String("HRMS Idle Time Report"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),
            addedby: [
                {
                    username: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    }

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

    const accessbranch = isAssignBranch
        ?.filter((data) => {
            let fetfinalurl = [];
            // Check if user is a Manager, in which case return all branches
            if (isUserRoleAccess?.role?.includes("Manager")) {
                return true; // Skip filtering, return all data for Manager
            }
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
                data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
            ) {
                fetfinalurl = data.subpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 &&
                data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
            ) {
                fetfinalurl = data.mainpagenameurl;
            } else if (
                data?.modulenameurl?.length !== 0 &&
                data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
            ) {
                fetfinalurl = data.submodulenameurl;
            } else if (data?.modulenameurl?.length !== 0) {
                fetfinalurl = data.modulenameurl;
            } else {
                fetfinalurl = [];
            }

            // Check if the pathname exists in the URL
            return fetfinalurl?.includes(window.location.pathname);
        })
        ?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }));

    // Pre select dropdowns
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
    }, [isAssignBranch, allTeam]);

    const handleCompanyChange = (options) => {
        setSelectedCompany(options);
    };

    const customValueRendererCompany = (valueCompany, _categoryname) => {
        return valueCompany?.length
            ? valueCompany.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branchto multiselect dropdown changes
    const handleBranchChange = (options) => {
        setSelectedBranch(options);
        setSelectedUnit([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
    };

    const customValueRendererBranch = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    // unitto multiselect dropdown changes
    const handleUnitChange = (options) => {
        setSelectedUnit(options);
        setSelectedTeam([]);
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
        setSelectedEmp([]);
        setValueEmp([]);
    };
    const customValueRendererTeam = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };

    const handleDepartmentChange = (options) => {
        setSelectedDep(options);
    };

    const customValueRendererDepartment = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Department";
    };

    // Employee multiselect
    const handleEmployeeChange = (options) => {
        setSelectedEmp(options);
        setValueEmp(options?.map(a => a.value));

    };

    const customValueRendererEmp = (valueEmp, _employees) => {
        return valueEmp.length
            ? valueEmp.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    const fetchFilteredIdleTime = async () => {
        setPageName(!pageName)
        setAllIdleTimes([]);
        setLoader(true);
        setPageIdleTime(1);
        setPageSizeIdleTime(10);

        try {
            let res = await axios.post(SERVICE.USER_IDLETIME_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                filtertype: filterUser.filtertype,
                company: selectedCompany?.map(val => val.value),
                branch: selectedBranch?.map(val => val.value),
                unit: selectedUnit?.map(val => val.value),
                team: selectedTeam?.map(val => val.value),
                department: selectedDep?.map(val => val.value),
                employee: selectedEmp?.map(val => val.value),
                fromdate: filterUser.fromdate,
                todate: filterUser.todate
            });

            // To store hours grouped by empcode and date
            const userTimeMap = {};

            res?.data?.finalidletimes?.forEach((item) => {

                const startTime = new Date(item.starttime);
                const endTime = new Date(item.endtime);

                // const datePart = startTime.toLocaleDateString('en-GB');  // Format as dd/mm/yyyy
                const datePart = startTime.toISOString().split('T')[0];  // Format as yyyy/mm/dd
                const endDatePart = endTime.toISOString().split('T')[0];

                const localStartTime = startTime.toLocaleString('en-GB', {
                    hour12: true,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });
                const localEndTime = endTime.toLocaleString('en-GB', {
                    hour12: true,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });

                // Split the string to get only the time part
                const startTimePart = localStartTime.split(', ')[1];
                const endTimePart = localEndTime.split(', ')[1];

                // Calculate the time difference in milliseconds
                const timeDiffInMs = endTime - startTime;;

                // Calculate total hours, minutes, and seconds
                const totalSeconds = Math.floor(timeDiffInMs / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                const timeEntry = { hours, minutes, seconds };

                // Use empcode and date as the key to accumulate time
                const key = `${item.empcode}-${datePart}`;

                // If key exists, add the time, else initialize
                if (userTimeMap[key]) {
                    // userTimeMap[key].totalHours += totalHours;
                    // Add the current time to the accumulated time
                    userTimeMap[key].totalHours.hours += timeEntry.hours;
                    userTimeMap[key].totalHours.minutes += timeEntry.minutes;
                    userTimeMap[key].totalHours.seconds += timeEntry.seconds;

                    // Handle carryover of minutes and seconds
                    if (userTimeMap[key].totalHours.seconds >= 60) {
                        userTimeMap[key].totalHours.minutes += Math.floor(userTimeMap[key].totalHours.seconds / 60);
                        userTimeMap[key].totalHours.seconds = userTimeMap[key].totalHours.seconds % 60;
                    }
                    if (userTimeMap[key].totalHours.minutes >= 60) {
                        userTimeMap[key].totalHours.hours += Math.floor(userTimeMap[key].totalHours.minutes / 60);
                        userTimeMap[key].totalHours.minutes = userTimeMap[key].totalHours.minutes % 60;
                    }
                } else {
                    userTimeMap[key] = {
                        id: item._id,
                        userid: item.userid,
                        companyname: item.companyname,
                        empcode: item.empcode,
                        defaultdate: item.date,
                        date: moment(datePart).format('DD/MM/YYYY'),
                        totalHours: timeEntry,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        workmode: item.workmode,
                        department: item.department,
                    };
                }
            });

            // Convert the result object to an array
            const itemsWithTotalHours = Object.values(userTimeMap).map((item, index) => {
                const totalHours = `${String(item.totalHours.hours).padStart(2, "0")}:${String(item.totalHours.minutes).padStart(2, "0")}:${String(item.totalHours.seconds).padStart(2, "0")}`;
                return {
                    id: item.id,
                    userid: item.userid,
                    serialNumber: index + 1,
                    companyname: item.companyname,
                    empcode: item.empcode,
                    defaultdate: item.defaultdate,
                    date: item.date,
                    totalhours: `${totalHours} hrs`,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    team: item.team,
                    workmode: item.workmode,
                    department: item.department,
                }
            });

            setAllIdleTimes(itemsWithTotalHours);
            setFilteredDataItems(itemsWithTotalHours);
            setLoader(false);
        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCompany.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.filtertype === "Please Select Filter Type" || filterUser.filtertype === "" || filterUser.filtertype === undefined) {
            setPopupContentMalert("Please Select Filter Type for Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.filtertype === "Department" && selectedDep.length === 0) {
            setPopupContentMalert("Please Select Department");
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
            setPopupContentMalert("Please Select Employee");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.fromdate === '' && filterUser.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            fetchFilteredIdleTime();
        }
    };

    const [valueEmp, setValueEmp] = React.useState([]); // State for employees
    const [isBoxFocused, setIsBoxFocused] = React.useState(false); // Track focus state

    const [searchInputValue, setSearchInputValue] = useState('');

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
    }, [allUsersData, selectedCompany, selectedBranch, selectedUnit, selectedTeam]);

    // const updateEmployees = (pastedNames) => {
    //     // Ensure pastedNames is always an array
    //     const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

    //     const availableOptions = allUsersLimit
    //         ?.filter(
    //             (comp) =>
    //                 selectedCompany?.map((item) => item?.value)?.includes(comp.company) &&
    //                 selectedBranch?.map((item) => item?.value)?.includes(comp.branch) &&
    //                 selectedUnit?.map((item) => item?.value)?.includes(comp.unit) &&
    //                 selectedTeam?.map((item) => item?.value)?.includes(comp.team)
    //         )
    //         ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

    //     const matchedValues = namesArray.filter((name) =>
    //         availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
    //     );

    //     setValueEmp((prev) => {
    //         const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
    //         const updatedValues = [...prev, ...uniqueValues];
    //         const uniqueSet = new Set(updatedValues); // Ensure uniqueness
    //         return Array.from(uniqueSet);
    //     });

    //     setSelectedEmp((prev) => {
    //         // Filter out duplicates from namesArray
    //         const uniqueValues = matchedValues.filter((value) =>
    //             !prev.some((item) => item.value === value.replace(/\s*\.\s*/g, ".").trim())
    //         );

    //         // Map the unique values to label-value pairs
    //         const uniqueValuesMap = uniqueValues.map((data) => ({
    //             label: data.replace(/\s*\.\s*/g, ".").trim(),
    //             value: data.replace(/\s*\.\s*/g, ".").trim(),
    //         }));

    //         // Merge with previous values
    //         const updatedValues = [...prev, ...uniqueValuesMap];

    //         // Deduplicate based on the `value` property using a Map
    //         const uniqueSet = new Map(updatedValues.map((item) => [item.value, item]));

    //         // Convert the Map back to an array
    //         const uniqueArray = Array.from(uniqueSet.values());

    //         return uniqueArray;
    //     });

    //     // setValueEmployeeCat((prev) => {
    //     //     const uniqueValues = matchedValues.filter((value) => !prev.includes(value));
    //     //     const updatedValues = [...prev, ...uniqueValues];
    //     //     const uniqueSet = new Set(updatedValues); // Ensure uniqueness
    //     //     return Array.from(uniqueSet);
    //     // });

    // };

    const updateEmployees = (pastedNames) => {
        // Your existing update logic...
        const namesArray = Array.isArray(pastedNames) ? pastedNames : [];

        const availableOptions = allUsersData
            ?.filter(
                (comp) =>
                    selectedCompany?.map((item) => item?.value)?.includes(comp.company) &&
                    selectedBranch?.map((item) => item?.value)?.includes(comp.branch) &&
                    selectedUnit?.map((item) => item?.value)?.includes(comp.unit) &&
                    selectedTeam?.map((item) => item?.value)?.includes(comp.team)
            )
            ?.map(data => data.companyname.replace(/\s*\.\s*/g, ".").trim())

        const matchedValues = namesArray.filter((name) =>
            availableOptions.includes(name.replace(/\s*\.\s*/g, ".").trim())
        );

        setValueEmp(prev => [...new Set([...prev, ...matchedValues])]);
        // Update other states...
        setSelectedEmp(prev => {
            // If no matchedValues, return prev as-is
            if (!matchedValues || matchedValues.length === 0) return prev;

            // Convert matchedValues to the { label, value } format
            const newEntries = matchedValues.map(value => ({ label: value, value }));

            // Only add entries that don't already exist in prev (based on 'value')
            const uniqueNewEntries = newEntries.filter(
                newEntry => !prev.some(prevItem => prevItem.value === newEntry.value)
            );

            // Merge with previous state
            return [...prev, ...uniqueNewEntries];
        });
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
        // setValueEmployeeCat((current) => current.filter(empValue => empValue !== value));
    };

    const handleClear = (e) => {
        e.preventDefault();
        setAllIdleTimes([]);
        setFilteredDataItems([]);
        setFilterUser({ filtertype: "Individual", fromdate: today, todate: today });
        setSelectedMode("Today")
        setSelectedCompany([]);
        setSelectedBranch([]);
        setSelectedUnit([]);
        setSelectedDep([]);
        setSelectedEmp([]);
        setValueEmp([]);
        setPageIdleTime(1);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const getViewCode = async (id, defaultdate) => {
        setPageName(!pageName);
        try {
            let res = await axios.post(SERVICE.USER_IDLETIME_VIEW_TIME, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                userId: id,
                currentDate: defaultdate,
            });

            // To store hours grouped by company, branch, and date
            const groupedData = {};

            res?.data?.idletimesview?.forEach((item) => {
                const startTime = new Date(item.starttime);
                const endTime = new Date(item.endtime);

                // Format date
                const datePart = startTime.toISOString().split('T')[0]; // Format as yyyy/mm/dd

                // Use empcode and date as the key
                const key = `${item.empcode}-${datePart}`;

                const localStartTime = startTime.toLocaleString('en-GB', {
                    hour12: true,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });
                const localEndTime = endTime.toLocaleString('en-GB', {
                    hour12: true,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });

                // Split the string to get only the time part
                const startTimePart = localStartTime.split(', ')[1];
                const endTimePart = localEndTime.split(', ')[1];

                // Calculate the time difference in milliseconds
                const timeDiffInMs = endTime - startTime;

                // Calculate total hours, minutes, and seconds
                const totalSeconds = Math.floor(timeDiffInMs / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                // Format total hours as 0:26:00 hrs
                const formattedTotalHours = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                // Prepare time entries
                const timeEntry = {
                    start: startTimePart,
                    end: endTimePart,
                    total: formattedTotalHours,
                };

                // If the key exists, push the time entry, else initialize
                if (groupedData[key]) {
                    groupedData[key].timeArray.push(timeEntry);
                    // Accumulate total time in milliseconds
                    groupedData[key].totalTimeMs += timeDiffInMs;
                } else {
                    groupedData[key] = {
                        companyname: item.companyname,
                        empcode: item.empcode,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        department: item.department,
                        date: moment(datePart).format('DD/MM/YYYY'),
                        timeArray: [timeEntry],
                        totalTimeMs: timeDiffInMs // Initialize total time in milliseconds
                    };
                }
            });

            // Convert total milliseconds to formatted string for each entry
            for (const key in groupedData) {
                const totalSeconds = Math.floor(groupedData[key].totalTimeMs / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                groupedData[key].totalHoursFormatted = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} hrs`;
            }

            setIdleTimeView(groupedData);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        if (Object.keys(idleTimeView).length > 0) {
            setSelectedKey(Object.keys(idleTimeView)[0]); // Set the first key
        }
    }, [idleTimeView]);

    // Get the selected data based on the key
    const selectedData = selectedKey ? idleTimeView[selectedKey] : null;

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
                    filteredData.push(node.data);
                });
                setFilteredRowData(filteredData);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableIdleTime.current) {
            const gridApi = gridRefTableIdleTime.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesIdleTime = gridApi.paginationGetTotalPages();
            setPageIdleTime(currentPage);
            setTotalPagesIdleTime(totalPagesIdleTime);
        }
    }, []);

    const onPageSizeChange = useCallback((event) => {
        const value = event.target.value;

        if (value === 'ALL') {
            setPageSizeIdleTime(filteredDataItems.length); // Show all data
        } else {
            setPageSizeIdleTime(Number(value)); // Convert to number
        }

        // Optionally reset pagination to the first page when page size changes
        setPageIdleTime(1);
    }, [filteredDataItems.length]);

    const columnDataTableIdleTime = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityIdleTime.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityIdleTime.empcode, pinned: 'left', lockPinned: true, },
        { field: "companyname", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityIdleTime.companyname, pinned: 'left', lockPinned: true, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibilityIdleTime.date, },
        { field: "totalhours", headerName: "Total Hours", flex: 0, width: 120, hide: !columnVisibilityIdleTime.totalhours, },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibilityIdleTime.company, },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityIdleTime.branch, },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibilityIdleTime.unit, },
        { field: "team", headerName: "Team", flex: 0, width: 150, hide: !columnVisibilityIdleTime.team, },
        { field: "workmode", headerName: "Work Mode", flex: 0, width: 150, hide: !columnVisibilityIdleTime.workmode, },
        { field: "department", headerName: "Department", flex: 0, width: 200, hide: !columnVisibilityIdleTime.department, },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 90,
            minHeight: "40px !important",
            filter: false,
            sortable: false,
            hide: !columnVisibilityIdleTime.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("vhrmsidletimereport") && (
                        <Box>
                            <Button
                                sx={userStyle.buttonedit}
                                onClick={() => {
                                    handleClickOpenview();
                                    getViewCode(params.data.userid, params.data.defaultdate);
                                }}
                            >
                                <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                            </Button>
                        </Box>
                    )}
                </Grid>
            ),
        },
    ];

    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryIdleTime(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = allIdleTimes?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageIdleTime(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = allIdleTimes?.filter((item) => {
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
        // handleCloseSearchIdleTime(); 
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryIdleTime("");
        setFilteredDataItems(allIdleTimes);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableIdleTime.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryIdleTime;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesIdleTime) {
            setPageIdleTime(newPage);
            gridRefTableIdleTime.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeIdleTime(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityIdleTime };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityIdleTime(updatedVisibility);
    };

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityIdleTime", JSON.stringify(columnVisibilityIdleTime));
    }, [columnVisibilityIdleTime]);


    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityIdleTime");
        if (savedVisibility) {
            setColumnVisibilityIdleTime(JSON.parse(savedVisibility));
        }
    }, []);



    // Function to filter columns based on search query
    const filteredColumns = columnDataTableIdleTime.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageIdleTime.toLowerCase())
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

        setColumnVisibilityIdleTime((prevVisibility) => {
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

        setColumnVisibilityIdleTime((prevVisibility) => {
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
        setColumnVisibilityIdleTime((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = ["Emp Code", "Employee Name", "Date", "Total Hours", "Company", "Branch", "Unit", "Team", "Work Mode", "Department"]
    let exportRowValuescrt = ['empcode', 'companyname', 'date', 'totalhours', 'company', 'branch', 'unit', 'team', 'workmode', 'department']

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "HRMS Idle Time Report",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageIdleTime.current) {
            domtoimage.toBlob(gridRefImageIdleTime.current)
                .then((blob) => {
                    saveAs(blob, "HRMS Idle Time Report.png");
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

        const startPage = Math.max(1, pageIdleTime - 1);
        const endPage = Math.min(totalPagesIdleTime, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageIdleTime numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageIdleTime, show ellipsis
        if (endPage < totalPagesIdleTime) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageIdleTime - 1) * pageSizeIdleTime, pageIdleTime * pageSizeIdleTime);
    const totalPagesIdleTimeOuter = Math.ceil(filteredDataItems?.length / pageSizeIdleTime);
    const visiblePages = Math.min(totalPagesIdleTimeOuter, 3);
    const firstVisiblePage = Math.max(1, pageIdleTime - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesIdleTimeOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageIdleTime * pageSizeIdleTime;
    const indexOfFirstItem = indexOfLastItem - pageSizeIdleTime;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            <Headtitle title={"HRMS IDLE TIME REPORT"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="HRMS Idle Time Report"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="HRMS Idle Time Report"
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("lhrmsidletimereport") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}> HRMS Idle Time Report </Typography>
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
                                            setSelectedBranch([]);
                                            setSelectedEmp([]);
                                            setValueEmp([]); setSelectedDep([]);
                                            setSelectedUnit([]);
                                            setSelectedTeam([]);
                                        }}
                                        valueRenderer={customValueRendererCompany}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Type<b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        options={[
                                            { label: "Individual", value: "Individual" },
                                            { label: "Department", value: "Department" },
                                            { label: "Branch", value: "Branch" },
                                            { label: "Unit", value: "Unit" },
                                            { label: "Team", value: "Team" },
                                        ]}
                                        styles={colourStyles}
                                        value={{
                                            label: filterUser.filtertype,
                                            value: filterUser.filtertype,
                                        }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, filtertype: e.value });
                                            setSelectedBranch([]);
                                            setSelectedUnit([]);
                                            setSelectedTeam([]);
                                            setSelectedEmp([]);
                                            setValueEmp([]);
                                        }}
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
                                                    selectedCompany.map((item) => item.value).includes(comp.company)
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
                                                    selectedCompany.map((item) => item.value).includes(comp.company) && selectedBranch.map((item) => item.value).includes(comp.branch)
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
                                        <Typography>Team<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={Array.from(
                                                new Set(
                                                    allTeam
                                                        ?.filter(
                                                            (comp) =>
                                                                selectedBranch.map((item) => item.value).includes(comp.branch) && selectedUnit.map((item) => item.value).includes(comp.unit)
                                                        )
                                                        ?.map((com) => com.teamname)
                                                )
                                            ).map((teamname) => ({
                                                label: teamname,
                                                value: teamname,
                                            }))}
                                            value={selectedTeam}
                                            onChange={handleTeamChange}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                                :
                                ["Department"]?.includes(filterUser.filtertype) ?
                                    <>
                                        {/* Department */}
                                        <Grid item md={3} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography>
                                                    Department
                                                </Typography>
                                                <MultiSelect
                                                    options={alldepartment?.map(data => ({
                                                        label: data.deptname,
                                                        value: data.deptname,
                                                    })).filter((item, index, self) => {
                                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                    })}
                                                    value={selectedDep}
                                                    onChange={handleDepartmentChange}
                                                    valueRenderer={customValueRendererDepartment}
                                                    labelledBy="Please Select Department"
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
                                                                selectedCompany.map((item) => item.value).includes(comp.company)
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
                                                                    selectedCompany.map((item) => item.value).includes(comp.company)
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
                                                                    selectedCompany.map((item) => item.value).includes(comp.company) && selectedBranch.map((item) => item.value).includes(comp.branch)
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
                                            : ""
                            }

                            {["Individual"]?.includes(filterUser.filtertype) && (
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Employee<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <div
                                            onPaste={handlePasteForEmp}
                                            style={{ position: 'relative' }}
                                        >
                                            <MultiSelect
                                                options={allUsersData
                                                    ?.filter(
                                                        (u) =>
                                                            selectedCompany?.map((item) => item?.value)?.includes(u.company) &&
                                                            selectedBranch?.map((item) => item?.value)?.includes(u.branch) &&
                                                            selectedUnit?.map((item) => item?.value)?.includes(u.unit) &&
                                                            selectedTeam?.map((item) => item?.value)?.includes(u.team)
                                                    )
                                                    .map((u) => ({
                                                        label: u.companyname,
                                                        value: u.companyname,
                                                    }))}
                                                value={selectedEmp}
                                                onChange={(e) => {
                                                    handleEmployeeChange(e);
                                                }}
                                                valueRenderer={customValueRendererEmp}
                                                labelledBy="Please Select Employee"
                                                // Add these props if your MultiSelect supports them
                                                inputValue={searchInputValue} // Add this state if needed
                                                onInputChange={(newValue) => setSearchInputValue(newValue)}
                                            />
                                        </div>
                                    </FormControl>
                                </Grid>
                            )}
                            {["Individual"]?.includes(filterUser.filtertype) &&
                                <Grid item md={6} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Selected Employees</Typography>
                                        <div
                                            id="paste-box" // Add an ID to the Box
                                            tabIndex={0} // Make the div focusable
                                            style={{
                                                border: '1px solid #ccc',
                                                borderRadius: '3.75px',
                                                height: '110px',
                                                overflow: 'auto',
                                            }}
                                            onPaste={handlePasteForEmp}
                                            onFocus={() => setIsBoxFocused(true)} // Set focus state to true
                                            onBlur={(e) => {
                                                if (isBoxFocused) {
                                                    e.target.focus(); // Refocus only if the Box was previously focused
                                                }
                                            }}
                                        >
                                            {valueEmp.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    clickable
                                                    sx={{ margin: 0.2, backgroundColor: "#FFF" }}
                                                    onDelete={(e) => handleDelete(e, value)}
                                                    onClick={() => console.log("clicked chip")}
                                                />
                                            ))}
                                        </div>
                                    </FormControl>
                                </Grid>
                            }
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
                            <Grid item lg={1} md={2} sm={2} xs={6} >
                                <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                    <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleSubmit} > Filter </Button>
                                </Box>
                            </Grid>
                            <Grid item lg={1} md={2} sm={2} xs={6}>
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
                            <Typography sx={userStyle.importheadtext}> HRMS Idle Time Report List</Typography>
                        </Grid>
                        <Grid container spacing={1} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeIdleTime}
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
                                        <MenuItem value={allIdleTimes?.length}>  All </MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                                <Box>
                                    {isUserRoleCompare?.includes("ehrmsidletimereport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvhrmsidletimereport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printhrmsidletimereport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfhrmsidletimereport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagehrmsidletimereport") && (
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchIdleTime} />
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
                        </Grid><br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsIdleTime}> Manage Columns  </Button><br /><br />
                        {loader ?
                            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageIdleTime} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableIdleTime.filter((column) => columnVisibilityIdleTime[column.field])}
                                        ref={gridRefTableIdleTime}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSizeSelector={[]}
                                        paginationPageSize={pageSizeIdleTime}
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
                                <Box style={userStyle.dataTablestyle}>
                                    {/* show and hide based on the inner filter and outer filter */}
                                    {/* <Box>
                                        Showing{" "}
                                        {filteredRowData.length > 0
                                            ? (filteredRowData.length > 0 ? (pageIdleTime - 1) * pageSizeIdleTime + 1 : 0)
                                            : (filteredDataItems.length > 0 ? (pageIdleTime - 1) * pageSizeIdleTime + 1 : 0)}
                                        {" "}to{" "}
                                        {filteredRowData.length > 0
                                            ? Math.min(pageIdleTime * pageSizeIdleTime, filteredRowData.length)
                                            : Math.min(pageIdleTime * pageSizeIdleTime, filteredDataItems.length)}
                                        {" "}of{" "}
                                        {filteredRowData.length > 0 ? filteredRowData.length : filteredDataItems.length} entries
                                    </Box> */}
                                    {/* <Box>
                                        Showing{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                (filteredDataItems.length > 0 ? (pageIdleTime - 1) * pageSizeIdleTime + 1 : 0)
                                            ) : (
                                                filteredRowData.length > 0 ? (pageIdleTime - 1) * pageSizeIdleTime + 1 : 0
                                            )
                                        }{" "}to{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                Math.min(pageIdleTime * pageSizeIdleTime, filteredDataItems.length)
                                            ) : (
                                                filteredRowData.length > 0 ? Math.min(pageIdleTime * pageSizeIdleTime, filteredRowData.length) : 0
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
                                        <Button onClick={() => handlePageChange(1)} disabled={pageIdleTime === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChange(pageIdleTime - 1)} disabled={pageIdleTime === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
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
                                                className={pageIdleTime === pageNumber ? "active" : ""}
                                                disabled={pageIdleTime === pageNumber}
                                            // disabled={pageNumber === "..."}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChange(pageIdleTime + 1)} disabled={pageIdleTime === totalPagesIdleTime} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChange(totalPagesIdleTime)} disabled={pageIdleTime === totalPagesIdleTime} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                    </Box> */}
                                </Box>
                            </>
                        } {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* Manage Column */}
            <Popover
                id={idManageColumnsIdleTime}
                open={isManageColumnsOpenIdleTime}
                anchorEl={anchorElIdleTime}
                onClose={handleCloseManageColumnsIdleTime}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsIdleTime}
                    searchQuery={searchQueryManageIdleTime}
                    setSearchQuery={setSearchQueryManageIdleTime}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityIdleTime}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityIdleTime}
                    initialColumnVisibility={initialColumnVisibilityIdleTime}
                    columnDataTable={columnDataTableIdleTime}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchIdleTime}
                open={openSearchIdleTime}
                anchorEl={anchorElSearchIdleTime}
                onClose={handleCloseSearchIdleTime}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableIdleTime} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryIdleTime} handleCloseSearch={handleCloseSearchIdleTime} />
            </Popover>

            {/* ALERT DIALOG */}
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
                itemsTwo={allIdleTimes ?? []}
                filename={"HRMS Idle Time Report"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />

            {/* View Model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" sx={{ marginTop: '95px' }}>
                <DialogContent >
                    <Box sx={{ width: "800px", padding: "20px 50px", }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>View HRMS Idle Time</Typography> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={6} sm={6}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Employee : </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ marginTop: '5px' }}>{selectedData ? selectedData.companyname : ''}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Emp Code : </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ marginTop: '5px' }}>{selectedData ? selectedData.empcode : ''}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Date : </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ marginTop: '5px' }}>{selectedData ? selectedData.date : ''}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Department : </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ marginTop: '5px' }}>{selectedData ? selectedData.department : ''}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Company : </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ marginTop: '5px' }}>{selectedData ? selectedData.company : ''}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Branch : </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ marginTop: '5px' }}>{selectedData ? selectedData.branch : ''}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12}>
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Unit : </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ marginTop: '5px' }}>{selectedData ? selectedData.unit : ''}</Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography variant="h6">Team : </Typography>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} >
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ marginTop: '5px' }}>{selectedData ? selectedData.team : ''}</Typography>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12} xs={12} sm={12} sx={{
                                    '& .css-11xur9t-MuiPaper-root-MuiTableContainer-root': {
                                        boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 3px rgba(0, 0, 0, 0.12)'
                                    }
                                }}>
                                    <TableContainer component={Paper}>
                                        < Table aria- label="customized table" id="idletimetable">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><Typography variant="h6">Start Time</Typography></TableCell>
                                                    <TableCell><Typography variant="h6">End Time</Typography></TableCell>
                                                    <TableCell><Typography variant="h6">Total Hours</Typography></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody align="left">
                                                {selectedData &&
                                                    selectedData.timeArray?.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{row.start}</TableCell>
                                                            <TableCell>{row.end}</TableCell>
                                                            <TableCell>{`${row.total} hrs`}</TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableCell></TableCell>
                                                <TableCell>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {selectedData && selectedData.timeArray
                                                            ? (() => {
                                                                let totalSeconds = 0;

                                                                // Loop through each time entry to sum the total seconds
                                                                selectedData.timeArray.forEach(row => {

                                                                    // Split the total into hours, minutes, and seconds
                                                                    const timeParts = row.total.split(':').map(Number);

                                                                    // Check if timeParts has exactly 3 elements (hours, minutes, seconds)
                                                                    if (timeParts.length === 3) {
                                                                        const [hours, minutes, seconds] = timeParts;
                                                                        totalSeconds += (hours * 3600) + (minutes * 60) + seconds; // Convert all to seconds
                                                                    } else {
                                                                        console.warn('Invalid total format:', row.total);
                                                                    }
                                                                });

                                                                // Calculate hours, minutes, and seconds from total seconds
                                                                const totalHours = Math.floor(totalSeconds / 3600);
                                                                const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
                                                                const remainingSeconds = totalSeconds % 60;

                                                                // Format total time as HH:MM:SS
                                                                return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')} hrs`;
                                                            })()
                                                            : '00:00:00'}
                                                    </Typography>
                                                </TableCell>
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleCloseview}>
                                    {" "}
                                    Back{" "}
                                </Button>
                            </Grid>
                        </>
                    </Box>
                </DialogContent >
            </Dialog >
        </Box >
    );
}

export default IdleTimeList;