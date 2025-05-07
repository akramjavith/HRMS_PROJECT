import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Typography, OutlinedInput, Badge, TableBody, TableRow, TableCell, Select, TextareaAutosize, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, Popover, TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import Selects from "react-select";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { format } from 'date-fns';
import MyShiftAdjustmentListTable from "./MyShiftAdjustmentListTable";
import MyShiftRoasterList from "./Myshiftroaster";
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AdvancedSearchBar from '../../../components/SearchbarEbList';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function MyShiftAdjustmentList() {

    const currentDate1Adj = new Date();
    const gridRefTableMyFinalAdj = useRef(null);
    const gridRefImageMyFinalAdj = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, } = useContext(UserRoleAccessContext);
    const [allUsers, setAllUsers] = useState([]);
    const [allShiftAdj, setAllShiftAdj] = useState(false);
    const [shiftDayOptions, setShiftDayOptions] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [getAdjShiftTypeTime, setGetAdjShiftTypeTime] = useState("")
    const [getChangeShiftTypeTime, setGetChangeShiftTypeTime] = useState("")
    const [shiftRoasterUserEdit, setShiftRoasterUserEdit] = useState({
        username: "", empcode: "",
        selectedColumnShiftMode: '',
        selectedColumnShiftTime: '',
        selectedColumnDate: '',
        adjfirstshiftmode: "", adjustmenttype: "Change Shift", adjchangeshift: "Choose Shift",
        adjchangeshiftime: "", adjchangereason: "", adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', adjdate: "",
    })

    const [allUsersAdjTable, setAllUsersAdjTable] = useState([])
    const [getAdjStatusApprovedDates, setGetAdjStatusApprovedDates] = useState([])
    const [adjApply, setAdjApply] = useState(false);
    const [allUsersShiftFinal, setAllUsersShiftFinal] = useState([]);
    const [allMyFinalAdj, setAllMyFinalAdj] = useState(false);
    const [allUserDates, setAllUserDates] = useState([])
    const [overallsettings, setOverallsettings] = useState("");
    const [allUsersShiftallot, setAllUsersShiftallot] = useState([])
    const [getShiftAllotMatchedId, setGetShiftAllotMatchedId] = useState("")
    const [getShiftAdjMatchedId, setGetShiftAdjMatchedId] = useState("")
    const [getShiftAdjMatchedIdForNotAllotted, setGetShiftAdjMatchedIdForNotAllotted] = useState("")
    const [checkWeekOff, setCheckWeekOff] = useState('');

    // State to track advanced filter
    const [advancedFilterMyFinalAdj, setAdvancedFilterMyFinalAdj] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItemsMyFinalAdj, setFilteredDataItemsMyFinalAdj] = useState(allUsers);
    const [filteredDataItemsMyAdjList, setFilteredDataItemsMyAdjList] = useState(allUsersAdjTable);
    const [filteredRowDataMyFinalAdj, setFilteredRowData] = useState([]);

    // get month and year
    const currentYear = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    const [isMonthyear, setIsMonthYear] = useState({ ismonth: month, isyear: currentYear, isuser: "" });
    const [overAllDepartment, setOverAllDepartment] = useState([]);
    const [daysArray, setDaysArray] = useState([]);
    const [columnVisibilityMyFinalAdj, setColumnVisibilityMyFinalAdj] = useState({});

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setShiftRoasterUserEdit({
            adjustmenttype: "Change Shift", adjchangeshift: "Choose Shift", adjshiftgrptype: 'Choose Day/Night',
            adjchangeshiftime: "", adjchangereason: "", adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', selectedColumnDate: '', selectedColumnShiftTime: '',
            adjdate: "",
        });
        setGetAdjShiftTypeTime("");
        setGetChangeShiftTypeTime("");
    }

    // Datatable Set Table
    const [pageMyFinalAdj, setPageMyFinalAdj] = useState(1);
    const [pageSizeMyFinalAdj, setPageSizeMyFinalAdj] = useState(10);
    const [searchQueryMyFinalAdj, setSearchQueryMyFinalAdj] = useState("");
    const [totalPagesMyFinalAdj, setTotalPagesMyFinalAdj] = useState(1);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpenMyAdj, setIsFilterOpenMyAdj] = useState(false);
    const [isPdfFilterOpenMyAdj, setIsPdfFilterOpenMyAdj] = useState(false);
    // page refersh reload
    const handleCloseFilterModMyAdj = () => { setIsFilterOpenMyAdj(false); };
    const handleClosePdfFilterModMyAdj = () => { setIsPdfFilterOpenMyAdj(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };

    // Manage Columns
    const [searchQueryManageMyFinalAdj, setSearchQueryManageMyFinalAdj] = useState("");
    const [isManageColumnsOpenMyFinalAdj, setManageColumnsOpenMyFinalAdj] = useState(false);
    const [anchorElMyFinalAdj, setAnchorElMyFinalAdj] = useState(null);

    const handleOpenManageColumnsMyFinalAdj = (event) => {
        setAnchorElMyFinalAdj(event.currentTarget);
        setManageColumnsOpenMyFinalAdj(true);
    };
    const handleCloseManageColumnsMyFinalAdj = () => {
        setManageColumnsOpenMyFinalAdj(false);
        setSearchQueryManageMyFinalAdj("");
    };

    const open = Boolean(anchorElMyFinalAdj);
    const id = open ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchMyFinalAdj, setAnchorElSearchMyFinalAdj] = React.useState(null);
    const handleClickSearchMyFinalAdj = (event) => {
        setAnchorElSearchMyFinalAdj(event.currentTarget);
    };
    const handleCloseSearchMyFinalAdj = () => {
        setAnchorElSearchMyFinalAdj(null);
        setSearchQueryMyFinalAdj("");
    };

    const openSearchMyFinalAdj = Boolean(anchorElSearchMyFinalAdj);
    const idSearchMyFinalAdj = openSearchMyFinalAdj ? 'simple-popover' : undefined;

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    const getRowHeight = (params) => {
        // Find the item with adjstatus === 'Double Shift' in params.days array
        const doubleShiftDay = params.node.data.shiftallot && params.node.data.shiftallot.find(allot => allot.adjustmenttype === 'Add On Shift' || allot.adjustmenttype === 'Shift Adjustment');

        // If found, return the desired row height
        if (doubleShiftDay) {
            return 65; // Adjust this value as needed
        }

        // Return null to use default row height for other rows
        return 50;
    };

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
            pagename: String("My Shift Roaster"),
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

    const adjtypeoptions = [
        // { label: "Add On Shift", value: "Add On Shift" },
        { label: "Change Shift", value: "Change Shift" },
        { label: "Shift Weekoff Swap", value: "Shift Weekoff Swap" },
        { label: "WeekOff Adjustment", value: "WeekOff Adjustment" },
        { label: "Shift Adjustment", value: "Shift Adjustment" },
    ];

    const adjtypeoptionsifweekoff = [
        { label: "Add On Shift", value: "Add On Shift" },
        { label: "Change Shift", value: "Change Shift" },
    ];

    const adjstypeoptionsfornotallotted = [
        { label: 'Assign Shift', value: 'Assign Shift' }
    ]

    const secondModeOptions = [
        { label: "Double Shift", value: "Double Shift" },
        { label: "Continuous Shift", value: "Continuous Shift" },
    ]

    const formatDateForDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [getAllShiftGroups, setGetAllShiftGroups] = useState([]);
    // get all shifts
    const fetchShiftGroup = async () => {
        setPageName(!pageName)
        try {
            let res_shiftGroupings = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setShiftDayOptions(
                res_shiftGroupings?.data?.shiftgroupings.map((data) => ({
                    ...data,
                    label: `${data.shiftday}_${data.shifthours}`,
                    value: `${data.shiftday}_${data.shifthours}`,
                }))
            );
            setGetAllShiftGroups(res_shiftGroupings?.data?.shiftgroupings);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchShiftGroup();
    }, [])

    // get all shifts name based on shiftgroup
    const fetchShiftFromShiftGroup = async (value) => {
        setPageName(!pageName)
        try {

            let res_shiftGroupings = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            let dayString = value?.split('_')[0];
            let hoursString = value?.split('_')[1];

            let grpresult = res_shiftGroupings?.data?.shiftgroupings
                ?.filter(item => item.shiftday === dayString && item.shifthours === hoursString)
                ?.map(item => item.shift)
                .flat();

            setShifts(
                grpresult?.map((data) => ({
                    ...data,
                    label: data,
                    value: data,
                }))
            );
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchDepartment = async () => {
        setPageName(!pageName)
        try {
            let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setOverAllDepartment(res_status.data.departmentdetails);
        } catch (err) {
            console.log(err.message)
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, [])

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

    const getDateDaysArray = async () => {
        try {
            let res = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let overallsettingsdata = "";
            res?.data?.overallsettings.map((d) => {
                overallsettingsdata = d.repeatinterval;
            })

            // Calculate the start date of the month based on the selected month
            const startDate = new Date(isMonthyear.isyear, isMonthyear.ismonth - 2, 1);

            // Calculate the end date of the month based on overallsettingsdata
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + overallsettingsdata);
            endDate.setDate(endDate.getDate() - 1);

            // Create an array of days from the start date to the end date
            let currentDate = new Date(startDate);
            let dayCount = 1;
            let daysArrayTemp = [];

            while (currentDate <= endDate) {
                const formattedDate = format(currentDate, 'dd/MM/yyyy');
                const dayName = format(currentDate, 'EEEE'); // EEEE gives the full day name (e.g., Monday)

                const weekNumberInMonth = (getWeekNumberInMonth(currentDate) === 1 ? `${getWeekNumberInMonth(currentDate)}st Week` :
                    getWeekNumberInMonth(currentDate) === 2 ? `${getWeekNumberInMonth(currentDate)}nd Week` :
                        getWeekNumberInMonth(currentDate) === 3 ? `${getWeekNumberInMonth(currentDate)}rd Week` :
                            getWeekNumberInMonth(currentDate) > 3 ? `${getWeekNumberInMonth(currentDate)}th Week` : '')

                daysArrayTemp.push({ formattedDate, dayName, dayCount, weekNumberInMonth });

                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
                dayCount++;
            }

            // Set days array
            setDaysArray(daysArrayTemp);
            getAllDate(daysArrayTemp);
        } catch (err) {
            console.log(err.message)
        }
    };

    useEffect(() => {
        getDateDaysArray();
    }, []);

    //get all Users
    const fetchUsers = async () => {
        setPageName(!pageName);
        setAllShiftAdj(true);
        setAdjApply(true)
        setAllMyFinalAdj(true);

        try {

            let resset = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let overallsettingsdata = "";
            resset?.data?.overallsettings.map((d) => {
                overallsettingsdata = d.repeatinterval;
            })

            // Calculate the start date of the month based on the selected month
            const startDate = new Date(isMonthyear.isyear, isMonthyear.ismonth - 2, 1);

            // Calculate the end date of the month based on overallsettingsdata
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + overallsettingsdata);
            endDate.setDate(endDate.getDate() - 1);

            // Create an array of days from the start date to the end date
            let currentDate = new Date(startDate);
            let dayCount = 1;
            let daysArray = [];

            while (currentDate <= endDate) {
                const formattedDate = format(currentDate, 'dd/MM/yyyy');
                const dayName = format(currentDate, 'EEEE'); // EEEE gives the full day name (e.g., Monday)

                const weekNumberInMonth = (getWeekNumberInMonth(currentDate) === 1 ? `${getWeekNumberInMonth(currentDate)}st Week` :
                    getWeekNumberInMonth(currentDate) === 2 ? `${getWeekNumberInMonth(currentDate)}nd Week` :
                        getWeekNumberInMonth(currentDate) === 3 ? `${getWeekNumberInMonth(currentDate)}rd Week` :
                            getWeekNumberInMonth(currentDate) > 3 ? `${getWeekNumberInMonth(currentDate)}th Week` : '')

                daysArray.push({ formattedDate, dayName, dayCount, weekNumberInMonth });

                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
                dayCount++;
            }

            setDaysArray(daysArray);

            let res = await axios.get(SERVICE.USER_X_EMPLOYEES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let useraccess = res?.data?.users?.filter((user) => {
                // if (isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("HR")) {
                //     return user;
                // }
                // else {
                if (isUserRoleAccess?._id == user?._id) {
                    return user;
                }
                // }
            })

            // Filter out employees based on reasondate and doj date
            const filteredItems = useraccess?.filter((d) => {

                if (!Array.isArray(daysArray)) {
                    console.error("daysArray is not an array");
                    return false;
                }

                return daysArray.some(column => {
                    const [day, month, year] = column.formattedDate?.split("/") || [];
                    const formattedDate = new Date(`${year}-${month}-${day}`);
                    const reasonDate = new Date(d.reasondate);
                    // const dojDate = new Date(d.doj);
                    const userDoj = d?.boardingLog.length > 0 ?
                        d?.boardingLog[0].startdate
                        : d?.doj
                    const dojDate = new Date(userDoj);

                    if (d.doj && d.doj !== '' && d.reasondate === '') {
                        return (formattedDate >= dojDate);
                    }
                    // else if (d.reasondate && d.reasondate !== '' && d.reasondate !== undefined) {
                    //     return yearAsNumber <= parseInt(resyear, 10) && monthAsNumber <= parseInt(resmonth, 10);
                    // }
                    return true;
                });
            });

            let resultshiftallot = []
            useraccess.map(user =>
                user.shiftallot.map(allot => {
                    resultshiftallot.push({ ...allot })
                })
            );
            setAllUserDates(resultshiftallot);

            let resultarr = []
            useraccess.map(user =>
                user.shiftallot.map(allot => {
                    if (allot.adjustmentstatus == true) {
                        resultarr.push({ ...allot });
                    }
                })
            );

            let resultadjstatus = []
            useraccess.map(user =>
                user.shiftallot.map(allot => {
                    if (allot.adjstatus === 'Approved') {
                        resultadjstatus.push(allot);
                    }
                })
            );
            setGetAdjStatusApprovedDates(resultadjstatus)
            setAllUsersAdjTable(resultarr);
            setFilteredDataItemsMyAdjList(resultarr);

            const itemsWithSerialNumber = filteredItems?.flatMap((item, index) => {

                // Map days for the user
                const days = daysArray.map((column, index) => {
                    let filteredRowDataFinalAdj = item.shiftallot?.filter((val) => val.empcode == item.empcode);
                    const matchingItem = filteredRowDataFinalAdj.find(item => item.adjdate === column.formattedDate);
                    const matchingItemAllot = filteredRowDataFinalAdj.find(item => formatDate(item.date) === column.formattedDate);
                    const matchingDoubleShiftItem = filteredRowDataFinalAdj.find(item => item.todate === column.formattedDate);
                    const matchingRemovedItem = filteredRowDataFinalAdj?.find(item => item.removedshiftdate === column.formattedDate);
                    const matchingAssignShiftItem = filteredRowDataFinalAdj?.find(item => item.adjdate === column.formattedDate && item.adjstatus === 'Approved' && item.adjustmenttype === 'Assign Shift');

                    const filterBoardingLog = item.boardingLog && item.boardingLog?.filter((item) => {
                        return item.logcreation === "user" || item.logcreation === "shift";
                    });

                    const [day, month, year] = column.formattedDate.split('/');
                    const finalDate = `${year}-${month}-${day}`;

                    const uniqueEntriesDep = {};
                    item.departmentlog?.forEach(entry => {
                        const key = entry.startdate;
                        if (!(key in uniqueEntriesDep)) {
                            uniqueEntriesDep[key] = entry;
                        }
                    });
                    const uniqueDepLog = Object.values(uniqueEntriesDep);

                    const relevantDepLogEntry = uniqueDepLog
                        .filter(log => log.startdate <= finalDate)
                        .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

                    const isWeekOff = getWeekOffDay(column, filterBoardingLog, (relevantDepLogEntry && relevantDepLogEntry.department)) === "Week Off" ? true : false;
                    const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                    const isWeekOffWithManual = isWeekOff && matchingItemAllot;
                    const shiftsname = getShiftForDateAdj(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, (relevantDepLogEntry && relevantDepLogEntry.department), matchingRemovedItem, matchingAssignShiftItem);

                    return {
                        id: `${item._id}_${column.formattedDate}_${index}`,
                        date: column.formattedDate,
                        adjstatus: matchingItem ?
                            (matchingItem.adjstatus === "Reject" ?
                                (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                    matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                                        (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
                                (matchingItem.adjstatus === "Approved" ? 'Approved' :
                                    matchingItem.adjstatus === "Adjustment" ? 'Adjustment' :
                                        matchingRemovedItem.adjstatus === "Not Allotted" ? 'Not Allotted' :
                                            (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
                            (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                                    (isWeekOffWithManual ? "Manual" :
                                        (isWeekOffWithAdjustment ? 'Adjustment' :
                                            (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
                                                (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
                                                    (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? 'Not Allotted' :
                                                        (isWeekOff ? 'Week Off' : 'Adjustment'))))))),

                        shiftlabel: shiftsname,
                        empCode: item.empcode,
                        depstatus: ((relevantDepLogEntry && relevantDepLogEntry.startdate) === finalDate) ? 'Department Changed' : '',
                        depstartdate: relevantDepLogEntry && relevantDepLogEntry.startdate,
                        department: (relevantDepLogEntry && relevantDepLogEntry.department)
                    };
                });

                // Combine department logs where the department is the same
                const combinedDepartmentLog = [];
                let lastDepLog = null;

                item.departmentlog?.forEach(depLog => {
                    if (lastDepLog && lastDepLog.department === depLog.department) {
                        // Continue the last department log if the department matches
                        lastDepLog.enddate = depLog.startdate;
                    } else {
                        // Push the previous log and start a new one
                        if (lastDepLog) {
                            combinedDepartmentLog.push(lastDepLog);
                        }
                        lastDepLog = { ...depLog };
                    }
                });

                // Push the last department log if it's not already added
                if (lastDepLog) {
                    combinedDepartmentLog.push(lastDepLog);
                }

                // Group days by department and create a row for each group
                const rows = [];
                const addedDepartments = new Set();

                combinedDepartmentLog.forEach(depLog => {
                    const group = days.filter(day => day.department === depLog.department);
                    if (group.length > 0 && !addedDepartments.has(depLog.department)) {
                        addedDepartments.add(depLog.department);
                        rows.push({
                            ...item,
                            id: `${item._id}_${rows.length}`,
                            // serialNumber: index + 1 + (rows.length > 0 ? 0.1 * rows.length : 0),
                            department: depLog.department,
                            overalldays: days,
                            days: daysArray.map(column => {
                                const matchingDay = group.find(day => day.date === column.formattedDate);
                                return matchingDay || {
                                    date: column.formattedDate,
                                    empCode: item.empcode,
                                    depstartdate: '',
                                    department: ''
                                };
                            })
                        });
                    }
                });

                return rows;
            });

            let result = itemsWithSerialNumber?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                id: `${item._id}_${index}`,
                userid: item._id,
                username: item.companyname,
                days: item.days,
            }));

            setAllUsers(result);
            setFilteredDataItemsMyFinalAdj(result);
            setTotalPagesMyFinalAdj(Math.ceil(result.length / pageSizeMyFinalAdj));
            setAllUsersShiftFinal(filteredItems);
            setAllShiftAdj(false);
            setAdjApply(false)
            setAllMyFinalAdj(false);
        } catch (err) { setAllShiftAdj(true); setAdjApply(true); setAllMyFinalAdj(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Show All Columns & Manage Columns
    const initialColumnVisibilityMyFinalAdj = {
        serialNumber: true,
        checkbox: true,
        empcode: true,
        username: true,
        department: true,
        branch: true,
        unit: true,
        ...daysArray.reduce((acc, day, index) => {
            acc[`${day.formattedDate} ${day.dayName} Day${day.dayCount}`] = true;
            return acc;
        }, {}),
    };

    const getAllDate = (daysArrayTemp) => {
        // Pass daysArrayTemp to setColumnVisibilityMyFinalAdj after it's populated
        setColumnVisibilityMyFinalAdj({
            serialNumber: true,
            checkbox: true,
            empcode: true,
            username: true,
            department: true,
            branch: true,
            unit: true,
            ...daysArrayTemp.reduce((acc, day) => {
                acc[`${day.formattedDate} ${day.dayName} Day${day.dayCount}`] = true;
                return acc;
            }, {}),
        });
    }

    const getShiftTime = async (value) => {
        setPageName(!pageName)
        try {
            let res_shift = await axios.get(SERVICE.SHIFT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            res_shift?.data?.shifts.map((d) => {
                if (d.name == value) {
                    if (shiftRoasterUserEdit.adjustmenttype == "Add On Shift") {
                        setGetAdjShiftTypeTime(`${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`)
                    }
                    else {
                        setGetChangeShiftTypeTime(`${d.fromhour}:${d.frommin}${d.fromtime} - ${d.tohour}:${d.tomin}${d.totime}`)
                    }
                }
            })
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const formatDate = (inputDate) => {
        if (!inputDate) {
            return "";
        }
        // Assuming inputDate is in the format "dd-mm-yyyy"
        const [day, month, year] = inputDate?.split('/');

        // // Use padStart to add leading zeros
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');

        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    const [weekOffDates, setWeekOffDates] = useState([]);
    const [weekOffDatesOptions, setWeekOffDatesOptions] = useState([]);

    const getPreviousDate = (formattedDate) => {
        // Split the date string (assuming DD/MM/YYYY format)
        const [day, month, year] = formattedDate.split('/').map(Number);

        // Create a date object with the parsed values
        const currentDate = new Date(year, month - 1, day); // Month is zero-indexed

        // Calculate the previous day's date
        currentDate.setDate(currentDate.getDate() - 1);

        // Format previous date back to DD/MM/YYYY
        const previousDateFormatted = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

        return previousDateFormatted;
    };

    //get single row to edit....
    // const getCode = async (data, rowdata, shiftlabel) => {

    //     let res_shift = await axios.get(SERVICE.SHIFT, {
    //         headers: {
    //             'Authorization': `Bearer ${auth.APIToken}`
    //         },
    //     });

    //     let res_shiftGroupings = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
    //         headers: {
    //             'Authorization': `Bearer ${auth.APIToken}`
    //         },
    //     });

    //     handleClickOpenEdit();

    //     // Get the current date and time
    //     const currentTime = new Date();

    //     // Format the current time as "12:35 PM"
    //     const formattedTime = format(currentTime, 'h:mm a');

    //     // Extract _id values from the shiftallot array
    //     const shiftallotIds = rowdata.shiftallot?.map(item => item._id);

    //     setAllUsersShiftallot(rowdata?.shiftallot)

    //     // get shiftallot matched date _id if status "Manual" cell is clicked  
    //     rowdata?.shiftallot.forEach(value => {
    //         if (formatDate(value.date) === data.formattedDate) {
    //             setGetShiftAllotMatchedId(value._id)
    //         }
    //     })

    //     rowdata?.shiftallot.forEach(value => {
    //         if (value.date === undefined && value.selectedColumnDate === data.formattedDate) {
    //             setGetShiftAdjMatchedId(value._id)
    //         }
    //     })
    //     setCheckWeekOff(rowdata.weekoff.includes(data.dayName) ? "Week Off" : "")


    //     // let filteredWeekOffDate = daysArray
    //     //     .filter(date => rowdata?.weekoff?.includes(date.dayName))
    //     //     .map(date => date.formattedDate);

    //     let filteredWeekOffDate = rowdata.overalldays
    //         .filter(item => item.shiftlabel === 'Week Off')
    //         .map(val => val.date);

    //     setWeekOffDates(filteredWeekOffDate);
    //     setWeekOffDatesOptions(filteredWeekOffDate.map(day => ({ label: day, value: day })))

    //     // find shift name
    //     const findShiftName = (shiftTime) => {
    //         if (!shiftTime) {
    //             return '';
    //         }

    //         let startTime = shiftTime?.split('to')[0];
    //         let endTime = shiftTime?.split('to')[1]

    //         let fromtime = startTime.slice(0, 5);
    //         let fromperiod = startTime.slice(5);

    //         let totime = endTime.slice(0, 5);
    //         let toperiod = endTime.slice(5);

    //         // Extract hours and minutes
    //         const [fromhours, fromminutes] = fromtime.split(':');
    //         const [tohours, tominutes] = totime.split(':');

    //         const foundShift = res_shift?.data?.shifts?.find((d) => d.fromhour === fromhours && d.frommin === fromminutes && d.fromtime === fromperiod &&
    //             d.tohour === tohours && d.tomin === tominutes && d.totime === toperiod);

    //         return foundShift ? foundShift.name : '';
    //     };

    //     // find shift grp
    //     const findShiftGroups = (shiftName) => {
    //         if (!shiftName) {
    //             return '';
    //         }
    //         const foundShiftName = res_shiftGroupings?.data?.shiftgroupings?.find((d) => d.shift.includes(shiftName));

    //         return foundShiftName ? `${foundShiftName.shiftday}_${foundShiftName.shifthours}` : '';
    //     }
    //     //check if manual allot is weekoff, to restrict adjustment type options
    //     const check = rowdata.overalldays.find((d) => d.date === data.formattedDate);
    //     let newobj = {
    //         ...data,
    //         userid: rowdata.userid,
    //         username: rowdata.username,
    //         empcode: rowdata.empcode,
    //         company: rowdata.company,
    //         branch: rowdata.branch,
    //         unit: rowdata.unit,
    //         team: rowdata.team,
    //         department: rowdata.department,
    //         weekoff: rowdata.weekoff,

    //         // selectedColumnShiftMode: rowdata.weekoff.includes(data.dayName) ? "Week Off" : "First Shift",
    //         selectedColumnShiftMode: (check && check.shiftlabel === "Week Off" || rowdata.weekoff.includes(data.dayName)) ? "Week Off" : "First Shift",
    //         selectedColumnDate: data.formattedDate,
    //         selectedColumnShiftTime: shiftlabel === 'Week Off' ? 'Week Off' : (`${shiftlabel?.split('to')[0]} - ${shiftlabel?.split('to')[1]}`),
    //         // selectedColumnShiftGrpType: findShiftGroups(findShiftName(shiftlabel)),            
    //         // selectedColumnShiftName: findShiftName(shiftlabel),

    //         adjfirstshiftmode: '',
    //         adjustmenttype: "Change Shift",
    //         adjshiftgrptype: "Choose Day/Night",
    //         adjdate: '',
    //         adjweekdate: 'Choose Date',
    //         adjweekoffdate: 'Choose Date',
    //         adjchangeshift: "Choose Shift",
    //         adjchangeshiftime: "",
    //         adjchangereason: "",
    //         adjapplydate: formatDateForDate(currentTime),
    //         adjapplytime: String(formattedTime),
    //         shiftallotId: shiftallotIds, // Include the extracted _id in newobj

    //         secondmode: 'Choose 2nd Shiftmode',
    //         pluseshift: '',
    //     }
    //     setShiftRoasterUserEdit(newobj);
    // };

    const findShiftGroups = (shiftName) => {
        if (!shiftName) {
            return '';
        }

        const foundShiftName = getAllShiftGroups?.find((d) => d.shift.includes(shiftName));
        return foundShiftName ? `${foundShiftName.shiftday}_${foundShiftName.shifthours}` : '';
    }

    const getCode = async (data, rowdata, shiftlabel, rowadjstatus) => {

        // console.log(rowdata, 'rowdata')
        // console.log(shiftlabel, 'shiftlabel')      
        // let res_shiftGroupings = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
        //     headers: {
        //         'Authorization': `Bearer ${auth.APIToken}`
        //     },
        // });

        handleClickOpenEdit();

        // Get the current date and time
        const currentTime = new Date();

        // Format the current time as "12:35 PM"
        const formattedTime = format(currentTime, 'h:mm a');

        // Extract _id values from the shiftallot array
        const shiftallotIds = rowdata.shiftallot?.map(item => item._id);

        setAllUsersShiftallot(rowdata?.shiftallot)

        // get shiftallot matched date _id if status "Manual" cell is clicked  
        rowdata?.shiftallot.forEach(value => {
            if (formatDate(value.date) === data.formattedDate) {
                setGetShiftAllotMatchedId(value._id)
            }
        })

        rowdata?.shiftallot.forEach(value => {
            if (value.date === undefined && value.selectedColumnDate === data.formattedDate) {
                setGetShiftAdjMatchedId(value._id)
            }
            if (value.date === undefined && value.selectedDate === data.formattedDate && value.adjstatus === 'Not Allotted') {
                setGetShiftAdjMatchedIdForNotAllotted(value._id)
                // console.log(value._id)
            }
        })

        setCheckWeekOff(shiftlabel === "Week Off" ? "Week Off" : "");

        let filteredWeekOffDate = rowdata.overalldays
            .filter(item => item.shiftlabel === 'Week Off')
            .map(val => val.date);

        setWeekOffDates(filteredWeekOffDate);
        setWeekOffDatesOptions(filteredWeekOffDate.map(day => ({ label: day, value: day })))

        // // find shift grp
        // const findShiftGroups = (shiftName) => {
        //     if (!shiftName) {
        //         return '';
        //     }
        //     const foundShiftName = res_shiftGroupings?.data?.shiftgroupings?.find((d) => d.shift.includes(shiftName));
        //     return foundShiftName ? `${foundShiftName.shiftday}_${foundShiftName.shifthours}` : '';
        // }

        //check if manual allot is weekoff, to restrict adjustment type options
        const check = rowdata.overalldays.find((d) => d.date === data.formattedDate);

        // Find the previous day's date to show defaultly previous day's shift for the weekoff date
        // const [day, month, year] = data.formattedDate?.split('/');
        // const previousDay = Number(day) - 1;
        // const addedZero = String(previousDay).padStart(2, "0");
        // const previousDateFormatted = `${addedZero}/${month}/${year}`;

        // Calculate the previous date and its object only if shiftlabel is 'Week Off'
        let previousDateObject = null;
        let finalPreviousShift = null;

        if (shiftlabel === 'Week Off') {
            const previousDate = getPreviousDate(data.formattedDate);
            // console.log(previousDate, 'previousDate')
            previousDateObject = rowdata.overalldays.find(d => d.date === previousDate && rowdata.empcode === d.empCode);

            finalPreviousShift = (previousDateObject && previousDateObject.adjstatus === "Approved" && rowdata.empcode === previousDateObject.empCode)
                ? previousDateObject.shiftlabel.props.children[0].split(': ')[1]
                : previousDateObject.shiftlabel;

            setGetChangeShiftTypeTime(`${finalPreviousShift?.split('to')[0]} - ${finalPreviousShift?.split('to')[1]}`);
        } else {
            setGetChangeShiftTypeTime("");
        }

        let newobj = {
            ...data,
            userid: rowdata.userid,
            username: rowdata.username,
            empcode: rowdata.empcode,
            company: rowdata.company,
            branch: rowdata.branch,
            unit: rowdata.unit,
            team: rowdata.team,
            department: rowdata.department,
            weekoff: rowdata.weekoff,
            selectedColumnShiftMode: (check && check.shiftlabel === "Week Off") ? "Week Off" : "First Shift",
            selectedColumnDate: data.formattedDate,
            selectedColumnShiftTime: (rowadjstatus === 'Not Allotted' || shiftlabel === 'Not Allotted') ? 'Not Allotted' : shiftlabel === 'Week Off' ? 'Week Off' : (`${shiftlabel?.split('to')[0]} - ${shiftlabel?.split('to')[1]}`),
            adjfirstshiftmode: '',
            adjustmenttype: "Change Shift",
            adjshiftgrptype: (previousDateObject && shiftlabel === 'Week Off') ? findShiftGroups(finalPreviousShift) : "Choose Day/Night",
            adjdate: '',
            adjweekdate: 'Choose Date',
            adjweekoffdate: 'Choose Date',
            adjchangeshift: (previousDateObject && shiftlabel === 'Week Off') ? finalPreviousShift : "Choose Shift",
            adjchangeshiftime: "",
            adjchangereason: "",
            adjapplydate: formatDateForDate(currentTime),
            adjapplytime: String(formattedTime),
            shiftallotId: shiftallotIds, // Include the extracted _id in newobj
            secondmode: 'Choose 2nd Shiftmode',
            pluseshift: '',
            removedstatus: rowadjstatus === 'Not Allotted' ? true : false,
        }

        setShiftRoasterUserEdit(newobj);
    };

    const [selectedDateShift, setSelectedDateShift] = useState('');

    const getSelectedDateShift = (value, empcodevalue) => {
        // Find the corresponding row in filteredDataItemsMyFinalAdj based on the provided empcodevalue
        const row = filteredDataItemsMyFinalAdj.find(item => item.empcode === empcodevalue);

        if (row) {
            // Find the day object in the row that matches the provided value
            const day = row.overalldays.find(day => day.date === value);

            if (day) {
                // Return the shiftlabel of the matched day
                setSelectedDateShift(day.shiftlabel === 'Week Off' ? 'Week Off' : `${day.shiftlabel.split('to')[0]} - ${day.shiftlabel.split('to')[1]}`)
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    const getDateOptions = (selectedDate, rowuserid) => {

        let beforedays = 5;

        // Find the index of the first date after selected date
        // const startIndex = daysArray.findIndex(day => day.formattedDate === selectedDate) + 1;

        // Find the index of the selected date
        const selectedIndex = daysArray.findIndex(day => day.formattedDate === selectedDate);

        // Calculate the start index considering beforedays
        const startIndex = Math.max(0, selectedIndex - beforedays);

        // Filter out the dates after selected date
        const filteredDates = daysArray.slice(startIndex);

        // Construct the dateOptions array
        let dateOptions = filteredDates
            .filter(day => !weekOffDates.includes(day.formattedDate) && day.formattedDate !== selectedDate)
            .map(day => ({ label: day.formattedDate, value: day.formattedDate }));


        let unMatchedAprrovedDate = getAdjStatusApprovedDates.filter(val => val.userid === rowuserid);

        let matchedDate = unMatchedAprrovedDate.map(val => val.adjdate);
        let matchedToDate = unMatchedAprrovedDate.filter(val => val.todate !== undefined || val.todate !== '').map(d => d.todate);

        // Remove the matched date from dateOptions
        dateOptions = dateOptions.filter(day => !matchedDate.concat(matchedToDate).includes(day.value));

        return dateOptions;

    }

    const getWeekOffDateOptions = (selectedDate, rowuserid) => {

        // Convert selectedDate string to Date object
        const parsedSelectedDate = new Date(selectedDate.split('/').reverse().join('-'));

        // Construct the weekOffDateOptions array
        let weekOffDateOptions = weekOffDatesOptions
            .filter(day => {
                // Convert day.label string to Date object
                const parsedDay = new Date(day.label.split('/').reverse().join('-'));
                // Return true for days after selectedDate
                return parsedDay > parsedSelectedDate;
            })
            .map(day => ({ label: day.label, value: day.value }));

        let unMatchedAprrovedDate = getAdjStatusApprovedDates.filter(val => val.userid === rowuserid);
        let matchedDate = unMatchedAprrovedDate.map(val => val.adjdate);
        let matchedToDate = unMatchedAprrovedDate.filter(val => val.todate !== undefined && val.todateshiftmode === "Week Off").map(d => d.todate);

        // Remove the matched date from dateOptions
        weekOffDateOptions = weekOffDateOptions.filter(day => !matchedDate.concat(matchedToDate).includes(day.value));
        return weekOffDateOptions;
    }

    const sendRequest = async () => {
        setPageName(!pageName)
        try {
            if (shiftRoasterUserEdit.adjustmenttype === 'Add On Shift') {
                allUsersShiftallot && allUsersShiftallot?.map(async (allot) => {
                    if (allot._id === getShiftAllotMatchedId && (allot.adjdate === shiftRoasterUserEdit.adjweekdate || allot.adjdate === shiftRoasterUserEdit.selectedColumnDate)) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAllotMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(''),
                                    todateshiftmode: String(''),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();

                    }
                    else if (allot._id === getShiftAdjMatchedId && (allot.adjdate === shiftRoasterUserEdit.adjweekdate || allot.adjdate === shiftRoasterUserEdit.selectedColumnDate)) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAdjMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(''),
                                    todateshiftmode: String(''),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                    else if (getShiftAdjMatchedId == "" && getShiftAllotMatchedId == "") {
                        await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallot: [
                                ...allUsersShiftallot,
                                {
                                    userid: String(shiftRoasterUserEdit.userid),
                                    username: String(shiftRoasterUserEdit.username),
                                    empcode: String(shiftRoasterUserEdit.empcode),
                                    company: String(shiftRoasterUserEdit.company),
                                    branch: String(shiftRoasterUserEdit.branch),
                                    unit: String(shiftRoasterUserEdit.unit),
                                    team: String(shiftRoasterUserEdit.team),
                                    department: String(shiftRoasterUserEdit.department),
                                    weekoff: String(shiftRoasterUserEdit.weekoff),
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(''),
                                    todateshiftmode: String(''),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                })
                // // shift allot array is empty
                if (allUsersShiftallot && allUsersShiftallot.length === 0) {
                    await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        shiftallot: [
                            ...allUsersShiftallot,
                            {
                                userid: String(shiftRoasterUserEdit.userid),
                                username: String(shiftRoasterUserEdit.username),
                                empcode: String(shiftRoasterUserEdit.empcode),
                                company: String(shiftRoasterUserEdit.company),
                                branch: String(shiftRoasterUserEdit.branch),
                                unit: String(shiftRoasterUserEdit.unit),
                                team: String(shiftRoasterUserEdit.team),
                                department: String(shiftRoasterUserEdit.department),
                                weekoff: String(shiftRoasterUserEdit.weekoff),
                                adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                adjchangeshiftime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                adjstatus: String("Adjustment"),
                                adjustmentstatus: true,
                                secondmode: String(shiftRoasterUserEdit.secondmode),
                                pluseshift: String(getChangeShiftTypeTime),
                                todate: String(''),
                                todateshiftmode: String(''),
                                selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                            },
                        ],
                    });
                    await fetchUsers();
                }
                await fetchUsers();
                handleCloseEdit();
                setShiftRoasterUserEdit({
                    adjustmenttype: "Change Shift", adjchangeshift: "Choose Shift",
                    adjchangeshiftime: "", adjchangereason: "", selectedColumnDate: '', adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', adjdate: "", secondmode: 'Choose 2nd Shiftmode',
                    pluseshift: ''
                });
                setGetAdjShiftTypeTime("");
                setGetChangeShiftTypeTime("");
                setGetAdjShiftTypeTime("");
                setSelectedDateShift('');

            }

            if (shiftRoasterUserEdit.adjustmenttype === 'Change Shift') {
                allUsersShiftallot && allUsersShiftallot?.map(async (allot) => {
                    if (allot._id === getShiftAllotMatchedId) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAllotMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? checkWeekOff : "First Shift"),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(getChangeShiftTypeTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                }
                            ],
                        });
                        await fetchUsers();
                    }
                    else if (allot._id === getShiftAdjMatchedId) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAdjMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? checkWeekOff : "First Shift"),

                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(getChangeShiftTypeTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                }
                            ],
                        });
                        await fetchUsers();
                    }
                    else if (getShiftAdjMatchedId == "" && getShiftAllotMatchedId == "") {
                        await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallot: [
                                ...allUsersShiftallot,
                                {
                                    userid: String(shiftRoasterUserEdit.userid),
                                    username: String(shiftRoasterUserEdit.username),
                                    empcode: String(shiftRoasterUserEdit.empcode),
                                    company: String(shiftRoasterUserEdit.company),
                                    branch: String(shiftRoasterUserEdit.branch),
                                    unit: String(shiftRoasterUserEdit.unit),
                                    team: String(shiftRoasterUserEdit.team),
                                    department: String(shiftRoasterUserEdit.department),
                                    weekoff: String(shiftRoasterUserEdit.weekoff),
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? checkWeekOff : "First Shift"),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(getChangeShiftTypeTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                })
                // shift allot array is empty
                if (allUsersShiftallot && allUsersShiftallot.length === 0) {
                    await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        shiftallot: [
                            ...allUsersShiftallot,
                            {
                                userid: String(shiftRoasterUserEdit.userid),
                                username: String(shiftRoasterUserEdit.username),
                                empcode: String(shiftRoasterUserEdit.empcode),
                                company: String(shiftRoasterUserEdit.company),
                                branch: String(shiftRoasterUserEdit.branch),
                                unit: String(shiftRoasterUserEdit.unit),
                                team: String(shiftRoasterUserEdit.team),
                                department: String(shiftRoasterUserEdit.department),
                                weekoff: String(shiftRoasterUserEdit.weekoff),
                                adjfirstshiftmode: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? checkWeekOff : "First Shift"),
                                adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                adjchangeshiftime: String(getChangeShiftTypeTime),
                                adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                adjdate: String(shiftRoasterUserEdit.selectedColumnDate),

                                adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                adjstatus: String("Adjustment"),
                                adjustmentstatus: true,
                            },
                        ],
                    });
                    await fetchUsers();
                }
                await fetchUsers();
                handleCloseEdit();
                setShiftRoasterUserEdit({
                    adjustmenttype: "Change Shift", adjchangeshift: "Choose Shift",
                    adjchangeshiftime: "", adjchangereason: "", selectedColumnDate: '', adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', adjdate: "", secondmode: 'Choose 2nd Shiftmode',
                    pluseshift: ''
                });
                setGetAdjShiftTypeTime("");
                setGetChangeShiftTypeTime("");
                setSelectedDateShift('');
            }

            if (shiftRoasterUserEdit.adjustmenttype === 'Shift Weekoff Swap') {

                allUsersShiftallot && allUsersShiftallot?.map(async (allot) => {
                    if (allot._id === getShiftAllotMatchedId && (allot.adjdate === shiftRoasterUserEdit.adjweekdate || allot.adjdate === shiftRoasterUserEdit.selectedColumnDate)) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAllotMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(shiftRoasterUserEdit.adjweekdate),
                                    todateshiftmode: String("Week Off"),
                                },
                            ],
                        });
                        await fetchUsers();

                    }
                    else if (allot._id === getShiftAdjMatchedId && (allot.adjdate === shiftRoasterUserEdit.adjweekdate || allot.adjdate === shiftRoasterUserEdit.selectedColumnDate)) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAdjMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(shiftRoasterUserEdit.adjweekdate),
                                    todateshiftmode: String("Week Off"),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                    else if (getShiftAdjMatchedId == "" && getShiftAllotMatchedId == "") {
                        await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallot: [
                                ...allUsersShiftallot,
                                {
                                    userid: String(shiftRoasterUserEdit.userid),
                                    username: String(shiftRoasterUserEdit.username),
                                    empcode: String(shiftRoasterUserEdit.empcode),
                                    company: String(shiftRoasterUserEdit.company),
                                    branch: String(shiftRoasterUserEdit.branch),
                                    unit: String(shiftRoasterUserEdit.unit),
                                    team: String(shiftRoasterUserEdit.team),
                                    department: String(shiftRoasterUserEdit.department),
                                    weekoff: String(shiftRoasterUserEdit.weekoff),
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(shiftRoasterUserEdit.adjweekdate),
                                    todateshiftmode: String("Week Off"),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                })
                // // shift allot array is empty
                if (allUsersShiftallot && allUsersShiftallot.length === 0) {
                    await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        shiftallot: [
                            ...allUsersShiftallot,
                            {
                                userid: String(shiftRoasterUserEdit.userid),
                                username: String(shiftRoasterUserEdit.username),
                                empcode: String(shiftRoasterUserEdit.empcode),
                                company: String(shiftRoasterUserEdit.company),
                                branch: String(shiftRoasterUserEdit.branch),
                                unit: String(shiftRoasterUserEdit.unit),
                                team: String(shiftRoasterUserEdit.team),
                                department: String(shiftRoasterUserEdit.department),
                                weekoff: String(shiftRoasterUserEdit.weekoff),
                                adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                adjchangeshiftime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                adjdate: String(shiftRoasterUserEdit.selectedColumnDate),

                                adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                adjstatus: String("Adjustment"),
                                adjustmentstatus: true,
                                secondmode: String(shiftRoasterUserEdit.secondmode),
                                pluseshift: String(getChangeShiftTypeTime),
                                todate: String(shiftRoasterUserEdit.adjweekdate),
                                todateshiftmode: String("Week Off"),
                            },
                        ],
                    });
                    await fetchUsers();
                }
                await fetchUsers();
                handleCloseEdit();
                setShiftRoasterUserEdit({
                    adjustmenttype: "Change Shift", adjchangeshift: "Choose Shift",
                    adjchangeshiftime: "", adjchangereason: "", selectedColumnDate: '', adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', adjdate: "", secondmode: 'Choose 2nd Shiftmode',
                    pluseshift: ''
                });
                setGetAdjShiftTypeTime("");
                setGetChangeShiftTypeTime("");
                setSelectedDateShift('');
            }

            if (shiftRoasterUserEdit.adjustmenttype === 'WeekOff Adjustment') {

                allUsersShiftallot && allUsersShiftallot?.map(async (allot) => {
                    if (allot._id === getShiftAllotMatchedId && (allot.adjdate === shiftRoasterUserEdit.adjweekoffdate || allot.adjdate === shiftRoasterUserEdit.selectedColumnDate)) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAllotMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? shiftRoasterUserEdit.selectedColumnShiftTime : getChangeShiftTypeTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.adjweekoffdate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    todate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    todateshiftmode: String("Week Off"),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                    else if (allot._id === getShiftAdjMatchedId && (allot.adjdate === shiftRoasterUserEdit.adjweekoffdate || allot.adjdate === shiftRoasterUserEdit.selectedColumnDate)) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAdjMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? shiftRoasterUserEdit.selectedColumnShiftTime : getChangeShiftTypeTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.adjweekoffdate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    todate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    todateshiftmode: String("Week Off"),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                    else if (getShiftAdjMatchedId == "" && getShiftAllotMatchedId == "") {
                        await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallot: [
                                ...allUsersShiftallot,
                                {
                                    userid: String(shiftRoasterUserEdit.userid),
                                    username: String(shiftRoasterUserEdit.username),
                                    empcode: String(shiftRoasterUserEdit.empcode),
                                    company: String(shiftRoasterUserEdit.company),
                                    branch: String(shiftRoasterUserEdit.branch),
                                    unit: String(shiftRoasterUserEdit.unit),
                                    team: String(shiftRoasterUserEdit.team),
                                    department: String(shiftRoasterUserEdit.department),
                                    weekoff: String(shiftRoasterUserEdit.weekoff),
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? shiftRoasterUserEdit.selectedColumnShiftTime : getChangeShiftTypeTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.adjweekoffdate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    todate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    todateshiftmode: String("Week Off"),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                })
                // shift allot array is empty
                if (allUsersShiftallot && allUsersShiftallot.length === 0) {
                    await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        shiftallot: [
                            ...allUsersShiftallot,
                            {
                                userid: String(shiftRoasterUserEdit.userid),
                                username: String(shiftRoasterUserEdit.username),
                                empcode: String(shiftRoasterUserEdit.empcode),
                                company: String(shiftRoasterUserEdit.company),
                                branch: String(shiftRoasterUserEdit.branch),
                                unit: String(shiftRoasterUserEdit.unit),
                                team: String(shiftRoasterUserEdit.team),
                                department: String(shiftRoasterUserEdit.department),
                                weekoff: String(shiftRoasterUserEdit.weekoff),
                                adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                adjchangeshiftime: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? shiftRoasterUserEdit.selectedColumnShiftTime : getChangeShiftTypeTime),
                                adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                adjdate: String(shiftRoasterUserEdit.adjweekoffdate),
                                adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                adjstatus: String("Adjustment"),
                                adjustmentstatus: true,
                                todate: String(shiftRoasterUserEdit.selectedColumnDate),
                                todateshiftmode: String("Week Off"),
                                selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                            },
                        ],
                    });
                    await fetchUsers();
                }
                await fetchUsers();
                handleCloseEdit();
                setShiftRoasterUserEdit({
                    adjustmenttype: "Change Shift", adjchangeshift: "Choose Shift",
                    adjchangeshiftime: "", adjchangereason: "", selectedColumnDate: '', adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', adjdate: "", secondmode: 'Choose 2nd Shiftmode',
                    pluseshift: ''
                });
                setGetAdjShiftTypeTime("");
                setGetChangeShiftTypeTime("");
                setSelectedDateShift('');
            }

            if (shiftRoasterUserEdit.adjustmenttype === 'Shift Adjustment') {

                allUsersShiftallot && allUsersShiftallot?.map(async (allot) => {
                    if (allot._id === getShiftAllotMatchedId && (allot.adjdate === shiftRoasterUserEdit.adjweekdate || allot.adjdate === shiftRoasterUserEdit.selectedColumnDate)) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAllotMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(selectedDateShift),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.adjweekdate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    todateshiftmode: String(''),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();

                    }
                    else if (allot._id === getShiftAdjMatchedId && (allot.adjdate === shiftRoasterUserEdit.adjweekdate || allot.adjdate === shiftRoasterUserEdit.selectedColumnDate)) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAdjMatchedId,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(selectedDateShift),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.adjweekdate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    todateshiftmode: String(''),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                    else if (getShiftAdjMatchedId == "" && getShiftAllotMatchedId == "") {
                        await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallot: [
                                ...allUsersShiftallot,
                                {
                                    userid: String(shiftRoasterUserEdit.userid),
                                    username: String(shiftRoasterUserEdit.username),
                                    empcode: String(shiftRoasterUserEdit.empcode),
                                    company: String(shiftRoasterUserEdit.company),
                                    branch: String(shiftRoasterUserEdit.branch),
                                    unit: String(shiftRoasterUserEdit.unit),
                                    team: String(shiftRoasterUserEdit.team),
                                    department: String(shiftRoasterUserEdit.department),
                                    weekoff: String(shiftRoasterUserEdit.weekoff),
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(selectedDateShift),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.adjweekdate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Adjustment"),
                                    adjustmentstatus: true,
                                    secondmode: String(shiftRoasterUserEdit.secondmode),
                                    pluseshift: String(getChangeShiftTypeTime),
                                    todate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    todateshiftmode: String(''),
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                })
                // // shift allot array is empty
                if (allUsersShiftallot && allUsersShiftallot.length === 0) {
                    await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        shiftallot: [
                            ...allUsersShiftallot,
                            {
                                userid: String(shiftRoasterUserEdit.userid),
                                username: String(shiftRoasterUserEdit.username),
                                empcode: String(shiftRoasterUserEdit.empcode),
                                company: String(shiftRoasterUserEdit.company),
                                branch: String(shiftRoasterUserEdit.branch),
                                unit: String(shiftRoasterUserEdit.unit),
                                team: String(shiftRoasterUserEdit.team),
                                department: String(shiftRoasterUserEdit.department),
                                weekoff: String(shiftRoasterUserEdit.weekoff),
                                adjfirstshiftmode: String(shiftRoasterUserEdit.selectedColumnShiftMode),
                                adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                adjchangeshiftime: String(selectedDateShift),
                                adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                adjdate: String(shiftRoasterUserEdit.adjweekdate),
                                adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                adjstatus: String("Adjustment"),
                                adjustmentstatus: true,
                                secondmode: String(shiftRoasterUserEdit.secondmode),
                                pluseshift: String(getChangeShiftTypeTime),
                                todate: String(shiftRoasterUserEdit.selectedColumnDate),
                                todateshiftmode: String(''),
                                selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                            },
                        ],
                    });
                    await fetchUsers();
                }
                await fetchUsers();
                handleCloseEdit();
                setShiftRoasterUserEdit({
                    adjustmenttype: "Change Shift", adjchangeshift: "Choose Shift",
                    adjchangeshiftime: "", adjchangereason: "", selectedColumnDate: '', adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', adjdate: "", secondmode: 'Choose 2nd Shiftmode',
                    pluseshift: ''
                });
                setGetAdjShiftTypeTime("");
                setGetChangeShiftTypeTime("");
                setGetAdjShiftTypeTime("");
                setSelectedDateShift('');

            }

            if (shiftRoasterUserEdit.adjustmenttype === 'Assign Shift') {
                allUsersShiftallot && allUsersShiftallot?.map(async (allot) => {

                    // if (allot._id === getShiftAllotMatchedId) {
                    //     await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                    //         headers: {
                    //             Authorization: `Bearer ${auth.APIToken}`,
                    //         },
                    //         shiftallotsarray: [
                    //             {
                    //                 ...allot,
                    //                 _id: getShiftAllotMatchedId,
                    //                 adjfirstshiftmode: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? checkWeekOff : "First Shift"),
                    //                 adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                    //                 adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                    //                 adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                    //                 adjchangeshiftime: String(getChangeShiftTypeTime),
                    //                 adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                    //                 adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                    //                 adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                    //                 adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                    //                 adjstatus: String("Approved"),
                    //                 adjustmentstatus: true,
                    //                 removedshiftdate: '',
                    //                 removedondate: '',
                    //                 removedontime: '',
                    //                 selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                    //                 selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                    //             }
                    //         ],
                    //     });
                    //     await fetchUsers();
                    // }
                    // else
                    if (allot._id === getShiftAdjMatchedIdForNotAllotted) {
                        await axios.post(SERVICE.USER_SHIFTALLOT_UPDATE, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallotsarray: [
                                {
                                    ...allot,
                                    _id: getShiftAdjMatchedIdForNotAllotted,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? checkWeekOff : "First Shift"),

                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(getChangeShiftTypeTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Approved"),
                                    adjustmentstatus: true,
                                    removedshiftdate: '',
                                    removedondate: '',
                                    removedontime: '',
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                }
                            ],
                        });
                        await fetchUsers();
                    }
                    else if (getShiftAdjMatchedIdForNotAllotted == "" && getShiftAllotMatchedId == "") {
                        await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            shiftallot: [
                                ...allUsersShiftallot,
                                {
                                    userid: String(shiftRoasterUserEdit.userid),
                                    username: String(shiftRoasterUserEdit.username),
                                    empcode: String(shiftRoasterUserEdit.empcode),
                                    company: String(shiftRoasterUserEdit.company),
                                    branch: String(shiftRoasterUserEdit.branch),
                                    unit: String(shiftRoasterUserEdit.unit),
                                    team: String(shiftRoasterUserEdit.team),
                                    department: String(shiftRoasterUserEdit.department),
                                    weekoff: shiftRoasterUserEdit.weekoff,
                                    adjfirstshiftmode: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? checkWeekOff : "First Shift"),
                                    adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                    adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                    adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                    adjchangeshiftime: String(getChangeShiftTypeTime),
                                    adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                    adjdate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                    adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                    adjstatus: String("Approved"),
                                    adjustmentstatus: true,
                                    removedshiftdate: '',
                                    removedondate: '',
                                    removedontime: '',
                                    selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                    selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                                },
                            ],
                        });
                        await fetchUsers();
                    }
                })
                // shift allot array is empty
                if (allUsersShiftallot && allUsersShiftallot.length === 0) {
                    await axios.put(`${SERVICE.USER_SINGLE_PWD}/${shiftRoasterUserEdit.userid}`, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        shiftallot: [
                            ...allUsersShiftallot,
                            {
                                userid: String(shiftRoasterUserEdit.userid),
                                username: String(shiftRoasterUserEdit.username),
                                empcode: String(shiftRoasterUserEdit.empcode),
                                company: String(shiftRoasterUserEdit.company),
                                branch: String(shiftRoasterUserEdit.branch),
                                unit: String(shiftRoasterUserEdit.unit),
                                team: String(shiftRoasterUserEdit.team),
                                department: String(shiftRoasterUserEdit.department),
                                weekoff: shiftRoasterUserEdit.weekoff,
                                adjfirstshiftmode: String(shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? checkWeekOff : "First Shift"),
                                adjustmenttype: String(shiftRoasterUserEdit.adjustmenttype),
                                adjshiftgrptype: String(shiftRoasterUserEdit.adjshiftgrptype),
                                adjchangeshift: String(shiftRoasterUserEdit.adjchangeshift),
                                adjchangeshiftime: String(getChangeShiftTypeTime),
                                adjchangereason: String(shiftRoasterUserEdit.adjchangereason),
                                adjdate: String(shiftRoasterUserEdit.selectedColumnDate),

                                adjapplydate: String(shiftRoasterUserEdit.adjapplydate),
                                adjapplytime: String(shiftRoasterUserEdit.adjapplytime),
                                adjstatus: String("Approved"),
                                adjustmentstatus: true,
                                removedshiftdate: '',
                                removedondate: '',
                                removedontime: '',
                                selectedDate: String(shiftRoasterUserEdit.selectedColumnDate),
                                selectedShifTime: String(shiftRoasterUserEdit.selectedColumnShiftTime),
                            },
                        ],
                    });
                    await fetchUsers();
                }
                await fetchUsers();
                handleCloseEdit();
                setShiftRoasterUserEdit({
                    adjustmenttype: "Change Shift", adjchangeshift: "Choose Shift",
                    adjchangeshiftime: "", adjchangereason: "", selectedColumnDate: '', adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', adjdate: "", secondmode: 'Choose 2nd Shiftmode',
                    pluseshift: ''
                });
                setGetAdjShiftTypeTime("");
                setGetChangeShiftTypeTime("");
                setSelectedDateShift('');
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    // Helper function to parse shift time in "hh:mmAM/PM - hh:mmAM/PM" format
    const parseShiftTime = (shiftTime) => {
        const [start, end] = shiftTime.split(" - ");
        return {
            startTime: convertTo24Hour(start),
            endTime: convertTo24Hour(end),
        };
    };

    // Helper function to convert "hh:mmAM/PM" to 24-hour time
    const convertTo24Hour = (time) => {
        const [timePart, modifier] = time.split(/(AM|PM)/);
        let [hours, minutes] = timePart.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        } else if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes; // Return time in minutes for easier comparison
    };

    // Function to validate the second shift against the first shift
    const isSecondShiftValid = (firstShift, secondShift, isNightShift) => {
        // Adjust for midnight transition
        const firstShiftEnd = firstShift.endTime < firstShift.startTime ? firstShift.endTime + 1440 : firstShift.endTime;
        const secondShiftStart = isNightShift ? secondShift.startTime + 1440 : secondShift.startTime;
        const secondShiftEnd = secondShift.endTime < secondShift.startTime ? secondShift.endTime + 1440 : secondShift.endTime;

        // Second shift should start after the first shift ends
        return secondShiftStart > firstShiftEnd;
    };

    // Function to validate the second shift against the first shift
    const isSecondShiftValidForNight = (firstShift, secondShift, shiftDate, secondShiftDate) => {
        const firstShiftEnd = firstShift.endTime < firstShift.startTime ? firstShift.endTime + 1440 : firstShift.endTime;
        const secondShiftStart = secondShift.startTime;

        // If the second shift starts on the same day and it's PM for a night user, show alert
        if (secondShiftDate === shiftDate && secondShiftStart >= 720) {
            return false;
        }

        // For shifts spanning days, check if the second shift starts after the first shift ends
        return secondShiftStart > firstShiftEnd;
    };

    // Helper function to validate continuous shift
    const isContinuousShiftValid = (firstShift, secondShift, isNightShift) => {
        // Adjust for midnight transition
        const firstShiftEnd = firstShift.endTime < firstShift.startTime ? firstShift.endTime + 1440 : firstShift.endTime;
        const secondShiftStart = isNightShift ? secondShift.startTime + 1440 : secondShift.startTime;

        // Ensure first shift's end time equals second shift's start time
        return firstShiftEnd === secondShiftStart;
    };

    const handleSubmit = () => {
        if (shiftRoasterUserEdit.adjustmenttype === 'Add On Shift') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setPopupContentMalert("Please Choose Cell To Get Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setPopupContentMalert("Please Choose Cell To Get Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode') {
                setPopupContentMalert("Please Choose 2nd Shiftmode");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setPopupContentMalert("Please Choose Shift (Day/Night))");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setPopupContentMalert("Please Choose Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (getChangeShiftTypeTime == '') {
                setPopupContentMalert("Please Enter Shift Hours");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                // Main validation logic
                if (shiftRoasterUserEdit.secondmode === "Double Shift") {
                    const selectedColumnShiftTime = parseShiftTime(shiftRoasterUserEdit.selectedColumnShiftTime);
                    const changeShiftTypeTime = parseShiftTime(getChangeShiftTypeTime);

                    // Determine if the shift is a night shift (ends after midnight)
                    const isNightShift = selectedColumnShiftTime.startTime >= 720; // Assuming PM shifts start at or after 12:00PM
                    const isSelectedNightShift = changeShiftTypeTime.startTime >= 720;

                    if (isNightShift && isSelectedNightShift) {

                        const [day, month, year] = shiftRoasterUserEdit.selectedColumnDate?.split('/');

                        // Assume shiftDate and secondShiftDate are passed or retrieved from the UI (format: YYYY-MM-DD)
                        const shiftDate = `${year}-${month}-${day}`;
                        const secondShiftDate = `${year}-${month}-${day}`;

                        // Validate night shift
                        if (!isSecondShiftValidForNight(selectedColumnShiftTime, changeShiftTypeTime, shiftDate, secondShiftDate)) {
                            setPopupContentMalert(`${getChangeShiftTypeTime} is between the range of ${shiftRoasterUserEdit.selectedColumnShiftTime}. Please select after shift of first shift`);
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                        } else {
                            sendRequest();
                        }
                    }
                    // Check if start time of getChangeShiftTypeTime is within the range of selectedColumnShiftTime
                    else if (!isSecondShiftValid(selectedColumnShiftTime, changeShiftTypeTime, isNightShift)) {
                        setPopupContentMalert(`${getChangeShiftTypeTime} is between the range of ${shiftRoasterUserEdit.selectedColumnShiftTime}. Please select after shift of first shift`);
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                    } else {
                        sendRequest();
                    }
                } else if (shiftRoasterUserEdit.secondmode === "Continuous Shift") {
                    const selectedColumnShiftTime = parseShiftTime(shiftRoasterUserEdit.selectedColumnShiftTime);
                    const changeShiftTypeTime = parseShiftTime(getChangeShiftTypeTime);

                    // Determine if the shift is a night shift (ends after midnight)
                    const isNightShift = selectedColumnShiftTime.startTime >= 720;

                    if (!isContinuousShiftValid(selectedColumnShiftTime, changeShiftTypeTime, isNightShift)) {
                        setPopupContentMalert("Please select first shift's end time as a second shift's start time");
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                    } else {
                        sendRequest();
                    }
                }
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'Change Shift') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setPopupContentMalert("Please Choose Cell To Get Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setPopupContentMalert("Please Choose Cell To Get Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setPopupContentMalert("Please Choose Shift (Day/Night))");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setPopupContentMalert("Please Choose Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (getChangeShiftTypeTime == '') {
                setPopupContentMalert("Please Enter Shift Hours");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest();
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'Shift Weekoff Swap') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setPopupContentMalert("Please Choose Cell To Get Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setPopupContentMalert("Please Choose Cell To Get Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjweekdate === 'Choose Date') {
                setPopupContentMalert("Please Choose Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode') {
                setPopupContentMalert("Please Choose 2nd Shiftmode");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setPopupContentMalert("Please Choose Shift (Day/Night))");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setPopupContentMalert("Please Choose Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (getChangeShiftTypeTime == '') {
                setPopupContentMalert("Please Enter Shift Hours");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                // Main validation logic
                if (shiftRoasterUserEdit.secondmode === "Double Shift") {
                    const selectedColumnShiftTime = parseShiftTime(shiftRoasterUserEdit.selectedColumnShiftTime);
                    const changeShiftTypeTime = parseShiftTime(getChangeShiftTypeTime);

                    // Determine if the shift is a night shift (ends after midnight)
                    const isNightShift = selectedColumnShiftTime.startTime >= 720; // Assuming PM shifts start at or after 12:00PM
                    const isSelectedNightShift = changeShiftTypeTime.startTime >= 720;

                    if (isNightShift && isSelectedNightShift) {

                        const [day, month, year] = shiftRoasterUserEdit.selectedColumnDate?.split('/');

                        // Assume shiftDate and secondShiftDate are passed or retrieved from the UI (format: YYYY-MM-DD)
                        const shiftDate = `${year}-${month}-${day}`;
                        const secondShiftDate = `${year}-${month}-${day}`;

                        // Validate night shift
                        if (!isSecondShiftValidForNight(selectedColumnShiftTime, changeShiftTypeTime, shiftDate, secondShiftDate)) {
                            setPopupContentMalert(`${getChangeShiftTypeTime} is between the range of ${shiftRoasterUserEdit.selectedColumnShiftTime}. Please select after shift of first shift`);
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                        } else {
                            sendRequest();
                        }
                    }
                    // Check if start time of getChangeShiftTypeTime is within the range of selectedColumnShiftTime
                    else if (!isSecondShiftValid(selectedColumnShiftTime, changeShiftTypeTime, isNightShift)) {
                        setPopupContentMalert(`${getChangeShiftTypeTime} is between the range of ${shiftRoasterUserEdit.selectedColumnShiftTime}. Please select after shift of first shift`);
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                    } else {
                        sendRequest();
                    }
                } else if (shiftRoasterUserEdit.secondmode === "Continuous Shift") {
                    const selectedColumnShiftTime = parseShiftTime(shiftRoasterUserEdit.selectedColumnShiftTime);
                    const changeShiftTypeTime = parseShiftTime(getChangeShiftTypeTime);

                    // Determine if the shift is a night shift (ends after midnight)
                    const isNightShift = selectedColumnShiftTime.startTime >= 720;

                    if (!isContinuousShiftValid(selectedColumnShiftTime, changeShiftTypeTime, isNightShift)) {
                        setPopupContentMalert("Please select first shift's end time as a second shift's start time");
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                    } else {
                        sendRequest();
                    }
                }
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'WeekOff Adjustment') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setPopupContentMalert("Please Choose Cell To Get Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setPopupContentMalert("Please Choose Cell To Get Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjweekoffdate === 'Choose Date') {
                setPopupContentMalert("Please Choose Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest();
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'Shift Adjustment') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setPopupContentMalert("Please Choose Cell To Get Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setPopupContentMalert("Please Choose Cell To Get Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjweekdate === 'Choose Date') {
                setPopupContentMalert("Please Choose Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode') {
                setPopupContentMalert("Please Choose 2nd Shiftmode");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setPopupContentMalert("Please Choose Shift (Day/Night))");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setPopupContentMalert("Please Choose Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (getChangeShiftTypeTime == '') {
                setPopupContentMalert("Please Enter Shift Hours");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedDateShift == '') {
                setPopupContentMalert("Please Select Todate To Get First Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                // Main validation logic
                if (shiftRoasterUserEdit.secondmode === "Double Shift") {
                    const selectedColumnShiftTime = parseShiftTime(selectedDateShift);
                    const changeShiftTypeTime = parseShiftTime(getChangeShiftTypeTime);

                    // Determine if the shift is a night shift (ends after midnight)
                    const isNightShift = selectedColumnShiftTime.startTime >= 720; // Assuming PM shifts start at or after 12:00PM
                    const isSelectedNightShift = changeShiftTypeTime.startTime >= 720;

                    if (isNightShift && isSelectedNightShift) {

                        const [day, month, year] = shiftRoasterUserEdit.selectedColumnDate?.split('/');

                        // Assume shiftDate and secondShiftDate are passed or retrieved from the UI (format: YYYY-MM-DD)
                        const shiftDate = `${year}-${month}-${day}`;
                        const secondShiftDate = `${year}-${month}-${day}`;

                        // Validate night shift
                        if (!isSecondShiftValidForNight(selectedColumnShiftTime, changeShiftTypeTime, shiftDate, secondShiftDate)) {
                            setPopupContentMalert(`${getChangeShiftTypeTime} is between the range of ${selectedDateShift}. Please select after shift of first shift`);
                            setPopupSeverityMalert("warning");
                            handleClickOpenPopupMalert();
                        } else {
                            sendRequest();
                        }
                    }
                    // Check if start time of getChangeShiftTypeTime is within the range of selectedColumnShiftTime
                    else if (!isSecondShiftValid(selectedColumnShiftTime, changeShiftTypeTime, isNightShift)) {
                        setPopupContentMalert(`${getChangeShiftTypeTime} is between the range of ${selectedDateShift}. Please select after shift of first shift`);
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                    } else {
                        sendRequest();
                    }
                } else if (shiftRoasterUserEdit.secondmode === "Continuous Shift") {
                    const selectedColumnShiftTime = parseShiftTime(selectedDateShift);
                    const changeShiftTypeTime = parseShiftTime(getChangeShiftTypeTime);

                    // Determine if the shift is a night shift (ends after midnight)
                    const isNightShift = selectedColumnShiftTime.startTime >= 720;

                    if (!isContinuousShiftValid(selectedColumnShiftTime, changeShiftTypeTime, isNightShift)) {
                        setPopupContentMalert("Please select first shift's end time as a second shift's start time");
                        setPopupSeverityMalert("warning");
                        handleClickOpenPopupMalert();
                    } else {
                        sendRequest();
                    }
                }
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'Assign Shift') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setPopupContentMalert("Please Choose Cell To Get Date");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            // else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
            //     setPopupContentMalert("Please Choose Cell To Get Shift");
            //     setPopupSeverityMalert("warning");
            //     handleClickOpenPopupMalert();
            // }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setPopupContentMalert("Please Choose Shift (Day/Night))");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setPopupContentMalert("Please Choose Shift");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (getChangeShiftTypeTime == '') {
                setPopupContentMalert("Please Enter Shift Hours");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                sendRequest();
            }
        }
    }

    const getShiftForDateAdj = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, matchingRemovedItem, matchingAssignShiftItem) => {

        // if (matchingItem && matchingItem?.adjstatus === 'Adjustment') {
        //     return 'Pending...'
        // }
        // else 
        if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Weekoff Swap') {
            return matchingDoubleShiftItem.todateshiftmode;
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'WeekOff Adjustment') {
            return matchingDoubleShiftItem.todateshiftmode;
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment') {
            if (matchingAssignShiftItem && matchingDoubleShiftItem.todate === matchingAssignShiftItem.adjdate) {
                return `${matchingDoubleShiftItem.adjchangeshiftime.split(' - ')[0]}to${matchingDoubleShiftItem.adjchangeshiftime.split(' - ')[1]}`;
            } else {
                return 'Not Allotted';
            }
        }
        else if (matchingRemovedItem && matchingRemovedItem.adjstatus === 'Not Allotted') {
            return 'Not Allotted';
        }
        else if (matchingItem && matchingItem.adjstatus === 'Approved' && matchingItem.adjustmenttype === "Assign Shift") {
            return `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`;
        }
        else if (matchingItem && matchingItem.adjstatus === 'Approved') {
            return (matchingItem.adjustmenttype === 'Add On Shift' || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
                (<div>
                    {`Main Shift : ${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}<br />
                    {`${matchingItem.secondmode} : ${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`}
                </div>) :
                (isWeekOffWithAdjustment ? (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`));

        }
        // // // after add bulk update based on the change shift option
        // else if (matchingItem && matchingItem.adjstatus === 'Approved') {
        //     const shiftTime = matchingItem.adjchangeshiftime === "Week Off"
        //         ? "Week Off"
        //         : matchingItem.adjchangeshiftime.includes(' - ')
        //             ? `${matchingItem.adjchangeshiftime.split(' - ')[0]} to ${matchingItem.adjchangeshiftime.split(' - ')[1]}`
        //             : matchingItem.adjchangeshiftime;

        //     return (matchingItem.adjustmenttype === 'Add On Shift' || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap')
        //         ? (
        //             <div>
        //                 {`Main Shift : ${shiftTime}`}<br />
        //                 {matchingItem.pluseshift && matchingItem.pluseshift.includes(' - ')
        //                     ? `${matchingItem.secondmode} : ${matchingItem.pluseshift.split(' - ')[0]} to ${matchingItem.pluseshift.split(' - ')[1]}`
        //                     : `${matchingItem.secondmode} : ${matchingItem.pluseshift || ''}`
        //                 }
        //             </div>
        //         )
        //         : (isWeekOffWithAdjustment
        //             ? shiftTime
        //             : shiftTime);
        // }
        else if (matchingItemAllot && matchingItemAllot.status === "Manual") {
            return isWeekOffWithManual ? (`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`) :
                (`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`);
        }
        else if (matchingItemAllot && matchingItemAllot.status === "Week Off") {
            return 'Week Off';
        }
        else if (matchingItem && matchingItem.adjstatus === 'Reject' && isWeekOff) {
            // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
            return '';
        }
        else if (boardingLog.length > 0) {

            // Remove duplicate entries with recent entry
            const uniqueEntries = {};
            boardingLog.forEach(entry => {
                const key = entry.startdate;
                if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                    uniqueEntries[key] = entry;
                }
            });
            const uniqueBoardingLog = Object.values(uniqueEntries);

            const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
            const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

            // Find the relevant log entry for the given date     
            const relevantLogEntry = uniqueBoardingLog
                .filter(log => log.startdate <= finalDate)
                .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

            const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);


            if (relevantLogEntry) {

                // Daily
                if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
                    // If shift type is 'Daily', return the same shift timing for each day
                    //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                    return !logWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                }

                // 1 Week Rotation 2nd try working code
                if (relevantLogEntry.shifttype === 'Daily') {
                    for (const data of relevantLogEntry.todo) {
                        const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
                        if (data.week === columnWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                // 2 Week Rotation 2nd try working code  
                if (relevantLogEntry.shifttype === '1 Week Rotation') {
                    const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                    // Get the day name of the start date
                    const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

                    // Calculate the day count until the next Sunday
                    let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

                    // Calculate the week number based on the day count
                    let weekNumber = Math.ceil((7 - dayCount) / 7);

                    // Adjust the week number considering the two-week rotation
                    const logStartDate = new Date(relevantLogEntry.startdate);
                    const currentDate = new Date(finalDate);

                    const diffTime = Math.abs(currentDate - logStartDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                    // Determine the final week based on the calculated week number                    
                    const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

                    for (const data of relevantLogEntry.todo) {
                        // Check if the adjusted week matches the column week and day
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                //just 2wk rotation
                if (relevantLogEntry.shifttype === '2 Week Rotation') {

                    // Find the matching department entry
                    const matchingDepartment = overAllDepartment.find(
                        (dep) =>
                            dep.department === department &&
                            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                    );

                    // Use the fromdate of the matching department as the startDate
                    let startDate = matchingDepartment
                        ? new Date(matchingDepartment.fromdate)
                        : new Date(relevantLogEntry.startdate);

                    // Calculate month lengths
                    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                    // Function to determine if a year is a leap year
                    const isLeapYear = (year) => {
                        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                    };

                    const currentDate = new Date(finalDate);

                    // Determine the effective month for the start date
                    let effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        // Consider the next month if the start date is after the 15th
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    // Calculate total days for 1-month rotation based on the effective month
                    let totalDays = monthLengths[effectiveMonth];

                    // Set the initial endDate by adding totalDays to the startDate
                    let endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }

                    // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                    while (currentDate > endDate) {
                        // Set startDate to the next matchingDepartment.fromdate for each cycle
                        startDate = new Date(endDate);
                        startDate.setDate(startDate.getDate() + 1); // Move to the next day

                        // Determine the new effective month for the next cycle
                        effectiveMonth = startDate.getMonth();
                        if (startDate.getDate() > 15) {
                            effectiveMonth = (effectiveMonth + 1) % 12;
                        }

                        totalDays = monthLengths[effectiveMonth];

                        // Set the new endDate by adding totalDays to the new startDate
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                        // Adjust February for leap years
                        if (isLeapYear(endDate.getFullYear())) {
                            monthLengths[1] = 29;
                        }
                    }

                    // Calculate the difference in days correctly
                    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

                    // Determine the start day of the first week
                    let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                    // Adjust the start day so that Monday is considered the start of the week
                    let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculate the week number based on Monday to Sunday cycle
                    let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day                                      

                    // Calculate the week number within the rotation month based on 7-day intervals from start date
                    // const weekNumber = Math.ceil(diffDays / 7);
                    let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

                    const weekNames = [
                        "1st Week",
                        "2nd Week",
                        "3rd Week",
                        "4th Week",
                        "5th Week",
                        "6th Week",
                        // "7th Week",
                        // "8th Week",
                        // "9th Week",
                    ];
                    const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

                    // console.log({
                    //     startDate,
                    //     currentDate,
                    //     endDate,
                    //     diffTime,
                    //     diffDays,
                    //     weekNumber,
                    //     finalWeek,
                    // });

                    for (const data of relevantLogEntry.todo) {
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                        }
                    }
                }

                if (relevantLogEntry.shifttype === '1 Month Rotation') {

                    // Find the matching department entry
                    const matchingDepartment = overAllDepartment.find(
                        (dep) =>
                            dep.department === department &&
                            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                    );

                    // Use the fromdate of the matching department as the startDate
                    let startDate = matchingDepartment
                        ? new Date(matchingDepartment.fromdate)
                        : new Date(relevantLogEntry.startdate);

                    const currentDate = new Date(finalDate);

                    // Function to determine if a year is a leap year
                    const isLeapYear = (year) => {
                        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                    };

                    // Calculate month lengths with leap year check for a given year
                    const calculateMonthLengths = (year) => {
                        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    };

                    // Determine the effective month and year for the start date
                    let effectiveMonth = startDate.getMonth();
                    let effectiveYear = startDate.getFullYear();
                    if (startDate.getDate() > 15) {
                        // Consider the next month if the start date is after the 15th
                        effectiveMonth = (effectiveMonth + 1) % 12;
                        if (effectiveMonth === 0) {
                            effectiveYear += 1; // Move to the next year if month resets
                        }
                    }

                    // Calculate total days for the current two-month cycle
                    let totalDays = 0;
                    for (let i = 0; i < 2; i++) {
                        const monthIndex = (effectiveMonth + i) % 12;
                        const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                        const currentYear = effectiveYear + yearAdjustment;
                        const monthLengthsForYear = calculateMonthLengths(currentYear);
                        totalDays += monthLengthsForYear[monthIndex];
                    }

                    // Set the endDate by adding totalDays to the startDate
                    let endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Recalculate if currentDate is beyond the initial endDate
                    while (currentDate > endDate) {
                        startDate = new Date(endDate);
                        startDate.setDate(startDate.getDate() + 1); // Move to the next day

                        // Determine the new effective month and year for the next cycle
                        effectiveMonth = startDate.getMonth();
                        effectiveYear = startDate.getFullYear();
                        if (startDate.getDate() > 15) {
                            effectiveMonth = (effectiveMonth + 1) % 12;
                            if (effectiveMonth === 0) {
                                effectiveYear += 1;
                            }
                        }

                        totalDays = 0;
                        for (let i = 0; i < 2; i++) {
                            const monthIndex = (effectiveMonth + i) % 12;
                            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                            const currentYear = effectiveYear + yearAdjustment;
                            const monthLengthsForYear = calculateMonthLengths(currentYear);
                            totalDays += monthLengthsForYear[monthIndex];
                        }

                        // Set the new endDate by adding totalDays to the new startDate
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
                    }

                    // console.log(calculateMonthLengths(startDate.getFullYear()), 'monthLengths for current period');

                    // Calculate the difference in days including the start date
                    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                    // Determine the start day of the first week
                    let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                    // Adjust the start day so that Monday is considered the start of the week
                    let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculate the week number based on Monday to Sunday cycle
                    let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                    let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                    // Define week names for first and second month of the cycle
                    const weekNamesFirstMonth = [
                        "1st Week",
                        "2nd Week",
                        "3rd Week",
                        "4th Week",
                        "5th Week",
                        "6th Week"
                    ];

                    const weekNamesSecondMonth = [
                        "7th Week",
                        "8th Week",
                        "9th Week",
                        "10th Week",
                        "11th Week",
                        "12th Week"
                    ];

                    // Determine which month we are in
                    const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
                    let finalWeek;

                    if (diffDays <= daysInFirstMonth) {
                        // We're in the first month of the cycle
                        weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
                        finalWeek = weekNamesFirstMonth[weekNumber - 1];
                    } else {
                        // We're in the second month of the cycle
                        const secondMonthDay = diffDays - daysInFirstMonth;

                        // Calculate week number based on Monday-Sunday for the second month
                        const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                        const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                        const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                        const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                        finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                    }

                    // console.log({
                    //     startDate,
                    //     currentDate,
                    //     endDate,
                    //     diffTime,
                    //     diffDays,
                    //     weekNumber,
                    //     finalWeek,
                    // });

                    for (const data of relevantLogEntry.todo) {
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                        }
                    }
                }


                // working code based on the give excel calculation code without retun shift
                // if (relevantLogEntry.shifttype === '1 Month Rotation') {
                //     const matchingDepartment = overAllDepartment.find(
                //         (dep) =>
                //             dep.department === department &&
                //             new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                //             new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                //     );

                //     // Use the fromdate of the matching department as the startDate
                //     let startDate = matchingDepartment
                //         ? new Date(matchingDepartment.fromdate)
                //         : new Date(relevantLogEntry.startdate);

                //     const finalDepDates = [];
                //     const depStartDate = matchingDepartment && matchingDepartment.fromdate;
                //     const dep = matchingDepartment && matchingDepartment.department;

                //     let startIndex = overAllDepartment.findIndex(
                //         (d) => d.fromdate === depStartDate && d.department === dep
                //     );

                //     if (startIndex !== -1) {
                //         for (let i = 0; i < overallsettings; i++) {
                //             const index = startIndex + i;
                //             if (index < overAllDepartment.length) {
                //                 finalDepDates.push({
                //                     department: overAllDepartment[index].department,
                //                     fromdate: overAllDepartment[index].fromdate,
                //                     todate: overAllDepartment[index].todate,
                //                     monthname: overAllDepartment[index].monthname,
                //                     year: overAllDepartment[index].year,
                //                     totaldays: overAllDepartment[index].totaldays,
                //                 });
                //             }
                //         }
                //     }
                //     console.log(finalDepDates, 'finalDepDates');

                //     function calculateWeekNumber(currentDate, firstStart, firstEnd, secondStart, secondEnd) {
                //         const current = new Date(currentDate);
                //         const firstStartDate = new Date(firstStart);
                //         const firstEndDate = new Date(firstEnd);
                //         const secondStartDate = new Date(secondStart);
                //         const secondEndDate = new Date(secondEnd);

                //         // Helper function to calculate week number
                //         function getWeekNumber(start, date) {
                //             const weekDayOffset = (start.getDay() || 7) - 1; // Monday = 0, Sunday = 6
                //             return Math.floor((date - start + weekDayOffset * 24 * 3600 * 1000) / (7 * 24 * 3600 * 1000)) + 1;
                //         }

                //         if (current >= firstStartDate && current <= firstEndDate) {
                //             return getWeekNumber(firstStartDate, current) === 1 ? `${getWeekNumber(firstStartDate, current)}st Week` : getWeekNumber(firstStartDate, current) === 2 ? `${getWeekNumber(firstStartDate, current)}nd Week` : getWeekNumber(firstStartDate, current) === 3 ? `${getWeekNumber(firstStartDate, current)}rd Week` : getWeekNumber(firstStartDate, current) > 0 ? `${getWeekNumber(firstStartDate, current)}th Week` : '';
                //         } else if (current >= secondStartDate && current <= secondEndDate) {
                //             const weeksInFirstMonth = getWeekNumber(firstStartDate, firstEndDate);
                //             return `Week ${getWeekNumber(secondStartDate, current) + weeksInFirstMonth}`;
                //         } else if (current > secondEndDate) {
                //             const weeksInFirstAndSecondMonth = getWeekNumber(firstStartDate, secondEndDate) + 1;
                //             return `Week ${getWeekNumber(new Date(secondEndDate.getTime() + 24 * 3600 * 1000), current) + weeksInFirstAndSecondMonth}`;
                //         }

                //         return "Date out of range";
                //     }

                //     function getDatesAndWeeks(startDate, finalDepDates) {
                //         const dates = [];
                //         let currentDate = new Date(startDate);

                //         // Iterate over the date ranges
                //         for (let i = 0; i < finalDepDates.length; i += 2) {
                //             const firstMonth = finalDepDates[i];
                //             const secondMonth = finalDepDates[i + 1];

                //             if (!secondMonth) break; // Stop if no pair is available

                //             const firstStart = new Date(firstMonth.fromdate);
                //             const firstEnd = new Date(firstMonth.todate);
                //             const secondStart = new Date(secondMonth.fromdate);
                //             const secondEnd = new Date(secondMonth.todate);

                //             while (currentDate <= secondEnd) {
                //                 const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                //                 dates.push({
                //                     date: currentDate.toISOString().split('T')[0],
                //                     week: calculateWeekNumber(currentDate.toISOString().split('T')[0], firstStart, firstEnd, secondStart, secondEnd),
                //                     day: dayNames[currentDate.getDay()],
                //                     firstStart: firstStart.toISOString().split('T')[0],
                //                     firstEnd: firstEnd.toISOString().split('T')[0],
                //                     secondStart: secondStart.toISOString().split('T')[0],
                //                     secondEnd: secondEnd.toISOString().split('T')[0]
                //                 });

                //                 if (currentDate >= firstEnd && currentDate < secondStart) {
                //                     // Skip to second start if current date is beyond first end
                //                     currentDate = new Date(secondStart);
                //                 } else {
                //                     // Move to the next day
                //                     currentDate.setDate(currentDate.getDate() + 1);
                //                 }

                //                 if (currentDate > secondEnd) break; // Break if beyond second end
                //             }
                //         }
                //         return dates;
                //     }

                //     let newComparedArray = getDatesAndWeeks(startDate, finalDepDates);
                //     console.log(newComparedArray);

                //     // for (const data of relevantLogEntry.todo) {
                //     //     if (data.week === finalWeek && data.day === column.dayName) {
                //     //         return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                //     //     }
                //     // }

                // }

            }
        }
    };

    const getWeekOffDay = (column, boardingLog, department) => {
        if (boardingLog.length > 0) {

            // Remove duplicate entries with recent entry
            const uniqueEntries = {};
            boardingLog.forEach(entry => {
                const key = entry.startdate;
                if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                    uniqueEntries[key] = entry;
                }
            });
            const uniqueBoardingLog = Object.values(uniqueEntries);

            const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
            const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

            // Find the relevant log entry for the given date     
            const relevantLogEntry = uniqueBoardingLog
                .filter(log => log.startdate <= finalDate)
                .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

            const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName)

            if (relevantLogEntry) {

                // Daily
                if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
                    // If shift type is 'Daily', return the same shift timing for each day
                    //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                    return !logWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                }

                // 1 Week Rotation 2nd try working code
                if (relevantLogEntry.shifttype === 'Daily') {
                    for (const data of relevantLogEntry.todo) {
                        const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
                        if (data.week === columnWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                // 2 Week Rotation 2nd try working code  
                if (relevantLogEntry.shifttype === '1 Week Rotation') {
                    const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                    // Get the day name of the start date
                    const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

                    // Calculate the day count until the next Sunday
                    let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

                    // Calculate the week number based on the day count
                    let weekNumber = Math.ceil((7 - dayCount) / 7);

                    // Adjust the week number considering the two-week rotation
                    const logStartDate = new Date(relevantLogEntry.startdate);
                    const currentDate = new Date(finalDate);

                    const diffTime = Math.abs(currentDate - logStartDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                    // Determine the final week based on the calculated week number                    
                    const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

                    for (const data of relevantLogEntry.todo) {
                        // Check if the adjusted week matches the column week and day
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
                        }
                    }
                }

                //just 2wk rotation
                if (relevantLogEntry.shifttype === '2 Week Rotation') {

                    // Find the matching department entry
                    const matchingDepartment = overAllDepartment.find(
                        (dep) =>
                            dep.department === department &&
                            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                    );

                    // Use the fromdate of the matching department as the startDate
                    let startDate = matchingDepartment
                        ? new Date(matchingDepartment.fromdate)
                        : new Date(relevantLogEntry.startdate);

                    // Calculate month lengths
                    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                    // Function to determine if a year is a leap year
                    const isLeapYear = (year) => {
                        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                    };

                    const currentDate = new Date(finalDate);

                    // Determine the effective month for the start date
                    let effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        // Consider the next month if the start date is after the 15th
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    // Calculate total days for 1-month rotation based on the effective month
                    let totalDays = monthLengths[effectiveMonth];

                    // Set the initial endDate by adding totalDays to the startDate
                    let endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }

                    // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                    while (currentDate > endDate) {
                        // Set startDate to the next matchingDepartment.fromdate for each cycle
                        startDate = new Date(endDate);
                        startDate.setDate(startDate.getDate() + 1); // Move to the next day

                        // Determine the new effective month for the next cycle
                        effectiveMonth = startDate.getMonth();
                        if (startDate.getDate() > 15) {
                            effectiveMonth = (effectiveMonth + 1) % 12;
                        }

                        totalDays = monthLengths[effectiveMonth];

                        // Set the new endDate by adding totalDays to the new startDate
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                        // Adjust February for leap years
                        if (isLeapYear(endDate.getFullYear())) {
                            monthLengths[1] = 29;
                        }
                    }

                    // Calculate the difference in days correctly
                    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

                    // Determine the start day of the first week
                    let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                    // Adjust the start day so that Monday is considered the start of the week
                    let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculate the week number based on Monday to Sunday cycle
                    let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day                                      

                    // Calculate the week number within the rotation month based on 7-day intervals from start date
                    // const weekNumber = Math.ceil(diffDays / 7);
                    let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

                    const weekNames = [
                        "1st Week",
                        "2nd Week",
                        "3rd Week",
                        "4th Week",
                        "5th Week",
                        "6th Week",
                        "7th Week",
                        "8th Week",
                        "9th Week",
                    ];
                    const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

                    // console.log({
                    //     startDate,
                    //     currentDate,
                    //     endDate,
                    //     diffTime,
                    //     diffDays,
                    //     weekNumber,
                    //     finalWeek,
                    // });

                    for (const data of relevantLogEntry.todo) {
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                        }
                    }
                }

                //just 1mont rota             
                // if (relevantLogEntry.shifttype === '1 Month Rotation') {
                //     // Find the matching department entry
                //     const matchingDepartment = overAllDepartment.find(
                //         (dep) =>
                //             dep.department === department &&
                //             new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                //             new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                //     );

                //     // Use the fromdate of the matching department as the startDate
                //     let startDate = matchingDepartment
                //         ? new Date(matchingDepartment.fromdate)
                //         : new Date(relevantLogEntry.startdate);

                //     const currentDate = new Date(finalDate);

                //     // Calculate month lengths
                //     const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                //     // Function to determine if a year is a leap year
                //     const isLeapYear = (year) => {
                //         return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                //     };

                //     // Determine the effective month for the start date
                //     let effectiveMonth = startDate.getMonth();
                //     if (startDate.getDate() > 15) {
                //         // Consider the next month if the start date is after the 15th
                //         effectiveMonth = (effectiveMonth + 1) % 12;
                //     }

                //     let totalDays = 0;

                //     // Calculate total days for 2-month rotation based on the effective month
                //     for (let i = 0; i < 2; i++) {
                //         const monthIndex = (effectiveMonth + i) % 12;
                //         totalDays += monthLengths[monthIndex];
                //     }

                //     // Set the initial endDate by adding totalDays to the startDate
                //     let endDate = new Date(startDate);
                //     endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                //     // Adjust February for leap years
                //     if (isLeapYear(endDate.getFullYear())) {
                //         monthLengths[1] = 29;
                //     }

                //     // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                //     while (currentDate > endDate) {
                //         startDate = new Date(endDate);
                //         startDate.setDate(startDate.getDate() + 1); // Move to the next day

                //         // Determine the new effective month for the next cycle
                //         effectiveMonth = startDate.getMonth();
                //         if (startDate.getDate() > 15) {
                //             effectiveMonth = (effectiveMonth + 1) % 12;
                //         }

                //         totalDays = 0;
                //         for (let i = 0; i < 2; i++) {
                //             const monthIndex = (effectiveMonth + i) % 12;
                //             totalDays += monthLengths[monthIndex];
                //         }

                //         // Set the new endDate by adding totalDays to the new startDate
                //         endDate = new Date(startDate);
                //         endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                //         // Adjust February for leap years
                //         if (isLeapYear(endDate.getFullYear())) {
                //             monthLengths[1] = 29;
                //         }
                //     }

                //     // Calculate the difference in days including the start date
                //     const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                //     // Determine the start day of the first week
                //     let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                //     // Adjust the start day so that Monday is considered the start of the week
                //     let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                //     // Calculate the week number based on Monday to Sunday cycle
                //     let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                //     let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                //     // Define week names for first and second month of the cycle
                //     const weekNamesFirstMonth = [
                //         "1st Week",
                //         "2nd Week",
                //         "3rd Week",
                //         "4th Week",
                //         "5th Week",
                //         "6th Week"
                //     ];

                //     const weekNamesSecondMonth = [
                //         "7th Week",
                //         "8th Week",
                //         "9th Week",
                //         "10th Week",
                //         "11th Week",
                //         "12th Week"
                //     ];

                //     // Determine which month we are in
                //     const daysInFirstMonth = monthLengths[effectiveMonth];
                //     let finalWeek;

                //     if (diffDays <= daysInFirstMonth) {
                //         // We're in the first month of the cycle
                //         weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
                //         finalWeek = weekNamesFirstMonth[weekNumber - 1];
                //     } else {
                //         // We're in the second month of the cycle
                //         const daysInSecondMonth = totalDays - daysInFirstMonth;
                //         const secondMonthDay = diffDays - daysInFirstMonth;

                //         // Calculate week number based on Monday-Sunday for the second month
                //         const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                //         const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                //         const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                //         const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                //         finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                //     }

                //     // console.log({
                //     //     startDate,
                //     //     currentDate,
                //     //     endDate,
                //     //     diffTime,
                //     //     diffDays,
                //     //     weekNumber,
                //     //     finalWeek,
                //     // });

                //     for (const data of relevantLogEntry.todo) {
                //         if (data.week === finalWeek && data.day === column.dayName) {
                //             return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                //         }
                //     }
                // }
                if (relevantLogEntry.shifttype === '1 Month Rotation') {

                    // Find the matching department entry
                    const matchingDepartment = overAllDepartment.find(
                        (dep) =>
                            dep.department === department &&
                            new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
                            new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
                    );

                    // Use the fromdate of the matching department as the startDate
                    let startDate = matchingDepartment
                        ? new Date(matchingDepartment.fromdate)
                        : new Date(relevantLogEntry.startdate);

                    const currentDate = new Date(finalDate);

                    // Function to determine if a year is a leap year
                    const isLeapYear = (year) => {
                        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                    };

                    // Calculate month lengths with leap year check for a given year
                    const calculateMonthLengths = (year) => {
                        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    };

                    // Determine the effective month and year for the start date
                    let effectiveMonth = startDate.getMonth();
                    let effectiveYear = startDate.getFullYear();
                    if (startDate.getDate() > 15) {
                        // Consider the next month if the start date is after the 15th
                        effectiveMonth = (effectiveMonth + 1) % 12;
                        if (effectiveMonth === 0) {
                            effectiveYear += 1; // Move to the next year if month resets
                        }
                    }

                    // Calculate total days for the current two-month cycle
                    let totalDays = 0;
                    for (let i = 0; i < 2; i++) {
                        const monthIndex = (effectiveMonth + i) % 12;
                        const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                        const currentYear = effectiveYear + yearAdjustment;
                        const monthLengthsForYear = calculateMonthLengths(currentYear);
                        totalDays += monthLengthsForYear[monthIndex];
                    }

                    // Set the endDate by adding totalDays to the startDate
                    let endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Recalculate if currentDate is beyond the initial endDate
                    while (currentDate > endDate) {
                        startDate = new Date(endDate);
                        startDate.setDate(startDate.getDate() + 1); // Move to the next day

                        // Determine the new effective month and year for the next cycle
                        effectiveMonth = startDate.getMonth();
                        effectiveYear = startDate.getFullYear();
                        if (startDate.getDate() > 15) {
                            effectiveMonth = (effectiveMonth + 1) % 12;
                            if (effectiveMonth === 0) {
                                effectiveYear += 1;
                            }
                        }

                        totalDays = 0;
                        for (let i = 0; i < 2; i++) {
                            const monthIndex = (effectiveMonth + i) % 12;
                            const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                            const currentYear = effectiveYear + yearAdjustment;
                            const monthLengthsForYear = calculateMonthLengths(currentYear);
                            totalDays += monthLengthsForYear[monthIndex];
                        }

                        // Set the new endDate by adding totalDays to the new startDate
                        endDate = new Date(startDate);
                        endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
                    }

                    // console.log(calculateMonthLengths(startDate.getFullYear()), 'monthLengths for current period');

                    // Calculate the difference in days including the start date
                    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                    // Determine the start day of the first week
                    let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                    // Adjust the start day so that Monday is considered the start of the week
                    let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                    // Calculate the week number based on Monday to Sunday cycle
                    let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                    let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                    // Define week names for first and second month of the cycle
                    const weekNamesFirstMonth = [
                        "1st Week",
                        "2nd Week",
                        "3rd Week",
                        "4th Week",
                        "5th Week",
                        "6th Week"
                    ];

                    const weekNamesSecondMonth = [
                        "7th Week",
                        "8th Week",
                        "9th Week",
                        "10th Week",
                        "11th Week",
                        "12th Week"
                    ];

                    // Determine which month we are in
                    const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
                    let finalWeek;

                    if (diffDays <= daysInFirstMonth) {
                        // We're in the first month of the cycle
                        weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
                        finalWeek = weekNamesFirstMonth[weekNumber - 1];
                    } else {
                        // We're in the second month of the cycle
                        const secondMonthDay = diffDays - daysInFirstMonth;

                        // Calculate week number based on Monday-Sunday for the second month
                        const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                        const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                        const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                        const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                        finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                    }

                    // console.log({
                    //     startDate,
                    //     currentDate,
                    //     endDate,
                    //     diffTime,
                    //     diffDays,
                    //     weekNumber,
                    //     finalWeek,
                    // });

                    for (const data of relevantLogEntry.todo) {
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                        }
                    }
                }
            }
        }
    }

    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            resizable: true,
            filterParams: {
                buttons: ["apply", "reset", "cancel"],
            },
        };
    }, []);

    const onGridReadyMyFinalAdj = useCallback((params) => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    }, []);

    // Function to handle filter changes
    const onFilterChangedMyFinalAdj = () => {
        if (gridApi) {
            const filterModel = gridApi.getFilterModel(); // Get the current filter model

            // Check if filters are active
            if (Object.keys(filterModel).length === 0) {
                // No filters active, clear the filtered data state
                setFilteredRowData([]);
            } else {
                // Filters are active, capture filtered data
                const filteredDataMyFinalAdj = [];
                gridApi.forEachNodeAfterFilterAndSort((node) => {
                    filteredDataMyFinalAdj.push(node.data); // Collect filtered row data
                });
                setFilteredRowData(filteredDataMyFinalAdj);
            }
        }
    };

    const onPaginationChangedMyFinalAdj = useCallback(() => {
        if (gridRefTableMyFinalAdj.current) {
            const gridApi = gridRefTableMyFinalAdj.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesMyFinalAdj = gridApi.paginationGetTotalPages();
            setPageMyFinalAdj(currentPage);
            setTotalPagesMyFinalAdj(totalPagesMyFinalAdj);
        }
    }, []);

    const columnDataTableMyFinalAdj = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityMyFinalAdj.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityMyFinalAdj.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Name", flex: 0, width: 250, hide: !columnVisibilityMyFinalAdj.username, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "department", headerName: "Department", flex: 0, width: 200, hide: !columnVisibilityMyFinalAdj.department, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityMyFinalAdj.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibilityMyFinalAdj.unit, headerClassName: "bold-header", },

        ...daysArray.map((column, index) => {
            const fieldName = `${column.formattedDate} ${column.dayName} Day${column.dayCount}`;
            // disabling the buttons based on the current date
            let currentday = String(currentDate1Adj.getDate()).padStart(2, '0');
            let currentmonth = String(currentDate1Adj.getMonth() + 1).padStart(2, '0');
            let currentyear = currentDate1Adj.getFullYear();
            const currentFormattedDate = new Date(`${currentmonth}/${currentday}/${currentyear}`);
            const [formatday1, fromatmonth1, formatyear1] = column.formattedDate?.split('/');
            const columnFormattedDate = new Date(`${fromatmonth1}/${formatday1}/${formatyear1}`);

            // find before 5 days from the currentdate to disable
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 5);

            const formattedDateNew = new Date(`${formatyear1}-${fromatmonth1}-${formatday1}`);

            return {
                field: fieldName,
                headerName: fieldName,
                hide: !columnVisibilityMyFinalAdj[fieldName],
                flex: 0,
                width: 180,
                filter: false,
                sortable: false,
                cellRenderer: (params) => {
                    let filteredRowDataMyFinalAdj = allUserDates.filter((val) => val.empcode == params.data.empcode);
                    const matchingItem = filteredRowDataMyFinalAdj.find(item => item.adjdate == column.formattedDate);
                    const dayData = params.data.days?.find(day => day.date === column.formattedDate);
                    // Check if dayData is defined
                    if (!dayData) {
                        return null; // or return a default component
                    }

                    // console.log(dayData, 'dayData')

                    // const matchingItemAllot = filteredRowDataMyFinalAdj.find(item => formatDate(item.date) === column.formattedDate);
                    // Check if the dayName is Sunday or Monday ...
                    // const isWeekOff = params.data.weekoff?.includes(column.dayName);                  

                    // const isWeekOff = filterBoardingLog.length > 0 ? filterBoardingLog[filterBoardingLog.length - 1].weekoff?.includes(column.dayName) : false;
                    // const isWeekOff = params.data.days[index].shiftlabel === 'Week Off' ? true : false;
                    const isWeekOff = dayData?.shiftlabel === 'Week Off' ? true : false;

                    // Disable the button if the date is before the current date
                    // const isDisabled = (currentyear >= formatyear1 && currentmonth >= fromatmonth1 && currentday > formatday1);
                    // const isDisabled = (columnFormattedDate <= currentFormattedDate)
                    const isDisabled = new Date(columnFormattedDate) < currentDate;

                    const reasonDate = new Date(params.data.reasondate);
                    // const dojDate = new Date(params.data.doj);
                    const userDoj = params.data?.boardingLog.length > 0 ?
                        params.data?.boardingLog[0].startdate
                        : params.data?.doj
                    const dojDate = new Date(userDoj);
                    const isDisable1 = formattedDateNew < dojDate
                    const isDisable2 = formattedDateNew > reasonDate

                    if (params.data.reasondate && params.data.reasondate != "" && formattedDateNew > reasonDate) {
                        return (
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ margin: '5px', }}>
                                    <Button
                                        size="small"
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
                                            padding: '3px 10px',
                                            color: 'black',
                                            backgroundColor: 'rgba(224, 224, 224, 1)',
                                            pointerEvents: 'none',

                                        }}
                                        // Disable the button if the date is before the current date
                                        disabled={isDisable2}
                                    >
                                        {params.data.resonablestatus}
                                    </Button>
                                </Box>
                            </Grid >
                        );
                    }
                    else if (params.data.doj && params.data.doj != "" && formattedDateNew < dojDate) {
                        return (
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ margin: '5px', }}>
                                    <Button
                                        size="small"
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
                                            padding: '3px 10px',
                                            color: 'black',
                                            backgroundColor: 'rgba(224, 224, 224, 1)',
                                            pointerEvents: 'none',

                                        }}
                                        // Disable the button if the date is before the current date
                                        disabled={isDisable1}
                                    >
                                        {"Not Joined"}
                                    </Button>
                                </Box>
                            </Grid >
                        );
                    }
                    else if (params.data.doj && params.data.doj != "" && formattedDateNew >= dojDate) {
                        if (!dayData?.adjstatus) {
                            return null; // or return a default component
                        }
                        return (
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Box sx={{ margin: '5px', }}>
                                    <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                        {dayData?.depstatus}
                                    </Typography>
                                    <Button
                                        size="small"
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
                                            // padding: params.data.days[index].adjstatus === 'Approved' ? '3px 8px' : isWeekOff ? '3px 10px' : '3px 8px',
                                            // color: params.data.days[index].adjstatus === "Week Off" ? '#892a23' : params.data.days[index].adjstatus === 'Manual' ? '#052106' : params.data.days[index].adjstatus === 'Adjustment' ? 'white' : params.data.days[index].adjstatus === 'Approved' ? '#052106' : isWeekOff ? '#892a23' : params.data.days[index].adjstatus === '' ? 'none' : 'white',
                                            // backgroundColor: isDisabled ? params.data.days[index].adjstatus === '' ? 'none' : 'rgba(224, 224, 224, 1)' : (params.data.days[index].adjstatus === "Week Off" ? 'rgb(243 174 174)' : params.data.days[index].adjstatus === 'Manual' ? 'rgb(243 203 117)' : params.data.days[index].adjstatus === 'Adjustment' ? '#1976d2' : params.data.days[index].adjstatus === 'Approved' ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : params.data.days[index].adjstatus === '' ? 'none' : '#1976d2'),
                                            // pointerEvents: (params.data.days[index].adjstatus === 'Approved' || params.data.days[index].adjstatus === '' || matchingItem && matchingItem?.secondmode) ? 'none' : 'auto',
                                            // '&:hover': {
                                            //     color: params.data.days[index].adjstatus === "Week Off" ? '#892a23' : params.data.days[index].adjstatus === 'Manual' ? '#052106' : params.data.days[index].adjstatus === 'Adjustment' ? 'white' : params.data.days[index].adjstatus === 'Approved' ? '#052106' : isWeekOff ? '#892a23' : params.data.days[index].adjstatus === '' ? 'none' : 'white',
                                            //     backgroundColor: params.data.days[index].adjstatus === "Week Off" ? 'rgb(243 174 174)' : params.data.days[index].adjstatus === 'Manual' ? 'rgb(243 203 117)' : params.data.days[index].adjstatus === 'Adjustment' ? '#1976d2' : params.data.days[index].adjstatus === 'Approved' ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : params.data.days[index].adjstatus === '' ? 'none' : '#1976d2',
                                            // },
                                            padding: dayData?.adjstatus === 'Approved' ? '3px 8px' : isWeekOff ? '3px 10px' : '3px 8px',
                                            color: dayData?.adjstatus === "Week Off" ? '#892a23' : dayData?.adjstatus === 'Manual' ? '#052106' : dayData?.adjstatus === 'Adjustment' ? 'white' : dayData?.adjstatus === 'Approved' ? '#052106' : isWeekOff ? '#892a23' : dayData?.adjstatus === '' ? 'none' : 'white',
                                            backgroundColor: isDisabled ? dayData?.adjstatus === '' ? 'none' : 'rgba(224, 224, 224, 1)' : (dayData?.adjstatus === "Week Off" ? 'rgb(243 174 174)' : dayData?.adjstatus === 'Manual' ? 'rgb(243 203 117)' : dayData?.adjstatus === 'Adjustment' ? '#1976d2' : dayData?.adjstatus === 'Approved' ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : dayData?.adjstatus === '' ? 'none' : dayData?.adjstatus === 'Not Allotted' ? 'red' : '#1976d2'),
                                            pointerEvents: params.data.adjstatus === 'Not Allotted' ? 'auto' : (dayData?.adjstatus === 'Approved' || dayData?.adjstatus === '' || matchingItem && matchingItem?.secondmode) ? 'none' : 'auto',
                                            '&:hover': {
                                                color: dayData?.adjstatus === "Week Off" ? '#892a23' : dayData?.adjstatus === 'Manual' ? '#052106' : dayData?.adjstatus === 'Adjustment' ? 'white' : dayData?.adjstatus === 'Approved' ? '#052106' : isWeekOff ? '#892a23' : dayData?.adjstatus === '' ? 'none' : 'white',
                                                backgroundColor: dayData?.adjstatus === "Week Off" ? 'rgb(243 174 174)' : dayData?.adjstatus === 'Manual' ? 'rgb(243 203 117)' : dayData?.adjstatus === 'Adjustment' ? '#1976d2' : dayData?.adjstatus === 'Approved' ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : dayData?.adjstatus === '' ? 'none' : dayData?.adjstatus === 'Not Allotted' ? 'red' : '#1976d2',
                                            },
                                        }}
                                        // Disable the button if the date is before the current date
                                        disabled={isDisabled}
                                        onClick={(e) => {
                                            if (matchingItem && matchingItem?.adjstatus === 'Approved') {
                                                // Handle the case when the status is 'Approved'
                                            } else if (matchingItem && matchingItem?.adjstatus === '') {
                                                // Handle the case when the status is ''
                                            } else {
                                                // getCode(column, params.data, params.data.days[index].shiftlabel);
                                                getCode(column, params.data, dayData?.shiftlabel, params.data.adjstatus);
                                            }
                                        }}
                                    >
                                        {/* {params.data.days[index].adjstatus} */}
                                        {dayData?.adjstatus}
                                    </Button>
                                    <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                        {/* {params.data.days[index].shiftlabel} */}
                                        {dayData?.shiftlabel}
                                    </Typography>
                                </Box>
                            </Grid >
                        );
                    }
                },
            }
        }),
    ];

    // Datatable
    const handleSearchChangeMyFinalAdj = (e) => {
        const value = e.target.value;
        setSearchQueryMyFinalAdj(value);
        applyNormalFilterMyFinalAdj(value);
        setFilteredRowData([]);
    };

    const applyNormalFilterMyFinalAdj = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = allUsers?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItemsMyFinalAdj(filtered);
        setPageMyFinalAdj(1);
    };

    const applyAdvancedFilterMyFinalAdj = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = allUsers?.filter((item) => {
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

        setFilteredDataItemsMyFinalAdj(filtered); // Update filtered data
        setAdvancedFilterMyFinalAdj(filters);
        // handleCloseSearchMyFinalAdj(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearchMyFinalAdj = () => {
        setAdvancedFilterMyFinalAdj(null);
        setSearchQueryMyFinalAdj("");
        setFilteredDataItemsMyFinalAdj(allUsers);
    };

    // Show filtered combination in the search bar
    const getSearchDisplayMyFinalAdj = () => {
        if (advancedFilterMyFinalAdj && advancedFilterMyFinalAdj.length > 0) {
            return advancedFilterMyFinalAdj.map((filter, index) => {
                let showname = columnDataTableMyFinalAdj.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilterMyFinalAdj.length > 1 ? advancedFilterMyFinalAdj[1].condition : '') + ' ');
        }
        return searchQueryMyFinalAdj;
    };

    const handlePageChangeMyFinalAdj = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesMyFinalAdj) {
            setPageMyFinalAdj(newPage);
            gridRefTableMyFinalAdj.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChangeMyFinalAdj = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeMyFinalAdj(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumnsMyFinalAdj = () => {
        const updatedVisibility = { ...columnVisibilityMyFinalAdj };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityMyFinalAdj(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityMyFinalAdj");
        if (savedVisibility) {
            setColumnVisibilityMyFinalAdj(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityMyFinalAdj", JSON.stringify(columnVisibilityMyFinalAdj));
    }, [columnVisibilityMyFinalAdj]);

    // // Function to filter columns based on search query
    const filteredColumnsMyFinalAdj = columnDataTableMyFinalAdj.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageMyFinalAdj.toLowerCase()));

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Manage Columns functionality
    const toggleColumnVisibilityMyFinalAdj = (field) => {
        if (!gridApi) return;

        setColumnVisibilityMyFinalAdj((prevVisibility) => {
            const newVisibility = !prevVisibility[field];

            // Update the visibility in the grid
            gridApi.setColumnVisible(field, newVisibility);

            return {
                ...prevVisibility,
                [field]: newVisibility,
            };
        });
    };

    const handleColumnMovedMyFinalAdj = useCallback(debounce((event) => {
        if (!event.columnApi) return;

        const visible_columns = event.columnApi.getAllColumns().filter(col => {
            const colState = event.columnApi.getColumnState().find(state => state.colId === col.colId);
            return colState && !colState.hide;
        }).map(col => col.colId);

        setColumnVisibilityMyFinalAdj((prevVisibility) => {
            const updatedVisibility = { ...prevVisibility };

            // Ensure columns that are visible stay visible
            Object.keys(updatedVisibility).forEach(colId => {
                updatedVisibility[colId] = visible_columns.includes(colId);
            });

            return updatedVisibility;
        });
    }, 300), []);

    const handleColumnVisibleMyFinalAdj = useCallback((event) => {
        const colId = event.column.getColId();

        // Update visibility based on event, but only when explicitly triggered by grid
        setColumnVisibilityMyFinalAdj((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Pagination for innter filter
    const getVisiblePageNumbersMyFinalAdj = () => {
        const pageNumbers = [];
        const maxVisiblePages = 3;

        const startPage = Math.max(1, pageMyFinalAdj - 1);
        const endPage = Math.min(totalPagesMyFinalAdj, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageMyFinalAdj numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageMyFinalAdj, show ellipsis
        if (endPage < totalPagesMyFinalAdj) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredDataMyFinalAdj = filteredDataItemsMyFinalAdj?.slice((pageMyFinalAdj - 1) * pageSizeMyFinalAdj, pageMyFinalAdj * pageSizeMyFinalAdj);
    const totalPagesMyFinalAdjOuter = Math.ceil(filteredDataItemsMyFinalAdj?.length / pageSizeMyFinalAdj);
    const visiblePages = Math.min(totalPagesMyFinalAdjOuter, 3);
    const firstVisiblePage = Math.max(1, pageMyFinalAdj - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesMyFinalAdjOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageMyFinalAdj * pageSizeMyFinalAdj;
    const indexOfFirstItem = indexOfLastItem - pageSizeMyFinalAdj;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    // Excel Set Table
    const fileNameMyAdj = "Shift Status List";
    const [fileFormatMyAdj, setFormatMyAdj] = useState('')
    const fileTypeMyAdj = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionMyAdj = fileFormatMyAdj === "xl" ? '.xlsx' : '.csv';
    const exportToCSVMyAdj = (csvData, fileNameMyAdj) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypeMyAdj });
        FileSaver.saveAs(data, fileNameMyAdj + fileExtensionMyAdj);
    }

    const handleExportXLMyAdj = (isfilter) => {
        // Define the table headers
        const headers = [
            'SNo',
            'Emp Code',
            'Name',
            'Department',
            'Branch',
            'Unit',
            ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day${column.dayCount}`),
        ];

        let data = [];
        let resultdataMyFinalAdj = (filteredRowDataMyFinalAdj.length > 0 ? filteredRowDataMyFinalAdj : filteredDataMyFinalAdj)
        // Helper function to handle shiftlabel if it's a React element
        const getShiftLabel = (shiftlabel) => {
            if (typeof shiftlabel === 'object' && shiftlabel.$$typeof) {
                // Handle React element - convert props.children to string, skipping React elements like <br />
                return shiftlabel.props.children
                    .map(child => {
                        // If it's a string, return it; ignore React elements like <br />
                        if (typeof child === 'string') {
                            return child;
                        }
                        return ''; // Return empty for elements like <br />
                    })
                    .join(' '); // Join the valid string parts
            }
            return shiftlabel || ''; // If it's a simple string, return it
        };

        if (isfilter === "filtered") {
            data = resultdataMyFinalAdj.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.username,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${getShiftLabel(column.shiftlabel)}`
                    }),
                ];
            });
        } else if (isfilter === "overall") {
            data = allUsers.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.companyname,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${getShiftLabel(column.shiftlabel)}`
                    }),
                ];
            });
        }

        // Add headers to the data array
        const formattedData = data.map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        // Export to CSV
        exportToCSVMyAdj(formattedData, fileNameMyAdj);
        setIsFilterOpenMyAdj(false);
    };

    // print...
    const componentRefSetTable = useRef();
    const handlePrintMyAdj = useReactToPrint({
        content: () => componentRefSetTable.current,
        documentTitle: "Shift Status List",
        pageStyle: "print",
    });

    const downloadPdfMyAdj = (isfilter) => {
        const doc = new jsPDF({ orientation: 'landscape' });

        // Define the table headers
        const headers = [
            'SNo',
            'Emp Code',
            'Name',
            'Department',
            'Branch',
            'Unit',
            ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day${column.dayCount}`),
        ];

        let data = [];
        let resultdataMyFinalAdj = (filteredRowDataMyFinalAdj.length > 0 ? filteredRowDataMyFinalAdj : filteredDataMyFinalAdj)

        // Helper function to handle shiftlabel if it's a React element
        const getShiftLabel = (shiftlabel) => {
            if (typeof shiftlabel === 'object' && shiftlabel.$$typeof) {
                // Handle React element - convert props.children to string, skipping React elements like <br />
                return shiftlabel.props.children
                    .map(child => {
                        // If it's a string, return it; ignore React elements like <br />
                        if (typeof child === 'string') {
                            return child;
                        }
                        return ''; // Return empty for elements like <br />
                    })
                    .join(' '); // Join the valid string parts
            }
            return shiftlabel || ''; // If it's a simple string, return it
        };

        if (isfilter === "filtered") {
            data = resultdataMyFinalAdj.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.username,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${getShiftLabel(column.shiftlabel)}`
                    }),
                ];
            });
        } else {
            data = allUsers.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.companyname,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${getShiftLabel(column.shiftlabel)}`
                    }),
                ];
            });
        }

        // Split data into chunks to fit on pages
        const columnsPerSheet = 10; // Number of columns per sheet
        const chunks = [];

        for (let i = 0; i < headers.length; i += columnsPerSheet) {
            const chunkHeaders = headers.slice(i, i + columnsPerSheet);
            const chunkData = data.map(row => row.slice(i, i + columnsPerSheet + 1));

            chunks.push({ headers: chunkHeaders, data: chunkData });
        }

        chunks.forEach((chunk, index) => {
            if (index > 0) {
                doc.addPage({ orientation: "landscape" }); // Add a new landscape page for each chunk, except the first one
            }

            doc.autoTable({
                theme: "grid",
                styles: { fontSize: 8 },
                head: [chunk.headers],
                body: chunk.data,
                startY: 20, // Adjust startY to leave space for headers
                margin: { top: 20, left: 10, right: 10, bottom: 10 }, // Adjust margin as needed
            });
        });

        doc.save("Shift Status List.pdf");
    };

    // image
    const handleCaptureImageMyFinalAdj = () => {
        if (gridRefImageMyFinalAdj.current) {
            domtoimage.toBlob(gridRefImageMyFinalAdj.current)
                .then((blob) => {
                    saveAs(blob, "Shift Status List.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    return (
        <Box>
            <Headtitle title={"MY SHIFT ROASTER"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Shift Status List"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Shift Details"
                subpagename="My Shift Roaster"
                subsubpagename=""
            />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lmyshiftroaster") && (
                <>
                    <Box sx={userStyle.container}>
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}> Shift Status List </Typography>
                        </Grid>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select size="small"
                                        id="pageSizeSelect"
                                        value={pageSizeMyFinalAdj}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeMyFinalAdj}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={allUsers?.length}>All</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelmyshiftroaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenMyAdj(true)
                                                setFormatMyAdj("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmyshiftroaster") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpenMyAdj(true)
                                                setFormatMyAdj("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmyshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handlePrintMyAdj}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfmyshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenMyAdj(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagemyshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageMyFinalAdj}>
                                                {" "} <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
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
                                                {advancedFilterMyFinalAdj && (
                                                    <IconButton onClick={handleResetSearchMyFinalAdj}>
                                                        <MdClose />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Show search options">
                                                    <span>
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchMyFinalAdj} />
                                                    </span>
                                                </Tooltip>
                                            </InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{ 'aria-label': 'weight', }}
                                        type="text"
                                        value={getSearchDisplayMyFinalAdj()}
                                        onChange={handleSearchChangeMyFinalAdj}
                                        placeholder="Type to search..."
                                        disabled={!!advancedFilterMyFinalAdj}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsMyFinalAdj}>  Show All Columns </Button>&ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsMyFinalAdj}> Manage Columns  </Button><br /><br />
                        {allShiftAdj ?
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageMyFinalAdj} >
                                    <AgGridReact
                                        rowData={filteredDataItemsMyFinalAdj}
                                        columnDefs={columnDataTableMyFinalAdj.filter((column) => columnVisibilityMyFinalAdj[column.field])}
                                        ref={gridRefTableMyFinalAdj}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        getRowHeight={getRowHeight}
                                        pagination={true}
                                        paginationPageSize={pageSizeMyFinalAdj}
                                        onPaginationChanged={onPaginationChangedMyFinalAdj}
                                        onGridReady={onGridReadyMyFinalAdj}
                                        onColumnMoved={handleColumnMovedMyFinalAdj}
                                        onColumnVisible={handleColumnVisibleMyFinalAdj}
                                        onFilterChanged={onFilterChangedMyFinalAdj}
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
                                                (filteredDataItemsMyFinalAdj.length > 0 ? (pageMyFinalAdj - 1) * pageSizeMyFinalAdj + 1 : 0)
                                            ) : (
                                                filteredRowDataMyFinalAdj.length > 0 ? (pageMyFinalAdj - 1) * pageSizeMyFinalAdj + 1 : 0
                                            )
                                        }{" "}to{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                Math.min(pageMyFinalAdj * pageSizeMyFinalAdj, filteredDataItemsMyFinalAdj.length)
                                            ) : (
                                                filteredRowDataMyFinalAdj.length > 0 ? Math.min(pageMyFinalAdj * pageSizeMyFinalAdj, filteredRowDataMyFinalAdj.length) : 0
                                            )
                                        }{" "}of{" "}
                                        {
                                            gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                filteredDataItemsMyFinalAdj.length
                                            ) : (
                                                filteredRowDataMyFinalAdj.length
                                            )
                                        } entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChangeMyFinalAdj(1)} disabled={pageMyFinalAdj === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                        <Button onClick={() => handlePageChangeMyFinalAdj(pageMyFinalAdj - 1)} disabled={pageMyFinalAdj === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
                                        {getVisiblePageNumbersMyFinalAdj().map((pageNumber, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => pageNumber !== "..." && handlePageChangeMyFinalAdj(pageNumber)}
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
                                                className={pageMyFinalAdj === pageNumber ? "active" : ""}
                                                disabled={pageMyFinalAdj === pageNumber}
                                            >
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChangeMyFinalAdj(pageMyFinalAdj + 1)} disabled={pageMyFinalAdj === totalPagesMyFinalAdj} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                        <Button onClick={() => handlePageChangeMyFinalAdj(totalPagesMyFinalAdj)} disabled={pageMyFinalAdj === totalPagesMyFinalAdj} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                    </Box>
                                </Box> */}
                            </>
                        }
                    </Box>
                </>
            )}<br />

            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpenMyFinalAdj}
                anchorElMyFinalAdj={anchorElMyFinalAdj}
                onClose={handleCloseManageColumnsMyFinalAdj}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsMyFinalAdj}
                    searchQuery={searchQueryManageMyFinalAdj}
                    setSearchQuery={setSearchQueryManageMyFinalAdj}
                    filteredColumns={filteredColumnsMyFinalAdj}
                    columnVisibility={columnVisibilityMyFinalAdj}
                    toggleColumnVisibility={toggleColumnVisibilityMyFinalAdj}
                    setColumnVisibility={setColumnVisibilityMyFinalAdj}
                    initialColumnVisibility={initialColumnVisibilityMyFinalAdj}
                    columnDataTable={columnDataTableMyFinalAdj}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchMyFinalAdj}
                open={openSearchMyFinalAdj}
                anchorEl={anchorElSearchMyFinalAdj}
                onClose={handleCloseSearchMyFinalAdj}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableMyFinalAdj.filter(data => !daysArray.some(column => data.field === `${column.formattedDate} ${column.dayName} Day${column.dayCount}`))} onSearch={applyAdvancedFilterMyFinalAdj} initialSearchValue={searchQueryMyFinalAdj} handleCloseSearch={handleCloseSearchMyFinalAdj} />
            </Popover>

            <Box>
                <MyShiftAdjustmentListTable allUsersAdjTable={allUsersAdjTable} adjApply={adjApply} filteredDataItemsMyAdjList={filteredDataItemsMyAdjList} setFilteredDataItemsMyAdjList={setFilteredDataItemsMyAdjList} />
            </Box>

            <Box>
                <MyShiftRoasterList allUsersShiftFinal={allUsersShiftFinal} allMyFinalAdj={allMyFinalAdj} daysArray={daysArray} allUserDates={allUserDates} overAllDepartment={overAllDepartment} />
            </Box>

            {/* Print layout for Set Table */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRefSetTable} id="usershiftlistpdf">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>SNo</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Emp Code</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Name</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Department</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Branch</TableCell>
                            <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>Unit</TableCell>
                            {daysArray.map((column, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableCell>
                                            <Box sx={userStyle.tableheadstyle}>
                                                {column.formattedDate}<br />
                                                {column.dayName}<br />
                                                {`Day${column.dayCount}`}
                                            </Box>
                                        </TableCell>
                                    </React.Fragment>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {(filteredRowDataMyFinalAdj.length > 0 ? filteredRowDataMyFinalAdj : filteredDataMyFinalAdj) &&
                            (filteredRowDataMyFinalAdj.length > 0 ? filteredRowDataMyFinalAdj : filteredDataMyFinalAdj).map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.serialNumber}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.empcode}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.username}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.department}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.branch}</TableCell>
                                    <TableCell sx={{ fontSize: '14px' }}>{row.unit}</TableCell>
                                    {row.days && (
                                        row.days.map((column, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontSize: '8px' }}>{column.depstatus === undefined ? '' : column.depstatus}</Typography><br />
                                                        <Typography variant="body2" sx={{ fontSize: '8px' }}>{column.adjstatus === undefined ? '' : column.adjstatus}</Typography><br />
                                                        <Typography variant="body2" sx={{ fontSize: '8px' }}>{column.shiftlabel === undefined ? '' : column.shiftlabel}</Typography>
                                                    </TableCell>
                                                </React.Fragment>

                                            );
                                        })
                                    )}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isFilterOpenMyAdj} onClose={handleCloseFilterModMyAdj} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModMyAdj}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormatMyAdj === 'xl' ?
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
                            handleExportXLMyAdj("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLMyAdj("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpenMyAdj} onClose={handleClosePdfFilterModMyAdj} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModMyAdj}
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
                            downloadPdfMyAdj("filtered")
                            setIsPdfFilterOpenMyAdj(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfMyAdj("overall")
                            setIsPdfFilterOpenMyAdj(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>

            {/* view model */}
            <Dialog open={openEdit} onClose={handleClickOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" sx={{ marginTop: '95px' }}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Shift Adjustment</Typography>
                        <Grid container spacing={1}>
                            {/* <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={shiftRoasterUserEdit.username} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Emp Code</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={shiftRoasterUserEdit.empcode} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Alloted Shift Mode</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={shiftRoasterUserEdit.adjfirstshiftmode} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Alloted Shift Shows</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={shiftRoasterUserEdit.adjfirstshifttime} />
                                </FormControl>
                            </Grid> */}
                            <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Adjustment Type</Typography>
                                <FormControl fullWidth size="small">
                                    <Selects
                                        size="small"
                                        options={shiftRoasterUserEdit.removedstatus === true ? adjstypeoptionsfornotallotted : shiftRoasterUserEdit.selectedColumnShiftMode === 'First Shift' ? adjtypeoptions : adjtypeoptionsifweekoff}
                                        // options={adjtypeoptions}
                                        styles={colourStyles}
                                        value={{ label: shiftRoasterUserEdit.adjustmenttype, value: shiftRoasterUserEdit.adjustmenttype }}
                                        onChange={(e) => {
                                            setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjustmenttype: e.value, adjshiftgrptype: 'Choose Day/Night', adjchangeshift: 'Choose Shift', adjweekdate: 'Choose Date', adjweekoffdate: 'Choose Date', secondmode: 'Choose 2nd Shiftmode', pluseshift: '' })
                                            // setGetChangeShiftTypeTime('');
                                            // setGetAdjShiftTypeTime('');
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12} xs={12} sm={12} >
                                {shiftRoasterUserEdit.adjustmenttype == "Add On Shift" ? (
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.username} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnDate} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>First Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnShiftTime} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}> </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>2nd Shiftmode<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={secondModeOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.secondmode, value: shiftRoasterUserEdit.secondmode }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, secondmode: e.value, adjshiftgrptype: 'Choose Day/Night', adjchangeshift: 'Choose Shift', });
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift (Day/Night)<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shiftDayOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjshiftgrptype, value: shiftRoasterUserEdit.adjshiftgrptype }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjshiftgrptype: e.value, adjchangeshift: 'Choose Shift', });
                                                        fetchShiftFromShiftGroup(e.value);
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shifts}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjchangeshift, value: shiftRoasterUserEdit.adjchangeshift }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjchangeshift: e.value }); getShiftTime(e.value);

                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Pluse Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode' ? "" : getChangeShiftTypeTime} />
                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                ) : null}

                                {shiftRoasterUserEdit.adjustmenttype == "Change Shift" || shiftRoasterUserEdit.adjustmenttype == "Assign Shift" ? (
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.username} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnDate} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>First Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={(shiftRoasterUserEdit.selectedColumnShiftTime == '' && shiftRoasterUserEdit.removedstatus === false) ? 'Week Off' : shiftRoasterUserEdit.selectedColumnShiftTime} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} ></Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift (Day/Night)<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shiftDayOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjshiftgrptype, value: shiftRoasterUserEdit.adjshiftgrptype }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjshiftgrptype: e.value, adjchangeshift: 'Choose Shift', secondmode: 'Choose 2nd Shiftmode' });
                                                        fetchShiftFromShiftGroup(e.value);
                                                        setGetChangeShiftTypeTime('')
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shifts}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjchangeshift, value: shiftRoasterUserEdit.adjchangeshift }}
                                                    onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjchangeshift: e.value }); getShiftTime(e.value); }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Change Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={getChangeShiftTypeTime} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                ) : null}

                                {shiftRoasterUserEdit.adjustmenttype == "Shift Weekoff Swap" ? (
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.username} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>From Date<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnDate} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>First Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnShiftTime} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} > </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Week off Date<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={getDateOptions(shiftRoasterUserEdit.selectedColumnDate, shiftRoasterUserEdit.userid)}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjweekdate, value: shiftRoasterUserEdit.adjweekdate }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjweekdate: e.value, secondmode: 'Choose 2nd Shiftmode', adjshiftgrptype: 'Choose Day/Night', adjchangeshift: 'Choose Shift', });
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>2nd Shiftmode<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={secondModeOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.secondmode, value: shiftRoasterUserEdit.secondmode }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, secondmode: e.value, adjshiftgrptype: 'Choose Day/Night', adjchangeshift: 'Choose Shift', });
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift (Day/Night)<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shiftDayOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjshiftgrptype, value: shiftRoasterUserEdit.adjshiftgrptype }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjshiftgrptype: e.value, adjchangeshift: 'Choose Shift', });
                                                        fetchShiftFromShiftGroup(e.value);
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shifts}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjchangeshift, value: shiftRoasterUserEdit.adjchangeshift }}
                                                    onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjchangeshift: e.value }); getShiftTime(e.value); }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Pluse Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode' ? "" : getChangeShiftTypeTime} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                ) : null}

                                {shiftRoasterUserEdit.adjustmenttype == "WeekOff Adjustment" ? (
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.username} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>From Date<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnDate} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>First Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnShiftTime == '' ? 'Week Off' : shiftRoasterUserEdit.selectedColumnShiftTime} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} ></Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>WeekOff Days<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={getWeekOffDateOptions(shiftRoasterUserEdit.selectedColumnDate, shiftRoasterUserEdit.userid)}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjweekoffdate, value: shiftRoasterUserEdit.adjweekoffdate }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjweekoffdate: e.value, adjshiftgrptype: 'Choose Day/Night', adjchangeshift: 'Choose Shift', });
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift (Day/Night)<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shiftDayOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjshiftgrptype, value: shiftRoasterUserEdit.adjshiftgrptype }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjshiftgrptype: e.value, adjchangeshift: 'Choose Shift', });
                                                        fetchShiftFromShiftGroup(e.value);
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shifts}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjchangeshift, value: shiftRoasterUserEdit.adjchangeshift }}
                                                    onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjchangeshift: e.value }); getShiftTime(e.value); }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Change Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.adjchangeshift === 'Choose Shift' ? shiftRoasterUserEdit.selectedColumnShiftTime : getChangeShiftTypeTime} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                ) : null}

                                {shiftRoasterUserEdit.adjustmenttype == 'Shift Adjustment' ? (
                                    <Grid container spacing={2}>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.username} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>From Date<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnDate} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>From Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnShiftTime} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} > </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>To Date<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={getDateOptions(shiftRoasterUserEdit.selectedColumnDate, shiftRoasterUserEdit.userid)}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjweekdate, value: shiftRoasterUserEdit.adjweekdate }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjweekdate: e.value, secondmode: 'Choose 2nd Shiftmode', adjshiftgrptype: 'Choose Day/Night', adjchangeshift: 'Choose Shift', });
                                                        getSelectedDateShift(e.value, shiftRoasterUserEdit.empcode);
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>First Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={selectedDateShift} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={12} sm={12} > </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>2nd Shiftmode<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={secondModeOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.secondmode, value: shiftRoasterUserEdit.secondmode }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, secondmode: e.value, adjshiftgrptype: 'Choose Day/Night', adjchangeshift: 'Choose Shift', });
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} xs={12} sm={12} >
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift (Day/Night)<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shiftDayOptions}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjshiftgrptype, value: shiftRoasterUserEdit.adjshiftgrptype }}
                                                    onChange={(e) => {
                                                        setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjshiftgrptype: e.value, adjchangeshift: 'Choose Shift', });
                                                        fetchShiftFromShiftGroup(e.value);
                                                        setGetChangeShiftTypeTime('');
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <Selects
                                                    size="small"
                                                    options={shifts}
                                                    styles={colourStyles}
                                                    value={{ label: shiftRoasterUserEdit.adjchangeshift, value: shiftRoasterUserEdit.adjchangeshift }}
                                                    onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjchangeshift: e.value }); getShiftTime(e.value); }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={3} sm={12} xs={12}>
                                            <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Pluse Shift<b style={{ color: "red" }}>*</b></Typography>
                                            <FormControl fullWidth size="small">
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode' ? "" : getChangeShiftTypeTime} />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                ) : null}
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <FormControl fullWidth>
                                    <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Reason</Typography>
                                    <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={5}
                                        value={shiftRoasterUserEdit?.adjchangereason}
                                        onChange={(e) => { setShiftRoasterUserEdit({ ...shiftRoasterUserEdit, adjchangereason: e.target.value, }) }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2}>
                                <Button variant="contained" color="primary" onClick={handleSubmit}> {" "} Update{" "}  </Button>
                            </Grid>
                            <Grid item md={2}>
                                <Button sx={userStyle.btncancel} onClick={handleCloseEdit}> {" "} Cancel{" "} </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog >

            <MessageAlert
                openPopup={openPopupMalert}
                handleClosePopup={handleClosePopupMalert}
                popupContent={popupContentMalert}
                popupSeverity={popupSeverityMalert}
            />

            {/* ALERT DIALOG */}
            < Box >
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
            </Box >
        </Box >
    );
}

export default MyShiftAdjustmentList;