import React, { useState, useEffect, useRef, useContext } from "react";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, Badge, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf, } from "react-icons/fa";
import { CSVLink } from 'react-csv';
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StyledDataGrid from "../../../components/TableStyle";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import Resizable from "react-resizable";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { format } from 'date-fns';

function MyShiftRoasterList({ allUsersShiftFinal, allFinalAdj, allUserDates }) {

    const gridRefFinalAdj = useRef(null);
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const [itemsFinalAdj, setItemsFinalAdj] = useState([])
    const [selectedRowsFinalAdj, setSelectedRowsFinalAdj] = useState([]);
    const [copiedDataFinalAdj, setCopiedDataFinalAdj] = useState("");
    const [selectAllCheckedFinalAdj, setSelectAllCheckedFinalAdj] = useState(false);
    // const [allFinalAdj, setAllFinalAdj] = useState(false);
    const [isAttandance, setIsAttandance] = useState({ username: "", month: "", year: "" });

    // Datatable Set Table
    const [pageFinalAdj, setPageFinalAdj] = useState(1);
    const [pageSizeFinalAdj, setPageSizeFinalAdj] = useState(10);
    const [searchQueryFinalAdj, setSearchQueryFinalAdj] = useState("");

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => { setIsErrorOpen(true); };
    const handleCloseerr = () => { setIsErrorOpen(false); };

    const [isFilterOpenMyFinalAdj, setIsFilterOpenMyFinalAdj] = useState(false);
    const [isPdfFilterOpenMyFinalAdj, setIsPdfFilterOpenMyFinalAdj] = useState(false);
    // page refersh reload
    const handleCloseFilterModMyFinalAdj = () => { setIsFilterOpenMyFinalAdj(false); };
    const handleClosePdfFilterModMyFinalAdj = () => { setIsPdfFilterOpenMyFinalAdj(false); };

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

    // Styles for the resizable column
    const ResizableColumn = styled(Resizable)`
      .react-resizable-handle {
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: col-resize;
      }
    `;

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
            return 75; // Adjust this value as needed
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

    const [overallsettings, setOverallsettings] = useState("");
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
    //     const itemsWithSerialNumber = allUsersShiftFinal?.map((item, index) => {

    //         return {
    //             ...item,
    //             serialNumber: index + 1,
    //         };
    //     });
    //     setItemsFinalAdj(itemsWithSerialNumber);
    // };

    const addSerialNumberSetTable = () => {
        const itemsWithSerialNumber = allUsersShiftFinal?.flatMap((item, index) => {

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
                const shiftsname = getShiftForDateFinal(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, (relevantDepLogEntry && relevantDepLogEntry.department));

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
    }, [allUsersShiftFinal]);

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

    const formatDate = (inputDate) => {
        if (!inputDate) {
            return ""
        }
        // Assuming inputDate is in the format "dd-mm-yyyy"
        const [day, month, year] = inputDate?.split('/');

        // Use padStart to add leading zeros
        const formattedDay = String(day)?.padStart(2, '0');
        const formattedMonth = String(month)?.padStart(2, '0');

        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    const CheckboxHeader = ({ selectAllCheckedFinalAdj, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllCheckedFinalAdj} onChange={onSelectAll} />
        </div>
    );

    // const getShiftForDateFinal = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, shifttiming, boardingLog, isWeekOff, matchingDoubleShiftItem) => {

    //     if (matchingItem && matchingItem?.adjstatus === 'Adjustment') {
    //         return (
    //             <Box sx={{
    //                 textTransform: 'capitalize',
    //                 borderRadius: '4px',
    //                 boxShadow: 'none',
    //                 fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                 fontWeight: '400',
    //                 fontSize: '0.675rem',
    //                 lineHeight: '1.43',
    //                 letterSpacing: '0.01071em',
    //                 display: 'flex',
    //                 padding: '3px 10px',
    //                 color: 'white',
    //                 backgroundColor: 'red',
    //             }}>{"Pending..."}</Box>
    //         );
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Weekoff Swap') {
    //         return (
    //             <Box sx={{
    //                 '& .MuiBadge-badge': {
    //                     right: '5px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //                 }
    //             }}>
    //                 <Badge color="success" badgeContent={"Adjusted"}
    //                     anchorOrigin={{
    //                         vertical: 'top', horizontal: 'right',
    //                     }}
    //                 >
    //                     <Box sx={{
    //                         textTransform: 'capitalize',
    //                         borderRadius: '4px',
    //                         boxShadow: 'none',
    //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                         fontWeight: '400',
    //                         fontSize: '0.675rem',
    //                         lineHeight: '1.43',
    //                         letterSpacing: '0.01071em',
    //                         display: 'flex',
    //                         padding: '3px 8px',
    //                         color: '#052106',
    //                         backgroundColor: 'rgb(156 239 156)',
    //                     }}>
    //                         {matchingDoubleShiftItem.todateshiftmode}
    //                     </Box>
    //                 </Badge>
    //             </Box>
    //         )
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'WeekOff Adjustment') {
    //         return (
    //             <Box sx={{
    //                 '& .MuiBadge-badge': {
    //                     right: '5px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //                 }
    //             }}>
    //                 <Badge color="success" badgeContent={"Adjusted"}
    //                     anchorOrigin={{
    //                         vertical: 'top', horizontal: 'right',
    //                     }}
    //                 >
    //                     <Box sx={{
    //                         textTransform: 'capitalize',
    //                         borderRadius: '4px',
    //                         boxShadow: 'none',
    //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                         fontWeight: '400',
    //                         fontSize: '0.675rem',
    //                         lineHeight: '1.43',
    //                         letterSpacing: '0.01071em',
    //                         display: 'flex',
    //                         padding: '3px 8px',
    //                         color: '#052106',
    //                         backgroundColor: 'rgb(156 239 156)',
    //                     }}>
    //                         {matchingDoubleShiftItem.todateshiftmode}
    //                     </Box>
    //                 </Badge>
    //             </Box>
    //         )
    //     }
    //     else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment') {
    //         return '';
    //     }
    //     // else if (matchingItem && matchingItem.adjstatus === 'Approved') {
    //     //     return (
    //     //         isWeekOffWithAdjustment ?
    //     //             <>
    //     //                 <Box sx={{
    //     //                     '& .MuiBadge-badge': {
    //     //                         right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //     //                     }
    //     //                 }}>
    //     //                     <Badge color="success" badgeContent={"Adjusted"}
    //     //                         anchorOrigin={{
    //     //                             vertical: 'top', horizontal: 'right',
    //     //                         }}
    //     //                     >
    //     //                         <Box sx={{
    //     //                             textTransform: 'capitalize',
    //     //                             borderRadius: '4px',
    //     //                             boxShadow: 'none',
    //     //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                             fontWeight: '400',
    //     //                             fontSize: '0.675rem',
    //     //                             lineHeight: '1.43',
    //     //                             letterSpacing: '0.01071em',
    //     //                             display: 'flex',
    //     //                             padding: '3px 8px',
    //     //                             color: '#052106',
    //     //                             backgroundColor: 'rgb(156 239 156)',
    //     //                         }}>
    //     //                             {matchingItem.adjtypeshifttime !== "" ? `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` : (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off')}
    //     //                         </Box>
    //     //                     </Badge>
    //     //                 </Box>
    //     //             </>
    //     //             :
    //     //             <>
    //     //                 <Box sx={{
    //     //                     '& .MuiBadge-badge': {
    //     //                         right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //     //                     }
    //     //                 }}>
    //     //                     <Badge color="success" badgeContent={"Adjusted"}
    //     //                         anchorOrigin={{
    //     //                             vertical: 'top', horizontal: 'right',
    //     //                         }}
    //     //                     >
    //     //                         <Box sx={{
    //     //                             textTransform: 'capitalize',
    //     //                             borderRadius: '4px',
    //     //                             boxShadow: 'none',
    //     //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                             fontWeight: '400',
    //     //                             fontSize: '0.675rem',
    //     //                             lineHeight: '1.43',
    //     //                             letterSpacing: '0.01071em',
    //     //                             display: 'flex',
    //     //                             padding: '3px 8px',
    //     //                             color: '#052106',
    //     //                             backgroundColor: 'rgb(156 239 156)',
    //     //                         }}>
    //     //                             {matchingItem.adjtypeshifttime !== "" ? `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` : (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off')}
    //     //                         </Box>
    //     //                     </Badge>
    //     //                 </Box>
    //     //             </>
    //     //     )
    //     // }
    //     else if (matchingItem && matchingItem.adjstatus === 'Approved') {
    //         return (matchingItem.adjustmenttype === "Add On Shift" || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
    //             (
    //                 <>
    //                     <Box sx={{
    //                         '& .MuiBadge-badge': {
    //                             right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
    //                         }
    //                     }}> <b>Main Shift :</b><br />
    //                         <Badge color="success" badgeContent={"Adjusted"}
    //                             anchorOrigin={{
    //                                 vertical: 'top', horizontal: 'right',
    //                             }}
    //                         >
    //                             <Box sx={{
    //                                 textTransform: 'capitalize',
    //                                 borderRadius: '4px',
    //                                 boxShadow: 'none',
    //                                 fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                 fontWeight: '400',
    //                                 fontSize: '0.575rem',
    //                                 lineHeight: '1.2',
    //                                 letterSpacing: '0.01071em',
    //                                 display: 'flex',
    //                                 padding: '3px 8px',
    //                                 color: '#052106',
    //                                 backgroundColor: 'rgb(156 239 156)',
    //                             }}>
    //                                 {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
    //                             </Box>
    //                         </Badge>
    //                     </Box>
    //                     <Box sx={{
    //                         '& .MuiBadge-badge': {
    //                             right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
    //                         }
    //                     }}><b>{`${matchingItem.secondmode} :`}</b><br />
    //                         <Badge color="success" badgeContent={"Adjusted"}
    //                             anchorOrigin={{
    //                                 vertical: 'top', horizontal: 'right',
    //                             }}
    //                         >
    //                             <Box sx={{
    //                                 textTransform: 'capitalize',
    //                                 borderRadius: '4px',
    //                                 boxShadow: 'none',
    //                                 fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                 fontWeight: '400',
    //                                 fontSize: '0.575rem',
    //                                 lineHeight: '1.2',
    //                                 letterSpacing: '0.01071em',
    //                                 display: 'flex',
    //                                 padding: '3px 8px',
    //                                 color: '#052106',
    //                                 backgroundColor: 'rgb(156 239 156)',
    //                             }}>
    //                                 {`${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`}
    //                             </Box>
    //                         </Badge>
    //                     </Box>
    //                 </>
    //             ) :
    //             (
    //                 isWeekOffWithAdjustment ?
    //                     <>
    //                         <Box sx={{
    //                             '& .MuiBadge-badge': {
    //                                 right: '16px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //                             }
    //                         }}>
    //                             <Badge color="success" badgeContent={"Adjusted"}
    //                                 anchorOrigin={{
    //                                     vertical: 'top', horizontal: 'right',
    //                                 }}
    //                             >
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 8px',
    //                                     color: '#052106',
    //                                     backgroundColor: 'rgb(156 239 156)',
    //                                 }}>
    //                                     {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
    //                                 </Box>
    //                             </Badge>
    //                         </Box>
    //                     </>
    //                     :
    //                     <>
    //                         <Box sx={{
    //                             '& .MuiBadge-badge': {
    //                                 right: '16px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //                             }
    //                         }}>
    //                             <Badge color="success" badgeContent={"Adjusted"}
    //                                 anchorOrigin={{
    //                                     vertical: 'top', horizontal: 'right',
    //                                 }}
    //                             >
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 8px',
    //                                     color: '#052106',
    //                                     backgroundColor: 'rgb(156 239 156)',
    //                                 }}>
    //                                     {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
    //                                 </Box>
    //                             </Badge>
    //                         </Box>

    //                     </>
    //             )
    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === 'Manual') {
    //         return (
    //             isWeekOffWithManual ?
    //                 <Box sx={{
    //                     '& .MuiBadge-badge': {
    //                         right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //                     }
    //                 }}>
    //                     <Badge color="warning" badgeContent={"Manual"}
    //                         anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
    //                     >
    //                         <Box sx={{
    //                             textTransform: 'capitalize',
    //                             borderRadius: '4px',
    //                             boxShadow: 'none',
    //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                             fontWeight: '400',
    //                             fontSize: '0.675rem',
    //                             lineHeight: '1.43',
    //                             letterSpacing: '0.01071em',
    //                             display: 'flex',
    //                             padding: '3px 8px',
    //                             color: '#052106',
    //                             backgroundColor: 'rgb(243 203 117)',
    //                         }}>
    //                             {`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`}
    //                         </Box>
    //                     </Badge>
    //                 </Box>
    //                 :
    //                 <Box sx={{
    //                     '& .MuiBadge-badge': {
    //                         right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //                     }
    //                 }}>
    //                     <Badge color="warning" badgeContent={"Manual"}
    //                         anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
    //                     >
    //                         <Box sx={{
    //                             textTransform: 'capitalize',
    //                             borderRadius: '4px',
    //                             boxShadow: 'none',
    //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                             fontWeight: '400',
    //                             fontSize: '0.675rem',
    //                             lineHeight: '1.43',
    //                             letterSpacing: '0.01071em',
    //                             display: 'flex',
    //                             padding: '3px 8px',
    //                             color: '#052106',
    //                             backgroundColor: 'rgb(243 203 117)',
    //                         }}>
    //                             {`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`}
    //                         </Box>
    //                     </Badge>
    //                 </Box>
    //         )
    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === 'Week Off') {
    //         return (
    //             <Box sx={{
    //                 '& .MuiBadge-badge': {
    //                     right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
    //                 }
    //             }}>
    //                 <Badge color="warning" badgeContent={"Manual"}
    //                     anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
    //                 >
    //                     <Box sx={{
    //                         textTransform: 'capitalize',
    //                         borderRadius: '4px',
    //                         boxShadow: 'none',
    //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                         fontWeight: '400',
    //                         fontSize: '0.675rem',
    //                         lineHeight: '1.43',
    //                         letterSpacing: '0.01071em',
    //                         display: 'flex',
    //                         padding: '3px 8px',
    //                         color: '#052106',
    //                         backgroundColor: 'rgb(243 203 117)',
    //                     }}>{"Week Off"}</Box>
    //                 </Badge>
    //             </Box>
    //         );
    //     }
    //     // else if (boardingLog.length > 0) {
    //     //     if (!recentShiftTimingDate) {
    //     //         return '';
    //     //     }

    //     //     const [year, month, day] = recentShiftTimingDate?.split('-');


    //     //     // Map through each column and compare dates
    //     //     const shifts = daysArray.map((currentColumn) => {

    //     //         // const [day1, month1, year1] = currentColumn.formattedDate?.split('/');
    //     //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
    //     //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
    //     //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
    //     //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);
    //     //         // if (year >= year1 && month >= month1 && day > day1) {
    //     //         if (shiftFormattedDate >= columnFormattedDate) {
    //     //             return (
    //     //                 !isWeekOff ?
    //     //                     <Box sx={{
    //     //                         textTransform: 'capitalize',
    //     //                         borderRadius: '4px',
    //     //                         boxShadow: 'none',
    //     //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                         fontWeight: '400',
    //     //                         fontSize: '0.675rem',
    //     //                         lineHeight: '1.43',
    //     //                         letterSpacing: '0.01071em',
    //     //                         display: 'flex',
    //     //                         padding: '3px 8px',
    //     //                         color: '#183e5d',
    //     //                         backgroundColor: 'rgb(166 210 245)',
    //     //                     }}>{shifttiming}</Box>
    //     //                     :
    //     //                     <Box sx={{
    //     //                         textTransform: 'capitalize',
    //     //                         borderRadius: '4px',
    //     //                         boxShadow: 'none',
    //     //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                         fontWeight: '400',
    //     //                         fontSize: '0.675rem',
    //     //                         lineHeight: '1.43',
    //     //                         letterSpacing: '0.01071em',
    //     //                         display: 'flex',
    //     //                         padding: '3px 10px',
    //     //                         color: '#892a23',
    //     //                         backgroundColor: 'rgb(243 174 174)',
    //     //                     }}>{"Week Off"}</Box>
    //     //             )
    //     //         } else {
    //     //             return (
    //     //                 !isWeekOff ?
    //     //                     <Box sx={{
    //     //                         textTransform: 'capitalize',
    //     //                         borderRadius: '4px',
    //     //                         boxShadow: 'none',
    //     //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                         fontWeight: '400',
    //     //                         fontSize: '0.675rem',
    //     //                         lineHeight: '1.43',
    //     //                         letterSpacing: '0.01071em',
    //     //                         display: 'flex',
    //     //                         padding: '3px 8px',
    //     //                         color: '#183e5d',
    //     //                         backgroundColor: 'rgb(166 210 245)',
    //     //                     }}>{recentShiftTiming}</Box>
    //     //                     :
    //     //                     <Box sx={{
    //     //                         textTransform: 'capitalize',
    //     //                         borderRadius: '4px',
    //     //                         boxShadow: 'none',
    //     //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                         fontWeight: '400',
    //     //                         fontSize: '0.675rem',
    //     //                         lineHeight: '1.43',
    //     //                         letterSpacing: '0.01071em',
    //     //                         display: 'flex',
    //     //                         padding: '3px 10px',
    //     //                         color: '#892a23',
    //     //                         backgroundColor: 'rgb(243 174 174)',
    //     //                     }}>{"Week Off"}</Box>
    //     //             )
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
    //     //         return (
    //     //             <Box sx={{
    //     //                 textTransform: 'capitalize',
    //     //                 borderRadius: '4px',
    //     //                 boxShadow: 'none',
    //     //                 fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                 fontWeight: '400',
    //     //                 fontSize: '0.675rem',
    //     //                 lineHeight: '1.43',
    //     //                 letterSpacing: '0.01071em',
    //     //                 display: 'flex',
    //     //                 padding: '3px 8px',
    //     //                 color: '#183e5d',
    //     //                 backgroundColor: 'rgb(166 210 245)',
    //     //             }}>{entriesForDate[1].shifttiming}</Box>
    //     //         )
    //     //     }

    //     //     // Find the most recent boarding log entry that is less than or equal to the selected date
    //     //     const recentLogEntry = boardingLog
    //     //         .filter(log => log.startdate < finalDate)
    //     //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    //     //     // If a recent log entry is found, return its shift timing
    //     //     if (recentLogEntry) {
    //     //         return (
    //     //             !isWeekOff ?
    //     //                 <Box sx={{
    //     //                     textTransform: 'capitalize',
    //     //                     borderRadius: '4px',
    //     //                     boxShadow: 'none',
    //     //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                     fontWeight: '400',
    //     //                     fontSize: '0.675rem',
    //     //                     lineHeight: '1.43',
    //     //                     letterSpacing: '0.01071em',
    //     //                     display: 'flex',
    //     //                     padding: '3px 8px',
    //     //                     color: '#183e5d',
    //     //                     backgroundColor: 'rgb(166 210 245)',
    //     //                 }}>{recentLogEntry.shifttiming}</Box>
    //     //                 :
    //     //                 <Box sx={{
    //     //                     textTransform: 'capitalize',
    //     //                     borderRadius: '4px',
    //     //                     boxShadow: 'none',
    //     //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                     fontWeight: '400',
    //     //                     fontSize: '0.675rem',
    //     //                     lineHeight: '1.43',
    //     //                     letterSpacing: '0.01071em',
    //     //                     display: 'flex',
    //     //                     padding: '3px 10px',
    //     //                     color: '#892a23',
    //     //                     backgroundColor: 'rgb(243 174 174)',
    //     //                 }}>{"Week Off"}</Box>
    //     //         )
    //     //     } else {
    //     //         return (
    //     //             !isWeekOff ?
    //     //                 <Box sx={{
    //     //                     textTransform: 'capitalize',
    //     //                     borderRadius: '4px',
    //     //                     boxShadow: 'none',
    //     //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                     fontWeight: '400',
    //     //                     fontSize: '0.675rem',
    //     //                     lineHeight: '1.43',
    //     //                     letterSpacing: '0.01071em',
    //     //                     display: 'flex',
    //     //                     padding: '3px 8px',
    //     //                     color: '#183e5d',
    //     //                     backgroundColor: 'rgb(166 210 245)',
    //     //                 }}>{shifttiming}</Box>
    //     //                 :
    //     //                 <Box sx={{
    //     //                     textTransform: 'capitalize',
    //     //                     borderRadius: '4px',
    //     //                     boxShadow: 'none',
    //     //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //     //                     fontWeight: '400',
    //     //                     fontSize: '0.675rem',
    //     //                     lineHeight: '1.43',
    //     //                     letterSpacing: '0.01071em',
    //     //                     display: 'flex',
    //     //                     padding: '3px 10px',
    //     //                     color: '#892a23',
    //     //                     backgroundColor: 'rgb(243 174 174)',
    //     //                 }}>{"Week Off"}</Box>
    //     //         )
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
    //                 return (
    //                     !isWeekOff ?
    //                         <Box sx={{
    //                             textTransform: 'capitalize',
    //                             borderRadius: '4px',
    //                             boxShadow: 'none',
    //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                             fontWeight: '400',
    //                             fontSize: '0.675rem',
    //                             lineHeight: '1.43',
    //                             letterSpacing: '0.01071em',
    //                             display: 'flex',
    //                             padding: '3px 8px',
    //                             color: '#183e5d',
    //                             backgroundColor: 'rgb(166 210 245)',
    //                         }}>{relevantLogEntry.shifttiming}</Box>
    //                         :
    //                         <Box sx={{
    //                             textTransform: 'capitalize',
    //                             borderRadius: '4px',
    //                             boxShadow: 'none',
    //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                             fontWeight: '400',
    //                             fontSize: '0.675rem',
    //                             lineHeight: '1.43',
    //                             letterSpacing: '0.01071em',
    //                             display: 'flex',
    //                             padding: '3px 10px',
    //                             color: '#892a23',
    //                             backgroundColor: 'rgb(243 174 174)',
    //                         }}>{"Week Off"}</Box>
    //                 )
    //             }

    //             // 1 Week Rotation 2nd try working code
    //             if (relevantLogEntry.shifttype === '1 Week Rotation') {
    //                 for (const data of relevantLogEntry.todo) {
    //                     const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
    //                     if (data.week === columnWeek && data.day === column.dayName) {
    //                         return (
    //                             data.shiftmode === 'Shift' ?
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 8px',
    //                                     color: '#183e5d',
    //                                     backgroundColor: 'rgb(166 210 245)',
    //                                 }}>{data.shifttiming}</Box>
    //                                 :
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 10px',
    //                                     color: '#892a23',
    //                                     backgroundColor: 'rgb(243 174 174)',
    //                                 }}>{"Week Off"}</Box>
    //                         )
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
    //                         return (
    //                             data.shiftmode === 'Shift' ?
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 8px',
    //                                     color: '#183e5d',
    //                                     backgroundColor: 'rgb(166 210 245)',
    //                                 }}>{data.shifttiming}</Box>
    //                                 :
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 10px',
    //                                     color: '#892a23',
    //                                     backgroundColor: 'rgb(243 174 174)',
    //                                 }}>{"Week Off"}</Box>
    //                         )
    //                     }
    //                 }
    //             }

    //             // 1 Month Rotation 1st try working code
    //             if (relevantLogEntry.shifttype === '1 Month Rotation') {
    //                 for (const data of relevantLogEntry.todo) {
    //                     if (data.week === column.weekNumberInMonth && data.day === column.dayName) {
    //                         return (
    //                             data.shiftmode === 'Shift' ?
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 8px',
    //                                     color: '#183e5d',
    //                                     backgroundColor: 'rgb(166 210 245)',
    //                                 }}>{data.shifttiming}</Box>
    //                                 :
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 10px',
    //                                     color: '#892a23',
    //                                     backgroundColor: 'rgb(243 174 174)',
    //                                 }}>{"Week Off"}</Box>
    //                         )
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
    //             //             return (
    //             //                 data.shiftmode === 'Shift' ?
    //             //                     <Box sx={{
    //             //                         textTransform: 'capitalize',
    //             //                         borderRadius: '4px',
    //             //                         boxShadow: 'none',
    //             //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //             //                         fontWeight: '400',
    //             //                         fontSize: '0.675rem',
    //             //                         lineHeight: '1.43',
    //             //                         letterSpacing: '0.01071em',
    //             //                         display: 'flex',
    //             //                         padding: '3px 8px',
    //             //                         color: '#183e5d',
    //             //                         backgroundColor: 'rgb(166 210 245)',
    //             //                     }}>{data.shifttiming}</Box>
    //             //                     :
    //             //                     <Box sx={{
    //             //                         textTransform: 'capitalize',
    //             //                         borderRadius: '4px',
    //             //                         boxShadow: 'none',
    //             //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //             //                         fontWeight: '400',
    //             //                         fontSize: '0.675rem',
    //             //                         lineHeight: '1.43',
    //             //                         letterSpacing: '0.01071em',
    //             //                         display: 'flex',
    //             //                         padding: '3px 10px',
    //             //                         color: '#892a23',
    //             //                         backgroundColor: 'rgb(243 174 174)',
    //             //                     }}>{"Week Off"}</Box>
    //             //             )
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
    //                         return (
    //                             data.shiftmode === 'Shift' ?
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 8px',
    //                                     color: '#183e5d',
    //                                     backgroundColor: 'rgb(166 210 245)',
    //                                 }}>{data.shifttiming}</Box>
    //                                 :
    //                                 <Box sx={{
    //                                     textTransform: 'capitalize',
    //                                     borderRadius: '4px',
    //                                     boxShadow: 'none',
    //                                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                                     fontWeight: '400',
    //                                     fontSize: '0.675rem',
    //                                     lineHeight: '1.43',
    //                                     letterSpacing: '0.01071em',
    //                                     display: 'flex',
    //                                     padding: '3px 10px',
    //                                     color: '#892a23',
    //                                     backgroundColor: 'rgb(243 174 174)',
    //                                 }}>{"Week Off"}</Box>
    //                         )
    //                     }
    //                 }
    //             }

    //         }
    //         else {
    //             // If no date satisfies the condition, return shifttiming
    //             return (
    //                 !isWeekOff ?
    //                     <Box sx={{
    //                         textTransform: 'capitalize',
    //                         borderRadius: '4px',
    //                         boxShadow: 'none',
    //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                         fontWeight: '400',
    //                         fontSize: '0.675rem',
    //                         lineHeight: '1.43',
    //                         letterSpacing: '0.01071em',
    //                         display: 'flex',
    //                         padding: '3px 8px',
    //                         color: '#183e5d',
    //                         backgroundColor: 'rgb(166 210 245)',
    //                     }}>{shifttiming}</Box>
    //                     :
    //                     <Box sx={{
    //                         textTransform: 'capitalize',
    //                         borderRadius: '4px',
    //                         boxShadow: 'none',
    //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                         fontWeight: '400',
    //                         fontSize: '0.675rem',
    //                         lineHeight: '1.43',
    //                         letterSpacing: '0.01071em',
    //                         display: 'flex',
    //                         padding: '3px 10px',
    //                         color: '#892a23',
    //                         backgroundColor: 'rgb(243 174 174)',
    //                     }}>{"Week Off"}</Box>
    //             )
    //         }
    //     }
    //     else {
    //         // If no date satisfies the condition, return shifttiming
    //         return (
    //             !isWeekOff ?
    //                 <Box sx={{
    //                     textTransform: 'capitalize',
    //                     borderRadius: '4px',
    //                     boxShadow: 'none',
    //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                     fontWeight: '400',
    //                     fontSize: '0.675rem',
    //                     lineHeight: '1.43',
    //                     letterSpacing: '0.01071em',
    //                     display: 'flex',
    //                     padding: '3px 8px',
    //                     color: '#183e5d',
    //                     backgroundColor: 'rgb(166 210 245)',
    //                 }}>{shifttiming}</Box>
    //                 :
    //                 <Box sx={{
    //                     textTransform: 'capitalize',
    //                     borderRadius: '4px',
    //                     boxShadow: 'none',
    //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
    //                     fontWeight: '400',
    //                     fontSize: '0.675rem',
    //                     lineHeight: '1.43',
    //                     letterSpacing: '0.01071em',
    //                     display: 'flex',
    //                     padding: '3px 10px',
    //                     color: '#892a23',
    //                     backgroundColor: 'rgb(243 174 174)',
    //                 }}>{"Week Off"}</Box>
    //         )

    //     }
    // };

    // const getShiftForDateFinalCSV = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, shifttiming, boardingLog, isWeekOff, matchingDoubleShiftItem) => {

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
    //     //     return isWeekOffWithAdjustment ? matchingItem.adjtypeshifttime !== "" ? `Adjusted (${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]})` : `Adjusted (${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]})`
    //     //         : matchingItem.adjtypeshifttime !== "" ? `Adjusted (${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]})` : `Adjusted (${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]})`;
    //     // }
    //     else if (matchingItem && matchingItem.adjstatus === 'Approved') {
    //         return (matchingItem.adjustmenttype === "Add On Shift" || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
    //             (`Main Shift : ${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}
    //             ${matchingItem.secondmode} : ${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`
    //             ) :
    //             (isWeekOffWithAdjustment ? (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`));

    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === 'Manual') {
    //         return `Manual (${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]})`;
    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === 'Week Off') {
    //         return 'Week Off';
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
    //     //     //         return !isWeekOff ? shifttiming : "Week Off";

    //     //     //     } else {
    //     //     //         return !isWeekOff ? recentShiftTiming : "Week Off";
    //     //     //     }
    //     //     // });

    //     //     const shifts = daysArray?.map((currentColumn) => {
    //     //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
    //     //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
    //     //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
    //     //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);

    //     //         if (shiftFormattedDate >= columnFormattedDate) {
    //     //             return !isWeekOff ? shifttiming : "Week Off";
    //     //         } else {
    //     //             return !isWeekOff ? recentShiftTiming : "Week Off";
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
    //     //         return !isWeekOff ? shifttiming : "Week Off";
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
    //             // If no date satisfies the condition, return shifttiming
    //             return !isWeekOff ? shifttiming : "Week Off";
    //         }
    //     }
    //     else {
    //         // If no date satisfies the condition, return shifttiming
    //         return !isWeekOff ? shifttiming : "Week Off";
    //     }
    // };

    const getShiftForDateFinal = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department) => {

        if (matchingItem && matchingItem?.adjstatus === 'Adjustment') {
            return (
                <Box sx={{
                    textTransform: 'capitalize',
                    borderRadius: '4px',
                    boxShadow: 'none',
                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                    fontWeight: '400',
                    fontSize: '0.675rem',
                    lineHeight: '1.43',
                    letterSpacing: '0.01071em',
                    display: 'flex',
                    padding: '3px 10px',
                    color: 'white',
                    backgroundColor: 'red',
                }}>{"Pending..."}</Box>
            );
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Weekoff Swap') {
            return (
                <Box sx={{
                    '& .MuiBadge-badge': {
                        right: '5px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                    }
                }}>
                    <Badge color="success" badgeContent={"Adjusted"}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                    >
                        <Box sx={{
                            textTransform: 'capitalize',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                            fontWeight: '400',
                            fontSize: '0.675rem',
                            lineHeight: '1.43',
                            letterSpacing: '0.01071em',
                            display: 'flex',
                            padding: '3px 8px',
                            color: '#052106',
                            backgroundColor: 'rgb(156 239 156)',
                        }}>
                            {matchingDoubleShiftItem.todateshiftmode}
                        </Box>
                    </Badge>
                </Box>
            )
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'WeekOff Adjustment') {
            return (
                <Box sx={{
                    '& .MuiBadge-badge': {
                        right: '5px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                    }
                }}>
                    <Badge color="success" badgeContent={"Adjusted"}
                        anchorOrigin={{
                            vertical: 'top', horizontal: 'right',
                        }}
                    >
                        <Box sx={{
                            textTransform: 'capitalize',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                            fontWeight: '400',
                            fontSize: '0.675rem',
                            lineHeight: '1.43',
                            letterSpacing: '0.01071em',
                            display: 'flex',
                            padding: '3px 8px',
                            color: '#052106',
                            backgroundColor: 'rgb(156 239 156)',
                        }}>
                            {matchingDoubleShiftItem.todateshiftmode}
                        </Box>
                    </Badge>
                </Box>
            )
        }
        else if (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment') {
            return '';
        }
        // else if (matchingItem && matchingItem.adjstatus === 'Approved') {
        //     return (
        //         isWeekOffWithAdjustment ?
        //             <>
        //                 <Box sx={{
        //                     '& .MuiBadge-badge': {
        //                         right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
        //                     }
        //                 }}>
        //                     <Badge color="success" badgeContent={"Adjusted"}
        //                         anchorOrigin={{
        //                             vertical: 'top', horizontal: 'right',
        //                         }}
        //                     >
        //                         <Box sx={{
        //                             textTransform: 'capitalize',
        //                             borderRadius: '4px',
        //                             boxShadow: 'none',
        //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                             fontWeight: '400',
        //                             fontSize: '0.675rem',
        //                             lineHeight: '1.43',
        //                             letterSpacing: '0.01071em',
        //                             display: 'flex',
        //                             padding: '3px 8px',
        //                             color: '#052106',
        //                             backgroundColor: 'rgb(156 239 156)',
        //                         }}>
        //                             {matchingItem.adjtypeshifttime !== "" ? `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` : (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off')}
        //                         </Box>
        //                     </Badge>
        //                 </Box>
        //             </>
        //             :
        //             <>
        //                 <Box sx={{
        //                     '& .MuiBadge-badge': {
        //                         right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
        //                     }
        //                 }}>
        //                     <Badge color="success" badgeContent={"Adjusted"}
        //                         anchorOrigin={{
        //                             vertical: 'top', horizontal: 'right',
        //                         }}
        //                     >
        //                         <Box sx={{
        //                             textTransform: 'capitalize',
        //                             borderRadius: '4px',
        //                             boxShadow: 'none',
        //                             fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                             fontWeight: '400',
        //                             fontSize: '0.675rem',
        //                             lineHeight: '1.43',
        //                             letterSpacing: '0.01071em',
        //                             display: 'flex',
        //                             padding: '3px 8px',
        //                             color: '#052106',
        //                             backgroundColor: 'rgb(156 239 156)',
        //                         }}>
        //                             {matchingItem.adjtypeshifttime !== "" ? `${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]}` : (matchingItem.adjchangeshiftime !== "" ? `${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}` : 'Week Off')}
        //                         </Box>
        //                     </Badge>
        //                 </Box>
        //             </>
        //     )
        // }
        else if (matchingItem && matchingItem.adjstatus === 'Approved') {
            return (matchingItem.adjustmenttype === "Add On Shift" || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
                (
                    <>
                        <Box sx={{
                            '& .MuiBadge-badge': {
                                right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
                            }
                        }}> <b>Main Shift :</b><br />
                            <Badge color="success" badgeContent={"Adjusted"}
                                anchorOrigin={{
                                    vertical: 'top', horizontal: 'right',
                                }}
                            >
                                <Box sx={{
                                    textTransform: 'capitalize',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                    fontWeight: '400',
                                    fontSize: '0.575rem',
                                    lineHeight: '1.2',
                                    letterSpacing: '0.01071em',
                                    display: 'flex',
                                    padding: '3px 8px',
                                    color: '#052106',
                                    backgroundColor: 'rgb(156 239 156)',
                                }}>
                                    {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
                                </Box>
                            </Badge>
                        </Box>
                        <Box sx={{
                            '& .MuiBadge-badge': {
                                right: '14px !important', top: "0px !important", fontSize: '0.375rem !important', height: '9px !important',
                            }
                        }}><b>{`${matchingItem.secondmode} :`}</b><br />
                            <Badge color="success" badgeContent={"Adjusted"}
                                anchorOrigin={{
                                    vertical: 'top', horizontal: 'right',
                                }}
                            >
                                <Box sx={{
                                    textTransform: 'capitalize',
                                    borderRadius: '4px',
                                    boxShadow: 'none',
                                    fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                    fontWeight: '400',
                                    fontSize: '0.575rem',
                                    lineHeight: '1.2',
                                    letterSpacing: '0.01071em',
                                    display: 'flex',
                                    padding: '3px 8px',
                                    color: '#052106',
                                    backgroundColor: 'rgb(156 239 156)',
                                }}>
                                    {`${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`}
                                </Box>
                            </Badge>
                        </Box>
                    </>
                ) :
                (
                    isWeekOffWithAdjustment ?
                        <>
                            <Box sx={{
                                '& .MuiBadge-badge': {
                                    right: '16px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                                }
                            }}>
                                <Badge color="success" badgeContent={"Adjusted"}
                                    anchorOrigin={{
                                        vertical: 'top', horizontal: 'right',
                                    }}
                                >
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#052106',
                                        backgroundColor: 'rgb(156 239 156)',
                                    }}>
                                        {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
                                    </Box>
                                </Badge>
                            </Box>
                        </>
                        :
                        <>
                            <Box sx={{
                                '& .MuiBadge-badge': {
                                    right: '16px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                                }
                            }}>
                                <Badge color="success" badgeContent={"Adjusted"}
                                    anchorOrigin={{
                                        vertical: 'top', horizontal: 'right',
                                    }}
                                >
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#052106',
                                        backgroundColor: 'rgb(156 239 156)',
                                    }}>
                                        {`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`}
                                    </Box>
                                </Badge>
                            </Box>

                        </>
                )
        }
        else if (matchingItemAllot && matchingItemAllot.status === 'Manual') {
            return (
                isWeekOffWithManual ?
                    <Box sx={{
                        '& .MuiBadge-badge': {
                            right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                        }
                    }}>
                        <Badge color="warning" badgeContent={"Manual"}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                        >
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                color: '#052106',
                                backgroundColor: 'rgb(243 203 117)',
                            }}>
                                {`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`}
                            </Box>
                        </Badge>
                    </Box>
                    :
                    <Box sx={{
                        '& .MuiBadge-badge': {
                            right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                        }
                    }}>
                        <Badge color="warning" badgeContent={"Manual"}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                        >
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                color: '#052106',
                                backgroundColor: 'rgb(243 203 117)',
                            }}>
                                {`${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]}`}
                            </Box>
                        </Badge>
                    </Box>
            )
        }
        else if (matchingItemAllot && matchingItemAllot.status === 'Week Off') {
            return (
                <Box sx={{
                    '& .MuiBadge-badge': {
                        right: '11px !important', top: "0px !important", fontSize: '0.5rem !important', height: '13px !important',
                    }
                }}>
                    <Badge color="warning" badgeContent={"Manual"}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                    >
                        <Box sx={{
                            textTransform: 'capitalize',
                            borderRadius: '4px',
                            boxShadow: 'none',
                            fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                            fontWeight: '400',
                            fontSize: '0.675rem',
                            lineHeight: '1.43',
                            letterSpacing: '0.01071em',
                            display: 'flex',
                            padding: '3px 8px',
                            color: '#052106',
                            backgroundColor: 'rgb(243 203 117)',
                        }}>{"Week Off"}</Box>
                    </Badge>
                </Box>
            );
        }

        // else if (boardingLog.length > 0) {
        //     if (!recentShiftTimingDate) {
        //         return '';
        //     }

        //     const [year, month, day] = recentShiftTimingDate?.split('-');


        //     // Map through each column and compare dates
        //     const shifts = daysArray.map((currentColumn) => {

        //         // const [day1, month1, year1] = currentColumn.formattedDate?.split('/');
        //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
        //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
        //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
        //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);
        //         // if (year >= year1 && month >= month1 && day > day1) {
        //         if (shiftFormattedDate >= columnFormattedDate) {
        //             return (
        //                 !isWeekOff ?
        //                     <Box sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.675rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: '3px 8px',
        //                         color: '#183e5d',
        //                         backgroundColor: 'rgb(166 210 245)',
        //                     }}>{shifttiming}</Box>
        //                     :
        //                     <Box sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.675rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: '3px 10px',
        //                         color: '#892a23',
        //                         backgroundColor: 'rgb(243 174 174)',
        //                     }}>{"Week Off"}</Box>
        //             )
        //         } else {
        //             return (
        //                 !isWeekOff ?
        //                     <Box sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.675rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: '3px 8px',
        //                         color: '#183e5d',
        //                         backgroundColor: 'rgb(166 210 245)',
        //                     }}>{recentShiftTiming}</Box>
        //                     :
        //                     <Box sx={{
        //                         textTransform: 'capitalize',
        //                         borderRadius: '4px',
        //                         boxShadow: 'none',
        //                         fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                         fontWeight: '400',
        //                         fontSize: '0.675rem',
        //                         lineHeight: '1.43',
        //                         letterSpacing: '0.01071em',
        //                         display: 'flex',
        //                         padding: '3px 10px',
        //                         color: '#892a23',
        //                         backgroundColor: 'rgb(243 174 174)',
        //                     }}>{"Week Off"}</Box>
        //             )
        //         }
        //     });

        //     // Return the shift value for the current column
        //     return shifts[column.dayCount - 1];
        // } 
        // before add shifttype condition working code
        // else if (boardingLog?.length > 0) {
        //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
        //     const finalDate = `${columnYear}-${columnMonth}-${columnDay}`;

        //     // Filter boardingLog entries for the same start date
        //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

        //     // If there are entries for the date, return the shift timing of the second entry
        //     if (entriesForDate.length > 1) {
        //         return (
        //             <Box sx={{
        //                 textTransform: 'capitalize',
        //                 borderRadius: '4px',
        //                 boxShadow: 'none',
        //                 fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                 fontWeight: '400',
        //                 fontSize: '0.675rem',
        //                 lineHeight: '1.43',
        //                 letterSpacing: '0.01071em',
        //                 display: 'flex',
        //                 padding: '3px 8px',
        //                 color: '#183e5d',
        //                 backgroundColor: 'rgb(166 210 245)',
        //             }}>{entriesForDate[1].shifttiming}</Box>
        //         )
        //     }

        //     // Find the most recent boarding log entry that is less than or equal to the selected date
        //     const recentLogEntry = boardingLog
        //         .filter(log => log.startdate < finalDate)
        //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

        //     // If a recent log entry is found, return its shift timing
        //     if (recentLogEntry) {
        //         return (
        //             !isWeekOff ?
        //                 <Box sx={{
        //                     textTransform: 'capitalize',
        //                     borderRadius: '4px',
        //                     boxShadow: 'none',
        //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                     fontWeight: '400',
        //                     fontSize: '0.675rem',
        //                     lineHeight: '1.43',
        //                     letterSpacing: '0.01071em',
        //                     display: 'flex',
        //                     padding: '3px 8px',
        //                     color: '#183e5d',
        //                     backgroundColor: 'rgb(166 210 245)',
        //                 }}>{recentLogEntry.shifttiming}</Box>
        //                 :
        //                 <Box sx={{
        //                     textTransform: 'capitalize',
        //                     borderRadius: '4px',
        //                     boxShadow: 'none',
        //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                     fontWeight: '400',
        //                     fontSize: '0.675rem',
        //                     lineHeight: '1.43',
        //                     letterSpacing: '0.01071em',
        //                     display: 'flex',
        //                     padding: '3px 10px',
        //                     color: '#892a23',
        //                     backgroundColor: 'rgb(243 174 174)',
        //                 }}>{"Week Off"}</Box>
        //         )
        //     } else {
        //         return (
        //             !isWeekOff ?
        //                 <Box sx={{
        //                     textTransform: 'capitalize',
        //                     borderRadius: '4px',
        //                     boxShadow: 'none',
        //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                     fontWeight: '400',
        //                     fontSize: '0.675rem',
        //                     lineHeight: '1.43',
        //                     letterSpacing: '0.01071em',
        //                     display: 'flex',
        //                     padding: '3px 8px',
        //                     color: '#183e5d',
        //                     backgroundColor: 'rgb(166 210 245)',
        //                 }}>{shifttiming}</Box>
        //                 :
        //                 <Box sx={{
        //                     textTransform: 'capitalize',
        //                     borderRadius: '4px',
        //                     boxShadow: 'none',
        //                     fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
        //                     fontWeight: '400',
        //                     fontSize: '0.675rem',
        //                     lineHeight: '1.43',
        //                     letterSpacing: '0.01071em',
        //                     display: 'flex',
        //                     padding: '3px 10px',
        //                     color: '#892a23',
        //                     backgroundColor: 'rgb(243 174 174)',
        //                 }}>{"Week Off"}</Box>
        //         )
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
                    return (
                        !logWeekOff ?
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 8px',
                                color: '#183e5d',
                                backgroundColor: 'rgb(166 210 245)',
                            }}>{relevantLogEntry.shifttiming}</Box>
                            :
                            <Box sx={{
                                textTransform: 'capitalize',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                fontWeight: '400',
                                fontSize: '0.675rem',
                                lineHeight: '1.43',
                                letterSpacing: '0.01071em',
                                display: 'flex',
                                padding: '3px 10px',
                                color: '#892a23',
                                backgroundColor: 'rgb(243 174 174)',
                            }}>{"Week Off"}</Box>
                    )
                }

                // 1 Week Rotation 2nd try working code
                if (relevantLogEntry.shifttype === 'Daily') {
                    for (const data of relevantLogEntry.todo) {
                        const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
                        if (data.week === columnWeek && data.day === column.dayName) {
                            return (
                                data.shiftmode === 'Shift' ?
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#183e5d',
                                        backgroundColor: 'rgb(166 210 245)',
                                    }}>{data.shifttiming}</Box>
                                    :
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 10px',
                                        color: '#892a23',
                                        backgroundColor: 'rgb(243 174 174)',
                                    }}>{"Week Off"}</Box>
                            )
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
                            return (
                                data.shiftmode === 'Shift' ?
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#183e5d',
                                        backgroundColor: 'rgb(166 210 245)',
                                    }}>{data.shifttiming}</Box>
                                    :
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 10px',
                                        color: '#892a23',
                                        backgroundColor: 'rgb(243 174 174)',
                                    }}>{"Week Off"}</Box>
                            )
                        }
                    }
                }

                // 1 Month Rotation 1st try working code
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
                            return (
                                data.shiftmode === 'Shift' ?
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#183e5d',
                                        backgroundColor: 'rgb(166 210 245)',
                                    }}>{data.shifttiming}</Box>
                                    :
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 10px',
                                        color: '#892a23',
                                        backgroundColor: 'rgb(243 174 174)',
                                    }}>{"Week Off"}</Box>
                            )
                        }
                    }
                }

                // 2 Month Rotation               
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
                        // Check if the adjusted week matches the column week and day
                        if (data.week === finalWeek && data.day === column.dayName) {
                            return (
                                data.shiftmode === 'Shift' ?
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 8px',
                                        color: '#183e5d',
                                        backgroundColor: 'rgb(166 210 245)',
                                    }}>{data.shifttiming}</Box>
                                    :
                                    <Box sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        fontFamily: 'Roboto,"Helvetica","Arial",sans-serif',
                                        fontWeight: '400',
                                        fontSize: '0.675rem',
                                        lineHeight: '1.43',
                                        letterSpacing: '0.01071em',
                                        display: 'flex',
                                        padding: '3px 10px',
                                        color: '#892a23',
                                        backgroundColor: 'rgb(243 174 174)',
                                    }}>{"Week Off"}</Box>
                            )
                        }
                    }
                }

            }
        }
    };

    // const getShiftForDateFinalCSV = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department) => {

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
    //     //     return isWeekOffWithAdjustment ? matchingItem.adjtypeshifttime !== "" ? `Adjusted (${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]})` : `Adjusted (${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]})`
    //     //         : matchingItem.adjtypeshifttime !== "" ? `Adjusted (${matchingItem.adjtypeshifttime.split(' - ')[0]}to${matchingItem.adjtypeshifttime.split(' - ')[1]})` : `Adjusted (${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]})`;
    //     // }
    //     else if (matchingItem && matchingItem.adjstatus === 'Approved') {
    //         return (matchingItem.adjustmenttype === "Add On Shift" || matchingItem.adjustmenttype === 'Shift Adjustment' || matchingItem.adjustmenttype === 'Shift Weekoff Swap') ?
    //             (`Main Shift : ${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}
    //             ${matchingItem.secondmode} : ${matchingItem.pluseshift.split(' - ')[0]}to${matchingItem.pluseshift.split(' - ')[1]}`
    //             ) :
    //             (isWeekOffWithAdjustment ? (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`) : (`${matchingItem.adjchangeshiftime.split(' - ')[0]}to${matchingItem.adjchangeshiftime.split(' - ')[1]}`));

    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === 'Manual') {
    //         return `Manual (${matchingItemAllot.firstshift.split(' - ')[0]}to${matchingItemAllot.firstshift.split(' - ')[1]})`;
    //     }
    //     else if (matchingItemAllot && matchingItemAllot.status === 'Week Off') {
    //         return 'Week Off';
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
    //     //     //         return !isWeekOff ? shifttiming : "Week Off";

    //     //     //     } else {
    //     //     //         return !isWeekOff ? recentShiftTiming : "Week Off";
    //     //     //     }
    //     //     // });

    //     //     const shifts = daysArray?.map((currentColumn) => {
    //     //         const [columnDay, columnMonth, columnYear] = currentColumn.formattedDate?.split('/');
    //     //         const columnFormattedDate = new Date(`${columnMonth}/${columnDay}/${columnYear}`);
    //     //         const [shiftYear, shiftMonth, shiftDay] = recentShiftTimingDate?.split('-');
    //     //         const shiftFormattedDate = new Date(`${shiftMonth}/${shiftDay}/${shiftYear}`);

    //     //         if (shiftFormattedDate >= columnFormattedDate) {
    //     //             return !isWeekOff ? shifttiming : "Week Off";
    //     //         } else {
    //     //             return !isWeekOff ? recentShiftTiming : "Week Off";
    //     //         }
    //     //     });

    //     //     // Return the shift value for the current column
    //     //     return shifts[column.dayCount - 1];
    //     // } 

    //     // before add shittype condition working code
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
    //     //         return !isWeekOff ? shifttiming : "Week Off";
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
    //             .filter(log => log.startdate <= finalDate)
    //             .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    //         const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName)

    //         if (relevantLogEntry) {

    //             // Daily
    //             if (relevantLogEntry.shifttype === 'Standard' || relevantLogEntry.shifttype === undefined) {
    //                 // If shift type is 'Daily', return the same shift timing for each day
    //                 //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
    //                 return !logWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
    //             }

    //             // 1 Week Rotation 2nd try working code
    //             if (relevantLogEntry.shifttype === 'Daily') {
    //                 for (const data of relevantLogEntry.todo) {
    //                     const columnWeek = (column.weekNumberInMonth === '2nd Week' ? '1st Week' : column.weekNumberInMonth === '3rd Week' ? '1st Week' : column.weekNumberInMonth === '4th Week' ? '1st Week' : column.weekNumberInMonth === '5th Week' ? '1st Week' : '1st Week');
    //                     if (data.week === columnWeek && data.day === column.dayName) {
    //                         return data.shiftmode === 'Shift' ? data.shifttiming : 'Week Off';
    //                     }
    //                 }
    //             }

    //             // 2 Week Rotation 2nd try working code  
    //             if (relevantLogEntry.shifttype === '1 Week Rotation') {
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

    //             //just 2wk rotation
    //             if (relevantLogEntry.shifttype === '2 Week Rotation') {

    //                 // Find the matching department entry
    //                 const matchingDepartment = overAllDepartment.find(
    //                     (dep) =>
    //                         dep.department === department &&
    //                         new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
    //                         new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
    //                 );

    //                 // Use the fromdate of the matching department as the startDate
    //                 let startDate = matchingDepartment
    //                     ? new Date(matchingDepartment.fromdate)
    //                     : new Date(relevantLogEntry.startdate);

    //                 // Calculate month lengths
    //                 const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //                 // Function to determine if a year is a leap year
    //                 const isLeapYear = (year) => {
    //                     return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    //                 };

    //                 const currentDate = new Date(finalDate);

    //                 // Determine the effective month for the start date
    //                 let effectiveMonth = startDate.getMonth();
    //                 if (startDate.getDate() > 15) {
    //                     // Consider the next month if the start date is after the 15th
    //                     effectiveMonth = (effectiveMonth + 1) % 12;
    //                 }

    //                 // Calculate total days for 1-month rotation based on the effective month
    //                 let totalDays = monthLengths[effectiveMonth];

    //                 // Set the initial endDate by adding totalDays to the startDate
    //                 let endDate = new Date(startDate);
    //                 endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

    //                 // Adjust February for leap years
    //                 if (isLeapYear(endDate.getFullYear())) {
    //                     monthLengths[1] = 29;
    //                 }

    //                 // Adjust startDate and endDate if the currentDate is beyond the initial endDate
    //                 while (currentDate > endDate) {
    //                     // Set startDate to the next matchingDepartment.fromdate for each cycle
    //                     startDate = new Date(endDate);
    //                     startDate.setDate(startDate.getDate() + 1); // Move to the next day

    //                     // Determine the new effective month for the next cycle
    //                     effectiveMonth = startDate.getMonth();
    //                     if (startDate.getDate() > 15) {
    //                         effectiveMonth = (effectiveMonth + 1) % 12;
    //                     }

    //                     totalDays = monthLengths[effectiveMonth];

    //                     // Set the new endDate by adding totalDays to the new startDate
    //                     endDate = new Date(startDate);
    //                     endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

    //                     // Adjust February for leap years
    //                     if (isLeapYear(endDate.getFullYear())) {
    //                         monthLengths[1] = 29;
    //                     }
    //                 }

    //                 // Calculate the difference in days correctly
    //                 const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    //                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

    //                 // Determine the start day of the first week
    //                 let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    //                 // Adjust the start day so that Monday is considered the start of the week
    //                 let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    //                 // Calculate the week number based on Monday to Sunday cycle
    //                 let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day                                      

    //                 // Calculate the week number within the rotation month based on 7-day intervals from start date
    //                 // const weekNumber = Math.ceil(diffDays / 7);
    //                 let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

    //                 const weekNames = [
    //                     "1st Week",
    //                     "2nd Week",
    //                     "3rd Week",
    //                     "4th Week",
    //                     "5th Week",
    //                     "6th Week",
    //                     // "7th Week",
    //                     // "8th Week",
    //                     // "9th Week",
    //                 ];
    //                 const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

    //                 // console.log({
    //                 //     startDate,
    //                 //     currentDate,
    //                 //     endDate,
    //                 //     diffTime,
    //                 //     diffDays,
    //                 //     weekNumber,
    //                 //     finalWeek,
    //                 // });

    //                 for (const data of relevantLogEntry.todo) {
    //                     if (data.week === finalWeek && data.day === column.dayName) {
    //                         return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
    //                     }
    //                 }
    //             }

    //             //just 1mont rota             
    //             if (relevantLogEntry.shifttype === '1 Month Rotation') {
    //                 // Find the matching department entry
    //                 const matchingDepartment = overAllDepartment.find(
    //                     (dep) =>
    //                         dep.department === department &&
    //                         new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) &&
    //                         new Date(relevantLogEntry.startdate) <= new Date(dep.todate)
    //                 );

    //                 // Use the fromdate of the matching department as the startDate
    //                 let startDate = matchingDepartment
    //                     ? new Date(matchingDepartment.fromdate)
    //                     : new Date(relevantLogEntry.startdate);

    //                 const currentDate = new Date(finalDate);

    //                 // Calculate month lengths
    //                 const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //                 // Function to determine if a year is a leap year
    //                 const isLeapYear = (year) => {
    //                     return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    //                 };

    //                 // Determine the effective month for the start date
    //                 let effectiveMonth = startDate.getMonth();
    //                 if (startDate.getDate() > 15) {
    //                     // Consider the next month if the start date is after the 15th
    //                     effectiveMonth = (effectiveMonth + 1) % 12;
    //                 }

    //                 let totalDays = 0;

    //                 // Calculate total days for 2-month rotation based on the effective month
    //                 for (let i = 0; i < 2; i++) {
    //                     const monthIndex = (effectiveMonth + i) % 12;
    //                     totalDays += monthLengths[monthIndex];
    //                 }

    //                 // Set the initial endDate by adding totalDays to the startDate
    //                 let endDate = new Date(startDate);
    //                 endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

    //                 // Adjust February for leap years
    //                 if (isLeapYear(endDate.getFullYear())) {
    //                     monthLengths[1] = 29;
    //                 }

    //                 // Adjust startDate and endDate if the currentDate is beyond the initial endDate
    //                 while (currentDate > endDate) {
    //                     startDate = new Date(endDate);
    //                     startDate.setDate(startDate.getDate() + 1); // Move to the next day

    //                     // Determine the new effective month for the next cycle
    //                     effectiveMonth = startDate.getMonth();
    //                     if (startDate.getDate() > 15) {
    //                         effectiveMonth = (effectiveMonth + 1) % 12;
    //                     }

    //                     totalDays = 0;
    //                     for (let i = 0; i < 2; i++) {
    //                         const monthIndex = (effectiveMonth + i) % 12;
    //                         totalDays += monthLengths[monthIndex];
    //                     }

    //                     // Set the new endDate by adding totalDays to the new startDate
    //                     endDate = new Date(startDate);
    //                     endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

    //                     // Adjust February for leap years
    //                     if (isLeapYear(endDate.getFullYear())) {
    //                         monthLengths[1] = 29;
    //                     }
    //                 }

    //                 // Calculate the difference in days including the start date
    //                 const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    //                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

    //                 // Determine the start day of the first week
    //                 let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    //                 // Adjust the start day so that Monday is considered the start of the week
    //                 let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    //                 // Calculate the week number based on Monday to Sunday cycle
    //                 let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
    //                 let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

    //                 // Define week names for first and second month of the cycle
    //                 const weekNamesFirstMonth = [
    //                     "1st Week",
    //                     "2nd Week",
    //                     "3rd Week",
    //                     "4th Week",
    //                     "5th Week",
    //                     "6th Week"
    //                 ];

    //                 const weekNamesSecondMonth = [
    //                     "7th Week",
    //                     "8th Week",
    //                     "9th Week",
    //                     "10th Week",
    //                     "11th Week",
    //                     "12th Week"
    //                 ];

    //                 // Determine which month we are in
    //                 const daysInFirstMonth = monthLengths[effectiveMonth];
    //                 let finalWeek;

    //                 if (diffDays <= daysInFirstMonth) {
    //                     // We're in the first month of the cycle
    //                     weekNumber = (weekNumber - 1) % weekNamesFirstMonth.length + 1;
    //                     finalWeek = weekNamesFirstMonth[weekNumber - 1];
    //                 } else {
    //                     // We're in the second month of the cycle
    //                     const daysInSecondMonth = totalDays - daysInFirstMonth;
    //                     const secondMonthDay = diffDays - daysInFirstMonth;

    //                     // Calculate week number based on Monday-Sunday for the second month
    //                     const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
    //                     const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
    //                     const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
    //                     const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

    //                     finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
    //                 }

    //                 // console.log({
    //                 //     startDate,
    //                 //     currentDate,
    //                 //     endDate,
    //                 //     diffTime,
    //                 //     diffDays,
    //                 //     weekNumber,
    //                 //     finalWeek,
    //                 // });

    //                 for (const data of relevantLogEntry.todo) {
    //                     if (data.week === finalWeek && data.day === column.dayName) {
    //                         return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     else {
    //         // // If no date satisfies the condition, return shifttiming
    //         // return !isWeekOff ? shifttiming : "Week Off";
    //     }
    // };

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
            const [formatday1, fromatmonth1, formatyear1] = column.formattedDate?.split('/');
            const formattedDateNew = new Date(`${formatyear1}-${fromatmonth1}-${formatday1}`);
            return {
                field: `${index + 1}`,
                headerName: `${column.formattedDate} ${column.dayName} Day${column.dayCount}`,
                hide: !columnVisibilityFinalAdj[`${column.formattedDate} ${column.dayName} Day${column.dayCount}`],
                flex: 0,
                width: 150,
                sortable: false,
                renderCell: (params) => {
                    const dayData = params.row.days?.find(day => day.date === column.formattedDate);
                    if (!dayData) {
                        return null; // or return a default component
                    }
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
                        return (
                            <Grid >
                                <Typography variant="body2" sx={{ fontSize: '9px', color: '#2E073F', fontWeight: 'bold' }}>
                                    {dayData?.depstatus}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                    {dayData?.shiftlabel}
                                </Typography>
                            </Grid>
                        )
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
            reasondate: item.reasondate,
            resonablestatus: item.resonablestatus,
            doj: item.doj,
            days: item.days,
            // days: daysArray.map((column, index) => {
            //     let filteredRowData = allUserDates.filter((val) => val.empcode == item.empcode);
            //     const matchingItem = filteredRowData.find(item => item.adjdate == column.formattedDate);
            //     const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) == column.formattedDate);
            //     const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
            //     const filterBoardingLog = item.boardingLog && item.boardingLog?.filter((item) => {
            //         // return item.logcreation === "user" || item.logcreation === "shift";
            //         return item;
            //     });

            //     // Check if the dayName is Sunday or Monday
            //     // const isWeekOff = item.weekoff?.includes(column.dayName);
            //     const isWeekOff = getWeekOffDay(column, filterBoardingLog, item.department) === "Week Off" ? true : false;
            //     const isWeekOffWithAdjustment = isWeekOff && matchingItem;
            //     const isWeekOffWithManual = isWeekOff && matchingItemAllot;

            //     return {
            //         adjstatus: matchingItem ?
            //             (matchingItem.adjstatus === "Reject" ?
            //                 (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //                     matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
            //                         (isWeekOffWithAdjustment ? 'Week Off' : 'Adjustment')) :
            //                 (matchingItem.adjstatus === "Approved" && matchingItem.adjustmenttype !== 'Shift Adjustment' ? 'Approved' :
            //                     (matchingItem.adjstatus === "Approved" && matchingItem.adjustmenttype === 'Shift Adjustment' ? matchingItem.secondmode :
            //                         (isWeekOffWithManual ? "Manual" : 'Adjustment')))) :
            //             (matchingItemAllot && matchingItemAllot.status === "Manual" ? 'Manual' :
            //                 matchingItemAllot && matchingItemAllot.status === "Week Off" ? 'Week Off' :
            //                     (isWeekOffWithManual ? "Manual" :
            //                         (isWeekOffWithAdjustment ? 'Adjustment' :
            //                             (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "Shift Weekoff Swap" ? 'Approved' :
            //                                 (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === "WeekOff Adjustment" ? 'Approved' :
            //                                     (matchingDoubleShiftItem && matchingDoubleShiftItem.adjstatus === 'Approved' && matchingDoubleShiftItem && matchingDoubleShiftItem.adjustmenttype === 'Shift Adjustment' ? '' :
            //                                         (isWeekOff ? 'Week Off' : 'Adjustment'))))))),
            //         shiftlabel: getShiftForDateFinal(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item.department),
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

    // // pdf.....
    // const downloadPdfSetTable = () => {
    //     const doc = new jsPDF({ orientation: "landscape" });
    //     doc.autoTable({
    //         theme: "grid",
    //         styles: { fontSize: 4, },
    //         width: 'max-content',
    //         html: '#shiftfinallistpdf'
    //     })
    //     doc.save("User Shift List.pdf");
    // };

    // const downloadPdfSetTable = () => {
    //     const doc = new jsPDF({ orientation: "landscape" });

    //     // Define the table headers
    //     const headers = ["S.No", "Emp Code", "Name", "Branch", "Unit", ...daysArray.map(column => `${column.formattedDate}\n${column.dayName} Day${column.dayCount}`),];

    //     // // Constructing data in the required format
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
    //     //         //         dayValue = matchingDay.adjtypeshifttime || "No Data";
    //     //         //     } else if (
    //     //         //         matchingDay2 &&
    //     //         //         (matchingDay2.adjstatus === undefined ||
    //     //         //             matchingDay2.adjstatus === "" ||
    //     //         //             matchingDay2.adjstatus === "Reject" ||
    //     //         //             matchingDay2.adjstatus === "Not Approved")
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
    //                 return getShiftForDateFinalCSV(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, row.shifttiming, row.boardingLog, isWeekOff, matchingDoubleShiftItem);
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

    //     doc.save("Shift Final List.pdf");
    // };

    // Excel
    const fileNameMyFinalAdj = "Shift Final List";
    const [fileFormatMyFinalAdj, setFormatMyFinalAdj] = useState('')
    const fileTypeMyFinalAdj = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionMyFinalAdj = fileFormatMyFinalAdj === "xl" ? '.xlsx' : '.csv';
    const exportToCSVMyFinalAdj = (csvData, fileNameMyFinalAdj) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileTypeMyFinalAdj });
        FileSaver.saveAs(data, fileNameMyFinalAdj + fileExtensionMyFinalAdj);
    }

    const handleExportXLMyFinalAdj = (isfilter) => {
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

        const extractTextFromReactElement = (element) => {
            if (element && element.props && element.props.children) {
                return element.props.children; // Assuming the text is within children
            }
            return element; // Return as is if not a React element
        };

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
                        const shiftLabel = extractTextFromReactElement(column.shiftlabel);
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${shiftLabel === undefined ? '' : shiftLabel}`
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
                    //     const filterBoardingLog = row.boardingLog?.filter((item) => {
                    //         // return item.logcreation === "user" || item.logcreation === "shift";
                    //         return item;
                    //     });
                    //     // const isWeekOff = row.weekoff?.includes(column.dayName);
                    //     const isWeekOff = getWeekOffDay(column, filterBoardingLog, row.department) === "Week Off" ? true : false;
                    //     // Check if it's a week off day and has an adjustment
                    //     const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                    //     const isWeekOffWithManual = isWeekOff && matchingItemAllot;
                    //     return getShiftForDateFinalCSV(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, row.department);
                    // }),
                    ...row.days.map((column, index) => {
                        const shiftLabel = extractTextFromReactElement(column.shiftlabel);
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${shiftLabel === undefined ? '' : shiftLabel}`
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
        exportToCSVMyFinalAdj(formattedData, fileNameMyFinalAdj);
        setIsFilterOpenMyFinalAdj(false);
    };

    // print...
    const componentRefSetTable = useRef();
    const handleprintMyFinalAdj = useReactToPrint({
        content: () => componentRefSetTable.current,
        documentTitle: "Shift Final List",
        pageStyle: "print",
    });

    const downloadPdfMyFinalAdj = (isfilter) => {
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

        const extractTextFromReactElement = (element) => {
            if (element && element.props && element.props.children) {
                return element.props.children; // Assuming the text is within children
            }
            return element; // Return as is if not a React element
        };

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
                        const shiftLabel = extractTextFromReactElement(column.shiftlabel);
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${shiftLabel === undefined ? '' : shiftLabel}`
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
                    // ...daysArray.map(column => {
                    //     let filteredRowData = allUserDates.filter(val => val.empcode === row.empcode);
                    //     const matchingItem = filteredRowData.find(item => item.adjdate === column.formattedDate);
                    //     const matchingItemAllot = filteredRowData.find(item => formatDate(item.date) === column.formattedDate);
                    //     const matchingDoubleShiftItem = filteredRowData.find(item => item.todate === column.formattedDate);
                    //     const filterBoardingLog = row.boardingLog?.filter((item) => {
                    //         // return item.logcreation === "user" || item.logcreation === "shift";
                    //         return item;
                    //     });
                    //     // const isWeekOff = row.weekoff?.includes(column.dayName);
                    //     const isWeekOff = getWeekOffDay(column, filterBoardingLog, row.department) === "Week Off" ? true : false;
                    //     // Check if it's a week off day and has an adjustment
                    //     const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                    //     const isWeekOffWithManual = isWeekOff && matchingItemAllot;
                    //     return getShiftForDateFinalCSV(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, row.department);
                    // }),
                    ...row.days.map((column, index) => {
                        const shiftLabel = extractTextFromReactElement(column.shiftlabel);
                        return `${column.depstatus === undefined ? '' : column.depstatus} ${shiftLabel === undefined ? '' : shiftLabel}`
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

        doc.save("Shift Final List.pdf");
    };

    // image
    const handleCaptureImageMyFinalAdj = () => {
        if (gridRefFinalAdj.current) {
            html2canvas(gridRefFinalAdj.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Shift Final List.png");
                });
            });
        }
    };

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Shift</Typography> <br />

            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lmyshiftroaster") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}

                        {/* <Grid container spacing={2}>
                            <Grid item md={3} sm={6} xs={12}>
                                <Typography>Select Month</Typography>
                                <FormControl fullWidth size="small">
                                    <Selects
                                        maxMenuHeight={200}
                                        value={isAttandance.months}
                                        placeholder={monthname}
                                        onChange={(e) => { setIsMonthYear({ ...isMonthyear, ismonth: e.value }) }}
                                        options={months}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12}>
                                <Typography> Select Year</Typography>
                                <FormControl fullWidth size="small">
                                    <Selects
                                        maxMenuHeight={200}
                                        value={isAttandance.getyear}
                                        placeholder={isMonthyear.isyear}
                                        onChange={(e) => { setIsMonthYear({ ...isMonthyear, isyear: e.value }) }}
                                        options={getyear}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid><br /><br /><br /> */}
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
                                        {/* <MenuItem value={allUsersShiftFinal?.length}>All</MenuItem> */}
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
                                                    table="shiftfinallistpdf"
                                                    filename="Shift Final List"
                                                    sheet="Sheet"
                                                    buttonText="Export To Excel"
                                                />
                                            </Button> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpenMyFinalAdj(true)
                                                setFormatMyFinalAdj("xl")
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
                                                            return getShiftForDateFinalCSV(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, row.shifttiming, row.boardingLog, isWeekOff, matchingDoubleShiftItem);
                                                        }),
                                                    ]),
                                                ]}
                                                filename="Shift Final List.csv"
                                            >
                                                <FaFileCsv />&ensp;Export To CSV
                                            </CSVLink> */}
                                            <Button onClick={(e) => {
                                                setIsFilterOpenMyFinalAdj(true)
                                                setFormatMyFinalAdj("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printmyshiftroaster") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprintMyFinalAdj}>
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
                                                    setIsPdfFilterOpenMyFinalAdj(true)
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
                        {!allFinalAdj ?
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

            {/* Print layout for Set Table */}
            <TableContainer component={Paper} sx={userStyle.printcls} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table" ref={componentRefSetTable} id="shiftfinallistpdf">
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
                                //             matchingDay2.adjstatus === "Not Approved")
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
                                                        <Typography variant="body2" sx={{ fontSize: '8px' }}>{column.depstatus === undefined ? '' : column.depstatus}</Typography>
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
                                                        <Typography variant="body2" sx={{ fontSize: '8px' }}>
                                                            {getShiftForDateFinal(column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, row.shifttiming, row.boardingLog, isWeekOff, matchingDoubleShiftItem)}
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

            <Dialog open={isFilterOpenMyFinalAdj} onClose={handleCloseFilterModMyFinalAdj} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFilterModMyFinalAdj}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {fileFormatMyFinalAdj === 'xl' ?
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
                            handleExportXLMyFinalAdj("filtered")
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button autoFocus variant="contained"
                        onClick={(e) => {
                            handleExportXLMyFinalAdj("overall")
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog open={isPdfFilterOpenMyFinalAdj} onClose={handleClosePdfFilterModMyFinalAdj} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModMyFinalAdj}
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
                            downloadPdfMyFinalAdj("filtered")
                            setIsPdfFilterOpenMyFinalAdj(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button variant="contained"
                        onClick={(e) => {
                            downloadPdfMyFinalAdj("overall")
                            setIsPdfFilterOpenMyFinalAdj(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>

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

export default MyShiftRoasterList;