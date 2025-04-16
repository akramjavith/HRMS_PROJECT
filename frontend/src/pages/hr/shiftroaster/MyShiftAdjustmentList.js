import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, TextareaAutosize, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { FaPrint, FaFilePdf, } from "react-icons/fa";
import { CSVLink } from 'react-csv';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../../components/TableStyle";
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
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { format } from 'date-fns';
import MyShiftAdjustmentListTable from "./MyShiftAdjustmentListTable";
import MyShiftRoasterList from "./Myshiftroaster";
import { MultiSelect } from "react-multi-select-component";

function MyShiftAdjustmentList() {

    const gridRefFinalAdj = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);
    const [allUsers, setAllUsers] = useState([]);
    const [itemsFinalAdj, setItemsFinalAdj] = useState([])
    const [selectedRowsFinalAdj, setSelectedRowsFinalAdj] = useState([]);
    const [copiedDataFinalAdj, setCopiedDataFinalAdj] = useState("");
    const [selectAllCheckedFinalAdj, setSelectAllCheckedFinalAdj] = useState(false);
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
    const [allFinalAdj, setAllFinalAdj] = useState(false);
    const [allUserDates, setAllUserDates] = useState([])
    const [overallsettings, setOverallsettings] = useState("");
    const [allUsersShiftallot, setAllUsersShiftallot] = useState([])
    const [getShiftAllotMatchedId, setGetShiftAllotMatchedId] = useState("")
    const [getShiftAdjMatchedId, setGetShiftAdjMatchedId] = useState("")
    const [checkWeekOff, setCheckWeekOff] = useState('');

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
    const [pageFinalAdj, setPageFinalAdj] = useState(1);
    const [pageSizeFinalAdj, setPageSizeFinalAdj] = useState(10);
    const [searchQueryFinalAdj, setSearchQueryFinalAdj] = useState("");

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

    // Manage Columns
    const [searchQueryManageFinalAdj, setSearchQueryManageFinalAdj] = useState("");
    const [isManageColumnsOpenFinalAdj, setManageColumnsOpenFinalAdj] = useState(false);
    const [anchorElFinalAdj, setAnchorElFinalAdj] = useState(null);

    const handleOpenManageColumnsFinalAdj = (event) => {
        setAnchorElFinalAdj(event.currentTarget);
        setManageColumnsOpenFinalAdj(true);
    };
    const handleCloseManageColumnsFinalAdj = () => {
        setManageColumnsOpenFinalAdj(false);
        setSearchQueryManageFinalAdj("");
    };

    const open = Boolean(anchorElFinalAdj);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRowsFinalAdj.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const getRowHeight = (params) => {
        // Find the item with adjstatus === 'Double Shift' in params.days array
        const doubleShiftDay = params.model.shiftallot && params.model.shiftallot.find(allot => allot.adjustmenttype === 'Add On Shift' || allot.adjustmenttype === 'Shift Adjustment');

        // If found, return the desired row height
        if (doubleShiftDay) {
            return 55; // Adjust this value as needed
        }

        // Return null to use default row height for other rows
        return 45;
    };

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

    // get all shifts
    const fetchShiftGroup = async () => {
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

        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchShiftGroup();
    }, [])

    // get all shifts name based on shiftgroup
    const fetchShiftFromShiftGroup = async (value) => {
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const [employees, setEmployees] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [valueCompany, setValueCompany] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [valueBranch, setValueBranch] = useState("");
    const [selectedUnit, setSelectedUnit] = useState([]);
    const [valueUnit, setValueUnit] = useState("");
    const [selectedDep, setSelectedDep] = useState([]);
    const [valueDep, setValueDep] = useState("");
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [valueEmp, setValueEmp] = useState("");

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

    //branch multiselect dropdown changes
    const handleBranchChangeFrom = (options) => {
        setSelectedBranch(options);
        setValueBranch(options.map((a, index) => {
            return a.value
        }))
        setSelectedUnit([]);
        setValueUnit("");
        setSelectedDep([]);
        setValueDep("");
        setSelectedEmp([]);
        setValueEmp("");
    };
    const customValueRendererBranchFrom = (valueBranch, _employeename) => {
        return valueBranch.length
            ? valueBranch.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };

    //unit multiselect dropdown changes
    const handleUnitChangeFrom = (options) => {
        setSelectedUnit(options);
        setValueUnit(options.map((a, index) => {
            return a.value
        }));
        setSelectedDep([]);
        setValueDep("");
        setSelectedEmp([]);
        setValueEmp('');
    };
    const customValueRendererUnitFrom = (valueUnit, _employeename) => {
        return valueUnit.length
            ? valueUnit.map(({ label }) => label).join(", ")
            : "Please Select Unit";
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

    // const handleFilterSubmit = (e) => {
    //     e.preventDefault();
    //     if (selectedBranch.length === 0) {
    //         setShowAlert(
    //             <>
    //                 <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //                 <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Branch"}</p>
    //             </>
    //         );
    //         handleClickOpenerr();
    //     }
    //     else if (selectedUnit.length === 0) {
    //         setShowAlert(
    //             <>
    //                 <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //                 <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Unit"}</p>
    //             </>
    //         );
    //         handleClickOpenerr();
    //     }
    //     else if (selectedEmp.length === 0) {
    //         setShowAlert(
    //             <>
    //                 <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
    //                 <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Employee"}</p>
    //             </>
    //         );
    //         handleClickOpenerr();
    //     }
    //     else {
    //         fetchUsers();
    //     }
    // }

    // const handleFilterClear = async (e) => {
    //     e.preventDefault();
    //     // setAllShiftAdj(true);
    //     // setAdjApply(true)
    //     // setAllFinalAdj(true);
    //     setSelectedCompany([]);
    //     setSelectedBranch([]);
    //     setSelectedUnit([]);
    //     setSelectedEmp([]);
    //     setValueBranch("");
    //     setValueUnit("");
    //     setValueEmp("");
    //     setAllUserDates([]);
    //     setAllUsers([]);
    //     setGetAdjStatusApprovedDates([]);
    //     setAllUsersAdjTable([]);
    //     setAllUsersShiftFinal([]);
    // }

    //get all Users
    const fetchUsers = async () => {
        // setAllShiftAdj(true);
        // setAdjApply(true)
        // setAllFinalAdj(true);
        try {
            let res = await axios.get(SERVICE.USER_X_EMPLOYEES, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let useraccess = res?.data?.users?.filter((user) => {
                // if (isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("HR")) {
                //     // if (valueCompany?.includes(user.company) && valueBranch?.includes(user.branch) && valueUnit?.includes(user.unit) && valueEmp?.includes(user.companyname)) {
                //     return user;
                //     // }
                // }
                // else {
                if (isUserRoleAccess?._id == user?._id) {
                    return user;
                }
                // }
            })
            // Filter out employees based on reasondate and doj date
            const filteredItems = useraccess?.filter((d) => {
                const [dojyear, dojmonth, dojday] = d.doj?.split("-");
                if (!Array.isArray(daysArray)) {
                    console.error("daysArray is not an array");
                    return false;
                }
                console.log(dojyear,'dojyear')
                console.log(dojmonth,'dojmonth')
                console.log(daysArray,'daysArray')
                return daysArray.some(column => {
                    const [day, month, year] = column.formattedDate?.split("/") || [];
                    const monthAsNumber = parseInt(month, 10);
                    const yearAsNumber = parseInt(year, 10);
                    if (d.doj && d.doj !== '') {
                        return yearAsNumber >= parseInt(dojyear, 10) && monthAsNumber >= parseInt(dojmonth, 10);
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
            setAllUserDates(resultshiftallot)
            setAllUsers(useraccess);

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
            setAllUsersShiftFinal(useraccess);
            setAllShiftAdj(true);
            setAdjApply(true)
            setAllFinalAdj(true);
        } catch (err) { setAllShiftAdj(true); setAdjApply(true); setAllFinalAdj(true); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        // if (isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("HR")) {
        // } else {
        fetchUsers();
        // }
    }, []);

    const fetchOverAllSettings = async () => {
        try {
            let res = await axios.get(SERVICE.GET_OVERALL_SETTINGS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            res?.data?.overallsettings.map((d) => {
                setOverallsettings(d.repeatinterval);
            })
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchOverAllSettings();
    }, []);

    // const currentDate = new Date(); // Get the current date
    // const currentDay = currentDate.getDate(); // Get the day of the month
    // const currentMonth = currentDate.getMonth() + 1; // Get the day of the month

    // // Get the total number of days in the month
    // const daysInMonth = getDaysInMonth(isMonthyear.isyear, isMonthyear.ismonth);

    // // Create an array of days from 1 to the total number of days in the month
    // const daysArray = Array.from(new Array(daysInMonth), (val, index) => {
    //     const dayOfMonth = index + 1;
    //     const currentDate = new Date(isMonthyear.isyear, isMonthyear.ismonth - 1, dayOfMonth);
    //     const formattedDate = format(currentDate, 'dd/MM/yyyy');
    //     const dayName = format(currentDate, 'EEEE'); // EEEE gives the full day name (e.g., Monday)
    //     return { dayOfMonth, formattedDate, dayName };
    // });

    // get current year
    const currentYear = new Date().getFullYear();

    // get current month in string name
    const monthstring = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

    let monthname = monthstring[new Date().getMonth()];
    // get current month
    let month = new Date().getMonth() + 1;

    const [isMonthyear, setIsMonthYear] = useState({ ismonth: month, isyear: currentYear, isuser: "" });

    // get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }

    const years = Array.from(new Array(10), (val, index) => currentYear - index);
    const getyear = years.map((year) => {
        return { value: year, label: year };
    });

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

    // Calculate the start date of the month based on the selected month
    const startDate = new Date(isMonthyear.isyear, isMonthyear.ismonth - 2, 1);

    // Calculate the end date of the month based on overallsettings
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + overallsettings);
    endDate.setDate(endDate.getDate() - 1);

    // Create an array of days from the start date to the end date
    const daysArray = [];
    let currentDate = new Date(startDate);
    let dayCount = 1;

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

    const getShiftTime = async (value) => {

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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

    // useEffect(() => {

    // }, [openEdit, shiftRoasterUserEdit]);

    //get single row to edit....
    const getCode = async (data, rowdata, shiftlabel) => {

        let res_shift = await axios.get(SERVICE.SHIFT, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
        });

        let res_shiftGroupings = await axios.get(SERVICE.GETALLSHIFTGROUPS, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
        });

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
        })
        setCheckWeekOff(rowdata.weekoff.includes(data.dayName) ? "Week Off" : "")


        // let filteredWeekOffDate = daysArray
        //     .filter(date => rowdata?.weekoff?.includes(date.dayName))
        //     .map(date => date.formattedDate);

        let filteredWeekOffDate = rowdata.overalldays
            .filter(item => item.shiftlabel === 'Week Off')
            .map(val => val.date);

        setWeekOffDates(filteredWeekOffDate);
        setWeekOffDatesOptions(filteredWeekOffDate.map(day => ({ label: day, value: day })))

        // find shift name
        const findShiftName = (shiftTime) => {
            if (!shiftTime) {
                return '';
            }

            let startTime = shiftTime?.split('to')[0];
            let endTime = shiftTime?.split('to')[1]

            let fromtime = startTime.slice(0, 5);
            let fromperiod = startTime.slice(5);

            let totime = endTime.slice(0, 5);
            let toperiod = endTime.slice(5);

            // Extract hours and minutes
            const [fromhours, fromminutes] = fromtime.split(':');
            const [tohours, tominutes] = totime.split(':');

            const foundShift = res_shift?.data?.shifts?.find((d) => d.fromhour === fromhours && d.frommin === fromminutes && d.fromtime === fromperiod &&
                d.tohour === tohours && d.tomin === tominutes && d.totime === toperiod);

            return foundShift ? foundShift.name : '';
        };

        // find shift grp
        const findShiftGroups = (shiftName) => {
            if (!shiftName) {
                return '';
            }
            const foundShiftName = res_shiftGroupings?.data?.shiftgroupings?.find((d) => d.shift.includes(shiftName));

            return foundShiftName ? `${foundShiftName.shiftday}_${foundShiftName.shifthours}` : '';
        }
        //check if manual allot is weekoff, to restrict adjustment type options
        const check = rowdata.overalldays.find((d) => d.date === data.formattedDate);
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

            // selectedColumnShiftMode: rowdata.weekoff.includes(data.dayName) ? "Week Off" : "First Shift",
            selectedColumnShiftMode: (check && check.shiftlabel === "Week Off" || rowdata.weekoff.includes(data.dayName)) ? "Week Off" : "First Shift",
            selectedColumnDate: data.formattedDate,
            selectedColumnShiftTime: shiftlabel === 'Week Off' ? 'Week Off' : (`${shiftlabel?.split('to')[0]} - ${shiftlabel?.split('to')[1]}`),
            // selectedColumnShiftGrpType: findShiftGroups(findShiftName(shiftlabel)),            
            // selectedColumnShiftName: findShiftName(shiftlabel),

            adjfirstshiftmode: '',
            adjustmenttype: "Change Shift",
            adjshiftgrptype: "Choose Day/Night",
            adjdate: '',
            adjweekdate: 'Choose Date',
            adjweekoffdate: 'Choose Date',
            adjchangeshift: "Choose Shift",
            adjchangeshiftime: "",
            adjchangereason: "",
            adjapplydate: formatDateForDate(currentTime),
            adjapplytime: String(formattedTime),
            shiftallotId: shiftallotIds, // Include the extracted _id in newobj

            secondmode: 'Choose 2nd Shiftmode',
            pluseshift: '',
        }
        setShiftRoasterUserEdit(newobj);
    };

    const [selectedDateShift, setSelectedDateShift] = useState('');

    const getSelectedDateShift = (value, empcodevalue) => {
        // Find the corresponding row in rowDataTableFinalAdj based on the provided empcodevalue
        const row = rowDataTableFinalAdj.find(item => item.empcode === empcodevalue);

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
        let matchedToDate = unMatchedAprrovedDate.filter(val => val.todate !== undefined).map(d => d.todate);

        // Remove the matched date from dateOptions
        weekOffDateOptions = weekOffDateOptions.filter(day => !matchedDate.includes(day.value));

        return weekOffDateOptions;
    }

    const sendRequest = async () => {
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const handleSubmit = () => {
        if (shiftRoasterUserEdit.adjustmenttype === 'Add On Shift') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Date"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose 2nd Shiftmode"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift (Day/Night))"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (getChangeShiftTypeTime == '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Shift Hours"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequest();
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'Change Shift') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Date"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift (Day/Night))"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (getChangeShiftTypeTime == '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Shift Hours"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequest();
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'Shift Weekoff Swap') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Date"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjweekdate === 'Choose Date') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Date"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose 2nd Shiftmode"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift (Day/Night))"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (getChangeShiftTypeTime == '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Shift Hours"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequest();
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'WeekOff Adjustment') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Date"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjweekoffdate === 'Choose Date') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Date"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequest();
            }
        }

        if (shiftRoasterUserEdit.adjustmenttype === 'Shift Adjustment') {
            if (shiftRoasterUserEdit.selectedColumnDate === "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Date"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.selectedColumnShiftTime === '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Cell To Get Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjweekdate === 'Choose Date') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Date"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.secondmode === 'Choose 2nd Shiftmode') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose 2nd Shiftmode"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjshiftgrptype === 'Choose Day/Night') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift (Day/Night))"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (shiftRoasterUserEdit.adjchangeshift === 'Choose Shift') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (getChangeShiftTypeTime == '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Shift Hours"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else if (selectedDateShift == '') {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Todate To Get First Shift"}</p>
                    </>
                );
                handleClickOpenerr();
            }
            else {
                sendRequest();
            }
        }
    }

    const handleSelectionChange = (newSelection) => {
        setSelectedRowsFinalAdj(newSelection.selectionModel);
    };

    const [overAllDepartment, setOverAllDepartment] = useState([]);
    const fetchDepartment = async () => {
        try {
            let res_status = await axios.get(SERVICE.DEPMONTHSET_ALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setOverAllDepartment(res_status.data.departmentdetails);
        } catch (err) {
            console.log(err.message)
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, [])

    // const addSerialNumberSetTable = () => {
    //     const itemsWithSerialNumber = allUsers?.map((item, index) => {

    //         return {
    //             ...item,
    //             serialNumber: index + 1,
    //         };
    //     });

    //     setItemsFinalAdj(itemsWithSerialNumber);
    // };

    const addSerialNumberSetTable = () => {
        const itemsWithSerialNumber = allUsers?.flatMap((item, index) => {

            // Map days for the user
            const days = daysArray.map((column, index) => {
                let filteredRowData = allUserDates.filter((val) => val.empcode == item.empcode);
                const matchingItem = filteredRowData.find(item => item.adjdate === column.formattedDate);
                const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
                const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
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
                const shiftsname = getShiftForDateAdj(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, (relevantDepLogEntry && relevantDepLogEntry.department));

                return {
                    id: `${item._id}_${column.formattedDate}_${index}`,
                    date: column.formattedDate,
                    adjstatus: matchingItem ?
                        (matchingItem.adjstatus === "Reject" ?
                            (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                                    (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
                            (matchingItem.adjstatus === "Approved" ? 'Approved' :
                                (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
                        (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                            matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                                (isWeekOffWithManual ? "Manual" :
                                    (isWeekOffWithAdjustment ? 'Adjustment' :
                                        (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
                                            (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
                                                (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
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

        setItemsFinalAdj(itemsWithSerialNumber.flat().map((item, index) => ({ ...item, serialNumber: index + 1 })));
    }

    useEffect(() => {
        addSerialNumberSetTable();
    }, [allUsers]);

    // Datatable
    const handlePageChangeSetTable = (newPage) => {
        setPageFinalAdj(newPage);
    };

    const handlePageSizeChangeSetTable = (event) => {
        setPageSizeFinalAdj(Number(event.target.value));
        setPageFinalAdj(1);
    };

    // datatable....
    const handleSearchChangeSetTable = (event) => {
        setSearchQueryFinalAdj(event.target.value);
    };
    // Split the search query into individual terms
    const searchTermsSetTable = searchQueryFinalAdj.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatasFinalAdj = itemsFinalAdj?.filter((item) => {
        return searchTermsSetTable.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataFinalAdj = filteredDatasFinalAdj?.slice((pageFinalAdj - 1) * pageSizeFinalAdj, pageFinalAdj * pageSizeFinalAdj);

    const totalPagesSetTable = Math.ceil(filteredDatasFinalAdj?.length / pageSizeFinalAdj);

    const visiblePagesSetTable = Math.min(totalPagesSetTable, 3);

    const firstVisiblePageSetTable = Math.max(1, pageFinalAdj - 1);
    const lastVisiblePageSetTable = Math.min(firstVisiblePageSetTable + visiblePagesSetTable - 1, totalPagesSetTable);

    const pageNumbersSetTable = [];

    const indexOfLastItemSetTable = pageFinalAdj * pageSizeFinalAdj;
    const indexOfFirstItemSetTable = indexOfLastItemSetTable - pageSizeFinalAdj;

    for (let i = firstVisiblePageSetTable; i <= lastVisiblePageSetTable; i++) {
        pageNumbersSetTable.push(i);
    }

    // Show All Columns & Manage Columns
    const initialColumnVisibilityFinalAdj = {
        serialNumber: true,
        checkbox: true,
        empcode: true,
        username: true,
        department: true,
        branch: true,
        unit: true,
        ...daysArray.reduce((acc, day, index) => {
            acc[`${index + 1}`] = true;
            return acc;
        }, {}),
    };

    const [columnVisibilityFinalAdj, setColumnVisibilityFinalAdj] = useState(initialColumnVisibilityFinalAdj);

    const CheckboxHeader = ({ selectAllCheckedFinalAdj, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllCheckedFinalAdj} onChange={onSelectAll} />
        </div>
    );

    const currentDate1Adj = new Date();

    // const getShiftForDateAdj = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, actualShiftTiming, boardingLog, isWeekOff, matchingDoubleShiftItem) => {
    //     if (matchingItem && matchingItem?.adjstatus === 'Adjustment') {
    //         return 'Pending...'
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Weekoff Swap') {
    //         return matchingDoubleShiftItem.todateshiftmode;
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'WeekOff Adjustment') {
    //         return matchingDoubleShiftItem.todateshiftmode;
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment') {
    //         return '';
    //     }
    //     // else if (matchingItem && matchingItem.adjstatus === 'Approved') {
    //     //     return isWeekOffWithAdjustment ? 
    //     //     (matchingItem.adjtypeshifttime !== "" ?
    //     //         `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` :
    //     //         (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off'))
    //     //         :
    //     //         (matchingItem.adjtypeshifttime !== "" ?
    //     //             `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` :
    //     //             (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off'));
    //     // }
    //     else if (matchingItem && matchingItem.adjstatus === 'Approved') {
    //         return (matchingItem.adjustmenttype === 'Add On Shift' || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
    //             (<div>
    //                 {`Main Shift : ${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}<br />
    //                 {`${matchingItem.secondmode} : ${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`}
    //             </div>) :
    //             (isWeekOffWithAdjustment ? (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`));

    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === "Manual") {
    //         return isWeekOffWithManual ? (`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`) :
    //             (`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`);
    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === "Week Off") {
    //         return 'Week Off';
    //     }
    //     else if (matchingItem && matchingItem.adjstatus === 'Reject' && isWeekOff) {
    //         // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
    //         return '';
    //     }
    //     // else if (boardingLog.length > 0) {
    //     //     if (!recentShiftTimingDate) {
    //     //         return '';
    //     //     }
    //     //     // const [year, month, day] = recentShiftTimingDate?.split('-');

    //     //     // // Map through each column and compare dates
    //     //     // const shifts = daysArray.map((currentColumn) => {
    //     //     //     const [day1, month1, year1] = currentColumn.formattedDate?.split('/');
    //     //     //     if (year >= year1 && month >= month1 && day > day1) {
    //     //     //         return isWeekOffWithAdjustment ? actualShiftTiming : (!isWeekOff ? actualShiftTiming : "");
    //     //     //     }
    //     //     //     else {
    //     //     //         return isWeekOffWithAdjustment ? recentShiftTiming : (!isWeekOff ? recentShiftTiming : "");
    //     //     //     }
    //     //     // });

    //     //     const shifts = daysArray?.map((currentColumn) => {
    //     //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
    //     //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
    //     //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
    //     //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);

    //     //         if (shiftFormattedDate >= columnFormattedDate) {
    //     //             return isWeekOffWithAdjustment ? actualShiftTiming : (!isWeekOff ? actualShiftTiming : "");
    //     //         } else {
    //     //             return isWeekOffWithAdjustment ? recentShiftTiming : (!isWeekOff ? recentShiftTiming : "");
    //     //         }
    //     //     });

    //     //     // Return the shift value for the current column
    //     //     return shifts[column.dayCount - 1];

    //     // }
    //     // before add shifttype condition working code
    //     // else if (boardingLog?.length > 0) {
    //     //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
    //     //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    //     //     // Filter boardingLog entries for the same start date
    //     //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

    //     //     // If there are entries for the date, return the shift timing of the second entry
    //     //     if (entriesForDate.length > 1) {
    //     //         return entriesForDate[1].shifttiming;
    //     //     }

    //     //     // Find the most recent boarding log entry that is less than or equal to the selected date
    //     //     const recentLogEntry = boardingLog
    //     //         .filter(log => log.startdate < finalDate)
    //     //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    //     //     // If a recent log entry is found, return its shift timing
    //     //     if (recentLogEntry) {
    //     //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
    //     //     } else {
    //     //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
    //     //         return !isWeekOff ? actualShiftTiming : "Week Off";
    //     //     }
    //     // }

    //     else if (boardingLog.length > 0) {

    //         // Remove duplicate entries with recent entry
    //         const uniqueEntries = {};
    //         boardingLog.forEach(entry => {
    //             const key = entry.startdate;
    //             if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
    //                 uniqueEntries[key] = entry;
    //             }
    //         });
    //         const uniqueBoardingLog = Object.values(uniqueEntries);

    //         const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
    //         const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;


    //         // Find the relevant log entry for the given date     
    //         const relevantLogEntry = uniqueBoardingLog
    //             .filter(log => log.startdate < finalDate)
    //             .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    //         if (relevantLogEntry) {
    //             // Daily
    //             if (relevantLogEntry.shifttype === 'Daily' || relevantLogEntry.shifttype === undefined) {
    //                 // If shift type is 'Daily', return the same shift timing for each day
    //                 return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
    //             }

    //             // 1 Week Rotation 2nd try working code
    //             if (relevantLogEntry.shifttype === '1 Week Rotation') {
    //                 for (const data of relevantLogEntry.todo) {
    //                     const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
    //                     if (data.week === columnWeek && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //             // 2 Week Rotation 2nd try working code  
    //             if (relevantLogEntry.shifttype === '2 Week Rotation') {
    //                 const startDate = new Date(relevantLogEntry.startdate); // Get the start date

    //                 // Get the day name of the start date
    //                 const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

    //                 // Calculate the day count until the next Sunday
    //                 let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

    //                 // Calculate the week number based on the day count
    //                 let weekNumber = Math.ceil((7 - dayCount) / 7);

    //                 // Adjust the week number considering the two-week rotation
    //                 const logStartDate = new Date(relevantLogEntry.startdate);
    //                 const currentDate = new Date(finalDate);

    //                 const diffTime = Math.abs(currentDate - logStartDate);
    //                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    //                 weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

    //                 // Determine the final week based on the calculated week number                    
    //                 const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

    //                 for (const data of relevantLogEntry.todo) {
    //                     // Check if the adjusted week matches the column week and day
    //                     if (data.week === finalWeek && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //             // 1 Month Rotation 1st try working code
    //             if (relevantLogEntry.shifttype === '1 Month Rotation') {
    //                 for (const data of relevantLogEntry.todo) {
    //                     if (data.week === column.weekNumberInMonth && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //             // 2 Month Rotation
    //             // if (relevantLogEntry.shifttype === '2 Month Rotation') {
    //             //     const startDate = new Date(relevantLogEntry.startdate); // Get the start date

    //             //     // Calculate the difference in months between start date and column formattedDate
    //             //     const startMonth = startDate.getMonth() + 1;
    //             //     const monthDiff = (columnYear - startDate.getFullYear()) * 12 + columnMonth - startMonth + 1;

    //             //     // Determine the final week based on month and week number
    //             //     let finalWeek;
    //             //     if (monthDiff % 2 === 0) {
    //             //         finalWeek = (
    //             //             column.weekNumberInMonth === '1st Week' ? '6th Week' :
    //             //                 column.weekNumberInMonth === '2nd Week' ? '7th Week' :
    //             //                     column.weekNumberInMonth === '3rd Week' ? '8th Week' :
    //             //                         column.weekNumberInMonth === '4th Week' ? '9th Week' :
    //             //                             column.weekNumberInMonth === '5th Week' ? '10th Week' :
    //             //                                 column.weekNumberInMonth // If not in the first five weeks, keep it the same
    //             //         );
    //             //     } else {
    //             //         finalWeek = column.weekNumberInMonth; // If the start month is odd, keep the week number the same
    //             //     }

    //             //     for (const data of relevantLogEntry.todo) {
    //             //         // Check if the adjusted week matches the column week and day
    //             //         if (data.week === finalWeek && data.day === column.dayName) {
    //             //             return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //             //         }
    //             //     }
    //             // }
    //             if (relevantLogEntry.shifttype === '2 Month Rotation') {
    //                 const [year, month, day] = relevantLogEntry.startdate.split('-').map(Number);

    //                 // Calculate the next month after the start date
    //                 const start = new Date(year, month, day + 1);
    //                 const currentDate = new Date(finalDate);

    //                 // Calculate the month count from the next month after the start date
    //                 const monthDiff = (currentDate.getFullYear() - start.getFullYear()) * 12 + currentDate.getMonth() - start.getMonth() + 1;


    //                 // Determine the final week based on the month count
    //                 let finalWeek;
    //                 if (monthDiff % 2 === 0) {
    //                     // Odd months return the column.weekNumberInMonth value
    //                     finalWeek = column.weekNumberInMonth;

    //                 } else {
    //                     // Adjust the week number accordingly for even months
    //                     finalWeek = (
    //                         column.weekNumberInMonth === '1st Week' ? '6th Week' :
    //                             column.weekNumberInMonth === '2nd Week' ? '7th Week' :
    //                                 column.weekNumberInMonth === '3rd Week' ? '8th Week' :
    //                                     column.weekNumberInMonth === '4th Week' ? '9th Week' :
    //                                         column.weekNumberInMonth === '5th Week' ? '10th Week' :
    //                                             column.weekNumberInMonth // If not in the first five weeks, keep it the same
    //                     );
    //                 }

    //                 for (const data of relevantLogEntry.todo) {
    //                     // Check if the adjusted week matches the column week and day
    //                     if (data.week === finalWeek && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //         }
    //         else {
    //             // If no date satisfies the condition, return actualShiftTiming
    //             // return !isWeekOff ? actualShiftTiming : "Week Off";
    //             return !isWeekOff ? "" : "Week Off";
    //         }
    //     }
    //     else {
    //         // If no date satisfies the condition, return actualShiftTiming
    //         // return !isWeekOff ? actualShiftTiming : "Week Off";
    //         return !isWeekOff ? "" : "Week Off";

    //     }
    // };


    // const getShiftForDateAdjCsv = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, actualShiftTiming, boardingLog, isWeekOff, matchingDoubleShiftItem) => {
    //     if (matchingItem && matchingItem?.adjstatus === 'Adjustment') {
    //         return 'Pending...'
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Weekoff Swap') {
    //         return matchingDoubleShiftItem.todateshiftmode;
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'WeekOff Adjustment') {
    //         return matchingDoubleShiftItem.todateshiftmode;
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment') {
    //         return '';
    //     }
    //     // else if (matchingItem && matchingItem.adjstatus === 'Approved') {
    //     //     return isWeekOffWithAdjustment ? 
    //     //     (matchingItem.adjtypeshifttime !== "" ?
    //     //         `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` :
    //     //         (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off'))
    //     //         :
    //     //         (matchingItem.adjtypeshifttime !== "" ?
    //     //             `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` :
    //     //             (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off'));
    //     // }
    //     else if (matchingItem && matchingItem.adjstatus === 'Approved') {
    //         return (matchingItem.secondmode === "Double Shift" && matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
    //             (`Main Shift : ${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}
    //                 ${matchingItem.secondmode} : ${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`
    //             ) :
    //             (isWeekOffWithAdjustment ? (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`));

    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === "Manual") {
    //         return isWeekOffWithManual ? (`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`) :
    //             (`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`);
    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === "Week Off") {
    //         return 'Week Off';
    //     }
    //     else if (matchingItem && matchingItem.adjstatus === 'Reject' && isWeekOff) {
    //         // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
    //         return '';
    //     }
    //     // else if (boardingLog.length > 0) {
    //     //     if (!recentShiftTimingDate) {
    //     //         return '';
    //     //     }
    //     //     // const [year, month, day] = recentShiftTimingDate?.split('-');

    //     //     // // Map through each column and compare dates
    //     //     // const shifts = daysArray.map((currentColumn) => {
    //     //     //     const [day1, month1, year1] = currentColumn.formattedDate?.split('/');
    //     //     //     if (year >= year1 && month >= month1 && day > day1) {
    //     //     //         return isWeekOffWithAdjustment ? actualShiftTiming : (!isWeekOff ? actualShiftTiming : "");
    //     //     //     }
    //     //     //     else {
    //     //     //         return isWeekOffWithAdjustment ? recentShiftTiming : (!isWeekOff ? recentShiftTiming : "");
    //     //     //     }
    //     //     // });

    //     //     const shifts = daysArray?.map((currentColumn) => {
    //     //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
    //     //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
    //     //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
    //     //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);

    //     //         if (shiftFormattedDate >= columnFormattedDate) {
    //     //             return isWeekOffWithAdjustment ? actualShiftTiming : (!isWeekOff ? actualShiftTiming : "");
    //     //         } else {
    //     //             return isWeekOffWithAdjustment ? recentShiftTiming : (!isWeekOff ? recentShiftTiming : "");
    //     //         }
    //     //     });

    //     //     // Return the shift value for the current column
    //     //     return shifts[column.dayCount - 1];

    //     // }
    //     // before add shifttype condition working code
    //     // else if (boardingLog?.length > 0) {
    //     //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
    //     //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

    //     //     // Filter boardingLog entries for the same start date
    //     //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

    //     //     // If there are entries for the date, return the shift timing of the second entry
    //     //     if (entriesForDate.length > 1) {
    //     //         return entriesForDate[1].shifttiming;
    //     //     }

    //     //     // Find the most recent boarding log entry that is less than or equal to the selected date
    //     //     const recentLogEntry = boardingLog
    //     //         .filter(log => log.startdate < finalDate)
    //     //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    //     //     // If a recent log entry is found, return its shift timing
    //     //     if (recentLogEntry) {
    //     //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
    //     //     } else {
    //     //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
    //     //         return !isWeekOff ? actualShiftTiming : "Week Off";
    //     //     }
    //     // }

    //     else if (boardingLog.length > 0) {

    //         // Remove duplicate entries with recent entry
    //         const uniqueEntries = {};
    //         boardingLog.forEach(entry => {
    //             const key = entry.startdate;
    //             if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
    //                 uniqueEntries[key] = entry;
    //             }
    //         });
    //         const uniqueBoardingLog = Object.values(uniqueEntries);

    //         const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
    //         const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;


    //         // Find the relevant log entry for the given date     
    //         const relevantLogEntry = uniqueBoardingLog
    //             .filter(log => log.startdate < finalDate)
    //             .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    //         if (relevantLogEntry) {
    //             // Daily
    //             if (relevantLogEntry.shifttype === 'Daily' || relevantLogEntry.shifttype === undefined) {
    //                 // If shift type is 'Daily', return the same shift timing for each day
    //                 return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
    //             }

    //             // 1 Week Rotation 2nd try working code
    //             if (relevantLogEntry.shifttype === '1 Week Rotation') {
    //                 for (const data of relevantLogEntry.todo) {
    //                     const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
    //                     if (data.week === columnWeek && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //             // 2 Week Rotation 2nd try working code  
    //             if (relevantLogEntry.shifttype === '2 Week Rotation') {
    //                 const startDate = new Date(relevantLogEntry.startdate); // Get the start date

    //                 // Get the day name of the start date
    //                 const startDayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

    //                 // Calculate the day count until the next Sunday
    //                 let dayCount = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(startDayName);

    //                 // Calculate the week number based on the day count
    //                 let weekNumber = Math.ceil((7 - dayCount) / 7);

    //                 // Adjust the week number considering the two-week rotation
    //                 const logStartDate = new Date(relevantLogEntry.startdate);
    //                 const currentDate = new Date(finalDate);

    //                 const diffTime = Math.abs(currentDate - logStartDate);
    //                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    //                 weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

    //                 // Determine the final week based on the calculated week number                    
    //                 const finalWeek = (weekNumber % 2 === 0) ? '1st Week' : '2nd Week';

    //                 for (const data of relevantLogEntry.todo) {
    //                     // Check if the adjusted week matches the column week and day
    //                     if (data.week === finalWeek && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //             // 1 Month Rotation 1st try working code
    //             if (relevantLogEntry.shifttype === '1 Month Rotation') {
    //                 for (const data of relevantLogEntry.todo) {
    //                     if (data.week === column.weekNumberInMonth && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //             // 2 Month Rotation
    //             // if (relevantLogEntry.shifttype === '2 Month Rotation') {
    //             //     const startDate = new Date(relevantLogEntry.startdate); // Get the start date

    //             //     // Calculate the difference in months between start date and column formattedDate
    //             //     const startMonth = startDate.getMonth() + 1;
    //             //     const monthDiff = (columnYear - startDate.getFullYear()) * 12 + columnMonth - startMonth + 1;

    //             //     // Determine the final week based on month and week number
    //             //     let finalWeek;
    //             //     if (monthDiff % 2 === 0) {
    //             //         finalWeek = (
    //             //             column.weekNumberInMonth === '1st Week' ? '6th Week' :
    //             //                 column.weekNumberInMonth === '2nd Week' ? '7th Week' :
    //             //                     column.weekNumberInMonth === '3rd Week' ? '8th Week' :
    //             //                         column.weekNumberInMonth === '4th Week' ? '9th Week' :
    //             //                             column.weekNumberInMonth === '5th Week' ? '10th Week' :
    //             //                                 column.weekNumberInMonth // If not in the first five weeks, keep it the same
    //             //         );
    //             //     } else {
    //             //         finalWeek = column.weekNumberInMonth; // If the start month is odd, keep the week number the same
    //             //     }

    //             //     for (const data of relevantLogEntry.todo) {
    //             //         // Check if the adjusted week matches the column week and day
    //             //         if (data.week === finalWeek && data.day === column.dayName) {
    //             //             return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //             //         }
    //             //     }
    //             // }

    //             if (relevantLogEntry.shifttype === '2 Month Rotation') {
    //                 const [year, month, day] = relevantLogEntry.startdate.split('-').map(Number);

    //                 // Calculate the next month after the start date
    //                 const start = new Date(year, month, day + 1);
    //                 const currentDate = new Date(finalDate);

    //                 // Calculate the month count from the next month after the start date
    //                 const monthDiff = (currentDate.getFullYear() - start.getFullYear()) * 12 + currentDate.getMonth() - start.getMonth() + 1;


    //                 // Determine the final week based on the month count
    //                 let finalWeek;
    //                 if (monthDiff % 2 === 0) {
    //                     // Odd months return the column.weekNumberInMonth value
    //                     finalWeek = column.weekNumberInMonth;

    //                 } else {
    //                     // Adjust the week number accordingly for even months
    //                     finalWeek = (
    //                         column.weekNumberInMonth === '1st Week' ? '6th Week' :
    //                             column.weekNumberInMonth === '2nd Week' ? '7th Week' :
    //                                 column.weekNumberInMonth === '3rd Week' ? '8th Week' :
    //                                     column.weekNumberInMonth === '4th Week' ? '9th Week' :
    //                                         column.weekNumberInMonth === '5th Week' ? '10th Week' :
    //                                             column.weekNumberInMonth // If not in the first five weeks, keep it the same
    //                     );
    //                 }

    //                 for (const data of relevantLogEntry.todo) {
    //                     // Check if the adjusted week matches the column week and day
    //                     if (data.week === finalWeek && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //         }
    //         else {
    //             // If no date satisfies the condition, return actualShiftTiming
    //             // return !isWeekOff ? actualShiftTiming : "Week Off";
    //             return !isWeekOff ? "" : "Week Off";
    //         }
    //     }
    //     else {
    //         // If no date satisfies the condition, return actualShiftTiming
    //         // return !isWeekOff ? actualShiftTiming : "Week Off";
    //         return !isWeekOff ? "" : "Week Off";
    //     }
    // };

    const getShiftForDateAdj = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department) => {

        if (matchingItem && matchingItem?.adjstatus === 'Adjustment') {
            return 'Pending...'
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Weekoff Swap') {
            return matchingDoubleShiftItem.todateshiftmode;
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'WeekOff Adjustment') {
            return matchingDoubleShiftItem.todateshiftmode;
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment') {
            return '';
        }
        else if (matchingItem && matchingItem.adjstatus === 'Approved') {
            return (matchingItem.adjustmenttype === 'Add On Shift' || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
                (<div>
                    {`Main Shift : ${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}<br />
                    {`${matchingItem.secondmode} : ${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`}
                </div>) :
                (isWeekOffWithAdjustment ? (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`));

        }
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

                //     // // Determine the effective month for the start date
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

                //     // // Adjust February for leap years
                //     // if (isLeapYear(endDate.getFullYear())) {
                //     //     monthLengths[1] = 29;
                //     // }

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
                //     console.log(monthLengths, 'monthLengths')
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

                //     console.log({
                //         startDate,
                //         currentDate,
                //         endDate,
                //         diffTime,
                //         diffDays,
                //         weekNumber,
                //         finalWeek,
                //     });

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

    const getShiftForDateAdjCsv = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department) => {
        if (matchingItem && matchingItem?.adjstatus === 'Adjustment') {
            return 'Pending...'
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Weekoff Swap') {
            return matchingDoubleShiftItem.todateshiftmode;
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'WeekOff Adjustment') {
            return matchingDoubleShiftItem.todateshiftmode;
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment') {
            return '';
        }
        // else if (matchingItem && matchingItem.adjstatus === 'Approved') {
        //     return isWeekOffWithAdjustment ? 
        //     (matchingItem.adjtypeshifttime !== "" ?
        //         `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` :
        //         (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off'))
        //         :
        //         (matchingItem.adjtypeshifttime !== "" ?
        //             `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` :
        //             (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off'));
        // }
        else if (matchingItem && matchingItem.adjstatus === 'Approved') {
            return (matchingItem.adjustmenttype === "Add On Shift" || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
                (`Main Shift : ${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}
                    ${matchingItem.secondmode} : ${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`
                ) :
                (isWeekOffWithAdjustment ? (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`));
        }
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
        // else if (boardingLog.length > 0) {
        //     if (!recentShiftTimingDate) {
        //         return '';
        //     }
        //     // const [year, month, day] = recentShiftTimingDate?.split('-');

        //     // // Map through each column and compare dates
        //     // const shifts = daysArray.map((currentColumn) => {
        //     //     const [day1, month1, year1] = currentColumn.formattedDate?.split('/');
        //     //     if (year >= year1 && month >= month1 && day > day1) {
        //     //         return isWeekOffWithAdjustment ? actualShiftTiming : (!isWeekOff ? actualShiftTiming : "");
        //     //     }
        //     //     else {
        //     //         return isWeekOffWithAdjustment ? recentShiftTiming : (!isWeekOff ? recentShiftTiming : "");
        //     //     }
        //     // });

        //     const shifts = daysArray?.map((currentColumn) => {
        //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
        //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
        //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
        //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);

        //         if (shiftFormattedDate >= columnFormattedDate) {
        //             return isWeekOffWithAdjustment ? actualShiftTiming : (!isWeekOff ? actualShiftTiming : "");
        //         } else {
        //             return isWeekOffWithAdjustment ? recentShiftTiming : (!isWeekOff ? recentShiftTiming : "");
        //         }
        //     });

        //     // Return the shift value for the current column
        //     return shifts[column.dayCount - 1];

        // }

        // working code before add daily, 1week rotation, 2week rotation, 1month rotation and 2month rotation
        // else if (boardingLog?.length > 0) {
        //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
        //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

        //     // Filter boardingLog entries for the same start date
        //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

        //     // If there are entries for the date, return the shift timing of the second entry
        //     if (entriesForDate.length > 1) {
        //         return entriesForDate[1].shifttiming;
        //     }

        //     // Find the most recent boarding log entry that is less than or equal to the selected date
        //     const recentLogEntry = boardingLog
        //         .filter(log => log.startdate < finalDate)
        //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

        //     // If a recent log entry is found, return its shift timing
        //     if (recentLogEntry) {
        //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
        //     } else {
        //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
        //         return !isWeekOff ? actualShiftTiming : "Week Off";
        //     }
        // }

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

                    console.log({
                        startDate,
                        currentDate,
                        endDate,
                        diffTime,
                        diffDays,
                        weekNumber,
                        finalWeek,
                    });

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

                //     console.log({
                //         startDate,
                //         currentDate,
                //         endDate,
                //         diffTime,
                //         diffDays,
                //         weekNumber,
                //         finalWeek,
                //     });

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

    const columnDataTableFinalAdj = [
        // {
        //     field: "checkbox",
        //     headerName: "Checkbox", // Default header name
        //     headerStyle: { fontWeight: "bold", },
        //     renderHeader: (params) => (
        //         <CheckboxHeader
        //             selectAllCheckedFinalAdj={selectAllCheckedFinalAdj}
        //             onSelectAll={() => {
        //                 if (rowDataTableFinalAdj?.length === 0) {
        //                     // Do not allow checking when there are no rows
        //                     return;
        //                 }
        //                 if (selectAllCheckedFinalAdj) {
        //                     setSelectedRowsFinalAdj([]);
        //                 } else {
        //                     const allRowIds = rowDataTableFinalAdj?.map((row) => row.id);
        //                     setSelectedRowsFinalAdj(allRowIds);
        //                 }
        //                 setSelectAllCheckedFinalAdj(!selectAllCheckedFinalAdj);
        //             }}
        //         />
        //     ),

        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={selectedRowsFinalAdj.includes(params.row.id)}
        //             onChange={() => {
        //                 let updatedSelectedRows;
        //                 if (selectedRowsFinalAdj.includes(params.row.id)) {
        //                     updatedSelectedRows = selectedRowsFinalAdj.filter((selectedId) => selectedId !== params.row.id);
        //                 } else {
        //                     updatedSelectedRows = [...selectedRowsFinalAdj, params.row.id];
        //                 }

        //                 setSelectedRowsFinalAdj(updatedSelectedRows);

        //                 // Update the "Select All" checkbox based on whether all rows are selected
        //                 setSelectAllCheckedFinalAdj(updatedSelectedRows?.length === filteredDataFinalAdj?.length);
        //             }}
        //         />
        //     ),
        //     sortable: false, // Optionally, you can make this column not sortable
        //     width: 70,
        //     hide: !columnVisibilityFinalAdj.checkbox,
        //     headerClassName: "bold-header",
        // },
        { field: "serialNumber", headerName: "SNo", flex: 0, width: 75, hide: !columnVisibilityFinalAdj.serialNumber, headerClassName: "bold-header", },
        { field: "empcode", headerName: "Emp Code", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.empcode, headerClassName: "bold-header" },
        { field: "username", headerName: "Name", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.username, headerClassName: "bold-header" },
        { field: "department", headerName: "Department", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.department, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 150, hide: !columnVisibilityFinalAdj.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 100, hide: !columnVisibilityFinalAdj.unit, headerClassName: "bold-header" },

        ...daysArray.map((column, index) => {

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
                field: `${index + 1}`,
                headerName: `${column.formattedDate} ${column.dayName} Day${column.dayCount}`,
                hide: !columnVisibilityFinalAdj[`${column.formattedDate} ${column.dayName} Day${column.dayCount}`],
                flex: 0,
                width: 180,
                sortable: false,
                renderCell: (params) => {
                    let filteredRowData = allUserDates.filter((val) => val.empcode == params.row.empcode);
                    const matchingItem = filteredRowData.find(item => item.adjdate == column.formattedDate);
                    const dayData = params.row.days?.find(day => day.date === column.formattedDate);
                    // Check if dayData is defined
                    if (!dayData) {
                        return null; // or return a default component
                    }

                    // console.log(dayData, 'dayData')

                    // const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
                    // Check if the dayName is Sunday or Monday ...
                    // const isWeekOff = params.row.weekoff?.includes(column.dayName);                  

                    // const isWeekOff = filterBoardingLog.length > 0 ? filterBoardingLog[filterBoardingLog.length - 1].weekoff?.includes(column.dayName) : false;
                    // const isWeekOff = params.row.days[index].shiftlabel === 'Week Off' ? true : false;
                    const isWeekOff = dayData?.shiftlabel === 'Week Off' ? true : false;

                    // Disable the button if the date is before the current date
                    // const isDisabled = (currentyear >= formatyear1 && currentmonth >= fromatmonth1 && currentday > formatday1);
                    // const isDisabled = (columnFormattedDate <= currentFormattedDate)
                    const isDisabled = new Date(columnFormattedDate) < currentDate;

                    const reasonDate = new Date(params.row.reasondate);
                    const dojDate = new Date(params.row.doj);
                    const isDisable1 = formattedDateNew < dojDate
                    const isDisable2 = formattedDateNew > reasonDate

                    if (params.row.reasondate && params.row.reasondate != "" && formattedDateNew > reasonDate) {
                        return (
                            <Grid>
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
                                    {params.row.resonablestatus}
                                </Button>
                            </Grid >
                        );
                    }
                    else if (params.row.doj && params.row.doj != "" && formattedDateNew < dojDate) {
                        return (
                            <Grid>
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
                            </Grid >
                        );
                    }
                    else if (params.row.doj && params.row.doj != "" && formattedDateNew >= dojDate) {
                        if (!dayData?.adjstatus) {
                            return null; // or return a default component
                        }
                        return (
                            <Grid>
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
                                        // padding: params.row.days[index].adjstatus === 'Approved' ? '3px 8px' : isWeekOff ? '3px 10px' : '3px 8px',
                                        // color: params.row.days[index].adjstatus === "Week Off" ? '#892a23' : params.row.days[index].adjstatus === 'Manual' ? '#052106' : params.row.days[index].adjstatus === 'Adjustment' ? 'white' : params.row.days[index].adjstatus === 'Approved' ? '#052106' : isWeekOff ? '#892a23' : params.row.days[index].adjstatus === '' ? 'none' : 'white',
                                        // backgroundColor: isDisabled ? params.row.days[index].adjstatus === '' ? 'none' : 'rgba(224, 224, 224, 1)' : (params.row.days[index].adjstatus === "Week Off" ? 'rgb(243 174 174)' : params.row.days[index].adjstatus === 'Manual' ? 'rgb(243 203 117)' : params.row.days[index].adjstatus === 'Adjustment' ? '#1976d2' : params.row.days[index].adjstatus === 'Approved' ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : params.row.days[index].adjstatus === '' ? 'none' : '#1976d2'),
                                        // pointerEvents: (params.row.days[index].adjstatus === 'Approved' || params.row.days[index].adjstatus === '' || matchingItem && matchingItem?.secondmode) ? 'none' : 'auto',
                                        // '&:hover': {
                                        //     color: params.row.days[index].adjstatus === "Week Off" ? '#892a23' : params.row.days[index].adjstatus === 'Manual' ? '#052106' : params.row.days[index].adjstatus === 'Adjustment' ? 'white' : params.row.days[index].adjstatus === 'Approved' ? '#052106' : isWeekOff ? '#892a23' : params.row.days[index].adjstatus === '' ? 'none' : 'white',
                                        //     backgroundColor: params.row.days[index].adjstatus === "Week Off" ? 'rgb(243 174 174)' : params.row.days[index].adjstatus === 'Manual' ? 'rgb(243 203 117)' : params.row.days[index].adjstatus === 'Adjustment' ? '#1976d2' : params.row.days[index].adjstatus === 'Approved' ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : params.row.days[index].adjstatus === '' ? 'none' : '#1976d2',
                                        // },
                                        padding: dayData?.adjstatus === 'Approved' ? '3px 8px' : isWeekOff ? '3px 10px' : '3px 8px',
                                        color: dayData?.adjstatus === "Week Off" ? '#892a23' : dayData?.adjstatus === 'Manual' ? '#052106' : dayData?.adjstatus === 'Adjustment' ? 'white' : dayData?.adjstatus === 'Approved' ? '#052106' : isWeekOff ? '#892a23' : dayData?.adjstatus === '' ? 'none' : 'white',
                                        backgroundColor: isDisabled ? dayData?.adjstatus === '' ? 'none' : 'rgba(224, 224, 224, 1)' : (dayData?.adjstatus === "Week Off" ? 'rgb(243 174 174)' : dayData?.adjstatus === 'Manual' ? 'rgb(243 203 117)' : dayData?.adjstatus === 'Adjustment' ? '#1976d2' : dayData?.adjstatus === 'Approved' ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : dayData?.adjstatus === '' ? 'none' : '#1976d2'),
                                        pointerEvents: (dayData?.adjstatus === 'Approved' || dayData?.adjstatus === '' || matchingItem && matchingItem?.secondmode) ? 'none' : 'auto',
                                        '&:hover': {
                                            color: dayData?.adjstatus === "Week Off" ? '#892a23' : dayData?.adjstatus === 'Manual' ? '#052106' : dayData?.adjstatus === 'Adjustment' ? 'white' : dayData?.adjstatus === 'Approved' ? '#052106' : isWeekOff ? '#892a23' : dayData?.adjstatus === '' ? 'none' : 'white',
                                            backgroundColor: dayData?.adjstatus === "Week Off" ? 'rgb(243 174 174)' : dayData?.adjstatus === 'Manual' ? 'rgb(243 203 117)' : dayData?.adjstatus === 'Adjustment' ? '#1976d2' : dayData?.adjstatus === 'Approved' ? 'rgb(156 239 156)' : isWeekOff ? 'rgb(243 174 174)' : dayData?.adjstatus === '' ? 'none' : '#1976d2',
                                        },
                                    }}
                                    // Disable the button if the date is before the current date
                                    disabled={isDisabled}
                                    onClick={(e) => {
                                        if (matchingItem && matchingItem?.adjstatus === 'Approved') {
                                            // Handle the case when the status is 'Approved'
                                        }
                                        else if (matchingItem && matchingItem?.adjstatus === '') {
                                            // Handle the case when the status is ''
                                        } else {
                                            // getCode(column, params.row, params.row.days[index].shiftlabel);
                                            getCode(column, params.row, dayData?.shiftlabel);
                                        }
                                    }}
                                >
                                    {/* {params.row.days[index].adjstatus} */}
                                    {dayData?.adjstatus}
                                </Button>
                                <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                    {/* {params.row.days[index].shiftlabel} */}
                                    {dayData?.shiftlabel}
                                </Typography>
                            </Grid >
                        );
                    }
                },
            }
        }),
    ];

    const rowDataTableFinalAdj = filteredDataFinalAdj?.map((item, index) => {
        return {
            id: `${item._id}_${index}`,
            userid: item._id,
            serialNumber: item.serialNumber,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            department: item.department,
            username: item.companyname,
            empcode: item.empcode,
            weekoff: item.weekoff,
            boardingLog: item.boardingLog,
            shiftallot: item.shiftallot,
            doj: item.doj,
            reasondate: item.reasondate,
            resonablestatus: item.resonablestatus,
            overalldays: item.overalldays,
            days: item.days,
            // days: daysArray.map((column, index) => {
            //     let filteredRowData = allUserDates.filter((val) => val.empcode == item.empcode);
            //     const matchingItem = filteredRowData.find(item => item.adjdate === column.formattedDate);
            //     const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
            //     const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
            //     const filterBoardingLog = item?.boardingLog && item?.boardingLog?.filter((item) => {
            //         // return item.logcreation === "user" || item.logcreation === "shift";
            //         return item;
            //     });

            //     // Check if the dayName is Sunday or Monday
            //     // const isWeekOff = item.weekoff?.includes(column.dayName);
            //     const isWeekOff = getWeekOffDay(column, filterBoardingLog, item?.department, overAllDepartment) === "Week Off" ? true : false;
            //     // Check if it's a week off day and has an adjustment
            //     const isWeekOffWithAdjustment = isWeekOff && matchingItem;
            //     const isWeekOffWithManual = isWeekOff && matchingItemAllot;

            //     return {
            //         // adjstatus: matchingItem ? matchingItem.adjstatus : matchingItemAllot && matchingItemAllot.status == "Manual" ? 'Manual' : isWeekOffWithManual ? "Manual" : isWeekOffWithAdjustment ? 'Adjustment' :  (isWeekOff ? 'Week Off' : 'Adjustment'),

            //         // adjstatus: matchingItem ?
            //         //     (matchingItem.adjstatus === "Reject" ? (isWeekOffWithAdjustment ? 'Week Off' : matchingItemAllot && matchingItemAllot.status == 'Manual' ? 'Manual' : 'Adjustment') : matchingItem.adjstatus) :
            //         //     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //         //         (isWeekOffWithManual ? "Manual" :
            //         //             (isWeekOffWithAdjustment ? 'Adjustment' :
            //         //                 (isWeekOff ? 'Week Off' : 'Adjustment')))),                  

            //         // adjstatus: matchingItem ?
            //         //     (matchingItem.adjstatus === "Reject" ?
            //         //         (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment') :
            //         //     (matchingItem.adjstatus === "Approved" ? 'Approved' :
            //         //         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' : 'Adjustment'))) :
            //         //     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //         //             (isWeekOffWithManual ? 'Manual' :
            //         //                 (isWeekOffWithAdjustment ? 'Adjustment' :
            //         //                     (isWeekOff ? 'Week Off' : 'Adjustment')))),

            //         // adjstatus: matchingItem ?
            //         //     (matchingItem.adjstatus === "Reject" ?
            //         //         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //         //             matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
            //         //                 'Adjustment') :
            //         //         (matchingItem.adjstatus === "Approved" ? 'Approved' :
            //         //             (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
            //         //     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //         //         matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
            //         //             (isWeekOffWithManual ? "Manual" :
            //         //                 (isWeekOffWithAdjustment ? 'Adjustment' :
            //         //                     (isWeekOff ? 'Week Off' : 'Adjustment')))),
            //         date: column.formattedDate,
            //         adjstatus: matchingItem ?
            //             (matchingItem.adjstatus === "Reject" ?
            //                 (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //                     matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
            //                         (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
            //                 (matchingItem.adjstatus === "Approved" ? 'Approved' :
            //                     (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
            //             (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //                 matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
            //                     (isWeekOffWithManual ? "Manual" :
            //                         (isWeekOffWithAdjustment ? 'Adjustment' :
            //                             (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
            //                                 (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
            //                                     (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
            //                                         (isWeekOff ? 'Week Off' : 'Adjustment'))))))),

            //         // adjstatus: matchingItem ?
            //         //     (matchingItem.adjstatus === "Reject" ?
            //         //         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //         //             matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
            //         //                 (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
            //         //         (matchingItem.adjstatus === "Approved" ?
            //         //             (matchingItem.adjfirstshiftmode === 'Week Off' ? 'Week Off' : 'Approved') : // New condition here
            //         //             (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
            //         //     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //         //         matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
            //         //             (isWeekOffWithManual ? "Manual" :
            //         //                 (isWeekOffWithAdjustment ? 'Adjustment' :
            //         //                     (isWeekOff ? 'Week Off' : 'Adjustment')))),


            //         shiftlabel: getShiftForDateAdj(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department),
            //         empCode: item.empcode,
            //     };

            // }),
        };
    });

    useEffect(() => {

    }, [rowDataTableFinalAdj])

    const rowsWithCheckboxesFinalAdj = rowDataTableFinalAdj?.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRowsFinalAdj.includes(row.id),
    }));

    // Show All Columns functionality
    const handleShowAllColumnsFinalAdj = () => {
        const updatedVisibility = { ...columnVisibilityFinalAdj };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityFinalAdj(updatedVisibility);
    };

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityFinalAdj");
        if (savedVisibility) {
            setColumnVisibilityFinalAdj(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibilityFinalAdj", JSON.stringify(columnVisibilityFinalAdj));
    }, [columnVisibilityFinalAdj]);

    // // Function to filter columns based on search query
    const filteredColumnsFinalAdj = columnDataTableFinalAdj.filter((column) => column.headerName.toLowerCase().includes(searchQueryManageFinalAdj.toLowerCase()));

    // Manage Columns functionality
    const toggleColumnVisibilityFinalAdj = (field) => {
        setColumnVisibilityFinalAdj((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentFinalAdj = (
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsFinalAdj}
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
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManageFinalAdj} onChange={(e) => setSearchQueryManageFinalAdj(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsFinalAdj?.map((column, index) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibilityFinalAdj[column.field]} onChange={() => toggleColumnVisibilityFinalAdj(column.field)} />}
                                // secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" :
                                        (column.field === `${index + 1}` ? `column.headerName` : column.headerName)
                                }
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibilityFinalAdj(initialColumnVisibilityFinalAdj)}>
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
                                columnDataTableFinalAdj.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityFinalAdj(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );

    // Excel
    // Extracting headers from filteredColumnsSetTable
    // const headers = [
    //     'S.No',
    //     'Emp Code',
    //     'Name',
    //     'Branch',
    //     'Unit',
    //     // Add headers for date columns dynamically
    //     ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),
    // ];

    // Constructing data in the required format
    // const data = [
    //     headers, // First row should be headers
    //     ...filteredDataFinalAdj.map((item) => {
    //         const rowData = [
    //             item.serialNumber,
    //             item.empcode,
    //             item.username,
    //             item.branch,
    //             item.unit,
    //         ];

    //         // Create an object to store data for each day
    //         const dayData = {};

    //         // daysArray.forEach((column) => {
    //         //     // // Check if the current day is Sunday
    //         //     // const isSunday = column.dayName === "Sunday";

    //         //     // // If it's Sunday, set the default value to "Week Off"
    //         //     // if (isSunday) {
    //         //     //     rowData.push("Week Off");
    //         //     //     return; // Move to the next iteration
    //         //     // }

    //         //     // Find the dayData corresponding to the current date
    //         //     const matchingDay = item.days.find(
    //         //         (day) =>
    //         //             moment(day.adjdate).format("DD/MM/YYYY") === column.formattedDate
    //         //     );

    //         //     const matchingDay2 = item.days.find(
    //         //         (day) => formatDate(day.date) === column.formattedDate
    //         //     );


    //         //     let dayValue = "";

    //         //     // Use the matchingDay data to populate the dayData object
    //         //     if (matchingDay && matchingDay.adjstatus === "Approved") {
    //         //         dayValue = matchingDay.adjtypeshifttime || "No Data";
    //         //     } else if (
    //         //         matchingDay2 &&
    //         //         (matchingDay2.adjstatus === undefined ||
    //         //             matchingDay2.adjstatus === "" ||
    //         //             matchingDay2.adjstatus === "Reject" ||
    //         //             matchingDay2.adjstatus === "Adjustment")
    //         //     ) {
    //         //         dayValue = matchingDay2.firstshift
    //         //             ? `${matchingDay2.firstshift.split(' - ')[0]} to ${matchingDay2.firstshift.split(' - ')[1]}\n${matchingDay2.pluseshift.split(' - ')[0]} to ${matchingDay2.pluseshift.split(' - ')[1]}`
    //         //             : matchingDay2.mode;
    //         //     } else {
    //         //         item.days.map((day) => {
    //         //             if (day.adjstatus === "Approved") {
    //         //                 if (formatDate(day.date) === column.formattedDate) {
    //         //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : `Adjusted\n${item.shifttiming}`;
    //         //                 } else {
    //         //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : item.shifttiming;
    //         //                 }
    //         //             }
    //         //         })
    //         //     }

    //         //     rowData.push(dayValue);
    //         // });

    //         return rowData;
    //     }),
    // ];


    // print...
    // const componentRefSetTable = useRef();
    // const handlePrintMyAdj = useReactToPrint({
    //     content: () => componentRefSetTable.current,
    //     documentTitle: "Shift Status List",
    //     pageStyle: "print",
    // });

    // // // pdf.....
    // // const downloadPdfSetTable = () => {
    // //     const doc = new jsPDF({ orientation: "landscape" });
    // //     doc.autoTable({
    // //         theme: "grid",
    // //         styles: { fontSize: 4, },
    // //         width: 'max-content',
    // //         html: '#usershiftlistpdf'
    // //     })
    // //     doc.save("Shift Adjustment List.pdf");
    // // };

    // const downloadPdfSetTable = () => {
    //     const doc = new jsPDF({ orientation: "landscape" });

    //     // Define the table headers
    //     const headers = ["S.No", "Emp Code", "Name", "Branch", "Unit", ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),];

    //     // Constructing data in the required format
    //     // const data = [
    //     //     // First row should be headers
    //     //     ...filteredDataFinalAdj.map((item) => {
    //     //         const rowData = [
    //     //             item.serialNumber,
    //     //             item.empcode,
    //     //             item.username,
    //     //             item.branch,
    //     //             item.unit,
    //     //         ];

    //     //         // Create an object to store data for each day
    //     //         const dayData = {};

    //     //         // daysArray.forEach((column) => {
    //     //         //     // // Check if the current day is Sunday
    //     //         //     // const isSunday = column.dayName === "Sunday";

    //     //         //     // // If it's Sunday, set the default value to "Week Off"
    //     //         //     // if (isSunday) {
    //     //         //     //     rowData.push("Week Off");
    //     //         //     //     return; // Move to the next iteration
    //     //         //     // }

    //     //         //     // Find the dayData corresponding to the current date
    //     //         //     const matchingDay = item.days.find(
    //     //         //         (day) =>
    //     //         //             moment(day.adjdate).format("DD/MM/YYYY") === column.formattedDate
    //     //         //     );

    //     //         //     const matchingDay2 = item.days.find(
    //     //         //         (day) => formatDate(day.date) === column.formattedDate
    //     //         //     );

    //     //         //     let dayValue = ""; // Default value

    //     //         //     // Use the matchingDay data to populate the dayData object
    //     //         //     if (matchingDay && matchingDay.adjstatus === "Approved") {
    //     //         //         dayValue = matchingDay.adjtypeshifttime;
    //     //         //     } else if (
    //     //         //         matchingDay2 &&
    //     //         //         (matchingDay2.adjstatus === undefined ||
    //     //         //             matchingDay2.adjstatus === "" ||
    //     //         //             matchingDay2.adjstatus === "Reject" ||
    //     //         //             matchingDay2.adjstatus === "Adjustment")
    //     //         //     ) {
    //     //         //         dayValue = matchingDay2.firstshift
    //     //         //             ? `${matchingDay2.firstshift.split(' - ')[0]} to ${matchingDay2.firstshift.split(' - ')[1]}`
    //     //         //             : matchingDay2.mode;
    //     //         //     } else {
    //     //         //         item.days.map((day) => {
    //     //         //             if (day.adjstatus === "Approved") {
    //     //         //                 if (formatDate(day.date) === column.formattedDate) {
    //     //         //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : `Adjusted\n${item.shifttiming}`;
    //     //         //                 } else {
    //     //         //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : item.shifttiming;
    //     //         //                 }
    //     //         //             }
    //     //         //         })
    //     //         //     }

    //     //         //     rowData.push(dayValue);
    //     //         // });

    //     //         return rowData;
    //     //     }),
    //     // ];

    //     const data = [
    //         ...filteredDataFinalAdj.map((row, index) => [
    //             row.serialNumber,
    //             row.empcode,
    //             row.username,
    //             row.branch,
    //             row.unit,
    //             // Add data for date columns dynamically           
    //             ...daysArray.map(column => {
    //                 let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
    //                 const matchingItem = filteredRowData.find(item => item.adjdate === column.formattedDate);
    //                 const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
    //                 const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
    //                 const isWeekOff = row.weekoff?.includes(column.dayName);
    //                 // Check if it's a week off day and has an adjustment
    //                 const isWeekOffWithAdjustment = isWeekOff && matchingItem;
    //                 const isWeekOffWithManual = isWeekOff && matchingItemAllot;

    //                 // ${matchingItem ?
    //                 //     (matchingItem.adjstatus === "Reject" ?
    //                 //         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
    //                 //             matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
    //                 //                 'Adjustment') :
    //                 //         (matchingItem.adjstatus === "Approved" ? 'Approved' :
    //                 //             (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
    //                 //     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
    //                 //         matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
    //                 //             (isWeekOffWithManual ? "Manual" :
    //                 //                 (isWeekOffWithAdjustment ? 'Adjustment' :
    //                 //                     (isWeekOff ? 'Week Off' : 'Adjustment'))))
    //                 //     }
    //                 return `${matchingItem ?
    //                     (matchingItem.adjstatus === "Reject" ?
    //                         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
    //                             matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
    //                                 (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
    //                         (matchingItem.adjstatus === "Approved" ? 'Approved' :
    //                             (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
    //                     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
    //                         matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
    //                             (isWeekOffWithManual ? "Manual" :
    //                                 (isWeekOffWithAdjustment ? 'Adjustment' :
    //                                     (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
    //                                         (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
    //                                             (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
    //                                                 (isWeekOff ? 'Week Off' : 'Adjustment')))))))
    //                     }

    // \n${getShiftForDateAdjCsv(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, row.actualShiftTiming, row.boardingLog, isWeekOff, matchingDoubleShiftItem)}`;
    //             }),
    //         ]),
    //     ];

    //     // Split data into chunks to fit on pages
    //     const columnsPerSheet = 10; // Number of columns per sheet
    //     const chunks = [];

    //     for (let i = 0; i < headers.length; i += columnsPerSheet) {
    //         const chunkHeaders = headers.slice(i, i + columnsPerSheet);
    //         const chunkData = data.map(row => row.slice(i, i + columnsPerSheet + 1));

    //         chunks.push({ headers: chunkHeaders, data: chunkData });
    //     }

    //     chunks.forEach((chunk, index) => {
    //         if (index > 0) {
    //             doc.addPage({ orientation: "landscape" }); // Add a new landscape page for each chunk, except the first one
    //         }

    //         doc.autoTable({
    //             theme: "grid",
    //             styles: { fontSize: 8 },
    //             head: [chunk.headers],
    //             body: chunk.data,
    //             startY: 20, // Adjust startY to leave space for headers
    //             margin: { top: 20, left: 10, right: 10, bottom: 10 } // Adjust margin as needed
    //         });
    //     });

    //     doc.save("Shift Status List.pdf");
    // };

    // // image
    // const handleCaptureImageMyAdj = () => {
    //     if (gridRefFinalAdj.current) {
    //         html2canvas(gridRefFinalAdj.current).then((canvas) => {
    //             canvas.toBlob((blob) => {
    //                 saveAs(blob, "Shift Status List.png");
    //             });
    //         });
    //     }
    // };

    // Excel
    // Extracting headers from filteredColumnsSetTable
    // const headers = [
    //     'S.No',
    //     'Emp Code',
    //     'Name',
    //     'Branch',
    //     'Unit',
    //     // Add headers for date columns dynamically
    //     ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),
    // ];

    // Constructing data in the required format
    // const data = [
    //     headers, // First row should be headers
    //     ...filteredDataFinalAdj.map((item) => {
    //         const rowData = [
    //             item.serialNumber,
    //             item.empcode,
    //             item.username,
    //             item.branch,
    //             item.unit,
    //         ];

    //         // Create an object to store data for each day
    //         const dayData = {};

    //         // daysArray.forEach((column) => {
    //         //     // // Check if the current day is Sunday
    //         //     // const isSunday = column.dayName === "Sunday";

    //         //     // // If it's Sunday, set the default value to "Week Off"
    //         //     // if (isSunday) {
    //         //     //     rowData.push("Week Off");
    //         //     //     return; // Move to the next iteration
    //         //     // }

    //         //     // Find the dayData corresponding to the current date
    //         //     const matchingDay = item.days.find(
    //         //         (day) =>
    //         //             moment(day.adjdate).format("DD/MM/YYYY") === column.formattedDate
    //         //     );

    //         //     const matchingDay2 = item.days.find(
    //         //         (day) => formatDate(day.date) === column.formattedDate
    //         //     );


    //         //     let dayValue = "";

    //         //     // Use the matchingDay data to populate the dayData object
    //         //     if (matchingDay && matchingDay.adjstatus === "Approved") {
    //         //         dayValue = matchingDay.adjtypeshifttime || "No Data";
    //         //     } else if (
    //         //         matchingDay2 &&
    //         //         (matchingDay2.adjstatus === undefined ||
    //         //             matchingDay2.adjstatus === "" ||
    //         //             matchingDay2.adjstatus === "Reject" ||
    //         //             matchingDay2.adjstatus === "Adjustment")
    //         //     ) {
    //         //         dayValue = matchingDay2.firstshift
    //         //             ? `${ matchingDay2.firstshift.split(' - ')[0] } to ${ matchingDay2.firstshift.split(' - ')[1] } \n${ matchingDay2.pluseshift.split(' - ')[0] } to ${ matchingDay2.pluseshift.split(' - ')[1] } `
    //         //             : matchingDay2.mode;
    //         //     } else {
    //         //         item.days.map((day) => {
    //         //             if (day.adjstatus === "Approved") {
    //         //                 if (formatDate(day.date) === column.formattedDate) {
    //         //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : `Adjusted\n${ item.shifttiming } `;
    //         //                 } else {
    //         //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : item.shifttiming;
    //         //                 }
    //         //             }
    //         //         })
    //         //     }

    //         //     rowData.push(dayValue);
    //         // });

    //         return rowData;
    //     }),
    // ];


    // print...


    // // pdf.....
    // const downloadPdfMyAdj = () => {
    //     const doc = new jsPDF({ orientation: "landscape" });
    //     doc.autoTable({
    //         theme: "grid",
    //         styles: { fontSize: 4, },
    //         width: 'max-content',
    //         html: '#usershiftlistpdf'
    //     })
    //     doc.save("Shift Adjustment List.pdf");
    // };

    // // workingcode
    // const downloadPdfMyAdj = () => {
    //     const doc = new jsPDF({ orientation: "landscape" });

    //     // Define the table headers
    //     const headers = ["S.No", "Emp Code", "Name", "Branch", "Unit", ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),];

    //     // Constructing data in the required format
    //     // const data = [
    //     //     // First row should be headers
    //     //     ...filteredDataFinalAdj.map((item) => {
    //     //         const rowData = [
    //     //             item.serialNumber,
    //     //             item.empcode,
    //     //             item.username,
    //     //             item.branch,
    //     //             item.unit,
    //     //         ];

    //     //         // Create an object to store data for each day
    //     //         const dayData = {};

    //     //         // daysArray.forEach((column) => {
    //     //         //     // // Check if the current day is Sunday
    //     //         //     // const isSunday = column.dayName === "Sunday";

    //     //         //     // // If it's Sunday, set the default value to "Week Off"
    //     //         //     // if (isSunday) {
    //     //         //     //     rowData.push("Week Off");
    //     //         //     //     return; // Move to the next iteration
    //     //         //     // }

    //     //         //     // Find the dayData corresponding to the current date
    //     //         //     const matchingDay = item.days.find(
    //     //         //         (day) =>
    //     //         //             moment(day.adjdate).format("DD/MM/YYYY") === column.formattedDate
    //     //         //     );

    //     //         //     const matchingDay2 = item.days.find(
    //     //         //         (day) => formatDate(day.date) === column.formattedDate
    //     //         //     );

    //     //         //     let dayValue = ""; // Default value

    //     //         //     // Use the matchingDay data to populate the dayData object
    //     //         //     if (matchingDay && matchingDay.adjstatus === "Approved") {
    //     //         //         dayValue = matchingDay.adjtypeshifttime;
    //     //         //     } else if (
    //     //         //         matchingDay2 &&
    //     //         //         (matchingDay2.adjstatus === undefined ||
    //     //         //             matchingDay2.adjstatus === "" ||
    //     //         //             matchingDay2.adjstatus === "Reject" ||
    //     //         //             matchingDay2.adjstatus === "Adjustment")
    //     //         //     ) {
    //     //         //         dayValue = matchingDay2.firstshift
    //     //         //             ? `${ matchingDay2.firstshift.split(' - ')[0] } to ${ matchingDay2.firstshift.split(' - ')[1] } `
    //     //         //             : matchingDay2.mode;
    //     //         //     } else {
    //     //         //         item.days.map((day) => {
    //     //         //             if (day.adjstatus === "Approved") {
    //     //         //                 if (formatDate(day.date) === column.formattedDate) {
    //     //         //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : `Adjusted\n${ item.shifttiming } `;
    //     //         //                 } else {
    //     //         //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : item.shifttiming;
    //     //         //                 }
    //     //         //             }
    //     //         //         })
    //     //         //     }

    //     //         //     rowData.push(dayValue);
    //     //         // });

    //     //         return rowData;
    //     //     }),
    //     // ];

    //     const data = [
    //         ...filteredDataFinalAdj.map((row, index) => [
    //             row.serialNumber,
    //             row.empcode,
    //             row.username,
    //             row.branch,
    //             row.unit,
    //             // Add data for date columns dynamically           
    //             ...daysArray.map(column => {
    //                 let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
    //                 const matchingItem = filteredRowData.find(item => item.adjdate === column.formattedDate);
    //                 const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
    //                 const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
    //                 const isWeekOff = row.weekoff?.includes(column.dayName);
    //                 // Check if it's a week off day and has an adjustment
    //                 const isWeekOffWithAdjustment = isWeekOff && matchingItem;
    //                 const isWeekOffWithManual = isWeekOff && matchingItemAllot;

    //                 // ${matchingItem ?
    //                 //     (matchingItem.adjstatus === "Reject" ?
    //                 //         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
    //                 //             matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
    //                 //                 'Adjustment') :
    //                 //         (matchingItem.adjstatus === "Approved" ? 'Approved' :
    //                 //             (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
    //                 //     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
    //                 //         matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
    //                 //             (isWeekOffWithManual ? "Manual" :
    //                 //                 (isWeekOffWithAdjustment ? 'Adjustment' :
    //                 //                     (isWeekOff ? 'Week Off' : 'Adjustment'))))
    //                 //     }
    //                 return `${matchingItem ?
    //                     (matchingItem.adjstatus === "Reject" ?
    //                         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
    //                             matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
    //                                 (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
    //                         (matchingItem.adjstatus === "Approved" && matchingItem.adjustmenttype !== 'Shift Adjustment' ? 'Approved' :
    //                             (matchingItem.adjstatus === "Approved" && matchingItem.adjustmenttype === 'Shift Adjustment' ? matchingItem.secondmode :
    //                                 (isWeekOffWithManual ? "Manual" : 'Adjustment')))) :
    //                     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
    //                         matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
    //                             (isWeekOffWithManual ? "Manual" :
    //                                 (isWeekOffWithAdjustment ? 'Adjustment' :
    //                                     (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
    //                                         (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
    //                                             (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
    //                                                 (isWeekOff ? 'Week Off' : 'Adjustment')))))))
    //                     }

    // \n${getShiftForDateAdjCsv(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, row.actualShiftTiming, row.boardingLog, isWeekOff, matchingDoubleShiftItem)}`;
    //             }),
    //         ]),
    //     ];

    //     // Split data into chunks to fit on pages
    //     const columnsPerSheet = 10; // Number of columns per sheet
    //     const chunks = [];

    //     for (let i = 0; i < headers.length; i += columnsPerSheet) {
    //         const chunkHeaders = headers.slice(i, i + columnsPerSheet);
    //         const chunkData = data.map(row => row.slice(i, i + columnsPerSheet + 1));

    //         chunks.push({ headers: chunkHeaders, data: chunkData });
    //     }

    //     chunks.forEach((chunk, index) => {
    //         if (index > 0) {
    //             doc.addPage({ orientation: "landscape" }); // Add a new landscape page for each chunk, except the first one
    //         }

    //         doc.autoTable({
    //             theme: "grid",
    //             styles: { fontSize: 8 },
    //             head: [chunk.headers],
    //             body: chunk.data,
    //             startY: 20, // Adjust startY to leave space for headers
    //             margin: { top: 20, left: 10, right: 10, bottom: 10 } // Adjust margin as needed
    //         });
    //     });

    //     doc.save("Shift Status List.pdf");
    // };

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
            ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),
        ];

        let data = [];
        if (isfilter === "filtered") {
            data = rowDataTableFinalAdj.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.username,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${column.shiftlabel === undefined ? '' : column.shiftlabel}`
                    }),
                ];
            });
        } else if (isfilter === "overall") {
            data = itemsFinalAdj.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.companyname,
                    row.department,
                    row.branch,
                    row.unit,
                    // ...daysArray.map(column => {
                    //     let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                    //     const matchingItem = filteredRowData.find(item => item.adjdate === column.formattedDate);
                    //     const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
                    //     const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
                    //     const filterBoardingLog = row?.boardingLog && row?.boardingLog?.filter((item) => {
                    //         // return item.logcreation === "user" || item.logcreation === "shift";
                    //         return item;
                    //     });
                    //     // const isWeekOff = row.weekoff?.includes(column.dayName);
                    //     const isWeekOff = getWeekOffDay(column, filterBoardingLog, row?.department, overAllDepartment) === "Week Off" ? true : false;
                    //     // Check if it's a week off day and has an adjustment
                    //     const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                    //     const isWeekOffWithManual = isWeekOff && matchingItemAllot;
                    //     const status = (
                    //         matchingItem ?
                    //             (matchingItem.adjstatus === "Reject" ?
                    //                 (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                    //                     matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                    //                         (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
                    //                 (matchingItem.adjstatus === "Approved" && matchingItem.adjustmenttype !== 'Shift Adjustment' ? 'Approved' :
                    //                     (matchingItem.adjstatus === "Approved" && matchingItem.adjustmenttype === 'Shift Adjustment' ? matchingItem.secondmode :
                    //                         (isWeekOffWithManual ? "Manual" : 'Adjustment')))) :
                    //             (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                    //                 matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                    //                     (isWeekOffWithManual ? "Manual" :
                    //                         (isWeekOffWithAdjustment ? 'Adjustment' :
                    //                             (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
                    //                                 (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
                    //                                     (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
                    //                                         (isWeekOff ? 'Week Off' : 'Adjustment')))))))
                    //     );
                    //     const shift = getShiftForDateAdjCsv(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, row.department);
                    //     return `${status} ${shift}`;
                    // }),
                    ...row.days.map((column, index) => {
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${column.shiftlabel === undefined ? '' : column.shiftlabel}`
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
            ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),
        ];

        // Initialize serial number counter
        let serialNumberCounter = 1;

        let data = [];
        if (isfilter === "filtered") {
            data = rowDataTableFinalAdj.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.username,
                    row.department,
                    row.branch,
                    row.unit,
                    ...row.days.map((column, index) => {
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${column.shiftlabel === undefined ? '' : column.shiftlabel}`
                    }),
                ];
            });
        } else {
            data = itemsFinalAdj.map((row, index) => {
                return [
                    row.serialNumber,
                    row.empcode,
                    row.companyname,
                    row.department,
                    row.branch,
                    row.unit,
                    //             ...daysArray.map(column => {
                    //                 let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                    //                 const matchingItem = filteredRowData.find(item => item.adjdate === column.formattedDate);
                    //                 const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
                    //                 const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
                    //                 const filterBoardingLog = row?.boardingLog && row?.boardingLog?.filter((item) => {
                    //                     // return item.logcreation === "user" || item.logcreation === "shift";
                    //                     return item;
                    //                 });
                    //                 // const isWeekOff = row.weekoff?.includes(column.dayName);
                    //                 const isWeekOff = getWeekOffDay(column, filterBoardingLog, row?.department, overAllDepartment) === "Week Off" ? true : false;
                    //                 // Check if it's a week off day and has an adjustment
                    //                 const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                    //                 const isWeekOffWithManual = isWeekOff && matchingItemAllot;
                    //                 return `${matchingItem ?
                    //                     (matchingItem.adjstatus === "Reject" ?
                    //                         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                    //                             matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                    //                                 (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
                    //                         (matchingItem.adjstatus === "Approved" && matchingItem.adjustmenttype !== 'Shift Adjustment' ? 'Approved' :
                    //                             (matchingItem.adjstatus === "Approved" && matchingItem.adjustmenttype === 'Shift Adjustment' ? matchingItem.secondmode :
                    //                                 (isWeekOffWithManual ? "Manual" : 'Adjustment')))) :
                    //                     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                    //                         matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                    //                             (isWeekOffWithManual ? "Manual" :
                    //                                 (isWeekOffWithAdjustment ? 'Adjustment' :
                    //                                     (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
                    //                                         (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
                    //                                             (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
                    //                                                 (isWeekOff ? 'Week Off' : 'Adjustment')))))))
                    //                     }

                    //  ${getShiftForDateAdjCsv(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, row.department)}`;
                    //             }),
                    ...row.days.map((column, index) => {
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${column.adjstatus === undefined ? '' : column.adjstatus} ${column.shiftlabel === undefined ? '' : column.shiftlabel}`
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
    const handleCaptureImageMyAdj = () => {
        if (gridRefFinalAdj.current) {
            html2canvas(gridRefFinalAdj.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Shift Status List.png");
                });
            });
        }
    };

    return (
        <Box>
            <Headtitle title={"MY SHIFT ROASTER"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Shift Status List</Typography> <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lmyshiftroaster") && (
                <>
                    {/* {isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("HiringManager") || isUserRoleAccess.role.includes("HR") ?
                        (
                            <>
                                <Box sx={userStyle.selectcontainer}>
                                    <Grid container spacing={2}>
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <Typography>Company<b style={{ color: "red" }}>*</b></Typography>
                                                <FormControl size="small" fullWidth>
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
                                            <Grid item md={3} xs={12} sm={12}>
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
                                                            handleBranchChangeFrom(e);
                                                        }}
                                                        valueRenderer={customValueRendererBranchFrom}
                                                        labelledBy="Please Select Branch"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <FormControl fullWidth size="small">
                                                    <Typography> Unit<b style={{ color: "red" }}>*</b> </Typography>
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
                                                        onChange={(e) => {
                                                            handleUnitChangeFrom(e);
                                                        }}
                                                        valueRenderer={customValueRendererUnitFrom}
                                                        labelledBy="Please Select Unit"
                                                    />
                                                </FormControl>
                                            </Grid>
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
                                        </>
                                    </Grid><br /><br /><br />
                                    <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
                                        <Grid item lg={1} md={2} sm={2} xs={12}>
                                            <Button sx={userStyle.buttonadd} variant="contained" onClick={handleFilterSubmit} > Filter </Button>
                                        </Grid>
                                        <Grid item lg={1} md={2} sm={2} xs={12}>
                                            <Button sx={userStyle.btncancel} onClick={handleFilterClear} > Clear </Button>
                                        </Grid>
                                    </Grid>
                                </Box><br /><br />
                            </>
                        ) : null} */}
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid container style={userStyle.dataTablestyle}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select size="small"
                                        id="pageSizeSelect"
                                        value={pageSizeFinalAdj}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 180,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChangeSetTable}
                                        sx={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        {/* <MenuItem value={allUsers?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelmyshiftroaster") && (
                                        <>
                                            {/* <Button sx={userStyle.buttongrp}>
                                                <FaFileExcel />&ensp;
                                                <ReactHTMLTableToExcel
                                                    id="test-table-xls-button"
                                                    className="download-table-xls-button"
                                                    table="usershiftlistpdf"
                                                    filename="Shift Status List"
                                                    sheet="Sheet"
                                                    buttonText="Export To Excel"
                                                />
                                            </Button> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpenMyAdj(true)
                                                setFormatMyAdj("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvmyshiftroaster") && (
                                        <>
                                            {/* <CSVLink style={{
                                                backgroundColor: "#f4f4f4",
                                                color: "#444",
                                                borderRadius: "3px",
                                                boxShadow: "none",
                                                fontSize: "12px",
                                                padding: "8px 6px",
                                                textTransform: "capitalize",
                                                border: "1px solid #8080808f",
                                                textDecoration: 'none',
                                                marginRight: '0px',
                                                fontFamily: "Roboto,Helvetica,Arial,sans-serif"
                                            }}
                                                data={[
                                                    [
                                                        'S.No',
                                                        'Emp Code',
                                                        'Name',
                                                        'Branch',
                                                        'Unit',
                                                        // Add headers for date columns dynamically
                                                        ...daysArray.map(column => `${column.formattedDate} ${column.dayName} Day ${column.dayCount}`),
                                                    ], // First row should be headers
                                                    ...filteredDataFinalAdj.map((row, index) => [
                                                        row.serialNumber,
                                                        row.empcode,
                                                        row.username,
                                                        row.branch,
                                                        row.unit,
                                                        // Add data for date columns dynamically           
                                                        ...daysArray.map(column => {
                                                            let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                                                            const matchingItem = filteredRowData.find(item => item.adjdate === column.formattedDate);
                                                            const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
                                                            const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
                                                            const isWeekOff = row.weekoff?.includes(column.dayName);
                                                            // Check if it's a week off day and has an adjustment
                                                            const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                                                            const isWeekOffWithManual = isWeekOff && matchingItemAllot;
                                                            // const status = matchingItem ?
                                                            //     (matchingItem.adjstatus === "Reject" ?
                                                            //         (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                                            //             matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
                                                            //                 'Adjustment') :
                                                            //         (matchingItem.adjstatus === "Approved" ? 'Approved' :
                                                            //             (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
                                                            //     (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                                            //         matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
                                                            //             (isWeekOffWithManual ? "Manual" :
                                                            //                 (isWeekOffWithAdjustment ? 'Adjustment' :
                                                            //                     (isWeekOff ? 'Week Off' : 'Adjustment'))));

                                                            const status = matchingItem ?
                                                                (matchingItem.adjstatus === "Reject" ?
                                                                    (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                                                        matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
                                                                            (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
                                                                    (matchingItem.adjstatus === "Approved" ? 'Approved' :
                                                                        (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
                                                                (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                                                    matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
                                                                        (isWeekOffWithManual ? "Manual" :
                                                                            (isWeekOffWithAdjustment ? 'Adjustment' :
                                                                                (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
                                                                                    (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
                                                                                        (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
                                                                                            (isWeekOff ? 'Week Off' : 'Adjustment')))))));
                                                            const shiftTiming = getShiftForDateAdjCsv(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, row.actualShiftTiming, row.boardingLog, isWeekOff, matchingDoubleShiftItem);
                                                            return (status == "Week Off" || status === "") ? `${status}` : `${status} (${shiftTiming})`;
                                                        }),
                                                    ]),
                                                ]}
                                                filename="Shift Status List.csv"
                                            >
                                                <FaFileCsv />&ensp;Export To CSV
                                            </CSVLink> */}
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
                                            {/* <Button sx={userStyle.buttongrp} onClick={() => downloadPdfSetTable()}>
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button> */}
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setIsPdfFilterOpenMyAdj(true)
                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagemyshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleCaptureImageMyAdj}>
                                                {" "} <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQueryFinalAdj} onChange={handleSearchChangeSetTable} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>  <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumnsFinalAdj}> Show All Columns </Button>  &ensp;
                        <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumnsFinalAdj}>  Manage Columns </Button> &ensp;
                        {/* <Button variant="contained" color="error" onClick={handleClickOpenalert}> Bulk Delete  </Button>  */}
                        <br /> <br />
                        {!allShiftAdj ?
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                </Box>
                            </> :
                            <>
                                <Box style={{ width: "100%", overflowY: "hidden", }}>
                                    <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedDataFinalAdj(copiedString)} rows={rowsWithCheckboxesFinalAdj} columns={columnDataTableFinalAdj.filter((column) => columnVisibilityFinalAdj[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRowsFinalAdj} autoHeight={true} ref={gridRefFinalAdj} id="settableexcel"
                                        getRowHeight={getRowHeight} hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {filteredDataFinalAdj?.length > 0 ? (pageFinalAdj - 1) * pageSizeFinalAdj + 1 : 0} to {Math.min(pageFinalAdj * pageSizeFinalAdj, filteredDatasFinalAdj?.length)} of {filteredDatasFinalAdj?.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPageFinalAdj(1)} disabled={pageFinalAdj === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChangeSetTable(pageFinalAdj - 1)} disabled={pageFinalAdj === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbersSetTable?.map((pageNumberSetTable) => (
                                            <Button key={pageNumberSetTable} sx={userStyle.paginationbtn} onClick={() => handlePageChangeSetTable(pageNumberSetTable)} className={pageFinalAdj === pageNumberSetTable ? "active" : ""} disabled={pageFinalAdj === pageNumberSetTable}>
                                                {pageNumberSetTable}
                                            </Button>
                                        ))}
                                        {lastVisiblePageSetTable < totalPagesSetTable && <span>...</span>}
                                        <Button onClick={() => handlePageChangeSetTable(pageFinalAdj + 1)} disabled={pageFinalAdj === totalPagesSetTable} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPageFinalAdj(totalPagesSetTable)} disabled={pageFinalAdj === totalPagesSetTable} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        }
                    </Box><br />
                </>
            )}

            <br />
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpenFinalAdj}
                anchorElFinalAdj={anchorElFinalAdj}
                onClose={handleCloseManageColumnsFinalAdj}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContentFinalAdj}
            </Popover>
            <Box>
                <MyShiftAdjustmentListTable allUsersAdjTable={allUsersAdjTable} adjApply={adjApply} fetchUsers={fetchUsers} />
            </Box>
            <br />
            <Box>
                <MyShiftRoasterList allUsersShiftFinal={allUsersShiftFinal} allFinalAdj={allFinalAdj} fetchUsers={fetchUsers} allUserDates={allUserDates} />
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
                            {/* {daysArray && (
                                daysArray.map(({ formattedDate, dayName }, i) => (
                                    <React.Fragment key={i}>
                                        <TableCell sx={{ fontSize: '14px', fontWeight: "550", }}>{formattedDate} <br />{dayName}</TableCell>
                                    </React.Fragment>
                                ))
                            )} */}
                            {daysArray.map((column, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableCell>
                                            <Box sx={userStyle.tableheadstyle}>
                                                {column.formattedDate}<br />
                                                {column.dayName}<br />
                                                {`Day ${column.dayCount}`}
                                            </Box>
                                        </TableCell>
                                    </React.Fragment>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    {/* <TableBody align="left">
                        {filteredDataFinalAdj &&
                            filteredDataFinalAdj.map((item, index) => {
                                const rowData = [
                                    index + 1,
                                    item.empcode,
                                    item.username,
                                    item.branch,
                                    item.unit,
                                ];

                                const dayData = {};

                                // daysArray.forEach((column) => {
                                //     // const isSunday = column.dayName === "Sunday";

                                //     // if (isSunday) {
                                //     //     rowData.push("Week Off");
                                //     //     return;
                                //     // }

                                //     const matchingDay = item.days.find(
                                //         (day) =>
                                //             moment(day.adjdate).format("DD/MM/YYYY") ===
                                //             column.formattedDate
                                //     );

                                //     const matchingDay2 = item.days.find(
                                //         (day) => formatDate(day.date) === column.formattedDate
                                //     );

                                //     let dayValue = "";

                                //     if (matchingDay && matchingDay.adjstatus === "Approved") {
                                //         dayValue = matchingDay.adjtypeshifttime || "No Data";
                                //     }
                                //     else if (
                                //         matchingDay2 &&
                                //         (matchingDay2.adjstatus === undefined ||
                                //             matchingDay2.adjstatus === "" ||
                                //             matchingDay2.adjstatus === "Reject" ||
                                //             matchingDay2.adjstatus === "Adjustment")
                                //     ) {
                                //         dayValue = matchingDay2.firstshift
                                //             ? `${matchingDay2.firstshift.split(' - ')[0]} to ${matchingDay2.firstshift.split(' - ')[1]}\n${matchingDay2.pluseshift.split(' - ')[0]} to ${matchingDay2.pluseshift.split(' - ')[1]}`
                                //             : matchingDay2.mode;
                                //     }
                                //     else {
                                //         item.days.map((day) => {
                                //             if (day.adjstatus === "Approved") {
                                //                 if (formatDate(day.date) === column.formattedDate) {
                                //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : `Adjusted\n${item.shifttiming}`;
                                //                 } else {
                                //                     dayValue = item.weekoff?.includes(column.dayName) ? "Week Off" : item.shifttiming;
                                //                 }
                                //             }
                                //         })
                                //     }

                                //     // Push plain text values with color codes
                                //     rowData.push(dayValue);
                                // });

                                return (
                                    <TableRow key={index}>
                                        {rowData.map((cell, cellIndex) => (
                                            <TableCell
                                                key={cellIndex}
                                                sx={{ fontSize: '14px' }}
                                            >
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                    </TableBody> */}

                    <TableBody align="left">
                        {rowDataTableFinalAdj &&
                            rowDataTableFinalAdj.map((row, index) => (
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
                                    {/* Render "Not Allot" for each date column */}
                                    {/* {daysArray && (
                                        daysArray.map((column, index) => {
                                            // Move the variable declaration outside the JSX
                                            let filteredRowData = allUserDates.filter((val) => val.empcode == row.empcode);
                                            const matchingItem = filteredRowData.find(item => item.adjdate == column.formattedDate);
                                            const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
                                            const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
                                            // Check if the dayName is Sunday or Monday
                                            const isWeekOff = row.weekoff?.includes(column.dayName);
                                            // Check if it's a week off day and has an adjustment
                                            const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                                            const isWeekOffWithManual = isWeekOff && matchingItemAllot;

                                            return (
                                                <React.Fragment key={index}>
                                                    <TableCell>
                                                        <Button
                                                            //  color={matchingItem && matchingItem.status === 'Manual' ? 'success' : isWeekOff ? 'error' : 'success'} 
                                                            variant="contained" size="small"
                                                            sx={{
                                                                fontSize: '10px', textTransform: 'capitalize', borderRadius: '15px', height: '20px', padding: '1px 8px',
                                                                display: 'flex',
                                                                // color: matchingItem && matchingItem.status === 'Manual' ? '#052106' : isWeekOff ? '#892a23' : '#183e5d',
                                                                color: matchingItem && matchingItem.status === 'Manual' ? '#052106' : row.weekoff?.includes(column.dayName) ? '#892a23' : '#183e5d',
                                                                backgroundColor: matchingItem && matchingItem.status === 'Manual' ? 'rgb(156 239 156)' : row.weekoff?.includes(column.dayName) ? 'rgb(243 174 174)' : 'rgb(166 210 245)',
                                                            }}
                                                        >                                                           
                                                            {matchingItem ?
                                                                (matchingItem.adjstatus === "Reject" ?
                                                                    (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                                                        matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                                                                            (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
                                                                    (matchingItem.adjstatus === "Approved" ? 'Approved' :
                                                                        (isWeekOffWithManual ? "Manual" : 'Adjustment'))) :
                                                                (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
                                                                    matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Manual' :
                                                                        (isWeekOffWithManual ? "Manual" :
                                                                            (isWeekOffWithAdjustment ? 'Adjustment' :
                                                                                (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
                                                                                    (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
                                                                                        (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
                                                                                            (isWeekOff ? 'Week Off' : 'Adjustment')))))))}
                                                        </Button><br />
                                                        <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                                            {getShiftForDateAdj(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, row.actualShiftTiming, row.boardingLog, isWeekOff, matchingDoubleShiftItem)}
                                                        </Typography>
                                                    </TableCell>
                                                </React.Fragment>
                                            );
                                        })
                                    )} */}
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
            <Dialog open={openEdit} onClose={handleClickOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Shift Adjustment</Typography>
                        <br />
                        <Grid container spacing={2}>
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
                                        options={shiftRoasterUserEdit.selectedColumnShiftMode === 'First Shift' ? adjtypeoptions : adjtypeoptionsifweekoff}
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

                                {shiftRoasterUserEdit.adjustmenttype == "Change Shift" ? (
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
                                                <TextField readOnly size="small" value={shiftRoasterUserEdit.selectedColumnShiftTime == '' ? 'Week Off' : shiftRoasterUserEdit.selectedColumnShiftTime} />
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
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2}>
                                <Button variant="contained" color="primary" onClick={handleSubmit}> {" "} Update{" "}  </Button>
                            </Grid>
                            {/* <Grid item md={1}>
                                <Button variant="contained" sx={userStyle.btncancel} onClick={handleClear}> {" "} Clear{" "} </Button>
                            </Grid> */}
                            <Grid item md={2}>
                                <Button sx={userStyle.btncancel} onClick={handleCloseEdit}> {" "} Cancel{" "} </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog >


            {/* ALERT DIALOG */}
            < Box >
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
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