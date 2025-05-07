import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Box, Typography, OutlinedInput, Dialog, Select, MenuItem, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableRow, TableHead, TableBody, TableCell, TableContainer, Button, Popover, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from "react-icons/fa";
import { SERVICE } from '../../../services/Baseservice';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Selects from "react-select";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { saveAs } from "file-saver";
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { MultiSelect } from "react-multi-select-component";
import LoadingButton from "@mui/lab/LoadingButton";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { IoMdOptions } from "react-icons/io";
import { MdClose } from "react-icons/md";
import domtoimage from 'dom-to-image';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import AdvancedSearchBar from '../../../components/SearchbarEbList.js';
import ManageColumnsContent from "../../../components/ManageColumn";
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

function UserShiftWeekOffPresent() {

    const gridRefTableUserShift = useRef(null);
    const gridRefImageUserShift = useRef(null);

    const { auth } = useContext(AuthContext);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, allUsersData, allCompany, allBranch, allUnit, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const [userShifts, setUserShifts] = useState([]);
    const [loader, setLoader] = useState(false);
    const [isBtn, setIsBtn] = useState(false);
    const [statusEdit, setStatusEdit] = useState({});
    const [isHeadings, setIsHeadings] = useState([]);
    const [getUserId, setGetUserId] = useState("");
    const [getUserIdNextWeek, setGetUserIdNextWeek] = useState("");
    const [getUserDate, setGetUserDate] = useState("");
    const [getUserDateNextWeek, setGetUserDateNextWeek] = useState("");
    const [getEmpUserId, setGetEmpUserId] = useState("");
    const [getUserName, setGetUserName] = useState("");
    const [disabledButton, setDisabledButton] = useState(null);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [teamOptions, setTeamOptions] = useState([]);
    const [empOptions, setEmpOptions] = useState([]);
    const [shiftstatusDrop, setShiftstatusDrop] = useState([]);
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
    const [shiftCalDay, setShiftCalDay] = useState('');
    const [filterUser, setFilterUser] = useState({
        company: "Please Select Company", branch: "Please Select Branch", unit: "Please Select Unit", department: "Please Select Department",
        fromdate: "", todate: "dd-mm-yyyy", shiftstatus: "Please Select ShiftStatus", weekofflists: 'Please Select Data', startday: 'Please Select Start Day', shiftstartday: 'Please Select Shift Start Day'
    });

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState(userShifts);
    const [filteredRowData, setFilteredRowData] = useState([]);

    // Datatable
    const [pageUserShiftWk, setPageUserShiftWk] = useState(1);
    const [pageSizeUserShiftWk, setPageSizeUserShiftWk] = useState(10);
    const [searchQueryUserShiftWk, setSearchQueryUserShiftWk] = useState("");
    const [totalPagesUserShiftWk, setTotalPagesUserShiftWk] = useState(1);

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsBtn(false);
    };

    // Edit model
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEdit = () => { setOpenEdit(true); };
    const handleCloseEdit = () => {
        setOpenEdit(false);
        setStatusEdit({ weekoffpresentstatus: "" });
        setDisabledButton(null);
    }

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
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

    // Manage Columns
    const [searchQueryManageUserShiftWk, setSearchQueryManageUserShiftWk] = useState("");
    const [isManageColumnsOpenUserShiftWk, setManageColumnsOpenUserShiftWk] = useState(false);
    const [anchorElUserShiftWk, setAnchorElUserShiftWk] = useState(null)

    const handleOpenManageColumnsUserShiftWk = (event) => {
        setAnchorElUserShiftWk(event.currentTarget);
        setManageColumnsOpenUserShiftWk(true);
    };
    const handleCloseManageColumnsUserShiftWk = () => {
        setManageColumnsOpenUserShiftWk(false);
        setSearchQueryManageUserShiftWk("")
    };

    const openUserShiftWk = Boolean(anchorElUserShiftWk);
    const idUserShiftWk = openUserShiftWk ? 'simple-popover' : undefined;

    // Search bar
    const [anchorElSearchUserShiftWk, setAnchorElSearchUserShiftWk] = React.useState(null);
    const handleClickSearchUserShiftWk = (event) => {
        setAnchorElSearchUserShiftWk(event.currentTarget);
    };
    const handleCloseSearchUserShiftWk = () => {
        setAnchorElSearchUserShiftWk(null);
        setSearchQueryUserShiftWk("");
    };

    const openSearchUserShiftWk = Boolean(anchorElSearchUserShiftWk);
    const idSearchUserShiftWk = openSearchUserShiftWk ? 'simple-popover' : undefined;

    const shiftstartDrop = [
        { label: 'Sunday', value: "Sunday" },
        { label: "Monday", value: "Monday" },
        { label: "Tuesday", value: "Tuesday" },
        { label: "Wednesday", value: "Wednesday" },
        { label: "Thursday", value: "Thursday" },
        { label: "Friday", value: "Friday" },
        { label: "Saturday", value: "Saturday" },
    ];

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

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
            pagename: String("User Shift Weekoff Present"),
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

    // const shiftstatusDrop = [
    //     { label: 'Day Shift', value: "Day Shift" },
    //     { label: "Night Shift", value: "Night Shift" },
    // ];

    const adjtypeoptions = [
        { label: "Approved", value: "Approved" },
    ];

    //company multiselect  
    const handleCompanyChange = (options) => {
        setValueCompany(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchBranch(options);
        setSelectedCompany(options);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit([]);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
        setUnitOptions([]);
        setTeamOptions([]);
        setEmpOptions([]);
    };

    const customValueRendererCompany = (valueCompany, _categoryname) => {
        return valueCompany?.length
            ? valueCompany.map(({ label }) => label)?.join(", ")
            : "Please Select Company";
    };

    //branch multiselect  
    const handleBranchChange = (options) => {
        setValueBranch(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchUnit(options);
        setSelectedBranch(options);
        setSelectedUnit([]);
        setValueUnit([]);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
        setTeamOptions([]);
        setEmpOptions([]);
    };

    const customValueRendererBranch = (valueBranch, _categoryname) => {
        return valueBranch?.length
            ? valueBranch.map(({ label }) => label)?.join(", ")
            : "Please Select Branch";
    };

    //unit multiselect
    const handleUnitChange = (options) => {
        setValueUnit(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchTeam(options);
        setSelectedUnit(options);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
    };

    const customValueRendererUnit = (valueUnit, _categoryname) => {
        return valueUnit?.length
            ? valueUnit.map(({ label }) => label)?.join(", ")
            : "Please Select Unit";
    };

    //team multiselect
    const handleTeamChange = (options) => {
        setValueTeam(
            options.map((a, index) => {
                return a.value;
            })
        );
        fetchEmployee(options);
        setSelectedTeam(options);
        setValueEmp([]);
        setSelectedEmp([]);
    };

    const customValueRendererTeam = (valueTeam, _categoryname) => {
        return valueTeam?.length
            ? valueTeam.map(({ label }) => label)?.join(", ")
            : "Please Select Team";
    };

    const handleEmployeeChange = (options) => {
        setValueEmp(options.map(option => option.value))
        setSelectedEmp(options);
    };

    const customValueRendererEmp = (valueEmp, _employees) => {
        return valueEmp.length
            ? valueEmp.map(({ label }) => label).join(", ")
            : "Please Select Employee";
    };

    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // const getNextShiftStartDate = (shiftDay) => {
    //     if (!shiftDay) return "";

    //     const today = new Date();
    //     let dayIndex = weekDays.indexOf(shiftDay); // Get index of shift day (e.g., Friday → 5)
    //     if (dayIndex === -1) return "";

    //     let currentDayIndex = today.getDay(); // Get today's index (e.g., Monday → 1)
    //     let diff = (dayIndex - currentDayIndex + 7) % 7; // Difference to next selected weekday

    //     // If the selected day is today, return today; otherwise, return the next occurrence
    //     let nextDate = new Date();
    //     nextDate.setDate(today.getDate() + diff);

    //     return moment(nextDate).format("YYYY-MM-DD");
    // };

    // const getNextShiftStartDate = (shiftDay) => {
    //     if (!shiftDay) return "";

    //     const dayIndex = weekDays.indexOf(shiftDay);
    //     if (dayIndex === -1) return "";

    //     let dates = [];
    //     let start = new Date("1900-01-01"); // Start from the earliest possible date
    //     let end = new Date("2100-12-31"); // Set an upper limit

    //     while (start <= end) {
    //         if (start.getDay() === dayIndex) {
    //             dates.push(moment(start).format("YYYY-MM-DD"));
    //         }
    //         start.setDate(start.getDate() + 1); // Move to the next day
    //     }
    //     return dates;
    // };

    const getNextShiftStartDate = (shiftDay) => {
        if (!shiftDay) return "";

        const today = new Date();
        const dayIndex = weekDays.indexOf(shiftDay);

        if (dayIndex === -1) return "";

        let start = new Date(today);

        // Move backwards to the most recent valid weekday
        while (start.getDay() !== dayIndex) {
            start.setDate(start.getDate() - 1);
        }

        return moment(start).format("YYYY-MM-DD");
    };


    // Function to calculate To Date based on setShiftCalDay
    const calculateToDate = (fromDate, shiftDays) => {
        return moment(fromDate).add(shiftDays - 1, "days").format("YYYY-MM-DD");
    };

    // Handle Shift Start Day Change
    const handleShiftStartChange = (e) => {
        const newShiftStartDay = e.value;
        const nextAvailableDate = getNextShiftStartDate(newShiftStartDay);
        const toDate = calculateToDate(nextAvailableDate, Number(shiftCalDay));

        setFilterUser({
            ...filterUser,
            shiftstartday: newShiftStartDay,
            fromdate: nextAvailableDate,
            todate: toDate,
        });
    };

    // // Handle From Date Change (Manual Change)
    // const handleFromDateChange = (e) => {
    //     const selectedDate = e.target.value;
    //     const toDate = calculateToDate(selectedDate, Number(shiftCalDay));
    //     setFilterUser({
    //         ...filterUser,
    //         fromdate: selectedDate,
    //         todate: toDate,
    //     });
    // };

    // Handle From Date selection and validate allowed days
    const handleFromDateChange = (e) => {
        const selectedDate = e.target.value;
        const selectedDay = new Date(selectedDate).getDay();
        const requiredDay = weekDays.indexOf(filterUser.shiftstartday); // Get required weekday index

        if (selectedDay !== requiredDay) {
            alert(`Please select a valid ${filterUser.shiftstartday}.`);
            return;
        }

        const toDate = calculateToDate(selectedDate, Number(shiftCalDay));

        setFilterUser({
            ...filterUser,
            fromdate: selectedDate,
            todate: toDate
        });
    };

    const [weekOffPresentData, setWeekOffPresentData] = useState([]);
    const fetchBranch = (selectedCompany) => {
        try {
            const result = weekOffPresentData?.find(data => data.shiftstartday === filterUser.startday);

            if (result.filtertype === 'Company') {
                const branch = allBranch
                    .filter(val => selectedCompany.some(comp => comp.value === val.company))
                    .map(data => ({
                        label: data.name,
                        value: data.name,
                    }));
                setBranchOptions(branch);
            }
            else {
                const branch = weekOffPresentData
                    .filter(val => selectedCompany.some(comp => comp.value === val.company))
                    .flatMap(data => data.branch);
                const branchname = branch.map(data => ({
                    label: data,
                    value: data,
                }));
                setBranchOptions(branchname);
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const fetchUnit = (selectedBranch) => {
        try {
            const result = weekOffPresentData?.find(data => data.shiftstartday === filterUser.startday);

            if (result.filtertype === 'Company' || result.filtertype === 'Branch') {
                const unit = allUnit
                    .filter(val => selectedBranch.some(comp => comp.value === val.branch))
                    .map(data => ({
                        label: data.name,
                        value: data.name,
                    }));
                setUnitOptions(unit);
            }
            else {
                const unit = weekOffPresentData
                    .filter(val => selectedBranch.some(comp => val.branch?.includes(comp.value)))
                    .flatMap(data => data.unit);
                const unitname = unit.map(data => ({
                    label: data,
                    value: data,
                }));
                setUnitOptions(unitname);
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const fetchTeam = (selectedUnit) => {
        try {
            const result = weekOffPresentData?.find(data => data.shiftstartday === filterUser.startday);

            if (result.filtertype === 'Company' || result.filtertype === 'Branch' || result.filtertype === 'Unit') {
                const team = allTeam
                    .filter(val => selectedUnit.some(comp => comp.value === val.unit))
                    .map(data => ({
                        label: data.teamname,
                        value: data.teamname,
                    }))
                setTeamOptions(team);
            }
            else {
                const team = weekOffPresentData
                    .filter(val => selectedUnit.some(comp => val.unit?.includes(comp.value)))
                    .flatMap(data => data.team);
                const teamname = team.map(data => ({
                    label: data,
                    value: data,
                }));
                setTeamOptions(teamname);
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const fetchEmployee = (selectedTeam) => {
        try {
            const result = weekOffPresentData?.find(data => data.shiftstartday === filterUser.startday);

            if (result.filtertype === 'Company' || result.filtertype === 'Branch' || result.filtertype === 'Unit' || result.filtertype === 'Team') {
                const employee = allUsersData
                    .filter(val => selectedTeam.some(comp => comp.value === val.team))
                    .map(data => ({
                        label: data.companyname,
                        value: data.companyname,
                    }));
                setEmpOptions(employee);
            }
            else {
                const allemployee = weekOffPresentData
                    .filter(val => selectedTeam.some(comp => val.team?.includes(comp.value)))
                    .flatMap(data => data.employee);
                const empname = allemployee.map(data => ({
                    label: data,
                    value: data,
                }));
                setEmpOptions(empname);
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const [weekofflistOptions, setWeekofflistOptions] = useState([]);
    const handleStartDayChange = async (value) => {
        setCompanyOptions([]);
        setBranchOptions([]);
        setUnitOptions([]);
        setTeamOptions([]);
        setEmpOptions([]);
        setValueCompany([]);
        setSelectedCompany([]);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit([]);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
        setShiftstatusDrop([]);
        setShiftCalDay("");
        setWeekofflistOptions([]);
        try {
            let res = await axios.post(SERVICE.WEEKOFFPRESENT_DAY_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                shiftstartday: value
            });

            if (res.data.weekoffpresents.length === 0) {
                setPopupContentMalert(`This day does not have any data matches. Kindly contact the administrator to confirm the 'Weekoff Setting'.`);
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                const alldata = res?.data?.weekoffpresents.map((data, index) => ({
                    id: data._id,
                    label: `#${index + 1}_${data.company}_${data.branch}_${data.weekoffpresentday}`,
                    value: `#${index + 1}_${data.company}_${data.branch}_${data.weekoffpresentday}`,
                }));
                setWeekofflistOptions(alldata);
            }
        }
        catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const handleStartDayChangeBasedOnId = async (value) => {
        setCompanyOptions([]);
        setBranchOptions([]);
        setUnitOptions([]);
        setTeamOptions([]);
        setEmpOptions([]);
        setValueCompany([]);
        setSelectedCompany([]);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit([]);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
        setShiftstatusDrop([]);
        setShiftCalDay("");
        try {

            let res = await axios.get(`${SERVICE.WEEKOFFPRESENT_SINGLE}/${value}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setWeekOffPresentData([res.data.sweekoffpresent]);

            const uniqueIsAssignBranch = [res.data.sweekoffpresent]?.reduce((acc, current) => {
                const x = acc.find(item => item.company === current.company);
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

            setCompanyOptions(company);

            const allshiftday = uniqueIsAssignBranch
                .map(data => ({
                    label: data.shiftstartday,
                    value: data.shiftstartday,
                }));
            setShiftstatusDrop(allshiftday);
            setShiftCalDay(res.data.sweekoffpresent.shiftdaytotal);
        }
        catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }
    const [getSelectedWeekoffDataId, setGetSelectedWeekoffDataId] = useState("");
    const fetchUsers = async () => {
        setPageName(!pageName)
        setLoader(true);
        setIsBtn(true);
        // console.log(getSelectedWeekoffDataId, 'getSelectedWeekoffDataId')
        try {
            let res_present = await axios.post(SERVICE.WEEKOFFPRESENT_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                employee: valueEmp,
                fromdate: filterUser.fromdate,
                todate: filterUser.todate,
                weekoffdataid: getSelectedWeekoffDataId,
            });

            const itemsWithSerialNumber = res_present.data.finalweekoffpresents?.map((item, index) => {
                const data = item.weekoffdaycount ? item.weekoffdaycount.find(data => data.empcode === item.empcode) : [];
                const datalength = data ? [data].length : 0;

                return {
                    ...item,
                    serialNumber: index + 1,
                    weekstartend: `${item.shiftstartday} - ${item.shiftendday}`,
                    enable: item.enable === true ? 'Yes' : 'No',
                    weekoffdaycount: String(datalength),
                    caldaytotalfinal: item.enable === false ? String((Number(item.shiftdaytotal) - datalength)) : item.shiftdaytotal,
                    calstartend: `${item.calstartday} - ${item.calendday}`,
                    days: item.weeksColumns,
                    weekPoints: item.weekPoints?.toFixed(2),
                    tempWeekPoints: item.tempWeekPoints?.toFixed(2)
                }
            });
            // console.log(itemsWithSerialNumber, 'itemsWithSerialNumber')
            setUserShifts(itemsWithSerialNumber);
            // Assuming isHeadings is an array of unique headings
            const uniqueHeadings = [...new Set(res_present.data.finalheading)];
            setIsHeadings(uniqueHeadings);
            setColumnVisibilityUserShiftWk({
                serialNumber: true,
                checkbox: true,
                company: true,
                branch: true,
                unit: true,
                team: true,
                department: true,
                // shiftstatus: true,
                target: true,
                weekstartend: true,
                shiftdaytotal: true,
                enable: true,
                weekoffdaycount: true,
                calstartend: true,
                caldaytotalfinal: true,
                username: true,
                empcode: true,
                ...uniqueHeadings.reduce((acc, data, index) => {
                    acc[`${data}_Original`] = true;
                    acc[`${data}_Temp`] = true;
                    return acc;
                }, {}),
            });
            setLoader(false);
            setIsBtn(false);
            setDisabledButton(null);
            setSearchQueryUserShiftWk("");
            setTotalPagesUserShiftWk(Math.ceil(res_present.data.finalweekoffpresents.length / pageSizeUserShiftWk));
        } catch (err) { setLoader(false); setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        setFilteredDataItems(userShifts);
    }, [userShifts]);

    // Show All Columns & Manage Columns 
    const initialColumnVisibilityUserShiftWk = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        // shiftstatus: true,
        target: true,
        weekstartend: true,
        shiftdaytotal: true,
        weekoffdaycount: true,
        calstartend: true,
        enable: true,
        caldaytotalfinal: true,
        username: true,
        empcode: true,
        ...isHeadings.reduce((acc, data, index) => {
            // acc[`${data}`] = true;
            acc[`${data}_Original`] = true;  // Visibility for adjstatus column
            acc[`${data}_Temp`] = true;  // Visibility for tempadjstatus column
            return acc;
        }, {}),
    };

    const [columnVisibilityUserShiftWk, setColumnVisibilityUserShiftWk] = useState(initialColumnVisibilityUserShiftWk);

    // Helper function to generate date array between two dates
    const generateDateArray = (startDateStr, endDateStr) => {
        const dateArray = [];
        const [startDay, startMonth, startYear] = startDateStr.split("/").map(Number);
        const [endDay, endMonth, endYear] = endDateStr.split("/").map(Number);

        let currentDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);

        while (currentDate <= endDate) {
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();
            const date = `${day}/${month}/${year}`;
            const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

            dateArray.push({ date, dayName });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    };

    // // Function to get the next occurrence of a given weekday from a given date
    // const getNextWeekdayDate = (startDateStr, weekdayName) => {
    //     // Convert 'DD/MM/YYYY' to Date object
    //     const [day, month, year] = startDateStr.split("/").map(Number);
    //     let currentDate = new Date(year, month - 1, day); // JS months are 0-based

    //     // Add 7 days to get next week's same weekday
    //     currentDate.setDate(currentDate.getDate() + 7);

    //     // Format back to 'DD/MM/YYYY'
    //     const nextDay = String(currentDate.getDate()).padStart(2, '0');
    //     const nextMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    //     const nextYear = currentDate.getFullYear();

    //     return `${nextDay}/${nextMonth}/${nextYear}`;
    // };

    // Function to get the next occurrence of a given weekday
    const getNextOccurrenceOfWeekday = (startDateStr, targetWeekday) => {
        // Convert 'DD/MM/YYYY' to Date object
        const [day, month, year] = startDateStr.split("/").map(Number);
        let currentDate = new Date(year, month - 1, day); // JS months are 0-based

        // Get the target weekday index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const targetWeekdayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(targetWeekday);

        // If invalid weekday, return null
        if (targetWeekdayIndex === -1) {
            console.error("Invalid weekday:", targetWeekday);
            return null;
        }

        // Loop until we find the next occurrence of the target weekday
        do {
            currentDate.setDate(currentDate.getDate() + 1);
        } while (currentDate.getDay() !== targetWeekdayIndex);

        // Format back to 'DD/MM/YYYY'
        const nextDay = String(currentDate.getDate()).padStart(2, '0');
        const nextMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const nextYear = currentDate.getFullYear();

        return `${nextDay}/${nextMonth}/${nextYear}`;
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        if (filterUser.startday === 'Please Select Start Day') {
            setPopupContentMalert("Please Select Start Day");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        if (selectedCompany.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedBranch.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedUnit.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedTeam.length === 0) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        // else if (filterUser.shiftstatus === 'Please Select ShiftStatus') {
        //     setPopupContentMalert("Please Select Shiftstatus");
        //     setPopupSeverityMalert("warning");
        //     handleClickOpenPopupMalert();
        // }
        else if (selectedEmp.length === 0) {
            setPopupContentMalert("Please Select Employee");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.shiftstartday === 'Please Select Shift Start Day') {
            setPopupContentMalert("Please Select Shift Start Day");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (shiftCalDay === '') {
            setPopupContentMalert("Please select shift start day to calculate todate");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.fromdate === "" && filterUser.todate === "dd-mm-yyyy") {
            setPopupContentMalert("Please Select From Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            fetchUsers();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setUserShifts([]);
        setIsHeadings([]);
        setFilterUser({ ...filterUser, department: "Please Select Department", weekofflists: 'Please Select Data', fromdate: "", todate: "dd-mm-yyyy", shiftstatus: "Please Select ShiftStatus", startday: 'Please Select Start Day', shiftstartday: 'Please Select Shift Start Day', })
        setShiftCalDay("");
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
        setDisabledButton(null);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }
    const [isViewUserData, setIsViewUserData] = useState({ username: '', weektarget: 0, achievepoints: 0, presentdate: '' });

    //get single row to edit....
    const getCode = async (rowdata, prodstatus) => {
        // console.log(rowdata, 'rowdata')
        setPageName(!pageName);
        setGetUserId('');
        setGetUserIdNextWeek('');
        setIsViewUserData({ username: '', weektarget: 0, achievepoints: 0, presentdate: '' });
        // console.log(rowdata.userid, 'rowdata.userid')
        try {

            let res_att = await axios.post(SERVICE.ATTENDANCE_ID_FILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                userid: rowdata.userid,
            });

            const dateRange = rowdata.date?.split("-");
            const dateArray = generateDateArray(dateRange[0], dateRange[1],);
            // console.log(res_att?.data?.attandances, 'res_att?.data?.attandances')
            // console.log(dateArray, 'dateArray')

            // Find the last date in the range (since we know rowdata.weekoffpresentday is the last occurrence)
            const lastWeekoffDate = dateRange[1];

            // Get the next week's Thursday
            // const nextWeekThursday = getNextWeekdayDate(lastWeekoffDate, rowdata.weekoffpresentday);
            // Get the next week's occurrence of the required weekday
            const nextWeekMatchedDay = getNextOccurrenceOfWeekday(lastWeekoffDate, rowdata.weekoffpresentday);

            // console.log(nextWeekMatchedDay);
            const resdatausernmae = allUsersData.filter((data, index) => data?.username === rowdata?.rowusername);
            // console.log(nextWeekThursday);
            res_att?.data?.attandances?.map((att) => {
                dateArray?.forEach((d) => {
                    // console.log(d.dayName, 'd.dayname')
                    // console.log(rowdata.weekoffpresentday, 'rowdata weekoff')
                    // console.log(d.dayName, rowdata.weekoffpresentday, d.dayName === rowdata.weekoffpresentday)
                    if (d.dayName === rowdata.weekoffpresentday) {
                        const [day, month, year] = d.date.split('/');
                        const finalDate = `${day}-${month}-${year}`;

                        const [nextWeekDay, nextWeekMonth, nextWeekYear] = nextWeekMatchedDay.split('/');
                        const finalNextWeekDate = `${nextWeekDay}-${nextWeekMonth}-${nextWeekYear}`;

                        setGetUserDate(finalDate);
                        setGetUserDateNextWeek(finalNextWeekDate);
                        setGetEmpUserId(rowdata.userid);
                        setGetUserName(rowdata.rowusername);
                        setIsViewUserData({ username: resdatausernmae?.length > 0 ? resdatausernmae[0]?.companyname : '', weektarget: rowdata?.targetPoints, achievepoints: prodstatus === 'original' ? rowdata?.weekPoints : rowdata?.tempWeekPoints, presentdate: finalNextWeekDate });
                        // console.log(finalDate, finalNextWeekDate, att.date)
                        // console.log(finalDate === att.date, finalNextWeekDate === att.date)
                        if (finalDate === att.date) {
                            // console.log(att._id, 'att._id')
                            setGetUserId(att._id);
                        }
                        if (finalNextWeekDate === att.date) {
                            // console.log(att._id, 'att._id')
                            setGetUserIdNextWeek(att._id);
                        }
                    }
                })
            })

            setStatusEdit({ weekoffpresentstatus: "Please Select Status" });
            handleClickOpenEdit();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    const sendRequest = async () => {
        setPageName(!pageName);

        try {
            if (statusEdit.weekoffpresentstatus === "Please Select Status") {
                setPopupContentMalert("Please Select Status");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                const response = await axios.get("https://api.ipify.org?format=json");
                if (getUserId && getUserIdNextWeek) {
                    await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getUserId}`, {
                        attandancemanual: Boolean(false),
                        isweekoffpresentstatus: Boolean(true),
                        clockinipaddress: String(response?.data?.ip),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });

                    await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getUserIdNextWeek}`, {
                        attandancemanual: Boolean(false),
                        weekoffpresentstatus: Boolean(true),
                        clockinipaddress: String(response?.data?.ip),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });
                    handleCloseEdit();
                    await fetchUsers();
                    setPopupContent("Updated Successfully");
                    setPopupSeverity("success");
                    setGetUserId('');
                    setGetUserIdNextWeek('');
                    handleClickOpenPopup();
                }
                else if (getUserId === '' && getUserIdNextWeek === '') {
                    await axios.post(`${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`, {
                        shiftendtime: String(""),
                        shiftname: String(""),
                        username: String(getUserName),
                        userid: String(getEmpUserId),
                        clockintime: String("00:00:00"),
                        date: String(getUserDate),
                        clockinipaddress: String(response?.data?.ip),
                        status: true,
                        clockouttime: "00:00:00",
                        buttonstatus: "true",
                        autoclockout: Boolean(false),
                        attandancemanual: Boolean(false),
                        isweekoffpresentstatus: Boolean(true),
                        shiftmode: String("Main Shift"),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });

                    await axios.post(`${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`, {
                        shiftendtime: String(""),
                        shiftname: String(""),
                        username: String(getUserName),
                        userid: String(getEmpUserId),
                        clockintime: String("00:00:00"),
                        date: String(getUserDateNextWeek),
                        clockinipaddress: String(response?.data?.ip),
                        status: true,
                        clockouttime: "00:00:00",
                        buttonstatus: "true",
                        autoclockout: Boolean(false),
                        attandancemanual: Boolean(false),
                        weekoffpresentstatus: Boolean(true),
                        shiftmode: String("Main Shift"),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });
                    handleCloseEdit();
                    await fetchUsers();
                    setGetUserId('');
                    setGetUserIdNextWeek('');
                    setPopupContent("Updated Successfully");
                    setPopupSeverity("success");
                    handleClickOpenPopup();
                }
                else if (getUserId && getUserIdNextWeek === '') {
                    await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getUserId}`, {
                        attandancemanual: Boolean(false),
                        isweekoffpresentstatus: Boolean(true),
                        clockinipaddress: String(response?.data?.ip),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });

                    await axios.post(`${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`, {
                        shiftendtime: String(""),
                        shiftname: String(""),
                        username: String(getUserName),
                        userid: String(getEmpUserId),
                        clockintime: String("00:00:00"),
                        date: String(getUserDateNextWeek),
                        clockinipaddress: String(response?.data?.ip),
                        status: true,
                        clockouttime: "00:00:00",
                        buttonstatus: "true",
                        autoclockout: Boolean(false),
                        attandancemanual: Boolean(false),
                        weekoffpresentstatus: Boolean(true),
                        shiftmode: String("Main Shift"),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });
                    handleCloseEdit();
                    await fetchUsers();
                    setPopupContent("Updated Successfully");
                    setPopupSeverity("success");
                    setGetUserId('');
                    setGetUserIdNextWeek('');
                    handleClickOpenPopup();
                }
                else if (getUserId === '' && getUserIdNextWeek) {
                    await axios.post(`${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`, {
                        shiftendtime: String(""),
                        shiftname: String(""),
                        username: String(getUserName),
                        userid: String(getEmpUserId),
                        clockintime: String("00:00:00"),
                        date: String(getUserDate),
                        clockinipaddress: String(response?.data?.ip),
                        status: true,
                        clockouttime: "00:00:00",
                        buttonstatus: "true",
                        autoclockout: Boolean(false),
                        attandancemanual: Boolean(false),
                        isweekoffpresentstatus: Boolean(true),
                        shiftmode: String("Main Shift"),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });

                    await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getUserIdNextWeek}`, {
                        attandancemanual: Boolean(false),
                        weekoffpresentstatus: Boolean(true),
                        clockinipaddress: String(response?.data?.ip),
                    }, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        }
                    });

                    handleCloseEdit();
                    await fetchUsers();
                    setGetUserId('');
                    setGetUserIdNextWeek('');
                    setPopupContent("Updated Successfully");
                    setPopupSeverity("success");
                    handleClickOpenPopup();
                }
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleAdjStatusClick = (dayData) => {
        setDisabledButton('adjstatus');
        if (dayData.adjstatus !== 'Not Achieved' || dayData.adjstatus !== 'Verified') {
            getCode(dayData, 'original');
        }
    };

    const handleTempAdjStatusClick = (dayData) => {
        setDisabledButton('tempadjstatus');
        if (dayData.tempadjstatus !== 'Not Achieved' || dayData.tempadjstatus !== 'Verified') {
            getCode(dayData, 'temp');
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
        if (gridRefTableUserShift.current) {
            const gridApi = gridRefTableUserShift.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesUserShiftWk = gridApi.paginationGetTotalPages();
            setPageUserShiftWk(currentPage);
            setTotalPagesUserShiftWk(totalPagesUserShiftWk);
        }
    }, []);

    const columnDataTableUserShiftWk = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityUserShiftWk.serialNumber, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibilityUserShiftWk.empcode, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityUserShiftWk.username, headerClassName: "bold-header", pinned: 'left', lockPinned: true, },
        { field: "company", headerName: "Company", flex: 0, width: 150, hide: !columnVisibilityUserShiftWk.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityUserShiftWk.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 150, hide: !columnVisibilityUserShiftWk.unit, headerClassName: "bold-header" },
        { field: "team", headerName: "Team", flex: 0, width: 150, hide: !columnVisibilityUserShiftWk.team, headerClassName: "bold-header" },
        { field: "department", headerName: "Department", flex: 0, width: 200, hide: !columnVisibilityUserShiftWk.department, headerClassName: "bold-header" },
        // { field: "shiftstatus", headerName: "Shift Status", flex: 0, width: 150, hide: !columnVisibilityUserShiftWk.shiftstatus, headerClassName: "bold-header" },
        { field: "target", headerName: "Target Points", flex: 0, width: 150, hide: !columnVisibilityUserShiftWk.target, headerClassName: "bold-header", },
        { field: "weekstartend", headerName: "Day (Start / End)", flex: 0, width: 200, hide: !columnVisibilityUserShiftWk.weekstartend, headerClassName: "bold-header", },
        { field: "shiftdaytotal", headerName: "Shift Total Days", flex: 0, width: 170, hide: !columnVisibilityUserShiftWk.shiftdaytotal, headerClassName: "bold-header", },
        { field: "enable", headerName: "Include Weekoff Target", flex: 0, width: 200, hide: !columnVisibilityUserShiftWk.enable, headerClassName: "bold-header", },
        { field: "weekoffdaycount", headerName: "Week Off Day Count", flex: 0, width: 200, hide: !columnVisibilityUserShiftWk.weekoffdaycount, headerClassName: "bold-header", },
        { field: "calstartend", headerName: "Cal Day (Start / End)", flex: 0, width: 200, hide: !columnVisibilityUserShiftWk.calstartend, headerClassName: "bold-header", },
        { field: "caldaytotalfinal", headerName: "Calculation Total Days", flex: 0, width: 200, hide: !columnVisibilityUserShiftWk.caldaytotalfinal, headerClassName: "bold-header", },
        ...isHeadings.flatMap((column, index) => [
            {
                field: `${column}_Original`,
                headerName: `${column}_Original`,
                // hide: !columnVisibilityUserShiftWk[column],
                hide: !columnVisibilityUserShiftWk[`${column}_Original`],
                flex: 0,
                width: 250,
                filter: false,
                sortable: false,
                cellRenderer: (params) => {
                    const dayData = params.data.days.find(day => day.date === column);
                    if (!dayData) return null;
                    return (
                        <Grid>
                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                Week Target: {dayData.targetPoints}
                            </Typography>
                            <Button
                                size="small"
                                disabled={disabledButton === 'tempadjstatus'}
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
                                    padding: dayData.adjstatus === 'Not Achieved' ? '3px 10px' : '3px 8px',
                                    color: dayData.adjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                    backgroundColor: disabledButton === 'tempadjstatus' ? "" : dayData.adjstatus === 'Verified' ? 'rgb(156 239 156)' : (dayData.adjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                    pointerEvents: (dayData.adjstatus === 'Not Achieved' || dayData.adjstatus === 'Verified') ? 'none' : 'auto',
                                    '&:hover': {
                                        color: dayData.adjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                        backgroundColor: dayData.adjstatus === 'Verified' ? 'rgb(156 239 156)' : (dayData.adjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                    },
                                }}
                                // onClick={(e) => {
                                //     if (dayData.adjstatus !== 'Not Achieved' || dayData.adjstatus !== 'Verified') {
                                //         getCode(dayData);
                                //     }
                                // }}
                                onClick={() => handleAdjStatusClick(dayData)}
                            >
                                {dayData.adjstatus}
                            </Button>

                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                Week Achieved Point: {dayData.weekPoints}
                            </Typography>
                        </Grid>
                    );
                },
            },
            {
                field: `${column}_Temp`,
                headerName: `${column}_Temp`,
                hide: !columnVisibilityUserShiftWk[`${column}_Temp`],
                flex: 0,
                width: 250,
                filter: false,
                sortable: false,
                cellRenderer: (params) => {
                    const dayData = params.data.days.find(day => day.date === column);
                    if (!dayData) return null;
                    return (
                        <Grid>
                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                Week Target: {dayData.targetPoints}
                            </Typography>
                            <Button
                                size="small"
                                disabled={disabledButton === 'adjstatus'}
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
                                    padding: dayData.tempadjstatus === 'Not Achieved' ? '3px 10px' : '3px 8px',
                                    color: dayData.tempadjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                    backgroundColor: dayData.tempadjstatus === 'Verified' ? 'rgb(156 239 156)' : (dayData.tempadjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                    pointerEvents: (dayData.tempadjstatus === 'Not Achieved' || dayData.tempadjstatus === 'Verified') ? 'none' : 'auto',
                                    '&:hover': {
                                        color: dayData.tempadjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                        backgroundColor: dayData.tempadjstatus === 'Verified' ? 'rgb(156 239 156)' : (dayData.tempadjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                    },
                                }}
                                // onClick={(e) => {
                                //     if (dayData.tempadjstatus !== 'Not Achieved' || dayData.tempadjstatus !== 'Verified') {
                                //         getCode(dayData);
                                //     }
                                // }}
                                onClick={() => handleTempAdjStatusClick(dayData)}
                            >
                                {dayData.tempadjstatus}
                            </Button>

                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                Week Achieved Point: {dayData.tempWeekPoints}
                            </Typography>
                        </Grid>
                    );
                },
            }
        ]),
    ];

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryUserShiftWk(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };

    const applyNormalFilter = (searchValue) => {
        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = userShifts?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageUserShiftWk(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = userShifts?.filter((item) => {
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

        setFilteredDataItems(filtered); // Update filtered data
        setAdvancedFilter(filters);
        // handleCloseSearchUserShiftWk(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryUserShiftWk("");
        setFilteredDataItems(userShifts);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableUserShiftWk.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryUserShiftWk;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesUserShiftWk) {
            setPageUserShiftWk(newPage);
            gridRefTableUserShift.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeUserShiftWk(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityUserShiftWk };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityUserShiftWk(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityUserShiftWk");
        if (savedVisibility) {
            setColumnVisibilityUserShiftWk(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityUserShiftWk", JSON.stringify(columnVisibilityUserShiftWk));
    }, [columnVisibilityUserShiftWk]);


    // // Function to filter columns based on search query
    const filteredColumns = columnDataTableUserShiftWk.filter((column) =>
        column.headerName?.toLowerCase().includes(searchQueryManageUserShiftWk?.toLowerCase())
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

        setColumnVisibilityUserShiftWk((prevVisibility) => {
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

        setColumnVisibilityUserShiftWk((prevVisibility) => {
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
        setColumnVisibilityUserShiftWk((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const fileName = "User Shift Weekoff Present";
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
        const headers = [
            'SNo',
            'Company',
            'Branch',
            'Unit',
            'Team',
            'Department',
            'Employee Name',
            'Employee Code',
            'Shift Status',
            "Target Points",
            "Day (Start / End)",
            "Shift Total Days",
            "Include Weekoff Target",
            "Week Off Day Count",
            "Cal Day (Start / End)",
            "Calculation Total Days",
            ...isHeadings.map(header => `${header} (Original)`),
            ...isHeadings.map(header => `${header} (Temp)`),
        ];

        let data = [];
        let resultdata = (filteredRowData.length > 0 ? filteredRowData : filteredData) ?? [];
        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => {
                return [
                    index + 1,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    row.empcode,
                    row.shiftstatus,
                    row.target,
                    row.weekstartend,
                    row.shiftdaytotal,
                    row.enable,
                    row.weekoffdaycount,
                    row.calstartend,
                    row.caldaytotalfinal,
                    ...row.days.map(item => {
                        return `WKT: ${item.targetPoints} Status: ${item.adjstatus} WKAP: ${item.weekPoints}`
                    }),
                    ...row.days.map(item => {
                        return `WKT: ${item.targetPoints} Status: ${item.tempadjstatus} WKAP: ${item.tempWeekPoints}`
                    }),
                ]
            });
        } else if (isfilter === "overall") {
            data = userShifts.map((row, index) => {
                return [
                    index + 1,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    row.empcode,
                    row.shiftstatus,
                    row.target,
                    row.weekstartend,
                    row.shiftdaytotal,
                    row.enable,
                    row.weekoffdaycount,
                    row.calstartend,
                    row.caldaytotalfinal,
                    ...row.days.map(item => {
                        return `WKT: ${item.targetPoints} Status: ${item.adjstatus} WKAP: ${item.weekPoints}`
                    }),
                    ...row.days.map(item => {
                        return `WKT: ${item.targetPoints} Status: ${item.tempadjstatus} WKAP: ${item.tempWeekPoints}`
                    }),
                ]
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

        exportToCSV(formattedData, fileName);
        setIsFilterOpen(false);
    };

    // Print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "User Shift Weekoff Present",
        pageStyle: "print",
    });

    //pdf....
    const downloadPdf = (isfilter) => {

        const doc = new jsPDF({ orientation: "landscape" });

        // Define the table headers
        const headers = [
            'SNo',
            'Company',
            'Branch',
            'Unit',
            'Team',
            'Department',
            'Employee Name',
            'Employee Code',
            'Shift Status',
            // 'Start Date',
            "Target Points",
            "Day (Start / End)",
            "Shift Total Days",
            "Include Weekoff Target",
            "Week Off Day Count",
            "Cal Day (Start / End)",
            "Calculation Total Days",
            ...isHeadings.map(header => `${header} (Original)`),
            ...isHeadings.map(header => `${header} (Temp)`),
        ];

        let data = [];
        let resultdata = (filteredRowData.length > 0 ? filteredRowData : filteredData) ?? [];
        if (isfilter === "filtered") {
            data = resultdata.map((row, index) => [
                index + 1,
                row.company,
                row.branch,
                row.unit,
                row.team,
                row.department,
                row.username,
                row.empcode,
                row.shiftstatus,
                // row.startdate,
                row.target,
                row.weekstartend,
                row.shiftdaytotal,
                row.enable,
                row.weekoffdaycount,
                row.calstartend,
                row.caldaytotalfinal,
                ...((row.days || []).map(item =>
                    `WKT: ${item.targetPoints}\nStatus: ${item.adjstatus}\nWKAP: ${item.weekPoints}`
                )),
                ...((row.days || []).map(item =>
                    `WKT: ${item.targetPoints}\nStatus: ${item.tempadjstatus}\nWKAP: ${item.tempWeekPoints}`
                )),
            ]);

        } else {
            data = userShifts.map((row, index) => {
                return [
                    index + 1,
                    row.company,
                    row.branch,
                    row.unit,
                    row.team,
                    row.department,
                    row.username,
                    row.empcode,
                    row.shiftstatus,
                    row.target,
                    row.weekstartend,
                    row.shiftdaytotal,
                    row.enable,
                    row.weekoffdaycount,
                    row.calstartend,
                    row.caldaytotalfinal,
                    ...((row.days || []).map(item =>
                        `WKT: ${item.targetPoints}\nOrg Status: ${item.adjstatus}\nWKAP: ${item.weekPoints}`
                    )),
                    ...((row.days || []).map(item =>
                        `WKT: ${item.targetPoints}\nTmp Status: ${item.tempadjstatus}\nWKAP: ${item.tempWeekPoints}`
                    )),
                ]
            });
        }

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            head: [headers],
            body: data,
        });

        doc.save("User Shift Weekoff Present.pdf");
    };

    // image
    const handleCaptureImage = () => {
        if (gridRefImageUserShift.current) {
            domtoimage.toBlob(gridRefImageUserShift.current)
                .then((blob) => {
                    saveAs(blob, "User Shift Weekoff Present.png");
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

        const startPage = Math.max(1, pageUserShiftWk - 1);
        const endPage = Math.min(totalPagesUserShiftWk, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageUserShiftWk numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageUserShiftWk, show ellipsis
        if (endPage < totalPagesUserShiftWk) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageUserShiftWk - 1) * pageSizeUserShiftWk, pageUserShiftWk * pageSizeUserShiftWk);
    const totalPagesUserShiftWkOuter = Math.ceil(filteredDataItems?.length / pageSizeUserShiftWk);
    const visiblePages = Math.min(totalPagesUserShiftWkOuter, 3);
    const firstVisiblePage = Math.max(1, pageUserShiftWk - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesUserShiftWkOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageUserShiftWk * pageSizeUserShiftWk;
    const indexOfFirstItem = indexOfLastItem - pageSizeUserShiftWk;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            <Headtitle title={'User Shift Weekoff Present'} />
            {/* ****** Header Content ****** */}
            <PageHeading title="User Shift Weekoff Present" modulename="Human Resources" submodulename="HR" mainpagename="Attendance" subpagename="Attendance Update" subsubpagename="User Shift Weekoff Present" />

            {isUserRoleCompare?.includes("lusershiftweekoffpresent")
                && (
                    <>
                        <Box sx={userStyle.selectcontainer}>
                            <Grid container spacing={2}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <Typography sx={userStyle.importheadtext}>User Shift Weekoff Present</Typography>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>Start Day<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={shiftstartDrop}
                                            styles={colourStyles}
                                            value={{ label: filterUser.startday, value: filterUser.startday }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, startday: e.value, weekofflists: 'Please Select Data', shiftstartday: 'Please Select Shift Start Day', shiftstartday: 'Please Select Shift Start Day', fromdate: '', todate: '', });
                                                handleStartDayChange(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>Weekoff Panel List<b style={{ color: "red" }}>*</b></Typography>
                                    <Selects
                                        options={weekofflistOptions}
                                        styles={colourStyles}
                                        value={{ label: filterUser.weekofflists, value: filterUser.weekofflists }}
                                        onChange={(e) => {
                                            setFilterUser({ ...filterUser, weekofflists: e.value, shiftstartday: 'Please Select Shift Start Day', shiftstartday: 'Please Select Shift Start Day', fromdate: '', todate: '', });
                                            handleStartDayChangeBasedOnId(e.id);
                                            setGetSelectedWeekoffDataId(e.id);
                                        }}
                                    />
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect
                                            options={companyOptions}
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
                                        <Typography>Branch<b style={{ color: "red" }}>*</b> </Typography>
                                        <MultiSelect
                                            options={branchOptions}
                                            value={selectedBranch}
                                            onChange={(e) => {
                                                handleBranchChange(e);
                                                setFilterUser({ ...filterUser, department: 'Please Select Department' });
                                            }}
                                            valueRenderer={customValueRendererBranch}
                                            labelledBy="Please Select Branch"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Unit<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={unitOptions}
                                            value={selectedUnit}
                                            onChange={(e) => {
                                                handleUnitChange(e);
                                                setFilterUser({ ...filterUser, department: 'Please Select Department' });
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
                                            options={teamOptions}
                                            value={selectedTeam}
                                            onChange={(e) => { handleTeamChange(e); }}
                                            valueRenderer={customValueRendererTeam}
                                            labelledBy="Please Select Team"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Employee<b style={{ color: "red" }}>*</b></Typography>
                                        <MultiSelect
                                            options={empOptions}
                                            value={selectedEmp}
                                            onChange={(e) => { handleEmployeeChange(e); }}
                                            valueRenderer={customValueRendererEmp}
                                            labelledBy="Please Select Employee"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        {/* <Typography>
                                            Shift Status<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={shiftstatusDrop}
                                            styles={colourStyles}
                                            value={{ label: filterUser.shiftstatus, value: filterUser.shiftstatus }}
                                            onChange={(e) => {
                                                setFilterUser({ ...filterUser, shiftstatus: e.value, });
                                            }}
                                        /> */}
                                        <Typography>Shift Start Day<b style={{ color: "red" }}>*</b></Typography>
                                        <Selects
                                            options={shiftstatusDrop}
                                            styles={colourStyles}
                                            value={{ label: filterUser.shiftstartday, value: filterUser.shiftstartday }}
                                            onChange={handleShiftStartChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <Typography>From Date<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            placeholder="Date"
                                            value={filterUser.fromdate}
                                            onChange={handleFromDateChange}
                                            inputProps={{
                                                step: 7,
                                                pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2}",
                                                oninvalid: (e) => {
                                                    e.target.setCustomValidity(`Please select a valid ${filterUser.shiftstartday}.`);
                                                },
                                                oninput: (e) => {
                                                    e.target.setCustomValidity("");
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={12} xs={12}>
                                    <Typography>To Date<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            value={
                                                filterUser.todate && moment(filterUser.todate, "YYYY-MM-DD", true).isValid()
                                                    ? moment(filterUser.todate).format("DD-MM-YYYY")
                                                    : "dd-mm-yyyy"
                                            }
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item lg={1} md={2} sm={2} xs={6} >
                                    <Box sx={(theme) => ({ mt: { lg: 3, md: 2, sm: 1, xs: 0, } })}>
                                        <LoadingButton
                                            onClick={handleSubmit}
                                            loading={isBtn}
                                            color="primary"
                                            loadingPosition="end"
                                            variant="contained"
                                            sx={buttonStyles.buttonsubmit}
                                        >
                                            Filter
                                        </LoadingButton>
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
                            { /* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>User Shift Weekoff Present List</Typography>
                            </Grid>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label >Show entries:</label>
                                        <Select id="pageSizeSelect" value={pageSizeUserShiftWk}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={(userShifts?.length)}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box >
                                        {isUserRoleCompare?.includes("excelusershiftweekoffpresent") && (
                                            <>
                                                {/* <ExportXL csvData={rowDataTable.map((t, index) => ({
                                                    Sno: index + 1,
                                                    Code: t.code,
                                                    Name: t.name,
                                                }))} fileName={fileName} /> */}
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvusershiftweekoffpresent") && (
                                            <>
                                                {/* <ExportCSV csvData={rowDataTable.map((t, index) => ({
                                                    Sno: index + 1,
                                                    Code: t.code,
                                                    Name: t.name,
                                                }))} fileName={fileName} /> */}
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printusershiftweekoffpresent") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfusershiftweekoffpresent") && (
                                            <>
                                                {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button> */}
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}
                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageusershiftweekoffpresent") && (
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                                        )}
                                    </Box >
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
                                                    {advancedFilter && (
                                                        <IconButton onClick={handleResetSearch}>
                                                            <MdClose />
                                                        </IconButton>
                                                    )}
                                                    <Tooltip title="Show search options">
                                                        <span>
                                                            <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchUserShiftWk} />
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
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsUserShiftWk}> Manage Columns  </Button><br /><br />
                            {loader ?
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>

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
                                :
                                <>
                                    <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageUserShift} >
                                        <AgGridReact
                                            rowData={filteredDataItems}
                                            columnDefs={columnDataTableUserShiftWk.filter((column) => columnVisibilityUserShiftWk[column.field])}
                                            ref={gridRefTableUserShift}
                                            defaultColDef={defaultColDef}
                                            domLayout={"autoHeight"}
                                            getRowStyle={getRowStyle}
                                            rowHeight={50}
                                            pagination={true}
                                            paginationPageSize={pageSizeUserShiftWk}
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
                                                    (filteredDataItems.length > 0 ? (pageUserShiftWk - 1) * pageSizeUserShiftWk + 1 : 0)
                                                ) : (
                                                    filteredRowData.length > 0 ? (pageUserShiftWk - 1) * pageSizeUserShiftWk + 1 : 0
                                                )
                                            }{" "}to{" "}
                                            {
                                                gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                                    Math.min(pageUserShiftWk * pageSizeUserShiftWk, filteredDataItems.length)
                                                ) : (
                                                    filteredRowData.length > 0 ? Math.min(pageUserShiftWk * pageSizeUserShiftWk, filteredRowData.length) : 0
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
                                            <Button onClick={() => handlePageChange(1)} disabled={pageUserShiftWk === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                            <Button onClick={() => handlePageChange(pageUserShiftWk - 1)} disabled={pageUserShiftWk === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
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
                                                    className={pageUserShiftWk === pageNumber ? "active" : ""}
                                                    disabled={pageUserShiftWk === pageNumber}
                                                >
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                            <Button onClick={() => handlePageChange(pageUserShiftWk + 1)} disabled={pageUserShiftWk === totalPagesUserShiftWk} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                            <Button onClick={() => handlePageChange(totalPagesUserShiftWk)} disabled={pageUserShiftWk === totalPagesUserShiftWk} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                        </Box>
                                    </Box> */}
                                </>
                            }
                        </Box>
                    </>
                )}

            {/* Manage Column */}
            <Popover
                id={idUserShiftWk}
                open={isManageColumnsOpenUserShiftWk}
                anchorEl={anchorElUserShiftWk}
                onClose={handleCloseManageColumnsUserShiftWk}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsUserShiftWk}
                    searchQuery={searchQueryManageUserShiftWk}
                    setSearchQuery={setSearchQueryManageUserShiftWk}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityUserShiftWk}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityUserShiftWk}
                    initialColumnVisibility={initialColumnVisibilityUserShiftWk}
                    columnDataTable={columnDataTableUserShiftWk}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchUserShiftWk}
                open={openSearchUserShiftWk}
                anchorEl={anchorElSearchUserShiftWk}
                onClose={handleCloseSearchUserShiftWk}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <Box sx={{ padding: '10px' }}>
                    <AdvancedSearchBar columns={columnDataTableUserShiftWk} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryUserShiftWk} handleCloseSearch={handleCloseSearchUserShiftWk} />
                </Box>
            </Popover>

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" ref={componentRef}   >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Shift Status</TableCell>
                            {/* <TableCell>Start Date</TableCell> */}
                            <TableCell> Target Points</TableCell>
                            <TableCell> Day (Start / End)</TableCell>
                            <TableCell>Shift Total Days</TableCell>
                            <TableCell>Include Weekoff Target</TableCell>
                            <TableCell>Week Off Day Count</TableCell>
                            <TableCell>Cal Day (Start / End)</TableCell>
                            <TableCell>Calcualtion Total Days</TableCell>
                            {isHeadings.map((column, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableCell>
                                            <Box sx={userStyle.tableheadstyle}>
                                                {`${column} (Original)`}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={userStyle.tableheadstyle}>
                                                {`${column} (Temp)`}
                                            </Box>
                                        </TableCell>
                                    </React.Fragment>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody align="left" >
                        {(filteredRowData.length > 0 ? filteredRowData : filteredData) &&
                            (filteredRowData.length > 0 ? filteredRowData : filteredData).map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.serialNumber}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.shiftstatus}</TableCell>
                                    {/* <TableCell>{row.startdate}</TableCell> */}
                                    <TableCell>{row.target}</TableCell>
                                    <TableCell>{row.weekstartend}</TableCell>
                                    <TableCell>{row.shiftdaytotal}</TableCell>
                                    <TableCell>{row.enable}</TableCell>
                                    <TableCell>{row.weekoffdaycount}</TableCell>
                                    <TableCell>{row.calstartend}</TableCell>
                                    <TableCell>{row.caldaytotalfinal}</TableCell>
                                    {row.days && (
                                        row.days.map((column, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <TableCell>
                                                        <Grid>
                                                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                                Week Target: {column.targetPoints}
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
                                                                    padding: column.adjstatus === 'Not Achieved' ? '3px 10px' : '3px 8px',
                                                                    color: column.adjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                                                    backgroundColor: column.adjstatus === 'Verified' ? 'rgb(156 239 156)' : (column.adjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                                                    pointerEvents: (column.adjstatus === 'Not Achieved' || column.adjstatus === 'Verified') ? 'none' : 'auto',
                                                                    '&:hover': {
                                                                        color: column.adjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                                                        backgroundColor: column.adjstatus === 'Verified' ? 'rgb(156 239 156)' : (column.adjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                                                    },
                                                                }}
                                                            >
                                                                {column.adjstatus}
                                                            </Button>

                                                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                                Week Achieved Point: {column.weekPoints}
                                                            </Typography>
                                                        </Grid>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Grid>
                                                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                                Week Target: {column.targetPoints}
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
                                                                    padding: column.tempadjstatus === 'Not Achieved' ? '3px 10px' : '3px 8px',
                                                                    color: column.tempadjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                                                    backgroundColor: column.tempadjstatus === 'Verified' ? 'rgb(156 239 156)' : (column.tempadjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                                                    pointerEvents: (column.tempadjstatus === 'Not Achieved' || column.tempadjstatus === 'Verified') ? 'none' : 'auto',
                                                                    '&:hover': {
                                                                        color: column.tempadjstatus === 'Not Achieved' ? '#892a23' : '#052106',
                                                                        backgroundColor: column.tempadjstatus === 'Verified' ? 'rgb(156 239 156)' : (column.tempadjstatus === 'Achieved' ? 'rgb(243 203 117)' : 'rgb(243 174 174)'),
                                                                    },
                                                                }}
                                                            >
                                                                {column.tempadjstatus}
                                                            </Button>

                                                            <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                                                                Week Achieved Point: {column.tempWeekPoints}
                                                            </Typography>
                                                        </Grid>
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

            {/* Edit Adjustment*/}
            <Dialog open={openEdit} onClose={handleClickOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth={true}>
                <Box sx={userStyle.dialogbox}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Status Update</Typography>
                        <Typography>
                            Name: <b>{isViewUserData?.username}</b>
                        </Typography>
                        <Typography>
                            WeekTarget:<b>{isViewUserData?.weektarget}</b>
                        </Typography>
                        <Typography>
                            AchievedTarget:<b>{isViewUserData?.achievepoints}</b>
                        </Typography>
                        <Typography>
                            Presentdate:<b>{isViewUserData?.presentdate}</b>
                        </Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={5} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', }}>Status</Typography>
                                <FormControl fullWidth size="small">
                                    <Selects fullWidth
                                        size="small"
                                        options={adjtypeoptions}
                                        styles={colourStyles}
                                        value={{ label: statusEdit.weekoffpresentstatus, value: statusEdit.weekoffpresentstatus }}
                                        onChange={(e) => setStatusEdit({ ...statusEdit, weekoffpresentstatus: e.value })}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2}>
                                <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={sendRequest}> {" "} Ok{" "}  </Button>
                            </Grid>
                            <Grid item md={2}>
                                <Button variant="contained" sx={buttonStyles.btncancel} onClick={handleCloseEdit}> {" "} Cancel{" "} </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog >

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default UserShiftWeekOffPresent;