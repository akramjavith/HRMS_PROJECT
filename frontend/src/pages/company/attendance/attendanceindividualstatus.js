import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import {
    Box, Chip, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem,
    ListItemText, Popover, TextField, IconButton,
} from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { handleApiError } from "../../../components/Errorhandling";
import { MultiSelect } from "react-multi-select-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StyledDataGrid from "../../../components/TableStyle";
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
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import Selects from "react-select";
import moment from 'moment';
import { FaEdit } from "react-icons/fa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function AttendanceIndividualStatus() {
    const [hoursOptionconvert, setHoursOptionsConvert] = useState([]);
    const [hoursOptionconvertclockout, setHoursOptionsConvertClockout] = useState([]);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    var newtoday = dd + '/' + mm + '/' + yyyy

    // get current year
    const currentYear = new Date().getFullYear();

    // get current month in string name
    const monthstring = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
    ];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthObject = {
        label: monthstring[currentMonthIndex],
        value: currentMonthIndex + 1,
    };
    const currentYearObject = { label: currentYear, value: currentYear };
    const years = Array.from(new Array(10), (val, index) => currentYear - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

    const gridRef = useRef(null);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, alldepartment } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [attStatus, setAttStatus] = useState([]);
    const [userShifts, setUserShifts] = useState([]);
    const [items, setItems] = useState([]);
    const [showAlert, setShowAlert] = useState();
    const [loader, setLoader] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [attClockInEdit, setAttClockInEdit] = useState({ username: "", empcode: "", date: "", clockin: '', timeperiod: '', shiftmode: '' });
    const [isReadClockIn, setIsReadClockIn] = useState(false);
    const [getAttIdClockIn, setGetAttIdClockIn] = useState('');
    const [attClockOutEdit, setAttClockOutEdit] = useState({ username: "", empcode: "", date: "", clockout: '', timeperiod: '', shiftmode: '' });
    const [isReadClockOut, setIsReadClockOut] = useState(false);
    const [getAttIdClockOut, setGetAttIdClockOut] = useState('');

    const [filterUser, setFilterUser] = useState({
        // company: "Please Select Company",
        // branch: "Please Select Branch",
        mode: "Please Select Mode",
        // mode: 'My Hierarchy List',
        // level: "Primary",
        fromdate: today,
        todate: today,
    });

    const [isMonthyear, setIsMonthYear] = useState({ ismonth: currentMonthObject, isyear: currentYearObject, });
    const [dateOptions, setDateOptions] = useState([]);
    const [hoursOption, setHoursOptions] = useState([]);
    const [allHoursOption, setAallHoursOptions] = useState([]);
    const [removeHide, setRemoveHide] = useState(true);

    let hoursOptions = [];

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
    const [hoursOptionsNew, setHoursOptionsNew] = useState([]);
    const [minsOptionsNew, setMinsOptionsNew] = useState([]);

    const [hoursOptionsOut, setHoursOptionsOut] = useState([]);
    const [minsOptionsOut, setMinsOptionsOut] = useState([]);
    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedData, setCopiedData] = useState("");

    const [attSeetings, setAttSettings] = useState({})

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

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
        // checkbox: true,
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        department: true,
        empcode: true,
        username: true,
        role: true,
        // mode: true,
        // level: true,
        ipaddress: true,
        shift: true,
        clockin: true,
        clockout: true,
        date: true,
        bookby: true,
        actions: true,
    };
    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

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

        try {
            let res_emp = await axios.get(SERVICE.USER_X_EMPLOYEES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setEmployees(res_emp?.data?.users);
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

    useEffect(() => {
        fetchAttedanceStatus();
    }, [])

    //Delete model
    const [removeId, setRemoveId] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    const [isOutDeleteOpen, setIsOutDeleteOpen] = useState(false);

    const handleOutClickOpen = () => {
        setIsOutDeleteOpen(true);
    };
    const handleOutCloseMod = () => {
        setIsOutDeleteOpen(false);
    };

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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    }

    useEffect(() => {
        fetchOverAllSettings();
    }, []);

    const fetchFilteredUsersStatus = async () => {
        setUserShifts([]);
        setLoader(true);
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

                    let res = await axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_INDVL_FILTER, {
                        employee: batch.data,
                        userDates: daysArray,
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
                            serialNumber: index + 1,
                            clockinstatus: updatedClockInStatus,
                            clockoutstatus: updatedClockOutStatus,
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
                // console.log(finalresult, 'finalresult')
                setUserShifts(finalresult);
                setLoader(false);
            }).catch(error => {
                setLoader(true);
                console.error('Error in getting all results:', error);
            });

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    };

    // changed code
    const getCodeClockIn = async (rowdata) => {

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

                    setGetAttIdClockIn(d._id);
                }
            })

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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const sendRequestClockIn = async () => {
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
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Updated Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchOverAllSettings = async () => {
        try {
            let res = await axios.get(`${SERVICE.GET_ATTENDANCE_CONTROL_CRITERIA}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            setAttSettings(res?.data?.attendancecontrolcriteria[
                res?.data?.attendancecontrolcriteria?.length - 1
            ])
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const getRemoveAttout = async (clockout, date, userid) => {

        if (clockout === "00:00:00") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Give ClockOut Then only Remove!"}</p>
                </>
            );
            handleClickOpenerr();
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
                    console.log(d._id, 'test id')
                    setGetAttIdClockOut(d._id);
                }
            })

            handleClickOpenEditClkOut();
            const [clockin, timeperiodClkIn] = rowdata.clockin.split(' ');
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


            function generateTimeSlots(startTime, endTime) {
                // Helper function to convert 12-hour time format to 24-hour format
                function convertTo24Hour(time) {
                    const [timePart, period] = [time.slice(0, -2), time.slice(-2)];
                    let [hours, minutes] = timePart.split(':').map(Number);
                    if (period === 'PM' && hours !== 12) hours += 12;
                    if (period === 'AM' && hours === 12) hours = 0;
                    return hours;
                }

                // Helper function to format time in 12-hour format with AM/PM
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
                let currentHour = end;

                // Loop to generate time slots from end time until start time the next day
                while (true) {
                    slots.push(formatTime(currentHour));
                    if (currentHour === start) break;
                    currentHour = (currentHour + 1) % 24;
                }

                return slots;
            }


            function adjustShiftTime(shift, criteria) {
                const clockin = parseInt(criteria, 10); // e.g., 2
                // Extract the start time from the shift string
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
                if (newStartTimeMinutes >= 24 * 60) {
                    newStartTimeMinutes -= 24 * 60;
                }

                // Convert the adjusted time back to 12-hour format
                const newStartTime = minutesToTime(newStartTimeMinutes);

                // Return the adjusted start time (end time remains unchanged)
                return { shift: `${newStartTime}to${startTime}` };
            }

            // let newobjshift = newobj.shift
            // let newobjshift = "09:00AMto09:00PM";
            // let clockintime = "11:02:03 AM";
            let clockintime = newobj.clockin;

            // Extract the end time from newobjshift
            let endtime = newobj.shift.split('to')[1]; // "09:00PM"

            // Format the clockintime to match the format of the shift time (without seconds)
            let formattedClockinTime = clockintime.split(':')[0] + ":" + clockintime.split(':')[1] + clockintime.split(' ')[1]; // "11:02AM"

            // Create the new shift string
            let newobjshift = `${formattedClockinTime}to${endtime}`;


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



        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const sendRequestClockOut = async () => {
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
            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Updated Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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


            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Removed Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();
            setRemoveHide(true);
        } catch (err) { setRemoveHide(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
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

            setShowAlert(
                <>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: "100px", color: "#7ac767" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Removed Successfully 👍"}
                    </p>
                </>
            );
            handleClickOpenerr();
            setRemoveHide(true);
        } catch (err) { setRemoveHide(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const handleSubmitClkOutUpdate = () => {
        if (attClockOutEdit.clockin == '00:00:00') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Update ClockIn Time"} </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequestClockOut();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("HR")) {
            if (filterUser.mode === 'Please Select Mode') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Mode"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedCompany.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Company"} </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedBranch.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Branch"} </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedUnit.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Unit"} </p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (filterUser.mode === 'Department' && selectedDep.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Department"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (filterUser.mode === 'Employee' && selectedEmp.length === 0) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Select Employee"} </p>
                    </>
                );
                handleClickOpenerr();
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

    const handleClear = async (e) => {
        e.preventDefault();
        // setLoader(true);
        setUserShifts([]);
        setFilterUser({
            // company: "Please Select Company",
            // branch: "Please Select Branch",
            mode: 'Please Select Mode',
            // mode: 'My Hierarchy List',
            // level: "Primary",
            fromdate: today,
            todate: today,
        });
        setSelectedCompany([]);
        setValueCompany([]);
        setSelectedBranch([]);
        setValueBranch([]);
        setSelectedUnit([]);
        setValueUnit("");

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

        setSelectedDep([]);
        setValueDep("");
        setSelectedEmp([]);
        setValueEmp("");
        setPage(1);

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
        { field: "company", headerName: "Company", flex: 0, width: 130, hide: !columnVisibility.company, headerClassName: "bold-header", },
        { field: "branch", headerName: "Branch", flex: 0, width: 130, hide: !columnVisibility.branch, headerClassName: "bold-header", },
        { field: "unit", headerName: "Unit", flex: 0, width: 130, hide: !columnVisibility.unit, headerClassName: "bold-header", },
        { field: "department", headerName: "Department", flex: 0, width: 130, hide: !columnVisibility.department, headerClassName: "bold-header", },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 130, hide: !columnVisibility.empcode, headerClassName: "bold-header", },
        { field: "username", headerName: "Employee Name", flex: 0, width: 150, hide: !columnVisibility.username, headerClassName: "bold-header", },
        { field: "role", headerName: "Role", flex: 0, width: 120, hide: !columnVisibility.role, headerClassName: "bold-header", },
        { field: "bookby", headerName: "Book By", flex: 0, width: 120, hide: !columnVisibility.bookby, headerClassName: "bold-header", },
        { field: "ipaddress", headerName: "IP Address", flex: 0, width: 150, hide: !columnVisibility.ipaddress, headerClassName: "bold-header", },
        { field: "date", headerName: "Date", flex: 0, width: 120, hide: !columnVisibility.date, headerClassName: "bold-header", },
        { field: "shift", headerName: "Shift", flex: 0, width: 150, hide: !columnVisibility.shift, headerClassName: "bold-header", },
        { field: "clockin", headerName: "ClockIn", flex: 0, width: 120, hide: !columnVisibility.clockin, headerClassName: "bold-header", },
        { field: "clockout", headerName: "ClockOut", flex: 0, width: 120, hide: !columnVisibility.clockout, headerClassName: "bold-header", },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 400,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",

            renderCell: (params) =>
                <Grid sx={{ display: "flex", alignItems: "center", }}>

                    <>

                        <Button sx={userStyle.buttonedit}
                            // disabled={(params.row.clockin === "00:00:00" || params.row.ipaddress === "")}
                            variant="contained" onClick={() => { getCodeClockIn(params.row); }}  >
                            Clock In
                        </Button>

                        &ensp;

                        {(params.row.clockin !== "00:00:00" || params.row.ipaddress !== "") ?
                            <Button sx={userStyle.buttonedit} variant="contained" onClick={() => { getCodeClockOut(params.row); }}  >
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
            rowusername: item.rowusername,
            empcode: item.empcode,
            weekoff: item.weekoff,
            boardingLog: item.boardingLog,
            shiftallot: item.shiftallot,
            shift: item.shift,
            shiftMode: item.shiftMode,
            date: item.date,
            shiftMode: item.shiftMode,
            clockin: item.clockin,
            clockinstatus: item.clockinstatus,
            lateclockincount: item.lateclockincount,
            earlyclockoutcount: item.earlyclockoutcount,
            clockout: item.clockout,
            clockoutstatus: item.clockoutstatus,
            role: item.role,
            bookby: item.attendanceautostatus ? item.attendanceautostatus : getattendancestatus(item),
            ipaddress: item.ipaddress,
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
        return searchTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredData = filteredDatas?.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);
    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );
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
            </Box>{" "}
            <br /> <br />
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
                            Show All{" "}
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
    const fileName = "Attendance Individual List";
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
                    "S.No": index + 1,
                    'Company': t.company,
                    'Branch': t.branch,
                    'Unit': t.unit,
                    'Department': t.department,
                    "Emp Code": t.empcode,
                    "Employee Name": t.username,
                    'Role': t.role,
                    "Book By": t.bookby,
                    "IP Address": t.ipaddress,
                    'Date': t.date,
                    'Shift': t.shift,
                    'ClockIn': t.clockin,
                    'ClockOut': t.clockout,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                rowDataTable.map((t, index) => ({
                    "S.No": index + 1,
                    'Company': t.company,
                    'Branch': t.branch,
                    'Unit': t.unit,
                    'Department': t.department,
                    "Emp Code": t.empcode,
                    "Employee Name": t.username,
                    'Role': t.role,
                    "Book By": t.bookby,
                    "IP Address": t.ipaddress,
                    'Date': t.date,
                    'Shift': t.shift,
                    'ClockIn': t.clockin,
                    'ClockOut': t.clockout,
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
        documentTitle: "Attendance Individual List",
        pageStyle: "print",
    });

    // pdf.....
    const columns = [
        { title: "SNo", field: "serialNumber" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Department", field: "department" },
        { title: "Emp Code", field: "empcode" },
        { title: "Employee Name", field: "username" },
        { title: "Role", field: "role" },
        { title: "Book By", field: "bookby" },
        { title: "IP Address", field: "ipaddress" },
        { title: "Date", field: "date" },
        { title: "Shift", field: "shift" },
        { title: "ClockIn", field: "clockin" },
        { title: "ClockOut", field: "clockout" },
    ];

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF({ orientation: "landscape" });

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
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
            columnStyles: {
                role: { cellWidh: 20 }
            },
        });

        doc.save("Attendance Individual List.pdf");
    };

    // image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Attendance Individual List.png");
                });
            });
        }
    };

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
            <Typography sx={userStyle.HeaderText}>
                Attendance Individual Status
            </Typography>
            <>
                <Box sx={userStyle.selectcontainer}>
                    <Grid container spacing={2}>
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
                                                options={isAssignBranch?.map(data => ({
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
                                </>
                                : null}
                            <Grid item md={3} xs={12} sm={12}>
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
                    <br />
                    <br />
                    <br />
                    <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                    >
                        <Grid item lg={1} md={2} sm={2} xs={12}>
                            <Button sx={userStyle.buttonadd} variant="contained" onClick={handleSubmit}  > {" "} Filter{" "} </Button>
                        </Grid>
                        <Grid item lg={1} md={2} sm={2} xs={12}>
                            <Button sx={userStyle.btncancel} onClick={handleClear}>
                                {" "}
                                Clear{" "}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <br />
                <br />
                {/* ****** Table Start ****** */}
                {loader ? (
                    <Box sx={userStyle.container}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                minHeight: "350px",
                            }}
                        >
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
                    </Box>
                ) : (
                    <>
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
                                            {/* <MenuItem value={rowDataTable?.length}>All</MenuItem> */}
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    md={8}
                                    xs={12}
                                    sm={12}
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
                            </Grid>{" "}
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                {" "}
                                Show All Columns{" "}
                            </Button>{" "}
                            &ensp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumns}
                            >
                                {" "}
                                Manage Columns{" "}
                            </Button>{" "}
                            <br /> <br />
                            <Box style={{ width: "100%", overflowY: "hidden" }}>
                                <StyledDataGrid
                                    onClipboardCopy={(copiedString) =>
                                        setCopiedData(copiedString)
                                    }
                                    rows={rowsWithCheckboxes}
                                    columns={columnDataTable.filter(
                                        (column) => columnVisibility[column.field]
                                    )}
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
                                    <Button
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        {" "}
                                        <FirstPageIcon />{" "}
                                    </Button>
                                    <Button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        sx={userStyle.paginationbtn}
                                    >
                                        {" "}
                                        <NavigateBeforeIcon />{" "}
                                    </Button>
                                    {pageNumbers?.map((pageNumber) => (
                                        <Button
                                            key={pageNumber}
                                            sx={userStyle.paginationbtn}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={page === pageNumber ? "active" : ""}
                                            disabled={page === pageNumber}
                                        >
                                            {" "}
                                            {pageNumber}{" "}
                                        </Button>
                                    ))}
                                    {lastVisiblePage < totalPages && <span>...</span>}
                                    <Button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        {" "}
                                        <NavigateNextIcon />{" "}
                                    </Button>
                                    <Button
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        sx={userStyle.paginationbtn}
                                    >
                                        {" "}
                                        <LastPageIcon />{" "}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}
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
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRef}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Emp Code</TableCell>
                            <TableCell>Employee Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Book By</TableCell>
                            <TableCell>IP Address</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Shift</TableCell>
                            <TableCell>ClockIn</TableCell>
                            <TableCell>ClockOut</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {filteredData &&
                            filteredData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.serialNumber}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.empcode}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>{row.bookby}</TableCell>
                                    <TableCell>{row.ipaddress}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.shift}</TableCell>
                                    <TableCell>{row.clockin}</TableCell>
                                    <TableCell>{row.clockout}</TableCell>
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
                            // fetchUsersStatusForExports()
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
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

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
                                        <Button variant="contained" color="primary" onClick={sendRequestClockIn} > {" "} Update{" "}  </Button>
                                    </Grid>
                                    <Grid item md={1}></Grid>
                                    <Grid item md={2}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseEditClkIn}> {" "} Cancel{" "} </Button>
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
                                        <Button variant="contained" color="primary" onClick={handleSubmitClkOutUpdate} > {" "} Update{" "}  </Button>
                                    </Grid>
                                    <Grid item md={1}></Grid>
                                    <Grid item md={2}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseEditClkOut}> {" "} Cancel{" "} </Button>
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