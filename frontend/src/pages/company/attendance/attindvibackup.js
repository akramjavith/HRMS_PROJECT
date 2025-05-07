import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, Chip, Typography, OutlinedInput, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Tooltip, Grid, Button, Popover, TextField, IconButton, InputAdornment } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { handleApiError } from "../../../components/Errorhandling";
import { MultiSelect } from "react-multi-select-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

function AttendanceIndividualStatus() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    var newtoday = dd + '/' + mm + '/' + yyyy

    const gridRefTableAttInd = useRef(null);
    const gridRefImageAttInd = useRef(null);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, alldepartment, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [hoursOptionconvert, setHoursOptionsConvert] = useState([]);
    const [hoursOptionconvertclockout, setHoursOptionsConvertClockout] = useState([]);
    const [attStatus, setAttStatus] = useState([]);
    const [userShifts, setUserShifts] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(false);
    const [attClockInEdit, setAttClockInEdit] = useState({ username: "", empcode: "", date: "", clockin: '', timeperiod: '', shiftmode: '' });
    const [isReadClockIn, setIsReadClockIn] = useState(false);
    const [getAttIdClockIn, setGetAttIdClockIn] = useState('');
    const [attClockOutEdit, setAttClockOutEdit] = useState({ username: "", empcode: "", date: "", clockout: '', timeperiod: '', shiftmode: '' });
    const [isReadClockOut, setIsReadClockOut] = useState(false);
    const [getAttIdClockOut, setGetAttIdClockOut] = useState('');
    const [filterUser, setFilterUser] = useState({ mode: "Please Select Mode", fromdate: today, todate: today, });
    const [dateOptions, setDateOptions] = useState([]);
    const [hoursOption, setHoursOptions] = useState([]);
    const [allHoursOption, setAallHoursOptions] = useState([]);
    const [removeHide, setRemoveHide] = useState(true);

    let hoursOptions = [];

    const [hoursOptionsNew, setHoursOptionsNew] = useState([]);
    const [minsOptionsNew, setMinsOptionsNew] = useState([]);

    const [hoursOptionsOut, setHoursOptionsOut] = useState([]);
    const [minsOptionsOut, setMinsOptionsOut] = useState([]);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);

    //company multiselect
    const [employees, setEmployees] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [valueCompany, setValueCompany] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [valueBranch, setValueBranch] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [valueUnit, setValueUnit] = useState("");
    const [selectedDep, setSelectedDep] = useState([]);
    const [valueDep, setValueDep] = useState("");
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [valueEmp, setValueEmp] = useState("");

    // Datatable
    const [pageAttInd, setPageAttInd] = useState(1);
    const [pageSizeAttInd, setPageSizeAttInd] = useState(10);
    const [searchQueryAttInd, setSearchQueryAttInd] = useState("");
    const [totalPagesAttInd, setTotalPagesAttInd] = useState("");

    const [attSeetings, setAttSettings] = useState({})

    //Delete model
    const [removeId, setRemoveId] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    const [isOutDeleteOpen, setIsOutDeleteOpen] = useState(false);
    const handleOutClickOpen = () => { setIsOutDeleteOpen(true); };
    const handleOutCloseMod = () => { setIsOutDeleteOpen(false); };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    // Exports
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // pageAttInd refersh reload
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

    // Edit model Clock In
    const [openEditClkIn, setOpenEditClkIn] = useState(false);
    const handleClickOpenEditClkIn = () => { setOpenEditClkIn(true); };
    const handleCloseEditClkIn = () => {
        setOpenEditClkIn(false);
        setAttClockInEdit({ shiftendtime: "", shiftname: '', shift: "", clinhour: "00", clinseconds: "00", clinminute: "00", username: "", empcode: "", date: "", clockin: "", timeperiod: '', shiftmode: '' });
        setIsReadClockIn(false);
        setGetAttIdClockIn('');
    }

    // Edit model Clock Out
    const [openEditClkOut, setOpenEditClkOut] = useState(false);
    const handleClickOpenEditClkOut = () => { setOpenEditClkOut(true); };
    const handleCloseEditClkOut = () => {
        setOpenEditClkOut(false);
        setAttClockOutEdit({ shiftendtime: "", shiftname: '', shift: "", clouthour: "00", cloutseconds: "00", cloutminute: "00", username: "", empcode: "", date: "", clockout: "", timeperiod: '' });
        setIsReadClockOut(false);
    }

    // Manage Columns
    const [isManageColumnsOpenAttInd, setManageColumnsOpenAttInd] = useState(false);
    const [anchorElAttInd, setAnchorElAttInd] = useState(null);
    const [searchQueryManageAttInd, setSearchQueryManageAttInd] = useState("");
    const handleOpenManageColumnsAttInd = (event) => {
        setAnchorElAttInd(event.currentTarget);
        setManageColumnsOpenAttInd(true);
    };
    const handleCloseManageColumnsAttInd = () => {
        setManageColumnsOpenAttInd(false);
        setSearchQueryManageAttInd("");
    };
    const openAttInd = Boolean(anchorElAttInd);
    const idAttInd = openAttInd ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchAttInd, setAnchorElSearchAttInd] = React.useState(null);
    const handleClickSearchAttInd = (event) => {
        setAnchorElSearchAttInd(event.currentTarget);
    };
    const handleCloseSearchAttInd = () => {
        setAnchorElSearchAttInd(null);
        setSearchQueryAttInd("");
    };

    const openSearchAttInd = Boolean(anchorElSearchAttInd);
    const idSearchAttInd = openSearchAttInd ? 'simple-popover' : undefined;

    const timeoptions = [
        { value: "AM", label: "AM" },
        { value: "PM", label: "PM" },
    ]

    const modeOptions = [
        { label: 'Department', value: "Department" },
        { label: "Employee", value: "Employee" },
    ];

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

    const [selectedMode, setSelectedMode] = useState("Today");
    const mode = [
        { label: "Today", value: "Today" },
        // { label: "Tomorrow", value: "Tomorrow" },
        { label: "Yesterday", value: "Yesterday" },
        // { label: "This Week", value: "This Week" },
        // { label: "This Month", value: "This Month" },
        { label: "Last Week", value: "Last Week" },
        { label: "Last Month", value: "Last Month" },
        { label: "Custom", value: "Custom" }
    ]

    // Table row color
    const getRowStyle = (params) => {
        if (params.node.rowIndex % 2 === 0) {
            return { background: '#f0f0f0' }; // Even row
        } else {
            return { background: '#ffffff' }; // Odd row
        }
    }

    // Show All Columns & Manage Columns
    const initialColumnVisibilityAttInd = {
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        department: true,
        empcode: true,
        username: true,
        role: true,
        ipaddress: true,
        shift: true,
        clockin: true,
        clockout: true,
        date: true,
        bookby: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibilityAttInd);

    // pageAttInd refersh reload
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
            pagename: String("Overall Individual Status"),
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
            // case "Tomorrow":
            //     const tomorrow = new Date(today);
            //     tomorrow.setDate(today.getDate() + 1);
            //     fromdate = todate = formatDate(tomorrow);
            //     break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;
            // case "This Week":
            //     const startOfThisWeek = new Date(today);
            //     startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
            //     const endOfThisWeek = new Date(startOfThisWeek);
            //     endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
            //     fromdate = formatDate(startOfThisWeek);
            //     todate = formatDate(endOfThisWeek);
            //     break;
            // case "This Month":
            //     fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
            //     todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
            //     break;
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

    const handleCompanyChange = (options) => {
        setValueCompany(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedCompany(options);
        setValueBranch([]);
        setSelectedBranch([]);
        setSelectedUnit([]);
        setValueUnit("");
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

    //branch multiselect
    const handleBranchChange = (options) => {
        setValueBranch(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedBranch(options);
        setSelectedUnit([]);
        setValueUnit("");
        setSelectedDep([]);
        setValueDep("");
        setSelectedEmp([]);
        setValueEmp("");
    };

    const customValueRendererBranch = (valueBranch, _categoryname) => {
        return valueBranch?.length
            ? valueBranch.map(({ label }) => label)?.join(", ")
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
        setPageName(!pageName)
        try {
            let res_emp = await axios.get(SERVICE.USER_X_EMPLOYEES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEmployees(res_emp?.data?.users);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchEmployee();
    }, [])

    // Employee multiselect
    const handleEmployeeChange = (options) => {
        setValueEmp(options.map(option => option.value))
        setSelectedEmp(options);
    };

    const customValueRendererEmp = (valueEmp, _employees) => {
        return valueEmp.length
            ? valueEmp.map(({ label }) => label).join(", ")
            : "Please Select Employee";
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
        // Remove duplicates based on the 'company' field
        const uniqueIsAssignBranch = accessbranch.reduce((acc, current) => {
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        fetchAttedanceStatus();
    }, [])

    const getattendancestatus = (alldata) => {
        let result = attStatus.filter((data, index) => {
            return data?.clockinstatus === alldata?.clockinstatus && data?.clockoutstatus === alldata?.clockoutstatus
        })

        return result[0]?.name
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
    const [runTime, setRunTime] = useState(0);
    useEffect(() => {
        if (runTime !== 0) {
            fetchTimeDropDown();
        }

    }, [attClockInEdit.timeperiod, attClockInEdit.clinhour])

    const fetchTimeDropDown = async () => {
        setPageName(!pageName)
        try {
            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;

            const parseTime = (timeString) => {
                const [time, period] = timeString?.trim().split("to");

                let fromTimeMeridian = time?.slice(-2);
                let toTimeMeridian = period?.slice(-2);
                const [fromTimeHrs, fromTimeMins] = time?.slice(0, -2).split(":");
                const [toTimeHrs, toTimeMins] = period?.slice(0, -2).split(":");
                return { fromTimeHrs, fromTimeMins, toTimeHrs, toTimeMins, fromTimeMeridian, toTimeMeridian };
            };

            if (attClockInEdit?.shift && attClockInEdit?.shift != "") {
                let timings = parseTime(attClockInEdit?.shift)

                if (dataFromControlPanel[0]?.clockin && dataFromControlPanel[0]?.clockin != "") {
                    let exactHours = Number(timings?.fromTimeHrs) - Number(dataFromControlPanel[0]?.clockin);
                    if (exactHours < 0) {
                        exactHours = 12 + exactHours;

                        let filteredData = hrsOptions.filter((data) => {
                            return Number(data.value) >= exactHours
                        }).filter((item) => item.value != 12)
                        if (timings.fromTimeMeridian != attClockInEdit.timeperiod) {
                            let filteredData2 = hrsOptions.filter((data) => {
                                return Number(data.value) <= Number(timings?.toTimeHrs)
                            }).filter((item) => item.value != 12)
                            setHoursOptionsNew([...filteredData, { value: "12", label: "12" }, ...filteredData2,]);
                        } else {
                            setHoursOptionsNew(hrsOptions);
                        }
                        let filtMins = minutssecOptions.filter((data) => {
                            return Number(data.value) >= Number(timings?.fromTimeMins)
                        })
                        if (attClockInEdit?.clinhour == exactHours) {
                            setMinsOptionsNew(filtMins);
                        } else {
                            setMinsOptionsNew(minutssecOptions)
                        }


                    } else if (exactHours > 0) {
                        exactHours = exactHours
                        let filteredData = hrsOptions.filter((data) => {
                            return Number(data.value) >= exactHours
                        }).filter((item) => item.value != 12)
                        if (timings?.fromTimeMeridian == "AM" && attClockInEdit?.timeperiod == "AM") {
                            setHoursOptionsNew(filteredData);
                        } else if (timings?.fromTimeMeridian == "PM" && attClockInEdit?.timeperiod == "PM") {
                            setHoursOptionsNew(filteredData);
                        } else {
                            let filteredData1 = hrsOptions.filter((data) => {
                                return Number(data.value) <= Number(timings?.toTimeHrs)
                            })
                            setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData1]);
                        }

                        let filtMins = minutssecOptions.filter((data) => {
                            return Number(data.value) >= Number(timings?.fromTimeMins)
                        })

                        if (attClockInEdit?.clinhour == exactHours) {
                            setMinsOptionsNew(filtMins);
                        } else {
                            setMinsOptionsNew(minutssecOptions)
                        }

                    } else {
                        exactHours = 12

                        if (timings.fromTimeMeridian != attClockInEdit.timeperiod) {
                            let filteredData2 = hrsOptions.filter((data) => {
                                return Number(data.value) <= Number(timings?.toTimeHrs)
                            }).filter((item) => item.value != 12)
                            setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData2,]);
                            let filtMins = minutssecOptions.filter((data) => {
                                return Number(data.value) >= Number(timings?.fromTimeMins)
                            })

                            if (attClockInEdit?.clinhour == exactHours) {
                                setMinsOptionsNew(filtMins);
                            } else {
                                setMinsOptionsNew(minutssecOptions)
                            }
                        } else {
                            setHoursOptionsNew(hrsOptions);
                            let filtMins = minutssecOptions.filter((data) => {
                                return Number(data.value) >= Number(timings?.fromTimeMins)
                            })

                            if (attClockInEdit?.clinhour == exactHours) {
                                setMinsOptionsNew(filtMins);
                            } else {
                                setMinsOptionsNew(minutssecOptions)
                            }
                        }

                    }

                }
                else {
                    let timings = parseTime(attClockInEdit?.shift);

                    let filteredData = hrsOptions.filter((data) => {
                        return Number(data.value) >= Number(timings?.fromTimeHrs)
                    }).filter((item) => item.value != 12)

                    if (timings?.fromTimeMeridian == "AM" && attClockInEdit?.timeperiod == "AM") {
                        setHoursOptionsNew(filteredData);
                    } else if (timings?.fromTimeMeridian == "PM" && attClockInEdit?.timeperiod == "PM") {
                        setHoursOptionsNew(filteredData);
                    } else {
                        let filteredData1 = hrsOptions.filter((data) => {
                            return Number(data.value) <= Number(timings?.toTimeHrs)
                        })
                        setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData1]);
                    }

                    let filtMins = minutssecOptions.filter((data) => {
                        return Number(data.value) >= Number(timings?.fromTimeMins)
                    })

                    if (attClockInEdit?.clinhour == attClockInEdit?.clinhour) {
                        setMinsOptionsNew(filtMins);
                    } else {
                        setMinsOptionsNew(minutssecOptions)
                    }
                }
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    useEffect(() => {
        fetchOverAllSettings();
    }, []);

    const fetchFilteredUsersStatus = async () => {
        setPageName(!pageName)
        setUserShifts([]);
        setLoader(true);
        setPageAttInd(1);
        setPageSizeAttInd(10);

        let startMonthDate = new Date(filterUser.fromdate);
        let endMonthDate = new Date(filterUser.todate);

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

            let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                status: String("Approved"),
            });

            let leaveresult = res_applyleave?.data?.applyleaves;

            if (isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("HR")) {

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

                        let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_INDVL_FILTER, {
                            employee: batch.data,
                            userDates: daysArray,
                        }, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            }
                        })
                        // console.log(res?.data?.finaluser[0], 'resd')
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
                            const absentItems = filtered?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

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
                                id: item.id,
                                clockinstatus: updatedClockInStatus,
                                clockoutstatus: updatedClockOutStatus,
                                shiftmode: item.shiftMode,
                                bookby: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
                            };
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
                    const finalresult = results.allResults?.filter((data, index) => {
                        return data.shift != "Week Off"
                    })
                    let outputdata = finalresult.map((item, index) => ({ ...item, serialNumber: index + 1 }))
                    setUserShifts(outputdata);
                    setFilteredDataItems(outputdata);
                    setLoader(false);
                    setSearchQueryAttInd("");
                    setTotalPagesAttInd(Math.ceil(outputdata.length / pageSizeAttInd));
                }).catch(error => {
                    setLoader(true);
                    console.error('Error in getting all results:', error);
                });
            }
            else {

                let res_emp = await axios.post(SERVICE.USER_FOR_ALL_ATTENDANCE_PAGE_ACCESSBRANCHWISELIST, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
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

                        let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_INDVL_FILTER, {
                            employee: batch.data,
                            userDates: daysArray,
                        }, {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            }
                        })
                        // console.log(res?.data?.finaluser[0], 'resd')
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
                            const absentItems = filtered?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

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
                                id: item.id,
                                clockinstatus: updatedClockInStatus,
                                clockoutstatus: updatedClockOutStatus,
                                shiftmode: item.shiftMode,
                                bookby: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
                            };
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
                    const finalresult = results.allResults?.filter((data, index) => {
                        return data.shift != "Week Off"
                    })
                    let outputdata = finalresult.map((item, index) => ({ ...item, serialNumber: index + 1 }))
                    setUserShifts(outputdata);
                    setFilteredDataItems(outputdata);
                    setLoader(false);
                    setSearchQueryAttInd("");
                    setTotalPagesAttInd(Math.ceil(outputdata.length / pageSizeAttInd));
                }).catch(error => {
                    setLoader(true);
                    console.error('Error in getting all results:', error);
                });
            }

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };

    // changed code
    const getCodeClockIn = async (rowdata) => {

        hoursOptions = [];
        setHoursOptions([]);
        setAallHoursOptions([]);
        setDateOptions([]);
        try {
            if (rowdata?.clockin != "00:00:00") {
                let res = await axios.post(SERVICE.INDUSERSLOGINOUT, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    date: moment(rowdata.date, "DD/MM/YYYY").format("DD-MM-YYYY"),
                    userid: String(rowdata.userid),
                });

                [res?.data?.attandances]?.filter((d) => {
                    if (d.userid === rowdata.userid && d.date === moment(rowdata.date, "DD/MM/YYYY").format("DD-MM-YYYY") && d.shiftmode === rowdata.shiftMode) {

                        setGetAttIdClockIn(d._id);
                    }
                })
            }


            handleClickOpenEditClkIn();

            const [clockin, timeperiod] = rowdata.clockin.split(' ');
            let sdate = rowdata?.shift?.split('to');

            const currentHourParts = sdate[0].split(':');
            const endHourParts = sdate[1].split(':');
            const finalshifthourstart = currentHourParts[0] - attSeetings?.clockin;
            const finalshifthourend = Number(endHourParts[0]) + Number(attSeetings?.clockout);

            //include attendance settings hours
            const [timeStr, meridiem] = sdate[0].split(/[AP]M/);
            const [sthours, stminutes] = timeStr.split(':').map(Number);

            let totalHours = sthours;
            if (meridiem === 'PM' && sthours !== 12) {
                totalHours += 12;
            }

            totalHours -= attSeetings?.clockin;

            let newHours = totalHours % 12;
            if (newHours === 0) {
                newHours = 12;
            }
            const newMeridiem = totalHours < 12 ? 'AM' : 'PM';

            const newTime = `${String(newHours).padStart(2, '0')}:${String(stminutes).padStart(2, '0')}${newMeridiem}`;

            const [endtimeStr, endmeridiem] = sdate[1].split(/[AP]M/);
            const [endsthours, endstminutes] = endtimeStr.split(':').map(Number);

            let endtotalHours = endsthours;
            if (endmeridiem === 'PM' && endsthours !== 12) {
                endtotalHours += 12;
            }

            endtotalHours += attSeetings?.clockout;

            let endnewHours = endtotalHours % 12;
            if (endnewHours === 0) {
                endnewHours = 12;
            }
            const endnewMeridiem = endtotalHours < 12 ? 'AM' : 'PM';

            const endnewTime = `${String(endnewHours).padStart(2, '0')}:${String(endstminutes).padStart(2, '0')}${endnewMeridiem}`;

            let startHour = parseInt(finalshifthourstart);
            const startAmPm = sdate[0].includes('PM') ? 'PM' : 'AM';

            let endHourValue = parseInt(finalshifthourend);
            const endAmPm = sdate[1].includes('PM') ? 'PM' : 'AM';

            if (startAmPm === 'PM' && startHour !== 12) {
                startHour += 12;
            } else if (startAmPm === 'AM' && startHour === 12) {
                startHour = 0;
            }

            if (endAmPm === 'PM' && endHourValue !== 12) {
                endHourValue += 12;
            } else if (endAmPm === 'AM' && endHourValue === 12) {
                endHourValue = 0;
            }

            if (startHour <= endHourValue) {
                for (let h = startHour; h <= endHourValue; h++) {
                    const formattedHour = `${h % 12 || 12}`;
                    const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
                    hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
                }
            } else {
                for (let h = startHour; h <= 23; h++) {
                    const formattedHour = `${h % 12 || 12}`;
                    const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
                    hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
                }

                for (let h = 0; h <= endHourValue; h++) {
                    const formattedHour = `${h % 12 || 12}`;
                    const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
                    hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
                }
            }

            setAallHoursOptions(hoursOptions)
            let fdate = rowdata.date.split(" ");

            if (sdate[0]?.includes("PM") && sdate[1]?.includes("AM")) {
                // Increment date by 1 day
                const nextDate = moment(rowdata.date, "DD/MM/YYYY").add(1, 'days').format("DD/MM/YYYY");
                setDateOptions([fdate[0], nextDate]);
            } else {

                setDateOptions([fdate[0]])
            }

            let resshift = rowdata?.clockin?.split(':');

            let changeresshift = resshift[2].split(" ")


            let newobj = {
                userid: rowdata.userid,
                username: rowdata.username,
                rowusername: rowdata.rowusername,
                empcode: rowdata.empcode,
                predate: fdate[0],
                date: fdate[0],
                shift: rowdata.shift,
                shiftendtime: sdate[1] ? sdate[1] : "",
                shiftname: rowdata.shift ? rowdata.shift : "",
                shiftmode: rowdata.shiftMode,
                clockin: clockin,
                clinhour: resshift[0] ? resshift[0] + " " + (resshift[2] && resshift[2].split(" ")[1] && resshift[2].split(" ")[1] != "undefined" && resshift[2].split(" ")[1] != undefined ? resshift[2].split(" ")[1] : "") : "00",
                clinminute: resshift[1] ? resshift[1] : "00",
                clinseconds: resshift[2].includes(" ") ? changeresshift[0] : "00",
                timeperiod: resshift[2] && resshift[2].split(" ")[1] && resshift[2].split(" ")[1] != "undefined" && resshift[2].split(" ")[1] != undefined ? resshift[2].split(" ")[1] : "",
                clockinstatus: rowdata.clockinstatus
            }

            if (sdate[0]?.includes("PM") && sdate[1]?.includes("AM")) {
                const result = hoursOptions.filter((data, index) => {
                    return data.formattedtime != "AM"
                });
                setHoursOptions(result.map((t) => ({
                    label: t.formattedHour,
                    value: t.formattedtime,
                })));
            } else {
                setHoursOptions(hoursOptions.map((t) => ({
                    label: t.formattedHour,
                    value: t.formattedtime,
                })));
            }
            setAttClockInEdit(newobj);

            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            function generateTimeSlots(startTime, endTime) {
                // Helper function to convert 12-hour time format to 24-hour format
                function convertTo24Hour(time) {
                    const [timePart, period] = [time.slice(0, -2).trim(), time.slice(-2)];
                    let [hours, minutes] = timePart.split(':').map(Number);
                    if (period === 'PM' && hours !== 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;
                    return { hours, minutes };
                }

                // Helper function to format time in the desired 12-hour format (e.g., "06 AM")
                function formatTime(hours) {
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const h = hours % 12 || 12;
                    return `${String(h).padStart(2, '0')} ${period}`;
                }

                // Convert times to 24-hour format
                const start = convertTo24Hour(startTime);
                const end = convertTo24Hour(endTime);

                // Generate time slots
                let slots = [];
                let currentHour = start.hours;

                // Loop to generate time slots from start time to end time
                while (true) {
                    slots.push(formatTime(currentHour));
                    currentHour = (currentHour + 1) % 24;
                    if (currentHour === (end.hours % 24)) break;
                }

                // Include the end time as the last slot
                slots.push(formatTime(end.hours));

                return slots;
            }

            function adjustShiftTime(shift, criteria) {
                const clockin = parseInt(criteria, 10); // e.g., 2

                // Extract the start and end times from the shift string
                const [startTime, endTime] = shift.split("to");

                // Function to convert 12-hour time format to minutes
                function timeToMinutes(time) {
                    let [hours, minutes] = time.match(/\d{1,2}/g).map(Number);
                    const isPM = time.includes("PM");

                    if (isPM && hours !== 12) hours += 12;
                    if (!isPM && hours === 12) hours = 0;

                    return hours * 60 + minutes;
                }

                // Function to convert minutes back to 12-hour time format
                function minutesToTime(minutes) {
                    let hours = Math.floor(minutes / 60) % 24;
                    let minutesPart = minutes % 60;
                    let isPM = hours >= 12;

                    if (hours >= 12) {
                        if (hours > 12) hours -= 12; // Convert 13 to 12-hour format (e.g., 13 to 1 PM)
                    } else if (hours === 0) {
                        hours = 12; // Midnight case (00:00 to 12:00 AM)
                    }

                    if (hours === 12) {
                        isPM = !isPM;
                    }

                    return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}${isPM ? "PM" : "AM"}`;
                }

                // Convert start time to minutes and subtract clockin hours
                let newStartTimeMinutes = timeToMinutes(startTime) - (clockin * 60);

                // Adjust for rolling over midnight
                if (newStartTimeMinutes < 0) {
                    newStartTimeMinutes += 24 * 60;
                }

                // Convert the adjusted time back to 12-hour format
                const newStartTime = minutesToTime(newStartTimeMinutes);
                // Create a new shift with the adjusted start time and unchanged end time
                const newShift = `${newStartTime}to${endTime}`;
                return { shift: newShift };
            }


            let newobjshift = newobj.shift
            let criteria = dataFromControlPanel[0]?.clockin ? dataFromControlPanel[0]?.clockin : 0;

            let newobjresult = adjustShiftTime(newobjshift, criteria);
            const startTime1 = newobjresult.shift.split("to")[0];
            const endTime1 = newobj.shift.split("to")[1];
            let hoursval = generateTimeSlots(startTime1, endTime1);



            let finalhrs = hoursval.map(item => ({
                ...item,
                label: item,
                value: item
            }))
            setHoursOptionsConvert(finalhrs)
            const parseTime = (timeString) => {
                const [time, period] = timeString.trim().split("to");

                let fromTimeMeridian = time.slice(-2);
                let toTimeMeridian = period.slice(-2);
                const [fromTimeHrs, fromTimeMins] = time.slice(0, -2).split(":");
                const [toTimeHrs, toTimeMins] = period.slice(0, -2).split(":");
                return { fromTimeHrs, fromTimeMins, toTimeHrs, toTimeMins, fromTimeMeridian, toTimeMeridian };
            };

            let timings = parseTime(newobj.shift)
            if (dataFromControlPanel[0]?.clockin && dataFromControlPanel[0]?.clockin != "") {
                let exactHours = Number(timings?.fromTimeHrs) - Number(dataFromControlPanel[0]?.clockin);
                if (exactHours < 0) {
                    exactHours = 12 + exactHours;

                    let filteredData = hrsOptions.filter((data) => {
                        return Number(data.value) >= exactHours
                    }).filter((item) => item.value != 12)
                    if (timings.fromTimeMeridian != attClockInEdit.timeperiod) {
                        let filteredData2 = hrsOptions.filter((data) => {
                            return Number(data.value) <= Number(timings?.toTimeHrs)
                        }).filter((item) => item.value != 12)
                        setHoursOptionsNew([...filteredData, { value: "12", label: "12" }, ...filteredData2,]);
                    } else {
                        setHoursOptionsNew(hrsOptions);
                    }
                    let filtMins = minutssecOptions.filter((data) => {
                        return Number(data.value) >= Number(timings?.fromTimeMins)
                    })

                    if (attClockInEdit?.clinhour == exactHours) {
                        setMinsOptionsNew(filtMins);
                    } else {
                        setMinsOptionsNew(minutssecOptions)
                    }


                } else if (exactHours > 0) {
                    exactHours = exactHours
                    let filteredData = hrsOptions.filter((data) => {
                        return Number(data.value) >= exactHours
                    }).filter((item) => item.value != 12)
                    if (timings?.fromTimeMeridian == "AM" && attClockInEdit?.timeperiod == "AM") {
                        setHoursOptionsNew(filteredData);
                    } else if (timings?.fromTimeMeridian == "PM" && attClockInEdit?.timeperiod == "PM") {
                        setHoursOptionsNew(filteredData);
                    } else {
                        let filteredData1 = hrsOptions.filter((data) => {
                            return Number(data.value) <= Number(timings?.toTimeHrs)
                        })
                        setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData1]);
                    }

                    let filtMins = minutssecOptions.filter((data) => {
                        return Number(data.value) >= Number(timings?.fromTimeMins)
                    })

                    if (attClockInEdit?.clinhour == exactHours) {
                        setMinsOptionsNew(filtMins);
                    } else {
                        setMinsOptionsNew(minutssecOptions)
                    }

                } else {
                    exactHours = 12

                    if (timings.fromTimeMeridian != attClockInEdit.timeperiod) {
                        let filteredData2 = hrsOptions.filter((data) => {
                            return Number(data.value) <= Number(timings?.toTimeHrs)
                        }).filter((item) => item.value != 12)
                        setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData2,]);
                        let filtMins = minutssecOptions.filter((data) => {
                            return Number(data.value) >= Number(timings?.fromTimeMins)
                        })

                        if (attClockInEdit?.clinhour == exactHours) {
                            setMinsOptionsNew(filtMins);
                        } else {
                            setMinsOptionsNew(minutssecOptions)
                        }
                    } else {
                        setHoursOptionsNew(hrsOptions);
                        let filtMins = minutssecOptions.filter((data) => {
                            return Number(data.value) >= Number(timings?.fromTimeMins)
                        })

                        if (attClockInEdit?.clinhour == exactHours) {
                            setMinsOptionsNew(filtMins);
                        } else {
                            setMinsOptionsNew(minutssecOptions)
                        }
                    }

                }

            }
            else {
                let timings = parseTime(attClockInEdit?.shift);

                let filteredData = hrsOptions.filter((data) => {
                    return Number(data.value) >= Number(timings?.fromTimeHrs)
                }).filter((item) => item.value != 12)
                if (timings?.fromTimeMeridian == "AM" && attClockInEdit?.timeperiod == "AM") {
                    setHoursOptionsNew(filteredData);
                } else if (timings?.fromTimeMeridian == "PM" && attClockInEdit?.timeperiod == "PM") {
                    setHoursOptionsNew(filteredData);
                } else {
                    let filteredData1 = hrsOptions.filter((data) => {
                        return Number(data.value) <= Number(timings?.toTimeHrs)
                    })
                    setHoursOptionsNew([{ value: "12", label: "12" }, ...filteredData1]);
                }

                let filtMins = minutssecOptions.filter((data) => {
                    return Number(data.value) >= Number(timings?.fromTimeMins)
                })

                if (attClockInEdit?.clinhour == attClockInEdit?.clinhour) {
                    setMinsOptionsNew(filtMins);
                } else {
                    setMinsOptionsNew(minutssecOptions)
                }
            }
            setRunTime(1);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const sendRequestClockIn = async () => {
        setPageName(!pageName)
        try {
            const response = await axios.get("https://api.ipify.org?format=json");
            if (getAttIdClockIn) {
                await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getAttIdClockIn}`, {
                    // clockintime: String(attClockInEdit.clinhour + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds + ' ' + attClockInEdit.timeperiod),
                    clockintime: String(attClockInEdit.clinhour.split(" ")[0] + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds + ' ' + attClockInEdit.clinhour.split(" ")[1]),

                    attandancemanual: Boolean(true),
                    clockinipaddress: String(response?.data?.ip),
                    shiftmode: String(attClockInEdit.shiftmode),

                }, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            }
            else {
                await axios.post(`${SERVICE.ATTENDANCE_CLOCKIN_CREATE}`, {
                    shiftendtime: String(attClockInEdit.shiftendtime),
                    shiftname: String(attClockInEdit.shiftname),
                    username: String(attClockInEdit.rowusername),
                    userid: String(attClockInEdit.userid),
                    // clockintime: String(attClockInEdit.clinhour + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds + ' ' + attClockInEdit.timeperiod),
                    clockintime: String(attClockInEdit.clinhour.split(" ")[0] + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds + ' ' + attClockInEdit.clinhour.split(" ")[1]),

                    date: String(moment(attClockInEdit.date, "DD/MM/YYYY").format("DD-MM-YYYY")),
                    clockinipaddress: String(response?.data?.ip),
                    status: true,
                    clockouttime: "",
                    buttonstatus: "true",
                    autoclockout: Boolean(false),
                    attandancemanual: Boolean(true),
                    shiftmode: String(attClockInEdit.shiftmode),
                }, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });


            }
            // await fetchUsersStatus();
            await fetchFilteredUsersStatus();
            handleCloseEditClkIn();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchOverAllSettings = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            setAttSettings(res?.data?.attendancecontrolcriteria[
                res?.data?.attendancecontrolcriteria?.length - 1
            ])
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const getRemoveAttout = async (clockout, date, userid) => {

        if (clockout === "00:00:00") {
            setPopupContentMalert("Please Give ClockOut Then Only Remove!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            let res = await axios.post(SERVICE.INDUSERSLOGINOUT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: moment(date, "DD/MM/YYYY").format("DD-MM-YYYY"),
                userid: String(userid),
            });
            [res?.data?.attandances]?.filter((d) => {
                if (d.userid === userid && d.date === moment(date, "DD/MM/YYYY").format("DD-MM-YYYY")) {
                    setRemoveId(d._id);
                }
            })
            handleOutClickOpen();
        }
    }

    //changed code
    const getCodeClockOut = async (rowdata) => {
        hoursOptions = [];
        setHoursOptions([]);
        setAallHoursOptions([]);
        setDateOptions([]);
        try {
            let res = await axios.post(SERVICE.INDUSERSLOGINOUT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: moment(rowdata.date, "DD/MM/YYYY").format("DD-MM-YYYY"),
                userid: String(rowdata.userid),
            });

            [res?.data?.attandances]?.filter((d) => {
                if (d.userid === rowdata.userid && d.date === moment(rowdata.date, "DD/MM/YYYY").format("DD-MM-YYYY") && d.shiftmode === rowdata.shiftMode) {
                    setGetAttIdClockOut(d._id);
                }
            })

            handleClickOpenEditClkOut();
            const [clockin, timeperiodClkIn] = rowdata.clockin.split(' ');
            let clockinfulltime = rowdata.clockin
            const [clockout, timeperiod] = rowdata.clockout.split(' ');
            let sdate = rowdata?.shift?.split('to');

            const currentHourParts = sdate[0].split(':');
            const endHourParts = sdate[1].split(':');
            const finalshifthourstart = currentHourParts[0] - attSeetings?.clockin;
            const finalshifthourend = Number(endHourParts[0]) + Number(attSeetings?.clockout);

            let startHour = parseInt(finalshifthourstart);
            const startAmPm = sdate[0].includes('PM') ? 'PM' : 'AM';

            let endHourValue = parseInt(finalshifthourend);
            const endAmPm = sdate[1].includes('PM') ? 'PM' : 'AM';

            if (startAmPm === 'PM' && startHour !== 12) {
                startHour += 12;
            } else if (startAmPm === 'AM' && startHour === 12) {
                startHour = 0;
            }

            if (endAmPm === 'PM' && endHourValue !== 12) {
                endHourValue += 12;
            } else if (endAmPm === 'AM' && endHourValue === 12) {
                endHourValue = 0;
            }

            if (startHour <= endHourValue) {
                for (let h = startHour; h <= endHourValue; h++) {
                    const formattedHour = `${h % 12 || 12}`;
                    const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
                    hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
                }
            } else {
                for (let h = startHour; h <= 23; h++) {
                    const formattedHour = `${h % 12 || 12}`;
                    const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
                    hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
                }

                for (let h = 0; h <= endHourValue; h++) {
                    const formattedHour = `${h % 12 || 12}`;
                    const formattedtime = `${h < 12 ? 'AM' : 'PM'}`;
                    hoursOptions.push({ formattedHour: formattedHour >= 10 ? formattedHour : '0' + formattedHour, formattedtime: formattedtime });
                }
            }

            let fdate = rowdata.date.split(" ");
            if (sdate[0]?.includes("PM") && sdate[1]?.includes("AM")) {
                // Increment date by 1 day
                const nextDate = moment(rowdata.date, "DD/MM/YYYY").add(1, 'days').format("DD/MM/YYYY");
                const previousDate = moment(rowdata.date, "DD/MM/YYYY").subtract(1, 'days').format("DD/MM/YYYY");
                setDateOptions([previousDate, fdate[0], nextDate]);
            } else {
                const nextDate = moment(rowdata.date, "DD/MM/YYYY").add(1, 'days').format("DD/MM/YYYY");
                const previousDate = moment(rowdata.date, "DD/MM/YYYY").subtract(1, 'days').format("DD/MM/YYYY");
                setDateOptions([fdate[0], nextDate])
            }

            setAallHoursOptions(hoursOptions)

            let resshift = rowdata?.clockout?.split(':');
            let changeresshift = resshift[2].split(" ")

            let newobj = {
                userid: rowdata.userid,
                username: rowdata.username,
                rowusername: rowdata.rowusername,
                empcode: rowdata.empcode,
                date: fdate[0],
                predate: fdate[0],
                shift: rowdata.shift,
                shiftendtime: sdate[1] ? sdate[1] : "",
                shiftname: rowdata.shift ? rowdata.shift : "",
                shiftmode: rowdata.shiftMode,
                clockin: clockin,
                // clockinfulltime: clockinfulltime,
                clouthour: resshift[0] ? resshift[0] + " " + (resshift[2] && resshift[2].split(" ")[1] && resshift[2].split(" ")[1] != "undefined" && resshift[2].split(" ")[1] != undefined ? resshift[2].split(" ")[1] : "") : "00",
                cloutminute: resshift[1] ? resshift[1] : "00",
                cloutseconds: resshift[2].includes(" ") ? changeresshift[0] : "00",
                clockout: clockout,
                timeperiod: resshift[2] && resshift[2].split(" ")[1] && resshift[2].split(" ")[1] != "undefined" && resshift[2].split(" ")[1] != undefined ? resshift[2].split(" ")[1] : "",
                clockoutstatus: rowdata.clockoutstatus
            }
            if (sdate[0]?.includes("PM") && sdate[1]?.includes("AM")) {
                const result = hoursOptions.filter((data, index) => {
                    return data.formattedtime != "PM"
                });
                setHoursOptions(result.map((t) => ({
                    label: t.formattedHour,
                    value: t.formattedtime,
                })));
            } else {
                setHoursOptions(hoursOptions.map((t) => ({
                    label: t.formattedHour,
                    value: t.formattedtime,
                })));
            }
            setAttClockOutEdit(newobj);



            let res1 = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA);
            let dataFromControlPanel = res1?.data?.attendancecontrolcriteria;


            // function generateTimeSlots(startTime, endTime) {
            //     function convertTo24Hour(time) {
            //         const [timePart, period] = [time.slice(0, -2), time.slice(-2)];
            //         let [hours, minutes] = timePart.split(':').map(Number);
            //         if (period === 'PM' && hours !== 12) hours += 12;
            //         if (period === 'AM' && hours === 12) hours = 0;
            //         return hours;
            //     }

            //     function formatTime(hours) {
            //         const period = hours >= 12 ? 'PM' : 'AM';
            //         const h = hours % 12 || 12;
            //         return `${String(h).padStart(2, '0')} ${period}`;
            //     }

            //     const start = convertTo24Hour(startTime);
            //     const end = convertTo24Hour(endTime);

            //     let slots = [];
            //     let currentHour = end;

            //     // Loop to generate time slots from end time until start time the next day
            //     while (true) {
            //         slots.push(formatTime(currentHour));
            //         if (currentHour === start) break;
            //         currentHour = (currentHour + 1) % 24;
            //     }

            //     return slots;
            // }


            // function adjustShiftTime(shift, criteria) {
            //     const clockin = parseInt(criteria, 10); // e.g., 2
            //     const [startTime, endTime] = shift.split("to");

            //     function timeToMinutes(time) {
            //         let [hours, minutes] = time.match(/\d{1,2}/g).map(Number);
            //         const isPM = time.includes("PM");

            //         if (isPM && hours !== 12) hours += 12;
            //         if (!isPM && hours === 12) hours = 0;

            //         return hours * 60 + minutes;
            //     }

            //     function minutesToTime(minutes) {
            //         let hours = Math.floor(minutes / 60) % 24;
            //         let minutesPart = minutes % 60;
            //         let isPM = hours >= 12;

            //         if (hours >= 12) {
            //             if (hours > 12) hours -= 12; 
            //         } else if (hours === 0) {
            //             hours = 12; 
            //         }

            //         if (hours === 12) {
            //             isPM = !isPM;
            //         }

            //         return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}${isPM ? "PM" : "AM"}`;
            //     }

            //     let newStartTimeMinutes = timeToMinutes(endTime) + (clockin * 60);
            //     if (newStartTimeMinutes >= 24 * 60) {
            //         newStartTimeMinutes -= 24 * 60;
            //     }

            //     const newStartTime = minutesToTime(newStartTimeMinutes);

            //     return { shift: `${newStartTime}to${startTime}` };

            // }

            function generateTimeSlots(startTime, endTime) {
                // Helper function to convert 12-hour time format to 24-hour format
                function convertTo24Hour(time) {
                    const [timePart, period] = [time.slice(0, -2).trim(), time.slice(-2)];
                    let [hours, minutes] = timePart.split(':').map(Number);
                    if (period === 'PM' && hours !== 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;
                    return { hours, minutes };
                }

                // Helper function to format time in the desired 12-hour format (e.g., "06 AM")
                function formatTime(hours) {
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const h = hours % 12 || 12;
                    return `${String(h).padStart(2, '0')} ${period}`;
                }

                // Convert times to 24-hour format
                const start = convertTo24Hour(startTime);
                const end = convertTo24Hour(endTime);

                // Generate time slots
                let slots = [];
                let currentHour = start.hours;

                // Loop to generate time slots from start time to end time
                while (true) {
                    slots.push(formatTime(currentHour));
                    currentHour = (currentHour + 1) % 24;
                    if (currentHour === (end.hours % 24)) break;
                }

                // Include the end time as the last slot
                slots.push(formatTime(end.hours));

                return slots;
            }


            let clockintime = rowdata.clockin;

            let endtime = newobj.shift.split('to')[0];
            let formattedClockinTime = clockintime.split(':')[0] + ":" + clockintime.split(':')[1] + clockintime.split(' ')[1]; // "11:02AM"


            function adjustShiftTime(shift, criteria) {
                const clockin = parseInt(criteria, 10); // e.g., 2

                // Extract the start and end times from the shift string
                const [startTime, endTime] = shift.split("to");

                // Function to convert 12-hour time format to minutes
                function timeToMinutes(time) {
                    let [hours, minutes] = time.match(/\d{1,2}/g).map(Number);
                    const isPM = time.includes("PM");

                    if (isPM && hours !== 12) hours += 12;
                    if (!isPM && hours === 12) hours = 0;

                    return hours * 60 + minutes;
                }

                // Function to convert minutes back to 12-hour time format
                function minutesToTime(minutes) {
                    let hours = Math.floor(minutes / 60) % 24;
                    let minutesPart = minutes % 60;
                    let isPM = hours >= 12;

                    if (hours >= 12) {
                        if (hours > 12) hours -= 12; // Convert 13 to 12-hour format (e.g., 13 to 1 PM)
                    } else if (hours === 0) {
                        hours = 12; // Midnight case (00:00 to 12:00 AM)
                    }

                    if (hours === 12) {
                        isPM = !isPM;
                    }

                    return `${String(hours).padStart(2, "0")}:${String(minutesPart).padStart(2, "0")}${isPM ? "PM" : "AM"}`;
                }

                // Convert start time to minutes and subtract clockin hours
                let newStartTimeMinutes = timeToMinutes(endTime) + (clockin * 60);

                // Adjust for rolling over midnight
                if (newStartTimeMinutes < 0) {
                    newStartTimeMinutes += 24 * 60;
                }

                // Convert the adjusted time back to 12-hour format
                const newStartTime = minutesToTime(newStartTimeMinutes);
                // Create a new shift with the adjusted start time and unchanged end time
                const newShift = `${formattedClockinTime}to${newStartTime}`;
                return { shift: newShift };
            }

            // let newobjshift = `${formattedClockinTime}to${endtime}`;
            let newobjshift = newobj.shift;

            let criteria = dataFromControlPanel[0]?.clockout ? dataFromControlPanel[0]?.clockout : 0;

            let newobjresult = adjustShiftTime(newobjshift, criteria);
            const startTime1 = newobjresult.shift.split("to")[0];
            const endTime1 = newobjresult.shift.split("to")[1];
            let hoursval = generateTimeSlots(startTime1, endTime1);

            let finalhrs = hoursval.map(item => ({
                ...item,
                label: item,
                value: item
            }))
            setHoursOptionsConvertClockout(finalhrs)

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const sendRequestClockOut = async () => {
        setPageName(!pageName)
        console.log(getAttIdClockOut, 'getAttIdClockOut')
        console.log(attClockOutEdit.clouthour.split(" ")[0] + ':' + attClockOutEdit.cloutminute + ':' + attClockOutEdit.cloutseconds + ' ' + attClockOutEdit.clouthour.split(" ")[1], 'clout')
        try {
            const response = await axios.get("https://api.ipify.org?format=json");
            let req = await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${getAttIdClockOut}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                // clockouttime: String(attClockOutEdit.clouthour + ':' + attClockOutEdit.cloutminute + ':' + attClockOutEdit.cloutseconds + ' ' + attClockOutEdit.timeperiod),
                clockouttime: String(attClockOutEdit.clouthour.split(" ")[0] + ':' + attClockOutEdit.cloutminute + ':' + attClockOutEdit.cloutseconds + ' ' + attClockOutEdit.clouthour.split(" ")[1]),
                clockoutipaddress: String(response?.data?.ip),
                buttonstatus: "false",
                autoclockout: Boolean(false),
                attandancemanual: Boolean(true),
                shiftmode: String(attClockOutEdit.shiftmode),
            })
            // await fetchUsersStatus();
            await fetchFilteredUsersStatus();
            handleCloseEditClkOut();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const removeCloinout = async () => {
        setAttClockInEdit({ ...attClockInEdit, clinhour: "00", clinminute: "00", clinseconds: "00" })
        setRemoveHide(false);
        try {
            let req = await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${removeId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                clockintime: String("00:00:00"),
                buttonstatus: "false",
                attandancemanual: Boolean(true),
            })

            //    await fetchUsersStatus();
            await fetchFilteredUsersStatus();
            handleCloseMod();
            handleCloseEditClkIn();
            setPopupContent("Removed Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setRemoveHide(true);
        } catch (err) { setRemoveHide(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const removeCloout = async () => {
        setAttClockOutEdit({ ...attClockOutEdit, clouthour: "00", cloutminute: "00", cloutseconds: "00" })
        setRemoveHide(false);
        try {
            let req = await axios.put(`${SERVICE.ATTENDANCE_CLOCKIN_SINGLE}/${removeId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                clockouttime: String("00:00:00"),
                buttonstatus: "true",
                clockoutipaddress: String(""),
                attandancemanual: Boolean(false),
                autoclockout: Boolean(false),
            })

            // await fetchUsersStatus();
            await fetchFilteredUsersStatus();
            handleOutCloseMod();
            handleCloseEditClkOut();
            setPopupContent("Removed Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setRemoveHide(true);
        } catch (err) { setRemoveHide(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const handleSubmitClkOutUpdate = () => {
        if (attClockOutEdit.clockin == '00:00:00') {
            setPopupContentMalert("Please Update ClockIn Time");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequestClockOut();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("HR")) {
            if (filterUser.mode === 'Please Select Mode') {
                setPopupContentMalert("Please Select Mode");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (selectedCompany.length === 0) {
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
            else if (filterUser.mode === 'Department' && selectedDep.length === 0) {
                setPopupContentMalert("Please Select Department");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else if (filterUser.mode === 'Employee' && selectedEmp.length === 0) {
                setPopupContentMalert("Please Select Employee");
                setPopupSeverityMalert("warning");
                handleClickOpenPopupMalert();
            }
            else {
                setLoader(false);
                fetchFilteredUsersStatus();
            }
        }
        else {
            setLoader(false);
            fetchFilteredUsersStatus();
        }

    };

    const handleClear = (e) => {
        e.preventDefault();
        // setLoader(true);
        setUserShifts([]);
        setFilterUser({ mode: 'Please Select Mode', fromdate: today, todate: today, });
        setSelectedMode("Today");
        setSelectedCompany([]);
        setValueCompany([]);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit("");
        setSelectedDep([]);
        setValueDep("");
        setSelectedEmp([]);
        setValueEmp("");
        setPageAttInd(1);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
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
        if (gridRefTableAttInd.current) {
            const gridApi = gridRefTableAttInd.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesAttInd = gridApi.paginationGetTotalPages();
            setPageAttInd(currentPage);
            setTotalPagesAttInd(totalPagesAttInd);
        }
    }, []);

    const columnDataTableAttInd = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibility.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 150, hide: !columnVisibility.empcode, pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibility.username, pinned: 'left', lockPinned: true, },
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibility.company, },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibility.branch, },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibility.unit, },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibility.department, },
        { field: "role", headerName: "Role", flex: 0, width: 120, hide: !columnVisibility.role, },
        { field: "bookby", headerName: "Book By", flex: 0, width: 120, hide: !columnVisibility.bookby, },
        { field: "ipaddress", headerName: "IP Address", flex: 0, width: 150, hide: !columnVisibility.ipaddress, },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibility.date, },
        { field: "shift", headerName: "Shift", flex: 0, width: 150, hide: !columnVisibility.shift, },
        {
            field: "clockin", headerName: "ClockIn", flex: 0, width: 150, hide: !columnVisibility.clockin,
            cellRenderer: (params) =>
                <Chip
                    label={params.data.clockin}
                />
        },
        {
            field: "clockout", headerName: "ClockOut", flex: 0, width: 150, hide: !columnVisibility.clockout,
            cellRenderer: (params) =>
                <>
                    {(params?.data?.clockoutstatus === "Auto Mis - ClockOut") ?

                        <>
                            <Chip
                                sx={{ height: "25px", borderRadius: "0px" }}
                                color={"warning"}
                                variant="contained"
                                label={"MisClockOut"}
                            />
                            <Chip
                                label={params.data.clockout}
                            />
                        </> :
                        <Chip
                            label={params.data.clockout}
                        />
                    }

                </>
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 300,
            minHeight: "40px !important",
            sortable: false,
            filter: false,
            hide: !columnVisibility.actions,

            cellRenderer: (params) =>
                <Grid sx={{ display: "flex", alignItems: "center", }}>
                    <>
                        <Button sx={userStyle.buttonedit} disabled={!params.data.attendancemode?.includes("Hrms-Manual")}
                            // disabled={(params.data.clockin === "00:00:00" || params.data.ipaddress === "")}
                            variant="contained" onClick={() => { getCodeClockIn(params.data); }}  >
                            Clock In
                        </Button>
                        &ensp;
                        {(params.data.clockin !== "00:00:00" || params.data.ipaddress !== "") ?
                            <Button disabled={!params.data.attendancemode?.includes("Hrms-Manual")} sx={userStyle.buttonedit} variant="contained" onClick={() => { getCodeClockOut(params.data); }}  >
                                Clock Out
                            </Button>
                            :
                            <Chip
                                sx={{ height: "25px", borderRadius: "0px" }}
                                color={"warning"}
                                variant="outlined"
                                label={"No Clock-In"}
                            />
                        }
                    </>
                </Grid>,
        },
    ];

    //Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryAttInd(value);
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
        setPageAttInd(1);
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
        // handleCloseSearchAttInd(); // Close the popover after search
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryAttInd("");
        setFilteredDataItems(userShifts);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableAttInd.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryAttInd;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPagesAttInd) {
            setPageAttInd(newPage);
            gridRefTableAttInd.current.api.paginationGoToPage(newPage - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeAttInd(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibility };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibility(updatedVisibility);
    };

    // Function to filter columns based on search query
    const filteredColumns = columnDataTableAttInd.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageAttInd.toLowerCase())
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

        setColumnVisibility((prevVisibility) => {
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

        setColumnVisibility((prevVisibility) => {
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
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState("");
    let exportColumnNamescrt = ["Company", "Branch", "Unit", "Department", "Emp Code", "Employee Name", "Role", "Book By", "IP Address", "Date", "Shift", "ClockIn", "ClockOut",]
    let exportRowValuescrt = ["company", "branch", "unit", "department", "empcode", "username", "role", "bookby", "ipaddress", "date", "shift", "clockin", "clockout",]

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Attendance Individual List",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageAttInd.current) {
            domtoimage.toBlob(gridRefImageAttInd.current)
                .then((blob) => {
                    saveAs(blob, "Attendance Individual List.png");
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

        const startPage = Math.max(1, pageAttInd - 1);
        const endPage = Math.min(totalPagesAttInd, startPage + maxVisiblePages - 1);

        // Loop through and add visible pageAttInd numbers
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // If there are more pages after the last visible pageAttInd, show ellipsis
        if (endPage < totalPagesAttInd) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageAttInd - 1) * pageSizeAttInd, pageAttInd * pageSizeAttInd);
    const totalPagesAttIndOuter = Math.ceil(filteredDataItems?.length / pageSizeAttInd);
    const visiblePages = Math.min(totalPagesAttIndOuter, 3);
    const firstVisiblePage = Math.max(1, pageAttInd - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesAttIndOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageAttInd * pageSizeAttInd;
    const indexOfFirstItem = indexOfLastItem - pageSizeAttInd;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    const handleDateInChange = (e) => {
        if (attClockInEdit.date === e.target.value) {
            const result = allHoursOption.filter((data, index) => {
                return data.formattedtime != "AM"
            });
            setHoursOptions(result.map((t) => ({
                label: t.formattedHour,
                value: t.formattedtime,
            })));
        } else {
            const result = allHoursOption.filter((data, index) => {
                return data.formattedtime != "PM"
            });
            setHoursOptions(result.map((t) => ({
                label: t.formattedHour,
                value: t.formattedtime,
            })));
        }

        setAttClockInEdit({ ...attClockInEdit, predate: e.target.value })
    }

    const handleDateOutChange = (e) => {
        if (attClockOutEdit.date === e.target.value) {
            const result = allHoursOption.filter((data, index) => {
                return data.formattedtime != "AM"
            });
            setHoursOptions(result.map((t) => ({
                label: t.formattedHour,
                value: t.formattedtime,
            })));
        } else {
            const result = allHoursOption.filter((data, index) => {
                return data.formattedtime != "PM"
            });
            setHoursOptions(result.map((t) => ({
                label: t.formattedHour,
                value: t.formattedtime,
            })));
        }

        setAttClockOutEdit({ ...attClockOutEdit, predate: e.target.value })
    }

    return (
        <Box>
            <Headtitle title={"ATTENDANCE INDIVIDUAL STATUS"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Attendance Individual Status"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Individual"
                subsubpagename="Overall Individual Status"
            />
            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid container spacing={2}>
                        <Grid item md={12} sm={12} xs={12}>
                            <Typography sx={userStyle.importheadtext}> Attendance Individual Status </Typography>
                        </Grid>
                        <>
                            {isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("HR") ?
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
                                    <Grid item md={3} xs={12} sm={6}>
                                        <FormControl fullWidth size="small">
                                            <Typography> Company<b style={{ color: "red" }}>*</b>  </Typography>
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
                                    <Grid item md={3} xs={12} sm={6}>
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
                                                onChange={(e) => {
                                                    handleBranchChange(e);
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
                                </>
                                : null}
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
                            <Grid item md={3} xs={12} sm={12}>
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
                                                console.log("Please select a date on or before today.");
                                            }
                                        }}
                                        // Set the max attribute to the current date
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
                                                console.log("Please select a date on or before today.");
                                            }
                                        }}
                                        // Set the max attribute to the current date
                                        inputProps={{ max: new Date().toISOString().split("T")[0], min: filterUser.fromdate !== "" ? filterUser.fromdate : null }}
                                    />
                                </FormControl>
                            </Grid>
                        </>
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
                </Box>  <br />
                {/* ****** Table Start ****** */}
                <Box sx={userStyle.container}>
                    {/* ******************************************************EXPORT Buttons****************************************************** */}
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>
                            {" "}
                            Attendance Individual List{" "}
                        </Typography>
                    </Grid>
                    <Grid container spacing={2} style={userStyle.dataTablestyle}>
                        <Grid item md={2} xs={12} sm={12}>
                            <Box>
                                <label>Show entries:</label>
                                <Select
                                    id="pageSizeSelect"
                                    value={pageSizeAttInd}
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
                        <Grid item md={8} xs={12} sm={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Box>
                                {isUserRoleCompare?.includes(
                                    "exceloverallindividualstatus"
                                ) && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                {isUserRoleCompare?.includes(
                                    "csvoverallindividualstatus"
                                ) && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                {isUserRoleCompare?.includes(
                                    "printoverallindividualstatus"
                                ) && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                {" "}
                                                &ensp; <FaPrint /> &ensp;Print&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                {isUserRoleCompare?.includes(
                                    "pdfoverallindividualstatus"
                                ) && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpen(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                {isUserRoleCompare?.includes(
                                    "imageoverallindividualstatus"
                                ) && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                {" "}
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;{" "}
                                            </Button>
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
                                                    <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchAttInd} />
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
                    <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsAttInd}> Manage Columns  </Button><br /><br />
                    {loader ?
                        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                            <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                        </Box> :
                        <>
                            <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageAttInd} >
                                <AgGridReact
                                    rowData={filteredDataItems}
                                    columnDefs={columnDataTableAttInd.filter((column) => columnVisibility[column.field])}
                                    ref={gridRefTableAttInd}
                                    defaultColDef={defaultColDef}
                                    domLayout={"autoHeight"}
                                    getRowStyle={getRowStyle}
                                    pagination={true}
                                    paginationPageSize={pageSizeAttInd}
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
                                            (filteredDataItems.length > 0 ? (pageAttInd - 1) * pageSizeAttInd + 1 : 0)
                                        ) : (
                                            filteredRowData.length > 0 ? (pageAttInd - 1) * pageSizeAttInd + 1 : 0
                                        )
                                    }{" "}to{" "}
                                    {
                                        gridApi && gridApi.getFilterModel() && Object.keys(gridApi.getFilterModel()).length === 0 ? (
                                            Math.min(pageAttInd * pageSizeAttInd, filteredDataItems.length)
                                        ) : (
                                            filteredRowData.length > 0 ? Math.min(pageAttInd * pageSizeAttInd, filteredRowData.length) : 0
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
                                    <Button onClick={() => handlePageChange(1)} disabled={pageAttInd === 1} sx={userStyle.paginationbtn}  > <FirstPageIcon /> </Button>
                                    <Button onClick={() => handlePageChange(pageAttInd - 1)} disabled={pageAttInd === 1} sx={userStyle.paginationbtn}  > <NavigateBeforeIcon />  </Button>
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
                                            className={pageAttInd === pageNumber ? "active" : ""}
                                            disabled={pageAttInd === pageNumber}
                                        >
                                            {pageNumber}
                                        </Button>
                                    ))}
                                    <Button onClick={() => handlePageChange(pageAttInd + 1)} disabled={pageAttInd === totalPagesAttInd} sx={userStyle.paginationbtn} > <NavigateNextIcon /> </Button>
                                    <Button onClick={() => handlePageChange(totalPagesAttInd)} disabled={pageAttInd === totalPagesAttInd} sx={userStyle.paginationbtn} ><LastPageIcon /> </Button>
                                </Box>
                            </Box> */}
                        </>
                    }
                </Box>
                {/* ****** Table End ****** */}
            </>

            {/* Manage Column */}
            <Popover
                id={idAttInd}
                open={isManageColumnsOpenAttInd}
                anchorEl={anchorElAttInd}
                onClose={handleCloseManageColumnsAttInd}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsAttInd}
                    searchQuery={searchQueryManageAttInd}
                    setSearchQuery={setSearchQueryManageAttInd}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibility}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibility}
                    initialColumnVisibility={initialColumnVisibilityAttInd}
                    columnDataTableAttInd={columnDataTableAttInd}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchAttInd}
                open={openSearchAttInd}
                anchorEl={anchorElSearchAttInd}
                onClose={handleCloseSearchAttInd}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableAttInd.filter(data => data.field !== "actions")} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryAttInd} handleCloseSearch={handleCloseSearchAttInd} />
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
                itemsTwo={userShifts ?? []}
                filename={"Attendance Individual List"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />

            {/* Edit Clock In */}
            <Dialog
                open={openEditClkIn}
                onClose={handleClickOpenEditClkIn}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                sx={{
                    overflow: "visible",
                    "& .MuiPaper-root": {
                        overflow: "visible",
                    },
                }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Clock In Edit</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={attClockInEdit.username} />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Emp Code</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={attClockInEdit.empcode} />
                                </FormControl>
                            </Grid>

                            <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={attClockInEdit.shift} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date</Typography>
                                {isReadClockIn ? (
                                    <>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                placeholder="Mr."
                                                value={attClockInEdit.predate}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                onChange={handleDateInChange}
                                            >
                                                {dateOptions?.map((data, i) => (
                                                    <MenuItem key={data} value={data}>
                                                        {data}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </>
                                ) : <>
                                    <FormControl fullWidth size="small">
                                        <TextField readOnly size="small" value={attClockInEdit.date} />
                                    </FormControl>
                                </>}
                            </Grid>
                            {/* <Grid item md={6} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Clock In Time</Typography>
                                <Grid sx={{ display: 'flex' }}>
                                    {
                                        isReadClockIn ? (
                                            <Box sx={{ display: 'flex' }}>
                                                <FormControl size="small" fullWidth>
                                                    <Selects fullWidth
                                                        maxMenuHeight={200}
                                                        styles={colourStyles}
                                                        options={hrsOptions}
                                                        value={{
                                                            label: attClockInEdit.clinhour,
                                                            value: attClockInEdit.clinhour,
                                                        }}
                                                        onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinhour: e.value })}
                                                    />

                                                </FormControl>
                                                <FormControl size="small" fullWidth>
                                                    <Selects fullWidth
                                                        maxMenuHeight={200}
                                                        styles={colourStyles}
                                                        options={minutssecOptions}
                                                        value={{
                                                            label: attClockInEdit.clinminute,
                                                            value: attClockInEdit.clinminute,
                                                        }}
                                                        onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinminute: e.value })}
                                                    />
                                                </FormControl>
                                                <FormControl size="small" fullWidth>
                                                    <Selects fullWidth
                                                        maxMenuHeight={200}
                                                        styles={colourStyles}
                                                        options={minutssecOptions}
                                                        value={{
                                                            label: attClockInEdit.clinseconds,
                                                            value: attClockInEdit.clinseconds,
                                                        }}
                                                        onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinseconds: e.value })}
                                                    />
                                                </FormControl>
                                                <FormControl size="small" fullWidth>
                                                    <Selects fullWidth
                                                        maxMenuHeight={200}
                                                        styles={colourStyles}
                                                        options={timeoptions}
                                                        value={{
                                                            label: attClockInEdit.timeperiod,
                                                            value: attClockInEdit.timeperiod,
                                                        }}
                                                        onChange={(e) => setAttClockInEdit({ ...attClockInEdit, timeperiod: e.value })}
                                                    />
                                                </FormControl>
                                            </Box>
                                        ) : (
                                            <Box sx={{ display: 'flex' }}>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput fullWidth
                                                        readOnly
                                                        value={attClockInEdit.clinhour + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds}
                                                        size='small'
                                                        sx={userStyle.input}
                                                        id="component-outlined"
                                                    />
                                                </FormControl>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput fullWidth
                                                        readOnly
                                                        value={attClockInEdit.timeperiod}
                                                        size='small'
                                                        sx={userStyle.input}
                                                        id="component-outlined"
                                                    />
                                                </FormControl>
                                            </Box>
                                        )}
                                    <Grid item md={1} lg={1}>
                                        <IconButton aria-label="Example" sx={{ marginTop: "5px" }}>
                                            {isReadClockIn ? (
                                                <>
                                                    <CheckCircleIcon onClick={(e) => { setIsReadClockIn(!isReadClockIn); }} style={{ color: "#216d21", cursor: 'pointer', fontSize: '1.05rem' }} fontSize='small' />

                                                </>
                                            ) : (
                                                <>
                                                    <FaEdit onClick={(e) => { setIsReadClockIn(!isReadClockIn); }} style={{ color: 'red', cursor: 'pointer' }} fontSize='small' />
                                                </>
                                            )}
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid> */}
                            <Grid item md={6} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Clock In Time</Typography>
                                <Grid container>
                                    <Grid item md={11} xs={12} sm={12} >

                                        {
                                            isReadClockIn ? (
                                                <Grid container>
                                                    <Grid item md={4} xs={4} sm={4} >
                                                        <FormControl size="small" fullWidth>
                                                            <Selects fullWidth
                                                                maxMenuHeight={200}
                                                                styles={colourStyles}
                                                                // options={hrsOptions}
                                                                options={hoursOptionconvert}
                                                                value={{
                                                                    label: attClockInEdit.clinhour,
                                                                    value: attClockInEdit.clinhour,
                                                                }}
                                                                onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinhour: e.value })}
                                                            />

                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} xs={4} sm={4} >
                                                        <FormControl size="small" fullWidth>
                                                            <Selects fullWidth
                                                                maxMenuHeight={200}
                                                                styles={colourStyles}
                                                                options={minutssecOptions}
                                                                value={{
                                                                    label: attClockInEdit.clinminute,
                                                                    value: attClockInEdit.clinminute,
                                                                }}
                                                                onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinminute: e.value })}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} xs={4} sm={4} >
                                                        <FormControl size="small" fullWidth>
                                                            <Selects fullWidth
                                                                maxMenuHeight={200}
                                                                styles={colourStyles}
                                                                options={minutssecOptions}
                                                                value={{
                                                                    label: attClockInEdit.clinseconds,
                                                                    value: attClockInEdit.clinseconds,
                                                                }}
                                                                onChange={(e) => setAttClockInEdit({ ...attClockInEdit, clinseconds: e.value })}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>


                                            ) : (
                                                <Box sx={{ display: 'flex' }}>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput fullWidth
                                                            readOnly
                                                            value={attClockInEdit.clinhour?.split(" ")[0] + ':' + attClockInEdit.clinminute + ':' + attClockInEdit.clinseconds}
                                                            size='small'
                                                            sx={userStyle.input}
                                                            id="component-outlined"
                                                        />
                                                    </FormControl>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput fullWidth
                                                            readOnly
                                                            value={attClockInEdit.clinhour?.split(" ")[1]}
                                                            size='small'
                                                            sx={userStyle.input}
                                                            id="component-outlined"
                                                        />
                                                    </FormControl>
                                                </Box>
                                            )}
                                    </Grid>
                                    <Grid item md={1} lg={1}>
                                        <IconButton aria-label="Example" sx={{ marginTop: "5px" }}>
                                            {isReadClockIn ? (
                                                <>
                                                    <CheckCircleIcon onClick={(e) => { setIsReadClockIn(!isReadClockIn); }} style={{ color: "#216d21", cursor: 'pointer', fontSize: '1.05rem' }} fontSize='small' />

                                                </>
                                            ) : (
                                                <>
                                                    <FaEdit onClick={(e) => { setIsReadClockIn(!isReadClockIn); }} style={{ color: 'red', cursor: 'pointer' }} fontSize='small' />
                                                </>
                                            )}
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            {removeHide &&
                                <>
                                    <Grid item md={2}>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={sendRequestClockIn} > {" "} Update{" "}  </Button>
                                    </Grid>
                                    <Grid item md={1}></Grid>
                                    <Grid item md={2}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseEditClkIn}> {" "} Cancel{" "} </Button>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </>
                </Box>
            </Dialog >

            {/* Edit Clock Out */}
            <Dialog
                open={openEditClkOut}
                onClose={handleClickOpenEditClkOut}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description" maxWidth="md"
                sx={{
                    overflow: "visible",
                    "& .MuiPaper-root": {
                        overflow: "visible",
                    },
                }}
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Clock Out Edit</Typography>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Employee</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={attClockOutEdit.username} />
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Emp Code</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={attClockOutEdit.empcode} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Shift</Typography>
                                <FormControl fullWidth size="small">
                                    <TextField readOnly size="small" value={attClockOutEdit.shift} />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Date</Typography>
                                {isReadClockOut ? (
                                    <>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                placeholder="Mr."
                                                value={attClockOutEdit.predate}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                onChange={handleDateOutChange}
                                            >
                                                {dateOptions?.map((data, i) => (
                                                    <MenuItem key={data} value={data}>
                                                        {data}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </>
                                ) : <>
                                    <FormControl fullWidth size="small">
                                        <TextField readOnly size="small" value={attClockOutEdit.date} />
                                    </FormControl>
                                </>}
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} >
                                <Typography sx={{ fontSize: '14px', marginTop: '10px' }}>Clock Out Time</Typography>
                                <Grid container>
                                    <Grid item md={11} xs={12} sm={12} >
                                        {
                                            isReadClockOut ? (

                                                <Grid container>
                                                    <Grid item md={4} xs={4} sm={4} >

                                                        <FormControl size="small" fullWidth>
                                                            <Selects fullWidth
                                                                maxMenuHeight={200}
                                                                styles={colourStyles}
                                                                // options={hrsOptions}
                                                                options={hoursOptionconvertclockout}
                                                                value={{
                                                                    label: attClockOutEdit.clouthour,
                                                                    value: attClockOutEdit.clouthour,
                                                                }}
                                                                onChange={(e) => setAttClockOutEdit({ ...attClockOutEdit, clouthour: e.value, })}
                                                            />

                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} xs={4} sm={4} >
                                                        <FormControl size="small" fullWidth>
                                                            <Selects fullWidth
                                                                maxMenuHeight={200}
                                                                styles={colourStyles}
                                                                options={minutssecOptions}
                                                                value={{
                                                                    label: attClockOutEdit.cloutminute,
                                                                    value: attClockOutEdit.cloutminute,
                                                                }}
                                                                onChange={(e) => setAttClockOutEdit({ ...attClockOutEdit, cloutminute: e.value })}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item md={4} xs={4} sm={4} >
                                                        <FormControl size="small" fullWidth>
                                                            <Selects fullWidth
                                                                maxMenuHeight={200}
                                                                styles={colourStyles}
                                                                options={minutssecOptions}
                                                                value={{
                                                                    label: attClockOutEdit.cloutseconds,
                                                                    value: attClockOutEdit.cloutseconds,
                                                                }}
                                                                onChange={(e) => setAttClockOutEdit({ ...attClockOutEdit, cloutseconds: e.value })}
                                                            />
                                                        </FormControl>

                                                    </Grid>
                                                </Grid>

                                            ) : (
                                                <Box sx={{ display: 'flex' }}>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput fullWidth
                                                            readOnly
                                                            value={attClockOutEdit.clouthour?.split(" ")[0] + ':' + attClockOutEdit.cloutminute + ':' + attClockOutEdit.cloutseconds}
                                                            size='small'
                                                            sx={userStyle.input}
                                                            id="component-outlined"
                                                        />
                                                    </FormControl>
                                                    <FormControl size="small" fullWidth>
                                                        <OutlinedInput fullWidth
                                                            readOnly
                                                            value={attClockOutEdit.clouthour?.split(" ")[1]}
                                                            size='small'
                                                            sx={userStyle.input}
                                                            id="component-outlined"
                                                        />
                                                    </FormControl>
                                                </Box>
                                            )}

                                    </Grid>
                                    <Grid item md={1} lg={1}>
                                        <IconButton aria-label="Example" sx={{ marginTop: "5px" }}>
                                            {isReadClockOut ? (
                                                <CheckCircleIcon onClick={(e) => { setIsReadClockOut(!isReadClockOut); }} style={{ color: "#216d21", cursor: 'pointer', fontSize: '1.05rem' }} fontSize='small' />
                                            ) : (
                                                <>
                                                    <FaEdit onClick={(e) => { setIsReadClockOut(!isReadClockOut); }} style={{ color: 'red', cursor: 'pointer' }} fontSize='small' />&nbsp;&nbsp;&nbsp;&nbsp;
                                                    {attClockOutEdit.date === newtoday && <DeleteOutlineOutlinedIcon onClick={(e) => { getRemoveAttout(attClockOutEdit.clockout, attClockOutEdit.date, attClockOutEdit.userid) }} style={{ color: "green", cursor: 'pointer', fontSize: '1.05rem' }} fontSize='small' />}

                                                </>
                                            )}
                                        </IconButton>
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            {removeHide &&
                                <>
                                    <Grid item md={2}>
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmitClkOutUpdate} > {" "} Update{" "}  </Button>
                                    </Grid>
                                    <Grid item md={1}></Grid>
                                    <Grid item md={2}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseEditClkOut}> {" "} Cancel{" "} </Button>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </>
                </Box>
            </Dialog >

            {/* ALERT DIALOG */}
            <Dialog
                open={isDeleteOpen}
                onClose={handleCloseMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMod} sx={userStyle.btncancel}>Cancel</Button>
                    <Button autoFocus variant="contained" color='error'
                        onClick={removeCloinout}
                    > OK </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={isOutDeleteOpen}
                onClose={handleOutCloseMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOutCloseMod} sx={userStyle.btncancel}>Cancel</Button>
                    <Button autoFocus variant="contained" color='error'
                        onClick={removeCloout}
                    > OK </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AttendanceIndividualStatus;