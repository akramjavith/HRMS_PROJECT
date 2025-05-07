import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { FaFileExcel, FaFileCsv, FaPrint, FaFilePdf, FaSearch } from 'react-icons/fa';
import { Box, DialogActions, Dialog, Typography, OutlinedInput, DialogContent, Select, MenuItem, InputAdornment, FormControl, Grid, Button, Popover, IconButton, Tooltip, Chip } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
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
const ScrollingText = ({ text }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const containerWidth = containerRef.current.offsetWidth;
        const textElement = textRef.current;

        if (!textElement) return; // Add a null check here

        const textWidth = textElement.offsetWidth;
        let position = 0;

        const scrollText = () => {
            position -= 1;
            if (position < -textWidth) {
                position = containerWidth;
            }
            textElement.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(scrollText);
        };

        scrollText();

        return () => cancelAnimationFrame(scrollText);
    }, []);

    return (
        <Grid
            item
            xs={8}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Typography
                sx={{
                    ...userStyle.importheadtext,
                    fontSize: "1.4rem",
                    marginRight: "1rem",
                }}
            >
                {"Holiday/Weekoff Login List"}
            </Typography>
            <div
                ref={containerRef}
                style={{ overflow: "hidden", width: "50%", whiteSpace: "nowrap" }}
            >
                <span ref={textRef} style={{ color: "red", display: "inline-block" }}>
                    {text}
                </span>
            </div>
        </Grid>
    );
};
function WeekoffHolidayList() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;

    const gridRefTableHoliWeekoff = useRef(null);
    const gridRefImageHoliWeekoff = useRef(null);
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, alldepartment, alldesignation, allUsersLimit, allTeam, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

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
    const [selectedDep, setSelectedDep] = useState([]);
    const [valueDep, setValueDep] = useState([]);
    const [selectedDesig, setSelectedDesig] = useState([]);
    const [valueDesig, setValueDesig] = useState([]);
    const [userHoliWeekoff, setUserHoliWeekoff] = useState([]);
    const [loader, setLoader] = useState(false);

    // State to track advanced filter
    const [advancedFilter, setAdvancedFilter] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [filteredDataItems, setFilteredDataItems] = useState([]);
    const [filteredRowData, setFilteredRowData] = useState([]);

    const [filterUser, setFilterUser] = useState({ filtertype: "Individual", fromdate: today });

    // Datatable
    const [pageHoliWeekoff, setPageHoliWeekoff] = useState(1);
    const [userId, setUserId] = useState("");
    const [pageSizeHoliWeekoff, setPageSizeHoliWeekoff] = useState(10);
    const [searchQueryHoliWeekoff, setSearchQueryHoliWeekoff] = useState("");
    const [totalPagesHoliWeekoff, setTotalPagesHoliWeekoff] = useState(1);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // pageHoliWeekoff refersh reload
    const handleCloseFilterMod = () => { setIsFilterOpen(false); };
    const handleClosePdfFilterMod = () => { setIsPdfFilterOpen(false); };

    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => { setOpenPopupMalert(true); };
    const handleClosePopupMalert = () => { setOpenPopupMalert(false); };
    const [MobileSwitch, setMobileSwitch] = useState();
    const [openPopup, setOpenPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    const [popupSeverity, setPopupSeverity] = useState("");
    const handleClickOpenPopup = () => { setOpenPopup(true); };
    const handleClosePopup = () => { setOpenPopup(false); }
    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleClickCloseDeletePopup = () => {
        setIsDeleteOpenalert(false);
    };
    const handleClickOpenDeletePopup = () => {
        setIsDeleteOpenalert(true);
    };
    // pageHoliWeekoff refersh reload
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
    const [isManageColumnsOpenHoliWeekoff, setManageColumnsOpenHoliWeekoff] = useState(false);
    const [anchorElHoliWeekoff, setAnchorElHoliWeekoff] = useState(null);
    const [searchQueryManageHoliWeekoff, setSearchQueryManageHoliWeekoff] = useState("");
    const handleOpenManageColumnsHoliWeekoff = (event) => {
        setAnchorElHoliWeekoff(event.currentTarget);
        setManageColumnsOpenHoliWeekoff(true);
    };
    const handleCloseManageColumnsHoliWeekoff = () => {
        setManageColumnsOpenHoliWeekoff(false);
        setSearchQueryManageHoliWeekoff("");
    };
    const openManageColumnsHoliWeekoff = Boolean(anchorElHoliWeekoff);
    const idManageColumnsHoliWeekoff = openManageColumnsHoliWeekoff ? "simple-popover" : undefined;

    // Search bar
    const [anchorElSearchHoliWeekoff, setAnchorElSearchHoliWeekoff] = React.useState(null);
    const handleClickSearchHoliWeekoff = (event) => {
        setAnchorElSearchHoliWeekoff(event.currentTarget);
    };
    const handleCloseSearchHoliWeekoff = () => {
        setAnchorElSearchHoliWeekoff(null);
        setSearchQueryHoliWeekoff("");
    };

    const openSearchHoliWeekoff = Boolean(anchorElSearchHoliWeekoff);
    const idSearchHoliWeekoff = openSearchHoliWeekoff ? 'simple-popover' : undefined;

    // Show All Columns & Manage Columns
    const initialColumnVisibilityHoliWeekoff = {
        serialNumber: true,
        empcode: true,
        username: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        department: true,
        designation: true,
        date: true,
        status: true,
        actions: true,
    };
    const [columnVisibilityHoliWeekoff, setColumnVisibilityHoliWeekoff] = useState(initialColumnVisibilityHoliWeekoff);

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
            pagename: String("Holiday/Weekoff"),
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

    // Pre select dropdowns
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
        const employees = allUsersLimit
            ?.filter(
                (val) =>
                    company.some(comp => comp.value === val.company) &&
                    branch.some(br => br.value === val.branch) &&
                    unit.some(uni => uni.value === val.unit) &&
                    team.some(team => team.value === val.team)
            )
            .map((u) => ({
                label: u.companyname,
                value: u.companyname,
            }));
        setSelectedEmp(employees);
        setValueEmp(employees.map(a => a.value))
    }, [isAssignBranch])

    // Company
    const handleCompanyChange = (options) => {
        setValueCompany(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedCompany(options);
        setValueBranch([]);
        setSelectedBranch([]);
        setValueUnit([]);
        setSelectedUnit([]);
        setValueTeam([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setValueEmp([]);
        setSelectedDep([]);
        setValueDep([]);
        setSelectedDesig([]);
        setValueDesig([]);
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
        setSelectedTeam([]);
        setSelectedEmp([]);
        setSelectedDep([]);
        setSelectedDesig([]);
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
        setSelectedEmp([]);
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

    // Designation
    const handleDesignationChange = (options) => {
        setValueDesig(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedDesig(options);
    };

    const customValueRendererDesignation = (valueDesig, _categoryname) => {
        return valueDesig?.length
            ? valueDesig.map(({ label }) => label)?.join(", ")
            : "Please Select Designation";
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

    function getMonthsInRange(fromdate, todate) {
        const startDate = new Date(fromdate);
        const endDate = new Date(todate);
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const result = [];

        // Previous month based on `fromdate`
        const prevMonth = startDate.getMonth() === 0 ? 11 : startDate.getMonth() - 1;
        const prevYear = startDate.getMonth() === 0 ? startDate.getFullYear() - 1 : startDate.getFullYear();
        result.push({ month: monthNames[prevMonth], year: prevYear.toString() });

        // Add selected months between `fromdate` and `todate`
        const currentDate = new Date(startDate);
        currentDate.setDate(1); // Normalize to the start of the month
        while (
            currentDate.getFullYear() < endDate.getFullYear() ||
            (currentDate.getFullYear() === endDate.getFullYear() && currentDate.getMonth() <= endDate.getMonth())
        ) {
            result.push({
                month: monthNames[currentDate.getMonth()],
                year: currentDate.getFullYear().toString()
            });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Next month based on `todate`
        const nextMonth = endDate.getMonth() === 11 ? 0 : endDate.getMonth() + 1;
        const nextYear = endDate.getMonth() === 11 ? endDate.getFullYear() + 1 : endDate.getFullYear();
        result.push({ month: monthNames[nextMonth], year: nextYear.toString() });

        return result;
    }

    const fetchFilteredUsersStatus = async () => {
        setPageName(!pageName)
        setUserHoliWeekoff([]);
        setLoader(true);
        setPageHoliWeekoff(1);
        setPageSizeHoliWeekoff(10);

        let startMonthDate = new Date(filterUser.fromdate);
        let endMonthDate = new Date(filterUser.fromdate);

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
            let res_att = await axios.get(SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let resp_restrict = await axios.post(SERVICE.USERS_HOLIDAYWEEEKOFF_STATUS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: [...valueCompany],
                branch: [...valueBranch],
                unit: [...valueUnit],
                team: [...valueTeam],
                companyname: [...valueEmp],
                department: [...valueDep],
                designation: [...valueDesig],
                date: filterUser.fromdate,
            });
            const attendanceControl = res_att?.data?.attendancecontrolcriteria?.length > 0 ? res_att?.data?.attendancecontrolcriteria[res_att?.data?.attendancecontrolcriteria?.length - 1]?.weekofftodos : [];
            let holidayWeekoffData = resp_restrict?.data?.usersresult;

            let res_emp = await axios.post(SERVICE.USER_FOR_ALL_HOLIDAY_WEEKOFF_FILTER, {
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
                designation: [...valueDesig]
            });

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

            const montharray = getMonthsInRange(filterUser.fromdate, filterUser.fromdate);

            async function sendBatchRequest(batch) {
                try {
                    let res_applyleave = await axios.post(SERVICE.APPLYLEAVE_APPROVED, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        employee: batch.data,
                    });

                    let leaveresult = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype !== 'Leave Without Pay (LWP)');
                    let leaveresultWithoutPay = res_applyleave?.data?.applyleaves?.filter(data => data.leavetype === 'Leave Without Pay (LWP)');
                    let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_FILTER, {
                        employee: batch.data,
                        // userDates: daysArray,
                        fromdate: filterUser.fromdate,
                        todate: filterUser.fromdate,
                        montharray: [...montharray],
                    }, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    })
                    const filtered = res?.data?.finaluser?.filter(d => {
                        const formattedDate = new Date(d.finalDate);
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

                    // let filtered = valueDep.length > 0 ? (filteredBatch?.filter((data) => valueDep.includes(data.department))) : filteredBatch;

                    // let countByEmpcodeClockin = {}; // Object to store count for each empcode
                    // let countByEmpcodeClockout = {};

                    // const result = filtered?.map((item, index) => {
                    //     // Initialize count for empcode if not already present
                    //     if (!countByEmpcodeClockin[item.empcode]) {
                    //         countByEmpcodeClockin[item.empcode] = 1;
                    //     }
                    //     if (!countByEmpcodeClockout[item.empcode]) {
                    //         countByEmpcodeClockout[item.empcode] = 1;
                    //     }

                    //     // Adjust clockinstatus based on lateclockincount
                    //     let updatedClockInStatus = item.clockinstatus;
                    //     // Adjust clockoutstatus based on earlyclockoutcount
                    //     let updatedClockOutStatus = item.clockoutstatus;

                    //     // Filter out only 'Absent' items for the current employee
                    //     const absentItems = filtered?.filter(d => d.clockinstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00');

                    //     // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
                    //     if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
                    //         // Define the date format for comparison
                    //         const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                    //         const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    //         const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day'));

                    //         const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                    //         const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day'));

                    //         if (isPreviousDayLeave) {
                    //             updatedClockInStatus = 'BeforeWeekOffLeave';
                    //             updatedClockOutStatus = 'BeforeWeekOffLeave';
                    //         }
                    //         if (isPreviousDayAbsent) {
                    //             updatedClockInStatus = 'BeforeWeekOffAbsent';
                    //             updatedClockOutStatus = 'BeforeWeekOffAbsent';
                    //         }
                    //         if (isNextDayLeave) {
                    //             updatedClockInStatus = 'AfterWeekOffLeave';
                    //             updatedClockOutStatus = 'AfterWeekOffLeave';
                    //         }
                    //         if (isNextDayAbsent) {
                    //             updatedClockInStatus = 'AfterWeekOffAbsent';
                    //             updatedClockOutStatus = 'AfterWeekOffAbsent';
                    //         }
                    //     }

                    //     // Check if 'Late - ClockIn' count exceeds the specified limit
                    //     if (updatedClockInStatus === 'Late - ClockIn') {
                    //         updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                    //         countByEmpcodeClockin[item.empcode]++; // Increment count for current empcode
                    //     }
                    //     // Check if 'Early - ClockOut' count exceeds the specified limit
                    //     if (updatedClockOutStatus === 'Early - ClockOut') {
                    //         updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                    //         countByEmpcodeClockout[item.empcode]++; // Increment count for current empcode
                    //     }

                    //     return {
                    //         ...item,
                    //         clockinstatus: updatedClockInStatus,
                    //         clockoutstatus: updatedClockOutStatus,
                    //     };
                    // });

                    const resultBefore = filtered?.map((item, index) => {
                        // Adjust clockinstatus based on lateclockincount
                        let updatedClockInStatus = item.clockinstatus;
                        // Adjust clockoutstatus based on earlyclockoutcount
                        let updatedClockOutStatus = item.clockoutstatus;

                        // Filter out only 'Absent' items for the current employee
                        const absentItems = filtered?.filter(d => d.clockinstatus === 'Absent' && d.clockoutstatus === 'Absent' && item.empcode === d.empcode && d.clockin === '00:00:00' && d.clockout === '00:00:00' && item.attendanceautostatus === 'ABSENT');

                        // Check if the day before and after a 'Week Off' date is marked as 'Leave' or 'Absent'
                        if (item.clockinstatus === 'Week Off' && item.clockoutstatus === 'Week Off') {
                            // Define the date format for comparison
                            const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                            const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                            const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && absentItem.empcode === item.empcode);

                            const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                            const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && absentItem.empcode === item.empcode);

                            const isPreviousDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                            const isNextDayLeaveWithoutPay = leaveresultWithoutPay.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);

                            if (isPreviousDayLeave) {
                                updatedClockInStatus = 'BeforeWeekOffLeave';
                                updatedClockOutStatus = 'BeforeWeekOffLeave';
                            }
                            if (isPreviousDayAbsent) {
                                updatedClockInStatus = 'BeforeWeekOffAbsent';
                                updatedClockOutStatus = 'BeforeWeekOffAbsent';
                            }
                            if (isPreviousDayLeaveWithoutPay) {
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
                            if (isNextDayLeaveWithoutPay) {
                                updatedClockInStatus = 'AfterWeekOffAbsent';
                                updatedClockOutStatus = 'AfterWeekOffAbsent';
                            }

                            if (isPreviousDayLeave && isNextDayLeave) {
                                updatedClockInStatus = "BeforeAndAfterWeekOffLeave";
                                updatedClockOutStatus = "BeforeAndAfterWeekOffLeave";
                            }
                            // console.log(isPreviousDayAbsent && isNextDayAbsent, 'isPreviousDayAbsent && isNextDayAbsent')
                            if (isPreviousDayAbsent && isNextDayAbsent) {
                                updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                                updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
                            }
                            if (isPreviousDayLeaveWithoutPay && isNextDayLeaveWithoutPay) {
                                updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                                updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
                            }
                        }

                        return {
                            ...item,
                            clockinstatus: updatedClockInStatus,
                            clockoutstatus: updatedClockOutStatus,
                        };
                    });

                    // Group data by empcode
                    let groupedData = {};
                    resultBefore.forEach((item) => {
                        if (!groupedData[item.empcode]) {
                            groupedData[item.empcode] = {
                                attendanceRecords: [],
                                departmentDateSet: item.departmentDateSet || [],
                            };
                        }
                        groupedData[item.empcode].attendanceRecords.push(item);
                    });
                    let result = [];

                    for (let empcode in groupedData) {
                        let { attendanceRecords, departmentDateSet } = groupedData[empcode];

                        departmentDateSet.forEach((dateRange) => {
                            let { fromdate, todate, department } = dateRange;

                            let countByEmpcodeClockin = {};
                            let countByEmpcodeClockout = {};

                            let recordsInDateRange = attendanceRecords.filter((record) => {
                                let formattedDate = new Date(record.finalDate);
                                return department === record.department && formattedDate >= new Date(fromdate) && formattedDate <= new Date(todate);
                            });

                            // // Filter out only 'Absent' items for the current employee
                            // const absentItems = recordsInDateRange.filter(
                            //     (d) =>
                            //         d.clockinstatus === "Absent" &&
                            //         d.clockoutstatus === 'Absent' &&
                            //         d.clockin === "00:00:00" &&
                            //         d.clockout === "00:00:00"
                            // );

                            let processedRecords = recordsInDateRange.map((item) => {
                                let formattedDate = new Date(item.finalDate);
                                let reasonDate = item.reasondate ? new Date(item.reasondate) : null;
                                let dojDate = item.doj ? new Date(item.doj) : null;

                                let updatedClockInStatus = item.clockinstatus;
                                let updatedClockOutStatus = item.clockoutstatus;

                                // Check if the date falls within the reasonDate or dojDate
                                if (reasonDate && formattedDate <= reasonDate) {
                                    return null;
                                }
                                if (dojDate && formattedDate < dojDate) {
                                    return null;
                                }

                                // // Handling Week Offs and Absences
                                // if (item.clockinstatus === "Week Off" && item.clockoutstatus === "Week Off") {
                                //     const itemDate = moment(item.rowformattedDate, "DD/MM/YYYY");

                                //     const isPreviousDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                                //     const isPreviousDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().subtract(1, 'days'), 'day') && absentItem.empcode === item.empcode);

                                //     const isNextDayLeave = leaveresult.some(leaveItem => moment(leaveItem.date, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && leaveItem.empcode === item.empcode);
                                //     const isNextDayAbsent = absentItems.some(absentItem => moment(absentItem.rowformattedDate, "DD/MM/YYYY").isSame(itemDate.clone().add(1, 'days'), 'day') && absentItem.empcode === item.empcode);

                                //     if (isPreviousDayLeave) {
                                //         updatedClockInStatus = "BeforeWeekOffLeave";
                                //         updatedClockOutStatus = "BeforeWeekOffLeave";
                                //     }
                                //     if (isPreviousDayAbsent) {
                                //         updatedClockInStatus = "BeforeWeekOffAbsent";
                                //         updatedClockOutStatus = "BeforeWeekOffAbsent";
                                //     }
                                //     if (isNextDayLeave) {
                                //         updatedClockInStatus = "AfterWeekOffLeave";
                                //         updatedClockOutStatus = "AfterWeekOffLeave";
                                //     }
                                //     if (isNextDayAbsent) {
                                //         updatedClockInStatus = "AfterWeekOffAbsent";
                                //         updatedClockOutStatus = "AfterWeekOffAbsent";
                                //     }

                                //     if (isPreviousDayLeave && isNextDayLeave) {
                                //         updatedClockInStatus = "BeforeAndAfterWeekOffLeave";
                                //         updatedClockOutStatus = "BeforeAndAfterWeekOffLeave";
                                //     }
                                //     console.log(isPreviousDayAbsent && isNextDayAbsent, 'isPreviousDayAbsent && isNextDayAbsent')
                                //     if (isPreviousDayAbsent && isNextDayAbsent) {
                                //         updatedClockInStatus = "BeforeAndAfterWeekOffAbsent";
                                //         updatedClockOutStatus = "BeforeAndAfterWeekOffAbsent";
                                //     }
                                // }

                                // Handling Late Clock-in and Early Clock-out
                                if (!countByEmpcodeClockin[item.empcode]) {
                                    countByEmpcodeClockin[item.empcode] = 1;
                                }
                                if (!countByEmpcodeClockout[item.empcode]) {
                                    countByEmpcodeClockout[item.empcode] = 1;
                                }

                                if (updatedClockInStatus === "Late - ClockIn") {
                                    updatedClockInStatus = `${countByEmpcodeClockin[item.empcode]}Late - ClockIn`;
                                    countByEmpcodeClockin[item.empcode]++;
                                }

                                if (updatedClockOutStatus === "Early - ClockOut") {
                                    updatedClockOutStatus = `${countByEmpcodeClockout[item.empcode]}Early - ClockOut`;
                                    countByEmpcodeClockout[item.empcode]++;
                                }

                                // console.log(item.rowformattedDate, updatedClockInStatus, updatedClockOutStatus)

                                return {
                                    ...item,
                                    department,
                                    fromdate,
                                    todate,
                                    clockinstatus: updatedClockInStatus,
                                    clockoutstatus: updatedClockOutStatus,
                                };
                            });

                            result.push(...processedRecords.filter(Boolean));
                        });
                    }

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
                let filteredResult = results.allResults?.filter(data =>
                    data.finalDate === filterUser.fromdate &&
                    (data.shift === "Week Off" || (data.clockinstatus === "Holiday" && data.clockoutstatus === "Holiday"))
                )?.map(data => {
                    const matchedItems = holidayWeekoffData?.find(item => item?.companyname === data?.username);
                    const matchedItemsAttendance = attendanceControl?.find(item => item?.employeename === data?.username);

                    const buttonstatus =
                        data?.clockoutstatus === "Holiday"
                            ? (matchedItemsAttendance && !matchedItems)
                                ? matchedItemsAttendance?.enableHoliday
                                : false
                            : false;
                    const buttonstatusweekoff =
                        data?.clockoutstatus === "Week Off"
                            ? (matchedItemsAttendance && !matchedItems)
                                ? matchedItemsAttendance?.enableweekoff
                                : false
                            : false;

                    return {
                        ...data,
                        buttonstatus: buttonstatus,
                        buttonstatusweekoff: buttonstatusweekoff,
                        buttondisabled: matchedItemsAttendance ? matchedItemsAttendance?.enableHoliday : false,
                        buttondisabledweekoff: matchedItemsAttendance ? matchedItemsAttendance?.enableweekoff : false,
                    };
                });

                if (filteredResult.length === 0) {
                    setLoader(true);
                    setPopupContentMalert(`No employees have Holiday/Week Off on this ${moment(filterUser.fromdate).format("DD-MM-YYYY")}`);
                    setPopupSeverityMalert("info");
                    handleClickOpenPopupMalert();
                    setUserHoliWeekoff([]);
                    setFilteredDataItems([]);
                    setSearchQueryHoliWeekoff("");
                    setLoader(false);
                    setTotalPagesHoliWeekoff(1);
                }
                else {
                    const itemsWithSerialNumber = filteredResult?.map((item, index) => ({
                        ...item,
                        id: item.id,
                        serialNumber: index + 1,
                        shiftmode: item.shiftMode,
                        uniqueid: item.id,
                        userid: item.userid,
                        status: item.shift === "Week Off"
                            ? "Week Off"
                            : item.clockinstatus === "Holiday" && item.clockoutstatus === "Holiday"
                                ? "Holiday"
                                : "",
                    }));

                    setUserHoliWeekoff(itemsWithSerialNumber);
                    setFilteredDataItems(itemsWithSerialNumber);
                    setSearchQueryHoliWeekoff("");
                    setLoader(false);
                    setTotalPagesHoliWeekoff(Math.ceil(itemsWithSerialNumber.length / pageSizeHoliWeekoff));
                }
            }).catch(error => {
                setLoader(true);
                console.error('Error in getting all results:', error);
            });
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
        else if (selectedTeam.length === 0 && ["Individual", "Team"]?.includes(filterUser.filtertype)) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedEmp.length === 0 && ["Individual"]?.includes(filterUser.filtertype)) {
            setPopupContentMalert("Please Select Employee Names");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedBranch.length === 0 && ["Department"]?.includes(filterUser.filtertype)) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedDep.length === 0 && ["Department"]?.includes(filterUser.filtertype)) {
            setPopupContentMalert("Please Select Department");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedBranch.length === 0 && ["Designation"]?.includes(filterUser.filtertype)) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedDesig.length === 0 && ["Designation"]?.includes(filterUser.filtertype)) {
            setPopupContentMalert("Please Select Designation");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (filterUser.fromdate === '') {
            setPopupContentMalert("Please Select Date");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        } else {
            fetchFilteredUsersStatus();
        }
    };

    const handleClear = async (e) => {
        e.preventDefault();
        setUserHoliWeekoff([]);
        setFilteredDataItems([]);
        setFilterUser({ filtertype: "Individual", fromdate: today });
        setSelectedCompany([]);
        setSelectedBranch([]);
        setSelectedUnit([]);
        setSelectedTeam([]);
        setSelectedEmp([]);
        setSelectedDep([]);
        setSelectedDesig([]);
        setValueCompany([]);
        setValueBranch([]);
        setValueUnit([]);
        setValueTeam([]);
        setValueEmp([]);
        setValueDep([]);
        setValueDesig([]);
        setPageHoliWeekoff(1);
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
                    filteredData.push(node.data);
                });
                setFilteredRowData(filteredData);
            }
        }
    };

    const onPaginationChanged = useCallback(() => {
        if (gridRefTableHoliWeekoff.current) {
            const gridApi = gridRefTableHoliWeekoff.current.api;
            const currentPage = gridApi.paginationGetCurrentPage() + 1;
            const totalPagesHoliWeekoff = gridApi.paginationGetTotalPages();
            setPageHoliWeekoff(currentPage);
            setTotalPagesHoliWeekoff(totalPagesHoliWeekoff);
        }
    }, []);

    const handleRestrictionAdd = async (e) => {
        try {
            const date = e?.rowformattedDate;
            const [day, month, year] = date.split("/");
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            if ((e.buttonstatus && e.status === "Holiday") || (e.buttonstatusweekoff && e.status === "Week Off")) {
                const response = await axios.post(SERVICE.CREATE_HOLIDAYWEEKOFF_RESTRICTION, {
                    companyname: e.username,
                    company: e.company,
                    branch: e.branch,
                    unit: e.unit,
                    team: e.team,
                    department: e.department,
                    designation: e.designation,
                    date: formattedDate,
                    status: e.status,
                    restriction: true,
                    addedby: [
                        {
                            name: String(isUserRoleAccess?.companyname),
                            date: String(new Date()),
                        },
                    ],

                },
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    }
                )
                setPopupContent("Access Successfully Restricted for This Date!");
                setPopupSeverity("success");
                handleClickOpenPopup();

            }
            else if ((!e.buttonstatus && e.status === "Holiday") || (!e.buttonstatusweekoff && e.status === "Week Off")) {
                const response = await axios.post(SERVICE.DELETE_HOLIDAYWEEKOFF_RESTRICTION, {
                    companyname: e.username,
                    date: formattedDate,
                    type: "weekoffholiday"
                },
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        }
                    }
                );
                if (response?.data?.userholidayweekoff?.length > 0) {
                    setUserId(response?.data?.userholidayweekoff)
                    handleClickOpenDeletePopup();
                }
            }
            await fetchFilteredUsersStatus();

        } catch (err) { setLoader(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    }

    // HandleReset Function
    const getCodeReset = async (e) => {
        try {

        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }
    const handleResetUserDetails = async (e) => {
        try {
            if (e?.length > 0) {
                e?.map(async (data) => {
                    await axios.delete(`${SERVICE.SINGLE_HOLIDAYWEEKOFF_RESTRICTION}/${data?._id}`, {
                    },
                        {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            }
                        }
                    );
                })
            }

            handleClickCloseDeletePopup();
            setPopupContent("Successfully Resetted");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchFilteredUsersStatus();
        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    }
    const columnDataTableHoliWeekoff = [
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 80, hide: !columnVisibilityHoliWeekoff.serialNumber, pinned: 'left', lockPinned: true, },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityHoliWeekoff.empcode, pinned: 'left', lockPinned: true, },
        { field: "username", headerName: "Employee Name", flex: 0, width: 250, hide: !columnVisibilityHoliWeekoff.username, pinned: 'left', lockPinned: true, },
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibilityHoliWeekoff.company, },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibilityHoliWeekoff.branch, },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibilityHoliWeekoff.unit, },
        { field: "team", headerName: "Team", flex: 0, width: 130, hide: !columnVisibilityHoliWeekoff.team, },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibilityHoliWeekoff.department, },
        { field: "designation", headerName: "Designation", flex: 0, width: 130, hide: !columnVisibilityHoliWeekoff.designation, },
        { field: "date", headerName: "Date", flex: 0, width: 110, hide: !columnVisibilityHoliWeekoff.date, },
        { field: "status", headerName: "Status", flex: 0, width: 110, hide: !columnVisibilityHoliWeekoff.status, },
        {
            field: "actions", headerName: "Action", flex: 0, width: 250, hide: !columnVisibilityHoliWeekoff.actions, sortable: false, filter: false,
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    <>
                        {params?.data?.status === "Holiday" ?
                            <FormControl size="small" fullWidth>
                                <FormGroup>
                                    <FormControlLabel
                                        label="Restrict Holiday Temp Login"
                                        control={
                                            <Switch
                                                checked={params?.data?.buttonstatus}
                                                disabled={!params?.data?.buttondisabled}
                                                onChange={() => handleRestrictionAdd(params.data)}
                                            />
                                        }
                                    />
                                </FormGroup>
                            </FormControl>
                            :
                            <FormControl size="small" fullWidth>
                                <FormGroup>
                                    <FormControlLabel
                                        label="Restrict Weekoff Temp Login"
                                        control={
                                            <Switch
                                                checked={params?.data?.buttonstatusweekoff}
                                                disabled={!params?.data?.buttondisabledweekoff}
                                                onChange={() => handleRestrictionAdd(params.data)}
                                            />
                                        }
                                    />
                                </FormGroup>
                            </FormControl>
                        }
                        {/* {!params?.data?.restrictionstatus ?
                            <>
                                <Button
                                    color="success"
                                    variant="contained"
                                    onClick={() => {
                                        handleRestrictionAdd(params.data);
                                    }}
                                >
                                    Restrict
                                </Button>
                                &ensp;
                            </>
                            : <Button
                                color="error"
                                variant="contained"
                                onClick={() => {

                                    getCodeReset(params.data);
                                }}
                            >
                                Reset
                            </Button>} */}
                    </>
                </Grid>
            ),
        },
    ];

    // Datatable
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQueryHoliWeekoff(value);
        applyNormalFilter(value);
        setFilteredRowData([]);
    };

    const applyNormalFilter = (searchValue) => {

        // Split the search query into individual terms
        const searchTerms = searchValue.toLowerCase().split(" ");

        // Modify the filtering logic to check each term
        const filtered = userHoliWeekoff?.filter((item) => {
            return searchTerms.every((term) =>
                Object.values(item).join(" ").toLowerCase().includes(term)
            );
        });
        setFilteredDataItems(filtered);
        setPageHoliWeekoff(1);
    };

    const applyAdvancedFilter = (filters, logicOperator) => {
        // Apply filtering logic with multiple conditions
        const filtered = userHoliWeekoff?.filter((item) => {
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
        // handleCloseSearchHoliWeekoff(); 
    };

    // Undo filter funtion
    const handleResetSearch = () => {
        setAdvancedFilter(null);
        setSearchQueryHoliWeekoff("");
        setFilteredDataItems(userHoliWeekoff);
    };

    // Show filtered combination in the search bar
    const getSearchDisplay = () => {
        if (advancedFilter && advancedFilter.length > 0) {
            return advancedFilter.map((filter, index) => {
                let showname = columnDataTableHoliWeekoff.find(col => col.field === filter.column)?.headerName;
                return `${showname} ${filter.condition} "${filter.value}"`;
            }).join(' ' + (advancedFilter.length > 1 ? advancedFilter[1].condition : '') + ' ');
        }
        return searchQueryHoliWeekoff;
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSizeHoliWeekoff(newSize);
        if (gridApi) {
            gridApi.paginationSetPageSize(newSize);
        }
    };

    // Show All Columns functionality
    const handleShowAllColumns = () => {
        const updatedVisibility = { ...columnVisibilityHoliWeekoff };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityHoliWeekoff(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityHoliWeekoff");
        if (savedVisibility) {
            setColumnVisibilityHoliWeekoff(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityHoliWeekoff", JSON.stringify(columnVisibilityHoliWeekoff));
    }, [columnVisibilityHoliWeekoff]);

    // Function to filter columns based on search query
    const filteredColumns = columnDataTableHoliWeekoff.filter((column) =>
        column.headerName.toLowerCase().includes(searchQueryManageHoliWeekoff.toLowerCase())
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

        setColumnVisibilityHoliWeekoff((prevVisibility) => {
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

        setColumnVisibilityHoliWeekoff((prevVisibility) => {
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
        setColumnVisibilityHoliWeekoff((prevVisibility) => ({
            ...prevVisibility,
            [colId]: event.visible, // Set visibility directly from the event
        }));
    }, []);

    // Excel
    const [fileFormat, setFormat] = useState('');
    let exportColumnNamescrt = ["Emp Code", "Employee Name", "Company", "Branch", "Unit", "Team", "Department", "Designation", "Date", "Status"]
    let exportRowValuescrt = ['empcode', 'username', 'company', 'branch', 'unit', 'team', 'department', 'designation', 'date', 'status']

    // print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Holiday/Weekoff",
        pageStyle: "print",
    });

    // image
    const handleCaptureImage = () => {
        if (gridRefImageHoliWeekoff.current) {
            domtoimage.toBlob(gridRefImageHoliWeekoff.current)
                .then((blob) => {
                    saveAs(blob, "Holiday/Weekoff.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // Pagination for outer filter
    const filteredData = filteredDataItems?.slice((pageHoliWeekoff - 1) * pageSizeHoliWeekoff, pageHoliWeekoff * pageSizeHoliWeekoff);
    const totalPagesHoliWeekoffOuter = Math.ceil(filteredDataItems?.length / pageSizeHoliWeekoff);
    const visiblePages = Math.min(totalPagesHoliWeekoffOuter, 3);
    const firstVisiblePage = Math.max(1, pageHoliWeekoff - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPagesHoliWeekoffOuter);
    const pageNumbers = [];
    const indexOfLastItem = pageHoliWeekoff * pageSizeHoliWeekoff;
    const indexOfFirstItem = indexOfLastItem - pageSizeHoliWeekoff;
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) { pageNumbers.push(i); }

    return (
        <Box>
            <Headtitle title={"Holiday/Weekoff Login"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Holiday/Weekoff Login"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Attendance"
                subpagename="Attendance Update"
                subsubpagename="Holiday/Weekoff Login"
            />
            {isUserRoleCompare?.includes("lholiday/weekofflogin") && (
                <>
                    <Box sx={userStyle.selectcontainer}>
                        <Grid container spacing={2}>
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography sx={userStyle.importheadtext}>Holiday/Weekoff Login</Typography>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> From Date<b style={{ color: "red" }}>*</b>{" "} </Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="date"
                                        value={filterUser.fromdate}
                                        onChange={(e) => { setFilterUser({ ...filterUser, fromdate: e.target.value }); }}
                                    // inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography> Type<b style={{ color: "red" }}>*</b> </Typography>
                                    <Selects
                                        options={[
                                            { label: "Individual", value: "Individual" },
                                            { label: "Branch", value: "Branch" },
                                            { label: "Unit", value: "Unit" },
                                            { label: "Team", value: "Team" },
                                            { label: "Department", value: "Department" },
                                            { label: "Designation", value: "Designation" },
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
                                            setSelectedDesig([]);
                                            setValueDesig([]);
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
                                                {/* Branch, Department */}
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
                                            : ["Individual", "Designation"]?.includes(filterUser.filtertype) ?
                                                <>
                                                    {/* Branch, Designation */}
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
                                                    <Grid item md={3} xs={12} sm={6}>
                                                        <FormControl fullWidth size="small">
                                                            <Typography>
                                                                Designation<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <MultiSelect
                                                                options={alldesignation?.filter(
                                                                    (comp) =>
                                                                        selectedBranch
                                                                            .map((item) => item.value)
                                                                            .includes(comp.branch)
                                                                )?.map(data => ({
                                                                    label: data.name,
                                                                    value: data.name,
                                                                })).filter((item, index, self) => {
                                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                                })}
                                                                value={selectedDesig}
                                                                onChange={(e) => { handleDesignationChange(e); }}
                                                                valueRenderer={customValueRendererDesignation}
                                                                labelledBy="Please Select Designation"
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
                                                inputValue={searchInputValue} // Add this state if needed
                                                onInputChange={(newValue) => setSearchInputValue(newValue)}
                                            />
                                        </div>
                                    </FormControl>
                                </Grid>}
                            {["Individual"]?.includes(filterUser.filtertype) &&
                                <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
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
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    clickable
                                                    sx={{ margin: 2, backgroundColor: "#FFF" }}
                                                    onDelete={(e) => handleDelete(e, value)}
                                                    onClick={() => console.log("clicked chip")}
                                                />
                                            ))}
                                        </Box>
                                    </FormControl>
                                </Grid>}
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
                            <ScrollingText text="This page restricts usernames using checkboxes in Attendance Control Criteria" />

                        </Grid>
                        <Grid container spacing={1} style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSizeHoliWeekoff}
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
                                        <MenuItem value={userHoliWeekoff?.length}>  All </MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}  >
                                <Box>
                                    {isUserRoleCompare?.includes("excelholiday/weekofflogin") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpen(true); setFormat("xl"); }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvholiday/weekofflogin") && (
                                        <>
                                            <Button onClick={(e) => { setIsFilterOpen(true); setFormat("csv"); }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printholiday/weekofflogin") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}> &ensp;  <FaPrint /> &ensp;Print&ensp; </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfholiday/weekofflogin") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => { setIsPdfFilterOpen(true); }}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imageholiday/weekofflogin") && (
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
                                                        <IoMdOptions style={{ cursor: 'pointer', }} onClick={handleClickSearchHoliWeekoff} />
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
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsHoliWeekoff}> Manage Columns  </Button><br /><br />
                        {loader ?
                            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '350px' }}>
                                <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                            </Box> :
                            <>
                                <Box sx={{ width: "100%", }} className={"ag-theme-quartz"} ref={gridRefImageHoliWeekoff} >
                                    <AgGridReact
                                        rowData={filteredDataItems}
                                        columnDefs={columnDataTableHoliWeekoff.filter((column) => columnVisibilityHoliWeekoff[column.field])}
                                        ref={gridRefTableHoliWeekoff}
                                        defaultColDef={defaultColDef}
                                        domLayout={"autoHeight"}
                                        getRowStyle={getRowStyle}
                                        pagination={true}
                                        paginationPageSizeSelector={[]}
                                        paginationPageSize={pageSizeHoliWeekoff}
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
                            </>
                        } {/* ****** Table End ****** */}
                    </Box>
                </>
            )}
            {/* Manage Column */}
            <Popover
                id={idManageColumnsHoliWeekoff}
                open={isManageColumnsOpenHoliWeekoff}
                anchorEl={anchorElHoliWeekoff}
                onClose={handleCloseManageColumnsHoliWeekoff}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
            >
                <ManageColumnsContent
                    handleClose={handleCloseManageColumnsHoliWeekoff}
                    searchQuery={searchQueryManageHoliWeekoff}
                    setSearchQuery={setSearchQueryManageHoliWeekoff}
                    filteredColumns={filteredColumns}
                    columnVisibility={columnVisibilityHoliWeekoff}
                    toggleColumnVisibility={toggleColumnVisibility}
                    setColumnVisibility={setColumnVisibilityHoliWeekoff}
                    initialColumnVisibility={initialColumnVisibilityHoliWeekoff}
                    columnDataTable={columnDataTableHoliWeekoff}
                />
            </Popover>

            {/* Search Bar */}
            <Popover
                id={idSearchHoliWeekoff}
                open={openSearchHoliWeekoff}
                anchorEl={anchorElSearchHoliWeekoff}
                onClose={handleCloseSearchHoliWeekoff}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
            >
                <AdvancedSearchBar columns={columnDataTableHoliWeekoff?.filter(data => data.field !== 'actions')} onSearch={applyAdvancedFilter} initialSearchValue={searchQueryHoliWeekoff} handleCloseSearch={handleCloseSearchHoliWeekoff} />
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
                itemsTwo={userHoliWeekoff ?? []}
                filename={"Holiday/Weekoff"}
                exportColumnNames={exportColumnNamescrt}
                exportRowValues={exportRowValuescrt}
                componentRef={componentRef}
            />
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleClickCloseDeletePopup} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure you want to Reset this detail?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClickCloseDeletePopup} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            onClick={(e) => {
                                handleResetUserDetails(userId);

                            }}
                            autoFocus
                            variant="contained"
                            color="error"
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >
    );
}

export default WeekoffHolidayList;