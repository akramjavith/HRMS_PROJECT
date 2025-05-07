import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import { FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, FormControl, Grid, Button, Select, MenuItem, Popover, Dialog, DialogActions, InputAdornment, IconButton, Tooltip, CircularProgress, Checkbox, Chip } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import AdvancedSearchBar from '../../../components/SearchbarEbList.js';
import Headtitle from "../../../components/Headtitle";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import moment from 'moment';
import LoadingButton from "@mui/lab/LoadingButton";
import { DeleteConfirmation, PleaseSelectRow, } from "../../../components/DeleteConfirmation.js";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

// function CircularProgressWithLabel(props) {
//     return (
//         <Box sx={{ position: 'relative', display: 'inline-flex' }}>
//             <CircularProgress variant="determinate" {...props} />
//             <Box
//                 sx={{
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     position: 'absolute',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                 }}
//             >
//                 <Typography
//                     variant="caption"
//                     component="div"
//                     sx={{ color: 'text.secondary' }}
//                 >
//                     {`${Math.round(props.value)}%`}
//                 </Typography>
//             </Box>
//         </Box>
//     );
// }

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                {...props}
                sx={{
                    animation: props.value === 100 ? 'spin 1s linear infinite' : 'none',
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    // sx={{ color: 'text.secondary' }}
                    sx={{ color: 'white' }}
                >
                    {props.value === 100 ? 'Completing...' : `${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

function AttendanceBulkUpdateList() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const gridRefTableAttBulkUpdate = useRef(null);
    const gridRefImageAttBulkUpdate = useRef(null);
    const gridRefTableAttBulkUpdatePayRun = useRef(null);
    const gridRefImageAttBulkUpdatePayRun = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, allUsersLimit, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const [allUsers, setAllUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [remainingUsers, setRemainingUsers] = useState([]);
    const [filterUser, setFilterUser] = useState({ fromdate: today, todate: today, shiftmode: "Please Select Shift Mode", mode: "Please Select Mode", status: "Please Select Status", clinhour: '', clinminute: '', clinseconds: '', timeperiod: '', autoclockoutcheck: false });
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [payRunMatchedEmp, setPayRunMatchedEmp] = useState([]);

    // State to track advanced filter
    const [advancedFilterAttBulkUpdate, setAdvancedFilterAttBulkUpdate] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItemsAttBulkUpdate, setFilteredDataItemsAttBulkUpdate] = useState(remainingUsers);
    const [filteredRowDataAttBulkUpdate, setFilteredRowDataAttBulkUpdate] = useState([]);

    // State to track advanced filter
    const [advancedFilterAttBulkUpdatePayRun, setAdvancedFilterAttBulkUpdatePayRun] = useState(null);
    const [gridApiPayRun, setGridApiPayRun] = useState(null);
    const [columnApiPayRun, setColumnApiPayRun] = useState(null);
    const [filteredDataItemsAttBulkUpdatePayRun, setFilteredDataItemsAttBulkUpdatePayRun] = useState(payRunMatchedEmp);
    const [filteredRowDataAttBulkUpdatePayRun, setFilteredRowDataAttBulkUpdatePayRun] = useState([]);

    const [selectedCompany, setSelectedCompany] = useState([]);
    const [valueCompany, setValueCompany] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [valueBranch, setValueBranch] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [valueUnit, setValueUnit] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [valueTeam, setValueTeam] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [valueEmp, setValueEmp] = useState([]);

    // get month and year
    const currentYear = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    const currentDate1Adj = new Date();

    const [isMonthyear, setIsMonthYear] = useState({ ismonth: month, isyear: currentYear, isuser: "" });

    // Datatable Set Table
    const [pageAttBulkUpdate, setPageAttBulkUpdate] = useState(1);
    const [pageSizeAttBulkUpdate, setPageSizeAttBulkUpdate] = useState(10);
    const [searchQueryAttBulkUpdate, setSearchQueryAttBulkUpdate] = useState("");
    const [totalPagesAttBulkUpdate, setTotalPagesAttBulkUpdate] = useState(1);

    // Datatable Set Table
    const [pageAttBulkUpdatePayRun, setPageAttBulkUpdatePayRun] = useState(1);
    const [pageSizeAttBulkUpdatePayRun, setPageSizeAttBulkUpdatePayRun] = useState(10);
    const [searchQueryAttBulkUpdatePayRun, setSearchQueryAttBulkUpdatePayRun] = useState("");
    const [totalPagesAttBulkUpdatePayRun, setTotalPagesAttBulkUpdatePayRun] = useState(1);

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

    // Edit model Clock Out
    const [openClkOutAlert, setOpenClkOutAlert] = useState(false);
    const handleClickOpenClkOutAlert = () => { setOpenClkOutAlert(true); };
    const handleCloseClkOutAlert = () => { setOpenClkOutAlert(false); setRemainingUsers([]); }

    // Edit model Pay Run
    const [openClkOutAlertPayRun, setOpenClkOutAlertPayRun] = useState(false);
    const handleClickOpenClkOutAlertPayRun = () => { setOpenClkOutAlertPayRun(true); };
    const handleCloseClkOutAlertPayRun = () => { setOpenClkOutAlertPayRun(false); setPayRunMatchedEmp([]); }

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    // Search bar
    const [anchorElSearchAttBulkUpdate, setAnchorElSearchAttBulkUpdate] = React.useState(null);
    const handleClickSearchAttBulkUpdate = (event) => {
        setAnchorElSearchAttBulkUpdate(event.currentTarget);
    };
    const handleCloseSearchAttBulkUpdate = () => {
        setAnchorElSearchAttBulkUpdate(null);
        setSearchQueryAttBulkUpdate("");
    };

    const openSearchAttBulkUpdate = Boolean(anchorElSearchAttBulkUpdate);
    const idSearchAttBulkUpdate = openSearchAttBulkUpdate ? 'simple-popover' : undefined;

    // Search bar
    const [anchorElSearchAttBulkUpdatePayRun, setAnchorElSearchAttBulkUpdatePayRun] = React.useState(null);
    const handleClickSearchAttBulkUpdatePayRun = (event) => {
        setAnchorElSearchAttBulkUpdatePayRun(event.currentTarget);
    };
    const handleCloseSearchAttBulkUpdatePayRun = () => {
        setAnchorElSearchAttBulkUpdatePayRun(null);
        setSearchQueryAttBulkUpdatePayRun("");
    };

    const openSearchAttBulkUpdatePayRun = Boolean(anchorElSearchAttBulkUpdatePayRun);
    const idSearchAttBulkUpdatePayRun = openSearchAttBulkUpdatePayRun ? 'simple-popover' : undefined;

    const modeOptions = [
        { label: 'Update Clockin', value: "Update Clockin" },
        { label: "Update Clockout", value: "Update Clockout" },
        { label: "Update Both", value: "Update Both" },
    ];

    const shiftModeOptions = [
        { label: 'Main Shift', value: "Main Shift" },
        { label: "Second Shift", value: "Second Shift" },
    ];

    const clockinStatusOptions = [
        { label: "Shift Start Time", value: "Shift Start Time" },
        { label: "Manual", value: "Manual" },
    ]

    const clockoutStatusOptions = [
        { label: "Shift End Time", value: "Shift End Time" },
        { label: "Manual", value: "Manual" },
    ]

    const minutssecOptions = [
        { value: "00", label: "00" },
        { value: "01", label: "01" },
        { value: "02", label: "02" },
        { value: "03", label: "03" },
        { value: "04", label: "04" },
        { value: "05", label: "05" },
        { value: "06", label: "06" },
        { value: "07", label: "07" },
        { value: "08", label: "08" },
        { value: "09", label: "09" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
        { value: "16", label: "16" },
        { value: "17", label: "17" },
        { value: "18", label: "18" },
        { value: "19", label: "19" },
        { value: "20", label: "20" },
        { value: "21", label: "21" },
        { value: "22", label: "22" },
        { value: "23", label: "23" },
        { value: "24", label: "24" },
        { value: "25", label: "25" },
        { value: "26", label: "26" },
        { value: "27", label: "27" },
        { value: "28", label: "28" },
        { value: "29", label: "29" },
        { value: "30", label: "30" },
        { value: "31", label: "31" },
        { value: "32", label: "32" },
        { value: "33", label: "33" },
        { value: "34", label: "34" },
        { value: "35", label: "35" },
        { value: "36", label: "36" },
        { value: "37", label: "37" },
        { value: "38", label: "38" },
        { value: "39", label: "39" },
        { value: "40", label: "40" },
        { value: "41", label: "41" },
        { value: "42", label: "42" },
        { value: "43", label: "43" },
        { value: "44", label: "44" },
        { value: "45", label: "45" },
        { value: "46", label: "46" },
        { value: "47", label: "47" },
        { value: "48", label: "48" },
        { value: "49", label: "49" },
        { value: "50", label: "50" },
        { value: "51", label: "51" },
        { value: "52", label: "52" },
        { value: "53", label: "53" },
        { value: "54", label: "54" },
        { value: "55", label: "55" },
        { value: "56", label: "56" },
        { value: "57", label: "57" },
        { value: "58", label: "58" },
        { value: "59", label: "59" }];

    const hrsOptions = [
        { value: "01", label: "01" },
        { value: "02", label: "02" },
        { value: "03", label: "03" },
        { value: "04", label: "04" },
        { value: "05", label: "05" },
        { value: "06", label: "06" },
        { value: "07", label: "07" },
        { value: "08", label: "08" },
        { value: "09", label: "09" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" }
    ];

    const timeoptions = [
        { value: "AM", label: "AM" },
        { value: "PM", label: "PM" },
    ]

    const [selectedMode, setSelectedMode] = useState("Today");
    const mode = [
        { label: "Today", value: "Today" },
        { label: "Yesterday", value: "Yesterday" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    let initialColumnVisibilityAttBulkUpdate = {
        serialNumber: true,
        companyname: true,
    }
    const [columnVisibilityAttBulkUpdate, setColumnVisibilityAttBulkUpdate] = useState(initialColumnVisibilityAttBulkUpdate);

    let initialColumnVisibilityAttBulkUpdatePayRun = {
        serialNumber: true,
        companyname: true,
    }
    const [columnVisibilityAttBulkUpdatePayRun, setColumnVisibilityAttBulkUpdatePayRun] = useState(initialColumnVisibilityAttBulkUpdatePayRun);

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
            pagename: String("Attendance Bulk Update"),
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

    // page refersh reload code
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
        setValueCompany(company.map(a => a.value));

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
        setValueBranch(branch.map(a => a.value));

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
        setValueUnit(unit.map(a => a.value));

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
        // const allemployees = allUsersLimit
        //     ?.filter(val =>
        //         company.some(comp => comp.value === val.company) &&
        //         branch.some(br => br.value === val.branch) &&
        //         unit.some(uni => uni.value === val.unit) &&
        //         team.some(team => team.value === val.team)
        //     )
        //     .map(data => ({
        //         label: data.companyname,
        //         value: data.companyname,
        //     }));
        // setSelectedEmp(allemployees);
        // setValueEmp(allemployees.map(a => a.value));
    }, [isAssignBranch]);

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
        setSelectedEmp([]);
        setValueEmp([]);
    };

    const customValueRendererCompany = (valueCompany, _categoryname) => {
        return valueCompany?.length
            ? valueCompany.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect dropdown changes
    const handleBranchChange = (options) => {
        setSelectedBranch(options);
        setValueBranch(options.map((a, index) => {
            return a.value
        }))
        setSelectedUnit([]);
        setValueUnit([]);
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
    };
    const customValueRendererBranch = (valueBranch, _employeename) => {
        return valueBranch.length
            ? valueBranch.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };

    //unit multiselect dropdown changes
    const handleUnitChange = (options) => {
        setSelectedUnit(options);
        setValueUnit(options.map((a, index) => {
            return a.value
        }));
        setSelectedTeam([]);
        setValueTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
    };
    const customValueRendererUnit = (valueUnit, _employeename) => {
        return valueUnit.length
            ? valueUnit.map(({ label }) => label).join(", ")
            : "Please Select Unit";
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

    // Employee multiselect
    const handleEmployeeChange = (options) => {
        setValueEmp(options.map(option => option.value))
        fetchSelectedUsersForBulkUpdate(options.map(option => option.value));
        setSelectedEmp(options);
    };

    const customValueRendererEmp = (valueEmp, _employees) => {
        return valueEmp.length
            ? valueEmp.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

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
            return '';
        }
        return date.toISOString().split("T")[0];
    };

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

    const [employees, setEmployees] = useState([]);
    const [autoClkOutEmp, setAutoClkOutEmp] = useState([]);
    const [getUserData, setGetUsersData] = useState([]);
    const [btnSubmit, setBtnSubmit] = useState(false);

    const fetchUsersAttBulkUpdate = async (selectedShiftMode) => {
        setPageName(!pageName)
        setAllUsers([]);
        setEmployees([]);
        setAutoClkOutEmp([]);
        setSelectedEmp([]);
        setValueEmp([]);

        let startMonthDate = new Date(filterUser.fromdate);
        let endMonthDate = new Date(!filterUser.autoclockoutcheck ? filterUser.todate : filterUser.fromdate);

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
            let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_WITH_SHIFTMODE_FILTER_BULK_UPDATE, {
                shiftmode: selectedShiftMode,
                userDates: daysArray,
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                }
            })
            if (res?.data?.finaluser.length === 0) {
                setEmployees([]);
                setAutoClkOutEmp([]);
                setSelectedEmp([]);
                setValueEmp([]);
                setPopupContentMalert(`No data available for "${selectedShiftMode}" mode`);
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
                setEmployees([]);
                setAutoClkOutEmp([]);
                setSelectedEmp([]);
                setValueEmp([]);
            } else {
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

                const finalresult = filteredBatch?.filter((data) => {
                    return data.shift !== "Week Off" && data.shift !== "Not Allotted"
                });


                if (!filterUser.autoclockoutcheck) {
                    setEmployees(finalresult);
                    setAutoClkOutEmp([]);
                }
                else {
                    const [year, month, day] = filterUser.fromdate?.split('-');
                    const formattedDate = `${day}-${month}-${year}`;

                    const res = await axios.post(SERVICE.AUTOCLOCKOUT_USER_FOR_ATTENDANCE_BULK_UPDATE_REPORT_FILTER, {
                        date: formattedDate,
                    }, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    });

                    if (res.data.attendance.length === 0) {
                        setPopupContentMalert("No auto clock out employee!");
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                    } else {
                        const filteredResult = finalresult?.filter(data => res.data.attendance?.includes(data.userid));
                        setEmployees([]);
                        setAutoClkOutEmp(filteredResult);
                        // console.log(res.data.attendance, 'res.data.attendance')
                        // console.log(filteredResult, 'filteredResult')
                    }
                }


                setGetUsersData(finalresult);


                // const response = await axios.get("https://api.ipify.org?format=json");
                // console.log(finalresult.length, 'finalresult.lengt')
                // let finalpayrundatas = [];
                // for (const item of finalresult) {
                //     try {
                //         // Make the API call
                //         // const res_payrun = await axios.post(SERVICE.CHECK_PAYRUN_ISCREATED_FOR_ATTENDANCE_BULK_UPDATE, {
                //         //     headers: {
                //         //         Authorization: `Bearer ${auth.APIToken}`,
                //         //     },
                //         //     department: item.department,
                //         //     fromdate: filterUser.fromdate,
                //         //     todate: !filterUser.autoclockoutcheck ? filterUser.todate : filterUser.fromdate,
                //         // });

                //         const [day, month, year] = item.rowformattedDate?.split('/');
                //         const formattedDateSplit = `${year}-${month}-${day}`;

                //         let res_payrun = await axios.post(SERVICE.CHECK_PAYRUN_ISCREATED_FOR_ATTENDANCE, {
                //             headers: {
                //                 Authorization: `Bearer ${auth.APIToken}`,
                //             },
                //             department: item.department,
                //             date: formattedDateSplit,
                //         });

                //         const givenDate = new Date(formattedDateSplit);
                //         const today = new Date();
                //         const diffInMs = today - givenDate;

                //         // Convert milliseconds to days
                //         const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

                //         // Condition: Check if the difference is more than 5 days
                //         const isMoreThan5Days = diffInDays > 5;

                //         const isPayrunGenerated = res_payrun?.data?.payrunlist.length > 0 && isMoreThan5Days;
                //         // console.log(isPayrunGenerated, diffInDays, isMoreThan5Days, 'isPayrunGenerated')
                //         console.log(res_payrun?.data?.payrunlist, 'res_payrun?.data?.payrunlist')
                //         let payRunData = [];
                //         res_payrun?.data?.payrunlist?.map((payrundata) => payRunData.push(payrundata.data));
                //         if (isPayrunGenerated) {
                //             payRunData.map(val => {
                //                 if (val.companyname === item.username) {
                //                     // console.log(val.companyname, item.username, val.companyname === item.username)
                //                     finalpayrundatas.push(val.companyname);
                //                 }
                //             });

                //         }
                //         setPayRunMatchedEmp(finalpayrundatas)
                //     } catch (error) {
                //         console.error('Error fetching payrun data:', error);
                //     }
                // }
                // finalpayrundatas = [...new Set(finalpayrundatas)];
                // console.log(finalpayrundatas, 'payrundatas');
                // // console.log(finalpayrundatas.length, 'payrundatas');
                // // console.log(finalresult.filter((data) => !finalpayrundatas.includes(data.username)))

                // const itemsWithSerialNumber = finalresult
                //     // .filter((data) => !finalpayrundatas.includes(data.username))?
                //     .map((item, index) => {
                //         return {
                //             userid: item.userid,
                //             username: item.rowusername,
                //             companyname: item.username,
                //             shiftmode: item.shiftMode,
                //             shift: item.shift,
                //             date: moment(item.rowformattedDate, "DD/MM/YYYY").format("DD-MM-YYYY"),
                //             shiftendtime: item.shift?.split("to")[1],
                //             clockinipaddress: String(response?.data?.ip),
                //             clockoutipaddress: String(response?.data?.ip),
                //         }
                //     });

                // setAllUsers(itemsWithSerialNumber);
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchSelectedUsersForBulkUpdate = async (selectedEmployee) => {
        setPageName(!pageName);
        setBtnSubmit(true);
        // setAllUsers([]);
        // setEmployees([]);
        // setAutoClkOutEmp([]);
        // setSelectedEmp([]);
        // setValueEmp([]);

        try {
            // console.log(selectedEmployee, 'selectedEmployee')

            const response = await axios.get("https://api.ipify.org?format=json");

            const filteredSelectedEmp = getUserData.filter(data => selectedEmployee?.includes(data.username));
            // console.log(filteredSelectedEmp, 'filteredSelectedEmp')
            let finalpayrundatas = [];
            let payrunData = [];
            for (const item of filteredSelectedEmp) {
                try {
                    const [day, month, year] = item.rowformattedDate?.split('/');
                    const formattedDateSplit = `${year}-${month}-${day}`;

                    let res_payrun = await axios.post(SERVICE.CHECK_PAYRUN_ISCREATED_FOR_ATTENDANCE, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        department: item.department,
                        date: formattedDateSplit,
                    });

                    const givenDate = new Date(formattedDateSplit);
                    const today = new Date();
                    const diffInMs = today - givenDate;

                    // Convert milliseconds to days
                    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

                    // Condition: Check if the difference is more than 5 days
                    const isMoreThan5Days = diffInDays > 5;

                    const isPayrunGenerated = res_payrun?.data?.payrunlist.length > 0 && isMoreThan5Days;
                    // console.log(isPayrunGenerated, diffInDays, isMoreThan5Days, 'isPayrunGenerated')

                    if (isPayrunGenerated) {
                        res_payrun?.data?.payrunlist?.map((payrundata) => {
                            payrundata.data.map(val => {
                                if (val.companyname === item.username && val.department === item.department) {
                                    finalpayrundatas.push(val.companyname);
                                    payrunData.push({ id: val._id, companyname: val.companyname });
                                    setBtnSubmit(true);
                                }
                            });
                        });
                    }

                    const itemsWithSerialNumberData = payrunData?.map((item, index) => (
                        {
                            ...item,
                            serialNumber: index + 1,
                        }));
                    setPayRunMatchedEmp(itemsWithSerialNumberData);
                    setFilteredDataItemsAttBulkUpdatePayRun(itemsWithSerialNumberData);
                    setSearchQueryAttBulkUpdatePayRun("");
                    setTotalPagesAttBulkUpdatePayRun(Math.ceil(itemsWithSerialNumberData.length / pageSizeAttBulkUpdatePayRun));
                    // console.log(payrunData.length, 'payrunData');

                } catch (error) {
                    console.error('Error fetching payrun data:', error);
                }
            }
            finalpayrundatas = [...new Set(finalpayrundatas)];
            // console.log(finalpayrundatas, 'payrundatas');
            // console.log(finalpayrundatas.length, 'payrundatas');
            // console.log(finalresult.filter((data) => !finalpayrundatas.includes(data.username)))

            const itemsWithSerialNumber = getUserData
                ?.filter((data) => !finalpayrundatas.includes(data.username))
                ?.map((item) => {
                    return {
                        userid: item.userid,
                        username: item.rowusername,
                        companyname: item.username,
                        shiftmode: item.shiftMode,
                        shift: item.shift,
                        date: moment(item.rowformattedDate, "DD/MM/YYYY").format("DD-MM-YYYY"),
                        shiftendtime: item.shift?.split("to")[1],
                        clockinipaddress: String(response?.data?.ip),
                        clockoutipaddress: String(response?.data?.ip),
                    }
                });

            setAllUsers(itemsWithSerialNumber);
            setBtnSubmit(false);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {

        const handlePaste = (event) => {
            event.preventDefault();

            let pastedText = event.clipboardData.getData("text");

            // Normalize the pasted text
            pastedText = pastedText.replace(/\r?\n/g, ",");

            // Split by commas (not spaces)
            const pastedNames = pastedText
                .split(",")
                .map(name => name.replace(/\s*\.\s*/g, ".").trim())
                .filter(name => name !== "");

            // Get available options
            const availableOptions = allUsersLimit
                ?.filter(
                    (comp) =>
                        valueCompany?.includes(comp.company) &&
                        selectedBranch?.map(data => data.value)?.includes(comp.branch) &&
                        selectedUnit?.map(data => data.value)?.includes(comp.unit) &&
                        selectedTeam?.map(data => data.value)?.includes(comp.team)
                )
                ?.map(data => ({
                    label: data.companyname.replace(/\s*\.\s*/g, ".").trim(),
                    value: data.companyname.replace(/\s*\.\s*/g, ".").trim(),
                }))
                .filter((item, index, self) =>
                    self.findIndex((i) => i.label === item.label && i.value === item.value) === index
                );

            // Use Set for fast lookup
            const pastedSet = new Set(pastedNames);
            const matchedEmployees = availableOptions.filter(option => pastedSet.has(option.label));

            if (employees.length === 0 && autoClkOutEmp.length === 0) {
                setEmployees([]);
                setAutoClkOutEmp([]);
                setSelectedEmp([]);
                setValueEmp([]);
                setPopupContentMalert(`No data available for selected mode`);
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
                setEmployees([]);
                setAutoClkOutEmp([]);
                setSelectedEmp([]);
                setValueEmp([]);
            }
            else {
                if (employees.length > 0 && autoClkOutEmp.length === 0) {
                    const finalMatchedEmployees = [];
                    matchedEmployees.filter(item => {
                        employees.map(data => {
                            if (data.companyname === item.value) {
                                finalMatchedEmployees.push(item);
                            }
                        })
                    })
                    // Update state using previous state to prevent replacement
                    setSelectedEmp((prevUsers) => {
                        const mergedSelection = [...prevUsers, ...finalMatchedEmployees];
                        const uniqueSelection = Array.from(new Map(mergedSelection.map(emp => [emp.value, emp])).values());
                        return uniqueSelection;
                    });

                    setValueEmp((prevUsers) => {
                        const mergedSelection = [...prevUsers, ...finalMatchedEmployees.map(emp => emp.value)];
                        return [...new Set(mergedSelection)];
                    });
                }
                if (autoClkOutEmp.length > 0 && employees.length === 0) {

                    const finalMatchedEmployees = [];
                    matchedEmployees.filter(item => {
                        autoClkOutEmp.map(data => {
                            if (data.companyname === item.value) {
                                finalMatchedEmployees.push(item);
                            }
                        })
                    })

                    // Update state using previous state to prevent replacement
                    setSelectedEmp((prevUsers) => {
                        const mergedSelection = [...prevUsers, ...finalMatchedEmployees];
                        const uniqueSelection = Array.from(new Map(mergedSelection.map(emp => [emp.value, emp])).values());
                        return uniqueSelection;
                    });

                    setValueEmp((prevUsers) => {
                        const mergedSelection = [...prevUsers, ...finalMatchedEmployees.map(emp => emp.value)];
                        return [...new Set(mergedSelection)];
                    });
                }
            }
        };

        window.addEventListener("paste", handlePaste);

        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, [employees, autoClkOutEmp, allUsersLimit, valueCompany, selectedBranch, selectedUnit, selectedTeam]);

    const handleDelete = (e, value) => {
        e.preventDefault();
        setSelectedEmp((current) => current.filter((emp) => emp.value !== value));
        setValueEmp((current) => current.filter((empValue) => empValue !== value));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        if (selectedCompany?.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedBranch?.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedUnit?.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedTeam?.length === 0) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.shiftmode === "Please Select Shift Mode") {
            setPopupContentMalert("Please Select Shift Mode");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmp?.length === 0) {
            setPopupContentMalert("Please Select Employee");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.fromdate === '' && filterUser.todate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.mode === "Please Select Mode") {
            setPopupContentMalert("Please Select Mode");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.mode !== "Update Both" && filterUser.status === "Please Select Status") {
            setPopupContentMalert("Please Select Status");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((filterUser.mode === "Update Clockin" || filterUser.mode === "Update Clockout") && filterUser.status === "Manual" && filterUser.clinhour === '') {
            setPopupContentMalert("Please Select Hour");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((filterUser.mode === "Update Clockin" || filterUser.mode === "Update Clockout") && filterUser.status === "Manual" && filterUser.clinminute === '') {
            setPopupContentMalert("Please Select Minutes");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((filterUser.mode === "Update Clockin" || filterUser.mode === "Update Clockout") && filterUser.status === "Manual" && filterUser.clinseconds === '') {
            setPopupContentMalert("Please Select Seconds");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if ((filterUser.mode === "Update Clockin" || filterUser.mode === "Update Clockout") && filterUser.status === "Manual" && filterUser.timeperiod === '') {
            setPopupContentMalert("Please Select AM/PM");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            // sendRequest();
            // fetchUsersAttBulkUpdate();
            handleClickOpen();
        }
    }

    const handleFilterClear = async (e) => {
        e.preventDefault();
        setAllUsers([]);
        setFilterUser({ fromdate: today, todate: today, shiftmode: "Please Select Shift Mode", mode: "Please Select Mode", status: "Please Select Status", clinhour: '', clinminute: '', clinseconds: '', timeperiod: '', autoclockoutcheck: false });
        setSelectedMode("Today");
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
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }

    const sendRequest = async () => {
        setPageName(!pageName);
        handleCloseClkOutAlertPayRun();
        console.log(payRunMatchedEmp)
        const filteredEmp = allUsers?.filter(data => valueEmp?.includes(data.companyname))
        const totalBatches = filteredEmp.length;
        let progressPerBatch = 100 / totalBatches;
        console.log(filteredEmp, 'filteredEmp')
        if (filteredEmp.length === 0) {
            // setPopupContentMalert("Pay run already generated. You cannot update clockin or clockout time.");
            setPopupContentMalert("No data to update.");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
            handleCloseMod();
        } else {
            setLoading(true);
            setProgress(0);
            for (let i = 0; i < totalBatches; i++) {
                try {
                    // Send API request for each batch
                    await axios.post(SERVICE.ATTENDANCE_BULK_UPDATE, {
                        userData: [filteredEmp[i]], // Send one batch at a time
                        shiftmode: filterUser.shiftmode,
                        mode: filterUser.mode,
                        status: filterUser.status,
                        hour: filterUser.clinhour,
                        minute: filterUser.clinminute,
                        second: filterUser.clinseconds,
                        period: filterUser.timeperiod
                    }, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    });

                    // Update progress after each batch is processed
                    setProgress((prevProgress) => Math.min(prevProgress + progressPerBatch, 100));
                } catch (err) {
                    setLoading(false);
                    handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
                    return; // Exit the loop on error
                }
            }

            try {
                let res = await axios.post(SERVICE.ATTENDANCE_BULK_UPDATE, {
                    userData: filteredEmp,
                    shiftmode: filterUser.shiftmode,
                    mode: filterUser.mode,
                    status: filterUser.status,
                    hour: filterUser.clinhour,
                    minute: filterUser.clinminute,
                    second: filterUser.clinseconds,
                    period: filterUser.timeperiod
                }, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    }
                })

                if (res.data.users && res.data.users.length > 0) {
                    // console.log(res.data.users)
                    let userData = [
                        ...new Map(res.data.users.map(item => [item.userid, item])).values()
                    ];

                    const itemsWithSerialNumberData = userData?.map((item, index) => (
                        {
                            ...item,
                            id: item.userid,
                            serialNumber: index + 1,
                        }));
                    setRemainingUsers(itemsWithSerialNumberData);
                    setFilteredDataItemsAttBulkUpdate(itemsWithSerialNumberData);
                    setSearchQueryAttBulkUpdate("");
                    setTotalPagesAttBulkUpdate(Math.ceil(itemsWithSerialNumberData.length / pageSizeAttBulkUpdate));
                    handleClickOpenClkOutAlert();
                    setLoading(false);
                    // setSelectedMode("Today");
                    setFilterUser({
                        ...filterUser,
                        // fromdate: today, todate: today, mode: "Please Select Mode", status: "Please Select Status", 
                        clinhour: '', clinminute: '', clinseconds: '', timeperiod: '', autoclockoutcheck: false
                    });
                }
                // else {
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                handleCloseMod();
                // setLoading(false);
                // setSelectedMode("Today");
                setFilterUser({
                    ...filterUser,
                    // fromdate: today, todate: today,  mode: "Please Select Mode", status: "Please Select Status", 
                    clinhour: '', clinminute: '', clinseconds: '', timeperiod: '', autoclockoutcheck: false
                });
                // }
                // setTimeout(() => {
                //     setLoading(false);
                // }, 500);
                // } catch (err) { setLoading(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
            } catch (err) {
                handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
            } finally {
                setLoading(false);
                setProgress(100); // Ensure progress is set to 100% at the end
            }
        }
    };

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
                setFilteredRowDataAttBulkUpdate([]);
            } else {
                // Filters are active, capture filtered data
                const filteredDataAttBulkUpdate = [];
                gridApi.forEachNodeAfterFilterAndSort((node) => {
                    filteredDataAttBulkUpdate.push(node.data);
                });
                setFilteredRowDataAttBulkUpdate(filteredDataAttBulkUpdate);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableAttBulkUpdate.current) {
            const gridApi = gridRefTableAttBulkUpdate.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesAttBulkUpdate = gridApi.paginationGetTotalPages();
            setPageAttBulkUpdate(currentPage);
            setTotalPagesAttBulkUpdate(totalPagesAttBulkUpdate);
        }
    }, []);

    const columnDataTableAttBulkUpdate = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 100, hide: !columnVisibilityAttBulkUpdate.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "companyname", headerName: "Employee Name", flex: 0, width: 680, hide: !columnVisibilityAttBulkUpdate.companyname, },
    ]

    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryAttBulkUpdate(value);
        applyNormalFilter(value);
        setFilteredRowDataAttBulkUpdate([]);
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = remainingUsers?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItemsAttBulkUpdate(filtered);
        setPageAttBulkUpdate(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = remainingUsers?.filter((item) => {
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

        setFilteredDataItemsAttBulkUpdate(filtered);
        setAdvancedFilterAttBulkUpdate(filters);
        // handleCloseSearchAttBulkUpdate(); 
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilterAttBulkUpdate(null);
        setSearchQueryAttBulkUpdate("");
        setFilteredDataItemsAttBulkUpdate(remainingUsers);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilterAttBulkUpdate && advancedFilterAttBulkUpdate.length > 0) {
            return advancedFilterAttBulkUpdate.map((filter, index) => {
                let showname = columnDataTableAttBulkUpdate.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilterAttBulkUpdate.length > 1 ? advancedFilterAttBulkUpdate[1].condition : '') + ' ');
        }
        return searchQueryAttBulkUpdate;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesAttBulkUpdate) {
            setPageAttBulkUpdate(newPage);
            gridRefTableAttBulkUpdate.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChangeAttBulkUpdate = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeAttBulkUpdate(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityAttBulkUpdate };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAttBulkUpdate(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityAttBulkUpdate");
        if (savedVisibility) {
            setColumnVisibilityAttBulkUpdate(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityAttBulkUpdate", JSON.stringify(columnVisibilityAttBulkUpdate));
    }, [columnVisibilityAttBulkUpdate]);

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const handleColumnMoved = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityAttBulkUpdate((prevVisibility) => {
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
        setColumnVisibilityAttBulkUpdate((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Pagination for outer filter
    const filteredDataAttBulkUpdate = filteredDataItemsAttBulkUpdate?.slice((pageAttBulkUpdate - 1) * pageSizeAttBulkUpdate, pageAttBulkUpdate * pageSizeAttBulkUpdate);
    const totalPagesAttBulkUpdateOuter = Math.ceil(filteredDataItemsAttBulkUpdate?.length / pageSizeAttBulkUpdate);
    const visiblePages = Math.min(totalPagesAttBulkUpdateOuter, 3);
    const firstVisiblePage = Math.max(1, pageAttBulkUpdate - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttBulkUpdateOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageAttBulkUpdate * pageSizeAttBulkUpdate;
    const indexOfFirstItem = indexOfLastItem - pageSizeAttBulkUpdate;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    // Pay Run Table
    const onGridReadyPayRun = useCallback((params) => {
        setGridApiPayRun(params.api);
        setColumnApiPayRun(params.columnApi);
    }, []);

    // Function to handle filter changes
    const onFilterChangedPayRun = () => {
        if (gridApiPayRun) {
            const filterModel = gridApiPayRun.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowDataAttBulkUpdatePayRun([]);
            } else {
                // Filters are active, capture filtered data
                const filteredDataAttBulkUpdatePayRun = [];
                gridApiPayRun.forEachNodeAfterFilterAndSort((node) => {
                    filteredDataAttBulkUpdatePayRun.push(node.data);
                });
                setFilteredRowDataAttBulkUpdatePayRun(filteredDataAttBulkUpdatePayRun);
            }
        }
    };

    const onPaginationChangedPayRun = useCallback(() => {
        if (gridRefTableAttBulkUpdate.current) {
            const gridApiPayRun = gridRefTableAttBulkUpdate.current.api;
            const currentPage = gridApiPayRun.paginationGetCurrentPage() + 1;
            const totalPagesAttBulkUpdatePayRun = gridApiPayRun.paginationGetTotalPages();
            setPageAttBulkUpdatePayRun(currentPage);
            setTotalPagesAttBulkUpdatePayRun(totalPagesAttBulkUpdatePayRun);
        }
    }, []);

    const columnDataTableAttBulkUpdatePayRun = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 100, hide: !columnVisibilityAttBulkUpdatePayRun.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "companyname", headerName: "Employee Name", flex: 0, width: 680, hide: !columnVisibilityAttBulkUpdatePayRun.companyname, },
    ]

    // Datatable
    const handleSearchChangePayRun = (e) => {
        const value = e.target.value;
        setSearchQueryAttBulkUpdate(value);
        applyNormalFilterPayRun(value);
        setFilteredRowDataAttBulkUpdatePayRun([]);
    };

    const applyNormalFilterPayRun = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = payRunMatchedEmp?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItemsAttBulkUpdatePayRun(filtered);
        setPageAttBulkUpdatePayRun(1);
    };

    const applyAdvancedFilterPayRun = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = payRunMatchedEmp?.filter((item) => {
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

        setFilteredDataItemsAttBulkUpdatePayRun(filtered);
        setAdvancedFilterAttBulkUpdatePayRun(filters);
        // handleCloseSearchAttBulkUpdate(); 
    };

    // Undo filter funtion
    const handleResetSearchPayRun = () => {
        setAdvancedFilterAttBulkUpdatePayRun(null);
        setSearchQueryAttBulkUpdatePayRun("");
        setFilteredDataItemsAttBulkUpdatePayRun(payRunMatchedEmp);
    };

    // Show filtered combination in the search bar
    const getSearchDisplayPayRun = () => {
        if (advancedFilterAttBulkUpdatePayRun && advancedFilterAttBulkUpdatePayRun.length > 0) {
            return advancedFilterAttBulkUpdatePayRun.map((filter, index) => {
                let showname = columnDataTableAttBulkUpdate.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilterAttBulkUpdatePayRun.length > 1 ? advancedFilterAttBulkUpdatePayRun[1].condition : '') + ' ');
        }
        return searchQueryAttBulkUpdate;
    };

    const handlePageChangePayRun = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesAttBulkUpdatePayRun) {
            setPageAttBulkUpdatePayRun(newPage);
            gridRefTableAttBulkUpdate.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChangeAttBulkUpdatePayRun = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeAttBulkUpdatePayRun(newSize);
        if (gridApiPayRun) {
            gridApiPayRun.paginationSetPageSizePayRun(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumnsPayRun = () => {
        const updatedVisibility = { ...columnVisibilityAttBulkUpdatePayRun };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityAttBulkUpdatePayRun(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityAttBulkUpdatePayRun");
        if (savedVisibility) {
            setColumnVisibilityAttBulkUpdatePayRun(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityAttBulkUpdatePayRun", JSON.stringify(columnVisibilityAttBulkUpdatePayRun));
    }, [columnVisibilityAttBulkUpdatePayRun]);

    const handleColumnMovedPayRun = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityAttBulkUpdatePayRun((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisiblePayRun = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityAttBulkUpdatePayRun((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Pagination for outer filter
    const filteredDataAttBulkUpdatePayRun = filteredDataItemsAttBulkUpdatePayRun?.slice((pageAttBulkUpdatePayRun - 1) * pageSizeAttBulkUpdatePayRun, pageAttBulkUpdatePayRun * pageSizeAttBulkUpdatePayRun);
    const totalPagesAttBulkUpdateOuterPayRun = Math.ceil(filteredDataItemsAttBulkUpdatePayRun?.length / pageSizeAttBulkUpdatePayRun);
    const visiblePagesPayRun = Math.min(totalPagesAttBulkUpdateOuterPayRun, 3);
    const firstVisiblePagePayRun = Math.max(1, pageAttBulkUpdatePayRun - 1);
    const lastVisiblePagePayRun = Math.min(firstVisiblePagePayRun + visiblePagesPayRun - 1, totalPagesAttBulkUpdateOuterPayRun);
    const pageNumbersPayRun = [];
    const indexOfLastItemPayRun = pageAttBulkUpdatePayRun * pageSizeAttBulkUpdatePayRun;
    const indexOfFirstItemPayRun = indexOfLastItemPayRun - pageSizeAttBulkUpdatePayRun;
    for (let i = firstVisiblePagePayRun; i <= lastVisiblePagePayRun; i++) { pageNumbersPayRun.push(i); }

    return (
        <Box>
            <Headtitle title={"ATTENDANCE BULK UPDATE"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Attendance Bulk Update"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Update"
                subsubpagename="Attendance Bulk Update"
            />
            {loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}>
                    <CircularProgressWithLabel size={100} value={progress} />
                </Box>
            )}
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("aattendancebulkupdate") && (
                <Box sx={userStyle.selectcontainer}>
                    <Grid container spacing={2}>
                        <Grid item md={12} sm={12} xs={12}>
                            <Typography sx={userStyle.importheadtext}> Attendance Filter </Typography>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                            <FormControl size="small" fullWidth>
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
                                        setFilterUser({ ...filterUser, shiftmode: "Please Select Shift Mode", mode: 'Please Select Mode', status: 'Please Select Status' });
                                    }}
                                    valueRenderer={customValueRendererCompany}
                                    labelledBy="Please Select Company"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Branch<b style={{ color: "red" }}>*</b> </Typography>
                                <MultiSelect
                                    options={accessbranch?.filter((comp) => valueCompany?.includes(comp.company)
                                    )?.map(data => ({
                                        label: data.branch,
                                        value: data.branch,
                                    })).filter((item, index, self) => {
                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                    })}
                                    value={selectedBranch}
                                    onChange={(e) => {
                                        handleBranchChange(e);
                                        setFilterUser({ ...filterUser, shiftmode: "Please Select Shift Mode", mode: 'Please Select Mode', status: 'Please Select Status' });
                                    }}
                                    valueRenderer={customValueRendererBranch}
                                    labelledBy="Please Select Branch"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography> Unit<b style={{ color: "red" }}>*</b> </Typography>
                                <MultiSelect
                                    options={accessbranch?.filter((comp) => valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch)
                                    )?.map(data => ({
                                        label: data.unit,
                                        value: data.unit,
                                    })).filter((item, index, self) => {
                                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                    })}
                                    value={selectedUnit}
                                    onChange={(e) => {
                                        handleUnitChange(e);
                                        setFilterUser({ ...filterUser, shiftmode: "Please Select Shift Mode", mode: 'Please Select Mode', status: 'Please Select Status' });
                                    }}
                                    valueRenderer={customValueRendererUnit}
                                    labelledBy="Please Select Unit"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Team<b style={{ color: "red" }}>*</b></Typography>
                                <MultiSelect
                                    options={allTeam
                                        ?.filter((u) => valueCompany?.includes(u.company) && valueBranch?.includes(u.branch) && valueUnit?.includes(u.unit))
                                        .map((u) => ({
                                            ...u,
                                            label: u.teamname,
                                            value: u.teamname,
                                        }))}
                                    value={selectedTeam}
                                    onChange={(e) => {
                                        handleTeamChange(e);
                                        setFilterUser({ ...filterUser, shiftmode: 'Please Select Shift Mode', mode: 'Please Select Mode', status: 'Please Select Status' });
                                    }}
                                    valueRenderer={customValueRendererTeam}
                                    labelledBy="Please Select Branch"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12} sm={12}>
                            <Box sx={{ display: 'flex', marginTop: '25px' }}>
                                <Checkbox size="small"
                                    checked={filterUser.autoclockoutcheck}
                                    value={filterUser.autoclockoutcheck}
                                    onChange={(e) => {
                                        setFilterUser({ ...filterUser, autoclockoutcheck: !filterUser.autoclockoutcheck, fromdate: today, todate: today, shiftmode: 'Please Select Shift Mode', mode: 'Please Select Mode', status: 'Please Select Status', clinhour: '', clinminute: '', clinseconds: '', timeperiod: '' });
                                        setSelectedMode("Today");
                                    }}
                                />&ensp;
                                <Box sx={{ marginTop: '10px' }}>Auto Clockout</Box>
                            </Box>
                        </Grid>
                        {!filterUser.autoclockoutcheck ?
                            <>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Filter Mode<b style={{ color: "red" }}>*</b> </Typography>
                                        <Selects
                                            labelId="mode-select-label"
                                            options={mode}
                                            value={{ label: selectedMode, value: selectedMode }}
                                            onChange={(selectedOption) => {
                                                let fromdate = '';
                                                let todate = '';

                                                if (selectedOption.value) {
                                                    const dateRange = getDateRange(selectedOption.value);
                                                    fromdate = dateRange.fromdate;
                                                    todate = dateRange.todate;
                                                }
                                                setFilterUser({
                                                    ...filterUser,
                                                    fromdate: formatDateForInput(new Date(fromdate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                                    todate: formatDateForInput(new Date(todate.split('-').reverse().join('-'))), // Convert to 'yyyy-MM-dd'
                                                    shiftmode: 'Please Select Shift Mode',
                                                    mode: 'Please Select Mode',
                                                    status: 'Please Select Status'
                                                });
                                                setAllUsers([]);
                                                setSelectedMode(selectedOption.value);
                                                setEmployees([]);
                                                setAutoClkOutEmp([]);
                                                setSelectedEmp([]);
                                                setValueEmp([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            disabled={selectedMode != "Custom"}
                                            value={filterUser.fromdate}
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                const currentDate = new Date().toISOString().split("T")[0];
                                                if (selectedDate <= currentDate) {
                                                    setFilterUser({ ...filterUser, fromdate: selectedDate, todate: selectedDate, shiftmode: 'Please Select Shift Mode', mode: 'Please Select Mode', status: 'Please Select Status' });
                                                } else {
                                                    console.log("Please select a date on or before today.");
                                                }
                                                setAllUsers([]);
                                                setEmployees([]);
                                                setAutoClkOutEmp([]);
                                                setSelectedEmp([]);
                                                setValueEmp([]);
                                            }}
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
                                            disabled={selectedMode != "Custom"}
                                            value={filterUser.todate}
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
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
                                                    setFilterUser({ ...filterUser, todate: selectedDate, shiftmode: 'Please Select Shift Mode', mode: 'Please Select Mode', status: 'Please Select Status' });
                                                    setAllUsers([]);
                                                    setEmployees([]);
                                                    setAutoClkOutEmp([]);
                                                    setSelectedEmp([]);
                                                    setValueEmp([]);
                                                } else {
                                                    console.log("Please select a date on or before today.");
                                                }
                                            }}
                                            inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Shift Mode<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={shiftModeOptions}
                                            value={{ label: filterUser.shiftmode, value: filterUser.shiftmode }}
                                            onChange={(e) => {
                                                if (selectedMode === 'Custom' && filterUser.fromdate === '' && filterUser.todate === '') {
                                                    setPopupContentMalert("Please Select From And To Date");
                                                    setPopupSeverityMalert("warning");
                                                    handleClickOpenPopupMalert();
                                                } else {
                                                    setFilterUser({ ...filterUser, shiftmode: e.value, mode: 'Please Select Mode', status: 'Please Select Status', clinhour: '', clinminute: '', clinseconds: '', timeperiod: '' });
                                                    fetchUsersAttBulkUpdate(e.value);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Employee<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={employees?.filter((comp) => valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch) && valueUnit?.includes(comp.unit) && valueTeam?.includes(comp.team)
                                            )?.map(data => ({
                                                label: data.companyname,
                                                value: data.companyname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedEmp}
                                            onChange={(e) => {
                                                handleEmployeeChange(e);
                                                setFilterUser({ ...filterUser, mode: 'Please Select Mode', status: 'Please Select Status' });
                                            }}
                                            valueRenderer={customValueRendererEmp}
                                            labelledBy="Please Select Employee"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Selected Employees</Typography>
                                        <Box
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
                                        >
                                            {valueEmp.map((value) => (
                                                <Chip key={value} label={value} clickable sx={{ margin: 2, backgroundColor: '#FFF' }} onDelete={(e) => handleDelete(e, value)} onClick={() => console.log('clicked chip')} />
                                            ))}
                                        </Box>
                                    </FormControl>
                                </Grid>
                            </>
                            :
                            <>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            // disabled={selectedMode != "Custom"}
                                            value={filterUser.fromdate}
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                const currentDate = new Date().toISOString().split("T")[0];
                                                if (selectedDate <= currentDate) {
                                                    setFilterUser({
                                                        ...filterUser, fromdate: selectedDate,
                                                        // todate: selectedDate, 
                                                        shiftmode: 'Please Select Shift Mode', mode: 'Please Select Mode', status: 'Please Select Status'
                                                    });
                                                } else {
                                                    console.log("Please select a date on or before today.");
                                                }
                                                setAllUsers([]);
                                                setEmployees([]);
                                                setAutoClkOutEmp([]);
                                                setSelectedEmp([]);
                                                setValueEmp([]);
                                            }}
                                            inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Shift Mode<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={shiftModeOptions}
                                            value={{ label: filterUser.shiftmode, value: filterUser.shiftmode }}
                                            onChange={(e) => {
                                                if (selectedMode === 'Custom' && filterUser.fromdate === '' && filterUser.todate === '') {
                                                    setPopupContentMalert("Please Select From And To Date");
                                                    setPopupSeverityMalert("warning");
                                                    handleClickOpenPopupMalert();
                                                } else {
                                                    setFilterUser({ ...filterUser, shiftmode: e.value, mode: 'Please Select Mode', status: 'Please Select Status', clinhour: '', clinminute: '', clinseconds: '', timeperiod: '' });
                                                    fetchUsersAttBulkUpdate(e.value);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Employee<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={autoClkOutEmp?.filter((comp) => valueCompany?.includes(comp.company) && valueBranch?.includes(comp.branch) && valueUnit?.includes(comp.unit) && valueTeam?.includes(comp.team)
                                            )?.map(data => ({
                                                label: data.companyname,
                                                value: data.companyname,
                                            })).filter((item, index, self) => {
                                                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                            })}
                                            value={selectedEmp}
                                            onChange={(e) => {
                                                handleEmployeeChange(e);
                                                setFilterUser({ ...filterUser, mode: 'Please Select Mode', status: 'Please Select Status' });
                                            }}
                                            valueRenderer={customValueRendererEmp}
                                            labelledBy="Please Select Employee"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} sm={12} xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Selected Employees</Typography>
                                        <Box
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
                                        >
                                            {valueEmp.map((value) => (
                                                <Chip key={value} label={value} clickable sx={{ margin: 2, backgroundColor: '#FFF' }} onDelete={(e) => handleDelete(e, value)} onClick={() => console.log('clicked chip')} />
                                            ))}
                                        </Box>
                                    </FormControl>
                                </Grid>
                            </>
                        }
                        <Grid item md={3} xs={12} sm={12}>
                            <FormControl fullWidth size="small">
                                <Typography>Mode<b style={{ color: "red" }}>*</b></Typography>
                                <Selects
                                    options={modeOptions}
                                    value={{ label: filterUser.mode, value: filterUser.mode }}
                                    onChange={(e) => {
                                        setFilterUser({ ...filterUser, mode: e.value, status: 'Please Select Status', clinhour: '', clinminute: '', clinseconds: '', timeperiod: '' });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {filterUser.mode !== "Update Both" ?
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>Status<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={filterUser.mode !== "Please Select Mode" ? filterUser.mode === "Update Clockin" ? clockinStatusOptions : clockoutStatusOptions : []}
                                        value={{ label: filterUser.status, value: filterUser.status }}
                                        onChange={(e) => { setFilterUser({ ...filterUser, status: e.value, clinhour: '', clinminute: '', clinseconds: '', timeperiod: '' }); }}
                                    />
                                </FormControl>
                            </Grid>
                            : null}
                        {filterUser.status === "Manual" ? (
                            <Grid item md={4} xs={12} sm={12}>
                                <Grid container>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <FormControl size="small" fullWidth>
                                            <Typography>Hour<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects fullWidth
                                                maxMenuHeight={200}
                                                options={hrsOptions}
                                                value={{
                                                    label: filterUser.clinhour,
                                                    value: filterUser.clinhour,
                                                }}
                                                onChange={(e) => setFilterUser({ ...filterUser, clinhour: e.value })}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <FormControl size="small" fullWidth>
                                            <Typography>Minute<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects fullWidth
                                                maxMenuHeight={200}
                                                options={minutssecOptions}
                                                value={{
                                                    label: filterUser.clinminute,
                                                    value: filterUser.clinminute,
                                                }}
                                                onChange={(e) => setFilterUser({ ...filterUser, clinminute: e.value })}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <FormControl size="small" fullWidth>
                                            <Typography>Second<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects fullWidth
                                                maxMenuHeight={200}
                                                options={minutssecOptions}
                                                value={{
                                                    label: filterUser.clinseconds,
                                                    value: filterUser.clinseconds,
                                                }}
                                                onChange={(e) => setFilterUser({ ...filterUser, clinseconds: e.value })}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} >
                                        <FormControl size="small" fullWidth>
                                            <Typography>AM/PM<b style={{ color: "red" }}>*</b></Typography>
                                            <Selects fullWidth
                                                maxMenuHeight={200}
                                                options={timeoptions}
                                                value={{
                                                    label: filterUser.timeperiod,
                                                    value: filterUser.timeperiod,
                                                }}
                                                onChange={(e) => setFilterUser({ ...filterUser, timeperiod: e.value })}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ) : null}
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item lg={1} md={2} sm={2} xs={12} >
                            <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                {/* <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={handleFilterSubmit}>Update</Button> */}
                                <LoadingButton loading={btnSubmit} variant="contained" color="primary" onClick={handleFilterSubmit}>
                                    Update
                                </LoadingButton>
                            </Box>
                        </Grid>
                        <Grid item lg={1} md={2} sm={2} xs={12}>
                            <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                <Button sx={buttonStyles.btncancel} onClick={handleFilterClear}>Clear</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}<br />

            {/* Show Alert */}
            <Dialog open={openClkOutAlert} onClose={handleClickOpenClkOutAlert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth scroll="paper" sx={{ marginTop: '95px' }}>
                <Box sx={{ padding: "20px 20px", }}>
                    <Typography sx={{ ...userStyle.HeaderText, color: 'red' }}>Please update clock-in for these following users first</Typography><br />
                    <Grid container style={userStyle.dataTablestyle}>
                        <Grid item md={3} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select size="small"
                                    id="pageSizeSelect"
                                    value={pageSizeAttBulkUpdate}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeAttBulkUpdate}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={remainingUsers?.length}>All</MenuItem>
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}></Grid>
                        <Grid item md={3} xs={12} sm={12}>
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
                                            {advancedFilterAttBulkUpdate && (
                                                <IconButton onClick={handleResetSearch}>
                                                    <MdClose />
                                                </IconButton>
                                            )}
                                            <Tooltip title="Show search options">
                                                <span>
                                                    <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAttBulkUpdate} />
                                                </span>
                                            </Tooltip>
                                        </InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{ 'aria-label': 'weight', }}
                                    type="text"
                                    value={getSearchDisplay()}
                                    onChange={handleSearchChange}
                                    placeholder="Type to search..."
                                    disabled={!!advancedFilterAttBulkUpdate}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>  <br />
                    <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAttBulkUpdate} >
                        <AgGridReact
                            rowData={filteredDataItemsAttBulkUpdate}
                            columnDefs={columnDataTableAttBulkUpdate.filter((column) => columnVisibilityAttBulkUpdate[column.field])}
                            ref={gridRefTableAttBulkUpdate}
                            defaultColDef={defaultColDef}
                            domLayout={"autoHeight"}
                            getRowStyle={getRowStyle}
                            pagination={true}
                            paginationPageSizeSelector={[]}
                            paginationPageSize={pageSizeAttBulkUpdate}
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
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error' onClick={handleCloseClkOutAlert}>OK</Button>
                    </DialogActions>
                </Box>
            </Dialog >

            {/* Show Alert */}
            <Dialog open={openClkOutAlertPayRun} onClose={handleClickOpenClkOutAlertPayRun} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth scroll="paper" sx={{ marginTop: '95px' }}>
                <Box sx={{ padding: "20px 20px", }}>
                    <Typography sx={{ ...userStyle.HeaderText, color: 'red' }}>Payrun Generated for this users. You cannot update ClockIn/ClockOut for this employee. Remaining User's ClockIn/ClockOut will be update.</Typography><br />
                    <Grid container style={userStyle.dataTablestyle}>
                        <Grid item md={3} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select size="small"
                                    id="pageSizeSelect"
                                    value={pageSizeAttBulkUpdatePayRun}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 180,
                                                width: 80,
                                            },
                                        },
                                    }}
                                    onChange={handlePageSizeChangeAttBulkUpdatePayRun}
                                    sx={{ width: "77px" }}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={payRunMatchedEmp?.length}>All</MenuItem>
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}></Grid>
                        <Grid item md={3} xs={12} sm={12}>
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
                                            {advancedFilterAttBulkUpdatePayRun && (
                                                <IconButton onClick={handleResetSearchPayRun}>
                                                    <MdClose />
                                                </IconButton>
                                            )}
                                            <Tooltip title="Show search options">
                                                <span>
                                                    <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAttBulkUpdatePayRun} />
                                                </span>
                                            </Tooltip>
                                        </InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{ 'aria-label': 'weight', }}
                                    type="text"
                                    value={getSearchDisplayPayRun()}
                                    onChange={handleSearchChangePayRun}
                                    placeholder="Type to search..."
                                    disabled={!!advancedFilterAttBulkUpdatePayRun}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>  <br />
                    <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAttBulkUpdatePayRun} >
                        <AgGridReact
                            rowData={filteredDataItemsAttBulkUpdatePayRun}
                            columnDefs={columnDataTableAttBulkUpdatePayRun.filter((column) => columnVisibilityAttBulkUpdatePayRun[column.field])}
                            ref={gridRefTableAttBulkUpdatePayRun}
                            defaultColDef={defaultColDef}
                            domLayout={"autoHeight"}
                            getRowStyle={getRowStyle}
                            pagination={true}
                            paginationPageSizeSelector={[]}
                            paginationPageSize={pageSizeAttBulkUpdatePayRun}
                            onPaginationChanged={onPaginationChangedPayRun}
                            onGridReady={onGridReadyPayRun}
                            onColumnMoved={handleColumnMovedPayRun}
                            onColumnVisible={handleColumnVisiblePayRun}
                            onFilterChanged={onFilterChangedPayRun}
                            // suppressPaginationPanel={true}
                            suppressSizeToFit={true}
                            suppressAutoSize={true}
                            suppressColumnVirtualisation={true}
                            colResizeDefault={"shift"}
                            cellSelection={true}
                            copyHeadersToClipboard={true}
                        />
                    </Box>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error' onClick={sendRequest}>OK</Button>
                    </DialogActions>
                </Box>
            </Dialog >

            {/* Search Bar */}
            <Popover
                id={idSearchAttBulkUpdate}
                open={openSearchAttBulkUpdate}
                anchorEl={anchorElSearchAttBulkUpdate}
                onClose={handleCloseSearchAttBulkUpdate}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableAttBulkUpdate} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryAttBulkUpdate} handleCloseSearch={handleCloseSearchAttBulkUpdate} />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchAttBulkUpdatePayRun}
                open={openSearchAttBulkUpdatePayRun}
                anchorEl={anchorElSearchAttBulkUpdatePayRun}
                onClose={handleCloseSearchAttBulkUpdatePayRun}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableAttBulkUpdatePayRun} onSearch={applyAdvancedFilterPayRun} initialSearchValue={searchQueryAttBulkUpdatePayRun} handleCloseSearch={handleCloseSearchAttBulkUpdatePayRun} />
            </Popover>

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
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={payRunMatchedEmp?.length > 0 ? handleClickOpenClkOutAlertPayRun : sendRequest}
                title="Are you want to update?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
        </Box >
    );
}

export default AttendanceBulkUpdateList;